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
 * This is required for the geopoint widget to work in the forms. Request your own here:
 * https://developers.google.com/maps/signup
 */
$config['google_maps_api_v3_key'] = "AIzaSyDF5xYZfxN7r5SsNPGstjAeTzwa6dVU4Ik";

/**
 * Leave empty if not using Google Analytics
 */
$config['google_analytics_key'] = "UA-6765789-11";

/**
 * Used in front page to link back, leave empty if enketo is used as a standalon app
 */
$config['integration_with_url'] = "http://formhub.org";

/**
 * Will be used to direct users throughout application (not totally implemented yet)
 */
$config['support_email'] = "support@formhub.org";

/**
 * In the formlist view this defines which server URL helper to set as default
 * options: 'http', 'https', 'formhub', 'formhub_u', 'appspot' 
 */
$config['default_server_url_helper'] = "formhub";

/**
 * 
 * It is not recommended to change this
 */
$config['integrated'] = strlen($config['integration_with_url']) > 0;
