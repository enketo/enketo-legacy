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

    private $server_url = NULL;
    private $form_id = NULL;
    private $method = NULL;
    private $status = NULL;
    private $instance = NULL;
    private $instance_id = NULL;
    private $return_url = NULL;

    function __construct()
    {
        parent::__construct();
        $this->load->model('Survey_model', '', TRUE);
        $this->load->model('Instance_model', '', TRUE);
        $this->load->model('Account_model', '', TRUE);
        $this->load->helper(array('subdomain','url', 'string', 'http', 'json'));
       /* if ($_SERVER['SERVER_PORT'] != '443'){
            $this->output
                ->set_status_header('405')
                ->set_output('API access only allowed through encrypted (https) connections');
            exit();
        } else {*/ 
            $this->_set_properties();
        //}
        log_message('debug', 'API_v1 controller initialized');
    }

    public function index()
    {
        $data = array('stylesheets' => array(), 'scripts' => array(), 'title_component' => 'API V1 Documentation');
        $this->load->view('api_documentation_view', $data);
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
        $response = array();

        if (!$this->server_url || !$this->form_id) {
            $response['message'] = 'bad request';
            $response['code'] = '400';
        } else if ($this->status['quota'] === NULL) {
            $response['message'] = 'no account exists for this OpenRosa server';
            $response['code'] = '404';
        } else {
            $this->_auth();

            if ($view_type == 'iframe') {
                $view_type = NULL;
                $view_subtype = 'iframe';
            }

            $iframe = ($view_subtype === 'iframe');
            $options = array('type' => $view_type, 'iframe' => $iframe);
           
            if ($this->status['quota'] === FALSE || $this->status['quota'] === 0) {
                $response['message'] = 'account requires payment or an upgrade';
                $response['code'] = '403';
            } else if (!$this->_is_trusted_request() && (!isset($this->status['api_access']) || !$this->status['api_access'])) {
                $response['message'] = 'api access is not allowed on your account';
                $response['code'] = '405';
            } else if ($this->_is_delete_request()) {
                $response = $this->_del_survey();
            } else if ($this->_is_post_request()) {
                $response = $this->_post_survey($options);
            } else {
                $response = $this->_get_survey($options);
            }
        }
       
        $this->output
            ->set_status_header($response['code'])
            ->set_content_type('application/json')
            ->set_output(json_format(json_encode($response)));
    }

    private function _del_survey()
    {
        $response = $this->Survey_model->deactivate_webform_url($this->server_url, $this->form_id);
        //not found 404
        //still in /formList 405
        //success 204
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_format(json_encode($response)));
    }

    private function _get_survey($options)
    {
        $response = $this->Survey_model->get_webform_url_if_launched($this->server_url, $this->form_id, $options);
        if (!$response) {
            $response['code'] = '404';
        } else if ($response && isset($response['error'])) {
            if ($response['error'] == 'full') {
                $response['code'] = '403';
            } else {
                $response['code'] = '404';
            }
            unset($response['error']);
        } else {
            $response['code'] = '200';
        } 
        return $response;
        //$this->output
        //    ->set_content_type('application/json')
        //    ->set_output(json_format(json_encode($response)));
    }

    private function _post_survey($options)
    {
        $submission_url = NULL;
        $response = $this->Survey_model->get_webform_url($this->server_url, $this->form_id, $this->status['quota'], $submission_url, $options);

        if (!$response) {
            $response['message'] = 'unknown error occurred';
            $response['code'] = '404';
        } else if (isset($response['error'])) {
            if ($response['error'] == 'full') {
                $response['code'] = '403';
            } else {
                $response['code'] = '404';
            }
            unset($response['error']);
        } else if ($response && $response['existing'] === TRUE) {
            $response['code'] = '200';
            unset($response['existing']);
        } else {
            $response['code'] = '201';
        }
        return $response;
    }

    public function surveys($info)
    {
        $response = array();
       
        if (!isset($info)) {
            $this->output->set_status_header('405');
            $response['message'] = 'method not allowed';
        } else if (empty($this->server_url)) {
            $this->output->set_status_header('400');
            $response['message'] = 'bad request';
        } else if ($this->status['quota'] === NULL) {
            $this->output->set_status_header('404');
            $response['message'] = 'no account exists for this OpenRosa server';
        } else {
            $this->_auth();

            switch($info){
                case 'number_launched':
                    $response['number'] = $this->Survey_model->number_surveys($this->server_url);
                    break;

                case 'list':
                    if ($this->config->item('auth_support')) {
                        $this->load->add_package_path(APPPATH.'third_party/form_auth');
                    }
                    $this->load->library('form_auth');
                
                    $this->load->model('Form_model', '');
                    $credentials = $this->form_auth->get_credentials();
                    $this->Form_model->setup($this->server_url, NULL, $credentials);

                    if($this->Form_model->requires_auth()) {
                        log_message('debug', 'AUTHENTICATION REQUIRED');
                        $this->output
                            ->set_status_header('401');
                            $response['message'] = 'Form Server requires authorization. Please login <a href="'.
                                base_url().'authenticate/login">here</a> first.';
                    } else {
                        log_message('debug', 'auth not required to obtain formlist');
                        $response = $this->Form_model->get_formlist_JSON();
                    }

                    $this->output->set_status_header('200'); //also for empty responses
                    break;

                default:
                    $this->output->set_status_header('405');
                    $response['message'] = 'method not allowed';
                    break;
                }
            }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_format(json_encode($response)));
    }

    public function instance($view_subtype = NULL)
    {
        $quota = $this->status['quota'];
        $response = array();
        $iframe = ($view_subtype === 'true');

        if (!$this->_is_post_request()) {
            $this->output->set_status_header('405');
            $response['message'] = 'method not allowed';
        } if (empty($this->server_url) 
                || empty($this->form_id) 
                || empty($this->instance) 
                || empty($this->instance_id) 
                || empty($this->return_url)
        ) {
            $this->output->set_status_header('400');
            $response['message'] = substr('bad request (requires '. 
                (empty($this->server_url) ? 'server_url, ' : '').
                (empty($this->form_id) ? 'form_id, ' : '').
                (empty($this->instance) ? 'instance, ' : '').
                (empty($this->instance_id) ? 'instance_id, ' : '').
                (empty($this->return_url) ? 'return_url, ' : ''), 0, -2).')';
        } else {
            $this->_auth();

            if ($quota === FALSE || $quota === 0) {
                $this->output->set_status_header('403');
                $response['message'] = 'account requires payment or an upgrade';
            } else if (!$this->_is_trusted_request() && (!isset($this->status['api_access']) || !$this->status['api_access'])) {
                $this->output->set_status_header('405');
                $response['message'] = 'api access is not allowed on your account';
            } else if (!$this->_is_post_request()) {
                $this->output->set_status_header('405');
                $response['message'] = 'this method requires a POST method';
            } else {
                $options = array('type' => 'edit', 'iframe' => $iframe, 'instance_id' => $this->instance_id);
                $response = $this->Survey_model->get_webform_url($this->server_url, $this->form_id, $quota, NULL, $options);

                if (empty($response)) {
                    $this->output->set_status_header('404');
                    $resonse['message'] = 'unknown error occurred';
                } else if(empty($response['subdomain'])) {
                    if (isset($response['error'])) {
                        if ($response['error'] == 'full') {
                            $this->output->set_status_header('403');
                        } else {
                            $this->output->set_status_header('404');
                        }
                        unset($response['error']);
                    } else {
                        $this->output->set_status_header('404');
                        $response['message'] = 'unknown error occurred (no subdomain returned)';
                    }
                } else {
                    $rs = $this->Instance_model->insert_instance($response['subdomain'], $this->instance_id,
                        $this->instance, $this->return_url);
                    if($rs == NULL) {
                        unset($response['edit_url']);
                        $this->output->set_status_header('405');
                        $response['message'] = 'somebody else is editing this instance';
                    } else if($response['existing'] === TRUE) {
                        unset($response['existing']);
                        $this->output->set_status_header('200');
                    } else {
                        $this->output->set_status_header('201');
                    }
                    unset($response['subdomain']);
                }
            }
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_format(json_encode($response)));
    }

    private function _set_properties()
    {
        $params_get = $this->input->get(NULL, TRUE);
        $params_post = $this->input->post(NULL, TRUE);

        //TODO add regex check for well-formedness of server_url
        if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            parse_str(file_get_contents('php://input'), $params_del);
            $this->server_url = (!empty($params_del)) ? $params_del['server_url'] : NULL;
            $this->server_url = (!empty($form_id)) ? $params_del['form_id'] : NULL;
            $this->method = 'DEL';
        } else if (!empty($params_post) && !empty($params_post['server_url'])) {
            $this->server_url = $params_post['server_url'];
            $this->form_id = (!empty($params_post['form_id'])) ? $params_post['form_id'] : NULL;
            $this->instance = (!empty($params_post['instance'])) ? $params_post['instance'] : NULL;
            $this->instance_id = (!empty($params_post['instance_id'])) ? $params_post['instance_id'] : NULL;
            $this->return_url = (!empty($params_post['return_url'])) ? $params_post['return_url'] : NULL;
            $this->method = 'POST';
        } else if (!empty($params_get) && !empty($params_get['server_url'])){
            $this->server_url = $params_get['server_url'];
            $this->form_id = (!empty($params_get['form_id'])) ? $params_get['form_id'] : NULL;
            $this->method = 'GET';
        }

        if ($this->server_url) {
            $this->status = $this->Account_model->get_status($this->server_url);
        }
    }

    private function _is_delete_request()
    {
        return ($this->method === 'DEL');
    }

    private function _is_post_request()
    {
        return ($this->method === 'POST');
    }

    private function _is_trusted_request()
    {
        //needs to be checked for disallowing different origin requests
        return $this->input->is_ajax_request();
    }

    private function _auth() 
    {
       if ((!isset($_SERVER['PHP_AUTH_USER']) 
            || empty($this->status['api_token'])
            || ($_SERVER['PHP_AUTH_USER'] !== $this->status['api_token']))
            && !$this->_is_trusted_request()) {
            header('WWW-Authenticate: Basic realm="Valid Enketo API Token Required"');
            header('HTTP/1.0 401 Unauthorized');
            echo("Please enter a valid API Token (username) for your server.");
            exit();
        }
        return;
    }
}
?>