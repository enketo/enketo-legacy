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

class Survey_model extends CI_Model {

    private $db_subdomain;
    private $subdomain;

    function __construct()
    {
        parent::__construct();
        $this->load->helper(array('subdomain', 'url', 'string', 'http'));
        //$this->load->model('Account_model');
        $this->subdomain = get_subdomain();
        $this->ONLINE_SUBDOMAIN_SUFFIX = '-0';
        $this->db_subdomain = ( $this->_has_subdomain_suffix() ) ? substr($this->subdomain, 0, strlen($this->subdomain)-strlen($this->ONLINE_SUBDOMAIN_SUFFIX)) : $this->subdomain;
        log_message('debug', 'Survey model initalized');
    }
    
    // returns true if a requested survey form is live / published, used for manifest
    public function is_live_survey($survey_subdomain = NULL)
    {
        //since management of surveys is done at the OpenRosa-compliant server, best we could do here is see if the form_id is present
        //in the current /formList
        return TRUE;      
    }
    
    //returns true if a requested survey or template exists and is active
    public function is_launched_survey()
    {     
        return ($this->subdomain) ? ( ($this->_get_item('subdomain', TRUE)) ? TRUE : FALSE ) : NULL;
    }
    
    public function get_form_props()
    {
        return ($this->subdomain) ? $this->_get_items(array('server_url', 'form_id', 'hash', 'media_hash', 'xsl_version'), TRUE) : NULL;
    }

    public function get_server_url()
    {
        return ($this->subdomain) ? $this->_get_item('server_url') : NULL;
    }

    public function get_form_id()
    {        
        return ($this->subdomain) ? $this->_get_item('form_id') : NULL;
    }

    public function get_data_url()
    {
        return ($this->subdomain) ? $this->_get_item('data_url') : NULL;
    }

    public function get_form_submission_url()
    {
        return ($this->subdomain) ? $this->_get_item('submission_url') : NULL;
    }

    public function get_webform_url_if_launched($server_url, $form_id, $options = array('type' => NULL))
    {
        //No need to check quota for simple get, I think
        //If deciding to do this, be aware that the GET/POST /surveys/list will also stop working and is required
        //and is required by enketo_account_manager

        $subdomain = $this->_get_subdomain($server_url, $form_id, TRUE);

        if (!$subdomain) {
            return array(
                'error'     => 'subdomain',
                'message'   => 'could not find form in database'
            );
        }

        $result = $this->_get_webform_urls($subdomain, $server_url, $form_id, $options);

        if (!$result) {
            return array(
                'error'     => 'unknown',
                'message'   => 'unknow error occurred while creating form urls'
            );
        }

        return $result;
    }

    public function get_webform_list($server_url = NULL)
    {
        $surveys = $this->_get_records($server_url);
        foreach ($surveys as $i => $survey) {
            $surveys[$i]['url'] = $this->_get_full_survey_url($survey['subdomain']);
            unset($surveys[$i]['subdomain']);
        }
        return $surveys;
    }

    /**
     * Creates subdomain if form does not yet exist in database
     */
    public function get_webform_url($server_url, $form_id, $quota, $submission_url = NULL, $options = array('type' => NULL))
    {
        $quota_used = $this->_get_record_number($server_url);
        $quota_exceeded_response = array(
            'error'   => 'full',
            'message' => 'the quota for this account has been used up, consider upgrading'
        );
        
        if ( $quota_used == $quota ){
            log_message('debug', 'quota used and quota available are both: '.$quota);
            $url_obj = $this->get_webform_url_if_launched($server_url, $form_id, $options);
            return (empty($url_obj['error'])) ? $url_obj : $quota_exceeded_response;
        } else if ($quota_used > $quota) {
            return $quota_exceeded_response;
        }
        $existing_active_subdomain = $this->_get_subdomain($server_url, $form_id, TRUE); //duplicates check in _launch;
        $subdomain = $this->_launch($server_url, $form_id, $submission_url);

        if (!$subdomain) {
            return array(
                'error'     => 'subdomain',
                'message'   => 'error while trying to create subdomain'
            );
        }

        $result = $this->_get_webform_urls($subdomain, $server_url, $form_id, $options);

        //if (!$result) {} 

        if ($options['type'] == 'edit' || $options['type'] == 'all') {
            $result['subdomain'] = $subdomain;
        }

        if ($result && $existing_active_subdomain) {
            $result['existing'] = TRUE;
        } 

        return $result;
    }

    public function deactivate_webform_url($server_url, $form_id)
    {
        $this->db_subdomain = $this->_get_subdomain($server_url, $form_id);
        if (!$this->db_subdomain) {
            return FALSE;
        }
        return $this->_update_item('active' , FALSE);
    }

    public function remove_unused_transform_results()
    {
         $values = array(
            'transform_result_title'    => NULL,
            'transform_result_model'    => NULL,
            'transform_result_form'     => NULL,
            'hash'                      => NULL,
            'media_hash'                => NULL,
            'xsl_version'               => NULL
        );
        $this->db->where('TIMESTAMPDIFF(MONTH, `last_accessed`, CURRENT_TIMESTAMP) >= 3', NULL, FALSE);
        $query = $this->db->update('surveys', $values); 
        return $this->db->affected_rows();  
    }

    public function has_offline_launch_enabled()
    {
        return !$this->_has_subdomain_suffix();
    }

    public function is_launched_live_and_offline()
    {
        return $this->has_offline_launch_enabled() && $this->is_live_survey() && $this->is_launched_survey();
    }

    public function get_cached_transform_result()
    {
        $items = $this->_get_items(array('transform_result_title', 'transform_result_model', 'transform_result_form', 'theme'));
        $form = new stdClass();
        $form->title = $items['transform_result_title'];
        $form->default_instance = $items['transform_result_model'];
        $form->html = $items['transform_result_form'];
        $form->theme = $items['theme'];
        return $form;
    }

    public function update_transform_result($form)
    {
        $values = array(
            'transform_result_title'    => (string) $form->title,
            'transform_result_model'    => (string) $form->default_instance,
            'transform_result_form'     => (string) $form->html,
            'theme'                     => (string) $form->theme,
            'hash'                      => (string) $form->hash,
            'media_hash'                => (string) $form->media_hash,
            'xsl_version'               => (string) $form->xsl_version
        );
        $this->_update_items($values);
    }

    public function remove_test_entries()
    {
        return $this->_remove_item('server_url', 'http://testserver/bob') 
            && $this->_remove_item('server_url', 'http://testserver.com/bob')
            && $this->_remove_item('server_url', 'https://testserver.com/bob')
            && $this->_remove_item('server_url', 'https://testserver.com/noquota')
            && $this->_remove_item('server_url', 'https://testserver.com/noapi')
            && $this->_remove_item('server_url', 'https://testserver.com/noquotanoapi')
            && $this->_remove_item('server_url', 'https://testserver.com/notpaid')
            && $this->_remove_item('server_url', 'https://testserver.com/notexist');
    }

    public function number_surveys($server_url = NULL, $active_only = TRUE)
    {
        $this->remove_test_entries();
        return $this->_get_record_number($server_url, $active_only);
    }

    public function number_submissions($server_url = NULL)
    {
        $this->remove_test_entries();
        return $this->_get_submission_number($server_url);
    }

    /**
     * Creates a unique ID (subdomain) for a form and writes this to the database
     * @return  {string} ID (subdomain)
     **/
    private function _launch($server_url, $form_id, $submission_url = NULL)
    {
        if (strrpos($server_url, '/') === strlen($server_url)-1) {
            $server_url = substr($server_url, 0, -1);
        }
        if ($server_url && url_valid($server_url) && !empty($form_id)) {
            //TODO: CHECK URLS FOR LIVENESS?
            $existing_subdomain = $this->_get_subdomain($server_url, $form_id, NULL);
            if ( $existing_subdomain ) {
                $this->db_subdomain = $existing_subdomain;
                if (!$this->_is_active()) {
                    $this->_update_item('active' , TRUE);
                }
                return $existing_subdomain;
            }
            $subdomain = $this->_generate_subdomain();
            $submission_url = !empty($submission_url) ? $submission_url : $this->_get_submission_url($server_url);   
            $data = array(
                'subdomain'         => $subdomain,
                'server_url'        => $server_url,
                'form_id'           => $form_id,
                'submission_url'    => $submission_url,
                'data_url'          => NULL,
                'email'             => NULL,
                'launch_date'       => date( 'Y-m-d H:i:s', time())
            );
            $result = $this->db->insert('surveys', $data);
                
            if ($result) {
                return $subdomain;
            }
            log_message('error', 'could not insert data in surveys table: '.json_encode($data));
        }
        return NULL;
    }

    private function _get_webform_urls($subdomain, $server_url, $form_id, $options = array('type' => NULL))
    {
        switch($options['type']) {
            case NULL:
                return ($subdomain) ? array('url' => $this->_get_full_survey_url($subdomain, $options)) : NULL;
                break;

            case 'single':
                return ($subdomain) ? array('single_url' => $this->_get_full_survey_single_url($subdomain, $options)) : NULL;
                break;

            case 'preview':
                return ($subdomain) ? array('preview_url' => $this->_get_preview_url($server_url, $form_id, $options)) : NULL;
                break;

            case 'edit':
                return ($subdomain) ? array('edit_url' => $this->_get_full_survey_edit_url($subdomain, $options)) : NULL;

            case 'all':
                return ($subdomain) 
                    ? array(
                        'url'               => $this->_get_full_survey_url($subdomain),
                        'iframe_url'        => $this->_get_full_survey_url($subdomain, array('iframe' => true)),
                        'single_url'        => $this->_get_full_survey_single_url($subdomain),
                        'single_iframe_url' => $this->_get_full_survey_single_url($subdomain, array('iframe' => true)),
                        'preview_url'       => $this->_get_preview_url($server_url, $form_id),
                        'preview_iframe_url'=> $this->_get_preview_url($server_url, $form_id, $options)
                    ) 
                    : NULL;
                break;

            default: 
                return array('message' => 'unknown webform type requested');
                break;
        }
    }

    public function increase_submission_count()
    {
        return $this->_update_item('submissions', 'submissions + 1', FALSE);
    }

	private function _get_base_url($subdomain = false, $suffix = false) 
    {
		if(empty($_SERVER['HTTPS'])) {
			$protocol = 'http://';
			$default_port = 80;
		} else {
			$protocol = 'https://';
			$default_port = 443;
		}
        $domain = $_SERVER['SERVER_NAME'];
        // append port to domain only if it's a nonstandard port. don't use HTTP_HOST as it can be manipulated by the client
        if($_SERVER['SERVER_PORT'] != $default_port) $domain .=  ':' . $_SERVER['SERVER_PORT'];
        $domain = (strpos($domain, 'www.') === 0 ) ? substr($domain, 4) : $domain; 

        if($subdomain) {
            if($suffix) 
                $subdomain .= $this->ONLINE_SUBDOMAIN_SUFFIX;
            $subdomain .= '.';
        }
        return $protocol.$subdomain.$domain;
    }

    /**
     * @method _get_full_survey_url turns a subdomain into the full url where the survey is available
     * 
     * @param $subdomain subdomain
     */
    private function _get_full_survey_url($subdomain, $options = NULL)
    {
        if (!empty($subdomain)) {
            $query_str = $this->_get_query_string($options);
            $offline_only = (!empty($options['iframe'])) ? TRUE : FALSE;
            return $this->_get_base_url($subdomain, $offline_only).'/webform'.$query_str;
        }
        return NULL;
    }

    /**
     * @method _get_full_survey_edit_url turns a subdomain into the full url where the survey is available
     * 
     * @param $subdomain subdomain
     */
    private function _get_full_survey_edit_url($subdomain, $options = NULL)
    {
        if (!empty($subdomain)) {
            $query_str = $this->_get_query_string($options);
            return $this->_get_base_url($subdomain, true).'/webform/edit'.$query_str;
        }
        return NULL;
    }
   
    /**
     * @method _get_full_survey_single_url turns a subdomain into the full url where an iframeable webform is available
     * 
     * @param $subdomain subdomain
     */
    private function _get_full_survey_single_url($subdomain, $options = NULL)
    {
        if (!empty($subdomain)) {
            $query_str = $this->_get_query_string($options);
            return $this->_get_base_url($subdomain, true).'/webform/single'.$query_str;
        }
        return NULL;
    }

    /**
     * returns a preview url
     */
    private function _get_preview_url($server_url, $form_id, $options = NULL)
    {
        if (!empty($server_url) && !empty($form_id)) {
            $query_params = $this->_get_query_params_str($options);
            return base_url().'webform/preview?server='.urlencode($server_url).'&id='.urlencode($form_id).$query_params;
        }
        return NULL;
    }

    private function _get_query_string($options = NULL)
    {
        $query_str = ($options && !empty($options['iframe'])) ? '?iframe=true' : '';
        $query_op = (strlen($query_str) > 0) ? '&' : '?';
        $query_str .= ($options && !empty($options['instance_id'])) 
            ? $query_op.'instance_id='.$options['instance_id'] 
            : '';
        return $query_str;
    }

    private function _get_query_params_str($options = NULL)
    {
        return ($options && !empty($options['iframe'])) ? '&iframe=true' : '';
    }

    private function _get_submission_url($server_url)
    {
        if (!empty($server_url)){
            return (strrpos($server_url, '/') === strlen($server_url)-1) 
                ? $server_url.'submission' : $server_url.'/submission';
        }
        return NULL;
    }

    private function _switch_protocol($url)
    {
        list($protocol, $rest) = explode('://', $url);
        $alt_url = ($protocol === 'https') ? 'http://'.$rest : 'https://'.$rest;

        if (empty($alt_url)) {
            log_message('error', 'Failed to switch protocol of '.$url);
        }
        return $alt_url;
    }

    private function _switch_www($url)
    {
        list($protocol, $url_no_protocol) = explode('://', $url);
        $pos_dot = strpos($url_no_protocol, '.');
        $first = substr($url_no_protocol, 0, $pos_dot );
        $rest = substr($url_no_protocol, $pos_dot+1);
        return ($first === 'www') ? $protocol.'://'.$rest : $protocol.'://www.'.$first.'.'.$rest;
    }

    private function _has_path($url)
    {
        list($protocol, $rest) = explode('://', $url);
        return strpos($rest, '/') !== FALSE && strrpos($rest, '/') !== strlen($url) - 1;
    }

    private function _generate_subdomain()
    {
        //$result_num = 1;
        $counter = 0;
        $subdomain = NULL;
        //this could be an infinite loop without a counter
        while (!$subdomain && $counter < 1000) {
            $subdomain = strtolower(random_string('alnum', 5));
            $query = $this->db->get_where('surveys', array('subdomain' => $subdomain));
            $result_num = $query->num_rows();
            $subdomain = ($result_num !== 0) ? NULL : $subdomain;
            $counter++;
        }
        return $subdomain;
    }
    
    private function _get_subdomain($server_url, $form_id, $active = TRUE)
    {
        if (strrpos($server_url, '/') === strlen($server_url)-1) {
            $server_url = substr($server_url, 0, -1);
        }
        $active_str = ($active == TRUE) ? ' AND active = 1' : '';
        $alt_server_url_1 = $this->_switch_protocol($server_url);
        $alt_server_url_2 = $this->_switch_www($server_url);
        $alt_server_url_3 = $this->_switch_www($alt_server_url_1);
        $this->db->select('subdomain');
        $this->db->where("server_url = '".$server_url."' AND BINARY form_id = '".$form_id."'".$active_str);
        $this->db->or_where("server_url = '".$alt_server_url_1."' AND BINARY form_id = '".$form_id."'".$active_str);
        $this->db->or_where("server_url = '".$alt_server_url_2."' AND BINARY form_id = '".$form_id."'".$active_str);
        $this->db->or_where("server_url = '".$alt_server_url_3."' AND BINARY form_id = '".$form_id."'".$active_str);
        $query = $this->db->get('surveys', 1); 
        log_message('debug', $this->db->last_query());
        if ($query->num_rows() === 1) {
            $row = $query->row_array();
            //log_message('debug', 'db query returned '.json_encode($row));
            return $row['subdomain'];
        } else {
            return NULL;   
        }
    }

    private function _is_active()
    {
        $active = $this->_get_item('active');
        return !empty($active);
    }

    private function _get_item($field, $active = TRUE)
    {
        $item_arr = $this->_get_items($field, $active);
        if (!empty($item_arr[$field])) {
            return $item_arr[$field];
        }
        return NULL;
    }

    private function _get_items($items, $active = TRUE)
    {  
        $active_str = ($active == TRUE) ? ' AND active = 1' : '';
        $this->db->select($items);
        $this->db->where("subdomain = '".$this->db_subdomain."'".$active_str);
        $query = $this->db->get('surveys', 1); 
        if ($query->num_rows() === 1) {
            $row = $query->row_array();
            $this->_update_item('last_accessed', 'CURRENT_TIMESTAMP', FALSE);
            return $row;
        } else {
            log_message('error', 'db query for '.json_encode($items).' returned '.$query->num_rows().' results.');
            return NULL;
        }
    }

    private function _get_record_number($server_url = NULL, $active_only = TRUE)
    {
        $this->_db_where_alt_server_urls($server_url, $active_only);
        $query = $this->db->get('surveys'); 
        //log_message('debug', 'query: '.$this->db->last_query());
        return $query->num_rows(); 
    }

    private function _get_records($server_url = NULL)
    {
        $this->db->select(array('subdomain', 'server_url', 'form_id', 'transform_result_title'));
        $this->_db_where_alt_server_urls($server_url, TRUE);
        $this->db->order_by('server_url', 'asc');
        $query = $this->db->get('surveys');
        return $query->result_array();
    }

    private function _get_submission_number($server_url = NULL)
    {
        $this->db->select('SUM(`submissions`) AS `submission_total`');
        $query = $this->db->get('surveys');
        if ($query->num_rows() === 1) {
            $result = $query->row_array();
            return (int) $result['submission_total'];
        }
        return NULL;
    }

    private function _db_where_alt_server_urls($server_url, $active_only)
    {
        $active_str = ($active_only == TRUE) ? ' AND active = 1' : '';
        if ($server_url) {
            $alt_server_url_1 = $this->_switch_protocol($server_url);
            $alt_server_url_2 = $this->_switch_www($server_url);
            $alt_server_url_3 = $this->_switch_www($alt_server_url_1);
            $this->db->where("server_url = '".$server_url."'".$active_str);
            $this->db->or_where("server_url = '".$alt_server_url_1."'".$active_str);
            $this->db->or_where("server_url = '".$alt_server_url_2."'".$active_str);
            $this->db->or_where("server_url = '".$alt_server_url_3."'".$active_str);
            if (!$this->_has_path($server_url)) {
                $this->db->or_where("server_url LIKE '".$server_url."%'".$active_str);
                $this->db->or_where("server_url LIKE '".$alt_server_url_1."%'".$active_str);
                $this->db->or_where("server_url LIKE '".$alt_server_url_2."%'".$active_str);
                $this->db->or_where("server_url LIKE'".$alt_server_url_3."%'".$active_str);
            }
        } else if ($active_only == TRUE) { 
            $this->db->where('active = 1'); 
        }
        return;
    }

    private function _update_item($field, $value, $escape = TRUE)
    {
        $this->db->where('subdomain', $this->db_subdomain);
        $this->db->set($field, $value, $escape);
        $this->db->update('surveys');
        log_message('debug', 'last query: '.$this->db->last_query());
        if ($this->db->affected_rows() > 0) {
            return TRUE;
        }
        log_message('debug', 'failed datebase item update (maybe nothing to update) '.$this->db->last_query());
        return FALSE;   
    }

    private function _update_items($data)
    {
        $this->db->where('subdomain', $this->db_subdomain);
        $this->db->limit(1);
        $query = $this->db->update('surveys', $data); 
        if ($this->db->affected_rows() > 0) {
            return TRUE;
        }
        
        log_message('debug', 'failed database items update (maybe nothing to update) '.$this->db->last_query());
        return FALSE;   
    }

    private function _remove_item($field, $value)
    {
        $this->db->delete('surveys', array($field => $value));
        return $this->db->affected_rows();
    }

    private function _has_subdomain_suffix()
    {
        $s = $this->subdomain;
        return ( substr($s, strlen($s)-strlen($this->ONLINE_SUBDOMAIN_SUFFIX)) === $this->ONLINE_SUBDOMAIN_SUFFIX ) ? TRUE : FALSE; 
    }   
}
?>
