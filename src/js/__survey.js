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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global BlobBuilder, vkbeautify, saveAs, gui, jrDataStr, report, Form, store:true, StorageLocal:true, Settings, Modernizr*/

/* Global Variables and Constants -  CONSTANTS SHOULD BE MOVED TO CONFIG FILE AND ADDED DYNAMICALLY*/
var /**@type {Form}*/form;
var /**@type {Connection}*/connection;
var /**@type {Cache}*/cache;
var /**@type {Settings}*/settings,
	currentOnlineStatus = false;
var /**@type {StorageLocal}*/ store;
var MODERN_BROWSERS_URL = 'modern_browsers';
var CACHE_CHECK_INTERVAL = 360*1000; //CHANGE TO 3600*1000
DEFAULT_SETTINGS = {'autoUpload':true, 'buttonLocation': 'bottom', 'autoNotifyBackup':false };

//tight coupling with Form and Storage class, but loose coupling with GUI
// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function() {
	'use strict';
	var bookmark, message, choices, shown, time;

	store = new StorageLocal();
	form = new Form('form.jr:eq(0)', jrDataStr);
	settings = new Settings();
	settings.init();
	connection = new Connection();
	
	// check if localStorage is supported and if not re-direct to browser download page
	if (!store.isSupported()){
	//if(Modernizr.localStorage){
		//console.log('redirect attempt because of lack of localStorage support'); // DEBUG
		window.location = MODERN_BROWSERS_URL;
	}
	else{
		$(document).trigger('browsersupport', 'local-storage');
	}

	//instantiate Cache object even if no manifest attribute is provided to have access to cache.activate()
	cache = new Cache();
	gui.updateStatus.offlineLaunch(false);
	
	if ($('html').attr('manifest')){
		if (cache.isSupported()){
			//reminder to bookmark page will be shown 3 times
			bookmark = store.getRecord('__bookmark');
			shown = (bookmark) ? bookmark['shown'] : 0;
			if(shown < 3){
				setTimeout(function(){
					time = (shown === 1) ? 'time' : 'times';
					gui.showFeedback('Please bookmark this page for easy offline launch. '+
						'This reminder will be shown '+(2-shown)+' more '+time+'.', 20);
					shown++;
					store.setRecord('__bookmark', {'shown': shown});
				}, 5*1000);
			}
			cache.init();
			$(document).trigger('browsersupport', 'offline-launch');
		}
		// if applicationCache is not supported
		else{
			message = 'Offline application launch not supported by your browser. '+
					'You can use the form without this feature or see options for resolving this';
			choices = {
				posButton : 'Show options',
				negButton : 'Use it',
				posAction : function(){ window.location = MODERN_BROWSERS_URL; }
			};
			gui.confirm({msg: message, heading:'Application cannot launch offline'}, choices);
		}
	}
	form.init();
	connection.init();
	gui.setup();

	//trigger fake save event to update formlist on data page
	$('form.jr').trigger('save', JSON.stringify(store.getFormList()));
});

/**
 * Controller function to load a form from local storage. Checks whether there is any unsaved data in the current form first.
 * @param  {string} formName  The name of the form to load (key of local db).
 * @param  {boolean=} confirmed Whether unsaved data can be discarded and lost forever.
 */
function loadForm(formName, confirmed){
	'use strict';
	var message, choices, record;
	//console.log('loadForm called'); // DEBUG
	if (!confirmed && form.getEditStatus()){
		message = 'Would you like to proceed without saving changes to the form you were working on?';
		choices = {
			posAction: function(){ loadForm(formName, true); }
		};
		gui.confirm(message, choices);
	}
	else {
		// request a form data object
		record = store.getRecord(formName);
		//enters that data in the form on the screen
		// *OLD*checkForOpenForm(true);
		if (record.data !== null){
			//var success = form.setData(data);
			form.reset();
			//gui.closePage();
			form = new Form('form.jr:eq(0)', record.data);
			form.init();
			//form.setRecordStatus(record.ready);
			//Avoid uploading of currently open form by setting edit status in STORE to false. To be re-considered if this is best approach.
			//store.setRecordStatus(formName, false);
			form.setRecordName(formName);
			//console.log('displaying loaded form data succes?: '+success); // DEBUG
			$('#page-close').click();
			$('button#delete-form').button('enable');
			//if(!success){
				//gui.alert('Error loading form. Saved data may be corrupted');
			//}
			//else
			gui.showFeedback('"'+formName +'" has been loaded', 2);
		}
		else{
			gui.alert('Record contained no data');
			// ADD something went wrong with loading data from storage
		}
	}
}
/**
 * [saveForm description]
 * @param  {string=} confirmedRecordName  [description]
 * @param  {string|boolean=} confirmedFinalStatus [description]
 * @param  {boolean=} deleteOldName        [description]
 * @param  {boolean=} overwriteExisting    [description]                   [description]
 */
function saveForm(confirmedRecordName, confirmedFinalStatus, deleteOldName, overwriteExisting){
	'use strict';
	var result, message, choices,
		curRecordName = form.getRecordName(),
		curRecordFinal = form.getRecordStatus(),
		rec = {};
		//record = { 'data': form.getDataStr(true, true), 'ready': confirmedFinalStatus};
	//record['ready'] = confirmedFinalStatus;
	console.debug('new name: '+confirmedRecordName+', before: '+curRecordName+', delOld: '+deleteOldName+', overwr: '+overwriteExisting);
	if (form.getDataStr(true, true) === null || form.getDataStr(true, true) === ''){
		return gui.showFeedback('Nothing to save.'); //ADD error with getting data from form?
	}

	if (typeof confirmedRecordName == 'undefined' || confirmedRecordName.length === 0){
		curRecordName = curRecordName || store.getCounterValue();
		$('#dialog-save input[name="record-name"]').val(curRecordName);
		$('#dialog-save input[name="record-final"]').attr('checked', curRecordFinal);
		return gui.saveConfirm();
		//console.debug('new Record Props: '+JSON.stringify(newRecord));
		//return saveForm(newRecord.name, newRecord.markedFinal);
	}

	if (curRecordName && curRecordName !== confirmedRecordName && typeof deleteOldName == 'undefined'){
		message = 'Record name has changed. Would you like to delete the record saved under the old name:'+curRecordName+'?';
		choices = {
			posButton : 'Yes, delete',
			negButton : 'No, keep',
			posAction : function(){ saveForm(confirmedRecordName, confirmedFinalStatus, true); },
			negAction : function(){ saveForm(confirmedRecordName, confirmedFinalStatus, false); }
		};
		return gui.confirm({msg: message, heading: 'Delete old Record?'}, choices);
	}

	//trigger beforesave event which is used e.g. to update timestamp preload item.
	$('form.jr').trigger('beforesave');
	rec = { 'data': form.getDataStr(true, true), 'ready': confirmedFinalStatus};
	// HOW THE HELL DOES REC GET A LASTSAVED PROPERTY HERE??? SOMETHING VERY WRONG
	console.debug('sending following record to store.setRecord():');
	console.debug(rec);
	//alert('hey');
	result = store.setRecord(confirmedRecordName, rec, deleteOldName, overwriteExisting, curRecordName);

	console.log('result of save: '+result); // DEBUG
	if (result === 'success'){
		gui.showFeedback('Form with name "'+confirmedRecordName+'" has been saved.', 2);
		
		//set the new custom html5 data attribute stored-with-key
		form.setRecordName(confirmedRecordName);
		form.setRecordStatus(confirmedFinalStatus);
		form.setEditStatus(false);
		$('button#delete-form').button('enable');
		//update records in GUI
		$('form.jr').trigger('save', JSON.stringify(store.getFormList()));
	}
	//else if (result === 'require'){
	//	gui.alert (form.KEY_LABEL+' is required. Please provide this.');
	//}
	else if (result === 'existing'){
		message = 'Record with name '+confirmedRecordName+' already exists. Would you like to overwrite existing record? ';
		choices = {
			posButton : 'Yes, overwrite',
			posAction : function(){ saveForm(confirmedRecordName, confirmedFinalStatus, deleteOldName, true); },
			negAction : function(){ gui.showFeedback("Form was not saved.");}
		};
		gui.confirm(message, choices);
	}
	else if (result === 'forbidden'){
		gui.alert ('This name is not allowed. Please change it');
		gui.showFeedback ('Form was NOT saved.');
	}
	else {
		gui.showFeedback('Error occurred. Form was NOT saved.');
	}
}

/**
 * Controller function to reset to a blank form. Checks whether all changes have been saved first
 * @param  {boolean=} confirmed Whether unsaved changes can be discarded and lost forever
 */
function resetForm(confirmed){
	'use strict';
	var message, choices;
	//valueFirst = /**@type {string} */$('#saved-forms option:first').val();
	//console.debug('first form is '+valueFirst);
	//gui.pages().get('records').find('#records-saved').val(valueFirst);
	console.debug('editstatus: '+ form.getEditStatus());
	if (!confirmed && form.getEditStatus()){
		message = 'There are unsaved changes, would you like to continue <strong>without</strong> saving those?';
		choices = {
			posAction : function(){ resetForm(true); }
		};
		gui.confirm(message, choices);
	}
	else {
		form.reset();
		form = new Form('form.jr:eq(0)', jrDataStr);
		form.init();
		$('button#delete-form').button('disable');
	}
}

/**
 * Controller function to delete a record of form data.
 * @param  {boolean=} confirmed whether the user has confirmed that he/she wants to delete the data
 */
function deleteForm(confirmed) {
	'use strict';
	var message, choices, key = form.getRecordName();

	if (key !== '' && key !== null){
		if (confirmed){
			var success = store.removeRecord(key);
			if (success){
				resetForm(true);
				gui.showFeedback('Successfully deleted form.');
				$('form.jr').trigger('delete', JSON.stringify(store.getFormList()));
			}
			else {
				gui.showFeedback('An error occurred when trying to delete this form.');
			}
		}
		else {
			message = 'Please confirm that you would like to remove this form from storage.';
			choices = {
				posButton : 'Delete',
				posAction : function(){ deleteForm(true); }
			};
			gui.confirm(message, choices);
		}
	}
	else {
		gui.showFeedback ('Please first load the form you would like to delete or choose reset if you\'d like to reset the current form.');
	}
	return;
}


/**
 * Currently, this is a simplified version of 'saveForm' for situations where localStorage is only used as a backup, without saved data loading
 * functionality. It only allows validated forms to be submitted. 'Submitted' in this case actually still means it is saved to localStorage first
 * and then forced to upload. If uploading fails the user can continue working on a blank form. Uploading will be attempted at intervals until it
 * succeeds.
 *
 */
function submitForm() {
	var record, saveResult;
	if (!form.isValid()){
		gui.alert('Form contains errors <br/>(please see fields marked in red)');
		return;
	}
	record = { 'data': form.getDataStr(true, true), 'ready': true};
	saveResult = store.setRecord(form.getName()+' - '+store.getCounterValue(), record, false, false);
	
	console.log('result of save: '+saveResult); // DEBUG
	if (saveResult === 'success'){
		//attempt uploading the data (all data in localStorage)
		connection.upload(true);
		resetForm(true);
		$('form.jr').trigger('save', JSON.stringify(store.getFormList()));
		//gui.showFeedback('Form with name "'+confirmedRecordName+'" has been saved.', 2);
	}
	else{
		gui.alert('Error trying to save data locally before submit');
	}
}

/**
 * function to export or backup data. It depends on the browser whether this data is shown in a new browser window/tab
 * or is downloaded automatically. It is not possible to provide a file name.
 * @deprecated
 * @param  {boolean=} finalOnly [description]
 */
function exportData(finalOnly){
	"use strict";
	var i,dataArr, dataStr, uriContent, newWindow;
	finalOnly = finalOnly || true;

	//dataArr = store.getSurveyDataXMLStr(finalOnly);//store.getSurveyData(finalOnly).join('');
	dataArr = store.getSurveyDataOnlyArr(finalOnly);//store.getSurveyDataXMLStr(finalOnly));
	
	//console.debug(data);
	if (dataArr.length === 0){
		gui.showFeedback('No data to export.');
	}
	else{
		for (i = 0 ; i<dataArr.length ; i++){
			dataArr[i] = form.prepareForSubmission(dataArr[i]);
		}
		dataStr = vkbeautify.xml('<exported>'+dataArr.join('')+'</exported>');
		uriContent = "data:application/octet-stream," + encodeURIComponent(dataStr); /*data:application/octet-stream*/
		newWindow = window.open(uriContent, 'exportedData');
	//window.location.href = uriContent;
	}
}

/**
 * function to export or backup data to a file.
 *
 *	@param {string=}  fileName
 *  @param {boolean=} finalOnly [description]
 */
function exportToFile(fileName, finalOnly){
	"use strict";
	var i, dataArr, dataStr, bb, blob;
		//filename="test.xml";//, uriContent, newWindow;
	finalOnly = finalOnly || true;
	fileName = fileName || form.getName()+'_data_backup.xml';
	
	dataArr = store.getSurveyDataOnlyArr(finalOnly);//store.getSurveyDataXMLStr(finalOnly));
	//console.debug(data);
	if (!dataArr || dataArr.length === 0){
		gui.showFeedback('No data marked "final" to export.');
	}
	else{
		for (i = 0 ; i<dataArr.length ; i++){
			dataArr[i] = form.prepareForSubmission(dataArr[i]);
		}
		dataStr = vkbeautify.xml('<exported>'+dataArr.join('')+'</exported>');
		bb = new BlobBuilder();
		bb.append(dataStr);
		blob = bb.getBlob("application/octet-stream; charset=utf-8");
		saveAs(blob, fileName);
	}
}

/**
 * @constructor
 * Function (CLass): Cache
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
function Cache(){
	'use strict';
	//var cacheType, appCache, update, error;
	//var loadedVersion; //only used for Gears cache
}
		
Cache.prototype.init = function(){
	var that = this;
	//first check for the preferred cache
	if (!this.isSupported){
		return false;
	}
	if (applicationCache.status > 0 && applicationCache.status < 5){
		gui.updateStatus.offlineLaunch(true);
	}
	if (applicationCache.status === applicationCache.UPDATEREADY){
		this.onUpdateReady();
	}
	if (applicationCache.status === applicationCache.OBSOLETE){
		this.onObsolete();
	}

	//manifest is no longer served (form removed or offline-launch disabled). DOES THIS FIRE IN ALL BROWSERS?
	applicationCache.addEventListener('obsolete', this.onObsolete, false);

	//the very first time an application cache is saved
	applicationCache.addEventListener('cached', this.onCached, false);

	//when an updated cache is downloaded and ready to be used
	applicationCache.addEventListener('updateready', this.onUpdateReady, false);
	
	//when an error occurs (not necessarily serious)
	applicationCache.addEventListener('error', this.onErrors, false);

	setInterval(function(){
		that.update();
		//applicationCache.update();
	}, CACHE_CHECK_INTERVAL);

	//if status is UNCACHED OR IDLE, force an update check
	if (applicationCache.status === applicationCache.UNCACHED || applicationCache.status === applicationCache.IDLE){
		//applicationCache.update();
		this.update();
	}
};

Cache.prototype.update = function(){
	applicationCache.update();
};

Cache.prototype.onObsolete = function(){
	gui.showFeedback('Application/form is no longer able to launch offline.');
	gui.updateStatus.offlineLaunch(false);
};

Cache.prototype.onCached = function(){
	gui.showFeedback('Congratulations! This form can now be loaded when you are offline.');
	gui.updateStatus.offlineLaunch(true);
};

Cache.prototype.onUpdateReady = function(){
	applicationCache.swapCache();
	gui.showFeedback("A new version of this application or form has been downloaded. "+
		"Refresh this page to load the updated version.", 20);
};

Cache.prototype.onErrors = function(error){
	console.error('HTML5 cache error event'); // DEBUG
	//if (connection.getOnlineStatus()) {//error event always triggered when offline
	console.debug(error);
	gui.showFeedback('There is a new version of this application or form available but an error occurs when'+
			' trying to download it. Please send a bug report.');
		//gui.updateStatus.offlineLaunch(false);
		//gui.alert('Application error (manifest error). Try to submit or export any locally saved data. Please report to formhub mentioning the url.');
		// Possible to trigger cache problem for testing? ->
		// 1. going offline, 2.manifest with unavailable resource, 3. manifest syntax error
	//}
};

//Cache.prototype.activate = function(){
//	if (applicationCache.status > 0){
//		gui.showFeedback('Offline launch is already activated. If it is not working please contact formhub.');
//	}
//	else{
//		gui.confirm('By confirming offline launch functionality will be switched on. The application will automatically refresh.');
//	}
//};//

//Cache.prototype.deActivate = function(){
//	if (applicationCache.status === 0){
//		gui.showFeedback('Offline launch is not active.');
//	}
//	else{
//		gui.confirm('By confirming offline launch functionality will be switched off.');
//	}
//};
	
Cache.prototype.isSupported = function(){
	return (window.applicationCache) ? true : false;
};
	
//Cache.prototype.checkForUpdate = function(){
//	console.log('checking for cache update');
//	try{
//		applicationCache.update();}
//	//Opera throws mysterious INVALID_STATE_ERR
//	catch(e){
//		if (e.name === 'NS_ERROR_DOM_SECURITY_ERR'){ //FF before approving offline use
//			error = 'security';
//		}
//		console.log('error thrown during cache update. error name: '+e.name+'  message: '+e.message);
//	}
//	return;
//};


//Class dealing with communication to the server ADD HTML5 VALIDATION and FILE/URL UPLOAD from launch.js
/**
 * @constructor
 *
 * Function: Connection
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
function Connection(){
	"use strict";
	//var onlineStatus;
	//var tableFields, primaryKey;
	//var tableName, version;
	var that=this;
	this.uploadOngoing = false;
	
	this.init = function(){
		//console.log('initializing Connection object');
		//checkOnlineStatus();
		that = this;
		window.setInterval(function(){
			//console.log('setting status'); //DEBUG
			//setStatus();
			that.upload();
		}, 15*1000);
		//window.addEventListener("offline", function(e){
		//	console.log('offline event detected');
		//	setStatus();
		//}
		//window.addEventListener("online", function(e){
		//	console.log('online event detected');
		//	setStatus();
		//}
		$(window).on('offline online', function(){
			console.log('window network event detected');
			that.setOnlineStatus(that.getOnlineStatus());
		});
		//since network change events are not properly fired, at least not in Firefox 13 (OS X), this is an temporary fix
		//that can be removed eventually or set to to 60x1000 (1 min)
		/*window.setInterval(function(){
			$(window).trigger('online');
		}, 10*1000);*/
		$(window).trigger('online');
		//setTableVars();
	};
}
	
/**
 * provides the connection status, should be considered: 'seems online' or 'seems offline'
 * NEEDS IMPROVEMENT. navigator.onLine alone is probably not appropriate because for some browsers this will
 * return true when connected to a local network that is not connected to the Internet.
 * However, this could be the first step. If (true) a request is sent to the server to check for a connection
 *
 * @return {boolean} true if it seems the browser is online, false if it does not
 */
Connection.prototype.getOnlineStatus = function(){
	console.log('checking connection status');//, status before check is: '+onlineStatus); // DEBUG
	//if (typeof online !== 'undefined' && ( online === true || online === false ) ){
		//setStatus(online);
	//}
	//forced status
	//else {
	return navigator.onLine;
		//navigator.onLine not working properly in Firefox
		//if (navigator.onLine){
			//NOTE that GET is not working (by default) in a CodeIgniter setup!!
//				$.ajax({
//					type:'POST',
//					url: CONNECTION_URL,
//					cache: false,
//					dataType: 'text',
//					timeout: 3000,
//					success: function(){
//						setStatus(true);
//						},
//					error: function(){
//						setStatus(false);
//						}
//				});
		//}
		//else {
			//setStatus(false);
		//}
//	}
};
	
Connection.prototype.setOnlineStatus = function(newStatus){
	//var oldStatus = onlineStatus;
	//onlineStatus = online;
	if (newStatus !== this.currentOnlineStatus){
		console.log('status changed to: '+newStatus+', triggering window.onlinestatuschange');
		$(window).trigger('onlinestatuschange', newStatus);
	}
	this.currentOnlineStatus = newStatus;
};

//REMOVE THIS AS IT MAKES NO SENSE WHATSOEVER TO LET USERS CHANGE A CENTRAL FORM SETTING!
Connection.prototype.switchCache = function(active){
	if (typeof active !== 'boolean'){
		console.error('switchCache called without parameter');
		return;
	}
	$.ajax('webform/switch_cache', {
		type: 'POST',
		data: {cache: active}
	});
};

/**
 * PROTECTION AGAINST CALLING FUNCTION TWICE to be tested, attempts to upload all finalized forms *** ADD with the oldest timeStamp first? ** to the server
 * @param  {boolean=} force       [description]
 * @param  {string=} excludeName [description]
 */
Connection.prototype.upload = function(force, excludeName) {
	var i, name, result,
		autoUpload = (settings.getOne('autoUpload') === 'true' || settings.getOne('autoUpload') === true) ? true : false;
	//console.debug('upload called with uploadOngoing variable: '+uploadOngoing+' and autoUpload: '+autoUpload); // DEBUG
	
	// proceed if autoUpload is true or it is overridden, and if there is currently no ongoing upload
	if ( this.uploadOngoing === false  && ( autoUpload === true || force ) ){
		//var dataArr=[];//, insertedStr='';
		
		this.uploadResult = {win:[], fail:[]};
		this.uploadQueue = store.getSurveyDataArr(true, excludeName);
		this.forced = force;
		console.debug('upload queue: '+this.uploadQueue);

		if (this.uploadQueue.length === 0 ){
			return (force) ? gui.showFeedback('Nothing marked "final" to upload (or record is currently open).') : false;
		}

		this.uploadOne();
	}
	else{
		//allow override of this.forced if called with force=true
		this.forced = (force === true) ? true : this.forced;
	}
};

Connection.prototype.uploadOne = function(){//dataXMLStr, name, last){
	var record, content, last,
		that = this;
	if (this.uploadQueue.length > 0){
		this.uploadOngoing = true;
		record = this.uploadQueue.pop();
		content = new FormData();
		content.append('xml_submission_data', form.prepareForSubmission(record.data));//dataXMLStr);
		content.append('Date', new Date().toUTCString());
		last = (this.uploadQueue.length === 0) ? true : false;
		this.setOnlineStatus('waiting');
		//$('.drawer.left #status').text('Waiting...');
		//console.log('data to be send: '+JSON.stringify(dataObj)); // DEBUG
		$.ajax('data/submission',{
			type: 'POST',
			data: content,
			cache: false,
			//async: false, //THIS NEEDS TO BE CHANGED, BUT AJAX SUBMISSIONS NEED TO TAke place sequentially
			contentType: false,
			processData: false,
			//TIMEOUT TO BE TESTED WITH LARGE SIZE PAYLOADS AND SLOW CONNECTIONS...
			timeout: 8*1000,
			complete: function(jqXHR, response){
				that.processOpenRosaResponse(jqXHR.status, record.name, last);
				/**
				  * ODK Aggregrate gets very confused if two POSTs are sent in quick succession,
				  * as it duplicates 1 entry and omits the other but returns 201 for both...
				  * so we wait until previous POST is finished.
				  */
				that.uploadOne();
			}
		});
	}
};

Connection.prototype.processOpenRosaResponse = function(status, name, last){
	var i, waswere, namesStr,
		msg = '',
		names=[],
		statusMap = {
		0: {success: false, msg: "Uploading of data failed (probably offline)"},
		200: {success:false, msg: "Data server did not accept data. Contact Enketo helpdesk please."},
		201: {success:true, msg: ""},
		202: {success:true, msg: name+" may have had errors. Contact survey administrator please."},
		'2xx': {success:false, msg: "Unknown error occurred when submitting data. Contact Enketo helpdesk please"},
		400: {success:false, msg: "Data server did not accept data. Contact survey administrator please."},
		403: {success:false, msg: "You are not allowed to post data to this data server. Contact survey administrator please."},
		404: {success:false, msg: "Submission area on data server not found or not properly configured."},
		'4xx': {success:false, msg: "Unknown submission problem on data server."},
		413: {success:false, msg: "Data is too large. Please export the data and contact the Enketo helpdesk please."},
		500: {success:false, msg: "Sorry, the Enketo server is down or being maintained. Please try again later or contact Enketo helpdesk please."},
		503: {success:false, msg: "Sorry, the Enketo server is down or being maintained. Please try again later or contact Enketo helpdesk please."},
		'5xx':{success:false, msg: "Sorry, the Enketo server is down or being maintained. Please try again later or contact Enketo helpdesk please."}
	};
	//console.debug('name: '+name);
	//console.debug(status);
	
	if (typeof statusMap[status] !== 'undefined'){
		if ( statusMap[status].success === true){
			store.removeRecord(name);
			$('form.jr').trigger('delete', JSON.stringify(store.getFormList()));
			console.log('tried to remove record with key: '+name);
			this.uploadResult.win.push([name, statusMap[status].msg]);
		}
		else if (statusMap[status].success === false){
			this.uploadResult.fail.push([name, statusMap[status].msg]);
		}
	}
	//unforeseen statuscodes
	else if (status > 500){
		console.error ('Error during uploading, received unexpected statuscode: '+status);
		this.uploadResult.fail.push([name, statusMap['5xx'].msg]);
	}
	else if (status > 400){
		console.error ('Error during uploading, received unexpected statuscode: '+status);
		this.uploadResult.fail.push([name, statusMap['4xx'].msg]);
	}
	else if (status > 200){
		console.error ('Error during uploading, received unexpected statuscode: '+status);
		this.uploadResult.fail.push([name, statusMap['2xx'].msg]);
	}
	
	if (last !== true){
		return;
	}

	console.debug('going to provide upload feedback (forced = '+this.forced+') from object:');
	console.debug(this.uploadResult);

	if (this.uploadResult.win.length > 0){
		for (i = 0 ; i<this.uploadResult.win.length ; i++){
			names.push(this.uploadResult.win[i][0]);
			msg = (typeof this.uploadResult.win[i][2] !== 'undefined') ? msg + (this.uploadResult.win[i][1])+' ' : '';
		}
		waswere = (i>1) ? ' were' : ' was';
		namesStr = names.join(', ');
		gui.showFeedback(namesStr.substring(0, namesStr.length) + waswere +' successfully uploaded. '+msg);
		this.setOnlineStatus(true);
		//$('.drawer.left #status').text('');
		//gui.updateStatus.connection(true);
	}
	//else{
	if (this.uploadResult.fail.length > 0){
		console.debug('upload failed');
		
		//this is actually not correct as there could be many reasons for uploads to fail, but let's use it for now.
		this.setOnlineStatus(false);
		$('.drawer.left #status').text('Offline.');

		if (this.forced === true){
			for (i = 0 ; i<this.uploadResult.fail.length ; i++){
				msg += this.uploadResult.fail[i][0] + ': ' + this.uploadResult.fail[i][1] + '<br />';
			}
			console.debug('going to give upload feedback to user');
			if ($('.drawer.left').length > 0){
				//gui.updateStatus.connection(false);
				//show drawer if currently hidden
				$('.drawer.left.hide .handle').click();
			}
			else {
				gui.alert(msg, 'Failed data submission');
			}
		}
		else{
			// not sure if there should be a notification if forms fail automatic submission
		}
	}
	this.uploadOngoing = false;
	//re-enable upload button
};


//avoid Google Closure Compiler renaming:
//Settings.prototype['autoUpload'] = Settings.prototype.autoUpload;
//Settings.prototype['buttonLocation'] = Settings.prototype.buttonLocation;

Settings.prototype['autoUpload'] = function(val){

};

Settings.prototype['buttonLocation'] = function(val){
	"use strict";
	//if ($(this).checked === true) {
	//console.log('found radio input with required value'); // DEBUG
	$('#form-controls').removeClass('bottom right mobile').addClass(val);
	//if (el[i].value==='mobile'){
	//	$('body').addClass('no-scroll');
	//}
	//else {
	//	$('body').removeClass('no-scroll');
	//}
	$(window).trigger('resize');
};

//Extend GUI
//setCustomEventHandlers is called automatically by GUI.init();
GUI.prototype.setCustomEventHandlers = function(){
	"use strict";
	var settingsForm, that = this;
	
	// survey-form controls
	$('button#save-form').button({'icons': {'primary':"ui-icon-disk"}})
		.click(function(){
			form.validateForm();
			saveForm();
		});
	$('button#reset-form').button({'icons': {'primary':"ui-icon-refresh"}})
		.click(function(){
			resetForm();
		});
	$('button#delete-form').button({'icons': {'primary':"ui-icon-trash"}, disabled:true})
		.click(function(){
			deleteForm(false);
		});
	$('button#submit-form')//.detach().appendTo($('form.jr'))
		.button({'icons': {'primary':"ui-icon-check"}})
			.click(function(){
				form.validateForm();
				submitForm();
				return false;
		});
//	$('a#queue').click(function(){
//		exportToFile();
//		return false;
//	});
//
	$('#drawer-export').click(function(){
		exportToFile();
		return false;
	});
	$('.drawer.left .handle.right').click(function(){
		var $drawer = $(this).parent('.drawer');
		console.debug('clicked handle');
		$drawer.toggleClass('hide');
	});

	$('#form-controls button').equalWidth();

	$(document)
		.on('click', '#records-saved li:not(.no-click)', function(event){ // future items matching selection will also get eventHandler
			event.preventDefault();
			var name = /** @type {string} */$(this).find('.name').text();
			loadForm(name);
			$(this).siblings().removeClass('ui-state-active');
			$(this).addClass('ui-state-active');
		})
		.on('mouseenter', '#records-saved li:not(.no-click)', function(){
			$(this).addClass('ui-state-hover');
			//$(this).mousedown(function(){
//				$(this).addClass('ui-state-active');
//			}).mouseup(function(){
//				$(this).removeClass('ui-state-active');
//			});
		})
		.on('mouseleave', '#records-saved li:not(.no-click)', function(){
			$(this).removeClass('ui-state-hover');
		});
	
	this.pages().get('records').find('button#records-force-upload').button({'icons': {'primary':"ui-icon-arrowthick-1-n"}})
		.click(function(){
			//gui.alert('Sorry, this button is not working yet.');
			connection.upload(true, form.getRecordName());
		})
		.hover(function(){
			$('#records-force-upload-info').show();
		}, function(){
			$('#records-force-upload-info').hide();
		});

	//export/backup locally stored data
	this.pages().get('records').find('button#records-export').button({'icons': {'primary':"ui-icon-suitcase"}})
		.click(function(){
			//false means also non-final records are exported. Add selectmenu with both options.
			//gui.alert('hey');
			exportData(false);

		})
		.hover(function(){
			$('#records-export-info').show();
		}, function(){
			$('#records-export-info').hide();
		});

	$(document).on('save delete', 'form.jr', function(e, formList){
		console.debug('save or delete event detected with new formlist: '+formList);
		that.updateRecordList(JSON.parse(formList));
	});

	$(document).on('setsettings', function(e, settings){
		//console.debug('settingschange detected, GUI will be updated with settings:');
		//console.debug(settings);
		that.setSettings(settings);
	});

	// handlers for application settings [settings page]
	this.pages().get('settings').on('change', 'input', function(){
		var name =  /** @type {string} */  $(this).attr('name');
		var value = ($(this).is(':checked')) ?  /** @type {string} */ $(this).val().toString() : '';
		console.debug('settings change by user detected');
		
		settings.set(name, value);
		//actions resulting from settings change
		//if (that.hasOwnProperty(name)){
		//	that[name](value);
		//}
//		switch(name){
//			case 'settings-auto-upload':
//				break;
//			case 'settings-button-location':
//				//var value = $(this).val();
//				//$('#form-controls').removeClass().addClass(el.val());
//				//console.log('found '+el.length+' radio elements with this name');
//				//for (var i = 0; i < el.length; i++) {
//
//			break;
//		}
	});

	$('#dialog-save').hide();

};

//update the survey forms names list
GUI.prototype.updateRecordList = function(recordList, $page) {
	"use strict";
	var name, date, clss, i, icon, $list, $li,
		finishedFormsQty = 0,
		draftFormsQty = 0;
	console.debug('updating recordlist in GUI');
	if(!$page){
		$page = this.pages().get('records');//this.$pages.find('article[id="records"]');
	}
	
	//var selectElement = pageEl.find('#forms-saved-names');
	$list = $page.find('#records-saved ol');
	
	//remove the existing option elements
	//selectElement.children().remove();
	$list.children().remove();
	//$('<option value="select form">Select Form</option>').appendTo(selectElement);
	
	// get form list object (keys + upload) ordered by time last saved
	recordList = recordList || [];//store.getFormList();
//		if (!formList){
//			_this.alert('error loading list of saved forms');
//			return;
//		}
	if (recordList.length > 0){
		for (i=0; i<recordList.length; i++){
			name = recordList[i].key;
			date = new Date(recordList[i]['lastSaved']).toDateString();
			if (recordList[i]['ready']){// === true){//} || recordList[i]['ready'] == 'true'){
				icon = 'check';
				finishedFormsQty++;
			}
			else {
				icon = 'pencil';
				draftFormsQty++;
			}
			//$('<option value="'+name+'">'+name+'</option>').addClass(clss).appendTo(selectElement);
			//$('<li><span class="ui-icon ui-icon-'+icon+'"></span><span class="name">'+name+
			//	'</span><span class="date"> ('+date+')</span></li>')
			//	.appendTo(listElement);
			$li = $('<li><span class="ui-icon ui-icon-'+icon+'"></span><span class="name">'+
				'</span><span class="date"> ('+date+')</span></li>');
			$li.find('.name').text(name); // encodes string to html
			$list.append($li);
		}
		//$('#queue').show().find('#queue-length').text(recordList.length);
		$('#queue-length').text(recordList.length);
	}
	else{
		$('<li class="no-click">no locally saved records found</li>').appendTo($list);
		$('#queue-length').text('0');
	}
// *	OLD*	else if (result.field(2) == 2) {
// *	OLD*		color = 'gray';
	// update status counters
	//pageEl.find('#forms-saved-qty').text(recordList.length);
	$page.find('#records-draft-qty').text(draftFormsQty);
	$page.find('#records-final-qty').text(finishedFormsQty);
};

GUI.prototype.saveConfirm = function(){
	"use strict";
	var $saveConfirm = $('#dialog-save');
	this.confirm(
		{
			dialog: 'save',
			msg:'',
			heading:'Record Details'
		},
		{
			posButton: 'Ok',
			negButton: 'Cancel',
			posAction: function(){
				console.debug('value of final in confirm dialog: '+Boolean($saveConfirm.find('[name="record-final"]:checked').val()));
				//console.debug($saveConfirm.find('[name="record-final"]'));
				return saveForm(
					$saveConfirm.find('[name="record-name"]').val(),
					Boolean($saveConfirm.find('[name="record-final"]:checked').val())
					//$saveConfirm.find('[name="record-final"]:checked').val()
				);
			},
			negAction: function(){
				return false;
			},
			beforeAction: function(){
				if (!form.isValid()){
					console.log('form invalid');
					$saveConfirm.find('[name="record-final"]').attr('disabled', 'disabled');
				}
				else{
					console.log('form valid');
					$saveConfirm.find('[name="record-final"]').removeAttr('disabled');
				}
			}
		}
	);
};

