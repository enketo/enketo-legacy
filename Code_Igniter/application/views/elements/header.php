	<header class="navbar navbar-default navbar-fixed-top" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<a class="navbar-brand" href="/">
					<? $logo_src = (file_exists(FCPATH.'private_media/images/logo-black.png')) ? 'private_media/images/logo-black.png' : 'images/logo-black.png' ?>
					<img class="navbar-logo" src="<?= $logo_src ?>" alt="logo" />
				</a>
				<button class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
			</div>
			<nav class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
				<? if (!($this->config->item('integrated'))): ?>
					<li>
						<a href="https://accounts.enketo.org" title="plans">Plans</a>
					</li>
					<li>
						<a href="http://blog.enketo.org" title="blog">Blog</a>
					</li>
					<? if ($title_component === 'forms' || $title_component === 'form-tester'): ?> 
						<li class="<?= ($title_component == 'forms') ? 'active': '' ?>">
							<a href="/forms" title="forms">Forms</a>
						</li>
						<li class="<?= ($title_component == 'form-tester') ? 'active': '' ?>">
							<a href="/formtester" title="form-tester">Tester</a>
						</li>
					<? endif ?>
					<li>
						<a href="http://apidocs.enketo.org" title="API Documentation">API</a>
					<li>
						<a class="highlight" href="https://accounts.enketo.org/signup/">Sign Up</a>
				<? endif; ?>
				</ul>
				<ul class="nav navbar-nav navbar-right">
				<? if ($title_component == 'home' && !($this->config->item('integrated'))): ?>
					<li>
						<a href="https://accounts.enketo.org/login/">Log In</a>
					</li>
				<? endif ?>
				</ul>
			</nav>
		</div>	
	</header> 

