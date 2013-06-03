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

	//private $subdomain;

    function __construct()
    {
        parent::__construct();
        log_message('debug', 'Survey Model loaded');
        $this->load->helper(array('subdomain', 'url', 'string', 'http'));
        $this->load->library('paywall'); 
    	$this->subdomain = get_subdomain();
        $this->ONLINE_SUBDOMAIN_SUFFIX = '-0';
        $this->db_subdomain = ( $this->_has_subdomain_suffix() ) ? substr($this->subdomain, 0, strlen($this->subdomain)-strlen($this->ONLINE_SUBDOMAIN_SUFFIX)) : $this->subdomain;
        //date_default_timezone_set('UTC');
    }
    
    // returns true if a requested survey form is live / published, used for manifest
    public function is_live_survey($survey_subdomain = NULL)
    {
    	//$query = $this->db->get_where('surveys',array('subdomain'=>$survey_subdomain, 'survey_live'=>TRUE), 1);
    	//return ($query->num_rows() === 1) ? TRUE : FALSE;
        //since management of surveys is done at the OpenRosa-compliant server, all we could do here is see
        //if the url contains an xml file. However, this is very inefficient and needs to be done only once (not also in the form model before transformation). ALSO THE FORM URL REMAINS ACCESSIBLE WHEN DISABLED IN AGGREGATE SO ONE WOULD HAVE TO CHECK THE FORMLIST  
        //
        return TRUE;      
    }
    
    //returns true if a requested survey or template exists
    public function is_launched_survey()
    {    	
        return ($this->_get_item('subdomain')) ? TRUE : FALSE;
    }
    
    public function get_form_props()
    {
        return $this->_get_items(array('server_url', 'form_id', 'hash', 'xsl_version'));
    }

    public function get_server_url()
    {
        return $this->_get_item('server_url');
    }

    public function get_form_id()
    {        
        return $this->_get_item('form_id');
    }

    public function get_data_url()
    {
        return $this->_get_item('data_url');
    }

    public function get_form_submission_url()
    {
        return strtolower($this->_get_item('submission_url'));
    }

    public function get_preview_url($server_url, $form_id)
    {
        return $this->_get_preview_url($server_url, $form_id);
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
        $items = $this->_get_items(array('transform_result_title', 'transform_result_model', 'transform_result_form'));
        $form = new stdClass();
        $form->title = $items['transform_result_title'];
        $form->default_instance = $items['transform_result_model'];
        $form->html = $items['transform_result_form'];
        return $form;
    }

    public function update_transform_result($form)
    {
        $values = array(
            'transform_result_title' 	=> (string) $form->title,
            'transform_result_model' 	=> (string) $form->default_instance,
            'transform_result_form' 	=> (string) $form->html,
            'hash' 						=> (string) $form->hash,
            'xsl_version' 				=> (string) $form->xsl_version
        );
        $this->_update_items($values);
    }

//    public function switch_offline_launch($active)
//    {
//        $current = $this->_get_item('offline');
//        log_message('debug', 'current: '.$current);
//        log_message('debug', 'active: '.$active);
//        return ($current == $active) ? TRUE : $this->_update_item('offline', $active);
//    }

    public function launch_survey($server_url, $form_id, $submission_url, $data_url=NULL, $email=NULL)
    {  
        //log_message('debug', 'launch_survey function started');
        if (url_valid($server_url) && url_valid($submission_url) && (url_valid($data_url) || $data_url===NULL))
        {
            //TODO: CHECK URLS FOR LIVENESS?
            $alt_server_url = $this->_switch_protocol($server_url);
            $this->db->where("server_url = '".$server_url."' AND BINARY form_id = '".$form_id."'");
            $this->db->or_where("server_url = '".$alt_server_url."' AND BINARY form_id = '".$form_id."'");
            $existing = $this->db->get('surveys', 1); 
            if ( $existing->num_rows() > 0 )
            {
                $subdomain = $existing->row()->subdomain;
                $success = FALSE;
                $reason = 'existing';
            } 
            else if (!$this->paywall->launch_allowed($server_url))
            {
            	$success = FALSE;
            	$reason = $this->paywall->get_reason();
            }
            else
            {
                $subdomain = $this->_generate_subdomain();
                log_message('debug', 'new subdomain generated:'.$subdomain);   
                //if we can ensure only requests from enketo.org are processed, it is pretty certain that $server_url is live       
                $data = array(
                    'subdomain' => $subdomain,
                    'server_url' => strtolower($server_url),
                    'form_id' => $form_id,
                    'submission_url' => strtolower($submission_url),
                    'data_url' => strtolower($data_url),
                    'email' => $email,
                    'launch_date' => date( 'Y-m-d H:i:s', time())
                );

                $result = $this->db->insert('surveys', $data);
                
                if (!$result)
                {
                    $success = FALSE;
                    $reason = 'database';
                    unset($subdomain);
                }
                else
                {
                    $success = TRUE;
                    $reason = 'new';
                }
            }

            $survey_url = (isset($subdomain)) ? $this->_get_full_survey_url($subdomain) : '';
            $edit_url = (isset($subdomain)) ? $this->_get_full_survey_edit_url($subdomain) : '';
            $iframe_url = (isset($subdomain)) ? $this->_get_full_survey_iframe_url($subdomain) : '';

            return (isset($subdomain)) ? 
                array
                (
                    'success' => $success, 
                    'url'=> $survey_url, 
                    'edit_url' => $edit_url, 
                    'iframe_url' => $iframe_url, 
                    'subdomain' => $subdomain,
                    'reason' => $reason
                ) 
                : 
                array
                (
                    'success' => $success, 
                    'reason' => $reason
                );
        }
        log_message('error', 'unknown error occurred when trying to launch survey');
        return array('success'=>FALSE, 'reason'=>'unknown');
    }

    //note that this function does not 'launch' the survey if it doesn't exist
    public function get_survey_url_if_launched($form_id, $server_url)
    {
        $this->db->select('subdomain');
        $this->db->where(array('form_id'=>$form_id, 'server_url'=>$server_url)); 
        $query = $this->db->get('surveys', 1); 
        if ($query->num_rows() === 1) 
        {
            $row = $query->row_array();
            return $this->_get_full_survey_url($row['subdomain']);
        }
        else 
        {
            return NULL;   
        }
    }

    public function remove_test_entries(){
        return $this->_remove_item('server_url', 'http://testserver/bob');
    }

    public function number_surveys($server_url=NULL){
        $this->remove_test_entries();
        return $this->_get_record_number($server_url);
    }

	private function _get_base_url($subdomain = false, $suffix = false) {
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
    private function _get_full_survey_url($subdomain)
    {
        return $this->_get_base_url($subdomain).'/webform';
    }

    /**
     * @method _get_full_survey_edit_url turns a subdomain into the full url where the survey is available
     * 
     * @param $subdomain subdomain
     */
    private function _get_full_survey_edit_url($subdomain)
    {
        return $this->_get_base_url($subdomain, true).'/webform/edit';
    }

    /**
     * @method _get_full_iframe_url turns a subdomain into the full url where an iframeable webform is available
     * 
     * @param $subdomain subdomain
     */
    private function _get_full_survey_iframe_url($subdomain)
    {
        return $this->_get_base_url($subdomain, true).'/webform/iframe';
    }

    /**
     * returns a preview url
     */
    private function _get_preview_url($server_url, $form_id)
    {
        return $this->_get_base_url().'/webform/preview?server='.$server_url.'&id='.$form_id;
    }

    private function _switch_protocol($url)
    {
        list($protocol, $rest) = explode('://', $url);
        $alt_url = ($protocol === 'https') ? 'http://'.$rest : 'https://'.$rest;

        if (empty($alt_url))
        {
            log_message('error', 'Failed to switch protocol of '.$url);
        }
        return $alt_url;
    }

    private function _generate_subdomain()
    {
    	//$result_num = 1;
        $counter = 0;
    	$subdomain = NULL;
    	//this could be an infinite loop without a counter
    	while (!$subdomain && $counter < 1000)
    	{
            $subdomain = strtolower(random_string('alnum', 5));
    		$query = $this->db->get_where('surveys', array('subdomain' => $subdomain));
    		$result_num = $query->num_rows();
            $subdomain = ($result_num !== 0) ? NULL : $subdomain;
            $counter++;
    	}
    	return $subdomain;
    }
    
    private function _get_item($field)
    {
        $item_arr = $this->_get_items($field);
        if (!empty($item_arr[$field]))
        {
            return $item_arr[$field];
        }
        return NULL;
        /*
        $subd = $this->subdomain;
        $db_subd = ( $this->_has_subdomain_suffix() ) ? substr($subd, 0, strlen($subd)-strlen($this->ONLINE_SUBDOMAIN_SUFFIX)) : $subd;
        $this->db->select($field);
        $this->db->where('subdomain', $db_subd); //$this->subdomain);
        $query = $this->db->get('surveys', 1); 
        if ($query->num_rows() === 1) 
        {
            $row = $query->row_array();
            return $row[$field];
        }
        else 
        {
            return NULL;   
        }*/
    }

    private function _get_items($items)
    {  
        $this->db->select($items);
        $this->db->where('subdomain', $this->db_subdomain); //$this->subdomain);
        $query = $this->db->get('surveys', 1); 
        if ($query->num_rows() === 1) 
        {
            $row = $query->row_array();
            //log_message('debug', 'db query returning row: '.json_encode($row));
            return $row;
        }
        else 
        {
            log_message('error', 'db query for '.implode(', ', $items)).' returned '.$query->num_rows().' results.';
            return NULL;   
        }
    }

    private function _get_record_number($server_url)
    {
        $query = (!$server_url) ? $this->db->get('surveys') : $this->db->get_where('surveys', array('server_url' => $server_url));
        return $query->num_rows(); 
    }

    private function _update_item($field, $value)
    {
        $data = array($field => $value);
        $result = $this->_update_items($data);
        return $result;
    }

    private function _update_items($data)
    {
        //$data = array($field => $value);
        $this->db->where('subdomain', $this->db_subdomain);
        $this->db->limit(1);
        $query = $this->db->update('surveys', $data); 
        if ($this->db->affected_rows() > 0) 
        {
            return TRUE;
        }
        else 
        {
            log_message('error', 'database update on record with subdomain '.$this->db_subdomain);
            return FALSE;   
        }
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
