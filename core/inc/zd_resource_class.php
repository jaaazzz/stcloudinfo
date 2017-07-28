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
// | Desc: 资源中心相关获取数据类
// +----------------------------------------------------------------------

/**
 * 资源中心相关获取数据类
*/
class zd_resource_class{
	/**
     * 初始化
     */
    public function __construct(){

    }

    //默认每页个数
    const PAGE_SIZE = "10";
    //默认范例工程类型id
    const MODEL_id = "8";

    /**
     * 获取范例工程数据
     * @access public
     * @param int $p 页码
     * @param int $page_size 每页显示条数
     * @return array
     * @author huangbin
    */
    public function _get_res_model_project($p = 1,$page_size = 0){
    	//获取资源服务地址
		$api_url = isset($GLOBALS['smaryun_api_url_base_url']) ? trim($GLOBALS['smaryun_api_url_base_url']) : "http://www.smaryun.com/";
		//构造url
		$api_url_s = $api_url."dev/itemlist/".self::MODEL_id."/".$p."/".((is_null($page_size) || empty($page_size) || $page_size <= 0) ? self::PAGE_SIZE : $page_size);
		//代理服务地址(正式部署需设为空)
		$proxy_url = "http://192.168.83.135:808";
		//读取缓存
		$cache_res = read_static_cache('model_res');
		if ($cache_res === false) {
			//加载zd_common_class类库
			zd_core::autoload('zd_common_class');
			//发送请求
			$resource_result = zd_common_class::_send_get($api_url_s,$proxy_url);
			//数据数组
			$resource_result_arr = json_decode($resource_result,true);
			/* 遍历重新构造数据数组 begin */
			//初始化返回数据
			$return_arr = array();
			//初始化要构造的数据数组
			$arr = array();
			foreach ($resource_result_arr['items'] as $k => $v) {
				//资源标题
				$arr[$k]['title'] = $v['title'];
				//资源描述
				$arr[$k]['desc'] = $v['introtext'];
	            //点击次数
	            $arr[$k]['hits'] = $v['hits'] ? $v['hits'] : 0;
	            //更新时间
	            $arr[$k]['modified'] = $v['modified'] ? date('Y-m-d',strtotime($v['modified'])) : '';
				/* 下载链接 begin */
				if (count($v['attachments']) > 0) {
					$link_url = !empty($v['attachments'][0]['link']) ? $v['attachments'][0]['link'] : $v['attachments'][0]['rlink'];
					$arr[$k]['link'] = $api_url.$link_url;
				}
				/* end */
				//资源图片
				$arr[$k]['imageUrl'] = $api_url.$v['image'];
				/* 在线演示地址 begin */
				if (!empty($v['extra_fields'])) {
					$extra_arr = json_decode($v['extra_fields'],true);
					foreach ($extra_arr as $k1 => $v1) {
						if ($v1['value'][0] == "在线预览") {
							$arr[$k]['online'] = $v1['value'][1];
						}	
					}
				}
				/* end */
			}
			write_static_cache('model_res',$arr);
		}
		$arr = $cache_res;
		/* end */
		$return_arr['items'] = $arr;
		$return_arr['count'] = $resource_result_arr['allitemcount'];
		//返回数据
		return $return_arr;
    }

    /**
     * 根据文档id获取文档数据
     * @access public
     * @param int $doc_id 文档id
     * @return array
     * @author huangbin
    */
    public function _get_res_doc_by_id($doc_id){
    	//获取资源服务地址
		$api_url = isset($GLOBALS['smaryun_api_url_base_url']) ? trim($GLOBALS['smaryun_api_url_base_url']) : "http://www.smaryun.com/";
		//构造url
		$api_url_s = $api_url."dev/item/".$doc_id;
		//代理服务地址(正式部署需设为空)
		$proxy_url = "http://192.168.81.213:808";
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//发送请求
		$resource_result = zd_common_class::_send_get($api_url_s,$proxy_url);
		//数据数组
		$resource_result_arr = json_decode($resource_result,true);
		//初始化返回数据
		$return_arr = array();
		if ($resource_result_arr['item']) {
			//标题
			$return_arr['title'] = $resource_result_arr['item']['title'];
			/* 文档预览地址 */
			if (!empty($resource_result_arr['item']['attachments'][0]['rlink'])) {
				$return_arr['rlink'] = $resource_result_arr['item']['attachments'][0]['rlink'];
			}
			/* 文档下载地址 */
			if (!empty($resource_result_arr['item']['attachments'][0]['link'])) {
				$return_arr['link'] = $api_url.$resource_result_arr['item']['attachments'][0]['link'];
			}
			/* 文档名称 */
			if (!empty($resource_result_arr['item']['attachments'][0]['filename'])) {
				$return_arr['filename'] = $resource_result_arr['item']['attachments'][0]['filename'];
			}				
		}
		return $return_arr;
    }

    /**
     * 获取iggs地图服务资源数据
     * @access public
     * @param int $p 页码
     * @param int $user_id 用户id
     * @param string $obj_type 收藏类型
     * @param int $page_size 每页显示条数
     * @return array
     * @author huangbin
    */
    public function _get_iggs_map_service($p = 1,$user_id = 0,$obj_type = '',$page_size = 0){
    	//获取资源服务地址
		$api_url = isset($GLOBALS['iggs_api_url_base_url']) ? trim($GLOBALS['iggs_api_url_base_url']) : "http://192.168.83.226:8181/rest/api/";
		//构造url
		$api_url_s = $api_url."service/query?pageSize=".((is_null($page_size) || empty($page_size) || $page_size <= 0) ? self::PAGE_SIZE : $page_size) ."&page=".$p;
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//发送请求
		$resource_result = zd_common_class::_send_get($api_url_s);
		//数据数组
		$resource_result_arr = json_decode($resource_result,true);
		if ($resource_result_arr['success']) {
			//服务器ip
			$host_ip = gethostbyname($_SERVER["SERVER_NAME"]);
            //初始化收藏实例对象
            $collection_obj = zd_core::instance('zd_db_collection_class',array('obj_type' => 'map'));
			foreach ($resource_result_arr['data'] as $k => $v) {
				//预览地址
				if ($v['preview_address']) {
					$resource_result_arr['data'][$k]['preview_address'] = "http://".$host_ip.$v['preview_address'];
				}
				//平面预览地址
				if ($v['surface_preview_address']) {
					$resource_result_arr['data'][$k]['surface_preview_address'] = "http://".$host_ip.$v['surface_preview_address'];
				}
				//球面预览地址
				if ($v['globe_preview_address']) {
					$resource_result_arr['data'][$k]['globe_preview_address'] = "http://".$host_ip.$v['globe_preview_address'];
				}
				//wfs服务基地址
				if ($v['wfs_base_address']) {
					$resource_result_arr['data'][$k]['wfs_base_address'] = "http://".$host_ip.$v['wfs_base_address'];
				}
				//wmts服务基地址
				if ($v['wmts_base_address']) {
					$resource_result_arr['data'][$k]['wmts_base_address'] = "http://".$host_ip.$v['wmts_base_address'];
				}	
				//wms服务基地址
				if ($v['wms_base_address']) {
					$resource_result_arr['data'][$k]['wms_base_address'] = "http://".$host_ip.$v['wms_base_address'];
				}
				//地图服务详细地址
				if ($v['detail_info_address']) {
					$resource_result_arr['data'][$k]['detail_info_address'] = "http://".$host_ip.$v['detail_info_address'];
				}
				/* 判断是否已被用户收藏 begin */

				//是否已被当前用户收藏
				$resource_result_arr['data'][$k]['is_collection'] = $collection_obj->is_collection($v['sid'],$user_id,$obj_type);
				/* end */			

				//此地图服务的收藏总数
				$resource_result_arr['data'][$k]['collection_count'] = $collection_obj->get_collection_count('','map',$v['sid']);

				/* 此地图申请的api的tokens值 begin */
				$token_arr = $this->_get_tokens_by_uid($user_id);
				if (count($token_arr) > 0) {
					$resource_result_arr['data'][$k]['token_str'] = $token_arr;				
				}
				/* end */
			}
		}
		return $resource_result_arr;
    }

    /**
     * 获取服务id获取iggs地图服务详细信息
     * @access public
     * @param int $sid 服务id
     * @return array
     * @author huangbin
    */   
    public function _get_map_detail_by_sid($sid){
    	//获取资源服务地址
		$api_url = isset($GLOBALS['iggs_api_url_base_url']) ? trim($GLOBALS['iggs_api_url_base_url']) : "http://192.168.83.226:8181/rest/api/";
		//构造url
		$api_url_s = $api_url."service/query?sid=".$sid;
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//发送请求
		$resource_result = zd_common_class::_send_get($api_url_s);
		//数据数组
		$resource_result_arr = json_decode($resource_result,true);
		return $resource_result_arr;
    }

    /**
     * 获取用户地图服务api申请tokens
     * @param $user_id 用户id
     * @return mixed
     * @author huangbin
    */
    public function _get_tokens_by_uid($user_id){
    	//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
    	//加载zd_db_users_class类库
		zd_core::instance('zd_db_users_class');
		//用户信息
		$user_info = zd_db_users_class::get_user_info_by_id($user_id);
		//用户uc_id
		$uc_id = $user_info['uc_id'];
		//获取资源服务地址
		$api_url = isset($GLOBALS['iggs_api_url_base_url']) ? trim($GLOBALS['iggs_api_url_base_url']) : "http://192.168.83.226:8181/rest/api/";
		//构造获取用户token的url
		$api_url_t = $api_url."user/token/info?uc_id=".$uc_id;
		//发送请求
		$resource_result = zd_common_class::_send_get($api_url_t);
		//数据数组
		$resource_result_obj = json_decode($resource_result,true);
		//返回数据数组初始化
		$return_arr = array();
		foreach ($resource_result_obj['tokens'] as $k => $v) {
			$token = $v['token'];
			array_push($return_arr, $token);
		}
		return $return_arr;
    }

    /**
     * 根据用户id和token验证信息获取iggs地图服务资源数据
     * @access public
     * @param int $user_id 用户id
     * @return array
     * @author liuruoli
     */
    public function _get_iggs_map_service_by_userandtoken($user_id )
    {
        //获取资源服务地址
        $api_url = isset($GLOBALS['iggs_api_url_base_url']) ? trim($GLOBALS['iggs_api_url_base_url']) : "http://192.168.83.226:8181/rest/api/";

        if ($user_id > 0) {
            //构造url
            $api_url_s = $api_url . "service/online_map_info?uc_id=" . $user_id;
        }
        else{
            $api_url_s = $api_url . "service/online_map_info?uc_id=0";
        }
        //测试使用
        $api_url_s = $api_url . "service/online_map_info?uc_id=0";

        //加载zd_common_class类库
        zd_core::autoload('zd_common_class');
        //发送请求
        $resource_result = zd_common_class::_send_get($api_url_s);
        //数据数组s
        $resource_result_arr = json_decode($resource_result, true);
        if ($resource_result_arr['success']) {
            //服务器ip
            $host_ip = gethostbyname($_SERVER["SERVER_NAME"]);
            //初始化收藏实例对象
            $collection_obj = zd_core::instance('zd_db_collection_class', array('obj_type' => 'map'));
            foreach ($resource_result_arr['data'] as $k => $v) {
                //预览地址
                if ($v['preview_address']) {
                    $resource_result_arr['data'][$k]['preview_address'] = "http://" . $host_ip . $v['preview_address'];
                }
                //平面预览地址
                if ($v['surface_preview_address']) {
                    $resource_result_arr['data'][$k]['surface_preview_address'] = "http://" . $host_ip . $v['surface_preview_address'];
                }
                //球面预览地址
                if ($v['globe_preview_address']) {
                    $resource_result_arr['data'][$k]['globe_preview_address'] = "http://" . $host_ip . $v['globe_preview_address'];
                }
                //wfs服务基地址
                if ($v['wfs_base_address']) {
                    $resource_result_arr['data'][$k]['wfs_base_address'] = "http://" . $host_ip . $v['wfs_base_address'];
                }
                //wmts服务基地址
                if ($v['wmts_base_address']) {
                    $resource_result_arr['data'][$k]['wmts_base_address'] = "http://" . $host_ip . $v['wmts_base_address'];
                }
                //wms服务基地址
                if ($v['wms_base_address']) {
                    $resource_result_arr['data'][$k]['wms_base_address'] = "http://" . $host_ip . $v['wms_base_address'];
                }
                /* 判断是否已被用户收藏 begin */

                //是否已被当前用户收藏
                $resource_result_arr['data'][$k]['is_collection'] = $collection_obj->is_collection($v['sid'], $user_id);
                /* end */

                //此地图服务的收藏总数
                $resource_result_arr['data'][$k]['collection_count'] = $collection_obj->get_collection_count('', 'map', $v['sid']);
            }
        }
        return $resource_result_arr;
    }

}