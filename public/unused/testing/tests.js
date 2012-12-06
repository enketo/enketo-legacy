/** MANUAL **/

/*
test redirect for IE6, IE7 without local storage

test message and functionality for browser without applicationCache support (IE8, IE9)

test applicationCache:
	- update manifest and change something visual in html file, load application, (refresh), updated?
	- update manifest and make it malformed
	- launch application online, disable network interface, refresh, still working?
	- launch application offline, working?, any errors reported in log?
	- DIFFICULT: update manifest, trigger download of new resources but disable network interface DURING download, still working?

*/


/** UNIT TESTS **/

//Gobal variables accessible to units being tested (e.g. to functions in Storage.js

//var form = {}; //mock
//var $form = $('body');

//form.KEY_NAME = 'some kind of key name'; 
//var FORM_FORMAT_URL = '../survey_format';

$(document).ready(function(){ 
	report = console;
	//store = new Storage();
	/*	
	if (window.XMLHttpRequest){
			request=new XMLHttpRequest();
			request.open("GET", FORM_FORMAT_URL, false); //not asynchronous!!
			request.send();
			if (request.responseText === 'error'){
				console.log('This survey does not exist or has not been published yet');
			}
			else if (request.responseText && request.responseText!=''){
				formFormat = JSON.parse(request.responseText);
				console.log('loaded form format from the json file');
			}
			else {
				console.log('Error occurred while loading form format');
			}
	}
	*/
	/*
	QUnit.begin = function(){
		this.storedData = new StoredData; // debug.js
		this.storedData.remove();
	}
	QUnit.done = function(){
		this.storedData.putBack();
	}
	
		test('local storage supported', function(){
			ok(store.isSupported,'this browser supports localStorage');
		});
	*/
	/*** MODULE ***/
	// saving survey and settings data in local storage
	/*module("LocalStorage", {
//		setup: function(){
//			this.storedData = new StoredData();
//			this.storedData.remove();
//		},
//		teardown: function(){
//			this.storedData.putBack();
//		}
	});
	
		test('saveData', function(){
			
			var testData={'field1': 'field data', 'field2':'some more data'};
			var recordTypes=['surveyData', 'settings'];
			var keys={
				'empty': [null, '', ' ', '  '], 
				'forbidden': store.getForbiddenKeys(),
				'valid': ['abcd', 'abd, dsf', 'sdf; sf'],
				'existing': ['myExistingKey']
				};
			//var oldKeys=[null,'',' ']; ADD!
			var overwrites = { 
				'false' : [false, 'false', 'anything else'],
				'true' : [true]
				};
			var expected;
			
			expect(recordTypes.length
				*(keys['empty'].length+keys['forbidden'].length+keys['valid'].length+keys['existing'].length)
				*(overwrites['false'].length+overwrites['true'].length)
			);
			
			//first create a record with existing key
			testData[form.KEY_NAME]=keys['existing'][0];
			testData['recordType']='surveyData';
			store.setRecord(testData, '', false);
			
			for (var i in recordTypes){ // maybe this test shouldn't go through this loop for recordType = settings...
				testData['recordType']=recordTypes[i]; 		
				for (var j in keys){
					if (recordTypes[i]==='surveyData'){
						switch(keys[j]){
							case keys['empty']:
								expected = 'requireKey';
								break;
							case keys['forbidden']:
								expected = 'forbiddenKey';;
								break;
							case keys['existing']:
								expected = 'existingKey';
								break;	
							case keys['valid']:
								expected = 'success';
								break;	
						}
					}
					else expected = 'success';
					if (keys.hasOwnProperty(j)){
					    for (var k in keys[j]){
					    	//console.log('keys[j][k]='+keys[j][k]);
					    	testData[form.KEY_NAME]=keys[j][k];
					    	for (var l in overwrites){
					    		if (overwrites[l]===overwrites['true']){
					    			if (expected === 'existingKey'){
					    				expected = 'success';
					    			}
					    		}
					    		for (var m in overwrites[l]){
					    			var result=store.setRecord(testData, '',overwrites[l][m]);
					    			equal(result,expected, 
					    			'passed with recordType:'+testData['recordType']+
					    			' and key:'+testData[form.KEY_NAME]+' and overwrite:'+overwrites[l][m]+' and empty oldKey');
					    			// and clean up by immediately removing written test records
					    			if(result==='success'){
					    				//store.removeData(testData[form.KEY_NAME]);
					    				if (recordTypes[i]==='settings'){
					    					localStorage.removeItem('settings');
					    				}
					    				else{
					    					localStorage.removeItem(testData[form.KEY_NAME]);
					    				}
					    			}
					    		}
					    	}
					    }	
					}
				}
				// clean up
				//store.removeData(keys['existing'][0]);
				//console.log('going to remove: '+keys['existing'][0]) // DEBUG
				localStorage.removeItem(keys['existing'][0]); // bug in IE9
				//console.log('removed: '+keys['existing'][0]); // DEBUG
				
			}
			
		});
		
		// ADD: form loaded from store and saved (a. leaving key the same, b. changing key to new allowed value (pass: old record should be deleted), c. changing key to forbidden, d. changing key to other existing key (pass: old record delete, new record overwrites other record), e. form has no key)
	
	
		// this is not really a unit test but it checks browser storage space
		test ('storage limits', function(){
			var record={}, key, keys=[], success, charsStored=0, charsRecord=0, l, lengthData;
			
			expect(3);
			
			//test that should raise an exception and collects info on available storage space (expressed in characters)
			raises(function(){
				for (var i=0; i<250; i++){
					record.recordType = 'surveyData';
					charsRecord = 20;
					
					l = Math.floor(Math.random()*25+1);
					record[form.KEY_NAME] = getRandomString(l); // different random lengths
					charsRecord += l;
					
					l = Math.floor(Math.random()*15+1);
					key = getRandomString(l);
					keys.push(key); // builds an array of keys so they can be removed later.
					charsRecord += l;
					l = Math.floor(Math.random()*50+1);
					record[key] = getRandomString(l);
					charsRecord += l;
					
					// 25 additional fields per record
					for (var j=0 ; j<25 ;j++){
						l = Math.floor(Math.random()*15+1);
						lengthData = Math.floor(Math.random()*100+1);
						record[getRandomString(l)] = getRandomString(lengthData);
						charsRecord = charsRecord + l + lengthData;
					} 
					
					localStorage.setItem(key, JSON.stringify(record));	
					charsStored += charsRecord;
					//console.log ('characters stored so far:'+charsStored); // DEBUG
				};
			}, 'localStorage space filled to the max until error "QUOTA_EXCEEDED_ERR" was thrown.'+
				'If it fails this is likely a good thing!')
			//It is not 100% accurate because any already present data that is not "surveyData" is not counted.
			//Moreover, it increments per record (which is about 1,500 characters).
			
			//real tests
			ok(charsStored>72000, 'passes if more than 80,000 characters can be stored in localStorage');
			notEqual(charsStored, -1, 'to easily get a value of the amount of characters that can be stored ('+charsStored+')');
			// Firefox on OS X and IE9 on W7 appear to have highest default storage space available
			// Opera appears to have the lowest default storage space available
			// Both Firefox and Opera on OS X ask the user to increase storage space! = VERY GOOD
			
			// remove added records
			for (i=0; i<keys.length; i++){
				//console.log('removing item with key:'+keys[i])
				localStorage.removeItem(keys[i]);
			}
		
		});

*/
	/*** MODULE ***/
/*
	module ('Retrieving data from localStorage',{
//		setup: function(){
//			this.storedData = new StoredData();
//			this.storedData.remove();
//		},
//		teardown: function(){
//			this.storedData.putBack();
//		}
	});
	
		// if localStorage has no records with recordType 'surveyData', getFormList() should return null
		test ('getFormList() and getRecordCollection() tests', function(){
			
			expect(4);
			
			//test 1
			equal(store.getFormList().length, 0, 'passed if empty object was returned as there were no forms in storage');
					
			// a more complex formList
			addedData=[{'thisfield':'that data', 'lastSaved':345},
				{'thisfield':'more of that', 'lastSaved':300},
				{'thisfield':'even more of that', 'lastSaved':500}
			]
			for (i=0; i<addedData.length; i++){
				addedData[i].recordType='surveyData';
				addedData[i][form.KEY_NAME]='key number '+i;
				//console.log('test is adding data with key: '+addedData[i][form.KEY_NAME]);
				localStorage.setItem(addedData[i][form.KEY_NAME],JSON.stringify(addedData[i]));
			}		
			var formList = store.getFormList();
			// test 2
			equal(formList.length, 3, 'passed if length of form list is 3');
			// test 3
			equal(formList[0].key, 'key number 2', 
				'passed if the item with the latest date (lastSaved) is the first item in the returned array');
			// test 4
			equal(formList[2].key, 'key number 1', 
				'passed if the item with the oldest data (lastSaved) is the last item in the returned array');
			
			// remove last 3 test records
			for (i=0; i<addedData.length; i++){
				localStorage.removeItem('key number '+i);
			}
			
			// ADD TESTS WITH THE DIFFERENT GETRECORDCOLLECITON() VARIABLES
		});
*/	
	/*** MODULE ***/
	module ('Connectivity');
	
		test('navigator.onLine test (not used in app yet)', function(){
			expect(1);
			ok(navigator.onLine, 'passed if navigator.onLine is true, but will fail if client is offline');
		});
		
	
	module ('Form.Data.Node', {
		setup: function(){
			var i, t, dataStr = 
				"<instance>"+
					"<thedata id='something'>"+
						"<nodeA />"+
						"<nodeB>b</nodeB>"+
						"<repeatGroup template=''>"+
							"<nodeC>cdefault</nodeC>"+
						"</repeatGroup>"+
						"<repeatGroup>"+
							"<nodeC />"+
						"</repeatGroup>"+
						"<repeatGroup>"+
							"<nodeC>c2</nodeC>"+
						"</repeatGroup>"+
						"<repeatGroup>"+
							"<nodeC>c3</nodeC>"+
						"</repeatGroup>"+
					"</thedata>"+
				"</instance>";
			form = new Form('<form></form>', "");
			//this.$form = $('body');
			this.data = form.data(dataStr);
			this.form = form.form('nothing'); //just need to instantiate this to get $form variable without calling init()
		},
		teardown: function(){}
	});

	//var i, t, data;//, $form;
		
	test('node.get()', function(){
		
		t = 
		[
			["", null, null, 9],
			["", null, {}, 9],
			//["/", null, {}, 9], //issue with xfind, not important
			[false, null, {}, 9],
			[null, null, {}, 9],
			[null, null, {noTemplate:true}, 9],
			[null, null, {noTemplate:false}, 11],
			[null, null, {onlyTemplate:true}, 1],
			[null, null, {noEmpty:true}, 3],
			[null, null, {noEmpty:true, noTemplate:false}, 4],

			["/thedata/nodeA", null, null, 1],
			["/thedata/nodeA", 1   , null, 0],
			["/thedata/nodeA", null, {noEmpty:true}, 0], //"int"
			["/thedata/nodeA", null, {onlyleaf:true}, 1],
			["/thedata/nodeA", null, {onlyTemplate:true}, 0],
			["/thedata/nodeA", null, {noTemplate:true}, 1],
			["/thedata/nodeA", null, {noTemplate:false}, 1],

			["/thedata/repeatGroup", null, null, 3],
			["/thedata/repeatGroup", null, {onlyTemplate:true}, 1],
			["/thedata/repeatGroup", null, {noTemplate:false}, 4],

			["//nodeC", null, null, 3],
			["/thedata/repeatGroup/nodeC", null, null, 3],
			["/thedata/repeatGroup/nodeC", 2   , null, 1],
			["/thedata/repeatGroup/nodeC", null, {noEmpty:true}, 2],
			["/thedata/repeatGroup/nodeC", null, {onlyleaf:true}, 3],
			["/thedata/repeatGroup/nodeC", null, {onlyTemplate:true}, 0],
			["/thedata/repeatGroup/nodeC", null, {noTemplate:true}, 3],
			["/thedata/repeatGroup/nodeC", null, {noTemplate:false}, 4]
		];
		expect(t.length);
		for (i = 0 ; i<t.length ; i++){
			equal(this.data.node(t[i][0], t[i][1], t[i][2]).get().length,t[i][3], 
				'selector: '+t[i][0]+'   index: '+t[i][1]+',   filter: '+JSON.stringify(t[i][2]));
		}
	});

	test('node.setVal() xml-type validation (no expressions)', function(){
		//$form = $('body');
		t = 
		[
			["/thedata/nodeA", null, null, 'val1', null, true],
			["/thedata/nodeA", null, null, 'val2', 'string', true],
			["/thedata/nodeA", null, null, 'val3', 'somewrongtype', true],
			["/thedata/nodeA", null, null, 'val4', 'int', false],
			["/thedata/nodeA", null, null, 'val5565ghgyuyuy', 'date', false], //Chrome turns val5 into a valid date...
			["/thedata/nodeA", null, null, 'val10HKHJKJKJK', 'datetime', false], //Chrome turns val10 into a valid date..
			["/thedata/nodeA", null, null, 'val11', 'decimal', false],
			["/thedata/nodeA", 0   , null, 'val12', 'string', true],
			["/thedata/nodeA", 1   , null, 'val13', 'string', null], //non-existing node
			["/thedata/nodeA", 0   , null, '14', 'string', true],
			["/thedata/nodeA", 0   , null, 1, 'string', true],
			["/thedata/nodeA", 0   , null, '2', 'int', true],
			["/thedata/nodeA", 0   , null, 3, 'int', true],
			["/thedata/nodeA", 0   , null, '4', 'double', true],
			["/thedata/nodeA", 0   , null, 5, 'double', true],
			["/thedata/nodeA", 0   , null, ['a', 'b', 'c'], 'string', true],
			["/thedata/nodeA", 0   , null, ['d', 'e', 'f', ''], 'string', true],
			["/thedata/nodeA", 0   , null, [], 'string', true],

			//ADD Other Data Types
			
			["/thedata/repeatGroup/nodeC", null, null, 'val', null] //multiple
		];			
		expect(t.length);
		for (i = 0 ; i<t.length ; i++){
			equal(this.data.node(t[i][0], t[i][1], t[i][2]).setVal(t[i][3], null, t[i][4]), 
				t[i][5], 
				'selector: '+t[i][0]+'   index: '+t[i][1]+'    ,   filter: '+JSON.stringify(t[i][2])+
				'    value:'+t[i][3]+',   xmlDataType: '+t[i][4]);
		}

	});
		
	module ('Evaluate XPath Expressions', {
		setup: function(){
			var i, t, dataStr = 
				"<instance>"+
					'<thedata xmlns="http://rapaide.com/testEvaluation" id="testEvaluation">'+
						"<nodeA />"+
						"<nodeB>b</nodeB>"+
						"<repeatGroup template=''>"+
							"<nodeC>cdefault</nodeC>"+
						"</repeatGroup>"+
						"<repeatGroup>"+
							"<nodeC />"+
						"</repeatGroup>"+
						"<repeatGroup>"+
							"<nodeC>c2</nodeC>"+
						"</repeatGroup>"+
						"<repeatGroup>"+
							"<nodeC>c3</nodeC>"+
						"</repeatGroup>"+
					"</thedata>"+
				"</instance>";
			form = new Form('<form></form>', '');
			//this.$form = $('body');
			//form.init();
			this.data = form.data(dataStr);
			this.form = form.form('nothing'); //just need to instantiate this to get $form variable without calling init()
		},
		teardown: function(){}
	});

	//var i, t, data;//, $form;

	test('DataXML.evaluate()', function(){
		
		t = 
		[
			["/thedata/nodeB", "string", null, 0, "b"],
			["../nodeB", "string", "/thedata/nodeB", 0, "b"],
			["/thedata/nodeB", "boolean", null, 0, true],
			["/thedata/notexist", "boolean", null, 0, false]//, IF UNCOMMENT NEXT, SOME KIND OF INFINITE LOOP HAPPENS
			//SOMETHING WRONG WITH TEST LOOP
			//['/thedata/repeatGroup[3]/nodeC', 'string', null, 0, 'c3'],
			//['/thedata/repeatGroup[position()=3]/nodeC', 'string', null, 0, 'c3']
			// add test case where formula with absolute path is evaluated inside a repeat (ie. [x] position gets injected)
		];
		expect(t.length);

		for (i = 0 ; i<t.length ; i++){
			console.debug('i is '+i+ ' out of '+t.length);
			equal(this.data.evaluate(t[i][0], t[i][1], t[i][2], t[i][3]), t[i][4], ('exp: '+t[i][0]+',   result type: '+t[i][1]+',   context selector: '+t[i][2]+',   index: '+t[i][3]));
		}
	});


	// move getJSON to get survey form format to separate function and test with asynchronous test?
	
	// test offline check with mockjax?
	
	// reduce window, does logo become invisible?
	
	// show two feedback messages in quick succession. How is this handled?
	
	
	// test usability of form list at maximum amount of forms - are all forms accessible?
	
	 // load form from local storage and save without changing name of site (pass: record is overwritten with new data)
	
	//*DONE* save new form with existing key (pass: confirmation dialog & yes/no handling)
	
	//*DONE* save new form with FORBIDDEN KEY (pass: alert & no saving)
	
	// use super long form and monitor performance (response, errors)
	
	// browser updates to a new version (pass: localStorage stays intact)
	
	// check behaviour when showFormList is called and no forms are stored (pass: no errors thrown)
	
	// what happens if you try to open a saved form when it is in the queue to be uploaded?
	
	// what happens if try to call getData for a nonexisting form?
	
	// what happens if you are trying to load a form with a data object that doesn't exist in the form format e.g. storage has a 'whatever':'some data' object but the form has nowhere to put it (pass: ?)
	
	//cache update mechanism working on Chrome for Mac (firebug bug?)?
	
	//check for the presence of data-attribute 'changed="true"' when an input field changes
	
})

