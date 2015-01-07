<? require APPPATH.'views/elements/html_start.php'; ?>
	<body>
		<div class="main">
			<article class="paper" >
				
				<?= form_open('authenticate'); ?>
					<h3>Log In <? if(!empty($form_id)): ?>for form "<?= $form_id ?>"<? elseif(!empty($server_url)): ?> for "<?= $server_url ?>"<? endif;?></h3>
					<p>Use the credentials provided to you by the Survey Administrator to obtain access.<p>
					<p class="or-hint" style="font-style:italic; font-size: 12px;">Note that these are the credentials set on the Form Server (i.e. Aggregate, Formhub, or SurveyCTO).</p>
					<? $errors = validation_errors(); ?>
					<? if(!empty($errors)): ?>
					<div class="alert alert-danger">
						<?= $errors; ?>
					</div>
					<? endif; ?>
					<input type="hidden" name="form_id" value="<?= $form_id ?>"/>
					<input type="hidden" name="server_url" value="<?= isset($server_url) ? $server_url : ''; ?>"/>
					<input type="hidden" name="return" value="<?= isset($return) ? $return : base_url(); ?>"/>
					<label class="question">
						<span class="active">user name</span>
						<span class="required">*</span>
						<br/>
						<input name="username" type="text" required="required" />
					</label>
					<label class="question">
						<span class="active">password</span>
						<span class="required">*</span>
						<br/>
						<input name="password" type="password" required="required"/>
					</label>
					<!--<label>Remember login on this computer?<input name="remember" type="checkbox" style="margin-left: 0;" /></label>-->
					
					<button id="submit-form" type="submit" class="btn btn-primary btn-large" style="margin: 30px auto; width: 150px; display: block;" >Log in</button>

					<div style="margin-top: 30px; margin-bottom: -20px;">Username and password are remembered for 7 days after the last (online) use.</div>
				</form>
			</article>
		</div>
	</body>
</html>
