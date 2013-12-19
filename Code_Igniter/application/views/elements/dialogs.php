<div id="feedback-bar" class="alert alert-warning">			
	<i class="icon-info-sign"></i>
	<button href="#" class="close">&times;</button>
</div>

<div id="dialog-alert" class="modal fade ">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3></h3>
			</div>
			<div class="modal-body">
				<p class=""></p>
			</div>
			<div class="modal-footer">
				<span class="self-destruct-timer"></span>
				<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
			</div>
		</div>
	</div>
</div>

<div id="dialog-confirm" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3></h3>
			</div>
			<div class="modal-body">
				<p class="alert alert-danger"></p>
				<p class="msg"></p>
			</div>
			<div class="modal-footer">
				<span class="self-destruct-timer"></span>
				<button class="negative btn">Close</button>
				<button class="positive btn btn-primary">Confirm</button>
			</div>
		</div>
	</div>
</div>

<div id="dialog-save" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3></h3>
			</div>
			<div class="modal-body">
				<form onsubmit="return false;">
					<span class="alert alert-danger"></span>
					<label class="question">
						<span class="question-label active">Record Name</span>
						<span class="or-hint active">This name allows you to easily find your draft record to finish it later. The record name will not be submitted to the server.</span>
						<input name="record-name" type="text" required="required"/>
					</label>
				</form>
			</div>
			<div class="modal-footer">
				<button class="negative btn">Close</button>
				<button class="positive btn btn-primary">Save &amp; Close</button>
			</div>
		</div>
	</div>
</div>
