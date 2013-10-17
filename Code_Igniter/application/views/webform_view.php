<? 	
	require 'elements/html_start.php'; 
?>
		<script type="text/javascript">
			var jrDataStr = <?= $form_data ?>;
		<? if (!empty($form_data_to_edit)): ?>
			var jrDataStrToEdit = <?= $form_data_to_edit ?>;
		<? endif; ?>
		<? if (!empty($return_url)): ?>
			settings['returnURL'] = '<?= $return_url ?>';
		<? endif; ?>
		</script>
	
	


		</head>
	<body class="clearfix">
		
	<? require 'elements/dialogs.php'; ?>
	<? if (empty($return_url)) { require 'elements/side-slider.php'; } ?>
		<div class="main">
			<article class="paper" >
				<? include_once 'elements/form-header.php'; ?>
				<?= $form ?>	
				<button id="<?= (!empty($return_url)) ? 'submit-form-single' : 'submit-form' ; ?>" class="btn btn-primary btn-large" ><i class="icon-ok icon-white"></i> Submit</button>
				<? include_once 'elements/enketo-power.php'; ?>
				<? include 'elements/logout.php'; ?>
			</article>
		</div>

	<? require 'elements/footer++.php' ?>