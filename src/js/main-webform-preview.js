/**
 * /webform/preview
 */


require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-webform', 'settings', 'gui', 'connection', 'file-manager' ],
        function( controller, settings, gui, connection, fileStore ) {
            var response, bgColor,
                i = 0,
                $ads = $( '.ad' ),
                $formFooter = $( '.form-footer' ),
                $loading = $( 'progress' );

            if ( ( !settings.serverURL || !settings.formId ) && !settings.formURL ) {
                showError( 'No server url and/or id provided or no form url provided.' );
                return;
            }

            connection.getTransForm( settings.serverURL, settings.formId, null, settings.formURL, {
                success: function( response ) {
                    var loadErrors, formStr, modelStr,
                        $response = $( response );

                    if ( $response.find( ':first>form' ).length > 0 && $response.find( ':first>model' ).length > 0 ) {
                        formStr = new XMLSerializer().serializeToString( $response.find( ':first>form' )[ 0 ] );
                        modelStr = new XMLSerializer().serializeToString( $response.find( ':first>model' )[ 0 ] );
                        $formFooter.before( formStr );

                        controller.init( 'form.or:eq(0)', modelStr, null, {
                            fileStore: fileStore
                        } );

                        $formFooter.find( '#validate-form' ).removeAttr( 'disabled' );
                    } else {
                        showError( 'An error occurred trying to obtain or transform the form.' );
                    }
                },
                error: function( jqXHR, status, errorThrown ) {
                    if ( jqXHR && jqXHR.status === 401 ) {
                        gui.confirmLogin( '<p>Form is protected and requires authentication.</p><p>Would you like to log in now?</p>' );
                    } else {
                        showError( 'An error occurred trying to obtain or transform the form (' + errorThrown + ')' );
                    }
                    $loading.remove();
                },
                complete: function() {
                    $loading.remove();
                }
            } );

            function showError( msg ) {
                $( '#validate-form' ).prev( '.alert' ).remove();
                $( '#validate-form' ).before( '<p class="load-error alert alert-error alert-block">' + msg + '</p>' );
            }
        } );
} );
