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
			$data = array(
				'offline'=>FALSE, 
				'title_component'=>'form-tester',
				'robots'=>TRUE
			);
			
			$default_stylesheets = array
			(
				array( 'href' => '/build/css/formtester.css', 'media' => 'all'),
				array( 'href' => 'build/css/webform_print_formhub.css', 'media' => 'print')
			);

			$data['scripts'] = (ENVIRONMENT === 'production') 
            	? array(array('src' => '/build/js/webform-tester-combined.min.js'))
            	: array(array('src' => '/lib/enketo-core/lib/require.js', 'data-main' => '/src-js/main-webform-tester.js'));

			$data['stylesheets'] = $default_stylesheets;
			//$this->output->cache(10);
			$this->load->view('formtester_view', $data);
		}
	}
}
?>
