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

class Front extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->helper(array('subdomain', 'url'));
		$subdomain = get_subdomain();
		$this->load->database();
		log_message('debug', 'Front controller started');
		if (!empty($subdomain)) {
			log_message('debug', 'front controller loaded with subdomain: '.$subdomain.' -> sending 404');
			show_404();
		}
	}

	public function index()
	{
		$default_library_scripts = array(
			'/libraries/enketo-core/lib/jquery.min.js',
			'/libraries/enketo-core/lib/bootstrap.min.js',
			'/libraries/enketo-core/lib/modernizr.min.js'
		);
		$default_main_scripts = array(
			'/libraries/enketo-core/src/js/utils.js',
			'/js-source/gui.js',
			'/js-source/connection.js',
			'/js-source/front.js'
		);
		$data = array(
			'offline'			=> FALSE, 
			'title_component'	=> 'home', 
			'robots'     		=> TRUE//,
			//'number_launched'	=> $this->_get_db_number_launched()
		);

		if (ENVIRONMENT === 'production') {
			$data['scripts'] = array(
				//'/libraries/libraries-all-min.js',
				'/build/js/front.min.js'
			);
		} else {
			$data['scripts'] = array_merge(
				$default_library_scripts,
				$default_main_scripts
			);
		}
		
		if (strlen($this->config->item('integrated')) > 0) {
			$data['stylesheets'] = array(
				array( 'href' => '/build/css/front.css', 'media' => 'screen')
			);
			$this->load->view('front_view_bare', $data);
		} else {
			$data['stylesheets'] = array(
				array( 'href' => '/build/css/private/front.css', 'media' => 'screen')
			);
			$this->load->view('private_views/front_view', $data);
		}	
	}

	/*
	public function get_number_launched() {
		echo $this->_get_number_launched();
	}

	private function _get_number_launched() {
		$this->load->model('Survey_model','',TRUE);
		return (int) $this->Survey_model->number_surveys(NULL, FALSE);
	}

	public function get_number_launched_everywhere() {
		$deployments = array(
			"enketo.formhub.org" => "https://enketo.formhub.org",
			"enketo.org" => "https://enketo.org"
		);
		$result = array('total' => 0);

		foreach ($deployments as $name => $url) {
			$this->load->helper('subdomain');
			$number = (full_base_url() == $url.'/') ? 
				$this->_get_number_launched() : file_get_contents($url.'/front/get_number_launched');
			if (!empty($number)) {
				$result[$name] = (int) $number;
				$result['total'] += (int) $number;
			}
		}
		$this->_set_db_number_launched($result['total']);
		echo json_encode($result);
	}

	private function _get_db_number_launched() {
		$this->db->select('forms_launched');
		$query = $this->db->get('properties');
		if ($query->num_rows() > 0) {
    		return $query->row()->forms_launched;
		}
		else return '?';
	}
	
	private function _set_db_number_launched($number) {
		$this->db->update('properties', array('forms_launched' => $number));
	}
	*/
}
?>
