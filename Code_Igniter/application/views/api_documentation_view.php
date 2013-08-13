<? require 'elements/html_start.php'; ?>
    <body>
        <div class="main">
            <h1>API Documentation</h1>
<?
    $this->load->helper('url');
    $base = base_url();
    $data_valid = array(
        array('target' => $base.'/api_v1/survey', 'url'=>'https://active.api.high.testserver',  'token' => 'a', 'status' => 200),
        array('target' => $base.'/api_v1/survey/iframe', 'url'=>'https://active.api.high.testserver',  'token' => 'a', 'status' => 200),
        array('target' => $base.'/api_v1/survey/single', 'url'=>'https://active.api.high.testserver',  'token' => 'a', 'status' => 200),
        array('target' =>  $base.'/api_v1/survey/single/iframe', 'url'=>'https://active.api.high.testserver',  'token' => 'a', 'status' => 200),
        array('target' => $base.'/api_v1/survey/survey/preview', 'url'=>'https://active.api.high.testserver',  'token' => 'a', 'status' => 200),
        array('target' => $base.'/api_v1/survey/survey/all', 'url'=>'https://active.api.high.testserver',  'token' => 'a', 'status' => 200)
    );

    $data_error = array(
        array('url'=>'https://active.api.high.testserver',  'token' => NULL,            'status' => 401),
        array('url'=>'https://active.api.high.testserver',  'token' => 'invalid',       'status' => 401),
        array('url'=>'https://active.api.low.testserver',   'token' => 'b',             'status' => 403),
        array('url'=>'https://active.api.low.testserver',   'token' => 'invalid',       'status' => 401),
        array('url'=>'https://active.noapi.high.testserver','token' => 'c',             'status' => 405),
        array('url'=>'https://active.noapi.high.testserver','token' => 'invalid',       'status' => 401),
        array('url'=>'https://active.noapi.low.testserver', 'token' => 'd',             'status' => 405),
        array('url'=>'https://active.noapi.low.testserver', 'token' => 'invalid',       'status' => 401),
        array('url'=>'https://inactive.testserver',         'token' => 'e',             'status' => 403),
        array('url'=>'https://inactive.testserver',         'token' => 'invalid',       'status' => 401),
        array('url'=>'https://noexist.testserver',          'token' => 'nothingisvalid','status' => 404),
        array('url'=>'https://noexist.testserver',          'token' => NULL,            'status' => 404),
        array('url'=> NULL,                                 'token' => 'nothingisvalid','status' => 400),
        array('url'=> NULL,                                 'token' => NULL,            'status' => 400)
    );

    echo "<h1>valid /webform responses</h1>";
    echo "<p>For accounts that are valid, have API access and are linked to the correct server URL, requesting an existing resource.</p>";
    print_curls($data_valid, 'survey', $base);
    echo "<h1>error /webform responses</h1>";
    print_curls($data_error, 'survey', $base);
    echo "<h1>valid /surveys responses</h1>";
    echo "curl --user abcde: -d 'server_url=https://formhub.org/formhub_u' http://enketo.formhub.net/api_v1/surveys/list -v -3";
    echo "curl --user abcde: -d 'server_url=https://formhub.org/formhub_u' http://enketo.formhub.net/api_v1/surveys/number -v -3";
    
    echo "<h1>error /instance responses</h1>";
    print_curls($data_error, 'instance', $base);

    echo "<h1>valid /instance responses</h1>";
    echo "curl --user abcde: -d 'server_url=https://formhub.org/formhub_u&form_id=widgets&instance=<widgets></widgets>&instance_id=hi&return_url=http://google.com' http://enketo.formhub.net/api_v1/instance -v -3";

    function print_curls($data, $api, $base)
    {
        foreach ($data as $test_data){
            $target = (isset($test_data['target'])) ? $test_data['target'] : $base.'api_v1/'.$api;
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