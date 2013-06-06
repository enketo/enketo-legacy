<? require 'elements/html_start.php'; ?>
	<body>
		<div class="main">
			<article class="paper" >
				<h3>Thank you for participating!</h3>
				<br/>
				<p style="text-align:center;"><?= !empty($msg) ? $msg : 'The form was successfully submitted. You can close this window now.'?></p>
			</article>
		</div>
	</body>
</html>