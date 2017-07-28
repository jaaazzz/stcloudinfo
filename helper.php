<?php

/**
 * ECSHOP 文章分类
 * ============================================================================
 * * 版权所有 2005-2012 上海商派网络科技有限公司，并保留所有权利。
 * 网站地址: http://www.ecshop.com；
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和
 * 使用；不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * $Author: liubo $
 * $Id: article_cat.php 17217 2011-01-19 06:29:08Z liubo $
*/


define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');
include_once('includes/cls_json.php');

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}
function get_weblinks(){

    $sql="select * from ecs_friend_link where link_id in(4,5,6)";
    $result = $GLOBALS['db']->getAll($sql);
    $arr = array();
    foreach($result as $key=>$row){
        $arr2['title']=$row['link_name'];
        $arr2['url']=$row['link_url'];
        $arr[]=$arr2;
    }
    return $arr;
}
function is_ajax()
{
    return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

/* 清除缓存 */
//clear_cache_files();

/*------------------------------------------------------ */
//-- INPUT
/*------------------------------------------------------ */

/* Tom 没有id时默认为5 */
if(empty($_GET['id'])){
    $_GET['id'] = 1;
}

/* 帮助中心没有文章名时，默认为:关于我们，article_id = 15 */
if(empty($_GET['article_id'])){
    $_GET['article_id'] = 30;
}

/* 获得指定的分类ID */
$cat_id = intval($_GET['id']);

/* 获得当前页码 */
$page   = 1;
$size   = 10;
/*------------------------------------------------------ */
//-- PROCESSOR
/*------------------------------------------------------ */

/* 获得页面的缓存ID */
$cache_id = sprintf('%X', crc32($cat_id . '-' . $page . '-' . $_CFG['lang']));

if (!$smarty->is_cached('helper.dwt', $cache_id))
{
    /* 如果页面没有被缓存则重新获得页面的内容 */

   //获取帮助中心下的一级目录的
    $cat_list = get_article_cat($cat_id);

    //获取帮助中心的文章,目前只有3篇，但是为了可扩展性定为10，帮助中心$cat_id = 5,$page = 1,$size =10;
    $article_cat_list=array();
    $article_list = array();
    for ($i=0; $i < count($cat_list); $i++) {

        $articles_list = get_cat_articles($cat_list[$i]["cat_id"],1,10);
        $cat_list[$i]["articles_list"]=array_reverse($articles_list);

    }
    $article_cat_list = $cat_list;

    // $article_list = get_cat_articles($cat_id,1,10);

    //获取到的文章顺序按article.id为17,16,15...;使用反向函数，输出为15，16，17...
  //  $article_list = array_reverse($article_list);
    if(!is_ajax())
    {
        assign_template('a', array($cat_id));
//        $position = assign_ur_here($cat_id);
//        $smarty->assign('page_title',           $position['title']);     // 页面标题
//        $smarty->assign('ur_here',              $position['ur_here']);   // 当前位置
//
//        $smarty->assign('promotion_goods',      get_promote_goods());
//        $smarty->assign('promotion_info', get_promotion_info());
//
//        $smarty->assign('article_list', $article_list);
        $smarty->assign('article_for', $_GET['article_id']);
//        $smarty->assign('cat_id',    $cat_id);

        $smarty->assign('article_cat_list',   $article_cat_list);

        assign_dynamic('helper');
    }
    else
    {
        $json = new JSON;
        $is_bottom = ($page > $pages);
        $result = array('success' => true, 'content' => $article_list, 'is_bottom' => $is_bottom);
        die($json->encode($result));
    }
}

if(!is_ajax())
{
    //$smarty->assign('web_links',get_weblinks());
    $smarty->assign('feed_url',         ($_CFG['rewrite'] == 1) ? "feed-typearticle_cat" . $cat_id . ".xml" : 'feed.php?type=article_cat' . $cat_id); // RSS URL
    $smarty->display('helper.dwt', $cache_id);
}


?>
