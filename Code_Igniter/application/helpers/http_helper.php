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
if ( ! function_exists('url_exists'))
{
	function url_exists_and_valid($url)
	{
		return url_exists($url) && url_valid($url);
	}

	function url_exists($url)
	{		
//		$file_headers = @get_headers($url);
//		if ($file_headers[0] == 'HTTP/1.1 404 Not Found') 
//		{
//    		$exists = false;
//		}
//		else
//		{
//	    	$exists = true;
//		}	
//		return $exists;
//	}

	//returns true, if domain is availible, false if not
	   //check if URL is valid
		if(!filter_var($url, FILTER_VALIDATE_URL))
		{
			return false;
		}

		$agent = "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)";
		$ch = curl_init();
		curl_setopt ($ch, CURLOPT_URL, $url);
		curl_setopt ($ch, CURLOPT_USERAGENT, $agent);
		curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($ch,CURLOPT_VERBOSE, FALSE);
		curl_setopt ($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt ($ch,CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt ($ch,CURLOPT_SSLVERSION, 3);
		curl_setopt ($ch,CURLOPT_SSL_VERIFYHOST, FALSE);
		$page=curl_exec($ch);
		//echo curl_error($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		$exists = ($httpcode >= 200 && $httpcode < 300) ? TRUE : FALSE;
		if (!$exists)
		{
			log_message('error', 'HTTP Helper: resource at '.$url.' not available.');
		}
	}

	function url_make_valid($url)
	{
		$url = trim($url);
		$url = (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) ? $url : 'http://'.$url;
		return (url_valid($url)) ? $url : FALSE;
	}

	function url_valid($url)
	{
		//log_message('debug', 'result of url check on '.$url.filter_var($url, FILTER_VALIDATE_URL));
		return (filter_var($url, FILTER_VALIDATE_URL)) ? TRUE : FALSE;
	}



}