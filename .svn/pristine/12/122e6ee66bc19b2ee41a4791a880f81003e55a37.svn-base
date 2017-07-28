<?php
/**
 * Created by PhpStorm.
 * User: zc
 * Date: 2015-08-05
 * Time: 下午5:36
 */


if (!defined('IN_ECS'))
{
    die('Hacking attempt');
}

include('../data/config.php');

//清空数据库
function clearDB(){
    $filename = '/tmp/gs_store_clear.sql';
    //文件存在时，先删除
    if(is_file($filename))
        unlink($filename);
    $db_name = array('account_ex','account_log','account_statement','ad','admin_log','admin_message','admin_user','adsense','ad_custom',
                     'ad_position','affiliate_log','agency','area_region','as_group','auction_log','auto_manage','back_goods',
                     'back_order','bonus_type','booking_goods','brand','card','cart','cat_recommend','collect_goods','comment',
                     'crons','delivery_goods','delivery_order','earning','email_list','email_sendlist','error_log','exchange_goods',
                     'favourable_activity','feedback','friend_link','goods','goods_activity','goods_article','goods_attr','goods_base_price',
                     'goods_cat','goods_gallery','goods_grade','group_goods','keywords','link_goods','mail_templates','material',
                     'material_buy_list','material_comments','member_price','order_action','order_goods','order_info','pack','package_goods',
                     'pay_log','plugins','products','reassemble_info','reg_extend_info','reg_fields','remit','remit_detail','renewal_goods',
                     'renewal_info','renew_trial','sc_codes','sc_gen_history','sc_industry','sc_operation_log','searchengine','service_engineer',
                     'service_engineer_price','service_Files','service_goods','service_goods_account','service_order','service_order_log',
                     'service_verify','sessions','sessions_data','shipping','shipping_area','snatch_log','stats','suppliers','tag',
                     'token','topic','unbind_record','upload_file_info','users','user_account','user_address','user_bonus','user_feed',
                     'user_invoice','user_operate_log','user_rank','user_vatinvoice','virtual_card','volume_price','vote','vote_log',
                     'vote_option','wholesale');


    foreach ($db_name as $val)
    {
        $sql = "delete from " .$GLOBALS['ecs']->table("$val");
        if($val == 'admin_user')
            $sql .=" where user_name != 'admin'";
        mysql_query($sql);
        //保存sql语句到.sql文件
        $sql .= ";\r\n";
        file_put_contents($filename,$sql,FILE_APPEND);
    }
    return true;
}
//上传数据包
function upload_importfile($upfile)
{
    header("Content-Type:text/html; charset=utf-8");
    echo "<style type='text/css'>p{font-size: 12px;}body{  background-color: #FFF;  margin: 0px !important;}</style>";

    if (!move_uploaded_file($_FILES["file"]["tmp_name"], $upfile))
    {
        echo '<p>上传文件失败...</p>';
        exit;
    }
    echo "<p>上传文件成功...</p>";
}
//解压缩文件
function unzip_file($zip_filepath,$des_filepath)
{
    echo "<p>正在解压缩文件包...</p>";
    error_reporting(E_ALL);
    set_time_limit(0);

    //zip文件是否存在
    if(!is_file($zip_filepath))
    {
        die("<p>文件包不存在...</p>");
    }
    //解压目录是否存在
    if(!file_exists($des_filepath))
    {
        @mkdir($des_filepath,0777);
    }
    require_once('pclzip.lib.php');
    $archive = new PclZip($zip_filepath);
    $archive->extract(PCLZIP_OPT_PATH,$des_filepath);
    echo "<p>解压成功..</p>";
}
//导入私云的价格签名
function import_price_sign($des_filepath,$service_url)
{
    echo "<p>正在导入价格签名文件..</p>";
    if(!is_file($des_filepath."/gs_dog.xml"))
    {
        echo "<p>价格签名文件不存在..</p>";
        return;
    }
    $xmlstr = file_get_contents($des_filepath."/gs_dog.xml");
    $service = new GIS_SERVICE($GLOBALS['myself_base_url'], $service_url,$service_url);
    $result =  $service->import_register_price($xmlstr);
    if($result['success']) echo "<p>导入价格签名文件成功..</p>";
    else echo "<p>导入价格签名文件失败..</p>";
}
//导入sql文件
function import_sql_file($db_host,$db_user,$db_pass,$unzip_path)
{
    $db = new DBManager();
    if(!is_file($unzip_path.'/gs_store.sql'))
    {
        echo "<p>gs_store.sql文件不存在..</p>";
        return;
    }
    $rs_store = $db->writeFromFile($unzip_path.'/gs_store.sql');
    if($rs_store) echo "<p>导入gs_store数据成功..</p>";
    else echo "<p>导入gs_store数据失败..</p>";

    if(!is_file($unzip_path.'/gs_file_server.sql'))
    {
        echo "<p>gs_file_server.sql文件不存在..</p>";
        return;
    }
    $rs_file = $db->writeFromFile($unzip_path.'/gs_file_server.sql');
    if($rs_file) echo "<p>导入gs_file_server数据成功..</p>";
    else echo "<p>导入gs_file_server数据失败..</p>";
}
//复制图片文件夹到指定的地方
function copy_img_folder($zip_filepath)
{
    $dir = opendir($zip_filepath);
    while(false !== ( $file = readdir($dir)))
    {
        if(($file != '.') && ($file != '..')) {
            $src = $zip_filepath . "/" .$file;
            if($file == "images") $dst = "/var/www/gisstore_resources/" . $file;
            else if($file == "ckeditor_assets" || $file == "thumbnail") $dst = "/var/www/dev_center/public/" . $file;

            if (is_dir($src) )
            {
                recurse_copy($src,$dst);
            }
        }
    }
    echo "<p>导入相关图片成功..</p>";
}
//复制文件夹，原目录，复制到的目录
function recurse_copy($src,$dst) {
    $dir = opendir($src);
    @mkdir($dst,0777,true);
    while(false !== ( $file = readdir($dir)) )
    {
        if (( $file != '.' ) && ( $file != '..' )){
            if ( is_dir($src . '/' . $file) ) {
                recurse_copy($src . '/' . $file,$dst . '/' . $file);
            }
            else {
                $r = copy($src . '/' . $file,$dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

class DBManager
{

    public function writeFromFile($sqlPath)
    {
        try
        {
            //判断文件是否存在
            if (!file_exists($sqlPath))
                return false;

            $handle = fopen($sqlPath, 'rb');
            $sqlStr = fread($handle, filesize($sqlPath));
            fclose($handle);

            //通过sql语法的语句分割符进行分割
            $segment = explode(";＠＠\r\n", trim($sqlStr));
            foreach($segment as & $sql)
            {
                $r = mysql_query($sql);
            }
            return true;
        }catch (Exception $e)
        {
            return false;
        }
    }
}
