<? 	
	require 'elements/html_start.php'; 
?>
		<script type="text/javascript">
			settings['returnURL'] = '<?= $return_url ?>';
			settings['showBranch'] = true;
		</script>
		
	</head>
	<body>
	<? if (ENVIRONMENT === 'production'){include_once 'elements/tracking.php';}?>
		
		<header class="navbar navbar-inverse navbar-fixed-top" style="height: 0;"></header>
			
	<? require 'elements/dialogs.php'; ?>

		<div class="main">
			<h3>Form Preview</h3>
			<article class="paper" >
				<? include_once 'elements/form-header.php'; ?>
				<progress></progress>
				<?= $form ?>
				<button id="validate-form" class="btn btn-primary btn-large" disabled="disabled"><i class="icon-ok icon-white"></i> Validate</button>
				<? include_once 'elements/enketo-power.php'; ?>
			</article>
		</div>

		

	<? require 'elements/footer++.php' ?>