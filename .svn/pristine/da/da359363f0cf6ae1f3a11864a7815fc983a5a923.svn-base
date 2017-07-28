<?php

function adefault()
{
    require(ROOT_PATH . 'includes/cls_earning.php');
    $keyword    = gr('keyword');
    $page       = gr('page');
    $page_size  = gr('page_size');
    $orderby    = gr('orderby');
    $desc       = gr('desc');
    $start_time = gr('start_time');
    $end_time   = gr('end_time');

    $summary = $earning->get_user_list($start_time, $end_time, $keyword, $orderby, $desc, $page_size, $page);

    $GLOBALS['smarty']->assign('result', $summary);
    $GLOBALS['smarty']->assign('keyword', $keyword);
    $GLOBALS['smarty']->assign('start_time', $start_time);
    $GLOBALS['smarty']->assign('end_time', $end_time);

    $GLOBALS['smarty']->assign('action_link', array(
        'href' => 'gisstore.php?mod=earning&act=pay_history',
        'text' => '查看支付收益历史'
    ));

    assign_query_info();
    $GLOBALS['smarty']->display('gisstore_earning.htm');
}

function user_detail()
{
    require(ROOT_PATH . 'includes/cls_earning.php');

    $link = array(array(
        'link' => gr('REQUEST_URI'),
        'text' => '返回列表'
    ));

    if (isset($_REQUEST['failed']))
    {
        $err_msg = gr('pay_fail_error');

        //TODO:send main to developer here.
        sys_msg('提交成功，已经向开发者发送错误信息。', 0, $link, true);
    }

    // what will we do when pay fail? isset($_REQUEST['failed'])
    if (isset($_REQUEST['payed']))
    {
        $pay_result = $earning->pay($_REQUEST['e_ids'], gr('trade_no'),
            gr('checkout_money'), $_SESSION['admin_id'], $_SESSION['admin_name'],
            gr('checkout_user_id'), gr('checkout_user_name'), gr('checkout_bank'),
            gr('checkout_account'), gr('checkout_user'));

        if ($pay_result['success'])
        {
            sys_msg('提交成功！', 0, $link, true);
        }
        else
        {
            sys_msg('提交错误，' . $pay_result['msg'] . ',请联系工具超市管理员', 1, $link, false);
        }
    }

    $GLOBALS['smarty']->assign('action_link', array(
        'href' => 'gisstore.php?mod=earning',
        'text' => '返回列表'
    ));

    $keyword    = gr('keyword');
    $page       = gr('page');
    $page_size  = gr('page_size');
    $orderby    = gr('orderby');
    $desc       = gr('desc');
    $start_time = gr('start_time');
    $end_time   = gr('end_time');

    $developer_id = gr('uid');

    $summary = $earning->get_user_detail($developer_id, $start_time, $end_time, $keyword,
        $orderby, $desc, $page_size, $page);

    $GLOBALS['smarty']->assign('result', $summary);
    $GLOBALS['smarty']->assign('keyword', $keyword);
    $GLOBALS['smarty']->assign('start_time', $start_time);
    $GLOBALS['smarty']->assign('end_time', $end_time);

    assign_query_info();
    $GLOBALS['smarty']->display('gisstore_earning_user.htm');
}

function pay_history()
{
    require(ROOT_PATH . 'includes/cls_earning.php');
    $keyword    = gr('keyword');
    $page       = gr('page');
    $page_size  = gr('page_size');
    $orderby    = gr('orderby');
    $desc       = gr('desc');
    $start_time = gr('start_time');
    $end_time   = gr('end_time');
    $user_id    = 0;//intval(gr('developer_id'));

    $summary = $earning->get_pay_history($user_id,$start_time, $end_time, $keyword, $orderby, $desc, $page_size, $page);

    $GLOBALS['smarty']->assign('result', $summary);
    $GLOBALS['smarty']->assign('keyword', $keyword);
    $GLOBALS['smarty']->assign('start_time', $start_time);
    $GLOBALS['smarty']->assign('end_time', $end_time);

    $GLOBALS['smarty']->assign('action_link', array(
        'href' => 'gisstore.php?mod=earning',
        'text' => '返回列表'
    ));

    assign_query_info();
    $GLOBALS['smarty']->display('gisstore_earning_history.htm');
}