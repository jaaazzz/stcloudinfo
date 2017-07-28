<?php
/**
 * Created by PhpStorm.
 * User: yukang
 * Date: 16-4-10
 * Time: 下午7:08
 * introdution:分类操作类
 */

/**
 * 应用权限操作列类
 */
class zd_db_app_power_class extends zd_db_base_class
{

	 /**
     *添加应用权限操
     *create  at 2016-05-06
     * @author yukang
     * @param (必填)string $app_id 
     * @param (必填)int $user_id  给予应用权限用户id
     * @return 返回值：true/flase
     **/
    public static function _create_app_power($app_id,$user_id)
    {
		$update_app_power = array(
				'app_id'          => $app_id,
				'user_id'         => $user_id,
				'created'      	  => date('Y-m-d H:i:s',time()),
                'hidden'          => 0
				);
		insert_to_db( 'app_power',$update_app_power);
    }
	 /**
	 *修改应用权限操
	 *create  at 2016-05-06
	 * @author yukang
	 * @param (必填)update_app array()修改参数
	 * @param (必填)int $app_id  
	 **/
    public static function _update_app_power($app_id,$update_app_power)
    {
        $update_sql = "
                    UPDATE " . $GLOBALS["ecs"]->table("app_power") . " 
                    SET " . hash_to_sql($update_app_power) . "
                    WHERE app_id = '$app_id';";
        return $GLOBALS["db"]->query($update_sql);
    }
        /**
     *create  at 2016-05-27
     * @author yukang
     * @param (必填)string $app_id 用户id
     * @return 返回值：array()
     **/
    public static function _get_app_power_list($app_id)
    {
        $where = "a.hidden = 0 and a.app_id=$app_id";

        $sql = "
                SELECT a.*,u.user_name
                FROM {$GLOBALS[ecs]->table('app_power')} AS a
                left join {$GLOBALS[ecs]->table('users')} AS u on a.user_id=u.user_id
                WHERE $where
                ORDER BY a.id desc
                ";
        $result = $GLOBALS['db']->getAll($sql);
        return $result;

    }
}
?>