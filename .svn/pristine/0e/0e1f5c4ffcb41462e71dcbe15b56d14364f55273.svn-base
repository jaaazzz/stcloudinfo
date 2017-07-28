<?php
/**
 * Created by PhpStorm.
 * User: zc
 * Date: 16-10-18
 * Time: 上午11:13
 */

define('IN_ECS', true);


function writer_log($arr)
{
    $url = GAOFEN_LOG;
    // 根据 $arr构建xml格式参数
    $param = _create_log_XML($arr);

    try
    {
        $sc = new SoapClient($url);
        $params = array('content'=>$param);
        $result = $sc->WriteLog($params);
        return $result;
    }
    catch(Exception $e) {
        return FALSE;
    }
}
/**
 * 虚拟机信息注册接口 (高分对接)
 * @param  array   $arr
 * @return json    {"success":"true/false"}
 */
function vm_register($arr)
{
    $url = GAOFEN_VM;
    // 根据 $arr构建xml格式参数
    $param = $this->_create_register_XML($arr);

    try
    {
        $sc = new SoapClient($url);
        $params = array('content'=>$param);
        $result = $sc->Register($params);
        return $result;
    }
    catch(Exception $e) {
        return FALSE;
    }
}
/**
 * 创建xml,供onwriter_log调用
 * @return string xml格式字符串
 */
function _create_log_XML($arr)
{
    $dom = new DOMDocument('1.0','UTF-8');
    // <InterfaceFile>
    $interface_file = $dom->createElement('InterfaceFile');
    $file_head = $dom->createElement("FileHead");
    $file_body = $dom->createElement("FileBody");

    $dom->appendChild($interface_file);
    $interface_file->appendChild($file_head);
    $interface_file->appendChild($file_body);

    // <FileHead>
    $message_type = $dom->createElement("messageType","WriteLog");
    $originator_address = $dom->createElement("originatorAddress","JCPT");
    $recipient_address = $dom->createElement("recipientAddress","GXFW");
    $creation_time = $dom->createElement("creationTime",date("Y-m-d\T H:i:s"));

    $file_head->appendChild($message_type);
    $file_head->appendChild($originator_address);
    $file_head->appendChild($recipient_address);
    $file_head->appendChild($creation_time);

    // <FileBody>
    $uid = $dom->createElement("uid",$arr['uid']);
    $action = $dom->createElement("action",$arr['action']);
    $objectType = $dom->createElement("objectType",$arr['objectType']);
    $objectId = $dom->createElement("objectId",$arr['objectId']);
    $time = $dom->createElement("Time",$arr['time']);
    $result = $dom->createElement("Result",$arr['result']);
    $details = $dom->createElement("Details",$arr['details']);

    $file_body->appendChild($uid);
    $file_body->appendChild($action);
    $file_body->appendChild($objectType);
    $file_body->appendChild($objectId);
    $file_body->appendChild($time);
    $file_body->appendChild($result);
    $file_body->appendChild($details);

    return $dom->saveXML();
}
/**
 * 创建xml,供onvm_register调用
 * @return string xml格式字符串
 */
function _create_register_XML($arr)
{
    $dom = new DOMDocument('1.0','UTF-8');
    // <InterfaceFile>
    $interface_file = $dom->createElement('InterfaceFile');
    $file_head = $dom->createElement("FileHead");
    $file_body = $dom->createElement("FileBody");

    $dom->appendChild($interface_file);
    $interface_file->appendChild($file_head);
    $interface_file->appendChild($file_body);

    // <FileHead>
    $message_type = $dom->createElement("messageType","RegisterVirtualMachine");
    $originator_address = $dom->createElement("originatorAddress","GXFW");
    $recipient_address = $dom->createElement("recipientAddress","JCPT");
    $creation_time = $dom->createElement("creationTime",date("Y-m-d\T H:i:s"));

    $file_head->appendChild($message_type);
    $file_head->appendChild($originator_address);
    $file_head->appendChild($recipient_address);
    $file_head->appendChild($creation_time);

    // <FileBody>
    $name = $dom->createElement("name",$arr['name']);
    $description = $dom->createElement("description",$arr['description']);
    $cpu = $dom->createElement("cpu",$arr['cpu']);
    $memory = $dom->createElement("memory",$arr['memory']);
    $space = $dom->createElement("space",$arr['space']);
    $operation = $dom->createElement("operation",$arr['operation']);
    $platforms = $dom->createElement("platforms",$arr['platforms']);
    $modules = $dom->createElement("modules",$arr['modules']);
    $datas = $dom->createElement("datas",$arr['datas']);
    $userId = $dom->createElement("userId",$arr['userId']);

    $file_body->appendChild($name);
    $file_body->appendChild($description);
    $file_body->appendChild($cpu);
    $file_body->appendChild($memory);
    $file_body->appendChild($space);
    $file_body->appendChild($operation);
    $file_body->appendChild($platforms);
    $file_body->appendChild($modules);
    $file_body->appendChild($datas);
    $file_body->appendChild($userId);

    return $dom->saveXML();
}

function getgpc($k, $var='R')
{
    switch($var) {
        case 'G': $var = &$_GET; break;
        case 'P': $var = &$_POST; break;
        case 'C': $var = &$_COOKIE; break;
        case 'R': $var = &$_REQUEST; break;
    }
    return isset($var[$k]) ? $var[$k] : NULL;
}

function jump()
{
    $url = get_jump_url();
    $url = urldecode($url);
    header("Location:$url");
}

function get_jump_url()
{
    $back_url = getgpc('back_url', 'R');
    if (empty($back_url))
    {
        $back_url = $_SERVER["HTTP_REFERER"];
    }
    if (empty($back_url)) {
        header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        //$back_url = 'http://' . UC_DEFAULT_HOME . '?r=' . microtime();
        $back_url = $GLOBALS['myself_base_url'] . '?r=' . microtime();
    }
    return $back_url;
}