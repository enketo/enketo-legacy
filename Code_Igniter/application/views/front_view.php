<? require 'elements/html_start.php' ?>		
	<? $theme = $this->config->item('analyze','themes'); ?>

		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/screen.css" />
		
		<script type="text/javascript" src="libraries/jquery.min.js"></script>
		<script type="text/javascript" src="libraries/jquery-ui/js/jquery-ui.custom.min.js"></script>
		<script type="text/javascript" src="libraries/modernizr.min.js"></script>
		
		<? foreach ($scripts as $script): ?>
			<script type="text/javacscript" src="<?= $script; ?>"></script>
		<? endforeach; ?>
		
		<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>

	</head>

	<? require 'elements/header++.php'; ?>

		<div id="container">
			<article class="main">

				<p style="margin-top: 50%; font-size: 12px; text-align: center;">Please access enketo from the 'Enter Web Form' button provided in <a href="http://formhub.org">formhub</a> on each form page.</p>
				<!--
				<p style="margin-top: 50%; font-size: 12px; text-align: center; font-family: arial;">Just a whole lot of nothingness... read about the progress on the <a href="http://blog.aidwebsolutions.com/tag/enketo/">Aid Web Solutions Blog</a>.</p>
				-->		
			</article>
		</div>

	<? require 'elements/page_contact.php'; ?>	

	<? require 'elements/footer++.php' ?>

