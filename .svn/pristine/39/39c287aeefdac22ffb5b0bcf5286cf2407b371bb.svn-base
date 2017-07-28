<?php
defined('IN_ECS') OR die('Hacking attempt');

if (empty($back_act))
{
    if (empty($back_act) && isset($GLOBALS['_SERVER']['HTTP_REFERER']))
    {
        $back_act = strpos($GLOBALS['_SERVER']['HTTP_REFERER'], 'user.php') ? './index.php' : $GLOBALS['_SERVER']['HTTP_REFERER'];
    }
    else
    {
        $back_act = 'user.php';
    }
}

if ($back_url)
{
    $back_act = $back_url;
}

$captcha = intval($_CFG['captcha']);
if (($captcha & CAPTCHA_LOGIN) && (!($captcha & CAPTCHA_LOGIN_FAIL) || (($captcha & CAPTCHA_LOGIN_FAIL) && $_SESSION['login_fail'] > 2)) && gd_version() > 0)
{
    $GLOBALS['smarty']->assign('enabled_captcha', 1);
    $GLOBALS['smarty']->assign('rand', mt_rand());
}

//{{

if(stripos($back_act,'http')!==0)
{
	$back_act = $GLOBALS['myself_base_url'] . $back_act;
}

// $url = UC_URL_LOGIN . '&back_url=' . $back_act;
// ecs_header("Location: $url\n");
// exit;
//}}

assign_template();

$smarty->assign('back_act', $back_act);
$smarty->display('user/user_passport.dwt');
