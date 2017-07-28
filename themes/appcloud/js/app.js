
function delete_app(id)
{
    $('.loading_new_modle').css("display","block");
     var data={id:id};
     var url = 'ajax.php?act=delete_app';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                   //$.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                   selectLists();
                }else
                {
                     $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
     close_modal();
}

function app_on_sale(id)
{
    $('.loading_new_modle').css("display","block");
     var data={id:id};
     var url = 'ajax.php?act=app_on_sale';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                    //$.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                   selectLists();
                }else
                {
                     $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
}
function open_app_host(id)
{
  $('.loading_new_modle').css("display","block");
  var data={id:id};
     var url = 'ajax.php?act=open_app_host';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                  $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                  selectLists();
                }else
                {
                    $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
}

function console_app_host(id)
{
    $('.loading_new_modle').css("display","block");
     var data={id:id};
     var url = 'ajax.php?act=console_app_host';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        async:false,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                  openwin(result.content.url)

                }else
                {
                     $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
}
function openwin(url) {  
    window.location.href=url;
    //window.open(url,"_blank","scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
    // var a = document.createElement("a");  
    // a.setAttribute("href",url);  
    // a.setAttribute("target", "_blank");  
    // document.body.appendChild(a);  
    // a.click();
} 
function console_app_host_openstack(host_server_id)
{
    $('.loading_new_modle').css("display","block");
     var data={host_server_id:host_server_id};
     var url = 'ajax.php?act=console_app_host_openstack';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                   openwin(result.content.url)
                }else
                {
                     $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
}

function restart_app_host(id)
{     
    $('.loading_new_modle').css("display","block");
     var data={id:id};
     var url = 'ajax.php?act=restart_app_host';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                  //$.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                  selectLists();
                }else
                {
                    $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
}
function close_app_host(id)
{
    $('.loading_new_modle').css("display","block");
    var data={id:id};
     var url = 'ajax.php?act=close_app_host';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                  //$.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                  selectLists();
                }else
                {
                    $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
}
function delete_app_host(id)
{
  $('.loading_new_modle').css("display","block");
   var data={id:id};
     var url = 'ajax.php?act=delete_app_host';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                   //$.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                   selectLists();
                }else
                {
                    $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
     close_modal();
}

function delete_app_host(id)
{
  $('.loading_new_modle').css("display","block");
   var data={id:id};
     var url = 'ajax.php?act=delete_app_host';
     $.ajax({
        url:url,
        type:'post',
        data:data,
        dataType:'json',
        success:function(result){
                $('.loading_new_modle').css("display","none");
                if(result.status==403)
                {
                      GucLogin();
                }
                else if(result.status==200)
                {
                   //$.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                   selectLists();
                }else
                {
                    $.DialogBySHF.Alert({ Width: 350, Height: 200, Title:result.tip , Content: result.content.text });
                }

        }
    });
    close_modal();
}
function close_modal()
{
  $('.prompt_content_modal').css("display","none");
}
//兼容ｉｅ８表单的placeholder
// jQuery('[placeholder]').focus(function() {
//   var input = jQuery(this);
//   if (input.val() == input.attr('placeholder')) {
//     input.val('');
//     input.removeClass('placeholder');
//   }
// }).blur(function() {
//   var input = jQuery(this);
//   if (input.val() == '' || input.val() == input.attr('placeholder')) {
//     input.addClass('placeholder');
//     input.val(input.attr('placeholder'));
//   input.css("color","#C2C2C2");
//   }
// }).blur().parents('form').submit(function() {
//   jQuery(this).find('[placeholder]').each(function() {
//     var input = jQuery(this);
//     if (input.val() == input.attr('placeholder')) {
//       input.val('');
//     }
//   })
// });
