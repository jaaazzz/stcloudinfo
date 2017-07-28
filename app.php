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
$app_obj      = zd_core::instance('zd_app_class');
$app_db_obj   = zd_core::instance('zd_db_app_class');
$order_obj    = zd_core::instance('zd_db_order_class');
$categroy_obj = zd_core::instance('zd_db_categroy_class');
$openstack_obj= zd_core::instance('zd_openstack_class');
$app_power_obj= zd_core::instance('zd_db_app_power_class');

//定义菜单栏处于激活状态
$smarty->assign('app_active','active');
assign_template();
$user_id		= $_SESSION['user_id'];

if($act=="detail")
{
	// 应用详情页面
	$app_id = empty($_REQUEST['app_id']) ? 0 : intval($_REQUEST['app_id']);
	// $app_detail_obj = zd_db_app_class::_get_app_detail($app_id,3);
	$result = zd_db_app_class::get_app_detail($app_id,$_SESSION['user_id'],'app');
    // $result = zd_db_app_class::get_app_detail($app_id,6,'app');
	$app_detail = $result['app_detail_obj'];

	$app_detail_obj = $app_detail;

	$c_flag = $result['is_collection'];

	$collection_count = $result['collection_count'];
	// //加载zd_common_class类库
	// zd_core::autoload('zd_common_class');
	// $error_msg ="404";
	// //提示错误信息
	// zd_common_class::show_msg($error_msg);
	// exit;
    //附件单个下载
	$file_list =  zd_app_class::dealDocList($app_detail_obj['fileList']);
    $file_url_list=$file_list['DATA'];
    $file_url_list=json_decode($file_url_list,true);
	//附件批量下载
    $file_all_list =  zd_app_class::dealAllDocList($app_detail_obj['fileList']);

	$smarty->assign('app_detail_obj', $app_detail_obj);

	/* 判断此产品是否已收藏 begin 2016.3.29 */

	$obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'app'));

	// $c_flag = $obj->_is_collection($app_id,$_SESSION['user_id']);

	$smarty->assign('is_collection', $c_flag); // 是否已收藏

	//获取此产品的收藏总数
	// $collection_count = $obj->_get_collection_count('','app',$app_id);

	$smarty->assign('collection_count', $collection_count);


	/* 判断此产品是否已收藏 end */
	$smarty->assign('a',$result);

	$smarty->assign('file_list', $file_url_list);
    $smarty->assign('file_all_list', $file_all_list['DATA']);

	$smarty->assign('file_server_base_url', $GLOBALS['file_server_base_url']);
	$smarty->display('app/app_detail.dwt');
	
}elseif ($act=="create") {

	//获取获取产品订单ｉｄ
	$order_id 		= $_REQUEST['sn'];
	$app_id 		= $_REQUEST['app_id'];
	$is_edit		= $_REQUEST['is_edit'];

	// $categroy_list  = zd_db_categroy_class::_get_categroy_list();
	// $host_list 		= zd_db_app_class::_get_host_list($user_id,1,100,'',3);
	$result=zd_db_app_class::create($order_id,$app_id,$user_id);

	$categroy_list = $result['categroy_list'];

	$host_list = $result['host_list'];
	if ($host_list['count'] == 0) {
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//提示错误信息
		zd_common_class::show_msg("你还没有云主机,请前往管理中心-云主机进行申请使用云主机");
	}
	if($app_id >0)
	{	
		// $app_detail_obj = zd_db_app_class::_get_app_detail($app_id);
		$app_detail_obj = $result['app_detail_obj'];

		$file_list 			 =  zd_app_class::dealDocList($app_detail_obj['file_list']);

		// $app_power_user_list = zd_db_app_power_class::_get_app_power_list($app_id);
		$app_power_user_list = $result['app_power_user_list'];

		$smarty->assign('app_power_user_list', $app_power_user_list);
		
		$smarty->assign('file_list', $file_list);

		$smarty->assign('app_detail_obj', $app_detail_obj);

		$order_id   = $app_detail_obj['orderSn'];
	}

	// $goods_info     = zd_db_order_class::_get_goods_info_by_order_id($order_id,true);
	$goods_info = $result['goods_info'];
	$goods_type     = $GLOBALS['gis'] -> get_top_parent($goods_info['ecsCategory']['catId']);
	    //镜像集合
    // $image_list     = zd_openstack_class::get_image_list();
    $image_list = $result['image_list'];
	 foreach ($image_list as $image) {
	     $new_images = array();
	     $new_images['id']      =   $image['id'];
	     $new_images['name']    =   $image['name'];
	     $new_images['minDisk'] =   $image['minDisk'];
	     $one_images[]          =   $new_images;
	 }
	
	global $is_openstack_huawei;
	if($is_openstack_huawei)
	{
		$is_openstack_huawei=1;
	}else {
		$is_openstack_huawei=0;
	}
	//规格集合列表
	// $flavor_list = zd_openstack_class::get_flavor_list();
	$flavor_list = $result['flavor_list'];

	$smarty->assign('flavor_list',$flavor_list);

	$smarty->assign('is_openstack_huawei',$is_openstack_huawei);
	
    $smarty->assign('image_list',$one_images);
	
	$smarty->assign('sn', $order_id);
	$smarty->assign('app_id', $app_id);
	$smarty->assign('host_list', $host_list['data']);
	$smarty->assign('host_list_num', $host_list['count']);
	$smarty->assign('categroy_list', $categroy_list);

	$smarty->assign('goods_name', $goods_info['goodsName']);

	$smarty->assign('goods_type', $goods_type);
	
	$smarty->assign('is_edit', $is_edit);

	$smarty->assign('url_nav', '');

	$smarty->assign('left_nav', '');
	#创建应用
	$smarty->assign('file_server_base_url', $GLOBALS['file_server_base_url']);
	# code...
	$smarty->display('app/app_create.dwt');
}elseif ($act=="my_cloud_host") {
	#我的云主机
	$smarty->assign('app_list', $app_list);
	# code...
	$left_nav = $_REQUEST['act'];
	
	$smarty->assign('left_nav', $left_nav);

	$smarty->display('app/my_cloud_host.dwt');
}elseif ($act=="app_out_create") {
	$app_id 		= $_REQUEST['app_id'];
	$is_edit		= $_REQUEST['is_edit'];

	//$categroy_list  = zd_db_categroy_class::_get_categroy_list();
	$api_url = trim($GLOBALS['iggs_api_url_base_url'])."ecs/app/out/create?app_id=".$app_id;

	zd_core::autoload("zd_common_class");

    $result = zd_common_class::_send_get($api_url);

    $json = json_decode($result,true);

    $categroy_list = $json['category_list'];

	if($app_id >0)
	{

        $app_detail_obj = $json['application'];

        $app_power_user_list = $json['app_power_list'];

		// $app_detail_obj = zd_db_app_class::_get_app_detail($app_id);

		// $app_power_user_list = zd_db_app_power_class::_get_app_power_list($app_id);

		$smarty->assign('app_power_user_list', $app_power_user_list);
		
		$smarty->assign('app_detail_obj', $app_detail_obj);

		$file_list =  zd_app_class::dealDocList($app_detail_obj['fileList']);

		$smarty->assign('file_list', $file_list);
	}

	$smarty->assign('app_id', $app_id);

	$smarty->assign('is_edit', $is_edit);

	$smarty->assign('categroy_list', $categroy_list);

	$smarty->assign('url_nav', 'user');
	
	$smarty->assign('left_nav', 'my_app');
	#添加外部链接
	$smarty->assign('file_server_base_url', $GLOBALS['file_server_base_url']);
	# code...
	$smarty->display('app/app_out_create.dwt');
}elseif ($act=="app_prompt") {
	//部署提示页面
	# code...
	$smarty->display('app/app_prompt.dwt');
}else{
	$result = zd_db_categroy_class::get_categroy_list_by_application('',3,$user_id,1,'','','',"1,3");
    $category = isset($_REQUEST['category'])?$_REQUEST['category']:'';
    $smarty->assign('category_id',$category);
	// $categroy_list  = zd_db_categroy_class::_get_categroy_list_by_application();
	$map_list = $result['list'];

	$smarty->assign('categroy_list', $map_list);
	#应用园地
	$smarty->assign('file_server_base_url', $GLOBALS['file_server_base_url']);
	// $list           = zd_db_app_class::_get_app_garden_list_num('',3,$user_id,1,'','','',3);
	// $app_num		= $list['count'];
	$app_num = $result['count'];
    $smarty->assign('app_num', $app_num);
    $smarty->assign("a",$c);
	$smarty->display('app/app.dwt');
	// $GLOBALS['xhprof']->stop();
}

?>