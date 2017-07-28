<?php

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

$dev_url_arr = array('index');

$do = isset($_REQUEST['do']) ? trim($_REQUEST['do']) : 'index';

if (in_array($do, $dev_url_arr)) {
	
	require(dirname(__FILE__) . '/mobile_map/'.$do.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;
