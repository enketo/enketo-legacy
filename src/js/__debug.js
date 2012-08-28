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

//add buttons
$(document).ready(function(){
	//$("#debug").append(
	//'<input style= type="button" class="bigButton" value="Clear Local Storage" onclick="clearLocalStorage()" />'
	//);
	// useful during development to avoid 'console undefined' errors in IE and FF
	if (typeof(window.console) == "undefined") {console = {log: function(){}}};
});


/********* FORM object *********/

	//public, for debugging only
//	Form.prototype.setDataO = function(dataStr){
//	   setData(dataStr);
//	}
//	//public, for debugging only
//	Form.prototype.xPath = function(node){
//	   console.log('xpath: '+xPath(node));
//	}
//	//public, for debugging only
//	Form.prototype.setDataValue = function(path, value, index){
//	   setDataValue(path, value, index)
//	}
//	Form.prototype.setFormValues = function(){
//	   setFormValues();
//	}

//evaluate skiplogic

function ev(expr, translate, type){
	translate = translate || false;
	type = type || 'boolean';
	resultType = 'XPathResult.'+type.toUpperCase()+'_TYPE';
	if(translate) {
	 expr = form.tx(expr);
	}
	console.log('expr to test: '+expr+' with result type: '+type);
	evaluator = new XPathEvaluator();
	var context = $.parseXML((new window.XMLSerializer()).serializeToString(form.getData().find('instance *')[0]));
	var result = evaluator.evaluate(expr, context.documentElement, null, resultType, null);
	var resultValue = {'boolean': 'booleanValue', 'string': 'stringValue', 'number': 'numberValue'};
	console.log('evaluated: '+expr+' to: '+result[resultValue[type]]);
}

function testXMLQueries(){
	xmlStr = '<data><node1/><node2 template=""><node2a>def</node2a></node2><node2><node2a>val2a</node2a></node2><node2 /><node3>a value</node3></data>';

	dataXMLDoc = $.parseXML(xmlStr);
	$dataXDoc = $(dataXMLDoc);
	$data = $(xmlStr);
	//queries using $dataXDoc (created from XML Document)
	console.log('1a:length: '+$dataXDoc.find('node2a:not([template], [template] *)').length); //finds 1
	console.log('2a:length: '+$dataXDoc.find('node2a').length); //finds *1*
	console.log('3a:length: '+$dataXDoc.find('* *').not('[template], [template] *').find('node2a').length); //finds *1*
	console.log('4a:length: '+$dataXDoc.find('* *:not([template], [template] *)').find('node2a').length); //finds *1test*
	console.log($dataXDoc.find('* > *:not([template], [template] *)').find('node2a'));
	
	
	//queries using $data (created from XML String)
	console.log('1b:length: '  +  $data.find('node2a:not([template], [template] *)').length); //finds 1
	console.log('2b:length: '  +  $data.find('*:not([template], [template] *)').find('node2a').length); //finds 1
	console.log('3b:length: '  +  $data.find('*').not('[template], [template] *').find('node2a').length); //finds 1
	console.log('4b:length: '  +  $data.find('*:not([template], [template] *)').find('node2a').length); //finds 1

	

	console.log($dataXDoc);
	console.log($dataXDoc.find('* *:not([template], [template] *)'));
	console.log($dataXDoc.find('* *:not([template], [template] *)').find('node2a'));

	console.log($data);
	console.log($data.find('*:not([template], [template] *)'));
	console.log($data.find('*:not([template], [template] *)').find('node2a'));
	
}

function testXMLQueries2(){
	xmlStr ='<instance><data><A_TLgroup><A1_text/></A_TLgroup><B_TLRepeat template=""><B_decimal>1.2</B_decimal></B_TLRepeat><B_TLRepeat><B_decimal>1</B_decimal></B_TLRepeat><B_TLRepeat><B_decimal>2</B_decimal></B_TLRepeat></data></instance>';

	dataXMLDoc = $.parseXML(xmlStr);
	$dataXDoc = $(dataXMLDoc);
	$data = $(xmlStr);
	//queries using $dataXDoc (created from XML Document)
	//console.log($dataXDoc.find('B_decimal:not([template], [template] *)')); //finds 2
	//console.log($dataXDoc.find('B_decimal')); //finds *3*
	//console.log($dataXDoc.find('* > *').not('[template], [template] *').find('B_decimal').not('[template], [template] *')); //finds *3*
	//console.log($dataXDoc.find('* > *:not([template], [template] *)').find('B_decimal')); //finds *3*
	
	//console.log($dataXDoc.find('*:not([template], [template] *)'));
	$subset = $dataXDoc.find('*:not([template], [template] *)').filter(function(){return $(this).children().length == 0});
	console.log($subset); 
	console.log($subset.parent().find('B_decimal')); 
	console.log($dataXDoc.find('*:not([template], [template] *)').filter(function(){return $(this).children().length == 0}).parent().find('B_decimal'))
		
	//queries using $data (created from XML String)
//	console.log('1b:length: '  +  $data.find('B_decimal:not([template], [template] *)').length); //finds 2
//	console.log('2b:length: '  +  $data.find('*:not([template], [template] *)').find('B_decimal').length); //finds 3
//	console.log('3b:length: '  +  $data.find('*').not('[template], [template] *').find('B_decimal').length); //finds 3
//	console.log('4b:length: '  +  $data.find('*:not([template], [template] *)').find('B_decimal').length); //finds 3
//
//	console.log($dataXDoc);
//	console.log($dataXDoc.find('* *:not([template], [template] *)'));
//	console.log($dataXDoc.find('* *:not([template], [template] *)').find('B_decimal'));
//
//	console.log($data);
//	console.log($data.find('*:not([template], [template] *)'));
//	console.log($data.find('*:not([template], [template] *)').find('B_decimal'));
}



/****************************/

// clear local storage
function cls(){
	localStorage.clear();
}

//show Feedback bar
function sf(msg){
	if(!msg) msg = 'test feedback message';
	gui.showFeedback(msg, 5000);
}

//show Dialog
function sd(msg){
	if(!msg) msg = 'test dialog message';
	gui.alert(msg);
}

//to tryout different themes with themeroller on firefox - copied color functions from $(document).ready
function rc(){
	// setting consistent theme colors
	$('#overlay, #form-controls').css('background-color',$('.ui-widget-header').css('background-color'));
	// using a trick to get the color of the .ui-widget-shadow class even though no element with this style exists in the DOM yet
	$('body').addClass('ui-widget-shadow').css('background-color', $('body').css('background-color')).removeClass();
}

// helper function to set up and close test by removing and returning all survey data in localStorage

/**
 * @constructor
 * Function: StoredData
 * 
 * description
 * 
 * Returns:
 * 
 *   return description
 */
function StoredData() {
	var data=[];

	this.remove = function(){
		dataTypes = ['surveyData', 'settings'];
		for (var j in dataTypes){
			data[j] = store.getRecordCollection(dataTypes[j]);
			for (var i in data[j]){
				if (data[j][i].recordType === dataTypes[j]){ //double check
					//console.log('going to remove: '+JSON.stringify(data[j][i])); // DEBUG
					localStorage.removeItem(data[j][i].key);// the actual localStorage key is used (more robust)
				}
			}
		}
	}

	this.putBack = function(){
		for (var j in data){
			for (var i in data[j]){
				//console.log('going to put back: '+JSON.stringify(data[j][i])); // DEBUG
				localStorage.setItem(data[j][i].key, JSON.stringify(data[j][i]));
			}
		}
	}
}

// helper function to enter data for testing
function getRandomString(length){
	var chars = "   0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	if (!length) { length=8 };
	var randomstring = '';
	for (var i=0; i<length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}