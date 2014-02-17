	<section class="form-footer">
		<div class="content">
			<? if ($title_component === 'webform'): ?>
			<fieldset class="draft question"><div class="option-wrapper"><label class="select"><input class="ignore" type="checkbox" name="draft"/><span class="option-label">Save as Draft</span></label></div></fieldset>
			<? endif; ?>
			<button id="<?= ($title_component === 'webform single-submit' || $title_component === 'webform edit') ? 'submit-form-single' : 'submit-form' ; ?>" class="btn btn-primary btn-large" ><i class="glyphicon glyphicon-ok"></i> Submit</button>
			<? include 'logout.php'; ?>
			<? include_once 'enketo-power.php'; ?>
		</div>
	</section>

