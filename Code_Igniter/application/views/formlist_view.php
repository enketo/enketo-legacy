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
	<article class="page" id="settings" data-title="load forms">
		<div class="btn-toolbar">
			<div class="<? if (!$integrated): ?>input-prepend<? endif ?> input-append btn-group">
			<? if(!$integrated): ?>
				<button class="addon btn dropdown-toggle" data-toggle="dropdown">
					<span class="caret"></span>
				</button>
			<? endif ?>
				<ul class="dropdown dropdown-menu url-helper" data-toggle="buttons-radio">	
					<li><a class="url-helper" data-value="http" href="#">http://</a></li>
					<li><a class="url-helper" data-value="https" href="#">https://</a></li>
				<? if($integrated): ?>
					<li><a class="url-helper" data-value="formhub" href="#">formhub account</a></li>
				<? endif ?>
					<!--<li><a class="url-helper" data-value="formhub_uni" href="#">formhub university</a></li>-->
					<li><a class="url-helper" data-value="appspot" href="#">appspot subdomain</a></li>
				</ul>
				<input id="server" type="url" placeholder="" />
				<span class="addon btn btn-primary go"><i class="icon-refresh icon-white"></i></span>
			</div>
		</div>
	</article>
	
<article id="about" class="page">
	<p>This form list provides easy access to your forms. This list also works while offline (in modern browsers).</p>
	<p>When a form has been manually loaded once (by clicking on it), that form will also be accessible offline.</p>
	<p>Make sure to bookmark this page for offline use!</p>	
	<p>
		Please write <a href="mailto:<?= $this->config->item('support_email') ?>"><?= $this->config->item('support_email') ?></a> for any comments, questions or bug reports.
	</p>			
</article>

<? require 'elements/footer++.php' ?>