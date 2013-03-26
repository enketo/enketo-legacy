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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global vkbeautify, gui, FormDataController, modelStr, StorageLocal, FileManager, Form*/

var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var /**@type {StorageLocal}*/store;
var /**@type {FileManager}*/fileManager;

$(document).ready(function() {
	'use strict';
	var formParts, existingInstanceJ, instanceToEdit, loadErrors, jsonErrors,
		formDataController = new FormDataController({instanceId: settings.instanceId});

	connection = new Connection();

	/*
	formParts = store.getForm(settings.formId);

	if (!formParts){
		$('.main form').append('<div class="alert alert-error">Form with id: '+settings.formId+' could not be found.</div>');
		return;
	}

	$('.main form').replaceWith(formParts.form);
	*/
	existingInstanceJ = formDataController.get();//(settings.instanceId);

	if (settings.instanceId && !existingInstanceJ){
		gui.alert('Instance with id "'+settings.instanceId+'" could not be found. Loading empty form instead.');
	}

	/*if (existingInstanceJ && existingInstanceJ.formId !== settings.formId){
		gui.alert('<p>Could not load existing record because this record, with id: "'+settings.instanceId+
			'", belongs to form "'+existingInstanceJ.formId+'".<p><p>Loaded empty form instead.</p>');
		existingInstanceJ = null;
	}*/

	//instanceToEdit = (existingInstanceJ) ? transformer.JSONToXML(existingInstanceJ) : null;

	var jDataO = new JData(existingInstanceJ);

	console.log('XML to load: ', jDataO.toXML());

	form = new Form('form.jr:eq(0)', modelStr, jDataO.toXML());//, instanceToEdit);

	loadErrors = form.init();
	//check if JSON format is complete and if not, prepend the errors
	jsonErrors = jDataO.get().errors;
	loadErrors = (jsonErrors) ? jsonErrors.concat(loadErrors) : loadErrors;

	if (loadErrors.length > 0){
		gui.showLoadErrors(loadErrors, 'It is recommended not to use this form for data entry until this is resolved.');
	}

	$(document).on('click', 'button#validate-form:not(.disabled)', function(){
		var jData, jDataStr, errorStr;
		if (typeof form !== 'undefined'){
			form.validateForm();
			if (!form.isValid()){
				gui.alert('Form contains errors <br/>(please see fields marked in red)');
				return;
			}
			else{
				jData = jDataO.get();
				jDataStr = vkbeautify.json(JSON.stringify(jData));
				errorStr = (typeof jData.errors !== 'undefined' && jData.errors.length > 0) ? '<ul class="alert alert-error"><li>'+jData.errors.join('</li><li>')+'</li></ul>' : '';
				console.log(jDataStr);
				gui.alert(
					errorStr+
					'<p>The following JSON object has been prepared for submission:</p><br/>'+
					'<pre style="font-size: 0.6em; width: 100%;">'+jDataStr+'</pre>',
					'Record is ready to Submit!',
					'info'
				);
				$('#dialog-alert').css({'width' : '80%', 'margin-left': '-40%'});//temporary to show JSON
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