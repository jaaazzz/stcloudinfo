<?php

// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 购买流程统一入口
// +----------------------------------------------------------------------

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

($user_id = $_SESSION['user_id']) || header('location:user.php?act=login');

//定义菜单栏处于激活状态
$smarty->assign('sfw_active','active');
//第一次购买
if ($_REQUEST['step'] == 'finish_new_order') {
    include_once(ROOT_PATH . 'flow/finish_new_order.php');
}
//添加插件
elseif ($_REQUEST['step'] == 'finish_reassemble_order') {
    include_once(ROOT_PATH . 'flow/finish_reassemble_order.php');
}
//添加插件
elseif ($_REQUEST['step'] == 'finish_renew_order') {
    include_once(ROOT_PATH . 'flow/finish_renew_order.php');
}
else{
    require(dirname(__FILE__) . '/404.php');
}
exit;

?>