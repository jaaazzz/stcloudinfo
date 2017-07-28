<?php

define('IN_ECS', true);

require_once(ROOT_PATH . '/includes/lib_order.php');

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

$affiliate = unserialize($GLOBALS['_CFG']['affiliate']);
$smarty->assign('affiliate', $affiliate);

$has_login = $_SESSION['user_id'] > 0 ? true : false;
$smarty->assign('has_login', $has_login);

/*------------------------------------------------------ */
//-- INPUT
/*------------------------------------------------------ */

$goods_id = isset($_REQUEST['id'])  ? intval($_REQUEST['id']) : 0;

//请求地址
$ip = trim($GLOBALS['iggs_api_url_base_url']);

$api_url = $ip."ecs/goods/details";
$api_url_s = $api_url."/".$goods_id."?uc_id=".$_SESSION['user_id']."&order_sn=".$_REQUEST['order_sn']."&parent_id=".$_REQUEST['parent_id']."&workbench_id=".$_REQUEST['integrate_workbench_id']."&want=".$_REQUEST['want']."&bac=".$_REQUEST['bac']."&act=".$_REQUEST['act'];
//发送请求
$message_result = zd_common_class::_send_get($api_url_s);
//解析json,获取应用详情
$message_result_obj = json_decode($message_result,true);
$message_result_obj1 = $message_result_obj["DATA"];
$price_list = $message_result_obj1["price_list_json"];
$addon_list_assign = $message_result_obj1["addon_list"];
$group_plugin_arr = $message_result_obj1["group_plugin_list"];
$group_info_list = $message_result_obj1["group_info_list"];
$catlist = $message_result_obj1["cat_list"];
$goods = $message_result_obj1["goods"];
$goods_group = $message_result_obj1["goods_group"];
$bind_reass_result = $message_result_obj1["bindInfo"];
$childTree = $message_result_obj1["childTree"];
//解析childTree结构
foreach ($childTree['cat_id'] as $key => $value){
    $myArrayList[$value['id']] = $value;
}
foreach ($myArrayList as $key => $value) {
    $kid = null;
    for ($j = 0; $j < count($myArrayList[$key]['cat_id']['cat_id']); $j++) {
        $kid[$myArrayList[$key]['cat_id']['cat_id'][$j]['id']] = $myArrayList[$key]['cat_id']['cat_id'][$j];
    }
    $myArrayList[$key]['cat_id'] = $kid;
}
$goods['capacity'] = intval($goods['fileSize']);
$goods['hasFile'] = $GLOBALS['gis']->has_file($goods);
if($goods_id < 1)
{
    assign_template();
    //加载zd_common_class类库
    zd_core::autoload('zd_common_class');
    //提示错误信息
    zd_common_class::show_msg('未找到此软件产品');
    return;
}

/*历史更新信息*/
if (!empty($_REQUEST['act']) && $_REQUEST['act'] == 'update_history')
{
    //请求地址
    $ip = trim($GLOBALS['iggs_api_url_base_url']);

    $api_url = $ip."ecs/goods/history";
    $api_url_s = $api_url."/".$goods_id."?version_sign=".$GLOBALS['version_sign'];
    //发送请求
    $message = zd_common_class::_send_get($api_url_s);
    //解析json,获取应用详情
    $message_result = json_decode($message,true);
}

/*------------------------------------------------------ */
//-- PROCESSOR
/*------------------------------------------------------ */
$is_bac_order = isset($_REQUEST['bac']) && $_REQUEST['bac'] == 'order';

if($is_bac_order)
{
    $smarty->caching = false;
}

$i = $_SESSION['cur_industry'];
$host = $_SERVER['HTTP_HOST'];

$cache_id = $goods_id . '-' . $_SESSION['user_id'].'-'.$_CFG['lang'] . ($is_bac_order ? "0" : "1") . '-' . $i . '-' . $host;
$cache_id = sprintf('%X', crc32($cache_id));

$smarty->assign('bac_act', $is_bac_order ? "order" : null);//获取页面点击来源
if ($goods === false)
{        
    page_not_found();       
}

if ($is_bac_order || !$smarty->is_cached('software/goods.dwt', $cache_id))
{
    if( $bind_reass_result["result"] && isset($_REQUEST['order_sn']))
    {
        $smarty->assign('goods_name' , $bind_reass_result['data']['goods_name']);
        $smarty->assign('is_trial' , $bind_reass_result['data']['is_trial']);
        $smarty->assign('start_time' , strtotime($bind_reass_result["data"]["start_time"]));
        $smarty->assign('end_time' , $bind_reass_result["data"]['end_time']);
        $smarty->assign('rest_day' , $bind_reass_result["data"]['rest_day']);/*get_start_time()*/
        $smarty->assign('assembled_addon_list', $bind_reass_result['data']['assembled_addon_list']);
        $smarty->assign('order_sn', $_REQUEST['order_sn']);
        $smarty->assign('order_count', ($bind_reass_result['order_info']['orderCount'] < 1 ? 1 : $bind_reass_result['order_info']['orderCount']));
        $smarty->assign('order_group_id', $bind_reass_result['order_info']['groupId']);
        $smarty->assign('scale_type',$bind_reass_result["data"]['scale_type']);
    }

    $smarty->assign('image_width',  $_CFG['image_width']);
    $smarty->assign('image_height', $_CFG['image_height']);

    $smarty->assign('id',           $goods_id);
    $smarty->assign('type',         0);
    $smarty->assign('cfg',          $_CFG);

    if ($goods['brandId'] > 0)
    {
        $goods['goods_brand_url'] = build_uri('brand', array('bid'=>$goods['brandId']), $goods['goodsBrand']);
    }
    $shop_price   = $goods['shopPrice'];
    $goods['catName']  = $goods["ecsCategory"]['catName'];
    $goods['goodsNameStyle'] = add_style($goods['goodsName'], $goods['goodsNameStyle']);
    $smarty->assign('last_update',        $goods['lastUpdate']);
    $smarty->assign('goods_id',           $goods['goodsId']);
    $smarty->assign('promote_end_time',   $goods['gmtEndTime']);
    $smarty->assign('keywords',           htmlspecialchars($goods['goodsName'] . ',' . $goods['keywords']));
    $smarty->assign('description',        htmlspecialchars($goods['goodsBrief']));


    foreach($catlist as $k=>$v)
    {
        $catlist[] = $v['cat_id'];
    }

    assign_template('c', $catlist);
    $position = assign_ur_here($goods['ecsCategory']['catId'], $goods['goodsName']);
    $smarty->assign('page_title',          $position['title']);                    // 页面标题
    $smarty->assign('ur_here',             $position['ur_here']);                  // 当前位置
    $goods['envs'] = get_goods_envs($goods['ecsCategory']['catId'],$goods['envs']);
    $goods['lang'] = get_goods_langs($goods['lang']);
                   
    $smarty->assign('specification',       $properties['spe']);                              // 商品规格

    $smarty->assign('cat_tree',$myArrayList);
    $smarty->assign('top_parent_cat', $message_result_obj1["top_parent_cat"]);//获取顶级分类，判断是工具还是应用
    $smarty->assign('platform', $message_result_obj1["platform"]);//获取顶级分类，判断是工具还是应用

    $parent_goods_id = isset($_REQUEST['parent_id']) ? intval($_REQUEST['parent_id']) : 0;

    if ($parent_goods_id) 
    {
        $smarty->assign('parent_goods', json_decode($message_result_obj1['parent_goods'],true));           // 父商品信息
    }
    $nick_name = $GLOBALS['gis'] -> get_nick_name($goods['ecsCategory']['catId']);
    // Iris add
    include_once(dirname(__FILE__) . '/includes/lib_gisstore_init.php');
    $is_desktop = $message_result_obj1["is_desktop"];
    //Iris add
    /**商品模板 **/
    /* 如果未取到商品功能组模板,使用B/S功能组1 end */

    $smarty->assign('goods_group',    $goods_group);
    $smarty->assign('is_desktop',    $is_desktop);

    /* 获取此产品下可定义功能组的插件 begin */
    if ($group_plugin_arr && count($group_plugin_arr) > 0) {
        foreach ($group_plugin_arr as $key => $value){
            $groups[$key] = $value;
            foreach ($value as $key => $value){
                $grouppluginarr[$key] = $value;
            }
        }
        $smarty->assign('group_plugin_list', json_encode($grouppluginarr));
    }

    /* 获取此产品下可定义功能组的插件 end */
    $smarty->assign('group_info_list',    $group_info_list);
    $smarty->assign('price_list_json',    json_encode($price_list));

    $goods_type = "";

    if(strlen($nick_name) > 2)
    {
        if (substr($nick_name, 1, 1) == "c") 
        {
            $goods_type = "package";
            $smarty->assign('addon_list',    $addon_list_assign );
            $smarty->assign('addon_list_json',  json_encode($addon_list_assign ));
        }
        elseif (substr($nick_name, 1, 1) == "i") 
        {
            $goods_type = "tool";
        }
        elseif (substr($nick_name, 1, 1) == "p") 
        {
            $goods_type = "addon";
        }

        if ($goods_type == "addon")
        {
            /* 存在价格模板系数,产品价格需重新计算 add by hb  begin*/

            //商品原始价格
            $goods_org_price = $goods['shopPrice'];
            //加载zd_db_price_class类库
            zd_core::autoload('zd_db_price_class');
            //产品价格模板系数
            $d_price_ratio = $price_list["price_ratio"];
            //如果存在最小规模下的价格系数(desk:10代表1份的规模web:10代表微型)
            if($d_price_ratio){
                $goods['shopPrice'] = sprintf("%.2f",$goods_org_price * $d_price_ratio['price_ratio']);
            }

            /* add end */
            
            $parent_goods_id = isset($_REQUEST['parent_id']) ? intval($_REQUEST['parent_id']) : 0;
            if(!$parent_goods_id)
            {
                $package_list = array();

                $parent_goods_id = $goods["goodsId"];
            }
//            $is_basic_plugin = $addon_list_assign[0]["is_basic"][0];
            $is_basic_plugin = $message_result_obj1['is_basic_plugin'] ? "true" : "false";
            //$is_basic_plugin = $message_result_obj1['is_basic_plugin'];

//            $smarty -> assign('parent_goods', get_goods_info($parent_goods_id));
            //$smarty -> assign('parent_goods', $goods);
            $smarty -> assign('is_basic_plugin', $is_basic_plugin);
        }
        $goods['fileSize'] = round($goods['fileSize']/1024,2) ."KB";
        $smarty->assign('goods',              $goods); 
        $smarty->assign('goods_type',    $goods_type );           // 相同属性的关联商品       

        assign_dynamic('goods');
    }            

    //add by zc 2016-02-25
    //重新选配插件时，获取归属工作室id
    $integrate_workbench_id = isset($_REQUEST['integrate_workbench_id']) ? $_REQUEST['integrate_workbench_id'] : 0;
    $smarty->assign('integrate_workbench_id',$integrate_workbench_id);
}
//end of if cached.

/* 记录浏览历史 */
if (!empty($_COOKIE['ECS']['history']))
{
    $history = explode(',', $_COOKIE['ECS']['history']);

    array_unshift($history, $goods_id);
    $history = array_unique($history);

    while (count($history) > $_CFG['history_number'])
    {
        array_pop($history);
    }

    setcookie('ECS[history]', implode(',', $history), gmtime() + 3600 * 24 * 30);
}
else
{
    setcookie('ECS[history]', $goods_id, gmtime() + 3600 * 24 * 30);
}

/* 判断此产品是否已收藏 begin 2016.3.29 */

$obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'soft'));

//$c_flag = $obj->_is_collection($goods_id,$_SESSION['user_id']);
$c_flag = $message_result_obj1["is_collection"];
$smarty->assign('is_collection', $c_flag); // 是否已收藏

//获取此产品的收藏总数
$collection_count = $message_result_obj1["collection_count"];
$smarty->assign('collection_count', $collection_count);

/* 判断此产品是否已收藏 end */

$smarty->assign('now_time', gmtime()); // 当前系统时间
$want_comment = $_REQUEST['want'];
$smarty->assign('want_comment', $want_comment);
$smarty->display('software/goods.dwt', $cache_id);

