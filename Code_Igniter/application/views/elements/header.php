<header class="navbar navbar-inverse navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container-fluid">
			<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
            	<span class="icon-bar"></span>
            	<span class="icon-bar"></span>
            	<span class="icon-bar"></span>
          	</a>
          	<!--<span class="offline-capable">offline-capable</span>-->
			<a class="brand" href="/">
				 <!--<img src="images/title.png" alt="enketo" />-->enketo <span class="component"><?= $title_component ?></span>
			</a>
			<!--<div id="survey-info">provided by Aid Web Solutions</a></div>
			<div id="status">
				<span id="status-connection" title=""></span>
				<span id="status-editing" title=""></span>
				<span id="status-upload" title=""></span>
			</div>-->
			
			<nav class="nav-collapse collapse">
			    <ul class="nav">
			    <? $integration_url = $this->config->item('integration_with_url'); ?>
			    <? if (empty($integration_url)): ?>
			    	<? if ($title_component !== 'form-tester'): ?>
			    		<li><a href="/formtester" title="form-tester">form-tester</a></li>
			    	<? endif; ?>
			    	<? if ($title_component !== 'forms'): ?>
			    		<li><a href="/forms" title="forms">forms</a></li>
			    	<? endif; ?>
			    <? endif; ?>
			    </ul>
			</nav>
		</div>		
	</div>	
</header> 

