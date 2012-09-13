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

	<? require 'elements/header++.php'; ?>

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

		<div id="container">
			<article class="main ui-widget" >
				<!--<div class="ui-widget">-->
					<div class="ui-widget-content ui-corner-all" >
						<?= $form ?>
						<!--
						<h2 class="ui-widget-header ui-corner-all"><span id="survey-title" ></span></h2>
						<form name="survey-form" id="survey-form" class="ui-helper-clearfix"></form>
						-->
					</div>
				<!--</div>	-->
			</article>
		</div>

		<div id="form-controls" class="bottom ui-widget ui-widget-header">
			<a id="queue" href="#" style="display: none;" title="click to export to file">
				<span id="queue-length"></span><span> records queued for submission</span>
			</a>
			<button id="submit-form" >Submit</button>
			<!--<button id="reset-form" >New</button>-->
			<!--<button id="delete-form" >Delete</button>-->
		</div>

		<? require 'elements/footer++.php' ?>



