<?php

class Survey extends CI_Controller {

	public function index()
	{
		$this->load->helper(array('subdomain','url'));
		$subdomain = get_subdomain(); //from subdomain helper
		
		//$this->load->library('carabiner');
		
		$this->load->model('Survey_model','',TRUE);
		$this->load->model('Form_model', '', TRUE);
				
		if (1>2)//isset($subdomain))
		{
			//if ($this->Survey_model->is_live_survey($subdomain))
			if ($this->Survey_model->is_existing_survey($subdomain))
			{
				$offline = $this ->config->item('application_cache'); //can be overridden here
				$form_url= $this->Survey_model->get_form_url($subdomain);
				
				$transf_result = $this->Form_model->transform($form_url);
				//var_dump($transf_result);
				//log_message('debug', 'transform result: '.$transf_result->asXML());
				$form = $transf_result->form->asXML();
				$form_data = $transf_result->instance->asXML();
				//remove line breaks
				$form_data = str_replace(array("\r", "\r\n", "\n"), '', $form_data);
				//$form_data = preg_replace("\>/s*",">", $form_data);
				if (isset($form))
				{
					$data = array(
						'offline'=>$offline, 
						'title_component'=>'survey', 
						'form'=> $form,
						'form_data'=> $form_data
						);
					//log_message('debug', 'form string: '.$form->asXML());
					if (ENVIRONMENT === 'production')
					{
						//$this->output->cache(60);
						$data['scripts'] = array();
					}
					else
					{

					}
					$this->load->view('survey_view',$data);
				}
				else
				{
					show_error('Error loading form.', 404);
				}				
			}
			else
			{
				show_error('Survey does not exist, is not yet published or was taken down.', 404);
			}
		}
		else 
		{
			//$surveys = $this->Survey_model->get_survey_list();
			//log_message('debug', 'surveys: '.json_encode($surveys));
			$data = array('offline'=>FALSE, 'title_component'=>'survey');//, 'surveys' => array());
			//if (isset($surveys) && $surveys !== FALSE)
			//{
				//$data['surveys'] = $surveys);					
			//}
			//log_message ('debug', 'going to load list view with data: '.json_encode($data));
			if (ENVIRONMENT === 'production')
			{
				$data['scripts'] = array();//'js-min/surveyfront-all-min.js');
			}
			else
			{
				$data['scripts'] = array();//'js-source/__common.js');
			}

			$this->load->view('survey_list_view', $data);			
		}
	}

	public function update_list()
	{
		$this->load->model('Survey_model', '', TRUE);
		$success = $this->Survey_model->update_formlist();
		if ($success === TRUE)
		{
			echo 'form list has been updated';
		}
		else 
		{
			echo 'error updating form list';
		}
	}
}


?>