//文档预览函数
function docView($div, rLink, fileName){
	var w = 870,
	h = 1062,
	Sys = {},
	ua = navigator.userAgent.toLowerCase(),
	swfLink = rLink.replace(fileName, "");
	fileName = fileName.replace(".pdf", ".swf");
	swfLink = swfLink + "pdf_swf/" + fileName;
	var s;
	var pdfurl = "http://www.smaryun.com/dev/pdfviewer/viewer/viewer.html?defult_url=" + rLink;
	var swfurl = "http://www.smaryun.com/dev/flexpaper/index.html?defult_url=" + swfLink;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	var ieversion;
	if (!!window.ActiveXObject || "ActiveXObject" in window) {
		ieversion = parseInt(Sys.ie);
		var ie11 = ua.indexOf("trident") > -1 && ua.indexOf("rv") > -1;
		if (ieversion > 8 || ie11) {
			var frame = "<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen src='" + pdfurl + "' width='" + w + "' height='" + h + "' style='border-left:22px solid #858586;border-right:22px solid #858586;border-bottom:22px solid #858586;'   ></iframe>";
		} else {
			w = 704;
			var frame = "<iframe scrolling='no' src='" + swfurl + "' width='" + w + "' height='" + h + "'  style='border:none;overflow: hidden;scrolling:hidden;overflow-x:hidden;overflow-y:hidden;'></iframe>";
		}
	} else if (Sys.firefox || Sys.chrome || Sys.safari) {
		var frame = "<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen src='" + pdfurl + "' width='" + w + "' height='" + h + "' style='border-left:22px solid #858586;border-right:22px solid #858586;border-bottom:22px solid #858586;' ></iframe>";
	} else {
		var frame = "<iframe scrolling='no' src='" + swfurl + "' width='" + w + "' height='" + h + "' style='border:none;overflow: hidden;scrolling:hidden;overflow-x:hidden;overflow-y:hidden;'></iframe>";
	}
	$div.html(frame);
}