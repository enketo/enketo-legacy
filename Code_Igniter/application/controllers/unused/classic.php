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

class Classic extends CI_Controller {

	public function index()
	{
		$this->load->helper(array('subdomain','url'));
		$subdomain = get_subdomain(); //from subdomain helper
		
		//$this->load->library('carabiner');
		
		$this->load->model('Survey_model','',TRUE);
		$this->load->model('Form_model', '', TRUE);
				
		if (isset($subdomain))
		{
			//if ($this->Survey_model->is_live_survey($subdomain))
			if ($this->Survey_model->is_launched_survey())
			{
				$offline = $this ->config->item('application_cache'); //can be overridden here
				$server_url= $this->Survey_model->get_server_url();
				$form_id = $this->Survey_model->get_form_id();

				if ($form_id && $server_url)
				{
					$transf_result = $this->Form_model->transform($server_url, $form_id, FALSE);
					//log_message('debug', $transf_result->asXML());
					//var_dump($transf_result);
					//log_message('debug', 'transform result: '.$transf_result->asXML());
					$form = $transf_result->form->asXML();
					//log_message('debug', $form);
					$form_data = $transf_result->instance->asXML();
					//log_message('debug', $form_data);
					//remove line breaks and tabs
					$form_data = str_replace(array("\r", "\r\n", "\n", "\t"), '', $form_data);
					//$form_data = preg_replace("\>/s*",">", $form_data);
					if (strlen($form)>0 && strlen($form_data)>0)
					{
						$data = array(
							'offline'=>$offline, 
							'title_component'=>'classic', 
							'form'=> $form,
							'form_data'=> $form_data
							);
						$common_scripts = array(
							base_url('libraries/jquery.min.js'),
							base_url('libraries/jquery-ui/js/jquery-ui.custom.min.js'),
							base_url('libraries/jquery-ui-timepicker-addon.js'),
							base_url('libraries/jquery.multiselect.min.js'),	
							base_url('libraries/modernizr.min.js'),
							base_url('libraries/xpathjs_javarosa/build/xpathjs_javarosa.min.js'),
							base_url('libraries/FileSaver.min.js'),
							base_url('libraries/BlobBuilder.min.js'),
							base_url('libraries/vkbeautify.js'),
							"http://maps.googleapis.com/maps/api/js?key=".$this->config->item('google_maps_api_v3_key')."&sensor=false"
						);

						//log_message('debug', 'form string: '.$form->asXML());
						if (ENVIRONMENT === 'production')
						{
							//$this->output->cache(60);
							$data['scripts'] = array_merge($common_scripts, array(
								base_url('js-min/webform-all-min.js')
							));
						}
						else
						{		
							$data['scripts'] = array_merge($common_scripts, array(
								base_url('js-source/__common.js'),
								base_url('js-source/__storage.js'),
								base_url('js-source/__cache.js'),
								base_url('js-source/__connection.js'),
								base_url('js-source/__form.js'),
								base_url('js-source/__survey_controls.js'),
								base_url('js-source/__webform.js'),
								base_url('js-source/__debug.js')
							));
						}
						$this->load->view('classic_view',$data);
					}
					else
					{
						show_error('Form not available (or an error occurred) ', 404);
					}				
				}
				else 
				{
					show_error('Survey not properly launched, missing info in database', 404);
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
				$data['scripts'] = array(
					base_url('js-min/front-all-min.js')
				);
			}
			else
			{
				$data['scripts'] = array(
					base_url('js-source/__common.js')
				);
			}

			$this->load->view('front_view', $data);			
		}
	}
}


?>