<?php
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<script src="../js/globe.debug.js" type="text/javascript"></script>
	<script type="text/javascript">
	function getParam(v_key){
		var searchStr = window.location.search;
	    var params = searchStr.substring(searchStr.indexOf("?") + 1);
	    var paramsArray = params.split("&");
	    var v = null;
	    for (var i = 0; i < paramsArray.length; i++) {
	        var tempStr = paramsArray[i];
	        var key = tempStr.substring(0, tempStr.indexOf("=")).toLowerCase();
	        var value = tempStr.substring(tempStr.indexOf("=") + 1);
	        if (key == v_key) {
	            v = value;
	            break;
	        }
	    }
	    return v;
	}
	var globe = new Globe();
	function init(){
		var ip=getParam("ip");
		var port=getParam("port");
		var globe3d=getParam("globe");
		var model=getParam("model");
		// svrCfg = {
  //          ip: ip,
  //          port:port,
  //           //    modelLayerName: "Ob20170412"
  //          globalMapName: "global3D", // "mzw_lyw"
  //          surfaceMapName: "dalianga"
  //    	};
     	globe.load(function(){
			if(model == "true"){
		    	globe.goToSurfaceMode();
		    }
     		var id = globe.addDoc(globe3d, ip, port, DocType.TypeG3D);
		    if (id == -1) {
		       alert("加载地图失败！");
		    }
		    else {
		        globe.reset();       //复位
		    }
		    //设置视图范围
		    //var xMin = 113.203124995473;
		    //var yMin = 29.5312500009336;
		    //var xMax = 115.312499995441;
		    //var yMax = 31.640625000901;

		    //globe.jumpByRect(xMin, yMin, xMax, yMax);
		});
	}
	function return2d(){
    	window.location.href="../../../onlinemap.php";
	}
	</script>
</head>

<body onload="init()">
	<div id="mapControl" style="left: 0px;width: 100%; height: 100%;top:0px;">
        <object id="MapGIS_EarthControl" classid="clsid:56D6E862-F22D-41EF-B517-F2255A4250CB"
                  style="left: 0px; top: 0px; width: 100%; height: 100%; position: absolute; z-index: 0;">
        </object>
    </div> 
       <div id="mapselect"><iframe src="selectmap.dwt" style="position:absolute; z-index:99999;overflow:hidden;right:180px;top:10px;" height="86px" width="122px" scrolling="no" border="no"></iframe></div>
</body>