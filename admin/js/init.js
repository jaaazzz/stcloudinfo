$(function(){
        var m_height=$('.page_container').css('height');
            $('.left').css({'height':parseInt(m_height)+15+'px'});
    //全选、反选
    $(".head_check").click(function(){
        $(this).attr('checked',!$(this).attr('checked'));
        var check=$(this).attr('checked')?true:false;
        $(".app_table tbody input[type=checkbox]").each(function(){
            this.checked=check;
        });
    });

    //设置弹窗居中
    $(".modal_box").css({
        top:($(window).height()-$(".modal_box").height()-150)/2+'px',
        left:($(window).width()-$(".modal_box").width())/2+'px'
    });

    //弹窗关闭事件
    $(".modal-header .close").click(function(){
        if($(this).hasClass('refresh')){
            location.reload();
        }
        $(this).parent().parent().hide();
        $(".modal_background").hide();
    });
    $(".modal_btn.cancel").click(function(){
        if($(this).hasClass('host')){
            return;
        }
        $(this).parent().parent().parent().hide();
        $(".modal_background").hide();
    });

    //tab切换
    $('.page_ul li').click(function(){
       if($(this).hasClass('active')){
           return;
       }
       $('.page_ul li.active').removeClass('active');
        $(this).addClass('active');
    });

    $(".app_table input[type=checkbox]").each(function(){
        this.checked=false;
    })

    //设置左侧目录选中状态
    $(".module_box").click(function () {
        $(".module_box.active").removeClass('active');
        $(this).addClass('active');
    });

    $(".app_table tbody input[type=checkbox]").change(function(){
        set_delete_btn();
    });
    $(".app_table thead input[type=checkbox]").change(function(){
        if(this.checked){
            $('.table_tools .delete').removeClass('disalbe');
        }else{
            $('.table_tools .delete').addClass('disalbe');
        }
    });
    
    

    $("input[type='checkbox']").attr('ondblclick', 'this.click()');

    //更新数据缓存
    $.post('ajax.php',{act:'update_cache'},function () {});
});

$(function () {

});
function set_delete_btn(){
    var t=false;
    $(".app_table tbody input[type=checkbox]").each(function (i) {
        if(this.checked){
            t=true;
            return false;
        }
    });
    if(t){
        $('.table_tools .delete').removeClass('disalbe');
    }else{
        $('.table_tools .delete').addClass('disalbe');
    }
}
function check_username(e){
    if($(e).val().length<6||$(e).val().length>32){
        $(e).next().html('6~32个字符，支持英文、数字和"_"格式');
        return;
    }else{
        $(e).next().html('');
    }
}
function check_pwd(e){
    var type=$(e).attr('placeholder')?'edit_user':'add_user';
    if($(e).val()||type=='add_user'){
        var is_pwd=/^(?![^a-zA-Z]+$)(?!\D+$).{6,16}$/;
        if(!is_pwd.test($(e).val())){
            $(e).next().html('6~16个字符，必须至少含字母和数字');
            return;
        }else{
            $(e).next().html('');
        }
    }
}
function check_email(e){
    var email = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
    if(!email.test($(e).val())){
        $(e).next().html('请输入正确的邮箱格式');
        return;
    }else{
        $(e).next().html('');
    }
}
function check_point(e){
    var point = /\D+/;
    if(!$(e).val()||point.test($(e).val())){
        $(e).next().html('请输入正确的点数配额');
        return;
    }else{
        $(e).next().html('');
    }
}
function ChangeDateToString(DateIn)
{
    var Year=0;
    var Month=0;
    var Day=0;

    var CurrentDate="";

    //初始化时间
    Year      = DateIn.getFullYear();
    Month     = DateIn.getMonth()+1;
    Day       = DateIn.getDate();


    CurrentDate = Year + "-";
    if (Month >= 10 )
    {
        CurrentDate = CurrentDate + Month + "-";
    }
    else
    {
        CurrentDate = CurrentDate + "0" + Month + "-";
    }
    if (Day >= 10 )
    {
        CurrentDate = CurrentDate + Day ;
    }
    else
    {
        CurrentDate = CurrentDate + "0" + Day ;
    }


    return CurrentDate;
}

/*
 *数据查询等待框
 * created by yuguangqing   2016年5月31日11:09:30
 */
; (function ($) {

    var WaitPanel = function ($obj, options) {
        options.imgUrl = 'images/wait.gif';
        this.$panel = $obj;
        if (this instanceof WaitPanel) {
            this.initialize(options);
        } else {
            new WaitPanel;
        }
        return this;
    };

    //默认值
    WaitPanel.defaults = {
        tipsInfo: "数据处理中，请等待.....",//提示信息
        tipsInfoColor: "#FFFFFF",//提示信息的默认颜色是白色
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        closeCallBack: $.noop, //关闭等待框的回调函数,
        imgUrl: '',
        isCoverPaneTitle: false //是否将等待的整个背景向下移动30px
    };

    var prototype = WaitPanel.prototype;

    //初始化
    prototype.initialize = function (options) {
        this.addPanel(options);
        this.controlMainBoxStyle(options);
    };


    prototype.addPanel = function (options) {
        var bigpanelStr =
            '<div class="coverDIV">' +
            '<div class="coverDIVInfo">' +
            '<img src="' + options.imgUrl + '"class="waitGif"/>' +
            '<div class="waitTitle">' + options.tipsInfo + '</div>' +
            '</div>' +
            '</div>';
        this.$panel.append(bigpanelStr);
    };

    //样式控制
    prototype.controlMainBoxStyle = function (options) {
        var imgWidth = 130, imgHeight = 130, infoHeight = 190;
        //总容器
        var top = '0px';
        if (options.isCoverPaneTitle) {
            top = '30px';
        }
        var $coverDiv = this.$panel.find('.coverDIV').css({
            'width': '100%',
            'height': '100%',
            'background-color': options.backgroundColor,
            'z-index': '987654',
            'position': 'absolute',
            'top': top,
            'left': '0'
        });

        //图片和标题他爹
        this.$panel.find('.coverDIVInfo').css({
            'margin-top': ($coverDiv.height() - infoHeight) / 2,
            //'left': ($coverDiv.width() - imgWidth) / 2,
            //'width': imgWidth + 'px',
            //'height': infoHeight + 'px',
            //'position': 'absolute'
            'text-align': 'center'
        });

        //图片
        this.$panel.find('.waitGif').css({
            'width': imgWidth + 'px',
            'height': imgWidth + 'px'
        });

        //标题
        this.$panel.find('.waitTitle').css({
            //'width': +imgWidth + 'px',
            'width': '90%',
            'height': '30px',
            'line-height': '30px',
            'font-size': '13px',
            'font-family': '微软雅黑',
            'margin': '15px auto',
            'color': options.tipsInfoColor
        });

    };

    prototype.updataTip = function (tips) {
        if (tips != '') {
            this.$panel.find('.waitTitle').html(tips);
        }
    };


    //显示等待框
    $.fn.WaitPanel = function (options) {
        var api;
        options = $.extend(WaitPanel.defaults, options);
        this.each(function () {
            api = new WaitPanel($(this), options);
        });
        return api;
    };

    //移除等待框
    $.fn.hideWaitPanel = function (callBack) {
        callBack && callBack();
        $(this).find(".coverDIV").remove();
    };
})(jQuery);