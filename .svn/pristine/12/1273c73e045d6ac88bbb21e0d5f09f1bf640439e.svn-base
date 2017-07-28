<?php
/**
 * Created by PhpStorm.
 * User: zc
 * Date: 16-10-17
 * Time: 下午4:35
 */
define('IN_ECS', true);

require_once(dirname(__FILE__).'/../' .  'includes/init.php');
include_once(ROOT_PATH . 'includes/cls_json.php');
require_once(ROOT_PATH . 'ucenter/lib_user.php');
include_once(ROOT_PATH . 'includes/lib_passport.php');
require_once(ROOT_PATH . 'languages/' .$_CFG['lang']. '/user.php');

if (!defined('FLAG') || !FLAG) die();

$act = $_REQUEST['a'];

/**
 * 发改委登录接口
 * @param username 用户名或邮箱
 * @param password　密码
 * @param back_url　跳转页面
 */
if($act == 'login'){
    $json = new JSON;

    $username = getgpc('username');
    $password = getgpc('password');

    if (empty($username) || empty($password)) {
        die("username or password is null");
    }
    //username is email or username
    $is_email = is_email($username);

    zd_core::instance('zd_db_users_class');
    if($is_email)
    {
        $user_info = zd_db_users_class::_get_user_info_by_email($username);
        if(!empty($user_info) && !empty($user_info['email']))
        {
            $username = $user_info['email'];
            $status  = $user_info['user_id'];
        }
    }else{
        $user_info = zd_db_users_class::_get_user_info_by_username($username);
        if(!empty($user_info))
        {
            $status  = $user_info['user_id'];
        }
    }
    //登录
    if ($user->login($username, $password))
    {
        update_user_info();  //更新用户信息
    }else{
        $status = -1;
        $result['error'] = 1;
        $result['content'] = $_LANG['login_failure'];
    }
    //进行日志记录
    $arr = array(
        'uid'=>$status,
        'action'=>1,
        'objectType'=>1,
        'objectId'=>getgpc('uid','R'),
        'time'=>date("Y-m-d H:i:s"),
        'result'=>1,
        'details'=>$status>0?"登录成功":"登录失败");
    writer_log($arr);
    //登录失败
    if($status < 0)
    {
        die($json->encode($result));
    }else{
        jump();
    }

}
/**
 * 发改委注册接口
 * @param username 用户名或邮箱
 * @param password　密码
 * @param email　邮箱
 */
elseif($act == 'register'){
    $json = new JSON;

    $username = getgpc('username');
    $password = getgpc('password');
    $email = getgpc('email');

    if(strlen($username) < 4)
    {
        $result['error']   = 1;
        $result['content'] = $_LANG['passport_js']['username_shorter'];
        die($json->encode($result));
    }
    if(strlen($password) < 6)
    {
        $result['error']   = 1;
        $result['content'] = $_LANG['passport_js']['password_shorter'];
        die($json->encode($result));
    }
    if (strpos($password, ' ') > 0)
    {
        $result['error']   = 1;
        $result['content'] = $_LANG['passwd_balnk'];
        die($json->encode($result));
    }

    if (register($username, $password, $email) !== false)
    {
        $result['error']   = 0;
    }else{
        $result['error']   = 1;
        $result['content'] = $GLOBALS['err']->last_message();
    }
    die($json->encode($result));
}
/**
 * 统一日志接口 (高分对接)
 * @param  string $uid         当前登陆用户id
 * @param  int    $action      日志动作类型        0-5:默认/登录/查询/下载/删除/更新
 * @param  int    $objectType  当前日志信息的目标客体类型 0-5:默认/系统/数据/模型/服务/产品等
 * @param  string $objectId    目标客体标识
 * @param  int    $result      动作执行结果             0/1:失败/成功
 * @param  string $details     日志的详细描述信息
 * @return json                {"success":"true/false"}
 */
elseif($act == 'writer_log'){
    $arr = array(
        'uid'=>getgpc('uid'),
        'action'=>getgpc('action'),
        'objectType'=>getgpc('objectType'),
        'objectId'=>getgpc('objectId'),
        'time'=>date("Y-m-d H:i:s"),
        'result'=>getgpc('restul'),
        'details'=>getgpc('details'));

    $res = writer_log($arr);
    die_result($res);
}
/**
 * 虚拟机信息注册接口 (高分对接)
 * @param  string $name        新创建的虚拟机的名称
 * @param  string $description 虚拟机描述
 * @param  string $cpu         虚拟CPU信息
 * @param  string $memory      内存信息
 * @param  string $space       硬盘存储空间信息
 * @param  string $operation   虚拟机的操作系统
 * @param  string $platforms   安装的基础运行平台集合，逗号分隔
 * @param  string $modules     安装的模型集合，逗号分隔
 * @param  string $datas       加载的数据清单，逗号分隔
 * @param  string $userId      虚拟机镜像所属的用户
 * @return json    {"success":"true/false"}
 */
elseif($act == 'vm_register'){
    $arr = array(
        "name"=>getgpc('name'),
        "description"=>getgpc('description'),
        "cpu"=>getgpc('cpu'),
        "memory"=>getgpc('memory'),
        "space"=>getgpc('space'),
        "operation"=>getgpc('operation'),
        "platforms"=>getgpc('platforms'),
        "modules"=>getgpc('modules'),
        "datas"=>getgpc('datas'),
        "userId"=>getgpc('userId')
    );
    $res = vm_register($arr);
    die_result($res);
}

