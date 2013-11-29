<? require 'elements/html_start.php' ?>		
	
	<meta name="apple-mobile-web-app-capable" content="yes" />

</head>
<body>
<? 
	
	require 'elements/header.php';
	require 'elements/dialogs.php';
	require 'elements/page.php';
?>
	<div class="main">
		<article class="paper">
			<progress style="display: none; margin: -10px auto 15px auto;"></progress>
			<div id="form-list" class="formlist empty">
				<p class="alert clearfix">To enable a form for offline use, simply load it. <button id="refresh-list" type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-refresh"></span></button></p>
				<ul></ul>
				<img src="/images/formlist.png" alt="enter settings to load list of forms" />
			</div>
			
		</article>
	</div>
	<article id="settings" class="page" data-title="load forms" data-display-icon="cog" data-display="Settings">
		<div class="input-group">
			<div class="input-group-btn">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
				<ul class="dropdown-menu url-helper">	
					<li><a class="url-helper" data-value="formhub" href="#">formhub account</a></li>
					<li><a class="url-helper active" data-value="https" href="#">https://</a></li>
					<li><a class="url-helper" data-value="http" href="#">http://</a></li>
					<!--<li><a class="url-helper" data-value="formhub_uni" href="#">formhub university</a></li>-->
					<li><a class="url-helper" data-value="appspot" href="#">appspot subdomain</a></li>
				</ul>
			</div>
			<input id="server" type="url" placeholder="" class="form-control" />
			<span class="input-group-btn">
				<button class="btn btn-primary go" type="button"><span class="glyphicon glyphicon-refresh icon-white"> </span></button>
			</span>
		</div>
	</article>

<? require 'elements/footer++.php' ?>
