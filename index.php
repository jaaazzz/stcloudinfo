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
// | Desc: 首页入口
// +----------------------------------------------------------------------

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

$acc_obj = zd_core::instance('zd_db_account_class');

$sf_url_arr = array('index');

$do = isset($_REQUEST['do']) ? trim($_REQUEST['do']) : 'index';

if (in_array($do, $sf_url_arr)) {
	require(dirname(__FILE__) . '/home/'.$do.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;

