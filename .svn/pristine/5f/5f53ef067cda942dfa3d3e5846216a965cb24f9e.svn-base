<?php 

/* 
 *	Tom 2013-7-5 9:40:49
 *  操作soap，获取权项信息
 */

if (!defined('IN_ECS'))
{
    die('Hacking attempt');
}

define('GEN_DEVELOPER_SN', -1);


class GIS_SERVICE{

    /**
     * wenbaolin 2014.4.22 modify
     * @param $myself_base_url
     * @param $cloud_dog_base_url        狗的内网地址
     * @param $cloud_dog_base_url_auto      狗的自动匹配地址（自动匹配内外网）
     */
    function __construct($myself_base_url, $cloud_dog_base_url,$cloud_dog_base_url_auto = null)
	{
		$this->service_url         = $cloud_dog_base_url . "/CDSAuthService/AuthService.asmx?wsdl";
		$this->vzd_lcc_service_url = $cloud_dog_base_url . "/CDSService/GetAuthService.aspx";

        $this->update_url = $myself_base_url . "/gis_api.php";

		$this->xml_service_url     = $cloud_dog_base_url . "/CDSService/GetAuthService.asmx?wsdl";

		$this->xml_base_path       = dirname(__FILE__) . '/temp/authxmls/';


        //{{
        //wenbaolin 2014.4.22 add
        if(is_null($cloud_dog_base_url_auto)){
            $cloud_dog_base_url_auto = $cloud_dog_base_url;
        }

        if(!is_dir($this->xml_base_path)){
        	mkdir($this->xml_base_path,0777);
        }

        $this->vzd_lcc_service_url_auto = $cloud_dog_base_url_auto . "/CDSService/GetAuthService.aspx";
        //}}
	}
    //公有云注册价格
    function register_price($xmlstr)
    {
        try
        {
            $client = new SoapClient($this->service_url);
            $param = array('authRequest'=>$xmlstr);
            $result = $client->RegisterPrice($param);
            return return_result(true,'',$result->RegisterPriceResult);
        }
        catch(Exception $e)
        {
            return return_result(false,$e->getMessage());
        }
    }
    //私有云注册价格
    function import_register_price($xmlstr)
    {
        try
        {
            $client = new SoapClient($this->service_url);
            $param = array('authRequest'=>$xmlstr);
            $result = $client->ImportPriceSignature($param);
            if(!strpos($result->ImportPriceSignatureResult, 'Success'))
                return return_result(true);
            else
                return return_result(false);
        }
        catch(Exception $e)
        {
            return return_result(false,$e->getMessage());
        }
    }

	/**
	 * 上传文件时获取权项id
	 * @param  string $name    文件名（汉字）
	 * @param  string $version 版本号
	 * @param  string $md5     文件的md5
	 * @return string          权项id
	 */	
	function register_item($name,$version,$md5)
	{		
		try
		{
			$client = new SoapClient($this->service_url);
			$param = array('PluginName'=>$name,'InitPluginNo'=>$version, 'PluginMd5'=>$md5);
			$result = $client->RegisterPlugin($param);
			$result = $result->RegisterPluginResult;

			$has_dul = intval($GLOBALS['db']->getOne("
				SELECT count(*) 
				FROM {$GLOBALS['ecs']->table('goods')} 
				WHERE weight_id = '$result' and is_on_sale = 1 and is_delete = 0"
			));

			if( ENVIRONMENT == 'development' )
			{
				return return_result(true,null,$result);
			}
			
			if($has_dul > 0)
			{
				return return_result(false,'file exists.');
			}

			if(check_guid_format($result))
			{
				return return_result(true,null,$result);
			}
			else
			{
				return return_result(false,'cloud dog return error:' . $result);
			}
		}
		catch(Exception $e)
		{
			return return_result(false,$e->getMessage());
		}
		
	}

	/**
	 * 权项更新
	 * @param  string $weight_id 权项id
	 * @param  string $version   新的版本号
	 * @param  string $md5       新的md5
	 * @return string            Success、Error（区分大小写）
	 */
	function update_item($weight_id,$version,$md5)
	{
		try
		{
			$client = new SoapClient($this->service_url);
			$param = array('AuthID'=>$weight_id,'NewPluginNo'=>$version, 'NewPluginMd5'=>$md5);
			$result = $client->UpdatePlugin($param);
			
			$result_str = $result->UpdatePluginResult;

			if($result_str == 'Success' || ENVIRONMENT == 'development')
			{
				return return_result(true);
			}
			else
			{
				return return_result(false,'cd return error:' . $result_str);
			}
		}
		catch(Exception $e)
		{
			return return_result(false,$e->getMessage());
		}
	}
	
	/**
	 * 订单serail_no号与serail_no的guid组号绑定
	 * @param  string $group_guid guid组号
	 * @param  string $auth_id    订单授权号serail_no
	 * @return string             Success、Error（区分大小写）
	 */
	function update_group_guid($group_guid,$auth_id)
	{
		try
		{
			$client = new SoapClient($this->service_url);
			$param = array('AuthID'=>$auth_id,'GroupNo'=>$group_guid);
			$result = $client->UpdateGroupNo($param);
			
			$result_str = $result->UpdateGroupNoResult;

			if($result_str == 'Success' || ENVIRONMENT == 'development')
			{
				return return_result(true);
			}
			else
			{
				return return_result(false,'cd return error:' . $result_str);
			}
		}
		catch(Exception $e)
		{
			return return_result(false,$e->getMessage());
		}
	}


	/**
	 * 注册打包的app
	 * @param  string $xml_str xml文件的内容
	 * @return string          授权id
	 */
	function register_app($xml_str)
	{
		try
		{
			$client = new SoapClient($this->service_url);
			$param = array('XmlFile'=>$xml_str);
			$result = $client->RegisterApplication($param);
			return $result->RegisterApplicationResult;
		}
		catch(Exception $e)
		{
			/* modify 如果出现异常,即返回false,并输出错误信息 begin */

			return return_result(false,$e->getMessage());
			//return $e->getMessage();

			/* modify end */
		}
	}

	/**
	 * 更新app
	 * @param  string $weight_id 授权号/权项id
	 * @param  string $xml_str   待更新的新的xml文件内容
	 * @return string            Success/Error
	 */
	function update_app($serail_no,$xml_str){
		try
		{
			$client = new SoapClient($this->service_url);
			$param = array('AuthID'=>$serail_no,'NewXmlFile'=>$xml_str);
			$result = $client->UpdateApplication($param);
			return $result->UpdateApplicationResult;
		}
		catch(Exception $e)
		{
			/* modify 如果出现异常,即返回false,并输出错误信息 begin */

			return return_result(false,$e->getMessage());
			//return $e->getMessage();

			/* modify end */
		}
	}

	function gen_developer_sn($user_id,$start_time,$end_time,$is_vip = false)
	{
		if( ! $user_id )
		{
			return return_result(false,'user id is 0.');
		}

		$user_name = get_user_by_id($user_id,'user_name');

        $this->clear_functions();

		$result = $this->register_update_app( GEN_DEVELOPER_SN, $user_name, $start_time, $end_time, array(), 6, 'register','',0,$is_vip);

		return $result;
	}

    function update_developer_sn($user_id,$sn,$start_time,$end_time,$is_vip = false)
    {
        if( ! $user_id )
        {
            return return_result(false,'user id is 0.');
        }

        $user_name = get_user_by_id($user_id,'user_name');

        $this->clear_functions();

        $result = $this->register_update_app( GEN_DEVELOPER_SN, $user_name, $start_time, $end_time, array(), 6, 'update',$sn ,0,$is_vip);

        return $result;
    }

	//usertype = gisstore OR devcenter
	function get_licence_version($cat_id, $user_type = 'gisstore',$dev_vip = false)
	{


		if( $cat_id == GEN_DEVELOPER_SN )
		{
			if($user_type == 'dev_mobile')
			{
				return '2.5.0';
			}
			else
			{
                //wenbaolin 2014.08.06 add
                //付费开发者(目前移动平台只有免费开发者)
                if($dev_vip)
                {
                    return '2.6.0';
                }
                else
                {
                    return '2.4.0';
                }

			}			
		}
		
		if($user_type == 'gisstore')
		{
			$cat_platform = $GLOBALS['gis']->get_platform($cat_id);

			if($cat_platform == 'mobile')
			{
				return '2.3.0';
			}
			else
			{
				return '2.0.0';
			}
		}		
	}

	function get_talk_period($cat_id, $user_type = 'gisstore')
	{
		if($cat_id == GEN_DEVELOPER_SN)
		{
			return 1;
		}
		else
		{
			return 5;
		}
	}

	/**
	 * 生成申请授权所需的xml文件
	 * @param string $storename 超市名称
	 * @param string $storeurl 超市网址
	 * @param string $starttime 工具或应用授权开始时间
	 * @param string $limittime 工具或应用授权结束时间
	 * @param string $plugin_serialno_arr 工具或应用所包含的插件授权码数组，这个数组是数据库查询结果，列名为weight_id
	 * @param string $price_group_id 产品所属功能组id
	 * @param string $scale_type 超大中小微类型
	 * @param boolean $dev_vip 是否付费开发者
	 * @return string  	 返回xml字符串
	 */
	function gen_lic_xml($user_name, $starttime, $limittime, $plugin_serialno_arr, $licence_version = '2.0.0',$talk_period = 5 ,$price_group_id = 0, $scale_type = 0, $dev_vip = false)
	{
		$plugins_xml_str = "";
		
		foreach ($plugin_serialno_arr as $item ) 
		{
			if(is_string($item))
			{
				$plugins_xml_str .= "<Plugin id=\"$item\"/>";
			}
			elseif($item['weight_id'])
			{
				$plugins_xml_str .= "<Plugin id=\"{$item['weight_id']}\"/>";
			}				
		}	

        //{{
        //wenbaolin 2014.09.20 modify
        // $temp_main_function = '1F333332';
        // $temp_sub_functions = ' F300000F 0000FFFF 0000FFFF 000FFFFF 000FFFFF 0000FFFF 00FFFFFF 0000FFFF 00FFFFFF 0000FFFF 000FFFFF 0000FFFF 0000FFFF 000FFFFF 000FFFFF 00FFFFFF ';

		//huangbin 2015.06.17 modify 普通开发者给的狗权限太大,默认功能号替换
		$temp_main_function = '12000002';
		$temp_sub_functions = ' F3000002 0003FF00 000001FF ';
		if ($dev_vip) {
			$temp_main_function = '1F333332';
			$temp_sub_functions = ' F300000F 0000FFFF 0000FFFF 000FFFFF 000FFFFF 0000FFFF 00FFFFFF 0000FFFF 00FFFFFF 0000FFFF 000FFFFF 0000FFFF 0000FFFF 000FFFFF 000FFFFF 00FFFFFF ';
		}
        if(!empty($this->main_function) &&
            !empty($this->sub_functions))
        {
            //主功能号和子功能号都定义了(都不为空),这直接使用,否则使用默认的
            $temp_main_function = $this->main_function;
            $temp_sub_functions = $this->sub_functions;
        }
        //}}

        //获取产品的并发,在线,在册用户数
        //huangbin 2015.02.03
         $function_user_group = $GLOBALS['db']->getRow("
        	SELECT concurrent_user,online_user,register_user
        	FROM {$GLOBALS['ecs']->table('base_price_ex')} 
        	WHERE price_group_id = '$price_group_id' and scale_type = '$scale_type'
        ");
         if ($function_user_group) {
         	$user_group_str = $function_user_group['concurrent_user'].','.$function_user_group['online_user'].','.$function_user_group['register_user'];
         }
         else{
         	$user_group_str = '1,1,1';
         }

		$xml_str = 
"<?xml version=\"1.0\" encoding=\"gb2312\"?>
<licence version=\"$licence_version\">
  	<Market name=\"SmarYun\">http://www.smaryun.com</Market>
  	<User>$user_name</User>
  	<MainFunction>$temp_main_function</MainFunction>
  	<SubFunctions>$temp_sub_functions</SubFunctions>
  	<StartTime>$starttime</StartTime>
  	<LimitTime>$limittime</LimitTime>
  	<AdvanceUserNum>$user_group_str</AdvanceUserNum>
  	<DataLimit>0</DataLimit>
  	<TalkPeriod>$talk_period</TalkPeriod>
  	<Plugins>
    	$plugins_xml_str
  	</Plugins>
</licence>
";
		
		return $xml_str;
	}

    /**
     * @param $order_sn
     * 根据ecs_account_statement表的order_sn字段获取对应产品的主功能号和子功能号
     */
    function get_functions($order_sn)
    {
        $this->main_function = '';
        $this->sub_functions = '';

        /*@$functions = $GLOBALS['db']->getAll(
            "SELECT base_price.main_function, base_price.sub_functions
	        FROM {$GLOBALS['ecs']->table('account_statement')} state, {$GLOBALS['ecs']->table('goods_base_price')} goods_price,
	        	{$GLOBALS['ecs']->table('base_price_group')} base_price
	        WHERE state.order_sn = '$order_sn' and
	        	state.goods_id = goods_price.goods_id and goods_price.price_group_id = base_price.id");*/
        @$functions = $GLOBALS['db']->getAll(
        	"SELECT base_price.main_function, base_price.sub_functions
        	FROM {$GLOBALS['ecs']->table('account_statement')} state, {$GLOBALS['ecs']->table('base_price_group')} base_price
        	WHERE state.order_sn = '$order_sn' and state.group_id = base_price.id");

        //$GLOBALS['db']->getOne($sql);

        if(empty($functions) || count($functions) < 1)
        {
            //没有找到主功能号和子功能号
            return;
        }

        //记录主功能号和子功能号
        $this->main_function = $functions[0]['main_function'];
        $this->sub_functions = $functions[0]['sub_functions'];
    }

    //清空主功能号和子功能号
    //为了防止一个程序使用其他程序的功能号,在调用register_update_app 注册或更新之后,必须清除功能号
    function clear_functions()
    {
        $this->main_function = '';
        $this->sub_functions = '';
    }

    //wenbaolin add $dev_vip  是否是付费开发者
    //开发者授权也是调用此处,不过事先不用调用get_functions()获取功能号,采用默认即可
	function register_update_app($cat_id, $user_name, $start_time, $end_time ,$plugin_serial_no_arr, $order_count = 1,
										$type = 'register', $serial_no = '', $order_id = 0 ,$dev_vip = false, $order_sn = 0)
	{
		$order_count = ($order_count = intval($order_count)) < 1 ? 1 : $order_count; 

        //wenbaolin 2014.08.06 modify
		$licence_version = $this->get_licence_version($cat_id,"gisstore",$dev_vip);
		$talk_period = $this->get_talk_period($cat_id);

		$starttime = local_date( 'Y-m-d', $start_time );
		$endtime = local_date( 'Y-m-d', $end_time);
		// $endtime = date( 'Y-m-d', $end_time);
		$price_group_id = 0;
		$scale_type = 0;
		//huangbin 2015.02.03
		foreach ($plugin_serial_no_arr as $item ) 
		{
			if ($item['parent_id'] == 0) {
				$function_goods_id = $item['goods_id'];
				break;
			}			
		}
		if ($order_id == 0) {
			$scale_type = $GLOBALS['db']->getOne("
				SELECT scale_type
        		FROM {$GLOBALS['ecs']->table('account_ex')} 
        		WHERE order_sn = '$order_sn'
			");
		}
		else{
			$scale_type = $GLOBALS['gis'] ->get_order_scale_type($order_id);
		}
		if ($scale_type) {
			$price_group_id = $GLOBALS['db']->getOne("
        		SELECT price_group_id
        		FROM {$GLOBALS['ecs']->table('goods_base_price')} 
        		WHERE goods_id = '$function_goods_id' and scale_type = '$scale_type'
        	");
		}
		$xml_str = $this->gen_lic_xml($user_name,$starttime,$endtime,$plugin_serial_no_arr, $licence_version,$talk_period,$price_group_id,$scale_type,$dev_vip);

		$group_guid = "";

		/* add 如果是开发环境,则不执行下面云狗逻辑,直接返回 begin */

		if (ENVIRONMENT == 'development') {
			return return_result(true,'',array('serial_no_arr' => 0,'group_guid' => 0));
		}

		/* end */

		try 
    	{
			if( $type == 'register' )
			{			
				$serial_no_arr = array();

				$group_guid = gen_guid();

				for ($i=0; $i < $order_count; $i++) 
				{ 
					if($cat_id == GEN_DEVELOPER_SN && $i > 0)
					{
						$licence_version = $this->get_licence_version( GEN_DEVELOPER_SN, 'dev_mobile', $dev_vip);

						$xml_str = $this->gen_lic_xml($user_name,$starttime,$endtime,$plugin_serial_no_arr, $licence_version,$talk_period,$price_group_id,$scale_type,$dev_vip);						
					}					

					$reg_result = $this -> register_app($xml_str);

					/* modify 如果$reg_result['success']为false则表面调用云狗服务出现异常,不再继续执行*/

					if (is_array($reg_result) && !$reg_result['success']) {
						return return_result(false,$reg_result['msg']);
					}
					else{
			    		if( (check_guid_format($reg_result) && ENVIRONMENT == 'production') OR ENVIRONMENT == 'development' )
			    		{
			    			if(ENVIRONMENT == 'production')
			    			{
			    				$update_group_guid_result = $this->update_group_guid($group_guid,$reg_result);

			    				if(!$update_group_guid_result['success'])		    				
			    				{
			    					return return_result(false,'cloud dog return error when registering(group_guid).');
			    				}
			    			}

			    			array_push($serial_no_arr, $reg_result);
			    		}
			    		else
			    		{
			    			return return_result(false,'cloud dog return error when registering.');
			    		}
					}

		    		/* modify end */	    	
				}

				if(count($serial_no_arr) == 1)
				{
					$group_guid = $serial_no_arr[0];
				}

				return return_result(true,'',array('serial_no_arr' => implode(',', $serial_no_arr),'group_guid' => $group_guid));
	    			    	
		    }
		    elseif( $type == 'update' )
		    {	    		    		
		    	$serial_no_arr = explode(',', $serial_no);

		    	$success = true;

		    	for ($i=0; $i < count($serial_no_arr); $i++) 
		    	{ 
		    		if($cat_id == GEN_DEVELOPER_SN && $i > 0)
					{
						$licence_version = $this->get_licence_version( GEN_DEVELOPER_SN, 'dev_mobile',$dev_vip);

						$xml_str = $this->gen_lic_xml($user_name,$starttime,$endtime,$plugin_serial_no_arr, $licence_version,$talk_period,$price_group_id,$scale_type,$dev_vip);
					}	

		    		$update_result = $this -> update_app($serial_no_arr[$i],$xml_str);

					/* modify 如果$reg_result['success']为false则表面调用云狗服务出现异常,不再继续执行*/

					if (!$update_result['success']) {
						return return_result(false,$update_result['msg']);
					}
					else{
			    		if( $update_result == "Success" OR ENVIRONMENT == 'development' )
			    		{
                            $now_time = gmtime();
			    			$GLOBALS['db']->query("
			    				UPDATE {$GLOBALS['ecs']->table('order_info')} 
			    				SET last_modify_time = '$now_time' 
			    				WHERE order_id = '$order_id' ");		    			
			    		}
			    		else
						{ 
							$success = false;						
			    		}
		    		}

		    		/* modify end */
		    	}

		    	return $success
		    		? return_result(true)
		    		: return_result(false,'cloud dog return error when updating:' . $update_result);
		    }
	    } 
		catch (Exception $e) 
		{
			return return_result(false,'cloud dog connection error.');
		}	

	    return return_result(false,'cloud dog error.');	 		
	}

	/**
	 * 更新或者注册权项,不打包
	 * @param  string $order_sn 
	 * @return            
	 */
	function register_update_app_by_order_id($order_id)
	{					
		$now_time = gmtime();

		$current_order_detail = $GLOBALS['db']->getAll( 
	       "SELECT orderinfo.order_sn,orderinfo.order_id,orderinfo.last_gen_file_time,orderinfo.last_modify_time,
	        	orderinfo.download_file_name,orderinfo.serial_no,orderinfo.start_time,orderinfo.end_time,
	        	orderinfo.user_id, ordergoods.goods_name, goods.weight_id, goods.cat_id
	        FROM {$GLOBALS['ecs']->table('order_info')} orderinfo, {$GLOBALS['ecs']->table('order_goods')} ordergoods,
	        	{$GLOBALS['ecs']->table('goods')} goods 
	        WHERE orderinfo.order_id = '$order_id' and 
	        	orderinfo.order_id = ordergoods.order_id and goods.goods_id = ordergoods.goods_id
	        ORDER by ordergoods.parent_id");

	    if(!count($current_order_detail))
	    {
	    	return return_result(false,'no goods found.');
	    }

		$user_name  = get_user_by_id($current_order_detail[0]['user_id'],'user_name');
		
		$start_time = $current_order_detail[0]['start_time'];
		$end_time   = $current_order_detail[0]['end_time'];
		
		$serial_no  = $current_order_detail[0]['serial_no'];

        //{{
        //wenbaolin 2014.9.20 add
        //在注册或更新app的时候,必须根据产品获取其主功能号和子功能号
	    //return $this->register_update_app($current_order_detail[0]['cat_id'],$user_name, $start_time,
	    //	$end_time ,$current_order_detail,1, 'update', $serial_no, $order_id);
        $this->get_functions($current_order_detail[0]['order_sn']);

        $rtn = $this->register_update_app($current_order_detail[0]['cat_id'],$user_name, $start_time,
	    	$end_time ,$current_order_detail,1, 'update', $serial_no, $order_id);

        $this->clear_functions();

        return $rtn;
        //}}
	}

    /**
     *  获取注册信息
     */
    function get_auth_info($serial_no)
    {
        try
        {
            $client = new SoapClient($this->service_url);
            $param = array('AuthID'=>$serial_no);

            $result = $client->GetAuthInfo($param);

            $result_str = $result->GetAuthInfoResult;

            return return_result(true, '', $result_str);

        }
        catch(Exception $e)
        {
            return return_result(false,$e->getMessage());
        }
    }

    function update_auth_mac_info($serial_no)
    {
        try
        {
            $client = new SoapClient($this->service_url);

            $param = array(
            	'AuthID'=>$serial_no,
            	'BingdingMac' => ''
            );

            $result = $client->UpdataAuthMacInfo($param);

            $result_str = $result->UpdataAuthMacInfoResult;

            if($result_str == 'Success')
            {
            	return return_result(true);
            }
            else
            {
            	return return_result(0,'cloud dog return error.');
            }
            
        }
        catch(Exception $e)
        {
            return return_result(false,$e->getMessage());
        }
    }

    function update_sync_day($serial_no, $day = 5)
    {
        try
        {
            $client = new SoapClient($this->service_url);
            $param = array('NewPluginNo'=>$serial_no);

            $result = $client->GetAuthInfo($param);

            $result_str = $result->GetAuthInfoResult;

            return return_result(true, '', $result_str);

        }
        catch(Exception $e)
        {
            return return_result(false,$e->getMessage());
        }
    }

    function get_auth_xmls_by_sn($serial_no){
    	try {
    		$client = new SoapClient($this->xml_service_url);
    		$param = array('GroupNo'=>$serial_no);

    		$result = $client->GetInitialAuthorize($param);
    		$result_str_obj = $result->GetInitialAuthorizeResult;
    		$result_str = $result_str_obj->string;
    		$folder_name = $this->_create_uuid();
	    	if(!mkdir($this->xml_base_path.$folder_name,0777)){
	    		return return_result(false,'create xml folder failed');
	    	}
	    	if(count($result_str)>1){
	    		foreach ($result_str as $key => $value) {	
	    			$this->_save_xml($folder_name,$value);
	    		}
	    	}elseif(count($result_str)==1){
	    		$this->_save_xml($folder_name,$result_str);
	    	}else{
	    		return return_result(false,'get authxmls failed');
	    	}
    		$this->_rar_xml_to_fileserver($folder_name);
    		return return_result(true, '',$folder_name);
    	} catch (Exception $e) {
    		return return_result(false,$e->getMessage());
    	}
    }

    /**
     * 获取私有云信息
    */
    function get_private_cloud_info(){
        try
        {
            $client = new SoapClient($this->service_url);
            $result = $client->GetPrivateCloudInfo();
            return return_result(true,'',$result);
        }
        catch(Exception $e)
        {
            return return_result(false,$e->getMessage());
        }    	
    }

    function _save_xml($folder_name,$string){
    	if(strlen($string)<=0){
    		return false;
    	}	
    	if(preg_match('/\<SerialNo\>(.*)\<\/SerialNo\>/',$string,$matches)){
    		$file_name = $matches[1];
    	}
    	$handle = fopen($this->xml_base_path . $folder_name . '/'. $file_name .'.xml','w+');
    	if($handle === false){
    		return false;
    	}else{
    		if(!fwrite($handle, $string)){
    			return false;
    		}else{
    			return true;
    		}
    		fclose($handle);
    	}
    }

  	function _create_uuid($prefix = ""){    //可以指定前缀
  		if($prefix==""){
  			$prefix = time();
  		}
	    $str = md5(uniqid(mt_rand(), true));   
	    $uuid  = substr($str,0,8) ;   
	    $uuid .= substr($str,8,4) ;   
	    $uuid .= substr($str,12,4) ;   
	    $uuid .= substr($str,16,4) ;   
	    $uuid .= substr($str,20,12);   
	    return $prefix . $uuid;
	}

	function _rar_xml_to_fileserver($folder_name){
		$command_rar = 'rar a -m1 -ep1 '.$this->xml_base_path.$folder_name.'.rar '.$this->xml_base_path.$folder_name.'/';
		shell_exec($command_rar);
	}

}
if(is_internal_id($_SERVER['REMOTE_ADDR'])){
	$gis_service = new GIS_SERVICE($GLOBALS['myself_base_url'], $base_url_config['cloud_dog'],$base_url_config['cloud_dog']);
}else{
	$gis_service = new GIS_SERVICE($GLOBALS['myself_base_url'], $base_url_config['cloud_dog'],$base_url_config['out_cloud_dog']);
}

