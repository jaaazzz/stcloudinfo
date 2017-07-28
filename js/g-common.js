/* $Id : g-common.js 2013年6月20日14:27:19 HHXU $ */

/* *
 * 绑定通用事件 
 */
$(function(){
	$(window).on("scroll resize", function(){
		var width = document.body.clientWidth;
		if (width > 1100 ) {
			$("#goToTop").css("right",(width - 1080)/2  + "px");
		} else {
			$("#goToTop").css("right","10px");
		}

		if ($(window).scrollTop() > 0) {
			$("#goToTop").show();
		} else {
			$("#goToTop").hide();
		}
	});
	$("#goToTop").click(function(){
		//window.scroll(0,0);
		$('html, body').animate({ scrollTop: 0 }, 120);
	});
	
	$('.nav.account .user-action,.nav .order-action').hover(function(){
		$(this).children("ul").show();
		$(this).addClass("open");
	},function(){
		$(this).children("ul").hide();
		$(this).removeClass("open");
	});
	
	

    $('.modal').on('show', function() {
        $(this).css({
            'margin-top': function () {
                return -($(this).height() / 2);
            }
        });
    });

    $('li.user-action').hover(function(){
        $(this).find('.navi-arrow').removeClass('mouseout').addClass('mousein');
        $(this).children('ul.dropdown').css('width',$(this).css('width'));
    },function(){
        $(this).find('.navi-arrow').removeClass('mousein').addClass('mouseout');
    });
    $('li.my-order.order-action').hover(function(){
        $(this).find('.navi-arrow').removeClass('mouseout').addClass('mousein');
    },function(){
        $(this).find('.navi-arrow').removeClass('mousein').addClass('mouseout');
    });
});
(function ($) {
	window.util = {
	
		kbOrMbOrGB: function(size){
			var kb = window.parseFloat('0' + size) / 1024;
			if (kb > 1024) {
				var mb = kb / 1024;
				if(mb > 1024){
					return Math.round(mb / 1024 * 100) / 100 + 'GB';
				}
				return Math.round(mb * 100) / 100 + 'MB';
			}
			return Math.round(kb * 100) / 100 + 'KB';
		},

		changeDropdown: function (){
			var dropdown=$(".navbar-wrapper .nav.account .dropdown");
			if(dropdown.css('display')=="none"){
			$(".navbar-wrapper .nav.account .dropdown").css('display','block')
			}
			else   $(".navbar-wrapper .nav.account .dropdown").css('display','none');
		},

	    chineseSubstr: function (string, begin, num) {
		    var ascRegexp = /[^\x00-\xFF]/g, i = 0;
		    while(i < begin) (i ++ && string.charAt(i).match(ascRegexp) && begin --);
		    i = begin;
		    var end = begin + num;
		    while(i < end) (i ++ && string.charAt(i).match(ascRegexp) && end --);
		    return string.substring(begin, end);
		},

		ellipsisWidth: function (item, limit) {
			var _self = item.find('.name-tooltip');
		    var element = _self.find('a');
		    if (element.length == 0) {
		    	element = _self.find('span');
		    }

			var limitWidth = limit || element.parent().width();
			var ellipsisText = '…';
			var temp = element.clone();
			element.parent().append(temp);
			var realWidth = temp.width();
			if(realWidth <= limitWidth){
				temp.remove();
				return;
			}
			_self.tooltip({
		        	animation: false
		        });
			temp.html(ellipsisText);
			var elliWidth = temp.width();
			var str = element.html();
			str = str.replace(/\s+/g, ' ');
			var s, totalWidth = 0;
			for(var i = 0, len = str.length; i < len; i++){
				s = str.charAt(i);
				temp.html(s === ' ' ? '&nbsp;' : s);
				totalWidth += temp.width();
				if(totalWidth + elliWidth > limitWidth){
					str = str.substr(0, i);
					break;
				}
			}
			element.html(str + ellipsisText);
			temp.remove();
		},
	
		ellipsisHeight: function (item) {
			var _self = item.find('.name-tooltip');
		    var element = _self.find('a');
		    if (element.length == 0) {
		    	element = _self.find('span');
		    }

			var limitHeight = 40;
			var ellipsisText = '…';
			var temp = element.clone();
			element.parent().append(temp);
			var realHeight = temp.height();
			if(realHeight <= limitHeight){
				temp.remove();return;
			}
			_self.tooltip({
		        	animation: false
		        });
			temp.html(ellipsisText);

			var str = element.html();
			str = str.replace(/\s+/g, ' ');
			var s = '', totalHeight = 0;
			for(var i = 0, len = str.length; i < len; i++){
				s += (str.charAt(i) === ' ' ? '&nbsp;' : str.charAt(i));
				temp.html(s + ellipsisText);
				totalHeight = temp.height();
				if(totalHeight > limitHeight){
					str = str.substr(0, i);
					break;
				}
			}
			element.html(str + ellipsisText);
			temp.remove();
		},
		
		//黄劲松添加于2014.04.16
		cutEllipsis: function (isLat, item, str, limit, obj) {
			var _self = $(item).last().find('.name-tooltip');
			if(obj != undefined){
				_self = $("#" + obj).parent();
			}
			_self.tooltip({
		        animation: false
		    });
			var element = _self.find('a');
		    if (element.length == 0) {
		    	element = _self.find('span');
		    }
			var limitLength = 40;
			if(isLat)
				limitLength = limit || element.parent().width();
			element.html(str);
			var realLength = isLat ? element.width() : element.height();
			if(realLength <= limitLength) return;
			var ellipsisText = '…';
			element.html(ellipsisText);
			str = str.replace(/\s+/g, ' ');
			var s = '', totalLength = 0;
			for(var i = 0, len = str.length; i < len; i++){
				s += (str.charAt(i) === ' ' ? '&nbsp;' : str.charAt(i));
				element.html(s + ellipsisText);
				totalLength = isLat ? element.width() : element.height();
				if(totalLength > limitLength){
					str = str.substr(0, i);
					break;
				}
			}
			element.html(str + ellipsisText);
		},

		/**
		 * 复选框全选事件
		 * @param obj dom操作对象
		 * @param tagname 需要操作的checkbox所在dom名称,即dom的id属性
		 * @author huangbin
		 * @time 2016-2-16 
		*/
		CheckBoxSelctAll: function(obj,tagname){
			var elems = document.getElementById(tagname).getElementsByTagName("INPUT");
			for (var i=0; i < elems.length; i++) {
				if (!elems[i].disabled) {
					elems[i].checked = obj.checked;
				}
			}
		},
		
		gisAddToCart: function (goodsId,period,is_tried,addonList,packageName,trial_period,is_try_group){
			var url = 'flow.php?step=gis_add_to_cart',
			$buypage = $("#goto-buy-page"),
			$buypagebtn = $("#goto-buy-page-btn"),
			$payment = $("#payment"),
			$paymentbtn = $("#payment .btn-zondy.success");
			$payorderbtn = $(".btn-zondy.pay");
			$tryorderbtn = $(".btn-zondy.try");
			if (addonList == undefined || packageName == undefined) {
				var goods_data = {
						goods_id: goodsId,
						period:period,
						trial_period:trial_period,
						order_group:is_try_group,
						is_tried:is_tried
					};
			} else {
				var is_customize_goods=true;
				var goods_data = {
						goods_id: goodsId,
						period:period,
						is_tried:is_tried,
						order_group:is_try_group,
						trial_period:trial_period,
						addon_list: JSON.stringify(addonList),
						package_name: packageName
					};
			}

			$.ajax({
				url:url,
				type:'post',
				dataType:'json',
				data:goods_data,
				success:function(result){
					if(result.success){
						result.url = result.result.url;
						if(is_customize_goods){
							var myCookie = eval('('+$.cookie("ZONDY_CUSTOMIZE")+')');
							if (myCookie) {
								myCookie[goodsId] = null;
								$.cookie("ZONDY_CUSTOMIZE",JSON.stringify(myCookie));
							}
						}
						location.href = result.url;
					}else{
						if(result.url){
							window.location = result.url;
						}else{
							alert(result.msg);
						}
						$buypagebtn.removeClass('disabled').html(is_tried?"确&nbsp;&nbsp;&nbsp;认":"付&nbsp;&nbsp;&nbsp;款");
					}
					
				},
				error:function(){
					$buypagebtn.removeClass('disabled').html(is_tried?"确&nbsp;&nbsp;&nbsp;认":"付&nbsp;&nbsp;&nbsp;款");
					alert('购买发生了错误');
				}
			});
		}
	
	}
})(jQuery);

// Array.prototype.Contains = function(pra) {
// 	if(null == pra){ return; }
//   	for(var i = 0;i < this.length;i++) { 
//    		if(this[i] != pra) { 
//     		return true; 
//    		}
//   	}  
//   	return false; 
// }

//生成提示信息
function checkErrorShow(tag,msg) {
    tag.find('.gis-help-inline').html(msg).show();
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如200.00
 */
function setPriceFormat(num,p_type)
{
	switch(p_type){
		//取整
		case 1:
			price_num = parseInt(num);
			break;
		//保留两位小数,四舍五入
		case 2:
		  	price_num = Math.round(num * 100) /100;
			break;	
	}
  	return price_num;
}

/**
 * 使用钱包支付
 * @param num 数值(Number或者String)
 */
function pay_by_wallet(order_sn){
	var url = "flow.php?step=wallet_to_pay";
	$.ajax({
		url:url,
		data:'order_sn='+order_sn,
        dataType:'json',
		success:function(result){
			if (result.success) {
				location.href = '/user.php?act=order_list';
			}
			else{
				if (result.msg == 'not_login') {
					alert('请先登录!');
				}
				else if(result.msg == 'param_error'){
					alert('参数错误!');
				}
                else{
                    alert(result.msg);
                    location.href = "/user.php?act=bill";
                }
			}
		}
	})
}

// $(document).ajaxStart(function(evt, req, settings){
// 	alert('start');
// })

// $(document).ajaxComplete(function(){
//   alert('done');
// });
