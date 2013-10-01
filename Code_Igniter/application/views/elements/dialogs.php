<div id="feedback-bar" class="alert">			
	<i class="icon-info-sign"></i>
	<a href="#" class="close">&times;</a>
</div>

<div id="dialog-alert" class="modal hide fade ">
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

<div id="dialog-confirm" class="modal hide fade">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3></h3>
	</div>
	<div class="modal-body">
		<p class="alert alert-block alert-error"></p>
		<p class="msg"></p>
	</div>
	<div class="modal-footer">
		<span class="self-destruct-timer"></span>
		<button class="negative btn">Close</button>
		<button class="positive btn btn-primary">Confirm</button>
		</div>
</div>

<div id="dialog-save" class="dialog" style="display: none;">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<h3></h3>
	</div>
	<div class="modal-body">
		<form onsubmit="return false;">
			<span class="dialog-msg"></span>
			<span class="dialog-error ui-state-error"></span>
			<label>name:<input name="record-name" type="text"/></label>
			<label><input name="record-final" type="checkbox" value="true"/><span>final</span></label>
		</form>
	</div>
	<div class="modal-footer">
		<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
	</div>
</div>