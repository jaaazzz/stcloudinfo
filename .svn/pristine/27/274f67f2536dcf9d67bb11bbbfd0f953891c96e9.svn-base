<?php
/**
 * GIS相关的被外部调用的API
 * TODO:添加身份验证
 */

define('IN_ECS', true);

require_once(dirname(__FILE__) . '/includes/init.php');
require_once(dirname(__FILE__) . '/includes/cls_xml.php');
require_once(ROOT_PATH . 'languages/' . $_CFG['lang'] . '/user.php');
require_once(dirname(__FILE__) . '/includes/gis_api.php');
require_once(dirname(__FILE__) . '/interface_out/driver/api_out_driver.php');
include(dirname(__FILE__) . '/data/config.php');

$action = isset($_REQUEST['act']) ? trim($_REQUEST['act']) : 'default';

/* 获取某个包或独立工具的最新版本信息 */
/* 获取某个包或独立工具的最新版本信息 */
if ($action == 'get_version_info')
{   
    $weight_id = $_REQUEST['weight_id'];
    $serial_no = $_REQUEST['serial_no'];
    $is_formal = false;
    GisApi::get_version_info($weight_id,$serial_no,$is_formal);
}
elseif ($action == 'download_addon')
{
    $weight_id = strtolower(trim($_REQUEST['weight_id']));

    $weight_id = $_REQUEST['weight_id'];
    $is_formal = false;
    GisApi::download_addon($weight_id,$is_formal);
}
elseif ($action == 'op_igserver')
{
    $aid  = $_REQUEST['aid'];
    $pids = $_REQUEST['pids'];
    $iid  = $_REQUEST['iid'];
    GisApi::op_igserver($aid,$pids,$iid);
}
elseif ($action == 'update_setup')
{
    $runtime   = $_REQUEST['runtime'];
    GisApi::update_setup($runtime);
}
elseif ($_REQUEST['act'] == 'get_user_order') {
    $user_id = $_SESSION['user_id'];
    GisApi::get_user_order($user_id);
}
elseif ($_REQUEST['act'] == 'package') {
    //订单的授权号
    $order_sn  = mysql_real_escape_string($_REQUEST['sn']);
    //调用生成package.xml接口
    $outApi->get_package_xml_by_sn($order_sn);
}
elseif ($_REQUEST['act'] == 'openstack_callback') {
    //openstack安装软件回调
    $app_id  = $_REQUEST['app_id'];
    $action  = $_REQUEST['action'];
    //针对应用平台的需求
    //add by zc 2016-09-21
    @$host_id = $_REQUEST['host_id'];
    //调用生成package.xml接口
    GisApi::openstack_callback($app_id,$action,$host_id);
}
elseif ($_REQUEST['act'] == 'cloud_detail') {
    //接口目的：根据server_id获取云主机详情信息

    //云主机ServerId
    $server_id = $_REQUEST['server_id'];
    echo $outApi->GetCloudHostDetail($server_id);
    exit;
}
elseif ($_REQUEST['act'] == 'user_cloud_list') {
    //接口目的：根据uc_id/user_name获取云主机详情信息

    //云主机UcId
    $uc_id = $_REQUEST['uc_id'];
    //云主机UcId
    $user_name = $_REQUEST['user_name'];
    //云主机状态
    $status = $_REQUEST['status'];
    //查询条件
    $search = $_REQUEST['search'];
    //页码
    $page = $_REQUEST['page'];
    //每页显示条数
    $page_size = $_REQUEST['page_size'];

    echo $outApi->GetUserCloudHost($uc_id,$user_name,$status,$search,$page,$page_size);
    exit;
}
elseif ($_REQUEST['act'] == 'cloud_url') {
    //接口目的：根据server_id获取云主机远程链接地址

    //云主机ServerId
    $server_id = $_REQUEST['server_id'];

    echo $outApi->GetCloudHostSSHUrl($server_id);
    exit;
}
elseif ($_REQUEST['act'] == 'cloud_operation') {
    //接口目的：操作云主机

    //云主机ServerId
    $id = $_REQUEST['id'];
    //云主机UcId
    $uc_id = $_REQUEST['uc_id'];
    //操作项
    $operation = $_REQUEST['operation'];

    echo $outApi->SetCloudHostOperation($id,$uc_id,$operation);
    exit;
}
elseif($_REQUEST['act'] == 'get_goods_list') {
    //接口目的：获取软件列表

    //当前页码
    $page = $_REQUEST['page'];
    //每页显示记录条数
    $page_size = $_REQUEST['page_size'];
    //页码总数
    $page_count = $_REQUEST['page_count'];
    //记录总数
    $count = $_REQUEST['count'];
    //查询条件
    $sql_where = Array(
        'cat_type'  => $_REQUEST['cat_type'],   //行业类别：0-全部/2-桌面/3-web
        'is_on_sale'=> $_REQUEST['is_on_sale'], //是否上架：-1全部；0-未上架；1-已上架
        'goods_name'  => $_REQUEST['goods_name']//软件名称
    );

    echo $outApi->GetGoodsList($page,$page_size,$page_count,$count,$sql_where);
    exit;
}
elseif($_REQUEST['act'] == 'set_goods_operations')
{
    //接口目的：设置软件操作项

    //操作项：on_sale-上架；no_sale-下架
    $operation = $_REQUEST['operation'];
    //软件ID
    $goods_id  = $_REQUEST['goods_id'];


    echo $outApi->SetGoodsOperations($operation,$goods_id);
}
elseif($_REQUEST['act'] == 'get_app_list'){
    //接口目的：获取应用列表

    //当前页码
    $page = $_REQUEST['page'];
    //每页显示记录条数
    $page_size = $_REQUEST['page_size'];
    //页码总数
    $page_count = $_REQUEST['page_count'];
    //记录总数
    $count = $_REQUEST['count'];
    //查询条件
    $sql_where = Array(
        'category'   => $_REQUEST['category'],  //应用类别
        'status'     => $_REQUEST['status'],    //应用状态：1-包括未部署，2-正在部署，3-已发布，4-发布失败
        'is_on_sale' => $_REQUEST['sale'],      //是否上架：0-未上架；1-已上架
        'app_name'   => $_REQUEST['app_name'],  //应用名称
        'app_type'   => $_REQUEST['app_type']   //应用类型
    );
    //用户UC_ID
    $uc_id = $_REQUEST['uc_id'];

    echo $outApi->GetMyApplicationList($page,$page_size,$page_count,$count,$sql_where,$uc_id);
    exit;
}
elseif($_REQUEST['act'] == 'get_app_host')
{
    //接口目的：获取指定应用的远程应用地址

    //用户UC_ID
    $uc_id = $_REQUEST['uc_id'];
    //应用类型
    $app_type = $_REQUEST['app_type'];//应用类型：1-内部应用；2-外部应用；4-openstack应用
    //应用HOST_ID
    $host_id = $_REQUEST['host_id'];
    //应用对应云主机SERVER_ID
    $app_url = $_REQUEST['app_url'];
    //应用状态
    $status = $_REQUEST['status'];

    echo $outApi->GetMyApplicationHost($uc_id,$app_type,$host_id,$app_url,$status);
    exit;
}
elseif($_REQUEST['act'] == 'set_app_operations')
{
    //接口目的：应用操作项

    //用户UC_ID
    $uc_id = $_REQUEST['uc_id'];
    //应用类型
    $app_type = $_REQUEST['app_type'];
    //操作项
    $operation = $_REQUEST['operation'];
    //应用ID
    $id = $_REQUEST['id'];

    echo $outApi->SetMyApplicationOperations($uc_id,$app_type,$operation,$id);
    exit;
}
elseif($_REQUEST['act'] == 'get_category_list'){
    //接口目的：查询行业分类列表

    echo $outApi->GetCategoryList();
    exit;
}
elseif($_REQUEST['act'] == 'set_category_operations')
{
    //接口目的：行业应用操作。此接口只允许管理员调用

    //最新分类列表信息：ID/NAME/ORDER/STATUS
    $categories = file_get_contents("php://input");

    echo $outApi->SetCategoryOperation($categories);
    exit;
}
elseif($_REQUEST['act'] == 'get_home_show'){
    //接口目的：查询门户“应用模块和软件模块”的列表显示。此接口只允许管理员调用

    //用户UC_ID
    $uc_id = $_REQUEST['uc_id'];
    //当前模块项
    $option = $_REQUEST['option'];

    echo $outApi->GetHomeAppSfwShow($uc_id,$option);
    exit;
}
elseif($_REQUEST['act'] == 'set_home_show')
{
    //接口目的：设置门户“应用模块和软件模块”的列表显示。此接口只允许管理员调用

    //当前模块项
    $option = $_REQUEST['option'];
    //最新显示列表信息：ID/ORDER
    $app_sfw = file_get_contents("php://input");

    echo $outApi->SetHomeAppSfwShow($option,$app_sfw);
    exit;
}
elseif($_REQUEST['act'] == 'create_cloud_host')
{
    //接口目的：创建云主机

    $input = file_get_contents('php://input');
    $input = is_string($input) ? json_decode($input) : $input;
    //处理器 cpu
    $cpu_core_num = $input->cpu_core_num;
    //内存 memory
    $memory_size = $input->memory_size;
    //硬盘 hdd
    $hdd_volume  = $input->hdd_volume;
    //主机名称
    $name = $input->name;
    //镜像 image
    $image_id  = $input->image_id;
    //规格 flavor
    $flavor_id = $input->flavor_id;
    //用户 uc_id
    $uc_id= $input->uc_id;

    echo $outApi->CreateCloudHost($uc_id,$name,$image_id,$flavor_id,$cpu_core_num,$memory_size,$hdd_volume);
    exit;
}
elseif($_REQUEST['act'] == 'import_goods')
{
    //接口目的：上传软件产品。仅限zip包

    //form表单，file元素对应的name值
    $file_name = $_REQUEST['file_name'];
    $content = $outApi->ImportGoodsToDataSource($file_name);

    header("Content-type: text/html; charset=utf-8");
    header( 'P3P:CP PSA OUR"' );
    header( 'XDomainRequestAllowed:1' );
    header( "Access-Control:allow <*>" );

    $result = '<script type="text/javascript" src="'.$GLOBALS['file_server_base_url'].'public/scripts/json2.js"></script>'.
            '<script type="text/javascript">'.
                'window.parent.postMessage(JSON.stringify('.json_encode($content).'),"*");'.
            '</script>';

    echo $result;
    exit;
}
//获取需要审核的订单
elseif ($_REQUEST['act'] == 'get_verify_order') {
    //当前页码
    $page = isset($_REQUEST['p']) ? intval($_REQUEST['p']) : 1;
    //每页数据个数
    $size = isset($_REQUEST['s']) ? intval($_REQUEST['s']) : 5;
    echo $outApi->GetVerifyOrder($page,$size);
    exit;
}
//审核订单
elseif ($_REQUEST['act'] == 'verify_order') {
    //订单编码
    $order_sn = isset($_REQUEST['o_sn']) ? trim($_REQUEST['o_sn']) : 0;
    //审核状态(1.通过2.不通过)
    $order_status = isset($_REQUEST['o_status']) ? intval($_REQUEST['o_status']) : 0;
    //审核消息
    $order_msg = isset($_REQUEST['o_msg']) ? $_REQUEST['o_msg'] : "";
    echo $outApi->VerifyOrder($order_sn,$order_status,$order_msg);
    exit;
}
/* 部署相关接口 begin */
//生成新的部署产品订单
elseif ($_REQUEST['act'] == 'created_order') {
    //产品id
    $goods_id = isset($_REQUEST['g_id']) ? intval($_REQUEST['g_id']) : 0;
    echo $outApi->CreatedOrder($goods_id);
    exit;
}
//部署应用
elseif ($_REQUEST['act'] == 'deploy_app') {
    $outApi->DeployApp();
}
//根据order_id获取订单信息
elseif ($_REQUEST['act'] == 'get_order_app_type') {
    //订单id
    $order_id = isset($_REQUEST['o_id']) ? trim(($_REQUEST['o_id'])) : 0;
    echo $outApi->GetOrderAppType($order_id);
    exit;
}
//审核云主机
elseif ($_REQUEST['act'] == 'verify_host') {
    //云主机id
    $host_id = isset($_REQUEST['h_id']) ? trim(($_REQUEST['h_id'])) : 0;
    //审核status(1:审核通过2:审核不通过)
    $status = isset($_REQUEST['h_status']) ? trim(($_REQUEST['h_status'])) : 0;
    //审核消息
    $h_msg = isset($_REQUEST['h_msg']) ? $_REQUEST['h_msg'] : "";
    echo $outApi->VerifyHost($host_id,$status,$h_msg);
    exit;    
}
elseif($action == 'update_insert_user')
{
    //接口目的：同步非门户登录用户

    $post_body = file_get_contents("php://input");
    $post_body = is_string($post_body) ? json_decode($post_body) : $post_body;
    //用户名称
    $user_name = $post_body->user_name;
    //用户密码
    $user_pass = $post_body->pass_word;
    //用户EMAIL
    $user_email= $post_body->email;
    //用户UC_ID
    $uc_id     = $post_body->uc_id;

    echo $outApi->UpdateInsertUser($user_name,$user_pass,$user_email,$uc_id);
    exit;
}
/* end */
else
{
    return_xml_result(false, '未知的操作类型');
}


/**
 * 格式不确定是json还是xml
 */
function return_xml_result($success, $result)
{
    $result = array('success' => $success ? 'true' : 'false', 'result' => $result);

    die(ArrayToXML::toXml($result));
}
