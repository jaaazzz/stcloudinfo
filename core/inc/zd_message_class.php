<?php
/**
 * Created by PhpStorm.
 * User: chelsea
 * Date: 17-1-9
 * Time: 上午10:49
 */

class zd_message_class {
    public function __construct()
    {

    }

    /**
     * 分页查询系统消息
     * @param String uc_id      用户UC_ID
     * @param String read       消息是否已读：0-未读；1-已读；2-全部
     * @param String page       当前页码
     * @param String page_size  每页显示记录条数
     * @param String page_count 页码总数
     * @param String count      记录总数
     * @return
     */
     public static function GetSystemMessage($uc_id,$read,$page,$page_size){
        $msg = ""; $data = null;
        try{
            if(is_null($user_id) || empty($user_id))
            {
                $msg = "用户ID为空";
            }
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."message/select";

            $api_url_s = $api_url."/".$uc_id."?read=".$read."&page=".$page."&page_size=".$page_size;
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);
            
            $select_data = json_decode($message_result,true);

            $datajson = json_decode($select_data['msg'],true);

            $result = $datajson['result'][0];

            $message_json = $datajson['data'][0];

            $data = json_decode($message_json,true);

            $message_info = $data['_data_info'];

            $page_info = $data['_page_info'];


        }
        catch(Exception $e)
        {
            $msg = "查询异常。详情：" . $e->getMessage();
        }

        return Array("msg" => $msg,"message_info" => $message_info,"page_info" => $page_info);
     }

     /**
     * 删除系统消息
     * @param String uc_id      用户UC_ID
     * @param String m_id       消息记录ID：多个消息请以","隔开
     * @return
     */
     public static function DeleteMessage($user_id,$msg_id){
        $msg = ""; $data = null;
        try{
            if(is_null($user_id) || empty($user_id))
            {
                $msg = "用户ID为空";
            }
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."message/delete";

            $api_url_s = $api_url."/".$user_id."/".$msg_id;
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);
            
            $delete_data = json_decode($message_result,true);

            $datajson = json_decode($delete_data['msg'],true);

            $data = $datajson['data'];

            $result = $datajson['result'];

            $dmsg = $datajson['msg'];

        }
        catch(Exception $e)
        {
            $msg = "删除异常。详情：" . $e->getMessage();
        }
        return Array("msg" => $msg,"result" => $result,"dmsg" => $dmsg,"data" => $data);
     }

     /**
     * 更新我的消息读取状态
     * @param String uc_id      用户UC_ID
     * @param String $msg_id 消息ID
     * @return 
     */
    public static function UpdateMessageReadStatus($user_id,$msg_id)
    {
        $msg = ""; $data = null;
        try{
            if(is_null($user_id) || empty($user_id))
            {
                $msg = "用户ID为空";
            }
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."message/update";

            $api_url_s = $api_url."/".$user_id."/".$msg_id;
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);
            
            $update_data = json_decode($message_result,true);

            $datajson = json_decode($update_data['msg'],true);

            $data = $datajson['data'];

            $result = $datajson['result'];

            $umsg = $datajson['msg'];

        }
        catch(Exception $e)
        {
            $msg = "删除异常。详情：" . $e->getMessage();
        }
        return Array("msg" => $msg,"result" => $result,"umsg" => $umsg,"data" => $data);
    }

    /**
     * 查询未读消息总条数
     * @param String uc_id      用户UC_ID
     * @return 
     */
    public function SelectUnreadCount($user_id)
    {
        $msg = ""; $data = null;
        try{
            if(is_null($user_id) || empty($user_id))
            {
                $msg = "用户ID为空";
            }
            $ip = trim($GLOBALS['iggs_api_url_base_url']);

            $api_url = $ip."message/count";

            $api_url_s = $api_url."/".$user_id;
            //加载zd_common_class类库
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);
            
            $update_data = json_decode($message_result,true);

            $datajson = json_decode($update_data['msg'],true);

            $data = $datajson['data'];

            $result = $datajson['result'];

            $umsg = $datajson['msg'];

        }
        catch(Exception $e)
        {
            $msg = "删除异常。详情：" . $e->getMessage();
        }
        return Array("msg" => $msg,"result" => $result,"umsg" => $umsg,"data" => $data);
    }


    /**
     * 查询我的消息
     * @param int $user_id   用户ID
     * @param int $page      当前页码
     * @param int $page_size 每页显示条数
     * * @param array $where   查询条件
     * @param bool $is_count 是否查询总记录条数
     * @return array
     */
    public function GetMessageByUserInfo($user_id,$page,$page_size,$where=Array(),$is_count=false)
    {
        $bool = false; $msg = ""; $content = null;
        try
        {
            if(is_null($user_id) || empty($user_id))
            {
                $msg = "用户ID为空";
            }

            $sql_where = " 1=1 and msg_status = 1 and msg_to_user = " . $user_id . " ";
            if(is_array($where) && count($where) > 0)
            {
                foreach($where as $k => $w)
                {
                    $sql_where .= " and " . $k . " = " . $w . " ";
                }
            }

            $content = zd_db_message_class::GetMessageByUserInfo($sql_where,$page,$page_size,$is_count);

            //页码
            if($content['bool'])
            {
                //更新消息状态：未读->已读
                $not_read_list = '';
                foreach($content['data'] as $k => $v)
                {
                    if(intval($v['msg_read']) != 1)
                    {
                        $not_read_list .= "'" . $v['id'] . "',";
                        $v['msg_read_text'] = '未读';
                    }
                    else
                    {
                        $v['msg_read_text'] = '已读';
                    }
                    $v['msg_update_date'] = date('Y-m-d',strtotime($v['msg_update_date']));
                    $content['data'][$k] = $v;
                }
                if(!empty($not_read_list))
                {
                    $this->UpdateMessageReadStatus(rtrim($not_read_list,','));
                }

                if(!is_null($page) && !is_null($page_size))
                {
                    $content['page'] = $page;
                    $content['page_size'] = $page_size;
                    $content['page_count']= intval(($content['count'] + $page_size - 1) / $page_size);
                }
            }
        }
        catch(Exception $e)
        {
            $msg = "查询异常。详情：" . $e->getMessage();
        }

        return Array("bool" => $content['bool'],"msg" => $msg, "content" => $content);
    }


    /**
    *更新我的申请状态
    *获取到的数据里面找verify_msg这个键值
    *软件申请 order_status = 2不通过 1通过
    *云主机 status = 6 不通过 status = 1 通过
    */
    //软件申请
    public function SoftwareApplyStatus($order_status,$msg_content,$msg_type,$user_id,$verify_msg,$apply_name,$apply_time){
        $msg_update_date = date("Y-m-d h:m:s"); 
        if($order_status == 2){
            $msg_content = "您于".$apply_time."发起的".$apply_name."使用权的申请未通过审核，理由：".$verify_msg;
        }elseif ($order_status == 1) {
            $msg_content = "您于".$apply_time."发起的".$apply_name."使用权的申请已经通过审核。";
        }
        return zd_db_message_class::SoftwareApplyStatus($msg_content,$msg_update_date,$user_id);
    }



    //云主机申请
    public function CloudhostApplyStatus($status,$msg_content,$msg_type,$user_id,$verify_msg,$apply_name,$apply_time){
        $msg_update_date = date("Y-m-d h:m:s");
        if($status == 2){
            $msg_content = "您于".$apply_time."发起的".$apply_name."使用权的申请未通过审核，理由：".$verify_msg;
        }elseif ($status == 1) {
            $msg_content = "您于".$apply_time."发起的".$apply_name."使用权的申请已经通过审核。";
        }
        return zd_db_message_class::CloudhostApplyStatus($msg_content,$msg_update_date,$user_id);
    }

    // //删除消息
    // public function DeleteMessage($msg_id){
    //     if(is_null($user_id)){
    //         return zd_db_message_class::DeleteAllMessage();
    //     }else{
    //         return zd_db_message_class::DeleteOneMessage($msg_id);
    //     }
    // }
} 