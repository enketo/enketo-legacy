<?php

class Survey extends CI_Controller {

	public function index()
	{
		$this->load->helper(array('subdomain','url'));
		$subdomain = get_subdomain(); //from subdomain helper
		
		//$this->load->library('carabiner');
		
		$this->load->model('Survey_model','',TRUE);
				
		if (isset($subdomain))
		{
			if ($this->Survey_model->is_live_survey($subdomain))
			{
				$offline = $this ->config->item('application_cache'); //can be overridden here
			
				$data = array('offline'=>$offline, 'title_component'=>'survey');
								
				$this->load->view('survey_view',$data);
			}
			else
			{
				show_error('Survey does not exist, is not yet published or was taken down.', 404);
			}
		}
		else 
		{
			$this->load->view('survey_list_view');
		}
	}

}


?>