
	<body>
		<div id="overlay"></div>
		<header class="ui-widget ui-widget-header">
			<div id="logo">
				 <img src="images/title.png" alt="enketo" /><span id="component"><?= $title_component ?></span>
			</div>
			<div id="survey-info">provided by Aid Web Solutions</a></div>
			<div id="status">
				<span id="status-connection" title=""></span>
				<span id="status-editing" title=""></span>
				<span id="status-upload" title=""></span>
			</div>
			
			<nav>
			    <ul>
			    </ul>
			</nav>
								
		</header> 
			
		<div id="feedback-bar" class="ui-widget ui-widget-content ui-state-highlight">			
			<span class="ui-icon ui-icon-info" ></span>
			<a href="#" id="feedback-bar-close" class="custom-button" ></a>
		</div>
		
		<div id="page" class="ui-widget ui-widget-header">
			<div id="page-content" class="ui-widget ui-corner-all">
				<a href="#" id="page-close" class="custom-button" ></a>
			</div>
		</div>
		
		<div class="dialog" id="dialog-confirm" style="display: none;">
			<p>
				<span class="ui-icon ui-icon-alert"></span>
				<span class="dialog-msg"></span>
			</p>
		</div>
		<div class="dialog" id="dialog-alert" style="display: none;">
			<p>
				<span class="ui-icon ui-icon-alert"></span>
				<span id="dialog-alert-msg"></span>
			</p>
		</div>
