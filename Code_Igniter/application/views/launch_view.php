<? require 'elements/html_start.php' ?>

<?
	$theme = $this->config->item('analyze','themes');
	$min = (ENVIRONMENT === 'production') ? 'min.' : '';
	$add = (ENVIRONMENT === 'production') ? '' : '-source';
?>
		<!--[if IE]><script type="text/javascript">window.location.href = 'modern_browsers';</script><![endif]-->

		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/screen.css" />

		<script type="text/javascript" src="libraries/jquery.min.js"></script>
		<script type="text/javascript" src="libraries/jquery-ui/js/jquery-ui.custom.min.js"></script>
		<script type="text/javascript" src="libraries/jquery-ui-timepicker-addon.js"></script>
		<script type="text/javascript" src="libraries/jquery.multiselect.min.js"></script>
		<script type="text/javascript" src="libraries/jquery.form.js"></script><!-- minimize -->
		<script type="text/javascript" src="libraries/modernizr.min.js"></script>
		<script type="text/javascript" src="libraries/vkbeautify.js"></script>
		<script type="text/javascript" src="libraries/xpathjs_javarosa.min.js"></script>
		<!--<script type="text/javascript" src="libraries/xpathjs_javarosa/src/engine.js"></script>
		<script type="text/javascript" src="libraries/xpathjs_javarosa/build/parser.js"></script>-->

<? foreach ($scripts as $script): ?>
	<script type="text/javascript" src="<?= $script; ?>"></script>
<? endforeach; ?>

<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>


	</head>

	<? require 'elements/header++.php'; ?>
	<div id="dialog-launch">
		<p>
			<form onsubmit="return false;">
				<span id="dialog-msg"></span>
				<label>formList url<input name="formlist-url" type="text"/></label>
				<label>submission url<input name="submission-url" type="text"/></label>
				<label><input name="publicize" type="checkbox" value="true"/>final</label>
			</form>
		</p>
	</div>


	<div id="container">

		<div class="main ui-widget" id="wrap-survey-form">

			<div class="ui-widget-content tabs-nohdr ui-corner-all" id="tabs">
				<ul>
					<li><a href="#upload">upload</a></li>
					<li><a href="#survey-form">form</a></li>
					<li><a href="#data">data</a></li>
					<li><a href="#report">report</a></li>
					<li><a href="#html5-form-source">source</a></li>
				</ul>
				<article id="upload" class="ui-corner-all">
					<h2 class="ui-widget-header ui-corner-all">JavaRosa XML Form to Load</h2>

					<form id="upload-form" action="transform/transform_post_jr_form" method="post" enctype="multipart/form-data" accept-charset="utf-8">
						<div id="input-switcher">
							<a href="#" id="xml_file">file</a>|<a href="#" id="server_url">url</a></div>
						<label>
							<span>Select XML Form File (or drag it)</span>
							<div class="fakefileinput"></div>
							<div><input type="file" name="xml_file" /></div>
						</label>
						<label>
							<span>Enter full URL to Server</span>
							<!-- add hint: Note that uploading a file is a good way to test forms, but in order to launch the
							survey for data entry in Enketo, it has to be provided as a url-->
							<input type="text" name="server_url" placeholder="e.g. https://jrosaforms.appspot.com  or  http://formhub.org/formhub_u"/>
						</label>
						<!--<input type="hidden" name="xml_url"/>-->
						<input type="hidden" name="form_id"/>
						<!--<input type="submit">Transform and Test!</button>-->
						<img style="display: none;" class="loading" src="images/ajax-loader.gif" />
					</form>
					<div id="form-list" class="" style="display:none;">
						<ol>
						</ol>
					</div>
				</article>
				<article id="survey-form">
						<div></div>
				</article>
				<article id="data"
						<p>The data shown is automatically updated when a form value changes.</p>
						<label id="data-template-show">show templates<input type="checkbox" value="show"></label>
						<textarea class="source" readonly="readonly"></textarea>
				</article>

				<article id="report">
					<section id="xsltmessages">
						<h2 class="ui-widget-header ui-corner-all">Transformation Report</h2>
						<div></div>
					</section>
					<section id="html5validationmessages">
						<h2 class="ui-widget-header ui-corner-all">HTML5 Validation Report</h2>
						<div></div>
					</section>
					<section id="jrvalidationmessages">
						<h2 class="ui-widget-header ui-corner-all">JavaRosa XForm Validation Report</h2>
						<div></div>
					</section>
					<section id="xmlerrors">
						<h2 class="ui-widget-header ui-corner-all">XML Load Errors</h2>
						<div></div>
					</section>
					<section id="jserrors">
						<h2 class="ui-widget-header ui-corner-all">JavaScript Errors</h2>
						<div></div>
					</section>
				</article>
				<article id="html5-form-source">
					<h2 class="ui-widget-header ui-corner-all">HTML5 form source code</h2>
					<form action="html5validate/" method="post" enctype="multipart/form-data" accept-charset="utf-8">
						<textarea name="content" class="source" readonly="readonly"></textarea>
					</form>
				</article>
			</div>
		</div>
	</div>

	<article id="about" data-title="about this application" class="page">
		<p>
		    Enketo facilitates data collection using an open-source form format (JavaRosa). It is being developed by <a target="_blank" href="http://www.aidwebsolutions.com" title="go to Aid Web Solutions web site"
		    target=_blank> Aid Web Solutions</a> to demonstrate the potential of offline capable
		    web applications to cope with intermittent Internet connections. 
		</p>
		<p>
		   The Enketo launch area allows survey administrators to test forms and afterwards 'launch' them on a unique URL for actual data entry. The entry component will be offline-capable. Only the launch component is currently available for a very early preview on Google Chrome. The following are the main items left to do for full JavaRosa compatibility:
		</p> 
		<div class="ui-helper-clearfix">   
		    <div class="column ui-corner-all">
			    <ul style="line-height: 1.5em">
			    	<li>widgets (grids, slider, geop., auto, select, big-text)</li>
			    	<!--<li>formhub support for media labels &amp; form logo</li>-->
			    	<li>support for cascading selections</li>
			    	<li>itext(path/to/node) support</li>
			    	<li>improved design and usability</li>
			    	<li>complete data type validation</li>
			    	<li>performance improvement</li>
			    </ul>
			</div>
			<div class="column ui-corner-all ui-helper-clearfix">
				Use the links below to relaunch this app in a developer mode:<br/><br/>
				<!--<a style="display: block; text-align: center;" href="?debug=true" title="click to relaunch">debug mode</a><br/>-->
				<a style="display: block; text-align: center;" href="?debug=true&source=true" title="click to relaunch">debug + source-view mode</a><br/>
				<a style="display: block; text-align: center;" href="#" title="click to relaunch">normal mode</a>
			</div>
		</div>
		<p>
		 	Note that for standard XPath 1.0 functions, Enketo does not deviate from the XPath specification. This means that existing forms may not work properly until they are corrected. This is particularly relevant to usages described in item 1 and 3 of <a target="_blank" href="https://bitbucket.org/javarosa/javarosa/wiki/XFormDeviations">this document</a>.
		</p>
		<p>
			More information is available <a target="_blank" href="http://blog.aidwebsolutions.com/tag/enketo/">here</a>. 
		</p>
		<p>
			<a href="#contact" title="contact us">Feedback</a> is very welcome. If you discover a bug, it would be great if you could send the xml form to help troubleshoot.
			<!--<a href="http://aidwebsolutions.com/blog" title="go to Aid Web Solutions blog post on Rapaide" target=_blank>
			 More information</a> about the app.-->
		</p>
		<!-- working:
			translations of labels/constraintMsgs/hints, constraints, relevant(branching), repeats (full), triggers, appearance(partial) 
		--> 
	</article>

	<? require 'elements/page_contact.php'; ?>

	<div id="form-controls" class="bottom ui-widget ui-widget-header">
		<button id="reset-form" >Reset</button>
		<button id="launch-form">Launch</button>
	</div>

	<? require 'elements/footer++.php' ?>
