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
    	$this->CI =& get_instance();
        log_message('debug', 'Form_auth mock library initialized');
    }

    public function authenticate()
    {
    	$this->CI->load->view('auth_error_view');
    }

    public function get_credentials($s = 5)
    {
    	return NULL;
    }
}
