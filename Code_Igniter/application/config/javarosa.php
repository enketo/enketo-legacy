<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* Configuration file for javarosa compliant server used to manage forms and data
* by Martijn van de Rijdt
*/

/*
|--------------------------------------------------------------------------
| NOT USED
|--------------------------------------------------------------------------
|
| |
*/


//JavaRosa compliant server in case built-in server is not used. (e.g. ODK Aggregate)
//$config['jr_server'] = 'https://jrosaforms.appspot.com';

//URL of formList (usually not required to set)
//CHANGE TO: "/xformsList"
//$config['jr_formlist'] = 'https://jrosaforms.appspot.com/formList';

//URL of submission (usually not required to set)
//$config['jr_submission'] = 'https://jrosaforms.appspot.com/submission';


/*
	Do not change the code below
*/

if ( !isset($config['jr_server']) || $config['jr_server'] == '')
{
	$config['jr_server'] = 'data';
}

if ( !isset($config['jr_formlist']) || $config['jr_formlist'] == '')
{
	$config['jr_formlist'] = $config['jr_server'].'/formList';
}

if ( !isset($config['jr_submission']) || $config['jr_submission'] == '')
{
	$config['jr_submission'] = $config['jr_server'].'/submission';
}