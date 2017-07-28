<?php
	//收藏对象类型
	$obj_type = isset($_REQUEST['obj_type']) ? trim($_REQUEST['obj_type']) : 'soft';
	//初始化实例对象
	$collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => $obj_type));
	//ajax操作名
	$control = isset($_REQUEST['c']) ? trim($_REQUEST['c']) : '';
	//当前登陆用户id
	$user_id = $_SESSION['user_id'];

	zd_core::autoload('zd_collection_class');
	//添加收藏
	if ($control == 'add_collection') {
		//收藏对象id
	  	$obj_id = isset($_POST['obj_id'])  ? intval($_POST['obj_id']) : 0;
	  	//未登录
	  	if (empty($user_id)) {
	  		die_result(false,'not_login','','');
	  	}
	  	else{
	  		$collection = zd_collection_class::do_collection($obj_id,$user_id,$obj_type);
	  		//未收藏
	  		if ($collection['success']) {
	  			//执行收藏函数并返回id
	  			$collection_id = $collection['id'];
	  			//获取收藏总数
	  			$collection_count = $collection['count'];
	  			//返回数据结果
	  			$result = array( 'collection_id' => $collection_id, 'count' => $collection_count);
	  			die_result(true,'',$result,'');
	  		}
	  		else{
	  			die_result(false,'已收藏','','');
	  		}
	  	}
	}
	//取消收藏
	else if ($control == 'cancle_collection') {
		//收藏id
		$c_id = isset($_POST['c_id'])  ? intval($_POST['c_id']) : 0;
		//收藏对象id
	  	$obj_id = isset($_POST['obj_id'])  ? intval($_POST['obj_id']) : 0;
	  	//未登录
	  	if (empty($user_id)) {
	  		die_result(false,'not_login','','');
	  	}
	  	else{
	  		//执行取消收藏函数
	  		$collection= zd_collection_class::cancle_collection($c_id,$obj_type,$obj_id);

	  		$flag = $collection['success'];
	  		//获取收藏总数
	  		$collection_count = $collection['count'];
	  		//返回数据结果
	  		$result = array( 'count' => $collection_count);
	  		die_result($flag,'',$result,'');
	  	}		
	}
	else{
		die_result(false,'no this api','','');
	}
?>