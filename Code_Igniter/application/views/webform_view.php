<? 	
	require 'elements/html_start.php'; 
	$this->load->helper('subdomain'); 
?>
	<title><?= $html_title ?> - enketo</title>

	<? foreach ($stylesheets as $css): ?>
		<link href="<?= $css; ?>" media="screen" rel="stylesheet" type="text/css" />
	<? endforeach; ?>

	<link href="css/print.css" media="print" rel="stylesheet" type="text/css" />

	<? foreach ($scripts as $script): ?>
		<script type="text/javascript" src="<?= $script; ?>"></script>
	<? endforeach; ?>
		
		<script type="text/javascript">
			var jrDataStr = '<?= $form_data ?>';
		</script>
	
	

	<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>

	</head>
	<body>
		
		<header style="height: 0;"></header>
		
		<? require 'elements/dialogs.php'; ?>

		<div class="main">
			<article class="form-wrapper paper" >
				<?= $form ?>	
				<button id="submit-form" class="btn btn-primary btn-large" ><i class="icon-ok icon-white"></i> Submit</button>
			</div>
		</article>

		<div class="drawer left closed alert-success">
			<div class="handle right"></div>
			<div class="content">
				<span id="status"></span><span>Submissions queued: </span><span id="queue-length">0</span>
				<!--<span id="status-offline-launch"></span>-->
				<button id="drawer-export" class="btn btn-mini">Export</button>
			</div>	
		</div>

		<div id="branding">
			<a href="http://aidwebsolutions.com" target="_blank">enketo forms</a> for <a href="http://formhub.org" target="_blank">formhub</a></div>

		<? require 'elements/footer++.php' ?>