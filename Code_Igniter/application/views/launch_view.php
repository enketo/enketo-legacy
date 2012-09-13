<? require 'elements/html_start.php' ?>

<?
	$theme = $this->config->item('analyze','themes');
	$min = (ENVIRONMENT === 'production') ? 'min.' : '';
	$add = (ENVIRONMENT === 'production') ? '' : '-source';
?>
		<!--[if IE]><script type="text/javascript">window.location.href = 'modern_browsers';</script><![endif]-->

		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/screen.css" />


		<!--<script type="text/javascript" src="libraries/xpathjs_javarosa/src/engine.js"></script>
		<script type="text/javascript" src="libraries/xpathjs_javarosa/build/parser.js"></script>-->

<? foreach ($scripts as $script): ?>
	<script type="text/javascript" src="<?= $script; ?>"></script>
<? endforeach; ?>

<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>


	</head>

	<? require 'elements/header++.php'; ?>
	<div class="dialog" id="dialog-launch" style="display: none;">
		<p>
			<form onsubmit="return false;">
				<span class="dialog-msg"></span>
				<span class="dialog-error ui-state-error"></span>
				<input name="server_url" type="hidden"/>
				<input name="form_id" type="hidden"/>
				<label>
					<span>email</span>
					<span class="hint ui-icon ui-icon-help" title="You will receive a confirmation email with the direct link to the survey. In the future your email address will also be used for authentication if you would like to change the settings you are now entering."></span>
					<input name="email" type="text" placeholder="optional" />
				</label>
				<!--<label>
					<span class="jr-hint">If you would like to publicize your
					<input name="publicize" type="checkbox" value="true"/>make survey visible
				</label>-->
				<a class="advanced" href="#" title="advanced options">show advanced options</a>
				<fieldset class="advanced">
					<label>
						<span>data or report publication link</span>
						<span class="hint ui-icon ui-icon-help" title="You can provide an in-app link to where the collated data or reports will be published."></span>
						<input name="data_url" type="text" placeholder="optional"/>
					</label>
					<!--<label>submission url<span class="jr-hint">Normally this does not need to and should not be changed.</span><input name="submission_url" type="text"/></label>-->
				</fieldset>
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
							<span>Enter full web address to server</span>
							<!-- add hint: Note that uploading a file is a good way to test forms, but in order to launch the
							survey for data entry in Enketo, it has to be provided as a url-->
							<input type="text" name="server_url" placeholder="e.g. http://formhub.org/formhub_u"/>
						</label>
						<!--<input type="hidden" name="xml_url"/>-->
						<input type="hidden" name="form_id"/>
						<!--<input type="submit">Transform and Test!</button>-->
						<img style="display: none;" class="loading" src="images/ajax-loader.gif" />
						<div class="hurry"><a href="launch?server=http%3A%2F%2Fformhub.org%2Fformhub_u" title="Check forms on http://formhub.org/formhub_u">Pssst, in a hurry?</a></div>
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
		    Enketo facilitates data collection and entry using an open-source form format (JavaRosa). It is being developed by <a target="_blank" href="http://www.aidwebsolutions.com" title="go to Aid Web Solutions web site"
		    target=_blank> Aid Web Solutions</a> to demonstrate the potential of offline capable
		    web applications to cope with intermittent Internet connections. 
		</p>
		<p>
		   The Enketo launch area allows survey administrators to test forms and afterwards 'launch' them on a unique URL for actual data entry. The entry component will be offline-capable. The following are the main items left to do for full JavaRosa compatibility:
		</p> 
		<div class="ui-helper-clearfix">   
		    <div class="column ui-corner-all">
			    <ul style="line-height: 1.5em">
			    	<li>support for cascading selections</li>
			    	<li>itext(path/to/node) support</li>
			    	<li>complete data type validation</li>
			    	<li>widgets (grids, slider, geop., auto, select, big-text)</li>
			    </ul>
			</div>
			<div class="column ui-corner-all ui-helper-clearfix">
				Use the links below to relaunch this app in a developer mode:<br/><br/>
				<!--<a style="display: block; text-align: center;" href="?debug=true" title="click to relaunch">debug mode</a><br/>-->
				<a style="display: block; text-align: center;" href="?source=true" title="click to relaunch with an add 'source' tab that shows html5 source of the transformed form">source-view mode</a><br/>
				<a style="display: block; text-align: center;" href="#" title="click to relaunch">normal mode</a>
			</div>
		</div>
		<!--<p>
		 	Note that for standard XPath 1.0 functions, Enketo does not deviate from the XPath specification. This means that existing forms may not work properly until they are corrected. This is particularly relevant to usages described in item 1 of <a target="_blank" href="https://bitbucket.org/javarosa/javarosa/wiki/XFormDeviations">this document</a>.
		</p>-->
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
		<button id="validate-form">Validate</button>
		<button id="launch-form">Launch</button>
	</div>

	<? require 'elements/footer++.php' ?>
