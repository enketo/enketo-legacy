<?php

class Entry extends CI_Controller {

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
				$offline = TRUE;			
				//can be overridden here for just this controller
				(ENVIRONMENT === 'production') ? $offline = TRUE : $offline = $this ->config->item('application_cache'); 
			
				$data = array('offline'=>FALSE, 'title_component'=>'entry');
								
				$this->load->view('entry_view',$data);
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