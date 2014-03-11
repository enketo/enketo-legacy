<header class="form-header">
	<? 	
		$this->load->helper('subdomain');
		$subd = get_subdomain();
		$subdot = (!empty($subd)) ? $subd.'.' : '';
		$link = (!$integrated) ? str_replace($subdot, '', full_base_url()) : 
			((empty($return_url)) ? $this->config->item('integration_with_url') : $return_url );
	?>
	<div class='offline-enabled'>
		<? if(!empty($manifest)): ?><div class='offline-enabled-icon not-enabled' title="This form is able to launch offline"></div><? endif; ?><? if (!isset($offline_storage) || $offline_storage ): ?><div class='queue-length side-slider-toggle' title="Records Queued"></div><? endif; ?>
	</div>
	<div class="form-progress" ></div>
	<a class="branding" href="<?= $link ?>" title="Go Back">
	<? if (!empty($logo_url)): ?>
	<div class="logo-wrapper">
		<img src="<?= $logo_url ?>" alt="logo" />
	</div>
	<? endif; ?>
	</a>
	<button onclick="return false;" class="print" title="Print this Form"> </button>
	<span class="form-language-selector hide"><span>Choose Language</span></span>
</header>
