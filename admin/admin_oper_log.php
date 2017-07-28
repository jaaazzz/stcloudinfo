<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-31
 * Time: 下午5:44
 */
define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
zd_admin_core::instance('zd_admin_log_class');

$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;

$size = 10;
$action = isset($_REQUEST['act'])?$_REQUEST['act']:'list';

$date = isset($_REQUEST['date'])? $_REQUEST['date'] : '';
$edate = isset($_REQUEST['edate'])? $_REQUEST['edate'] : '';
$username = isset($_REQUEST['username'])? $_REQUEST['username'] : '';
$logmodle = isset($_REQUEST['logmodle'])? $_REQUEST['logmodle'] : '';
$searchkey = isset($_REQUEST['searchkey'])? $_REQUEST['searchkey'] : '';
//if($_REQUEST['act']='search'){
//
//}

//获得管理员的操作记录
$user_log = zd_admin_log_class::get_admin_log($page,$size,$date,$edate,$username,$logmodle,$searchkey);

$count = $user_log['count'];

$total_page = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

if($page > $total_page) { $page = $total_page; }

$smarty->assign('user_log',     $user_log['list']);

//查询条件
$smarty->assign('total_page',    $total_page);

$smarty -> assign('page', $page);
$smarty -> assign('size', $size);
$smarty -> assign('count', $count);
$smarty->assign('date',    $date);
$smarty->assign('edate',    $edate);
$smarty->assign('left',    '日志管理');
$smarty -> assign('username', $username);
$smarty->assign('logmodle',    $logmodle);

$smarty -> assign('searchkey', $searchkey);
$search = $_SERVER['QUERY_STRING'];
$smarty -> assign('search', $search);
$smarty -> assign('current_url', 'admin_oper_log.php');

$smarty->display('admin_oper_log.htm');