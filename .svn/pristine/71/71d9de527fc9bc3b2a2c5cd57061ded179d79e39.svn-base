/*
 * 存放共有js方法
 * created by huangbin
 * time 2016.3.29
*/

/**
 * 收藏
 * @param $obj_id 收藏对象id
 * @param $obj_type 收藏对象类型
*/
function add_collection(obj_id,obj_type,event){
	var data = {
		'obj_type':obj_type,
		'obj_id':obj_id,
		'c':'add_collection',
		'act':'collection'
	};
	event = event ? event : window.event; 
	var obj = event.srcElement ? event.srcElement : event.target; 
	$.post('ajax.php',data,function(result){
		if (result.success) {
			var id = result.result.collection_id;
			var count = result.result.count;
			$(obj).replaceWith('<a onclick=javascript:cancle_collection('+id+','+obj_id+',"'+obj_type+'");  id="collection" class="collection">'+count+'</a>');
		}else{
			if (result.msg == 'not_login') {
				GucLogin();
			}
		}
	},'JSON');
}

function add_collection2(obj_id,obj_type,e) {
	var data = {
		'obj_type': obj_type,
		'obj_id': obj_id,
		'c': 'add_collection',
		'act': 'collection'
	};
	$.post('ajax.php', data, function (result) {
		if (result.success) {
			var id = result.result.collection_id;
			var count = result.result.count;
			$(e).replaceWith('<a class="app_collect" onclick=cancle_collection2('+id+','+obj_id+',"'+ obj_type+'",this);>'+ count + '</a>');
		} else {
			if (result.msg == 'not_login') {
				GucLogin();
			}
		}
	}, 'JSON');
}
/**
 * 取消收藏
 * @param cid 收藏id
*/
function cancle_collection(cid,obj_id,obj_type,event){
	var data = {
		'obj_type':obj_type,
		'obj_id':obj_id,
		'c_id':cid,
		'c':'cancle_collection',
		'act':'collection'		
	};
	event = event ? event : window.event; 
	var obj = event.srcElement ? event.srcElement : event.target;
	$.post('ajax.php',data,function(result){
		if (result.success) {
			var count = result.result.count;
			$(obj).replaceWith('<a onclick=javascript:add_collection('+obj_id+',"'+obj_type+'");  id="collection" class="no-collection">'+count+'</a>');
		}else{
			if (result.msg == 'not_login') {
				GucLogin();
			}
		}
	},'JSON');	
}

function cancle_collection2(cid,obj_id,obj_type,e){
	var data = {
		'obj_type':obj_type,
		'obj_id':obj_id,
		'c_id':cid,
		'c':'cancle_collection',
		'act':'collection'
	};
	$.post('ajax.php',data,function(result){
		if (result.success) {
			var count = result.result.count;
			$(e).replaceWith('<a class="app_no_collection" onclick=add_collection2('+obj_id+',"'+obj_type+'",this);  ><div class="app_no_collect">'+count+'</div></a>');
		}else{
			if (result.msg == 'not_login') {
				GucLogin();
			}
		}
	},'JSON');
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
