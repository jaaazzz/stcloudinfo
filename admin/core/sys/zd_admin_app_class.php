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
class zd_admin_app_class{

	/* 构造函数 */
    public function __construct(){

    }
    /**
     *创建应用
     *create  at 2016-03-２９
     * @author yukang
     * @param (必填)string $app_name 应用名称
     * @param (必填)int $category  分类category的id
     * @param (选填)string $host_id 主机ip
     * @param (选填) string $app_description 应用描述
     * @param (选填) string $app_type  应用类型1.内部应用　2.外部应用
     * @param (选填) string $logo_image logo图片
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (选填) string $order_sn 订单编号
     * @param (选填) string $app_url 外部应用地址
     * @param string $file_list 附件
     * @return 返回值：true/flase
     **/
    public static function _create_app($app_name,$category,$host_id,$app_description,$app_type,$logo_image,$status,$order_sn,$app_url,$file_list)
    {
        $user_id       = $_SESSION['user_id'];
		$update_application = array(
				'app_name'        => $app_name,
				'category'        => $category,
				'host_id'         => $host_id,
				'app_description'=> $app_description,
				'app_type'        => $app_type,
				'logo_image'      => $logo_image,
				'order_sn'        => $order_sn,
				'file_list'       => $file_list,
				'created'      	  => gmtime(),
                'app_url'         => $app_url,
				'status'		  =>2,
                'user_id'         =>$user_id
				);
		insert_to_db( 'application',$update_application);
    }
    /**
     *获取应用
     *create  at 2016-03-30
     * @author yukang
     * @param (必填)int $category  分类category的id
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (必填)string $page_size 每页多大
     * @param (必填)string $page 页数
     * @param (必填)string $user_id 用户id
     * @param (选填)　string $search 查询条件
     * @return 返回值：array()
     **/
    public static function _get_app_list($category,$status,$user_id,$page=1,$page_size=10,$search='')
    {
        $where = "a.hidden = 0";
        if(!empty($user_id))
        {
            $where .= " AND a.user_id=$user_id";
        }
        if(!empty($status))
        {
            $where.=" AND a.status = $status";
        }

        if(!empty($category))
        {
            $where.=" AND a.category = $category";
        }

        if (!empty($search)) {
            $where .= " AND a.app_name like '%$search%'";
        }
        // //构造过滤语句
        // $where = "a.status = $status AND a.category = $category AND a.user_id=$user_id";

        $start_mun = ($page - 1) * $page_size;
        $sql = "
                SELECT a.*, u.user_name, c.name as cate_name, h.host_name
                FROM {$GLOBALS[ecs]->table('application')} AS a
                left join {$GLOBALS[ecs]->table('users')} AS u on a.user_id=u.user_id
                left join {$GLOBALS[ecs]->table('app_category')} AS c on a.category=c.id
                left join {$GLOBALS[ecs]->table('app_host')} AS h on a.host_id=h.id
                WHERE $where
                ORDER BY a.id desc
                LIMIT $start_mun, $page_size";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);

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
    public static function _get_app_detail($app_id,$status)
    {
        $where = "a.hidden = 0 AND a.id = $app_id";

        if(!empty($status))
        {
            $where .= " AND a.status=$status";
        }

        $sql = "
                SELECT a.*,u.user_name
                FROM {$GLOBALS[ecs]->table('application')} AS a
                LEFT JOIN {$GLOBALS[ecs]->table('users')} AS u ON u.user_id = a.user_id
                WHERE $where ";

        $result = $GLOBALS['db']->getRow($sql);

        return $result;
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
    public static function _create_app_host($cpu_core_num,$memory_size,$hdd_volume,$name,$operation_system,$host_ip,$host_password,$host_server_id)
    {
        // status 云主机状态，1正在创建，2创建失败，3正在运行，4已关闭
        $user_id       = $_SESSION['user_id'];
        $update_app_host = array(
                'user_id'          => $user_id,
                'cpu_core_num'     => $cpu_core_num,
                'status'           => 1,
                'memory_size'      => $memory_size,
                'hdd_volume'       => $hdd_volume,
                'operation_system' => $operation_system,
                'host_ip'          => $host_ip,
                'host_password'    => $host_password,
                'name'             => $name,
                'created'          => gmtime(),
                'host_server_id'   => $host_server_id
                );
        $app_host_id = insert_to_db( 'app_host',$update_app_host);
        return $app_host_id;
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
        $GLOBALS["db"]->query($update_sql);
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
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (必填)string $page_size 每页多大
     * @param (必填)string $page 页数
     * @param (必填)string $user_id 用户id
     * @param (选填)　string $search 查询条件
     * @return 返回值：array()
     **/
    public static function _get_host_list($user_id,$page=1,$page_size=10,$search='')
    {
        $where = "h.hidden = 0";
        if($user_id!=0)
        {
            $where .= " AND h.user_id=$user_id";
        }

        if (!empty($search)) {
            $where .= " AND h.host_name like '%$search%'";
        }
        // //构造过滤语句
        // $where = "a.status = $status AND a.category = $category AND a.user_id=$user_id";

        $start_mun = ($page - 1) * $page_size;
        $sql = "
                SELECT h.*, u.user_name
                FROM {$GLOBALS[ecs]->table('app_host')} AS h left JOIN
                {$GLOBALS[ecs]->table('users')} AS u on h.user_id=u.user_id
                WHERE $where
                ORDER BY h.id desc
                LIMIT $start_mun, $page_size";
        $res = $GLOBALS['db']->query($sql);
        //获取数据总数
        $count = $GLOBALS['db']->num_rows($res);

        $res = $GLOBALS['db']->getAll($sql);

        $result['list']  = $res;
        $result['count'] = $count;
        return $result;

    }
}
?>