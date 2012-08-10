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
				<!--<div class="ui-widget">-->
					<!--<div class="ui-widget-content ui-corner-all">-->
						
						<p style="margin-top: 50%; font-size: 12px; text-align: center; font-family: arial;">Just a whole lot of nothingness... read about the progress on the <a href="http://blog.aidwebsolutions.com/tag/enketo/">Aid Web Solutions Blog</a>.</p>			
					<!--</div>-->
				<!--</div>	-->
			</article>
		</div>
	
	<!--<h1>Placeholder Page</h1>
	<p>
	This landing page will provide a way to find the survey you are participating in as a user. Depending on how the application is deployed it will provide a way to show a list of live surveys with links to the survey form and analysis pages (E.g. for a worldwide multi-cluster deployment, it could start with a map to select the country).
	</p>
	<p>
	(Since this an 'invitation-only' early preview, the links to the currently live demo surveys are not shown.)
	</p>
	<ul>
		 //foreach ($surveys as $survey): 
			<li><a href=" //$survey['url']" //$survey['title']</a></li>
		 //endforeach; 
	</ul>-->

	<? require 'elements/page_contact.php'; ?>	

	<? require 'elements/footer++.php' ?>

