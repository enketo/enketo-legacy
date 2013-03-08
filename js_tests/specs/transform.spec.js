describe("Dristhi-style JSON to XML instance transformer", function () {
	var transformer = new Transformer(),
		instanceXML = transformer.JSONToXML(json1),
		$instance = $($.parseXML(instanceXML)),
		mockForm = new Form('', '<model><instance>'+instanceXML+'</instance></model>'),
		dataO;

	mockForm.init();
	dataO = mockForm.getDataO();

	it('creates valid XML', function(){
		expect($instance).toBeTruthy();
	});

	it('preserves cAsE of XML node names', function(){
		expect($instance.find('*:first').prop('nodeName')).toEqual('Edit_form');
	});

	xit('creates XML that can be used to instantiate a form object without load errors', function(){

	});

	function testDataValue(path, value){
		it('correctly added XML node with path '+path+' and value '+value, function(){
			expect(dataO.node(path.substring(9)).getVal()[0]).toEqual(value);
		});
	}

	for (var i=0; i<json1.values.length; i++){
		testDataValue(json1.values[i].bindPath, json1.values[i].fieldValue);
	}
});

describe("Translating back and forth from JSON to XML to JSON", function() {
	var transformer = new Transformer();

	function transformAndBackTest(name, submissionXML){
		it("Results in the same original for form: "+name, function(){
			var jData = transformer.XMLToJSON(submissionXML);
			var xData = transformer.JSONToXML(jData);
			//for some reason JSONToXML doesn't output self-closing xml tags. To fix this:
			xData = new XMLSerializer().serializeToString($($.parseXML(xData))[0]);
			expect(xData).toEqual(submissionXML);
		});
	}

	for (var formName in mockForms2){
		if (mockForms2.hasOwnProperty(formName)){
			//strip model and instance nodes and namespace to simulate a submission
			//note: this test fails if the instance has template nodes
			var cleanedXML = mockForms2[formName].xml_model.replace('xmlns="http://www.w3.org/2002/xforms"', '');
			var submissionXML = (new XMLSerializer()).serializeToString($($.parseXML(cleanedXML)).find('instance>*:first')[0]);
			transformAndBackTest(formName, submissionXML);
		}
	}
});

