window.control = window.control || {};
control.themeTip = false;
//control.column = 1;
control.selectColumn = function(item){
	if(item == 1){
		//control.column = 1;
        var node=$('#basictree').tree("getChecked");
        for(var i in node){
            $('#basictree').tree("uncheck",node[i].target);
        }
        basicTree.initTree();
        basicTree.hideLayer();
        //defaultMap.selectLayer($('.layerSelect'),false);
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
		//control.column = 2;
        $('.theme-map').hide();
        $('.show').find('span').removeClass('choose');
        $('.theme').find('span').removeClass('choose');
        $('#basictree').hide();
        $('#TreeType').show();
        $('.search').find('span').addClass('choose'); 
	}else if(item == 3){
		//control.column = 3;
        var node=$('#themetree').tree("getChecked");
        for(var i in node){
            $('#themetree').tree("uncheck",node[i].target);
        }
        basicTree.hideLayer();
        if(control.themeTip == false){
	        themeTree.initTree();
	    }
        // else{
        //     defaultMap.selectLayer($('.layerSelect'),false);
        // }
	    control.themeTip = true;
        $('.theme-map').show();
        $('.show').find('span').removeClass('choose');
        $('.search').find('span').removeClass('choose');
        $('#basictree').hide();
        $('#TreeType').hide();
        $('.theme').find('span').addClass('choose');
	}
}