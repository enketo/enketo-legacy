/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-formtester' ], function( controller ) {
        controller.init();
    } );
} );
