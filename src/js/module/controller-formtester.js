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

/*
 * Controller for the form tester. Very old code. Needs thorough rewrite.
 */

define( [ 'gui', 'enketo-js/Form', 'settings', 'connection', 'vkbeautify', 'controller-webform', 'file-manager', 'jquery' ],
    function( gui, Form, settings, connection, vkbeautify, controller, fileManager, $ ) {
        "use strict";
        var form, source, url, $tabs, $upload, _error, state,
            error_msg = 'There were errors. Please see the "report" tab for details.',
            templateShow = false;

        function init() {
            state = new State();
            state.init();
            connection.init();

            _error = console.error;
            console.error = function() {
                addJsError( arguments[ 0 ] );
                gui.feedback( error_msg );
                return _error.apply( console, arguments );
            };

            if ( fileManager && fileManager.isSupported() ) {
                //clean up filesystem storage for this (sub).domain (should not clear storage of other subdomains)
                fileManager.deleteAll();
            }

            if ( !state.source ) {
                $( '#html5-form-source' ).hide();
                $( 'li a[href="#html5-form-source"]' ).parent( 'li' ).remove();
            }

            $( 'li a[href="#upload"]' ).tab( 'show' );

            $( '#upload-form [name="xml_file"]' ).change( function() {
                $( '#upload-form' ).submit();
            } );

            $( '#upload-form' ).submit( function() {
                var $formId = $( this ).find( '[name="form_id"]' ),
                    formId = $formId.val(),
                    $serverURL = $( this ).find( '[name="server_url"]' ),
                    serverURL = $serverURL.val(),
                    $file = $( this ).find( '[name="xml_file"]' ),
                    file = ( $file.val() ) ? $file[ 0 ].files[ 0 ] : null,
                    error = function( jqXHR, status, errorThrown ) {
                        if ( jqXHR.status === 401 ) {
                            gui.confirmLogin( '<p>This server requires you to login to view forms.</p><p>Would you like to login now?</p>', serverURL );
                        } else if ( status !== 'validationerror' ) {
                            gui.feedback( 'Sorry, an error occured while communicating with the Enketo server. (' + errorThrown + ')' );
                        } else {
                            gui.alert( errorThrown );
                            //resetAll();
                        }
                    },
                    complete = function( jqXHR, textStatus ) {
                        $( '#upload progress' ).hide();
                    };

                resetAll();

                $( '#upload progress' ).show();

                if ( formId || file ) {
                    if ( file ) {
                        $( '#form-list ul' ).empty();
                    }
                    connection.getTransForm( serverURL, formId, file, null, {
                        success: function( resp, textStatus, jqXHR ) {
                            state.server = ( serverURL ) ? serverURL : null;
                            state.id = ( formId ) ? formId : null;
                            state.setUrl();
                            processForm( $( resp ) );
                        },
                        error: error,
                        complete: complete
                    } );
                } else {
                    $( '#form-list ul' ).empty();
                    connection.getFormlist( serverURL, {
                        success: function( resp, textStatus, jqXHR ) {
                            //$('#upload .hurry').hide();
                            state.server = serverURL;
                            state.id = null;
                            state.setUrl();
                            processFormlist( resp );
                            $serverURL.val( serverURL );
                        },
                        error: error,
                        complete: complete
                    } );
                }
                return false;
            } );

            $( '#upload-form #input-switcher button' )
                .click( function( e ) {
                    $( '#upload-form label' ).hide().find( 'input[name="' + $( this ).attr( 'id' ) + '"]' ).parents( 'label' ).show();
                    $( this ).siblings().removeClass( 'active' ).end().addClass( 'active' );
                } );

            $( '#upload-form #input-switcher button#server_url' ).click();

            $( '#data-template-show input' ).change( function() {
                templateShow = ( $( this ).is( ':checked' ) ) ? true : false;
                updateData();
            } );

            $( document ).on( 'click', '#form-list a', function( event ) {
                var id = /** @type {string} */ $( this ).attr( 'id' ).toString(),
                    server = /** @type {string} */ $( this ).attr( 'data-server' );
                event.preventDefault();
                $( '#upload-form input[name="server_url"]' ).val( server );
                $( '#upload-form input[name="form_id"]' ).val( id );
                $( '#upload-form' ).submit();
            } );

            $( '#html5-form-source form' ).submit( function() {
                var cls, $form = $( this );
                var html = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title></title></head><body>' +
                    $form.find( 'textarea[name="content"]' ).val() + '</body></html>';

                $( '#html5validationmessages div' ).html( '<form style="text-align:center;"><progress></progress></form>' );

                connection.validateHTML( html, {
                    success: function( response ) {
                        //strip <script> elements
                        var $response = $( '<div></div>' );
                        $response.append( response.replace( /<script[A-z =".]*><\/script>/gi, '' ) );
                        $response.find( 'ol:not(.source) li>*:first-child' ).each( function() {
                            cls = /**@type {string} */ $( this ).parent( 'li' ).attr( 'class' );
                            $( this ).addClass( cls );
                        } );
                        parseMsgList( $response.find( 'p.success, ol:not(.source) li>*:first-child' ), $( '#html5validationmessages div' ) );
                        //correction as Web Service does not accept 'level: 'error' parameter:
                        $( '#html5validationmessages div li.info' ).hide();
                    },
                    error: function() {
                        $( '#html5validationmessages div' ).empty().append( '<ol><li class="info">' +
                            '<span class="ui-icon ui-icon-info"></span>This validation is currently not functional</li></ol>' );
                    }
                } );
                return false;
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
                        } else {
                            gui.alert( 'The form is valid!', 'Looking good!', 'success' );
                        }
                    }, 100 );
                }
            } );

            if ( state.server ) {
                $( '#upload-form input[name="server_url"]' ).val( state.server );
                $( '#upload-form input[name="form_id"]' ).val( state.id );
                $( '#upload-form' ).submit();
            } else {
                console.log( 'no server in state' );
                $( '.hurry' ).show();
                gui.parseFormlist( null, $( '#form-list' ), true );
            }
        }

        /**
         * State class maintains 'fake' state using url GET variables
         *
         * @constructor
         */

        function State() {

        }

        State.prototype.init = function() {
            var that;

            this.initialURL = location.href;

            this.server = ( settings.serverURL && connection.isValidURL( settings.serverURL ) ) ? settings.serverURL : null;
            this.id = settings.formId || null; //CHECK THIS FOR 'VALIDITY'
            this.source = settings.source || false;
            this.debug = settings.debug || false;
            this.everPushedState = false;
            that = this;

            state.setUrl();

            $( window ).on( 'popstate', function( event ) {
                //console.debug('state popped! with everPushedState:'+that.everPushedState);
                // Ignore inital popstate that some browsers fire on page load
                if ( that.everPushedState && ( location.href !== that.initialURL ) ) {
                    //console.debug('popstate event fired with state props: ', event.originalEvent.state);
                    window.location = location.href;
                }
            } );
            setTimeout( function() {
                that.everPushedState = true;
            }, 1000 );
        };

        State.prototype.setUrl = function() {
            var stateProps = {
                    server: this.server,
                    id: this.id,
                    source: this.source,
                    debug: this.debug
                },
                urlAppend = '',
                url = 'formtester';
            urlAppend = ( this.server !== null && connection.isValidURL( this.server ) ) ? urlAppend + 'server=' + encodeURIComponent( this.server ) : urlAppend;
            urlAppend = ( this.id !== null ) ? urlAppend + '&id=' + encodeURIComponent( this.id ) : urlAppend;
            urlAppend = ( this.source == 'true' || this.source === true ) ? urlAppend + '&source=' + encodeURIComponent( this.source ) : urlAppend;
            urlAppend = ( this.debug == 'true' || this.debug === true ) ? urlAppend + '&debug=' + encodeURIComponent( this.debug ) : urlAppend;
            urlAppend = ( urlAppend.substring( 0, 1 ) == '&' ) ? urlAppend.substring( 1 ) : urlAppend;
            url = ( urlAppend.length > 0 ) ? url + '?' + urlAppend : url;
            if ( ( location.href !== location.protocol + '//' + location.hostname + '/' + url ) || this.everPushedState ) {
                //console.debug('pushing history state ', location.href);
                //console.debug(location.hostname+'/'+url);
                //console.debug(stateProps);
                //this.everPushedState = true;
                history.pushState( stateProps, 'Enketo Form Tester', url );
            }
        };

        State.prototype.reset = function() {
            console.debug( 'resetting state' );
            this.server = null;
            this.id = null;
            this.setUrl();
        };

        function resetAll() {
            //state.reset();
            $( '#upload-form' )[ 0 ].reset();
            $( '#upload-form input[type="hidden"]' ).val( '' );
            //$('#form-list ul').empty().hide();
            $( '#upload progress' ).hide();
            //$('#input-switcher, #upload .hurry').show().find('a#server_url').click();
            $( '#form-languages' ).remove();
            $( '#survey-form form, #xsltmessages div, #html5validationmessages div, #jrvalidationmessages div, #xmlerrors div, #xslerrors div, #html5-form-source textarea, #data textarea' ).empty();
            form = null;
            $( '#validate-form' ).addClass( 'disabled' );
            $( '.nav li a[href="#upload"]' ).tab( 'show' );
        }

        function processForm( $response ) {
            var loadErrors,
                formStr = new XMLSerializer().serializeToString( $response.find( ':first>form' )[ 0 ] ),
                //data as string
                jrDataStr = new XMLSerializer().serializeToString( $response.find( ':first>model' )[ 0 ] ),
                //extract messages
                $xsltMsg = $response.find( 'xsltmessages message' ),
                //var $html5Msg = $response.find('html5validatormessages message');
                $jrMsg = $response.find( 'jrvalidationmessages message' ),
                $xmlMsg = $response.find( 'xmlerrors message' ),
                $xslMsg = $response.find( 'xslformerrors message, xsldataerrors message' );

            $( '#upload progress' ).hide();

            if ( formStr.length > 0 ) {
                $( '#html5-form-source textarea' ).empty().text( vkbeautify.xml( formStr ) );
                $( '#html5-form-source form' ).submit();

                //important to use append with string and not $object for some reason => JQuery bug?
                $( '#survey-form form' ).replaceWith( formStr );

                form = new Form( 'form.or:eq(0)', jrDataStr );
                loadErrors = form.init();

                if ( loadErrors.length > 0 ) {
                    gui.showErrors( loadErrors, 'The form format contains errors or unsupported features.' );
                }

                //for debugging
                window.form = form;

                $( '.nav a[href="#survey-form"]' ).tab( 'show' );

                //set event handlers for changes in form input fields
                form.getModel().$.on( 'dataupdate', updateData );

                //enable buttons
                $( '#validate-form' ).removeClass( 'disabled' );
            } else {
                $( '#survey-form div' ).empty();
                $( '.nav li a[href="#report"]' ).tab( 'show' );
            }

            if ( form && form.getDataStr().length > 0 ) {
                updateData();
            } else {
                $( '#data div' ).text( 'An error occurred whilst trying to extract the data.' );
            }

            if ( form && form.getDataStr().length > 0 && $xsltMsg.length === 0 ) {
                $xsltMsg = $( '<message class="success">Nothing reported back. A good sign if there are no other errors!</message>' );
            }
            parseMsgList( $xsltMsg, $( '#xsltmessages div' ) );

            if ( $jrMsg.length === 0 ) {
                $jrMsg = $( '<message class="info">Something went wrong</message>' );
            }
            parseMsgList( $jrMsg, $( '#jrvalidationmessages div' ) );

            if ( $xmlMsg.length === 0 ) {
                $xmlMsg = $( '<message class="success">Valid XML document!</message>' );
            }
            parseMsgList( $xmlMsg, $( '#xmlerrors div' ) );

            if ( $xslMsg.length > 0 ) {
                $xslMsg.each( function() {
                    console.error( 'XSLT stylesheet error: ' + $( this ).text() );
                } );
            }

            if ( form && form.getDataStr().length > 0 && $( '#report .level-2, #report .level-3' ).length > 0 ) {
                gui.feedback( error_msg );
            }
        }

        function processFormlist( list ) {
            $( '.hurry' ).hide();
            gui.parseFormlist( list, $( '#form-list' ) );
        }

        function updateData() {
            if ( form ) {
                var dataStr = form.getDataStr( templateShow );
                console.log( 'updating data tab', dataStr );
                $( '#data textarea' ).empty().text( vkbeautify.xml( dataStr ) );
            } else {
                console.log( 'nothing to do, there is no form' );
            }
        }

        function parseMsgList( msgObj, targetEl ) {
            var messageList = $( '<ul></ul>' );
            msgObj.each( function() {
                var level = '',
                    liStr, cls, icon = '',
                    message = $( this ).text(),
                    classes = {
                        '0': 'info',
                        'info warning': 'warning',
                        '1': 'warning',
                        '2': 'error',
                        '3': 'error'
                    };
                level = $( this ).attr( 'level' ) ? $( this ).attr( 'level' ) : $( this ).attr( 'class' );
                cls = ( classes[ level ] ) ? "text-" + classes[ level ] : "muted";
                liStr = '<li class="' + cls + '">' + message + '</li>';

                //avoid duplicate messages
                if ( messageList.find( 'li' ).filter( function() {
                    return $( this ).text() == message;
                } ).length === 0 ) {
                    messageList.append( liStr );
                }
            } );
            targetEl.empty().append( messageList );
        }

        function addJsError( message ) {
            if ( $( '#jserrors div ul' ).length !== 1 ) {
                $( '#jserrors div' ).append( '<ul></ul>' );
            }
            $( '#jserrors div ul' ).append( '<li class="text-error">' + message + '</li>' );
        }

        return {
            init: init
        };
    } );
