/* !Form Class */
//This 'class' deals only with manipulating the survey form DOM object
function Form ($form, dataStr){
	var _this = this;
	//var dataXML; //XML object - copy of <instance> in XForm?
	var $form = $form; //jQuery object of survey form
	var dataStr = dataStr;
	var $data;
	
	// initializes HTML Form object 
	this.init = function() {
		//remove default namespace declaration to facilitate easier XPath evaluations
		dataStr = dataStr.replace(/xmlns\=\"[a-zA-Z0-9\:\/\.]*\"/,'');
		$data = setDataObj(dataStr); // can also be done without temp variables, not sure what is best
		$data = stripspaces($data);

		//this seems an awkward way to create a copy of global variables
		//but in the future the form format (form.json) should be read into this.FORMAT
		//and form format variables are then accessible only through the form object.
		//Unfortunately, for now this causes strange errors in Safari and Opera (using AJAX)
//		this.KEY_NAME = $.trim(FORMAT.key);
//		this.KEY_LABEL = $.trim(FORMAT.key_label);
//		this.COUNTRY = $.trim(FORMAT.country);
//		this.SECTOR = $.trim(FORMAT.sector);
//		this.SURVEY_NAME = $.trim(FORMAT.name);
//		this.YEAR = $.trim(FORMAT.year);
//		this.VERSION=$.trim(FORMAT.version);
//		this.QUESTIONS=FORMAT.questions;
		
		//_this=this;
		
//		var built = this.display(FORMAT);
		//this.reset();
		// mark current form when the user appears to change content
//		$('#'+SURVEY_FORM_ID).change(function(){
		// delegated event handler ensure it will also fire when <repeat> elements are shallowly cloned
		$form.on('change', 'input, select, textarea', function(){
			//console.log('form will be marked as "changed"'); // DEBUG
			form.setEditStatus(true);
			var path = $(this).attr('name');
			var value = $(this).val();
			//ADD DETECTION FOR INDEX OF TRIGGER ELEMENT IN SIBLINGS WITH SAME NAME
			var index = $('[name="'+path+'"]').index(this);
			console.log('changing instance value of node: '+path+' with index: '+index+' to: '+value);
			setDataValue(path, value, index);
		});
		$('.main h2').addClass('ui-widget-header ui-corner-all');
		
		cloneTemplateNodes();
		setLanguages(); //also sets hints
		
		$form.find('.jr-hint').hide();
		
		setRepeats();
		beautify();
		setFormValues();
//		return built;
		return;
	}
	//***************************
	//public, just for debugging
	this.getDataO = function(){
		return $data;
	}
	//public, for debugging only
	this.setDataO = function(dataStr){
		setData(dataStr);
	}
	//public, for debugging only
	this.xPath = function(node){
		console.log('xpath: '+xPath(node));
	}
	//public, for debugging only
	this.setDataValue = function(path, value, index){
		setDataValue(path, value, index)
	}
	this.setFormValues = function(){
		setFormValues();
	}
	//****************************
	//keep public! (used for launch)
	
//	function cloneTemplateNodes(){
//		//clone data nodes with template (jr:template=) attribute if it doesn't have any siblings of the same name already
//		//strictly speaking this is not "according to the spec" as the user should be asked whether it has any data for this question
//		//but I think it is almost always better to assume at least one 'repeat' (= 1 question)
//		//IMPORTANT: do this in reverse so it starts with the lowest level element (to correctly clone repeats within repeats)!
//		$data.find('[template]').reverse().each(function(){
//			console.log('found data point with template attribute');
//			if ($(this).siblings($(this).prop('nodeName')).length == 0){
//				console.log('going to clone template node');
//				cloneDataNode($(this));
//			}
//		});
//	}
	
	function cloneTemplateNodes(startNode){
		if (typeof startNode == 'undefined' || startNode.length === 0){
			startNode = $data.find('instance');
		}
		//clone data nodes with template (jr:template=) attribute if it doesn't have any siblings of the same name already
		//strictly speaking this is not "according to the spec" as the user should be asked whether it has any data for this question
		//but I think it is almost always better to assume at least one 'repeat' (= 1 question)
		startNode.children().find('[template]').each(function(){
			console.log('found data point with template attribute');
			if (typeof $(this).parent().attr('template') == 'undefined' && $(this).siblings($(this).prop('nodeName')).length == 0){
				console.log('going to clone template node');
				$(this).clone().insertAfter($(this)).find('*').andSelf().removeAttr('template');
				//cloneDataNode($(this));
			}
		});
		startNode.children().not('[template]').each(function(){
			cloneTemplateNodes ($(this));
			
		});	
	}

	this.getDataStr = function(incTempl){
		if (typeof incTempl === 'undefined') {
			incTempl = true;
		}
		var $postData = $('<root></root');
		$data.find('instance').clone().appendTo($postData);
		
		if (incTempl === false){
			$postData.find('[template]').remove();
			console.log('removed templates');
		}
		return (new XMLSerializer()).serializeToString($postData.find('instance')[0]);
	}
		
	function setDataObj(dataStr){
		return $($.parseXML(dataStr));
	}
	
	function getFormValue(id){
	}
	
	//uses current content of $data to set the values in the form 
	function setFormValues(){
		$data.find('instance *').not('[template] *').filter(function()
		{
			var $this = $(this);
			return $this.children().length == 0 && $.trim($this.text()).length > 0;
			//return $this.children().length == 0 && $(this).prop('nodeValue') == 3;
		}).each(function(){ 
			//console.log('data found: '+$(this).text() + ' for node: '+$(this).prop('nodeName')+' with path: '+xPath($(this)));
			//var index = 0; //default
			var parent = $(this).parent();
			var parentName = parent.prop('nodeName');
			//console.log('repeat parent name: '+parentName);
			//if there are repeats…
			//get the index BUT do not include those elements with a template attribute OR ** THOSE WITH AN ANCESTOR WITH A TEMPLATE ATTRIBUTE**
			var index = $data.find(parentName+':not([template], [template] *)').index(parent);
			//if (parent.siblings(parentName+':not([template])').length > 0){
				//console.log('siblings found!');
				//index = parent.parent().children(parentName+':not([template])').index(parent);
			//}
			//console.log('index: '+index);
			//so for each data point that actually has a value
			
			//$(this).text( $.trim($(this).text()) );
			//console.log('changed to: '+$(this).text());
			//ADD MAKE THIS WORK FOR CHECKBOXES, RADIO BUTTONS AND SELECT
			var formEl = $form.find('[name="'+xPath($(this))+'"]').eq(index);
			if (formEl.length === 1){
				//console.log('form element with name '+formEl.attr('name')+' and index '+index+' found. Going to set value to: '+$(this).text());
				formEl.val($(this).text());
			}
			else{
				console.error('could not find form element with name '+xPath($(this))+' and index '+index);
			}
		});
	}
	
	function getDataValue(xpath){
	
	}
	
	//function nsResolver(prefix){
	//	return "http://www.w3.org/2002/xforms";
	//}
	
	function setDataValue(xpath, value, index){
		index = index || 0;
		var target = $data.find(jSelector(xpath)).not('[template] *').eq(index);
		if (target.length == 1){
			target.text(value);
		}
		else{
			console.error('CRITICAL ERROR: Data node: '+xpath+' with null-based index: '+index+' not found!');
		}

//SAVE!!		var evaluator = new XPathEvaluator();
//SAVE!!		//this resolver does not do anything, because there should be no namespace prefixes in <instance>
//SAVE!!		var nsResolver = document.createNSResolver($data.find('instance')[0]);
//SAVE!!		var result = evaluator.evaluate('/instance'+path, $data.find('instance')[0], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//SAVE!!		node = result.singleNodeValue;
//SAVE!!		
//SAVE!!		//find text node 		
//SAVE!!		x=node.firstChild;
//SAVE!!		while (x.nodeType!=3){
//SAVE!!  			x=x.nextSibling;
//SAVE!!  		}
//SAVE!!  		//or add text node if not present
//SAVE!!		if (!x || x.nodeType != 3){
//SAVE!!			console.log('appending child node');
//SAVE!!			/// *********
//SAVE!!		}
//SAVE!!		
//SAVE!!		console.log ('node: ' + node.nodeName);
//SAVE!!		//nodes[index].text(value);
//SAVE!!		node.firstChild.data = value;
//SAVE!!		console.log ('node data: '+node.firstChild.data);
	}
	
	function xPath(node){
		//SIBLINGS MAY ALSO HAVE SAME XPATH!!!
		steps = [node.prop('nodeName')];
		var parent = node.parent();
		while (parent.length == 1 && parent.prop('nodeName') !== 'instance'){
			steps.push(parent.prop("nodeName"));
			parent = parent.parent();
		}
		return '/'+steps.reverse().join('/');
	}
	
	//converts SIMPLE xpath in JQuery selector
	function jSelector(xpath){
		return xpath.replace(/\//g, ' ');
	}
	
	function stripspaces($obj){
		$obj.find('instance *').filter(function()
		{
			var $this = $(this);
			return $this.children().length == 0 && $.trim($this.text()).length > 0;
		}).each(function(){
			console.log('text found: '+$(this).text());
			$(this).text( $.trim($(this).text()) );
			console.log('changed to: '+$(this).text());
		});
		return $obj;
	}
	
	function beautify(){
		$form.find('.jr-group, .jr-repeat').addClass('ui-corner-all');
		/*$form.find('form > fieldset').alternateBackground('alt-bg');*/
	}
	
	function setRepeats(){
		$form.find('fieldset.jr-repeat').prepend('<span class="repeat-number"></span>');
		$form.find('fieldset.jr-repeat:not([data-repeat-fixed])')
			.append('<button type="button" class="repeat"></button><button type="button" class="remove"></button>');
		//var noDelete = false;
		//console.log('setRepeats called');
		//if(!repeatFieldset){
		//	repeatFieldset = $form.find('fieldset.jr-repeat');
		//	console.log('setting repeat event handlers on all repeat fieldsets in form');
		//	noDelete = true;
		//}
		//else if (repeatFieldset.length !== 1){
		//	console.error('setRepeats() called with '+repeatFieldset.length+' fieldset elements');
		//}
		//else{
		//	console.log('fieldset '+repeatFieldset.eq(0).html());
		//}
		
		$form.find('button.repeat').button({text: false, icons: {primary:"ui-icon-plusthick"}});
		$form.find('button.remove').button({disabled: true, text:false, icons: {primary:"ui-icon-minusthick"}});
		
		//delegated handlers (strictly speaking not required, but checked for doubling of events -> OK)
		$form.on('click', 'button.repeat:enabled', function(){
				//var master = ;	
				//console.log('repeat + button click event fired');		
				//create a clone of the html
				cloneRepeatNode($(this).parent('fieldset.jr-repeat'));
	  			//prevent default
	  			return false;
	  		});
	  	
		$form.on('click', 'button.remove:enabled', function(){
				removeRepeatNode($(this).parent('fieldset.jr-repeat'));
				//prevent default	
	  			return false;
	  	});
	  		  	
	  	//if the number of repeats is fixed
	  	$form.find('fieldset.jr-repeat[data-repeat-fixed]').each(function(){
	  		var numberOfRepeats = 1;
	  		//ADD CODE TO determine number of repeats from Xpath reference
	  		for (var i=1 ; i <  numberOfRepeats ; i++){
	  			//call repeatNode from child of $(this)
	  		}	  	
	  	});
	}
	
	function toggleRepeatButtons(node){
		if (!node){
			node = $form;
		}
		//first switch everything off and remove hover state
		node.find('button.repeat, button.remove').button('disable').removeClass('ui-state-hover');		
		node.find('fieldset.jr-repeat:last-child > button.repeat').button('enable');
		// the nth-child selector is a bit dangerous. It relies on this structure <fieldset class="jr-repeat"><h2></h2><label><label><label></fieldset>
		// alternatively, we could allow the first repeat to be deleted as well (as long as it is not the ONLY repeat)
		node.find('fieldset.jr-repeat:not(:nth-child(2)) > button.remove').button('enable'); //Improve this so that it enables all except first
	}
	
	function removeDataNode(node){
		console.log('removing dat node with name: '+node.prop('nodeName'));
		node.remove();
	}
	
//	//clone data node after all templates have been cloned (after initialization)
//	function cloneDataNode(node){
//		var nodeName = node.prop('nodeName');
//		var ancestor = node.parent();
//		var parentName = node.parent().prop('nodeName');
//		var ancestors = new Array(parentName);
//		console.log('cloning data node with name: '+nodeName+' and parent with name: '+parentName);
//		//the selector below ensures that if the parent of the template node is also a template node it will be bypassed
//		//MAYBE A BUG IF THE REPEATS ARE 3 LEVELS DEEP??? (-> need test case)
//		while (typeof ancestor.attr('template') !== 'undefined'){
//			ancestor = ancestor.parent();
//			ancestors.push(ancestor.prop('nodeName'));		
//		}
//		console.log('ancestors: '+JSON.stringify(ancestors));
//		ancestors.reverse();
//		for (var i=1; i<ancestors.length ;i++){
//			//now go back in reverse
//			ancestor = ancestor.children(ancestors[i]+':not(.template)').last();
//		}
//		
//		if (ancestor.length === 1){
//			node.clone().insertAfter(ancestor.children(nodeName).last()).find('*').andSelf().removeAttr('template');
//		}
//		else{
//			console.error('could not identify ancestor of data node ('+nodeName+') to clone (ancestors found: '+JSON.stringify(ancestors)+')');
//		}
//		
//		//	.insertAfter(node.parent().parent().children(parentName+':not([template])').children(nodeName).last())
//		//	.find('*').andSelf().removeAttr('template');
//	}
	
	
	function cloneDataNode(dataNode, insertAfterNode){
		if (dataNode.length === 1 && insertAfterNode.length ===1){
			dataNode.clone().insertAfter(insertAfterNode).find('*').andSelf().removeAttr('template');
		}
		else{
			console.error ('cloneDataNode function did not receive origin and target nodes')
		}
	}
	
	function removeRepeatNode(node){
		var delay = 600;
		//var parent = node.parent('fieldset.jr-repeat');
		var repeatPath = node.attr('name');
		var repeatIndex = $form.find('[name="'+repeatPath+'"]').index(node);
		//var parentSiblings = parent.siblings();
		var parentGroup = node.parent('fieldset.jr-group');
		node.hide('drop',{}, delay, function(){
			node.remove();
			parentGroup.numberRepeats();
			toggleRepeatButtons(parentGroup);
		});
		
		//now remove the data node
		var dataNode = $data.find(jSelector(repeatPath)).not('[template]').eq(repeatIndex);
		removeDataNode(dataNode);
		
		//needs to wait executing until hide animation and removal is complete
		//setTimeout(function(){
		//	grandparent.numberRepeats()
		//	toggleRepeatButtons(grandparent);
			
		//	}, delay+100); //oddly enough setting this to just 'delay' still sometimes executes it before DOM is updated.
			
		//$form.change();
		$form.trigger('dataupdate');

	}
	
	//accepts the node in which the repeat button was pressed (for now this button is only enabled on the last node)
	function cloneRepeatNode(node){
		if (node.length !== 1){
			console.error('Nothing to clone');
		}
		else{
			var master = node.parent('fieldset.jr-group').children('fieldset.jr-repeat:not(.clone)').eq(0);
			//create a clone and 
			var clone = master.clone(false);//deep cloning with button events causes problems
			//remove any clones inside this clone… (cloned repeats within repeats..)
			clone.find('.clone').remove();
			clone.addClass('clone');
			//re-initialize buttons
			clone.find('button.remove').button({text:false, icons: {primary:"ui-icon-minusthick"}});
			clone.find('button.repeat').button({text: false, icons: {primary:"ui-icon-plusthick"}});
			
			clone.insertAfter(node)
				//.find('button').removeClass('ui-state-hover')
				.parent('.jr-group').numberRepeats();
			clone.hide().show('highlight',{ },600); //animations that look okay: highlight, scale, slide
			//is this code actually working?
			clone.find('input, select, textarea').val(null);
			//clone.find('fieldset.jr-repeat').addClass('clone');
			
			
			toggleRepeatButtons(master.parent());
			
			//create a new data point in <instance> by cloning the template node
			var path = master.attr('name');
			
			var index = $form.find('[name="'+node.attr('name')+'"]').index(node); 
			//0-based index of node in a jquery resultset when using a selector with that name attribute
			console.log('index of form node to clone: '+index);
			if (path.length > 0 && index >= 0){
				//console.log ('path of repeat node: '+path);
				console.log('trying to locate node with path: '+path+' $("'+jSelector(path)+'[template])") to clone and insert after node with same jQuery selector and index: '+index);
				var templateNode = $data.find(jSelector(path)+'[template]');//.eq(index);
				var insertAfterNode = $data.find(jSelector(path)+':not([template])').eq(index);
				//var nodes = $data.find(jSelector(path)+'[template);

				if (templateNode.length === 1 && insertAfterNode.length === 1){
					console.log('found data repeat node with template attribute');
					cloneDataNode(templateNode, insertAfterNode);
					//templateNode.clone().insertAfter(templateNode.parent().children(templateNode.prop('nodeName')).last()).removeAttr('template');
					//ADD: fill cloned DOM elements with defaults from template
				}
				else{
					//console.error ('Could locate node: '+path+' with index '+index+' in data instance.There could be multiple template node (a BUG) or none.');
					console.error('Could not find template node and/or node to insert the clone after');
				}
			}
			else{
				console.error('Could not find repeat node in DOM');
			}
	//	  			var paths = new Array();
	//	  			$(this).siblings('label').find('input, select, textarea').each(function(){
	//	  				console.log('found sibling label of + button with input element');
	//	  				var path = $(this).attr('name');
	//	  				//if it doesn't already exist in array (checkboxes, radio buttons)
	//	  				if ($.inArray(path, paths) == -1){
	//	  					//push it in the array
	//	  					paths.push(path);
	//	  					// ADD INDEX OR ONLY ENABLE REPEAT ON LAST ELEMENT
	//	  					console.log('found cloned item with xpath: '+path);
	//	  				}
	//	  			});
	//	  			for (var i=0 ; i<paths.length ; i++){
	//	  			nodes = $data.find(jSelector(paths[i]));
	//	  			if (nodes.length > 0){
	//	  					console.log('trying to locate node with path: '+paths[i]+' $("'+jSelector(paths[i])+'")');
	//	  					if (nodes)
	//	  					nodes.last().clone().insertAfter(nodes.last());
	//	  				}
	//	  				else{
	//	  					console.error ('Could not locate node: '+paths[i]+' in data instance.');
	//	  				}
	//	  			}
			//fire form change event
			//clone.find('input, select, textarea').change();
			//set the values of the whole form - this will change the values of the cloned element to the defaults from the template
			setFormValues(); 
			$form.trigger('dataupdate'); //used in launch.js
			}
	  	
	}
//	this.numberRepeats = function(){
//		//:first-of-type does not have cross-browser support….
//		$form.find('fieldset.jr-group > fieldset.jr-repeat').each(function(){
//			console.log('found '+$form.find('fieldset.jr-group > fieldset.jr-repeat').length +' items');
//			// if it is the first-of-type			
//			if ($(this).prev('fieldset.jr-repeat').length === 0){
//				var repSiblings = $(this).siblings('fieldset.jr-repeat');
//				var qtyRepeats = repSiblings.length + 1;
//				console.log('number of repeats of '+$(this).attr('name')+' is '+qtyRepeats);
//				if (qtyRepeats > 1) {
//					$(this).find('span.repeat-number').text('1');
//					var i = 2;
//					repSiblings.each(function(){
//						console.log('numbering a repeat');
//						$(this).find('span.repeat-number').text(i);
//						i++;
//					});
//					
//				}
//				else{
//					$(this).find('span.repeat-number').empty();
//				}	
//			}
//			else{
//				console.log('not first of type');
//			}
//		});	
//	}
	
	function setLanguages() {
		var defaultLang = $form.find('#form-languages').attr('data-default-lang');
		//_this = this;
		//console.log('found default language: '+defaultLang);
		if (!defaultLang || defaultLang=="") {
			defaultLang = $form.find('#form-languages a:eq(0)').attr('lang');
		}
		console.log('default language is: '+defaultLang);
		$form.find('#form-languages').addClass('ui-helper-clearfix');
		$form.find('#form-languages a').click(function(event){
			event.preventDefault();
			var lang = $(this).attr('lang');
			$('#form-languages a').removeClass('active');
			$(this).addClass('active');
			//console.log('going to hide langauges');		
			$form.find('[lang]').not('.jr-hint').show().not('[lang="'+lang+'"], [lang=""], #form-languages a').hide();
			//BUG if only one lang option is available and the language changes, nothing is shown
			//swap language of <select> <option>s
			$form.find('select option').each(function(){
				value = $(this).attr('value');
				//console.log('option value is '+value);
				newLabel = $(this).parent().siblings().children('[data-option-value="'+value+'"][lang="'+lang+'"]').text();
				//console.log('new option label is '+newLabel);
				if (typeof newLabel !== 'undefined' && newLabel.length > 0){
					$(this).text(newLabel)
				}
			});			
			//$form.find('.jr-hint').hide();
			setHints();
		});
		$form.find('#form-languages a[lang="'+defaultLang+'"]').click();
	}
	
	//hints are reset every time the language changes
	function setHints(){
		var lang = $form.find('#form-languages a.active[lang]').attr('lang');
		//console.log('setting hints, lang is '+lang);
		$form.find('label').each(function(){
			var hint;
			//for forms that have multiple languages
			if ( lang!== 'undefined' && lang!=='' ){
				hint = $(this).find('span.jr-hint[lang="'+lang+'"]').text();
				// using text() means that if multiple elements are found (impossible?) the text values will be combined
			}
			//for forms with only one language
			else{
				hint = $(this).find('span.jr-hint').text();
			}	
			//console.log('hint found: '+hint);
			if (hint.length > 0){
				$(this).find('input, select').attr('title', hint);
			}
		});
		$form.tooltip();					
	}
	
	// builds up the form input elements and appends them to the DOM
	this.display = function(f) { 
		//console.log('starting to build form'); //DEBUG
//		try{
//			var i,j,q,questionElement=null,inputType;
//			var formContent = $('<div></div>');
//			$('<input id="recordType" name="recordType" type="hidden" value="surveyData" />').appendTo(formContent);
//			//console.log(f.questions.length+' questions found in form format object'); //DEBUG
//			for (i=0 ; i<f.questions.length; i++){
//				q=f.questions[i];	
//				inputType = $.trim(q.input).toLowerCase(); // deals with possible extra whitespace and capitals in FORMAT (json file)
//				
//				questionElement = $('<section></section>').addClass('question');
//				var addAttributes='', qContent='', title='', step;
//				if (q.description){
//					title = q.description;
//				}
//				switch (inputType){	
//					case 'number':
//						if (!q.step) q.step = 50;
//						if (!q.max) q.max = '';
//						addAttributes = 'min="0" max="'+q.max+'" step="'+q.step+'"';
//					case 'date':	
//					case 'search':
//					case 'color':
//					case 'range':
//					case 'url':
//					case 'email':
//					case 'password':
//					case 'text':
//						qContent = '<p><label>'+q.label;
//						qContent += '<input id="'+q.id_html+'" name="'+q.id_html+'" type="'+inputType+'" '+addAttributes+' title="'+title+'" />';
//						qContent += '</label></p>';
//						$(qContent).appendTo(questionElement);
//						break;
//					case 'radio':
//						$(questionElement).addClass('radio');
//						qContent = '<fieldset><legend>'+q.label+'</legend>';
//						for (j=0; j<q.option_labels.length; j++){
//							qContent += '<p><label>';
//							qContent += '<input id="'+q.id_html+'-'+j+'" name="'+q.id_html+'" type="radio" value="'+q.option_values[j]+'"/>';
//							qContent += q.option_labels[j]+'</label></p>';
//						}
//						qContent += '</fieldset>';
//						$(qContent).appendTo(questionElement)
//						break;
//					case 'checkbox':
//						qContent = '<p><label>'
//						qContent += '<input id="'+q.id_html+'" name="'+q.id_html+'" type="checkbox" value="true" />';
//						qContent += q.label+'</label></p>';
//						$(qContent).appendTo(questionElement);
//						break;
//					case 'select':
//						//ADD
//						break;
//				}
//				//console.log('going to append the question element to the form') // DEBUG
//				$(questionElement).appendTo(formContent);	
//			}
//			// append input elements to DOM	
//			//console.log('going to append the form to the DOM)'); // DEBUG
//			$('#'+SURVEY_FORM_ID).append(formContent);
//			
//			//allow only alphanumeric keys
//			//console.log('setting alphanumeric only for input with name:'+_this.KEY_NAME);
//			$('input[name="'+_this.KEY_NAME+'"]').alphanumeric({allow:' '});
//			
//			//add jQuery datePicker(s) if not already natively supported in browser
//			if(!Modernizr.inputtypes.date){
//				$('input[type="date"]').datepicker();
//			}				
//			//console.log('going to return true (success adding form elements to DOM');//DEBUG
//			return true;
//		}
//		catch(e){
//			//console.log('error with creating and adding form input fields to DOM: '+e.message);
//			return false;
//		}
	};
	
	// get form input and present this as an object
	this.getData = function(formId){ 
		//console.log('form.getData called'); // DEBUG
		var data;
		if (!formId) {
			formId = SURVEY_FORM_ID; 
		}
		try{
			data = $('#'+formId).serializeArray();
			var smallerData = {};
			$.each(data, function(index, value){
				smallerData[value.name] = value.value;
			});
			// ADD IF FORM DOESN'T VALIDATE return null;
			return smallerData;
		}
		catch(e){
			//console.log('error with scraping form data from input fields and creating data object: '+e.message);
			return null;
		}
	};
	
	// function to fill in the loaded data in the survey form
//	this.setData = function(data){
//		var inputElement, inputType;
//		try{
//			this.reset();
//			that = this;
//			//console.log('data received:'+JSON.stringify(data)); // DEBUG
//			$.each(data, function(key, value){ //iterate through each item in object
//			    //console.log('key:'+key+' value:'+value);// DEBUG
//			    inputElement = $('form#'+SURVEY_FORM_ID+' input[name="'+key+'"]');
//			   	that.setInputElement(inputElement, value);
//			   				});
//			// ADD mechanism to prevent attempted uploads of document while being edited AND SWITCH OFF WHEN FORM IS RESET OR BROWSER CRASHES?		
//			//setting custom html5 data-attribute "stored-with-key" on form element (value is either null or a string)
//			this.setKey(data[this.KEY_NAME]);
//			//show delete button
//			
//			return true;
//		}
//		catch(e){
//			//console.log('error with filling in form fields: '+e.message); // DEBUG
//			return false;	
//		}
//	};
	
	  
	this.surveyFormReset = function() {	
		//ADD ?? checkForOpenForm(false);
		$('#'+SURVEY_FORM_ID)[0].reset();
		//setting custom html5 data-attribute "stored-with-key" on form element (value is either '' or a string)
		this.setKey('');
		////setting custom html5 data-attribute "changed" to false
		//$('#'+SURVEY_FORM_ID).attr('data-changed','false');
		//gui.updateEditingStatus(false);
		this.setEditStatus(false);
		
		$('#survey-title').text('New Survey');
		
		$('button#delete-form').hide();
		
		//set the combobox with the list of files back to the first item
		var value1st = $('#saved-forms option:first').val();
		$('#saved-forms').val(value1st);
		
	};
	
	this.hasBeenEdited = function(){
		if ($('#'+SURVEY_FORM_ID).attr('data-edited') === 'true'){
			return true;
		}
		else {
			return false;
		}
	}
	
	this.setEditStatus = function(status){
		$('#survey-form form').attr('data-edited',status.toString());
		gui.updateEditStatus(status);
	}
	
	this.setKey = function(key){
		$('#'+SURVEY_FORM_ID).attr('data-stored-with-key', key);
		$('#survey-title').text(key);
	}
	
	this.getKey = function(){
		return $('#'+SURVEY_FORM_ID).attr('data-stored-with-key');
	}
	
}

(function($){
	
	// plugin to update number of repeated elements (with class jr-repeat)
	$.fn.numberRepeats = function() {
	
		return this.each(function(){
			
			$(this).find('fieldset.jr-repeat').each(function(){
				//console.log('found '+$(this).find('fieldset.jr-group > fieldset.jr-repeat').length +' items');
				// if it is the first-of-type (not that ':first-of-type' does not have cross-browser support)		
				if ($(this).prev('fieldset.jr-repeat').length === 0){
					var repSiblings = $(this).siblings('fieldset.jr-repeat');
					var qtyRepeats = repSiblings.length + 1;
					//console.log('number of repeats of '+$(this).attr('name')+' is '+qtyRepeats);
					if (qtyRepeats > 1) {
						$(this).find('span.repeat-number').text('1');
						var i = 2;
						repSiblings.each(function(){
							//console.log('numbering a repeat');
							$(this).find('span.repeat-number').text(i);
							i++;
						});					
					}
					else{
						$(this).find('span.repeat-number').empty();
					}	
				}
				else{
					//console.log('not first of type');
				}
			});
		});			
	};
})(jQuery);


		