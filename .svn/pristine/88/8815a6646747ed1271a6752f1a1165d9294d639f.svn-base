/*
*  分页
*  huangbin 
*  2015-8-12
*/
var zdPage = {
	pagerId 		: '',		//生成分页控件id
	mode			: 'click',	//模式(link 或者 click)
	current_pno		: 1, 		//当前页码
	total			: 1, 		//总页码
	prePageText		: '上一页',
	nextPageText	: '下一页',
	//生成分页控件代码
	creatPageHtml : function(config){
		this.init(config);
		var initHtml = "<div class='pagination pagination-centered' style='margin-top: 20px;margin-bottom: 0px;'>" +
                        	"<ul>" +
                        	"</ul>" +
                    	"</div>";
        if (this.total > 1) {
        	$("#"+this.pagerId).html(initHtml);
        	this.$pagination = $('.pagination ul');
        	this.initPagination(this.total,this.current_pno);
    	}
        else{
            $("#"+this.pagerId).html('');
        }
	},
	//
	initPagination : function(max_page,current_page){
        max_page = parseInt(max_page);
        current_page = parseInt(current_page);
        var preHtml = '',nextHtml = '';
        if (current_page == 1) {
        	preHtml = '<li class="pre disabled"><a href="javascript:void(0)">'+this.prePageText+'</a></li>';
        }
        else{
        	preHtml = '<li class="pre"><a '+this.getClickHandler(current_page-1)+'>'+this.prePageText+'</a></li>';
        }
        this.$pagination.append(preHtml);
        if (max_page > 1 && max_page <= 10) {
        	this.forCreate(max_page,current_page);
        }
        else if (max_page > 10) {
            switch (current_page) {
                case 1:
                case 2:
                case 3:
                this.forCreate(4,current_page);
                this.omission();
                this.normalCreate(max_page);
                break;
            case 4:
                this.forCreate(5,current_page);
                this.omission();
                this.normalCreate(max_page);
                break;
            case max_page:
            case max_page - 1:
            case max_page - 2:
                this.normalCreate(1);
                this.omission();
                this.forCreate(max_page,current_page,max_page-3);
                break;
            case max_page - 3:
                this.normalCreate(1);
                this.omission();
                this.forCreate(max_page,current_page,max_page-4);
                break;
            default:
                this.normalCreate(1);
                this.omission();
                this.normalCreate(current_page-1);
                this.normalCreate(current_page, true);
                this.normalCreate(current_page+1);
                this.omission();
                this.normalCreate(max_page);
                break;
            }        	
        }
        if (current_page == max_page) {
            nextHtml = '<li class="next disabled"><a href="javascript:void(0)">'+this.nextPageText+'</a></li>';
        }
        else{
            nextHtml = '<li class="next"><a '+this.getClickHandler(current_page+1)+'>'+this.nextPageText+'</a></li>';
        }
        this.$pagination.append(nextHtml);
	},
    forCreate : function(max,current_page,min){
        var i=1;
        if(min!=undefined){
            i=min;
        }
        for (i; i <= max; i++) {
            var active = 'class="li-num"';
            var clickHtml = '';
            if (i == current_page) {
                active = 'class="active li-num"';
            }
            else{
            	clickHtml = this.getClickHandler(i);
            }
            this.$pagination.append('<li '+ active +'><a '+clickHtml+'>'+ i +'</a></li>');
        }
    },
    omission : function(){
        this.$pagination.append('<li class="disabled"><a href="javascript:">...</a></li>');
    },
    normalCreate : function(page, isCurrent){
        var _li,clickHtml = '';
        if (isCurrent) {
          _li = '<li class="active li-num">';
        } else {
          _li = '<li class="li-num">';
          clickHtml = this.getClickHandler(page);
        }
        this.$pagination.append(_li + '<a '+clickHtml+'>'+ page +'</a></li>');
    },
	//初始化
	init : function(config){
		this.current_pno = isNaN(config.current_pno) ? 1 : parseInt(config.current_pno);
		this.total = isNaN(config.total) ? 1 : parseInt(config.total);
		if(config.pagerId){this.pagerId = config.pagerId;}
		if(config.mode){this.mode = config.mode;}
		if(config.click && typeof(config.click) == 'function'){this.click = config.click;}
        if(config.getLink && typeof(config.getLink) == 'function'){this.getLink = config.getLink;}
		if(config.prePageText){this.prePageText = config.prePageText;}
		if(config.nextPageText){this.nextPageText = config.nextPageText;}
		if(!this._config){
			this._config = config;
		}
	},
	//不刷新页面直接手动调用选中某一页码
	selectPage : function(n){
		this._config['current_pno'] = n;
		this.creatPageHtml(this._config);
	},
	//
	getClickHandler : function(n){
        if(this.mode == 'click'){
            return 'href="javascript:void(0)" onclick="return zdPage._clickHandler('+n+')"';
        }
        else{
            return 'href="'+this.getLink(n)+'"';
        }
		//link模式，也是默认的
		//return 'href="'+this.getLink(n)+'"';
	},
	_clickHandler	: function(n){
		var res = false;
		if(this.click && typeof this.click == 'function'){
			res = this.click.call(this,n) || false;
			this.selectPage(n);
		}
		return res;
	}
}