	<section class="form-footer">
		<label class="draft question"><span class="option-label">this is a draft</span><input class="ignore" type="checkbox" name="draft"/></label>
		<button id="<?= (!empty($return_url)) ? 'submit-form-single' : 'submit-form' ; ?>" class="btn btn-primary btn-large" ><i class="icon-ok icon-white"></i> Submit</button>
		<? include_once 'enketo-power.php'; ?>
		<? include 'logout.php'; ?>
	</section>

