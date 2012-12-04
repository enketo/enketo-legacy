<? require 'elements/html_start.php' ?>		

<? 
	$theme = $this->config->item('analyze','themes');
	$min = (ENVIRONMENT === 'production') ? 'min.' : ''; 
?>		
		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/stylesheet.css" />
		
		<script type="text/javascript" src="libraries/jquery.min.js"></script>
		<!--<script type="text/javascript" src="libraries/jquery.mousewheel.min.js"></script>
-->		<script type="text/javascript" src="libraries/jquery-ui/js/jquery-ui.custom.min.js"></script>

		<script type="text/javascript" src="libraries/downloadify/swfobject.js"></script>
		<!--<script type="text/javascript" src="libraries/downloadify/downloadify.min.js"></script>
-->		<script type="text/javascript" src="libraries/modernizr.min.js"></script>
		<!--<script type="text/javascript" src="libraries/gears_init.js"></script>-->
		
		<script type="text/javascript" src="js/common.<?=$min?>js"></script>
		<!--<script type="text/javascript" src="js/storage.<?=$min?>js"></script>-->
		<script type="text/javascript" src="js/form.<?=$min?>js"></script>
		<?= (ENVIRONMENT != 'production') ? '<script type="text/javascript" src="js/debug.js"></script>' : ''?><!-- REMOVE BEFORE PRODUCTION -->
		<!--<script type="text/javascript" src="js/survey.<?=$min?>js"></script>-->
		<script type="text/javascript" src="js/build.<?=$min?>js"></script>
		
		<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>



	</head>

	<? require 'elements/header++.php'; ?>

		<div id="container">
			<article class="main ui-widget">
				<!--<div class="ui-widget">-->
					<div class="ui-widget-content ui-corner-all">
						<?
if (file_exists('test.xml'))
  {
  $xml = simplexml_load_file('test.xml');
  echo json_encode($xml);
  }

else
  {
  exit('Error.');
  }
?>
						
						
						
						
						<p>Here goes the form builder</p>			
					</div>
				<!--</div>	-->
			</article>
		</div>


	<? require 'elements/page_contact.php'; ?>	



		<div id="form-controls" class="bottom ui-widget ui-widget-header">
			<button id="save-form" >Save</button>
			<button id="reset-form" >Reset</button>
			<button id="delete-form" >Delete</button>
		</div>


	<? require 'elements/footer++.php' ?>