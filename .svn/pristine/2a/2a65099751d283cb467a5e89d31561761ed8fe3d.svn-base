$(function(){
	$('.change-pwd').click(function(){
		$('input[name=new-password]').val('');
		$('input[name=old-password]').val('');
		$('#change-password').modal('show');
	})
	//确认修改
	$('.edit-password').click(function(){
		var new_password = $('input[name=new-password]').val();
		var old_password = $('input[name=old-password]').val();
		var user_name = $('input[name=username]').val();
		var data = {
			'old_password':old_password,
			'new_password':new_password,
			'user_name':user_name,
			'act':'changePwd'
		};
		if (checkPwd()) {
		$.post('ajax.php',data,function(result){
			if (result.success) {
				alert('修改成功');
				$('#change-password').modal('hide');
			}else{
				if (result.msg == 'not_same') {
					alert('输入密码不正确');
				}
			}
		},'JSON')
		};
	});
	//检测密码输入正确性
	function checkPwd(){
		var submit_flag = false;
		var jquery_pwd = $('input[name=new-password]');
		var pwd = $.trim(jquery_pwd.val());
		if (pwd.length == 0) {
			alert('密码不能为空');
		}
		else if (pwd.length < 6) {
			alert('密码长度不能小于6个字符');
		}
		else if(pwd.length > 16){
			alert('密码长度不能大于16个字符');
		}
		else if(checkPwdStrong(pwd) < 2) {
			alert('密码中必须包含字母和数字');
		}
		else{
			submit_flag = true;
		}
		return submit_flag;
	}
	$('input[name=new-password]').on('blur',function(){
		//checkPwd();
	})
	//检查密码强度
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
	var point_all  = parseInt($('input[name=point_all]').val());
	var point_have = parseInt($('input[name=point_have]').val());
	var host_num   = parseInt($('input[name=host_num]').val());
	var host_have  = parseInt($('input[name=host_have]').val());
    //点数饼图
    $('.point_pic').highcharts({
        chart: {
            type: 'pie'
        },

        credits: {
            text: '',
            href: ''
        },

        title: {
            text: '',
        },

        plotOptions: {
            pie: {
                allowPointSelect: false,
                animation:false,
                dataLabels: {
                    enabled: false,
                }
            }
        },

        series: [{
            data: [{
                name: '已用',
                color: '#f5f5f5',
                y: point_all-point_have
            }, {
                name: '可用',
                color: '#3a85c6',
                y: point_have
            }]
        }]
    });
    //主机数饼图
    $('.host_pic').highcharts({
        chart: {
            type: 'pie'
        },

        credits: {
            text: '',
            href: ''
        },

        title: {
            text: '',
        },

        plotOptions: {
            pie: {
                allowPointSelect: false,
                animation:false,
                dataLabels: {
                    enabled: false,
                }
            }
        },

        series: [{
            data: [{
                name: '已用',
                color: '#f5f5f5',
                y: host_num-host_have
            }, {
                name: '可用',
                color: '#3a85c6',
                y: host_have
            }]
        }]
    });
})