<?php
/**
 * Created by PhpStorm.
 * User: chelsea
 * Date: 17-1-9
 * Time: 上午11:12
 */

class zd_db_message_class extends zd_db_base_class {

    public  function __construct()
    {

    }

    /**
     * 查询我的消息
     * @param string $sql_where 查询条件
     * @param int $page         当前页码
     * @param int $page_size    每页显示条数
     * @param bool $is_count    是否查询总记录条数
     * @return array
     */
    public static function GetMessageByUserInfo($sql_where="",$page=1,$page_size=10,$is_count=false)
    {
        $count = 0; $data = null;
        try
        {
            //拼接查询SQL语句
            $sql_str = $GLOBALS["ecs"]->table("message") . " where " . $sql_where;
            //是否查询数据记录总数

            if($is_count)
            {
                $sql_count = "select count(1) from " . $sql_str;
                $count = $GLOBALS['db']->getOne($sql_count);
            }

            //是否分页
            $sql_str = "select * from " . $sql_str . " order by msg_read asc,id desc";
            if(!is_null($page) && !is_null($page_size))
            {
                $sql_str .= " limit " . ($page - 1) * $page_size . "," . $page *$page_size;
            }
            $data = $GLOBALS["db"]->getAll($sql_str);

            $bool = true;
        }
        catch(Exception $e)
        {
            $bool = false;
        }

        return Array('bool' => $bool,'count' => $count,'data' => $data);
    }

    /**
     * 更新我的消息读取状态
     * @param string $msg_id 待更新ID
     * @return bool
     */
    public static function UpdateMessageReadStatus($msg_id)
    {
        $ret = false;
        try
        {
            $sql_str = 'update ' . $GLOBALS['ecs']->table('message') . ' set msg_read = 1 where id in (' . $msg_id . ')';
            $ret = $GLOBALS['db']->query($sql_str) ? true : false;
        }
        catch(Exception $e)
        {

        }

        return $ret;
    }

    public static function CloudhostApplyStatus($msg_content,$msg_update_date,$user_id){
        try{
            $sql = 'insert into'.$GLOBALS['ecs']->table('message').'(msg_to_user,msg_content,msg_update_date) values ('.$user_id.','.$msg_content.','.$msg_update_date.')';
            $ret = $GLOBALS['db']->query($sql) ? true : false;
        }catch(Exception $e){

        }
        return $ret;
    }

    public static function SoftwareApplyStatus($msg_content,$msg_update_date,$user_id){
        try{
            $sql = 'insert into'.$GLOBALS['ecs']->table('message').'(msg_to_user,msg_content,msg_update_date) values ('.$user_id.','.$msg_content.','.$msg_update_date.')';
            $ret = $GLOBALS['db']->query($sql) ? true : false;
        }catch(Exception $e){

        }
        return $ret;
    }
    //删除消息
    public static function DeleteAllMessage(){
        try{
            $sql = 'delete from'.$GLOBALS['ecs']->table('message');
            $ret = $GLOBALS['db']->query($sql) ? true : false;
        }catch(Exception $e){

        }
        return $ret;
    }

    public static function DeleteOneMessage($msg_id){
        try{
            $sql = 'delete from'.$GLOBALS['ecs']->table('message').'where id = '.$msg_id;
            $ret = $GLOBALS['db']->query($sql) ? true : false;
        }catch(Exception $e){

        }
        return $ret;
    }

} 