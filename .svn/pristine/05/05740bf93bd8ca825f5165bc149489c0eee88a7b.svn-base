<?php

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

if (!$smarty->is_cached('mobilemap/index.dwt', $cache_id)){
    assign_template();
    
     //新闻中心
    // $ip = trim($GLOBALS['iggs_api_url_base_url']);
    // $news_url = $ip."ecs/get/NewsInfo";
    // $news_url_s = $news_url."?id=&belong=&userId=&page=&Search=&pageSize=&isShow=";
    // zd_core::autoload("zd_common_clas");
    // $news_result = zd_common_class::_send_get($news_url_s);
    // $list = [];
    // $news_arr = json_decode($news_result,true);
    // foreach($news_arr['RESULT'] as $v){
    //     $v['creatTime'] = substr($v['creatTime'],0,-2);
    //     $list[]=$v;
    // }
    // $smarty->assign('news_arr',$list);
}

//页面显示
$smarty->display('mobilemap/index.dwt', $cache_id);