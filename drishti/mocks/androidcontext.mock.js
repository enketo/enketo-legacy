var androidContext = {

	//formName : 'ANC_Close_EngKan_Final',
	//formName : 'ANC_Registration_EngKan_Final',
	//formName : 'EC_Registration_EngKan_Final',
	//formName : 'thedata.xml',
	formName: helper.getQueryParam('formName'),

	getForm : function(){
		return mockForms2[this.formName].html_form;
	},

	getModel : function(){
		return mockForms2[this.formName].xml_model;
	}
};

var logContext = {
	logError : function(e){
		console.error(e);
	}
};

var enketo = {
	FormDataRepository : function(){},
	FormDataController : function(entityRelO, formDefO, formModelMapperO){
		this.get = function(params){
			return mockInstances[params.instanceId] || null;
		};
		this.save = function(instanceId, data){};
	},
	EntityRelationshipLoader : function(){},
	FormDefinitionLoader : function(){},
	FormModelMapper : function(dataRepo, sqlBuilder, idFactory){},
	SQLQueryBuilder : function(dataRepo){},
	IdFactory : function(bridge){},
	IdFactoryBridge : function(){}
};