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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global Connection, FileManager, Cache, Profiler, profilerRecords, gui, jrDataStr, settings, Form, store:true, StorageLocal:true, Settings,prepareFormDataArray*/

/* Global Variables and Constants -  CONSTANTS SHOULD BE MOVED TO CONFIG FILE AND ADDED DYNAMICALLY*/
var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var /**@type {Cache}*/cache;
var /**@type {FileManager}*/fileManager;

//tight coupling with Form and Storage class, but loose coupling with GUI
$(document).ready(function() {
	'use strict';
	var message, choices, loadErrors, trySubmission;

	form = new Form('form.jr:eq(0)', jrDataStr);
	fileManager = new FileManager();
	connection = new Connection();

	if (!store.isSupported()){
		window.location = settings['modernBrowsersURL'];
	}
	else{
		$(document).trigger('browsersupport', 'local-storage');
	}

	gui.updateStatus.offlineLaunch(false);

	if ($('html').attr('manifest')){
		cache = new Cache();
		if (cache.isSupported()){
			cache.init();
			$(document).trigger('browsersupport', 'offline-launch');
		}
		// if applicationCache is not supported
		else{
			message = 'Offline application launch is not supported by your browser. '+
					'You can use the form without this feature or see options for resolving this';
			choices = {
				posButton : 'Show options',
				negButton : 'Use it',
				posAction : function(){ window.location = settings['modernBrowsersURL'];}
			};
			gui.confirm({msg: message, heading:'Application cannot launch offline'}, choices);
		}
	}

	loadErrors = form.init();
	if (loadErrors.length > 0){
		gui.showLoadErrors(loadErrors, 'It is recommended not to use this form for data entry until this is resolved.');
	}

	connection.init();
	gui.setup();

	//trigger fake save event to update formlist on data page
	$('form.jr').trigger('save', JSON.stringify(store.getRecordList()));

	window.setInterval(function(){
		trySubmission();
	}, 30*1000);

	trySubmission = function(){
		//TODO: add second parameter to getSurveyDataArr() to
		//getCurrentRecordName() to prevent currenty open record from being submitted
		//connection.uploadRecords(store.getSurveyDataArr(true));
		var i,
			records = store.getSurveyDataArr(true);
		for ( i = 0 ; i< records.length ; i++){
			prepareFormDataArray(
				records[i],
				{
					success: function(recordPrepped){
						connection.uploadRecords(recordPrepped);
					},
					error: function(){
						console.error('Something went wrong while trying to prepare the record(s) for uploading.');
					}
				}
			);
		}
	};

	profilerRecords.push(xpathEvalNum+' XPath Evaluations during initialization took '+xpathEvalTime+' milliseconds of which '+xpathEvalTimePure+' for pure XPath evaluation.');

});
