<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-30
 * Time: 下午2:12
 * intrdction:云主机
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');
$smarty->assign('left',    '资源管理');
$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
$size = 10;
//获取数据

$total_page=1;

require(ROOT_PATH . '/core/core.php');

$acc_obj = zd_core::instance('zd_account_class');
//获取订单数据
$bill = $acc_obj->_get_user_acconut(0,$page,$size);

$total_page=($bill['count'] > 0) ? intval(ceil(1.0 * $bill['count']/$size )) : 0;

foreach($bill['list'] as &$v){
    $v['create_time_2']=date('Y-m-d H:i:s', $v['create_time']);
    $v['user_name']=get_username_by_id($v['user_id']);
}
//点数
$service_url = $base_url_config['cloud_dog'];
//用户数量
$user_list = get_userCount($service_url);

$smarty->assign('order_list',     $bill['list']);
$smarty->assign('total_page',    $total_page);
$smarty -> assign('page', $page);
$smarty -> assign('size', $size);
$smarty -> assign('count', $bill['count']);
$smarty -> assign('current_url', 'rm_license.php');
$smarty->assign('user_list',$user_list);
$smarty->display('rm_license.htm');


