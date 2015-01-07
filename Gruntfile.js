/*jshint node:true*/
"use strict";

module.exports = function( grunt ) {

    // show elapsed time at the end
    require( 'time-grunt' )( grunt );
    // load all grunt tasks
    require( 'load-grunt-tasks' )( grunt );

    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),
        jsbeautifier: {
            test: {
                src: [ "*.js", "src/js/**/*.js" ],
                options: {
                    config: "./.jsbeautifyrc",
                    mode: "VERIFY_ONLY"
                }
            },
            fix: {
                src: [ "*.js", "src/js/**/*.js" ],
                options: {
                    config: "./.jsbeautifyrc"
                }
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [ "*.js", "src/js/**/*.js", "!src/js/extern.js" ]
        },
        prepWidgetSass: {
            writePath: "public/src/sass/component/_widgets.scss",
            widgetConfigPath: "public/src/js/config.json"
        },
        watch: {
            sass: {
                files: [ 'public/src/js/config.json', 'public/src/sass/**/*.scss', 'public/lib/enketo-core/src/**/*.scss', 'src-private/sass/**/*.scss' ],
                tasks: [ 'style' ],
                options: {
                    spawn: false
                }
            },
            js: {
                files: [ '*.js', 'src/js/*/**.js', 'public/enketo-core/**/*.js' ],
                tasks: [ 'compile' ],
                options: {
                    spawn: false
                }
            }
        },
        sass: {
            pub: {
                files: {
                    'public/build/css/webform_formhub.css': 'public/src/sass/webform_formhub.scss',
                    'public/build/css/webform_print_formhub.css': 'public/src/sass/webform_print_formhub.scss',
                    'public/build/css/empty-front.css': 'public/src/sass/empty-front.scss',
                    'public/build/css/forms.css': 'public/src/sass/forms.scss',
                    'public/build/css/formtester.css': 'public/src/sass/formtester.scss',
                    'public/build/css/webform_grid.css': 'public/src/sass/webform_grid.scss',
                    'public/build/css/webform_print_grid.css': 'public/src/sass/webform_print_grid.scss'
                }
            },
            pri: {
                files: {

                    'public/build/css/openrosa.css': 'src-private/sass/private/openrosa.scss',
                    'public/build/css/front.css': 'src-private/sass/private/front.scss'
                }
            }
        },
        jasmine: {
            test: {
                src: [ "public/src/js/module/connection.js", "public/src/js/module/store.js" ],
                options: {
                    keepRunner: true,
                    specs: "test/spec/*.spec.js",
                    helpers: [],
                    template: require( "grunt-template-jasmine-requirejs" ),
                    templateOptions: {
                        //requireConfigFile: "src/js/require-config.js",
                        requireConfig: {
                            baseUrl: "public/src/js/module",
                            paths: {
                                "gui": "../../../../test/mock/gui.mock",
                                "lib": "../../../lib",
                                "enketo-js": "../../../lib/enketo-core/src/js",
                                "enketo-js/Form": "../../../../test/mock/Form.mock",
                                "enketo-js/FormModel": "../../../../test/mock/FormModel.mock",
                                "enketo-widget": "../../../../test/mock/empty.mock",
                                "enketo-config": "../config.json", //should move elsewhere
                                "text": "../../../lib/enketo-core/lib/text/text",
                                "xpath": "../../../../test/mock/empty.mock",
                                "file-manager": "../../../../test/mock/empty.mock",
                                "jquery.xpath": "../../../../test/mock/empty.mock",
                                "Modernizr": "../../../../test/mock/empty.mock",
                                "bootstrap": "../../../lib/enketo-core/lib/bootstrap",
                                "jquery": "../../../lib/bower-components/jquery/dist/jquery",
                                "file-saver": "../../../../test/mock/file-saver.mock",
                                "Blob": "../../../../test/mock/Blob.mock",
                                "vkbeautify": "../../../../test/mock/vkbeautify.mock"
                            },
                        }
                    }
                }
            }
        },
        // this compiles all javascript to a single minified file
        requirejs: {
            options: {
                //generateSourceMaps: true,
                preserveLicenseComments: false,
                baseUrl: "public/src/js/module",
                findNestedDependencies: true,
                include: [ '../../../lib/bower-components/requirejs/require' ],
                mainConfigFile: "public/src/js/require-config.js",
                optimize: "uglify2",
                done: function( done, output ) {
                    var duplicates = require( 'rjs-build-analysis' ).duplicates( output );

                    if ( duplicates.length > 0 ) {
                        grunt.log.subhead( 'Duplicates found in requirejs build:' );
                        grunt.log.warn( duplicates );
                        done( new Error( 'r.js built duplicate modules, please check the excludes option.' ) );
                    } else {
                        grunt.log.writeln( 'Checked for duplicates. All seems OK!' );
                    }
                    done();
                }
            },
            "webform": getWebformCompileOptions(),
            "webform-edit": getWebformCompileOptions( 'edit' ),
            "webform-preview": getWebformCompileOptions( 'preview', false ),
            "webform-single": getWebformCompileOptions( 'single' ),
            "webform-tester": getWebformCompileOptions( 'tester' ),
            "front": {
                options: {
                    name: "../main-front",
                    out: "public/build/js/front-combined.min.js"
                }
            },
            "formlist": {
                options: {
                    name: "../main-formlist",
                    out: "public/build/js/formlist-combined.min.js"
                }
            }
        }
    } );

    function getWebformCompileOptions( type, offline ) {
        //add widgets js and widget config.json files
        var widgets = grunt.file.readJSON( 'public/src/js/config.json' ).widgets;
        offline = ( typeof offline === 'undefined' ) ? true : offline;
        widgets.forEach( function( widget, index, arr ) {
            arr.push( 'text!' + widget.substr( 0, widget.lastIndexOf( '/' ) + 1 ) + 'config.json' );
        } );
        type = ( type ) ? '-' + type : '';
        return {
            options: {
                name: "../main-webform" + type,
                mainConfigFile: ( offline ) ? "public/src/js/require-config.js" : [ "public/src/js/require-config.js", "public/src/js/require-online-config.js" ],
                out: "public/build/js/webform" + type + "-combined.min.js",
                include: [ '../../../lib/bower-components/requirejs/require' ].concat( widgets )
            }
        };
    }

    //maybe this can be turned into a npm module?
    grunt.registerTask( "prepWidgetSass", "Preparing _widgets.scss dynamically", function() {
        var widgetConfig, widgetFolderPath, widgetSassPath, widgetConfigPath,
            config = grunt.config( "prepWidgetSass" ),
            widgets = grunt.file.readJSON( config.widgetConfigPath ).widgets,
            content = "// Dynamically created list of widget stylesheets to import\r\n" +
            "// based on the content of config.json\r\n\r\n";

        widgets.forEach( function( widget ) {
            if ( widget.indexOf( "enketo-widget/" ) === 0 ) {
                //strip require.js module name
                widgetFolderPath = widget.substr( 0, widget.lastIndexOf( "/" ) + 1 );
                //replace widget require.js path shortcut with proper path relative to src/js
                widgetSassPath = widgetFolderPath.replace( /^enketo-widget\//, "public/lib/enketo-core/src/widget/" );
                //create path to widget config file
                widgetConfigPath = widgetFolderPath.replace( /^enketo-widget\//, "public/lib/enketo-core/src/widget/" ) + "config.json";
                grunt.log.writeln( "widget config path: " + widgetConfigPath );
                //create path to widget stylesheet file
                widgetSassPath += grunt.file.readJSON( widgetConfigPath ).stylesheet;
            } else {
                grunt.log.error( [ "Expected widget path " + widget + " in config.json to be preceded by \"widget/\"." ] );
            }
            //replace this by a function that parses config.json in each widget folder to get the "stylesheet" variable
            content += "@import \"" + widgetSassPath + "\";\r\n";
        } );

        grunt.file.write( config.writePath, content );

    } );
    grunt.registerTask( "test", [ "jsbeautifier:test", "jshint", "jasmine" ] );
    grunt.registerTask( "style", [ "prepWidgetSass", "sass" ] );
    grunt.registerTask( "compile", [ "requirejs" ] );
    grunt.registerTask( "default", [ "style", "compile" ] );
};
