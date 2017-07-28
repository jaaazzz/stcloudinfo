<?php

define('IN_ECS', true);
require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');
$act=$_REQUEST['act']?$_REQUEST['act']:'list';
zd_admin_core::instance('zd_admin_log_class');
$smarty->assign('left',    '用户管理');
$smarty->assign('user_id',$_SESSION['admin_id']);

if($act=='list'){
    $page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
    $size = 10;
    $um=isset($_REQUEST['um']) ? $_REQUEST['um'] : '';
    $email=isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
    $res=get_admin_user_list($um,$email,$size,$page);//$_SESSION['admin_id'],
    $user_list=$res['data'];
    $total_page=$res['total_page'];
    $role_array=array(
        array('value'=>'用户管理','url'=>'user_list.php','img'=>'用户管理.png'),
        array('value'=>'应用管理','url'=>'app_manage.php','img'=>'应用管理.png'),
        array('value'=>'资源管理','url'=>'rm_cloudhost.php','img'=>'资源管理.png'),
        array('value'=>'日志管理','url'=>'admin_oper_log.php','img'=>'日志管理.png'),
        array('value'=>'系统设置','url'=>'set_config.php','img'=>'系统设置.png')
     );
    $smarty->assign('role_array',     $role_array);
    $smarty->assign('user_list',     $user_list);
    $smarty->assign('total_page',    $total_page);
    $smarty -> assign('page', $page);
    $smarty -> assign('size', $size);
    $smarty -> assign('count', $res['count']);
    $smarty -> assign('url', 'admin_user_list.php');
    $smarty -> assign('um', $um);
    $smarty -> assign('email', $email);
    $smarty -> assign('current_url', 'admin_user_list.php?um='.$um.'&eamil='.$email);
    $smarty->display('admin_user_list.htm');
}
elseif($act=='add_user'){
    $user=json_decode(str_replace('\\','',$_REQUEST['user']),true);
    $user['password']=md5($user['password']);
    $user['add_time']=time();
    is_exist_username($user['user_name'],true)&&die('用户名已存在！');
    is_exist_email($user['email'],true)&&die('邮箱已存在！');

    if($GLOBALS['db']->insert('ecs_admin_user',$user)>0){
        $res='ok';
        zd_admin_log_class::create_admin_log('管理员用户管理',"添加管理员[{$user['user_name']}]成功");
    }else{
        $res='创建用户失败';
        zd_admin_log_class::create_admin_log('管理员用户管理',"添加管理员[{$user['user_name']}]失败");
    }

    die($res);
}
elseif($act=='edit_user'){
    $user=json_decode(str_replace('\\','',$_REQUEST['user']),true);
    $user_id=empty($_REQUEST['user_id'])?0:$_REQUEST['user_id'];

    //密码参数
    $ec_salt = $GLOBALS['db']->getOne('select ec_salt from ecs_admin_user where user_id=' . $user_id);
    if(!empty($user['password'])){
        $user['password']=md5($user['password']);
        if(!empty($ec_salt)){
            $user['password']=md5($user['password'].$ec_salt);
        }
    }

    $where=array('user_id'=>$user_id);

    if($GLOBALS['db']->update('ecs_admin_user',$user,$where)){
        $res='ok';
        zd_admin_log_class::create_admin_log('管理员用户管理',"修改管理员[{$user['user_name']}]成功");
    }else{
        $res='修改用户失败';
        zd_admin_log_class::create_admin_log('管理员用户管理',"修改管理员[{$user['user_name']}]成功");
    }
    die($res);
}
elseif($act=='get_user_by_id'){
    $user_id=empty($_REQUEST['user_id'])?0:$_REQUEST['user_id'];
    $user=get_user_by_id_industry($user_id,true);
    die(json_encode($user));
}
elseif($act=='delete_user'){
    $ids=empty($_REQUEST['ids'])?0:$_REQUEST['ids'];
    $names=get_usernames_by_ids($ids,true);
    if(delete_user_by_id_array($ids,true)){
        $res='ok';
        zd_admin_log_class::create_admin_log('管理员用户管理',"删除管理员[$names]成功");
    }else{
        $res='删除用户失败';
        zd_admin_log_class::create_admin_log('管理员用户管理',"删除管理员[$names]成功");
    }
    die($res);
}