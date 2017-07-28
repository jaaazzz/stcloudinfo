<?php

class ArrayToXML {

    /**
     * The main function for converting to an XML document.
     * Pass in a multi dimensional array and this recrusively loops through and builds up an XML document.
     *
     * @param array $data
     * @param string $rootNodeName - what you want the root node to be - defaultsto data.
     * @param SimpleXMLElement $xml - should only be used recursively
     * @return string XML
     */
    public static function toXml($data, $rootNodeName = 'root', $xml=null)
    {
        // turn off compatibility mode as simple xml throws a wobbly if you don't.
        if (ini_get('zend.ze1_compatibility_mode') == 1)
        {
            ini_set ('zend.ze1_compatibility_mode', 0);
        }
        
        if ($xml == null)
        {
            $xml = simplexml_load_string("<?xml version='1.0' encoding='utf-8'?><$rootNodeName />");
        }
        
        // loop through the data passed in.
        foreach($data as $key => $value)
        {
            // no numeric keys in our xml please!
            if (is_numeric($key))
            {
                // make string key...
                //$key = "unknownNode_". (string) $key;
                $key = "item_". (string) $key;
            }
            
            // replace anything not alpha numeric
            $key = preg_replace('/[^a-z]/i', '', $key);
            
            // if there is another array found recrusively call this function
            if (is_array($value))
            {
                $node = $xml->addChild($key);
                // recrusive call.
                ArrayToXML::toXml($value, $rootNodeName, $node);
            }
            else 
            {
                // add single node.
                $value = htmlentities($value);
                $xml->addChild($key,$value);
            }
            
        }
        // pass back as string. or simple xml object if you want!
        return $xml->asXML();
    }

    /**
     * 读取XML配置文件，获取菜单栏目
     */
    public static function GetMenuXmlContent()
    {
        global $smarty; $ret = Array();
        try {
            $path = "themes/appcloud/config/menus.xml";
            if(file_exists($path))
            {
                $xml = simplexml_load_file($path);
                $node_len = count($xml->node);
                for($i=0; $i<$node_len; $i++)
                {
                    $node = $xml->node[$i];
                    $field_len = count($node->Field);
                    for($j=0; $j<$field_len; $j++)
                    {
                        $field = $node->Field[$j];
                        //获取菜单属性：status/index/active/url/is_user
                        if(strval($field->attributes()->status) == "false") continue;

                        $index = intval($field->attributes()->index);
                        $active = strval($field->attributes()->active);
                        $is_user = strval($field->attributes()->is_user);
                        $href = strval($field->attributes()->url);
                        $url = $is_user == "true" ? ($_SESSION['user_id'] ? $href : 'javascript:GucLogin()') : $href;
                        $name = strval($field->lable);

                        $option = Array("index" => $index,"name" => $name, "url" => $url, "active" => $smarty->_var[$active]);
                        if($j == 0)
                        {
                            array_push($ret,$option);
                        }
                        else
                        {
                            //升序排列
                            $before_index = $ret[$j-1]["index"];
                            if($before_index > $index)
                            {
                                $before_array = $ret[$j-1];
                                $ret[$j-1] = $option;
                                array_push($ret,$before_array);
                            }
                            else
                            {
                                array_push($ret,$option);
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {

        }
        //如果获取配置失败，返回默认列表
        if(count($ret) <= 0)
        {
            $ret = Array(
                Array('name' => '首页', 'url' => 'index.php', 'active' => $smarty->_var['index_active']),
                Array('name' => '在线地图', 'url' => 'onlinemap.php', 'active' => $smarty->_var['map_active']),
                Array('name' => '在线应用', 'url' => 'app.php', 'active' => $smarty->_var['app_active']),
                Array('name' => '软件中心', 'url' => 'sfw.php', 'active' => $smarty->_var['sfw_active']),
                Array('name' => '资源中心', 'url' => 'resource.php', 'active' => $smarty->_var['resource_active']),
                Array('name' => '个人中心', 'url' => $_SESSION['user_id'] ? 'user.php?act=my_app' : 'javascript:GucLogin()', 'active' => $smarty->_var['user_active'])
            );
        }

        return $ret;
    }

    /*private $version    = '1.0';
    private $encoding   = 'UTF-8';
    private $root       = 'root';
    private $xml        = null;
    function __construct() {
        $this->xml = new XmlWriter();
    }
    function toXml($data, $eIsArray=FALSE) {
        if(!$eIsArray) {
            $this->xml->openMemory();
            $this->xml->startDocument($this->version, $this->encoding);
            $this->xml->startElement($this->root);
        }
        foreach($data as $key => $value){        	
            if(is_array($value)){
            	if(is_integer($key)){
        		
        		}else{
        			$this->xml->startElement($key);
	                $this->toXml($value, TRUE);
	                $this->xml->endElement();
	                continue;
        		}                
            }
            $this->xml->writeElement($key, $value);
        }
        if(!$eIsArray) {
            $this->xml->endElement();
            return $this->xml->outputMemory(true);
        }
    }*/
}
/*$res = array(
    'hello' => '11212',
    'world' => '232323',
    'array' => array(
        'test' => 'test',
        'b'    => array('c'=>'c', 'd'=>'d')
    ),
    'a' => 'haha'
);*/
//$xml = new A2Xml();
/*echo $xml->toXml($res);*/
?>