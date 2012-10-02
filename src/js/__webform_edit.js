/**
 * @preserve Copyright 2012 Martijn van de Rijdt
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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global BlobBuilder, Connection, Cache, vkbeautify, saveAs, gui, jrDataStr, jrDataStrToEdit, report, Form, store:true, StorageLocal:true, Settings, Modernizr*/

/* Global Variables and Constants -  CONSTANTS SHOULD BE MOVED TO CONFIG FILE AND ADDED DYNAMICALLY*/
var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var /**@type {Settings}*/settings,
	currentOnlineStatus = false;
var /**@type {StorageLocal}*/ store;
var MODERN_BROWSERS_URL = 'modern_browsers';
var CONNECTION_URL = '../checkforconnection.php';
DEFAULT_SETTINGS = {'autoUpload':false, 'buttonLocation': 'bottom'};


//tight coupling with Form and Storage class, but loose coupling with GUI
// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function() {
	'use strict';

	//store = new StorageLocal();
	form = new Form('form.jr:eq(0)', jrDataStr, jrDataStrToEdit);
	//settings = new Settings();
	//settings.init();
	connection = new Connection();
	
	//if (!store.isSupported()){
//		window.location = MODERN_BROWSERS_URL;
//	}
//	else{
//		$(document).trigger('browsersupport', 'local-storage');
//	}

	gui.updateStatus.offlineLaunch(false);
	
	form.init();
	connection.init();
	gui.setup();

	//trigger fake save event to update formlist on data page
	//$('form.jr').trigger('save', JSON.stringify(store.getFormList()));
});
