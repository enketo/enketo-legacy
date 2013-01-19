<div class="form-header clearfix">
	<? 	$this->load->helper('subdomain');
		$link = (!$integrated) ? str_replace(get_subdomain().'.', '', full_base_url()) : (empty($return_url)) ? $this->config->item('integration_with_url') : $return_url; ?>
	<a class="branding" href="<?= $link ?>" title="Go back"><?= $brand ?></a>
	<button onclick="return false;" class="print"><img src="/images/print.png" alt="print button" title="Print Form"/></button>
	<span class="form-language-selector"><span>Choose Language</span></span>
</div>