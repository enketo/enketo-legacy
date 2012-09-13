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

	public function index()
	{
		$this->load->helper(array('url'));
	
		$data = array('offline'=>FALSE, 'title_component'=>'survey');
		
		if (ENVIRONMENT === 'production')
		{
			$data['scripts'] = array(
				base_url('js-min/front-all-min.js')
			);
		}
		else
		{
			$data['scripts'] = array(
				base_url('js-source/__common.js')
			);
		}

		$this->load->view('front_view', $data);			
	}

	public function update_list()
	{
		$this->load->model('Survey_model', '', TRUE);
		$success = $this->Survey_model->update_formlist();
		if ($success === TRUE)
		{
			echo 'form list has been updated';
		}
		else 
		{
			echo 'error updating form list';
		}
	}
}


?>