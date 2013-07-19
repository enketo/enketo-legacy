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

    function __construct()
    {
        parent::__construct();
        $this->load->model('Survey_model', '', TRUE);
        $this->load->model('Instance_model', '', TRUE);
        $this->load->model('Account_model', '', TRUE);
        $this->load->helper(array('subdomain','url', 'string', 'http', 'json'));
    }

    public function index()
    {
        $this->load->view('api_documentation_view');
    }

    /**
     *  200: ok
     *  201: ok, new entry
     *  400: malformed
     *  401: authentication failed, no account, no token provided
     *  403: authenticated account may not have been paid or quota is full
     *  404: not found or could not be created 
     *  405: api access forbidden for this (authenticated and existing) account
     */
    public function survey($view_type = NULL, $view_subtype = NULL)
    {
        $result = array();
        $server_url = NULL;
        $form_id = NULL;
        $params_get = $this->input->get(NULL, TRUE);
        $params_post = $this->input->post(NULL, TRUE);

        if (!empty($params_post) && !empty($params_post['server_url']) && !empty($params_post['form_id'])) {
            $server_url = $params_post['server_url'];
            $form_id = $params_post['form_id'];
        } elseif (!empty($params_get) && !empty($params_get['server_url']) && !empty($params_get['form_id'])){
            $server_url = $params_get['server_url'];
            $form_id = $params_get['form_id'];
        } else {
            $this->output->set_status_header('400');
            $result['message'] = 'bad request';
            return $this->output->set_output(json_format(json_encode($result)));
        }

        /*if (empty($_SERVER['HTTPS'])){
            $this->output
                ->set_status_header('405')
                ->set_output('API access only allowed through encrypted (https) connections');
        } else */if (!isset($_SERVER['PHP_AUTH_USER']) && !$this->input->is_ajax_request()) {
            header('WWW-Authenticate: Basic realm="Enketo API Token Required"');
            header('HTTP/1.0 401 Unauthorized');
            echo("Please enter a valid API Token (username) for your server.");
            exit();
        }

        $status = $this->Account_model->get_status($server_url, $_SERVER['PHP_AUTH_USER']);
        
        //check if same origin policy is active 
        if (!$this->input->is_ajax_request() && !$status['token_approved']) {
            header('WWW-Authenticate: Basic realm="Enketo API Token Invalid"');
            header('HTTP/1.0 401 Unauthorized');
            echo("Not valid for your server url. Please enter a valid API Token (username) for your server.");
            exit();
        }

        if ($view_type == 'iframe') {
            $view_type = NULL;
            $view_subtype = 'iframe';
        }
        $iframe = ($view_subtype === 'iframe');
        $options = array('type' => $view_type, 'iframe' => $iframe);
        $submission_url = NULL;
        $quota = $status['quota'];

        if ($quota === FALSE) {
            $this->output->set_status_header('403');
            $result['message'] = 'account requires payment or an upgrade';
        } else if ($quota === NULL) {
            $this->output->set_status_header('404');
            $result['message'] = 'no account exists for this OpenRosa server';
        } else if (!$this->input->is_ajax_request() && (isset($status['api_access']) && !$status['api_access'])) {
            $this->output->set_status_header('405');
            $result['message'] = 'api access is not allowed on your account';
        } else if ($params_post) {
            $result = $this->Survey_model->get_webform_url($server_url, $form_id, $quota, $submission_url, $options);
            if (!$result) {
                $this->output->set_status_header('404');
                $result['message'] = 'unknown error occurred';
            } else if ($result && $result['error']) {
                if ($result['error'] == 'full') {
                    $this->output->set_status_header('403');
                } else {
                    $this->output->set_status_header('404');
                }
                unset($result['error']);
            } else if ($result && $result['existing'] === TRUE) {
                $this->output->set_status_header('200');
                unset($result['existing']);
            } else {
                $this->output->set_status_header('201');
            }
        } else {
            $result = $this->Survey_model->get_webform_url_if_launched($server_url, $form_id, $quota, $options);
            if (!$result) {
                $this->output->set_status_header('404');
            } else if ($result && $result['error']) {
                if ($result['error'] == 'full') {
                    $this->output->set_status_header('403');
                } else {
                    $this->output->set_status_header('404');
                }
                unset($result['error']);
            } else {
                $this->output->set_status_header('200');
            } 
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_format(json_encode($result)));
    }

    public function surveys()
    {

    }

    public function instance()
    {
        
    }
}
?>