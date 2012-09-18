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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global Modernizr, console:true*/
// CHANGE: it would be better to remove references to store and form in common.js
//
// Copyright 2012 Martijn van de Rijdt
/************ Global variables ***************/

var /**@type {GUI}*/ gui;

var DEFAULT_SETTINGS = {};

$(document).ready(function(){
	"use strict";
	gui = new GUI();
	gui.init();
	// avoid windows console errors
	if (typeof console == "undefined") {console = {log: function(){}};}
	if (typeof (window.console.debug) == "undefined") {console.debug = console.log;}

	if (getGetVariable('debug') !== 'true'){
		window.console.log = function(){};
		window.console.debug = function(){};
	}
});


/**
 * Class GUI deals with the main GUI elements (but not the survey form)
 * @constructor
 */
function GUI(){
	"use strict";
}

GUI.prototype.init = function(){
	"use strict";
		
	this.nav.setup();
	this.pages().init();
	this.setEventHandlers();
	// setup additional 'custom' eventHandlers declared other js file
	if (typeof this.setCustomEventHandlers === 'function'){
		this.setCustomEventHandlers();
	}
	
	$('.dialog [title]').tooltip();

	// checking for support for specific fancy css3 visual stuff
	if (Modernizr.borderradius && Modernizr.boxshadow && Modernizr.csstransitions && Modernizr.opacity){
		$(document).trigger('browsersupport', 'fancy-visuals');
	}

	$('footer').detach().appendTo('#container');
	//this.nav.reset();
	this.display();


};

GUI.prototype.setup = function(){
	"use strict";
	// final setup of GUI object
	$(window).trigger('resize');
	$('.ui-corner-all').removeClass('ui-corner-all'); //TEMPORARY
};
	
/**
 * Sets the default (common) UI eventhandlers (extended in each class for custom handlers)
 */
GUI.prototype.setEventHandlers = function(){
	"use strict";
	var that=this;
	
	// close 'buttons' on page and feedback bar
	$('#feedback-bar-close').button({'icons':{'primary': "ui-icon-closethick"}, 'text': false})
		.click(function(event){
			event.preventDefault();
			that.hideFeedback();
		});
	$('#page-close').button({'icons':{'primary': "ui-icon-closethick"}, 'text': false})
		.click(function(event){
			event.preventDefault();
			that.pages().close();
		});
	// override style of some buttons and give them a 'custom-button class'
	$('#feedback-bar-close, #page-close').removeClass().addClass('custom-button ui-widget-header ui-corner-all');
	
	// capture all internal links to navigation menu items (except the links in the navigation menu itself)
	$(document).on('click', 'a[href^="#"]:not([href="#"]):not(nav ul li a)', function(event){
		var href = $(this).attr('href');
		console.log('captured click to nav page, href='+href);
		//if href is not just an empty anchor it is an internal link and will trigger a navigation menu click
		if (href !== '#'){
			event.preventDefault();
			$('nav li a[href="'+href+'"]').click();
		}
	});

	// event handlers for navigation menu
	$('nav ul li a[href^="#"]')
		.click(function(event){
			event.preventDefault();
			var targetPage = $(this).attr('href').substr(1);
			that.pages().open(targetPage);
			$(this).closest('li').addClass('nav-state-active');//.css('border-color', headerBorderColor);
			//$(this).css('color', headerHighlightColor);
		});
	
	// handlers for status icons in header
	$(window).on('onlinestatuschange', function(e,online){
		that.updateStatus.connection(online);
		});

	$(document).on('edit', 'form.jr', function(event, status){
		//console.log('gui updating edit status icon');
		that.updateStatus.edit(status);
	});

	$(document).on('browsersupport', function(e, supported){
		that.updateStatus.support(supported);
	});

	$('#page, #feedback-bar').on('change', function(){
		that.display();
	});
			
	// more info on connection status after clicking icon
	$('header #status-connection')
		.click(function(event){
			that.showFeedback($(this).attr('title'));
			event.stopPropagation(); //prevent closing of simultaneously shown page when clicking icon
			//event.cancelBubble(); //IE
		});
		
	$(window).resize(function(){ //move this when feedback bar is shown?
		
		//console.log('resize event called, window width is '+$(window).width()); //DEBUG
		
		$('#container').css('top', $('header').outerHeight());
		
		// resizing scrollable container\
		//if ($('#form-controls.bottom').length > 0){
			$('body:not(.no-scroll) #container')
				.height($(window).height()-$('header').outerHeight()-$('#form-controls.bottom').outerHeight());
		//}
		//else{
		//	$('body:not(.no-scroll) #container')
		//		.height($(window).height()-$('header').outerHeight());//-$('#bottom-bar').outerHeight());
		//}
		// replacing form controls in mobile setting // REPLACE: SHOULD MOVE WITH CSS
		//$('body.no-scroll #form-controls')
		//	.css('height',$('#form-controls').height()).css('top', $('header').outerHeight()+$('#container').outerHeight());
		
		// hide logo if the navigation menu starts overlapping
		if ($('nav').length > 0){
			var navLeft = $('nav').offset().left;
			var logoRight = $('#logo').offset().left+$('#logo').outerWidth();
			//console.log('nav left:'+navLeft+' logo right:'+logoRight); // DEBUG
			if (navLeft < logoRight){
				$('#logo').css('visibility', 'hidden');
			}
			else {
				$('#logo').css('visibility', 'visible');
			}
		}
	});
};
	
GUI.prototype.nav = {
	setup : function(){
		"use strict";
		$('article.page').each(function(){
			var display, title='', id, link;
			id=$(this).attr('id');
			if ($(this).attr('data-display')){
				display = $(this).attr('data-display');
			}
			else display = id;
			if ($(this).attr('data-title')){
				title = $(this).attr('data-title');
			}
			else title = id;
			if ($(this).attr('data-ext-link')){
				link = $(this).attr('data-ext-link');
			}
			else link = '#'+id;
			$('<li class="ui-corner-tl ui-corner-tr"><a href="'+link+'" title="'+title+'" >'+display+'</a></li>')
				.appendTo($('nav ul'));
		
		});
	},
	reset : function(){
		"use strict";
		$('nav ul li').removeClass('nav-state-active');//.css('border-color', headerBackgroundColor);
		//$('nav ul li a').css('color', buttonBackgroundColorDefault);
	}
};

GUI.prototype.pages = function(){
	"use strict";

	this.init = function(){

		//this.showing = false;
		this.$pages = $('<pages></pages>');// placeholder 'parent' element for the articles (pages)
		// detaching pages from DOM and storing them in the pages variable
		$('article.page').detach().appendTo(this.$pages);//.css('display','block');
	};

	this.get = function(name){

		var $page = this.$pages.find('article[id="'+name+'"]');//.clone(true);
		//switch(name){
		//	case 'records':
			//_this.updateRecordList(page); // ?? Why does call with this.up.. not work?
		//		break;
		//	case 'settings':
		//}
		$page = ($page.length > 0) ? $page : $('article[id="'+name+'"]');
		
		return $page ;
		//}
	};
		
	this.isShowing = function(name){
		//no name means any page
		var idSelector = (typeof name !== 'undefined') ? '[id="'+name+'"]' : '';
		return ( $('#page article.page'+idSelector).length > 0 );
	};
		
	this.open = function(pg){
		var $page;
		if (this.isShowing(pg)){
			return;
		}

		$page = this.get(pg);//outsidePage;
		//console.debug('opening page '+pg);
		
		if ($page.length !== 1){
			return console.error('page not found');
		}

		if(this.isShowing()){
			this.close();
		}
			
		$('#page-content').prepend($page.show()).trigger('change');
		$('#overlay').show();

		//for some reason, the scrollbar needs to be added after a short delay (default duration of show() maybe)
		//similarly adding the event handler needs to be done a delay otherwise it picks up an even(?) instantly
		//addScrollBar should be called each time page loads because record list will change
		setTimeout(function(){
			$page.find('.scroll-list').addScrollBar();
			$('#overlay, header').bind('click.pageEvents', function(){
				//triggers a click of the page close button
				$('#page-close').trigger('click');
			});
		}, 50);
		
		// if the page is visible as well as the feedbackbar the display() method should be called if the window is resized
		$(window).bind('resize.pageEvents', function(){
			$('#page').trigger('change');
		});
	};
		
	this.close = function(){
		var $page;
		//console.log('closePage() triggered');
		$page = $('#page .page').detach();
		this.$pages.append($page);
		$('#page').trigger('change');
		this.nav.reset();
		$('#overlay').hide();
		$('#overlay, header').unbind('.pageEvents');
		$(window).unbind('.pageEvents');
	};

	return this;
};


/**
 * Shows an unobtrusive feedback message to the user.
 * 
 * @param {string=} message
 * @param {number=} duration
 */
GUI.prototype.showFeedback = function(message, duration){
	"use strict"; // duration in seconds
	var $msg,
		that = this;
	
	if (!duration){
		duration =  10 * 1000;// 10 seconds
	}
	else {
		duration = duration*1000; // convert to milliseconds
	}
	
	// max 2 messages displayed
	$('#feedback-bar p').eq(1).remove();
	
	// if an already shown message isn't exactly the same
	if($('#feedback-bar p').html() !== message){//} || feedbackEl.find('p').length === 0){
		$msg = $('<p></p>');
		$msg.text(message); // encodes special characters
		$('#feedback-bar').prepend($msg);
	}
	$('#feedback-bar').trigger('change');

	// automatically remove feedback after a period
	setTimeout(function(){
		if(typeof $msg !== 'undefined'){
			$msg.remove(); //find('#feedback-bar-message').empty();
		}
		$('#feedback-bar').trigger('change');
	}, duration);
};
	
GUI.prototype.hideFeedback = function(){
	"use strict";
	$('#feedback-bar p').remove();
	$('#feedback-bar').trigger('change'); //find('#feedback-bar-message').empty();
};

/**
 * Shows a modal alert box with a message.
 *
 * @param {string} message
 * @param {string=} heading
 * @param {string=} icon css class of icon
 */
GUI.prototype.alert = function(message, heading, icon){
	"use strict";
	var closeFn,
		$alert = $('#dialog-alert');

	heading = heading || 'Alert';
	icon = icon || 'ui-icon-alert';

	$alert.find('p .ui-icon:eq(0)').removeClass().addClass('ui-icon '+icon);
	//to call when dialog closes
	closeFn = function(){
		$alert.dialog('destroy');
		$alert.find('#dialog-alert-msg').text('');
		//console.log('alert dialog destroyed');
	};

	//write content into alert dialog
	$alert.find('#dialog-alert-msg').html(message).capitalizeStart();

	$alert.dialog({
		'title': heading,
		'modal': true,
		'resizable': false,
		'closeOnEscape': true,
		'buttons': {
			"Ok": closeFn
		},
		'beforeClose': closeFn,
		'width': 500
	});
};
	
/**
 * Function: confirm
 *
 * description
 *
 *   @param {?(Object.<string, (string|boolean)>|string)=} text - In its simplest form this is just a string but it can
 *                                                         also an object with parameters msg, heading and errorMsg.
 *   @param {Object=} choices - [type/description]
 */
GUI.prototype.confirm = function(text, choices){
	"use strict";
	var msg, heading, errorMsg, closeFn, dialogName, $dialog;
	
	if (typeof text === 'string'){
		msg = text;
	}
	else if (typeof text.msg === 'string'){
		msg = text.msg;
	}
	
	msg = (typeof msg !== 'undefined') ? msg : 'Please confirm action';
	heading = (typeof text.heading !== 'undefined') ? text.heading : 'Are you sure?';
	//errorMsg = (typeof text.errorMsg !== 'undefined') ? text.errorMsg : '';
	dialogName = (typeof text.dialog !== 'undefined') ? text.dialog : 'confirm';
	choices = (typeof choices !== 'undefined') ? choices : {};
	choices.posButton = choices.posButton || 'Confirm';
	choices.negButton = choices.negButton || 'Cancel';
	choices.posAction = choices.posAction || function(){return false;};
	choices.negAction = choices.negAction || function(){return false;};
	choices.beforeAction = choices.beforeAction || function(){};

	closeFn = function(){
		$dialog.dialog('destroy');
		$dialog.find('.dialog-msg, .dialog-error').text('');
		console.debug('dialog destroyed');
		//choices.afterAction.call();
	};

	$dialog = $('#dialog-'+dialogName);
	
	//write content into confirmation dialog
	$dialog.find('.dialog-msg').html(msg).capitalizeStart();
	//$dialog.find('.dialog-error').text(errorMsg).capitalizeStart();

	//instantiate dialog
	$dialog.dialog({
		'open': choices.beforeAction,
		'title': heading,
		'resizable': false,
		'modal': true,
		'closeOnEscape': true,
		'buttons': [
			{
				text: choices.posButton,
				click: function(){
					choices.posAction.call();
					//console.log('error text: '+$dialog.find('.dialog-error').text());
					if ($dialog.find('.dialog-error').text().length === 0){
						closeFn.call();
					}
				}
			},
			{
				text: choices.negButton,
				click: function(){
					choices.negAction.call();
					closeFn.call();
				}
			}
		],
		'width': 500,
		'beforeClose': closeFn
	});

};
	
GUI.prototype.updateStatus = {
	connection : function(online) {
		"use strict";
		console.log('updating online status in menu bar to:');
		console.log(online);
		if (online === true) {
			$('header #status-connection').removeClass().addClass('ui-icon ui-icon-signal-diag')
				.attr('title', 'It appears there is currently an Internet connection available.');
			$('.drawer #status').removeClass('offline waiting').text('');
		}
		else if (online === false) {
			$('header #status-connection').removeClass().addClass('ui-icon ui-icon-cancel')
				.attr('title', 'It appears there is currently no Internet connection');
			$('.drawer #status').removeClass('waiting').addClass('offline').text('Offline.');
		}
		else{
			$('.drawer #status').removeClass('offline').addClass('waiting').text('Waiting.');
		}
	},
	edit : function(editing){
		"use strict";
		if (editing) {
			$('header #status-editing').removeClass().addClass('ui-icon ui-icon-pencil')
				.attr('title', 'Form is being edited.');
		}
		else {
			$('header #status-editing').removeClass().attr('title', '');
		}
	},
	support : function(supported){
		"use strict";
		//console.debug('"this" in updateStatus.supported:');
		//console.debug(this);
		//BAD BAD BAD to refer to gui here!!
		var $page = gui.pages().get('settings');// : $('#settings');
		if ($page.length > 0){
			console.debug('updating browser support for '+supported);
			$page.find('#settings-browserSupport-'+supported+' span.ui-icon').addClass('ui-icon-check');
		}
	}
};


//function to operate the sliders that reveal the feedback bar and page by changing their css 'top' property
GUI.prototype.display = function(){
	"use strict";
	////console.log('display() called');
	var feedbackTop, pageTop,
		$header = $('header'),
		$feedback = $('#feedback-bar'),
		$page = $('#page');
	//the below can probably be simplified, is the this.page().isVisible check necessary at all?
	if ($feedback.find('p').length > 0){
		feedbackTop = $header.outerHeight(); // shows feedback-bar
		if (this.pages().isShowing()){
			pageTop = $header.outerHeight() + $feedback.outerHeight(); // shows page
		}
		else{
			pageTop = $header.outerHeight() + $feedback.outerHeight() - $page.outerHeight(); // hides page
		}
	}
	else{
		feedbackTop = $header.outerHeight() - $feedback.outerHeight();
		if (this.pages().isShowing()){
			pageTop = $header.outerHeight(); // shows page
		}
		else{
			pageTop = $header.outerHeight() - $page.outerHeight();
		}
	}
	$feedback.css('top', feedbackTop);
	$page.css('top', pageTop);
};

/**
 * [updateSettings description] Updates the settings in the GUI and triggers change events (used when app launches) that are handled in customEventHandlers.
 * It is generic and could be used for any kind of radio or checkbox settings.
 *
 * @param  {Object.<string, (boolean|string)>} settings [description]
 *
 */
GUI.prototype.setSettings = function(settings){
	"use strict";
	var $input,
		that = this;
	console.log('gui updateSettings() started'); //DEBUG
	
	$.each(settings, function(key, value){ //iterate through each item in object
		//console.log('key:'+key+' value:'+value);// DEBUG
		$input = (value) ? that.pages().get('settings').find('input[name="'+key+'"][value="'+value+'"]') :
			that.pages().get('settings').find('input[name="'+key+'"]');

		value = (value) ? true : false;
		if ($input.length > 0){
			//could change this to only trigger change event if value is changed but not so important
			$input.attr('checked', value).trigger('change');
		}
	});
};

function getGetVariable(variable) {
	"use strict";
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return encodeURI(pair[1]);// URLs are case senstive!.toLowerCase();
		}
	}
	return false;
}




/**
 * Pads a string with prefixed zeros until the requested string length is achieved.
 * @param  {number} digits [description]
 * @return {String|string}        [description]
 */
String.prototype.pad = function(digits){
		var x = this;
		while (x.length < digits){
			x = '0'+x;
		}
		return x;
};
/*
 *
 *  Provides a central switch for application reporting
 *
 *  It is e.g. possible to output console.error to the user instead of to the console and use
 *  the url debug GET variable to switch back tot the console.
 *  Or it can be customized to switch e.g. console.log off completelt without having to comment out lines
 *  or it can be used to log to a variable/localStorage/sessionStorage and send a crash report to the server
 *  The possibilies to customize this are endless!
 *
 *  NOTE: NOT TESTED WHEN USING APPLICATION CACHE - THIS PROBABLY MESSES THINGS UP!
 */
 
/**
 * @constructor
 *
 * Function (Class): Report
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
//function Report(){
//	"use strict";
//	var output;
//	var debug = getGetVariable('debug') || false;//

//	// avoid windows console errors
//	if (typeof(window.console) == "undefined") {console = {log: function(){}};}
//	if (typeof(console.debug) == "undefined") {console.debug = console.log;}
//
//	console.log('Report object initialized with debug = '+debug);
//
//	this.error = function(message){
//		output('error', message);
//	};
//
//	this.log = function(message){
//		output('log', message);
//	};
//
//	this.debug = function(message){
//		output('debug', message);
//	};
//
//	output = function(type, message){
//		// if in debug mode or if gui isn't available: just output to console
//		if (typeof gui == 'undefined' || (typeof debug !== 'undefined' && debug == 'true') ){
//			console[type](message);
//		}
//		// if gui is available and type = error
//		else if (type === 'error'){
//			console[type](message);
//			//gui.alert('You discovered a bug in the application or an error in the form! (see javascript console) Please report this to rapaide@aidwebsolutions.com.');
//		}
//		// if gui is available
//		else {
//			//nada
//		}
//	};
//}

/************ JQuery Extensions **************/

	
(function($){
	"use strict";
	// give a set of elements the same (longest) width
	$.fn.equalWidth = function(){
		var largestWidth = 0;
		return this.each(function(){
			if ($(this).width() > largestWidth) {
				largestWidth = $(this).width();
			}
		}).each(function(){
			$(this).width(largestWidth);
		});
	};
	
	//reverse jQuery collection
	$.fn.reverse = [].reverse;
	
	// Alphanumeric plugin for form input elements see http://www.itgroup.com.ph/alphanumeric/
	$.fn.alphanumeric = function(p) {

		p = $.extend({
			ichars: "!@#$%^&*()+=[]\\\';,/{}|\":<>?~`.- ",
			nchars: "",
			allow: ""
		}, p);

		return this.each
			(
				function()
				{

					if (p.nocaps) p.nchars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
					if (p.allcaps) p.nchars += "abcdefghijklmnopqrstuvwxyz";
					
					var s = p.allow.split('');
					for (var i=0;i<s.length;i++) if (p.ichars.indexOf(s[i]) != -1) s[i] = "\\" + s[i];
					p.allow = s.join('|');
					
					var reg = new RegExp(p.allow,'gi');
					var ch = p.ichars + p.nchars;
					ch = ch.replace(reg,'');

					$(this).keypress
						(
							function (e)
								{
									var k;
									if (!e.charCode) k = String.fromCharCode(e.which);
										else k = String.fromCharCode(e.charCode);
										
									if (ch.indexOf(k) != -1) e.preventDefault();
									if (e.ctrlKey&&k=='v') e.preventDefault();
									
								}
								
						);
						
					$(this).bind('contextmenu',function () {return false;});
									
				}
			);

	};

	$.fn.numeric = function(p) {
	
		var az = "abcdefghijklmnopqrstuvwxyz";
		az += az.toUpperCase();

		p = $.extend({
			nchars: az
		}, p);

		return this.each (function()
			{
				$(this).alphanumeric(p);
			}
		);
			
	};
	
	$.fn.alpha = function(p) {

		var nm = "1234567890";

		p = $.extend({
			nchars: nm
		}, p);

		return this.each (function()
			{
				$(this).alphanumeric(p);
			}
		);
			
	};

	// plugin to select the first word(s) of a string and capitalize it
	$.fn.capitalizeStart = function (numWords) {
		if(!numWords){
			numWords = 1;
		}
		var node = this.contents().filter(function () {
			return this.nodeType == 3;
			}).first(),
			text = node.text(),
			first = text.split(" ", numWords).join(" ");

		if (!node.length)
			return;
	
		node[0].nodeValue = text.slice(first.length);
		node.before('<span class="capitalize">' + first + '</span>');
	};


	//function to add a scrollbar to the list of records, if necessary
	$.fn.addScrollBar = function(){
		return this.each(function(){
			//scrollpane parts
			var scrollPane = $(this), //('#records-saved-pane'),
				scrollContent = $(this).find('ol');//('#records-saved ol');

			//change the main div to overflow-hidden as we can use the slider now
			scrollPane.css('overflow','hidden');
			
			//compare the height of the scroll content to the scroll pane to see if we need a scrollbar
			var difference = scrollContent.height()-scrollPane.height();//eg it's 200px longer
			
			if(difference>0){//if the scrollbar is needed, set it up...
				var proportion = difference / scrollContent.height();//eg 200px/500px
				var handleHeight = Math.round((1-proportion)*scrollPane.height());//set the proportional height - round it to make sure everything adds up correctly later on
				handleHeight -= handleHeight%2; //ensure the handle height is exactly divisible by two
				
				$('#records .column.middle').html('<div id="slider-wrap" class="ui-corner-all"><div id="slider-vertical"></div></div>');//append the necessary divs so they're only there if needed
				$("#slider-wrap").height(scrollPane.outerHeight());//set the height of the slider bar to that of the scroll pane
				
				//set up the slider
				$('#slider-vertical').slider({
					orientation: 'vertical',
					range: 'max',
					min: 0,
					max: 100,
					value: 100,
					slide: function(event, ui) {
						var topValue = -((100-ui.value)*difference/100);
						//console.log('new topValue:'+topValue);
						scrollContent.css({top:topValue});//move the top up (negative value) by the percentage the slider has been moved times the difference in height
					}
				});

				// align the slider with the top of the scroll pane
				$('#slider-wrap').css('margin-top', $('#records-saved h3').outerHeight(true));
				//set the handle height and bottom margin so the middle of the handle is in line with the slider
				$(".ui-slider-handle").css({height:handleHeight,'margin-bottom':-0.5*handleHeight});

				var origSliderHeight = $("#slider-vertical").height();//read the original slider height
				var sliderHeight = origSliderHeight - handleHeight ;//the height through which the handle can move needs to be the original height minus the handle height
				var sliderMargin =  (origSliderHeight - sliderHeight)*0.5;//so the slider needs to have both top and bottom margins equal to half the difference
				$(".ui-slider").css({height:sliderHeight,'margin-top':sliderMargin});//set the slider height and margins
				
				//position the slider range div at the top of the slider wrap - this ensures clicks above the area through which the handle moves are OK
				$(".ui-slider-range").css({top:-sliderMargin});
				
				//add a click function to ensure clicks below the area through which the handle moves are OK
				$("#slider-wrap").click(function(){//this means the bottom of the slider beyond the slider range is clicked, so move the slider right down
					$("#slider-vertical").slider("value", 0);
					scrollContent.css({top:-difference});
				});
				
				//additional code for mousewheel
				//$(".scrol-list, #slider-wrap").mousewheel(function(event, delta){
				//	var speed = 5;
				//	var sliderVal = $("#slider-vertical").slider("value");//read current value of the slider
				//
				//	sliderVal += (delta*speed);//increment the current value
				//	$("#slider-vertical").slider("value", sliderVal);//and set the new value of the slider
				//
				//	var topValue = -((100-sliderVal)*difference/100);//calculate the content top from the slider position
				//
				//	if (topValue>0) topValue = 0;//stop the content scrolling down too much
				//	if (Math.abs(topValue)>difference) topValue = (-1)*difference;//stop the content scrolling up too much
				//
				//	scrollContent.css({top:topValue});//move the content to the new position
				//	event.preventDefault();//stop any default behaviour
				//});
			}
		});
	};

})(jQuery);


