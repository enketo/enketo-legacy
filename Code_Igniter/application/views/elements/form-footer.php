	<section class="form-footer">
		<div class="content">
			<? if ($title_component === 'webform'): ?>
			<fieldset class="draft question"><div class="option-wrapper"><label class="select"><input class="ignore" type="checkbox" name="draft"/><span class="option-label">Save as Draft</span></label></div></fieldset>
			<? endif; ?>

			<div class="main-controls">
				<a class="previous-page disabled" href="#">Back</a>
				<button id="<?= ($title_component === 'webform single-submit' || $title_component === 'webform edit') ? 'submit-form-single' : 'submit-form' ; ?>" class="btn btn-primary btn-large" ><i class="glyphicon glyphicon-ok"></i> Submit</button>
				<a class="btn btn-primary large next-page" href="#">Next</span></a>
			</div>
			
			<? include 'logout.php'; ?>
			<? include_once 'enketo-power.php'; ?>
			
			<a class="btn btn-default disabled first-page" href="#">Return to Beginning</a>
			<a class="btn btn-default disabled last-page" href="#">Go to End</a>
		</div>
	</section>

