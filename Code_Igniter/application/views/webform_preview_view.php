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
				<section class="form-footer">
					<div class="main-controls">
						<button id="validate-form" class="btn btn-primary btn-large" disabled="disabled"><i class="glyphicon glyphicon-ok"></i> Validate</button>
					</div>
					<? include_once 'elements/enketo-power.php'; ?>
					<? include 'elements/logout.php'; ?>
				</section>
			</article>
		</div>
	<? if (!$integrated) { require 'elements/ads.php'; } ?>


		

	<? require 'elements/footer++.php' ?>
