<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
/**
 * Openrosa Class
 *
 * Deals with communication according to the OpenRosa APIs
 *
 * @author          Martijn van de Rijdt
 * @license         see link
 * @link            https://github.com/MartijnR/enketo
 */
class Openrosa {

    private $CI;

    public function __construct()
    {
        $this->CI =& get_instance();
        //$this->CI->load->library('curl'); 
        log_message('debug', 'Openrosa library initialized');
    }

    public function request_resource($url, $credentials=NULL)
    {
        if (empty($url)) {
            return NULL;
        }
        //log_message('debug', 'first header request result: '.json_encode($this->_request_headers_and_info($url)));
        return $this->_request($url, NULL, $credentials);
    }

    public function submit_data($url, $xml_path, $files=array(), $credentials=NULL)
    {
        $fields = array('xml_submission_file'=>'@'.$xml_path.';type=text/xml');  
        log_message('debug', 'files to be submitted: '.json_encode($files));
        if (!empty($files)) {
            foreach($files as $nodeName => $files_obj) {
                for ($i=0; $i<count($files_obj['name']); $i++) {
                    $new_location =  '/tmp/'.$files_obj['name'][$i];
                    $valid = move_uploaded_file($files_obj['tmp_name'][$i], $new_location);
                    if ($valid) {
                        $fields[$nodeName.'_'.$i] = '@'.$new_location.';type='.$files_obj['type'][$i];
                        log_message('debug', 'added file '.$new_location.' to submission');
                    }
                    //TODO: issue with file size > 30 mb (see .htaccess): this fails silently
                    //need to return feedback to user and/or check for this in client before sending?
                    //TODO: USER FEEDBACK IF NOT VALID?
                    //echo $fields[$nodeName];
                }
            }
        }
        $response = $this->_request($url, $fields, $credentials);
        $this->_delete_media_files($files);
        return $response;
    }

    public function request_max_size($submission_url)
    {
        $header_arr = $this->_request_headers_and_info($submission_url);

        if (!empty($header_arr['X-Openrosa-Accept-Content-Length'])) {
            return $header_arr['X-Openrosa-Accept-Content-Length'];
        } else {
            log_message('error', 'expected X-OpenRosa-Accept-Content-Length header but only got: '
                .json_encode($header_arr));
            //use a default value
            return 5 * 1024 * 1024;
        }
    }

    public function get_headers($url, $credentials=NULL)
    {
        return $this->_request_headers_and_info($url, $credentials);
    }

    private function _delete_media_files($files)
    {   
        foreach($files as $nodeName => $files_obj) {
            for ($i=0; $i<count($files_obj['name']); $i++) {
                $location = '/tmp/'.$files_obj['name'][$i];
                if (!unlink($location)) {
                    log_message('error', 'error trying to remove '.$location);
                }
            }
        }
    }

    //performs HEAD request
    private function _request_headers_and_info($url, $credentials=NULL)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-OpenRosa-Version: 1.0'));

        if (!empty($credentials)) {
            //log_message('debug', 'adding credentials to curl with username:'.$credentials['username']);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST | CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_USERPWD, $credentials['username'].':'.$credentials['password']);
        }
        ob_start();
        $headers = curl_exec($ch);
        ob_end_clean();

        $info = curl_getinfo($ch);
        $headers_and_info = array_merge($this->_http_parse_headers($headers), $info);

        curl_close($ch);
        unset($ch);

        return $headers_and_info;
    }

    private function _request($url, $data=NULL, $credentials=NULL)
    {
        $http_code = 0;
        //log_message('debug', 'going to send request to '.$url.' with credentials: '.json_encode($credentials));
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-OpenRosa-Version: 1.0'));

        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }
        if (!empty($credentials)) {
            ///log_message('debug', 'adding credentials to curl with username:'.$credentials['username']);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST | CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_USERPWD, $credentials['username'].':'.$credentials['password']);
        } 
        ob_start();
        $result = curl_exec($ch);
        ob_end_clean();

        $info = curl_getinfo($ch);
        $http_code = $info['http_code'];
        log_message('debug', 'request to '.$url.' responded with status code: '.$http_code);
        //log_message('debug', json_encode($info));
        //log_message('debug', 'result: '.$result);
        $http_code = (!empty($info['http_code'])) ? $info['http_code'] : '0';

        curl_close($ch);
        unset($ch);
        return array(
            'status_code' => $http_code,
            'xml' => $result
        );
    }

    private function _http_parse_headers($header)
    {
        $retVal = array();
        $fields = explode("\r\n", preg_replace('/\x0D\x0A[\x09\x20]+/', ' ', $header));
        foreach( $fields as $field ) {
            if( preg_match('/([^:]+): (.+)/m', $field, $match) ) {
                $match[1] = preg_replace('/(?<=^|[\x09\x20\x2D])./e', 'strtoupper("\0")', strtolower(trim($match[1])));
                if( isset($retVal[$match[1]]) ) {
                    if (!is_array($retVal[$match[1]])) {
                        $retVal[$match[1]] = array($retVal[$match[1]]);
                    }
                    $retVal[$match[1]][] = $match[2];
                } else {
                    $retVal[$match[1]] = trim($match[2]);
                }
            }
        }
        return $retVal;
    }
}

/* End of file Openrosa.php */
