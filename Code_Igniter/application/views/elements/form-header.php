<div class="form-header clearfix">
	<? 	
		$this->load->helper('subdomain');
		$subd = get_subdomain();
		$subdot = (!empty($subd)) ? $subd.'.' : '';
		$link = (!$integrated) ? str_replace($subdot, '', full_base_url()) : 
			((empty($return_url)) ? $this->config->item('integration_with_url') : $return_url );
	?>
	<a class="branding" href="<?= $link ?>" title="Go Back"><?= $brand ?></a>
	<span class="records" title="Records Queued - Click to Backup to File"><span class="queue-length"></span></span>
	<button onclick="return false;" class="print"><img src="/images/print.png" alt="print button" title="Print Form"/></button>
	<span class="form-language-selector"><span>Choose Language</span></span>
</div>