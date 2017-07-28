<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2017
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 开发中心首页
// +----------------------------------------------------------------------

define('IN_ECS', true);

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_id'] . '-' . $_CFG['lang'] . '-'.$host));

if (!$smarty->is_cached('devcenter/index.dwt', $cache_id)){
	assign_template();

    if (!file_exists($file)) touch($file);
	$path = ROOT_PATH."themes/appcloud/config/dev_menus.php";
	if (file_exists($path))
    {
        include_once($path);
        //导航栏菜单项
        $nav = $nav_data;
        //平台能力导航栏项
        $sec_nav = $sec_nav_data;
        //开发示例导航栏项
        $thr_nav = $thr_nav_data;
    }
    $smarty->assign('nav_data',$nav);
    $smarty->assign('sec_nav_data',$sec_nav);
    $smarty->assign('thr_nav_data',$thr_nav);
}

$smarty->display('devcenter/index.dwt', $cache_id);