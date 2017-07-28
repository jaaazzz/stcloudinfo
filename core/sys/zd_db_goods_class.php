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
 * 产品操作类
*/
class zd_db_goods_class extends zd_db_base_class{

	/* 构造函数 */
    public function __construct(){

    }
    /**
     * 根据行业id获取此行业下的所有产品
     * @param string/array $cat_ids 行业id字符串组(22,23)/行业id数组
     * @param int $page 页数
     * @param int $size 每页数据个数
     * @param string $search 关键字
     * @param array $filter_arr 需要进行过滤的字段数组
     * @return array
     * @author huangbin
    */
    public function _get_goods_by_cat_id($cat_ids,$page,$size,$search = '',$filter_arr,$is_show_index=''){
    	//如果是数组,则转换为字符串组
    	if (is_array($cat_ids) && count($cat_ids) > 0) {
    		$cat_ids = implode(',',$cat_ids);
    	}
        //初始化过滤语句
        $where = "";
        //增加字段过滤
        if (is_array($filter_arr) && count($filter_arr) > 0) {
            foreach ($filter_arr as $k => $v) {
                if ($k == 'is_on_sale' && $v != '-1') {
                    $where .= "g.".$k." = ".$v." AND "; 
                }
            }
        }
        else{
            $where .= "g.is_on_sale = 1 AND ";
        }
    	//构造行业过滤语句
    	$where .= "g.is_delete = 0 AND g.cat_id IN ($cat_ids)";
    	if (!empty($search)) {
    		$where .= " and g.goods_name like '%$search%'";
    	}

        //是否首页显示
        if(!empty($is_show_index))
        {
            $where .= 'and is_shipping = ' . $is_show_index;
        }

    	/* 获得商品列表 */
	    $sql = "SELECT g.cat_id,g.goods_id,g.version,g.is_on_sale,
		               g.goods_name, g.goods_name_style,g.shop_price,
		               g.original_img
		        FROM {$GLOBALS[ecs]->table('goods')} AS g
		        WHERE $where
		        GROUP BY g.goods_id
		        ORDER BY g.cat_id,sort_order, g.goods_id desc";
		$res = $GLOBALS['db']->query($sql);
		//获取数据总数
    	$count = $GLOBALS['db']->num_rows($res);
    	//构造分页语句
        $limit_sql = $this->_select_limit($size, ($page - 1) * $size);
        //执行sql
        $result = $GLOBALS["db"]->getAll($sql.$limit_sql);
        /* 构造返回数据 */
        $goods_list['list'] = $result;
        $goods_list['count'] = $count;
        //返回结果
        return $goods_list;
    }

    /**
     * 根据行业id获取此行业下的所有父级别产品
     * @param string/array $cat_ids 行业id字符串组(22,23)/行业id数组
     * @param int $page 页数
     * @param int $size 每页数据个数
     * @param string $search 关键字
     * @param array $filter_arr 需要进行过滤的字段数组
     * @return array
     * @author ygq
     */
    public function _get_parent_goods_by_cat_id($cat_ids,$page,$size,$search = '',$filter_arr){
        //如果是数组,则转换为字符串组
        if (is_array($cat_ids) && count($cat_ids) > 0) {
            $cat_ids = implode(',',$cat_ids);
        }
        //初始化过滤语句
        $where = "";
        //增加字段过滤
        if (is_array($filter_arr) && count($filter_arr) > 0) {
            foreach ($filter_arr as $k => $v) {
                if ($k == 'is_on_sale' && $v != '-1') {
                    $where .= "g.".$k." = ".$v." AND ";
                }
            }
        }
        else{
            $where .= "g.is_on_sale = 1 AND ";
        }
        //构造行业过滤语句
        $where .= "g.is_delete = 0 AND g.cat_id IN ($cat_ids) and g.goods_id in(SELECT goods_id FROM ecs_group_goods where parent_id=0)";

        if (!empty($search)) {
            $where .= " and g.goods_name like '%$search%'";
        }
        /* 获得商品列表 */
        $sql = "SELECT g.cat_id,g.goods_id,g.version,g.is_on_sale,
		               g.goods_name, g.goods_name_style,g.shop_price,
		               g.original_img
		        FROM {$GLOBALS[ecs]->table('goods')} AS g
		        WHERE $where
		        GROUP BY g.goods_id
		        ORDER BY g.cat_id,sort_order, g.goods_id desc";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);
        //构造分页语句
        if(!is_null($size) && !empty($size) && !is_null($page) && !empty($page) && intval($size) > 0 && intval($page) > 0)
        {
            $limit_sql = $this->_select_limit($size, ($page - 1) * $size);
            $sql .= $limit_sql;
        }
        //执行sql
        $result = $GLOBALS["db"]->getAll($sql);
        /* 构造返回数据 */
        $goods_list['list'] = $result;
        $goods_list['count'] = $count;
        //返回结果
        return $goods_list;
    }

    /**
     * 根据产品id设置产品的上下架状态
     * @param int $goods_id 产品id
     * @param array $item 字段信息数组
     * @return array
     * @access public
     * @author huangbin
    */
    public function _update_goods_record_by_id($goods_id,$item){
        //执行sql
        $sql = "
            UPDATE " . $GLOBALS["ecs"]->table("goods") . " 
            SET " . $this->_hash_to_string($item) . " 
            WHERE goods_id = '$goods_id'";
        //返回执行结果
        return $GLOBALS["db"]->query($sql);
    }

    /**
     * 根据产品id批量设置产品的上下架状态
     * @param int $goods_array 产品id数组
     * @param array $item 字段信息数组
     * @return mixed
     */
    public function _update_goods_record_batch($goods_array,$item){
        //执行sql
        $sql = "
            UPDATE " . $GLOBALS["ecs"]->table("goods") . "
            SET " . $this->_hash_to_string($item) . "
            WHERE goods_id IN ($goods_array)";
        //返回执行结果
        return $GLOBALS["db"]->query($sql);
    }

    /**
     * 根据产品id获取此产品信息
     * @param int $goods_id 产品id
     * @return array
     * @author huangbin
    */    
    public static function _get_goods_info_by_id($goods_id){
    	//获取sql
    	$goods_info = $GLOBALS['db']->getRow("
	        SELECT *
	        FROM {$GLOBALS['ecs']->table('goods')}
	        WHERE goods_id = '$goods_id'
    	");
    	//返回结果
    	return $goods_info;
    }

    /**
     * add by zc 2016-09-22
     * 根据多个产品id判断是否属于同一框架
     * @param $goods_id_list
     * @return mixed
     */
    public function _judge_is_parent_by_goods_id($goods_id_list){
        $sql = "SELECT goods_id FROM {$GLOBALS['ecs']->table('group_goods')} WHERE parent_id = (SELECT parent_id FROM {$GLOBALS['ecs']->table('group_goods')} WHERE goods_id = '$goods_id_list[0]')";
        $goods = $GLOBALS['db']->getAll($sql);

        foreach ($goods AS $key => $value)
        {
            $goods_list[] = $value['goods_id'];
        }
        foreach($goods_id_list as $val)
        {
            if(!in_array($val,$goods_list)) return false;
        }
        return true;
    }

    /**
     * add by zc 2016-09-22
     * 根据产品id获取其框架id
     * @param $goods_id
     * @return mixed
     */
    public function _get_parent_id_by_goods_id($goods_id){
        $sql = "SELECT parent_id FROM {$GLOBALS['ecs']->table('group_goods')} WHERE goods_id = '$goods_id'";
        return $GLOBALS['db']->getOne($sql);
    }
}
?>