/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modi Research Group at Columbia University
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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global vkbeautify, gui, jrDataStr, StorageLocal, FileManager, Form*/

var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var /**@type {StorageLocal}*/store;
var /**@type {FileManager}*/fileManager;

$(document).ready(function() {
	'use strict';
	var loadErrors;
	connection = new Connection();
	form = new Form('form.jr:eq(0)', jrDataStr);
	store = new StorageLocal();

	loadErrors = form.init();
	if (loadErrors.length > 0){
		gui.showLoadErrors(loadErrors, 'It is recommended not to use this form for data entry until this is resolved.');
	}

	$(document).on('click', 'button#validate-form:not(.disabled)', function(){
		if (typeof form !== 'undefined'){
			form.validateForm();
			if (!form.isValid()){
				gui.alert('Form contains errors <br/>(please see fields marked in red)');
				return;
			}
		}
	});
});

/**
 * Connection Class (this can probably be removed - it is kept in for the google maps script only)
 * @constructor
 */
function Connection (){
	/**
	* Loads a google maps API v3 script
	* @param  {Function} callback function to call when script has been loaded and added to DOM
	*/
	this.loadGoogleMaps = function(callback){};
}