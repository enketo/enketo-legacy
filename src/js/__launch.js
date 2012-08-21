/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global GUI, gui, Form, Modernizr, getGetVariable, vkbeautify*/

var form, source, url, $tabs, $upload, _error, state,
	error_msg = 'There were errors. Please see the "report" tab for details.',
	templateShow = false;

$(document).ready(function(){
	"use strict";
	state = new State();
	state.init();
	//state.setUrl();

	_error = console.error;
	console.error = function(){
		addJsError(arguments[0]);
		gui.showFeedback(error_msg);
		return _error.apply(console, arguments);
	};

	//source = getGetVariable('source') || false;
	//url = getGetVariable('formurl') || false;

	if (!state.source){
		$('#html5-form-source').hide();
		$('li a[href="#html5-form-source"]').parent('li').remove();
	}
	$('#tabs').tabs();
	
	$('li a[href="#upload"]').parent('li').hide();
	$tabs = $('ul.ui-tabs-nav');
	$tabs.hide();
	
	//gui.init();
	gui.showFeedback('This is an incomplete pre-alpha preview to test the JavaRosa form functionality in Google Chrome. '+
		'It is not ready for actual use.', 3);
	//$('#form-controls #launch-form').button('disable');
	$('.main .ui-tabs-nav').removeClass('ui-widget-header');
	//$('.main .ui-tabs-nav li').width('141px');
	$('.main h2').addClass('ui-widget-header ui-corner-all');
	//$('article').addClass('ui-corner-tr');

	gui.setup();

	$('#upload-form [name="xml_file"]').change(function(){
		//console.log('file input change event detected');
		//$(this).find('img.loading').show();
		$('#upload-form').submit();
	});

	$('#upload-form').ajaxForm({
		'dataType': 'xml',
		'beforeSubmit': function(data, $form){
			//console.debug(data);\
			var serverUrl = $form.find('input[name="server_url"]').val() || '',
				formId = $form.find('input[name="form_id"]').val() || '';
				//xmlUrl = $form.find('input[name="xml_url"]').val() || '';
			// validate server url
			if ( serverUrl !== '' ){
				if (isValidUrl(serverUrl)){
					state.server = serverUrl;
					state.setUrl();
				}
				else{
					gui.alert('Not a valid server url');
					resetForm();
					//cancel submission
					return false;
				}
			}
			if ( formId !== '' ){
				state.id = formId;
				state.setUrl();
			}
			// validate form url
//			if ( xmlUrl !== '' ){
//				if (isValidUrl(xmlUrl)){
//					state.setIdFromUrl(xmlUrl);
//					state.setUrl();
//				}
//				else{
//					gui.alert('Sorry, the xml form url is not valid');
//					resetForm();
//					//cancel submissin
//					return false;
//				}
//			}
			$('#upload-form label, #input-switcher, #form-list, #upload .hurry').hide();
			$('#upload-form img.loading').show();
		},
		'success': processResponse,
		'error': function(){
			gui.showFeedback('Sorry, an error occured while communicating with the Enketo server.');
			resetForm();
		}
	});

//	$('#upload-form').submit(function(){
//		var content,
//			$form = $(this),
//			url = $form.attr('action'),
//			xmlFile = $form.find('input[name="xml_file"]').val() || '',
//			serverUrl = $form.find('input[name="server_url"]').val() || '',
//			xmlUrl = $form.find('input[name="xml_url"]').val() || '';//

//		console.debug('submitting');
//		//content.append('server_url', serverUrl);
//		//content.append('xml_url', xmlUrl);//

//		//if ( xmlFile !== ''){
//		//	content.append('xml_file', xmlFile);
//		//}
//		//else
//		if ( serverUrl !== ''){
//			if (isValidUrl(serverUrl)){
//				state.server = serverUrl;
//				state.setUrl();
//			}
//			else{
//				gui.alert('Not a valid server url');
//				return resetForm();
//			}
//		}
//		if (xmlUrl !== ''){
//			if (isValidUrl(xmlUrl)){
//				state.setIdFromUrl(xmlUrl);
//				state.setUrl();
//			}
//			else{
//				gui.alert('Sorry, the xml form url is not valid');
//				return resetForm();
//			}
//		}
//		content = new FormData($(this)[0]);
//
//		$.ajax(url, {
//			type: 'POST',
//			data: content,
//			cache: false,
//			contentType: false,
//			processData: false,
//			//dataType: 'text',
//			'beforeSubmit': function(){
//				$('#upload-form label, #input-switcher, #form-list').hide();
//				$('#upload-form img.loading').show();
//			},
//			complete: processResponse,
//			error: function(jqXHR, textStatus, errorThrown){
//				return;
//				//console.debug(jqXHR);
//				//console.debug('status: '+textStatus);
//				//console.debug('error: '+errorThrown);
//				//alert('error');
//				gui.showFeedback('Sorry, an error occured while communicating with the Enketo server.');
//				resetForm();
//			}
//		});
//	});

	$('#upload-form #input-switcher a')
		.hover(function(){
			$(this).toggleClass('ui-state-hover');
		})
		.click(function(e){
			console.debug('input switcher link clicked');
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
		$('#html5validationmessages div').html('<img class="loading" src="images/ajax-loader.gif" />');
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
	this.server = null;
	this.id = null;
	this.setUrl();
};

GUI.prototype.setCustomEventHandlers = function(){
	$('button#reset-form').button({'icons': {'primary':"ui-icon-refresh"}}).click(function(){
		resetForm();
	});
	
	$('button#launch-form').button({'icons': {'primary':"ui-icon-arrowthick-1-e"}}).click(function(){
		gui.alert('In the future this button will launch the form in Rapaide.survey '+
			'(now it just triggers validation of the whole form).', 'Not functional');
		$('form.jr').trigger('beforesave');
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
	$('#upload-form')[0].reset();
	$('#upload-form input[type="hidden"]').val('');
	$('#upload-form img.loading, #form-list').hide();
	$('#input-switcher, #upload .hurry').show().find('a#server_url').click();
	$('#form-languages').remove();
	gui.updateStatus.edit(false);
	$('#survey-form div, #xsltmessages div, #html5validationmessages div, #jrvalidationmessages div, #xmlerrors div, #xslerrors div, #html5-form-source textarea, #data textarea').empty();
	form = null;
	$('#tabs li a[href="#upload"]').click();
	$tabs.hide();
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
	$tabs.show();
	
	var formStr = new XMLSerializer().serializeToString($response.find('form')[0]);
	//data as string
	var jrDataStr = new XMLSerializer().serializeToString($response.find('instance')[0]);
	//extract messages
	var $xsltMsg = $response.find('xsltmessages message');
	//var $html5Msg = $response.find('html5validatormessages message');
	var $jrMsg = $response.find('jrvalidationmessages message');
	var $xmlMsg = $response.find('xmlerrors message');
	var $xslMsg = $response.find('xslformerrors message, xsldataerrors message');

	$('#upload-form img.loading').hide();
	
	if(formStr.length > 0){
		$('#html5-form-source textarea').empty().text(vkbeautify.xml(formStr));
		$('#html5-form-source form').submit();
		
		//important to use append with string and not $object for some reason => JQuery bug?
		$('#survey-form div').empty().append(formStr);
		
		form = new Form('form.jr:eq(0)', jrDataStr);
		form.init();
			
		$('#tabs li a[href="#survey-form"]').click();
		
		//set event handlers for changes in form input fields
		$(document).on('change dataupdate', 'form.jr', updateData);
	}
	else {
		$('#survey-form div').empty();
		$('#tabs li a[href="#report"]').click();
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
	$('#form-list ol').empty().append(formlistStr);//html($response.find('li'));
	$('#form-list ol li a').button();
	$('#upload-form img.loading').hide();
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
	var messageList = $('<ol></ol>');
	msgObj.each(function(){
		var level = '', liStr, icon = '', message = $(this).text(),
			icons = {'level-0':'info', 'info':'info' , 'info warning':'info','success':'circle-check', 'level-1':'info', 'level-2':'alert','error': 'alert', 'level-3':'alert'};
		
		level += ($(this).attr('level')) ? 'level-'+$(this).attr('level') : $(this).attr('class');
		icon = (icons[level]) ? 'ui-icon ui-icon-'+icons[level] : icon ;

		liStr = '<li class="'+level+'"><span class="'+icon+'"></span>'+message+'</li>';
				
		//avoid duplicate messages
		if (messageList.find('li').filter(function(){return $(this).text() == message;}).length === 0) {
			messageList.append(liStr);
		}
	});
	targetEl.empty().append(messageList);
}

function addJsError(message){
	"use strict";
	if ($('#jserrors div ol').length !== 1){
		$('#jserrors div').append('<ol></ol>');
	}
	$('#jserrors div ol').append('<li class="error"><span class="ui-icon ui-icon-alert"></span>'+message+'</li>');
}

GUI.prototype.launchConfirm = function(message, choices, heading){
	"use strict";
	var posFn, negFn, closeFn, rec,
		$launchConfirm = $('#dialog-launch');
	message = message || '';
	heading = heading || 'Launch Details';
	choices = (typeof choices == 'undefined') ? {} : choices;
	choices.posButton = choices.posButton || 'Ok';
	choices.negButton = choices.negButton || 'Cancel';
	posFn = choices.posAction || function(){
		//return saveForm($saveConfirm.find('[name="record-name"]').val(), Boolean($saveConfirm.find('[name="record-final"]:checked').val()));
	};
	negFn = choices.negAction || function(){
		return false;
	};

	//closing methods to call when user has selected an option // AND WHEN X or ESC is CLICKED!! ADD
	closeFn = function(){
		$launchConfirm.dialog('destroy');
		$launchConfirm.find('#dialog-msg').text('');
		//console.log('confirmation dialog destroyed');
	};

	//write content into confirmation dialog
	$launchConfirm.find('#dialog-msg').text(message).capitalizeStart();

	//instantiate dialog
	$launchConfirm.dialog({
		'title': heading,
		'resizable': false,
		'modal': true,
		'buttons': [
			{
				text: choices.posButton,
				click: function(){
					posFn.call();
					closeFn.call();
				}
			},
			{
				text: choices.negButton,
				click: function(){
					negFn.call();
					closeFn.call();
				}
			}
		],
		'beforeClose': closeFn
	});

};

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


