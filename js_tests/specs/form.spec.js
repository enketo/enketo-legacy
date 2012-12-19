// Load mocks for this spec
EnvJasmine.load(EnvJasmine.mocksDir + "form.mock.js");
// Load files and specific libraries
EnvJasmine.load(EnvJasmine.includeDir + "xpathjs_javarosa/build/xpathjs_javarosa.min.js");
EnvJasmine.load(EnvJasmine.jsDir + "__form.js");

loadForm = function(filename, editStr){
	var strings = generated_forms[filename];
	return new Form(strings.html_form, strings.xml_model, editStr);
};

describe("Data node getter", function () {
    var i, t =
		[
			["", null, null, 20],
			["", null, {}, 20],
			//["/", null, {}, 9], //issue with xfind, not important
			[false, null, {}, 20],
			[null, null, {}, 20],
			[null, null, {noTemplate:true}, 20],
			[null, null, {noTemplate:false}, 22],
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
				["/thedata/nodeA", null, null, '2012-12-32T00:00:00-06', 'datetime', false],
				["/thedata/nodeA", null, null, '2012-12-31T23:59:59-06', 'datetime', true],
				["/thedata/nodeA", null, null, '2012-12-31T23:59:59-06:30', 'datetime', true],
				["/thedata/nodeA", null, null, '2012-12-31T23:59:59Z', 'datetime', true],
				["/thedata/nodeA", null, null, '2012-01-01T30:00:00-06', 'datetime', false],
				
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
				["/thedata/nodeA", null, null, '13:17:00.000-07', 'time', true],

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

				//				//TO DO binary (?)
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
		node.setVal('value', null, 'string');
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
			["../nodeB", "string", "/thedata/nodeA", 0, "b"],
			["/thedata/nodeB", "boolean", null, 0, true],
			["/thedata/notexist", "boolean", null, 0, false],
			["/thedata/repeatGroup[2]/nodeC", "string", null, 0, "c2"],
			['/thedata/repeatGroup[position()=3]/nodeC', 'string', null, 0, 'c3'],
			['coalesce(/thedata/nodeA, /thedata/nodeB)', 'string', null, 0, 'b'],
			['coalesce(/thedata/nodeB, /thedata/nodeA)', 'string', null, 0, 'b'],
			['weighted-checklist(3, 3, /thedata/somenodes/A, /thedata/someweights/w2)', 'boolean', null, 0, true],
			['weighted-checklist(9, 9, /thedata/somenodes/*, /thedata/someweights/*)', 'boolean', null, 0, true]
		],
		form = new Form(formStr1, dataStr1),
		data;
	form.init();
	data = form.getDataO();

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
		form = new Form(formStr1, dataStr1);
		form.init();
		expect(form.getDataO().evaluate("/thedata/repeatGroup/nodeC", "string", "/thedata/repeatGroup/nodeC", 2)).toEqual("c3");
	});
});


describe('functionality to obtain string of the XML instance (DataXML.getStr() for storage or uploads)', function(){
	var str1, str2, str3, str4, str5, str6, str7, str8, str9, str10, str11, str12,
		formA = loadForm('new_cascading_selections.xml'),
		formB = new Form(formStr1, dataStr1);
	formA.init();
	formB.init();
	str1 = formA.getDataO().getStr();
	str2 = formA.getDataO().getStr(null, null);
	str3 = formA.getDataO().getStr(false, false);
	str4 = formA.getDataO().getStr(true, false);
	str5 = formA.getDataO().getStr(false, true);
	str6 = formA.getDataO().getStr(true, true);
	str7 = formA.getDataO().getStr(true, true, false);
	str8 = formA.getDataO().getStr(null, null, true);
	str9 = formA.getDataO().getStr(true, true, true);

	str10 = formB.getDataO().getStr();
	str11 = formB.getDataO().getStr(true);
	str12 = formB.getDataO().getStr(false, false, true);

	testModelPresent = function(str){return isValidXML(str) && new RegExp(/^<model/g).test(str);};
	testInstancePresent = function(str){return isValidXML(str) && new RegExp(/<instance[\s|>]/g).test(str);};
	testInstanceNumber = function(str){return str.match(/<instance[\s|>]/g).length;};
	//testNamespacePresent = function(str){return isValidXML(str) && new RegExp(/xmlns=/).test(str);};
	testTemplatePresent = function(str){return isValidXML(str) && new RegExp(/template=/).test(str);};
	isValidXML = function(str){
		var $xml;
		try{ $xml = $.parseXML(str);}
		catch(e){}
		return typeof $xml === 'object';
	};

	it('returns a string of the primary instance only when called without 3rd parameter: true', function(){
		expect(testModelPresent(str1)).toBe(false);
		expect(testInstancePresent(str1)).toBe(false);
		expect(testModelPresent(str2)).toBe(false);
		expect(testInstancePresent(str2)).toBe(false);
		expect(testModelPresent(str3)).toBe(false);
		expect(testInstancePresent(str3)).toBe(false);
		expect(testModelPresent(str4)).toBe(false);
		expect(testInstancePresent(str4)).toBe(false);
		expect(testModelPresent(str5)).toBe(false);
		expect(testInstancePresent(str5)).toBe(false);
		expect(testModelPresent(str6)).toBe(false);
		expect(testInstancePresent(str6)).toBe(false);
		expect(testModelPresent(str7)).toBe(false);
		expect(testInstancePresent(str7)).toBe(false);
	});

	it('returns a string of the model and all instances when called with 3rd parameter: true', function(){
		expect(testModelPresent(str8)).toBe(true);
		expect(testInstancePresent(str8)).toBe(true);
		expect(testInstanceNumber(str8)).toBe(4);
		expect(testModelPresent(str9)).toBe(true);
		expect(testInstancePresent(str9)).toBe(true);
		expect(testInstanceNumber(str9)).toBe(4);
		expect(testInstancePresent(str12)).toBe(true);
		expect(testInstanceNumber(str12)).toBe(1);
	});

	it('returns a string with repeat templates included when called with 1st parameter: true', function(){
		expect(testTemplatePresent(str10)).toBe(false);
		expect(testTemplatePresent(str11)).toBe(true);
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
	var	form, t;

	it("ignores a calculate binding on [ROOT]/meta/instanceID", function(){
		form = new Form(formStr2, dataStr2);
		form.init();
		expect(form.getDataO().node('/random/meta/instanceID').getVal()[0].length).toEqual(41);
	});

	it("generates an instanceID on meta/instanceID WITHOUT preload binding", function(){
		form = new Form(formStr2, dataStr2);
		form.init();
		form.getFormO().$.find('fieldset#jr-preload-items').remove();
		expect(form.getFormO().$.find('fieldset#jr-preload-items').length).toEqual(0);
		expect(form.getDataO().node('/random/meta/instanceID').getVal()[0].length).toEqual(41);
	});

	it("generates an instanceID WITH preload binding", function(){
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

	it("generates a timeStart on meta/timeStart WITHOUT preload binding", function(){
		form = new Form(formStr2, dataStr2);
		form.init();
		form.getFormO().$.find('fieldset#jr-preload-items').remove();
		expect(form.getFormO().$.find('fieldset#jr-preload-items').length).toEqual(0);
		expect(form.getDataO().node('/random/meta/timeStart').getVal()[0].length > 10).toBe(true);
	});

	it("generates a timeEnd on init and updates this after a beforesave event WITHOUT preload binding", function(){
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

	function testPreloadExistingValue(node){
		it("obtains unchanged preload value of item (WITH preload binding): "+node.selector+"", function() {
			form = new Form(formStr5, dataStr5a);
			form.init();
			expect(form.getDataO().node(node.selector).getVal()[0]).toEqual(node.result);
		});
	}

	function testPreloadNonExistingValue(node){
		it("has populated previously empty preload item (WITH preload binding): "+node.selector+"", function() {
			form = new Form(formStr5, dataStr5b);
			form.init();
			expect(form.getDataO().node(node.selector).getVal()[0].length > 0).toBe(true);
		});
	}

	t=[
		['/widgets/start_time', '2012-10-30T08:44:57.000-06:00'],
		['/widgets/date_today', '2012-10-30'],
		['/widgets/deviceid', 'some value'],
		['/widgets/subscriberid', 'some value'],
		['/widgets/my_simid', '2332'],
		['/widgets/my_phonenumber', '234234324'],
		['/widgets/application', 'some context'],
		['/widgets/patient', 'this one'],
		['/widgets/user', 'John Doe'],
		['/widgets/uid', 'John Doe'],
		['/widgets/browser_name', 'fake'],
		['/widgets/browser_version', 'xx'],
		['/widgets/os_name', 'fake'],
		['/widgets/os_version', 'xx'],
		['/widgets/meta/instanceID', 'uuid:56c19c6c-08e6-490f-a783-e7f3db788ba8']
	];
	
	for (i = 0 ; i<t.length ; i++){
		testPreloadExistingValue({selector: t[i][0], result:t[i][1]});
		testPreloadNonExistingValue({selector: t[i][0]});
	}
	testPreloadExistingValue({selector:'/widgets/unknown', result:'some value'});
	testPreloadNonExistingValue({selector: '/widgets/end_time'});
});

describe("Loading instance values into html input fields functionality", function(){
	var form;

	it('correctly populates input fields of non-repeat node names in the instance', function(){
		form = new Form(formStr1, dataStr1);
		form.init();
		expect(form.getFormO().$.find('[name="/thedata/nodeB"]').val()).toEqual('b');
		expect(form.getFormO().$.find('[name="/thedata/repeatGroup/nodeC"]').eq(2).val()).toEqual('c3');
		expect(form.getFormO().$.find('[name="/thedata/nodeX"]').val()).toEqual(undefined);
	});

	it('correctly populates input field even if the instance node name is not unique and occurs at multiple levels', function(){
		form = new Form(formStr4, dataStr4);
		form.init();
		expect(form.getFormO().$.find('[name="/nodename_bug/hh/hh"]').val()).toEqual('hi');
	});

});

describe("Loading instance-to-edit functionality", function(){
	var form;
	
	describe('when a deprecatedID node is not present in the form format', function(){
		form = new Form(formStr1, dataStr1, dataEditStr1);
		form.init();

		it ("adds a deprecatedID node", function(){
			expect(form.getDataO().node('* > meta > deprecatedID').get().length).toEqual(1);
		});

		//this is an important test even though it may not seem to be...
		it ("includes the deprecatedID in the string to be submitted", function(){
			expect(form.getDataO().getStr().indexOf('<deprecatedID>')).not.toEqual(-1);
		});

		it ("gives the new deprecatedID node the old value of the instanceID node of the instance-to-edit", function(){
			expect(form.getDataO().node('*>meta>deprecatedID').getVal()[0]).toEqual('7c990ed9-8aab-42ba-84f5-bf23277154ad');
		});

		it ("gives the instanceID node a new value", function(){
			expect(form.getDataO().node('*>meta>instanceID').getVal()[0].length).toEqual(41);
			expect(form.getDataO().node('*>meta>instanceID').getVal()[0]).not.toEqual('7c990ed9-8aab-42ba-84f5-bf23277154ad');
		});

		it ("adds data from the instance-to-edit to the form instance", function(){
			expect(form.getDataO().node('/thedata/nodeA').getVal()[0]).toEqual('2012-02-05T15:34:00.000-04:00');
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
			expect(form.getDataO().node('/thedata/nodeA').getVal()[0]).toEqual('2012-02-05T15:34:00.000-04:00');
			expect(form.getDataO().node('/thedata/repeatGroup/nodeC', 0).getVal()[0]).toEqual('some data');
		});
	});

	describe('repeat functionality', function(){
		var form, timerCallback;

		beforeEach(function() {
			//turn jQuery animations off
			jQuery.fx.off = true;
		});

		it ("removes the correct instance and HTML node when the '-' button is clicked (issue 170)", function(){
			var rep,
				repeatPath = "/thedata/repeatGroup",
				nodePath = "/thedata/repeatGroup/nodeC",
				index = 2;
			form = new Form(formStr1, dataStr1);
			form.init();
			
			expect(form.getFormO().$.find('[name="'+repeatPath+'"]').eq(index).length).toEqual(1);
			expect(form.getFormO().$.find('[name="'+repeatPath+'"]:eq('+index+') button.remove').length).toEqual(1);
			expect(form.getFormO().$.find('[name="'+nodePath+'"]').eq(index).val()).toEqual('c3');
			expect(form.getDataO().node(nodePath, index).getVal()[0]).toEqual('c3');
			
			form.getFormO().$.find('fieldset.jr-repeat[name="'+repeatPath+'"]:eq('+index+') button.remove').click();
			expect(form.getDataO().node(nodePath, index).getVal()[0]).toEqual(undefined);
			//check if it removed the correct data node
			expect(form.getDataO().node(nodePath, index-1).getVal()[0]).toEqual('c2');
			//check if it removed the correct html node
			expect(form.getFormO().$.find('fieldset.jr-repeat[name="'+repeatPath+'"]').eq(index).length).toEqual(0);
			expect(form.getFormO().$.find('[name="'+nodePath+'"]').eq(index-1).val()).toEqual('c2');
		});
	});
});

describe('branching functionality', function(){
	var form;

	beforeEach(function() {
		//turn jQuery animations off
		jQuery.fx.off = true;
	});

	it ("hides irrelevant branches upon initialization", function(){
		form = new Form(formStr6, dataStr6);
		form.init();
		expect(form.getFormO().$.find('[name="/data/group"]').hasClass('disabled')).toBe(true);
		expect(form.getFormO().$.find('[name="/data/nodeC"]').parents('.disabled').length).toEqual(1);
	});

	it ("reveals a group branch when the relevant condition is met", function(){
		form = new Form(formStr6, dataStr6);
		form.init();
		//first check incorrect value that does not meet relevant condition
		form.getFormO().$.find('[name="/data/nodeA"]').val('no').trigger('change');
		expect(form.getFormO().$.find('[name="/data/group"]').hasClass('disabled')).toBe(true);
		//then check value that does meet relevant condition
		form.getFormO().$.find('[name="/data/nodeA"]').val('yes').trigger('change');
		expect(form.getFormO().$.find('[name="/data/group"]').hasClass('disabled')).toBe(false);
	});

	it ("reveals a question when the relevant condition is met", function(){
		form = new Form(formStr6, dataStr6);
		form.init();
		//first check incorrect value that does not meet relevant condition
		form.getFormO().$.find('[name="/data/group/nodeB"]').val(3).trigger('change');
		expect(form.getFormO().$.find('[name="/data/nodeC"]').parents('.disabled').length).toEqual(1);
		//then check value that does meet relevant condition
		form.getFormO().$.find('[name="/data/group/nodeB"]').val(2).trigger('change');
		expect(form.getFormO().$.find('[name="/data/nodeC"]').parents('.disabled').length).toEqual(0);
	});

	/*
	Issue 208 was a combination of two issues:
		1. branch logic wasn't evaluated on repeated radiobuttons (only on the original) in branch.update()
		2. position[i] wasn't properly injected in makeBugCompiant() if the context node was a radio button or checkbox
	 */
	it ('a) evaluates relevant logic on a repeated radio-button-question and b) injects the position correctly (issue 208)', function(){
		var repeatSelector = 'fieldset.jr-repeat[name="/issue208/rep"]';
		//form = new Form(formStr7, dataStr7);
		form = loadForm('issue208.xml');
		form.init();
		form.getFormO().$.find(repeatSelector).eq(0).find('button.repeat').click();
		expect(form.getFormO().$.find(repeatSelector).length).toEqual(2);
		//check if initial state of 2nd question in 2nd repeat is disabled.
		expect(form.getFormO().$.find(repeatSelector).eq(1)
			.find('[data-name="/issue208/rep/nodeB"]').parent().parent().attr('disabled')).toEqual('disabled');
		//select 'yes' in first question of 2nd repeat
		form.getDataO().node('/issue208/rep/nodeA', 1).setVal('yes', null, 'string');
		//doublecheck if new value was set
		expect(form.getDataO().node('/issue208/rep/nodeA', 1).getVal()[0]).toEqual('yes');
		//check if 2nd question in 2nd repeat is now enabled
		expect(form.getFormO().$.find(repeatSelector).eq(1)
			.find('[data-name="/issue208/rep/nodeB"]').parent().parent().attr('disabled')).toEqual(undefined);
	});
});

describe('Required field validation', function(){
	var form, $numberInput, $branch;

	beforeEach(function() {
		jQuery.fx.off = true;//turn jQuery animations off
		form = new Form(formStr6, dataStr6);
		form.init();
		$numberInput = form.getFormO().$.find('[name="/data/group/nodeB"]');
		$numberLabel = form.getFormO().input.getWrapNodes($numberInput);
	});

	//this fails in phantomJS...
	xit ("validates a DISABLED and required number field without a value", function(){
		$numberInput.val('').trigger('change');
		expect($numberLabel.length).toEqual(1);
		expect($numberInput.val().length).toEqual(0);
		expect($numberLabel.parents('.jr-group').attr('disabled')).toEqual('disabled');
		expect($numberLabel.hasClass('invalid')).toBe(false);
	});

	//see issue #144
	it ("validates an enabled and required number field with value 0 and 1", function(){
		form.getFormO().$.find('[name="/data/nodeA"]').val('yes').trigger('change');
		expect($numberLabel.length).toEqual(1);
		$numberInput.val(0).trigger('change');
		expect($numberLabel.hasClass('invalid')).toBe(false);
		$numberInput.val(1).trigger('change');
		expect($numberLabel.hasClass('invalid')).toBe(false);
	});

	it ("invalidates an enabled and required number field without a value", function(){
		form.getFormO().$.find('[name="/data/nodeA"]').val('yes').trigger('change');
		$numberInput.val('').trigger('change');
		expect($numberLabel.hasClass('invalid')).toBe(true);
	});

	it ("invalidates an enabled and required textarea that contains only a newline character or other whitespace characters", function(){
		form = new Form(formStr1, dataStr1);
		form.init();
		var $textarea = form.getFormO().$.find('[name="/thedata/nodeF"]');
		$textarea.val('\n').trigger('change');
		expect($textarea.length).toEqual(1);
		expect($textarea.parent('label').hasClass('invalid')).toBe(true);
		$textarea.val('  \n  \n\r \t ').trigger('change');
		expect($textarea.parent('label').hasClass('invalid')).toBe(true);
	});
});

describe('Itemset functionality', function(){
	var form;

	it('is able to address an instance by id with the instance(id)/path/to/node syntax', function(){
		form = new Form('', dataStr8);
		form.init();
		console.debug('data:', form.getDataO().$);
		expect(form.getDataO().evaluate("instance('cities')/root/item/name", "string")).toEqual('denver');
		expect(form.getDataO().evaluate("instance('cities')/root/item[state=/new_cascading_select/state]/name", "string")).toEqual('denver');
		expect(form.getDataO().evaluate("instance('cities')/root/item[state=/new_cascading_select/state and 1<2]", "nodes").length).toEqual(2);
		expect(form.getDataO().evaluate("instance('cities')/root/item[state=/new_cascading_select/state and name=/new_cascading_select/city]", "nodes").length).toEqual(1);
	});

	describe('in a cascading select using itext for all labels', function(){
		var $items1Radio, $items2Radio, $items3Radio, $items1Select, $items2Select, $items3Select, formHTMLO,
			sel1Radio = ':not(.itemset-template) > input:radio[data-name="/new_cascading_selections/group1/country"]',
			sel2Radio = ':not(.itemset-template) > input:radio[data-name="/new_cascading_selections/group1/city"]',
			sel3Radio = ':not(.itemset-template) > input:radio[data-name="/new_cascading_selections/group1/neighborhood"]',
			sel1Select = 'select[name="/new_cascading_selections/group2/country2"]',
			sel2Select = 'select[name="/new_cascading_selections/group2/city2"]',
			sel3Select = 'select[name="/new_cascading_selections/group2/neighborhood2"]';
		
		beforeEach(function() {
			jQuery.fx.off = true;//turn jQuery animations off
			form = loadForm('new_cascading_selections.xml');
			form.init();

			formHTMLO = form.getFormO();
			spyOn(formHTMLO, 'itemsetUpdate').andCallThrough();
			
			$items1Radio = function(){return form.getFormO().$.find(sel1Radio);};
			$items2Radio = function(){return form.getFormO().$.find(sel2Radio);};
			$items3Radio = function(){return form.getFormO().$.find(sel3Radio);};
			$items1Select = function(){return form.getFormO().$.find(sel1Select+' > option:not(.itemset-template)');};
			$items2Select = function(){return form.getFormO().$.find(sel2Select+' > option:not(.itemset-template)');};
			$items3Select = function(){return form.getFormO().$.find(sel3Select+' > option:not(.itemset-template)');};
		});

		it('level 1: with <input type="radio"> elements has the expected amount of options', function(){
			expect($items1Radio().length).toEqual(2);
			expect($items1Radio().siblings().text()).toEqual('NederlandThe NetherlandsVerenigde StatenUnited States');
			expect($items2Radio().length).toEqual(0);
			expect($items3Radio().length).toEqual(0);
		});
		
		it('level 2: with <input type="radio"> elements has the expected amount of options', function(){
			//select first option in cascade
			runs(function(){
				form.getFormO().$.find(sel1Radio+'[value="nl"]').attr('checked', true).trigger('change');
			});
			
			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'country';}, 'itemsetUpdate not called!', 1000);
			
			runs(function(){
				expect($items1Radio().length).toEqual(2);
				expect($items2Radio().length).toEqual(3);
				expect($items2Radio().siblings().text()).toEqual('AmsterdamAmsterdamRotterdamRotterdamDrontenDronten');
				expect($items3Radio().length).toEqual(0);
			});
		});

		it('level 3: with <input type="radio"> elements has the expected amount of options', function(){
			//select first option
			runs(function(){
				form.getFormO().$.find(sel1Radio+'[value="nl"]').attr('checked', true).trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'country';}, 'itemsetUpdate not called!', 1000);
			
			//select second option
			runs(function(){
				form.getFormO().$.find(sel2Radio+'[value="ams"]').attr('checked', true).trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'city';}, 'itemsetUpdate not called!', 1000);

			runs(function(){
				expect($items1Radio().length).toEqual(2);
				expect($items2Radio().length).toEqual(3);
				expect($items3Radio().length).toEqual(2);
				expect($items3Radio().siblings().text()).toEqual('WesterparkWesterparkDe DamDam');
			});

			//select other first option to change itemset
			runs(function(){
				form.getFormO().$.find(sel1Radio+'[value="nl"]').attr('checked', false);
				form.getFormO().$.find(sel1Radio+'[value="usa"]').attr('checked', true).trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'city';}, 'itemsetUpdate not called!', 1000);

			runs(function(){
				expect($items1Radio().length).toEqual(2);
				expect($items2Radio().length).toEqual(3);
				expect($items2Radio().siblings().text()).toEqual('DenverDenverNieuw AmsterdamNew York CityDe EngelenLos Angeles');
				expect($items3Radio().length).toEqual(0);
			});
		});

		it('level 1: with <select> <option> elements has the expected amount of options', function(){
			expect($items1Select().length).toEqual(2);
			expect($items1Select().eq(0).attr('value')).toEqual('nl');
			expect($items1Select().eq(1).attr('value')).toEqual('usa');
			expect($items2Select().length).toEqual(0);
		});

		it('level 2: with <select> <option> elements has the expected amount of options', function(){
			//select first option in cascade
			runs(function(){
				form.getFormO().$.find(sel1Select).val("nl").trigger('change');
			});
			
			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'country2';}, 'itemsetUpdate not called!', 1000);
			
			runs(function(){
				expect($items1Select().length).toEqual(2);
				expect($items2Select().length).toEqual(3);
				expect($items2Select().eq(0).attr('value')).toEqual('ams');
				expect($items2Select().eq(2).attr('value')).toEqual('dro');
				expect($items3Select().length).toEqual(0);
			});
		});

		it('level 3: with <select> <option> elements has the expected amount of options', function(){
			//select first option in cascade
			runs(function(){
				form.getFormO().$.find(sel1Select).val("nl").trigger('change');
			});
			
			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'country2';}, 'itemsetUpdate not called!', 1000);
			
			//select second option
			runs(function(){
				form.getFormO().$.find(sel2Select).val("ams").trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'city2';}, 'itemsetUpdate not called!', 1000);

			runs(function(){
				expect($items1Select().length).toEqual(2);
				expect($items2Select().length).toEqual(3);
				expect($items3Select().length).toEqual(2);
				expect($items3Select().eq(0).attr('value')).toEqual('wes');
				expect($items3Select().eq(1).attr('value')).toEqual('dam');
			});

			//select other first option to change itemset
			runs(function(){
				form.getFormO().$.find(sel1Select).val("usa").trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'city2';}, 'itemsetUpdate not called!', 1000);

			runs(function(){
				expect($items1Select().length).toEqual(2);
				expect($items2Select().length).toEqual(3);
				expect($items2Select().eq(0).attr('value')).toEqual('den');
				expect($items2Select().eq(2).attr('value')).toEqual('la');
				expect($items3Select().length).toEqual(0);
			});
		});
	});

	describe('in a cascading select that includes labels without itext', function(){
		var $items1Radio, $items2Radio, $items3Radio, formHTMLO,
			sel1Radio = ':not(.itemset-template) > input:radio[data-name="/form/state"]',
			sel2Radio = ':not(.itemset-template) > input:radio[data-name="/form/county"]',
			sel3Radio = ':not(.itemset-template) > input:radio[data-name="/form/city"]';
		
		beforeEach(function() {
			jQuery.fx.off = true;//turn jQuery animations off
			form = loadForm('cascading_mixture_itext_noitext.xml');
			form.init();

			formHTMLO = form.getFormO();
			spyOn(formHTMLO, 'itemsetUpdate').andCallThrough();
			

			$items1Radio = function(){return form.getFormO().$.find(sel1Radio);};
			$items2Radio = function(){return form.getFormO().$.find(sel2Radio);};
			$items3Radio = function(){return form.getFormO().$.find(sel3Radio);};
		});

		it('level 3: with <input type="radio"> elements using direct references to instance labels without itext has the expected amount of options', function(){
			//select first option
			runs(function(){
				form.getFormO().$.find(sel1Radio+'[value="washington"]')
					.attr('checked', true).trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'state';}, 'itemsetUpdate not called!', 1000);
			
			//select second option
			runs(function(){
				form.getFormO().$.find(sel2Radio+'[value="king"]')
					.attr('checked', true).trigger('change');
			});

			waitsFor(function(){return formHTMLO.itemsetUpdate.mostRecentCall.args[0] === 'county';}, 'itemsetUpdate not called!', 1000);

			runs(function(){
				expect($items1Radio().length).toEqual(2);
				expect($items2Radio().length).toEqual(3);
				expect($items3Radio().length).toEqual(2);
				expect($items3Radio().siblings().text()).toEqual('SeattleRedmond');
			});
		});
	});
});

