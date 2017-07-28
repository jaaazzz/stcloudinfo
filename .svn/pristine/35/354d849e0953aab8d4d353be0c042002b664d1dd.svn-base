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
// | Desc: 申请调用服务ajax操作
// +----------------------------------------------------------------------

//用户id
$user_id = $_SESSION['user_id'];
//未登录
if (empty($user_id)) {
	//返回结果
	die_result(false,'not_login','','');
}
else{
	//加载zd_common_class类库
	zd_core::autoload('zd_common_class');
    //获取资源服务地址
	$api_url = isset($GLOBALS['iggs_api_url']) ? trim($GLOBALS['iggs_api_url']) : "http://192.168.83.226:8181/rest/api/";
	//加载zd_db_users_class类库
	zd_core::instance('zd_db_users_class');
	//用户信息
	$user_info = zd_db_users_class::_get_user_info_by_id($user_id);
	//用户uc_id
	$uc_id = $user_info['uc_id'];
	//构造url
	$api_url_s = $api_url."user/token/apply?uc_id=".$uc_id;
	//发送请求
	$resource_result = zd_common_class::_send_get($api_url_s);
	//数据数组
	$resource_result_obj = json_decode($resource_result);
	if ($resource_result_obj->success) {
		$flag = true;
	}else{
		$flag = false;
	}
	$msg = $resource_result_obj->msg;
	//实例化获取资源中心数据类
	$resource_obj = zd_core::instance('zd_resource_class');
	//调用函数
	$return_arr = $resource_obj->_get_tokens_by_uid($user_id);
	die_result($flag,$msg,$return_arr);
}