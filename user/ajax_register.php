<?php
    if(!defined('IN_ECS')){die('Hacking attempt');}
    include_once(ROOT_PATH . 'includes/lib_passport.php');
    include_once('includes/cls_json.php');
    $json = new JSON;

    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? trim($_POST['password']) : '';
    $email    = isset($_POST['email']) ? trim($_POST['email']) : '';

    $result   = array('error' => 0, 'content' => '','email_validate'=>false,'send_verify_email'=>false);

    if($GLOBALS['_CFG']['member_email_validate']){
       $result['email_validate']   = true;
    }
    if($GLOBALS['_CFG']['send_verify_email']){
       $result['send_verify_email']   = true; 
    }
    if(empty($_POST['agreement']))
    {
        $result['error']   = 1;
        $result['content'] = $_LANG['passport_js']['agreement'];
        die($json->encode($result));
    }
    else if (strlen($username) < 4)
    {
        $result['error']   = 1;
        $result['content'] = $_LANG['passport_js']['username_shorter'];
        die($json->encode($result));
    }

    if (strlen($password) < 6)
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

    
    if (register($username, $password, $email, $other) !== false)
    {
        /*把新注册用户的扩展信息插入数据库*/
        // $sql = 'SELECT id FROM ' . $ecs->table('reg_fields') . ' WHERE type = 0 AND display = 1 ORDER BY dis_order, id';   //读出所有自定义扩展字段的id
        // $fields_arr = $db->getAll($sql);

        // $extend_field_str = '';    //生成扩展字段的内容字符串
        // foreach ($fields_arr AS $val)
        // {
        //     $extend_field_index = 'extend_field' . $val['id'];
        //     if(!empty($_POST[$extend_field_index]))
        //     {
        //         $temp_field_content = strlen($_POST[$extend_field_index]) > 100 ? mb_substr($_POST[$extend_field_index], 0, 99) : $_POST[$extend_field_index];
        //         $extend_field_str .= " ('" . $_SESSION['user_id'] . "', '" . $val['id'] . "', '" . compile_str($temp_field_content) . "'),";
        //     }
        // }
        // $extend_field_str = substr($extend_field_str, 0, -1);

        // if ($extend_field_str)      //插入注册扩展数据
        // {
        //     $sql = 'INSERT INTO '. $ecs->table('reg_extend_info') . ' (`user_id`, `reg_field_id`, `content`) VALUES' . $extend_field_str;
        //     $db->query($sql);
        // }

        /* 写入密码提示问题和答案 */
        if (!empty($passwd_answer) && !empty($sel_question))
        {
            $sql = 'UPDATE ' . $ecs->table('users') . " SET `passwd_question`='$sel_question', `passwd_answer`='$passwd_answer'  WHERE `user_id`='" . $_SESSION['user_id'] . "'";
            $db->query($sql);
        }
        /* 判断是否需要自动发送注册邮件 */
        if ($GLOBALS['_CFG']['member_email_validate'] && $GLOBALS['_CFG']['send_verify_email'])
        {
            send_regiter_hash($_SESSION['user_id']);
        }
        /* Tom */
        // if($user->login($username,$password))
        // {
        //     update_user_info();
        // }
        
        $ucdata = empty($user->ucdata)? "" : $user->ucdata;
        $result['ucdata'] = $ucdata;
    }
    else
    {
        $result['error']   = 1;
        $result['content'] = $_LANG['sign_up'];
    }

    die($json->encode($result));
?>

