	<header class="navbar navbar-inverse navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container-fluid">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>
				<div class="branding">
					<a href="/">
					 <img src="private_media/images/enketo_bare_white_150x56.png" alt="enketo logo" />
					</a>
					<span class="component"><?= $title_component ?></span>
				</div>
				<nav class="nav-collapse collapse">
				    <ul class="nav">
				    <? if (!($this->config->item('integrated'))): ?>
				    	<li class="<?= ($title_component == 'forms') ? 'active': '' ?>">
				    		<a href="/forms" title="forms">forms</a>
				    	</li>
				    	<li class="<?= ($title_component == 'form-tester') ? 'active': '' ?>">
				    		<a href="/formtester" title="form-tester">tester</a>
				    	</li>
				    <? endif; ?>
				    </ul>
				</nav>
			</div>		
		</div>	
	</header> 

