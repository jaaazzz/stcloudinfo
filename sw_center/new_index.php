<?php
/**
 * Created by PhpStorm.
 * User: ygq520
 * Date: 2016/5/17
 * Time: 11:22
 */
define('IN_ECS', true);

$cache_id = sprintf('%X', crc32($_SESSION['user_id'] . '-' . $_CFG['lang']));

if (!$smarty->is_cached('home/new_index.dwt', $cache_id)) {
    //定义菜单栏处于激活状态
    $smarty->assign('index_active','active');
    assign_template();
    $smarty->assign('url_nav', 'new_index');

    $user_id = $_SESSION['user_id'] ? $_SESSION['user_id'] : 0;

    //Banner图片列表
    $bannerList = GetBannerList();
    $bannerDescribe = GetxmlContent();

    //在线应用
    $result = zd_db_app_class::get_app_garden_list('',3,$user_id,1,1,5,'',1,3);

    $app_list = $result['list'];

    foreach ($app_list as $k => $v) {
        $app_arr[]=$v['map'];
        # code...
    }
    //请求地址
    $ip = trim($GLOBALS['iggs_api_url_base_url']);

    $api_url = $ip."ecs/get/getgoods";
    $api_url_s = $api_url."?page=0&size=5&search=&uc_id=".$user_id."&is_show_index=1";
    //发送请求
    $message_result = zd_common_class::_send_get($api_url_s);
    //解析json,获取应用详情
    $goods_arr = json_decode($message_result,true);

    //新闻中心
    $news_url = $ip."ecs/get/NewsInfo";
    $news_url_s = $news_url."?id=&belong=&userId=&page=&Search=&pageSize=&isShow=";
    zd_core::autoload("zd_common_clas");
    $news_result = zd_common_class::_send_get($news_url_s);
    $news_arr = json_decode($news_result,true);
    $list = [];
    foreach($news_arr['RESULT'] as $v){
        $v['creatTime'] = substr($v['creatTime'],0,-2);
        $list[]=$v;
    }
    $smarty->assign('news_arr',$list);
    // $smarty->assign('news_arr',$news_arr['RESULT']);

//    //获取全部产品(桌面,web)
//    $cat_id_str = 'dc,di';
//    //行业id数组
//    $c_id_arr = $GLOBALS['gis']->get_children(explode(',', $cat_id_str));
//    //实例化类
//    $goods_obj = zd_core::instance('zd_goods_class');
//    //获取桌面工具
//    $goods_arr = $goods_obj->_get_goods_by_cid($c_id_arr,1,5,'',$user_id,null,1);

    //地图服务
    $resource_map = zd_core::instance('zd_resource_class');
    //调用获取数据接口
    $map_arr = $resource_map->_get_iggs_map_service(1,$user_id,'map',3);

    //SDK
    $resource_sdk = zd_core::instance('zd_resource_class');
    //调用获取数据接口
    $sdk_arr = $resource_sdk->_get_res_model_project(1,3);

    $smarty->assign('banner_arr',$bannerList[0]);
    $smarty->assign('banner_ul',$bannerList[1]);
    $smarty->assign('banner_des_arr',$bannerDescribe['BANNER']);
    $smarty->assign('banner_margin','margin-left:' . -count($bannerList[0]) * 16 . 'px');

    $smarty->assign('goods_arr', $goods_arr['goods']);

    $smarty->assign('app_arr', $app_arr);

    $smarty->assign('map_arr', $map_arr['data']);

    $smarty->assign('sdk_arr', $sdk_arr['items']);

    $smarty->assign('file_server', $GLOBALS['file_server_base_url']);

}

$smarty->display('home/new_index.dwt', $cache_id);

/**
 * Banner图片列表
 */
function GetBannerList()
{
    $bannerList = Array(); $ulArray = Array();
    //Banner路径
    $path = 'themes/appcloud/images/home/banner';
    if(file_exists($path))
    {
        $k = 0;
        $dirInfo = glob($path . '/*');
        foreach($dirInfo as $file)
        {
            $banner = Array();
            //文件信息
            $fileInfo = pathinfo($file);
            if(exif_imagetype($file)) {
                $banner['name'] = $fileInfo['filename'];
                //查询文件权重
                $explodeName = explode('_', $banner['name']);
                $banner['index'] = $explodeName[1];
                //文件文件路径
                $banner['path'] = $file;
                //z-index
                $banner['z_index'] = $banner['index'] * 50;
                //style:transform
                $banner['transform'] = 'transform: translateZ(' . $banner['z_index'] . 'px);';

                if (array_key_exists($explodeName[0], $bannerList)) {
                    $bannerList[$explodeName[0]]['info'][$explodeName[1]] = $banner;
                } else {
                    $index = $k ++;
                    array_push($ulArray,$index);
                    $bannerList[$explodeName[0]] = Array('index' => $index,'info' => Array($explodeName[1] => $banner));
                }

                ksort($bannerList[$explodeName[0]]['info']);
            }
        }
    }

    return Array($bannerList,$ulArray);
}

function GetxmlContent()
{
    $xmlContent = Array();
    //Banner路径
    $path = 'themes/appcloud/images/home/banner/Synthesis.xml';

    //初始化XML
    if(file_exists($path)) {
        $xml = simplexml_load_file($path);

        $nodeCount = count($xml->node);
        for($i = 0; $i < $nodeCount; $i++)
        {
            $nodeArray = Array();
            $node = $xml->node[$i];
            $nodeCode = strval($node->attributes()->code);
            switch($nodeCode)
            {
                case 'BANNER':
                    $nodeArray = GetBanner($node[$i]);
                    break;
                default:
                    break;
            }

            $xmlContent[$nodeCode] = $nodeArray;
        }
    }

    return $xmlContent;
}

function GetBanner($node)
{
    $searchFieldArray = Array();
    $searchFieldCount = count($node->searchField);
    for($i = 0; $i < $searchFieldCount; $i++)
    {
        $searchField = $node->searchField[$i];
        $searchFieldCode = strval($searchField->attributes()->code);

        $fieldStr = ''; $fieldUrl = 'javascript:;';
        $fieldCount = count($searchField->Field);
        for($j = 0; $j < $fieldCount; $j++)
        {
            $field = $searchField->Field[$j];

            switch(strval($field->attributes()->type))
            {
                case 'h1':
                    $fieldStr .= '<h1>'.strval($field->lable).'</h1>';
                    break;
                case 'h2':
                    $fieldStr .= '<h2>'.strval($field->lable).'</h2>';
                    break;
                case 'h3':
                    $fieldStr .= '<h3>'.strval($field->lable).'</h3>';
                    break;
                case 'h4':
                    $fieldStr .= '<h4>'.strval($field->lable).'</h4>';
                    break;
                case 'p':
                    $fieldStr .= '<p>' . strval($field->lable) . '</p>';
                    break;
                case 'button':
                    $fieldStr .= '<button class="layer-btn">' . strval($field->lable) . '</button>';
                    break;
                case 'text':
                    break;
                default:
                    break;
            }
        }
        $searchFieldArray[$searchFieldCode] = '<a href="' . $fieldUrl . '" target="_blank">' . $fieldStr . '</a>';
    }

    return $searchFieldArray;
}
