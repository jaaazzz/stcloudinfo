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
 * 订单操作类
*/
class zd_db_order_class extends zd_db_base_class {

	/* 构造函数 */
    public function __construct(){

    }

    /**
     * 获取用户已购软件数据
     * @param int $user_id 用户id
     * @param int $page 页数
     * @param int $size 每页数据个数   
     * @access public
     * @author huangbin
     * @return array
    */
    public function _get_user_order_info($user_id, $page, $size){
        //sql语句
        $sql = "
            SELECT orderinfo.order_id,orderinfo.add_time,orderinfo.end_time,orderinfo.order_sn,orderinfo.order_count,
                   orderinfo.group_id,goods.goods_name,goods.version,goods.original_img,goods.file_size,goods.is_on_sale,
                   goods.cat_id,goods.envs,goods.goods_id,goods.shop_price,
                   ordergoods.goods_name as goods_new_name,ordergoods.parent_id,goods.file_info
            FROM {$GLOBALS['ecs']->table('goods')} goods,
                 {$GLOBALS['ecs']->table('order_goods')} ordergoods,
                 {$GLOBALS['ecs']->table('order_info')} orderinfo
            WHERE orderinfo.order_id = ordergoods.order_id and
                  ordergoods.parent_id = 0 and      
                  orderinfo.order_status = 1 and orderinfo.pay_status = 2 and 
                  goods.goods_id = ordergoods.goods_id and
                  orderinfo.user_id = '$user_id'
            ORDER BY orderinfo.add_time DESC
        ";
        //获取总数
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);
        //构造分页语句
        $limit_sql = $this->_select_limit($size, ($page - 1) * $size);
        //执行sql
        $result = $GLOBALS["db"]->getAll($sql.$limit_sql);
        $order_info['list'] = $result;
        $order_info['count'] = $count;
        //返回结果
        return $order_info;
    }

    /**
     * 根据订单id获取订单信息
     * @param int $order_id 订单id
     * @param int $user_id  用户id
     * @return array
     * @author huangbin
    */
    public static function _get_order_info_by_id($order_id,$user_id){
    	//获取信息
    	$order_info = $GLOBALS['db']->getRow("
        	SELECT * 
        	FROM {$GLOBALS['ecs']->table('order_info')} orderinfo 
        	WHERE order_id = '$order_id' and user_id = '$user_id'"
        );
        //返回结果
        return $order_info;
    }

    /**
     * 根据订单id获取订单中的产品信息
     * @param int $order_id 订单id
     * @return array
     * @author huangbin
    */    
    public static function _get_goods_info_by_order_id($order_id,$is_single = false){
        //获取信息
        $goods_info = $GLOBALS['db']->getAll("
            SELECT goods.* 
            FROM {$GLOBALS['ecs']->table('goods')} goods,{$GLOBALS['ecs']->table('order_info')} orderinfo, 
                {$GLOBALS['ecs']->table('order_goods')} ordergoods
            WHERE goods.goods_id = ordergoods.goods_id 
                and ordergoods.order_id = orderinfo.order_id and orderinfo.order_id = '$order_id'
                and goods.is_delete = 0 and goods.is_on_sale = 1
            ORDER BY ordergoods.parent_id asc
        ");
        //返回结果
        return $is_single ? $goods_info[0] : $goods_info;
    }

    /**
     * 根据订单id更新部分字段数据
     * @param int $order_id 订单id
     * @param int $group_id 功能组id
     * @access public
     * @author huangbin
     * @return boolen
    */
    public function _update_order_record_by_o_id($order_id,$item){
        $sql = "
            UPDATE " . $GLOBALS["ecs"]->table("order_info") . " 
            SET " . $this->_hash_to_string($item) . "
            WHERE order_id = '$order_id'";
        //返回执行结果
        return $GLOBALS["db"]->query($sql);
    }

    /**
     * 判断用户是否已购买过某产品
     * @param $user_id
     * @param $goods_id
     * @author zc
     * @return $order_id
     */
    public function _get_order_id_by_user_goods_id($user_id,$goods_id){
        $now_time = strtotime(date('Y-m-d 00:00:00',time()));

        $sql = "
            SELECT orderinfo.order_id
            FROM {$GLOBALS['ecs']->table('order_info')} orderinfo,
                 {$GLOBALS['ecs']->table('order_goods')} ordergoods
            WHERE ordergoods.order_id = orderinfo.order_id and orderinfo.user_id = '$user_id'
                  and ordergoods.goods_id = '$goods_id' and orderinfo.end_time > $now_time
                  ORDER BY orderinfo.add_time DESC";
        //返回执行结果
        return $GLOBALS["db"]->getOne($sql);
    }

    /**
     * 根据订单获取未支付插件
     * @param $order_id
     * @param $addon_list
     * @author zc
     * @return $addon_unpay_list
     */
    public function _get_unpay_list_by_order_id($order_id,$addon_list){
        $sql = "
            SELECT ordergoods.goods_id
            FROM {$GLOBALS['ecs']->table('order_info')} orderinfo,
                 {$GLOBALS['ecs']->table('order_goods')} ordergoods
            WHERE ordergoods.order_id = orderinfo.order_id and orderinfo.order_id = '$order_id'";
        $addons =  $GLOBALS["db"]->getAll($sql);

        foreach ($addons AS $key => $value)
        {
            $addon_pay_list[] = $value['goods_id'];
        }
        foreach($addon_list as $val)
        {
            if(!in_array($val,$addon_pay_list))
            {
                $addon_unpay_list[] = $val;
            }
        }
        return $addon_unpay_list;
    }
}

?>