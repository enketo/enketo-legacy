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

var /**@type {StorageLocal}*/ store;

$( document ).ready( function( ) {
  if ( typeof StorageLocal !== "undefined" ) {
    store = new StorageLocal( );
    store.init( );
    $( '.side-slider' ).append(
      '<h3>Queue</h3>' +
      '<p>Records are stored inside your browser until they have been uploaded ' +
      '(even if you turn off your computer or go offline).</p>' +
      '<progress class="upload-progress"></progress>' +
      '<ul class="record-list"></ul>' +
      '<p><button class="btn export-records">Export</button>' +
      '<button class="btn btn-primary pull-right upload-records">Upload</button></p>' +
      '<p>Queued records are uploaded <em>automatically, in the background</em> every 5 minutes when this page is open ' +
      'and an internet connection is available. To force an upload in between automatic tries, click Upload.</p>' );
  }
} );

/**
 * Controller function to load a form from local storage. Checks whether there is any unsaved data in the current form first.
 * @param  {string} formName  The name of the form to load (key of local db).
 * @param  {boolean=} confirmed Whether unsaved data can be discarded and lost forever.
 */
/*
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
*/
/**
 * [saveForm description]
 * @param  {string=} confirmedRecordName  [description]
 * @param  {string|boolean=} confirmedFinalStatus [description]
 * @param  {boolean=} deleteOldName        [description]
 * @param  {boolean=} overwriteExisting    [description]                   [description]
 */
/*
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
    $('#dialog-save input[name="record-final"]').prop('checked', curRecordFinal);
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
  //  gui.alert (form.KEY_LABEL+' is required. Please provide this.');
  //}
  else if (result === 'full'){
    gui.alert('<p>Storage is full. If you are online this should not have happened, please contact '+gui.supportLink+
    '.</p><p>If you are working offline, you will have to go online to upload saved records first or switch to a different'+
    ' browser/device that you have loaded this form on.</p>', 'Storage Full');
  }
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
    gui.alert ('This name is not allowed. Please change it', 'Record Name not allowed');
    gui.feedback ('Form was NOT saved.');
  }
  else {
    gui.alert('Error occurred. Form was NOT saved.', 'Save Error');
  }
}
*/
/**
 * Controller function to reset to a blank form. Checks whether all changes have been saved first
 * @param  {boolean=} confirmed Whether unsaved changes can be discarded and lost forever
 */

function resetForm( confirmed ) {
  'use strict';
  var message, choices;
  //valueFirst = /**@type {string} */$('#saved-forms option:first').val();
  //console.debug('first form is '+valueFirst);
  //gui.pages.get('records').find('#records-saved').val(valueFirst);
  console.debug( 'editstatus: ' + form.getEditStatus( ) );
  if ( !confirmed && form.getEditStatus( ) ) {
    message = 'There are unsaved changes, would you like to continue <strong>without</strong> saving those?';
    choices = {
      posAction: function( ) {
        resetForm( true );
      }
    };
    gui.confirm( message, choices );
  } else {
    form.resetHTML( );
    form = new Form( 'form.jr:eq(0)', jrDataStr );
    form.init( );
    $( 'button#delete-form' ).button( 'disable' );
  }
}

/**
 * Controller function to delete a record of form data.
 * @param  {boolean=} confirmed whether the user has confirmed that he/she wants to delete the data
 */
/*
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
*/

/**
 * Currently, this is a simplified version of 'saveForm' for situations where localStorage is only used as a queue, without saved data loading
 * functionality. It only allows validated forms to be submitted. 'Submitted' in this case actually still means it is saved to localStorage first
 * and then forced to upload. If uploading fails the user can continue working on a blank form. Uploading will be attempted at intervals until it
 * succeeds.
 * TODO: it may be better to set the form name with counterValue in the traditional fashion with form.setRecordName() to prevent duplicate records in case
 * resetForm() does not function as expected.
 */

function submitForm( ) {
  var record, name, saveResult;
  $( 'form.jr' ).trigger( 'beforesave' );
  if ( !form.isValid( ) ) {
    gui.alert( 'Form contains errors <br/>(please see fields marked in red)' );
    return;
  }
  record = {
    'data': form.getDataStr( true, true ),
    'ready': true
  };
  name = form.getName( ) + ' - ' + store.getCounterValue( );
  saveResult = store.setRecord( name, record, false, false );

  console.log( 'result of save: ' + saveResult );
  if ( saveResult === 'success' ) {
    gui.feedback( 'Record queued for submission.', 3 );
    resetForm( true );
    $( 'form.jr' ).trigger( 'save', JSON.stringify( store.getRecordList( ) ) );
    //attempt uploading the data (all data in localStorage)
    //TODO: THIS (force=true) NEEDS TO CHANGE AS IT WOULD BE ANNOYING WHEN ENTERING LOTS OF RECORDS WHILE OFFLINE
    //TODO: add second parameter getCurrentRecordName() to prevent currenty open record from being submitted
    //connection.uploadRecords(store.getSurveyDataArr(true), true);
    prepareFormDataArray(
      //store.getSurveyDataArr(true),
      {
        name: name,
        data: record.data
      }, {
        success: function( formDataArr ) {
          connection.uploadRecords( formDataArr, true );
        },
        error: function( ) {
          gui.alert( 'Something went wrong while trying to prepare the record(s) for uploading.', 'Record Error' );
        }
      }
    );
  } else {
    gui.alert( 'Error trying to save data locally before submit' );
  }
}

/**
 * Used to submit a form with data that was loaded by POST. This function does not save the record in localStorage
 * and is not used in offline-capable views.
 */

function submitEditedForm( ) {
  var name, record, saveResult, redirect, beforeMsg, callbacks;
  $( 'form.jr' ).trigger( 'beforesave' );
  if ( !form.isValid( ) ) {
    gui.alert( 'Form contains errors <br/>(please see fields marked in red)' );
    return;
  }
  redirect = ( typeof settings !== 'undefined' && typeof settings[ 'returnURL' ] !== 'undefined' && settings[ 'returnURL' ] ) ? true : false;
  beforeMsg = ( redirect ) ? 'You will be automatically redirected after submission. ' : '';

  gui.alert( beforeMsg + '<br />' +
    '<progress style="text-align: center;"/>', 'Submitting...' );
  //name = (Math.floor(Math.random()*100001)).toString();
  //console.debug('temporary record name: '+name);
  record = {
    'name': 'iframe_record',
    'data': form.getDataStr( true, true )
  };

  callbacks = {
    error: function( ) {
      gui.alert( 'Please try submitting again.', 'Submission Failed' );
    },
    success: function( ) {
      if ( redirect ) {
        gui.alert( 'You will now be redirected.', 'Submission Successful!', 'success' );
        setTimeout( function( ) {
          location.href = settings.returnURL;
        }, 1500 );
      }
      //also use for iframed forms
      else {
        gui.alert( 'Your data was submitted!', 'Submission Successful!', 'success' );
        resetForm( true );
      }
    },
    complete: function( ) {}
  };

  //connection.uploadRecords(record, true, callbacks);
  //only upload the last one
  prepareFormDataArray(
    record, {
      success: function( formDataArr ) {
        connection.uploadRecords( formDataArr, true, callbacks );
      },
      error: function( ) {
        gui.alert( 'Something went wrong while trying to prepare the record(s) for uploading.', 'Record Error' );
      }
    }
  );
}

function submitQueue( ) {
  //TODO: add second parameter to getSurveyDataArr() to
  //getCurrentRecordName() to prevent currenty open record from being submitted
  //connection.uploadRecords(store.getSurveyDataArr(true));

  var i,
    records = store.getSurveyDataArr( true ),
    successHandler = function( recordPrepped ) {
      connection.uploadRecords( recordPrepped );
    },
    errorHandler = function( ) {
      console.error( 'Something went wrong while trying to prepare the record(s) for uploading.' );
    };
  ///the check for whether an upload is currently ongoing prevents an ugly-looking issue whereby e.g. #1 in the queue failed to submit
  //is removed from the queue and then re-entered before the old queue was emptied.
  if ( !connection.uploadOngoingID && connection.uploadQueue.length === 0 ) {
    for ( i = 0; i < records.length; i++ ) {
      prepareFormDataArray(
        records[ i ], {
          success: successHandler,
          error: errorHandler
        }
      );
    }
  }
}

/**
 * Asynchronous function that builds up a form data array including media files
 * @param  {{name: string, data: string}} record [description]
 * @param {{success: Function, error: Function}} callbacks
 */

function prepareFormDataArray( record, callbacks ) {
  var j, k, l, xmlData, formData, dataO, instanceID, $fileNodes, fileIndex, fileO, recordPrepped,
    count = 0,
    sizes = [ ],
    failedFiles = [ ],
    files = [ ],
    batches = [ ];

  dataO = form.Data( record.data );
  xmlData = dataO.getStr( true, true );
  instanceID = dataO.getInstanceID( );
  $fileNodes = dataO.$.find( '[type="file"]' ).removeAttr( 'type' );

  function basicRecordPrepped( batchesLength, batchIndex ) {
    formData = new FormData( );
    formData.append( 'xml_submission_data', xmlData );
    return {
      name: record.name,
      instanceID: instanceID,
      formData: formData,
      batches: batchesLength,
      batchIndex: batchIndex
    };
  }

  function gatherFiles( ) {
    $fileNodes.each( function( ) {
      fileO = {
        newName: $( this ).nodeName,
        fileName: $( this ).text( )
      };
      fileManager.retrieveFile( instanceID, fileO, {
        success: function( fileObj ) {
          count++;
          files.push( fileObj );
          sizes.push( fileObj.file.size );
          if ( count == $fileNodes.length ) {
            distributeFiles( );
          }
        },
        error: function( e ) {
          count++;
          failedFiles.push( fileO.fileName );
          console.error( 'Error occured when trying to retrieve ' + fileO.fileName + ' from local filesystem', e );
          if ( count == $fileNodes.length ) {
            distributeFiles( );
          }
        }
      } );
    } );
  }

  function distributeFiles( ) {
    var maxSize = connection.maxSubmissionSize( );
    if ( files.length > 0 ) {
      batches = divideIntoBatches( sizes, maxSize );
      console.debug( 'splitting record into ' + batches.length + ' batches to reduce submission size ', batches );
      for ( k = 0; k < batches.length; k++ ) {
        recordPrepped = basicRecordPrepped( batches.length, k );
        for ( l = 0; l < batches[ k ].length; l++ ) {
          fileIndex = batches[ k ][ l ];
          //console.log( 'adding file: ', files[fileIndex] );
          recordPrepped.formData.append( files[ fileIndex ].newName + '[]', files[ fileIndex ].file );
        }
        //console.log( 'returning record with formdata : ', recordPrepped );
        callbacks.success( recordPrepped );
      }
    } else {
      recordPrepped = basicRecordPrepped( 1, 0 );
      //console.log('sending submission without files', recordPrepped)
      callbacks.success( recordPrepped );
    }
    showErrors( );
  }

  function showErrors( ) {
    if ( failedFiles.length > 0 ) {
      gui.alert( '<p>The following media files could not be retrieved: ' + failedFiles.join( ', ' ) + '. ' +
        'The submission will go ahead and show the missing filenames in the data, but without the actual file(s).</p>' +
        '<p>Thanks for helping test this experimental feature. If you find out how you can reproduce this issue, ' +
        'please contact ' + settings.supportEmail + '.</p>',
        'Experimental feature failed' );
    }
  }

  if ( typeof fileManager == 'undefined' || $fileNodes.length === 0 ) {
    distributeFiles( );
  } else {
    gatherFiles( );
  }
}

/**
 * Function to export or backup data. It depends on the browser whether this data is shown in a new browser window/tab
 * or is downloaded automatically. It is not possible to provide a file name.
 * @deprecated
 * @param  {boolean=} finalOnly [description]
 */
//function exportData( finalOnly ) {
//  "use strict";
//  var i, dataArr, dataStr, uriContent, newWindow;
//  finalOnly = finalOnly || true;//

//  dataArr = store.getSurveyDataOnlyArr( finalOnly );//

//  if ( dataArr.length === 0 ) {
//    gui.feedback( 'No data to export.' );
//  } else {
//    dataStr = vkbeautify.xml( '<exported>' + dataArr.join( '' ) + '</exported>' );
//    uriContent = "data:application/octet-stream," + encodeURIComponent( dataStr ); /*data:application/octet-stream*/
//    newWindow = window.open( uriContent, 'exportedData' );
//  }
//}


/**
 * Function to export or backup data to a file. In Chrome it will get an appropriate file name.
 */

function exportToTextFile( fileName, dataStr ) {
  "use strict";
  var blob;
  blob = new Blob( [ dataStr ], {
    type: "text/plain; charset=utf-8"
  } );
  saveAs( blob, fileName );
}

//Extend GUI
//setCustomEventHandlers is called automatically by GUI.init();
GUI.prototype.setCustomEventHandlers = function( ) {
  "use strict";
  var settingsForm, that = this;
  /*
  $('button#save-form')
    .click(function(){
      form.validateForm();
      saveForm();
    });
  */
  $( 'button#reset-form' )
    .click( function( ) {
      resetForm( );
    } );
  /*
  $('button#delete-form')
    .click(function(){
      deleteForm(false);
    });
  */
  $( 'button#submit-form' )
    .click( function( ) {
      var $button = $( this );
      $button.btnBusyState( true );
      setTimeout( function( ) {
        form.validateForm( );
        submitForm( );
        $button.btnBusyState( false );
        return false;
      }, 100 );

    } );
  $( 'button#submit-form-single' )
    .click( function( ) {
      var $button = $( this );
      $button.btnBusyState( true );
      setTimeout( function( ) {
        form.validateForm( );
        submitEditedForm( );
        $button.btnBusyState( false );
        return false;
      }, 100 );
    } );
  $( document ).on( 'click', 'button#validate-form:not(.disabled)', function( ) {
    //$('form.jr').trigger('beforesave');
    if ( typeof form !== 'undefined' ) {
      var $button = $( this );
      $button.btnBusyState( true );
      setTimeout( function( ) {
        form.validateForm( );
        $button.btnBusyState( false );
        if ( !form.isValid( ) ) {
          gui.alert( 'Form contains errors <br/>(please see fields marked in red)' );
          return;
        }
      }, 100 );
    }
  } );

  $( document ).on( 'click', '.export-records', function( ) {
    var dataArr, dataStr, server,
      finalOnly = true,
      fileName = form.getName( ) + '_data_backup.xml';
    dataArr = store.getSurveyDataOnlyArr( finalOnly ); //store.getSurveyDataXMLStr(finalOnly));
    if ( !dataArr || dataArr.length === 0 ) {
      gui.alert( 'No records in queue. The records may have been successfully submitted already.' );
    } else {
      server = settings[ 'serverURL' ] || '';
      dataStr = vkbeautify.xml( '<exported server="' + server + '">' + dataArr.join( '' ) + '</exported>' );
      exportToTextFile( fileName, dataStr );
    }
  } );

  $( document ).on( 'click', '.upload-records:not(:disabled)', function( ) {
    submitQueue( );
  } );

  $( document ).on( 'click', '.record.error', function( ) {
    var name = $( this ).attr( 'name' ),
      $info = $( this ).siblings( '[name="' + name + '"]' );

    if ( $info.is( ':visible' ) ) {
      $info.hide( 500 );
    } else {
      $info.show( 500 );
    }
  } );

  $( '#form-controls button' ).toLargestWidth( );

  $( document ).on( 'save delete', 'form.jr', function( e, formList ) {
    //console.debug( 'save or delete event detected with new formlist: ' + formList );
    that.updateRecordList( JSON.parse( formList ) );
  } );

  /*
  $(document).on('setsettings', function(e, settings){
    that.setSettings(settings);
  });
  */
  // handlers for application settings [settings page]
  //this.pages.get('settings').on('change', 'input', function(){
  //  var name =  /** @type {string} */  $(this).attr('name');
  //  var value = ($(this).is(':checked')) ?  /** @type {string} */ $(this).val().toString() : '';
  //  console.debug('settings change by user detected');
  //
  //  settings.set(name, value);
  //});

  $( '#dialog-save' ).hide( );

};

//update the survey forms names list
GUI.prototype.updateRecordList = function( recordList, $page ) {
  "use strict";
  var name, i, $li,
    $buttons = $( '.side-slider .upload-records, .side-slider .export-records' ),
    $list = $( '.side-slider .record-list' );

  // get form list object (keys + upload) ordered by time last saved
  recordList = recordList || [ ];
  $( '.queue-length' ).text( recordList.length );

  //cleanup 
  $list.find( '.record' ).each( function( ) {
    name = $( this ).attr( 'name' );
    //if the record in the DOM no longer exists in storage
    if ( $.grep( recordList, function( record ) {
      return record.key == name;
    } ).length === 0 ) {
      //remove the DOM element and its same-name-siblings (split submissions)
      $( this ).siblings( '[name="' + name + '"]' ).addBack( ).hide( 2000, function( ) {
        $( this ).remove( );
      } );
    }
  } );

  //add new records
  if ( recordList.length > 0 ) {
    $list.find( '.no-records' ).remove( );
    $buttons.removeAttr( 'disabled' );
    for ( i = 0; i < recordList.length; i++ ) {
      name = recordList[ i ].key;
      if ( $list.find( '[name="' + name + '"]' ).length === 0 ) {
        $li = $( '<li class="record"></li' );
        $li.text( name ); // encodes string to html
        $li.attr( 'name', name );
        $list.append( $li );
      }
    }
  } else {
    $buttons.attr( 'disabled', 'disabled' );
    if ( $list.find( '.no-records' ).length === 0 ) {
      $list.append( '<li class="no-records">no records queued</li>' );
    }
  }

};

/*
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
*/