// Load mocks for this spec
//EnvJasmine.load(EnvJasmine.mocksDir + "storage.mock.js");
// Load files and specific libraries

EnvJasmine.load(EnvJasmine.jsDir + "__connection.js");

describe("Connection....", function () {
	it('We have connection!', function(){
		connection = new Connection();
		expect(true).toEqual(true);
	});
});