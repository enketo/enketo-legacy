<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
/**
 * Paywall Class
 *
 * Communicates with survey model and account model to determine whether request is allowed
 *
 * @author        	Martijn van de Rijdt
 * @license         see link
 * @link			https://github.com/MartijnR/enketo
 */
class Paywall {

	public function __construct()
    {
        log_message('debug', 'Paywall library initialized');
    }

    public function serve_allowed($server_url)
    {
    	return TRUE;
    }
    public function launch_allowed($server_url)
    {
    	return TRUE;
    }
    public function get_reason()
    {
    	return '';
    }
}

/* End of file Paywall.php */