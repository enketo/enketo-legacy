<? require 'elements/html_start.php' ?>		

</head>
<body>
<? 
	require 'elements/header.php'; 
	require 'elements/page.php';
	require 'elements/dialogs.php';
?>
	<!--<article id="launch" class="page" data-title="Test &amp; Launch area" data-ext-link="/launch"></article>
	<article id="blog" class="page" data-title="Blog" data-ext-link="http://blog.enketo.org/tag/enketo"></article>-->
	
	<div class="main container-fluid paper tabbable tabs-top">
			
		<ul class="nav nav-tabs">
			<li class="active"><a href="#intro" data-toggle="tab">Intro</a></li>
			<li><a href="#build" data-toggle="tab">Build</a></li>
			<li><a href="#test" data-toggle="tab">Test</a></li>
			<li><a href="#deploy" data-toggle="tab">Deploy</a></li>
			<li><a href="#samples" data-toggle="tab">Samples</a></li>
		</ul>

		<div class="tab-content">
			<article id="intro" class="tab-pane active">
				<div><h3>enketo</h3> is a free collaborative survey application that uses an open-source form format. Click the key features below to learn more.</div>

				<!--<p>It works <b class="text-info">offline</b>, has <b class="text-info">print-friendly</b> forms, is <b class="text-info">easy to deploy</b> and fits snugly inside a modern, <b class="text-info">flexible</b> information management system.</p>-->
				<ul class="features clearfix">
					<li id="offline-capable"><a class="btn btn-large btn-info" href="#">offline-capable</a></li>
					<li id="print-friendly"><a class="btn btn-large btn-info" href="#">print-friendly</a></li>
					<li id="quick-deploy"><a class="btn btn-large btn-info" href="#">easy to deploy</a></li>
					<li id="open-source"><a class="btn btn-large btn-info" href="#">open format</a></li>
				</ul>
				<section class="features-detail">
					<p class="alert alert-success offline-capable">
					When a form has been opened once online, it becomes available offline (a copy is kept is kept inside the browsers). Enketo also safely stores entered data in the browser and uploads records automatically (e.g. to formhub) when the user is connected to the Internet. Only after a successful upload, the data is deleted from the browser. A user can safely close the browser or laptop and work for weeks (or months) without an Internet connection! Whenever a new version of the form or application is available it will automatically updated when the user is online.
					</p>
					<p class="alert alert-success print-friendly">
					Enketo facilitates old-school data collection (and modern data entry) with pen and paper without the need to maintain a separate print-version of the form. 
					</p>
					<p class="alert alert-success quick-deploy">
					Enketo only requires a modern browser to run. It can therefore be deployed by users very quickly on pretty much any laptop or desktop and is becoming quite usable on mobile devices as well.
					</p>
					<p class="alert alert-success open-source">
					Due to its openness and compatibility with a popular standard, it is relatively easy to integrate enketo into existing OpenRosa systems as was done in <a href="http://formhub.org">formhub.org</a>. Moreover, the beauty of using a popular open-source form format is that users can pick-and-choose the best components to create a flexible information management system that can <em>move with the times</em> and does not get you hooked on a particular tool.
					</p>
				</section>
				
				<img src="/images/ss.jpg" alt="screenshot" /><br /><br />
				<div class="alert">Enketo is fully integrated into <a href="http://formhub.org" title="go to the formhub website">formhub.org</a>. If you are a formhub user, or are new to this form format, that would be an excellent place to start!</div>

			</article>
			<article id="build" class="tab-pane">
				<h3>Design and Build your form</h3> 
				<p>One of the benefits of using a popular open-source form format, is that there are a variety of tools available. For building your form, these are some readily available tools:</p>
				<ul>
					<li class="clearfix">
						<a href="http://build.opendatakit.org"><img src="/images/builder_ODK.png" alt="ODK Build"/></a>
						<div class="description">
							<a href="http://build.opendatakit.org">ODK Build</a>
							<span class="advice">
								Easiest and nicest-looking tool to use, but not so suitable for complex surveys. Forms created with this tool cannot be deployed in formhub.
							</span>
						</div>
					</li>
					<li class="clearfix">
						<a href="http://formhub.org/syntax"><img src="/images/builder_formhub.png" alt="formhub" /></a>
						<div class="description">
							<a href="http://formhub.org/syntax">Formhub</a> and <a href="http://opendatakit.org/use/xlsform/">XLS Forms</a>
							<span class="advice">
								Recommended, as it offers a good combination of ease of use and ability to create complex forms. Formhub is managed by a Modilabs at Columbia University.
							</span>
						</div>
					</li>
					<li class="clearfix">
						<a href="http://www.commcarehq.org"><img src="/images/builder_commcare.png" alt="CommcareHQ"/></a>
						<div class="description">
							<a href="http://www.commcarehq.org">CommCareHQ</a>
							<span class="advice">
								The form builder (Vellum) is part of a full-fledged information management system by one of the creators and maintainers of the OpenRosa form format (Dimagi). 
							</span>
						</div>
					<li class="clearfix">
						<a href="https://bitbucket.org/javarosa/javarosa/wiki/xform-jr-compat"><img src="/images/builder_xml.png" alt="XML coding by hand" /></a>
						<div class="description">
							<a href="https://bitbucket.org/javarosa/javarosa/wiki/xform-jr-compat">Coding by hand in XML</a>
							<span class="advice">
								For XML and XForm gurus but it is not really recommended for any one else.
							</span>
						</div>
					</li>
					<li class="clearfix">
						<a href="http://www.kobotoolbox.org/koboform/"><img src="/images/builder_kobo.png" alt="KoboForms" /></a>
						<div class="description">
							<a href="http://www.kobotoolbox.org/koboform/">KoboForm</a>
							<span class="advice">
								This app could be a good choice for users that require features that are not available in ODK or formhub.
							</span>
						</div>
					</li>
				</ul>
			</article>

			<article id="test" class="tab-pane">
				<h3>Test your survey</h3>
				<p>A convenient way to do this if you have already selected a server is at <a href="/formtester">enketo.org/formtester</a> or by entering enter your server url in the field below.</p>

				<div class="error-msg text-error"></div>
				<div class="btn-toolbar">
					<div class="input-prepend input-append btn-group">
						<button class="btn dropdown-toggle" data-toggle="dropdown">
							<span class="caret"></span>
						</button>
						<button id="url-helper-selected" class="btn"></button>
						<ul class="dropdown-menu" data-toggle="buttons-radio">	
							<li><a class="url-helper" data-value="http" href="#">http://</a></li>
							<li><a class="url-helper" data-value="https" href="#">https://</a></li>
						</ul>
						<input class="" type="url" placeholder="" />
						<span class="addon btn btn-primary go">Go</span>
					</div>
				</div>
				<div class="alert alert-info">
					The enketo form-tester can also load XML files. However, in order to launch your survey it needs to be hosted on a server first. See the next page for details.</div>
			</article>

			<article id="deploy" class="tab-pane">
				<h3>Deploy your survey</h3>
				<p>To deploy a survey you'll first have to choose a server and upload your form. Apart from serving your form it will also receive and manage the survey data. There are basically two choices: <a href="http://formhub.org">formhub</a> and <a href="http://opendatakit.org/use/aggregate/">ODK Aggregate</a>. Both products are open-source and under active development.</p>
				<p>To collect data in the field we recommend using on of these two excellent tools: enketo and ODK collect. You can deploy a form with enketo from within the <a href="/forms" title="enketo forms">forms area</a> with the click of a button. For ODK Collect refer to the <a href="http://opendatakit.org" title="link to ODK website/use/collect">ODK Collect page on ODK website</a> and the <a href="https://play.google.com/store/apps/details?id=org.odk.collect.android" title="link to ODK Collect on Google Play">Google Play Store</a>.

				<div class="alert alert-info">If you are using <a href="http://formhub.org">formhub</a> you can skip this step and instead launch from within the formhub interface (select "Enter Webform") and share the link.</div>

				<table class="table table-bordered clients">
					<tr><th></th><th>enketo</th><th>ODK Collect</th></tr>
					<tr><td>larger text entry</td><td><i class="icon-ok"></i></td><td>(one line)</td></tr>
					<tr><td>photos, videos, sound entry</td><td>(coming)</td><td><i class="icon-ok"></i></td></tr>
					<tr><td>sketch, signature, barcode entry</td><td></td><td><i class="icon-ok"></i></td></tr>
					<tr><td>gps coordinates on the spot</td><td><i class="icon-ok"></i></td><td><i class="icon-ok"></i></td></tr>
					<tr><td>direct data entry on Android mobile</td><td>(improving)</td><td><i class="icon-ok"></i></td></tr>
					<tr><td>printing a form and using pen + paper for primary data collection</td><td><i class="icon-ok"></i></td><td></td></tr>
					<!--<tr><td>technical requirements</td><td><i class="icon-ok"></i></td><td></td></tr>-->
					<tr><td>ease and speed of deployment</td><td><i class="icon-ok"></i></td><td></td></tr>
					<tr><td>deal with intermittent internet, work offline</td><td><i class="icon-ok"></i></td><td><i class="icon-ok"></i></td></tr>
				</table>
			</article>

			<article id="samples" class="tab-pane">
				<h3>Sample Forms</h3>
				The form format allows <em>very complex</em> forms to be constructed with widgets, branches, repeatable questions, and multiple languages. For all the form building tools there are active Google Groups available to help you build your form. Checkout these sample forms below.
				<table class="table table-bordered forms">
					<tr><th>form</th><th>description</th><th>author</th><th>src</th><th>src</th></tr>
					<tr>
						<td><a href="http://widgets.enketo.org/webform">Widgets</a></td>
						<td>showcases the different available widgets.</td>
						<td>ODK, Modilabs</td>
						<td><a href="http://formhub.org/formhub_u/forms/widgets/form.xls">xls</a></td>
						<td><a href="http://formhub.org/formhub_u/forms/widgets/form.xml">xml</a></td>
					</tr>
					<tr>
						<td><a href="http://wfl69.enketo.org/webform">S.E.L.F. Study</a></td>
						<td>a form with complex skip logic and advanced features.</td>
						<td>Erwin Olario</td>
						<td><a href="http://formhub.org/enketo/forms/term/form.xls">xls</a></td>
						<td><a href="http://formhub.org/enketo/forms/term/form.xml">xml</a></td>
					</tr>
				</table>
				<p class="form-count alert alert-info">
					<em class="counter">343</em> forms have been launched so far on enketo.org and enketo.formhub.org combined!
				</p>
			</article>

		</div>
	</div>

	<article id="about" class="page">
		<p>
			The enketo open-source project is a joint effort by Aid Web Solutions and Modilabs. Enketo.org is a stand-alone application hosted by Aid Web Solutions primarily for the benefit of ODK Aggregate users. A separate version of enketo is available on <a href="http://formhub.org">formhub.org</a> and is fully integrated with formhub.  
		</p>
		<p>
			Please write 
			<a href="mailto:<?= $this->config->item('support_email') ?>"><?= $this->config->item('support_email') ?></a> 
			for any comments, questions or bug reports or use the <a href="https://groups.google.com/forum/?fromgroups#!forum/enketo">Google Groups Forum</a> so others can benefit from the discussion too.
		</p>
	</article>

<? require 'elements/footer++.php' ?>

