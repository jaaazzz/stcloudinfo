$(function(){
    /* 分页 begin */
    {if $page_count && $page}
    var max_page = {$page_count};
    var current_page = {$page};
    initPageHtml(max_page,current_page);
    {/if}
    //初始化分页
    function initPageHtml(maxPage,current_page){
        zdPage.creatPageHtml({
            current_pno : current_page,
            pagerId : 'pageId',
            total : maxPage,
            mode : 'link',
            getLink : function(n){
                return "{$current_url}&p="+n;
            }
        })            
    }
    /* 分页 end */
})