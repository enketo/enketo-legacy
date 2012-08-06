<?php


class Analyze extends CI_Controller {

	public function __construct()
    {
            parent::__construct();
           
            $this->load->helper('subdomain');
			$this->load->model('Survey_model','',TRUE);     
    }


	public function index()
	{
		$this->load->helper('chart');
		$subdomain = get_subdomain(); //from subdomain helper
				
		if (isset($subdomain) )
		{
		
			if ($this->Survey_model->is_live_survey_data($subdomain))
			{
				$result = $this->Survey_model->get_all_survey_data($subdomain);
				$chart_map = array(
					array('value' => 0, 'label' => 'Low', 'color' =>'66CC00'),
					array('value' => 1, 'label' => 'Quite High', 'color' => 'FF9900'),
					array('value' => 2, 'label' => 'High', 'color' => 'CC6600'),
					array('value' => 3, 'label' => 'Very High', 'color' => '993300'),
					array('value' => 4, 'label' => 'All', 'color' => '660000')
				);			
				
				$data = array(
					'offline'=>FALSE, 
					'title_component'=>'analyze',
					'chart' => array(
						get_chart_url($result,'housesDestroyed','Houses Destroyed', $chart_map),
						get_chart_url($result,'tents','Need For Tents', $chart_map),
						get_chart_url($result,'stoves','Need For Stoves', $chart_map),
						get_chart_url($result,'chimneys','Need For Chimneys', $chart_map)
					),
					'result'=>$result
				);
				
				// remove NULL urls from chart array // TEST THIS
				foreach ($data['chart'] as $key => $value)
				{
					if (!isset($value))
					{
						unset($data['chart'][$key]);
					}
				}
				
				$this->load->view('analyze_view', $data);
			}
			else
			{
				show_error('Survey does not exist, is not yet published or was taken down.', 404);
			}
		}
		else 
		{
			$this->load->view('survey_list_view');
		}
	}


	public function export()
	{
		// Original PHP code by Chirp Internet: www.chirp.com.au
		// modified by Martijn van de Rijdt for us in CodeIgniter

		$subdomain = get_subdomain(); //from subdomain helper
		$result = $this->Survey_model->get_all_survey_data($subdomain);
		
  		function cleanData(&$str)
  		{
  		  $str = preg_replace("/\t/", "\\t", $str);
  		  $str = preg_replace("/\r?\n/", "\\n", $str);
  		  if(strstr($str, '"')) $str = '"' . str_replace('"', '""', $str) . '"';
  		}

  		// file name for download
  		$filename = "survey_data_" . date('Ymd') . ".xls";

  		header("Content-Disposition: attachment; filename=\"$filename\"");
  		header("Content-Type: application/vnd.ms-excel");

  		$flag = false;
 
 		foreach ($result as $row)
 		{
  		  $row = (array)$row; // cast object as array
  		  if(!$flag) {
  		    // display field/column names as first row
  		    echo implode("\t", array_keys($row)) . "\n";
  		    $flag = true;
  		  }
  		  array_walk($row, 'cleanData');
  		  echo implode("\t", array_values($row)) . "\n";
  		}
  	}

}

?>