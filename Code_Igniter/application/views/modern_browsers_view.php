<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8">
	<link rel="icon" type="image/png" href="images/favicon.png">
    <title>Browser not supported</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="robots" content="">
    
    <script type="text/javascript" src="libraries/jquery.min.js"></script>
	<script type="text/javascript" src="libraries/modernizr.min.js"></script>
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
		Rapaide uses modern technologies for storing data locally and launching offline that require a modern browser<span id="not-supported"></span>.
	</p>
	<p>
	 	We <strong>recommend</strong> using a recent version of one of the following excellent modern browsers:	
		<ul>
			<li><a href="http://www.google.com/chrome/" title="Chrome download page">Chrome</a></li>
			<li><a href="http://www.apple.com/safari/" title="Safari download page">Safari</a></li>
			<li><a href="http://www.mozilla.com/" title="Firefox download page">Firefox</a></li>
			<li><a href="http://www.opera.com/" title"Opera download page">Opera</a></li>
		</ul>
	</p>
	<h2>Internet Explorer (IE) users</h2>
	<p>
		Internet Explorer (even the latest version) is lagging behind in the support of technologies used in this application. 		However, it is possible to use IE8 and higher. To enable offline launch in IE, the <a href="http://gears.google.com" 		target="_blank">Gears plugin</a> is required.
		Note that Gears is officially not supported (by Google) on IE9 and although it appears to function, bugs could arise 		in future browser updates that cannot be solved. On the other hand, future updates of IE may avoid the need for the 		Gears plugin altogether.
	</p>
</body>
</html>