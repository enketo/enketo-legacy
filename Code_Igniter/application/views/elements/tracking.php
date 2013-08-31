<? 
	$this->load->helper('url');
	$url = substr(base_url(), strpos(base_url(), "://")+3, -1); 
	$url_parts = preg_split("/\./", $url);
	log_message('debug', 'url parts (need 2!):'.json_encode($url_parts));
	$tracking_url = $url_parts[count($url_parts)-2].'.'.$url_parts[count($url_parts)-1];
?>
		<script type="text/javascript">

			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', '<?= $this->config->item("google_analytics_key") ?>']);
			_gaq.push(['_setDomainName', '<?= $tracking_url ?>']);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();

		</script>
  