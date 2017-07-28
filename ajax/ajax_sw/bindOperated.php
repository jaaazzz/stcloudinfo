<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 软件产品绑定机器相关ajax操作
// +----------------------------------------------------------------------

//ajax操作名
$type = isset($_REQUEST['type']) ? trim($_REQUEST['type']) : '';
//订单号
$order_id = intval($_REQUEST['order_sn']);
//用户id
$user_id = $_SESSION['user_id'];

//请求地址
$ip = trim($GLOBALS['iggs_api_url_base_url']);
$api_url = $ip."ecs/bind/operated";
$api_url_s = $api_url."?type=".$type."&order_id=".$order_id."&uc_id=".$user_id."&sn=".$_REQUEST['sn'];
//发送请求
$message_result = zd_common_class::_send_get($api_url_s);
$message_result_obj = json_decode($message_result,true);
if ($type == "checkDownload") {
	echo json_encode($message_result_obj["checkDownloadResult"]);
}elseif ($type == "checkDeploy") {
	echo json_encode($message_result_obj["checkDeployResult"]);
}elseif ($type == "get") {
	echo json_encode($message_result_obj["binding_info_result"]);
}elseif ($type == "unbind") {
	echo json_encode($message_result_obj["unbind_result"]);
}
exit;
?>