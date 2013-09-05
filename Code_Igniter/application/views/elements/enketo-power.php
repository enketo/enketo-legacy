<?// quick and dirty check for whether logo is an enketo logo...?>
<? if(empty($logo_url) || strpos($logo_url, 'enketo') === FALSE): ?>
	<div class="enketo-power">Powered by <a href="http://enketo.org" title="enketo.org website">
		<img src="/images/enketo_bare_100x37.png" alt="enketo logo" /></a>
	</div>
<? endif; ?>