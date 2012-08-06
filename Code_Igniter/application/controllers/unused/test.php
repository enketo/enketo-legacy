<?php

class Test extends CI_Controller {

	
	
	public function index()
	{
		show_404('testing');
	}
	
	//javascript unit tests
	public function js()
	{
		$this->load->view('test_js_view');
	}

}


?>