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

var /** @type {GUI}*/ gui;
var /** @type {Print} */ printO;
var DEFAULT_SETTINGS = {};

$(document).ready(function(){
	"use strict";
	gui = new GUI();
	gui.init();
	// avoid windows console errors
	if (typeof console == "undefined") {console = {log: function(){}};}
	if (typeof window.console.debug == "undefined") {console.debug = console.log;}

	if (getGetVariable('debug') !== 'true'){
		window.console.log = function(){};
		window.console.debug = function(){};
	}
	//override Modernizr's detection (for development purposes)
	if (getGetVariable('touch') == 'true'){
		Modernizr.touch = true;
		$('html').addClass('touch');
	}
	else if (getGetVariable('touch') == 'false'){
		Modernizr.touch = false;
		$('html').removeClass('touch');
	}

	printO = new Print();
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
	
	$('.dialog [title]').tooltip({});

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
};
	
/**
 * Sets the default (common) UI eventhandlers (extended in each class for custom handlers)
 */
GUI.prototype.setEventHandlers = function(){
	"use strict";
	var that=this;
	
	$('#feedback-bar .close')
		.click(function(event){
			event.preventDefault();
			that.hideFeedback();
		});

	$('#page a.close').click(function(event){
		event.preventDefault();
		that.pages().close();
	});
	
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
			$(this).closest('li').addClass('active');
			//$(this).closest('li').addClass('nav-state-active');//.css('border-color', headerBorderColor);
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
		/*if ($('nav').length > 0){
			var navLeft = $('nav').offset().left;
			var logoRight = $('.brand').offset().left+$('.brand').outerWidth();
			//console.log('nav left:'+navLeft+' logo right:'+logoRight); // DEBUG
			if (navLeft < logoRight){
				$('.brand').css('visibility', 'hidden');
			}
			else {
				$('.brand').css('visibility', 'visible');
			}
		}*/
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
			$('<li class=""><a href="'+link+'" title="'+title+'" >'+display+'</a></li>')
				.appendTo($('nav ul'));
		
		});
	},
	reset : function(){
		"use strict";
		$('nav ul li').removeClass('active');//.css('border-color', headerBackgroundColor);
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
			
		$('#page .content').prepend($page.show()).trigger('change');
		//$('#overlay').show();

		//for some reason, the scrollbar needs to be added after a short delay (default duration of show() maybe)
		//similarly adding the event handler needs to be done a delay otherwise it picks up an even(?) instantly
		//addScrollBar should be called each time page loads because record list will change
		/*setTimeout(function(){
			$page.find('.scroll-list').addScrollBar();
			$('#overlay, header').bind('click.pageEvents', function(){
				//triggers a click of the page close button
				$('#page-close').trigger('click');
			});
		}, 50);*/
		
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
		$('#feedback-bar').append($msg);
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
 * @param {string=} level bootstrap css class
 */
GUI.prototype.alert = function(message, heading, level){
	"use strict";
	var closeFn, cls,
		$alert = $('#dialog-alert');

	heading = heading || 'Alert';
	level = level || 'error';
	cls = (level === 'normal') ? '' : 'alert alert-block alert-'+level;

	//write content into alert dialog
	$alert.find('.modal-header h3').text(heading);
	$alert.find('.modal-body p').removeClass().addClass(cls).html(message).capitalizeStart();

	$alert.modal({
		keyboard: true,
		show: true
	});

	$alert.on('hidden', function(){
		$alert.find('.modal-header h3, .modal-body p').html('');
	});

	/* sample test code (for console):
	
		gui.alert('What did you just do???', 'Obtrusive alert dialog');

	 */
};
	
/**
 * Function: confirm
 *
 * description
 *
 *   @param {?(Object.<string, (string|boolean)>|string)=} texts - In its simplest form this is just a string but it can
 *                                                         also an object with parameters msg, heading and errorMsg.
 *   @param {Object=} choices - [type/description]
 */
GUI.prototype.confirm = function(texts, choices){
	"use strict";
	var msg, heading, errorMsg, closeFn, dialogName, $dialog;
	
	if (typeof texts === 'string'){
		msg = texts;
	}
	else if (typeof texts.msg === 'string'){
		msg = texts.msg;
	}
	
	msg = (typeof msg !== 'undefined') ? msg : 'Please confirm action';
	heading = (typeof texts.heading !== 'undefined') ? texts.heading : 'Are you sure?';
	errorMsg = (typeof texts.errorMsg !== 'undefined') ? texts.errorMsg : '';
	dialogName = (typeof texts.dialog !== 'undefined') ? texts.dialog : 'confirm';
	choices = (typeof choices !== 'undefined') ? choices : {};
	choices.posButton = choices.posButton || 'Confirm';
	choices.negButton = choices.negButton || 'Cancel';
	choices.posAction = choices.posAction || function(){return false;};
	choices.negAction = choices.negAction || function(){return false;};
	choices.beforeAction = choices.beforeAction || function(){};

	$dialog = $('#dialog-'+dialogName);
	
	//write content into confirmation dialog
	$dialog.find('.modal-header h3').text(heading);
	$dialog.find('.modal-body .msg').html(msg).capitalizeStart();
	$dialog.find('.modal-body .alert-error').html(errorMsg);

	//instantiate dialog
	$dialog.modal({
		keyboard: true,
		show: true
	});

	//set eventhanders
	$dialog.on('shown', function(){
		choices.beforeAction.call();
	});

	$dialog.find('button.positive').on('click', function(){
		choices.posAction.call();
		$dialog.modal('hide');
	}).text(choices.posButton);

	$dialog.find('button.negative').on('click', function(){
		choices.negAction.call();
		$dialog.modal('hide');
	}).text(choices.negButton);

	$dialog.on('hide', function(){
		//remove eventhandlers
		$dialog.off('shown hidden hide');
		$dialog.find('button.positive, button.negative').off('click');
	});

	$dialog.on('hidden', function(){
		$dialog.find('.modal-body .msg, .modal-body .alert-error, button').text('');
		//console.debug('dialog destroyed');
	});

	/* sample test code (for console):

		gui.confirm({
			msg: 'This is an obtrusive confirmation dialog asking you to make a decision',
			heading: 'Please confirm this action',
			errorMsg: 'Oh man, you messed up big time!'
		},{
			posButton: 'Confirmeer',
			negButton: 'Annuleer',
			posAction: function(){console.log('you just did something positive!')},
			negAction: function(){console.log('you did something negative')},
			beforeAction: function(){console.log('doing some preparatory work')}
		})

		gui.confirm('confirm this please');

	 */
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
			$('.drawer #status').removeClass('waiting').addClass('offline').text('Offline. ');
		}
		else{
			$('.drawer #status').removeClass('offline').addClass('waiting').text('Waiting. ');
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
	},
	offlineLaunch: function(offlineCapable){
		var status = (offlineCapable) ? 'Offline Launch: Yes' : 'Offline Launch: No';
		$('.drawer #status-offline-launch').text(status);
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
		feedbackTop = ($header.css('position') === 'fixed') ? $header.outerHeight() : 0; // shows feedback-bar
		if (this.pages().isShowing()){
			pageTop = $header.outerHeight() + $feedback.outerHeight(); // shows page
		}
		else{
			pageTop = 0 - $page.outerHeight(); // hides page
		}
	}
	else{
		feedbackTop = ($header.css('position') === 'fixed') ? $header.outerHeight() - $feedback.outerHeight() : 0 - $feedback.outerHeight();
		if (this.pages().isShowing()){
			pageTop = $header.outerHeight(); // shows page
		}
		else{
			pageTop = 0 - $page.outerHeight();
		}
	}
	$feedback.css('top', feedbackTop);
	$page.css('top', pageTop);
};

/**
 * Updates the settings in the GUI and triggers change events (used when app launches) that are handled in customEventHandlers.
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
 * Class dealing with printing
 * @constructor
 */
function Print(){
	"use strict";
	//var mpl,
	//	that = this;
	this.setStyleSheet();
	//IE, FF, the 'proper' way:
    if (typeof window.onbeforeprint !== 'undefined'){
		$(window).on('beforeprint', this.printForm);
    }
    //Chrome, Safari, Opera: (this approach has problems)
	//else {
	//	mpl = window.matchMedia('print');
	//	mpl.addListener(function(mql){
	//		if (mql.matches && !that.ongoing){
	//			that.ongoing = true;
	//			that.printForm();
	//			that.ongoing = false;
	//		}
	//		return false;
	//	});
	//}
}

Print.prototype.setStyleSheet = function(){
	this.styleSheet = this.getStyleSheet();
	this.$styleSheetLink = $('link[media="print"]:eq(0)');
};

Print.prototype.getStyleSheet = function(){
	for (var i = 0 ; i < document.styleSheets.length ; i++){
		if (document.styleSheets[i].media.mediaText === 'print'){
			return document.styleSheets[i];
		}
	}
	return null;
};

Print.prototype.styleToAll = function (){
	//sometimes, setStylesheet fails upon loading
	if (!this.styleSheet) this.setStyleSheet();
	//Chrome:
	this.styleSheet.media.mediaText = 'all';
	//Firefox:
	this.$styleSheetLink.attr('media', 'all');
};

Print.prototype.styleReset = function(){
	this.styleSheet.media.mediaText = 'print';
	this.$styleSheetLink.attr('media', 'print');
};

Print.prototype.printForm = function(){
	console.debug('preparing form for printing');
	this.styleToAll();
	this.addPageBreaks();
	this.styleReset();
	window.print();
};

Print.prototype.addPageBreaks = function(){
	// add Alex' code
};


	
(function($){
	"use strict";
	// give a set of elements the same (longest) width
	$.fn.toLargestWidth = function(){
		var largestWidth = 0;
		return this.each(function(){
			if ($(this).width() > largestWidth) {
				largestWidth = $(this).width();
			}
		}).each(function(){
			$(this).width(largestWidth);
		});
	};

	$.fn.toSmallestWidth = function(){
		var smallestWidth = 2000;
		return this.each(function(){
			console.log($(this).width());
			if ($(this).width() < smallestWidth) {
				smallestWidth = $(this).width();
			}
		}).each(function(){
			$(this).width(smallestWidth);
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


})(jQuery);


