<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------
// | Desc: 集成ucenter退出
// +----------------------------------------------------------------------

require_once ROOT_PATH.'uc_api/config.inc.php';
require_once ROOT_PATH.'uc_api/uc_client/client.php';

setcookie('uc_auth', '', -86400);
//生成同步退出的代码
$ucsynlogout = uc_user_synlogout();

//初始化返回的数组信息
$result  = array('error' => 0, 'content' => '');

if ($ucsynlogout) {
    $result['content'] = $ucsynlogout;
    $result['url'] = 'index.php';
}

die(json_encode($result));

?>

