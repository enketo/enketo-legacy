/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global gui, Form, StorageLocal, Modernizr*/

/* Global Variables and Constants -  CONSTANTS SHOULD BE MOVED TO CONFIG FILE AND ADDED DYNAMICALLY*/
var  /**@type {Form}*/form,  /**@type {Connection}*/connection, /**@type {Storage}*/store,  /**@type {Cache}*/cache,  /**@type {Settings}*/settings,
	currentOnlineStatus = false;//, SURVEY_FORM_ID;
var jrDataStr; //initial store of data format, value set in survey_view.php
//var FORM_FORMAT_URL = 'survey_format';
//var CONNECTION_URL = 'checkforconnection.txt';
//var DATA_RECEIVER_URL = 'data/upload';
var MODERN_BROWSERS_URL = 'modern_browsers';

DEFAULT_SETTINGS = {'autoUpload':true, 'buttonLocation': 'bottom', 'autoNotifyBackup':false };
//var GEARS_MANIFEST_URL = 'manifest/gears';

//var MAX_QTY_SAVED_FORMS = 50;
//ßvar SURVEY_FORM_ID = 'survey-form';
var CACHE_CHECK_INTERVAL = 3600*1000;
//var showFormList, checkForOpenForm;//,
//loadForm, deleteForm, setSettings;initSaveFormsToFile,
//
//tight coupling with Form and Storage class, but loose coupling with GUI
// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function() {
	'use strict';
	var bookmark, message, choices, shown;

	store = new StorageLocal();
	form = new Form('form.jr:eq(0)', jrDataStr);
	settings = new Settings();
	settings.init();
	connection = new Connection();
	cache = new Cache();
	
	// check if localStorage is supported and if not re-direct to browser download page
	if (!store.isSupported()){
	//if(Modernizr.localStorage){
		//console.log('redirect attempt because of lack of localStorage support'); // DEBUG
		window.location = MODERN_BROWSERS_URL;
	}
	else{
		$(document).trigger('browsersupport', 'local-storage');
	}
	
	//best to place this after localStorage check, so that IE7 users with Gears
	//will be re-directed immediately before asking whether they allow Gears to store data
	cache.init();
	console.log('cache initialized');
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
	
	// application cache for launching application offline
	if (cache.isSupported()){
		
		$(document).trigger('browsersupport', 'offline-launch');
		
		//reminder to bookmark page will be shown 3 times
		bookmark = store.getRecord('bookmark');
		
		shown=0;
		if (bookmark){
			shown = (bookmark.shown) ? bookmark.shown : 0;
		}
		if(shown < 3){
			setTimeout(function(){
				gui.showFeedback('Please bookmark this page for easy offline launch. '+
					'(This reminder will be shown '+(2-shown)+' more time(s).)', 20);
				shown++;
				store.setRecord('__bookmark', {shown: shown}, true);
			}, 5*1000);
		}
		
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
		gui.confirm(message, choices,'Application cannot launch offline');
	}
	
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

function loadForm(formName, confirmed){
	'use strict';
	var message, choices;
	//console.log('loadForm called'); // DEBUG
	if (!confirmed && form.hasBeenEdited()){
		message = 'Would you like to proceed without saving changes to the form you were working on?';
		choices = {
			'posAction': function(){ loadForm("'+formName+'", true); }
		};
		gui.confirm(message, choices);
	}
	else {
		// request a form data object
		var data = store.getRecord(formName);
		//enters that data in the form on the screen
		// *OLD*checkForOpenForm(true);
		if (data !== null){
			var success = form.setData(data);
			//gui.closePage();
			//console.log('displaying loaded form data succes?: '+success); // DEBUG
			$('#page-close').click();
			$('button#delete-form').show();
			if(!success){
				gui.alert('Error loading form. Saved data may be corrupted');
			}
			else gui.showFeedback('"'+formName +'" has been loaded', 2);
		}
		else{
			// ADD something went wrong with loading data from storage
		}
	}
}

function saveForm(recordName, overwrite){
	'use strict';
	//console.log('saveForm called'); // DEBUG
	var oldRecordName, result, message, choices,
		data = form.getDataStr(true, true);
	//var data = form.getData(SURVEY_FORM_ID);
	
	//console.log ('data: '+JSON.stringify(data)); //DEBUG
	if (data !== null && data !== '' && recordName && recordName.length > 0){
		oldRecordName = form.getKey();
		console.log('old key is: '+oldRecordName); // DEBUG
		console.log('new key is: '+recordName); // DEBUG
		
		if (oldRecordName && oldRecordName !== recordName && overwrite !== 'undefined')
		{
			message = 'Record name has changed. Would you like to delete the record saved under the old name:'+oldRecordName+'?';
			choices = {
				posButton : 'Yes, delete',
				negButton : 'No, keep',
				posAction : function(){ saveForm(recordName, true); },
				negAction : function(){ saveForm(recordName, false); }
			};
			gui.confirm(message, choices, 'Delete old Record?');
		}
		else {
			result = store.setRecord(recordName, data, overwrite, oldRecordName);
		
			//console.log('result: '+result); // DEBUG
			if (result === 'success'){
				gui.showFeedback('Form with name "'+recordName+'" has been saved.', 2);
				//set the new custom html5 data attribute stored-with-key
				form.setKey(recordName);
				form.setEditStatus(false);
				$('button#delete-form').show();
				$('form.jr').trigger('save', JSON.stringify(store.getFormList()));
			}
			//else if (result === 'requireKey'){
			//	gui.alert (form.KEY_LABEL+' is required. Please provide this.');
			//}
			else if (result === 'existing'){
				message = 'Record with this name already exists. Would you like to overwrite existing record? ';
				choices = {
					posButton : 'Yes, overwrite',
					posAction : function(){ saveForm(recordName, true); },
					negAction : function(){ gui.showFeedback("Form was not saved."); }
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
	}
	else {
		if(recordName){
			gui.showFeedback('Nothing to save.'); //ADD error with getting data from form?
		}
		else{
			console.error('No record name provided.');
		}
	}
	return;
}

function resetForm(confirmed){
	'use strict';
	var message, choices;
	if (!confirmed && form.hasBeenEdited()){
		message = 'Would you like to reset without saving changes to the form you were working on?';
		choices = {
			posAction : function(){ resetForm(true); }
		};
		gui.confirm(message, choices);
	}
	else {
		form.reset();
	}
}

function deleteForm(confirmed) {
	'use strict';
	var message, choices, key = form.getKey();
	//console.log ('oldkey: '+oldKey ); // DEBUG
	//console.log ('confirmed: '+confirmed); // DEBUG
	if (key !== '' && key !== null){
		if (confirmed){
			var success = store.removeRecord(key);
			if (success){
				form.reset();
				gui.showFeedback('Successfully deleted form.');
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
	//console.log('exiting delete function'); // DEBUG
	return;
}


// BUG: function causes a crash in Safari on OS X when loaded from appCache in fresh Safari browser window
function initSaveFormsToFile() {
	'use strict';
	$('#downloader').downloadify({
		filename: function(){
			return 'All_Form_Data.json'; //static file -- you could retrieve from form input box
		},
		data: function(){
			console.log('getting data for download'); // DEBUG
			return JSON.stringify(store.getRecordCollection()); //static content -- you could retrieve from form input box
		},
		onComplete: function(){
			gui.showFeedback('The file has been saved!');
		},
		onCancel: function(){
		// anything?
		},
		onError: function(){
			gui.alert('Error saving file. File not saved!');
		},
		swf: '/libraries/downloadify/downloadify.swf',
		downloadImage: '/libraries/downloadify/download.png', // CHANGE THIS IMAGE AND LOCATION
		width: 210,
		height: 55,
		transparent: true,
		append: false
	});
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
				if (connection.getStatus()) {//error event always triggered when offline
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
		switch(cacheType){
			case 'html5Cache':
				try{appCache.update();}
				//Opera throws mysterious INVALID_STATE_ERR
				catch(e){
					if (e.name === 'NS_ERROR_DOM_SECURITY_ERR'){ //FF before approving offline use
						error = 'security';
					}
					console.log('error thrown during cache update. error name: '+e.name+'  message: '+e.message);
				}
				//event listener will update variable 'update';
				break;
			case 'gearsCache' :
				// Checking for updates will also happen regularly automatically even if not explicitly called
				appCache.checkForUpdate();
				break;
		}
		return;
	};

	this.updateReady = function(){
		if (cacheType==='gearsCache'){
			//console.log ('loadedVersion:'+loadedVersion); //DEBUG
			//console.log ('currentVersion:'+appCache.currentVersion); //DEBUG
			update = (loadedVersion !== '' && loadedVersion != appCache.currentVersion) ? true : false;
		}
		console.log('updateReady() returns: '+update); //DEBUG
		return update;
	};

	this.getError = function(){
		return error;
	};

}


//Class dealing with uploads to server
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
	var onlineStatus;
	//var tableFields, primaryKey;
	var tableName, version;
	var uploadOngoing;
	var _this=this;
	
	this.init = function(){
		//console.log('initializing Connection object');
		checkOnlineStatus();
		//window.setInterval(function(){
		//	//console.log('setting status'); //DEBUG
		//	setStatus();
		//	_this.upload();
		//}, 10*1000);
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
			checkOnlineStatus();
		});
		//since network change events are not properly fired, at least not in Firefox 13 (OS X), this is an temporary fix
		//that can be removed eventually or set to to 60x1000 (1 min)
		/*window.setInterval(function(){
			$(window).trigger('online');
		}, 10*1000);*/

		//setTableVars();
	};
	
	function setTableVars(){
		var primaryKey;
		tableName = form.COUNTRY+'_'+form.SECTOR+'_'+form.YEAR+'_'+form.SURVEY_NAME;
		
		//make tableName database friendly
		tableName = tableName.replace(/\s/g, '_');
		//console.log('tableName without whitespace: '+tableName); //DEBUG
		tableName = tableName.toLowerCase();
		//console.log('tableName lowercase: '+tableName); //DEBUG
		
		version = form.VERSION;
		
		//tableFields = '';
		//for (var i=0; i<form.QUESTIONS.length; i++){
		//	tableFields += form.QUESTIONS[i].id + ' ' + form.QUESTIONS[i].type + ', ';
		//}
		//tableFields += 'lastSaved double, lastUploaded double';
		//primary key of MySQL table is a combination of two colummns and only the first 20 characters of the second column are used.
		primaryKey = 'lastUploaded, '+form.KEY_NAME+'(20)';
	}
	
	this.getStatus = function(){
		return onlineStatus;
	};
	
	this.getTableName = function(){
		return tableName;
	};
	
	//this.setAutoUpload = function(upload){
	//	autoUpload = upload;
	//}
	
	// provides the connection status, should be considered: 'seems online' or 'seems offline'
	// NEEDS IMPROVEMENT. navigator.onLine alone is probably not appropriate because for some browsers this will
	// return true when connected to a local network that is not connected to the Internet.
	// However, this could be the first step. If (true) a request is sent to the server to check for a connection
	// @online = used to force a status (necessary?)
	function checkOnlineStatus(online){
		console.log('checking connection status');//, status before check is: '+onlineStatus); // DEBUG
		if (typeof online !== 'undefined' && ( online === true || online === false ) ){
			setStatus(online);
		}
		//forced status
		else {
			setStatus(navigator.onLine);
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
		}
	}
	
	function setStatus(newStatus){
		//var oldStatus = onlineStatus;
		//onlineStatus = online;
		if (newStatus !== currentOnlineStatus){
			console.log('status changed to: '+newStatus+', triggering window.onlinestatuschange');
			$(window).trigger('onlinestatuschange', newStatus);
		}
		currentOnlineStatus = newStatus;
	}

	// PROTECTION AGAINST CALLING FUNCTION TWICE to be tested
	// attempts to upload all finalized forms *** ADD with the oldest timeStamp first? ** to the server
	this.upload = function(override) {
		var autoUpload = store.getSettings('settings-auto-upload');
		//console.log('upload called with uploadOngoing variable: '+uploadOngoing+' and autoUpload: '+autoUpload); // DEBUG

		// autoUpload is true or it is overriden, proceed
		if (!uploadOngoing && (autoUpload==='true' || override)){
			var dataObj={}, insertedStr='';
			dataObj.surveyForms = store.getRecordCollection('surveyData', true);
			dataObj.tableName = tableName;
			//dataObj.tableFields = tableFields;
			//dataObj.primaryKey = primaryKey;
			dataObj.version = version;
			//ADD build array of forms beingUploaded and prevent user from opening these
			//if there is anything to send, send it
			//if (dataObj.surveyForms.length>0){
//				console.log('attempting upload with override: '+override+' Changing uploadOngoing to true'); // DEBUG
//				uploadOngoing = true;
//				console.log('data to be send: '+JSON.stringify(dataObj)); // DEBUG
//				$.ajax({
//					type: 'POST',
//					url: DATA_RECEIVER_URL,
//					data: dataObj,
//					success: function(result){
//						console.log('upload, received back from server: '+JSON.stringify(result)); // DEBUG
//						// ADD some kind of feedback to user if it fails but this would mean setting interval outside of Connection class?
//						if (result.inserted){
//							for (var i=0 ; i<result.inserted.length ; i++){
//								store.removeRecord(result.inserted[i]);
//								insertedStr += result.inserted[i];
//								if (i<result.inserted.length-1){
//									insertedStr += ', ';
//								}
//								//console.log('tried to remove record with key: '+result.inserted[i]);
//							}
//							// CHANGE?
//							gui.showFeedback('Succesfully uploaded forms: '+insertedStr+'.');
//							gui.updateRecordList($('article[id="records"]'));
//						}
//						else {
//							if (override) {
//								gui.showFeedback('Upload failed on server');
//							}
//						}
//					},
//					error: function(){
//						if (override){
//							gui.showFeedback('Upload failed. Server may be unavailable or client may be offline.');
//						}
//					},
//					complete: function(){
//						console.log('completed ajax call, changing uploadOngoing variable to false'); // DEBUG
//						uploadOngoing = false;
//					},
//					dataType: 'json'
//				});
//			}
//			else { //nothing to send
//				//console.log('nothing to upload, (uploadOngoing: '+uploadOngoing+')');
//				//if the function was called with override, inform user
//				if (override) {
//					gui.showFeedback('Nothing marked "final" to upload (or record is currently open).');
//				}
//			}
		}
	};

}





//avoid Google Closure Compiler renaming:
Settings.prototype['autoUpload'] = Settings.prototype.autoUpload;
Settings.prototype['buttonLocation'] = Settings.prototype.buttonLocation;

Settings.prototype.autoUpload = function(val){

};

Settings.prototype.buttonLocation = function(val){
	"use strict";
	//if ($(this).checked === true) {
	//console.log('found radio input with required value'); // DEBUG
	$('#form-controls').removeClass('bottom right mobile').addClass(val);
//						if (el[i].value==='mobile'){
//							$('body').addClass('no-scroll');
//						}
//						else {
//							$('body').removeClass('no-scroll');
//						}
	$(window).trigger('resize');
};

//function to update the settings record
///function updateSettings(){
//"use strict";
//console.log('updateSettings fired, with parameter settingsForm:'); //DEBUG
//
//// the intro message might also contain a setting: 'never show this message again'
//	//if(!settingsForm){
//		settingsForm = 'settings-form';
//	//}
//
//	//detect change
//	console.log('triggered by :'+$(this).attr('name')); // DEBUG
//
//	//save settings to localStorage
//	var data = form.getData(settingsForm);
//	//console.log('data scraped from '+settingsForm+': '+JSON.stringify(data)); // DEBUG
//	if (data !== null){ // CHECK IF AN EMPTY FORM REALLY RETURNS NULL!
//		var result = store.setRecord(data);
//		//console.log('result of attempt to save settings: '+result);
//		if (result !== 'success'){
//			gui.showFeedback('Error occurred when trying to save the settings.');
//		}
//	}
//	//make changes
//	updateSetting($(this));
//
/// perform action according to the (changed) settings
//function updateSetting(el){
//	"use strict";
//}


//Extend GUI
//setCustomEventHandlers is called automatically by GUI.init();
GUI.prototype.setCustomEventHandlers = function(){
	"use strict";
	var settingsForm, that = this;
	
	// survey-form controls
	$('button#save-form').button({'icons': {'primary':"ui-icon-disk"}})
		.click(function(){
			saveForm(false);
		});
	$('button#reset-form').button({'icons': {'primary':"ui-icon-refresh"}})
		.click(function(){
			resetForm();
		});
	$('button#delete-form').button({'icons': {'primary':"ui-icon-trash"}})
		.click(function(){
			deleteForm(false);
		});

	$(document)
		.on('click', '#records-saved li:not(.no-click)', function(event){ // future items matching selection will also get eventHandler
			event.preventDefault();
			//loadForm($(this).find('.name').text());
		})
		.on('mouseenter', '#records-saved li:not(.no-click)', function(){
			$(this).addClass('ui-state-hover');
			$(this).mousedown(function(){
				$(this).addClass('ui-state-active');
			});
		})
		.on('mouseleave', '#records-saved li:not(.no-click)', function(){
			$(this).removeClass('ui-state-hover');
		});
	
	this.pages().get('records').find('button#records-force-upload').button({'icons': {primary:"ui-icon-arrowthick-1-n"}})
		.click(function(){
			gui.alert('Sorry, this button is not working yet.')
			//connection.upload(true);
		})
		.hover(function(){
			$('#records-force-upload-info').show();
		}, function(){
			$('#records-force-upload-info').hide();
		});
	this.pages().get('records').find('button#records-export').button({'icons': {'primary':"ui-icon-suitcase"}})
		.click(function(){
			gui.alert('Sorry, this button is not working yet.')
		})
		.hover(function(){
			$('#records-export-info').show();
		}, function(){
			$('#records-export-info').hide();
		});

	$(document).on('save', 'form.jr', function(e, formList){
		console.debug('save event detected with new formlist: '+formList);
		that.updateRecordList(JSON.parse(formList));
	});

	$(document).on('setsettings', function(e, settings){
		console.debug('settingschange detected, GUI will be updated with settings:');
		console.debug(settings);
		that.setSettings(settings);
	});

	// handlers for application settings [settings page]
	this.pages().get('settings').on('change', 'input', function(){
		var name, value;
		console.debug('settings change by user detected');
		name = $(this).attr('name');
		value = ($(this).is(':checked')) ? $(this).val() : '';
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

};

//update the survey forms names list
GUI.prototype.updateRecordList = function(recordList, $page) {
	"use strict";
	var name, date, clss, i, icon, $list, $li,
		finishedFormsQty = 0,
		draftFormsQty = 0;

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
			date = new Date(recordList[i].lastSaved).toDateString();
			if (recordList[i].ready === true){
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
	}
	else{
		$('<li class="no-click">no locally saved records found</li>').appendTo($list);
	}
// *	OLD*	else if (result.field(2) == 2) {
// *	OLD*		color = 'gray';
	// update status counters
	//pageEl.find('#forms-saved-qty').text(recordList.length);
	$page.find('#records-draft-qty').text(draftFormsQty);
	$page.find('#records-final-qty').text(finishedFormsQty);
};



