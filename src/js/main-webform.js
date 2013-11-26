requirejs.config( {
    baseUrl: "../src-js",
    paths: {
        "lib": "../lib",
        "enketo-js": "../lib/enketo-core/src/js",
        "enketo-widget": "../lib/enketo-core/src/widget",
        "enketo-config": "../src-js/config.json", //should move elsewhere
        "text": "../lib/enketo-core/lib/text/text",
        "xpath": "../lib/enketo-core/lib/xpath/build/xpathjs_javarosa",
        "file-manager": "../lib/enketo-core/lib/file-manager/src/file-manager",
        "jquery.xpath": "../lib/enketo-core/lib/jquery-xpath/jquery.xpath",
        "Modernizr": "../lib/enketo-core/lib/Modernizr",
        "bootstrap": "../lib/enketo-core/lib/bootstrap",
        "jquery": "../lib/enketo-core/lib/jquery",
        "file-saver": "../lib/file-saver/FileSaver",
        "Blob": "../lib/blob/Blob",
        "vkbeautify": "../lib/vkbeautify/vkbeautify"
    },
    shim: {
        "xpath": {
            exports: "XPathJS"
        },
        "bootstrap": {
            deps: [ "jquery" ],
            exports: "jQuery.fn.bootstrap"
        },
        "enketo-widget/date/bootstrap3-datepicker/js/bootstrap-datepicker": {
            deps: [ "jquery" ],
            exports: "jQuery.fn.datepicker"
        },
        "enketo-widget/time/bootstrap3-timepicker/js/bootstrap-timepicker": {
            deps: [ "jquery" ],
            exports: "jQuery.fn.timepicker"
        },
        "Modernizr": {
            exports: "Modernizr"
        },
        "file-saver": {
            exports: "saveAs"
        },
        "Blob": {
            exports: "Blob"
        },
        "vkbeautify": {
            exports: "vkbeautify"
        }

    }
} );

requirejs( [ 'cache', 'gui', 'store', 'file-manager', 'controls' ],
    function( cache, gui, recordStore, fileStore, controls ) {
        var loadErrors, form;

        if ( !recordStore.isSupported() || !recordStore.isWritable() ) {
            window.location = settings[ 'modernBrowsersURL' ];
        } else if ( cache.requested() && cache.activated() ) {
            $( document ).trigger( 'browsersupport', 'offline-launch' );
        } else if ( cache.requested() ) {
            gui.showCacheUnsupported();
        }

        controls.init( 'form.or:eq(0)', modelStr, null, {
            recordStore: recordStore,
            fileStore: fileStore,
            submitInterval: 300 * 1000
        } );
    } );
