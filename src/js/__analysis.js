/************ Global variables ***************/


// !Document.ready()
/************ Document Ready ****************/
$(document).ready(function() { 
	
	// initialize the GUI object
	gui.init();
	
	$('footer').detach().appendTo('#container');
	
	setTimeout(function(){
		gui.showFeedback('This Analysis component is only about 1% finished', 5);
	}, 1.5 * 1000);
	
	// final setup of GUI object
	gui.setup();
	
	var allDataTable = $('#all-data').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sScrollX": "100%",
		"bScrollCollapse": true
	});

	//	quick and dirty fix
	$(window).resize(function(){
		allDataTable.fnAdjustColumnSizing();
	});
	setTimeout(function(){$(window).trigger('resize')},300);
	
});


// !Global Functions
/************ Global Functions ***************/


	