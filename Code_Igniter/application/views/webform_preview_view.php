<? 	
	require 'elements/html_start.php'; 
?>
		<script type="text/javascript">
			settings['returnURL'] = '<?= $return_url ?>';
			settings['showBranch'] = true;
		</script>
		
	</head>
	<body>
			
	<? require 'elements/dialogs.php'; ?>
		<h3 class="preview">Form Preview</h3>
		<div class="main">
			<article class="paper" >
				<? include_once 'elements/form-header.php'; ?>
				<progress></progress>
				<?= $form ?>
				<button id="validate-form" class="btn btn-primary btn-large" disabled="disabled"><i class="icon-ok icon-white"></i> Validate</button>
				<? include_once 'elements/enketo-power.php'; ?>
			</article>
		</div>

		

	<? require 'elements/footer++.php' ?>