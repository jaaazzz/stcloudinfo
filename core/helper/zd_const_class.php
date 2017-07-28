<?php
// +----------------------------------------------------------------------
// | zdcyber
// +----------------------------------------------------------------------
// | Copyright (c) 2011-2016
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: yuakng
// +----------------------------------------------------------------------

/**
 * 云主机配置类库
*/
class zd_const_class {

   const APP_DISCARD = -1;
    const APP_SAVED = 1;
    const APP_PUBLISHING = 2;
    const APP_PUBLISH_SUCCESS = 4;
    const APP_PUBLISH_FAILED = 5;
    const APP_EXECUTE_INSTALL = 6;
    const APP_CHECKING = 8;
    const APP_CHECK_SUCCESS = 9;
    const APP_CHECK_FAIL = 10;
    const APP_ON_SALE = 12;
    const APP_SALE_OUT = 16;
    /*
     *   已保存=>部署中(提交)=>部署成功=>应用执行安装=>审核中=>审核通过 =>云主机状态
     *                       部署失败               审核不通过
     * */
    public static $AppStatus = array(
        -1=>"丢弃的",
        1=>"已保存",
        2=>"云主机创建中",
        4=>"云主机创建成功(等待部署与审核)",
        5=>"云主机创建失败",
        6=>"待审核",//应用执行安装中,但是无法知道安装是否结束
        8=>"审核中",
        9=>"审核通过",
        10=>"审核不通过",
        12=>"已上架",
        16=>"已下架"
    );

    const REGION_DISCARD = -1;
    const REGION_SAVED = 1;
    const REGION_CHECKING = 4;
    const REGION_CHECK_SUCCESS = 5;
    const REGION_CHECK_FAIL = 6;

    /*
     *   已提交=>审核中=>审核通过
     *                  审核不通过
     *
     * */
    public static $RegionStatus = array(
        -1=>"丢弃的",
        1=>"已提交",
        4=>"审核中",
        5=>"审核通过",
        6=>"审核不通过"
    );

    //云主机类型
    const CLOUD_HOST_MAPGIS = 1;
    const CLOUD_HOST_ALIBABA = 2;
    const CLOUD_HOST_NONE = 0;

    public static $CloudHostType = array(1=>"中地自建云主机",2=>"阿里云主机");

    //集成应用类型
    const APP_TYPE_DESKTOP = 1;
    const APP_TYPE_WEB = 2;
    const APP_TYPE_MOBILE = 3;

    public static $AppTypeDes = array(1=>"桌面应用",2=>"Web应用",3=>"移动应用");
}
?>