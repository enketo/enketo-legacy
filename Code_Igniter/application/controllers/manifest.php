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
 * @package Manifest Builder
 * @author  Martijn van de Rijdt
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
        private $hash_manual_override = '0036'; //time();
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
        private $offline = '/offline';  
    /*
    |--------------------------------------------------------------------------
    | pages to always retrieve from the server (html5 manifest 'network' section)
    |--------------------------------------------------------------------------
    */
        private $network = array('*');
    /*
    |---------------------------------------------------------------------------
    */
    
    private $data;
    private $master_page;

    public function __construct()
    {
        parent::__construct();
        $this->load->helper(array('url', 'json', 'subdomain', 'http'));
        $this->load->model('Survey_model','',TRUE);
        $this->load->driver('cache', array('adapter' => 'apc', 'backup' => 'file'));
        $this->manifest_url = $this->_full_url(uri_string());
        //$this->_set_context();
        log_message('debug', 'Manifest Controller initialized for url: '. $this->manifest_url);
    }

    public function html()
    {
        $pages = func_get_args();
        //!important the first argument is assumed to be the master entry which is implicitly cached
        //and removed from the manifest as a test to solve issue with manifest updates
        if(!empty($pages)) {
            if (!$data = $this->cache->get($this->manifest_url)) {
                log_message('debug', 'creating manifest');
                $this->master_page = $pages[0];
                
                foreach ($pages as $page) {
                    if (!empty($page)) {
                        $this->pages[] = $page;
                    }
                }
                $this->_set_data();
                $data = $this->data;
                if (count($data['cache']) > 0) {
                    $this->cache->save($this->manifest_url, $data, 60);
                }
            }
            
            if (count($data['cache']) > 0 ) {
                $this->load->view('html5_manifest_view.php', $data);
                return;
            }
        }
        // else return an empty manifest that can be used to remotely clear the client's applicationCache
        log_message('debug', 'no pages or master page is null/not authorized');
        show_404();
    }

    /**
     * An uncached copy of the manifest (not referred to anywhere as a manifest and therefore not cached in browser)
     * meant for trouble-shooting. Simply replace "html" with "test" in the manifest URL. 
     * Eg. "http://abcd.enketo.org/manifest/html/webform" becomes "http://abcd.enketo.org/manifest/test/webform"
     */
    public function test()
    {
        $this->cache->delete($this->manifest_url);
        $args = func_get_args();
        call_user_func_array(array($this, 'html'), $args);
    }

    public function index()
    {
        show_404();
    }
    
    private function _set_data(){
        //if a subdomain is present, this manifest is meant for a survey and needs to be live, launched and offline-enabled
        if ( (get_subdomain() && $this->Survey_model->is_launched_live_and_offline()) || !get_subdomain()) {
            $this->data['hashes'] = '';
            $this->data['cache'] = $this->pages;    
            foreach ($this->pages as $page) {
                //log_message('debug', 'checking resources on page: '.$this->_full_url($page));
                $page_full_url = $this->_full_url($page.
                    '?manifest=true&s='.urlencode($this->session->userdata('session_id')).
                    '&token='.urlencode($this->encrypt->encode('localrequest')));
                $result = $this->_add_resources_to_cache($page_full_url);
                if (!$result) {
                    //if the master page is null, cancel everything and return a 404
                    if ($page === $this->pages[0]){
                        $this->data['cache'] = array();
                        return;
                    }
                    //remove non-existing page from manifest
                    $key = array_search($page, $this->data['cache']);
                    unset($this->data['cache'][$key]);
                }
            }
            //remove Master page
            $key = array_search($this->master_page, $this->data['cache']);
            unset($this->data['cache'][$key]);  

            $this->data['hashes'] = md5($this->data['hashes']).'_'.$this->hash_manual_override; //hash of hashes        
            $this->data['network'] = $this->network;
            $this->data['fallback']= $this->offline;    
        }
    }
    
    // function to add all direct and direct resources from html page to cache
    private function _add_resources_to_cache($full_url)
    {
        $resources = $this->_get_resources_from_html($full_url);
        //add each new resource to the cache and calculate the hash 
        //print_r($resources); 
        if (!$resources) {
            return FALSE;
        }
        foreach ($resources as $resource) {
            //log_message('debug', 'checking resource')
            if (!in_array($resource, $this->data['cache']))
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
        if (!$resources) {
            return NULL;
        }
        foreach ($resources as $resource_in_html) {     
            // if the resource is a css stylesheet, also obtain all image urls 
            // from the stylesheet and add these
            $pattern = '/\.css/';
            if (preg_match($pattern, $resource_in_html)>0) {
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
        //doesn't do @import-ed resources
        $pattern = '/url[\s]?\([\s]?[\'\"]?([^\)\'\"]+)[\'\"]?[\s]?\)/';///url\(([^)]+)\)/';
        $index = 1; //match of 1st set of parentheses is what we want
        return $this->_get_resources($path, $pattern, $index, $base);
    }
    
    // generic function to extract resources from a url based on a given pattern
    // only goes one level deep
    private function _get_resources($url, $pattern, $i, $base=NULL)
    {
        $content = $this->_get_content($url);
        
        if (isset($content)) {
            $this->data['hashes'] .= md5($content);

            preg_match_all($pattern, $content, $result_array);
            $found_resources = $result_array[$i];
            $cache_resources = array();

            foreach ($found_resources as $index => $resource) {
                if (isset($base) && strpos($resource, '/') !== 0) {
                    $resource = $base . $resource;
                }

                if (!in_array($resource, $cache_resources)) {
                    $content = $this->_get_content($resource);
                    //if (strpos($resource, '/media/get/') === 0) log_message('debug', 'content retrieved: '.$content);
                    if (!empty($content)) {
                        $cache_resources[] = $resource;
                        $this->data['hashes'] .= md5($content);
                    } else {
                        log_message('error', 'resource: '.$resource.' could not be found, removed from manifest.');
                        //unset($resources[$index]);
                    }
                } else {
                    //log_message('debug', 'resource '.$resource.' was already added');
                }
            }
            return $cache_resources;
        } else {
            return NULL;
        }
    }
    
    // get the content, if possible through path, otherwise url
    private function _get_content($url_or_path)
    {
        //log_message('debug', 'getting content of '.$url_or_path);
        //remove hashes
        if (strpos($url_or_path, '#')) $url_or_path = substr($url_or_path, 0, strpos($url_or_path, '#'));
        //add base_url for external (spoofed) media resources and prevent actually downloading by using /media/check
        //knowing that (in formhub) when the media file changes it will get a new url, so the manifest will already be updated
        //also note the content returned in /media/check contains the content-length of the media file
        if (strpos($url_or_path, '/media/get/') === 0) {
            $url_or_path = $this->_full_url(preg_replace('/\/media\/get\//', '/media/check/', $url_or_path));
        }

        if (strpos($url_or_path, 'http://') !== 0 && strpos($url_or_path, 'https://') !== 0) {  
            $rel_path = (strpos($url_or_path, '/') === 0) ? substr($url_or_path, 1) : $url_or_path;
            $abs_path = constant('FCPATH'). $rel_path; 
            $content = (is_file($abs_path)) ? file_get_contents($abs_path) : NULL;
        } else {
            //$context = stream_context_create( $this->context_arr );
            //$content = file_get_contents($url_or_path, FALSE, $context);
            $content = file_get_contents($url_or_path);
        }
        if (empty($content)) {
            log_message('error', 'Manifest controller failed to get contents of '.$url_or_path);
        }
        return $content;
    }
    
    /**
     * returns a full url if relative url was provided
     * if the relative url is not relative to the webroot, an alternative base can be provided
     */
    private function _full_url($url, $base=NULL)
    {
        if(!isset($base)) {
            $base =  full_base_url();
        }
        //in case relative urls were used, prepend the base
        if (strpos($url, 'http://')!==0 && strpos($url, 'https://')!==0 && $url !== '*') {
            $url = $base.$url;
        }
        //log_message('debug', '_full_url() returns:'.$url);
        return $url;
    }

    /**
     * sets context (cookie with session identifier) for file_get_contents so credentials for form can be retrieved
     * TODO: doesn't work because session is re-created every 5 minutes and uses IP address
     * TODO: need to pass IP address
     * from browser session (and not from a NEW session that file_get_contents would otherwise create.
     */
    /*private function _set_context()
    {
        $opts['http']['method'] = 'GET';
        $opts['http']['user_agent'] = $_SERVER['HTTP_USER_AGENT'];

        if( count( $_COOKIE ) > 0 ) {
            $cookie_string = 'Cookie: ';
            $i = 1;
            foreach( $_COOKIE as $k => $v ) {
                if( $i !== 1 ) {
                    $cookie_string .= '; ';
                }
                $cookie_string .= $k . '=' . urlencode( $v );
                $i++;
            }
            $opts['http']['header'][] = $cookie_string;
        }
        $this->context_arr = $opts;
        //log_message('debug', 'context for file_get_contents created from browser cookie');
    }*/
}
?>
