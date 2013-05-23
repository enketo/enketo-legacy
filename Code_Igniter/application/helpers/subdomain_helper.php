<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package		CodeIgniter
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2008 - 2011, EllisLab, Inc.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * CodeIgniter Subdomain Helpers
 *
 * @package		CodeIgniter
 * @subpackage	Helpers
 * @category	Helpers
 * @author		Aid Web Solutions
 * @link		
 */

// ------------------------------------------------------------------------

/**
 * Element
 *
 * For use with wildcard subdomain virtual hosts to determine subdomain used to access the page.
 * Provides you with the subdomain and returns NULL if no subdomain is used or if it is 'www'
 * 
 * @access	public
 * @param	string
 * @param	mixed
 * @return	mixed	depends on whether subdomain was used to access the page
 */
if ( ! function_exists('get_subdomain'))
{
	function get_subdomain($default = NULL)
	{ 
		$full_url = full_base_url(); 
		$base_url = base_url();
		
		if ($full_url != $base_url)
		{		
			//log_message('debug', 'full_url '.$full_url);
			$base_name = substr($base_url, strpos($base_url, '://')+3, -1);
			//log_message('debug', 'base_name '.$base_name);
			$start = strpos($full_url, '://') + 3;
			$end = strpos($full_url, '.'.$base_name);
			if($start < $end) $subdomain_name = substr($full_url, $start , $end - $start);
			else $subdomain_name = '';
			log_message('debug', 'subdomain extracted: '.$subdomain_name);
		}
	 
		if ( !isset($subdomain_name) || $subdomain_name === 'www' || $subdomain_name === '')
		{
			return $default;
		}

		return strtolower($subdomain_name);
	}
}

if ( ! function_exists('full_base_url') )
{
	function full_base_url($path=''){
		if(empty($_SERVER['HTTPS'])) {
			$protocol = 'http://';
			$default_port = 80;
		} else {
			$protocol = 'https://';
			$default_port = 443;
		}
        $domain = $_SERVER['SERVER_NAME'];
        //log_message('debug', 'server_name: '.$domain);
		// append port to domain only if it's a nonstandard port. don't use HTTP_HOST as it can be manipulated by the client
		if($_SERVER['SERVER_PORT'] != $default_port) $domain .=  ':' . $_SERVER['SERVER_PORT'];
		$domain = (strpos($domain, 'www.') === 0 ) ? substr($domain, 4) : $domain; 

		return $protocol.$domain . '/'.$path;
	}
}

//if ( ! function_exists('get_subdomain_plus_base_url') )
//{
//	function get_subdomain_plus_base_url()
//	{
//		$this->load->helper('http');
//		
//		return url_add_protocol($_SERVER['SERVER_NAME'].'/');
//	}
//}
