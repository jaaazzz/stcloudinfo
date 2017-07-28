<?php
/**
 * Created by PhpStorm.
 * User: yukang
 * Date: 16-4-10
 * Time: 下午7:08
 * introdution:分类操作类
 */

/**
 * 分类操作类
 */
class zd_db_categroy_class extends zd_db_base_class
{

    /* 构造函数 */
    public function __construct()
    {

    }

    /**
     * 获取分类的列表
     *
     * @access  public
     * @return  $data
     */
    public static function _get_categroy_list()
    {
//        //$log_info = $GLOBALS['_LANG']['log_action'][$action] . $GLOBALS['_LANG']['log_action'][$content] .': '. addslashes($sn);
//        $sql = 'select l.*,u.user_name from ' . $GLOBALS['ecs']->table('app_category') . ' l left join '
//            . $GLOBALS['ecs']->table('admin_user') . ' u on l.add_userid=u.user_id where 1=1 and is_delete=0';
//
//        $sql .= ' order by app_order asc';
//
//        //$data = $GLOBALS['db']->getAllCached($sql);
//        $data = $GLOBALS['db']->getAll($sql);
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/categorylist";

        zd_core::autoload("zd_common_class");

        $result = zd_common_class::_send_get($api_url);

        $data = json_decode($result,true)['category'];

        foreach($data as $key=>$val){
            $data[$key]['date'] = local_date('Y-m-d H:i:s',$val['addTime']);
        }

        return $data;
    }

    public static function _get_categroy_list_by_application()
    {
        $sql = "SELECT C.*,U.user_name FROM ".$GLOBALS['ecs']->table('app_category')." C".
            " left join " . $GLOBALS['ecs']->table('admin_user') . " U on C.add_userid=U.user_id".
            " WHERE C.id IN (". "SELECT DISTINCT A.category FROM".$GLOBALS['ecs']->table('application')." A".
            " WHERE A.hidden =0 AND A.is_on_sale =1 AND A.status =3 AND A.app_type =3 )";

        $sql .= " ORDER BY C.app_order ASC";

        $data = $GLOBALS['db']->getAll($sql);

        foreach($data as $key=>$val){
            $data[$key]['date'] = local_date('Y-m-d H:i:s',$val['add_time']);
        }

        return $data;
    }

    public static function get_categroy_list_by_application($category,$status,$user_id,$is_on_sale,$page=1,$page_size=10,$search='',$app_type='')
    {
        $ip = trim($GLOBALS['iggs_api_url_base_url']);

        $api_url = $ip."ecs/get/application";

        $api_url_s = $api_url."?category=".$category."&status=".$status."&user_id=".$user_id."&is_on_sale=".$is_on_sale."&page=".$page."&page_size=".$page_size."&search=".$search."&app_type=".$app_type;
        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $message_result = zd_common_class::_send_get($api_url_s);

        $result = json_decode($message_result,true);

        return $result;
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
        $admin_id = !empty($admin_id) ? $admin_id : (isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : 0);
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
}

?>