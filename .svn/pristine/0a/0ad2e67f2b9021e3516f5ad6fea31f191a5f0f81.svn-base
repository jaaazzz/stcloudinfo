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

$sf_url_arr = array('news');

$do = isset($_REQUEST['do']) ? trim($_REQUEST['do']) : 'news';

if (in_array($do, $sf_url_arr)) {
    //定义菜单栏处于激活状态
    $smarty->assign('news_active','active');
    require(dirname(__FILE__) . '/news_center/'.$do.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;