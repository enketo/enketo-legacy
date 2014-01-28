/**
 * Default /webform
 */

require( [ 'require-config' ], function( rc ) {

    require( [ 'performance', 'cache', 'gui', 'store', 'file-manager', 'controller-webform', 'jquery' ],
        function( monitor, cache, gui, recordStore, fileStore, controller, $ ) {

            profiler.time( 'pre-controller init' );
            if ( !recordStore.isSupported() || !recordStore.isWritable() ) {
                window.location = settings[ 'modernBrowsersURL' ];
            } else if ( cache.requested() && !cache.activated() ) {
                gui.showCacheUnsupported();
            } else if ( cache.requested() ) {
                $( document ).trigger( 'browsersupport', 'offline-launch' );
            }
            profiler.timeEnd( 'pre-controller init' );
            profiler.time( 'controller init' );
            controller.init( 'form.or:eq(0)', modelStr, null, {
                recordStore: recordStore,
                fileStore: fileStore,
                submitInterval: 300 * 1000
            } );
            profiler.timeEnd( 'controller init' );
        } );
} );
