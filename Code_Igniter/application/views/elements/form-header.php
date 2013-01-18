<div class="form-header clearfix">
	<? 	$this->load->helper('subdomain');
		$link = (!$integrated) ? str_replace(get_subdomain().'.', '', full_base_url()) : (empty($return_url)) ? $this->config->item('integration_with_url') : $return_url; ?>
	<a class="branding" href="<?= $link ?>" title="Go Back"><?= $brand ?></a>
	<span class="records" title="Records Queued - Click to Backup to File"><span class="queue-length">0</span></span>
	<button onclick="return false;" class="print"><img src="/images/print.png" alt="print button" title="Print Form"/></button>
	<span class="form-language-selector"><span>Choose Language</span></span>
</div>