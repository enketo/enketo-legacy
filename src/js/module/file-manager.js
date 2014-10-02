/**
 * Hacked-together file manager for filesystem API. The filesystem library is a mess.
 *
 *
 * The replacement should support the same public methods and return the same
 * types.
 */

define( [ "q", "file-system", "jquery" ], function( Q, fileSystem, $ ) {
    "use strict";

    var maxSize,
        fsReady = fileSystem.init(),
        supported = fileSystem.isSupported(),
        notSupportedAdvisoryMsg = 'Please use Chrome (all OS except iOS) or Puffin (iOS only).';

    /**
     * Initialize the file manager .
     * @return {[type]} promise boolean or rejection with Error
     */
    function init() {
        var deferred = Q.defer();

        if ( supported ) {
            fsReady.then( function() {
                deferred.resolve( true );
            } );
            // Error not caught. Need to use Q in file-system library as jQuery's
            // deferred are not completely compatible.
        } else {
            deferred.reject( new Error( 'Filesystem API is not supported on this browser.' ) );
        }

        return deferred.promise;
    }

    /**
     * Whether filemanager is supported in browser
     * @return {Boolean}
     */
    function isSupported() {
        return supported;
    }

    /**
     * Whether the filemanager is waiting for user permissions
     * @return {Boolean} [description]
     */
    function isWaitingForPermissions() {
        return true;
    }

    /**
     * Obtains a url that can be used to show a preview of the file when used
     * as a src attribute.
     *
     * @param  {?string|Object} subject File or filename
     * @return {[type]}         promise url string or rejection with Error
     */
    function getFileUrl( subject ) {
        var error, reader,
            deferred = Q.defer();

        if ( !subject ) {
            deferred.resolve( null );
        } else if ( typeof subject === 'string' ) {
            fileSystem.retrieveFileUrl( _getCurrentInstanceID(), subject, {
                success: deferred.resolve,
                error: deferred.reject
            } );
        } else if ( typeof subject === 'object' ) {
            if ( _isTooLarge( subject ) ) {
                error = new Error( 'File too large (max ' +
                    ( Math.round( ( _getMaxSize() * 100 ) / ( 1024 * 1024 ) ) / 100 ) +
                    ' Mb)' );
                deferred.reject( error );
            } else {
                reader = new FileReader();
                reader.onload = function( e ) {
                    deferred.resolve( e.target.result );
                };
                reader.onerror = function( e ) {
                    deferred.reject( error );
                };
                reader.readAsDataURL( subject );
            }
        } else {
            deferred.reject( new Error( 'Unknown error occurred' ) );
        }
        return deferred.promise;
    }

    var getFile = fileSystem.retrieveFile;

    /**
     * Obtain files currently stored in file input elements of open record
     * @return {[File]} array of files
     */
    function getCurrentFiles() {
        var file,
            deferred = Q.defer(),
            files = [];

        // first get any files inside file input elements
        $( 'form.or input[type="file"]' ).each( function() {
            file = this.files[ 0 ];
            if ( file ) {
                files.push( file );
            }
        } );
        return files;
    }

    /**
     * Saves all the files living currently inside file inputs into the filesystem
     * @return {[type]} [description]
     */
    function saveCurrentFiles() {
        var deferred = Q.defer(),
            finished = 0,
            files = getCurrentFiles();

        if ( files.length === 0 ) {
            deferred.resolve( true );
        } else if ( isSupported() ) {
            // asynchronously save each file
            _createDirectory( _getCurrentInstanceID() )
                .then( function() {
                    console.debug( 'going to save the files', files );
                    files.forEach( function( file ) {
                        fileSystem.saveFile( file, {
                            success: function( u ) {
                                finished++;
                                if ( finished === files.length ) {
                                    return deferred.resolve( u );
                                }
                            },
                            // let this fail quietly
                            error: function( e ) {
                                finished++;
                                if ( finished === files.length ) {
                                    return deferred.reject( e );
                                }
                            }
                        } );
                    } );
                } );
        } else {
            deferred.reject( new Error( 'Not supported.' ) );
        }

        return deferred.promise;
    }

    function flush( folder ) {
        if ( !folder ) {
            fileSystem.deleteAll();
        } else {
            fileSystem.deleteDir( folder );
        }
    }

    /**
     * Whether the file is too large too handle and should be rejected
     * @param  {[type]}  file the File
     * @return {Boolean}
     */
    function _isTooLarge( file ) {
        return file && file.size > _getMaxSize();
    }

    /**
     * Returns the maximum size of a file
     * @return {Number}
     */
    function _getMaxSize() {
        if ( !maxSize ) {
            maxSize = $( document ).data( 'maxSubmissionSize' ) || 5 * 1024 * 1024;
        }
        return maxSize;
    }

    function _getCurrentInstanceID() {
        var id = $( 'form.or' ).data( 'instanceID' );
        if ( !id ) {
            console.error( 'Filemanager could not find instanceID. Files will not be saved correctly!' );
        }
        return id;
    }

    function _createDirectory( dirName ) {
        var deferred = Q.defer(),
            callbacks = {
                success: function() {
                    deferred.resolve( true );
                },
                error: function() {
                    deferred.reject( new Error( 'No permission given to store local data (or an error occurred).' ) );
                }
            };

        fileSystem.setDir( dirName, callbacks );

        return deferred.promise;
    }

    return {
        isSupported: isSupported,
        notSupportedAdvisoryMsg: notSupportedAdvisoryMsg,
        isWaitingForPermissions: isWaitingForPermissions,
        init: init,
        getFileUrl: getFileUrl,
        getCurrentFiles: getCurrentFiles,
        getFile: getFile,
        saveCurrentFiles: saveCurrentFiles,
        flush: flush
    };
} );
