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

class Front extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('Survey_model','',TRUE);
	}

	public function index()
	{
		$this->load->helper(array('url'));

		$default_scripts = array
		(
			'/libraries/jquery.min.js',
			'/libraries/bootstrap/js/bootstrap.min.js',
			'/libraries/modernizr.min.js'
		);
		$default_stylesheets = array
		(
			//array( 'href' => '/libraries/bootstrap/css/bootstrap.min.css', 'media' => 'screen'),
			array( 'href' => '/css/styles.css', 'media' => 'screen'),
			array( 'href' => '/css/print.css', 'media' => 'print')
		);
		$data = array(
			'offline'=>FALSE, 
			'title_component'=>'', 
			'stylesheets' => $default_stylesheets,
			'num_surveys' => $this->Survey_model->number_surveys()
		);

		if (ENVIRONMENT === 'production')
		{
			$data['scripts'] = array_merge($default_scripts, array(
				'/js-min/front-all-min.js'
			));
		}
		else
		{
			$data['scripts'] = array_merge($default_scripts, array(
				'/js-source/common.js'
			));
		}

		$integrated = $this->config->item('integrated');
		echo $integrated;
		
		if (strlen($integrated)>0)
		{
			$this->load->view('front_view_bare', $data);
		}
		else
		{
			$this->load->view('front_view', $data);
		}	
	}

	public function number_launched()
	{
		echo $this->Survey_model->number_surveys();
	} 

	//public function update_list()
	//{
	//	$success = $this->Survey_model->update_formlist();
	//	if ($success === TRUE)
	//	{
	//		echo 'form list has been updated';
	//	}
	//	else 
	//	{
	//		echo 'error updating form list';
	//	}
	//}
}


?>