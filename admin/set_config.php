<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-28
 * Time: 下午8:01
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
zd_admin_core::instance('zd_admin_categroy_class');
zd_admin_core::instance('zd_admin_log_class');
$smarty->assign('left',    '系统设置');
$act =$_REQUEST['act']? $_REQUEST['act'] : 'list';
//文件路径
$file_path = "../data/config.php";

if($act=='list'){
    $db_user = get_config($file_path,'db_user');

    $db_pass = get_config($file_path,'db_pass');

    $file_server = get_config($file_path,'file_server');
    $internal_file_server = get_config($file_path,'internal_file_server');
    $cloud_dog = get_config($file_path,'cloud_dog');
    $out_cloud_dog = get_config($file_path,'out_cloud_dog');
    $myself = get_config($file_path,'myself');
    $out_myself = get_config($file_path,'out_myself');
    $openstack_ip = get_config($file_path,'openstack_identity');

//分类列表
    $cate_list = zd_admin_categroy_class::get_categroy_list();
    $sql = "select value from " . $GLOBALS['ecs']->table('shop_config') . " where code= 'shop_name'";
    $shop_name = $GLOBALS['db']->getOne($sql);


    //首页应用列表
    $ind=$GLOBALS['db']->getAll("select * from ecs_application where is_show_index=1 and hidden=0 and is_on_sale=1 and is_public=1 and status=3 order by show_order asc");
    $smarty->assign('ind',   $ind);
    //弹框中的
    $ind2=$GLOBALS['db']->getAll("select a.*,u.user_name from ecs_application as a left join ecs_users as u on a.user_id=u.user_id where a.is_show_index=0 and a.hidden=0 and a.is_on_sale=1  and a.is_public=1");
    $smarty->assign('ind2',   $ind2);
    $logo=$db->getOne("select value from ecs_shop_config where code='shop_logo'");
    $logo_url='';
    if($logo){
        $logo_url=$logo;
        $logo=$GLOBALS['file_server_base_url'].$logo;
    }
    $smarty->assign('logo_url', $logo_url);
    $smarty->assign('logo', $logo);
    $smarty->assign('cloud_name',   $shop_name);
    $smarty->assign('db_user',   $db_user);
    $smarty->assign('db_pass',   $db_pass);
    $smarty->assign('cate_list', $cate_list);
    $smarty->assign('file_server', $file_server);
    $smarty->assign('real_file_server', $GLOBALS['file_server_base_url']);
    $smarty->assign('cloud_dog', $cloud_dog);
    $smarty->assign('internal_file_server', $internal_file_server);
    $smarty->assign('out_cloud_dog', $out_cloud_dog);
    $smarty->assign('myself', $myself);
    $smarty->assign('out_myself', $out_myself);
    $smarty->assign('openstack_ip', $openstack_ip);

    $smarty->display('set_config.htm');
}

elseif($act == 'save'){
    //保存分类信息
    $cates = isset($_REQUEST['cate_list']) ? $_REQUEST['cate_list']: '';
    if(!empty($cates)){
        $cates=json_decode(str_replace('\\','',$cates),true);
        foreach($cates as $cate){
            if(!empty($cate['id'])){
                zd_admin_categroy_class::update_categroy($cate['id'],$cate['value'],$cate['app_order']);
            }else{
                zd_admin_categroy_class::create_categroy($cate['value'],$cate['app_order']);
            }
        }
    }
    //保存首页应用信息
    $app_list = isset($_REQUEST['app_list']) ? $_REQUEST['app_list']: '';
    $GLOBALS['db']->query("update ecs_application set is_show_index=0 where hidden=0 and is_public=1");
    if(!empty($app_list)){
        $app_list=json_decode(str_replace('\\','',$app_list),true);
        foreach($app_list as $app){
            $GLOBALS['db']->update('ecs_application',array('is_show_index'=>1,'status'=>3,'show_order'=>$app['show_order']),array('id'=>$app['id']));
        }
    }
    //保存首页logo
    $logo=$_REQUEST['logo']?$_REQUEST['logo']:'';
    if($logo){
        $GLOBALS['db']->update('ecs_shop_config',array('value'=>$logo),array('code'=>'shop_logo'));
    }

    $shop_name = isset($_REQUEST['cloud_name']) ? $_REQUEST['cloud_name']: '';
    if(!empty($shop_name)){
        $sql = "update " . $GLOBALS['ecs']->table('shop_config') . " set value='{$shop_name}'" . " where code= 'shop_name'";
        $GLOBALS['db']->query($sql);
        $sql = "update " . $GLOBALS['ecs']->table('shop_config') . " set value='{$shop_name}'" . " where code= 'shop_title'";
        $GLOBALS['db']->query($sql);
        $sql = "update " . $GLOBALS['ecs']->table('shop_config') . " set value='{$shop_name}'" . " where code= 'shop_desc'";
        $GLOBALS['db']->query($sql);
        $sql = "update " . $GLOBALS['ecs']->table('shop_config') . " set value='{$shop_name}'" . " where code= 'shop_keywords'";
        $GLOBALS['db']->query($sql);
    }
    $fil_server = isset($_REQUEST['file_server']) ? $_REQUEST['file_server']: '';
    $cloud_dog = isset($_REQUEST['cloud_dog']) ? $_REQUEST['cloud_dog']: '';
    $myself = isset($_REQUEST['myself']) ? $_REQUEST['myself']: '';
    $out_myself = isset($_REQUEST['out_myself']) ? $_REQUEST['out_myself']: '';
    $internal_fil_server = isset($_REQUEST['internal_file_server']) ? $_REQUEST['internal_file_server']: '';
    $out_cloud_dog = isset($_REQUEST['out_cloud_dog']) ? $_REQUEST['out_cloud_dog']: '';
    $openstack_ip = isset($_REQUEST['openstack_ip']) ? $_REQUEST['openstack_ip']: '';
    if(!empty($fil_server)){
        update_config($file_path,'file_server',$fil_server);
    }
    if(!empty($cloud_dog)){
        update_config($file_path,'cloud_dog',$cloud_dog);
    }
    if(!empty($myself)){
        update_config($file_path,'myself',$myself);
    }
    if(!empty($out_myself)){
        update_config($file_path,'out_myself',$out_myself);
    }
    if(!empty($internal_fil_server)){
        update_config($file_path,'internal_file_server',$internal_fil_server);
    }
    if(!empty($out_cloud_dog)){
        update_config($file_path,'out_cloud_dog',$out_cloud_dog);
    }
    //if(!empty($openstack_ip)){
        update_config($file_path,'openstack_identity',$openstack_ip);
   // }

    clear_all_files();

    header("Location: set_config.php");
}
elseif($act=='del'){
    $id=$_REQUEST['id']?$_REQUEST['id']:0;
    $name=$_REQUEST['name']?$_REQUEST['name']:'';
    zd_admin_categroy_class::update_categroy($id,$name,0,1);
    zd_admin_log_class::create_admin_log('系统设置',"删除分类[$name]");
    //清除缓存
    clear_cache_files();
    //$GLOBALS['db']->update('ecs_application',array('hidden'=>1),array('category'=>$id));
    die('ok');
}
elseif ($act=='get_apps'){
    $ind=$GLOBALS['db']->getAll("select * from ecs_application where is_show_index=0 and hidden=0 and is_public=1");
    die_json($ind);
}



function get_config($file, $ini, $type="string"){
    if(!file_exists($file)) return false;
    $str = file_get_contents($file);
    $str = str_replace("'", '"', $str);
    if ($type=="int"){
        $config = preg_match("/".preg_quote($ini)."\s*=\s*(.*);/", $str, $res);
        return $res[1];
    }
    else{
        $config = preg_match("/".preg_quote($ini)."\s*=\s*\"(.*)\";/", $str, $res);
        if($config == 0){
            $config = preg_match("/\"".preg_quote($ini)."\"\s*=>\s*\"(.*)\",/", $str, $res);
        }
        if($res[1]==null){
            $config = preg_match("/".preg_quote($ini)."\s*=\s*'(.*)';/", $str, $res);
        }
        return $res[1];
    }
}

function update_config($file, $ini, $value,$type="string"){
    if(!file_exists($file)) return false;
    $str = file_get_contents($file);
    $str = str_replace("'", '"', $str);
    $str2="";
    if($type=="int"){
        $str2 = preg_replace("/".preg_quote($ini)."=(.*);/", $ini."=".$value.";",$str);
    }
    else{
        $type = array(
            'file_server','cloud_dog'
        );
        //if(in_array($ini,$type)){
        $str2 = preg_replace("/".preg_quote($ini)."\s*=\s*\"(.*)\";/",$ini."=\"".$value."\";",$str);
            $str2 = preg_replace("/\"".preg_quote($ini)."\"\s*=>\s*\"(.*)\",/","\"".$ini."\"=>\"".$value."\",",$str2);
        //}
        //else{

        //}

    }
    file_put_contents($file, $str2);
    return true;
}