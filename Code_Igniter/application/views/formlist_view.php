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
	<article id="settings" class="page" data-title="load forms" data-display-icon="settings.png">
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
	
	<article id="about" class="page" data-display="?">
		<h3>What is this?</h3>
		<p>
			This form list provides easy access to all your forms. The list is also available offline (in modern browsers).
		</p>
			After you load a form, that form will also be accessible offline. We recommend to bookmark this page if you intend to use the offline capability so that you will be able to find it easily.
		</p>
		<? if (!$integrated): ?>
		 	<? require_once 'elements/about_standalone_snippet.php';?>
		<? else: ?>
			Please use the <a href="https://groups.google.com/forum/?fromgroups#!forum/formhub-users">users forum</a> or contact <a href="mailto:<?= $this->config->item('support_email') ?>"><?= $this->config->item('support_email') ?></a> for any comments, questions or bug reports.
		<? endif; ?>
	</article>

<? require 'elements/footer++.php' ?>