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
				$form_id = $this->Survey_model->get_form_id()						
				if (isset($server_url) && isset($form_id))
				{
					//$data = array('form' => file_get_contents($form_url));
					//log_message('debug', 'form: '.$data['form']);
					
					header ("Content-Type:text/xml");
					//readfile($form_url);
					
					//$this->load->view('form_xml_view',$data);
					//$this->output
					//	->set_content_type('xml')
					//	->set_output(file_get_contents($form_url));
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
			if ($this->Survey_model->is_existing_survey($this->subdomain))
			{
				$form_url = $this->Survey_model->get_form_url($this->subdomain);				
				if (isset($form_url))
				{
					$this->load->model('Form_model');
					$transf_result = $this->Form_model->transform($form_url);			
					$form = $transf_result->form;
					if (isset($form))
					{
						$data = array('form'=>$form->asXML());
						log_message('debug', 'going to load bare html 5view of form');
						$this->load->view('form_html5_view',$data);
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