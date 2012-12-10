/**
 * @preserve Copyright 2012 Martijn van de Rijdt
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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


	