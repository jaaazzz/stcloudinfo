<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 我的云主机列表页
// +----------------------------------------------------------------------

if(!defined('IN_ECS')){ die('Hacking attempt'); }

/* 构造缓存id */
$host = $_SERVER['REQUEST_URI'];
$cache_id = sprintf('%X', crc32($_SESSION['user_rank'] . '-' . $_CFG['lang'] . '-'.$host));
$result = zd_db_app_class::get_images_flavor();
if (!$smarty->is_cached('user/my_cloud_host.dwt', $cache_id)){

	assign_template();

}
$app_obj 		= zd_core::instance('zd_db_app_class');
$user_id        = $_SESSION['user_id'];
$list           = zd_db_app_class::get_host_list($user_id);
$user_obj 		= zd_core::instance('zd_db_users_class');
$user 		    = zd_db_users_class:: get_user_info_by_id($user_id);



global $openstack_identity;
if(empty($openstack_identity)){
    $image_list=array();
    $flavor_list=array();
}else{
    //镜像集合
    $get_image_list     = zd_openstack_class::get_image_list();
    foreach ($image_list as $image) {
        $new_images = array();
        $new_images['id']      =   $image->id;
        $new_images['name']    =   $image->name;
        $new_images['minDisk'] =   $image->minDisk;
        $one_images[]          =   $new_images;
    }

//规格集合列表
    $flavor_list = zd_openstack_class::get_flavor_list();
}

zd_core::autoload("zd_common_class");
$ip = trim($GLOBALS['iggs_api_url_base_url']);

$result_count =  zd_common_class::_send_get($ip."ecs/get/hostcount?user_id=".$user_id);

$count = json_decode($result_count,true);

// foreach($flavors as $flavor)
// {	printf("Flavors-------------------------------------------------------------------------\n");
//     printf("ID:%-36s,Name:%-36s,Vcpus:%d,Ram:%d,Disk:%d\n",$flavor->id,$flavor->name,$flavor->vcpus,$flavor->ram,$flavor->disk);
// }
global $is_openstack_huawei;
if($is_openstack_huawei)
{
	$is_openstack_huawei=1;
}else {
	$is_openstack_huawei=0;
}
$smarty->assign('is_openstack_huawei',$is_openstack_huawei);

$smarty->assign('flavor_list',$result['flavor_list']);

$smarty->assign('image_list',$result['one_images']);

$smarty->assign('host_num',$count['count']);

$smarty->display('user/my_cloud_host.dwt', $cache_id);