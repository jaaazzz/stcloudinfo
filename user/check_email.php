<?php
	define('UC_USER_EMAIL_FORMAT_ILLEGAL', -4);
	define('UC_USER_EMAIL_ACCESS_ILLEGAL', -5);
	define('UC_USER_EMAIL_EXISTS', -6);
    if(!defined('IN_ECS')){die('Hacking attempt');}
    $email = trim($_GET['email']);
    echo check_email($email);

    function check_email($email, $username = '')
    {
        if (!check_emailformat($email)) {
            return UC_USER_EMAIL_FORMAT_ILLEGAL;
        } elseif (check_emailexists($email, $username)) {
            return UC_USER_EMAIL_EXISTS;
        } else {
            return 1;
        }
    }

    function check_emailformat($email) {
		return strlen($email) >= 6 && preg_match("/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/", $email);
	}

	function check_emailaccess($email) {
		// $setting = $this->base->get_setting(array('accessemail', 'censoremail'));
		$setting = $this->base->get_setting(array('accessemail'));
		$accessemail = $setting['accessemail'];
		$censoremail = $setting['censoremail'];
		$accessexp = '/('.str_replace("\r\n", '|', preg_quote(trim($accessemail), '/')).')$/i';
		$censorexp = '/('.str_replace("\r\n", '|', preg_quote(trim($censoremail), '/')).')$/i';
		if($accessemail || $censoremail) {
			if(($accessemail && !preg_match($accessexp, $email)) || ($censoremail && preg_match($censorexp, $email))) {
				return FALSE;
			} else {
				return TRUE;
			}
		} else {
			return TRUE;
		}
	}

	function check_emailexists($email){
		/* 检查email是否重复 */
        $sql = "SELECT COUNT(*)".
                " FROM " . $GLOBALS['ecs']->table('users').
                " WHERE email = '$email' ";
        if ($GLOBALS['db']->getOne($sql) > 0)
        {
            return true;
        }
        return false;
	}
?>

