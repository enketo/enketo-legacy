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

// THIS CONTROLLER IS TEMPORARY CAN CAN BE REPLACED BY BUILDING THE FORMAT DIRECTLY IN THE survey_view

class Survey_format extends CI_Controller {

	public function index()
	{
		log_message('debug', 'going to load survey format');
	
		$this->load->helper(array('subdomain','url', 'json'));
		$subdomain = get_subdomain(); //from subdomain helper
		$this->load->model('Survey_model','',TRUE);
				
		if (isset($subdomain))
		{
			if ($this->Survey_model->is_live_survey($subdomain))
			{
				$format_obj = $this->Survey_model->get_form_format($subdomain);
				$format_json = json_format(json_encode($format_obj));
				
				$data = array('survey_form_format_json' => $format_json);
				
				if ($data['survey_form_format_json']){
					log_message('debug', 'loaded format, going to load view');
					$this->load->view('survey_format_view',$data);
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
	
	// show format for any existing surveys (published or unpublished)
	public function show_if_exists()
	{
		$this->load->helper(array('subdomain','url', 'json'));
		$subdomain = get_subdomain(); //from subdomain helper
		$this->load->model('Survey_model','',TRUE);
				
		if (isset($subdomain))
		{
			if ($this->Survey_model->is_existing_survey($subdomain))
			{
				$format_obj = $this->Survey_model->get_form_format($subdomain, NULL);
				$format_json = json_format(json_encode($format_obj));
				
				$data = array('survey_form_format_json' => $format_json);
				
				if ($data['survey_form_format_json']){
					log_message('debug', 'loaded survey format, going to load view');
					$this->load->view('survey_format_view',$data);
				}
				else
				{
					show_error('Survey exists but an error occurred while trying to load it', 404);
				}
			}
			else
			{
				show_error('Survey does not exist.', 404);
			}
		}
		else 
		{
			$this->load->view('survey_list_view');
		}
	}

}


?>