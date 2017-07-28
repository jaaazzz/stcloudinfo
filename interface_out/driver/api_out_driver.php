<?php
/**
 * GISSTORE 对外提供的接口具体实现
 * ============================================================================
 * 版权所有 2011-2016 zondycyber。
 * 网站地址: http://www.smaryun.com；
 * ----------------------------------------------------------------------------
 * $Author: huangbin $
 * $time 2015-12-01
 * ----------------------------------------------------------------------------
 */
if (!defined('IN_ECS'))
{
    die('Hacking attempt');
}
require(ROOT_PATH .'interface_out/api_out.php');
//定义类
class ApiDriver implements OutApi{
    //构造函数
    function __construct(){

    }
    /**
     * 根据订单号生成package.xml
     * @param $serial_no 订单的授权id
     * @return array
    */
    public function get_package_xml_by_sn($serial_no){
        //根据sn生成package.xml文件。
        //此方法是专门提供给集成应用中心使用，没有判断用户信息的

        //order_info表中serial_no号
        $order_sn  = $serial_no;

        // $sql = "
        // select orderinfo.order_sn,orderinfo.order_id,orderinfo.last_gen_file_time,orderinfo.last_modify_time,orderinfo.serial_no,
        // orderinfo.serial_no,orderinfo.group_serial_no,ordergoods.goods_name,goods.*
        // from {$GLOBALS['ecs']->table('order_info')} orderinfo, {$GLOBALS['ecs']->table('order_goods')} ordergoods,
        // {$GLOBALS['ecs']->table('category')} cat , {$GLOBALS['ecs']->table('goods')} goods
        // where orderinfo.order_id = '$order_sn' and
        // orderinfo.order_id = ordergoods.order_id and
        // goods.goods_id = ordergoods.goods_id and goods.cat_id = cat.cat_id
        // order by ordergoods.parent_id";

        // //当前授权号对应订单信息以及订单下商品的信息
        // $current_order_detail = $GLOBALS["db"]->getAll($sql);

        //请求地址
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        $api_url = $ip."ecs/get/order/goodsinfo";
        $api_url_s = $api_url."?order_id=".$order_sn."&user_id=".$_SESSION['user_id']."&is_single=false";
        //发送请求
        $ret_str = zd_common_class::_send_get($api_url_s);

        $current_order_detail = json_decode($ret_str,true);

        $current_order_detail = $current_order_detail["DATA"];

        //订单商品名
        $app_name = $current_order_detail[0]['goods_name'];

        //根据行业id获取平台类型(desktop,web,mobile)
        $package_type = $GLOBALS['gis']->get_platform(end($current_order_detail)['cat_id']);

        //将商品中的上传文件信息转换成数组
        $file_info = json_decode(stripslashes(end($current_order_detail)['file_info']), true);

        if (isset($file_info['platform']))
        {
            $platform = $file_info['platform'];
        }

        $package_xml_arr = array();

        $serial_no = $current_order_detail[0]['group_serial_no'] ? $current_order_detail[0]['group_serial_no'] : $current_order_detail[0]['serial_no'];

        //wenbaolin 2014.4.22 modify vzd_lcc_service_url => vzd_lcc_service_url_auto;
        $package_xml = $GLOBALS['gis']->gen_xml($app_name, '1.2.34567.8', gen_guid(), $serial_no,
        $GLOBALS['gis_service']->vzd_lcc_service_url_auto, $GLOBALS['gis_service']->update_url, $current_order_detail, $package_type, $platform);

        header("Content-Type: text/xml; charset=utf-8");
        die($package_xml);
    }

    public function GetUserCloudHost($uc_id,$user_name,$status,$search='',$page=1,$page_size=10)
    {
        //if ((is_null($uc_id) || empty($uc_id)) && (is_null($user_name) || empty($user_name))) {
        //   $ret = $this->ReturnContentModel(false, '检测到用户【uc_id/user_name】为空', null);
        //} else {
            try {
                //通过
                $list = zd_db_app_class::_get_host_list_by_uc_id($uc_id, $user_name, $status, $search, $page, $page_size);
                $ret = $this->ReturnContentModel(true, '获取用户所属的云主机列表信息成功', $list);
            } catch (Exception $e) {
                $ret = $this->ReturnContentModel(false, '获取用户所属的云主机列表异常。异常信息：' . $e->getMessage(), null);
            }
        //}

        return $ret;
    }

    public function GetCloudHostDetail($server_id)
    {
        if(is_null($server_id) || empty($server_id))
        {
            $ret = $this->ReturnContentModel(false,'检测到云主机【server_id】为空',null);
        }
        else {
            try {
                if (zd_openstack_class::is_host_have_to_id($server_id)) {
                    $server = zd_openstack_class::get_server_2($server_id);
                    if (is_bool($server) && !$server) {
                        $ret = $this->ReturnContentModel(false, '检测到云主机存在，但获取云主机详细信息失败。请联系管理员', null);
                    } else {
                        $ret = $this->ReturnContentModel(true, '检测到云主机存在，获取云主机详细信息成功', $server);
                    }
                } else {
                    $ret = $this->ReturnContentModel(false, '检测到云主机不存在', null);
                }
            } catch (Exception $e) {
                $ret = $this->ReturnContentModel(false, '获取云主机详细信息异常。异常信息：' . $e->getMessage(), null);
            }
        }

        return $ret;
    }

    public function GetCloudHostSSHUrl($server_id)
    {
        if (is_null($server_id) || empty($server_id)) {
            $ret = $this->ReturnContentModel(false, '检测到云主机【server_id】为空', null);
        } else {
            try {
                if (zd_openstack_class::is_host_have_to_id($server_id)) {
                    $server = zd_openstack_class::get_host_url_2($server_id);;
                    if (is_bool($server) && !$server) {
                        $ret = $this->ReturnContentModel(false, '检测到云主机存在，但获取云主机远程链接地址失败。请联系管理员', null);
                    } else {
                        $ret = $this->ReturnContentModel(true, '检测到云主机存在，获取云主机远程链接地址成功', $server);
                    }
                } else {
                    $ret = $this->ReturnContentModel(false, '检测到云主机不存在', null);
                }
            } catch (Exception $e) {
                $ret = $this->ReturnContentModel(false, '获取云主机远程链接地址异常。异常信息：' . $e->getMessage(), null);
            }
        }

        return $ret;
    }

    public function SetCloudHostOperation($id,$uc_id,$operation)
    {
        if (is_null($id) || empty($id)) {
            $ret = $this->ReturnContentModel(false, '检测到云主机【app_host_id】为空', null);
        } else {
            try {
                $user_info = zd_db_users_class::_get_user_info_by_uid($uc_id);
                $user_id = isset($user_info['user_id']) ? $user_info['user_id'] : '';
                if (empty($user_id)) {
                    $ret = $this->ReturnContentModel(false, '检测到用户不存在', null);
                } else {
                    $isEnd = false;
                    $operationText = "其他";
                    switch ($operation) {
                        case 'restart':
                            $operationText = '重启';
                            $isEnd = zd_app_class::restart_app_host($id, $user_id, 1);
                            break;
                        case 'start':
                            $operationText = '启动';
                            $isEnd = zd_app_class::open_app_host($id, $user_id, 1);
                            break;
                        case 'stop':
                            $operationText = '停止';
                            $isEnd = zd_app_class::close_app_host($id, $user_id, 1);
                            break;
                        case 'delete':
                            $operationText = '删除';
                            $isEnd = zd_app_class::delete_app_host($id, $user_id, 1);
                            break;
                        default:
                            break;
                    }

                    $ret = $this->ReturnContentModel($isEnd, '【' . $operationText . '】操作完成', null);
                }
            } catch (Exception $e) {
                $ret = $this->ReturnContentModel(false, '操作异常。异常信息：' . $e->getMessage(), null);
            }
        }

        return $ret;
    }

    public function GetGoodsList($page,$page_size,$page_count,$count,$sql_where)
    {
        $bool = true; $msg = ''; $content = null;
        try
        {
            //获取软件类型
            $cat_id = $sql_where['cat_type'];
            if (empty($cat_id)) {
                $cat_id_str = 'dc,wc,di,wi,dp,wp';
            }else{
                //行业简称
                $curr_nick_name = $GLOBALS['gis']->get_nick_name($cat_id);
                //获取行业id数据字符串
                $cat_id_str = $curr_nick_name.'c,'.$curr_nick_name.'i,'.$curr_nick_name.'p';
            }
            $c_id_arr = $GLOBALS['gis']->get_children(explode(',', $cat_id_str));

            //是否上架
            $is_on_sale = (is_null($sql_where['is_on_sale']) || empty($sql_where['is_on_sale'])) && $sql_where['is_on_sale'] !== '0' ? -1 : $sql_where['is_on_sale'];
            //软件名称
            $app_name = !is_null($sql_where['goods_name']) && !empty($sql_where['goods_name']) ? $sql_where['goods_name'] : '';

            //页码
            $page = (is_null($page) || empty($page) || $count <= 0 || $page_count < $page) ? 1 : $page;
            //每页显示条数
            $page_size = (is_null($page_size) || empty($page_size) || $page_size <= 0) ? 0 :$page_size;

            $goods_obj = zd_core::instance('zd_goods_class');
            $goods = $goods_obj->_get_tree_goods_by_cid($c_id_arr,$page,$page_size,$app_name,0,Array('is_on_sale' => $is_on_sale));

            if($goods['count'] <= 0)
            {
                $bool = true;
                $msg = '查询完成，但是没有任何记录';
            }
            else
            {
                //记录总数
                $count = $goods['count'];
                //页码总数
                $page_count = $page_size <= 0 ? 1 : ($page_count ? $page_count : intval(($count + $page_size - 1) / $page_size));
                $content = Array(
                    'PAGE'       => $page,
                    'PAGE_SIZE'  => $page_size,
                    'PAGE_COUNT' => $page_count,
                    'LIST_COUNT' => $count,
                    'GOODS_CONTENT'=> $goods['goods']
                );

                $bool = true;
                $msg = '查询成功';
            }
        }
        catch(Exception $e)
        {
            $bool = false;
            $msg = '查询失败。异常信息：' . $e->getMessage();
        }

        return $this->ReturnContentModel($bool, $msg, $content);
    }

    public function GetMyApplicationList($page,$page_size,$page_count,$count,$sql_where,$uc_id)
    {
        $bool = true; $msg = ''; $content = null;
        try {
            //查询USER_ID
            //$user_id = (is_null($uc_id) || empty($uc_id)) ? 0 : zd_db_users_class::_get_user_info_by_uid($uc_id)['user_id'];
            $user_id = 0;
            //应用类别
            $category = (is_null($sql_where['category']) || empty($sql_where['category'])) ? '' : $sql_where['category'];
            //应用状态：1-包括未部署，2-正在部署，3-已发布，4-发布失败
            $status = (is_null($sql_where['status']) || empty($sql_where['status'])) ? '' : $sql_where['status'];
            //是否上架：0-未上架；1-已上架
            $is_on_sale = (is_null($sql_where['is_on_sale']) || empty($sql_where['is_on_sale'])) ? '' : $sql_where['is_on_sale'];
            //应用名称
            $app_name = (is_null($sql_where['app_name']) || empty($sql_where['app_name'])) ? '' : $sql_where['app_name'];
            //应用类型
            $app_type = (is_null($sql_where['app_type']) || empty($sql_where['app_type'])) ? '' : $sql_where['app_type'];
            //当前页码
            $page = (is_null($page) || empty($page)) ? 1 : ($page > $page_count) ? 1 : $page;
            //每页显示记录条数
            $page_size = (is_null($page_size) || empty($page_size)) ? 0 : $page_size;

            $list = zd_db_app_class::get_app_list($category, $status, $user_id, $is_on_sale, $page, $page_size, $app_name,$app_type);
            if ($list['count'] <= 0) {
                $msg = '查询完成，但是没有任何记录';
            } else {
                //记录总数
                $count = $list['count'];
                //页码总数
                $page_count = $page_size <= 0 ? 1 : ($page_count ? $page_count : intval(($count + $page_size - 1) / $page_size));
                $content = Array(
                    'PAGE'       => $page,
                    'PAGE_SIZE'  => $page_size,
                    'PAGE_COUNT' => $page_count,
                    'LIST_COUNT' => $count,
                    'APP_CONTENT'=> $list['list']
                );

                $bool = true;
                $msg = '查询成功';
            }
        }
        catch(Exception $e)
        {
            $bool = false;
            $msg = '查询失败。异常信息：' . $e->getMessage();
        }

        $ret = $this->ReturnContentModel($bool, $msg, $content);
        $ret = str_replace('<','&lt;',$ret);
        $ret = str_replace('>','&gt;',$ret);
        return $ret;
    }

    public function GetMyApplicationHost($uc_id,$app_type,$host_id,$app_url,$status)
    {
        $bool = false; $msg = ''; $content = null;
        try {
            if (is_null($uc_id) || empty($uc_id)) {
                $msg = '检测到用户UC_ID为空';
            } else {
                if ($status == 3) {
                    switch ($app_type) {
                        //内部应用桌面
                        case 1:
                        //内部应用web
                        case 3:
                            $content = $app_url;
                            break;
                        //外部应用
                        case 2:
                            $content = zd_app_class::console_app_host_2($host_id);
                            break;
                        //外部应用-openstack
                        case 4:
                            $content = zd_openstack_class::get_host_url_2($app_url);
                            $content = is_bool($content) ? null : $content;
                            break;
                        default:
                            $msg = '检测到无该操作项';
                            break;
                    }
                    $bool = true;
                    $msg = '查询应用“在线应用”地址成功';
                }
                else{
                    $msg = '检测到应用还未发布';
                }
            }
        }
        catch(Exception $e)
        {
            $msg = '查询异常。异常信息：' . $e->getMessage();
        }
        return $this->ReturnContentModel($bool,$msg,$content);
    }

    public function SetMyApplicationOperations($uc_id,$app_type,$operation,$id)
    {
        $bool = false; $msg = ''; $content = null;
        try {
            if (is_null($id) || empty($id)) {
                $msg = '检测到应用ID为空';
            } else {
                if (is_null($uc_id) || empty($uc_id)) {
                    $msg = '检测到用户UC_ID为空';
                } else {
                    switch ($operation) {
                        //删除
                        case 'app_delete':
                            $operation_res = $this->DeleteApplication($id, zd_db_users_class::_get_user_info_by_uid($uc_id)['user_id']);
                            $msg = $operation_res['msg'];
                            $bool = $operation_res['bool'];
                            break;
                        //上架、下架
                        case 'app_sale':
                            $operation_res = zd_app_class::app_on_sale_2($id, zd_db_users_class::_get_user_info_by_uid($uc_id)['user_id']);
                            $msg = $operation_res['msg'];
                            $bool = $operation_res['bool'];
                            break;
                        //部署应用
                        case 'app_create':
                        //重新部署
                        case 'app_repeat':
                            $bool = true;
                            $msg = '查询部署应用链接成功';
                            $content = $_SERVER['REQUEST_SCHEME'] . '//' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . $_SERVER['CONTEXT_PREFIX'] . '/app.php?act=create&app_id=' . $id;
                            break;
                        //编辑
                        case 'app_edit':
                            $bool = true;
                            $msg = '查询编辑应用链接成功';
                            $content = $_SERVER['REQUEST_SCHEME'] . '//' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . $_SERVER['CONTEXT_PREFIX'];
                            if ($app_type == 1 || $app_type == 4) {
                                $content .= '/app.php?act=app_out_create&app_id=' . $id . '&is_edit=1';
                            } else {
                                $content .= '/app.php?act=create&app_id=' . $id . '&is_edit=1';
                            }
                            break;
                        default:
                            $msg = '检测到无该操作项';
                            break;
                    }
                }
            }
        }
        catch(Exception $e) {
            $msg = '查询异常。异常信息：' . $e->getMessage();
        }
        return $this->ReturnContentModel($bool,$msg,$content);
    }

    public function GetCategoryList()
    {
        $bool = false; $msg = ''; $content = null;
        try
        {
            $bool = true;
            $msg  = '查询成功';
            $content = zd_db_categroy_class::_get_categroy_list();
        }
        catch(Exception $e)
        {
            $msg = '查询异常。异常信息：' . $e->getMessage();
        }

        return $this->ReturnContentModel($bool,$msg,$content);
    }

    public function SetCategoryOperation($categories)
    {
        $bool = false; $msg = ''; $content = null;
        try
        {
            if(!empty($categories) && !is_null($categories)) {
                if(!is_array($categories)) {
                    $categories = json_decode(str_replace('\\', '', $categories), true);
                }
                foreach ($categories as $cate) {
                    if (!empty($cate['id']) && !is_null($cate['id']) && intval($cate['id']) > 0) {
                        zd_db_categroy_class::update_categroy($cate['id'], $cate['name'], $cate['order'],$cate['status'],1);
                    } else {
                        zd_db_categroy_class::create_categroy($cate['name'], $cate['order'],1);
                    }
                }
            }
            $bool = true;
            $msg  = '执行成功';
        }
        catch(Exception $e)
        {
            $msg = '操作异常。异常信息：' . $e->getMessage();
        }

        return $this->ReturnContentModel($bool,$msg,$content);
    }

    public function SetHomeAppSfwShow($option,$app_sfw)
    {
        $bool = false; $msg = ''; $content = null;
        try {
            if (is_null($app_sfw) || empty($app_sfw)) {
                $msg = '检测到POST为空';
            } else {
                if (!is_array($app_sfw)) {
                    $app_sfw = json_decode(str_replace('\\', '', $app_sfw), true);
                }

                $set_result = null;
                switch ($option) {
                    case 'app':
                        $set_result = $this->SetApplicationToHome($app_sfw);
                        break;
                    case 'sfw':
                        $set_result = $this->SetGoodsToHome($app_sfw);
                        break;
                    default:
                        $msg = '检测到无该操作项';
                        break;
                }

                if (!is_null($set_result)) {
                    $msg = $set_result['msg'];
                    $bool = $set_result['bool'];
                }
            }
        } catch (Exception $e) {
            $msg = '查询异常。异常信息：' . $e->getMessage();
        }

        return $this->ReturnContentModel($bool, $msg, $content);
    }

    public function GetHomeAppSfwShow($uc_id,$option)
    {
        $bool = false; $msg = ''; $content = null;
        try {
            $set_result = null;
            $user_id = (is_null($uc_id) || empty($uc_id)) ? 0 : zd_db_users_class::_get_user_info_by_uid($uc_id)['user_id'];
            switch ($option) {
                case 'app':
                    $set_result = $this->GetApplicationToHome($user_id);
                    break;
                case 'sfw':
                    $set_result = $this->GetGoodsToHome($user_id);
                    break;
                default:
                    $msg = '检测到无该操作项';
                    break;
            }

            if (!is_null($set_result)) {
                $msg = $set_result['msg'];
                $bool = $set_result['bool'];
                $content = $set_result['content'];
            }

        } catch (Exception $e) {
            $msg = '查询异常。异常信息：' . $e->getMessage();
        }

        $ret = $this->ReturnContentModel($bool, $msg, $content);
        $ret = str_replace('<','&lt;',$ret);
        $ret = str_replace('>','&gt;',$ret);
        return $ret;
    }

    public function SetGoodsOperations($operation,$goods_id){
        $bool = false; $msg = '操作完成'; $content = null;
        try
        {
            if(empty($goods_id) || is_null($goods_id))
            {
                $msg = '检测到软件ID为空';
            }
            else
            {
                if(strpos($goods_id, ',') > 0)
                {
                    $goods_id = hash_to_sql(explode($goods_id,','));
                }
                switch($operation)
                {
                    case 'on_sale':
                        $goods_obj = zd_core::instance('zd_goods_class');
                        $goods_obj->_set_sale_status_by_id($goods_id,1);
                        break;
                    case 'no_sale':
                        $goods_obj = zd_core::instance('zd_goods_class');
                        $goods_obj->_set_sale_status_by_id($goods_id,0);
                        break;
                    default:
                        $msg = '检测到无该操作项';
                        break;
                }

                $bool = true;
            }
        }
        catch(Exception $e)
        {
            $msg = '操作异常。异常信息：' . $e->getMessage();
        }

        return $this->ReturnContentModel($bool, $msg, $content);
    }

    public function CreateCloudHost($uc_id, $name, $image_id, $flavor_id, $cpu_core_num, $memory_size, $hdd_volume)
    {
        $bool = false;
        $msg = '';
        $content = null;
        // 验证UC_ID正确性
        $user_id = 0;
        if (is_null($uc_id) || empty($uc_id)) {
            $msg = '检测到用户UC_ID为空';
            goto end;
        } else {
            $user_id = zd_db_users_class::_get_user_info_by_uid($uc_id)['user_id'];
        }
        //验证云主机名称
        if (is_null($name) || empty($name)) {
            $msg = '检测到主机NAME为空';
            goto end;
        }
        //验证镜像名称
        if (is_null($image_id) || empty($image_id)) {
            $msg = '检测到主机镜像为空';
            goto end;
        }
        //验证规格名称
        if (is_null($flavor_id) || empty($flavor_id)) {
            $msg = '检测到主机规格为空';
            goto end;
        }
        //验证内存名称
        if (is_null($memory_size) || empty($memory_size)) {
            $msg = '检测到主机内存为空';
            goto end;
        }
        //验证CPU名称
        if (is_null($cpu_core_num) || empty($cpu_core_num)) {
            $msg = '检测到主机CPU为空';
            goto end;
        }
        //验证硬盘名称
        if (is_null($hdd_volume) || empty($hdd_volume)) {
            $msg = '检测到主机硬盘格为空';
            goto end;
        }

        try {
            //添加主机信息至数据库
            $host_id = zd_db_app_class::_create_app_host($cpu_core_num, $memory_size, $hdd_volume, $name,'','','','',$user_id,1,$image_id,$flavor_id);
            //创建云主机
            $cloud_info = zd_app_class::publish_app_host_again($host_id, $image_id, $flavor_id, $user_id);

            $msg = $cloud_info['msg'];
            $bool= $cloud_info['bool'];

            goto end;
        } catch (Exception $e) {
            $msg = '创建云主机异常。异常信息：' . $e->getMessage();
        }

        end:
        return $this->ReturnContentModel($bool, $msg, $content);
    }

    public function ImportGoodsToDataSource($file_name)
    {
        $bool = false; $content = null; $is_upload = false;
        try
        {
            if(is_null($file_name) || empty($file_name))
            {
                $msg = '检测File元素对应的name值为空';
                goto end;
            }
            //获取上传文件体
            if(!isset($_FILES[$file_name]) || $_FILES[$file_name]['error'] > 0)
            {
                $msg = '获取上传文件信息失败';
                goto end;
            }
            $file = $_FILES[$file_name];
            //指定存放上传文件目录
            $dirName = ROOT_PATH.'tmp/import/';
            if(file_exists($dirName)){
                //删除目录下所有文件
                $this->DeleteDir($dirName);
            }
            //创建文件目录
            mkdir($dirName,0777,true);
            //指定权限
            chmod($dirName,0777);
            $temp = $file['name'];
            $temp = iconv("utf-8", "gb2312//IGNORE", $temp);
            //上传文件的路径
            $up_path = $dirName . $temp;
            //上传文件
            if(!move_uploaded_file($file["tmp_name"], $up_path))
            {
                $msg = '上传文件失败';
                goto end;
            }
            $is_upload = true;
            //引入product_import.php文件
            require_once(ROOT_PATH . '/admin/product_import.php');
            //解压ZIP文件
            unzip_file($up_path,$dirName);
            //解压缩文件的路径
            $file_array = scandir($dirName);
            $d_name = '';
            foreach($file_array as $f){
                if($f != '.' && $f != '..' && is_dir($dirName.$f)){
                    $d_name = $f;
                }
            }
            $unzip_path = $dirName . $d_name;
            chmod($unzip_path,0777);
            //导入价格签名
            if(!$this->ImportPriceSign($unzip_path,$GLOBALS['cloud_dog_base_url']))
            {
                $msg = '导入价格签名失败';
                goto end;
            }
            //导入sql文件
            $import_sql = import_sql_file_2($unzip_path);
            if(!$import_sql["bool"])
            {
                $msg = $import_sql["msg"];
                goto end;
            }
            //拷贝图片文件
            copy_img_folder($unzip_path);

            $bool = true; $msg = '导入软件包完成';
            goto end;
        }
        catch(Exception $e)
        {
            $msg = '导入软件包异常。异常原因：' . $e->getMessage();
            goto end;
        }

        end:
        if($is_upload)
        {
            //导入完成后删除
            $this->DeleteDir('/tmp/import');
            //清除缓存
            clear_cache_files();
        }
        return Array('success'=>$bool,'result'=>$content,'msg'=>$msg,'guid'=>false);
    }

    /**
     * 获取审核订单
     * @param int $page 当前页码
     * @param int $size 每页数据个数
     * @return mixed
     */
    public function GetVerifyOrder($page,$size){
        //实例zd_db_order_class类库
        $acc_obj = zd_core::instance('zd_account_class');
        //获取数据
        $order_arr = $acc_obj->_get_user_acconut($user_id = 0, $page, $size);
        return $this->ReturnContentModel(true, $msg = "获取成功", $order_arr);
    }

    /**
     * 审核订单
     * @param int $order_sn 订单编码
     * @param int $order_status 审核状态(1.通过2.不通过)
     * @param string $verify_msg 审核消息
     * @return mixed
     */
    public function VerifyOrder($order_sn,$order_status,$verify_msg){
        //实例化购买逻辑类
        $buy_flow_obj = zd_core::instance('zd_buy_flow_class');
        //审核通过
        if ($order_status == 1) {
            //调用支付扣点接口
            $res = $buy_flow_obj->_do_pay_order($order_sn);
            if ($res) {
                $flag = true;
                $msg = "审核成功";
                $content = $res;
            }else{
                $flag = false;
                $msg = $buy_flow_obj->_get_error();
                $content = "";
            }            
        }
        //审核不通过
        elseif ($order_status == 2) {
            //调用取消订单接口
            $res = $buy_flow_obj->_cancel_order($order_sn,$verify_msg);
            if ($res) {
                $flag = true;
                $msg = "审核不通过";
                $content = $res;
            }
        }
        return $this->ReturnContentModel($flag, $msg, $content);
    }

    /**
     * 生成产品订单
     * @param string goods_id 产品id
     * @return mixed
     */
    public function CreatedOrder($goods_id){
        //实例化购买逻辑类
        $buy_flow_obj = zd_core::instance('zd_buy_flow_class');
        //执行根据产品id生成订单函数
        $res = $buy_flow_obj->_created_order_by_gid($goods_id);
        if ($res) {
            $flag = true;
            $msg = "创建成功";
            $content = $res;
        }else{
            $flag = false;
            $msg = $buy_flow_obj->_get_error();
            $content = "";
        }
        return $this->ReturnContentModel($flag, $msg, $content);
    }

    /**
     * 部署应用
     * @return mixed
     */
    public function DeployApp()
    {
        $app_name          = $_REQUEST['app_name'];
        $openstack_image_id= $_REQUEST['openstack_image_id'];
        $is_edit           = $_REQUEST['is_edit'];//１编辑0非编辑
        $category          = $_REQUEST['category'];
        $host_id           = $_REQUEST['host_id'];
        $app_description   = $_REQUEST['app_description'];
        $file_list         = $_REQUEST['file_list'];
        $logo_image        = $_REQUEST['logo_image'];
        $app_type          = $_REQUEST['app_type'];
        $status            = $_REQUEST['status'];
        $app_url           = $_REQUEST['app_url'];
        $order_sn          = $_REQUEST['sn'];
        $uc_id             = $_REQUEST['user_id'];

        $cpu_core_num      = $_REQUEST['cpu_core_num'];
        $memory_size       = $_REQUEST['memory_size'];
        $hdd_volume        = $_REQUEST['hdd_volume'];
        $name              = $_REQUEST['name'];
        $app_id            = $_REQUEST['app_id'];
        $is_public         = $_REQUEST['is_public'];
        $is_on_sale        = $_REQUEST['is_on_sale'];
        $flavorid          = $_REQUEST['flavorid'];


        if(empty($uc_id))
        {
            echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
            exit;
        }

        //订单id为空,需要根据产品id生成订单
        if (empty($order_sn) || !$order_sn) {
            //产品id
            $goods_id = isset($_REQUEST['g_id']) ? intval($_REQUEST['g_id']) : 0;
            //实例化购买逻辑类
            $buy_flow_obj = zd_core::instance('zd_buy_flow_class');
            //执行根据产品id生成订单函数
            $res = $buy_flow_obj->_created_order_by_gid($goods_id);
            if ($res) {
                $order_sn = $res;
            }else{
                echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>$buy_flow_obj->_get_error())));
                exit;                
            }
        }

        //调用获取订单信息函数
        $goods_info = zd_db_order_class::_get_goods_info_by_order_id($order_sn,true);
        if ($goods_info) {
            $goods_type = $GLOBALS['gis']->get_top_parent($goods_info['cat_id']);           
            $app_type = $goods_type;
        }

        //加载zd_db_users_class类库
        zd_core::autoload('zd_db_users_class');
        $user_info = zd_db_users_class::_get_user_info_by_uid($uc_id);

        $user_id = $user_info['user_id'];

        if($app_type!=1&&$app_type!=4&&$host_id==0&&$is_edit!=1)
        {

            if(empty($name))
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>"云主机名字不能为空")));
                exit;
            }

            if(empty($cpu_core_num))
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'cpu核心个数不能为空')));
                exit;
            }

            if(empty($memory_size))
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'内存大小不能为空')));
                exit;
            }

            if(empty($hdd_volume))
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'硬盘大小不能为空')));
                exit;
            }
        }

        if(empty($app_name))
        {
            echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'应用名称不能为空')));
            exit;
        }

        if($app_type==1&&empty($app_url))
        {  
            echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'外部应用地址为空')));
            exit;
        }

        if($app_type==4)
        {
            if(empty($app_url))
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'云主机ID不能为空')));
                exit;
            }
            $is_host_have = zd_openstack_class::is_host_have_to_id($app_url);
            if(!$is_host_have)
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'该云主机ID不正确！')));
                exit;
            }

        }

        if($app_type==1&&(!preg_match('/(http:\/\/)|(https:\/\/)/i', $app_url)))
        {  
            echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'外部应用地址缺少http或https')));
            exit;
        }

        if($app_type!=1&&$app_type!=4&&$host_id==0&&$is_edit!=1)
        {
            $host_id = zd_db_app_class::_create_app_host($cpu_core_num,$memory_size,$hdd_volume,$name);
            // 创建云主机判断当前用户云主机
            zd_app_class::create_host_for_user($user_id);
        }

        if($app_id>0)
        {
            $app_detail_obj = zd_db_app_class::_get_app_detail($app_id);

            if($app_detail_obj['user_id']==$user_id)
            {
                // 修改操作
                $app_data = array(
                    'app_name'        => $app_name,
                    'category'        => $category,
                    'app_description' => $app_description,
                    'app_type'        => $app_type,
                    'logo_image'      => $logo_image,
                    'order_sn'        => $order_sn,
                    'file_list'       => $file_list,
                    'created'         => date('Y-m-d H:i:s',time()),
                    'app_url'         => $app_url,
                    'status'          => $status,
                    'is_on_sale'      => $is_on_sale,
                    'is_public'       => $is_public,    
                    'user_id'         => $user_id
                    );
                //上架后的编辑操作不修改云主机
                if($is_edit!=1)
                {
                    $app_data['host_id'] = $host_id;
                }
                
                zd_db_app_class::_update_app($app_id,$app_data);
            }
            else
            {
                echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'该应用不是您创建的，你无权修改')));
                exit;
            }

        }
        else
        {
            // 创建操作
            $app_id=zd_db_app_class::_create_app($app_name,$category,$host_id,$app_description,$app_type,$logo_image,$status,$order_sn,$app_url,$file_list,$is_public,$is_on_sale,$user_id);
        }
        // 1包括未部署，2正在部署，3已发布，4发布失败
        if($status==2 && $is_edit==0)
        {
            zd_app_class::publish_app($host_id,$order_sn,$app_id,'install',$openstack_image_id,$flavorid);
        }
        echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
        exit;
    }

    /**
     * 根据订单id获取订单信息
     * @param string $order_id 订单id
     * @return mixed
     */    
    public function GetOrderAppType($order_id)
    {
        //调用获取订单信息函数
        $goods_info = zd_db_order_class::_get_goods_info_by_order_id($order_id,true);
        if ($goods_info) {
            $goods_type = $GLOBALS['gis'] -> get_top_parent($goods_info['cat_id']);
            $flag = true;
            $msg = "获取成功";
            $content = $goods_type;            
        }
        else{
            $flag = false;
            $msg = "未找到相关订单信息";
            $content = "";            
        }
        return $this->ReturnContentModel($flag, $msg, $content);        
    }

    /**
     * 审核云主机
     * @param string $host_id 云主机id
     * @param string $status 审核状态(1:通过2:不通过)
     * @param string $openstack_image_id
     * @param string $flavorid
     * @param string $verify_msg 审核消息
     * @return mixed
     */
    public function VerifyHost($host_id,$status,$verify_msg)
    {
        $host_info = zd_db_app_class::_get_app_host_detail($host_id);
        if ($host_info) {
            $data = new stdClass();
            if ($status == 1) {
                $data->status = 1;
            }elseif ($status == 2) {
                $data->status = 6;
                $data->verify_msg = $verify_msg;
                $apply_time = $host_info['created'];
                $apply_name = $host_info['name'];
            }
            $flag = zd_db_app_class::_update_app_host($host_id,$data);
            if ($flag && $status == 1) {
                $openstack_image_id = $host_info['openstack_image_id'];
                $apply_time = $host_info['created'];
                $apply_name = $host_info['name'];
                $flavorid = $host_info['flavorid'];
                zd_app_class::publish_app_host($host_id,$openstack_image_id,$flavorid);
                $flag = true;
                $msg = "审核成功";
                $content = "";  
            }
        }else{
            $flag = false;
            $msg = "未找到相关云主机信息";
            $content = "";              
        }
        return $this->ReturnContentModel($flag, $msg, $content); 
    }

    /**
     * 删除应用
     * @param int $app_id 应用ID
     * @param int $user_id 用户USER_ID
     * @return array
     */
    private function DeleteApplication($app_id,$user_id)
    {
        $bool = false; $msg = '删除成功';
        try {
            //查询应用详情
            $app_detail_obj = zd_db_app_class::_get_app_detail($app_id);
            if ($app_detail_obj['user_id'] == $user_id) {
                //订单id
                if (!empty($app_detail_obj['order_sn'])) {
                    //调用云狗解绑信息接口
                    $order_info = zd_db_order_class::_get_order_info_by_id($app_detail_obj['order_sn'], $user_id);
                    //授权号
                    $serial_no = $order_info['serial_no'];
                    //获取其绑定信息
                    $auth_info = $GLOBALS['gis_service']->get_auth_info($serial_no);
                    //可解除绑定
                    if ($auth_info['success'] && !empty($auth_info['result']->BingdingMac)) {
                        $GLOBALS['gis_service']->update_auth_mac_info($serial_no);
                    }
                }
                //修改操作
                $app_data = array('hidden' => 1);
                zd_db_app_class::_update_app($app_id, $app_data);

                $bool = true;
            } else {
                $msg = '应用不属于您，您无权删除';
            }
        }
        catch(Exception $e)
        {
            $msg = '删除应用异常。异常信息：' . $e->getMessage();
        }
        return Array('bool' => $bool,'msg' => $msg);
    }

    /**
     * 设置门户-应用显示列表
     * @param Array $app POST体参数 ID/ORDER
     * @return array
     */
    private function SetApplicationToHome($app)
    {
        $bool = false; $msg = '设置门户-应用显示成功';
        try {
            //将初始的显示列清空
            $GLOBALS['db']->update('ecs_application',Array('is_show_index' => 0),Array('hidden' => 0, 'is_show_index' => 1));
            //重新设置显示列表且排序
            foreach ($app as $p) {
                $GLOBALS['db']->update('ecs_application', array('is_show_index' => 1, 'show_order' => $p['order']), array('id' => $p['id'], 'status' => 3));
            }

            $bool = true;
        }
        catch(Exception $e)
        {
            $msg = '设置门户-应用显示异常。异常信息：' . $e->getMessage();
        }

        return Array('bool' => $bool,'msg' => $msg);
    }

    /**
     * 设置门户-软件显示列表
     * @param $sfw
     * @return array
     */
    private function SetGoodsToHome($sfw)
    {
        $bool = false; $msg = '设置门户-软件显示成功';
        try {
            //将初始的显示列清空
            $GLOBALS['db']->update('ecs_goods',Array('is_shipping' => 0),Array('is_delete' => 0, 'is_shipping' => 1,'is_on_sale' => 1));
            //重新设置显示列表且排序
            foreach ($sfw as $s) {
                $GLOBALS['db']->update('ecs_goods', array('is_shipping' => 1), array('is_delete' => 0, 'is_on_sale' => 1, 'goods_id' => $s['id']));
            }

            $bool = true;
        }
        catch(Exception $e)
        {
            $msg = '设置门户-软件显示异常。异常信息：' . $e->getMessage();
        }

        return Array('bool' => $bool,'msg' => $msg);
    }

    /**
     * 查询门户-应用显示列表
     * @param $user_id
     * @return array
     */
    private function GetApplicationToHome($user_id)
    {
        $bool = false; $content = null;
        try
        {
            //在线应用
            $app_arr = zd_db_app_class::_get_app_garden_list('',3,$user_id,1,1,5,'',1,3);
            $bool = true; $msg = '查询成功'; $content = $app_arr['list'];
        }
        catch(Exception $e)
        {
            $msg = '查询门户-应用显示列表异常。异常信息：' . $e->getMessage();
        }

        return Array('bool'=>$bool, 'msg'=>$msg, 'content'=>$content);
    }

    /**
     * 查询门户-软件显示列表
     * @param $user_id
     * @return array
     */
    private function GetGoodsToHome($user_id)
    {
        $bool = false; $content = null;
        try {
            //获取全部产品(桌面,web)
            $cat_id_str = 'dc,di';
            //行业id数组
            $c_id_arr = $GLOBALS['gis']->get_children(explode(',', $cat_id_str));
            //实例化类
            $goods_obj = zd_core::instance('zd_goods_class');
            //获取桌面工具
            $goods_arr = $goods_obj->_get_goods_by_cid($c_id_arr, 1, 5, '', $user_id, null, 1);

            $bool = true; $msg = '查询成功'; $content = $goods_arr['goods'];
        }
        catch(Exception $e)
        {
            $msg = '查询门户-软件显示列表异常。异常信息：' . $e->getMessage();
        }

        return Array('bool'=>$bool, 'msg'=>$msg, 'content'=>$content);
    }

    /**
     * 删除指定目下
     * @param $dir
     * @return bool
     */
    function DeleteDir($dir)
    {
        try {
            $dh = opendir($dir);
            while ($file = readdir($dh)) {
                if ($file != "." && $file != "..") {
                    $fullpath = $dir . "/" . $file;
                    if (!is_dir($fullpath)) {
                        unlink($fullpath);
                    } else {
                        $this->DeleteDir($fullpath);
                    }
                }
            }
            closedir($dh);

            //删除当前文件夹
            return rmdir($dir);
        } catch (Exception $e) {

        }

        return false;
    }

    /**
     * 导入私云的价格签名
     * @param $file_path
     * @param $service_url
     * @return bool
     */
    public function ImportPriceSign($file_path,$service_url)
    {
        if(!is_file($file_path."/gs_dog.xml"))
        {
            return false;
        }
        else
        {
            $xml_str = file_get_contents($file_path . "/gs_dog.xml");
            $service = new GIS_SERVICE($GLOBALS['myself_base_url'], $service_url,$service_url);
            $result =  $service->import_register_price($xml_str);

            return $result['success'];
        }
    }

    public function UpdateInsertUser($user_name,$user_pass,$user_email,$uc_id)
    {
        $bool = false; $msg = ""; $content = null;
        try
        {
            if(is_null($user_name) || empty($user_name))
            {
                $msg = "检测到用户名称为空";
                goto end;
            }
            if(is_null($user_pass) || empty($user_pass))
            {
                $msg = "检测到用户密码为空";
                goto end;
            }
            if(is_null($uc_id) || empty($uc_id))
            {
                $msg = "检测到UC_ID为空";
                goto end;
            }
            //用户流程逻辑类
            $user_flow_obj = zd_core::instance('zd_users_class');
            //执行同步
            $bool = $user_flow_obj->_uc_login_add_user($user_name,$user_pass,$user_email,$uc_id);
        }
        catch(Exception $e)
        {
            $msg = '更新用户信息异常。异常详情：' . $e->getMessage();
        }

        end:
        return $this->ReturnContentModel($bool, $msg, $content);
    }

    /**
     * 管理云主机接口 公共返回函数
     * @param bool $bool 响应状态
     * @param string $msg 响应描述
     * @param object $content 响应内容
     * @return json
     */
    private function ReturnContentModel($bool,$msg,$content)
    {
        return json_encode(Array('RESULT'=>$bool,'MSG'=>$msg,'CONTENT'=>$content));
    }
}

$outApi = new ApiDriver();

?>