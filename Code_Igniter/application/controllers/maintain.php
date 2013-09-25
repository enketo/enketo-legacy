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

class Maintain extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1') {
			show_error('not allowed', 405);
		}
	}

	public function index()
	{
		echo 'go away';
	}

	public function transform_results()
	{
		$this->load->model('Survey_model', '', true);
		echo $this->Survey_model->remove_unused_transform_results().
			' records were cleared of their transformation results';
	}
}
?>