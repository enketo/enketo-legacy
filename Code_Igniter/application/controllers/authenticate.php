<?php

/**
 * Copyright 2013 Enketo LLC
 * 
 * NO UNAUTORIZED USE ALLOWED
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
		if (!$this->auth_support) $this->load->view('auth_error_view');
		else $this->form_auth->authenticate();
	}

	public function authorization_check()
	{
		if (!$this->auth_support) return FALSE;
		else return $this->form_auth->authorization_check();
	}

	public function logout()
	{
		if (!$this->auth_support) $this->output->set_output('Authentication not supported. You were never logged in.');
		else $this->form_auth->logout();
	}
}
?>