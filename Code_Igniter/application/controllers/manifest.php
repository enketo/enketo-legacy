<?php

/**
 * Copyright 2012 Martijn van de Rijdt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Manifest Class
 *
 * @package	Manifest Builder
 * @author	Martijn van de Rijdt
 * @link	
 */


class Manifest extends CI_Controller {
	/*
	|--------------------------------------------------------------------------
	| MANIFEST BUILDER
	|--------------------------------------------------------------------------
	|	
	| Creates a manifest for offline Application Caches in Gears or HTML5 formats
	| 
	| Works by extracting resources from the html pages that are required to 
	| be available offline.
	|
	| A 'version' string is formed by creating a hash of all resources, 
	| not including the html pages themselves.
	|
	| A version change can be forced by increasing the override variable 
	| or changing this to a timestamp
	|
	|
	| NOTE: on a local test server the (sub)domain has to be included in the 
	| hosts file of the test server otherwise DNS will be used to get the 
	| contents of the html pages.
	|
	|--------------------------------------------------------------------------
	| force cache update 
	|--------------------------------------------------------------------------
	*/
		private $hash_manual_override = '107'; //time();
	/*
	|--------------------------------------------------------------------------	
	| pages to be cached (urls relative to sub.example.com/)
	|--------------------------------------------------------------------------
	*/	
		private $pages = array('', 'modern_browsers', 'survey_format'); 
	/*
	|--------------------------------------------------------------------------	
	| page to re-direct offline 404 requests to (html5 manifest 'fallback' section)
	|__________________________________________________________________________
	*/
		private $offline = 'offline';	
	/*
	|--------------------------------------------------------------------------
	| pages to always retrieve from the server (html5 manifest 'network' section)
	|--------------------------------------------------------------------------
	*/
		private $network = array('checkforconnection.txt', '*');
	/*
	|---------------------------------------------------------------------------
	*/
	
	private $data;

	public function __construct()
	{
		parent::__construct();
		$this->load->helper(array('url', 'json'));
		$this->load->model('Survey_model','',TRUE);
		$this->_set_data();
		log_message('debug', 'array with manifest resources generated');
	}
	
	public function index()
	{
		show_404('manifest');
	}

	public function gears()
	{	
		// IE9 requires these additional resources for Gears function properly
		$this->data['cache'][] = base_url().'index.php';
		
		// convert html5 manifest properties into object with Gears properties
		$g_data['manifest']['betaManifestVersion'] = 1;
		$g_data['manifest']['version'] = $this->data['hashes'];
		foreach ($this->data['cache'] as $resource)
		{
			$g_data['manifest']['entries'][] = array('url' => $resource);
		}
		
		// convert manifest object to pretty JSON format
		$g_data['manifest'] = stripslashes(json_format(json_encode($g_data['manifest'])));
			
		$this->load->view('gears_manifest_view.php', $g_data);
	}	
	
	public function html5()
	{
		$this->load->view('html5_manifest_view.php', $this->data);
	}
	
	private function _set_data(){
		//check if the survey exists (from subdomain) and is live
		if ($this->Survey_model->is_live_survey()){
			//convert to full urls
			$this->pages = $this->_full_url_arr($this->pages);
			$this->data['hashes'] = '';
			$this->data['cache'] = array();	
			foreach ($this->pages as $page)
			{
				$this->_add_resources_to_cache($page);				
			}
			$this->data['hashes'] = md5($this->data['hashes']).'_'.$this->hash_manual_override; //hash of hashes		
			$this->data['network'] = $this->_full_url_arr($this->network);
			$this->data['fallback']= $this->_full_url($this->offline);	
		}
		// else return an empty manifest that can be used to remotely clear the client's applicationCache
		else
		{
			$this->data['hashes'] = time(); //timestamp forces update of applicationCache
			$this->data['cache'] = array();
			$this->data['network'] = array();
			$this->data['fallback'] = '';
		}
	}
	
	// function to add all direct and direct resources from html page to cache
	private function _add_resources_to_cache($url)
	{
		$resources = array_merge( array($url), $this->_get_resources_from_html($url));
		
		//add each new resource to the cache and calculate the hash 
		foreach ($resources as $resource)
		{
			if (!in_array($resource, $this->data['cache']))
			{
			    $this->data['cache'][] = $resource;	
			    // create a hash of the content
				// NOTE: creating a hash from a dynamically created html file is
				// a problem because the hash will always change (because of header date info?)
				// therefore the hash is created from the content string
			    $this->data['hashes'] .= md5($this->_get_content($resource));
			}
		}
	}
	
	// get all resources used in a web page
	private function _get_resources_from_html($url, $base=NULL)
	{
		$pattern = '/(<script|<link|<img) [^>]*(src|href)="([^"]+)"/';
		$index = 3; //match of 3rd set of parentheses is what we want
		$resources = $this->_get_resources($url, $pattern, $index, $base);	
		foreach ($resources as $resource_in_html)
		{		
			// if the resource is a css stylesheet, also obtain all image urls 
			// from the stylesheet and add these
			$pattern = '/\.css/';
			if (preg_match($pattern, $resource_in_html)>0)
			{
			    // resources in a css file are assumed to be relative (to the css file) and may have
			    // a base different from the webroot
			    $base_url = substr($resource_in_html, 0, strrpos($resource_in_html, '/')+1);
			    // extract the resources from the css file
			    $resources = array_merge($resources, $this->_get_resources_from_css($resource_in_html, $base_url));
			}
		}
		return $resources;
	}
	
	// extract all resources from a css file
	private function _get_resources_from_css($url, $base=NULL)
	{
		$pattern = '/url\(([^)]+)\)/';
		$index = 1; //match of 1st set of parentheses is what we want
		return $this->_get_resources($url, $pattern, $index, $base);
	}
	
	// generic function to extract resources from a url based on a given pattern
	private function _get_resources($url, $pattern, $i, $base=NULL)
	{
		$content = $this->_get_content($url);
		preg_match_all($pattern, $content, $result_array);
		$resources = $result_array[$i];
		return $this->_full_url_arr($resources, $base);
	}
	
	// get the content from a url, if possible through path, otherwise url
	private function _get_content($url)
	{
		$rel = $this->_rel_url($url);
		return (is_file($rel)) ? file_get_contents($rel) : file_get_contents($url);
	}
	
	// turns array of relative and/or full urls into an array of full urls
	//if the relative url is not relative to the webroot, an alternative base can be provided
	private function _full_url_arr($url_array, $base=NULL)
	{
		foreach ($url_array as $index => $url)
		{
			$url_array[$index] = $this->_full_url($url, $base);
		}
		return $url_array;
	}
	
	//returns a full url if relative url was provided
	//if the relative url is not relative to the webroot, an alternative base can be provided
	private function _full_url($url, $base=NULL)
	{
		if(!isset($base))
		{
			$base = base_url();
		}
		//in case relative urls were used, prepend the base
		if (strpos($url, 'http://')!==0 && strpos($url, 'https://')!==0)
		{
			$url = $base.$url;
		}
		return $url;
	}
	
	//returns a relative url if a full url was provided
	private function _rel_url($url)
	{
		//in case full urls were used, remove the base_url:
		if (strpos($url, base_url())==0)
		{
			$url = substr_replace($url, '', 0, strlen(base_url()));
		}
		return $url;
	}
}


?>