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
		//if there is a subdomain e.g. sub.example.com, i.e. > dots
		if(strpos($full_name, '.') != strrpos($full_name, "."))
		{
			// extract it => e.g. result = 'sub' 
			// NOTE: does not work for multiple-level subdomains e.g.: sub1.sub2.example.com
			// nor for domains such as co.uks
			//$subdomain_arr = explode('.', $full_name, 2);
			//$subdomain_name = $subdomain_arr[0];
			log_message('debug', 'going to extract subdomain');
			$subdomain_name = substr($full_name, 0, strrpos($full_name, '.', -5));
			log_message('debug', 'subdomain extracted: '.$subdomain_name);
		}
	
		if ( !isset($subdomain_name) OR $subdomain_name == 'www')
		{
			return $default;
		}

		return strtoupper($subdomain_name);
	}
}
