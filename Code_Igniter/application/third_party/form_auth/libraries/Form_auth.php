<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
/**
 * Form Authentication Class
 *
 * Deals with authentication according to the OpenRosa Form Authentication API
 *
 * @author        	Martijn van de Rijdt
 * @license         see link
 * @link			https://github.com/MartijnR/....
 */
class Form_auth {

	private $CI;

	public function __construct()
    {
        log_message('debug', 'starting Form_auth initialization');
        $this->CI =& get_instance();
        //$this->CI->load->library('curl'); 
        $this->CI->load->helper(array('form', 'url'));
		$this->CI->load->model('User_model', '', TRUE);
		$this->default_stylesheets = array
			(
				array( 'href' => '/build/css/webform_formhub.css', 'media' => 'all')
			);
        log_message('debug', 'Form_auth library (the real one) initialized');
    }

    public function authenticate()
    {
		$this->CI->load->library('form_validation');
		$this->CI->form_validation->set_message('authorization_check', 'The username and password combination is incorrect or user is not authorized.');
		$this->CI->form_validation->set_rules('username', 'Username', 'trim|required');
		$this->CI->form_validation->set_rules('password', 'Password', 'trim|required|callback_authorization_check');

		if ($this->CI->form_validation->run() == FALSE) {
			log_message('debug', 'authentication form validation failed');
			$form_id = ($this->CI->input->get('id', TRUE)) ? $this->CI->input->get('id', TRUE) : $this->CI->input->post('form_id', TRUE);
			$return_url = ($this->CI->input->get('return', TRUE)) ? $this->CI->input->get('return', TRUE) : $this->CI->input->post('return', TRUE);
			$server_url = ($this->CI->input->get('server', TRUE)) ? $this->CI->input->get('server', TRUE) : $this->CI->input->post('server_url', TRUE);
			$this->login($server_url, $form_id, $return_url);
		} else {
			$username = $this->CI->input->post('username', TRUE);
			$password = $this->CI->input->post('password', TRUE);
			$remember = $this->CI->input->post('remember', TRUE);
			$this->CI->User_model->set_credentials($username, $password, $remember);
			redirect($this->CI->input->get_post('return', TRUE),'refresh');
		}
    }

    public function login($server_url, $form_id, $return_url)
    {
    	$this->CI->load->view('login_view', array(
    		'form_id' => $form_id,
    		'return' => $return_url,
    		'server_url' => $server_url,
    		'stylesheets' => $this->default_stylesheets
    	));
    }

    public function logout()
    {
    	$this->CI->User_model->destroy_credentials();
    	$this->CI->load->view('logout_view', array('stylesheets' => $this->default_stylesheets));
    }

    public function authorization_check()
    {
    	$credentials = array
		(
			'username' => $this->CI->input->get_post('username', TRUE),
			'password' => $this->CI->input->get_post('password', TRUE)
		);

		$server_url = ($this->CI->input->get('server', TRUE)) ? $this->CI->input->get('server', TRUE) : $this->CI->input->post('server_url', TRUE);

		if (empty($server_url)) {
			return FALSE;
		}
		//NOTE: for non-standard submission urls this would fail!
		$submission_url = (strrpos($server_url, '/') === strlen($server_url)-1) ? $server_url.'submission' : $server_url.'/submission';

		$authorized = $this->_check_authentication($submission_url, $credentials);

		if ($authorized === NULL){
			$this->CI->form_validation->set_message('authorization_check', 'Error communicating with server.');
		}
		return $authorized === TRUE;
    }

    public function get_credentials($session_passed = NULL)
    {
    	return $this->CI->User_model->get_credentials($session_passed);
    }

    //this check would actually belong in the Openrosa.php library but to move as much as possible to private repo it isn't
    private function _check_authentication($url, $credentials)
    {
    	$this->CI->load->library('openrosa');
    	$headers_and_info = $this->CI->openrosa->get_headers($url, $credentials);
    	log_message('debug', 'headers and info in auth check: '.json_encode($headers_and_info).' with credentials: '.json_encode($credentials));
    	if ($headers_and_info['http_code'] >= 200 && $headers_and_info['http_code'] < 300) {
    		return TRUE;
    	}
    	if ($headers_and_info['http_code'] == 401) {
    		return FALSE;
    	}
    	return NULL;
    }
}
