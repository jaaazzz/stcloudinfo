<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-3-31
 * Time: 下午3:49
 * intrduction:管理员操作类
 */

/**
 * 应用操作类
 */
class zd_admin_log_class
{

    /* 构造函数 */
    public function __construct()
    {

    }

    /**
     * 记录管理员的操作内容
     *
     * @access  public
     * @param   string      $action     操作的模块 传递模块名称即可
     * @param   string      $content    操作的内容
     * @return  void
     */
    public static function create_admin_log($action, $content='')
    {
        //$log_info = $GLOBALS['_LANG']['log_action'][$action] . $GLOBALS['_LANG']['log_action'][$content] .': '. addslashes($sn);
        $admin_id = isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : 0;
        $sql = 'INSERT INTO ' . $GLOBALS['ecs']->table('admin_log') . ' (log_time, user_id, log_module, log_info, ip_address) ' .
            " VALUES ('" . time() . "', '$admin_id', '". stripslashes($action) . "', '". stripslashes($content) . "', '" . real_ip() . "')";
        $GLOBALS['db']->query($sql);
    }

    /**
     * 获取管理员的操作记录
     *
     * @access  public
     * @return  $data
     */
    public static function get_admin_log($page=1,$page_size=10,$date='',$edate='',$username='', $logmodule='',$info='')
    {
        //$log_info = $GLOBALS['_LANG']['log_action'][$action] . $GLOBALS['_LANG']['log_action'][$content] .': '. addslashes($sn);
        $sql = 'select l.*,u.user_name from ' . $GLOBALS['ecs']->table('admin_log') . ' l left join '
            . $GLOBALS['ecs']->table('admin_user') . ' u on l.user_id=u.user_id where 1=1 ';

        $start_mun = ($page - 1) * $page_size;
        if(!empty($date)){
            $date1=$date.' 00:00:00';
            $sql .= " and FROM_UNIXTIME(l.log_time,'%Y-%m-%d %H:%m:%s')>='{$date1}' ";
        }
        if(!empty($edate)){
            $date2=$edate.' 23:59:59';
            $sql.=" and FROM_UNIXTIME(l.log_time,'%Y-%m-%d %H:%m:%s')<='{$date2}' ";
        }
        if(!empty($username)){
            $sql .= " and u.user_name like '%"  . $username . "%' ";
        }
        if(!empty($logmodule)){
            $sql .= " and l.log_module like '%"  . $logmodule . "%' ";
        }
        if(!empty($info)){
            $sql .= " and l.log_info like '%"  . $info . "%' ";
        }

        $data = $GLOBALS['db']->getAll($sql);

        $count = count($data);

        $sql .= ' order by log_time desc';
        $sql .= ' LIMIT '. $start_mun . ','. $page_size;
        $data = $GLOBALS['db']->getAll($sql);
        foreach($data as $key=>$val){
            $data[$key]['date'] = local_date('Y-m-d H:i:s',$val['log_time']);
        }

        $result['list']  = $data;
        $result['count'] = $count;
        return $result;
    }
}

?>