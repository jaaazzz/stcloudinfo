<?php
/**
 * Created by PhpStorm.
 * User: zc
 * Date: 2015-7-30
 * Time: 下午2:40
 */


if (!defined('IN_ECS'))
{
    die('Hacking attempt');
}

define('base_url_config',$base_url_config['cloud_dog']);

class lib_export
{
    var $gidArr; //产品的id数组
    var $goodArr; //产品的信息数组
    var $groupArr;//父子关系数组
    var $priceArr;//价格数组

    var $guids = '';//产品guid串
    var $xmlstr = '';//文件信息xml串
    var $dogxmlstr = '';//文件信息xml串

    var $base_path = '';
    var $file_name = '';//下载的压缩包名称
    var $to_store_name = "gs_store.sql";//产品相关的数据sql文件名
    var $to_file_name = "gs_file_server.sql";//文件信息列表
    var $to_file_xml = "gs_file.xml";//文件信息xml
    var $to_dog_xml = "gs_dog.xml";//云狗价格注册文件名


    function __construct()
    {
        $this->file_name = 'gisdata_'.date("_Ymd_Hms",time());
        $this->base_path = '/tmp/export/' .$this->file_name;

        if(!file_exists($this->base_path))
        {
            mkdir($this->base_path,0777,true);
            chmod($this->base_path,0777);
        }
        $this->to_store_name = $this->base_path .'/'. $this->to_store_name;
        $this->to_file_name = $this->base_path .'/'. $this->to_file_name;
        $this->to_file_xml = $this->base_path .'/'. $this->to_file_xml;
        $this->to_dog_xml = $this->base_path .'/'. $this->to_dog_xml;
    }
    //商品导出功能
    public function export_goods_gs($gids)
    {
        //$gids = '208';//387,157,382,154
        //添加默认运行时插件
        $gidstr = $this->get_Base_Plugin().','.$gids;
        $this->gidArr = explode(",",$gidstr);
        //所有已选插件间的关系
        $this->groupArr = $this->get_group_Info($gidstr);
        if(!isset($this->groupArr) || count($this->groupArr)==0) return false;
        //校验框架与插件的父子关系
        $this->check_group_Array();
        //生成导出数据包并下载
        $this->create_export_package();
    }

    //写日志文件
    private function logger($content)
    {
        file_put_contents("/tmp/logzc.txt",date('Y-m-d H:i:s')."   ".$content."\r\n",FILE_APPEND);
    }
    //生成导出工具包
    private function create_export_package(){
        //创建产品列表及产品之间的关系.sql文件
        $this->create_goods_SQL();
        $this->create_groups_SQL();
        $this->create_goods_base_price_SQL();

        $this->create_file_Info();
        //生成云狗价格签名文件
        $this->get_regDog_XML();
        //生成压缩包
        $this->zip_package();
    }

    //压缩数据包
    private function zip_package()
    {
        $gzfile = $this->file_name.".zip";
        $r = shell_exec("cd /;cd tmp/export;zip -r $gzfile $this->file_name");
        $this->downloadZip();
        //$this->deldir($this->base_path);
    }
    //删除文件夹及文件夹内的文件
    private function deldir($dir) {
        unlink($dir . ".zip");
        //先删除目录下的文件：
        $dh=opendir($dir);
        while ($file=readdir($dh)) {
            if($file!="." && $file!="..") {
                $fullpath=$dir."/".$file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->deldir($fullpath);
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
    //下载压缩包
    private function downloadZip()
    {
        $gzfile = $this->base_path .".zip";
        $fp=fopen($gzfile,"r");
        $file_size=filesize($gzfile);
        //下载文件需要用到的头
        Header("Content-type: application/octet-stream");
        Header("Accept-Ranges: bytes");
        Header("Accept-Length:".$file_size);
        Header("Content-Disposition: attachment; filename=".$this->file_name.".zip");
        $buffer=1024;
        $file_count=0;
        //向浏览器返回数据
        while(!feof($fp) && $file_count<$file_size){
            $file_con=fread($fp,$buffer);
            $file_count+=$buffer;
            echo $file_con;
        }
        fclose($fp);
    }
    //获取云狗价格签名的XML文件
    private function get_regDog_XML()
    {
        $this->dogxmlstr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
        $this->dogxmlstr .= "<PriceTable>\n";
        $this->get_func_groups();
        $this->get_plugin_groups();
        $this->dogxmlstr .= "</PriceTable>\n";

        //調用云狗接口注册价格
        $service = new GIS_SERVICE($GLOBALS['myself_base_url'], base_url_config,base_url_config);
        $result =  $service->register_price($this->dogxmlstr);
        if($result['success']&&!strpos($result['result'], 'error'))
        {
            file_put_contents($this->to_dog_xml,$result['result'],FILE_APPEND);
        }
        return $result['success'];
    }
    //获取功能组
    private function get_func_groups()
    {
        $sql = "SELECT * FROM " . $GLOBALS['ecs']->table('base_price_group');
        $arr = $GLOBALS['db']->getAll($sql);

        $this->dogxmlstr .= "<FuncGroups>\n";
        foreach ($arr as $key=>$val)
        {
            $this->dogxmlstr .= "<FuncGroup name='" .$val['group_name']. "'>\n";
            $this->dogxmlstr .= "<MainFunction>" . $val['main_function'] . "</MainFunction>\n";
            $this->dogxmlstr .= "<SubFunctions>" . $val['sub_functions'] . "</SubFunctions>\n";
            $this->dogxmlstr .= "<AdvanceUserNum>1,1,1</AdvanceUserNum>\n";
            $this->dogxmlstr .= "<DataLimit>0</DataLimit>\n";
            $this->dogxmlstr .= "<Price>1000</Price>\n";
            $this->dogxmlstr .= "</FuncGroup>\n";
        }
        $this->dogxmlstr .= "</FuncGroups>\n";
    }
    //获取插件组xml
    private function get_plugin_groups()
    {
        $this->dogxmlstr .= "<Plugins>\n";
        foreach ($this->goodArr as $val)
        {
            if($val['weight_id'] == '') continue;
            $this->dogxmlstr .= "<Plugin id='" .$val['weight_id']. "' price='".$val['shop_price']."'/>\n";
        }
        $this->dogxmlstr .= "</Plugins>\n";
    }
    //创建文件服务器相关文件（包括.sql文件与.xml文件）
    private function create_file_Info()
    {
        //获取所选插件对应的gs_file表记录
        $post_array = array('guids' => $this->guids);
        $pack_result = json_decode(send_post($GLOBALS['internal_file_server_base_url'] . 'file/getInfo', $post_array));
        if(!$pack_result || $pack_result->success != 'true') return;

        $this->xmlstr = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
        $this->xmlstr .= "<plugins>\n";

        foreach($pack_result->result as $val)
        {
            $table = '`gs_file_server`.`gs_file`';
            $this->write_insert_sql($table,$val,$this->to_file_name);
            $this->write_file_xml($val);
        }
        $this->xmlstr .= "</plugins>\n";
        file_put_contents($this->to_file_xml,$this->xmlstr,FILE_APPEND);
        //异步复制文件
        $this->copy_file($this->guids);
    }
    //异步复制文件
    private function copy_file($guids)
    {
        $hostArr = explode(":",explode("/",$GLOBALS['file_server_base_url'])[2]);
        $port = count($hostArr) == 2 ? $hostArr[1] : 80;

        $fp=fsockopen($hostArr[0],$port,$errno,$errstr,5);
        if(!$fp)
        {
            echo "$errstr ($errno)<br />\n";
        }
        fputs($fp,"GET /file/copyFile?guids=" .$guids."\r\n");
        fclose($fp);
    }
    //生成文件信息xml
    private function write_file_xml($val)
    {
        $this->xmlstr .= "<plugin>\n";
        $this->xmlstr .= "<file_guid>" . $val->file_guid . "</file_guid>\n";
        $this->xmlstr .= "<store_file_name>" . $val->store_file_name . "</store_file_name>\n";
        $this->xmlstr .= "<original_file_name>" . $val->original_file_name . "</original_file_name>\n";
        $this->xmlstr .= "</plugin>\n";
    }
    //写入一条插入sql语句串
    private function write_insert_sql($table,$val,$filename)
    {
        $sqlStr = "INSERT INTO ".$table." VALUES (";
        foreach($val as $k=>$v)
        {
            if($k == 'admin_id') $v = 0;
            $sqlStr .= "'" . $v . "', ";
        }
        //去掉最后一个逗号和空格
        $sqlStr = substr($sqlStr,0,strlen($sqlStr)-2);
        $sqlStr .= ");＠＠\r\n";
        file_put_contents($filename,$sqlStr,FILE_APPEND);
    }
    //校验框架与插件的父子关系
    private function check_group_Array(){
        //校验插件
        foreach($this->groupArr as $key=>$val)
        {
            if($val['parent_id'] == 0) continue;
            $this->check_group($val);
        }
    }
    //校验插件
    private function check_group($val)
    {
        $pid = $val['parent_id'];
        $gid = $val['goods_id'];

        //若插件未导出
        if(!in_array($gid,$this->gidArr))
        {
            array_push($this->gidArr,$gid);
        }
        //若框架未导出
        if(!in_array($pid,$this->gidArr))
        {
            //加入框架
            array_push($this->gidArr,$pid);
            $this->export_frame($val);
        }
    }
    //导出插件所在的框架，及其框架包含的基础插件
    private function export_frame($val){
        $pid = $val['parent_id'];
        if($val['is_basic'] == 1) $del_id = $val['goods_id'];
        $baseArr = $this->get_base_group($pid,$del_id);
        //未发现包含的基础插件
        if(!isset($baseArr) || count($baseArr)==0) return;
        //导出关联的基础插件
        foreach($baseArr as $k=>$v)
        {
            $this->export_base_plugin($v);
        }
    }
    //导出框架关联的基础插件
    private function export_base_plugin($v)
    {
        //框架关系
        if($v['parent_id'] == 0)
        {
            array_push($this->groupArr,$v);
            return;
        }
        //该插件已导出
        if(in_array($v['goods_id'],$this->gidArr)) return;
        //加入基础插件
        array_push($this->gidArr,$v['goods_id']);
        //加入框架与基础插件的关系记录
        array_push($this->groupArr,$v);
    }
    //根据id串获取框架的信息关系,只取框架与基础包的关系
    private function get_base_group($pid,$del_id = null)
    {
        $sql = "SELECT * FROM " . $GLOBALS['ecs']->table('group_goods') . "where parent_id IN (" .$pid. ") and is_basic = 1";
        if(isset($del_id))
            $sql .= " and goods_id !=" .$del_id;
        $sql .= " or goods_id = " .$pid;
        return $GLOBALS['db']->getAll($sql);
    }
    //获取框架与插件的父子关系
    private function get_group_Info($gidstr){
        $sql = "SELECT * FROM " . $GLOBALS['ecs']->table('group_goods') . "where goods_id IN (" .$gidstr. ") or parent_id IN (" .$gidstr. ") and is_basic = 1";
        $arr = $GLOBALS['db']->getAll($sql);
        return $arr;
    }
    //获取基础插件
    private function get_Base_Plugin(){
        $sql = "SELECT * FROM " . $GLOBALS['ecs']->table('base_plugin');
        $baseArr = $GLOBALS['db']->getAll($sql);
        $basestr = '';
        foreach ($baseArr as $val)
        {
            $basestr.=$val['p_id'] . ',';
        }
        //去掉最后一个逗号
        return substr($basestr,0,strlen($basestr)-1);
    }
    //创建ecs_group_goods表的插入语句
    private function create_groups_SQL()
    {
        foreach($this->groupArr as $val)
        {
            $table = $GLOBALS['ecs']->table('group_goods');
            $this->write_insert_sql($table,$val,$this->to_store_name);
        }
    }
    //创建ecs_goods表的插入语句
    private function create_goods_SQL()
    {
        //获取最终的产品列表
        $this->goodArr = $this->get_Good_Info(implode(',',$this->gidArr));
        $imgObj = new exportIMG($this->base_path);

        foreach($this->goodArr as $val)
        {
            $table = $GLOBALS['ecs']->table_org('goods');
            $this->write_insert_sql($table,$val,$this->to_store_name);
            $this->guids .= "'" .$val['file_guid']. "',";
            //获取产品的相关图片
            $imgObj->export_Img($val);
        }
        $this->guids = substr($this->guids,0,strlen($this->guids)-1);
    }
    //创建ecs_goods_base_price表的插入语句
    private function create_goods_base_price_SQL()
    {
        $this->priceArr = $this->get_Goods_Base_price_Info(implode(',',$this->gidArr));

        foreach($this->priceArr as $val)
        {
            $table = $GLOBALS['ecs']->table('goods_base_price');
            $this->write_insert_sql($table,$val,$this->to_store_name);
        }
    }
    //根据id串获取表ecs_goods_base_price信息
    private function get_Goods_Base_price_Info($gids){
        $sql = "SELECT * FROM " . $GLOBALS['ecs']->table('goods_base_price') . "where goods_id IN (" .$gids. ")";
        return $GLOBALS['db']->getAll($sql);
    }
    //根据id串获取商品信息
    private function get_Good_Info($gids){
        $sql = "SELECT * FROM " . $GLOBALS['ecs']->table('goods') . "where goods_id IN (" .$gids. ")";
        return $GLOBALS['db']->getAll($sql);
    }
}

class exportIMG
{
    var $base_path;
    var $dev_center_base = "/var/www/dev_center/public/";
    var $gisstore_base = "/var/www/gisstore/";

    function __construct($path)
    {
        $this->base_path = $path;
    }
    //导出图片
    public function export_Img($good)
    {
        //获取详情图片
        $this->get_detail_Img($good['goods_desc']);
        //获取logo图片
        $this->get_image($good['original_img']);
    }
    //获取详情图片
    private function get_detail_Img($desc){
        //正则匹配出详情中包含的所有图片链接
        $url_array = $this->preg_url($desc);

        foreach($url_array as $key=>$url)
        {
            $this->get_image($url);
        }
    }
    //获取图片的url，并下载保存
    private function get_image($url)
    {
        $url = $this->format_url($url);//格式化url
        $file_path = $this->get_file_path($url);//文件的存放路径

        //两种方式可选，一种通过url下载，一种复制文件，复制文件的效率要高一些
        //$this->down_image($url,$file_path);
        $this->copy_image($url,$file_path);
    }
    //通过复制获取文件的存放路径
    private function copy_image($url,$file_path)
    {
        $tmp = array_slice(explode('/', explode('?', $url)[0]), 3);
        $src_bk = implode('/', $tmp);

        if($tmp[0] == 'ckeditor_assets' || $tmp[0] == 'thumbnail') $src_path = $this->dev_center_base . $src_bk;
        if($tmp[0] == 'images') $src_path = $this->gisstore_base . $src_bk;

        copy($src_path,$file_path);
    }
    //获取文件的存放路径
    private function get_file_path($url)
    {
        $tmp = explode('/', $url);
        $temp_path = $this->base_path . "/" .implode('/', array_slice($tmp, 3, -1));

        if(!is_dir($temp_path))
        {
            mkdir($temp_path,0777,true);
        }
        $file_path = $this->base_path . "/" .implode('/', array_slice($tmp, 3));
        return explode('?', $file_path)[0];
    }
    //格式化url,将相对路径的改为带“http”的url
    function format_url($url)
    {
        //对url中的IP与端口进行重定向，以保证图片能够下载成功
        $url = $this->convert_url($url);
        //若正则匹配出来的url前后各多一个引号，需要删除
        if(substr($url,0,1) == '"') $url = substr($url,1,-1);
        //若字符串内包含转义字符"\"，需要删除
        if(substr($url,-1) == "\\") $url = substr($url,0,-1);
        //若是相对路径，则一定存放在gisstore里，加上gisstore的域名
        if(strpos($url, "http") === false)
        {
            if(substr($url,0,1) == "/") $url = $GLOBALS['myself_base_url'] . substr($url,1);
            else $url = $GLOBALS['myself_base_url'] . $url;
        }
        return urldecode($url);
    }
    //将详情中图片的原始地址转为smaryun.com，以保证图片能够正常下载
    function convert_url($str)
    {
        $pattern = '/http:\/\/192\.168\.\d+\.\d+\//';
        $str = preg_replace($pattern, $GLOBALS['myself_base_url'], $str);

        $pattern = '/http:\/\/192\.168\.\d+\.\d+:\d+\//';
        $replacement = $GLOBALS['base_url_config']['dev_center'];
        $str = preg_replace($pattern, $replacement, $str);
        return $str;
    }
    //正则表达式匹配图片地址
    function preg_url($str)
    {
        $pattern="/src=[\\\\]?['\"][\s\S]*['\"]/iU";
        preg_match_all($pattern, $str, $matches,PREG_PATTERN_ORDER);

        $res = array();
        $pattern2="/['\"][\s\S]*['\"]/i";
        foreach($matches[0] as $value)
        {
            preg_match_all($pattern2, $value, $matches2,PREG_PATTERN_ORDER);
            $res = array_merge($res,$matches2[0]);
        }
        return $res;
    }
    //获取图
    function down_image($url = '', $fileName = '')
    {
        $ch = curl_init();
        $fp = fopen($fileName, 'wb');

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);

        curl_exec($ch);
        curl_close($ch);
        fclose($fp);
    }
    //获取文件后缀
    function get_suffix($url)
    {
        if(substr($url,-1) == '.') $url = substr($url,0,-1);
        $temp = explode("/",$url);
        $file = $temp[sizeof($temp)-1];
        $file_arr = explode(".",$file);
        return $file_arr[sizeof($file_arr)-1];
    }
    //写日志文件
    private function logger($content)
    {
        file_put_contents("/tmp/logzc.txt",date('Y-m-d H:i:s')."   ".$content."\r\n",FILE_APPEND);
    }
}

