/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-webform' ],
        function( controller ) {
            controller.init( 'form.or:eq(0)', modelStr, null, {} );
        } );
} );
