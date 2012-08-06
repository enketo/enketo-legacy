<?php


class Build extends CI_Controller {

	public function index()
	{
		$this->load->helper('subdomain');
		$subdomain = get_subdomain(); //from subdomain helper
		
		$this->load->model('Survey_model','',TRUE);
				
		if (isset($subdomain))
		{
			show_404();
		}
		else 
		{
			$data = array('offline'=>FALSE, 'title_component'=>'build');
			$this->load->view('build_view', $data);
		}
	}

}


?>