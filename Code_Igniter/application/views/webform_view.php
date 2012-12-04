<? 	
	require 'elements/html_start.php'; 
?>
		<script type="text/javascript">
			var jrDataStr = '<?= $form_data ?>';
			var supportEmail = '<?= $this->config->item("support_email") ?>';
		</script>
	
	


	</head>
	<body>
	<? if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}?>

		




		<header style="height: 0;"></header>
		
	<? require 'elements/dialogs.php'; ?>

		<div class="main">
			<article class="paper" >
				<?= $form ?>	
				<button id="submit-form" class="btn btn-primary btn-large" ><i class="icon-ok icon-white"></i> Submit</button>
			</div>
		</article>

		<? require 'elements/status.php'; ?>	

		<div id="branding">
			<a href="http://aidwebsolutions.com" target="_blank">enketo forms</a> for <a href="http://formhub.org" target="_blank">formhub</a>
		</div>

	<? require 'elements/footer++.php' ?>