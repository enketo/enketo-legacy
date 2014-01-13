/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {

    require( [ 'performance', 'cache', 'gui', 'store', 'file-manager', 'controller-webform', 'jquery' ],
        function( monitor, cache, gui, recordStore, fileStore, controller, $ ) {

            if ( !recordStore.isSupported() || !recordStore.isWritable() ) {
                window.location = settings[ 'modernBrowsersURL' ];
            } else if ( cache.requested() && !cache.activated() ) {
                gui.showCacheUnsupported();
            } else if ( cache.requested() ) {
                $( document ).trigger( 'browsersupport', 'offline-launch' );
            }

            controller.init( 'form.or:eq(0)', modelStr, null, {
                recordStore: recordStore,
                fileStore: fileStore,
                submitInterval: 300 * 1000
            } );
        } );
} );
