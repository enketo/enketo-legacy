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
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $groups = array('survey', 'instance', 'api_ver1');
        foreach ($groups as $group)
        {
            $this->{$group}();
        }
    }

    //tests survey model
    public function survey()
    {
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $this->load->model('Survey_model', '', TRUE);
        $options = array('type' => 'all');
        $http = $this->Survey_model->get_webform_url('http://testserver.com/bob', 'unit', 1000, NULL, $options);
        $https = $this->Survey_model->get_webform_url('https://testserver.com/bob', 'unit', 1000, NULL, $options);
        $httpwww = $this->Survey_model->get_webform_url('http://www.testserver.com/bob', 'unit', 1000, NULL, $options);
        $httpswww = $this->Survey_model->get_webform_url('https://www.testserver.com/bob', 'unit', 1000, NULL, $options);
        $trailslash = $this->Survey_model->get_webform_url('https://testserver.com/bob/', 'unit', 1000, NULL, $options);

        $props = array('url', 'single_url', 'iframe_url');
        foreach ($props as $prop)
        {
            $test = ( strlen($http[$prop]) > 0 && ( $http[$prop] === $https[$prop] ) );
            $this->unit->run($test, TRUE, 'http and https server url return same '.$prop, 
                'http: '.$http[$prop].', https:'.$https[$prop]);
        }

        foreach ($props as $prop)
        {
            $test = ( strlen($httpwww[$prop]) > 0 && ( $httpwww[$prop] === $http[$prop] ) );
            $this->unit->run($test, TRUE, 'http://www.testserver.com and https://testserver.com server url return same '.$prop, 
                'httpwww: '.$httpwww[$prop].', http:'.$http[$prop]);
        }

        foreach ($props as $prop)
        {
            $test = ( strlen($https[$prop]) > 0 && ( $https[$prop] === $trailslash[$prop] ) );
            $this->unit->run($test, TRUE, 'https://www.testserver.com/bob and https://testserver.com/bob/ server url return same '.$prop, 
                'https: '.$https[$prop].', with trailing slash:'.$trailslash[$prop]);
        }

        $props = array('single_url'=>TRUE, 'iframe_url'=>TRUE, 'url'=>FALSE);
        $online_suffix = $this->Survey_model->ONLINE_SUBDOMAIN_SUFFIX;
        foreach ($props as $prop => $not_offline)
        {
            $results = array($http, $https);
            foreach ($results as $result)
            {
                $exp = $not_offline ? "true" : "false";
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
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $this->load->model('Form_model', '', TRUE);

        $xml_path = '../devinfo/Forms/gui_test_A.xml';      
        $html_save_result_path = '../devinfo/Forms/gui_test_A_test_transform.html';
        $result = $this->Form_model->transform(null, null, $xml_path);
        $result_html = new DOMDocument;
        $result_html->loadHTML($result->form->asXML());
        $result_form = $result_html->saveHTML();
        file_put_contents($html_save_result_path, $result_form);

        $expected = new DOMDocument;
        $expected->loadHTMLFile('../devinfo/Forms/gui_test_A.html');
        $expected_form = $expected->saveHTML();
        
        $test = ((string) $result_form == (string) $expected_form);

        $this->unit->run($test, TRUE, 'in a complex test form (but without itemsets), the transformation is done correctly');

        echo $this->unit->report();
        //$diff = xdiff_string_diff($expected_form, $result_form, 1);
        if (!$test)
        {
            //echo 'transformation result:'.$result_form;
            //echo 'transformation expected:'.$expected_form;
        }
    }

    // first create writable temp folder in project root
    public function generate_test_form_mocks()
    {
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $xml_forms = array(
            'thedata.xml',
            'issue208.xml', 
            'cascading_mixture_itext_noitext.xml', 
            'new_cascading_selections.xml',
            'new_cascading_selections_inside_repeats.xml',
            'outputs_in_repeats.xml',
            'nested_repeats.xml',
            'calcs.xml',
            'readonly.xml',
            'calcs_in_repeats.xml',
            'multiple_repeats_relevant.xml'
        );
        $xml_forms_path = '../temp/';
        $save_result_path = '../temp/transforms.mock.js';

        $this->load->model('Form_model', '', TRUE);

        $mocks_js = "//These forms are generated by the php unit_test controller -> generate_test_form_mocks()\n\n".
            "var mockForms1 =\n{\n";

        foreach ($xml_forms as $xml_form)
        {
            $full_path = $xml_forms_path.$xml_form;
            $result = $this->Form_model->get_transform_result_sxe($full_path);
            $mocks_js .=  "\t'".$xml_form."':\n\t{\n".
                "\t\t'html_form' : '".preg_replace(array('/\>\s+\</',"/\'/", '/\n/'),array('><','&quot;', ''),$result->form->asXML())."',\n".
                "\t\t'xml_model': '".preg_replace(array('/\>\s+\</',"/\'/"),array('><','&quot;'),$result->model->asXML())."'\n\t},\n";
        }
        $mocks_js = substr($mocks_js, 0, -2)."\n};";
        
        $save_result = file_put_contents($save_result_path, $mocks_js);
        
        if ($save_result !== FALSE) { echo 'Form Strings Generated!'; }
        else {echo'Something went wrong...';}
    }

    // first create writable temp folder in project root
    public function generate_drishti_form_mocks()
    {
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $save_result_path = '../temp/transforms.mock.js';
        $server_url = "https://formhub.org/drishti_forms";
        $this->load->model('Form_model', '', TRUE);
        $this->Form_model->setup($server_url);
        $forms = $this->Form_model->get_formlist_JSON();
        $mocks_js = "//These forms are generated by the php unit_test controller -> generate_drishti_form_mocks()\n".
            "//from all forms in http://formhub.org/dristhi_forms\n\n".
            "var mockForms =\n{\n";

        foreach ($forms as $form)
        {
            $this->Form_model->setup($server_url, $form['form_id']);
            $result = $this->Form_model->get_transform_result_sxe();
            $mocks_js .=  "\t".$form['form_id'].":\n\t{\n".
                "\t\thtml_form : '".preg_replace(array('/\>\s+\</',"/\'/", '/\n/'),array('><','&quot;', ''),$result->form->asXML())."',\n".
                "\t\txml_model : '".preg_replace(array('/\>\s+\</',"/\'/"),array('><','&quot;'),$result->model->asXML())."'\n\t},\n";
            echo "performed transformation on ".$form['form_id']."<br/>";
        }
        $mocks_js = substr($mocks_js, 0, -2)."\n};";
        
        $save_result = file_put_contents($save_result_path, $mocks_js);
        
        if ($save_result !== FALSE) { echo "<br />All Forms Transformed and saved!"; }
        else {echo'Something went wrong...';}
    }

    //tests instance model
    public function instance()
    {
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $instance_received = '<?xml version="1.0" ?><backtobasic id="b2b_1"><formhub><uuid>71f440123a264629a696e5dfd6415fda</uuid></formhub><text>text entered in Enketo</text><meta><instanceID>uuid:a1a5fa9c3f51492eb282cd46c9018b9f</instanceID></meta></backtobasic>';
        $subdomain = 'aaaaaa';
        $id = '123';
        $this->load->model('Instance_model', '', TRUE);
        $result = $this->Instance_model->insert_instance($subdomain, $id, $instance_received, 'www.example.com');

        $this->unit->run($result !== NULL, TRUE, 'Instance-to-edit is saved');

        $result = $this->Instance_model->insert_instance($subdomain, $id, $instance_received, 'www.example.com');

        $this->unit->run($result, NULL, 'Instance-to-edit is not saved as it already existed (edits ongoing)');
        
        $result = $this->Instance_model->get_instance($subdomain, $id);

        $this->unit->run($result->instance_xml, $instance_received, 'Instance-to-edit is retrieved from db)');

        echo $this->unit->report();
    }
    
    public function api_ver1()
    {
        if (ENVIRONMENT == 'production') {
            return $this->_show_not_allowed();
        }

        $i = 0;

        $survey_combos = array(
            //valid token
            array('m' => 'GET',   'token' => TRUE,  'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 404),
            array('m' => 'POST',  'token' => TRUE,  'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 201),
            array('m' => 'GET',   'token' => TRUE,  'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 200),
            array('m' => 'PUT',   'token' => TRUE,  'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE,  'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            array('m' => 'DELETE','token' => TRUE,  'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 204),
            //invalid token
            array('m' => 'GET',   'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'POST',  'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'GET',   'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'PUT',   'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'OTHER', 'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'DELETE','token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            //missing token
            array('m' => 'GET',   'token' => NULL, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'POST',  'token' => NULL, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'GET',   'token' => NULL, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'PUT',   'token' => NULL, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'OTHER', 'token' => NULL, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'DELETE','token' => NULL, 'api'=>TRUE,  'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            //invalid token, but from trusted source
            array('m' => 'GET',   'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => TRUE,  'status' => 404),
            array('m' => 'POST',  'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => TRUE,  'status' => 201),
            array('m' => 'GET',   'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => TRUE,  'status' => 200),
            array('m' => 'PUT',   'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => TRUE,  'status' => 405),
            array('m' => 'OTHER', 'token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => TRUE,  'status' => 405),
            array('m' => 'DELETE','token' => FALSE, 'api'=>TRUE,  'quota' => 100000,  'trusted' => TRUE,  'status' => 204),
            //no api access but from trusted source
            array('m' => 'GET',   'token' => FALSE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => TRUE,  'status' => 404),
            array('m' => 'POST',  'token' => FALSE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => TRUE,  'status' => 201),
            array('m' => 'GET',   'token' => FALSE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => TRUE,  'status' => 200),
            array('m' => 'PUT',   'token' => FALSE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => TRUE,  'status' => 405),
            array('m' => 'OTHER', 'token' => FALSE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => TRUE,  'status' => 405),
            array('m' => 'DELETE','token' => FALSE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => TRUE,  'status' => 204),
            //valid token, but no api access
            array('m' => 'GET',   'token' => TRUE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'POST',  'token' => TRUE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'GET',   'token' => TRUE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'PUT',   'token' => TRUE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'DELETE','token' => TRUE, 'api'=>FALSE, 'quota' => 100000,  'trusted' => FALSE,  'status' => 405),
            //valid token, but no quota left
            array('m' => 'GET',   'token' => TRUE, 'api'=>TRUE,  'quota' => -1,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'POST',  'token' => TRUE, 'api'=>TRUE,  'quota' => -1,  'trusted' => FALSE,  'status' => 403),
            array('m' => 'GET',   'token' => TRUE, 'api'=>TRUE,  'quota' => -1,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'PUT',   'token' => TRUE, 'api'=>TRUE,  'quota' => -1,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE, 'api'=>TRUE,  'quota' => -1,  'trusted' => FALSE,  'status' => 405),
            array('m' => 'DELETE','token' => TRUE, 'api'=>TRUE,  'quota' => -1,  'trusted' => FALSE,  'status' => 404),//no exist
            //quota is NULL (account does not exist)
            array('m' => 'GET',   'token' => TRUE, 'api'=>TRUE,  'quota' => NULL,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'POST',  'token' => TRUE, 'api'=>TRUE,  'quota' => NULL,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'GET',   'token' => TRUE, 'api'=>TRUE,  'quota' => NULL,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'PUT',   'token' => TRUE, 'api'=>TRUE,  'quota' => NULL,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'OTHER', 'token' => TRUE, 'api'=>TRUE,  'quota' => NULL,  'trusted' => FALSE,  'status' => 404),
            array('m' => 'DELETE','token' => TRUE, 'api'=>TRUE,  'quota' => NULL,  'trusted' => FALSE,  'status' => 404),
            //server_url not provided in request
            array('m' => 'GET',   'token' => TRUE,'api'=>TRUE,'quota' => 100000,'trusted' => FALSE,'status' => 400,'url'=>''),
            array('m' => 'POST',  'token' => TRUE,'api'=>TRUE,'quota' => 100000,'trusted' => FALSE,'status' => 400,'url'=>''),
            array('m' => 'GET',   'token' => TRUE,'api'=>TRUE,'quota' => 100000,'trusted' => FALSE,'status' => 400,'url'=>''),
            array('m' => 'PUT',   'token' => TRUE,'api'=>TRUE,'quota' => 100000,'trusted' => FALSE,'status' => 400,'url'=>''),
            array('m' => 'OTHER', 'token' => TRUE,'api'=>TRUE,'quota' => 100000,'trusted' => FALSE,'status' => 400,'url'=>''),
            array('m' => 'DELETE','token' => TRUE,'api'=>TRUE,'quota' => 100000,'trusted' => FALSE,'status' => 400,'url'=>''),
        );
        
        //  /survey/..
        $endpoints = array(NULL, 'single', 'preview', 'all');
        foreach ($endpoints as $endpoint) {
            $options = array('type' => $endpoint);
            foreach ($survey_combos as $combo) {
                $token_acc = 'someacounttoken';
                $token_req = ($combo['token'] === TRUE) 
                ? $token_acc 
                : (($combo['token'] === FALSE) ? 'somefalsetoken' : NULL);
                $server_url = (isset($combo['url'])) ? $combo['url'] : 'https://testserver.com/bob';
                $i_str = (string) $i;
                $params = array(
                    'props'             => array('server_url' => $server_url, 'form_id' => 'something'),
                    'account_status'    => array(
                        'quota'      => $combo['quota'], 
                        'api_token'  => $token_acc, 
                        'api_access' => $combo['api']
                    ),
                    'request_token'     => $token_req,
                    'http_method'       => $combo['m'],
                    'trusted'           => $combo['trusted']
                );
                $this->load->library('api_ver1', $params, $i_str);
                $i++;
                $response = $this->{$i_str}->survey_response($options);
                $token_str = ( $combo['token'] === NULL ) ? 'null' : (($combo['token'] === FALSE) ? 'false' : 'true');
                $api_str = ( $combo['api'] === TRUE ) ? 'true' : 'false';
                $trusted_str = ( $combo['trusted'] === TRUE ) ? 'true' : 'false';
                $expected = $combo['status'];
                $this->unit->run(
                    $response['code'], $expected, $combo['m'].'  /api_v1/survey/'.$endpoint.' '.
                        'with server_url='.$server_url.' , token: '.$token_str.
                        ', quota: '.$combo['quota'].
                        ', trusted: '.$trusted_str.', and api access: '.$api_str.
                        ' => '.$response['code'].' (expected: '.$expected.')'
                );
                
            }
        }


        $surveys_combos = array(
            //valid token
            array('m' => 'GET',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 200),
            array('m' => 'POST',  'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 200),
            array('m' => 'PUT',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 405),
            array('m' => 'DELETE','token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 405),
            //not trusted, no token
            array('m' => 'GET',   'token' => NULL,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'POST',  'token' => NULL,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'PUT',   'token' => NULL,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'OTHER', 'token' => NULL,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'DELETE','token' => NULL,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            //not trusted, invalid token
            array('m' => 'GET',   'token' => FALSE, 'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'POST',  'token' => FALSE, 'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'PUT',   'token' => FALSE, 'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'OTHER', 'token' => FALSE, 'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            array('m' => 'DELETE','token' => FALSE, 'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status' => 401),
            //quota has not effect
            array('m' => 'GET',   'token' => TRUE,  'api'=>TRUE, 'quota' => -1,      'trusted' => FALSE, 'status' => 200),
            array('m' => 'POST',  'token' => TRUE,  'api'=>TRUE, 'quota' => -1,      'trusted' => FALSE, 'status' => 200),
            array('m' => 'PUT',   'token' => TRUE,  'api'=>TRUE, 'quota' => -1,      'trusted' => FALSE, 'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE,  'api'=>TRUE, 'quota' => -1,      'trusted' => FALSE, 'status' => 405),
            array('m' => 'DELETE','token' => TRUE,  'api'=>TRUE, 'quota' => -1,      'trusted' => FALSE, 'status' => 405),
            //no api access, valid token
            array('m' => 'GET',   'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            array('m' => 'POST',  'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            array('m' => 'PUT',   'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            array('m' => 'DELETE','token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 405),
            //no api access, trusted
            array('m' => 'GET',   'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 200),
            array('m' => 'POST',  'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 200),
            array('m' => 'PUT',   'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 405),
            array('m' => 'OTHER', 'token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 405),
            array('m' => 'DELETE','token' => TRUE,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 405),
            //no api access, invalid or missing token
            array('m' => 'GET',   'token' => FALSE, 'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'POST',  'token' => FALSE, 'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'GET',   'token' => NULL,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            array('m' => 'POST',  'token' => NULL,  'api'=>FALSE,'quota' => 100000,  'trusted' => FALSE, 'status' => 401),
            //no api access, invalid or missing token BUT trusted
            array('m' => 'GET',   'token' => FALSE, 'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 200),
            array('m' => 'POST',  'token' => FALSE, 'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 200),
            array('m' => 'GET',   'token' => NULL,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 200),
            array('m' => 'POST',  'token' => NULL,  'api'=>FALSE,'quota' => 100000,  'trusted' => TRUE, 'status' => 200),
            //various combos without valid server url
            array('m'=>'GET','token' => TRUE,  'api'=>TRUE,   'quota' => -1,      'trusted' => FALSE, 'status' => 400, 'url' => ''),
            array('m'=>'GET','token' => NULL,  'api'=>FALSE,  'quota' => 1000000, 'trusted' => TRUE,  'status' => 400, 'url' => ''),
            array('m'=>'GET','token' => FALSE, 'api'=>FALSE,  'quota' => 1000000, 'trusted' => TRUE,  'status' => 400, 'url' => ''),
            array('m'=>'GET','token' => TRUE,  'api'=>FALSE,  'quota' => -1,      'trusted' => TRUE,  'status' => 400, 'url' => '')
        );

        // /surveys/..  
        $endpoints = array('number', 'list');
        foreach ($endpoints as $endpoint) {
            foreach ($surveys_combos as $combo) {
                $token_acc = 'someacounttoken';
                $token_req = ($combo['token'] === TRUE) 
                    ? $token_acc 
                    : (($combo['token'] === FALSE) ? 'somefalsetoken' : NULL);
                $server_url = (isset($combo['url'])) ? $combo['url'] : 'https://testserver.com/bob';
                $i_str = (string) $i;
                $params = array(
                    'props'             => array('server_url' => $server_url),
                    'account_status'    => array(
                        'quota'      => $combo['quota'], 
                        'api_token'  => $token_acc, 
                        'api_access' => $combo['api']
                    ),
                    'request_token'     => $token_req,
                    'http_method'       => $combo['m'],
                    'trusted'           => $combo['trusted']
                );
                $this->load->library('api_ver1', $params, $i_str);
                $i++;
                $response = $this->{$i_str}->surveys_response($endpoint);
                $token_str = ( $combo['token'] === NULL ) ? 'null' : (($combo['token'] === FALSE) ? 'false' : 'true');
                $api_str = ( $combo['api'] === TRUE ) ? 'true' : 'false';
                $trusted_str = ( $combo['trusted'] == TRUE) ? 'true' : 'false';
                $expected = $combo['status'];
                $this->unit->run(
                    $response['code'], $expected, $combo['m'].' /api_v1/surveys/'.$endpoint.' '.
                        'with server_url='.$server_url.' , token: '.$token_str.
                        ', quota: '.$combo['quota'].
                        ', trusted: '.$trusted_str.', and api access: '.$api_str.
                        ' => '.$response['code'].' (expected: '.$expected.')'
                );
            }
        }

         $instance_combos = array(
            //valid token, missing params
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 201),
            //already being edited
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 405),
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'form_id' => '', 'status' => 400),
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'instance' => '', 'status' => 400),
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'instance_id' => '', 'status' => 400),
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'return_url' => '', 'status' => 400),
            array('m' => 'POST',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'url' => '', 'status' => 400),

            //different methods, valid token
            array('m' => 'GET',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 405),
            //removes instance from db
            array('m' => 'DELETE','token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 204),
            array('m' => 'PUT',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 405),
            array('m' => 'OTHER', 'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 405),

            //invalid token && not trusted, trusted, 
            array('m' => 'POST',  'token' => FALSE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 401),
            array('m' => 'POST',  'token' => FALSE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => TRUE,  'status'   => 201),
             //cleanup
            array('m' => 'DELETE','token' => TRUE,   'api'=>TRUE, 'quota' => 1000000,'trusted' => FALSE, 'status' => 204),

            //no API access
            array('m' => 'POST',  'token' => TRUE,   'api'=>FALSE,'quota' => 1000000, 'trusted' => FALSE,  'status'  => 405),
            array('m' => 'POST',  'token' => FALSE,  'api'=>FALSE,'quota' => 1000000, 'trusted' => TRUE,   'status'  => 201),
            //cleanup
            array('m' => 'DELETE',   'token' => TRUE,  'api'=>TRUE, 'quota' => 1000000, 'trusted' => FALSE, 'status'   => 204),
           
            //quota full/not paid or account missing
            array('m' => 'POST',  'token' => TRUE,   'api'=>TRUE, 'quota' => -1,   'trusted' => FALSE, 'status' => 403),
            array('m' => 'POST',  'token' => TRUE,   'api'=>TRUE, 'quota' => NULL, 'trusted' => FALSE, 'status' => 404),

        );

        // /instance/..  
        $endpoints = array(NULL, 'iframe');
        foreach ($endpoints as $endpoint) {
            foreach ($instance_combos as $combo) {
                $token_acc = 'someacounttoken';
                $token_req = ($combo['token'] === TRUE) 
                    ? $token_acc 
                    : (($combo['token'] === FALSE) ? 'somefalsetoken' : NULL);
                $server_url = (isset($combo['url'])) ? $combo['url'] : 'https://testserver.com/bob';
                $form_id = (isset($combo['form_id'])) ? $combo['form_id'] : 'someformid';
                $instance = (isset($combo['instance'])) ? $combo['instance'] : '<data><node>23</node></data>';
                $instance_id = (isset($combo['instance_id'])) ? $combo['instance_id'] : 'someid';
                $return_url = (isset($combo['return_url'])) ? $combo['return_url'] : $server_url;
                $i_str = (string) $i;
                $params = array(
                    'props'          => array(
                        'server_url'    => $server_url, 
                        'instance'      => $instance , 
                        'instance_id'   => $instance_id, 
                        'return_url'    => $return_url,
                        'form_id'       => $form_id
                    ),
                    'account_status' => array(
                        'quota'         => $combo['quota'], 
                        'api_token'     => $token_acc, 
                        'api_access'    => $combo['api']
                    ),
                    'request_token'     => $token_req,
                    'http_method'       => $combo['m'],
                    'trusted'           => $combo['trusted']
                );
                $this->load->library('api_ver1', $params, $i_str);
                $i++;
                $response = $this->{$i_str}->instance_response($endpoint);
                $token_str = ( $combo['token'] === NULL ) ? 'null' : (($combo['token'] === FALSE) ? 'false' : 'true');
                $api_str = ( $combo['api'] === TRUE ) ? 'true' : 'false';
                $trusted_str = ( $combo['trusted'] == TRUE) ? 'true' : 'false';
                $expected = $combo['status'];
                $this->unit->run(
                    $response['code'], $expected, $combo['m'].' /api_v1/instance/'.$endpoint.' '.
                        'with server_url='.$server_url.' , instance='.$instance.
                        ', instance_id='.$instance_id.', return_url='.$return_url.', token: '.$token_str.
                        ', quota: '.$combo['quota'].
                        ', trusted: '.$trusted_str.', and api access: '.$api_str.
                        ' => '.$response['code'].' (expected: '.$expected.')'
                );
            }
        }

        echo $this->unit->report();
    }

    private function _show_not_allowed()
    {
        $this->output->set_status_header(401);
        $this->output->set_output('These tests cannot be run in a production environment.');
    }
}
?>
