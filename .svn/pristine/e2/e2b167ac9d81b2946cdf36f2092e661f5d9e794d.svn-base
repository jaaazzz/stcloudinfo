<?php


function get_user_list($um,$email,$size=5,$page=1){
    $db=$GLOBALS['db'];
    $sql="select * from ecs_users where user_name like '%$um%' and email like '%$email%' and is_delete=0  order by user_id desc ";
    $start_num = ($page -1)*$size;
    $sql_limit = " LIMIT ".$start_num.",".$size;
    $all_info=$db-> getAll($sql);
    $base_info=$db-> getAll($sql.$sql_limit);
    foreach ($base_info as &$v){
        $v['point_used']=intval($v['point_all'])-intval($v['point_have']);
        $v['host_used']=intval($v['host_num'])-intval($v['host_have']);
    }
    $total_page = ((sizeof($all_info) > 0) ? intval(ceil(1.0 * sizeof($all_info)/$size )) : 0);
    return array('data' =>$base_info,'total_page' =>$total_page,'count'=>sizeof($all_info));
}
function get_user_list2($key,$not_id=0){
    $db=$GLOBALS['db'];
    $sql="select * from ecs_users where (user_name like '%$key%' or email like '%$key%') and is_delete=0 and user_id not in($not_id)  order by user_id desc ";
    $all_info=$db-> getAll($sql);
    return $all_info;
}

function get_user_by_id_industry($user_id,$is_admin=false){
    $db=$GLOBALS['db'];
    $table=$is_admin?'ecs_admin_user':'ecs_users';
    $sql="select * from $table  where user_id=$user_id";
    return $db->getRow($sql);
}
function delete_user_by_id_array($ids,$is_admin=false){
    $db=$GLOBALS['db'];
    //$table=$is_admin?'ecs_admin_user':'ecs_users';
    if($is_admin){
        $sql="delete from ecs_admin_user where user_id in($ids)";
        return $db->query($sql);
    }else{
        $sql="select * from ecs_users where user_id in($ids)";
        $res=$db->getAll($sql);
        foreach ($res as $v){
            $user=array(
                'point_all'=>intval($v['point_all'])-intval($v['point_have']),
                'point_have'=>0,
                'host_num'=>intval($v['host_num'])-intval($v['host_have']),
                'host_have'=>0,
                'is_delete'=>1
            );
            $db->update('ecs_users',$user,array('user_id'=>$v['user_id']));
            $db->update('ecs_order_info',array('is_delete'=>1),array('user_id'=>$v['user_id']));
            $db->update('ecs_application',array('hidden'=>1),array('user_id'=>$v['user_id']));
            $db->update('ecs_app_host',array('hidden'=>1),array('user_id'=>$v['user_id']));
        }
        return true;
    }


}
function is_exist_username($username,$is_admin=false){
    $db=$GLOBALS['db'];
    $table=$is_admin?'ecs_admin_user':'ecs_users';
    $sql="select count(*) from $table where user_name='$username' ";
    if(!$is_admin){
        $sql.=' and is_delete=0';
    }
    return $db->getOne($sql)>0;
}

function is_exist_email($email,$is_admin=false){
    $db=$GLOBALS['db'];
    $table=$is_admin?'ecs_admin_user':'ecs_users';
    $sql="select count(*) from $table where email='$email' ";
    return $db->getOne($sql)>0;
}



function get_admin_user_list($um,$email,$size=5,$page=1){
    $db=$GLOBALS['db'];
    $sql="select * from ecs_admin_user where  user_name like '%$um%' and email like '%$email%'  order by user_id desc ";
    $start_num = ($page -1)*$size;
    $sql_limit = " LIMIT ".$start_num.",".$size;
    $all_info=$db-> getAll($sql);
    $base_info=$db-> getAll($sql.$sql_limit);
    $total_page = ((sizeof($all_info) > 0) ? intval(ceil(1.0 * sizeof($all_info)/$size )) : 0);
    return array('data' =>$base_info,'total_page' =>$total_page,'count'=>sizeof($all_info));
}

function get_username_by_id($user_id=0){
    $db=$GLOBALS['db'];
    return $db->getOne("select user_name from ecs_users where user_id=$user_id");
}

/*
 * 获取系统中用户的数目
 *
 * return array
 */
function get_userCount($service_url){
    $db = $GLOBALS['db'];
    $sql = 'select count(*) as user_count from ' . $GLOBALS['ecs']->table('users').' where is_delete=0';
    //普通用户的总数
    $users_count = $db->getOne($sql);
    $admin_sql = 'select count(*) as admin_count from ' . $GLOBALS['ecs']->table('admin_user');
    $admin_count = $db->getOne($admin_sql);

    $sql_count = 'select sum(point_all) as point_sum,sum(point_have) as have,sum(host_num) as host_all,sum(host_have) as host_have'
        .' from '. $GLOBALS['ecs']->table('users');
    $count = $db->getRow($sql_count);

    //获得点数
//    $service = new GIS_SERVICE($GLOBALS['myself_base_url'], $service_url,$service_url);
//    $result =  $service->get_private_cloud_info();
//    $total = $result['result']->GetPrivateCloudInfoResult->totalPoints;
//    $used_point = $result['result']->GetPrivateCloudInfoResult->usedPoints;

    $data=read_static_cache('cloud_points');
    if(!$data){
        $data=array('total'=>0,'used'=>0);
    }
    $user = array(
        'total_num' => intval($users_count) + intval($admin_count),
        'users_num' => intval($users_count),
        'admin_num' => intval($admin_count),
        'point_all' => intval($count['point_sum']), //已分配点数
        //'point_have'=> intval($count['point_sum'])-intval($count['have']),
        'point_have'=> $data['used'],
        'host_num'  => intval($count['host_all']),
        'host_leave'=> intval($count['host_have']),
        'host_have' => intval($count['host_all'])-intval($count['host_have']),
        'point_total' => $data['total'],
        'max_can_give_point'=>max(intval($data['total'])-intval($count['point_sum']),0)
    );

    return $user;
}


/*
 * 根据ids:1,2,3获得用户名:abc,def,ghi
 */
function get_usernames_by_ids($ids,$is_admin=false){
    $db=$GLOBALS['db'];
    $table=$is_admin?'ecs_admin_user':'ecs_users';
    $sql="select user_name from $table where user_id in($ids)";
    $res=$db->getAll($sql);
    $names=array();
    foreach ($res as $v){
        $names[]=$v['user_name'];
    }
    return implode(',',$names);
}

//移交用户
function yj_user($src_id,$des_id){
    $db=$GLOBALS['db'];
    //应用移交
    $db->update('ecs_application',array('user_id'=>$des_id),array('user_id'=>$src_id));

    //云主机移交
    $db->update('ecs_app_host',array('user_id'=>$des_id),array('user_id'=>$src_id));

    //点数移交
    $src_user=$db->getRow("select * from ecs_users where user_id=$src_id");
    $sql="update ecs_users set point_all=point_all+".$src_user['point_have']
        .",point_have=point_have+".$src_user['point_have']
        .",host_num=host_num+".$src_user['host_have']
        .",host_have=host_have+".$src_user['host_have']
        ." where user_id=".$des_id;
    $db->query($sql);
    $user=array(
        'point_all'=>intval($src_user['point_all'])-intval($src_user['point_have']),
        'point_have'=>0,
        'host_num'=>intval($src_user['host_num'])-intval($src_user['host_have']),
        'host_have'=>0
    );
    $db->update('ecs_users',$user,array('user_id'=>$src_id));

    //订单移交
    $db->update('ecs_order_info',array('user_id'=>$des_id,'is_yj'=>1),array('user_id'=>$src_id));
}

//根据用户id判断该用户是否有资源：应用  云主机 剩余点数 剩余云主机 已购软件
function check_have_resource_by_user_id($user_id=0){
    $db=$GLOBALS['db'];
    //判断是否有剩余点数 剩余云主机
    $user=$db->getRow("select * from ecs_users where user_id=$user_id");
    if($user['point_have']>0||$user['host_have']>0){
        return true;
    }
    //判断是否有应用
    $app=$db->getOne("select count(*) from ecs_application where user_id=$user_id and hidden=0");
    if($app>0){
        return true;
    }
    //判断是否有云主机
    $host=$db->getOne("select count(*) from ecs_app_host where user_id=$user_id and hidden=0");
    if($host>0){
        return true;
    }
    //判断是否有已购软件
    $soft=$db->getOne("select count(*) from ecs_order_info where user_id=$user_id and is_delete=0");
    if($soft>0){
        return true;
    }
    return false;
}













