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
// ini_set("display_errors", "On");
// error_reporting(E_ALL | E_STRICT);
// require(dirname(__FILE__) . '../includes/init.php');
//当前登陆用户用户id
$user_id = $_SESSION['user_id'];
/* 初始化分页信息 */
//$page = isset($_REQUEST['p'])   && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_id'] . '-' . $_CFG['lang'] . '-'.$host));


if (preg_match('/(\?p)+/is', $host)) {
    $p_url = preg_replace("/(p=)(\d+)/",'',$host);
}
else{
    $p_url = preg_match('/(\?)+/is', $host) ? $host.'&' : $host.'?';

    $p_url = preg_replace("/(&p=)(\d+)/",'',$p_url);
}


if (!$smarty->is_cached('onlinesrc/onlinemap.dwt', $cache_id)){
    //定义菜单栏处于激活状态
    $smarty->assign('map_active','active');
    assign_template();
    $smarty->assign('url_nav', 'index');
    
    // assign_template();
    //实例化获取资源中心数据类
    $resource_obj = zd_core::instance('zd_resource_class');
    //调用获取数据接口
    // $res_arr = $resource_obj->_get_iggs_map_service_by_userandtoken($user_id);

    $api_url = isset($GLOBALS['iggs_api_url_base_url']) ? trim($GLOBALS['iggs_api_url_base_url']) : "http://192.168.83.226:8181/rest/api/";


    $ip = trim($GLOBALS['iggs_api_url_base_url']);
    $map_url = $ip."ecs/igss/info";
    zd_core::autoload("zd_common_clas");
    $igss_info_result = zd_common_class::_send_get($map_url);

    $poiIp = $GLOBALS['iggs_api_url_base_url']."ecs/get/poiTypes";
    $POI_result = zd_common_class::_send_get($poiIp);
    $POI = json_decode($POI_result,true);
    $smarty->assign('igss_info', $igss_info_result);
    $smarty->assign('POI',$POI["RESULT"]["layersProp"]);
    // $smarty->assign('items', $res_arr['data']);
    $smarty->assign('userid',$user_id);
    // $smarty->assign('token',$res_arr['token']);
    $smarty->assign('p_url',$p_url);
    /* end */
}


//页面显示
/*$smarty->display('onlinesrc/onlinemap.dwt', $cache_id);*/
$smarty->display('onlinesrc/onlinemap.dwt', $cache_id);