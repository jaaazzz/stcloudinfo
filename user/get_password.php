<?php
/**
 * GISSTORE 修改密码
 * ============================================================================
 * 版权所有 2011-2016 zondycyber。
 * 网站地址: http://www.smaryun.com；
 * ----------------------------------------------------------------------------
 * $Author: ? $
 * $time 2014-8-7 9:23:08
 * ----------------------------------------------------------------------------
 * @desc 页面内容废弃,直接跳转到个人中心页面修改
*/
    /* modify 直接跳转到个人中心进修改密码 begin*/

//    show_message('此页面已废弃');
   if(!defined('IN_ECS')){die('Hacking attempt');}
   include_once(ROOT_PATH . 'includes/lib_passport.php');

   if (isset($_GET['code']) && isset($_GET['uid'])) //从邮件处获得的act
   {
       $code = trim($_GET['code']);
       $uid  = intval($_GET['uid']);

       /* 判断链接的合法性 */
       $user_info = $user->get_profile_by_id($uid);
       if (empty($user_info) || ($user_info && md5($user_info['user_id'] . $_CFG['hash_code'] . $user_info['reg_time']) != $code))
       {
           show_message($_LANG['parm_error'], $_LANG['back_home_lnk'], './', 'info');
       }

       $smarty->assign('uid',    $uid);
       $smarty->assign('code',   $code);
       $smarty->assign('action', 'reset_password');
       $smarty->display('user_passport.dwt');
   }
   else
   {
       //显示用户名和email表单
       $smarty->display('user_passport.dwt');
   }

    // $url = UCENTER."/user.php?a=display_getpassword";

    // ecs_header("Location: $url\n");

    /* modify end */
?>

