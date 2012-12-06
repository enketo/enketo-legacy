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

class Unit_test extends CI_Controller {
 
	function __construct()
	{
		parent::__construct();
		$this->load->library('unit_test');
		$this->unit->set_test_items(array('test_name', 'result'));
	}

	public function index()
	{
		$groups = array('survey', 'form', 'instance', 'subdomain');
		foreach ($groups as $group)
		{
			$this->{$group}();
		}
	}

	//tests survey model
	public function survey()
	{
		$this->load->model('Survey_model', '', TRUE);

		$http = $this->Survey_model->launch_survey('http://testserver/bob', 'unit', 'http://testserver/bob/submission');
		$https = $this->Survey_model->launch_survey('https://testserver/bob', 'unit', 'https://testserver/bob/submission');

		$props = array('subdomain', 'url', 'edit_url', 'iframe_url');
		foreach ($props as $prop)
		{
			$test = ( strlen($http[$prop]) > 0 && ( $http[$prop] === $https[$prop] ) );
			$this->unit->run($test, TRUE, 'http and https server url return same '.$prop, 
				'http: '.$http[$prop].', https:'.$https[$prop]);
		}

		$props = array('edit_url'=>TRUE, 'iframe_url'=>TRUE, 'url'=>FALSE);
		$online_suffix = $this->Survey_model->ONLINE_SUBDOMAIN_SUFFIX;
		foreach ($props as $prop => $not_offline)
		{
			$results = array($http, $https);
			foreach ($results as $result)
			{
				$exp = $not_offline ? "true":"false";
				$test = (strpos($result[$prop], $result['subdomain'].$online_suffix) > 0 );
				$this->unit->run($test, $not_offline, 'applicationCache disabled by subdomain suffix for '.
					$prop.': '.$exp, 'url: '.$result[$prop]);
			}
		}

		echo $this->unit->report();
	}

	//tests form model
	public function form()
	{

	}

	//tests instance model
	public function instance()
	{

	}

	//tests suddomain helper
	public function subdomain()
	{

	}
}
?>
