describe("Dristhi-style JSON to XML instance transformer", function () {
	var transformer = new Transformer(),
		instanceXML = transformer.JSONToXML(json1),
		mockForm = new Form('', '<model><instance>'+instanceXML+'</instance></model>'),
		dataO;

	mockForm.init();
	dataO = mockForm.getDataO();

	it('creates valid XML', function(){
		expect($.parseXML(instanceXML)).toBeTruthy();
	});

	it('creates XML that can be used to instantiate a form object without load errors', function(){

	});

	function testDataValue(path, value){
		it('succesfully added XML node with path '+path+' and value '+value, function(){
			expect(dataO.node(path.substring(9)).getVal()[0]).toEqual(value);
		});
	}

	for (var i=0; i<json1.values.length; i++){
		testDataValue(json1.values[i].bindPath, json1.values[i].fieldValue);
	}
});

describe("Translating back and forth from JSON to XML to JSON", function() {
	var transformer = new Transformer();

	function transformAndBackTest(name, instanceXML){
		it("Results in the same original for form: "+name, function(){
			var jData = transformer.XMLToJSON(instanceXML);
			var xData = transformer.JSONToXML(jData);
			expect('<model>'+xData+'</model>').toEqual(instanceXML);
		});
	}

	for (var form in mockForms2){
		if (mockForms2.hasOwnProperty(form)){
			transformAndBackTest(form, mockForms2[form].xml_model);
		}
	}
});

