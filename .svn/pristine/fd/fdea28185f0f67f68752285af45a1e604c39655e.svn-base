<?php
/**
 * User: wenbaolin
 * Date: 2014-5-15
 * 用于检查当前登录用户以及验证token
 * 这个页面还有个作用就是，根据cookie实现自动登录
 */
if(!defined('IN_ECS')){die('Hacking attempt');}

//令牌，用于从一个环境跳到另外一个环境实现自动登录
@$token = ($_REQUEST["token"]);

//如果token中包含%,则说明token没有进行转译，必须处理
if($token && strpos($token,'%') !== false){
    $token = urldecode ($token);
}

//回跳的url
@$bac    = $_REQUEST["bac"];

if(isset($token)){

    //根据token实现登录
    login_from_token($token);

}

{

    if(isset($bac)){
        
        //如果有回跳页面，直接回跳
        //ecs_header($bac);
        echo '<script type="text/javascript">window.location.href="' . $bac . '";</script>';
        exit;

    }else{

        //没有回跳页面，输出json
        die_user_info();

        die;
    }

}


function die_user_info(){

    //普通的验证请求，获取当前的用户信息
    $uid = $_SESSION['user_id'];
    $username = $_SESSION['user_name'];
    $success = !empty($uid);

    $out_arr = array(
        "success"   => $success,
        "uid"       => $uid,
        "user_name" => $username
    );

    $result = json_encode($out_arr);

    if(isset($_REQUEST["callback"])){

        $call = $_REQUEST["callback"];
        $result = json_encode($out_arr);
        $result = $call . "(" . $result .")";

    }

    die($result);
}

function check_token($token){

    $token_user = zd_authcode($token,"DECODE",get_zd_key());

    $token_user = json_decode($token_user);

    if($token_user && $token_user->uid){

        if($GLOBALS['redis']){
            //如redis存在，但获取不到相关的值，说明已经使用过了
            $value = $GLOBALS['redis']->get(md5($token));
            if(empty($value)){
                return null;
            }
        }
    }

    if($token_user && $token_user->ip != real_ip()){
        //生成token的ip和当前ip不一致，不能让其登录
        //不过这种做法可能存在问题，如果两个浏览器一个用代理，一个不用代理，他们的ip可能不一样
        //return null;
    }

    return $token_user;
}

function login_from_token($token){

    global $user;

    //存在token。需要根据token来登录
    $token_user = check_token($token);

    if(empty($token_user) || empty($token_user->uid)){

        //token无效
        return;
    }



    $uid = $token_user->uid;

    if($_SESSION['user_id'] == $uid){
        //如果请求登录的id和已登录的id一致，返回
        update_user_info();

        return;
    }

    if($_SESSION['user_id'] > 0){
        //已有其他用户登录，必须先让其退出
        $user->logout();
    }

    $sql = "SELECT user_id,user_name,email FROM " . $GLOBALS['ecs']->table('users') . " WHERE user_id =$uid LIMIT 1";
    $row = $GLOBALS['db']->getRow($sql);

    if($row){

        $_SESSION["user_id"] = $row["user_id"];
        $_SESSION["user_name"] = $row["user_name"];

        //指定的用户登录，这里可以只使用用户，不用密码直接登录
        $user->login($row["user_name"],null,true);

        update_user_info();

    }
}