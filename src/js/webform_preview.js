/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs
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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global getGetVariable, settings, Connection, gui, jrDataStr, jrDataStrToEdit, Form*/

var /**@type {Form}*/form;
var /**@type {Connection}*/connection;

$(document).ready(function() {
	'use strict';
	var serverURL, formId, response,
		$validateButton = $('#validate-form'),
		$loading = $('progress');

	if (!settings.serverURL || !settings.formId){
		showError('No server and/or id provided.');
		return;
	}

	connection = new Connection();
	connection.getTransForm(settings.serverURL, settings.formId, null, {
		success: function(response){
			var loadErrors,
				$response = $(response),
				formStr = new XMLSerializer().serializeToString($response.find('form')[0]),
				modelStr = new XMLSerializer().serializeToString($response.find('model')[0]);

			if (formStr.length > 0 && modelStr.length > 0){
				$validateButton.before(formStr);
				form = new Form('form.jr:eq(0)', modelStr);
				loadErrors = form.init();
				if (loadErrors.length > 0){
					gui.showLoadErrors(loadErrors);
				}
				$validateButton.removeAttr('disabled');
			}
			else{
				showError('An error occurred trying to obtain or transform the form.');
			}
		},
		error: function(jqXHR, status, errorThrown){
			showError('An error occurred trying to obtain or transform the form ('+errorThrown+')');
			$loading.remove();
		},
		complete: function(){
			$loading.remove();
		}
	});

	//connection.init();
	gui.setup();
});

function showError(msg){
	$('#validate-form').prev('.alert').remove();
	$('#validate-form').before('<p class="load-error alert alert-error alert-block">'+msg+'</p>');
}
