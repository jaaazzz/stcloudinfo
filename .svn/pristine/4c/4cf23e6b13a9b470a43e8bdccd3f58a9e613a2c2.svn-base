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
// | Desc: 用户相关流程逻辑类
// +----------------------------------------------------------------------

/**
 * 用户相关流程逻辑类
*/
class zd_users_class{
	/**
     * 初始化
     */
    public function __construct(){

    }

    /**
     * 整合ucenter后,用户登录数据同步
	 * @param string $username 用户名
	 * @param string $password 密码
	 * @return boolen
    */
    public function _uc_login_add_user($username, $password, $email, $uid){
        $flag = false;
        $uname = addslashes($username);
    	//加载zd_db_users_class类库
    	$user_obj = zd_core::instance('zd_db_users_class');
    	//获取用户信息
    	//$user_info = zd_db_users_class::_get_user_info_by_uname($uname);
        //问题说明：在Ucenter管理中心修改用户的user_name后，在当前系统登录时，通过user_name验证用户是否存在问题。
        //        1、通过新的user_name登陆时，会向当前系统的users表中新添加一条记录，而初始的记录没有被删除
        //        2、由于users表中同一个uc_id存在两条记录，在页面显示用户user_name时，默认显示了升序排列的第一条记录的user_name
        //修改说明：通过uc_id获取用户信息，以此判断用户是否在当前系统是否存在
        //        1、如果存在，更新记录。更新SQL中添加对ser_name的更新，删除对uc_id的更新
        //        2、如果不存在，重新插入
        //修改时间：2016.12.06 yKAN
        //$user_info = zd_db_users_class::_get_user_info_by_uid($uid);
        //请求地址
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/UserByUid";
        $api_url_s = $api_url."?uid=".$uid;
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);
        $user = json_decode($message_result,true);
        $user_info = $user['user'];
        //随机生成加密盐
        $ec_salt = rand(1,9999);
        //密码加密
        $password = MD5(MD5($password). $ec_salt);
    	//如果存在此用户
    	if ($user_info) {
    		if (empty($result['ec_salt'])) {
                //更新数据数组
//                $user_item = array(
//                    'password'  => $password,
//                    //'uc_id'     => $uid,
//                    'email'     => $email,
//                    'ec_salt'   => $ec_salt,
//                    'user_name' => $uname
//                );
                //用户id
    			$user_id = $user_info['userId'];
                //执行更新
//                $flag = $user_obj->_update_users_record_by_user_id($user_id,$user_item);
                //请求地址
                $ip = trim($GLOBALS['iggs_api_url_base_url']);

                $api_url = $ip."ecs/update/UsersRecord";
                $api_url_s = $api_url."?user_id=".$user_id."&password=".$password."&email=".$email."&ec_salt=".$ec_salt."&user_name=".$uname;
                //发送请求
                $flag = zd_common_class::_send_get($api_url_s);
                //$flag = "true";
    		}
    	}else{
//            //插入数据数组
//    		$user_item = array(
//    			'user_name' => $uname,
//                'uc_id'     => $uid,
//    			'password'  => $password,
//                'email'     => $email,
//                'ec_salt'   => $ec_salt
//    		);
//    		$flag = $user_obj->_insert_table($user_item,'users');
            //请求地址
            $ip = trim($GLOBALS['iggs_api_url_base_url']);
            $api_url = $ip."ecs/insert/UsersRecord";
            $api_url_s = $api_url."?user_name=".$uname."&uc_id=".$uid."&password=".$password."&email=".$email."&ec_salt=".$ec_salt;
            //发送请求
            $flag = zd_common_class::_send_get($api_url_s);

    	}
        return $flag;
    }
}

?>