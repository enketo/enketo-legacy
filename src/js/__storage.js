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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true*//*global gui, store, Form, DEFAULT_SETTINGS, Modernizr*/

/* !Storage Class */
/**
 *
 *
 * Function (Class): Storage
 *
 * description
 *
 * Returns:
 *
 *   return description
 *
 * @constructor
 */
function StorageLocal(){
	"use strict";
	var RESERVED_KEYS = ['__settings', 'null','__history', 'Firebug', 'undefined', '__bookmark', '__counter'];

	var localStorage = window.localStorage;
	// Could be replaced by Modernizr function if Modernizr remains used in final version
	this.isSupported = function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	};
	
	//used for testing
	this.getForbiddenKeys = function(){
		return RESERVED_KEYS;
	};
		
	// saves a data object in JSON format (string)
	// ADD CONSIDER separating this function for surveyData and other record types as there seems very little that is shared between record types
	/**
	 * [setRecord description]
	 * @param {string} newKey    [description]
	 * @param {Object.<(string|number), (string|boolean|number)>} record     [description]
	 * @param {boolean=} del [description] used to change name of existing record and delete old record
	 * @param {boolean=} overwrite [description] overwrite is only used when there is *another* record with the same new name (not when simply updating current form)
	 * @param {?string=} oldKey    [description]
	 * @return {string}
	 */
	this.setRecord = function(newKey, record, del, overwrite, oldKey) {
		console.debug('setRecord received record with final: '+record['ready']);
		//console.debug(record);
		//var record = rec;
		if (!newKey || newKey.length < 1){
			console.error('no key provided for record');
			return 'require';
		}
		newKey = newKey.trim();
		oldKey = (typeof oldKey === 'string') ? oldKey.trim() : null;
		overwrite = (typeof overwrite !== 'undefined' && overwrite === true) ? true : false;
		
		// ADD: CATCH ERROR WHEN LOCALSTORAGE SPACE IS FULL
		
		//using the knowledge that only survey data is provided as a "data" property (and is  a string)
		if (typeof record['data'] === 'string' && isReservedKey(newKey)){
			return 'forbidden';
		}
		// if the record has an existing key, but was not loaded from the store with this key, do not overwrite
		if (typeof record['data'] === 'string' && oldKey !== newKey && isExistingKey(newKey) && overwrite !== true) {
			
			//if (oldKey !== newKey && overwrite === false) {
			return 'existing';
			//}
		}
		try {
			//add timestamp to survey data
			if (typeof record['data'] === 'string'){
				record['lastSaved'] = (new Date()).getTime();
				//if (newKey == this.getCounterValue() ){
				localStorage.setItem('__counter', JSON.stringify({'counter': this.getCounterValue()}));
				//}
			}
			//record['ready'] = (Boolean(record['ready']) === true) ? true : false;
			//console.log('lastSaved: '+data['lastSaved']);
			localStorage.setItem(newKey, JSON.stringify(record)); //{
				//"data": record['data'], "ready": record['ready'], "lastSaved":record['lastSaved']
			//}));
			
			console.debug('saved: '+newKey+', old key was: '+oldKey);
			//if the record was loaded from the store (oldKey != null) and the key's value was changed during editing
			//delete the old record if del=true
			if (oldKey !== null && oldKey!=='' && oldKey !== newKey){
				if(del){
					console.log('going to remove old record with key:' + oldKey);
					this.removeRecord(oldKey);
				}
			}
			return 'success';
		}
		catch(e){
			console.log('error in store.setRecord:'+e.message);
			return 'error';
		}
	};
	
	
	/**
	 * Returns a form data record as an object. This is the only function that obtains records from the local storage.
	 * @param  {string} key [description]
	 * @return {*}     [description]
	 */
	this.getRecord = function(key){
		var record;
		try{
			//console.debug('record: '+localStorage.getItem(key));
			record = JSON.parse(localStorage.getItem(key));
			//console.debug('record after parse:');
			//console.debug(record);
			//console.log('found data:'+JSON.stringify(data)); //DEBUG
			return record;//{key: key, data: record['data'], ready: record['ready'], lastSaved: record['lastSaved']};// returns null if item cannot be found
		}
		catch(e){
			console.error('error with loading data from store: '+e.message);
			return null;
		}
	};

	// removes a record
	this.removeRecord = function(key){
		try{
			localStorage.removeItem(key);
			//console.log('removed record with key:'+key) // DEBUG
			return true;
		}
		catch(e){
			console.log('error with removing data from store: '+e.message);
			return false;
		}
	};

//	this.setRecordStatus = function (key, status){
//		var record = this.getRecord(key);
//		record.ready = status;
//		this.setRecord(key, record, false, true, key);
//	};
	
	/**
	 * returns an ordered array of objects with form keys and final variables {{"key": "name1", "final": true},{"key": "name2", etc.
	 * @return { Array.<Object.<string, (boolean|string)>>} [description]
	 */
	this.getFormList = function(){
		var i, ready, record,
			formList=[],
			records = this.getSurveyRecords(false);
		//console.log('data received:'+JSON.stringify(data)); // DEBUG
		for (i=0 ; i<records.length ; i++){
			record = records[i];
			//record['ready'] = (record['ready']=== 'true' || record['ready'] === true) ? true : false;
			formList.push({key: record['key'], 'ready': record['ready'], 'lastSaved': record['lastSaved']});
		}
		console.debug('formList returning '+formList.length+' items'); //DEBUG
		//order formList by lastSaved timestamp
		formList.sort(function(a,b){
			return b['lastSaved']-a['lastSaved'];
		});
		//console.debug('formlist: '+JSON.stringify(formList));
		return formList;//returns empty object if no form data in storage or error was thrown
	};
	
	/**
	 * retrieves all survey data
	 * @param  {boolean=} finalOnly   [description]
	 * @param  {?string=} excludeName [description]
	 * @return {Array.<Object.<(string|number), (string|boolean)>>}             [description]
	 */
	this.getSurveyRecords = function(finalOnly, excludeName){
		var i, key,
			records = [],
			record  = {};
		finalOnly = finalOnly || false;
		excludeName = excludeName || null;
		//try{
			//console.log(localStorage.length+' records found'); // DEBUG
			for (i=0; i<localStorage.length; i++) {
				key = localStorage.key(i);
				//console.debug('found record with with key:'+key);
				record = this.getRecord(key);//localStorage.getItem(key);
				// get record - all non-reserved keys contain survey data
				if (!isReservedKey(key)){
					//console.debug('record with key: '+key+' is survey data');
					try{
						//record = JSON.parse(record);
						//console.debug('record:');
						//console.debug(record);
						/* although the key is also available as one of the record properties
							this should not be relied upon and the actual storage key should be used */
						record.key = key;
						//record['ready'] = record['ready'];
						//record['lastSaved'] = record['lastSaved'];
						//if (record.recordType === recordType){
						console.debug('this record is surveyData: '+record.key); // DEBUG
						console.debug('excludename: '+excludeName);
						console.debug('record.ready: '+record['ready']+' type:'+typeof record['ready']);
						//=== true comparison breaks in Google Closure compiler. Should probably be called with --output_wrapper to prevent this (but not possible in ANT?)
						//alternatively, the complete code could perhaps be wrapped in an anonymous function (except declaration of globals?)
						if (key !== excludeName && (!finalOnly || record['ready'] === 'true' || record['ready'] === true )){//} && (record.key !== form.getKey()) ){
							records.push(record);
						}
					}
					catch(e){
						console.log('record found that was probably not in the correct JSON format'+
							' (e.g. Firebug settings or corrupt record) (error: '+e.message+'), record was ignored');
					}
				}
			}
		//}
		//catch(e){
		//	console.log('error with retrieving all survey data data from storage');
		//	data = [];
		//}
		//console.debug('getSurveyRecords() returns: '+JSON.stringify(records)); // DEBUG
		return records;
	};

	/**
	 * [getSurveyDataArr description]
	 * @param  {boolean=} finalOnly   [description]
	 * @param  {?string=} excludeName the (currently open) record name to exclude from the returned data set
	 * @return {Array.<Object.<string, string>>}             [description]
	 */
	this.getSurveyDataArr = function(finalOnly, excludeName){
		var i, records,
			dataArr = [];
		finalOnly = finalOnly || true;
		records = this.getSurveyRecords(finalOnly, excludeName);
		//console.debug('getSurveyDataArr will build array from these records: '+JSON.stringify(records));
		for (i=0 ; i<records.length ; i++){
			dataArr.push({name: records[i].key, data: records[i]['data']});//[records[i].key, records[i].data]
		}
		//console.debug('returning data array: '+JSON.stringify(dataArr));
		return dataArr;
	};

	/**
	 * [getSurveyDataOnlyArr description]
	 * @param  {boolean=} finalOnly [description]
	 * @return {?Array.<string>}           [description]
	 */
	this.getSurveyDataOnlyArr = function(finalOnly){
		var i,
			dataObjArr = this.getSurveyDataArr(finalOnly),
			dataOnlyArr =[];
		for (i=0 ; i<dataObjArr.length ; i++){
			dataOnlyArr.push(dataObjArr[i].data);
		}
		return (dataOnlyArr.length>0) ? dataOnlyArr: null;
	};

	/**
	 * [getSurveyDataXMLStr description]
	 * @param  {boolean=} finalOnly [description]
	 * @return {?string}           [description]
	 */
//	this.getSurveyDataXMLStr = function(finalOnly){
//		var i,
//			dataObjArr = this.getSurveyDataArr(finalOnly),
//			dataOnlyArr =[];
//		for (i=0 ; i<dataObjArr.length ; i++){
//			dataOnlyArr.push(dataObjArr[i].data);
//		}
//		return (dataOnlyArr.length>0) ? '<exported>'+dataOnlyArr.join('')+'</exported>' : null;
//	};
	
	
	// MOVE TO STORE?
	//function to get settings from the store - all settings or one particular setting
	//this.getSettings = function(name){
//		var settings={};
//		var settingsRec = this.getRecord('settings');
//		//console.log('settings record:'+settingsRec);
//		if (settingsRec){
//			settings = settingsRec;
//		}
//		else {
//			settings = DEFAULT_SETTINGS;
//		}
//		if (name){
//			settings = settings[name]; // still to be tested
//		}
//		// console.log('returning settings: '+settings); //DEBUG
//		return settings;
//	};

	/**
	 * private function to check if key is forbidden
	 * @param  {string}  k [description]
	 * @return {boolean}   [description]
	 */
	function isReservedKey(k) {
		var i;
		for (i=0 ; i<RESERVED_KEYS.length ; i++){
			if (k === RESERVED_KEYS[i]){
				return true;
			}
		}
		return false;
	}

	/**
	 * private function to check if the key exists
	 * @param  {string}  k [description]
	 * @return {boolean}   [description]
	 */
	function isExistingKey(k) {
		if (localStorage.getItem(k)){
			//console.log('existing key');// DEBUG
			return true;
		}
		//console.log('not existing key');// DEBUG
		return false;
	}
	
	/**
	 * Obtain a new counter string value that is one higher than the previous
	 * @return {?(string|String)} [description]
	 */
	this.getCounterValue = function(){
		var record = this.getRecord('__counter'),
			number = (record && typeof record['counter'] !== 'undefined' && isNumber(record['counter'])) ? Number(record['counter']) : 0,
			numberStr = (number+1).toString().pad(4);
		//this.setRecord('__counter', numberStr);
		return numberStr;
	};

}

function isNumber(n){
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Settings class depends on Store Class
 *
 * @constructor
 */
function Settings(){
	"use strict";
}

Settings.prototype.init = function(){
	"use strict";
	var i, value, name,
		settings = this.get(),
		that = this;
	
	//set settings (loose coupling with GUI)
	$(document).trigger('setsettings', settings);
	//perform actions based on settings at launch
	//for (var prop in settings){
		
	//}
};

//communicates with local storage
/**
 * [get description]
 * @return {Object.<string, (boolean|string)>}         [description]
 */
Settings.prototype.get = function(){
	"use strict";
	//DISABLED SETTINGS IN LOCAL STORAGE AS IT IS NOT REQUIRED FOR NOW
	//return store.getRecord('__settings') || DEFAULT_SETTINGS;
	return DEFAULT_SETTINGS;
};

/**
 * [getOne description]
 * @param  {string} setting [description]
 * @return {?(string|boolean)}         [description]
 */
Settings.prototype.getOne = function(setting){
	var settings = this.get();//store.getRecord('__settings') || DEFAULT_SETTINGS;
	return (typeof setting !== 'undefined' && typeof settings[setting] !== 'undefined') ? settings[setting] : null;
};

/**
 * Communicates with local storage and perform action linked with setting. Called by eventhandler in GUI.
 *
 * @param {string} setting [description]
 * @param {string|boolean} value   [description]
 */
Settings.prototype.set = function(setting, value){
	"use strict";
	var result,
		settings = this.get();
	console.debug('going to store setting: '+setting+' with value:'+value);
	settings[setting] = value;
	result = store.setRecord('__settings', settings);
	//perform action linked to setting
	if (typeof this[setting] !== 'undefined'){
		this[setting](value);
	}
	return (result === 'success' ) ? true : console.error('error storing settings');
};