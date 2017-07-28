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
// | Desc: 集成ucenter注册
// +----------------------------------------------------------------------

require_once ROOT_PATH.'uc_api/config.inc.php';
require_once ROOT_PATH.'uc_api/uc_client/client.php';
require_once ROOT_PATH.'includes/lib_passport.php';

//验证邮箱
if ($_GET['do'] == 'check_email') {
	$email = isset($_GET['email']) ? trim($_GET['email']) : '';
	$val_email_flag = uc_user_checkemail($email);
	echo $val_email_flag;
}
//验证用户名称
elseif ($_GET['do'] == 'check_name') {
	$username = isset($_GET['username']) ? trim($_GET['username']) : '';
	$val_name_flag = uc_user_checkname($username);
	echo $val_name_flag;
}
else{
	//用户名
	$username = isset($_POST['username']) ? trim($_POST['username']) : '';
	//密码
	$password = isset($_POST['password']) ? trim($_POST['password']) : '';
	//邮箱
	$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
	//ucenter注册接口
	$uid = uc_user_register($_POST['username'], $_POST['password'], $_POST['email']);
	//初始化返回的数组信息
	$result  = array('error' => 0, 'content' => '');
	//注册失败
	if ($uid < 0) {
		if($uid == -1) {
			$result['error'] = 1;
			$result['content'] = '用户名不合法';
		} elseif($uid == -2) {
			$result['error'] = 1;
			$result['content'] = '包含要允许注册的词语';
		} elseif($uid == -3) {
			$result['error'] = 1;
			$result['content'] = '用户名已经存在';		
		} elseif($uid == -4) {
			$result['error'] = 1;
			$result['content'] = 'Email 格式有误';
		} elseif($uid == -5) {
			$result['error'] = 1;
			$result['content'] = 'Email 不允许注册';
		} elseif($uid == -6) {
			$result['error'] = 1;
			$result['content'] = '该 Email 已经被注册';
		} else {
			$result['error'] = 1;
			$result['content'] = '未定义';
		}
	}
	//注册成功
	else{
		//应用同步插入注册信息
		if (register($username, $password, $email, $uid, $other, true) !== false)
	    {
	        $ucdata = empty($user->ucdata)? "" : $user->ucdata;
	        $result['ucdata'] = $ucdata;
	    }
	}
	die(json_encode($result));
}

?>