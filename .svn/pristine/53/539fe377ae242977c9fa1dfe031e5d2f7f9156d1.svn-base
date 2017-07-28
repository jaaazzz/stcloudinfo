<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-30
 * Time: 下午2:12
 * intrdction:云主机
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');
$smarty->assign('left',    '资源管理');
//分类类
zd_admin_core::instance('zd_admin_categroy_class');
zd_admin_core::instance('zd_admin_log_class');
//应用、云主机类
require_once(ROOT_PATH . 'core/core.php');
$app_obj = zd_core::instance('zd_db_app_class');
zd_core::instance('zd_openstack_class');
    //zd_core::instance('zd_app_class');

//应用状态
$status=array(
    '-1'=>'全部',
    '1' =>'正在创建',
    '2' =>'创建失败',
    '3' =>'正在运行',
    '4' =>'已关闭'
);
$status_img = array(
    '1' => 'loading.gif',
    '2' => 'failed.png',
    '3' => 'success.png',
    '4' => 'close.png'
);
$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
$size = 10;
$search = isset($_REQUEST['app_name']) ? $_REQUEST['app_name'] : '';
$app_status = isset($_REQUEST['status']) ? $_REQUEST['status'] : '-1';

$act = isset($_REQUEST['act'])?$_REQUEST['act']:'list';
if($act == 'delete_host'){
    $app_host_ids=empty($_REQUEST['ids'])?0:$_REQUEST['ids'];
    //$app_host_ids   = $_REQUEST['host_ids'];

    if(empty($app_host_ids)){
        die('false');
    }
    $app_host_ids_array = explode(",",$app_host_ids);

    foreach ($app_host_ids_array as $app_host_id) {

        //zd_app_class::delete_app_host($app_host_id);
        $app_host_detail = zd_db_app_class::_get_app_host_detail($app_host_id);
        $str_content = '删除云主机-' . $app_host_detail['name'];
        $user_id = $app_host_detail['user_id'];
            if(empty($app_host_detail['host_server_id']))
            {

            }else
            {
                $res=zd_openstack_class::delete_server_2($app_host_detail['host_server_id']);
            }
            $host_data = new stdClass();
            $host_data->hidden = 1;
            zd_db_app_class::_update_app_host($app_host_id,$host_data);
            //删除云主机，同步到用户表
            //zd_app_class::delete_host_for_user($user_id);
            zd_db_app_class::_change_host_num_by_user($user_id,false);

        zd_admin_log_class::create_admin_log('资源管理',$str_content);
    }



    die('ok');
}

$select_status = '';
if($app_status == -1){
    $select_status='';
}
else{
    $select_status = $app_status;
}
$service_url = $base_url_config['cloud_dog'];
//用户数量
$user_list = get_userCount($service_url);
//获取云主机数据
$res=$app_obj->_get_host_list('',$page,$size,$search,$select_status);
//数据列表
$apps=$res['list'];
//总条数
$count=$res['count'];

$total_page = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

if($page > $total_page) { $page = $total_page; }

//前台数据合成
$host_list = array();
if(count($apps)>0){
    foreach($apps as $app){
        $app['operation_system']=$app['operation_system']?$app['operation_system'].'/':'';
        $set = $app['operation_system'] .$app['cpu_core_num'] . '核CPU / '
            . $app['memory_size'] . 'GB内存 / '.$app['hdd_volume'] . 'GB硬盘';
        $div_html = "<div style='margin-top:5px;'><img src='images/status/".$status_img[$app['status']]."'/>";

        $div_html .= "</div><div style='margin-top:5px;'>".$status[$app['status']];

        $div_html .= "</div>";
        $application = array(
            'id'     =>  $app['id'],
            'name'   =>  $app['name'],
            'setting'=> $set,
            'user_name'=>$app['user_name'],
            'status_name'=>$div_html
        );
        array_push($host_list,$application);
    }
}
$param = array(
    'app_name'  => $search,
    'app_status'=> $app_status,
    'status_list'    => $status
);

$smarty->assign('host_list',     $host_list);
$smarty->assign('user_list',     $user_list);
$smarty->assign('total_page',    $total_page);

$smarty -> assign('page', $page);
$smarty -> assign('size', $size);
$smarty -> assign('count', $count);
$smarty -> assign('param',$param);


$smarty -> assign('current_url', 'rm_cloudhost.php');

$smarty->display('rm_cloudhost.htm');


