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
// | Desc: 地图服务列表页
// +----------------------------------------------------------------------

define('IN_ECS', true);

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

/* 初始化分页信息 */
$page = isset($_REQUEST['p'])   && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;

$page_size =  isset($_REQUEST['page_size'])   && intval($_REQUEST['page_size'])  > 0 ? intval($_REQUEST['page_size'])  : 8;

//当前登陆用户用户id
$user_id = $_SESSION['user_id'];

//查询地图服务所需参数 begin
$service_type = $_REQUEST['service_type'] ? $_REQUEST['service_type'] : "";

$gis_data_type = $_REQUEST['gis_data_type'] ? $_REQUEST['gis_data_type'] : "";

$theme_type = $_REQUEST['theme_type'] ? $_REQUEST['theme_type'] : "";

$search = $_REQUEST['search'] ? $_REQUEST['search'] : '';
//end

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

if (!$smarty->is_cached('resource/service.dwt', $cache_id)){
	assign_template();

	zd_core::autoload('zd_common_class');
	
	$service_url = trim($GLOBALS['iggs_api_url_base_url'])."ecs/get/resource/service";

	$service_url_s = $service_url."?service_type=".$service_type."&gis_data_type=".$gis_data_type."&theme_type=".$theme_type."&search=".$search."&page=".$page."&page_size=".$page_size;

	$service_result = zd_common_class::_send_get($service_url_s);

	$service_list = json_decode($service_result,true)['data'];

	$s_list = [];

	foreach ($service_list as $service){

		$type = $service['type'];
		$jsoninfo = $service['jsonInfo']?json_decode($service['']['jsonInfo'],true):null;

		if($type == 3 ){
			$service['type'] = "矢量OGC服务";
		}elseif ($type == 4) {
			$service['type'] = "WMTS服务";
		}elseif ($type == 7) {
			$service['type'] = "目录瓦片地图服务";
		}elseif ($type == 8) {
			$service['type'] = "目录文档地图服务";
		}elseif ($type == 2){
			$service['type'] = "瓦片地图服务";
		}elseif ($type == 1){
			$service['type'] = "地图文档服务";
		}
		
		$s_list[] = $service;
	}

	$count = json_decode($service_result,true)['count'];

	$page = json_decode($service_result,true)['page'];

	//获取数据类型及专题类型
	$api_url = trim($GLOBALS['iggs_api_url_base_url'])."ecs/get/gis/theme/type";

    //发送请求
    $message_result = zd_common_class::_send_get($api_url);

    $result = json_decode($message_result,true);

    $gislist = $result['gislist'];

    $themelist = $result['themelist'];

    $page_count = ($count > 0) ? intval(ceil(1.0 * $count / $page_size)) : 1;

    $smarty->assign('st',$service_type);

    $smarty->assign('gdt',$gis_data_type);

    $smarty->assign('tt',$theme_type);

   
    // ip
    // $list_ip = [];
    $ip = trim($GLOBALS['iggs_api_url_base_url']);
    $ip_a = explode(':',$ip);
    $ip_s = $ip_a[1];
    $s_ip = substr($ip_s,2);
    $service_list = [];
 	$service_lists = [];
    foreach($s_list as $v){
    	$v['metaUrl'] = str_replace("{client_ip}",$s_ip,$v['metaUrl']);
        foreach($v['serviceUrl'] as $k => $v1){
        	$v1 = str_replace("{client_ip}",$s_ip,$v1);
        	$v['serviceUrl'][$k] = $v1;
        }
        $service_list[]=$v;
    }
   	
   	$service_json = [];
   	foreach ($service_list as $service){
   		$s['id'] = $service['id'];
		$s['text'] = $service['name'];
		$service_json[] = $s;
	}
 
    $service_img = str_replace("{client_ip}",$s_ip,$service['imgUrl']);
    $smarty->assign('service_img',$service_img);

    $smarty->assign('service_json',json_encode($service_json));

    $smarty->assign('service_list',$service_list);

    $smarty->assign('gislist',$gislist);

    $smarty->assign('count',$count);

    $smarty->assign('page_size',$page_size);

    $smarty->assign('page_count',$page_count);

    $smarty->assign('page',$page);

    $smarty->assign('search',$search);

    $smarty->assign('themelist',$themelist);
}

//页面显示
$smarty->display('resource/service.dwt', $cache_id);