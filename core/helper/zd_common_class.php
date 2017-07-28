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
 * 公用函数库类
*/
class zd_common_class {

    /**
     * 显示一个提示信息
     *
     * @access  public
     * @param   string  $content
     * @param   string  $link
     * @param   string  $href
     * @param   string  $type               信息类型：warning, error, info
     * @param   string  $auto_redirect      是否自动跳转
     * @return  void
     */
    public static function show_msg($content, $links = '', $hrefs = '', $type = 'info', $auto_redirect = true){
        $msg['content'] = $content;
        if (is_array($links) && is_array($hrefs))
        {
            if (!empty($links) && count($links) == count($hrefs))
            {
                foreach($links as $key =>$val)
                {
                    $msg['url_info'][$val] = $hrefs[$key];
                }
                $msg['back_url'] = $hrefs['0'];
            }
        }
        else
        {
            $link   = empty($links) ? $GLOBALS['_LANG']['back_up_page'] : $links;
            $href    = empty($hrefs) ? 'javascript:history.back()'       : $hrefs;
            $msg['url_info'][$link] = $href;
            $msg['back_url'] = $href;
        }
        $GLOBALS['smarty']->assign('auto_redirect', $auto_redirect);
        $GLOBALS['smarty']->assign('message', $msg);
        $GLOBALS['smarty']->display('message.dwt');
    }

    /**
     * 验证输入的邮件地址是否合法
     * @access public
     * @param string $email 需要验证的邮件地址
     * @return bool
     */
    public static function _is_email($email){
        $chars = "/^([a-z0-9+_]|\\-|\\.)+@(([a-z0-9_]|\\-)+\\.)+[a-z]{2,6}\$/i";
        if (strpos($email, '@') !== false && strpos($email, '.') !== false)
        {
            if (preg_match($chars, $email))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    /**
     * 将byte值转换成M值
     * @access public
     * @author huangbin
     * @param int $size 需要转换的byte
     * @return string
     */    
    public static function _get_real_size($size){
        //如果是字符串
        if(is_string($size)){ 
            return $size; 
        }
        $kb = 1024;         // Kilobyte
        $mb = 1024 * $kb;   // Megabyte
        $gb = 1024 * $mb;   // Gigabyte
        $tb = 1024 * $gb;   // Terabyte

        if($size < $kb)
        { 
            return $size."B";
        }
        else if($size < $mb)
        { 
            return round($size/$kb)."KB";
        }
        else if($size < $gb)
        { 
            return round($size/$mb)."MB";
        }
        else if($size < $tb)
        { 
            return round($size/$gb)."GB";
        }
        else
        { 
            return round($size/$tb)."TB";
        }
    }

    /**
     * 转换图片路径
     * @access public
     * @author huangbin
     * @param int $str 需要转换的路径
     * @return string
     */    
    public static function _convert_url_in_string($str){

        $replacement = trim($GLOBALS['static_server_base_url']) != '/' ? $GLOBALS['static_server_base_url'] : $GLOBALS['myself_base_url'];

        $pattern = '/http:\/\/192\.168\.\d+\.\d+\//';
        $str = preg_replace($pattern, $replacement, $str);

        $pattern = '/http:\/\/192\.168\.\d+\.\d+:\d+\//';
        $str = preg_replace($pattern, $replacement, $str);

        $pattern = '/http:\/\/www\.smaryun\.com\//';
        $str = preg_replace($pattern, $replacement, $str);
     
        $pattern = '/http:\/\/www\.smaryun\.com:\d+\//';
        $str = preg_replace($pattern, $replacement, $str);

        return $str;
    }

    /**
     * 格式化价格
     * @access public
     * @author huangbin
     * @param string $price 价格
     * @return  string 
     */
    public static function _price_format($price){
        //比较配置文件中price_format值
        switch ($GLOBALS['_CFG']['price_format'])
        {
            case 0:
                $price = number_format($price, 2, '.', '');
                break;
            case 1: // 保留不为 0 的尾数
                $price = preg_replace('/(.*)(\\.)([0-9]*?)0+$/', '\1\2\3', number_format($price, 2, '.', ''));

                if (substr($price, -1) == '.')
                {
                    $price = substr($price, 0, -1);
                }
                break;
            case 2: // 不四舍五入，保留1位
                $price = substr(number_format($price, 2, '.', ''), 0, -1);
                break;
            case 5: // 直接取整
                $price = intval($price);
                break;
            case 4: // 四舍五入，保留 1 位
                $price = number_format($price, 1, '.', '');
                break;
            case 3: // 先四舍五入，不保留小数
                //$price = round($price);
                $price = number_format($price, 2, '.', '');
                break;
        }
        return $price;
    }

    /**
     * 发送http请求
     * @access public
     * @author huangbin
     * @param string $url 请求的地址
     * @param string $proxy_url 使用的代理地址
     * @return mix
     */
    public static function _send_get($url,$proxy_url = "")
    {
        $response = "";
        $proxy = $proxy_url;
        if($url != "") {
            //如果代理地址不为空
            if (trim($proxy) != "") {
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_HEADER, 0);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_PROXY, $proxy);
                $response = curl_exec($ch);
                if(curl_errno($ch)) $response = "";
                curl_close($ch);
            }
            else{
                $response = @file_get_contents($url);
            }
        }
        return $response;
    }

    /**  
     * 发送post请求  
     * @param string $url 请求地址  
     * @param array $post_data post键值对数据  
     * @return string  
     */  
    function send_post($url, $post_data) 
    {    
        error_reporting(0);
        $postdata = http_build_query($post_data);  

        $options = array(   
            'http' => array(   
                'method' => 'POST',   
                'header' => 'Content-type:application/x-www-form-urlencoded',   
                'content' => $postdata,   
                'timeout' => 15 * 60 // 超时时间（单位:s）   
            )   
        );
        $context = stream_context_create($options);         

        $result = file_get_contents($url, false, $context);   
        
        $error = error_get_last();

        if(isset($error) && $error["file"] == __FILE__){
            return $error;
        }

        return $result;  
    } 


}
?>