<?php
// database host
$db_host   = "localhost:3306";

// database name
$db_name   = "";

// database username
$db_user   = "root";

// database password
$db_pass   = "";

// table prefix
$prefix    = "ecs_";

$session_type = "redis";

$redis_host = "192.168.83.72";

$redis_port = "6379";

$timezone    = "Asia/Shanghai";

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
    'cloud_disk'  => "http://127.0.0.1:802/cd",     //数据云盘服务器链接
    "smaryun_api_url" => "http://www.smaryun.com", //获取资源服务接口地址
    "iggs_api_url"    => "http://127.0.0.1:8181/rest/api",  //获取iggs数据服务地址
    "proxy_vnc"   	  => "http://192.168.23.140:81"	//反向代理ip,没反向代理设置为空
);

$openstack_proxy_host = false;

$openstack_proxy_host = "";

$openstack_identity = "http://";

// openstack用户名
$openstack_username = "";

// openstack密码
$openstack_password = "";

// openstack用户名
$openstack_tenantName = "";

// openstack云主机类型1-1-40的id
$openstack_flavorId = "";

// 密钥对名称
$keypairName = "";

$region = "";

$urltype = "";

$is_openstack_huawei = false;

$huawei_openstack_network_id = "";

define('EC_CHARSET','utf-8');

define('ADMIN_PATH','admin');

define('AUTH_KEY', 'this is a key');

define('OLD_AUTH_KEY', '');

define('API_TIME', '');

define('ENVIRONMENT', 'production');

define('DEBUG_MODE', 2);

?>