// Load mocks for this spec
//EnvJasmine.load(EnvJasmine.mocksDir + "storage.mock.js");
// Load files and specific libraries

EnvJasmine.load(EnvJasmine.jsDir + "__storage.js");

describe("LocalStorage support", function () {
	it('exists in this browser', function(){
		expect(new StorageLocal().isSupported()).toEqual(true);
	});
});