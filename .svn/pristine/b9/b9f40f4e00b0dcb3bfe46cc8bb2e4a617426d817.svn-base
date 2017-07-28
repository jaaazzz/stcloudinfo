var pageObj=function(max_page,current_page,current_url,size,count){
    current_page=parseInt(current_page);
    max_page=parseInt(max_page);
    this.prev_page = $('.pagination li').first();
    this.next_page = $('.pagination li').last();
    this.baselink = current_url;
    this.max_page=max_page;
    this.current_page=current_page;
    this.size=parseInt(size);
    this.count=parseInt(count);
    this.initPagination = function(){
        if(this.max_page <= 1){
            $(".pagination").hide();
        } else if (this.max_page <= 10) {
            $(".pagination").show();
            this.forCreate(this.max_page);
        } else {
            $(".pagination").show();
            switch (this.current_page) {
                case 1:
                case 2:
                case 3:
                    this.forCreate(4);
                    this.omission();
                    this.normalCreate(this.max_page);
                    break;
                case 4:
                    this.forCreate(5);
                    this.omission();
                    this.normalCreate(this.max_page);
                    break;
                case this.max_page:
                case this.max_page - 1:
                case this.max_page - 2:
                    this.normalCreate(1);
                    this.omission();
                    this.forCreate(this.max_page,this.max_page-3);
                    break;
                case this.max_page - 3:
                    this.normalCreate(1);
                    this.omission();
                    this.forCreate(this.max_page,this.max_page-4);
                    break;
                default:
                    this.normalCreate(1);
                    this.omission();
                    this.normalCreate(this.current_page-1);
                    this.normalCreate(this.current_page, true);
                    this.normalCreate(this.current_page+1);
                    this.omission();
                    this.normalCreate(this.max_page);
                    break;
            }
        }
        this.prev_page.children('a').attr('href',this.creatUrl(this.current_page - 1));
        this.next_page.children('a').attr('href',this.creatUrl(this.current_page + 1));
        if (this.current_page == 1) {
            this.prev_page.addClass('disabled').children('a').attr('href','javascript:void(0)');
        } else if (current_page == max_page) {
            this.next_page.addClass('disabled').children('a').attr('href','javascript:void(0)');
        }
        if(this.count>0){
            $(".page_statics").show();
            var start=(current_page-1)*this.size+1;
            var end=0;
            if(current_page!=max_page){
                end=this.size*current_page;
            }else{
                end=this.count;
            }
            $(".page_statics").html('显示'+start+'-'+end+'条记录，共'+count+'条记录');
        }else{
            $(".page_statics").hide();
        }
    }

    this.forCreate= function(max,min){
        var i=1;
        if(min!=undefined){
            i=min;
        }
        for (i; i <= max; i++) {
            var active = '';
            if (i == this.current_page) {
                active = 'class="active"';
            }
            var url = this.creatUrl(i);
            this.next_page.before('<li '+ active +'><a href="'+url+'">'+ i +'</a></li>');
        }
    }

    this.omission= function(){
        this.next_page.before('<li class="disabled"><a href="#">...</a></li>');
    }

    this.normalCreate= function(page, isCurrent){
        var _li;
        if (isCurrent) {
            _li = '<li class="active">';
        } else {
            _li = '<li>';
        }
        var url = this.creatUrl(page);
        this.next_page.before(_li + '<a href="'+url+'">'+ page +'</a></li>');
    }
    this.creatUrl= function(page){
        var currentPage = page;
        var url = this.baselink;
        if (page && page != 0) {
            if(url.indexOf('?')<0){
                url += '?page=' + page;
            }else{
                url+='&page='+page;
            }
        }
        return url;
    }
}





