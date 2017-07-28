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
// | Desc: 文档预览页
// +----------------------------------------------------------------------

define('IN_ECS', true);

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

/* 初始化分页信息 */
$page = isset($_REQUEST['p'])   && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;

//文档id
$doc_id = isset($_REQUEST['doc_id']) && intval($_REQUEST['doc_id']) > 0 ? intval($_REQUEST['doc_id']) : 0;

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_id'] . '-' . $_CFG['lang'] . '-'.$host. '-' .$page));

if (!$smarty->is_cached('resource/docView.dwt', $cache_id)){
	assign_template();
	//实例化获取资源中心数据类
	$resource_obj = zd_core::instance('zd_resource_class');
	//调用获取数据接口
	$res_arr = $resource_obj->_get_res_doc_by_id($doc_id);
	/* 定义前台变量 begin */
	$smarty->assign('items', $res_arr);
	/* end */
}

//页面显示
$smarty->display('resource/docView.dwt', $cache_id);