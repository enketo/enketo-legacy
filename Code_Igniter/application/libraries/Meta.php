<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
/**
 * Meta Class
 *
 * Deals with Meta values that are best generated at server
 *
 * @author          Martijn van de Rijdt
 * @license         see link
 * @link            https://github.com/MartijnR/enketo
 */
class Meta {

    private $CI;
    private $cookie_prefix = '__enketo_meta_';

    public function __construct()
    {
        $this->CI =& get_instance();
        $this->CI->load->helper('url');
        $this->domain = $this->get_domain();
        log_message('debug', 'Meta library initialized');
    }

    public function setMeta($username = NULL) {
        
        if ($username) {
            // always re-set this value
            $this->setCookie( 'uid', $this->domain.':'.$username);
        } else {
            // but remove it if no username is passed
            $this->removeCookie ('uid');
        }

        if (!$this->getCookie('deviceid')) {
            $this->setCookie('deviceid', $this->domain.':'.$this->generate_deviceid(), TRUE);
        }
    }

    private function setCookie($name, $value, $expire_as_late_as_possible = FALSE )
    {
        if (empty($name) || empty($value)) {
            return;
        }
        $cookie = array(
            'name'   => $this->cookie_prefix . $name,
            'value'  => $value,
            'expire' => ($expire_as_late_as_possible) ? 10 * 365 * 24 * 60 * 60 : 7 * 24 * 60 *60,
            'domain' => $this->CI->config->item('cookie_domain'),
            'path'   => $this->CI->config->item('cookie_path'),
            'prefix' => $this->CI->config->item('cookie_prefix'),
            'secure' => $this->CI->config->item('cookie_secure')
        );
        $this->CI->input->set_cookie($cookie);
    }

    private function getCookie($name)
    {
        return $this->CI->input->cookie($this->cookie_prefix . $name, TRUE);
    }
    
    private function removeCookie($name)
    {
        return $this->CI->input->set_cookie(
            array(
                'name'   => $this->cookie_prefix . $name,
                'value'  => '',
                'expire' => 0
            )
        );
    }

    private function generate_deviceid()
    {
        $this->CI->load->helper('string');
        return random_string('alnum', 16);
    }

    private function get_domain() 
    {
        $base_url = base_url();
        $domain = substr( $base_url, strpos($base_url, '://') + 3 );
        return (strrpos($domain, '/') === strlen($domain) - 1) ? substr($domain, 0, -1) : $domain;
    }
}

/* End of file Meta.php */
