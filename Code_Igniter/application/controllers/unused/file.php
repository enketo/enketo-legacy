<?php

class File extends CI_Controller {

	public function index()
	{
	
		//$url = 'http://nl11sh001.rapaide.org/';
		$url = 'http://nl11sh001.rapaide.org/modern_browsers';
		//$url = 'http://www.google.com'; 

		//$this->load->library('curl');
    	//echo $this->curl->simple_get($url);	
    	
    	
    	echo file_get_contents($url);	
    	
    	//var_dump (file($url));
    	/*
    	$file = fopen($url, "r");
    	$data=NULL;
    	
    	if ($file)
    	{
    		while (!feof($file))
    		{
    			$data .= fread($file, 4096);
    			
    		}
    		if ($data)
    		{
    			echo $data;
    		}
    		else
    		{
    			echo 'no data found';
    		}
    		fclose($file);
    	}
    	*/
    	
	}

}


?>