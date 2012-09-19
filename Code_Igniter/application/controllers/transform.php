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
	
	public function transform_post_jr_form()
	{
		//$data_received = $this->input->post('xml_file'); //returns FALSE if there is no POST data
				
		$result;

		//extract data from the post
		extract($_POST);

		//if a file is posted, don't look anything else		
		if (isset($_FILES['xml_file']))
		{
			log_message('debug', 'file path: '.$_FILES['xml_file']['tmp_name']);
			$file_path_to_XML_form = $_FILES['xml_file']['tmp_name'];
			$result = $this->Form_model->transform(NULL, NULL, $file_path_to_XML_form, TRUE);
			//log_message('debug', 'controller received: '.$response)
		}
		else if (isset($form_id) && strlen($form_id)>0 && isset($server_url) && strlen($server_url) > 0 ) //isset($_POST['xml_url']) && strlen($_POST['xml_url']) > 0)
		{
			// ADD CHECK HERE FOR VALIDITY OF URLS
			//$url_to_XML_form = $_POST['xml_url'];
			log_message('debug', 'server url received: '.$server_url.', id: '+$form_id); //$url_to_XML_form);
			$result = $this->Form_model->transform($server_url, $form_id, NULL,  TRUE);
		}
		//return a html list of forms
		else if (isset($server_url) && strlen($server_url) > 0)
		{
			//$url_to_server = $_POST['server_url'];
			log_message('debug', 'server url received: '.$server_url);
			$result = $this->Form_model->get_formlist_HTML($server_url);
		}
		else
		{
			$error = (isset($FILES['xml_file']['error'])) ? $_FILES['xml_file']['error'] : 'upload error (no file or not a valid server url and/or form ID)';
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