<? 	require 'elements/html_start.php'; ?>

<? 
	$theme = $this->config->item('analyze','themes');
	$min = (ENVIRONMENT === 'production') ? 'min.' : ''; 
?>

		<link rel="stylesheet" type="text/css" href="libraries/jquery-ui/css/<?= $theme ?>/jquery-ui.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/stylesheet.css" />
		
		<script type="text/javascript" src="libraries/jquery.min.js"></script>
		<script type="text/javascript" src="libraries/jquery-ui/js/jquery-ui.custom.min.js"></script>
		<script type="text/javascript" src="libraries/modernizr.min.js"></script>
		
		<script type="text/javascript" src="libraries/DataTables/media/js/jquery.dataTables.js"></script>
		<link rel="stylesheet" type="text/css" href="libraries/DataTables/media/css/demo_table.css" />
		
		<script type="text/javascript" src="js/common.<?=$min?>js"></script>
		<script type="text/javascript" src="js/analysis.<?=$min?>js"></script>
		
		<!-- quick and dirty -->
		<style type="text/css">
			.main .ui-widget-header{
				margin: 3px;
			}
			
			.dataTables_scroll{
				margin: 0 3px;
			}			
			
			.chart{
				width: 45%;
				margin: 1em 2.5%;
				float: left;
			}
		
			/*
			 * jQuery UI specific styling
			 */
			
			.paging_two_button .ui-button {
				float: left;
				cursor: pointer;
				* cursor: hand;
			}
			
			.paging_full_numbers .ui-button {
				padding: 2px 6px;
				margin: 0;
				cursor: pointer;
				* cursor: hand;
			}
			
			.ui-buttonset .ui-button {
				margin-right: -0.1em !important;
			}
			
			.paging_full_numbers {
				width: 350px !important;
			}
			
			.ui-toolbar {
				padding: 5px;
			}
			
			.dataTables_paginate {
				width: auto;
			}
			
			.dataTables_info {
				padding-top: 3px;
			}
			
			table.display thead th {
				padding: 3px 0px 3px 10px;
				cursor: pointer;
				* cursor: hand;
			}
			
			div.dataTables_wrapper .ui-widget-header {
				font-weight: normal;
			}
			
			
			/*
			 * Sort arrow icon positioning
			 */
			table.display thead th div.DataTables_sort_wrapper {
				position: relative;
				padding-right: 20px;
				padding-right: 20px;
			}
			
			table.display thead th div.DataTables_sort_wrapper span {
				position: absolute;
				top: 50%;
				margin-top: -8px;
				right: 0;
			}

		</style>
		
		<? if (ENVIRONMENT === 'production'){include 'elements/tracking.php';}?>
		
	</head>

		<? include 'elements/header++.php'; ?>
		
		<article class="page" id="survey" data-title="survey form" data-ext-link="/" ></article>
		
		<? include 'elements/page_contact.php'; ?>	
		
		<article class="page" id="about" data-title="about this application">
			<p>
			    This application was developed by <a href="http://www.aidwebsolutions.com" title="go to Aid Web Solutions web site" 
			    target=_blank> Aid Web Solutions</a> to demonstrate the potential of offline capable 
			    web applications in humanitarian aid and other situations with intermittent Internet connections. It 
			   	provides all the advantages of a modern web app without the dependency on a constant connection.
			</p>
			<p>
			    This (.analyze) component of the application receives and collates data from the offline-capable (.survey) data entry component of this app. 
			    Quantitive data can be analyzed automatically and the results are available instantly.
			   	Rapaide is meant to be used as a collaboration tool.
			</p>
			<p>	
			    In all modern browsers this application 
			    will be able to <strong>launch</strong> without an internet connection after once having been loaded online. 
			    See under <a href="#settings" title="settings">settings</a> whether your browser supports this.
			</p> 
			<p>
				This is a very early preview version. Any <a href="#contact" title="contact us">feedback</a> is welcome. 
				<!--<a href="http://aidwebsolutions.com/blog" title="go to Aid Web Solutions blog post on Rapaide" target=_blank>
				 More information</a> about the app.-->
			</p>
		
		</article>
		
		<div id="container">
			<article class="main" id="wrap-collation">
				<section class="ui-widget">
					<div class="ui-widget-content ui-corner-all">
						<!--<h3 class="ui-widget-header ui-corner-all">Overview of all data on the server</h3>-->
						<table id="all-data" class="display" >
						
						    <?php 
						    
						    $showFields = true;
						    if($result){
						    
						    	//var_dump($result);
						    	//while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
						    	$i=1;
						    	foreach ($result as $row)
						    	{
						    		if ($showFields==true) {
						    			echo ("<thead><tr>");
						    			foreach ($row as $name => $value){
						    				echo("<th>".$name."</th>");
						    			}
						    			$showFields=false;
						    			echo ('</tr></thead><tbody>');
						    		}
						    		echo ("<tr>");
						    		foreach ($row as $name => $value){
						    			if ($i % 2 !=0){
						    				echo("<td class='odd'> ".htmlspecialchars(stripslashes($value))."</td>");
						    			}
						    			else {
						    				echo("<td> ".htmlspecialchars(stripslashes($value))."</td>");
						    			}
						    		}
						    		echo ("</tr>");
						    		$i++;
						    	}
						    	echo ("</tbody>");
						    	
						    }		
						    ?>
						</table>
					</div>
				</section>
			</article>
			<article class="main" id="wrap-charts">
				<section class="ui-widget">
					<div class="ui-widget-content ui-corner-all">
						<h3 class="ui-widget-header ui-corner-all">Examples of instant analyses of collated data </h3>
						<p class="ui-helper-clearfix">
						<!-- using the Google Chart API to demonstrate how the data could be analyzed easily and instantly -->
						
						<? foreach($chart as $url): ?>
							<img class="chart" src="<?=$url?>" alt="Sample Analysis Chart"/>
						<? endforeach; ?>
							
								<!--				
						echo('<img class="chart" src="'.prepareChartUrl('housesDestroyed','Houses+Destroyed').'" alt="Sample Analysis Chart" />');
						echo('<img class="chart" src="'.prepareChartUrl('tents','Need+For+Tents').'" alt="Sample Analysis Chart" />');
						echo('<img class="chart" src="'.prepareChartUrl('stoves','Need+For+Stoves').'" alt="Sample Analysis Chart" />');
						echo('<img class="chart" src="'.prepareChartUrl('chimneys','Need+For+Chimneys').'" alt="Sample Analysis Chart" />');
*/-->
						
						</p>
					</div>
				</section>
			</article>
			
			
		</div>
					
		
		<div id="form-controls" class="bottom ui-widget ui-widget-header">
			<a id="export-excel" href="analyze/export">Download in Excel Format</a>			
		</div>
		
		
		<? require 'elements/footer++.php'; ?>
		
		
		
		