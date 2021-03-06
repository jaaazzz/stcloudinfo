window.Roller = window.Roller || {};

Roller.showRoller = function(){
    //$('#mapCon')html('');
    //var view = map.getView();
    var layers=map.getLayerGroup().getLayers().getArray();
    $('.ddd').toggle();
    $('.xxx').toggle();

    $('#mapCon').show();
    if($('#multi').attr('show')==1){//从多时相进入卷帘
        $('.eee').toggle();
        $('.vvv').toggle();
        $('#multi').hide();
        $('#multi').attr('show',0);
        $('#swipe').attr('show',1);
        $('#mapCon').css('left','0px');
        $('#swipe').show();
        for(var i=0;i<layers.length;i=0){
            map.removeLayer(layers[i]);
        }
        Roller.init();
    }else{
        $('.left-box').toggle();
        if($('#swipe').attr('show')==0){//直接打开卷帘
            $('#mapCon').css('width','100%');
            $('.do').hide();
            $('#layerDiv').hide();
            $('#searchbox').hide();
            $('#swipe').attr('show',1);
            $('#mapCon').css('left','0px');
            $('#multi').hide();
            $('#swipe').show();
            for(var i=0;i<layers.length;i=0){
                map.removeLayer(layers[i]);
            }
            Roller.init();
        }else if($('#swipe').attr('show')==1){//关闭卷帘
            document.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            $('.do').show();
            $('.navbar-wrapper').show();
            $('#layerDiv').show();
            $('#swipe').hide();
            $('#searchbox').show();
            $('#swipe').attr('show',0);
            $('#mapCon').css({
                width:$(window).width()-320+'px'
            })
            $('#mapCon').css('left','320px');
            for(var i=0;i<layers.length;i=0){
                map.removeLayer(layers[i]);
            }
            map.addLayer(TileLayer);
            var info=new Zondy.Service.GetMapInfoService({mapName:data.defaultMapSL,ip:ip,port:port});
            info.GetMapInfo(function(result){
                var xmin=result.xMin;
                var xmax=result.xMax;
                var ymin=result.yMin;
                var ymax=result.yMax;
                var startLevel=result.startLevel;
                var endLevel=result.endLevel;
                var xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
                var yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
                //var zoom=parseInt(endLevel)-3;
                var view = new ol.View({
                    projection: data.projection,
                    center: [xCenter,yCenter],
                        //最大显示级数
                    maxZoom: endLevel,
                        //最小显示级数
                    minZoom: startLevel,
                        //当前显示级数
                    //zoom: zoom
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
        }
        map.setTarget();
        map.setTarget($("#mapCon").get(0));
    }
}
var TileLayer1;
var TileLayer2;
Roller.init = function(){
        $.ajax({
            url: 'themes/appcloud/onlinesrc/roller.json',
            type:"POST",
            data:{},
            dataType:"json",
            success:function(msg){
                var rollerzoom;
                var rollercenter;
                var rollerview = map.getView();
                $(msg).each(function(i,item){
                    var projection;
                    if(i==0){
                        if(item.projection=="meter"){
                            projection="EPSG:3857";
                        }else{
                            projection="EPSG:4326";
                        }
                        rollerzoom=item.zoom;
                        rollercenter=[item.centerx,item.centery];
                        data.rollMapSL=item.layer;
                        var info=new Zondy.Service.GetMapInfoService({mapName:data.rollMapSL,ip:ip,port:port});
                        info.GetMapInfo(function(result){
                            var xmin=result.xMin;
                            var xmax=result.xMax;
                            var ymin=result.yMin;
                            var ymax=result.yMax;
                            var startLevel=result.startLevel;
                            var endLevel=result.endLevel;
                            var xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
                            var yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
                            //var zoom=parseInt(endLevel)-3;
                            if(item.centerx==0||item.centery==0||item.centerx==""||item.centery==""||item.centerx==undefined||item.centery==undefined){
                                rollercenter=[xCenter,yCenter];
                                
                            }
                            if(item.zoom==0||item.zoom==""||item.zoom==undefined){
                                rollerzoom=startLevel;
                            }
                            rollerview = new ol.View({
                                projection: projection,
                                center: rollercenter,
                                    //最大显示级数
                                maxZoom: endLevel,
                                    //最小显示级数
                                minZoom: startLevel,
                                    //当前显示级数
                                zoom: rollerzoom
                            });
                            map.setView(rollerview);
                            //var size=map.getSize();
                            //rollerview.fit([xmin,ymin,xmax,ymax],size);
                            map.getView().setZoom(rollerzoom);
                        });
                        
                    }else{
                        data.rollMapYX=item.layer;
                    }
                });
                TileLayer1= new Zondy.Map.TileLayer(data.rollMapSL, data.rollMapSL, {
                        ip: ip,
                        port: port
                    });
                TileLayer1.tip="1";
                TileLayer2 = new Zondy.Map.TileLayer(data.rollMapYX, data.rollMapYX, {
                        ip: ip,
                        port: port
                    });
                TileLayer2.tip="1";
                map.addLayer(TileLayer1);
                map.addLayer(TileLayer2);
                map.setView(rollerview);
                var div = document.getElementById('swipe');
                var disX = 0;
                var l = div.offsetLeft;
                var h = div.offsetHeight; //高度
                //鼠标按下
                div.onmousedown = function (ev) {
                    //判断浏览器兼容
                    var oEvent = ev || event;
                    //鼠标横坐标点到div的offsetLeft距离
                    disX = oEvent.clientX - swipe.offsetLeft;
                    //鼠标移动
                    document.onmousemove = function (ev) {
                        var oEvent = ev || event;
                        //获取div左边的距离
                        l = oEvent.clientX - disX;
                        //判断div的可视区，为避免DIV失去鼠标点
                        if (l < 0) {
                            l = 0;
                        }
                        else if (l > document.documentElement.clientWidth - div.offsetWidth) {
                            l = document.documentElement.clientWidth - div.offsetWidth;
                        }
                        //确定DIV的左边位置
                        div.style.left = l + 'px';
                    }
                    //当鼠标松开后关闭移动事件和自身事件
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                    return false;
                }

                //设置地图容器放置位置
                var container = document.getElementById('mapCon');

                container.addEventListener('mousemove', function (event) {
                    map.render();
                });

                container.addEventListener('mouseout', function () {
                    map.render();
                });
                // 在渲染层之前,做剪裁
                TileLayer2.on('precompose', function (event) {
                    var ctx = event.context;
                   
                    var pixelRatio = event.frameState.pixelRatio;         
                    ctx.save();
                    ctx.beginPath();
                    if (l) { ctx.rect(0, 0, l * pixelRatio, h*pixelRatio); }
                    ctx.clip();
                });
                // 呈现层后,恢复画布的背景
                TileLayer2.on('postcompose', function (event) {
                    var ctx = event.context;
                    ctx.restore();
                }); 
            },
            error:function(e){
                        
            }
        });
}

