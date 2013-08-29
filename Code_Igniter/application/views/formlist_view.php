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
			<progress style="display: none; margin: -30px auto 15px auto;"></progress>
			<div id="form-list" class="formlist empty">
				<p class="alert clearfix">To enable a form for offline use, simply load it. <button id="refresh-list" type="button" class="btn  btn-mini"><i class="icon-refresh"></i></button></p>
				<ul></ul>
				<img src="/images/formlist.png" alt="enter settings to load list of forms" />
			</div>
			
		</article>
	</div>
	<article id="settings" class="page" data-title="load forms" data-display"settings">
		<div class="btn-toolbar">
			<div class="<? if (!$integrated): ?>input-prepend<? endif ?> input-append btn-group">
			<? if(!$integrated): ?>
				<button class="addon btn dropdown-toggle" data-toggle="dropdown">
					<span class="caret"></span>
				</button>
			<? endif ?>
				<ul class="dropdown dropdown-menu url-helper" data-toggle="buttons-radio">	
				<? if($integrated): ?>
					<li><a class="url-helper" data-value="formhub" href="#">formhub account</a></li>
				<? endif ?>
					<li><a class="url-helper" data-value="https" href="#">https://</a></li>
					<li><a class="url-helper" data-value="http" href="#">http://</a></li>
					<!--<li><a class="url-helper" data-value="formhub_uni" href="#">formhub university</a></li>-->
					<li><a class="url-helper" data-value="appspot" href="#">appspot subdomain</a></li>
				</ul>
				<input id="server" type="url" placeholder="" />
				<span class="addon btn btn-primary go"><i class="icon-refresh icon-white"></i></span>
			</div>
		</div>
	</article>

<? require 'elements/footer++.php' ?>