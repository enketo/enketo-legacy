//fragments of instances to be loaded into a form for editing
var mockInstances =
{
	'a': {
        "form": {
            "bind_type": "eligible_couple",
            "default_bind_path": "/model/instance/EC_Registration_EngKan_Final/",
            "fields": [
            	{
            		"name": "uuid",
            		"bind": "/model/instance/EC_Registration_EngKan_Final/formhub/uuid"
            	},
            	{
            		"name": "today"
            	},
                {
                    "name": "phc",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/ec_village_phc"
                },
                {
                    "name": "sc",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/ec_village_subcenter",
                    "source": "eligible_couple.subCenter",
                    "value": "bherya_a"
                },
                {
                    "name": "village",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/ec_village",
                    "value": "basavanapura"
                },
                {
                    "name": "household_number",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/hh_number"
                },
                {
                    "name": "household_address",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/hh_address"
                },
                {
                    "name": "head_of_household",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/headofhousehold",
                    "source": "eligible_couple.headOfHousehold",
                    "value": "Suresh"
                },
                {
                    "name": "ec_number",
                    "source": "eligible_couple.ecNumber",
                    "value": "11"
                },
                {
                    "name": "woman_name",
                    "source": "eligible_couple.wifeName",
                    "value": "Kavitha"
                },
                {
                    "name": "woman_name",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/woman_name2",
                    "source": "eligible_couple.wifeName",
                    "value": "Kavitha"
                },
                {
                    "name": "aadhaar_number"
                },
                {
                    "name": "woman_age"
                },
                {
                    "name": "woman_dob",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/woman_date_of_birth"
                },
                {
                    "name": "husband_name",
                    "source": "eligible_couple.husbandName",
                    "value": "Suresh"
                },
                {
                    "name": "phone_number",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/phone_no"
                },
                {
                    "name": "phone_owner"
                },
                {
                    "name": "alternate_phone_number",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/phone_no2"
                },
                {
                    "name": "alternate_phone_owner",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/phone_owner2"
                },
                {
                    "name": "economic_status",
                    "source": "eligible_couple.economicStatus",
                    "value": "apl"
                },
                {
                    "name": "bpl_card_number"
                },
                {
                    "name": "religion",
                    "value": "hindu"
                },
                {
                    "name": "caste",
                    "value": "sc"
                },
                {
                	"name": "education_level"
                },
                {
                    "name": "number_of_pregnancies",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_pregnancies",
                    "source": "eligible_couple.pregnancies",
                    "value": "1"
                },
                {
                    "name": "number_of_live_births",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_livebirths"
                },
                {
                    "name": "number_of_abortions",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_abortions"
                },
                {
                    "name": "number_of_spontaneous_abortions",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_abortions_spontaneous"
                },
                {
                    "name": "number_of_induced_abortions",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_abortions_induced"
                },
                {
                    "name": "number_of_stillbirths",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_stillbirths"
                },
                {
                    "name": "number_of_living_children",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_livingchildren"
                },
                {
                    "name": "number_of_living_male_children",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_livingchildren_male"
                },
                {
                    "name": "number_of_living_female_children",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_livingchildren_female"
                },
                {
                    "name": "is_youngest_under_two",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/youngestchild_under2"
                },
                {
                    "name": "youngest_childs_dob",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/age_youngestchild"
                },
                {
                    "name": "fp_method",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/familyplanning_method",
                    "source": "eligible_couple.currentMethod",
                    "value": "none"
                },
                {
                    "name": "fp_method",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/familyplanning_method_1",
                    "source": "eligible_couple.currentMethod",
                    "value": "none"
                },
                {
                    "name": "fp_method",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/familyplanning_method_other",
                    "source": "eligible_couple.currentMethod",
                    "value": "none"
                },
                {
                    "name": "place_where_iud_given",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/iud_place"
                },
                {
                    "name": "fp_start_date",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/date_familyplanningstart",
                    "source": "eligible_couple.familyPlanningMethodChangeDate",
                    "value": "---"
                },
                {
                	"name": "threemonths_from_sterilization_date",
                	"bind": "/model/instance/EC_Registration_EngKan_Final/male_sterilizaton_group/threemonths_from_sterilization_date"
                },
                 {
                	"name": "male_sterilization_message",
                	"bind": "/model/instance/EC_Registration_EngKan_Final/male_sterilizaton_group/male_sterilization_message"
                },
                {
                    "name": "number_of_condoms_supplied",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_condoms"
                },
                {
                    "name": "number_of_ocp_strips_supplied",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_ocp_cycles"
                },
                {
                    "name": "number_of_centchroman_strips_supplied",
                    "bind": "/model/instance/EC_Registration_EngKan_Final/num_centchroman_pills"
                },
                {
                	"name": "abortion_risk"
                },
                {
                	"name": "parity_risk_priority"
                },
                {
                	"name": "age_risk_priority"
                },
                {
                	"name": "youngchild_risk_priority"
                },
                {
                	"name": "would_be_high_risk"
                },
                {
                	"name": "would_be_high_risk_reason"
                },
                {
                    "name": "is_high_priority",
                    "source": "eligible_couple.isHighPriority",
                    "value": "no"
                },
                {
                    "name": "high_priority_reason",
                    "source": "eligible_couple.highPriorityReason",
                    "value": "  "
                },
                {
                	"name": "message2"
                },
                {
                	"name": "message3"
                },
                {
                	"name": "instanceID",
                	"bind": "/model/instance/EC_Registration_EngKan_Final/meta/instanceID",
                	"value": "a"
                },
                {
                	"name": "deprecatedID",
					"bind": "/model/instance/EC_Registration_EngKan_Final/meta/deprecatedID"
                }
            ]
        }
    },

   	'b': {
        "form": {
            "bind_type": "whatever",
            "default_bind_path": "/model/instance/thedata/",
            "fields": [
                {
                    "name": "nodeA"
                },
                {
                	"name": "nodeB"
                },
                {
               		"name": "nodeF"
                },
                {
                    "name": "instanceID",
                	"bind": "/model/instance/thedata/meta/instanceID",
                	"value": "b"
                },
                {
                	"name": "A",
                	"bind": "/model/instance/thedata/somenodes/A",
                },
                {
                	"name": "B",
                	"bind": "/model/instance/thedata/somenodes/B",
                },
                {
                	"name": "C",
                	"bind": "/model/instance/thedata/somenodes/C",
                },
                {
                	"name": "w1",
                	"bind": "/model/instance/thedata/someweights/w1",
                	"value": "2"
                },
                {
                	"name": "w2",
                	"bind": "/model/instance/thedata/someweights/w2",
                },
                {
                	"name": "w.3",
                	"bind": "/model/instance/thedata/someweights/w.3",
                },
                {
                	"name": "deprecatedID",
                	"bind": "/model/instance/thedata/meta/deprecatedID"
                }
            ],
            "sub_forms" : [
            	{
            		"bind_type": "repeatGroup",
            		"default_bind_path": "/model/instance/thedata/repeatGroup/",
            		"meta_fields" : [],
            		"fields":[
            			{
            				"name": "nodeC"
            			}
            		],
     				"instances":[
     					{
     						"nodeC": "first value"
     					},
     					{
     						"nodeC": "second value"
     					},
     					{
     						"id": "c397fdcd-f8dd-4d32-89a9-37030c01b40b", //Not bound to any field in form
     						"nodeC": "third value"
     					},
     					{
     						"nodeC": "fourth value"
     					}
     				]
            	}


            ]
        }
    }
};
//	'a':
//	{
//		"formId": "Child_Sick_Visit_Copy",
//		"instanceId": "uuid:17a190be-3966-4bf9-9b8e-90679a5bb119",
//		"values": [
//			{
//				"fieldName": "uuid",
//				"fieldValue": "ab5f12bf34bb40fb874930e8b91bf6bb",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/formhub/uuid"
//			},
//			{
//				"fieldName": "today",
//				"fieldValue": "2013-03-07",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/today"
//			},
//			{
//				"fieldName": "sick_visit_option",
//				"fieldValue": "report_child_disease",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/sick_visit_option"
//			},
//			{
//				"fieldName": "child_disease",
//				"fieldValue": "measles",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/report_child_disease_group/child_disease"
//			},
//			{
//				"fieldName": "date_child_disease",
//				"fieldValue": "2013-03-01",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/report_child_disease_group/date_child_disease"
//			},
//			{
//				"fieldName": "place_child_disease",
//				"fieldValue": "elsewhere",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/report_child_disease_group/place_child_disease"
//			},
//			{
//				"fieldName": "instanceID",
//				"fieldValue": "uuid:17a190be-3966-4bf9-9b8e-90679a5bb119",
//				"bindPath": "/instance/Child_Sick_Visit_Copy/meta/instanceID"
//			}
//		]
//	}