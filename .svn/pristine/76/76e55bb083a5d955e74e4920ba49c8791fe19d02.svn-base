$(function(){
	$(".menu-ul li").hover(
		function(){
			$(this).addClass("active");
			$(this).find(".menu-li-2").show();
		},
		function(){
			$(this).removeClass("active");
			$(this).find(".menu-li-2").hide();
		}
	);
	$(".middle-1-list .item").hover(
		function(){
			$(this).find(".item-2").show();
		},
		function(){
			$(this).find(".item-2").hide();
		}
	);
	$(".middle-2-list .middle-2-item").hover(
		function(){
			$(".middle-2-list .middle-2-item").removeClass("active");
			$(this).addClass("active");
			showExpContent();
		}
	);
	showExpContent();
	function showExpContent(){
		var $contentJq = $('.content-middle-2 .middle-2-item.active').next('data');
		var res_name = $contentJq.attr("data-res-name");
		var res_desc = $contentJq.attr("data-desc"); 
		var res_img_url = $contentJq.attr("data-img-url");
		var $listContent = $(".middle-2-list-content");
		$listContent.find(".content-title").html(res_name);
		$listContent.find(".content-text").html(res_desc);
		$listContent.find(".content-right img").attr("src",res_img_url);
	}
})