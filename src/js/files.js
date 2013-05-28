/**
 * This library copies liberally from http://www.html5rocks.com/en/tutorials/file/filesystem/#toc-filesystemurls
 * by Eric Bidelman. Thanks a lot, Eric!
 *
 * Copyright 2012 Martijn van de Rijdt & Modilabs
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

	var fs, requestQuota, requestFileSystem, errorHandler, setCurrentQuotaUsed, traverseAll, retrieveFile, dirName, dirPrefix,
		currentQuota = null,
		currentQuotaUsed = null,
		DEFAULTBYTESREQUESTED = 100 * 1024 * 1024;

	this.getCurrentQuota = function(){return currentQuota;}; //REMOVE, IS TEMPORARY
	this.getCurrentQuotaUsed = function(){return currentQuotaUsed;};
	this.getFS = function(){return fs;};
	
	/**
	 * Initializes the File Manager
	 * @param  {string}					directory name of directory to store files in
	 * @param  {{success:Function, error:Function}} callbacks callback functions (error, and success)
	 * @return {boolean}					returns true/false if File API is supported by browser
	 */
	this.init = function(directory, callbacks){
		if (this.isSupported() && directory && directory.length > 0){
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
								error: function(e){
									callbacks.error(e);
									errorHandler(e);
								}
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
		return (typeof window.requestFileSystem !== 'undefined' && typeof window.resolveLocalFileSystemURL !== 'undefined' && typeof window.storageInfo !== 'undefined');
	};

	/**
	 * Requests PERSISTENT file storage (may prompt user) asynchronously
	 * @param  {number}						bytesRequested the storage size in bytes that is requested
	 * @param  {Object.<string, Function>}	callbacks      callback functions (error, and success)
	 */
	requestQuota = function(bytesRequested, callbacks){
		console.log('requesting persistent filesystem quota');
		$(document).trigger('quotarequest', bytesRequested); //just to facilitate testing
		window.storageInfo.requestQuota(
			window.storageInfo.PERSISTENT,
			bytesRequested ,
			//successhandler is called immediately if asking for increase in quota
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
			//actually not correct to treat this as an error
			console.error('User did not approve storage of local data using the File API');
			callbacks.error();
		}
	};

	/**
	 * generic error handler
	 * @param  {(Error|FileError|string)=} e [description]
	 */
	errorHandler = function(e){
		var msg = '';

		if (typeof e !== 'undefined'){
			switch (e.code) {
				case window.FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case window.FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case window.FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case window.FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case window.FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = 'Unknown Error';
					break;
			}
		}
		console.log('Error occurred: ' + msg);
		if (typeof console.trace !== 'undefined') console.trace();
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
		var that = this;
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
						//if a file write does not complete because the file is larger than the granted quota
						//the onwriteend event still fires. (This may be a browser bug.)
						//so we're checking if the complete file was saved and if not, do nothing and assume
						//that the onerror event will fire
						if(e.total === e.loaded){
							//console.log('write completed', e);
							setCurrentQuotaUsed();
							console.log('complete file stored, with persistent url:'+fileEntry.toURL());
							callbacks.success(fileEntry.toURL());
						}
					};
					fileWriter.onerror = function(e){
						var newBytesRequest,
							targetError = e.target.error;
						if (targetError instanceof FileError && targetError.code === window.FileError.QUOTA_EXCEEDED_ERR){
							newBytesRequest = ((e.total * 5) < DEFAULTBYTESREQUESTED) ? currentQuota + DEFAULTBYTESREQUESTED : currentQuota + (5 * e.total);
							console.log('Required storage exceeding quota, going to request more, in bytes: '+newBytesRequest);
							requestQuota(
								newBytesRequest,
								{
									success: function(bytes){
										console.log('request for additional quota approved! (quota: '+bytes+' bytes)');
										currentQuota = bytes;
										that.saveFile(file, callbacks);
									},
									error: callbacks.error
								}
							);
						}
						else{
							callbacks.error(e);
						}
					};
				}, callbacks.error);
			},
			callbacks.error
		);
	};

	/**
	 * Obtains specified files from a specified directory (asynchronously)
	 * @param {string}											directoryName	directory to look in for files
	 * @param {Array.<{nodeName: string, fileName: string}>}	files			array of objects with file properties
	 * @param {{success:Function, error:Function}}				callbacks		callback functions (error, and success)
	 */
	this.retrieveFiles = function(directoryName, files, callbacks){
		var i, retrievedFiles = [], failedFiles = [],
			pathPrefix = (directoryName) ? '/'+directoryName+'/' : dirPrefix,
			callbacksForFileEntry = {
				success: function(fileEntry){
					retrieveFile(
						fileEntry,
						{
							success: function(file){
								console.debug('retrieved file! ', file);
								var index;
								//TODO:  THIS WILL FAIL WHEN FILENAME OCCURS TWICE, problem?
								$.each(files, function(j, item){
									if (item.fileName === file.name){ 
										retrievedFiles.push({
											nodeName: files[j].nodeName,
											fileName: files[j].fileName,
											file: file
										});
									}
								});
								console.log('value of requested files index i in successhandler: '+i);
								//if (file.name === files[files.length - 1].fileName){
								if (retrievedFiles.length + failedFiles.length === files.length){
									console.log('files to return with success handler: ', retrievedFiles);
									callbacks.success(retrievedFiles);
								}
							},
							error: function(e, fullPath){
								failedFiles.push[fullPath];
								if (retrievedFiles.length + failedFiles.length === files.length){
									console.log('though error occurred with at least one file, files to return with success handler: ', retrievedFiles);
									callbacks.success(retrievedFiles);
								}
								callbacks.error();
							}
						}
					);
				},
				error: callbacks.error
			};

		if (files.length === 0){
			console.log('files length is 0, calling success handler with empty array');
			callbacks.success([]);
		}

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
	 * Obtains a fileEntry (asynchronously)
	 * @param  {string}								fullPath	full filesystem path to the file
	 * @param {{success:Function, error:Function}}	callbacks	callback functions (error, and success)
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
			function(e, fullPath){
				console.error('file with path: '+fullPath+' not found', e),
				callbacks.error(e);
			}
		);
	};

	/**
	 * Retrieves a file from a fileEntry (asynchronously)
	 * @param  {FileEntry} fileEntry [description]
	 * @param  {{success:function(File), error: ?function(FileError)}} callbacks [description]
	 */
	retrieveFile = function(fileEntry, callbacks){
		fileEntry.file(
			callbacks.success,
			callbacks.error
		);
	};

	/**
	 * Deletes a file from the file system (asynchronously) from the directory set upon initialization
	 * @param {string}								fileName		file name
	 * @param {{success:Function, error:Function}}	callbacks		callback functions (error, and success)
	 */
	this.deleteFile = function(fileName, callbacks){
		//console.log('amount of storage used: '+this.getStorageUsed());
		console.log('deleting file: '+fileName);
		callbacks = callbacks || {success: function(){}, error: function(){}};
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
					callbacks.success();
				});
			},
			function(e){
				errorHandler(e);
				callbacks.error();
			}
		);
	};

	/**
	 * Creates a directory
	 * @param  {string}									name      name of directory
	 * @param  {{success: Function, error: Function}}	callbacks callback functions (error, and success)
	 */
	this.createDir = function(name, callbacks){
		var that = this;

		callbacks = callbacks || {success: function(){}, error: function(){}};
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
			function(e){
				var newBytesRequest,
					targetError = e.target.error;
				//TODO: test this
				if (targetError instanceof FileError && targetError.code === window.FileError.QUOTA_EXCEEDED_ERR){
					console.log('Required storage exceeding quota, going to request more.');
					newBytesRequest = ((e.total * 5) < DEFAULTBYTESREQUESTED) ? currentQuota + DEFAULTBYTESREQUESTED : currentQuota + (5 * e.total);
					requestQuota(
						newBytesRequest,
						{
							success: function(bytes){
								currentQuota = bytes;
								that.createDir(name, callbacks);
							},
							error: callbacks.error
						}
					);
				}
				else{
					callbacks.error(e);
				}
			}
			//TODO: ADD similar request for additional storage if FileError.QUOTA_EXCEEEDED_ERR is thrown as don in saveFile()
		);
	};

	/**
	 * Deletes a complete directory with all its contents
	 * @param {string}									name		name of directory
	 * @param {{success: Function, error: Function}}	callbacks	callback functions (error, and success)
	 */
	this.deleteDir = function(name, callbacks){
		callbacks = callbacks || {success: function(){}, error: function(){}};
		console.log('going to delete directory: '+name);
		fs.root.getDirectory(
			name,
			{},
			function(dirEntry){
				dirEntry.removeRecursively(
					function(){
						setCurrentQuotaUsed();
						callbacks.success();
					},
					function(e){
						errorHandler(e);
						callbacks.error();
					}
				);
			},
			errorHandler
		);
	};

	/**
	 * Deletes all files stored (for a subsubdomain)
	 * @param {Function=} callbackComplete	function to call when complete
	 */
	this.deleteAll = function(callbackComplete){
		callbackComplete = callbackComplete || function(){};
		var process = {
			entryFound : function(entry){
				if (entry.isDirectory){
					entry.removeRecursively(
						function(){
							setCurrentQuotaUsed();
							console.log('Directory: '+entry.name+ ' deleted');
						},
						errorHandler
					);
				}
				else{
					entry.remove(
						function(){
							setCurrentQuotaUsed();
							console.log('File: '+entry.name+ ' deleted');
						},
						errorHandler
					);
				}
			},
			complete : callbackComplete
		};
		traverseAll(process);
	};

	/**
	 * Lists all files/folders in root (function may not be required)
	 * @param {Function=} callbackComplete	function to call when complete
	 */
	this.listAll = function(callbackComplete){
		callbackComplete = callbackComplete || function(){};
		var entries = [],
			process = {
				entryFound : function(entry){
					if (entry.isDirectory){
						entries.push('folder: '+entry.name);
					}
					else{
						entries.push('file: '+entry.name);
					}
				},
				complete : function(){
					console.log('entries: ', entries);
					callbackComplete();
				}
		};
		traverseAll(process);
	};

	/**
	 * traverses all folders and files in root
	 * @param  {{entryFound: Function, complete}} process [description]
	 */
	traverseAll = function(process){
		var entry, type,
			dirReader = fs.root.createReader();
	  
		// Call the reader.readEntries() until no more results are returned.
		var readEntries = function() {
			dirReader.readEntries (function(results) {
				if (!results.length){
					process.complete();
				}
				else {
					for (var i=0 ; i<results.length ; i++){
						entry = results[i];
						process.entryFound(entry);
					}
					readEntries();
				}
			}, errorHandler);
		};
		readEntries();
	};
}
	