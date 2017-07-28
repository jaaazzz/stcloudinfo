<?php
if(!defined('IN_ECS')){ die('Hacking attempt'); }

$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));

/* 初始化分页信息 */
$user_id = $_SESSION['user_id'];

//获取msg_read
$msg_read = $_REQUEST['msg_read'];
if($msg_read == null){
    $msg_read = 2;
}

$page = isset($_REQUEST['p']) && intval($_REQUEST['p'])  > 0 ? intval($_REQUEST['p'])  : 1;
//$size = isset($_CFG['page_size'])  && intval($_CFG['page_size']) > 0 ? intval($_CFG['page_size']) : 12;
$size = 10;

if (!$smarty->is_cached('user/my_message.dwt', $cache_id)) {
    assign_template();
    $message = zd_core::instance('zd_message_class');
    //$message_info = $message->GetMessageByUserInfo($_SESSION['user_id'],$page,$size,$Array,true);
    $message_data_info = $message->GetSystemMessage($user_id,$msg_read,$page,$size);

    $all_msg = $message->GetSystemMessage($user_id,'2',$page,$size);

    $all_count = $all_msg['page_info']['_count'];
    //未读消息

    $message_info = $message_data_info['message_info'];

    $page_info = $message_data_info['page_info'];

    $count = $page_info['_count'];

    $page_count = $page_info['_page_count'];

    // $page_count = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

    if($page > $page_count) { 
        $page = $page_count; 
    }
    if($page < 0){
        $page = 1;
    }

    // $smarty->assign('message_arr', $message_info['message']);
    $smarty -> assign('msg_read',$msg_read);

    $smarty -> assign('page_count', $page_count);

    $smarty -> assign('message_count', $count);

    $smarty -> assign('all_count', $all_count);

    $smarty -> assign('page', $page);
    //分页结束

    $smarty->assign('message_type',SetMessageType());

    $smarty->assign('message_from',SetMessageFrom());

    // $smarty->assign('message',$message_info['content']['data']);
    $smarty->assign('message',$message_info);

    $smarty->assign('select_msg',$select_msg);
}

/**
 * 定义系统消息类型
 * @return array
 */
function SetMessageType()
{
    return Array(
        '1' => '云主机申请',
        '2' => '软件申请'
    );
}

/**
 * 定义消息来源
 * @return array
 */
function SetMessageFrom()
{
    return Array(
        '1' => '后台管理系统'
    );
}



$smarty->display('user/my_message.dwt', $cache_id);