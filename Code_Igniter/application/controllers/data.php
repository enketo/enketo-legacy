<?php

//This controller for AJAX POSTS simply directs to a model and returns a response

class Data extends CI_Controller {

	function __construct() {
			parent::__construct();
			$this->load->model('Survey_model', '', TRUE);
			$this->load->helper(array('subdomain','url'));
		
	}

	public function index()
	{
		show_404();
	}
	
	public function upload()
	{
		$subdomain = get_subdomain(); //from subdomain helper
		$data_received = $this->input->post(); //returns FALSE if there is no POST data
		
		if ($data_received && $this->Survey_model->is_live_survey($subdomain))
		//NOTE: the second condition prevents submission of data of existing but 'no-longer-live' surveys!
		{
			$response = $this->Survey_model->add_survey_data($data_received, $subdomain);			
		}
		else
		{
			$response = array('error'=>'no data received or survey not live');
		}
		
		echo json_encode($response);
	}

	// could be used to allow sending of server data to client (for editing e.g.)
	public function download()
	{
	}

}


?>

