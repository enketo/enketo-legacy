/**
 * /webform/edit
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-webform', 'file-manager', 'jquery' ],
        function( controller, fileStore, $ ) {
            $( document ).ready( function() {
                controller.init( 'form.or:eq(0)', modelStr, instanceStrToEdit, {
                    fileStore: fileStore
                } );
            } );
        } );
} );
