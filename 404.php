<?php 
define('IN_ECS', true);
require(dirname(__FILE__) . '/includes/init.php');

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

Header("HTTP/1.1 404 Not Found");

$smarty->display('404.dwt');
