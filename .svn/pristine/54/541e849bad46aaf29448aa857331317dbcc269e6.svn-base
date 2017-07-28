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
// | Desc: 我的应用列表页
// +----------------------------------------------------------------------

if(!defined('IN_ECS')){ die('Hacking attempt'); }

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));

if (!$smarty->is_cached('user/my_app.dwt', $cache_id)){

	assign_template();
	
	$categroy_obj = zd_core::instance('zd_db_categroy_class');
	//获取我的应用列表
	$categroy_list  = zd_db_categroy_class::_get_categroy_list();

	$app_obj 		= zd_core::instance('zd_db_app_class');
	
	$userid         = $_SESSION['user_id'];
	//$list 			= zd_db_app_class::_get_app_garden_list('',3,$user_id,1);
	$list           =     zd_db_app_class::get_app_list('','',$userid,'',1,10,'',2);
	$app_num		= $list['count'];
	$smarty->assign('app_num', $app_num);
	$smarty->assign('categroy_list', $categroy_list);
}

$smarty->display('user/my_app.dwt', $cache_id);