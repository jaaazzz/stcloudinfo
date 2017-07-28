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
 * 云主机的相关类库
*/
// require_once JPATH_SITE."/openstack/vendor/autoload.php";
include_once(ROOT_PATH . '/openstack/vendor/autoload.php');
use OpenCloud\OpenStack;
use OpenCloud\Common\Constants\Size;
use OpenCloud\ObjectStore\Resource\DataObject;
use OpenCloud\Compute\Constants\ServerState;
use OpenCloud\Compute\Resource\Network;
use Guzzle\Http\Exception\BadResponseException;
class zd_openstack_class
{

    //set true when localhost DEBUG
    const IS_INTERNAL_URL = true;

    //打开openstack客户端与openstack建立连接
    public static function get_openstack_client()
    {

        // if(static::IS_INTERNAL_URL){
        //     $url = "http://192.168.228.0:5000/v2.0";
        // }else{
        //     $url = "http://61.183.129.188:5000/v2.0";
        // }
        global $openstack_identity, $openstack_username, $openstack_password, $openstack_tenantName;

        if (static::IS_INTERNAL_URL) {
            $url = $openstack_identity;
        } else {
            $url = $openstack_identity;
        }

        $client = new Openstack($url, array(
            'username' => $openstack_username,
            'password' => $openstack_password,
            'tenantName' => $openstack_tenantName
        ));

        return $client;
    }

    /**
     * 云主机服务调用内部还是外部判断
     * create  at 2016-04-05
     * @author yukang
     * @return \OpenCloud\Compute\Resource\Server
     */
    public static function get_computer_service()
    {

        $client = static::get_openstack_client();

        global $region, $urltype;

        // if(static::IS_INTERNAL_URL){
        $computeService = $client->computeService('nova', $region, $urltype);
        // }else{
        //     $computeService = $client->computeService('nova','regionOne','publicURL');
        // }
        return $computeService;
    }

    public static function get_object_store_service()
    {
        $client = static::get_openstack_client();
        try {
            if (static::IS_INTERNAL_URL) {
                $objectStoreService = $client->objectStoreService('swift', 'regionOne');
            } else {
                //获取对象存储服务
                $objectStoreService = $client->objectStoreService('swift', 'regionOne');
            }
            return $objectStoreService;
        } catch (Exception $e) {
            echo json_encode(array("status" => 500, "tip" => "操作失败", content => array("text" => $e->getMessage())));
            exit;
        }
    }

    public static function get_storage()
    {
        $objectStoreService = static::get_object_store_Service();
        $objectStorage = $objectStoreService->getContainer();
        return $objectStorage;
    }

    //获取云主机概况
    //yukang
    //     "count": 1,服务器数量
    //     "vcpus_used": 0,虚拟内核使用情况已使用数量
    //     "local_gb_used": 0,磁盘使用情况已使用数量
    //     "memory_mb": 7980,内存使用总量内存精确到了MB，网页上转换成了GB，并做了取整
    //     "current_workload": 0,
    //     "vcpus": 8,虚拟内核(总计)
    //     "running_vms": 0,
    //     "free_disk_gb": 157,硬盘总量可用空间
    //     "disk_available_least": 140,
    //     "local_gb": 157,硬盘总量
    //     "free_ram_mb": 7468,
    //     "memory_mb_used": 512内存(已使用内存精确到了MB，网页上转换成了GB，并做了取整)
    // 
    public static function get_hypervisors()
    {
        $computeService = static::get_computer_service();

        $hypervisors_list = $computeService->server()->getHypervisorsList();
        return $hypervisors_list;
    }
    // public static function get_flavor_list(){
    //     $computeService = static::get_computer_service();
    //     $flavor_list = $computeService->flavorList();
    //     return $flavor_list;
    // }    
    public static function get_flavor_list()
    {
        $computeService = static::get_computer_service();
        $flavor_list = $computeService->flavorList();
        $result = array();
        foreach ($flavor_list as $flavor) {
            $obj = array();
            $obj['id'] = $flavor->id;
            $obj['name'] = $flavor->name;
            $obj['vcpus'] = $flavor->vcpus;
            $obj['ram'] = $flavor->ram;
            $obj['disk'] = $flavor->disk;
            $obj['status'] = $flavor->status;
            $result[] = $obj;
        }
        return $result;
    }

    public static function get_flavor_by_hardware($cpu, $ram, $disk)
    {
        $computeService = static::get_computer_service();
        $flavor_list = $computeService->flavorList();
        foreach ($flavor_list as $flavor) {
            if ($flavor->vcpus == intval($cpu) && $flavor->ram == intval($ram) && $flavor->disk == intval($disk)) {
                return $flavor;
            }
        }
        return null;
    }

    public static function get_image_list()
    {
        $computeService = static::get_computer_service();
        return $computeService->imageList();
    }

    /**
     * 2016-09-20 by zc
     * 在云主机上部署服务
     * @param $host_id 虚拟主机id
     * @param $metadata 元数据信息
     * @return mixed
     */
    public static function deploy_app_by_host($host_id, $metadata)
    {
        try {
            $computeService = static::get_computer_service();
            //获取云主机
            $server = $computeService->server($host_id);
            //修改元数据
            $metadata_obj = $server->getMetadata();
            foreach ($metadata AS $key => $value) {
                $metadata_obj->setProperty($key, $value);
            }
            $metadata_obj->update();
            zd_openstack_class::restart_server($server->id);
            return $server;
        } catch (Exception $ee) {
            return null;
        }
    }

    /**
     * 创建主机
     * create  at 2016-04-05
     * @author yukang
     * @param $app_id 应用id
     * @param array $metadata 主机的元数据
     * @param $callback 创建中的回调函数
     * @return \OpenCloud\Compute\Resource\Server
     * @throws Exception
     */
    public static function create_service($app_host_id, $flavorId, array $metadata = array(), $callback, $openstack_image_id, $hdd_volume)
    {
        $computeService = static::get_computer_service();

        if (empty($app_host_id)) {
            throw new Exception("app_host_id不能为空");
        }
        $serverName = "space_time_host_" . $app_host_id;

        global $openstack_flavorId,$openstack_availabilityZone;
        // 密钥对名称
        global $keypairName;
        $imageId = $openstack_image_id;
        if (empty($flavorId)) {
            $flavorId = $openstack_flavorId;//1-1-40 4991bef1-1e94-487f-a606-f616861b93e5
        }

        $server_list = $computeService->serverList(true, array("name" => $serverName));
        if ($server_list->count() > 0) {
            //获取云主机
            $server = $computeService->server($server_list[0]->id);

            //修改元数据
            $metadata_obj = $server->getMetadata();

            foreach ($metadata AS $key => $value) {
                $metadata_obj->setProperty($key, $value);
            }
            $metadata_obj->update();
            zd_openstack_class::restart_server($server->id);

        } else {
            //4.创建云主机
            $server = $computeService->server();
            try {
                global $is_openstack_huawei, $huawei_openstack_network_id;
                if ($is_openstack_huawei) {
                    //华为创建云主机接口
                    $block_device[] = (object)array("source_type" => "image",
                        "destination_type" => "volume",
                        "boot_index" => "0",
                        "uuid" => $imageId,
                        "volume_size" => $hdd_volume);

                    $networks[] = (object)array('uuid' => $huawei_openstack_network_id);
                    // $aa = new Network($computeService,'2865f2ed-dfdc-4576-bc01-f0542f54c28b');
                    $response = $server->create(array(
                        'name' => $serverName,
                        'imageRef' => '',
                        'flavorRef' => $flavorId,
                        'block_device_mapping_v2' => $block_device,
                        'networks' => $networks,
                        'metadata' => $metadata
                    ));

                } else {
                    //原生openstack接口
                    $server_param = array(
                        'name' => $serverName,
                        'imageId' => $imageId,
                        'flavorId' => $flavorId,
                        'keypair' => $keypairName,
                        'metadata' => $metadata
                    );
                    if($openstack_availabilityZone){
                        $server_param["availabilityZone"] = $openstack_availabilityZone;
                    }
                    $response = $server->create($server_param);
                }
                $GLOBALS['db']->query("update " . $GLOBALS['ecs']->table('users') . " set host_have=host_have-1 where user_id=" . $_SESSION['user_id']);
            } catch (BadResponseException $e) {
                $e;
                echo json_encode(array("status" => 500, "tip" => "操作失败", content => array("text" => $e->getMessage())));
                exit;
            }
            if ($server->status != ServerState::ACTIVE) {
                //wait for
                $server->waitFor(ServerState::ACTIVE, null, $callback, 5);
            }

            if ($server->status == ServerState::ERROR) {
                throw new Exception("创建云主机异常!");
            }
        }
        return $server;
    }

    /**
     * 重构创建云主机
     * @param $app_host_id
     * @param $flavor_id
     * @param $image_id
     * @param $hdd_volume
     * @param string $user_id
     * @param array $metadata
     * @return array
     */
    public static function create_service_again($app_host_id, $flavor_id, $image_id, $hdd_volume, $user_id = '', $metadata = array())
    {
        $bool = false; $content = null;
        //初始化openstack服务
        $computeService = static::get_computer_service();
        //云主机服务名称
        $serverName = "space_time_host_" . $app_host_id;
        try {
            //通过 云主机服务名称 验证该服务名称是否已经被创建
            $server_list = $computeService->serverList(true, array("name" => $serverName));
            if (!is_null($server_list) && $server_list->count() > 0) {
                try {
                    //获取云主机
                    $server = $computeService->server($server_list[0]->id);
                    //修改元数据
                    $metadata_obj = $server->getMetadata();

                    foreach ($metadata AS $key => $value) {
                        $metadata_obj->setProperty($key, $value);
                    }
                    $metadata_obj->update();

                    //重启服务
                    zd_openstack_class::restart_server($server->id);

                    $bool = true;
                    $msg = '【' . $serverName . '】云主机已经被创建，且重启成功';
                } catch (Exception $e) {
                    $msg = '【' . $serverName . '】云主机已经被创建，但尝试重启异常。异常原因：' . $e->getMessage();
                }
            } else {
                try {
                    $server = $computeService->server();

                    global $is_openstack_huawei;
                    if ($is_openstack_huawei) {
                        global $huawei_openstack_network_id;
                        //华为创建云主机接口
                        $block_device[] = (object)array("source_type" => "image",
                            "destination_type" => "volume",
                            "boot_index" => "0",
                            "uuid" => $image_id,
                            "volume_size" => $hdd_volume);

                        $networks[] = (object)array('uuid' => $huawei_openstack_network_id);
                        $server->create(array(
                            'name' => $serverName,
                            'imageRef' => '',
                            'flavorRef' => $flavor_id,
                            'block_device_mapping_v2' => $block_device,
                            'networks' => $networks,
                            'metadata' => $metadata
                        ));
                    } else {
                        //配置文件密钥
                        global $keypairName,$openstack_availabilityZone;
                        //原生openstack接口
                        $server_param = array(
                            'name' => $serverName,
                            'imageId' => $image_id,
                            'flavorId' => $flavor_id,
                            'keypair' => $keypairName,
                            'metadata' => $metadata
                        );
                        if($openstack_availabilityZone){
                            $server_param["availabilityZone"] = $openstack_availabilityZone;
                        }
                        $server->create($server_param);
                    }

                    $user_id = !empty($user_id) ? $user_id : $_SESSION['user_id'];
                    $GLOBALS['db']->query("update " . $GLOBALS['ecs']->table('users') . " set host_have=host_have-1 where user_id=" . $user_id);

                    //循环获取云主机状态，时间间隔5s
                    if ($server->status != ServerState::ACTIVE) {
                        $server->waitFor(ServerState::ACTIVE, null, null, 5);
                    }

                    $msg = '【' . $serverName . '】云主机';
                    switch (strtoupper($server->status)) {
                        case ServerState::ACTIVE:
                            $bool = true;
                            $msg = '创建成功。状态：ServerState Is Active';
                            $content = Array('server' => $server,'state' => $server->status);
                            break;
                        case ServerState::ERROR:
                            $msg .= '创建失败。状态：ServerState Is Error';
                            break;
                        default:
                            $bool = true;
                            $msg = '当前状态：ServerState Is ' . $server->status;
                            $content = Array('server' => $server,'state' => $server->status);
                            break;
                    }
                } catch (Exception $e) {
                    $msg = '【' . $serverName . '】云主机创建异常。异常原因：' . $e->getMessage();
                }
            }
        } catch (Exception $e) {
            $msg = '通过 云主机服务名称 验证该服务名称是否已经被创建异常。异常原因：' . $e->getMessage();
        }

        return Array('bool' => $bool, 'msg' => $msg, 'content' => $content);
    }

    public static function get_server($server_id){
        try{
            $computeService = static::get_computer_service();
            $server = $computeService->server($server_id);
            return $server;
        }catch (Exception $e){
            echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>"获取该云主机出现异常，该云主机可能已经不存在了")));
            exit;
        }
    }
    public static function get_server_2($server_id){
        try{
            $computeService = static::get_computer_service();
            $server = $computeService->server($server_id);
            return $server;
        }catch (Exception $e){
//            echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>"获取该云主机出现异常，该云主机可能已经不存在了")));
//            exit;
            return false;
        }
    }
    /**
     * 设置主机状态
     * @param array $app_list
     */
    public static function set_app_state(array $app_list){
        if(count($app_list)>0){
            $computeService = static::get_computer_service();
            foreach($app_list AS &$app){
                $server = $computeService->server($app->server_id);
                $app->host_status = $server->status;
            }
        }
    }

    /**
     * 重启主机
     * @param $server_id
     * @return bool
     */
    public static function restart_server($server_id){
        $server = static::get_server($server_id);
        if($server->status == ServerState::ACTIVE){
            $server->reboot();
            $server->waitFor(ServerState::ACTIVE,120,null,1);
        }
        return !!($server->status === ServerState::ACTIVE);
    }

    /**
     * 启动云主机
     * @param $server_id
     * @return bool
     */
    public static function start_server($server_id){
        $server = static::get_server($server_id);
        if($server && $server->status!= ServerState::ACTIVE){
            $server->start();
            $server->waitFor(ServerState::ACTIVE,120,null,1);
        }
        return !!($server->status === ServerState::ACTIVE);
    }

    /**
     * 关闭云主机
     * @param $server_id
     * @return bool
     */
    public static function stop_server($server_id){
        $server = static::get_server($server_id);
        if($server && $server->status != 'SHUTOFF') {
            $server->stop();
            $server->waitFor('SHUTOFF', 120, null, 1);
        }
        return !!($server->status === 'SHUTOFF');
    }

    /**
     * 删除云主机
     * @param $server_id
     */
    public static function delete_server($server_id){
        $server = static::get_server($server_id);
        $server->delete();
    }
    /**
     * 删除云主机
     * @param $server_id
     */
    public static function delete_server_2($server_id){
        $server = static::get_server_2($server_id);
        if($server){
            $server->delete();
            return true;
        }else{
            return false;
        }

    }
    /**
     * @return string
     */
    public static function getFloatingIPPoolName(){
        $computeService = static::get_computer_service();
        $floatingIPPools= $computeService->listFloatingIPPools();
        $floatingIPPoolName = $floatingIPPools[0]->name;

        if (!is_null($floatingIPPoolName) && !empty($floatingIPPoolName)){
            return $floatingIPPoolName;
        } else {
            return 'nova';
        }
    }
    /**
     * @return string
     */
    public static function get_host_url($server_id)
    {
        try
        {
            $computeService = static::get_computer_service();
            $server 		= $computeService->server($server_id);
            $console 		= $server->console();
            $url 	 		= $console->url;

            if(!empty($GLOBALS['proxy_vnc_base_url']) && $GLOBALS['proxy_vnc_base_url']!='/')
            {   
                $num            = strrpos($url,"/",-1);
                $url            = substr($url,$num);
                $url            = $GLOBALS['proxy_vnc_base_url'].$url;
            }    
            return $url;
        }catch (Exception $e){
            echo json_encode(array("status" => 500, "tip" => "操作失败", content=>array("text" =>"获取该云主机出现异常，该云主机可能已经不存在了")));
            exit;
        }

    }

    /**
     * 获取云主机远程链接地址
     * @param $server_id
     */
    public static function get_host_url_2($server_id)
    {
        try
        {
            $computeService = static::get_computer_service();
            $server 		= $computeService->server($server_id);
            $console 		= $server->console();
            $url 	 		= $console->url;

            if(!empty($GLOBALS['proxy_vnc_base_url']) && $GLOBALS['proxy_vnc_base_url']!='/')
            {
                $num            = strrpos($url,"/",-1);
                $url            = substr($url,$num);
                $url            = $GLOBALS['proxy_vnc_base_url'].$url;
            }
            return $url;
        }catch (Exception $e){
            return false;
        }

    }
    /**
     * 通过云主机id判断云主机是否存在
     * @param $server_id
     */
    public static function is_host_have_to_id($id)
    {
        try{
            $computeService = static::get_computer_service();
            $computeService->server($id);
            return true;
        }catch (Exception $e){
            return false;
        }
    }
}
?>