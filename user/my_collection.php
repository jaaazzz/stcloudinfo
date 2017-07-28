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
// | Desc: 我的收藏列表页
// +----------------------------------------------------------------------

if(!defined('IN_ECS')){ die('Hacking attempt'); }

//$rr = $GLOBALS['gis_service']->get_private_cloud_info();

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));

/* 初始化分页信息 */
$page = isset($_REQUEST['p'])   && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;
//$size = isset($_CFG['page_size'])  && intval($_CFG['page_size']) > 0 ? intval($_CFG['page_size']) : 12;
$size = 12;
$user_id = $_SESSION['user_id'];

//收藏类型
$c_type = isset($_REQUEST['type']) && trim($_REQUEST['type']) != "" ?  trim($_REQUEST['type']) : "map";

if (preg_match('/(\?p)+/is', $host)) {
	$p_url = preg_replace("/(p=)(\d+)/",'',$host);
}
else{
	$p_url = preg_match('/(\?)+/is', $host) ? $host.'&' : $host.'?';

	$p_url = preg_replace("/(&p=)(\d+)/",'',$p_url);
}

if (!$smarty->is_cached('user/my_collection.dwt', $cache_id)){
	assign_template();

	zd_core::autoload('zd_collection_class');

	$collection_info_arr = zd_collection_class::get_collection_info($user_id,$page,$size,$c_type);

	$collections =$collection_info_arr['collections'];

	$count = $collection_info_arr['count'];

	foreach($collections as $k => $v){
		$c[] = $v['map'];
	}

	$smarty->assign('collection_arr', $c);

	$page_count = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

	if($page > $page_count) { $page = $page_count; }

	$smarty -> assign('page_count', $page_count);

	$smarty -> assign('collection_count', $count);

	$smarty -> assign('page', $page);

	$smarty -> assign('c_type', $c_type);
	
	$smarty->assign('p_url',$p_url);

	$smarty->assign('a',$collections[0]['map']['on_sale']);
}

$smarty->display('user/my_collection.dwt', $cache_id);