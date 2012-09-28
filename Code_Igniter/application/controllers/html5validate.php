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


class Html5validate extends CI_Controller {

	public function index()
	{

		//extract data from the post
		extract($_POST);

		//set POST variables
		$url = 'http://html5.validator.nu?out=xml';
		$fields = array(
		            'level'=>$level,
		            'content'=>$content
		        );

		//open connection
		$ch = curl_init();

		//set the url, number of POST vars, POST data
		curl_setopt($ch,CURLOPT_URL,$url);
		//curl_setopt($ch,CURLOPT_POST,count($fields));
		//curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		//execute post
		$result = curl_exec($ch);

		//close connection
		curl_close($ch);

		echo $result;

	}
}
?>