<?php

class Survey_model extends CI_Model {

	private $subdomain;

    function __construct()
    {
        parent::__construct();
        log_message('debug', 'Survey Model loaded');
        $this->load->helper('subdomain', 'url');
    	$this->subdomain = get_subdomain();
    }
    
    // returns true if a requested survey form is live / published
    public function is_live_survey($survey_subdomain = NULL)
    {
    	if (!isset($survey_subdomain))
    	{
    		$survey_subdomain = $this->subdomain;
    	}
    	$query = $this->db->get_where('surveys',array('subdomain'=>$survey_subdomain, 'survey_live'=>TRUE), 1);
    	return ($query->num_rows() === 1) ? TRUE : FALSE;

    }
    
    // returns true if the data of a particular survey is live / published
    public function is_live_survey_data($survey_subdomain = NULL)
    {
    	if (!isset($survey_subdomain))
    	{
    		$survey_subdomain = $this->subdomain;
    	}
    	$query = $this->db->get_where('surveys',array('subdomain'=>$survey_subdomain, 'data_live'=>TRUE), 1);
    	return ($query->num_rows() === 1) ? TRUE : FALSE;
    }
    
    //returns true if a requested survey or template exists
    public function is_existing_survey($survey_id = NULL)
    {
    	if (!isset($survey_id))
    	{
    		$survey_id = $this->subdomain;
    	}
    	//** original ** $this->db->where('subdomain', $survey_id);
    	//** original ** $this->db->or_where('template', $survey_id);
    	//** original ** $query = $this->db->get('surveys', 1); 
    	//** original ** return ($query->num_rows() === 1) ? TRUE : FALSE;
    
    	$this->db->where('subdomain', $survey_id);
    	$query = $this->db->get('forms', 1); 
    	return ($query->num_rows() === 1) ? TRUE : FALSE;	
    }
    
    public function get_form_url($subdomain=NULL)
    {
    	if (!isset($subdomain))
    	{
    		$subdomain = $this->subdomain;
    	}
    	$this->db->select('url');
    	$this->db->where('subdomain', $subdomain);
    	$query = $this->db->get('forms', 1); 
    	if ($query->num_rows() === 1) 
    	{
    		$row = $query->row();
			return $row->url;
    	}
    	else 
    	{
    		return FALSE;	
    	}
    }
    
 	public function update_formlist()
 	{
        //EXPAND THIS USING xformsList and detect presence of ManifestUrl
 		$formlist = simplexml_load_file($this->config->item('jr_formlist'));
 		
 		if(isset($formlist))
 		{
	 		foreach ($formlist->form as $form)
	 		{
	 			$url = (string) $form['url'];
	 			log_message('debug', 'url: '.$url);
	 			$title = (string) $form;
	 			log_message('debug', 'title: '.$title);
	 			$query = $this->db->get_where('forms', array ('url' => $url));
	 			if ($query->num_rows() > 0)
	 			{
	 				$this->db->where('url', $url);
	 				$this->db->update('forms', array('title'=> $title)); // STILL NEEDS TO BE TESTED
	 			}
	 			else
	 			{
	 				$this->db->insert('forms', array('subdomain' => $this->_generate_subdomain(), 'url' => $url, 'title' => $title));
	 			}
			}		
 		log_message('debug', 'formlist: '.$formlist->asXML());
 		return TRUE;
 		}
 		else
 		{
 			log_message('error', 'error loading formlist');
 			return FALSE;
 		}
 	}
    
    private function _generate_subdomain()
    {
    	$result_num = 1;
    	$subdomain = NULL;
    	
    	while ($result_num !== 0)
    	{
    		$subdomain = 'a'.rand(0,999);
    		$query = $this->db->get_where('forms', array('subdomain' => $subdomain));
    		$result_num =  $query->num_rows();
    	}
    	return $subdomain;
    }
    
    public function get_survey_list()
    {
    	//log_message('debug', 'getting survey list');
    	$this->db->select('subdomain, title');
    	$query = $this->db->get('forms');
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
    
    //returns the form format as an object   NOT USED ANYMORE! 
    public function get_form_format($id = NULL, $live = TRUE)
    {
		if (!isset($id))
    	{
    		$id = $this->subdomain;
    	}
    	$format = NULL;
    	//get the basic survey form information
    	$this->db->from('surveys');
    	$this->db->where('subdomain',$id);
    	if (isset($live)) {
    		// if $live is NULL this means that both published surveys will be returned
    		$this->db->where('survey_live',$live);
    	}
    	$this->db->select('version, country, sector, name, year, key, key_label');
    	$this->db->limit(1);
    	$query = $this->db->get();
    	
    	if ($query->num_rows() === 1)//result should have only 1 row
    	{	
    		$format = $query->row(); 
	    	
	    	$this->db->select('
	    		survey_questions.id_html, 
	    		survey_questions.label, 
	    		survey_questions.description, 
	    		survey_questions.type, 
	    		survey_questions.input, 
	    		survey_questions.step, 
	    		survey_questions.max, 
	    		survey_questions.required, 
	    		
	    		survey_questions_options.option_labels, 
	    		survey_questions_options.option_values, 
	    		
	    		survey_questions_map.sequence
	    	');
	    	$this->db->from('survey_questions_map');
	    	$this->db->where_in('survey_questions_map.id', array('ALL', $id));

	    	//join to add the survey questions
	    	$this->db->join('survey_questions', 
	    		'survey_questions_map.question_id=survey_questions.id', 'right');
	    		    	
	    	//join to add the survey question options
	    	$this->db->join('survey_questions_options', 
	    		'survey_questions.options_id = survey_questions_options.id', 'left');
	    	
	    	//order by sequence if sequence is provided
	    	$this->db->order_by('survey_questions_map.sequence', 'asc');
	    	
	    	$query = $this->db->get();
	    	$result = $query->result();
	    	
	    	//options are stored as serialized arrays in db and need to be unserialized
	    	foreach ($result as $question)
	    	{
	    		$option_labels = $question -> option_labels;
	    		$question -> option_labels = unserialize($option_labels);	
	    		
	    		$option_values = $question -> option_values;
	    		$question -> option_values = unserialize($option_values);
	    	}
	    	
	    	$format -> questions = $result;
	    	
	    	log_message('debug', 'form_format loaded:');
	    }
		return $format;
	}
    
    // attempts to save a survey form format created in the survey builder
    private function _set_form_format()
    {
    	//$this->db->from('surveys');
    	//$this->db->where(array('subdomain'=>$survey_subdomain, 'live'=>TRUE));
    	//$this->db->limit(1); 
    }
    
    // tries to insert received survey data and returns a result object
    public function add_survey_data($data, $subdomain)
    {
    
    	//ADD XSS CHECK
    	
    	$survey_form_data = $data['surveyForms'];
		//$feedback_data = $data['feedback'];
		//$log_data = $data['log'];
			
		$survey_table = strtoupper($subdomain).'_survey_data';
		//$version = $data_received['version'];
			
		// ADD LOGIC to save version and table name in a separate table and compared received version with stored version. If different add logic to add columns where necessary. Cope with two surveyForms received in different versions....
					
		// ADD CI LOGIC for CREATE TABLE IF NOT EXISTS? (or create table elsewhere)
		
		//$record_names = array(); 
		//$insert_data = array(); // THIS VARIABLE SHOULD BE REMOVED, CHANGE FOLLOWING FOREACH LOOP, USE INDEX
		$record_inserted = array();
		$record_failed = array();
		$success = false;
		
		foreach ($survey_form_data as $form_data)
		{
			$record_name = $form_data['key'];
			//remove field 'key' and 'recordType'
			unset($form_data['key']);
			unset($form_data['recordType']);
			//add a timestamp
			$form_data['lastUploaded'] = time();
			try
			{
				$this->db->insert($survey_table, $form_data);
				$record_inserted[] = $record_name;
			}
			catch (Exception $e)
			{
				$record_failed[] = $record_name;
			}
		}
		/*			
		try{
			$this->db->insert_batch($survey_table, $insert_data);
			$success = true; // DOES NOT SEEM TO BE USED IN survey.js anymore (except for log)
			$record_inserted = $record_names;
		}
		catch (Exception $e)
		{
			$success = false;
			$record_inserted = array(); //empty
		}
		*/
		$success = 'blabla'; //REMOVE THIS
		$failed_query = array();//REMOVE THIS

		// set up associative array to return as a response
		return array('success' => $success, 'inserted' => $record_inserted, 'failed' => $record_failed, 'failed queries: '=>$failed_query );

    }
    
    // returns a data object of a survey identified by its subdomain
    public function get_all_survey_data($survey_subdomain = NULL)
    {
    	if (!isset($survey_subdomain))
    	{
    		$survey_subdomain = $this->subdomain;
    	}
    
    	$table = strtoupper($survey_subdomain).'_survey_data';
    	$this->db->from($table);
    	$this->db->order_by('lastUploaded','desc'); //note that the jQuery table function does its own sorting
    	$query = $this->db->get();
    
    	return $query->result();
    }
    
}

?>