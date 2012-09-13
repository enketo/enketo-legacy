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
    	$this->subdomain = get_subdomain();
        date_default_timezone_set('UTC');
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
    
//    // returns true if the data of a particular survey is live / published
//    public function is_live_survey_data($survey_subdomain = NULL)
//    {
//    	if (!isset($survey_subdomain))
//    	{
//    		$survey_subdomain = $this->subdomain;
//    	}
//    	$query = $this->db->get_where('surveys',array('subdomain'=>$survey_subdomain, 'data_live'=>TRUE), 1);
//    	return ($query->num_rows() === 1) ? TRUE : FALSE;
//    }
    
    //returns true if a requested survey or template exists
    public function is_launched_survey()
    {    
    	$this->db->where('subdomain', $this->subdomain);
    	$query = $this->db->get('surveys', 1); 
    	return ($query->num_rows() === 1) ? TRUE : FALSE;	
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
    
    public function launch_survey($server_url, $form_id, $submission_url, $data_url, $email)
    {  
        $subdomain = $this->_generate_subdomain();
        log_message('debug', 'subdomain generated:'.$subdomain);

        if (url_valid($server_url) && url_valid($submission_url) && (url_valid($data_url) || $data_url===NULL) && $subdomain)
        {
            //ADD: CHECK URLS FOR LIVENESS?
            
            $existing = $this->db->get_where('surveys', array('server_url'=>$server_url, 'form_id'=>$form_id), 1);

            if ( $existing->num_rows() > 0 )
            {
                return array('success'=>FALSE, 'reason'=>'existing', 
                    'url'=> $this->_get_full_survey_url($existing->row()->subdomain));
            }    
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
            $survey_url = $this->_get_full_survey_url($subdomain);
            log_message('debug', 'result of insert into surveys table: '.$result);
            return ($result != FALSE) ? 
                array('success'=>TRUE, 'url'=> $survey_url): array('success'=>FALSE, 'reason'=>'database');
        }
        return array('success'=>FALSE, 'reason'=>'unknown');
    }

    /**
     * @method _get_full_survey_url turns a subdomain into the full url where the survey is available
     * 
     * @param $subdomain subdomain
     */
    private function _get_full_survey_url($subdomain)
    {
        $protocol = (empty($_SERVER['HTTPS'])) ? 'http://' : 'https://';
        $domain = $_SERVER['SERVER_NAME'];
        $domain = (strpos($domain, 'www.') === 0 ) ? substr($domain, 4) : $domain; 
        return $protocol.$subdomain.'.'.$domain.'/webform';
    }

// 	public function update_formlist()
// 	{
//        $formlist_url = 
//        //EXPAND THIS USING xformsList and detect presence of ManifestUrl
// 		$formlist = simplexml_load_file($formlist_url);//$this->config->item('jr_formlist'));
// 		
// 		if(isset($formlist))
// 		{
//	 		foreach ($formlist->form as $form)
//	 		{
//	 			$url = (string) $form['url'];
//	 			log_message('debug', 'url: '.$url);
//	 			$title = (string) $form;
//	 			log_message('debug', 'title: '.$title);
//	 			$query = $this->db->get_where('surveys', array ('url' => $url));
//	 			if ($query->num_rows() > 0)
//	 			{
//	 				$this->db->where('url', $url);
//	 				$this->db->update('surveys', array('title'=> $title)); // STILL NEEDS TO BE TESTED
//	 			}
//	 			else
//	 			{
//	 				$this->db->insert('surveys', array('subdomain' => $this->_generate_subdomain(), 'form_url' => $url, 'title' => $title));
//	 			}
//			}		
// 		log_message('debug', 'formlist: '.$formlist->asXML());
// 		return TRUE;
// 		}
// 		else
// 		{
// 			log_message('error', 'error loading formlist');
// 			return FALSE;
// 		}
// 	}
    
    public function get_survey_list()
    {
        //log_message('debug', 'getting survey list');
        $this->db->select('subdomain, title');
        $query = $this->db->get('surveys');
        if ($query->num_rows() > 0)
        {
            //log_message('debug', 'found results!');
            foreach ($query->result() as $row)
            {
                $url = str_replace('://', '://'.$row->subdomain.'.' , base_url());
                //log_message('debug', 'url: '.$url);
                $surveys[] = array('url' => $url , 'title' => $row->title);
            }     
            //log_message ('debug', 'list array: '.json_encode($surveys));
            return $surveys;
        }
        else 
        {
            log_message('debug', 'no results!');
            return FALSE;
        }
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
        $this->db->select($field);
        $this->db->where('subdomain', $this->subdomain);
        $query = $this->db->get('surveys', 1); 
        if ($query->num_rows() === 1) 
        {
            $row = $query->row_array();
            return $row[$field];
        }
        else 
        {
            return NULL;   
        }
    }

    
//    //returns the form format as an object   NOT USED ANYMORE! 
//    public function get_form_format($id = NULL, $live = TRUE)
//    {
//		if (!isset($id))
//    	{
//    		$id = $this->subdomain;
//    	}
//    	$format = NULL;
//    	//get the basic survey form information
//    	$this->db->from('surveys');
//    	$this->db->where('subdomain',$id);
//    	if (isset($live)) {
//    		// if $live is NULL this means that both published surveys will be returned
//    		$this->db->where('survey_live',$live);
//    	}
//    	$this->db->select('version, country, sector, name, year, key, key_label');
//    	$this->db->limit(1);
//    	$query = $this->db->get();
//    	
//    	if ($query->num_rows() === 1)//result should have only 1 row
//    	{	
//    		$format = $query->row(); 
//	    	
//	    	$this->db->select('
//	    		survey_questions.id_html, 
//	    		survey_questions.label, 
//	    		survey_questions.description, 
//	    		survey_questions.type, 
//	    		survey_questions.input, 
//	    		survey_questions.step, 
//	    		survey_questions.max, 
//	    		survey_questions.required, 
//	    		
//	    		survey_questions_options.option_labels, 
//	    		survey_questions_options.option_values, 
//	    		
//	    		survey_questions_map.sequence
//	    	');
//	    	$this->db->from('survey_questions_map');
//	    	$this->db->where_in('survey_questions_map.id', array('ALL', $id));//

//	    	//join to add the survey questions
//	    	$this->db->join('survey_questions', 
//	    		'survey_questions_map.question_id=survey_questions.id', 'right');
//	    		    	
//	    	//join to add the survey question options
//	    	$this->db->join('survey_questions_options', 
//	    		'survey_questions.options_id = survey_questions_options.id', 'left');
//	    	
//	    	//order by sequence if sequence is provided
//	    	$this->db->order_by('survey_questions_map.sequence', 'asc');
//	    	
//	    	$query = $this->db->get();
//	    	$result = $query->result();
//	    	
//	    	//options are stored as serialized arrays in db and need to be unserialized
//	    	foreach ($result as $question)
//	    	{
//	    		$option_labels = $question -> option_labels;
//	    		$question -> option_labels = unserialize($option_labels);	
//	    		
//	    		$option_values = $question -> option_values;
//	    		$question -> option_values = unserialize($option_values);
//	    	}
//	    	
//	    	$format -> questions = $result;
//	    	
//	    	log_message('debug', 'form_format loaded:');
//	    }
//		return $format;
//	}
    
//    // attempts to save a survey form format created in the survey builder
//    private function _set_form_format()
//    {
//    	//$this->db->from('surveys');
//    	//$this->db->where(array('subdomain'=>$survey_subdomain, 'live'=>TRUE));
//    	//$this->db->limit(1); 
//    }
//    
//    // tries to insert received survey data and returns a result object
//    public function add_survey_data($data, $subdomain)
//    {
//    
//    	//ADD XSS CHECK
//    	
//    	$survey_form_data = $data['surveyForms'];
//		//$feedback_data = $data['feedback'];
//		//$log_data = $data['log'];
//			
//		$survey_table = strtoupper($subdomain).'_survey_data';
//		//$version = $data_received['version'];
//			
//		// ADD LOGIC to save version and table name in a separate table and compared received version with stored version. If different add logic to add columns where necessary. Cope with two surveyForms received in different versions....
//					
//		// ADD CI LOGIC for CREATE TABLE IF NOT EXISTS? (or create table elsewhere)
//		
//		//$record_names = array(); 
//		//$insert_data = array(); // THIS VARIABLE SHOULD BE REMOVED, CHANGE FOLLOWING FOREACH LOOP, USE INDEX
//		$record_inserted = array();
//		$record_failed = array();
//		$success = false;
//		
//		foreach ($survey_form_data as $form_data)
//		{
//			$record_name = $form_data['key'];
//			//remove field 'key' and 'recordType'
//			unset($form_data['key']);
//			unset($form_data['recordType']);
//			//add a timestamp
//			$form_data['lastUploaded'] = time();
//			try
//			{
//				$this->db->insert($survey_table, $form_data);
//				$record_inserted[] = $record_name;
//			}
//			catch (Exception $e)
//			{
//				$record_failed[] = $record_name;
//			}
//		}
//		/*			
//		try{
//			$this->db->insert_batch($survey_table, $insert_data);
//			$success = true; // DOES NOT SEEM TO BE USED IN survey.js anymore (except for log)
//			$record_inserted = $record_names;
//		}
//		catch (Exception $e)
//		{
//			$success = false;
//			$record_inserted = array(); //empty
//		}
//		*/
//		$success = 'blabla'; //REMOVE THIS
//		$failed_query = array();//REMOVE THIS//

//		// set up associative array to return as a response
//		return array('success' => $success, 'inserted' => $record_inserted, 'failed' => $record_failed, 'failed queries: '=>$failed_query );//

//    }
//    
//    // returns a data object of a survey identified by its subdomain
//    public function get_all_survey_data($survey_subdomain = NULL)
//    {
//    	if (!isset($survey_subdomain))
//    	{
//    		$survey_subdomain = $this->subdomain;
//    	}
//    
//    	$table = strtoupper($survey_subdomain).'_survey_data';
//    	$this->db->from($table);
//    	$this->db->order_by('lastUploaded','desc'); //note that the jQuery table function does its own sorting
//    	$query = $this->db->get();
//    
//    	return $query->result();
//    }
    
}

?>