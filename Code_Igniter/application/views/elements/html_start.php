<!DOCTYPE html>

<!-- An offline-capable survey application suite (c) Aid Web Solutions -->

<html lang="en" <?= (isset($offline) && $offline) ? 'manifest="manifest"' : '' ?> class="no-js">
	<head>
		<title>
			<?= (isset($html_title) && strlen($html_title) > 0) ? $html_title : $title_component ?> - enketo
		</title>
		
		<link rel="icon" type="image/png" href="/images/favicon.png">
		
		<meta charset="utf-8" />
		<meta name="author" content="Martijn van de Rijdt (Aid Web Solutions)" />
		<meta name="copyright" content="2012 (c) Martijn van de Rijdt"/>
		<? $robots = ( !isset($robots) && !empty($_GET['robots']) && $_GET['robots'] == 'true' ) ? 'index, follow' : 'noindex' ?>
		<meta name="robots" content="<?= $robots ?>"/>
		<!--[if lt IE 8]>
        	<script type="text/javascript">window.location = 'modern_browsers';</script>
		<![endif]-->

<? foreach ($stylesheets as $css): ?>
	<link href="<?= $css['href']; ?>" media="<?= $css['media'] ?>" rel="stylesheet" type="text/css" />
<? endforeach; ?>

<? foreach ($scripts as $script): ?>
	<script type="text/javascript" src="<?= $script; ?>"></script>
<? endforeach; ?>