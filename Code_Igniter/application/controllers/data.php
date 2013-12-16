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
		log_message('debug', 'Data controller initialized');
	}

	public function index()
	{
		show_404();
	}

	public function submission()
	{
		if ($this->config->item('auth_support')) {
			$this->load->add_package_path(APPPATH.'third_party/form_auth');
		}

		$this->load->library(array('form_auth', 'openrosa'));
		$time_start = time();
		$submission_url = $this->Survey_model->get_form_submission_url();

		extract($_POST);

		if (!$submission_url) {
			$msg = 'OpenRosa server submission url not set';
			log_message('error', $msg);
			return $this->output->set_status_header(500, $msg);
		}

		if(!isset($xml_submission_data) || $xml_submission_data == '') {
			$msg = 'Enketo server did not receive data';
			log_message('error', $msg);
			return $this->output->set_status_header(500, $msg );
		}
		$xml_submission_filepath = "/tmp/".random_string('alpha', 10).".xml";//*/"/tmp/data_submission.xml";
		$xml_submission_file = fopen($xml_submission_filepath, 'w');
			
		if (!$xml_submission_file) {
			$msg = "Issue creating file from uploaded XML data (Enketo server)";
			log_message('error', $msg);
			return $this->output->set_status_header(500, $msg);
		}

		fwrite($xml_submission_file, $xml_submission_data);
		fclose($xml_submission_file);
		
		$credentials = $this->form_auth->get_credentials();
		//log_message('debug', 'amount of files allowed in php.ini: '.ini_get('max_file_uploads'));
		$response = $this->openrosa->submit_data($submission_url, $xml_submission_filepath, $_FILES, $credentials);
		unlink ($xml_submission_filepath);

		if (!empty($response) && !empty($response['status_code']) && ($response['status_code'] == '201')) {
			//log_message('debug', 'increasing submission count');
			$this->Survey_model->increase_submission_count();
		}

		if ($response['status_code'] !== '201' || $response['status_code'] !== '202') {
			log_message('error', 'result of submission to '.$submission_url.': '.json_encode($response));
		}
		//log_message('debug', 'result of submission: '.json_encode($response));
		//log_message('debug', 'data submission took '.(time()-$time_start).' seconds.');
		$this->output->set_status_header($response['status_code']);
		$this->output->set_output($response['xml']);
	}

	public function max_size()
	{
		$this->load->library('openrosa');
		$submission_url = $this->Survey_model->get_form_submission_url();
		if ($submission_url) {
			$this->output->set_output($this->openrosa->request_max_size($submission_url));
		} else {
			show_404();
		}
	}
}
?>

