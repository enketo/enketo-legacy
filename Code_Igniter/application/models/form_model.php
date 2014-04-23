<?php

/**
 * Copyright 2012 Martijn van de Rijdt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class Form_model extends CI_Model {
    
    private $file_path_to_jr2HTML5_XSL;
    private $file_path_to_jr2Data_XSL;
    private $formlist_sxe = NULL;
    private $manifest_sxe = NULL;
    private $server_url = NULL;
    private $form_id = NULL;
    private $info = array();
    private $credentials = NULL;
    private $requires_auth = NULL;
    private $form_xml_hash_prev = NULL;
    private $form_media_hash_prev = NULL;
    private $xsl_ver_prev = NULL;
    private $xsl_version;

    function __construct()
    {
        parent::__construct();
        $this->load->helper(array('http'));
        $this->load->library('openrosa'); 
        $this->file_path_to_jr2HTML5_XSL = APPPATH.'libraries/xslt/openrosa2html5form_php5.xsl'; 
        $this->file_path_to_jr2Data_XSL = APPPATH.'libraries/xslt/openrosa2xmlmodel.xsl';
        log_message('debug', 'Form Model Initialized');
    }

    function setup($server_url, $form_id=NULL, $credentials=NULL, $form_xml_hash_prev=NULL, $xsl_ver_prev=NULL, $form_media_hash_prev=NULL)
    {
        $this->server_url = $server_url;
        $this->form_id = $form_id;
        $this->form_xml_hash_prev = $form_xml_hash_prev;
        $this->xsl_ver_prev = $xsl_ver_prev;
        $this->form_media_hash_prev = $form_media_hash_prev;
        $this->credentials = $credentials;
        if (!empty($server_url)) {
            $this->formlist_sxe = $this->_get_formlist_sxe();
            if (!empty($form_id)) {
                $this->info = $this->_get_form_info();
            } if (!empty($this->info)) {
                $this->manifest_sxe = $this->_get_manifest_sxe();
                $this->info['media_hash'] = (!empty($this->manifest_sxe)) ? $this->_get_media_hash($this->manifest_sxe) : NULL;
            }
        }
        log_message('debug', 'form model setup done: '.json_encode($this->info));
    }

    function get_info()
    {
        return $this->info;
    }

    function requires_auth()
    {
        return ($this->requires_auth === TRUE);
    }

    function can_be_loaded_from_cache()
    {
        $c_unchanged = $this->_content_unchanged($this->form_xml_hash_prev); 
        $s_unchanged = $this->_stylesheets_unchanged($this->xsl_ver_prev);
        $m_unchanged = $this->_media_unchanged($this->form_media_hash_prev);
        return ($c_unchanged && $s_unchanged && $m_unchanged);
    }

    function is_listed(){
        //log_message('debug', 'info: '.json_encode($this->info));
        return (!empty($this->info));
    }

    function get_transform_result_obj()
    {
        $result = $this->get_transform_result_sxe();
        $title = $result->form->xpath('//h3[@id="form-title"]');

        $form = new stdClass();
        $form->title = (!empty($title[0])) ? $title[0] : '';
        $form->html = (!empty($result->form)) ? $result->form->asXML() : '';
        $form->default_instance = (!empty($result->model)) ? $result->model->asXML() : '';
        //a later version of PHP XSLST processor seems to output jr:template= instead of template=
        //$form->default_instance = str_replace(' jr:template=', ' template=', $form->default_instance);
        //$form->default_instance = str_replace(array("\r", "\r\n", "\n", "\t"), '', $form->default_instance);
        //$form->default_instance = preg_replace('/\/\>\s+\</', '/><', $form->default_instance);
        //the preg replacement below is very aggressive!... maybe too aggressive
        if (!empty($form->default_instance)) {
            $form->default_instance = preg_replace('/\>\s+\</', '><', $form->default_instance);
            $form->default_instance = json_encode($form->default_instance);
        }
        $form->theme = (!empty($result->form))? $this->_get_theme($result->form) : NULL;
        log_message('debug', 'theme extracted: '.$form->theme);
        $form->hash = $this->info['xml_hash'];
        $form->media_hash = $this->info['media_hash'];
        $form->xsl_version = (!empty($result->form)) ? $this->xsl_version : NULL;
        //log_message('debug', 'xsl version returned in transformation result: '.$this->xsl_version);
        return $form;
    }

    function get_transform_result_sxe($local_path = NULL)
    {
        //log_message('debug', 'Starting transform');
        $xsl_form = $this->_load_xml($this->file_path_to_jr2HTML5_XSL);
        $xsl_data = $this->_load_xml($this->file_path_to_jr2Data_XSL);
        $xml = $this->_load_xml($local_path);
        $result = new SimpleXMLElement('<root></root>');

        if ($xml['doc'] && $xsl_form['doc'] && $xsl_data['doc']) {
            $odk_result = $this->_odk_validate($xml['doc']);
            if ($odk_result['pass'] === TRUE) {
                //perform transformation to HTML5 form and get xslt messages
                $result = $this->_xslt_transform($xml['doc'], $xsl_form['doc'], 'form');
                //perform transformation to get instance
                $data = $this->_xslt_transform($xml['doc'], $xsl_data['doc'], 'model');
                //perform fixes
                $this->_fix_meta($data);
                $this->_fix_lang($result);
                $this->_fix_media_urls($this->manifest_sxe, $result);
                //easiest way to merge
                $model_str = $data->model->asXML();
                //remove jr: namespace (seems to cause issue with latest PHP libs)
                $model_str = str_replace(' jr:template=', ' template=', $model_str);
                $form_str = $result->form->asXML();
                $message_str = $result->xsltmessages->asXML();
                //$hash_str = '<hash>'.$hash.'</hash>';
                //$xsl_ver_str = '<xsl_version>'.$this->xsl_version.'</xsl_version>';
                $result = simplexml_load_string('<root>'.$model_str.$form_str.$message_str.'</root>');
            }
            $result = $this->_add_errors($odk_result['errors'], 'jrvalidationmessages', $result);       
        }   
        $result = $this->_add_errors($xml['errors'], 'xmlerrors', $result);
        $result = $this->_add_errors($xsl_form['errors'], 'xslformerrors', $result);
        $result = $this->_add_errors($xsl_data['errors'], 'xsldataerrors', $result);

        return $result;
    }

    function get_form_xml()
    {
        $xml = $this->_load_xml();
        return ($xml['doc']) ? $xml['doc'] : NULL;
    }

    function get_formlist_JSON($webform_urls = TRUE)
    {
        $result = array();
        $xforms_sxe = $this->formlist_sxe;
        //log_message('debug', 'formlist: '.json_encode($xforms_sxe));
        if($xforms_sxe) {   
            $this->load->model('Survey_model', '', TRUE);
            foreach ($xforms_sxe->xform as $form) { //xpath('/forms/form') as $form)
                $id = (string) $form->formID;
                $url_obj = ($webform_urls) 
                    ? $this->Survey_model->get_webform_url_if_launched($this->server_url, $id, array('type' => NULL))
                    : NULL;
                $result[] = array(
                    'form_id'   => $id,
                    'name'  => (string) $form->name, 
                    'title' => (string) $form->descriptionText,
                    'url'   => ($url_obj && !empty($url_obj['url'])) ? $url_obj['url'] : '',
                    'server_url'=> $this->server_url
                );
            }   
        }
        return $result;
    }

    private function _get_theme($form_sxe = NULL) 
    {
        if (!empty($form_sxe) && !empty($form_sxe['class'])) {
            $class = (string) $form_sxe['class'];
            preg_match('/^(.*\s)?theme-([^\s]+).*$/i', $class, $matches);
            if ( !empty( $matches[2] ) ) {
                return strtolower($matches[2]);
            }
        }
        return NULL;
    }

    private function _get_formlist_sxe()
    {
        $formlist_url = $this->_get_formlist_url($this->server_url);
        //log_message('debug', 'going to load formlist from '.$formlist_url);
        $full_list = $this->_load_xml($formlist_url);
        $formlist_sxe = ($full_list['doc']) ? simplexml_import_dom($full_list['doc']) : NULL;
        if (empty($formlist_sxe)) {
            log_message('error', 'failed to get formlist from '.$this->server_url);
        }
        return $formlist_sxe;
    }

    private function _get_manifest_sxe()
    {
        if(!empty($this->info['manifest'])) {
            $manifest = $this->_load_xml($this->info['manifest']);
            $manifest_sxe = ($manifest['doc']) ? simplexml_import_dom($manifest['doc']) : NULL;
            if (empty($manifest_sxe)) {
                log_message('error', 'failed to get formlist from '.$this->server_url);
            }
            return $manifest_sxe;
        }
        return NULL;
    }

    private function _get_form_info()
    {
        $info = array();
        if ($this->formlist_sxe && $this->form_id) {
            //rather inefficient but am trying to avoid using xpath() because of default namespace in xformslist
            foreach ($this->formlist_sxe->xform as $form) {
                if ($form->formID == $this->form_id) {
                    $info['xml'] = (!empty($form->downloadUrl)) ? (string) $form->downloadUrl : NULL;
                    $info['manifest'] = (isset($form->manifestUrl)) ? (string) $form->manifestUrl : NULL;
                    $info['xml_hash'] = (isset($form->hash)) ? (string) $form->hash : NULL;
                    return $info;
                }
            } if (empty($info['xml'])) {
                log_message('debug', 'Form with id: '.$this->form_id.' could not be found in formlist for '.$this->server_url);
            }
        }
        return NULL;
    }

    private function _get_formlist_url($server_url)
    {
        $server_url = ( strrpos($server_url, '/') == strlen($server_url)-1 ) ? $server_url : $server_url.'/';
        $list_url = $server_url.'formList';
        return $list_url;
    }

    //loads xml resource into DOMDocument object (default = $this->info['xml'])
    private function _load_xml($resource=NULL)
    {
        $success = NULL;
        $time_start = time();
        //log_message('debug', 'loading XML/XSL file with path:'.$resource);    
        if (!empty($resource) && file_exists($resource)) {
            $type = 'file';
        }
        else { //if  (url_exists($resource))
            $type = 'url';
            $resource = (!empty($resource)) ? $resource : $this->info['xml'];
        } 

        if (isset($type)) {
            //restore error handler to PHP to 'catch' libxml 'errors'
            restore_error_handler();
            libxml_use_internal_errors(true);
            //clear any previous errors
            libxml_clear_errors();
            //load the XML resource into a DOMDocument 
            $doc = new DOMDocument;
            if ($type === 'file') {
                $success = $doc->load($resource);
            } else {
                $response = $this->openrosa->request_resource($resource, $this->credentials);
                $success = $doc->loadXML($response['xml']);
                //log_message('debug', 'response statuscode: '.$response['status_code']);
                $this->requires_auth = ($response['status_code'] == 401) ? TRUE : $this->requires_auth;
                //log_message('debug', 'requires auth: '.$this->requires_auth);
            }
            $errors = libxml_get_errors();
            //empty errors
            libxml_clear_errors();
            //restore CI error handler
            set_error_handler('_exception_handler');
        
            if(!$success) {
                if (!empty($errors)) {
                    log_message('error', 'XML/XSL doc load errors: '.json_encode($errors));
                }
                //see if fatal errors occurred. Return FALSE for doc if one occurred
                //foreach ($errors as $error)// (array_search(LIBXML_ERR_FATAL, (array) $errors) === 'level')
                //{
                // if ($error->level === 3)
                //{ 
                return array('doc' => FALSE, 'errors' => $errors);
            }       
            //log_message('debug', 'loading xml from '.$type.' ('.$resource.') took '.(time()-$time_start).' seconds.');
            return array('doc' => $doc, 'errors' => $errors, 'type' => $type);              
        } else {
            log_message('error', 'could not find file');
            return FALSE;               
        }
    }
    
    //returns SimpleXML Object
    private function _xslt_transform($xml, $xsl, $name = '')
    {
        //log_message('debug', 'starting transformation');
        $result = new SimpleXMLElement('<root></root>');
        
        $proc = new XSLTProcessor;
        if (!$proc->hasExsltSupport()) {
            log_message('error', 'XSLT Processor at server has no EXSLT Support');
        } else { 
            $start = microtime(true);
            //restore error handler to PHP to 'catch' libxml 'errors'
            restore_error_handler();
            libxml_use_internal_errors(true);
            //clear any previous errors
            libxml_clear_errors();
            //import XSLT stylesheet
            $proc->importStyleSheet($xsl);
            //profile transformation (only turn on for development!)
            //$proc->setProfiling(APPPATH.'logs/XSLTprofiling_'.$name.'.txt');
            //transform
            $start_time = time();
            $output = $proc->transformToXML($xml);
            log_message('debug', 'xlst transformation time: '.(time() - $start_time).' seconds');
            $errors = libxml_get_errors();
            //empty errors
            libxml_clear_errors();
            //restore CI error handler
            set_error_handler('_exception_handler');
            
            if($output) {       
                $result = simplexml_load_string($output);
                //log_message('debug', 'form:'.$result->saveXML());         
            }
            array_push($errors, (object) array(
                'message' => 'XML to HTML transformation for '.$name.' took '.round((microtime(true) - $start), 2).' seconds',
                'level' => 0) ); 
            $errors = $this->_error_msg_process($errors);
            $result = $this->_add_errors($errors, 'xsltmessages', $result);         
        }       
        return $result;                     
    }       
    
    //adds libxml (or similar) errors from array to SimpleXML object root element
    //returns modified SimpleXML object
    private function _add_errors($errors, $el_name, $sxo)
    {
        if (is_array($errors)) {   
            $messages = $sxo->addChild($el_name);
            foreach ($errors as $error) {               
                //$msg = $this -> _msg_process($error);
                $message = $messages->addChild('message', $error -> message);
                if (isset($error -> level)) {
                    $message->addAttribute('level', $error -> level);
                } if (isset($error -> code)) {
                    $message->addAttribute('code', $error -> code);
                }                   
            }
        }
        return $sxo;
    }
    
        
    //processes an array of libxml errors and looks inside the message text to determine 'type'
    private function _error_msg_process($errors)
    {
        $type_ind = array(3 =>'FATAL ERROR', 0 => 'INFO', 1 => 'WARNING', 2 => 'ERROR', 10 =>'NO SUPPORT');
        $type = 'unknown';
        
        foreach ($errors as $error_obj) {
            foreach ($type_ind as $key => $ind) {
                $pos = stripos($error_obj->message, $ind);
                //if indicator string is found somewhere in the beginning
                if ($pos !== FALSE && $pos < 10) {
                    //all xslt messages are reported as level 2, so need to be adjusted
                    ($key === 10) ? $key = 1 : $key = $key ;
                    $level = $key;
                    $error_obj->message = trim(substr($error_obj->message, $pos+strlen($ind)+1));
                    break 1;
                }
            } if (isset($level)) {
                $error_obj -> level = $level;
            }
        }       
       return $errors;  
    }
     
    //validates javarosa form (replace in future with XML Schema solution)
    private function _odk_validate($xml)
    {    
        $errors = array((object) array('message' => 'This validation is yet not functional.', 'level' => 1));
        return array('pass' => TRUE, 'errors'=> $errors); //array('valid' => $valid, 'messages' => $messages);
    }
    
    private function _fix_meta(&$data)
    {
        //TODO: MOVE to XSLT ??
        $meta = NULL;
        $dataroot = NULL;
        //very awkward way to search for meta node
        foreach ($data->model->instance[0]->children() as $rootchild) {
            $dataroot = $rootchild;
            $meta = $dataroot->meta;
            break;
        }
        if (!$meta) {
            $meta = $dataroot->addChild('meta');
        }
        $instanceid = $meta->instanceID;
        if (!$instanceid) {
            $instanceid = $meta->addChild('instanceID');
        }
    }
    
    private function _fix_lang(&$result)
    {
        $langs = array();
        
        if ($result->xpath('/root/form/select[@id="form-languages"]/option')) {
            foreach ($result->xpath('/root/form/select[@id="form-languages"]/option') as $a) {
                //attribute not a string so needs casting
                $lang = (string) $a['value'];
                
                if (isset($lang) && strlen($lang)>1) {
                    $lang_mod = $this->_html5_lang($lang);
                    if ($lang !== $lang_mod['lang']) {
                        $a['value'] = $lang_mod['lang']; 
                        $langs[] = array('old_lang' => $lang, 'new_lang'=> $lang_mod['lang']); 
                    }                       
                }
            }   
        }
        //log_message('debug', 'content of langs array: '.json_encode($langs));
        $form_languages = $result->xpath('/root/form/select[@id="form-languages"]');
        $default_lang = '';
        if (isset($form_languages[0]['data-default-lang'])) {
            $default_lang = (string) ($form_languages[0]['data-default-lang']);
            //log_message('debug', 'default lang defined as: '.$default_lang);
        }
        //now iterate $langs array to replace all required lang attributes in $result       
        foreach ($langs as $lang_map) {
            //attribute can be changed through a foreach reference (but not node content can't :P)
            foreach($result->xpath('/root/form/descendant::*[@lang="'.$lang_map['old_lang'].'"]') as $el) {
                $el['lang'] = $lang_map['new_lang'];
            } if ($default_lang === $lang_map['old_lang']) {               
                //the data-default-lang attribute only occurs once 
                $form_languages[0]['data-default-lang'] = $lang_map['new_lang'];
            }               
        }
    }

    //function to replace media (img, video audio) urls with urls from the Xformsmanifest
    private function _fix_media_urls($manifest, &$result){
        if (isset($manifest) && $manifest !== FALSE) {
            foreach ($result->xpath('/root/form/descendant::*[@src]') as $el) {
                $src = (string) $el['src'];
                $el['src'] = '';
                foreach ( $manifest->mediaFile as $m ) {
                    if ($src == $m->filename) {
                        //log_message('debug', 'adding media url to html: '.$m->downloadUrl);
                        $el['src'] = $this->_to_local_media_url($m->downloadUrl);
                        break;
                    }
                }    
            }
            foreach ( $manifest->mediaFile as $m ) {
                if ($m->filename == 'form_logo.png') {
                    $logo = $result->form->section[0]->addChild('img');
                    //log_message('debug', 'adding media url to html: '.$m->downloadUrl);
                    $logo->addAttribute('src', $this->_to_local_media_url($m->downloadUrl));
                    $logo->addAttribute('alt', 'form logo');
                    break;
                }
            }
        }
    }

    private function _get_media_hash($manifest_sxe)
    {
        $hash_concat = '';
        if (!empty($manifest_sxe)) {
            foreach ($manifest_sxe->mediaFile as $file) {
                $hash_concat .= (string) $file->hash;
            }
        }
        $hash = (!empty($hash_concat)) ? md5($hash_concat) : NULL;
        return $hash;
    }

    private function _to_local_media_url($url)
    {
        $local_url = '/media/get/'.preg_replace(array('/(https?):\/\//', '/:/'), array('$1/', '%3A'), $url);

        //log_message('debug', 'turned '.$url.' into '.$local_url);
        return $local_url;
    }

    //create valid html5 lang attributes (and add language names) by performing a very basic search
    private function _html5_lang($lang)
    {
        $lang_name = $lang;
        
        if (strlen($lang) === 2) {
            //don't touch lang attribute itself but try to find language name
            $this->db->select('alpha2, name_en');
            $this->db->from('languages');
            $this->db->where('alpha2', $lang);
            $this->db->limit(1);
            $query = $this->db->get();
            
            if ($query->num_rows() > 0 ) {
                $row = $query->row();                       
                $lang_name = $this->_first_name($row->name_en);
            }
        } else if (strlen($lang) === 3) {
            $this->db->select('alpha2, name_en');
            $this->db->from('languages');
            $this->db->where('alpha3_bib', $lang);
            $this->db->or_where('alpha3_ter', $lang);
            $this->db->limit(1);
            $query = $this->db->get();
            
            if ($query->num_rows() > 0 ) {
                $row = $query->row();
                //log_message('debug', 'going to transform lang with 3 chars "'.$lang.'"..');
                $lang = $row->alpha2;
                $lang_name = $this->_first_name($row->name_en);
                //log_message('debug', '.. into lang "'.$lang.'" with name "'.$lang_name.'"');      
            }
        } else if (strlen($lang) > 3) {
            $query_str= 'SELECT `alpha2`, `name_en`'.
                        'FROM (`languages`) '.
                        'WHERE `alpha2` LIKE "__" AND `name_en` LIKE "%'.ucfirst(strtolower($lang)).'%" '.
                        'OR `alpha2` LIKE "__" AND `name_fr` LIKE "%'.strtolower($lang).'%" '.
                        'LIMIT 1';
            $query = $this->db->query($query_str);
            
            if ($query->num_rows() > 0 ) {
                $row = $query->row();                   
                //probably best to keep lang_name as it is (=$lang)
                $lang = $row->alpha2;               
            }               
        }
        $last_query = $this->db->last_query();
        //log_message('debug', 'db query: '.$last_query);
        return array('lang'=>$lang, 'lang_name'=>$lang_name);
    }
    
    //removes alternative options (separated by ';' in database)
    private function _first_name($names)
    {
        $names_arr = explode(";", $names);
        return trim($names_arr[0]);
    }    
    
    private function _get_properties($items)
    {  
        $this->db->select($items);
        $query = $this->db->get('properties', 1); 
        if ($query->num_rows() === 1) {
            $row = $query->row_array();
            return $row;
        } else {
            log_message('error', 'db query for '.implode(', ', $items)).' returned '.$query->num_rows().' results.';
            return NULL;   
        }
    }

    private function _update_properties($data)
    {
        $this->db->limit(1);
        $query = $this->db->update('properties', $data); 
        if ($this->db->affected_rows() > 0) {
            return TRUE;
        } else {
            log_message('error', 'database update on properties table failed for'.json_encode($data));
            return FALSE;   
        }
    }

    private function _content_unchanged($previous_hash)
    {
        $current_hash = $this->info['xml_hash'];
        $previous_hash = (string) $previous_hash;
        return (!empty($current_hash) && !empty($previous_hash) && $current_hash === $previous_hash);
    }

    private function _stylesheets_unchanged($xsl_ver_prev)
    {
        $last = $this->_get_properties(array('xsl_version', 'form_xsl_hash', 'model_xsl_hash'));
        $xsl_version = $last['xsl_version'];
        $form_xsl_hash_new = md5_file($this->file_path_to_jr2HTML5_XSL);
        $model_xsl_hash_new = md5_file($this->file_path_to_jr2Data_XSL);
        if($last['form_xsl_hash'] !== $form_xsl_hash_new || $last['model_xsl_hash'] !== $model_xsl_hash_new) {
            //log_message('debug', 'changed XSLT stylesheets');
            $xsl_version++;
            $this->_update_properties(array(
                'xsl_version' => $xsl_version,
                'form_xsl_hash' => $form_xsl_hash_new, 
                'model_xsl_hash' => $model_xsl_hash_new
            ));
        }
        $this->xsl_version = $xsl_version;
        return ($xsl_version === $xsl_ver_prev);
    }

    private function _media_unchanged($previous_media_hash)
    {
        $current_hash = $this->info['media_hash'];
        $previous_hash = (string) $previous_media_hash;
        return ($current_hash == $previous_hash);
    }
}
?>
