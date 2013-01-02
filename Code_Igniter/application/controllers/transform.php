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

class Transform extends CI_Controller {
/*
 *	This Controller is used to output a transformed JR XML form as HTML
 *	the output includes the (error) messages to form a full transformation report
 *
*/	
	
	function __construct()
	{
		parent::__construct();
		$this->load->model('Form_model', '', TRUE);
	}
	
	public function index()
	{
		show_404();
	}

	public function get_html_form()
	{			
		$result;
		extract($_POST);
	
		if ($_FILES['xml_file']['size'] > 0)
		{
			log_message('debug', 'file path: '.$_FILES['xml_file']['tmp_name']);
			$file_path_to_XML_form = $_FILES['xml_file']['tmp_name'];
			$result = $this->Form_model->transform(NULL, NULL, $file_path_to_XML_form, TRUE);
		}
		else if (isset($form_id) && strlen($form_id)>0 && isset($server_url) && strlen($server_url) > 0 )
		{
			// ADD CHECK HERE FOR VALIDITY OF URLS
			log_message('debug', 'server url received: '.$server_url.', id: '+$form_id);
			$result = $this->Form_model->transform($server_url, $form_id, NULL,  TRUE);
		}
		else
		{
			$error = (isset($FILES['xml_file']['error'])) ? $_FILES['xml_file']['error'] : 'upload error (no file or not a valid server url and form ID)';
			$result = new SimpleXMLElement('<root></root>');
			$upload_errors = $result->addChild('xmlerrors');
			$message = $upload_errors->addChild('message',$error);
			$message->addAttribute('level', '3');
		}
		$this->output
			->set_content_type('text/xml')
			->set_output($result->asXML());
	}
}

?>