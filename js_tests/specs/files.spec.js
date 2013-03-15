function getFakeFile(name, type, mb){
	var i, fakefile, bytes, content = "";
	name = name || 'fakefile';
	mb = mb || 1;
	type = type || "image/png";
	bytes = mb * 1024 * 1024;
	for (i=0; i < bytes/10 ; i++){
		content += "abkdksajbl";
	}
	fakefile = new Blob([content], { type: type });
	fakefile.name = name;
	return fakefile;
}

describe("File API", function () {
	var fileManager;

	it('is supported by this browser', function(){
		fileManager = new FileManager();
		expect(fileManager.isSupported()).toBe(true);
	});
});

describe("FileManager", function(){
	var fileManager,
		quotaRequestSpy,
		yayHooray = function(){result = 'success'; complete = true;},
		fuff = function(){result = 'error'; complete = true;},
		result = null,
		complete = null,
		folder = 'myfolder';

	beforeEach(function(){
		quotaRequestSpy = jasmine.createSpy('quotaRequestSpy');

		$(document).on('quotarequest', function(event, bytes){
			//console.log('quotarequest detected for '+ bytes+' bytes');
			quotaRequestSpy(bytes);
		});

		fileManager = new FileManager();
	
		runs(function(){
			fileManager.init(folder, {
				success: yayHooray,
				error: fuff
			});
		});

		waitsFor(function(){
			return complete;
		}, 'the FileManager to initialize', 1000);
	});

	afterEach(function(){
		var deleteResult = null,
			deleteComplete = null;

		$(document).off('quotarequest');

		runs(function(){
			fileManager.deleteDir(folder,
				{success: function(){deleteResult = 'success'; deleteComplete = true;}
			});
			complete = null;
			result = null;
		});

		waitsFor(function(){
			return deleteComplete;
		}, 'the directory to be deleted', 1000);
	});

	it('initializes successfully (if the user gives permission to store permanent data in the browser)', function(){
		runs(function(){
			expect(result).toEqual('success');
		});
	});

	it('receives the quota it asked for (100Mb) during initialization', function(){
		runs(function(){
			expect(fileManager.getCurrentQuota()).toEqual(100*1024*1024);
		});
	});

	it('starts with a storage quota used of just 162 bytes required to store a directory', function(){
		runs(function(){
			var storageUsed = fileManager.getCurrentQuotaUsed();
			//expect(storageUsed >= 0  && storageUsed <200).toBe(true);
			expect(storageUsed).toEqual(162);
		});
	});

	/**
		Some info on this important-but-difficult-to-run test.
	
		1. Best to clear all previous permissions for File Storage first.
		2. Run tests. Approve first permission.
		3. Run tests again.
		4. Don't approve second permission request. This should make all tests pass.

		If the quota requested and granted at some time in the past
		was greater than the quota requested currently for this subdomain, the user will not be prompted to
		increase storage if the required storage is larger than the available quota but less than that previously
		granted quota!

		chrome://settings/cookies is your friend to clear all permissions for a subdomain
	**/
	it('detects when the approved storage quota is no longer sufficient and asks user for permission to use more', function(){
		var quotaAvailable = fileManager.getCurrentQuota();
			fileSize = quotaAvailable + 1024,
			file = getFakeFile('toolargefakefile', 'image/png', fileSize / (1024*1024) ),
			saveResult = null,
			saveComplete = null,
			fsURL = null,
			quotaUsedStart = fileManager.getCurrentQuotaUsed();

		runs(function(){
			fileManager.saveFile(file, {
				success: function(url){saveComplete = true; saveResult = 'success'; fsURL = url;},
				error: function(){saveComplete = true; saveResult = 'error';}
			});
		});

		waitsFor(function(){
			return quotaRequestSpy.calls.length === 2;
			//user must not approve request (2nd request)
		}, 'the file save operation to complete', 1500);

		runs(function(){
			expect(saveResult).toEqual(null);
			expect(quotaRequestSpy.calls[1].args[0]).toBeGreaterThan(fileSize);
		});
	});

	describe('A directory', function(){
		var quotaUsedStart,
			createResult = null,
			createComplete = null,
			dirName = "adirectory";

		beforeEach(function(){
			quotaUsedStart = fileManager.getCurrentQuotaUsed();
			runs(function(){
				fileManager.createDir( dirName,{
					success: function(){createResult = 'success'; createComplete = true;},
					error: function(){createResult = 'error'; createComplete = true;}
				});
			});

			waitsFor(function(){
				return createComplete;
			}, 'directory creation is complete', 1000);
		});

		afterEach(function(){
			createResult = null;
			createComplete = null;
		});

		it('is created successfully', function(){
			expect(createResult).toEqual('success');
			expect(fileManager.getCurrentQuotaUsed()).toBeGreaterThan(quotaUsedStart);
		});

		it('is removed successfully when empty', function(){
			var delResult = null,
				delComplete = null;
			
			runs(function(){
				fileManager.deleteDir(dirName,{
					success: function(){delResult = 'success'; delComplete = true;},
					error: function(){delResult = 'error'; delComplete = true;}
				});
			});

			waitsFor(function(){
				return delComplete;
			}, 'directory deletion to complete', 1000);

			runs(function(){
				expect(delResult).toEqual('success');
				expect(fileManager.getCurrentQuotaUsed()).toBeLessThan(quotaUsedStart);
			});
		});
	});

	describe('A file', function(){
		var quotaUsedStart,
			fileSizeMB = 1.5,
			file = getFakeFile('fakefile', 'image/png', fileSizeMB),
			saveResult = null,
			saveComplete = null,
			fsURL = null;

		beforeEach(function(){
			quotaUsedStart = fileManager.getCurrentQuotaUsed();

			runs(function(){
				fileManager.saveFile(file, {
					success: function(url){saveComplete = true; saveResult = 'success'; fsURL = url;},
					error: function(){saveComplete = true; saveResult = 'error';}
				});
			});

			waitsFor(function(){
				return saveComplete;
			}, 'the file save operation to complete', 1000);
		});

		afterEach(function(){
			saveResult = null;
			fsURL = null;
			saveComplete = null;
		});

		it ('is stored successfully', function(){
			runs(function(){
				expect(saveResult).toEqual('success');
				expect(fsURL.indexOf('filesystem:http://')).toEqual(0);
				expect(fsURL.length).toBeGreaterThan(18);
				//expect(fileManager.getCurrentQuotaUsed()).toEqual(quotaUsedStart + (fileSizeMB * 1024 * 1024));
				expect(fileManager.getCurrentQuotaUsed()).toBeGreaterThan(quotaUsedStart);
			});
		});

		it('is retrieved successfully', function(){
			var retrieveResult = null,
				retrieveLength = null,
				retrieveComplete = null;
			
			runs(function(){
				fileManager.retrieveFiles(
					'myfolder',
					[{nodeName:'whatever', fileName: 'fakefile'}],
					{
						success: function(files){retrieveResult = 'success'; retrieveComplete = true; retrieveLength = files.length;},
						error: function(){retrieveResult = 'error'; retrieveComplete = true;}
					}
				);
			});

			waitsFor(function(){
				return retrieveResult;
			}, 'file retrieve attempt to complete', 1000);

			runs(function(){
				expect(retrieveResult).toEqual('success');
				expect(retrieveLength).toEqual(1);
			});
		});

		it('is deleted successfully', function(){
			var deleteResult = null,
				deleteComplete = null;

			runs(function(){
				fileManager.deleteFile(
					'fakefile',
					{
						success: function(){deleteResult = 'success'; deleteComplete = true;},
						error: function(){deleteResult = 'error'; deleteComplete = true;}
					}
				);
			});

			waitsFor(function(){
				return deleteResult;
			}, 'file delete attempt to complete', 1000);

			runs(function(){
				expect(deleteResult).toEqual('success');
				expect(fileManager.getCurrentQuotaUsed()).toEqual(quotaUsedStart);
			});
		});
	});
});

//test that when fileManager.saveFile() fails the instance does not get a value (whether event.stopPropagation works)
//test that data-previous-file-name gets added after successful save
//test that data-pervious-file-name gets updated to "" when field is cleared
//test that file is deleted from file system if input is clear or a different file is selected
