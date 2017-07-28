<?php
if(!defined('IN_ECS')) 
{
	die( 'Hacking attempt' );
}

if(empty( $_SESSION['user_id'])) 
{
	//show_message( "你还没登陆", $links = '马上登陆', $hrefs = 'user.php' );
	header('location:user.php?act=login');
}

$order_sn = intval($_REQUEST['sn']);

//订单类型
$o_type = isset($_REQUEST['type']) ? trim($_REQUEST['type']) : '';
/* 集成代码 begin */
//请求地址
$ip = trim($GLOBALS['iggs_api_url_base_url']);
$api_url = $ip."ecs/get/order/goodsinfo";
$api_url_s = $api_url."?order_id=".$order_sn."&user_id=".$_SESSION['user_id']."&is_single=true";
//发送请求
$result = zd_common_class::_send_get($api_url_s);

$obj_result = json_decode($result);

if (!$obj_result->RESULT) {
	show_message('错误的订单号，无法迁移到本地','','','error');
}else{
	if (!intval($obj_result->DATA[0]->is_on_sale)) {
		show_message('该商品已经下架，无法迁移到本地','','','error');
	}elseif (intval($obj_result->DATA[0]->is_delete)) {
		show_message('不存在的商品','','','error');
	}else{
		$mobile_download_type = 'exe';

	    if(isset($_REQUEST['download']) && $_REQUEST['download'] == 'apk')
	    {
	        $mobile_download_type = 'apk';
	    }

		$url = "user.php?act=download&sn=" . $_REQUEST['sn'] . '&download=' . $mobile_download_type;

		if (isset($_REQUEST['d_type'])) {
			$url .= '&d_type=' .$_REQUEST['d_type'];
		}

		$platform = $GLOBALS['gis']->get_platform( $obj_result->DATA[0]->cat_id );

		/* 获取订单已部署应用id begin */

		//加载zd_db_app_class类库
	    zd_core::autoload('zd_db_app_class');
	    //加载zd_db_user_class类库
	    zd_core::instance('zd_db_users_class');
	    //获取应用id
	    $app_info = zd_db_app_class::_get_app_info_by_sn($order_sn,$_SESSION['user_id']);
	    //获取成功
	    if ($app_info) {
	    	$GLOBALS['smarty']->assign( 'app_id', $app_info['id'] );
	    }
	    /* 获取用户云主机数 begin */
	    $api_url = $ip."ecs/get/user/hostnum";
		$api_url_s = $api_url."?user_id=".$_SESSION['user_id'];
		//发送请求
		$result = zd_common_class::_send_get($api_url_s);
		$host_num_obj = json_decode($result);
		$GLOBALS['smarty']->assign( 'host_have', $host_num_obj->count);
	    /* end */

		/* 获取订单已部署应用id end */

		assign_template();

		$GLOBALS['smarty']->assign( 'o_type', $o_type );
		$GLOBALS['smarty']->assign( 'url', $url );
		$GLOBALS['smarty']->assign( 'file_server_url', $GLOBALS['file_server_base_url']);
		$GLOBALS['smarty']->assign( 'show_qr', $mobile_download_type == 'apk' ? 'true' : 'false');
		$GLOBALS['smarty']->assign( 'platform', $platform );
		$GLOBALS['smarty']->assign( 'order_sn', $order_sn );
		$GLOBALS['smarty']->display( 'prepare_download.dwt' );		
	}
}
/* 集成代码 end */
// $result = $GLOBALS['db']->getAll("
// 	SELECT goods.is_on_sale,goods.is_delete,goods.cat_id
// 	FROM {$GLOBALS['ecs']->table('goods')} goods,{$GLOBALS['ecs']->table('order_info')} orderinfo,
// 		{$GLOBALS['ecs']->table('order_goods')} ordergoods
// 	WHERE orderinfo.order_id = '$order_sn' and orderinfo.user_id = '{$_SESSION['user_id']}' 
// 		and ordergoods.order_id = orderinfo.order_id and ordergoods.parent_id = 0 
// 		and ordergoods.goods_id = goods.goods_id");

// if( ! count($result)){
// 	show_message('错误的订单号，无法迁移到本地','','','error');
// }
// elseif( ! intval($result[0]['is_on_sale']))
// {
// 	show_message('该商品已经下架，无法迁移到本地','','','error');
// }
// elseif(intval($result[0]['is_delete']))
// {
// 	show_message('不存在的商品','','','error');
// }
// else
// {	
// 	$mobile_download_type = 'exe';

//     if(isset($_REQUEST['download']) && $_REQUEST['download'] == 'apk')
//     {
//         $mobile_download_type = 'apk';
//     }

// 	$url = "user.php?act=download&sn=" . $_REQUEST['sn'] . '&download=' . $mobile_download_type;

// 	if (isset($_REQUEST['d_type'])) {
// 		$url .= '&d_type=' .$_REQUEST['d_type'];
// 	}

// 	$platform = $GLOBALS['gis']->get_platform( $result[0]['cat_id'] );

// 	/* 获取订单已部署应用id begin */

// 	//加载zd_db_app_class类库
//     zd_core::autoload('zd_db_app_class');
//     //加载zd_db_user_class类库
//     zd_core::instance('zd_db_users_class');
//     //获取应用id
//     $app_info = zd_db_app_class::_get_app_info_by_sn($order_sn,$_SESSION['user_id']);
//     //获取成功
//     if ($app_info) {
//     	$GLOBALS['smarty']->assign( 'app_id', $app_info['id'] );
//     }
//     //获取用户信息
//     $user_info = zd_db_users_class::_get_user_info_by_id($_SESSION['user_id']);
//     if ($user_info) {
//     	$GLOBALS['smarty']->assign( 'host_have', $user_info['host_have'] );
//     }

// 	/* 获取订单已部署应用id end */

// 	assign_template();

// 	$GLOBALS['smarty']->assign( 'o_type', $o_type );
// 	$GLOBALS['smarty']->assign( 'url', $url );
// 	$GLOBALS['smarty']->assign( 'file_server_url', $GLOBALS['file_server_base_url']);
// 	$GLOBALS['smarty']->assign( 'show_qr', $mobile_download_type == 'apk' ? 'true' : 'false');
// 	$GLOBALS['smarty']->assign( 'platform', $platform );
// 	$GLOBALS['smarty']->assign( 'order_sn', $order_sn );
// 	$GLOBALS['smarty']->display( 'prepare_download.dwt' );
// }


