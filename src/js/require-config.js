/**
 * The common require.js configuration file, to be loaded in the main-xxxx files.
 */

require.config( {
    baseUrl: "/src-js/module",
    paths: {
        "enketo-js": "../../lib/enketo-core/src/js",
        "enketo-widget": "../../lib/enketo-core/src/widget",
        "enketo-config": "../../src-js/config.json", //should move elsewhere
        "text": "../../lib/enketo-core/lib/text/text",
        "xpath": "../../lib/enketo-core/lib/xpath/build/xpathjs_javarosa",
        "file-manager": "../../lib/enketo-core/lib/file-manager/src/file-manager",
        "jquery.xpath": "../../lib/enketo-core/lib/jquery-xpath/jquery.xpath",
        "Modernizr": "../../lib/enketo-core/lib/Modernizr",
        "bootstrap": "../../lib/enketo-core/lib/bootstrap",
        "jquery": "../../lib/enketo-core/lib/jquery",
        "jquery.touchswipe": "../../lib/enketo-core/lib/jquery-touchswipe/jquery.touchSwipe",
        "file-saver": "../../lib/file-saver/FileSaver",
        "Blob": "../../lib/blob/Blob",
        "vkbeautify": "../../lib/vkbeautify/vkbeautify"
    },
    shim: {
        "xpath": {
            exports: "XPathJS"
        },
        "bootstrap": {
            deps: [ "jquery" ],
            exports: "jQuery.fn.popover"
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

/*
if ( !document.getElementsByTagName( 'html' )[ 0 ].getAttribute( 'manifest' ) ) {
    define( 'file-manager', function() {
        return undefined;
    } );
}
*/
