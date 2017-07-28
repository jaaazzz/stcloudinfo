/*
*  滚动
*  huangbin 
*  2015-11-06
*/

var zd_slide = function(config){
    this.arrow_f = config.arrow_f ? config.arrow_f : '';                //上或左的dom id
    this.arrow_s = config.arrow_s ? config.arrow_s : '';                //下或右的dom id
    this.slide_div = config.slide_div ? config.slide_div : '';          //要滚动的div id
    this.data_length = config.data_length ? config.data_length : 1;     //总的数据量
    this.data_size = config.data_size ? config.data_size : 8;           //分页个数
    this.slide_width = config.slide_width ? config.slide_width : 100;   //一个单位滚动的距离
    this.slide_type = config.slide_type ? config.slide_type : 1;        //滚动类型(1:上下,2:左右)
    this.page_row = config.page_row ? config.page_row : 1;              //页面行数
    this.slide_page = config.slide_page ? config.slide_page : 0;        //滚动位置(相当与分页的当前页码)
    this.init = function(){
        this.html_init();
        this.arrow_f_click();
        this.arrow_s_click();
    };
    //页面初始化
    this.html_init = function(){
        if (this.data_length < this.data_size * this.page_row) {
            $("#"+this.arrow_f+"").hide();
            $("#"+this.arrow_s+"").hide();
        }
        else{
            if (this.arrow_f_can_click()) {
                $("#"+this.arrow_f+"").removeClass('disabled');
            }
            else{
                $("#"+this.arrow_f+"").addClass('disabled');
            }
            if (this.arrow_s_can_click()) {
                $("#"+this.arrow_s+"").removeClass('disabled');
            }
            else{
                $("#"+this.arrow_s+"").addClass('disabled');
            }       
        }
    };
    //上或左箭头点击事件
    this.arrow_f_click = function(){
        var self = this;
        var arrow_f_id = self.arrow_f;
        //jquery对象
        var $arrow_f = $("#"+arrow_f_id+"");
        //绑定click事件
        $arrow_f.on('click',function(){
            if(self.arrow_f_can_click()){
                var $slide_div = $("#"+self.slide_div+"");
                var total_slide_width = parseInt(self.slide_width) * (parseInt(self.slide_page) - 1);
                //上滚动
                if( self.slide_type == 1){
                    $slide_div.animate({'margin-top': '-'+total_slide_width+'px'}, "slow");
                }
                //左滚动
                else{
                    $slide_div.animate({'margin-left': '-'+total_slide_width+'px'}, "slow");
                }
                self.slide_page --;
            }
            self.html_init();
        })
    };
    //下或右箭头点击事件
    this.arrow_s_click = function(){
        var self = this;
        var arrow_s_id = self.arrow_s;
        //jquery对象
        var $arrow_s = $("#"+arrow_s_id+"");
        //绑定click事件
        $arrow_s.on('click',function(){
            if(self.arrow_s_can_click()){
                var $slide_div = $("#"+self.slide_div+"");
                var total_slide_width = parseInt(self.slide_width) * (parseInt(self.slide_page) + 1);
                //下滚动
                if( self.slide_type == 1){
                    $slide_div.animate({'margin-top': '-'+total_slide_width+'px'}, "slow");
                }
                //右滚动
                else{
                    $slide_div.animate({'margin-left': '-'+total_slide_width+'px'}, "slow");
                }
                self.slide_page ++;
            }
            self.html_init();
        })
    };
    //判断上或左是否可点
    this.arrow_f_can_click = function(){
        return this.slide_page > 0;
    };
    //判断下或右是否可点
    this.arrow_s_can_click = function(){
        var total_page = Math.ceil(parseInt(this.data_length) / parseInt(this.data_size));
        return total_page - this.page_row > this.slide_page;
    };
}