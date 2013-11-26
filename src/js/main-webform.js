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
        "jquery": "../lib/enketo-core/lib/jquery"
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
        }
    }
} );

requirejs( [ 'Modernizr', 'enketo-js/Form', 'file-manager', 'store', 'controls', 'cache', 'gui', 'jquery', ],
    function( Modernizr, Form, fileManager, store, controls, cache, gui, $ ) {
        var loadErrors, form;

        if ( !store.isSupported() || !store.isWritable() ) {
            window.location = settings[ 'modernBrowsersURL' ];
        } else if ( fileManager.isSupported() && store.getRecordList().length === 0 ) {
            //clean up filesystem storage
            fileManager.deleteAll();
        }

        //remove filesystem folder after successful submission
        $( document ).on( 'submissionsuccess', function( ev, recordName, instanceID ) {
            fileManager.deleteDir( instanceID );
        } );

        gui.updateStatus.offlineLaunch( false );

        if ( cache.requested() && cache.activated() ) {
            $( document ).trigger( 'browsersupport', 'offline-launch' );
        } else if ( cache.requested() ) {
            gui.showCacheUnsupported();
        }

        form = new Form( 'form.or:eq(0)', modelStr );

        //for debugging
        window.form = form;
        window.gui = gui;

        //initialize form and check for load errors
        loadErrors = form.init();

        if ( loadErrors.length > 0 ) {
            console.error( 'load errors:', loadErrors );
            gui.showLoadErrors( loadErrors, 'It is recommended not to use this form for data entry until this is resolved.' );
        }

        controls.init( form, {
            submitInterval: 300 * 1000,
            localStorage: true
        } );
    } );
