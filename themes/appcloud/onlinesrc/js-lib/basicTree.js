//------------------------ol3地图基本函数---------------------
window.olMap = window.olMap || {};
olMap.ZoomOut=function() {
	if(map!=null&&map.getView()!=null)
    map.getView().setZoom(map.getView().getZoom() +1);
}

olMap.ZoomIn=function() {
	if(map!=null&&map.getView()!=null)
    map.getView().setZoom(map.getView().getZoom() - 1);
}

olMap.panDirection=function(direction) {
	if(map!=null&&map.getView()!=null){
	    var pan = ol.animation.pan({
	        duration: 250,
	        source: (map.getView().getCenter())
	    });
	    map.beforeRender(pan);
	    var mapCenter = map.getView().getCenter();
	    switch (direction) {
	        case "north":
	            mapCenter[1] += 0.01 * map.getView().getZoom();
	            break;
	        case "south":
	            mapCenter[1] -= 0.01 *  map.getView().getZoom();
	            break;
	        case "west":
	            mapCenter[0] -= 0.01 * map.getView().getZoom();
	            break;
	        case "east":
	            mapCenter[0] += 0.01 * map.getView().getZoom();
	            break;
	    }
	    map.getView().setCenter(mapCenter);
	    map.render();
	}
}
olMap.zoomPan=function(endLevel) {
	if(map!=null&&map.getView()!=null){
	    var pan = $("#pan").get(0);
	    var high_top = parseInt($("#pan").css("top"));
	    var y;
	    pan.onmousedown = function (e1) {
	        y = e1.clientY;
	        document.onmousemove = function (e2) {
	            var diffY = e2.clientY - y;
	            var realY = high_top + diffY;
	            var aaa=$("#d_zoom_out").css("top");
	            console.log(y+":"+realY+":"+aaa);
	            if(realY<=0){
	                return false;
	            }
	            if(realY>=113){
	                return false;
	            }
	            $("#pan").css("top",realY + "px");
	            var realzoom = Math.ceil(endLevel - endLevel * realY / (124 - 11));
	            map.getView().setZoom(realzoom);

	        }
	    };
	    document.onmouseup = function () {
	        document.onmousemove = null;
	    };
	    map.getView().on('change:resolution', function (e) {
	        var zommleve = map.getView().getZoom();
	        var high = (endLevel - zommleve) * (124 - 11) / endLevel;
	        $("#pan").css("top",high + "px");
	        $("#pan-l").css({
	            top:high+82+"px",
	            height:124-high+'px'
	        })
	    });
	}
}
olMap.tranProjection=function(proj){
    if(proj=="degree"){
        return 'EPSG:4326';
    }else{
        return 'EPSG:3857';
    }
}
olMap.SetNullMap=function(){
	map = new ol.Map({
        target: 'mapCon'
    });
}
olMap.correctResolutions=function(resolutions){
    if(resolutions){
        for(var i=resolutions.length-2;i>=0;i--){
             if(resolutions[i]<1e-10||(resolutions[i+1]!=0&&(resolutions[i]/resolutions[i+1])!=2)||resolutions[i]>1||resolutions[i]<0){
                resolutions[i]=resolutions[i+1]*2;
            }
        }
    }
}
olMap.setRectShape=function(pro){
	var projection="";
    if(pro=="degree"){
    	projection=this.tranProjection("degree");
    }else{
    	projection=this.tranProjection("meter");
    }
    var projectionExtent = ol.proj.get(projection).getExtent()
    return projectionExtent;
}
olMap.getPGISLayer=function(url,layerName,projection){
	var projectionExtent = ol.proj.get(projection).getExtent();
	var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(21);
    var matrixIds = new Array(21);
    for (var i = 0; i < 21; i++) {
        resolutions[i] = size / Math.pow(2, i);
        matrixIds[i] = i;
    }
    var layer = new ol.layer.Tile({
        source: new ol.source.WMTS({
        	name:layerName,
            url: url,
            tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            }),
            format: 'image/png',
            projection: projection,
            layer:layerName
        })
    });
    return layer;
}
olMap.showMap=function(pro,mc,service,centerX,centerY,zoom,maptype,lx,column){
	var info=new Zondy.Service.GetMapInfoService({mapName:service,ip:ip,port:port});
    info.GetMapInfo(function(data){
    	var projection=olMap.tranProjection(pro);
    	if(maptype==2){
    		olMap.correctResolutions(data.resolutions);
    	}
        var defaultLayer=null;
        if(maptype==1){
			defaultLayer = new Zondy.Map.TileLayer(mc, service, {
		        ip: ip,
		        port: port,
		        isAutoConfig: false,
	        	tileData: data
		    });
        }else if(maptype==2){
			defaultLayer = new Zondy.Map.Doc(mc, service, {
		        ip: ip,
		        port: port
		    });
        }
        defaultLayer.pro=pro;
        defaultLayer.isdefault=true;
        defaultLayer.lx=lx;
        defaultLayer.setZIndex(0);
        defaultLayer.maptype=maptype;
        defaultLayer.data=data;
        defaultLayer.tip=mc;
        defaultLayer.centerX=centerX;
        defaultLayer.centerY=centerY;
        defaultLayer.zoom=zoom;
        if(lx==1){
        	var xmin=data.xMin;
			var xmax=data.xMax;
			var ymin=data.yMin;
			var ymax=data.yMax;
	        var x=centerX,y=centerY;
	        if(centerX==0||centerY==0){
	        	x=(parseFloat(xmin)+parseFloat(xmax))/2;
	    		y=(parseFloat(ymin)+parseFloat(ymax))/2;
	        }
		    var shape=olMap.setRectShape(pro);
		    var view=new ol.View({
		    	projection:projection,
		    	center:[x,y],
		    	minZoom:minZoom,
		    	maxZoom:maxZoom,
		    	extent:shape
		    });
		    map.setView(view);
		    if(zoom>0){
	    		map.getView().setZoom(zoom);
		    }else{
		    	var size=map.getSize();
	    		map.getView().fit([xmin,ymin,xmax,ymax],size);
		    }
        }else{
        	defaultLayer.setVisible(false);
        }
        defaultLayer.column = column;
        map.addLayer(defaultLayer);
	    //$(".ol-zoom.ol-unselectable.ol-control").hide();
	    var high = (maxZoom - map.getView().getZoom()) * (124 - 17) / maxZoom;
	    $("#pan").css("top", high + "px");
	    olMap.zoomPan(maxZoom);
    });
}
olMap.showPGIS=function(url,mc,layerName,centerX,centerY,zoom,lx){
	var projection=olMap.tranProjection("degree");
    var defaultLayer=olMap.getPGISLayer(url,layerName,projection);
    defaultLayer.isdefault=true;
    defaultLayer.lx=lx;
    defaultLayer.setZIndex(0);
    defaultLayer.maptype=1;
    defaultLayer.tip=mc;
    defaultLayer.url=url;
    defaultLayer.layerName=layerName;
    defaultLayer.zoom=zoom;
    defaultLayer.centerX=centerX;
    defaultLayer.centerY=centerY;
    defaultLayer.pro="degree";
    if(lx==1){
	    var shape=olMap.setRectShape("degree");
	    var view= new ol.View({
	          projection: projection,
	          center: [centerX,centerY],
		      minZoom:minZoom,
		      maxZoom:maxZoom,
		      extent:shape
	     });
	    map.setView(view);
	    if(zoom>0){
	    	map.getView().setZoom(zoom);
	    }
	}else{
		defaultLayer.setVisible(false);
	}
	map.addLayer(defaultLayer);
    //$(".ol-zoom.ol-unselectable.ol-control").hide();
    var high = (maxZoom - map.getView().getZoom()) * (124 - 17) / maxZoom;
    $("#pan").css("top", high + "px");
    olMap.zoomPan(maxZoom);
}
olMap.changeMap=function(layer){
	if(map!=null){
		var layers=map.getLayerGroup().getLayers().getArray();
	    for(var i=0;i<layers.length;i++){
	        if(layers[i].default==true){
	            //map.removeLayer(layers[i]);
	            layers[i].setVisible(false);
	            break;
	        }
	    }
	}
	layer.setVisible(true);
	layer.setZIndex(0);
}
//----------------------------------基础目录树-------------------------------
window.basicTree = window.basicTree || {};
basicTree.mapArr=new Array();
basicTree.hideLayer=function(mc){
	var layers=map.getLayerGroup().getLayers().getArray();
	if(mc){
	    for(var i=0;i<layers.length;i++){
	        if(layers[i].tip==mc){
	            layers[i].setVisible(false);
	            break;
	        }
	    }
	}else{
		for(var i=0;i<layers.length;i++){
            layers[i].setVisible(false);
	    }
	}
}
basicTree.addLayer=function(pro,maptype,lx,service,url,mc,zoom,centerx,centery,node,tree){
	var projection=olMap.tranProjection(pro);
	var flag=0;
	var layers=map.getLayerGroup().getLayers().getArray();
	if(layers.length>0){
		for(var i=0;i<layers.length;i++){
			if(layers[i].getVisible()==true){
				flag=1;
			}
		}
	}
	if(flag==1&&map.getView().getProjection().getCode()!=projection){
		alert("坐标系不同无法叠加");
		return;
	}
	if(node){
		tree.tree("check", node.target);
	}
	var layer=this.isExistsLayer(mc);
	if(maptype==3){
		if(layer==null){
			layer=olMap.getPGISLayer(url,service,projection);
		    // if(layer.lx!=0){
		    //    	layer.isdefault=true;
		    //     layer.lx=lx;
		    //     //layer.setZIndex(0);
		    //     //layer.setVisible(false);
		    // }
		    layer.tip=mc;
		    map.addLayer(layer);
		}
		var layers=map.getLayerGroup().getLayers().getArray();
		layer.setZIndex(layers.length);
		layer.setVisible(false);
	    this.setView(pro,centerx,centery,0,0,0,0,zoom,maptype);
	    layer.setVisible(true);
	}else{
		if(layer==null){
			var info=new Zondy.Service.GetMapInfoService({mapName:service,ip:ip,port:port});
			info.GetMapInfo(function(data){
		    	var projection=olMap.tranProjection(pro);
		    	if(maptype==2){
		    		olMap.correctResolutions(data.resolutions);
		    	}
		        if(maptype==1){
					layer = new Zondy.Map.TileLayer(mc, service, {
				        ip: ip,
				        port: port,
				        isAutoConfig: false,
			        	tileData: data
				    });
		        }else if(maptype==2){
					layer = new Zondy.Map.Doc(mc, service, {
				        ip: ip,
				        port: port
				    });
		        }
		        // if(layer.lx!=0){
		        // 	layer.isdefault=true;
		        // 	layer.lx=lx;
		        // 	//layer.setZIndex(0);
		        // 	//layer.setVisible(false);
		        // }
		        var layers=map.getLayerGroup().getLayers().getArray();
		        layer.setZIndex(layers.length);
		        layer.tip=mc;
		        layer.data=data;
		        map.addLayer(layer);
		        var x=centerx,y=centery;
		        var xmin=data.xMin;
				var xmax=data.xMax;
				var ymin=data.yMin;
				var ymax=data.yMax;
		        if(centerx==0||centery==0){
		        	x=(parseFloat(xmin)+parseFloat(xmax))/2;
		    		y=(parseFloat(ymin)+parseFloat(ymax))/2;
		        }
		        layer.setVisible(false);
		        basicTree.setView(pro,x,y,xmin,ymin,xmax,ymax,zoom,maptype);
		        layer.setVisible(true);
		    });
		}else{
			var layers=map.getLayerGroup().getLayers().getArray();
		    layer.setZIndex(layers.length);
		    var x=centerx,y=centery;
		    var xmin=layer.data.xMin;
			var xmax=layer.data.xMax;
			var ymin=layer.data.yMin;
			var ymax=layer.data.yMax;
		    if(centerx==0||centery==0){
		       	x=(parseFloat(xmin)+parseFloat(xmax))/2;
		    	y=(parseFloat(ymin)+parseFloat(ymax))/2;
		    }
		    basicTree.setView(pro,x,y,xmin,ymin,xmax,ymax,zoom,maptype);
		    layer.setVisible(true);
		}	
	}
}
basicTree.setView=function(pro,x,y,xmin,ymin,xmax,ymax,zoom,maptype){
	var projection=olMap.tranProjection(pro);
	var shape=olMap.setRectShape(pro);
    var view=new ol.View({
    	projection:projection,
    	center:[x,y],
    	minZoom:minZoom,
    	maxZoom:maxZoom,
    	extent:shape
    });
    var flag=0;
	var layers=map.getLayerGroup().getLayers().getArray();
	if(layers.length>0){
		for(var i=0;i<layers.length;i++){
			if(layers[i].getVisible()==true){
				flag=1;
			}
		}
	}
    if(flag==0){
    	map.setView(view);
    	if(maptype==3){
			if(zoom>0){
	    		map.getView().setZoom(zoom);
	    	}
    	}else{
			if(zoom>0){
	    		map.getView().setZoom(zoom);
		    }else{
		    	var size=map.getSize();
	    		map.getView().fit([xmin,ymin,xmax,ymax],size);
		    }
    	}
    	var high = (maxZoom - map.getView().getZoom()) * (124 - 17) / maxZoom;
		$("#pan").css("top", high + "px");
		olMap.zoomPan(maxZoom);
    }
    
}
basicTree.isExistsLayer=function(mc){
	var layers=map.getLayerGroup().getLayers().getArray();
	if(layers.length>0){
		for(var i=0;i<layers.length;i++){
			if(layers[i].tip==mc){
				return layers[i];
			}
		}
	}
	return null;
}
basicTree.defaultMap=function(msg,column){
	if(!msg.layer.isNullOrEmpty()){
		if(msg.maptype==1){//瓦片
			olMap.showMap(msg.projection,msg.text,msg.layer,msg.centerx,msg.centery,msg.zoom,msg.maptype,msg.lx,column);
		}else if(msg.maptype==2){//mapx文档
			olMap.showMap(msg.projection,msg.text,msg.layer,msg.centerx,msg.centery,msg.zoom,msg.maptype,msg.lx,column);
		}else if(msg.maptype==3){//PGIS
			olMap.showPGIS(msg.url,msg.text,msg.layer,msg.centerx,msg.centery,msg.zoom,msg.lx,column);
		}
	}
}
basicTree.initTree=function() {
    $('#basictree').tree({
        url:'ajax.php?act=get_show_map',
        onLoadSuccess: function (node, param) {
            $(this).find("span.tree-checkbox").unbind().click(function () {
                $("#basictree").tree("select",$(this).parent());
                return false;
            });
            var n = $('#basictree').tree("getChildren");
            for(var i=0;i<n.length;i++){
                if(n[i].type==1&&n[i].lx!=0){//有默认地图配置
                	basicTree.defaultMap(n[i],1);
                }
            }
            // for(var i=0;i<n.length;i++){
            //     basicTree.addLayer(n[i].maptype,n[i].lx,n[i].layer,n[i].url,n[i].mc)
            // }
            for(var i=0;i<n.length;i++){
                if(n[i].hidden==true){
                    $('#basictree').tree("remove", n[i].target);
                }
            }
        },
        onSelect: function (node) {
            if(map==null){
                map = new ol.Map({
                    target: 'mapCon'
                });
            }
            var n = $('#basictree').tree("getRoot", node.target);
            if (node.type == 1) {
                if (node.checked == true) {
                    $('#basictree').tree("uncheck", node.target);
                    basicTree.hideLayer(node.text);
                }else{
                    
                    basicTree.addLayer(node.projection,node.maptype,node.lx,node.layer,node.url,node.text,node.zoom,node.centerx,node.centery,node,$('#basictree'));
                }
            }
        },
        onCheck: function (node, checked) {

        }
    });
}