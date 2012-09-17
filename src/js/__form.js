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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true, trailing:false*//*global XPathJS, XMLSerializer:true, Modernizr, google*/

/**
 * Class: Form
 *
 * This class provides the JavaRosa form functionality by manipulating the survey form DOM object and
 * continuously updating the data XML Document. All methods are placed inside the constructor (so privileged 
 * or private) because only one instance will be created at a time.
 *
 * Parameters:
 *
 *   $form  - The form as JQuery object
 *   dataStr - <instance> as XML string
 *
 * Returns:
 *
 *   -
 *
 * Closure tags:
 *
 * @constructor
 */
function Form (formSelector, dataStr){
	"use strict";
	var data, form, $form, $formClone;
 
	//*** FOR DEBUGGING and TESTING, OTHERWISE DISABLE***
	this.ex = function(expr, type, selector, index){return data.evaluate(expr, type, selector, index);};
	this.sfv = function(){return form.setAllVals();};
	this.getDataO = function(){return data.get();};
	this.data = function(dataStr){return new DataXML(dataStr);};
	//this.data = function(){return data;};
	this.form = function(selector){return new FormHTML(selector);};
	this.getDataXML = function(){return data.getXML();};
	this.validateAll = function(){return form.validateAll();};
	//***************************************


/**
 * Function: init
 *
 * Initializes the Form instance (XML data and HTML form).
 * 
 *
 *
 *
 */
	this.init = function() {
		//dataStr = dataStr.replace(/xmlns\=\"[a-zA-Z0-9\:\/\.]*\"/,'');
		
		//if (typeof console== 'undefined'){
	///		report &= window.console;
	//	}
		//cloning children to keep any event handlers on 'form.jr' intact upon resetting
		$formClone = $(formSelector).clone().appendTo('<original></original>');

		data = new DataXML(dataStr);
		data.init();
		//console.debug('form data obj initialized');	
		form = new FormHTML(formSelector);
		form.init();
		//console.debug('form html obj initialized');
		
		//to update data tab launch, trigger a dataupdate (required after )
		//$form.trigger('dataupdate');

		return;
	};

	/**
     * @param {boolean=} incTempl
     * @param {boolean=} incNs
     */
	this.getDataStr = function(incTempl, incNs){
		return data.getStr(incTempl, incNs);
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

	//restores form instance to pre-initialized state
	this.reset = function(){
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

	//odd function to modify date strings (et. al.?) just before they are submitted or exported
	this.prepareForSubmission = function(dataStr){
		var name, value,
			formData = new DataXML(dataStr); //$($.parseXML(dataStr));
		//console.debug(formData.);
		$form.find('[data-type-xml="date"], [data-type-xml="dateTime"]').each(function(){
			name = $(this).attr('name');
			//console.debug('found date element with name: '+name);
			formData.node(name).get().each(function(){
				console.debug('found date DATA node with name: '+name);
				value = $(this).text().trim();
				if (value.length > 0){
					console.debug('converting date string: '+value);
					value = new Date(value).toJrString();
					console.debug('jrDateString: '+value);
					//bypassing validation & conversion of Nodeset sub-class
					$(this).text(value);
				}
			});
		});

		$form.find('[type="time"]').each(function(){

		});
		return formData.getStr(true, true);
	};
	
/**
 * Function: DataXML
 *
 * description
 *
 * Parameters:
 *
 *   dataStr - [type/description]
 *
 * Returns:
 *
 *   return description
 * 
 *   @constructor
 */
	function DataXML(dataStr) {
	
		var $data, 
			that=this;
		//console.debug('dataStr:'+dataStr); 
		//seems wrong but using regular expression on string avoids persistant xmlns behaviour
		dataStr = dataStr.replace(/<[\/]?instance(>|\s+[^>]*>)/gi, '');
		////console.debug(dataStr);
		//TEMPORARY DUE TO FIREFOX ISSUE, REMOVE ALL NAMESPACES FROM STRING, BETTER TO LEARN HOW TO DEAL WITH DEFAULT NAMESPACES
		//dataStr = dataStr.replace(/xmlns\=\"[a-zA-Z0-9\:\/\.]*\"/,'');

		this.xml = $.parseXML(dataStr);
		//$instance = $(xml);
		//cleanDataStr = (new window.XMLSerializer()).serializeToString($instance.find('instance>*')[0]);
		//xml = $.parseXML(cleanDataStr);
		$data = $(this.xml);

		//this.xml = xml;
		this.$ = $data;

		//replace browser-built-in-XPath Engine
		XPathJS.bindDomLevel3XPath(); // move to Data if evalXpression moves to Data


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
		 * Function: Nodeset
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
		 *   @constructor
		 */
		function Nodeset(selector, index, filter){
			
			this.selector = (typeof selector !== 'undefined' && selector) ? selector : '*'; 
					//this.selector = selector.replace(/^\/{1}/, "instance/"); 
			
				//this.selector = '*:not(instance)';
			//}	
			filter = (typeof filter !== 'undefined' && filter !== null) ? filter : {};
			this.filter = filter;
			this.filter.noTemplate = (typeof filter.noTemplate !== 'undefined') ? filter.noTemplate : true;
			this.filter.onlyLeaf = (typeof filter.onlyLeaf !== 'undefined') ? filter.onlyLeaf : false;
			this.filter.onlyTemplate = (typeof filter.onlyTemplate !== 'undefined') ? filter.onlyTemplate : false;
			this.filter.noEmpty = (typeof filter.noEmpty !== 'undefined') ? filter.noEmpty : false;
			this.index = index;
			//this.xmlDataType = xmlDataType;
			////console.debug('nodeset instance created with xmlDataType: '+this.xmlDataType);

			//return this; //necessary?
		}

		/**
		 * Function: get
		 * 
		 * Privileged method to find data nodes filtered by a jQuery or XPath selector and additional filter properties
		 * Without parameters it returns a collection of all data nodes excluding template nodes and their children. Therefore, most
		 * queries will not require filter properties. This function handles all (?) data queries in the application.
		 * 
		 * Parameters:
		 * 
		 *   selector - [Optional] String containing a JQuery selector or an XPath
		 *   filter - [Optional] Object (filter) with the following optional boolean properties: "noTemplate"(default: false), "onlyTemplate", "noEmpty", "onlyEmpty".
		 *   
		 * Notes: 
		 *    
		 *   onlyTemplate = true - will negate any value for "noTemplate"
		 *   noEmpty = true - returns only leaf nodes and therefore makes the "onlyLeaf" property obsolete
		 *   noTemplate = false - returns all data nodes if no other properties or the selector are set.
		 *   
		 * Returns:
		 * 
		 *   Data nodes that match the selector and filter.
		 *   
		 * See Also:
		 * 
		 *   <xfind>
		 */
		Nodeset.prototype.get = function(){
			var p, $nodes, val;
			
			// filter property error check
			//for (p in this.filter){
				//if (this.filter.hasOwnProperty(p)){
					//if ($.inArray(p, ['onlyTemplate','noTemplate', 'noEmpty', 'onlyLeaf']) == -1){
						//console.error('node.get() received invalid filter property: '+p);
					//}
				//}
			//}
			////console.debug('node.get() looking for node: '+this.selector);
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
					val = $(this).text();
					//$this = $(this);
					////console.log ('children: '+$(this).children().length);
					////console.log ('text length: '+($.trim($this.text()).length));
					return $(this).children().length === 0 && val.trim().length > 0;//$.trim($this.text()).length > 0;
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
		 * Function: setVal
		 * 
		 * Sets data node values.
		 * 
		 * Parameters:
		 * 
		 *   selector - String of JQuery or XPath selector for a data node
		 *   value - String/Number/Boolean of the new value of this node
		 *   index - The 0-based index of this node amongs its peers with the same selector
		 *   
		 * Returns:
		 * 
		 *   -
		 */
		Nodeset.prototype.setVal = function(newVal, expr, xmlDataType){
			var target, curVal, success;
			//index = (typeof index !== 'undefined') ? index : -1;
			curVal = this.getVal().join(' ');
			//console.log('setting value of data node: '+this.selector+' with index: '+this.index);
			
			if (typeof newVal !== 'undefined'){
				newVal = ($.isArray(newVal)) ? newVal.join(' ') : newVal;
				//this would perhaps be better: (but selected('a b') actually would not work (and does now))
				//if($.isArray(value)){
				//	$.each(value, function(i, val){value[i] = encodeURI(val);});
				//	value = value.join(' ');
				//}
			}
			else newVal = '';
			newVal = this.convert(newVal, xmlDataType);
			//value = data.type(value, type);
			//console.debug('value(s) to set: '+newVal);
			//console.debug('existing value(s): '+curVal);

			target = this.get();//.eq(index);

			if ( target.length === 1 && newVal.toString().trim() !== curVal.toString().trim() ){ //|| (target.length > 1 && typeof this.index == 'undefined') ){
				//if (this.validate(value) === true){
				//first change the value so that it can be evaluated in XPath (validated)
				

				target.text(newVal);
				//	return true;
				//}
				//return false;
				//then return validation result
				success = this.validate(expr, xmlDataType);
				$form.trigger('dataupdate', target.prop('nodeName'));
				return success;
			}
			if (target.length > 1){
			//	//console.debug('number of nodes with that name: '+target.length);
			//	target.eq(this.index).text(value);
				console.error('nodeset.setVal expected nodeset with one node, but received multiple');
				return null;
			}
			if (target.length === 0 ){
				console.error('Data node: '+this.selector+' with null-based index: '+this.index+' not found!');
				return null;
			}
			//always validate if the new value is not empty, even if value didn't change (see validateAll() function)
			//return (newVal.length > 0 && validateAll) ? this.validate(expr, xmlDataType) : true;
			return null;
			////console.debug('validation result: '+this.validate());
		};

		/**for
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
		 *   returns the value of the node or false if no nodes were found. Throws error and stops when multiple 
		 *   nodes with that selector were found
		 *   
		 */
		Nodeset.prototype.getVal = function(){
			var vals=[];
			this.get().each(function(){
				//if not leaf node
				vals.push($(this).text());
			});
			return vals;
		};
		
		//clone data node after all templates have been cloned (after initialization)
		Nodeset.prototype.clone = function($precedingTargetNode){
			var $dataNode, allClonedNodeNames;

			$dataNode = this.get();
			////console.debug(dataNode);
			////console.debug(precedingTargetNode);
			$precedingTargetNode = $precedingTargetNode || $dataNode;
			if ($dataNode.length === 1 && $precedingTargetNode.length ===1){
				$dataNode.clone().insertAfter($precedingTargetNode).find('*').andSelf().removeAttr('template');
				//$('form.jr').trigger('dataupdate');
				//since the dataNode (template) may have descendants as well that are used in evaluating e.g. 
				//branching logic, we need to trigger a data update for each of the cloned nodes...
				allClonedNodeNames = [$dataNode.prop('nodeName')];
				$dataNode.find('*').each(function(){
					allClonedNodeNames.push($(this).prop('nodeName'));
				});
				////console.log('nodenames in clone: ');
				////console.log(allClonedNodeNames);
				$form.trigger('dataupdate', allClonedNodeNames.join());
			}
			else{
				console.error ('node.clone() function did not receive origin and target nodes');
			}
		};

		Nodeset.prototype.remove = function(){
			var dataNode = this.get();
			if (dataNode.length > 0){
				//console.log('removing data node with name: '+this.get().prop('nodeName'));
				dataNode.remove();
				$form.trigger('dataupdate', dataNode.prop('nodeName') );
			}
			else {
				console.error('could not find node '+this.selector+' with index '+this.index+ 'to remove ');
			}
		};

		Nodeset.prototype.convert = function(x, xmlDataType){
			////console.debug('received xmlDataType for conversion: '+xmlDataType);
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
 
		Nodeset.prototype.validate = function(expr, xmlDataType){
			//var //i, result,
			var typeValid, exprValid,
				value = this.getVal();
			//	value = this.getVal(); //multiple acceptable???
			
			//for (i=0 ; i<values.length ; i++){
			//	result.push({type: this.type.validate(values[i]), expr: true });
				//ADD result of XPath constraint expr 
			//} 
			////console.log('xml data type = '+this.xmlDataType);
			if (value.toString() === '') {
				return true;
			}

			if (typeof xmlDataType == 'undefined' || xmlDataType === null || 
				typeof this.types[xmlDataType.toLowerCase()] == 'undefined'){
				console.error('data type '+xmlDataType+' set to string');
				xmlDataType = 'string';
			}
			typeValid = this.types[xmlDataType.toLowerCase()].validate(value);
			//console.debug('type valid: '+typeValid);
			exprValid = (typeof expr !== 'undefined' && expr !== null && expr.length > 0) ? that.evaluate(expr, 'boolean', this.selector, this.index) : true;
			//console.debug('constraint valid: '+exprValid);
			return (typeValid && exprValid);
		};

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
					//console.debug('validating date: "'+x+'"');
					//console.debug(new Date(x.toString()));
					return ( new Date(x.toString()).toString() !== 'Invalid Date' );
				},
				convert : function(x){
					var datetime = new Date(x);
					datetime.setUTCHours(0,0,0,0);
					//console.log('converting datetime to date');
					return new Date(datetime).toUTCString();//.getUTCFullYear(), datetime.getUTCMonth(), datetime.getUTCDate());
				}
			},
			'datetime' : {
				validate : function(x){
					return ( new Date(x).toString() !== 'Invalid Date');
				},
			'convert' : function(x){
					return ( new Date(x).toUTCString() );
				}
			},
			'time' : {
				validate : function(x){
					return ( new Date('2012-01-01 '+x).toString() !== 'Invalid Date');
				},
				convert : function(x){
					var datetime = new Date('2012-01-01 '+x);
					//console.log('converting datetime to time');
					return datetime.getHours().toString().pad(2)+':'+datetime.getMinutes().toString().pad(2)+':'+datetime.getSeconds().toString().pad(2);
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
						!isNaN(coords[2]) && (typeof coords[3] == 'undefined' || !isNaN(coords[3]));
				},
				convert: function(x){
					return x.toString().trim();
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
		var $root, val;
		//console.log('initializing DataXML object');
		//trimming values
		this.node(null, null, {noEmpty: true, noTemplate: false}).get().each(function(){
			////console.debug('value found'+ $(this).text());
			val = $(this).text();
			$(this).text(val.trim());
		});
		$root = this.node(':first', 0).get();

		//store namespace of root element
		this.namespace = $root.attr('xmlns');
		//console.debug('namespace of root element is:'+this.namespace);
		//strip namespace from root element (first child of instance) 
		$root.removeAttr('xmlns');

		this.cloneAllTemplates();

		return;
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
				$(this).clone().insertAfter($(this)).find('*').andSelf().removeAttr('template');
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
	 * Function: getStr
	 * 
	 * Public function to get a string of the CLONED data object (used for Rapaide.launch component).
	 * 
	 * Parameters:
	 * 
	 *   incTempl - Boolean that indicates whether to include template nodes.
	 *   
	 * Returns:
	 * 
	 *   string of data xml object
	 */
	DataXML.prototype.getStr = function(incTempl, incNs){
		var $dataClone, dataStr;

		incTempl = (typeof incTempl !== 'undefined') ? incTempl : false;
		incNs = (typeof incNs !== 'undefined') ? incNs : true;
		
		$dataClone = $('<root></root');
		
		this.$.find(':first').clone().appendTo($dataClone);

		if (incTempl === false){
			$dataClone.find('[template]').remove();
			////console.log('removed templates');
		}
		if (incNs === true && typeof this.namespace !== 'undefined' && this.namespace.length > 0) {
			$dataClone.children().eq(0).attr('xmlns', this.namespace);
		}
		////console.debug('dataClone in getStr:');
		////console.debug($dataClone);
		dataStr = (new XMLSerializer()).serializeToString($dataClone.children().eq(0)[0]);

		//TEMPORARY DUE TO FIREFOX ISSUE, REMOVE NAMESPACE FROM STRING (AGAIN), BETTER TO LEARN HOW TO DEAL WITH DEFAULT NAMESPACES
		dataStr = dataStr.replace(/xmlns\=\"[A-z0-9\:\/\.\-\%\_\?&amp;]*\"/gi,' ');

		//remove tabs
		dataStr = dataStr.replace(/\t/g, '');

		return dataStr;
	};

	/**
	 * There is a bug in JavaRosa that has resulted in the usage of incorrect formulae on nodes inside repeat nodes. 
	 * Those formulae use absolute path when relative paths should have been used. See more here:
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
	 * @param  {jQuery} $repParents jQuery collection of repeat parents of the context input node
	 * @return {string} modified expression with injected positions (1-based) 
	 */
	DataXML.prototype.makeBugCompliant = function(expr, $repParents){
		var i, repSelector, repIndex,
			bcExpr = expr;
		//console.debug('received expression: '+expr+' inside repeat: '+repSelector+' with 0-based index: '+repIndex);
		for (i=0 ; i<$repParents.length ; i++){
			repSelector = /** @type {string} */$repParents.eq(i).attr('name');
			//console.log(repSelector);
			repIndex = $repParents.eq(i).siblings('[name="'+repSelector+'"]').andSelf().index($repParents.eq(i)); 
			//console.log(repIndex);
			bcExpr = bcExpr.replace(repSelector, repSelector+'['+(repIndex+1)+']');
		}
		//if (expr !== bcExpr){
			//console.debug('expr inside repeat made bug compliant, new expression: '+bcExpr);
		//}
		return bcExpr;
	};

	/*
	 * Evaluates an XPath Expression using the browser's native XPath 1.0 engine
	 * $context parameter is a jQuery object!
	 * type 
	 *  (and only used for booleans
	 *
	 *
	 * 
	 */
	/**
	 * Evaluates an XPath Expression using XPathJS_javarosa (not native XPath 1.0 evaluator)
	 * 
	 * THIS FUNCTION DOESN'T SEEM TO WORK PROPERLY FOR NODE RESULTTYPES! otherwise:
	 * nodes can be accessed by returned node.snapshotItem(i)(.textContent)
	 * node can be accessed by returned node(.textContent)
	 * 
	 * @param  {string} expr       [description]
	 * @param  {string=} resTypeStr boolean, string, number, nodes (best to always supply this)
	 * @param  {string=} selector   jQuery selector which will be use to provide the context to the evaluator
	 * @param  {number=} index      index of selector in document
	 * @return {?(number|string|boolean)}            [description]
	 */
	DataXML.prototype.evaluate = function(expr, resTypeStr, selector, index){
		var context, dataCleanClone, resTypeNum, resultTypes, result, $repParents;//, repSelector, repIndex;//, repDataNodeName;
		
		//$context = $context || this.get().find('instance>*');
		//console.debug('evaluating expression: '+expr);
		resTypeStr = resTypeStr || 'any';
		index = index || 0;
		//console.debug('selector of context: '+selector);
		//console.debug('index of context node: '+index);
		//var context = $.parseXML((new window.XMLSerializer()).serializeToString($context[0]));
		//create a clone so that the template nodes can be removed (not tried detach() and attach()
		
		////console.debug(data.get());
		//$clonedDoc = this.get().find('instance>*').clone().appendTo($('<root></root>'));
		//$clonedContext.find('[template]').remove();
		
		////console.log('creating clean clone from string:'+this.getStr(false, false));
		dataCleanClone = new DataXML(this.getStr(false, false));
		////console.log('clean clone:');
		////console.log(dataCleanClone);
		////console.log('selector of context node: '+selector);
		////console.log('index of context node: '+index);
		//use a trick to be able to get the context node using getElementById
		if (typeof selector !== 'undefined' || selector !== null) {
			//console.debug('selector for context node in evaluate(): '+selector+' with index: '+index);
			//dataCleanClone.node(selector, index, {}).get().attr('id','getme');
			//context = dataCleanClone.get()[0].getElementById('getme');
			context = dataCleanClone.node(selector, index, {}).get()[0];
			/**
			 * If the expressions is bound to a node that is inside a repeat.... see makeBugCompliant()
			 */
			if ($form.find('[name="'+selector+'"]').parents('.jr-repeat').length > 0 ){
				$repParents = $form.find('[name="'+selector+'"]').eq(index).parents('.jr-repeat');
				expr = this.makeBugCompliant(expr, $repParents);
			}
		}
		else context = dataCleanClone.getXML();//dataCleanClone.get()[0];//.documentElement;
		
		resultTypes = { //REMOVE VALUES? NOT USED
			0 : ['any', 'ANY_TYPE'], //works
			1 : ['number', 'NUMBER_TYPE', 'numberValue'], //works, e.g. evalXpression('number(true())', 'number')
			2 : ['string', 'STRING_TYPE', 'stringValue'], //works, e.g. evalXpression('string(38)', 'string')
			3 : ['boolean', 'BOOLEAN_TYPE', 'booleanValue'], //works, e.g. evalXpression('"red" != "bleu", 'boolean')
			//NOTE: nodes are actually never requested in this function as DataXML.node().get() is used to return nodes
			
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

		////console.log('expr to test: '+expr);//+' with result type number: '+resTypeNum);
		//result = evaluator.evaluate(expr, context.documentElement, null, resultType, null);
		try{
				result = document.evaluate(expr, context, null, resTypeNum, null);
			////console.log('evaluated: '+expr+' to: '+(result[resultTypes[type][1]] || 'resultnode(s)'));
			////console.log(result); //NOTE THAT THIS USE OF THE CONSOLE THROWS AN ERROR IN FIREFOX when using native XPath!
			if (resTypeNum === 0){
				for (resTypeNum in resultTypes){
					resTypeNum = Number(resTypeNum);
					////console.log('checking if resultType = '+type+' is equal to actual result.resultType = '+result.resultType);
					if (resTypeNum == Number(result.resultType)){
						result = (resTypeNum >0 && resTypeNum<4) ? result[resultTypes[resTypeNum][2]] : result;
						console.debug('evaluated '+expr+' to: '+result);
						return result;
					}
					//resultTypeValProp = resultTypes[type][1];
					//console.log('checking type with value property:'+resultTypeValProp);
					// WHEN PROBLEMS USE ITERATENEXT().textContent for resultType = 4
					//try{
					//	if (typeof result[resultTypeValProp] !== 'undefined'){
					//		//console.log('result type detected: '+type);
					//		return result[resultTypeValProp];
					//	}
					//}
					//catch(e){
					//	//console.log('result type is not: '+type);
					//}
				}
				console.error('Expression: '+expr+' did not return any boolean, string or number value as expected');
				//console.debug(result);
			}
			console.debug('evaluated '+expr+' to: '+result[resultTypes[resTypeNum][2]]);
			return result[resultTypes[resTypeNum][2]];
		}
		catch(e){
			console.error('Error occurred trying to evaluate: '+expr+', message: '+e.message);
		}
	};

/**
 * Function: FormHTML
 * 
 * description
 * 
 * Parameters:
 * 
 *   selector - [type/description]
 * 
 * Returns:
 * 
 *   return description
 *   
 *   @constructor
 */
	function FormHTML (selector){
		//there will be only one instance of FormHTML
		$form = $(selector);

		//this.input = function($node){
		//	return new Input($node);
		//};

		
	}

	FormHTML.prototype.init = function(){
		var icons, name, required;//,
			//that = this; 
		//console.debug ('initializing HTML form');

		this.checkForErrors();

		if (typeof data == 'undefined' || !(data instanceof DataXML)){
			return console.error('variable data needs to be defined as instance of DataXML');
		}
		
		icons = '<div class="question-icons"><span class="required"></span><span class="hint"></span></div>';
		
		//append icons
		$form.find('label>input[type="checkbox"], label>input[type="radio"]').parent().parent('fieldset').prepend(icons);
		$form.parent().find('label>select, , label>textarea, :not(#jr-preload-items, #jr-calculated-items)>label>input')//, form>label>input')
			.not('[type="checkbox"], [type="radio"]').parent().prepend(icons);

		//this.input.getWrapNodes($form.parent().find('fieldset:not(#jr-preload-items, #jr-calculated-items) input, select, textarea'))
		//	.prepend(icons);	

		//add 'required field' clue
		required = '<span class="required">*</span>';
		$form.find('label>input[type="checkbox"][required], label>input[type="radio"][required]').parent().parent('fieldset')
			.find('legend:eq(0)').append(required);
			//.find('.question-icons .required').addClass('ui-icon ui-icon-notice');
		$form.parent().find('label>select[required], label>textarea[required], :not(#jr-preload-items, #jr-calculated-items)>label>input[required]')
			.not('[type="checkbox"], [type="radio"]').parent()
			.each(function(){
				$(this).children('span:not(.jr-option-translations):last').after(required);
			});
			//.find('.question-icons .required').addClass('ui-icon ui-icon-notice');

		//this.input.getWrapNodes($form.find('[required]')).find('.question-icons .required').text('*');

		//groups of radiobuttons needs to have the same name which referes to the xpath in instance
		//when a radio button is clone this will cause a problem. Therefore radiobuttons store their xpath in data-name.
		$form.find('input[type="radio"]').each(function(){
			name = /**@type {string} */$(this).attr('name');
			$(this).attr('data-name', name);
		});

		$form.find('h2').first().append('<span/>');

		//this.setLangs();
		//$form.find('.jr-hint, .jr-constraint-msg').hide();
		//
		this.repeat.init();
		this.setAllVals();
		this.beautify();
		this.widgets.init();
		this.branch.init();
		this.calcUpdate();
		this.outputUpdate();
		this.setEventHandlers();
		this.preloads.init(); //after event handlers!
		//$form.fixLegends();
		this.setLangs();
		this.editStatus.set(false);
	};

	FormHTML.prototype.checkForErrors = function(){
		var i,
			paths = [],
			total = {},
			$stats = $form.find('#stats');
		total.jrItem= parseInt($stats.find('[id="jrItem"]').text(), 10);
		total.jrInput= parseInt($stats.find('[id="jrInput"]').text(), 10);
		total.jrUpload = parseInt($stats.find('[id="jrUpload"]').text(), 10);
		total.jrTrigger = parseInt($stats.find('[id="jrTrigger"]').text(), 10);
		total.jrConstraint = parseInt($stats.find('[id="jrConstraint"]').text(), 10);
		total.jrRelevant = parseInt($stats.find('[id="jrRelevant"]').text(), 10);
		total.jrCalculate = parseInt($stats.find('[id="jrCalculate"]').text(), 10);
		total.jrPreload = parseInt($stats.find('[id="jrPreload"]').text(), 10);

		//console.log('checking for general transformation or xml form errors by comparing stats');
		//$form.find('#stats span').each(function(){
		//	total[$(this).attr('id')] = parseInt($(this).text(),10);
		//});
		/** @type {number} */
		total.hRadio = $form.find('input[type="radio"]').length;
		total.hCheck = $form.find('input[type="checkbox"]').length;
		total.hSelect = $form.find('select').length;
		total.hOption = $form.find('option[value!=""]').length;
		total.hInputNotRadioCheck = $form.find('input:not([type="radio"],[type="checkbox"])').length;
		total.hTrigger = $form.find('.trigger').length;
		total.hRelevantNotRadioCheck = $form.find('[data-relevant]:not([type="radio"],[type="checkbox"])').length;
		total.hRelevantRadioCheck = $form.find('input[data-relevant][type="radio"],input[data-relevant][type="checkbox"]').parent().parent('fieldset').length;
		total.hConstraintNotRadioCheck = $form.find('[data-constraint]:not([type="radio"],[type="checkbox"])').length;
		total.hConstraintRadioCheck = $form.find('input[data-constraint][type="radio"],input[data-constraint][type="checkbox"]').parent().parent('fieldset').length;
		total.hCalculate = $form.find('[data-calculate]').length;
		total.hPreload = $form.find('#jr-preload-items input').length;

		//console.debug(total);

		if ( total.jrItem !== ( total.hOption + total.hRadio + total.hCheck )  ) {
			console.error(' total select-type filter differs between XML form and HTML form');
		}
		if ( ( total.jrInput + total.jrUpload ) !== ( total.hInputNotRadioCheck - total.hCalculate - total.hPreload ) ){
			console.error(' total amount of input/upload fields differs between XML form and HTML form');
		}
		if ( total.jrTrigger != total.hTrigger ){
			console.error(' total triggers differs between XML form and HTML form');
		}
		if ( total.jrRelevant != ( total.hRelevantNotRadioCheck + total.hRelevantRadioCheck)){
			console.error(' total amount of branches differs between XML form and HTML form (not a problem if caused by obsolete bindings in xml form)');
		}
		if ( total.jrConstraint != ( total.hConstraintNotRadioCheck + total.hConstraintRadioCheck)){
			console.error(' total amount of constraints differs between XML form and HTML form (not a problem if caused by obsolete bindings in xml form).'+
				' Note that constraints on &lt;trigger&gt; elements are ignored in the transformation and could cause this error too.');
		}
		if ( total.jrCalculate != total.hCalculate ){
			console.error(' total amount of calculated items differs between XML form and HTML formprel');
		}
		if ( total.jrPreload != total.hPreload ){
			console.error(' total amount of preload items differs between XML form and HTML form');
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

	};

	//this may not be the most efficient. Could also be implemented like Data.Nodeset;
	//also use for fieldset nodes (to evaluate branch logic) and also used to get and set form data of the app settings
	FormHTML.prototype.input = {
		//multiple nodes are limited to ones of the same input type (better implemented as JQuery plugin actually)
		getWrapNodes: function($inputNodes){
			var type = this.getInputType($inputNodes.eq(0));
			return (type == 'radio' || type == 'checkbox') ? $inputNodes.parent('label').parent('fieldset') : 
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
				required: ($node.attr('required') !== undefined) ? true : false,
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
			if ($node.attr('name').length > 0){
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
			////console.debug('name provided by input.getName:'+name);
			////console.debug('name of attribute name:'+$node.attr('name'));
			//if (inputType === 'radio' && name !== $node.attr('name')){
				//return parseInt( $node.attr('name').substring($node.attr('name').lastIndexOf('____')+4), 10);
			//}
			$wrapNode = this.getWrapNodes($node);
			////console.debug('wrapnode:');
			////console.debug($wrapNode);
			if (inputType === 'radio' && name !== $node.attr('name')){
				$wrapNodesSameName = this.getWrapNodes($form.find('[data-name="'+name+'"]'));
			}
			else {
				$wrapNodesSameName = this.getWrapNodes($form.find('[name="'+name+'"]'));
			}
			////console.debug('wrapnodes with same name:');
			////console.debug($wrapNodesSameName);	

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
			////console.debug('input type: '+inputType);
			if (inputType == 'radio'){
				return this.getWrapNodes($node).find('input:checked').val() || '';
			}
			//checkbox values bug in jQuery as (node.val() should work)
			if (inputType == 'checkbox'){
				//console.debug(this.getWrapNodes($node));
				this.getWrapNodes($node).find('input[name="'+name+'"]:checked').each(function(){
					//console.debug('found checkbox value: '+$(this).val());
					values.push($(this).val());
				});
				return values;
			}
			return $node.val() || '';
		},
		setVal : function(name, index, value){
			var $inputNodes;//, 
				//values = value.split(' ');
			index = index || 0;
			
			if (this.getInputType($form.find('[data-name="'+name+'"]').eq(0)) == 'radio'){
				//name = name+'____'+index;
				//index = 0;
				//why not use this.getIndex?
				return this.getWrapNodes($form.find('[data-name="'+name+'"]')).eq(index).find('input[value="'+value+'"]').attr('checked', true);
			}
			else {
				//why not use this.getIndex?
				$inputNodes = this.getWrapNodes($form.find('[name="'+name+'"]')).eq(index).find('input, select, textarea');
			}

			if (this.isMultiple($inputNodes.eq(0)) === true){
				////console.log('control allows values will be split at spaces');
				value = value.split(' ');
			}
			//console.debug('name of form element to set value of (if exists in form):'+name+', index:'+index+' new value: '+value);
			////console.debug($inputNodes);
			return $inputNodes.val(value);
		}
	};

	/**
	 * Function: setAllVals
	 * 
	 * Uses current content of $data to set all the values in the form
	 * 
	 * Notes:
	 * 
	 * Since not all data nodes with a value have a corresponding input element, it could be considered to turn this
	 * around and cycle through the HTML form elements and check for each form element whether data is available.
	 * 
	 * Returns:
	 * 
	 *   -
	 */
	FormHTML.prototype.setAllVals = function(){
		var index, name, value,
			that=this;			
		////console.log('setting form values');
		data.node(null, null, {noEmpty: true}).get().each(function(){
			//parent = $(this).parent(),
			//parentName = parent.prop('nodeName'),
			value = $(this).text(); //actually should use Nodeset.getVal() for that would require changing getVal();
			//index = data.node(parentName).get().index(parent);
			index = data.node($(this).prop('nodeName')).get().index($(this));
			name = that.generateName($(this));
			//console.debug('calling input.setVal with name: '+name+', index: '+index+', value: '+value);
			that.input.setVal(name, index, value);
		});
		return;
	};

	FormHTML.prototype.setLangs = function(){
		var lang, value, newLabel,
			that = this,
			defaultLang = $form.find('#form-languages').attr('data-default-lang');
		////console.log('found default language: '+defaultLang);
		$('#form-languages').detach().insertBefore($('form.jr').parent());
		if (!defaultLang || defaultLang==='') {
			defaultLang = $('#form-languages a:eq(0)').attr('lang');
		}
		console.debug('default language is: '+defaultLang);

		if ($('#form-languages a').length < 2 ){
			$form.find('[lang]').addClass('active');
			//hide the short versions if long versions exist
			$form.find('.jr-form-short.active').each(function(){
				if ($(this).siblings('.jr-form-long.active').length > 0){
					$(this).removeClass('active');
				}
			});
			this.setHints();//defaultLang);
			return;
		}

		//$form.find('#form-languages').addClass('ui-helper-clearfix');
		$('#form-languages a').click(function(event){
			event.preventDefault();
			lang = $(this).attr('lang');
			$('#form-languages a').removeClass('active');
			$(this).addClass('active');
			////console.log('going to hide langauges');

			//$form.find('[lang]').not('.jr-hint, .jr-constraint-msg, jr-option-translations>*').show().not('[lang="'+lang+'"], [lang=""], #form-languages a').hide();
			$form.find('[lang]').removeClass('active').filter('[lang="'+lang+'"], [lang=""]').addClass('active');

			//hide the short versions if long versions exist
			$form.find('.jr-form-short.active').each(function(){
				if ($(this).siblings('.jr-form-long.active').length > 0){
					$(this).removeClass('active');
				}
			});

			//swap language of <select> <option>s
			$form.find('select>option').not('[value=""]').each(function(){
				value = $(this).attr('value');
				////console.log('option value is '+value);
				newLabel = $(this).parent('select').next('.jr-option-translations')
					.children('.active[data-option-value="'+value+'"]').text().trim();
				////console.log('new option label is '+newLabel +' with length: '+newLabel.length);
				newLabel = (typeof newLabel !== 'undefined' && newLabel.length > 0) ? newLabel : '[MISSING TRANSLATION]';
				
				$(this).text(newLabel);
			});

			//quickfix for labels and legends that do not contain a span.active without other class
			$form.find('legend span.active:not(.jr-hint, .jr-constraint-msg), label span.active:not(.jr-hint, .jr-constraint-msg)').each(function(){
				if ( $(this).text().trim().length === 0 ){
					$(this).text('[MISSING TRANSLATION]');
				}
			});

			that.setHints();
			//$form.fixLegends();
			$form.trigger('changelanguage');
		});
		$('#form-languages a[lang="'+defaultLang+'"]').click();
	};
		
	// called whenever language or ouput value changes
	FormHTML.prototype.setHints = function(){
		var hint, $wrapNode;
		////console.log('setting hints, lang is '+lang);
		$form.find('*>.jr-hint').parent().each(function(){
			if ($(this).prop('nodeName').toLowerCase() !== 'label' && $(this).prop('nodeName').toLowerCase() !== 'fieldset' ){
				$wrapNode = $(this).parent('fieldset');
			}
			else{
				$wrapNode = $(this);
			}
			//if ($wrapNode.length > 0){
			hint = ($wrapNode.length > 0 ) ? //&& lang !== 'undefined' && lang !== '') ? 
				$(this).find('.jr-hint.active').text().trim() : $(this).find('span.jr-hint').text().trim();
			//}
			
			////console.debug('hint: '+hint);
			if (hint.length > 0){
				////console.debug('setting hint: '+hint);
				//$(this).find('input, select').attr('title', hint);
				$wrapNode.find('.question-icons .hint').attr('title', hint).addClass('ui-icon ui-icon-help');
			}
			else{
				$wrapNode.find('.question-icons .hint').removeAttr('title').removeClass('ui-icon ui-icon-help');
			}
		});
		$form.tooltip(); //  use refresh() ??
	};

	//FormHTML.prototype.reset = function(){
//		//var value1st;
//		//ADD ?? checkForOpenForm(false);
//		$form.reset();
//		this.recordName.reset();
//		this.recordStatus.reset();
//		form.editStatus.set(false);//

//		//$('#survey-title').text('New Survey');//

//		//$('button#delete-form').hide();//

//		//set the combobox with the list of files back to the first item
//		
//	};

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

	// evaluate the skip logic in data-relevant attributes
	// this function should be called whenever $data has been updated
	// If this becomes more complex it is probably better to create a branch object:
	// branch.anim, branch.filter, branch.duration, branch.update, branch.init() //for eventhandlers
	// this would actually be more consistent too as it's more modular like widgets, repeats, preloads
	FormHTML.prototype.branch = {
		init: function(){
			//console.debug('initializing branches');
			$form.on('click', '.jr-branch', function(event){
				var $that = $(this);
				if(!$(this).hasClass('busy')){
					if ($(this).hasClass('show')){
						$(this).addClass('busy').removeClass('show').next().hide('blind', {}, 600, function(){
							$that.removeClass('busy');
						});
					}
					else{
						$(this).addClass('busy show').next().show('blind', {}, 600, function(){
							$that.removeClass('busy');
							$that.next().fixLegends();
						});
					}
				}
				
			});
			this.update();
		},
		/**
		 * updates branches based on changed input fields
		 * @param  {string=} changedNodeNames [description]
		 * @return {?boolean}                  [description]
		 */
		update: function(changedNodeNames){
			var i, p, branchNode, result, namesArr, cleverSelector,			
				alreadyCovered = {},
				that=this;
			
			namesArr = (typeof changedNodeNames !== 'undefined') ? changedNodeNames.split(',') : [];
			cleverSelector = (namesArr.length > 0) ? [] : ['[data-relevant]'];
			
			for (i=0 ; i<namesArr.length ; i++){
				cleverSelector.push('[data-relevant*="'+namesArr[i]+'"]');
			}

			console.debug('Updating branches for expressions that contain: '+namesArr.join());
			//console.debug('the clever selector created: '+cleverSelector.join());

			$form.find(cleverSelector.join()).each(function(){
				//VERY WRONG TO USE form HERE!!!! FIX THIS
				//one could argue that I should not use the input object here as a branch is not always an input (sometimes a group)		
				//console.debug('input node with branching logic:');
				//console.debug($(this));
				p = form.input.getProps($(this));
				branchNode = form.input.getWrapNodes($(this));
				
				//name = $(this).attr('name');
				
				if ((p.inputType == 'radio' || p.inputType == 'checkbox') && alreadyCovered[p.path]){
					return;
				}
				console.debug('properties of branch input node:');
				console.debug(p);
				////console.debug(branchNode);

				//type = $(this).prop('nodeName').toLowerCase();
				//type = (type == 'input') ? $(this).attr('type').toLowerCase() : type;
				
				//expr = $(this).attr('data-relevant'); //"5 = 5";

				//branchNode = (type == 'fieldset') ? $(this) : 
				//	(type == 'radio' || type == 'checkbox') ? $(this).parent().parent('fieldset') : $(this).parent('label');

				if(branchNode.length !== 1){
					console.error('could not find branch node');
					return;
				}
				try{
					//var result = evaluator.evaluate(expr, context.documentElement, null, XPathResult.BOOLEAN_TYPE, null);
					result = data.evaluate(p.relevant, 'boolean', p.path, p.ind);
					//console.debug('evaluated branch logic to: '+result+' (type: '+(typeof result)+')');
				}
				catch(e){
					console.error('Serious error occurred trying to evaluate skip logic '+
					'for node with name: "'+p.path+'" (message: '+e.message+')');
					return;
				}
			
				alreadyCovered[p.path] = true;

				//for mysterious reasons '===' operator fails after Advanced Compilation even though result has value true 
				//and type boolean
				if (result === true){
					that.enable(branchNode);
				}
				else {
					that.disable(branchNode);
				}
			});
			return true;
		},
		/**
		 * Enables and reveals a branch node/group
		 * @param  {jQuery} branchNode [description]
		 * @return {jQuery}            [description]
		 */
		enable : function(branchNode){
			var type;
			console.debug('enabling branch');

			branchNode.prev('.jr-branch').hide('slow', function(){$(this).remove();});
			
			//branchNode.removeAttr('disabled');
			branchNode.removeClass('disabled').show('blind', {direction: 'up'}, 1000, function(){$(this).fixLegends();} );

			type = branchNode.prop('nodeName').toLowerCase();

			return (type == 'label') ? branchNode.children('input, select, textarea')
				.removeAttr('disabled') : branchNode.removeAttr('disabled');
		},
		disable : function(branchNode){
			var type, 
				branchClue = '<div class="jr-branch"></div>'; //ui-corner-all

			console.debug('disabling branch');
			//add disabled class (to style) and hide
			branchNode.addClass('disabled').hide(); //HUH??? Hide() DOESN"T WORK WITH PARAMETERS!
			//NOTE: DATA IS NOT REMOVED WHICH IS WRONG!
			
			//if the branch was previously enabled
			if (branchNode.prev('.jr-branch').length === 0){
				branchNode.before(branchClue);
				//if the branch was hidden upon loading, then shown and then hidden again
				//difficult to detect. Maybe better to just replace clearInputs with setDefaults	
				////console.debug('going to clear branch:');
				////console.debug(branchNode);
				branchNode.clearInputs('change');
			}

			//since all fields are emptied they can be marked as valid
			//branchNode.find('input, select, textarea').each(function(){
			//	this.setValid($(this));
			//});

			type = branchNode.prop('nodeName').toLowerCase();

			return (type == 'label') ? branchNode.children('input, select, textarea')
				.attr('disabled', 'disabled') : branchNode.attr('disabled', 'disabled');
	
		}
	};

/**
 * Function: outputUpdate
 * 
 * description
 * 
 * Parameters:
 * 
 * @param {string=} changedNodeNames - [type/description]
 * 
 * Returns:
 * 
 *   return description
 */
	FormHTML.prototype.outputUpdate = function(changedNodeNames){
		var i, $inputNode, contextPath, contextIndex, expr, namesArr, cleverSelector, 
			that=this,
			val='';
		console.log('updating active outputs that contain: '+changedNodeNames);
		namesArr = (typeof changedNodeNames !== 'undefined') ? changedNodeNames.split(',') : [];
		cleverSelector = (namesArr.length > 0) ? [] : ['.jr-output[data-value]'];
		for (i=0 ; i<namesArr.length ; i++){
			cleverSelector.push('.jr-output[data-value*="'+namesArr[i]+'"]');
		}
		//console.debug('the clever selector created: '+cleverSelector.join());
		
		$form.find(':not([disabled]) span.active').find(cleverSelector.join()).each(function(){
			try{
					expr = $(this).attr('data-value');
			//val = data.node($(this).attr('data-value')).getVal();
			///if (typeof expr !== 'undefined' && expr.length > 0){
				//temporary solution to make eMCI form run, some weird stuff in <output value= expressions
			//	try{
					//console.log('trying output expression: '+expr);
		
					val = data.evaluate(expr, 'string');
					//console.log(val);
				}
				catch(e){
					console.error('error occurred trying to evaluate output value from expression: '+
						expr+', (message:'+e.message+')');
					val = '[ERROR]';
				}
			//}	
//			} 
//			catch(e){
//				val = $(this).attr('data-value');
//				//console.log('output value was not referring to a node value, and was therefore assumed to be a string:' +val);
//			}
			$(this).text(val);
		});
		$form.fixLegends();
		//hints may have changed too
		this.setHints();
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

	FormHTML.prototype.beautify = function(){
		//$form.find('.jr-group, .jr-repeat').addClass('ui-corner-all');
		//$form.find('h2#form-title').addClass('ui-widget-header ui-corner-all');		
		$form.find('.trigger').addClass('ui-state-highlight');// ui-corner-all');

		//improve looks when images, video or audio is used as label
		$('fieldset:not(.jr-appearance-compact)>label, fieldset:not(.jr-appearance-compact)>legend').children('img,video,audio').parent().addClass('ui-helper-clearfix with-media');
	};

	FormHTML.prototype.widgets = {
		init : function(){
			this.compactWidget();
			this.radioWidget();
			this.dateWidget();
			this.timeWidget();
			this.dateTimeWidget();
			this.selectOneWidget();
			this.selectMultiWidget();
			this.pageBreakWidget();
			this.readonlyWidget();
			this.gridWidget();
			this.spinnerWidget();
			this.sliderWidget();
			this.geopointWidget();
			this.barcodeWidget();
			this.fileWidget();
		},
		compactWidget: function(){
			//move this to css!
			$form.find('.jr-appearance-compact>label>span').hide(); 
		},
		radioWidget: function(){
			//$form.on('mouseup', 'input:radio:checked', function(){
			//	console.debug($(this).prop('checked'));
			//	//$(this).parent('label').clearInputs('change');
			//	console.debug('clicked label of: '+$(this).attr('name'));
			//}); 
		},
		dateWidget : function(){
			
			/*$form.find('input[type="date"]').click(function(e){
				e.preventDefault();
			}).datepicker({
				onSelect: function(dateText){
					var d = new Date(dateText),
						dv = d.getFullYear().toString().pad(4)+'-'+(d.getMonth()+1).toString().pad(2)+'-'+d.getDate().toString().pad(2);
					$(this).val(dv).trigger('change');
				}
			});*/
			if(!Modernizr.inputtypes.date){
				$form.find('input[type="date"]').datepicker({});
			}
		},
		timeWidget : function(){
			if(!Modernizr.inputtypes.time){
				$form.find('input[type="time"]').timepicker({});
			}
		}, 
		dateTimeWidget : function(){
			if(!Modernizr.inputtypes.datetime){
				$form.find('input[type="datetime"]').datetimepicker();
			}
		},
		selectOneWidget : function(){
			//note: in chrome size is at least 4 if multiple attr is present
			$form.find('select:not([multiple])').attr('size', '1');//.find('[value=""]').remove();	
			$('select:not([multiple])').multiselect({
				'multiple': false,
				'header': 'Select one option',
				'noneSelectedText': 'Select one option',
				'selectedList': 1,
				'position': {
					'my':'left top', 
					'at': 'left bottom'
				}//,
				//selectedList: 1
			});		
		},
		selectMultiWidget : function(){
			//note: in chrome size is at least 4 if multiple attr is present
			$form.find('select[multiple]').attr('size', '5').find('[value=""]').remove(); //for html form

			$('select[multiple]').multiselect({
				'header': 'false', 
				'position': {
					'my':'left top', 
					'at': 'left bottom'
				}

			});
		},
		//transforms temporary page-break elements to triggers //REMOVE WHEN BETTER SOLUTION FOR PAGE BREAKS IS FOUND
		pageBreakWidget : function(){
			$form.find('.jr-appearance-page-break input[readonly]').parent('label').each(function(){
				var	name = 'name="'+$(this).find('input').attr('name')+'"';
				$('<fieldset class="jr-appearance-page-break" '+name+'></fieldset>') //ui-corner-all
					.insertBefore($(this)).find('input').remove(); 
				$(this).remove();
			});
		},
		//transforms readonly inputs into triggers
		readonlyWidget : function(){
			$form.find('input[readonly]:not([data-type-xml="geopoint"])').parent('label').each(function(){
				//var $spans = $(this).find('span').not('.question-icons span').detach(); 
				var html = $(this).html(),
					relevant = $(this).find('input').attr('data-relevant'),
					name = 'name="'+$(this).find('input').attr('name')+'"',
					attributes = (typeof relevant !== 'undefined') ? 'data-relevant="'+relevant+'" '+name : name;
				$('<fieldset class="trigger ui-state-highlight" '+attributes+'></fieldset>') //ui-corner-all
					.insertBefore($(this)).append(html).find('input').remove(); 
				$(this).remove();
			});
		},
		gridWidget :function(){
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
			console.log('initializing geopoint widget');

			//function update(){alert('updating')}
			$form.find('input[data-type-xml="geopoint"]').each(function(){ //.attr('placeholder', 'Awesome geopoint widget will follow in the future!');
				var $lat, $lng, $alt, $acc, $button, $map, mapOptions, map, marker,
					$inputOrigin = $(this),
					$geoWrap = $(this).parent('label');
				$geoWrap.addClass('geopoint');
				
				$inputOrigin.hide().after('<div class="map-canvas"></div>'+
					'<label>latitude (x.y &deg;)<input name="lat" type="number" step="0.0001" /></label>'+
					'<label>longitude (x.y &deg;)<input name="long" type="number" step="0.0001" /></label>'+
					'<label>altitude (m)<input name="alt" type="number" step="0.1" /></label>'+
					'<label>accuracy (m)<input name="acc" type="number" step="0.1" /></label>'+
					'<button name="geodetect" type="button">detect</button>'); 
				$map = $geoWrap.find('.map-canvas');
				$lat = $geoWrap.find('[name="lat"]');
				$lng = $geoWrap.find('[name="long"]');
				$alt = $geoWrap.find('[name="alt"]');
				$acc = $geoWrap.find('[name="acc"]');
				$button = $geoWrap.find('button[name="geodetect"]');
				
				$geoWrap.find('input').not($inputOrigin).on('change change.bymap', function(event){
					console.debug('change event dected');
					var lat = ($lat.val() !== '') ? $lat.val() : 0.0, 
						lng = ($lng.val() !== '') ? $lng.val() : 0.0, 
						alt = ($alt.val() !== '') ? $alt.val() : 0.0, 
						acc = $acc.val();
					//event.preventDefault();
					$inputOrigin.val(lat+' '+lng+' '+alt+' '+acc).trigger('change');
					//console.log(event);
					if (event.namespace !== 'bymap'){
						updateMap(lat, lng);
					}
					//event.stopPropagation();
					return false;
				});

				if (!navigator.geolocation){
					$button.attr('disabled', 'disabled');
				}
				//default map view
				if (typeof google !== 'undefined' && typeof google.maps !== 'undefined'){
					updateMap(0,0,1);
				}

				$button.click(function(event){
					event.preventDefault();
					console.debug('click event detected');
					console.debug(event);
					navigator.geolocation.getCurrentPosition(function(position){	
						updateMap(position.coords.latitude, position.coords.longitude);
						updateInputs(position.coords.latitude, position.coords.longitude, position.coords.altitude, position.coords.accuracy);	
					});
					return false;
				}).click();
				/**
				 * [updateMap description]
				 * @param  {number} lat  [description]
				 * @param  {number} lng  [description]
				 * @param  {number=} zoom [description]
				 */
				function updateMap(lat, lng, zoom){
					zoom = zoom || 15;
					if (typeof google !== 'undefined' && typeof google.maps !== 'undefined'){
						mapOptions = {
							zoom: zoom,
							center: new google.maps.LatLng(lat, lng),
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							streetViewControl: false
						};
						map = new google.maps.Map($map[0], mapOptions);
						placeMarker();
						// place marker where user clicks
						google.maps.event.addListener(map, 'click', function(event){
							updateInputs(event.latLng.lat(), event.latLng.lng(), '', '', 'change.bymap');
							placeMarker(event.latLng);
						});
					}
				}

				function centralizeWithDelay(){
					window.setTimeout(function() {
						map.panTo(marker.getPosition());
					}, 5000);
				}

				/**
				 * [placeMarker description]
				 * @param  {Object.<string, number>=} latLng [description]
				 */
				function placeMarker(latLng){
					latLng = latLng || map.getCenter();
					if (typeof marker !== 'undefined'){
						marker.setMap(null);
					}
					marker = new google.maps.Marker({
						position: latLng, //map.getCenter(),
						map: map,
						draggable: true
					});
					// dragging markers
					google.maps.event.addListener(marker, 'dragend', function() {
						updateInputs(marker.getPosition().lat(), marker.getPosition().lng(), '', '', 'change.bymap');
						centralizeWithDelay();
					});
					centralizeWithDelay();
					//center it (optional)
					//map.setCenter(latLng);
				}
				/**
				 * [updateInputs description]
				 * @param  {number} lat [description]
				 * @param  {number} lng [description]
				 * @param  {(string|number)} alt [description]
				 * @param  {(string|number)} acc [description]
				 * @param  {string=} ev  [description]
				 */
				function updateInputs(lat, lng, alt, acc, ev){
					alt = alt || '';
					acc = acc || '';
					ev = ev || 'change';
					$lat.val(Math.round(lat*10000)/10000);
					$lng.val(Math.round(lng*10000)/10000);
					$alt.val(Math.round(alt*10)/10);
					$acc.val(Math.round(acc*10)/10).trigger(ev);
				}
	
			});
		},
		autoCompleteWidget: function(){

		},
		barcodeWidget : function(){
			$form.find('input[data-type-xml="barcode"]').attr('placeholder', 'not supported in browser data entry').attr('disabled', 'disabled');
		},
		fileWidget : function(){
			$form.find('input[type="file"]').attr('placeholder', 'not supported yet').attr('disabled', 'disabled');
		}
	};

	/*Note that preloaders may be deprecated in the future, so not important*/
	//functions are design to fail silently if unknown preloaders are called
	FormHTML.prototype.preloads = {
		init: function(){
			var item, param, name, curVal,
				that = this;
			//console.log('initializing preloads');
			$form.find('#jr-preload-items input').each(function(){
				item = $(this).attr('data-preload').toLowerCase();
				param = $(this).attr('data-preload-params').toLowerCase();
				name = $(this).attr('name');
				if (typeof that[item] !== 'undefined'){
					//proper way would be to add index
					curVal = data.node(name).getVal();
					that.setVal($(this), that[item]({param: param, curVal:curVal, node: $(this)}));
				}
				else{
					console.error('Preload "'+item+'"" not supported. May or may not be a big deal.');
				}
			});
		},
		setVal: function(node, val){
			//console.debug('preload input node:');
			//console.debug(node);
			//console.debug('value of preload item to set:' +val);
			//node.removeAttr('disabled').val(val.toString()).trigger('change').attr('disabled', 'disabled');
			node.val(val.toString()).trigger('change');
		},
		'timestamp' : function(o){
			var that = this;
			// when is 'start' or 'end'
			if (o.param == 'start' && o.curVal !== ''){
				return (o.curVal === '') ? o.curVal : data.evaluate('now()', 'string');
			}
			if (o.param == 'end'){
				//set event handler for each save event (needs to be triggered!)
				$form.on('beforesave', function(){that.setVal(o.node, data.evaluate('now()', 'string'));});
				return data.evaluate('now()', 'string');
			}
			return '';
		},
		'date' : function(o){
			var today, year, month, day;

			if (o.curVal !== ''){
				today = new Date(data.evaluate('today()', 'string'));
				year = today.getUTCFullYear().toString().pad(4);
				month = (today.getUTCMonth() + 1).toString().pad(2);
				day = today.getUTCDate().toString().pad(2);

				return year+'-'+month+'-'+day;
			}
			return o.curVal;
		},
		'property' : function(o){
			// of = 'deviceid', 'subscriberid', 'simserial', 'phonenumber'
			// return '' except for deviceid?
			return 'no property preload in Rapaide';
		},
		'context' : function(o){
			// 'application', 'user'??
			return (o.param == 'application') ? 'rapaide' : '';
		},
		'patient' : function(o){
			return 'not supported in Rapaide';
		},
		'user' : function(o){
			//uuid, user_id, user_type
			return 'user preload item not functioning yet';
		},
		'uid' : function(o){
			//general
			return 'no uid';
		},
		'browser' : function(o){
			//console.debug('evaluation browser preload');
			if (o.param == 'name'){
				
				var a = ($.browser.webkit) ? 'webkit' : ($.browser.mozilla) ? 'mozilla' : ($.browser.opera) ? 'opera' : ($.browser.msie) ? 'msie' : 'unknown';
				//console.debug(a);
				return a;
			}
			if (o.param == 'version'){
				return $.browser.version;
			}
		},
		'os': function(o){
			return 'not known';
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
		 * Function: init
		 * 
		 * Initiates all Repeat Groups in form (only called once).
		 * 
		 * Returns:
		 * 
		 *   return description
		 */
		init : function(){
			var i, numRepsInCount, repCountPath, numRepsInInstance, numRepsDefault,
				that=this;
			//console.debug('initializing repeats');
			$form.find('fieldset.jr-repeat').prepend('<span class="repeat-number"></span>');
			$form.find('fieldset.jr-repeat:not([data-repeat-fixed])')
				.append('<button type="button" class="repeat"></button><button type="button" class="remove"></button>');
			$form.find('button.repeat').button({'text': false, 'icons': {'primary':"ui-icon-plusthick"}});
			$form.find('button.remove').button({'disabled': true, 'text':false, 'icons': {'primary':"ui-icon-minusthick"}});

			//MOVE HANDLERS to FormHTML.eventHandlers?
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
				numRepsInCount = (repCountPath.length > 0) ? parseInt(data.node(repCountPath).getVal(), 10) : 0;
				//console.debug('number of reps in count attribute: ' +numRepsInCount);
				numRepsInInstance = data.node($(this).attr('name')).get().length;
				numRepsDefault = (numRepsInCount > numRepsInInstance) ? numRepsInCount : numRepsInInstance;
				
				//console.log('default number of repeats for '+$(this).attr('name')+' is '+numRepsDefault);
				//1st rep is already included (by XSLT transformation)
				for (i = 1 ; i<numRepsDefault ; i++){
					that.clone($(this).siblings().andSelf().last(), '');
				}
			});
		},
		/**
		 * Function: clone
		 * 
		 * description
		 * 
		 * Parameters:
		 * 
		 *   node - [type/description]
		 * 
		 * Returns:
		 * 
		 *   return description
		 */
		clone : function($node, ev){
			var $master, $clone, $parent, index, radioNames, i, path, timestamp,
				that = this;
			if ($node.length !== 1){
				console.error('Nothing to clone');
				return false;
			}
			$parent = $node.parent('fieldset.jr-group');
			$master = $parent.children('fieldset.jr-repeat:not(.clone)').eq(0);
			//create a clone and
			$clone = $master.clone(false);//deep cloning with button events causes problems
			//remove any clones inside this clone.. (cloned repeats within repeats..)
			$clone.find('.clone').remove();
			$clone.addClass('clone');//.removeClass('invalid ui-state-error');
			//re-initialize buttons
			$clone.find('button.remove').button({'text':false, 'icons': {'primary':"ui-icon-minusthick"}});
			$clone.find('button.repeat').button({'text': false, 'icons': {'primary':"ui-icon-plusthick"}});

			$clone.insertAfter($node)
				//.find('button').removeClass('ui-state-hover')
				.parent('.jr-group').numberRepeats();
			$clone.hide().show('highlight',{ },600); //animations that look okay: highlight, scale, slide
			//is this code actually working?
			//clone.find('input, select, textarea').val(null);
			$clone.clearInputs(ev);
			$clone.find('.invalid input, .invalid select, .invalid textarea').each(function(){
				that.setValid($(this));
			});
			//clone.find('fieldset.jr-repeat').addClass('clone');

			//note: in http://formhub.org/formhub_u/forms/hh_polio_survey_cloned/form.xml a parent group of a repeat
			//has the same ref attribute as teh nodeset attribute of the repeat. This would cause a problem determining 
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
			//console.debug ('different radioNames in clone: '+radioNames.join());
			for (i=0; i<radioNames.length ;i++){
				timestamp = new Date().getTime().toString();
				//index of the clone is index of the master node + 1
				//clone.find('input[type="radio"][name="'+radioNames[i]+'"]').attr('name', radioNames[i]+'____'+(index+1));
				$clone.find('input[type="radio"][data-name="'+radioNames[i]+'"]').attr('name', timestamp);
			}

			this.toggleButtons($master.parent());

			//create a new data point in <instance> by cloning the template node
			path = $master.attr('name');

			//0-based index of node in a jquery resultset when using a selector with that name attribute
			//console.log('index of form node to clone: '+index);
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
				repeatIndex = $form.find('[name="'+repeatPath+'"]').index(node),
				parentGroup = node.parent('fieldset.jr-group');
			//var parent = node.parent('fieldset.jr-repeat');
		
			//var parentSiblings = parent.siblings();
		
			node.hide('drop',{}, delay, function(){
				node.remove();
				parentGroup.numberRepeats();

				that.toggleButtons(parentGroup);
			});

			//now remove the data node
			data.node(repeatPath, repeatIndex).remove();

			$form.trigger('changerepeat'); 
		},
		toggleButtons : function(node){
			//var constraint;
			node = (typeof node == 'undefined' || node.length === 0 || !node) ?	node = $form : node;
			
			//first switch everything off and remove hover state
			node.find('button.repeat, button.remove').button('disable').removeClass('ui-state-hover');
		
			//enable last + button if constraint is true or non-existing
			//constraint = node.attr('data-constraint');
			//if ((constraint.length > 0 && evalXpression(constraint) === true) || typeof constraint == 'undefined'){
				node.find('fieldset.jr-repeat:last-child > button.repeat').button('enable');
			//}
			// the nth-child selector is a bit dangerous. It relies on this structure <fieldset class="jr-repeat"><h2></h2><label><label><label></fieldset>
			// alternatively, we could allow the first repeat to be deleted as well (as long as it is not the ONLY repeat)
			node.find('fieldset.jr-repeat:not(:nth-child(2)) > button.remove').button('enable'); //Improve this so that it enables all except first
		}
	};
	
	FormHTML.prototype.setEventHandlers = function(){
		var n, valid,//path, index, constraint, value, values, inputType, xmlDataType, indexOfAddition, gpIndex, $fieldset, valid, 
			that = this;

		//first prevent default submission, e.g. when text field is filled in and Enter key is pressed
		$('form.jr').attr('onsubmit', 'return false;');

		$form.on('change validate', 'input, select, textarea', function(event){ 
			n = that.input.getProps($(this));
			//console.debug('change event detected trigger by element with following properties:');
			//console.debug(n);

			//the enabled check serves a purpose only when an input field itself is marked as enabled but its parent fieldset is not
			if (event.type == 'validate'){
				//if an element is disabled mark it as valid (to undo a previously shown branch with fields marked as invalid)
				valid = (n.enabled && n.inputType !== 'hidden') ? data.node(n.path, n.ind).validate(n.constraint, n.xmlType) : true;
			}
			else{
				valid = data.node(n.path, n.ind).setVal(n.val, n.constraint, n.xmlType);
			}
			
			//console.log('data.set validation returned valid: '+valid);
			//additional check for 'required'
			valid = (n.enabled && n.inputType !== 'hidden' && n.required && n.val.length < 1) ? false : valid;

			if (typeof valid !== 'undefined' && valid !== null){
				return (valid === false) ? that.setInvalid($(this)) : that.setValid($(this));
			}
		});	
		
		//nodeNames is comma-separated list as a string
		$form.on('dataupdate', function(event, nodeNames){
			//nodeNames = nodeNames.split(',');
			//console.debug('dataupdate detected on: '+nodeNames);
			//console.debug(event);
			
			that.calcUpdate(nodeNames); //EACH CALCUPDATE THAT CHANGES A VALUE TRIGGERS ANOTHER CALCUPDATE => VERY INEFFICIENT
			that.branch.update(nodeNames);
			that.outputUpdate(nodeNames);
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
			//set defaults of added repeats, setAllValls does not trigger change event
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
		$(window).resize(function(){
			$form.fixLegends();
		});

		$form.on('changelanguage', function(){
			//console.log('changelanguage event detected');
			that.outputUpdate();
		});
	};

	FormHTML.prototype.setValid = function(node){
		//var visualNode;
		//visualNode = (type == 'checkbox' || type == 'radio') ? node.parent().parent('fieldset') : node.parent('label');
		//visualNode.removeClass('invalid');//.find('div.invalid').remove();
		this.input.getWrapNodes(node).removeClass('invalid ui-state-error');
	};

	FormHTML.prototype.setInvalid = function(node){
		//var visualNode;
		//visualNode = (type == 'checkbox' || type == 'radio') ? node.parent().parent('fieldset') : node.parent('label');
		//visualNode.addClass('invalid');
//		if (!visualNode.children().first().hasClass('invalid')){
//			visualNode.prepend(
//				$('<div class="invalid"></div>').append(visualNode.find('.jr-constraint-msg'))
//			);
//			visualNode.find('.invalid .active').show(); // THIS LINE CAN BE REMOVE WHEN SETLANG() IS REFACTORED USE CSS FOR DISPLAYING
//		}
		this.input.getWrapNodes(node).addClass('invalid ui-state-error');
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
		while (parent.length == 1 && parent.prop('nodeName') !== '#document'){
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
		$form.find('input, select, textarea').trigger('validate');
		return this.isValid();
	};

	/**
	 * Returns true is form is valid and false if not. Needs to be called AFTER (or by) validateAll()
	 * @return {!boolean} whether the form is valid
	 */
	FormHTML.prototype.isValid = function(){
		return ($form.find('.invalid').length > 0) ? false : true;
	};
}

GUI.prototype.setCustomEventHandlers = function(){};

/**
 * Converts a native Date UTC String to a JavaRosa style date string
 * @return {string} a date or datetime string formatted according to JavaRosa
 */
Date.prototype.toJrString = function(){
	//2012-09-05T12:57:00.000-04 (ODK)
	//2012-09-01 (ODK)
	var timezone,
		date=this,
		jrDate = date.getUTCFullYear().toString().pad(4)+'-'+(date.getUTCMonth()+1).toString().pad(2)+'-'+date.getUTCDate().toString().pad(2);
	//console.log('date: '+date.toString());
	if ( date.getUTCMilliseconds() > 0 || date.getUTCSeconds() > 0 || date.getUTCMinutes() > 0 || date.getUTCHours()>0 ){
		jrDate += 'T'+date.getHours().toString().pad(2)+':'+date.getMinutes().toString().pad(2)+':'+date.getSeconds().toString().pad(2)+
			'.'+date.getMilliseconds().toString().pad(3);
		timezone = date.getTimezoneOffset()/60;
		jrDate += (timezone < 0) ? '+'+(-timezone).toString().pad(2) : '-'+timezone.toString().pad(2);
		//(-date.getTimezoneOffset()/60);
	}
	return jrDate;
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
						$(this).val('').trigger(ev);
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
						$(this)[0].selectedIndex = -1;
						$(this).trigger(ev);
						break;
					default:
						console.error('Unrecognized input type found when trying to reset: '+type);
				}
			});
		});
	};

	//this corrects a problem caused by the css legend fix (that positions the legend as 'absolute')
	//it corrects the margin-top of the first <label> sibling following a <legend>
	//the whole form (or several) can be provides as the context
	$.fn.fixLegends = function() {
		var legendHeight;
		////console.log('fixing legends');
		return this.each(function(){
			$(this).find('legend + label').each(function(){
				//console.error('found legend');
				legendHeight = ($(this).prev().find('.jr-constraint-msg.active').length > 0 && $(this).prev().height() < 36) ? 36 : 
					($(this).prev().height() < 19) ? 19 : 
					$(this).prev().height();
				
				$(this).animate({
					'margin-top' : (legendHeight+6)+'px'
				}, 600 );
			});
		});
	};


	/**
	 * Function: xfind
	 * 
	 * Simple XPath Compatibility Plugin for jQuery 1.1
	 * By John Resig
	 * Dual licensed under MIT and GPL.
	 * some changes made by Martijn van de Rijdt (not replacing $.find(), removed context)
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
	 *   Original plugin code here: http://code.google.com/p/jqueryjs/source/browse/trunk/plugins/xpath/jquery.xpath.js?spec=svn3167&r=3167
	 */
    $.fn.xfind = function(selector){
			var parts, cur, i;
			////console.debug('xfind plugin received selector: '+selector);
			// Convert the root / into a different context
            //if ( !selector.indexOf("/") ) {
            //        context = context.documentElement;
            //        selector = selector.replace(/^\/\w*/, "");
            //        if ( !selector )
            //                return [ context ];
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

            //selector += ':not([template], [template] *)';
            ////console.debug('xfind plugin going to return jQuery object with selector: '+selector);
            //if performance becomes an issue, it's worthwhile implementing this with native XPath instead.
            return this.find(selector);
    };

})(jQuery);