<?php

// THIS CONTROLLER IS TEMPORARY CAN CAN BE REPLACED BY BUILDING THE FORMAT DIRECTLY IN THE survey_view

class ODK_survey_format extends CI_Controller {

	public function index()
	{
		$this->load->helper(array('subdomain','url', 'json'));
		$subdomain = get_subdomain(); //from subdomain helper
		$this->load->model('Survey_model','',TRUE);
				
		if (isset($subdomain))
		{
			if ($this->Survey_model->is_live_survey($subdomain))
			{
				//$format_obj = $this->Survey_model->get_form_format($subdomain);
				//$format_json = json_format(json_encode($format_obj));
				
				$data = array(
					'ODK_form_url' => 'https://rapaide.appspot.com/formXml?formId=build_Test-Form-1_1329518360'
				);
				
				if ($data['ODK_form_url']){
					log_message('debug', 'going to load view of ODK Aggregate xml format');
					$this->load->view('ODK_survey_format_view',$data);
				}
				else
				{
					show_error('Survey exists but an error occurred while trying to load it', 404);
				}
			}
			else
			{
				show_error('Survey does not exist or is not yet published.', 404);
			}
		}
		else 
		{
			$this->load->view('survey_list_view');
		}
	}
	
	//// show format for any existing surveys (published or unpublished)
	//public function show_if_exists()
	//{
	//	$this->load->helper(array('subdomain','url', 'json'));
	//	$subdomain = get_subdomain(); //from subdomain helper
	//	$this->load->model('Survey_model','',TRUE);
	//			
	//	if (isset($subdomain))
	//	{
	//		if ($this->Survey_model->is_existing_survey($subdomain))
	//		{
	//			$format_obj = $this->Survey_model->get_form_format($subdomain, NULL);
	//			$format_json = json_format(json_encode($format_obj));
	//			
	//			$data = array('survey_form_format_json' => $format_json);
	//			
	//			if ($data['survey_form_format_json']){
	//				log_message('debug', 'loaded format, going to load view');
	//				$this->load->view('survey_format_view',$data);
	//			}
	//			else
	//			{
	//				show_error('Survey exists but an error occurred while trying to load it', 404);
	//			}
	//		}
	//		else
	//		{
	//			show_error('Survey does not exist.', 404);
	//		}
	//	}
	//	else 
	//	{
	//		$this->load->view('survey_list_view');
	//	}
	//}

}


?>