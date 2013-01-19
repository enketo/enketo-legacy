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
	var that=this;
	this.CONNECTION_URL = '/checkforconnection.php';
	this.SUBMISSION_URL = '/data/submission';
	this.GETSURVEYURL_URL = '/launch/get_survey_url';
	//this.SUBMISSION_TRIES = 2;
	this.currentOnlineStatus = null;
	this.uploadOngoing = false;

	this.init = function(){
		//console.log('initializing Connection object');
		this.checkOnlineStatus();
		that = this;
		window.setInterval(function(){
			//console.log('setting status'); //DEBUG
			that.checkOnlineStatus();
			//that.uploadFromStore();
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
	};
}

Connection.prototype.checkOnlineStatus = function(){
	var online,
		that = this;
	//console.log('checking connection status');
	//navigator.onLine is totally unreliable (returns incorrect trues) on Firefox, Chrome, Safari (on OS X 10.8),
	//but I assume falses are correct
	if (navigator.onLine){
		$.ajax({
			type:'GET',
			url: this.CONNECTION_URL,
			cache: false,
			dataType: 'json',
			timeout: 3000,
			complete: function(response){
				//important to check for the content of the no-cache response as it will
				//start receiving the fallback page specified in the manifest!
				online = typeof response.responseText !== 'undefined' && response.responseText === 'connected';
				that.setOnlineStatus(online);
			}
		});
	}
	else {
		this.setOnlineStatus(false);
	}
};

/**
 * provides the connection status, should be considered: 'seems online' or 'seems offline'
 * NEEDS IMPROVEMENT. navigator.onLine alone is probably not appropriate because for some browsers this will
 * return true when connected to a local network that is not connected to the Internet.
 * However, this could be the first step. If (true) a request is sent to the server to check for a connection
 *
 * @return {?boolean} true if it seems the browser is online, false if it does not, null if not known
 */
Connection.prototype.getOnlineStatus = function(){
	//return navigator.onLine;
	return this.currentOnlineStatus;
};
	
Connection.prototype.setOnlineStatus = function(newStatus){
	//var oldStatus = onlineStatus;
	//onlineStatus = online;
	if (newStatus !== this.currentOnlineStatus){
		console.log('online status changed to: '+newStatus+', triggering window.onlinestatuschange');
		$(window).trigger('onlinestatuschange', newStatus);
	}
	this.currentOnlineStatus = newStatus;
};

/**
 * [uploadRecords description]
 * @param  {(Array.<Object.<string, string>>|Object.<string, string>)} records   [description]
 * @param  {boolean=} force     [description]
 * @param  {Object.<string, Function>=} callbacks only used for testing
 * @return {boolean}           [description]
 */
Connection.prototype.uploadRecords = function(records, force, callbacks){
	force = (typeof force !== 'undefined') ? force : false;
	records = (typeof records === 'object' && !$.isArray(records)) ? [records] : records;
	callbacks = (typeof callbacks === 'undefined') ? null : callbacks;

	if (records.length === 0){
		return false;
	}

	if (!this.uploadOngoing){
		this.uploadResult = {win:[], fail:[]};
		this.uploadQueue = records;
		this.forced = force;
		console.debug('upload queue length: '+this.uploadQueue.length);
		this.uploadOne(callbacks);
	}
	return true;
};

/**
 * Uploads a record from the queue
 * @param  {Object.<string, Function>=} callbacks [description]
 */
Connection.prototype.uploadOne = function(callbacks){//dataXMLStr, name, last){
	var record, content, last,
		that = this;

	callbacks = (typeof callbacks === 'undefined' || !callbacks) ? {
		complete: function(jqXHR, response){
			$(document).trigger('submissioncomplete');
			that.processOpenRosaResponse(jqXHR.status, record.name, last);
			/**
			  * ODK Aggregrate gets very confused if two POSTs are sent in quick succession,
			  * as it duplicates 1 entry and omits the other but returns 201 for both...
			  * so we wait for the previous POST to finish before sending the next
			  */
			that.uploadOne();
		},
		error: function(jqXHR, textStatus){
			if (textStatus === 'timeout'){
				console.debug('submission request timed out');
			}
			else{
				console.error('error during submission, textStatus:', textStatus);
			}
		},
		success: function(){}
	} : callbacks;
	
	if (this.uploadQueue.length > 0){
		record = this.uploadQueue.pop();
		if (this.getOnlineStatus() !== true){
			this.processOpenRosaResponse(0, record.name, true);
		}
		else{
			this.uploadOngoing = true;
			content = new FormData();
			content.append('xml_submission_data', record.data);
			content.append('Date', new Date().toUTCString());
			last = (this.uploadQueue.length === 0) ? true : false;
			this.setOnlineStatus(null);
			$(document).trigger('submissionstart');
			//console.debug('calbacks: ', callbacks );
			$.ajax(this.SUBMISSION_URL,{
				type: 'POST',
				data: content,
				cache: false,
				contentType: false,
				processData: false,
				//TIMEOUT TO BE TESTED WITH LARGE SIZE PAYLOADS AND SLOW CONNECTIONS...
				timeout: 60*1000,
				complete: function(jqXHR, response){
					that.uploadOngoing = false;
					callbacks.complete(jqXHR, response);
				},
				error: callbacks.error,
				success: callbacks.success
			});
		}
	}
};

//TODO: move this outside this class?
Connection.prototype.processOpenRosaResponse = function(status, name, last){
	var i, waswere, namesStr,
		msg = '',
		names=[],
		contactSupport = 'Contact '+settings['supportEmail']+' please.',
		contactAdmin = 'Contact the survey administrator please.',
		serverDown = 'Sorry, the enketo server is down or being maintained. Please try again later or contact '+settings['supportEmail']+' please.',
		statusMap = {
			0: {success: false, msg: (typeof jrDataStrToEdit !== 'undefined') ?
				"Uploading of data failed. Please try again." :
				"Uploading of data failed (maybe offline) and will be tried again later." },
			200: {success:false, msg: "Data server did not accept data. "+contactSupport},
			201: {success:true, msg: ""},
			202: {success:true, msg: name+" may have had errors. "+contactAdmin},
			'2xx': {success:false, msg: "Unknown error occurred when submitting data. "+contactSupport},
			400: {success:false, msg: "Data server did not accept data. "+contactAdmin},
			403: {success:false, msg: "You are not allowed to post data to this data server. "+contactAdmin},
			404: {success:false, msg: "Submission service on data server not found or not properly configured."},
			'4xx': {success:false, msg: "Unknown submission problem on data server."},
			413: {success:false, msg: "Data is too large. Please export the data and contact "+settings['supportEmail']+"."},
			500: {success:false, msg: serverDown},
			503: {success:false, msg: serverDown},
			'5xx':{success:false, msg: serverDown}
		};

	console.debug('submission results for '+name+' => status: '+status);
	
	if (typeof statusMap[status] !== 'undefined'){
		if ( statusMap[status].success === true){
			$(document).trigger('submissionsuccess', name);
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

	console.debug('forced: '+this.forced+' online: '+this.currentOnlineStatus, this.uploadResult);

	if (this.uploadResult.win.length > 0){
		for (i = 0 ; i<this.uploadResult.win.length ; i++){
			names.push(this.uploadResult.win[i][0]);
			msg = (typeof this.uploadResult.win[i][2] !== 'undefined') ? msg + (this.uploadResult.win[i][1])+' ' : '';
		}
		waswere = (i>1) ? ' were' : ' was';
		namesStr = names.join(', ');
		gui.feedback(namesStr.substring(0, namesStr.length) + waswere +' successfully uploaded. '+msg);
		this.setOnlineStatus(true);
	}

	if (this.uploadResult.fail.length > 0){
		//console.debug('upload failed');
		if (this.forced === true && this.currentOnlineStatus !== false){
			for (i = 0 ; i<this.uploadResult.fail.length ; i++){
				msg += this.uploadResult.fail[i][0] + ': ' + this.uploadResult.fail[i][1] + '<br />';
			}
			//$('.drawer.left.closed .handle').click();
			gui.alert(msg, 'Failed data submission');
		}
		else{
			// not sure if there should be a notification if forms fail automatic submission
		}
		//this is actually not correct as there could be many reasons for uploads to fail, but let's use it for now.
		this.setOnlineStatus(false);
	}
	//this.uploadOngoing = false;
};

Connection.prototype.isValidURL = function(url){
	return (/^(https?:\/\/)([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?[\/\w \.\-\=\&\?]*$/).test(url);
};

Connection.prototype.getFormlist = function(serverURL, callbacks){
	callbacks = this.getCallbacks(callbacks);

	if (!this.isValidURL(serverURL)){
		callbacks.error(null, 'validationerror', 'not a valid URL');
		return;
	}
	$.ajax('/forms/get_list', {
		type: 'GET',
		data: {server_url: serverURL},
		cache: false,
		contentType: 'json',
		timeout: 60*1000,
		success: callbacks.success,
		error: callbacks.error,
		complete: callbacks.complete
	});
};

Connection.prototype.getSurveyURL = function(serverURL, formId, callbacks){
	callbacks = this.getCallbacks(callbacks);

	if (!serverURL || !this.isValidURL(serverURL)){
		callbacks.error(null, 'validationerror', 'not a valid server URL');
		return;
	}
	if (!formId || formId.length === 0){
		callbacks.error(null, 'validationerror', 'not a valid formId');
		return;
	}
	$.ajax({
		url: this.GETSURVEYURL_URL,
		type: 'POST',
		data: {server_url: serverURL, form_id: formId},
		cache: false,
		timeout: 60*1000,
		dataType: 'json',
		success: callbacks.success,
		error: callbacks.error,
		complete: callbacks.complete
	});
};

/**
 * Obtains HTML Form from an XML file or from a server url and form id
 * @param  {?string=}					serverURL   full server url
 * @param  {?string=}					formId		form ID
 * @param  {Blob=}						formFile	XForm XML file
 * @param  {Object.<string, Function>=} callbacks	callbacks
 */
Connection.prototype.getTransForm = function(serverURL, formId, formFile, callbacks){
	var formData = new FormData();

	callbacks = this.getCallbacks(callbacks);
	serverURL = serverURL || null;
	formId = formId || null;
	formFile = formFile || new Blob();
	
	if (formFile.size === 0 && !serverURL && !formId){
		callbacks.error(null, 'validationerror', 'No form file or URLs provided');
		return;
	}
	if (formFile.size === 0 && !this.isValidURL(serverURL)){
		callbacks.error(null, 'validationerror', 'Not a valid server url');
		return;
	}
	if (formFile.size === 0 && (!formId || formId.length === 0)){
		callbacks.error(null, 'validationerror', 'No form id provided');
		return;
	}
	formData.append('server_url', serverURL);
	formData.append('form_id', formId);
	formData.append('xml_file', formFile);

	console.debug('form file: ', formFile);

	$.ajax('/transform/get_html_form', {
		type: 'POST',
		cache: false,
		contentType: false,
		processData: false,
		dataType: 'xml',
		data: formData,
		success: callbacks.success,
		error: callbacks.error,
		complete: callbacks.complete
	});
};

Connection.prototype.validateHTML = function(htmlStr, callbacks){
	var content = new FormData();
	
	callbacks = this.getCallbacks(callbacks);

	content.append('level', 'error');
	content.append('content', htmlStr);

	$.ajax('/html5validate/', {
		type: 'POST',
		data: content,
		contentType: false,
		processData: false,
		success: callbacks.success,
		error: callbacks.error,
		complete: callbacks.complete
	});
};

/**
 * Collection of helper functions for openRosa connectivity
 * @type {Object}
 */
Connection.prototype.oRosaHelper = {
	/**
	 * Magically generates a well-formed serverURL from a type and fragment
	 * @param  {string} type    type of server or account (http, https, formhub_uni, formhub, appspot)
	 * @param  {string} frag	a user input for the given type
	 * @return {?string}        a full serverURL
	 */
	fragToServerURL: function(type, frag){
		var protocol,
			serverURL = '';

		if (!frag){
			console.log('nothing to do');
			return null;
		}
		console.debug('frag: '+frag);
		//always override if valid URL is entered
		//TODO: REMOVE reference to connection
		if (connection.isValidURL(frag)){
			return frag;
		}

		switch (type){
			case 'http':
			case 'https':
				protocol = (/^http(|s):\/\//.test(frag)) ? '' : type+'://';
				serverURL = protocol + frag;
				break;
			case 'formhub_uni':
			case 'formhub':
				serverURL = 'http://formhub.org/'+frag;
				break;
			case 'appspot':
				serverURL = 'https://'+frag+'.appspot.com';
				break;
		}

		if (!connection.isValidURL(serverURL)){
			console.error('not a valid url: '+serverURL);
			return null;
		}
		console.log('server_url: '+serverURL);
		return serverURL;
	}
};

/**
 * Get the number of forms launched on enketo (all know deployments)
 * @param  {Object.<string, Function>=} callbacks callbacks
 */
Connection.prototype.getNumberFormsLaunched = function(callbacks){
	callbacks = this.getCallbacks(callbacks);
	$.ajax({
		url: '/front/get_number_launched_everywhere',
		dataType: 'json',
		success: callbacks.success,
		error: callbacks.error,
		complete: callbacks.complete
	});
};

/**
 * Loads a google maps API v3 script
 * @param  {Function} callback function to call when script has been loaded and added to DOM
 */
Connection.prototype.loadGoogleMaps = function(callback){
	var APIKey = settings['mapsDynamicAPIKey'] || '',
		script = document.createElement("script");
	window.googleMapsInit = callback;
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?v=3.exp&key="+APIKey+"&sensor=false&libraries=places&callback=googleMapsInit";
	document.body.appendChild(script);
};

/**
 * Sets defaults for optional callbacks if not provided
 * @param  {Object.<string, Function>=} callbacks [description]
 * @return {Object.<string, Function>}           [description]
 */
Connection.prototype.getCallbacks = function(callbacks){
	callbacks = callbacks || {};
	callbacks.error = callbacks.error || function(jqXHR, textStatus, errorThrown){
		console.error(textStatus+' : '+errorThrown);
	};
	callbacks.complete = callbacks.complete || function(){};
	callbacks.success = callbacks.success || function(){console.log('success!');};
	return callbacks;
};