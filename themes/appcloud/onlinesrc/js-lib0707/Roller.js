window.Roller = window.Roller || {};

Roller.status = false;
Roller.showRoller = function(){
    // $('#mapCon').html('');
    //var view = map.getView();
    var layers=map.getLayerGroup().getLayers().getArray();
    for(var i=0;i<layers.length;i++){
        layers[i].setVisible(false);
    }
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
        if(Roller.status == false){
            Roller.init();
            Roller.status = true;
        }else{
            var layer;
            for(var i=0;i<layers.length;i++){
                if(layers[i].roller==1){
                    layers[i].setVisible(true);
                    layer = layers[i];
                }
            }
            map.getView().setCenter([layer.centerx,layer.centery]);
        }
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
            if(Roller.status == false){
                Roller.init();
                Roller.status = true;
            }else{
                var layer;
                for(var i=0;i<layers.length;i++){
                    if(layers[i].roller==1){
                        layers[i].setVisible(true);
                        layer = layers[i];
                    }
                }
                // alert(layer.centerx+":"+layer.centery);
                map.getView().setCenter([layer.centerx,layer.centery]);
            }
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
            for(var i=0;i<layers.length;i++){
                if(layers[i].roller==1){
                    layers[i].centerx=map.getView().getCenter()[0];
                    layers[i].centery=map.getView().getCenter()[1];
                }
            }
            if(control.column == 1){
                var node=$('#basictree').tree("getChecked");
                for(var i in node){
                    $('#basictree').tree("uncheck",node[i].target);
                }
                // basicTree.initTree();
            }else if(control.column == 2){

            }else if(control.column == 3){
                var node=$('#themetree').tree("getChecked");
                for(var i in node){
                    $('#themetree').tree("uncheck",node[i].target);
                }
                // basicTree.initTree();
            }
            basicTree.hideLayer();
            defaultMap.selectLayer($('.layerSelect'),false);
        }
        map.setTarget();
        map.setTarget($("#mapCon").get(0));

        // var n = $('#basictree').tree("getChildren");
        // for(var i=0;i<n.length;i++){
        //     $('#basictree').tree("uncheck", n[i].target);
        // }
        // n = $('#themetree').tree("getChildren");
        // for(var i=0;i<n.length;i++){
        //     $('#themetree').tree("uncheck", n[i].target);
        // }
    }
}
Roller.init = function(){
    $.ajax({
        url: 'themes/appcloud/onlinesrc/roller.json',
        type:"POST",
        data:{},
        dataType:"json",
        success:function(msg){
            $(msg).each(function(i,item){
                var info=new Zondy.Service.GetMapInfoService({mapName:item.layer,ip:ip,port:port});
                info.GetMapInfo(function(data){
                    var projection=olMap.tranProjection(item.projection);
                    if(item.maptype==2){
                        olMap.correctResolutions(data.resolutions);
                    }
                    if(item.maptype==1){
                        layer = new Zondy.Map.TileLayer(item.layer, item.layer, {
                            ip: ip,
                            port: port,
                            isAutoConfig: false,
                            tileData: data
                        });
                    }else if(item.maptype==2){
                        layer = new Zondy.Map.Doc(item.layer, item.layer, {
                            ip: ip,
                            port: port
                        });
                    }
                    var layers=map.getLayerGroup().getLayers().getArray();
                    layer.setZIndex(layers.length);
                    layer.roller = 1;
                    layer.centerx = item.centerx;
                    layer.centery = item.centery;
                    layer.zoom = item.zoom;
                    layer.data=data;
                    if(i==1){
                        Roller.console(layer);
                    }
                    map.addLayer(layer);
                    var x=item.centerx,y=item.centery;
                    var xmin=data.xMin;
                    var xmax=data.xMax;
                    var ymin=data.yMin;
                    var ymax=data.yMax;
                    if(x==0||y==0){
                        x=(parseFloat(xmin)+parseFloat(xmax))/2;
                        y=(parseFloat(ymin)+parseFloat(ymax))/2;
                    }
                    layer.setVisible(false);
                    basicTree.setView(item.projection,x,y,xmin,ymin,xmax,ymax,item.zoom,item.maptype);
                    layer.setVisible(true);
                });
            });
        },
        error:function(e){
                    
        }
    });
}

Roller.console = function(tile){
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
    tile.on('precompose', function (event) {
        var ctx = event.context;
       
        var pixelRatio = event.frameState.pixelRatio;         
        ctx.save();
        ctx.beginPath();
        if (l) { ctx.rect(0, 0, l * pixelRatio, h*pixelRatio); }
        ctx.clip();
    });
    // 呈现层后,恢复画布的背景
    tile.on('postcompose', function (event) {
        var ctx = event.context;
        ctx.restore();
    }); 
}

