<?php
//Tom 2014年1月18日 15:50:26：增加了“是否显示‘添加新插件’链接”功能后，性能降低了N倍，适当时候可以去掉该功能。

if(!defined('IN_ECS')){ die('Hacking attempt'); }

include_once(ROOT_PATH . '/includes/init.php');

$page = isset($_REQUEST['p']) ? intval($_REQUEST['p']) : 1;

//$test = $GLOBALS['gis_service']->get_private_cloud_info();

/* 构造分页limit语句 begin */
$size = 8;

//当前登陆用户用户id
$user_id = $_SESSION['user_id'];

//实例化zd_order_class类
$order_obj = zd_core::instance('zd_order_class');
//获取数据
$result = $order_obj->get_order_list($user_id,$page,$size);
//数据
$result_all_array = $result['list'];
//数据总数
$count = $result['count'];

//申请软件列表，过滤WEB软件 dc,wc,di,wi
$c_id_arr = $GLOBALS['gis']->get_children(explode(',', "dc,di"));

/* 此代码导致性能问题，适当时候去掉 begin */
//foreach ($result_all_array as &$item)
//{
//    $all_plugin_count = count($GLOBALS['gis']->get_addon_list($item));
//
//    $item['can_add_addon'] = $all_plugin_count > count($item['addon_list']);
//}
/* 此代码导致性能问题，适当时候去掉 end */

$page_count = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

if($page > $page_count) { $page = $page_count; }

assign_template();

$smarty -> assign('page', $page);

$smarty -> assign('page_count', $page_count);

$smarty->assign('now_date',  local_date('Y-m-d H:i'));

$smarty->assign("cat_id_arr",$c_id_arr);

$smarty->assign('all_order',  $result_all_array);

//turn red when day is expiring.
$smarty->assign('warning_time', 3*24*3600  );

$smarty->assign('retrial_time', 24*3600  );

$smarty->assign('file_server',$GLOBALS['file_server_base_url']);

$current_url = preg_replace("/(&p=)(\d+)/",'',$_SERVER['REQUEST_URI']);

$smarty->assign('current_url',$current_url);

$smarty->assign('order_count',$count);

$smarty->display('user/order_list.dwt');
