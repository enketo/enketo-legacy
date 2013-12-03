/**
 * /webform/edit
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-webform', 'file-manager' ],
        function( controller, fileStore ) {
            controller.init( 'form.or:eq(0)', modelStr, instanceStrToEdit, {
                fileStore: fileStore
            } );
        } );
} );
