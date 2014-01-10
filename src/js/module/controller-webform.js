/**
 * @preserve Copyright 2013 Martijn van de Rijdt
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

/**
 * Deals with the main high level survey controls: saving, submitting etc.
 */

define( [ 'gui', 'connection', 'settings', 'enketo-js/Form', 'enketo-js/FormModel', 'file-saver', 'Blob', 'vkbeautify', 'jquery', 'bootstrap' ],
    function( gui, connection, settings, Form, FormModel, saveAs, Blob, vkbeautify, $ ) {
        "use strict";
        var form, $form, formSelector, defaultModelStr, store, fileManager;

        function init( selector, modelStr, instanceStrToEdit, options ) {
            var loadErrors, purpose;

            formSelector = selector;
            defaultModelStr = modelStr;
            options = options || {};
            instanceStrToEdit = instanceStrToEdit || null;
            store = options.recordStore || null;
            fileManager = ( options.fileStore && options.fileStore.isSupported() ) ? options.fileStore : null;

            connection.init( true );

            if ( fileManager && ( !store || store.getRecordList().length === 0 ) ) {
                //clean up filesystem storage
                fileManager.deleteAll();
            }

            form = new Form( formSelector, defaultModelStr, instanceStrToEdit );

            // DEBUG
            //window.form = form;
            //window.gui = gui;

            //initialize form and check for load errors
            loadErrors = form.init();

            if ( loadErrors.length > 0 ) {
                console.error( 'load errors:', loadErrors );
                purpose = ( instanceStrToEdit ) ? 'to edit data' : 'for data entry';
                gui.showLoadErrors( loadErrors, 'It is recommended <strong>not to use this form</strong> ' + purpose + ' until this is resolved.' );
            }

            $form = form.getView().$;

            setEventHandlers();

            if ( store ) {
                $( '.side-slider' ).append(
                    '<h3>Queue</h3>' +
                    '<p>Records are stored inside your browser until they have been uploaded ' +
                    '(even if you turn off your computer or go offline).</p>' +
                    '<progress class="upload-progress"></progress>' +
                    '<ul class="record-list"></ul>' +
                    '<div class="button-bar"><button class="btn btn-default export-records">Export</button>' +
                    '<button class="btn btn-primary pull-right upload-records">Upload</button></div>' +
                    '<p>Queued records, except those marked as <em>draft</em> ( <span class="glyphicon glyphicon-pencil"></span> ), ' +
                    'are uploaded <strong>automatically</strong>, in the background, every 5 minutes when the web page is open ' +
                    'and an Internet connection is available. To force an upload in between automatic attempts, click Upload.</p>' );
                //trigger fake save event to update formlist in slider
                $form.trigger( 'save', JSON.stringify( store.getRecordList() ) );
            }
            if ( options.submitInterval ) {
                window.setInterval( function() {
                    submitQueue();
                }, options.submitInterval );
                window.setTimeout( function() {
                    submitQueue();
                }, 5 * 1000 );
            }
            console.log( 'controls initialized for form', form );
        }

        /**
         * Controller function to reset to a blank form. Checks whether all changes have been saved first
         * @param  {boolean=} confirmed Whether unsaved changes can be discarded and lost forever
         */

        function resetForm( confirmed ) {
            var message, choices;
            //valueFirst = /**@type {string} */$('#saved-forms option:first').val();
            //console.debug('first form is '+valueFirst);
            //gui.pages.get('records').find('#records-saved').val(valueFirst);
            console.debug( 'editstatus: ' + form.getEditStatus() );
            if ( !confirmed && form.getEditStatus() ) {
                message = 'There are unsaved changes, would you like to continue <strong>without</strong> saving those?';
                choices = {
                    posAction: function() {
                        resetForm( true );
                    }
                };
                gui.confirm( message, choices );
            } else {
                setDraftStatus( false );
                updateActiveRecord( null );
                form.resetView();
                form = new Form( 'form.or:eq(0)', defaultModelStr );
                //DEBUG
                window.form = form;
                form.init();
                $form = form.getView().$;
                $( 'button#delete-form' ).button( 'disable' );
            }
        }


        function loadRecord( recordName, confirmed ) {
            var record, texts, choices, loadErrors;

            if ( !confirmed && form.getEditStatus() ) {
                texts = {
                    msg: 'The current form has unsaved changes. Would you like to load a record <strong>without saving changes</strong> to the form you were working on?',
                    heading: 'Unsaved edits'
                };
                choices = {
                    posButton: 'Proceed without saving',
                    posAction: function() {
                        loadRecord( recordName, true );
                    }
                };
                gui.confirm( texts, choices );
            } else {
                record = store.getRecord( recordName );
                //enters that data in the form on the screen
                // *OLD*checkForOpenForm(true);
                if ( record && record.data ) {
                    //var success = form.setData(data);
                    form.resetView();
                    //gui.closePage();
                    form = new Form( formSelector, defaultModelStr, record.data );
                    loadErrors = form.init();

                    if ( loadErrors.length > 0 ) {
                        console.error( 'load errors:', loadErrors );
                        gui.showLoadErrors( loadErrors, 'It is recommended <strong>not to edit this record</strong> until this is resolved.' );
                    }
                    updateActiveRecord( recordName );
                    setDraftStatus( record.draft );
                    //Avoid uploading of currently open form by setting edit status in STORE to false. To be re-considered if this is best approach.
                    //store.setRecordStatus(formName, false);
                    form.setRecordName( recordName );

                    //console.log('displaying loaded form data succes?: '+success); // DEBUG
                    $( '.side-slider-toggle.handle.close' ).click();
                    $( 'button#delete-form' ).button( 'enable' );
                    //if(!success){
                    //gui.alert('Error loading form. Saved data may be corrupted');
                    //}
                    //else
                    gui.feedback( '"' + recordName + '" has been loaded', 2 );
                } else {
                    gui.alert( 'Record could not be retrieved or contained no data.' );
                }
            }
        }

        function saveRecord( recordName, confirmed, error ) {
            var texts, choices, record, saveResult, overwrite,
                draft = getDraftStatus();

            console.log( 'saveRecord called with recordname:', recordName, 'confirmed:', confirmed, "error:", error, 'draft:', draft );

            //triggering before save to update possible 'end' timestamp in form
            $form.trigger( 'beforesave' );

            confirmed = ( typeof confirmed !== 'undefined' ) ? confirmed : false;
            recordName = recordName || form.getRecordName() || form.getSurveyName() + ' - ' + store.getCounterValue();

            if ( !recordName ) {
                return console.error( 'No record name could be created.' );
            }

            if ( !draft && !form.validate() ) {
                gui.alert( 'Form contains errors <br/>(please see fields marked in red)' );
                return;
            }

            if ( draft && !confirmed ) {
                texts = {
                    dialog: 'save',
                    msg: '',
                    heading: 'Save as a Draft',
                    errorMsg: error
                };
                choices = {
                    posButton: 'Save & Close',
                    negButton: 'Cancel',
                    posAction: function( values ) {
                        // if the record is new or
                        // if the record was previously loaded from storage and saved under the same name
                        if ( !form.getRecordName() || form.getRecordName() === values[ 'record-name' ] ) {
                            saveRecord( values[ 'record-name' ], true );
                        } else {
                            gui.confirm( {
                                msg: 'Are you sure you want to rename "' + form.getRecordName() +
                                    '"" to "' + values[ 'record-name' ] + '"?'
                            }, {
                                posAction: function() {
                                    saveRecord( values[ 'record-name' ], true );
                                }
                            } );
                        }
                    },
                    negAction: function() {
                        return false;
                    }
                };
                gui.confirm( texts, choices, {
                    'record-name': recordName
                } );
            } else {
                record = {
                    'draft': draft,
                    'data': form.getDataStr( true, true )
                };
                overwrite = form.getRecordName() === recordName;
                saveResult = store.setRecord( recordName, record, true, overwrite, form.getRecordName() );

                console.log( 'saveResult', saveResult );
                if ( saveResult === 'success' ) {
                    resetForm( true );
                    $form.trigger( 'save', JSON.stringify( store.getRecordList() ) );

                    if ( draft ) {
                        gui.feedback( 'Record stored as draft.', 3 );
                    } else {
                        //try to send the record immediately
                        gui.feedback( 'Record queued for submission.', 3 );
                        submitOneForced( recordName, record );
                    }
                } else if ( saveResult === 'require' || saveResult === 'existing' || saveResult === 'forbidden' ) {
                    saveRecord( undefined, false, 'Record name "' + recordName + '" already exists (or is not allowed). The record was not saved.' );
                } else {
                    gui.alert( 'Error trying to save data locally (message: ' + saveResult + ')' );
                }
                return saveResult;
            }
        }

        /**
         * Used to submit a form with data that was loaded by POST. This function does not save the record in localStorage
         * and is not used in offline-capable views.
         */

        function submitEditedRecord() {
            var name, record, saveResult, redirect, beforeMsg, callbacks;
            $form.trigger( 'beforesave' );
            if ( !form.isValid() ) {
                gui.alert( 'Form contains errors <br/>(please see fields marked in red)' );
                return;
            }
            redirect = ( typeof settings !== 'undefined' && typeof settings[ 'returnURL' ] !== 'undefined' && settings[ 'returnURL' ] ) ? true : false;
            beforeMsg = ( redirect ) ? 'You will be automatically redirected after submission. ' : '';

            gui.alert( beforeMsg + '<br />' +
                '<progress style="text-align: center;"/>', 'Submitting...', 'info' );
            //name = (Math.floor(Math.random()*100001)).toString();
            //console.debug('temporary record name: '+name);
            record = {
                'key': 'iframe_record',
                'data': form.getDataStr( true, true )
            };

            callbacks = {
                error: function() {
                    gui.alert( 'Please try submitting again.', 'Submission Failed' );
                },
                success: function() {
                    if ( redirect ) {
                        gui.alert( 'You will now be redirected.', 'Submission Successful!', 'success' );
                        setTimeout( function() {
                            location.href = settings.returnURL;
                        }, 1500 );
                    }
                    //also use for iframed forms
                    else {
                        gui.alert( 'Your data was submitted!', 'Submission Successful!', 'success' );
                        resetForm( true );
                    }
                },
                complete: function() {}
            };

            //connection.uploadRecords(record, true, callbacks);
            //only upload the last one
            prepareFormDataArray(
                record, {
                    success: function( formDataArr ) {
                        connection.uploadRecords( formDataArr, true, callbacks );
                    },
                    error: function() {
                        gui.alert( 'Something went wrong while trying to prepare the record(s) for uploading.', 'Record Error' );
                    }
                }
            );
        }

        function submitOneForced( recordName, record ) {
            // TODO: THIS (force=true) NEEDS TO CHANGE AS IT WOULD BE ANNOYING WHEN ENTERING LOTS OF RECORDS WHILE OFFLINE
            // as long as it is not possible to open 'final' records, the only thing we need to check is:
            // whether it is marked as draft (an open record will never be offered for upload)
            if ( !record.draft ) {
                prepareFormDataArray( {
                    key: recordName,
                    data: record.data
                }, {
                    success: function( formDataArr ) {
                        connection.uploadRecords( formDataArr, true );
                    },
                    error: function() {
                        gui.alert( 'Something went wrong while trying to prepare the record(s) for uploading.', 'Record Error' );
                    }
                } );
            }
        }

        function submitQueue() {
            //TODO: add second parameter to getSurveyDataArr() to
            //getCurrentRecordName() to prevent currenty open record from being submitted
            //connection.uploadRecords(store.getSurveyDataArr(true));

            var i,
                records = store.getSurveyDataArr( true ),
                successHandler = function( recordPrepped ) {
                    connection.uploadRecords( recordPrepped );
                },
                errorHandler = function() {
                    console.error( 'Something went wrong while trying to prepare the record(s) for uploading.' );
                };
            ///the check for whether an upload is currently ongoing prevents an ugly-looking issue whereby e.g. #1 in the queue failed to submit
            //is removed from the queue and then re-entered before the old queue was emptied.
            if ( !connection.getUploadOngoingID() && connection.getUploadQueue().length === 0 ) {
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
         * @param { { name: string, data: string } } record[ description ]
         * @param {{success: Function, error: Function}} callbacks
         */

        function prepareFormDataArray( record, callbacks ) {
            var j, k, l, xmlData, formData, model, instanceID, $fileNodes, fileIndex, fileO, recordPrepped,
                count = 0,
                sizes = [],
                failedFiles = [],
                files = [],
                batches = [];

            model = new FormModel( record.data );
            instanceID = model.getInstanceID();
            // ignore files if there is no fileManager (possible when editing a record that has files)
            $fileNodes = ( fileManager ) ? model.$.find( '[type="file"]' ).removeAttr( 'type' ) : [];
            xmlData = model.getStr( true, true );

            function basicRecordPrepped( batchesLength, batchIndex ) {
                formData = new FormData();
                formData.append( 'xml_submission_data', xmlData );
                return {
                    name: record.key,
                    instanceID: instanceID,
                    formData: formData,
                    batches: batchesLength,
                    batchIndex: batchIndex
                };
            }

            function gatherFiles() {
                $fileNodes.each( function() {
                    fileO = {
                        newName: $( this ).nodeName,
                        fileName: $( this ).text()
                    };
                    fileManager.retrieveFile( instanceID, fileO, {
                        success: function( fileObj ) {
                            count++;
                            files.push( fileObj );
                            sizes.push( fileObj.file.size );
                            if ( count == $fileNodes.length ) {
                                distributeFiles();
                            }
                        },
                        error: function( e ) {
                            count++;
                            failedFiles.push( fileO.fileName );
                            console.error( 'Error occured when trying to retrieve ' + fileO.fileName + ' from local filesystem', e );
                            if ( count == $fileNodes.length ) {
                                distributeFiles();
                            }
                        }
                    } );
                } );
            }

            function distributeFiles() {
                var maxSize = connection.getMaxSubmissionSize();
                if ( files.length > 0 ) {
                    batches = divideIntoBatches( sizes, maxSize );
                    console.debug( 'splitting record into ' + batches.length + ' batches to reduce submission size ', batches );
                    for ( k = 0; k < batches.length; k++ ) {
                        recordPrepped = basicRecordPrepped( batches.length, k );
                        for ( l = 0; l < batches[ k ].length; l++ ) {
                            fileIndex = batches[ k ][ l ];
                            //console.log( 'adding file: ', files[ fileIndex ] );
                            recordPrepped.formData.append( files[ fileIndex ].newName + '[]', files[ fileIndex ].file );
                        }
                        //console.log( 'returning record with formdata : ', recordPrepped );
                        callbacks.success( recordPrepped );
                    }
                } else {
                    recordPrepped = basicRecordPrepped( 1, 0 );
                    //console.log( 'sending submission without files', recordPrepped );
                    callbacks.success( recordPrepped );
                }
                showErrors();
            }

            function showErrors() {
                if ( failedFiles.length > 0 ) {
                    gui.alert( '<p>The following media files could not be retrieved: ' + failedFiles.join( ', ' ) + '. ' +
                        'The submission will go ahead and show the missing filenames in the data, but without the actual file(s).</p>' +
                        '<p>Thanks for helping test this experimental feature. If you find out how you can reproduce this issue, ' +
                        'please contact ' + settings.supportEmail + '.</p>',
                        'Experimental feature failed' );
                }
            }

            if ( !fileManager || $fileNodes.length === 0 ) {
                distributeFiles();
            } else {
                gatherFiles();
            }
        }


        /**
         * Function to export or backup data to a file. In Chrome it will get an appropriate file name.
         */

        function exportToTextFile( fileName, dataStr ) {
            var blob;
            blob = new Blob( [ dataStr ], {
                type: "text/plain; charset=utf-8"
            } );
            saveAs( blob, fileName );
        }

        function setEventHandlers() {

            $( 'button#reset-form' )
                .click( function() {
                    resetForm();
                } );
            $( 'button#submit-form' )
                .click( function() {
                    var $button = $( this );
                    $button.btnBusyState( true );
                    // this timeout is to slow down the GUI a bit, UX
                    setTimeout( function() {
                        saveRecord();
                        $button.btnBusyState( false );
                        return false;
                    }, 100 );

                } );
            $( 'button#submit-form-single' )
                .click( function() {
                    var $button = $( this );
                    $button.btnBusyState( true );
                    setTimeout( function() {
                        form.validate();
                        submitEditedRecord();
                        $button.btnBusyState( false );
                        return false;
                    }, 100 );
                } );


            $( '.form-footer [name="draft"]' ).on( 'change', function() {
                var text = ( $( this ).prop( 'checked' ) ) ? "Save Draft" : "Submit";
                $( '#submit-form' ).text( text );
            } );

            $( document ).on( 'click', 'button#validate-form:not(.disabled)', function() {
                //$form.trigger('beforesave');
                if ( typeof form !== 'undefined' ) {
                    var $button = $( this );
                    $button.btnBusyState( true );
                    setTimeout( function() {
                        form.validate();
                        $button.btnBusyState( false );
                        if ( !form.isValid() ) {
                            gui.alert( 'Form contains errors <br/>(please see fields marked in red)' );
                            return;
                        }
                    }, 100 );
                }
            } );

            $( document ).on( 'click', '.export-records', function() {
                var server, exported, dataStr,
                    fileName = form.getSurveyName() + '_data_backup.xml';

                dataStr = store.getExportStr();

                if ( !dataStr ) {
                    gui.alert( 'No records in queue. The records may have been successfully submitted already.' );
                } else {
                    server = settings.serverURL || '';
                    exported = vkbeautify.xml( '<export date="' + new Date() + '" server="' + server + '">' + dataStr + '</export>' );
                    exportToTextFile( fileName, exported );
                }
            } );

            $( document ).on( 'click', '.upload-records:not(:disabled)', function() {
                submitQueue();
            } );

            $( document ).on( 'click', '.record.error', function() {
                var name = $( this ).attr( 'name' ),
                    $info = $( this ).siblings( '[name="' + name + '"]' );

                if ( $info.is( ':visible' ) ) {
                    $info.hide( 500 );
                } else {
                    $info.show( 500 );
                }
            } );

            $( document ).on( 'click', '.record-list [data-draft="true"]', function() {
                loadRecord( $( this ).closest( '.record' ).attr( 'name' ), false );
            } );

            //$( '#form-controls button' ).toLargestWidth();

            $( document ).on( 'save delete', 'form.or', function( e, formList ) {
                //console.debug( 'save or delete event detected with new formlist: ', formList );
                updateRecordList( JSON.parse( formList ) );
            } );

            //$( '#dialog-save' ).hide();

            //remove filesystem folder after successful submission
            $( document ).on( 'submissionsuccess', function( ev, recordName, instanceID ) {
                if ( fileManager && fileManager.isSupported() ) {
                    fileManager.deleteDir( instanceID );
                }
                if ( store ) {
                    store.removeRecord( recordName );
                }
                console.log( 'After submission success, attempted to remove record with key:', recordName, 'and files in folder:', instanceID );
            } );
        }

        //update the survey forms names list
        function updateRecordList( recordList, $page ) {
            var name, draft, i, $li,
                $buttons = $( '.side-slider .upload-records, .side-slider .export-records' ),
                $list = $( '.side-slider .record-list' );

            console.log( 'updating record list' );

            // get form list object (keys + upload) ordered by time last saved
            recordList = recordList || [];
            $( '.queue-length' ).text( recordList.length );

            //cleanup 
            $list.find( '.record' ).each( function() {
                name = $( this ).attr( 'name' );
                //if the record in the DOM no longer exists in storage
                if ( $.grep( recordList, function( record ) {
                    return record.key == name;
                } ).length === 0 ) {
                    //remove the DOM element and its same-name-siblings (split submissions)
                    $( this ).siblings( '[name="' + name + '"]' ).addBack().hide( 2000, function() {
                        $( this ).remove();
                    } );
                }
            } );

            // disable buttons
            $buttons.attr( 'disabled', 'disabled' );

            // add new records
            if ( recordList.length > 0 ) {
                $list.find( '.no-records' ).remove();

                $( '.side-slider .export-records' ).removeAttr( 'disabled' );

                recordList.forEach( function( record, i ) {
                    name = recordList[ i ].key;
                    draft = recordList[ i ].draft;

                    // if there is at least one record not marked as draft
                    if ( !draft ) {
                        $buttons.removeAttr( 'disabled' );
                    }

                    // add a new item when necessary
                    $li = $list.find( '[name="' + name + '"]' );
                    if ( $li.length === 0 ) {
                        $li = $( '<li class="record"></li' );
                        $li.text( name ); // encodes string to html
                        $li.attr( 'name', name );
                        $list.append( $li );
                    }

                    // update record status for new or existing records
                    $li.attr( 'data-draft', draft );
                } );
            } else if ( $list.find( '.no-records' ).length === 0 ) {
                $list.append( '<li class="no-records">no records queued</li>' );
            }
        }

        function updateActiveRecord( recordName ) {
            var $list = $( '.side-slider .record-list' );

            $list.find( 'li' ).removeClass( 'active' );
            if ( recordName ) {
                $list.find( 'li[name="' + recordName + '"]' ).addClass( 'active' );
            }
        }

        function setDraftStatus( status ) {
            status = status || false;
            $( '.form-footer [name="draft"]' ).prop( 'checked', status ).trigger( 'change' );
        }

        function getDraftStatus() {
            return $( '.form-footer [name="draft"]' ).prop( 'checked' );
        }

        /**
         * splits an array of file sizes into batches (for submission) based on a limit
         * @param  {Array.<number>} fileSizes   array of file sizes
         * @param  {number}     limit   limit in byte size of one chunk (can be exceeded for a single item)
         * @return {Array.<Array.<number>>} array of arrays with index, each secondary array of indices represents a batch
         */

        function divideIntoBatches( fileSizes, limit ) {
            var i, j, batch, batchSize,
                sizes = [],
                batches = [];
            //limit = limit || 5 * 1024 * 1024;
            for ( i = 0; i < fileSizes.length; i++ ) {
                sizes.push( {
                    'index': i,
                    'size': fileSizes[ i ]
                } );
            }
            while ( sizes.length > 0 ) {
                batch = [ sizes[ 0 ].index ];
                batchSize = sizes[ 0 ].size;
                if ( sizes[ 0 ].size < limit ) {
                    for ( i = 1; i < sizes.length; i++ ) {
                        if ( ( batchSize + sizes[ i ].size ) < limit ) {
                            batch.push( sizes[ i ].index );
                            batchSize += sizes[ i ].size;
                        }
                    }
                }
                batches.push( batch );
                for ( i = 0; i < sizes.length; i++ ) {
                    for ( j = 0; j < batch.length; j++ ) {
                        if ( sizes[ i ].index === batch[ j ] ) {
                            sizes.splice( i, 1 );
                        }
                    }
                }
            }
            return batches;
        }

        return {
            init: init,
            submitQueue: submitQueue,
            divideIntoBatches: divideIntoBatches
        };
    } );
