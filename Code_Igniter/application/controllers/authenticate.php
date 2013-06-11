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

class Authenticate extends CI_Controller {

	private $auth_support;

	function __construct() {
		parent::__construct();
		$this->auth_support = $this->config->item('auth_support');
		if ($this->auth_support)
		{
			$this->load->add_package_path(APPPATH.'third_party/form_auth');
			$this->load->library('form_auth');
		}
		log_message('debug', 'authentication controller initialized');
	}

	public function index()
	{
		if (!$this->auth_support) $this->login();
		else $this->form_auth->authenticate();
	}

	public function authorization_check()
	{
		if (!$this->auth_support) return FALSE;
		else return $this->form_auth->authorization_check();
	}

	public function login()
	{
		if (!$this->auth_support) $this->load->view('auth_error_view');
		else {
			log_message('debug', 'FLASHDATA:'.$this->session->flashdata('server_url'));
			$this->form_auth->login($this->session->flashdata('server_url'), $this->session->flashdata('form_id'), $this->session->flashdata('return_url'));
		}
	}

	public function logout()
	{
		if (!$this->auth_support) $this->output->set_output('Authentication not supported. You were never logged in.');
		else $this->form_auth->logout();
	}
}
?>