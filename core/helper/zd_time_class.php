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
 * 时间函数库类
*/
class zd_time_class {

    /**
     * 购买时计算开始时间,从第二天凌晨开始算起
     * @access public
     * @return int
     */
    public static function _calculate_start_time(){
        $now_time = time();
        //转换成当天的零点
        $add_time = date('Y-m-d 00:00:00',$now_time);
        //转换成第二天凌晨时间
        //$result_time = strtotime($add_time)+ 1 * 24 * 3600;
        $result_time = strtotime($add_time);
        //返回结果
        return $result_time;
    }   

    /**
     * 根据开始时间和使用周期计算结束时间
     * @access public
     * @param int $start_time 开始时间
     * @param int $period 期限
     * @param string 期限类型
     * @return int
     */   
    public static function _calculate_end_time($start_time, $period, $period_type = "month")
    {    
        $end_time = 0;

        if($period_type == "month")
        {
            $end_time = self::_calculate_end_time($start_time,MONTH_LENGTH * $period,'day');
        }
        elseif($period_type == "day")
        {
            // $end_time = $start_time + ($period)* 24 * 3600 - 1;
            $end_time = $start_time + ($period)* 24 * 3600 ;
        }

        return $end_time;
    }

    /**
     * 秒数转换成天数
     * @author huangbin
     * @access public 
     * @param int $second 要转换的秒数
     * @return int
    */
    public static function second_to_day($second)
    {
        $days = $second / (1.0 * 24 * 60 * 60);
        return intval($days > 0 ? $days : 0);
    }
}
?>