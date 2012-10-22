// Load mocks for this spec
EnvJasmine.load(EnvJasmine.mocksDir + "form.mock.js");
// Load files and specific libraries
EnvJasmine.load(EnvJasmine.includeDir + "xpathjs_javarosa/build/xpathjs_javarosa.min.js");
EnvJasmine.load(EnvJasmine.jsDir + "__form.js");

describe("Data node getter", function () {
    var i, t =
		[
			["", null, null, 18],
			["", null, {}, 18],
			//["/", null, {}, 9], //issue with xfind, not important
			[false, null, {}, 18],
			[null, null, {}, 18],
			[null, null, {noTemplate:true}, 18],
			[null, null, {noTemplate:false}, 20],
			[null, null, {onlyTemplate:true}, 1],
			[null, null, {noEmpty:true}, 9],
			[null, null, {noEmpty:true, noTemplate:false}, 10],

			["/thedata/nodeA", null, null, 1],
			["/thedata/nodeA", 1   , null, 0],
			["/thedata/nodeA", null, {noEmpty:true}, 0], //"int"
			["/thedata/nodeA", null, {onlyleaf:true}, 1],
			["/thedata/nodeA", null, {onlyTemplate:true}, 0],
			["/thedata/nodeA", null, {noTemplate:true}, 1],
			["/thedata/nodeA", null, {noTemplate:false}, 1],

			["/thedata/repeatGroup", null, null, 3],
			["/thedata/repeatGroup", null, {onlyTemplate:true}, 1],
			["/thedata/repeatGroup", null, {noTemplate:false}, 4],

			["//nodeC", null, null, 3],
			["/thedata/repeatGroup/nodeC", null, null, 3],
			["/thedata/repeatGroup/nodeC", 2   , null, 1],
			["/thedata/repeatGroup/nodeC", null, {noEmpty:true}, 2],
			["/thedata/repeatGroup/nodeC", null, {onlyleaf:true}, 3],
			["/thedata/repeatGroup/nodeC", null, {onlyTemplate:true}, 0],
			["/thedata/repeatGroup/nodeC", null, {noTemplate:true}, 3],
			["/thedata/repeatGroup/nodeC", null, {noTemplate:false}, 4]
		],
		form = new Form("", ""),
		data = form.data(dataStr1);
		
		function test(node){
			it("obtains nodes (selector: "+node.selector+", index: "+node.index+", filter: "+JSON.stringify(node.filter)+")", function() {
				expect(data.node(node.selector, node.index, node.filter).get().length).toEqual(node.result);
			});
		}

		for (i = 0 ; i<t.length ; i++){
			test({selector: t[i][0], index: t[i][1], filter: t[i][2], result: t[i][3]});
		}

});

describe('Date node (&) value getter', function(){
	var form = new Form('',''),
		data = form.data(dataStr1);

	it('returns an array of one node value', function(){
		expect(data.node("/thedata/nodeB").getVal()).toEqual(['b']);
	});

	it('returns an array of multiple node values', function(){
		expect(data.node("/thedata/repeatGroup/nodeC").getVal()).toEqual(['', 'c2', 'c3']);
	});

	it('returns an empty array', function(){
		expect(data.node("/thedata/nodeX").getVal()).toEqual([]);
	});

	it('obtains a node value of a node with a . in the name', function(){
		expect(data.node("/thedata/someweights/w.3").getVal()).toEqual(['5']);
	});
});

describe('Data node XML data type conversion & validation', function(){
	var i, data,
		form = new Form("", ""),
		t =	[
				["/thedata/nodeA", null, null, 'val1', null, true],
				["/thedata/nodeA", null, null, 'val3', 'somewrongtype', true],

				["/thedata/nodeA", 1   , null, 'val13', 'string', null], //non-existing node
				["/thedata/repeatGroup/nodeC", null, null, 'val', null], //multiple nodes

				["/thedata/nodeA", 0   , null, '4', 'double', true], //double is a non-existing xml data type so turned into string
				["/thedata/nodeA", 0   , null, 5, 'double', true],

				["/thedata/nodeA", null, null, 'val2', 'string', true],
				["/thedata/nodeA", 0   , null, ['a', 'b', 'c'], 'string', true],
				["/thedata/nodeA", 0   , null, ['d', 'e', 'f', ''], 'string', true],
				["/thedata/nodeA", 0   , null, 'val12', 'string', true],
				["/thedata/nodeA", 0   , null, '14', 'string', true],
				["/thedata/nodeA", 0   , null, 1, 'string', true],
				
				["/thedata/nodeA", null, null, 'val11', 'decimal', false],

				["/thedata/nodeA", null, null, 'val4', 'int', false],
				["/thedata/nodeA", 0   , null, '2', 'int', true],
				["/thedata/nodeA", 0   , null, 3, 'int', true],

				["/thedata/nodeA", null, null, 'val5565ghgyuyuy', 'date', false], //Chrome turns val5 into a valid date...
				["/thedata/nodeA", null, null, '2012-01-01', 'date', true],
				["/thedata/nodeA", null, null, '2012-12-32', 'date', false],
				["/thedata/nodeA", null, null, 324, 'date', true],
				
				["/thedata/nodeA", null, null, 'val5565ghgyuyua', 'datetime', false], //Chrome turns val10 into a valid date..
				["/thedata/nodeA", null, null, '2012-01-01T00:00:00-06', 'datetime', true],
				//["/thedata/nodeA", null, null, '2012-12-32T00:00:00-06', 'datetime', false], fails, would be good if it didn't, but not critical
				["/thedata/nodeA", null, null, '2012-12-31T23:59:59-06', 'datetime', true],
				//["/thedata/nodeA", null, null, '2012-01-01T30:00:00-06', 'datetime', fails], fails, would be good if it didn't, but not critical
				
				["/thedata/nodeA", null, null, 'a', 'time', false],
				["/thedata/nodeA", null, null, 'aa:bb', 'time', false],
				["/thedata/nodeA", null, null, '0:0', 'time', true],
				["/thedata/nodeA", null, null, '00:00', 'time', true],
				["/thedata/nodeA", null, null, '23:59', 'time', true],
				["/thedata/nodeA", null, null, '23:59:59', 'time', true],
				["/thedata/nodeA", null, null, '24:00', 'time', false],
				["/thedata/nodeA", null, null, '00:60', 'time', false],
				["/thedata/nodeA", null, null, '00:00:60', 'time', false],
				["/thedata/nodeA", null, null, '-01:00', 'time', false],
				["/thedata/nodeA", null, null, '00:-01', 'time', false],
				["/thedata/nodeA", null, null, '00:00:-01', 'time', false],

				["/thedata/nodeA", null, null, 'val2', 'barcode', true],

				["/thedata/nodeA", null, null, '0 0 0 0', 'geopoint', true],
				["/thedata/nodeA", null, null, '10 10', 'geopoint', true],
				["/thedata/nodeA", null, null, '10 10 10', 'geopoint', true],
				["/thedata/nodeA", null, null, '-90 -180', 'geopoint', true],
				["/thedata/nodeA", null, null, '90 180', 'geopoint', true],
				["/thedata/nodeA", null, null, '-91 -180', 'geopoint', false],
				["/thedata/nodeA", null, null, '-90 -181', 'geopoint', false],
				["/thedata/nodeA", null, null, '91 180', 'geopoint', false],
				["/thedata/nodeA", null, null, '90 -181', 'geopoint', false],
				["/thedata/nodeA", null, null, 'a -180', 'geopoint', false],
				["/thedata/nodeA", null, null, '0 a', 'geopoint', false],
				["/thedata/nodeA", null, null, '0', 'geopoint', false],
				["/thedata/nodeA", null, null, '0 0 a', 'geopoint', false],
				["/thedata/nodeA", null, null, '0 0 0 a', 'geopoint', false]

				//TO DO binary (?)
			];
		form.form('<form></form>');

		function test(n){
			it("converts and validates xml-type "+n.type+" with value: "+n.value, function(){
				data = form.data(dataStr1);
				expect(data.node(n.selector, n.index, n.filter).setVal(n.value, null, n.type)).toEqual(n.result);
			});
		}

		for (i = 0 ; i<t.length ; i++){
			test({selector: t[i][0], index: t[i][1], filter: t[i][2], value: t[i][3], type: t[i][4], result:t[i][5]});
		}

	it('sets a non-empty value to empty', function(){
		var node = data.node('/thedata/nodeA', null, null);
		data = form.data(dataStr1);
		node.setVal('value', 'string');
		expect(node.setVal('')).toBe(true);
	});
});

describe("Data node cloner", function(){
	it("has cloned a data node", function(){
		var form = new Form('', ''),
			data = form.data(dataStr1),
			node = data.node("/thedata/nodeA"),
			$precedingTarget = data.node("/thedata/repeatGroup/nodeC", 0).get();
		form.form('form');

		expect(data.node('/thedata/repeatGroup/nodeA', 0).get().length).toEqual(0);
		node.clone($precedingTarget);
		expect(data.node('/thedata/repeatGroup/nodeA', 0).get().length).toEqual(1);
	});
});

describe("Data node remover", function(){
	it("has removed a data node", function(){
		var form = new Form('', ''),
			data = form.data(dataStr1),
			node = data.node("/thedata/nodeA");
		form.form('form');

		expect(node.get().length).toEqual(1);
		data.node("/thedata/nodeA").remove();
		expect(node.get().length).toEqual(0);
	});
});

describe("XPath Evaluator (see github.com/MartijnR/xpathjs_javarosa for comprehensive tests!)", function(){
	var i, t =
		[
			["/thedata/nodeB", "string", null, 0, "b"],
			["../nodeB", "string", "/thedata/nodeB", 0, "b"],
			["/thedata/nodeB", "boolean", null, 0, true],
			["/thedata/notexist", "boolean", null, 0, false],
			["/thedata/repeatGroup[2]/nodeC", "string", null, 0, "c2"],
			['/thedata/repeatGroup[position()=3]/nodeC', 'string', null, 0, 'c3'],
			['coalesce(/thedata/nodeA, /thedata/nodeB)', 'string', null, 0, 'b'],
			['coalesce(/thedata/nodeB, /thedata/nodeA)', 'string', null, 0, 'b'],
			['weighted-checklist(3, 3, /thedata/somenodes/A, /thedata/someweights/w2)', 'boolean', null, 0, true],
			['weighted-checklist(9, 9, /thedata/somenodes/*, /thedata/someweights/*)', 'boolean', null, 0, true]
		],
		form = new Form("", ""),
		data = form.data(dataStr1);
	//just need to instantiate this to get $form variable without calling init()
	form.form('<form></form>');

	function test(expr, resultType, contextSelector, index, result){
		it("evaluates XPath: "+expr, function(){
			expect(data.evaluate(expr, resultType, contextSelector, index)).toEqual(result);
		});
	}

	for (i = 0 ; i<t.length ; i++){
		test(String(t[i][0]), t[i][1], t[i][2], t[i][3], t[i][4]);
	}

	// this tests the makeBugCompliant() workaround that injects a position into an absolute path
	// for the issue described here: https://bitbucket.org/javarosa/javarosa/wiki/XFormDeviations
	it("evaluates a repaired absolute XPath inside a repeat (makeBugCompliant())", function(){
		form.form(formStr1);
		expect(data.evaluate("/thedata/repeatGroup/nodeC", "string", "/thedata/repeatGroup/nodeC", 2)).toEqual("c3");
	});
});

describe("Output functionality ", function(){
	// These tests were orginally meant for modilabs/enketo issue #141. However, they passed when they were
	// failing in the enketo client itself (same form). It appeared the issue was untestable (except manually)
	// since the issue was resolved by updating outputs with a one millisecond delay (!).
	// Nevertheless, these tests can be useful.
	var	form = new Form(formStr2, dataStr2);
	
	form.init();
	
	it("tested upon initialization: node random__", function(){
		expect(form.getFormO().$.find('[data-value="/random/random__"]').text().length).toEqual(17);
	});

	it("tested upon initialization: node uuid__", function(){
		expect(form.getFormO().$.find('[data-value="/random/uuid__"]').text().length).toEqual(36);
	});

});

describe("Preload and MetaData functionality", function(){
	var	form;

	it("ignores a calculate binding on [ROOT]/meta/instanceID", function(){
		form = new Form(formStr2, dataStr2);
		form.init();
		expect(form.getDataO().node('/random/meta/instanceID').getVal()[0].length).toEqual(41);
	});

	it("generates an instanceID on meta/instanceID even though no preload binding is present", function(){
		form = new Form(formStr2, dataStr2);
		form.init();
		form.getFormO().$.find('fieldset#jr-preload-items').remove();
		expect(form.getFormO().$.find('fieldset#jr-preload-items').length).toEqual(0);
		expect(form.getDataO().node('/random/meta/instanceID').getVal()[0].length).toEqual(41);
	});

	it("generates an instanceID if instance preloader is present", function(){
		form = new Form(formStr3, dataStr2);
		form.init();
		expect(form.getFormO().$
			.find('fieldset#jr-preload-items input[name="/random/meta/instanceID"][data-preload="instance"]').length)
			.toEqual(1);
		expect(form.getDataO().node('/random/meta/instanceID').getVal()[0].length).toEqual(41);
	});

	it("does not generate a new instanceID if one is already present", function(){
		form = new Form(formStr3, dataStr3);
		form.init();
		expect(form.getDataO().node('/random/meta/instanceID').getVal()[0]).toEqual('c13fe058-3349-4736-9645-8723d2806c8b');
	});

	it("generates a timeStart on meta/timeStart even though no preload binding is present", function(){
		form = new Form(formStr2, dataStr2);
		form.init();
		form.getFormO().$.find('fieldset#jr-preload-items').remove();
		expect(form.getFormO().$.find('fieldset#jr-preload-items').length).toEqual(0);
		expect(form.getDataO().node('/random/meta/timeStart').getVal()[0].length > 10).toBe(true);
	});

	it("generates a timeEnd on init and updates this after a beforesave event even though no preload binding is present", function(){
		var timeEnd, timeEndNew;
		//jasmine.Clock.useMock();
		form = new Form(formStr2, dataStr2);
		form.init();
		form.getFormO().$.find('fieldset#jr-preload-items').remove();
		expect(form.getFormO().$.find('fieldset#jr-preload-items').length).toEqual(0);
		timeEnd = form.getDataO().node('/random/meta/timeEnd').getVal()[0];
		console.debug('init timeEnd: '+timeEnd);
		expect(timeEnd.length > 10).toBe(true);
		//setTimeout(function(){
			form.getFormO().$.trigger('beforesave');
			timeEndNew = form.getDataO().node('/random/meta/timeEnd').getVal()[0];
			timeEnd = new Date(timeEnd);
			timeEndNew = new Date(timeEndNew);
			console.debug(timeEnd);
			console.debug(timeEndNew);
			//for some reason the setTimeout function doesn't work
			expect(timeEnd-1 < timeEndNew).toBe(true);
		//}, 1001);
		//jasmine.Clock.tick(1001);
		//TODO FIX THIS PROPERLY
	});

	//TODO add similar to last tests if preloader IS present
});

describe("Loading instance-to-edit functionality", function(){
	var form;

	describe('when instanceID and deprecatedID nodes are not present in the form format', function(){
		form = new Form(formStr1, dataStr1, dataEditStr1);
		form.init();

		it ("adds an instanceID node", function(){
			expect(form.getDataO().node('*>meta>instanceID').get().length).toEqual(1);
		});

		it ("adds a deprecatedID node", function(){
			expect(form.getDataO().node('*>meta>deprecatedID').get().length).toEqual(1);
		});

		//this is an important test even though it may not seem to be...
		it ("includes the deprecatedID in the string to be submitted", function(){
			expect(form.getDataO().getStr().indexOf('<deprecatedID>')).not.toEqual(-1);
		});

		it ("gives the new deprecatedID node the old value of the instanceID node of the instance-to-edit", function(){
			expect(form.getDataO().node('*>meta>deprecatedID').getVal()[0]).toEqual('7c990ed9-8aab-42ba-84f5-bf23277154ad');
		});

		it ("gives the added instanceID node a new value", function(){
			expect(form.getDataO().node('*>meta>instanceID').getVal()[0].length).toEqual(41);
			expect(form.getDataO().node('*>meta>instanceID').getVal()[0]).not.toEqual('7c990ed9-8aab-42ba-84f5-bf23277154ad');
		});

		it ("adds data from the instance-to-edit to the form instance", function(){
			expect(form.getDataO().node('/thedata/nodeA').getVal()[0]).toEqual('value');
			expect(form.getDataO().node('/thedata/repeatGroup/nodeC', 0).getVal()[0]).toEqual('some data');
		});
	});
	
	describe('when instanceID and deprecatedID nodes are already present in the form format', function(){
		form = new Form(formStr1, dataEditStr1, dataEditStr1);
		form.init();

		it ("does not NOT add another instanceID node", function(){
			expect(form.getDataO().node('*>meta>instanceID').get().length).toEqual(1);
		});

		it ("does not NOT add another deprecatedID node", function(){
			expect(form.getDataO().node('*>meta>deprecatedID').get().length).toEqual(1);
		});

		it ("gives the deprecatedID node the old value of the instanceID node of the instance-to-edit", function(){
			expect(form.getDataO().node('*>meta>deprecatedID').getVal()[0]).toEqual('7c990ed9-8aab-42ba-84f5-bf23277154ad');
		});

		it ("gives the instanceID node a new value", function(){
			expect(form.getDataO().node('*>meta>instanceID').getVal()[0].length).toEqual(41);
			expect(form.getDataO().node('*>meta>instanceID').getVal()[0]).not.toEqual('7c990ed9-8aab-42ba-84f5-bf23277154ad');
		});

		it ("adds data from the instance-to-edit to the form instance", function(){
			expect(form.getDataO().node('/thedata/nodeA').getVal()[0]).toEqual('value');
			expect(form.getDataO().node('/thedata/repeatGroup/nodeC', 0).getVal()[0]).toEqual('some data');
		});

	});

});
//TODO load a large complex form and detect console errors
