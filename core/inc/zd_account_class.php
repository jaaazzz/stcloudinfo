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
 * 订单逻辑类
*/
class zd_account_class{

	/**
	 * 获取用户订单信息
	 * @param int $user_id 用户id
	 * @param int $page 页数
	 * @param int $size 每页数据个数
	 * @return array
	*/
	public function _get_user_acconut($user_id = 0, $page = 0, $size = 0, $status = 3){
		//实例zd_db_account_class类库
		$account_obj = zd_core::instance('zd_db_account_class');
		//加载zd_time_class类库
    	zd_core::autoload('zd_time_class');
    	//加载zd_db_price_class类库
    	zd_core::autoload('zd_db_price_class');
    	//加载zd_common_class类库
    	zd_core::autoload('zd_common_class');
		//获取数据表数据
		$account_arr = $account_obj->_get_user_acc_info($user_id, $page, $size, $status);
		//遍历原始数据,重新需要构造数据
		foreach ($account_arr['list'] as $key => $item) {
			//订单id号
			$account_id = $item['account_statement_id'];
			//订单中框架产品id
			$f_goods_id = $item['goods_id'];
			//order_id
			$order_id = $item['order_id'];
			//订单类型
			$acc_type = $item['order_type'];
			//订单数量
			$account_count = $item['order_count'];
			//订单总价
			$account_price = $item['price'];
			//订单功能组id
			$acc_group_id = $item['group_id'];
			//订单创建时间戳
			$time = $item['create_time'];
			//订单产品类型id
			$cat_id = $item['cat_id'];
			//类型简称
			$nick_name = $GLOBALS['gis']->get_nick_name($item['cat_id']);
			//订单创建时间
    		$account_arr['list'][$key]['date'] = date("Y-m-d H:i:s",$time);
			//获取价格模板类型id
    		$order_scale_type = zd_db_account_class::_get_order_scale_type($order_id);
			//判断订单类型
    		switch ($acc_type){
    			//第一次购买
	        	case GOT_FIRST:
	        		$a_term = zd_db_account_class::_get_reassemble_info_by_o_sn($item['order_sn']);
	        		break;
	        	//续费
	        	case GOT_RENEW:
	        		$a_term = zd_db_account_class::_get_renew_goods_info_by_o_sn($item['order_sn']);
	        		break;
	        	//添加插件
	        	case GOT_REASSEMBLE:
	        		$a_term = zd_db_account_class::_get_reassemble_info_by_o_sn($item['order_sn']);
	        		break;
    		}
    		$total_pay_price = 0;   		
    		$final_file_size = 0;
    		foreach ($a_term as $k2 => $v2) {
    			//产品期限(天数)
    			$period = zd_time_class::second_to_day($v2['end_time']-$v2['start_time']);
    			//产品期限(月数)
    			$month_period = $period / MONTH_LENGTH;
    			//产品的价格
    			$price = $v2['price'];
    			//产品id
    			$goods_id = $v2['goods_id'];
    			/* 插件单价价格模板 */
                $plug_price_ratio_row = zd_db_price_class::_get_group_price_info($acc_group_id,$order_scale_type);
                $plug_price_ratio = $plug_price_ratio_row['price_ratio'] ? $plug_price_ratio_row['price_ratio'] : 1;
                /* 产品实际支付点数 */
                $pay_price = zd_common_class::_price_format($price * $plug_price_ratio * $account_count * $month_period);
                $a_term[$k2]['pay_price'] = $pay_price;  
                //所有产品支付总点数
                $total_pay_price += $pay_price;
                //产品大小累加
                $final_file_size += intval($v2['file_size']);
    		}
    		$final_file_size_format = $final_file_size == 0 ? '未知' : zd_common_class::_get_real_size($final_file_size);
    		$account_arr['list'][$key]['file_size'] = $final_file_size_format;
    		//订单产品数据
    		$account_arr['list'][$key]['plugins'] = $a_term;
    		//订单期限
    		$account_arr['list'][$key]['period'] = $period;
    		//产品图片
    		$account_arr['list'][$key]['goods_img'] = zd_common_class::_convert_url_in_string($item['original_img']);
    		$account_arr['list'][$key]['price'] = floatval($account_price);
    		$account_arr['list'][$key]['top_cat'] = $nick_name[0];
    		$account_arr['list'][$key]['type'] = $nick_name[1];
		}
		return $account_arr;
	}
}

?>