<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 续点购买流程后台
// +----------------------------------------------------------------------

if( !defined('IN_ECS') ){ die('Hacking attempt'); }

include_once(ROOT_PATH . 'gis_service.php');

//用户id
($user_id = $_SESSION['user_id']) || header('location:user.php?act=login');
//订单id
$order_id = $_REQUEST['order_id'];
//购买期限
$period = intval($_REQUEST['period']);
//实例化购买逻辑类
$buy_flow_obj = zd_core::instance('zd_buy_flow_class');
//开启事务
//$GLOBALS['db']->query('START TRANSACTION');
//请求地址
$ip = trim($GLOBALS['iggs_api_url_base_url']);

$api_url = $ip."ecs/order/renew";
$api_url_s = $api_url."/".$goods_id."?order_id=".$order_id."&period=".$period."&uc_id=".$user_id;
//发送请求
$res = zd_common_class::_send_get($api_url_s);
//解析结果
$json_res = json_decode($res);
//返回结果
//$order_id = $buy_flow_obj->create_renew_order($order_id,$user_id,$period);
//如果函数执行成功
if ($json_res->BOOL) {
	//提交事务
//	$GLOBALS['db']->query('COMMIT');
	header('location:user.php?act=order_list');
	header('location:user.php?act=bill');
}
else{
    assign_template();
	//获取错误信息
	$error_msg = $json_res->MSG;
	//加载zd_common_class类库
	zd_core::autoload('zd_common_class');
	//提示错误信息
	zd_common_class::show_msg($error_msg);
	//事务回滚
//	$GLOBALS['db']->query('ROLLBACK');
}