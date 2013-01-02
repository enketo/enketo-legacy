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

	describe("validates urls", function(){
		var t = [
			['htt://example.org', false],
			[' http://example.org', false],
			['example.org', false],
			['www.example.org', false],
			['http://example.o', false],
			['http://example.o/ d', false],
			['http://example.org', true],
			['https://example.org', true],
			['http://example.org/_-?', true],
			['http://www.example.org', true],
			['http://sub.example.org', true]
		];

		function test(url, result){
			it("evaluates url: "+url+" to "+result, function() {
				expect(connection.isValidURL(url)).toBe(result);
			});
		}

		for (i = 0 ; i<t.length ; i++){
			test(t[i][0], t[i][1]);
		}

	});
	
});