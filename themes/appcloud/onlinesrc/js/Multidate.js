window.Multidate = window.Multidate || {};
var map1=null, map2=null;
var LayerArr;

//
Multidate.showMultidate = function() {
    $('.eee').toggle();
    $('.vvv').toggle();
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    $('#multi').css('display','block');
    if($('#multi').attr("value")==0){//如果多时相没有初始化则初始化
        $('#multi').css('left','0px');
        $('#multi').css('width','100%');
        $('#map1').css('width','50%');
        $('#map2').css('width','50%');
        Multidate.init();
        $('#multi').attr("value",1);
    }
    if($('#swipe').attr('show')==1){//卷帘跳转到多时相界面
        $('.ddd').toggle();
        $('.xxx').toggle();
        $('#swipe').attr('show',0);
        $('#swipe').hide();
        $('#multi').css('left','0px');
        $('#multi').css('width','100%');
        $('#map1').css('width','50%');
        $('#map2').css('width','50%');
        $('#layerDiv').hide();
        $('#mapCon').hide();
        $('#swipe').hide();
        $('#multi').attr('show',1);
        $('#searchbox').hide();
        $('#multi').attr('show',1);
        if(TileLayer1!=null&&TileLayer2!=null){
            map.removeLayer(TileLayer1);
            map.removeLayer(TileLayer2);
        }
    }else{
        $('.left-box').toggle();
        if($('#multi').attr('show')==0){//显示多时相
            $('.do').hide();
            $('#multi').css('left','0px');
            $('#multi').css('width','100%');
            $('#map1').css('width','50%');
            $('#map2').css('width','50%');
            $('#layerDiv').hide();
            $('#mapCon').hide();
            $('#swipe').hide();
            $('#multi').attr('show',1);
            $('#searchbox').hide();
        }else if($('#multi').attr('show')==1){//关闭多时相
            $('.do').show();
            $('.navbar-wrapper').show();
            $('#multi').hide();
            $('#mapCon').show();
            $('#layerDiv').show();
            $('#searchbox').show();
            $('#multi').attr('show',0);
            $('#mapCon').css('left','320px');
            var f=false;
            var layers=map.getLayerGroup().getLayers().getArray();
            for(var i=0;i<layers.length;i++){
                if(layers[i].default==true){
                    f=true;
                }
            }
            if(f==false){
                map.addLayer(TileLayer);
            }
            var info=new Zondy.Service.GetMapInfoService({mapName:data.defaultMapSL,ip:ip,port:port});
            info.GetMapInfo(function(result){
                var xmin=result.xMin;
                var xmax=result.xMax;
                var ymin=result.yMin;
                var ymax=result.yMax;
                var startLevel=result.startLevel;
                var endLevel=result.endLevel;
                var view = new ol.View({
                    projection: data.projection,
                    //center: [xCenter,yCenter],
                        //最大显示级数
                    maxZoom: endLevel,
                        //最小显示级数
                    minZoom: startLevel,
                        //当前显示级数
                    maxResolution:result.resolutions[0]
                });
                map.setView(view);
                var size=map.getSize();
                view.fit([xmin,ymin,xmax,ymax],size);
                if(data.zoom!=0&&data.zoom!=""&&data.zoom!=undefined){
                    map.getView().setZoom(data.zoom);
                }else{
                    map.getView().setZoom(startLevel);
                }
                if(data.xCenter!=0&&data.xCenter!=""&&data.xCenter!=undefined&&data.yCenter!=0&&data.yCenter!=""&&data.yCenter!=undefined){
                    map.getView().setCenter([data.xCenter,data.yCenter]);
                }
            });
            map.setTarget();
            map.setTarget($("#mapCon").get(0));
        }
    }
    
}
var layer1, layer2;
Multidate.init=function () {
    var option = "";
    $.ajax({
        url: 'themes/appcloud/onlinesrc/multi.json',
        type:"POST",
        data:{},
        dataType:"json",
        success:function(msg){
            var projection;
            if(msg[0].projection=="meter"){
                projection="EPSG:3857";
            }else{
                projection="EPSG:4326";
            }
            $(msg).each(function(i,item){
                 option += "<option value='"+item.layer+"' type='"+item.lx+"'>"+item.text+"</option>";
                 if(item.default =='left'){
                    data.multileft=item.layer;
                    data.multicenterx=item.centerx;
                    data.multicentery=item.centery;
                    data.multizoom=item.zoom;
                 }
                 if(item.default =='right'){
                    data.multiright=item.layer;
                 }
                 
            });
            $('#LayerSelect1').append(option);
            $('#LayerSelect2').append(option);
            $('#multi').show();
            layer1 = new Zondy.Map.TileLayer(data.multileft, data.multileft, {
                ip: ip,
                port: port
            });
            
            layer2 = new Zondy.Map.TileLayer(data.multiright, data.multiright, {
                ip: ip,
                port: port
            });
            var multiview;
            // if(data.multicenterx!=0&&data.multicenterx!=""&&data.multicenterx!=undefined&&data.multicentery!=0&&data.multicentery!=""&&data.multicentery!=undefined){
            //     multiview = new ol.View({
            //         projection: projection,
            //         center: [data.multicenterx,data.multicentery]
            //             //最大显示级数
            //         // maxZoom: endLevel,
            //             //最小显示级数
            //         // minZoom: startLevel,
            //             // 当前显示级数
            //         //zoom: data.multizoom
            //     });
            // }else{
                var info=new Zondy.Service.GetMapInfoService({mapName:data.multileft,ip:ip,port:port});
                info.GetMapInfo(function(result){
                    var xmin=result.xMin;
                    var xmax=result.xMax;
                    var ymin=result.yMin;
                    var ymax=result.yMax;
                    var startLevel=result.startLevel;
                    var endLevel=result.endLevel;
                    var multixCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
                    var multiyCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
                    var multizoom=0;
                    var center;
                    if(data.multicenterx!=0&&data.multicenterx!=""&&data.multicenterx!=undefined&&data.multicentery!=0&&data.multicentery!=""&&data.multicentery!=undefined){
                        center=[data.multicenterx,data.multicentery]
                    }else{
                        center=[multixCenter,multiyCenter];
                    }
                    if(data.multizoom!=0&&data.multizoom!=""&&data.multizoom!=undefined){
                        multizoom=data.multizoom
                    }else{
                        multizoom=startLevel;
                    }
                    multiview = new ol.View({
                        projection: projection,
                        center: center,
                            //最大显示级数
                        maxZoom: endLevel,
                            //最小显示级数
                        minZoom: startLevel,
                            //当前显示级数
                        zoom: multizoom
                    });
                    map1 = new ol.Map({
                        controls: ol.control.defaults({
                            attribution: false
                        }),
                        target: 'map1',
                        layers: [layer1],
                        view: multiview
                    });
                    map2 = new ol.Map({
                        controls: ol.control.defaults({
                            attribution: false
                        }),
                        target: 'map2',
                        layers: [layer2],
                        view: multiview
                    });
                });
            //}
            // map1 = new ol.Map({
            //     controls: ol.control.defaults({
            //         attribution: false
            //     }),
            //     target: 'map1',
            //     layers: [layer1],
            //     view: multiview
            // });
            // map2 = new ol.Map({
            //     controls: ol.control.defaults({
            //         attribution: false
            //     }),
            //     target: 'map2',
            //     layers: [layer2],
            //     view: multiview
            // });
        },
        error:function(e){
            
        }
    });
}

Multidate.changeMapDouble=function (mapType, type) {
    if (mapType == 'map1') {
        if (type == 'vec') {
            var flag=false;
            var layers=map1.getLayerGroup().getLayers().getArray();
            for(var j=0;j<layers.length;j++){
                if(layers[j].name==layer1.name){
                    flag=true;
                }
                if(layers[j].name==layer2.name||(layerchange!=null&&layers[j].name==layerchange.name)){
                    map1.removeLayer(layers[j]);
                    j=0;
                }
            }
            if(flag==false){
                map1.addLayer(layer1);
            }
        } else {
            var flag=false;
            var layers=map1.getLayerGroup().getLayers().getArray();
            for(var j=0;j<layers.length;j++){
                if(layers[j].name==layer2.name){
                    flag=true;
                }
                if(layers[j].name==layer1.name||(layerchange!=null&&layers[j].name==layerchange.name)){
                      map1.removeLayer(layers[j]);
                      j=0;
                }
            }
            if(flag==false){
                map1.addLayer(layer2);
            }
        }
    } else {
        if (type == 'vec') {
         var flag=false;
            var layers=map2.getLayerGroup().getLayers().getArray();
            for(var j=0;j<layers.length;j++){
                if(layers[j].name==layer1.name){
                    flag=true;
                }
                if(layers[j].name==layer2.name||(layerchange!=null&&layers[j].name==layerchange.name)){
                    map2.removeLayer(layers[j]);
                    j=0;
                }            }
            if(flag==false){
                map2.addLayer(layer1);
            }
        } else {
            var flag=false;
            var layers=map2.getLayerGroup().getLayers().getArray();
            for(var j=0;j<layers.length;j++){
                if(layers[j].name==layer2.name){
                    flag=true;
                }
                if(layers[j].name==layer1.name||(layerchange!=null&&layers[j].name==layerchange.name)){
                      map2.removeLayer(layers[j]);
                      j=0;
                }
            }
            if(flag==false){
                map2.addLayer(layer2);
            }
        }
    }

}
//图层切换函数
var layerchange=null;
Multidate.changeLayer=function (mapType) {
    if (mapType == 'map1') {
        var layers=map1.getLayerGroup().getLayers().getArray();
        for(var i=0;i<layers.length;i++){
            map1.removeLayer(layers[i]);
            i=-1;
        }
        layerchange=null;
        var name = $("#LayerSelect1").val();
        var type = $("#LayerSelect1").children("option:selected").attr('type');
        if(type==1){
            layerchange = new Zondy.Map.Doc(name, name, {
                ip: ip,
                port: port
            });
        }else if(type==2){
            layerchange = new Zondy.Map.TileLayer(name, name, {
                ip: ip,
                port: port
            }); 
        }
        map1.addLayer(layerchange);
    } else {
        var layers=map2.getLayerGroup().getLayers().getArray();
        for(var i=0;i<layers.length;i++){
            map2.removeLayer(layers[i]);
            i=-1;
        }
        layerchange=null;
        var name = $("#LayerSelect2").val();
        var type = $("#LayerSelect2").children("option:selected").attr('type');
        if(type==1){
            layerchange = new Zondy.Map.Doc(name, name, {
                ip: ip,
                port: port
            });
        }else if(type==2){
            layerchange = new Zondy.Map.TileLayer(name, name, {
                ip: ip,
                port: port
            }); 
        }
        map2.addLayer(layerchange);
    }
}