/* !Form Class */
//This 'class' deals only with manipulating the survey form DOM object
function Form (){
	var _this;
	
	// initializes Form object
	this.init = function(FORMAT) {
		//this seems an awkward way to create a copy of global variables
		//but in the future the form format (form.json) should be read into this.FORMAT
		//and form format variables are then accessible only through the form object.
		//Unfortunately, for now this causes strange errors in Safari and Opera (using AJAX)
		this.KEY_NAME = $.trim(FORMAT.key);
		this.KEY_LABEL = $.trim(FORMAT.key_label);
		this.COUNTRY = $.trim(FORMAT.country);
		this.SECTOR = $.trim(FORMAT.sector);
		this.SURVEY_NAME = $.trim(FORMAT.name);
		this.YEAR = $.trim(FORMAT.year);
		this.VERSION=$.trim(FORMAT.version);
		this.QUESTIONS=FORMAT.questions;
		
		_this=this;
		
		var built = this.display(FORMAT);
		this.reset();
		// mark current form when the user appears to change content
		$('#'+SURVEY_FORM_ID).change(function(){
			console.log('form will be marked as "changed"'); // DEBUG
			form.setEditStatus(true);
		});
	
		return built;
	}
	
	// builds up the form input elements and appends them to the DOM
	this.display = function(f) { 
		//console.log('starting to build form'); //DEBUG
		try{
			var i,j,q,questionElement=null,inputType;
			var formContent = $('<div></div>');
			$('<input id="recordType" name="recordType" type="hidden" value="surveyData" />').appendTo(formContent);
			//console.log(f.questions.length+' questions found in form format object'); //DEBUG
			for (i=0 ; i<f.questions.length; i++){
				q=f.questions[i];	
				inputType = $.trim(q.input).toLowerCase(); // deals with possible extra whitespace and capitals in FORMAT (json file)
				
				questionElement = $('<section></section>').addClass('question');
				var addAttributes='', qContent='', title='', step;
				if (q.description){
					title = q.description;
				}
				switch (inputType){	
					case 'number':
						if (!q.step) q.step = 50;
						if (!q.max) q.max = '';
						addAttributes = 'min="0" max="'+q.max+'" step="'+q.step+'"';
					case 'date':	
					case 'search':
					case 'color':
					case 'range':
					case 'url':
					case 'email':
					case 'password':
					case 'text':
						qContent = '<p><label>'+q.label;
						qContent += '<input id="'+q.id_html+'" name="'+q.id_html+'" type="'+inputType+'" '+addAttributes+' title="'+title+'" />';
						qContent += '</label></p>';
						$(qContent).appendTo(questionElement);
						break;
					case 'radio':
						$(questionElement).addClass('radio');
						qContent = '<fieldset><legend>'+q.label+'</legend>';
						for (j=0; j<q.option_labels.length; j++){
							qContent += '<p><label>';
							qContent += '<input id="'+q.id_html+'-'+j+'" name="'+q.id_html+'" type="radio" value="'+q.option_values[j]+'"/>';
							qContent += q.option_labels[j]+'</label></p>';
						}
						qContent += '</fieldset>';
						$(qContent).appendTo(questionElement)
						break;
					case 'checkbox':
						qContent = '<p><label>'
						qContent += '<input id="'+q.id_html+'" name="'+q.id_html+'" type="checkbox" value="true" />';
						qContent += q.label+'</label></p>';
						$(qContent).appendTo(questionElement);
						break;
					case 'select':
						//ADD
						break;
				}
				//console.log('going to append the question element to the form') // DEBUG
				$(questionElement).appendTo(formContent);	
			}
			// append input elements to DOM	
			//console.log('going to append the form to the DOM)'); // DEBUG
			$('#'+SURVEY_FORM_ID).append(formContent);
			
			//allow only alphanumeric keys
			//console.log('setting alphanumeric only for input with name:'+_this.KEY_NAME);
			$('input[name="'+_this.KEY_NAME+'"]').alphanumeric({allow:' '});
			
			//add jQuery datePicker(s) if not already natively supported in browser
			if(!Modernizr.inputtypes.date){
				$('input[type="date"]').datepicker();
			}				
			//console.log('going to return true (success adding form elements to DOM');//DEBUG
			return true;
		}
		catch(e){
			//console.log('error with creating and adding form input fields to DOM: '+e.message);
			return false;
		}
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
	this.setData = function(data){
		var inputElement, inputType;
		try{
			this.reset();
			that = this;
			//console.log('data received:'+JSON.stringify(data)); // DEBUG
			$.each(data, function(key, value){ //iterate through each item in object
			    //console.log('key:'+key+' value:'+value);// DEBUG
			    inputElement = $('form#'+SURVEY_FORM_ID+' input[name="'+key+'"]');
			   	that.setInputElement(inputElement, value);
			   				});
			// ADD mechanism to prevent attempted uploads of document while being edited AND SWITCH OFF WHEN FORM IS RESET OR BROWSER CRASHES?		
			//setting custom html5 data-attribute "stored-with-key" on form element (value is either null or a string)
			this.setKey(data[this.KEY_NAME]);
			//show delete button
			
			return true;
		}
		catch(e){
			//console.log('error with filling in form fields: '+e.message); // DEBUG
			return false;	
		}
	};
	
	// sub-function to set input elements
	this.setInputElement = function(el, value){
		var inputType = el.attr('type');
		//console.log('input type:'+inputType); // DEBUG
		switch (inputType){
		    case 'date':
		    case 'number':
		    case 'search':
		    case 'color':
		    case 'range':
		    case 'url':
		    case 'email':
		    case 'password':
		    case 'text':
		    	el.val(value);
		    	break;
		    case 'radio':
		    	setRadioButton(el, value);
		    	break;
		    case 'checkbox':
		    	var checkValue=false;
		    	if (value==='true') {checkValue = true;}
		    	el.attr('checked', checkValue);
		    	break;
		    // ADD case 'select' for select elements

		}
	}
	
	this.setSelectElement = function(el){
		// ADD
	}
	
	//private function
	function setRadioButton(radioObject, loadedValue) {
		for (var i = 0; i < radioObject.length; i++) {
			if (radioObject[i].value === loadedValue) {
				//console.log('found radiobutton (input) with value: '+loadedValue);
				radioObject[i].checked = true;
			}
		}
	}
	
	this.reset = function() {	
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
		$('#'+SURVEY_FORM_ID).attr('data-edited',status.toString());
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