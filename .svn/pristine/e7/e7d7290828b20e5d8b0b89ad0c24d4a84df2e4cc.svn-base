<?php

// database host
$db_host   = "localhost:3306";

// database name
$db_name   = "app_c";

// database username
$db_user   = "root";

// database password
$db_pass   = "zondy123";

// table prefix
$prefix    = "ecs_";

//session存储方式,可选为'redis'和'mysql'
$session_type = "redis";

$redis_host = "192.168.83.72";

$redis_port = "6379";

$timezone    = "Asia/Chongqing";

$cookie_path    = "/";

$cookie_domain    = "";

$session = "1440";

$base_url_config = array(
    "file_server" => "http://192.168.83.168/",//文件服务器外网地址
    "internal_file_server"=>"http://192.168.83.168/",//内网文件服务器地址
    "cloud_dog"   => "http://192.168.83.6/",//内网狗地址
    "out_cloud_dog"=>"http://192.168.83.611/",//外网狗地址
    "myself"      => "http://192.168.23.140:81",//站点服务器内网地址
    "out_myself"=>"http://127.0.0.1/industrycloud/",//站点服务器外网地址
    "static_server" => "http://192.168.83.168:8080/", //图片缓存服务器链接
    'cloud_disk'  => "http://192.168.83.188/pan",     //数据云盘服务器链接
    "smaryun_api_url" => "http://www.smaryun.com", //获取资源服务接口地址
    "iggs_api_url"    => "http://192.168.83.226:8181/rest/api",  //获取iggs数据服务地址
    "proxy_vnc"   	  => "http://192.168.23.140:81"	//反向代理ip,没反向代理设置为空   
);
//是否配置代理
$is_openstack_proxy=true;
//代理域名
$openstack_proxy_host="cloud-os-controller";

$openstack_identity = "http://192.168.228.0:5000/v2.0";
//openstack用户名
$openstack_username = "admin";
//openstack密码
$openstack_password = "ADMIN_PASS";
//openstack用户名
$openstack_tenantName = "admin";
//openstack云主机类型1-1-40的id
$openstack_flavorId = '4991bef1-1e94-487f-a606-f616861b93e5';//1-1-40 4991bef1-1e94-487f-a606-f616861b93e5
//配置openstack的availabilityZone
$openstack_availabilityZone = "";
// 密钥对名称
$keypairName = 'normal-key';

$region 	 = "regionOne";//服务入口点　华为该值为 az1.dc1

$urltype     = "internalURL"; //华为此参数为 publicURL
//是不是调用华为的openstack
$is_openstack_huawei = false;
//华为网络id
$huawei_openstack_network_id = "2865f2ed-dfdc-4576-bc01-f0542f54c28b";

define('EC_CHARSET','utf-8');

define('ENVIRONMENT','production');

define('ADMIN_PATH','admin');

define('AUTH_KEY', 'this is a key');

define('OLD_AUTH_KEY', '');

define('API_TIME', '2013-06-24 16:35:31');

define('DEBUG_MODE', 2);


//以下三项仅针对发改委高分电子政务项目，非此项目无需设置　
define('FLAG',TRUE);
define('GAOFEN_LOG',"http://172.168.0.55:8080/Log.asmx?wsdl");
define('GAOFEN_VM',"http://172.168.0.55:8080/VirtualMachine.asmx?wsdl");
