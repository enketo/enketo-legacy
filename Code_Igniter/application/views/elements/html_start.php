<!DOCTYPE html>

<!-- An offline-capable survey application suite (c) Aid Web Solutions -->

<html lang="en" <?= (isset($offline) && $offline) ? 'manifest="manifest/html5"' : '' ?> class="no-js">
	<head>
		<title>
			 Enketo - Faster Assessments (Offline)
		</title>
		
		
		<link rel="icon" type="image/png" href="images/favicon.png">
		
		<meta charset="utf-8" />
		
		<!--[if lt IE 8]>
        	<script type="text/javascript">window.location = 'modern_browsers';</script>
		<![endif]-->