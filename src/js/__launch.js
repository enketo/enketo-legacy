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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global GUI, gui, Form, Modernizr, getGetVariable, vkbeautify*/
var form, source, url, $tabs, $upload, _error, state,
	error_msg = 'There were errors. Please see the "report" tab for details.',
	templateShow = false;

$(document).ready(function(){
	"use strict";
	state = new State();
	state.init();
	//state.setUrl();

	$('[title]').tooltip();

	_error = console.error;
	console.error = function(){
		addJsError(arguments[0]);
		gui.showFeedback(error_msg);
		return _error.apply(console, arguments);
	};

	if (!state.source){
		$('#html5-form-source').hide();
		$('li a[href="#html5-form-source"]').parent('li').remove();
	}
	//$('#tabs').tabs();
	
	//$('li a[href="#upload"]').parent('li').hide();
	//$tabs = $('ul.ui-tabs-nav');
	//$tabs.hide();
	$('li a[href="#upload"]').tab('show');

	//$('.main h2').addClass('ui-widget-header ui-corner-all');
	//$('article').addClass('ui-corner-tr');

	gui.setup();

	$('#upload-form [name="xml_file"]').change(function(){
		//state.reset();
		$('#upload-form').submit();
		resetForm();
		//$('#upload-form')[0].reset();
	});

	$('#upload-form').ajaxForm({
		'dataType': 'xml',
		'beforeSubmit': function(data, $form){
			//console.debug(data);\
			var serverUrl = $form.find('input[name="server_url"]').val() || '',
				formId = $form.find('input[name="form_id"]').val() || '';
			// validate server url
			if ( serverUrl.length > 0 ){
				if (isValidUrl(serverUrl)){
					state.server = serverUrl;
					state.setUrl();
					if ( formId.length > 0 ){
						state.id = formId;
						state.setUrl();
					}
				}
				else{
					gui.alert('Not a valid server url');
					resetForm();
					//cancel submission
					return false;
				}
			}
			/*else {
				resetForm();
				return false;
			}*/
			$('#upload .hurry').hide();
			$('#upload-form progress').show();
		},
		'success': processResponse,
		'error': function(){
			gui.showFeedback('Sorry, an error occured while communicating with the Enketo server.');
			resetForm();
		}
	});

	$('#upload-form #input-switcher a')
		.hover(function(){
			$(this).toggleClass('ui-state-hover');
		})
		.click(function(e){
			e.preventDefault();
			$('#upload-form label').hide().find('input[name="'+$(this).attr('id')+'"]').parents('label').show();
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
		});

	$('#data-template-show input').change(function(){
		templateShow = ($(this).is(':checked')) ? true : false;
		updateData();
	});

	$(document).on('click', '#form-list a', function(event){
		var id = /** @type {string} */ $(this).attr('id');
		event.preventDefault();
		//console.debug('form clicked');
		//$('#upload-form input[name="xml_url"]').val($(this).attr('href'));
		$('#upload-form input[name="form_id"]').val(id);
		$('#upload-form').submit();
	});

	$('#html5-form-source form').submit(function(){
		var cls, $form = $(this);
		var url = $form.attr('action');
		var c = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title></title></head><body>'+$form.find('textarea[name="content"]').val()+'</body></html>';
		var content = new FormData();
		content.append('level', 'error');
		content.append('content', c);
		$('#html5validationmessages div').html('<form style="text-align:center;"><progress></progress></form>');
		$.ajax(url, {
			type: 'POST',
			data: content,
			contentType: false,
			processData: false,
			success: function(response){
				//console.log('html5 validation result'+response);
				//strip <script> elements
				var $response = $('<div></div>');
				$response.append(response.replace(/<script[A-z =".]*><\/script>/gi, ''));
				
				//console.log('$response = '+$response.html());
				$response.find('ol:not(.source) li>*:first-child').each(function(){
					cls = /**@type {string} */$(this).parent('li').attr('class');
					$(this).addClass(cls);
				});
				parseMsgList ($response.find('p.success, ol:not(.source) li>*:first-child'), $('#html5validationmessages div'));
				//correction as Web Service does not accept 'level: 'error' parameter:
				$('#html5validationmessages div li.info').hide();
			},
			error: function(){
				$('#html5validationmessages div').empty().append('<ol><li class="info">'+
					'<span class="ui-icon ui-icon-info"></span>This validation is currently not functional</li></ol>');
			}
		});
		return false;
	});
	
	$('#upload-form #input-switcher a#server_url').click();

	$('#launch form').submit(function(event){
		event.preventDefault();
		console.debug('in ajax submit');
		gui.alert('<form style="text-align:center;><progress></progress></form>', 'Requesting url...', 'normal');
		$.ajax('launch/launchSurvey', {
			type: 'POST',
			data: $(this).serialize(),
			error: function(response){
				gui.alert('Ouch, an error occurred during the request. Please try again.');
			},
			success: function(response){
				response = JSON.parse(response);
				//{success: true, url: .......}
				//{success: false, reason: 'existing', url: ....}
				//{success: false, reason: 'empty'} empty form fields sent in POST
				//{success: false, reason: 'database'} error inserting record into database
				//{succces: false, reason: ''} unknown, could be invalid url(s)
				console.log('form submission complete');
				if (response['success']){
					gui.alert('Form was succesfully launched at this address: '+
						'<a class="launch-link" href="'+response['url']+'">'+response['url']+'</a>', 'Launched!', 'success');
				}
				else{
					switch(response['reason']){
						case 'existing':
							gui.alert('This survey was launched before at this address: '+
								'<a class="launch-link" href="'+response['url']+'">'+response['url']+'</a>', 'Launched!', 'success');
							break;
						case 'empty':
							gui.alert('Server url and/or form id submitted to the server found to be empty.', 'Failed');
							break;
						case 'database':
							gui.alert('Problem occurred trying to add survey details to Enketo database to launch.', 'Failed');
							break;
						default:
							gui.alert('Unknown error', 'Failed');
					}
				}
			}
		});
	});

	if (state.server){
//		if (!isValidUrl(state.server)){
//			gui.alert('Server url is not valid. Resetting.');
//			resetForm();
//			state.reset();
//			return;
//		}
//		$('#upload-form label, #input-switcher, #form-list').hide();
		$('#upload-form input[name="server_url"]').val(state.server);
		if (state.id){
//			url = state.server;
//			url = (url.substring(url.length-1) == '/') ? url : url+'/';
//			url = ((/formhub.org\//).test(url)) ? url+'forms/'+state.id+'/form.xml' : url+'formXml?formId='+state.id;
//			console.log('guessed form url from server+id: '+url);
//			if(isValidUrl(url)){
//				$('#upload-form input[name="xml_url"]').val(url);
//			}
//			else {
//				gui.alert('Could not craft a valid url from the server and id provided. Ignoring id.');
//				state.id = null;
//				state.setUrl();
//			}
			$('#upload-form input[name="form_id"]').val(state.id);
		}
		$('#upload-form').submit();
	}
	//var popped = ('state' in window.history),
		//initialUrl = location.href;

	
	
});

/**
 * State class maintains 'fake' state using url GET variables
 *
 * @constructor
 */
function State(){
	
}

State.prototype.init = function (){
	var first = true,
		serverGetVar = decodeURIComponent(decodeURI(getGetVariable('server')));

	this.server = ( serverGetVar && isValidUrl(serverGetVar) ) ? serverGetVar : null;
	this.id = getGetVariable('id') || null; //CHECK THIS FOR 'VALIDITY'
	this.source = getGetVariable('source') || false;
	this.debug = getGetVariable('debug') || false;

	//var initialUrl,
//		popped = ('state' in window.history);
//	console.debug('popped = '+popped);
	state.setUrl();

	//initialUrl = location.href;
	//temporary hack around popstate-firing-upon-launch issue
	//function(){
		$(window).on('popstate', function(){
//		var initialPop = (!popped && location.href == initialUrl);
//		console.debug('initialUrl: '+initialUrl);
//		popped = true;
//		console.debug('popstate fired');
//		if ( initialPop ){//} window.history.state === null || location.href == initialUrl ) {
//			return console.debug('and ignored');
//		}
			if (!first){
//		alert('going to refresh!');
				window.location = location.href;
			}
			first = false;
		});
	// really not elegant....
	setTimeout(function(){first=false;}, 5000);
	//}, 3000);
};

State.prototype.setUrl = function(){
	var stateProps = {server: this.server, id: this.id, source: this.source, debug: this.debug},
		urlAppend = '',
		url = 'launch';
	urlAppend = (this.server !== null && isValidUrl(this.server)) ? urlAppend+'server='+encodeURIComponent(this.server) : urlAppend;
	urlAppend = (this.id !== null) ? urlAppend+'&id='+encodeURIComponent(this.id) : urlAppend;
	urlAppend = (this.source == 'true' || this.source === true ) ? urlAppend+'&source='+encodeURIComponent(this.source) : urlAppend;
	urlAppend = (this.debug == 'true' || this.debug === true ) ? urlAppend+'&debug='+encodeURIComponent(this.debug) : urlAppend;
	urlAppend = (urlAppend.substring(0,1) == '&') ? urlAppend.substring(1) : urlAppend;
	url = (urlAppend.length > 0) ? url+'?'+urlAppend : url;
	if (location.href !== location.protocol+'//'+location.hostname+'/'+url ){
		console.debug('pushing history state ');
		console.debug(location.href);
		console.debug(location.hostname+'/'+url);
		console.debug(stateProps);
		history.pushState( stateProps, 'Enketo Launch', url);
	}
};

State.prototype.setIdFromUrl = function(url){
	var id;
	if (!isValidUrl(url)){
		this.id = null;
	}
	id = url.match(/formhub\.org\/[A-z\_0-9\-]*\/forms\/([A-z\_0-9\-]*)\/form\.xml/i);
	if (!id){
		id = url.match(/formXml\?formId=([A-z\_0-9\-]*)/i);
	}
	return (id) ? this.id = id[1] : console.error('could not extract id from url: '+url);
};

State.prototype.reset = function(){
	console.debug('resetting state');
	this.server = null;
	this.id = null;
	this.setUrl();
};

GUI.prototype.setCustomEventHandlers = function(){
	//$('button#reset-form').click(function(){
	//	resetForm();
	//});
	
	$(document).on('click', 'button#validate-form:not(.disabled)', function(){
		//$('form.jr').trigger('beforesave');
		if (typeof form !== 'undefined'){
			form.validateForm();
		}
	});

	$(document).on('click', 'button#launch-form:not(.disabled)', function(){
		var dataUrl, errorMsg;
		if (!state.server){
			errorMsg = 'Requires a server url and ';
		}
		if (!state.id){
			errorMsg = (errorMsg) ? errorMsg : 'Requires ';
			errorMsg += 'a form to be selected first.';
		}
		dataUrl = $('#launch [name="data_url"]').val();
		if (dataUrl.length > 0 && !isValidUrl(dataUrl)){
			errorMsg = (errorMsg) ? errorMsg+'<br/>' : '';
			errorMsg += 'The publication link is not a valid url';
		}
		if (errorMsg && errorMsg.length > 0){
			$('#launch p.alert.alert-error').html(errorMsg).show();
		}
		else{
			$('#launch [name="server_url"]').val(state.server);
			$('#launch [name="form_id"]').val(state.id);
			$('#launch p.alert.alert-error').empty().hide();
			$('#launch form').submit();
		}
	});

	$('#launch a.advanced').click(function(event){
		event.preventDefault();
		if ($(this).hasClass('active')){
			$(this).text('show advanced options').removeClass('active').siblings('fieldset.advanced').hide();
		}
		else{
			$(this).text('hide advanced options').addClass('active').siblings('fieldset.advanced').show();
		}
	});

};

function isValidUrl(url){
	"use strict";
	return (/^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?[\/\w \.\-\=\&\?]*$/).test(url);
	//(url.match(/^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?[\/\w \.\-\=\&\?]*$/));
}

function resetForm(){
	"use strict";
	//$content.hide();
	//$upload.show();
	state.reset();
	//$('#upload-form')[0].reset();
	$('#upload-form input[type="hidden"]').val('');
	$('#form-list ul').empty().hide();
	$('#upload-form progress').hide();
	$('#input-switcher, #upload .hurry').show().find('a#server_url').click();
	$('#form-languages').remove();
	//gui.updateStatus.edit(false);
	$('#survey-form form, #xsltmessages div, #html5validationmessages div, #jrvalidationmessages div, #xmlerrors div, #xslerrors div, #html5-form-source textarea, #data textarea').empty();
	form = null;
	$('#validate-form').addClass('disabled');
	$('.nav li a[href="#upload"]').tab('show');
	//$tabs.hide();
}

function processResponse(xml){
	"use strict";
	var $response = $(xml);
	if ($response.find('formlist').length > 0){
		processFormlist($response);
	}
	else{
		processForm($response);
	}
}

function processForm($response)
{
	//$tabs.show();
	
	var formStr = new XMLSerializer().serializeToString($response.find('form')[0]);
	//data as string
	var jrDataStr = new XMLSerializer().serializeToString($response.find('instance')[0]);
	//extract messages
	var $xsltMsg = $response.find('xsltmessages message');
	//var $html5Msg = $response.find('html5validatormessages message');
	var $jrMsg = $response.find('jrvalidationmessages message');
	var $xmlMsg = $response.find('xmlerrors message');
	var $xslMsg = $response.find('xslformerrors message, xsldataerrors message');

	$('#upload-form progress').hide();
	
	if(formStr.length > 0){
		$('#html5-form-source textarea').empty().text(vkbeautify.xml(formStr));
		$('#html5-form-source form').submit();
		
		//important to use append with string and not $object for some reason => JQuery bug?
		$('#survey-form form').replaceWith(formStr);
		
		form = new Form('form.jr:eq(0)', jrDataStr);
		form.init();
			
		$('.nav a[href="#survey-form"]').tab('show');
		
		//set event handlers for changes in form input fields
		$(document).on('change dataupdate', 'form.jr', updateData);

		//enable buttons
		$('#validate-form').removeClass('disabled');
	}
	else {
		$('#survey-form div').empty();
		$('.nav li a[href="#report"]').tab('show');
	}
	
	if (form && form.getDataStr().length > 0){
		updateData();
	}
	else{
		$('#data div').text('An error occurred whilst trying to extract the data.');
	}
	
	if (form && form.getDataStr().length > 0 && $xsltMsg.length === 0){
		$xsltMsg = $('<message class="success">Nothing reported back. A good sign if there are no other errors!</message>');
	}
	parseMsgList ($xsltMsg, $('#xsltmessages div'));

	if ($jrMsg.length === 0){
		$jrMsg = $('<message class="info">Something went wrong</message>');
	}
	parseMsgList ($jrMsg, $('#jrvalidationmessages div'));
	
	if ($xmlMsg.length === 0){
		$xmlMsg = $('<message class="success">Valid XML document!</message>');
	}
	parseMsgList ($xmlMsg, $('#xmlerrors div'));
	
	if ($xslMsg.length > 0){
		$xslMsg.each(function(){
			console.error('XSLT stylesheet error: '+$(this).text());
		});
	}
	//parseMsgList ($xslMsg, $('#xslerrors div'));
	
	if (form && form.getDataStr().length > 0 && $('#report .level-2, #report .level-3').length > 0){
		gui.showFeedback(error_msg);
	}
}

function processFormlist($response)
{
	"use strict";
	var formlistStr='';
	if ($response.find('formlist>li').length === 0){
		gui.showFeedback('Formlist at server '+state.server+' was found to be empty or the server is asleep.');
		return resetForm();
	}
	$response.find('formlist>li').each(function(){
		formlistStr += new XMLSerializer().serializeToString($(this)[0]);
	});
	$('#form-list ul').empty().append(formlistStr);//html($response.find('li'));
	$('#form-list ul li a').addClass('btn btn-block');
	//$('#form-list ol li a').button();
	$('#upload-form progress').hide();
	$('#form-list').show();//.addScrollbar();
}

function updateData(){
	"use strict";
	if (form){
		var dataStr = form.getDataStr(templateShow);
		//console.log('updating data tab');// with string: '+dataStr);
		$('#data textarea').empty().text(vkbeautify.xml(dataStr));
	}
	else {
		//console.log('nothing to do, there is no form');
	}
}

function parseMsgList(msgObj, targetEl){
	"use strict";
	var messageList = $('<ul></ul>');
	msgObj.each(function(){
		var level = '', liStr, cls, icon = '', message = $(this).text(),
			//icons = {'level-0':'info-sign', 'info':'info-sign' , 'info warning':'info','success':'ok-sign', 'level-1':'info-sign', 'level-2':'minus-sign','error': 'minus-sign', 'level-3':'minus-sign'};
			classes = {'0':'info', 'info warning':'warning', '1':'warning', '2':'error', '3':'error'};
		//level += ($(this).attr('level')) ? 'level-'+$(this).attr('level') : $(this).attr('class');
		level = $(this).attr('level') ? $(this).attr('level') : $(this).attr('class');
		//icon = (icons[level]) ? 'icon-'+icons[level] : icon ;
		cls = (classes[level]) ? "text-"+classes[level] : "muted";
		liStr = '<li class="'+cls+'">'+message+'</li>';
				
		//avoid duplicate messages
		if (messageList.find('li').filter(function(){return $(this).text() == message;}).length === 0) {
			messageList.append(liStr);
		}
	});
	targetEl.empty().append(messageList);
}

function addJsError(message){
	"use strict";
	if ($('#jserrors div ul').length !== 1){
		$('#jserrors div').append('<ul></ul>');
	}
	$('#jserrors div ul').append('<li class="text-error">'+message+'</li>');
}

/*GUI.prototype.launchConfirm = function(){
	"use strict";
	var //afterFn,
		$launchDialog = $('#dialog-launch'),
		that = this;
	//errorMsg = errorMsg || '';
	this.confirm(
		{
			dialog: 'launch',
			msg:'Please provide the relevant details below to launch your survey.',
			heading:'Launch Parameters'//,
			//'errorMsg': errorMsg
		},
		{
			posButton: 'Ok',
			negButton: 'Cancel',
			posAction: function(){
				var //email = $launchDialog.find('[name="email"]').val(),
					//serverUrl = $launchDialog.find('[name="server_url"]').val(),
					dataUrl = $launchDialog.find('[name="data_url"]').val();
				if (dataUrl.length > 0 && !isValidUrl(dataUrl)){
					console.log('not a valid publication link');
					$launchDialog.find('.dialog-error').text('not a valid data url');
					//that.launchConfirm(errorMsg);
				}
				else{
					$launchDialog.find('.dialog-error').text('');
					$launchDialog.find('form').submit();
					//$launchDialog.find('a.ui-dialog-titlebar-close').click();
				}
			},
			negAction: function(){
				return false;
			},
			beforeAction: function(){
				//$launchDialog.find('fieldset.advanced').hide().siblings('a.advanced').removeClass('active');
				$launchDialog.find('[name="server_url"]').val(state.server);
				$launchDialog.find('[name="form_id"]').val(state.id);
			}//,
			//posDestroyAfter: false
		}
	);
};*/


// function odkValidate(){
//"use strict";
//var form = '<?xml version="1.0"?><h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa"><h:head><h:title>Basic</h:title><model><instance><!-- submitted data and defaults go here --><data id="basic"><StringData/></data></instance> <!-- add properties to the questions, like data types, skip logic, and constraints --><bind nodeset="/data/StringData" type="string" /></model></h:head><h:body>   <!-- define the questions that the user will fill out --><input ref="StringData"><label>please enter a string</label></input></h:body></h:html>';
//var url = 'formtranslate/validate'; //'https://www.commcarehq.org/formtranslate/validate';
////var datax$form'] = x$form.serialize();
//var content = new FormData();
//content.append('xform', form);
//$.ajax(url, {
//type: 'POST',
//data: content,
//contentType: false,
//processData: false,
//password: '',
//success: function(response){
//console.log('formtranslate validation response'+response);
////parseMsgList ($response.find('p.success, ol:not(.source) li>*:first-child'), $('#html5validationmessages div'));
//}
//});
// }


