<?php
	define('UC_USER_CHECK_USERNAME_FAILED', -1);
	define('UC_USER_USERNAME_BADWORD', -2);
	define('UC_USER_USERNAME_EXISTS', -3);
    if(!defined('IN_ECS')){die('Hacking attempt');}
    include_once(ROOT_PATH . 'includes/lib_passport.php');

    $username = trim($_GET['username']);
    $username = json_str_iconv($username);
    //die ($user->check_user($username) || admin_registered($username) ? 'true' : 'false');
    $flag = check_user($username);
    echo $flag;

    function check_user($username)
    {
        $username = addslashes(trim(stripslashes($username)));
        if (!preg_match('/^[_a-zA-Z0-9]+$/', $username) || strlen($username) < 6 || strlen($username) > 32) {
            return UC_USER_CHECK_USERNAME_FAILED;
        }
        if (!check_username($username)) {
            return UC_USER_CHECK_USERNAME_FAILED;
        }if (check_usernameexists($username)) {
            return UC_USER_USERNAME_EXISTS;
        }
        return 1;
    }

   	function check_username($username) {
		$guestexp = '\xA1\xA1|\xAC\xA3|^Guest|^\xD3\xCE\xBF\xCD|\xB9\x43\xAB\xC8';
		$len = dstrlen($username);
		if($len > 32 || $len < 6 || preg_match("/\s+|^c:\\con\\con|[%,\*\"\s\<\>\&]|$guestexp/is", $username)) {
			return FALSE;
		} else {
			return TRUE;
		}
	}

	function dstrlen($str) {
		if(strtolower(UC_CHARSET) != 'utf-8') {
			return strlen($str);
		}
		$count = 0;
		for($i = 0; $i < strlen($str); $i++){
			$value = ord($str[$i]);
			if($value > 127) {
				$count++;
				if($value >= 192 && $value <= 223) $i++;
				elseif($value >= 224 && $value <= 239) $i = $i + 2;
				elseif($value >= 240 && $value <= 247) $i = $i + 3;
		    	}
	    		$count++;
		}
		return $count;
	}

	function check_usernameexists($username){
		return user_registered($username) || admin_registered($username);
	}
?>

