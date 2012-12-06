<?php
	header('Content-Type: text/cache-manifest');
	// headers to ensure that the manifest itself is not cached:
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); //date in past
	header("Cache-Control: no-cache");
	header("Pragma: no-cache");
  
  //write the manifest content
  echo "CACHE MANIFEST\n";
  echo "# hash:".$hashes."\n\n";
  
  echo "CACHE:\n";
  foreach ($cache as $resource){
  	echo $resource."\n";
  }
  echo "\n";
  
  echo "FALLBACK:\n";
  echo '/ '.$fallback."\n";
  echo "\n";
  
  echo "NETWORK:\n";
  foreach ($network as $resource){
    echo $resource."\n";
  }
  
?>