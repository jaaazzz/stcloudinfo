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
// | Desc: 开发中心入口
// +----------------------------------------------------------------------

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

$dev_url_arr = array('index');

$do = isset($_REQUEST['do']) ? trim($_REQUEST['do']) : 'index';

if (in_array($do, $dev_url_arr)) {
	$smarty->assign('dev_active','active');
	require(dirname(__FILE__) . '/dev_center/'.$do.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;

