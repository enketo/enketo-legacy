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
//if ( ! function_exists('append_XML'))
//{
//	// root: parent element - SimpleXMLElement instance
//	// append: XML object from simplexml_load_string	
//	function append_XML(&$root, $append) {
//		//log_message('debug', 'trying to merge simplexml objects');
//		//log_message('debug', 'root: '.$root->asXML());
//	    if ($append) {
//	        if (strlen(trim((string) $append))==0) {
//	            $xml = $root->addChild($append->getName());
//	            foreach($append->children() as $child) {
//	                append_XML($xml, $child);
//	            }
//	        } else {
//	            $xml = $root->addChild($append->getName(), (string) $append);
//	        }
//	        foreach($append->attributes() as $n => $v) {
//	            $xml->addAttribute($n, $v);
//	        }
//	    }
//	}
//}
//
//if (! function_exists('mergeXML'))
//{
//	function mergeXML(&$base, $add) 
//	{ 
//	    if ( $add->count() != 0 ) 
//	        $new = $base->addChild($add->getName()); 
//	    else 
//	        $new = $base->addChild($add->getName(), $add); 
//	    foreach ($add->attributes() as $a => $b) 
//	    { 
//	        $new->addAttribute($a, $b); 
//	    } 
//	    if ( $add->count() != 0 ) 
//	    { 
//	        foreach ($add->children() as $child) 
//	        { 
//	            mergeXML($new, $child); 
//	        } 
//	    } 
//	} 
//}
//
//if (! function_exists('SimpleXMLElement_append'))
//{
//	function SimpleXMLElement_append($parent, $child)
//	{
//	    // get all namespaces for document
//	    $namespaces = $child->getNamespaces(true);
//	
//	    // check if there is a default namespace for the current node
//	    $currentNs = $child->getNamespaces();
//	    $defaultNs = count($currentNs) > 0 ? current($currentNs) : null; 
//	  	$prefix = (count($currentNs) > 0) ? current(array_keys($currentNs)) : '';
//	    $childName = strlen($prefix) > 1
//	        ? $prefix . ':' . $child->getName() : $child->getName();
//	
//	    // check if the value is string value / data
//	    if (trim((string) $child) == '') {
//	        $element = $parent->addChild($childName, null, $defaultNs);
//	    } else {
//	        $element = $parent->addChild(
//	            $childName, htmlspecialchars((string)$child), $defaultNs
//	        );
//	    }
//	
//	    foreach ($child->attributes() as $attKey => $attValue) {
//	        $element->addAttribute($attKey, $attValue);
//	    }
//	    foreach ($namespaces as $nskey => $nsurl) {
//	        foreach ($child->attributes($nsurl) as $attKey => $attValue) {
//	            $element->addAttribute($nskey . ':' . $attKey, $attValue, $nsurl);
//	        }
//	    }
//	
//	    // add children -- try with namespaces first, but default to all children
//	    // if no namespaced children are found.
//	    $children = 0;
//	    foreach ($namespaces as $nskey => $nsurl) {
//	        foreach ($child->children($nsurl) as $currChild) {
//	            SimpleXMLElement_append($element, $currChild);
//	            $children++;
//	        }
//	    }
//	    if ($children == 0) {
//	        foreach ($child->children() as $currChild) {
//	            SimpleXMLElement_append($element, $currChild);
//	        }
//	    }
//	}
//}