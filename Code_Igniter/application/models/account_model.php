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

    private $mocks = array(
        'https://active.api.high.testserver'   => array('api_access' => TRUE,  'quota' => 1000000 ),
        'https://active.api.low.testserver'    => array('api_access' => TRUE,  'quota' => 0),
        'https://active.noapi.high.testserver' => array('api_access' => FALSE, 'quota' => 1000000 ),
        'https://active.noapi.low.testserver'  => array('api_access' => FALSE, 'quota' => 0 ),
        'https://inactive.testserver'          => array('quota' => FALSE ),
        'https://noexist.testserver'           => array('quota' => NULL )     
    );

    private function _mock($server_url, $api_token)
    {
        return ($api_token === 'avalidtoken') 
            ? array_merge($this->mocks['$server_url'], array('token_approved' => TRUE))
            : array ('token_approved' => FALSE);
    }

    public function get_status($server_url, $api_token)
    {
        if (isset($this->mocks[$server_url])) {
            return $this->_mock($this->mocks[$server_url], $api_token);
        } else {
            return $this->_domain_allowed($server_url, $api_token) 
            ? array('token_approved' => TRUE, 'api_access' => TRUE, 'quota' => 10000000)
            : array('token_approved' => FALSE);
        }
    }

    public function logo_url($server_url)
    {
        return NULL;
    }

    /* 
     * serverURLs can be restricted
     */
    private function _domain_allowed($server_url, $api_token)
    {
    	$domains_allowed = $this->config->item('openrosa_domains_allowed');
    	if (empty($domains_allowed)) {
            return TRUE;
        }

    	foreach ($domains_allowed as $domain_allowed){
    		if (preg_match('/^https?:\/\/'.strtolower(trim($domain_allowed['url'])).'.*/' , strtolower(trim($server_url)))
                && $api_token === $domain_allowed['api_token']) {
    			return TRUE;
    		}
    	}
    	log_message('error', 'attempt was made to launch enketo form for dissallowed OpenRosa server URL or with invalid API token: '.$server_url.' : '.$api_token);
    	return FALSE;
    }
}
/* End of file Account_model.php */