describe("The Connection Class ", function () {
	var callbacks, connection;

	//TODO: implement async=true .... query string to run async tests
	//connection.GETSURVEYURL_URL = "http://enketo-dev.formhub.org"+connection.GETSURVEYURL_URL;

	beforeEach(function(){
		connection = new Connection();
		callbacks = {
			success: jasmine.createSpy(),
			error: jasmine.createSpy(),
			complete: jasmine.createSpy()
		};
	});

	it('exists!', function(){
		expect(connection).toEqual(jasmine.any(Connection));
	});

	describe("validates urls", function(){
		var i,t = [
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
			['http://sub.example.org', true],
			['http://23.21.114.69/xlsform/tmp/tmp20lcND/or_other.xml', true]
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

	describe("handles submission reponses", function(){
		var i, errorHeading = 'Failed data submission',
			failCode = [0, 200, 203, 204, 300, 400, 402, 403, 404, 405, 413, 500, 503, 510],
			winCode = [201, 202],
			t = [ //forced //online //alert
					[true,	true,	true],
					[false,	true,	false],
					[true,	false,	false],
					[false,	false,	false],
					[true,	null,	true],
					[false,	null,	false]
			];

		beforeEach(function(){
			connection = new Connection();
			connection.uploadResult = {win:[], fail:[]};
			spyOn(gui, 'alert');
			spyOn(gui, 'feedback');
			spyOn(gui, 'confirmLogin');
		});

		function testFail(statusCode){
			it ('and correctly identifies statusCode '+statusCode+' as a failed submission.', function(){
				connection.processOpenRosaResponse(statusCode, 'aname', true);
				expect(connection.uploadResult.win.length).toBe(0);
				expect(connection.uploadResult.fail.length).toBe(1);
			});
		}

		for (i=0 ; i<failCode.length ; i++){
			testFail(failCode[i]);
		}

		function testWin(statusCode){
			it ('and correctly identifies statusCode '+statusCode+' as a succesful submission.', function(){
				connection.processOpenRosaResponse(statusCode, 'aname', true);
				expect(connection.uploadResult.win.length).toBe(1);
				expect(connection.uploadResult.fail.length).toBe(0);
			});
		}

		for (i=0 ; i<winCode.length ; i++){
			testWin(winCode[i]);
		}

		function testFailAlert(forced, online, alert){
			var anno = (alert) ? 'an' : 'NO';
			it('and shows '+anno+' alert when failed upload was conducted with forced:'+forced+' and online: '+online, function(){
				connection.forced = forced;
				connection.currentOnlineStatus = online;
				connection.processOpenRosaResponse(404, {name:'aname', instanceID: 'MyInstanceID', batches: 1, batchIndex: 0, forced: forced});
				if (alert){
					expect(gui.alert).toHaveBeenCalled();
					expect(gui.alert.mostRecentCall.args[1]).toEqual(errorHeading);
				}
				else{
					expect(gui.alert).not.toHaveBeenCalled();
				}
			});
		}

		for (i = 0 ; i<t.length ; i++){
			testFailAlert(t[i][0], t[i][1], t[i][2]);
		}

		function testWinFeedback(forced, online){
			it('shows a feedback message when succesful upload was conducted with forced:'+forced+' and online: '+online, function(){
				connection.forced = forced;
				connection.currentOnlineStatus = online;
				connection.processOpenRosaResponse(201, 'aname','MyInstanceID', true);
				expect(gui.alert).not.toHaveBeenCalled();
				expect(gui.feedback).toHaveBeenCalled();
			});
		}

		for (i = 0 ; i<t.length ; i++){
			testWinFeedback(t[i][0], t[i][1]);
		}

		it('cancels uploads if an authentication error (401) occurs and shows a login screen', function(){
			connection.processOpenRosaResponse(401, 'aname', 'MyInstanceID', true);
			expect(gui.confirmLogin).toHaveBeenCalled();
			expect(connection.uploadResult.win.length).toBe(0);
			expect(connection.uploadResult.fail.length).toBe(0);
		});

	});
	
});