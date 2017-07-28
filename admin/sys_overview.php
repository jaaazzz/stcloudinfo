<?php
define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');
require_once(ROOT_PATH . 'core/core.php');
$act=isset($_REQUEST['act'])?$_REQUEST['act']:'';

$app_obj = zd_core::instance('zd_db_app_class');
$openstack_obj = zd_core::instance('zd_openstack_class');
$collect = zd_core::instance('zd_db_collection_class');
$service_url = $base_url_config['cloud_dog'];

    $smarty->assign('left',    '总览');

//用户数量
    $user_list = get_userCount($service_url);
//应用统计信息
    $app_list = $app_obj->_get_app_count();
//应用收藏信息
    $app_collect = $collect->_get_collection_count('','app');
//许可点数信息

//云主机信息

//产品信息
    $goods_count = $GLOBALS['db']->getOne("
	        SELECT COUNT(*)
	        FROM {$GLOBALS['ecs']->table('goods')}
    	");
//$list = $openstack_obj->get_image_list();
    global $openstack_identity;
    if(empty($openstack_identity)){
        $host_info=array();
    }else{
        $host_info=$openstack_obj::get_hypervisors();
        $host_info=(array)$host_info;
        $host_info['vcpus_free']=max(0,$host_info['vcpus']-$host_info['vcpus_used']);
        $host_info['free_ram_mb']=max(0,$host_info['free_ram_mb']);
        $host_info['free_disk_gb']=max(0,$host_info['free_disk_gb']);
    }

    $smarty->assign('host_info', $host_info);
    $smarty->assign('user_list',$user_list);
    $smarty->assign('app_list', $app_list);
    $smarty->assign('app_collect', $app_collect);
    $smarty->assign('goods_count', $goods_count);

    $smarty->display('sys_overview.htm');




