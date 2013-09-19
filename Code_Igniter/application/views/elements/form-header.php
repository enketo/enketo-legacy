<div class="form-header clearfix">
	<? 	
		$this->load->helper('subdomain');
		$subd = get_subdomain();
		$subdot = (!empty($subd)) ? $subd.'.' : '';
		$link = (!$integrated) ? str_replace($subdot, '', full_base_url()) : 
			((empty($return_url)) ? $this->config->item('integration_with_url') : $return_url );
	?>
	<a class="branding" href="<?= $link ?>" title="Go Back">
	<? if (!empty($logo_url)): ?>
		<img src="<?= $logo_url ?>" alt="logo" />
	<? endif; ?>
	</a>
	<div class='offline-enabled hide'>
		<div class='offline-enabled-icon' title="This form is able to launch offline"></div>
		<div class='queue-length' title="Records Queued - Click to Backup to File">34</div>
	</div>
	<button onclick="return false;" class="print"><img src="/images/print.png" alt="print button" title="Print Form"/></button>
	<span class="form-language-selector"><span>Choose Language</span></span>
</div>