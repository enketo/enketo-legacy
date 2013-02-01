function getFakeFile(type, mb){
	var i, fakefile, bytes, content = "";
	mb = mb || 1;
	type = type || "image/png";
	bytes = mb * 1024 * 1024;
	for (i=0; i < bytes/10 ; i++){
		content += "abkdksajbl";
	}
	fakefile = new Blob([content], { type: type });
	fakefile.name = "fakefile";
	return fakefile;
}

describe("File API supported by this browser", function () {
	var fileManager;

	it('is supported', function(){
		fileManager = new FileManager();
		expect(fileManager.isSupported()).toBe(true);
	});
});

describe("FileManager", function(){
	var fileManager, yayHooray, fuff, result, complete,
		folder = 'myfolder';

	beforeEach(function(){
		fileManager = new FileManager();
		yayHooray = function(){result = 'success'; complete = true;};
		fuff = function(){result = 'success'; complete = true;};
	});

	afterEach(function(){
		fileManager.deleteDir(folder);
	});

	it('initializes successfully (if user gives permission to store permanent data in the browser)', function(){
	
		runs(function(){
			fileManager.init(folder, {
				success: yayHooray,
				error: fuff
			});
		});

		waitsFor(function(){
			return complete;
		}, 'the FileManager to initialize', 10000);
		
		runs(function(){
			expect(result).toEqual('success');
		});

	});

	it('starts with a storage used of 0 bytes', function(){

	});

	it('stores a file successfully', function(){

	});

	it('can retrieved a stored file', function(){
		
	});

});


//test that when fileManager.saveFile() fails the instance does not get a value (whether event.stopPropagation works)
//
//test that data-previous-file-name gets added after successful save
//test that data-pervious-file-name gets updated to "" when field is cleared
//test that file is deleted from file system if input is clear or a different file is selected
