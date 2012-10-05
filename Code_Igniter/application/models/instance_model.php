<?php

class Instance_model extends CI_Model {
  var $subdomain = '';
  var $instanceid = '';
  var $instance_xml = '';
  var $return_url = '';

  function insert_instance($subdomain, $instance_id, $instance_xml, $return_url)
  {
      $instance = $this->get_instance($subdomain, $instance_id);
      if ($instance === null)
      {
          $this->subdomain = $subdomain; 
          $this->instanceid = $instance_id; 
          $this->instance_xml = $instance_xml;
          $this->return_url = $return_url;
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

}
