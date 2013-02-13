describe("LocalStorage support", function () {
	it('exists in this browser', function(){
		expect(new StorageLocal().isSupported()).toEqual(true);
	});
});