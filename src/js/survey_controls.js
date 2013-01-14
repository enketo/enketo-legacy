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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true *//*global BlobBuilder, form, Form, connection, settings, vkbeautify, saveAs, gui, jrDataStr, report, Form, store:true, StorageLocal:true, Settings, Modernizr*/

/**
 * Controller function to load a form from local storage. Checks whether there is any unsaved data in the current form first.
 * @param  {string} formName  The name of the form to load (key of local db).
 * @param  {boolean=} confirmed Whether unsaved data can be discarded and lost forever.
 */
function loadForm(formName, confirmed){
	'use strict';
	var message, choices, record;
	//console.log('loadForm called'); // DEBUG
	if (!confirmed && form.getEditStatus()){
		message = 'Would you like to proceed without saving changes to the form you were working on?';
		choices = {
			posAction: function(){ loadForm(formName, true); }
		};
		gui.confirm(message, choices);
	}
	else {
		// request a form data object
		record = store.getRecord(formName);
		//enters that data in the form on the screen
		// *OLD*checkForOpenForm(true);
		if (record.data !== null){
			//var success = form.setData(data);
			form.resetHTML();
			//gui.closePage();
			form = new Form('form.jr:eq(0)', record.data);
			form.init();
			//form.setRecordStatus(record.ready);
			//Avoid uploading of currently open form by setting edit status in STORE to false. To be re-considered if this is best approach.
			//store.setRecordStatus(formName, false);
			form.setRecordName(formName);
			//console.log('displaying loaded form data succes?: '+success); // DEBUG
			$('#page-close').click();
			$('button#delete-form').button('enable');
			//if(!success){
				//gui.alert('Error loading form. Saved data may be corrupted');
			//}
			//else
			gui.feedback('"'+formName +'" has been loaded', 2);
		}
		else{
			gui.alert('Record contained no data');
			// ADD something went wrong with loading data from storage
		}
	}
}
/**
 * [saveForm description]
 * @param  {string=} confirmedRecordName  [description]
 * @param  {string|boolean=} confirmedFinalStatus [description]
 * @param  {boolean=} deleteOldName        [description]
 * @param  {boolean=} overwriteExisting    [description]                   [description]
 */
function saveForm(confirmedRecordName, confirmedFinalStatus, deleteOldName, overwriteExisting){
	'use strict';
	var result, message, choices,
		curRecordName = form.getRecordName(),
		curRecordFinal = form.getRecordStatus(),
		rec = {};
		//record = { 'data': form.getDataStr(true, true), 'ready': confirmedFinalStatus};
	//record['ready'] = confirmedFinalStatus;
	console.debug('new name: '+confirmedRecordName+', before: '+curRecordName+', delOld: '+deleteOldName+', overwr: '+overwriteExisting);
	if (form.getDataStr(true, true) === null || form.getDataStr(true, true) === ''){
		return gui.feedback('Nothing to save.'); //ADD error with getting data from form?
	}

	if (typeof confirmedRecordName == 'undefined' || confirmedRecordName.length === 0){
		curRecordName = curRecordName || store.getCounterValue();
		$('#dialog-save input[name="record-name"]').val(curRecordName);
		$('#dialog-save input[name="record-final"]').attr('checked', curRecordFinal);
		return gui.saveConfirm();
		//console.debug('new Record Props: '+JSON.stringify(newRecord));
		//return saveForm(newRecord.name, newRecord.markedFinal);
	}

	if (curRecordName && curRecordName !== confirmedRecordName && typeof deleteOldName == 'undefined'){
		message = 'Record name has changed. Would you like to delete the record saved under the old name:'+curRecordName+'?';
		choices = {
			posButton : 'Yes, delete',
			negButton : 'No, keep',
			posAction : function(){ saveForm(confirmedRecordName, confirmedFinalStatus, true); },
			negAction : function(){ saveForm(confirmedRecordName, confirmedFinalStatus, false); }
		};
		return gui.confirm({msg: message, heading: 'Delete old Record?'}, choices);
	}

	//trigger beforesave event which is used e.g. to update timestamp preload item.
	$('form.jr').trigger('beforesave');
	rec = { 'data': form.getDataStr(true, true), 'ready': confirmedFinalStatus};
	// HOW THE HELL DOES REC GET A LASTSAVED PROPERTY HERE??? SOMETHING VERY WRONG
	//console.debug('sending following record to store.setRecord():');
	//console.debug(rec);
	//alert('hey');
	result = store.setRecord(confirmedRecordName, rec, deleteOldName, overwriteExisting, curRecordName);

	console.log('result of save: '+result); // DEBUG
	if (result === 'success'){
		gui.feedback('Form with name "'+confirmedRecordName+'" has been saved.', 2);
		
		//set the new custom html5 data attribute stored-with-key
		form.setRecordName(confirmedRecordName);
		form.setRecordStatus(confirmedFinalStatus);
		form.setEditStatus(false);
		$('button#delete-form').button('enable');
		//update records in GUI
		$('form.jr').trigger('save', JSON.stringify(store.getRecordList()));
	}
	//else if (result === 'require'){
	//	gui.alert (form.KEY_LABEL+' is required. Please provide this.');
	//}
	else if (result === 'existing'){
		message = 'Record with name '+confirmedRecordName+' already exists. Would you like to overwrite existing record? ';
		choices = {
			posButton : 'Yes, overwrite',
			posAction : function(){ saveForm(confirmedRecordName, confirmedFinalStatus, deleteOldName, true); },
			negAction : function(){ gui.feedback("Form was not saved.");}
		};
		gui.confirm(message, choices);
	}
	else if (result === 'forbidden'){
		gui.alert ('This name is not allowed. Please change it');
		gui.feedback ('Form was NOT saved.');
	}
	else {
		gui.feedback('Error occurred. Form was NOT saved.');
	}
}

/**
 * Controller function to reset to a blank form. Checks whether all changes have been saved first
 * @param  {boolean=} confirmed Whether unsaved changes can be discarded and lost forever
 */
function resetForm(confirmed){
	'use strict';
	var message, choices;
	//valueFirst = /**@type {string} */$('#saved-forms option:first').val();
	//console.debug('first form is '+valueFirst);
	//gui.pages.get('records').find('#records-saved').val(valueFirst);
	console.debug('editstatus: '+ form.getEditStatus());
	if (!confirmed && form.getEditStatus()){
		message = 'There are unsaved changes, would you like to continue <strong>without</strong> saving those?';
		choices = {
			posAction : function(){ resetForm(true); }
		};
		gui.confirm(message, choices);
	}
	else {
		form.resetHTML();
		form = new Form('form.jr:eq(0)', jrDataStr);
		form.init();
		$('button#delete-form').button('disable');
	}
}

/**
 * Controller function to delete a record of form data.
 * @param  {boolean=} confirmed whether the user has confirmed that he/she wants to delete the data
 */
function deleteForm(confirmed) {
	'use strict';
	var message, choices, key = form.getRecordName();

	if (key !== '' && key !== null){
		if (confirmed){
			var success = store.removeRecord(key);
			if (success){
				resetForm(true);
				gui.feedback('Successfully deleted form.');
				$('form.jr').trigger('delete', JSON.stringify(store.getRecordList()));
			}
			else {
				gui.feedback('An error occurred when trying to delete this form.');
			}
		}
		else {
			message = 'Please confirm that you would like to remove this form from storage.';
			choices = {
				posButton : 'Delete',
				posAction : function(){ deleteForm(true); }
			};
			gui.confirm(message, choices);
		}
	}
	else {
		gui.feedback ('Please first load the form you would like to delete or choose reset if you\'d like to reset the current form.');
	}
	return;
}


/**
 * Currently, this is a simplified version of 'saveForm' for situations where localStorage is only used as a backup, without saved data loading
 * functionality. It only allows validated forms to be submitted. 'Submitted' in this case actually still means it is saved to localStorage first
 * and then forced to upload. If uploading fails the user can continue working on a blank form. Uploading will be attempted at intervals until it
 * succeeds.
 * TODO: it may be better to set the form name with counterValue in the traditional fashion with form.setRecordName() to prevent duplicate records in case
 * resetForm() does not function as expected.
 */
function submitForm() {
	var record, saveResult;
	$('form.jr').trigger('beforesave');
	if (!form.isValid()){
		gui.alert('Form contains errors <br/>(please see fields marked in red)');
		return;
	}
	record = { 'data': form.getDataStr(true, true), 'ready': true};
	saveResult = store.setRecord(form.getName()+' - '+store.getCounterValue(), record, false, false);
	
	console.log('result of save: '+saveResult);
	if (saveResult === 'success'){
		resetForm(true);
		$('form.jr').trigger('save', JSON.stringify(store.getRecordList()));
		//attempt uploading the data (all data in localStorage)
		//NOTE: THIS (force=true) NEEDS TO CHANGE AS IT WOULD BE ANNOYING WHEN ENTERING LOTS OF RECORDS WHILE OFFLINE
		//TODO: add second parameter getCurrentRecordName() to prevent currenty open record from being submitted
		connection.uploadRecords(store.getSurveyDataArr(true), true);
	}
	else{
		gui.alert('Error trying to save data locally before submit');
	}
}

/**
 * Used to submit a form with data that was loaded by POST. This function is not saved in localStorage and not used
 * in offline-capable views.
 *
 */
function submitEditedForm() {
	var name, record, saveResult, redirect, beforeMsg, callbacks;
	$('form.jr').trigger('beforesave');
	if (!form.isValid()){
		gui.alert('Form contains errors <br/>(please see fields marked in red)');
		return;
	}
	redirect = (typeof settings !== 'undefined' && typeof settings['returnURL'] !== 'undefined') ? true : false;
	beforeMsg = (redirect) ? 'You will be automatically redirected after submission. ' : '';

	gui.alert(beforeMsg + '<br />'+
		'<progress style="text-align: center;"/>', 'Submitting...');
	//name = (Math.floor(Math.random()*100001)).toString();
	//console.debug('temporary record name: '+name);
	record = {'data': form.getDataStr(true, true)};
	
	callbacks = {
		error: function(){
			gui.alert('Please try submitting again.', 'Submission failed');
		},
		success: function(){
			if (redirect){
				gui.alert('You will now be redirected back to formhub.', 'Submission successful!');
				location.href = settings['returnURL'];
			}
			//also use for iframed forms
			else{
				gui.alert('Done!', 'Submission successful!');
				resetForm(true);
			}
		},
		complete: function(){}
	};

	connection.uploadRecords(record, true, callbacks);
}

/**
 * Function to export or backup data. It depends on the browser whether this data is shown in a new browser window/tab
 * or is downloaded automatically. It is not possible to provide a file name.
 * @deprecated
 * @param  {boolean=} finalOnly [description]
 */
function exportData(finalOnly){
	"use strict";
	var i,dataArr, dataStr, uriContent, newWindow;
	finalOnly = finalOnly || true;

	dataArr = store.getSurveyDataOnlyArr(finalOnly);
	
	if (dataArr.length === 0){
		gui.feedback('No data to export.');
	}
	else{
		dataStr = vkbeautify.xml('<exported>'+dataArr.join('')+'</exported>');
		uriContent = "data:application/octet-stream," + encodeURIComponent(dataStr); /*data:application/octet-stream*/
		newWindow = window.open(uriContent, 'exportedData');
	}
}

/**
 * Function to export or backup data to a file. In Chrome it will get an appropriate file name.
 *
 *	@param {string=}  fileName
 *  @param {boolean=} finalOnly [description]
 */
function exportToFile(fileName, finalOnly){
	"use strict";
	var i, dataArr, dataStr, bb, blob;
		//filename="test.xml";//, uriContent, newWindow;
	finalOnly = finalOnly || true;
	fileName = fileName || form.getName()+'_data_backup.xml';
	
	dataArr = store.getSurveyDataOnlyArr(finalOnly);//store.getSurveyDataXMLStr(finalOnly));
	//console.debug(data);
	if (!dataArr || dataArr.length === 0){
		gui.feedback('No data marked "final" to export.');
	}
	else{
		dataStr = vkbeautify.xml('<exported>'+dataArr.join('')+'</exported>');
		bb = new BlobBuilder();
		bb.append(dataStr);
		blob = bb.getBlob("application/octet-stream; charset=utf-8");
		saveAs(blob, fileName);
	}
}

//Extend GUI
//setCustomEventHandlers is called automatically by GUI.init();
GUI.prototype.setCustomEventHandlers = function(){
	"use strict";
	var settingsForm, that = this;
	
	// survey-form controls
	$('button#save-form')
		.click(function(){
			form.validateForm();
			saveForm();
		});
	$('button#reset-form')
		.click(function(){
			resetForm();
		});
	$('button#delete-form')
		.click(function(){
			deleteForm(false);
		});
	$('button#submit-form').button()
		.click(function(){
			form.validateForm();
			submitForm();
			return false;
	});
	$('button#submit-edited-data')
		.click(function(){
			form.validateForm();
			submitEditedForm();
			return false;
	});
	$(document).on('click', 'button#validate-form:not(.disabled)', function(){
		//$('form.jr').trigger('beforesave');
		if (typeof form !== 'undefined'){
			form.validateForm();
			if (!form.isValid()){
				gui.alert('Form contains errors <br/>(please see fields marked in red)');
				return;
			}
		}
	});

	$('#drawer-export').click(function(){
		exportToFile();
		return false;
	});
	$('.drawer.left .handle.right').click(function(){
		var $drawer = $(this).parent('.drawer');
		console.debug('clicked handle');
		$drawer.toggleClass('closed');
	});

	$('#form-controls button').toLargestWidth();

	$(document)
		.on('click', '#records-saved li:not(.no-click)', function(event){
			event.preventDefault();
			var name = /** @type {string} */$(this).find('.name').text();
			loadForm(name);
			$(this).siblings().removeClass('ui-state-active');
			$(this).addClass('ui-state-active');
		})
		.on('mouseenter', '#records-saved li:not(.no-click)', function(){
			$(this).addClass('ui-state-hover');
		})
		.on('mouseleave', '#records-saved li:not(.no-click)', function(){
			$(this).removeClass('ui-state-hover');
		});

	$(document).on('save delete', 'form.jr', function(e, formList){
		console.debug('save or delete event detected with new formlist: '+formList);
		that.updateRecordList(JSON.parse(formList));
	});

	$(document).on('setsettings', function(e, settings){
		//console.debug('settingschange detected, GUI will be updated with settings:');
		//console.debug(settings);
		that.setSettings(settings);
	});

	// handlers for application settings [settings page]
	//this.pages.get('settings').on('change', 'input', function(){
	//	var name =  /** @type {string} */  $(this).attr('name');
	//	var value = ($(this).is(':checked')) ?  /** @type {string} */ $(this).val().toString() : '';
	//	console.debug('settings change by user detected');
	//
	//	settings.set(name, value);
	//});

	$('#dialog-save').hide();

};

//update the survey forms names list
GUI.prototype.updateRecordList = function(recordList, $page) {
	"use strict";
	var name, date, clss, i, icon, $list, $li,
		finishedFormsQty = 0,
		draftFormsQty = 0;
	console.debug('updating recordlist in GUI');
	if(!$page){
		$page = this.pages.get('records');
	}

	$list = $page.find('#records-saved ol');
	
	//remove the existing option elements
	$list.children().remove();
	// get form list object (keys + upload) ordered by time last saved
	recordList = recordList || [];//store.getRecordList();

	if (recordList.length > 0){
		for (i=0; i<recordList.length; i++){
			name = recordList[i].key;
			date = new Date(recordList[i]['lastSaved']).toDateString();
			if (recordList[i]['ready']){// === true){//} || recordList[i]['ready'] == 'true'){
				icon = 'check';
				finishedFormsQty++;
			}
			else {
				icon = 'pencil';
				draftFormsQty++;
			}
			$li = $('<li><span class="ui-icon ui-icon-'+icon+'"></span><span class="name">'+
				'</span><span class="date"> ('+date+')</span></li>');
			$li.find('.name').text(name); // encodes string to html
			$list.append($li);
		}
		$('#queue-length').text(recordList.length);
	}
	else{
		$('<li class="no-click">no locally saved records found</li>').appendTo($list);
		$('#queue-length').text('0');
	}
	// update status counters
	$page.find('#records-draft-qty').text(draftFormsQty);
	$page.find('#records-final-qty').text(finishedFormsQty);
};

GUI.prototype.saveConfirm = function(){
	"use strict";
	var $saveConfirm = $('#dialog-save');
	this.confirm(
		{
			dialog: 'save',
			msg:'',
			heading:'Record Details'
		},
		{
			posButton: 'Ok',
			negButton: 'Cancel',
			posAction: function(){
				console.debug('value of final in confirm dialog: '+Boolean($saveConfirm.find('[name="record-final"]:checked').val()));
				//console.debug($saveConfirm.find('[name="record-final"]'));
				return saveForm(
					$saveConfirm.find('[name="record-name"]').val(),
					Boolean($saveConfirm.find('[name="record-final"]:checked').val())
					//$saveConfirm.find('[name="record-final"]:checked').val()
				);
			},
			negAction: function(){
				return false;
			},
			beforeAction: function(){
				if (!form.isValid()){
					console.log('form invalid');
					$saveConfirm.find('[name="record-final"]').attr('disabled', 'disabled');
				}
				else{
					console.log('form valid');
					$saveConfirm.find('[name="record-final"]').removeAttr('disabled');
				}
			}
		}
	);
};

