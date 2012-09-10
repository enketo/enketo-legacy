<? require 'elements/html_start.php' ?>

	<? foreach ($stylesheets as $css): ?>
		<link rel="stylesheet" type="text/css" href="<?= $css; ?>" />
	<? endforeach; ?>

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

		<article id="records" data-title="locally saved survey data" data-display="data" class="page">
			<div class="ui-helper-clearfix">
				<div id="records-saved" >
					<h3>Data Queued for Submission</h3>
					<div class="ui-widget ui-corner-all scroll-list">
						<div>
							<ol>
							</ol>
						</div>
					</div>
					<p id="records-summary" class="ui-helper-clearfix">
						<!--<span class="ui-icon ui-icon-check"></span><span id="records-final-qty"></span> finished surveys
						<span class="ui-icon ui-icon-pencil"></span><span id="records-draft-qty"></span> draft surveys-->
					</p>
				</div>
				<div class="column middle"></div>
				<div class="column right">
					<!--<a id="link-analysis" href="data/view" title="go to collated data page (online)" target="_blank">
						<span>collated data (online) </span><span class="ui-icon ui-icon-extlink"></span>
					</a>-->

					<div id="records-buttons" class="ui-helper-clearfix">
						<button id="records-force-upload">Upload</button>
						<button id="records-export">Export</button>
					</div>
					<div id="records-force-upload-info">
						Upload all "final" survey records (bypass automatic uploads).
					</div>
					<div id="records-export-info">
						Export all locally stored records marked as 'final'. 
					</div>
				</div>
			</div>
			<!--
			<div id="ExportDiv" >
				Export &amp; Backup
				<p id="downloader">Oops, you need Flash 10 for this to work</p>
			</div>--><!-- end of ExportDiv -->
		</article>

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
			<button id="submit-form" >Submit</button>
			<!--<button id="reset-form" >New</button>-->
			<!--<button id="delete-form" >Delete</button>-->
		</div>

		<? require 'elements/footer++.php' ?>



