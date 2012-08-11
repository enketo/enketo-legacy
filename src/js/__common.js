/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global Modernizr, console:true*/
// CHANGE: it would be better to remove references to store and form in common.js
//
// Copyright 2012 Martijn van de Rijdt
/************ Global variables ***************/

var /**@type {GUI}*/ gui, /**@type {StorageLocal}*/ store;

//form = null,
var DEFAULT_SETTINGS = {};
//var	_$pages; //getPage, addScrollBar, display, buttonArray, setSettings;
	//resetForm, setSettings, loadForm, deleteForm, saveForm,
// !Document.ready()
/************ Document Ready ****************/
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

// !Global Functions
/************ Global Functions ***************/



/* !GUI Class */
//The GUI object deals with the main GUI elements (but not the survey form elements)
/**
 *
 * @constructor
 *
 * Function (Class): GUI
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
function GUI(){
	"use strict";
	//var fbBar, //true if feedbackBar is shown
	//	page, //true if page is shown
	//	feedbackTimeout,
		//headerEl, feedbackEl, pageEl, confirmEl, alertEl, $form,
		//browserSupport = {'offline-launch':false, 'local-storage':false, 'fancy-visuals':false},
		//updateEditStatus,
		//_this=this;
		//$form = $('form.jr:eq(0)');
}

GUI.prototype.init = function(){
	"use strict";
	// setting up UI elements
	
	
	
	this.nav.setup();
	//setTabs();
	// setting consistent theme colors using a JQuery UI theme
	//this.setConsistentColors();
	this.pages().init();
	
	// setup eventHandlers
	this.setEventHandlers();
	// setup additional 'custom' eventHandlers declared other js file
	if (typeof this.setCustomEventHandlers === 'function'){
		this.setCustomEventHandlers();
	}
	$('#form-controls button').equalWidth();
	// the settings are retrieved from storage and applied before the pages are removed from the DOM
	
			//tooltips on all elements with a title
	//$('[title]').tooltip();
	//$("[title]").tipTip();
	//$("[title]").tipsy({gravity: $.fn.tipsy.autoNS});
	
	//transform comboboxes
	//$('#forms-saved-names').combobox();
	/*$('#forms-saved ol').selectable({
		stop: function() {
			var recordName;
			alert ($( ".ui-selected").text());
			$('ui-selected').removeClass('ui-selected');
			$(this).selectable('destroy');

		}
	});*/

	// checking for support for specific fancy css3 visual stuff
	if (Modernizr.borderradius && Modernizr.boxshadow && Modernizr.csstransitions && Modernizr.opacity){
		$(document).trigger('browsersupport', 'fancy-visuals');
	}

	$('footer').detach().appendTo('#container');
	//this.nav.reset();
};

GUI.prototype.setup = function(){
	"use strict";
	// final setup of GUI object
		//setSettings();
		// set height of scrollable container by calling resize event
		$(window).trigger('resize');
};


	
//	this.setBrowserSupport = function(propObj){
//		for (var propName in propObj){
//			browserSupport[propName] = propObj[propName];
//			//console.log('just set browser support property: '+propName+' to:'+propObj[propName]); // DEBUG
//		}
//	};
	
	
	// setting consistent theme colors, the purpose of using this function (instead of css stylesheet adjustments)
	// is to be able to easily switch to another jQuery UI theme
GUI.prototype.setConsistentColors = function(){
	"use strict";
	//$('body').removeClass('ui-widget-content'); //???????


	//var bodyBackgroundColor, pageBackgroundColor, headerHighlightColor, headerBorderColor, headerBackgroundColor, headerNavTextColor, //mainContentBackground,
//		buttonBackgroundColorDefault,buttonBackgroundColorHover, buttonBackgroundColorActive;
//	//colors used for different states in nav menu (see setEventHandlers())
//	headerHighlightColor = /** @type {string} */ $('#feedback-bar').css('background-color');
//	headerBorderColor =  /** @type {string} */ $('header').css('border-top-color');
//	headerBackgroundColor =  /** @type {string} */ $('header').css('background-color');
//	//mainContentBackground = $('body').addClass('ui-widget-content').css('background');
	

//	$('nav').addClass('ui-state-default'); //trick
//	headerNavTextColor =  /** @type {string} */ $('nav').css('color');
//	buttonBackgroundColorDefault =  /** @type {string} */ $('nav').css('background-color');
//	$('nav').addClass('ui-state-hover');
//	buttonBackgroundColorHover =  /** @type {string} */ $('nav').css('background-color');
//	$('nav').addClass('ui-state-active');
//	buttonBackgroundColorActive =  /** @type {string} */ $('nav').css('background-color');
//	$('nav').removeClass();
			
	//$('#logo').css('color', headerHighlightColor);

	//$('#page, #form-controls').css('background-image','none'); //CHANGE: DO THIS IN CSS STYLESHEET INSTEAD

	//$('#page, #component').css('color', headerHighlightColor);
	//$('#survey-info').css('color',headerBorderColor);

	//bodyBackgroundColor = /** @type {string} */ $('body').addClass('ui-widget-shadow').css('background-color');
	//$('body').css('background-color', bodyBackgroundColor).removeClass('ui-widget-shadow');
	//$('body').addClass('ui-widget-shadow') //trick
	//	.css('background-color', $('body').css('background-color'))
	//	.removeClass('ui-widget-shadow');
	//$('.question').css('border-color', $('body').css('background-color'));
	//pageBackgroundColor = /** @type {string} */ $('#page-content').addClass('ui-widget-overlay').css('background-color');
	//$('#page-content, #overlay').css('background-color', pageBackgroundColor).removeClass('ui-widget-overlay');
	//$('#page-content, #overlay').addClass('ui-widget-overlay') // trick
	//	.css('background-color', $('#page-content').css('background-color'))
	//	.removeClass('ui-widget-overlay');

	//all links in articles .page
	//$('.page a, .page a:link, .page a:visited').css('color', buttonBackgroundColorDefault)
//		.hover(function(){
//			$(this).css('color', buttonBackgroundColorHover);
//		}, function(){
//			$(this).css('color', buttonBackgroundColorDefault);
//		})
//		.mousedown(function(){
//			$(this).css('color', buttonBackgroundColorActive);
//		})
//		.mouseup(function(){
//			$(this).css('color', buttonBackgroundColorDefault);
//		});

	//form background on page with tabs
	//$('.tabs-nohdr .ui-tabs-panel').css('background-color', '#FEEEBD');

	//$('#export-excel').button({'icons': {'primary':"ui-icon-suitcase"}});

	//set navigation menu colors;
	
};
	
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
	$('a[href^="#"]:not(nav ul li a)').click(function(event){
		//console.log('captured click to internal link that is not in nav');
		var href = $(this).attr('href');
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
		//.hover(function(){
//;			$(this).closest('li').addClass('nav-state-hover');
//;			//$(this).css('color', buttonBackgroundColorHover);
//;			//$('nav ul li:not(.active)').css('border-color', headerBackgroundColor);
//;			//$(this).closest('li:not(.active)').css('border-color', headerHighlightColor)
//;				//.find('a').css('color', buttonBackgroundColorHover);
//;		}, function(){
//;			$(this).closest('li').removeClass('nav-state-hover');
//;			//$('nav ul li:not(.active)').css('border-color', headerBackgroundColor)
//;			//	.find('a').css('color', buttonBackgroundColorDefault);
//		});
	
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
		$('body:not(.no-scroll) #container')
			.height($(window).height()-$('header').outerHeight()-$('#form-controls.bottom').outerHeight());
		
		// replacing form controls in mobile setting // REPLACE: SHOULD MOVE WITH CSS
		//$('body.no-scroll #form-controls')
		//	.css('height',$('#form-controls').height()).css('top', $('header').outerHeight()+$('#container').outerHeight());
		
		// hide logo if the navigation menu starts overlapping
		var navLeft = $('nav').offset().left;
		var logoRight = $('#logo').offset().left+$('#logo').outerWidth();
		//console.log('nav left:'+navLeft+' logo right:'+logoRight); // DEBUG
		if (navLeft < logoRight){
			$('#logo').css('visibility', 'hidden');
		}
		else {
			$('#logo').css('visibility', 'visible');
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
	
	//function setTabs(){
	//	$('.main article').each(function(){
	//		var display, title='', id, link;
	//		id=$(this).attr('id');
	//		if ($(this).attr('data-display')){
	//			display = $(this).attr('data-display');
	//		}
	//		else display = id;
	//		if ($(this).attr('data-title')){
	//			title = $(this).attr('data-title');
	//		}
	//		else title = id;
	//		if ($(this).attr('data-ext-link')){
	//			link = $(this).attr('data-ext-link');
	//		}
	//		else link = '#'+id;
	//		$('<a href="'+link+'" title="'+title+'" >'+display+'</a>')
	//			.appendTo($('#tabs'));
	//	});
	//}
	//

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
			$page.find('.scrollbar').addScrollBar();
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
 * @param {string=} message
 * @param {string=} heading
 */
GUI.prototype.alert = function(message, heading){
	"use strict";
	var closeFn,
		$alert = $('#dialog-alert');

	heading = heading || 'Alert';

	//to call when dialog closes
	closeFn = function(){
		$alert.dialog('destroy');
		$alert.find('#dialog-alert-msg').text('');
		//console.log('alert dialog destroyed');
	};

	//write content into alert dialog
	$alert.find('#dialog-alert-msg').text(message).capitalizeStart();

	$alert.dialog({
		'title': heading,
		'modal': true,
		'resizable': false,
		'buttons': {
			"Ok": closeFn
		},
		'beforeClose': closeFn
	});
};
	
	/**
	 * Function: confirm
	 *
	 * description
	 *
	 * Parameters:
	 *
	 *   @param {string=} message - [type/description]
	 *   @param {Object=} choices - [type/description]
	 *   @param {string=} heading - [type/description]
	 *
	 * Returns:
	 *
	 *   return description
	 */
GUI.prototype.confirm = function(message, choices, heading){
	"use strict";
	var posFn, negFn, closeFn,
		$confirm = $('#dialog-confirm');
	message = message || 'Please confirm action';
	heading = heading || 'Are you sure?';
	choices = (typeof choices == 'undefined') ? {posButton: 'Confirm', negButton: 'Cancel'} : choices;
	choices.posButton = choices.posButton || 'Confirm';
	choices.negButton = choices.negButton || 'Cancel';
	choices.posAction = choices.posAction || function(){};
	choices.negAction = choices.negAction || function(){};
	posFn = choices.posAction;
	negFn = choices.negAction;
	//closing methods to call when user has selected an option // AND WHEN X or ESC is CLICKED!! ADD
	closeFn = function(){
		$confirm.dialog('destroy');
		$confirm.find('#dialog-confirm-msg').text('');
		//console.log('confirmation dialog destroyed');
	};
	
	//write content into confirmation dialog
	$confirm.find('#dialog-confirm-msg').text(message).capitalizeStart();

	//instantiate dialog
	$confirm.dialog({
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
	
GUI.prototype.updateStatus = {
	connection : function(online) {
		"use strict";
		console.log('updating online status in menu bar to:');
		console.log(online);
		if (online) {
			$('header #status-connection').removeClass().addClass('ui-icon ui-icon-signal-diag')
				.attr('title', 'It appears there is currently an Internet connection available.');
		}
		else {
			$('header #status-connection').removeClass().addClass('ui-icon ui-icon-cancel')
				.attr('title', 'It appears there is currently no Internet connection');
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
	////console.log ('top feedback: '+feedbackTop); //DEBUG
	////console.log ('top page: '+pageTop); //DEBUG
	$feedback.css('top', feedbackTop);
	$page.css('top', pageTop);
};

/**
 * [updateSettings description] Updates the settings in the GUI and triggers change events (used when app launches) that are handled in customEventHandlers.
 * It is generic and could be used for any kind of radio or checkbox settings.
 *
 * @param  {object} settings [description]
 * @return {[type]}          [description]
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
 * Settings class depends on Store Class
 *
 * @constructor
 */
function Settings(){
	"use strict";
}

Settings.prototype.init = function(){
	"use strict";
	var i, value, name,
		settings = this.get(),
		that = this;
	
	//set settings (loose coupling with GUI)
	$(document).trigger('setsettings', settings);
	//perform actions based on settings at launch
	//for (var prop in settings){
		
	//}
};

//communicates with local storage
Settings.prototype.get = function(setting){
	"use strict";
	return store.getRecord('__settings') || DEFAULT_SETTINGS;
};
//communicates with local storage and perform action linked with setting
//called by eventhandler in GUI.
Settings.prototype.set = function(setting, value){
	"use strict";
	var result,
		settings = this.get();
	console.debug('going to store setting: '+setting+' with value:'+value);
	settings[setting] = value;
	result = store.setRecord('__settings', settings);
	//perform action linked to setting
	if (typeof this[setting] !== 'undefined'){
		this[setting](value);
	}
	return (result === 'success' ) ? true : console.error('error storing settings');
};

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
				$("#records-saved-pane,#slider-wrap").mousewheel(function(event, delta){
					var speed = 5;
					var sliderVal = $("#slider-vertical").slider("value");//read current value of the slider
					
					sliderVal += (delta*speed);//increment the current value
					$("#slider-vertical").slider("value", sliderVal);//and set the new value of the slider
					
					var topValue = -((100-sliderVal)*difference/100);//calculate the content top from the slider position
					
					if (topValue>0) topValue = 0;//stop the content scrolling down too much
					if (Math.abs(topValue)>difference) topValue = (-1)*difference;//stop the content scrolling up too much
					
					scrollContent.css({top:topValue});//move the content to the new position
					event.preventDefault();//stop any default behaviour
				});
				
			}
		});

	};

})(jQuery);

