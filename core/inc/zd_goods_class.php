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

/*
 * 产品相关逻辑类
*/
class zd_goods_class{

	//构造函数
	function __construct($user_id = 0)
	{
		
	}

	/**
     * 根据行业id获取此行业下的所有产品
     * @param string/array $cat_ids 行业id字符串组(22,23)/行业id数组
     * @param int $page 页数
     * @param int $size 每页数据个数
     * @param string $search 关键字
     * @param int $user_id 用户id 
     * @param array $filter_arr 需要进行过滤的字段数组
     * @return array
     * @author huangbin
    */
	public function _get_goods_by_cid($cat_ids, $page, $size, $search = '', $user_id = 0,$filter_arr,$is_show_index=''){
		//初始化返回数据
		$return_result = array();
		//实例zd_db_order_class类库
		$goods_obj = zd_core::instance('zd_db_goods_class');
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//初始化收藏实例对象
		$collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'soft'));
		//获取数据
		$goods_arr = $goods_obj->_get_goods_by_cat_id($cat_ids,$page,$size,$search,$filter_arr,$is_show_index);
		//初始化要构造的数据数组
		$arr = array();
		//遍历数据,重新构造数据
		foreach ($goods_arr['list'] as $key => $row) {
			//产品id
			$arr[$key]['goods_id'] = $row['goods_id'];
			//产品名称
			$arr[$key]['name'] = $row['goods_name'];
			//产品图片路径
			$arr[$key]['goods_img'] = zd_common_class::_convert_url_in_string($row['original_img']);
			//是否已被当前用户收藏
			$arr[$key]['is_collection'] = (is_null($user_id) || empty($user_id) || intval($user_id) <= 0) ? '' : $collection_obj->_is_collection($row['goods_id'],$user_id);
			//产品版本
			$arr[$key]['version'] = $row['version'];
			//行业id
			$cat_id = $row['cat_id'];
			//获取产品类型(web,desktop)
			$arr[$key]['goods_type'] = $GLOBALS['gis']->get_cat_type($cat_id);
			//上下架状态
			$arr[$key]['is_on_sale'] = $row['is_on_sale'];
			//支付点数
			$arr[$key]['point'] = $row['shop_price'];
			//此产品的收藏总数
			$arr[$key]['count'] = $collection_obj->_get_collection_count('','soft',$row['goods_id']);
		}
		/* 构造要返回的数据 */
	    $return_result['goods'] = $arr;
	    $return_result['count'] = $goods_arr['count'];
	    //返回数据
	    return $return_result;
	}

	/**
	 * 根据行业id获取此行业下的所有产品--父子关系的数据
	 * @param string/array $cat_ids 行业id字符串组(22,23)/行业id数组
	 * @param int $page 页数
	 * @param int $size 每页数据个数
	 * @param string $search 关键字
	 * @param int $user_id 用户id
	 * @param array $filter_arr 需要进行过滤的字段数组
	 * @return array
	 * @author ygq
	 */
	public function _get_tree_goods_by_cid($cat_ids, $page, $size, $search = '', $user_id = 0,$filter_arr){
		//初始化返回数据
		$return_result = array();
		//实例zd_db_order_class类库
		$goods_obj = zd_core::instance('zd_db_goods_class');
		$cat=array(
			'web' => 'Web产品',
			'desktop'=>'桌面产品'
		);
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//初始化收藏实例对象
		$collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'soft'));
		//获取父级数据
		$goods_arr = $goods_obj->_get_parent_goods_by_cat_id($cat_ids,$page,$size,$search,$filter_arr);
		//初始化要构造的数据数组
		$arr = array();
		//遍历数据,重新构造数据
		foreach ($goods_arr['list'] as $key => $row) {
			//产品id
			$arr[$key]['goods_id'] = $row['goods_id'];
			//产品名称
			$arr[$key]['name'] = $row['goods_name'];
			//产品图片路径
			$arr[$key]['goods_img'] = zd_common_class::_convert_url_in_string($row['original_img']);
			//是否已被当前用户收藏
			$arr[$key]['is_collection'] = $collection_obj->_is_collection($row['goods_id'],$user_id);
			//产品版本
			$arr[$key]['version'] = $row['version'];
			//行业id
			$cat_id = $row['cat_id'];
			//获取产品类型(web,desktop)
			$arr[$key]['goods_type'] = $cat[$GLOBALS['gis']->get_cat_type($cat_id)];
			//上下架状态
			$arr[$key]['is_on_sale'] = $row['is_on_sale'];
			//支付点数
			$arr[$key]['point'] = $row['shop_price'];
			//此产品的收藏总数
			$arr[$key]['count'] = $collection_obj->_get_collection_count('','soft',$row['goods_id']);
			//子产品
			$child=$this->_get_child_goods_by_id($row['goods_id'],$user_id);
			$arr[$key]['child'] = $child;
			$arr[$key]['child_count'] =count($child);
			
		}
		/* 构造要返回的数据 */
		$return_result['goods'] = $arr;
		$return_result['count'] = $goods_arr['count'];
		//返回数据
		return $return_result;
	}
	public function _get_child_goods_by_id($goods_id,$user_id){
		$sql="select * from ecs_goods where goods_id in(SELECT goods_id FROM ecs_group_goods where parent_id=$goods_id)";
		$res=$GLOBALS['db']->getAll($sql);
		$arr = array();
		$cat=array(
			'web' => 'Web产品',
			'desktop'=>'桌面产品'
		);
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//初始化收藏实例对象
		$collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'soft'));
		foreach ($res as $key => $row){
			//产品id
			$arr[$key]['goods_id'] = $row['goods_id'];
			//产品名称
			$arr[$key]['name'] = $row['goods_name'];
			//产品图片路径
			$arr[$key]['goods_img'] = zd_common_class::_convert_url_in_string($row['original_img']);
			//是否已被当前用户收藏
			$arr[$key]['is_collection'] = $collection_obj->_is_collection($row['goods_id'],$user_id);
			//产品版本
			$arr[$key]['version'] = $row['version'];
			//行业id
			$cat_id = $row['cat_id'];
			//获取产品类型(web,desktop)
			$arr[$key]['goods_type'] = $cat[$GLOBALS['gis']->get_cat_type($cat_id)];
			//上下架状态
			$arr[$key]['is_on_sale'] = $row['is_on_sale'];
			//支付点数
			$arr[$key]['point'] = $row['shop_price'];
			//此产品的收藏总数
			$arr[$key]['count'] = $collection_obj->_get_collection_count('','soft',$row['goods_id']);
		}
		return $arr;
	}
	/**
	 * 修改产品的上下架状态
	 * @param int $goods_id 产品id
	 * @param int $is_on_sale 上下架状态
	 * @access public
     * @author huangbin
	 * @return bool 
	*/
	public function _set_sale_status_by_id($goods_id,$is_on_sale){
		//实例zd_db_order_class类库
		$goods_obj = zd_core::instance('zd_db_goods_class');
		//构造更新字段数组
		$item = array(
			'is_on_sale' => $is_on_sale
		);
		//执行更新函数
        if(strpos($goods_id,',') > 0)
        {
            $flag = $goods_obj->_update_goods_record_batch($goods_id,$item);
        }
        else
        {
            $flag = $goods_obj->_update_goods_record_by_id($goods_id,$item);
        }

		//返回执行结果
		return $flag;		
	}
}

?>