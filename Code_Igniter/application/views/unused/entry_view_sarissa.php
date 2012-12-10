<? require 'elements/html_start.php' ?>		

<? 
	$theme = $this->config->item('analyze','themes');
	$min = (ENVIRONMENT === 'production') ? 'min.' : ''; 
?>		
		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/stylesheet.css" />
		
		<script type="text/javascript" src="libraries/jquery.min.js"></script>
		<script type="text/javascript" src="libraries/jquery.mousewheel.min.js"></script>
		<script type="text/javascript" src="libraries/jquery-ui/js/jquery-ui.custom.min.js"></script>
		
		
		<script type="text/javascript" src="libraries/jquery.xslt.js"></script>

		<script type="text/javascript" src="libraries/downloadify/swfobject.js"></script>
		<script type="text/javascript" src="libraries/downloadify/downloadify.min.js"></script>
		<script type="text/javascript" src="libraries/modernizr.min.js"></script>
		<script type="text/javascript" src="libraries/gears_init.js"></script>
		
		<script type="text/javascript" src="js/common.<?=$min?>js"></script><!-- load first as it loads GUI -->s
		<script type="text/javascript" src="js/storage.<?=$min?>js"></script>
		<!--<script type="text/javascript" src="js/form.<?=$min?>js"></script>-->
		<!--<script type="text/javascript" src="libraries/sarissa.<?=$min?>js"></script>-->
		<script type="text/javascript" src="js/formXML.<?=$min?>js"></script>
		<?= (ENVIRONMENT != 'production') ? '<script type="text/javascript" src="js/debug.js"></script>' : ''?><!-- REMOVE BEFORE PRODUCTION -->
		<script type="text/javascript" src="js/survey.<?=$min?>js"></script>

		<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>

	</head>
	
	<? require 'elements/header++.php'; ?>
				
		<article id="records" data-title="locally saved survey data" data-display="data" class="page">
			<div class="ui-helper-clearfix">
				<div id="records-saved" >
					<h3>locally stored survey data</h3>
					<div id="records-saved-pane" class="ui-widget ui-corner-all">
						<div id="records-saved-content">
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
					<a id="link-analysis" href="analyze" title="go to collated data page (online)" target="_blank">
						<span>collated data (online) </span><span class="ui-icon ui-icon-extlink"></span>
					</a>
					
					<div id="records-buttons" class="ui-helper-clearfix">
						<button id="records-force-upload">Upload</button>
						<button id="records-export">Export</button>
					</div>
					<div id="records-force-upload-info">
						upload all finished survey records (bypass automatic uploads)
					</div>
					<div id="records-export-info">
						export / backup all locally stored records and save to a file [NOT FINISHED]
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
						<input name="settings-auto-upload" id="settings-auto-upload" type="checkbox" value="true" /> 
						<label for="settings-auto-upload">automatic</label>
					</p>
					
					<h3>location of buttons</h3>
					<input name="settings-button-location" id="settings-button-location-1" type="radio" value="bottom" />
					<label for="settings-button-location-1">bottom</label>
		
					<input name="settings-button-location" id="settings-button-location-2" type="radio" value="right" />
					<label for="settings-button-location-2">right</label>
					
					<input name="settings-button-location" id="settings-button-location-3" type="radio" value="mobile" disabled="disabled"/>
					<label for="settings-button-location-2">mobile (future)</label>
				</form>
			</div>
			<div class="column ui-corner-all">
				<h3>your browser supports:</h3>
				<ul>
				    <li id="settings-browserSupport-offline-launch"><span class="ui-icon"></span><span >offline launch</span></li>
				    <li id="settings-browserSupport-local-storage"><span class="ui-icon"></span><span >offline data storage</span></li>
				    <li id="settings-browserSupport-fancy-visuals"><span class="ui-icon"></span><span >visual candy</span></li>
				</ul>
			</div>
		</article>
		
		<? require 'elements/page_contact.php'; ?>	
			
		<article id="about" data-title="about this application" class="page">
			<p>
			    This application was developed by <a href="http://www.aidwebsolutions.com" title="go to Aid Web Solutions web site" 
			    target=_blank> Aid Web Solutions</a> to demonstrate the potential of offline capable 
			    web applications in humanitarian aid and other situations with intermittent Internet connections. It 
			   	provides all the advantages of a modern web app without the dependency on a constant connection.
			</p>
			<p>
			    This component of the application stores survey data locally.
			    The stored data is <strong>persistent</strong> so it will still be there next time you open the 
			    browser and the application.
			    When an internet connection becomes available the application can upload the data to a server and empty the
			     local storage.
			    It is meant to be used as a collaboration tool for situations where multiple actors use the same survey 
			    to collect data such is in inter- or intra-cluster needs assessments.
			</p>
			<p>	
			    In all modern browsers this application 
			    will be able to <strong>launch</strong> without an internet connection after once having been loaded online. 
			    See under <a href="#settings" title="settings">settings</a> whether your browser supports this.
			</p> 
			<p>
				This is a very early preview version. Any <a href="#contact" title="contact us">feedback</a> is welcome. 
				<!--<a href="http://aidwebsolutions.com/blog" title="go to Aid Web Solutions blog post on Rapaide" target=_blank>
				 More information</a> about the app.-->
			</p>
		</article>
				
		<div id="container">	
			<article class="main ui-widget" id="wrap-survey-form">
				<!--<div class="ui-widget">-->
					<div class="ui-widget-content ui-corner-all">
						<h3 class="ui-widget-header ui-corner-all"><span id="survey-title" ></span></h3>		
						<form name="survey-form" id="survey-form" class="ui-helper-clearfix"></form>						
					</div>
				<!--</div>	-->
			</article>
		</div>
		
		<div id="form-controls" class="bottom ui-widget ui-widget-header">
			<button id="save-form" >Save</button>
			<button id="reset-form" >Reset</button>
			<button id="delete-form" >Delete</button>
		</div>
		
		<? require 'elements/footer++.php' ?>
		


