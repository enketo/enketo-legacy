/*global mockForms2, mockInstances*/

/**
 * [FormDataController description]
 * @param {{instanceId: string, entityId: string}} params [description]
 * @constructor
 */
function FormDataController(params){
	params = params || {};
	var originalInstanceId = params.instanceId || null;
	var formDataRepository = new enketo.FormDataRepository();
    var controller = new enketo.FormDataController(
        new enketo.EntityRelationshipLoader(),
        new enketo.FormDefinitionLoader(),
        new enketo.FormModelMapper(formDataRepository, new enketo.SQLQueryBuilder(formDataRepository), new enketo.IdFactory(new enketo.IdFactoryBridge())),
        formDataRepository, new enketo.FormSubmissionRouter());

    /**
	 * Gets instance as JSON from Dristhi DB - Should this be asynchronous?
	 * @return {?*} Form Data JSON object
	 */
    this.get = function(){
		return controller.get(params) || null;
	};

	/**
	 * Passes instance as JSON to store in Dristhi DB - Should this be asynchronous?
	 * @param  {string} instanceId	the new instanceID of the record
	 * @param  {*}		data		Form Data JSON object 
	 * @return {boolean}     
	 */
	this.save = function(instanceId, data){
		controller.save(params, data);
		androidContext.goBack();
	};

	this.remove = function(instanceId){

	};
}

/**
 * Class maintaining a Drishti JSON Data Definition and deal with JSON <-> XML transformation
 * @param {FormDataJSON} data  Drishti Data Definition JSON
 * @constructor
 */
function JData(data){

	if (!data){
		recordError('No instance query parameter provided!');
	}

	var unboundSubformInstanceProps = ['id'];

	/**
	 * Transforms JSON to an XML string
	 * NOTE: alternatively, we could could overwrite Form.init() to use JSON data instead of XML for instantiation
	 * @return {?string}			XML string
	 */
	this.toXML = function(){
		var i, j, k, field, path, value, subForm, repeatInstance, defaultPath, repeatNodeName,
			$instance = $($.parseXML('<root />'));

		if (typeof data !== 'object'){
			recordError("error: no JSON object provided during instantiation");
		}
		//main form:
		for (i = 0; i<data.form.fields.length; i++){
			defaultPath = defaultPathFixed(data.form.default_bind_path);
			field = data.form.fields[i];
			//we only have to concern ourselves with fields that have a value (incl empty string)
			if (typeof field.value !== 'undefined'){
				path = (typeof field.bind === 'undefined') ? defaultPath + field.name : field.bind;
				value = field.value;
				addXMLNodeAndValue($instance, path, value);
				//console.log('added path: '+path+' with value: "'+value+'"');
			}
		}
		//repeats:
		if (data.form.sub_forms){
			for (i = 0; i<data.form.sub_forms.length; i++){
				subForm = data.form.sub_forms[i];
				defaultPath = defaultPathFixed(subForm.default_bind_path);
				repeatNodeName = defaultPath.match(/.*\/([^\/]*)\/$/)[1];
				if (!subForm.bind_type){
					recordError('Repeat (subform) is missing bind_type.');
				}
				else{
					for (j = 0; j < subForm.instances.length; j++){
						repeatInstance = subForm.instances[j];
						for (k = 0; k < subForm.fields.length; k++){
							field = subForm.fields[k];
							if (typeof repeatInstance[field.name] !== 'undefined' && unboundSubformInstanceProps.indexOf(field.name) == -1){
								path = (typeof field.bind === 'undefined') ? defaultPath + field.name : field.bind;
								value = repeatInstance[field.name];
								//note: also if the value is empty it is added!	
								addXMLNodeAndValue($instance, path, value, {name: repeatNodeName, index: j});
								console.log('added path: '+path+' with value: "'+value+'", repeat NodeName: '+repeatNodeName+' and repeat index: '+j);
							}
						}
					}
				}
			}
		}
		return (new XMLSerializer()).serializeToString($instance.find('instance>*:first')[0]);
	};

	/**
	 * Gets current state of form instance in JSON format.
	 */
	this.get = function(){
		var $repeatLeaves, origInstances,
			subFormsStarted = [],
			$mainLeaves = this.getInstanceXML(false).find('*').filter(function(){
				return $(this).children().length === 0;
			}),
			/* 
			 * issue: this relies on a template node to be present, which is not required for repeats in OpenRosa
			 * but thankfully is guaranteed in formhub-hosted forms. 
			 * Nested repeats are not supported!
			 */
			//$repeats = form.getDataO().$.find('instance:first [template]').siblings().filter(function(){
			$repeats = this.getInstanceXML(true).find('[template]').siblings().filter(function(){
				var nodeName = $(this).prop('nodeName');
				return $(this).siblings(nodeName+'[template]').length > 0;
			});

		//this code has to be refactored, as the unboundSubformInstanceProps stuff was bolted on when the JSON spec changed.
		$repeats.each(function(){
			var i, prop, bindPath, subForm, instanceIndex,
				subForms = [],
				instance = {},
				$repeat = $(this);
			//identifier for subform in JSON format is default_bind_path
			bindPath = '/model/instance'+$repeat.getXPath();
			if (data.form.sub_forms) {
				subForms = $.grep(data.form.sub_forms, function(subfrm){
					//be flexible with trailing slash
					return (subfrm.default_bind_path === bindPath || subfrm.default_bind_path === bindPath+'/');
				});
			}
			if (subForms.length === 0){
				recordError('Repeat definition not found (no subform with default_bind_path: "'+bindPath+'" in JSON format)');
			}
			else if (subForms.length > 1){
				recordError('Multiple repeat definititions found (multiple subforms with default_bind_path: "'+bindPath+'" in JSON format)');
			}
			else{
				subForm = subForms[0];
				if ($.inArray(bindPath, subFormsStarted) === -1){
					subFormsStarted.push(bindPath);
					origInstances = jQuery.extend(true, {}, subForm.instances);
					subForm.instances = [];
				}
				$repeatLeaves = $repeat.find('*').filter(function(){
					return $(this).children().length === 0;
				});
				$mainLeaves = $mainLeaves.takeOut($repeatLeaves);
				$repeatLeaves.each(function(){
					var props = getNodeProps($(this)),
						field = getField(props.path, subForm.fields, subForm.default_bind_path);
					if (field){
						//adding value even if it's empty without checking what it was previously
						instance[field.name] = props.value;
					}
				});
				subForm.instances.push(instance);
				//add subform instance properties that have no equivalent in XML - a quick and dirty addition
				instanceIndex = subForm.instances.indexOf(instance);
				for (i=0; i<unboundSubformInstanceProps.length; i++){
					prop = unboundSubformInstanceProps[i];
					if (origInstances[instanceIndex] && typeof origInstances[instanceIndex][prop] !== 'undefined'){
						//console.log('adding unbound property '+prop+'to repeat instance with index '+instanceIndex);
						instance[prop] = origInstances[instanceIndex][prop];
					}
				}
			}
		});

		$mainLeaves.each(function(){
			var props = getNodeProps($(this)),
				field = getField(props.path, data.form.fields, data.form.default_bind_path);
			if (field && (field.value || props.value.length > 0) ){
				field.value = props.value;
			}
		});
		return data;
	};

	/**
	 * gets XML from form wrapped as a JQuery XML object
	 * @param  {boolean} includeTemplates [description]
	 * @return {jQuery}                  [description]
	 */
	this.getInstanceXML = function(includeTemplates){
		return $($.parseXML(form.getDataStr(includeTemplates)));
	};

	/**
	 * given an XML path, obtains a field from a field array
	 * @param  {string} path
	 * @param  {Array.<{name:string, source: string, value: string, bind: string}>} fieldArr    array of field objects
	 * @param  {string} defaultPath																default bind path of form or subform
	 * @return {?{name:string, source: string, value: string, bind: string}}					field object
	 */
	function getField(path, fieldArr, defaultPath){
		var fields = $.grep(fieldArr, function(field){
			return (typeof field.bind  === 'undefined' && (defaultPath + field.name) === path) ||
				(typeof field.bind !== 'undefined' && field.bind === path);
		});

		if (fields.length > 1){
			recordError('Multiple fields found (multiple nodes with path: '+path+' found in JSON format.');
			return null;
		}
		/*else if (fields.length === 0 && path.indexOf('/meta/deprecatedID') !== -1){
			return null;
		}*/
		else if (fields.length === 0){
			recordError('Field not found (node with path: '+path+' was missing from JSON format).');
			return null;
		}
		else {
			console.debug('found field with path '+path+' in JSON Form Data');
			return fields[0];
		}
	}

	function getNodeProps($node){
		var partialPath = $node.getXPath('model'),
			fullPath = (partialPath.indexOf('/model/instance') === -1) ? '/model/instance'+partialPath : partialPath;
		return {
			nodeName: $node.prop('nodeName'),
			value: $node.text(),
			path: fullPath
		};
	}

	/**
	 * [addXMLNode description]
	 * @param {jQuery} $doc								jQuery doc with root element to add nodes to
	 * @param {string} path								path of node to be added when not present starting with / 
	 * @param {string} value							value of node
	 * @param {{name: string, index: number}=} repeatO	repeatObject with repeat nodeName and 0-based index of repeat parent of node to be added
	 * @return {jQuery}									jQuery doc with added node and value
	 */
	function addXMLNodeAndValue ($doc, path, value, repeatO){
		var j, $node,
			$current = $doc.find('root'),
			nodeNames = path.substring(1).split('/'),
			r = repeatO || {};

		for (j = 0; j<nodeNames.length ; j++){
			if ($current.children(nodeNames[j]).length === 0 ||
				(r.name && r.index && nodeNames[j] === r.name && $current.children(nodeNames[j]).eq(r.index).length === 0)){
				//console.log('nodeName does not exist, going to create it as child of ', $current[0]);
				$node = $($.parseXML('<'+nodeNames[j]+'/>').documentElement);
				$current.append($node);
				$current = $node;
			}
			else{
				$current = ( r.index && nodeNames[j] === r.name ) ? $current.children(nodeNames[j]).eq(r.index) : $current.children(nodeNames[j]);
			}

			if (j === (nodeNames.length - 1)){
				$current.text(value);
			}
		}
		return $doc;
	}

	//if the default path does not have a trailing slash, add one
	function defaultPathFixed (path){
		return (path.lastIndexOf('/') !== path.length -1) ? path + '/' : path;
	}

	function recordError(errorMsg){
		if (typeof data.errors == 'undefined') data.errors = [];
		data.errors.push(errorMsg);
		console.error(errorMsg);
	}
}

/**
 * Plugin that removes from a collection the nodes in the parameter that have the same Path
 */
(function($){
	$.fn.takeOut = function($nodes){
		return this.filter(function(){
			for (var i = 0 ; i<$nodes.length ; i++){
				if ($(this).getXPath() === $nodes.eq(i).getXPath()){
					//console.log('took out node: ', $(this));
					return false;
				}
			}
			return true;
		});
	};
})(jQuery);