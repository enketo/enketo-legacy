<? require 'elements/html_start.php' ?>		
		
	<style type="text/css">
		header{display: none;}
		.progress-space{height: 50px; text-align: center;}
		ul{padding: 0; margin: 0;}
		#page{display: none;}
		ul{list-style: none;}
		progress{display: none;}
		input{width: 80%;text-align: center;}
		.input-append{width: 100%; text-align: center;}
	</style>

</head>
<body>
<? 
	if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}
	require 'elements/header.php'; 
	require 'elements/page.php';
?>
	<div class="main">
		<article class="paper">
			<div class="btn-toolbar">
				<div class="input-prepend input-append btn-group">
					<button class="addon btn dropdown-toggle" data-toggle="dropdown">
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu" data-toggle="buttons-radio">	
						<li><a class="url-helper" data-value="http" href="#">http://</a></li>
						<li><a class="url-helper" data-value="https" href="#">https://</a></li>
						<li><a class="url-helper" data-value="formhub" href="#">formhub account</a></li>
					</ul>
					<input id="server_id" type="url" placeholder="" />
					<span class="addon btn btn-primary go"><i class="icon-refresh icon-white"></i></span>
				</div>
			</div>
			<div class="progress-space"><progress></progress></div>
			<div id="form-list"><ul></ul></div>
		</article>
	</div>

<? require 'elements/page_contact.php'; ?>	

<? require 'elements/footer++.php' ?>