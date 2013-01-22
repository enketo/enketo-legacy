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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global BlobBuilder, form, Form, connection, settings, vkbeautify, saveAs, gui, jrDataStr, report, Form, StorageLocal:true, Settings, Modernizr*/

$(document).ready(function(){
	var connection = new Connection(),
		defaultURLHelper = settings['defaultServerURLHelper'] || 'https';
	$('.url-helper')
		.click(function(){
			var placeholder;
			$(this).parent().addClass('active').siblings().removeClass('active');
			$('#url-helper-selected').attr('data-value', $(this).attr('data-value')).text($(this).text());
			placeholder = 'e.g. formhub.org/formhub_u';
			$('#test input').attr('placeholder', placeholder);
			return false;
		})
		.addBack().find('[data-value="'+defaultURLHelper+'"]').click();

	$('#test input').change(goToTester);

	function goToTester(){
		console.debug('going to form-tester');
		var frag = $('#test input').val(),
			type = $('#url-helper-selected').attr('data-value'),
			serverURL = connection.oRosaHelper.fragToServerURL(type, frag);
		if (serverURL){
			$('#test .error-msg').empty();
			location.href = '/formtester?server='+serverURL;
		}
		$('#test .error-msg').text('not a valid URL');
		$('#test input').val('');
		return false;
	}

	$('.features li a').on('click', function(){
		var feature = $(this).parent().attr('id'),
			$featureDetail = $('.features-detail .'+feature);

		console.debug('feature: '+feature);
		$(this).toggleClass('active').parent().siblings().find('a').removeClass('active');
		$featureDetail.toggleClass('show').siblings().removeClass('show');
		return false;
	});

	connection.getNumberFormsLaunched({
		success: function(resp){
			if (typeof resp === 'object' && resp.total && resp.total > 0){
				$('.form-count .counter').text(resp.total).parent().show(500);
			}
		}
	});
});