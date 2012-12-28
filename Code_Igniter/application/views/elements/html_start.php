<!DOCTYPE html>

<? $integrated = $this->config->item('integrated'); ?>
<!-- An offline-capable survey application suite (c) Aid Web Solutions -->

<html lang="en" <?= (!empty($manifest)) ? 'manifest="'.$manifest.'"' : '' ?> class="no-js">
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
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<!--[if lt IE 8]>
        	<script type="text/javascript">window.location = 'modern_browsers';</script>
		<![endif]-->



<? foreach ($stylesheets as $css): ?>
	<link href="<?= $css['href']; ?>" media="<?= $css['media'] ?>" rel="stylesheet" type="text/css" />
<? endforeach; ?>

<? foreach ($scripts as $script): ?>
	<script type="text/javascript" src="<?= $script; ?>"></script>
<? endforeach; ?>


<? $maps_dynamic_key = $this->config->item('google_maps_api_v3_key'); ?>
<? $maps_static_key = $this->config->item('google_maps_static_api_key'); ?>
<? $support_email = $this->config->item("support_email") ; ?>
<? $default_server_url_helper = $this->config->item("default_server_url_helper"); ?>
	<script type="text/javascript">
		var settings = {};
<? if (!empty($maps_dynamic_key)): ?>
		settings['mapsDynamicAPIKey'] = '<?= $maps_dynamic_key ?>';
<? endif; ?>
<? if (!empty($maps_static_key)): ?>
		settings['mapsStaticAPIKey'] = '<?= $maps_static_key ?>';
<? endif; ?>
<? if (!empty($support_email)): ?>
		settings['supportEmail'] = '<?= $support_email ?>';
<? endif; ?>
<? if (!empty($default_server_url_helper)): ?>
		settings['defaultServerURLHelper'] = '<?= $default_server_url_helper ?>';
<? endif; ?>
		//settings['autoUpload'] = true;
		settings['modernBrowsersURL'] = 'modern_browsers';
	</script>