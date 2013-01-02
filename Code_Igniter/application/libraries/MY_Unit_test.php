<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Extending native CI Unit_test library
 */
class MY_Unit_test extends CI_Unit_test {

	/**
	 * Generate a report
	 *
	 * Displays a table with the test data
	 *
	 * @access	public
	 * @return	string
	 */
	function report($result = array())
	{
		if (count($result) == 0)
		{
			$result = $this->result();
		}

		$CI =& get_instance();
		$CI->load->language('unit_test');

		$this->_parse_template();

		$r = '';
		foreach ($result as $res)
		{
			$table = '';

			foreach ($res as $key => $val)
			{
				if ($key == $CI->lang->line('ut_result'))
				{
					if ($val == $CI->lang->line('ut_passed'))
					{
						$val = '<span style="color: #0C0;">'.$val.'</span>';
					}
					elseif ($val == $CI->lang->line('ut_failed'))
					{
						$val = '<span style="background: #F2DEDE; color: #B94A48; display: block;">'.$val.'</span>';
					}
				}

				$temp = $this->_template_rows;
				$temp = str_replace('{item}', $key, $temp);
				$temp = str_replace('{result}', $val, $temp);
				$table .= $temp;
			}

			$r .= str_replace('{rows}', $table, $this->_template);
		}

		return $r;
	}
}