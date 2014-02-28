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

class Api_v1 extends CI_Controller {

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
        if ($this->config->item('account_support')) {
            $this->load->add_package_path(APPPATH.'third_party/account');
        }
        $this->load->library('account');
        $params = $this->_get_params();
        $request_token = $this->_get_request_token();
        $account_status = $this->_get_account_status($params);
        $trusted = $this->_is_trusted_request();
        $this->load->library('api_ver1', array(
            'props'             => $params, 
            //note that account_status is actually not required for /surveys endpoint
            'account_status'    => $account_status, 
            'request_token'     => $request_token,
            'trusted'           => $trusted,
            'http_method'       => $_SERVER['REQUEST_METHOD']
        ));
        $this->load->helper(array('json', 'subdomain'));
        /*if ($_SERVER['SERVER_PORT'] != '443'){
            $this->output
                ->set_status_header('405')
                ->set_output('API access only allowed through encrypted (https) connections');
            exit();
        } else {*/ 
            //$this->_set_properties();
        //} 
        if (get_subdomain()) {
            show_error('API not accessible on subdomain', 404);
        }
        log_message('debug', 'API_v1 controller initialized');
    }

    public function index()
    {
        //$data = array('stylesheets' => array(), 'scripts' => array(), 'title_component' => 'API V1 Documentation');
        //$this->load->view('api_documentation_view', $data);
        
        $this->load->helper('url');
        redirect('http://apidocs.enketo.org', 'refresh');
    }

    public function survey($view_type = NULL, $view_subtype = NULL)
    {
        if ($view_type == 'iframe') {
            $view_type = NULL;
            $view_subtype = 'iframe';
        }
        $iframe = ($view_subtype === 'iframe');
        $options = array('type' => $view_type, 'iframe' => $iframe);
        $response = $this->api_ver1->survey_response($options);
        $this->_print_output($response);
    }

    public function surveys($type = NULL)
    {
        $response = $this->api_ver1->surveys_response($type);
        $this->_print_output($response);
    }

    public function instance($type = NULL)
    {
        $response = $this->api_ver1->instance_response($type);
        $this->_print_output($response);
    }

    private function _get_params()
    {
        $params = array();

        switch($_SERVER['REQUEST_METHOD']) {
            case 'DELETE':
                parse_str(file_get_contents('php://input'), $params);
                break;

            case 'POST':
                //temporarily switch off XSS filter as it garbles up the instance XML
                $params = $this->input->post(); //(NULL, TRUE)
                break;

            case 'GET':
                $params = $this->input->get(NULL, TRUE);
                break;
        }

        return $params;
    }

    private function _get_account_status($params)
    {
        return (isset($params['server_url'])) ? $this->account->get_status($params['server_url']) : NULL;
    }

    private function _get_request_token()
    {
        return (isset($_SERVER['PHP_AUTH_USER'])) ? $_SERVER['PHP_AUTH_USER'] : NULL;
    }

    private function _is_trusted_request()
    {
        //TODO needs to be checked for disallowing different origin ajax requests
        //log_message('debug', 'API request received from: '.$_SERVER['REMOTE_ADDR']);
        return $this->input->is_ajax_request() || $_SERVER['REMOTE_ADDR'] == '146.185.129.211';
    }

    private function _print_output($response)
    {
        // log_message('debug', 'printing output'.json_encode($response));
        if ($response['code'] == '401'){
            header('WWW-Authenticate: Basic realm="Valid Enketo API Token Required"');
            header('HTTP/1.0 401 Unauthorized');
            //echo("Please enter a valid API Token (username) for your server.");
            echo (json_format(json_encode($response)));
            exit();
        } else if ($response['code'] == '204'){
             $this->output
                ->set_status_header($response['code'])
                ->set_content_type('application/json')
                ->set_output('');
        } else {
            $this->output
                ->set_status_header($response['code'])
                ->set_content_type('application/json')
                ->set_output(json_format(json_encode($response)));
        }
    }
}
?>
