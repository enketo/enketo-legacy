<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Configuration file for all settings EXCEPT the database settings
 * 
 * NOTE: if the lowest level subdomain does not start with 'enketo' 
 * (e.g not enketo.formhub.org or enketo-dev.formhub.org, but example.com ) 
 * $config['base_url'] (line 26 in config.php) will have to be edited as well.
 * 
 */

/**
 * These are required for the geopoint widget to work in the forms. 
 * The first is for the Google Maps API v3 (fancy dynamic maps)
 * The second is for the Google Maps Static API (simple read-only maps)
 * Request your own here: https://developers.google.com/maps/signup
 */
$config['google_maps_api_v3_key'] = "";
$config['google_maps_static_api_key'] = "";

/**
 * Leave empty if not using Google Analytics
 */
$config['google_analytics_key'] = "";

/**
 * Used for various purposes, including links back to ...., leave empty if enketo is used as a standalone app
 */
$config['integration_with_url'] = "https://formhub.org";

/**
 * Will be used to direct users throughout application
 */
$config['support_email'] = "support@formhub.org";

/**
 * In the forms (form browser) view this defines which server URL helper to set as default
 * options: 'http', 'https', 'formhub', 'formhub_u', 'appspot' 
 */
$config['default_server_url_helper'] = "formhub";

/**
 * In the webform view this is the brand name shown (empty = enketo)
 */
$config['brand'] = "formhub";

/**
 * OpenRosa servers that are allowed to connect
 */
$config['openrosa_domains_allowed'] = array("formhub.org", "www.formhub.org");

/**
 * **********************************************************
 * It is not recommended to change anything below this line *
 * **********************************************************
 */
$config['integrated'] = strlen($config['integration_with_url']) > 0;
$config['auth_support'] = is_dir(APPPATH.'third_party/form_auth');