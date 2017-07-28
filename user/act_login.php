<?php
defined('IN_ECS') OR die('Hacking attempt');

$username = isset($_POST['username']) ? mysql_real_escape_string(trim($_POST['username'])) : '';
$password = isset($_POST['password']) ? mysql_real_escape_string(trim($_POST['password'])) : '';
$back_act = isset($_POST['back_act']) ? trim($_POST['back_act']) : '';

$captcha = intval($_CFG['captcha']);

if (($captcha & CAPTCHA_LOGIN) && (!($captcha & CAPTCHA_LOGIN_FAIL) || (($captcha & CAPTCHA_LOGIN_FAIL) && 
    $_SESSION['login_fail'] > 2)) && gd_version() > 0)
{
    if (empty($_POST['captcha']))
    {
        show_message($_LANG['invalid_captcha'], $_LANG['relogin_lnk'], 'user.php', 'error');
    }

    /* 检查验证码 */
    include_once('includes/cls_captcha.php');

    $validator = new captcha();
    $validator->session_word = 'captcha_login';

    if (!$validator->check_word($_POST['captcha']))
    {
        show_message($_LANG['invalid_captcha'], $_LANG['relogin_lnk'], 'user.php', 'error');
    }
}

if ($user->login($username, $password,isset($_POST['remember'])))
{
    update_user_info();
    recalculate_price();

    $ucdata = isset($user->ucdata)? $user->ucdata : '';
    Header('location:' . $back_act);
    //show_message($_LANG['login_success'] . $ucdata , array($_LANG['back_up_page']), array($back_act), 'info');
}
else
{
    $_SESSION['login_fail'] ++ ;
    show_message($_LANG['login_failure'], $_LANG['relogin_lnk'], 'user.php', 'error');
}


