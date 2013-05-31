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

//This controller for AJAX POSTS simply directs to a model and returns a response

class Media extends CI_Controller {

	function __construct() {
		parent::__construct();
		$this->load->library(array('curl', 'openrosa'));
		//$this->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
	}

	public function index()
	{
		show_404();
	}

	public function get()
	{
		$segments = func_get_args();
		//$origin = 'https://formhub.org/martijnr/forms/test_https/formid-media/70978';
		//$segments = explode('/', preg_replace('/:\/\//', '/', $origin));

		$segments_joined = implode('/', $segments);
		$url = preg_replace('/\//', '://', $segments_joined, 1);
		
		$headers = $this->openrosa->get_headers($url);
		$content_type = $this->_correct_mime($headers['Content-Type']);
		header('Content-Type:'.$content_type);
		//$bytes = $this->_get_media($url);
		echo $this->_get_media($url);
		//$this->output->cache(10);
		//$this->load->view('media_view.php', array('content_type' => $content_type, 'bytes' => $bytes));
	}

	private function _get_media($url)
	{
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
			//curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
			curl_exec($ch);
	}

	private function _correct_mime($mimetype)
	{
		if ($mimetype === 'application/image/png') return 'image/png';
		if ($mimetype === 'application/image/jpeg') return 'image/jpeg';

		return $mimetype;
	}
}
//no spaces behind this or everything will fail miserably!
?>