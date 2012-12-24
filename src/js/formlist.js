/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs 
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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global gui, Form, StorageLocal, Connection, Modernizr, getGetVariable, vkbeautify*/
var /** @type {Connection} */connection;
var /** @type {StorageLocal} */store;

window.addEventListener("load",function() {
	// Set a timeout...
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(0, 1);
	}, 0);
});

$(document).ready(function(){
	"use strict";
	var url;

	connection = new Connection();
	store = new StorageLocal();

	$('[title]').tooltip();

	gui.setup();

	/*** TEMPORARY FIX? https://github.com/twitter/bootstrap/issues/4550 ***/
	$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
	/*********************/

	$('.url-helper a')
		.click(function(){
			var helper, placeholder, value;
			$(this).parent().addClass('active').siblings().removeClass('active');
			helper = $(this).attr('data-value');
			placeholder = (helper === 'formhub' || helper === 'formhub_uni') ? 'enter formhub account' :
				(helper === 'appspot') ? 'enter appspot subdomain' : 'e.g. formhub.org/johndoe';
			value = (helper === 'formhub_uni') ? 'formhub_u' : '';
			
			$('input#server').attr('placeholder', placeholder);
			if ( $('input#server').val() !== value ){
				$('input#server').val(value).trigger('change');
			}
		})
		.andSelf().find('[data-value="formhub"]').click();

	$('input').change(function(){
		if ($(this).val().length > 0){
			$('.go').click();
		}
		return false;
	});

	$('.go').click(function(){
		var props,
			frag = $('input#server').val(),
			type = $('.url-helper li.active > a').attr('data-value');
		if ($('progress').css('display') === 'none'){
			props = {
				server: connection.oRosaHelper.fragToServerURL(type, frag),
				helper: $('.url-helper li.active > a').attr('data-value'),
				inputValue: $('input#server').val()
			};
			if (props.server){
				$('progress').show();
				connection.getFormlist(props.server, {
					success: function(resp, msg){
						processFormlistResponse(resp, msg, props);
					}
				});
			}
		}
	});

	$('#form-list').on('click', 'a', function(){
		console.log('caught click');
		var server, id,
			href = $(this).attr('href');
			
		//request a url first by launching this in enketo
		if ( !href || href === "" || href==="#" ){
			console.log('going to request enketo url');
			server = $(this).attr('data-server');
			id = $(this).attr('id');
			connection.getSurveyURL(server, id, {
				success: function(resp, msg){
					resp.serverURL = server;
					resp.formId = id;
					processSurveyURLResponse(resp, msg);
				}
			});
		}
		else{
			location.href=href;
		}
		return false;
	});

	loadPreviousState();
});

function loadPreviousState(){
	var i, list,
		server = store.getRecord('__current_server');
	if (server){
		$('.url-helper li').removeClass('active').find('[data-value="'+server.helper+'"]').parent('li').addClass('active');
		$('input#server').val(server.inputValue);
		list = store.getRecord('__server_'+server.url);
		gui.parseFormlist(list, $('#form-list'));
	}
}

function processFormlistResponse(resp, msg, props){
	var helper, inputValue;
	console.log('processing formlist response');
	if (typeof resp === 'object' && !$.isEmptyObject(resp)){
		store.setRecord('__server_' + props.server, resp, false, true);
		store.setRecord('__current_server', {'url': props.server, 'helper': props.helper, 'inputValue': props.inputValue}, false, true);
	}
	$('progress').hide();
	gui.parseFormlist(resp, $('#form-list'));
}

/**
 * Adds urls to links
 * @param  {?Object.<string, string>} resp [description]
 * @param  {string} msg  [description]
 */
function processSurveyURLResponse(resp, msg){
	var record,
		url = resp.url || null,
		server = resp.serverURL || null,
		id = resp.formId || null;
	console.debug(resp);
	console.debug('processing link to:  '+url);
	if (url && server && id){
		record = store.getRecord('__server_'+server) || {};
		record[id]['url'] = url;
		store.setRecord('__server_'+server, record, false, true);
		$('a[id="'+id+'"][data-server="'+server+'"]').attr('href', url).click();
	}
	else{
		//TODO: add error handling
	}
}