/**
 * The common require.js configuration file for the build system.
 */

require.config( {
    baseUrl: "src/js/module",
    paths: {
        "core-lib": "../../../public/lib/enketo-core/lib",
        "require-config": "../require-build-config",

        "enketo-js": "../../../public/lib/enketo-core/src/js",
        "enketo-widget": "../../../public/lib/enketo-core/src/widget",
        "enketo-config": "../config.json", //should move elsewhere
        "text": "../../../public/lib/enketo-core/lib/text/text",
        "xpath": "../../../public/lib/enketo-core/lib/xpath/build/xpathjs_javarosa",
        "file-manager": "../../../public/lib/enketo-core/lib/file-manager/src/file-manager",
        "jquery.xpath": "../../../public/lib/enketo-core/lib/jquery-xpath/jquery.xpath",
        "Modernizr": "../../../public/lib/enketo-core/lib/Modernizr",
        "bootstrap": "../../../public/lib/enketo-core/lib/bootstrap",
        "jquery": "../../../public/lib/enketo-core/lib/jquery",
        "jquery.touchswipe": "../../../public/lib/enketo-core/lib/jquery-touchswipe/jquery.touchSwipe",
        "file-saver": "../../../public/lib/file-saver/FileSaver",
        "Blob": "../../../public/lib/blob/Blob",
        "vkbeautify": "../../../public/lib/vkbeautify/vkbeautify"
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
