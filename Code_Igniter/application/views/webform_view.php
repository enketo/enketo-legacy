<? require 'elements/html_start.php' ?>

	<? foreach ($stylesheets as $css): ?>
		<link href="<?= $css; ?>" media="screen" rel="stylesheet" type="text/css" />
	<? endforeach; ?>

	<link href="/css/print.css" media="print" rel="stylesheet" type="text/css" />

	<? foreach ($scripts as $script): ?>
		<script type="text/javascript" src="<?= $script; ?>"></script>
	<? endforeach; ?>
		
		<script type="text/javascript">
			var jrDataStr = '<?= $form_data ?>';
		</script>
	
	<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>

	</head>

	<? //require 'elements/header++.php'; ?>

	<body>
		
		<div id="overlay"></div>
		<header style="height: 0;"></header>
		<!--<div id="status">
			<span id="status-connection" title=""></span>
			<span id="status-editing" title=""></span>
			<span id="status-upload" title=""></span>
		</div>-->
			
		<div id="feedback-bar" class="ui-widget ui-widget-content ui-state-highlight">			
			<span class="ui-icon ui-icon-info" ></span>
			<a href="#" id="feedback-bar-close" class="custom-button" ></a>
		</div>
		
		<div class="dialog" id="dialog-confirm" style="display: none;">
			<p>
				<span class="ui-icon ui-icon-alert"></span>
				<span class="dialog-msg"></span>
			</p>
		</div>
		<div class="dialog" id="dialog-alert" style="display: none;">
			<p>
				<span class="ui-icon ui-icon-alert"></span>
				<span id="dialog-alert-msg"></span>
			</p>
		</div>

		<div class="dialog" id="dialog-save" style="display: none;">
			<p>
				<form onsubmit="return false;">
					<span class="dialog-msg"></span>
					<span class="dialog-error ui-state-error"></span>
					<label>name:<input name="record-name" type="text"/></label>
					<label><input name="record-final" type="checkbox" value="true"/><span>final</span></label>
				</form>
			</p>
		</div>

		<!--<div id="container">-->
			<article class="main">
				<!--<div class="ui-widget">-->
				<div class="form-wrapper" >
					<?= $form ?>
						<!--
						<h2 class="ui-widget-header ui-corner-all"><span id="survey-title" ></span></h2>
						<form name="survey-form" id="survey-form" class="ui-helper-clearfix"></form>
						-->
					<!--</div>-->
				<!--</div>	-->
					<button id="submit-form" >Submit</button>
				</div>
			</article>
		<!--</div>-->

		<div class="drawer left hide">
			<div class="handle right"></div>
			<!--<a id="queue" href="#" title="click to export to file">-->
			<div class="content">
				<span id="status"></span>
				<span id="queue-length">0</span><span> records queued for submission</span>
				<button id="drawer-export">Export</button>
			<!--</a>-->
			</div>	
		</div>

		<div id="branding">
			<a href="http://aidwebsolutions.com" target="_blank">enketo forms</a> for <a href="http://formhub.org" target="_blank">formhub</a></div>

		<? require 'elements/footer++.php' ?>



