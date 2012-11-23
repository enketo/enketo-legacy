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
var /** @type {Settings}*/settings;

$(document).ready(function(){
	"use strict";
	var url;

	connection = new Connection();
	store = new StorageLocal();

	$('[title]').tooltip();

	gui.setup();

	$('.url-helper')
		.click(function(){
			var placeholder;
			$(this).parent().addClass('active').siblings().removeClass('active');
			placeholder = ($(this).attr('data-value') === 'formhub') ? 'enter formhub account' : 'e.g. formhub.org/johndoe';
			$('input#server_id').attr('placeholder', placeholder);
		})
		.andSelf().find('[data-value="formhub"]').click();

	$('input').change(function(){return false;});

	$('.go').click(function(){
		url = createURL();
		if (url){
			$('progress').show();
			connection.getFormList(url, processFormlistResponse);
		}
	});

	$('#form-list').on('click', 'a', function(){
		console.log('caught click');
		if ($(this).attr('href')){
			return;
		}
		//request a url first by launching this in enketo
		else{
			console.log('going to request enketo url');
			connection.getSurveyURL('http://formhub.org/martijnr', 'b2b_1', processLink);	
		}
		return false;
	});

});

function createURL(){
	var frag = $('input#server_id').val(),
		type = $('.active > .url-helper').attr('data-value'),
		protocol = (/^http(|s):\/\//.test(frag)) ? '' : (type === 'http' || type === 'https') ? type+'://' : null,
		serverURL = (protocol!==null) ? protocol+frag : 'https://formhub.org/'+frag;

	if (!frag){
		console.log('nothing to do');
		return null;
	}
	if (!connection.isValidUrl(serverURL)){
		console.error('not a valid url: '+serverURL);
		return null;
	}	
	console.log('server_url: '+serverURL);
	return serverURL;
}

function processFormlistResponse(resp, msg){
	console.log('processing formlist response');
	var formlistStr='',
		$xml = $(resp.responseXML);
	if ($xml.find('formlist>li').length === 0){
		gui.showFeedback('Formlist at server was found to be empty or the server is asleep.');
		return;// resetForm();
	}
	$xml.find('formlist>li').each(function(){
		formlistStr += new XMLSerializer().serializeToString($(this)[0]);
	});
	console.log('formliststr', formlistStr);
	$('#form-list ul').empty().append(formlistStr);
	$('#form-list ul li a').addClass('btn btn-block');
	$('progress').hide();
	$('#form-list').show();

	//A QUICK TEMPORARY HACK
	$('#form-list a').removeAttr('href');
}

function processLink(url){
	console.log('processing link to:  '+url);
}