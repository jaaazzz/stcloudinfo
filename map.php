<?php

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

$dev_url_arr = array('onlinemap');

$do = isset($_REQUEST['do']) ? trim($_REQUEST['do']) : 'onlinemap';

if (in_array($do, $dev_url_arr)) {
	
	require(dirname(__FILE__) . '/onlinesrc_center/'.$do.'.php');
}else{
    require(dirname(__FILE__) . '/404.php');
}
exit;
