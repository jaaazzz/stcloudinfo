<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-29
 * Time: 下午5:12
 * 应用管理
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');

zd_admin_core::instance('zd_admin_log_class');
$categroy_obj = zd_admin_core::instance('zd_admin_categroy_class');
//zd_admin_core::instance('zd_admin_app_class');
require_once(ROOT_PATH . 'core/core.php');
$app_obj = zd_core::instance('zd_db_app_class');
$order_obj = zd_core::instance('zd_db_order_class');

$openstack_obj = zd_core::instance('zd_openstack_class');
$collection_obj = zd_core::instance('zd_db_collection_class');
$smarty->assign('left',    '应用管理');
//$url = 'http://' . $_SERVER['SERVER_NAME'].':'.$_SERVER["SERVER_PORT"];


//应用状态
$status=array(
    '0' => '全部',
    '1' =>'未部署',
    '2' =>'正在部署',
    '3' =>'部署成功',
    '4' =>'部署失败'
);
$is_on_sale = array(
    '0' =>'未上架',
    '1' =>'已上架'
);
$status_img = array(
    '1' => 'unstart.png',
    '2' => 'loading.gif',
    '3' => 'success.png',
    '4' => 'failed.png'
);
//参数设置
$act = isset($_REQUEST['act']) ? $_REQUEST['act'] : 'list';
if($act == 'oper'){
    $id = isset($_REQUEST['good_id'])?intval($_REQUEST['good_id']):0;
    $status = isset($_REQUEST['status'])?intval($_REQUEST['status']) : 0;
    $name   = isset($_REQUEST['name'])?($_REQUEST['name']) : '';
    $updateapp = array(
        'is_on_sale' => $status
    );

    if($id>0){
        $result = $app_obj->_update_app($id,$updateapp);
        $str_content = '';
        if($status == 0){
            $str_content =  '应用-'.$name.'-下架';
        }
        else{
            $str_content =  '应用-'.$name.'-上架';
        }
        zd_admin_log_class::create_admin_log('应用管理',$str_content);
        die_result($result,'修改成功');
    }
    else{
        die_result(false,'产品id为空，操作失败');
    }
}
elseif($act == 'console'){
    $app_id = isset($_REQUEST['app_id']) ? $_REQUEST['app_id'] : 0;
    if($app_id>0){
        //require_once(ROOT_PATH . 'core/helper/zd_app_class.php');
        $app_host_detail = $app_obj->_get_app_host_detail($app_id);
        // if($user_id==$app_host_detail['user_id'])
        // {
        $url = zd_openstack_class::get_host_url($app_host_detail['host_server_id']);
        $url = $url.'&title='.$app_host_detail['name'];
        echo json_encode(array("status" =>200, "tip" => "操作成功", content=>array("text" =>"操作成功","url"=>$url)));
        exit;
    }
    else{
        die_result(false,'产品id为空，操作失败');
    }
}
elseif($act=='batch_oper'){
    $id = isset($_REQUEST['good_id'])?($_REQUEST['good_id']):0;
    $status = isset($_REQUEST['status'])?intval($_REQUEST['status']) : 0;
    //$name   = isset($_REQUEST['name'])?($_REQUEST['name']) : '';
    $updateapp = array(
        'is_on_sale' => $status
    );
    $app_ids_array = explode(",",$id);
    foreach ($app_ids_array as $app_id) {
        if($app_id>0){
            $app = $app_obj->_get_app_detail($app_id,'');
            $name = $app['app_name'];
            $result = $app_obj->_update_app($app_id,$updateapp);
            $str_content = '';
            if($status == 0){
                $str_content =  '应用-'.$name.'-下架';
            }
            else{
                $str_content =  '应用-'.$name.'-上架';
            }
            zd_admin_log_class::create_admin_log('应用管理',$str_content);
            //die_result($result,'修改成功');
        }
        else{
            //die_result(false,'产品id为空，操作失败');
        }
    }
    die('ok');
    //exit;
}
elseif($act=='delete_app'){
    $db=$GLOBALS['db'];
    $app_id=$_REQUEST['id']?$_REQUEST['id']:0;
    $app_name=$_REQUEST['name']?$_REQUEST['name']:'';
    $db->update('ecs_application',array('hidden'=>1),array('id'=>$app_id));
    zd_admin_log_class::create_admin_log('应用管理','删除应用:'.$app_name);
    die('ok');
}
$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
$size = 10;
$categ = isset($_REQUEST['categ']) ? $_REQUEST['categ'] : '';
$app_name = isset($_REQUEST['app_name']) ? $_REQUEST['app_name'] : '';
$app_status = isset($_REQUEST['status']) ? $_REQUEST['status'] : 0;

$select_status = '';
if($app_status == 0){
    $select_status='';
}
else{
    $select_status = $app_status;
}
//获取数据
$res=$app_obj->_get_app_list($categ,$select_status,'','',$page,$size,$app_name);
//数据列表
$apps=$res['list'];
//总页码
$count=$res['count'];

$total_page = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

if($page > $total_page) { $page = $total_page; }

//前台数据合成
$app_list = array();
if(count($apps)>0){
    foreach($apps as $app){
        $order = $order_obj-> _get_goods_info_by_order_id($app['order_sn'],true);
        $name = '无';
        if($order){
           $name =  $order['goods_name'];
        }
        $div_html = "<div style='margin-top:5px;'><img src='images/status/".$status_img[$app['status']]."'/>";
        if($app['is_on_sale'] ==1){
            $div_html .= "<img style='margin-left:5px;' src='images/status/onsale.png' />";
        }
        $div_html .= "</div><div style='margin-top:5px;'>".$status[$app['status']];
        if($app['status']==3){
            if($app['is_on_sale'] ==1){
                $div_html .= "（已上架）";
            }
            else{
                $div_html .= "（未上架）";
            }
        }

        $div_html .= "</div>";

        $application = array(
            'id'     =>  $app['id'],
            'host_id' => $app['host_id'],
            'name'   =>  $app['app_name'],
            'cartgroy'=> $app['cate_name'],
            'good_name'=>$name,
            'user_name'=>$app['user_name'],
            'number'  => $collection_obj->_get_collection_count('','app',$app['id']),
            'status'     => $app['status'],
            'status_name'=>$div_html,
            'cloud_name' => $app['host_name'],
            'is_on_sale' => $is_on_sale[$app['is_on_sale']],
            'sale_status'=>$app['is_on_sale']
        );
        array_push($app_list,$application);
    }
}

//获得分类列表
$catelist = $categroy_obj->get_categroy_list();

$param = array(
    'categ' => $categ,
    'app_name'  => $app_name,
    'app_status'=> $app_status,
    'status_list'    => $status,
    'cate_list'      => $catelist
);

$smarty->assign('app_list',     $app_list);

$smarty->assign('total_page',    $total_page);
$smarty -> assign('page', $page);
$smarty -> assign('size', $size);
$smarty -> assign('count', $res['count']);
$smarty -> assign('param',$param);

$smarty -> assign('current_url', 'app_manage.php');

$smarty->display('app_manage.htm');
