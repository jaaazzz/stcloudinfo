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
// | Desc: 软件中心列表页
// +----------------------------------------------------------------------

define('IN_ECS', true);

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

/* 获得请求的分类 ID */
if (isset($_REQUEST['id']))
{
    $cat_id = intval($_REQUEST['id']);
}

/* 初始化分页信息 */
$page = isset($_REQUEST['p'])   && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;
$size = 16;

//当前登陆用户用户id
$user_id = $_SESSION['user_id'];
//当前登录用户租户组id
$tenant_group_id = isset($_SESSION['tenant_group_id']) && intval($_SESSION['tenant_group_id']) > 0 ? $_SESSION['tenant_group_id'] : 0;

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_id'] . '-' . $_CFG['lang'] . '-'.$host. '-' .$page));

$current_url = $_SERVER['SCRIPT_NAME'];

if (preg_match('/(\?p)+/is', $host)) {
	$p_url = preg_replace("/(p=)(\d+)/",'',$host);
}
else{
	$p_url = preg_match('/(\?)+/is', $host) ? $host.'&' : $host.'?';

	$p_url = preg_replace("/(&p=)(\d+)/",'',$p_url);
}

$k = isset($_REQUEST['keywords']) ? $_REQUEST['keywords'] : '';

if (!$smarty->is_cached('software/category.dwt', $cache_id)){
	assign_template();

	//获取全部产品(桌面,web)
	if (empty($cat_id)) {
		//$cat_id_str = 'dc,wc,di,wi';
        //软件中心只显示桌面产品
        $cat_id_str = 'dc,di';
	}else{
		//行业简称
		$curr_nick_name = $GLOBALS['gis'] -> get_nick_name($cat_id);
		//获取行业id数据字符串
		$cat_id_str = $curr_nick_name.'c,'.$curr_nick_name.'i';
	}
	//行业id数组
	$c_id_arr = $GLOBALS['gis']->get_children(explode(',', $cat_id_str));
	//实例化类
	$goods_obj = zd_core::instance('zd_goods_class');

    $c_id_str = implode(',',$c_id_arr);
    $real_page = $page -1;
    //请求地址
    $ip = trim($GLOBALS['iggs_api_url_base_url']);
    // $api_url = $ip."ecs/goods/list"  ;
    // $api_url_s = $api_url."?uc_id=".$user_id."&cat_id=".$c_id_str."&swf_name=".$k."&is_sale=&is_index=".$is_show_index."&count=&page=".$real_page."&page_size=".$size."&page_count=&cat_type=";
    $api_url = $ip."ecs/groupgoods/list"  ;
    $api_url_s = $api_url."?group_id=".$tenant_group_id."&cat_id=".$c_id_str."&swf_name=".$k."&is_sale=&is_index=".$is_show_index."&count=&page=".$real_page."&page_size=".$size."&page_count=&cat_type=";
    //发送请求
    $message_result = zd_common_class::_send_get($api_url_s);
    //解析json,获取应用详情
    $message_result_obj = json_decode($message_result,true);
    $goods_arr = $message_result_obj['DATA'];
    $count = count($goods_arr["GOODS_INFO"]);

	//获取桌面工具
//	$goods_arr = $goods_obj->_get_goods_by_cid($c_id_arr,$page,$size,$k,$user_id);
//
//	$count = $goods_arr['count'];

	$page_count = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

	if($page > $page_count) { $page = $page_count; }


	$smarty->assign('id',$cat_id);

	$smarty->assign('current_url',$current_url);

	$smarty->assign('p_url',$p_url);

	$smarty -> assign('page_count', $page_count);

	$smarty -> assign('page', $page);

	$smarty -> assign('key',$k);

//	$smarty->assign('goods_arr', $goods_arr['goods']);
    $smarty->assign('goods_arr', $goods_arr['GOODS_INFO']);
}
$smarty->display('software/category.dwt', $cache_id);