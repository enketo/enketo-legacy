<? require 'elements/html_start.php' ?>

</head>

<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>

<body>

<? 	
	require 'elements/header.php'; 
	require 'elements/page.php';
	require 'elements/dialogs.php'; 
?>

	<div class="main">
		
		<ul class="nav nav-tabs">
			<li><a href="#upload" data-toggle="tab">load</a></li>
			<li><a href="#survey-form" data-toggle="tab">form</a></li>
			<li><a href="#data" data-toggle="tab">data</a></li>
			<li><a href="#report" data-toggle="tab">report</a></li>
			<li><a href="#html5-form-source" data-toggle="tab">source</a></li>
			<!--<li><a href="#launch" data-toggle="tab">launch</a></li>-->
		</ul>

		<div class="tab-content">
			
			<article id="upload" class="tab-pane paper">
				<h3 class="ui-widget-header ui-corner-all">JavaRosa XML Form to Load</h3>
				<form id="upload-form" enctype="multipart/form-data" accept-charset="utf-8">
					<progress style="display: none;"></progress><br />
					<div id="input-switcher" class="btn-group" data-toggle="buttons-radio">
						<a type="button" href="#" id="xml_file" class="btn btn-mini">file</a> 
						<a type="button" href="#" id="server_url" class="btn btn-mini">url</a>
					</div>
					<label>
						<!--<span>Select XML Form File (or drag it)</span>-->
						<div class="fakefileinput uneditable-input"><span>Select XML Form File or drag it here</span></div>
						<div><input type="file" name="xml_file" /></div>
					</label>
					<label>
						<!--<span>Enter full web address to server</span>-->
						<!-- add hint: Note that uploading a file is a good way to test forms, but in order to launch the
						survey for data entry in Enketo, it has to be provided as a url-->
						<input type="text" name="server_url" placeholder="Enter full web address to server, e.g. http://formhub.org/formhub_u"/>
					</label>
					<!--<input type="hidden" name="xml_url"/>-->
					<input type="hidden" name="form_id"/>
					<!--<input type="submit">Transform and Test!</button>-->
					
					<div class="hurry"><a href="formtester?server=http%3A%2F%2Fformhub.org%2Fformhub_u" title="Check forms on http://formhub.org/formhub_u">Just want to see how it works?</a></div>
				</form>
				<div id="form-list" class="formlist">
					<ul>
					</ul>
				</div>
			</article>

			<article id="survey-form" class="tab-pane paper">
					<div class="clearfix"><span class="form-language-selector"></span></div>
					<form>no form loaded yet</form>
					<button id="validate-form" class="btn btn-primary btn-large disabled">
						<i class="icon-ok icon-white"></i> Validate
					</button>
			</article>

			<article id="data" class="tab-pane paper">
				<h3>Data structure in XML format</h3>
				<p>The data shown is automatically updated when a form value changes.</p>
				<label id="data-template-show" ><input type="checkbox" value="show"> show templates</label>
				<textarea class="source" readonly="readonly"></textarea>
			</article>

			<article id="report" class="tab-pane paper">
				<section id="xsltmessages">
					<h3 class="ui-widget-header ui-corner-all">Transformation Report</h3>
					<div></div>
				</section>
				<section id="html5validationmessages">
					<h3 class="ui-widget-header ui-corner-all">HTML5 Validation Report</h3>
					<div></div>
				</section>
				<section id="jrvalidationmessages">
					<h3 class="ui-widget-header ui-corner-all">JavaRosa XForm Validation Report</h3>
					<div></div>
				</section>
				<section id="xmlerrors">
					<h3 class="ui-widget-header ui-corner-all">XML Load Errors</h3>
					<div></div>
				</section>
				<section id="jserrors">
					<h3 class="ui-widget-header ui-corner-all">JavaScript Errors</h3>
					<div></div>
				</section>
			</article>

			<article id="html5-form-source" class="tab-pane paper">
				<h3 class="ui-widget-header ui-corner-all">HTML5 form source code</h3>
				<form action="html5validate/" method="post" enctype="multipart/form-data" accept-charset="utf-8">
					<textarea name="content" class="source" readonly="readonly"></textarea>
				</form>
			</article>

			<!--<article id="launch" class="tab-pane paper">
				<h3>Ready to launch that form?</h3>
				<p class="alert alert-error" style="display: none;"></p>
				<p>You will receive a unique url on which your form will be accessible</p>
				<p>Note that enketo does not store any forms or data. It only stores a reference to the server url and form id that you provided and then uses that to pull the form from that location.</p>
				<div class="form-wrapper">
					<form onsubmit="return false;" class="form-horizontal">
						<input name="server_url" type="hidden"/>
						<input name="form_id" type="hidden"/>
						<fieldset class="control-group input-append">
							<label class="control-label" for="email">
								<span>email</span> 
							</label>
							<div class="controls">
								<input id="email" name="email" type="text" placeholder="optional" />
								<span class="add-on hint" title="Not yet functional. You will receive a confirmation email with the direct link to the survey. In the future your email address will also be used for authentication if you would like to change the settings you are now entering."><i class="icon-question-sign"></i></span>
							</div>
						</fieldset>-->
						<!--<label>
							<span class="jr-hint">If you would like to publicize your
							<input name="publicize" type="checkbox" value="true"/>make survey visible
						</label>-->
						<!--<fieldset class="advanced control-group input-append">
							<label class="control-label" for="data_url">
								<span>data/report url</span>
							</label>
							<div class="controls">
								<input id="email" name="data_url" type="text" placeholder="optional"/>
								<span class="add-on hint" title="Not yet functional. You can provide an in-app link to where the collated data or reports will be published."><i class="icon-question-sign"></i></span>
							</div>-->
							<!--<label>submission url<span class="jr-hint">Normally this does not need to and should not be changed.</span><input name="submission_url" type="text"/></label>--><!--
						</fieldset>
					</form>
					<button id="launch-form" class="btn btn-primary btn-large">
						<i class="icon-share icon-white"></i> Launch
					</button>
				</div>
			</article>-->

		</div>
	</div>

	<article id="about" data-title="about this application" class="page">
		<p>
		    Enketo facilitates data collection and data entry using an open-source form format (OpenRosa). This free and open-source application is developed by <a target="_blank" href="http://www.aidwebsolutions.com" title="go to Aid Web Solutions web site"
		    target=_blank> Aid Web Solutions</a> to demonstrate the potential of offline capable
		    web applications to cope with intermittent Internet connections. 
		</p>
		<p>
		   The Enketo form tester is meant for survey administrators to test forms. When all is working well, the survey can be launched on a unique web address via the formlist. A launched survey is offline-capable. The following are the main items left to do for full JavaRosa compatibility:
		</p> 
		<div class="clearfix">   
		    <div class="column">
			    <ul style="line-height: 1.5em">
			    	<li>support for authentication</li>
			    	<li>support for file uploads (images, video, audio)</li>
			    	<li>support for calculations on dates</li>
			    </ul>
			</div>
			<!--<div class="column ui-corner-all ui-helper-clearfix">
				Use the links below to relaunch this app in a developer mode:<br/><br/>
				<a style="display: block; text-align: center;" href="?debug=true" title="click to relaunch">debug mode</a><br/>
				<a style="display: block; text-align: center;" href="?source=true" title="click to relaunch with an add 'source' tab that shows html5 source of the transformed form">source-view mode</a><br/>
				<a style="display: block; text-align: center;" href="#" title="click to relaunch">normal mode</a>
			</div>-->
		</div>
		<!--<p>
		 	Note that for standard XPath 1.0 functions, Enketo does not deviate from the XPath specification. This means that existing forms may not work properly until they are corrected. This is particularly relevant to usages described in item 1 of <a target="_blank" href="https://bitbucket.org/javarosa/javarosa/wiki/XFormDeviations">this document</a>.
		</p>-->
		<p>
			More information is available <a target="_blank" href="http://blog.aidwebsolutions.com/tag/enketo/">here</a>. 
		</p>
		<p>
			Feedback is very welcome at <a href="mailto:<?= $this->config->item('support_email') ?>"><?= $this->config->item('support_email') ?></a>. If you discover a bug, it would be great if you could send the xml form to help troubleshoot.
			<!--<a href="http://aidwebsolutions.com/blog" title="go to Aid Web Solutions blog post on Rapaide" target=_blank>
			 More information</a> about the app.-->
		</p>
		<!-- working:
			translations of labels/constraintMsgs/hints, constraints, relevant(branching), repeats (full), triggers, appearance(partial) 
		--> 

	</article>

	<? require 'elements/footer++.php' ?>
