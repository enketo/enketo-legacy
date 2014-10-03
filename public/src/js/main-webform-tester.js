/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'controller-formtester', 'jquery' ], function( controller, $ ) {
        $( document ).ready( function() {
            controller.init();
        } );
    } );
} );
