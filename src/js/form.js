/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs
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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true, trailing:false*//*global XPathJS, XMLSerializer:true, Profiler, Modernizr, google, settings, connection, xPathEvalTime*/

/**
 * Class: Form
 *
 * This class provides the JavaRosa form functionality by manipulating the survey form DOM object and
 * continuously updating the data XML Document. All methods are placed inside the constructor (so privileged 
 * or private) because only one instance will be created at a time.
 * 
 * @param {string} formSelector  jquery selector for the form
 * @param {string} dataStr       <instance> as XML string
 * @param {string=} dataStrToEdit <instance> as XML string that is to be edit. This may not be a complete instance (empty nodes could be missing) and may have additional nodes.
 *
 * @constructor
 */
function Form (formSelector, dataStr, dataStrToEdit){
	"use strict";
	var data, dataToEdit, form, $form, $formClone,
		loadErrors = [];
	//*** FOR DEBUGGING and UNIT TESTS ONLY ***
	this.ex = function(expr, type, selector, index){return data.evaluate(expr, type, selector, index);};
	this.sfv = function(){return form.setAllVals();};
	this.Data = function(dataStr){return new DataXML(dataStr);};
	this.getDataO = function(){return data;};
	this.getDataEditO = function(){return dataToEdit.get();};
	this.Form = function(selector){return new FormHTML(selector);};
	this.getFormO = function(){return form;};
	//this.getDataXML = function(){return data.getXML();};
	//this.validateAll = function(){return form.validateAll();};
	//this.outputUpdate = function(){return form.outputUpdate();};
	//***************************************

/**
 * Function: init
 *
 * Initializes the Form instance (XML data and HTML form).
 * 
 */
	this.init = function() {
		//cloning children to keep any event handlers on 'form.jr' intact upon resetting
		$formClone = $(formSelector).clone().appendTo('<original></original>');

		data = new DataXML(dataStr);
		form = new FormHTML(formSelector);

		//var profiler = new Profiler('data.init()');
		data.init();
		//profiler.report();

		if (typeof dataStrToEdit !== 'undefined' && dataStrToEdit.length > 0){
			dataToEdit = new DataXML(dataStrToEdit);
			dataToEdit.init();
			data.load(dataToEdit);
		}

		//profiler = new Profiler('form.init()');
		form.init();
		//profiler.report();
		
		if (loadErrors.length > 0){
			console.error('loadErrors: ',loadErrors);
		}
		return loadErrors;
	};

	/**
     * @param {boolean=} incTempl
     * @param {boolean=} incNs
     * @param {boolean=} all
     */
	this.getDataStr = function(incTempl, incNs, all){
		return data.getStr(incTempl, incNs, all);
	};
	/**
     *
     */
	this.getRecordName = function(){
		return form.recordName.get();
	};
	/**
     * @param {string} name
     */
	this.setRecordName = function(name){
		return form.recordName.set(name);
	};
	this.getRecordStatus = function(){
		return form.recordStatus.get();
	};
	/**
     * @param {(boolean|string)=} markedFinal
     */
	this.setRecordStatus = function(markedFinal){
		return form.recordStatus.set(markedFinal);
	};
	/**
	 * @param { boolean } status [description]
	 */
	 this.setEditStatus = function(status){
		return form.editStatus.set(status);
	 };
	 this.getEditStatus = function(){
		return form.editStatus.get();
	 };
	 this.getName = function(){
		return $form.find('#form-title').text();
	 };

	//restores html form to pre-initialized state
	//does not affect data instance!
	this.resetHTML = function(){
		//form language selector was moved outside of <form> so has to be separately removed
		$('#form-languages').remove();
		$form.replaceWith($formClone);
	 };

	 /**
	 * Validates the whole form and returns true or false
	 * @return {boolean} 
	 */ 
	this.validateForm = function(){
		return form.validateAll();
	};
	/**
	 * Returns wether form has validated as true or false. Needs to be called AFTER calling validate()!
	 * @return {!boolean} 
	 */ 
	this.isValid = function(){
		return form.isValid();
	};
	

	/**
	 * Inner Class dealing with the XML Instance (data) of a form
	 * @constructor
	 * @extends Form
	 * @param {string} dataStr String of the default XML instance
	 */
	function DataXML(dataStr) {
		var $data,
			that=this;
	
		this.instanceSelectRegEx = /instance\([\'|\"]([^\/:\s]+)[\'|\"]\)/g;

		//TEMPORARY DUE TO FIREFOX ISSUE, REMOVE ALL NAMESPACES FROM STRING, 
		//BETTER TO LEARN HOW TO DEAL WITH DEFAULT NAMESPACES
		dataStr = dataStr.replace(/xmlns\=\"[a-zA-Z0-9\:\/\.]*\"/g,'');

		this.xml = $.parseXML(dataStr);

		$data = $(this.xml);

		this.$ = $data;

		//replace browser-built-in-XPath Engine
		XPathJS.bindDomLevel3XPath(); 

		/**
		 * Function: node
		 * 
		 * description
		 * 
		 * Parameters:
		 * 
		 *   @param {(string|null)=} selector - [type/description]
		 *   @param {(string|number|null)=} index    - [type/description]
		 *   @param {(Object|null)=} filter   - [type/description]
		 *   @param filter.onlyTemplate
		 *   @param filter.noTemplate
		 *   @param filter.onlyLeaf
		 *   @param filter.noEmpty
		 *   @returns {Nodeset}
		 */
		this.node = function(selector, index, filter){
			return new Nodeset(selector, index, filter);
		};
		
		
		/**
		 *	Inner Class dealing with nodes and nodesets of the XML instance
		 *	
		 *   @param {(string|null)=} selector simpleXPath or jQuery selector
		 *   @param {(string|number|null)=} index the index of the target node with that selector
		 *   @param {(Object|null)=} filter filter object for the result nodeset
		 *   @param {boolean=} filter.onlyTemplate only select template nodes (of repeats)
		 *   @param {boolean=} filter.noTemplate exclude template nodes (of repeats)
		 *   @param {boolean=} filter.onlyLeaf only include leaf nodes
		 *   @param {boolean=} filter.noEmpty exclude empty nodes (and therefore only returns leaf nodes)
		 *   @constructor
		 *   @extends DataXML
		 */
		function Nodeset(selector, index, filter){
			var defaultSelector = '*';
			this.originalSelector = selector;
			this.selector = (typeof selector === 'string' && selector.length > 0) ? selector : defaultSelector; 
			filter = (typeof filter !== 'undefined' && filter !== null) ? filter : {};
			this.filter = filter;
			this.filter.noTemplate = (typeof filter.noTemplate !== 'undefined') ? filter.noTemplate : true;
			this.filter.onlyLeaf = (typeof filter.onlyLeaf !== 'undefined') ? filter.onlyLeaf : false;
			this.filter.onlyTemplate = (typeof filter.onlyTemplate !== 'undefined') ? filter.onlyTemplate : false;
			this.filter.noEmpty = (typeof filter.noEmpty !== 'undefined') ? filter.noEmpty : false;
			this.index = index;

			if ($data.find('model>instance').length > 0){
				//to refer to non-first instance, the instance('id_literal')/path/to/node syntax can be used
				if (this.selector !== defaultSelector && this.selector.indexOf('/') !== 0 && that.instanceSelectRegEx.test(this.selector) ){
					this.selector = this.selector.replace(that.instanceSelectRegEx, "model > instance#$1");
					//console.debug('selector modified to: '+this.selector);
					return;
				}
				//default context is the first instance in the model			
				this.selector = "model > instance:eq(0) "+this.selector;
			}
		}

		/**
		 * Privileged method to find data nodes filtered by a jQuery or XPath selector and additional filter properties
		 * Without parameters it returns a collection of all data nodes excluding template nodes and their children. Therefore, most
		 * queries will not require filter properties. This function handles all (?) data queries in the application.
		 *
		 * @return {jQuery} jQuery-wrapped filtered instance nodes that match the selector and index
		 */
		Nodeset.prototype.get = function(){
			var p, $nodes, val, context;
			
			// noTemplate is ignored if onlyTemplate === true
			if (this.filter.onlyTemplate === true){
				$nodes = $data.xfind(this.selector).filter('[template]');
			}
			// default
			else if (this.filter.noTemplate === true){	
				$nodes = $data.xfind(this.selector).not('[template], [template] *');
			}
			else{
				$nodes = $data.xfind(this.selector);
			}
			//noEmpty automatically excludes non-leaf nodes
			if (this.filter.noEmpty === true){
				$nodes = $nodes.filter(function(){
					val = /** @type {string} */ $(this).text();
					//$this = $(this);
					////console.log ('children: '+$(this).children().length);
					////console.log ('text length: '+($.trim($this.text()).length));
					return $(this).children().length === 0 && $.trim(val).length > 0;//$.trim($this.text()).length > 0;
				});
			}
			//this may still contain empty leaf nodes
			else if (this.filter.onlyLeaf === true){
				$nodes = $nodes.filter(function(){
					return $(this).children().length === 0;
				});
			}
			$nodes = (typeof this.index !== 'undefined' && this.index !== null) ? $nodes.eq(this.index) : $nodes;
			////console.debug('node.get() returns');//console.debug($nodes);
			return $nodes;
		};

		/**
		 * Sets data node values.
		 * 
		 * @param {(string|Array.<string>)=} newVals	The new value of the node.
		 * @param {?string=} expr  XPath expression to validate the node.
		 * @param {?string=} xmlDataType XML data type of the node
		 *
		 * @returns {?boolean} null is returned when the node is not found or multiple nodes were selected
		 */
		Nodeset.prototype.setVal = function(newVals, expr, xmlDataType){
			var $target, curVal, /**@type {string}*/ newVal, success;

			curVal = this.getVal()[0];
			
			if (typeof newVals !== 'undefined' && newVals !== null){
				newVal = ($.isArray(newVals)) ? newVals.join(' ') : newVals.toString();
			}
			else newVal = '';
			newVal = this.convert(newVal, xmlDataType);

			$target = this.get();

			if ( $target.length === 1 && $.trim(newVal.toString()) !== $.trim(curVal.toString()) ){ //|| (target.length > 1 && typeof this.index == 'undefined') ){
				//first change the value so that it can be evaluated in XPath (validated)
				$target.text(newVal);
				//then return validation result
				success = this.validate(expr, xmlDataType);
				$form.trigger('dataupdate', $target.prop('nodeName'));
				return success;
			}
			if ($target.length > 1){
				console.error('nodeset.setVal expected nodeset with one node, but received multiple');
				return null;
			}
			if ($target.length === 0 ){
				console.error('Data node: '+this.selector+' with null-based index: '+this.index+' not found!');
				return null;
			}
			//always validate if the new value is not empty, even if value didn't change (see validateAll() function)
			//return (newVal.length > 0 && validateAll) ? this.validate(expr, xmlDataType) : true;
			return null;
			////console.debug('validation result: '+this.validate());
		};

		/**
		 * Function: getVal
		 * 
		 * Obtains the data value if a JQuery or XPath selector for a single node is provided.
		 * 
		 * Parameters:
		 * 
		 *   selector - String of JQuery or XPath selector
		 *   
		 * Returns:
		 * 
		 *   returns [multiple OBSOLETE?] an array of values 
		 *   
		 */
		Nodeset.prototype.getVal = function(){
			var vals=[];
			this.get().each(function(){
				vals.push($(this).text());
			});
			return vals;
		};
		
		/**
		 * clone data node after all templates have been cloned (after initialization)
		 * @param  {jQuery} $precedingTargetNode the node after which to append the clone
		 */
		Nodeset.prototype.clone = function($precedingTargetNode){
			var $dataNode, allClonedNodeNames;

			$dataNode = this.get();
			$precedingTargetNode = $precedingTargetNode || $dataNode;

			if ($dataNode.length === 1 && $precedingTargetNode.length ===1){
				$dataNode.clone().insertAfter($precedingTargetNode).find('*').addBack().removeAttr('template');

				allClonedNodeNames = [$dataNode.prop('nodeName')];
				$dataNode.find('*').each(function(){
					allClonedNodeNames.push($(this).prop('nodeName'));
				});

				$form.trigger('dataupdate', allClonedNodeNames.join(','));
			}
			else{
				console.error ('node.clone() function did not receive origin and target nodes');
			}
		};

		/**
		 * Remove a node
		 */
		Nodeset.prototype.remove = function(){
			var dataNode = this.get();
			if (dataNode.length > 0){
				//console.log('removing data node with name: '+this.get().prop('nodeName'));
				dataNode.remove();
				$form.trigger('dataupdate', dataNode.prop('nodeName') );
			}
			else {
				console.error('could not find node '+this.selector+' with index '+this.index+ ' to remove ');
			}
		};

		/**
		 * Convert a value to a specified data type (though always stringified)
		 * @param  {string} x  value to convert
		 * @param  {?string=} xmlDataType name of xmlDataType
		 * @return {string}             return string value of converted value
		 */
		Nodeset.prototype.convert = function(x, xmlDataType){
			if (x.toString() === ''){
				return x;
			}
			if (typeof xmlDataType !== 'undefined' && xmlDataType !== null && 
				typeof this.types[xmlDataType.toLowerCase()] !== 'undefined' &&
				typeof this.types[xmlDataType.toLowerCase()].convert !== 'undefined'){
					return this.types[xmlDataType.toLowerCase()].convert(x);
			}
			return x;
		};
 
		/**
		 * Validate a value with an XPath Expression and/or xml data type
		 * @param  {?string=} expr        XPath expression
		 * @param  {?string=} xmlDataType name of xml data type
		 * @return {boolean}            returns true if both validations are true
		 */
		Nodeset.prototype.validate = function(expr, xmlDataType){
			var typeValid, exprValid,
				value = this.getVal()[0];

			if (value.toString() === '') {
				return true;
			}

			if (typeof xmlDataType == 'undefined' || xmlDataType === null || 
				typeof this.types[xmlDataType.toLowerCase()] == 'undefined'){
				xmlDataType = 'string';
			}
			typeValid = this.types[xmlDataType.toLowerCase()].validate(value);
			
			exprValid = (typeof expr !== 'undefined' && expr !== null && expr.length > 0) ? that.evaluate(expr, 'boolean', this.originalSelector, this.index) : true;
			//console.debug('constraint valid: '+exprValid);
			return (typeValid && exprValid);
		};

		/**
		 * xml data types
		 * @namespace  types
		 * @type {Object}
		 */
		Nodeset.prototype.types = {
			'string' :{
				//max length of type string is 255 chars. Convert (truncate) silently?
				validate : function(x){
					return true;
				}
			},
			'select' :{
				validate: function(x){
					return true;
				}
			},
			'select1' :{
				validate: function(x){
					return true;
				}
			},
			'decimal' :{
				validate : function(x){
					return (!isNaN(x-0) && x !== null) ? true : false;
				}
			},
			'int' : {
				validate : function(x){
					return (!isNaN(x-0) && x !== null && Math.round(x) == x) ? true : false; //x.toString() == parseInt(x, 10).toString();
				}
			}, 
			'date' : {
				validate : function(x){
					var pattern = (/([0-9]{4})([\-]|[\/])([0-9]{2})([\-]|[\/])([0-9]{2})/),
						segments = pattern.exec(x);

					//console.debug('datestring: '+x+ ' type: '+ typeof x + 'is valid? -> '+new Date(x.toString()).toString());
					//return ( new Date(x).toString() !== 'Invalid Date' || new Date(x+'T00:00:00.000Z') !== 'Invalid Date');
					return (segments && segments.length === 6) ? (new Date(Number(segments[1]), Number(segments[3]) - 1, Number(segments[5])).toString() !== 'Invalid Date') : false;
				},
				convert : function(x){
					var pattern = /([0-9]{4})([\-]|[\/])([0-9]{2})([\-]|[\/])([0-9]{2})/,
						segments = pattern.exec(x),
						date = new Date(x);
					if (new Date(x).toString() == 'Invalid Date'){
						//this code is really only meant for the Rhino and PhantomJS engines, in browsers it may never be reached
						if (segments && Number(segments[1]) > 0 && Number(segments[3]) >=0 && Number(segments[3]) < 12 && Number(segments[5]) < 32){
							date = new Date(Number(segments[1]), (Number(segments[3])-1), Number(segments[5]));
						}
					}
					//date.setUTCHours(0,0,0,0);
					//return date.toUTCString();//.getUTCFullYear(), datetime.getUTCMonth(), datetime.getUTCDate());
					return date.getUTCFullYear().toString().pad(4)+'-'+(date.getUTCMonth()+1).toString().pad(2)+'-'+date.getUTCDate().toString().pad(2);
				}
			},
			'datetime' : {
				validate : function(x){
					console.debug('datetime validation function received: '+x+' type:'+ typeof x);
					//the second part builds in some tolerance for slightly-off dates provides as defaults (e.g.: 2013-05-31T07:00-02)
					return ( new Date(x.toString()).toString() !== 'Invalid Date' || new Date(this.convert(x.toString())).toString() !== 'Invalid Date');
				},
				convert : function(x){
					var date,// timezone, segments, dateS, timeS,
						patternCorrect = /([0-9]{4}\-[0-9]{2}\-[0-9]{2})([T]|[\s])([0-9]){2}:([0-9]){2}([0-9:.]*)(\+|\-)([0-9]{2}):([0-9]{2})$/,
						patternAlmostCorrect = /([0-9]{4}\-[0-9]{2}\-[0-9]{2})([T]|[\s])([0-9]){2}:([0-9]){2}([0-9:.]*)(\+|\-)([0-9]{2})$/;  
					//console.debug('datetime conversion function received: '+x+' type:'+ typeof x);
					/* 
					 * if the pattern is right, or almost right but needs a small correction for JavaScript to handle it,
					 * do not risk changing the time zone by calling toISOLocalString()
					 */
					if (new Date(x).toString() !== 'Invalid Date' && patternCorrect.test(x)){
						return x;
					}
					if (new Date(x).toString() == 'Invalid Date' && patternAlmostCorrect.test(x)){
						return x+':00';
					}
					date = new Date(x);
					return (date.toString() !== 'Invalid Date') ? date.toISOLocalString() : date.toString();
				}
			},
			'time' : {
				validate : function(x){
					var date = new Date(),
						segments = x.toString().split(':');
					//console.debug('time value to validate: '+x);
					//console.debug(segments);
					if (segments.length < 2){
						return false;
					}
					segments[2] = (segments[2]) ? Number(segments[2].toString().split('.')[0]) : 0;
						
					return ( segments[0] < 24 && segments[0] >= 0 && segments[1] < 60 && segments[1] >= 0 && segments[2] < 60 && segments[2] >= 0 && date.toString() !== 'Invalid Date' );
				},
				convert : function(x){
					var segments = x.toString().split(':');
					$.each(segments, function(i, val){
						segments[i] = val.toString().pad(2);
					});
					return segments.join(':');
					//console.log('converting datetime to time');
					//return datetime.getHours().toString().pad(2)+':'+datetime.getMinutes().toString().pad(2)+':'+datetime.getSeconds().toString().pad(2);
				}
			},
			'barcode' : {
				validate: function(x){
					return true;
				}
			},
			'geopoint' : {
				validate: function(x){
					var coords = x.toString().split(' ');
					return ( coords[0] !== '' && coords[0] >= -90 && coords[0] <= 90 ) && 
						( coords[1] !== '' && coords[1] >= -180 && coords[1] <= 180) && 
						( typeof coords[2] == 'undefined' || !isNaN(coords[2]) ) && 
						( typeof coords[3] == 'undefined' || ( !isNaN(coords[3]) && coords[3] >= 0 ) );
				},
				convert: function(x){
					return $.trim(x.toString());
				}
			},
			'binary' : {
				validate: function(x){
					return true;
				}
			}
		};	
	}

	/**
	 * Function: DataXML.init
	 * 
	 * Sets up the $data object.
	 * 
	 * Parameters:
	 * 
	 *   dataStr - xml data as a string
	 *   
	 * Returns:
	 * 
	 *   -
	 */
	DataXML.prototype.init = function(){
		var val;

		//trimming values
		this.node(null, null, {noEmpty: true, noTemplate: false}).get().each(function(){
			val = /** @type {string} */$(this).text();
			$(this).text($.trim(val));
		});

		this.cloneAllTemplates();
		return;
	};

	/**
	 * Function to load an (possibly incomplete) instance so that it can be edited.
	 * 
	 * @param  {Object} instanceOfDataXML [description]
	 * 
	 */
	DataXML.prototype.load = function(instanceOfDataXML){
		var nodesToLoad, index, xmlDataType, path, value, target, $input, $target, $template, instanceID, error,
			that = this,
			filter = {noTemplate: true, noEmpty: true};

		nodesToLoad = instanceOfDataXML.node(null, null, filter).get();
		console.debug('nodes to load: ', nodesToLoad);
		//first empty all form data nodes, to clear any default values except those inside templates
		this.node(null, null, filter).get().each(function(){
			//something seems fishy about doing it this way instead of using node.setVal('');
			$(this).text('');
		});

		nodesToLoad.each(function(){
			var name = $(this).prop('nodeName');
			//console.debug(name);
			path = form.generateName($(this));
			//console.debug('path: '+path);
			index = instanceOfDataXML.node(path).get().index($(this));
			//console.debug('index: '+index);
			value = $(this).text();
			//console.debug('value: '+value);

			//input is not populated in this function, so we take index 0 to get the XML data type
			$input = $form.find('[name="'+path+'"]').eq(0);
			
			xmlDataType = ($input.length > 0) ? form.input.getXmlType($input) : 'string';
			//console.debug('xml datatype: '+xmlDataType);
			target = that.node(path, index);
			$target = target.get();

			//if there are multiple nodes with that name and index (actually impossible)
			if ($target.length > 1){
				console.error('Found multiple nodes with path: '+path+' and index: '+index);
			}
			//if there is a corresponding node in the form's original instances
			else if ($target.length === 1){
				//set the value
				target.setVal(value, null, xmlDataType);
			}
			//if there is not a corresponding data node but there is a corresponding template node (=> <repeat>)
			//this use of node(,,).get() is a bit of a trick that is difficult to wrap one's head around
			else if (that.node(path, index, {noTemplate:false}).get().length > 0){
				//clone the template node 
				//TODO add support for repeated nodes in forms that do not use template="" (not possible in formhub)
				$template = that.node(path, 0, {noTemplate:false}).get().closest('[template]');
				//TODO test this for nested repeats
				that.cloneTemplate(form.generateName($template), index-1);
				//try setting the value again
				target = that.node(path,index);
				if (target.get().length === 1){				
					target.setVal(value, null, xmlDataType);
				}
				else{
					error = 'Error occured trying to clone template node to set the repeat value of the instance to be edited.';
					console.error(error);
					loadErrors.push(error);
				}
			}
			//as an exception, missing meta nodes will be quietly added if a meta node exists at that path
			//the latter requires e.g the root node to have the correct name
			else if ( $(this).parent('meta').length === 1  && that.node(form.generateName($(this).parent('meta')), 0).get().length === 1){
				//if there is no existing meta node with that node as child
				if(that.node(':first > meta > '+name, 0).get().length === 0){
					console.debug('cloning this direct child of <meta>');
					$(this).clone().appendTo(that.node(':first > meta').get());
				}
				else{
					error = 'Found duplicate meta node ('+name+')!';
					console.error(error);
					loadErrors.push(error);
				}
			}
			else {
				error = 'Did not find form node with path: '+path+' and index: '+index+' so failed to load data.';
				console.error(error);
				loadErrors.push(error);
			}
		});
		//add deprecatedID node, copy instanceID value to deprecatedID and empty deprecatedID
		instanceID = this.node('*>meta>instanceID');
		if (instanceID.get().length !== 1){
			error = 'InstanceID node in default instance error (found '+instanceID.get().length+' instanceID nodes)';
			console.error(error);
			loadErrors.push(error);
			return;
		}
		if (this.node('*>meta>deprecatedID').get().length !== 1){
			var deprecatedIDXMLNode = $.parseXML("<deprecatedID/>").documentElement;
			$(deprecatedIDXMLNode).appendTo(this.node('*>meta').get());
		}
		this.node('*>meta>deprecatedID').setVal(instanceID.getVal()[0], null, 'string');
		instanceID.setVal('', null, 'string');
	};


	//index is the index of the node (defined in Nodeset), that the clone should be added immediately after
	//if a node with that name and that index already exists the node will NOT be cloned
	//almost same as clone() but adds targetIndex and removes template attributes and if no template node exists it will copy a normal node
	//nodeset (givein in node() should include filter noTemplate:false) so it will provide all nodes that that name
	DataXML.prototype.cloneTemplate = function(selector, index){
		////console.log('trying to locate data node with path: '+path+' to clone and insert after node with same xpath and index: '+index);
		var $insertAfterNode, name,
			template = this.node(selector, 0, {onlyTemplate: true}); //eq(0) is actually obsolete
		//console.debug('going to clone date template node with selector: '+selector+' and insert after index '+index);
		//if form does not use jr:template="" but the node-to-clone does exist
		template = (template.get().length === 0) ? this.node(selector, 0) : template;
		name = template.get().prop('nodeName');
		$insertAfterNode = this.node(selector, index).get();

		//if templatenodes and insertafternode(s) have been identified AND the node following insertafternode doesn't already exist(! important for nested repeats!)
		if (template.get().length === 1 && $insertAfterNode.length === 1 && $insertAfterNode.next().prop('nodeName') !== name){//this.node(selector, index+1).get().length === 0){
			//console.log('found data repeat node with template attribute');
			//cloneDataNode(templateNode, insertAfterNode);

			template.clone($insertAfterNode);
			//console.debug('cloning done');
			//templateNode.clone().insertAfter(templateNode.parent().children(templateNode.prop('nodeName')).last()).removeAttr('template');
		}
		else{
			//console.error ('Could locate node: '+path+' with index '+index+' in data instance.There could be multiple template node (a BUG) or none.');
			if ($insertAfterNode.next().prop('nodeName') !== name ){
				console.error('Could not find template node and/or node to insert the clone after');
			}
		}
	};
/**
	 * Function: cloneAllTemplates
	 *
	 * Initialization function that creates <repeat>able data nodes with the defaults from the template if no repeats have been created yet. 
	 * Strictly speaking this is not "according to the spec" as the user should be asked first whether it has any data for this question
	 * but seems usually always better to assume at least one 'repeat' (= 1 question). It doesn't make use of the Nodeset subclass (CHANGE?)
	 *
	 * Parameters:
	 *
	 *   startNode - Provides the scope (default is the whole data object) from which to start cloning.
	 *
	 * Returns:
	 *
	 *   -
	 *
	 * See Also:
	 *
	 *   In JavaRosa, the documentation on the jr:template attribute.
	 * 
	 * @param {jQuery=} startNode
	 */ 
	DataXML.prototype.cloneAllTemplates = function(startNode){
		var _this = this;
		////console.log('cloning all templates once');
		if (typeof startNode == 'undefined' || startNode.length === 0){
			startNode = this.$.find(':first');
		}
		//clone data nodes with template (jr:template=) attribute if it doesn't have any siblings of the same name already
		//strictly speaking this is not "according to the spec" as the user should be asked whether it has any data for this question
		//but I think it is almost always better to assume at least one 'repeat' (= 1 question)
		startNode.children('[template]').each(function(){
			////console.log('found data point with template attribute, name:'+$(this).prop('nodeName'));
			if (typeof $(this).parent().attr('template') == 'undefined' && $(this).siblings($(this).prop('nodeName')).not('[template]').length === 0){
				//console.log('going to clone template data node with name: ' + $(this).prop('nodeName'));
				$(this).clone().insertAfter($(this)).find('*').addBack().removeAttr('template');
				//cloneDataNode($(this));
			}
		});
		startNode.children().not('[template]').each(function(){
			_this.cloneAllTemplates($(this));
		});
		return;
	};

	/**
	 * Function: get
	 * 
	 * Returns jQuery Data Object (obsolete?)
	 * 
	 * Parameters:
	 * 
	 * Returns:
	 * 
	 *   JQuery Data Object
	 *   
	 * See Also:
	 * 
	 *    <nodes.get()>, which is always (?) preferred except for debugging.
	 *   
	 */
	DataXML.prototype.get = function(){
		return this.$ || null;
	};

	/**
	 * Function: getXML
	 * 
	 * Getter for data xml object. REMOVE <INSTANCE>?
	 * 
	 * Returns:
	 * 
	 *   data xml object
	 */
	DataXML.prototype.getXML = function(){
		return this.xml || null;
	};

	/**
	 * Obtains a cleaned up string of the data instance(s)
	 * @param  {boolean=} incTempl indicates whether repeat templates should be included in the return value (default: false)
	 * @param  {boolean=} incNs    indicates whether namespaces should be included in return value (default: false)
	 * @param  {boolean=} all	  indicates whether all instances should be included in the return value (default: false)
	 * @return {string}           XML string
	 */
	DataXML.prototype.getStr = function(incTempl, incNs, all){
		var $docRoot, $dataClone, dataStr;

		all =  all || false;
		incTempl = incTempl || false;
		incNs = incNs || true;

		$docRoot = (all) ? this.$.find(':first') : this.node('> :first').get();
		
		$dataClone = $('<root></root');
		
		$docRoot.clone().appendTo($dataClone);

		if (incTempl === false){
			$dataClone.find('[template]').remove();
		}
		//disabled 
		//if (incNs === true && typeof this.namespace !== 'undefined' && this.namespace.length > 0) {
		//	$dataClone.find('instance').attr('xmlns', this.namespace);
		//}

		dataStr = (new XMLSerializer()).serializeToString($dataClone.children().eq(0)[0]);

		//remove tabs
		dataStr = dataStr.replace(/\t/g, '');

		return dataStr;
	};

	/**
	 * There is a bug in JavaRosa that has resulted in the usage of incorrect formulae on nodes inside repeat nodes. 
	 * Those formulae use absolute paths when relative paths should have been used. See more here:
	 * https://bitbucket.org/javarosa/javarosa/wiki/XFormDeviations (point 3). 
	 * Tools such as pyxform (and xls form?) also build forms in this incorrect manner. It will take time to 
	 * correct this way of making forms so makeBugCompliant() aims to mimic the incorrect 
	 * behaviour by injection the [position] of repeats into the XPath expressions. The resulting expression
	 * will then be evaluated in a way users expect (as if the paths were relative) without having to mess up
	 * the XPath Evaluator. E.g. '/data/rep_a/node_a' could become '/data/rep_a[2]/node_a' if the context is inside 
	 * the second rep_a repeat.
	 * 
	 * This function should be removed as soon as JavaRosa (or maybe just pyxform) fixes the way those formulae
	 * are created (or evaluated).
	 * 
	 * @param  {string} expr  the XPath expression
	 * @param  {string} selector of the (context) node on which expression is evaluated
	 * @param  {number} index of the node with the previous selector in the instance
	 * @return {string} modified expression with injected positions (1-based) 
	 */
	DataXML.prototype.makeBugCompliant = function(expr, selector, index){
		var i, repSelector, repIndex, $repParents,
			attr = ($form.find('[name="'+selector+'"][type="radio"]').length > 0 && index > 0) ? 'data-name' : 'name';

		$repParents = form.input.getWrapNodes($form.find('['+attr+'="'+selector+'"]')).eq(index).parents('.jr-repeat');
		//console.debug('makeBugCompliant() received expression: '+expr+' inside repeat: '+repSelector);
		for (i=0 ; i<$repParents.length ; i++){
			repSelector = /** @type {string} */$repParents.eq(i).attr('name');
			//console.log(repSelector);
			repIndex = $repParents.eq(i).siblings('[name="'+repSelector+'"]').addBack().index($repParents.eq(i)); 
			console.log('calculated repeat 0-based index: '+repIndex);
			expr = expr.replace(repSelector, repSelector+'['+(repIndex+1)+']');
		}
		return expr;
	};

	/**
	 * Evaluates an XPath Expression using XPathJS_javarosa (not native XPath 1.0 evaluator)
	 * 
	 * THIS FUNCTION DOESN'T SEEM TO WORK PROPERLY FOR NODE RESULTTYPES! otherwise:
	 * muliple nodes can be accessed by returned node.snapshotItem(i)(.textContent)
	 * a single node can be accessed by returned node(.textContent)
	 * 
	 * @param  {string} expr       [description]
	 * @param  {string=} resTypeStr boolean, string, number, nodes (best to always supply this)
	 * @param  {string=} selector   jQuery selector which will be use to provide the context to the evaluator
	 * @param  {number=} index      index of selector in document
	 * @return {?(number|string|boolean|jQuery)}            [description]
	 */
	DataXML.prototype.evaluate = function(expr, resTypeStr, selector, index){
		var i, j, error, context, contextDoc, instances, id, resTypeNum, resultTypes, result, $result, attr, 
			$contextWrapNodes, $repParents;

		var timeStart = new Date().getTime();

		console.debug('evaluating expr: '+expr+' with context selector: '+selector+', 0-based index: '+
			index+' and result type: '+resTypeStr);
		resTypeStr = resTypeStr || 'any';
		index = index || 0;

		expr = expr.trim();

		//SEEMS LIKE THE CONTEXT DOC (CLONE) CREATION COULD BE A PERFORMANCE HOG AS IT IS CALLED MANY TIMES, 
		//IS THERE ANY BETTER WAY TO EXCLUDE TEMPLATE NODES AND THEIR CHILDREN?
		contextDoc = new DataXML(this.getStr(false, false));
		/* 
		   If the expression contains the instance('id') syntax, a different context instance is required.
		   However, the same expression may also contain absolute reference to the main data instance, 
		   which means 2 different contexts would have to be supplied to the XPath Evaluator which is not
		   possible. Alternatively, the XPath Evaluator becomes able to use a default instance and direct 
		   the instance(id) references to a sibling instance context. The latter proved to be too hard for 
		   this developer, so as a workaround, the following is used instead:
		   The instance referred to in instance(id) is detached and appended to the main instance. The 
		   instance(id) syntax is subsequently converted to /node()/instance[@id=id] XPath syntax.
		 */
		if (this.instanceSelectRegEx.test(expr)){
			instances = expr.match(this.instanceSelectRegEx);
			for (i=0 ; i<instances.length ; i++){
				id = instances[i].match(/[\'|\"]([^\'']+)[\'|\"]/)[1];
				expr = expr.replace(instances[i], '/node()/instance[@id="'+id+'"]');
				this.$.find('instance#'+id).clone().appendTo(contextDoc.$.find(':first'));
			}
		}
		//console.debug('contextDoc:', contextDoc.$);

		if (typeof selector !== 'undefined' && selector !== null) {
			console.debug('contextNode: ', contextDoc.$.xfind(selector).eq(index));
			context = contextDoc.$.xfind(selector).eq(index)[0];
			/**
			 * If the expressions is bound to a node that is inside a repeat.... see makeBugCompliant()
			 */
			if ($form.find('[name="'+selector+'"]').parents('.jr-repeat').length > 0 ){
				expr = this.makeBugCompliant(expr, selector, index);
			}
		}
		else{
			context = contextDoc.getXML();
		}
		//console.debug('context', context);

		resultTypes = { //REMOVE VALUES? NOT USED
			0 : ['any', 'ANY_TYPE'], 
			1 : ['number', 'NUMBER_TYPE', 'numberValue'],
			2 : ['string', 'STRING_TYPE', 'stringValue'], 
			3 : ['boolean', 'BOOLEAN_TYPE', 'booleanValue'], 
			//NOTE: nodes are actually never requested in this function as DataXML.node().get() is used to return nodes	
			//5 : ['nodes' , 'ORDERED_NODE_ITERATOR_TYPE'],
			7 : ['nodes', 'ORDERED_NODE_SNAPSHOT_TYPE'], //works with iterateNext().textContent
			9 : ['node', 'FIRST_ORDERED_NODE_TYPE']
			//'node': ['FIRST_ORDERED_NODE_TYPE','singleNodeValue'], // does NOT work, just take first result of previous
		};

		//translate typeStr to number according to DOM level 3 XPath constants
		for (resTypeNum in resultTypes){

			resTypeNum = Number(resTypeNum);

			if (resultTypes[resTypeNum][0] == resTypeStr){
				break;
			}
			else{
				resTypeNum = 0;
			}
		}

		expr = expr.replace( /&lt;/g, '<');
		expr = expr.replace( /&gt;/g, '>'); 
		expr = expr.replace( /&quot;/g, '"');

		console.log('expr to test: '+expr+' with result type number: '+resTypeNum);
		try{
			result = document.evaluate(expr, context, null, resTypeNum, null);
			if (resTypeNum === 0){
				for (resTypeNum in resultTypes){
					resTypeNum = Number(resTypeNum);
					if (resTypeNum == Number(result.resultType)){
						result = (resTypeNum >0 && resTypeNum<4) ? result[resultTypes[resTypeNum][2]] : result;
						console.debug('evaluated '+expr+' to: ', result);
						//xpathEvalTime += new Date().getTime() - timeStart;
						return result;
					}
				}
				console.error('Expression: '+expr+' did not return any boolean, string or number value as expected');
				//console.debug(result);
			}
			else if (resTypeNum === 7){
				$result = $();
				//console.log('raw result', result);
				for (j=0 ; j<result.snapshotLength; j++){
					//console.debug(result.snapshotItem(j));
					$result = $result.add(result.snapshotItem(j));
				}
				//console.debug('evaluation returned nodes: ', $result);
				//xpathEvalTime += new Date().getTime() - timeStart;
				return $result;
			}
			console.debug('evaluated '+expr+' to: '+result[resultTypes[resTypeNum][2]]);
			//xpathEvalTime += new Date().getTime() - timeStart;
			return result[resultTypes[resTypeNum][2]];
		}
		catch(e){
			error = 'Error occurred trying to evaluate: '+expr+', message: '+e.message;
			console.error(error);
			$(document).trigger('xpatherror', error);
			loadErrors.push(error);
			//xpathEvalTime += new Date().getTime() - timeStart;
			return null;
		}
	};

	/**
	 * Inner Class dealing with the HTML Form
	 * @param {string} selector jQuery selector of form
	 * @constructor
	 * @extends Form
	 */
	function FormHTML (selector){
		//there will be only one instance of FormHTML
		$form = $(selector);
		//used for testing
		this.$ = $form;
		this.branch = new this.Branch(this);
	}

	FormHTML.prototype.init = function(){
		var name, $required, $hint;

		//this.checkForErrors();

		if (typeof data == 'undefined' || !(data instanceof DataXML)){
			return console.error('variable data needs to be defined as instance of DataXML');
		}
		
		//var profiler = new Profiler('adding required clues');
		//add 'required field'
		$required = '<span class="required">*</span>';//<br />';
		$form.find('label>input[type="checkbox"][required], label>input[type="radio"][required]').parent().parent('fieldset')
			.find('legend:eq(0) span:not(.jr-hint):last').after($required);
		
		$form.parent().find('label>select[required], label>textarea[required], :not(#jr-preload-items, #jr-calculated-items)>label>input[required]')
			.not('[type="checkbox"], [type="radio"], [readonly]').parent()
			.each(function(){
				$(this).children('span:not(.jr-option-translations, .jr-hint):last').after($required);
			});
		//profiler.report();

		//profiler = new Profiler('adding hint icons');
		//add 'hint' icon
		if (!Modernizr.touch){
			$hint = '<span class="hint" ><i class="icon-question-sign"></i></span>';
			$form.find('.jr-hint ~ input, .jr-hint ~ select, .jr-hint ~ textarea').before($hint);
			$form.find('legend > .jr-hint').parent().find('span:last-child').after($hint);
			$form.find('.trigger > .jr-hint').parent().find('span:last').after($hint);
		}
		//profiler.report();

		$form.find('select, input, textarea')
			.not('[type="checkbox"], [type="radio"], [readonly], #form-languages').before($('<br/>'));

		//profiler = new Profiler('repeat.init()');
		this.repeat.init(this); //before double-fieldset magic to fix legend issues
		//profiler.report();

		/*
			Groups of radiobuttons need to have the same name. The name refers to the path of the instance node.
			Repeated radiobuttons would all have the same name which means they wouldn't work right.
			Therefore, radiobuttons store their path in data-name instead and cloned repeats will add a 
			different name attribute.
		 */
		$form.find('input[type="radio"]').each(function(){
			name = /**@type {string} */$(this).attr('name');
			$(this).attr('data-name', name);
		});

		$form.find('h2').first().append('<span/>');

		//profiler = new Profiler('itemsetUpdate()');
		this.itemsetUpdate();
		//profiler.report();
		//
		this.setAllVals();
		
		this.widgets.init(); //after setAllVals()
		
		//profiler = new Profiler('bootstrapify');
		this.bootstrapify(); 
		//profiler.report();

		//profiler = new Profiler('branch.init()');
		this.branch.init();
		//profiler.report();
		
		this.preloads.init(); //after event handlers! NOT NECESSARY ANY MORE I THINK
		
		this.grosslyViolateStandardComplianceByIgnoringCertainCalcs(); //before calcUpdate!
		
		this.calcUpdate();
		
		//profiler = new Profiler('outputUpdate initial');
		this.outputUpdate();
		//profiler.report();

		//profiler = new Profiler('setLangs()');
		this.setLangs();
		//profiler.report();

		//profiler = new Profiler('setHints()');
		this.setHints();
		//profiler.report();

		this.setEventHandlers();
		this.editStatus.set(false);
		//profiler.report('time taken across all functions to evaluate XPath with XPathJS_javarosa: '+xpathEvalTime);
	};

	/**
	 * Checks for general transformation or xml form errors by comparing stats. It is helpful,
	 * though an error is not always important
	 */
	FormHTML.prototype.checkForErrors = function(){
		var i,
			paths = [],
			total = {},
			$stats = $form.find('#stats');

		if ($stats.length > 0){
			total.jrItem= parseInt($stats.find('[id="jrItem"]').text(), 10);
			total.jrInput= parseInt($stats.find('[id="jrInput"]').text(), 10);
			total.jrItemset= parseInt($stats.find('[id="jrItemset"]').text(), 10);
			total.jrUpload = parseInt($stats.find('[id="jrUpload"]').text(), 10);
			total.jrTrigger = parseInt($stats.find('[id="jrTrigger"]').text(), 10);
			total.jrConstraint = parseInt($stats.find('[id="jrConstraint"]').text(), 10);
			total.jrRelevant = parseInt($stats.find('[id="jrRelevant"]').text(), 10);
			total.jrCalculate = parseInt($stats.find('[id="jrCalculate"]').text(), 10);
			total.jrPreload = parseInt($stats.find('[id="jrPreload"]').text(), 10);

			/** @type {number} */
			total.hRadio = $form.find('input[type="radio"]').length;
			total.hCheck = $form.find('input[type="checkbox"]').length;
			total.hSelect = $form.find('select:not(#form-languages)').length;
			total.hItemset = $form.find('.itemset-template').length;
			total.hOption = $form.find('select:not(#form-languages) > option[value!=""]').length;
			total.hInputNotRadioCheck = $form.find('textarea, input:not([type="radio"],[type="checkbox"])').length;
			total.hTrigger = $form.find('.trigger').length;
			total.hRelevantNotRadioCheck = $form.find('[data-relevant]:not([type="radio"],[type="checkbox"])').length;
			total.hRelevantRadioCheck = $form.find('input[data-relevant][type="radio"],input[data-relevant][type="checkbox"]').parent().parent('fieldset').length;
			total.hConstraintNotRadioCheck = $form.find('[data-constraint]:not([type="radio"],[type="checkbox"])').length;
			total.hConstraintRadioCheck = $form.find('input[data-constraint][type="radio"],input[data-constraint][type="checkbox"]').parent().parent('fieldset').length;
			total.hCalculate = $form.find('[data-calculate]').length;
			total.hPreload = $form.find('#jr-preload-items input').length;

			if (total.jrItemset === 0 && (total.jrItem !== ( total.hOption + total.hRadio + total.hCheck ) ) ) {
				console.error(' total number of option fields differs between XML form and HTML form');
			}
			if (total.jrItemset !== total.hItemset ) {
				console.error(' total number of itemset fields differs between XML form ('+total.jrItemset+') and HTML form ('+total.hItemset+')');
			}
			if ( ( total.jrInput + total.jrUpload ) !== ( total.hInputNotRadioCheck - total.hCalculate - total.hPreload ) ){
				console.error(' total number of input/upload fields differs between XML form and HTML form');
			}
			if ( total.jrTrigger != total.hTrigger ){
				console.error(' total number of triggers differs between XML form and HTML form');
			}
			if ( total.jrRelevant != ( total.hRelevantNotRadioCheck + total.hRelevantRadioCheck)){
				console.error(' total number of branches differs between XML form and HTML form (not a problem if caused by obsolete bindings in xml form)');
			}
			if ( total.jrConstraint != ( total.hConstraintNotRadioCheck + total.hConstraintRadioCheck)){
				console.error(' total number of constraints differs between XML form ('+total.jrConstraint+') and HTML form ('+
					(total.hConstraintNotRadioCheck + total.hConstraintRadioCheck)+')(not a problem if caused by obsolete bindings in xml form).'+
					' Note that constraints on &lt;trigger&gt; elements are ignored in the transformation and could cause this error too.');
			}
			if ( total.jrCalculate != total.hCalculate ){
				console.error(' total number of calculated items differs between XML form and HTML form');
			}
			if ( total.jrPreload != total.hPreload ){
				console.error(' total number of preload items differs between XML form and HTML form');
			}
			//probably resource intensive: check if all nodes mentioned in name attributes exist in $data
			
			$form.find('[name]').each(function(){
				if ($.inArray($(this).attr('name'), paths)) {
					paths.push($(this).attr('name'));
				}
			});
			//s//console.debug(paths);
			for (i=0 ; i<paths.length ; i++){
				////console.debug('checking: '+paths[i]);
				if (data.node(paths[i]).get().length < 1){
					console.error('Found name attribute: '+paths[i]+' that does not have a corresponding data node. Transformation error or XML form error (relative nodesets perhaps?');
				}
			}
		}
	};

	//this may not be the most efficient. Could also be implemented like Data.Nodeset;
	//also use for fieldset nodes (to evaluate branch logic) and also used to get and set form data of the app settings
	FormHTML.prototype.input = {
		//multiple nodes are limited to ones of the same input type (better implemented as JQuery plugin actually)
		getWrapNodes: function($inputNodes){
			var type = this.getInputType($inputNodes.eq(0));
			return (type == 'radio' || type == 'checkbox') ? $inputNodes.closest('.restoring-sanity-to-legends') : 
				(type == 'fieldset') ? $inputNodes : $inputNodes.parent('label');
		},
		getProps : function($node){
			if ($node.length !== 1){
				return console.error('getProps(): no input node provided or multiple');
			}
			////console.log('required: '+$node.attr('required'));
			return {
				path: this.getName($node), 
				ind: this.getIndex($node),
				inputType: this.getInputType($node),
				xmlType: this.getXmlType($node),
				constraint: $node.attr('data-constraint'),
				relevant: $node.attr('data-relevant'),
				val: this.getVal($node),
				required: ($node.attr('required') !== undefined && $node.parents('.jr-appearance-label').length === 0) ? true : false,
				enabled: this.isEnabled($node),
				multiple: this.isMultiple($node)
			};
		},
		getInputType : function($node){
			if ($node.length !== 1){
				return ''; //console.error('getInputType(): no input node provided or multiple');
			}
			if ($node.prop('nodeName').toLowerCase() == 'input'){
				if ($node.attr('type').length > 0){
					return $node.attr('type').toLowerCase();
				}	
				else return console.error('<input> node has no type');
			}
			else if ($node.prop('nodeName').toLowerCase() == 'select' ){
				return 'select';
			}
			else if ($node.prop('nodeName').toLowerCase() == 'textarea'){
				return 'textarea';
			}
			else if ($node.prop('nodeName').toLowerCase() == 'fieldset'){
				return 'fieldset';
			}
			else return console.error('unexpected input node type provided');
		},
		getXmlType : function($node){
			if ($node.length !== 1){
				return console.error('getXMLType(): no input node provided or multiple');
			}
			return $node.attr('data-type-xml');
		},
		getName : function($node){
			//var indexSuffix;
			if ($node.length !== 1){
				return console.error('getName(): no input node provided or multiple');
			}
			if (this.getInputType($node) == 'radio'){
				//indexSuffix = $node.attr('name').lastIndexOf('____');
				//if (indexSuffix > 0){
					return $node.attr('data-name');//.substr(0, indexSuffix);
				//}
			}
			if ($node.attr('name') && $node.attr('name').length > 0){
				return $node.attr('name');
			}
			else return console.error('input node has no name');
		},
		//the index that can be used to find the node in $data
		getIndex : function($node){
			var inputType, name, $wrapNode, $wrapNodesSameName;
			if ($node.length !== 1){
				return console.error('getIndex(): no input node provided or multiple');
			}
			inputType = this.getInputType($node);
			name = this.getName($node);

			$wrapNode = this.getWrapNodes($node);

			if (inputType === 'radio' && name !== $node.attr('name')){
				$wrapNodesSameName = this.getWrapNodes($form.find('[data-name="'+name+'"]'));
			}
			else {
				$wrapNodesSameName = this.getWrapNodes($form.find('[name="'+name+'"]'));
			}	

			return $wrapNodesSameName.index($wrapNode);
		},
		isMultiple: function($node){
			return (this.getInputType($node) == 'checkbox' || $node.attr('multiple') !== undefined) ? true : false;
		},
		isEnabled: function($node){
			return ($node.attr('disabled') !== undefined  || $node.parents('fieldset:disabled').length !== 0 ) ? false : true;
		},
		getVal : function($node){
			var inputType, values=[], name;
			if ($node.length !== 1){
				return console.error('getVal(): no inputNode provided or multiple');
			}
			inputType = this.getInputType($node);
			name = this.getName($node);
			
			if (inputType == 'radio'){
				return this.getWrapNodes($node).find('input:checked').val() || '';
			}
			//checkbox values bug in jQuery as (node.val() should work)
			if (inputType == 'checkbox'){		
				this.getWrapNodes($node).find('input[name="'+name+'"]:checked').each(function(){	
					values.push($(this).val());
				});
				return values;
			}
			return (!$node.val()) ? '' : ($.isArray($node.val())) ? $node.val().join(' ').trim() : $node.val().trim();
		},
		setVal : function(name, index, value){
			var $inputNodes, type, date;//, 
				//values = value.split(' ');
			index = index || 0;

			if (this.getInputType($form.find('[data-name="'+name+'"]').eq(0)) == 'radio'){
				//why not use this.getIndex?
				return this.getWrapNodes($form.find('[data-name="'+name+'"]')).eq(index).find('input[value="'+value+'"]').prop('checked', true);
			}
			else {
				//why not use this.getIndex?
				$inputNodes = this.getWrapNodes($form.find('[name="'+name+'"]')).eq(index).find('input, select, textarea');
				
				type = this.getInputType($inputNodes.eq(0)); 
				
				if ( type === 'file'){
					console.error('Cannot set value of file input field (value: '+value+'). If trying to load '+
						'this record for editing this file input field will remain unchanged.');
					return false;
				}

				if ( type === 'date' || type === 'datetime'){
					//convert current value (loaded from instance) to a value that a native datepicker understands
					//TODO test for IE, FF, Safari when those browsers start including native datepickers
					value = data.node().convert(value, type);

					console.debug('converting date before setting input field to: '+value);
				}
			}

			if (this.isMultiple($inputNodes.eq(0)) === true){				
				value = value.split(' ');
			}
			
			$inputNodes.val(value);
			
			return;
		}
	};

	/**
	 *  Uses current content of $data to set all the values in the form.
	 *  Since not all data nodes with a value have a corresponding input element, it could be considered to turn this
	 *  around and cycle through the HTML form elements and check for each form element whether data is available.
	 */
	FormHTML.prototype.setAllVals = function(){
		var index, name, value,
			that=this;	
		data.node(null, null, {noEmpty: true}).get().each(function(){
			try{
				value = $(this).text(); 
				name = that.generateName($(this));
				index = data.node(name).get().index($(this));
				console.debug('calling input.setVal with name: '+name+', index: '+index+', value: '+value);
				that.input.setVal(name, index, value);
			}
			catch(e){
				loadErrors.push('Could not load input field value with name: '+name+' and value: '+value);
			}
		});
		return;
	};

	FormHTML.prototype.setLangs = function(){
		var lang, value, /** @type {string} */curLabel, /** @type {string} */ newLabel,
			that = this,
			defaultLang = $form.find('#form-languages').attr('data-default-lang'),
			$langSelector = $('.form-language-selector');
		
		$('#form-languages').detach().appendTo($langSelector);//insertBefore($('form.jr').parent());
		
		if (!defaultLang || defaultLang === '') {
			defaultLang = $('#form-languages option:eq(0)').attr('value');
		}
		console.debug('default language is: '+defaultLang);

		if ($('#form-languages option').length < 2 ){
			$langSelector.hide();
			$form.find('[lang]').addClass('active');
			//hide the short versions if long versions exist
			$form.find('.jr-form-short.active').each(function(){
				if ($(this).siblings('.jr-form-long.active').length > 0){
					$(this).removeClass('active');
				}
			});
			this.setHints();//defaultLang);
			$form.trigger('changelanguage');
			return;
		}

		$('#form-languages').change(function(event){
			console.error('form-language change event detected!');
			event.preventDefault();
			lang = $(this).val();//attr('lang');
			$('#form-languages option').removeClass('active');
			$(this).addClass('active');

			//$form.find('[lang]').not('.jr-hint, .jr-constraint-msg, jr-option-translations>*').show().not('[lang="'+lang+'"], [lang=""], #form-languages a').hide();
			$form.find('[lang]').removeClass('active').filter('[lang="'+lang+'"], [lang=""]').addClass('active');

			//hide the short versions if long versions exist - DONE IN XSLT NOW
			/*$form.find('.jr-form-short.active').each(function(){
				if ($(this).siblings('.jr-form-long.active').length > 0){
					$(this).removeClass('active');
				}
			});*/

			//swap language of <select> <option>s
			$form.find('select > option').not('[value=""]').each(function(){
				curLabel = /** @type {string} */ $(this).text();
				value = $(this).attr('value');
				
				newLabel = $(this).parent('select').siblings('.jr-option-translations')
					.children('.active[data-option-value="'+value+'"]').text().trim();
				
				newLabel = (typeof newLabel !== 'undefined' && newLabel.length > 0) ? newLabel : curLabel;
				
				$(this).text(newLabel);
			});

			//quickfix for labels and legends that do not contain a span.active without other class
			$form.find('legend span.active:not(.jr-hint, .jr-constraint-msg), label span.active:not(.jr-hint, .jr-constraint-msg)').each(function(){
				if ( $(this).text().trim().length === 0 ){
					$(this).text('[MISSING TRANSLATION]');
				}
			});

			that.setHints();
			$form.trigger('changelanguage');
		});
		//this.setHints();
		//$('#form-languages').val(defaultLang).trigger('change');
	};
		
	/**
	 * setHints updates the hints. It is called whenever the language or output value is changed.
	 * @param { {outputsOnly: boolean}=} options options
	 */
	FormHTML.prototype.setHints = function(options){
		var hint, $hints, $wrapNode, outputsOnly;

		outputsOnly = (options && options.outputsOnly) ? options.outputsOnly : false;

		//not sure why *> is in selectors - could be a performance issue
		$hints = (outputsOnly) ? $form.find('*>.jr-hint>.jr-output').parent() : $form.find('*>.jr-hint');

		$hints.parent().each(function(){
			if ($(this).prop('nodeName').toLowerCase() !== 'label' && $(this).prop('nodeName').toLowerCase() !== 'fieldset' ){
				$wrapNode = $(this).parent('fieldset');
			}
			else{
				$wrapNode = $(this);
			}
			
			hint = ($wrapNode.length > 0 ) ? //&& lang !== 'undefined' && lang !== '') ? 
				$(this).find('.jr-hint.active').text().trim() : $(this).find('span.jr-hint').text().trim();
			
			//console.debug('hint: '+hint);
			if (hint.length > 0){
				//console.debug('setting hint: '+hint);
				//$(this).find('input, select, textarea').attr('title', hint);
				$wrapNode.find('.hint').attr('title', hint);
			}
			else{
				$wrapNode.find('.hint').removeAttr('title');
			}
		});
		$form.find('[title]').tooltip('destroy').tooltip({placement: 'right'}); 
	};

	FormHTML.prototype.editStatus = {
		set : function(status){
			$form.attr('data-edited',Boolean(status));//.toString());
			$form.trigger('edit', status);
		},
		get : function(){
			return ($form.attr('data-edited') === 'true') ? true : false;
		}
	};

	FormHTML.prototype.recordName = {
		set : function(key){
			$form.attr('data-stored-with-key', key);
			//$('#record-name').text(key);
			$form.find('h2 span').text(key);
		},
		get : function() {
			return $form.attr('data-stored-with-key') || null;
		},
		reset : function(){
			$form.removeAttr('data-stored-with-key');
		}
	};


	FormHTML.prototype.recordStatus = {
		set : function(markedFinal){
			$form.attr('data-stored-final', markedFinal.toString());
		},
		get : function() {
			return ($form.attr('data-stored-final') === 'true') ? true : false;
		},
		reset : function(){
			$form.removeAttr('data-stored-final');
		}
	};

	/**
	 * Branch Class (inherits properties of FormHTML Class) is used to manage skip logic
	 *
	 * @constructor
	 */
	FormHTML.prototype.Branch = function(parent){
		/**
		 * Initializes branches, sets delegated event handlers
		 */
		this.init = function(){
			this.update();
		};
		/**
		 * Updates branches based on changed input fields
		 * 
		 * @param  {string=} changedNodeNames [description]
		 * @return {?boolean}                  [description]
		 */
		this.update = function(changedNodeNames){
			var i, p, $branchNode, result, namesArr, cleverSelector, //cacheIndex,
				//relevantCache = {},
				alreadyCovered = [],
				that = this;

			namesArr = (typeof changedNodeNames !== 'undefined') ? changedNodeNames.split(',') : [];
			cleverSelector = (namesArr.length > 0) ? [] : ['[data-relevant]'];
			
			for (i=0 ; i<namesArr.length ; i++){
				cleverSelector.push('[data-relevant*="'+namesArr[i]+'"]');
			}
			//console.debug('the clever selector created: '+cleverSelector.join());

			$form.find(cleverSelector.join()).each(function(){
				//note that $(this).attr('name') is not the same as p.path for repeated radiobuttons!
				if ($.inArray($(this).attr('name'), alreadyCovered) !== -1){
					return;
				}

				p = parent.input.getProps($(this));
				$branchNode = parent.input.getWrapNodes($(this));
				
				//var profiler = new Profiler('updating branches with relevant expression: '+p.relevant);				
				
				if($branchNode.length !== 1){
					console.error('could not find branch node');
					return;
				}
				//note:caching would be meaningless without first detecting whether an expression contains relative
				//paths in order to determine whether the context path+index needs to be added to cacheIndex to e.g.
				//support evaluating branches inside repeats - to be continued.
				//cacheIndex = p.relevant+'__'+p.path+'__'+p.ind;

				//if (typeof relevantCache[cacheIndex] !== 'undefined'){
				//	result = relevantCache[cacheIndex];
				//}
				//else{
				result = data.evaluate(p.relevant, 'boolean', p.path, p.ind);
				//	relevantCache[cacheIndex] = result;
				//}
			
				alreadyCovered.push($(this).attr('name'));
				//console.debug('relevant nodes already covered:',  alreadyCovered);
				//console.debug('relevant expression results cached:', relevantCache);

				//for mysterious reasons '===' operator fails after Advanced Compilation even though result has value true 
				//and type boolean
				if (result === true){
					that.enable($branchNode);
				}
				else {
					that.disable($branchNode);
				}
				//profiler.report();	
			});
	
			return true;

		},
		/**
		 * Enables and reveals a branch node/group
		 * 
		 * @param  {jQuery} $branchNode The jQuery object to reveal and enable
		 */
		this.enable = function($branchNode){
			var type;
			console.debug('enabling branch');
			
			$branchNode.removeClass('disabled pre-init').show(250);//, function(){$(this).fixLegends();} );

			type = $branchNode.prop('nodeName').toLowerCase();

			if (type == 'label') {
				$branchNode.children('input, select, textarea').removeAttr('disabled');
			}
			else{
				$branchNode.removeAttr('disabled');
			}
		};
		/**
		 * Disables and hides a branch node/group
		 * 
		 * @param  {jQuery} $branchNode The jQuery object to hide and disable
		 */
		this.disable = function($branchNode){
			var type = $branchNode.prop('nodeName').toLowerCase(),
				currentlyDisabled = $branchNode.hasClass('disabled'),
				virgin = $branchNode.hasClass('pre-init');

			console.debug('disabling branch');
			$branchNode.addClass('disabled').removeClass('pre-init');

			if (typeof settings !== 'undefined' && typeof settings.showBranch !== 'undefined' && !settings.showBranch){
				$branchNode.hide(250);
			} 
			
			//if the branch was previously enabled
			if (!currentlyDisabled && !virgin){
				$branchNode.clearInputs('change');
			

				//all remaining fields marked as invalid can now be marked as valid
				$branchNode.find('.invalid-required, .invalid-constraint').find('input, select, textarea').each(function(){
					parent.setValid($(this));
				});
			}

			if (type == 'label'){
				$branchNode.children('input, select, textarea').attr('disabled', 'disabled');
			}
			else{
				$branchNode.attr('disabled', 'disabled');
			}
		};
	};

	//$.extend(FormHTML.prototype.Branch.prototype, FormHTML.prototype);


	/**
	 * Updates itemsets
	 * @param  {string=} changedDataNodeNames node names that were recently changed, separated by commas
	 */
	FormHTML.prototype.itemsetUpdate = function(changedDataNodeNames){
		//TODO: test with very large itemset
		var that = this,
			cleverSelector = [],
			needToUpdateLangs = false;

		if (typeof changedDataNodeNames == 'undefined'){
			cleverSelector = ['.itemset-template'];
		}
		else{ 
			$.each(changedDataNodeNames.split(','), function(index, value){
				cleverSelector.push('.itemset-template[data-items-path*="'+value+'"]');
			});
		}

		cleverSelector = cleverSelector.join(',');
		
		$form.find(cleverSelector).each(function(){
			var $htmlItem, $htmlItemLabels, value, 
				$template = $(this),
				newItems = {},
				prevItems = $template.data(),
				templateNodeName = $(this).prop('nodeName').toLowerCase(),
				$labels = $template.closest('label, select').siblings('.itemset-labels'),
				itemsXpath = $template.attr('data-items-path'),
				labelType = $labels.attr('data-label-type'),
				labelRef = $labels.attr('data-label-ref'),
				valueRef = $labels.attr('data-value-ref'),
				$instanceItems = data.evaluate(itemsXpath, 'nodes');

			// this property allows for more efficient 'itemschanged' detection
			newItems.length = $instanceItems.length; 
			//this may cause problems for large itemsets. Use md5 instead?
			newItems.text = $instanceItems.text(); 

			//console.debug('previous items: ', prevItems);
			//console.debug('new items: ', newItems);

			if (newItems.length === prevItems.length && newItems.text === prevItems.text){
				console.debug('itemset unchanged');
				return;
			}

			$template.data(newItems);
			
			//clear data values through inputs. Note: if a value exists, 
			//this will trigger a dataupdate event which may call this update function again
			$(this).closest('label > select, fieldset > label').parent()
				.clearInputs('change')
				.find(templateNodeName).not($template).remove();
			$(this).parent('select').siblings('.jr-option-translations').empty();

			$instanceItems.each(function(){
				$htmlItem = $('<root/>');
				$template
					.clone().appendTo($htmlItem)
					.removeClass('itemset-template')
					.addClass('itemset')
					.removeAttr('data-items-path');
				
				$htmlItemLabels = (labelType === 'itext') ? 
					$labels.find('[data-itext-id="'+$(this).children(labelRef).text()+'"]').clone() : 
					$('<span class="active" lang="">'+$(this).children(labelRef).text()+'</span>');
				
				value = /**@type {string}*/$(this).children(valueRef).text();
				$htmlItem.find('[value]').attr('value', value);

				if (templateNodeName === 'label'){
					$htmlItem.find('input')
						.after($htmlItemLabels);
					$labels.before($htmlItem.find(':first'));
				}
				else if (templateNodeName === 'option') { 
					needToUpdateLangs = true;
					if ($htmlItemLabels.length === 1){
						$htmlItem.find('option').text($htmlItemLabels.text());
					}
					$htmlItemLabels
						.attr('data-option-value', value)
						.attr('data-itext-id', '')
						.appendTo($labels.siblings('.jr-option-translations'));
					$template.siblings().addBack().last().after($htmlItem.find(':first'));
				}
			});			
		});
		if (needToUpdateLangs){
			//that.setLangs();
			$('#form-languages').trigger('change');
		}	
	};

	/**
	 * Updates output values, optionally filtered by those values that contain a changed node name
	 * 
	 * @param  {string=} changedNodeNames Comma-separated node names that (may have changed)
	 */
	FormHTML.prototype.outputUpdate = function(changedNodeNames){
		var i, expr, namesArr, cleverSelector, 
			outputChanged = false,
			outputCache = {},
			val='';
		/** 
		 * issue #141 on modilabs/enketo was found to be a very mysterious one. In a very short form (random.xml)
		 * it was found that the outputs were not updated because the cleverSelector did not find any nodes
		 * It must have something to do with the DOM not having been built or something, because a 1 millisecond!!!
		 * delay in executing the code below, the issue was resolved. To be properly fixed later...
		 */	
		//TODO: DOES THIS REQUIRE EVALUATE?? OR WOULD data.node(expr).getVal()[0] WORK TOO??
		//setTimeout(function(){
		//console.log('updating active outputs that contain: '+changedNodeNames);
		
		namesArr = (typeof changedNodeNames !== 'undefined') ? changedNodeNames.split(',') : [];
		cleverSelector = (namesArr.length > 0) ? [] : ['.jr-output[data-value]'];
		for (i=0 ; i<namesArr.length ; i++){
			cleverSelector.push('.jr-output[data-value*="'+namesArr[i]+'"]');
		}
		
		$form.find(':not([disabled]) span.active').find(cleverSelector.join()).each(function(){
			expr = $(this).attr('data-value');

			if (typeof outputCache[expr] !== 'undefined'){
				val = outputCache[expr];
			}
			else{
				val = data.evaluate(expr, 'string');
				outputCache[expr] = val;
			}
			if ($(this).text !== val){
				$(this).text(val);
				outputChanged = true;
			}
		});

		//hints may have changed too
		if (outputChanged){
			this.setHints({outputsOnly: true});
		}
		//}, 1);
	};

	/**
	 * See https://groups.google.com/forum/?fromgroups=#!topic/opendatakit-developers/oBn7eQNQGTg
	 * and http://code.google.com/p/opendatakit/issues/detail?id=706
	 * 
	 * Once the following is complete this function can and should be removed:
	 * 
	 * 1. ODK Collect starts supporting an instanceID preload item (or automatic handling of meta->instanceID without binding)
	 * 2. Pyxforms changes the instanceID binding from calculate to preload (or without binding)
	 * 3. Formhub has re-generated all stored XML forms from the stored XLS forms with the updated pyxforms
	 * 
	 */
	FormHTML.prototype.grosslyViolateStandardComplianceByIgnoringCertainCalcs = function(){
		var $culprit = $form.find('[name$="/meta/instanceID"][data-calculate]');
		if ($culprit.length > 0){
			console.debug("Found meta/instanceID with binding that has a calculate attribute and removed this calculation. It ain't right!");
			$culprit.removeAttr('data-calculate');
		}
	};

	//var updatingCalcs;
	//@changedNodeNames {String} comma-separated list of changed data node names
	/**
	 * Function: calcUpdate
	 * 
	 * description
	 * 
	 * Parameters:
	 * 
	 *   @param {string=} changedNodeNames - [type/description]
	 * 
	 * Returns:
	 * 
	 *   return description
	 */
	FormHTML.prototype.calcUpdate = function(changedNodeNames){
		var i, name, expr, dataType, result, constraint, namesArr, valid, cleverSelector;

		//console.log('updating calculated items with expressions that contain: '+changedNodeNames);
		namesArr = (typeof changedNodeNames !== 'undefined') ? changedNodeNames.split(',') : [];
		cleverSelector = (namesArr.length > 0) ? [] : ['input[data-calculate]'];
		for (i=0 ; i<namesArr.length ; i++){
			cleverSelector.push('input[data-calculate*="'+namesArr[i]+'"]');
		}
		//console.debug('the clever selector created: '+cleverSelector.join());
		//if(!updatingCalcs){
			//updatingCalcs = true; //ACTUALLY THIS IS NOT CORRECT! BUT performance could become an issue
			// would be better to call at least twice if a value changes.
			
		$form.find('#jr-calculated-items').find(cleverSelector.join()).each(function(){
			name = $(this).attr('name');
			expr = $(this).attr('data-calculate');
			dataType = $(this).attr('data-type-xml');
			constraint = $(this).attr('data-constraint'); //obsolete?
			result = data.evaluate(expr, 'string', name, null); //not sure if using 'string' is always correct
			//console.debug('evaluated calculation: '+expr+' with result: '+result);
			valid = data.node(name, null).setVal(result, constraint, dataType);
			//if(valid !== 'undefined' && valid === false){
				//console.log('Calculated item with name: '+name+' value was set but does not have a valid value!');
			//}
		});
		//}
		//updatingCalcs = false;
	};

	FormHTML.prototype.bootstrapify = function(){				
		//if no constraintmessage use a default
		$form.addClass('clearfix')
			.find('label, legend').each(function(){
			var $label = $(this);
			if ($label.siblings('legend').length === 0 && 
				$label.find('.jr-constraint-msg').length === 0 && 
				($label.prop('nodeName').toLowerCase() == 'legend' || 
					$label.children('input.ignore').length !== $label.children('input').length  ||
					$label.children('select.ignore').length !== $label.children('select').length ||
					$label.children('textarea.ignore').length !== $label.children('textarea').length ) ){
				$label.prepend('<span class="jr-constraint-msg" lang="">Value not allowed</span>');
			}
		});

		$form.find('.trigger').addClass('alert alert-block');
		//$form.find('label:not(.geo), fieldset').addClass('clearfix');
		/*$form.find(':checkbox, :radio').each(function(){
			var $p = $(this).parent('label'); 
			$(this).detach().prependTo($p);
		});*/
		//move constraint message to bottom of question and add message for required (could also be done in XSLT)
		$form.find('.jr-constraint-msg').parent().each(function(){
			var $msg = $(this).find('.jr-constraint-msg').detach(),
				$wrapper = $(this).closest('label, fieldset');
			$msg.after('<span class="jr-required-msg" lang="">This field is required</span>');
			$wrapper.append($msg);
		});

		$('.form-header [title]').tooltip({placement: 'bottom'});
	};

	/**
	 * Enhancements to the basic built-in html behaviour of form controls
	 *
	 * In the future it would probably be wise to standardize this. E.g. each form control widget needs to:
	 * - have a widget class attribute
	 * - load default values from the original input element
	 * - have a 'swap language' function responding to a 'changelanguage' event
	 * - disable when its parent branch is hidden (also when hidden upon initialization)
	 * - enable when its parent branch is revealed 
	 * - allow setting an empty value (that empties node in instance)
	 * - send a focus event to the original input when the widget gets focus
	 *
	 * Considering the ever-increasing code size of the widgets and their dependence on the UI library being used,
	 * it would be good to move them to a separate javascript file. 
	 * (If typeof widgets === undefined, widgets are not loaded)
	 * 
	 * @type {Object}
	 */
	FormHTML.prototype.widgets = {
		/**
		 * Initializes widgets. 
		 * (Important:  Widgets should be initalized after instance values have been loaded in $data as well as in input fields)
		 * @param  {jQuery=} $group optionally only initialize widgets inside a group (default is inside whole form)
		 */
		init : function($group){
			/* 
				For the sake of convenience it is assumed that the $group parameter is only provided when initiating
				widgets inside newly cloned repeats and that this function has been called before for the whole form.
			*/
			this.repeat = ($group) ? true : false;
			this.$group = $group || $form;
			this.readonlyWidget(); //call before other widgets
			this.pageBreakWidget();
			if (!Modernizr.touch){
				this.dateWidget();
				this.timeWidget();
				this.dateTimeWidget();
				this.selectWidget();
			}
			else{
				this.touchRadioCheckWidget();
			}
			this.geopointWidget();
			this.tableWidget();
			this.spinnerWidget();
			this.sliderWidget();	
			this.barcodeWidget();
			this.fileWidget();
			this.mediaLabelWidget();
			this.radioWidget();
		},
		radioWidget : function(){
			if (!this.repeat){
				$form.on('click', 'label[data-checked="true"]', function(event){
					$(this).removeAttr('data-checked');
					$(this).parent().find('input').prop('checked', false).trigger('change');
					if (event.target.nodeName.toLowerCase() !== 'input'){
						return false;
					}
				});
				$form.on('click', 'input[type="radio"]:checked', function(event){
					$(this).parent('label').attr('data-checked', 'true');
				});
				//defaults
				$form.find('input[type="radio"]:checked').parent('label').attr('data-checked', 'true');
			}
		},
		touchRadioCheckWidget : function(){
			if (!this.repeat){
				$form.find('fieldset:not(.jr-appearance-compact, .jr-appearance-quickcompact, .jr-appearance-label, .jr-appearance-list-nolabel )')
					.children('label')
					.children('input[type="radio"], input[type="checkbox"]').parent('label').addClass('btn');
			}
		},
		dateWidget : function(){
			this.$group.find('input[type="date"]').each(function(){
				var $dateI = $(this),
					$p = $(this).parent('label'),
					startView = ($p.hasClass('jr-appearance-month-year')) ? 'year' :
						($p.hasClass('jr-appearance-year')) ? 'decade' : 'month',
					targetEvent = ($p.hasClass('jr-appearance-month-year')) ? 'changeMonth' :
						($p.hasClass('jr-appearance-year')) ? 'changeYear' : 'changeDate',
					format = (startView === 'year') ? 'yyyy-mm' :
						(startView === 'decade') ? 'yyyy' : 'yyyy-mm-dd',
					$fakeDate = $('<div class="widget input-append date"><input class="ignore input-small" type="text" value="'+$(this).val()+'" placeholder="'+format+'" />'+
						'<span class="add-on"><i class="icon-calendar"></i></span></div>'),
					$fakeDateI = $fakeDate.find('input');
				$dateI.hide().after($fakeDate);

				$fakeDateI.on('change', function(){
					console.debug('fakedate input field change detected');
					var date,
						value = $(this).val();
					if(value.length > 0){
						value = (format === 'yyyy-mm') ? value+'-01' : (format === 'yyyy') ? value+'-01-01' : value;
						$dateI.val(data.node().convert(value, 'date')).trigger('change').blur();
						date = new Date(value.split('-')[0], Number (value.split('-')[1]) - 1, value.split('-')[2]);
						//the 'update' method only works for full dates, not yyyy-mm and yyyy dates, so this convoluted
						//method is used by using setDate
						$fakeDate.datepicker('setDate', new Date(date));
					}
					else{
						$dateI.val('').trigger('change').blur();
					} 
					return false;
				});

				$fakeDateI.on('focus blur', function(event){
					$dateI.trigger(event.type);
				});

				$fakeDate.datepicker({format: format, autoclose: true, todayHighlight: true, startView: startView})
					.on(targetEvent, function(e) {
						//console.debug(e.type+' detected');
						var dp = /** @type {{date:Date, setValue:Function, hide:Function}} */ $(e.currentTarget).data('datepicker');
						dp.date = e.date;
						dp.setValue();
						dp.hide();
						$fakeDateI.trigger('change');
					});
			});
		},
		timeWidget : function(){
			this.$group.find('input[type="time"]').each(function(){
				var $timeI = $(this),
					$p = $(this).parent('label'),
					timeVal = $(this).val(),
					$fakeTime = $('<div class="widget input-append bootstrap-timepicker-component">'+
						'<input class="ignore timepicker-default input-small" type="text" value="'+timeVal+'" placeholder="hh:mm" />'+
						'<span class="add-on"><i class="icon-time"></i></span></div>'),
					$fakeTimeI = $fakeTime.find('input');
				
				$timeI.hide().after($fakeTime);
				$fakeTimeI.timepicker({
					defaultTime: (timeVal.length > 0) ? 'value' : 'current',
					showMeridian: false
				}).val(timeVal);

				$fakeTimeI.on('change', function(){
					console.debug('detected change event on fake time input');
					$timeI.val($(this).val()).trigger('change').blur();
					return false;
				});

				$fakeTimeI.on('focus blur', function(event){
					$timeI.trigger(event.type);
				});
			});
		}, 
		//Note: this widget doesn't offer a way to reset a datetime value in the instance to empty
		dateTimeWidget : function(){
			this.$group.find('input[type="datetime"]').each(function(){	
				var $dateTimeI = $(this),
					/*
						Loaded or default datetime values remain untouched until they are edited. This is done to preserve 
						the timezone information (especially for instances-to-edit) if the values are not edited (the
						original entry may have been done in a different time zone than the edit). However, 
						values shown in the widget should reflect the local time representation of that value.
					 */
					val = ($(this).val().length > 0) ? new Date($(this).val()).toISOLocalString() : '',
					vals = val.split('T'),
					dateVal = vals[0], 
					timeVal = (vals[1] && vals[1].length > 4) ? vals[1].substring(0,5) : '',
					$fakeDate = $('<div class="input-append date" >'+
						'<input class="ignore input-small" type="text" value="'+dateVal+'" placeholder="yyyy-mm-dd"/>'+
						'<span class="add-on"><i class="icon-calendar"></i></span></div>'),
					$fakeTime = $('<div class="input-append bootstrap-timepicker-component">'+
						'<input class="ignore timepicker-default input-small" type="text" value="'+timeVal+'" placeholder="hh:mm"/>'+
						'<span class="add-on"><i class="icon-time"></i></span></div>'),
					$fakeDateI = $fakeDate.find('input'),
					$fakeTimeI = $fakeTime.find('input');

				$dateTimeI.hide().after('<div class="datetimepicker widget" />');
				$dateTimeI.siblings('.datetimepicker').append($fakeDate).append($fakeTime);
				$fakeDate.datepicker({format: 'yyyy-mm-dd', autoclose: true, todayHighlight: true});
				$fakeTimeI.timepicker({defaultTime: (timeVal.length > 0) ? 'value' : 'current', showMeridian: false}).val(timeVal);
				
				$fakeDateI.on('change changeDate', function(){
					changeVal();
					return false;
				});
				$fakeTimeI.on('change', function(){
					changeVal();
					return false;
				});
				$fakeDateI.add($fakeTimeI).on('focus blur', function(event){
					$dateTimeI.trigger(event.type);
				});

				function changeVal(){
					if ($fakeDateI.val().length > 0 && $fakeTimeI.val().length > 0){
						var d = $fakeDateI.val().split('-'),
							t = $fakeTimeI.val().split(':');
						console.log('changing datetime');
						$dateTimeI.val(new Date(d[0], d[1]-1, d[2], t[0], t[1]).toISOLocalString()).trigger('change').blur();
					}
					else{
						$dateTimeI.val('').trigger('change').blur();
					}
				}
			});
		},
		selectWidget : function(){
			//$form.find('select option[value=""]').remove(); issue with init value empty
			this.$group.find('select').not('#form-languages').selectpicker();
			if (!this.repeat){
				$form.on('changelanguage', function(){
					$form.find('select').selectpicker('update');
				});
			}
		},
		//transforms triggers to page-break elements //REMOVE WHEN NIGERIA FORMS NO LONGER USE THIS
		pageBreakWidget : function(){
			if (!this.repeat){
				$form.find('.jr-appearance-page-break input[readonly]').parent('label').each(function(){
					var	name = 'name="'+$(this).find('input').attr('name')+'"';
					$('<hr class="manual page-break" '+name+'></hr>') //ui-corner-all
						.insertBefore($(this)).find('input').remove(); 
					$(this).remove();
				});
			}
		},
		//transforms readonly inputs into triggers
		readonlyWidget : function(){
			if (!this.repeat){
				$form.find('input[readonly]:not([data-type-xml="geopoint"])').parent('label').each(function(){
					//var $spans = $(this).find('span').not('.question-icons span').detach(); 
					var html = $(this).html(),
						relevant = $(this).find('input').attr('data-relevant'),
						branch = (relevant) ? ' jr-branch pre-init' : '',
						name = 'name="'+$(this).find('input').attr('name')+'"',
						attributes = (typeof relevant !== 'undefined') ? 'data-relevant="'+relevant+'" '+name : name,
						value = $(this).find('input, select, textarea').val();
					$('<fieldset class="trigger'+branch+'" '+attributes+'></fieldset>')
						.insertBefore($(this)).append(html).append('<div class="note-value">'+value+'</div>').find('input').remove(); 
					$(this).remove();
				});
			}
		},
		tableWidget :function(){
			if (!this.repeat){
				//when loading a form dynamically the DOM elements don't have a width yet (width = 0), so we call
				//this with a bit of a delay..
				setTimeout(function(){
					$form.find('.jr-appearance-field-list .jr-appearance-list-nolabel, .jr-appearance-field-list .jr-appearance-label')
						.parent().parent('.jr-appearance-field-list').each(function(){
							$(this).find('.jr-appearance-label label>img').parent().toSmallestWidth();
							$(this).find('label').toLargestWidth();
							$(this).find('legend').toLargestWidth();
					});
				}, 500);	
			}
			//$form.find('.jr-appearance-compact label img').selectable();
		},
		spinnerWidget :function(){
			//$form.find('input[type="number"]').spinner();
		},
		sliderWidget : function(){
			//detect max and min with algorithm that evaluates expressions multiple times
			//algortithm could guess likely border values by using a regular expression search...
		},
		geopointWidget : function(){
			this.$group.find('input[data-type-xml="geopoint"]').geopointWidget({touch: Modernizr.touch});
		},
		autoCompleteWidget: function(){

		},
		barcodeWidget : function(){
			//$form.find('input[data-type-xml="barcode"]').attr('placeholder', 'not supported in browser data entry').attr('disabled', 'disabled');
		},
		fileWidget : function(){
			if (!this.repeat){
				this.$group.find('input[type="file"]').attr('placeholder', 'not supported yet').attr('disabled', 'disabled')
					.hide().after('<span class="text-warning">Image/Video/Audio uploads are not (yet) supported in enketo.</span>');
			}
			/*
				Some cool code to use for image previews:
				$fileinput = $(this);
				file = $fileinput[0].files[0];
				src = window.URL.createObjectURL(file);
				$img = $('<img src="'+src+'"/>');

				see here a solution for chrome (VERY state of the art)
				http://jsfiddle.net/MartijnR/rtU6f/10/

				Good references:
				http://www.html5rocks.com/en/tutorials/file/filesystem/#toc-filesystemurls
				http://updates.html5rocks.com/2012/08/Integrating-input-type-file-with-the-Filesystem-API
				http://html5-demos.appspot.com/static/filesystem/generatingResourceURIs.html
			 */
		},
		mediaLabelWidget : function(){
			//improve looks when images, video or audio is used as label
			if (!this.repeat){
				$('fieldset:not(.jr-appearance-compact, .jr-appearance-quickcompact)>label, '+
					'fieldset:not(.jr-appearance-compact, .jr-appearance-quickcompact)>legend')
					.children('img,video,audio').parent().addClass('with-media clearfix');
			}
		}
	};

	/*
	 * Note that preloaders may be deprecated in the future and be handled as metadata without bindings at all, in which
	 * case all this stuff should perhaps move to DataXML
	 */
	//functions are design to fail silently if unknown preloaders are called
	FormHTML.prototype.preloads = {
		init: function(){
			var item, param, name, curVal, meta, dataNode, xmlType,
				that = this;
			//console.log('initializing preloads');
			//these initialize actual preload items
			$form.find('#jr-preload-items input').each(function(){
				item = $(this).attr('data-preload').toLowerCase();
				param = $(this).attr('data-preload-params').toLowerCase();
				name = $(this).attr('name');
				xmlType = $(this).attr('data-type-xml');
				if (typeof that[item] !== 'undefined'){
					dataNode = data.node(name);
					//proper way would be to add index
					curVal = dataNode.getVal()[0];
					//that.setVal($(this), that[item]({param: param, curVal:curVal, node: $(this)}));
					that.setDataVal(dataNode, that[item]({param: param, curVal:curVal, node: $(this)}), xmlType);
				}
				else{
					console.error('Preload "'+item+'"" not supported. May or may not be a big deal.');
				}
			});
			//in addition the presence of certain meta data in the instance may automatically trigger a preload function
			//even if the binding is not present. Note, that this actually does not deal with HTML elements at all.
			meta = data.node('*>meta>*');
			meta.get().each(function(){
				item = null;
				name = $(this).prop('nodeName');
				//console.debug('meta data item found: '+name);
				//console.debug($(this));
				dataNode = data.node('*>meta>'+name);
				curVal = dataNode.getVal()[0];
				//first check if there isn't a binding with a preloader that already took care of this
				if($form.find('#jr-preload-items input[name$="/meta/'+name+'"][data-preload]').length === 0){
					switch (name){
						case 'instanceID':
							item = 'instance';
							param = '';
							break;
						case 'timeStart':
							item = 'timestamp';
							param = 'start';
							break;
						case 'timeEnd':
							item = 'timestamp';
							param = 'end';
							break;
					}
				}
				if (item){
					that.setDataVal(dataNode, that[item]({param: param, curVal:curVal, dataNode:dataNode}), null, 'string');
				}
			});
		},
		/**TODO: remove this, it seems better to directly set value in model instead of going through input **/
		setVal: function($node, val){
			$node.val(val.toString()).trigger('change');
		},
		setDataVal: function(node, val, type){
			type = type || 'string';
			console.debug('setting preloader data value to: '+val+' with xml type: '+type);
			node.setVal(val, null, type);
		},
		'timestamp' : function(o){
			var value,
				that = this;
			// when is 'start' or 'end'
			if (o.param == 'start'){
				return (o.curVal.length > 0) ? o.curVal : data.evaluate('now()', 'string');
			}
			if (o.param == 'end'){
				//set event handler for each save event (needs to be triggered!)
				$form.on('beforesave', function(){
					value = data.evaluate('now()', 'string');
					//if this is a preload item (and has a html input node)
					if (o.node){
						that.setVal(o.node, value);
					}
					//otherwise this is a metadata node
					else{
						that.setDataVal(o.dataNode, value);
					}
				});
				return data.evaluate('now()', 'string');
			}
			return '';
		},
		'date' : function(o){
			var today, year, month, day;
			//console.debug('date preloader called with current val: '+o.curVal);
			if (o.curVal.length === 0){
				today = new Date(data.evaluate('today()', 'string'));
				year = today.getFullYear().toString().pad(4);
				month = (today.getMonth() + 1).toString().pad(2);
				day = today.getDate().toString().pad(2);

				return year+'-'+month+'-'+day;
			}
			return o.curVal;
		},
		'property' : function(o){
			// of = 'deviceid', 'subscriberid', 'simserial', 'phonenumber'
			// return '' except for deviceid?
			if (o.curVal.length === 0){
				return 'no device properties in enketo';
			}
			return o.curVal;
		},
		'context' : function(o){
			// 'application', 'user'??
			if (o.curVal.length === 0){
				return (o.param == 'application') ? 'enketo' : o.param+' not supported in enketo';
			}
			return o.curVal;
		},
		'patient' : function(o){
			if (o.curVal.length === 0){
				return 'patient preload not supported in enketo';
			}
			return o.curVal;
		},
		'user' : function(o){
			//uuid, user_id, user_type
			//if (o.param == 'uuid'){
			//	return (o.curVal.length > 1) ? o.curVal : data.evaluate('uuid()', 'string');
			//}
			if (o.curVal.length === 0){
				return 'user preload item not supported in enketo yet';
			}
			return o.curVal;
		},
		'uid' : function(o){
			//general 
			if (o.curVal.length === 0){
				return 'no uid yet in enketo';
			}
			return o.curVal;
		},
		'browser' : function(o){
			//console.debug('evaluation browser preload');
			if (o.curVal.length === 0){
				if (o.param == 'name'){	
					var a = ($.browser.webkit) ? 'webkit' : ($.browser.mozilla) ? 'mozilla' : ($.browser.opera) ? 'opera' : ($.browser.msie) ? 'msie' : 'unknown';
					//console.debug(a);
					return a;
				}
				if (o.param == 'version'){
					return $.browser.version;
				}
				return o.param+' not supported in enketo';
			}
			return o.curVal;
		},
		'os': function(o){
			if (o.curVal.length === 0){
				return 'not known';
			}
			return o.curVal;
		},
		//Not according to spec yet, this will be added to spec but name may change
		'instance' : function(o){
			return (o.curVal.length > 0) ? o.curVal : data.evaluate("concat('uuid:', uuid())", 'string');
		}
	};

/**
 * Variable: repeat
 * 
 * This can perhaps be simplified and improved by:
 * - adding a function repeat.update() that looks at the instance whether to add repeat form fields
 * - calling update from init() (data.init() is called before form.init() so the initial repeats have been added already)
 * - when button is clicked data.node().clone() or data.node().remove() is called first and then repeat.update()
 * - watch out though when repeats in the middle are removed... or just disable that possibility
 * 
 */
	FormHTML.prototype.repeat = {
		/**
		 * Initializes all Repeat Groups in form (only called once).
		 * @param  {FormHTML} formO the parent form object
		 */
		init : function(formO){
			var i, numRepsInCount, repCountPath, numRepsInInstance, numRepsDefault,
				that=this;
			//console.debug('initializing repeats');
			this.formO = formO;
			$form.find('fieldset.jr-repeat').prepend('<span class="repeat-number"></span>');
			$form.find('fieldset.jr-repeat:not([data-repeat-fixed])')
				.append('<button type="button" class="btn repeat"><i class="icon-plus"></i></button>'+
					'<button type="button" disabled="disabled" class="btn remove"><i class="icon-minus"></i></button>');

			//delegated handlers (strictly speaking not required, but checked for doubling of events -> OK)
			$form.on('click', 'button.repeat:enabled', function(){
				//create a clone
				that.clone($(this).parent('fieldset.jr-repeat'));
				//prevent default
				return false;
			});
			$form.on('click', 'button.remove:enabled', function(){
				//remove clone
				that.remove($(this).parent('fieldset.jr-repeat.clone'));
				//prevent default
				return false;
			});
			//if the number of repeats is fixed
			//$form.find('fieldset.jr-repeat[data-repeat-fixed]').each(function(){
//				var numberOfRepeats = 1;
//				//ADD CODE TO determine number of repeats from Xpath reference
//				for (i=1 ; i <  numberOfRepeats ; i++){
//				//call repeatNode from child of $(this)
//				}
//			});

			//clone form fields to create the default number 
			//NOTE THIS ASSUMES THE DEFAULT NUMBER IS STATIC, NOT DYNAMIC!!
			$form.find('fieldset.jr-repeat').each(function(){
				repCountPath = $(this).attr('data-repeat-count') || "";
				numRepsInCount = (repCountPath.length > 0) ? parseInt(data.node(repCountPath).getVal()[0], 10) : 0;
				//console.debug('number of reps in count attribute: ' +numRepsInCount);
				numRepsInInstance = data.node($(this).attr('name')).get().length;
				numRepsDefault = (numRepsInCount > numRepsInInstance) ? numRepsInCount : numRepsInInstance;
				
				//console.log('default number of repeats for '+$(this).attr('name')+' is '+numRepsDefault);
				//1st rep is already included (by XSLT transformation)
				for (i = 1 ; i<numRepsDefault ; i++){
					that.clone($(this).siblings().addBack().last(), '');
				}
			});
		},
		/**
		 * clone a repeat group/node
		 * @param  {jQuery} $node node to clone
		 * @return {boolean}       [description]
		 */
		clone : function($node){
			var $master, $clone, $parent, index, radioNames, i, path, timestamp,
				that = this;
			if ($node.length !== 1){
				console.error('Nothing to clone');
				return false;
			}
			$parent = $node.parent('fieldset.jr-group');
			$master = $parent.children('fieldset.jr-repeat:not(.clone)').eq(0);
			$clone = $master.clone(false);//deep cloning with button events causes problems
			
			//add clone class, remove any clones inside this clone.. (cloned repeats within repeats..)
			//also remove all widgets
			$clone.addClass('clone').find('.clone, .widget').remove();
			
			//mark all cloned fields as valid
			$clone.find('.invalid-required, .invalid-constraint').find('input, select, textarea').each(function(){
				that.formO.setValid($(this)); 
			});

			$clone.insertAfter($node)
				.parent('.jr-group').numberRepeats();
			$clone.hide().show(600).clearInputs('');

			//re-initiate widgets in clone
			this.formO.widgets.init($clone);
			
			//note: in http://formhub.org/formhub_u/forms/hh_polio_survey_cloned/form.xml a parent group of a repeat
			//has the same ref attribute as the nodeset attribute of the repeat. This would cause a problem determining 
			//the proper index if .jr-repeat was not included in the selector
			index = $form.find('fieldset.jr-repeat[name="'+$node.attr('name')+'"]').index($node);
			//parentIndex = $form.find('[name="'+$master.attr('name')+'"]').parent().index($parent);
			//add ____x to names of radio buttons where x is the index
			radioNames = [];
			
			$clone.find('input[type="radio"]').each(function(){
				if ($.inArray($(this).attr('data-name'), radioNames) === -1){
					radioNames.push($(this).attr('data-name'));
				}
			});
			console.debug ('different radioNames in clone: '+radioNames.join());
			for (i=0; i<radioNames.length ;i++){
				//amazingly, this executes so fast when compiled that the timestamp in milliseconds is
				//not sufficient guarantee of uniqueness (??)
				timestamp = new Date().getTime().toString()+'_'+Math.floor((Math.random()*10000)+1);
				$clone.find('input[type="radio"][data-name="'+radioNames[i]+'"]').attr('name', timestamp);
			}

			this.toggleButtons($master.parent());

			//create a new data point in <instance> by cloning the template node
			path = $master.attr('name');

			//0-based index of node in a jquery resultset when using a selector with that name attribute
			console.log('index of form node to clone: '+index);
			/*
			 * clone data node if it doesn't already exist
			 */
			if (path.length > 0 && index >= 0 ){//&& data.node(path, index+1).get().length === 0){
				////console.debug('calling data.cloneTemplate');
				data.cloneTemplate(path, index);
			}

			$form.trigger('changerepeat'); 
			return true;
		},
		remove : function(node){
			var delay = 600,// dataNode,
				that = this,
				repeatPath = node.attr('name'),
				repeatIndex = $form.find('fieldset.jr-repeat[name="'+repeatPath+'"]').index(node),
				parentGroup = node.parent('fieldset.jr-group');
		
			node.hide(delay, function(){
				node.remove();
				parentGroup.numberRepeats();

				that.toggleButtons(parentGroup);
				$form.trigger('changerepeat'); 
				//now remove the data node
				data.node(repeatPath, repeatIndex).remove();
			});
		},
		toggleButtons : function($node){
			//var constraint;
			console.debug('toggling repeat buttons');
			$node = (typeof $node == 'undefined' || $node.length === 0 || !$node) ?	$node = $form : $node;
			
			//first switch everything off and remove hover state
			$node.find('button.repeat, button.remove').attr('disabled', 'disabled');//button('disable').removeClass('ui-state-hover');
		
			//then enable the appropriate ones
			$node.find('fieldset.jr-repeat:last-child > button.repeat').removeAttr('disabled');//.button('enable');
			$node.find('button.remove:not(:eq(0))').removeAttr('disabled');
		}
	};
	
	FormHTML.prototype.setEventHandlers = function(){
		var that = this;

		//first prevent default submission, e.g. when text field is filled in and Enter key is pressed
		$('form.jr').attr('onsubmit', 'return false;');

		$form.on('change validate', 'input:not(.ignore), select:not(.ignore), textarea:not(.ignore)', function(event){
			var validCons, validReq, 
				n = that.input.getProps($(this));

			event.stopImmediatePropagation();

			//console.debug('event: '+event.type);
			//console.log('node props: ', n);
			
			if (event.type === 'validate'){
				//the enabled check serves a purpose only when an input field itself is marked as enabled but its parent fieldset is not
				//if an element is disabled mark it as valid (to undo a previously shown branch with fields marked as invalid)
				validCons = (n.enabled && n.inputType !== 'hidden') ? data.node(n.path, n.ind).validate(n.constraint, n.xmlType) : true;
			}
			else{
				validCons = data.node(n.path, n.ind).setVal(n.val, n.constraint, n.xmlType);
			}
			
			//validate 'required'
			validReq = (n.enabled && n.inputType !== 'hidden' && n.required && n.val.length < 1) ? false : true;
			
			//console.debug('validation for required: '+validReq);
			//console.debug('validation for constraint + datatype: '+validCons);

			if (validReq === false){
				that.setValid($(this), 'constraint');
				if (event.type === 'validate'){
					that.setInvalid($(this), 'required');
				}
			}
			else{
				that.setValid($(this), 'required');
				if (typeof validCons !== 'undefined' && validCons === false){
					that.setInvalid($(this), 'constraint');
				}
				else if (validCons !== null) {
					that.setValid ($(this), 'constraint');
				}
			}
		});	
		
		$form.on('focus blur', '[required]', function(event){
			var props = that.input.getProps($(this)),
				loudErrorShown = ($(this).parents('.invalid-required, .invalid-constraint').length > 0),
				$reqSubtle = $(this).next('.required-subtle'),
				reqSubtle = $('<span class="required-subtle focus" style="color: transparent;">Required</span>');
			console.debug('event: ', event);
			if (event.type === 'focusin'){
				if ($reqSubtle.length === 0){
					$reqSubtle = $(reqSubtle);
					$reqSubtle.insertAfter(this);
					if (!loudErrorShown){
						$reqSubtle.show(function(){$(this).removeAttr('style');});
					}
				}
				else if (!loudErrorShown){
					$reqSubtle.addClass('focus');
				}
			}
			else if (event.type === 'focusout'){
				if (props.val.length > 0){
					$reqSubtle.remove();
				}
				else {
					$reqSubtle.removeClass('focus');
					if (!loudErrorShown){
						$reqSubtle.removeAttr('style');
					}
				}
			}

		});

		//nodeNames is comma-separated list as a string
		$form.on('dataupdate', function(event, nodeNames){			
			that.calcUpdate(nodeNames); //EACH CALCUPDATE THAT CHANGES A VALUE TRIGGERS ANOTHER CALCUPDATE => INEFFICIENT
			that.branch.update(nodeNames);
			that.outputUpdate(nodeNames);
			that.itemsetUpdate(nodeNames);
			//it is possible that a changed data value validates question that were previously invalidated
			//that.validateInvalids();
		});

		//edit is fired when the form changes due to user input or repeats added/removed
		//branch update doesn't require detection as it always happens as a result of an event that triggers change or changerepeat.
		$form.on('change changerepeat', function(event){
			//console.debug('detected event to trigger editstatus: ');
			//console.debug(event);
			that.editStatus.set(true);
		});

		$form.on('changerepeat', function(event){
			//set defaults of added repeats, setAllVals does not trigger change event
			that.setAllVals();
			//the cloned fields may have been marked as invalid, so after setting thee default values, validate the invalid ones
			//that.validateInvalids();
		});

//		$form.on('beforesave', function(event){
//			console.debug('beforesave event detected');
//			that.validateAll();
//		});

		//hacks for legends
		//it would be much better to replace these two handlers with a handler that detects the resize event of the form
		//but for some reason that doesn't work
		//$(window).resize(function(){
			//$form.fixLegends();
		//});

		$form.on('changelanguage', function(){
			that.outputUpdate();
		});
	};

	FormHTML.prototype.setValid = function($node, type){
		var classes = (type) ? 'invalid-'+type : 'invalid-constraint invalid-required';
		//console.debug('removing classes: '+classes);
		this.input.getWrapNodes($node).removeClass(classes);
	};

	FormHTML.prototype.setInvalid = function($node, type){
		type = type || 'constraint';
		//console.debug('adding invalid-'+type+' class');
		this.input.getWrapNodes($node).addClass('invalid-'+type).find('.required-subtle').attr('style', 'color: transparent;');
	};

	/**
	 * Function: generateName
	 * 
	 * Function to generate the name of a form element (= simple path to data node) corresponding to the provided data node. Omits instance node.
	 * 
	 * Parameters:
	 * 
	 *   node - A data node of which to determine the corresponding form field name.
	 * 
	 * Returns:
	 * 
	 *   String that looks like an XPath
	 *   
	 */
	FormHTML.prototype.generateName = function(dataNode){
		//other nodes may have the same XPath but because this function is used to determine the corresponding input name of a data node, index is not included 
		var steps = [dataNode.prop('nodeName')],
			parent = dataNode.parent();
		while (parent.length == 1 && parent.prop('nodeName') !== 'instance' && parent.prop('nodeName') !== '#document'){
			steps.push(parent.prop("nodeName"));
			parent = parent.parent();
		}
		return '/'+steps.reverse().join('/');
	};

	/**
	 * Validates all enabled input fields after first resetting everything as valid.
	 * @return {boolean} whether the form contains any errors
	 */
	FormHTML.prototype.validateAll = function(){
		var that = this;
		//can't fire custom events on disabled elements therefore we set them all as valid
		$form.find('fieldset:disabled input, fieldset:disabled select, fieldset:disabled textarea, input:disabled, select:disabled, textarea:disabled').each(function(){
			that.setValid($(this));
		});
		//the above still leaves out elements that are not disabled directly but have disabled parents
		//this is dealt with in the validate event handler
		$form.find('input, select, textarea').not('.ignore').trigger('validate');
		return this.isValid();
	};

	/**
	 * Returns true is form is valid and false if not. Needs to be called AFTER (or by) validateAll()
	 * @return {!boolean} whether the form is valid
	 */
	FormHTML.prototype.isValid = function(){
		return ($form.find('.invalid-required, .invalid-constraint').length > 0) ? false : true;
	};

	/**
	 * Adds <hr class="page-break"> to prevent cutting off questions with page-breaks
	 */
	FormHTML.prototype.addPageBreaks = function(){

	};
}

GUI.prototype.setCustomEventHandlers = function(){};

/**
 * Converts a native Date UTC String to a RFC 3339-compliant date string with local offsets
 * used in JavaRosa, so it replaces the Z in the ISOstring with a local offset
 * @return {string} a datetime string formatted according to RC3339 with local offset
 */
Date.prototype.toISOLocalString = function(){
	//2012-09-05T12:57:00.000-04:00 (ODK)
	var offset = {}, plus,
		pad2 = function(x){
			return (x<10) ? '0'+x : x;
		};

	if (this.toString() == 'Invalid Date'){
		return this.toString();
	}

	offset.minstotal = this.getTimezoneOffset();
	offset.direction = (offset.minstotal < 0) ? '+' : '-';
	offset.hrspart = pad2(Math.abs(Math.floor(offset.minstotal / 60 )));
	offset.minspart = pad2(offset.minstotal % 60);

	return new Date(this.getTime() - (offset.minstotal * 60 * 1000)).toISOString()
		.replace('Z', offset.direction+offset.hrspart+':'+offset.minspart);
};

(function($){
	"use strict";
	// plugin to update number of repeated elements (with class jr-repeat)
	$.fn.numberRepeats = function() {

		return this.each(function(){

			$(this).find('fieldset.jr-repeat').each(function(){
				var repSiblings, qtyRepeats, i;
				////console.log('found '+$(this).find('fieldset.jr-group > fieldset.jr-repeat').length +' items');
				// if it is the first-of-type (not that ':first-of-type' does not have cross-browser support)
				if ($(this).prev('fieldset.jr-repeat').length === 0){
					repSiblings = $(this).siblings('fieldset.jr-repeat');
					qtyRepeats = repSiblings.length + 1;
					////console.log('number of repeats of '+$(this).attr('name')+' is '+qtyRepeats);
					if (qtyRepeats > 1) {
						$(this).find('span.repeat-number').text('1');
						i = 2;
						repSiblings.each(function(){
							////console.log('numbering a repeat');
							$(this).find('span.repeat-number').text(i);
							i++;
						});
					}
					else{
						$(this).find('span.repeat-number').empty();
					}
				}
				else{
					////console.log('not first of type');
				}
			});
		});
	};

/**
 * Function: clearInputs
 * 
 * Clears form input fields and triggers events when doing this. If formelement is cloned but not yet added to DOM 
 * (and not synchronized with data object), the desired event is probably 'edit' (default). If it is already added 
 * to the DOM (and synchronized with data object) a regular change event should be fired
 * 
 * Parameters:
 * 
 *   ev - event to be triggered
 * 
 * Returns:
 * 
 *   jQuery this object
 */
	$.fn.clearInputs = function(ev) {
		ev = ev || 'edit';
		////console.log('objects received to clear: '+this.length);
		////console.debug(this);
		////console.log('event to fire: '+ev);
		return this.each(function(){
			////console.debug($(this));
			$(this).find('input, select, textarea').each(function(){
				var type = $(this).attr('type');
				if ($(this).prop('nodeName').toUpperCase() === 'SELECT'){
					type = 'select';
				}
				if ($(this).prop('nodeName').toUpperCase() === 'TEXTAREA'){
					type = 'textarea';
				}
				////console.log('type to reset: '+type);
				switch (type){
					case 'date':
					case 'datetime':
					case 'time':
					case 'number':
					case 'search':
					case 'color':
					case 'range':
					case 'url':
					case 'email':
					case 'password':
					case 'text':
					case 'file':
					case 'hidden':
					case 'textarea':
						if ($(this).val() !== ''){
							$(this).val('').trigger(ev);
						}
						break;
					case 'radio':
					case 'checkbox':
						if ($(this).prop('checked')){
							//console.log('found checked value, going to reset it');
							$(this).prop('checked', false);
							$(this).trigger(ev);
						}
						break;
					case 'select':
						// TEST THIS!
						if ($(this)[0].selectedIndex >= 0){
							$(this)[0].selectedIndex = -1;
							$(this).trigger(ev);
						}
						break;
					default:
						console.error('Unrecognized input type found when trying to reset: '+type);
						console.error($(this));
				}
			});
		});
	};

	/**
	 * Function: xfind
	 * 
	 *
	 * 
	 * Parameters:
	 * 
	 *   selector - String containing a JQuery selector or an XPath/
	 * 
	 * Returns:
	 * 
	 *   Nodes matching the selector.
	 *   
	 * See Also:
	 * 
	 *   
	 */
    /**
     * Simple XPath Compatibility Plugin for jQuery 1.1
	 * By John Resig
	 * Dual licensed under MIT and GPL.
	 * Original plugin code here: http://code.google.com/p/jqueryjs/source/browse/trunk/plugins/xpath/jquery.xpath.js?spec=svn3167&r=3167
	 * some changes made by Martijn van de Rijdt (not replacing $.find(), removed context, dot escaping)
     * @param  {string} selector [description]
     * @return {?(Array.<(Element|null)>|Element)}          [description]
     */
    $.fn.xfind = function(selector){
			var parts, cur, i;
			//console.debug('xfind plugin received selector: '+selector);
			
			// Convert the root / into a different context
			//if ( !selector.indexOf("/") ) {
			//	context = this.context.documentElement;
			//	selector = selector.replace(/^\/\w*/, "");
			//	if ( !selector ){
			//		return [ context ];
			//	}
			//}

            // Convert // to " "
            selector = selector.replace(/\/\//g, " ");

            //added by Martijn
            selector = selector.replace(/^\//,"");
            selector = selector.replace(/\/\.$/,'');

            // Convert / to >
            selector = selector.replace(/\//g, ">");

            // Naively convert [elem] into :has(elem)
            selector = selector.replace(/\[([^@].*?)\]/g, function(m, selector){
                    return ":has(" + selector + ")";
            });

            // Naively convert /.. into a new set of expressions
            // Martijn: I just don't see this except if this always occurs as nodea/../../parentofnodea/../../grandparentofnodea
            if ( selector.indexOf(">..") >= 0 ) {
                    parts = selector.split(/>\.\.>?/g);
                    //var cur = jQuery(parts[0], context);
                    cur = jQuery(parts[0], this);
                    for ( i = 1; i < parts.length; i++ )
                            cur = cur.parent(parts[i]);
                    return cur.get();
            }

            // any remaining dots inside node names need to be escaped (added by Martijn)
			selector = selector.replace(/\./gi, '\\.');

            //selector += ':not([template], [template] *)';
            //console.debug('xfind plugin going to return jQuery object with selector: '+selector);
            //if performance becomes an issue, it's worthwhile implementing this with native XPath instead.
            return this.find(selector);
    };

})(jQuery);