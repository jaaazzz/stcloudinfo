/// <summary>
/// 矢量地图文档资源_以瓦片方式
/// </summary>
goog.provide('Zondy.Source.MapDocTileSource');
Zondy.Source.MapDocTileSource = function (opt_options) {
    var options = opt_options !== undefined ? opt_options : {};

    /**
    * @public
    * @type {string}
    * 地图服务请求地址（可通过初始对象的options赋值）
    */
    this.ip = options.ip !== undefined ? options.ip : "127.0.0.1";

    /**
    * @public
    * @type {string}
    * 地图服务请求端口（可通过初始对象的options赋值）
    */
    this.port = options.port !== undefined ? options.port : "6163";

    /**
    * @public
    * @type {string}
    * 地图名称,必须赋值
    */
    this.name = options.name !== undefined ? options.name : null;

    /**
    * @public
    * @type {number}
    * 最大分辨率,新瓦片必须指定
    */
    this.maxResolution = options.maxResolution !== undefined ? options.maxResolution : null;


    //根据投影获取地图范围
    var tileProjection = options.projection !== undefined ? options.projection : null;

    //地图范围
    var tileExtent = [-180, -90, 180, 90];
    if (tileProjection != null) {
        tileExtent = tileProjection.getExtent();
    }

    //设置地图范围
    this.extent = options.extent !== undefined ? options.extent : tileExtent;

    /**
    * @public
    * @type {number}
    * 动态裁图瓦片地图总级数
    */
    this.maxZoom = options.maxZoom !== undefined ? options.maxZoom : 16;

    /**
    * @public
    * @type {number}
    * 地图图片大小
    */
    this.tileSize = options.tileSize !== undefined ? options.tileSize : 512;

    //分辨率数组，根据传入的分辨率或范围计算得到
    this.resolutions = this.getResolutions();
    /**
    * @public
    * @type {Array.<number>}
    * 地图的原点，可由外部指定,动态裁图默认左上角
    */

    this.origin = options.origin !== undefined ? options.origin : ol.extent.getCorner(this.extent, ol.extent.Corner.TOP_LEFT);


    this.rlt = Math.random();

    this.f = goog.isDef(options.f) ? options.f : "png";

    /**
    * @public
    * @type {string}
    * 指示需要显示的地图图层号
    * show,hide,include,exclude 4种形式
    * eg:  'layers=show:1,2,3','layers=include:4,5,7'
    */
    this.layers = goog.isDef(options.layers) ? options.layers : null;

    /**
    * @public
    * @type {string}
    * 用户指定的图层过滤条件，它由多个键值对组成，值为您所要设定的过滤条件。
    * eg：'1:ID>4,3:ID>1'
    * 中文请使用UTF-8编码后再传入参数
    * javascitpt中请使用encodeURI（）函数编码后再代入filters参数中
    * 注意，在此函数中“：”和“，”是保留字符，用于表示键值对概念和分隔不同图层的条件，请不要将这2个字符用于自定义条件中
    */
    this.filters = goog.isDef(options.filters) ? options.filters : null;

    /**
    * @public
    * @type {Zondy.Object.CDisplayStyle}
    * 显示参数
    */
    this.style = goog.isDef(options.style) ? options.style : null;

    /**
    * @public
    * @type { Zondy.Object.CSRefInfoBySRSID}
    * 动态投影参数,设置地图文档在服务器端重新投影所需的空间参考系对象
    */
    this.proj = goog.isDef(options.proj) ? options.proj : null;


    /**
    * @private
    * @type {string}
    * 客户端标识，用以服务器缓存地图，一般情况下无需赋值
    */
    this.guid = options.guid !== undefined ? options.guid : Zondy.Util.newGuid();

    /**
    * @private
    * true表示动态裁图的方式显示出图
    */
    this.cache = false;

    /**
    * @private
    * @type {Array.<number>}
    * 创建网格(内部调用)
    */
    this.zondyTileGrid = new ol.tilegrid.TileGrid({
        origin: this.origin, //数组类型，如[0,0],
        resolutions: this.resolutions, //分辨率
        tileSize: this.tileSize //瓦片图片大小
    });

    ol.source.TileImage.call(this, {
        attributions: options.attributions,
        extent: this.extent,
        tileExtent: this.tileExtent,
        ip: this.ip,
        port: this.port,
        logo: options.logo,
        opaque: options.opaque,
        projection: options.projection,
        state: options.state !== undefined ? options.state : undefined,
        tileGrid: this.zondyTileGrid,
        tilePixelRatio: options.tilePixelRatio,
        wrapX:options.wrapX,
        crossOrigin: options.crossOrigin !== undefined ? options.crossOrigin : null  //"anonymous"为跨域调用,
    });

    /**
    * @protected
    * @type {ol.TileUrlFunctionType}
    * 拼接取图地址方法
    */
    this.tileUrlFunction = options.tileUrlFunction !== undefined ? options.tileUrlFunction :this.tileUrlFunctionExtend;

    this.url_ = "http://" + this.ip + ":" + this.port + "/igs/rest/mrms/docs/" + this.name;
};
ol.inherits(Zondy.Source.MapDocTileSource, ol.source.TileImage);

/**
* 创建分辨率数组
*/
Zondy.Source.MapDocTileSource.prototype.getResolutions = function () {
    if (this.maxResolution == null) {
        var width = ol.extent.getWidth(this.extent);
        var height = ol.extent.getHeight(this.extent);
        this.maxResolution = (width >= height ? height : width) / (this.tileSize);
    }
    var opt_resolutions = new Array(this.maxZoom);
    for (z = 0; z < this.maxZoom; ++z) {
        opt_resolutions[z] = this.maxResolution / Math.pow(2, z);
    }
    return opt_resolutions;
};

/**
* 拼接url取图地址
* @param {Array.<number>} tileCoord 数据格式包含级数、行号、列号.
* @param {string} pixelRatio 像素比率
* @param {ol.proj.Projection} projection 投影
*/
Zondy.Source.MapDocTileSource.prototype.tileUrlFunctionExtend = function (tileCoord, pixelRatio, projection) {
    //判断返回的当前级数的行号和列号是否包含在整个地图范围内
    if (this.tileGrid != null) {
        var tileRange = this.tileGrid.getTileRangeForExtentAndZ(this.extent, tileCoord[0], tileRange);
        if (!tileRange.contains(tileCoord)) {
            return;
        }
    }

    //根据行列号，计算当前取图的范围即Bbox
    var cur_resolution = null;
    if(this.maxResolution!=null)
    {
       cur_resolution = this.maxResolution/ Math.pow(2, tileCoord[0]);
    }

        //定义参数
    var params = {
        'f': this.f,
        'cache': false,
        'rlt': this.rlt,
        'guid': this.guid
    };
    //设置地图文档显示样式
    if (this.style != null) {
        ol.obj.assign(params,{ 'style':$.toJSON(this.style)});
    }
    //设置地图投影
    if (this.proj != null) {
        ol.obj.assign(params, {'proj':$.toJSON(this.proj)});
    }
    //设置地图文档要显示的图层
    if (this.layers != null) {
       ol.obj.assign(params, {'layers':this.layers});
    }
    //设置过滤条件
    if (this.filters != null) {
        ol.obj.assign(params, {'filters':this.filters});
    }


    //计算一张瓦片的范围 
    //var h = this.tileSize * cur_resolution;
    var tileR = new ol.TileRange(tileCoord[1],tileCoord[1],tileCoord[2],tileCoord[2]);
    var opt_extent = null;
    var bbox =  this.tileGrid.getTileRangeExtent(tileCoord[0],tileR,opt_extent);
   
    ol.obj.assign(params, { 'w': this.tileSize });
    ol.obj.assign(params, { 'h': this.tileSize });
    ol.obj.assign(params, { 'bbox': bbox.join(',') });
   // var url = this.url_ + '?bbox='+bbox[0]+','+bbox[1]+','+bbox[2]+','+bbox[3];
    return ol.uri.appendParams(this.url_, params);;
};

/// <summary>
/// 显示动态裁图的矢量地图文档的功能服务
/// </summary>
﻿goog.provide('Zondy.Map.MapDocTileLayer');

/// <summary>显示动态裁图的矢量地图文档的功能服务构造函数</summary>
/// <param {string} opt_name 图层名称，无实际意义可为null.</param>
/// <param {string} opt_docName 要显示的地图文档名称.</param>
/// <param name="opt_options" type="Object">属性键值对</param>
Zondy.Map.MapDocTileLayer = function (opt_name, opt_docName, opt_options) {
    var options = opt_options !== undefined ? opt_options : {};
    options.layerName = opt_name;
    options.name = opt_docName;
    ol.obj.assign(this, options);

    var options_clone = ol.obj.assign({}, options);
    options_clone.maxResolution = Infinity;

    ol.layer.Tile.call(this, (options_clone));
    

    this.source = goog.isDef(options.source) ? options.source : null;

    if (this.source == null) {
        this.source = new Zondy.Source.MapDocTileSource(options);
    }
    this.setSource(this.source);

    
};
ol.inherits(Zondy.Map.MapDocTileLayer, ol.layer.Tile);