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


class Form extends CI_Controller {
/*
 *	Outputs the form in original XML or transformed HTML format
 *	(used for testing and troubleshooting only)
 *
*/
	private $subdomain;

	public function __construct()
       {
            parent::__construct();
            $this->load->helper(array('subdomain','url', 'json'));
			$this->subdomain = get_subdomain(); //from subdomain helper
			$this->load->model('Survey_model','',TRUE);
			$this->load->model('Form_model');
			if ($this->config->item('auth_support'))
			{
				$this->load->add_package_path(APPPATH.'third_party/form_auth');
			}
			$this->load->library('form_auth');
			$this->credentials = $this->form_auth->get_credentials();
       }
	
	public function index()
	{		
		show_error('Page not found', 404);
	}
	
	//output as unchanged xml
	public function xml()
	{
		if (isset($this->subdomain))
		{
			if ($this->Survey_model->is_launched_survey($this->subdomain))
			{				
				$server_url = $this->Survey_model->get_server_url();
				$form_id = $this->Survey_model->get_form_id();					
				
				if (isset($server_url) && isset($form_id))
				{
					$this->Form_model->setup($server_url, $form_id, $this->credentials);
					$xml =  $this->Form_model->get_form_xml();
					$this->output->set_content_type('text/xml');
					$this->output->set_output($xml->saveXML());
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
			show_error('Page does not exist');
		}
	}
	
	//output as transformed html
	public function html()
	{				
		if (isset($this->subdomain))
		{
			if ($this->Survey_model->is_launched_survey($this->subdomain))
			{
				$server_url = $this->Survey_model->get_server_url();
				$form_id = $this->Survey_model->get_form_id();					
				
				if (isset($server_url) && isset($form_id))
				{
					$this->Form_model->setup($server_url, $form_id, $this->credentials);
					$form = $this->Form_model->get_transform_result_obj();			
					log_message('debug', 'transform result: '.json_encode($form));
					if (!empty($form) && !empty($form->html))
					{
						$data = array('form'=>$form->html);
						log_message('debug', 'going to load bare html 5view of form');
						$this->load->view('form_html5_view', $data);
					}
					else
					{
						show_error('Error loading form.', 404);
					}
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
			show_error('Page does not exist');
		}
	}

}


?>