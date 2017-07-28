/**
 * Created by chelsea on 16-4-20.
 */


function delete_app(id)
{
    $('.loading_new_modle').css("display","block");
    var data={id:id};
    var url = '../ajax.php?act=delete_app';
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

function app_on_sale(id)
{
    $('.loading_new_modle').css("display","block");
    var data={id:id};
    var url = '../ajax.php?act=app_on_sale';
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
function open_app_host(id)
{
    $('.loading_new_modle').css("display","block");
    var data={id:id};
    var url = '../ajax.php?act=open_app_host';
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
    var url = '../ajax.php?act=console_app_host';
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
                window.location.href=result.content.url;
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
    var url = '../ajax.php?act=restart_app_host';
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
function close_app_host(id)
{
    $('.loading_new_modle').css("display","block");
    var data={id:id};
    var url = '../ajax.php?act=close_app_host';
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
function delete_app_host(id)
{
    $('.loading_new_modle').css("display","block");
    var data={id:id};
    var url = '../ajax.php?act=delete_app_host';
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