<? 	
	require 'elements/html_start.php'; 
	$this->load->helper('subdomain'); 
?>
	<title><?= $html_title ?> - enketo</title>

	<? foreach ($stylesheets as $css): ?>
		<link href="<?= $css; ?>" media="screen" rel="stylesheet" type="text/css" />
	<? endforeach; ?>

	<link href="../css/print.css" media="print" rel="stylesheet" type="text/css" />

	<? foreach ($scripts as $script): ?>
		<script type="text/javascript" src="<?= $script; ?>"></script>
	<? endforeach; ?>
		
		<script type="text/javascript">
			var jrDataStr = '<?= $form_data ?>';
			var jrDataStrToEdit = '<?= addcslashes($form_data_to_edit, "\\\'\"&\n\r") ?>';
			var RETURN_URL = '<?= $return_url ?>';
		</script>
	
	<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>

	</head>

	<body>
		
		<div id="overlay"></div>
		<header style="height: 0;"></header>
			
		<div id="feedback-bar" class="ui-widget ui-widget-content ui-state-highlight">			
			<span class="ui-icon ui-icon-info" ></span>
			<a href="#" id="feedback-bar-close" class="custom-button" ></a>
		</div>
		
		<div class="dialog" id="dialog-confirm" style="display: none;">
			<p>
				<span class="ui-icon ui-icon-alert"></span>
				<span class="dialog-msg"></span>
			</p>
		</div>
		<div class="dialog" id="dialog-alert" style="display: none;">
			<p>
				<span class="ui-icon ui-icon-alert"></span>
				<span id="dialog-alert-msg"></span>
			</p>
		</div>

		<div class="dialog" id="dialog-save" style="display: none;">
			<p>
				<form onsubmit="return false;">
					<span class="dialog-msg"></span>
					<span class="dialog-error ui-state-error"></span>
					<label>name:<input name="record-name" type="text"/></label>
					<label><input name="record-final" type="checkbox" value="true"/><span>final</span></label>
				</form>
			</p>
		</div>

		<article class="main">
			<div class="form-wrapper" >
				<?= $form ?>
				<button id="submit-edited-data" >Submit</button>
			</div>
		</article>

		<div id="branding">
			<a href="http://aidwebsolutions.com" target="_blank">enketo forms</a> for <a href="http://formhub.org" target="_blank">formhub</a>
		</div>

		<? require 'elements/footer++.php' ?>



