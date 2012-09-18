// Load mocks for this spec
EnvJasmine.load(EnvJasmine.mocksDir + "form.mock.js");
// Load files and specific libraries
EnvJasmine.load(EnvJasmine.includeDir + "xpathjs_javarosa.min.js");
EnvJasmine.load(EnvJasmine.jsDir + "__form.js");

describe("get XML Node", function () {
    it("obtains XML Node(s) from instance", function() {
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
		//beforeEach(function(){});
		
		for (i = 0 ; i<t.length ; i++){
			expect(data.node(t[i][0], t[i][1], t[i][2]).get().length).toEqual(t[i][3]);
			//'selector: '+t[i][0]+'   index: '+t[i][1]+',   filter: '+JSON.stringify(t[i][2]));
		}
    });
});

describe("evaluate XPath", function(){
	it('evaluates an XPath expression', function(){
		var t =
		[
			["/thedata/nodeB", "string", null, 0, "b"],
			["../nodeB", "string", "/thedata/nodeB", 0, "b"],
			["/thedata/nodeB", "boolean", null, 0, true],
			["/thedata/notexist", "boolean", null, 0, false]//,
			//["/thedata/repeatGroup[2]/nodeC", "string", null, 0, "c3"], //INFINITE LOOP?
			//['/thedata/repeatGroup[position()=3]/nodeC', 'string', null, 0, 'c3']//INFINITE LOOP?
			// add test case where formula with absolute path is evaluated inside a repeat (ie. [x] position gets injected)
		];
		form = new Form("", ""),
		data = form.data(dataStr1);
		//just need to instantiate this to get $form variable without calling init()
		form.form('<form></form>');

		for (i = 0 ; i<t.length ; i++){
			//console.debug('i is '+i+ ' out of '+t.length);
			expect(data.evaluate(t[i][0], t[i][1], t[i][2], t[i][3])).toEqual(t[i][4]);
		}
	});
});
