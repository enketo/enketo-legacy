<? require 'elements/html_start.php' ?>		
		
	<style type="text/css">
		.main{
			max-width: 900px;
			line-height: 30px;
		}

		.advice{
			display: block;
			padding: 10px 0;
		}

		#build ul{
			list-style-type: none;
			margin-left: 0;
		}
		#build ul>li{
			padding: 10px 0;
		}
		#build ul>li>a{
			display: block;
			float: left;
			padding: 0 20px 0 0;
		}
		#build img{
			width: 120px;
		}

		.input-prepend .btn.dropdown-toggle{
			float: none;
		}

		#launch .btn-toolbar{
			margin: 30px auto;
		}

		#launch input, #launch .go{
			height: 28px;
		}

		#launch .go{
			padding-top: 7px;
			padding-bottom: 1px;
		}

		table{
			font-size: 80%;
		}

		.table th:not(:first-child), .table td:not(:first-child){
			width: 25%;
			text-align: center;
		}

		.table th:first-child, .table td:first-child{
			text-align: left;
			width: 50%;
		}

	</style>

	<script type="text/javascript">
		$(document).ready(function(){
			$('.url-helper')
				.click(function(){
					var placeholder;
					$(this).parent().addClass('active').siblings().removeClass('active');
					$('#url-helper-selected').attr('data-value', $(this).attr('data-value')).text($(this).text());
					placeholder = ($(this).attr('data-value') === 'formhub') ? 'e.g. martijnr' : 'e.g. formhub.org/martijnr';
					$('#launch input').attr('placeholder', placeholder);
				})
				.andSelf().find('[data-value="https"]').click();

			$('#launch input').change(goToLaunch);

			function goToLaunch(){
				var val = $('#launch input').val();
					type = $('#url-helper-selected').attr('data-value');
					server_url = ( type === 'formhub' ) ? 'https://formhub.org/'+val : type+'://'+val;

				//TODO add isValidUrl() check	
				location.href = '/launch?server='+server_url;
				return false;
			}

			$('[title]').tooltip();
		});
		
	</script>
</head>
<body>
<? 
	if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}
	require 'elements/header.php'; 
	require 'elements/page.php';
?>
	<article id="launch" class="page" data-title="Test &amp; Launch area" data-ext-link="/launch"></article>
	<article id="blog" class="page" data-title="Blog" data-ext-link="http://blog.enketo.org/tag/enketo"></article> 
	
	<div class="main container-fluid paper tabbable tabs-left">
			
		<ul class="nav nav-tabs">
			<li class="active"><a href="#intro" data-toggle="tab">Intro</a></li>
			<li><a href="#build" data-toggle="tab">Build</a></li>
			<li><a href="#launch" data-toggle="tab">Launch</a></li>
			<li><a href="#deploy" data-toggle="tab">Deploy</a></li>
		</ul>

		<div class="tab-content">
			<article id="intro" class="tab-pane active">

				<div class="alert">Enketo is an offline-capable collaborative survey application that uses the OpenRosa form format.</div>
				<img src="/images/ss.jpg" alt="screenshot" /><br /><br />
				<div class="alert">Enketo is fully integrated into <a href="http://formhub.org" title="go to the formhub website">formhub.org</a>. If you are a formhub user, or are new to this ecosystem, that would be an excellent place to start.</div>

			</article>
			<article id="build" class="tab-pane">
				<h3>Step 1: Design and Build your form</h3> 
				<p>One of the benefits of using a popular open-source form format, is that there are a variety of tools available. For building your form, these are some readily available tools:</p>
				<ul>
					<li class="clearfix">
						<a href="http://build.opendatakit.org"><img src="/images/builder_ODK.png" /></a>
						<div class="description">
							<a href="http://build.opendatakit.org">ODK Build</a>
							<span class="advice">
								Easiest tool to use, but not suitable for complex surveys and you cannot deploy these forms in formhub.
							</span>
						</div>
					</li>
					<li class="clearfix">
						<a href="http://formhub.org/syntax"><img src="/images/builder_formhub.png" /></a>
						<div class="description">
							<a href="http://formhub.org/syntax">Formhub</a> and <a href="http://opendatakit.org/use/xlsform/">XLS Forms</a>
							<span class="advice">
								Recommended, as it offers a good combination of ease of use and ability to create complex forms. 
							</span>
						</div>
					</li>
					<li class="clearfix">
						<a href="http://www.commcarehq.org"><img src="/images/builder_commcare.png" /></a>
						<div class="description">
							<a href="http://www.commcarehq.org">CommCareHQ</a>
							<span class="advice">
								The form builder (Vellum) is part of a full-fledged information management system.
							</span>
						</div>
					<li class="clearfix">
						<a href="https://bitbucket.org/javarosa/javarosa/wiki/xform-jr-compat"><img src="/images/builder_xml.png" /></a>
						<div class="description">
							<a href="https://bitbucket.org/javarosa/javarosa/wiki/xform-jr-compat">Coding by hand in XML</a>
							<span class="advice">
								For XML and XForm gurus but it is not really recommended for any one else.
							</span>
						</div>
					</li>
					<li class="clearfix">
						<a href="http://www.kobotoolbox.org/koboform/"><img src="/images/builder_kobo.png" /></a>
						<div class="description">
							<a href="http://www.kobotoolbox.org/koboform/">KoboForm</a>
							<span class="advice">
								This app could be a good choice for users that require features that are not available in ODK or formhub.
							</span>
						</div>
					</li>
				</ul>
			</article>

			<article id="launch" class="tab-pane">
				<h3>Step 2: Test your survey</h3>
				<p>A convenient way to do this if you have already selected a server is at <a href="/launch" title="go to enketo test and launch area">enketo.org/launch</a> or by entering enter your server url in the field below.</p>
				<div class="btn-toolbar">
					<div class="input-prepend input-append btn-group">
						<button class="btn btn-large dropdown-toggle" data-toggle="dropdown">
							<span class="caret"></span>
						</button>
						<button id="url-helper-selected" class="btn btn-large"></button>
						<ul class="dropdown-menu" data-toggle="buttons-radio">	
							<li><a class="url-helper" data-value="http" href="#">http://</a></li>
							<li><a class="url-helper" data-value="https" href="#">https://</a></li>
							<li><a class="url-helper" data-value="formhub" href="#">formhub account</a></li>
						</ul>
						<input class="span5" type="url" placeholder="" />
						<span class="addon btn btn-primary go">Go</span>
					</div>
				</div>
				<div class="alert alert-info">
					The enketo Test &amp; Launch area can also load XML files. However, in order to launch your survey it needs to be hosted on a server first.
				</div>

				<p>A server stores your survey forms and aggregates the data. There are basically two server choices: <a href="http://formhub.org">formhub</a> and <a href="http://opendatakit.org/use/aggregate/">ODK Aggregate</a>. We recommend formhub for speed, user interface and versatility. Both products are under very active development. Upload your form to one of these tools if you haven’t done so already.</p>
			</article>

			<article id="deploy" class="tab-pane">
				<h3>Step 3: Deploy your survey</h3>
				<p>There are at least two excellent tools for deploying your survey, enketo and ODK collect. You can deploy a form on enketo from within the <a href="/launch" title="enketo test &amp; launch area">enketo launch area</a> with the click of a button. For ODK Collect refer to the <a href="http://opendatakit.org" title="link to ODK website/use/collect">ODK Collect page on ODK website</a> and the <a href="https://play.google.com/store/apps/details?id=org.odk.collect.android" title="link to ODK Collect on Google Play">Google Play Store</a>. The table below highlights the differences so help make the choice. Note that you can also use both tools!</p>

				<div class="alert alert-info">If you are using formhub you can skip this step and instead launch from within the formhub interface (select Enter Webform) and share the link.</div>

				<table class="table table-bordered">
					<thead><tr><th></th><th>enketo</th><th>ODK Collect</th></tr><thead>
					<tr><td>larger text entry</td><td><i class="icon-ok"></i></td><td></td></tr>
					<tr><td>photos, videos, sound entry</td><td></td><td><i class="icon-ok"></i></td></tr>
					<tr><td>gps coordinates on the spot</td><td></td><td><i class="icon-ok"></i></td></tr>
					<tr><td>direct data entry on Android mobile</td><td></td><td><i class="icon-ok"></i></td></tr>
					<tr><td>using pen + paper for data collection, then app for data entry</td><td><i class="icon-ok"></i></td><td></td></tr>
					<tr><td>technical requirements</td><td><i class="icon-ok"></i></td><td></td></tr>
					<tr><td>ease and speed of deployment</td><td><i class="icon-ok"></i></td><td></td></tr>
					<tr><td>deal with intermittent internet, work offline</td><td><i class="icon-ok"></i></td><td><i class="icon-ok"></i></td></tr>
				</table>

			</article>

		</div>
	</div>

<? require 'elements/page_contact.php'; ?>	

<? require 'elements/footer++.php' ?>

