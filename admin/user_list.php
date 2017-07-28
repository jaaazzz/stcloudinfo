<?php
define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');
require_once ROOT_PATH.'uc_api/config.inc.php';
require_once ROOT_PATH.'uc_api/uc_client/client.php';
require_once ROOT_PATH.'includes/lib_passport.php';
$smarty->assign('left',    '用户管理');
zd_admin_core::instance('zd_admin_log_class');
$act=$_REQUEST['act']?$_REQUEST['act']:'list';
$PHP_SELF=$_SERVER['PHP_SELF'] ? $_SERVER['PHP_SELF'] : $_SERVER['SCRIPT_NAME'];
$arr=explode('/',$PHP_SELF);
$baseUrl=$arr[0].'/'.$arr[1].'/';
$service_url = $base_url_config['cloud_dog'];
//用户数量
$user_point = get_userCount($service_url);

$smarty->assign('baseUrl',     $baseUrl);
$smarty->assign('point',   $user_point);
if($act=='list'){
    $page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
    $um=isset($_REQUEST['um']) ? $_REQUEST['um'] : '';
    $email=isset($_REQUEST['email']) ? $_REQUEST['email'] : '';
    $size = 10;
    $res=get_user_list($um,$email,$size,$page);
    $user_list=$res['data'];
    $total_page=$res['total_page'];
    $smarty->assign('user_list',     $user_list);
    $smarty->assign('total_page',    $total_page);
    $smarty -> assign('page', $page);
    $smarty -> assign('size', $size);
    $smarty -> assign('count', $res['count']);
    $smarty -> assign('current_url', 'user_list.php?um='.$um.'&eamil='.$email);
    $smarty -> assign('um', $um);
    $smarty -> assign('email', $email);
    $smarty -> assign('url', 'user_list.php');
    $smarty->display('user_list.htm');
}

elseif($act=='add_user'){
    $user=json_decode(str_replace('\\','',$_REQUEST['user']),true);
    $user_password =$user['password'];
    $user['password']=md5($user['password']);
    $user['reg_time']=time();
    is_exist_username($user['user_name'])&&die('用户名已存在！');
    is_exist_email($user['email'])&&die('邮箱已存在！');
    //$res=$GLOBALS['db']->insert('ecs_users',$user)>0?'ok':'创建用户失败';
    $new_point=intval($user['point_all']);
    if($new_point>0){
        //点数配额超出总剩余点数
        if($new_point>intval($user_point['max_can_give_point'])){
            die('超出总点数余额');
        }
    }
    if($GLOBALS['db']->insert('ecs_users',$user)>0){
        $uid = uc_user_register($user['user_name'], $user_password, $user['email']);
        $res='ok';
        zd_admin_log_class::create_admin_log('用户管理',"添加用户[{$user['user_name']}]成功");
    }else{
        $res='创建用户失败';
        zd_admin_log_class::create_admin_log('用户管理',"添加用户[{$user['user_name']}]失败");
    }
    die($res);
}
elseif($act=='edit_user'){
    $user=json_decode(str_replace('\\','',$_REQUEST['user']),true);
    $user_id=empty($_REQUEST['user_id'])?0:$_REQUEST['user_id'];
    //密码参数
    $ec_salt = $GLOBALS['db']->getOne('select ec_salt from ecs_users where user_id=' . $user_id);
    if(!empty($user['password'])){
        $user['password']=md5($user['password']);
        if(!empty($ec_salt)){
            $user['password']=md5($user['password'].$ec_salt);
        }
    }
    $user_info=get_user_by_id_industry($user_id);
    $new_point=intval($user['point_all']);
    $old_point=intval($user_info['point_all']);
    $point_str="";
    //点数配额增加的情况
    if($new_point>$old_point){
        //点数配额超出总剩余点数
        if(($new_point-$old_point)>intval($user_point['max_can_give_point'])){
            die('超出总点数余额');
        }
        $user['point_have']=intval($user_info['point_have'])+($new_point-$old_point);
        $point_str.="点数配额增加:".($new_point-$old_point)."。";
    }
    //点数配额减少的情况
    elseif($new_point<$old_point){
        if(intval($user_info['point_have'])<($old_point-$new_point)){
            die('回收的点数配额超出用户点数余额');
        }else{
            $user['point_have']=intval($user_info['point_have'])-($old_point-$new_point);
            $point_str.="点数配额减少:".($old_point-$new_point)."。";
        }
    }

    $new_host=intval($user['host_num']);
    $old_host=intval($user_info['host_num']);
    $host_str="";
    //主机配额增加的情况
    if($new_host>$old_host){
        $user['host_have']=intval($user_info['host_have'])+($new_host-$old_host);
        $host_str.="主机配额增加:".($new_host-$old_host)."。";
    }
    //主机配额减少的情况
    elseif($new_host<$old_host){
        if(intval($user_info['host_have'])<($old_host-$new_host)){
            die('回收的主机配额超出用户主机余额');
        }else{
            $user['host_have']=intval($user_info['host_have'])-($old_host-$new_host);
            $host_str.="主机配额减少:".($old_host-$new_host)."。";
        }
    }
    $where=array('user_id'=>$user_id);

    if($GLOBALS['db']->update('ecs_users',$user,$where)){
        $res='ok';
        zd_admin_log_class::create_admin_log('用户管理',"修改用户[{$user_info['user_name']}]成功。".$point_str.$host_str);
    }else{
        $res='修改用户失败';
        zd_admin_log_class::create_admin_log('用户管理',"修改用户[{$user_info['user_name']}]失败。".$point_str.$host_str);
    }

    die($res);
}
elseif($act=='get_user_by_id'){
    $user_id=empty($_REQUEST['user_id'])?0:$_REQUEST['user_id'];
    $user=get_user_by_id_industry($user_id);
    die(json_encode($user));
}
elseif($act=='delete_user'){
    $ids=empty($_REQUEST['ids'])?0:$_REQUEST['ids'];
    $names=get_usernames_by_ids($ids);
    if(delete_user_by_id_array($ids)){
        $res='ok';
        zd_admin_log_class::create_admin_log('用户管理',"删除用户[$names]成功");
    }else{
        $res='删除用户失败';
        zd_admin_log_class::create_admin_log('用户管理',"删除用户[$names]失败");
    }
    die($res);
}
elseif($act=='import'){
    require_once('Classes/PHPExcel.php');
    require_once('Classes/PHPExcel/IOFactory.php');
    $file_path=ROOT_PATH.'temp/'.$_FILES['excel']['name'];
    move_uploaded_file($_FILES['excel']['tmp_name'],$file_path);
    $objPHPExcel = PHPExcel_IOFactory::load($file_path);
    $sheet = $objPHPExcel->getSheet(0);
    $highestRow = $sheet->getHighestRow(); // 取得总行数
    $highestColumm = $sheet->getHighestColumn(); // 取得总列数

    if($sheet->getCell('A1')->getValue()!='用户名'||$sheet->getCell('B1')->getValue()!='邮箱'||$sheet->getCell('C1')->getValue()!='密码'||$sheet->getCell('D1')->getValue()!='点数配额'||$sheet->getCell('E1')->getValue()!='云主机数'||$sheet->getCell('F1')->getValue()!='备注'){
        die('请检查导入文件的列头');
    }
    try{
        $u_array=array();
        $e_array=array();
        $info=$user_point;
        $max_point=$info['max_can_give_point'];
        $p=$info['max_can_give_point'];
        $GLOBALS['db']->query("BEGIN");//开启事务
        for ($row = 2; $row <= $highestRow; $row++){//行数是以第1行开始
            $user_name=$sheet->getCell('A'.$row)->getValue();
            $email=$sheet->getCell('B'.$row)->getValue();
            $pwd=$sheet->getCell('C'.$row)->getValue();
            $point=$sheet->getCell('D'.$row)->getValue();
            $host=$sheet->getCell('E'.$row)->getValue();
            if(empty($user_name)){
                continue;
            }
            if(str_len($user_name)<6||str_len($user_name)>32){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户名:'.$user_name.'不合法!');
            }
            $regex = '/^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/';
            if(!preg_match($regex, $pwd)){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户:'.$user_name.'的密码不合法!');
            }
            $regex = '/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/';
            if(!preg_match($regex, $email)){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户:'.$user_name.'的邮箱不合法!');
            }

            if(!is_numeric($point)){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户:'.$user_name.'的点数配额不合法!');
            }
            if(!is_numeric($host)){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户:'.$user_name.'的主机配额不合法!');
            }
            if(in_array($user_name,$u_array,true)){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户名:'.$user_name.'重复!');
            }
            if(in_array($email,$e_array,true)){
                $GLOBALS['db']->query("ROLLBACK");
                die('邮箱:'.$email.'重复!');
            }
            if(is_exist_username($user_name)){
                $GLOBALS['db']->query("ROLLBACK");
                die('用户名:'.$user_name.'已存在!');
            }
            if(is_exist_email($email)){
                $GLOBALS['db']->query("ROLLBACK");
                die('邮箱:'.$email.'已存在!');
            }
            if($point>$p){
                $GLOBALS['db']->query("ROLLBACK");
                die('最多只能分配:'.$max_point.'的总点数!');
            }
            $user=array(
                'user_name'     =>$user_name,
                'email'         =>$email,
                'password'      =>md5($pwd),
                'point_all'     =>$point,
                'point_have'    =>$point,
                'host_num'      =>$host,
                'host_have'     =>$host,
                'remark'        =>$sheet->getCell('F'.$row)->getValue(),
                'reg_time'      =>time()
            );
            $GLOBALS['db']->insert('ecs_users',$user);
            $p-=$point;
            $u_array[]=$user_name;
            $e_array[]=$email;
        }
    }
    catch (Exception $e){
        $GLOBALS['db']->query("ROLLBACK");
        die('导入出错，请检查输入的信息是否有误');
    }
    finally{
        for ($row = 2; $row <= $highestRow; $row++){//行数是以第1行开始
            $user_name=$sheet->getCell('A'.$row)->getValue();
            $email=$sheet->getCell('B'.$row)->getValue();
            $pwd=$sheet->getCell('C'.$row)->getValue();
            $point=$sheet->getCell('D'.$row)->getValue();
            $host=$sheet->getCell('E'.$row)->getValue();
            $uid = uc_user_register($user_name, $pwd, $email);
        }
        $uid = uc_user_register($user_name, $pwd, $email);
        $GLOBALS['db']->query("COMMIT");
        zd_admin_log_class::create_admin_log('用户管理','批量导入用户');
        die('ok');
    }
}
elseif($act=='yj_list'){
    $key=$_REQUEST['key']?$_REQUEST['key']:'';
    $not_id=$_REQUEST['not_id']?$_REQUEST['not_id']:0;
    $not_id=str_replace("|",",",$not_id);
    die(json_encode(get_user_list2($key,$not_id)));
}
elseif($act=='yj_sure'){
    $src_id=$_REQUEST['src_id']?$_REQUEST['src_id']:0;
    $des_id=$_REQUEST['des_id']?$_REQUEST['des_id']:0;
    $src_id2=explode('|',$src_id);
    foreach ($src_id2 as $id){
        yj_user($id,$des_id);
    }
    $src_id=str_replace("|",",",$src_id);
    if(isset($_REQUEST['is_delete'])){
        delete_user_by_id_array($src_id);
     }
    die('ok');
}
elseif($act=='check_resource'){
    $ids=$_REQUEST['ids']?$_REQUEST['ids']:'';
    $ids=explode(',',$ids);
    foreach($ids as $id){
        if(check_have_resource_by_user_id($id)){
            die('have');
        }
    }
    die('no');
}
