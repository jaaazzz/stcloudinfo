var MapDocQuery = function() {
    this.docObj = null;
    this.docName = "";
    this.mapIndex = 0;
    this.layerID = 0;
    this.geometryType = "";
    this.geometry = "";
    this.where = "";
    this.f = "json"; 
	this.objectIds = "";
    this.structs = "";
    this.page = "";
    this.pageCount = "";
    this.rule = "";
    this.queryResult = "未查询";
};

MapDocQuery.prototype.beginQuery = function(t, e) {
    var i = this;
    if (i.docObj && i.docObj.type != DocType.TypeDoc) {
        i.queryResult = "目标文档不符合查询要求";
        alert(i.queryResult);
        return;
    }
    if (!i.docName) i.docName = i.docObj.name;
    var o = "query?guid=" + Math.random();
    if (i.geometryType && i.geometry) {
        o += "&geometryType=" + i.geometryType + "&geometry=" + i.geometry;
    }
    if (i.where) o += "&where=" + i.where;
    if (i.f) o += "&f=" + i.f;
    if (i.objectIds) o += "&objectIds=" + i.objectIds;
    if (i.structs) o += "&structs=" + i.structs;
    if (i.page) o += "&page=" + i.page;
    if (i.pageCount) o += "&pageCount=" + i.pageCount;
    if (i.rule) o += "&rule=" + i.rule;
    $.support.cors = true;
    $.ajax({
        url: "http://" + i.docObj.ip + ":" + i.docObj.port + "/igs/rest/mrfs/docs/" + i.docName + "/" + i.mapIndex + "/" + i.layerID + "/" + o,
        dataType: "json",
        success: function(e, i) {
            t && t(e, i);
        },
        error: function(t) {
            e && e(t);
        }
    });
};

var Bubble = function() {
    this.text = "";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.sElevation = 0;
    this.fontname = "宋体";
    this.fontsize = 10;
    this.fontcolor = 4278255615;
    this.opacity = 1;
    this.bgColor = 1677786880;
    this.bdColor = 4278255615;
    this.width = 24;
    this.height = 30;
    this.scale = 1;
    this.attribute = "AppendBubble";
};

var Label = function() {
    this.text = "";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.sElevation = 0;
    this.fontname = "隶书";
    this.fontsize = 10;
    this.fontcolor = 4278255615;
    this.iconScale = 1;
    this.farDist = 1e10;
    this.nearDist = 1;
    this.attribute = "AppendLabel";
};

var LabelIcon = function() {
    this.text = "";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.sElevation = 0;
    this.fontname = "隶书";
    this.fontsize = 10;
    this.fontcolor = 4278255615;
    this.iconUrl = "";
    this.iconXScale = 1;
    this.iconYScale = 1;
    this.farDist = 1e10;
    this.nearDist = 1;
    this.txtPos = 1;
    this.attribute = "AppendLabel";
};

var ToolTip = function() {
    this.text = "";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.sElevation = 0;
    this.bdColor = 4278255615;
    this.width = 24;
    this.height = 30;
    this.attribute = "AppendToolTip";
};

var Point2D = function(t, e) {
    this.x = t;
    this.y = e;
};

var Point3D = function(t, e, i) {
    this.x = t;
    this.y = e;
    this.x = i;
};

var FLoodAnalyzeInfo = function() {
    this.type = 1;
    this.DataType = 1;
    this.ObserveDotX = 0;
    this.ObserveDotY = 0;
    this.ObserveDotZ = 0;
    this.StartDotX = 0;
    this.StartDotY = 0;
    this.StartDotZ = 0;
    this.EndDotX = 0;
    this.EndDotY = 0;
    this.EndDotZ = 0;
    this.dRegZoom = 1;
    this.alpha = .5;
    this.lFloodClr = 255;
    this.ShowBillBoard = true;
    this.Height = 1;
};

var CutFillInfo = function() {
    this.type = 2;
    this.DataType = 1;
    this.StartDotX = 0;
    this.StartDotY = 0;
    this.StartDotZ = 0;
    this.EndDotX = 0;
    this.EndDotY = 0;
    this.EndDotZ = 0;
    this.Height = 1;
    this.CutClr = 255;
    this.FillClr = 0;
    this.NoCutFillClr = 100;
};

var ViewShedInfo = function () {
    /// <summary>分析对应编号</summary>
    this.type = 3;
    /// <summary>数据模式</summary>
    this.DataType = 1;
    this.ObserveDotX = 0;
    this.ObserveDotY = 0;
    this.ObserveDotZ = 0;
    this.StartDotX = 0;
    this.StartDotY = 0;
    this.StartDotZ = 0;
    this.EndDotX = 0;
    this.EndDotY = 0;
    this.EndDotZ = 0;
    this.Height = 1;
    this.Alpha = .5;
    this.ViewClr = 100;
    this.ShedClr = 200;
};

var DynamicViewShedInfo = function() {
    this.type = 10;
    this.DataType = 1;
    this.StartAnalyze = true;
    this.SightDistance = 2e3;
    this.AngleOfView = 60;
    this.Speed = 1;
    this.SegmentNum = 10;
    this.PntArray = new Array();
};

var PointQueryInfo = function() {
    this.type = 4;
    this.pos = new Point3D(0, 0, 0);
    this.longitude = 0;
    this.latitude = 0;
    this.height = 0;
    this.slope = 0;
    this.aspect = 0;
};

var VisibleInfo = function() {
    this.type = 5;
};

var SlopeInfo = function() {
    this.type = 6;
};

var AspectInfo = function() {
    this.type = 7;
};

var BombInfo = function() {
    this.type = 1;
    this.bombtype = 0;
    this.axistype = 3;
    this.expdis = 50;
    this.frame = 30;
    this.radioscale = .75;
    this.bomrange = 1;
    this.isallscene = true;
};

var SunLightInfo = function() {
    this.type = 1;
    this.timedif = -8 * 60;
    this.isuseambient = false;
    this.isplanemode = false;
    this.altitudeangle = 30;
    this.azimuthangle = 30;
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.dayofweek = 0;
};

var TerSectInfo = function() {
    this.type = 1;
    this.cutlinclr = 255;
    this.linwidth = 10;
    this.showsection = 1;
    this.state = 0;
    this.pntnum = 150;
    this.graphclr = 255;
    this.graphlinclr = 255;
};

var ModelInfo = function() {
    this.type = 1;
    this.movetype = 3;
    this.rottype = 3;
};

var MeasureInfo = function() {
    this.type = 1;
    this.measuretype = 0;
    this.tooltype = "lengthmeasure";
    this.color = 255;
};

var DrawInfo = function() {
    this.shapeType = 2;
    this.bdColor = 255;
    this.fillColor = 100;
    this.transparence = 1;
    this.linWid = 5;
    this.lineType = 0;
};

var Draw3DElementInfo = function() {
    this.type = 0;
    this.pnts = "";
    this.libID = "0";
    this.symID = "10000016";
    this.fillClr = "2";
    this.transparent = "255";
    this.att = "";
};

var MapDocObj = function() {
    this.id = "";
    this.ip = "";
    this.port = "";
    this.name = "";
    this.url = "";
    this.type = "";
};

var WFKeyValue = function(t, e) {
    this.Key = t;
    this.Value = e;
};

WFKeyValue.prototype.put = function(t, e) {
    this.Key = t;
    this.Value = e;
};

var WFKeyValueMap = function() {
    this.map = new Array();
};

WFKeyValueMap.prototype.add = function(t, e) {
    if (t instanceof WFKeyValue) {
        this.map.push(t);
    } else if (typeof t !== "undefined" && typeof e !== "undefined") {
        this.map.push(new WFKeyValue(t, e));
    }
};

WFKeyValueMap.prototype.toJSON = function() {
    new Util().toJSON(this.map);
};

var EventType = {
    Initialize: "initialize",
    FinishedAnalyze: "finishedAnalyze",
    FinishedDraw: "finishedDraw",
    PickLabel: "pickLabel",
    PickModel: "pickModel",
    LButtonDblClk: "leftDbClick",
    LButtonDown: "leftMouseDown",
    LButtonUp: "leftMouseUp",
    MouseMove: "mouseMove",
    MouseWheel: "mouseWheel",
    KeyDown: "keyDown",
    KeyUp: "keyUp",
    MButtonDown: "mButtonDown",
    MButtonUp: "mButtonUp",
    Jumped: "jumped",
    PickElement: "pickElement",
    RButtonDblClk: "rightDbClick",
    RButtonDown: "rightMouseDown",
    RButtonUp: "rightMouseUp",
    CreationComplete: "creationComplete",
    FinishedAddDoc: "finishedAddDoc",
    FinishedLoadCache: "finishedLoadCache"
};

var MouseType = {
    Pan: "pan",
    ZoomInByRect: "zoomInByRect",
    ZoomOutByRect: "zoomOutByRect"
};

var CachesType = {
    ImageCache: 1,
    DBcache: 2,
    NullCache: 0
};

var CachesLayerType = {
    Covering: 0,
    Terrain: 2,
    Model: 3,
    Label: 4
};

var AnalyseType = {
    Null: "",
    FLoodAnalyze: 1,
    CutFill: 2,
    ViewShed: 3,
    PointQuery: 4,
    Visible: 5,
    Slope: 6,
    Aspect: 7
};

var EnumCommToolType = {
    Unknown: 0,
    TerrainAnalyze: 1,
    BombShow: 2,
    SunLight: 3,
    TerrainCut: 4,
    ModelEdit: 5,
    Measure: 6
};

var EnumLayerState = {
    StateDelete: 1,
    StateAppend: 2,
    StateVisble: 3,
    StateUnVisble: 4,
    StateActive: 5
};

var Enum2DShapeType = {
    TypeLine: 0,
    TypeRect: 1,
    TypePolygon: 2,
    TypeCircle: 3
};

var Enum2DLineType = {
    TypeSolid: 0,
    TypePolyLine: 1,
    TypePointLine: 2,
    TypePolyLinePoint: 3
};

var Enum3DShapeType = {
    Type3DPoint: 0,
    Type3DLine: 1,
    TypeSurface: 2
};

var DocType = {
    TypeDoc: 0,
    TypeRaster: 1,
    TypeG3D: 2,
    TypeLayer: 3,
    TypeOGCwmts: 4
};

var EnumFlyOperType = {
    FlyStart: 0,
    FlyPause: 1,
    FlyStop: 2,
    Reverse: 3,
    FlyBack: 4,
    PosBegin: 5,
    PosEnd: 6
};

var EnumTDTType = {
    Vector: "vec",
    VectorAno: "cva",
    Raster: "ims",
    RasterAno: "cia",
    Terrain: "ter"
};

var EnumModelDispType = {
    Flash: 1,
    Highlight: 2,
    Translucence: 3
};

var EnumMdlCutType = {
    MdlCut_SurByLin: 0,
    MdlCut_SurByXYZ: 1,
    MdlCut_SurByAB: 2,
    MdlCut_Cyliner: 3,
    MdlCut_Box: 4,
    MdlCut_Pipe: 5
};

var Event = function() {
    this.listeners = {};
    this.eventTypes = [];
    this.drawListeners = {};
    this.dispatchEvent = function(t, e) {
        if (!t) return;
        var i = this.listeners[t];
        if (i && i.length > 0) {
            for (var o = 0; o < i.length; o++) {
                var n = i[o];
                if (n) {
                    if (n.func.apply(n.obj, e) === false) {
                        break;
                    }
                }
            }
        }
    };
    this.addEventType = function(t) {
        if (!this.listeners[t]) {
            this.eventTypes.push(t);
            this.listeners[t] = [];
        }
    };
    this.removeListeners = function(t) {
        if (t && this.listeners[t] != null) {
            this.listeners[t] = [];
        }
    };
    this.register = function(t, e, i) {
        if (e != null && this.eventTypes.indexOf(t) > -1) {
            if (i == null) {
                i = window;
            }
            var o = this.listeners[t];
            o.push({
                obj: i,
                func: e
            });
        }
    };
    this.unregister = function(t, e, i) {
        if (i == null) {
            i = window;
        }
        var o = this.listeners[t];
        if (o != null) {
            for (var n = 0, s = o.length; n < s; n++) {
                if (o[n] && o[n].obj == i && o[n].func == e) {
                    o.splice(n, 1);
                    n--;
                    if (o && o.length > 0) continue;
                    break;
                }
            }
        }
    };
};

var Util = function() {
    this.isIE = /(Trident)|(Edge)/.test(navigator.userAgent);
    var escape = /["\\\x00-\x1f\x7f-\x9f]/g;
    var meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    };
    var hasOwn = Object.prototype.hasOwnProperty;
    this.toJSON = typeof JSON === "object" && JSON.stringify ? JSON.stringify : function(t) {
        if (t === null) {
            return "null";
        }
        var e, i, o, n, s = typeof t;
        if (s === "undefined") {
            return undefined;
        }
        if (s === "number" || s === "boolean") {
            return String(t);
        }
        if (s === "string") {
            return this.quoteString(t);
        }
        if (typeof t.toJSON === "function") {
            return this.toJSON(t.toJSON());
        }
        if (s === "date") {
            var r = t.getUTCMonth() + 1, c = t.getUTCDate(), h = t.getUTCFullYear(), a = t.getUTCHours(), l = t.getUTCMinutes(), u = t.getUTCSeconds(), b = t.getUTCMilliseconds();
            if (r < 10) {
                r = "0" + r;
            }
            if (c < 10) {
                c = "0" + c;
            }
            if (a < 10) {
                a = "0" + a;
            }
            if (l < 10) {
                l = "0" + l;
            }
            if (u < 10) {
                u = "0" + u;
            }
            if (b < 100) {
                b = "0" + b;
            }
            if (b < 10) {
                b = "0" + b;
            }
            return '"' + h + "-" + r + "-" + c + "T" + a + ":" + l + ":" + u + "." + b + 'Z"';
        }
        e = [];
        if (typeof t === "Array") {
            for (i = 0; i < t.length; i++) {
                e.push(this.toJSON(t[i]) || "null");
            }
            return "[" + e.join(",") + "]";
        }
        if (typeof t === "object") {
            for (i in t) {
                if (hasOwn.call(t, i)) {
                    s = typeof i;
                    if (s === "number") {
                        o = '"' + i + '"';
                    } else if (s === "string") {
                        o = this.quoteString(i);
                    } else {
                        continue;
                    }
                    s = typeof t[i];
                    if (s !== "function" && s !== "undefined") {
                        n = this.toJSON(t[i]);
                        e.push(o + ":" + n);
                    }
                }
            }
            return "{" + e.join(",") + "}";
        }
    };
    this.evalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function(str) {
        return eval("(" + str + ")");
    };
    this.secureEvalJSON = typeof JSON === "object" && JSON.parse ? JSON.parse : function(str) {
        var filtered = str.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "");
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval("(" + str + ")");
        }
        throw new SyntaxError("Error parsing JSON, source is not valid.");
    };
    this.quoteString = function(t) {
        if (t.match(escape)) {
            return '"' + t.replace(escape, function(t) {
                var e = meta[t];
                if (typeof e === "string") {
                    return e;
                }
                e = t.charCodeAt();
                return "\\u00" + Math.floor(e / 16).toString(16) + (e % 16).toString(16);
            }) + '"';
        }
        return '"' + t + '"';
    };
    this.convertObjectToAnalyseTypeInfo = function(t) {
        if (t == null) return null;
        var e = null;
        switch (t.type) {
          case 1:
            {
                e = new FLoodAnalyzeInfo();
                e.type = t.type;
                e.connectivity = t.connectivity;
                e.startpos = t.startpos;
                e.startreg = t.startreg;
                e.height = t.height;
                e.alpha = t.alpha;
                e.max = t.max;
                e.min = t.min;
                e.regzoom = t.regzoom;
                e.floodclr = t.floodclr;
                return e;
            }

          case 2:
            {
                e = new CutFillInfo();
                e.type = t.type;
                e.startreg = t.startreg;
                e.height = t.height;
                e.min = t.min;
                e.max = t.max;
                e.cutclr = t.cutclr;
                e.fillclr = t.fillclr;
                e.nocutfillclr = t.nocutfillclr;
                e.surfacearea = t.surfacearea;
                e.fillvolume = t.fillvolume;
                e.cutVolume = t.cutVolume;
                return e;
            }

          case 3:
            {
                e = new ViewShedInfo();
                e.type = t.type;
                e.startpos = t.startpos;
                e.startreg = t.startreg;
                e.height = t.height;
                e.alpha = t.alpha;
                e.viewclr = t.viewclr;
                e.shedclr = t.shedclr;
                return e;
            }

          case 4:
            {
                e = new PointQueryInfo();
                e.type = t.type;
                e.pos = new Point3D(t.pos.x, t.pos.y, t.pos.z);
                e.longitude = t.longitude;
                e.latitude = t.latitude;
                e.height = t.height;
                e.slope = t.slope;
                e.aspect = t.aspect;
                return e;
            }

          case 5:
            {
                e = new VisibleInfo();
                e.type = t.type;
                return e;
            }

          case 6:
            {
                e = new SlopeInfo();
                e.type = t.type;
                return e;
            }

          case 7:
            {
                e = new AspectInfo();
                e.type = t.type;
                return e;
            }
        }
    };
};

var Globe = function () {
    var t = "setup/MapGIS.WebSceneOcx.CAB";
    var e = "left:0px;top:0px;width:100%;height:100%;position:absolute;z-index:0;";
    this._isNavigateVisible = true;
    this._isPlantUIStateVisible = true;
    this._isDebugGrid = false;
    this._isGridNet = false;
    this._ocxObj = null;
    this._docObj = [];
    this._overMapObj = [];
    this._xmlLayerObj = [];
    this._drawElements = [];
    this.currentElePnts = "";
    this._draw3DElements = [];
    this._animFlyElements = [];
    this._analyseOper = "";
    this._analyseInfo = null;
    this._events = null;
    this.load = function (i) {
        if (new Util().isIE) {
            if (!this._events) {
                this._events = new Event();
                for (var o in EventType) {
                    this._events.addEventType(EventType[o]);
                }
            }
            var n = this;
            window._MapGIS_EarthControl_OnLoad = function (t) {
                var e = document.getElementById("MapGIS_EarthControl");
                if (e && e.object) {
                    e.onreadystatechange = null;
                    var o = ["FinishedAnalyze", "FinishedDraw", "PickLabel", "PickModel", "KeyDown", "KeyUp", "MouseMove", "MouseWheel", "MButtonDown", "MButtonUp", "Jumped", "PickElement", "LButtonDblClk", "LButtonDown", "LButtonUp", "RButtonDblClk", "RButtonDown", "RButtonUp", "FinishedAddDoc", "FinishedLoadCache"];
                    for (var s = 0; s < o.length; s++) {
                        (function (t) {
                            var func = function () {
                                var e = "_on" + t;
                                n[e].apply(n, arguments);
                            };
                            e.attachEvent ? e.attachEvent(t, func) : e.addEventListener(t, func);
                        })(o[s]);
                    }
                    var ini = "Initialized";
                    var iFunc = function() {
                        n._onCreationComplete(arguments);
                    };
                    e.attachEvent ? e.attachEvent(ini, iFunc) : e.addEventListener(ini, iFunc);
                    if (i) {
                        i(e.globeObj);
                    }
                } else {
                    alert("未能获取到插件对象,请确保插件已安装或已启用!");
                }
                window._MapGIS_EarthControl_OnLoad = null;
            };
            if (document.getElementById("MapGIS_EarthControl") != null) window._MapGIS_EarthControl_OnLoad(); else document.write('<object onreadystatechange="_MapGIS_EarthControl_OnLoad()" id = "MapGIS_EarthControl" codebase="' + t + '" classid = "clsid:56D6E862-F22D-41EF-B517-F2255A4250CB" style="' + e + '"/>');
            this._ocxObj = document.getElementById("MapGIS_EarthControl");
        } else {
            document.write('<div style="font-size: 48px;color: red;text-align: center;margin-top: 30px;">抱歉,三维地球控件只支持IE浏览器!</div>');
        }
    };
    this.getVersionNumber = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetVersionNumber();
        }
    };
    this.showAboutBox = function () {
        this._ocxObj.object.AboutBox();
    };
    this.addOverlay = function (t, e, i, o, n, s) {
        this._ocxObj.object.AddOverlay(t, e, i, o, n, s);
    };
    this.removeOverlayByName = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveOverlay(t);
        }
    };
    this.getDocByName = function (t) {
        for (var e = 0; e < this._docObj.length; e++) {
            if (this._docObj[e].name === t) return this._docObj[e];
        }
        return null;
    };
    this.addDoc = function (t, e, i, o, n) {
        var s = encodeURIComponent(t);
        if (this._ocxObj && this._ocxObj.object && t && e && i) {
            var r = "";
            if (o === DocType.TypeG3D) r = "http://" + e + ":" + i + "/igs/rest/g3d/" + s; else if (o === DocType.TypeDoc || o === DocType.TypeRaster) r = "http://" + e + ":" + i + "/igs/rest/ims/" + s; else if (o === DocType.TypeOGCwmts) {
                r = "http://" + e + ":" + i + "/igs/rest/ogc/" + s;
            } else return -1;
            var c = -1;
            if (n) c = this._ocxObj.object.AppendEx(r, n); else c = this._ocxObj.object.Append(r);
            if (c > 0) {
                var h = new MapDocObj();
                h.url = r;
                h.id = c;
                h.name = t;
                h.ip = e;
                h.port = i;
                h.type = o;
                this._docObj.push(h);
                return c;
            }
        }
        return -1;
    };
    this.appendGeomByUrl = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            var o = "http://" + e + ":" + i + "/igs/rest/g3d/GetDataByURL?gdbp=" + encodeURIComponent(t) + "&keepgeometry=true";
            var n = this._ocxObj.object.AppendGeomByUrl(o);
            if (n > 0) {
                var s = new MapDocObj();
                s.url = o;
                s.id = n;
                s.name = t;
                s.ip = e;
                s.port = i;
                this._docObj.push(s);
                return n;
            }
        }
        return -1;
    };
    this.setSceneMapVisible = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            if (e === false) this._ocxObj.object.SetSceneState(t, -1, EnumLayerState.StateUnVisble); else this._ocxObj.object.SetSceneState(t, -1, EnumLayerState.StateVisble);
        }
    };
    this.addLayer2DByQuery = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            if (i instanceof MapDocQuery) {
                var o = "query?guid=" + Math.random();
                if (i.geometryType && i.geometry) {
                    o += "&geometryType=" + i.geometryType + "&geometry=" + i.geometry;
                }
                if (i.where) o += "&where=" + i.where;
                if (i.objectIds) o += "&objectIds=" + i.objectIds;
                if (i.pageCount) o += "&pageCount=" + i.pageCount;
                var n = "http://" + t + ":" + e + "/igs/rest/mrfs/docs/" + i.docName + "/" + i.mapIndex + "/" + i.layerID + "/" + o;
                var s = this._ocxObj.object.Append(n);
                if (s > 0) {
                    var r = new MapDocObj();
                    r.url = n;
                    r.id = s;
                    r.name = n;
                    r.type = DocType.TypeLayer;
                    this._docObj.push(r);
                    return s;
                }
            }
        }
        return -1;
    };
    this.removeDocByName = function (t) {
        var e = this.getDocByName(t);
        if (!e) return false;
        return this.removeDocById(e.id);
    };
    this.removeDocById = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            var e = -1;
            for (var i = 0; i < this._docObj.length; i++) {
                if (this._docObj[i].id === t) {
                    e = i;
                }
            }
            if (e > -1) {
                var o = this._ocxObj.object.Remove(t);
                if (o > -1) {
                    this._docObj.splice(e, 1);
                    return true;
                }
            }
        }
        return false;
    };
    this.removeAllDoc = function () {
        this.removeAll();
        this._docObj = [];
    };
    this.addTianditu = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            if (this.getOverMapIDByName(t) !== -1) return -1;
            var e = -1;
            if (t) e = this._ocxObj.object.Append("http://tdt/getwmts?" + t); else e = this._ocxObj.object.Append("http://tdt/GetMap");
            if (e > 0) {
                this._overMapObj.push({
                    id: e,
                    name: t
                });
                return e;
            }
        }
        return -1;
    };
    this.addGoogleMap = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            if (this.getOverMapIDByName(t) !== -1) return -1;
            var e = this._ocxObj.object.Append("http://google/GetMap");
            if (e > 0) {
                this._overMapObj.push({
                    id: e,
                    name: t
                });
                return e;
            }
        }
        return -1;
    };
    this.getOverMapIDByName = function (t) {
        for (var e = 0; e < this._overMapObj.length; e++) {
            if (this._overMapObj[e].name === t) return this._overMapObj[e].id;
        }
        return -1;
    };
    this.removeOverMap = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            var e = [];
            for (var i = 0; i < this._overMapObj.length; i++) {
                if (this._overMapObj[i].id !== t) e.push(this._overMapObj[i]);
            }
            if (e.length < this._overMapObj.length) {
                this._ocxObj.object.Remove(t);
                this._overMapObj = e;
                return true;
            } else return false;
        }
    };
    this.removeOverMapByName = function (t) {
        if (this.getOverMapIDByName(t) === -1) return -1;
        return this.removeOverMap(this.getOverMapIDByName(t));
    };
    this.removeAllOverMap = function () {
        for (var t = 0; t < this._overMapObj.length; t++) {
            this._ocxObj.object.Remove(this._overMapObj[t].id);
        }
        this._overMapObj = [];
        return true;
    };
    this.setOverMapShowHide = function (t, e) {
        var i = this.getOverMapIDByName(t);
        if (i > 0) {
            if (e === false) this.setSceneState(i, 0, EnumLayerState.StateUnVisble); else this.setSceneState(i, 0, EnumLayerState.StateVisble);
        }
    };
    this.removeMap = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.Remove(t);
        }
        return -1;
    };
    this.addCovering = function (t, e, i, o, n, s, r, c) {
        var h = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object) {
            if (h != null) return this._ocxObj.object.AppendCovering2(h.id, e, i, o, n, s, r, c); else return this._ocxObj.object.AppendCovering2(t, e, i, o, n, s, r, c);
        }
        return -1;
    };
    this.addBubble = function (t) {
        if (t instanceof Bubble) {
            return this._ocxObj.object.AppendBubble(t.text, t.x, t.y, t.z, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.opacity, t.bgColor, t.bdColor, t.width, t.height, t.scale, t.attribute);
        }
        return -1;
    };
    this.addLabel = function (t) {
        if (t instanceof Label) {
            return this._ocxObj.object.AppendLabel(t.text, t.x, t.y, t.z, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.iconScale, t.farDist, t.nearDist, t.attribute);
        }
        return -1;
    };
    this.addLabelIcon = function (t) {
        if (t instanceof LabelIcon) {
            return this._ocxObj.object.AppendLabelIcon(t.text, t.x, t.y, t.z, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.iconUrl, t.iconXScale, t.iconYScale, t.farDist, t.nearDist, t.txtPos, t.attribute);
        }
        return -1;
    };
    this.addLabelIconByPick = function (t, e, i, o, n) {
        if (this._ocxObj && this._ocxObj.object) {
            if (t instanceof LabelIcon) {
                return this._ocxObj.object.AppendLabelIconByPick(t.text, t.x, t.y, t.z, e, i, o, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.iconUrl, t.iconXScale, t.iconYScale, t.farDist, t.nearDist, t.txtPos, n, t.attribute);
            }
        }
        return "";
    };
    this.addToolTip = function (t) {
        if (t instanceof ToolTip) {
            return this._ocxObj.object.AppendToolTip(t.text, t.x, t.y, t.z, t.sElevation, t.bdColor, t.width, t.height, t.attribute);
        }
        return -1;
    };
    this.GetLabelPos = function (t) {
        return this._ocxObj.object.GetLabelPos(t);
    };
    this.removeLabelByName = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveLabel(t);
        }
    };
    this.removeAllLabel = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveLabelAll();
        }
    };
    this.calXYLength = function (t, e, i, o, n, s, r) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.CalcLineLength(t, e, i, o, n, s, r);
        }
        return -1;
    };
    this.calPolygonArea = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            if (e) return this._ocxObj.object.CalcPolygonSurfaceArea(t, e); else return this._ocxObj.object.CalcPolygonSurfaceArea(t, 0);
        }
        return -1;
    };
    this.addGraphic = function (t, e) {
        if (this._ocxObj && this._ocxObj.object && e instanceof DrawInfo) {
            return this._ocxObj.object.DrawElement(e.shapeType, t, e.bdColor, e.fillColor, e.transparence, e.linWid, e.lineType);
        }
        return -1;
    };
    this.addPoint = function (t, e, i, o) {
        if (this._ocxObj && this._ocxObj.object) {
            if (!i) i = .1;
            if (!o) {
                o = new DrawInfo();
                o.shapeType = 3;
                o.bdColor = 4294901760;
                o.fillColor = 4294901760;
                o.transparence = 1;
                o.linWid = 1;
                o.lineType = 0;
            }
            var n = (t - i / 2).toString() + "," + (e + i / 2).toString() + ";" + (t + i / 2).toString() + "," + (e - i / 2).toString();
            return this.addGraphic(n, o);
        }
        return -1;
    };
    this.jumpByPos = function (t, e, i, o, n, s) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.Jump(t, e, i, o, n, s);
        }
    };
    this.jumpByModel = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object && o != null) {
            this._ocxObj.object.Jump2(o.id, e, i);
        }
    };
    this.jumpByRect = function (t, e, i, o) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.JumpByRect(t, e, i, o);
        }
    };
    this.convertPosToGeo = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetCartesianPosByGeodetic(t, e, i);
        }
        return -1;
    };
    this.convertGeoToPos = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetGeodeticPosByCartesian(t, e, i);
        }
        return -1;
    };
    this.convertLpToWp = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.LpToWp(t, e, i);
        }
        return -1;
    };
    this.convertWpToLp = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.WpToLp(t, e);
        }
        return -1;
    };
    this.convertScreenToWorldPos = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetWorldPosByScreen(t, e);
        }
        return -1;
    };
    this.startPickLabel = function () {
        this._ocxObj.object.StartPickLabel();
    };
    this.stopPickLabel = function () {
        this._ocxObj.object.StopPickLabel();
    };
    this.startPickTool = function () {
        this._ocxObj.object.StartPickTool();
    };
    this.pickLabelByXY = function (t, e) {
        return this._ocxObj.object.PickLabelByXY(t, e);
    };
    this.stopPickTool = function () {
        this._ocxObj.object.StopPickTool();
    };
    this.remove = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.Remove(t);
        }
        return -1;
    };
    this.removeAll = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.RemoveAll();
        }
        return -1;
    };
    this.removeAllGraphic = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveAllElement();
            this._drawElements = [];
        }
    };
    this.removeGraphicByName = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.RemoveElement(t);
            var e = [];
            for (var i = 0; i < this._drawElements.length; i++) {
                if (this._drawElements[i].id !== t) e.push(this._drawElements[i]);
            }
            if (e.length < this._drawElements.length) {
                this._drawElements = e;
            }
        }
        return -1;
    };
    this.setElementVisible = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetElementVisible(t, e);
        }
    };
    this.getPntsByEleID = function (t) {
        for (var e = 0; e < this._drawElements.length; e++) {
            if (this._drawElements[e].id === t) return this._drawElements[e].pnts;
        }
        return "";
    };
    this.reset = function () {
        this._ocxObj.object.Reset();
    };
    this.getCameraInfo = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetCamera();
        }
        return -1;
    };
    this.setCameraInfo = function (t, e, i, o, n, s, r, c) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.SetCamera(t, e, i, o, n, s, r, c);
        }
    };
    this.getViewPos = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetViewPos();
        }
        return -1;
    };
    this.setViewPos = function (t, e, i, o, n, s) {
        this._ocxObj.object.SetViewPos(t, e, i, o, n, s);
    };
    this.getViewRect = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetViewRect();
        }
        return -1;
    };
    this.setViewRect = function (t, e, i, o) {
        this._ocxObj.object.SetViewRect(t, e, i, o);
    };
    this.setFullView = function (t, e, i, o, n, s, r, c, h, a) {
        this._ocxObj.object.SetFullView(t, e, i, o, n, s, r, c, h, a);
    };
    this.exitFullView = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.ExitFullView();
        }
    };
    this.setNavigateVisible = function (t) {
        this._isNavigateVisible = t;
        this._ocxObj.object.ShowNavigateTool(t);
    };
    this.getNavigateVisible = function () {
        return this._isNavigateVisible;
    };
    this.setPlantUIStateVisible = function (t) {
        this._isPlantUIStateVisible = t;
        this._ocxObj.object.ShowPlantUIState(t);
    };
    this.getPlantUIStateVisible = function () {
        return this._isPlantUIStateVisible;
    };
    this.setDebugGridVisible = function (t) {
        this._isDebugGrid = t;
        this._ocxObj.object.ShowDebugGrid(t);
    };
    this.getDebugGridVisible = function () {
        return this._isDebugGrid;
    };
    this.setGridNetVisible = function (t) {
        this._isGridNet = t;
        this._ocxObj.object.ShowGridNet(t);
    };
    this.getGridNetVisible = function () {
        return this._isGridNet;
    };
    this.setSceneTransparent = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object && o != null) {
            return this._ocxObj.object.SetScenePropertySet(o.id, e, "Transparent:" + i);
        }
        return -1;
    };
    this.setShowPolygon = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object) {
            if (o != null) return this._ocxObj.object.SetScenePropertySet(o.id, e, "SetShowPolygon:" + i); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetShowPolygon:" + i);
        }
        return -1;
    };
    this.setShowRect = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object) {
            if (o != null) return this._ocxObj.object.SetScenePropertySet(o.id, e, "SetShowRange:" + i); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetShowRange:" + i);
        }
        return -1;
    };
    this.setLayerToTop = function (t, e) {
        var i = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object) {
            if (i != null) return this._ocxObj.object.SetScenePropertySet(i.id, e, "SetLayer2Top:true"); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetLayer2Top:true");
        }
        return -1;
    };
    this.setLayerPriority = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object) {
            if (o != null) return this._ocxObj.object.SetScenePropertySet(o.id, e, "SetLayerPriority:" + i); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetLayerPriority:" + i);
        }
        return -1;
    };
    this.setShowPolygonByid = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object && t) {
            return this._ocxObj.object.SetScenePropertySet(t, e, "SetShowPolygon:" + i);
        }
        return -1;
    };
    this.getSceneNode = function (t, e, i, o) {
        return this._ocxObj.object.GetSceneNode();
    };
    this.getSceneProperty = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object && t) {
            return this._ocxObj.object.GetSceneProperty(t, e, i);
        }
        return -1;
    };
    this.startDrawTool = function (t) {
        if (t instanceof DrawInfo) {
            this._ocxObj.object.StartDrawTool(t.shapeType, t.bdColor, t.fillColor, t.transparence, t.linWid, t.lineType);
        }
    };
    this.stopDrawTool = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.StopDrawTool();
        }
        return "";
    };
    this.draw3DElement = function (t) {
        if (this._ocxObj && this._ocxObj.object && t instanceof Draw3DElementInfo) {
            var e = this._ocxObj.object.Draw3DElement(t.type, t.pnts, "libID:" + t.libID + ",symID:" + t.symID + ",fillClr:" + t.fillClr + ",transparent:" + t.transparent, t.att);
            if (e > 0) this._draw3DElements.push(e);
            return e;
        }
        return "";
    };
    this.remove3DElement = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.Remove3DElement(t);
        }
    };
    this.set3DElementVisible = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.Set3DElementVisible(t, e);
        }
    };
    this.removeAll3DElement = function () {
        for (var t = 0; t < this._draw3DElements.length; t++) {
            this._ocxObj.object.Remove3DElement(this._draw3DElements[t]);
        }
        this._draw3DElements = [];
    };
    this.startAnalyzeTool = function (t) {
        var e = new Util().toJSON(t);
        if (t instanceof FLoodAnalyzeInfo || t instanceof CutFillInfo || t instanceof ViewShedInfo || t instanceof DynamicViewShedInfo || t instanceof PointQueryInfo || t instanceof VisibleInfo || t instanceof SlopeInfo || t instanceof AspectInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.TerrainAnalyze, e);
        } else if (t instanceof BombInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.BombShow, e);
        } else if (t instanceof SunLightInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.SunLight, e);
        } else if (t instanceof TerSectInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.TerrainCut, e);
        } else if (t instanceof ModelInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.ModelEdit, e);
        } else if (t instanceof MeasureInfo) {
            this._ocxObj.object.StartTool(EnumCommToolType.Measure, e);
        }
    };
    this.stopAnalyzeTool = function (t) {
        this._ocxObj.object.StopTool(t);
    };
    this.getAnalyseType = function () {
        return this._analyseOper;
    };
    this.setAnalyseType = function (t) {
        this._analyseOper = t;
    };
    this.getAnalyseInfo = function () {
        return this._analyseInfo;
    };
    this.setAnalyseInfo = function (t) {
        this._analyseInfo = t;
    };
    this.clearCacheData = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.ClearCacheData();
        }
        return false;
    };
    this.getPickUpGeoPos = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetPickUpGeoPos(t, e);
        }
        return "";
    };
    this.enableInputObject = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.EnableInputObject(t);
        }
    };
    this.getViewMode = function () {
        return this._ocxObj.object.Mode;
    };
    this.goToGlobeMode = function (t) {
        if (this._ocxObj) {
            this._ocxObj.object.Mode = 1;
            if (t === true) {
                var e = this.removeAll();
                var i = [];
                for (var o = 0; o < this._docObj.length; o++) {
                    var n = new MapDocObj();
                    n.url = this._docObj[o].url;
                    n.id = this._docObj[o].id;
                    n.name = this._docObj[o].name;
                    n.ip = this._docObj[o].ip;
                    n.port = this._docObj[o].port;
                    n.type = this._docObj[o].type;
                    if (this.removeDocById(n.id) > 0) {
                        i.push(n);
                    }
                }
                this._docObj = [];
                for (var o = 0; o < i.length; o++) {
                    var s = this.addDoc(i[o].name, i[o].ip, i[o].port, i[o].type);
                    if (s === -1) {
                        console.log("转为球面模式时，重新添加文档数据" + i[o].name + "失败");
                    }
                }
            }
        }
    };
    this.goToSurfaceMode = function (t) {
        if (this._ocxObj) {
            this._ocxObj.object.Mode = 2;
            if (t === true) {
                var e = [];
                for (var i = 0; i < this._docObj.length; i++) {
                    var o = new MapDocObj();
                    o.url = this._docObj[i].url;
                    o.id = this._docObj[i].id;
                    o.name = this._docObj[i].name;
                    o.ip = this._docObj[i].ip;
                    o.port = this._docObj[i].port;
                    o.type = this._docObj[i].type;
                    if (this.removeDocById(o.id) > 0) {
                        e.push(o);
                    }
                }
                this._docObj = [];
                for (var i = 0; i < e.length; i++) {
                    var n = this.addDoc(e[i].name, e[i].ip, e[i].port, e[i].type);
                    if (n === -1) {
                        console.log("转为地表模式时，重新添加文档数据" + e[i].name + "失败");
                    }
                }
            }
        }
    };
    this.setSceneState = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.SetSceneState(t, e, i);
        }
        return false;
    };
    this.setLayerState = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._docObj && this._ocxObj.object && o != null) {
            return this._ocxObj.object.SetSceneState(o.id, e, i);
        }
        return false;
    };
    this.startPathNavEdit = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.ExcuteTool("路径漫游", "路径编辑");
        }
    };
    this.startPathNavShow = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.ExcuteTool("路径漫游", "路径漫游");
        }
    };
    this.zoomIn = function (t) {
        this.zoom(t, .7);
    };
    this.zoomOut = function (t) {
        this.zoom(t, 1.3);
    };
    this.zoom = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            try {
                var i = this._ocxObj.object.GetViewPos().split(",");
                if (i.length > 4) {
                    if (t && typeof t === "number") e = 1 / t;
                    if (this._ocxObj.object.Mode === 1) this._ocxObj.object.SetViewPos(i[0], i[1], i[2] * e, i[3], i[4], i[5]); else this._ocxObj.object.SetViewPos(i[0], i[1], i[2], i[3] * e, i[4], i[5]);
                }
            } catch (o) { }
        }
    };
    this.createPathFly = function (t, e, i) {
        this._ocxObj.object.CreatePathFly(t, e, i);
    };
    this.deletePathFly = function () {
        this._ocxObj.object.DeletePathFly();
    };
    this.getAnimFlyByName = function (t) {
        for (var e = 0; e < this._animFlyElements.length; e++) {
            if (this._animFlyElements[e].name === t) return this._animFlyElements[e].id;
        }
        return -1;
    };
    this.createAnimFly = function (t, e, i, o, n, s) {
        if (this.getAnimFlyByName(t) > 0) return -1;
        if (this._ocxObj && this._ocxObj.object) {
            var r = this._ocxObj.object.CreateAnimFly(e, i, o, n, s);
            if (r > 0) {
                this._animFlyElements.push({
                    name: t,
                    id: r
                });
                return r;
            }
        }
        return -1;
    };
    this.controlAnimFlyByName = function (t, e) {
        for (var i = 0; i < this._animFlyElements.length; i++) {
            if (this._animFlyElements[i].name === t) {
                if (this._ocxObj && this._ocxObj.object) {
                    return this._ocxObj.object.SetAnimFlyOper(this._animFlyElements[i].id, e);
                }
            }
        }
        return -1;
    };
    this.controlAllAnimFly = function (t) {
        for (var e = 0; e < this._animFlyElements.length; e++) {
            if (this._ocxObj && this._ocxObj.object) {
                this._ocxObj.object.SetAnimFlyOper(this._animFlyElements[e].id, t);
            }
        }
    };
    this.removeAnimFlyByName = function (t) {
        var e = [];
        var i = -1;
        for (var o = 0; o < this._animFlyElements.length; o++) {
            if (this._animFlyElements[o].name != t) {
                e.push(this._animFlyElements[o]);
            } else i = this._animFlyElements[o].id;
        }
        if (e.length < this._animFlyElements.length && i > 0) {
            var n = this._ocxObj.object.DeleteAnimFly(i);
            if (n) {
                this._animFlyElements = e;
                return true;
            }
        }
        return false;
    };
    this.removeAllAnimFly = function () {
        for (var t = 0; t < this._animFlyElements.length; t++) {
            if (this._ocxObj && this._ocxObj.object) {
                this._ocxObj.object.DeleteAnimFly(this._animFlyElements[t].id);
            }
        }
        this._animFlyElements = [];
    };
    this.setAnimFlyParam = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetAnimFlyParam(t, e, i);
        }
    };
    this.beginRecVideo = function (t, e, i, o) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.BeginRecVideo(t, e, i, o);
        }
        return false;
    };
    this.endRecVideo = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.EndRecVideo();
            return true;
        }
        return false;
    };
    this.outPutImage = function (t, e, i, o, n, s, r, c) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.OutImage(t, e, i, o, n, s, r, c);
        }
        return false;
    };
    this.getTerrainEle = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetTerrainHei(t, e);
        }
        return -1;
    };
    this.setCachesType = function (t) {
        this._ocxObj.object.SetCachesType(t);
    };
    this.setCacheSize = function (t, e) {
        this._ocxObj.object.SetMaxLayerCacheSz(t, e);
    };
    this.beginAutoPlay = function (t, e, i) {
        this._ocxObj.object.AutoPlay(t, e, i);
    };
    this.setUrlHandler = function (t, e) {
        this._ocxObj.object.SetUrlHandler(t, e);
    };
    this.startModelDiplay = function (t, e, i) {
        if (this._ocxObj && this._ocxObj.object) {
            if (i === false) this._ocxObj.object.StartCustomDisplay(t, e, false); else this._ocxObj.object.StartCustomDisplay(t, e, true);
        }
    };
    this.stopModelDisplayAll = function () {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.StopCustomDisplayAll();
        }
    };
    this.stopModelDisplay = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.StopCustomDisplay(t);
        }
    };
    this.appendKMLByURL = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            var i = this._ocxObj.object.AppendKMLByURL(t, e);
            this._xmlLayerObj.push({
                id: i,
                name: e,
                type: "kml"
            });
            return i;
        }
    };
    this.appendKMLByXML = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            var i = this._ocxObj.object.AppendKMLByXML(t, e);
            this._xmlLayerObj.push({
                id: i,
                name: e,
                type: "kml"
            });
            return i;
        }
    };
    this.appendGMLByURL = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            var i = this._ocxObj.object.AppendGMLByURL(t, e);
            this._xmlLayerObj.push({
                id: i,
                name: e,
                type: "gml"
            });
            return i;
        }
    };
    this.appendGMLByXML = function (t, e) {
        if (this._ocxObj && this._ocxObj.object) {
            var i = this._ocxObj.object.AppendGMLByXML(t, e);
            this._xmlLayerObj.push({
                id: i,
                name: e,
                type: "gml"
            });
            return i;
        }
    };
    this.removeXMLByName = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            var e = [];
            for (var i = 0; i < this._xmlLayerObj.length; i++) {
                if (this._xmlLayerObj[i].name !== t) e.push(this._overMapObj[i]); else this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[i].id);
            }
            this._xmlLayerObj = e;
        }
    };
    this.removeXMLByType = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            var e = [];
            for (var i = 0; i < this._xmlLayerObj.length; i++) {
                if (this._xmlLayerObj[i].type !== t) e.push(this._overMapObj[i]); else this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[i].id);
            }
            this._xmlLayerObj = e;
        }
    };
    this.removeAllXMLLayer = function () {
        if (this._ocxObj && this._ocxObj.object) {
            for (var t = 0; t < this._xmlLayerObj.length; t++) {
                this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[t].id);
            }
            this._xmlLayerObj = [];
        }
    };
    this.setEnvLight = function (t) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetEnvLight(t);
        }
    };
    this.getEnvLight = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetEnvLight();
        }
    };
    this.setSky = function (t, e, i, o, n) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetSky(t, e, i, o, n);
        }
    };
    this.getSky = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetSky();
        }
    };
    this.setFog = function (t, e, i, o, n) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.SetFog(t, e, i, o, n);
        }
    };
    this.getFog = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.GetFog();
        }
    };
    this.saveEnvParam = function () {
        if (this._ocxObj && this._ocxObj.object) {
            return this._ocxObj.object.SaveEnvParam();
        }
    };
    this.createXYZSurface = function (t, e, i) {
        if (t.split(",").length !== 6) return null;
        var o = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByXYZ, t, "axis:" + e + ";leftvalue:" + i + ";rightvalue:" + i, "");
        var n = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (o) return this._ocxObj.object.AppendGeom(o, n);
        return -1;
    };
    this.exeCutByXYZSurface = function (t, e, i, o, n, s, r, c, h, a) {
        var l = new WFKeyValueMap();
        l.add("orgSFClsStr", t);
        l.add("leftSFClsStr", e);
        l.add("rightSFClsStr", i);
        l.add("type", o);
        l.add("leftValue", n);
        l.add("rigthValue", s);
        this.exeWorkflow(h, a, 600322, l.map, r, c);
    };
    this.createABSurface = function (t, e, i) {
        if (t.split(",").length !== 6) return null;
        var o = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByAB, t, "avalue:" + e + ";bvalue:" + i, "");
        var n = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (o) return this._ocxObj.object.AppendGeom(o, n);
        return -1;
    };
    this.exeCutByABSurface = function (t, e, i, o, n, s, r, c, h) {
        var a = new WFKeyValueMap();
        a.add("orgSFClsStr", t);
        a.add("leftSFClsStr", e);
        a.add("rightSFClsStr", i);
        a.add("AValue", o);
        a.add("BValue", n);
        this.exeWorkflow(c, h, 600321, a.map, s, r);
    };
    this.createCyliner = function (t, e, i, o, n) {
        if (t.split(",").length !== 6) return null;
        var s = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Cyliner, t, "axis:" + e + ";radius:" + n + ";xcenter:" + i + ";ycenter:" + o, "");
        var r = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (s) return this._ocxObj.object.AppendGeom(s, r);
        return -1;
    };
    this.exeCutByCyliner = function (t, e, i, o, n, s, r, c, h, a, l, u) {
        var b = new WFKeyValueMap();
        b.add("orgSFClsStr", t);
        b.add("leftSFClsStr", e);
        b.add("rightSFClsStr", i);
        b.add("type", o);
        b.add("centerX", n);
        b.add("centerY", s);
        b.add("centerZ", r);
        b.add("radius", c);
        this.exeWorkflow(l, u, 600325, b.map, h, a);
    };
    this.createBox = function (t, e, i, o, n, s, r) {
        if (t.split(",").length !== 6) return null;
        var c = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Box, t, "axis:" + e + ";xcenter:" + i + ";ycenter:" + o + ";zcenter:" + n + ";length:" + s + ";width:" + r, "");
        var h = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (c) return this._ocxObj.object.AppendGeom(c, h);
        return -1;
    };
    this.exeCutByBox = function (t, e, i, o, n, s, r, c, h, a, l, u, b) {
        var f = new WFKeyValueMap();
        f.add("orgSFClsStr", t);
        f.add("leftSFClsStr", e);
        f.add("rightSFClsStr", i);
        f.add("type", o);
        f.add("centerX", n);
        f.add("centerY", s);
        f.add("centerZ", r);
        f.add("length", c);
        f.add("width", h);
        this.exeWorkflow(u, b, 600326, f.map, a, l);
    };
    this.createPipe = function (t, e, i, o, n, s, r, c) {
        if (t.split(",").length !== 6) return null;
        var h = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Pipe, t, "secType:" + e + ";radius:" + o + ";secNum:" + n + ";depth:" + s + ";length:" + r + ";height:" + c + ";", i);
        var a = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (h) return this._ocxObj.object.AppendGeom(h, a);
        return -1;
    };
    this.exeCutByPipe = function (t, e, i, o, n, s, r, c, h, a, l, u, b, f) {
        var p = new WFKeyValueMap();
        p.add("orgSFClsStr", t);
        p.add("leftSFClsStr", e);
        p.add("rightSFClsStr", i);
        p.add("pnts", o);
        p.add("type", n);
        p.add("radius", s);
        p.add("number", r);
        p.add("depth", c);
        p.add("length", h);
        p.add("height", a);
        this.exeWorkflow(b, f, 600327, p.map, l, u);
    };
    this.exeWorkflow = function (t, e, i, o, n, s) {
        t = t || "localhost";
        e = e || "6163";
        var r = "http://" + t + ":" + e + "/igs/rest/mrfws/execute/" + i + "?f=json";
        var c = new Util().toJSON(o);
        if (window.XDomainRequest && !/MSIE 10.0/.test(window.navigator.userAgent)) {
            var h = new window.XDomainRequest();
            h.onload = function () {
                var t = $.parseJSON(this.responseText);
                n && n(t);
            };
            h.onerror = function () {
                s && s(h);
            };
            h.open("post", r);
            h.send(c);
        } else {
            $.support.cors = true;
            $.ajax({
                url: r,
                type: "post",
                data: c,
                dataType: "json",
                success: function (t) {
                    n && n(t);
                },
                error: function (t) {
                    s && s(t);
                }
            });
        }
    };
    this.createCutSurByLin = function (t, e) {
        if (t.split(",").length !== 6) return null;
        var i = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByLin, t, "", e);
        var o = '{ "ang" : 0.0, "endclr" : 16256, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 1, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (i) return this._ocxObj.object.AppendGeom(i, o);
        return -1;
    };
    this.exeCutByVerticalSur = function (t, e, i, o, n, s, r, c, h, a, l, u, b, f, p) {
        var j = new WFKeyValueMap();
        j.add("orgSFClsStr", t);
        j.add("points", e);
        j.add("lineSFClsStr", i);
        j.add("angleX", o);
        j.add("angleY", n);
        j.add("closeLine", s);
        j.add("depth", r);
        j.add("saveModal", c);
        j.add("resultModalClsPrefix", h);
        j.add("saveSection", a);
        j.add("resultSectionClsPrefix", l);
        this.exeWorkflow(f, p, 600329, j.map, u, b);
    };
    this.exeCutByMultiXYZSurface = function (t, e, i, o, n, s, r, c, h, a, l, u) {
        var b = new WFKeyValueMap();
        b.add("orgSFClsStr", t);
        b.add("types", e);
        b.add("leftValues", i);
        b.add("rigthValues", o);
        b.add("saveModal", n);
        b.add("resultModalClsPrefix", s);
        b.add("saveSection", r);
        b.add("resultSectionClsPrefix", c);
        this.exeWorkflow(l, u, 600328, b.map, h, a);
    };
    this.executeTool = function (t, e) {
        this._ocxObj.object.ExcuteTool(t, e);
    };
    this.setSceneRatio = function (t, e, i) {
        var o = this.getDocByName(t);
        if (this._ocxObj && this._ocxObj.object && o != null) {
            return this._ocxObj.object.SetScenePropertySet(o.id, e, i);
        }
        return -1;
    };
    this.preLoadCache = function (t, e, i, o) {
        if (this._ocxObj && this._ocxObj.object) {
            this._ocxObj.object.PreLoadCache(t, e, i, o);
        }
    };
    this.addEventListener = function (t, e, i) {
        this._events.register(t, e, i);
    };
    this.removeEventListener = function (t, e) {
        this._events.unregister(t, e);
    };
    this._onFinishedAnalyze = function () {
        this._events.dispatchEvent(EventType.FinishedAnalyze, arguments);
        if (arguments[0]) {
            var t = new Util().evalJSON(arguments[0]);
            var e = new Util().convertObjectToAnalyseTypeInfo(t);
            this.setAnalyseInfo(e);
        }
    };
    this._onFinishedDraw = function () {
        this.currentElePnts = arguments[0];
        this._events.dispatchEvent(EventType.FinishedDraw, arguments);
    };
    this._onPickLabel = function () {
        this._events.dispatchEvent(EventType.PickLabel, arguments);
    };
    this._onPickModel = function () {
        this._events.dispatchEvent(EventType.PickModel, arguments);
    };
    this._onKeyDown = function () {
        this._events.dispatchEvent(EventType.KeyDown, arguments);
    };
    this._onKeyUp = function () {
        this._events.dispatchEvent(EventType.KeyUp, arguments);
    };
    this._onMouseMove = function () {
        this._events.dispatchEvent(EventType.MouseMove, arguments);
    };
    this._onMouseWheel = function () {
        this._events.dispatchEvent(EventType.MouseWheel, arguments);
    };
    this._onMButtonDown = function () {
        this._events.dispatchEvent(EventType.MButtonDown, arguments);
    };
    this._onMButtonUp = function () {
        this._events.dispatchEvent(EventType.MButtonUp, arguments);
    };
    this._onJumped = function () {
        this._events.dispatchEvent(EventType.Jumped, arguments);
    };
    this._onPickElement = function () {
        this._events.dispatchEvent(EventType.PickElement, arguments);
    };
    this._onLButtonDblClk = function () {
        this._events.dispatchEvent(EventType.LButtonDblClk, arguments);
    };
    this._onLButtonDown = function () {
        this._events.dispatchEvent(EventType.LButtonDown, arguments);
    };
    this._onLButtonUp = function () {
        this._events.dispatchEvent(EventType.LButtonUp, arguments);
    };
    this._onRButtonDblClk = function () {
        this._events.dispatchEvent(EventType.RButtonDblClk, arguments);
    };
    this._onRButtonDown = function () {
        this._events.dispatchEvent(EventType.RButtonDown, arguments);
    };
    this._onRButtonUp = function () {
        this._events.dispatchEvent(EventType.RButtonUp, arguments);
    };
    this._onFinishedAddDoc = function () {
        this._events.dispatchEvent(EventType.FinishedAddDoc, arguments);
    };
    this._onFinishedLoadCache = function () {
        this._events.dispatchEvent(EventType.FinishedLoadCache, arguments);
    };
    this._onCreationComplete = function () {
        this.setPlantUIStateVisible(true);
        this._events.dispatchEvent(EventType.CreationComplete, arguments);
    };
    this.setTimeOut = function (t) {
        var e = this._ocxObj.object.SetTimeOut(t);
        return e > 0;
    };
    this.isTerrainLoaded = function () {
        return this._ocxObj.object.IsTerrainLoaded();
    };
};