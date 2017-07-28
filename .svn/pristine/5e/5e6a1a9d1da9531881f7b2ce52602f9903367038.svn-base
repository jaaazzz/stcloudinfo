<?php
/**
 * Created by PhpStorm.
 * User: sdd
 * Date: 16-4-5
 * Time: 下午7:08
 * introdution:分类操作类
 */

/**
 * 分类操作类
 */
class zd_admin_categroy_class
{

    /* 构造函数 */
    public function __construct()
    {

    }

    /**
     * 添加分类
     *
     * @access  public
     * @param   string      $action     分类名称
     * @return  void
     */
    public static function create_categroy($cate_name,$order,$admin_id='')
    {
        //$log_info = $GLOBALS['_LANG']['log_action'][$action] . $GLOBALS['_LANG']['log_action'][$content] .': '. addslashes($sn);
        $admin_id = !empty($admin_id) ? $admin_id : (isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : 0);
        $sql = 'INSERT INTO ' . $GLOBALS['ecs']->table('app_category') . ' (add_time, add_userid, app_order, name, is_delete) ' .
            " VALUES ('" . gmtime() . "', '$admin_id', '$order', '". stripslashes($cate_name) . "', '0')";
        $GLOBALS['db']->query($sql);
    }

    /**
     * 添加分类
     *
     * @access  public
     * @param   string      $action     分类名称
     * @return  void
     */
    public static function update_categroy($id,$cate_name,$order=0,$status=0,$admin_id='')
    {
        //$log_info = $GLOBALS['_LANG']['log_action'][$action] . $GLOBALS['_LANG']['log_action'][$content] .': '. addslashes($sn);
        $admin_id = !empty($admin_id) ? $admin_id : (isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : 0);
//        $sql = 'update ' . $GLOBALS['ecs']->table('app_category') . ' set add_time='', add_userid, order, name, is_delete) ' .
//            " VALUES ('" . gmtime() . "', '$admin_id', '0', '". stripslashes($cate_name) . "', '".$status."')";
//        $GLOBALS['db']->query($sql);
        $where = array(
            'id' => $id
        );
        $categroy=array(
            'add_time' => gmtime(),
            'add_userid' => $admin_id,
            'app_order'    => $order,
            'name'     => stripslashes($cate_name),
            'is_delete'=> $status
        );

        $GLOBALS['db']->update($GLOBALS['ecs']->table('app_category'),$categroy,$where);

    }

    /**
     * 获取分类的列表
     *
     * @access  public
     * @return  $data
     */
    public static function get_categroy_list()
    {
        //$log_info = $GLOBALS['_LANG']['log_action'][$action] . $GLOBALS['_LANG']['log_action'][$content] .': '. addslashes($sn);
        $sql = 'select l.*,u.user_name from ' . $GLOBALS['ecs']->table('app_category') . ' l left join '
            . $GLOBALS['ecs']->table('admin_user') . ' u on l.add_userid=u.user_id where 1=1 and is_delete=0';

        $sql .= ' order by app_order asc';

        $data = $GLOBALS['db']->getAll($sql);

        foreach($data as $key=>$val){
            $data[$key]['date'] = local_date('Y-m-d H:i:s',$val['add_time']);
        }

        return $data;
    }
}

?>