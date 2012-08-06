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
 * Chart Helpers
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
 * 
 * 
 * @access	public
 * @param	string
 * @param	mixed
 * @return	mixed
 */
 
if ( ! function_exists('get_chart_url'))
{
	function get_chart_url($db_result, $field_name, $field_title, $map, $default=NULL)
	{
		$total = 0;
		
		foreach ($map as $index => $property_array)
		{
			if (!isset($map[$index]['value']))
			{
				return $default;
			}
			
			if (!isset($map[$index]['color']))
			{
				$map[$index]['color'] = '';
			}
			
			if (!isset($map[$index]['label']))
			{
				$map[$index]['label'] = '[LABEL MISSING]';
			}
			
			$map[$index]['count'] =  0;
		}
		
		if($db_result){
		    foreach ($db_result as $row)
		    {
		    	$row = (array)$row;
		    	if(isset($row[$field_name])){
		    		foreach ($map as $index => $property_array)
		    		{
		    		    if ($row[$field_name] == $property_array['value'])
		    		    {
		    		    	$map[$index]['count']++;
		    		    	$total++;
		    		    	break;
		    		    }
		    		}
		    	}
		    }
		}
		
		$values_str='';
		$label_str='';
		$color_str='';
		
		foreach ($map as $property_array)
		{
			$count = $property_array['count'];
			
			// create a string of the values
			$values_str .= $count.',';
			// create a string of the labels with percentages
			$label_str .= chart_string(
				$property_array['label'].' ('.
				round(100*$count/$total).'%)|'
			);
			// create a string of the colors
			$color_str .= chart_string(
				$property_array['color'].','
			);
		}
		// remove the last character (comma or | separator)
		$values_str = substr($values_str, 0, -1);
		$label_str = substr($label_str, 0, -1);
		$color_str = substr($color_str, 0, -1);
		
		if($total>0)
		{
			$chart_url = 'http://chart.apis.google.com/chart?'; // API URL
			$chart_url .= 'chf=bg,s,FEEEBD'.'&amp;'; //background color, // ADD needs to be set dynamically
			$chart_url .= 'chs=480x170&amp;cht=p3&amp;chtt='.chart_string($field_title).'&amp;'; // size,type,title
			$chart_url .= 'chd=t:'.$values_str.'&amp;'; // data
			$chart_url .= 'chco='.$color_str.'&amp;';	// colours
			$chart_url .= 'chl='.$label_str.'&amp;'; // text labels
			return $chart_url;
		}
		else
		{
			return $default;
		}
	}
}


if ( ! function_exists('chart_string'))
	{
		//cleans strings for use in Google Chart API urls
		function chart_string($string){
			$string = trim($string);
			$string = str_replace(' ', '+', $string);
			return $string;
	}
}
