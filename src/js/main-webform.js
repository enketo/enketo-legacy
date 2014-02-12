/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {

    require( [ 'performance', 'cache', 'store', 'file-manager', 'controller-webform', 'jquery' ],
        function( monitor, cache, recordStore, fileStore, controller, $ ) {

            if ( !recordStore.isSupported() || !recordStore.isWritable() ) {
                window.location = settings[ 'modernBrowsersURL' ];
            } else if ( cache.requested() && !cache.activated() ) {
                gui.showCacheUnsupported();
            } else if ( cache.requested() ) {
                $( document ).trigger( 'browsersupport', 'offline-launch' );
            }

            $( document ).ready( function() {
                controller.init( 'form.or:eq(0)', modelStr, null, {
                    recordStore: recordStore,
                    fileStore: fileStore,
                    submitInterval: 300 * 1000
                } );
            } );
        } );
} );
