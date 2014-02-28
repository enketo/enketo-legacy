<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
/**
 * Account Class
 *
 * Account Mock class that determines whether requests are allowed
 *
 * @author        	Martijn van de Rijdt
 * @license         see link
 * @link			https://github.com/MartijnR/enketo
 */

class Account {

    private $CI;

    function __construct()
    {
        $this->CI =& get_instance();
        log_message('debug', 'Mock Account Model initialized');
    }

    private $mocks = array(
        'https://testserver.com/bob'            => array('api_token' => 'abc', 'api_access' => TRUE,  'quota' => 1000000 ),
        'https://testserver.com/noquota'        => array('api_token' => 'abc', 'api_access' => TRUE,  'quota' => -1 ),
        'https://testserver.com/noapi'          => array('api_token' => 'abc', 'api_access' => FALSE, 'quota' => 1000000 ),
        'https://testserver.com/noquotanoapi'   => array('api_token' => 'abc', 'api_access' => FALSE, 'quota' => -1 ),
        'https://testserver.com/notpaid'        => array('api_token' => 'abc', 'quota' => FALSE ),
        'https://testserver.com/notexist'       => array('api_token' => NULL,  'quota' => NULL )     
    );

    public function get_status($server_url)
    {
        log_message('debug', 'getting status of '.$server_url);
        if (isset($this->mocks[$server_url])) {
            return $this->mocks[$server_url];
        } else {
            $api_token = $this->_get_api_token($server_url);
            return ($api_token) 
            ? array('api_token' => $api_token,  'api_access' => TRUE,   'quota' => 10000000)
            : array('api_token' => NULL,        'api_access' => FALSE,  'quota' => NULL);
        }
    }

    public function logo_url($bla=NULL)
    {
        if ($this->CI->config->item('brand') === 'formhub') {
            return "/images/logo-black.png";
        } else return "/private_media/images/enketo_bare_150x56.png";
    }

    public function serve_allowed($server_url)
    {
        $account_status = $this->get_status($server_url);
        return ($account_status['quota'] && $account_status['quota'] > 0);
    }

    public function preview_allowed($server_url)
    {
        $account_status = $this->get_status($server_url);
        return ($account_status['quota'] && $account_status['quota'] > 0);
    }

    /* 
     * serverURLs can be restricted
     */
    private function _get_api_token($server_url)
    {
    	$domains_allowed = $this->CI->config->item('openrosa_domains_allowed');
    	if (empty($domains_allowed)) {
            return NULL;
        }

    	foreach ($domains_allowed as $domain_allowed){
    		if (preg_match('/^https?:\/\/'.trim($domain_allowed['url']).'.*/' , trim($server_url))) {
    			return $domain_allowed['api_token'];
    		}
    	}
    	//log_message('error', 'attempt was made to launch enketo form for dissallowed OpenRosa server URL or with invalid API token: '.$server_url.' : '.$api_token);
    	return NULL;
    }
}
/* End of file Account_model.php */
