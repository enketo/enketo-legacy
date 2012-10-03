<!DOCTYPE html>

<!-- An offline-capable survey application suite (c) Aid Web Solutions -->

<html lang="en" <?= (isset($offline) && $offline) ? 'manifest="manifest"' : '' ?> class="no-js">
	<head>
		<!--<title>
			 enketo - advanced (offline-enabled) web surveys
		</title>-->
		
		
		<link rel="icon" type="image/png" href="images/favicon.png">
		
		<meta charset="utf-8" />
		<meta name="author" content="Martijn van de Rijdt (Aid Web Solutions)" />
		<meta name="copyright" content="2012 (c) Martijn van de Rijdt"/>
		
		<!--[if lt IE 8]>
        	<script type="text/javascript">window.location = 'modern_browsers';</script>
		<![endif]-->