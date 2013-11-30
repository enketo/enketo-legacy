/*jshint node:true*/
"use strict";

module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
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
                jshintrc: '.jshintrc'
            },
            all: [ '*.js', 'src/js/**/*.js', '!src/js/extern.js' ]
        },
        prepWidgetSass: {
            writePath: 'src/scss/_widgets.scss',
            widgetConfigPath: 'src/js/config.json'
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [ {
                    expand: true,
                    cwd: 'src/scss',
                    src: [ '**/*.scss', '!**/_*.scss' ],
                    dest: 'public/build/css',
                    ext: '.css'
                } ]
            }
        },
        jasmine: {
            test: {
                src: [ 'src/js/module/connection.js', 'src/js/module/store.js' ],
                options: {
                    keepRunner: true,
                    specs: 'test/spec/*.spec.js',
                    helpers: [ 'test/mock/connection.mock.js' ],
                    template: require( 'grunt-template-jasmine-requirejs' ),
                    templateOptions: {
                        //requireConfigFile: 'src/js/require-config.js',
                        requireConfig: {
                            baseUrl: "src/js/module",
                            paths: {
                                "gui": "../../../test/mock/gui.mock",
                                "lib": "../../../public/lib",
                                "enketo-js/Form": "../../../test/mock/Form.mock",
                                "enketo-js/FormModel": "../../../test/mock/FormModel.mock",
                                "enketo-widget": "../../../test/mock/empty.mock",
                                "enketo-config": "config.json", //should move elsewhere
                                "text": "../../../public/lib/enketo-core/lib/text/text",
                                "xpath": "../../../test/mock/empty.mock",
                                "file-manager": "../../../test/mock/empty.mock",
                                "jquery.xpath": "../../../test/mock/empty.mock",
                                "Modernizr": "../../../test/mock/empty.mock",
                                "bootstrap": "../../../public/lib/enketo-core/lib/bootstrap",
                                "jquery": "../../../public/lib/enketo-core/lib/jquery",
                                "file-saver": "../../../test/mock/file-saver.mock",
                                "Blob": "../../../test/mock/Blob.mock",
                                "vkbeautify": "../../../test/mock/vkbeautify.mock"
                            },
                        }
                    }
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-jsbeautifier' );
    grunt.loadNpmTasks( 'grunt-contrib-jasmine' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-requirejs' );

    //maybe this can be turned into a npm module?
    grunt.registerTask( 'prepWidgetSass', 'Preparing _widgets.scss dynamically', function() {
        var widgetConfig, widgetFolderPath, widgetSassPath, widgetConfigPath,
            config = grunt.config( 'prepWidgetSass' ),
            widgets = grunt.file.readJSON( config.widgetConfigPath ).widgets,
            content = '// Dynamically created list of widget stylesheets to import based on the content\r\n' +
                '// based on the content of config.json\r\n\r\n';

        widgets.forEach( function( widget ) {
            if ( widget.indexOf( 'enketo-widget/' ) === 0 ) {
                //strip require.js module name
                widgetFolderPath = widget.substr( 0, widget.lastIndexOf( '/' ) + 1 );
                //replace widget require.js path shortcut with proper path relative to src/js
                widgetSassPath = widgetFolderPath.replace( /^enketo-widget\//, 'public/lib/enketo-core/src/widget/' );
                //create path to widget config file
                widgetConfigPath = widgetFolderPath.replace( /^enketo-widget\//, 'public/lib/enketo-core/src/widget/' ) + 'config.json';
                grunt.log.writeln( 'widget config path: ' + widgetConfigPath );
                //create path to widget stylesheet file
                widgetSassPath += grunt.file.readJSON( widgetConfigPath ).stylesheet;
            } else {
                grunt.log.error( [ 'Expected widget path "' + widget + '" in config.json to be preceded by "widget/".' ] );
            }
            //replace this by a function that parses config.json in each widget folder to get the 'stylesheet' variable
            content += '@import "' + widgetSassPath + '";\r\n';
        } );

        grunt.file.write( config.writePath, content );

    } );
    grunt.registerTask( 'test', [ 'jsbeautifier:test', 'jshint', 'jasmine' ] );
    grunt.registerTask( 'style', [ 'prepWidgetSass', 'sass' ] );
    grunt.registerTask( 'default', [ 'jshint', 'uglify', 'sass', 'test' ] );
};
