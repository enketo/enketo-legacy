/**
 * @preserve Copyright 2013 Martijn van de Rijdt & Modilabs
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

define( [ 'gui', 'store', 'connection', 'jquery', 'bootstrap' ], function( gui, store, connection, $ ) {
    "use strict";

    window.gui = gui;

    window.addEventListener( "load", function() {
        // Set a timeout...
        setTimeout( function() {
            // Hide the address bar!
            window.scrollTo( 0, 1 );
        }, 0 );
    }, false );

    function init() {
        var url, $settings,
            popoverOptions = {
                placement: 'top',
                trigger: 'click'
            },
            urlHelperText = {
                formhub: {
                    tit: 'Enter formhub account name',
                    ex: 'e.g. formhub_u',
                    inp: 'enter formhub account name'
                },
                formhub_uni: {
                    tit: 'Enter formhub account name',
                    ex: 'e.g. formhub_u',
                    inp: 'enter formhub account name',
                    val: 'formhub_u'
                },
                appspot: {
                    tit: 'Enter appspot subdomain name',
                    ex: 'e.g. opendatakit',
                    inp: 'enter appspot subdomain name'
                },
                http: {
                    tit: 'Enter http web address',
                    ex: 'e.g. formhub.org/formhub_u',
                    inp: 'enter web address'
                },
                https: {
                    tit: 'Enter https web address',
                    ex: 'e.g. formhub.org/formhub_u',
                    inp: 'enter web address'
                }
            };

        connection.init();

        $settings = gui.pages.get( 'settings' );

        $settings.find( '.url-helper a' )
            .click( function( event ) {
                var helper, hText, value,
                    $settings = gui.pages.get( 'settings' );

                event.preventDefault();

                $( this ).parent().addClass( 'active' ).siblings().removeClass( 'active' );
                helper = $( this ).attr( 'data-value' );
                hText = urlHelperText[ helper ];
                value = hText.val || '';

                $settings.find( 'input#server' )
                    .attr( 'placeholder', hText.inp )
                    .attr( 'title', hText.tit )
                    .attr( 'data-content', hText.ex )
                    .popover( 'destroy' ).popover( popoverOptions );

                if ( value && $settings.find( 'input#server' ).val() !== value ) {
                    $settings.find( 'input#server' ).val( value ).trigger( 'change' );
                }
            } ).end().find( 'a.active' ).click();

        $settings.find( 'input#server' ).change( function() {
            gui.pages.get( 'settings' ).find( '.go' ).click();
        } ).popover( popoverOptions );

        $( document ).on( 'click', '#refresh-list, #page .go', function() {
            var props, reset,
                frag = $settings.find( 'input#server' ).val(),
                type = $settings.find( '.url-helper li.active > a' ).attr( 'data-value' );
            //if ( $( 'progress' ).css( 'display' ) === 'none' ) {
            props = {
                server: connection.oRosaHelper.fragToServerURL( type, frag ),
                helper: $settings.find( '.url-helper li.active > a' ).attr( 'data-value' ),
                inputValue: $settings.find( 'input#server' ).val()
            };
            if ( props.server ) {
                $( 'progress' ).show();
                connection.getFormlist( props.server, {
                    success: function( resp, msg ) {
                        processFormlistResponse( resp, msg, props );
                    },
                    error: function( jqXHR, status, errorThrown ) {
                        processFormlistResponse( [], '', props, true );
                        if ( jqXHR.status === 401 ) {
                            gui.confirmLogin( '<p>This server requires you to login to view forms.</p><p>Would you like to login now?</p>', props.server );
                            store.setRecord( '__current_server', {
                                'url': props.server,
                                'helper': props.helper,
                                'inputValue': props.inputValue,
                                'refresh': true
                            }, false, true );
                        }
                    }
                } );
            } else {
                reset = true;
                processFormlistResponse( [], null, props, reset );
            }
            // }
            $( '#page .close, header a:not(.collapsed)[data-toggle="collapse"]' ).click();
        } );

        $( '#form-list' ).on( 'click', 'a', function() {
            var server, id,
                href = /**@type {string}*/ $( this ).attr( 'href' );

            //request a url first by launching this in enketo
            if ( !href || href === "" || href === "#" ) {
                console.log( 'going to request enketo url' );
                server = $( this ).attr( 'data-server' );
                id = $( this ).attr( 'id' );
                connection.getSurveyURL( server, id, {
                    complete: function( resp ) {
                        resp.responseJSON.serverURL = server;
                        resp.responseJSON.formId = id;
                        processSurveyURLResponse( resp );
                    }
                } );
            } else {
                return true; //location.href = href;
            }
            return false;
        } );

        $( '#page' ).on( 'change', function() {
            $settings.find( 'input#server' ).popover( 'hide' );
        } );

        loadPreviousState();

        $( window ).on( 'resize', function() {
            $( '.paper' ).css( 'min-height', gui.fillHeight( $( '.paper' ) ) );
            if ( $( '#form-list li' ).length === 0 && !gui.pages.isShowing() && !$( 'header nav' ).hasClass( 'in' ) ) {
                showVirginHint();
            }
        } ).trigger( 'resize' );
    }

    /**
     * Loads the previous state of the formlist and server settings
     */

    function loadPreviousState() {
        var i, list,
            $settings = gui.pages.get( 'settings' ),
            server = store.getRecord( '__current_server' );
        if ( server && server.url ) {
            $settings.find( '.url-helper li' ).removeClass( 'active' ).find( '[data-value="' + server.helper + '"]' ).parent( 'li' ).addClass( 'active' );
            $settings.find( 'input#server' ).val( server.inputValue );
            list = store.getFormList( server.url );
            gui.parseFormlist( list, $( '#form-list' ) );
            console.log( 'server state: ', server );
            if ( typeof server.refresh !== 'undefined' && server.refresh === true ) {
                $( '#refresh-list' ).click();
                server.refresh = false;
                store.setRecord( '__current_server', server );
            }
        }
    }

    function showVirginHint() {
        var left, offset, $popover,
            $collapsedMenuIcon = $( 'header [data-toggle="collapse"]' ),
            $menuItem = $( 'nav [href="#settings"]' ),
            $target = ( $collapsedMenuIcon.is( ':visible' ) ) ? $collapsedMenuIcon : $menuItem;

        $collapsedMenuIcon.add( $menuItem ).popover( 'destroy' );

        $target
            .popover( {
                placement: 'bottom',
                trigger: 'manual',
                title: 'load forms',
                content: 'Go to settings to load a list of your forms.'
            } )
            .popover( 'show' );

        $popover = $target.next( '.popover' );
        //left = $popover.offset().left;
        /*$popover.css( {
            'left': 'auto',
            'right': '17px'
        } );
        offset = left - $popover.offset().left;
        $popover.find( '.arrow' ).css( 'left', $popover.outerWidth() / 2 + offset + 'px' );
        //console.debug('offset: '+offset);*/
        $popover.add( $target ).add( 'nav ul li a' ).click( function() {
            $target.popover( 'destroy' );
        } );
    }
    /**
     * [processFormlistResponse description]
     * @param  {?Array.<{name: string, server: string, title: string, url: string}>} resp  [description]
     * @param  {?string} msg   [description]
     * @param  {Object} props [description]
     * @param  {boolean=} reset [description]
     */

    function processFormlistResponse( resp, msg, props, reset ) {
        var helper, inputValue;
        console.log( 'processing formlist response' );
        if ( typeof resp === 'object' && !$.isEmptyObject( resp ) ) {
            store.setRecord( '__server_' + props.server, resp, false, true );
            store.setRecord( '__current_server', {
                'url': props.server,
                'helper': props.helper,
                'inputValue': props.inputValue
            }, false, true );
        } else {
            resp = {};
            if ( reset ) {
                showVirginHint();
                store.removeRecord( '__current_server' );
            }
        }
        $( 'progress' ).hide();
        gui.parseFormlist( resp, $( '#form-list' ), reset );
    }

    /**
     * Adds urls to links
     * @param  {?Object.<string, string>} resp [description]
     * @param  {string} msg  [description]
     */

    function processSurveyURLResponse( response ) {
        var records, recordArr,
            resp = response.responseJSON,
            url = resp.url || null,
            server = resp.serverURL || null,
            reason = resp.message || '',
            id = resp.formId || null;
        console.debug( resp );
        console.debug( 'processing link to:  ' + url );
        if ( url && server && id ) {
            records = store.getRecord( '__server_' + server ) || {};
            //record[id]['url'] = url;
            recordArr = $.grep( records, function( rec ) {
                return ( rec.form_id == id );
            } );
            if ( recordArr[ 0 ] ) {
                recordArr[ 0 ].url = url;
                store.setRecord( '__server_' + server, records, false, true );
                //$('a[id="'+id+'"][data-server="'+server+'"]').attr('href', url).click();
                window.location = url;
            }
            console.error( 'record not found in localStorage' );
        } else {
            //TODO: add error handling
            gui.alert( 'Form launch failed. Reason: ' + reason, 'Form could not be launched.' );
        }
    }

    return {
        init: init
    };
} );
