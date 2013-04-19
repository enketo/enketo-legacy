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

		log_message('debug', 'Webform Controller started');

		$this->load->helper(array('subdomain','url'));
		$this->load->model('Survey_model','',TRUE);

		$this->default_library_scripts = array
		(
			'/libraries/jquery.min.js',
			'/libraries/bootstrap/js/bootstrap.min.js',	
			'/libraries/jdewit-bootstrap-timepicker/js/bootstrap-timepicker.js',
			'/libraries/bootstrap-datepicker/js/bootstrap-datepicker.js',
			'/libraries/modernizr.min.js',
			'/libraries/xpathjs_javarosa/build/xpathjs_javarosa.min.js',
			'/libraries/vkbeautify.js',
			//'/libraries/fastclick/lib/fastclick.js',
			'/libraries/FileSaver.min.js',
			'/libraries/BlobBuilder.min.js'//,
			//"http://code.jquery.com/jquery-migrate-1.0.0.js"
		);
		$this->default_main_scripts = array
		(
			'/js-source/helpers.js',
			'/js-source/gui.js',
			'/js-source/form.js',
			'/js-source/widgets.js',
			'/js-source/storage.js',
			'/js-source/files.js',
			'/js-source/connection.js',
			'/js-source/survey_controls.js',
			'/js-source/debug.js'
		);
		$this->default_stylesheets = array
		(
			array( 'href' => '/css/webform.css', 'media' => 'all'),
			array( 'href' => '/css/webform_print.css', 'media' => 'print')
		);
		$sub = get_subdomain();
		$suf = $this->Survey_model->ONLINE_SUBDOMAIN_SUFFIX;
		$this->subdomain = ($this->Survey_model->has_offline_launch_enabled()) ? $sub : substr($sub, 0, strlen($sub) - strlen($suf));
		if (!empty($this->subdomain))
		{
			$form_props = $this->Survey_model->get_form_props();
			$this->server_url= (isset($form_props['server_url'])) ? $form_props['server_url'] : NULL; //$this->Survey_model->get_server_url();
			$this->form_id = (isset($form_props['form_id'])) ? $form_props['form_id'] : NULL; //$logthis->Survey_model->get_form_id();
			$this->form_hash = (isset($form_props['hash'])) ? $form_props['hash'] : NULL; //$this->Survey_model->get_form_
			$this->xsl_version_last = (isset($form_props['xsl_version'])) ? $form_props['xsl_version'] : NULL; //$this->Survey_model->get_form_
		}
	}

	public function index()
	{
		
		if (isset($this->subdomain))
		{
			//if ($this->Survey_model->is_live_survey($subdomain))
			if (!$this->Survey_model->is_launched_survey())
			{
				return show_error('Survey does not exist, is not yet published or was taken down.', 404);
			}	

			$offline = $this->Survey_model->has_offline_launch_enabled();
			$form = $this->_get_form();

			if ($form === FALSE)
			{
				return show_error('Survey not properly launched, missing info in database', 404);	
			}
			if ($form ===  NULL)
			{
				return show_error('Form not reachable on the formhub server (or an error occurred). It is also possible that "require phone authentication" is switched on (in formub this setting is located under account settings) which is not supported in enketo yet.', 404);
			}
			
			$data = array(
				'manifest'=> ($offline) ? '/manifest/html/webform' : NULL, 
				'title_component' => 'webform', 
				'html_title' => $form->title,
				'form'=> $form->html,
				'form_data'=> $form->default_instance,
				'stylesheets'=> $this->default_stylesheets,
				'server_url' => $this->server_url,
				'form_id' => $this->form_id
			);

			if (ENVIRONMENT === 'production')
			{
				//$this->output->cache(3);
				$data['scripts'] = array
				(
					'/libraries/libraries-all-min.js',
					'/js-min/webform-all-min.js'
				);
			}
			else
			{		
				$data['scripts'] = array_merge
				(
					$this->default_library_scripts, 
					array
					(
						'/js-source/cache.js'
					),
					$this->default_main_scripts,
					array
					(
						'/js-source/webform.js'
					)
				);
			}
			//$this->output->enable_profiler(FALSE);
			$this->load->view('webform_view', $data);
		}
		else 
		{
			redirect('../../');
		}
	}

	/**
	 * function that opens an edit-view of the form with previously POSTed instance-to-edit and return url (from OpenRosa server)
	 * the edit-view is a simplified webform view without any offline capabilities 
	 * (no applicationCache, no localStorage)
	 **/
	public function edit()
	{
		$this->load->model('Instance_model','',TRUE);
		log_message('debug', 'webform edit view controller started');
		extract($_GET);
		
		if (!isset($this->subdomain))
		{
			show_error('Edit view should be launched from survey subdomain', 404);
			return;
		}
		if (!$this->Survey_model->is_launched_survey())
		{
			show_error('This survey has not been launched in enketo', 404);
			return;
		}
		if ($this->Survey_model->has_offline_launch_enabled())
		{
			return show_error('The edit view can only be launched in offline mode', 404);
		}
		if (empty($instance_id)) // empty($return_url)
		{
			return show_error('No instance provided to edit and/or no return url provided to return to.', 404);
			//$instance = '<data><somedata>somedata</somedata><somedata>someotherdata</somedata></data>';
			// test instance for household survey with missing nodes and multiple repeats
			//$edit_obj->instance_xml = '<household_survey id="household_survey"><formhub><uuid/></formhub>          <start/>          <end/>          <today/>          <deviceid/>          <subscriberid/>          <simserial/>          <phonenumber/>          <sectionA>            <note_consent/>            <interviewer>Martijn</interviewer>            <hh_id/>            <hh_location>10 10</hh_location>            <respondent_questions>             <respondent_name/>              <respondent_dob/>              <respondent_age/>              <respondent_gender>female</respondent_gender>            </respondent_questions><household_member><hh_member_age>001</hh_member_age><hh_member_gender/></household_member><household_member><hh_member_age>002</hh_member_age><hh_member_gender/></household_member><household_member><hh_member_age>003</hh_member_age><hh_member_gender/></household_member>            <hh_ownership/></sectionA><meta><instanceID>uuid:ef0f40d039a24103beecc13ae526b98a</instanceID></meta></household_survey>';
			//test instance for data_types.xml
			//$edit_obj->instance_xml = '<instance xmlns="http://www.w3.org/2002/xforms">        <Data_Types id="data_types"><formhub><uuid/></formhub>          <text/>          <textarea/><pagebreak/><integ>5</integ><decim>5.55</decim><onecolor/><multicolor/><geop/>          <barc/>          <day>2012-10-01</day><now>2012-06-05T14:53:00.000-06</now><aud/>          <img/>          <vid/>        </Data_Types>      </instance>';
			//$edit_obj->return_url = "nothing";
		}
	    
	    $edit_obj = $this->_get_edit_obj($instance_id);

	    if(!$edit_obj)
	    {
	      return show_error("Couldn't find instance for subdomain ". $this->subdomain . " and
	          instance id " . $instance_id, 404);
	    }

		$form = $this->_get_form();

		if ($form === FALSE)
		{
			return show_error('Could not find server url and/or form ID in enketo database.', 404);	
		}
		
		if ($form === NULL)
		{
			return show_error('An error occurred during transformation or processing instances. ', 404);
		}
	
		$data = array
		(
			'title_component'=>'webform edit', 
			'html_title'=> $form->title,
			'form'=> $form->html,
			'form_data'=> $form->default_instance,
			'form_data_to_edit' => $edit_obj->instance_xml,
			'return_url' => $edit_obj->return_url,
			'stylesheets'=> $this->default_stylesheets
		);

		//log_message('debug', 'form string: '.$form->asXML());
		if (ENVIRONMENT === 'production')
		{
			//$this->output->cache(60);
			$data['scripts'] = array
			(
				'/libraries/libraries-all-min.js',
				'/js-min/webform-edit-all-min.js'
			);
		}
		else
		{		
			$data['scripts'] = array_merge(
				$this->default_library_scripts,
				$this->default_main_scripts,
				array
				(
					'/js-source/webform_edit.js'
				)
			);
		}

		$this->load->view('webform_basic_view',$data);
	}

	/**
	 * function that opens an iframeable-view of the form which is a simplified webform view without any offline capabilities 
	 * (no applicationCache, no localStorage)
	 **/
	public function iframe()
	{
		log_message('debug', 'iframe view controller started');
		
		if (!isset($this->subdomain))
		{
			show_error('Iframe view should be launched from a survey subdomain', 404);
			return;
		}
		if (!$this->Survey_model->is_launched_survey())
		{
			show_error('This survey has not been launched in enketo', 404);
			return;
		}
		if ($this->Survey_model->has_offline_launch_enabled())
		{
			return show_error('The iframe view can only be launched in offline mode', 404);
		}
	    
		$form = $this->_get_form();

		if ($form === FALSE)
		{
			return show_error('Could not find server url and/or form ID in enketo database.', 404);	
		}
		
		if ($form === NULL)
		{
			return show_error('An error occurred during transformation or processing instances. ', 404);
		}
	
		$data = array
		(
			'title_component'=>'webform iframe', 
			'html_title'=> $form->title,
			'form'=> $form->html,
			'form_data'=> $form->default_instance,
			'form_data_to_edit' => NULL,
			'return_url' => NULL,
			'stylesheets'=> $this->default_stylesheets
		);

		if (ENVIRONMENT === 'production')
		{
			$data['scripts'] = array
			(
				'/libraries/libraries-all-min.js',
				'/js-min/webform-iframe-all-min.js'
			);
		}
		else
		{		
			$data['scripts'] = array_merge
			(
				$this->default_library_scripts,
				$this->default_main_scripts,
				array
				(
					'/js-source/webform_iframe.js'
				)
			);
		}
		$this->load->view('webform_basic_view',$data);
	}

	public function preview()
	{
		extract($_GET);

		if ((empty($server) || empty($id)) && empty($form))
		{
			show_error('Preview requires server url and form id variables or a form url variable.', 404);
			return;
		}
		if (isset($this->subdomain))
		{
			show_error('Preview cannot be launched from subdomain', 404);
			return;
		}
		$data = array
		(
			'title_component' => 'webform preview', 
			'html_title'=> 'enketo webform preview',
			'form'=> '',
			'return_url' => '',
			'stylesheets'=> $this->default_stylesheets
		);

		if (ENVIRONMENT === 'production')
		{
			$data['scripts'] = array
			(
				'/libraries/libraries-all-min.js',
				'/js-min/webform-preview-all-min.js'
			);
		}
		else
		{		
			$data['scripts'] = array_merge
			(
				$this->default_library_scripts,
				$this->default_main_scripts,
				array
				(
					'/js-source/webform_preview.js'
				)
			);
		}

		$this->load->view('webform_preview_view', $data);
	}

	private function _get_form()
	{
		if (!isset($this->form_id) || !isset($this->server_url))
		{
			log_message('error', 'no form_id and/or server_url');
			return FALSE;
		}
		$this->load->model('Form_model', '', TRUE);
		$stylesheets_new_version = $this->Form_model->stylesheets_changed($this->xsl_version_last);

		if ($this->Form_model->content_unchanged($this->server_url, $this->form_id, $this->form_hash) 
			&&  !$stylesheets_new_version)
		{
			log_message('debug', 'unchanged form and stylesheets, loading transformation result from database');
			$form = $this->Survey_model->get_transform_result();

			if (empty($form->title) || empty($form->html) || empty($form->default_instance))
			{
				log_message('error', 'failed to obtain transformation result from database for '.$this->subdomain);
			}
			//log_message('debug', 'loaded result: '. $form);
		}
		else
		{
			log_message('debug', 'form changed, stylesheet changed or form never transformed before, going to perform transformation');
			$transf_result = $this->Form_model->transform($this->server_url, $this->form_id, FALSE);
			
			$title = $transf_result->form->xpath('//h3[@id="form-title"]');

			$hash = $transf_result->hash;
			$form = new stdClass();
			$form->title = (!empty($title[0])) ? $title[0] : '';

			$form->html = $transf_result->form->asXML();
			
			$form->default_instance = $transf_result->model->asXML();
			//a later version of PHP seems to output jr:template= instead of template=
			//$form->default_instance = str_replace(' jr:template=', ' template=', $form->default_instance);
			//$form->default_instance = str_replace(array("\r", "\r\n", "\n", "\t"), '', $form->default_instance);
			//$form->default_instance = preg_replace('/\/\>\s+\</', '/><', $form->default_instance);
			//the preg replacement below is very aggressive!... maybe too aggressive
			$form->default_instance = preg_replace('/\>\s+\</', '><', $form->default_instance);
			$form->default_instance = json_encode($form->default_instance);
			if (!empty($form->html) && !empty($form->default_instance))
			{
				$this->Survey_model->update_transform_result($form, $hash, $stylesheets_new_version);
				//log_message('debug', 'hash in transformation result: '. $hash);
			}
			//$this->Survey_model->update_hash($hash);
		}
		
		if (!empty($form->html) && !empty($form->default_instance))
		{
			return $form;
		}
		return NULL;
	}

	private function _get_edit_obj($instance_id)
	{
		$edit_o = $this->Instance_model->get_instance($this->subdomain, $instance_id);
		if (!empty($edit_o))
		{
			$edit_o->instance_xml = json_encode($edit_o->instance_xml);
		}
		return (!empty($edit_o->instance_xml) && !empty($edit_o->return_url)) ? $edit_o : NULL;
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
