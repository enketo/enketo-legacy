var json1 =
	{
		"formId": "Edit_form",
		"instanceID": "X",
		"query": "select ec.wifename as wifename, m.thayi_card as thayi_card from ec , mother m ",
		"values": [
			{
			"bindPath": "/instance/Edit_form/wifeName",
			"fieldName": "wifeName",
			"fieldValue": "Asha"
			},
			{
			"bindPath": "/instance/Edit_form/wifeAge",
			"fieldName": "wifeAge",
			"fieldValue": "27"
			}
		]
	};

$.fn.selectpicker = function(){return this;};
$.fn.geopointWidget = function(){return this;};
$.fn.tooltip = function(){return this;};