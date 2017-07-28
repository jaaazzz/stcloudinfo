<?php
/**
 * Created by PhpStorm.
 * User: ygq520
 * Date: 2016/5/24
 * Time: 11:12
 */
define('IN_ECS', true);
require(dirname(__FILE__) . '/includes/init.php');
require_once(ROOT_PATH . 'core/core.php');

$act=isset($_REQUEST['act'])?$_REQUEST['act']:'';

$app_obj = zd_core::instance('zd_db_app_class');
$openstack_obj = zd_core::instance('zd_openstack_class');
$collect = zd_core::instance('zd_db_collection_class');
$service_url = $base_url_config['cloud_dog'];

if ($act=='update_cache'){
    //if(pingAddress($service_url)){
        //获得点数、、、、、、
        $service = new GIS_SERVICE($GLOBALS['myself_base_url'], $service_url,$service_url);
        $result =  $service->get_private_cloud_info();
        if($result['success']){
            $total = $result['result']->GetPrivateCloudInfoResult->totalPoints;
            $used_point = $result['result']->GetPrivateCloudInfoResult->usedPoints;
            write_static_cache('cloud_points', array('total'=>$total,'used'=>$used_point));
        }
    //}

}
//测试指定ip是否能ping通
function pingAddress($address) {
    $status = -1;
    if (strcasecmp(PHP_OS, 'WINNT') === 0) {
        // Windows 服务器下
        $pingresult = exec("ping -n 1 {$address}", $outcome, $status);
    } elseif (strcasecmp(PHP_OS, 'Linux') === 0) {
        // Linux 服务器下
        $pingresult = exec("ping -c 1 {$address}", $outcome, $status);
    }
    if (0 < $status) {
        $status = true;
    } else {
        $status = false;
    }
    return $status;
}