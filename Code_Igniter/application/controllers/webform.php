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

class Webform extends CI_Controller {

    private $credentials = NULL;

    function __construct()
    {
        parent::__construct();
        $this->load->helper(array('subdomain','url', 'form'));
        $this->load->model('Survey_model','',TRUE);
        $this->load->library(array('encrypt', 'meta'));
        $sub = get_subdomain();
        $suf = $this->Survey_model->ONLINE_SUBDOMAIN_SUFFIX;
        $this->subdomain = ($this->Survey_model->has_offline_launch_enabled()) 
            ? $sub : substr($sub, 0, strlen($sub) - strlen($suf));
        if (!empty($this->subdomain)) {
            $form_props = $this->Survey_model->get_form_props();
            $this->server_url= (isset($form_props['server_url'])) ? $form_props['server_url'] : NULL;
            $this->form_id = (isset($form_props['form_id'])) ? $form_props['form_id'] : NULL; 
            $this->form_hash_prev = (isset($form_props['hash'])) ? $form_props['hash'] : NULL; 
            $this->media_hash_prev = (isset($form_props['media_hash'])) ? $form_props['media_hash'] : NULL;
            $this->xsl_version_prev = (isset($form_props['xsl_version'])) ? $form_props['xsl_version'] : NULL; 
        }
        $this->iframe = ( $this->input->get('iframe', TRUE) == 'true' );
       
        if ($this->config->item('auth_support')) {
            $this->load->add_package_path(APPPATH.'third_party/form_auth');
        }
        $this->load->library('form_auth');
        if ($this->config->item('account_support')) {
            $this->load->add_package_path(APPPATH.'third_party/account');
        }
        $this->load->library('account');

        log_message('debug', 'Webform Controller Initialized');
    }

    public function index()
    {   
        if ($this->_subdomain_check_route()) {
            return;
        }
        if ($this->_launched_check_route()) {
            return;
        }
        if ($this->_active_check_route()) {
            return;
        }
        if ($this->_paywall_check_route()) {
            return;
        }
        $form = $this->_get_form();
        if ($this->_authentication_route($form)) {
            return;
        }
        if ($this->_form_null_check_route($form)) {
            return;
        }
        
        $data = array(
            'manifest'=> ($this->Survey_model->has_offline_launch_enabled()) ? '/manifest/html/webform' : NULL, 
            'title_component' => 'webform', 
            'html_title' => $form->title,
            'form'=> $form->html,
            'form_data'=> $form->default_instance,
            'iframe' => $this->iframe,
            'stylesheets'=> $this->_get_stylesheets($form->theme),
            'server_url' => $this->server_url,
            'form_id' => $this->form_id,
            'logo_url' => $this->account->logo_url($this->server_url),
            'logout' => $this->credentials !== NULL
        );

        $data['scripts'] = (ENVIRONMENT === 'production') 
            ? array(array('src' => '/build/js/webform-combined.min.js'))
            : array(array('src' => '/lib/enketo-core/lib/require.js', 'data-main' => '/src-js/main-webform.js'));

        $this->load->view('webform_view', $data);
    }

    /**
     * function that opens an edit-view of the form with previously POSTed instance-to-edit 
     * and return url (from OpenRosa server)
     * the edit-view is a simplified webform view without any offline capabilities 
     * (no applicationCache, no localStorage)
     **/
    public function edit()
    {
        $instance_id = $this->input->get('instance_id', TRUE);
        if ($this->_subdomain_check_route()) {
            return;
        }
        if ($this->_launched_check_route()) {
            return;
        }
        if ($this->_active_check_route()) {
            return;
        }
        if ($this->_paywall_check_route()) {
            return;
        }
        if ($this->_online_only_check_route()) {
            return;
        }
        if (empty($instance_id)) {
            return show_error('No instance provided to edit and/or no return url provided to return to.', 404);
        }
        $edit_obj = $this->_get_edit_obj($instance_id);

        if(!$edit_obj) {
          return show_error("Couldn't find instance for subdomain ". $this->subdomain . " and
              instance id " . $instance_id, 404);
        }

        $form = $this->_get_form();
        if ($this->_authentication_route($form, '/edit?instance_id'.$instance_id )) {
            return;
        }
        if ($this->_form_null_check_route($form)) {
            return;
        }

        $data = array
        (
            'title_component'=>'webform edit', 
            'html_title'=> $form->title,
            'form'=> $form->html,
            'form_data'=> $form->default_instance,
            'form_data_to_edit' => $edit_obj->instance_xml,
            'return_url' => $edit_obj->return_url,
            'iframe' => $this->iframe,
            'edit' => true,
            'offline_storage' => FALSE,
            'logo_url' => $this->account->logo_url($this->server_url),
            'stylesheets'=> $this->_get_stylesheets($form->theme)
        );

        $data['scripts'] = (ENVIRONMENT === 'production') 
            ? array(array('src' => '/build/js/webform-edit-combined.min.js'))
            : array(array('src' => '/lib/enketo-core/lib/require.js', 'data-main' => '/src-js/main-webform-edit.js'));

        $this->load->view('webform_view', $data);
    }

    /**
     * function that opens an iframeable-view of the form which is a simplified webform view 
     * without any offline capabilities 
     * (no applicationCache, no localStorage)
     * @deprecated
     **/
    public function iframe()
    {
        $this->default_stylesheets = $this->default_iframe_stylesheets;
        return $this->single();
    }

    /**
     * single submit view (SurveyMonkey watch out. Enketo is coming to get you!)
     */
    public function single()
    {
        if ($this->_subdomain_check_route()) {
            return;
        }
        if ($this->_launched_check_route()) {
            return;
        }
        if ($this->_active_check_route()) {
            return;
        }
        if ($this->_paywall_check_route()) {
            return;
        }
        if ($this->_online_only_check_route()) {
            return;
        }
        $form = $this->_get_form();
        if ($this->_authentication_route($form, '/single')) {
            return;
        }
        if ($this->_form_null_check_route($form)) {
            return;
        }
    
        $data = array
        (
            'title_component'=>'webform single-submit', 
            'html_title'=> $form->title,
            'form'=> $form->html,
            'form_data'=> $form->default_instance,
            'form_data_to_edit' => NULL,
            'return_url' => '/webform/thanks',
            'iframe' => $this->iframe,
            'offline_storage' => FALSE,
            'stylesheets'=> $this->_get_stylesheets($form->theme),
            'logo_url' => $this->account->logo_url($this->server_url),
            'logout' => $this->credentials !== NULL
        );

        $data['scripts'] = (ENVIRONMENT === 'production') 
            ? array(array('src' => '/build/js/webform-single-combined.min.js'))
            : array(array('src' => '/lib/enketo-core/lib/require.js', 'data-main' => '/src-js/main-webform-single.js'));

        $this->load->view('webform_view',$data);
    }

    public function preview()
    {
        $params = $this->input->get(NULL, TRUE);

        if (!$params || ( empty($params['form']) && (empty($params['server']) || empty($params['id']))) ) {
            show_error('Preview requires server and id variables or a form variable.', 404);
            return;
        }
        if (isset($this->subdomain)) {
            show_error('Preview cannot be launched from subdomain', 404);
            return;
        }
        if (!empty($params['server']) && $this->_paywall_check_route_for_preview($params['server'])) {
            return;
        }
        $data = array
        (
            'title_component' => 'webform preview', 
            'html_title'=> 'enketo webform preview',
            'form'=> '',
            'return_url' => NULL,
            'offline_storage' => FALSE,
            'stylesheets'=> $this->_get_stylesheets(),
            'logo_url' => !empty($params['server']) ? $this->account->logo_url($params['server']) : $this->account->logo_url(),
            'logout' => $this->credentials !== NULL
        );

        $data['scripts'] = (ENVIRONMENT === 'production') 
            ? array(array('src' => '/build/js/webform-preview-combined.min.js'))
            : array(array('src' => '/lib/enketo-core/lib/require.js', 'data-main' => '/src-js/main-webform-preview.js'));
        
        $this->load->view('webform_preview_view', $data);
    }

    public function thanks()
    {
        $this->load->view('thanks_view', array(
            'scripts' => array(),
            'stylesheets' => $this->_get_stylesheets()
        ));
    }

    private function _login($append='')
    {
        $this->session->set_flashdata(
            array('server_url' => $this->server_url, 'form_id' => $this->form_id, 'return_url' => full_base_url().'webform'.$append)
        );
        redirect('/authenticate/login');
    }

    private function _get_stylesheets($theme_requested = NULL)
    {
        $supported_themes = $this->config->item('themes');

        $theme = ( $theme_requested && in_array($theme_requested, $supported_themes) ) ? $theme_requested : $supported_themes[0];
        
        return array (
            array( 'href' => '/build/css/webform_'.$theme.'.css', 'media' => 'all'),
            array( 'href' => '/build/css/webform_print_'.$theme.'.css', 'media' => 'print')
        );
    }

    private function _get_form()
    {
        if (!isset($this->form_id) || !isset($this->server_url)) {
            log_message('error', 'no form_id and/or server_url');
            return FALSE;
        }
        
        $this->load->model('Form_model', '', TRUE);
        $token = $this->input->get('token', TRUE);
        $s = ($this->encrypt->decode($this->input->get('token', TRUE)) === 'localrequest') ? $this->input->get('s', TRUE) : NULL;
        $this->credentials = $this->form_auth->get_credentials($s);
        $this->Form_model->setup($this->server_url, $this->form_id, $this->credentials, $this->form_hash_prev, $this->xsl_version_prev, $this->media_hash_prev);
        
        $uid = ($this->credentials) ? $this->credentials['username'] : NULL;
        $this->meta->setMeta($uid);

        if($this->Form_model->requires_auth()) {
            log_message('debug', "AUTHENTICATION REQUIRED");
            $form = new stdClass();
            $form->authenticate = TRUE;
            return $form;
        }

        if($this->Form_model->can_be_loaded_from_cache()) {
            //log_message('debug', 'unchanged form and stylesheets, loading transformation result from database');
            $form = $this->Survey_model->get_cached_transform_result();

            if (empty($form->title) || empty($form->html) || empty($form->default_instance))
            {
                log_message('error', 'failed to obtain transformation result from database for '.$this->subdomain);
            }
        } else {
            //log_message('debug', 'form changed, form media changed, xslt stylesheets changed, form removed, or form never transformed before, going to perform transformation');
            $form = $this->Form_model->get_transform_result_obj();
            $this->Survey_model->update_transform_result($form);
        }
        
        if (!empty($form->html) && !empty($form->default_instance)) {
            return $form;
        }
        return NULL;
    }

    private function _get_edit_obj($instance_id)
    {
        $this->load->model('Instance_model','',TRUE);
        $edit_o = $this->Instance_model->get_instance($this->subdomain, $instance_id);
        if (!empty($edit_o)) {
            $edit_o->instance_xml = json_encode($edit_o->instance_xml);
        }
        return (!empty($edit_o->instance_xml) && !empty($edit_o->return_url)) ? $edit_o : NULL;
    }

    private function _subdomain_check_route()
    {
        if (!isset($this->subdomain)) {
            show_error('View should be launched from survey subdomain', 404);
            return TRUE;
        }
        return FALSE;
    }

    private function _launched_check_route()
    {
        if (!$this->Survey_model->is_launched_survey()) {
            show_error('This survey has not been launched in enketo.', 404);
            return TRUE;
        }
        return FALSE;
    }

    private function _active_check_route()
    {
        if (!$this->Survey_model->is_active_survey()) {
            show_error('This survey is no longer active.', 404);
            return TRUE;
        }
        return FALSE;
    }

    private function _online_only_check_route()
    {
        if ($this->Survey_model->has_offline_launch_enabled()) {
            show_error('This webform view can only be launched in online-only mode', 404);
            return TRUE;
        }
        return FALSE;
    }

    private function _authentication_route($form, $append='')
    {
        if (isset($form->authenticate) && $form->authenticate) {
            if ($this->input->get('manifest') == 'true') {
                log_message('debug', 'authentication not provided, sending empty string to manifest');
                $this->output->set_output('');
            } else {
                $this->_login($append);
            }
            return TRUE;
        }
        return FALSE;
    }

    private function _paywall_check_route()
    {
        if (!$this->account->serve_allowed($this->server_url)) {
            $this->load->view('unpaid_view');
            return TRUE;
        }
        return FALSE;
    }

    private function _paywall_check_route_for_preview($server_url)
    {
        if (!$this->account->serve_allowed($server_url)) {
            $this->load->view('unpaid_view');
            return TRUE;
        }
        return FALSE;
    }

    private function _form_null_check_route($form)
    {
        if ($form === NULL) {
            //log_message('error', 'Form could not be found or transformed');
            show_error('Form not reachable (or an error occurred during transformation). ', 404);
            return TRUE;
        }
        return FALSE;
    }
}
?>
