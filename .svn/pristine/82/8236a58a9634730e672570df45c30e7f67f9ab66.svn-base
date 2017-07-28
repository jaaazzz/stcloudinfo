<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: yukang
// +----------------------------------------------------------------------

/**
 * 应用操作类
*/
class zd_db_app_class{

	/* 构造函数 */
    public function __construct(){

    }
    public static function create($order_id,$app_id,$user_id){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        $api_url = $ip."ecs/create";
        $api_url_s = $api_url."?order_id=".$order_id."&app_id=".$app_id."&user_id=".$user_id;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result;
    }
    /**
     *创建应用
     *create  at 2016-03-２９
     * @author yukang
     * @param (必填)string $app_name 应用名称
     * @param (必填)int $category  分类category的id
     * @param (选填)string $host_id 主机ip
     * @param (选填) string $app_description 应用描述
     * @param (选填) string $app_type  1.外部应用　2.内部应用桌面 3.内部应用web,4.外部应用填写云主机IＤ
     * @param (选填) string $logo_image logo图片
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (选填) string $order_sn 订单编号
     * @param (选填) string $app_url 外部应用地址
     * @param string $file_list 附件
     * @return 返回值：true/flase
     **/
    public static function _create_app_by_user_id($app_name,$category,$host_id,$app_description,$app_type,$logo_image,$status,$order_sn,$app_url,$file_list,$is_public,$is_on_sale,$user_id)
    {
        //$user_id       = $_SESSION['user_id'];
        $update_application = array(
            'app_name'        => $app_name,
            'category'        => $category,
            'host_id'         => $host_id,
            'app_description' => $app_description,
            'app_type'        => $app_type,
            'logo_image'      => $logo_image,
            'order_sn'        => $order_sn,
            'file_list'       => $file_list,
            'created'         => date('Y-m-d H:i:s',time()),
            'app_url'         => $app_url,
            'status'          => $status,
            'user_id'         => $user_id,
            'is_on_sale'      => $is_on_sale,
            'is_public'       => $is_public
        );
        $app_id       = insert_to_db( 'application',$update_application);
        return $app_id;
    }
    /**
     *创建应用
     *create  at 2016-03-２９
     * @author yukang
     * @param (必填)string $app_name 应用名称
     * @param (必填)int $category  分类category的id
     * @param (选填)string $host_id 主机ip
     * @param (选填) string $app_description 应用描述
     * @param (选填) string $app_type  1.外部应用　2.内部应用桌面 3.内部应用web,4.外部应用填写云主机IＤ
     * @param (选填) string $logo_image logo图片
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (选填) string $order_sn 订单编号
     * @param (选填) string $app_url 外部应用地址
     * @param string $file_list 附件
     * @return 返回值：true/flase
     **/
    public static function _create_app($app_name,$category,$host_id,$app_description,$app_type,$logo_image,$status,$order_sn,$app_url,$file_list,$is_public,$is_on_sale,$user_id = 0)
    {
            if (empty($user_id)) {
                $user_id = $_SESSION['user_id'];
            }

            $update_application = array(
                 'app_name'        => $app_name,
                 'category'        => $category,
                 'host_id'         => $host_id,
                 'app_description' => $app_description,
                 'app_type'        => $app_type,
                 'logo_image'      => $logo_image,
                 'order_sn'        => $order_sn,
                 'file_list'       => $file_list,
                 'created'         => date('Y-m-d H:i:s',time()),
                 'app_url'         => $app_url,
                 'status'          => $status,
                 'user_id'         => $user_id,
                 'is_on_sale'      => $is_on_sale,
                 'is_public'       => $is_public
                 );
             $app_id       = insert_to_db( 'application',$update_application);

//        $arr = array("file_size" => 13499954, "file_guid" => "1WR1fr7hSqje9qbD","store_file_name" => "4maqnRfUjHpHtPTm.dczip","original_file_name" => "三维地学建模.dczip","version"=>"1.0.0.2","md5"=>"3a3c0e91-3860-02de-bbd1-1a2f1e692585","file_name"=>"三维地学建模","runtime"=>"10.0.3.122");
//        $file_info = json_encode($arr);
//        for ($i=0; $i <3 ; $i++) {
//            $name ="三维地学建模".$i;
//            $update_sql = "INSERT INTO `a`.`ecs_goods` (`goods_id`, `cat_id`, `goods_sn`, `goods_name`, `goods_name_style`, `click_count`, `brand_id`, `provider_name`, `goods_number`, `goods_weight`, `market_price`, `shop_price`, `shop_price_bak`, `promote_price`, `promote_start_date`, `promote_end_date`, `warn_number`, `keywords`, `goods_brief`, `goods_desc`, `goods_thumb`, `goods_img`, `original_img`, `is_real`, `extension_code`, `is_on_sale`, `is_alone_sale`, `is_shipping`, `integral`, `add_time`, `sort_order`, `is_delete`, `is_best`, `is_new`, `is_hot`, `is_promote`, `bonus_type_id`, `last_update`, `goods_type`, `seller_note`, `give_integral`, `rank_integral`, `suppliers_id`, `is_check`, `upload_file_guid`, `weight_id`, `grade`, `file_name`, `file_size`, `md5`, `envs`, `lang`, `version`, `notes`, `file_info`, `file_guid`, `store_file_name`, `developer_id`, `is_official`, `goods_trial_period`, `is_has_beta`, `is_has_formal`, `workbench_id`) VALUES (NULL, '22', 'DC1461175752', '$name', '+', '858', '0', '', '0', '0.000', '0.00', '80', '0.00', '0.00', '0', '0', '1', '', '', '<p>&nbsp;&nbsp;&nbsp;&nbsp; MapGIS 10 三维地学建模测试而已</p>
//                ', '', 'http://www.smaryun.com:8080/thumbnail/original_original_%E7%B3%BB%E7%BB%9F.png?1461132700', 'http://www.smaryun.com:8080/thumbnail/original_original_%E7%B3%BB%E7%BB%9F.png?1461132700', '0', '', '1', '1', '0', '0', '1461175752', '100', '0', '0', '1', '0', '0', '0', '1461175752', '0', '', '-1', '-1', '0', '0', '', '94b01c59-6362-47a0-960f-2436ee8e7176', '0.00', '三维地学建模', '13499954', '3a3c0e91-3860-02de-bbd1-1a2f1e692585', 'windows_xp,windows_7,windows_8', 'chinese', '1.0.0.2', '', '$file_info', '1WR1fr7hSqje9qbD', '4maqnRfUjHpHtPTm.dczip', '1064', '0', '7', '0', '1', '58')";
//            $GLOBALS["db"]->query($update_sql);
//        }
		
        return $app_id;
    }
    /**
     *修改我的应用接口
     *create  at 2016-04-0８
     * @author yukang
     * @param (必填)update_app array()修改参数
     * @param (必填)int $app_id　应用id  
     **/
    public static function _update_app($app_id,$update_app)
    {
        $update_sql = "
                    UPDATE " . $GLOBALS["ecs"]->table("application") . " 
                    SET " . hash_to_sql($update_app) . " 
                    WHERE id = '$app_id';";
        return $GLOBALS["db"]->query($update_sql);
    }

    public static function get_app_list($category,$status,$user_id,$is_on_sale='',$page=1,$page_size=10,$search='',$app_type='')
    {
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/applist";

        $api_url_s = $api_url."?category=".$category."&status=".$status."&user_id=".$user_id."&is_on_sale=".$is_on_sale."&page=".$page."&page_size=".$page_size."&search=".$search."&app_type=".$app_type;

        zd_core::autoload("zd_common_class");

        $result_msg = zd_common_class::_send_get($api_url_s);

        $res = json_decode($result_msg,true)['list'];

        $count = json_decode($result_msg,true)['count'];

        $result['list']  = $res;

        $result['count']  = $count;


        return $result;
    }
    /**
     *获取应用
     *create  at 2016-03-30
     * @author yukang
     * @param (必填)int $category  分类category的id
     * @param (选填) string $status 应用状态，1包括未部署，2正在部署，3已发布，4发布失败
     * @param (必填)string $page_size 每页多大
     * @param (必填)string $page 页数
     * @param (必填)string $user_id 用户id
     * @param (选填)　string $search 查询条件
     * @return 返回值：array()
     **/
    public static function _get_app_list($category,$status,$user_id,$is_on_sale='',$page=1,$page_size=10,$search='',$app_type='')
    {
        
        $where = "a.hidden = 0 AND ((a.app_type=1 or a.app_type=4 or o.parent_id<>0) or ((a.app_type=2 or a.app_type=3) and o.parent_id = 0))";

        if(!empty($user_id))
        {
            $where .= " AND a.user_id=$user_id";
        }
        if(!empty($status))
        {
            $where .=" AND a.status = $status";
        }

        if(!empty($category))
        {
            $where .=" AND a.category = $category";
        }
        
        if($is_on_sale!=='')
        {
            $where .=" AND a.is_on_sale = $is_on_sale";
        }

        if (!empty($search)) {
            $where .= " AND a.app_name like '%$search%'";
        }

        if(!empty($app_type))
        {
            $where .= " AND a.app_type in (" . $app_type . ")";
        }
        // //构造过滤语句
        // $where = "a.status = $status AND a.category = $category AND a.user_id=$user_id";

        $sql = "
                SELECT a.*, u.user_name, c.name as cate_name, h.name as host_name, a1.collection_sum, o.goods_name
                FROM {$GLOBALS[ecs]->table('application')} AS a
                left join {$GLOBALS[ecs]->table('users')} AS u on a.user_id=u.user_id
                left join {$GLOBALS[ecs]->table('app_category')} AS c on a.category=c.id
                left join {$GLOBALS[ecs]->table('app_host')} AS h on a.host_id=h.id
                left join {$GLOBALS[ecs]->table('order_goods')} AS o on o.order_id=a.order_sn
                left join (select COUNT(DISTINCT col.id) AS collection_sum, col.obj_id, col.obj_type
                        from {$GLOBALS[ecs]->table('collection')} AS col where col.obj_type='app' group by col.obj_id) AS a1
                        ON a1.obj_id = a.id
                WHERE $where
                group by a.id
                ORDER BY a.id desc";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);
        if(!is_null($page_size) && !empty($page_size) && !is_null($page) && !empty($page) && intval($page_size) > 0 && intval($page) > 0)
        {
            $start_mun = ($page - 1) * $page_size;
            $sql .= " LIMIT $start_mun, $page_size";
        }

        $res = $GLOBALS['db']->getAll($sql);

        $result['list']  = $res;
        $result['count'] = $count;
        return $result;

    }
    /**
     *查看应用详情
     *create  at 2016-03-31
     * @author yukang
     * @param (必填)int $app_id app的id
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @return 返回值：array()
     **/
    public static function _get_app_detail($app_id,$status = 0)
    {
        $where = "a.hidden = 0 AND a.id = $app_id";

        if(!empty($status))
        {
            $where .= " AND a.status=$status";
        }

        $sql = "
                SELECT a.*,u.user_name,h.host_server_id,h.host_ip,h.cpu_core_num,h.hdd_volume,h.memory_size,c.name as category_name
                FROM {$GLOBALS[ecs]->table('application')} AS a
                left join {$GLOBALS[ecs]->table('app_category')} AS c on c.id = a.category
                LEFT JOIN {$GLOBALS[ecs]->table('users')} AS u ON u.user_id = a.user_id
                LEFT JOIN {$GLOBALS[ecs]->table('app_host')} AS h ON h.id = a.host_id
                WHERE $where ";

        $result = $GLOBALS['db']->getRow($sql);

        return $result;
    }

    public static function get_app_detail($app_id,$user_id,$app_type){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        $api_url = $ip."ecs/get/appdetail";
        $api_url_s = $api_url."?user_id=".$user_id."&app_id=".$app_id."&app_type=".$app_type;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result;
    }

    /**
     * create at 2016-09-22
     * 获取应用的状态　　1包括未提交，2正在部署，3已发布，4发布失败
     * @author zc
     * @param $app_id
     */
    public static function _get_app_status($app_id){
        $sql = "SELECT status FROM {$GLOBALS[ecs]->table('application')} WHERE id = $app_id";
        return $GLOBALS['db']->getOne($sql);
    }
    /**
     *创建云主机
     *create  at 2016-04-01
     * @author yukang
     * @param (必填)string $cpu_core_num cpu核心个数
     * @param (必填)int $memory_size  cpu核心个数
     * @param (选填)string $hdd_volume 内存大小(单位G)
     * @param (选填) string $operation_system 操作系统名称
     * @param (选填) string $host_ip  主机ip
     * @param (选填) string $host_password 主机密码
     * @param (选填) string $host_name 主机名
     * @param (选填) string $host_server_id 
     * @return 返回值：id
     **/
    public static function create_app_host($cpu_core_num,$memory_size,$hdd_volume='',$name='',$operation_system='',$host_ip='',$host_password='',$host_server_id='',$user_id='',$status = 1, $openstack_image_id, $flavorid)
    {
        // status 云主机状态，1正在创建，2创建失败，3正在运行，4已关闭,5正在申请
        $user_id       = !empty($user_id) ? $user_id : $_SESSION['user_id'];
        $update_app_host = array(
                'user_id'          => $user_id,
                'cpu_core_num'     => $cpu_core_num,
                'status'           => $status,
                'memory_size'      => $memory_size,
                'hdd_volume'       => $hdd_volume,
                'operation_system' => $operation_system,
                'host_ip'          => $host_ip,
                'host_password'    => $host_password,
                'name'             => $name,
                'created'          => date('Y-m-d H:i:s',time()),
                'openstack_image_id' => $openstack_image_id,
                'flavorid'         => $flavorid,
                'host_server_id'   => $host_server_id
                );
        $app_host_id = insert_to_db( 'app_host',$update_app_host);
        return $app_host_id;
    }
    /**
     *创建云主机
     * @param (必填)string $cpu_core_num cpu核心个数
     * @param (必填)int $memory_size  cpu核心个数
     * @param (选填)string $hdd_volume 内存大小(单位G)
     * @param (选填) string $operation_system 操作系统名称
     * @param (选填) string $host_ip  主机ip
     * @param (选填) string $host_password 主机密码
     * @param (选填) string $host_name 主机名
     * @param (选填) string $host_server_id 
     * @return 返回值：id
     **/
    public static function _create_app_host($cpu_core_num,$memory_size,$hdd_volume='',$name='',$operation_system='',$host_ip='',$host_password='',$host_server_id='',$user_id='',$status = 1, $openstack_image_id, $flavorid,$tenant_group_id){
        $ip = trim($GLOBALS['iggs_api_url_base_url']);
        $user_id       = !empty($user_id) ? $user_id : $_SESSION['user_id'];
        $api_url = $ip."ecs/create/apphost";
        $api_url_s = $api_url."?cpu_core_num=".$cpu_core_num."&memory_size=".$memory_size."&hdd_volume=".$hdd_volume."&name=".$name."&operation_system=".$operation_system."&host_ip=".$host_ip."&host_password=".$host_password."&host_server_id=".$host_server_id."&user_id=".$user_id."&status=".$status."&openstack_image_id=".$openstack_image_id."&flavor_id=".$flavorid."&tenant_group_id=".$tenant_group_id;
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

            $result = json_decode($message_result,true);

            return $result;
    }
    /**
     *修改云主机
     *create  at 2016-04-06
     * @author yukang
     * @param (必填)update_app_host array()修改参数
     * @param (必填)int $app_host_id　云主机ip  
     * @return 返回值：id
     **/
    public static function _update_app_host($app_host_id,$update_app_host)
    {
        $update_sql = "
                    UPDATE " . $GLOBALS["ecs"]->table("app_host") . " 
                    SET " . hash_to_sql($update_app_host) . " 
                    WHERE id = '$app_host_id';";
        $flag = $GLOBALS["db"]->query($update_sql);
        // 如果删除云主机对应的应用也删除
        if($update_app_host->hidden==1)
        {
            $update_sql1 = "
                    UPDATE " . $GLOBALS["ecs"]->table("application") . " 
                    SET hidden=1 
                    WHERE host_id = '$app_host_id';";
            $flag = $GLOBALS["db"]->query($update_sql1);
        }
        return $flag;
    }
    /**
     *获取云主机信息
     *create  at 2016-04-05
     * @author yukang
     * @param (必填)int $app_host_id 云主机id
     * @return 返回值：array()
     **/
    public static function _get_app_host_detail($app_host_id)
    {
        $where = "a.hidden = 0 AND a.id = $app_host_id";

        if(!empty($status))
        {
            $where .= " AND a.status=$status";
        }

        $sql = "
                SELECT a.*
                FROM {$GLOBALS[ecs]->table('app_host')} AS a
                WHERE $where ";

        $result = $GLOBALS['db']->getRow($sql);

        return $result;
    }
    /**
     *获取云主机
     *create  at 2016-04-01
     * @author yukang
     * @param (选填) string $status 应用状态1正在创建，2创建失败，3正在运行，4已关闭
     * @param (必填)string $page_size 每页多大
     * @param (必填)string $page 页数
     * @param (必填)string $user_id 用户id
     * @param (选填)　string $search 查询条件
     * @return 返回值：array()
     **/
    public static function _get_host_list($user_id,$page=1,$page_size=10,$search='',$status)
    {
        $where = "h.hidden = 0";
        if($user_id!=0)
        {
            $where .= " AND h.user_id=$user_id";
        }

        if (!empty($search)) {
            $where .= " AND h.name like '%$search%'";
        }

        if (!empty($status)) {
            $where .= " AND h.status=$status";
        }
        // //构造过滤语句
        // $where = "a.status = $status AND a.category = $category AND a.user_id=$user_id";

        $start_mun = ($page - 1) * $page_size;
        $sql = "
                SELECT h.*, u.user_name
                FROM {$GLOBALS[ecs]->table('app_host')} AS h
                left join {$GLOBALS[ecs]->table('users')} AS u on h.user_id=u.user_id
                WHERE $where
                ORDER BY h.id desc
                ";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);

        $sql .= " LIMIT $start_mun, $page_size";
        $res = $GLOBALS['db']->getAll($sql);

        $result['list']  = $res;
        $result['count'] = $count;
        return $result;
    }
    public static function get_images_flavor(){
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."ecs/imagesflavor";
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url);

            $result = json_decode($message_result,true);

            return $result;
    }

    public static  function get_host_list($user_id,$page=1,$page_size=10,$search='',$status=''){
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."ecs/cloudhost";

            $api_url_s = $api_url."?user_id=".$user_id."&page=".$page."&page_size=".$page_size."&search=".$search."&status=".$status;
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

            $result = json_decode($message_result,true);

            return $result;
    }
    /**
     *根据用户uc_id获取对应的云主机列表
     **/
    public static function _get_host_list_by_uc_id($uc_id,$user_name,$status,$search='',$page=1,$page_size=10)
    {
        $where = "h.hidden = 0";
        if(!is_null($uc_id) && !empty($uc_id) && (int)$uc_id > 0)
        {
            //加载zd_db_users_class类库
            zd_core::autoload('zd_db_users_class');
            $user_info = zd_db_users_class::_get_user_info_by_uid($uc_id);

            $user_id = $user_info['user_id'];
            $where .= " AND h.user_id=$user_id";
        }
        if(!is_null($user_name) && !empty($user_name))
        {
            $where .= " AND u.user_name='$user_name'";
        }
        if (!is_null($search) && !empty($search)) {
            $where .= " AND h.name like '%$search%'";
        }
        if (!is_null($status) && !empty($status)) {
            $where .= " AND h.status=$status";
        }

        $sql = "SELECT h.*, u.user_name ".
                "FROM ".$GLOBALS['ecs']->table('app_host') ." AS h ".
                "left join ".$GLOBALS['ecs']->table('users')." AS u ON h.user_id=u.user_id ".
                "WHERE " . $where ." ".
                "ORDER BY h.id DESC";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);

        //分页处理
        if(!is_null($page) && !is_null($page_size) && !empty($page) && !empty($page_size)) {
            $start_mun = ($page - 1) * $page_size;
            $sql .= " LIMIT $start_mun, $page_size";
        }

        $res = $GLOBALS['db']->getAll($sql);

        $result['list']  = $res;
        $result['count'] = $count;
        return $result;

    }
    /**
     *通过云主机id获获取应用列表
     *create  at 2016-05-10
     * @author yukang
     * @param (选填) int host_id
     * @return 返回值：array()
     **/
    public static function _get_app_list_to_host_id($host_id)
    {
        $where = "a.hidden = 0 AND a.host_id = $host_id";
        $sql = "
                SELECT a.*
                FROM {$GLOBALS[ecs]->table('application')} AS a
                WHERE $where
                ORDER BY a.id desc";
        $res = $GLOBALS['db']->getAll($sql);
        return $res;

    }

    /**
     * 获取应用的统计数字
     * @access
     * @method get||post
     * @param
     * @return
     * @created by  sdd  2016-04-25
     * @modify
     */
    public static  function _get_app_count(){
        $app_on_sql = 'select count(*) from ' . $GLOBALS['ecs']->table('application') . ' where is_on_sale=1 and hidden=0';
        $app_on_count = $GLOBALS['db']->getOne($app_on_sql);

        $app_off_sql = 'select count(*) from ' . $GLOBALS['ecs']->table('application') . ' where is_on_sale=0 and hidden=0';
        $app_off_count = $GLOBALS['db']->getOne($app_off_sql);

        $host_on_sql = 'select count(*) from ' . $GLOBALS['ecs']->table('app_host') . ' where hidden=0';
        $host_on_count = $GLOBALS['db']->getOne($host_on_sql);


        $count_list=array(
            'app_on'   => intval($app_on_count),
            'app_off'  => intval($app_off_count),
            'app_count'=> intval($app_off_count) + intval($app_on_count),
            'host_count'=> intval($host_on_count)
        );

        return $count_list;
    }
    /**
     * 判断该用户是否可以创建云主机
     * @param  $user_id 用户id
     * @return true/false
     * @created by  ygq  2016-04-26
     */
    public static  function _is_user_can_create_host($user_id){
        $sql="select host_num,host_have from ".$GLOBALS['ecs']->table('users')." where user_id=".$user_id;
        $res=$GLOBALS['db']->getRow($sql);
        return intval($res['host_have'])>0;
    }

    /**
     * 修改用户的云主机剩余数量
     * @param  $user_id 用户id
     * @param  $is_create  true:创建主机   false:删除主机
     * @return true/false
     * @created by  ygq  2016-04-26
     */
    public static  function _change_host_num_by_user($user_id,$is_create=true){
        if($is_create){
            $sql="update ".$GLOBALS['ecs']->table('users')." set host_have=host_have-1 where user_id=".$user_id;
        }else{
            $sql="update ".$GLOBALS['ecs']->table('users')." set host_have=host_have+1 where user_id=".$user_id;
        }
        return $GLOBALS['db']->query($sql);
    }

    /**
     * 根据订单id获取应用信息
     * @param  $sn 订单id
     * @param $user_id 用户id
     * @return array
     * @access public
     * @author huangbin
     */
    public static function _get_app_info_by_sn($sn,$user_id){
        //获取信息
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/appinfo";

        $api_url_s = $api_url."?order_sn=".$sn."&user_id=".$user_id;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        if ($result["success"]) {
            $app_info = $result["result"];
        }
        //返回结果
        return $app_info;
    }

    public static function get_app_garden_list($category,$status,$user_id,$is_on_sale,$page=1,$page_size=10,$search='',$is_show_index='',$app_type='')
    {
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/gardenlist";

        $api_url_s = $api_url."?category=".$category."&status=".$status."&user_id=".$user_id."&is_on_sale=".$is_on_sale."&page=".$page."&page_size=".$page_size."&search=".$search."&is_show_index=".$is_show_index."&app_type=".$app_type;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result;
    }
    /**
     *应用园地后列表逻辑
     *create  at 2016-05-6
     * @author yukang
     * @param (必填)int $category  分类category的id
     * @param (选填) string $status 应用状态，1包括未部署，2正在部署，3已发布，4发布失败
     * @param (必填)string $page_size 每页多大
     * @param (必填)string $page 页数
     * @param (必填)string $user_id 用户id
     * @param (选填)　string $search 查询条件
     * @return 返回值：array()
     **/
    public static function _get_app_garden_list($category,$status,$user_id,$is_on_sale,$page=1,$page_size=10,$search='',$is_show_index='',$app_type='')
    {
        $where = "a.hidden = 0 AND ((a.app_type=1 or a.app_type=4 or o.parent_id<>0) or ((a.app_type=2 or a.app_type=3) and o.parent_id = 0))";

        //if($user_id > 0)
        //{
        //   $where .= " AND (a.is_public = 1 OR a.user_id=$user_id OR (p.user_id = $user_id AND p.hidden=0 AND p.app_id=a.id))";
        //}
        //else
        //{
        //    $where .= " AND a.is_public = 1";
        //}

        if(!empty($status))
        {
            $where.=" AND a.status = $status";
        }

        if(!empty($category))
        {
            $where.=" AND a.category = $category";
        }
        
        if(!empty($is_on_sale))
        {
            $where.=" AND a.is_on_sale = $is_on_sale";
        }

        if (!empty($search)) {
            $where .= " AND a.app_name like '%$search%'";
        }

        if(!empty($is_show_index))
        {
            $where .= " AND a.is_show_index = 1";
        }

        if(!empty($app_type))
        {
            $where .= " AND a.app_type in (" . $app_type . ")";
        }
        // //构造过滤语句
        // $where = "a.status = $status AND a.category = $category AND a.user_id=$user_id";

        // $sql = "
        //         SELECT a.*, u.user_name, c.name as cate_name, h.name as host_name, a1.collection_sum, o.goods_name
        //         FROM {$GLOBALS[ecs]->table('application')} AS a
        //         left join {$GLOBALS[ecs]->table('users')} AS u on a.user_id=u.user_id
        //         left join {$GLOBALS[ecs]->table('app_category')} AS c on a.category=c.id
        //         left join {$GLOBALS[ecs]->table('app_host')} AS h on a.host_id=h.id
        //         left join {$GLOBALS[ecs]->table('order_goods')} AS o on o.order_id=a.order_sn
        //         left join {$GLOBALS[ecs]->table('app_power')} AS p on p.app_id=a.id
        //         left join (select COUNT(DISTINCT col.id) AS collection_sum, col.obj_id, col.obj_type
        //                 from {$GLOBALS[ecs]->table('collection')} AS col where col.obj_type='app' group by col.obj_id) AS a1
        //                 ON a1.obj_id = a.id
        //         WHERE $where
        //         group by a.id
        //         ORDER BY a.id desc";
       $sql = "
                SELECT a.*, u.user_name, c.name as cate_name, h.name as host_name, a1.collection_sum, o.goods_name,
                                    IF( cl.id, COUNT( a.id ) , 0 ) as collection_count, SUM(IF( cl.user_id =".$user_id." ,cl.id,0)) as is_collection 
                FROM {$GLOBALS[ecs]->table('application')} AS a
                left join {$GLOBALS[ecs]->table('users')} AS u on a.user_id=u.user_id
                left join {$GLOBALS[ecs]->table('app_category')} AS c on a.category=c.id
                LEFT JOIN {$GLOBALS[ecs]->table('collection')} AS cl  on a.id = cl.obj_id
                left join {$GLOBALS[ecs]->table('app_host')} AS h on a.host_id=h.id
                left join {$GLOBALS[ecs]->table('order_goods')} AS o on o.order_id=a.order_sn
                left join {$GLOBALS[ecs]->table('app_power')} AS p on p.app_id=a.id
                left join (select COUNT(DISTINCT col.id) AS collection_sum, col.obj_id, col.obj_type
                        from {$GLOBALS[ecs]->table('collection')} AS col where col.obj_type='app' group by col.obj_id) AS a1
                        ON a1.obj_id = a.id
                WHERE $where
                group by a.id
                ORDER BY a.show_order asc,a.id desc";
                
        //$res = $GLOBALS['db']->getAll($sql1);
        //获取数据总数
        //$count = $GLOBALS['db']->num_rows($res);
        // $count = $res[0]['count'];

        //问题原因：不能适应不分页，获取全部数据的情况
        //修改说明：检测到$page和$page_size不为空时，分页查询
        //修改时间：2016.12.15
        //修改人员：yKAN
        if(!is_null($page) && !empty($page) && !is_null($page_size) && !empty($page_size)) {
            $start_mun = ($page - 1) * $page_size;
            $sql .= " LIMIT $start_mun, $page_size";
        }
        
        $res = $GLOBALS['db']->getAll($sql);

        $result['list']  = $res;
        // $result['count'] = $count;
        return $result;

    }

//获取应用园地应用总数
    public static function _get_app_garden_list_num($category,$status,$user_id,$is_on_sale,$page=1,$page_size=10,$search='',$app_type='')
    {
        $where = "a.hidden = 0 AND ((a.app_type=1 or a.app_type=4 or o.parent_id<>0) or ((a.app_type=2 or a.app_type=3) and o.parent_id = 0))";

        if($user_id>0)
        {
            $where .= " AND (a.is_public = 1 OR a.user_id=$user_id OR (p.user_id = $user_id AND p.hidden=0 AND p.app_id=a.id))";
        }else
        {
            $where .= " AND a.is_public = 1";
        }

        if(!empty($status))
        {
            $where.=" AND a.status = $status";
        }

        if(!empty($category))
        {
            $where.=" AND a.category = $category";
        }
        
        if(!empty($is_on_sale))
        {
            $where.=" AND a.is_on_sale = $is_on_sale";
        }

        if (!empty($search)) {
            $where .= " AND a.app_name like '%$search%'";
        }

        if(!empty($app_type))
        {
            $where .= " AND a.app_type in (" . $app_type . ")";
        }

        $start_mun = ($page - 1) * $page_size;
 
        $sql1="
                       SELECT  count(DISTINCT a.id) as count  
                FROM {$GLOBALS[ecs]->table('application')} AS a
                left join {$GLOBALS[ecs]->table('users')} AS u on a.user_id=u.user_id
                left join {$GLOBALS[ecs]->table('app_category')} AS c on a.category=c.id
                LEFT JOIN {$GLOBALS[ecs]->table('collection')} AS cl  on a.id = cl.obj_id
                left join {$GLOBALS[ecs]->table('app_host')} AS h on a.host_id=h.id
                left join {$GLOBALS[ecs]->table('order_goods')} AS o on o.order_id=a.order_sn
                left join {$GLOBALS[ecs]->table('app_power')} AS p on p.app_id=a.id
                left join (select COUNT(DISTINCT col.id) AS collection_sum, col.obj_id, col.obj_type
                        from {$GLOBALS[ecs]->table('collection')} AS col where col.obj_type='app' group by col.obj_id) AS a1
                        ON a1.obj_id = a.id
                WHERE $where";         
        $res1 = $GLOBALS['db']->getAll($sql1);
        //获取数据总数
        //$count1 = $GLOBALS['db']->num_rows($res);
        $count = $res1[0]['count'];
  
        $result['count'] = $count;
        return $result;

    }


    /**
     * 获取首页推荐的应用
     * @access public
     * @author huangbin
     * @return array
    */
    public static function _get_recommend_app_list(){
        //sql语句
        $sql = "select * from ecs_application 
                where is_show_index=1 and hidden=0 and is_public=1 and is_on_sale=1 
                order by show_order asc";
        //执行sql
        $app_list=$GLOBALS['db']->getAll($sql);
        //返回数据
        return $app_list;
    }


    /**
     * add by zc 20160923
     * 判断订单在某主机上是否已安装
     * @param $order_id
     * @param $host_id
     * @author zc
     */
    public function _get_is_install_by_host_id($order_id,$host_id){
        $sql = "select id from ecs_application
                where order_sn = $order_id and app_url = '$host_id'";
        //执行sql
        $app = $GLOBALS['db']->getOne($sql);

        return $app;
    }
}
?>