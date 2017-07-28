//------------------------默认地图切换---------------------
window.defaultMap = window.defaultMap || {};
defaultMap.initLayer = function(){
    $("#layerDiv div").eq(2).attr("select",true);
    $("#layerDiv div").eq(2).addClass("layerSelect");
    $("#layerDiv div").eq(2).find(".layerTitle").addClass("layerTitleSelect");
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
        defaultMap.selectLayer($(this),f);

    });
}

defaultMap.selectLayer = function(selectDiv,f){
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
    var layerIndex = selectDiv.attr("layerIndex");
    if(layerIndex==1){
        $("#layerDiv div").eq(2).attr("select",true);
        $("#layerDiv .layerTitle").eq(2).addClass("layerTitleSelect");
        $("#layerDiv div").eq(2).addClass("layerSelect");
        if(selectDiv.attr("value")=="off"){
            selectDiv.find("span").removeClass("layerTitleSelect");
        }
    }else if(layerIndex==2){
        $("#layerDiv div").eq(1).attr("select",true);
        $("#layerDiv .layerTitle").eq(1).addClass("layerTitleSelect");
        $("#layerDiv div").eq(1).addClass("layerSelect");
        if(selectDiv.attr("value")=="off"){
            selectDiv.find("span").removeClass("layerTitleSelect");
        }
    }else if(layerIndex==3){
    	$("#layerDiv div").eq(0).attr("select",true);
        $("#layerDiv .layerTitle").eq(0).addClass("layerTitleSelect");
        $("#layerDiv div").eq(0).addClass("layerSelect");
        if(selectDiv.attr("value")=="off"){
            selectDiv.find("span").removeClass("layerTitleSelect");
        }
    }
    var layers=map.getLayerGroup().getLayers().getArray();
    for(var i=0;i<layers.length;i++){
        //if(control.column == 1){
            if(layers[i].isdefault==true&&layers[i].lx==layerIndex){
                basicTree.addLayer(layers[i].pro,layers[i].maptype,layers[i].lx,layers[i].layerName,layers[i].url,layers[i].tip,layers[i].zoom,layers[i].centerX,layers[i].centerY);
            }else{
                layers[i].setVisible(false);
            }
        // }else if(control.column == 3){
        //     if(layers[i].isdefault==true&&layers[i].lx==layerIndex&&layers[i].column==3){
        //         basicTree.addLayer(layers[i].pro,layers[i].maptype,layers[i].lx,layers[i].layerName,layers[i].url,layers[i].tip,layers[i].zoom,layers[i].centerX,layers[i].centerY);
        //     }else{
        //         layers[i].setVisible(false);
        //     }
        // }
    }
}