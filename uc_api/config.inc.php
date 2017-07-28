<?php
// define('UC_CONNECT', '');
// define('UC_DBCONNECT', '0');
// define('UC_KEY', 'appcloud');
// define('UC_API', 'http://10.8.9.191/ucenter');
// define('UC_CHARSET', 'utf-8');
// define('UC_IP', '');
// define('UC_APPID', '1');
// define('UC_PPP', '20');

define('UC_CONNECT', '');
define('UC_DBCONNECT', '0');
define('UC_KEY', '15bcMpnPBuJYgB3uzRcb5Cr83B9LSbSe1GLIejQ');
define('UC_API', 'http://10.8.9.191/ucenter');
define('UC_CHARSET', 'utf-8');
define('UC_IP', '');
define('UC_APPID', '1');
define('UC_PPP', '20');


//同步登录 Cookie 设置
$cookiedomain = ''; 			// cookie 作用域
$cookiepath = '/';			// cookie 作用路径
$cookietime = 3600*24*7;      //cookie期限

//设置注册邮箱是否必须(0不需要,1需要)
$is_need_email = 0;