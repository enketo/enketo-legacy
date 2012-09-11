<? require 'elements/html_start.php' ?>

<?
	$theme = $this->config->item('survey','themes');
?>
		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/screen.css" />

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
					<h3>locally stored survey data</h3>
					<div class="ui-widget ui-corner-all scroll-list">
						<div>
							<ol>
							</ol>
						</div>
					</div>
					<p id="records-summary" class="ui-helper-clearfix">
						<span class="ui-icon ui-icon-check"></span><span id="records-final-qty"></span> finished surveys
						<span class="ui-icon ui-icon-pencil"></span><span id="records-draft-qty"></span> draft surveys
					</p>
				</div>
				<div class="column middle"></div>
				<div class="column right">
					<a id="link-analysis" href="data/view" title="go to collated data page (online)" target="_blank">
						<span>collated data (online) </span><span class="ui-icon ui-icon-extlink"></span>
					</a>

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

		<article id="settings" data-title="settings" class="page ui-helper-clearfix">

			<div class="column ui-corner-all">
				<form name="settings-form" id="settings-form">
					<input id="recordType" name="recordType" type="hidden" value="settings" />

					<h3>uploading data</h3>
					<p>
						<label>
							automatic
							<input name="autoUpload" type="checkbox" value="true" />
						</label>
					</p>

					<h3>location of buttons</h3>
					<label>
						bottom
						<input name="buttonLocation" type="radio" value="bottom" />
					</label>
					<label>
						right
						<input name="buttonLocation" type="radio" value="right" />
					</label>
					<!--<label>
						mobile (future)
						<input name="buttonLocation" type="radio" value="mobile" disabled="disabled"/>
					</label>-->
				</form>
			</div>
			<div class="column ui-corner-all">
				<h3>your browser supports:</h3>
				<ul>
				    <li id="settings-browserSupport-offline-launch"><span class="ui-icon ui-icon-close"></span><span >offline launch</span></li>
				    <li id="settings-browserSupport-local-storage"><span class="ui-icon ui-icon-close"></span><span >offline data storage</span></li>
				    <li id="settings-browserSupport-fancy-visuals"><span class="ui-icon ui-icon-close"></span><span >visual candy</span></li>
				</ul>
			</div>
		</article>

		<? require 'elements/page_contact.php'; ?>

		<article id="about" data-title="about this application" class="page">
			<p>
			    Enketo was developed by <a href="http://www.aidwebsolutions.com" title="go to Aid Web Solutions web site"
			    target=_blank> Aid Web Solutions</a> to demonstrate the potential of offline capable
			    web applications in contexts with intermittent Internet connections. It
			   	provides all the advantages of a modern web app without the dependency on a constant connection.
			</p>
			<p>
			    This core data entry component of the application stores survey data locally in the browser. The stored data is <strong>persistent</strong> so it will still be there next time you open the
			    browser and the application.
			    When an internet connection becomes available the application can upload the data to a server and empty the
			     local storage.
			    It is meant to be used as a collaboration tool for situations where multiple actors use the same survey
			    to collect data.
			</p>
			<p>
			    In all modern browsers this application
			    will also be able to <strong>launch</strong> without an internet connection after once having been loaded online.
			    See under <a href="#settings" title="settings">settings</a> whether your browser supports this.
			</p>
			<p>
				This is a very early preview version. Any <a href="#contact" title="contact us">feedback</a> is welcome.
				<!--<a href="http://aidwebsolutions.com/blog" title="go to Aid Web Solutions blog post on Rapaide" target=_blank>
				 More information</a> about the app.-->
			</p>
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
			<button id="save-form" >Save</button>
			<button id="reset-form" >New</button>
			<button id="delete-form" >Delete</button>
		</div>

		<? require 'elements/footer++.php' ?>



