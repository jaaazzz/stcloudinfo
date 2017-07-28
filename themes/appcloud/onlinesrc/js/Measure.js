var wgs84Sphere = new ol.Sphere(6378137); //定义一个球对象(wgs84)
//当前绘制的要素（Currently drawn feature.）
var sketch;
//帮助提示框对象（The help tooltip element.）
var helpTooltipElement;
//帮助提示框显示的信息（Overlay to show the help messages.）
var helpTooltip;
//测量工具提示框对象（The measure tooltip element. ）
var measureTooltipElement;
//测量工具中显示的测量值（Overlay to show the measurement.）
var measureTooltip;
//当用户正在绘制多边形时的提示信息文本
var continuePolygonMsg = 'Click to continue drawing the polygon';
//当用户正在绘制线时的提示信息文本
var continueLineMsg = 'Click to continue drawing the line';

var isGeodesicCheck; //测地学方式对象
var draw; // global so we can remove it later
var source;
var vector;

//鼠标移动事件处理函数
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click to start drawing'; //当前默认提示信息
    //判断绘制几何类型设置相应的帮助提示信息
    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg; //绘制多边形时提示相应内容
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg; //绘制线时提示相应内容
        }
    }
    helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
    helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
    $(helpTooltipElement).removeClass('tooltip-hidden'); //移除帮助提示框的隐藏样式进行显示
};





/**
* 测量长度输出
* @param {ol.geom.LineString} line
* @return {string}
*/
var formatLength = function (line) {
    var length;
    isGeodesicCheck = $('#geodesicLen').is(":checked");
    if (isGeodesicCheck) { //若使用测地学方法测量
        var coordinates = line.getCoordinates(); //解析线的坐标
        length = 0;
        var sourceProj = map.getView().getProjection(); //地图数据源投影坐标系
        //通过遍历坐标计算两点之前距离，进而得到整条线的长度
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
            length += wgs84Sphere.haversineDistance(c1, c2);
        }
    } else {
        length = Math.round(line.getLength() * 100) / 100; //直接得到线的长度
    }
    var output;
    //获取用户选择的测量单位
    var measureUnit = $("#measure-unit-option-len li.selected").text();
    if (measureUnit == "千米") {
        output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'; //换算成KM单位
    } else if (measureUnit == "米") {
        output = (Math.round(length * 100) / 100) + ' ' + 'm'; //m为单位
    }
    else {
        output = (Math.round(length * 100) / 100) * 100 + ' ' + 'cm';
    }
    return output; //返回线的长度
};
/**
* 测量面积输出
* @param {ol.geom.Polygon} polygon
* @return {string}
*/
var formatArea = function (polygon) {
    var area;
    isGeodesicCheck = $('#geodesicArea').is(":checked");
    if (isGeodesicCheck) {//若使用测地学方法测量
        var sourceProj = map.getView().getProjection(); //地图数据源投影坐标系
        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326')); //将多边形要素坐标系投影为EPSG:4326
        var coordinates = geom.getLinearRing(0).getCoordinates(); //解析多边形的坐标值
        area = Math.abs(wgs84Sphere.geodesicArea(coordinates)); //获取面积
    } else {
        area = polygon.getArea(); //直接获取多边形的面积
    }
    var output;
    var measureUnit=$("#measure-unit-option-area li.selected").text();
    if (measureUnit=="平方千米") {
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>'; //换算成KM单位
    } else if(measureUnit=="平方米"){
        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>'; //m为单位
    } else {
        output = (Math.round(area * 100) / 100)*10000 + ' ' + 'cm<sup>2</sup>'; //m为单位
    }
    return output; //返回多边形的面积
};

/**
* 加载交互绘制控件函数 
*/
function measure(measureType) {
    initMeasure();
    var type = (measureType == 'area' ? 'Polygon' : 'LineString');
    draw = new ol.interaction.Draw({
        source: source, //测量绘制层数据源
        type: /** @type {ol.geom.GeometryType} */(type),  //几何图形类型
        style: new ol.style.Style({//绘制几何图形的样式
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(draw);

    createMeasureTooltip(); //创建测量工具提示框
    createHelpTooltip(); //创建帮助提示框

    var listener;
    //绑定交互绘制工具开始绘制的事件
    draw.on('drawstart', function (evt) {
        sketch = evt.feature; //绘制的要素

        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate; // 绘制的坐标
        //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
        listener = sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target; //绘制几何要素
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(/** @type {ol.geom.Polygon} */(geom)); //面积值
                tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength( /** @type {ol.geom.LineString} */(geom)); //长度值
                tooltipCoord = geom.getLastCoordinate(); //坐标
            }
            measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
            if (measureType == 'area') {
                $("#measureAreaRlt").html(output);
            } else {
                $("#measureLenRlt").html(output);
            }
            measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
        });
    }, this);
    //绑定交互绘制工具结束绘制的事件
    draw.on('drawend',
                function (evt) {
                    measureTooltipElement.className = 'measureTip tooltip-static'; //设置测量提示框的样式
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null; //置空当前绘制的要素对象
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null; //置空测量工具提示框对象
                    createMeasureTooltip(); //重新创建一个测试工具提示框显示结果
                    ol.Observable.unByKey(listener);
                }, this);
}

/**
*创建一个新的帮助提示框（tooltip）
*/
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'measureTip tooltip-hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}
/**
*创建一个新的测量工具提示框（tooltip）
*/
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'measureTip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}

//初始化测量
function initMeasure() {
    clearMeasure();
    //加载测量的绘制矢量层
    source = new ol.source.Vector({wrapX:false}); //图层数据源.
    vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({ //图层样式
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)' //填充颜色
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',  //边框颜色
                width: 2   // 边框宽度
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    map.addLayer(vector);
    map.on('pointermove', pointerMoveHandler); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
    //地图绑定鼠标移出事件，鼠标移出时为帮助提示框设置隐藏样式
    $(map.getViewport()).on('mouseout', function () {
        $(helpTooltipElement).addClass('tooltip-hidden');
    });
}

//停止绘制工具，并删除之前的结果
function clearMeasure() {
    if (draw) {
        map.removeInteraction(draw); //移除绘制图形
    }
    if (vector) {
        map.removeLayer(vector);
        vector = null;
        source = null;
    }
    //清除之前的结果
    $(".tooltip-static").each(function () {
        $(this).parent().remove();
    });

    $(".tooltip-hidden").each(function() {
        $(this).parent().remove();
    });
    $("#measureAreaRlt,#measureLenRlt").text("");
}