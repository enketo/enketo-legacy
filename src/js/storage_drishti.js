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
	data = data || {"form": {"bind_type":"?????", "default_bind_path":"????", "form_type":"????", "meta_fields":[], "fields":[], "sub_forms":[]}};

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
		//TODO: add support for [repeats]?
		$formInstanceFirst = $instance.find('instance>*:first');
		//$formInstanceFirst.attr('id', jData.formId);
		return (new XMLSerializer()).serializeToString($formInstanceFirst[0]);
	};

	/**
	 * Gets current state of form instance in JSON format. It may be better to pass form as a parameter and rename as update().
	 */
	this.get = function(){
		var i, $repeatLeaves,
			subForms,
			subFormTemplates = [],
			//$data = $($.parseXML(xData)),
			//formId = $data.find('*:first').attr('id'),
			$mainLeaves = form.getDataO().node('*', null, {noTemplate: true, onlyLeaf: true}).get(),
			totalLeaves = $mainLeaves.length,
			/* 
			 * issue: this relies on a template node to be present, which is not required for repeats in OpenRosa
			 * but thankfully is guaranteed in formhub-hosted forms. It would be good to move this to the Form class as an
			 * onlyRepeat: true filter for Nodeset()
			 */
			$repeats = form.getDataO().$.find('instance:first [template]').siblings().filter(function(){
				var nodeName = $(this).prop('nodeName');
				return $(this).siblings(nodeName+'[template]').length > 0;
			});

		$repeats.each(function(){
			var bindType, subForm, newSubForm, subFormTemplate,
				$repeat = $(this);
			//bind_type = repeat node name???
			bindType = $repeat.prop('nodeName');
			if ($.grep(subFormTemplates, function(template){return (template.bind_type === bindType); }).length === 0){
				subForm = $.grep(data.form.sub_forms, function(sub){return (sub.bind_type === bindType); })[0];
				//now remove this subform from data
				$.each(data.form.sub_forms, function(i){
					if(data.form.sub_forms[i].bind_type === bindType) data.form.sub_forms.splice(i,1);
				});
				//or is this always defined??
				if (typeof subForm === 'undefined'){
					subForm = {"bind_type": bindType, "default_bind_path":"?????", "form_type": "?????", "meta_fields":[], "fields":[]};
				}
				subForm.fields = [];
				subFormTemplates.push(subForm);
			}

			$repeatLeaves = $repeat.find('*').filter(function(){
				return $(this).children().length === 0;
			});
			$mainLeaves = $mainLeaves.takeOut($repeatLeaves);

			subFormTemplate = $.grep(subFormTemplates,function(template){return (template.bind_type === bindType);})[0];
			newSubForm = jQuery.extend({}, subFormTemplate);
			data.form.sub_forms.push(newSubForm);
			updateFields(newSubForm.fields, $repeatLeaves);
		});

		updateFields(data.form.fields, $mainLeaves);
		//jData.formId = formId;
		//jData.instanceId = $data.find('meta>instanceID').text();
		//jData.fields = fields;
		return data;
	};

	function updateFields(fieldArr, $nodes){
		var $leaf, fields, field, name, source, value, bind, error;
		$nodes.each(function(){
			$leaf = $(this);
			name = $leaf.prop('nodeName');
			value = $leaf.text();
			bind = $leaf.getXPath('model');
			fields = $.grep(fieldArr, function(field){
				return (typeof field.bind  == 'undefined' && field.name === name) ||
					(typeof field.bind !== 'undefined' && (field.bind === name || field.bind.substring(field.bind.lastIndexOf('/')+1) === name)) ;
			});
			if (fields.length > 1){
				error = 'Multiple fields found (multiple nodes with bind name: '+name+' found in JSON format.';
				if (typeof data.errors == 'undefined') data.errors = [];
				data.errors.push(error);
				console.error(error);
			}
			else if (fields.length === 0){
				error = 'Field not found (node with name: '+name+' was missing from JSON format).';
				if (typeof data.errors == 'undefined') data.errors = [];
				data.errors.push(error);
				console.error(error);
				//field = {"name": name};
				//fieldArr.push(field);
			}
			else {
				field = fields[0];
				field.value = value;
				//field.source = field.source || '????.'+name;
				//field.bind = bind; 
			}
		});
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