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
// | Desc: sdk列表页
// +----------------------------------------------------------------------

define('IN_ECS', true);

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

/* 初始化分页信息 */
$page = isset($_REQUEST['p']) && intval($_REQUEST['p']) > 0 ? intval($_REQUEST['p']) : 1;

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_id'] . '-' . $_CFG['lang'] . '-'.$host. '-' .$page));

if (preg_match('/(\?p)+/is', $host)) {
	$p_url = preg_replace("/(p=)(\d+)/",'',$host);
}
else{
	$p_url = preg_match('/(\?)+/is', $host) ? $host.'&' : $host.'?';

	$p_url = preg_replace("/(&p=)(\d+)/",'',$p_url);
}

//资源url
$resource_url_arr = array(
	'restApi' => "http://develop.smaryun.com:81/API/Server/RestSimpleDemo/index.htm",
	'jsApi'   => "http://develop.smaryun.com:81/API/JS/JavaScript_API(OL2)/default.html"
);

if (!$smarty->is_cached('resource/sdk.dwt', $cache_id)){
	assign_template();
	//实例化获取资源中心数据类
	$resource_obj = zd_core::instance('zd_resource_class');
	//调用获取数据接口
	$res_arr = $resource_obj->_get_res_model_project($page);
	//数据总数
	$count = $res_arr['count'];
	//每页个数
	$size = zd_resource_class::PAGE_SIZE;
	//总页数
	$page_count = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;
	if($page > $page_count) { $page = $page_count; }
	/* 定义前台变量 begin */
	$smarty->assign('items', $res_arr['items']);

	$smarty -> assign('page_count', $page_count);

	$smarty -> assign('page', $page);

	$smarty->assign('p_url',$p_url);

	$smarty->assign('res_arr_url',$resource_url_arr);
	/* end */
}

//页面显示
$smarty->display('resource/sdk.dwt', $cache_id);