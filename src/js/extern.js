var modelStr, jrDataStr, jrDataStrToEdit,
	/*@type {{string:{html_form:string, xml_model:string}}}*/mockForms1,
	/*@type {{string:{html_form:string, xml_model:string}}}*/mockForms2,
	mockInstances;

var androidContext = {
	formName: helper.getQueryParam('formName'),
	getForm : function(){},
	getModel : function(){},
	goBack : function(){}
};

var enketo = {
	FormDataRepository : function(){},
	FormDataController : function(entityRelO, formDefO, formModelMapperO){
		this.get = function(params){
			return mockInstances[params.instanceId] || null;
		};
		this.save = function(instanceId, data){
			console.log('saving...');
		};
	},
	EntityRelationshipLoader : function(){},
	FormDefinitionLoader : function(){},
	FormModelMapper : function(dataRepo, sqlBuilder, idFactory){},
	SQLQueryBuilder : function(dataRepo){},
	IdFactory : function(bridge){},
	IdFactoryBridge : function(){},
	FormSubmissionRouter : function(){}
};

/** @type {{returnURL: string, serverURL: string, formId: string, instanceId: string, entityId: string, formURL: string, mapsStaticAPIKey:string, mapsDynamicAPIKey:string,
	 defaultServerURLHelper:string, supportEmail:string, modernBrowsersURL:string, showBranch:boolean}}
 */
var settings;

/**
 * @type number
 */
applicationCache.OBSOLETE;

window.webkitResolveLocalFileSystemURL = function(){};


function vkbeautify(){}

/**
 * @param {?string} str
 */
vkbeautify.xml = function(str){};
/**
 * @param {?string} str
 */
vkbeautify.json = function(str){};


function history(){}
/**
 * @param  {Object.<string, (boolean|string)>} obj   [description]
 * @param  {string} title [description]
 * @param  {string} path  [description]
 */
history.pushState = function(obj, title, path){};


var XPathJS = (function(){})();

XPathJS.bindDomLevel3XPath = function(){};

/**
 * @param  {*} blob     [description]
 * @param  {string} filename [description]
 */
function saveAs(blob, filename){}


/*jshint expr:true */
/**
 * @type Object
 */
var Modernizr;

Modernizr.inputtypes = function(){};
/**
 * @type boolean
 **/
Modernizr.inputtypes.date;

/**
 * @type boolean
 **/
Modernizr.inputtypes.time;
/**
 * @type boolean
 **/
Modernizr.inputtypes.datetime;
/**
 * @type boolean
 **/
Modernizr.borderradius;
/**
 * @type boolean
 **/
Modernizr.boxshadow;
/**
 * @type boolean
 **/
Modernizr.csstransitions;
/**
 * @type boolean
 **/
Modernizr.opacity;





/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for the Webkit console specification.
 * @see http://trac.webkit.org/browser/trunk/WebCore/page/Console.idl
 * @see http://trac.webkit.org/browser/trunk/WebCore/page/Console.cpp
 * @externs
 */

var console = {};

/**
 * @param {...*} var_args
 */
console.debug = function(var_args) {};

/** 
 * @param {...*} var_args
 */
console.error = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.info = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.log = function(var_args) {};

/**
 * @param {...*} var_args
 */
console.warn = function(var_args) {};

/**
 * @param {*} value
 */
console.dir = function(value) {};

/**
 * @param {...*} var_args
 */
console.dirxml = function(var_args) {};

/**
 * @param {*=} value
 */
console.trace = function(value) {};

/**
 * @param {*} condition
 * @param {...*} var_args
 */
console.assert = function(condition, var_args) {};

/**
 * @param {*} value
 */
console.count = function(value) {};

/**
 * @param {string=} opt_title
 */
console.profile = function(opt_title) {};

console.profileEnd = function() {};

/**
 * @param {string} name
 */
console.time = function(name) {};

/**
 * @param {string} name
 */
console.timeEnd = function(name) {};

console.group = function() {};
console.groupEnd = function() {};


/*
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for the JSON specification.
 * @see http://www.json.org/json2.js.
 * @externs
 */

var JSON = {};

/**
 * @param {string} jsonStr The string to parse.
 * @param {(function(string, *) : *)=} opt_reviver
 * @return {*} The JSON object.
 */
JSON.parse = function(jsonStr, opt_reviver) {};

/**
 * @param {*} jsonObj Input object.
 * @param {(Array.<string>|(function(string, *) : *)|null)=} opt_replacer
 * @param {(number|string)=} opt_space
 * @return {string} json string which represents jsonObj.
 */
JSON.stringify = function(jsonObj, opt_replacer, opt_space) {};


/*
 * Copyright 2011 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Externs for jQuery 1.9.1
 *
 * Note that some functions use different return types depending on the number
 * of parameters passed in. In these cases, you may need to annotate the type
 * of the result in your code, so the JSCompiler understands which type you're
 * expecting. For example:
 *    <code>var elt = /** @type {Element} * / (foo.get(0));</code>
 *
 * @see http://api.jquery.com/
 * @externs
 */

/**
 * @typedef {(Window|Document|Element|Array.<Element>|string|jQuery|
 *     NodeList)}
 */
var jQuerySelector;

/** @typedef {function(...)|Array.<function(...)>} */
var jQueryCallback;

/**
 * @constructor
 * @param {(jQuerySelector|Element|Object|Array.<Element>|jQuery|string|
 *     function())=} arg1
 * @param {(Element|jQuery|Document|
 *     Object.<string, (string|function(!jQuery.event=))>)=} arg2
 * @return {!jQuery}
 */
function jQuery(arg1, arg2) {}

/**
 * @constructor
 * @extends {jQuery}
 * @param {(jQuerySelector|Element|Object|Array.<Element>|jQuery|string|
 *     function())=} arg1
 * @param {(Element|jQuery|Document|
 *     Object.<string, (string|function(!jQuery.event=))>)=} arg2
 * @return {!jQuery}
 */
function $(arg1, arg2) {}

/**
 * @param {(jQuerySelector|Array.<Element>|string|jQuery)} arg1
 * @param {Element=} context
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.add = function(arg1, context) {};

/**
 * @param {(string|function(number,String))} arg1
 * @return {!jQuery}
 */
jQuery.prototype.addClass = function(arg1) {};

/**
 * @param {(string|Element|jQuery|function(number))} arg1
 * @param {(string|Element|Array.<Element>|jQuery)=} content
 * @return {!jQuery}
 */
jQuery.prototype.after = function(arg1, content) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {Object.<string,*>=} settings
 * @return {jQuery.jqXHR}
 */
jQuery.ajax = function(arg1, settings) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {Object.<string,*>=} settings
 * @return {jQuery.jqXHR}
 */
$.ajax = function(arg1, settings) {};

/**
 * @param {function(!jQuery.event,XMLHttpRequest,Object.<string, *>)} handler
 * @return {!jQuery}
 */
jQuery.prototype.ajaxComplete = function(handler) {};

/**
 * @param {function(!jQuery.event,jQuery.jqXHR,Object.<string, *>,*)} handler
 * @return {!jQuery}
 */
jQuery.prototype.ajaxError = function(handler) {};

/**
 * @param {(string|
 *     function(Object.<string,*>,Object.<string, *>,jQuery.jqXHR))} dataTypes
 * @param {function(Object.<string,*>,Object.<string, *>,jQuery.jqXHR)=} handler
 */
jQuery.ajaxPrefilter = function(dataTypes, handler) {};

/**
 * @param {(string|
 *     function(Object.<string,*>,Object.<string, *>,jQuery.jqXHR))} dataTypes
 * @param {function(Object.<string,*>,Object.<string, *>,jQuery.jqXHR)=} handler
 */
$.ajaxPrefilter = function(dataTypes, handler) {};

/**
 * @param {function(!jQuery.event,jQuery.jqXHR,Object.<string, *>)} handler
 * @return {!jQuery}
 */
jQuery.prototype.ajaxSend = function(handler) {};

/** @const */
jQuery.ajaxSettings = {};

/** @const */
$.ajaxSettings = {};

/** @type {Object.<string, string>} */
jQuery.ajaxSettings.accepts = {};

/** @type {Object.<string, string>} */
$.ajaxSettings.accepts = {};

/** @type {boolean} */
jQuery.ajaxSettings.async;

/** @type {boolean} */
$.ajaxSettings.async;

/** @type {Object.<string, RegExp>} */
jQuery.ajaxSettings.contents = {};

/** @type {Object.<string, RegExp>} */
$.ajaxSettings.contents = {};

/** @type {string} */
jQuery.ajaxSettings.contentType;

/** @type {string} */
$.ajaxSettings.contentType;

/** @type {Object.<string, *>} */
jQuery.ajaxSettings.converters = {};

/** @type {Object.<string, *>} */
$.ajaxSettings.converters = {};

/** @type {Object.<string, boolean>} */
jQuery.ajaxSettings.flatOptions = {};

/** @type {Object.<string, boolean>} */
$.ajaxSettings.flatOptions = {};

/** @type {boolean} */
jQuery.ajaxSettings.global;

/** @type {boolean} */
$.ajaxSettings.global;

/** @type {boolean} */
jQuery.ajaxSettings.isLocal;

/** @type {boolean} */
$.ajaxSettings.isLocal;

/** @type {boolean} */
jQuery.ajaxSettings.processData;

/** @type {boolean} */
$.ajaxSettings.processData;

/** @type {Object.<string, string>} */
jQuery.ajaxSettings.responseFields = {};

/** @type {Object.<string, string>} */
$.ajaxSettings.responseFields = {};

/** @type {boolean} */
jQuery.ajaxSettings.traditional;

/** @type {boolean} */
$.ajaxSettings.traditional;

/** @type {string} */
jQuery.ajaxSettings.type;

/** @type {string} */
$.ajaxSettings.type;

/** @type {string} */
jQuery.ajaxSettings.url;

/** @type {string} */
$.ajaxSettings.url;

/** @return {XMLHttpRequest|ActiveXObject} */
jQuery.ajaxSettings.xhr = function() {};

/** @return {XMLHttpRequest|ActiveXObject} */
$.ajaxSettings.xhr = function() {};

/** @param {Object.<string,*>} options */
jQuery.ajaxSetup = function(options) {};

/** @param {Object.<string,*>} options */
$.ajaxSetup = function(options) {};

/**
 * @param {function()} handler
 * @return {!jQuery}
 */
jQuery.prototype.ajaxStart = function(handler) {};

/**
 * @param {function()} handler
 * @return {!jQuery}
 */
jQuery.prototype.ajaxStop = function(handler) {};

/**
 * @param {function(!jQuery.event,XMLHttpRequest,Object.<string, *>)} handler
 * @return {!jQuery}
 */
jQuery.prototype.ajaxSuccess = function(handler) {};

/**
 * @return {!jQuery}
 */
jQuery.prototype.addBack = function() {};

/**
 * @param {Object.<string,*>} properties
 * @param {(string|number|function()|Object.<string,*>)=} arg2
 * @param {(string|function())=} easing
 * @param {function()=} complete
 * @return {!jQuery}
 */
jQuery.prototype.animate = function(properties, arg2, easing, complete) {};

/**
 * @param {(string|Element|jQuery|function(number,string))} arg1
 * @param {(string|Element|Array.<Element>|jQuery)=} content
 * @return {!jQuery}
 */
jQuery.prototype.append = function(arg1, content) {};

/**
 * @param {(jQuerySelector|Element|jQuery)} target
 * @return {!jQuery}
 */
jQuery.prototype.appendTo = function(target) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|number|function(number,string))=} arg2
 * @return {(string|!jQuery)}
 */
jQuery.prototype.attr = function(arg1, arg2) {};

/**
 * @param {(string|Element|jQuery|function())} arg1
 * @param {(string|Element|Array.<Element>|jQuery)=} content
 * @return {!jQuery}
 */
jQuery.prototype.before = function(arg1, content) {};

/**
 * @param {(string|Object.<string, function(!jQuery.event=)>)} arg1
 * @param {(Object.<string, *>|function(!jQuery.event=)|boolean)=} eventData
 * @param {(function(!jQuery.event=)|boolean)=} arg3
 * @return {!jQuery}
 */
jQuery.prototype.bind = function(arg1, eventData, arg3) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.blur = function(arg1, handler) {};

/** @type {boolean} */
jQuery.boxModel;

/** @type {boolean} */
$.boxModel;

/**
 * @constructor
 * @private
 */
jQuery.callbacks = function () {};

/**
 * @param {string=} flags
 * @return {jQuery.callbacks}
 */
jQuery.Callbacks = function (flags) {};

/** @param {function()} callbacks */
jQuery.callbacks.prototype.add = function(callbacks) {};

/** @return {undefined} */
jQuery.callbacks.prototype.disable = function() {};

/** @return {undefined} */
jQuery.callbacks.prototype.empty = function() {};

/** @param {...*} var_args */
jQuery.callbacks.prototype.fire = function(var_args) {};

/** @return {boolean} */
jQuery.callbacks.prototype.fired = function() {};

/** @param {...*} var_args */
jQuery.callbacks.prototype.fireWith = function(var_args) {};

/**
 * @param {function()} callback
 * @return {boolean}
 * @nosideeffects
 */
jQuery.callbacks.prototype.has = function(callback) {};

/** @return {undefined} */
jQuery.callbacks.prototype.lock = function() {};

/** @return {boolean} */
jQuery.callbacks.prototype.locked = function() {};

/** @param {function()} callbacks */
jQuery.callbacks.prototype.remove = function(callbacks) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.change = function(arg1, handler) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.children = function(selector) {};

/**
 * @param {string=} queueName
 * @return {!jQuery}
 */
jQuery.prototype.clearQueue = function(queueName) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.click = function(arg1, handler) {};

/**
 * @param {boolean=} withDataAndEvents
 * @param {boolean=} deepWithDataAndEvents
 * @return {!jQuery}
 * @suppress {checkTypes} see issue 583
 */
jQuery.prototype.clone = function(withDataAndEvents, deepWithDataAndEvents) {};

/**
 * @param {(jQuerySelector|jQuery|Element|string|Array.<string>)} arg1
 * @param {Element=} context
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.closest = function(arg1, context) {};

/**
 * @param {Element} container
 * @param {Element} contained
 * @return {boolean}
 */
jQuery.contains = function(container, contained) {};

/**
 * @param {Element} container
 * @param {Element} contained
 * @return {boolean}
 */
$.contains = function(container, contained) {};

/**
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.contents = function() {};

/** @type {Element} */
jQuery.prototype.context;

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|number|function(number,*))=} arg2
 * @return {(string|!jQuery)}
 */
jQuery.prototype.css = function(arg1, arg2) {};

/** @type {Object.<string, *>} */
jQuery.cssHooks;

/** @type {Object.<string, *>} */
$.cssHooks;

/**
 * @param {Element} elem
 * @param {string=} key
 * @param {*=} value
 * @return {*}
 */
jQuery.data = function(elem, key, value) {};

/**
 * @param {(string|Object.<string, *>)=} arg1
 * @param {*=} value
 * @return {*}
 */
jQuery.prototype.data = function(arg1, value) {};

/**
 * @param {Element} elem
 * @param {string=} key
 * @param {*=} value
 * @return {*}
 */
$.data = function(elem, key, value) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.dblclick = function(arg1, handler) {};

/**
 * @constructor
 * @implements {jQuery.Promise}
 * @param {function()=} opt_fn
 * @see http://api.jquery.com/category/deferred-object/
 */
jQuery.deferred = function(opt_fn) {};

/**
 * @constructor
 * @extends {jQuery.deferred}
 * @param {function()=} opt_fn
 * @return {jQuery.Deferred}
 */
jQuery.Deferred = function(opt_fn) {};

/**
 * @constructor
 * @extends {jQuery.deferred}
 * @param {function()=} opt_fn
 * @see http://api.jquery.com/category/deferred-object/
 */
$.deferred = function(opt_fn) {};

/**
 * @constructor
 * @extends {jQuery.deferred}
 * @param {function()=} opt_fn
 * @return {jQuery.deferred}
 */
$.Deferred = function(opt_fn) {};

/**
 * @override
 * @param {jQueryCallback} alwaysCallbacks
 * @param {jQueryCallback=} alwaysCallbacks2
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.always
    = function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @override
 * @param {jQueryCallback} doneCallbacks
 * @param {jQueryCallback=} doneCallbacks2
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.done = function(doneCallbacks, doneCallbacks2) {};

/**
 * @override
 * @param {jQueryCallback} failCallbacks
 * @param {jQueryCallback=} failCallbacks2
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.fail = function(failCallbacks, failCallbacks2) {};

/**
 * @param {...*} var_args
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.notify = function(var_args) {};

/**
 * @param {Object} context
 * @param {...*} var_args
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.notifyWith = function(context, var_args) {};

/**
 * @override
 * @param {function()=} doneFilter
 * @param {function()=} failFilter
 * @param {function()=} progressFilter
 * @return {jQuery.Promise}
 */
jQuery.deferred.prototype.pipe
    = function(doneFilter, failFilter, progressFilter) {};

/**
 * @param {function()} progressCallbacks
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.progress = function(progressCallbacks) {};

/**
 * @param {Object=} target
 * @return {jQuery.Promise}
 */
jQuery.deferred.prototype.promise = function(target) {};

/**
 * @param {...*} var_args
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.reject = function(var_args) {};

/**
 * @param {Object} context
 * @param {Array.<*>=} args
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.rejectWith = function(context, args) {};

/**
 * @param {...*} var_args
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.resolve = function(var_args) {};

/**
 * @param {Object} context
 * @param {Array.<*>=} args
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.resolveWith = function(context, args) {};

/** @return {string} */
jQuery.deferred.prototype.state = function() {};

/**
 * @override
 * @param {jQueryCallback} doneCallbacks
 * @param {jQueryCallback=} failCallbacks
 * @param {jQueryCallback=} progressCallbacks
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.then
    = function(doneCallbacks, failCallbacks, progressCallbacks) {};

/**
 * @param {number} duration
 * @param {string=} queueName
 * @return {!jQuery}
 */
jQuery.prototype.delay = function(duration, queueName) {};

/**
 * @param {string} selector
 * @param {(string|Object.<string,*>)} arg2
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg3
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.delegate = function(selector, arg2, arg3, handler) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 */
jQuery.dequeue = function(elem, queueName) {};

/**
 * @param {string=} queueName
 * @return {!jQuery}
 */
jQuery.prototype.dequeue = function(queueName) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 */
$.dequeue = function(elem, queueName) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 */
jQuery.prototype.detach = function(selector) {};

/**
 * @param {Object} collection
 * @param {function(number,?)} callback
 * @return {Object}
 */
jQuery.each = function(collection, callback) {};

/**
 * @param {function(number,Element)} fnc
 * @return {!jQuery}
 */
jQuery.prototype.each = function(fnc) {};

/**
 * @param {Object} collection
 * @param {function(number,?)} callback
 * @return {Object}
 */
$.each = function(collection, callback) {};

/** @return {!jQuery} */
jQuery.prototype.empty = function() {};

/**
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.end = function() {};

/**
 * @param {number} arg1
 * @return {!jQuery}
 */
jQuery.prototype.eq = function(arg1) {};

/** @param {string} message */
jQuery.error = function(message) {};

/**
 * @deprecated
 * @param {(function(!jQuery.event=)|Object.<string, *>)} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.error = function(arg1, handler) {};

/** @param {string} message */
$.error = function(message) {};

/**
 * @constructor
 * @param {string} eventType
 */
jQuery.event = function(eventType) {};

/**
 * @constructor
 * @extends {jQuery.event}
 * @param {string} eventType
 * @param {Object=} properties
 * @return {jQuery.Event}
 */
jQuery.Event = function(eventType, properties) {};

/**
 * @constructor
 * @extends {jQuery.event}
 * @param {string} eventType
 */
$.event = function(eventType) {};

/**
 * @constructor
 * @extends {jQuery.event}
 * @param {string} eventType
 * @param {Object=} properties
 * @return {$.Event}
 */
$.Event = function(eventType, properties) {};

/** @type {Element} */
jQuery.event.prototype.currentTarget;

/** @type {Object.<string, *>} */
jQuery.event.prototype.data;

/** @type {Element} */
jQuery.event.prototype.delegateTarget;

/**
 * @return {boolean}
 * @nosideeffects
 */
jQuery.event.prototype.isDefaultPrevented = function() {};

/**
 * @return {boolean}
 * @nosideeffects
 */
jQuery.event.prototype.isImmediatePropagationStopped = function() {};

/**
 * @return {boolean}
 * @nosideeffects
 */
jQuery.event.prototype.isPropagationStopped = function() {};

/** @type {string} */
jQuery.event.prototype.namespace;

/** @type {Event} */
jQuery.event.prototype.originalEvent;

/** @type {number} */
jQuery.event.prototype.pageX;

/** @type {number} */
jQuery.event.prototype.pageY;

/** @return {undefined} */
jQuery.event.prototype.preventDefault = function() {};

/** @type {Object.<string, *>} */
jQuery.event.prototype.props;

/** @type {Element} */
jQuery.event.prototype.relatedTarget;

/** @type {*} */
jQuery.event.prototype.result;

/** @return {undefined} */
jQuery.event.prototype.stopImmediatePropagation = function() {};

/** @return {undefined} */
jQuery.event.prototype.stopPropagation = function() {};

/** @type {Element} */
jQuery.event.prototype.target;

/** @type {number} */
jQuery.event.prototype.timeStamp;

/** @type {string} */
jQuery.event.prototype.type;

/** @type {number} */
jQuery.event.prototype.which;

/**
 * @param {(Object|boolean)} arg1
 * @param {...*} var_args
 * @return {Object}
 */
jQuery.extend = function(arg1, var_args) {};

/**
 * @param {(Object|boolean)} arg1
 * @param {...*} var_args
 * @return {Object}
 */
jQuery.prototype.extend = function(arg1, var_args) {};

/**
 * @param {(Object|boolean)} arg1
 * @param {...*} var_args
 * @return {Object}
 */
$.extend = function(arg1, var_args) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.fadeIn = function(duration, arg2, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.fadeOut = function(duration, arg2, callback) {};

/**
 * @param {(string|number)} duration
 * @param {number} opacity
 * @param {(function()|string)=} arg3
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.fadeTo = function(duration, opacity, arg3, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(string|function())=} easing
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.fadeToggle = function(duration, easing, callback) {};

/**
 * @param {(jQuerySelector|function(number)|Element|jQuery)} arg1
 * @return {!jQuery}
 */
jQuery.prototype.filter = function(arg1) {};

/**
 * @param {(jQuerySelector|jQuery|Element)} arg1
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.find = function(arg1) {};

/** @return {!jQuery} */
jQuery.prototype.first = function() {};

/** @see http://docs.jquery.com/Plugins/Authoring */
jQuery.fn;

/** @see http://docs.jquery.com/Plugins/Authoring */
$.fn;

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.focus = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.focusin = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.focusout = function(arg1, handler) {};

/** @const */
jQuery.fx = {};

/** @const */
$.fx = {};

/** @type {number} */
jQuery.fx.interval;

/** @type {number} */
$.fx.interval;

/** @type {boolean} */
jQuery.fx.off;

/** @type {boolean} */
$.fx.off;

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,jQuery.jqXHR))=} data
 * @param {(function(string,string,jQuery.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {jQuery.jqXHR}
 */
jQuery.get = function(url, data, success, dataType) {};

/**
 * @param {number=} index
 * @return {(Element|Array.<Element>)}
 * @nosideeffects
 */
jQuery.prototype.get = function(index) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,jQuery.jqXHR))=} data
 * @param {(function(string,string,jQuery.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {jQuery.jqXHR}
 */
$.get = function(url, data, success, dataType) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|function(string,string,jQuery.jqXHR))=} data
 * @param {function(string,string,jQuery.jqXHR)=} success
 * @return {jQuery.jqXHR}
 */
jQuery.getJSON = function(url, data, success) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|function(string,string,jQuery.jqXHR))=} data
 * @param {function(string,string,jQuery.jqXHR)=} success
 * @return {jQuery.jqXHR}
 */
$.getJSON = function(url, data, success) {};

/**
 * @param {string} url
 * @param {function(Node,string,jQuery.jqXHR)=} success
 * @return {jQuery.jqXHR}
 */
jQuery.getScript = function(url, success) {};

/**
 * @param {string} url
 * @param {function(Node,string,jQuery.jqXHR)=} success
 * @return {jQuery.jqXHR}
 */
$.getScript = function(url, success) {};

/** @param {string} code */
jQuery.globalEval = function(code) {};

/** @param {string} code */
$.globalEval = function(code) {};

/**
 * @param {Array.<*>} arr
 * @param {function(*,number)} fnc
 * @param {boolean=} invert
 * @return {Array.<*>}
 */
jQuery.grep = function(arr, fnc, invert) {};

/**
 * @param {Array.<*>} arr
 * @param {function(*,number)} fnc
 * @param {boolean=} invert
 * @return {Array.<*>}
 */
$.grep = function(arr, fnc, invert) {};

/**
 * @param {(string|Element)} arg1
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.has = function(arg1) {};

/**
 * @param {string} className
 * @return {boolean}
 * @nosideeffects
 */
jQuery.prototype.hasClass = function(className) {};

/**
 * @param {Element} elem
 * @return {boolean}
 * @nosideeffects
 */
jQuery.hasData = function(elem) {};

/**
 * @param {Element} elem
 * @return {boolean}
 * @nosideeffects
 */
$.hasData = function(elem) {};

/**
 * @param {(string|number|function(number,number))=} arg1
 * @return {(number|!jQuery)}
 */
jQuery.prototype.height = function(arg1) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.hide = function(duration, arg2, callback) {};

/** @param {boolean} hold */
jQuery.holdReady = function(hold) {};

/** @param {boolean} hold */
$.holdReady = function(hold) {};

/**
 * @param {function(!jQuery.event=)} arg1
 * @param {function(!jQuery.event=)=} handlerOut
 * @return {!jQuery}
 */
jQuery.prototype.hover = function(arg1, handlerOut) {};

/**
 * @param {(string|function(number,string))=} arg1
 * @return {(string|!jQuery)}
 */
jQuery.prototype.html = function(arg1) {};

/**
 * @param {*} value
 * @param {Array.<*>} arr
 * @param {number=} fromIndex
 * @return {number}
 * @nosideeffects
 */
jQuery.inArray = function(value, arr, fromIndex) {};

/**
 * @param {*} value
 * @param {Array.<*>} arr
 * @param {number=} fromIndex
 * @return {number}
 * @nosideeffects
 */
$.inArray = function(value, arr, fromIndex) {};

/**
 * @param {(jQuerySelector|Element|jQuery)=} arg1
 * @return {number}
 */
jQuery.prototype.index = function(arg1) {};

/**
 * @return {number}
 * @nosideeffects
 */
jQuery.prototype.innerHeight = function() {};

/**
 * @return {number}
 * @nosideeffects
 */
jQuery.prototype.innerWidth = function() {};

/**
 * @param {(jQuerySelector|Element|jQuery)} target
 * @return {!jQuery}
 */
jQuery.prototype.insertAfter = function(target) {};

/**
 * @param {(jQuerySelector|Element|jQuery)} target
 * @return {!jQuery}
 */
jQuery.prototype.insertBefore = function(target) {};

/**
 * @param {(jQuerySelector|function(number)|jQuery|Element)} arg1
 * @return {boolean}
 */
jQuery.prototype.is = function(arg1) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isArray = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isArray = function(obj) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isEmptyObject = function(obj) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isEmptyObject = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isFunction = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isFunction = function(obj) {};

/**
 * @param {*} value
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isNumeric = function(value) {};

/**
 * @param {*} value
 * @return {boolean}
 * @nosideeffects
 */
$.isNumeric = function(value) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isPlainObject = function(obj) {};

/**
 * @param {Object} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isPlainObject = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isWindow = function(obj) {};

/**
 * @param {*} obj
 * @return {boolean}
 * @nosideeffects
 */
$.isWindow = function(obj) {};

/**
 * @param {Element} node
 * @return {boolean}
 * @nosideeffects
 */
jQuery.isXMLDoc = function(node) {};

/**
 * @param {Element} node
 * @return {boolean}
 * @nosideeffects
 */
$.isXMLDoc = function(node) {};

/** @type {string} */
jQuery.prototype.jquery;

/**
 * @constructor
 * @extends {XMLHttpRequest}
 * @implements {jQuery.Promise}
 * @private
 * @see http://api.jquery.com/jQuery.ajax/#jqXHR
 */
jQuery.jqXHR = function () {};

/**
 * @override
 * @param {jQueryCallback} alwaysCallbacks
 * @param {jQueryCallback=} alwaysCallbacks2
 * @return {jQuery.jqXHR}
 */
jQuery.jqXHR.prototype.always =
    function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @deprecated
 * @param {function()} callback
 * @return {jQuery.jqXHR}
*/
jQuery.jqXHR.prototype.complete = function (callback) {};

/**
 * @override
 * @param {jQueryCallback} doneCallbacks
 * @return {jQuery.jqXHR}
 */
jQuery.jqXHR.prototype.done = function(doneCallbacks) {};

/**
 * @deprecated
 * @param {function()} callback
 * @return {jQuery.jqXHR}
*/
jQuery.jqXHR.prototype.error = function (callback) {};

/**
 * @override
 * @param {jQueryCallback} failCallbacks
 * @return {jQuery.jqXHR}
 */
jQuery.jqXHR.prototype.fail = function(failCallbacks) {};

/**
 * @deprecated
 * @override
 */
jQuery.jqXHR.prototype.onreadystatechange = function (callback) {};

/**
 * @param {function()=} doneFilter
 * @param {function()=} failFilter
 * @param {function()=} progressFilter
 * @return {jQuery.jqXHR}
 */
jQuery.jqXHR.prototype.pipe =
    function(doneFilter, failFilter, progressFilter) {};

/**
 * @deprecated
 * @param {function()} callback
 * @return {jQuery.jqXHR}
*/
jQuery.jqXHR.prototype.success = function (callback) {};

/**
 * @override
 * @param {jQueryCallback} doneCallbacks
 * @param {jQueryCallback=} failCallbacks
 * @param {jQueryCallback=} progressCallbacks
 * @return {jQuery.jqXHR}
 */
jQuery.jqXHR.prototype.then =
    function(doneCallbacks, failCallbacks, progressCallbacks) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.keydown = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.keypress = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.keyup = function(arg1, handler) {};

/** @return {!jQuery} */
jQuery.prototype.last = function() {};

/** @type {number} */
jQuery.prototype.length;

/**
 * @deprecated
 * @param {(function(!jQuery.event=)|Object.<string, *>|string)} arg1
 * @param {(function(!jQuery.event=)|Object.<string,*>|string)=} arg2
 * @param {function(string,string,XMLHttpRequest)=} complete
 * @return {!jQuery}
 */
jQuery.prototype.load = function(arg1, arg2, complete) {};

/**
 * @param {*} obj
 * @return {Array.<*>}
 */
jQuery.makeArray = function(obj) {};

/**
 * @param {*} obj
 * @return {Array.<*>}
 */
$.makeArray = function(obj) {};

/**
 * @param {(Array.<*>|Object.<string, *>)} arg1
 * @param {(function(*,number)|function(*,(string|number)))} callback
 * @return {Array.<*>}
 */
jQuery.map = function(arg1, callback) {};

/**
 * @param {function(number,Element)} callback
 * @return {!jQuery}
 */
jQuery.prototype.map = function(callback) {};

/**
 * @param {(Array.<*>|Object.<string, *>)} arg1
 * @param {(function(*,number)|function(*,(string|number)))} callback
 * @return {Array.<*>}
 */
$.map = function(arg1, callback) {};

/**
 * @param {Array.<*>} first
 * @param {Array.<*>} second
 * @return {Array.<*>}
 */
jQuery.merge = function(first, second) {};

/**
 * @param {Array.<*>} first
 * @param {Array.<*>} second
 * @return {Array.<*>}
 */
$.merge = function(first, second) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mousedown = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mouseenter = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mouseleave = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mousemove = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mouseout = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mouseover = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.mouseup = function(arg1, handler) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.next = function(selector) {};

/**
 * @param {string=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.nextAll = function(selector) {};

/**
 * @param {(jQuerySelector|Element)=} arg1
 * @param {jQuerySelector=} filter
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.nextUntil = function(arg1, filter) {};

/**
 * @param {boolean=} removeAll
 * @return {Object}
 */
jQuery.noConflict = function(removeAll) {};

/**
 * @param {boolean=} removeAll
 * @return {Object}
 */
$.noConflict = function(removeAll) {};

/**
 * @return {function()}
 * @nosideeffects
 */
jQuery.noop = function() {};

/**
 * @return {function()}
 * @nosideeffects
 */
$.noop = function() {};

/**
 * @param {(jQuerySelector|Array.<Element>|function(number)|jQuery)} arg1
 * @return {!jQuery}
 */
jQuery.prototype.not = function(arg1) {};

/**
 * @return {number}
 * @nosideeffects
 */
jQuery.now = function() {};

/**
 * @return {number}
 * @nosideeffects
 */
$.now = function() {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|function(!jQuery.event=))=} selector
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.off = function(arg1, selector, handler) {};

/**
 * @param {({left:number,top:number}|
 *     function(number,{top:number,left:number}))=} arg1
 * @return {({left:number,top:number}|!jQuery)}
 */
jQuery.prototype.offset = function(arg1) {};

/**
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.offsetParent = function() {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {*=} selector
 * @param {*=} data
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.on = function(arg1, selector, data, handler) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {*=} arg2
 * @param {*=} arg3
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.one = function(arg1, arg2, arg3, handler) {};

/**
 * @param {boolean=} includeMargin
 * @return {number}
 * @nosideeffects
 */
jQuery.prototype.outerHeight = function(includeMargin) {};

/**
 * @param {boolean=} includeMargin
 * @return {number}
 * @nosideeffects
 */
jQuery.prototype.outerWidth = function(includeMargin) {};

/**
 * @param {(Object.<string, *>|Array.<Object.<string, *>>)} obj
 * @param {boolean=} traditional
 * @return {string}
 */
jQuery.param = function(obj, traditional) {};

/**
 * @param {(Object.<string, *>|Array.<Object.<string, *>>)} obj
 * @param {boolean=} traditional
 * @return {string}
 */
$.param = function(obj, traditional) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.parent = function(selector) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.parents = function(selector) {};

/**
 * @param {(jQuerySelector|Element)=} arg1
 * @param {jQuerySelector=} filter
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.parentsUntil = function(arg1, filter) {};

/**
 * @param {string} data
 * @param {Element=} context
 * @param {boolean=} keepScripts
 * @return {Array.<Element>}
 */
jQuery.parseHTML = function(data, context, keepScripts) {};

/**
 * @param {string} data
 * @param {Element=} context
 * @param {boolean=} keepScripts
 * @return {Array.<Element>}
 */
$.parseHTML = function(data, context, keepScripts) {};

/**
 * @param {string} json
 * @return {Object.<string, *>}
 */
jQuery.parseJSON = function(json) {};

/**
 * @param {string} json
 * @return {Object.<string, *>}
 */
$.parseJSON = function(json) {};

/**
 * @param {string} data
 * @return {Document}
 */
jQuery.parseXML = function(data) {};

/**
 * @param {string} data
 * @return {Document}
 */
$.parseXML = function(data) {};

/**
 * @return {{left:number,top:number}}
 * @nosideeffects
 */
jQuery.prototype.position = function() {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,jQuery.jqXHR))=} data
 * @param {(function(string,string,jQuery.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {jQuery.jqXHR}
 */
jQuery.post = function(url, data, success, dataType) {};

/**
 * @param {string} url
 * @param {(Object.<string,*>|string|
 *     function(string,string,jQuery.jqXHR))=} data
 * @param {(function(string,string,jQuery.jqXHR)|string)=} success
 * @param {string=} dataType
 * @return {jQuery.jqXHR}
 */
$.post = function(url, data, success, dataType) {};

/**
 * @param {(string|Element|jQuery|function(number,string))} arg1
 * @param {(string|Element|jQuery)=} content
 * @return {!jQuery}
 */
jQuery.prototype.prepend = function(arg1, content) {};

/**
 * @param {(jQuerySelector|Element|jQuery)} target
 * @return {!jQuery}
 */
jQuery.prototype.prependTo = function(target) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.prev = function(selector) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.prevAll = function(selector) {};

/**
 * @param {(jQuerySelector|Element)=} arg1
 * @param {jQuerySelector=} filter
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.prevUntil = function(arg1, filter) {};

/**
 * @param {(string|Object)=} type
 * @param {Object=} target
 * @return {jQuery.Promise}
 */
jQuery.prototype.promise = function(type, target) {};

/**
 * @interface
 * @private
 * @see http://api.jquery.com/Types/#Promise
 */
jQuery.Promise = function () {};

/**
 * @param {jQueryCallback} alwaysCallbacks
 * @param {jQueryCallback=} alwaysCallbacks2
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.always =
    function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @param {jQueryCallback} doneCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.done = function(doneCallbacks) {};

/**
 * @param {jQueryCallback} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.fail = function(failCallbacks) {};

/**
 * @param {function()=} doneFilter
 * @param {function()=} failFilter
 * @param {function()=} progressFilter
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.pipe =
    function(doneFilter, failFilter, progressFilter) {};

/**
 * @param {jQueryCallback} doneCallbacks
 * @param {jQueryCallback=} failCallbacks
 * @param {jQueryCallback=} progressCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.then =
    function(doneCallbacks, failCallbacks, progressCallbacks) {};

/**
 * @param {(string|Object.<string,*>)} arg1
 * @param {(string|number|boolean|function(number,String))=} arg2
 * @return {(string|!jQuery)}
 */
jQuery.prototype.prop = function(arg1, arg2) {};

/**
 * @param {...*} var_args
 * @return {function()}
 */
jQuery.proxy = function(var_args) {};

/**
 * @param {...*} var_args
 * @return {function()}
 */
$.proxy = function(var_args) {};

/**
 * @param {Array.<Element>} elements
 * @param {string=} name
 * @param {Array.<*>=} args
 * @return {!jQuery}
 */
jQuery.prototype.pushStack = function(elements, name, args) {};

/**
 * @param {(string|Array.<function()>|function(function()))=} queueName
 * @param {(Array.<function()>|function(function()))=} arg2
 * @return {(Array.<Element>|!jQuery)}
 */
jQuery.prototype.queue = function(queueName, arg2) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 * @param {(Array.<function()>|function())=} arg3
 * @return {(Array.<Element>|!jQuery)}
 */
jQuery.queue = function(elem, queueName, arg3) {};

/**
 * @param {Element} elem
 * @param {string=} queueName
 * @param {(Array.<function()>|function())=} arg3
 * @return {(Array.<Element>|!jQuery)}
 */
$.queue = function(elem, queueName, arg3) {};

/**
 * @param {function()} handler
 * @return {!jQuery}
 */
jQuery.prototype.ready = function(handler) {};

/**
 * @param {string=} selector
 * @return {!jQuery}
 */
jQuery.prototype.remove = function(selector) {};

/**
 * @param {string} attributeName
 * @return {!jQuery}
 */
jQuery.prototype.removeAttr = function(attributeName) {};

/**
 * @param {(string|function(number,string))=} arg1
 * @return {!jQuery}
 */
jQuery.prototype.removeClass = function(arg1) {};

/**
 * @param {(string|Array.<string>)=} arg1
 * @return {!jQuery}
 */
jQuery.prototype.removeData = function(arg1) {};

/**
 * @param {Element} elem
 * @param {string=} name
 * @return {!jQuery}
 */
jQuery.removeData = function(elem, name) {};

/**
 * @param {Element} elem
 * @param {string=} name
 * @return {!jQuery}
 */
$.removeData = function(elem, name) {};

/**
 * @param {string} propertyName
 * @return {!jQuery}
 */
jQuery.prototype.removeProp = function(propertyName) {};

/**
 * @param {jQuerySelector} target
 * @return {!jQuery}
 */
jQuery.prototype.replaceAll = function(target) {};

/**
 * @param {(string|Element|jQuery|function())} arg1
 * @return {!jQuery}
 */
jQuery.prototype.replaceWith = function(arg1) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.resize = function(arg1, handler) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.scroll = function(arg1, handler) {};

/**
 * @param {number=} value
 * @return {(number|!jQuery)}
 */
jQuery.prototype.scrollLeft = function(value) {};

/**
 * @param {number=} value
 * @return {(number|!jQuery)}
 */
jQuery.prototype.scrollTop = function(value) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.select = function(arg1, handler) {};

/**
 * @return {string}
 * @nosideeffects
 */
jQuery.prototype.serialize = function() {};

/**
 * @return {Array.<Object.<string, *>>}
 * @nosideeffects
 */
jQuery.prototype.serializeArray = function() {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.show = function(duration, arg2, callback) {};

/**
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.siblings = function(selector) {};

/**
 * @deprecated
 * @return {number}
 * @nosideeffects
 */
jQuery.prototype.size = function() {};

/**
 * @param {number} start
 * @param {number=} end
 * @return {!jQuery}
 */
jQuery.prototype.slice = function(start, end) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.slideDown = function(duration, arg2, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.slideToggle = function(duration, arg2, callback) {};

/**
 * @param {(string|number|function())=} duration
 * @param {(function()|string)=} arg2
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.slideUp = function(duration, arg2, callback) {};

/**
 * @param {(boolean|string)=} arg1
 * @param {boolean=} arg2
 * @param {boolean=} jumpToEnd
 * @return {!jQuery}
 */
jQuery.prototype.stop = function(arg1, arg2, jumpToEnd) {};

/**
 * @param {(function(!jQuery.event=)|Object.<string, *>)=} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.submit = function(arg1, handler) {};

/** @type {Object.<string, *>} */
jQuery.support;

/** @type {Object.<string, *>} */
$.support;

/** @type {boolean} */
jQuery.support.boxModel;

/** @type {boolean} */
$.support.boxModel;

/** @type {boolean} */
jQuery.support.changeBubbles;

/** @type {boolean} */
$.support.changeBubbles;

/** @type {boolean} */
jQuery.support.cssFloat;

/** @type {boolean} */
$.support.cssFloat;

/** @type {boolean} */
jQuery.support.fixedPosition;

/** @type {boolean} */
$.support.fixedPosition;

/** @type {boolean} */
jQuery.support.hrefNormalized;

/** @type {boolean} */
$.support.hrefNormalized;

/** @type {boolean} */
jQuery.support.htmlSerialize;

/** @type {boolean} */
$.support.htmlSerialize;

/** @type {boolean} */
jQuery.support.leadingWhitespace;

/** @type {boolean} */
$.support.leadingWhitespace;

/** @type {boolean} */
jQuery.support.noCloneEvent;

/** @type {boolean} */
$.support.noCloneEvent;

/** @type {boolean} */
jQuery.support.opacity;

/** @type {boolean} */
$.support.opacity;

/** @type {boolean} */
jQuery.support.scriptEval;

/** @type {boolean} */
$.support.scriptEval;

/** @type {boolean} */
jQuery.support.style;

/** @type {boolean} */
$.support.style;

/** @type {boolean} */
jQuery.support.submitBubbles;

/** @type {boolean} */
$.support.submitBubbles;

/** @type {boolean} */
jQuery.support.tbody;

/** @type {boolean} */
$.support.tbody;

/**
 * @param {(string|function(number,string))=} arg1
 * @return {(string|!jQuery)}
 */
jQuery.prototype.text = function(arg1) {};

/**
 * @return {Array.<Element>}
 * @nosideeffects
 */
jQuery.prototype.toArray = function() {};

/**
 * Refers to the method from the Effects category. There used to be a toggle
 * method on the Events category which was removed starting version 1.9.
 * @param {(number|string|Object.<string,*>|boolean)=} arg1
 * @param {(function()|string)=} arg2
 * @param {function()=} arg3
 * @return {!jQuery}
 */
jQuery.prototype.toggle = function(arg1, arg2, arg3) {};

/**
 * @param {(string|boolean|function(number,string,boolean))=} arg1
 * @param {boolean=} flag
 * @return {!jQuery}
 */
jQuery.prototype.toggleClass = function(arg1, flag) {};

/**
 * @param {(string|jQuery.event)} arg1
 * @param {...*} var_args
 * @return {!jQuery}
 */
jQuery.prototype.trigger = function(arg1, var_args) {};

/**
 * @param {string} eventType
 * @param {Array.<*>=} extraParameters
 * @return {*}
 */
jQuery.prototype.triggerHandler = function(eventType, extraParameters) {};

/**
 * @param {string} str
 * @return {string}
 * @nosideeffects
 */
jQuery.trim = function(str) {};

/**
 * @param {string} str
 * @return {string}
 * @nosideeffects
 */
$.trim = function(str) {};

/**
 * @param {*} obj
 * @return {string}
 * @nosideeffects
 */
jQuery.type = function(obj) {};

/**
 * @param {*} obj
 * @return {string}
 * @nosideeffects
 */
$.type = function(obj) {};

/**
 * @param {(string|function(!jQuery.event=)|jQuery.event)=} arg1
 * @param {(function(!jQuery.event=)|boolean)=} arg2
 * @return {!jQuery}
 */
jQuery.prototype.unbind = function(arg1, arg2) {};

/**
 * @param {string=} arg1
 * @param {(string|Object.<string,*>)=} arg2
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.undelegate = function(arg1, arg2, handler) {};

/**
 * @param {Array.<Element>} arr
 * @return {Array.<Element>}
 */
jQuery.unique = function(arr) {};

/**
 * @param {Array.<Element>} arr
 * @return {Array.<Element>}
 */
$.unique = function(arr) {};

/**
 * @deprecated
 * @param {(function(!jQuery.event=)|Object.<string, *>)} arg1
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.unload = function(arg1, handler) {};

/** @return {!jQuery} */
jQuery.prototype.unwrap = function() {};

/**
 * @param {(string|Array.<string>|function(number,*))=} arg1
 * @return {(string|number|Array.<string>|!jQuery)}
 */
jQuery.prototype.val = function(arg1) {};

/**
 * @param {jQuery.deferred} deferred
 * @param {...jQuery.deferred} deferreds
 * @return {jQuery.Promise}
 */
jQuery.when = function(deferred, deferreds) {};

/**
 * @param {jQuery.deferred} deferred
 * @param {...jQuery.deferred} deferreds
 * @return {jQuery.Promise}
 */
$.when = function(deferred, deferreds) {};

/**
 * @param {(string|number|function(number,number))=} arg1
 * @return {(number|!jQuery)}
 */
jQuery.prototype.width = function(arg1) {};

/**
 * @param {(string|jQuerySelector|Element|jQuery|function(number))} arg1
 * @return {!jQuery}
 */
jQuery.prototype.wrap = function(arg1) {};

/**
 * @param {(string|jQuerySelector|Element|jQuery)} wrappingElement
 * @return {!jQuery}
 */
jQuery.prototype.wrapAll = function(wrappingElement) {};

/**
 * @param {(string|function(number))} arg1
 * @return {!jQuery}
 */
jQuery.prototype.wrapInner = function(arg1) {};

//********************************************
//****** JQuery addons & UI stuff used in app: ********
//********************************************

/**
 * @param {Object} obj
 **/
jQuery.prototype.ajaxForm = function(obj){};

/** 
 * @param {Object.<string, (string|boolean)>} options
 */
jQuery.prototype.datepicker = function (options){};
/** 
 * @param {Object.<string, (string|boolean)>} options
 **/
jQuery.prototype.timepicker = function (options){};
/** @type {Object.<string, (string|boolean)>} */
jQuery.prototype.datetimepicker = {};
/** 
 *  @param {Object} obj
 * */
jQuery.prototype.multiselect = function(obj){};


/*
 * Copyright 2010 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Externs for the Google Maps v3.10 API.
 * @see http://code.google.com/apis/maps/documentation/javascript/reference.html
 * @externs
 */

google.maps = {};

/**
 * @enum {number|string}
 */
google.maps.Animation = {
  BOUNCE: '',
  DROP: ''
};

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.BicyclingLayer = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.BicyclingLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.BicyclingLayer.prototype.setMap = function(map) {};

/**
 * @param {(google.maps.CircleOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.Circle = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLngBounds}
 */
google.maps.Circle.prototype.getBounds = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.Circle.prototype.getCenter = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Circle.prototype.getEditable = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.Circle.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.Circle.prototype.getRadius = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Circle.prototype.getVisible = function() {};

/**
 * @param {google.maps.LatLng} center
 * @return {undefined}
 */
google.maps.Circle.prototype.setCenter = function(center) {};

/**
 * @param {boolean} editable
 * @return {undefined}
 */
google.maps.Circle.prototype.setEditable = function(editable) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.Circle.prototype.setMap = function(map) {};

/**
 * @param {google.maps.CircleOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.Circle.prototype.setOptions = function(options) {};

/**
 * @param {number} radius
 * @return {undefined}
 */
google.maps.Circle.prototype.setRadius = function(radius) {};

/**
 * @param {boolean} visible
 * @return {undefined}
 */
google.maps.Circle.prototype.setVisible = function(visible) {};

/**
 * @constructor
 */
google.maps.CircleOptions = function() {};

/**
 * @type {google.maps.LatLng}
 */
google.maps.CircleOptions.prototype.center;

/**
 * @type {boolean}
 */
google.maps.CircleOptions.prototype.clickable;

/**
 * @type {boolean}
 */
google.maps.CircleOptions.prototype.editable;

/**
 * @type {string}
 */
google.maps.CircleOptions.prototype.fillColor;

/**
 * @type {number}
 */
google.maps.CircleOptions.prototype.fillOpacity;

/**
 * @type {google.maps.Map}
 */
google.maps.CircleOptions.prototype.map;

/**
 * @type {number}
 */
google.maps.CircleOptions.prototype.radius;

/**
 * @type {string}
 */
google.maps.CircleOptions.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.CircleOptions.prototype.strokeOpacity;

/**
 * @type {google.maps.StrokePosition}
 */
google.maps.CircleOptions.prototype.strokePosition;

/**
 * @type {number}
 */
google.maps.CircleOptions.prototype.strokeWeight;

/**
 * @type {boolean}
 */
google.maps.CircleOptions.prototype.visible;

/**
 * @type {number}
 */
google.maps.CircleOptions.prototype.zIndex;

/**
 * @enum {number|string}
 */
google.maps.ControlPosition = {
  BOTTOM_CENTER: '',
  BOTTOM_LEFT: '',
  BOTTOM_RIGHT: '',
  LEFT_BOTTOM: '',
  LEFT_CENTER: '',
  LEFT_TOP: '',
  RIGHT_BOTTOM: '',
  RIGHT_CENTER: '',
  RIGHT_TOP: '',
  TOP_CENTER: '',
  TOP_LEFT: '',
  TOP_RIGHT: ''
};

/**
 * @constructor
 */
google.maps.DirectionsLeg = function() {};

/**
 * @type {google.maps.Distance}
 */
google.maps.DirectionsLeg.prototype.arrival_time;

/**
 * @type {google.maps.Duration}
 */
google.maps.DirectionsLeg.prototype.departure_time;

/**
 * @type {google.maps.Distance}
 */
google.maps.DirectionsLeg.prototype.distance;

/**
 * @type {google.maps.Duration}
 */
google.maps.DirectionsLeg.prototype.duration;

/**
 * @type {string}
 */
google.maps.DirectionsLeg.prototype.end_address;

/**
 * @type {google.maps.LatLng}
 */
google.maps.DirectionsLeg.prototype.end_location;

/**
 * @type {string}
 */
google.maps.DirectionsLeg.prototype.start_address;

/**
 * @type {google.maps.LatLng}
 */
google.maps.DirectionsLeg.prototype.start_location;

/**
 * @type {Array.<google.maps.DirectionsStep>}
 */
google.maps.DirectionsLeg.prototype.steps;

/**
 * @type {Array.<google.maps.LatLng>}
 */
google.maps.DirectionsLeg.prototype.via_waypoints;

/**
 * @param {(google.maps.DirectionsRendererOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.DirectionsRenderer = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.DirectionsResult}
 */
google.maps.DirectionsRenderer.prototype.getDirections = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.DirectionsRenderer.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {Node}
 */
google.maps.DirectionsRenderer.prototype.getPanel = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.DirectionsRenderer.prototype.getRouteIndex = function() {};

/**
 * @param {google.maps.DirectionsResult} directions
 * @return {undefined}
 */
google.maps.DirectionsRenderer.prototype.setDirections = function(directions) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.DirectionsRenderer.prototype.setMap = function(map) {};

/**
 * @param {google.maps.DirectionsRendererOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.DirectionsRenderer.prototype.setOptions = function(options) {};

/**
 * @param {Node} panel
 * @return {undefined}
 */
google.maps.DirectionsRenderer.prototype.setPanel = function(panel) {};

/**
 * @param {number} routeIndex
 * @return {undefined}
 */
google.maps.DirectionsRenderer.prototype.setRouteIndex = function(routeIndex) {};

/**
 * @constructor
 */
google.maps.DirectionsRendererOptions = function() {};

/**
 * @type {google.maps.DirectionsResult}
 */
google.maps.DirectionsRendererOptions.prototype.directions;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.draggable;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.hideRouteList;

/**
 * @type {google.maps.InfoWindow}
 */
google.maps.DirectionsRendererOptions.prototype.infoWindow;

/**
 * @type {google.maps.Map}
 */
google.maps.DirectionsRendererOptions.prototype.map;

/**
 * @type {google.maps.MarkerOptions|Object.<string>}
 */
google.maps.DirectionsRendererOptions.prototype.markerOptions;

/**
 * @type {Node}
 */
google.maps.DirectionsRendererOptions.prototype.panel;

/**
 * @type {google.maps.PolylineOptions|Object.<string>}
 */
google.maps.DirectionsRendererOptions.prototype.polylineOptions;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.preserveViewport;

/**
 * @type {number}
 */
google.maps.DirectionsRendererOptions.prototype.routeIndex;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.suppressBicyclingLayer;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.suppressInfoWindows;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.suppressMarkers;

/**
 * @type {boolean}
 */
google.maps.DirectionsRendererOptions.prototype.suppressPolylines;

/**
 * @constructor
 */
google.maps.DirectionsRequest = function() {};

/**
 * @type {boolean}
 */
google.maps.DirectionsRequest.prototype.avoidHighways;

/**
 * @type {boolean}
 */
google.maps.DirectionsRequest.prototype.avoidTolls;

/**
 * @type {google.maps.LatLng|string}
 */
google.maps.DirectionsRequest.prototype.destination;

/**
 * @type {boolean}
 */
google.maps.DirectionsRequest.prototype.optimizeWaypoints;

/**
 * @type {google.maps.LatLng|string}
 */
google.maps.DirectionsRequest.prototype.origin;

/**
 * @type {boolean}
 */
google.maps.DirectionsRequest.prototype.provideRouteAlternatives;

/**
 * @type {string}
 */
google.maps.DirectionsRequest.prototype.region;

/**
 * @type {google.maps.TransitOptions|Object.<string>}
 */
google.maps.DirectionsRequest.prototype.transitOptions;

/**
 * @type {google.maps.TravelMode}
 */
google.maps.DirectionsRequest.prototype.travelMode;

/**
 * @type {google.maps.UnitSystem}
 */
google.maps.DirectionsRequest.prototype.unitSystem;

/**
 * @type {Array.<google.maps.DirectionsWaypoint>}
 */
google.maps.DirectionsRequest.prototype.waypoints;

/**
 * @constructor
 */
google.maps.DirectionsResult = function() {};

/**
 * @type {Array.<google.maps.DirectionsRoute>}
 */
google.maps.DirectionsResult.prototype.routes;

/**
 * @constructor
 */
google.maps.DirectionsRoute = function() {};

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.DirectionsRoute.prototype.bounds;

/**
 * @type {string}
 */
google.maps.DirectionsRoute.prototype.copyrights;

/**
 * @type {Array.<google.maps.DirectionsLeg>}
 */
google.maps.DirectionsRoute.prototype.legs;

/**
 * @type {Array.<google.maps.LatLng>}
 */
google.maps.DirectionsRoute.prototype.overview_path;

/**
 * @type {Array.<string>}
 */
google.maps.DirectionsRoute.prototype.warnings;

/**
 * @type {Array.<number>}
 */
google.maps.DirectionsRoute.prototype.waypoint_order;

/**
 * @constructor
 */
google.maps.DirectionsService = function() {};

/**
 * @param {google.maps.DirectionsRequest|Object.<string>} request
 * @param {function(google.maps.DirectionsResult, google.maps.DirectionsStatus)} callback
 * @return {undefined}
 */
google.maps.DirectionsService.prototype.route = function(request, callback) {};

/**
 * @enum {number|string}
 */
google.maps.DirectionsStatus = {
  INVALID_REQUEST: '',
  MAX_WAYPOINTS_EXCEEDED: '',
  NOT_FOUND: '',
  OK: '',
  OVER_QUERY_LIMIT: '',
  REQUEST_DENIED: '',
  UNKNOWN_ERROR: '',
  ZERO_RESULTS: ''
};

/**
 * @constructor
 */
google.maps.DirectionsStep = function() {};

/**
 * @type {google.maps.Distance}
 */
google.maps.DirectionsStep.prototype.distance;

/**
 * @type {google.maps.Duration}
 */
google.maps.DirectionsStep.prototype.duration;

/**
 * @type {google.maps.LatLng}
 */
google.maps.DirectionsStep.prototype.end_location;

/**
 * @type {string}
 */
google.maps.DirectionsStep.prototype.instructions;

/**
 * @type {Array.<google.maps.LatLng>}
 */
google.maps.DirectionsStep.prototype.path;

/**
 * @type {google.maps.LatLng}
 */
google.maps.DirectionsStep.prototype.start_location;

/**
 * @type {google.maps.DirectionsStep}
 */
google.maps.DirectionsStep.prototype.steps;

/**
 * @type {google.maps.TransitDetails}
 */
google.maps.DirectionsStep.prototype.transit;

/**
 * @type {google.maps.TravelMode}
 */
google.maps.DirectionsStep.prototype.travel_mode;

/**
 * @constructor
 */
google.maps.DirectionsWaypoint = function() {};

/**
 * @type {google.maps.LatLng|string}
 */
google.maps.DirectionsWaypoint.prototype.location;

/**
 * @type {boolean}
 */
google.maps.DirectionsWaypoint.prototype.stopover;

/**
 * @constructor
 */
google.maps.Distance = function() {};

/**
 * @type {string}
 */
google.maps.Distance.prototype.text;

/**
 * @type {number}
 */
google.maps.Distance.prototype.value;

/**
 * @enum {number|string}
 */
google.maps.DistanceMatrixElementStatus = {
  NOT_FOUND: '',
  OK: '',
  ZERO_RESULTS: ''
};

/**
 * @constructor
 */
google.maps.DistanceMatrixRequest = function() {};

/**
 * @type {boolean}
 */
google.maps.DistanceMatrixRequest.prototype.avoidHighways;

/**
 * @type {boolean}
 */
google.maps.DistanceMatrixRequest.prototype.avoidTolls;

/**
 * @type {Array.<google.maps.LatLng>|Array.<string>}
 */
google.maps.DistanceMatrixRequest.prototype.destinations;

/**
 * @type {Array.<google.maps.LatLng>|Array.<string>}
 */
google.maps.DistanceMatrixRequest.prototype.origins;

/**
 * @type {string}
 */
google.maps.DistanceMatrixRequest.prototype.region;

/**
 * @type {google.maps.TravelMode}
 */
google.maps.DistanceMatrixRequest.prototype.travelMode;

/**
 * @type {google.maps.UnitSystem}
 */
google.maps.DistanceMatrixRequest.prototype.unitSystem;

/**
 * @constructor
 */
google.maps.DistanceMatrixResponse = function() {};

/**
 * @type {Array.<string>}
 */
google.maps.DistanceMatrixResponse.prototype.destinationAddresses;

/**
 * @type {Array.<string>}
 */
google.maps.DistanceMatrixResponse.prototype.originAddresses;

/**
 * @type {Array.<google.maps.DistanceMatrixResponseRow>}
 */
google.maps.DistanceMatrixResponse.prototype.rows;

/**
 * @constructor
 */
google.maps.DistanceMatrixResponseElement = function() {};

/**
 * @type {google.maps.Distance}
 */
google.maps.DistanceMatrixResponseElement.prototype.distance;

/**
 * @type {google.maps.Duration}
 */
google.maps.DistanceMatrixResponseElement.prototype.duration;

/**
 * @type {google.maps.DistanceMatrixElementStatus}
 */
google.maps.DistanceMatrixResponseElement.prototype.status;

/**
 * @constructor
 */
google.maps.DistanceMatrixResponseRow = function() {};

/**
 * @type {Array.<google.maps.DistanceMatrixResponseElement>}
 */
google.maps.DistanceMatrixResponseRow.prototype.elements;

/**
 * @constructor
 */
google.maps.DistanceMatrixService = function() {};

/**
 * @param {google.maps.DistanceMatrixRequest|Object.<string>} request
 * @param {function(google.maps.DistanceMatrixResponse, google.maps.DistanceMatrixStatus)} callback
 * @return {undefined}
 */
google.maps.DistanceMatrixService.prototype.getDistanceMatrix = function(request, callback) {};

/**
 * @enum {number|string}
 */
google.maps.DistanceMatrixStatus = {
  INVALID_REQUEST: '',
  MAX_DIMENSIONS_EXCEEDED: '',
  MAX_ELEMENTS_EXCEEDED: '',
  OK: '',
  OVER_QUERY_LIMIT: '',
  REQUEST_DENIED: '',
  UNKNOWN_ERROR: ''
};

/**
 * @constructor
 */
google.maps.Duration = function() {};

/**
 * @type {string}
 */
google.maps.Duration.prototype.text;

/**
 * @type {number}
 */
google.maps.Duration.prototype.value;

/**
 * @constructor
 */
google.maps.ElevationResult = function() {};

/**
 * @type {number}
 */
google.maps.ElevationResult.prototype.elevation;

/**
 * @type {google.maps.LatLng}
 */
google.maps.ElevationResult.prototype.location;

/**
 * @type {number}
 */
google.maps.ElevationResult.prototype.resolution;

/**
 * @constructor
 */
google.maps.ElevationService = function() {};

/**
 * @param {google.maps.PathElevationRequest|Object.<string>} request
 * @param {function(Array.<google.maps.ElevationResult>, google.maps.ElevationStatus)} callback
 * @return {undefined}
 */
google.maps.ElevationService.prototype.getElevationAlongPath = function(request, callback) {};

/**
 * @param {google.maps.LocationElevationRequest|Object.<string>} request
 * @param {function(Array.<google.maps.ElevationResult>, google.maps.ElevationStatus)} callback
 * @return {undefined}
 */
google.maps.ElevationService.prototype.getElevationForLocations = function(request, callback) {};

/**
 * @enum {number|string}
 */
google.maps.ElevationStatus = {
  INVALID_REQUEST: '',
  OK: '',
  OVER_QUERY_LIMIT: '',
  REQUEST_DENIED: '',
  UNKNOWN_ERROR: ''
};

/**
 * @constructor
 */
google.maps.FusionTablesCell = function() {};

/**
 * @type {string}
 */
google.maps.FusionTablesCell.prototype.columnName;

/**
 * @type {string}
 */
google.maps.FusionTablesCell.prototype.value;

/**
 * @constructor
 */
google.maps.FusionTablesHeatmap = function() {};

/**
 * @type {boolean}
 */
google.maps.FusionTablesHeatmap.prototype.enabled;

/**
 * @param {google.maps.FusionTablesLayerOptions|Object.<string>} options
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.FusionTablesLayer = function(options) {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.FusionTablesLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.FusionTablesLayer.prototype.setMap = function(map) {};

/**
 * @param {google.maps.FusionTablesLayerOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.FusionTablesLayer.prototype.setOptions = function(options) {};

/**
 * @constructor
 */
google.maps.FusionTablesLayerOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.FusionTablesLayerOptions.prototype.clickable;

/**
 * @type {google.maps.FusionTablesHeatmap}
 */
google.maps.FusionTablesLayerOptions.prototype.heatmap;

/**
 * @type {google.maps.Map}
 */
google.maps.FusionTablesLayerOptions.prototype.map;

/**
 * @type {google.maps.FusionTablesQuery}
 */
google.maps.FusionTablesLayerOptions.prototype.query;

/**
 * @type {Array.<google.maps.FusionTablesStyle>}
 */
google.maps.FusionTablesLayerOptions.prototype.styles;

/**
 * @type {boolean}
 */
google.maps.FusionTablesLayerOptions.prototype.suppressInfoWindows;

/**
 * @constructor
 */
google.maps.FusionTablesMarkerOptions = function() {};

/**
 * @type {string}
 */
google.maps.FusionTablesMarkerOptions.prototype.iconName;

/**
 * @constructor
 */
google.maps.FusionTablesMouseEvent = function() {};

/**
 * @type {string}
 */
google.maps.FusionTablesMouseEvent.prototype.infoWindowHtml;

/**
 * @type {google.maps.LatLng}
 */
google.maps.FusionTablesMouseEvent.prototype.latLng;

/**
 * @type {google.maps.Size}
 */
google.maps.FusionTablesMouseEvent.prototype.pixelOffset;

/**
 * @type {Object}
 */
google.maps.FusionTablesMouseEvent.prototype.row;

/**
 * @constructor
 */
google.maps.FusionTablesPolygonOptions = function() {};

/**
 * @type {string}
 */
google.maps.FusionTablesPolygonOptions.prototype.fillColor;

/**
 * @type {number}
 */
google.maps.FusionTablesPolygonOptions.prototype.fillOpacity;

/**
 * @type {string}
 */
google.maps.FusionTablesPolygonOptions.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.FusionTablesPolygonOptions.prototype.strokeOpacity;

/**
 * @type {number}
 */
google.maps.FusionTablesPolygonOptions.prototype.strokeWeight;

/**
 * @constructor
 */
google.maps.FusionTablesPolylineOptions = function() {};

/**
 * @type {string}
 */
google.maps.FusionTablesPolylineOptions.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.FusionTablesPolylineOptions.prototype.strokeOpacity;

/**
 * @type {number}
 */
google.maps.FusionTablesPolylineOptions.prototype.strokeWeight;

/**
 * @constructor
 */
google.maps.FusionTablesQuery = function() {};

/**
 * @type {string}
 */
google.maps.FusionTablesQuery.prototype.from;

/**
 * @type {number}
 */
google.maps.FusionTablesQuery.prototype.limit;

/**
 * @type {number}
 */
google.maps.FusionTablesQuery.prototype.offset;

/**
 * @type {string}
 */
google.maps.FusionTablesQuery.prototype.orderBy;

/**
 * @type {string}
 */
google.maps.FusionTablesQuery.prototype.select;

/**
 * @type {string}
 */
google.maps.FusionTablesQuery.prototype.where;

/**
 * @constructor
 */
google.maps.FusionTablesStyle = function() {};

/**
 * @type {google.maps.FusionTablesMarkerOptions|Object.<string>}
 */
google.maps.FusionTablesStyle.prototype.markerOptions;

/**
 * @type {google.maps.FusionTablesPolygonOptions|Object.<string>}
 */
google.maps.FusionTablesStyle.prototype.polygonOptions;

/**
 * @type {google.maps.FusionTablesPolylineOptions|Object.<string>}
 */
google.maps.FusionTablesStyle.prototype.polylineOptions;

/**
 * @type {string}
 */
google.maps.FusionTablesStyle.prototype.where;

/**
 * @constructor
 */
google.maps.Geocoder = function() {};

/**
 * @param {google.maps.GeocoderRequest|Object.<string>} request
 * @param {function(Array.<google.maps.GeocoderResult>, google.maps.GeocoderStatus)} callback
 * @return {undefined}
 */
google.maps.Geocoder.prototype.geocode = function(request, callback) {};

/**
 * @constructor
 */
google.maps.GeocoderAddressComponent = function() {};

/**
 * @type {string}
 */
google.maps.GeocoderAddressComponent.prototype.long_name;

/**
 * @type {string}
 */
google.maps.GeocoderAddressComponent.prototype.short_name;

/**
 * @type {Array.<string>}
 */
google.maps.GeocoderAddressComponent.prototype.types;

/**
 * @constructor
 */
google.maps.GeocoderGeometry = function() {};

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.GeocoderGeometry.prototype.bounds;

/**
 * @type {google.maps.LatLng}
 */
google.maps.GeocoderGeometry.prototype.location;

/**
 * @type {google.maps.GeocoderLocationType}
 */
google.maps.GeocoderGeometry.prototype.location_type;

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.GeocoderGeometry.prototype.viewport;

/**
 * @enum {number|string}
 */
google.maps.GeocoderLocationType = {
  APPROXIMATE: '',
  GEOMETRIC_CENTER: '',
  RANGE_INTERPOLATED: '',
  ROOFTOP: ''
};

/**
 * @constructor
 */
google.maps.GeocoderRequest = function() {};

/**
 * @type {string}
 */
google.maps.GeocoderRequest.prototype.address;

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.GeocoderRequest.prototype.bounds;

/**
 * @type {google.maps.LatLng}
 */
google.maps.GeocoderRequest.prototype.location;

/**
 * @type {string}
 */
google.maps.GeocoderRequest.prototype.region;

/**
 * @constructor
 */
google.maps.GeocoderResult = function() {};

/**
 * @type {Array.<google.maps.GeocoderAddressComponent>}
 */
google.maps.GeocoderResult.prototype.address_components;

/**
 * @type {string}
 */
google.maps.GeocoderResult.prototype.formatted_address;

/**
 * @type {google.maps.GeocoderGeometry}
 */
google.maps.GeocoderResult.prototype.geometry;

/**
 * @type {Array.<string>}
 */
google.maps.GeocoderResult.prototype.types;

/**
 * @enum {number|string}
 */
google.maps.GeocoderStatus = {
  ERROR: '',
  INVALID_REQUEST: '',
  OK: '',
  OVER_QUERY_LIMIT: '',
  REQUEST_DENIED: '',
  UNKNOWN_ERROR: '',
  ZERO_RESULTS: ''
};

/**
 * @param {string} url
 * @param {google.maps.LatLngBounds} bounds
 * @param {(google.maps.GroundOverlayOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.GroundOverlay = function(url, bounds, opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLngBounds}
 */
google.maps.GroundOverlay.prototype.getBounds = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.GroundOverlay.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.GroundOverlay.prototype.getOpacity = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.GroundOverlay.prototype.getUrl = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.GroundOverlay.prototype.setMap = function(map) {};

/**
 * @param {number} opacity
 * @return {undefined}
 */
google.maps.GroundOverlay.prototype.setOpacity = function(opacity) {};

/**
 * @constructor
 */
google.maps.GroundOverlayOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.GroundOverlayOptions.prototype.clickable;

/**
 * @type {google.maps.Map}
 */
google.maps.GroundOverlayOptions.prototype.map;

/**
 * @type {number}
 */
google.maps.GroundOverlayOptions.prototype.opacity;

/**
 * @constructor
 */
google.maps.IconSequence = function() {};

/**
 * @type {google.maps.Symbol}
 */
google.maps.IconSequence.prototype.icon;

/**
 * @type {string}
 */
google.maps.IconSequence.prototype.offset;

/**
 * @type {string}
 */
google.maps.IconSequence.prototype.repeat;

/**
 * @param {google.maps.ImageMapTypeOptions|Object.<string>} opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.ImageMapType = function(opts) {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.ImageMapType.prototype.getOpacity = function() {};

/**
 * @param {number} opacity
 * @return {undefined}
 */
google.maps.ImageMapType.prototype.setOpacity = function(opacity) {};

/**
 * @constructor
 */
google.maps.ImageMapTypeOptions = function() {};

/**
 * @type {string}
 */
google.maps.ImageMapTypeOptions.prototype.alt;

/**
 * @type {function(google.maps.Point, number):string}
 */
google.maps.ImageMapTypeOptions.prototype.getTileUrl;

/**
 * @type {number}
 */
google.maps.ImageMapTypeOptions.prototype.maxZoom;

/**
 * @type {number}
 */
google.maps.ImageMapTypeOptions.prototype.minZoom;

/**
 * @type {string}
 */
google.maps.ImageMapTypeOptions.prototype.name;

/**
 * @type {number}
 */
google.maps.ImageMapTypeOptions.prototype.opacity;

/**
 * @type {google.maps.Size}
 */
google.maps.ImageMapTypeOptions.prototype.tileSize;

/**
 * @param {(google.maps.InfoWindowOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.InfoWindow = function(opt_opts) {};

/**
 * @return {undefined}
 */
google.maps.InfoWindow.prototype.close = function() {};

/**
 * @nosideeffects
 * @return {string|Node}
 */
google.maps.InfoWindow.prototype.getContent = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.InfoWindow.prototype.getPosition = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.InfoWindow.prototype.getZIndex = function() {};

/**
 * @param {(google.maps.Map|google.maps.StreetViewPanorama)=} opt_map
 * @param {google.maps.MVCObject=} opt_anchor
 * @return {undefined}
 */
google.maps.InfoWindow.prototype.open = function(opt_map, opt_anchor) {};

/**
 * @param {string|Node} content
 * @return {undefined}
 */
google.maps.InfoWindow.prototype.setContent = function(content) {};

/**
 * @param {google.maps.InfoWindowOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.InfoWindow.prototype.setOptions = function(options) {};

/**
 * @param {google.maps.LatLng} position
 * @return {undefined}
 */
google.maps.InfoWindow.prototype.setPosition = function(position) {};

/**
 * @param {number} zIndex
 * @return {undefined}
 */
google.maps.InfoWindow.prototype.setZIndex = function(zIndex) {};

/**
 * @constructor
 */
google.maps.InfoWindowOptions = function() {};

/**
 * @type {string|Node}
 */
google.maps.InfoWindowOptions.prototype.content;

/**
 * @type {boolean}
 */
google.maps.InfoWindowOptions.prototype.disableAutoPan;

/**
 * @type {number}
 */
google.maps.InfoWindowOptions.prototype.maxWidth;

/**
 * @type {google.maps.Size}
 */
google.maps.InfoWindowOptions.prototype.pixelOffset;

/**
 * @type {google.maps.LatLng}
 */
google.maps.InfoWindowOptions.prototype.position;

/**
 * @type {number}
 */
google.maps.InfoWindowOptions.prototype.zIndex;

/**
 * @constructor
 */
google.maps.KmlAuthor = function() {};

/**
 * @type {string}
 */
google.maps.KmlAuthor.prototype.email;

/**
 * @type {string}
 */
google.maps.KmlAuthor.prototype.name;

/**
 * @type {string}
 */
google.maps.KmlAuthor.prototype.uri;

/**
 * @constructor
 */
google.maps.KmlFeatureData = function() {};

/**
 * @type {google.maps.KmlAuthor}
 */
google.maps.KmlFeatureData.prototype.author;

/**
 * @type {string}
 */
google.maps.KmlFeatureData.prototype.description;

/**
 * @type {string}
 */
google.maps.KmlFeatureData.prototype.id;

/**
 * @type {string}
 */
google.maps.KmlFeatureData.prototype.infoWindowHtml;

/**
 * @type {string}
 */
google.maps.KmlFeatureData.prototype.name;

/**
 * @type {string}
 */
google.maps.KmlFeatureData.prototype.snippet;

/**
 * @param {(google.maps.KmlLayerOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.KmlLayer = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLngBounds}
 */
google.maps.KmlLayer.prototype.getDefaultViewport = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.KmlLayer.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {google.maps.KmlLayerMetadata}
 */
google.maps.KmlLayer.prototype.getMetadata = function() {};

/**
 * @nosideeffects
 * @return {google.maps.KmlLayerStatus}
 */
google.maps.KmlLayer.prototype.getStatus = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.KmlLayer.prototype.getUrl = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.KmlLayer.prototype.setMap = function(map) {};

/**
 * @param {string} url
 * @return {undefined}
 */
google.maps.KmlLayer.prototype.setUrl = function(url) {};

/**
 * @constructor
 */
google.maps.KmlLayerMetadata = function() {};

/**
 * @type {google.maps.KmlAuthor}
 */
google.maps.KmlLayerMetadata.prototype.author;

/**
 * @type {string}
 */
google.maps.KmlLayerMetadata.prototype.description;

/**
 * @type {string}
 */
google.maps.KmlLayerMetadata.prototype.name;

/**
 * @type {string}
 */
google.maps.KmlLayerMetadata.prototype.snippet;

/**
 * @constructor
 */
google.maps.KmlLayerOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.KmlLayerOptions.prototype.clickable;

/**
 * @type {google.maps.Map}
 */
google.maps.KmlLayerOptions.prototype.map;

/**
 * @type {boolean}
 */
google.maps.KmlLayerOptions.prototype.preserveViewport;

/**
 * @type {boolean}
 */
google.maps.KmlLayerOptions.prototype.suppressInfoWindows;

/**
 * @type {string}
 */
google.maps.KmlLayerOptions.prototype.url;

/**
 * @enum {number|string}
 */
google.maps.KmlLayerStatus = {
  DOCUMENT_NOT_FOUND: '',
  DOCUMENT_TOO_LARGE: '',
  FETCH_ERROR: '',
  INVALID_DOCUMENT: '',
  INVALID_REQUEST: '',
  LIMITS_EXCEEDED: '',
  OK: '',
  TIMED_OUT: '',
  UNKNOWN: ''
};

/**
 * @constructor
 */
google.maps.KmlMouseEvent = function() {};

/**
 * @type {google.maps.KmlFeatureData}
 */
google.maps.KmlMouseEvent.prototype.featureData;

/**
 * @type {google.maps.LatLng}
 */
google.maps.KmlMouseEvent.prototype.latLng;

/**
 * @type {google.maps.Size}
 */
google.maps.KmlMouseEvent.prototype.pixelOffset;

/**
 * @param {number} lat
 * @param {number} lng
 * @param {boolean=} opt_noWrap
 * @constructor
 */
google.maps.LatLng = function(lat, lng, opt_noWrap) {};

/**
 * @param {google.maps.LatLng} other
 * @return {boolean}
 */
google.maps.LatLng.prototype.equals = function(other) {};

/**
 * @return {number}
 */
google.maps.LatLng.prototype.lat = function() {};

/**
 * @return {number}
 */
google.maps.LatLng.prototype.lng = function() {};

/**
 * @return {string}
 */
google.maps.LatLng.prototype.toString = function() {};

/**
 * @param {number=} opt_precision
 * @return {string}
 */
google.maps.LatLng.prototype.toUrlValue = function(opt_precision) {};

/**
 * @param {google.maps.LatLng=} opt_sw
 * @param {google.maps.LatLng=} opt_ne
 * @constructor
 */
google.maps.LatLngBounds = function(opt_sw, opt_ne) {};

/**
 * @param {google.maps.LatLng} latLng
 * @return {boolean}
 */
google.maps.LatLngBounds.prototype.contains = function(latLng) {};

/**
 * @param {google.maps.LatLngBounds} other
 * @return {boolean}
 */
google.maps.LatLngBounds.prototype.equals = function(other) {};

/**
 * @param {google.maps.LatLng} point
 * @return {google.maps.LatLngBounds}
 */
google.maps.LatLngBounds.prototype.extend = function(point) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.getCenter = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.getNorthEast = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.getSouthWest = function() {};

/**
 * @param {google.maps.LatLngBounds} other
 * @return {boolean}
 */
google.maps.LatLngBounds.prototype.intersects = function(other) {};

/**
 * @return {boolean}
 */
google.maps.LatLngBounds.prototype.isEmpty = function() {};

/**
 * @return {google.maps.LatLng}
 */
google.maps.LatLngBounds.prototype.toSpan = function() {};

/**
 * @return {string}
 */
google.maps.LatLngBounds.prototype.toString = function() {};

/**
 * @param {number=} opt_precision
 * @return {string}
 */
google.maps.LatLngBounds.prototype.toUrlValue = function(opt_precision) {};

/**
 * @param {google.maps.LatLngBounds} other
 * @return {google.maps.LatLngBounds}
 */
google.maps.LatLngBounds.prototype.union = function(other) {};

/**
 * @constructor
 */
google.maps.LocationElevationRequest = function() {};

/**
 * @type {Array.<google.maps.LatLng>}
 */
google.maps.LocationElevationRequest.prototype.locations;

/**
 * @param {Array=} opt_array
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.MVCArray = function(opt_array) {};

/**
 * @return {undefined}
 */
google.maps.MVCArray.prototype.clear = function() {};

/**
 * @param {function(?, number)} callback
 * @return {undefined}
 */
google.maps.MVCArray.prototype.forEach = function(callback) {};

/**
 * @nosideeffects
 * @return {Array}
 */
google.maps.MVCArray.prototype.getArray = function() {};

/**
 * @param {number} i
 * @return {*}
 */
google.maps.MVCArray.prototype.getAt = function(i) {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.MVCArray.prototype.getLength = function() {};

/**
 * @param {number} i
 * @param {*} elem
 * @return {undefined}
 */
google.maps.MVCArray.prototype.insertAt = function(i, elem) {};

/**
 * @return {*}
 */
google.maps.MVCArray.prototype.pop = function() {};

/**
 * @param {*} elem
 * @return {number}
 */
google.maps.MVCArray.prototype.push = function(elem) {};

/**
 * @param {number} i
 * @return {*}
 */
google.maps.MVCArray.prototype.removeAt = function(i) {};

/**
 * @param {number} i
 * @param {*} elem
 * @return {undefined}
 */
google.maps.MVCArray.prototype.setAt = function(i, elem) {};

/**
 * @constructor
 */
google.maps.MVCObject = function() {};

/**
 * @param {string} key
 * @param {google.maps.MVCObject} target
 * @param {?string=} opt_targetKey
 * @param {boolean=} opt_noNotify
 * @return {undefined}
 */
google.maps.MVCObject.prototype.bindTo = function(key, target, opt_targetKey, opt_noNotify) {};

/**
 * @param {string} key
 * @return {undefined}
 */
google.maps.MVCObject.prototype.changed = function(key) {};

/**
 * @param {string} key
 * @return {*}
 */
google.maps.MVCObject.prototype.get = function(key) {};

/**
 * @param {string} key
 * @return {undefined}
 */
google.maps.MVCObject.prototype.notify = function(key) {};

/**
 * @param {string} key
 * @param {?} value
 * @return {undefined}
 */
google.maps.MVCObject.prototype.set = function(key, value) {};

/**
 * @param {Object|undefined} values
 * @return {undefined}
 */
google.maps.MVCObject.prototype.setValues = function(values) {};

/**
 * @param {string} key
 * @return {undefined}
 */
google.maps.MVCObject.prototype.unbind = function(key) {};

/**
 * @return {undefined}
 */
google.maps.MVCObject.prototype.unbindAll = function() {};

/**
 * @param {Node} mapDiv
 * @param {(google.maps.MapOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.Map = function(mapDiv, opt_opts) {};

/**
 * @type {Array.<google.maps.MVCArray.<Node>>}
 */
google.maps.Map.prototype.controls;

/**
 * @type {google.maps.MapTypeRegistry}
 */
google.maps.Map.prototype.mapTypes;

/**
 * @type {google.maps.MVCArray.<google.maps.MapType>}
 */
google.maps.Map.prototype.overlayMapTypes;

/**
 * @param {google.maps.LatLngBounds} bounds
 * @return {undefined}
 */
google.maps.Map.prototype.fitBounds = function(bounds) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLngBounds}
 */
google.maps.Map.prototype.getBounds = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.Map.prototype.getCenter = function() {};

/**
 * @nosideeffects
 * @return {Node}
 */
google.maps.Map.prototype.getDiv = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.Map.prototype.getHeading = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MapTypeId|string}
 */
google.maps.Map.prototype.getMapTypeId = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Projection}
 */
google.maps.Map.prototype.getProjection = function() {};

/**
 * @nosideeffects
 * @return {google.maps.StreetViewPanorama}
 */
google.maps.Map.prototype.getStreetView = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.Map.prototype.getTilt = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.Map.prototype.getZoom = function() {};

/**
 * @param {number} x
 * @param {number} y
 * @return {undefined}
 */
google.maps.Map.prototype.panBy = function(x, y) {};

/**
 * @param {google.maps.LatLng} latLng
 * @return {undefined}
 */
google.maps.Map.prototype.panTo = function(latLng) {};

/**
 * @param {google.maps.LatLngBounds} latLngBounds
 * @return {undefined}
 */
google.maps.Map.prototype.panToBounds = function(latLngBounds) {};

/**
 * @param {google.maps.LatLng} latlng
 * @return {undefined}
 */
google.maps.Map.prototype.setCenter = function(latlng) {};

/**
 * @param {number} heading
 * @return {undefined}
 */
google.maps.Map.prototype.setHeading = function(heading) {};

/**
 * @param {google.maps.MapTypeId|string} mapTypeId
 * @return {undefined}
 */
google.maps.Map.prototype.setMapTypeId = function(mapTypeId) {};

/**
 * @param {google.maps.MapOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.Map.prototype.setOptions = function(options) {};

/**
 * @param {google.maps.StreetViewPanorama} panorama
 * @return {undefined}
 */
google.maps.Map.prototype.setStreetView = function(panorama) {};

/**
 * @param {number} tilt
 * @return {undefined}
 */
google.maps.Map.prototype.setTilt = function(tilt) {};

/**
 * @param {number} zoom
 * @return {undefined}
 */
google.maps.Map.prototype.setZoom = function(zoom) {};

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.MapCanvasProjection = function() {};

/**
 * @param {google.maps.Point} pixel
 * @param {boolean=} opt_nowrap
 * @return {google.maps.LatLng}
 */
google.maps.MapCanvasProjection.prototype.fromContainerPixelToLatLng = function(pixel, opt_nowrap) {};

/**
 * @param {google.maps.Point} pixel
 * @param {boolean=} opt_nowrap
 * @return {google.maps.LatLng}
 */
google.maps.MapCanvasProjection.prototype.fromDivPixelToLatLng = function(pixel, opt_nowrap) {};

/**
 * @param {google.maps.LatLng} latLng
 * @return {google.maps.Point}
 */
google.maps.MapCanvasProjection.prototype.fromLatLngToContainerPixel = function(latLng) {};

/**
 * @param {google.maps.LatLng} latLng
 * @return {google.maps.Point}
 */
google.maps.MapCanvasProjection.prototype.fromLatLngToDivPixel = function(latLng) {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.MapCanvasProjection.prototype.getWorldWidth = function() {};

/**
 * @constructor
 */
google.maps.MapOptions = function() {};

/**
 * @type {string}
 */
google.maps.MapOptions.prototype.backgroundColor;

/**
 * @type {google.maps.LatLng}
 */
google.maps.MapOptions.prototype.center;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.disableDefaultUI;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.disableDoubleClickZoom;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.draggable;

/**
 * @type {string}
 */
google.maps.MapOptions.prototype.draggableCursor;

/**
 * @type {string}
 */
google.maps.MapOptions.prototype.draggingCursor;

/**
 * @type {number}
 */
google.maps.MapOptions.prototype.heading;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.keyboardShortcuts;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.mapMaker;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.mapTypeControl;

/**
 * @type {google.maps.MapTypeControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.mapTypeControlOptions;

/**
 * @type {google.maps.MapTypeId}
 */
google.maps.MapOptions.prototype.mapTypeId;

/**
 * @type {number}
 */
google.maps.MapOptions.prototype.maxZoom;

/**
 * @type {number}
 */
google.maps.MapOptions.prototype.minZoom;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.noClear;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.overviewMapControl;

/**
 * @type {google.maps.OverviewMapControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.overviewMapControlOptions;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.panControl;

/**
 * @type {google.maps.PanControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.panControlOptions;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.rotateControl;

/**
 * @type {google.maps.RotateControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.rotateControlOptions;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.scaleControl;

/**
 * @type {google.maps.ScaleControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.scaleControlOptions;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.scrollwheel;

/**
 * @type {google.maps.StreetViewPanorama}
 */
google.maps.MapOptions.prototype.streetView;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.streetViewControl;

/**
 * @type {google.maps.StreetViewControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.streetViewControlOptions;

/**
 * @type {Array.<google.maps.MapTypeStyle>}
 */
google.maps.MapOptions.prototype.styles;

/**
 * @type {number}
 */
google.maps.MapOptions.prototype.tilt;

/**
 * @type {number}
 */
google.maps.MapOptions.prototype.zoom;

/**
 * @type {boolean}
 */
google.maps.MapOptions.prototype.zoomControl;

/**
 * @type {google.maps.ZoomControlOptions|Object.<string>}
 */
google.maps.MapOptions.prototype.zoomControlOptions;

/**
 * @constructor
 */
google.maps.MapPanes = function() {};

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.floatPane;

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.floatShadow;

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.mapPane;

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.overlayImage;

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.overlayLayer;

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.overlayMouseTarget;

/**
 * @type {Node}
 */
google.maps.MapPanes.prototype.overlayShadow;

/**
 * @constructor
 */
google.maps.MapType = function() {};

/**
 * @type {string}
 */
google.maps.MapType.prototype.alt;

/**
 * @type {number}
 */
google.maps.MapType.prototype.maxZoom;

/**
 * @type {number}
 */
google.maps.MapType.prototype.minZoom;

/**
 * @type {string}
 */
google.maps.MapType.prototype.name;

/**
 * @type {google.maps.Projection}
 */
google.maps.MapType.prototype.projection;

/**
 * @type {number}
 */
google.maps.MapType.prototype.radius;

/**
 * @type {google.maps.Size}
 */
google.maps.MapType.prototype.tileSize;

/**
 * @param {google.maps.Point} tileCoord
 * @param {number} zoom
 * @param {Document} ownerDocument
 * @return {Node}
 */
google.maps.MapType.prototype.getTile = function(tileCoord, zoom, ownerDocument) {};

/**
 * @param {Node} tile
 * @return {undefined}
 */
google.maps.MapType.prototype.releaseTile = function(tile) {};

/**
 * @constructor
 */
google.maps.MapTypeControlOptions = function() {};

/**
 * @type {Array.<google.maps.MapTypeId>|Array.<string>}
 */
google.maps.MapTypeControlOptions.prototype.mapTypeIds;

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.MapTypeControlOptions.prototype.position;

/**
 * @type {google.maps.MapTypeControlStyle}
 */
google.maps.MapTypeControlOptions.prototype.style;

/**
 * @enum {number|string}
 */
google.maps.MapTypeControlStyle = {
  DEFAULT: '',
  DROPDOWN_MENU: '',
  HORIZONTAL_BAR: ''
};

/**
 * @enum {number|string}
 */
google.maps.MapTypeId = {
  HYBRID: '',
  ROADMAP: '',
  SATELLITE: '',
  TERRAIN: ''
};

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.MapTypeRegistry = function() {};

/**
 * @param {string} id
 * @param {google.maps.MapType} mapType
 * @return {undefined}
 * @override
 */
google.maps.MapTypeRegistry.prototype.set = function(id, mapType) {};

/**
 * @constructor
 */
google.maps.MapTypeStyle = function() {};

/**
 * @type {string}
 */
google.maps.MapTypeStyle.prototype.elementType;

/**
 * @type {string}
 */
google.maps.MapTypeStyle.prototype.featureType;

/**
 * @type {Array.<google.maps.MapTypeStyler>}
 */
google.maps.MapTypeStyle.prototype.stylers;

/**
 * @constructor
 */
google.maps.MapTypeStyler = function() {};

/**
 * @type {number}
 */
google.maps.MapTypeStyler.prototype.gamma;

/**
 * @type {string}
 */
google.maps.MapTypeStyler.prototype.hue;

/**
 * @type {boolean}
 */
google.maps.MapTypeStyler.prototype.invert_lightness;

/**
 * @type {number}
 */
google.maps.MapTypeStyler.prototype.lightness;

/**
 * @type {number}
 */
google.maps.MapTypeStyler.prototype.saturation;

/**
 * @type {string}
 */
google.maps.MapTypeStyler.prototype.visibility;

/**
 * @constructor
 */
google.maps.MapsEventListener = function() {};

/**
 * @param {(google.maps.MarkerOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.Marker = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {?google.maps.Animation}
 */
google.maps.Marker.prototype.getAnimation = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Marker.prototype.getClickable = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.Marker.prototype.getCursor = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Marker.prototype.getDraggable = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Marker.prototype.getFlat = function() {};

/**
 * @nosideeffects
 * @return {string|google.maps.MarkerImage}
 */
google.maps.Marker.prototype.getIcon = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map|google.maps.StreetViewPanorama}
 */
google.maps.Marker.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.Marker.prototype.getPosition = function() {};

/**
 * @nosideeffects
 * @return {string|google.maps.MarkerImage}
 */
google.maps.Marker.prototype.getShadow = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MarkerShape}
 */
google.maps.Marker.prototype.getShape = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.Marker.prototype.getTitle = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Marker.prototype.getVisible = function() {};

/**
 * @nosideeffects
 * @return {number}
 */
google.maps.Marker.prototype.getZIndex = function() {};

/**
 * @param {?google.maps.Animation} animation
 * @return {undefined}
 */
google.maps.Marker.prototype.setAnimation = function(animation) {};

/**
 * @param {boolean} flag
 * @return {undefined}
 */
google.maps.Marker.prototype.setClickable = function(flag) {};

/**
 * @param {string} cursor
 * @return {undefined}
 */
google.maps.Marker.prototype.setCursor = function(cursor) {};

/**
 * @param {?boolean} flag
 * @return {undefined}
 */
google.maps.Marker.prototype.setDraggable = function(flag) {};

/**
 * @param {boolean} flag
 * @return {undefined}
 */
google.maps.Marker.prototype.setFlat = function(flag) {};

/**
 * @param {string|google.maps.MarkerImage} icon
 * @return {undefined}
 */
google.maps.Marker.prototype.setIcon = function(icon) {};

/**
 * @param {google.maps.Map|google.maps.StreetViewPanorama} map
 * @return {undefined}
 */
google.maps.Marker.prototype.setMap = function(map) {};

/**
 * @param {google.maps.MarkerOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.Marker.prototype.setOptions = function(options) {};

/**
 * @param {google.maps.LatLng} latlng
 * @return {undefined}
 */
google.maps.Marker.prototype.setPosition = function(latlng) {};

/**
 * @param {string|google.maps.MarkerImage} shadow
 * @return {undefined}
 */
google.maps.Marker.prototype.setShadow = function(shadow) {};

/**
 * @param {google.maps.MarkerShape} shape
 * @return {undefined}
 */
google.maps.Marker.prototype.setShape = function(shape) {};

/**
 * @param {string} title
 * @return {undefined}
 */
google.maps.Marker.prototype.setTitle = function(title) {};

/**
 * @param {boolean} visible
 * @return {undefined}
 */
google.maps.Marker.prototype.setVisible = function(visible) {};

/**
 * @param {number} zIndex
 * @return {undefined}
 */
google.maps.Marker.prototype.setZIndex = function(zIndex) {};

/**
 * @constant
 * @type {number|string}
 */
google.maps.Marker.MAX_ZINDEX;

/**
 * @param {string} url
 * @param {google.maps.Size=} opt_size
 * @param {google.maps.Point=} opt_origin
 * @param {google.maps.Point=} opt_anchor
 * @param {google.maps.Size=} opt_scaledSize
 * @constructor
 */
google.maps.MarkerImage = function(url, opt_size, opt_origin, opt_anchor, opt_scaledSize) {};

/**
 * @type {google.maps.Point}
 */
google.maps.MarkerImage.prototype.anchor;

/**
 * @type {google.maps.Point}
 */
google.maps.MarkerImage.prototype.origin;

/**
 * @type {google.maps.Size}
 */
google.maps.MarkerImage.prototype.scaledSize;

/**
 * @type {google.maps.Size}
 */
google.maps.MarkerImage.prototype.size;

/**
 * @type {string}
 */
google.maps.MarkerImage.prototype.url;

/**
 * @constructor
 */
google.maps.MarkerOptions = function() {};

/**
 * @type {google.maps.Animation}
 */
google.maps.MarkerOptions.prototype.animation;

/**
 * @type {boolean}
 */
google.maps.MarkerOptions.prototype.clickable;

/**
 * @type {string}
 */
google.maps.MarkerOptions.prototype.cursor;

/**
 * @type {boolean}
 */
google.maps.MarkerOptions.prototype.draggable;

/**
 * @type {boolean}
 */
google.maps.MarkerOptions.prototype.flat;

/**
 * @type {string|google.maps.MarkerImage|google.maps.Symbol}
 */
google.maps.MarkerOptions.prototype.icon;

/**
 * @type {google.maps.Map|google.maps.StreetViewPanorama}
 */
google.maps.MarkerOptions.prototype.map;

/**
 * @type {boolean}
 */
google.maps.MarkerOptions.prototype.optimized;

/**
 * @type {google.maps.LatLng}
 */
google.maps.MarkerOptions.prototype.position;

/**
 * @type {boolean}
 */
google.maps.MarkerOptions.prototype.raiseOnDrag;

/**
 * @type {string|google.maps.MarkerImage|google.maps.Symbol}
 */
google.maps.MarkerOptions.prototype.shadow;

/**
 * @type {google.maps.MarkerShape}
 */
google.maps.MarkerOptions.prototype.shape;

/**
 * @type {string}
 */
google.maps.MarkerOptions.prototype.title;

/**
 * @type {boolean}
 */
google.maps.MarkerOptions.prototype.visible;

/**
 * @type {number}
 */
google.maps.MarkerOptions.prototype.zIndex;

/**
 * @constructor
 */
google.maps.MarkerShape = function() {};

/**
 * @type {Array.<number>}
 */
google.maps.MarkerShape.prototype.coords;

/**
 * @type {string}
 */
google.maps.MarkerShape.prototype.type;

/**
 * @constructor
 */
google.maps.MaxZoomResult = function() {};

/**
 * @type {google.maps.MaxZoomStatus}
 */
google.maps.MaxZoomResult.prototype.status;

/**
 * @type {number}
 */
google.maps.MaxZoomResult.prototype.zoom;

/**
 * @constructor
 */
google.maps.MaxZoomService = function() {};

/**
 * @param {google.maps.LatLng} latlng
 * @param {function(google.maps.MaxZoomResult)} callback
 * @return {undefined}
 */
google.maps.MaxZoomService.prototype.getMaxZoomAtLatLng = function(latlng, callback) {};

/**
 * @enum {number|string}
 */
google.maps.MaxZoomStatus = {
  ERROR: '',
  OK: ''
};

/**
 * @constructor
 */
google.maps.MouseEvent = function() {};

/**
 * @type {google.maps.LatLng}
 */
google.maps.MouseEvent.prototype.latLng;

/**
 * @return {undefined}
 */
google.maps.MouseEvent.prototype.stop = function() {};

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.OverlayView = function() {};

/**
 * @return {undefined}
 */
google.maps.OverlayView.prototype.draw = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.OverlayView.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MapPanes}
 */
google.maps.OverlayView.prototype.getPanes = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MapCanvasProjection}
 */
google.maps.OverlayView.prototype.getProjection = function() {};

/**
 * @return {undefined}
 */
google.maps.OverlayView.prototype.onAdd = function() {};

/**
 * @return {undefined}
 */
google.maps.OverlayView.prototype.onRemove = function() {};

/**
 * @param {google.maps.Map|google.maps.StreetViewPanorama} map
 * @return {undefined}
 */
google.maps.OverlayView.prototype.setMap = function(map) {};

/**
 * @constructor
 */
google.maps.OverviewMapControlOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.OverviewMapControlOptions.prototype.opened;

/**
 * @constructor
 */
google.maps.PanControlOptions = function() {};

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.PanControlOptions.prototype.position;

/**
 * @constructor
 */
google.maps.PathElevationRequest = function() {};

/**
 * @type {Array.<google.maps.LatLng>}
 */
google.maps.PathElevationRequest.prototype.path;

/**
 * @type {number}
 */
google.maps.PathElevationRequest.prototype.samples;

/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
google.maps.Point = function(x, y) {};

/**
 * @type {number}
 */
google.maps.Point.prototype.x;

/**
 * @type {number}
 */
google.maps.Point.prototype.y;

/**
 * @param {google.maps.Point} other
 * @return {boolean}
 */
google.maps.Point.prototype.equals = function(other) {};

/**
 * @return {string}
 */
google.maps.Point.prototype.toString = function() {};

/**
 * @extends {google.maps.MouseEvent}
 * @constructor
 */
google.maps.PolyMouseEvent = function() {};

/**
 * @type {number}
 */
google.maps.PolyMouseEvent.prototype.edge;

/**
 * @type {number}
 */
google.maps.PolyMouseEvent.prototype.path;

/**
 * @type {number}
 */
google.maps.PolyMouseEvent.prototype.vertex;

/**
 * @param {(google.maps.PolygonOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.Polygon = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Polygon.prototype.getEditable = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.Polygon.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MVCArray.<google.maps.LatLng>}
 */
google.maps.Polygon.prototype.getPath = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MVCArray.<google.maps.MVCArray.<google.maps.LatLng>>}
 */
google.maps.Polygon.prototype.getPaths = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Polygon.prototype.getVisible = function() {};

/**
 * @param {boolean} editable
 * @return {undefined}
 */
google.maps.Polygon.prototype.setEditable = function(editable) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.Polygon.prototype.setMap = function(map) {};

/**
 * @param {google.maps.PolygonOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.Polygon.prototype.setOptions = function(options) {};

/**
 * @param {google.maps.MVCArray.<google.maps.LatLng>|Array.<google.maps.LatLng>} path
 * @return {undefined}
 */
google.maps.Polygon.prototype.setPath = function(path) {};

/**
 * @param {google.maps.MVCArray.<google.maps.MVCArray.<google.maps.LatLng>>|google.maps.MVCArray.<google.maps.LatLng>|Array.<Array.<google.maps.LatLng>>|Array.<google.maps.LatLng>} paths
 * @return {undefined}
 */
google.maps.Polygon.prototype.setPaths = function(paths) {};

/**
 * @param {boolean} visible
 * @return {undefined}
 */
google.maps.Polygon.prototype.setVisible = function(visible) {};

/**
 * @constructor
 */
google.maps.PolygonOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.PolygonOptions.prototype.clickable;

/**
 * @type {boolean}
 */
google.maps.PolygonOptions.prototype.editable;

/**
 * @type {string}
 */
google.maps.PolygonOptions.prototype.fillColor;

/**
 * @type {number}
 */
google.maps.PolygonOptions.prototype.fillOpacity;

/**
 * @type {boolean}
 */
google.maps.PolygonOptions.prototype.geodesic;

/**
 * @type {google.maps.Map}
 */
google.maps.PolygonOptions.prototype.map;

/**
 * @type {google.maps.MVCArray.<google.maps.MVCArray.<google.maps.LatLng>>|google.maps.MVCArray.<google.maps.LatLng>|Array.<Array.<google.maps.LatLng>>|Array.<google.maps.LatLng>}
 */
google.maps.PolygonOptions.prototype.paths;

/**
 * @type {string}
 */
google.maps.PolygonOptions.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.PolygonOptions.prototype.strokeOpacity;

/**
 * @type {google.maps.StrokePosition}
 */
google.maps.PolygonOptions.prototype.strokePosition;

/**
 * @type {number}
 */
google.maps.PolygonOptions.prototype.strokeWeight;

/**
 * @type {boolean}
 */
google.maps.PolygonOptions.prototype.visible;

/**
 * @type {number}
 */
google.maps.PolygonOptions.prototype.zIndex;

/**
 * @param {(google.maps.PolylineOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.Polyline = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Polyline.prototype.getEditable = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.Polyline.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {google.maps.MVCArray.<google.maps.LatLng>}
 */
google.maps.Polyline.prototype.getPath = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Polyline.prototype.getVisible = function() {};

/**
 * @param {boolean} editable
 * @return {undefined}
 */
google.maps.Polyline.prototype.setEditable = function(editable) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.Polyline.prototype.setMap = function(map) {};

/**
 * @param {google.maps.PolylineOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.Polyline.prototype.setOptions = function(options) {};

/**
 * @param {google.maps.MVCArray.<google.maps.LatLng>|Array.<google.maps.LatLng>} path
 * @return {undefined}
 */
google.maps.Polyline.prototype.setPath = function(path) {};

/**
 * @param {boolean} visible
 * @return {undefined}
 */
google.maps.Polyline.prototype.setVisible = function(visible) {};

/**
 * @constructor
 */
google.maps.PolylineOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.PolylineOptions.prototype.clickable;

/**
 * @type {boolean}
 */
google.maps.PolylineOptions.prototype.editable;

/**
 * @type {boolean}
 */
google.maps.PolylineOptions.prototype.geodesic;

/**
 * @type {Array.<google.maps.IconSequence>}
 */
google.maps.PolylineOptions.prototype.icons;

/**
 * @type {google.maps.Map}
 */
google.maps.PolylineOptions.prototype.map;

/**
 * @type {google.maps.MVCArray.<google.maps.LatLng>|Array.<google.maps.LatLng>}
 */
google.maps.PolylineOptions.prototype.path;

/**
 * @type {string}
 */
google.maps.PolylineOptions.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.PolylineOptions.prototype.strokeOpacity;

/**
 * @type {number}
 */
google.maps.PolylineOptions.prototype.strokeWeight;

/**
 * @type {boolean}
 */
google.maps.PolylineOptions.prototype.visible;

/**
 * @type {number}
 */
google.maps.PolylineOptions.prototype.zIndex;

/**
 * @constructor
 */
google.maps.Projection = function() {};

/**
 * @param {google.maps.LatLng} latLng
 * @param {google.maps.Point=} opt_point
 * @return {google.maps.Point}
 */
google.maps.Projection.prototype.fromLatLngToPoint = function(latLng, opt_point) {};

/**
 * @param {google.maps.Point} pixel
 * @param {boolean=} opt_nowrap
 * @return {google.maps.LatLng}
 */
google.maps.Projection.prototype.fromPointToLatLng = function(pixel, opt_nowrap) {};

/**
 * @param {(google.maps.RectangleOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.Rectangle = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLngBounds}
 */
google.maps.Rectangle.prototype.getBounds = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Rectangle.prototype.getEditable = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.Rectangle.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.Rectangle.prototype.getVisible = function() {};

/**
 * @param {google.maps.LatLngBounds} bounds
 * @return {undefined}
 */
google.maps.Rectangle.prototype.setBounds = function(bounds) {};

/**
 * @param {boolean} editable
 * @return {undefined}
 */
google.maps.Rectangle.prototype.setEditable = function(editable) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.Rectangle.prototype.setMap = function(map) {};

/**
 * @param {google.maps.RectangleOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.Rectangle.prototype.setOptions = function(options) {};

/**
 * @param {boolean} visible
 * @return {undefined}
 */
google.maps.Rectangle.prototype.setVisible = function(visible) {};

/**
 * @constructor
 */
google.maps.RectangleOptions = function() {};

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.RectangleOptions.prototype.bounds;

/**
 * @type {boolean}
 */
google.maps.RectangleOptions.prototype.clickable;

/**
 * @type {boolean}
 */
google.maps.RectangleOptions.prototype.editable;

/**
 * @type {string}
 */
google.maps.RectangleOptions.prototype.fillColor;

/**
 * @type {number}
 */
google.maps.RectangleOptions.prototype.fillOpacity;

/**
 * @type {google.maps.Map}
 */
google.maps.RectangleOptions.prototype.map;

/**
 * @type {string}
 */
google.maps.RectangleOptions.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.RectangleOptions.prototype.strokeOpacity;

/**
 * @type {google.maps.StrokePosition}
 */
google.maps.RectangleOptions.prototype.strokePosition;

/**
 * @type {number}
 */
google.maps.RectangleOptions.prototype.strokeWeight;

/**
 * @type {boolean}
 */
google.maps.RectangleOptions.prototype.visible;

/**
 * @type {number}
 */
google.maps.RectangleOptions.prototype.zIndex;

/**
 * @constructor
 */
google.maps.RotateControlOptions = function() {};

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.RotateControlOptions.prototype.position;

/**
 * @constructor
 */
google.maps.ScaleControlOptions = function() {};

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.ScaleControlOptions.prototype.position;

/**
 * @type {google.maps.ScaleControlStyle}
 */
google.maps.ScaleControlOptions.prototype.style;

/**
 * @enum {number|string}
 */
google.maps.ScaleControlStyle = {
  DEFAULT: ''
};

/**
 * @param {number} width
 * @param {number} height
 * @param {string=} opt_widthUnit
 * @param {string=} opt_heightUnit
 * @constructor
 */
google.maps.Size = function(width, height, opt_widthUnit, opt_heightUnit) {};

/**
 * @type {number}
 */
google.maps.Size.prototype.height;

/**
 * @type {number}
 */
google.maps.Size.prototype.width;

/**
 * @param {google.maps.Size} other
 * @return {boolean}
 */
google.maps.Size.prototype.equals = function(other) {};

/**
 * @return {string}
 */
google.maps.Size.prototype.toString = function() {};

/**
 * @constructor
 */
google.maps.StreetViewAddressControlOptions = function() {};

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.StreetViewAddressControlOptions.prototype.position;

/**
 * @constructor
 */
google.maps.StreetViewControlOptions = function() {};

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.StreetViewControlOptions.prototype.position;

/**
 * @constructor
 */
google.maps.StreetViewLink = function() {};

/**
 * @type {string}
 */
google.maps.StreetViewLink.prototype.description;

/**
 * @type {number}
 */
google.maps.StreetViewLink.prototype.heading;

/**
 * @type {string}
 */
google.maps.StreetViewLink.prototype.pano;

/**
 * @constructor
 */
google.maps.StreetViewLocation = function() {};

/**
 * @type {string}
 */
google.maps.StreetViewLocation.prototype.description;

/**
 * @type {google.maps.LatLng}
 */
google.maps.StreetViewLocation.prototype.latLng;

/**
 * @type {string}
 */
google.maps.StreetViewLocation.prototype.pano;

/**
 * @param {Node} container
 * @param {(google.maps.StreetViewPanoramaOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.StreetViewPanorama = function(container, opt_opts) {};

/**
 * @type {Array.<google.maps.MVCArray.<Node>>}
 */
google.maps.StreetViewPanorama.prototype.controls;

/**
 * @nosideeffects
 * @return {Array.<google.maps.StreetViewLink>}
 */
google.maps.StreetViewPanorama.prototype.getLinks = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.StreetViewPanorama.prototype.getPano = function() {};

/**
 * @nosideeffects
 * @return {google.maps.LatLng}
 */
google.maps.StreetViewPanorama.prototype.getPosition = function() {};

/**
 * @nosideeffects
 * @return {google.maps.StreetViewPov}
 */
google.maps.StreetViewPanorama.prototype.getPov = function() {};

/**
 * @nosideeffects
 * @return {boolean}
 */
google.maps.StreetViewPanorama.prototype.getVisible = function() {};

/**
 * @param {function(string):google.maps.StreetViewPanoramaData} provider
 * @return {undefined}
 */
google.maps.StreetViewPanorama.prototype.registerPanoProvider = function(provider) {};

/**
 * @param {string} pano
 * @return {undefined}
 */
google.maps.StreetViewPanorama.prototype.setPano = function(pano) {};

/**
 * @param {google.maps.LatLng} latLng
 * @return {undefined}
 */
google.maps.StreetViewPanorama.prototype.setPosition = function(latLng) {};

/**
 * @param {google.maps.StreetViewPov} pov
 * @return {undefined}
 */
google.maps.StreetViewPanorama.prototype.setPov = function(pov) {};

/**
 * @param {boolean} flag
 * @return {undefined}
 */
google.maps.StreetViewPanorama.prototype.setVisible = function(flag) {};

/**
 * @constructor
 */
google.maps.StreetViewPanoramaData = function() {};

/**
 * @type {string}
 */
google.maps.StreetViewPanoramaData.prototype.copyright;

/**
 * @type {string}
 */
google.maps.StreetViewPanoramaData.prototype.imageDate;

/**
 * @type {Array.<google.maps.StreetViewLink>}
 */
google.maps.StreetViewPanoramaData.prototype.links;

/**
 * @type {google.maps.StreetViewLocation}
 */
google.maps.StreetViewPanoramaData.prototype.location;

/**
 * @type {google.maps.StreetViewTileData}
 */
google.maps.StreetViewPanoramaData.prototype.tiles;

/**
 * @constructor
 */
google.maps.StreetViewPanoramaOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.addressControl;

/**
 * @type {google.maps.StreetViewAddressControlOptions|Object.<string>}
 */
google.maps.StreetViewPanoramaOptions.prototype.addressControlOptions;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.clickToGo;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.disableDoubleClickZoom;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.enableCloseButton;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.imageDateControl;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.linksControl;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.panControl;

/**
 * @type {google.maps.PanControlOptions|Object.<string>}
 */
google.maps.StreetViewPanoramaOptions.prototype.panControlOptions;

/**
 * @type {string}
 */
google.maps.StreetViewPanoramaOptions.prototype.pano;

/**
 * @type {function(string):google.maps.StreetViewPanoramaData}
 */
google.maps.StreetViewPanoramaOptions.prototype.panoProvider;

/**
 * @type {google.maps.LatLng}
 */
google.maps.StreetViewPanoramaOptions.prototype.position;

/**
 * @type {google.maps.StreetViewPov}
 */
google.maps.StreetViewPanoramaOptions.prototype.pov;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.scrollwheel;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.visible;

/**
 * @type {boolean}
 */
google.maps.StreetViewPanoramaOptions.prototype.zoomControl;

/**
 * @type {google.maps.ZoomControlOptions|Object.<string>}
 */
google.maps.StreetViewPanoramaOptions.prototype.zoomControlOptions;

/**
 * @constructor
 */
google.maps.StreetViewPov = function() {};

/**
 * @type {number}
 */
google.maps.StreetViewPov.prototype.heading;

/**
 * @type {number}
 */
google.maps.StreetViewPov.prototype.pitch;

/**
 * @type {number}
 */
google.maps.StreetViewPov.prototype.zoom;

/**
 * @constructor
 */
google.maps.StreetViewService = function() {};

/**
 * @param {string} pano
 * @param {function(google.maps.StreetViewPanoramaData, google.maps.StreetViewStatus)} callback
 * @return {undefined}
 */
google.maps.StreetViewService.prototype.getPanoramaById = function(pano, callback) {};

/**
 * @param {google.maps.LatLng} latlng
 * @param {number} radius
 * @param {function(google.maps.StreetViewPanoramaData, google.maps.StreetViewStatus)} callback
 * @return {undefined}
 */
google.maps.StreetViewService.prototype.getPanoramaByLocation = function(latlng, radius, callback) {};

/**
 * @enum {number|string}
 */
google.maps.StreetViewStatus = {
  OK: '',
  UNKNOWN_ERROR: '',
  ZERO_RESULTS: ''
};

/**
 * @constructor
 */
google.maps.StreetViewTileData = function() {};

/**
 * @type {number}
 */
google.maps.StreetViewTileData.prototype.centerHeading;

/**
 * @type {google.maps.Size}
 */
google.maps.StreetViewTileData.prototype.tileSize;

/**
 * @type {google.maps.Size}
 */
google.maps.StreetViewTileData.prototype.worldSize;

/**
 * @param {string} pano
 * @param {number} tileZoom
 * @param {number} tileX
 * @param {number} tileY
 * @return {string}
 */
google.maps.StreetViewTileData.prototype.getTileUrl = function(pano, tileZoom, tileX, tileY) {};

/**
 * @enum {number|string}
 */
google.maps.StrokePosition = {
  CENTER: '',
  INSIDE: '',
  OUTSIDE: ''
};

/**
 * @param {Array.<google.maps.MapTypeStyle>} styles
 * @param {(google.maps.StyledMapTypeOptions|Object.<string>)=} opt_options
 * @constructor
 */
google.maps.StyledMapType = function(styles, opt_options) {};

/**
 * @constructor
 */
google.maps.StyledMapTypeOptions = function() {};

/**
 * @type {string}
 */
google.maps.StyledMapTypeOptions.prototype.alt;

/**
 * @type {number}
 */
google.maps.StyledMapTypeOptions.prototype.maxZoom;

/**
 * @type {number}
 */
google.maps.StyledMapTypeOptions.prototype.minZoom;

/**
 * @type {string}
 */
google.maps.StyledMapTypeOptions.prototype.name;

/**
 * @constructor
 */
google.maps.Symbol = function() {};

/**
 * @type {google.maps.Point}
 */
google.maps.Symbol.prototype.anchor;

/**
 * @type {string}
 */
google.maps.Symbol.prototype.fillColor;

/**
 * @type {number}
 */
google.maps.Symbol.prototype.fillOpacity;

/**
 * @type {google.maps.SymbolPath|string}
 */
google.maps.Symbol.prototype.path;

/**
 * @type {number}
 */
google.maps.Symbol.prototype.rotation;

/**
 * @type {number}
 */
google.maps.Symbol.prototype.scale;

/**
 * @type {string}
 */
google.maps.Symbol.prototype.strokeColor;

/**
 * @type {number}
 */
google.maps.Symbol.prototype.strokeOpacity;

/**
 * @type {number}
 */
google.maps.Symbol.prototype.strokeWeight;

/**
 * @enum {number|string}
 */
google.maps.SymbolPath = {
  BACKWARD_CLOSED_ARROW: '',
  BACKWARD_OPEN_ARROW: '',
  CIRCLE: '',
  FORWARD_CLOSED_ARROW: '',
  FORWARD_OPEN_ARROW: ''
};

/**
 * @constructor
 */
google.maps.Time = function() {};

/**
 * @type {string}
 */
google.maps.Time.prototype.text;

/**
 * @type {string}
 */
google.maps.Time.prototype.time_zone;

/**
 * @type {Date}
 */
google.maps.Time.prototype.value;

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.TrafficLayer = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.TrafficLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.TrafficLayer.prototype.setMap = function(map) {};

/**
 * @constructor
 */
google.maps.TransitAgency = function() {};

/**
 * @type {string}
 */
google.maps.TransitAgency.prototype.name;

/**
 * @type {string}
 */
google.maps.TransitAgency.prototype.phone;

/**
 * @type {string}
 */
google.maps.TransitAgency.prototype.url;

/**
 * @constructor
 */
google.maps.TransitDetails = function() {};

/**
 * @type {google.maps.TransitStop}
 */
google.maps.TransitDetails.prototype.arrival_stop;

/**
 * @type {google.maps.Time}
 */
google.maps.TransitDetails.prototype.arrival_time;

/**
 * @type {google.maps.TransitStop}
 */
google.maps.TransitDetails.prototype.departure_stop;

/**
 * @type {google.maps.Time}
 */
google.maps.TransitDetails.prototype.departure_time;

/**
 * @type {string}
 */
google.maps.TransitDetails.prototype.headsign;

/**
 * @type {number}
 */
google.maps.TransitDetails.prototype.headway;

/**
 * @type {google.maps.TransitLine}
 */
google.maps.TransitDetails.prototype.line;

/**
 * @type {number}
 */
google.maps.TransitDetails.prototype.num_stops;

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.TransitLayer = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.TransitLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.TransitLayer.prototype.setMap = function(map) {};

/**
 * @constructor
 */
google.maps.TransitLine = function() {};

/**
 * @type {Array.<google.maps.TransitAgency>}
 */
google.maps.TransitLine.prototype.agencies;

/**
 * @type {string}
 */
google.maps.TransitLine.prototype.color;

/**
 * @type {string}
 */
google.maps.TransitLine.prototype.icon;

/**
 * @type {string}
 */
google.maps.TransitLine.prototype.name;

/**
 * @type {string}
 */
google.maps.TransitLine.prototype.short_name;

/**
 * @type {string}
 */
google.maps.TransitLine.prototype.text_color;

/**
 * @type {string}
 */
google.maps.TransitLine.prototype.url;

/**
 * @type {google.maps.TransitVehicle}
 */
google.maps.TransitLine.prototype.vehicle;

/**
 * @constructor
 */
google.maps.TransitOptions = function() {};

/**
 * @type {Date}
 */
google.maps.TransitOptions.prototype.arrivalTime;

/**
 * @type {Date}
 */
google.maps.TransitOptions.prototype.departureTime;

/**
 * @constructor
 */
google.maps.TransitStop = function() {};

/**
 * @type {google.maps.LatLng}
 */
google.maps.TransitStop.prototype.location;

/**
 * @type {string}
 */
google.maps.TransitStop.prototype.name;

/**
 * @constructor
 */
google.maps.TransitVehicle = function() {};

/**
 * @type {string}
 */
google.maps.TransitVehicle.prototype.icon;

/**
 * @type {string}
 */
google.maps.TransitVehicle.prototype.local_icon;

/**
 * @type {string}
 */
google.maps.TransitVehicle.prototype.name;

/**
 * @enum {number|string}
 */
google.maps.TravelMode = {
  BICYCLING: '',
  DRIVING: '',
  TRANSIT: '',
  WALKING: ''
};

/**
 * @enum {number|string}
 */
google.maps.UnitSystem = {
  IMPERIAL: '',
  METRIC: ''
};

/**
 * @constructor
 */
google.maps.ZoomControlOptions = function() {};

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.ZoomControlOptions.prototype.position;

/**
 * @type {google.maps.ZoomControlStyle}
 */
google.maps.ZoomControlOptions.prototype.style;

/**
 * @enum {number|string}
 */
google.maps.ZoomControlStyle = {
  DEFAULT: '',
  LARGE: '',
  SMALL: ''
};

// Namespace
google.maps.adsense = {};

/**
 * @enum {number|string}
 */
google.maps.adsense.AdFormat = {
  BANNER: '',
  BUTTON: '',
  HALF_BANNER: '',
  LARGE_HORIZONTAL_LINK_UNIT: '',
  LARGE_RECTANGLE: '',
  LARGE_VERTICAL_LINK_UNIT: '',
  LEADERBOARD: '',
  MEDIUM_RECTANGLE: '',
  MEDIUM_VERTICAL_LINK_UNIT: '',
  SKYSCRAPER: '',
  SMALL_HORIZONTAL_LINK_UNIT: '',
  SMALL_RECTANGLE: '',
  SMALL_SQUARE: '',
  SMALL_VERTICAL_LINK_UNIT: '',
  SQUARE: '',
  VERTICAL_BANNER: '',
  WIDE_SKYSCRAPER: '',
  X_LARGE_VERTICAL_LINK_UNIT: ''
};

/**
 * @param {Node} container
 * @param {google.maps.adsense.AdUnitOptions|Object.<string>} opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.adsense.AdUnit = function(container, opts) {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getBackgroundColor = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getBorderColor = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getChannelNumber = function() {};

/**
 * @nosideeffects
 * @return {Node}
 */
google.maps.adsense.AdUnit.prototype.getContainer = function() {};

/**
 * @nosideeffects
 * @return {google.maps.adsense.AdFormat}
 */
google.maps.adsense.AdUnit.prototype.getFormat = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.adsense.AdUnit.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {google.maps.ControlPosition}
 */
google.maps.adsense.AdUnit.prototype.getPosition = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getPublisherId = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getTextColor = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getTitleColor = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.getUrlColor = function() {};

/**
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.setBackgroundColor = function() {};

/**
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.setBorderColor = function() {};

/**
 * @param {string} channelNumber
 * @return {undefined}
 */
google.maps.adsense.AdUnit.prototype.setChannelNumber = function(channelNumber) {};

/**
 * @param {google.maps.adsense.AdFormat} format
 * @return {undefined}
 */
google.maps.adsense.AdUnit.prototype.setFormat = function(format) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.adsense.AdUnit.prototype.setMap = function(map) {};

/**
 * @param {google.maps.ControlPosition} position
 * @return {undefined}
 */
google.maps.adsense.AdUnit.prototype.setPosition = function(position) {};

/**
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.setTextColor = function() {};

/**
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.setTitleColor = function() {};

/**
 * @return {string}
 */
google.maps.adsense.AdUnit.prototype.setUrlColor = function() {};

/**
 * @constructor
 */
google.maps.adsense.AdUnitOptions = function() {};

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.backgroundColor;

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.borderColor;

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.channelNumber;

/**
 * @type {google.maps.adsense.AdFormat}
 */
google.maps.adsense.AdUnitOptions.prototype.format;

/**
 * @type {google.maps.Map}
 */
google.maps.adsense.AdUnitOptions.prototype.map;

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.adsense.AdUnitOptions.prototype.position;

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.publisherId;

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.textColor;

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.titleColor;

/**
 * @type {string}
 */
google.maps.adsense.AdUnitOptions.prototype.urlColor;

// Namespace
google.maps.drawing = {};

/**
 * @constructor
 */
google.maps.drawing.DrawingControlOptions = function() {};

/**
 * @type {Array.<google.maps.drawing.OverlayType>}
 */
google.maps.drawing.DrawingControlOptions.prototype.drawingModes;

/**
 * @type {google.maps.ControlPosition}
 */
google.maps.drawing.DrawingControlOptions.prototype.position;

/**
 * @param {(google.maps.drawing.DrawingManagerOptions|Object.<string>)=} opt_options
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.drawing.DrawingManager = function(opt_options) {};

/**
 * @nosideeffects
 * @return {?google.maps.drawing.OverlayType}
 */
google.maps.drawing.DrawingManager.prototype.getDrawingMode = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.drawing.DrawingManager.prototype.getMap = function() {};

/**
 * @param {?google.maps.drawing.OverlayType} drawingMode
 * @return {undefined}
 */
google.maps.drawing.DrawingManager.prototype.setDrawingMode = function(drawingMode) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.drawing.DrawingManager.prototype.setMap = function(map) {};

/**
 * @param {google.maps.drawing.DrawingManagerOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.drawing.DrawingManager.prototype.setOptions = function(options) {};

/**
 * @constructor
 */
google.maps.drawing.DrawingManagerOptions = function() {};

/**
 * @type {google.maps.CircleOptions|Object.<string>}
 */
google.maps.drawing.DrawingManagerOptions.prototype.circleOptions;

/**
 * @type {boolean}
 */
google.maps.drawing.DrawingManagerOptions.prototype.drawingControl;

/**
 * @type {google.maps.drawing.DrawingControlOptions|Object.<string>}
 */
google.maps.drawing.DrawingManagerOptions.prototype.drawingControlOptions;

/**
 * @type {google.maps.drawing.OverlayType}
 */
google.maps.drawing.DrawingManagerOptions.prototype.drawingMode;

/**
 * @type {google.maps.Map}
 */
google.maps.drawing.DrawingManagerOptions.prototype.map;

/**
 * @type {google.maps.MarkerOptions|Object.<string>}
 */
google.maps.drawing.DrawingManagerOptions.prototype.markerOptions;

/**
 * @type {google.maps.PolygonOptions|Object.<string>}
 */
google.maps.drawing.DrawingManagerOptions.prototype.polygonOptions;

/**
 * @type {google.maps.PolylineOptions|Object.<string>}
 */
google.maps.drawing.DrawingManagerOptions.prototype.polylineOptions;

/**
 * @type {google.maps.RectangleOptions|Object.<string>}
 */
google.maps.drawing.DrawingManagerOptions.prototype.rectangleOptions;

/**
 * @constructor
 */
google.maps.drawing.OverlayCompleteEvent = function() {};

/**
 * @type {google.maps.Marker|google.maps.Polygon|google.maps.Polyline|google.maps.Rectangle|google.maps.Circle}
 */
google.maps.drawing.OverlayCompleteEvent.prototype.overlay;

/**
 * @type {google.maps.drawing.OverlayType}
 */
google.maps.drawing.OverlayCompleteEvent.prototype.type;

/**
 * @enum {number|string}
 */
google.maps.drawing.OverlayType = {
  CIRCLE: '',
  MARKER: '',
  POLYGON: '',
  POLYLINE: '',
  RECTANGLE: ''
};

// Namespace
google.maps.event = {};

/**
 * @param {Object} instance
 * @param {string} eventName
 * @param {!Function} handler
 * @param {boolean=} opt_capture
 * @return {google.maps.MapsEventListener}
 */
google.maps.event.addDomListener = function(instance, eventName, handler, opt_capture) {};

/**
 * @param {Object} instance
 * @param {string} eventName
 * @param {!Function} handler
 * @param {boolean=} opt_capture
 * @return {google.maps.MapsEventListener}
 */
google.maps.event.addDomListenerOnce = function(instance, eventName, handler, opt_capture) {};

/**
 * @param {Object} instance
 * @param {string} eventName
 * @param {!Function} handler
 * @return {google.maps.MapsEventListener}
 */
google.maps.event.addListener = function(instance, eventName, handler) {};

/**
 * @param {Object} instance
 * @param {string} eventName
 * @param {!Function} handler
 * @return {google.maps.MapsEventListener}
 */
google.maps.event.addListenerOnce = function(instance, eventName, handler) {};

/**
 * @param {Object} instance
 * @return {undefined}
 */
google.maps.event.clearInstanceListeners = function(instance) {};

/**
 * @param {Object} instance
 * @param {string} eventName
 * @return {undefined}
 */
google.maps.event.clearListeners = function(instance, eventName) {};

/**
 * @param {google.maps.MapsEventListener} listener
 * @return {undefined}
 */
google.maps.event.removeListener = function(listener) {};

/**
 * @param {Object} instance
 * @param {string} eventName
 * @param {...*} var_args
 * @return {undefined}
 */
google.maps.event.trigger = function(instance, eventName, var_args) {};

// Namespace
google.maps.geometry = {};

// Namespace
google.maps.geometry.encoding = {};

/**
 * @param {string} encodedPath
 * @return {Array.<google.maps.LatLng>}
 */
google.maps.geometry.encoding.decodePath = function(encodedPath) {};

/**
 * @param {Array.<google.maps.LatLng>|google.maps.MVCArray.<google.maps.LatLng>} path
 * @return {string}
 */
google.maps.geometry.encoding.encodePath = function(path) {};

// Namespace
google.maps.geometry.poly = {};

/**
 * @param {google.maps.LatLng} point
 * @param {google.maps.Polygon} polygon
 * @return {boolean}
 */
google.maps.geometry.poly.containsLocation = function(point, polygon) {};

/**
 * @param {google.maps.LatLng} point
 * @param {google.maps.Polygon|google.maps.Polyline} poly
 * @param {number=} opt_tolerance
 * @return {boolean}
 */
google.maps.geometry.poly.isLocationOnEdge = function(point, poly, opt_tolerance) {};

// Namespace
google.maps.geometry.spherical = {};

/**
 * @param {Array.<google.maps.LatLng>|google.maps.MVCArray.<google.maps.LatLng>} path
 * @param {number=} opt_radius
 * @return {number}
 */
google.maps.geometry.spherical.computeArea = function(path, opt_radius) {};

/**
 * @param {google.maps.LatLng} from
 * @param {google.maps.LatLng} to
 * @param {number=} opt_radius
 * @return {number}
 */
google.maps.geometry.spherical.computeDistanceBetween = function(from, to, opt_radius) {};

/**
 * @param {google.maps.LatLng} from
 * @param {google.maps.LatLng} to
 * @return {number}
 */
google.maps.geometry.spherical.computeHeading = function(from, to) {};

/**
 * @param {Array.<google.maps.LatLng>|google.maps.MVCArray.<google.maps.LatLng>} path
 * @param {number=} opt_radius
 * @return {number}
 */
google.maps.geometry.spherical.computeLength = function(path, opt_radius) {};

/**
 * @param {google.maps.LatLng} from
 * @param {number} distance
 * @param {number} heading
 * @param {number=} opt_radius
 * @return {google.maps.LatLng}
 */
google.maps.geometry.spherical.computeOffset = function(from, distance, heading, opt_radius) {};

/**
 * @param {google.maps.LatLng} to
 * @param {number} distance
 * @param {number} heading
 * @param {number=} opt_radius
 * @return {google.maps.LatLng}
 */
google.maps.geometry.spherical.computeOffsetOrigin = function(to, distance, heading, opt_radius) {};

/**
 * @param {Array.<google.maps.LatLng>|google.maps.MVCArray.<google.maps.LatLng>} loop
 * @param {number=} opt_radius
 * @return {number}
 */
google.maps.geometry.spherical.computeSignedArea = function(loop, opt_radius) {};

/**
 * @param {google.maps.LatLng} from
 * @param {google.maps.LatLng} to
 * @param {number} fraction
 * @return {google.maps.LatLng}
 */
google.maps.geometry.spherical.interpolate = function(from, to, fraction) {};

// Namespace
google.maps.panoramio = {};

/**
 * @constructor
 */
google.maps.panoramio.PanoramioFeature = function() {};

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioFeature.prototype.author;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioFeature.prototype.photoId;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioFeature.prototype.title;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioFeature.prototype.url;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioFeature.prototype.userId;

/**
 * @param {(google.maps.panoramio.PanoramioLayerOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.panoramio.PanoramioLayer = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.panoramio.PanoramioLayer.prototype.getMap = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.panoramio.PanoramioLayer.prototype.getTag = function() {};

/**
 * @nosideeffects
 * @return {string}
 */
google.maps.panoramio.PanoramioLayer.prototype.getUserId = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.panoramio.PanoramioLayer.prototype.setMap = function(map) {};

/**
 * @param {google.maps.panoramio.PanoramioLayerOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.panoramio.PanoramioLayer.prototype.setOptions = function(options) {};

/**
 * @param {string} tag
 * @return {undefined}
 */
google.maps.panoramio.PanoramioLayer.prototype.setTag = function(tag) {};

/**
 * @param {string} userId
 * @return {undefined}
 */
google.maps.panoramio.PanoramioLayer.prototype.setUserId = function(userId) {};

/**
 * @constructor
 */
google.maps.panoramio.PanoramioLayerOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.panoramio.PanoramioLayerOptions.prototype.clickable;

/**
 * @type {google.maps.Map}
 */
google.maps.panoramio.PanoramioLayerOptions.prototype.map;

/**
 * @type {boolean}
 */
google.maps.panoramio.PanoramioLayerOptions.prototype.suppressInfoWindows;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioLayerOptions.prototype.tag;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioLayerOptions.prototype.userId;

/**
 * @constructor
 */
google.maps.panoramio.PanoramioMouseEvent = function() {};

/**
 * @type {google.maps.panoramio.PanoramioFeature}
 */
google.maps.panoramio.PanoramioMouseEvent.prototype.featureDetails;

/**
 * @type {string}
 */
google.maps.panoramio.PanoramioMouseEvent.prototype.infoWindowHtml;

/**
 * @type {google.maps.LatLng}
 */
google.maps.panoramio.PanoramioMouseEvent.prototype.latLng;

/**
 * @type {google.maps.Size}
 */
google.maps.panoramio.PanoramioMouseEvent.prototype.pixelOffset;

// Namespace
google.maps.places = {};

/**
 * @param {HTMLInputElement} inputField
 * @param {(google.maps.places.AutocompleteOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.places.Autocomplete = function(inputField, opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.LatLngBounds}
 */
google.maps.places.Autocomplete.prototype.getBounds = function() {};

/**
 * @nosideeffects
 * @return {google.maps.places.PlaceResult}
 */
google.maps.places.Autocomplete.prototype.getPlace = function() {};

/**
 * @param {google.maps.LatLngBounds} bounds
 * @return {undefined}
 */
google.maps.places.Autocomplete.prototype.setBounds = function(bounds) {};

/**
 * @param {google.maps.places.ComponentRestrictions} restrictions
 * @return {undefined}
 */
google.maps.places.Autocomplete.prototype.setComponentRestrictions = function(restrictions) {};

/**
 * @param {Array.<string>} types
 * @return {undefined}
 */
google.maps.places.Autocomplete.prototype.setTypes = function(types) {};

/**
 * @constructor
 */
google.maps.places.AutocompleteOptions = function() {};

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.places.AutocompleteOptions.prototype.bounds;

/**
 * @type {google.maps.places.ComponentRestrictions}
 */
google.maps.places.AutocompleteOptions.prototype.componentRestrictions;

/**
 * @type {Array.<string>}
 */
google.maps.places.AutocompleteOptions.prototype.types;

/**
 * @constructor
 */
google.maps.places.ComponentRestrictions = function() {};

/**
 * @type {string}
 */
google.maps.places.ComponentRestrictions.prototype.country;

/**
 * @constructor
 */
google.maps.places.PlaceDetailsRequest = function() {};

/**
 * @type {string}
 */
google.maps.places.PlaceDetailsRequest.prototype.reference;

/**
 * @constructor
 */
google.maps.places.PlaceGeometry = function() {};

/**
 * @type {google.maps.LatLng}
 */
google.maps.places.PlaceGeometry.prototype.location;

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.places.PlaceGeometry.prototype.viewport;

/**
 * @constructor
 */
google.maps.places.PlaceResult = function() {};

/**
 * @type {Array.<google.maps.GeocoderAddressComponent>}
 */
google.maps.places.PlaceResult.prototype.address_components;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.formatted_address;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.formatted_phone_number;

/**
 * @type {google.maps.places.PlaceGeometry}
 */
google.maps.places.PlaceResult.prototype.geometry;

/**
 * @type {Array.<string>}
 */
google.maps.places.PlaceResult.prototype.html_attributions;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.icon;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.id;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.international_phone_number;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.name;

/**
 * @type {number}
 */
google.maps.places.PlaceResult.prototype.rating;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.reference;

/**
 * @type {Array.<string>}
 */
google.maps.places.PlaceResult.prototype.types;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.url;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.vicinity;

/**
 * @type {string}
 */
google.maps.places.PlaceResult.prototype.website;

/**
 * @constructor
 */
google.maps.places.PlaceSearchPagination = function() {};

/**
 * @type {boolean}
 */
google.maps.places.PlaceSearchPagination.prototype.hasNextPage;

/**
 * @return {undefined}
 */
google.maps.places.PlaceSearchPagination.prototype.nextPage = function() {};

/**
 * @constructor
 */
google.maps.places.PlaceSearchRequest = function() {};

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.places.PlaceSearchRequest.prototype.bounds;

/**
 * @type {string}
 */
google.maps.places.PlaceSearchRequest.prototype.keyword;

/**
 * @type {google.maps.LatLng}
 */
google.maps.places.PlaceSearchRequest.prototype.location;

/**
 * @type {string}
 */
google.maps.places.PlaceSearchRequest.prototype.name;

/**
 * @type {number}
 */
google.maps.places.PlaceSearchRequest.prototype.radius;

/**
 * @type {google.maps.places.RankBy}
 */
google.maps.places.PlaceSearchRequest.prototype.rankBy;

/**
 * @type {Array.<string>}
 */
google.maps.places.PlaceSearchRequest.prototype.types;

/**
 * @param {HTMLDivElement|google.maps.Map} attrContainer
 * @constructor
 */
google.maps.places.PlacesService = function(attrContainer) {};

/**
 * @param {google.maps.places.PlaceDetailsRequest|Object.<string>} request
 * @param {function(google.maps.places.PlaceResult, google.maps.places.PlacesServiceStatus)} callback
 * @return {undefined}
 */
google.maps.places.PlacesService.prototype.getDetails = function(request, callback) {};

/**
 * @param {google.maps.places.PlaceSearchRequest|Object.<string>} request
 * @param {function(Array.<google.maps.places.PlaceResult>, google.maps.places.PlacesServiceStatus,
               google.maps.places.PlaceSearchPagination)} callback
 * @return {undefined}
 */
google.maps.places.PlacesService.prototype.nearbySearch = function(request, callback) {};

/**
 * @param {google.maps.places.TextSearchRequest|Object.<string>} request
 * @param {function(Array.<google.maps.places.PlaceResult>, google.maps.places.PlacesServiceStatus)} callback
 * @return {undefined}
 */
google.maps.places.PlacesService.prototype.textSearch = function(request, callback) {};

/**
 * @enum {number|string}
 */
google.maps.places.PlacesServiceStatus = {
  INVALID_REQUEST: '',
  OK: '',
  OVER_QUERY_LIMIT: '',
  REQUEST_DENIED: '',
  UNKNOWN_ERROR: '',
  ZERO_RESULTS: ''
};

/**
 * @enum {number|string}
 */
google.maps.places.RankBy = {
  DISTANCE: '',
  PROMINENCE: ''
};

/**
 * @constructor
 */
google.maps.places.TextSearchRequest = function() {};

/**
 * @type {google.maps.LatLngBounds}
 */
google.maps.places.TextSearchRequest.prototype.bounds;

/**
 * @type {google.maps.LatLng}
 */
google.maps.places.TextSearchRequest.prototype.location;

/**
 * @type {string}
 */
google.maps.places.TextSearchRequest.prototype.query;

/**
 * @type {number}
 */
google.maps.places.TextSearchRequest.prototype.radius;

/**
 * @type {Array.<string>}
 */
google.maps.places.TextSearchRequest.prototype.types;

// Namespace
google.maps.visualization = {};

/**
 * @param {(google.maps.visualization.HeatmapLayerOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.visualization.HeatmapLayer = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.MVCArray.<google.maps.LatLng|google.maps.visualization.WeightedLocation>}
 */
google.maps.visualization.HeatmapLayer.prototype.getData = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.visualization.HeatmapLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.MVCArray.<google.maps.LatLng|google.maps.visualization.WeightedLocation>|Array.<google.maps.LatLng|google.maps.visualization.WeightedLocation>} data
 * @return {undefined}
 */
google.maps.visualization.HeatmapLayer.prototype.setData = function(data) {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.visualization.HeatmapLayer.prototype.setMap = function(map) {};

/**
 * @constructor
 */
google.maps.visualization.HeatmapLayerOptions = function() {};

/**
 * @type {google.maps.MVCArray.<google.maps.LatLng>}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.data;

/**
 * @type {boolean}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.dissipating;

/**
 * @type {Array.<string>}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.gradient;

/**
 * @type {google.maps.Map}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.map;

/**
 * @type {number}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.maxIntensity;

/**
 * @type {number}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.opacity;

/**
 * @type {number}
 */
google.maps.visualization.HeatmapLayerOptions.prototype.radius;

/**
 * @constructor
 */
google.maps.visualization.WeightedLocation = function() {};

/**
 * @type {google.maps.LatLng}
 */
google.maps.visualization.WeightedLocation.prototype.location;

/**
 * @type {number}
 */
google.maps.visualization.WeightedLocation.prototype.weight;

// Namespace
google.maps.weather = {};

/**
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.weather.CloudLayer = function() {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.weather.CloudLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.weather.CloudLayer.prototype.setMap = function(map) {};

/**
 * @enum {number|string}
 */
google.maps.weather.LabelColor = {
  BLACK: '',
  WHITE: ''
};

/**
 * @enum {number|string}
 */
google.maps.weather.TemperatureUnit = {
  CELSIUS: '',
  FAHRENHEIT: ''
};

/**
 * @constructor
 */
google.maps.weather.WeatherConditions = function() {};

/**
 * @type {string}
 */
google.maps.weather.WeatherConditions.prototype.day;

/**
 * @type {string}
 */
google.maps.weather.WeatherConditions.prototype.description;

/**
 * @type {number}
 */
google.maps.weather.WeatherConditions.prototype.high;

/**
 * @type {number}
 */
google.maps.weather.WeatherConditions.prototype.humidity;

/**
 * @type {number}
 */
google.maps.weather.WeatherConditions.prototype.low;

/**
 * @type {string}
 */
google.maps.weather.WeatherConditions.prototype.shortDay;

/**
 * @type {number}
 */
google.maps.weather.WeatherConditions.prototype.temperature;

/**
 * @type {string}
 */
google.maps.weather.WeatherConditions.prototype.windDirection;

/**
 * @type {number}
 */
google.maps.weather.WeatherConditions.prototype.windSpeed;

/**
 * @constructor
 */
google.maps.weather.WeatherFeature = function() {};

/**
 * @type {google.maps.weather.WeatherConditions}
 */
google.maps.weather.WeatherFeature.prototype.current;

/**
 * @type {Array.<google.maps.weather.WeatherForecast>}
 */
google.maps.weather.WeatherFeature.prototype.forecast;

/**
 * @type {string}
 */
google.maps.weather.WeatherFeature.prototype.location;

/**
 * @type {google.maps.weather.TemperatureUnit}
 */
google.maps.weather.WeatherFeature.prototype.temperatureUnit;

/**
 * @type {google.maps.weather.WindSpeedUnit}
 */
google.maps.weather.WeatherFeature.prototype.windSpeedUnit;

/**
 * @constructor
 */
google.maps.weather.WeatherForecast = function() {};

/**
 * @type {string}
 */
google.maps.weather.WeatherForecast.prototype.day;

/**
 * @type {string}
 */
google.maps.weather.WeatherForecast.prototype.description;

/**
 * @type {number}
 */
google.maps.weather.WeatherForecast.prototype.high;

/**
 * @type {number}
 */
google.maps.weather.WeatherForecast.prototype.low;

/**
 * @type {string}
 */
google.maps.weather.WeatherForecast.prototype.shortDay;

/**
 * @param {(google.maps.weather.WeatherLayerOptions|Object.<string>)=} opt_opts
 * @extends {google.maps.MVCObject}
 * @constructor
 */
google.maps.weather.WeatherLayer = function(opt_opts) {};

/**
 * @nosideeffects
 * @return {google.maps.Map}
 */
google.maps.weather.WeatherLayer.prototype.getMap = function() {};

/**
 * @param {google.maps.Map} map
 * @return {undefined}
 */
google.maps.weather.WeatherLayer.prototype.setMap = function(map) {};

/**
 * @param {google.maps.weather.WeatherLayerOptions|Object.<string>} options
 * @return {undefined}
 */
google.maps.weather.WeatherLayer.prototype.setOptions = function(options) {};

/**
 * @constructor
 */
google.maps.weather.WeatherLayerOptions = function() {};

/**
 * @type {boolean}
 */
google.maps.weather.WeatherLayerOptions.prototype.clickable;

/**
 * @type {google.maps.weather.LabelColor}
 */
google.maps.weather.WeatherLayerOptions.prototype.labelColor;

/**
 * @type {google.maps.Map}
 */
google.maps.weather.WeatherLayerOptions.prototype.map;

/**
 * @type {boolean}
 */
google.maps.weather.WeatherLayerOptions.prototype.suppressInfoWindows;

/**
 * @type {google.maps.weather.TemperatureUnit}
 */
google.maps.weather.WeatherLayerOptions.prototype.temperatureUnits;

/**
 * @type {google.maps.weather.WindSpeedUnit}
 */
google.maps.weather.WeatherLayerOptions.prototype.windSpeedUnits;

/**
 * @constructor
 */
google.maps.weather.WeatherMouseEvent = function() {};

/**
 * @type {google.maps.weather.WeatherFeature}
 */
google.maps.weather.WeatherMouseEvent.prototype.featureDetails;

/**
 * @type {string}
 */
google.maps.weather.WeatherMouseEvent.prototype.infoWindowHtml;

/**
 * @type {google.maps.LatLng}
 */
google.maps.weather.WeatherMouseEvent.prototype.latLng;

/**
 * @type {google.maps.Size}
 */
google.maps.weather.WeatherMouseEvent.prototype.pixelOffset;

/**
 * @enum {number|string}
 */
google.maps.weather.WindSpeedUnit = {
  KILOMETERS_PER_HOUR: '',
  METERS_PER_SECOND: '',
  MILES_PER_HOUR: ''
};


/**
 * @fileoverview Externs for Twitter Bootstrap
 * @see http://twitter.github.com/bootstrap/
 * 
 * @author Qamal Kosim-Satyaputra
 * @externs
 */



// --- Modal ---

///** @constructor */
//jQuery.modal.options = function() {};//

///** @type {boolean} */
//jQuery.modal.options.prototype.backdrop;//

///** @type {boolean} */
//jQuery.modal.options.prototype.keyboard;//

///** @type {boolean} */
//jQuery.modal.options.prototype.show;

/**
 * @param {(string|Object.<string, boolean>)=} opt_eventOrOptions
 * @return {jQuery}
 */
jQuery.prototype.modal = function(opt_eventOrOptions) {};



// --- Dropdown ---



/**
 * @return {jQuery}
 */
jQuery.prototype.dropdown = function() {};



// --- Scroll Spy ---



///** @constructor */
//jQuery.scrollspy.options = function() {};//

///** @type {number} */
//jQuery.scrollspy.options.prototype.offset;

/**
 * @param {Object.<string, number>=} opt_options
 * @return {jQuery}
 */
jQuery.prototype.scrollspy = function(opt_options) {};



// --- Tabs ---



/**
 * @param {string=} opt_event
 * @return {jQuery}
 */
jQuery.prototype.tab = function(opt_event) {};



// --- Tooltips ---



/** @constructor */
//jQuery.tooltip.options = function() {};
//
/**
 * @param {(string|Object.<string, (string|boolean|number)>)=} opt_eventOrOptions
 * @return {jQuery}
 */
jQuery.prototype.tooltip = function(opt_eventOrOptions) {};

///** @type {boolean} */
//jQuery.tooltip.prototype.animation;//

///** @type {(string|function)} */
//jQuery.tooltip.prototype.placement;//

///** @type {string} */
//jQuery.tooltip.prototype.selector;//

///** @type {string|function} */
//jQuery.tooltip.prototype.title;//

///** @type {string} */
//jQuery.tooltip.prototype.trigger;//

///** @type {number|{show: number, hide: number}} */
//jQuery.tooltip.prototype.delay;


// --- Popovers ---



/** @constructor */
//jQuery.popover.options = function() {};

///** @type {boolean} */
//jQuery.popover.prototype.animation;//

///** @type {string|function} */
//jQuery.popover.prototype.placement;//

///** @type {string} */
//jQuery.popover.prototype.selector;//

///** @type {string} */
//jQuery.popover.prototype.trigger;//

///** @type {string|function} */
//jQuery.popover.prototype.title;//

///** @type {string|function} */
//jQuery.popover.prototype.content;//

///** @type {number|{show: number, hide: number}} */
//jQuery.popover.prototype.delay;

/**
 * @param {(string|Object.<string, (string|number|Object.<string, number>)>)=} opt_eventOrOptions
 * @return {jQuery}
 */
jQuery.prototype.popover = function(opt_eventOrOptions) {};



// --- Alerts ---



/**
 * @param {string=} opt_event
 * @return {jQuery}
 */
jQuery.prototype.alert = function(opt_event) {};



// --- Buttons ---



/**
 * @param {string=} opt_state
 * @return {jQuery}
 */
jQuery.prototype.button = function(opt_state) {};



// --- Collapse ---



/** @constructor */
//jQuery.collapse.options = function() {};//

///** @type {jQuerySelector} */
//jQuery.collapse.options.prototype.parent;//

///** @type {boolean} */
//jQuery.collapse.options.prototype.toggle;

/**
 * @param {(string|Object.<string, boolean>)=} opt_eventOrOptions
 */
jQuery.prototype.collapse = function(opt_eventOrOptions) {};



// --- Carousel ---



///** @constructor */
//jQuery.carousel.options = function() {};//

///** @type {number} */
//jQuery.carousel.options.prototype.interval;//

///** @type {string} */
//jQuery.carousel.options.prototype.pause;

/**
 * @param {(string|Object.<string, (number|string)>)=} opt_eventOrOptions
 */
jQuery.prototype.carousel = function(opt_eventOrOptions) {};


// --- Typeahead ---



///** @constructor */
//jQuery.typeahead.options = function() {};//

///** @type {Array} */
//jQuery.typeahead.options.prototype.source;//

///** @type {number} */
//jQuery.typeahead.options.prototype.items;//

///** @type {function} */
//jQuery.typeahead.options.prototype.matcher;//

///** @type {function} */
//jQuery.typeahead.options.prototype.sorter;//

///** @type {function} */
//jQuery.typeahead.options.prototype.highlighter;

/**
 * @param {(string|Object.<string, number>)=} opt_options
 * @return {jQuery}
 */
jQuery.prototype.typeahead = function(opt_options) {};

/**
 * @param {jQuery|jQuerySelector} element
 * @param {Object.<string, number>} opt_options
 * @return {jQuery}
 */
jQuery.prototype.typeahead.Constructor = function(element, opt_options) {};
