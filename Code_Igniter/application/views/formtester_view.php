<? require 'elements/html_start.php' ?>

</head>
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
		</ul>

		<div class="tab-content">
			
			<article id="upload" class="tab-pane paper">
				<h3 class="ui-widget-header ui-corner-all">OpenRosa XForm to Load</h3>
				<form id="upload-form" enctype="multipart/form-data" accept-charset="utf-8">
					<div id="input-switcher" class="btn-group">
						<button type="button" id="xml_file" class="btn btn-default btn-xs">file</button> 
						<button type="button" id="server_url" class="btn btn-default btn-xs">url</button>
					</div>
					<fieldset>
						<label>
							<div class="fakefileinput form-control"><span>Click to Select XML Form File</span></div>
							<div><input type="file" name="xml_file" /></div>
						</label>
						<label>
							<input type="text" name="server_url" placeholder="Enter full web address to server, e.g. http://formhub.org/formhub_u"/>
						</label>
						<input type="hidden" name="form_id"/>
					</fieldset>
					<div class="hurry"><a href="formtester?server=http%3A%2F%2Fformhub.org%2Fformhub_u" title="Check forms on http://formhub.org/formhub_u">Just want to see how it works?</a></div>
				</form>
				<progress style="display: none;"></progress>
				<div id="form-list" class="formlist">
					<ul>
					</ul>
				</div>
			</article>

			<article id="survey-form" class="tab-pane paper">
					<div class="clearfix"><span class="form-language-selector"></span></div>
					<form>no form loaded yet</form>
					<section class="form-footer">
						<div class="main-controls">
							<button id="validate-form" class="btn btn-primary btn-large disabled">
								<i class="glyphicon glyphicon-ok"></i> Validate
							</button>
						</div>
					</section>
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

		</div>
	</div>

	<? require 'elements/footer++.php' ?>
