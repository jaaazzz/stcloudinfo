$(function(){
	$(".content-body-substance").each(function(){
		var $this = $(this);
		if ($this.height() > 90) {
			$this.css("height","90px");
			$this.css("overflow","hidden");
			var add_html = "<a class='spread_all gis-inline-block' href='javascript:void(0)' onclick='spread_all(event)'>展开全部</a>";
			$this.after(add_html);
		}
	})
})

//展开全部
function spread_all(event){
    event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    var oper_obj = $(obj).parents(".content-body").find(".content-body-substance");
    oper_obj.removeAttr("style");
    $(obj).replaceWith('<a href="javascript:void(0)" onclick=retract_all(event); class="spread_all gis-inline-block">收起全部</a>');
}

//收起全部
function retract_all(event){
    event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    var oper_obj = $(obj).parents(".content-body").find(".content-body-substance");
    oper_obj.css("height","90px");
	oper_obj.css("overflow","hidden"); 	
	$(obj).replaceWith('<a href="javascript:void(0)" onclick=spread_all(event); class="spread_all gis-inline-block">展开全部</a>');
}