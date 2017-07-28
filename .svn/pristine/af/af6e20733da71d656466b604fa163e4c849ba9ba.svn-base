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
    $db_name = array('platform_plugin','goods_base_price','goods_group','goods');


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
    $file_sql = "delete from gs_file_server.gs_file";
    mysql_query($file_sql);
    return true;
}
//上传数据包
function upload_importfile($name,$upfile)
{
    header("Content-Type:text/html; charset=utf-8");
    //echo "<style type='text/css'>p{font-size: 12px;}body{  background-color: #FFF;  margin: 0px !important;}</style>";

    //copy_uploaded_file
    if (!move_uploaded_file($_FILES[$name]["tmp_name"], $upfile))
    {
        echo '上传文件失败...';
        exit;
    }
    //echo "<p>上传文件成功...</p>";
}
//解压缩文件
function unzip_file($zip_filepath,$des_filepath)
{
    //echo "<p>正在解压缩文件包...</p>";
    error_reporting(E_ALL);
    set_time_limit(0);

    //zip文件是否存在
    if(!is_file($zip_filepath))
    {
        die("文件包不存在...");
    }
    //解压目录是否存在//
    if(!file_exists($des_filepath))
    {
        @mkdir($des_filepath,0777);
    }

    get_zip_file($zip_filepath, $des_filepath);
    chmod($des_filepath,0777);
//    require_once('pclzip.lib.php');
//    $archive = new PclZip($zip_filepath);
//    $archive->extract(PCLZIP_OPT_PATH,$des_filepath);

    //echo "<p>解压成功..</p>";
}

function get_zip_file($zip_filepath, $des_filepath){
    $locale = 'zh_CN.UTF-8';
    setlocale(LC_ALL, $locale);
    putenv('LC_ALL='.$locale);
    $shell_ret = shell_exec("unzip /" .$zip_filepath . ' -d /' . $des_filepath);
    if(!$shell_ret || is_null($shell_ret))
    {
        //如果在windows下执行shell_exec()函数失败，则调用unzip函数解压ZIP文件
        unzip($zip_filepath,$des_filepath,false,true);
    };
    //shell_exec("unzip -O cp936 /" .$zip_filepath );
}

/**
 * 解压文件到指定目录
 *
 * @param   string  $src_file            zip压缩文件的路径
 * @param   string  $dest_dir            解压文件的目的路径
 * @param   boolean $create_zip_name_dir 是否以压缩文件的名字创建目标文件夹
 * @param   boolean $overwrite           是否重写已经存在的文件
 *
 * @return  boolean  返回成功 或失败
 */
function unzip($src_file, $dest_dir=false, $create_zip_name_dir=true, $overwrite=true){

    if ($zip = zip_open($src_file)){
        if ($zip){
            $splitter = ($create_zip_name_dir === true) ? "." : "/";
            if($dest_dir === false){
                $dest_dir = substr($src_file, 0, strrpos($src_file, $splitter))."/";
            }

            // 如果不存在 创建目标解压目录
            create_dirs($dest_dir);

            // 对每个文件进行解压
            while ($zip_entry = zip_read($zip)){
                // 文件不在根目录
                $pos_last_slash = strrpos(zip_entry_name($zip_entry), "/");
                if ($pos_last_slash !== false){
                    // 创建目录 在末尾带 /
                    create_dirs($dest_dir.substr(zip_entry_name($zip_entry), 0, $pos_last_slash+1));
                }

                // 打开包
                if (zip_entry_open($zip,$zip_entry,"r")){

                    // 文件名保存在磁盘上
                    $file_name = $dest_dir.zip_entry_name($zip_entry);
                    $file_name = iconv("utf-8", "gb2312//IGNORE", $file_name);

                    // 检查文件是否需要重写
                    if ($overwrite === true || $overwrite === false && !is_file($file_name)){
                        // 读取压缩文件的内容
                        $fstream = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));

                        if(@file_put_contents($file_name, $fstream))
                        {
                            // 设置权限
                            chmod($file_name, 0777);
                            //echo "save: ".$file_name."<br />";
                        }
                    }

                    // 关闭入口
                    zip_entry_close($zip_entry);
                }
            }
            // 关闭压缩包
            zip_close($zip);
        }
    }else{
        return false;
    }
    return true;
}

/**
 * 创建目录
 */
function create_dirs($path){
    if (!is_dir($path)){
        $directory_path = "";
        $directories = explode("/",$path);
        array_pop($directories);

        foreach($directories as $directory){
            $directory_path .= $directory."/";
            if (!is_dir($directory_path)){
                mkdir($directory_path,0777,true);
                chmod($directory_path, 0777);
            }
        }
    }
}

function get_file($filename,$path){
    chmod($path,0777);
    //打开压缩包
    $resource = zip_open($filename);
    $i = 1;
    //遍历读取压缩包里面的一个个文件
    while ($dir_resource = zip_read($resource)) {
        //如果能打开则继续
        if (zip_entry_open($resource,$dir_resource)) {
            //获取当前项目的名称,即压缩包里面当前对应的文件名
            $file_name = $path.zip_entry_name($dir_resource);
            //以最后一个“/”分割,再用字符串截取出路径部分
            $file_path = substr($file_name,0,strrpos($file_name, "/"));
            //如果路径不存在，则创建一个目录，true表示可以创建多级目录
            if(!is_dir($file_path)){
                mkdir($file_path,0777,true);
            }
            //如果不是目录，则写入文件
            if(!is_dir($file_name)){
                //读取这个文件
                $file_size = zip_entry_filesize($dir_resource);
                //最大读取6M，如果文件过大，跳过解压，继续下一个
                if($file_size<(1024*1024*6)){
                    $file_content = zip_entry_read($dir_resource,$file_size);
                    file_put_contents($file_name,$file_content);
                }else{
                    echo "<p> ".$i++." 此文件已被跳过，原因：文件过大， -> ".iconv("gb2312","utf-8",$file_name)." </p>";
                }
            }
            //关闭当前
            zip_entry_close($dir_resource);
        }
    }
    //关闭压缩包
    zip_close($resource);
}

//导入私云的价格签名
function import_price_sign($des_filepath,$service_url)
{
    //echo "<p>正在导入价格签名文件..</p>";
    if(!is_file($des_filepath."/gs_dog.xml"))
    {
        echo "价格签名文件不存在..";
        exit;
    }
    $xmlstr = file_get_contents($des_filepath."/gs_dog.xml");
    $service = new GIS_SERVICE($GLOBALS['myself_base_url'], $service_url,$service_url);
    $result =  $service->import_register_price($xmlstr);
    if(!$result['success']) {
        echo "导入价格签名文件失败..";
        exit;
    }
}
//导入sql文件
function import_sql_file($db_host,$db_user,$db_pass,$unzip_path)
{
    $db = new DBManager();
    $db_name = $GLOBALS['db_name'];
    if(!is_file($unzip_path.'/gs_store.sql'))
    {
        echo "gs_store.sql文件不存在..";
        exit;
    }
    $rs_store = $db->writeFromFile($unzip_path.'/gs_store.sql',$db_name);
    if(!$rs_store){
        echo "导入gs_store数据失败..";
        exit;
    }

    if(!is_file($unzip_path.'/gs_file_server.sql'))
    {
        echo "gs_file_server.sql文件不存在..";
        exit;
    }
//    $rs_file = $db->writeFromFile($unzip_path.'/gs_file_server.sql',$db_name);
//    if(!$rs_file){
//        echo "导入gs_file_server数据失败..";
//        exit;
//    }
    $url = $GLOBALS['internal_file_server_base_url']."/file/upload_cloud_sql_data/";
    post_file($url, $unzip_path.'/gs_file_server.sql','sql');
}
//导入sql文件2
function import_sql_file_2($unzip_path)
{
    $bool = false; $msg = "";
    try {
        $db = new DBManager();
        $db_name = $GLOBALS['db_name'];
        if (is_file($unzip_path . '/gs_store.sql')) {
            if ($db->writeFromFile($unzip_path . '/gs_store.sql', $db_name)) {
                if (is_file($unzip_path . '/gs_file_server.sql')) {
                    $url = $GLOBALS['internal_file_server_base_url'] . "file/upload_cloud_sql_data";
                    $res_json = post_file($url, $unzip_path . '/gs_file_server.sql', 'sql');
                    if(!empty($res_json)){
                        $res = (array)json_decode($res_json);
                        if($res["success"]){
                            $bool = true;
                        }else{
                            $msg = $res["msg"];
                        }
                    }
                }
                else{
                    $msg = "gs_file_server.sql文件不存在";
                }
            }
            else
            {
                $msg = "导入gs_store.sql失败";
            }
        }
        else
        {
            $msg = "gs_store.sql文件不存在";
        }
    } catch (Exception $e) {
        $msg = "导入SQL文件异常。异常详情：".$e->getMessage();
    }
    return Array("bool" => $bool,"msg" => $msg);
}
//复制图片文件夹到指定的地方
function copy_img_folder($zip_filepath)
{
    $dir = opendir($zip_filepath);
    while(false !== ( $file = readdir($dir)))
    {
        if(($file != '.') && ($file != '..')) {
            $src = $zip_filepath . "/" .$file;
//            if($file == "images") $dst = "/var/www/gisstore_resources/" . $file;
//            else if($file == "ckeditor_assets" || $file == "thumbnail") $dst = "/var/www/dev_center/public/" . $file;
            if($file=='images' || $file=='ckeditor_assets' || $file=="thumbnail"){
                @chmod(ROOT_PATH,0777);
                $dst = ROOT_PATH . $file;
                $det_file_server=$file;
                if(!file_exists($dst)){
                    @mkdir($dst);
                }
                @chmod($dst,0777);
                if (is_dir($src) )
                {
                    recurse_copy($src,$dst,$det_file_server);
                }
            }

        }
    }
    //echo "<p>导入相关图片成功..</p>";
}
//复制文件夹，原目录，复制到的目录
function recurse_copy($src,$dst,$det_file_server) {
    $dir = opendir($src);
    //@mkdir($dst,0777,true);
    @mkdir($dst, 0777);
    while(false !== ( $file = readdir($dir)) )
    {
        if (( $file != '.' ) && ( $file != '..' )){
            if ( is_dir($src . '/' . $file) ) {
                recurse_copy($src . '/' . $file,$dst . '/' . $file,$det_file_server. '/' . $file);
            }
            else {
                //上传到文件服务器
                if(endWith($file,'.')){
                    $file3=substr($file,0,-1);
                }else{
                    $file3=$file;
                }
                copy($src . '/' . $file,$dst . '/' . $file);
                checkimage($dst . '/' . $file);//若图片过大，则裁剪图片，原图也会保留
                $f_a=explode('.',$src . '/' . $file3);
                $ext=$f_a[count($f_a)-1];
                $file_path = $dst . '/' . $file;
                //$url = $GLOBALS['internal_file_server_base_url']."file/upload_cloud_info/".$ext;
                $url = $GLOBALS['file_server_base_url']."/file/upload_cloud_info/".$ext;
                post_file($url, $file_path,$det_file_server);
            }
        }
    }
    closedir($dir);
}
function post_file($url, $file_path,$dst){
    $ch = curl_init();
    if (class_exists('\CURLFile')) {
        $data['gs_upload_file'] = new CURLFile(realpath($file_path));
        curl_setopt($ch, CURLOPT_SAFE_UPLOAD, true);
    } else {
        $data['gs_upload_file'] = '@' . realpath($file_path);
        if (defined('CURLOPT_SAFE_UPLOAD')) {
            curl_setopt($ch, CURLOPT_SAFE_UPLOAD, false);
        }
    }
    $data['file_path']=$dst;
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    $response = curl_exec($ch);
    return $response;
}
function endWith($haystack, $needle) {
    $length = strlen($needle);
    if($length == 0)
    {
        return true;
    }
    return (substr($haystack, -$length) === $needle);
}

//检查图片大小，若过大，则裁剪图片
function checkimage($src) {
    $imgsize = filesize($src);
    if($imgsize>102400){
        $oldname = substr($src,0,strrpos($src, '.')) . '_old' . substr($src, strrpos($src, '.'));
        rename($src,$oldname);
        createResizeImage($oldname,$src);
    }
}

//裁剪图片
 function createResizeImage($tmpname, $save_name)
    {
        $gis        = getimagesize($tmpname);
        $type        = $gis[2];
        switch($type)
        {
            case "1": $imorig = imagecreatefromgif($tmpname);
                $funImg='imagegif';
                break;
            case "2": $imorig = imagecreatefromjpeg($tmpname);
                $funImg='imagejpeg';
                break;
            case "3": $imorig = imagecreatefrompng($tmpname);
                $funImg='imagepng';
                break;
            default:  $imorig = imagecreatefromjpeg($tmpname);
                $funImg='imagejpeg'; 
        }
        $x = imagesx($imorig);
        $y = imagesy($imorig);
            $im = imagecreatetruecolor(256,256);
            //解决图片转化之后背景从透明编程黑色的问题
            $color=imagecolorallocate($im,255,255,255); 
            imagecolortransparent($im,$color); 
            imagefill($im,0,0,$color); 
            
            if (imagecopyresampled($im,$imorig , 0,0,0,0,256,256,$x,$y)){
                $funImg($im,$save_name);
                imagedestroy($im);
            }
    }

class DBManager
{

    public function writeFromFile($sqlPath, $database)
    {
        try
        {
            //判断文件是否存在
            if (!file_exists($sqlPath))
                return false;

            $handle = fopen($sqlPath, 'rb');
            $sqlStr = fread($handle, filesize($sqlPath));
            fclose($handle);

            $r = false;
            //关闭外键约束
            mysql_query("SET FOREIGN_KEY_CHECKS=0");
            //通过sql语法的语句分割符进行分割
            //$segment = explode(";＠＠\r\n", trim($sqlStr));
            $sqlStr = str_replace("\r\n", "", $sqlStr);
            $segment = explode(";＠＠", trim($sqlStr));
            foreach($segment as & $sql)
            {
                if(empty($sql) || is_null($sql)) continue;
                $sql = str_replace('gs_store', $database, $sql);
                if(mysql_query($sql)){
                    $r = true;
                }
                else{
                    $r = false;
                }
            }
            //开启外键约束
            mysql_query("SET FOREIGN_KEY_CHECKS=1");

            return $r;
        }catch (Exception $e)
        {
            return false;
        }
    }
}
