<?php 

die("该功能已经被禁用，2013-11-28 20:47:03");
defined("IN_ECS") || die("error");

admin_priv('gisstore_operation_batching');


function adefault(){
	
	$actions = array("file_name" => "刷新文件名");

	$GLOBALS['smarty']->assign("actions",$actions);

	$GLOBALS['smarty']->display('gisstore_batching.htm');
}

function file_name(){
	die('function deleted.');
}


