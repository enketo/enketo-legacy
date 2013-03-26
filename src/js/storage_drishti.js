/*global mockForms2, mockInstances*/

/**
 * [FormDataController description]
 * @param {{instanceId: string, entityId: string}} params [description]
 * @constructor
 */
function FormDataController(params){
	params = params || {};
	var originalInstanceId = params.instanceId || null;
	/**
	 * Gets instance as JSON from Dristhi DB - Should this be asynchronous?
	 * @param  {string} instanceId [description]
	 * @return {?*}       [description]
	 */
	this.get = function(){
		// temporarily mocked
		return mockInstances[originalInstanceId] || null;
	};

	/**
	 * Passes instance as JSON to store in Dristhi DB - Should this be asynchronous?
	 * @param  {*} dataJ	JSON object with data
	 * @return {boolean}     
	 */
	this.save = function(instanceId, data){
		return true;
	};

	this.remove = function(instanceId){

	};
}

/**
 * Class maintaining a Drishti JSON Data Definition and deal with JSON <-> XML transformation
 * @param {*} data  Drishti Data Definition JSON
 * @constructor
 */
function JData(data){
	//data = data || {"form": {"bind_type":"?????", "default_bind_path":"????", "form_type":"????", "meta_fields":[], "fields":[], "sub_forms":[]}};

	/**
	 * Transforms JSON to an XML string
	 * NOTE: alternatively, we could could overwrite Form.init() to use JSON data instead of XML for instantiation
	 * @param  {(*|string)} jData	JSON object or JSON string
	 * @return {?string}			XML string
	 */
	this.toXML = function(){
		var i, n, path, value, $formInstanceFirst, defaultPath,
			$instance = $($.parseXML('<root />'));

		if (typeof data !== 'object'){
			var error = "error: no JSON object provided during instantiation";
			console.error(error);
		}

		defaultPath = data.form.default_bind_path;

		for (i = 0; i<data.form.fields.length; i++){
			n = data.form.fields[i];
			//only have to concern ourselves with field that have a value (incl empty string)
			if (typeof n.value !== 'undefined'){
				path = (typeof n.bind == 'undefined') ? defaultPath + n.name : (n.bind.indexOf('/') === 0) ? n.bind : defaultPath + n.bind;
				value = n.value;
			//if (typeof path !== 'undefined' && path.length > 0 && typeof value !== undefined){
				addXMLNodeAndValue($instance, path, value);
				console.log('added path: '+path+' with value: "'+value+'"');
			}
			//else{
			//	console.error('Node information in JSON is incomplete. Expected value and non-empty bindPath attributes', n);
			//	return null;
			//}
		}
		//TODO: add support for repeats?
		$formInstanceFirst = $instance.find('instance>*:first');
		//$formInstanceFirst.attr('id', jData.formId);
		return (new XMLSerializer()).serializeToString($formInstanceFirst[0]);
	};

	/**
	 * Gets current state of form instance in JSON format. It may be better to pass form as a parameter and rename as update().
	 */
	this.get = function(){
		var i, $repeatLeaves,
			subFormsStarted = [],
			//$data = $($.parseXML(xData)),
			//formId = $data.find('*:first').attr('id'),
			$mainLeaves = form.getDataO().node('*', null, {noTemplate: true, onlyLeaf: true}).get(),
			totalLeaves = $mainLeaves.length,
			/* 
			 * issue: this relies on a template node to be present, which is not required for repeats in OpenRosa
			 * but thankfully is guaranteed in formhub-hosted forms. It would be good to move this to the Form class as an
			 * onlyRepeat: true filter for Nodeset()
			 * Nested repeats are not supported.
			 */
			$repeats = form.getDataO().$.find('instance:first [template]').siblings().filter(function(){
				var nodeName = $(this).prop('nodeName');
				return $(this).siblings(nodeName+'[template]').length > 0;
			});

		$repeats.each(function(){
			var bindType, subForms, subForm,
				instance = {},
				$repeat = $(this);
			//bind_type in JSON subform = repeat nodeName???
			bindType = $repeat.prop('nodeName');
			subForms = $.grep(data.form.sub_forms, function(subfrm){return (subfrm.bind_type === bindType); });
			if (subForms.length === 0){
				recordError('Repeat definition not found (no subform with bind type "'+bindType+'" in JSON format');
			}
			else if (subForms.length > 1){
				recordError('Multiple repeat definititions found (multiple subforms with bind type "'+bindType+'" in JSON format');
			}
			else{
				subForm = subForms[0];
				if ($.inArray(bindType, subFormsStarted) === -1){
					subFormsStarted.push(bindType);
					subForm.instances = [];
				}
				$repeatLeaves = $repeat.find('*').filter(function(){
					return $(this).children().length === 0;
				});
				$mainLeaves = $mainLeaves.takeOut($repeatLeaves);
				$repeatLeaves.each(function(){
					var props = getNodeProps($(this)),
						field = getField(props.nodeName, subForm.fields);
					if (field){
						instance[field.name] = props.value;
					}
				});
				subForm.instances.push(instance);
			}
		});

		$mainLeaves.each(function(){
			var props = getNodeProps($(this)),
				field = getField(props.nodeName, data.form.fields);
			if (field){
				field.value = props.value;
			}
		});
		return data;
	};

	//given an XML nodeName, it obtains a field from a field array
	function getField(nodeName, fieldArr){
		var exceptions = ['deprecatedID'],
			fields = $.grep(fieldArr, function(field){
			return (typeof field.bind  == 'undefined' && field.name === nodeName) ||
				(typeof field.bind !== 'undefined' && (field.bind === nodeName || field.bind.substring(field.bind.lastIndexOf('/')+1) === nodeName)) ;
		});

		if (fields.length > 1){
			recordError('Multiple fields found (multiple nodes with bind name: '+nodeName+' found in JSON format.');
			return null;
		}
		else if (fields.length === 0 && $.inArray(nodeName, exceptions) !== -1){
			return null;
		}
		else if (fields.length === 0){
			recordError('Field not found (node with name: '+nodeName+' was missing from JSON format).');
			return null;
		}
		else {
			return fields[0];
		}
	}

	function getNodeProps($node){
		return {
			nodeName: $node.prop('nodeName'),
			value: $node.text(),
			path: $node.getXPath('model')
		};
	}

	/**
	 * [addXMLNode description]
	 * @param {jQuery} $doc		jQuery doc with root element to add nodes to
	 * @param {string} path		path of node to be added when not present starting with / 
	 * @param {string=} value	value of node
	 * @return {jQuery}			jQuery doc with added node and value
	 */
	function addXMLNodeAndValue ($doc, path, value){
		var j, $node,
			$current = $doc.find('root'),
			nodeNames = path.substring(1).split('/');
		//TODO: protect capitalization
		//TODO: add support for [pos] selector (for repeats)
		for (j = 0; j<nodeNames.length ; j++){
			//console.log('nodeName to find:'+nodeNames[j]);
			if (nodeNames[j].indexOf('[') !== -1) return console.error('position selector not yet supported');
			if ($current.children(nodeNames[j]).length === 0){
				//console.log('nodeName does not exist, going to create it as child of ', $current[0]);
				$node = $($.parseXML('<'+nodeNames[j]+'/>').documentElement);
				$current.append($node);
			}
			//else{
				//console.log('nodeName found, going to next node');
			//}
			$current = $current.children(nodeNames[j]);
			if (j === (nodeNames.length - 1)){
				$current.text(value);
			}
		}
		return $doc;
	}

	function recordError(errorMsg){
		if (typeof data.errors == 'undefined') data.errors = [];
		data.errors.push(errorMsg);
		console.error(errorMsg);
	}
}

(function($){
	$.fn.takeOut = function($nodes){
		return this.filter(function(){
			for (var i = 0 ; i<$nodes.length ; i++){
				if ($(this).is($nodes.eq(i))){
					console.log('took out node: ', $(this));
					return false;
				}
			}
			return true;
		});
	};
})(jQuery);