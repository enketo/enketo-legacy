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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global Connection, gui, jrDataStr, settings, jrDataStrToEdit, Form*/

/* Global Variables and Constants -  CONSTANTS SHOULD BE MOVED TO CONFIG FILE AND ADDED DYNAMICALLY*/
var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var	currentOnlineStatus = false;
var /**@type {FileManager}*/fileManager;

//var /**@type {StorageLocal}*/store; //leave, though not used, to prevent compilation error

//tight coupling with Form and Storage class, but loose coupling with GUI
// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function() {
	'use strict';
	var loadErrors;

	form = new Form('form.jr:eq(0)', jrDataStr, jrDataStrToEdit);

	connection = new Connection();
	
	loadErrors = form.init();
	if (loadErrors.length > 0){
		gui.showLoadErrors(loadErrors, 'It is highly recommended <strong>not to edit</strong> this record until this is resolved.');
	}
	connection.init();
	gui.setup();
});
