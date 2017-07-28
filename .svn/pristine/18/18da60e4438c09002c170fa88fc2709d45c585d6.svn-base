<?php

defined('IN_ECS') || die('Hacking attempt');

/*------------------------------------------------------ */
//-- 该类用于将SESSION直接写入Memcache
/*------------------------------------------------------ */
class cls_session
{
	public $db= NULL;

	public $max_life_time = 1296000; // SESSION 过期时间

    public $session_name = '';
    public $session_id = '';

    public $session_expiry = '';
    public $session_md5 = '';

    public $session_cookie_path = '/';
    public $session_cookie_domain = '';
    public $session_cookie_secure = false;

    public $memcache_string = "";

    public $_ip = '';
    public $_time = 0;

	function __construct($session_name = 'ECS_ID', $redis)
	{
		$this->cls_session($redis, $session_name, "");
	}

	function cls_session(&$db, $session_name = 'ECS_ID', $session_id = '')
	{
		$GLOBALS['_SESSION'] = array();

		if (!empty($GLOBALS['cookie_path']))
		{
			$this->session_cookie_path = $GLOBALS['cookie_path'];
		}
		else
		{
			$this->session_cookie_path = '/';
		}

		if (!empty($GLOBALS['cookie_domain']))
		{
			$this->session_cookie_domain = $GLOBALS['cookie_domain'];
		}
		else
		{
			//$this->session_cookie_domain = '';
            $this->session_cookie_domain = get_root_domain();
		}

		if (!empty($GLOBALS['cookie_secure']))
		{
			$this->session_cookie_secure = $GLOBALS['cookie_secure'];
		}
		else
		{
			$this->session_cookie_secure = false;
		}

		$this->session_name = $session_name;

		$this->db = &$db;
		$this->_ip = real_ip();

		if ($session_id == '' && !empty($_COOKIE[$this->session_name]))
		{
			$this->session_id = $_COOKIE[$this->session_name];
		}
		else
		{
			$this->session_id = $session_id;
		}

		if ($this->session_id)
		{
			$tmp_session_id = substr($this->session_id, 0, 32);

			if ($this->gen_session_key($tmp_session_id) == substr($this->session_id, 32))
			{
				$this->session_id = $tmp_session_id;
			}
			else
			{
				$this->session_id = '';
			}
		}

		$this->_time = time();

		if ($this->session_id)
		{
			$this->load_session();
		}
		else
		{
			$this->gen_session_id();
			setcookie($this->session_name, $this->session_id . $this->gen_session_key($this->session_id), time() + 3600 * 8, $this->session_cookie_path, $this->session_cookie_domain, $this->session_cookie_secure);
		}

		register_shutdown_function(array(&$this, 'close_session'));
	}

	function gen_session_id()
	{
		$this->session_id = md5(uniqid(mt_rand(), true));

		return $this->insert_session();
	}

	function gen_session_key($session_id)
	{
		static $ip = '';
		
		if($ip == ""){ $ip = $this->_ip; }

		$need_crc = empty($_SERVER['HTTP_USER_AGENT']) ? "" : $_SERVER['HTTP_USER_AGENT'] . $ip . $session_id;
		$crc_result = crc32($need_crc);
		
		return sprintf('%08x', $crc_result < 0 ? -$crc_result : $crc_result);
	}

	function insert_session()
	{
		$to_be_insert = array('expiry'=>$this->_time, 'ip'=>$this->_ip);
		return $this->db->set($this->session_id, json_encode($to_be_insert),$this->max_life_time);
	}

	function load_session()
	{
		$session = $this->db->get($this->session_id);
		$session = json_decode($session,true);		

		if (empty($session))
		{
			$this->insert_session();
			$this->session_expiry = 0;
			$this->session_md5 = '40cd750bba9870f18aada2478b24840a';
			$GLOBALS['_SESSION'] = array();
		}
		else
		{
            //wenbaolin 2015.01.8 简化 load session
            if(isset($session['data'])){
                $this->session_md5 = md5(serialize($session['data']));
                $GLOBALS['_SESSION'] = $session['data'];
            }else{
                $this->session_expiry = 0;
                $this->session_md5 = '40cd750bba9870f18aada2478b24840a';
                $GLOBALS['_SESSION'] = array();
            }

//			if(isset($session['userid']) && intval($session['userid']) > 0 && isset($session['expiry']) &&
//				$this->_time - $session['expiry'] < $this->max_life_time)
//			{
//				$this->session_expiry = $session['expiry'];
//
//				if(empty($session['data']))
//				{
//					//一般是开发者中心用户
//					$_SESSION["user_id"] = $session['userid'];
//					update_user_info();
//				}
//				else
//				{
//					$this->session_md5 = md5(json_encode($session['data']));
//					$GLOBALS['_SESSION'] = $session['data'];
//				}
//			}
//			else
//			{
//				if(!empty($session['data']) && $this->_time - $session['expiry'] < $this->max_life_time)
//				{
//					$GLOBALS['_SESSION'] = $session['data'];
//				}
//				else
//				{
//					$this->session_expiry = 0;
//					$this->session_md5 = '40cd750bba9870f18aada2478b24840a';
//					$GLOBALS['_SESSION'] = array();
//				}
//			}
		}
  	}
  
	function update_session()
	{
		$adminid = !empty($GLOBALS['_SESSION']['admin_id']) ? intval($GLOBALS['_SESSION']['admin_id']) : 0;
		$userid = !empty($GLOBALS['_SESSION']['user_id']) ? intval($GLOBALS['_SESSION']['user_id']) : 0;

		$data = $GLOBALS['_SESSION'];

		$this->_time = time();

		if ($this->session_md5 == md5(serialize($data)) && $this->_time < $this->session_expiry + 10)
		{
			return true;
		}

        //wenbaolin 2014.11.18 modify
        //{{
        $json_data = $this->db->get($this->session_id);
        if($json_data)
        {
            $session_data = json_decode($json_data);
            if($session_data && isset($session_data->data) && !empty($session_data->uc_id))
            {
                $session_data->expiry = $this->_time;
                $session_data->adminid = $adminid;

                //wenbaolin 屏蔽以下代码测试
                //$session_data->userid = $userid;

                $session_data->data = &$data;
                //$session_data->data->user_id = $userid;
                //$session_data->data->login_fail = $data['login_fail'];

                $to_be_insert = &$session_data;
            }
        }
        //}}

        if(empty($to_be_insert))
        {
            $to_be_insert = array('expiry'=>$this->_time, 'ip'=>$this->_ip, 'userid'=>$userid, 'adminid'=>$adminid, 'data'=>$data);
        }


		return $this->db->set($this->session_id,json_encode($to_be_insert),$this->max_life_time);
	}

	function close_session()
	{
		$this->update_session();

		return true;
	}

	function delete_spec_admin_session($adminid)
	{
		if (!empty($GLOBALS['_SESSION']['admin_id']) && $adminid)
		{
			$all_items = $this->db->keys("*");

			foreach ($all_items as $key => $item) 
			{
				if (isset($item['adminid'])) 
				{
					if ($item['adminid'] == $adminid) 
						return $this->db->delete($key);
				}
			}
		}
		else
		{
			return false;
		}
	}

	function destroy_session()
	{ 
		$GLOBALS['_SESSION'] = array();

		setcookie($this->session_name, $this->session_id, 1, $this->session_cookie_path, $this->session_cookie_domain, $this->session_cookie_secure);

		/* ECSHOP 自定义执行部分 */
		if (!empty($GLOBALS['ecs']))
		{
			$GLOBALS['db']->query('DELETE FROM ' . $GLOBALS['ecs']->table('cart') . " WHERE session_id = '$this->session_id'");
		}
		/* ECSHOP 自定义执行部分 */

		return $this->db->delete($this->session_id);
	}

	function get_session_id()
	{
		return $this->session_id;
	}

	function get_users_count()
	{
		$all_items = $this->db->keys("*");
		return count($all_items);
	}

} 
