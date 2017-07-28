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
$act = $_REQUEST['act'];
require_once(ROOT_PATH .  'includes/init.php');
require_once(ROOT_PATH . 'includes/cls_json.php');

$app_obj = zd_core::instance('zd_db_app_class');
// 引入openstack类库
$openstack_obj = zd_core::instance('zd_openstack_class');
// 引入openstack类库
$app_obj = zd_core::instance('zd_app_class');
			
$users_obj = zd_core::instance('zd_db_users_class');

$app_power_obj = zd_core::instance('zd_db_app_power_class');
//实例化自动部署逻辑类
$deploy_obj = zd_core::instance('zd_deploy_class');

$json = new JSON;

//针对自动部署的默认用户（即仅针对act = 'auto_deploy'）
$auto_user_id = 1;
/*
 *匹配最接近的尺寸
 */
function match_size($size,$arr){
    if(empty($size)){
        return '';
    }
    if(in_array($size,$arr)){
        return $size.'_';
    }
    $size=intval($size);
    foreach($arr as $key=>$value){
        $value=intval($value);
        $abs[]=abs($size-$value);
    }
    $t=$abs[0];
    $k=0;
    for($i=0;$i<count($abs);$i++){
        if($t>$abs[$i]){
            $t=$abs[$i];
            $k=$i;
        }
    }
    return $arr[$k].'_';
}

//自动部署插件列表
if($act == 'auto_deploy'){
    $addon_list_str = $_REQUEST['addon_list']; //选择的插件ID串,以“，”分割
    $host_id = $_REQUEST['host_id']; //虚拟主机ID
    $user_name = $_REQUEST['user_name']; //用户名

    //$addon_list_str = '382,386,385,399'; //选择的插件ID串,以“，”分割
    //$host_id = 'b3b85c01-d460-40dd-b2a6-25d08cddb089'; //虚拟主机ID
    //$user_name = 'zcuser';
    $period = 1; //购买期限，默认１个月

    /*******************************验证参数的有效性(start)****************************************/
    //传入的插件列表为空
    if(empty($addon_list_str))
    {
        echo json_encode(array("success" => false, "msg" => "请传入要聚合的插件id"));
        exit;
    }
    //云主机为空
    if(empty($host_id))
    {
        echo json_encode(array("success" => false, "msg" => "请传入要部署的云主机id"));
        exit;
    }
    //用户名为空
    if(empty($user_name))
    {
        echo json_encode(array("success" => false, "msg" => "请传入操作的用户名"));
        exit;
    }
    //获取用户信息
    $user_info = zd_db_users_class::_get_user_info_by_username($user_name);
    if(empty($user_info))
    {
        echo json_encode(array("success" => false, "msg" => "未找到相应的用户,请确认用户信息"));
        exit;
    }
    //传入的插件id不合法，不属于同一框架下，不可以聚合
    if(!$deploy_obj->judge_goods_is_valid($addon_list_str))
    {
        echo json_encode(array("success" => false, "msg" => "传入的插件不能进行聚合"));
        exit;
    }
    /*******************************验证参数的有效性(end)****************************************/


    //开启事务
    $GLOBALS['db']->query('START TRANSACTION');
    //创建订单
    $order_data = $deploy_obj->create_deploy_order($addon_list_str,$period,$user_info['user_id']);
    //创建订单执行成功
    if ($order_data->order_id)
    {
        //提交事务
        $GLOBALS['db']->query('COMMIT');
        //执行自动部署任务
        $return_data = $deploy_obj->start_deploy_task($user_info,$order_data->order_id,$host_id);
        //提交任务成功
        if($return_data->status == 1)
        {
            echo json_encode(array("success" => true, "msg" => $return_data->msg, "app_id" => $return_data->app_id));
            exit;
        }else
        {
            echo json_encode(array("success" => false, "msg" => $return_data->msg));
            exit;
        }
    }
    else
    {
        //获取错误信息
        $error_msg = $order_data->msg;
        //事务回滚
        $GLOBALS['db']->query('ROLLBACK');
        echo json_encode(array("success" => false, "msg" => $error_msg));
        exit;
    }
}
//获取app的状态
else if($act == 'get_app_status'){
    $app_id = $_REQUEST['app_id']; //app_id
    if(empty($app_id))
    {
        echo json_encode(array("success" => false, "msg" => "请传入合法的参数"));
        exit;
    }
    //1包括未提交，2正在部署，3已发布，4发布失败
    $status = zd_db_app_class::_get_app_status($app_id);
    echo json_encode(array("success" => true, "status" => $status));
    exit;
}
elseif($act == 'download_file'){

    $t_key = $_REQUEST['file_key'];
    $real_name = $_REQUEST['real_name'];

    $size=$_REQUEST['size'];
    $sizeArray=array('32','64','128','256','512');
    $size=match_size($size,$sizeArray);

    if (empty($t_key) || empty($real_name)) {
        die(false);
    }
    $ua = $_SERVER["HTTP_USER_AGENT"];
    $encoded_filename = urlencode($real_name);
    $encoded_filename = str_replace("+", "%20", $encoded_filename);

    $url = $GLOBALS['file_server_base_url']."/file/downloadex/" . $t_key."/".$size;

    $content = @file_get_contents($url);

    header("Content-type:application/octet-stream");
    // header('Content-Disposition:attachment;filename="'.$real_name.'"');
    if (preg_match("/MSIE/", $ua)  || preg_match("/rv:11.0/i", $ua) || strpos($ua,'rv:11.0')) {
        header('Content-Disposition: attachment; filename="' . $encoded_filename . '"');
    } else if (preg_match("/Firefox/", $ua)) {
        header('Content-Disposition: attachment; filename="' . $real_name . '"');
    } else {
        header('Content-Disposition: attachment; filename="' . $real_name . '"');
    }
    header("Accept-Ranges:bytes");
    header("Accept-Length:" . strlen($content));
    header("content-length:". strlen($content));

    die($content);
}
elseif($act == 'create_app'){
	 /**
     *创建应用
     *create  at 2016-03-２９
     * @author yukang
     * @param (必填)string $app_name 应用名称
     * @param (必填)string $openstack_image_id 镜像id
     * @param (必填)int $category  分类category的id
     * @param (选填)string $host_id 主机ip
     * @param (选填) string $app_description 应用描述
     * @param (选填) string $app_type  应用类型1.外部应用　2.内部应用桌面 3.内部应用web,4.外部应用填写云主机IＤ
     * @param (选填) string $logo_image logo图片
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (选填) string $order_sn 订单编号
     * @param (选填) string $app_url 外部应用地址
     * @param string $file_list 附件
     * @param string is_public 0设置权限 1公开
     * @param string user_ids 指定用户ids
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:''}
	 *					 }
     */

	 $app_name 			= $_REQUEST['app_name'];
	 $openstack_image_id= $_REQUEST['openstack_image_id'];
	 $is_edit			= $_REQUEST['is_edit'];//１编辑0非编辑
	 $category 			= $_REQUEST['category'];
	 $host_id 			= $_REQUEST['host_id'];
	 $app_description   = $_REQUEST['app_description'];
	 $file_list 		= $_REQUEST['file_list'];
	 $logo_image 		= $_REQUEST['logo_image'];
	 $app_type 			= $_REQUEST['app_type'];
	 $status 			= $_REQUEST['status'];
	 $app_url			= $_REQUEST['app_url'];
	 $order_sn			= $_REQUEST['sn'];
	 $user_id       	= $_SESSION['user_id'];

	 $cpu_core_num 		= $_REQUEST['cpu_core_num'];
	 $memory_size 		= $_REQUEST['memory_size'];
	 $hdd_volume 		= $_REQUEST['hdd_volume'];
	 $name              = $_REQUEST['name'];
	 $app_id            = $_REQUEST['app_id'];
	 $is_public         = $_REQUEST['is_public']; 
	 $user_ids          = $_REQUEST['user_ids']; 
	 $is_on_sale		= $_REQUEST['is_on_sale'];
	 $flavorid			= $_REQUEST['flavorid'];

	 if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

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

	 // if($app_description=='<!doctype html>'||empty($app_description))
	 // {
	 // 	echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'应用描述不能为空')));
	 // 	exit;
	 // }

	 // if(empty($logo_image))
	 // {
	 // 	echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'logo图片不能为空')));
	 // 	exit;
	 // }


	 if($app_type==1&&empty($app_url))
	 {	
	 	echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'外部应用地址为空')));
	 	exit;
	 }

	 $result = zd_app_class::publish_app_to_host($app_url,$cpu_core_num,$memory_size,$hdd_volume,$name,$user_id,$app_id,$app_name,$category,$app_description,$app_type,$logo_image,$order_sn,$file_list,$status,$is_on_sale,$is_public,$host_id,$openstack_image_id,$flavorid,$is_edit,$user_ids);

	 if($result['msg']['tip']=='操作失败'){
	 	echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>$result['msg']['text'])));
	 	exit;
	 }
	 if($app_type==4)
	 {
         if(empty($app_url))
         {
             echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'云主机ID不能为空')));
             exit;
         }
         // $is_host_have = zd_openstack_class::is_host_have_to_id($app_url);
         $is_host_have = $result['is_host_have'];
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
	 	// $host_id = zd_db_app_class::_create_app_host($cpu_core_num,$memory_size,$hdd_volume,$name);
	 	// 创建云主机判断当前用户云主机
	 	// zd_app_class::create_host_for_user($user_id);
	}

	if($app_id>0)
	{
		// $app_detail_obj = zd_db_app_class::_get_app_detail($app_id);
		$uid = $result['uid'];
		// if($uid!=$user_id)
		// {
		// // 	// 修改操作
		// // 	$app_data = array(
		// // 		'app_name'        => $app_name,
		// // 		'category'        => $category,
		// // 		'app_description' => $app_description,
		// // 		'app_type'        => $app_type,
		// // 		'logo_image'      => $logo_image,
		// // 		'order_sn'        => $order_sn,
		// // 		'file_list'       => $file_list,
		// // 		'created'      	  => date('Y-m-d H:i:s',time()),
		// //         'app_url'         => $app_url,
		// // 		'status'		  => $status,
		// // 		'is_on_sale'	  => $is_on_sale,
		// // 		'is_public'		  => $is_public,	
		// //         'user_id'         => $user_id
		// // 		);
		// // 	//上架后的编辑操作不修改云主机
		// // 	if($is_edit!=1)
		// // 	{
  // //               $app_data['host_id'] = $host_id;
		// // 	}
			
	 //        // zd_db_app_class::_update_app($app_id,$app_data);
		// // }
		// // else
		// // {
		// 	echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'该应用不是您创建的，你无权修改')));
	 // 		exit;
		// }

	}
	else
	{
	 	// 创建操作
		// $app_id=zd_db_app_class::_create_app($app_name,$category,$host_id,$app_description,$app_type,$logo_image,$status,$order_sn,$app_url,$file_list,$is_public,$is_on_sale);
	}
	 
	if($is_public==0)
	{
		$update_app_power = array(
					'hidden'        => 1
					);
		// zd_db_app_power_class::_update_app_power($app_id,$update_app_power);

		$user_ids = substr($user_ids,0,-1);

		$user_ids_array = explode("|",$user_ids);

		foreach ($user_ids_array as $power_user_id) {

		  	// $app_detail_obj = zd_db_app_power_class::_create_app_power($app_id,$power_user_id);
		}
	}	
	 //

	 //1包括未部署，2正在部署，3已发布，4发布失败
	 if($status==2 && $is_edit==0)
	 {
	 	// zd_app_class::publish_app($host_id,$order_sn,$app_id,'install',$openstack_image_id,$flavorid);
	 }
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='update_install_exe')
{
    /**
     *添加新插件重新安装
     *create  at 2016-04-08
     * @author yukang
     * @param (选填)int app_id 云主机id
     * @param (选填)int sn 订单id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_id   			= $_REQUEST['app_id'];
     $user_id  			= $_SESSION['user_id'];
     $order_sn			= $_REQUEST['sn'];


     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	$app_detail_obj = zd_db_app_class::_get_app_detail($app_id);

	if($app_detail_obj['user_id']==$user_id)
	{
		$host_id = $app_detail_obj['host_id'];
	}else
	{
		echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'该应用不是您创建的，你无权修改')));
	 	exit;
	}

	zd_app_class::publish_app($host_id,$order_sn,$app_id,'update','');
		
	echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	exit;
}
elseif($act=='my_app_data_list')
{
    /**
     *获取我的应用列表
     *create  at 2016-03-30
     * @author yukang
     * @param (必填)int $category  分类category的id
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败 5.已上架，６未上架
     * @param (选填) string $page 第几页
     * @param (选填) string $page_size 每页大小
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
     $category 		= $_REQUEST['category'];
	 $status 		= $_REQUEST['status'];
	 $page 			= isset($_REQUEST['page'])? $_REQUEST['page']:1;
	 $page_size 	= isset($_REQUEST['page_size'])? $_REQUEST['page_size']:10;
	 $search		= $_REQUEST['search'];
	 $user_id       = $_SESSION['user_id'];
     //$app_type      = $_SESSION['app_type'];
	$app_type = 2;

	 if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	 //处理查询应用逻辑
	 $is_on_sale ='';
	 if($status==5)
	 {
	 	$is_on_sale =1;
	 	$status =3;
	 }else if($status==6)
	 {
	 	$is_on_sale =0;
	 	$status =3;
	 }	

	 $list     = zd_db_app_class::get_app_list($category,$status,$user_id,$is_on_sale,$page,$page_size,$search,$app_type);
    $a=$list['list'];
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功',"result"=>$list,'current_page'=>$page)));
	 exit;
}
elseif($act=='app_index')
{
    /**
     *应用园地列表
     *create  at 2016-03-31
     * @author yukang
     * @param (必填)int $category  分类category的id
     * @param (选填) string $status 应用状态，1包括未提交，2正在部署，3已发布，4发布失败
     * @param (选填) string $page 第几页
     * @param (选填) string $page_size 每页大小
     * @param (选填)　string $search 查询条件
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
     //当前用户id
    $user_id   = $_SESSION['user_id'];
    $category 	= $_REQUEST['category'];
    $search 	= $_REQUEST['search'];
    $page 		= isset($_REQUEST['page'])? $_REQUEST['page']:1;
    $page_size = isset($_REQUEST['page_size'])? $_REQUEST['page_size']:10;
    $app_type  = isset($_REQUEST['app_type'])? $_REQUEST['app_type'] : '';
    // $list      = zd_db_app_class::_get_app_garden_list($category,3,$user_id,1,$page,$page_size,$search,'',$app_type);
    $result     = zd_db_app_class::get_app_garden_list($category,3,$user_id,1,$page,$page_size,$search,'',$app_type);
    
    $maplist = $result['list'];

    foreach ($maplist as $k => $v) {
    	$l[] = $v['map'];
    }
    $list['list'] = $l;
	//  //初始化收藏实例对象
	// $collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'app'));
	
	//  foreach ($list['list'] as $key => $value) {
	//  	$app_id = $value['id'];
	//  	//是否已被当前用户收藏
	// 	$list['list'][$key]['is_collection'] = $collection_obj->_is_collection($app_id,$user_id);
	// 	//获取收藏总数
	// 	$list['list'][$key]['collection_count'] = $collection_obj->_get_collection_count('','app',$app_id);
	//  }
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功',"result"=>$list,'current_page'=>$page)));
	 exit;
}
elseif($act == 'create_app_host'){
	 /**
     *创建云主机
     *create  at 2016-03-２９
     * @author yukang
     * @param (必填)string $cpu_core_num cpu核心个数
     * @param (必填)string $memory_size  内存大小(单位G)
	 * @param (必填)string $hdd_volume 硬盘大小
	 * @param (必填)string $host_name 云主机名称
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:''}
	 *					 }
     */
	 $cpu_core_num 		= $_REQUEST['cpu_core_num'];
	 $memory_size 		= $_REQUEST['memory_size'];
	 $hdd_volume 		= $_REQUEST['hdd_volume'];
	 $name              = $_REQUEST['name'];
	 $openstack_image_id= $_REQUEST['openstack_image_id'];
	 $user_id       	= $_SESSION['user_id'];
	 $flavorid			= $_REQUEST['flavorid'];
	 $tenant_group_id   = $_SESSION['tenant_group_id'];

	 if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	 if(empty($name))
	 {
	 	echo json_encode(array("status" => 500, "tip" => "操作失败", "content"=>array("text" =>"名字不能为空")));
	 	exit;
	 }

	 if(empty($cpu_core_num))
	 {
	 	echo json_encode(array("status" => 500, "tip" => "操作失败", "content"=>array("text" =>'cpu核心个数不能为空')));
	 	exit;
	 }

	 if(empty($memory_size))
	 {
	 	echo json_encode(array("status" => 500, "tip" => "操作失败", "content"=>array("text" =>'内存大小不能为空')));
	 	exit;
	 }

	 if(empty($hdd_volume))
	 {
	 	echo json_encode(array("status" => 500, "tip" => "操作失败", "content"=>array("text" =>'硬盘大小不能为空')));
	 	exit;
	 }

	//云主机申请状态
	$status = 5;
    $app_host_id = zd_db_app_class::_create_app_host($cpu_core_num,$memory_size,$hdd_volume,$name,$operation_system='',$host_ip='',$host_password='',$host_server_id='',$user_id='',$status,$openstack_image_id,$flavorid,$tenant_group_id);
    // 创建云主机判断当前用户云主机
	//zd_app_class::create_host_for_user($user_id);
    //创建云主机
	 //zd_app_class::publish_app_host($app_host_id,$openstack_image_id,$flavorid);
	 echo json_encode(array("status" => 200, "tip" => "操作成功", "content"=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='get_my_host_list')
{
    /**
     *获取我的云主机列表
     *create  at 2016-04-01
     * @author yukang
     * @param (选填) string $page 第几页
     * @param (选填) string $page_size 每页大小
     * @param (选填)　string $search 查询条件
     * @param (选填)　string $status 云主机状态
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $search 		= $_REQUEST['search'];
	 $page 			= isset($_REQUEST['page'])? $_REQUEST['page']:1;
	 $page_size 	= isset($_REQUEST['page_size'])? $_REQUEST['page_size']:10;
	 $status        = $_REQUEST['status'];
     $user_id       = $_SESSION['user_id'];
     
     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	 $result    = zd_db_app_class::get_host_list($user_id,$page,$page_size,$search,$status);
	 $host_num		= $result['count'];
	 $list['count'] = $result['count'];
	 $list['list'] = $result['data'];

	 $smarty->assign('host_num', $host_num);

	 $smarty->assign('host_have', $result['host_have']);
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功',"result"=>$list,'current_page'=>$page)));
	 exit;
}
elseif($act=='restart_app_host')
{
    /**
     *重启云主机
     *create  at 2016-04-07
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_host_id   = $_REQUEST['id'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
    $result = zd_app_class::restart_app_host($app_host_id);
    if(!$result['bool']){
        echo json_encode(array("status" => $result['status'], "tip" => $result['tip'], content=>array("text" =>$result['content']['text'])));
        exit;
    }
//	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
//	 exit;
}
elseif($act=='open_app_host')
{
    /**
     *打开云主机
     *create  at 2016-04-07
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_host_id   = $_REQUEST['id'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	 $result = zd_app_class::open_app_host($app_host_id);
     if(!$result['bool']){
         echo json_encode(array("status" => $result['status'], "tip" => $result['tip'], content=>array("text" =>$result['content']['text'])));
         exit;
     }
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='close_app_host')
{
    /**
     *关闭云主机
     *create  at 2016-04-07
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_host_id   = $_REQUEST['id'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
     $result = zd_app_class::close_app_host($app_host_id);
     if(!$result['bool']){
        echo json_encode(array("status" => $result['status'], "tip" => $result['tip'], content=>array("text" =>$result['content']['text'])));
        exit;
     }
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='app_on_sale')
{
    /**
     *应用上架下架操作
     *create  at 2016-04-07
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_id   		= $_REQUEST['id'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	 zd_app_class::app_on_sale($app_id);
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='delete_app_host')
{
    /**
     *删除云主机
     *create  at 2016-04-07
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_host_id   = $_REQUEST['id'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	 $ret = zd_app_class::delete_app_host($app_host_id);
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功'),"result" => $ret));
	 exit;
}
elseif($act=='host_batch_delete')
{
    /**
     *删除云主机
     *create  at 2016-04-07
     * @author yukang
     * @param (选填)int host_ids 云主机host_ids
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_host_ids   = $_REQUEST['host_ids'];
     $user_id        = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	$app_host_ids_array = explode("|",$app_host_ids);

	foreach ($app_host_ids_array as $app_host_id) {
		 zd_app_class::delete_app_host($app_host_id);
	 }
	

	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='console_app_host')
{
    /**
     *云主机控制台
     *create  at 2016-04-08
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_host_id   = intval($_REQUEST['id']);
     $user_id       = $_SESSION['user_id'];
    	// 该方法园地也可以在线使用不需要判断
  //    if(empty($user_id))
	 // {
	 // 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 // 	exit;
	 // }
	 zd_app_class::console_app_host($app_host_id);
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='console_app_host_openstack')
{
    /**
     *云主机控制台
     *create  at 2016-05-09
     * @author yukang
     * @param (选填)int host_server_id 
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $host_server_id   = $_REQUEST['host_server_id'];
     $user_id          = $_SESSION['user_id'];
    	// 该方法园地也可以在线使用不需要判断
  //    if(empty($user_id))
	 // {
	 // 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 // 	exit;
	 // }
	 $url = zd_openstack_class::get_host_url($host_server_id);
     echo json_encode(array("status" =>200, "tip" => "操作成功", content=>array("text" =>"操作成功","url"=>$url)));
     exit;
}elseif($act=='user_regist'){
	//用户注册申请
	$ip = trim($GLOBALS['iggs_api_url_base_url']);
	$user_role_id = "CLOUD";
	$user_username = $_REQUEST['username'];
	$user_password = $_REQUEST['password'];
	$user_email = $_REQUEST['email'];
	$real_name = $_REQUEST['realname'];
	$tenant_id = $_REQUEST['tenantid'];
	$user_url = $ip."ecs/user/regist";
	$user_url_s = $user_url."?role_id=".$user_role_id."&username=".$user_username."&password=".$user_password."&email=".$user_email."&realname=".$real_name."&tenant_id=".$tenant_id;
	zd_core::autoload("zd_common_class");
    $user_result = zd_common_class::_send_get($user_url_s);
	echo $user_result;
	exit;
}
elseif($act=='delete_app')
{
    /**
     *云主机删除
     *create  at 2016-04-08
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_id   = $_REQUEST['id'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	 	$ip = trim($GLOBALS['iggs_api_url_base_url']);

	    $api_url = $ip."ecs/delete/app";

        $api_url_s = $api_url."?user_id=".$user_id."&app_id=".$app_id;

        zd_core::autoload("zd_common_class");

        $result_msg = zd_common_class::_send_get($api_url_s);

        $result = json_decode($result_msg,true);
//	 	$app_detail_obj = zd_db_app_class::_get_app_detail($app_id);
        $app_detail_obj = $result['app'];
		if($app_detail_obj['ecsUser']['userId']==$user_id)
		{
										//订单id
			if(!empty($app_detail_obj['orderSn']))
			{
//				$order_obj = zd_core::instance('zd_db_order_class');
//				//调用云狗解绑信息接口
//				$order_info = zd_db_order_class::_get_order_info_by_id($app_detail_obj['order_sn'],$user_id);
                $order_info = $result['order_info'];

               //授权号
               $serial_no = $order_info['serialNo'];
               //获取其绑定信息
               $auth_info = $GLOBALS['gis_service']->get_auth_info($serial_no);
               //可解除绑定
               if ($auth_info['success'] && !empty($auth_info['result']->BingdingMac)) {
                   $GLOBALS['gis_service']->update_auth_mac_info($serial_no);
               }
			}
			// 修改操作
//			$app_data = array(
//				'hidden'        => 1
//				);
//	        zd_db_app_class::_update_app($app_id,$app_data);
		}else
		{
			echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>'该应用不是您部署的，你无权修改')));
	 		exit;
		}
		
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='app_batch_delete')
{
    /**
     *云主机批量删除
     *create  at 2016-04-08
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $app_ids   	= $_REQUEST['app_ids'];
     $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }
	  
	
	$app_ids_array = explode("|",$app_ids);

	foreach ($app_ids_array as $app_id) {
	  	$app_detail_obj = zd_db_app_class::_get_app_detail($app_id);

		if($app_detail_obj['user_id']==$user_id)
		{
			if(!empty($app_detail_obj['order_sn']))
			{
				$order_obj = zd_core::instance('zd_db_order_class');
				//调用云狗解绑信息接口
				$order_info = zd_db_order_class::_get_order_info_by_id($app_detail_obj['order_sn']);

				//授权号
               	$serial_no = $order_info['serial_no'];
               //获取其绑定信息
               	$auth_info = $GLOBALS['gis_service']->get_auth_info($serial_no);
               	//可解除绑定
               	if ($auth_info['success'] && !empty($auth_info['result']->BingdingMac)) {
                   $GLOBALS['gis_service']->update_auth_mac_info($serial_no);
               	}
			}
			// 修改操作
			$app_data = array(
				'hidden'        => 1
				);
	        zd_db_app_class::_update_app($app_id,$app_data);
		}
	  }
		
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功')));
	 exit;
}
elseif($act=='get_user_list')
{
    /**
     *查找用户列表
     *create  at 2016-04-08
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $search   	    = $_REQUEST['search'];
	 $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	 $list           = zd_db_users_class::get_user_list($search);
		
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功',"list"=>$list)));
	 exit;
}
elseif($act=='get_user_info')
{
    /**
     *查找用户列表
     *create  at 2016-04-08
     * @author yukang
     * @param (选填)int id 云主机id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	 $search   	    = $_REQUEST['search'];
	 $user_id       = $_SESSION['user_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	 $user_info     = zd_db_users_class::get_user_info_by_id($user_id);
		
	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" =>'操作成功',"user_info"=>$user_info)));
	 exit;
}
elseif($act=='delete_msg')
{
	 /**
     *删除消息
     *create  at 2017-2-21
     * @author song
     * @param (必填)int user_id 用户id
     * @param (必填)int msg_id 消息id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
     $user_id       = $_SESSION['user_id'];
     $msg_id        = $_REQUEST['msg_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	 $result  = zd_message_class::DeleteMessage($user_id,$msg_id);

	 $ret = $result['result'];

	 $ret_msg = $result['dmsg'];

	 $ret_data = $result['data'];

	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" => $ret),"ret_msg" => $ret_msg,"ret" => $ret,"ret_data" => $ret_data));
	 exit;
}
elseif($act=='update_msg')
{
	/**
     *修改消息阅读状态
     *create  at 2017-2-22
     * @author song
     * @param (必填)int user_id 用户id
     * @param (必填)int msg_id 消息id
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	$user_id       = $_SESSION['user_id'];
     $msg_id        = $_REQUEST['msg_id'];

     if(empty($user_id))
	 {
	 	echo json_encode(array("status" => 403, "tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
	 	exit;
	 }

	 $result  = zd_message_class::UpdateMessageReadStatus($user_id,$msg_id);

	 $ret = $result['result'];

	 $ret_msg = $result['umsg'];

	 $ret_data = $result['data'];

	 echo json_encode(array("status" => 200, "tip" => "操作成功", content=>array("text" => $ret),"ret_msg" => $ret_msg,"ret" => $ret,"ret_data" => $ret_data));
	 exit;
}
elseif($act=='apply_service_token')
{
	/**
     *申请地图服务token
     *create  at 2017-4-17
     * @author song
     * @param int user_id 用户id
     * @param int time_limit 申请期限 1永久 2限时
     * @param int time_num 申请时长
     * @param int time_unit 时间类型 1月 12年
     * @param String service_type 地图服务类型
     * @return 返回值：json{
	 *					    status:200/500
	 *						tip:'',操作提示
	 *			     		content:返回提示
	 *						{text:'',result:''}
	 *					 }
     */
	$user_id = $_SESSION['user_id'];

	$time_limit = $_REQUEST['time_limit'];

	$time_num = $_REQUEST['time_num']?$_REQUEST['time_num']:0;

	$time_unit = $_REQUEST['time_unit']?$_REQUEST['time_unit']:0;

	$service = $_REQUEST['service_type'];

    if(empty($user_id))
    {
        echo json_encode(array("status" => 403, "msg"=>"not_login","tip" => "操作失败", content=>array("text" =>"请登录后再操作")));
        exit;
    }

   	$ip = trim($GLOBALS['iggs_api_url_base_url']);

    $api_url = $ip."ecs/apply/service/token";

    $api_url_s = $api_url."?user_id=".$user_id."&time_limit=".$time_limit."&time_num=".$time_num."&time_unit=".$time_unit."&service=".$service;

    zd_core::autoload('zd_common_class');
    //发送请求
    $message_result = zd_common_class::_send_get($api_url_s);

    $result = json_decode($message_result,true);

    $bool = $result['bool'];

    if(!$bool){
        echo json_encode(array("status" => 403, "tip" => "申请失败", content=>array("text" =>$result['msg'])));
        exit;
	}
    echo json_encode(array("status" => 200, "tip" => "申请成功", content=>array("text" =>$result['msg'])));
    exit;
}
elseif($act=='get_show_map'){
	//用户注册申请
	$ip = trim($GLOBALS['iggs_api_url_base_url']);
	$user_url = $ip."ecs/get/show/map";
	zd_core::autoload("zd_common_class");
    $user_result = zd_common_class::_send_get($user_url);
	echo $user_result;
	exit;
}
elseif($act=='get_theme_map'){
	//用户注册申请
	$ip = trim($GLOBALS['iggs_api_url_base_url']);
	$user_url = $ip."ecs/get/theme/json";
	zd_core::autoload("zd_common_class");
    $user_result = zd_common_class::_send_get($user_url);
	echo $user_result;
	exit;
}
elseif($act=='get_poi_map'){
	//用户注册申请
	$ip = trim($GLOBALS['iggs_api_url_base_url']);
	// $ip="http://192.168.10.207:8181/rest/api/";
	$user_url = $ip."ecs/get/poi/map";
	zd_core::autoload("zd_common_class");
    $user_result = zd_common_class::_send_get($user_url);
	echo $user_result;
	exit;
}
else
{
	die_result(false,'no act');
}
?>
