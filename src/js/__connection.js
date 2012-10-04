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
	//var onlineStatus;
	//var tableFields, primaryKey;
	//var tableName, version;
	var that=this;
	this.currentOnlineStatus = false;
	this.uploadOngoing = false;
	
	this.init = function(){
		//console.log('initializing Connection object');
		this.checkOnlineStatus();
		that = this;
		window.setInterval(function(){
			//console.log('setting status'); //DEBUG
			that.checkOnlineStatus();
			that.uploadFromStore();
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

Connection.prototype.checkOnlineStatus = function(){
	var online,
		that = this;
	//console.log('checking connection status');
	//navigator.onLine is totally unreliable (returns incorrect trues) on Firefox, Chrome, Safari (on OS X 10.8),
	//but I assume falses are correct
	if (navigator.onLine){
		$.ajax({
			type:'GET',
			url: CONNECTION_URL,
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
 * @return {boolean} true if it seems the browser is online, false if it does not
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

//REMOVE THIS AS IT MAKES NO SENSE WHATSOEVER TO LET USERS CHANGE A CENTRAL FORM SETTING!
//Connection.prototype.switchCache = function(active){
//	if (typeof active !== 'boolean'){
//		console.error('switchCache called without parameter');
//		return;
//	}
//	$.ajax('webform/switch_cache', {
//		type: 'POST',
//		data: {cache: active}
//	});
//};

/**
 * PROTECTION AGAINST CALLING FUNCTION TWICE to be tested, attempts to upload all finalized forms *** ADD with the oldest timeStamp first? ** to the server
 * @param  {boolean=} force       [description]
 * @param  {string=} excludeName [description]
 */
Connection.prototype.uploadFromStore = function(force, excludeName) {
	var i, name, result,
		autoUpload = (typeof settings !== 'undefined' && ( settings.getOne('autoUpload') === 'true' || settings.getOne('autoUpload') === true) ) ? true : false;
	//console.debug('upload called with uploadOngoing variable: '+uploadOngoing+' and autoUpload: '+autoUpload); // DEBUG
	// proceed if autoUpload is true or it is overridden, and if there is currently no ongoing upload, and if the browser is online
	if ( this.uploadOngoing === false  && ( autoUpload === true || force ) ){
		this.uploadResult = {win:[], fail:[]};
		this.uploadQueue = store.getSurveyDataArr(true, excludeName);
		this.forced = force;
		console.debug('upload queue length: '+this.uploadQueue.length);

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

/**
 * Function used to directly upload data (forced) bypassing local storage. It is used for submitting edited data
 * that was POSTed to webform/edit
 *
 * @param  {Object.<string, string>} record with name and data properties,  temporary name is used to trigger uploadsuccess event
 */
Connection.prototype.uploadFromString = function(record) {
	var result;
	this.forced = true;
	// proceed if f there is currently no ongoing upload
	if ( this.uploadOngoing === false ){
		this.uploadResult = {win:[], fail:[]};
		this.uploadQueue = [record];
		this.uploadOne();
	}
};

Connection.prototype.uploadOne = function(){//dataXMLStr, name, last){
	var record, content, last,
		that = this;
	if (this.uploadQueue.length > 0){
		record = this.uploadQueue.pop();
		if (this.getOnlineStatus() !== true){
			this.processOpenRosaResponse(0, record.name, true);
		}
		else{
			this.uploadOngoing = true;
			content = new FormData();
			content.append('xml_submission_data', form.prepareForSubmission(record.data));//dataXMLStr);
			content.append('Date', new Date().toUTCString());
			last = (this.uploadQueue.length === 0) ? true : false;
			this.setOnlineStatus(null);
			$.ajax(SUBMISSION_URL,{
				type: 'POST',
				data: content,
				cache: false,
				contentType: false,
				processData: false,
				//TIMEOUT TO BE TESTED WITH LARGE SIZE PAYLOADS AND SLOW CONNECTIONS...
				timeout: 10*1000,
				complete: function(jqXHR, response){
					that.processOpenRosaResponse(jqXHR.status, record.name, last);
					/**
					  * ODK Aggregrate gets very confused if two POSTs are sent in quick succession,
					  * as it duplicates 1 entry and omits the other but returns 201 for both...
					  * so we wait for the previous POST to finish before sending the next
					  */
					that.uploadOne();
				}
			});
		}
	}
};

Connection.prototype.processOpenRosaResponse = function(status, name, last){
	var i, waswere, namesStr,
		msg = '',
		names=[],
		contactSupport = 'Contact support@formhub.org please.',
		contactAdmin = 'Contact the survey administrator please.',
		serverDown = 'Sorry, the enketo server is down or being maintained. Please try again later or contact support@formhub.org please.',
		statusMap = {
			0: {success: false, msg: "Uploading of data failed (probably offline) and will be tried again later."},
			200: {success:false, msg: "Data server did not accept data. "+contactSupport},
			201: {success:true, msg: ""},
			202: {success:true, msg: name+" may have had errors. "+contactAdmin},
			'2xx': {success:false, msg: "Unknown error occurred when submitting data. "+contactSupport},
			400: {success:false, msg: "Data server did not accept data. "+contactAdmin},
			403: {success:false, msg: "You are not allowed to post data to this data server. "+contactAdmin},
			404: {success:false, msg: "Submission service on data server not found or not properly configured."},
			'4xx': {success:false, msg: "Unknown submission problem on data server."},
			413: {success:false, msg: "Data is too large. Please export the data and contact support@formhub.org please."},
			500: {success:false, msg: serverDown},
			503: {success:false, msg: serverDown},
			'5xx':{success:false, msg: serverDown}
		};
	//console.debug('name: '+name);
	//console.debug(status);
	if (typeof statusMap[status] !== 'undefined'){
		if ( statusMap[status].success === true){
			if (typeof store !== 'undefined'){
				store.removeRecord(name);
				$('form.jr').trigger('delete', JSON.stringify(store.getFormList()));
				console.log('tried to remove record with key: '+name);
			}
			$('form.jr').trigger('uploadsuccess', name);
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
		//console.debug('upload failed');
		
		//this is actually not correct as there could be many reasons for uploads to fail, but let's use it for now.
		this.setOnlineStatus(false);
		//$('.drawer.left #status').text('Offline.');

		if (this.forced === true){
			for (i = 0 ; i<this.uploadResult.fail.length ; i++){
				msg += this.uploadResult.fail[i][0] + ': ' + this.uploadResult.fail[i][1] + '<br />';
			}
			//console.debug('going to give upload feedback to user');
			//if ($('.drawer.left').length > 0){
				//show drawer if currently hidden
				$('.drawer.left.hide .handle').click();
			//}
			//else {
				gui.alert(msg, 'Failed data submission');
			//}
		}
		else{
			// not sure if there should be a notification if forms fail automatic submission
		}
	}
	this.uploadOngoing = false;
	//re-enable upload button
};


