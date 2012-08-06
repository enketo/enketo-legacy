
/* !Storage Class */
/**
 * @constructor
 * Function (Class): Storage
 * 
 * description
 * 
 * Returns:
 * 
 *   return description
 */
function StorageLocal(){

	var FORBIDDEN_KEYS = ['settings','temporary','null','history', 'Firebug', 'undefined', 'bookmark']; // ?? temporary going to be used?
	
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
		return FORBIDDEN_KEYS;
	}
		
	// saves a data object in JSON format (string)
	// ADD CONSIDER separating this function for surveyData and other record types as there seems very little that is shared between record types
	this.setRecord = function(data, oldKey, overwrite) { 
		var key;
		var recordType = data['recordType']; // ''surveyData' or 'settings' or [future type]
		//console.log('recordType detected: '+recordType); // DEBUG
		
		if (recordType === 'surveyData'){
			key = data[form.KEY_NAME];
		}
		else {
			key = recordType;
		}
		if (key){
			key = $.trim(key); //removes leading and trailing whitespace;
		}
		if (oldKey){
			oldKey=$.trim(oldKey);
		}
		else{
			oldKey = null; // solves issue with IE
		}
		//console.log('key set to: '+key); // DEBUG
		//console.log('old key was: '+oldKey); // DEBUG
		
		if(overwrite !== true){
			overwrite = false; //if no overwrite argument is provided or doesn't have value true
		}
		//console.log('overwrite:'+overwrite); // DEBUG
		
		// ADD: CATCH ERROR WHEN LOCALSTORAGE SPACE IS FULL
		
		if (recordType === 'surveyData' && !key){
			return 'requireKey'; // ADD: require this key to be alphanumeric?
		}
		if (recordType === 'surveyData' && isForbiddenKey(key)){
		    return 'forbiddenKey';
		}
		if (recordType === 'surveyData' && isExistingKey(key)) {	
			// if the record has an existing key, but was not loaded from the store with this key, do not overwrite
			if (oldKey !== key && overwrite === false) {	
				return 'existingKey';
			}
		}
		try {
			// add a time stamp
			data['lastSaved'] = (new Date()).getTime();	
			//console.log('lastSaved: '+data['lastSaved']);
		    localStorage.setItem(key, JSON.stringify(data));
		    //if the record was loaded from the store (oldKey != null) and the key's value was changed during editing, delete the old record
		    if (oldKey !== null && oldKey!=='' && oldKey !== key){
		    	//console.log('going to remove old record with key:' + oldKey);
		    	if(overwrite){
		    		this.removeRecord(oldKey); 
		    	}
		    }
		    return 'success';
		}
		catch(e){
			console.log('error in store.setData:'+e.message);
		    return 'error';
		}	
	};
	
	// returns form data as an object
	this.getRecord = function(key){ 
		var record;
		try{
			record = JSON.parse(localStorage.getItem(key)); 
			//console.log('found data:'+JSON.stringify(data)); //DEBUG
			return record;// returns null if item cannot be found?
		}
		catch(e){
			console.log('error with loading data from store: '+e.message);
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
	
	//returns an ordered array of objects with form keys and final variables {{"key": "name1", "final": true},{"key": "name2", etc.
	this.getFormList = function(){ 
		var formList=[], ready, record;
		var data = this.getRecordCollection('surveyData');
		//console.log('data received:'+JSON.stringify(data)); // DEBUG
		for (var i in data){
 		    record = data[i];
 		    if(record.ready === 'true' || record.ready === true){
 		    	ready = true;
 		    	//console.log('final variable of '+key+' is true'); // DEBUG
 		    }
 		    else {
 		    	ready = false;
 		    	//console.log('final variable of '+key+' is true'); // DEBUG
 		    }
 		    formList.push({"key": record.key, "final": ready, "lastSaved":record.lastSaved});
 		}	
 		//console.log('formList returned with '+formList.length+' items'); //DEBUG
 			
 		//order formList by lastSaved timestamp
 		formList.sort(function(a,b){
 			return b.lastSaved-a.lastSaved;
 		});
		return formList; //returns empty object if no form data in storage or error was thrown	
	};	
	
	// retrieves all data 
	this.getRecordCollection = function(recordType, finalOnly){ 
		var i, message, choices;
		if (!recordType){
			//default dataType;
			recordType = 'surveyData';
		}
		var data=[], key;
		var record = {};
		try{
			//console.log(localStorage.length+' records found'); // DEBUG
			for (i=0; i<localStorage.length; i++) { 
				key = localStorage.key(i);				
 				record = localStorage.getItem(key);  
 				// get record				
 				try{
 					record = JSON.parse(record);
 					/* although the key is also available as one of the record parameters
						this should not be relied upon and the actual storage key should be used */
 					record.key = key;
					if (record.recordType === recordType){
						//console.log('this record is surveyData: '+JSON.stringify(record)); // DEBUG
						if (finalOnly && (record.ready === 'true' || record.ready === true) && (record.key != form.getKey()) ){
							data.push(record);
						}
						else if (!finalOnly){
							data.push(record);
						}
					}
				}
				catch(e){
					console.log('record found that was probably not in the correct JSON format'+
						' (e.g. Firebug settings or corrupt record) (error: '+e.message+'), record was ignored');
				}	
			}
		}
		catch(e){
			console.log('error with retrieving all survey data data from storage');
			data = [];
		}
		//console.log('getRecordCollection() returns: '+JSON.stringify(data)); // DEBUG
		return data; 
	};
	
	
	// MOVE TO STORE?
	//function to get settings from the store - all settings or one particular setting
	this.getSettings = function(name){
		var settings={};
		var settingsRec = this.getRecord('settings'); 
		//console.log('settings record:'+settingsRec);
		if (settingsRec){
			settings = settingsRec; 
		}
		else {
			settings = DEFAULT_SETTINGS;
		}
		if (name){
			settings = settings[name] // still to be tested
		}
		// console.log('returning settings: '+settings); //DEBUG
		return settings;
	}

	

	// private function to check if key is forbidden
	function isForbiddenKey(k) {
		var i;
		for (i=0 ; i<FORBIDDEN_KEYS.length ; i++){
			if (k === FORBIDDEN_KEYS[i]){
				return true;
			}
		}
		return false;
	}

	// private function to check if the key exists
	function isExistingKey(k) {
		if (localStorage.getItem(k)){
			//console.log('existing key');// DEBUG
			return true;
		}
		//console.log('not existing key');// DEBUG
		return false;
	}
	


}