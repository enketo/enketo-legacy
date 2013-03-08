/*global mockForms2, mockInstances*/

/**
 * Storage Class
 * @constructor
 */
function StorageLocal(){
	this.init = function(){};

	/**
	 * Gets both the HTML Form and the default XML Instance
	 * @param  {string} formId					the unique form id used to query the Drishti DB to get the transformation results
	 * @return {?{form:string, model:string}}	returns object with HTML form as form property and default XML instance as model property
	 */
	this.getForm = function(formId){
		// temporarily mocked
		if (typeof mockForms2 !== 'undefined' && mockForms2[formId] !== 'undefined'){
			var formParts = mockForms2[formId];
			return {form: formParts.html_form, model: formParts.xml_model};
		}
		return null;
	};

	/**
	 * Gets instance as JSON from Dristhi DB - Should this be asynchronous?
	 * @param  {string} instanceId [description]
	 * @return {?*}       [description]
	 */
	this.getInstanceJ = function(instanceId){
		// temporarily mocked
		if (instanceId && typeof mockInstances[instanceId] !== 'undefined'){
			return mockInstances[instanceId];
		}
		return null;
	};

	/**
	 * Passes instance as JSON to store in Dristhi DB - Should this be asynchronous?
	 * @param  {*} dataJ	JSON object with data
	 * @return {boolean}     
	 */
	this.saveInstanceJ = function(dataJ){
		return true;
	};
}

/**
 * Class dealing with JSON <-> XML transformation
 * 
 * @constructor
 */
function Transformer(){
	/**
	 * Transforms JSON to an XML string
	 * NOTE: alternatively, we could could overwrite Form.init() to use JSON data instead of XML for instantiation
	 * @param  {(*|string)} jData	JSON object or JSON string
	 * @return {?string}			XML string
	 */
	this.JSONToXML = function(jData){
		var i, n, path, value, $formInstanceFirst,
			$instance = $($.parseXML('<root />'));
		for (i = 0; i<jData.values.length; i++){
			n = jData.values[i];
			path = n.bindPath;
			value = n.fieldValue;
			if (typeof path !== 'undefined' && path.length > 0 && typeof value !== undefined){
				addXMLNodeAndValue($instance, path, value);
			}
			else{
				console.error('Node information in JSON is incomplete. Expected fieldValue and non-empty bindPath attributes', n);
				return null;
			}
		}
		//TODO: add support for [repeats]?
		$formInstanceFirst = $instance.find('instance>*:first');
		$formInstanceFirst.attr('id', jData.formId);
		return (new XMLSerializer()).serializeToString($formInstanceFirst[0]);
	};

	/**
	 * Transforms XML submission instance into JSON
	 * NOTE: alternatively, we could turn this into a Form.getJSON() function
	 * @param {string} xData string of xml data
	 */
	this.XMLToJSON = function(xData){
		var $leaf,
			jData = {},
			values = [],
			$data = $($.parseXML(xData)),
			formId = $data.find('*:first').attr('id'),
			$leaves = $data.find('*').filter(
				function(){
					return $(this).children().length === 0;
				}
			);
		/** 
			WATCH OUT for repeats:
			If child is a repeat but it is not repeated (yet) the bindPath is: /myform/child
			If child is a repeat and it is repeated the first child gets: /myform/child[1]
			These are the same node, but the path changes over time if the record is edited!
			If this is a problem we could just never add index 1
		 **/
		$leaves.each(function(){
			$leaf = $(this);
			values.push(
				{
					"fieldName" : $leaf.prop('nodeName'),
					"fieldValue" : $leaf.text(),
					"bindPath" : '/instance' + $leaf.getXPath('model')
				}
			);
		});
		jData.formId = formId;
		jData.instanceId = $data.find('meta>instanceID').text();
		jData.values = values;
		return jData;
	};

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