<?php
	//NOT USED ANYMORE
	// most of this stuff should move to the controller
	
	$handle = fopen($ODK_form_url, 'r');
	
	if($handle)
	{
		try{
			$xml = file_get_contents($ODK_form_url);
		}
		catch (Exception $e){
			//echo ('Exception occurred when reading form format: '.$e->getMessage().'\n');
		}
		if ($xml) {
			header('Content-Type: text/xml');
			print_r($xml);
		}
		else ("error");
	}
	else {
		echo ("error"); //form format does not exist or the survey is not published yet');
	}
?>