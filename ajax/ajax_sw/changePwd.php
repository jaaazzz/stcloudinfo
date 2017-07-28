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

//用户id
$user_id = $_SESSION['user_id'];
//未登录
if (empty($user_id)) {
    die_result(false,'not_login','','');
}
//旧密码
$old_password = isset($_POST['old_password']) ? trim($_POST['old_password']) : '';
//新密码
$new_password = isset($_POST['new_password']) ? trim($_POST['new_password']) : '';
//用户名
$user_name = isset($_POST['user_name']) ? trim($_POST['user_name']) : '';
//加载zd_db_users_class类库
$user_obj = zd_core::instance('zd_db_users_class');
//获取当前用户信息
$user_info = zd_db_users_class::_get_user_info_by_id($user_id);
//执行ucenter密码修改
// $flag = uc_user_edit($user_info['user_name'],$old_password,$new_password,'');
$flag = uc_user_edit($user_name,$old_password,$new_password,'');
$flag = intval($flag);
//执行成功
if ($flag == 1) {
    //加密盐
    $ec_salt = $user_info['ec_salt'];
    //新密码
    $new_password = MD5(MD5(trim($_POST['new_password'])). $ec_salt);
    //要更新的表字段数据数组
    $user_arr = array(
        'password' => $new_password
    );
    //执行更新
    $u_flag = $user_obj->_update_users_record_by_user_id($user_id,$user_arr);
    //返回结果
    die_result($u_flag);
}elseif ($flag == -1) {
    //输入老密码不正确
    die_result(false,'not_same','','');
}
?>