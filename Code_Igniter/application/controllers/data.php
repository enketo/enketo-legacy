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

class Data extends CI_Controller {

	function __construct() {
			parent::__construct();
			$this->load->model('Survey_model', '', TRUE);
			$this->load->model('Instance_model', '', TRUE);
			$this->load->helper(array('subdomain','url', 'string', 'http'));
		
	}

	public function index()
	{
		show_404();
	}

	public function submission()
	{
		if ($this->config->item('auth_support'))
		{
			$this->load->add_package_path(APPPATH.'third_party/form_auth');
		}
		$this->load->library(array('form_auth', 'openrosa'));
		$time_start = time();
		$submission_url = $this->Survey_model->get_form_submission_url();

		extract($_POST);

		if (!$submission_url){
			return $this->output->set_status_header(500, 'OpenRosa server submission url not set');
		}
		if(!isset($xml_submission_data) || $xml_submission_data == '')
		{
			return $this->output->set_status_header(500, 'Enketo server did not receive data');
		}
		$xml_submission_filepath = "/tmp/".random_string('alpha', 10).".xml";//*/"/tmp/data_submission.xml";
		$xml_submission_file = fopen($xml_submission_filepath, 'w');
			
		if (!$xml_submission_file)
		{
			return $this->output->set_status_header(500, "Issue creating file from uploaded XML data (Enketo server)");
		}

		log_message('debug', 'xml submission data: '.$xml_submission_data);
		fwrite($xml_submission_file, $xml_submission_data);
		fclose($xml_submission_file);
		
		$credentials = $this->form_auth->get_credentials();
		//log_message('debug', 'amount of files allowed in php.ini: '.ini_get('max_file_uploads'));
		$response = $this->openrosa->submit_data($submission_url, $xml_submission_filepath, $_FILES, $credentials);

		//log_message('debug', 'result of submission: '.json_encode($response));
		//log_message('debug', 'data submission took '.(time()-$time_start).' seconds.');
		$this->output->set_status_header($response['status_code']);//, (string) $response['xml']);
		$this->output->set_output($response['xml']);
	}

	public function max_size()
	{
		$this->load->library('openrosa');
		$submission_url = $this->Survey_model->get_form_submission_url();
		echo $this->openrosa->request_max_size($submission_url);
	}

	public function edit_url()
	{
		log_message('debug', 'edit url function started');
		$subdomain = get_subdomain();

		if (isset($subdomain))
		{
			show_404();
		}
		else 
		{
			extract($_POST);

			//trim strings first??
			if (!empty($server_url) && !empty($form_id))
			{
				//to be replaced by user-submitted and -editable submission_url
				$submission_url = (strrpos($server_url, '/') === strlen($server_url)-1) ? 
					$server_url.'submission' :$server_url.'/submission';

				$data_url = (empty($data_url)) ? NULL : $data_url;
				$email = (empty($email)) ? NULL : $email;

				$result = $this->Survey_model->launch_survey($server_url, $form_id, $submission_url, $data_url, $email);

		        if(isset($instance) && isset($instance_id) && isset($result['subdomain']))
		        {
		            $rs = $this->Instance_model->insert_instance($result['subdomain'], $instance_id,
		                $instance, $return_url);
		            if($rs !== null)
		            {
		                $result['edit_url'] = $result['edit_url'] . '?instance_id=' . $instance_id;
		            }
		            else
		            {
		              unset($result['edit_url']);
		              $result['reason'] = "someone is already editing instance";
		            }
		        }

				echo json_encode($result);
			}	
			else
			{
				echo json_encode(array('success'=>FALSE, 'reason'=>'empty'));
			}

		}
	}
}
?>

