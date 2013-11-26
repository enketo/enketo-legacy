/*jshint node:true*/
"use strict";

module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [ 'Gruntfile.js', 'src/js/**/*.js', '!src/js/extern.js' ]
        },
        prepWidgetSass: {
            writePath: 'src/scss/_widgets.scss',
            widgetConfigPath: 'src/js/config.json'
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
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
                src: [ 'src/js/connection.js', 'src/js/storage.js', 'src/js/helpers.js' ],
                options: {
                    specs: 'tests/spec/*.js',
                    helpers: [ 'tests/util/*.js', 'tests/mock/*.js' ],
                    vendor: [
                        'public/libraries/enketo-core/lib/jquery.min.js',
                        'public/libraries/enketo-core/lib/bootstrap.min.js',
                        'public/libraries/enketo-core/lib/modernizr.min.js',
                        'public/libraries/enketo-core/src/js/utils.js',
                        'public/libraries/enketo-core/lib/xpath/build/xpathjs_javarosa.min.js',
                        'public/libraries/enketo-core/lib/bootstrap-datepicker/js/bootstrap-datepicker.js',
                        'public/libraries/enketo-core/lib/bootstrap-timepicker/js/bootstrap-timepicker.js'
                    ]
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-jasmine' );

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
    grunt.registerTask( 'test', [ 'jasmine' ] );
    grunt.registerTask( 'style', [ 'prepWidgetSass', 'sass' ] );
    grunt.registerTask( 'default', [ 'jshint', 'uglify', 'sass', 'test' ] );
};
