describe("LocalStorage", function () {
	var store;

	beforeEach(function(){
		store = new StorageLocal();
	});

	afterEach(function(){
		localStorage.clear();
	});

	it('is supported in this browser', function(){
		expect(store.isSupported()).toEqual(true);
	});

	describe('attempts to save records', function(){
		var record = {data:'bla'},
			name = 'myname',
			otherName = 'anothername',
			testKeys = function(keys, expectedResp){
				for (var i = 0; i<keys.length ; i++){
					var key = keys[i];
					it('fail if record name: '+key+' is provided and returns "'+expectedResp+'"', function(){
						expect(store.setRecord(key, record)).toEqual(expectedResp);
					});
				}
			},
			emptyKeys = [null, false, true, {}, [], '', undefined],
			forbiddenKeys = ['__settings', 'null','__history', 'Firebug', 'undefined', '__bookmark', '__counter', '__current_server'];

		testKeys(emptyKeys, 'require');
		testKeys(forbiddenKeys, 'forbidden');
		
		it('fail if the there is already a record with that name and overwrite parameter is not true', function(){
			expect(store.setRecord(name, record)).toEqual('success');
			expect(store.setRecord(name, record)).toEqual('existing');
			expect(store.setRecord(name, record, null, null, name)).toEqual('existing');
			expect(store.setRecord(name, record, null, false, name)).toEqual('existing');
			expect(store.setRecord(name, record, null, null, otherName)).toEqual('existing');
			expect(store.setRecord(name, record, null, false, otherName)).toEqual('existing');
		});

		it('succeed if the record name already exists but the overwrite paramater is set to true', function(){
			expect(store.setRecord(name, record)).toEqual('success');
			expect(store.setRecord(name, record, null, true, name)).toEqual('success');
			expect(store.setRecord(name, record, null, true, otherName)).toEqual('success');
		});

		it('remove the old record when a record is saved under a new name and the del parameter is true', function(){
			expect(store.setRecord(name, record)).toEqual('success');
			expect(store.getRecord(name).data).toEqual(record.data);
		});

	});

	describe('storage space', function(){

		it('is at least 5Mb', function(){
			var dataCharsStored = 0,
				record = {data:''},
				str = 'dsbaadbcdd';
			for (var i = 0; i<1000 ; i++){
				record.data += str;
			}
			for (var j=0; j<1000; j++){
				var key = j.toString();
				if (store.setRecord(key, record) === 'success'){
					var storedRecord = store.getRecord(key);
					if (storedRecord){
						dataCharsStored += JSON.stringify(storedRecord).length + key.length;
					}
					else {
						console.error('could not retrieve stored record');
						break;
					}
				}
				else break;
				console.log ('characters stored so far:'+dataCharsStored); // DEBUG
			}
			//1 character in javascript takes up 2 bytes. To cater to storage overhead 1024 is rounded down to 1000
			expect(dataCharsStored).toBeGreaterThan(5 * 1000 * 1000 / 2);
			
			//real tests
			//ok(charsStored>72000, 'passes if more than 80,000 characters can be stored in localStorage');
			//notEqual(charsStored, -1, 'to easily get a value of the amount of characters that can be stored ('+charsStored+')');
			// Firefox on OS X and IE9 on W7 appear to have highest default storage space available
			// Opera appears to have the lowest default storage space available
			// Both Firefox and Opera on OS X ask the user to increase storage space! = VERY GOOD
		});
		
	});




});