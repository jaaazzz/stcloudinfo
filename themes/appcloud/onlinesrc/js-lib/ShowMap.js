function initOnlineMap(){
    ShowMap.initTree();
    defaultMap.initLayer();
}
window.ShowMap = window.ShowMap || {};
ShowMap.initTree=function() {
    $('#Tree').tree({
        // url: 'themes/appcloud/onlinesrc/tree-new.json',
        url:'ajax.php?act=get_show_map',
        onLoadSuccess: function (node, param) {
            $(this).find("span.tree-checkbox").unbind().click(function () {
                $("#Tree").tree("select",$(this).parent());
                return false;
            });
            var n = $('#Tree').tree("getChildren");
            for(var i=0;i<n.length;i++){
                if(n[i].type==1&&n[i].lx=="1"&&n[i].isdefault==true){
                    data.showMapSL = n[i];
                    data.SL=n[i].layer;
                    data.defaultMapSL=n[i].layer;
                    data.maptypeSL=n[i].maptype;
                    data.projection = n[i].projection=="meter"?"EPSG:3857":"EPSG:4326";
                    data.xCenter=n[i].centerx;
                    data.yCenter=n[i].centery;
                    center=[n[i].centerx,n[i].centery];
                    data.TDTcenter = center;
                    data.dfnode = n[i];
                    data.zoom=n[i].zoom;
                    data.TDTzoom = n[i].zoom;
                    data.maptype=n[i].maptype;
                    if(n[i].maptype=="5"){
                        data.maxzoom=n[i].maxzoom;
                        data.minzoom=n[i].minzoom;
                        data.url=n[i].url;
                        data.wmslayer=n[i].wmslayer;
                    }
                    ShowMap.getMapInfo(data.showMapSL);
                    break;
                }
            }
            for(var i=0;i<n.length;i++){
                if(n[i].type==1&&n[i].lx=="2"&&n[i].isdefault==true){
                    data.showMapYX = n[i];
                    data.YX=n[i].layer;
                    data.defaultMapYX=n[i].layer;
                    data.maptypeYX=n[i].maptype;
                    data.projectionYX = n[i].projection=="meter"?"EPSG:3857":"EPSG:4326";
                    if(n[i].maptype=="5"){
                        data.maxzoomyx=n[i].maxzoom;
                        data.minzoomyx=n[i].minzoom;
                        data.urlyx=n[i].url;
                        data.wmslayeryx=n[i].wmslayer;
                    }
                }else if(n[i].type==1&&n[i].lx=="3"&&n[i].maptype=="2"&&n[i].isdefault==true){
                    data.showMapSW = n[i];
                    data.globe3d=n[i].layer;
                }else if(n[i].type==1&&n[i].lx=="4"&&(n[i].maptype=="1"||n[i].maptype=="5")&&n[i].isdefault==true){
                    data.MapRelief=n[i].layer;
                    data.defaultMapRelief=n[i].layer;
                    data.projectiondx = n[i].projection=="meter"?"EPSG:3857":"EPSG:4326";
                    if(n[i].maptype=="5"){
                        data.maxzoomdx=n[i].maxzoom;
                        data.minzoomdx=n[i].minzoom;
                        data.urldx=n[i].url;
                        data.wmslayerdx=n[i].wmslayer;
                    }
                }
                // data.maptype=n[i].maptype;
            }
            for(var i=0;i<n.length;i++){
                if(n[i].hidden==true){
                    $('#Tree').tree("remove", n[i].target);
                }
            }
        },
        onSelect: function (node) {
            if(map==null){
                map = new ol.Map({
                    //目标DIV
                    target: 'mapCon'
                });
                var zoomslider = new ol.control.ZoomSlider(); 
                map.addControl(zoomslider);
            }
            data.maptype = node.maptype;
            // var flag = true;
            var n = $('#Tree').tree("getRoot", node.target);
            var nodes = $('#Tree').tree("getChecked");
            var checked = null;
            for(var i=0;i<nodes.length;i++){
                if(nodes[i].type==1 && nodes[i].layer==node.layer){
                    checked = nodes[i];
                }
            }
            if(checked != null){
                var flag = true;
                for(var i=0;i<data.showMap.length;i++){
                    if(data.showMap[i].layer==checked.layer&&data.showMap[i].show){
                        // center = [data.showMap[i].centerx,data.showMap[i].centery];
                        // node = data.showMap[i];
                        checked = data.showMap[i];
                        data.showMap.splice(i,1);
                        // flag = false;
                        break;
                    }
                }
                var view = map.getView();
                var center = view.getCenter();
                checked.centerx = center[0];
                checked.centery = center[1];
                checked.zoom = view.getZoom();
                checked.show = true;
                data.showMap.push(checked);
            }
            if (node.type == 1) {//选择的是最子节点数据层
                // $('#Tree').tree("uncheck", n.target);
                if (node.checked == true) {
                    var layers=map.getLayerGroup().getLayers().getArray();
                    for(var i=0;i<layers.length;i++){
                        if(layers[i].layerName==node.layer){
                        //if(layers[i].tip!="basic"){
                            map.removeLayer(layers[i]);
                            break;
                        }
                    }
                    if(data.maptypeSL=="5"){
                        center = data.TDTcenter;
                    }else{
                        center = data.defaultcenter;
                    }
                    $('#Tree').tree("uncheck", node.target);
                    for(var i=0;i<data.showMap.length;i++){
                        if(data.showMap[i].layer==node.layer&&data.showMap[i].show){
                            // center = [data.showMap[i].centerx,data.showMap[i].centery];
                            node = data.showMap[i];
                            // flag = false;
                            break;
                        }
                    }
                    node.show = true;
                    // ShowMap.changeMapNew(node);
                    data.maptype = data.maptypeSL;
                    // map.getView().setZoom(11);
                    // restore();
                    //ShowMap.changeMap(null,node.type);
                    
                } else {
                    center = [node.centerx,node.centery];
                    if(data.defaultcenter==null||data.defaultcenter==undefined){
                        data.defaultcenter = map.getView().getCenter();
                    }
                    ShowMap.changeMapNew(node);
                    $('#Tree').tree("check", node.target);
                    //ShowMap.changeMap(node.layer,node.type);
                    
                }
            } else {
                var childnodes = $('#Tree').tree("getChildren", node.target);
                if (childnodes.length == 1) {
                    $('#Tree').tree("uncheck", n.target);
                    if (node.checked == true) {
                        ShowMap.changeMapNew(childnodes[0]);
                        $('#Tree').tree("uncheck", node.target);
                        
                    } else {
                        ShowMap.changeMapNew(childnodes[0]);
                        $('#Tree').tree("check", node.target);
                        
                    }
                } else {
                    var index=0;
                    var leafNode;
                    for(var i in childnodes){
                        var f=$('#Tree').tree("isLeaf", childnodes[i].target);
                        if(f==true){
                            index++;
                            leafNode=childnodes[i];
                        }
                    }
                    if (node.checked == false&&index>1) {
                        alert("只允许选择单个图层");
                    }else if(node.checked == true){
                        ShowMap.changeMapNew(leafNode);
                        $('#Tree').tree("uncheck", node.target);
                    }else{
                        $('#Tree').tree("uncheck", n.target);
                        ShowMap.changeMapNew(leafNode);
                        $('#Tree').tree("check", node.target);
                    }
                }
            }
        },
        onCheck: function (node, checked) {

        }
    });
}
ShowMap.getTDTLayer=function(projection,url,layer){
    // alert(projection+":"+url+":"+layer);
    var pro;
    if(projection=="meter"){
        pro='EPSG:3857'
    }else{
        pro='EPSG:4326';
    }
    var projectionExtent = [-180, -90, 180, 90];
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(21);
    var matrixIds = new Array(21);
    for (var z = 0; z < 21; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }
    //baseUrlTile = "http://192.168.84.4:9080/PGIS_S_TileMapServer/Maps/funing"; 
    TileLayer = new ol.layer.Tile({
        source: new ol.source.WMTS({
            url: url+"?random="+(new Date().getTime().toString()),
            tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            }),
            format: 'image/png',
            projection: pro,
            layer:layer
        })
    });
    data.TDTtile = TileLayer;
    TileLayer.default=true;
    // alert(TileLayer.default);
    TileLayer.projection=pro;
    TileLayer.zdyres=resolutions;
    return TileLayer;
}
ShowMap.TDT=function(projection,url,layer,centerx,centery,maxzoom,minzoom){
    TileLayer=this.getTDTLayer(projection,url,layer);
    var view= new ol.View({
            projection: TileLayer.projection,
            center: [centerx,centery],
            //最大显示级数
            maxZoom: maxzoom,
            //最小显示级数
            minZoom: minzoom,
            zoom:data.zoom,
            //当前显示级数
           maxResolution:TileLayer.zdyres[0]
        });
    if(map==null){
        map = new ol.Map({
        //目标DIV
            target: 'mapCon',
            //将图层添加到地图容器
            layers: [TileLayer],
            view: view
        });
    }else{
        map.setView(view);
    }
    
    // map.getView().fit([-180, -90, 180, 90],map.getSize());
}
ShowMap.getMapInfo=function(node){
    if(node.maptype==1){
        var info=new Zondy.Service.GetMapInfoService({mapName:node.layer,ip:ip,port:port});
        info.GetMapInfo(function(data){
            //dataInfo=data;
            ShowMap.initMap(node.layer,data,node.projection,node);
            addPop();
            
        });
    }else if(node.maptype==5){
        this.TDT(node.projection,node.url,node.wmslayer,node.centerx,node.centery,node.maxzoom,node.minzoom);
        TileLayer.default=true;
        var zoomslider = new ol.control.ZoomSlider(); 
        map.addControl(zoomslider);
        $('.ol-zoom-in').html('');
        $('.ol-zoom-out').html('');
      //  map.getView().setZoom(node.zoom);
        data.defaultcenter = map.getView().getCenter();
        addPop();
    }
    
}
function addPop(){
    var container = document.getElementById('popup');
    popup = new ol.Overlay(
        /** @type {olx.OverlayOptions} */
            ({
                //要转换成overlay的HTML元素
                element: container,
                //当前窗口可见
                autoPan: true,
                //Popup放置的位置
                positioning: 'bottom-center',
                offset: [0, 10],
                //是否应该停止事件传播到地图窗口
                stopEvent: true,
                autoPanAnimation: {
                //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
                duration: 250
                }
            })
        );
    map.addOverlay(popup);
}
var TileLayer = null;
//var dataInfo;
//地图初始化函数
ShowMap.initMap = function(TileName,data,projection,node) {
    var pro;
    if(projection=="meter"){
        pro='EPSG:3857'
    }else{
        pro='EPSG:4326';
    }
    var xmin=data.xMin;
    var xmax=data.xMax;
    var ymin=data.yMin;
    var ymax=data.yMax;
    var startLevel=data.startLevel;
    var endLevel=data.endLevel;
    var xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
    var yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
    zoom=node.zoom;
    if(node.centerx!=0&&node.centerx!=""&&node.centerx!=undefined&&node.centery!=0&&node.centery!=""&&node.centery!=undefined){
        xCenter=node.centerx;
        yCenter=node.centery;
    }
    if(node.maxzoom!=0&&node.minzoom!=0){
        startLevel = node.minzoom;
        endLevel = node.maxzoom;
    }
    TileLayer = new Zondy.Map.TileLayer(TileName, TileName, {
        ip: ip,
        port: port
    });
    TileLayer.default=true;
    map = new ol.Map({
        //目标DIV
        target: 'mapCon',
        //将图层添加到地图容器
        layers: [TileLayer],
        view: new ol.View({
            projection: pro,
            center: [xCenter,yCenter],
            //最大显示级数
            maxZoom: endLevel,
            //最小显示级数
            minZoom: startLevel,
            //当前显示级数
            //zoom: startLevel
            maxResolution:data.resolutions[0]
        })
    });
    //实例化ZoomSlider控件并加载到地图容器中
    var zoomslider = new ol.control.ZoomSlider(); 
    map.addControl(zoomslider);
    $('.ol-zoom-in').html('');
    $('.ol-zoom-out').html('');
    //view= map.getView();
    //zoom= view.getZoom();
    //center= view.getCenter();
    //rotation= view.getRotation();
    $('.show').find('span').addClass('choose');
    var size=map.getSize();
    map.getView().fit([xmin,ymin,xmax,ymax],size);
    if(zoom!=0&&zoom!=""&&zoom!=undefined){
        map.getView().setZoom(zoom);
    }else{
        map.getView().setZoom(startLevel);
    }
    map.getView().setCenter([xCenter,yCenter]);
    data.defaultcenter = map.getView().getCenter();
}
ShowMap.changeMapNew = function(node){
    // var layers=map.getLayerGroup().getLayers().getArray();
    // for(var i=0;i<layers.length;i++){
    //     if(layers[i].default!=true){
    //     //if(layers[i].tip!="basic"){
    //         map.removeLayer(layers[i]);
    //         i=0;
    //     }
    // }
    if(node.checked==false){
        var mapService = node.layer;
        var mapName=node.text;
        var xCenter=node.centerx;
        var yCenter=node.centery;
        var zoom = node.zoom;
        var projection;
        if(node.projection=="meter"){
            projection='EPSG:3857'
        }else{
            projection='EPSG:4326';
        }
        if(node.lx==3){
            window.location.href="themes/appcloud/onlinesrc/globe.php?ip="+ip+"&port="+port+"&globe="+node.layer+"&model="+node.surface;
        }else{
            var view = map.getView();
            if(mapService!=null&&mapService!=""){
                 var serviceLayer;
                if(node.maptype==1){
                    serviceLayer = new Zondy.Map.TileLayer(mapName, mapService, {
                        ip: ip,
                        port: port
                    });
                }else if(node.maptype==2){
                    serviceLayer = new Zondy.Map.Doc(mapName, mapService, {
                        ip: ip,
                        port: port
                        //ratio:1
                    });
                }else if(node.maptype==3){
                    var url=node.url;
                    //url = 'http://192.168.10.67:6080/arcgis/rest/services/world0428/MapServer';
                    serviceLayer = new ol.layer.Tile({
                          source: new ol.source.TileArcGISRest({
                             url: url,
                             wrapX:false
                          })
                      });
                    serviceLayer.name=mapService;
                }else if(node.maptype==4){
                    var url=node.url;
                    //url='https://ahocevar.com/geoserver/wms';
                    var wmslayer=node.wmslayer;
                    //wmslayer=
                    var wmsSource = new ol.source.TileWMS({
                        url: url,
                        params: { 'LAYERS': 'ne:ne'}
                        //serverType: 'geoserver',
                        //crossOrigin: 'anonymous'
                    });
                    serviceLayer = new ol.layer.Tile({
                        source: wmsSource
                    });
                }else if(node.maptype==5){
                    this.TDT(node.projection,node.url,node.wmslayer,node.centerx,node.centery,node.maxzoom,node.minzoom);
                }

                var flag=false;
                var layers=map.getLayerGroup().getLayers().getArray();
                for(var i=0;i<layers.length;i++){
                    if(layers[i].name==mapService){
                        flag=true;
                    }
                }
                if(flag==false&&serviceLayer){
                    serviceLayer.tip="basic";
                    map.addLayer(serviceLayer);
                }
                var info=null;
                if(node.maptype==2){
                    info=new Zondy.Service.GetMapInfoService({mapName:mapService,ip:ip,port:port,type:"vector"});
                }else if(node.maptype==1){
                    info=new Zondy.Service.GetMapInfoService({mapName:mapService,ip:ip,port:port});
                }
                
                if(xCenter==0||yCenter==0||xCenter==""||yCenter==""||xCenter==undefined||yCenter==undefined){
                    if(node.maptype==1||node.maptype==2){
                        info.GetMapInfo(function(data){
                                var xmin=data.xMin;
                                var xmax=data.xMax;
                                var ymin=data.yMin;
                                var ymax=data.yMax;
                                var startLevel=data.startLevel;
                                var endLevel=data.endLevel;
                                if(xCenter==0||xCenter==undefined||xCenter==""){
                                    xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
                                }
                                if(yCenter==0||yCenter==undefined||yCenter==""){
                                    yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
                                }
                                center=[xCenter,yCenter];
                                if(node.maptype==1){
                                    view=new ol.View({
                                        projection: projection,
                                        center: [xCenter,yCenter],
                                        //最大显示级数
                                        maxZoom: endLevel,
                                        //最小显示级数
                                        minZoom: startLevel,
                                        //当前显示级数
                                        //zoom: zoom
                                        maxResolution:data.resolutions[0]
                                    })
                                    map.setView(view);
                                    var size=map.getSize();
                                    view.fit([xmin,ymin,xmax,ymax],size);
                                    if(zoom!=0&&zoom!=undefined&&zoom!=""){
                                        map.getView().setZoom(zoom);
                                    }else{
                                        map.getView().setZoom(startLevel);
                                    }
                                }else{
                                    view=new ol.View({
                                        projection: projection,
                                        center: [xCenter,yCenter],
                                        //最大显示级数
                                        maxZoom: 28,
                                        //最小显示级数
                                        minZoom: 0
                                        //当前显示级数
                                        //zoom: 5
                                    })
                                    var size=map.getSize();
                                    map.setView(view);
                                    view.fit([xmin,ymin,xmax,ymax],size);
                                    if(zoom!=0&&zoom!=undefined&&zoom!=""){
                                        map.getView().setZoom(zoom);
                                    }
                                }
                        });
                    }
                }else{
                    if(node.maptype==5){
                        view=new ol.View({
                            projection: projection,
                            center: center,
                            //最大显示级数
                            //maxZoom: endLevel,
                            maxZoom: parseInt(node.maxzoom),
                            //最小显示级数
                            //minZoom: startLevel,
                            minZoom: parseInt(node.minzoom),
                            //当前显示级数
                            zoom: parseInt(zoom)
                            // maxResolution:data.resolutions[0]

                        })
                        map.setView(view);
                    }else{
                        center=[xCenter,yCenter];
                        info.GetMapInfo(function(data){
                            var startLevel=data.startLevel;
                            var endLevel=data.endLevel;
                            view=new ol.View({
                                projection: projection,
                                center: center,
                                //最大显示级数
                                //maxZoom: endLevel,
                                maxZoom: parseInt(node.maxzoom),
                                //最小显示级数
                                //minZoom: startLevel,
                                minZoom: parseInt(node.minzoom),
                                //当前显示级数
                                zoom: parseInt(zoom),
                                maxResolution:data.resolutions[0]

                            })
                            map.setView(view);
                            if(zoom!=0&&zoom!=undefined&&zoom!=""){
                                map.getView().setZoom(parseInt(zoom));
                            }else{
                                map.getView().setZoom(startLevel);
                            }
                        });
                    }
                } 
            }
        }
    }else{
        var layers=map.getLayerGroup().getLayers().getArray();
        for(var i=0;i<layers.length;i++){
            if(layers[i].name==node.layer){
                map.removeLayer(layers[i]);
                break;
            }
        }
    }
}

ShowMap.changedefaultMap = function(mapName,type,maptype,url){
    if(type==3){
        window.location.href="themes/appcloud/onlinesrc/globe.php?ip="+ip+"&port="+port+"&globe="+data.globe3d;
    }else{
        if(mapName!=null&&mapName!=""){
            var view = map.getView();
            // var centerXY=center.toString().split(",");
            // var x=centerXY[0];
            // var y=centerXY[1];
            
            var zoom = view.getZoom();
            // alert(zoom);
            // zoom = [data.zoom];
            var layers=map.getLayerGroup().getLayers().getArray();
            var bslayer=null;
            var themelayerArr=new Array();
            var markerlayer=null;
            for(var i=0;i<layers.length;i++){
                if(layers[i].tip=="basic"){
                    bslayer=layers[i];
                }
                if(layers[i].tip=="theme"){
                    themelayerArr.push(layers[i]);
                }
                if(layers[i].tip=="marker"){
                    markerlayer=layers[i];
                }
                // if(layers[i].tip!="marker"&&layers[i].tip!="theme"){
                //     map.removeLayer(layers[i]);
                //     i=0;
                // }else{
                //     i=i+1;
                // }
                map.removeLayer(layers[i]);
                i=-1;
            }
            var projection="";
            if(type==1){
                projection=data.projection;
            }else if(type==2){
                projection=data.projectionYX;
            }else{
                projection=data.projectiondx;
            }
            // alert(maptype);
            if(maptype==5){
                TileLayer=this.getTDTLayer(projection,url,data.wmslayer);
            }else{
                TileLayer = new Zondy.Map.TileLayer(mapName, mapName, {
                    ip: ip,
                    port: port
                });
            }
            TileLayer.default=true;
            map.addLayer(TileLayer);
            // alert(bslayer);
            if(bslayer!=null){
                bslayer.tip="basic";
                map.addLayer(bslayer);
            }
            if(markerlayer!=null){
                markerlayer.tip="marker";
                map.addLayer(markerlayer);
            }
            for(var i in themelayerArr){
                themelayerArr[i].ip="theme";
                map.addLayer(themelayerArr[i]);
            }
            // alert(data.minzoom);
            if(maptype==5){
                // alert(data.zoom);
                center = data.TDTcenter;
                var new_view=new ol.View({
                    projection: projection,
                    center: data.TDTcenter,
                    //最大显示级数
                    maxZoom: data.maxzoom,
                    //最小显示级数
                    minZoom: data.minzoom,
                    zoom:data.TDTzoom,
                    //当前显示级数
                    maxResolution:TileLayer.zdyres[0]
                });
                map.setView(new_view);
                map.getView().setCenter(center);
                // map.getView().setZoom(data.zoom);
            }else{
                var old_center = map.getView().getCenter();
                var old_zoom = map.getView().getZoom();
                var info=new Zondy.Service.GetMapInfoService({mapName:mapName,ip:ip,port:port});
                info.GetMapInfo(function(data){
                    var xmin=data.xMin;
                    var xmax=data.xMax;
                    var ymin=data.yMin;
                    var ymax=data.yMax;
                    center = [(xmin+xmax)/2,(ymin+ymax)/2];
                    var startLevel=data.startLevel;
                    var endLevel=data.endLevel;
                    var new_view=new ol.View({
                        projection: projection,
                        //最大显示级数
                        maxZoom: endLevel,
                        //最小显示级数
                        minZoom: startLevel,
                        //当前显示级数
                        //zoom: zoom
                        maxResolution:data.resolutions[0]
                    })
                    map.setView(new_view);
                   //var size=map.getSize();
                    //view.fit([xmin,ymin,xmax,ymax],size);
                    map.getView().setCenter(old_center);
                    map.getView().setZoom(old_zoom);
                });
            }
        }
        
    }
     // var node=$('#Tree').tree("getChildren");
     // for(var i=0;i<node.length;i++){
     //     if(node[i].layer==mapName){
     //        for(var j in node){
     //            $('#Tree').tree("uncheck",node[j].target);
     //        }
     //         $('#Tree').tree("check",node[i].target);
     //         break;
     //     }else{
     //         $('#Tree').tree("uncheck",node[i].target);
     //     }
     // }
}
ShowMap.initLayer = function(){
    $("#layerDiv div").eq(1).attr("select",true);
    $("#layerDiv div").eq(1).addClass("layerSelect");
    $("#layerDiv div").eq(1).find(".layerTitle").addClass("layerTitleSelect");
    $("#layerDiv div").hover(function(){
        $(this).addClass("layerHover");
        $(this).find(".layerTitle").addClass("layerTitleHover");
        $("#layerDiv div").css("display","block"); 
    },function(){
        $(this).removeClass("layerHover");
        $(this).find(".layerTitle").removeClass("layerTitleHover");
        $('.layerSelect').siblings().css("display","none");
    })
    $("#layerDiv div").click(function(){
        var indSelect=$(this).index();
        var oldindSelect=$("#layerDiv div[select='true']").index();
        var f=indSelect==oldindSelect?true:false;
        $("#layerDiv div").attr("select",false);
        $("#layerDiv div").removeClass("layerSelect");
        $("#layerDiv .layerTitle").removeClass("layerTitleSelect");
        $(this).css({'float':'right'}).siblings().css({'float':'left'});
        ShowMap.selectLayer($(this),f);

    });
}
ShowMap.selectLayer = function(selectDiv,f){
//        var layer = map.getLayers().getArray();
//        alert(layer[0].name);
    // selectDiv.attr("select",true);
    // selectDiv.addClass("layerSelect");
    // selectDiv.find(".layerTitle").addClass("layerTitleSelect");
    if(f==true){
        var v=selectDiv.attr("value");
        if(v=="on"){
            selectDiv.attr("value","off");
        }else if(v=="off"){
            selectDiv.attr("value","on");
        }
    }else{
        selectDiv.attr("value","on");
    }
    // alert(data.maptype);
    var layerIndex = selectDiv.attr("layerIndex");
    if(layerIndex==1){
        $("#layerDiv div").eq(1).attr("select",true);
        $("#layerDiv .layerTitle").eq(1).addClass("layerTitleSelect");
        $("#layerDiv div").eq(1).addClass("layerSelect");
        if(selectDiv.attr("value")=="on"){
            ShowMap.changedefaultMap(data.defaultMapSL,1,data.maptype,data.url);
        }else if(selectDiv.attr("value")=="off"){
            map.removeLayer(TileLayer);
            selectDiv.find("span").removeClass("layerTitleSelect");
        }
    }else if(layerIndex==2){
        $("#layerDiv div").eq(0).attr("select",true);
        $("#layerDiv .layerTitle").eq(0).addClass("layerTitleSelect");
        $("#layerDiv div").eq(0).addClass("layerSelect");
        if(selectDiv.attr("value")=="on"){
           ShowMap.changedefaultMap(data.defaultMapYX,2,data.maptype,data.urlyx)
        }else if(selectDiv.attr("value")=="off"){
            map.removeLayer(TileLayer);
            selectDiv.find("span").removeClass("layerTitleSelect");
        }
    }

    
    
    // }else if(layerIndex==3){
    //     ShowMap.changedefaultMap("球状三维",layerIndex);
    // }else if(layerIndex==4){
    //     $("#layerDiv div").eq(1).attr("select",true);
    //     $("#layerDiv .layerTitle").eq(1).addClass("layerTitleSelect");
    //     $("#layerDiv div").eq(1).addClass("layerSelect");
    //     ShowMap.changedefaultMap(data.defaultMapRelief,4);
    // }
}
// ShowMap.show3d=function(){
//     $("#mapCon").hide();
//     $("#layerDiv").hide();
//     $("#mapControl").show();
//     $("#mapselect").show();
// }

