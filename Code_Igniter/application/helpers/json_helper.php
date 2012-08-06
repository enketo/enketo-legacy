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
 * @author		Umbrae (amended from http://php.tonnikala.org/manual/es/function.json-encode.php)
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
if ( ! function_exists('json_format'))
{
	function json_format($json)
	{
	    $tab = "  ";
	    $new_json = "";
	    $indent_level = 0;
	    $in_string = false;
	
	    $json_obj = json_decode($json);
	
	    if($json_obj === false)
	        return false;
	
	    $json = json_encode($json_obj);
	    $len = strlen($json);
	
	    for($c = 0; $c < $len; $c++)
	    {
	        $char = $json[$c];
	        switch($char)
	        {
	            case '{':
	            case '[':
	                if(!$in_string)
	                {
	                    $new_json .= $char . "\n" . str_repeat($tab, $indent_level+1);
	                    $indent_level++;
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case '}':
	            case ']':
	                if(!$in_string)
	                {
	                    $indent_level--;
	                    $new_json .= "\n" . str_repeat($tab, $indent_level) . $char;
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case ',':
	                if(!$in_string)
	                {
	                    $new_json .= ",\n" . str_repeat($tab, $indent_level);
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case ':':
	                if(!$in_string)
	                {
	                    $new_json .= ": ";
	                }
	                else
	                {
	                    $new_json .= $char;
	                }
	                break;
	            case '"':
	                if($c > 0 && $json[$c-1] != '\\')
	                {
	                    $in_string = !$in_string;
	                }
	            default:
	                $new_json .= $char;
	                break;                    
	        }
	    }
	
	    return $new_json;
	}
}