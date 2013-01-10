<div class="form-header">
	<? 	$this->load->helper('subdomain');
		$link = (!$integrated) ? str_replace(get_subdomain().'.', '', full_base_url()) : (empty($return_url)) ? $this->config->item('integration_with_url') : $return_url; ?>
	<a href="<?= $link ?>" title="Go back">
		<span class="branding"><?= $brand ?></span>
	</a>
	<span id="form-language-selector"></span>
	<button onclick="printO.printForm(); return false" class="print"><img src="/images/print.png" alt="print button" /></button>
</div>