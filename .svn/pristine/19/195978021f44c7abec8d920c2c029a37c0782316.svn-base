//申请token
function apply_token(){
    var data = {
        'act' : "apply_api"
    };
    $.get('ajax.php',data,function(result){
        if (result.success) {
            var ret_arr = result.result;
            var tokens_html = "";
            for (var i = 0; i < ret_arr.length; i++) {
                if (i ==0) {
                    tokens_html += "<div>"+ret_arr[i];
                    if (ret_arr.length > 1) {
                        tokens_html += "<a href='javascript:void(0)' onclick='spread(event)' class='spread-a'>展开</a>";
                    }
                    tokens_html += "</div>";
                }else{
                    tokens_html += "<div class='hide'>"+ret_arr[i]+"</div>";
                }
            }
            $(".service-token").html(tokens_html);
        }else{
            if (result.msg == "not_login") {
                GucLogin();
            }else{
                alert(result.msg);
            }
        }
    },'JSON');
}
//展开
function spread(event){
    event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    $(obj).parents(".service-token").find(".hide").show();
    $(obj).replaceWith('<a href="javascript:void(0)" onclick=javascript:retract(event); class="retract-a">收起</a>');
}

//收起
function retract(event){
    event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    $(obj).parents(".service-token").find(".hide").hide();
    $(obj).replaceWith('<a href="javascript:void(0)" onclick=javascript:spread(event); class="spread-a">展开</a>');
}