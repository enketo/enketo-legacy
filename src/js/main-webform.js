/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {
    require( [ 'cache', 'gui', 'store', 'file-manager', 'controller-webform' ],
        function( cache, gui, recordStore, fileStore, controller ) {

            if ( !recordStore.isSupported() || !recordStore.isWritable() ) {
                window.location = settings[ 'modernBrowsersURL' ];
            } else if ( cache.requested() && cache.activated() ) {
                $( document ).trigger( 'browsersupport', 'offline-launch' );
            } else if ( cache.requested() ) {
                gui.showCacheUnsupported();
            }

            controller.init( 'form.or:eq(0)', modelStr, null, {
                recordStore: recordStore,
                fileStore: fileStore,
                submitInterval: 300 * 1000
            } );
        } );
} );
