<?php

/**
 * Copyright 2013 Enketo LLC
 * 
 * NO UNAUTORIZED USE ALLOWED
 */

class User_model extends CI_Model {

	function __construct()
	{
		parent::__construct();
		
		$this->load->library('encrypt');
		log_message('debug', 'User Model Initialized');
	}

	function get_credentials( $session_passed=NULL )
	{
		if (!empty($session_passed)) {
			log_message('debug', 'passed session_id from trusted source: '.$session_passed);
		}
		$session_id = (!empty($session_passed)) ? $session_passed : $this->session->userdata('session_id');
		$this->db->select(array('username', 'password'));
		$query = $this->db->get_where('sessions', array('session_id' => $session_id), 1); 

		if ($query->num_rows() !== 1) {
			log_message('error', 'db query for session_id returned '.$query->num_rows().' results.');
			return NULL;   
		}
		
		$row = $query->row_array();

		if (empty($row['username']) || empty($row['password'])) {
			log_message('debug', 'found session '.$session_id.' but WITHOUT a stored username and/or password');
			return NULL;
		}
		
		//log_message('debug', 'db query for user credentials returning row: '.json_encode($row));
		log_message('debug', 'found session '.$session_id.' WITH username and password! Yay!');
		$username_enc = $row['username'];
		$password_enc =	$row['password'];

		return array(
			'username' => $this->encrypt->decode($username_enc),
			'password' => $this->encrypt->decode($password_enc)
		);
	}

	function set_credentials($username, $password, $remember=FALSE)
	{
		if (function_exists('mcrypt_encrypt')) {
			//log_message('debug', 'username, password plain: '.$username.', '.$password);
			$data = array(
				'username' => $this->encrypt->encode($username),
				'password' => $this->encrypt->encode($password)
			);

			if ($remember)
			{
				//$this->config->set_item('sess_expire_on_close', FALSE); 
				//$this->config->set_item('sess_expiration', 7 * 24 * 60 * 60);
			} else {
				//$this->config->set_item('sess_expire_on_close', TRUE); 
				//$this->config->set_item('sess_expiration', 60 * 60);
			}

			log_message('debug', 'credentials saved in database for session id: '.$this->session->userdata('session_id'));
			$session_id = $this->session->userdata('session_id');
			$this->db->where('session_id', $session_id);
			$this->db->update('sessions', $data);	
		} else {
			log_message('error', 'MCrypt library not installed on server');
		}
	}

	function destroy_credentials()
	{
		$this->session->sess_destroy();
	}
}
?>
