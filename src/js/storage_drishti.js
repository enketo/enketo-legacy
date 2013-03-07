/**
 * Storage Class
 * @constructor
 */
function StorageLocal(){
	this.init = function(){};

	/**
	 * Gets both the HTML Form and the default XML Instance
	 * @param  {string} formID					the unique form id used to query the Drishti DB to get the transformation results
	 * @return {{form:string, model:string}}	returns object with HTML form as form property and default XML instance as model property
	 */
	this.getForm = function(formId){
		//temporarily mocked, but simply detaching the <form> from the DOM and returning this as a string
		var $form = $('form.jr'),
			form = $form[0].outerHTML,
			model = jrDataStr;
		$form.replaceWith('<form></form>');
		return {form: form, model: model};
	};

	/**
	 * Gets instance as JSON from Dristhi DB - Should this be asynchronous?
	 * @param  {string} instanceId [description]
	 * @return {?*}       [description]
	 */
	this.getInstanceJ = function(instanceId){
		if (instanceId){
			//get JSON from drishti app
		}
		else return null;
	};

	/**
	 * Passes instance as JSON to store in Dristhi DB - Should this be asynchronous?
	 * @param  {*} dataJ	JSON object with data
	 * @return {boolean}     
	 */
	this.storeInstanceJ = function(dataJ){

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
	 * @param  {(*|string)} jData	JSON object or JSON string
	 * @return {string}			XML string
	 */
	this.jsonToXML = function(jData){
		var i, n, path, value,
			$instance = $('<root />');
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
		return (new XMLSerializer()).serializeToString($instance.find('instance>*:eq(0)')[0]);
	};

	/**
	 * Transforms XML submission instance into JSON
	 * @param {string} xData string of xml data
	 */
	this.XMLToJSON = function(xData){
		//use getName function in Form class
	};

	/**
	 * [addXMLNode description]
	 * @param {jQuery} $doc		jQuery doc with root element to add nodes to
	 * @param {string} path		path of node to be added when not present starting with / 
	 * @param {string=} value	value of node
	 * @return {jQuery}			jQuery doc with added node and value
	 */
	function addXMLNodeAndValue ($doc, path, value){
		var j, $current = $doc,
			nodeNames = path.substring(1).split('/');

		for (j = 0; j<nodeNames.length ; j++){
			//console.log('nodeName to find:'+nodeNames[j]);
			if (nodeNames[j].indexOf('[') !== -1) return console.error('position selector not yet supported');
			if ($current.children(nodeNames[j]).length === 0){
				//console.log('nodeName does not exist, going to create it as child of ', $current[0]);
				$current.append($('<'+nodeNames[j]+'/>'));
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