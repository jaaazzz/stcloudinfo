//var UCServerConfig = 'localhost：80';
var ucenterServer = (UCServerConfig==="")?"":('http://'+UCServerConfig);

(function() {
    var cssPath = ['themes/appcloud/guc_login.css'];
    for(var i=0;i<cssPath.length;i++){
        var s  = document.createElement('link');
        s.type = 'text/css';
        s.rel  = 'stylesheet';
        s.href = cssPath[i];
        document.getElementsByTagName("head")[0].appendChild(s);
    }
})();
var GucLoginInstance = {};

(function($){$.pwstrength=function(password){var MIN_COMPLEXITY=25;var MAX_COMPLEXITY=80;var CHARSETS=[[48,57],[65,90],[97,122],[33,47],[58,64],[91,96],[123,126],[128,255],[256,383],[384,591],[592,687],[688,767],[768,879],[880,1023],[1024,1279],[1328,1423],[1424,1535],[1536,1791],[1792,1871],[1920,1983],[2304,2431],[2432,2559],[2560,2687],[2688,2815],[2816,2943],[2944,3071],[3072,3199],[3200,3327],[3328,3455],[3456,3583],[3584,3711],[3712,3839],[3840,4095],[4096,4255],[4256,4351],[4352,4607],[4608,4991],[5024,5119],[5120,5759],[5760,5791],[5792,5887],[6016,6143],[6144,6319],[7680,7935],[7936,8191],[8192,8303],[8304,8351],[8352,8399],[8400,8447],[8448,8527],[8528,8591],[8592,8703],[8704,8959],[8960,9215],[9216,9279],[9280,9311],[9312,9471],[9472,9599],[9600,9631],[9632,9727],[9728,9983],[9984,10175],[10240,10495],[11904,12031],[12032,12255],[12272,12287],[12288,12351],[12352,12447],[12448,12543],[12544,12591],[12592,12687],[12688,12703],[12704,12735],[12800,13055],[13056,13311],[13312,19893],[19968,40959],[40960,42127],[42128,42191],[44032,55203],[55296,56191],[56192,56319],[56320,57343],[57344,63743],[63744,64255],[64256,64335],[64336,65023],[65056,65071],[65072,65103],[65104,65135],[65136,65278],[65279,65279],[65280,65519],[65520,65533]];var defaults={minimumChars:8,strengthScaleFactor:1};function additionalComplexityForCharset(str,charset){for(var i=str.length-1;i>=0;i--){if(charset[0]<=str.charCodeAt(i)&&str.charCodeAt(i)<=charset[1]){return charset[1]-charset[0]+1}}return 0}var complexity=0,valid=false;for(var i=CHARSETS.length-1;i>=0;i--){complexity+=additionalComplexityForCharset(password,CHARSETS[i])}complexity=Math.log(Math.pow(complexity,password.length));valid=(complexity>MIN_COMPLEXITY&&password.length>=6);complexity=(complexity/MAX_COMPLEXITY)*100;complexity=(complexity>100)?100:complexity;return{valid:valid,complexity:complexity}}})(jQuery);
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
!function (e) {
    e.fn.tinyDraggable = function (n) {
        var t = e.extend({handle: 0, exclude: 0}, n);
        return this.each(function () {
            var n, o, u = e(this), a = t.handle ? e(t.handle, u) : u;
            a.on({
                mousedown: function (a) {
                    if (!t.exclude || !~e.inArray(a.target, e(t.exclude, u))) {
                        a.preventDefault();
                        var f = u.offset();
                        n = a.pageX - f.left, o = a.pageY - f.top, e(document).on("mousemove.drag", function (e) {
                            u.offset({top: e.pageY - o, left: e.pageX - n})
                        })
                    }
                }, mouseup: function () {
                    e(document).off("mousemove.drag")
                }
            })
        })
    }
}(jQuery);

jQuery(document).ready(function(){

    var timeOutId = null;
    GucLoginInstance.Conf = {
        mask:true,
        movable:true,
        loginReload:true,
        regToLogin:true,
        promptWidth:510,
        promptHeight:440,
        zIndex:10010,
        cookieName:'gs_username',
        cookiePath:'/',
        uc_ajax_login_url:'user.php?act=uc_login',        //应用集成时应用登陆url
        uc_ajax_register_url:'user.php?act=uc_register',  //应用集成时应用注册url
        uc_ajax_check_eamil:'user.php?act=uc_register&do=check_email', //应用集成时注册邮箱检测url
        uc_ajax_check_name:'user.php?act=uc_register&do=check_name',   //应用集成时注册用户检测url
        uc_ajax_logout_url:'user.php?act=logout',         //应用集成时应用退出url
        loginCallback:function(){}
    }
    GucLoginInstance.Util = {
        html:'<div class="guc-login-mask"></div>'
        +'<div class="guc-login-prompt">'
            +'<div class="guc-login-tab guc-login-tab1" style="display: block;background:url(themes/appcloud/images/素材天下网-sucaitianxia.com.png)0 0 no-repeat;">'
                +'<a href="javascript:void(0);" title="关闭" class="head-close">×</a>'
                +'<div class="guc-login-body">'
                    +'<div class="row form form1" style="padding: 28px 110px 54px 110px;">'
                        +'<h3 class="text-center" style="margin-bottom: 13px;">地质云平台登陆</h3>'
                        +'<div class="alert in" id="login-notice" style="display:none;margin-top:-8px;">'
                            +'<button type="button" class="close" onclick="$(\'#login-notice\').hide();">×</button>'
                            +'<span></span>'
                        +'</div>'
                        +'<fieldset class="guc-form-wrapper" style="margin-top:36px;">'
                            +'<input type="text" class="login-username" name="username" placeholder="请输入用户名或邮箱">'
                            //+'<label class="label-placeholder_login" style="color: rgb(153, 153, 153);">用户名/邮箱</label>'
                            +'<div class="clear"></div>'
                            +'<label id="login-username-info" class="form-label pull-left" style="display:none;">请输入您的用户名或邮箱</label>'
                            +'<input type="password" class="login-password" name="password" style="margin-top:20px;margin-bottom:16px;" placeholder="请输入密码">'
                            // +'<label class="label-placeholder_login">密码</label>'
                            +'<div class="clear"></div>'
                            +'<label id="login-password-info" class="form-label pull-left" style="display:none;">请输入您的密码</label>'
                            +'<label class="checkbox" style="padding-left:0px;margin-top: 0px;float:left;margin-left:0;width:104px;left:0;">'
                            +'<input type="checkbox" value="1" name="remember" id="remember" checked="checked" style="margin-top:4px;margin-left:0px;float:left;"><span style="float:right;">下次自动登录</span></label>'
                            +'<div class="" style="width: 100px;text-align: right;margin-top: 0px;float:right;"><a href="#" onclick="userRegister()"; id="">创建账号?</a></div>'
                            +'<button style="background:#4bb0e5;" class="btn-zondy login-submit" type="submit">登&nbsp;&nbsp;录</button><br>'
                            +'<div style="clear:both;padding-top:17px;">'
                                +'<a href="http://zkinfo.cgsi.cn/" title="全国钻孔数据服务"><span style="background: url(themes/appcloud/images/log-1.png)  no-repeat;width: 36px;height: 36px;display: inline-block;background-size: cover;"></span></a>'
                                +'<a href="http://www.ngac.org.cn/" title="国家地质资料数据中心全国馆数字地质资料馆"><span style="display:inline-block; margin-left:15px;background:url(themes/appcloud/images/logo-2.jpg)  no-repeat;width: 36px;height: 34px;background-size: cover;"></span></a>'
                            +'</div>'
                        +'</fieldset>'
                    +'</div>'
                +'</div>'
            +'</div>'
            // +'<div class="userRegister"  style="display: block">'
            //     +'<a href="javascript:void(0);" title="关闭" class="head-close">×</a>'
            //     +'<div class="registerMessage">'
            //         +'<form>'
            //             +'<input class="usernameRegister" type="text" placeholder="请输入账号"><br>'
            //             +'<input class="userEmaiRegisterRegisterl" type="text" placeholder="请输入邮箱"><br>'
            //             +'<input class="passwordRegister1" type="password" placeholder="请输入密码"><br>'
            //             +'<input class="passwprdRegister2" type="password" placeholder="请输入密码"><br>'
            //             +'<input class="submitRegister" type="submit" value="提交"><br>'
            //         +'</form>'
            //     +'</div>'
            // +'</div>'
            // +'<div class="guc-login-tab guc-login-tab2" style="display: none">'
            //     +'<a href="javascript:void(0);" title="关闭" class="head-close">×</a>'
            //     +'<div class="guc-login-body">'
            //         +'<div class="row form form2 sign-up" style="display: block;">'
            //             +'<div class="alert in" id="register-notice" style="display:none;">'
            //                 +'<button type="button" class="close" onclick="$(\'#register-notice\').hide();">×</button>'
            //                 +'<span></span>'
            //             +'</div>'
            //             +'<fieldset class="guc-form-wrapper">'
            //                 +'<label id="register-email-info" class="form-label pull-left" style="visibility:visible;">请输入常用邮箱，通过验证后用于登录</label>'
            //                 +'<input type="text" class="register-email" name="email">'
            //                 +'<label class="label-placeholder_login" style="color: rgb(153, 153, 153);">邮箱</label>'
            //                 +'<span id="register-email-confirm" class="form-confirm" style="display: none;"></span>'
            //                 +'<div class="clear"></div>'
            //                 +'<label id="register-username-info" class="form-label pull-left" style="visibility: visible;">6~32个字符，支持英文、数字和"_"格式</label>'
            //                 +'<input type="text" class="register-username" name="username">'
            //                 +'<label class="label-placeholder_login">用户名</label>'
            //                 +'<span id="register-username-confirm" class="form-confirm"></span>'
            //                 +'<div class="clear"></div>'
            //                 +'<label id="register-password-info" class="form-label pull-left" style="visibility: visible;">必须至少含字母和数字，6至16个字符</label>'
            //                 +'<input type="password" class="register-password" name="password">'
            //                 +'<label class="label-placeholder_login">密码</label>'
            //                 +'<span id="register-password-confirm" class="form-confirm"></span>'
            //                 +'<div class="clear"></div>'
            //                 +'<div class="pwd-strength" style="display: none;">'
            //                     +'<span class="pwd-strength-1"></span>'
            //                     +'<span class="pwd-strength-2"></span>'
            //                     +'<span class="pwd-strength-3"></span>'
            //                 +'</div>'
            //                 +'<input name="act" type="hidden" value="act_register">'
            //                 +'<input type="hidden" name="back_act" value="/index.php">'
            //                 +'<button type="submit" class="btn-zondy register-submit disabled" disabled="disabled" name="Submit">注&nbsp;&nbsp;册</button>'
            //                 +'<div class="pull-left" style="width: 100%;text-align: center;margin-top: 10px;"><span>已有帐号？</span><a href="javascript:void(0);" id="guc-btn-tab-toggle-2">立即登录</a></div>'
            //             +'</fieldset>'
            //         +'</div>'
            //         +'<div class="row form success" style="display: none;">'
            //             +'<div class="pull-left" style="width: 100%;text-align: center;padding-top: 50px;">'
            //                 +'<b>尊敬的用户，您已成功注册<br />GIS云平台账户</b><br /><br />'
            //                 +'<span><em class="guc-login-timer">3</em>秒后，自动跳转到登录</span><br /><br /><span>如未跳转点击&nbsp;</span><a href="javascript:void(0);" id="guc-btn-tab-toggle-3">立即登录</a></span>'
            //             +'</div>'
            //         +'</div>'
            //     +'</div>'
            // +'</div>'
            +'<div class="guc-login-tab guc-login-tab3" style="display: none">'
                +'<a href="javascript:void(0);" title="关闭" class="head-close">×</a>'
                +'<div class="guc-login-body">'
                    +'<div class="row form form3" style="display: block;">'
                        +'<div id="wx_container" class="guc-code">'

                        +'</div>'
                        +'<button type="submit" class="btn-zondy return-submit" name="Submit">返&nbsp;&nbsp;回</button>'
                    +'</div>'
                +'</div>'
            +'</div>'
            +'<div class="guc-login-tab guc-login-tab4" style="display: none">'
                +'<a href="javascript:void(0);" title="关闭" class="head-close">×</a>'
                +'<div class="guc-login-body">'
                    +'<div class="row form form4">'
                        +'<div class="guc-head-info">'
                            +'<a hidefocus="true" href="#">'
                            +'</a>'
                            +'<div class="head-welcome">'
                                +'<h3>你好，&nbsp;  <span class="uesrname">小灿猪</span></h3>'
                                +'<p>您已经成功使用微信账号登录到GIS云平台</p>'
                            +'</div>'
                        +'</div>'
                        +'<div class="guc-form-bd">'
                            +'<div class="alert in" id="bind-notice" style="display:none;">'
                                +'<button type="button" class="close" onclick="$(\'#bind-notice\').hide();">×</button>'
                                +'<span>用户名或密码错误</span>'
                            +'</div>'
                            +'<h3 class="bd-tit">绑定我已有的GIS云平台帐号</h3>'
                            +'<div class="bd-main-box">'
                                +'<p class="bd-field-account botborder">'
                                    +'<label for="bd_account">帐号：</label>'
                                    +'<span class="bd-input-bg"><input type="text" name="account" placeholder="用户名/邮箱" autocomplete="off" id="bd_account"></span>'
                                +'</p>'
                                +'<p class="bd-field-account">'
                                    +'<label for="bd_password">密码：</label>'
                                    +'<span class="bd-input-bg"><input type="password" name="password" maxlength="20" placeholder="输入您的密码" id="bd_password"></span>'
                                +'</p>'
                            +'</div>'
                            +'<button type="submit" class="btn-zondy bind-submit" name="Submit">立即登录</button>'
                            +'<div class="autoset">'
                                +'<a href="##" id="goReg" class="btn-oauth-autoreg">自动创建一个GIS云平台帐号</a>'
                            +'</div>'
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>',
        getQueryString:function(link,name){
            link = link.substr(link.indexOf("?"));
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var t = decodeURI(link);
            var r = t.substr(1).match(reg);
            return (r&&r[2])?unescape(r[2]):null;
        }
    }
    GucLoginInstance.Main = {
        PromptMask:null,
        Prompt:null,
        init:function(){
            this.clear();
            this.ready();
            this.bindEvent();
        },
        clear:function(){
            var existMask = jQuery.find('.guc-login-mask',window.top.document);
            var existPrompt = jQuery.find('.guc-login-prompt',window.top.document);
            existMask.length && jQuery(existMask[0]).remove();
            existPrompt.length && jQuery(existPrompt[0]).remove();
        },
        ready:function(){
            var _this = this;
            $('body',window.top.document).append(GucLoginInstance.Util.html);


            var src,position;
            $('script').each(function(i,val){
                if((new RegExp('guc_login.js')).test(val.src)){
                    src = val.src;
                }
            });
            position = GucLoginInstance.Util.getQueryString(src,'position');

            _this.PromptMask = $('.guc-login-mask',window.top.document);
            _this.PromptMask.css({'z-index':GucLoginInstance.Conf.zIndex});
            if(position){
                _this.PromptMask.css({'position':position});
            }

            _this.Prompt = $('.guc-login-prompt',window.top.document);
            _this.Prompt.css({'margin-left':'-'+(GucLoginInstance.Conf.promptWidth/2)+'px',
                'margin-top':'-'+(GucLoginInstance.Conf.promptHeight/2)+'px',
                'width':GucLoginInstance.Conf.promptWidth,'height':GucLoginInstance.Conf.promptHeight,
                'z-index':GucLoginInstance.Conf.zIndex+1,'left':'50%','top':'50%'});
            if(position){
                _this.Prompt.css({'position':position});
            }

            //$(".guc_img_wechat").attr("src",ucenterServer+'/ucenter/images/arrow_code.png');
        },
        bindEvent:function(){
            var _this = this;
            if(GucLoginInstance.Conf.movable){
                _this.Prompt.tinyDraggable({exclude:'.guc-form-wrapper,span.head-close,input,a,button,label,span'});
            }
            var close = _this.Prompt.find('.guc-login-tab > a.head-close');
            close.bind('click',function(){
                _this.hidePrompt(false);
            });

            $('.guc-login-prompt').find("input:text").val("");
            var username_shorter = "用户名长度不能少于 6 个字符。";
            var password_shorter = "登录密码不能少于 6 个字符。";
            var password_long = "登录密码不能多于16个字符。";
            var agreement_text = "您没有接受协议";
            var msg_un_blank = "用户名不能为空";
            var msg_un_length = "用户名长度不能大于 32 个字符。";
            var msg_un_format = "用户名含有非法字符";
            var msg_un_registered = "用户名已经存在,请重新输入";
            var msg_email_blank = "邮件地址不能为空";
            var msg_email_registered = "邮箱已存在,请重新输入";
            var msg_un_registered_access_forbidden = "不允许注册的邮箱类型";
            var msg_email_format = "邮件地址不合法";
            var msg_email_long = "邮件地址必须6至32字符";

            var msg_info_email_def = "请输入常用邮箱，通过验证后用于登录";
            var msg_info_user_def = "6~32个字符，支持英文、数字和\"_\"格式";
            var msg_info_pwd_def = "必须至少含字母和数字，6至16个字符";

            var login_notice = $("#login-notice");
            var login_username_notice = login_notice;
            var login_password_notice = login_notice;
            var register_notice = $("#register-notice");
            var register_username_notice = register_notice;
            var register_email_notice = register_notice;
            var register_password_notice = register_notice;
            var register_agreement_notice = register_notice;

            var pwdstrength = $(".pwd-strength");
            var pwdstrength1 = $(".pwd-strength-1");
            var pwdstrength2 = $(".pwd-strength-2");
            var pwdstrength3 = $(".pwd-strength-3");

            var register_username_info = $("#register-username-info");
            var register_email_info = $("#register-email-info");
            var register_password_info = $("#register-password-info");

            var register_username_confirm = $("#register-username-confirm");
            var register_email_confirm = $("#register-email-confirm");
            var register_password_confirm = $("#register-password-confirm");

            var register_email_input = $(".register-email");
            var register_username_input = $(".register-username");
            var register_password_input = $(".register-password");


            var supportPlaceholder = 'placeholder' in document.createElement('input');
            var emailCouldSubmit = false;//判断是否可以提交
            var usernameCouldSubmit = false;
            var passwordCouldSubmit = false;
            var agreementCouldSubmit = true;
            var ShowMessage=false;
            var username_auto='';
            var COOKIE_USERNAME = 'gs_username';

            var isEmail = function( email )
            {
                //var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
                //var reg1 = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{1,9}(\.[a-z]{1,9})?)$/g;
                var reg1 = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

                return reg1.test( email );
            }

            var chkLogin = function  () {
                var login_username = $(".login-username");
                var login_password = $(".login-password");
                var login_remember = $("#remember");
                var username_value = "";
                var password_value = "";
                var remember_value = login_remember.is(":checked") ? true : false;
                var submit_disabled = false;

                username_value = login_username.val();
                password_value = login_password.val();

                if ( username_value == '' )
                {
                    login_username_notice.find('span').html('请填写您的用户名');
                    login_username_notice.show();
                    submit_disabled = true;
                }
                if ( submit_disabled )
                {
                    return false;
                }

                if ( password_value == '' )
                {
                    login_password_notice.find('span').html('请填写您的密码');
                    login_password_notice.show();
                    submit_disabled = true;
                }

                if ( submit_disabled )
                {
                    return false;
                }
                login_notice.find('span').html('登录中...');
                login_notice.removeClass('alert-error').show();


                $.post(GucLoginInstance.Conf.uc_ajax_login_url, {
                    username: username_value,
                    password: password_value,
                    remember:remember_value,
                    format:'json'
                },check_login_callback);

            };

            var check_login_callback = function (json) {
                var json = $.parseJSON(json);
                if (!json.error) {
                    if(json.redirect && json.redirect_url){
                        window.location.href=json.redirect_url;
                        return false;
                    }
                    else{
                        $('head').append(json.content);
                        username_auto=$('.login-username').val();
                        setTimeout(function(){
                            _this.doLoginCallback();
                        },2000);
                    }

                } else if (json.error == 1) {
                    login_notice.find('span').html(json.content);
                    login_notice.addClass('alert-error').show();
                    last_count = json.last_count;
                    if (last_count <= 0)
                        {
                            $('.btn-zondy.login-submit').attr("disabled",true);
                            $('.btn-zondy.login-submit').attr("style",'background-color:#e0e0e0');
                            interval_obj = window.setInterval(setRemainTime,1000*60*30);
                        };
                }
            };
            function setRemainTime()
               {
                   $('.btn-zondy.login-submit').attr('disabled',false);
                   $('.btn-zondy.login-submit').removeAttr("style");
                   window.clearInterval(interval_obj);
               }

            var chkRegister = function () {
                if (!emailCouldSubmit || !passwordCouldSubmit || !usernameCouldSubmit || !agreementCouldSubmit) {
                    return false;
                }
                var register_username = $(".register-username");
                var register_password = $(".register-password");
                var register_email = $(".register-email");
                var username_value = "";
                var password_value = "";
                var email_value = "";
                var agreement_value = agreementCouldSubmit ? "true" : "";

                username_value = register_username.val();
                password_value = register_password.val();
                email_value = register_email.val();


                $.post(GucLoginInstance.Conf.uc_ajax_register_url, {
                    username: username_value,
                    password: password_value,
                    email: email_value,
                    agreement: agreement_value
                },ajax_register_callback, "TEXT");
            };

            var ajax_register_callback = function(json) {
                var json = $.parseJSON(json);
                if (!json.error) {
                    $(".sign-up").hide();
                    $(".success").show();
                    var timeCount = 2;
                    var timeCont = $(".guc-login-timer");
                    // $.cookie(GucLoginInstance.Conf.cookieName,$(".register-username").val(),{path:GucLoginInstance.Conf.cookiePath});
                    timeOutId = setTimeout('GucLoginInstance.Main.doRegisterCallback();',3000);
                    var intervalID = setInterval(function(){
                        timeCont.html(timeCount);
                        timeCount--;
                        if(timeCount <= -1){
                            clearInterval(intervalID);
                        }
                    },1000);
                } else if (json.error == 1) {
                    register_notice.find('span').html(json.content);
                    register_notice.addClass('alert-error').show();
                }
            };

            var chkSubmit =function (){
                if (passwordCouldSubmit && emailCouldSubmit && usernameCouldSubmit && agreementCouldSubmit) {
                    $('.register-submit').removeClass('disabled').removeAttr('disabled','disabled');
                } else {
                    $('.register-submit').addClass('disabled').attr('disabled','disabled');
                }
            };

            var check_argeement = function (isagr){
                var agr = isagr || ($(".register-agreement").is(":checked") ? true : false);
                if(!agr){
                    register_agreement_notice.find('span').html(agreement_text);
                    register_agreement_notice.show();
                }else{
                    register_agreement_notice.find('span').empty();
                    register_agreement_notice.hide();
                }
            }
            var check_password_ex = function ( password ){

                if(password.length == 0){
                    register_password_confirm.hide();
                    passwordCouldSubmit = false;
                    pwdstrength.hide();
                }
                else if ( password.length<6 )
                {

                    if(ShowMessage){
                        setErrInfo(register_password_info,register_password_input,password_shorter);
                        register_password_confirm.hide();
                        //register_password_notice.find('span').html(password_shorter);
                        //register_password_notice.show();
                        //pwdstrength.css({'display':'none'});
                        //pwdstrength.hide();
                    }
                    register_password_confirm.hide();
                    passwordCouldSubmit = false;
                    chkSubmit();

                }
                else if(password.length > 16)
                {
                    setErrInfo(register_password_info,register_password_input,password_long);
                    register_password_confirm.hide();
                    passwordCouldSubmit = false;
                    pwdstrength.hide();
                }
                else
                {
                    setDefInfo(register_password_info,register_password_input,msg_info_pwd_def);

                    if(checkPwdStrong(password) >= 2){
                        register_password_confirm.css('display','inline-block');
                        passwordCouldSubmit = true;
                        chkSubmit();
                    }
                    else
                    {
                        setErrInfo(register_password_info,register_password_input,msg_info_pwd_def);
                        register_password_confirm.hide();
                        passwordCouldSubmit = false;
                        chkSubmit();
                    }
                }

                showPwdStrength(password.length,password);
                ShowMessage=false;
            }

            var check_password = function ( password )
            {

                if(password.length == 0){
                    register_password_confirm.hide();
                    passwordCouldSubmit = false;
                    pwdstrength.hide();
                }
                else if ( password.length<6 )
                {

                    if(ShowMessage){

                    }
                    register_password_confirm.hide();
                    passwordCouldSubmit = false;
                    chkSubmit();

                }
                else if(password.length > 16)
                {
                    setErrInfo(register_password_info,register_password_input,password_long);
                    register_password_confirm.hide();
                    passwordCouldSubmit = false;
                    pwdstrength.hide();
                }
                else
                {
                    setDefInfo(register_password_info,register_password_input,msg_info_pwd_def);

                    if(checkPwdStrong(password) >= 2){
                        register_password_confirm.css('display','inline-block');
                        passwordCouldSubmit = true;
                        chkSubmit();
                    }else{
                        register_password_confirm.hide();
                        passwordCouldSubmit = false;
                        chkSubmit();
                    }

                }

                showPwdStrength(password.length,password);
                ShowMessage=false;

            }

            function showPwdStrength(len,strg){
                pwdstrength.css({'display':'none'});
                pwdstrength1.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                pwdstrength2.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                pwdstrength3.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                /*
                if(len>=6){
                    pwdstrength1.addClass('pwd-strength-weak');
                    if(strg>=40 && strg<60){
                        pwdstrength1.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                        pwdstrength1.addClass('pwd-strength-normal');
                        pwdstrength2.addClass('pwd-strength-normal');
                    }else if(strg>=60){
                        pwdstrength1.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                        pwdstrength2.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                        pwdstrength1.addClass('pwd-strength-strong');
                        pwdstrength2.addClass('pwd-strength-strong');
                        pwdstrength3.addClass('pwd-strength-strong');
                    }

                }
                */
                var level = checkPwdStrong(strg);

                switch(level){
                    case 0:
                        break;
                    case 1:{
                        pwdstrength1.addClass('pwd-strength-weak');
                    }
                        break;
                    case 2:{
                        pwdstrength1.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                        pwdstrength1.addClass('pwd-strength-normal');
                        pwdstrength2.addClass('pwd-strength-normal');
                    }
                        break;
                    case 3:{
                        pwdstrength1.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                        pwdstrength2.removeClass('pwd-strength-weak pwd-strength-normal pwd-strength-strong');
                        pwdstrength1.addClass('pwd-strength-strong');
                        pwdstrength2.addClass('pwd-strength-strong');
                        pwdstrength3.addClass('pwd-strength-strong');
                    }
                        break;
                }

                pwdstrength.css({'display':'block'});
            }

            function checkPwdStrong(str){

                var num = 0;
                var isPermited = (/[a-zA-Z]/g).test(str);

                if(str.length < 6 || str.length > 16){
                    return num;
                }

                if(isPermited){
                    num++;
                }

                isPermited = (/\d+/g).test(str);
                if(isPermited){
                    num++
                }

                if(num < 2){
                    return num;
                }

                isPermited = (/[^0-9a-zA-Z]+/g).test(str);
                if(isPermited){
                    num++
                }

                return num;
            }

            var checkEmail = function (email)
            {
                var submit_disabled = false;

                if (email == '')
                {
                    //register_email_notice.find('span').html(msg_email_blank);
                    //register_email_notice.show();
                    submit_disabled = true;
                    return false;
                }
                else if(email.length > 32 || (email.length > 0 && email.length < 6))
                {
                    setErrInfo(register_email_info,register_email_input,msg_email_long);
                    register_email_confirm.hide();
                    submit_disabled = true;
                }
                else if (!isEmail(email))
                {
                    setErrInfo(register_email_info,register_email_input,msg_email_format);
                    register_email_confirm.hide();
                    submit_disabled = true;
                }



                if( submit_disabled )
                {
                    emailCouldSubmit = false;
                    chkSubmit();
                    return false;
                }

                $.get(GucLoginInstance.Conf.uc_ajax_check_eamil, {email: email},check_email_callback, "TEXT");

            };

            var check_email_callback = function (result)
            {
                //result=$.trim(result);
                if ( Number(result) >= 0 )
                {
                    emailCouldSubmit = true;
                    chkSubmit();
                    register_email_confirm.css('display','inline-block');
                }
                else if (Number(result) == -6) {
                    setErrInfo(register_email_info,register_email_input,msg_email_registered);
                    emailCouldSubmit = false;
                    chkSubmit();                    
                }
                else if(Number(result) == -5){
                    setErrInfo(register_email_info,register_email_input,msg_un_registered_access_forbidden);
                    //register_email_notice.find('span').html(msg_un_registered_access_forbidden);
                    //register_email_notice.show();
                    emailCouldSubmit = false;
                    chkSubmit();
                    //register_email_confirm.hide();
                }
                else if(Number(result) == -4){
                    setErrInfo(register_email_info,register_email_input,msg_email_format);
                    //register_email_notice.find('span').html(msg_un_registered_access_forbidden);
                    //register_email_notice.show();
                    emailCouldSubmit = false;
                    chkSubmit();
                }
                else
                {
                    setErrInfo(register_email_info,register_email_input,msg_email_registered);
                    //register_email_notice.find('span').html(msg_email_registered);
                    //register_email_notice.show();
                    emailCouldSubmit = false;
                    chkSubmit();
                    register_email_confirm.hide();
                }
            }

            var is_registered = function  (username) {

                var unlen = username.replace(/[^\x00-\xff]/g, "**").length;

                if ( username == '' )
                {
                    //setErrInfo(register_username_info,register_username_input,msg_un_blank);

                    register_username_confirm.hide();
                    var submit_disabled = true;
                } else if ( !chkstr( username ) )
                {
                    setErrInfo(register_username_info,register_username_input,msg_un_format);

                    register_username_confirm.hide();
                    var submit_disabled = true;
                }
                else if ( unlen < 6 )
                {
                    setErrInfo(register_username_info,register_username_input,username_shorter);

                    register_username_confirm.hide();
                    var submit_disabled = true;
                }
                else if ( unlen > 32 )
                {
                    setErrInfo(register_username_info,register_username_input,msg_un_length);

                    register_username_confirm.hide();
                    var submit_disabled = true;

                }

                if ( submit_disabled )
                {
                    usernameCouldSubmit = false;
                    chkSubmit();
                    return false;
                }

                $.get(GucLoginInstance.Conf.uc_ajax_check_name, {username: username},registed_callback, "TEXT");
            };

            var registed_callback =function (result)
            {
                //result=$.trim(result);
                if ( Number(result) >= 0 )
                {
                    usernameCouldSubmit = true;
                    chkSubmit();
                    register_username_confirm.css('display','inline-block');
                }
                else if (Number(result) == -3)
                {
                    setErrInfo(register_username_info,register_username_input,msg_un_registered);
                    usernameCouldSubmit = false;
                    chkSubmit();
                    register_username_confirm.hide();
                }
                else if(Number(result) == -2){
                    //register_email_notice.find('span').html(msg_un_registered_access_forbidden);
                    //register_email_notice.show();
                    setErrInfo(register_email_info,register_email_input,msg_un_format);
                    emailCouldSubmit = false;
                    chkSubmit();
                    register_email_confirm.hide();
                }
                else if(Number(result) == -1){

                    setErrInfo(register_email_info,register_email_input,msg_un_format);
                    emailCouldSubmit = false;
                    chkSubmit();
                    register_email_confirm.hide();
                }
            }

            var chkstr = function (str) {
                var isPermited = (/^[_a-zA-Z0-9]+$/).test(str);
                return isPermited;
            };

            var setErrInfo = function (lab_info,input_edit,str_info)
            {
                lab_info.text(str_info);
                lab_info.css('color','red');
                input_edit.addClass("err_input");
            }

            var setDefInfo = function (lab_info,input_edit,str_info)
            {
                lab_info.text(str_info);
                lab_info.css('color','#9d9d9d');
                input_edit.removeClass("err_input");
            }

            //使用方法 Urlencode(string) 得到的是UTF-8编码的数据
            var Urlencode = function(string){
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128)
                    {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return escape(utftext);
            }
            //add by zc on 20150619
            //加载微信登录二维码
            var showWxLogin = function(){
                $.get(ucenterServer+'/ucenter/user.php?a=get_wxinfo&wx_back_url='+this.location.href,
                    function(data){
                        var obj = new WxLogin({
                            id:"wx_container",
                            appid: data.result.appid,
                            scope: "snsapi_login",
                            redirect_uri: data.result.redirect_uri,
                            state: data.result.state,
                            href: "http://www.smaryun.com/ucenter/images/guc_login.css"
                        });
                    }
                );
            }
            //add by zc  微信登录相关的功能
            //切换到微信登录
            $(".guc_img_wechat").on("click",function(){
                showWxLogin();
                _this.toggleTab(3);
            })
            //由微信登录页面切换到云平台登录页面
            $(".return-submit").on("click",function(){
                _this.toggleTab(1);
            })


            $('#guc-btn-tab-toggle-2').on('click',function(){
                _this.toggleTab(1);
            });
            $('#guc-btn-tab-toggle-1').on('click',function(){
                _this.toggleTab(2);
            });
            $('#guc-btn-tab-toggle-3').on('click',function(){
                _this.toggleTab(1);
            });

            $(".login-submit").on("click", function(){chkLogin();});

            $(".register-submit").on("click",function(){chkRegister()});

            $(".label-placeholder_login").on("click",function(){
                $(this).prev('input').focus();
            });

            $("input").on("focus",function(){
                if ($(this).val() =='') {
                    $(this).next('.label-placeholder_login').css('color','#ccc');
                }
            }).on("blur",function(){
                if ($(this).val() == '') {
                    $(this).next('.label-placeholder_login').show();
                    $(this).next('.label-placeholder_login').css('color','#999');
                }
            }).on("input propertychange",function(){
                if ($(this).val() == ''){
                    $(this).next('.label-placeholder_login').show();
                } else {
                    $(this).next('.label-placeholder_login').hide();
                }
            });

            $(".login-username").on("blur",function(){

            }).on("focus",function(){
                login_username_notice.hide();
            }).on("keydown",function(e){
                if (e.keyCode == 13) {
                    $(".login-password").focus();
                    e.returnvalue = false; 
                    e.keyCode = 0;
                    return false;
                }
            });

            $(".login-password").on("blur",function(){

            }).on("focus",function(){
                login_password_notice.hide();
            }).on("keydown",function(e){
                if (e.keyCode == 13) {
                    chkLogin();
                    return false;
                }
            });

            $(".register-email").on("blur",function(){
                if (!supportPlaceholder && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
                    checkEmail('');
                } else {
                    checkEmail($(this).val());
                }

            }).on("focus",function(){

                register_email_confirm.hide();
                 setDefInfo(register_email_info,register_email_input,msg_info_email_def);
            }).on("keydown",function(e){
                if (e.keyCode == 13) {
                    $(".register-username").focus();
                    return false;
                }
            });

            $(".register-username").on("blur",function(){
                is_registered($(this).val());
            }).on("focus",function(){

                setDefInfo(register_username_info,register_username_input,msg_info_user_def);
                register_username_confirm.hide();

            }).on("keydown",function(e){
                if (e.keyCode == 13) {
                    $(".register-password").focus();
                    return false;
                }
            });

            $(".register-password").on("blur",function(){
                ShowMessage=true;
                //check_password($(this).val());
                check_password_ex($(this).val());

            }).on("focus",function(){

                setDefInfo(register_password_info,register_password_input,msg_info_pwd_def);

                register_password_confirm.hide();

            }).on("input",function(e){
                check_password($(this).val());
                if (e.keyCode == 13) {
                    chkRegister();
                    return false;
                }
            });
            $(".register-password").on("focus",function(){
                register_password_notice.find('span').empty();
                register_password_notice.hide();
            });

            $(".register-agreement").on("change", function(){
                agreementCouldSubmit = ($(this).is(":checked")) ? true : false;
                check_argeement(agreementCouldSubmit);
                chkSubmit();
            });

            var username=$.cookie(COOKIE_USERNAME);
            if(username != null){
                $('.login-username').val(username);
                $(".login-username").next('.label-placeholder_login').hide();
                $(".login-password").focus();
            }
        },
        doLoginCallback:function(){
            GucLoginInstance.Conf.loginCallback();
            if(GucLoginInstance.Conf.loginReload){
                window.location.reload();
            }
        },
        doRegisterCallback:function(){
            clearTimeout(timeOutId);
            if(GucLoginInstance.Conf.regToLogin){
                GucLoginInstance.login();
            }
        },
        toggleTab:function(id){
            clearTimeout(timeOutId);
            GucLoginInstance.Main.init();
            GucLoginInstance.Main.showPrompt(id);
        },
        showPrompt:function(regTab){
            var _this = this;
            if(GucLoginInstance.Conf.mask){
                _this.PromptMask.css({"display":"block"});
            }
            $(".guc-login-tab").hide();
            $(".guc-login-tab"+regTab).show();
            /*
            if(regTab){
                $('.guc-login-tab1').css({"display":"none"});
                $('.guc-login-tab2').css({"display":"block"});
            }else{
                $('.guc-login-tab1').css({"display":"block"});
                $('.guc-login-tab2').css({"display":"none"});
            }
            */
            _this.PromptOffset = {
                'left':_this.Prompt.css('left'),
                'top':_this.Prompt.css('top')
            };
            _this.Prompt.css({"display":"block"});
        },
        hidePrompt:function(){
            var _this = this;
            _this.PromptMask.css({"display":"none"});
            _this.Prompt.css({"display":"none"});
            _this.clear();
        },
        logout:function(){
            $.post(GucLoginInstance.Conf.uc_ajax_logout_url, {},function(json){
                var json = $.parseJSON(json);
                if (!json.error) {
                    $('head').append(json.content);
                    setTimeout(function () {
                        window.location.href = json.url;
                    }, 2000);
                }               
            });            
        }
    }

    GucLoginInstance.login = function(callback){
        if(callback && jQuery.isFunction(callback)){
            GucLoginInstance.Conf.loginCallback = callback;
        }else{
            GucLoginInstance.Conf.loginCallback = function(){};
        }
        GucLoginInstance.Main.init();
        GucLoginInstance.Main.showPrompt(1);
    };

    GucLoginInstance.register = function(){
        GucLoginInstance.Main.init();
        GucLoginInstance.Main.showPrompt(2);
    };
    GucLoginInstance.logout = function(){
        GucLoginInstance.Main.logout();
    };    
    jQuery.GucLoginInstance = GucLoginInstance;
});

function GucLogin(callback){
    jQuery.GucLoginInstance.login(callback);
};
function GucRegister(){
    // jQuery.GucLoginInstance.register();
};
function GucLogout(){
    jQuery.GucLoginInstance.logout();
};

// $('register-close').click(function(){
//     $('.backgroundNull').css({'display':'none'});
//     $('.registerMessage input').value = '';
//     $('.submitRegister').value = '提交';
//     return false;
// });

// $('.submitRegister').click(function(){
//     $('.guc-login-prompt').css({'display':'none'});
//     var userName = $('.usernameRegister').val();
//     var userEmail = $('.userEmaiRegisterRegister').val();
//     var password1 = $('.passwordRegister1').val();
//     var password2 = $('.passwordRegister2').val();
//     if(password1 == password2){
//         var data = {};
//         data.username = userName;
//         data.email = userEmail;
//         data.password = password1;
//         data.role_id = 6;
//         // $.cors = true;
//         $.ajax({
//             url:'../ajax.php?act=user_regist',
//             data:data,
//             type:'post',
//             // dataType:'json',
//             success:function(res){
//                 var message = JSON.parse(res);
//                 // alert('111');
//                 if(message.code == 1){
//                     alert('申请成功，等待审核！');
//                     $('.backgroundNull').css({'display':'none'});
//                     $('.registerMessage form input').val('');
//                     $('.submitRegister').val('提交');
//                 }else if(message.code == -1){
//                    alert(message.msg); 
//                 }   
//             },
//             error:function(res){
//                 alert('ajax失败');
//             }
//         })
//     }else{
//         alert('两次密码不一致！');  
//     } 
//     return false;
// })