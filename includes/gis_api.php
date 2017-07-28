<?php
require_once(ROOT_PATH . 'includes/init.php');
require_once(ROOT_PATH . 'includes/cls_xml.php');
$app_db_obj    = zd_core::instance('zd_db_app_class');
zd_core::autoload('zd_app_class');
class GisApi {
    //
    public static function get_version_info($weight_id,$serial_no,$is_formal)
    {
        /**
        * 产品正式版本的和预发行版本的逻辑更新表的区分
        * @modify  [yukang][2015.12.17][add]
        */
        if($is_formal)
        {
            $table_name ='formal_goods';
        }
        else
        {
            $table_name ='goods';
        } 

        if (isset($weight_id))
        {
            $weight_id = strtolower(mysql_real_escape_string($weight_id));
   
            $result = $GLOBALS['db']->getRow(
                "SELECT goods.goods_id,goods.goods_name,goods.weight_id,goods.file_name,goods.version,goods.file_info
                FROM {$GLOBALS['ecs']->table($table_name)} goods
                WHERE goods.weight_id = '$weight_id'
                ORDER by last_update desc
            ");

            if( ! $result)
            {
                return_xml_result(false,'未找到任何信息');
            }

            $file_info = json_decode($result['file_info'], true);

            if( ! $file_info)
            {
                return_xml_result(false,'未找到任何文件信息');
            }

            $ret_result = array(
                "goods_id"   => $result["goods_id"],
                "goods_name" => $result["goods_name"],
                //"store_file_name" => $item["store_file_name"],
                "weight_id"  => $result["weight_id"],
                "version"    => $result['version'],
                "file_name"  => $result['file_name'],
                "file_size"  => $file_info['file_size'],
                "runtime"    => $file_info['runtime']
            );

            return_xml_result(true, $ret_result);
        }
        elseif (isset($serial_no))
        {
            //wenbaolin 2014.12.23 modify
            //这里的serial_no应该对应数据库中的group_serial_no
            //购买一份的时候，group_serial_no和serial_no是一致的
            //
            //多份的时候，group_serial_no和serial_no不一致
            //这种情况下serial_no是由多个值拼接而成，逗号分割

            $serial_no = strtolower(trim($serial_no));

            check_guid_format($serial_no) || return_xml_result(false, 'serail_no格式不正确！');

            $result = $GLOBALS['db']->getAll(
                "SELECT goods.goods_id,goods.goods_name,goods.weight_id,goods.file_name,goods.version,goods.file_info
                FROM {$GLOBALS['ecs']->table($table_name)} goods,{$GLOBALS['ecs']->table('order_info')} orderinfo,
                     {$GLOBALS['ecs']->table('order_goods')} ordergoods  
                WHERE orderinfo.group_serial_no = '$serial_no' and ordergoods.order_id = orderinfo.order_id and
                    ordergoods.goods_id = goods.goods_id 
                ORDER by ordergoods.parent_id 
            ");

            $return_result = array();

            foreach ($result as $item)
            {
                $file_info = json_decode($item['file_info'], true);

                if (!$item['weight_id'])
                {
                    continue;
                }

                array_push($return_result, array(
                    "goods_id"   => $item["goods_id"],
                    "goods_name" => $item["goods_name"],
                    //"store_file_name" => $item["store_file_name"],
                    "weight_id"  => $item["weight_id"],
                    "version"    => $item['version'],
                    "file_name"  => $item['file_name'],
                    "runtime"    => $file_info['runtime'],
                    "file_size"    => $file_info['file_size']
                ));
            }

            if (count($return_result) > 0)
            {
                return_xml_result(true, $return_result);
            }
            else
            {
                return_xml_result(false, "未查到版本信息");
            }
        }
    }

    public static function download_addon($weight_id,$is_formal)
    {
        /**
        * 产品正式版本的和预发行版本的逻辑更新表的区分
        * @modify  [yukang][2015.12.17][add]
        */
        if($is_formal)
        {
            $table_name ='formal_goods';
        }
        else
        {
            $table_name ='goods';
        } 
        
        $weight_id = strtolower(trim($weight_id));

        check_guid_format($weight_id) || return_xml_result(false, 'weight_id格式不正确');

        //请求地址
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        //接口rest
        $api_url = $ip."ecs/get/goods/fileid"."?weight_id=".$weight_id;
        //发送请求
        $ret_str = zd_common_class::_send_get($api_url);
        //解析返回结果
        $ret_obj = json_decode($ret_str);
        //获取file_guid
        $result = $ret_obj->result;
        // $result = $GLOBALS['db']->getRow("
        //     SELECT file_guid 
        //     FROM {$GLOBALS['ecs']->table($table_name)} 
        //     WHERE weight_id = '$weight_id' and is_on_sale = 1 and is_delete = 0 order by last_update desc");

        $result || return_xml_result(false, '不存在的包/插件文件.');

        $download_url = $GLOBALS['file_server_base_url'] . 'file/download/plugin/' . $result;

        header("Location:" . $download_url);
    }

    public static function op_igserver($aid,$pids,$iid)
    {
        //用来IGserver应用的注册或更新
        $err_msg = "";

        $parent_app_id = $aid;

        if (!check_guid_format($parent_app_id))
        {
            return_xml_result(false, "app_id格式错误");
        }

        $plugin_id_array = explode(',', $pids);

        foreach ($plugin_id_array as $item)
        {
            if (!check_guid_format($item))
            {
                return_xml_result(false, "插件id格式错误");
            }
        }

        $igserver_id = $iid;

        if ($igserver_id)
        {
            if (!check_guid_format($igserver_id))
            {
                return_xml_result(false, "igserver_id格式错误");
            }
        }

        $rus_result = reg_update_sub_app($parent_app_id, $plugin_id_array, $igserver_id, "IGServer");

        return_xml_result($rus_result['success'], $rus_result['result']);
    }


    public static function update_setup($runtime)
    {
        $setep_url = $GLOBALS['file_server_base_url'] . 'file/download/setup';
        header('Location:' . $setep_url);
    }

    public static function get_user_order($user_id)
    {
        if (empty($user_id)) {
            die_result(false,'not find user_id');
        }
        $result_all_array = get_user_order($user_id);
        die_result(true,null,$result_all_array);
    }
     /**
     * yukang 2016-4-12
     * 外部通知app在云主机中的部署信息
     * 参数app_id
     * 参数action install,upgrade,uninstall
     * @throws Exception
     */
    public static function openstack_callback($app_id,$action,$host_id = '')
    {   
        $update_app = new stdClass();
        if($action == 'install' || !empty($host_id)){
            try{
                //modify by zc 2016-09-22
                //针对应用平台的需求,若存在host_id，直接通过host_id获取对应的云主机
                if(empty($host_id))
                {
                    $server = zd_app_class::get_server_object_by_appid($app_id);
                }else
                {
                    $computeService = zd_openstack_class::get_computer_service();
                    //获取云主机
                    $server = $computeService->server($host_id);
                }
                $metadata = $server->getMetadata();
                $metadata->setProperty("action"," ");
                $response = $metadata->update();
                if($response && $response->isSuccessful()){
                     // $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
                    $update_app->status = 3;
                    zd_db_app_class::_update_app($app_id,$update_app);
                    echo json_encode(array('success'=>true));
                    exit;
                }
            }catch (Exception $e){
                $update_app->status = 4;
                zd_db_app_class::_update_app($app_id,$update_app);

                echo json_encode(array('success'=>false,'message'=>$e->getMessage()));
                exit;
            }
        }
        echo json_encode(array('success'=>false));
        exit;
    }
    /* 目前用于igserver */
    function reg_update_sub_app($parent_app_id, $plugin_id_array, $igserver_id, $user_name)
    {    
        $order_info = $GLOBALS['db']->getRow("
            SELECT * 
            FROM {$GLOBALS['ecs']->table('order_info')} 
            WHERE serial_no = '$parent_app_id'
        ");

        if( ! $order_info )
        {
            return return_result(false, array(
                'msg' => '错误的serial_no'
            ));
        }
        
        $user_name = get_user_by_id($order_info['user_id'],'user_name');
        $start_time = local_date('Y-m-d', $order_info['start_time']);
        $end_time   = local_date('Y-m-d', $order_info['end_time']);
        
        $reg_update_xml = $GLOBALS['gis_service']->gen_lic_xml($user_name, $start_time, $end_time, $plugin_id_array);
        
        $cd_history_item = array(
            'main_id'    => $parent_app_id,
            'time'       => gmtime(),
            'ip'         => $_SERVER["REMOTE_ADDR"],
            'memo'       => "IGServer",
            'start_time' => $order_info['start_time'],
            'end_time'   => $order_info['end_time'],
            'plugins'    => implode(',', $plugin_id_array)
        );
        
        $is_success = false;
        $cd_result  = "";
        
        if ($igserver_id)
        //update 
        {
            $cd_history_item['sub_id'] = $igserver_id;
            $cd_history_item['type']   = CD_AUTH_TYPE_UPDATE;
            
            try
            {
                if ($GLOBALS['gis_service']->update_app($igserver_id, $reg_update_xml) == "Success" OR ENVIRONMENT == 'development' )
                {
                    $is_success = true;
                    $cd_result  = '更新成功';
                }
                else
                {
                    $is_success = false;
                    $cd_result  = '更新失败';
                }
            }
            catch (Exception $e)
            {
                $is_success = false;
                $cd_result  = '更新时发生错误:' . json_encode($e);
            }
        }
        else
        {
            $cd_history_item['type'] = CD_AUTH_TYPE_REG;
            
            try
            {
                $register_result = $GLOBALS['gis_service']->register_app($reg_update_xml);
                if ((check_guid_format($register_result) && ENVIRONMENT == 'production') OR ENVIRONMENT == 'development')
                {
                    $is_success = true;
                    $cd_result  = $register_result;
                    $cd_history_item['sub_id'] = $cd_result;
                }
                else
                {
                    $is_success = false;
                    $cd_result  = '注册失败,' . $register_result;
                }
            }
            catch (Exception $e)
            {
                $is_success = false;
                $cd_result  = '注册时发生错误:' . json_encode($e);
            }
        }
        
        $cd_history_item['is_success'] = $is_success;
        
        if (!$is_success)
        {
            $cd_history_item['memo'] .= $cd_result;
        }
        
        insert_to_db('cdauth_history', $cd_history_item);
        
        return array(
            'success' => $is_success,
            'msg'     => $cd_result,
            'result'  => $cd_result
        );
    }
    /**
     * 格式不确定是json还是xml
     */
    function return_xml_result($success, $result)
    {
        $result = array('success' => $success ? 'true' : 'false', 'result' => $result);

        die(ArrayToXML::toXml($result));
    }
}
?>