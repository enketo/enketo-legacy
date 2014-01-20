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

	//outputs media (streams cURL response)
	public function get()
	{
		$url = $this->_extract_url(func_get_args());
		// add query string (used in Aggregate)
		$url = ( !empty( $_SERVER['QUERY_STRING'] ) ) ? $url.'?'.$_SERVER['QUERY_STRING'] : $url;
		
		$headers = $this->openrosa->get_headers($url);
		// log_message('debug', json_encode($headers));
		$content_type = $this->_correct_mime($headers['Content-Type']);
		header('Content-Type:'.$content_type);
		if (!empty( $headers['Content-Disposition'] ) ) {
			header('Content-Disposition:'.$headers['Content-Disposition']);
		}
		echo $this->_get_media($url);
	}

	//check whether media url seems valid (returns a header reponse with a download-content-length) 
	public function check()
	{
		$url = $this->_extract_url(func_get_args());
		$headers = $this->openrosa->get_headers($url);
		if (isset($headers['Content-Length'])) {
			$this->output->set_output($headers['Content-Length']);
		}
		else {
			show_404();
		}
	}

	private function _extract_url($segments)
	{
		$segments_joined = implode('/', $segments);
		return preg_replace('/\//', '://', $segments_joined, 1);
	}

	private function _get_media($url)
	{
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
		curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
		//the account_manager SSL verification fails for some reason
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_exec($ch);
	}

	private function _correct_mime($mimetype)
	{
		// temporary workaround for formhub bug: https://github.com/SEL-Columbia/formhub/issues/1292
		if ($mimetype === 'application/image/png') {
			return 'image/png';
		}
		if ($mimetype === 'application/image/jpeg') {
			return 'image/jpeg';
		}
		if ($mimetype === 'application/audio/mp3') {
			return 'audio/mpeg';
		}
		if ($mimetype === 'application/audio/wav') {
			return 'audio/vnd.wave';
		}
		return $mimetype;
	}
}
//no spaces behind this or everything will fail miserably!
?>
