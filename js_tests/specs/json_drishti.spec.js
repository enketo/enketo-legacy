describe("Conversion from Drishti-style JSON non-repeat form elements to an XML instance", function () {
	var data = mockInstances.a,
		jData = new JData(data),
		instanceXML = '<model><instance>'+jData.toXML()+'</instance></model>',
		$instance = $($.parseXML(instanceXML));

	it('creates valid XML', function(){
		expect($instance).toBeTruthy();
	});

	it('preserves cAsE of XML node names', function(){
		expect($instance.find('instance>*:first').prop('nodeName')).toEqual('EC_Registration_EngKan_Final');
	});

	function testDataValue(path, value){
		it('correctly adds non-repeat XML node with path '+path+' and value "'+value+'"', function(){
			expect($instance.find(path.substring(1).replace(/\//g, '>')).text()).toEqual(value);
		});
	}

	for (var i=0; i<data.form.fields.length; i++){
		if (typeof data.form.fields[i].value !== 'undefined'){
			var bind = data.form.fields[i].bind || data.form.default_bind_path + data.form.fields[i].name;
			testDataValue(bind, data.form.fields[i].value);
		}
	}
});

describe("Conversion from Drishti-style JSON repeat form elements to an XML instance", function(){
	var data = mockInstances.b,
		jData = new JData(data),
		instanceXML = '<model><instance>'+jData.toXML()+'</instance></model>',
		$instance = $($.parseXML(instanceXML));

	function testRepeatDataValue(path, value, index){
		it('correctly adds a repeat XML node with path '+path+', index '+index+' and value "'+value+'"', function(){
			expect($instance.find(path.substring(1).replace(/\//g, '>')).eq(index).text()).toEqual(value);
		});
	}

	for (var i=0; i<data.form.sub_forms.length; i++){
		var subForm = data.form.sub_forms[i];
		for (var j=0; j<subForm.instances.length; j++){
			for (var name in subForm.instances[j]){
				if (['id'].indexOf(name) !== -1 ) return; //skip non-bound properties (just 'id' for now)
				var field = $.grep(subForm.fields, function(item){return item.name === name;});
				var bind = field.bind || subForm.default_bind_path + name;
				testRepeatDataValue(bind, subForm.instances[j][name], j);
			}
		}
	}
});

describe("Handles errors in JSON format", function(){
	//no root form property
	//field without name
	//field missing
	//subform missing
	//field in subform missing
	//subform bind_type missing
	//multiple fields with same name in main form
	//multiple fields with same name in a subform
});

describe("Updating JSON value properties for non-repeat form elements", function(){
	var origData, jData, $village, origVillage, $hh, origHh;

	beforeEach(function(){
		origData = jQuery.extend(true, {}, mockInstances.a);
		jData = new JData(origData);
		jData.getInstanceXML = getFakeInstanceXML;
		setFakeInstance('EC_Registration_EngKan_Final');
		$hh = $fakeInstance.find('hh_number');
		$village = $fakeInstance.find('ec_village');
		origHh = $.grep(origData.form.fields, function(field){return field.name === "household_number";});
		origVillage = $.grep(origData.form.fields, function(field){return field.name === "village";});
	});

	it('does NOT add a value property if it was missing before AND if the submitted value for that node is empty', function(){
		expect($hh.length).toEqual(1);
		expect(origHh.length).toEqual(1);
		expect(origHh[0].value).toBeUndefined();
		expect($.grep(jData.get().form.fields, function(field){return field.name === "household_number";})[0].value).toBeUndefined();
	});

	it('updates the value property if it was there before but the value changed', function(){
		//TODO
	});

	it('adds a value property if it was missing before AND if the submitted value for that node is NOT empty', function(){
		$hh.text('3045');
		expect($hh.length).toEqual(1);
		expect(origHh.length).toEqual(1);
		expect(origHh[0].value).toBeUndefined();
		expect($.grep(jData.get().form.fields, function(field){return field.name === "household_number";})[0].value).toEqual('3045');
	});

	it('keeps the value property (but empties it) if the value changes from not empty to empty', function(){
		$village.text('');
		expect($village.length).toEqual(1);
		expect(origVillage.length).toEqual(1);
		expect(origVillage[0].value).toEqual('basavanapura');
		expect($.grep(jData.get().form.fields, function(field){return field.name === "village";})[0].value).toEqual('');
	});

	it('does not change the JSON object if the get() (=update) function is called twice in a row', function(){
		$village.text('denver');
		$hh.text('3045');
		var first = jData.get();
		var second = jData.get();
		expect(first).toEqual(second);
	});
});

describe("Updating JSON value properties for repeat form elements", function(){
	var origData, jData, $c1, $c3;

	beforeEach(function(){
		origData = jQuery.extend(true, {}, mockInstances.b);
		jData = new JData(origData);
		jData.getInstanceXML = getFakeInstanceXML;
		setFakeInstance('thedata.xml');
		console.debug('fake instance: ', $fakeInstance[0]);
		$c1 = $fakeInstance.find('nodeC').eq(1);//template = 0
		$c3 = $fakeInstance.find('nodeC').eq(3);
	});

	it('adds a value to the JSON subform if the value is not empty', function(){
		expect(jData.get().form.sub_forms[0].instances[1].nodeC).toEqual('c2');
		expect(jData.get().form.sub_forms[0].instances[2].nodeC).toEqual('c3');
	});

	it('also adds a value to the JSON subform if the value is empty', function(){
		expect(jData.get().form.sub_forms[0].instances[0].nodeC).toEqual('');
	});

	it('updates values when they change', function(){
		$c1.text('new first value');
		$c3.text('new third value');
		expect(jData.get().form.sub_forms[0].instances[0].nodeC).toEqual('new first value');
		expect(jData.get().form.sub_forms[0].instances[2].nodeC).toEqual('new third value');
	});

	it('preserves unbound JSON subform instance properties ("id")', function(){
		expect(jData.get().form.sub_forms[0].instances[2].id).toEqual("c397fdcd-f8dd-4d32-89a9-37030c01b40b");
	});
});

xdescribe("Translating back and forth from JSON to XML to JSON", function() {
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