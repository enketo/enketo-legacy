<?php

	header('Content-Type: application/json');

	if (isset($survey_form_format_json) && $survey_form_format_json)
	{
		echo $survey_form_format_json;
	}
	else {
		echo ('error'); //form format does not exist or the survey is not published yet');
	}
?>