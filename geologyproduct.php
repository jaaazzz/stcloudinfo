<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: yukang
// +----------------------------------------------------------------------
$act = isset($_REQUEST['act'])?$_REQUEST['act']:'';
define('IN_ECS', true);
require(dirname(__FILE__) . '/includes/init.php');

//定义菜单栏处于激活状态
$smarty->assign('sfw_active','active');
assign_template();
$user_id		= $_SESSION['user_id'];

if($act=="index")
{
	$smarty->assign('geo_active','index');
	$smarty->display('geologyproduct/geoindex.dwt');
}
elseif ($act=="geodata") {
	$smarty->assign('geo_active','geodata');
	$smarty->display('geologyproduct/geodata.dwt');
}
elseif ($act=="geomap") {
	$smarty->assign('geo_active','geomap');
	$smarty->display('geologyproduct/geomap.dwt');
}
elseif ($act=="publication") {
	//文献出版物
	$smarty->assign('geo_active','publication');
	$smarty->display('geologyproduct/publication.dwt');
}
elseif ($act=="technolgy") {
	//技术方法与数据
	$smarty->assign('geo_active','technolgy');
	$smarty->display('geologyproduct/technolgy.dwt');
}
elseif ($act=="software") {
	$smarty->assign('geo_active','software');
	$smarty->display('geologyproduct/software.dwt');
}
elseif ($act=="resource") {
	$smarty->assign('geo_active','resource');
	$smarty->display('geologyproduct/resource.dwt');
}
elseif ($act=="specialser") {
	//地学科普
	$smarty->assign('geo_active','specialser');
	$smarty->display('geologyproduct/specialser.dwt');
}
else{
	$smarty->display('geologyproduct/geoindex.dwt');
	// $GLOBALS['xhprof']->stop();
}

?>