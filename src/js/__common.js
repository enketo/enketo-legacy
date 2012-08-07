/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global XPathJS, Modernizr, resetForm, connection*/
// CHANGE: it would be better to remove references to store and form in common.js
//
// Copyright 2012 Martijn van de Rijdt
/************ Global variables ***************/
/**@type {GUI}*/
var gui ;
/**@type {Storage}*/
var	store;
//form = null,
var	DEFAULT_SETTINGS = /**@type {Object} */ null;

var	getPage, addScrollBar, display, buttonArray, setSettings;
	//resetForm, setSettings, loadForm, deleteForm, saveForm,
// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function(){
	"use strict";
	gui = new GUI();
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

//function to update the settings record
function updateSettings(){
"use strict";
//console.log('updateSettings fired, with parameter settingsForm:'); //DEBUG
//
//// the intro message might also contain a setting: 'never show this message again'
//	//if(!settingsForm){
//		settingsForm = 'settings-form';
//	//}
//
//	//detect change
//	console.log('triggered by :'+$(this).attr('name')); // DEBUG
//
//	//save settings to localStorage
//	var data = form.getData(settingsForm);
//	//console.log('data scraped from '+settingsForm+': '+JSON.stringify(data)); // DEBUG
//	if (data !== null){ // CHECK IF AN EMPTY FORM REALLY RETURNS NULL!
//		var result = store.setRecord(data);
//		//console.log('result of attempt to save settings: '+result);
//		if (result !== 'success'){
//			gui.showFeedback('Error occurred when trying to save the settings.');
//		}
//	}
//	//make changes
//	updateSetting($(this));
}

// perform action according to the (changed) settings
function updateSetting(el){
	"use strict";
	var name = el.attr('name');
	//console.log('name of setting to update: '+name); // DEBUG
	switch(name){
		case 'settings-auto-upload':
			break;
		case 'settings-button-location':
			//var value = $(this).val();
			//$('#form-controls').removeClass().addClass(el.val());
			//console.log('found '+el.length+' radio elements with this name');
			for (var i = 0; i < el.length; i++) {
				if (el[i].checked === true) {
					//console.log('found radio input with required value'); // DEBUG
					$('#form-controls').removeClass('bottom right mobile').addClass(el[i].value);
					if (el[i].value==='mobile'){
						$('body').addClass('no-scroll');
					}
					else {
						$('body').removeClass('no-scroll');
					}
					$(window).trigger('resize');
				}
			}
			break;
	}
}

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
	var fbBar, //true if feedbackBar is shown
		page, //true if page is shown
		feedbackTimeout,
		headerEl, feedbackEl, pageEl, confirmEl, alertEl, $form,
		browserSupport = {'offline-launch':false, 'local-storage':false, 'fancy-visuals':false},
		headerHighlightColor, headerBorderColor, headerBackgroundColor, headerNavTextColor, //mainContentBackground,
		buttonBackgroundColorDefault,buttonBackgroundColorHover, buttonBackgroundColorActive, updateEditStatus,
		_this=this;
	
	this.init = function(){
		// setting up UI elements
		headerEl = $('header');
		feedbackEl = $('#feedback-bar');
		pageEl = $('#page');
		confirmEl = $('#dialog-confirm');
		alertEl = $('#dialog-alert');
		$form = $('form.jr:eq(0)');
		// checking for support for specific fancy css3 visual stuff
		if (Modernizr.borderradius && Modernizr.boxshadow && Modernizr.csstransitions && Modernizr.opacity){
			this.setBrowserSupport({'fancy-visuals':true});
		}
		setNav();
		//setTabs();
		// setting consistent theme colors using a JQuery UI theme
		setConsistentColors();
		
		// setup eventHandlers
		setEventHandlers();

		// setup additional 'custom' eventHandlers declared other js file
		if (typeof this.setCustomEventHandlers === 'function'){
			this.setCustomEventHandlers();
		}
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
		$('footer').detach().appendTo('#container');
	};


	
	// final setup of GUI object
	this.setup = function(){
		//setSettings();
		
		// set height of scrollable container by calling resize event
		$(window).trigger('resize');

		this.$pages = $('<pages></pages>');// placeholder 'parent' element for the articles (pages)
		
		// detaching pages from DOM and storing them in the pages variable
		$('article.page').detach().appendTo(this.$pages).css('display','block');
	
	};
	
	this.setBrowserSupport = function(propObj){
		for (var propName in propObj){
			browserSupport[propName] = propObj[propName];
			//console.log('just set browser support property: '+propName+' to:'+propObj[propName]); // DEBUG
		}
	};
	
	
	// setting consistent theme colors, the purpose of using this function (instead of css stylesheet adjustments)
	// is to be able to easily switch to another jQuery UI theme
	function setConsistentColors(){
		var bodyBackgroundColor, pageBackgroundColor;
		//colors used for different states in nav menu (see setEventHandlers())
		headerHighlightColor = /** @type {string} */ $('#feedback-bar').css('background-color');
		headerBorderColor =  /** @type {string} */ $('header').css('border-top-color');
		headerBackgroundColor =  /** @type {string} */ $('header').css('background-color');
		//mainContentBackground = $('body').addClass('ui-widget-content').css('background');
		$('body').removeClass('ui-widget-content');
		
		$('nav').addClass('ui-state-default'); //trick
		headerNavTextColor =  /** @type {string} */ $('nav').css('color');
		buttonBackgroundColorDefault =  /** @type {string} */ $('nav').css('background-color');
		$('nav').addClass('ui-state-hover');
		buttonBackgroundColorHover =  /** @type {string} */ $('nav').css('background-color');
		$('nav').addClass('ui-state-active');
		buttonBackgroundColorActive =  /** @type {string} */ $('nav').css('background-color');
		$('nav').removeClass();
				
		//$('#logo').css('color', headerHighlightColor);
		
		$('#page, #form-controls').css('background-image','none'); //CHANGE: DO THIS IN CSS STYLESHEET INSTEAD
		
		$('#page, #component').css('color', headerHighlightColor);
		$('#survey-info').css('color',headerBorderColor);
		
		bodyBackgroundColor = /** @type {string} */ $('body').addClass('ui-widget-shadow').css('background-color');
		$('body').css('background-color', bodyBackgroundColor).removeClass('ui-widget-shadow');
		//$('body').addClass('ui-widget-shadow') //trick
		//	.css('background-color', $('body').css('background-color'))
		//	.removeClass('ui-widget-shadow');
		//$('.question').css('border-color', $('body').css('background-color'));
		pageBackgroundColor = /** @type {string} */ $('#page-content').addClass('ui-widget-overlay').css('background-color');
		$('#page-content, #overlay').css('background-color', pageBackgroundColor).removeClass('ui-widget-overlay');
		//$('#page-content, #overlay').addClass('ui-widget-overlay') // trick
		//	.css('background-color', $('#page-content').css('background-color'))
		//	.removeClass('ui-widget-overlay');
		
		//all links in articles .page
		$('.page a, .page a:link, .page a:visited').css('color', buttonBackgroundColorDefault)
			.hover(function(){
				$(this).css('color', buttonBackgroundColorHover);
			}, function(){
				$(this).css('color', buttonBackgroundColorDefault);
			})
			.mousedown(function(){
				$(this).css('color', buttonBackgroundColorActive);
			})
			.mouseup(function(){
				$(this).css('color', buttonBackgroundColorDefault);
			});

		//form background on page with tabs
		$('.tabs-nohdr .ui-tabs-panel').css('background-color', '#FEEEBD');
	

		//set navigation menu colors;
		resetNav();
	}
	
	function setEventHandlers(){
		//var that=this;
		
		
		$('#form-controls button').equalWidth();
		
		// close 'buttons' on page and feedback bar
		$('#feedback-bar-close').button({'icons':{'primary': "ui-icon-closethick"}, 'text': false})
			.click(function(event){
				event.preventDefault();
				_this.hideFeedback();
			});
		$('#page-close').button({'icons':{'primary': "ui-icon-closethick"}, 'text': false})
			.click(function(event){
				event.preventDefault();
				_this.closePage();
			});
		// override style of some buttons and give them a 'custom-button class'
		$('#feedback-bar-close, #page-close').removeClass().addClass('custom-button ui-widget-header ui-corner-all');
		
		
		// capture all internal links to navigation menu items (except the links in the navigation menu itself)
		$('a[href^="#"]:not(nav ul li a)').click(function(event){
			console.log('captured click to internal link that is not in nav');
			
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
				_this.openPage(targetPage);
				$(this).closest('li').addClass('active').css('border-color', headerBorderColor);
				$(this).css('color', headerHighlightColor);
			})
			.hover(function(){
				//$(this).css('color', buttonBackgroundColorHover);
				$('nav ul li:not(.active)').css('border-color', headerBackgroundColor);
				$(this).closest('li:not(.active)').css('border-color', headerHighlightColor)
					.find('a').css('color', buttonBackgroundColorHover);
			}, function(){
				$('nav ul li:not(.active)').css('border-color', headerBackgroundColor)
					.find('a').css('color', buttonBackgroundColorDefault);
			});
		
		// handlers for status icons in header
		$(window).on('onlinestatuschange', function(e,online){
			_this.updateConnectionStatus(online);
			});
		$(document).on('edit', 'form.jr', function(){
			//console.log('gui updating edit status icon');
			updateEditStatus(true);
		});
				
		// more info on connection status after clicking icon
		$('header #status-connection')
			.click(function(event){
				_this.showFeedback($(this).attr('title'));
				event.stopPropagation(); //prevent closing of simultaneously shown page when clicking icon
				//event.cancelBubble(); //IE
			});
		
		// handlers for application settings [settings page]
		$('#settings input')
			.change(updateSettings);
				
		// handlers for input fields of forms page
		/*$('#forms-saved-names')
			.change(function(){
				var name = $(this).find('option:selected').val();
				loadForm(name);
			});*/
			
		
			
		$('#export-excel').button({'icons': {'primary':"ui-icon-suitcase"}});
			
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
	}
	
	function setNav(){
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
	}
	
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
	
	
	function resetNav(){
		$('nav ul li').removeClass('active').css('border-color', headerBackgroundColor);
		$('nav ul li a').css('color', buttonBackgroundColorDefault);
	}
	
	this.isFeedbackVisible = function(){
		return fbBar;
	};
	
	this.isPageVisible = function(){
		return page;
	};
	
	this.openPage = function(pg){
		var outsidePage;
		
		if(page){
			this.closePage();
		}
		page = true;
		if(pg){
			pageEl.find('#page-content').prepend(getPage(pg));
			// MOVE THIS:
			if (pageEl.find('.scrollbar').length > 0){
				addScrollBar(pageEl.find('.scrollbar')); //function should be called each time page loads because record list will change
			}
			//if (pg === 'settings'){
				//setSettings();
			//}
							
		}
		display();
		
		$('#overlay').show();
		
		//var that = this;
		
		//add temporary eventhandler for clicks outside the page
		/*$('#page').bind('mouseenter.hide', function(){
			////console.log('mouse entered'); // DEBUG
			outsidePage = false;
		});
		
		$('#page').bind('mouseleave.hide', function(){
			////console.log('mouse left'); // DEBUG
			outsidePage = true;
		
		});*/
		
		setTimeout(function(){ $('#overlay, header').bind('click.pageEvents', function(){
			//if (outsidePage){
				//that.closePage();
				////console.log('fired temporary handler');// DEBUG
				//triggers a click of the page close button
				$('#page-close').trigger('click');
			//}
		});
		}, 50); // prevent from firing immediately and not show page
		

		////console.log('page:'+pg); // DEBUG
		
		// if the page is visible as well as the feedbackbar the display() method should be called
		// to adjust the position in case the feedbackbar height changes (e.g. by going from single line to double line).
		$(window).bind('resize.pageEvents', function(){
			display();
		});
	};
	
	this.closePage = function(){
		//console.log('closePage() triggered'); //DEBUG
		page = false;
		//var oldPage = pageEl.find('article.page')
		pageEl.find('.page').detach(); //don't use remove, problem with buttons on data page (?)
		//pages.append(oldPage);
		display();
		resetNav();
		$('#overlay').hide();
		
		//$('#page').unbind('.hide');
		$('#overlay, header').unbind('.pageEvents');
		$(window).unbind('.pageEvents');
	};
	/**
	 * @param {string=} message
	 * @param {number=} duration
	 */
	this.showFeedback = function(message, duration){ // duration in seconds
		// This function can be improved by keeping original timeouts intact of multiple messages.
		// When a timeout expires of a particular only that message is removed
		
		if (!duration){
			duration =  10 * 1000;// 10 seconds
		}
		else {
			duration = duration*1000; // convert to milliseconds
		}
		
		//var that = this; //to give setTimeout access to hideFeedback
		
		clearTimeout(feedbackTimeout); // remove existing timeOut
		
		// automatically remove feedback after a period
		feedbackTimeout = setTimeout(function(){
			_this.hideFeedback();
		}, duration);
		
		fbBar = true;
		
		// max 2 messages displayed
		if(feedbackEl.find('p').length > 1){
			feedbackEl.find('p:eq(1)').remove(); //remove the first
		}
		// if an already shown message isn't exactly the same
		//console.log('html = '+feedbackEl.find('p').html()); // DEBUG
		//console.log('new msg = '+message); // DEBUG
		if(feedbackEl.find('p').html() !== message || feedbackEl.find('p').length === 0){
			var msg = $('<p></p>');
			msg.text(message); // encodes special characters
			feedbackEl.prepend(msg);
		}
		
		display();
		
	};
	
	this.hideFeedback = function(){
		//console.log('hideFeedback called'); //DEBUG
		fbBar = false;
		feedbackEl.find('p').remove(); //find('#feedback-bar-message').empty();
		display();
	};
	/**
	 * @param {string=} message
	 * @param {string=} heading
	 */
	this.alert = function(message, heading){
		var closeFn;
		heading = heading || 'Alert';

		//to call when dialog closes
		closeFn = function(){
			alertEl.dialog('destroy');
			alertEl.find('#dialog-alert-msg').text('');
			//console.log('alert dialog destroyed');
		};

		//write content into alert dialog
		alertEl.find('#dialog-alert-msg').text(message).capitalizeStart();

		alertEl.dialog({
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
	this.confirm = function(message, choices, heading){
		var posFn, negFn, closeFn;
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
			confirmEl.dialog('destroy');
			confirmEl.find('#dialog-confirm-msg').text('');
			//console.log('confirmation dialog destroyed');
		};
		
		//write content into confirmation dialog
		confirmEl.find('#dialog-confirm-msg').text(message).capitalizeStart();

		//instantiate dialog
		confirmEl.dialog({
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
		//console.log('leaving gui.confirm');
		//		if (!message){
//			message = 'Please confirm action';
//		}
//		if (!heading){
//			heading = 'Are you sure?';
//		}
//		if (!choices.posButton){
//			choices.posButton = 'Confirm';
//		}
//		if (!choices.negButton){
//			choices.negButton = 'Cancel';
//		}
//		if (!choices.posAction){
//			choices.posAction = '';
//		}
//		if (!choices.negAction){
//			choices.negAction = '';
//		}
//		buttonArray = {};
//		buttonArray[choices.posButton] = function(){
//				$(this).dialog("close");
//				if(choices.posAction) eval(choices.posAction); // if action is provided in function call
//		};
//		buttonArray[choices.negButton] = function(){
//				$(this).dialog("close");
//				if(choices.negAction) eval(choices.negAction); // if action is proved in function call
//		};
//
//		confirmEl.find('#dialog-confirm-msg').text(message).capitalizeStart();
//		confirmEl.dialog({
//			title: heading,
//			resizable: false,
//			modal: true,
//			buttons: buttonArray
//		});
	};
	
	//update connection status - this information is not used by other functions
	this.updateConnectionStatus = function(online) {
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
	};

	//update editing status
	updateEditStatus = function(editing){
		if (editing) {
			$('header #status-editing').removeClass().addClass('ui-icon ui-icon-pencil')
				.attr('title', 'Form is being edited.');
		}
		else {
			$('header #status-editing').removeClass().attr('title', '');
		}
	};
	
	//private function to operate the sliders that reveal the feedback bar and page by changing their css 'top' property
	display = function(){
		////console.log('display() called');
		var feedbackTop; //top feedback bar
		var pageTop; //top page
		if (fbBar){
			feedbackTop = headerEl.outerHeight(); // shows feedback-bar
			if (page){
				pageTop = headerEl.outerHeight() + feedbackEl.outerHeight(); // shows page
			}
			else{
				pageTop = headerEl.outerHeight() + feedbackEl.outerHeight() - pageEl.outerHeight(); // hides page
			}
		}
		else{
			feedbackTop = headerEl.outerHeight() - feedbackEl.outerHeight();
			if (page){
				pageTop = headerEl.outerHeight(); // shows page
			}
			else{
				pageTop = headerEl.outerHeight() - pageEl.outerHeight();
			}
		}
		////console.log ('top feedback: '+feedbackTop); //DEBUG
		////console.log ('top page: '+pageTop); //DEBUG
		feedbackEl.css('top', feedbackTop);
		pageEl.css('top', pageTop);
	};

	//private function that returns a clone of the hidden article elements in the document
	getPage = function(name){
		page = _this.$pages.find('article[id="'+name+'"]').clone(true);
		switch(name){
			case 'records':
				//_this.updateRecordList(page); // ?? Why does call with this.up.. not work?
				break;
			case 'settings':
		}
		return page;
	};
	
	//private function to add a scrollbar to the list of records, if necessary
	addScrollBar = function($pane){
		//scrollpane parts
		var scrollPane = $pane, //('#records-saved-pane'),
			scrollContent = $pane.find('ol');//('#records-saved ol');
		
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
		
	};
	
	
	//display the settings on the settings page
/**
 * Function: setSettings
 *
 * description
 *
 * Returns:
 *
 *   return description
 */
	setSettings = function(){
		var settings={}, inputElement;
		//console.log('gui setSettings() fired'); //DEBUG
		
		//a bit ugly hack to reset checkboxes (pages are cloned and revert back to state on the first load)
		// a setting for unchecked checkbox is empty which means it is not changed, so if the page is loaded
		// with a checkbox checked, then the user unchecks it, the next time settings page is shown it will checked without this hack
		$('form#settings-form input[type="checkbox"]').each(function(){
			//form.setInputElement($(this), false);
		});
		
		
		//if (store){
			//settings = store.getSettings();
		//}
		//else
		if (DEFAULT_SETTINGS){
			settings = DEFAULT_SETTINGS;
		}
		//console.log('settings received:'+settings);// DEBUG
		
		$.each(settings, function(key, value){ //iterate through each item in object
			//console.log('key:'+key+' value:'+value);// DEBUG
			inputElement = $('form#settings-form input[name="'+key+'"]');
			//form.setInputElement(inputElement, value);
			//updateSetting(inputElement);
			// ADD reference to setSelectElement() for select elements
		});
		
		if ($('[id^="settings-browserSupport"]').length>0){ //if there is such a 'setting'
			// display browser support
			for (var prop in browserSupport){
				var icon;
				if (browserSupport[prop]){
					icon = 'ui-icon-check';
				}
				else{
					icon = 'ui-icon-close';
				}
				//console.log(prop+' icon: '+icon)
				$('#settings-browserSupport-'+prop+' span.ui-icon').addClass(icon);
			}
		}
	};

}

//GUI.prototype.getPages = function(){
//	return this.pages;
//};

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

})(jQuery);

