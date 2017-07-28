<?php
/**
 * Created by PhpStorm.
 * User: zc
 * Date: 2016-9-22
 * Time: 上午10:21
 * 自动部署相关的方法
 */

class zd_deploy_class{

    //构造函数
    function __construct($user_id = 0)
    {

    }

    /**
     * add by zc 2016-09-22
     * 判断传入的插件id是否合法（是否属于一个框架下）
     * @param $addon_list
     * @return true/false
     */
    function judge_goods_is_valid($addon_list_str)
    {
        $addon_list = explode(',', $addon_list_str);
        //实例化商品逻辑类
        $goods_obj = zd_core::instance('zd_db_goods_class');
        return $goods_obj->_judge_is_parent_by_goods_id($addon_list);
    }

    /**
     * add by zc 2016-09-22
     * 创建自动部署的订单
     * @param $addon_list 插件ＩＤ的数组
     * @param $period　购买期限
     * @param $auto_user_id　用户id
     */
    function create_deploy_order($addon_list_str,$period,$user_id){
        $addon_list = explode(',', $addon_list_str);

        //实例化商品逻辑类
        $goods_obj = zd_core::instance('zd_db_goods_class');
        //实例化订单逻辑类
        $order_obj = zd_core::instance('zd_db_order_class');
        //实例化应用逻辑类
        $app_obj = zd_core::instance('zd_db_app_class');
        //实例化购买逻辑类
        $buy_flow_obj = zd_core::instance('zd_buy_flow_class');

        $order_data = new stdClass();

        //获取插件的框架id
        $goods_id = $goods_obj -> _get_parent_id_by_goods_id($addon_list[0]);
        //如果产品的框架id未获取到，考虑是独立应用
        if(empty($goods_id))
        {
            $goods_id = $addon_list[0];
            $addon_list = null;
        }
        //判断用户是否购买过该产品
        $order_id = $order_obj -> _get_order_id_by_user_goods_id($user_id,$goods_id);
        //未购买过或之前的购买已过期
        if(empty($order_id))
        {
            //创建新订单
            $order_id = $buy_flow_obj->_create_new_order($goods_id,$addon_list,1,$period,$user_id,10);
        }else{//已购买过此产品
            $addon_list_unpay = $order_obj -> _get_unpay_list_by_order_id($order_id,$addon_list);
            //对于未购买的插件，下订单
            if(!empty($addon_list_unpay))
            {
                $order_id = $buy_flow_obj -> _create_reassemble_order($addon_list_unpay,$order_id,$user_id);
            }
        }
        $order_data -> order_id = $order_id;
        $order_data -> msg = $buy_flow_obj -> _get_error();
        return $order_data;
    }

    /**
     * add by zc 2016-09-22
     * 执行自动部署任务
     * @param $user_name
     * @param $order_id
     * @param $host_id
     */
    function start_deploy_task($user_info,$order_id,$host_id)
    {
        //实例化应用逻辑类
        $app_obj = zd_core::instance('zd_db_app_class');
        //判断订单在云主机是否已安装
        $app_id = $app_obj -> _get_is_install_by_host_id($order_id,$host_id);

        $action = empty($app_id) ? "install" : "update";
        if(empty($app_id))
        {
            $app_name = $user_info['user_name'] . "的应用";
            //创建应用
            $app_id = zd_db_app_class::_create_app_by_user_id($app_name,'','','','4','',1,$order_id,'','',0,0,$user_info['user_id']);
        }
        //自动部署应用
        $return_data = zd_app_class::auto_deploy_app($host_id,$order_id,$app_id,$action);

        return $return_data;
    }
}