	<section class="form-footer">
		<? if ($title_component === 'webform'): ?>
		<div class="option-wrapper"><label class="draft question"><span class="option-label">this is a draft</span><input class="ignore" type="checkbox" name="draft"/></label></div>
		<? endif; ?>
		<button id="<?= ($title_component === 'webform single' || $title_component === 'webform edit') ? 'submit-form-single' : 'submit-form' ; ?>" class="btn btn-primary btn-large" ><i class="glyphicon glyphicon-ok"></i> Submit</button>
		<? include_once 'enketo-power.php'; ?>
		<? include 'logout.php'; ?>
	</section>

