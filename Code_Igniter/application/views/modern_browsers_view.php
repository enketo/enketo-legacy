<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8">
	<link rel="icon" type="image/png" href="images/enketo.ico">
    <title>Browser not supported</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="robots" content="">
    
    <script type="text/javascript" src="/libraries/enketo-core/lib/jquery.min.js"></script>
	<script type="text/javascript" src="/libraries/enketo-core/lib/modernizr.min.js"></script>
	<script type="text/javascript">
		var notSupported = [], and='';
		if (!Modernizr.localstorage) notSupported.push('local data storage');
		if (!Modernizr.applicationcache) notSupported.push('offline launch');
		if (notSupported.length === 2) and = ' and ';
		$(function(){
			if (notSupported.length > 0){
				notSupported.push('');
				$('#not-supported').text(
					' (we detected that your browser does not support '+notSupported[0]+and+notSupported[1]+')'
				);
			}	
		});	
	</script>
    <? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>
</head>

<body>
	<h1>Modern Browsers</h1>
	<p>
		Enketo uses several state-of-the-art technologies that are not yet supported by sub-standard browsers such as all older versions of Internet Explorer<span id="not-supported"></span>.
	</p>
	<p>
	 	We <strong>recommend</strong> using a recent version of one of the following excellent modern browsers:	
		<ul>
			<li><a href="http://www.google.com/chrome/" title="Chrome download page">Chrome</a></li>
			<li><a href="http://www.apple.com/safari/" title="Safari download page">Safari</a></li>
			<li><a href="http://www.mozilla.com/" title="Firefox download page">Firefox</a></li>
			<li><a href="http://www.opera.com/" title="Opera download page">Opera</a></li>
		</ul>
	</p>
	<h2>Why not Internet Explorer?</h2>
	<p>
		We understand that some people, especially those working for large bureaucracies, do not have access to modern browsers. Since we know how great the web could be, we have great empathy for users in that unfortunate situation. Normally, we would provide workarounds to support outdated, but still used, browsers. However, enketo uses a technology that allows web applications to launch offline. This is a key feature and in fact it was the reason it was developed. This technology is not available in Internet Explorer (except in version 10 and later) and users on older browsers are unfortunately out of luck.
	<p>
</body>
</html>