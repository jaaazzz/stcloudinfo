<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 15-9-17
 * Time: 下午7:59
 */
$method = $_SERVER['REQUEST_METHOD'];

function cn_urlencode($url){
    $pregstr = "/[\x{4e00}-\x{9fa5}\x{FE30}-\x{FFA0}]+/u";//UTF-8中文正则
    if(preg_match_all($pregstr,$url,$matchArray)){//匹配中文，返回数组
        foreach($matchArray[0] as $key=>$val){
            $url=str_replace($val, urlencode($val), $url);//将转译替换中文
        }
        if(strpos($url,' ')){//若存在空格
            $url=str_replace(' ','%20',$url);
        }
    }
    return $url;
}
function curl($url,$rHeader = array(),$post = false){
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_VERBOSE, 1);
    curl_setopt($curl, CURLOPT_HEADER, 1);
    curl_setopt($curl,CURLOPT_HTTPHEADER,$rHeader);

    if($post){
        //$fields_string = http_build_query($fields);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
    }

    $response = curl_exec($curl);
    $header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
    $http_code = curl_getinfo($curl,CURLINFO_HTTP_CODE);
    $header_string = substr($response, 0, $header_size);
    $body = substr($response, $header_size);

    $header_rows = explode(PHP_EOL, $header_string);
    $header_rows = array_filter($header_rows,function($v){
        return trim($v);
    });
    curl_close($curl);
    return array('header'=>$header_rows,'body'=>$body,'http_code'=>$http_code);
}


$url = $_REQUEST["url"];
$headers = array();
foreach ($_SERVER as $key => $value) {
    if ('HTTP_' == substr($key, 0, 5) && 'HTTP_HOST'!= $key) {
        $headers[] = str_replace('_', '-', substr($key, 5)).':'.$value;
    }
}
$url = urldecode($url);
$url = cn_urlencode($url);

if ($method == "GET"){// get 提交
    /*$options = array(
        'http'=>array(
            'method'=>'GET',
            'header'=>implode('\r\n',$headers)
        )
    );*/
    $result = curl($url,$headers);
} else {
    // post 提交
    $postData = file_get_contents("php://input");
    //设置发送头信息
    /*$options = array(
        'http'=>array(
            'method'=>'POST',
            'content'=>$postData,
            'header'=>implode('\r\n',$headers)
        )
    );*/
    $result = curl($url,$headers,$postData);
}

//$stream_options = stream_context_create($options);
//$content = file_get_contents($url, false, $stream_options);

/*if(!$content){
    echo 'fail';
}else{
    foreach($http_response_header as $k=>$v){
        header($v);
    }
    echo $content;
}*/
foreach($result['header'] as $k=>$v){
    if(strpos($v,'Transfer-Encoding')===0){
        continue;
    }
    header($v);
}
if($result['body']){
    echo $result['body'];
}else{
    echo $result['http_code'];
}
die();