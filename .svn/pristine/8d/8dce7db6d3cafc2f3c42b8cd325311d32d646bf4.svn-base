<?php
    if(!defined('IN_ECS')){die('Hacking attempt');}
    include(ROOT_PATH . 'includes/lib_passport.php');
    $page=0;
    $user_id=$_SESSION['user_id'];
    $type=$_POST['type'];

    if($type == 'validate'){
        send_regiter_hash($_SESSION['user_id']);

    }
    else{
            if($user_id<1){
            ecs_header("Location: user.php?act=login\n");
            exit;
            }
            else {
                
                $sql="SELECT email FROM ecs_users WHERE user_id='$user_id' ";
                $user_email=$db->getOne($sql);

                //$user->logout();


                $msg['content']    = $_LANG['send_email_validate'].$user_email;
                $msg['content_add']    = $_LANG['send_email_validate_add'];
                $msg['title'] =$_LANG['send_email_validate_title'];
                $msg['email'] =$email;
                $msg['type'] = 'validate';

                assign_template();

                $GLOBALS['smarty']->assign('msg', $msg);
                $GLOBALS['smarty']->display('user_clips.dwt');
            }
    }
?>