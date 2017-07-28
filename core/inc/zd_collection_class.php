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
 * 收藏逻辑类
*/
class zd_collection_class{

	/**
	 * 获取用户收藏信息
	 * @param int $user_id 用户id
	 * @param string $type 收藏类型
	 * @return array
     * @author huangbin
     * @access public 
	*/
	public static function _get_collection_info($user_id,$page,$size,$type = ""){
		//加载zd_db_collection_class类库
		$collection_obj = zd_core::instance('zd_db_collection_class');
		//加载zd_db_goods_class类库
		zd_core::autoload('zd_db_goods_class');
		//加载zd_common_class类库
		zd_core::autoload('zd_common_class');
		//加载zd_db_app_class类库
		zd_core::autoload('zd_db_app_class');		
		//实例化获取资源中心数据类
		$resource_obj = zd_core::instance('zd_resource_class');
		//获取收藏基础信息
		$collection_info = $collection_obj->_get_user_collection($user_id,$page,$size,$type);
		//遍历信息数组,进行数据重构
		foreach ($collection_info['collection'] as $k => $v) {
			//收藏产品类型
			$o_type = $v['obj_type'];
			//软件产品
			if ($o_type == 'soft') {
				//软件产品id
				$goods_id = $v['obj_id'];
				//软件产品信息数组
				$goods_info = zd_db_goods_class::_get_goods_info_by_id($goods_id);
				//产品名称
				$collection_info['collection'][$k]['name'] = $goods_info['goods_name'];
				//图片地址
				$collection_info['collection'][$k]['img_url'] = zd_common_class::_convert_url_in_string($goods_info['original_img']);
				//详情地址
				$collection_info['collection'][$k]['url'] = 'sfw.php?do=goods&id='.$goods_id;
				//上下架状态
				$collection_info['collection'][$k]['on_sale'] = $goods_info['is_on_sale'];
			}
			//应用产品
			if ($o_type == 'app') {
				//应用id
				$app_id = $v['obj_id'];
				//应用信息数组
				$app_info = zd_db_app_class::_get_app_detail($app_id);
				//应用名称
				$collection_info['collection'][$k]['name'] = $app_info['app_name'];
				//图片地址
                //问题原因：我的收藏——在线应用LOGO图标不显示
                //修改说明：时空信息云平台后台发布在线应用保存的logo地址为图片全路径，不需要再拼接文件服务器服务地址
                //修改时间：2017.1.11
                //修改人员：yKAN
                //$collection_info['collection'][$k]['img_url'] = $GLOBALS['file_server_base_url'].$app_info['logo_image'];
                $collection_info['collection'][$k]['img_url'] = $app_info['logo_image'];
				//详情地址
				$collection_info['collection'][$k]['url'] = 'app.php?act=detail&app_id='.$app_id;
				//应用类型
				$collection_info['collection'][$k]['app_type'] = $app_info['app_type'];
				//外部应用地址
				$collection_info['collection'][$k]['app_url'] = $app_info['app_url'];
				//云主机id
				$collection_info['collection'][$k]['host_id'] = $app_info['host_id'];
				//上下架状态
				$collection_info['collection'][$k]['on_sale'] = $app_info['is_on_sale'];
			}
			//地图服务
			if($o_type == 'map'){
				//地图服务id
				$s_id = $v['obj_id'];
				/* 地图服务详细信息 begin */

				//调用函数
				$map_info_arr = $resource_obj->_get_map_detail_by_sid($s_id);
				if ($map_info_arr['success']) {
					//服务器ip
					$host_ip = gethostbyname($_SERVER["SERVER_NAME"]);
					//服务名称
					$collection_info['collection'][$k]['name'] = $map_info_arr['data'][0]['name'];
					//服务类型
					$collection_info['collection'][$k]['map_type'] = $map_info_arr['data'][0]['type'];
					//预览地址
					if ($map_info_arr['data'][0]['preview_address']) {
						$collection_info['collection'][$k]['preview_address'] = "http://".$host_ip.$map_info_arr['data'][0]['preview_address'];
					}
					//平面预览地址
					if ($map_info_arr['data'][0]['surface_preview_address']) {
						$collection_info['collection'][$k]['surface_preview_address'] = "http://".$host_ip.$map_info_arr['data'][0]['surface_preview_address'];
					}
					//球面预览地址
					if ($map_info_arr['data'][0]['globe_preview_address']) {
						$collection_info['collection'][$k]['globe_preview_address'] = "http://".$host_ip.$map_info_arr['data'][0]['globe_preview_address'];
					}
					//wfs服务基地址
					if ($map_info_arr['data'][0]['wfs_base_address']) {
						$collection_info['collection'][$k]['wfs_base_address'] = "http://".$host_ip.$map_info_arr['data'][0]['wfs_base_address'];
					}
					//wmts服务基地址
					if ($map_info_arr['data'][0]['wmts_base_address']) {
						$collection_info['collection'][$k]['wmts_base_address'] = "http://".$host_ip.$map_info_arr['data'][0]['wmts_base_address'];
					}	
					//wms服务基地址
					if ($map_info_arr['data'][0]['wms_base_address']) {
						$collection_info['collection'][$k]['wms_base_address'] = "http://".$host_ip.$map_info_arr['data'][0]['wms_base_address'];
					}	
					//服务详情地址
					if ($map_info_arr['data'][0]['detail_info_address']) {
						$collection_info['collection'][$k]['detail_info_address'] = "http://".$host_ip.$map_info_arr['data'][0]['detail_info_address'];
					}						
				}

				/* end */
			}
			$collection_info['collection'][$k]['type'] = $o_type;
			/* 获取收藏总量 */
			$collection_count = $collection_obj->_get_collection_count('',$o_type,$v['obj_id']);
			$collection_info['collection'][$k]['count'] = $collection_count;
		}

		return $collection_info;
	}

	public static function get_collection_info($user_id,$page,$size,$type = ""){

			$ip = trim($GLOBALS['iggs_api_url_base_url']);
			
			$api_url = $ip."ecs/getcollection";
            //加载zd_common_class类库
			$api_url_s = $api_url."?user_id=".$user_id."&page=".$page."&page_size=".$size."&type=".$type;
            
            zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

            $result = json_decode($message_result,true);

            return $result;
	}

	public static function do_collection($obj_id,$user_id,$obj_type){
			$ip = trim($GLOBALS['iggs_api_url_base_url']);

			$api_url = $ip."ecs/do/collection";
            //加载zd_common_class类库
			$api_url_s = $api_url."?obj_id=".$obj_id."&user_id=".$user_id."&obj_type=".$obj_type;

			zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

            $result = json_decode($message_result,true);

            return $result;
	}

	public static function cancle_collection($c_id,$obj_type,$obj_id){
			$ip = trim($GLOBALS['iggs_api_url_base_url']);

			$api_url = $ip."ecs/cancle/collection";
            //加载zd_common_class类库
			$api_url_s = $api_url."?c_id=".$c_id."&obj_type=".$obj_type."&obj_id=".$obj_id;

			zd_core::autoload('zd_common_class');
            //发送请求
            $message_result = zd_common_class::_send_get($api_url_s);

            $result = json_decode($message_result,true);

            return $result;
	}

}