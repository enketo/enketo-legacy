<?php

/**
 * Copyright 2012 Martijn van de Rijdt
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

class Webform extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->helper(array('subdomain','url'));
		$this->load->model('Form_model', '', TRUE);
		$this->load->model('Survey_model','',TRUE);
		$this->load->model('Instance_model','',TRUE);
	}

	public function index()
	{
		
		$subdomain = get_subdomain(); //from subdomain helper
		
		if (isset($subdomain))
		{
			//if ($this->Survey_model->is_live_survey($subdomain))
			if ($this->Survey_model->is_launched_survey())
			{
				//$offline = FALSE; //$this ->config->item('application_cache'); //can be overridden here
				$offline = $this->Survey_model->has_offline_launch_enabled();
				$server_url= $this->Survey_model->get_server_url();
				$form_id = $this->Survey_model->get_form_id();

				if ($form_id && $server_url)
				{
					$transf_result = $this->Form_model->transform($server_url, $form_id, FALSE);
					//log_message('debug', $transf_result->asXML());
					//var_dump($transf_result);
					//log_message('debug', 'transform result: '.$transf_result->asXML());
					$form = $transf_result->form->asXML();
					//log_message('debug', $form);
					$form_data = $transf_result->instance->asXML();
					//log_message('debug', $form_data);
					//remove line breaks and tabs
					$form_data = str_replace(array("\r", "\r\n", "\n", "\t"), '', $form_data);

					$html_title = $transf_result->form->xpath('//h2[@id="form-title"]');
					//$form_data = preg_replace("\>/s*",">", $form_data);
					if (strlen($form)>0 && strlen($form_data)>0)
					{
						$data = array(
							'offline'=>$offline, 
							'title_component'=>'webform', 
							'html_title'=>$html_title[0],
							'form'=> $form,
							'form_data'=> $form_data,
							'stylesheets'=> array(
								'libraries/jquery-ui/css/sunny/jquery-ui.custom.css',
								'css/screen.css'
							)
						);
						$common_scripts = array(
							'libraries/jquery.min.js',
							'libraries/jquery-ui/js/jquery-ui.custom.min.js',
							'libraries/jquery-ui-timepicker-addon.js',
							'libraries/jquery.multiselect.min.js',	
							'libraries/modernizr.min.js',
							'libraries/xpathjs_javarosa/build/xpathjs_javarosa.min.js',
							'libraries/FileSaver.min.js',
							'libraries/BlobBuilder.min.js',
							'libraries/vkbeautify.js',
							"http://maps.googleapis.com/maps/api/js?key=".$this->config->item('google_maps_api_v3_key')."&sensor=false"
						);

						//log_message('debug', 'form string: '.$form->asXML());
						if (ENVIRONMENT === 'production')
						{
							//$this->output->cache(60);
							$data['scripts'] = array_merge($common_scripts, array(
								'js-min/webform-all-min.js'
							));
						}
						else
						{		
							$data['scripts'] = array_merge($common_scripts, array(
								'js-source/__common.js',
								'js-source/__storage.js',
								'js-source/__form.js',
								'js-source/__connection.js',
								'js-source/__cache.js',
								'js-source/__survey_controls.js',
								'js-source/__webform.js',
								'js-source/__debug.js'
							));
						}
						$this->load->view('webform_view',$data);
					}
					else
					{
						show_error('Form not available (or an error occurred). It is also possible that "require phone authentication" is switched on in your formhub account (under account settings) which is not supported in enketo yet.', 404);
					}				
				}
				else 
				{
					show_error('Survey not properly launched, missing info in database', 404);
				}
			}
			else
			{
				show_error('Survey does not exist, is not yet published or was taken down.', 404);
			}
		}
		else 
		{
			//$surveys = $this->Survey_model->get_survey_list();
			//log_message('debug', 'surveys: '.json_encode($surveys));
			$data = array('offline'=>FALSE, 'title_component'=>'');//, 'surveys' => array());
			//if (isset($surveys) && $surveys !== FALSE)
			//{
				//$data['surveys'] = $surveys);					
			//}
			//log_message ('debug', 'going to load list view with data: '.json_encode($data));
			if (ENVIRONMENT === 'production')
			{
				$data['scripts'] = array(
					base_url('js-min/front-all-min.js')
				);
			}
			else
			{
				$data['scripts'] = array(
					base_url('js-source/__common.js')
				);
			}

			$this->load->view('front_view', $data);			
		}
	}

	//public function switch_cache(){
	//	$this->load->model('Survey_model','',TRUE);
	//	$app_cache = $_POST['cache'];
	//
	//	if ($app_cache === 'true' || $app_cache === 'false'){
	//		$app_cache = ($app_cache === 'true') ? TRUE : FALSE;
	//		$result = $this->Survey_model->switch_offline_launch($app_cache);
	//		echo ($result === TRUE) ? 'success' : 'error';
	//	}
	//	else
	//	{
	//		echo 'Did not understand request.';
	//	}
	//} 
	//
	//

	/**
	 * function that receives data by POST and opens an edit-view of the form 
	 * the edit-view is a (iframable?) simplified webform view without any offline capabilities 
	 * (no applicationCache, no localStorage)
	 **/
	public function edit()
	{
		log_message('debug', 'webform edit view controller started');
		extract($_GET);

		if (isset($instance_id))
		{
			//log_message('debug', 'instance posted: '.$instance_id);
		}

		$subdomain = get_subdomain(); //from subdomain helper
    	$subdomain = str_replace($this->Survey_model->ONLINE_SUBDOMAIN_SUFFIX, "",
        $subdomain);
		
		if (!isset($subdomain))
		{
			show_error('Edit view should be launched from survey subdomain', 404);
			return;
		}
		if (! $this->Survey_model->is_launched_survey())
		{
			show_error('This survey has not been launched in enketo', 404);
			return;
		}
		if (empty($instance_id)) // empty($return_url)
		{
			show_error('No instance provided to edit and/or no return url provided to return to.', 404);
			return;
			//$instance = '<data><somedata>somedata</somedata><somedata>someotherdata</somedata></data>';
			// test instance for household survey with missing nodes and multiple repeats
			//$instance = '<household_survey id="household_survey"><formhub><uuid/></formhub>          <start/>          <end/>          <today/>          <deviceid/>          <subscriberid/>          <simserial/>          <phonenumber/>          <sectionA>            <note_consent/>            <interviewer>Martijn</interviewer>            <hh_id/>            <hh_location>10 10</hh_location>            <respondent_questions>             <respondent_name/>              <respondent_dob/>              <respondent_age/>              <respondent_gender>female</respondent_gender>            </respondent_questions><household_member><hh_member_age>001</hh_member_age><hh_member_gender/></household_member><household_member><hh_member_age>002</hh_member_age><hh_member_gender/></household_member><household_member><hh_member_age>003</hh_member_age><hh_member_gender/></household_member>            <hh_ownership/></sectionA><meta><instanceID>uuid:ef0f40d039a24103beecc13ae526b98a</instanceID></meta></household_survey>';
			//test instance for data_types.xml
			//$instance = '<instance xmlns="http://www.w3.org/2002/xforms">        <Data_Types id="data_types"><formhub><uuid/></formhub>          <text/>          <textarea/><pagebreak/><integ>5</integ><decim>5.55</decim><onecolor/><multicolor/><geop/>          <barc/>          <day>2012-10-01</day><now>2012-06-05T14:53:00.000-06</now><aud/>          <img/>          <vid/>        </Data_Types>      </instance>';
			//$return_url = "nothing";
		}
	    // get instance
	    $instance_obj = $this->Instance_model->get_instance($subdomain, $instance_id);
	    if(!$instance_obj)
	    {
	      show_error("Couldn't find instance for subdomain ". $subdomain . " and
	          instance id " . $instance_id, 404);
	    }
	    $instance = $instance_obj->instance_xml;
	    $return_url = $instance_obj->return_url;

		if ($this->Survey_model->has_offline_launch_enabled() === TRUE)
		{
			show_error('The edit view can only be launched in offline mode', 404);
		}
		$offline = FALSE;
		$server_url= $this->Survey_model->get_server_url();
		$form_id = $this->Survey_model->get_form_id();

		if (!$form_id || !$server_url)
		{
			show_error('Could not find server url and/or form ID in enketo database.', 404);	
		}
		
		$transf_result = $this->Form_model->transform($server_url, $form_id, FALSE);
		$form = $transf_result->form->asXML();
		//log_message('debug', $form);
		$default_instance = $transf_result->instance->asXML();
		//log_message('debug', $form_data);
		//remove line breaks and tabs
		$default_instance = str_replace(array("\r", "\r\n", "\n", "\t"), '', $default_instance);
		//$instance = str_replace(array("\r", "\r\n", "\n", "\t"), '', $instance);

		$html_title = $transf_result->form->xpath('//h2[@id="form-title"]');
		//$form_data = preg_replace("\>/s*",">", $form_data);
		//log_message('debug', 'form html to launch in edit view: '.$form);
		//log_message('debug', 'default instance to add in edit view: '.$default_instance);
		//log_message('debug', 'instance-to-edit to add in edit view: '.$instance);
		//
		if (strlen($form)>0 && strlen($default_instance)>0 && strlen($instance)>0)
		{
			$data = array(
				'offline'=>$offline, 
				'title_component'=>'webform', 
				'html_title'=> $html_title[0],
				'form'=> $form,
				'form_data'=> $default_instance,
				'form_data_to_edit' => $instance,
				'return_url' => $return_url,
				'stylesheets'=> array(
					'../libraries/jquery-ui/css/sunny/jquery-ui.custom.css',
					'../css/screen.css'
				)
			);
			$common_scripts = array(
				'../libraries/jquery.min.js',
				'../libraries/jquery-ui/js/jquery-ui.custom.min.js',
				'../libraries/jquery-ui-timepicker-addon.js',
				'../libraries/jquery.multiselect.min.js',	
				'../libraries/modernizr.min.js',
				'../libraries/xpathjs_javarosa/build/xpathjs_javarosa.min.js',
				//'libraries/FileSaver.min.js',
				//'libraries/BlobBuilder.min.js',
				'../libraries/vkbeautify.js',
				"http://maps.googleapis.com/maps/api/js?key=".$this->config->item('google_maps_api_v3_key')."&sensor=false"
			);

			//log_message('debug', 'form string: '.$form->asXML());
			if (ENVIRONMENT === 'production')
			{
				//$this->output->cache(60);
				$data['scripts'] = array_merge($common_scripts, array(
					'../js-min/webform-edit-all-min.js'
				));
			}
			else
			{		
				$data['scripts'] = array_merge($common_scripts, array(
					'../js-source/__common.js',
					'../js-source/__storage.js',
					'../js-source/__form.js',
					'../js-source/__connection.js',
					'../js-source/__survey_controls.js',
					'../js-source/__webform_edit.js',
					'../js-source/__debug.js'
				));
			}
			$this->load->view('webform_edit_view',$data);
		}
		else
		{
			show_error('An error occurred during transformation or processing instances. ', 404);
		}

	}

	//public function update_list()
	//{
	//	$this->load->model('Survey_model', '', TRUE);
	//	$success = $this->Survey_model->update_formlist();
	//	if ($success === TRUE)
	//	{
	//		echo 'form list has been updated';
	//	}
	//	else 
	//	{
	//		echo 'error updating form list';
	//	}
	//}
}


?>
