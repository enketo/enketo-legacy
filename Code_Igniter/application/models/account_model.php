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

class Account_model extends CI_Model {

    function __construct()
    {
        parent::__construct();
        log_message('debug', 'Account Model initialized');
    }

    public function serve_allowed($server_url)
    {
    	return TRUE;
    }
    public function launch_allowed($server_url)
    {
    	return $this->_domain_allowed($server_url);
    }
    public function get_reason()
    {
    	return 'This enketo installation is for use by formhub.org users only.<br/><br/> Please visit enketo.org or '.
    		'contact info@enketo.org if you would like to discuss possibilities for using enketo as a hosted service '.
    		'for your own OpenRosa server.';
    }
    /* 
     * for installations that do not have a paywall, serverURLs can be restricted
     */
    private function _domain_allowed($server_url)
    {
    	$domains_allowed = $this->config->item('openrosa_domains_allowed');
    	if (empty($domains_allowed)) return TRUE;

    	foreach ($domains_allowed as $domain_allowed)
    	{
    		if (preg_match('/^https?:\/\/'.strtolower(trim($domain_allowed)).'.*/' , strtolower(trim($server_url))))
    		{
    			return TRUE;
    		}
    	}
    	log_message('debug', 'attempt was made to launch enketo form for dissallowed OpenRosa server URL: '.$server_url);
    	return FALSE;
    }
}
/* End of file Account_model.php */