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

if (!$smarty->is_cached('news/news_detail.dwt', $cache_id)){
	assign_template();
    //实例化获取资源中心数据类
    // $resource_obj = zd_core::instance('zd_resource_class');
    // //调用获取数据接口
    // $res_arr = $resource_obj->_get_iggs_map_service_by_userandtoken($user_id);

    // $api_url = isset($GLOBALS['iggs_api_url_base_url']) ? trim($GLOBALS['iggs_api_url_base_url']) : "http://192.168.83.226:8181/rest/api/";


    // $smarty->assign('items', $res_arr['data']);
    // $smarty->assign('userid',$user_id);
    // $smarty->assign('token',$res_arr['token']);
    // $smarty->assign('p_url',$p_url);
    /* end */
    //新闻详情
    $id = $_REQUEST['id'];
    $ip = trim($GLOBALS['iggs_api_url_base_url']);
    //新闻详情页新闻推荐列表
    $ip = trim($GLOBALS['iggs_api_url_base_url']);
    $news_url = $ip."ecs/get/NewsInfo";
    $news_url_s = $news_url."?id=&belong=&userId=&page=&Search=&pageSize=&isShow=";
    $news_url_d = $news_url."?id=".$id."&belong=&userId=&page=&Search=&pageSize=&isShow=";
    $news_click_num = $ip."ecs/click/num?id=".$id;
    zd_core::autoload("zd_common_clas");
    $news_result = zd_common_class::_send_get($news_url_s);
    $news_resultd = zd_common_class::_send_get($news_url_d);
    $news_click = zd_common_class::_send_get($news_click_num);
    $news_arr = json_decode($news_result,true);
    $news_arrd = json_decode($news_resultd,true);
    $list = [];
    foreach($news_arr['RESULT'] as $v){
        $v['creatTime'] = substr($v['creatTime'],0,-2);
        $list[]=$v;
    }
    $news_arrd['RESULT'][0]['creatTime'] = substr($news_arrd['RESULT'][0]['creatTime'],0,-2);
    $smarty->assign('news_arr',$list);
    // $smarty->assign('news_arr',$news_arr['RESULT']);
    if (empty($news_arrd['RESULT'][0]['file'])){
        $news_arrd['RESULT'][0]['isfile'] = '0';
    }else{
        $news_arrd['RESULT'][0]['isfile'] = '1';
    }
    $smarty->assign('news_detail',$news_arrd['RESULT']);
    $smarty->assign('news_detailid',$news_arrd['RESULT'][0]['id']);
    $smarty->assign('news_isFile',$news_arrd['RESULT'][0]['isfile']);
}

//页面显示
$smarty->display('news/news_detail.dwt', $cache_id);