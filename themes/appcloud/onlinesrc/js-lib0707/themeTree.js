window.themeTree = window.themeTree || {};
themeTree.initTree = function(){
	$('#themetree').tree({
		url:'ajax.php?act=get_theme_map',
		onLoadSuccess: function (node,param) {
			$(this).find("span.tree-checkbox").unbind().click(function () {
                $("#themetree").tree("select",$(this).parent());
                return false;
            });
            // var n = $('#themetree').tree("getChildren");
            // for(var i=0;i<n.length;i++){
            //     if(n[i].type==1&&n[i].lx!=0){//有默认地图配置
            //     	basicTree.defaultMap(n[i],3);
            //     }
            // }
            // for(var i=0;i<n.length;i++){
            //     basicTree.addLayer(n[i].maptype,n[i].lx,n[i].layer,n[i].url,n[i].mc)
            // }
            // for(var i=0;i<n.length;i++){
            //     if(n[i].hidden==true){
            //         $('#themetree').tree("remove", n[i].target);
            //     }
            // }
		},
		onSelect: function (node) {
			var nodes=$('#themetree').tree("getChecked");
			if(node.type == 1){
				var parentnode = $('#themetree').tree("getParent",node.target);
				for(var i in nodes){
					if($('#themetree').tree("getParent",nodes[i].target)!=parentnode&&nodes[i]!=parentnode){
						basicTree.hideLayer(nodes[i].text);
						$('#themetree').tree("uncheck",nodes[i].target);
					}
				}
				if(node.checked == true){
					$('#themetree').tree("uncheck",node.target);
					basicTree.hideLayer(node.text);
				}else{
					basicTree.addLayer(node.projection,node.maptype,node.lx,node.layer,node.url,node.text,node.zoom,node.centerx,node.centery,node,$('#themetree'),2);
				}
			}else if(node.type == 0){
				for(var i in nodes){
					if($('#themetree').tree("getParent",nodes[i].target)!=node&&nodes[i]!=node){
						$('#themetree').tree("uncheck",nodes[i].target);
						if(nodes[i].type == 1){
							basicTree.hideLayer(nodes[i].text);
						}
					}
				}
				var children = $('#themetree').tree("getChildren",node.target);
				if(node.checked == true){
					$('#themetree').tree("uncheck",node.target);
					for(var i in children){
						if(children[i].type == 1){
							basicTree.hideLayer(children[i].text);
						}
					}
				}else{
					for(var i in children){
						if(children[i].type == 1){
							basicTree.addLayer(children[i].projection,children[i].maptype,children[i].lx,children[i].layer,children[i].url,children[i].text,children[i].zoom,children[i].centerx,children[i].centery,children[i],$('#themetree'),2);
						}
					}
				}
			}
		},
		onCheck: function (node, checked) {

        }
	})
}