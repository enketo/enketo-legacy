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
		$full_name = $_SERVER['SERVER_NAME'];
		
		$full_url = full_base_url(); //(isset($_SERVER['HTTPS'])) ? 'https://'.$full_name.'/' : 'http://'.$full_name.'/';
		//log_message('debug', 'full url:'.$full_url);
		//log_message('debug', 'base url: '.base_url());

		if ($full_url != base_url())
		{
			// extract it => e.g. result = 'sub' 
			// NOTE: does not work for multiple-level subdomains e.g.: sub1.sub2.example.com
			// nor for domains such as co.uks//
			//$subdomain_arr = explode('.', $//full_name, 2);
			//$subdomain_name = $subdomain_arr[0];
			//log_message('debug', $full_name);
			
			//log_message('debug', 'going to extract subdomain');
			//$subdomain_name = substr($full_name, 0, strrpos($full_name, '.', -5));	
			
			//extracts only the lowest level subdomain - e.g. for 'a.b.example.com' -> returns 'a'
			$subdomain_name = substr($full_name, 0, strpos($full_name, '.'));
			log_message('debug', 'subdomain extracted: '.$subdomain_name);
		}
	 
		if ( !isset($subdomain_name) OR $subdomain_name == 'www')
		{
			return $default;
		}

		//if the last character is '-' pretend it is not there
		//if ( substr($subdomain_name, strlen($subdomain_name)-1) === '-')
		//{
		//	$subdomain_name = substr($subdomain_name, 0, strlen($subdomain_name) - 1) );
		//}

		return strtolower($subdomain_name);
	}
}

if ( ! function_exists('full_base_url') )
{
	function full_base_url($path=''){
		$full_name = $_SERVER['SERVER_NAME'].'/'.$path;

		return (isset($_SERVER['HTTPS'])) ? 'https://'.$full_name : 'http://'.$full_name;
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
