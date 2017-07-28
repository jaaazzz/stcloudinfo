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
// | Desc: 管理中心统一入口
// +----------------------------------------------------------------------

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

/* 载入语言文件 */
require_once(ROOT_PATH . 'languages/' .$_CFG['lang']. '/user.php');

$user_url_arr = array(
	'register','bill','my_collection','order_list','user_info','login',
	'download','prepare_for_download','logout','signin','ajax_register',
	'check_email','is_registered','cd_binding','my_app','my_cloud_host',
	'uc_login','uc_register','my_message','my_token','my_cloud_disk'
);

$act = isset($_REQUEST['act']) ? trim($_REQUEST['act']) : '';

$smarty->assign('action',$act);

if (in_array($act, $user_url_arr)) {
    //定义菜单栏处于激活状态
    $smarty->assign('user_active','active');
    require(dirname(__FILE__) . '/user/'.$act.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;


