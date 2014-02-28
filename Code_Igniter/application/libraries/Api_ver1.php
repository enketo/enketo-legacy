<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
/**
 * API v1 Class
 *
 * Crafts REST API responses
 *
 * @author        	Martijn van de Rijdt
 * @license         see link
 * @link			https://github.com/MartijnR/....
 */
class Api_ver1 {

	private $CI;
    private $params;
    private $status;
    private $method;
    private $token;
    private $trusted;

	public function __construct($params)
    {
    	$this->CI =& get_instance();
        if (empty($params['props'])) {
            log_message('error', 'Api_v1 library did not receive form properties (server_url etc.)');
        }
        if (empty($params['account_status'])) {
            log_message('error', 'Api_v1 library did not received account status for: '.json_encode($params['props']));
        }
        if (empty($params['http_method'])) {
            log_message('error', 'Api_v1 library did not receive the HTTP method');
        }
        $this->params   = $params['props'];
        $this->status   = $params['account_status'];
        $this->token    = $params['request_token'];
        $this->method   = $params['http_method'];
        $this->trusted  = $params['trusted'];
        $this->CI->load->model('Survey_model', '', TRUE);
        log_message('debug', 'Api_v1 library initialized with '.json_encode($params));
    }

    public function survey_response($options)
    {
        $response = array();
        if (empty($this->params['server_url']) || empty($this->params['form_id'])) {
            $response['message']    = 'bad request';
            $response['code']       = '400';
        } else if ($this->status['quota'] === NULL) {
            $response['message']    = 'no account exists for this OpenRosa server';
            $response['code']       = '404';
        } else {
            if (!$this->_authenticated()) {
                $response['code']       = '401';
                $response['message']    = 'Access denied: invalid authentication token.';
            } else if ($this->status['quota'] === FALSE || $this->status['quota'] === 0) {
                $response['message']    = 'account requires payment or an upgrade';
                $response['code']       = '403';
            } else if (!$this->trusted && !$this->_has_api_access()) {
                $response['message']    = 'api access is not allowed on your account';
                $response['code']       = '405';
            } else if ($this->method === 'DELETE') {
                $response = $this->_del_survey();
            } else if ($this->method === 'POST') {
                $response = $this->_post_survey($options);
            } else if ($this->method === 'GET') {
                $response = $this->_get_survey($options);
            } else {
                $response['code']       = '405';
                $response['message']    = 'http request type '.$this->method.' not allowed';
            }
        }
        return $response;
    }

    public function surveys_response($type)
    {
        $response = array();
       
        if (empty($this->params['server_url'])) {
            $response['code']    = '400';
            $response['message'] = 'bad request';
        } else if ($this->status['quota'] === NULL) {
            $response['code']    = '404';
            $response['message'] = 'no account exists for this OpenRosa server';
        } else if (!$this->_authenticated()) {
            $response['code']    = '401';
            $response['message'] = 'Access denied: invalid authentication token.';
        } else if (empty($type) || ($this->method !== 'GET' && $this->method !== 'POST')){
            $response['code']    = '405';
            $response['message'] = 'method not allowed';
        } else if (!$this->trusted && !$this->_has_api_access()){
            $response['code']    = '405';
            $response['message'] = 'api access is not allowed on your account';
        } else {
            switch($type){
                case 'number':
                    $response = $this->_surveys_number();
                    break;

                case 'list':
                    $response = $this->_surveys_list();
                    break;

                default:
                    $response['code'] = '405';
                    $response['message'] = 'method not allowed';
                    break;
                }
            }
        return $response;
    }

    public function instance_response($type)
    {
        $response = array();
        $iframe = ($type === 'iframe');
        if (($this->method !== 'POST' && $this->method !== 'DELETE') || (!empty($type) && $type !== 'iframe')) {
            $response['code']    = '405';
            $response['message'] = 'method not allowed';
        } else if (empty($this->params['server_url']) 
                || empty($this->params['form_id']) 
                || ( empty($this->params['instance']) && $this->method == 'POST') 
                || empty($this->params['instance_id']) 
                || ( empty($this->params['return_url']) && $this->method == 'POST')
        ) {
            $response['code'] = '400';
            $response['message'] = substr('bad request (requires '. 
                (empty($this->params['server_url']) ? 'server_url, ' : '').
                (empty($this->params['form_id']) ? 'form_id, ' : '').
                (empty($this->params['instance']) ? 'instance, ' : '').
                (empty($this->params['instance_id']) ? 'instance_id, ' : '').
                (empty($this->params['return_url']) ? 'return_url, ' : ''), 0, -2).')';
        } else if ( !$this->_valid_xml($this->params['instance']) ) {
            $response['code'] = '400';
            $response['message'] = 'Instance was not a valid XML string.';
        } else {
            if (!$this->_authenticated()) {
                $response['code']    = '401';
                $response['message'] = 'Access denied: invalid authentication token.';
            } else if ($this->status['quota'] === FALSE || $this->status['quota'] === 0) {
                $response['code']    = '403';
                $response['message'] = 'account requires payment or an upgrade';
            } else if ($this->status['quota'] === NULL) {
                $response['code']    = '404';
                $response['message'] = 'no account exists for this OpenRosa server';
            } else if (!$this->_has_api_access()) {
                $response['code']    = '405';
                $response['message'] = 'api access is not allowed on your account';
            } else if ($this->method === 'DELETE') {
                $response = $this->_del_instance();
            } else if ($this->method === 'POST') {
                $response = $this->_post_instance($iframe);
            }
        }
        return $response;
    }

    private function _valid_xml($xml_str)
    {
        libxml_use_internal_errors(true);
        $sxe = simplexml_load_string($xml_str);
        $valid = count( libxml_get_errors() ) === 0;
        libxml_clear_errors();
        return $valid;
    }

    private function _authenticated() 
    {
       return ( $this->trusted || ($this->token && ($this->token == $this->status['api_token'])) );
    }

    private function _has_api_access()
    {
        return ($this->trusted || (isset($this->status['api_access']) && $this->status['api_access']));
    }

    private function _surveys_number()
    {
        $response = array();
        $response['number'] = $this->CI->Survey_model->number_surveys($this->params['server_url']);
        $response['code']   = '200';
        return $response;
    }

    private function _surveys_list()
    {
        $forms_launched = $this->CI->Survey_model->get_webform_list($this->params['server_url']);

        $response['forms']  = $forms_launched;
        $response['code']   = '200'; //also for empty responses

        return $response;
    }


    private function _in_list($array, $key, $value)
    {
        foreach ($array as $subarray) {
            if (isset($subarray[$key]) && $subarray[$key] == $value) {
                return TRUE;
            }
        }
        return FALSE;
    }

    private function _post_instance($iframe)
    {
        $options = array('type' => 'edit', 'iframe' => $iframe, 'instance_id' => $this->params['instance_id']);
        $response = $this->_post_survey($options);

        if (!empty($response) && !empty($response['edit_url'])) {
            $this->CI->load->model('Instance_model', '', TRUE);
            $rs = $this->CI->Instance_model->insert_instance(
                $response['subdomain'], $this->params['instance_id'], $this->params['instance'], 
                $this->params['return_url']);
            if ($rs == NULL) {
                unset($response['edit_url']);
                $response['code']    = '405';
                $response['message'] = 'somebody else is editing this instance';
            } else {
                // adjust the response code, 201 is successful INSTANCE db entry
                // 200 is never returned as protection agains simultanous editing of same record
                $response['code']   = '201';
            } 
            unset($response['subdomain']);
        }
        return $response;
    }

    private function _del_instance()
    {
        $options = array('type' => 'edit', 'instance_id' => $this->params['instance_id']);
        $response = $this->_post_survey($options);
        
        if (!empty($response) && !empty($response['subdomain'])) {
            $this->CI->load->model('Instance_model', '', TRUE);
            $result = $this->CI->Instance_model->remove_instance(
                $response['subdomain'], $this->params['instance_id']);
            if (!$result) {
                unset($response['edit_url']);
                $response['code']    = '404';
                $response['message'] = 'instance could not be deleted (probably was deleted already)';
            } else {
                $response['code']    = '204';
            }
            unset($response['subdomain']);
        }
        return $response;
    }

    private function _del_survey()
    {
        $response = array();

        $result = $this->CI->Survey_model->deactivate_webform_url($this->params['server_url'], $this->params['form_id']);
        if ($result) {
            $response['code'] = 204;
        } else {
            $response['code'] = 404;
            $response['message'] = 'form not found or already deactivated';
        }

        return $response;
    }

    private function _get_survey($options)
    {
        $response = $this->CI->Survey_model->get_webform_url_if_launched(
            $this->params['server_url'], $this->params['form_id'], $options);

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
    }

    private function _post_survey($options)
    {
        $submission_url = NULL;
        $response = $this->CI->Survey_model->get_webform_url(
            $this->params['server_url'], $this->params['form_id'], $this->status['quota'], $submission_url, $options);

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
        } else if (!empty($response['existing'])) {
            $response['code'] = '200';
            unset($response['existing']);
        } else {
            $response['code'] = '201';
        }
        return $response;
    }
}
