<? 	
	require 'elements/html_start.php'; 
?>
		
	</head>
	<body>
			
	<? require 'elements/dialogs.php'; ?>
		<div class="main preview">
			<h3 class="preview-header">Preview</h3>
			<article class="paper" >
				<? include_once 'elements/form-header.php'; ?>
				<progress></progress>
				<?= $form ?>
				<? include_once 'elements/form-footer.php'; ?>
			</article>
		</div>
	<? if (!$integrated) { require 'elements/ads.php'; } ?>

	<? require 'elements/footer++.php' ?>
