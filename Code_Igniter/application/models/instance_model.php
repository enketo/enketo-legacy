<?php

class Instance_model extends CI_Model {
  var $subdomain = '';
  var $instanceid = '';
  var $instance_xml = '';
  var $return_url = '';

  function __construct()
  {
    parent::__construct();
    log_message('debug', 'Instance Model loaded');
    $this->remove_old_instances();
  }


  function insert_instance($subdomain, $instance_id, $instance_xml, $return_url)
  {
      $instance = $this->get_instance($subdomain, $instance_id);
      if ($instance === null)
      {
          $this->subdomain = $subdomain; 
          $this->instanceid = $instance_id; 
          $this->instance_xml = $instance_xml;
          $this->return_url = $return_url;
          $this->timestamp = time();
          $this->db->insert('instances', $this);
          return $this;
      }
      return null;
  }

  function get_instance($subdomain, $instance_id)
  {
      $query = $this->db->get_where("instances", array("instanceid" => $instance_id,
            "subdomain" => $subdomain));
      $result = null;
      foreach ($query->result() as $row){
          $result = $row;
          break;
      }
      return $result;
  }

  function remove_old_instances()
  {
    log_message('debug', 'removing old instances');
    $this->db->where('timestamp <', time()-60 );
    $this->db->delete('instances');
    return;
  }

//  function remove_instance($subdomain, $instance_id)
//  {
//      $query = $this->db->delete('instances', array('instanceid' => $instance_id,
//        'subdomain' => $subdomain));
//      return ($this->db->affected_rows() > 0) ? TRUE : FALSE;
//  }

}
