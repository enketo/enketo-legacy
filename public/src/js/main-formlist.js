/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-formlist' ], function( controller ) {
        controller.init();
    } );
} );
