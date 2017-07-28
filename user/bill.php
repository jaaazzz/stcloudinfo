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
// | Desc: 我的订单列表页
// +----------------------------------------------------------------------

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));
//用户id
($user_id = $_SESSION['user_id']) || header('location:user.php?act=login');
//当前页数
$page = isset($_REQUEST['p']) ? intval($_REQUEST['p']) : 1;
//每页数量
$page_size = isset($_REQUEST['page_size']) ? intval($_REQUEST['page_size']) : 10;
//订单状态过滤
$current_status = isset($_REQUEST['status']) ? intval($_REQUEST['status']) : 0;
if (preg_match('/(\?p)+/is', $host)) {
	$p_url = preg_replace("/(p=)(\d+)/",'',$host);
}
else{
	$p_url = preg_match('/(\?)+/is', $host) ? $host.'&' : $host.'?';

	$p_url = preg_replace("/(&p=)(\d+)/",'',$p_url);
}
//实例化zd_account_class类
$acc_obj = zd_core::instance('zd_account_class');
//请求地址
$ip = trim($GLOBALS['iggs_api_url_base_url']);

$api_url = $ip."ecs/UserAccount/get";
$api_url_s = $api_url."?user_id=".$user_id."&page=".$page."&page_size=".$page_size."&current_status=".$current_status;
//发送请求,获取订单数据
$order_id = zd_common_class::_send_get($api_url_s);
$bill = json_decode($order_id,true);

//$bill = $acc_obj->_get_user_acconut($user_id,$page,$page_size,$current_status);
/* 分页页数 */
$count = $bill['count'];
$page_count = ($count > 0) ? intval(ceil(1.0 * $count / $page_size)) : 1;

if (!$smarty->is_cached('user/bill.dwt', $cache_id)){

	assign_template();
	$smarty -> assign('bill', $bill['list']);
	$smarty -> assign('status', $current_status);
	$smarty -> assign('count', $count);
	$smarty -> assign('page', $page);
	$smarty -> assign('page_count', $page_count);
	$smarty->assign('p_url',$p_url);

}
$smarty -> display('user/bill.dwt', $cache_id);

?>

