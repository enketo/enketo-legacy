<? 	
	require 'elements/html_start.php'; 
?>
		<script type="text/javascript">
			var jrDataStr = <?= $form_data ?>;
		</script>
	
	


	</head>
	<body>
	<? if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}?>

		




		<header class="navbar navbar-inverse navbar-fixed-top" style="height: 0;"></header>
		
	<? require 'elements/dialogs.php'; ?>

		<div class="main">
			<article class="paper" >
				<? include_once 'elements/form-header.php'; ?>
				<?= $form ?>	
				<button id="submit-form" class="btn btn-primary btn-large" ><i class="icon-ok icon-white"></i> Submit</button>
				<? include_once 'elements/enketo-power.php'; ?>
			</article>
		</div>

		<? require 'elements/status.php'; ?>	

	<? require 'elements/footer++.php' ?>