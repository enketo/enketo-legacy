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
			
			$default_library_scripts = array(
				'/libraries/enketo-core/lib/jquery.min.js',
				'/libraries/enketo-core/lib/bootstrap.min.js',
				'/libraries/enketo-core/lib/bootstrap-timepicker/js/bootstrap-timepicker.js',
				'/libraries/enketo-core/lib/bootstrap-datepicker/js/bootstrap-datepicker.js',
				'/libraries/enketo-core/lib/modernizr.min.js',
				'/libraries/enketo-core/lib/xpath/build/xpathjs_javarosa.min.js',
				'/libraries/vkbeautify.js'
			);
			$default_main_scripts = array(
				'/libraries/enketo-core/src/js/utils.js',
				'/js-source/helpers.js',
				'/js-source/gui.js',
				'/libraries/enketo-core/src/js/form.js',
				'/js-source/storage.js',
				'/libraries/enketo-core/src/js/widgets.js',
				'/js-source/survey_controls.js',
				'/js-source/connection.js',
				'/js-source/debug.js',
				'/js-source/formtester.js'
			);
			$default_stylesheets = array
			(
				array( 'href' => '/build/css/formtester.css', 'media' => 'all'),
				array( 'href' => 'build/css/webform_print.css', 'media' => 'print')
			);

			if (ENVIRONMENT === 'production')
			{
				$data['scripts'] = array
				(
					'/build/js/formtester.min.js'
				);
			}
			else
			{
				$data['scripts'] = array_merge
				(
					$default_library_scripts, 
					$default_main_scripts
				);
			}
			$data['stylesheets'] = $default_stylesheets;
			//$this->output->cache(10);
			$this->load->view('formtester_view', $data);
		}
	}
}
?>
