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

class Launch extends CI_Controller {
 
	public function index()
	{
		$this->load->helper('subdomain');
		$this->load->helper('url');
		$subdomain = get_subdomain(); //from subdomain helper
		
		//$this->load->model('Form_model','',TRUE);
			
		if (isset($subdomain))
		{
			show_404();
		}
		else 
		{
			$data = array('offline'=>FALSE, 'title_component'=>'launch');
			
			$default_scripts = array(
				'libraries/jquery.min.js',
				'libraries/bootstrap/js/bootstrap.min.js',
				'/libraries/jdewit-bootstrap-timepicker/js/bootstrap-timepicker.js',
				'/libraries/eternicode-bootstrap-datepicker/js/bootstrap-datepicker.js',
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
					'js-min/launch-all-min.js'
				));
			}
			else
			{
				$data['scripts'] = array_merge($default_scripts, array(
					'js-source/__common.js',
					'js-source/__form.js',
					'js-source/__launch.js',
					'js-source/__debug.js'
				));
			}
			$data['stylesheets'] = $default_stylesheets;
			$this->load->view('launch_view', $data);
		}
	}

	public function launchSurvey()
	{
		
		$this->load->helper('subdomain');
		$this->load->model('Survey_model', '', TRUE);
		$this->load->model('Instance_model', '', TRUE);
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

//        if(isset($instance) && isset($instance_id) && isset($result['subdomain']))
//        {
//            $rs = $this->Instance_model->insert_instance($result['subdomain'], $instance_id,
//                $instance, $return_url);
//            if($rs !== null){
//                $result['edit_url'] = $result['edit_url'] . '?instance_id=' . $instance_id;
//            }else{
//              unset($result['edit_url']);
//              $result['reason'] = "someone is already editing instance";
//            }
//        }

				echo json_encode($result);
			}	
			else
			{
				echo json_encode(array('success'=>FALSE, 'reason'=>'empty'));
			}

		}
	}

	/**
	 * For now this function just cleans test entries in the surveys table. In the future,
	 * we could add removal of obsolete surveys (found to not be 'live' for extended period)
	 */
	public function clean()
	{
		$this->load->model('Survey_model', '', TRUE);
		$number_deleted = $this->Survey_model->remove_test_entries();
		echo $number_deleted.' test entries deleted.';
	}


}
?>
