/*jshint node:true*/
"use strict";
var _, js;

Array.prototype.prefix = function( prefix, suffix ) {
  return _.map( this, function( name ) {
    return prefix + name;
  } );
};

_ = require( 'underscore' );
js = {
  common: [ ].concat(
    [ 'jquery.min.js',
      'bootstrap.min.js',
      'modernizr.min.js',
      'bootstrap-timepicker/js/bootstrap-timepicker.js',
      'bootstrap-datepicker/js/bootstrap-datepicker.js',
      'xpath/build/xpathjs_javarosa.min.js'
    ].prefix( 'public/libraries/enketo-core/lib/' ), [
      'vkbeautify.js',
      'file-saver/FileSaver.js',
      'blob/Blob.js'
    ].prefix( 'public/libraries/' ), [ 'helpers.js',
      'gui.js'
    ].prefix( 'src/js/' ) ),
  files: [
    'file-manager/src/files.js'
  ].prefix( 'public/libraries/' ),
  engine: [
    'utils.js',
    'form.js',
    'widgets.js'
  ].prefix( 'public/libraries/enketo-core/src/js/' ),
  offline: [
    'cache.js'
  ].prefix( 'src/js/' ),
  online: [
    'storage.js',
    'survey_controls.js',
    'connection.js'
  ].prefix( 'src/js/' ),
};

module.exports = function( grunt ) {
  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [ 'Gruntfile.js', 'src/js/**/*.js', '!src/js/extern.js' ]
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      tester: {
        files: [ {
          src: [ ].concat( js.common, js.engine, js.online, 'src/js/formtester.js' ),
          dest: 'public/build/js/formtester.min.js',
          nonull: true
        } ]
      },
      webforms: {
        files: [ {
          src: [ ].concat( js.common, js.files, js.engine, js.online, js.offline, 'src/js/webform.js' ),
          dest: 'public/build/js/webform.min.js',
          nonull: true
        }, {
          src: [ ].concat( js.common, js.files, js.engine, js.online, 'src/js/webform_preview.js' ),
          dest: 'public/build/js/webform-preview.min.js',
          nonull: true
        }, {
          src: [ ].concat( js.common, js.files, js.engine, js.online, 'src/js/webform_edit.js' ),
          dest: 'public/build/js/webform-edit.min.js',
          nonull: true
        }, {
          src: [ ].concat( js.common, js.files, js.engine, js.online, 'src/js/webform_single.js' ),
          dest: 'public/build/js/webform-single.min.js',
          nonull: true
        } ]
      },
      front: {
        files: [ {
          src: [ ].concat( js.common, 'src/js/front.js' ),
          dest: 'public/build/js/front.min.js',
          nonull: true
        } ]
      },
      list: {
        files: [ {
          src: [ ].concat( js.common, js.offline, 'public/libraries/enketo-core/src/js/utils.js',
            'src/js/storage.js', 'src/js/connection.js', 'src/js/formlist.js' ),
          dest: 'public/build/js/formlist.min.js',
          nonull: true
        } ]
      }
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

  grunt.registerTask( 'test', [ 'jasmine' ] );
  grunt.registerTask( 'default', [ 'jshint', 'uglify', 'sass', 'test' ] );
};