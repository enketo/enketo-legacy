<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Leave empty if not using Google Analytics
 */
$config['google_analytics_key'] = "";

/**
 * Used for various purposes, best to fill something in for now
 */
$config['integration_with_url'] = "";

/**
 * Will be used to direct users throughout application
 */
$config['support_email'] = "support@example.com";

/**
 * In the webform view this is the brand name shown (empty = enketo)
 */
$config['brand'] = "";

/**
 * Array of themes that are included (only "formhub" is open-source). 
 * The first theme in the array is the default.
 */
$config['themes'] = array( "formhub" );

/**
 * OpenRosa servers that are allowed to connect
 */
$config['openrosa_domains_allowed'] = array();

/**
 * **********************************************************
 * It is not recommended to change anything below this line *
 * **********************************************************
 */
$config['integrated'] = strlen($config['integration_with_url']) > 0;
$config['auth_support'] = is_dir(APPPATH.'third_party/form_auth');
$config['account_support'] = is_dir(APPPATH.'third_party/account');
