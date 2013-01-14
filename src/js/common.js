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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global Modernizr, settings, console:true*/

// TODO: it would be better to remove references to store and form in common.js
var /** @type {GUI}*/ gui;
var /** @type {Print} */ printO;

$(document).ready(function(){
	"use strict";
	setSettings();
	gui = new GUI();
	gui.init();
	// avoid windows console errors
	if (typeof console == "undefined") {console = {log: function(){}};}
	if (typeof window.console.debug == "undefined") {console.debug = console.log;}

	if (!settings.debug){
		window.console.log = function(){};
		window.console.debug = function(){};
	}
	//override Modernizr's detection (for development purposes)
	if (settings.touch){
		Modernizr.touch = true;
		$('html').addClass('touch');
	}
	else if (settings.touch === false){
		Modernizr.touch = false;
		$('html').removeClass('touch');
	}
	printO = new Print();
});

function setSettings(){
	var i, queryVar,
		settingsMap =
		[
			{q: 'return', s: 'returnURL'},
			{q: 'showbranch', s: 'showBranch'},
			{q: 'debug', s: 'debug'},
			{q: 'touch', s: 'touch'},
			{q: 'server', s: 'serverURL'},
			{q: 'id', s: 'formId'}
		];
	for (i=0 ; i< settingsMap.length ; i++){
		queryVar = getQueryVar(settingsMap[i].q);
		//a query variable has preference
		settings[settingsMap[i].s] = (queryVar !== null) ?
			queryVar : (typeof settings[settingsMap[i].s] !== 'undefined') ? settings[settingsMap[i].s] : null;
	}
}

/**
 * Class GUI deals with the main GUI elements (but not the survey form)
 * @constructor
 */
function GUI(){
	"use strict";
}

/**
 * Initializes a GUI object.
 */
GUI.prototype.init = function(){
	"use strict";
		
	this.nav.setup();
	this.pages.init();
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
	this.positionPageAndBar();
};

/**
 * final setup of GUI object
 */
GUI.prototype.setup = function(){
	"use strict";
	$(window).trigger('resize');
};
	
/**
 * Sets the default (common) UI eventhandlers (extended in each class for custom handlers)
 */
GUI.prototype.setEventHandlers = function(){
	"use strict";
	var that=this;
	
	$(document).on('click', '#feedback-bar .close', function(event){
		that.feedbackBar.hide();
		return false;
	});

	$(document).on('click', '.touch #feedback-bar', function(event){
		that.feedbackBar.hide();
	});

	$(document).on('click', '#page .close', function(event){
		that.pages.close();
		return false;
	});

	$('button.print').on('click', function(){
		printO.printForm();
	});

	//$(document).on('click', '.touch #page', function(event){
	//	that.pages.close();
	//});
	
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
			that.pages.open(targetPage);
			$(this).closest('li').addClass('active').siblings().removeClass('active');
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
		that.positionPageAndBar();
	});
			
	// more info on connection status after clicking icon
	//$('header #status-connection')
	//	.click(function(event){
	//		that.feedback($(this).attr('title'));
	//		event.stopPropagation(); //prevent closing of simultaneously shown page when clicking icon
	//		//event.cancelBubble(); //IE
	//	});
	
	//move this when feedback bar is shown?
	//$(window).resize(function(){
	//	$('#container').css('top', $('header').outerHeight());
	//});
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
		$('nav ul li').removeClass('active');
	}
};

GUI.prototype.pages = {
	/**
	 * initializes the pages
	 */
	init : function(){
		// placeholder 'parent' element for the articles (pages)
		this.$pages = $('<pages></pages>');
		// detaching pages from DOM and storing them in the pages variable
		$('article.page').detach().appendTo(this.$pages);
	},

	/**
	 * Obtains a particular pages from the pages variable
	 * @param  {string} name id of page
	 * @return {jQuery}
	 */
	get : function(name){
		var $page = this.$pages.find('article[id="'+name+'"]');

		$page = ($page.length > 0) ? $page : $('article[id="'+name+'"]');
		
		return $page ;
	},
		
	/**
	 * Confirms whether a page with a particular id or any page is currently showing
	 * @param  {string=}  name id of page
	 * @return {boolean}       returns true or false
	 */
	isShowing : function(name){
		var idSelector = (typeof name !== 'undefined') ? '[id="'+name+'"]' : '';
		return ( $('#page article.page'+idSelector).length > 0 );
	},
	
	/**
	 * Opens a page with a particular id
	 * @param  {string} pg id of page
	 */
	open : function(pg){
		var $page,
			$header = $('header');
		if (this.isShowing(pg)){
			return;
		}

		$page = this.get(pg);
		
		if ($page.length !== 1){
			console.error('page not found');
			return;
		}

		if(this.isShowing()){
			this.close();
		}

		$('#page .content').prepend($page.show()).trigger('change');
		$('#page').show();
		
		$(window).bind('resize.pageEvents', function(){
			$('#page').trigger('change');
		});
	},
	
	/**
	 * Closes the currently shown page
	 */
	close : function(){
		var $page = $('#page .page').detach();//.length > 0) ? $('#page .page').detach() : [];
		if ($page.length > 0){
			this.$pages.append($page);
			$('#page').trigger('change');
			$('nav ul li').removeClass('active');
			//$('#overlay').hide();
			$('#overlay, header').unbind('.pageEvents');
			$(window).unbind('.pageEvents');
		}
	}
};


GUI.prototype.feedbackBar = {
	/**
	 * Shows an unobtrusive feedback bar to the user.
	 *
	 * @param {string} message
	 * @param {number=} duration duration in seconds for the message to show
	 */
	show : function (message, duration){
		"use strict";
		var $msg,
			that = this;
		
		duration = (duration) ? duration * 1000 : 10 * 1000;
		
		// max 2 messages displayed
		$('#feedback-bar p').eq(1).remove();
		
		// if an already shown message isn't exactly the same
		if($('#feedback-bar p').html() !== message){
			$msg = $('<p></p>');
			$msg.append(message);
			$('#feedback-bar').append($msg);
		}
		$('#feedback-bar').show().trigger('change');

		// automatically remove feedback after a period
		setTimeout(function(){
			if(typeof $msg !== 'undefined'){
				$msg.remove();
			}
			$('#feedback-bar').trigger('change');
		}, duration);
	},
	hide : function(){
		"use strict";
		$('#feedback-bar p').remove();
		$('#feedback-bar').trigger('change');
	}
};

/**
 * Select what type of unobtrusive feedback message to show to the user.
 *
 * @param {string}	message
 * @param {number=} duration duration in seconds for the message to show
 * @param {string=} heading  heading to show - defaults to information, ignored in feedback bar
 * @param {Object=} choices  choices to show - defaults to simple Close button, ignored in feedback bar for now
 */
GUI.prototype.feedback = function(message, duration, heading, choices){
	heading = heading || 'Information';
	if ($('header').css('position') === 'fixed'){
		this.feedbackBar.show(message, duration);
	}
	//a more obtrusive message is shown
	else if (choices){
		this.confirm({
			msg: message,
			heading: heading
		}, choices, duration);
	}
	else{
		this.alert(message, heading, 'info', duration);
	}
};

/**
 * Shows a modal alert box with a message.
 *
 * @param {string} message
 * @param {string=} heading
 * @param {string=} level bootstrap css class
 * @param {number=} duration duration in secondsafter which dialog should self-destruct
 */
GUI.prototype.alert = function(message, heading, level, duration){
	"use strict";
	var cls, timer,
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
		clearInterval(timer);
	});

	if (typeof duration === 'number'){
		var left = duration.toString();
		$alert.find('.self-destruct-timer').text(left);
		timer = setInterval(function(){
			left--;
			$alert.find('.self-destruct-timer').text(left);
		}, 1000);
		setTimeout(function(){
			clearInterval(timer);
			$alert.find('.close').click();
		}, duration * 1000);
	}

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
 *   @param {number=} duration duration in seconds after which dialog should self-destruct
 */
GUI.prototype.confirm = function(texts, choices, duration){
	"use strict";
	var msg, heading, errorMsg, closeFn, dialogName, $dialog, timer;
	
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
	$dialog.find('.modal-body .alert-error').html(errorMsg).show();
	if (!errorMsg) {
		$dialog.find('.modal-body .alert-error').hide();
	}

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

	if (typeof duration === 'number'){
		var left = duration.toString();
		$dialog.find('.self-destruct-timer').text(left);
		timer = setInterval(function(){
			left--;
			$dialog.find('.self-destruct-timer').text(left);
		}, 1000);
		setTimeout(function(){
			clearInterval(timer);
			$dialog.find('.close').click();
		}, duration * 1000);
	}

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
	
/**
 * Updates various statuses in the GUI (connection, form-edited, browsersupport)
 *
 * @type {Object}
 */
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
	support : function(supported){},
	offlineLaunch: function(offlineCapable){
		var status = (offlineCapable) ? 'Offline Launch: Yes' : 'Offline Launch: No';
		$('.drawer #status-offline-launch').text(status);
	}
};

/**
 * Returns the height in pixels that it would take for this element to stretch down to the bottom of the window
 * For now it's a dumb function that only takes into consideration a header above the element.
 * @param  {jQuery} $elem [description]
 * @return {number}       [description]
 */
GUI.prototype.fillHeight = function($elem){
	var bottom = $(window).height(),
		above = $('header').outerHeight(true),
		fluff = $elem.outerHeight() - $elem.height();
	return bottom - above - fluff;
};

/**
 * Makes sure sliders that reveal the feedback bar and page have the correct css 'top' property when the header is fixed
 */
GUI.prototype.positionPageAndBar = function(){
	"use strict";
	console.log('positionPageAndBar called');
	var fTop, pTop,
		$header = $('header'),
		hHeight = $header.outerHeight(),
		$feedback = $('#feedback-bar'),
		fShowing = ( $feedback.find('p').length > 0 ) ? true : false,
		fHeight = $feedback.outerHeight(),
		$page = $('#page'),
		pShowing = this.pages.isShowing(),
		pHeight = $page.outerHeight() ;

	//to go with the responsive flow, copy the css position type of the header
	$page.css({'position': $header.css('position')});//, 'margin': $header.css('margin'), 'width': $header.css('width')});

	if ($header.css('position') !== 'fixed'){
		if (!fShowing) {
			$feedback.hide();
		}
		if (!pShowing) {
			$page.hide();
		}
		return false;
	}

	fTop = (!fShowing) ? 0 - fHeight : hHeight;
	pTop = (!pShowing) ? 0 - pHeight : (fShowing) ? fTop + fHeight : hHeight;

	$feedback.css('top', fTop);
	$page.css('top', pTop);
 
	/*
	if ($feedback.find('p').length > 0){
		feedbackTop = ($header.css('position') === 'fixed') ? $header.outerHeight() : 0; // shows feedback-bar
		if (this.pages.isShowing()){
			pageTop = $header.outerHeight() + $feedback.outerHeight(); // shows page
		}
		else{
			pageTop = 0 - $page.outerHeight(); // hides page
		}
	}
	else{
		feedbackTop = ($header.css('position') === 'fixed') ? $header.outerHeight() - $feedback.outerHeight() : 0 - $feedback.outerHeight();
		if (this.pages.isShowing()){
			pageTop = $header.outerHeight(); // shows page
		}
		else{
			pageTop = 0 - $page.outerHeight();
		}
	}
	$feedback.css('top', feedbackTop);
	$page.css('top', pageTop);*/
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
		$input = (value) ? that.pages.get('settings').find('input[name="'+key+'"][value="'+value+'"]') :
			that.pages.get('settings').find('input[name="'+key+'"]');

		value = (value) ? true : false;
		if ($input.length > 0){
			//could change this to only trigger change event if value is changed but not so important
			$input.attr('checked', value).trigger('change');
		}
	});
};

/**
 * Parses a list of forms
 * @param  {?Array.<{title: string, url: string, server: string, name: string}>} list array of object with form information
 * @param { jQuery } $target jQuery-wrapped target node with a <ul> element as child to append formlist to
 * @param { boolean=} reset if list provided is empty and reset is true, no error message is shown
 */
GUI.prototype.parseFormlist = function(list, $target, reset){
	var i, listHTML='';
	if(!$.isEmptyObject(list)){
		for (i in list){
			listHTML += '<li><a class="btn btn-block btn-info" id="'+i+'" title="'+list[i].title+'" '+
				'href="'+list[i].url+'" data-server="'+list[i].server+'" >'+list[i].name+'</a></li>';
		}
		$target.removeClass('empty');
	}
	else {
		$target.addClass('empty');
		if (!reset){
			listHTML = '<p class="alert alert-error">Error occurred during creation of form list or no forms found</p>';
		}
	}
	$target.find('ul').empty().append(listHTML);
};

function getQueryVar(variableName) {
	"use strict";
	var queryVarVal,
		query = window.location.search.substring(1),
		vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0].toLowerCase() === variableName.toLowerCase()) {
			queryVarVal = encodeURI(pair[1]);
			return (queryVarVal === 'true') ? true : (queryVarVal === 'false') ? false : queryVarVal;
		}
	}
	return null;
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
    //if (typeof window.onbeforeprint !== 'undefined'){
	//	$(window).on('beforeprint', this.printForm);
    //}
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
	this.setDpi();
}

/**
 * Calculates the dots per inch and sets the dpi property
 */
Print.prototype.setDpi = function(){
	var dpi = {},
		e = document.body.appendChild(document.createElement("DIV"));
	e.style.width = "1in";
	e.style.padding = "0";
	dpi.v = e.offsetWidth;
	e.parentNode.removeChild(e);
	this.dpi = dpi.v;
};

/**
 * Sets print stylesheet properties
 */
Print.prototype.setStyleSheet = function(){
	this.styleSheet = this.getStyleSheet();
	this.$styleSheetLink = $('link[media="print"]:eq(0)');
};

/**
 * Gets print stylesheets
 * @return {Element} [description]
 */
Print.prototype.getStyleSheet = function(){
	for (var i = 0 ; i < document.styleSheets.length ; i++){
		if (document.styleSheets[i].media.mediaText === 'print'){
			return document.styleSheets[i];
		}
	}
	return null;
};

/**
 * Applies the print stylesheet to the current view by changing stylesheets media property to 'all'
 */
Print.prototype.styleToAll = function (){
	//sometimes, setStylesheet fails upon loading
	if (!this.styleSheet) this.setStyleSheet();
	//Chrome:
	this.styleSheet.media.mediaText = 'all';
	//Firefox:
	this.$styleSheetLink.attr('media', 'all');
};

/**
 * Resets the print stylesheet to only apply to media 'print'
 */
Print.prototype.styleReset = function(){
	this.styleSheet.media.mediaText = 'print';
	this.$styleSheetLink.attr('media', 'print');
};

/**
 * Prints the form after first setting page breaks (every time it is called)
 */
Print.prototype.printForm = function(){
	//console.debug('preparing form for printing');
	this.removePageBreaks();
	this.removePossiblePageBreaks();
	this.styleToAll();
	this.addPageBreaks();
	this.styleReset();
	window.print();
};

/**
 * Removes all current page breaks
 */
Print.prototype.removePageBreaks = function(){
	$('.page-break').remove();
};

/**
 * Removes all potential page breaks
 */
Print.prototype.removePossiblePageBreaks = function(){
	$('.possible-break').remove();
};


/**
 * Adds a temporary potential page break to each location in the form that is allowed to have one
 */
Print.prototype.addPossiblePageBreaks = function(){
	var possible_break = $("<hr>", {"class": "possible-break"/*, "style":"background-color:blue; height: 1px"*/});
	
	this.removePossiblePageBreaks();

	$('form.jr').before(possible_break.clone()).after(possible_break.clone())
		.find('fieldset>legend, label:not(.geo)>input:not(input:radio, input:checkbox), label>select, label>textarea,'+
			' .trigger>*, h4>*, h3>*, .jr-appearance-field-list>*')
		.parent().each(function() {
			var $this, prev;
			$this = $(this);
			prev = $this.prev().get(0);
			//some exceptions
			if (
				prev && ( prev.nodeName === "H3" || prev.nodeName === "H4" ) ||
				$(prev).hasClass('repeat-number') ||
				$this.parents('#jr-calculated-items, #jr-preload-items').length > 0 ||
				$this.parents('.jr-appearance-field-list').length > 0
				) {
				return null;
			} else {
				return $this.before(possible_break.clone());
			}
		});
	
	//correction of placing two direct sibling breaks
	$('.possible-break').each(function() {
		if ($(this).prev().hasClass('possible-break')) {
			return $(this).remove();
		}
	});
};

/**
 * Adds page breaks intelligently
 * Thank you, Alex Dorey!
 */
Print.prototype.addPageBreaks = function(){
	var i, page, page_a, page_h, pages, possible_break, possible_breaks, qgroup, qgroups, _i, _j, _k, _len, _len1, _ref,
		page_height_in_inches = 9.5,
		page_height_in_pixels = this.dpi * page_height_in_inches,
		pb = "<hr class='page-break' />",

		QGroup = (function() {
			/*
			This is supposed to be a representation of a "Question Group", which exists only to
			calculate the height of the question group and to make it easy to prepend a pagebreak
			if necessary.
			*/
			function QGroup(begin, end) {
				this.begin = $(begin);
				this.begin_top = this.begin.offset().top;
				this.end = $(end);
				this.end_top = this.end.offset().top;
				this.h = this.end_top - this.begin_top;
				if (this.h < 0) {
					console.debug('begin (top: '+this.begin_top+')', begin);
					console.debug('end (top: '+this.end_top+')', end);
					throw new Error("A question group has an invalid height.");
				}
			}

			QGroup.prototype.break_before = function() {
				var action, elem, prev, where_to_situate_breakpoint;
				prev = this.begin.prev().get(0);
				if (!prev) {
					where_to_situate_breakpoint = ['before', this.begin.parent().get(0)];
				} else {
					where_to_situate_breakpoint = ['after', prev];
				}
				action = where_to_situate_breakpoint[0], elem = where_to_situate_breakpoint[1];
				//console.debug('elem to place pb '+action+': ', elem);
				return $(elem)[action]( pb );
			};

			return QGroup;
		})();

	this.removePageBreaks();

	this.addPossiblePageBreaks();
	possible_breaks = $('.possible-break');

	qgroups = [];
	for (i = 1; i < possible_breaks.length ; i++){
		qgroups.push(new QGroup(possible_breaks[i - 1], possible_breaks[i]));
	}

	page_h = 0;
	page_a = [];
	pages = [];

	for (_j = 0, _len = qgroups.length; _j < _len; _j++) {
		qgroup = qgroups[_j];
		if ((page_h + qgroup.h) > page_height_in_pixels) {
			pages.push(page_a);
			page_a = [qgroup];
			page_h = qgroup.h;
		} else {
			page_a.push(qgroup);
			page_h += qgroup.h;
		}
	}

	pages.push(page_a);
	
	console.debug('pages: ', pages);

	//skip the first page
	for (_k = 1, _len1 = pages.length; _k < _len1; _k++) {
		page = pages[_k];
		if (page.length > 0) {
			page[0].break_before();
		}
	}

	//remove the possible-breaks
	return $('.possible-break').remove();
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

		return this.each(function(){

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
		});
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


