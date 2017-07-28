<?php
    if(!defined('IN_ECS')){die('Hacking attempt');}

    $order_sn = mysql_real_escape_string($_REQUEST['order_sn']);

    $new_package_name = trim($_REQUEST['new_name']);

    if(!$order_sn){ tson('orderid不能为空！');}

    if( empty($_SESSION['user_id'])){ tson('未登录用户'); }

    if(!isset($new_package_name) || $new_package_name == ''){ tson('新名称不能为空！'); }

    /* 防注入,不知道管不管用 */
    $new_package_name = mysql_real_escape_string($new_package_name);

    /* 验证改orderid是否属于当前用户 */
    $chack_sql_result  = $db->getOne( "select count(*) from " . $GLOBALS['ecs']->table('order_info') 
        . " where user_id = " . $_SESSION['user_id'] . " and order_id = '$order_sn'" );

   $chack_sql_result || tson('orderid非当前用户所有！');

    //只能重命名可定制版的，就是goods_id为0的
    $rename_sql = "update " . $GLOBALS['ecs'] -> table('order_goods') 
        . " set goods_name = '$new_package_name' where parent_id = 0 and order_id = (select order_id from "
        . $GLOBALS['ecs'] -> table('order_info') . " where order_id = '$order_sn')";

    $db->query($rename_sql);

    tson(array());
?>

