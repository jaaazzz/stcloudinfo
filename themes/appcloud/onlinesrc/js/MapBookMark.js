//编辑地图书签
function editMapBookMark(obj) {
    $(obj).parent().find(".mapBookMark").attr("disabled", false);
}

//删除地图书签
function delMapBookMark(obj) {
    $(obj).parent().remove();
}

function bookmarkOnFocus(obj) {
    $(obj).attr("disabled", false);
}

function bookmarkOnBlur(obj) {
    $(obj).attr("disabled", true);
}