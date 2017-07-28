<?php
if(!defined('IN_ECS')){ die('Hacking attempt'); }

$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));

/* 初始化分页信息 */
$user_id = $_SESSION['user_id'];

//获取token_status
$token_status = $_REQUEST['status'];
if($token_status == null){
    $token_status = "";
}

$page = isset($_REQUEST['p']) && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;
//$size = isset($_CFG['page_size'])  && intval($_CFG['page_size']) > 0 ? intval($_CFG['page_size']) : 12;
$size = 10;

if (!$smarty->is_cached('user/my_token.dwt', $cache_id)) {
    assign_template();

    $ip = trim($GLOBALS['iggs_api_url_base_url']);

    $api_url = $ip."ecs/get/apply/token";

    $api_url_s = $api_url."?user_id=".$user_id."&page=".$page."&page_size=".$size."&status=".$token_status;

    zd_core::autoload('zd_common_class');
    //发送请求
    $message_result = zd_common_class::_send_get($api_url_s);

    $result = json_decode($message_result,true);

    $all_count = $result['all_count'];
    //未读消息

    $token_info = $result['token_list'];

    // $page_info = $message_data_info['page_info'];

    $count = $result['count'];

    // $page_count = $page_info['_page_count'];

     $page_count = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

    if($page > $page_count) { 
        $page = $page_count; 
    }
    if($page < 0){
        $page = 1;
    }
    $token_list = [];
    foreach ($token_info as $token){
            if($token['status']==2&&$token['isForbid']==1){
                $token['token']="已禁用,请联系管理员解决!";
            }
            if($token['status']==3){
                $token['token']="您申请的Token未通过审核";
            }
            if($token['status']==1){
                $token['token']="审核当中，请耐心等待";
            }
            if($token['expireDate']==null&&$token['status']==2){
                $token['expireDate']="永久";
            }else if($token['expireDate']==null&&$token['status']==1){
                $token['expireDate']="无";
            }else if($token['expireDate']>0){
                if($token['expireDate']<time()*1000){
                    $token['token']="您申请的Token已过期!";
                    $token['renew']=true;
                }
                $date = date("Y-m-d H:i:s",$token['expireDate']/1000);
                $token['expireDate']=$date;
            }else{
                $token['expireDate']="无";
            }

        $token_list[]=$token;
    }

    // $smarty->assign('message_arr', $message_info['message']);
    $smarty -> assign('status',$token_status);

    $smarty -> assign('page_count', $page_count);

    $smarty -> assign('token_count', $count);

    $smarty -> assign('all_count', $all_count);

    $smarty -> assign('page', $page);
    //分页结束

    // $smarty->assign('message',$message_info['content']['data']);
    $smarty->assign('token',$token_list);

    // $smarty->assign('select_msg',$select_msg);
}

$smarty->display('user/my_token.dwt', $cache_id);