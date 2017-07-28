<?php
/**
 * GISSTORE 对外提供的接口方法命名
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
interface OutApi{
    /**
     * 根据订单号生成package.xml
     * @param int $serial_no 订单的授权id
     * @return array
    */
    public function get_package_xml_by_sn($serial_no);

    /**
     * 查询用户下的云主机列表
     * @param int $uc_id        用户uc_id
     * @param string $user_name 用户uc_name
     * @param int $status       云主机状态：1正在创建，2创建失败，3正在运行，4已关闭
     * @param string $search    云主机名称
     * @param int $page         当前页码
     * @param int $page_size    每页显示记录条数
     * @return mixed
     */
    public function GetUserCloudHost($uc_id,$user_name,$status,$search='',$page=1,$page_size=10);

    /**
     * 获取云主机详情信息
     * @param string $server_id 云主机服务ID
     * @return mixed
     */
    public function GetCloudHostDetail($server_id);

    /**
     * 获取云主机远程链接地址
     * @param string $server_id 云主机服务ID
     * @return mixed
     */
    public function GetCloudHostSSHUrl($server_id);

    /**
     *操作云主机：重启/启动/停止/删除
     * @param string $id ID
     * @param string $operation 操作项
     * @return mixed
     */
    public function SetCloudHostOperation($id,$uc_id,$operation);

    /**
     * 查询软件产品列表
     * @param int $page         当前页码
     * @param int $page_size    每页显示记录条数
     * @param int $page_count   页码总数
     * @param int $count        记录总数
     * @param Array $sql_where  查询条件
     * @return mixed
     */
    public function GetGoodsList($page,$page_size,$page_count,$count,$sql_where);

    /**
     * 查询我的应用列表
     * @param int $page         当前页码
     * @param int $page_size    每页显示记录条数
     * @param int $page_count   页码总数
     * @param int $count        记录总数
     * @param Array $sql_where  查询条件
     * @param string $uc_id     用户UC_ID
     * @return mixed
     */
    public function GetMyApplicationList($page,$page_size,$page_count,$count,$sql_where,$uc_id);

    /**
     * 查询指定应用的HOST_URL
     * @param string $uc_id     用户UC_ID
     * @param int $app_type     应用类型
     * @param string $host_id   应用HOST_ID
     * @param string $app_url   应用对应云主机SERVER_ID
     * @return mixed
     */
    public function GetMyApplicationHost($uc_id,$app_type,$host_id,$app_url,$status);

    /**
     * 应用操作项
     * @param int $uc_id        用户UC_ID
     * @param int $app_type     应用类型
     * @param string $operation 操作项
     * @param int $id           应用ID
     * @return mixed
     */
    public function SetMyApplicationOperations($uc_id,$app_type,$operation,$id);

    /**
     * 查询行业分类列表
     * @return mixed
     */
    public function GetCategoryList();

    /**
     * 行业应用操作。此接口只允许管理员调用
     * @param Array $categories POST体参数
     * @return mixed
     */
    public function SetCategoryOperation($categories);

    /**
     * 设置门户“应用模块和软件模块”的列表显示。此接口只允许管理员调用
     * @param string $option 当前模块
     * @param Array $app_sfw POST体参数
     * @return mixed
     */
    public function SetHomeAppSfwShow($option,$app_sfw);

    /**
     * 查询门户“应用模块和软件模块”的列表显示。此接口只允许管理员调用
     * @param $option
     * @return mixed
     */
    public function GetHomeAppSfwShow($uc_id,$option);

    /**
     * 获取审核订单
     * @param int $page 当前页码
     * @param int $size 每页数据个数
     * @return mixed
     */
    public function GetVerifyOrder($page,$size);

    /**
     * 审核订单
     * @param int $order_sn 订单编码
     * @param int $order_status 审核状态(1.通过2.不通过)
     * @param string $verify_msg 审核消息
     * @return mixed
     */
    public function VerifyOrder($order_sn,$order_status,$verify_msg);

    /** 设置软件操作项
     * @param string    $operation 操作项
     * @param int $goods_id 软件ID
     * @return mixed
     */
    public function SetGoodsOperations($operation,$goods_id);

    /**
     * 生成产品订单
     * @param string goods_id 产品id
     * @return mixed
     */
    public function CreatedOrder($goods_id); 

    /**
     * 部署应用
     * @return mixed
     */
    public function DeployApp();

    /**
     * 根据订单id获取订单信息
     * @param string $order_id 订单id
     * @return mixed
     */    
    public function GetOrderAppType($order_id);

    /**
     * 创建云主机
     * @param int $uc_id 用户UC_ID
     * @param string $name 主机名称
     * @param string $image_id 镜像
     * @param string $flavor_id 规格
     * @param string $cpu_core_num 处理器
     * @param string $memory_size 内存
     * @param string $hdd_volume 硬盘
     * @return mixed
     */
    public function CreateCloudHost($uc_id,$name,$image_id,$flavor_id,$cpu_core_num,$memory_size,$hdd_volume);

    /**
     * 上传软件产品。仅限zip包
     * @param string $file_name form表单，file元素对应的name值
     * @return mixed
     */
    public function ImportGoodsToDataSource($file_name);

    /**
     * 审核云主机
     * @param string $host_id 云主机id
     * @param string $status 审核状态(1:通过2:不通过)
     * @param string $verify_msg 审核消息
     * @return mixed
     */
    public function VerifyHost($host_id,$status,$verify_msg);

    /**
     * 同步用户信息
     * @param string $user_name  用户名称
     * @param string $user_pass  用户密码
     * @param string $user_email 用户Email
     * @param int    $uc_id      用户UC_ID
     * @return mixed
     */
    public function UpdateInsertUser($user_name,$user_pass,$user_email,$uc_id);
}

?>