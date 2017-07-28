<?php
    if(!defined('IN_ECS')){die('Hacking attempt');}
    include_once('includes/cls_json.php');
    $json = new JSON;

    $chkloginlink = trim($_POST['chklogin']);
    if($chkloginlink){
        ecs_header("Location: $chkloginlink");
        exit;
    }
    else{
        $username = !empty($_POST['username']) ? json_str_iconv(trim($_POST['username'])) : '';
        $password = !empty($_POST['password']) ? trim($_POST['password']) : '';
        $remember = isset($_POST['remember']) && $_POST['remember'] != 0 ? true : false;
        $captcha = !empty($_POST['captcha']) ? json_str_iconv(trim($_POST['captcha'])) : '';
        $result   = array('error' => 0, 'content' => '','email_validate'=> false,'is_validated'=> 0);

        if($GLOBALS['_CFG']['member_email_validate']){
           $result['email_validate']   = true; 
        }

        $captcha = intval($_CFG['captcha']);
        if (($captcha & CAPTCHA_LOGIN) && (!($captcha & CAPTCHA_LOGIN_FAIL) || (($captcha & CAPTCHA_LOGIN_FAIL) && $_SESSION['login_fail'] > 2)) && gd_version() > 0)
        {
            if (empty($captcha))
            {
                $result['error']   = 1;
                $result['content'] = $_LANG['invalid_captcha'];
                die($json->encode($result));
            }

            /* 检查验证码 */
            include_once('includes/cls_captcha.php');

            $validator = new captcha();
            $validator->session_word = 'captcha_login';
            if (!$validator->check_word($_POST['captcha']))
            {
                $result['error']   = 1;
                $result['content'] = $_LANG['invalid_captcha'];
                die($json->encode($result));
            }
        }

        $sql ="select is_validated from ".$ecs->table('users')."where user_name='".$username."'";
        $is_validated= $db->getOne($sql);
        $result['is_validated']  =$is_validated ; 

        if(is_email($username))
        {

            $sql ="select * from ".$ecs->table('users')."where email='".$username."'";

            $user_info = $db->getRow($sql);
            $is_validated=$user_info['is_validated'];
            $result['is_validated']  =$is_validated ; 
            $username_e=$user_info['user_name'];
            if($username_e) $username = $username_e;

        }

        if ($user->login($username, $password, $remember))
        {            
            update_user_info();  //更新用户信息
            //recalculate_price(); // 重新计算购物车中的商品价格
            $smarty->assign('user_info', get_user_info());
            $ucdata = empty($user->ucdata)? "" : $user->ucdata;
            $result['ucdata'] = $ucdata;
            $result['content'] = $smarty->fetch('library/member_info.lbi');
        }
        else
        {
            $_SESSION['login_fail']++;
            if ($_SESSION['login_fail'] > 2)
            {
                $smarty->assign('enabled_captcha', 1);
                $result['html'] = $smarty->fetch('library/member_info.lbi');
            }
            $result['error']   = 1;
            $result['content'] = $_LANG['login_failure'];
        }

        if(isset($_REQUEST["callback"])){

            $call = $_REQUEST["callback"];
            $result = $json->encode($result);
            $result = $call . "(" . $result .")";

            die($result);
        }

        die($json->encode($result));
    }
?>

