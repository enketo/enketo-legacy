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
	currentOnlineStatus = false;//, SURVEY_FORM_ID;
var /**@type {StorageLocal}*/ store;
var MODERN_BROWSERS_URL = 'modern_browsers';

DEFAULT_SETTINGS = {'autoUpload':true, 'buttonLocation': 'bottom', 'autoNotifyBackup':false };
//var GEARS_MANIFEST_URL = 'manifest/gears';

//var MAX_QTY_SAVED_FORMS = 50;
var CACHE_CHECK_INTERVAL = 3600*1000;

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

	//reminder to bookmark page will be shown 3 times
	bookmark = store.getRecord('__bookmark');
	
	//shown=0;
	//if (bookmark){
	//	shown = (bookmark.shown) ? bookmark.shown : 0;
	//}

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
	
	//best to place this after localStorage check, so that IE7 users with Gears
	//will be re-directed immediately before asking whether they allow Gears to store data
	if ($('html').attr('manifest')){
		cache = new Cache();
		cache.init();
		// application cache for launching application offline
		if (cache.isSupported()){
			
			$(document).trigger('browsersupport', 'offline-launch');
			
			//check for updated cache
			checkCache();
			
			// Check for an updated manifest file regularly and refresh cache if necessary.
			window.setInterval(function(){
				checkCache();
			}, CACHE_CHECK_INTERVAL);
			
		}
		else{ // if applicationCache is not supported
			message = 'Offline application launch not supported by your browser. '+
					'You can use it without this feature or see options for resolving this';
			choices = {
				posButton : 'Show options',
				negButton : 'Use it',
				posAction : function(){ window.location = MODERN_BROWSERS_URL; }
			};
			gui.confirm({msg: message, heading:'Application cannot launch offline'}, choices);
		}
		console.log('cache initialized');
	}

	//var formFormat;
	// get form format from json file and build the survey form elements
	//var request;
//	if (window.XMLHttpRequest){
	//request=new XMLHttpRequest();
	//request.open("GET", FORM_FORMAT_URL, false); //not asynchronous!!
	//request.send();
	//if (request.responseText === 'error'){
	//	console.log('This survey does not exist or has not been published yet');
	//}
	//else if (request.responseText && request.responseText!=''){
	//	formFormat = JSON.parse(request.responseText);
	//	//formFormat = request.responseText; //maybe do check to see if responseText is in XML format?
	//	console.log('loaded form format from the json file:'+JSON.stringify(formFormat));
	//}
	//else {
	//	console.log('Error occurred while loading form format');
	//}
	////	var formBuiltSuccessfully;
//	if (formFormat){
//		formBuiltSuccessfully = form.init(formFormat);
//	}
	
	//console.log('form built successfully?: '+formBuiltSuccessfully); // DEBUG
	
//	if(formBuiltSuccessfully){
		
		
		//$('header #survey-info').text(form.COUNTRY+' '+form.SECTOR+' '+form.YEAR+' '+form.SURVEY_NAME);
		
	// initialize the GUI object
	//gui.init();
	
	form.init();
	
	connection.init(); //should be called after form format is loaded
	//initialize file export/backup function
	//initSaveFormsToFile(); // CHECK SAFARI OS X BUG
	
	
	
	// ADD / REPLACE If there is sufficient cross-browser support this could be replaced by simply calling window.navigator.onLine which returns false or true
	//var onlineCheckInterval = window.setInterval(function () {
		//checking online status
		//console.log('checking online status'); // DEBUG
	//	gui.updateConnectionStatus(connection.getStatus());
	//}, 5*1000);
			
	
	
	///var linkAnalysis = $('#link-analysis').attr('href')+'?name='+connection.getTableName();
	//$('#link-analysis').attr('href', linkAnalysis);
	
	

	gui.setup();
//	}
//	else{
//	// ADD ERROR PAGE!
//	console.log('form not built successfully');
//	}

	//trigger fake save event to update formlist on data page
	$('form.jr').trigger('save', JSON.stringify(store.getFormList()));
});

function checkCache(){
	'use strict';
	cache.checkForUpdate();
	window.setTimeout(function(){
		console.log('going to provide cache feedback to user. cache.getError='+cache.getError()); // DEBUG
		if (cache.updateReady()){
			gui.showFeedback('A new version of this application has been downloaded. '+
				'Please save your work and refresh to update.', 20); //REQUIRES DOUBLE REFRESH IN IE8....
		}
		else if (cache.getError()){
			if (cache.getError() === 'security'){
				gui.showFeedback ('Please allow site to store data for offline use and refresh.', 60);
			}
			else {
				gui.alert('An error occurred with the application cache. '+
				'You may have a problem launching offline (error: '+cache.getError()+'). '+
				'Please save your work, refresh and check if offline launch works.');
			}
		}
	}, 30*1000); //it may take a while for the resources to download
}

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
		gui.alert('Form contains errors (please see fields marked in red)');
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
 *
 * @param  {boolean=} finalOnly [description]
 */
function exportData(finalOnly){
	"use strict";
	var data, uriContent, newWindow;
	finalOnly = finalOnly || true;

	data = store.getSurveyDataXMLStr(finalOnly);//store.getSurveyData(finalOnly).join('');
	//console.debug(data);
	if (!data){
		gui.showFeedback('No data marked "final" to export.');
	}
	else{
		uriContent = "data:application/octet-stream," + encodeURIComponent(data); /*data:application/octet-stream*/
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
	var data, bb, blob;
		//filename="test.xml";//, uriContent, newWindow;
	finalOnly = finalOnly || true;
	fileName = fileName || form.getName()+'_data_backup.xml';
	data = vkbeautify.xml(store.getSurveyDataXMLStr(finalOnly));
	//console.debug(data);
	if (!data){
		gui.showFeedback('No data marked "final" to export.');
	}
	else{
		bb = new BlobBuilder();
		bb.append(data);
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
	var cacheType, appCache, update, error;
	var loadedVersion; //only used for Gears cache
		
	this.init = function(){
		//first check for the preferred cache
		if (window.applicationCache){
			cacheType='html5Cache';
			appCache = window.applicationCache;
			//checkForUpdate();
			appCache.addEventListener('updateready', function(){
			// when an updated cache is downloaded and ready to be used
			// swap to the newest version of the cache, will NOT refresh page only newly called resources
			appCache.swapCache();
			update = true;
			}, false);
			appCache.addEventListener('error', function(event){
				console.log ('HTML5 cache error event'); // DEBUG
				if (connection.getOnlineStatus()) {//error event always triggered when offline
					console.log ('noticed online status'); //DEBUG
					error = "error downloading application"; // Possible to trigger cache problem for testing?
				}
			}, false);
		}
//		else if (window.google && google.gears){
//			try{
//				var gearsServer = google.gears.factory.create('beta.localserver');
//				appCache = gearsServer.createManagedStore('rapaide_store');
//				appCache.manifestUrl = GEARS_MANIFEST_URL;
//				if (appCache){
//					cacheType='gearsCache';
//				}
//				loadedVersion = appCache.currentVersion;
//				//checkForUpdate();
//				var timerId = window.setInterval(function() {
//					// When the currentVersion property has a value, all of the resources
//					// listed in the manifest file for that version are captured.
//					if (loadedVersion) {
//						window.clearInterval(timerId);
//						console.log('loaded Gears cache with version:'+loadedVersion);
//						error = null;
//					}
//					else if (appCache.updateStatus == 3) {
//						console.log('Error: ' + appCache.lastErrorMessage); // DEBUG
//						error = appCache.lastErrorMessage;
//						window.clearInterval(timerId); //TEST this by creating incorrect manifest URL
//					}
//				}, 500);
//			}
//			catch(e){
//				console.log ('Gears does not have permission or other Gears initialization error');
//			}
//		}
	};
	
	this.isSupported = function(){
		return (cacheType==='html5Cache' || cacheType==='gearsCache') ? true : false;
	};
	
	this.checkForUpdate = function(){
		console.log('checking for cache update');
		//switch(cacheType){
			//case 'html5Cache':
				try{appCache.update();}
				//Opera throws mysterious INVALID_STATE_ERR
				catch(e){
					if (e.name === 'NS_ERROR_DOM_SECURITY_ERR'){ //FF before approving offline use
						error = 'security';
					}
					console.log('error thrown during cache update. error name: '+e.name+'  message: '+e.message);
				}
				//event listener will update variable 'update';
		//		break;
//			case 'gearsCache' :
//				// Checking for updates will also happen regularly automatically even if not explicitly called
//				appCache.checkForUpdate();
//				break;
//		}
		return;
	};

	this.updateReady = function(){
//		if (cacheType==='gearsCache'){
//			//console.log ('loadedVersion:'+loadedVersion); //DEBUG
//			//console.log ('currentVersion:'+appCache.currentVersion); //DEBUG
//			update = (loadedVersion !== '' && loadedVersion != appCache.currentVersion) ? true : false;
//		}
		console.log('updateReady() returns: '+update); //DEBUG
		return update;
	};

	this.getError = function(){
		return error;
	};

}


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
		}, 10*1000);
		//window.addEventListener("offline", function(e){
		//	console.log('offline event detected');
		//	setStatus();
		//}
		//window.addEventListener("online", function(e){
		//	console.log('online event detected');
		//	setStatus();
		//}
		$(window).on('offline online', function(){
			//console.log('window network event detected');
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

/**
 * PROTECTION AGAINST CALLING FUNCTION TWICE to be tested, attempts to upload all finalized forms *** ADD with the oldest timeStamp first? ** to the server
 * @param  {boolean=} force       [description]
 * @param  {string=} excludeName [description]
 */
Connection.prototype.upload = function(force, excludeName) {
	var i, name, result,
		autoUpload = (settings.getOne('autoUpload') === 'true' || settings.getOne('autoUpload') === true) ? true : false;
	//console.debug('upload called with uploadOngoing variable: '+uploadOngoing+' and autoUpload: '+autoUpload); // DEBUG

	// proceed if autoUpload is true or it is overridden, and if there is currently no queue for submissions
	if ( ( typeof this.uploadQueue == 'undefined' || this.uploadQueue.length === 0 ) && ( autoUpload === true || force ) ){
		//var dataArr=[];//, insertedStr='';
		this.uploadResult = {win:[], fail:[], force: force};
		this.uploadQueue = store.getSurveyDataArr(true, excludeName);

		console.debug('upload queue: '+this.uploadQueue);

		if (this.uploadQueue.length === 0 ){
			return (force) ? gui.showFeedback('Nothing marked "final" to upload (or record is currently open).') : false;
		}
		this.uploadOne();
	}
};

Connection.prototype.uploadOne = function(){//dataXMLStr, name, last){
	var record, content, last,
		that = this;
	if (this.uploadQueue.length > 0){
		record = this.uploadQueue.pop();
		content = new FormData();
		content.append('xml_submission_data', form.prepareForSubmission(record.data));//dataXMLStr);
		content.append('Date', new Date().toUTCString());
		last = (this.uploadQueue.length === 0) ? true : false;

		//console.log('data to be send: '+JSON.stringify(dataObj)); // DEBUG
		$.ajax('data/submission',{
			type: 'POST',
			data: content,
			cache: false,
			//async: false, //THIS NEEDS TO BE CHANGED, BUT AJAX SUBMISSIONS NEED TO TAke place sequentially
			contentType: false,
			processData: false,
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
		console.error ('error during uploading, received unexpected statuscode: '+status);
		this.uploadResult.fail.push([name, statusMap['5xx'].msg]);
	}
	else if (status > 400){
		console.error ('error during uploading, received unexpected statuscode: '+status);
		this.uploadResult.fail.push([name, statusMap['4xx'].msg]);
	}
	else if (status > 200){
		console.error ('error during uploading, received unexpected statuscode: '+status);
		this.uploadResult.fail.push([name, statusMap['2xx'].msg]);
	}
	
	if (last !== true){
		return;
	}

	if (this.uploadResult.win.length > 0){
		for (i = 0 ; i<this.uploadResult.win.length ; i++){
			names.push(this.uploadResult.win[i][0]);
			msg = (typeof this.uploadResult.win[i][2] !== 'undefined') ? msg + (this.uploadResult.win[i][1])+' ' : '';
		}
		waswere = (i>1) ? ' were' : ' was';
		namesStr = names.join(', ');
		gui.showFeedback(namesStr.substring(0, namesStr.length) + waswere +' successfully uploaded. '+msg);
	}
	//else{
	// not sure if there should be a notification if forms fail automatic submission
	if (this.uploadResult.fail.length > 0){
		if (this.uploadResult.force === true){
			for (i = 0 ; i<this.uploadResult.fail.length ; i++){
				msg += this.uploadResult.fail[i][0] + ': ' + this.uploadResult.fail[i][1] + '<br />';
			}
			gui.alert(msg, 'Failed data submission');
		}
		else{

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
	$('button#submit-form').button({'icons': {'primary':"ui-icon-check"}})
		.click(function(){
			form.validateForm();
			submitForm();
		});
	$('a#queue').click(function(){
		exportToFile();
		return false;
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
		//console.debug('save or delete event detected with new formlist: '+formList);
		that.updateRecordList(JSON.parse(formList));
	});

	$(document).on('setsettings', function(e, settings){
		console.debug('settingschange detected, GUI will be updated with settings:');
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
		$('#queue').show().find('#queue-length').text(recordList.length);
	}
	else{
		$('<li class="no-click">no locally saved records found</li>').appendTo($list);
		$('#queue').hide().find('.queue-length').text('');
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

