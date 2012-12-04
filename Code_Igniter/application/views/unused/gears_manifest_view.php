<?php
	
	//headers to ensure that the manifest itself is not cached:
	//header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); //date in past
	//header("Cache-Control: no-cache");
	//header("Pragma: no-cache");
	  			
	if (isset($manifest) && $manifest)
	{		
		header('Content-Type: application/json');
		echo $manifest;
	}
	else 
	{
		show_error('Problem displaying Gears manifest', 500);
	}
?>
