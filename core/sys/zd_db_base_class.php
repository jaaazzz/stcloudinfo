<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------

/**
 * 数据库表操作基础类
*/
abstract class zd_db_base_class {

	//初始化
	public function __construct(){

	}

	/**
	 * 执行account_ex表插入数据
	 * @param array $item 要插入的数组数组
	 * @access public
	 * @author huangbin
	 * @return int
	*/
	public function _insert_table($item,$table_name){
		//执行并返回执行结果
    	$GLOBALS['db']->autoExecute($GLOBALS['ecs']->table($table_name), $item, 'INSERT');
    	//返回id
    	return $GLOBALS['db']->insert_id();
	}

	/**
	 * 将数组信息转换成字符串信息,主要用于更新操作
	 * @access public
	 * @author huangbin
	 * @param mixed $hash 字段信息数组
	 * @return string 
	*/
	public function _hash_to_string($hash)
	{
	    $str = "";
	    foreach ($hash as $key => $value)
	    {
	        $str .= " $key = '$value',";
	    }
	    return rtrim($str, ",");
	}

	/**
	 * 生成limit字符串
	 * @access public
	 * @author huangbin
	 * @param int $num 
	 * @param int $start
	 * @return string 
	*/	
	public function _select_limit($num = 0, $start = 0){
		//初始化sql
		$sql = '';
		if($num > 0)
        {
            if ($start == 0)
            {
                $sql .= ' LIMIT ' . $num;
            }
            else
            {
                $sql .= ' LIMIT ' . $start . ', ' . $num;
            }
        }
        return $sql;
	}
}

?>