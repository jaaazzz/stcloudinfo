<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: huangbin
// +----------------------------------------------------------------------

/**
 * 引导类 
*/
 class zd_admin_core
 {
 	// 实例化对象
    private static $_instance = array();
    //可调用类的文件夹名
    private static $classDir = array('sys','helper');

    public function __construct(){

    }

    /**
     * 类库自动加载
     * @param string $classname 类名
    */
    public static function admin_autoload($classname){
    	if (isset($classname)) {
            $cDir = self::$classDir;
            foreach ($cDir as $v) {
                //类文件路径
                $classFilePath = dirname(__FILE__).'/'.$v.'/'.$classname.'.php';
                //存在此类文件
                if(file_exists($classFilePath)){
                    require($classFilePath);
                    break;
                }
            }
        }
    }

    /**
     * 取得对象实例
     * @param string $class 对象类名
     * @param string $method 类的静态方法名
     * @return object
     */
    public static function instance($class,$method='') {
        //注册AUTOLOAD方法,在进行调用类时执行autoload方法
        spl_autoload_register("self::admin_autoload");
    	//对象实例标识
    	$identify = $class.$method;
    	if(!isset(self::$_instance[$identify])) {
    		$o = new $class();
            if(!empty($method) && method_exists($o,$method)){
                self::$_instance[$identify] = call_user_func(array(&$o, $method));
            }
            else{
            self::$_instance[$identify] = $o;
            }
    	}
        return self::$_instance[$identify];
    }
 } 
?>