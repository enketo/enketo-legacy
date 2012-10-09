// Load mocks for this spec
EnvJasmine.load(EnvJasmine.mocksDir + "form.mock.js");
// Load files and specific libraries
EnvJasmine.load(EnvJasmine.includeDir + "xpathjs_javarosa/build/xpathjs_javarosa.min.js");
EnvJasmine.load(EnvJasmine.jsDir + "__form.js");

describe("Data node getter function", function () {
    it("obtains XML node(s) from instance", function() {
        var t =
			[
				["", null, null, 9],
				["", null, {}, 9],
				//["/", null, {}, 9], //issue with xfind, not important
				[false, null, {}, 9],
				[null, null, {}, 9],
				[null, null, {noTemplate:true}, 9],
				[null, null, {noTemplate:false}, 11],
				[null, null, {onlyTemplate:true}, 1],
				[null, null, {noEmpty:true}, 3],
				[null, null, {noEmpty:true, noTemplate:false}, 4],

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
		
		for (i = 0 ; i<t.length ; i++){
			expect(data.node(t[i][0], t[i][1], t[i][2]).get().length).toEqual(t[i][3]);
		}
    });
});

describe('Data node XML data type validation', function(){
	var data,
		form = new Form("", "");
	form.form('<form></form>');

	it('validates xml-type (without constraint evaluation)', function(){
		var t =
			[
				["/thedata/nodeA", null, null, 'val1', null, true],
				["/thedata/nodeA", null, null, 'val3', 'somewrongtype', true],

				["/thedata/nodeA", 1   , null, 'val13', 'string', null], //non-existing node
				["/thedata/repeatGroup/nodeC", null, null, 'val', null], //multiple nodes

				["/thedata/nodeA", 0   , null, '4', 'double', true], //non-existing xml data type -> string
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
/*Rhino*/		["/thedata/nodeA", null, null, '2012-01-01', 'date', true],
				["/thedata/nodeA", null, null, '2012-12-32', 'date', false],
				["/thedata/nodeA", null, null, 324, 'date', true],
				
				["/thedata/nodeA", null, null, 'val5565ghgyuyua', 'datetime', false], //Chrome turns val10 into a valid date..
				["/thedata/nodeA", null, null, '2012-01-01T00:00:00-06', 'datetime', true],
				["/thedata/nodeA", null, null, '2012-12-32T23:59:59-06', 'datetime', true],
				["/thedata/nodeA", null, null, '2012-01-01T30:00:00-06', 'datetime', true], //datetimes can deal with 25:00s

				["/thedata/nodeA", null, null, 'a', 'time', false],
				["/thedata/nodeA", null, null, 'aa:bb', 'time', false],
/*FF,Rhino*/	["/thedata/nodeA", null, null, '0:0', 'time', true],
/*FF,Rhino*/	["/thedata/nodeA", null, null, '00:00', 'time', true],
/*FF,Rhino*/	["/thedata/nodeA", null, null, '23:59', 'time', true],
				["/thedata/nodeA", null, null, '24:00', 'time', false],

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

		for (i = 0 ; i<t.length ; i++){
			data = form.data(dataStr1);
			expect(data.node(t[i][0], t[i][1], t[i][2]).setVal(t[i][3], null, t[i][4])).toEqual(t[i][5]);
		}
	});

	it('sets a non-empty value to empty', function(){
		var node = data.node('/thedata/nodeA', null, null);
		data = form.data(dataStr1);
		node.setVal('value', 'string');
		expect(node.setVal(''), true);
	});
});

describe("Data node remove function", function(){
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


describe("XPath Evaluator", function(){
	it('evaluates an XPath expression', function(){
		var t =
		[
			["/thedata/nodeB", "string", null, 0, "b"],
			["../nodeB", "string", "/thedata/nodeB", 0, "b"],
			["/thedata/nodeB", "boolean", null, 0, true],
			["/thedata/notexist", "boolean", null, 0, false]//,
			//["/thedata/repeatGroup[2]/nodeC", "string", null, 0, "c3"]//, //INFINITE LOOP?
			//['/thedata/repeatGroup[position()=3]/nodeC', 'string', null, 0, 'c3']//INFINITE LOOP?
			// add test case where formula with absolute path is evaluated inside a repeat (ie. [x] position gets injected)
		];
		form = new Form("", ""),
		data = form.data(dataStr1);
		//just need to instantiate this to get $form variable without calling init()
		form.form('<form></form>');

		for (i = 0 ; i<t.length ; i++){
			//console.debug('i is '+i+ ' out of '+t.length);
			expect(data.evaluate(String(t[i][0]), t[i][1], t[i][2], t[i][3])).toEqual(t[i][4]);
		}
	});
});
