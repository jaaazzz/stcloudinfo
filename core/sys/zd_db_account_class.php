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
 * 订单相关操作类 
*/
class zd_db_account_class extends zd_db_base_class {

	/**
	 * 获取用户订单数据
	 * @param int $user_id 用户id
	 * @param int $page 页数
	 * @param int $size 每页数据个数	 
	 * @access public
	 * @author huangbin
	 * @return array
	*/
	public function _get_user_acc_info($user_id, $page, $size, $status){
		$where = '';
		if (!empty($user_id)) {
			$where = " AND acs.user_id = '$user_id'";
		}
		if ($status != 3) {
			$where .= " AND acs.order_status = '$status'";
		}
		//sql语句
		$sql = "SELECT acs.*,ur.user_name,g.envs,g.original_img,g.is_on_sale,g.cat_id,g.file_size FROM "
        . $GLOBALS['ecs'] -> table('account_statement'). " AS acs"
        . " LEFT JOIN ".$GLOBALS['ecs'] -> table('users'). " AS ur"
        . " ON ur.user_id = acs.user_id"
        . " LEFT JOIN ".$GLOBALS['ecs'] -> table('goods'). " AS g"
        . " ON g.goods_id = acs.goods_id"
        . " WHERE acs.is_trial = '0'"
        . " AND acs.is_delete = 0"
        . $where
        . " ORDER BY acs.create_time DESC";
        //获取总数
		$res = $GLOBALS['db']->query($sql);
		//获取数据总数
    	$count = $GLOBALS['db']->num_rows($res);
    	//构造分页语句
        $limit_sql = $this->_select_limit($size, ($page - 1) * $size);
        //执行sql
        $result = $GLOBALS["db"]->getAll($sql.$limit_sql);
        $acc_info['list'] = $result;
        $acc_info['count'] = $count;
        //返回结果
        return $acc_info;
	}

	/**
	 * 根据order_sn获取订单数据
	 * @param int $order_sn 订单编码
	 * @access public
	 * @author huangbin
	 * @return array
	*/
	public static function _get_acc_info_by_o_sn($order_sn){
		//执行
	    $as = $GLOBALS["db"]->getRow("
    		SELECT *
    		FROM " . $GLOBALS["ecs"]->table("account_statement") . "  
    		WHERE order_sn = '$order_sn';
		");
		return $as;
	}

	/**
	 * 根据account_statement_id获取订单数据
	 * @param int $account_statement_id 订单id
	 * @access public
	 * @author huangbin
	 * @return array
	*/
	public static function _get_acc_info_by_acc_id($account_statement_id){
		//执行
	    $as = $GLOBALS["db"]->getRow("
    		SELECT *
    		FROM " . $GLOBALS["ecs"]->table("account_statement") . "  
    		WHERE account_statement_id = '$account_statement_id';
		");
		return $as;
	}

	/**
	 * 根据order_sn获取订单下相关产品数据
	 * @param int $order_sn 订单编码
	 * @access public
	 * @author huangbin
	 * @return array
	*/	
	public static function _get_reassemble_info_by_o_sn($order_sn){
		//执行sql
		$reassemble_info = $GLOBALS['db']->getAll("
	        SELECT ri.start_time,ri.end_time,ri.price,ri.parent_id,goods.goods_id,goods.goods_name,goods_sn,goods.weight_id,
	            goods.cat_id,goods.file_size
	        FROM {$GLOBALS['ecs']->table('account_statement')} ast,{$GLOBALS['ecs']->table('reassemble_info')} ri, 
	            {$GLOBALS['ecs']->table('goods')} goods
	        WHERE order_sn = '$order_sn' and ast.account_statement_id = ri.account_statement_id and ri.goods_id = goods.goods_id
	        ORDER by ri.parent_id
    	");
    	//返回数据
    	return $reassemble_info;
	}

	/**
	 * 根据order_sn获取续点订单下相关产品数据
	 * @param int $order_sn 订单编码
	 * @access public
	 * @author huangbin
	 * @return array
	*/
	public static function _get_renew_goods_info_by_o_sn($order_sn){
		//执行sql
		$renew_goods_info = $GLOBALS['db']->getAll("
	        SELECT ri.start_time,ri.end_time,rg.price,rg.parent_id,goods.goods_id,goods.goods_name,goods_sn,goods.weight_id,
	            goods.cat_id,goods.file_size
	        FROM {$GLOBALS['ecs']->table('account_statement')} ast,{$GLOBALS['ecs']->table('renewal_goods')} rg, 
	             {$GLOBALS['ecs']->table('goods')} goods,{$GLOBALS['ecs']->table('renewal_info')} ri
	        WHERE order_sn = '$order_sn' and ast.account_statement_id = ri.account_statement_id and rg.account_statement_id = ast.account_statement_id and rg.goods_id = goods.goods_id
	        ORDER by rg.parent_id
    	");
    	//返回数据
    	return $renew_goods_info;    	
	}

	/**
	 * 根据订单编码更新部分字段数据
	 * @param int $order_sn 订单编码
	 * @param array $item 字段信息数组
	 * @access public
	 * @author huangbin
	 * @return boolen
	*/
	public function _update_acc_record_by_o_sn($order_sn,$item){
		$sql = "
        	UPDATE " . $GLOBALS["ecs"]->table("account_statement") . " 
        	SET " . $this->_hash_to_string($item) . " 
        	WHERE order_sn = '$order_sn'";
       	//返回执行结果
    	return $GLOBALS["db"]->query($sql);
	}

	/**
	 * 根据订单id获取续点信息
	 * @param int $account_statement_id 订单id
	 * @return array
	 * @author huangbin
	 * @access public
	*/
	public static function _get_renew_info_by_a_id($account_statement_id){
		//执行sql
		$renew_info = $GLOBALS['db']->getRow("
			SELECT * 
			FROM {$GLOBALS['ecs']->table('renewal_info')}
			WHERE account_statement_id = '$account_statement_id'
		");
		//返回结果
		return $renew_info;
	}

    /**
     * 根据order_id获取订单的价格模板类型id
     * @access public 
     * @author huangbin
     * @param int $order_id order_id
     * @return mix
    */
    public static function _get_order_scale_type($order_id)
    {
        $order_sn_info = $GLOBALS['db']->getOne("
            SELECT order_sn 
            FROM {$GLOBALS['ecs']->table('account_statement')} 
            WHERE order_id = '$order_id' AND order_type = 0
            order by account_statement_id asc
        ");
        if ($order_sn_info) {
            $order_scale_type = $GLOBALS['db']->getOne("
                SELECT scale_type 
                FROM {$GLOBALS['ecs']->table(account_ex)}
                WHERE order_sn = '$order_sn_info'
            ");
            return $order_scale_type;
        }
        else{
            return false;
        }
    }
}