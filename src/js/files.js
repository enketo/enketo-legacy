/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jslint browser:true, devel:true, jquery:true, smarttabs:true sub:true*/

/**
 * FileManager Class for PERSISTENT file storage, used to storage file inputs for later submission
 * Could be expanded, if ever needed, to use TEMPORARY file storage as well
 *
 * @constructor
 */
function FileManager(){
	"use strict";

	var fs, requestQuota, requestFileSystem, errorHandler, setCurrentQuotaUsed, dirName, dirPrefix,
		currentQuota = null,
		currentQuotaUsed = null,
		DEFAULTBYTESREQUESTED = 10 * 1024 * 1024;

	this.getCurrentQuota = function(){return currentQuota;}; //REMOVE, IS TEMPORARY
	this.getCurrentQuotaUsed = function(){return currentQuotaUsed;};
	this.getFS = function(){return fs;};
	
	/**
	 * Initializes the File Manager
	 * @param  {string}					directory name of directory to store files in
	 * @param  {Object.<string, Function>} callbacks callback functions (error, and success)
	 * @return {boolean}					returns true/false if File API is supported by browser
	 */
	this.init = function(directory, callbacks){
		if (this.isSupported()){
			var that = this;
			dirName = directory;
			dirPrefix = '/'+directory+'/';

			setCurrentQuotaUsed();
			requestQuota(
				DEFAULTBYTESREQUESTED,
				{
					success: function(grantedBytes){
						requestFileSystem(
							grantedBytes,
							{
								success: function(fsys){
									fs = fsys;
									that.createDir(
										dirName,
										callbacks
									);
								},
								error: errorHandler
							}
						);
					},
					error: errorHandler
				}
			);
			//TODO: move this to final success eventhandler?
			$(document).on('submissionsuccess', function(ev, recordName, instanceID){
				that.deleteDir(instanceID);
			});
			return true;
		}
		else{
			return false;
		}
	};

	/**
	 * Checks if File API is supported by browser
	 * @return {boolean}
	 */
	this.isSupported = function(){
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
		window.storageInfo = window.storageInfo || window.webkitStorageInfo;
		return (typeof window.requestFileSystem !== 'undefined' && typeof window.resolveLocalFileSystemURL !== 'undefined' && window.storageInfo !== 'undefined');
	};

	/**
	 * Requests PERSISTENT file storage (may prompt user) asynchronously
	 * @param  {number}						bytesRequested the storage size in bytes that is requested
	 * @param  {Object.<string, Function>}	callbacks      callback functions (error, and success)
	 */
	requestQuota = function(bytesRequested, callbacks){
		window.storageInfo.requestQuota(
			window.storageInfo.PERSISTENT,
			bytesRequested ,
			callbacks.success,
			callbacks.error
		);
	};
	
	/**
	 * requests filesystem
	 * @param  {number} bytes		when called by requestQuota for PERSISTENt storage this is the number of bytes granted
	 * @param  {Object.<string, Function>} callbacks   callback functions (error, and success)
	 */
	requestFileSystem = function(bytes, callbacks){
		console.log('requesting file system');
		console.log('quota for persistent storage granted in MegaBytes: '+bytes/(1024 * 1024));
		if (bytes > 0){
			currentQuota = bytes;
			window.requestFileSystem(
				window.storageInfo.PERSISTENT,
				bytes,
				callbacks.success,
				callbacks.error
			);
		}
		else{

		}
	};

	/**
	 * generic error handler
	 * @param  {Error} e [description]
	 */
	errorHandler = function(e){
		console.error('error occurred: ', e);
	};

	/**
	 * Requests the amount of storage used (asynchronously) and sets variable (EXPERIMENTAL/UNSTABLE API)
	 */
	setCurrentQuotaUsed = function(){
		if (typeof window.storageInfo.queryUsageAndQuota !== 'undefined'){
			window.storageInfo.queryUsageAndQuota(
				window.storageInfo.PERSISTENT,
				function(quotaUsed){
					currentQuotaUsed = quotaUsed;
				},
				errorHandler
			);
		}
		else {
			console.error('browser does not support queryUsageAndQuota');
		}
	};

	/**
	 * Saves a file (asynchronously) in the directory provided upon initialization
	 * @param  {Blob}						file      File object from input field
	 * @param  {Object.<string, Function>}	callbacks callback functions (error, and success)
	 */
	this.saveFile = function(file, callbacks){
		fs.root.getFile(
			dirPrefix + file.name,
			{
				create: true,
				exclusive: false
			},
			function(fileEntry){
				fileEntry.createWriter(function(fileWriter){
					fileWriter.write(file);
					fileWriter.onwriteend = function(e){
						setCurrentQuotaUsed();
						console.log('file stored, with persistent url:'+fileEntry.toURL());
						callbacks.success(fileEntry.toURL());
					};
					fileWriter.onerror = callbacks.error;
				});
			},
			callbacks.error
		);
	};

	/**
	 * Obtains files (asynchronously)
	 * @param {string}	directoryName								directory to look in for files
	 * @param  {Array.<{nodeName: string, fileName: string}>} files array of objects with file properties
	 * @param {Object.<string, Function>} callbacks					callback functions (error, and success)
	 */
	this.retrieveFiles = function(directoryName, files, callbacks){
		var i,
			that = this,
			pathPrefix = (directoryName) ? '/'+directoryName+'/' : dirPrefix,

			callbacksForFileEntry = {
				success: function(fileEntry){
					that.retrieveFile(
						fileEntry,
						{
							success: function(file){
								console.debug('retrieved file! ', file);
								var index;
								//TODO:  THIS IS FLAWED, WILL FAIL WHEN FILENAME OCCURS TWICE
								$.each(files, function(i, item){
									if (item.fileName === file.name){ index = i; }
								});
								console.debug('index:'+index);
								files[index].file = file;
								if (file.name === files[files.length - 1].fileName){
									//TODO: FLAWED. IF LAST FILE FAILS THE SUCCESSHANDLER WILL NEVER EXECUTE
									//I.E. DATA WILL NOT SUBMIT
									console.log('files to return with success handler: ', files);
									callbacks.success(files);
								}
							},
							error: callbacks.error
						}
					);
				},
				error: callbacks.error
			};

		for (i = 0 ; i<files.length ; i++){
			this.retrieveFileEntry(
				pathPrefix+files[i].fileName,
				{
					success: callbacksForFileEntry.success,
					error: callbacksForFileEntry.error
				}
			);
		}
	};

	/**
	 * Obtains a file (asynchronously)
	 * @param  {string} fullPath						full filesystem path to the file
	 * @param  {Object.<string, Function>} callbacks	callback functions (error, and success)
	 */
	this.retrieveFileEntry = function(fullPath, callbacks){
		console.debug('retrieving fileEntry for: '+fullPath);
		fs.root.getFile(
			fullPath,
			{},
			function(fileEntry){
				console.log('fileEntry retrieved: ',fileEntry);
				console.log('persistent URL: ',fileEntry.toURL());
				callbacks.success(fileEntry);
			},
			function(e){
				console.error('file not found', e),
				callbacks.error(e);
			}
		);
	};

	this.retrieveFile = function(fileEntry, callbacks){
		fileEntry.file(
			callbacks.success,
			callbacks.error
		);
	};

	/**
	 * Deletes a file from local storage from the directory set upon initialization
	 * At the moment there is no feedback provided whether this was successful except indirectly by
	 * resetting the storageUsed variable.
	 * @param  {string} fileName file name
	 */
	this.deleteFile = function(fileName){
		//console.log('amount of storage used: '+this.getStorageUsed());
		console.log('deleting file: '+fileName);
		//console.log('amount of storage used: '+this.getStorageUsed());
		fs.root.getFile(
			dirPrefix + fileName,
			{
				create: false
			},
			function(fileEntry){
				fileEntry.remove(function(){
					setCurrentQuotaUsed();
					console.log(fileName+' removed from file system');
				});
			},
			errorHandler
		);
	};

	/**
	 * Creates a directory
	 * @param  {string}						name      name of directory
	 * @param  {Object.<string, Function>}	callbacks callback functions (error, and success)
	 */
	this.createDir = function(name, callbacks){
		fs.root.getDirectory(
			name,
			{
				create: true
			},
			function(dirEntry){
				setCurrentQuotaUsed();
				console.log('Directory: '+name+' created (or found)', dirEntry);
				callbacks.success();
			},
			errorHandler
		);
	};

	/**
	 * Deletes a complete directory with all its contents
	 * @param {string=} name name of directory
	 */
	this.deleteDir = function(name){
		name = name || dirName;
		fs.root.getDirectory(
			name,
			{},
			function(dirEntry){
				dirEntry.removeRecursively(function(){
					setCurrentQuotaUsed();
					console.log('Directory: '+name+ ' deleted');
				},
				errorHandler);
			},
			errorHandler
		);
	};
}
	