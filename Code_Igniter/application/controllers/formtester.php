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

class Formtester extends CI_Controller {
 
	public function index()
	{
		$this->load->helper('subdomain');
		$this->load->helper('url');
		$subdomain = get_subdomain(); //from subdomain helper
			
		if (isset($subdomain))
		{
			show_404();
		}
		else 
		{
			$data = array('offline'=>FALSE, 'title_component'=>'test');
			
			$default_scripts = array(
				'libraries/jquery.min.js',
				'libraries/bootstrap/js/bootstrap.min.js',
				'/libraries/jdewit-bootstrap-timepicker/js/bootstrap-timepicker.js',
				'/libraries/bootstrap-datepicker/js/bootstrap-datepicker.js',
				'/libraries/bootstrap-select.js',
				'libraries/modernizr.min.js',
				'libraries/xpathjs_javarosa/build/xpathjs_javarosa.min.js',
				'libraries/jquery.form.js',
				'libraries/vkbeautify.js',
				"http://maps.googleapis.com/maps/api/js?key=".$this->config->item('google_maps_api_v3_key')."&sensor=false"
			);
			$default_stylesheets = array
			(
				//array( 'href' => '/libraries/bootstrap/css/bootstrap.min.css', 'media' => 'all'),
				array( 'href' => '/css/styles.css', 'media' => 'all'),
				array( 'href' => '/css/print.css', 'media' => 'print')
			);

			if (ENVIRONMENT === 'production')
			{
				$data['scripts'] = array_merge($default_scripts, array(
					'js-min/test-all-min.js'
				));
			}
			else
			{
				$data['scripts'] = array_merge($default_scripts, array(
					'js-source/common.js',
					'js-source/form.js',
					'js-source/test.js',
					'js-source/connection.js',
					'js-source/debug.js'
				));
			}
			$data['stylesheets'] = $default_stylesheets;
			$this->load->view('test_view', $data);
		}
	}
}
?>
