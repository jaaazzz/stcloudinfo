function Addmarker() {
            removeMaker();
            if (!data.vectorLayer) {
                data.vectorLayer = new ol.layer.Vector({
                    source: vectorSource
                });
                map.addLayer(data.vectorLayer);
            }
            map.on('click', clickpopup);
        }
//专题图层
// function initDocLayerGroup(){
// $.ajax({
//         url: 'themes/appcloud/onlinesrc/wms.json',
//         type:"POST",
//         data:{},
//         dataType:"json",
//         success:function(data){
//             data.docVectLayerArr=new Array();
//             var theme = '';
//             $(data).each(function(i,item){
//                 var text=item.text;
//                 var type=item.type;
//                 var lx=item.lx;
//                 var children=item.children;
//                 theme +=  "<div class='accordion-group' style='overflow: hidden;'><div class='accordion-heading'><a class='accordion-toggle theme-option'  data-toggle='collapse' data-parent='#accordion2' href='#collapse"+i+"'>"+text+"</a></div><div id='collapse"+i+"' class='accordion-body collapse' style='height: 0px;'><div class='accordion-inner'><div class='checkbox'>";
//                 $(children).each(function(j,jtem){
//                     var layer=jtem.layer;
//                     var type=jtem.type;
//                     var text= jtem.layer;
//                      theme += "<label><input type='checkbox' onchange='addDocLayer(\""+layer+"\",this)'>"+layer+"</label><br/>";
//                     var mapDocLayer = new Zondy.Map.Doc(text, layer, {
//                         //IP地址
//                         ip: ip,
//                         //端口号
//                         port: port
//                     });
//                     data.docVectLayerArr.push(mapDocLayer);
//                 });
//                 theme +=  "</div></div></div></div>";
//             });
//             $('#accordion2').html(theme);
//         },
//         error:function(e){
            
//         }
        
// });
// }

function initDocLayerGroup(){
    data.docVectLayerArr=new Array();
    $('#themeTree').tree({
        // url: 'themes/appcloud/onlinesrc/theme.json',
        url:'ajax.php?act=get_theme_map',
        onLoadSuccess: function (node, param) {
            $(this).find("span.tree-checkbox").unbind().click(function () {
                $("#themeTree").tree("select",$(this).parent());
                return false;
            });
            var n = $('#themeTree').tree("getChildren");
            for(var i=0;i<n.length;i++){
                if(n[i].type==1){
                    //var mapDocLayer = new Zondy.Map.MapDocTileLayer(n[i].text, n[i].layer, {
                    if(n[i].maptype==1){
                        var maptileLayer = new Zondy.Map.TileLayer(n[i].text, n[i].layer, {
                            //IP地址
                            ip: ip,
                            //端口号
                            port: port
                        });
                        data.docVectLayerArr.push(maptileLayer);
                    }else{
                        var mapDocLayer = new Zondy.Map.Doc(n[i].text, n[i].layer, {
                            //IP地址
                            ip: ip,
                            //端口号
                            port: port,
                            ratio:1
                        });
                        data.docVectLayerArr.push(mapDocLayer);
                    }
                    
                }
                if(n[i].lx=="1"&&n[i].isdefault==true){
                    //data.themeSL=n[i].layer;
                    data.defaultMapSL=n[i].layer;
                    data.projection = n[i].projection=="meter"?"EPSG:3857":"EPSG:4326";
                    data.xCenter=n[i].centerx;
                    data.yCenter=n[i].centery;
                    data.zoom=n[i].zoom;
                    data.maptype = n[i].maptype;
                }else if(n[i].lx=="2"&&n[i].isdefault==true){
                    //data.themeYX=n[i].layer;
                    data.defaultMapYX=n[i].layer;
                }else if(n[i].lx=="3"&&n[i].isdefault==true){
                    //data.themeRelief=n[i].layer;
                    data.defaultMapRelief=n[i].layer;
                }
            }
            for(var i=0;i<n.length;i++){
                if(n[i].hidden==true){
                    $('#themeTree').tree("remove", n[i].target);
                }
            }
            initthemelayer(data.projection,data.zoom,data.xCenter,data.yCenter);
        },
        onSelect: function (node) {
            checkNode(node);
        },
        onCheck: function (node, checked) {

        }
    });
}
function initthemelayer(projection,zoom,xCenter,yCenter){
    TileLayer = new Zondy.Map.TileLayer(data.defaultMapSL, data.defaultMapSL, {
        ip: ip,
        port: port
    });
    TileLayer.projection=projection;
    TileLayer.default = true;
    map.addLayer(TileLayer);
    var info=new Zondy.Service.GetMapInfoService({mapName:data.defaultMapSL,ip:ip,port:port});
    info.GetMapInfo(function(msg){
        var xmin=msg.xMin;
        var xmax=msg.xMax;
        var ymin=msg.yMin;
        var ymax=msg.yMax;
        var startLevel=msg.startLevel;
        var endLevel=msg.endLevel;
        if(xCenter!=0&&yCenter!=0){
            var xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
            var yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
            // data.defaultcenter = [xCenter,yCenter];
            center = [xCenter,yCenter];
        }    
        // var zoom=endLevel-5;
        // alert(zoom+":"+endLevel+":"+yCenter+":"+startLevel+":"+xCenter);
        var themeView=new ol.View({
            //坐标系
            //projection: "EPSG:3857",
            projection: projection,
            //中心点
         //   center: [xCenter,yCenter],
            //最大显示级数
            maxZoom: endLevel,
            //最小显示级数
            minZoom: startLevel,
            maxResolution:msg.resolutions[0]
            //当前显示级数
            //zoom: zoom
        })
        map.setView(themeView);
        var size=map.getSize();
        themeView.fit([xmin,ymin,xmax,ymax],size);
        if(zoom!=0){
            map.getView().setZoom(zoom);
        }
        if(xCenter!=0&&yCenter!=0){
            map.getView().setCenter([xCenter,yCenter]);
        }
        //map.addLayer(defaultLayer); 
    });
}
var sum=0;
function checkNode(node){
    var pNode=$('#themeTree').tree("getParent", node.target);
    var f=$('#themeTree').tree("isLeaf", node.target);
    var checkedNode = $('#themeTree').tree("getChecked");
    if(f==true){//叶子节点
         var tmp=false;
         var pNode=$('#themeTree').tree("getParent", node.target);
         var pid=pNode.id;
         for(var k=0;k<checkedNode.length;k++){
            var pp=$('#themeTree').tree("isLeaf", checkedNode[k].target);
            if(pp==true){
                var parentNode=$('#themeTree').tree("getParent", checkedNode[k].target);
                var id=parentNode.id;
                if(pid!=id){
                    tmp=true;
                }
            }
         }
         if(tmp==false){
            if (node.checked == true) {
                checkDocLayer(node,false);
                $('#themeTree').tree("uncheck", node.target);
            }else{
                checkDocLayer(node,true);
                $('#themeTree').tree("check", node.target);
            }
         }else{
            for(var m=0;m<checkedNode.length;m++){
                checkDocLayer(checkedNode[m],false);
                $('#themeTree').tree("uncheck", checkedNode[m].target);
            }
            if (node.checked == true) {
                checkDocLayer(node,false);
                $('#themeTree').tree("uncheck", node.target);
            }else{
                checkDocLayer(node,true,true);
                $('#themeTree').tree("check", node.target);
            }
         }
    }else{//非叶子节点
        var flag=true;
        var n = $('#themeTree').tree("getChildren", node.target);
        for(var i=0;i<n.length;i++){
            var z=$('#themeTree').tree("isLeaf", n[i].target);
            if(z==false){
                flag=false;
            }
        }
        if(flag==true){//是最底级文件夹
            if (node.checked == true) {
                checkDocLayer(node,false);
                $('#themeTree').tree("uncheck", node.target);
            }else{
                for(var m=0;m<checkedNode.length;m++){
                    checkDocLayer(checkedNode[m],false);
                    $('#themeTree').tree("uncheck", checkedNode[m].target);
                }
                $('#themeTree').tree("check", node.target);
                checkDocLayer(node,true,true);
            }
        }else{
            var s=isCatalog(node);
            if (node.checked == true) {
                if(s==true){
                    checkDocLayer(node,false);
                    $('#themeTree').tree("uncheck", node.target);
                }
            }else{
                if(s==true){
                    for(var m=0;m<checkedNode.length;m++){
                        checkDocLayer(checkedNode[m],false);
                        $('#themeTree').tree("uncheck", checkedNode[m].target);
                    }
                    $('#themeTree').tree("check", node.target);
                    checkDocLayer(node,true,true);
                }
            }
            
        }
    }
    sum=$('#themeTree').tree("getChecked").length;
}
function isCatalog(node){//判断该节点下是否有多个文件夹
    var n=$('#themeTree').tree("getLeafChildren", node.target);
    var index=0;
    for(var i in n){
        var f=$('#themeTree').tree("isLeaf", n[i].target);
        if(f==false){
            index++;
        }
        if(index>1){
            return false;
        }
    }
    if(index==1){
        for(var i in n){
            isCatalog(n[i]);
        }
    }
    return true;
}
function checkDocLayer(node,flag,bs){
    if(node.type==1){//数据    
        addDocLayer(node.layer,flag,node.projection);
    }else{//底层文件夹
        var n = $('#themeTree').tree("getChildren", node.target);
        for(var i=0;i<n.length;i++){
              addDocLayer(n[i].layer,flag);
        }
    }
    if(flag==true){
        changeThemeView(node);
    }
    
    // if(sum==0){
    //     changeThemeView(node);
    // }else{
    //     if(bs==true){
    //         changeThemeView(node);
    //     }
    // }
}
function addDocLayer(layer,checked,projection){
    for(var i=0;i<data.docVectLayerArr.length;i++){
        if(data.docVectLayerArr[i].name==layer){
            if(checked==true){
                var flag=false;
                var layers=map.getLayerGroup().getLayers().getArray();
                for(var j=0;j<layers.length;j++){
                    if(layers[j].name==layer){
                        flag=true;
                        break;
                    }
                }
                if(flag==false){
                    data.docVectLayerArr[i].tip="theme";
                    data.docVectLayerArr[i].projection=projection;
                    map.addLayer(data.docVectLayerArr[i]);
                }
            }else{
                map.removeLayer(data.docVectLayerArr[i]);
            }
        }
    }
}
function changeThemeView(node){
    // var layers=map.getLayerGroup().getLayers().getArray();
    // for(var i=0;i<layers.length;i++){
    //     var projection="";
    //     if(node.projection=="meter"){
    //         projection='EPSG:3857'
    //     }else{
    //         projection='EPSG:4326';
    //     }
    //     if(layers[i].projection!=projection){
    //         map.removeLayer(layers[i]);
    //         i=-1;
    //     }
    // }
    var zoom=node.zoom;
    var f=$('#themeTree').tree("isLeaf", node.target);
    var layer;
    if(f==true){
        layer=node.layer;
    }else{
        var n=$('#themeTree').tree("getChildren", node.target);
        for(var i in n){
            var s=$('#themeTree').tree("isLeaf", n[i].target);
            if(s==true){
                layer=n[i].layer;
            }
        }
    }
    var projection;
    if(node.projection=="meter"){
        projection='EPSG:3857';
    }else{
        projection='EPSG:4326';
    }
    
    var info=new Zondy.Service.GetMapInfoService({mapName:layer,ip:ip,port:port});
    info.GetMapInfo(function(data){
        var xmin=data.xMin;
        var xmax=data.xMax;
        var ymin=data.yMin;
        var ymax=data.yMax;
        var xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
        var yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
        var the_view=new ol.View({
            projection: projection,
            center: [xCenter,yCenter],
            //最大显示级数
            maxZoom: 28,
            //最小显示级数
            minZoom: 0,
        })
        map.setView(the_view);
        var size=map.getSize();
        the_view.fit([xmin,ymin,xmax,ymax],size);
        if(zoom!=0&&zoom!=""&&zoom!=undefined){
            map.getView().setZoom(zoom);
        }
        if(node.centerx!=0&&node.centerx!=""&&node.centerx!=undefined&&node.centery!=0&&node.centery!=""&&node.centery!=undefined){
            map.getView().setCenter([node.centerx,node.centery]);
        }
        //alert(projection+":the_view.projection_.code_:"+the_view.projection_.code_);
    });
    
}
//导航栏选择
function selectColumn(item){
    if(item==1){
        // var childnodes = $('#Tree').tree("getChildren");
        // var id;
        // for(var i in childnodes){
        //     if(childnodes[i].default==true&&childnodes[i].maptype==1&&childnodes[i].lx=="1"){
        //         id=childnodes[i].id;
        //     }
        //     $('#Tree').tree("uncheck",childnodes[i].target);
        // }
        // var n=$('#Tree').tree('find',id);
        // $('#Tree').tree("check",n.target);
        var node=$('#Tree').tree("getChecked");
        for(var i in node){
            $('#Tree').tree("uncheck",node[i].target);
        }
        $('#mapCon').show();
        $('#swipe').hide();
        $('#multi').hide();
        $('#searchbox').show();
        data.maptype = data.maptypeSL;
        data.defaultMapRelief=data.MapRelief;
        data.defaultMapSL=data.SL;
        data.defaultMapYX=data.YX;
        var layers=map.getLayerGroup().getLayers().getArray();
        for(var i=0;i<layers.length;i++){
            map.removeLayer(layers[i]);
            i=-1;
        }
        if(data.maptype=="5"){
            center = data.TDTcenter;
            // ShowMap.getMapInfo(data.defaultMapSL,data.projection,data.dfnode);
            map.addLayer(data.TDTtile);
            var view = new ol.View({
                projection: data.projection,
                center: data.TDTcenter,
                zoom:data.TDTzoom
            });
            map.setView(view);
            var n = $('#Tree').tree("getChildren");
            for(var i=0;i<n.length;i++){
                $('#Tree').tree("uncheck", n[i].target);
            }
        }else if(data.maptype=="1"){
            var defaultLayer = new Zondy.Map.TileLayer(data.defaultMapSL, data.defaultMapSL, {
                ip: ip,
                port: port
            });
            defaultLayer.default=true;
            map.addLayer(defaultLayer);
            var info=new Zondy.Service.GetMapInfoService({mapName:data.defaultMapSL,ip:ip,port:port});
            info.GetMapInfo(function(msg){
                var xmin=msg.xMin;
                var xmax=msg.xMax;
                var ymin=msg.yMin;
                var ymax=msg.yMax;
                center = [(xmin+xmax)/2,(ymin+ymax)/2];
                var startLevel=msg.startLevel;
                var endLevel=msg.endLevel;
               // var xCenter=(parseFloat(xmin)+parseFloat(xmax))/2;
               // var yCenter=(parseFloat(ymin)+parseFloat(ymax))/2;
                //var zoom=endLevel-5;
                // alert(zoom+":"+endLevel+":"+yCenter+":"+startLevel+":"+xCenter);
                var showView=new ol.View({
                    //坐标系
                    projection: msg.projection,
                    //中心点
                 //   center: [xCenter,yCenter],
                    //最大显示级数
                    maxZoom: endLevel,
                    //最小显示级数
                    minZoom: startLevel,
                    //当前显示级数
                    //zoom: zoom
                    maxResolution:msg.resolutions[0]
                })
                map.setView(showView);
                var size=map.getSize();
                showView.fit([xmin,ymin,xmax,ymax],size);
            });
        }
        $('.theme-map').hide();
        $('#TreeType').hide();
        $('.theme').find('span').removeClass('choose');
        $('.search').find('span').removeClass('choose');
        $('.show').find('span').addClass('choose');
        $('#tree').show();
    }else if(item==2){
       // $("#layerDiv").hide();
        typeSearch();
        data.maptype = 1;
        $('.theme-map').hide();
        $('.show').find('span').removeClass('choose');
        $('.theme').find('span').removeClass('choose');
        $('#tree').hide();
        $('#TreeType').show();
        $('.search').find('span').addClass('choose');  
    }else if(item==3){
        var layers=map.getLayerGroup().getLayers().getArray();
        for(var i=0;i<layers.length;i=0){
            map.removeLayer(layers[i]);
        }
        data.maptype = 1;
        initDocLayerGroup();
        // alert(data.themeSL);
        // if(data.themeSL&&data.themeYX&&data.themeRelief){
        //     data.defaultMapSL=data.themeSL;
        //     data.defaultMapYX=data.themeYX;
        //     data.defaultMapRelief=data.themeRelief;
        // }
        $('.theme-map').show();
        $('.show').find('span').removeClass('choose');
        $('.search').find('span').removeClass('choose');
        $('#tree').hide();
        $('#TreeType').hide();
        $('.theme').find('span').addClass('choose');
    }
    if(item==1||item==3){
        $("#layerDiv").show();
        $("#layerDiv div").eq(1).attr("select",true);
        $("#layerDiv div").eq(1).addClass("layerSelect");
        $("#layerDiv div").eq(1).find(".layerTitle").addClass("layerTitleSelect");
        $("#layerDiv div").eq(0).attr("select",false);
        $("#layerDiv div").eq(0).removeClass("layerSelect");
        $("#layerDiv div").eq(0).find(".layerTitle").removeClass("layerTitleSelect");
        $("#layerDiv div").eq(1).css({'float':'right'}).siblings().css({'float':'left'});
        $("#layerDiv div").eq(1).css("display","block"); 
        $("#layerDiv div").eq(0).css("display","none"); 
    }
}

function jumpLevel(xarray, yarray){
    var xmin=9999999,xmax=0,ymin=9999999,ymax=0;
    for(var i in xarray){
        if(xarray[i]<xmin){
            xmin=xarray[i];
        } 
        if(xarray[i]>xmax){
            xmax=xarray[i];
        }
    }
    for(var i in yarray){
        if(yarray[i]<ymin){
            ymin=yarray[i];
        } 
        if(yarray[i]>ymax){
            ymax=yarray[i];
        }
    }
    var size=map.getSize();
    map.getView().fit([xmin,ymin,xmax,ymax],size);
}