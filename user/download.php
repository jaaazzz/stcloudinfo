<?php

if (!defined('IN_ECS'))
{
    die('Hacking attempt');
}

$order_sn  = mysql_real_escape_string($_REQUEST['sn']);
$error_msg = "";

//modify by zc 弃用
//向文件服务器发送请求的参数,这个参数要根据内外网来判断
//$set_array = array( 'file_server_ip' => $GLOBALS['file_server_base_url'] );
//向文件服务器发送请求,这里写死为内网地址,因为内网是一定能连通的,而外网有可能无法连通
//$set_result = send_post($GLOBALS['internal_file_server_base_url'] . 'file/setConfigXml', $set_array);

if (empty($_SESSION['user_id']))
{
    die_result(0,'not allowed.',null);
}
//向文件服务器发送请求,这里写死为内网地址,因为内网是一定能连通的,而外网有可能无法连通
$file_server_pressure = file_get_contents($GLOBALS['internal_file_server_base_url'] . "monitor/load");

if(intval($file_server_pressure) >= 5)
{
    die_result(0,"server_too_busy",null);
}

//请求地址
$ip = trim($GLOBALS['iggs_api_url_base_url']);
$api_url = $ip."ecs/get/order/goodsinfo";
$api_url_s = $api_url."?order_id=".$order_sn."&user_id=".$_SESSION['user_id']."&is_single=false";
//发送请求
$ret_str = zd_common_class::_send_get($api_url_s);

$current_order_detail = json_decode($ret_str,true);

$current_order_detail = $current_order_detail["DATA"];

// $current_order_detail = $db->getAll("
//     select orderinfo.order_sn,orderinfo.order_id,orderinfo.last_gen_file_time,orderinfo.last_modify_time,orderinfo.serial_no,
//         orderinfo.serial_no,orderinfo.group_serial_no,ordergoods.goods_name,goods.*
//     from {$GLOBALS['ecs']->table('order_info')} orderinfo, {$GLOBALS['ecs']->table('order_goods')} ordergoods,
//         {$GLOBALS['ecs']->table('category')} cat , {$GLOBALS['ecs']->table('goods')} goods     
//     where orderinfo.user_id = {$_SESSION['user_id']} and orderinfo.order_id = '$order_sn' and 
//         orderinfo.order_id = ordergoods.order_id and
//         goods.goods_id = ordergoods.goods_id and goods.cat_id = cat.cat_id
//     order by ordergoods.parent_id");

$app_name = $current_order_detail[0]['goods_name'];

$package_type = $GLOBALS['gis']->get_platform(end($current_order_detail)['cat_id']);

if ($package_type == 'web' OR $package_type == 'desktop')
{
    $file_info = json_decode(stripslashes(end($current_order_detail)['file_info']), true);

    if (isset($file_info['platform']))
    {
        $platform = $file_info['platform'];
    }

    $package_xml_arr = array();

//=======================>head
    /*$serial_no_arr = explode(',', $current_order_detail[0]['serial_no']);

    for ($i=0; $i < count($serial_no_arr); $i++) 
    { 
        $package_xml = $GLOBALS['gis']->gen_xml($app_name, '1.2.34567.8', gen_guid(), $serial_no_arr[$i],
            $gis_service->vzd_lcc_service_url, $gis_service->update_url, $current_order_detail, $package_type, $platform);

        array_push($package_xml_arr, $package_xml);
    }*/
//=======================>>
    $serial_no = $current_order_detail[0]['group_serial_no'] ? $current_order_detail[0]['group_serial_no'] : $current_order_detail[0]['serial_no'];

    /* add 如果是下载离线安装包,添加许可证书(陈小佩需求) huangbin begin */

    $d_type  = $_REQUEST['d_type'];

    if (isset($d_type) && $d_type == 'offline') {
        //订单序列号
        $sn_for_offline = $serial_no;
        //调用许可证书服务,获取许可证书xml
        $auth_xmls_result = $GLOBALS['gis_service']->get_auth_xmls_by_sn($sn_for_offline);
        if(isset($auth_xmls_result['success']) AND $auth_xmls_result['success']){
            $auth_xmls_str = $auth_xmls_result['result'];
        }
    }
    /* add end */

    //wenbaolin 2014.4.22 modify vzd_lcc_service_url => vzd_lcc_service_url_auto;
    $package_xml = $GLOBALS['gis']->gen_xml($app_name, '1.2.34567.8', gen_guid(), $serial_no,
            $gis_service->vzd_lcc_service_url_auto, $gis_service->update_url, $current_order_detail, $package_type, $platform);

    array_push($package_xml_arr, $package_xml);
//======================>end

    $files_list           = array();
    $files_pack_name_list = array();

    foreach ($current_order_detail as $item)
    {
        if ($item['file_guid'] && $item['weight_id'])
        {
            $files_list[]           = $item['file_guid'];
            $files_pack_name_list[] = $GLOBALS['gis']->gen_package_plg_name($item);
        }
    }

    $config_name = $package_type;

    $nick_name = $GLOBALS['gis']->get_nick_name($current_order_detail[0]['cat_id']);

    //国土特有config.xml
    if(preg_match('/^d(c|i)gt/', $nick_name))
    {
        //$config_name .= '_land';
    }

    if($package_type == 'web')
    {
        $config_name .= '_' . $platform;
    }

    $post_array = array(
        'app_name'         => $app_name,
        'guid_arr'         => implode(',', $files_list),
        'file_name_list'   => implode(',', $files_pack_name_list),
        'xml'              => json_encode($package_xml_arr),
        'package_type'     => $package_type,
        'config_file_name' => $config_name,
        'source_type'     => $source_type,
        //add by zc 20161010
        //增加文件服务器的配置地址参数，用于打包时，替换配置文件中的地址
        'file_server_ip'   => $GLOBALS['file_server_base_url']
    );

    if ($auth_xmls_str && $sn_for_offline) {
        $post_array['auth_xmls'] = $auth_xmls_str;
        $post_array['sn'] = $sn_for_offline;
    }
//向文件服务器发送请求,这里写死为内网地址,因为内网是一定能连通的,而外网有可能无法连通
    $pack_result = send_post($GLOBALS['internal_file_server_base_url'] . 'file/pack', $post_array);
}
elseif ($package_type == 'mobile')
{
    $download_type = 'exe';

    if (isset($_REQUEST['download']) && $_REQUEST['download'] == 'apk')
    {
        $download_type = 'apk';
    }

    $serial_no = $current_order_detail[0]['group_serial_no'] ? $current_order_detail[0]['group_serial_no'] : $current_order_detail[0]['serial_no'];
//向文件服务器发送请求,这里写死为内网地址,因为内网是一定能连通的,而外网有可能无法连通
    $pack_result = send_post($GLOBALS['internal_file_server_base_url'] . 'file/pack', array(
        'app_name'      => $app_name,
        'file_guid'     => $current_order_detail[0]['file_guid'],
        'cd_url'        => $gis_service->vzd_lcc_service_url_auto,      //wenbaolin 2014.4.22 modify
        'serial_no'     => $serial_no,
        'package_type'  => $package_type,
        'download_type' => $download_type,
        'update_url'    => $gis_service->update_url
    ));
}
exit($pack_result);