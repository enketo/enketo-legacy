<!DOCTYPE html>
<? 	$integrated = $this->config->item('integrated'); 
 	$brand_setting = $this->config->item('brand');
	$brand = (!empty($brand_setting)) ? $brand_setting : 'enketo'; 
?>
<html lang="en" <?= (!empty($manifest)) ? 'manifest="'.$manifest.'"' : '' ?> class="no-js">
	<head>
		<title><?= !empty($html_title) ? $brand.' - '.$html_title : 
			( !empty($title_component) ? 'Enketo - '.$title_component : 'Enketo Smart Paper - Next Generation Webforms' ); 
		?></title>
		
		<link rel="shortcut icon" href="/images/enketo.ico">
		<!-- For third-generation iPad with high-resolution Retina display: -->
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/images/icon_144x144.png">
		<!-- For iPhone with high-resolution Retina display: -->
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/images/icon_114x114.png">
		<!-- For first- and second-generation iPad: -->
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/images/icon_72x72.png">
		<!-- For non-Retina iPhone, iPod Touch, and Android 2.1+ devices: -->
		<link rel="apple-touch-icon-precomposed" href="/images/icon_57x57.png">

		<meta charset="utf-8" />
		<meta name="author" content="Martijn van de Rijdt (Enketo LLC)" />
<? $robots = ( isset($robots) && $robots ) ? 'index, follow' : 'noindex' ?>
		<meta name="robots" content="<?= $robots ?>"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<!--[if lt IE 10]>
        	<script type="text/javascript">window.location = 'modern_browsers';</script>
		<![endif]-->
<? foreach ($stylesheets as $css): ?>
		<link href="<?= $css['href']; ?>" media="<?= $css['media'] ?>" rel="stylesheet" type="text/css" />
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
<? if (!empty($server_url)): ?>
			settings['serverURL'] = '<?= $server_url ?>';
<? endif; ?>
<? if (!empty($form_id)): ?>
			settings['formId'] = '<?= $form_id ?>';
<? endif; ?>
			settings['modernBrowsersURL'] = 'modern_browsers';
<? if (!empty($return_url)): ?>
			settings['returnURL'] = '<?= $return_url ?>';
<? endif; ?>
<? if (!empty($form_data)): ?>				
			var modelStr = <?= $form_data ?>;
<? endif; ?>
<? if (!empty($form_data_to_edit)): ?>
			var instanceStrToEdit = <?= $form_data_to_edit ?>;
<? endif; ?>
		</script>

<? if(isset($scripts)): ?>
<? foreach ($scripts as $script): ?>
<? $data_main = (!empty($script['data-main'])) ? $script['data-main'] : ''; ?>
		<script type="text/javascript" data-main="<?= $data_main; ?>" src="<?= $script['src']; ?>"></script>
<? endforeach; ?>
<? endif; ?>

<? if (ENVIRONMENT === 'production' && $_SERVER['REMOTE_ADDR'] !== '127.0.0.1' ){include_once 'tracking.php';} ?>
