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
 * 收藏操作类
*/
class zd_db_collection_class extends zd_db_base_class {

	// 实例参数配置
    protected $ins_param     = array();
    /**
     * 初始化
     * @param array $ins_param 实例参数数组
     */
    public function __construct($ins_param){
        if(!empty($ins_param)) {
            $this->ins_param = $ins_param;
        }
    }

    /**
     * 收藏功能
     * @param int $obj_id 收藏对象id
     * @param int $user_id 收藏的用户id
     * @return void
    */
    public function _do_collection($obj_id,$user_id){
    	//收藏的类型
    	$obj_type = $this->ins_param['obj_type'];
    	//要插入的数据数组
    	$item = array(
    		'obj_id'   =>   $obj_id,
    		'user_id'  =>   $user_id,
    		'obj_type' =>   $obj_type,
            'on_time'  =>   time()
    	);
    	//执行并返回执行结果
        return $this->_insert_table($item,'collection');
    }

    /**
     * 取消收藏功能
     * @param int $obj_id 收藏对象id
     * @param int $user_id 收藏的用户id
     * @return void
    */    
    public function _cancle_collection($c_id){
    	/* 删除记录 */
        $sql = " DELETE FROM " . $GLOBALS['ecs']->table('collection') .
               " WHERE id = " . $c_id;
        return  $GLOBALS['db']->query($sql);
    }

    /**
     * 判断用户是否已收藏
     * @param int $obj_id 收藏对象id
     * @param int $user_id 收藏的用户id
     * @return void
    */
    public function _is_collection($obj_id,$user_id,$obj_type=''){
    	//收藏的类型
    	$obj_type = !(empty($obj_type)) ? $obj_type : $this->ins_param['obj_type'];
    	//获取记录
    	return $GLOBALS['db']->getOne("
	        SELECT id
	        FROM {$GLOBALS['ecs']->table('collection')}
	        WHERE obj_id = '$obj_id' and user_id = '$user_id' and obj_type = '$obj_type'
    	");
    }

    public function is_collection($obj_id,$user_id,$obj_type=''){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        //收藏的类型
        $api_url = $ip."ecs/iscollection";

        $api_url_s = $api_url."?obj_id=".$obj_id."&user_id=".$user_id."&obj_type=".$obj_type;

            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result['id'];
    }

    /**
     * 获取用户的收藏信息
     * @param int $user_id 用户id
     * @param int $page 页数
     * @param int $size 每页数据个数
     * @param string $type 收藏类型
     * @return array 
     * @author huangbin
    */
    public function _get_user_collection($user_id,$page,$size = 0,$type = ""){
        //初始化返回结果数组
        $result_arr = array();
        //sql语句
        $sql = "
                SELECT * 
                FROM {$GLOBALS[ecs]->table('collection')} 
                WHERE user_id = '$user_id'";
        if (!empty($type)) {
            $sql .= " and obj_type='$type'";
        }
        //构造limit语句
        $limit_sql = $this->_select_limit($size, ($page - 1) * $size);
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);
        //获取记录
        $result_arr['collection'] = $GLOBALS['db']->getAll($sql.$limit_sql);
        $result_arr['count'] = $count;
        //返回结果
        return $result_arr;
    }

    public function get_collection_count($user_id, $type, $obj_id=''){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."hecs/get/collectioncount";

        $api_url_s = $api_url."?obj_type=".$type."&obj_id=".$obj_id;

            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result['count'];
    }

    /**
     * 获取收藏的总量
     * @access
     * @method get||post
     * @param $user_id  用户id
     * @param $type     收藏类型  app应用 soft软件
     * @return
     * @created by  sdd  20160426
     * @modify  [user][time][modifydescribe]
     */
    public function _get_collection_count($user_id, $type, $obj_id=''){
        $sql = "
                SELECT count(*)
                FROM {$GLOBALS[ecs]->table('collection')}
                WHERE 1=1 ";
        if(!empty($user_id)){
            $sql .= " and user_id='$user_id' ";
        }
        if(!empty($type)){
            $sql .= " and obj_type='$type' ";
        }
        if(!empty($obj_id)){
            $sql .= " and obj_id = '$obj_id' ";
        }
        $count = $GLOBALS['db']->getOne($sql);

        return $count;
    }
}