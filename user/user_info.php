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
// | Desc: 个人信息页
// +----------------------------------------------------------------------

if(!defined('IN_ECS')){ die('Hacking attempt'); }

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));

//获取用户id
($user_id = $_SESSION['user_id']) || header('location:user.php?act=login');

if (!$smarty->is_cached('user/user_info.dwt', $cache_id)){
	//加载基础模板信息
	assign_template();
	//加载zd_db_users_class类库
	zd_core::instance('zd_db_users_class');
	//获取当前用户信息
	$user_info = zd_db_users_class::get_user_info_by_id($user_id);

	$smarty -> assign('user_info', $user_info);
}

$smarty->display('user/user_info.dwt', $cache_id);