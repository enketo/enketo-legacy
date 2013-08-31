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

class Play extends CI_Controller {

	public function index()
	{
		$url = 'https://accounts-test.enketo.org/api/status/';
		$server_url = 'https://opendatakit.appspot.com';
		echo 'curl: '.$this->_curl_request($url, $server_url);
		echo 'fgt:'.$this->_file_request($url, $server_url);
	}

	private function _curl_request($url, $server_url)
    {
        $http_code = 0;
        $url .= '?server_url='.$server_url;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        ob_start();
        $result = curl_exec($ch);
        ob_end_clean();

        $info = curl_getinfo($ch);
        $http_code = $info['http_code'];
        $http_code = (!empty($info['http_code'])) ? $info['http_code'] : '0';
        log_message('debug', 'result of API call to '.$url.': '.$result);
        log_message('info', 'info: '.json_encode($info));
        curl_close($ch);
        unset($ch);
        //overwrite code if exists
        if ($result) {
            $response = json_decode($result, true);
        } else {
            $response = array();
        }
        $response['code'] = $http_code;
        return $response;
    }

    private function _file_request($url, $server_url)
    {
    	$url .= '?server_url='.$server_url;
    	$result = file_get_contents($url);
    	log_message('debug', 'result: '.$result);
    	return json_decode($result, true);
    }

}

?>