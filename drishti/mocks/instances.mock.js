//fragments of instances to be loaded into a form for editing
var mockInstances =
{
	'a': {
        "form": {
            "bind_type": "eligible_couple",
            "default_bind_path": "/model/instance/EC_Registration_EngKan_Final/",
            "fields": [
                {
                    "name": "phc",
                    "bind": "ec_village_phc"
                },
                {
                    "name": "sc",
                    "bind": "ec_village_subcenter",
                    "source": "eligible_couple.subCenter",
                    "value": "bherya_a"
                },
                {
                    "name": "village",
                    "bind": "ec_village",
                    "value": "basavanapura"
                },
                {
                    "name": "household_number",
                    "bind": "hh_number"
                },
                {
                    "name": "household_address",
                    "bind": "hh_address"
                },
                {
                    "name": "head_of_household",
                    "bind": "headofhousehold",
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
                    "bind": "woman_name2",
                    "source": "eligible_couple.wifeName",
                    "value": "Kavitha"
                },
                {
                    "name": "aadhar_number"
                },
                {
                    "name": "woman_age"
                },
                {
                    "name": "woman_dob",
                    "bind": "woman_date_of_birth"
                },
                {
                    "name": "husband_name",
                    "source": "eligible_couple.husbandName",
                    "value": "Suresh"
                },
                {
                    "name": "phone_number",
                    "bind": "phone_no"
                },
                {
                    "name": "phone_owner"
                },
                {
                    "name": "alternate_phone_number",
                    "bind": "phone_no2"
                },
                {
                    "name": "alternate_phone_owner",
                    "bind": "phone_owner2"
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
                    "name": "educational_level"
                },
                {
                    "name": "number_of_pregnancies",
                    "bind": "num_pregnancies",
                    "source": "eligible_couple.pregnancies",
                    "value": "1"
                },
                {
                    "name": "number_of_live_births",
                    "bind": "num_livebirths"
                },
                {
                    "name": "number_of_abortions",
                    "bind": "num_abortions"
                },
                {
                    "name": "number_of_spontaneous_abortions",
                    "bind": "num_abortions_spontaneous"
                },
                {
                    "name": "number_of_induced_abortions",
                    "bind": "num_abortions_induced"
                },
                {
                    "name": "number_of_stillbirths",
                    "bind": "num_stillbirths"
                },
                {
                    "name": "number_of_living_children",
                    "bind": "num_livingchildren"
                },
                {
                    "name": "number_of_living_male_children",
                    "bind": "num_livingchildren_male"
                },
                {
                    "name": "number_of_living_female_children",
                    "bind": "num_livingchildren_female"
                },
                {
                    "name": "is_youngest_under_two",
                    "bind": "youngestchild_under2"
                },
                {
                    "name": "youngest_childs_dob",
                    "bind": "child_under2_birthdate"
                },
                {
                    "name": "fp_method",
                    "bind": "familyplanning_method",
                    "source": "eligible_couple.currentMethod",
                    "value": "none"
                },
                {
                    "name": "fp_method",
                    "bind": "familyplanning_method_1",
                    "source": "eligible_couple.currentMethod",
                    "value": "none"
                },
                {
                    "name": "fp_method",
                    "bind": "familyplanning_method_other",
                    "source": "eligible_couple.currentMethod",
                    "value": "none"
                },
                {
                    "name": "place_where_iud_given",
                    "bind": "iud_place"
                },
                {
                    "name": "fp_start_date",
                    "bind": "date_familyplanningstart",
                    "source": "eligible_couple.familyPlanningMethodChangeDate",
                    "value": "---"
                },
                {
                    "name": "fp_start_date",
                    "bind": "date_familyplanningstart",
                    "source": "eligible_couple.familyPlanningMethodChangeDate",
                    "value": "---"
                },
                {
                    "name": "number_of_condoms_supplied",
                    "bind": "num_condoms"
                },
                {
                    "name": "number_of_ocp_strips_supplied",
                    "bind": "num_ocp_cycles"
                },
                {
                    "name": "number_of_centchroman_strips_supplied",
                    "bind": "num_centchroman_pills"
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