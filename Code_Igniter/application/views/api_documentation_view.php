<? require 'elements/html_start.php'; ?>
	<body>
		<div class="main">
			<h1>API Documentation</h1>
<?
	$base = base_url();
	$data_valid = array(
	    array('target' => $base.'/api_v1/survey', 'url'=>'https://active.api.high.testserver',  'token' => 'avalidtoken', 'status' => 200),
	    array('target' => $base.'/api_v1/survey/iframe', 'url'=>'https://active.api.high.testserver',  'token' => 'avalidtoken', 'status' => 200),
	    array('target' => $base.'/api_v1/survey/single', 'url'=>'https://active.api.high.testserver',  'token' => 'avalidtoken', 'status' => 200),
	    array('target' =>  $base.'/api_v1/survey/single/iframe', 'url'=>'https://active.api.high.testserver',  'token' => 'avalidtoken', 'status' => 200),
	    array('target' => $base.'/api_v1/survey/survey/preview', 'url'=>'https://active.api.high.testserver',  'token' => 'avalidtoken', 'status' => 200),
	    array('target' => $base.'/api_v1/survey/survey/all', 'url'=>'https://active.api.high.testserver',  'token' => 'avalidtoken', 'status' => 200)
	);

	$data_error = array(
	    array('url'=>'https://active.api.high.testserver',  'token' => NULL,          'status' => 401),
	    array('url'=>'https://active.api.high.testserver',  'token' => 'invalid',      'status' => 401),
	    array('url'=>'https://active.api.low.testserver',   'token' => 'avalidtoken', 'status' => 403),
	    array('url'=>'https://active.api.low.testserver',   'token' => 'invalid',      'status' => 401),
	    array('url'=>'https://active.noapi.high.testserver','token' => 'avalidtoken', 'status' => 405),
	    array('url'=>'https://active.noapi.high.testserver','token' => 'invalid',      'status' => 401),
	    array('url'=>'https://active.noapi.low.testserver', 'token' => 'avalidtoken', 'status' => 405),
	    array('url'=>'https://active.noapi.low.testserver', 'token' => 'invalid',      'status' => 401),
	    array('url'=>'https://inactive.testserver',         'token' => 'avalidtoken', 'status' => 403),
	    array('url'=>'https://inactive.testserver',         'token' => 'invalid',      'status' => 401),
	    array('url'=>'https://noexist.testserver',          'token' => 'avalidtoken', 'status' => 404),
	    array('url'=>'https://noexist.testserver',          'token' => 'invalid',      'status' => 401),
	    array('url'=> NULL,                                 'token' => 'avalidtoken', 'status' => 400),
	    array('url'=> NULL,                                 'token' => 'invalid',      'status' => 400)
	);

	echo "<h1>valid responses</h1>";
	echo "<p>For accounts that are valid, have API access and are linked to the correct server URL, requesting an existing resource.</p>";
	print_curls($data_valid);
	echo "<h1>error responses</h1>";
	print_curls($data_error);
    

    function print_curls($data)
    {
        foreach ($data as $test_data){
            $target = (isset($test_data['target'])) ? $test_data['target'] : $base.'/api_v1/survey:';
            echo "request to ".$target."<br/>";
            echo "<textarea cols='120'>".
                 "curl --user ".$test_data['token'].": ".
                 "-d 'server_url=".$test_data['url']."&form_id=someform' ".$target." -v -3".
                 "</textarea> =&gt; ".$test_data['status']."<br/>";
        }
    }
?>
		</div>
	</body>
</html>