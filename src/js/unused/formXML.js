/* !Form Class */
//This 'class' deals only with manipulating the survey form DOM object
function Form (){
	var _this;
	
	// initializes Form object
	this.init = function(FORMAT) {
		//this seems an awkward way to create a copy of global variables
		//but in the future the form format (form.json) should be read into this.FORMAT
		//and form format variables are then accessible only through the form object.
		//Unfortunately, for now this causes strange errors in Safari and Opera (using AJAX)
		////this.KEY_NAME = $.trim(FORMAT.key);
		////this.KEY_LABEL = $.trim(FORMAT.key_label);
		////this.COUNTRY = $.trim(FORMAT.country);
		////this.SECTOR = $.trim(FORMAT.sector);
		////this.SURVEY_NAME = $.trim(FORMAT.name);
		////this.YEAR = $.trim(FORMAT.year);
		////this.VERSION=$.trim(FORMAT.version);
		////this.QUESTIONS=FORMAT.questions;
		
		_this=this;

		var built = this.display(FORMAT);
		this.reset();
		// mark current form when the user appears to change content
		////$('#'+SURVEY_FORM_ID).change(function(){
		////	console.log('form will be marked as "changed"'); // DEBUG
		////	form.setEditStatus(true);
		////});
	
		return built;
	};
	
	// builds up the form input elements and appends them to the DOM
	this.display = function(f) { 
		console.log('starting to build form'); //DEBUG
		try{
////			var i,j,q,questionElement=null,inputType;
////			var formContent = $('<div></div>');
////			$('<input id="recordType" name="recordType" type="hidden" value="surveyData" />').appendTo(formContent);
////			//console.log(f.questions.length+' questions found in form format object'); //DEBUG
////			for (i=0 ; i<f.questions.length; i++){
////				q=f.questions[i];	
////				inputType = $.trim(q.input).toLowerCase(); // deals with possible extra whitespace and capitals in FORMAT (json file)
////				
////				questionElement = $('<section></section>').addClass('question');
////				var addAttributes='', qContent='', title='', step;
////				if (q.description){
////					title = q.description;
////				}
////				switch (inputType){	
////					case 'number':
////						if (!q.step) q.step = 50;
////						if (!q.max) q.max = '';
////						addAttributes = 'min="0" max="'+q.max+'" step="'+q.step+'"';
////					case 'date':	
////					case 'search':
////					case 'color':
////					case 'range':
////					case 'url':
////					case 'email':
////					case 'password':
////					case 'text':
////						qContent = '<p><label>'+q.label;
////						qContent += '<input id="'+q.id_html+'" name="'+q.id_html+'" type="'+inputType+'" '+addAttributes+' title="'+title+'" />';
////						qContent += '</label></p>';
////						$(qContent).appendTo(questionElement);
////						break;
////					case 'radio':
////						$(questionElement).addClass('radio');
////						qContent = '<fieldset><legend>'+q.label+'</legend>';
////						for (j=0; j<q.option_labels.length; j++){
////							qContent += '<p><label>';
////							qContent += '<input id="'+q.id_html+'-'+j+'" name="'+q.id_html+'" type="radio" value="'+q.option_values[j]+'"/>';
////							qContent += q.option_labels[j]+'</label></p>';
////						}
////						qContent += '</fieldset>';
////						$(qContent).appendTo(questionElement)
////						break;
////					case 'checkbox':
////						qContent = '<p><label>'
////						qContent += '<input id="'+q.id_html+'" name="'+q.id_html+'" type="checkbox" value="true" />';
////						qContent += q.label+'</label></p>';
////						$(qContent).appendTo(questionElement);
////						break;
////					case 'select':
////						//ADD
////						break;
////				}
////				//console.log('going to append the question element to the form') // DEBUG
////				$(questionElement).appendTo(formContent);	
////			}
////			// append input elements to DOM	
////			//console.log('going to append the form to the DOM)'); // DEBUG
////			$('#'+SURVEY_FORM_ID).append(formContent);
////			
////			//allow only alphanumeric keys
////			//console.log('setting alphanumeric only for input with name:'+_this.KEY_NAME);
////			$('input[name="'+_this.KEY_NAME+'"]').alphanumeric({allow:' '});
////			
////			//add jQuery datePicker(s) if not already natively supported in browser
////			if(!Modernizr.inputtypes.date){
////				$('input[type="date"]').datepicker();
////			}				

				var xsl;
				if (window.XMLHttpRequest){
		  			request=new XMLHttpRequest();
		  			request.open("GET", 'libraries/XSLTForms/xsltforms.xsl', false); //not asynchronous!!
		  			request.send();
		  			if (request.responseText === 'error'){
		  				console.log('the xslt doc could not be found or read');
		  			}
		  			else if (request.responseText && request.responseText!=''){
		  				//formFormat = JSON.parse(request.responseText);
		  				xsl = request.responseText; //maybe do check to see if responseText is in XML format?
		  				console.log(xsl);
		  				console.log('loaded form translation (XSLT) document');
		  			}
		  			else {
		  				console.log('Error occurred while loading xslt doc');
		  			}
		  		}
//**				if (document.implementation && document.implementation.createDocument){
//**					console.log('browser supports XSLT');
//**					xsltProcessor=new XSLTProcessor();
//**					console.log('XSLTProcessor created');
//**					try{	
//**						xsltProcessor.importStylesheet(xsl);
//**						console.log('stylesheet (XSLT) imported');
//**					}
//**					catch(e){
//**						console.error('importing xlst stylesheet error: '+e.message+'\n tried xslt: '+xsl);
//**					}
//**						
//**				 	resultDocument = xsltProcessor.transformToFragment(f,document);
//**				 	console.log('resultDoc = '+resultDocument);
//**					//document.getElementById("#survey-form").appendChild(resultDocument);
//**				}
				//try{
					//var xsl = $.xsl.load('libraries/XSLTForms/test.xsl');
					//var xml = $.xsl.load('libraries/XSLTForms/WASH_Report_Card.xml');
					//var formEl = $.xsl.transform('http://nl11sh001.rapaide.org/libraries/XSLTForms/test.xsl', 'http://nl11sh001.rapaide.org/libraries/XSLTForms/WASH_Report_Card.xml');
					//console.log ('xsl:'+xsl+' xml:'+xml);
					
					 $('#survey-form').xslt(f,xsl);
					 //'<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> <xsl:template match="/"><html><body><h2>My CD Collection</h2><table border="1"><tr bgcolor="#9acd32"><th>Title</th><th>Artist</th></tr><xsl:for-each select="catalog/cd"><tr><td><xsl:value-of select="title"/></td><td><xsl:value-of select="artist"/></td></tr></xsl:for-each></table></body></html></xsl:template></xsl:stylesheet>');
					 console.log ('the form was parsed succesfully?');
				//}
				//catch(e){
				//	console.error('error: '+e.message);
				//}

				
				//console.log('going to return true (success adding form elements to DOM');//DEBUG
				return true;
		}
		catch(e){
			//console.log('error with creating and adding form input fields to DOM: '+e.message);
			return false;
		}
	};
	
	// get form input and present this as an object
	this.getData = function(formId){ 
		//console.log('form.getData called'); // DEBUG
		var data;
		if (!formId) {
			formId = SURVEY_FORM_ID; 
		}
		try{
			data = $('#'+formId).serializeArray();
			var smallerData = {};
			$.each(data, function(index, value){
				smallerData[value.name] = value.value;
			});
			// ADD IF FORM DOESN'T VALIDATE return null;
			return smallerData;
		}
		catch(e){
			//console.log('error with scraping form data from input fields and creating data object: '+e.message);
			return null;
		}
	};
	
	// function to fill in the loaded data in the survey form
	this.setData = function(data){
		var inputElement, inputType;
		try{
			this.reset();
			that = this;
			//console.log('data received:'+JSON.stringify(data)); // DEBUG
			$.each(data, function(key, value){ //iterate through each item in object
			    //console.log('key:'+key+' value:'+value);// DEBUG
			    inputElement = $('form#'+SURVEY_FORM_ID+' input[name="'+key+'"]');
			   	that.setInputElement(inputElement, value);
			   				});
			// ADD mechanism to prevent attempted uploads of document while being edited AND SWITCH OFF WHEN FORM IS RESET OR BROWSER CRASHES?		
			//setting custom html5 data-attribute "stored-with-key" on form element (value is either null or a string)
			this.setKey(data[this.KEY_NAME]);
			//show delete button
			
			return true;
		}
		catch(e){
			//console.log('error with filling in form fields: '+e.message); // DEBUG
			return false;	
		}
	};
	
	// sub-function to set input elements
	this.setInputElement = function(el, value){
		var inputType = el.attr('type');
		//console.log('input type:'+inputType); // DEBUG
		// REMOVE (ALL) SWITCH STATEMENT(S) AND REPLACE WITH OBJECT!!
		switch (inputType){
		    case 'date':
		    case 'number':
		    case 'search':
		    case 'color':
		    case 'range':
		    case 'url':
		    case 'email':
		    case 'password':
		    case 'text':
		    	el.val(value);
		    	break;
		    case 'radio':
		    	setRadioButton(el, value);
		    	break;
		    case 'checkbox':
		    	var checkValue=false;
		    	if (value==='true') {checkValue = true;}
		    	el.attr('checked', checkValue);
		    	break;
		    // ADD case 'select' for select elements

		}
	}
	
	this.setSelectElement = function(el){
		// ADD
	}
	
	//private function
	function setRadioButton(radioObject, loadedValue) {
		for (var i = 0; i < radioObject.length; i++) {
			if (radioObject[i].value === loadedValue) {
				//console.log('found radiobutton (input) with value: '+loadedValue);
				radioObject[i].checked = true;
			}
		}
	}
	
	this.reset = function() {	
		//ADD ?? checkForOpenForm(false);
		$('#'+SURVEY_FORM_ID)[0].reset();
		//setting custom html5 data-attribute "stored-with-key" on form element (value is either '' or a string)
		this.setKey('');
		////setting custom html5 data-attribute "changed" to false
		//$('#'+SURVEY_FORM_ID).attr('data-changed','false');
		//gui.updateEditingStatus(false);
		this.setEditStatus(false);
		
		$('#survey-title').text('New Survey');
		
		$('button#delete-form').hide();
		
		//set the combobox with the list of files back to the first item
		var value1st = $('#saved-forms option:first').val();
		$('#saved-forms').val(value1st);
		
	};
	
	this.hasBeenEdited = function(){
		if ($('#'+SURVEY_FORM_ID).attr('data-edited') === 'true'){
			return true;
		}
		else {
			return false;
		}
	}
	
	this.setEditStatus = function(status){
		$('#'+SURVEY_FORM_ID).attr('data-edited',status.toString());
		gui.updateEditStatus(status);
	}
	
	this.setKey = function(key){
		$('#'+SURVEY_FORM_ID).attr('data-stored-with-key', key);
		$('#survey-title').text(key);
	}
	
	this.getKey = function(){
		return $('#'+SURVEY_FORM_ID).attr('data-stored-with-key');
	}
	
}

/*****test jquery plugin*****/

/**
 * xslTransform
 * Tools for XSLT transformations; jQuery wrapper for Sarissa <http://sarissa.sourceforge.net/>.
 * See jQuery.fn.log below for documentation on $.log().
 * See jQuery.fn.getTransform below for documention on the $.getTransform().
 * See var DEBUG below for turning debugging/logging on and off.
 *
 * @version   20071214
 * @since     2006-07-05
 * @copyright Copyright (c) 2006 Glyphix Studio, Inc. http://www.glyphix.com
 * @author    Brad Brizendine <brizbane@gmail.com>, Matt Antone <antone@glyphix.com>
 * @license   MIT http://www.opensource.org/licenses/mit-license.php
 * @requires  >= jQuery 1.0.3			http://jquery.com/
 * @requires  jquery.debug.js			http://jquery.glyphix.com/
 * @requires  >= sarissa.js 0.9.7.6		http://sarissa.sourceforge.net/
 *
 * @example
 * var r = $.xsl.transform('path-to-xsl.xsl','path-to-xml.xml');
 * @desc Perform a transformation and place the results in var r
 *
 * @example
 * var r = $.xsl.transform('path-to-xsl.xsl','path-to-xml.xml');
 * var str = $.xsl.serialize( r );
 * @desc Perform a transformation, then turn the result into a string
 *
 * @example
 * var doc = $.xsl.load('path-to-xml.xml');
 * @desc Load an xml file and return a parsed xml object
 *
 * @example
 * var xml = '<xmldoc><foo>bar</foo></xmldoc>';
 * var doc = $.xsl.load(xml);
 * @desc Load an xml string and return a parsed xml object
 */

(function($){

	/*
	 * JQuery XSLT transformation plugin.
	 * Replaces all matched elements with the results of an XSLT transformation.
	 * See xslTransform above for more documentation.
	 *
	 * @example
	 * @desc See the xslTransform-example/index.html
	 *
	 * @param xsl String the url to the xsl file
	 * @param xml String the url to the xml file
	 * @param options Object various switches you can send to this function
	 * 		+ params: an object of key/value pairs to be sent to xsl as parameters
	 * 		+ xpath: defines the root node within the provided xml file
	 * 		+ eval: if true, will attempt to eval javascript found in the transformed result
	 *		+ callback: if a Function, evaluate it when transformation is complete
	 * @returns
	 */
	$.fn.getTransform = function( xsl, xml, options ){
		var settings = {
			params: {},		// object of key/value pairs ... parameters to send to the XSL stylesheet
			xpath: '',		// xpath, used to send only a portion of the XML file to the XSL stylesheet
			eval: true,		// evaluate <script> blocks found in the transformed result
			callback: ''	// callback function, to be run on completion of the transformation
		};
		// initialize options hash; override the defaults with supplied options
		$.extend( settings, options );
		$.log( 'getTransform: ' + xsl + '::' + xml + '::' + settings.toString() );

		// must have both xsl and xml
		if( !xsl || !xml ){
			$.log( 'getTransform: missing xsl or xml' );
			return;
		}

		// run the jquery magic on all matched elements
		return this.each( function(){
			// perform the transformation
			var trans = $.xsl.transform( xsl, xml, settings );

			// make sure we have something
			if( !trans.string ){
				$.log('Received nothing from the transformation');
				return false;
			}

			// ie can fail if there's an xml declaration line in the returned result
			var re = trans.string.match(/<\?xml.*?\?>/);
			if( re ){
				trans.string = trans.string.replace( re, '' );
				$.log( 'getTransform(): found an xml declaration and removed it' );
			}

			// place the result in the element
			// 20070202: jquery 1.1.1 can get a "a.appendChild is not a function" error using html() sometimes ...
			//		no idea why yet, so adding a fallback to innerHTML
			//		::warning:: ie6 has trouble with javascript events such as onclick assigned statically within the html when using innerHTML
			try{
				$(this).html( trans.string );
			}catch(e){
				$.log( 'getTransform: error placing results of transform into element, falling back to innerHTML: ' + e.toString() );
				$(this)[0].innerHTML = trans.string;
			}

			// there might not be a scripts property
			if( settings.eval && trans.scripts ){
				if( trans.scripts.length > 0 ){
					$.log( 'Found text/javascript in transformed result' );
					// use jquery's globaleval to avoid security issues in adobe air
					$.globalEval( trans.scripts );
				}
			}

			// run the callback if it's a native function
			if( settings.callback && $.isFunction(settings.callback) ){
				settings.callback.apply();
			}

		});

	};

	// xsl scope
	$.xsl = {

		// version
		version: 20071214,

		// init ... test for requirements
		init: function(){
			// check for v1.0.4 / v1.1 or later of jQuery
			try{
				parseFloat($.fn.jquery) >= 1;
			}catch(e){
				alert('xslTransform requires jQuery 1.0.4 or greater ... please load it prior to xslTransform');
			}
			// check for Sarissa
			try{
				Sarissa;
			}catch(e){
				alert('Missing Sarissa ... please load it prior to xslTransform');
			}
			// if no log function, create a blank one
			if( !$.log ){
				$.log = function(){};
				$.fn.debug = function(){};
			}
			// log the version
			$.log( 'xslTransform:init(): version ' + this.version );
		},

		// initialize Sarissa's serializer
		XMLSerializer: new XMLSerializer(),

		/*
		 * serialize
		 * Turns the provided object into a string and returns it.
		 *
		 * @param data Mixed
		 * @returns String
		 */
		serialize: function( data ){
			$.log( 'serialize(): received ' + typeof(data) );
			// if it's already a string, no further processing required
			if( typeof(data) == 'string' ){
				$.log( 'data is already a string: ' + data );
				return data;
			}
			return this.XMLSerializer.serializeToString( data );
		},

		/*
		 * xmlize
		 * Turns the provided javascript object into an xml document and returns it.
		 *
		 * @param data Mixed
		 * @returns String
		 */
		xmlize: function( data, root ){
			$.log( 'xmlize(): received ' + typeof(data) );
			root = root || 'root';
			return Sarissa.xmlize(data,root);
		},

		/*
		 * load
		 * Attempts to load xml data by automatically sensing the type of the provided data.
		 *
		 * @param xml Mixed the xml data
		 * @returns Object
		 */
		load: function( xml ){
			$.log( 'load(): received ' + typeof(xml) );
			// the result
			var r;

			// if it's an object, assume it's already an XML object, so just return it
			if( typeof(xml) == 'object' ){
				return xml;
			}

			// if it's a string, determine if it's xml data or a path
			// assume that the first character is an opening caret if it's XML data
			if( xml.substring(0,1) == '<' ){
				r = this.loadString( xml );
			}else{
				r = this.loadFile( xml );
			}

			if( r ){
				// the following two lines are needed to get IE (msxml3) to run xpath ... set it on all xml data
				r.setProperty( 'SelectionNamespaces', 'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"' );
				r.setProperty( 'SelectionLanguage', 'XPath' );
				return r;
			}else{
				$.log( 'Unable to load ' + xml );
				return false;
			}
		},

		/*
		 * loadString
		 * Parses an XML string and returns the result.
		 *
		 * @param str String the xml string to turn into a parsed XML object
		 * @returns Object
		 */
		loadString: function( str ){
			$.log( 'loadString(): ' + str + '::' + typeof(str) );

			// use Sarissa to generate an XML doc
			var p = new DOMParser();
			var xml = p.parseFromString( str, 'text/xml' );
			if( !xml ){
				$.log( 'loadString(): parseFromString() failed' );
				return false;
			}
			return xml;
		},

		/*
		 * loadFile
		 * Attempts to retrieve the requested path, specified by url.
		 * If url is an object, it's assumed it's already loaded, and just returns it.
		 *
		 * @param url Mixed
		 * @returns Object
		 */
		loadFile: function( url ){
			$.log( 'loadFile(): ' + url + '::' + typeof(url) );

			if( !url ){
				$.log( 'ERROR: loadFile() missing url' );
				return false;
			}

			// variable to hold ajax results
			var doc;
			/* ajax functionality provided by jQuery is commented, since it can't handle file:///
			// function to receive data on successful download ... semicolon after brace is necessary for packing
			this.xhrsuccess = function(data,str){
				$.log( 'loadFile() completed successfully (' + str + ')' );
				doc = data;
				return true;
			};
			// function to handle downloading error ... semicolon after brace is necessary for packing
			this.xhrerror = function(xhr,err){
				// set debugging to true in order to force the display of this error
				window.DEBUG = true;
				$.log( 'loadFile() failed to load the requested file: (' + err + ') - xml: ' + xhr.responseXML + ' - text: ' + xhr.responseText );
				doc = null;
				return false;
			};

			// make asynchronous ajax call and call functions defined above on success/error
			$.ajax({
				type:		'GET',
				url:		url,
				async:		false,
				success:	this.xhrsuccess,
				error:		this.xhrerror
			});
			*/

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open('GET', url, false);
			xmlhttp.send('');
			doc = xmlhttp.responseXML;

			// check for total failure
			if( !doc ){
				$.log( 'ERROR: document ' + url + ' not found (404), or unable to load' );
				return false;
			}
			// check for success but no data
			if( doc.length == 0 ){
				$.log( 'ERROR: document ' + url + ' loaded in loadFile() has no data' );
				return false;
			}
			return doc;
		},

		/*
		 * transform
		 * Central transformation function: takes an xml doc and an xsl doc.
		 *
		 * @param xsl Mixed the xsl transformation document
		 * @param xml Mixed the xml document to be transformed
		 * @param options Object various switches you can send to this function
		 * 		+ params: an object of key/value pairs to be sent to xsl as parameters
		 * 		+ xpath: defines the root node within the provided xml file
		 * @returns Object the results of the transformation
		 * 		+ xsl: the raw xsl doc
		 * 		+ doc: the raw results of the transform
		 * 		+ string: the serialized doc
		 */
		transform: function( xsl, xml, options ){
			$.log( 'transform(): ' + xsl + '::' + xml + '::' + (options ? options.toString() : 'no options provided') );

			// set up request and result
			var request = {
				// the source and loaded object for xml
				xsl: {
					source: xsl,
					doc: null
				},
				// the source and loaded object for xsl
				xml: {
					source: xml,
					doc: null
				},
				// the options
				options: options || {},
				// the result doc and string
				result: {
					doc: null,
					string: '',
					scripts: null,
					error: ''
				}
			}

			// set up error handler
			var err = function( what ){
				var docerr = '', srcerr = '';
				// build the src error string
				srcerr = (typeof(request[what].source) == 'string') ? ' (' + what + ' loaded from provided path)' : ' (' + what + ' loaded from provided object)';
				// build the text error string
				docerr = (typeof(request[what].doc) == 'object') ? '[success]' : '[failure]';
				// include the root node if we have a doc object and it's xml
				if( what == 'xml' && typeof(request[what].doc) == 'object' ){
					docerr += ' root node of "' + request[what].doc.getElementsByTagName('*')[0].nodeName + '"';
				}
				return docerr + ' ' + srcerr;
			}

			// load the files
			try{
				request.xsl.doc = this.load(xsl);
				request.xml.doc = this.load(xml);
			}catch(e){
				$.log('Unable to load either xsl [' + err('xsl') + '] or xml [' + err('xml') + ']');
				throw( err('xsl') + '::' + err('xml') );
				return false;
			}

			// if we have an xpath, replace xml.doc with the results of running it
			// as of 2007-12-03, IE throws a "msxml6: the parameter is incorrect" error, so removing this
			if( request.options.xpath && request.xml.doc && !jQuery.browser.msie ){
				// run the xpath
				request.xml.doc = request.xml.doc.selectSingleNode( request.options.xpath.toString() );
				$.log( 'transform(): xpath has been run...resulting doc: ' + (this.serialize(request.xml.doc)) );
			}

			// attach the processor
			var processor = new XSLTProcessor();
			// stylesheet must be imported before parameters can be added
			processor.importStylesheet( request.xsl.doc );
			// add parameters to the processor
			if( request.options.params && processor ){
				$.log( 'transform(): received xsl params: ' + request.options.params.toString() );
				for( key in request.options.params ){
					// name and value must be strings; first parameter is namespace
					var p = request.options.params[key] ? request.options.params[key].toString() : request.options.params[key];
					try{
						processor.setParameter( null, key.toString(), p );
					}catch(e){
						$.log('Unable to set parameter "' + key + '"');
						return false;
					}
					$.log( 'set parameter "' + key.toString() + '" to "' + p + '"' );
				}
			}

			// perform the transformation
			try{
				request.result.doc = processor.transformToDocument( request.xml.doc );
				// handle transform error
				request.result.error = Sarissa.getParseErrorText( request.result.doc );
				if( request.result.error != Sarissa.PARSED_OK ){
					// throw the error text
					request.result.error = 'transform(): error in transformation: ' + request.result.error + ' :: using xsl: ' + err('xsl') + ' => xml: ' + err('xml');
					$.log(request.result.error);
				}
			}catch(e){
				request.result.error = 'Unable to perform transformation :: using xsl: ' + err('xsl') + ' => xml: ' + err('xml');
				$.log(request.result.error);
				throw(request.result.error);
				return request.result;
			}

			// if we made it this far, the transformation was successful
			request.result.string = this.serialize( request.result.doc );
			// store reference to all scripts found in the doc (not result.string)
			request.result.scripts = jQuery('script',request.result.doc).text();

			return request.result;
		}
	};

	// initialize the $.xsl object
	$.xsl.init();

})(jQuery);