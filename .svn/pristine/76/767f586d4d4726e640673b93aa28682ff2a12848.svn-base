<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 修改密码
// +----------------------------------------------------------------------

if(!defined('IN_ECS')){die('Hacking attempt');}

//用户id
$user_id = $_SESSION['user_id'];
//加载zd_db_users_class类库
$user_obj = zd_core::instance('zd_db_users_class');
//获取当前用户信息
$user_info = zd_db_users_class::_get_user_info_by_id($user_id);
//用户旧密码
$password=$user_info['password'];
//加密盐
$ec_salt=$user_info['ec_salt'];
//旧密码加密
$old_password = MD5(MD5(trim($_POST['old_password'])). $ec_salt);
//新密码加密
$new_password = MD5(MD5(trim($_POST['new_password'])). $ec_salt);
//初始化返回信息
$result   = array('success' => '','same' =>'true','old' =>$old_password,'password' =>$password);
//验证密码一致
if($password == $old_password){
    $result['same']   = true;
    //执行更新
    $flag = $user_obj->_update_users_record_by_user_id($user_id,array('password' => $new_password));
    $result['success']   = true;
}
else{
    $result['same']   = false;
    $result['success']   = false;
}
//返回结果
die(json_encode($result));
?>