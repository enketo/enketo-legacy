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
		show_404();
	}

	// this alias function should be removed once formhub has changed to using get_survey_url()
	public function launchSurvey(){
		$this->get_survey_url();
	}

	public function get_survey_url()
	{
		$this->load->helper('subdomain');
		$this->load->model('Survey_model', '', TRUE);
		$subdomain = get_subdomain();

		if (isset($subdomain))
		{
			show_404();
		}
		else 
		{
			extract($_POST);

			if (!empty($server_url) && strlen(trim($server_url)) > 1 && !empty($form_id) && strlen(trim($form_id)) > 1)
			{
				$server_url = trim($server_url);
				$form_id = trim($form_id);
				
				$submission_url = (strrpos($server_url, '/') === strlen($server_url)-1) ? 
					$server_url.'submission' :$server_url.'/submission';

				$data_url = (empty($data_url)) ? NULL : $data_url;
				$email = (empty($email)) ? NULL : $email;

				$result = $this->Survey_model->launch_survey($server_url, $form_id, $submission_url, $data_url, $email);

				echo json_encode($result);
			}	
			else
			{
				echo json_encode(array('success'=>FALSE, 'reason'=>'empty'));
			}
		}
	}

	public function get_survey_preview_url()
	{
		
		$this->load->helper('subdomain');
		$this->load->model('Survey_model');
		$subdomain = get_subdomain();
		
		if (isset($subdomain))
		{
			show_404();
		}
		else 
		{
			extract($_GET);
			if (!empty($server_url) && strlen(trim($server_url)) > 1 && !empty($form_id) && strlen(trim($form_id)) > 1)
			{
				$server_url = trim($server_url);
				$form_id = trim($form_id);
				$result = array
                (
                    'success' => TRUE, 
                    'preview_url' => $this->Survey_model->get_preview_url($server_url, $form_id), 
                    'reason' => NULL
                );
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
