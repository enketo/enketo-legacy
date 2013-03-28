var androidContext = {

	//id : 'ANC_Close_EngKan_Final',
	//id : 'ANC_Registration_EngKan_Final',
	id: 'EC_Registration_EngKan_Final',
	//id : 'thedata.xml',

	getForm : function(){
		return mockForms2[this.id].html_form;
	},

	getModel : function(){
		return mockForms2[this.id].xml_model;
	}
};