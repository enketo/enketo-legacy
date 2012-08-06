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
		//if there is a subdomain e.g. sub.example.com
		if(strpos($_SERVER['SERVER_NAME'], '.') != strrpos($_SERVER['SERVER_NAME'], "."))
		{
			// extract it => e.g. result = 'sub' 
			// NOTE: does not work for multiple-level subdomains e.g.: sub1.sub2.example.com
			// nor for domains such as co.uk
			$subdomain_arr = explode('.',$_SERVER['SERVER_NAME'], 2);
			$subdomain_name = $subdomain_arr[0];
		}
	
		if ( !isset($subdomain_name) OR $subdomain_name == 'www')
		{
			return $default;
		}

		return strtoupper($subdomain_name);
	}
}
