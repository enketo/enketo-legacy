var androidContext = {

	id : 'ANC_Registration_Test',

	getForm : function(){
		return mockForms2[this.id].html_form;
	},

	getModel : function(){
		return mockForms2[this.id].xml_model;
	}
};