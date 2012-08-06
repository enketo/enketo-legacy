<?php
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
			if (ENVIRONMENT === 'production')
			{
				$data['scripts'] = array(
					base_url('js-min/launch-all-min.js')
				);
			}
			else
			{
				$data['scripts'] = array(
					base_url('js-source/__common.js'),
					base_url('js-source/__form.js'),
					base_url('js-source/__launch.js'),
					base_url('js-source/__debug.js')
				);
			}
			$this->load->view('launch_view', $data);
		}
	}
}
?>