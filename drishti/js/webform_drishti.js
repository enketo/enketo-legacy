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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true, sub:true *//*global vkbeautify, gui, FormDataController, modelStr, StorageLocal, FileManager, Form*/

var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var /**@type {*}*/fileManager;

$(document).ready(function() {
	'use strict';
	var formParts, existingInstanceJ, instanceToEdit, loadErrors, jsonErrors, jDataO,
		queryParams = helper.getAllQueryParams(),
		formDataController = new FormDataController(queryParams);

	connection = new Connection();
	existingInstanceJ = formDataController.get();

	if (!existingInstanceJ){
		$('form.jr').remove();
		return gui.alert('Instance with id "'+settings.instanceId+'" could not be found.');
	}

	jDataO = new JData(existingInstanceJ);
	instanceToEdit = jDataO.toXML();
	console.debug('instance to edit: ', instanceToEdit);
	form = new Form('form.jr:eq(0)', modelStr, instanceToEdit);

	loadErrors = form.init();

	//controller for submission of data to drishti
	$(document).on('click', 'button#submit-form:not(:disabled)', function(event){
		var jData, saveResult, 
			$button = $(this);
		$(this).btnBusyState(true);
		//without this weird timeout trick the button won't change until form.validateForm() is complete
		//something odd that seems to happen when adding things to DOM.
		setTimeout(function(){
			if (typeof form !== 'undefined') {
				form.validateForm();
				if (!form.isValid()){
					gui.alert('Form contains errors <br/>(please see fields marked in red)');
					$button.btnBusyState(false);
					return;
				} else {
					jData = jDataO.get();
					delete jData.errors;
					saveResult = formDataController.save(form.getInstanceID(), jData);
					$button.btnBusyState(false);
				}
			}		
		}, 100);
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