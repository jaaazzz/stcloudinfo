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
    MdlCut_Pipe: 5,
    MdlCut_EntityByLin: 6
};

var Event = function() {
    this.listeners = {};
    this.eventTypes = [];
    this.drawListeners = {};
    this.dispatchEvent = function(t, e) {
        if (!t) return;
        var i = this.listeners[t];
        if (i && i.length > 0) {
            for (var s = 0; s < i.length; s++) {
                var o = i[s];
                if (o) {
                    if (o.func.apply(o.obj, e) === false) {
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
            var s = this.listeners[t];
            s.push({
                obj: i,
                func: e
            });
        }
    };
    this.unregister = function(t, e, i) {
        if (i == null) {
            i = window;
        }
        var s = this.listeners[t];
        if (s != null) {
            for (var o = 0, n = s.length; o < n; o++) {
                if (s[o] && s[o].obj == i && s[o].func == e) {
                    s.splice(o, 1);
                    o--;
                    if (s && s.length > 0) continue;
                    break;
                }
            }
        }
    };
};

var Globe = function() {
    var t = "../Zondy Earth Professional.exe";
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
    this.load = function(i) {
        if (new Util().isIE) {
            if (!this._events) {
                this._events = new Event();
                for (var s in EventType) {
                    this._events.addEventType(EventType[s]);
                }
            }
            var o = this;
            window._MapGIS_EarthControl_OnLoad = function(t) {
                var e = document.getElementById("MapGIS_EarthControl");
                o._ocxObj = e;
                if (e && e.object) {
                    e.onreadystatechange = null;
                    var s = [ "FinishedAnalyze", "FinishedDraw", "PickLabel", "PickModel", "KeyDown", "KeyUp", "MouseMove", "MouseWheel", "MButtonDown", "MButtonUp", "Jumped", "PickElement", "LButtonDblClk", "LButtonDown", "LButtonUp", "RButtonDblClk", "RButtonDown", "RButtonUp", "FinishedAddDoc", "FinishedLoadCache" ];
                    for (var n = 0; n < s.length; n++) {
                        (function(t) {
                            var i = function() {
                                var e = "_on" + t;
                                o[e].apply(o, arguments);
                            };
                            e.attachEvent ? e.attachEvent(t, i) : e.addEventListener(t, i);
                        })(s[n]);
                    }
                    e.attachEvent ? e.attachEvent("Initialized", function() {
                        o._onCreationComplete(arguments);
                    }) : e.addEventListener("Initialized", function() {
                        o._onCreationComplete(arguments);
                    });
                    if (i) {
                        i(e);
                    }
                } else {
                    alert("未能获取到插件对象,请确保插件已安装或已启用!");
                }
                window._MapGIS_EarthControl_OnLoad = null;
            };
            if (document.getElementById("MapGIS_EarthControl") != null) {
                window._MapGIS_EarthControl_OnLoad();
            } else {
                document.write('<object onreadystatechange="_MapGIS_EarthControl_OnLoad()" id = "MapGIS_EarthControl" codebase="' + t + '" classid = "clsid:56D6E862-F22D-41EF-B517-F2255A4250CB" style="' + e + '"/>');
                this._ocxObj = document.getElementById("MapGIS_EarthControl");
            }
        } else {
            document.write('<div style="font-size: 48px;color: red;text-align: center;margin-top: 30px;">抱歉,三维地球控件只支持IE浏览器!</div>');
        }
    };
    this.assertOCX = function() {
        if (!(this._ocxObj && this._ocxObj.object)) {
            throw new exception("activeX控件加载失败，不能正常调用");
        }
    };
    this.getVersionNumber = function() {
        this.assertOCX();
        return this._ocxObj.object.GetVersionNumber();
    };
    this.showAboutBox = function() {
        this.assertOCX();
        this._ocxObj.object.AboutBox();
    };
    this.addOverlay = function(t, e, i, s, o, n) {
        this.assertOCX();
        this._ocxObj.object.AddOverlay(t, e, i, s, o, n);
    };
    this.removeOverlayByName = function(t) {
        this.assertOCX();
        this._ocxObj.object.RemoveOverlay(t);
    };
    this.getDocByName = function(t) {
        for (var e = 0; e < this._docObj.length; e++) {
            if (this._docObj[e].name === t) return this._docObj[e];
        }
        return null;
    };
    this.addDoc = function(t, e, i, s, o) {
        this.assertOCX();
        var n = encodeURIComponent(t);
        if (this._ocxObj && this._ocxObj.object && t && e && i) {
            var r = "";
            if (s === DocType.TypeG3D) r = "http://" + e + ":" + i + "/igs/rest/g3d/" + n; else if (s === DocType.TypeDoc || s === DocType.TypeRaster) r = "http://" + e + ":" + i + "/igs/rest/ims/" + n; else if (s === DocType.TypeOGCwmts) {
                r = "http://" + e + ":" + i + "/igs/rest/ogc/" + n;
            } else return -1;
            var a = -1;
            if (o) a = this._ocxObj.object.AppendEx(r, o); else a = this._ocxObj.object.Append(r);
            if (a > 0) {
                var h = new MapDocObj();
                h.url = r;
                h.id = a;
                h.name = t;
                h.ip = e;
                h.port = i;
                h.type = s;
                this._docObj.push(h);
                return a;
            }
        }
        return -1;
    };
    this.appendGeomByUrl = function(t, e, i) {
        this.assertOCX();
        var s = "http://" + e + ":" + i + "/igs/rest/g3d/GetDataByURL?gdbp=" + encodeURIComponent(t) + "&keepgeometry=true";
        return this._ocxObj.object.AppendGeomByUrl(s);
    };
    this.setSceneMapVisible = function(t, e) {
        this.assertOCX();
        if (e === false) this._ocxObj.object.SetSceneState(t, -1, EnumLayerState.StateUnVisble); else this._ocxObj.object.SetSceneState(t, -1, EnumLayerState.StateVisble);
    };
    this.addLayer2DByQuery = function(t, e, i) {
        this.assertOCX();
        if (i instanceof MapDocQuery) {
            var s = "query?guid=" + Math.random();
            if (i.geometryType && i.geometry) {
                s += "&geometryType=" + i.geometryType + "&geometry=" + i.geometry;
            }
            if (i.where) s += "&where=" + i.where;
            if (i.objectIds) s += "&objectIds=" + i.objectIds;
            if (i.pageCount) s += "&pageCount=" + i.pageCount;
            var o = "http://" + t + ":" + e + "/igs/rest/mrfs/docs/" + i.docName + "/" + i.mapIndex + "/" + i.layerID + "/" + s;
            var n = this._ocxObj.object.Append(o);
            if (n > 0) {
                var r = new MapDocObj();
                r.url = o;
                r.id = n;
                r.name = o;
                r.type = DocType.TypeLayer;
                this._docObj.push(r);
                return n;
            }
        }
    };
    this.removeDocByName = function(t) {
        var e = this.getDocByName(t);
        if (!e) return false;
        return this.removeDocById(e.id);
    };
    this.removeDocById = function(t) {
        this.assertOCX();
        var e = -1;
        for (var i = 0; i < this._docObj.length; i++) {
            if (this._docObj[i].id === t) {
                e = i;
            }
        }
        if (e > -1) {
            var s = this._ocxObj.object.Remove(t);
            if (s > -1) {
                this._docObj.splice(e, 1);
                return true;
            }
        }
    };
    this.removeAllDoc = function() {
        this.removeAll();
        this._docObj = [];
    };
    this.addTianditu = function(t) {
        this.assertOCX();
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
    };
    this.addGoogleMap = function(t) {
        this.assertOCX();
        if (this.getOverMapIDByName(t) !== -1) return -1;
        var e = this._ocxObj.object.Append("http://google/GetMap");
        if (e > 0) {
            this._overMapObj.push({
                id: e,
                name: t
            });
            return e;
        }
    };
    this.getOverMapIDByName = function(t) {
        for (var e = 0; e < this._overMapObj.length; e++) {
            if (this._overMapObj[e].name === t) return this._overMapObj[e].id;
        }
        return -1;
    };
    this.removeOverMap = function(t) {
        this.assertOCX();
        var e = [];
        for (var i = 0; i < this._overMapObj.length; i++) {
            if (this._overMapObj[i].id !== t) e.push(this._overMapObj[i]);
        }
        if (e.length < this._overMapObj.length) {
            this._ocxObj.object.Remove(t);
            this._overMapObj = e;
            return true;
        } else return false;
    };
    this.removeOverMapByName = function(t) {
        if (this.getOverMapIDByName(t) === -1) return false;
        return this.removeOverMap(this.getOverMapIDByName(t));
    };
    this.removeAllOverMap = function() {
        for (var t = 0; t < this._overMapObj.length; t++) {
            this._ocxObj.object.Remove(this._overMapObj[t].id);
        }
        this._overMapObj = [];
        return true;
    };
    this.setOverMapShowHide = function(t, e) {
        var i = this.getOverMapIDByName(t);
        if (i > 0) {
            if (e === false) this.setSceneState(i, 0, EnumLayerState.StateUnVisble); else this.setSceneState(i, 0, EnumLayerState.StateVisble);
        }
    };
    this.removeMap = function(t) {
        this.assertOCX();
        return this._ocxObj.object.Remove(t);
    };
    this.addCovering = function(t, e, i, s, o, n, r, a) {
        this.assertOCX();
        var h = this.getDocByName(t);
        if (h != null) return this._ocxObj.object.AppendCovering2(h.id, e, i, s, o, n, r, a); else return this._ocxObj.object.AppendCovering2(t, e, i, s, o, n, r, a);
    };
    this.addBubble = function(t) {
        this.assertOCX();
        if (t instanceof Bubble) {
            return this._ocxObj.object.AppendBubble(t.text, t.x, t.y, t.z, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.opacity, t.bgColor, t.bdColor, t.width, t.height, t.scale, t.attribute);
        }
        return -1;
    };
    this.addLabel = function(t) {
        this.assertOCX();
        if (t instanceof Label) {
            return this._ocxObj.object.AppendLabel(t.text, t.x, t.y, t.z, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.iconScale, t.farDist, t.nearDist, t.attribute);
        }
        return -1;
    };
    this.addLabelIcon = function(t) {
        this.assertOCX();
        if (t instanceof LabelIcon) {
            return this._ocxObj.object.AppendLabelIcon(t.text, t.x, t.y, t.z, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.iconUrl, t.iconXScale, t.iconYScale, t.farDist, t.nearDist, t.txtPos, t.attribute);
        }
        return -1;
    };
    this.addLabelIconByPick = function(t, e, i, s, o) {
        this.assertOCX();
        if (t instanceof LabelIcon) {
            return this._ocxObj.object.AppendLabelIconByPick(t.text, t.x, t.y, t.z, e, i, s, t.sElevation, t.fontname, t.fontsize, t.fontcolor, t.iconUrl, t.iconXScale, t.iconYScale, t.farDist, t.nearDist, t.txtPos, o, t.attribute);
        }
        return "";
    };
    this.addToolTip = function(t) {
        this.assertOCX();
        if (t instanceof ToolTip) {
            return this._ocxObj.object.AppendToolTip(t.text, t.x, t.y, t.z, t.sElevation, t.bdColor, t.width, t.height, t.attribute);
        }
        return -1;
    };
    this.GetLabelPos = function(t) {
        this.assertOCX();
        return this._ocxObj.object.GetLabelPos(t);
    };
    this.removeLabelByName = function(t) {
        this.assertOCX();
        this._ocxObj.object.RemoveLabel(t);
    };
    this.removeAllLabel = function() {
        this.assertOCX();
        this._ocxObj.object.RemoveLabelAll();
    };
    this.calXYLength = function(t, e, i, s, o, n, r) {
        this.assertOCX();
        return this._ocxObj.object.CalcLineLength(t, e, i, s, o, n, r);
    };
    this.calPolygonArea = function(t, e) {
        this.assertOCX();
        if (e) return this._ocxObj.object.CalcPolygonSurfaceArea(t, e); else return this._ocxObj.object.CalcPolygonSurfaceArea(t, 0);
    };
    this.addGraphic = function(t, e) {
        this.assertOCX();
        if (e instanceof DrawInfo) {
            return this._ocxObj.object.DrawElement(e.shapeType, t, e.bdColor, e.fillColor, e.transparence, e.linWid, e.lineType);
        }
        return -1;
    };
    this.addPoint = function(t, e, i, s) {
        if (!i) i = .1;
        if (!s) {
            s = new DrawInfo();
            s.shapeType = 3;
            s.bdColor = 4294901760;
            s.fillColor = 4294901760;
            s.transparence = 1;
            s.linWid = 1;
            s.lineType = 0;
        }
        var o = (t - i / 2).tostring() + "," + (e + i / 2).tostring() + ";" + (t + i / 2).tostring() + "," + (e - i / 2).tostring();
        return this.addGraphic(o, s);
    };
    this.jumpByPos = function(t, e, i, s, o, n) {
        this.assertOCX();
        this._ocxObj.object.Jump(t, e, i, s, o, n);
    };
    this.jumpByModel = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) {
            this._ocxObj.object.Jump2(s.id, e, i);
        }
    };
    this.jumpByRect = function(t, e, i, s) {
        this.assertOCX();
        this._ocxObj.object.JumpByRect(t, e, i, s);
    };
    this.convertPosToGeo = function(t, e, i) {
        this.assertOCX();
        return this._ocxObj.object.GetCartesianPosByGeodetic(t, e, i);
    };
    this.convertGeoToPos = function(t, e, i) {
        this.assertOCX();
        return this._ocxObj.object.GetGeodeticPosByCartesian(t, e, i);
    };
    this.convertLpToWp = function(t, e, i) {
        this.assertOCX();
        return this._ocxObj.object.LpToWp(t, e, i);
    };
    this.convertWpToLp = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.WpToLp(t, e);
    };
    this.convertScreenToWorldPos = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.GetWorldPosByScreen(t, e);
    };
    this.startPickLabel = function() {
        this.assertOCX();
        this._ocxObj.object.StartPickLabel();
    };
    this.stopPickLabel = function() {
        this.assertOCX();
        this._ocxObj.object.StopPickLabel();
    };
    this.startPickTool = function() {
        this.assertOCX();
        this._ocxObj.object.StartPickTool();
    };
    this.pickLabelByXY = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.PickLabelByXY(t, e);
    };
    this.stopPickTool = function() {
        this.assertOCX();
        this._ocxObj.object.StopPickTool();
    };
    this.remove = function(t) {
        this.assertOCX();
        return this._ocxObj.object.Remove(t);
    };
    this.removeAll = function() {
        this.assertOCX();
        return this._ocxObj.object.RemoveAll();
    };
    this.removeAllGraphic = function() {
        this.assertOCX();
        this._ocxObj.object.RemoveAllElement();
        this._drawElements = [];
    };
    this.removeGraphicByName = function(t) {
        this.assertOCX();
        this._ocxObj.object.RemoveElement(t);
        var e = [];
        for (var i = 0; i < this._drawElements.length; i++) {
            if (this._drawElements[i].id !== t) e.push(this._drawElements[i]);
        }
        if (e.length < this._drawElements.length) {
            this._drawElements = e;
        }
    };
    this.setElementVisible = function(t, e) {
        this.assertOCX();
        this._ocxObj.object.SetElementVisible(t, e);
    };
    this.getPntsByEleID = function(t) {
        for (var e = 0; e < this._drawElements.length; e++) {
            if (this._drawElements[e].id === t) return this._drawElements[e].pnts;
        }
        return "";
    };
    this.reset = function() {
        this.assertOCX();
        this._ocxObj.object.Reset();
    };
    this.getCameraInfo = function() {
        this.assertOCX();
        return this._ocxObj.object.GetCamera();
    };
    this.setCameraInfo = function(t, e, i, s, o, n, r, a) {
        this.assertOCX();
        return this._ocxObj.object.SetCamera(t, e, i, s, o, n, r, a);
    };
    this.getViewPos = function() {
        this.assertOCX();
        return this._ocxObj.object.GetViewPos();
    };
    this.setViewPos = function(t, e, i, s, o, n) {
        this.assertOCX();
        this._ocxObj.object.SetViewPos(t, e, i, s, o, n);
    };
    this.getViewRect = function() {
        this.assertOCX();
        return this._ocxObj.object.GetViewRect();
    };
    this.setViewRect = function(t, e, i, s) {
        this.assertOCX();
        this._ocxObj.object.SetViewRect(t, e, i, s);
    };
    this.setFullView = function(t, e, i, s, o, n, r, a, h, c) {
        this.assertOCX();
        this._ocxObj.object.SetFullView(t, e, i, s, o, n, r, a, h, c);
    };
    this.exitFullView = function() {
        this.assertOCX();
        this._ocxObj.object.ExitFullView();
    };
    this.setNavigateVisible = function(t) {
        this._isNavigateVisible = t;
        this.assertOCX();
        this._ocxObj.object.ShowNavigateTool(t);
    };
    this.getNavigateVisible = function() {
        return this._isNavigateVisible;
    };
    this.setPlantUIStateVisible = function(t) {
        this.assertOCX();
        this._isPlantUIStateVisible = t;
        this._ocxObj.object.ShowPlantUIState(t);
    };
    this.getPlantUIStateVisible = function() {
        return this._isPlantUIStateVisible;
    };
    this.setDebugGridVisible = function(t) {
        this.assertOCX();
        this._isDebugGrid = t;
        this._ocxObj.object.ShowDebugGrid(t);
    };
    this.getDebugGridVisible = function() {
        return this._isDebugGrid;
    };
    this.setGridNetVisible = function(t) {
        this.assertOCX();
        this._isGridNet = t;
        this._ocxObj.object.ShowGridNet(t);
    };
    this.getGridNetVisible = function() {
        return this._isGridNet;
    };
    this.setSceneTransparent = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) {
            return this._ocxObj.object.SetScenePropertySet(s.id, e, "Transparent:" + i);
        }
        return -1;
    };
    this.setShowPolygon = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) return this._ocxObj.object.SetScenePropertySet(s.id, e, "SetShowPolygon:" + i); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetShowPolygon:" + i);
    };
    this.setShowRect = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) return this._ocxObj.object.SetScenePropertySet(s.id, e, "SetShowRange:" + i); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetShowRange:" + i);
    };
    this.setLayerToTop = function(t, e) {
        this.assertOCX();
        var i = this.getDocByName(t);
        if (i != null) return this._ocxObj.object.SetScenePropertySet(i.id, e, "SetLayer2Top:true"); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetLayer2Top:true");
    };
    this.setLayerPriority = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) return this._ocxObj.object.SetScenePropertySet(s.id, e, "SetLayerPriority:" + i); else return this._ocxObj.object.SetScenePropertySet(t, e, "SetLayerPriority:" + i);
    };
    this.setShowPolygonByid = function(t, e, i) {
        this.assertOCX();
        if (t) {
            return this._ocxObj.object.SetScenePropertySet(t, e, "SetShowPolygon:" + i);
        }
    };
    this.getSceneNode = function(t, e, i, s) {
        this.assertOCX();
        return this._ocxObj.object.GetSceneNode(t, e, i, s);
    };
    this.getSceneProperty = function(t, e, i) {
        this.assertOCX();
        if (t) {
            return this._ocxObj.object.GetSceneProperty(t, e, i);
        }
        return -1;
    };
    this.startDrawTool = function(t) {
        this.assertOCX();
        if (t instanceof DrawInfo) {
            this._ocxObj.object.StartDrawTool(t.shapeType, t.bdColor, t.fillColor, t.transparence, t.linWid, t.lineType);
        }
    };
    this.stopDrawTool = function() {
        this.assertOCX();
        return this._ocxObj.object.StopDrawTool();
    };
    this.draw3DElement = function(t) {
        this.assertOCX();
        if (t instanceof Draw3DElementInfo) {
            var e = this._ocxObj.object.Draw3DElement(t.type, t.pnts, "libID:" + t.libID + ",symID:" + t.symID + ",fillClr:" + t.fillClr + ",transparent:" + t.transparent, t.att);
            if (e > 0) this._draw3DElements.push(e);
            return e;
        }
        return "";
    };
    this.remove3DElement = function(t) {
        this.assertOCX();
        return this._ocxObj.object.Remove3DElement(t);
    };
    this.set3DElementVisible = function(t, e) {
        this.assertOCX();
        this._ocxObj.object.Set3DElementVisible(t, e);
    };
    this.removeAll3DElement = function() {
        for (var t = 0; t < this._draw3DElements.length; t++) {
            this._ocxObj.object.Remove3DElement(this._draw3DElements[t]);
        }
        this._draw3DElements = [];
    };
    this.startAnalyzeTool = function(t) {
        this.assertOCX();
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
    this.stopAnalyzeTool = function(t) {
        this.assertOCX();
        this._ocxObj.object.StopTool(t);
    };
    this.getAnalyseType = function() {
        return this._analyseOper;
    };
    this.setAnalyseType = function(t) {
        this._analyseOper = t;
    };
    this.getAnalyseInfo = function() {
        return this._analyseInfo;
    };
    this.setAnalyseInfo = function(t) {
        this._analyseInfo = t;
    };
    this.clearCacheData = function() {
        this.assertOCX();
        return this._ocxObj.object.ClearCacheData();
    };
    this.getPickUpGeoPos = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.GetPickUpGeoPos(t, e);
    };
    this.enableInputObject = function(t) {
        this.assertOCX();
        this._ocxObj.object.EnableInputObject(t);
    };
    this.getViewMode = function() {
        this.assertOCX();
        return this._ocxObj.object.Mode;
    };
    this.goToGlobeMode = function(t) {
        this.assertOCX();
        this._ocxObj.object.Mode = 1;
        if (t === true) {
            var e = this.removeAll();
            var i = [];
            for (var s = 0; s < this._docObj.length; s++) {
                var o = new MapDocObj();
                o.url = this._docObj[s].url;
                o.id = this._docObj[s].id;
                o.name = this._docObj[s].name;
                o.ip = this._docObj[s].ip;
                o.port = this._docObj[s].port;
                o.type = this._docObj[s].type;
                if (this.removeDocById(o.id) > 0) {
                    i.push(o);
                }
            }
            this._docObj = [];
            for (var s = 0; s < i.length; s++) {
                var n = this.addDoc(i[s].name, i[s].ip, i[s].port, i[s].type);
                if (n === -1) {
                    console.log("转为球面模式时，重新添加文档数据" + i[s].name + "失败");
                }
            }
        }
    };
    this.goToSurfaceMode = function(t) {
        this.assertOCX();
        this._ocxObj.object.Mode = 2;
        if (t === true) {
            var e = [];
            for (var i = 0; i < this._docObj.length; i++) {
                var s = new MapDocObj();
                s.url = this._docObj[i].url;
                s.id = this._docObj[i].id;
                s.name = this._docObj[i].name;
                s.ip = this._docObj[i].ip;
                s.port = this._docObj[i].port;
                s.type = this._docObj[i].type;
                if (this.removeDocById(s.id) > 0) {
                    e.push(s);
                }
            }
            this._docObj = [];
            for (var i = 0; i < e.length; i++) {
                var o = this.addDoc(e[i].name, e[i].ip, e[i].port, e[i].type);
                if (o === -1) {
                    console.log("转为地表模式时，重新添加文档数据" + e[i].name + "失败");
                }
            }
        }
    };
    this.setSceneState = function(t, e, i) {
        this.assertOCX();
        return this._ocxObj.object.SetSceneState(t, e, i);
    };
    this.setLayerState = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) {
            return this._ocxObj.object.SetSceneState(s.id, e, i);
        }
        return false;
    };
    this.startPathNavEdit = function() {
        this.assertOCX();
        this._ocxObj.object.ExcuteTool("路径漫游", "路径编辑");
    };
    this.startPathNavShow = function() {
        this.assertOCX();
        this._ocxObj.object.ExcuteTool("路径漫游", "路径漫游");
    };
    this.zoomIn = function(t) {
        this.zoom(t, .7);
    };
    this.zoomOut = function(t) {
        this.zoom(t, 1.3);
    };
    this.zoom = function(t, e) {
        this.assertOCX();
        var i = this._ocxObj.object.GetViewPos().split(",");
        if (i.length > 4) {
            if (t && typeof t === "number") e = 1 / t;
            if (this._ocxObj.object.Mode === 1) this._ocxObj.object.SetViewPos(i[0], i[1], i[2] * e, i[3], i[4], i[5]); else this._ocxObj.object.SetViewPos(i[0], i[1], i[2], i[3] * e, i[4], i[5]);
        }
    };
    this.createPathFly = function(t, e, i, s) {
        this.assertOCX();
        this._ocxObj.object.CreatePathFly(t, e, i, s);
    };
    this.deletePathFly = function() {
        this.assertOCX();
        this._ocxObj.object.DeletePathFly();
    };
    this.getAnimFlyByName = function(t) {
        for (var e = 0; e < this._animFlyElements.length; e++) {
            if (this._animFlyElements[e].name === t) return this._animFlyElements[e].id;
        }
        return -1;
    };
    this.createAnimFly = function(t, e, i, s, o, n) {
        if (this.getAnimFlyByName(t) > 0) return -1;
        this.assertOCX();
        var r = this._ocxObj.object.CreateAnimFly(e, i, s, o, n);
        if (r > 0) {
            this._animFlyElements.push({
                name: t,
                id: r
            });
            return r;
        }
    };
    this.controlAnimFlyByName = function(t, e) {
        this.assertOCX();
        for (var i = 0; i < this._animFlyElements.length; i++) {
            if (this._animFlyElements[i].name === t) {
                return this._ocxObj.object.SetAnimFlyOper(this._animFlyElements[i].id, e);
            }
        }
        return -1;
    };
    this.controlAllAnimFly = function(t) {
        this.assertOCX();
        for (var e = 0; e < this._animFlyElements.length; e++) {
            this._ocxObj.object.SetAnimFlyOper(this._animFlyElements[e].id, t);
        }
    };
    this.removeAnimFlyByName = function(t) {
        this.assertOCX();
        var e = [];
        var i = -1;
        for (var s = 0; s < this._animFlyElements.length; s++) {
            if (this._animFlyElements[s].name != t) {
                e.push(this._animFlyElements[s]);
            } else i = this._animFlyElements[s].id;
        }
        if (e.length < this._animFlyElements.length && i > 0) {
            var o = this._ocxObj.object.DeleteAnimFly(i);
            if (o) {
                this._animFlyElements = e;
                return true;
            }
        }
        return false;
    };
    this.removeAllAnimFly = function() {
        this.assertOCX();
        for (var t = 0; t < this._animFlyElements.length; t++) {
            this._ocxObj.object.DeleteAnimFly(this._animFlyElements[t].id);
        }
        this._animFlyElements = [];
    };
    this.setAnimFlyParam = function(t, e, i) {
        this.assertOCX();
        this._ocxObj.object.SetAnimFlyParam(t, e, i);
    };
    this.beginRecVideo = function(t, e, i, s) {
        this.assertOCX();
        return this._ocxObj.object.BeginRecVideo(t, e, i, s);
    };
    this.endRecVideo = function() {
        this.assertOCX();
        this._ocxObj.object.EndRecVideo();
    };
    this.outPutImage = function(t, e, i, s, o, n, r, a) {
        this.assertOCX();
        return this._ocxObj.object.OutImage(t, e, i, s, o, n, r, a);
    };
    this.getTerrainEle = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.GetTerrainHei(t, e);
    };
    this.setCachesType = function(t) {
        this.assertOCX();
        this._ocxObj.object.SetCachesType(t);
    };
    this.setCacheSize = function(t, e) {
        this.assertOCX();
        this._ocxObj.object.SetMaxLayerCacheSz(t, e);
    };
    this.beginAutoPlay = function(t, e, i) {
        this.assertOCX();
        this._ocxObj.object.AutoPlay(t, e, i);
    };
    this.setUrlHandler = function(t, e) {
        this.assertOCX();
        this._ocxObj.object.SetUrlHandler(t, e);
    };
    this.startModelDiplay = function(t, e, i) {
        this.assertOCX();
        if (i === false) this._ocxObj.object.StartCustomDisplay(t, e, false); else this._ocxObj.object.StartCustomDisplay(t, e, true);
    };
    this.stopModelDisplayAll = function() {
        this.assertOCX();
        this._ocxObj.object.StopCustomDisplayAll();
    };
    this.stopModelDisplay = function(t) {
        this.assertOCX();
        this._ocxObj.object.StopCustomDisplay(t);
    };
    this.appendKMLByURL = function(t, e) {
        this.assertOCX();
        var i = this._ocxObj.object.AppendKMLByURL(t, e);
        this._xmlLayerObj.push({
            id: i,
            name: e,
            type: "kml"
        });
        return i;
    };
    this.appendKMLByXML = function(t, e) {
        this.assertOCX();
        var i = this._ocxObj.object.AppendKMLByXML(t, e);
        this._xmlLayerObj.push({
            id: i,
            name: e,
            type: "kml"
        });
        return i;
    };
    this.appendGMLByURL = function(t, e) {
        this.assertOCX();
        var i = this._ocxObj.object.AppendGMLByURL(t, e);
        this._xmlLayerObj.push({
            id: i,
            name: e,
            type: "gml"
        });
        return i;
    };
    this.appendGMLByXML = function(t, e) {
        this.assertOCX();
        var i = this._ocxObj.object.AppendGMLByXML(t, e);
        this._xmlLayerObj.push({
            id: i,
            name: e,
            type: "gml"
        });
        return i;
    };
    this.removeXMLByName = function(t) {
        this.assertOCX();
        var e = [];
        for (var i = 0; i < this._xmlLayerObj.length; i++) {
            if (this._xmlLayerObj[i].name !== t) e.push(this._overMapObj[i]); else this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[i].id);
        }
        this._xmlLayerObj = e;
    };
    this.removeXMLByType = function(t) {
        this.assertOCX();
        var e = [];
        for (var i = 0; i < this._xmlLayerObj.length; i++) {
            if (this._xmlLayerObj[i].type !== t) e.push(this._overMapObj[i]); else this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[i].id);
        }
        this._xmlLayerObj = e;
    };
    this.removeAllXMLLayer = function() {
        this.assertOCX();
        for (var t = 0; t < this._xmlLayerObj.length; t++) {
            this._ocxObj.object.RemoveXMLByName(this._xmlLayerObj[t].id);
        }
        this._xmlLayerObj = [];
    };
    this.setEnvLight = function(t) {
        this.assertOCX();
        this._ocxObj.object.SetEnvLight(t);
    };
    this.getEnvLight = function() {
        this.assertOCX();
        return this._ocxObj.object.GetEnvLight();
    };
    this.setSky = function(t, e, i, s, o) {
        this.assertOCX();
        this._ocxObj.object.SetSky(t, e, i, s, o);
    };
    this.getSky = function() {
        this.assertOCX();
        return this._ocxObj.object.GetSky();
    };
    this.setFog = function(t, e, i, s, o) {
        this.assertOCX();
        this._ocxObj.object.SetFog(t, e, i, s, o);
    };
    this.getFog = function() {
        this.assertOCX();
        return this._ocxObj.object.GetFog();
    };
    this.saveEnvParam = function() {
        this.assertOCX();
        this._ocxObj.object.SaveEnvParam();
    };
    this.createXYZSurface = function(t, e, i) {
        if (t.split(",").length !== 6) return 0;
        var s = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByXYZ, t, "axis:" + e + ";leftvalue:" + i + ";rightvalue:" + i, "");
        var o = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (s) return this._ocxObj.object.AppendGeom(s, o);
        return -1;
    };
    this.exeCutByXYZSurface = function(t, e, i, s, o, n, r, a, h, c) {
        var l = new WFKeyValueMap();
        l.add("orgSFClsStr", t);
        l.add("leftSFClsStr", e);
        l.add("rightSFClsStr", i);
        l.add("type", s);
        l.add("leftValue", o);
        l.add("rigthValue", n);
        this.exeWorkflow(h, c, 600322, l.map, r, a);
    };
    this.createABSurface = function(t, e, i) {
        if (t.split(",").length !== 6) return 0;
        var s = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByAB, t, "avalue:" + e + ";bvalue:" + i, "");
        var o = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (s) return this._ocxObj.object.AppendGeom(s, o);
        return -1;
    };
    this.exeCutByABSurface = function(t, e, i, s, o, n, r, a, h, c) {
        var l = new WFKeyValueMap();
        l.add("orgSFClsStr", t);
        l.add("leftSFClsStr", e);
        l.add("rightSFClsStr", i);
        l.add("AValue", s);
        l.add("BValue", o);
        l.add("scale", n);
        this.exeWorkflow(h, c, 600321, l.map, r, a);
    };
    this.createCyliner = function(t, e, i, s, o) {
        if (t.split(",").length !== 6) return 0;
        var n = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Cyliner, t, "axis:" + e + ";radius:" + o + ";xcenter:" + i + ";ycenter:" + s, "");
        var r = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (n) return this._ocxObj.object.AppendGeom(n, r);
        return -1;
    };
    this.exeCutByCyliner = function(t, e, i, s, o, n, r, a, h, c, l, u) {
        var f = new WFKeyValueMap();
        f.add("orgSFClsStr", t);
        f.add("leftSFClsStr", e);
        f.add("rightSFClsStr", i);
        f.add("type", s);
        f.add("centerX", o);
        f.add("centerY", n);
        f.add("centerZ", r);
        f.add("radius", a);
        this.exeWorkflow(l, u, 600325, f.map, h, c);
    };
    this.createBox = function(t, e, i, s, o, n, r) {
        if (t.split(",").length !== 6) return 0;
        var a = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Box, t, "axis:" + e + ";xcenter:" + i + ";ycenter:" + s + ";zcenter:" + o + ";length:" + n + ";width:" + r, "");
        var h = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (a) return this._ocxObj.object.AppendGeom(a, h);
        return -1;
    };
    this.exeCutByBox = function(t, e, i, s, o, n, r, a, h, c, l, u, f) {
        var p = new WFKeyValueMap();
        p.add("orgSFClsStr", t);
        p.add("leftSFClsStr", e);
        p.add("rightSFClsStr", i);
        p.add("type", s);
        p.add("centerX", o);
        p.add("centerY", n);
        p.add("centerZ", r);
        p.add("length", a);
        p.add("width", h);
        this.exeWorkflow(u, f, 600326, p.map, c, l);
    };
    this.createPipe = function(t, e, i, s, o, n, r, a) {
        if (t.split(",").length !== 6) return null;
        var h = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_Pipe, t, "secType:" + e + ";radius:" + s + ";secNum:" + o + ";depth:" + n + ";length:" + r + ";height:" + a + ";", i);
        var c = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (h) return this._ocxObj.object.AppendGeom(h, c);
        return -1;
    };
    this.exeCutByPipe = function(t, e, i, s, o, n, r, a, h, c, l, u, f, p) {
        var d = new WFKeyValueMap();
        d.add("orgSFClsStr", t);
        d.add("leftSFClsStr", e);
        d.add("rightSFClsStr", i);
        d.add("pnts", s);
        d.add("type", o);
        d.add("radius", n);
        d.add("number", r);
        d.add("depth", a);
        d.add("length", h);
        d.add("height", c);
        this.exeWorkflow(f, p, 600327, d.map, l, u);
    };
    this.exeWorkflow = function(t, e, i, s, o, n) {
        t = t || "localhost";
        e = e || "6163";
        var r = "http://" + t + ":" + e + "/igs/rest/mrfws/execute/" + i + "?f=json";
        var a = new Util().toJSON(s);
        if (window.XDomainRequest && !/MSIE 10.0/.test(window.navigator.userAgent)) {
            var h = new window.XDomainRequest();
            h.onload = function() {
                var t = $.parseJSON(this.responseText);
                o && o(t);
            };
            h.onerror = function() {
                n && n(h);
            };
            h.open("post", r);
            h.send(a);
        } else {
            $.support.cors = true;
            $.ajax({
                url: r,
                type: "post",
                data: a,
                dataType: "json",
                success: function(t) {
                    o && o(t);
                },
                error: function(t) {
                    n && n(t);
                }
            });
        }
    };
    this.createCutSurByLin = function(t, e) {
        if (t.split(",").length !== 6) return 0;
        var i = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_SurByLin, t, "", e);
        var s = '{ "ang" : 0.0, "endclr" : 16256, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 1, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (i) return this._ocxObj.object.AppendGeom(i, s);
        return -1;
    };
    this.createCutEntityByLin = function(t, e, i, s) {
        if (t.split(",").length !== 6) return 0;
        var o = this._ocxObj.object.CreateCutGeomtry(EnumMdlCutType.MdlCut_EntityByLin, t, "height:" + e + ";depth:" + i, s);
        var n = '{ "ang" : 0.0, "endclr" : 25600, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 0, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
        if (o) return this._ocxObj.object.AppendGeom(o, n);
        return -1;
    };
    this.exeCutByVerticalSur = function(t, e, i, s, o, n, r, a, h, c, l, u, f, p, d) {
        var b = new WFKeyValueMap();
        b.add("orgSFClsStr", t);
        b.add("points", e);
        b.add("lineSFClsStr", i);
        b.add("angleX", s);
        b.add("angleY", o);
        b.add("closeLine", n);
        b.add("depth", r);
        b.add("saveModal", a);
        b.add("resultModalClsPrefix", h);
        b.add("saveSection", c);
        b.add("resultSectionClsPrefix", l);
        this.exeWorkflow(p, d, 600329, b.map, u, f);
    };
    this.exeCutByMultiXYZSurface = function(t, e, i, s, o, n, r, a, h, c, l, u) {
        var f = new WFKeyValueMap();
        f.add("orgSFClsStr", t);
        f.add("types", e);
        f.add("leftValues", i);
        f.add("rigthValues", s);
        f.add("saveModal", o);
        f.add("resultModalClsPrefix", n);
        f.add("saveSection", r);
        f.add("resultSectionClsPrefix", a);
        this.exeWorkflow(l, u, 600328, f.map, h, c);
    };
    this.executeTool = function(t, e) {
        this.assertOCX();
        this._ocxObj.object.ExcuteTool(t, e);
    };
    this.setSceneRatio = function(t, e, i) {
        this.assertOCX();
        var s = this.getDocByName(t);
        if (s != null) {
            return this._ocxObj.object.SetScenePropertySet(s.id, e, i);
        }
        return -1;
    };
    this.extendFoldLintoBoxF = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.ExtendFoldLintoBoxF(t, e);
    };
    this.preLoadCache = function(t, e, i, s) {
        this.assertOCX();
        return this._ocxObj.object.PreLoadCache(t, e, i, s);
    };
    this.addEventListener = function(t, e, i) {
        this._events.register(t, e, i);
    };
    this.removeEventListener = function(t, e) {
        this._events.unregister(t, e);
    };
    this._onFinishedAnalyze = function() {
        this._events.dispatchEvent(EventType.FinishedAnalyze, arguments);
        if (arguments[0]) {
            var t = new Util().evalJSON(arguments[0]);
            var e = new Util().convertObjectToAnalyseTypeInfo(t);
            this.setAnalyseInfo(e);
        }
    };
    this._onFinishedDraw = function() {
        this.currentElePnts = arguments[0];
        this._events.dispatchEvent(EventType.FinishedDraw, arguments);
    };
    this._onPickLabel = function() {
        this._events.dispatchEvent(EventType.PickLabel, arguments);
    };
    this._onPickModel = function() {
        this._events.dispatchEvent(EventType.PickModel, arguments);
    };
    this._onKeyDown = function() {
        this._events.dispatchEvent(EventType.KeyDown, arguments);
    };
    this._onKeyUp = function() {
        this._events.dispatchEvent(EventType.KeyUp, arguments);
    };
    this._onMouseMove = function() {
        this._events.dispatchEvent(EventType.MouseMove, arguments);
    };
    this._onMouseWheel = function() {
        this._events.dispatchEvent(EventType.MouseWheel, arguments);
    };
    this._onMButtonDown = function() {
        this._events.dispatchEvent(EventType.MButtonDown, arguments);
    };
    this._onMButtonUp = function() {
        this._events.dispatchEvent(EventType.MButtonUp, arguments);
    };
    this._onJumped = function() {
        this._events.dispatchEvent(EventType.Jumped, arguments);
    };
    this._onPickElement = function() {
        this._events.dispatchEvent(EventType.PickElement, arguments);
    };
    this._onLButtonDblClk = function() {
        this._events.dispatchEvent(EventType.LButtonDblClk, arguments);
    };
    this._onLButtonDown = function() {
        this._events.dispatchEvent(EventType.LButtonDown, arguments);
    };
    this._onLButtonUp = function() {
        this._events.dispatchEvent(EventType.LButtonUp, arguments);
    };
    this._onRButtonDblClk = function() {
        this._events.dispatchEvent(EventType.RButtonDblClk, arguments);
    };
    this._onRButtonDown = function() {
        this._events.dispatchEvent(EventType.RButtonDown, arguments);
    };
    this._onRButtonUp = function() {
        this._events.dispatchEvent(EventType.RButtonUp, arguments);
    };
    this._onFinishedAddDoc = function() {
        this._events.dispatchEvent(EventType.FinishedAddDoc, arguments);
    };
    this._onFinishedLoadCache = function() {
        this._events.dispatchEvent(EventType.FinishedLoadCache, arguments);
    };
    this._onCreationComplete = function() {
        this.setPlantUIStateVisible(true);
        this._events.dispatchEvent(EventType.CreationComplete, arguments);
    };
    this.setTimeOut = function(t) {
        this.assertOCX();
        return this._ocxObj.object.SetTimeOut(t);
    };
    this.isTerrainLoaded = function() {
        this.assertOCX();
        return this._ocxObj.object.IsTerrainLoaded();
    };
    this.queryG3DFeature = function(t, e, i, s) {
        var o = t;
        if (!t) {
            alert("调用queryG3DFeature，查询参数g3DDocQuery不能为空");
            return;
        }
        var n;
        if (o.gdbp) {
            n = "gdbp=" + o.gdbp;
        } else {
            n = "docName=" + o.docName + "&layerindex=" + o.layerIndex;
        }
        if (o.geometryType && o.geometry) {
            n += "&geometryType=" + o.geometryType + "&geometry=" + o.geometry;
        }
        n += "&f=json";
        if (o.where) n += "&where=" + o.where;
        if (o.objectIds) n += "&objectIds=" + o.objectIds;
        if (o.structs) n += "&structs=" + o.structs;
        if (o.page) n += "&page=" + o.page;
        if (o.pageCount) n += "&pageCount=" + o.pageCount;
        if (o.rule) n += "&rule=" + o.rule;
        var r = "http://" + o.serverIp + ":" + o.serverPort + "/igs/rest/g3d/getFeature";
        var a = null;
        if (s && s.toLowerCase() === "post") {
            a = n;
        } else {
            r = r + "?" + n;
        }
        Util.corsAjax(r, s, a, function(t, i) {
            e && e(t, i, o.layerIndex);
        }, i, "json", this.proxy);
    };
    this.pickModel = function(t, e) {
        var i = new G3DDocQuery();
        $.extend(i, e);
        i.structs = '{"IncludeAttribute":true,"IncludeGeometry":true,"IncludeWebGraphic":false}';
        i.pageCount = 1;
        i.objectIds = 1;
        var s = this;
        this.queryG3DFeature(i, function(t) {
            if (t && t.SFEleArray && t.SFEleArray[0] && t.SFEleArray[0].fGeom) {
                var e = t.SFEleArray[0].fGeom;
                var i = '{ "ang" : 0.0, "endclr" : 16256, "fillclr" : 25600,' + '"fillmode" : 0, "fullpatflg" : 0, "libID" : 1, "outpenw" : 0.0, "ovprnt" : 3, ' + '"patID" : -1, "patclr" : 0, "pathei" : 0.0, "patwid" : 0.0,  "type" : "reginfo"}';
                if (e.SurfaceGeom || e.EntityGeom) {
                    var o = function(t) {
                        var e = new G3DSurfaceObject();
                        e.pntcount = t.points.length;
                        e.dots = t.points;
                        e.trianglecount = t.triangles.length / 3;
                        e.triangles = t.triangles;
                        e.texturelayernum = e.texturelayerind = 0;
                        e.colors = t.colors;
                        e.texturepos = null;
                        e.topo = t.topos;
                        e.normals = t.normalVectors;
                        return e;
                    };
                    var n = new G3DGeometryObject();
                    n.items = [];
                    if (e.SurfaceGeom) {
                        n.type = e.SurfaceGeom.length === 1 ? "anysurface" : "multisurface";
                        for (var r = 0; r < e.SurfaceGeom.length; r++) {
                            n.items.push(o(e.SurfaceGeom[r]));
                        }
                    } else if (e.EntityGeom) {
                        n.type = "multisurface";
                        for (var r = 0; r < e.EntityGeom.length; r++) {
                            var a = e.EntityGeom[r];
                            for (var h = 0; h < a.surfaces.length; h++) {
                                n.items.push(o(a.surfaces[h]));
                            }
                        }
                        n.count = n.items.length;
                    }
                    s.appendGeom(new Util().toJSON(n), i);
                }
            }
        }, function() {
            console && console.log("查询要素失败");
        }, "post");
    };
    this.getDocInfo = function(t, e, i, s, o) {
        s = s || "127.0.0.1";
        o = o || 6163;
        var n = "http://" + s + ":" + o + "/igs/rest/g3d/" + t + "/GetDocInfo?f=json";
        Util.corsAjax(n, "get", null, e, i, "json", this.proxy);
    };
    this.highlightFeature = function(t, e, i, s, o, n) {
        var r = this;
        o = o || "127.0.0.1";
        n = n || 6163;
        this.getDocInfo(t, function(t) {
            var o = null;
            if (t && t.sceneInfos && t.sceneInfos[0] && t.sceneInfos[0].layers) {
                for (var n = 0; n < t.sceneInfos[0].layers.length; n++) {
                    if (t.sceneInfos[0].layers[n].layerIndex === parseInt(i)) {
                        o = t.sceneInfos[0].layers[n].layerRenderIndex;
                        break;
                    }
                }
            }
            if (o != null) {
                if ($.isArray(s)) {
                    for (var a = 0; a < s.length; a++) {
                        r.startModelDiplay("LayerIndex:" + o + ",ObjID:" + s[a] + ",SddHandle:" + e, 2, true);
                    }
                } else {
                    r.startModelDiplay("LayerIndex:" + o + ",ObjID:" + s + ",SddHandle:" + e, 2, true);
                }
            }
        }, null, o, n);
    };
    this.appendGeom = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.AppendGeom(t, e);
    };
    this.createBoxBy2Sides = function(t, e) {
        this.assertOCX();
        return this._ocxObj.object.CreateBox(t, e);
    };
    this.genDenseLine = function(t, e) {
        return this._ocxObj.object.GenDenseLine(t, e);
    };
    this.addParticle = function(t) {
        return this._ocxObj.object.AddParticle(t);
    };
    this.addWaterElement = function(t, e) {
        return this._ocxObj.object.AddWaterElement(t, e);
    };
    this.updateWaterElement = function(t, e, i) {
        return this._ocxObj.object.UpdateWaterElement(t, e, i);
    };
    this.updateParticle = function(t, e) {
        return this._ocxObj.object.UpdateParticle(t, e);
    };
    this.getCachePath = function() {
        return this._ocxObj.object.GetCachePath();
    };
    this.setCachePath = function(t) {
        return this._ocxObj.object.SetCachePath(t);
    };
    this.setFsaaCurrentValue = function(t) {
        return this._ocxObj.object.SetFsaaCurrentValue(t);
    };
    this.getFsaaInfo = function() {
        return this._ocxObj.object.GetFsaaInfo();
    };
    this.setStereoType = function(t) {
        return this._ocxObj.object.SetStereoType(t);
    };
    this.getStereoType = function() {
        return this._ocxObj.object.GetStereoType();
    };
    this.createSceneProjector = function(t, e, i) {
        return this._ocxObj.object.CreateSceneProjector(t, e, i);
    };
    this.deleteSceneProjector = function(t) {
        return this._ocxObj.object.DeleteSceneProjector(t);
    };
    this.playSPVideo = function(t) {
        return this._ocxObj.object.PlaySPVideo(t);
    };
    this.pauseSPVideo = function(t) {
        return this._ocxObj.object.PauseSPVideo(t);
    };
    this.setSPVideoIsLoop = function(t, e) {
        return this._ocxObj.object.SetSPVideoIsLoop(t, e);
    };
    this.getProjCameraInf = function(t) {
        return this._ocxObj.object.GetProjCameraInf(t);
    };
    this.resetSPVideo = function(t) {
        return this._ocxObj.object.ResetSPVideo(t);
    };
    this.setSPScreenFov = function(t, e) {
        return this._ocxObj.object.SetSPScreenFov(t, e);
    };
    this.setSPScreenTilt = function(t, e) {
        return this._ocxObj.object.SetSPScreenTilt(t, e);
    };
    this.setSPCamDirHori = function(t, e) {
        return this._ocxObj.object.SetSPCamDirHori(t, e);
    };
    this.setSPCamDirVerti = function(t, e) {
        return this._ocxObj.object.SetSPCamDirVerti(t, e);
    };
    this.setSPCamPosition = function(t, e, i, s) {
        return this._ocxObj.object.SetSPCamPosition(t, e, i, s);
    };
    this.setSPClipPlane = function(t, e) {
        return this._ocxObj.object.SetSPClipPlane(t, e);
    };
    this.getSPClipPlane = function(t) {
        return this._ocxObj.object.GetSPClipPlane(t);
    };
    this.setSPDrawBound = function(t, e) {
        return this._ocxObj.object.SetSPDrawBound(t, e);
    };
    this.isSPDrawBound = function(t) {
        return this._ocxObj.object.IsSPDrawBound(t);
    };
    this.getSPVideoFrameNum = function(t) {
        return this._ocxObj.object.GetSPVideoFrameNum(t);
    };
    this.getSPVideoCurrentPos = function(t) {
        return this._ocxObj.object.GetSPVideoCurrentPos(t);
    };
    this.setSPVideoPos = function(t, e) {
        return this._ocxObj.object.SetSPVideoPos(t, e);
    };
    this.loadSPFromFile = function(t) {
        return this._ocxObj.object.LoadSPFromFile(t);
    };
    this.saveSPToFile = function(t) {
        return this._ocxObj.object.SaveSPToFile(t);
    };
    this.setStereoMode = function(t) {
        return this._ocxObj.object.SetStereoMode(t);
    };
    this.getStereoMode = function() {
        return this._ocxObj.object.GetStereoMode();
    };
    this.setEyesSpacing = function(t) {
        return this._ocxObj.object.SetEyesSpacing(t);
    };
    this.getEyesSpacing = function() {
        return this._ocxObj.object.GetEyesSpacing();
    };
    this.setFocalLength = function(t) {
        return this._ocxObj.object.SetFocalLength(t);
    };
    this.getFocalLength = function() {
        return this._ocxObj.object.GetFocalLength();
    };
    this.queryPolygons = function(t, e, i, s, o, n) {
        var r = new G3DDocQuery();
        r.structs = '{"IncludeAttribute":true,"IncludeGeometry":true,"IncludeWebGraphic":false}';
        r.gdbp = t;
        r.geometryType = "point";
        i = i || 1e-4;
        r.geometry = e.x + "," + e.y + "," + i;
        if (s) r.serverIp = s;
        if (o) r.serverPort = o;
        var a = function(t) {
            var e = t.Rings;
            var i = {
                type: "polygon"
            };
            i.nelen = e.length;
            i.ne = [];
            i.dots = [];
            for (var s = 0; s < e.length; s++) {
                var o = 0;
                for (var n = 0; n < e[s].Arcs.length; n++) {
                    var r = e[s].Arcs[n].Dots;
                    for (var a = 0; a < r.length; a++) {
                        o++;
                        i.dots.push({
                            x: r[a].x,
                            y: r[a].y
                        });
                    }
                }
                i.ne.push(o);
            }
            return i;
        };
        this.queryG3DFeature(r, function(t) {
            if (t && t.SFEleArray && t.SFEleArray.length > 0) {
                for (var e = 0; e < t.SFEleArray.length; e++) {
                    if (t.SFEleArray[e].fGeom && t.SFEleArray[e].fGeom.RegGeom) {
                        var i = t.SFEleArray[e].fGeom.RegGeom;
                        var s = i.length;
                        var o = [];
                        if (s === 1) {
                            var r = a(i[0]);
                            o.push(r);
                        }
                        if (s > 1) {
                            for (var h = 0; h < s; h++) {
                                o.push(a(i.RegGeom[h]));
                            }
                        }
                        n && n(o, t);
                    }
                }
            }
        }, function() {
            console && console.log("查询要素失败");
        }, "post");
    };
    this.polygonProjector = function(t, e, i, s) {
        t = t || 200;
        e = e || 1;
        i = i || 50;
        var o = {
            maxSenceZ: t,
            projectorType: e,
            transparence: i,
            polygon: s
        };
        return this._ocxObj.object.PolygonProjector("Add", new Util().toJSON(o));
    };
    this.deleteAllPolygonProjector = function() {
        return this._ocxObj.object.PolygonProjector("DeleteAll", "");
    };
};

var Util = function() {
    this.isIE = /(Trident)|(Edge)/.test(navigator.userAgent);
    var escape = /["\\\x00-\x1f\x7f-\x9f]/g;
    var meta = {
        "\b": "\\b",
        "\t": "\\t",
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
        var e, i, s, o, n = typeof t;
        if (n === "undefined") {
            return undefined;
        }
        if (n === "number" || n === "boolean") {
            return String(t);
        }
        if (n === "string") {
            return this.quoteString(t);
        }
        if (typeof t.toJSON === "function") {
            return this.toJSON(t.toJSON());
        }
        if (n === "date") {
            var r = t.getUTCMonth() + 1, a = t.getUTCDate(), h = t.getUTCFullYear(), c = t.getUTCHours(), l = t.getUTCMinutes(), u = t.getUTCSeconds(), f = t.getUTCMilliseconds();
            if (r < 10) {
                r = "0" + r;
            }
            if (a < 10) {
                a = "0" + a;
            }
            if (c < 10) {
                c = "0" + c;
            }
            if (l < 10) {
                l = "0" + l;
            }
            if (u < 10) {
                u = "0" + u;
            }
            if (f < 100) {
                f = "0" + f;
            }
            if (f < 10) {
                f = "0" + f;
            }
            return '"' + h + "-" + r + "-" + a + "T" + c + ":" + l + ":" + u + "." + f + 'Z"';
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
                    n = typeof i;
                    if (n === "number") {
                        s = '"' + i + '"';
                    } else if (n === "string") {
                        s = this.quoteString(i);
                    } else {
                        continue;
                    }
                    n = typeof t[i];
                    if (n !== "function" && n !== "undefined") {
                        o = this.toJSON(t[i]);
                        e.push(s + ":" + o);
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

Util.corsAjax = function(t, e, i, s, o, n, r) {
    n = n || "json";
    if (r) {
        t = r + "?request=" + encodeURIComponent(t);
        var a = {
            url: t,
            type: e,
            dataType: n,
            success: function(t, e) {
                s && s(t, e);
            },
            error: function(t) {
                o && o(t);
            }
        };
        if (e.toLowerCase() === "post") {
            a.data = i;
        }
        $.ajax(a);
        return;
    }
    e = e || "get";
    if (window.XDomainRequest && !/MSIE 10.0/.test(window.navigator.userAgent)) {
        var h = new window.XDomainRequest();
        h.onload = function() {
            var t = n === "json" ? $.parseJSON(this.responseText) : this.responseText;
            s && s(t);
        };
        h.onerror = function() {
            o && o(h);
        };
        h.open(e, t);
        if (e.toLowerCase() === "post") {
            h.send(i);
        } else {
            h.send();
        }
    } else {
        $.support.cors = true;
        var a = {
            url: t,
            type: e,
            dataType: n,
            success: function(t, e) {
                s && s(t, e);
            },
            error: function(t) {
                o && o(t);
            }
        };
        if (e.toLowerCase() === "post") {
            a.data = i;
        }
        $.ajax(a);
    }
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

var ViewShedInfo = function() {
    this.type = 3;
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

var G3DDocQuery = function() {
    this.serverIp = "127.0.0.1";
    this.serverPort = 6163;
    this.docName = "";
    this.gdbp = "";
    this.layerIndex = 0;
    this.geometryType = "";
    this.geometry = "";
    this.where = "";
    this.objectIds = "";
    this.structs = "";
    this.page = "";
    this.pageCount = "";
    this.rule = "";
    this.queryResult = "未查询";
};

var PickModelParam = function() {
    this.serverIp = "127.0.0.1";
    this.serverPort = 6163;
    this.docName = "";
    this.gdbp = "";
    this.layerIndex = 0;
};

var G3DGeometryObject = function() {
    this.type = "anysurface";
    this.count = 1;
    this.items = [];
};

var G3DSurfaceObject = function() {
    this.pntcount = 0;
    this.trianglecount = 0;
    this.texturelayernum = 0;
    this.texturelayerind = 0;
    this.triangles = [];
    this.topo = [];
    this.colors = [];
    this.normals = [];
    this.texturepos = [];
    this.dots = [];
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

var MapDocQuery = function() {
    this.docObj = null;
    this.docName = "";
    this.mapIndex = 0;
    this.layerID = 0;
    this.geometryType = "";
    this.geometry = "";
    this.where = "";
    this.f = "json", this.objectIds = "";
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
    var s = "query?guid=" + Math.random();
    if (i.geometryType && i.geometry) {
        s += "&geometryType=" + i.geometryType + "&geometry=" + i.geometry;
    }
    if (i.where) s += "&where=" + i.where;
    if (i.f) s += "&f=" + i.f;
    if (i.objectIds) s += "&objectIds=" + i.objectIds;
    if (i.structs) s += "&structs=" + i.structs;
    if (i.page) s += "&page=" + i.page;
    if (i.pageCount) s += "&pageCount=" + i.pageCount;
    if (i.rule) s += "&rule=" + i.rule;
    var o = "http://" + i.docObj.ip + ":" + i.docObj.port + "/igs/rest/mrfs/docs/" + i.docName + "/" + i.mapIndex + "/" + i.layerID + "/" + s;
    Util.corsAjax(o, "get", null, t, e, "json", null);
};

var Point2D = function(t, e) {
    this.x = t;
    this.y = e;
};

var Point3D = function(t, e, i) {
    this.x = t;
    this.y = e;
    this.z = i;
};