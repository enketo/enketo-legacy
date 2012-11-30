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
	| contents of the html pages (with file_get_contents()).
	|
	|--------------------------------------------------------------------------
	| force cache update 
	|--------------------------------------------------------------------------
	*/
		private $hash_manual_override = '0011'; //time();
	/*
	|--------------------------------------------------------------------------	
	| pages to be cached (urls relative to sub.example.com/)
	|--------------------------------------------------------------------------
	*/	
		private $pages = array(); //, 'modern_browsers'); 
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
		private $network = array
		(
			'*'//'http://maps.googleapis.com/*', 'http://maps.gstatic.com/*', 'http://www.google-analytics.com/ga.js'
		);
	/*
	|---------------------------------------------------------------------------
	*/
	
	private $data;

	public function __construct()
	{
		parent::__construct();
		$this->load->helper(array('url', 'json', 'subdomain', 'http'));
		$this->load->model('Survey_model','',TRUE);
	}

	public function html()
	{
		$pages = func_get_args();
		foreach ($pages as $page)
		{
			if (!empty($page))
			{
				$this->pages[] = $page;
			}
		}
		$this->_set_data();
		$this->load->view('html5_manifest_view.php', $this->data);
	}

	public function index()
	{
		show_404();
	}
	
	private function _set_data(){
		//if a subdomain is present, this manifest is meant for a survey and needs to be live, launched and offline-enabled
		if ( (get_subdomain() && $this->Survey_model->is_launched_live_and_offline()) || !get_subdomain()){
			$this->data['hashes'] = '';
			$this->data['cache'] = $this->pages;	
			foreach ($this->pages as $page)
			{
				log_message('debug', 'checking resources on page: '.$this->_full_url($page));
				$page_full_url = $this->_full_url($page);
				$result = $this->_add_resources_to_cache($page_full_url);
				if (!$result)
				{
					//remove non-existing page from manifest
					$key = array_search($page, $this->data['cache']);
					unset($this->data['cache'][$key]);
				}		
			}
			$this->data['hashes'] = md5($this->data['hashes']).'_'.$this->hash_manual_override; //hash of hashes		
			$this->data['network'] = $this->network;
			$this->data['fallback']= $this->offline;	
		}
		// else return an empty manifest that can be used to remotely clear the client's applicationCache
		else
		{
			show_404();
		}
	}
	
	// function to add all direct and direct resources from html page to cache
	private function _add_resources_to_cache($full_url)
	{
		$resources = $this->_get_resources_from_html($full_url);
		//add each new resource to the cache and calculate the hash 
		//print_r($resources); 
		if (!$resources)
		{
			return FALSE;
		}
		foreach ($resources as $resource)
		{
			//log_message('debug', 'checking resource')
			//don't add existing or cross-domain resources for now
			if (!in_array($resource, $this->data['cache']) && strpos($resource, 'http://')!==0 && strpos($resource, 'https://')!==0)//&& url_exists($resource))
			{
				//log_message('debug', 'adding resource to cache: '.$resource);
			    $this->data['cache'][] = $resource;	
			}
		}
		return TRUE;
	}
	
	// get all resources used in a web page
	private function _get_resources_from_html($full_url, $base=NULL)
	{
		//SMALL PROBLEM: ALSO COPIES RESOURCES THAT ARE COMMENTED OUT
		$pattern = '/(<script|<link|<img) [^>]*(src|href)="([^"]+)"/';
		$index = 3; //match of 3rd set of parentheses is what we want
		$resources = $this->_get_resources($full_url, $pattern, $index, $base);	
		if (!$resources)
		{
			return NULL;
		}
		foreach ($resources as $resource_in_html)
		{		
			// if the resource is a css stylesheet, also obtain all image urls 
			// from the stylesheet and add these
			$pattern = '/\.css/';
			if (preg_match($pattern, $resource_in_html)>0)
			{
			    // resources in a css file are assumed to be relative (to the css file) and may have
			    // a base different from the webroot
			    $path_prefix = substr($resource_in_html, 0, strrpos($resource_in_html, '/')+1);
			    //log_message('debug', 'css path_prefix: '.$path_prefix);
			    // extract the resources from the css file
			    $resources = array_merge($resources, $this->_get_resources_from_css($resource_in_html, $path_prefix));
			}
		}
		return $resources;
	}
	
	// extract all resources from a css file
	private function _get_resources_from_css($path, $base=NULL)
	{
		//SMALL PROBLEM: ALSO EXTRACTS RESOURCES THAT ARE COMMENTED OUT
		$pattern = '/url\((|\'|\")([^\)]+)(|\'|\")\)/';///url\(([^)]+)\)/';
		$index = 2; //match of 1st set of parentheses is what we want
		return $this->_get_resources($path, $pattern, $index, $base);
	}
	
	// generic function to extract resources from a url based on a given pattern
	// only goes one level deep
	private function _get_resources($url, $pattern, $i, $base=NULL)
	{

		$content = $this->_get_content($url);
		
		if (isset($content))
		{
			$this->data['hashes'] .= md5($content);

			preg_match_all($pattern, $content, $result_array);
			$resources = $result_array[$i];

			foreach ($resources as $index => $resource)
			{
				if (isset($base)){
					$resource = $base . $resource;
				}

				$content = $this->_get_content($resource);
				
				if (!empty($content))
				{
					$resources[$index] = $resource;
					$this->data['hashes'] .= md5($content);
				}
				else
				{
					log_message('debug', 'resource: '.$resource.' could not be found, removed from manifest.');
					unset($resources[$index]);
				}
			}
			return $resources;
		}
		else
		{
			return NULL;
		}
	}
	
	// get the content, if possible through path, otherwise url
	private function _get_content($url)
	{
		//var_dump($url);
		log_message('debug', 'getting content of '.$url);
		if (strpos($url, 'http://')!==0 && strpos($url, 'https://')!==0)
		{
			//log_message('debug', 'checking url: '.$url);
			$abs_path = constant('FCPATH'). $url; //$this->_rel_url($url);
			//log_message('debug', 'checking absolute path: '.$abs_path);
			$content = (is_file($abs_path)) ? file_get_contents($abs_path) : NULL;
		}
		else
		{
			$content = (url_exists($url)) ? file_get_contents($url) : NULL;
		}

		return $content;
		//log_message('error', 'Manifest controller failed to get contents of '.$url);
		//return $content;
	}
	
	//returns a full url if relative url was provided
	//if the relative url is not relative to the webroot, an alternative base can be provided
	private function _full_url($url, $base=NULL)
	{
		if(!isset($base))
		{
			$base =  full_base_url();
		}
		//in case relative urls were used, prepend the base
		if (strpos($url, 'http://')!==0 && strpos($url, 'https://')!==0 && $url !== '*')
		{
			$url = $base.$url;
		}
		//log_message('debug', '_full_url() returns:'.$url);
		return $url;
	}
}
?>