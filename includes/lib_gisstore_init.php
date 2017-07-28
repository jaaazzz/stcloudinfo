<?php

/*
 * $Author: Tom Wan $
 *   工具超市的一些全局配置和常用函数
 *   所有页面加载前都执行此页面
  *   $Id: lib_gisstore_init.php 2013-5-31 16:28:50 $
  *   Zondy Cyber
 */

defined('IN_ECS') || die('Hacking attempt');

class gisstore
{
    var $all_types = array(
        "d"  => 2,
        "w"  => 3,
        "di" => 7,
        "dc" => 8,
        "wc" => 9,
        "wi" => 10,
        'dp' => 44,
        'wp' => 49,
        'm'  => 98,
        'mi' => 99
    );

    /* 是否打开benchmark */
    var $benchmark_on = true;

    var $custom_product_name = "MapGIS K10 定制版";

    var $all_type_cache_name = "gisstore_cat_table";

    var $query_count = 0;

    var $envs = array(
        'desktop' => array(
            'windows_xp' => 'Windows XP',
            'windows_7'  => 'Windows 7',
            'windows_8'  => "Windows 8"
        ),
        'web'     => array(
            'ie'      => 'Internet Explorer',
            'chrome'  => 'Chrome',
            'firefox' => 'FireFox',
            'safari'  => 'Safari'
        ),
        'mobile'  => array(
            //'ios' => 'IOS',
            'android' => 'Android'
        )
    );

    var $langs = array(
        'chinese' => '中文',
        'english' => 'English'
    );

    var $base_plugins = array();

    /**
     * 构造函数
     */
    function gisstore()
    {
        $this->init_all_types();
        $this->init_all_base_plugins();
    }

    function init_all_types()
    {
        $data = read_static_cache($this->all_type_cache_name);

        if($data !== false)
        {
            $this->all_types = $data;
        }
        else
        {
            $sec_level = array();

            foreach ($this->all_types as $key => $value)
            {
                if (strlen($key) == 2)
                {
                    $sec_level[$key] = $value;
                }
            }

            // $all_cats = $GLOBALS['db']->getAll("
            //         SELECT *
            //         FROM {$GLOBALS['ecs']->table('category')}
            //         WHERE parent_id in (" . implode(',', $sec_level) . ")");
            $seclevel = implode(',', $sec_level);
            $api_url = $GLOBALS['iggs_api_url_base_url'] ."ecs/init/alltypes";
            
            $api_url_s = $api_url."?sec_level=".$seclevel;

            zd_core::autoload('zd_common_class');

            $message_result = zd_common_class::_send_get($api_url_s);
            
            $result = json_decode($message_result,true);
            
            $all_cats = $result['list'];
            
            foreach ($all_cats as $item)
            {
                $key_name                               = $this->get_nick_name($item['parentId']) . substr($this->get_first_letters($item['catName']), 0, 2);
                $this->all_types[strtolower($key_name)] = intval($item['catId']);
            }

            write_static_cache($this->all_type_cache_name,$this->all_types);
        }
    }

    function get_cat($cat_nick_name = "")
    {
        if (is_string($cat_nick_name))
        {
            $cat_nick_name = strtolower($cat_nick_name);
            $retVal        = $this->all_types[$cat_nick_name];

            return $retVal == "" ? 0 : $retVal;
        }
        elseif (is_array($cat_nick_name))
        {
            $retArr = array();

            foreach ($cat_nick_name as $item)
            {
                $retArr[] = $this->get_cat($item);
            }

            return $retArr;
        }

        return 0;
    }


    function get_children($nick_name)
    {
        $retArr = array();

        if (is_array($nick_name))
        {
            foreach ($nick_name as $item)
            {
                $retArr = array_merge($retArr, $this->get_children($item));
            }
        }
        elseif (is_string($nick_name))
        {
            foreach ($this->all_types as $key => $value)
            {
                if (strlen($key) == 4 && substr($key, 0, 2) == $nick_name)
                {
                    $retArr[$key] = $value;
                }
            }
        }

        return $retArr;
    }

    /**
     * 根据id获取类别的别名
     * @param  integer $cat_id 类别的id
     * @return string         类别的别名
     */
    function get_nick_name($cat_id = -1)
    {
        foreach ($this->all_types as $key => $val)
        {
            if ($val == $cat_id)
            {
                return $key;
            }
        }

        return "";
    }

    //used for admin/base_plugin
    function get_cat_crumbs($cat_id)
    {
        $nick = $this->get_nick_name($cat_id);

        $ret = array();

        if ($nick[0] == 'd')
        {
            $ret[] = '桌面';
        }
        elseif ($nick[0] == 'w')
        {
            $ret[] = 'web';
        }
        elseif ($nick[0] == 'm')
        {
            $ret[] = '移动';
        }

        if ($nick[1] == 'i')
        {
            $ret[] = '独立';
        }
        elseif ($nick[1] == 'c')
        {
            $ret[] = '定制';
        }
        elseif ($nick[1] == 'p')
        {
            $ret[] = '插件';
        }

        if (strlen($nick) > 2)
        {
            $cat_info = $this->get_cat_info($cat_id);
            $ret[]    = $cat_info['cat_name'];
        }

        return $ret;
    }

    function get_cat_info($cat_id)
    {
        return $GLOBALS['db']->getRow("
				select * from {$GLOBALS['ecs']->table(category)} where cat_id = '$cat_id'
			");
    }

    function get_platform($cat_id = -1)
    {
        $nick = $this->get_nick_name($cat_id);

        if ($nick[0] == 'd')
        {
            return 'desktop';
        }
        elseif ($nick[0] == 'w')
        {
            return 'web';
        }
        elseif ($nick[0] == 'm')
        {
            return 'mobile';
        }
        else
        {
            return null;
        }
    }

    /**
     * 获取父亲cat_id
     * @param  integer $child_id child_id
     * @return int            father id
     */
    function get_parent($child_id = 0)
    {
        $nick_name = $this->get_nick_name($child_id);

        return $this->get_cat(substr($nick_name, 0, strlen($nick_name) - 1 - (strlen($nick_name) > 2)));
    }


    /**
     * 获取父亲cat_id nick name
     * @param  integer $child_id child_id
     * @return int            father name
     */
    function get_parent_name($child_id = 0)
    {
        return $this->get_nick_name($this->get_parent($child_id));
    }

    /**
     * 判断是否是$cat_id的后代
     * @param  字符串后者数字  $cat_young_id
     * @param  字符串后者数字  $cat_old_id
     * @return boolean
     */
    function is_desc($cat_young_id, $cat_old_id)
    {
        if (is_numeric($cat_young_id))
        {
            $cat_young_id = $this->get_nick_name($cat_young_id);
        }

        if (is_numeric($cat_old_id))
        {
            $cat_old_id = $this->get_nick_name($cat_old_id);
        }

        if ($cat_young_id == '' || $cat_old_id == "")
        {
            return false;
        }

        return (stripos($cat_young_id, $cat_old_id) === 0);
    }

    //desktop or web
    function get_cat_type($cat_id)
    {
        $cat_name = $this->get_nick_name($cat_id);

        if (strlen($cat_name) > 0)
        {
            if ($cat_name[0] == 'w')
            {
                return 'web';
            }
            elseif ($cat_name[0] == 'd')
            {
                return 'desktop';
            }
        }

        return '';
    }

    /**
     * 根据类型ID判断是否属于可定制的类型
     * @param  int $cat_id 子类别的ID
     * @return boolean
     */
    function is_customize($cat_id)
    {
        $cat_name = $this->get_nick_name($cat_id);

        return strlen($cat_name) > 2 && $cat_name[1] == 'c';
    }

    function is_independent($cat_id)
    {
        $cat_name = $this->get_nick_name($cat_id);

        return strlen($cat_name) > 2 && $cat_name[1] == 'i';
    }

    function is_desktop($cat_id)
    {
        $cat_name = $this->get_nick_name($cat_id);

        return strlen($cat_name) > 0 && $cat_name[0] == 'd';
    }

    function is_web($cat_id)
    {
        $cat_name = $this->get_nick_name($cat_id);

        return strlen($cat_name) > 0 && $cat_name[0] == 'w';
    }

    /**
     * 根据类型ID获取顶级类别的ID
     * @param  int $cat_id 子类别的ID
     * @return int
     */
    function get_top_parent($cat_id)
    {
        $cat_name = $this->get_nick_name($cat_id);

        if (strlen($cat_name) > 0)
        {
            return $this->get_cat($cat_name[0]);
        }

        return 0;
    }

    function is_plugin($cat_id)
    {
        return $this->get_nick_name($cat_id)[1] == 'p';
    }

    function init_all_base_plugins()
    {
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        $cache_name = "gisstore_base_plugins";

        $data = read_static_cache($cache_name);

        if($data === false)
        {
//            $result = $GLOBALS['db']->getAll("
//                SELECT bp.*,g.shop_price
//                FROM {$GLOBALS['ecs']->table('base_plugin')} bp,{$GLOBALS['ecs']->table('goods')} g
//                WHERE specifics like 'w_b_%' and is_basic = 1 and g.goods_id = bp.p_id");
            //请求地址
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."ecs/init/AllBasePlugins";
            //发送请求
            $message_result = zd_common_class::_send_get($api_url);
            $resultlist = json_decode($message_result,true);
            $result = $resultlist['list'];
            $this->base_plugins = $result;

            write_static_cache($cache_name,$result);
        }
        else
        {
            $this->base_plugins = $data;
        }
    }

    /*
     *如果把基础插件与商品关联，这里的价格会有重复错误
     *不然的话太复杂了
     **/
    function get_base_price(&$goods_info, $shop_price_field)
    {
        //产品id
        $goods_id = $goods_info['goods_id'];

        $group_plugin = get_group_plugin_by_id($goods_id);

        $ret_price = $goods_info[$shop_price_field];

        $nick_name = $this->get_nick_name($goods_info['cat_id']);

        //如果可获取到可定制功能组的插件,则认为此产品是根据插件定制功能组
        if ($group_plugin && count($group_plugin) > 0) {
            $basic_group_price = $this->get_goods_group_price_by_goods_id($goods_info); 
            $ret_price += $basic_group_price;
        }
        else{
        /*20141215 增加当前模板价格*/
        $sql1 = "SELECT goods_base_price.price_group_id,goods_base_price.price_ratio
		        FROM {$GLOBALS['ecs']->table('goods_base_price')} AS goods_base_price
		        WHERE goods_base_price.goods_id={$goods_info['goods_id']}";

        $result1 = $GLOBALS['db']->getAll($sql1);

        if ($result1)
        {
            $ret_price = $ret_price * $result1[0]['price_ratio'];

            $sql2 = "SELECT base_price.price,base_price.price_ratio
		        FROM {$GLOBALS['ecs']->table('base_price_group')} AS base_price
		        WHERE base_price.id={$result1[0]['price_group_id']}
		    ";
            $result2 = $GLOBALS['db']->getAll($sql2);
            if ($nick_name[1] != 'p') {
                if ($result2)
                    $ret_price += $result2[0]['price'] * $result2[0]['price_ratio'];
            }
        }
        }

        //////////////////////////////////////////////////////////////////////////////


        if ($nick_name[0] != 'w' OR $nick_name[1] != 'c')
        {
            return $ret_price;
        }

        $runtime = get_file_info($goods_info['file_info'], 'platform');

        if (!$runtime)
        {
            return $ret_price;
        }

        $runtime = 'w_b_' . $runtime;

        foreach ($this->base_plugins as $item)
        {
            if ($item['specifics'] == $runtime)
            {
                $ret_price += $item['shop_price'];
            }
        }
        return $ret_price;
    }

    function get_base_plugins($goods_info, $runtime = null)
    {

        $goods = array();

        if ($runtime != null)
        {
            $platform = $runtime;
        }
        else
        {
            $platform = get_file_info($goods_info['file_info'], 'platform');
        }

        if ($platform)
        {
            $filter = $platform == 'java' ? 'w_b_java' : ($platform == 'dotnet' ? 'w_b_dotnet' : null);

            $sql2 = "
                    SELECT g.*,bp.is_basic,bp.top_cat_id,specifics,1 as is_sys
                    FROM {$GLOBALS['ecs']->table('goods')} g,{$GLOBALS['ecs']->table('base_plugin')} bp
                    WHERE g.goods_id = bp.p_id and g.is_delete = 0 and g.is_on_sale = 1
                        and specifics = '$filter'
                    ORDER by sort";

            $bp_result = $GLOBALS['db']->getAll($sql2);

            foreach ($bp_result as &$item)
            {
                if ($this->is_desc(intval($item['cat_id']), intval($item['top_cat_id'])))
                {
                    array_push($goods, $item);
                }
            }
        }

        return $goods;
    }


    //验证传入插件id的合法性，去掉重复插件，返回匹配数量
    function filter_addon_list(&$all_addon_list, $input_id_arr)
    {
        $match_count = 0;
        $temp_addon_list = $all_addon_list;
        $all_addon_list = Array();

        foreach ($temp_addon_list as $idx => &$item)
        {
            $found = false;

            foreach ($input_id_arr as $initem)
            {
                if ($initem == $item['goods_id'])
                {
                    $found = true;
                }
            }

            if ($found)
            {
                $match_count++;
                $all_addon_list[] = $temp_addon_list[$idx];
            }
        }

        return $match_count;
    }

    /**
     * 获取定制包下的插件列表.
     * 加入了基本插件功能，并能够过滤重复插件
     * @param  int $goods_id 商品的id
     * @return array           插件的列表，同获取热门商品类似
     */
    function get_addon_list($goods_info)
    {
        $goods = $this->get_base_plugins($goods_info);

//        $sql1 = "
//				SELECT g.*,groupgoods.is_basic,0 as is_sys
//				FROM {$GLOBALS[ecs]->table('goods')} g, {$GLOBALS['ecs']->table('group_goods')} groupgoods
//				WHERE g.goods_id = groupgoods.goods_id
//					and groupgoods.parent_id = '{$goods_info['goods_id']}'
//					and g.is_delete = 0 and g.is_on_sale = 1";
        zd_core::autoload('zd_common_class');
        //请求地址
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        $api_url = $ip."ecs/get/AddonList";
        $api_url_s = $api_url."?goods_id=".$goods_info['goods_id'];
        //发送请求
        $gg_rt = zd_common_class::_send_get($api_url_s);
        $gg_result = json_decode($gg_rt,true);
        $goods = array_merge($goods, $gg_result);

        $result = array();

        foreach ($goods as $idx => &$row)
        {
            $has_exsits = false;

            foreach ($result as $item)
            {
                if ($item['goods_id'] == $row['goods_id'])
                {
                    $has_exsits = true;
                    break;
                }
            }

            if ($has_exsits)
            {
                continue;
            }
            $row['goods_thumb'] = $row['goods_thumb'];
            $row['goods_img'] = $row['goods_img'];
            $row['original_img'] = $row['original_img'];
            $result[] = $row;
        }

        return $result;
    }

    function has_file($goods_info)
    {
        if (isset($goods_info['fileGuid']) && isset($goods_info['fileSize']))
        {
            return !!trim($goods_info['fileGuid']) && !!intval($goods_info['fileSize']);
        }

        return FALSE;
    }

    /**
     * 获得推荐商品
     * 精品推荐、新品上架、畅销排行
     * 精选插件、最新插件
     * @access  public
     * @param   string $type 推荐类型，可以是 best, new, hot
     * @return  array
     */
    function get_recommend_goods($type = '', $cats = '')
    {
        if (!in_array($type, array('best', 'new', 'hot', 'best_addon', 'new_addon')))
        {
            return array();
        }
        /* 匹配参数类型中是否包含addon,有即获取插件产品 */
        if (preg_match("/addon/i", $type))
        {
            //获取所有web,桌面插件的cat_id数组,类似与array = ['wpjc' => 50,'dpjc' => 45]
            $temp_cats = $this->get_children(explode(',', 'wp,dp'));
            $temp_cats = $this->check_cur_cat($temp_cats);
            //将数组转换成字符串
            $cat_ids = "(" . implode(',', $temp_cats) . ")";
            //截取参数$type,形如best_addon截取为best,以此判读获取最新或精选插件
            $type    = preg_replace('/_addon/', '', $type);
        }
        else
        {
            $temp_cats = $this->get_children(explode(',', 'wc,dc,wi,di,m'));
            $temp_cats = $this->check_cur_cat($temp_cats);
            $cat_ids = "(" . implode(',', $temp_cats) . ")";
        }

        $goodCondition = "is_" . $type;

        /* 获得商品列表 */
        $sql = "
		        SELECT g.cat_id,g.goods_id, addons.goods_id as addon_id,g.grade,g.developer_id,g.click_count,
		            round(g.shop_price + if(sum(addons.shop_price) is NULL,0,sum(addons.shop_price)),2) as sum_price,
		            g.goods_name, g.goods_name_style, g.market_price, g.is_new, g.is_best, g.is_hot,
		            g.shop_price AS org_price, IFNULL(mp.user_price, g.shop_price * '$_SESSION[discount]')
		            AS shop_priceA, g.promote_price, g.goods_type, g.promote_start_date,
		            g.promote_end_date, g.goods_brief, g.goods_thumb , g.original_img ,g.goods_img ,g.file_info
		        FROM {$GLOBALS['ecs']->table('goods')} AS g
		        LEFT JOIN {$GLOBALS['ecs']->table('member_price')} AS mp ON mp.goods_id = g.goods_id
		          AND mp.user_rank = '$_SESSION[user_rank]'
		        LEFT JOIN (select ggg.goods_id,gg.parent_id,ggg.shop_price
		                from {$GLOBALS['ecs']->table('group_goods')} gg , {$GLOBALS['ecs']->table('goods')} ggg
		            where gg.goods_id = ggg.goods_id and gg.is_basic=1 and ggg.is_on_sale = 1 and ggg.is_delete = 0)
		            addons on addons.parent_id = g.goods_id
		        WHERE g.is_on_sale = 1 AND g.is_alone_sale = 1 AND g.is_delete = 0 AND
		            g.cat_id IN $cat_ids and g.{$goodCondition} = 1
		        GROUP BY g.goods_id
		        ORDER BY sort_order,g.last_update desc
		    ";

        $goods  = array();
        $result = $GLOBALS['db']->getAll($sql);

        foreach ($result AS $idx => $row)
        {
            $goods[$idx]['is_customize']     = $this->is_customize($row['cat_id']); //是否是框架
            $goods[$idx]['cat_type']         = $this->get_cat_type($row['cat_id']); //是桌面还是web
            $goods[$idx]['grade']            = $row['grade'];
            $goods[$idx]['id']               = $row['goods_id'];
            $goods[$idx]['name']             = $row['goods_name'];
            $goods[$idx]['cat_id']           = $row['cat_id'];
            $goods[$idx]['brief']            = $row['goods_brief'];
            $goods[$idx]['brand_name']       = isset($goods_data['brand'][$row['goods_id']])
                ? $goods_data['brand'][$row['goods_id']] : '';
            $goods[$idx]['goods_style_name'] = add_style($row['goods_name'], $row['goods_name_style']);

            $goods[$idx]['short_name']       = $GLOBALS['_CFG']['goods_name_length'] > 0 ?
                sub_str($row['goods_name'], $GLOBALS['_CFG']['goods_name_length']) : $row['goods_name'];
            $goods[$idx]['short_style_name'] = add_style($goods[$idx]['short_name'], $row['goods_name_style']);
            $goods[$idx]['market_price']     = price_format($row['sum_price']);
            $goods[$idx]['shop_price']       = price_format($this->get_basic_goods_price_by_id($row));
            $goods[$idx]['thumb']            = convert_url_in_string(get_image_path($row['goods_id'], $row['original_img'], true));

            $goods[$idx]['goods_img'] = convert_url_in_string(get_image_path($row['goods_id'], $row['original_img']));
            $goods[$idx]['url']       = build_uri('goods', array('gid' => $row['goods_id']), $row['goods_name']);
            //get developer_name
            $developer_name = get_user_by_ucid($row['developer_id'],'user_name');
            $goods[$idx]['developer_name'] = !empty($developer_name) ? $developer_name : '无';
            //get click_count
            $goods[$idx]['click_count'] = $row['click_count'];
            $goods[$idx]['developer_id'] = $row['developer_id'];
        }

        return $goods;
    }

    /*
     * 畅销排行
     * so fucking complicated
     * */
    function get_db_hot_goods($period = 28, $count = 10)
    {
        $end_time   = gmtime();
        $start_time = $end_time - $period * 3600 * 24;

        $sql = "
                SELECT
                    goods . *,goods.shop_price as org_price,
                    addons.shop_price as addon_price,amount,
                    round(goods.shop_price + if(sum(addons.shop_price) is NULL,
                                0,
                                sum(addons.shop_price)),2) as sum_price
                FROM
                    ({$GLOBALS['ecs']->table('goods')} goods, (SELECT
                        count(*) as amount, g . *
                    FROM
                        {$GLOBALS['ecs']->table('goods')} g, {$GLOBALS['ecs']->table('order_goods')} order_goods,
                         {$GLOBALS['ecs']->table('order_info')} order_info
                    WHERE
                        g.is_on_sale = 1 AND g.is_alone_sale = 1
                            AND g.is_delete = 0
                            and g.goods_id = order_goods.goods_id
                            and order_goods.parent_id = 0
                            and order_goods.order_id = order_info.order_id
                            and order_info.add_time <= $end_time
                            and order_info.add_time >= $start_time
                    GROUP BY goods_id) hehe )
                        LEFT JOIN
                    (SELECT
                        ggg.goods_id, gg.parent_id, ggg.shop_price
                    FROM
                        {$GLOBALS['ecs']->table('group_goods')} gg, {$GLOBALS['ecs']->table('goods')} ggg
                    WHERE
                        gg.goods_id = ggg.goods_id
                            and gg.is_basic = 1
                            and ggg.is_on_sale = 1
                            and ggg.is_delete = 0) addons ON addons.parent_id = goods.goods_id
                where
                    goods.goods_id = hehe.goods_id
                group by goods_id
                order by amount desc
                limit 0,$count
		    ";

        $goods  = array();
        $result = $GLOBALS['db']->getAll($sql);
        foreach ($result AS $idx => $row)
        {
            $goods[$idx]['is_customize']     = $this->is_customize($row['cat_id']);
            $goods[$idx]['cat_type']         = $this->get_cat_type($row['cat_id']);
            $goods[$idx]['id']               = $row['goods_id'];
            $goods[$idx]['name']             = $row['goods_name'];
            $goods[$idx]['brief']            = $row['goods_brief'];
            $goods[$idx]['brand_name']       = isset($goods_data['brand'][$row['goods_id']])
                ? $goods_data['brand'][$row['goods_id']] : '';
            $goods[$idx]['goods_style_name'] = add_style($row['goods_name'], $row['goods_name_style']);

            $goods[$idx]['short_name']       = $GLOBALS['_CFG']['goods_name_length'] > 0 ?
                sub_str($row['goods_name'], $GLOBALS['_CFG']['goods_name_length']) : $row['goods_name'];
            $goods[$idx]['short_style_name'] = add_style($goods[$idx]['short_name'], $row['goods_name_style']);
            $goods[$idx]['market_price']     = price_format($row['market_price']);
            $goods[$idx]['shop_price']       = price_format($this->get_basic_goods_price_by_id($row));
            $goods[$idx]['thumb']            = get_image_path($row['goods_id'], $row['original_img'], true);

            $goods[$idx]['goods_img'] = get_image_path($row['goods_id'], $row['original_img']);
            $goods[$idx]['url']       = build_uri('goods', array('gid' => $row['goods_id']), $row['goods_name']);
        }

        return $goods;
    }

    function get_first_letters($zh)
    {
        $ret = "";
        $s1  = iconv("UTF-8", "gb2312", $zh);
        $s2  = iconv("gb2312", "UTF-8", $s1);

        if ($s2 == $zh)
        {
            $zh = $s1;
        }

        for ($i = 0; $i < strlen($zh); $i++)
        {
            $s1 = substr($zh, $i, 1);
            $p  = ord($s1);

            if ($p > 160)
            {
                $s2 = substr($zh, $i++, 2);
                $ret .= $this->get_first_char($s2);
            }
            else
            {
                $ret .= $s1;
            }
        }

        return $ret;
    }


    function get_first_char($s0)
    {
        $fchar = ord($s0{0});
        if ($fchar >= ord("A") and $fchar <= ord("z"))
        {
            return strtoupper($s0{0});
        }
        $s1 = iconv("UTF-8", "gb2312", $s0);
        $s2 = iconv("gb2312", "UTF-8", $s1);
        if ($s2 == $s0)
        {
            $s = $s1;
        }
        else
        {
            $s = $s0;
        }
        $asc = ord($s{0}) * 256 + ord($s{1}) - 65536;
        if ($asc >= -20319 and $asc <= -20284)
        {
            return "A";
        }
        if ($asc >= -20283 and $asc <= -19776)
        {
            return "B";
        }
        if ($asc >= -19775 and $asc <= -19219)
        {
            return "C";
        }
        if ($asc >= -19218 and $asc <= -18711)
        {
            return "D";
        }
        if ($asc >= -18710 and $asc <= -18527)
        {
            return "E";
        }
        if ($asc >= -18526 and $asc <= -18240)
        {
            return "F";
        }
        if ($asc >= -18239 and $asc <= -17923)
        {
            return "G";
        }
        if ($asc >= -17922 and $asc <= -17418)
        {
            return "H";
        }
        if ($asc >= -17417 and $asc <= -16475)
        {
            return "J";
        }
        if ($asc >= -16474 and $asc <= -16213)
        {
            return "K";
        }
        if ($asc >= -16212 and $asc <= -15641)
        {
            return "L";
        }
        if ($asc >= -15640 and $asc <= -15166)
        {
            return "M";
        }
        if ($asc >= -15165 and $asc <= -14923)
        {
            return "N";
        }
        if ($asc >= -14922 and $asc <= -14915)
        {
            return "O";
        }
        if ($asc >= -14914 and $asc <= -14631)
        {
            return "P";
        }
        if ($asc >= -14630 and $asc <= -14150)
        {
            return "Q";
        }
        if ($asc >= -14149 and $asc <= -14091)
        {
            return "R";
        }
        if ($asc >= -14090 and $asc <= -13319)
        {
            return "S";
        }
        if ($asc >= -13318 and $asc <= -12839)
        {
            return "T";
        }
        if ($asc >= -12838 and $asc <= -12557)
        {
            return "W";
        }
        if ($asc >= -12556 and $asc <= -11848)
        {
            return "X";
        }
        if ($asc >= -11847 and $asc <= -11056)
        {
            return "Y";
        }
        if ($asc >= -11055 and $asc <= -10247)
        {
            return "Z";
        }

        return null;
    }


    function get_cat_name_by_id($cat_id)
    {
        return $GLOBALS['db']->getOne("select cat_name from {$GLOBALS[ecs]->table(category)} where cat_id = '$cat_id'");
    }


    function get_package_runtime($platform, $java_or_dotnet)
    {
        if ($platform == "web")
        {
            if ($java_or_dotnet == "java")
            {
                return 'IGServer4Java';
            }
            elseif ($java_or_dotnet == "dotnet")
            {
                return 'IGServerCore';
            }
        }

        return null;
    }

    /**
     * 生成聚合包中插件文件名称数组
     * @param $goods_info
     * @return mixed|string eg:MapGIS_GDBManager_Plugin_dll_1_0_0_88_F8v2e0GUL41wZf3M.dcplugin
     */
    function gen_package_plg_name($goods_info)
    {
        $ext_arr   = explode('.', $goods_info['store_file_name']);
        $ext       = '.' . end($ext_arr);
        $file_name = $goods_info['file_name'] . '_' . $goods_info['version'];
        $file_name = preg_replace('/\\|\/|\:|\?|\*|\"|\<|\>|\||\s|\.|\,/', '_', $file_name) . '_' . $goods_info['file_guid'];
        $file_name = preg_replace('/[\x{4e00}-\x{9fa5}]+/u', '', $file_name);
        $file_name .= $ext;

        return $file_name;
    }

    /**
     * 生成插件包或者独立工具包的xml配置文件
     * @param  string $app_name_or_title 应用的名称 && Title
     * @param  string $version 版本号
     * @param  string $guid guid
     * @param  string $serial_no 认证码（？）
     * @param  string $vzd_lcc_svc 云狗服务地址
     * @param  array $pack_arr 内含插件对象数组(name,source属性)
     * @param  string $desktop_or_web 桌面工具还是web应用
     * @return string                    string
     */
    function gen_xml($app_name_or_title = '', $version = '1.2.3.4', $guid, $serial_no, $vzd_lcc_svc,
                     $update_url, $pack_arr, $desktop_or_web, $java_or_dotnet)
    {
        $app = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><AppTemplate />');
        $app->addAttribute('AppName', $app_name_or_title);
        /**
         * TODO：rabbon/common style
         */
        $app->addAttribute('Style', 'Common');
        $app->addAttribute('Title', $app_name_or_title);
        $app->addAttribute('Author', '武汉中地数码');
        $app->addAttribute('Date', date('Y-m-d H:i:s'));
        $app->addAttribute('Version', $version);

        //{{
        //wenbaolin 2014.6.25 modify
        //开发者聚合的时候，是没有SerialNo的，并且也不能带SerialNo这个属性,否桌面程序解析的时候会出问题
        //开发者聚合的时候，$guid，$guid,否桌面程序解析的时候会出问题
        if(!empty($guid)){
            $app->addAttribute('Guid', $guid);
        }


        if(!empty($serial_no)){
            $app->addAttribute('SerialNo', $serial_no);
        }
        //}}

        $app->addAttribute('VzdLccSvc', $vzd_lcc_svc);
        $app->addAttribute('UpdateUrl', $update_url);

        $runtime = $this->get_package_runtime($desktop_or_web, $java_or_dotnet);

        if ($runtime !== false)
        {
            $app->addAttribute('Runtime', $runtime);
        }

        $welcome = $app->addChild('WelcomeScreen');
        $welcome->addAttribute('ForbidPackages', 'false');
        $welcome->addAttribute('Image', 'welcome.bmp');

        $dp = $app->addChild('DeploymentParts');
        $dp->addAttribute('BasePath', '');

        foreach ($pack_arr as $item)
        {
            $pack = $dp->addChild('Pack');
            $pack->addAttribute('Name', $item['goods_name']);
            //$pack->addAttribute('Source',$item['store_file_name']);
            $pack->addAttribute('Source', $this->gen_package_plg_name($item));
            $pack->addAttribute('weight_id', $item['weight_id']);
        }

        return $app->asXML();
    }

    function get_config_file_name_by_cat_id($cat_id,$platform)
    {
        $config_name = $this->get_platform($cat_id);

        $nick_name = $GLOBALS['gis']->get_nick_name($cat_id);

        //国土特有config.xml
        if(preg_match('/^d(c|i)gt$/', $nick_name))
        {
            $config_name .= '_land';
        }

        if($config_name == 'web')
        {
            $config_name .= '_' . $platform;
        }

        return $config_name;
    }

    /**
     * wenbaolin 2014.10.18 add
     * 为了实现行业云,自动检测转换传入的分类.
     * @param $cat_id_in 传入的分类
     */
    function check_cat_id($cat_id_in)
    {

        if(isset($_SESSION['cur_industry']))
        {
            $hy = $_SESSION['cur_industry'];

            if('ALL' == $hy)
            {
                return $cat_id_in;
            }

            $cat_name = $this->get_nick_name($cat_id_in);

            $name = substr($cat_name,0,1) . 'i' . $hy;

            foreach ($this->all_types as $key => $val)
            {
                if( $name == $key)
                {
                    return $val;
                }
            }
        }

        return $cat_id_in;

    }

    function check_cur_cat($cat_ids)
    {
        $industry = $_SESSION['cur_industry'];

        if(!$industry)
        {
            $_SESSION['cur_industry'] = INDUSTRY;
            $industry = INDUSTRY;
        }

        if('ALL' == $industry)
        {
            return $cat_ids;
        }

        $out_cat = array();

        foreach($cat_ids as $cat_id)
        {
            foreach ($this->all_types as $key => $val)
            {
                if( $cat_id == $val)
                {
                    if(strlen($key) == 4 && substr($key,2,2) == $industry)
                    {
                        $out_cat[] = $cat_id;
                    }

                    break;
                }
            }
        }

        return $out_cat;

    }

    function get_order_scale_type($order_id)
    {
        $order_sn_info = $GLOBALS['db']->getOne("
            SELECT order_sn 
            FROM {$GLOBALS['ecs']->table('account_statement')} 
            WHERE order_id = '$order_id' AND order_type = 0
            order by account_statement_id asc
        ");
        if ($order_sn_info) {
            $order_scale_type = $GLOBALS['db']->getOne("
                SELECT scale_type 
                FROM {$GLOBALS['ecs']->table(account_ex)}
                WHERE order_sn = '$order_sn_info'
            ");
            return $order_scale_type;
        }
        else{
            return false;
        }
    }

    /**
     * 根据产品id初始化可定制功能组产品的功能组价格
     * @author huangbin
     * @param  $goods_info 产品信息数组
     * @access  public
     * @return  price 价格
     */
    function get_goods_group_price_by_goods_id($goods_info){
        //产品本身价格
        $goods_price = $goods_info['org_price'];
        /* 获取当前产品下的基础插件 */
        $goods = $this->get_base_plugins($goods_info);
        foreach ($goods as $key => $item) {
            if ($item['is_basic'] == 0) {
                unset($goods[$key]);
            }
        }
        $sql1 = "
                SELECT goods.*,groupgoods.is_basic,0 as is_sys
                FROM {$GLOBALS['ecs']->table('goods')} goods, {$GLOBALS['ecs']->table('group_goods')} groupgoods
                WHERE goods.goods_id = groupgoods.goods_id
                      and groupgoods.parent_id = '{$goods_info['goods_id']}'
                      and goods.is_delete = 0 and goods.is_on_sale = 1 and groupgoods.is_basic = 1";

        $gg_result = $GLOBALS['db']->getAll($sql1);
        $goods = array_merge($goods, $gg_result);
        $goods_id_arr = array();
        foreach ($goods as $key => $item) {
            array_push($goods_id_arr,$item['goods_id']);
        }
        $group_id = get_group_id_by_addon_list($goods_id_arr);
        //$scale_type = 10表示最基础的价格模板类型
        $basic_group_price = get_group_price_by_id($group_id,$scale_type = 10);
        return $basic_group_price;
    }

    /**
     * 根据产品id获取初始化价格
     * @author huangbin
     * @param  $goods_id 产品id
     * @access public
     * @return price 价格
     * @modify huangbin 解决不可定制产品价格显示未增加功能组价格的问题 2016-1-27
     */   
    function get_basic_goods_price_by_id($goods_info){
        //产品类型英文简称(eg:dcjc)
        $goods_cat_name = $this->get_nick_name($goods_info['cat_id']);
        /* 产品id */
        $goods_id = $goods_info['goods_id'];
        //产品本身价格
        $goods_price = $goods_info['org_price'];
        //产品价格模板系数
        $d_price_ratio = get_price_ratio_by_id($goods_id,$scale_type = 10);
        if($d_price_ratio){
            $goods_price = $goods_price * $d_price_ratio['price_ratio'];
        }
        //如果产品是可定制产品和不可定制产品
        if ($goods_cat_name[1] == 'c' || $goods_cat_name[1] == 'i') {
            //获取可定制功能组的插件
            $group_plugin = get_group_plugin_by_id($goods_id);

            /* 获取基础插件 start */
            $goods = $this->get_base_plugins($goods_info);
            foreach ($goods as $key => $item) {
                if ($item['is_basic'] == 0) {
                    unset($goods[$key]);
                }
            }
            /* group_goods表下的基础插件 */
            $sql1 = "
                    SELECT goods.*,groupgoods.is_basic,0 as is_sys
                    FROM {$GLOBALS['ecs']->table('goods')} goods, {$GLOBALS['ecs']->table('group_goods')} groupgoods
                    WHERE goods.goods_id = groupgoods.goods_id
                          and groupgoods.parent_id = '{$goods_info['goods_id']}'
                          and goods.is_delete = 0 and goods.is_on_sale = 1 and groupgoods.is_basic = 1";

            $gg_result = $GLOBALS['db']->getAll($sql1);
            $plugin_goods = array_merge($goods, $gg_result);
            /* 获取基础插件 end */

            $goods_id_arr = array();
            foreach ($plugin_goods as $key => $item) {
                array_push($goods_id_arr,$item['goods_id']);
            }
            //如果有可定制功能组的插件,功能组id则是同一个
            if ($group_plugin && count($group_plugin) > 0) {
                $group_id = get_group_id_by_addon_list($goods_id_arr);
            }
            //如果没有有可定制功能组的插件,则功能组id是框架产品的功能组的id
            else{
                $group_id = $d_price_ratio['price_group_id'];
            }
            //功能组价格($scale_type = 10表示最基础的价格模板类型)
            $basic_group_price = get_group_price_by_id($group_id,$scale_type = 10);
            $goods_price += $basic_group_price;
            foreach ($plugin_goods as $key => $p_item) {
                //插件产品价格
                $p_price = $p_item['shop_price'];
                //插件产品id
                $p_id = $p_item['goods_id'];
                //插件产品价格模板系数
                $p_ratio = get_price_ratio_by_id($p_id,$scale_type = 10);
                $p_price_ratio = $p_ratio ? $p_ratio['price_ratio'] : 1;
                $goods_price += $p_price*$p_price_ratio;
            }
        }
        return $goods_price;
    }

}

$gis = new gisstore();


/**
 * 2013-7-1 21:14:03
 * 用于ajax方式的json输出
 * 格式：{success:false,result:{......}}
 * @param  obj or string $result     结果,字符串为失败，对象为成功
 * @return nothing              nothing
 */
function tson($result, $url = "")
{
    if (is_string($result))
    {
        die_result(false, $result, null, $url);
    }
    elseif (is_array($result))
    {
        die_result(true, null, $result, $url);
    }
}

function insert_to_db($table_name, $insert_item)
{
    $GLOBALS['db']->autoExecute($GLOBALS['ecs']->table($table_name), $insert_item, 'INSERT');
    $order_info_id = $GLOBALS['db']->insert_id();

    return $order_info_id;
}

function update_to_db($table_name, $update_item, $condition)
{
    return $GLOBALS['db']->autoExecute($GLOBALS['ecs']->table($table_name), $update_item, 'UPDATE', $condition);
}
//yukang 2016-1-26强制调用修改真实表table_name
function update_to_db_org($table_name, $update_item, $condition)
{
    return $GLOBALS['db']->autoExecute($GLOBALS['ecs']->table_org($table_name), $update_item, 'UPDATE', $condition);
}
//yukang 2016-1-26强制调用插入真实表table_name
function insert_to_db_org($table_name, $insert_item)
{
    $GLOBALS['db']->autoExecute($GLOBALS['ecs']->table_org($table_name), $insert_item, 'INSERT');
    $order_info_id = $GLOBALS['db']->insert_id();

    return $order_info_id;
}

function check_request($arr, $is_ajax)
{
    foreach ($arr as $item)
    {
        $is_match = preg_match($item['reg'], $_REQUEST[$item['arg']]);

        if ($is_ajax)
        {
            $is_match || tson($item['arg_name'] . '格式不正确!');
        }
        else
        {
            //TODO
        }

    }

    return true;
}

function order_name($order_type)
{
    switch (intval($order_type))
    {
        case GOT_FIRST:
            return 'GIS产品购买';
        case GOT_RENEW:
            return 'GIS产品续费';
        case GOT_REASSEMBLE:
            return 'GIS产品选配';
        case GOT_DEV:
            //wenbaolin add 2014.08.07
            return '购买开发者授权';
        case GOT_SCORE:
            //sunanguang add 2014.08.29
            return '货币兑换积分';
        case GOT_SERVICE:
            //songdingding add 2015.04.09
            return '服务产品';
        default:
            die("invalid order_type");
    }
}

function get_goods_file_info($goods_id)
{
    $result = $GLOBALS['db']->getOne("
		    SELECT file_info
		    FROM {$GLOBALS['ecs']->table('goods')}
		    WHERE goods_id = '$goods_id'");

    if ($result)
    {
        return json_decode($result['file_info'], true);
    }
    else
    {
        return null;
    }
}

function get_goods_envs($cat_id, $envs_str)
{
    $result_arr = array();

    $platform = $GLOBALS['gis']->get_platform($cat_id);

    if (isset($GLOBALS['gis']->envs[$platform]))
    {
        foreach ($GLOBALS['gis']->envs[$platform] as $key => $value)
        {
            foreach (explode(',', $envs_str) as $item)
            {
                if ($key == $item)
                {
                    array_push($result_arr, $value);
                }
            }
        }

        return count($result_arr) == 0 ? '未知' : implode('，', $result_arr);
    }
    else
    {
        return '未知';
    }
}

function get_goods_langs($langs_str)
{
    $result_arr = array();

    foreach ($GLOBALS['gis']->langs as $key => $value)
    {
        foreach (explode(',', $langs_str) as $item)
        {
            if ($key == $item)
            {
                array_push($result_arr, $value);
            }
        }
    }

    return count($result_arr) == 0 ? '未知' : implode('，', $result_arr);
}


function get_file_info($file_info_str, $attr = null)
{
    $obj = json_decode($file_info_str, true);

    if ($attr)
    {
        return isset($obj[$attr]) ? $obj[$attr] : null;
    }
    else
    {
        return $obj;
    }
}

function get_bank_name($back_code)
{
    $back_code = strtolower($back_code);
    switch ($back_code)
    {
        case 'icbc':
            return '中国工商银行';
        case 'cmb':
            return '招商银行';
        default:
            return FALSE;
    }
}

function convert_url_in_string($str)
{
    if ( IS_PRIVATE_CLOUD == 0)
    {
        $pattern = '/http:\/\/192\.168\.\d+\.\d+\//';
        $replacement = $GLOBALS['myself_base_url'];
        $str = preg_replace($pattern, $replacement, $str);

        $pattern = '/http:\/\/192\.168\.\d+\.\d+:\d+\//';
        $replacement = $GLOBALS['dev_center_base_url'];
        $str = preg_replace($pattern, $replacement, $str);
    }
    else
    {
         $pattern = '/http:\/\/192\.168\.\d+\.\d+\//';
         $replacement = $GLOBALS['myself_base_url'];
         $str = preg_replace($pattern, $replacement, $str);
     
         $pattern = '/http:\/\/192\.168\.\d+\.\d+:\d+\//';
         $replacement = $GLOBALS['dev_center_base_url'];
         $str = preg_replace($pattern, $replacement, $str);
     
         $pattern = '/http:\/\/www\.smaryun\.com\//';
         $replacement = $GLOBALS['myself_base_url'];
         $str = preg_replace($pattern, $replacement, $str);
     
         $pattern = '/http:\/\/www\.smaryun\.com:\d+\//';
         $replacement = $GLOBALS['dev_center_base_url'];
         $str = preg_replace($pattern, $replacement, $str);
    }
    return $str;

}

require_once(ROOT_PATH . 'gis_service.php');