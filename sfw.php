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
// | Desc: 软件中心统一入口
// +----------------------------------------------------------------------

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

$acc_obj = zd_core::instance('zd_db_account_class');

$sf_url_arr = array('category','goods');

$do = isset($_REQUEST['do']) ? trim($_REQUEST['do']) : 'category';

if (in_array($do, $sf_url_arr)) {
    //定义菜单栏处于激活状态
    $smarty->assign('sfw_active','active');
	require(dirname(__FILE__) . '/sw_center/'.$do.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;

