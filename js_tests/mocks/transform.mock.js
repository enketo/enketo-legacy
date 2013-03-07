var json1 =
	{
		"formId": "edit_form",
		"instanceID": "X",
		"query": "select ec.wifename as wifename, m.thayi_card as thayi_card from ec , mother m ",
		"values": [
			{
			"bindPath": "/instance/edit_form/wifeName",
			"fieldName": "wifeName",
			"fieldValue": "Asha"
			},
			{
			"bindPath": "/instance/edit_form/wifeAge",
			"fieldName": "wifeAge",
			"fieldValue": "27"
			}
		]
	};

$.fn.selectpicker = function(){return this;};
$.fn.geopointWidget = function(){return this;};
$.fn.tooltip = function(){return this;};