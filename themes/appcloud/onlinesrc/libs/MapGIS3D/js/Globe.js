/**
* @classdesc 
* 三维球核心类，直接与三维地球交互的主要接口都在该类中<br/>
* {@link Globe#addEventListener|addEventListener} 事件绑定方法,
* {@link Globe#removeEventListener|removeEventListener} 注销方法 
* 
* @example
*  var globe = new Globe();
*  globe.load(function(){
*      console.log('load success');
*   });
*  globe.addEventListener(EventType.MouseWheel, function () {
*      console.log(arguements);
*  });
* 
* @author 创建者:姚志武 2014-04-28
* @class
*/
var Globe = function () {
    var downUrl = "setup/MapGIS.WebSceneOcx.CAB"; //如果机器没有安装控件，指定控件的下载地址
    var style = "left:0px;top:0px;width:100%;height:100%;position:absolute;z-index:0;";

    /**
    * 导航条是否显示标志位
    * @type {bool}
    */
    this._isNavigateVisible = true;
    /**
    * 状态栏是否显示标志位
    * @type {bool}
    */
    this._isPlantUIStateVisible = true;
    /**
    * 调试坐标系是否显示标志位
    * @type {bool}
    */
    this._isDebugGrid = false;
    /**
    * 格网是否显示标志位
    * @type {bool}
    */
    this._isGridNet = false;

    /**
    * 插件元素对象
    * @type {Object}
    */
    this._ocxObj = null;

    /**
    * 文档对象信息,对应对象为ClassLib.js中的MapDocObj，这里使用数组保存
    * @type {Array.<MapDocObj>}
    */
    this._docObj = [];
    /**
    * 网络叠加图层,两个属性：id和name，例如：天地图或谷歌图,这里使用数组
    * @type {Object}
    */
    this._overMapObj = [];
    /**
    * 添加的kml或gml数据,三个两个属性：id、name、类型，类型分为kml和gml,这里使用数组
    * @type {Object}
    */
    this._xmlLayerObj = [];
    /**
    * 用于存放绘制的图形要素返回的id,便于删除操作,每个要素由id和pnts组成
    * @type {Array.<String>}
    */
    this._drawElements = [];
    /**
    * 当前正在绘制二维要素的点集
    * @type {String}
    */
    this.currentElePnts = "";
    /**
    * 用于存放绘制的三维图形要素返回的id,便于删除操作
    * @type {Array.<String>}
    */
    this._draw3DElements = [];
    /**
    * 用于存放动画漫游的集合，每个漫游由name和id组成，name自定义，id为返回值
    * @type {Array.<String>}
    */
    this._animFlyElements = [];
    /**
    * 当前正在进行的分析类别
    * @type {AnalyseType}
    */
    this._analyseOper = "";
    /**
    * 当前分析得到的结果
    * @type {String}
    */
    this._analyseInfo = null;
    /**
    * 相关事件的数组
    * @type {Event}
    */
    this._events = null;
    /**
    * Globe对象的加载方法，主要进行控件相关事件的初始化操作
    * @param {function}
    */
    this.load = function (callbackFun) {
        if (new Util().isIE) {

            //对事件信息进行初始化操作
            if (!this._events) {
                this._events = new Event();

                for (var t in EventType) { //添加事件类型
                    this._events.addEventType(EventType[t]);
                }
            }
            var globe = this;
            window._MapGIS_EarthControl_OnLoad = function (obj) {
                var ocx = document.getElementById('MapGIS_EarthControl');
                if (ocx && ocx.object) { //初始化注册插件事件
                    ocx.onreadystatechange = null;

                    var ocxEventType = ["FinishedAnalyze", "FinishedDraw", "PickLabel", "PickModel", "KeyDown",
                    "KeyUp", "MouseMove", "MouseWheel", "MButtonDown", "MButtonUp", "Jumped", "PickElement",
                    "LButtonDblClk", "LButtonDown", "LButtonUp", "RButtonDblClk", "RButtonDown", "RButtonUp",
                    "FinishedAddDoc", "FinishedLoadCache"];
                    for (var i = 0; i < ocxEventType.length; i++) {
                        (function (eventName) {
                            var eFunc = function () {
                                var fun = "_on" + eventName;
                                globe[fun].apply(globe, arguments); //globe[fun](arguments);将globe[fun]的方法用于globe
                            };
                            ocx.attachEvent ? ocx.attachEvent(eventName, eFunc) : ocx.addEventListener(eventName, eFunc);
                        })(ocxEventType[i]); //参数是ocxEventType[i]
                    }

                    var ini = "Initialized";
                    var iFunc = function () {
                        globe._onCreationComplete(arguments);
                    };
                    ocx.attachEvent ? ocx.attachEvent(ini, iFunc) : ocx.addEventListener(ini, iFunc);

                    if (callbackFun) {
                        callbackFun(ocx.globeObj);
                    }
                }
                else {
                    alert("未能获取到插件对象,请确保插件已安装或已启用!");
                }
                window._MapGIS_EarthControl_OnLoad = null;
            }
            // 修改说明：根据页面中是否存在MapGIS_EarthControl来判断是否重新写入插件
            // 修改人：姚志武 2014-04-30
            if (document.getElementById('MapGIS_EarthControl') != null)
                window._MapGIS_EarthControl_OnLoad();
            else
                document.write('<object onreadystatechange="_MapGIS_EarthControl_OnLoad()" id = "MapGIS_EarthControl" codebase="' + downUrl + '" classid = "clsid:56D6E862-F22D-41EF-B517-F2255A4250CB" style="' + style + '"/>');

            this._ocxObj = document.getElementById('MapGIS_EarthControl');
        }
        else {
            document.write('<div style="font-size: 48px;color: red;text-align: center;margin-top: 30px;">抱歉,三维地球控件只支持IE浏览器!</div>');
        }
    };
    /**
    * 获取插件版本号
    */
    this.getVersionNumber = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetVersionNumber();
        }
    };
    /**
    * 获取插件的相关信息,弹出Windows控件
    */
    this.showAboutBox = function () {
        this._ocxObj.object.AboutBox();
    };
    /**
    * 添加屏幕绘制对象
    * @param {String} keyName 当前叠加对象id
    * @param {String} imgPath 图片具体地址
    * @param {Double} x 叠加要素的x
    * @param {Double} y 叠加要素的y
    * @param {Double} scaleX 叠加要素x方向的缩放比例
    * @param {Double} scaleY 叠加要素y方向的缩放比例
    */
    this.addOverlay = function (keyName, imgPath, x, y, scaleX, scaleY) {
        this._ocxObj.object.AddOverlay(keyName, imgPath, x, y, scaleX, scaleY);
    };
    /**
    * 通过名称移除屏幕绘制对象，对应addOverlay方法 
    * @param {String} keyName 当前叠加对象id
    */
    this.removeOverlayByName = function (keyName) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveOverlay(keyName);
        }
    };
    /**
    * 根据服务名称获取指定的doc
    * @param {String} name 地图服务名称
    * @return {MapDocObj} 返回地图服务对象，没有则返回null
    */
    this.getDocByName = function (name) {
        for (var x = 0; x < this._docObj.length; x++) {
            if (this._docObj[x].name === name)
                return this._docObj[x];
        }
        return null;
    };
    /**
    * 加载地图文档,方法内部根据服务不同进行添加，其中type为EnumerVar.js中的DocType
    * 目前主要支持普通地图服务（动态裁图）、瓦片、三维服务、OGC的WMTS，后期进行扩展
    * @param {String} name 地图服务名称
    * @param {String} ip 服务访问时的ip值
    * @param {String} port 服务访问时的端口号
    * @param {DocType} type 服务类型
    * @param {String} state 起始加载时的状态信息，为json结构，目前包括的参数有如下
    * visible:一开始加载时是否可见
    * terrainUrl：依附的地形层地址
    * renderRange:额外的范围
    * handleUrl:文档指定一个转发地址
    * 例如：'{"terrainUrl":"http://192.168.10.204:6163/igs/rest/g3d/hainan/0", 
    *       "renderRange":{"xMax":111.31025093083733,"xMin":108.600917597504,
    *                      "yMax":20.1665453036538,"yMin":17.457211970320465},
    *       "visible":true}'
    * @return {String} 返回添加服务后返回的id，添加失败则返回-1
    */
    this.addDoc = function (name, ip, port, type, state) {
        //处理有中文字符的情况
        var nameIE = encodeURIComponent(name);
        //可以添加同名的文档的。但是记录的id不一样
        if (this._ocxObj && this._ocxObj.object && name && ip && port) {
            var u = "";
            //根据文档类型构建不同的url
            if (type === DocType.TypeG3D)
                u = 'http://' + ip + ':' + port + '/igs/rest/g3d/' + nameIE;
            else if (type === DocType.TypeDoc || type === DocType.TypeRaster)
                u = 'http://' + ip + ':' + port + '/igs/rest/ims/' + nameIE;
            else if (type === DocType.TypeOGCwmts) {
                u = 'http://' + ip + ':' + port + '/igs/rest/ogc/' + nameIE;
            } else
                return -1;
            var id = -1;
            if (state)
                id = this._ocxObj.object.AppendEx(u, state);
            else
                id = this._ocxObj.object.Append(u);
            if (id > 0) {
                var docObj = new MapDocObj();
                docObj.url = u;
                docObj.id = id;
                docObj.name = name;
                docObj.ip = ip;
                docObj.port = port;
                docObj.type = type;
                this._docObj.push(docObj);
                return id;
            }
        }
        return -1;
    };
    /**
    * 根据要素类的路径添加模型数据
    * @param {String} gdbpurl 简单要素类的url
    * @return {String} 返回添加服务后返回的id，添加失败则返回-1
    */
    this.appendGeomByUrl = function (gdbpurl, ip, port) {
        if (this._ocxObj && this._ocxObj.object) {
            //处理有中文字符的情况
            var url = 'http://' + ip + ':' + port + '/igs/rest/g3d/GetDataByURL?gdbp=' + encodeURIComponent(gdbpurl) + "&keepgeometry=true";
            var id = this._ocxObj.object.AppendGeomByUrl(url);
            if (id > 0) {
                var docObj = new MapDocObj();
                docObj.url = url;
                docObj.id = id;
                docObj.name = gdbpurl;
                docObj.ip = ip;
                docObj.port = port;
                this._docObj.push(docObj);
                return id;
            }
        }
        return -1;
    };
    /**
    * 设置指定场景地图的可见性
    * @param {String} id 添加完场景地图后的返回值
    * @param {bool} isShow true或者false，表示是否可见
    */
    this.setSceneMapVisible = function (id, isShow) {
        if (this._ocxObj && this._ocxObj.object) {
            if (isShow === false)
                this._ocxObj.object.SetSceneState(id, -1, EnumLayerState.StateUnVisble);
            else
                this._ocxObj.object.SetSceneState(id, -1, EnumLayerState.StateVisble);
        }
    };
    /**
    * 添加二维服务中的图层，可以设置查询参数对象
    * @param {String} ip 服务访问时的ip值
    * @param {String} port 服务访问时的端口号
    * @param {MapDocQuery} mapDocQuery 查询参数，使用MapDocQuery.js中的对象
    * @return {String} 返回添加服务后返回的id，添加失败则返回-1
    */
    this.addLayer2DByQuery = function (ip, port, mapDocQuery) {
        if (this._ocxObj && this._ocxObj.object) {
            if (mapDocQuery instanceof MapDocQuery) {
                //构建查询url
                var queryString = 'query?guid=' + Math.random();
                //构建查询参数
                if (mapDocQuery.geometryType && mapDocQuery.geometry) {
                    //这里可以进行进一步的参数验证
                    queryString += '&geometryType=' + mapDocQuery.geometryType + '&geometry=' + mapDocQuery.geometry;
                }
                if (mapDocQuery.where)
                    queryString += '&where=' + mapDocQuery.where;
                if (mapDocQuery.objectIds)
                    queryString += '&objectIds=' + mapDocQuery.objectIds;
                if (mapDocQuery.pageCount)
                    queryString += '&pageCount=' + mapDocQuery.pageCount;

                var url = "http://" + ip + ":" + port + "/igs/rest/mrfs/docs/" + mapDocQuery.docName +
                    "/" + mapDocQuery.mapIndex + "/" + mapDocQuery.layerID + "/" + queryString;
                var id = this._ocxObj.object.Append(url);
                if (id > 0) {
                    var docObj = new MapDocObj();
                    docObj.url = url;
                    docObj.id = id;
                    docObj.name = url;
                    docObj.type = DocType.TypeLayer;
                    this._docObj.push(docObj);
                    return id;
                }
            }
        }
        return -1;
    };
    /**
    * 删除地图服务通过服务名称
    * @param {String} name 地图服务名称
    * @return {bool} 删除成功返回true，失败返回false
    */
    this.removeDocByName = function (name) {
        var doc = this.getDocByName(name);
        if (!doc)
            return false;
        return this.removeDocById(doc.id);
        //return true;
    };
    /**
    * 删除地图文档,参数为添加完文档后的返回值
    * @param {Int} id 关于参数的具体描述
    * @return {bool} 删除成功返回true，失败返回false
    */
    this.removeDocById = function (id) {
        if (this._ocxObj && this._ocxObj.object) {
            var index = -1;
            for (var x = 0; x < this._docObj.length; x++) {
                if (this._docObj[x].id === id) {
                    index = x;
                }
            }
            //存在数组中
            if (index > -1) {
                var ret = this._ocxObj.object.Remove(id);
                if (ret > -1) {
                    this._docObj.splice(index, 1); //数组中删除
                    return true;
                }
            }
        }
        return false;
    };
    /**
    * 删除所有的地图服务
    */
    this.removeAllDoc = function () {
        //        for (var x = 0; x < this._docObj.length; x++) {
        //            this._ocxObj.object.remove(this._docObj[x].id);
        //        }
        this.removeAll();
        this._docObj = [];
    };
    /**
    * 添加天地图，网络地图只能添加一种
    * @param {EnumTDTType} tdtType 天地图的类型
    * @return {String} 添加完服务后返回的id值，失败则返回-1
    */
    this.addTianditu = function (tdtType) {
        if (this._ocxObj && this._ocxObj.object) {
            //如果存在该网络地图，则直接返回，即统一网络图不能重复添加
            if (this.getOverMapIDByName(tdtType) !== -1)
                return -1;
            var id = -1;
            if (tdtType)
                id = this._ocxObj.object.Append("http://tdt/getwmts?" + tdtType);
            else
                id = this._ocxObj.object.Append("http://tdt/GetMap");
            if (id > 0) {
                this._overMapObj.push({ id: id, name: tdtType });
                return id;
            }
        }
        return -1;
    };
    /**
    * 添加谷歌图，网络地图只能添加一种
    * @return {String} 添加完服务后返回的id值，失败则返回-1
    */
    this.addGoogleMap = function (googleType) {
        if (this._ocxObj && this._ocxObj.object) {
            //如果存在该网络地图，则直接返回，即统一网络图不能重复添加
            if (this.getOverMapIDByName(googleType) !== -1)
                return -1;
            var id = this._ocxObj.object.Append("http://google/GetMap");
            if (id > 0) {
                this._overMapObj.push({ id: id, name: googleType });
                return id;
            }
        }
        return -1;
    };

    /**
    * 根据网络地图名称获取添加后返回的id
    * @param {String} name 网络地图的name
    * @return {Int} 返回叠加网络地图的id
    */
    this.getOverMapIDByName = function (name) {
        for (var i = 0; i < this._overMapObj.length; i++) {
            if (this._overMapObj[i].name === name)
                return this._overMapObj[i].id;
        }
        return -1;
    };
    /**
    * 删除网络叠加地图
    */
    this.removeOverMap = function (id) {
        if (this._ocxObj && this._ocxObj.object) {
            //查看是否存在此网络地图
            var overMapObj = [];
            for (var x = 0; x < this._overMapObj.length; x++) {
                if (this._overMapObj[x].id !== id)
                    overMapObj.push(this._overMapObj[x]);
            }
            if (overMapObj.length < this._overMapObj.length) {
                this._ocxObj.object.Remove(id);
                this._overMapObj = overMapObj;
                return true;
            }
            else
                return false;
        }
    };
    /**
    * 删除网络叠加地图,通过名称
    */
    this.removeOverMapByName = function (name) {
        if (this.getOverMapIDByName(name) === -1)
            return -1;
        return this.removeOverMap(this.getOverMapIDByName(name));
    };
    /**
    * 删除所有的网络叠加图层
    */
    this.removeAllOverMap = function () {
        for (var x = 0; x < this._overMapObj.length; x++) {
            this._ocxObj.object.Remove(this._overMapObj[x].id);
        }
        this._overMapObj = [];
        return true;
    };
    /**
    * 对函数进行描述说明
    * @param {String} name 网络叠加地图的名称
    * @param {Bool} isShow 图层是否显示
    */
    this.setOverMapShowHide = function (name, isShow) {
        //通过名称获取网络叠加图的id
        var id = this.getOverMapIDByName(name);
        if (id > 0) {
            if (isShow === false)
                this.setSceneState(id, 0, EnumLayerState.StateUnVisble);
            else
                this.setSceneState(id, 0, EnumLayerState.StateVisble);
        }
    }
    /**
    * 删除指定的地图数据
    * @param {String} id 添加完数据后的返回值
    * @return {String} 移除成功后的返回值，失败则返回-1
    */
    this.removeMap = function (id) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.Remove(id);
        }
        return -1;
    };
    /**
    * 添加覆盖图
    * @param {String} name 地图服务名,或者id值
    * @param {String} url 图片对应的url，可以是某个地图服务的出图url
    * @param {Double} xmin 范围的xmin
    * @param {Double} ymin 范围的ymin
    * @param {Double} ymin 范围的zmin
    * @param {Double} xmax 范围的xmax
    * @param {Double} ymax 范围的ymax
    * @param {Double} ymax 范围的zmax
    * @return {String} 添加成功后的返回值，失败则返回-1
    */
    this.addCovering = function (name, url, xmin, ymin, zmin, xmax, ymax, zmax) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object) {
            if (doc != null)
                return this._ocxObj.object.AppendCovering2(doc.id, url, xmin, ymin, zmin, xmax, ymax, zmax);
            else
                return this._ocxObj.object.AppendCovering2(name, url, xmin, ymin, zmin, xmax, ymax, zmax);
        }
        return -1;
    };
    ////////////////////////////////////////////////////////////////////////////////////
    /**
    * 添加气泡
    * @param {Bubble} bubble 具体标注类：参照LabelNew.js进行相关的设置
    * @return {String} 添加成功后的返回值，失败则返回-1
    */
    this.addBubble = function (bubble) {
        //首先判断输出参数是否正确
        if (bubble instanceof Bubble) {
            return this._ocxObj.object.AppendBubble(
                bubble.text,
                bubble.x,
                bubble.y,
                bubble.z,
                bubble.sElevation,
                bubble.fontname,
                bubble.fontsize,
                bubble.fontcolor,
                bubble.opacity,
                bubble.bgColor,
                bubble.bdColor,
                bubble.width,
                bubble.height,
                bubble.scale,
                bubble.attribute
            );
        }
        return -1;
    };
    /**
    * 添加普通的标注
    * @param {Label} label 具体标注类：参照LabelNew.js进行相关的设置
    * @return {String} 添加成功后的返回值，失败则返回-1
    */
    this.addLabel = function (label) {
        //首先判断输出参数是否正确
        if (label instanceof Label) {
            return this._ocxObj.object.AppendLabel(
                label.text,
                label.x,
                label.y,
                label.z,
                label.sElevation,
                label.fontname,
                label.fontsize,
                label.fontcolor,
                label.iconScale,
                label.farDist,
                label.nearDist,
                label.attribute
            );
        }
        return -1;
    };
    /**
    * 添加带图标的标注
    * @param {LabelIcon} labelIcon 具体标注类：参照LabelNew.js进行相关的设置
    * @return {String} 添加成功后的返回值，失败则返回-1
    */
    this.addLabelIcon = function (labelIcon) {
        //首先判断输出参数是否正确
        if (labelIcon instanceof LabelIcon) {
            return this._ocxObj.object.AppendLabelIcon(
                labelIcon.text,
                labelIcon.x,
                labelIcon.y,
                labelIcon.z,
                labelIcon.sElevation,
                labelIcon.fontname,
                labelIcon.fontsize,
                labelIcon.fontcolor,
                labelIcon.iconUrl,
                labelIcon.iconXScale,
                labelIcon.iconYScale,
                labelIcon.farDist,
                labelIcon.nearDist,
                labelIcon.txtPos,
                labelIcon.attribute
            );
        }
        return -1;
    };
    /**
    * 该函数的目的是为了解决大坐标Label位置精度不够的问题。在显示的时候，
    * 根据注记本身的位置，和其LabelSet父节点的位置算偏移作为计算标准，减少误差。
    * @param {LabelIcon} labelIcon LabelIcon类，带图标的标注对象
    * @param {Double} nodeX 注记父节点位置的x坐标
    * @param {Double} nodeY 注记父节点位置的y坐标
    * @param {Double} nodeZ 注记父节点位置的z坐标
    * @param {SHORT } lblOff 图标标注相对于拾取位置的偏移，默认传参数，
    *                        从左上角、正上角、右上角、正左、正中、正右、左下角、正下角、右下角分别对应1-8的枚举值。
    */
    this.addLabelIconByPick = function (labelIcon,
		nodeX, nodeY, nodeZ, lblOff) {
        //这里直接调用方法添加标注
        if (this._ocxObj && this._ocxObj.object) {
            //首先判断输出参数是否正确
            if (labelIcon instanceof LabelIcon) {
                return this._ocxObj.object.AppendLabelIconByPick(labelIcon.text, labelIcon.x, labelIcon.y, labelIcon.z,
		        nodeX, nodeY, nodeZ,
		        labelIcon.sElevation, labelIcon.fontname, labelIcon.fontsize,
		        labelIcon.fontcolor, labelIcon.iconUrl, labelIcon.iconXScale, labelIcon.iconYScale,
		        labelIcon.farDist, labelIcon.nearDist, labelIcon.txtPos, lblOff, labelIcon.attribute);
            }
        }
        return "";
    };
    /**
    * 添加ToolTip
    * @param {ToolTip} toolTip 具体标注类：参照LabelNew.js进行相关的设置
    * @return {String} 添加成功后的返回值，失败则返回-1
    */
    this.addToolTip = function (toolTip) {
        //首先判断输出参数是否正确
        if (toolTip instanceof ToolTip) {
            return this._ocxObj.object.AppendToolTip(
                toolTip.text,
                toolTip.x,
                toolTip.y,
                toolTip.z,
                toolTip.sElevation,
                toolTip.bdColor,
                toolTip.width,
                toolTip.height,
                toolTip.attribute
            );
        }
        return -1;
    };
    /**
    * 添加能返回ToolTip位置的接口
    * @param {ToolTip} toolTip 具体标注类：参照LabelNew.js进行相关的设置
    * @return {String} 添加成功后的返回值，失败则返回-1
    */
    this.GetLabelPos = function (tootipname) {
        return this._ocxObj.object.GetLabelPos(tootipname);
    }
    /**
    * 移除指定的标注
    * @param {String} labelName 添加完标注后的返回值
    */
    this.removeLabelByName = function (labelName) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveLabel(labelName);
        }
    };
    /**
    * 移除所有的标注
    */
    this.removeAllLabel = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveLabelAll();
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////
    /**
    * 计算两点间的距离
    * @param {Double} bx 第一个点的x
    * @param {Double} by 第一个点的y
    * @param {Double} bz 第一个点的z
    * @param {Double} ex 第二个点的x
    * @param {Double} ey 第二个点的y
    * @param {Double} ez 第二个点的z
    * @param {Short} type 量测方式 0:地表距离 1:直接距离
    * @return {Double} 返回计算结果，计算失败返回-1
    */
    this.calXYLength = function (bx, by, bz, ex, ey, ez, type) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.CalcLineLength(bx, by, bz, ex, ey, ez, type);
        }
        return -1;
    };
    /**
    * 计算多点构成多边形的面积
    * @param {String} pnts 点的字符串集合,参数格式="100,30,0;101,30,0;102,30,0;102.5,31,0"
    * @param {Short} model 0表示计算表面积，1表示计算投影面积
    * @return {Double} 返回计算结果，计算失败返回-1
    */
    this.calPolygonArea = function (pnts, model) {
        if (this._ocxObj && this._ocxObj.object) {
            if (model)
                return this._ocxObj.object.CalcPolygonSurfaceArea(pnts, model);
            else
                return this._ocxObj.object.CalcPolygonSurfaceArea(pnts, 0);
        }
        return -1;
    };
    /**
    * 由坐标点和绘制方案添加图形要素
    * @param {String} pnts 参数格式="108.60,18.50;108.75,18.90;109.30,19.70;109.50,19.20"
    * @param {DrawInfo} drawInfo 二维绘制对象
    * @return {String} 返回绘制成功过后返回的id值，失败则返回-1
    */
    this.addGraphic = function (pnts, drawInfo) {
        if (this._ocxObj && this._ocxObj.object && drawInfo instanceof DrawInfo) {
            return this._ocxObj.object.DrawElement(drawInfo.shapeType, pnts, drawInfo.bdColor, drawInfo.fillColor,
            drawInfo.transparence, drawInfo.linWid, drawInfo.lineType);
        }
        return -1;
    };
    /**
    * 添加一个点到三维地球上
    * @param {Double} x 经度
    * @param {Double} y 纬度
    * @param {Double} radio 关于参数的具体描述，默认为0.1（经纬度）
    * @param {DrawInfo} drawInfo 二维绘制对象，默认为红色圆形
    * @return {Object|Number} 关于返回值的具体描述
    */
    this.addPoint = function (x, y, radio, drawInfo) {
        if (this._ocxObj && this._ocxObj.object) {
            if (!radio)
                radio = 0.1;
            if (!drawInfo) {
                drawInfo = new DrawInfo();
                //设置绘制类型：TypeLine = 0,TypeRect = 1,TypePolygon = 2,TypeCircle = 3,
                drawInfo.shapeType = 3;
                //uint
                drawInfo.bdColor = 0xffff0000;
                //uint
                drawInfo.fillColor = 0xffff0000;
                //透明度的值
                drawInfo.transparence = 1;
                //线的宽度
                drawInfo.linWid = 1;
                //线的类型：TypeSolid = 0,TypePolyLine = 1,TypePointLine = 2,TypePolyLinePoint = 3
                drawInfo.lineType = 0;
            }
            //构建点集
            var pnts = (x - radio / 2.0).toString() + "," + (y + radio / 2.0).toString() + ";"
                      + (x + radio / 2.0).toString() + "," + (y - radio / 2.0).toString();
            return this.addGraphic(pnts, drawInfo);
        }
        return -1;
    };
    /**
    * 跳转到指定位置
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @param {Double} z 位置的z
    * @param {Double} dist 距离
    * @param {Double} tarHead 高度角俯仰角
    * @param {Double} tarTilt 方位角
    */
    this.jumpByPos = function (x, y, z, dist, tarHead, tarTilt) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.Jump(x, y, z, dist, tarHead, tarTilt);
        }
    };
    /**
    * 跳转到指定的模型
    * @param {String} name 地图服务名称
    * @param {Int} layerIndex 图层索引
    * @param {Int} geomID 模型对应的几何要素id
    */
    this.jumpByModel = function (name, layerIndex, geomID) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object && doc != null) {
            this._ocxObj.object.Jump2(doc.id, layerIndex, geomID);
        }
    };
    /**
    * 跳转到指定的矩形范围
    * @param {Double} minx 矩形范围的minx
    * @param {Double} miny 矩形范围的miny
    * @param {Double} maxx 矩形范围的maxx
    * @param {Double} maxy 矩形范围的maxy
    */
    this.jumpByRect = function (minx, miny, maxx, maxy) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.JumpByRect(minx, miny, maxx, maxy);
        }
    };
    /**
    * 根据经纬度坐标获取笛卡尔坐标系
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @param {Double} z 位置的z
    * @return {String} 返回转换后的值，失败则返回-1
    */
    this.convertPosToGeo = function (x, y, z) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetCartesianPosByGeodetic(x, y, z);
        }
        return -1;
    };
    /**
    * 根据笛卡尔坐标系获取经纬度坐标
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @param {Double} z 位置的z
    * @return {String} 返回转换后的值，失败则返回-1
    */
    this.convertGeoToPos = function (x, y, z) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetGeodeticPosByCartesian(x, y, z);
        }
        return -1;
    };
    /**
    * 由逻辑位置转换成窗体位置
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @param {Double} z 位置的z
    * @return {String} 返回转换后的值，失败则返回-1
    */
    this.convertLpToWp = function (dx, dy, dz) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.LpToWp(dx, dy, dz);
        }
        return -1;
    };
    /**
    * 由窗体位置转换成逻辑位置
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @return {String} 返回转换后的值，失败则返回-1
    */
    this.convertWpToLp = function (wx, wy) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.WpToLp(wx, wy);
        }
        return -1;
    };
    /**
    * 由屏幕坐标获取世界坐标,世界坐标是三维里面的，OGRE自定义的一个坐标系。
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @return {String} 返回转换后的值，失败则返回-1
    */
    this.convertScreenToWorldPos = function (x, y) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetWorldPosByScreen(x, y);
        }
        return -1;
    };
    ///////////////////////////////下面为拾取功能的接口///////////////////////////
    /**
    * 开启标注的交互性功能
    */
    this.startPickLabel = function () {
        this._ocxObj.object.StartPickLabel();
    };
    /**
    * 关闭标注的交互性功能
    */
    this.stopPickLabel = function () {
        this._ocxObj.object.StopPickLabel();
    };
    /**
    * 开启模型或圖形的交互性功能
    */
    this.startPickTool = function () {
        this._ocxObj.object.StartPickTool();
    };
    /**
    * 根据屏幕点拾取标注
    * 在场景中添加注记后，相比交互拾取注记，根据屏幕坐标拾取是直接传入屏幕坐标点进行拾取，如果拾取到注记，直接返回出添加注记时传入的属性值。
    * 注意：根据坐标拾取注记传入的坐标和添加注记传入的坐标不是一个坐标系，添加时是地理坐标，拾取时是屏幕坐标
    * @param x {number} 屏幕坐标x值
    * @param y {number} 屏幕坐标y值
    * @return 注记的属性值
    */
    this.pickLabelByXY = function (x, y) {
        return this._ocxObj.object.PickLabelByXY(x, y);
    }
    /**
    * 关闭模型或圖形的交互性功能
    */
    this.stopPickTool = function () {
        this._ocxObj.object.StopPickTool();
    };
    ////////////////////////////////////////////////////////////////////////////////////
    /**
    * 删除指定的实体，这里和原生接口保持一致，删除地图可以用removeMap
    * @param {String} entity 对象的返回值id
    * @return {String} 删除成功的返回值id，失败则返回-1
    */
    this.remove = function (entity) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.Remove(entity);
        }
        return -1;
    };
    /**
    * 删除所有的实体
    */
    this.removeAll = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.RemoveAll();
        }
        return -1;
    };
    /**
    * 移除绘制的几何元素
    */
    this.removeAllGraphic = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveAllElement();
            //清空数组中的数据
            this._drawElements = [];
        }
    };
    /**
    * 移除指定的几何元素
    * @param {String} elementName 要素的名称
    * @return {String} 删除成功的返回值id，失败则返回-1
    */
    this.removeGraphicByName = function (elementName) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveElement(elementName);
            //需要删除指定id的要素
            var elements = [];
            for (var x = 0; x < this._drawElements.length; x++) {
                if (this._drawElements[x].id !== elementName)
                    elements.push(this._drawElements[x]);
            }
            if (elements.length < this._drawElements.length) {
                this._drawElements = elements;
            }
        }
        return -1;
    };
    /**
    * 设置绘制的二维元素可见性
    */
    this.setElementVisible = function (eleName, isVisible) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetElementVisible(eleName, isVisible);
        }
    };
    /**
    * 返回指定要素id的pnts属性
    * @param {String} elementName 要素的id
    * @return {String} 获取成功的返回值pnts，失败则返回空
    */
    this.getPntsByEleID = function (elementName) {
        for (var x = 0; x < this._drawElements.length; x++) {
            if (this._drawElements[x].id === elementName)
                return this._drawElements[x].pnts;
        }
        return "";
    };
    /**
    * 地图复位操作
    */
    this.reset = function () {
        this._ocxObj.object.Reset();
    };
    /**
    * 获取摄像机参数
    * @return {String} 返回获取的摄像机信息，失败则返回-1
    */
    this.getCameraInfo = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetCamera();
        }
        return -1;
    };
    /**
    * 设置场景的相机参数
    * 对当前场景里的相机进行相关参数调整，远近截面可以影响物体的剪裁以及深度缓存检测
    * 填充模式可以用来选择是实体渲染或者线、点填充，以及一些其他参数
    * @param {String} name 名称
    * @param {Double} nearClip 近裁面，设置相机近裁面的距离，当物体离相机距离小于这个值时会被剪裁掉
    * @param {Double} farClip 远裁面，设置相机远裁面的距离，当物体离相机距离小于这个值时会被剪裁掉，
    *						  同时远近裁面的总长度会影响物体的深度检测。
    * @param {Double} fov 相机的fov视角，默认为45度
    * @param {Short} detailType 填充模式，1-点填充 2-线框填充 3-实体填充，其效果和按下快捷键g相同
    * @param {Short} projectionType 投影模式，1-透视投影(默认为透视投影，更贴近真实，远处的物体透视后会变小) 0-正交投影(投影后仍保持原有比例)
    * @param {Int} bgColor 背景色，从高位到低位分别为ARGB。
    * @param {Bool} CutOutFlag 是否实体裁剪，默认为false
    */
    this.setCameraInfo = function (name, nearClip, farClip, fov,
		detailType, projectionType, bgColor, CutOutFlag) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.SetCamera(name, nearClip, farClip, fov,
		detailType, projectionType, bgColor, CutOutFlag);
        }
    };
    /**
    * 获取视图的位置信息
    * @return {String} 返回视图的信息，失败则返回-1
    */
    this.getViewPos = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetViewPos();
        }
        return -1;
    };
    /**
    * 通过位置设置视图
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @param {Double} z 位置的z
    * @param {Double} dist 距离
    * @param {Double} heading 高度角
    * @param {Double} tilt 方位角
    */
    this.setViewPos = function (x, y, z, dist, heading, tilt) {
        this._ocxObj.object.SetViewPos(x, y, z, dist, heading, tilt);
    };
    /**
    * 获取视图的Rect信息
    * @return {String} 返回视图的Rect信息，失败则返回-1
    */
    this.getViewRect = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetViewRect();
        }
        return -1;
    };
    /**
    * 通过矩形设置视图
    * @param {Double} minx 矩形范围的minx
    * @param {Double} miny 矩形范围的miny
    * @param {Double} maxx 矩形范围的maxx
    * @param {Double} maxy 矩形范围的maxy
    */
    this.setViewRect = function (minx, miny, maxx, maxy) {
        this._ocxObj.object.SetViewRect(minx, miny, maxx, maxy);
    };
    /**
    * 通过参数设置全景模型
    * @param {Double} x 位置的x
    * @param {Double} y 位置的y
    * @param {Double} z 位置的z
    * @param {Double} dist 距离
    * @param {Double} heading 高度角
    * @param {Double} tilt 方位角
    * @param {Double} minHead 最小可见距离
    * @param {Double} maxHead 最大可见距离
    * @param {Double} maxTilt 最大方位角
    * @param {Double} minTilt 最小方位角
    */
    this.setFullView = function (x, y, z, dist, heading, tilt, minHead, maxHead, maxTilt, minTilt) {
        this._ocxObj.object.SetFullView(x, y, z, dist, heading, tilt, minHead, maxHead, maxTilt, minTilt);
    };
    /**
    * 退出全景模式
    */
    this.exitFullView = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.ExitFullView();
        }
    };
    /**
    * 显示或隐藏导航控件
    * @param {bool} bShow 导航控件的状态
    */
    this.setNavigateVisible = function (bShow) {
        this._isNavigateVisible = bShow;
        this._ocxObj.object.ShowNavigateTool(bShow);
    };
    /**
    * 获取导航控件的可见性信息
    * @return {bool} 获取导航控件的可见性信息
    */
    this.getNavigateVisible = function () {
        return this._isNavigateVisible;
    };
    /**
    * 显示或隐藏状态栏信息
    * @param {bool} bShow 状态栏的状态
    */
    this.setPlantUIStateVisible = function (bShow) {
        this._isPlantUIStateVisible = bShow;
        this._ocxObj.object.ShowPlantUIState(bShow);
    };
    /**
    * 获取状态栏的可见性信息
    * @return {bool} 获取状态栏的可见性信息
    */
    this.getPlantUIStateVisible = function () {
        return this._isPlantUIStateVisible;
    };
    /**
    * 显示或隐藏调试坐标系
    * @param {bool} bShow 显示或隐藏调试坐标系
    */
    this.setDebugGridVisible = function (bShow) {
        this._isDebugGrid = bShow;
        this._ocxObj.object.ShowDebugGrid(bShow);
    };
    /**
    * 获取调试坐标系的可见性信息
    * @return {bool} 获取调试坐标系的可见性信息
    */
    this.getDebugGridVisible = function () {
        return this._isDebugGrid;
    };
    /**
    * 显示或隐藏格网
    * @param {bool} bShow 显示或隐藏格网
    */
    this.setGridNetVisible = function (bShow) {
        this._isGridNet = bShow;
        this._ocxObj.object.ShowGridNet(bShow);
    };
    /**
    * 获取格网的可见性信息
    * @return {bool} 获取格网的可见性信息
    */
    this.getGridNetVisible = function () {
        return this._isGridNet;
    };
    /**
    * 设置实体的透明度,这里是以场景为单位进行设置
    * @param {String} name 地图服务名称
    * @param {String} layerIndex 图层(场景索引)
    * @param {Int} TransparentValue 0-100
    * @return {String} 设置成功返回id值，失败则返回-1
    */
    this.setSceneTransparent = function (name, layerIndex, TransparentValue) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object && doc != null) {
            return this._ocxObj.object.SetScenePropertySet(doc.id, layerIndex, "Transparent:" + TransparentValue);
        }
        return -1;
    };
    /**
    * 设置指定多边形中内容显示
    * @param {String} name 地图服务名称
    * @param {String} layerIndex 图层(场景索引)
    * @param {String} points 多边形点集,x,y;x,y;x,y;x,y.......
    * @return {String} 设置成功返回id值，失败则返回-1
    */
    this.setShowPolygon = function (name, layerIndex, points) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object) {
            if (doc != null)
                return this._ocxObj.object.SetScenePropertySet(doc.id, layerIndex, "SetShowPolygon:" + points);
            else
            //doc不存在则将name直接视为id
                return this._ocxObj.object.SetScenePropertySet(name, layerIndex, "SetShowPolygon:" + points);
        }
        return -1;
    };
    /**
    * 设置指定矩形中内容显示
    * @param {String} name 地图服务名称
    * @param {String} layerIndex 图层(场景索引)
    * @param {String} points 矩形范围,xmin,ymin,xmax,ymax
    * @return {String} 设置成功返回id值，失败则返回-1
    */
    this.setShowRect = function (name, layerIndex, points) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object) {
            if (doc != null)
                return this._ocxObj.object.SetScenePropertySet(doc.id, layerIndex, "SetShowRange:" + points);
            else
            //doc不存在则将name直接视为id
                return this._ocxObj.object.SetScenePropertySet(name, layerIndex, "SetShowRange:" + points);
        }
        return -1;
    };
    /**
    * 设置图层置顶
    * @param {String} name 地图服务名称
    * @param {String} layerIndex 图层(场景索引)
    * @return {String} 设置成功返回id值，失败则返回-1
    */
    this.setLayerToTop = function (name, layerIndex) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object) {
            if (doc != null)
                return this._ocxObj.object.SetScenePropertySet(doc.id, layerIndex, "SetLayer2Top:true");
            else
            //doc不存在则将name直接视为id
                return this._ocxObj.object.SetScenePropertySet(name, layerIndex, "SetLayer2Top:true");
        }
        return -1;
    };
    /**
    * 设置图层优先级
    * @param {String} name 地图服务名称
    * @param {String} layerIndex 图层(场景索引)
    * @param {Short} value 0-16优先级的值
    * @return {String} 设置成功返回id值，失败则返回-1
    */
    this.setLayerPriority = function (name, layerIndex, value) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object) {
            if (doc != null)
                return this._ocxObj.object.SetScenePropertySet(doc.id, layerIndex, "SetLayerPriority:" + value);
            else
            //doc不存在则将name直接视为id
                return this._ocxObj.object.SetScenePropertySet(name, layerIndex, "SetLayerPriority:" + value);
        }
        return -1;
    };
    /**
    * 设置指定多边形中内容显示
    * @param {Int} id 地图服务id
    * @param {String} layerIndex 图层(场景索引)
    * @param {String} points 多边形点集,x,y;x,y;x,y;x,y.......
    * @return {String} 设置成功返回id值，失败则返回-1    
    */
    this.setShowPolygonByid = function (docid, layerIndex, points) {
        if (this._ocxObj && this._ocxObj.object && docid) {
            return this._ocxObj.object.SetScenePropertySet(docid, layerIndex, "SetShowPolygon:" + points);
        }
        return -1;
    };
    /**
    * 获取场景节点
    * 获取模型对应的场景操作节点
    * @param {int} docId 添加的文档索引值，Append的返回值
    * @param {int} renderIndex 模型所在的图层渲染索引值
    * @param {bool} hasChild 是否有子节点
    * @param {int} geomID 模型id
    * @returns {object} 场景操作节点，IScene3DNode类型，可以对应使用闪烁、高亮等操作 
    */
    this.getSceneNode = function (docId, renderIndex, hasChild, geomID) {
        return this._ocxObj.object.GetSceneNode();
    };
    /**
    * 获取图层属性
    * @param {Int} id 地图服务id
    * @param {String} layerIndex 图层(场景索引)
    * @param {String} propertyname “DisplayScale”第三个参数传这个的时候，
    *                表示获取显示比，返回float类型的字符串，"IsVisible"表示获取是否可见，0和1的字符串
    *                "Range3D"表示获取场景的范围
    * @return {String} 返回属性的内容
    */
    this.getSceneProperty = function (docid, layerIndex, propertyname) {
        if (this._ocxObj && this._ocxObj.object && docid) {
            return this._ocxObj.object.GetSceneProperty(docid, layerIndex, propertyname);
        }
        return -1;
    };
    /**
    * 开始绘制图形接口
    * @param {DrawInfo} drawInfo 绘制过程中需要输入的绘画参数
    */
    this.startDrawTool = function (drawInfo) {
        if (drawInfo instanceof DrawInfo) {
            this._ocxObj.object.StartDrawTool(drawInfo.shapeType, drawInfo.bdColor, drawInfo.fillColor,
            drawInfo.transparence, drawInfo.linWid, drawInfo.lineType);
        }
    };
    /**
    * 停止绘制工具
    * @return {String} 返回最新绘制的要素id值，停止失败则返回""
    */
    this.stopDrawTool = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.StopDrawTool();
        }
        return "";
    };
    /**
    * 绘制三维点线面
    * @param {Draw3DElementInfo} draw3DElementInfo 三维要素绘制需要的绘制对象
    * @return {String} 返回三维要素对象的id，失败则返回""
    */
    this.draw3DElement = function (draw3DElementInfo) {
        if (this._ocxObj && this._ocxObj.object && draw3DElementInfo instanceof Draw3DElementInfo) {
            var id = this._ocxObj.object.Draw3DElement(
                draw3DElementInfo.type,
                draw3DElementInfo.pnts,
                "libID:" + draw3DElementInfo.libID +
                ",symID:" + draw3DElementInfo.symID +
                ",fillClr:" + draw3DElementInfo.fillClr +
                ",transparent:" + draw3DElementInfo.transparent,
                draw3DElementInfo.att
            );
            if (id > 0)
                this._draw3DElements.push(id);
            return id;
        }
        return "";
    };
    /**
    * 删除三维点线面
    * @param {String} id 三维要素的id
    */
    this.remove3DElement = function (id) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.Remove3DElement(id);
        }
    };
    /**
    * 设置绘制的三维元素可见性
    */
    this.set3DElementVisible = function (geomID, isVisible) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.Set3DElementVisible(geomID, isVisible);
        }
    };
    /**
    * 删除所有的三维图形要素
    */
    this.removeAll3DElement = function () {
        for (var i = 0; i < this._draw3DElements.length; i++) {
            this._ocxObj.object.Remove3DElement(this._draw3DElements[i]);
        }
        this._draw3DElements = [];
    };
    /**
    * 开启工具的接口
    * @param {ToolInfo} toolInfo 具体工具的对象
    */
    this.startAnalyzeTool = function (toolInfo) {
        //这里根据对象的类型来决定进行哪种分析
        var jsonInfo = new Util().toJSON(toolInfo);
        //地形分析部分=包括洪水淹没分析、填挖方分析、可视域分析、单点地形参数查询分析、两点通视性分析、坡度分析、坡向分析
        if (toolInfo instanceof FLoodAnalyzeInfo
                || toolInfo instanceof CutFillInfo
                || toolInfo instanceof ViewShedInfo
                || toolInfo instanceof DynamicViewShedInfo
                || toolInfo instanceof PointQueryInfo
                || toolInfo instanceof VisibleInfo
                || toolInfo instanceof SlopeInfo
                || toolInfo instanceof AspectInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.TerrainAnalyze, jsonInfo);
        }
        //爆炸效果演示分析
        else if (toolInfo instanceof BombInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.BombShow, jsonInfo);
        }
        //日照分析
        else if (toolInfo instanceof SunLightInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.SunLight, jsonInfo);
        }
        //地形剖切剖面图分析
        else if (toolInfo instanceof TerSectInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.TerrainCut, jsonInfo);
        }
        //模型编辑分析
        else if (toolInfo instanceof ModelInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.ModelEdit, jsonInfo);
        }
        //量算工具
        else if (toolInfo instanceof MeasureInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.Measure, jsonInfo);
        }
    };
    /**
    * 停止工具的接口
    * @param {EnumCommToolType} enumCommToolType 工具对应的数字
    */
    this.stopAnalyzeTool = function (enumCommToolType) {
        this._ocxObj.object.StopTool(enumCommToolType);
    };
    /**
    * 获取当前进行的分析类别
    * @return {AnalyseType} 获取当前进行的分析类别
    */
    this.getAnalyseType = function () {
        return this._analyseOper;
    };
    /**
    * 设置当前进行的分析类别
    * @param {AnalyseType} value 分析对象
    */
    this.setAnalyseType = function (value) {
        this._analyseOper = value;
    };
    /**
    * 获取当前分析得到的结果
    * @return {String} 获取当前分析得到的结果
    */
    this.getAnalyseInfo = function () {
        return this._analyseInfo;
    };
    /**
    * 设置当前分析得到的结果
    * @param {String} value 分析时的过程值
    */
    this.setAnalyseInfo = function (value) {
        this._analyseInfo = value;
    };
    /**
    * 清空缓存数据
    * @return {bool} 清除成功则返回true，失败返回false
    */
    this.clearCacheData = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.ClearCacheData();
        }
        return false;
    };
    /**
    * 获取拾取的高精度坐标，返回值以分号区分会返回两个坐标值,这里的xy指的是屏幕坐标，可以通过鼠标事件中的参数获取
    * @return {bool} 清除成功则返回得到的坐标true，失败返回空false
    */
    this.getPickUpGeoPos = function (x, y) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetPickUpGeoPos(x, y);
        }
        return "";
    }
    //-----------------------------------------------------------------------------
    //下面为自定义扩展方法
    //-----------------------------------------------------------------------------
    /**
    * 是否允许用户与三维球进行交互
    * @return {bool} true表示用户可以操作三维球，false表示用户无法操作三维球
    */
    this.enableInputObject = function (flag) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.EnableInputObject(flag);
        }
    };
    /**
    * 获取地球显示模式 1为球面模式 2为平面模式
    * @function 
    * @returns {1|2} 
    */
    this.getViewMode = function () {
        return this._ocxObj.object.Mode;
    }
    /**
    * 转到球体模式
    */
    this.goToGlobeMode = function (refreshData) {
        if (this._ocxObj) {
            this._ocxObj.object.Mode = 1;
            if (refreshData === true) {
                var ret = this.removeAll();
                //这里跳转以后重新加载一次数据
                var tempDoc = [];
                for (var i = 0; i < this._docObj.length; i++) {
                    var docObj = new MapDocObj();
                    docObj.url = this._docObj[i].url;
                    docObj.id = this._docObj[i].id;
                    docObj.name = this._docObj[i].name;
                    docObj.ip = this._docObj[i].ip;
                    docObj.port = this._docObj[i].port;
                    docObj.type = this._docObj[i].type;
                    if (this.removeDocById(docObj.id) > 0) {
                        tempDoc.push(docObj);
                    }
                }
                this._docObj = [];
                for (var i = 0; i < tempDoc.length; i++) {
                    var id = this.addDoc(tempDoc[i].name, tempDoc[i].ip, tempDoc[i].port, tempDoc[i].type);
                    if (id === -1) {
                        console.log('转为球面模式时，重新添加文档数据' + tempDoc[i].name + "失败");
                    }
                }
            }
        }
    };
    /**
    * 转到地表模式
    */
    this.goToSurfaceMode = function (refreshData) {
        if (this._ocxObj) {
            this._ocxObj.object.Mode = 2;
            if (refreshData === true) {
                //var ret = this.removeAll();
                //这里跳转以后重新加载一次数据
                var tempDoc = [];
                for (var i = 0; i < this._docObj.length; i++) {
                    var docObj = new MapDocObj();
                    docObj.url = this._docObj[i].url;
                    docObj.id = this._docObj[i].id;
                    docObj.name = this._docObj[i].name;
                    docObj.ip = this._docObj[i].ip;
                    docObj.port = this._docObj[i].port;
                    docObj.type = this._docObj[i].type;
                    if (this.removeDocById(docObj.id) > 0) {
                        tempDoc.push(docObj);
                    }
                }
                this._docObj = [];
                for (var i = 0; i < tempDoc.length; i++) {
                    var id = this.addDoc(tempDoc[i].name, tempDoc[i].ip, tempDoc[i].port, tempDoc[i].type);
                    if (id === -1) {
                        console.log('转为地表模式时，重新添加文档数据' + tempDoc[i].name + "失败");
                    }
                }
            }
        }
    };
    /**
    * 设置场景的状态,这个是原生方法
    * @param {Int} sddEntity 实体的id
    * @param {Int} layerIndex 图层的id
    * @param {EnumLayerState} state 场景状态值
    * @return {bool} 设置失败则返回false
    */
    this.setSceneState = function (sddEntity, layerIndex, state) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.SetSceneState(sddEntity, layerIndex, state);
        }
        return false;
    };
    /**
    * 设置图层状态
    * @param {Int} name 地图服务的id值
    * @param {Int} layerIdx 图层的id
    * @param {EnumLayerState} state 图层状态值
    * @return {bool} 设置失败则返回false
    */
    this.setLayerState = function (name, layerIdx, state) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._docObj && this._ocxObj.object && doc != null) {
            return this._ocxObj.object.SetSceneState(doc.id, layerIdx, state);
        }
        return false;
    };
    /**
    * 开启路径漫游编辑功能
    */
    this.startPathNavEdit = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.ExcuteTool("路径漫游", "路径编辑");
        }
    };
    /**
    * 开启路径漫游演示功能
    */
    this.startPathNavShow = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.ExcuteTool("路径漫游", "路径漫游");
        }
    };
    /**
    * 放大
    * @param {Double} v 缩放比例值
    */
    this.zoomIn = function (v) {
        this.zoom(v, 0.7);
    };
    /**
    * 缩小
    * @param {Double} v 缩放比例值
    */
    this.zoomOut = function (v) {
        this.zoom(v, 1.3);
    };
    /**
    * 缩放操作,内部方法
    */
    this.zoom = function (v, h) {
        if (this._ocxObj && this._ocxObj.object) {
            try {
                var camera = this._ocxObj.object.GetViewPos().split(',');
                if (camera.length > 4) {
                    if (v && typeof v === 'number')
                        h = 1 / v;
                    if (this._ocxObj.object.Mode === 1)
                        this._ocxObj.object.SetViewPos(camera[0], camera[1], camera[2] * h, camera[3], camera[4], camera[5]);
                    else
                        this._ocxObj.object.SetViewPos(camera[0], camera[1], camera[2], camera[3] * h, camera[4], camera[5]);
                }
            } catch (e) {
            }
        }
    };
    /**
    * 
    * 创建路径漫游
    * 根据路径文件创建路径漫游
    * @param {string} pathFile 需要创建的路径漫游的路径文件，为全路径，例如D:\path.pat。
    * @param {bool} isUseTerrainHei 路径漫游是否依赖于地形
    * @param {string} meshName 第三人称漫游下面看到的模型名称，如果传入模型名表示创建的为第三人称的路径漫游，传入空字符串为第一人称漫游
    * @returns {bool}  成功返回true
    * @example 
    * createPathFly("D:\\path.pat", true, "PathEdit_飞机1.mesh");
    */
    this.createPathFly = function (pathFile, isUseTerrainHei, meshName) {
        this._ocxObj.object.CreatePathFly(pathFile, isUseTerrainHei, meshName);
    };
    /**
    * 删除路径漫游
    * @returns {bool} 成功返回true
    */
    this.deletePathFly = function () {
        this._ocxObj.object.DeletePathFly();
    };
    /**
    * 由动画名称获取指定漫游的id
    * @param {String} name 动画的名称
    * @return {String} 获取对应动画的id，没有则返回-1
    */
    this.getAnimFlyByName = function (name) {
        for (var x = 0; x < this._animFlyElements.length; x++) {
            if (this._animFlyElements[x].name === name)
                return this._animFlyElements[x].id;
        }
        return -1;
    };
    /**
    * 创建动画
    * @param {String} name 用于标识该动画的名称，唯一主键
    * @param {String} meshFile 模型文件，例如：robot.mesh，默认提供的机器人模型
    * @param {String} actName 动画演示方式，例如：Walk，这个参数需要参考模型文件
    * @param {String} nodesInfo 节点值,例如="110.059515,18.856396,1200.000000,100;110.063326,18.865021,1200.000000,100;"
    *                             节点值分别为：经度、纬度、高程，第四个值可以理解为行走速率，默认100
    * @param {bool} isUseTerrainHei 是否随地形变化
    * @param {Double} camOffset 相机相对位置
    * @return {String} 返回动画创建成功的返回值，失败返回-1
    */
    this.createAnimFly = function (name, meshFile, actName, nodesInfo, isUseTerrainHei, camOffset) {
        //先检验是否包含该name的动画
        if (this.getAnimFlyByName(name) > 0)
            return -1;
        if (this._ocxObj && this._ocxObj.object) {
            var id = this._ocxObj.object.CreateAnimFly(meshFile, actName, nodesInfo, isUseTerrainHei, camOffset);
            if (id > 0) {
                this._animFlyElements.push({ name: name, id: id });
                return id;
            }
        }
        return -1;
    };
    /**
    * 操作某个动画
    * @param {String} name 动画的名称
    * @param {EnumFlyOperType} type 动画的类别
    * @return {String} 设置失败则返回-1
    */
    this.controlAnimFlyByName = function (name, type) {
        for (var x = 0; x < this._animFlyElements.length; x++) {
            if (this._animFlyElements[x].name === name) {
                if (this._ocxObj && this._ocxObj.object) {
                    return this._ocxObj.object.SetAnimFlyOper(this._animFlyElements[x].id, type);
                }
            }
        }
        return -1;
    };
    /**
    * 所有动画使用同一操作
    * @param {EnumFlyOperType} type 动画的类别
    */
    this.controlAllAnimFly = function (type) {
        for (var x = 0; x < this._animFlyElements.length; x++) {
            if (this._ocxObj && this._ocxObj.object) {
                this._ocxObj.object.SetAnimFlyOper(this._animFlyElements[x].id, type);
            }
        }
    };
    /**
    * 删除指定name的动画
    * @param {String} name 动画的名称
    * @return {bool} 删除操作是否成功的返回值
    */
    this.removeAnimFlyByName = function (name) {
        //重新申明一个数组存放非name的对象
        var animFlyElements = [];
        var id = -1;
        for (var x = 0; x < this._animFlyElements.length; x++) {
            if (this._animFlyElements[x].name != name) {
                animFlyElements.push(this._animFlyElements[x]);
            }
            else
                id = this._animFlyElements[x].id;
        }
        if (animFlyElements.length < this._animFlyElements.length && id > 0) {
            var flag = this._ocxObj.object.DeleteAnimFly(id);
            //删除成功则重新设置动画数组，并返回1
            if (flag) {
                this._animFlyElements = animFlyElements;
                return true;
            }
        }
        return false;
    };
    /**
    * 删除所有动画
    */
    this.removeAllAnimFly = function () {
        for (var x = 0; x < this._animFlyElements.length; x++) {
            if (this._ocxObj && this._ocxObj.object) {
                this._ocxObj.object.DeleteAnimFly(this._animFlyElements[x].id);
            }
        }
        this._animFlyElements = [];
    };
    /**
    * 设置动画的参数
    * @param {Unit} keyIndex 动画添加后的返回值
    * @param {String} argName 参数（目前可以设置为IsKeepCamera）
    * @param {String} args 暂无意义关于参数的具体描述
    */
    this.setAnimFlyParam = function (keyIndex, argName, args) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetAnimFlyParam(keyIndex, argName, args);
        }
    };
    //开始视频录制
    /*
    * filePath=视频的输出路径，必须包含后缀名.avi
    * width=视频宽度
    * height=视频长度
    * speed=视频播放速率
    */
    this.beginRecVideo = function (path, width, height, speed) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.BeginRecVideo(path, width, height, speed);
        }
        return false;
    };
    /**
    * 停止录制视频
    * @return {bool} 成功返回true，失败则为false
    */
    this.endRecVideo = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.EndRecVideo();
            return true;
        }
        return false;
    };
    /**
    *@example 
    * var result = globe.outPutImage("C:\\11.jpg", 256, 256, 0, 0, 150, false, false);
    * 
    * 根据设置的图像信息照相
    * @param {String} filePath 图片的导出完整路径，必须加上后缀名.bmp
    * @param {Double} width 图像宽度
    * @param {Double} height 图像长度
    * @param {Int} unit 图像的单位(PIXEL 0,INCH 1,CENT 2,MILL 3)
    * @param {String} resoultionType 像素单位(像素/英寸、像素/厘米)
    * @param {Int} dpi 图像的像素
    * @param {bool} isShowOverlay 是否showOverlay
    * @param {bool} isViewNow 是否马上预览图片
    * @return {bool} 成功返回true，失败则为false
    */
    this.outPutImage = function (filePath, width, height, unit, resoultionType, dpi, isShowOverlay, isViewNow) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.OutImage(filePath, width, height, unit, resoultionType, dpi, isShowOverlay, isViewNow);
        }
        return false;
    };
    /**
    * 由x、y坐标获取地形数据上的高程值
    * @param {Double} x 经度
    * @param {Double} y 纬度
    * @return {Double} 返回高程值
    */
    this.getTerrainEle = function (x, y) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetTerrainHei(x, y);
        }
        return -1;
    };
    /**
    * 设置缓存类型
    * @param {CachesType} cachesType 缓存类型
    */
    this.setCachesType = function (cachesType) {
        this._ocxObj.object.SetCachesType(cachesType);
    };
    /**
    * 设置指定图层类型的缓存大小
    * @param {CachesLayerType} type 图层的类型
    * @param {Int} size 缓存大小，默认为100
    */
    this.setCacheSize = function (type, size) {
        this._ocxObj.object.SetMaxLayerCacheSz(type, size);
    };
    /**
    * 自动旋转移动
    * @param {Double} x 沿维度运动的速度
    * @param {Double} y 沿经度运动的速度
    * @param {Double} rotate 旋转的速度
    */
    this.beginAutoPlay = function (x, y, rotate) {
        this._ocxObj.object.AutoPlay(x, y, rotate);
    };
    /**
    * 转发请求就是因为有的访问不到IGS，需要一个转发页面才能访问IGS，
    * 在IGS的链接串前面加上转发的字符串。
    * 另外，也可以在配置文件里面设置转发配置，Handler.xml
    * @param {Bool} isUsed 是否启用
    * @param {String} handleUrl 设置后的转发url
    */
    this.setUrlHandler = function (isUsed, handleUrl) {
        this._ocxObj.object.SetUrlHandler(isUsed, handleUrl);
    };
    //------------------模型特效显示部分-------------------------------------------
    /**
    * 设置指定模型的特效显示
    * @param {String} model 拾取模型得到的字符串
    * @param {Int} dispType 1,:闪烁2:高亮 3 :半透明
    * @param {bool} clearLast 是否清除上一次的高亮显示。默认得true。
    */
    this.startModelDiplay = function (model, dispType, clearLast) {
        if (this._ocxObj && this._ocxObj.object) {
            if (clearLast === false)
                this._ocxObj.object.StartCustomDisplay(model, dispType, false);
            else
                this._ocxObj.object.StartCustomDisplay(model, dispType, true);
        }
    };
    /**
    * 停止所有模型的特效显示
    */
    this.stopModelDisplayAll = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.StopCustomDisplayAll();
        }
    };
    /**
    * 停止指定模型的特效显示
    * @param {String} model 拾取模型得到的字符串
    */
    this.stopModelDisplay = function (model) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.StopCustomDisplay(model);
        }
    };
    //-----------------------------------------------------------------------------
    //加载KML和GML的功能部分
    /**
    * 添加KML数据到三维地球上
    * @param {String} url 可以使客户端上指定文件路径或能够获取数据的网络地址
    * @param {String} dispName 暂无实际意义
    * @return {String} 返回该数据的唯一标示符
    */
    this.appendKMLByURL = function (url, dispName) {
        if (this._ocxObj && this._ocxObj.object) {
            var result = this._ocxObj.object.AppendKMLByURL(url, dispName);
            this._xmlLayerObj.push({ id: result, name: dispName, type: 'kml' });
            return result;
        }
    };
    /**
    * 添加KML数据到三维地球上
    * @param {String} url 一个完整的kml文件内容
    * @param {String} dispName 暂无实际意义
    * @return {String} 返回该数据的唯一标示符
    */
    this.appendKMLByXML = function (xml, dispName) {
        if (this._ocxObj && this._ocxObj.object) {
            var result = this._ocxObj.object.AppendKMLByXML(xml, dispName);
            this._xmlLayerObj.push({ id: result, name: dispName, type: 'kml' });
            return result;
        }
    };
    /**
    * 添加GML数据到三维地球上
    * @param {String} url 可以使客户端上指定文件路径或能够获取数据的网络地址
    * @param {String} dispName 暂无实际意义
    * @return {String} 返回该数据的唯一标示符
    */
    this.appendGMLByURL = function (url, dispName) {
        if (this._ocxObj && this._ocxObj.object) {
            var result = this._ocxObj.object.AppendGMLByURL(url, dispName);
            this._xmlLayerObj.push({ id: result, name: dispName, type: 'gml' });
            return result;
        }
    };
    /**
    * 添加GML数据到三维地球上
    * @param {String} url 一个完整的gml文件内容
    * @param {String} dispName 暂无实际意义
    * @return {String} 返回该数据的唯一标示符
    */
    this.appendGMLByXML = function (xml, dispName) {
        if (this._ocxObj && this._ocxObj.object) {
            var result = this._ocxObj.object.AppendGMLByXML(xml, dispName);
            this._xmlLayerObj.push({ id: result, name: dispName, type: 'gml' });
            return result;
        }
    };
    /**
    * 删除指定类型名称的（gml或kml）数据图层：传入添加数据时写入的dispName
    */
    this.removeXMLByName = function (dispName) {
        if (this._ocxObj && this._ocxObj.object) {
            var layerObj = [];
            for (var x = 0; x < this._xmlLayerObj.length; x++) {
                if (this._xmlLayerObj[x].name !== dispName)
                    layerObj.push(this._overMapObj[x]);
                else
                    this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[x].id);
            }
            this._xmlLayerObj = layerObj;
        }
    };
    /**
    * 删除指定类型的（gml或kml）数据图层
    */
    this.removeXMLByType = function (type) {
        if (this._ocxObj && this._ocxObj.object) {
            var layerObj = [];
            for (var x = 0; x < this._xmlLayerObj.length; x++) {
                if (this._xmlLayerObj[x].type !== type)
                    layerObj.push(this._overMapObj[x]);
                else
                    this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[x].id);
            }
            this._xmlLayerObj = layerObj;
        }
    };
    /**
    * 删除所有添加的gml和kml数据图层
    */
    this.removeAllXMLLayer = function () {
        if (this._ocxObj && this._ocxObj.object) {
            for (var x = 0; x < this._xmlLayerObj.length; x++) {
                this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[x].id);
            }
            this._xmlLayerObj = [];
        }
    };
    //------------------场景视窗调节功能部分---------------------------------------
    /**
    * 设置环境光:color 环境光颜色，为32位整型，从高位到低位每八位分别表示ARGB
    */
    this.setEnvLight = function (color) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetEnvLight(color);
        }
    };
    /**
    * 获取环境光:color 环境光颜色，为32位整型，从高位到低位每八位分别表示ARGB
    */
    this.getEnvLight = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetEnvLight();
        }
    };
    /**
    * 设置天空盒信息
    * @param {Bool} startFlag TRUE:启用天空盒 FALSE:不启用天空盒，只有启用天空盒时后面的参数才有效
    * @param {String} materialName 设置天空盒使用的材质
    * @param {Double} xRotate 绕x轴的旋转
    * @param {Double} yRotate 绕y轴的旋转
    * @param {Double} zRotate 绕z轴的旋转
    */
    this.setSky = function (startFlag, materialName, xRotate, yRotate, zRotate) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetSky(startFlag, materialName, xRotate, yRotate, zRotate);
        }
    };
    /**
    * 获取天空盒信息
    */
    this.getSky = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetSky();
        }
    };
    /**
    * 设置场景雾参数
    * @param {Short} mode 雾模式，0-NONE 1-EXP 2-EXP2 3-LINER，为0时表示没有任何雾效果，设置后面的参数也无效
    * @param {Int} color 颜色，为32位整型，从高位到低位每八位分别表示ARGB
    * @param {Double} density 浓度
    * @param {Double} start 开始值，只在线性模式下有效
    * @param {Double} end 结束值，只在线性模式下有效
    */
    this.setFog = function (mode, color, density, start, end) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetFog(mode, color, density, start, end);
        }
    };
    /**
    * 获取雾效参数
    */
    this.getFog = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetFog();
        }
    };
    /**
    * 保存场景视窗的相关参数到配置文件
    * 对场景设置了环境光、天空盒、雾效以及相机参数后，默认是不会保存到配置文件的，需要
    * 调用本函数保存到配置文件，下次预览场景时会达到修改后的效果。
    */
    this.saveEnvParam = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.SaveEnvParam();
        }
    };
    //------------------三维切割相关方法场景视窗调节功能部分-----------------------
    /**
    * 构建一个XYZ形式的辅助平面，Geomtry对象以添加至globe
    * @param {String} range3D 场景的全范围，格式为：xmin，ymin，zmin，xmax， ymax，zmax
    * @param {String} type 基础平面类型，X、Y或Z，取值为：x、y、z
    * @param {Double} cutvalue 切割界限值
    * @return {Long} 返回绘制的图形id
    */
    this.createXYZSurface = function (range3D, type, cutvalue) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByXYZ, range3D,
        "axis:" + type + ";leftvalue:" + cutvalue + ";rightvalue:" + cutvalue, "");

        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 25600, \"fillclr\" : 25600," +
            "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 0, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
            "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    };
    /**
    * @callback Globe~workflowSuccess
    * @param {object} data 成功返回数据
    */
    /**
    * @callback Globe~workflowError
    * @param {object} xhr 失败返回xmlHttpRequest对象
    */
    /**
    * 执行平面方式切割模型
    * @param {string} orgSFClsStr 被切割的要素类GDBP URL
    * @param {string} leftSFClsStr 切割后左边要素类GDBP URL
    * @param {string} rightSFClsStr 切割后右边要素类GDBP URL
    * @param {x|y|z} type 切割类型，x,y,z 
    * @param {double} leftValue 切面左边线
    * @param {double} rigthValue 切面右边线
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip 服务器ip 缺省为localhost
    * @param {int} port 服务器端口 缺省为6163
    */
    this.exeCutByXYZSurface = function (orgSFClsStr, leftSFClsStr, rightSFClsStr, type, leftValue, rigthValue, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('leftSFClsStr', leftSFClsStr);
        map.add('rightSFClsStr', rightSFClsStr);
        map.add('type', type);
        map.add('leftValue', leftValue);
        map.add('rigthValue', rigthValue);
        this.exeWorkflow(ip, port, 600322, map.map, successCallback, errorCallback);
    };
    /**
    * 通过a、b两个向量构建一个切割平面，Geomtry对象以添加至globe
    * @param {String} range3D 场景的全范围，格式为：xmin，ymin，zmin，xmax， ymax，zmax
    * @param {Double} aValue 构建面使用的a，a向量的角度，取值为：0-360
    * @param {Double} bvalue 构建面使用的b，b向量的角度，取值为：0-360
    * @return {Long} 返回绘制的图形id
    */
    this.createABSurface = function (range3D, aValue, bvalue) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByAB, range3D,
            "avalue:" + aValue + ";bvalue:" + bvalue, "");

        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 25600, \"fillclr\" : 25600," +
            "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 0, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
            "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    };
    /**
    * 执行任意平面切割模型
    * @param {string} orgSFClsStr 被切割简单要素类GDBP URL 
    * @param {string} leftSFClsStr 切割后左边要素类GDBP URL
    * @param {string} rightSFClsStr 切割后右边要素类GDBP URL
    * @param {int} alphaValue a法向量，0-360
    * @param {int} beltaValue b法向量，0-360
    * @param {string} scaleValue 显示比例，格式 x:y:z
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip IGS服务ip 缺省为localhost
    * @param {int} port IGS服务端口 缺省为6163
    */
    this.exeCutByABSurface = function (orgSFClsStr, leftSFClsStr, rightSFClsStr, alphaValue, beltaValue, scaleValue, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('leftSFClsStr', leftSFClsStr);
        map.add('rightSFClsStr', rightSFClsStr);
        map.add('AValue', alphaValue);
        map.add('BValue', beltaValue);
        map.add('scale', scaleValue);
        this.exeWorkflow(ip, port, 600321, map.map, successCallback, errorCallback);
    };
    /**
    * 创建一个圆柱体，Geomtry对象以添加至globe
    * @param {String} range3D 场景的全范围，格式为：xmin，ymin，zmin，xmax， ymax，zmax
    * @param {String} type 基础平面类型，X、Y或Z，取值为：x、y、z
    * @param {Double} centerA 圆柱体的面的坐标，视情况而定：x、y；y、z；x、z
    * @param {Double} centerB 圆柱体的面的坐标，视情况而定：x、y；y、z；x、z
    * @param {Double} radius 圆柱体的半径
    * @return {Long} 返回绘制的图形id
    */
    this.createCyliner = function (range3D, type, centerA, centerB, radius) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Cyliner, range3D,
            "axis:" + type + ";radius:" + radius + ";xcenter:" + centerA + ";ycenter:" + centerB, "");

        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 25600, \"fillclr\" : 25600," +
            "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 0, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
            "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    };
    /**
    * 执行圆柱体方式切割模型

    * @param {string} orgSFClsStr 被切割简单要素类GDBP URL
    * @param {string} leftSFClsStr 切割后左边要素类GDBP URL
    * @param {string} rightSFClsStr 切割后右边要素类GDBP URL
    * @param {string} type 平面类型，分别在XOY、XOZ、YOZ三个平面基础上，输入值分别为：Z、Y、X
    * @param {double} centerX 圆柱体中心点X坐标
    * @param {double} centerY 圆柱体中心点Y坐标
    * @param {double} centerZ 圆柱体中心点Z坐标
    * @param {double} radius 圆柱体半径
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip IGS服务ip 缺省为localhost
    * @param {int} port IGS服务端口 缺省为6163
    */
    this.exeCutByCyliner = function (orgSFClsStr, leftSFClsStr, rightSFClsStr, type, centerX, centerY, centerZ, radius, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('leftSFClsStr', leftSFClsStr);
        map.add('rightSFClsStr', rightSFClsStr);
        map.add('type', type);
        map.add('centerX', centerX);
        map.add('centerY', centerY);
        map.add('centerZ', centerZ);
        map.add('radius', radius);
        this.exeWorkflow(ip, port, 600325, map.map, successCallback, errorCallback);
    };
    /**
    * 创建一个长方体圆柱体，Geomtry对象以添加至globe
    * @param {String} range3D 场景的全范围，格式为：xmin，ymin，zmin，xmax， ymax，zmax
    * @param {String} type 基础平面类型，X、Y或Z，取值为：x、y、z
    * @param {Double} centerX 长方体的x坐标
    * @param {Double} centerY 长方体的y坐标
    * @param {Double} centerZ 长方体的z坐标
    * @param {Double} len 长方体的长
    * @param {Double} wid 长方体的宽
    * @return {Long} 返回绘制的图形id
    */
    this.createBox = function (range3D, type, centerX, centerY, centerZ, len, wid) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Box, range3D,
            "axis:" + type + ";xcenter:" + centerX + ";ycenter:" + centerY + ";zcenter:" + centerZ
            + ";length:" + len + ";width:" + wid, "");

        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 25600, \"fillclr\" : 25600," +
            "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 0, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
            "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    };
    /**
    * 执行长方体方式切割模型
    * @param {string} orgSFClsStr 被切割简单要素类GDBP URL
    * @param {string} leftSFClsStr 切割后左边要素类GDBP URL
    * @param {string} rightSFClsStr 切割后右边要素类GDBP URL
    * @param {string} type 平面类型，分别在XOY、XOZ、YOZ三个平面基础上，输入值分别为：Z、Y、X
    * @param {double} centerX 长方体中心点X坐标
    * @param {double} centerY 长方体中心点Y坐标
    * @param {double} centerZ 长方体中心点Z坐标
    * @param {double} length 长方体的长
    * @param {double} width 长方体的宽
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip IGS服务ip 缺省为localhost
    * @param {int} port IGS服务端口 缺省为6163
    */
    this.exeCutByBox = function (orgSFClsStr, leftSFClsStr, rightSFClsStr, type, centerX, centerY, centerZ, length, width, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('leftSFClsStr', leftSFClsStr);
        map.add('rightSFClsStr', rightSFClsStr);
        map.add('type', type);
        map.add('centerX', centerX);
        map.add('centerY', centerY);
        map.add('centerZ', centerZ);
        map.add('length', length);
        map.add('width', width);
        this.exeWorkflow(ip, port, 600326, map.map, successCallback, errorCallback);
    };
    /**
    * 创建一个隧道几何体，Geomtry对象以添加至globe
    * @param {String} range3D 场景的全范围，格式为：xmin，ymin，zmin，xmax， ymax，zmax
    * @param {String} secType 隧道横截面的形状，圆形、对边形或拱形，取值为：circle、polygon或arch
    * @param {String} pnts 隧道基准线的点集，格式：x1,y1,z1;x2,y2,z2;x3,y3,z3.....
    * @param {Double} radius 圆形：半径；多边形：外接圆半径；拱形：上面圆弧的半径
    * @param {Int} secNum 圆形：圈的边数；多边形：多边形的边数；拱形：圆弧的边数
    * @param {Double} depth 隧道的深度
    * @param {Double} length 类型为拱形时有效，表示多边形的长
    * @param {Double} height 类型为拱形时有效，表示多边形的高
    * @return {Long} 返回绘制的图形id
    */
    this.createPipe = function (range3D, secType, pnts, radius, secNum, depth, length, height) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Pipe, range3D,
            "secType:" + secType + ";radius:" + radius + ";secNum:" + secNum +
            ";depth:" + depth + ";length:" + length + ";height:" + height + ";", pnts);

        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 25600, \"fillclr\" : 25600," +
            "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 0, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
            "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    };
    /**
    * 执行隧道方式切割模型
    * @param {string} orgSFClsStr 被切割简单要素类GDBP URL
    * @param {string} leftSFClsStr 切割后左边要素类GDBP URL
    * @param {string} rightSFClsStr 切割后右边要素类GDBP URL
    * @param {string} pnts 隧道经过的点集，二维点，格式为：x1,y1;x2,y2;x3,y3......
    * @param {circle|polygon|arch} type 隧道的类型，圆形，多边形或拱形，分别对应参数：circle、polygon、arch
    * @param {double} radius 圆形：半径，多边形：外接圆半径，拱形：拱形半径
    * @param {int} number 圆形：段数，多边形：多边形边数，拱形：段数
    * @param {double} depth 隧道的深度
    * @param {double} length 当选择拱形时有效：表示矩形的长度
    * @param {double} height 当选择拱形时有效：表示矩形的高度
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip IGS服务ip 缺省为localhost
    * @param {int} port IGS服务端口 缺省为6163
    */
    this.exeCutByPipe = function (orgSFClsStr, leftSFClsStr, rightSFClsStr, pnts, type, radius, number, depth, length, height, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('leftSFClsStr', leftSFClsStr);
        map.add('rightSFClsStr', rightSFClsStr);
        map.add('pnts', pnts);
        map.add('type', type);
        map.add('radius', radius);
        map.add('number', number);
        map.add('depth', depth);
        map.add('length', length);
        map.add('height', height);
        this.exeWorkflow(ip, port, 600327, map.map, successCallback, errorCallback);
    };
    /**
    * 执行工作流
    * @param {string} ip IGS服务ip
    * @param {int} port IGS服务端口
    * @param {int} flowId 工作流流程的编号
    * @param {Array<WFKeyValue>} keyvalueArray 工作流执行参数数组对象 
    * @param {function} successCallback 成功回调
    * @param {function} errorCallback 失败回调
    */
    this.exeWorkflow = function (ip, port, flowId, keyvalueArray, successCallback, errorCallback) {
        ip = ip || 'localhost';
        port = port || '6163';
        var url = 'http://' + ip + ":" + port + "/igs/rest/mrfws/execute/" + flowId + "?f=json";
        var postData = new Util().toJSON(keyvalueArray);
        if (window.XDomainRequest && !/MSIE 10.0/.test(window.navigator.userAgent)) {
            var xdr = new window.XDomainRequest();
            xdr.onload = function () { var json = $.parseJSON(this.responseText); successCallback && successCallback(json); };
            xdr.onerror = function () { errorCallback && errorCallback(xdr); };
            xdr.open("post", url);
            xdr.send(postData);
        } else {
            $.support.cors = true;
            $.ajax({
                url: url,
                type: 'post',
                data: postData,
                dataType: 'json',
                success: function (data) {
                    successCallback && successCallback(data);
                },
                error: function (xhr) {
                    errorCallback && errorCallback(xhr);
                }
            });
        }
    };

    /**
    * 根据线创建垂直曲面，Geomtry对象以添加至globe
    * @param {String} range3D 场景的全范围，格式为：xmin,ymin,zmin,xmax,ymax,zmax
    * @param {String} pnts 构成线的点集，格式：x1,y1,z1;x2,y2,z2;x3,y3,z3.....
    * @returns {Long} 返回绘制的图形id
    */
    this.createCutSurByLin = function (range3D, pnts) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByLin, range3D, "", pnts);
        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 16256, \"fillclr\" : 25600," +
      "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 1, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
         "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    };

    /**
    *根据折线创建封闭体
    *@param {String} range3D 场景的全范围，格式为：xmin,ymin,zmin,xmax,ymax,zmax
    *@param {float} height 高度
    *@param {float} depth 深度
    *@param {String} pnts 构成线的点集，格式：x1,y1,z1;x2,y2,z2;x3,y3,z3.....,注意一定要收尾封闭，即第一个点和最后一个点相同
    *@returns {Long} 返回绘制的图形id
    */
    this.createCutEntityByLin = function (range3D, height, depth, pnts) {
        if (range3D.split(',').length !== 6)
            return null;
        //使用插件内部的方法获取点集
        var geo = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_EntityByLin, range3D, "height:" + height + ";depth:" + depth, pnts);
        var infoJson = "{ \"ang\" : 0.0, \"endclr\" : 25600, \"fillclr\" : 25600," +
    "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 0, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
    "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
        if (geo)
            return this._ocxObj.object.AppendGeom(geo, infoJson);
        return -1;
    }

    /**
    * 构造面切割
    * @param {string} orgSFClsStr 被切割的三维简单要素类
    * @param {string} points x1,y1,z1;x2,y2,z2;x3,y3,z3
    * @param {string} lineSFClsStr 导入线要素类GDBP url
    * @param {double} angleX x旋转角度
    * @param {double} angleY y旋转角度
    * @param {bool} closeLine 是否封闭折线来构造体
    * @param {double} depth 深度
    * @param {bool} saveModal 是否保存切割后的模型，默认不保存
    * @param {string} resultModalClsPrefix 保存结果模型类的前缀，不填则为默认前缀
    * @param {bool} saveSection 是否保存切割后的剖面，默认不保存
    * @param {string} resultSectionClsPrefix 保存结果剖面类的前缀，不填则为默认前缀
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip IGS服务ip 缺省为localhost
    * @param {int} port IGS服务端口 缺省为6163
    */
    this.exeCutByVerticalSur = function (orgSFClsStr, points, lineSFClsStr, angleX, angleY, closeLine, depth, saveModal, resultModalClsPrefix, saveSection, resultSectionClsPrefix, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('points', points);
        map.add('lineSFClsStr', lineSFClsStr);
        map.add('angleX', angleX);
        map.add('angleY', angleY);
        map.add('closeLine', closeLine);
        map.add('depth', depth);
        map.add('saveModal', saveModal);
        map.add('resultModalClsPrefix', resultModalClsPrefix);
        map.add('saveSection', saveSection);
        map.add('resultSectionClsPrefix', resultSectionClsPrefix);
        this.exeWorkflow(ip, port, 600329, map.map, successCallback, errorCallback);
    };
    /**
    * 多平面批量切割模型
    * @param {string} orgSFClsStr 被切割简单要素类路径
    * @param {string} types 平面类型，分别在XOY、XOZ、YOZ三个平面基础上，输入值分别为：Z、Y、X，批量方式则输入多个并有半角逗号隔开,比如:X,Z,Y
    * @param {string} leftValues 平面左边线的值,批量方式则输入多个并有半角逗号隔开,比如:20,20
    * @param {string} rigthValues 平面右边线的值,批量方式则输入多个并有半角逗号隔开,比如:20,20
    * @param {bool} saveModal 是否保存切割后的模型，默认保存
    * @param {string} resultModalClsPrefix 保存结果模型类的前缀，不填则为默认前缀
    * @param {bool} saveSection 是否保存切割后的剖面，默认不保存
    * @param {string} resultSectionClsPrefix 保存结果剖面类的前缀，不填则为默认前缀
    * @param {Globe~workflowSuccess} successCallback 成功回调
    * @param {Globe~workflowError} errorCallback 失败回调
    * @param {string} ip IGS服务ip 缺省为localhost
    * @param {int} port IGS服务端口 缺省为6163
    */
    this.exeCutByMultiXYZSurface = function (orgSFClsStr, types, leftValues, rigthValues, saveModal, resultModalClsPrefix, saveSection, resultSectionClsPrefix, successCallback, errorCallback, ip, port) {
        var map = new WFKeyValueMap();
        map.add('orgSFClsStr', orgSFClsStr);
        map.add('types', types);
        map.add('leftValues', leftValues);
        map.add('rigthValues', rigthValues);
        map.add('saveModal', saveModal);
        map.add('resultModalClsPrefix', resultModalClsPrefix);
        map.add('saveSection', saveSection);
        map.add('resultSectionClsPrefix', resultSectionClsPrefix);
        this.exeWorkflow(ip, port, 600328, map.map, successCallback, errorCallback);
    };
    /**
    * 执行功能插件
    * @param {string} toolIn 需要调用的插件所在的插件功能组
    * @param {string} func 需要调用的插件功能项名称
    */
    this.executeTool = function (toolIn, func) {
        this._ocxObj.object.ExcuteTool(toolIn, func);
    };

    /**
    * 设置图层的显示比例,这里是以场景为单位进行设置
    * @param {String} name 地图服务名称
    * @param {String} layerIndex 图层(场景索引)
    * @param {String} RatioValue "Scale:x,y,z"
    * @return {String} 设置成功返回id值，失败则返回-1
    */
    this.setSceneRatio = function (name, layerIndex, RatioValue) {
        //保证该name所对应服务存在
        var doc = this.getDocByName(name);
        if (this._ocxObj && this._ocxObj.object && doc != null) {
            return this._ocxObj.object.SetScenePropertySet(doc.id, layerIndex, RatioValue);
        }
        return -1;
    };
    /**
    * 折现延伸到包围盒;绘制切割面，交互获取点序列之后，可以通过该函数将折线延伸至包围盒
    * @param {String} range3D 包围盒范围
    * @param {String} ctrlLine 折线序列点
    * @returns {String} 返回的是延伸后的点序列
    * @example 
    * string infoJson = "{ \"ang\" : 0.0, \"endclr\" : 16256, \"fillclr\" : 25600," +
    *                    "\"fillmode\" : 0, \"fullpatflg\" : 0, \"libID\" : 1, \"outpenw\" : 0.0, \"ovprnt\" : 3, " +
    *	                 "\"patID\" : -1, \"patclr\" : 0, \"pathei\" : 0.0, \"patwid\" : 0.0,  \"type\" : \"reginfo\"}";
    * string range3d = axWebOcx.GetSceneProperty(docID1, 0, "Range3D");
    * string extPnt = axWebOcx.ExtendFoldLinToBoxF(range3d, "93.15960693359375,154.84669494628906,21;133.88978576660156,113.69830322265625,21");
    * string cutGeomtry = axWebOcx.CreateCutGeomtry(0, range3d, "", extPnt);
    * Ocx.AppendGeom(cutGeomtry, infoJson); 
    */
    this.extendFoldLinToBoxF = function (range3D, ctrlLine) {
        return this._ocxObj.object.ExtendFoldLinToBoxF(range3D, ctrlLine);
    }

    //-----------------------------------------------------------------------------
    /**
    * 缓存预加载功能
    * @param {Long} sddEntity 地图文档添加完成以后的事件
    * @param {Int} layerIndex 预加载的图层，-1表示预加载所有图层
    * @param {Int} startlvl 开始级数
    * @param {Int} endlvl   结束级数
    */
    this.preLoadCache = function (sddEntity, layerIndex, startlvl, endlvl) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.PreLoadCache(sddEntity, layerIndex, startlvl, endlvl);
        }
    };
    //-----------------------------------------------------------------------------
    /**
    * 注册事件
    * @param {EventType} type 事件类型
    * @param {Function} callback 函数
    * @param {object} obj 对象
    */
    this.addEventListener = function (type, callback, obj) {
        this._events.register(type, callback, obj);
    };
    /**
    * 反注册事件
    * @param {EventType} type 事件类型
    * @param {Function} callback 函数
    */
    this.removeEventListener = function (type, callback) {
        this._events.unregister(type, callback);
    };
    /**
    * 分析完成的事件
    * @event Globe#FinishedAnalyze
    * @type {EventType}
    */
    /**
    * 触发分析完成的事件
    * @fires FinishedAnalyze
    * @private 
    */
    this._onFinishedAnalyze = function () {
        this._events.dispatchEvent(EventType.FinishedAnalyze, arguments);
        //这里将最新分析得到的结果对象更新到全局变量中
        if (arguments[0]) {
            //将json转为FLoodAnalyzeInfo对象
            var object = new Util().evalJSON(arguments[0]);
            //将json转为FLoodAnalyzeInfo对象
            var info = new Util().convertObjectToAnalyseTypeInfo(object);
            this.setAnalyseInfo(info);
        }
    };
    /**
    * 绘制完成的事件
    * @event Globe#FinishedDraw
    * @type {EventType}
    */
    /**
    * 触发绘制完成的事件
    * @files Globe#FinishedDraw
    * @private
    */
    this._onFinishedDraw = function () {
        //绘制完成以后存放当前正在绘制要素的坐标
        this.currentElePnts = arguments[0];
        this._events.dispatchEvent(EventType.FinishedDraw, arguments);
    };
    /**
    * 拾取标注完成的事件
    * @event Globe#PickLabel
    * @type {EventType}
    */
    /**
    * 触发拾取标注完成的事件
    * @files Globe#PickLabel
    * @private 
    */
    this._onPickLabel = function () {
        this._events.dispatchEvent(EventType.PickLabel, arguments);
    };
    /**
    * 拾取模型完成的事件
    * @event Globe#PickModel
    * @type {EventType}
    */
    /**
    * 触发拾取模型完成的事件
    * @fires Globe#PickModel
    * @private 
    */
    this._onPickModel = function () {
        this._events.dispatchEvent(EventType.PickModel, arguments);
    };

    //下面四种事件没有响应
    /**
    * 键盘按下的事件
    * @event Globe#KeyDown
    * @type {EventType}
    */
    /**
    * 键盘按下的事件
    * @fires Globe#KeyDown
    * @private 
    */
    this._onKeyDown = function () {
        this._events.dispatchEvent(EventType.KeyDown, arguments);
    };
    /**
    * 键盘释放的事件
    * @event Globe#KeyUp
    * @type {EventType}
    */
    /**
    * 触发键盘释放的事件
    * @fires Globe#KeyUp
    * @private 
    */
    this._onKeyUp = function () {
        this._events.dispatchEvent(EventType.KeyUp, arguments);
    };
    /**
    * 鼠标移动的事件
    * @event Globe#MouseMove
    * @type {EventType}
    */
    /**
    * 触发鼠标移动的事件
    * @fires Globe#MouseMove
    * @private 
    */
    this._onMouseMove = function () {
        this._events.dispatchEvent(EventType.MouseMove, arguments);
    };
    /**
    * 鼠标滑轮滚动的事件
    * @event Globe#MouseWheel
    * @type {EventType}
    */
    /**
    * 触发鼠标滑轮滚动的事件
    * @fires Globe#MouseWheel
    * @private 
    */
    this._onMouseWheel = function () {
        this._events.dispatchEvent(EventType.MouseWheel, arguments);
    };
    /**
    * 鼠标中键up
    * @event Globe#MButtonDown
    * @type {EventType}
    */
    /**
    * 触发鼠标中键up
    * @fires Globe#MButtonDown
    * @private 
    */
    this._onMButtonDown = function () {
        this._events.dispatchEvent(EventType.MButtonDown, arguments);
    };
    /**
    * 鼠标中键down
    * @event Globe#MButtonUp
    * @type {EventType}
    */
    /**
    * 触发鼠标中键down
    * @fires Globe#MButtonUp
    * @private 
    */
    this._onMButtonUp = function () {
        this._events.dispatchEvent(EventType.MButtonUp, arguments);
    };
    /**
    * 范围改变的事件
    * @event Globe#Jumped
    * @type {EventType}
    */
    /**
    * 触发范围改变的事件
    * @fires Globe#Jumped
    * @private 
    */
    this._onJumped = function () {
        this._events.dispatchEvent(EventType.Jumped, arguments);
    };
    /**
    * 拾取二维图形
    * @event Globe#PickElement
    * @type {EventType}
    */
    /**
    * 触发拾取二维图形
    * @fires Globe#PickElement
    * @private 
    */
    this._onPickElement = function () {
        this._events.dispatchEvent(EventType.PickElement, arguments);
    };
    /**
    * 左键双击完成的事件
    * @event Globe#LButtonDblClk
    * @type {EventType}
    */
    /**
    * 触发左键双击完成的事件
    * @fires Globe#LButtonDblClk
    * @private 
    */
    this._onLButtonDblClk = function () {
        this._events.dispatchEvent(EventType.LButtonDblClk, arguments);
    };
    /**
    * 左键按下完成的事件
    * @event Globe#LButtonDown
    * @type {EventType}
    */
    /**
    * 触发左键按下完成的事件
    * @fires Globe#LButtonDown
    * @private 
    */
    this._onLButtonDown = function () {
        this._events.dispatchEvent(EventType.LButtonDown, arguments);
    };
    /**
    * 左键释放完成的事件
    * @event Globe#LButtonUp
    * @type {EventType}
    */
    /**
    * 触发左键释放完成的事件
    * @fires Globe#LButtonUp
    * @private 
    */
    this._onLButtonUp = function () {
        this._events.dispatchEvent(EventType.LButtonUp, arguments);
    };
    /**
    * 右键双击完成的事件
    * @event Globe#RButtonDblClk
    * @type {EventType}
    */
    /**
    * 触发右键双击完成的事件
    * @fires Globe#RButtonDblClk
    * @private 
    */
    this._onRButtonDblClk = function () {
        this._events.dispatchEvent(EventType.RButtonDblClk, arguments);
    };
    /**
    * 右键按下完成的事件
    * @event Globe#RButtonDown
    * @type {EventType}
    */
    /**
    * 触发右键按下完成的事件
    * @fires Globe#RButtonDown
    * @private 
    */
    this._onRButtonDown = function () {
        this._events.dispatchEvent(EventType.RButtonDown, arguments);
    };
    /**
    * 右键释放完成的事件
    * @event Globe#RButtonUp
    * @type {EventType}
    */
    /**
    * 右键释放完成的事件
    * @fires Globe#RButtonUp
    * @private 
    */
    this._onRButtonUp = function () {
        this._events.dispatchEvent(EventType.RButtonUp, arguments);
    };
    /**
    * 文档加载完成后的回调
    * @event Globe#FinishedAddDoc
    * @type {EventType}
    */
    /**
    * 文档加载完成后的回调
    * @fires Globe#FinishedAddDoc
    * @private 
    */
    this._onFinishedAddDoc = function () {
        this._events.dispatchEvent(EventType.FinishedAddDoc, arguments);
    };
    /**
    * 缓存加载完成事件
    * @event Globe#FinishedLoadCache
    * @type {EventType}
    */
    /**
    * 缓存加载完成事件
    * @fires Globe#FinishedLoadCache
    * @private 
    */
    this._onFinishedLoadCache = function () {
        this._events.dispatchEvent(EventType.FinishedLoadCache, arguments);
    };
    /**
    * 插件正常加载完毕
    * @event Globe#CreationComplete
    * @type {EventType}
    */
    /**
    * 触发插件正常加载完毕
    * @fires Globe#CreationComplete
    * @private 
    */
    // 修改历史：1
    // 1.修改人：赵前军 2014-4-17
    // 修改问题：解决在浏览三维球时，不能及时显示当前状态条的问题
    this._onCreationComplete = function () {
        // 修改说明：因为三维插件浏览模式设置必须是在插件已经正常加载完毕才可以生效，
        //           所以在地球插件加载完毕的回调中设置当前状态条               
        // 修改人：赵前军 2014-4-17
        this.setPlantUIStateVisible(true);
        this._events.dispatchEvent(EventType.CreationComplete, arguments);
    };

    /**
    * 设置超时时间
    * @param {long} timeout 超时时间，单位毫秒  
    * @returns {bool} 操作是否成功 
    */
    this.setTimeOut = function (timeout) {
        var ret = this._ocxObj.object.SetTimeOut(timeout);
        return ret > 0;
    };

    /**
    * 获取地形是否加载完成标识
    * @returns {bool} false未完成，true完成 
    */
    this.isTerrainLoaded = function () {
        return this._ocxObj.object.IsTerrainLoaded();
    };

    //----------------------------------by liuruoli--------------------------------------
    /**
    * 粒子特效
    * @param {String} particeInfo 粒子信息参数
    * @returns {String} 返回所添加粒子的名称，更新粒子状态需要该名称
    * @example 
    * string particeInfo ="{\"ParticleType\":4,\"Postion\":{\"x\":0,\"y\":0,\"z\":13},\"Scale\":{\"x\":1,\"y\":1,\"z\":1}}";
    * Ocx.AddParticle(particeInfo);
    */
    this.addParticle = function (particeInfo) {
        var jsonInfo = new Util().toJSON(particeInfo);
        return this._ocxObj.object.AddParticle(jsonInfo);
    };



};