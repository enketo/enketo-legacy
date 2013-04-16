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
	
	<div class="main container-fluid paper">
			
		
			<article id="intro" class="tab-pane active">
				<div><h3>enketo</h3> is a collaborative survey application that uses an <a href="https://github.com/martijnr/enketo">open-source</a> form format. Enketo.org is meant for users of <a href="http://opendatakit.org">OpenDataKit</a>. A similar version of enketo is integrated inside <a href="https://formhub.org">formhub.org</a>. Click the key features below to learn more.</div>

				<!--<p>It works <b class="text-info">offline</b>, has <b class="text-info">print-friendly</b> forms, is <b class="text-info">easy to deploy</b> and fits snugly inside a modern, <b class="text-info">flexible</b> information management system.</p>-->
				<ul class="features clearfix">
					<li id="offline-capable"><a class="btn btn-large btn-info" href="#">offline-capable</a></li>
					<li id="print-friendly"><a class="btn btn-large btn-info" href="#">print-friendly</a></li>
					<li id="quick-deploy"><a class="btn btn-large btn-info" href="#">easy to deploy</a></li>
					<li id="open-source"><a class="btn btn-large btn-info" href="#">open format</a></li>
				</ul>
				<section class="features-detail">
					<p class="alert offline-capable">
					Enketo webforms become available offline after they have been opened once (a copy is stored inside the browser). Enketo also safely stores data in the browser and uploads records automatically (e.g. to formhub) when the user is connected to the Internet. Only after a successful upload, the data is deleted from the browser. Users can safely close the browser or laptop and work for weeks (or months) without an Internet connection! Whenever a new version of the form or application is available it will automatically updated when the user is online.
					</p>
					<p class="alert print-friendly">
					Enketo automatically produces a print-friendly version of your form. This facilitates old-school data collection (and modern data entry) without the need to maintain a separate print-version of the form. 
					</p>
					<p class="alert quick-deploy">
					Enketo only requires a modern browser to run. It can therefore be deployed by users very quickly on pretty much any laptop or desktop and is becoming quite usable on mobile devices as well.
					</p>
					<p class="alert open-source">
					Due to its openness and compatibility with a popular standard, it is relatively easy to integrate enketo into existing OpenRosa systems as was done in <a href="http://formhub.org">formhub.org</a>. Moreover, the beauty of using a popular open-source form format is that users can pick-and-choose the best components to create a flexible information management system that can <em>move with the times</em>. 
					</p>
				</section>
				
				<img src="/images/ss.jpg" alt="screenshot" /><br /><br />

				<button class="test btn btn-primary btn-large">test your form</button>
				<button class="launch btn btn-primary btn-large">launch your survey</button>


				<h3>Sample Forms</h3>
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
					<span class="counter">343</span> forms launched so far on enketo.org and enketo.formhub.org combined!
				</p>
			</article>

	</div>

	<article id="about" class="page" data-display="?">
		<h3>What is this?</h3>
		 <? require_once 'elements/about_standalone_snippet.php';?>
	</article>

<? require 'elements/footer++.php' ?>

