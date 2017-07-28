<?php 

//php性能测试工具
class xhprof_test
{
 	var $is_on = false;

	function __construct($is_xhprof_on)
	{
		$this->is_on = $is_xhprof_on;

		if($this->is_on)
		{
			$this->start();
		}		
	}

	function start()
	{
		//xhprof_enable(); 
		//xhprof_enable(XHPROF_FLAGS_NO_BUILTINS); //不记录内置的函数
		xhprof_enable(XHPROF_FLAGS_CPU + XHPROF_FLAGS_MEMORY);  //同时分析CPU和Mem的开销
	}

	function stop()
	{
		if($this->is_on)
		{
			$xhprof_data = xhprof_disable();
			$xhprof_root = '/var/www/xhprof/';
			include_once $xhprof_root."xhprof_lib/utils/xhprof_lib.php"; 
			include_once $xhprof_root."xhprof_lib/utils/xhprof_runs.php"; 
			$xhprof_runs = new XHProfRuns_Default(); 
			$run_id = $xhprof_runs->save_run($xhprof_data, "appcloud");
			echo '<div style="text-align:center;"><a href="http://192.168.83.188/xhprof/xhprof_html/index.php?run='.$run_id.'&source=appcloud" target="_blank">统计</a></div>';
		}
	}
}

$xhprof = new xhprof_test($GLOBALS['is_xhprof_on']);
