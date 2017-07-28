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
 * 价格,价格模板相关操作类
*/
class zd_db_price_class{

	/**
	 * 根据产品id获取产品的价格模板信息
	 * @author huangbin
	 * @param int $goods_id 产品id
	 * @param int $scale_type 价格模板类型id
	 * @access public
	 * @return array
	 */
	public static function _get_goods_base_price_by_id($goods_id,$scale_type = 0){
		$where = '';
		if (!empty($scale_type)) {
			$where .= " and scale_type = '$scale_type'";
		}
		//获取sql
		$goods_group = $GLOBALS['db']->getRow("
		    SELECT price_group_id,price_ratio
		    FROM {$GLOBALS['ecs']->table('goods_base_price')}
		    WHERE goods_id = '$goods_id' $where
		");
		//返回结果
		return $goods_group;
	}

	/**
	 * 根据功能组id获取功能组价格
	 * @author huangbin
	 * @param int $price_group_id 功能组id
	 * @access public
	 * @return int
	 */
	public static function _get_group_price_by_id($price_group_id){
		//获取价格sql
	    $group_price = $GLOBALS['db']->getOne("
	        SELECT price
	        FROM {$GLOBALS['ecs']->table('base_price_group')}
	        WHERE id = '$price_group_id'
	    ");
	    return $group_price ? $group_price : 0;
	}

	/**
	 * 根据功能组id和价格模板类型id获取功能组价格模板信息
	 * @author huangbin
	 * @param int $price_group_id 功能组id
	 * @param int $order_group 价格模板类型id
	 * @access public
	 * @return array
	 */
	public static function _get_group_price_info($price_group_id,$order_group = 0){
		//获取数据sql
	    $group_info =  $GLOBALS['db']->getRow("
	        SELECT price_ratio,minnum
	        FROM {$GLOBALS['ecs']->table('base_price_ex')}
	        WHERE  price_group_id = '$price_group_id' and scale_type = '$order_group'
	   	");
	   	return $group_info;
	}

	/**
	 * 根据产品id获取可定义功能组的插件
	 * 目前只有(381:MapGIS 10 for Desktop,433:IGServer for dot Net,439:IGServer for Java)
	 * 是按照添加的插件进行功能组判定
	 * @author huangbin
	 * @param  $goods_id 产品id
	 * @access  public
	 * @return  array
	 */
	public static function _get_group_plugin_by_id($goods_id){
		$sql = "SELECT p.goods_id,p.group_id,b.group_name,b.price,b.fun_desc" .
	    " FROM " . $GLOBALS['ecs']->table('platform_plugin') ." AS p".
	    " LEFT JOIN " . $GLOBALS['ecs']->table('base_price_group') . "AS b ON b.id = p.group_id".
	    " WHERE parent_id = '$goods_id'";
	    $result = $GLOBALS['db']->getAll($sql);
	    $r_group_plugin = array();
	    foreach ($result as $key => $row) {
	        $sql_group_id = $row['group_id'];
	        $sql_ratio = "SELECT price_ratio,scale_type,concurrent_user,online_user,register_user" .
	                     " FROM " . $GLOBALS['ecs']->table('base_price_ex') .
	                     " WHERE price_group_id = '$sql_group_id'";
	        $ratio_arr = $GLOBALS['db']->getAll($sql_ratio);
	        $p_goods_id = $row['goods_id'];
	        $i_plugin_info['group_id'] = $row['group_id'];
	        $i_plugin_info['group_name'] = $row['group_name'];
	        $i_plugin_info['price'] = $row['price'];
	        $i_plugin_info['fun_desc'] = $row['fun_desc'];
	        $i_plugin_info['radio_arr'] = $ratio_arr;
	        $r_group_plugin[$p_goods_id] = $i_plugin_info;
	    }
    	return $r_group_plugin;
	}

	/**
	 * 根据获取的插件计算功能组id
	 * 目前只有(381:MapGIS 10 for Desktop,433:IGServer for dot Net,439:IGServer for Java)
	 * 是按照添加的插件进行功能组判定,获取规则为所有的功能组id中功能最多为准
	 * @author huangbin
	 * @param  $addon_arr 插件数组
	 * @access  public
	 * @return  group_id 功能组id
	 */
	public static function _get_group_id_by_addon_list($addon_arr){
	    $group_id_arr = array();
	    //需要返回的功能组id初始化
	    $r_group_id = 0;
	    if ($addon_arr && count($addon_arr) > 0) {
	        foreach ($addon_arr as $key => $value) {
	            $sql = "SELECT group_id " .
	            " FROM " . $GLOBALS['ecs']->table('platform_plugin').
	            " WHERE goods_id = '$value'";
	            //获取当前插件id的功能组id
	            $t_goods_id = $GLOBALS['db']->getOne($sql);
	            array_push($group_id_arr, $t_goods_id);
	        }
	    }
	    if (count($group_id_arr) > 0) {
	        //降序排列，SORT_NUMERIC - 把值作为数字来处理
	        rsort($group_id_arr,SORT_NUMERIC);
	        $r_group_id = $group_id_arr[0];
	    }
	    return $r_group_id;
	}

	/**
	 * 获取此订单的框架价格系数类型
	 * @param $group_id 功能组id
	 * @param $order_count 订单数量
	 * @return 价格模板类型 如10,20,30.....
	 */
	public static function _get_group_by_groupid($group_id,$order_count = 1){   
	    if ($group_id) {
	        $group_info =  $GLOBALS['db']->getAll("
	                SELECT scale_type,minnum
	                FROM {$GLOBALS['ecs']->table('base_price_ex')} 
	                WHERE price_group_id = '$group_id'
	        ");
	        $group_info_length = count($group_info);
	        for ($i = $group_info_length -1; $i >= 0; $i--) { 
	            if ($order_count >= $group_info[$i]['minnum']) {
	                $order_group = $group_info[$i]['scale_type'];
	                return $order_group;
	            }
	        }
	    }
	}
	
	/**
	 * 根据获取功能组id,模版类型id获取价格
	 * @author huangbin
	 * @param  $group_id 功能组id
	 * @param  $scale_type 模版类型id
	 * @access  public
	 * @return  price 价格
	 */
	public static function _get_group_price_by_id_type($group_id,$scale_type){
	    $price = 0;
	    $get_order_goods_sql = "SELECT bp.price,be.price_ratio" .
	                           " FROM ". $GLOBALS['ecs']->table('base_price_group') . " AS bp" .
	                           " LEFT JOIN ". $GLOBALS['ecs']->table('base_price_ex') ." AS be ON be.price_group_id = bp.id AND scale_type = '$scale_type'" . 
	                           " WHERE bp.id = '$group_id'";
	    $result = $GLOBALS['db']->getRow($get_order_goods_sql);
	    if ($result) {
	        $price = $result['price'] * $result['price_ratio'];       
	    }
	    return $price;
	}
}