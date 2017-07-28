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
 * 应用相关逻辑类
*/
class zd_apps_class{

	//构造函数
	function __construct($user_id = 0)
	{
		
	}

	/**
	 * 获取首页推荐的应用
	 * @param int $user_id 用户id
	 * @access public
	 * @author huangbin
	 * @return array
	*/
	public static function _get_recommend_app($user_id = 0){
		//加载zd_db_app_class类库
		// zd_core::autoload('zd_db_app_class');
		// //获取数据
		// $app_list = zd_db_app_class::_get_recommend_app_list();
		// //实例化收藏类对象
		// $collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'app'));
		// //遍历应用数据
	 //    foreach ($app_list as &$app){
	 //    	//应用收藏总量
	 //        $app['collection_count'] = $collection_obj->_get_collection_count('','app',$app['id']);
	 //        //用户是否已收藏此应用
	 //        $app['is_collection'] = intval($collection_obj->_is_collection($app['id'],$user_id));
	 //    }
	    //返回数据
	       $sql = "
	       SELECT a. * , IF( c.id, COUNT( a.id ) , 0 ) as collection_count, SUM(IF( c.user_id =".$user_id." ,c.id,0)) as is_collection 
                    FROM {$GLOBALS['ecs']->table('application')} AS a
                    LEFT JOIN {$GLOBALS['ecs']->table('collection')} AS c 
                    ON a.id = c.obj_id
                    WHERE a.is_show_index =1
                    AND a.hidden =0
                    AND a.is_public =1
                    AND a.is_on_sale =1
                    AND a.status=3
                    GROUP BY a.id
                    ORDER BY a.show_order";
                    $app_list = $GLOBALS['db']->getAll($sql);
	    return $app_list;
	}
}

?>