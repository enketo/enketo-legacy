<?php
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
		//return the transformed form		
		if (isset($_FILES['xml_file']))
		{
			$file_path_to_XML_form = $_FILES['xml_file']['tmp_name'];

			$result = $this->Form_model->transform($file_path_to_XML_form, TRUE);

			//log_message('debug', 'controller received: '.$response)
		}
		//return the transformed form
		//ADD CHECK HERE FOR VALIDITY OF URLS
		else if (isset($_POST['xml_url']) && strlen($_POST['xml_url']) > 0)
		{
			$url_to_XML_form = $_POST['xml_url'];
			log_message('debug', 'xml url received: '.$url_to_XML_form);
			$result = $this->Form_model->transform($url_to_XML_form, TRUE);

		}
		//return a html list of forms
		else if (isset($_POST['server_url']) && strlen($_POST['server_url']) > 0)
		{
			$url_to_server = $_POST['server_url'];
			log_message('debug', 'server url received: '.$url_to_server);
			$result = $this->Form_model->getFormList($url_to_server);
		}
		else
		{
			(isset($FILES['xml_file']['error'])) ? $error = $_FILES['xml_file']['error'] : $error = 'upload error (no file or not a valid url)';
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