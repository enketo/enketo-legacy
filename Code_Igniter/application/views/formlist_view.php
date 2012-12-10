<? require 'elements/html_start.php' ?>		
	
	<meta name="apple-mobile-web-app-capable" content="yes" />

	<style type="text/css">
		/*header{display: none;}*/
		.progress-space{height: 50px; text-align: center;}
		/*#page{display: none;}*/
		#form-list ul{padding: 0; margin: 0;list-style: none;}
		#form-list ul li {margin: 10px 0;}
		#form-list.empty p{display: none;}
		progress{display: none;}
		input{width: 80%;text-align: center;}
		.input-append{width: 100%; text-align: center;}
	</style>

</head>
<body>
<? 
	if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}
	require 'elements/header.php';
	require 'elements/dialogs.php';
	require 'elements/page.php';
?>
	<div class="main">
		<article class="paper">
			<button class="btn btn-primary"><i class="icon-refresh icon-white">Refresh</i></button>
			<div class="progress-space"><progress></progress></div>
			<div id="form-list" class="empty">
				<p class="alert">To enable a form for offline use, simply load it.</p>
				<ul></ul>
			</div>
		</article>
	</div>

	<article class="page" id="settings">
		<div class="btn-toolbar">
			<div class="input-prepend input-append btn-group">
				<button class="addon btn dropdown-toggle" data-toggle="dropdown">
					<span class="caret"></span>
				</button>
				<ul class="dropdown dropdown-menu url-helper" data-toggle="buttons-radio">	
					<li><a class="url-helper" data-value="http" href="#">http://</a></li>
					<li><a class="url-helper" data-value="https" href="#">https://</a></li>
					<li><a class="url-helper" data-value="formhub" href="#">formhub account</a></li>
					<li><a class="url-helper" data-value="formhub_uni" href="#">formhub university</a></li>
					<li><a class="url-helper" data-value="appspot" href="#">appspot subdomain</a></li>
				</ul>
				<input id="server" type="url" placeholder="" />
				<span class="addon btn btn-primary go"><i class="icon-refresh icon-white"></i></span>
			</div>
		</div>
	</article>

<? require 'elements/page_contact.php'; ?>	

<? require 'elements/footer++.php' ?>