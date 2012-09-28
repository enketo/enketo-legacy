<?php
	header('Content-Type: text/cache-manifest');
	// headers to ensure that the manifest itself is not cached:
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); //date in past
	header("Cache-Control: no-cache");
	header("Pragma: no-cache");
	
	//$hashes = "";
 
	//require 'vars.php';
	//get the manifest resources (same for Gears and HTML5)
	//require 'manifest_resources.php';
	 
	// var_dump($cache); //DEBUG
  
  //write the manifest content
  echo "CACHE MANIFEST\n";
  echo "# hash:".$hashes."\n\n";
  
  echo "CACHE:\n";
  foreach ($cache as $resource){
  	echo $resource."\n";
  }
  echo "\n";
  
  echo "NETWORK:\n";
  foreach ($network as $resource){
  	echo $resource."\n";
  }
  echo "\n";
  
  echo "FALLBACK:\n";
  echo '/ '.$fallback."\n";
 	
//CACHE MANIFEST
//# hash:5d12c4ee521f3661fcdbd92ee8f938f0_0003//

//CACHE:
//images/favicon.png
//libraries/jquery-ui/css/sunny/jquery-ui.custom.css
//css/screen.css
//css/print.css
//libraries/jquery.min.js
//libraries/jquery-ui/js/jquery-ui.custom.min.js
//libraries/jquery-ui-timepicker-addon.js
//libraries/jquery.multiselect.min.js
//libraries/modernizr.min.js
//libraries/xpathjs_javarosa.min.js
//libraries/FileSaver.min.js
//libraries/BlobBuilder.min.js
//libraries/vkbeautify.js
//js-source/__common.js
//js-source/__storage.js
//js-source/__form.js
//js-source/__survey.js
//js-source/__debug.js
//libraries/jquery-ui/css/sunny/images/ui-bg_highlight-soft_100_feeebd_1x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_gloss-wave_45_817865_500x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_gloss-wave_60_fece2f_500x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_gloss-wave_70_ffdd57_500x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_inset-soft_30_ffffff_1x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_gloss-wave_90_fff9e5_500x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_diagonals-medium_20_d34d17_40x40.png
//libraries/jquery-ui/css/sunny/images/ui-icons_d19405_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-icons_fadc7a_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-icons_3d3d3d_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-icons_bd7b00_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-icons_eb990f_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-icons_ed9f26_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-icons_ffe180_256x240.png
//libraries/jquery-ui/css/sunny/images/ui-bg_flat_50_5c5c5c_40x100.png
//libraries/jquery-ui/css/sunny/images/ui-bg_flat_30_cccccc_40x100.png
//css/fonts/OpenSans-Regular.ttf
//css/images/tex2res2.png//

//NETWORK:
//*//

//FALLBACK:
/// http://gnms8.enketo.formhub.net/offline
?>