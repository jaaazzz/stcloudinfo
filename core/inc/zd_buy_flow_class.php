<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------

/**
 * 购买流程逻辑类
*/
class zd_buy_flow_class{

	/**
     * 初始化
     */
    public function __construct(){

    }

    //错误日志信息
   	const NOT_SELECT = "请选择至少一个插件！";
   	const NOT_MATCH  = "插件类型不匹配";
   	const HAS_PAIED  = "您所操作的订单已经扣点";
   	const NOT_FIND_GOODS = "订单中未找到产品";
   	const NOT_FIND_ORDER = "未找到相应订单";
   	const NOT_ENOUGH_POINT = "点数不足";
   	const LIMIT_ANTH_TIME = "订单授权时间超过狗证书服务时间";
   	const NOT_GOODS = "产品不存在";

   	//默认功能组id
   	const DESK_GROUP = 3;
   	const WEB_GROUP  = 8;

    //错误信息
    public $error = '';

    /**
     * 购买创建订单
     * @param int $goods_id 框架产品id
     * @param array $addon_list 框架下插件id
     * @param int $order_count 订单数量
     * @param int $period 购买期限
     * @param int $order_group 价格模板类型(超,大,中,小,微)
     * @param int $user_id 用户id
     * @return int $account_statement_id
     * @author huangbin
     * @access public 
    */
    public function _create_new_order($goods_id,$addon_list,$order_count = 1,$period,$user_id,$order_group = 10){
    	//加载zd_db_goods_class类库
    	zd_core::autoload('zd_db_goods_class');
    	//加载zd_db_price_class类库
    	zd_core::autoload('zd_db_price_class');
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');
    	//加载zd_time_class类库
    	zd_core::autoload('zd_time_class');
    	//加载zd_common_class类库
    	zd_core::autoload('zd_common_class');
    	//开始时间
    	$start_time = zd_time_class::_calculate_start_time();
    	//结束时间
    	$end_time = zd_time_class::_calculate_end_time($start_time,$period);
    	//与证书服务时间比较
    	if (!$this->_compare_auth_time($end_time)) {
		   	$this->error = self::LIMIT_ANTH_TIME;
		    return false;    		
    	}
    	//调用获取产品信息函数
    	$goods_info = zd_db_goods_class::_get_goods_info_by_id($goods_id);
    	//产品不存在
    	if (!$goods_info) {
    		$this->error = self::NOT_GOODS;
		    return false;
    	}
    	//框架是否有安装包文件信息
    	$goods_info['has_file'] = $GLOBALS['gis']->has_file($goods_info);
    	//如果是框架,判断是否有选插件
    	if($GLOBALS['gis']->is_customize($goods_info['cat_id']))
		{
		    if(!$goods_info['has_file']){
		    	if (!$addon_list && count($addon_list) == 0) {
		    		$this->error = self::NOT_SELECT;
		    		return false;
		    	}
		    }
		}
		$goods_group = zd_db_price_class::_get_goods_base_price_by_id($goods_id);
		/* 根据框架id获取是否有可定制功能组的插件(返回的数值长度大于0则表示有) 
		   目前只有(381:MapGIS 10 for Desktop,433:IGServer for dot Net,439:IGServer for Java)产品有
		*/
		$group_plugin = zd_db_price_class::_get_group_plugin_by_id($goods_id);
		//获取框架产品简称(eg:dcjc)
		$cat_nick_name = $GLOBALS['gis']->get_nick_name($goods_info['cat_id']);
		//如果有可定制功能组的插件,则根据选购的插件id数组获取功能组id
		if ($group_plugin && count($group_plugin) > 0) {
			//功能组id
		    $price_group_id = zd_db_price_class::_get_group_id_by_addon_list($addon_list);
		}
		else{
			//如果能获取产品的功能组模板信息
			if ($goods_group) {
				$price_group_id = $goods_group['price_group_id'];
			}
			else{
				//桌面产品默认功能组为C/S功能组3
				if ($cat_nick_name[0] == 'd') {
					$price_group_id = self::DESK_GROUP;
				}
				//web产品默认功能组为B/S功能组1
				elseif ($cat_nick_name[0] == 'w') {
					$price_group_id = self::WEB_GROUP;
				}
			}
		}
		//如果是桌面产品
		if ($cat_nick_name[0] == 'd') {
		    //计算价格模板类型(与$order_group进行比较,是否被篡改)
		    $order_group = zd_db_price_class::_get_group_by_groupid($price_group_id,$order_count);
		}
		/* 获取产品框架价格模板系数 */
		// if($goods_group){
		//     $goods_price_ratio = zd_db_price_class::_get_goods_base_price_by_id($goods_id,$order_group);
		//     //框架价格模板系数
		//     $frame_price_ratio = $goods_price_ratio['price_ratio'];
		// }
		// else{
		//     $frame_price_ratio = 1;
		// }
		//是否可定制
		$is_customize = $GLOBALS['gis']->is_customize($goods_info['cat_id']);
		//是否不可定制
		$is_independent = $GLOBALS['gis']->is_independent($goods_info['cat_id']);
		//需要插入的订单相关信息数组
		$account_statement_obj = array(
	        'user_id'      => $user_id,
	        'order_id'     => 0,
	        'price'        => 0,
	        'order_count'  => $order_count,
	        'goods_id'     => $goods_info['goods_id'],
	        'goods_name'   => $goods_info['goods_name'],
	        'order_status' => GOP_NOTPAID,
	        'order_type'   => GOT_FIRST,
	        'create_time'  => time(),
	        'order_sn'     => $this->_created_order_sn(),
	        'is_trial'     => 0,
	        'group_id'     => $price_group_id
    	);
    	//功能组基础价格初始化
	    $base_price =0;
	    if($price_group_id >0 ){
	    	//获取功能组基础价格
	        $base_price = zd_db_price_class::_get_group_price_by_id($price_group_id);
	        //模板基础价格系数
	        $base_group_info = zd_db_price_class::_get_group_price_info($price_group_id,$order_group);
	        //价格乘以系数
	        $base_price = $base_price;
	        //取当前框架对应的模板价格系数
	        $price_ratio = $base_group_info['price_ratio'];
	        //存储当前订单价格模板信息
	        $account_group_obj = array(
	            'order_sn'      => $account_statement_obj['order_sn'],
	            'price_ratio'  	=> $price_ratio,
	            'scale_type'    => $order_group,
	            'minnum'     	=> $base_group_info['minnum']
	        );
	        $acc_obj->_insert_table($account_group_obj,'account_ex');
	    }
	    //框架组装插件信息数组
	    $reassemble_obj_arr = array();
	    //订单期限信息数组
	    $renew_obj = array('start_time' => $start_time,'end_time' => $end_time);
	    //框架的信息
	    $reassemble_obj = array(
        	'start_time'  => $start_time,
        	'end_time'    => $end_time,
        	'price'       => $goods_info['shop_price'],
        	'goods_id'    => $goods_id,
        	'parent_id'   => 0,
        	'create_time' => time()
    	);
	    /* 可定制 */
	    if($is_customize && count($addon_list))
	    {
	        $all_addon_list = $GLOBALS['gis']->get_addon_list($goods_info);

	        $match_count = $GLOBALS['gis']->filter_addon_list($all_addon_list, $addon_list);

	        if (count($addon_list) != $match_count) {
	        	$this->error = self::NOT_MATCH;
	        	return false;
	        }

	        foreach ($all_addon_list as &$item)
	        {
	            $reassemble_obj_arr[] = array(
	                'start_time'  => $start_time,
	                'end_time'    => $end_time,
	                'price'       => $item['shop_price'],
	                'goods_id'    => $item['goods_id'],
	                'parent_id'   => $goods_id,
	                'create_time' => time()
	            );
	            // $plugin_goods_id = $item['goods_id'];
	            // /* 插件单价价格模板 */
	            // $goods_plugin_group = zd_db_price_class::_get_goods_base_price_by_id($plugin_goods_id,$order_group);
	            // if ($base_group_info) {
	            //     $ratio = $base_group_info['price_ratio'];
	            // }
	            // else{
	            //     $ratio = 1;
	            // }
	            // $plugin_price = $item['shop_price'] * $ratio;
	            $plugin_price = $item['shop_price'];
	            $account_statement_obj['price'] += $plugin_price;
	        }
	    }
	    //最终支付价格点数
	    $account_statement_obj['price'] = zd_common_class::_price_format( ($account_statement_obj['price'] + $base_price + $goods_info['shop_price']) * $price_ratio * $period * $order_count );
	    //执行插入account_statement表数据
	    $account_statement_id = $acc_obj->_insert_table($account_statement_obj,'account_statement');
	   	//将框架信息插入组装插件表中
	   	$reassemble_obj['account_statement_id'] = $account_statement_id;
	    $acc_obj->_insert_table($reassemble_obj,'reassemble_info');
        //如果是可定制的工具
        if ($is_customize) {
        	//遍历插件数组,将信息插入组装插件表中
        	foreach ($reassemble_obj_arr as $item)
	        {
	            $item['account_statement_id'] = $account_statement_id;
	            $acc_obj->_insert_table($item,'reassemble_info');
	        }
        }

        /* 续期相关数据表操作 begin */

        $renew_obj['account_statement_id'] = $account_statement_id;
        $acc_obj->_insert_table($renew_obj,'renewal_info');
        $all_goods = array_merge([$reassemble_obj], $reassemble_obj_arr);
        foreach ($all_goods as $good)
        {
            $renewal_good = array(
                'price'                => $good['price'],
                'goods_id'             => $good['goods_id'],
                'parent_id'            => $good['parent_id'],
                'account_statement_id' => $account_statement_id
            );
            $acc_obj->_insert_table($renewal_good,'renewal_goods');
        }

		/* 续期相关数据表操作 end */

		//$order_id = $this->_do_pay_order($account_statement_obj['order_sn']);

		return $account_statement_id;
    }

    /**
     * 生成重构插件订单
     * @param array $addon_list 框架下插件id
     * @param int $order_id 订单id
     * @param int $user_id 用户id
     * @return int $account_statement_id
     * @author huangbin
     * @access public 
    */    
    public function _create_reassemble_order($addon_list,$order_id,$user_id){
    	//加载zd_db_goods_class类库
    	zd_core::autoload('zd_db_goods_class');
    	//加载zd_db_order_class类库
    	zd_core::autoload('zd_db_order_class');   
    	//加载zd_time_class类库
    	zd_core::autoload('zd_time_class');
    	//加载zd_db_price_class类库
    	zd_core::autoload('zd_db_price_class');
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');
    	//加载zd_common_class类库
    	zd_core::autoload('zd_common_class');
    	//初始化价格
    	$amount = 0;
    	//判断插件列表是否为空
    	if( !(is_array($addon_list) && count($addon_list)) )
	    {
	       	$this->error = self::NOT_SELECT;
		   	return false;
	    }
	    //产品信息
	    $goods_info = zd_db_order_class::_get_goods_info_by_order_id($order_id,$is_single = true);
	    //获取此框架产品所有插件信息
	    $addon_list_db_array = $GLOBALS['gis']->get_addon_list($goods_info);
	    //获取选购的插件与此框架下的所有插件的匹配个数
	    $match_count = $GLOBALS['gis']->filter_addon_list($addon_list_db_array,$addon_list);
	    //选购插件不匹配
	    if( count($addon_list_db_array) != $match_count )
	    {
	        $this->error = self::NOT_MATCH;
	        return false;
	    }
	    //获取订单信息
	    $order_info = zd_db_order_class::_get_order_info_by_id($order_id,$user_id);
	    //未找到订单信息
	    if (!$order_info) {
	    	$this->error = self::NOT_FIND_ORDER;
	        return false;
	    }
    	//开始时间
    	$start_time = zd_time_class::_calculate_start_time();
    	//结束时间
    	$end_time = $order_info['end_time']; 
    	//订单购买数量
    	$order_count = $order_info['order_count'];
    	//订单功能组id
    	$order_group = $order_info['group_id'];
    	//获取价格模板类型id
    	$order_scale_type = zd_db_account_class::_get_order_scale_type($order_id);
    	//获取当前提交的插件列表的功能组
        $group_id = zd_db_price_class::_get_group_id_by_addon_list($addon_list);
        //如不能获取功能组id
        if (!$group_id || $group_id == 0) {
        	$group_id = $order_group;
        }

    	/* 计算选购插件支付的点数 begin */
    	//遍历选购插件信息
        for ($i = 0; $i < count($addon_list_db_array); $i++)
        {
            if ($order_scale_type) {
            	//插件产品id
                $plugin_goods_id = $addon_list_db_array[$i]['goods_id'];
                /* 插件单价价格模板 */
                $addon_price_ratio_row = zd_db_price_class::_get_group_price_info($group_id,$order_scale_type);
                $addon_price_ratio = $addon_price_ratio_row['price_ratio'] ? $addon_price_ratio_row['price_ratio'] : 1;
            }
            //计算价格
            $price = $addon_list_db_array[$i]['shop_price'] * $addon_price_ratio / 30 * intval(($end_time - $start_time) / 24 / 3600);
            $addon_list_db_array[$i]['price'] = $price;
            //累加总价格
            $amount += $price;
        }
        /* 计算选购插件支付的点数 end */

        //之前所选插件功能组
        $pre_group_id = $order_group;
        //如果当前订单的功能组id授权功能多,需补齐功能组价格差
        if ($group_id > $pre_group_id) {
            //获取当前提交的插件列表的功能组价格
            $group_price = zd_db_price_class::_get_group_price_by_id_type($group_id,$order_scale_type);
            //之前所选插件功能组
            $pre_group_price = zd_db_price_class::_get_group_price_by_id_type($pre_group_id,$order_scale_type);
            //需支付的功能组价格点数  
            $pay_group_price = ($group_price - $pre_group_price) / 30 * intval(($end_time - $start_time) / 24 / 3600);
            $amount += $pay_group_price;
        }
    	$order_count = $order_count < 1 ? 1 : $order_count;
    	if ($amount) {
        	$amount = zd_common_class::_price_format($amount * $order_count);
    	}
    	//构建订单表数据结构
	    $account_statement_obj = array(
	        'user_id'      => $user_id,
	        'order_id'     => $order_id,
	        'price'        => $amount,
	        'order_count'  => $order_count,
	        'order_status' => GOP_NOTPAID,
	        'order_type'   => GOT_REASSEMBLE,
	        'create_time'  => time(),
	        'goods_id'     => $goods_info['goods_id'],
	        'goods_name'   => $goods_info['goods_name'],
	        'is_trial'     => $order_info['is_trial'],
	        'order_sn'     => $this->_created_order_sn(),
	        'group_id'     => $group_id
	    );
	  	//执行插入account_statement表数据
	    $account_statement_id = $acc_obj->_insert_table($account_statement_obj,'account_statement');
	    /* 插入到reassemble表里去 */
	    foreach ($addon_list_db_array as $item)
	    {
	        $reassemble_item = array(
	            'account_statement_id' => $account_statement_id,
	            'start_time'           => $start_time,
	            'end_time'             => $end_time,
	            'price'                => $item['shop_price'],
	            'goods_id'             => $item['goods_id'],
	            'parent_id'            => $goods_info['goods_id'],
	            'create_time'          => time()
	        );
	        
	        $acc_obj->_insert_table($reassemble_item,'reassemble_info');
	    }

	    //$order_id = $this->_do_pay_order($account_statement_obj['order_sn']);

	    return $account_statement_id;
    }

    public function create_reassemble_order($addon_list,$order_id,$uc_id){
    	$ip = trim($GLOBALS['iggs_api_url_base_url']);

    	$api_url = $ip."ecs/order/reassemble";

        $api_url_s = $api_url."?addon_list=".$addon_list."&order_id=".$order_id."&uc_id=".$uc_id;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result;
    }

    public function create_renew_order($order_id,$user_id,$period){
    	$ip = trim($GLOBALS['iggs_api_url_base_url']);

    	$api_url = $ip."ecs/order/renew";

        $api_url_s = $api_url."?order_id=".$order_id."&period=".$period."&uc_id=".$user_id;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result;
    }
    /**
     * 生成续费订单
     * @param int $order_id 订单id
     * @param int $user_id 用户id
     * @param int $period 续费期限  
     * @return int
     * @author huangbin
     * @access public 
    */    
    public function _create_renew_order($order_id,$user_id,$period){
    	//加载zd_db_order_class类库
    	zd_core::autoload('zd_db_order_class');   
    	//加载zd_db_price_class类库
    	zd_core::autoload('zd_db_price_class');
    	//加载zd_db_goods_class类库
    	zd_core::autoload('zd_db_goods_class');
    	//加载zd_time_class类库
    	zd_core::autoload('zd_time_class');
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');
    	//加载zd_common_class类库
    	zd_core::autoload('zd_common_class');
    	//当前时间
		$now_time = time();
		//生成订单编码
		$order_sn = $this->_created_order_sn();
    	//获取订单信息
	    $order_info = zd_db_order_class::_get_order_info_by_id($order_id,$user_id);
	    //未找到订单信息
	    if (!$order_info) {
	    	$this->error = self::NOT_FIND_ORDER;
	        return false;
	    }
	    /* 获取订单数量 */
	    $order_count = intval($order_info['order_count']);
		$order_count = $order_count < 1 ? 1 : $order_count;
		//获取订单下的所有产品信息数组
		$order_goods_info = zd_db_order_class::_get_goods_info_by_order_id($order_id);
		//订单功能组id
		$group_id = $order_info['group_id'];
		//订单价格模板类型id
		$order_scale_type = zd_db_account_class::_get_order_scale_type($order_id);
		//支付点数
		$pay_price = 0;
		//插入订单信息数组
		$account_statement_obj = array(
	        "order_id"     => $order_id,
	        "order_sn"     => $order_sn,
	        "user_id"      => $user_id,
	        "order_status" => GOP_NOTPAID,
	        "order_type"   => GOT_RENEW,
	        'goods_id'     => $order_goods_info[0]['goods_id'],
	        'goods_name'   => $order_goods_info[0]['goods_name'],
	        "create_time"  => $now_time,
	        "order_count"  => $order_count,
	        "group_id"     => $group_id
    	);
	  	//执行插入account_statement表数据
	    $account_statement_id = $acc_obj->_insert_table($account_statement_obj,'account_statement');
	    //基础价格模板信息
	    $base_price_info = zd_db_price_class::_get_group_price_info($group_id,$order_scale_type);
		//遍历产品数组
		foreach ($order_goods_info as $key => $row) {
			//产品id
			$goods_id = $row['goods_id'];
			//获取产品详细信息
			$goods_info = zd_db_goods_class::_get_goods_info_by_id($goods_id);
			//产品价格
			$goods_price = $goods_info['shop_price'] ? $goods_info['shop_price'] : 0;
			//价格模板
			$goods_group = zd_db_price_class::_get_goods_base_price_by_id($goods_id,$order_scale_type);
			//获取成功
            if ($base_price_info) {
                $ratio = $base_price_info['price_ratio'];
            }
            else{
                $ratio = 1;
            }
            //累加支付点数
            $pay_price += $goods_price * $ratio;
            /* 执行插入renewal_goods表数据 */
            $renewal_good = array(
            	'account_statement_id' => $account_statement_id,
            	'goods_id'  => $goods_id,
            	'parent_id' => $row['parent_id'],
            	'price'     => $goods_price
        	);
        	$acc_obj->_insert_table($renewal_good,'renewal_goods');
		}
		//获取功能组需支付的点数
		$pay_price += zd_db_price_class::_get_group_price_by_id_type($group_id,$order_scale_type);
		//总支付点数
		$pay_price = zd_common_class::_price_format($pay_price * $period * $order_count);
		//更新订单表中支付点数
		$acc_obj->_update_acc_record_by_o_sn($order_sn,array('price' => $pay_price));
		//订单结束时间
		$order_end_time = intval($order_info['end_time']);
		//如果订单还没过期，以订单过期时间为开始时间，如果订单已经过期了，则以现在的时间开始
    	$start_time = $now_time > $order_end_time ? zd_time_class::_calculate_start_time() : $order_end_time ;
    	//结束时间
    	$end_time = zd_time_class::_calculate_end_time($start_time,$period);
    	//与证书服务时间比较
    	if (!$this->_compare_auth_time($end_time)) {
		   	$this->error = self::LIMIT_ANTH_TIME;
		    return false;    		
    	}
    	//插入续点订单信息数组
    	$renewal_info = array(
	        "account_statement_id" => $account_statement_id,
	        "start_time" => $start_time,
	        "end_time" => $end_time
    	);
    	//执行插入renewal_info表数据
    	$acc_obj->_insert_table($renewal_info,'renewal_info');

    	//$order_id = $this->_do_pay_order($account_statement_obj['order_sn']);
    	
    	return $account_statement_id;
    }

    /**
     * 完成扣点后操作函数
     * @param int $order_sn 订单编码号 
    */
    public function _do_pay_order($order_sn){
    	//获取订单信息
    	$acc_info = zd_db_account_class::_get_acc_info_by_o_sn($order_sn);
    	//判断是否存在此订单
    	if (!$acc_info) {
    		$this->error = self::NOT_FIND_ORDER;
    		return false;
    	}
    	//判断是否已扣点
    	if(isset($acc_info['order_status']) && GOP_PAID == $acc_info['order_status']){
    		$this->error = self::HAS_PAIED;
    		return false;
    	}

    	// /* 扣点代码 begin */

    	// //加载zd_db_users_class类库
    	// $user_obj = zd_core::instance('zd_db_users_class');
    	// //支付用户id
    	// $user_id = $acc_info['user_id'];
    	// /* 获取用户剩余点数 */
    	// $user_info = zd_db_users_class::_get_user_info_by_id($user_id);
    	// $user_point = intval($user_info['point_have']);
    	// //需要扣除的点数
    	// $point = intval($acc_info['price']);
    	// //判断支付是否可行
    	// if ($user_point < $point) {
    	// 	$this->error = self::NOT_ENOUGH_POINT;
    	// 	return false;
    	// }else{
    	// 	//剩余点数
    	// 	$surplus_point = $user_point - $point;
    	// 	//执行更新
    	// 	$user_obj->_update_users_record_by_user_id($user_id,array('point_have' => $surplus_point));
    	// }

    	// /*  end  */

    	//判断订单类型
    	switch ($acc_info['order_type'])
    	{
    		//第一次购买
	        case GOT_FIRST:
	            $result = $this->_update_record_after_first_pay($acc_info['order_sn']);
	            break;
	        //续费
	        case GOT_RENEW:
	            $result = $this->_update_record_after_renew_pay($acc_info['order_sn']);
	            break;
	        //重构插件
	        case GOT_REASSEMBLE:
	            $result= $this->_update_record_after_reassemble_pay($acc_info['order_sn']);
	            break;
	        default:
	            $result = return_result(false,'unknown order type.');
	            break;
    	}
    	return $result;
    }

    /**
     * 生成订单编码
     * @author huangbin
     * @access public 
     * @return int 
     * 
    */
    public function _created_order_sn(){
	    /* 选择一个随机的方案 */
	    mt_srand((double) microtime() * 1000000);

	    return date('Ymd') . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
    }

    /**
     * 第一次购买操作函数
     * @param int $order_sn 订单编码
     * @access private
     * @author huangbin
     * @return int
    */
    private function _update_record_after_first_pay($order_sn){
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');
    	//加载zd_db_users_class类库
    	zd_core::autoload('zd_db_users_class');
    	//获取订单信息
		$account_statement_info = zd_db_account_class::_get_acc_info_by_o_sn($order_sn);
		//购买用户id
		$user_id = $account_statement_info['user_id'];
		//用户名称
		$user_name = zd_db_users_class::_get_user_name_by_id($user_id);
		//订单下产品信息表
		$reassemble_info = zd_db_account_class::_get_reassemble_info_by_o_sn($order_sn);
		//开始时间
		$start_time = $reassemble_info[0]['start_time'];
		//云狗的开始时间
		$dog_start_time = time();
		//结束时间
		$end_time = $reassemble_info[0]['end_time'];
    	//订单验证标志
   		$validate_confirm = count($account_statement_info) || count($reassemble_info);

	    if (!$validate_confirm )
	    {	
	    	$this->error = self::NOT_FIND_GOODS;
	    	return false;
	    }
	    //行业类型id
	    $cat_id = $reassemble_info[0]['cat_id'];
	    //订单数量
    	$order_count = $account_statement_info['order_count'];
    	//获取功能组编码
    	$GLOBALS['gis_service']->get_functions($order_sn);
    	//云狗注册
    	$register_result = $GLOBALS['gis_service']->register_update_app($cat_id, $user_name, $dog_start_time,
        $end_time ,$reassemble_info, $order_count, 'register', $serial_no = '', $order_id = 0 ,$dev_vip = false, $order_sn);
    	//清除功能组编码
    	$GLOBALS['gis_service']->clear_functions();
    	//注册云狗不成功
	    if(!$register_result['success'] )
	    {
	    	$this->error = $register_result['msg']; 
	        return false;
	    }
	    //功能组id
    	$group_id = $account_statement_info['group_id'];
    	//插入order_info表数据
	    $order_info = array(
	        'order_status'    => OS_CONFIRMED,
	        'pay_status'      => PS_PAYED,
	        'order_sn'        => $this->_created_order_sn(),
	        'user_id'         => $user_id,
	        'goods_amount'    => $account_statement_info['price'],
	        'add_time'        => time(),
	        'start_time'      => $start_time,
	        'end_time'        => $end_time,
	        'shipping_status' => SS_SHIPPED,
	        'serial_no'       => $register_result['result']['serial_no_arr'],
	        'group_serial_no' => $register_result['result']['group_guid'],
	        'is_trial'        => $account_statement_info['is_trial'],
	        'order_count'     => $order_count,
	        'group_id'        => $group_id,
	        'version_no'      => $account_statement_info['version_no'],
	        'integrate_workbench_id' => intval($account_statement_info['integrate_workbench_id'])  //归属的集成工作室id
	    );
    	//执行插入返回id
    	$order_info_id = $acc_obj->_insert_table($order_info,'order_info');
    	//更新订单表数据
    	$acc_obj->_update_acc_record_by_o_sn($order_sn,array(
        	"order_status" => GOP_PAID,
        	"order_id" => $order_info_id,
        	"pay_time" => time()
    	));
	    /* insert order_goods */
	    foreach ($reassemble_info as $item)
	    {
	        $order_goods_tobe_inserted = array(
	            'order_id'     => $order_info_id,
	            'goods_id'     => $item['goods_id'],
	            'goods_name'   => $item['goods_name'],
	            'goods_sn'     => $item['goods_sn'],
	            'goods_number' => 1,
	            'market_price' => $item['price'],
	            'goods_price'  => $item['price'],
	            'is_real'      => 1,
	            'send_number'  => 1,
	            'parent_id'    => $item['parent_id'],
	            'is_gift'      => 0,
	            'start_time'   => $item['start_time'],
	            'end_time'     => $item['end_time']
	        );
	        $acc_obj->_insert_table($order_goods_tobe_inserted,'order_goods');
	    }

    	return $order_info_id;
    }

    /**
     * 添加插件扣点后操作函数
     * @param int $order_sn 订单编码
     * @access private
     * @author huangbin
     * @return int
    */
    private function _update_record_after_reassemble_pay($order_sn){
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');   
    	//加载zd_db_order_class实例
    	$order_obj = zd_core::instance('zd_db_order_class');
    	//加载zd_db_users_class类库
    	zd_core::autoload('zd_db_users_class');
    	//获取订单信息
		$account_statement_info = zd_db_account_class::_get_acc_info_by_o_sn($order_sn); 	
    	//订单下产品信息表
		$reassemble_info = zd_db_account_class::_get_reassemble_info_by_o_sn($order_sn);
		//未找到任何插件信息
		if (!count($reassemble_info))
	    {
	    	$this->error = self::NOT_FIND_GOODS;
	    	return false;
	    }
	   	//购买用户id
		$user_id = $account_statement_info['user_id'];
		//用户名称
		$user_name = zd_db_users_class::_get_user_name_by_id($user_id);
		//订单id
		$order_id = $account_statement_info['order_id'];
		//开始时间
		$start_time = $reassemble_info[0]['start_time'];
		//结束时间
		$end_time = $reassemble_info[0]['end_time'];
		//获取第一次购买扣点后的产品信息数组
		$order_info_goods = zd_db_order_class::_get_goods_info_by_order_id($order_id);
		//获取order_info信息
		$order_info = zd_db_order_class::_get_order_info_by_id($order_id,$user_id);
		//订单授权号
		$serial_no = $order_info['serial_no'];
		//云狗开始时间
		$dog_start_time = time();

		/* 将产品的文件权限id存入数组$weight_id_arr中 begin */
		$weight_id_arr = array();
		foreach ($reassemble_info as $item)
	    {
	        array_push($weight_id_arr, $item['weight_id']);
	    }
	    foreach ($order_info_goods as $item) 
	    {
	    	if ($item['weight_id'] && !empty($item['weight_id'])) {
	    		array_push($weight_id_arr, $item['weight_id']);
	    	}
	    }
		/* 将产品的文件权限id存入数组$weight_id_arr中 end */

		//获取功能组编码
	    $GLOBALS['gis_service']->get_functions($order_sn);
	    //云狗更新
	    $cd_result = $GLOBALS['gis_service']->register_update_app($reassemble_info[0]['cat_id'], 
	        $user_name, $dog_start_time, $end_time ,$weight_id_arr,1, 'update', $serial_no, $order_id, $dev_vip = false, $order_sn);
	    //清除功能组编码
	    $GLOBALS['gis_service']->clear_functions();
	    //云狗更新不成功
	    if(!$cd_result['success'])
	    {
	    	$this->error = $cd_result['msg'];
	        return false;
	    }
	    //更新订单表数据
    	$acc_obj->_update_acc_record_by_o_sn($order_sn,array(
        	"order_status" => GOP_PAID
    	));

    	/* 将新加的插件添加到order_goods中 begin */
    	foreach ($reassemble_info as $item)
	    {
	        $order_goods_tobe_inserted = array(
	            'order_id'     => $order_id,
	            'goods_id'     => $item['goods_id'],
	            'goods_name'   => $item['goods_name'],
	            'goods_sn'     => $item['goods_sn'],
	            'goods_number' => 1,
	            'market_price' => $item['price'],
	            'goods_price'  => $item['price'],
	            'is_real'      => 1,
	            'send_number'  => 1,
	            'parent_id'    => $item['parent_id'],
	            'is_gift'      => 0,
	            'start_time'   => $start_time,
	            'end_time'     => $end_time
	        );
	        $acc_obj->_insert_table($order_goods_tobe_inserted,'order_goods');
	    }
	    /* 将新加的插件添加到order_goods中 end */

	    //功能组id
	    $group_id = $account_statement_info['group_id'];
	    //判断当前功能组id是否大于之前订单的功能组id(取最大功能组id作为订单的功能组id)
	    $group_id = intval($group_id) > intval($order_info['group_id']) ? $group_id : $order_info['group_id'];
	    //更新order_info表中功能组id号
	    $order_obj->_update_order_record_by_o_id($order_id,array( 'group_id' => $group_id ));
	    //返回order_id
	    return $order_id;
    }

    /**
     * 续点成功扣点后操作函数
     * @param int $order_sn 订单编码
     * @access private
     * @author huangbin
     * @return int
    */
    private function _update_record_after_renew_pay($order_sn){
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');
    	//加载zd_db_order_class实例
    	$order_obj = zd_core::instance('zd_db_order_class');
    	//加载zd_db_users_class类库
    	zd_core::autoload('zd_db_users_class');
    	//获取订单信息
		$account_statement_info = zd_db_account_class::_get_acc_info_by_o_sn($order_sn); 
    	//续点信息
    	$renewal_info = zd_db_account_class::_get_renew_info_by_a_id($account_statement_info['account_statement_id']);
    	//购买用户id
		$user_id = $account_statement_info['user_id'];
		//用户名称
		$user_name = zd_db_users_class::_get_user_name_by_id($user_id);
		//订单id
		$order_id = $account_statement_info['order_id'];
		//获取order_info信息
		$order_info = zd_db_order_class::_get_order_info_by_id($order_id,$user_id);
		//获取订单下的所有产品信息
		$order_goods = zd_db_order_class::_get_goods_info_by_order_id($order_id);
		//订单授权号
		$serial_no = $order_info['serial_no'];
		//开始时间
		$start_time = $order_info['start_time'];
		//结束时间
		$end_time = $renewal_info['end_time'];
		//获取功能组编码
		$GLOBALS['gis_service']->get_functions($order_sn);
		//云狗更新
		$cd_result = $GLOBALS['gis_service']->register_update_app($order_goods[0]['cat_id'], $user_name, 
        $start_time, $end_time ,$order_goods,1, 'update', $serial_no, $order_id, $dev_vip = false, $order_sn);
        //清除功能组编码
    	$GLOBALS['gis_service']->clear_functions();
    	//云狗更新不成功
	    if(!$cd_result['success'])
	    {
	    	$this->error = $cd_result['msg'];
	        return false;
	    }
	  	//更新订单表数据
    	$acc_obj->_update_acc_record_by_o_sn($order_sn,array(
        	"order_status" => GOP_PAID
    	));
    	//更新order_info表中结束时间
	    $order_obj->_update_order_record_by_o_id( $order_id , array( 'end_time' => $end_time ));
	    //返回order_id
	    return $order_id;
    }   

    /**
     * 将产品订单使用的结束时间与云狗证书服务的截止时间比较
     * @param $end_time 产品订单使用的结束时间
	 * @author huangbin
	 * @access public       
     * @return bool
     */    
    public function _compare_auth_time($end_time){
    	//私有云信息
    	$private_cloud_info = $GLOBALS['gis_service']->get_private_cloud_info();
    	//获取成功
    	if($private_cloud_info['success']){
    		//云狗证书服务的截止时间
            $limit_time = $private_cloud_info['result']->GetPrivateCloudInfoResult->limitTime;
            //转换成时间戳
            $str_limit_time = strtotime($limit_time);
        }
        return $end_time < $str_limit_time ? true : false;
    }

    /**
     * 取消订单
     * @access public
     * @author huangbin
     * @param int $order_sn 订单编码
     * @param string $verify_msg 审核消息
     * @return boolean 
    */
    public function _cancel_order($order_sn,$verify_msg = ""){
    	//加载zd_db_account_class类库
    	$acc_obj = zd_core::instance('zd_db_account_class');
    	//获取订单信息
    	$acc_info = zd_db_account_class::_get_acc_info_by_o_sn($order_sn);
    	//判断是否存在此订单
    	if (!$acc_info) {
    		$this->error = self::NOT_FIND_ORDER;
    		return false;
    	}
    	//判断是否已扣点
    	if(isset($acc_info['order_status']) && GOP_PAID == $acc_info['order_status']){
    		$this->error = self::HAS_PAIED;
    		return false;
    	}
    	//执行取消订单操作
    	$flag = $acc_obj->_update_acc_record_by_o_sn($order_sn,array('order_status' => 2,'verify_msg' => $verify_msg));
    	return $flag;
    }

    /**
     * 根据产品id生成订单
     * @access public
     * @author huangbin
     * @param string $goods_id 产品id
     * @return mixed
    */
    public function _created_order_by_gid($goods_id){
    	//加载zd_db_goods_class类库
        zd_core::autoload('zd_db_goods_class');
        //获取产品信息
        $goods_info = zd_db_goods_class::_get_goods_info_by_id($goods_id);
        //获取所有插件列表
        $addon_list = $GLOBALS['gis']->get_addon_list($goods_info);
        //产品id列表
        $goods_id_arr = array();
        foreach ($addon_list as $k => $v) {
            $goods_id_arr[$k] = $v['goods_id']; 
        }
        //执行生成订单函数(默认期限12个月)
        $flag = $this->_create_new_order($goods_id,$goods_id_arr,1,12,1,10);
        if ($flag) {
        	//加载zd_db_account_class类库
            $acc_obj = zd_core::instance('zd_db_account_class');
            //获取订单信息
            $acc_info = zd_db_account_class::_get_acc_info_by_acc_id($flag);
            //订单编码
            $order_sn = $acc_info['order_sn'];
            //调用支付扣点接口
            $flag = $this->_do_pay_order($order_sn);
        }
        return $flag;
    }

    /**
     * 返回错误信息
	 * @author huangbin
	 * @access public       
     * @return string
     */
	public function _get_error(){
		return $this->error;
	}
}