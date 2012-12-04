// Load mocks for this spec
//EnvJasmine.load(EnvJasmine.mocksDir + "storage.mock.js");
// Load files and specific libraries

EnvJasmine.load(EnvJasmine.jsDir + "__connection.js");

describe("The Connection Class ...", function () {
	var callbacks,
		connection = new Connection();
	
	//TODO: implement async=true .... query string to run async tests
	//connection.GETSURVEYURL_URL = "http://enketo-dev.formhub.org"+connection.GETSURVEYURL_URL;

	it('exists!', function(){
		expect(connection).toEqual(jasmine.any(Connection));
	});

	beforeEach(function(){
		callbacks = {
			success: jasmine.createSpy(),
			error: jasmine.createSpy(),
			complete: jasmine.createSpy()
		};
	});

	describe("tries to obtains survey URLs", function(){
		it('and calls the success handler if the server returns the url (mocked)', function(){
			spyOn($, "ajax").andCallFake(function(options){
				options.success({url: "http://success.org"}, 'success');
			});

			connection.getSurveyURL('http://formhub.org/formhub_u', 'widgets', callbacks);
			
			expect(callbacks.success).toHaveBeenCalled();
			expect(callbacks.success).toHaveBeenCalledWith({url: "http://success.org"}, 'success');
		});

		it('returns a validation error if the URL is not well-formed', function(){
			
			connection.getSurveyURL('an/invalid/url', 'name', callbacks);
			
			waitsFor(function(){
				return callbacks.error.callCount > 0;
			}, 'ajax request never finished', 1000);

			runs(function(){
				expect(callbacks.error).toHaveBeenCalled();
				//ajax is never sent if validation fails
				expect(callbacks.complete).not.toHaveBeenCalled();
			});
		});
	});
	
});