<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-30
 * Time: 下午2:12
 * intrdction:云主机
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
require(dirname(__FILE__) . '/core/user_list.php');
require_once(dirname(__FILE__) . '/product_import.php');

require_once(ROOT_PATH . 'core/core.php');
$goods_obj = zd_core::instance('zd_goods_class');
zd_admin_core::instance('zd_admin_log_class');
$smarty->assign('left',    '资源管理');

//应用状态
$status=array(
    '-1'=>'全部',
    '0' =>'未上架',
    '1' =>'已上架'
);
$cat=array(
    'web' => 'Web产品',
    'desktop'=>'桌面产品'
);

$act = isset($_REQUEST['act'])?$_REQUEST['act']:'list';
if($act == 'import'){
    if($_SERVER['REQUEST_METHOD']=='POST')
    {
        //clearDB();
        header("Content-type: text/html; charset=utf-8");

        if(isset($_FILES['file'])){
            $dirName = '/tmp/import/';  //存放上传文件的服务器端文件夹路径
            if(file_exists($dirName)){
                deldir('/tmp/import');
            }
            mkdir($dirName,0777,true);
            chmod($dirName,0777);
            $temp = $_FILES['file']['name'];
            $temp = iconv("utf-8", "gb2312//IGNORE", $temp);
            //上传文件的路径
            $up_path = $dirName . $temp;
            //上传文件
            upload_importfile('file',$up_path);
            //解压缩文件
            unzip_file($up_path,$dirName);
            //解压缩文件的路径
            $file_array=scandir($dirName);
            $d_name='';
            foreach($file_array as $f){
                if($f!='.'&&$f!='..'&&is_dir($dirName.$f)){
                    $d_name=$f;
                }
            }
            $unzip_path=$dirName.$d_name;
            chmod($unzip_path,0777);
            //导入价格签名
            import_price_sign($unzip_path,$base_url_config['cloud_dog']);
            //导入sql文件
            import_sql_file($db_host,$db_user,$db_pass,$unzip_path);
            //拷贝图片文件
            copy_img_folder($unzip_path);
            //导入完成后删除
            deldir('/tmp/import');
            //清除缓存
            clear_cache_files();

            //die('ok');
            echo "ok";
        }
        if(isset($_FILES['cloud_upload_file'])){
            $dirName = '/tmp/import2/';  //存放上传文件的服务器端文件夹路径
            if(file_exists($dirName)){
                deldir('/tmp/import2');
            }
            mkdir($dirName);
            chmod($dirName,0777);
            $temp = $_FILES['cloud_upload_file']['name'];
            $temp = iconv("utf-8", "gb2312//IGNORE", $temp);
            //文件的路径
            $up_path = $dirName . $temp;
            //上传文件
            upload_importfile('cloud_upload_file',$up_path);
            //上传到文件服务器处理
            $url = $GLOBALS['base_url_config']['file_server']."file/inputFile2/";
            post_file($url, $up_path,'');
            deldir('/tmp/import2');
            //清除缓存
            clear_cache_files();

            //die('ok');
            echo "ok";
        }
        //zd_admin_log_class::create_admin_log('产品管理','导入产品');
        //die('ok');
        //echo "ok";
    }
   exit;
}
elseif('clear' == $act){
    clearDB();

    zd_admin_log_class::create_admin_log('产品管理','清空产品');
    die("true");
}
elseif($act == 'oper'){
    $id = isset($_REQUEST['good_id'])?intval($_REQUEST['good_id']):0;
    $status = isset($_REQUEST['status'])?intval($_REQUEST['status']) : 0;
    $name   = isset($_REQUEST['name'])?($_REQUEST['name']) : '';

    if($id>0){

        $result = $goods_obj->_set_sale_status_by_id($id,$status);
        $str_content = '';
        if($status == 0){
            $str_content =  '产品-'.$name.'-下架';
        }
        else{
            $str_content =  '产品-'.$name.'-上架';
        }
        zd_admin_log_class::create_admin_log('产品管理',$str_content);
        die_result($result,'修改成功');
    }
    else{
        //die('');
        die_result(false,'产品id为空，操作失败');
    }
}


//行业分类
$cat_id = isset($_REQUEST['cat_id']) ? intval($_REQUEST['cat_id']) : 0;
if (empty($cat_id)) {
    $cat_id_str = 'dc,wc,di,wi,dp,wp';
}else{
    //行业简称
    $curr_nick_name = $GLOBALS['gis'] -> get_nick_name($cat_id);
    //获取行业id数据字符串
    $cat_id_str = $curr_nick_name.'c,'.$curr_nick_name.'i,'.$curr_nick_name.'p';
}

//行业id数组
$c_id_arr = $GLOBALS['gis']->get_children(explode(',', $cat_id_str));
//搜索产品名称
$app_name =isset($_REQUEST['app_name']) ? ($_REQUEST['app_name']) : '';
//状态
$app_status = isset($_REQUEST['app_status']) ? intval($_REQUEST['app_status']) : -1;
$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
$size = 10;
$filter_arr=array(
    'is_on_sale'  =>  $app_status
);
//获取数据_get_tree_goods_by_cid
//$res=$goods_obj->_get_goods_by_cid($c_id_arr,$page,$size,$app_name,0,$filter_arr);
$res=$goods_obj->_get_tree_goods_by_cid($c_id_arr,$page,$size,$app_name,0,$filter_arr);
$apps=$res['goods'];
$count=$res['count'];

$total_page = ($count > 0) ? intval(ceil(1.0 * $count / $size)) : 1;

if($page > $total_page) { $page = $total_page; }

//前台数据合成
$goods_list = array();
//if(count($apps)>0){
//    foreach($apps as $app){
//        $application = array(
//            'id'     =>  $app['goods_id'],
//            'name'   =>  $app['name'],
//            'cartgroy'=> $cat[$app['goods_type']],
//            'user_name'=>'用户名',
//            'point'    => $app['point'],
//            'downcount'=> intval($app['is_collection']),
//            'version'  => $app['version'],
//            'status_name'=>$status[$app['is_on_sale']],
//            'status'   => $app['is_on_sale']
//        );
//        array_push($goods_list,$application);
//    }
//}

$param = array(
    'cat_id'      => $cat_id,
    'app_name'  => $app_name,
    'app_status'=> $app_status,
    'status_list'    => $status
);

//$base_url_config[''];

$smarty->assign('goods_list',     $apps);
$smarty->assign('total_page',    $total_page);

$smarty -> assign('page', $page);
$smarty -> assign('size', $size);
$smarty -> assign('count', $count);
$smarty -> assign('param', $param);
$smarty -> assign('file_server_base_url', $GLOBALS['file_server_base_url']);
$smarty -> assign('current_url', 'rm_product.php');

//$smarty->display('rm_product.htm');
$smarty->display('resource_pro.htm');

function deldir($dir) {
    //先删除目录下的文件：
    $dh=opendir($dir);
    while ($file=readdir($dh)) {
        if($file!="." && $file!="..") {
            $fullpath=$dir."/".$file;
            if(!is_dir($fullpath)) {
                unlink($fullpath);
            } else {
                deldir($fullpath);
            }
        }
    }

    closedir($dh);
    //删除当前文件夹：
    if(rmdir($dir)) {
        return true;
    } else {
        return false;
    }
}


