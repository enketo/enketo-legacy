	<header class="navbar navbar-fixed-top">
		<div class="navbar-inner">
			<div class="container">
				<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</a>
				<div class="brand">
					<a href="/">
						<? $logo_src = (file_exists(FCPATH.'private_media/images/logo-black.png')) ? 'private_media/images/logo-black.png' : 'images/logo-black.png' ?>
						<img class="navbar-logo" src="<?= $logo_src ?>" alt="logo" />
					</a>
				</div>
				<nav class="nav-collapse collapse">
				    <ul class="nav">
				    <? if (!($this->config->item('integrated'))): ?>
				    	<li>
				    		<a href="https://accounts.enketo.org" title="account">Plans</a>
				    	</li>
				    	<li>
				    		<a href="http://blog.enketo.org" title="blog">Blog</a>
				    	</li>
				    	<li class="<?= ($title_component == 'forms') ? 'active': '' ?>">
				    		<a href="/forms" title="forms">Forms</a>
				    	</li>
				    	<li class="<?= ($title_component == 'form-tester') ? 'active': '' ?>">
				    		<a href="/formtester" title="form-tester">Tester</a>
				    	</li>
				    	<li>
				    		<a class="highlight" href="https://accounts.enketo.org/signup/">Sign Up</a>
				    <? endif; ?>
				    </ul>
				</nav>
				<nav class="nav-collapse collapse pull-right">
					<ul class="nav">
					<? if ($title_component == 'home' && !($this->config->item('integrated'))): ?>
						<li>
							<a href="https://accounts.enketo.org/login/">Log In</a>
						</li>
					<? endif ?>
					</ul>
				</nav>
			</div>		
		</div>	
	</header> 

