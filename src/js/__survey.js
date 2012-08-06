//
/* Global Variables and Constants -  CONSTANTS SHOULD BE MOVED TO CONFIG FILE AND ADDED DYNAMICALLY*/
var form, connection, cache, SURVEY_FORM_ID;
var jrDataStr; //initial store of data format
var FORM_FORMAT_URL = 'survey_format';
var CONNECTION_URL = 'checkforconnection.txt';
var DATA_RECEIVER_URL = 'data/upload';
var MODERN_BROWSERS_URL = 'modern_browsers';
var GEARS_MANIFEST_URL = 'manifest/gears';

DEFAULT_SETTINGS = {'settings-auto-upload':true, 'settings-button-location': 'bottom', 'settings-auto-notify-backup':false };
//var MAX_QTY_SAVED_FORMS = 50;
//ßvar SURVEY_FORM_ID = 'survey-form';
var CACHE_CHECK_INTERVAL = 3600*1000;
var showFormList, checkForOpenForm, updateConnectionStatus, getSettings;//,
//loadForm, deleteForm, setSettings;initSaveFormsToFile, 
// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function() { 
	store = new StorageLocal();
	form = new Form('form.jr:eq(0)', jrDataStr);
	connection = new Connection();
	cache = new Cache();
	
	// check if localStorage is supported and if not re-direct to browser download page
	if (!store.isSupported()){
	//if(Modernizr.localStorage){
		//console.log('redirect attempt because of lack of localStorage support'); // DEBUG
		window.location = MODERN_BROWSERS_URL;
	}
	else{	
		gui.setBrowserSupport({'local-storage':true});
	}
	
	//best to place this after localStorage check, so that IE7 users with Gears 
	//will be re-directed immediately before asking whether they allow Gears to store data
	cache.init();
	console.log('cache initialized');
	var formFormat;
	// get form format from json file and build the survey form elements
	var request;
//	if (window.XMLHttpRequest){
//  			  request=new XMLHttpRequest();
//  			request.open("GET", FORM_FORMAT_URL, false); //not asynchronous!!
//  			request.send();
//  			if (request.responseText === 'error'){
//  				console.log('This survey does not exist or has not been published yet');
//  			}
//  			else if (request.responseText && request.responseText!=''){
//  				formFormat = JSON.parse(request.responseText);
//  				//formFormat = request.responseText; //maybe do check to see if responseText is in XML format?
//  				console.log('loaded form format from the json file:'+JSON.stringify(formFormat));
//  			}
//  			else {
//  				console.log('Error occurred while loading form format');
//  			}
//  	}
//	var formBuiltSuccessfully;
//	if (formFormat){
//		formBuiltSuccessfully = form.init(formFormat);
//	}
	
	//console.log('form built successfully?: '+formBuiltSuccessfully); // DEBUG
	
//	if(formBuiltSuccessfully){
		
		
		//$('header #survey-info').text(form.COUNTRY+' '+form.SECTOR+' '+form.YEAR+' '+form.SURVEY_NAME);
		
		// initialize the GUI object
		gui.init();
		form.init();
		connection.init(); //should be called after form format is loaded
		//initialize file export/backup function
		//initSaveFormsToFile(); // CHECK SAFARI OS X BUG
		
		// application cache for launching application offline
		if (cache.isSupported()){
			var bookmark, message, choices, shown;
			gui.setBrowserSupport({'offline-launch':true}); 
			
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
			    	store.setRecord({"recordType":"bookmark", "shown": shown});
			    }, 5*1000)
			}
			
			//check for updated cache
			checkCache();
			
			// Check for an updated manifest file regularly and refresh cache if necessary.
			window.setInterval(function(){
				checkCache();
			}, CACHE_CHECK_INTERVAL);
			
		}
		else{ // if applicationCache is not supported
			message = 'Offline application launch not natively supported by your browser. '+
					'You can use it without this feature or see options for resolving this';
			choices = {
				posButton : 'Show options',
				negButton : 'Use it',
				posAction : function(){ window.location = MODERN_BROWSERS_URL; }
			}
			gui.confirm(message, choices,'Browser requires plugins'); 
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
});

function checkCache(){
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
	}, 30*1000) //it may take a while for the resources to download
}

function loadForm(formName, confirmed){
	var message, choices;
	//console.log('loadForm called'); // DEBUG
	if (!confirmed && form.hasBeenEdited()){
		message = 'Would you like to proceed without saving changes to the form you were working on?';
		choices = {
			'posAction': function(){ loadForm("'+formName+'", true); }
		}
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

function saveForm(overwrite, removeChecked){
	//console.log('saveForm called'); // DEBUG
	var oldKey, result, message, choices;
	var data = form.getData(SURVEY_FORM_ID);
	
	if(!overwrite){ //necessary??
		overwrite=false;
	}
	if (!removeChecked){ //necessary??
		removeChecked = false;
	}
	//console.log ('data: '+JSON.stringify(data)); //DEBUG
	if (data !== null){
		oldKey = form.getKey();
		console.log('old key is: '+oldKey); // DEBUG
		console.log('new key is: '+data[form.KEY_NAME]); // DEBUG
		
		if (oldKey && oldKey!='' && oldKey!=data[form.KEY_NAME] && !removeChecked)
		{
			message = form.KEY_LABEL+' has changed. Would you like to delete the record saved under the old '+form.KEY_LABEL+'?';
			choices = {
				posButton : 'Yes, delete',
				negButton : 'No, keep',
				posAction : function(){ saveForm(true, true); },
				negAction : function(){ saveForm(false, true); }
			}
			gui.confirm(message, choices, 'Delete old Record?');
		}	
		else {
			result = store.setRecord(data, oldKey, overwrite);
		
			//console.log('result: '+result); // DEBUG
			if (result === 'success'){			
			    gui.showFeedback('Form with name "'+data[form.KEY_NAME]+'" has been saved.', 2);	
			    //set the new custom html5 data attribute stored-with-key
			    form.setKey(data[form.KEY_NAME]);
			    form.setEditStatus(false);
			    $('button#delete-form').show();	
			}
			else if (result === 'requireKey'){
			    gui.alert (form.KEY_LABEL+' is required. Please provide this.');
			}
			else if (result === 'existingKey'){
				message = 'Record with this '+form.KEY_LABEL+' already exists. Would you like to overwrite existing record? ';
				choices = {
					posButton : 'Yes, overwrite',
					posAction : function(){ saveForm(true); },
					negAction : function(){ gui.showFeedback("Form was not saved."); }
				}
			    gui.confirm(message, choices);
			}
			else if (result === 'forbiddenKey'){
			    gui.alert ('This '+form.KEY_LABEL+' is not allowed. Please change it');
			    gui.showFeedback ('Form was NOT saved.');
			}
			else {
			    gui.showFeedback('Error occurred. Form was NOT saved.');
			}
		}
	}
	// code not actually reachable because the data is never null
	else {
		gui.showFeedback('Nothing to save.'); //ADD error with getting data from form?
	}
	return;
}

function resetForm(confirmed){
	var message, choices;
	if (!confirmed && form.hasBeenEdited()){
		message = 'Would you like to reset without saving changes to the form you were working on?';
		choices = {
			posAction : function(){ resetForm(true); }
		}
		gui.confirm(message, choices);
	}
	else {
		form.reset();
	}
}

function deleteForm(confirmed) {
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
			}
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
		else if (window.google && google.gears){
			try{
				var gearsServer = google.gears.factory.create('beta.localserver');
				appCache = gearsServer.createManagedStore('rapaide_store');
				appCache.manifestUrl = GEARS_MANIFEST_URL;
				if (appCache){
					cacheType='gearsCache';
				}
				loadedVersion = appCache.currentVersion;
				//checkForUpdate();
				var timerId = window.setInterval(function() {
 					// When the currentVersion property has a value, all of the resources
 					// listed in the manifest file for that version are captured. 
 					if (loadedVersion) {
 				 		window.clearInterval(timerId);
 				  		console.log('loaded Gears cache with version:'+loadedVersion);
 				  		error = null;
 					} 
 					else if (appCache.updateStatus == 3) {
 				  		console.log('Error: ' + appCache.lastErrorMessage); // DEBUG
 				 	 	error = appCache.lastErrorMessage;
 				 	 	window.clearInterval(timerId); //TEST this by creating incorrect manifest URL
 					}
 				}, 500);  
 			}
 			catch(e){
 				console.log ('Gears does not have permission or other Gears initialization error');
 			}
		}
	}
	
	this.isSupported = function(){
		return (cacheType==='html5Cache' || cacheType==='gearsCache') ? true : false;
	}
	
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
					console.log('error thrown during cache update. error name: '+e.name+'  message: '+e.message)
				};
				//event listener will update variable 'update';
				break;
			case 'gearsCache' :
				// Checking for updates will also happen regularly automatically even if not explicitly called
				appCache.checkForUpdate();				
				break;
		}
		return;
	}

	this.updateReady = function(){
		if (cacheType==='gearsCache'){
			//console.log ('loadedVersion:'+loadedVersion); //DEBUG
			//console.log ('currentVersion:'+appCache.currentVersion); //DEBUG
			update = (loadedVersion != '' && loadedVersion != appCache.currentVersion) ? true : false;
		}
		console.log('updateReady() returns: '+update); //DEBUG
		return update;
	}

	this.getError = function(){
		return error;
	}

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
	}
	
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
	}
	
	this.getTableName = function(){
		return tableName;
	}
	
	//this.setAutoUpload = function(upload){
	//	autoUpload = upload;
	//}
	
	// provides the connection status, should be considered: 'seems online' or 'seems offline'
	// NEEDS IMPROVEMENT. navigator.onLine alone is probably not appropriate because for some browsers this will
	// return true when connected to a local network that is not connected to the Internet.
	// However, this could be the first step. If (true) a request is sent to the server to check for a connection
	// @online = used to force a status (necessary?)
	function checkOnlineStatus(online){
		//console.log('checking connection status, status before check is: '+onlineStatus); // DEBUG	
		if (typeof online == 'undefined' || (online !== true && online !== false) ){
			//navigator.onLine not working properly in Firefox
			//if (navigator.onLine){
				//NOTE that GET is not working (by default) in a CodeIgniter setup!!
				$.ajax({
				type:'POST',
				url: CONNECTION_URL, 
				cache: false,
				dataType: 'text',
				timeout: 3000,
				success: function(){
					setStatus(true);
					},		
				error: function(){
					setStatus(false)
					}
				});
			//}
			//else {
				//setStatus(false);
			//}
		}
		//forced status
		else {
			setStatus(online);
		}
	}
	
	function setStatus(online){
		var oldStatus = onlineStatus;
		onlineStatus = online;
		if (onlineStatus !== oldStatus){
			console.log('status changed to: '+onlineStatus+', triggering window.onlinestatuschange');
			$(window).trigger('onlinestatuschange', onlineStatus);
		}
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
			if (dataObj.surveyForms.length>0){
				console.log('attempting upload with override: '+override+' Changing uploadOngoing to true'); // DEBUG
				uploadOngoing = true;
				console.log('data to be send: '+JSON.stringify(dataObj)); // DEBUG
				$.ajax({
					type: 'POST',
					url: DATA_RECEIVER_URL,
					data: dataObj,
					success: function(result){
						console.log('upload, received back from server: '+JSON.stringify(result)); // DEBUG
						// ADD some kind of feedback to user if it fails but this would mean setting interval outside of Connection class?
						if (result.inserted){
							for (var i=0 ; i<result.inserted.length ; i++){
								store.removeRecord(result.inserted[i]);
								insertedStr += result.inserted[i];
								if (i<result.inserted.length-1){
									insertedStr += ', ';
								}
								//console.log('tried to remove record with key: '+result.inserted[i]);
							}
							// CHANGE?
							gui.showFeedback('Succesfully uploaded forms: '+insertedStr+'.');
							gui.updateRecordList($('article[id="records"]'));
						}
						else {
							if (override) {
								gui.showFeedback('Upload failed on server');
							}
						}	
					},
					error: function(){
						if (override){
							gui.showFeedback('Upload failed. Server may be unavailable or client may be offline.');
						}
					},
					complete: function(){
						console.log('completed ajax call, changing uploadOngoing variable to false'); // DEBUG
						uploadOngoing = false;
					},
					dataType: 'json'
				});
			}
			else { //nothing to send
				//console.log('nothing to upload, (uploadOngoing: '+uploadOngoing+')');
				//if the function was called with override, inform user
				if (override) {
					gui.showFeedback('Nothing marked "final" to upload (or record is currently open).');
				}
			}
		}
	}


}