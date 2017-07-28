window.control = window.control || {};
control.themeTip = false;
control.column = 1;
control.selectColumn = function(item){
	if(item == 1){
		control.column = 1;
        $('.ol-viewport').css({"display":"block"});
        $('#mapCon').css({"z-index":"1"})
        $('#demo_pic').css({"display":"none"});
        var node=$('#basictree').tree("getChecked");
        for(var i in node){
            $('#basictree').tree("uncheck",node[i].target);
        }
        // basicTree.initTree();
        basicTree.hideLayer();
        defaultMap.selectLayer($('.layerSelect'),false);
        $('#mapCon').show();
        $('#swipe').hide();
        $('#multi').hide();
        $('#searchbox').show();
        // basicTree.initTree();
		$('.theme-map').hide();
        $('#TreeType').hide();
        $('.theme').find('span').removeClass('choose');
        $('.search').find('span').removeClass('choose');
        $('.show').find('span').addClass('choose');
        $('#basictree').show();
	}else if(item == 2){
		// typeSearch();
		control.column = 2;
        $('.ol-viewport').css({"display":"block"});
        $('#mapCon').css({"z-index":"1"})
        $('#demo_pic').css({"display":"none"});
        $('.theme-map').hide();
        $('.show').find('span').removeClass('choose');
        $('.theme').find('span').removeClass('choose');
        $('#basictree').hide();
        $('#TreeType').show();
        $('.search').find('span').addClass('choose'); 
	}else if(item == 3){
        //alert('22');

		control.column = 3;
        var node=$('#themetree').tree("getChecked");
        for(var i in node){
            $('#themetree').tree("uncheck",node[i].target);
        }
        basicTree.hideLayer();
        if(control.themeTip == false){
	        themeTree.initTree();
	    }else{
            defaultMap.selectLayer($('.layerSelect'),false);
        }
	    control.themeTip = true;
        $('.theme-map').show();
        $('.show').find('span').removeClass('choose');
        $('.search').find('span').removeClass('choose');
        $('#basictree').hide();
        $('#TreeType').hide();
        $('.theme').find('span').addClass('choose');
        $('#themetree').html('<img src="themes/appcloud/images/left_zt.png" />');
        $('.ol-viewport').css({"display":"none"});
        $('#mapCon').css({"z-index":"999999"})
        $('#mapCon').append('<div id="demo_pic" style="height:100%;width:99%;margin-left:1%;background-color:#fff;overflow-y:scroll"><img style="margin-left:10%;width:80%;height:120%" src="themes/appcloud/images/333.png" /></div>');
	}
}