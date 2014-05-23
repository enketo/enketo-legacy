	<section class="form-footer">
		<div class="content">
			<? if ($title_component === 'webform'): ?>
			<fieldset class="draft question"><div class="option-wrapper"><label class="select"><input class="ignore" type="checkbox" name="draft"/><span class="option-label">Save as Draft</span></label></div></fieldset>
			<? endif; ?>

			<div class="main-controls">
				<a class="previous-page disabled" href="#">Back</a>
				<?
					$buttons = array(
						'default' => array(
							'id' => 'submit-form',
							'text' => 'Submit'
						),
						'single' => array(
							'id' => 'submit-form-single',
							'text' => 'Submit'
						),
						'validate' => array(
							'id' => 'validate-form',
							'text' => 'Validate'
						) 
					);
					$button = ($title_component === 'webform single-submit' || $title_component === 'webform edit') ? 'submit-form-single' : 'submit-form' ;
					switch ($title_component) {
    					case 'webform single-submit':
    					case 'webform edit':
        					$button = $buttons['single'];
        					break;
					    case 'webform preview':
					        $button = $buttons['validate'];
					        break;
					    default :
					     	$button = $buttons['default'];
					}
				?>
				<button id="<?= $button['id'] ?>" class="btn btn-primary btn-large" ><i class="glyphicon glyphicon-ok"></i> <?= $button['text'] ?></button>
				<a class="btn btn-primary next-page" href="#">Next</a>
			</div>
			
			<? include 'logout.php'; ?>
			<? include_once 'enketo-power.php'; ?>
			
			<a class="btn btn-default disabled first-page" href="#">Return to Beginning</a>
			<a class="btn btn-default disabled last-page" href="#">Go to End</a>
		</div>
	</section>

