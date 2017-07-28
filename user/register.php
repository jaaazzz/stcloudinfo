<?php
    if(!defined('IN_ECS')){die('Hacking attempt');}
    if ((!isset($back_act)||empty($back_act)) && isset($GLOBALS['_SERVER']['HTTP_REFERER']))
    {
        $back_act = strpos($GLOBALS['_SERVER']['HTTP_REFERER'], 'user.php') ? './index.php' : $GLOBALS['_SERVER']['HTTP_REFERER'];
    }

    if ($back_url)
    {
        $back_act = $back_url;
    }

//{{
// $url = UC_URL_REGISTER . '&back_url=' . $back_act;
// ecs_header("Location: $url\n");
// exit();
//}}
    /* 取出注册扩展字段 */
    // $sql = 'SELECT * FROM ' . $ecs->table('reg_fields') . ' WHERE type < 2 AND display = 1 ORDER BY dis_order, id';
    // $extend_info_list = $db->getAll($sql);
    // $smarty->assign('extend_info_list', $extend_info_list);

    /* 验证码相关设置 */
    if ((intval($_CFG['captcha']) & CAPTCHA_REGISTER) && gd_version() > 0)
    {
        $smarty->assign('enabled_captcha', 1);
        $smarty->assign('rand',            mt_rand());
    }

    /* 密码提示问题 */
    $smarty->assign('passwd_questions', $_LANG['passwd_questions']);

    /* 增加是否关闭注册 */
    $smarty->assign('shop_reg_closed', $_CFG['shop_reg_closed']);
    $smarty->assign('back_act', $back_act);
    $smarty->display('user/user_passport.dwt');
?>
