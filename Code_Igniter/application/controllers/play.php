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

    /**
     *  200: ok
     *  201: ok, new entry
     *  400: malformed
     *  401: authentication failed, no account, no token provided
     *  403: authenticated account may not have been paid or quota is full
     *  404: not found or could not be created 
     *  405: api access forbidden for this (authenticated and existing) account
     */
    function __construct()
    {
        parent::__construct();
        $this->load->library('encrypt');
    }

    public function index()
    {
        $secret = "martijnvanderijdt";
        echo 'secret: '.$secret."\r\n\r";
        $encrypted = $this->encrypt->encode($secret);
        echo ', encrypted: '.$encrypted."\n\r";
        $url_encrypted = urlencode($encrypted);


        $url_encrypted = $this->input->get('token');

        //echo ', url encoded: '.$url_encrypted."\n\n";
        //$encrypted_ = urldecode($url_encrypted);
        echo ', url decoded: '.$url_encrypted."\n\n";
        $decoded = $this->encrypt->decode($url_encrypted);
        echo ', unencrypted: '.$decoded;


        //$token = urlencode($this->encrypt->encode($secret));
        //echo ', token: '.$token."\n\n";  
        
        //$token = urldecode( $this->input->get('token') );
        //echo $token;
        //echo $this->encrypt->decode('dcNGBg53fuBDp/4Wuu49F7h5KDqNkao5qCJ3M5 uiXOq0S0MhsJJti4bzWeAGTfOawm1ZDkFfW0yzzm P1i85A==');
    }
}
?>
