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
 * 用户操作类
*/
class zd_db_users_class extends zd_db_base_class{

	/**
	 * 根据用户id获取用户名称
	 * @param int $user_id 用户id
	 * @return string 
	*/
	public static function _get_user_name_by_id($user_id = 0){
		//执行sql
		$user_name = $GLOBALS['db']->getOne("
        	SELECT user_name
        	FROM {$GLOBALS['ecs']->table('users')} 
        	WHERE user_id = '$user_id'
    	");
    	//返回数据
    	return $user_name;
	}

	/**
	 * 根据用户id获取用户信息
	 * @param int $user_id 用户id
	 * @return array
	 * @author huangbin
	 * @access public
	*/
	public static function _get_user_info_by_id($user_id){
		//执行sql
		$user_info = $GLOBALS['db']->getRow("
        	SELECT *
        	FROM {$GLOBALS['ecs']->table('users')} 
        	WHERE user_id = '$user_id'
    	");
    	//返回数据
    	return $user_info;		
	}

    public static function get_user_info_by_id($user_id){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/userinfo";
        //加载zd_common_class类库
        $api_url_s = $api_url."?user_id=".$user_id;

        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result['user'];
    }

    /**
     * 根据用户uc_id获取用户信息
     * @param int $uc_id 用户uc_id
     * @return array
     * @author huangbin
     * @access public
    */
    public static function _get_user_info_by_uid($uc_id){
        //执行sql
        //问题说明：1、通过uc_id不能获取用户信息；2、未指明数据记录是否有效
        //修改说明：添加is_delete = 0 AND uc_id = {$uc_id}作为查询条件
        //修改时间：2016.12.06 yKAN
        $user_info = $GLOBALS['db']->getRow("SELECT *".
            " FROM {$GLOBALS['ecs']->table('users')} ".
            " WHERE is_delete = 0 AND uc_id = $uc_id");
        //返回数据
        return $user_info;
    }

    /**
     * 根据用户名获取用户信息
     * @param int $user_name 用户名
     * @return array
     * @author huangbin
     * @access public
    */
    public static function _get_user_info_by_uname($user_name){
        //执行sql
        $user_info = $GLOBALS['db']->getRow("
            SELECT *
            FROM {$GLOBALS['ecs']->table('users')} 
            WHERE user_name = '$user_name'
        ");
         //返回数据
        return $user_info;
    }
    /**
     * 根据用户名获取用户信息
     * @param int $user_id 用户id
     * @return array
     * @author zc
     * @access public
     */
    public static function _get_user_info_by_username($user_name){
        //执行sql
        $user_info = $GLOBALS['db']->getRow("
        	SELECT *
        	FROM {$GLOBALS['ecs']->table('users')}
        	WHERE user_name = '$user_name'
    	");
        //返回数据
        return $user_info;
    }

	/**
	 * 根据用户id更新部分字段数据
	 * @param int $user_id 用户id
	 * @param array $item 字段信息数组
	 * @access public
	 * @author huangbin
	 * @return boolen
	*/
	public function _update_users_record_by_user_id($user_id,$item){
		//执行sql
		$sql = "
        	UPDATE " . $GLOBALS["ecs"]->table("users") . " 
        	SET " . $this->_hash_to_string($item) . " 
        	WHERE user_id = '$user_id'";
       	//返回执行结果
    	return $GLOBALS["db"]->query($sql);
	}
	/**
     *模糊查找用户信息
     *create  at 2016-05-09
     * @author yukang
     * @param (选填)　string $search 查询条件
     * @return 返回值：array()
     **/
    public static function _get_user_list($search='')
    {
        $where = "u.is_delete=0";

        if (!empty($search)) {
            $where .= " AND u.user_name like '%$search%'";
        }
        $sql = "
                SELECT u.user_name,u.user_id,u.email
                FROM {$GLOBALS[ecs]->table('users')} AS u
                WHERE $where
                ORDER BY u.user_id desc";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);

        $res = $GLOBALS['db']->getAll($sql);

        $result['list']  = $res;
        $result['count'] = $count;
        return $result;

    }

    public static function get_user_list($search=''){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/userlist";

        $api_url_s = $api_url."?serach=".$search;

        zd_core::autoload("zd_common_class");

        $result = zd_common_class::_send_get($api_url_s);

        return json_decode($result,true);
    }
    /**
     * 根据email获取用户信息
     * @param  email 用户邮箱
     * @return array
     * @author zc
     * @access public
     */
    public static function _get_user_info_by_email($email){
        //执行sql
        $user_info = $GLOBALS['db']->getRow("
        	SELECT *
        	FROM {$GLOBALS['ecs']->table('users')}
        	WHERE email = '$email'
    	");
        //返回数据
        return $user_info;
    }
}