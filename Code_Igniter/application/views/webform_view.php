<? 	
	require 'elements/html_start.php'; 
?>
		<script type="text/javascript">
			var modelStr = <?= $form_data ?>;
		<? if (!empty($form_data_to_edit)): ?>
			var instanceStrToEdit = <?= $form_data_to_edit ?>;
		<? endif; ?>
		<? if (!empty($return_url)): ?>
			settings['returnURL'] = '<?= $return_url ?>';
		<? endif; ?>
		</script>
	
	


		</head>
	<body class="clearfix<?= (!empty($iframe)) ? ' iframe' : '' ?><?= (!empty($edit)) ? ' edit' : '' ?>">
		
	<? require 'elements/dialogs.php'; ?>
	<? if (empty($return_url)) { require 'elements/side-slider.php'; } ?>
		<div class="main">
			<article class="paper" >
				<? include_once 'elements/form-header.php'; ?>
				<?= $form ?>
				<? include_once 'elements/form-footer.php'; ?>
			</article>
		</div>

	<? require 'elements/footer++.php' ?>
