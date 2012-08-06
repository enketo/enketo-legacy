

function vkbeautify(){}

/**
 * @param {string} str
 */
vkbeautify.xml = function(str){};



var XPathJS = (function(){})();

XPathJS.bindDomLevel3XPath = function(){};





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

/** this one is changed by Martijn
 * @param {string} var_args
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
 * @param {*} value
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
 * @fileoverview Externs for jQuery 1.7.2
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
 * @param {(jQuerySelector|Element|Array.<Element>|Object|jQuery|string|
 *     function())} arg1
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
 * @nosideeffects
 */
jQuery.prototype.andSelf = function() {};

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

/** @type {Object.<string,*>} */
jQuery.browser;

/** @type {Object.<string,*>} */
$.browser;

/**
 * @type {boolean}
 * @const
 */
jQuery.browser.mozilla;

/**
 * @type {boolean}
 * @const
 */
$.browser.mozilla;

/**
 * @type {boolean}
 * @const
 */
jQuery.browser.msie;

/**
 * @type {boolean}
 * @const
 */
$.browser.msie;

/**
 * @type {boolean}
 * @const
 */
jQuery.browser.opera;

/**
 * @type {boolean}
 * @const
 */
$.browser.opera;

/**
 * @deprecated
 * @type {boolean}
 * @const
 */
jQuery.browser.safari;

/**
 * @deprecated
 * @type {boolean}
 * @const
 */
$.browser.safari;

/** @type {string} */
jQuery.browser.version;

/** @type {string} */
$.browser.version;

/**
 * @type {boolean}
 * @const
 */
jQuery.browser.webkit;

/**
 * @type {boolean}
 * @const
 */
$.browser.webkit;

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
 * @return {(!jQuery|Array.<Element>)}
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
 * @param {function()} alwaysCallbacks
 * @param {function()=} alwaysCallbacks2
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.always
    = function(alwaysCallbacks, alwaysCallbacks2) {};

/**
 * @param {function()} doneCallbacks
 * @param {function()=} doneCallbacks2
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.done = function(doneCallbacks, doneCallbacks2) {};

/**
 * @param {function()} failCallbacks
 * @param {function()=} failCallbacks2
 * @return {jQuery.deferred}
 */
jQuery.deferred.prototype.fail = function(failCallbacks, failCallbacks2) {};

/**
 * @deprecated
 * @return {boolean}
 * @nosideeffects
 */
jQuery.deferred.prototype.isRejected = function() {};

/**
 * @deprecated
 * @return {boolean}
 * @nosideeffects
 */
jQuery.deferred.prototype.isResolved = function() {};

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
 * @param {function()} doneCallbacks
 * @param {function()} failCallbacks
 * @param {function()=} progressCallbacks
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
 * @deprecated
 * @param {(string|Object.<string,*>)=} arg1
 * @param {string=} handler
 * @return {!jQuery}
 */
jQuery.prototype.die = function(arg1, handler) {};

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
 * @deprecated
 * @param {function()} callback
 * @return {jQuery.jqXHR}
*/
jQuery.jqXHR.prototype.complete = function (callback) {};

/**
 * @override
 * @param {function()} doneCallbacks
 * @return {jQuery.Promise}
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
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.jqXHR.prototype.fail = function(failCallbacks) {};

/**
 * @deprecated
 * @override
 * @return {boolean}
 * @nosideeffects
 */
jQuery.jqXHR.prototype.isRejected = function() {};

/**
 * @deprecated
 * @override
 * @return {boolean}
 * @nosideeffects
 */
jQuery.jqXHR.prototype.isResolved = function() {};

/**
 * @deprecated
 * @override
 */
jQuery.jqXHR.prototype.onreadystatechange = function (callback) {};

/**
 * @deprecated
 * @param {function()} callback
 * @return {jQuery.jqXHR}
*/
jQuery.jqXHR.prototype.success = function (callback) {};

/**
 * @override
 * @param {function()} doneCallbacks
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.jqXHR.prototype.then = function(doneCallbacks, failCallbacks) {};

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
 * @param {(string|Object)} arg1
 * @param {(function(!jQuery.event=)|Object)=} arg2
 * @param {function(!jQuery.event=)=} handler
 * @return {!jQuery}
 */
jQuery.prototype.live = function(arg1, arg2, handler) {};

/**
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
 * @param {function()} doneCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.done = function(doneCallbacks) {};

/**
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.fail = function(failCallbacks) {};

/**
 * @deprecated
 * @return {boolean}
 * @nosideeffects
 */
jQuery.Promise.prototype.isRejected = function() {};

/**
 * @deprecated
 * @return {boolean}
 * @nosideeffects
 */
jQuery.Promise.prototype.isResolved = function() {};

/**
 * @param {function()} doneCallbacks
 * @param {function()} failCallbacks
 * @return {jQuery.Promise}
 */
jQuery.Promise.prototype.then = function(doneCallbacks, failCallbacks) {};

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
 * @param {jQuerySelector=} selector
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.prototype.siblings = function(selector) {};

/**
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
 * @deprecated
 * @return {!jQuery}
 * @nosideeffects
 */
jQuery.sub = function() {};

/**
 * @deprecated
 * @return {!jQuery}
 * @nosideeffects
 */
$.sub = function() {};

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
 * @param {(function(!jQuery.event=)|string|number|function()|boolean)=} arg1
 * @param {(function(!jQuery.event=)|function()|string)=} arg2
 * @param {(function(!jQuery.event=)|function())=} arg3
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

/** @type {Object.<string, *>} */
jQuery.datepicker = {};
/** @type {Object.<string, *>} */
jQuery.timepicker = {};
/** @type {Object.<string, *>} */
jQuery.datetimepicker = {};
/** 
 *  @param {Object} obj
 * */
jQuery.prototype.multiselect = function(obj){};
/** 
 *  @param {Object=} obj
 */
jQuery.prototype.tabs =function(obj){};

/** 
 *  @param {(Object|string)=} a
 *  @param {Object=} a.icons 
 *  @param {string=} a.icons.primary
 *  @param {string=} a.icons.secondary
 *  @param {boolean=} a.text 
 *  @param {string=} a.label 
 *  @param {(boolean|string)=} a.disabled 
 *  @param { string=} b 
 *  @param { boolean=} c 
 *  @return {!jQuery}
 */
jQuery.prototype.button =function(a,b,c){};
 
/**
 * @param {string=} effect 
 * @param {Object=} arg2
 * @param {(string|number|function())=} duration
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.show = function(effect, arg2, duration, callback) {};

/** 
 * @param {string=} effect 
 * @param {Object=} arg2
 * @param {(string|number|function())=} duration
 * @param {function()=} callback
 * @return {!jQuery}
 */
jQuery.prototype.hide = function(effect, arg2, duration, callback) {};

/** THIS DOESN"T WORK => HAVE CHANGED ALL PARAMETERS TO STRING IN SOURCE TO DEAL WITH THIS
 * @param {{disabled: boolean, autoOpen: boolean, buttons, closeOnEscape: boolean, dialogClass: string, draggable: boolean, height: number, hide: object, maxHeight: number, maxWidth: number, minHeight: number, minWidth: number, modal: boolean, resizable: boolean, show: string, stack: boolean, title: string, width: number, zindex:number, beforeClose, close, open}=} arg
 * @return {!jQuery}
 */
jQuery.prototype.dialog = function(arg){};

/**
 * @param {(string|Object)=} a
 * @param {(string|number)=} b
 * @param {(string|number)=} c
 * @return {!jQuery}
 */
jQuery.prototype.slider = function(a, b, c){};

/**
 * @param {(string|Object)=} arg
 * @return {!jQuery}
 */
jQuery.prototype.mousewheel = function(arg){};

/*
 * Copyright 2010 The Closure Compiler Authors
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
 * @fileoverview Externs for jQuery Tooltip plugin 1.3
 * @see http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * @externs
 */

/** @type {Object.<string, *>} */
jQuery.tooltip = {};

/** @type {boolean} */
jQuery.tooltip.blocked;

/** @type {jQuery.tooltip.settings} */
jQuery.tooltip.defaults;

/** @return {undefined} */
jQuery.tooltip.block = function() {};

/**
 * @private
 * @constructor
 */
jQuery.tooltip.settings = function() {};

/** @type {number} */
jQuery.tooltip.settings.prototype.delay;

/** @type {(string|number)} */
jQuery.tooltip.settings.prototype.fade;

/** @type {boolean} */
jQuery.tooltip.settings.prototype.fixPNG;

/** @type {boolean} */
jQuery.tooltip.settings.prototype.track;

/** @type {boolean} */
jQuery.tooltip.settings.prototype.showURL;

/** @type {String} */
jQuery.tooltip.settings.prototype.extraClass;

/** @type {number} */
jQuery.tooltip.settings.prototype.top;

/** @type {number} */
jQuery.tooltip.settings.prototype.left;

/** @type {string} */
jQuery.tooltip.settings.prototype.id;

/**
 * @return {(string|Element)}
 * @this {Element}
 */
jQuery.tooltip.settings.prototype.bodyHandler = function() {};

/** @type {boolean} */
jQuery.tooltip.settings.prototype.showBody;

/**
 * @param {jQuery.tooltip.settings=} settings
 * @return {jQuery}
 */
jQuery.prototype.tooltip = function(settings) {};

////////var jQueryObject = {};////////

////////// Undocumented jQuery externs called by ui
/////////**
//////// * @param {Element} elem
//////// * @param {string} name
//////// * @param {boolean=} force
//////// * @return {string}
//////// * @nosideeffects
//////// */
////////jQueryObject.prototype.curCSS = function(elem, name, force) {};////////

/////////** @const */
////////jQuery.expr;////////

/////////** @type {Object.<string, function(Element, RegExp)>} */
////////jQuery.expr[":"];////////

/////////**
//////// * @param {Element} elem
//////// * @return {boolean}
//////// */
////////jQuery.expr.hidden = function(elem) {};////////

/////////** @type {Object.<string, function(Element, RegExp)>} */
////////jQuery.expr.filters;////////

////////// UI extensions to jQuery
/////////** @return {Element} */
////////jQueryObject.prototype.scrollParent = function() {};////////

/////////**
//////// * @param {number=} zIndex
//////// * @return {number}
//////// */
////////jQueryObject.prototype.zIndex = function(zIndex) {};////////

/////////** @return {jQueryObject} */
////////jQueryObject.prototype.disableSelection = function() {};////////

/////////** @return {jQueryObject} */
////////jQueryObject.prototype.enableSelection = function() {};////////

////////// UI extensions to jQuery selectors
/////////**
//////// * @param {Element} elem
//////// * @param {number} i
//////// * @param {RegExp} match
//////// * @return {*}
//////// */
////////jQuery.expr[":"].data = function(elem, i, match) {};////////

/////////**
//////// * @param {Element} element
//////// * @return {boolean}
//////// * @nosideeffects
//////// */
////////jQuery.expr[":"].focusable = function(element) {};////////

/////////**
//////// * @param {Element} element
//////// * @return {boolean}
//////// * @nosideeffects
//////// */
////////jQuery.expr[":"].tabbable = function(element) {};////////

//////////UI Namespace
////////jQuery.ui;////////

////////// jquery.ui.core.js externs
/////////** @type {string} */
////////jQuery.ui.version;////////

/////////** @enum */
////////jQuery.ui.keyCode = {
////////  ALT: 18,
////////  BACKSPACE: 8,
////////  CAPS_LOCK: 20,
////////  COMMA: 188,
////////  COMMAND: 91,
////////  COMMAND_LEFT: 91, // COMMAND
////////  COMMAND_RIGHT: 93,
////////  CONTROL: 17,
////////  DELETE: 46,
////////  DOWN: 40,
////////  END: 35,
////////  ENTER: 13,
////////  ESCAPE: 27,
////////  HOME: 36,
////////  INSERT: 45,
////////  LEFT: 37,
////////  MENU: 93, // COMMAND_RIGHT
////////  NUMPAD_ADD: 107,
////////  NUMPAD_DECIMAL: 110,
////////  NUMPAD_DIVIDE: 111,
////////  NUMPAD_ENTER: 108,
////////  NUMPAD_MULTIPLY: 106,
////////  NUMPAD_SUBTRACT: 109,
////////  PAGE_DOWN: 34,
////////  PAGE_UP: 33,
////////  PERIOD: 190,
////////  RIGHT: 39,
////////  SHIFT: 16,
////////  SPACE: 32,
////////  TAB: 9,
////////  UP: 38,
////////  WINDOWS: 91 // COMMAND
////////}////////

/////////** @deprecated */
////////jQuery.ui.plugin;////////

/////////**
//////// * @param {string} module
//////// * @param {Object.<string, *>} option
//////// * @param {Object.<string, Array.<*>>} set
//////// * @deprecated
//////// */
////////jQuery.ui.plugin.add = function(module, option, set) {};////////

/////////**
//////// * @param {jQueryObject} instance
//////// * @param {string} name
//////// * @param {...*} args
//////// * @deprecated
//////// */
////////jQuery.ui.plugin.call = function(instance, name, args) {};////////

/////////**
//////// * @param {Element} container
//////// * @param {Element} contained
//////// * @return {boolean}
//////// * @nosideeffects
//////// * @deprecated
//////// */
////////jQuery.ui.contains = function(container, contained) {};////////

/////////**
//////// * @param {Element} el
//////// * @param {string=} a
//////// * @return {boolean}
//////// * @nosideeffects
//////// * @deprecated
//////// */
////////jQuery.ui.hasScroll = function(el, a) {};////////

/////////**
//////// * @param {number} x
//////// * @param {number} reference
//////// * @param {number} size
//////// * @return {boolean}
//////// * @nosideeffects
//////// * @deprecated
//////// */
////////jQuery.ui.isOverAxis = function(x, reference, size) {};////////

/////////**
//////// * @param {number} y
//////// * @param {number} x
//////// * @param {number} top
//////// * @param {number} left
//////// * @param {number} height
//////// * @param {number} width
//////// * @return {boolean}
//////// * @nosideeffects
//////// * @deprecated
//////// */
////////jQuery.ui.isOver = function(y, x, top, left, height, width) {};
