var map;
var LayerArr;
var mapDocLayer;
//专题图服务类-实时路况
var roadLayer;
var oper, themesInfoArr;
//发布公告
var resultBaseUrl = "gdbp://MapGisLocal/wuhan/sfcls/";
// TODO 地图加载
(function () {
    var layer1 = new Zondy.Map.TianDiTu({
        layerType: Zondy.Enum.Map.TiandituType.VEC_IGS,
        projection: ol.proj.get('EPSG:4326'),
        ip: "127.0.0.1",
        port: "6163",
        token: "1d139d6939f697b101b222fd3bb9d24b",
    });
    var layer2 = new Zondy.Map.TianDiTu({
        layerType: Zondy.Enum.Map.TiandituType.CVA_IGS,
        projection: ol.proj.get('EPSG:4326'),
        ip: "127.0.0.1",
        port: "6163",
        token: "1d139d6939f697b101b222fd3bb9d24b",
    });
    var layer3 = new Zondy.Map.TianDiTu({
        layerType: Zondy.Enum.Map.TiandituType.IMG_IGS,
        projection: ol.proj.get('EPSG:4326'),
        ip: "127.0.0.1",
        port: "6163",
        token: "1d139d6939f697b101b222fd3bb9d24b",
    });
    var layer4 = new Zondy.Map.TianDiTu({
        layerType: Zondy.Enum.Map.TiandituType.CIA_IGS,
        projection: ol.proj.get('EPSG:4326'),
        ip: "127.0.0.1",
        port: "6163",
        token: "1d139d6939f697b101b222fd3bb9d24b",
    });
    layerArr = [layer1, layer2, layer3, layer4];
    //地图范围
    var extent = [114.321103824701, 30.4545175015849, 114.417985401979, 30.5289619425023];
    //中心点
    var center = ol.extent.getCenter(extent);
    //投影坐标系
    var projection = new ol.proj.Projection({ units: ol.proj.Units.METERS, extent: extent });
    //瓦片大小
    var tileSize = 256;
    //最大级数
    var maxZoom = 16;
    //瓦片参数原点
    var origin = [114.405798, 30.511983];

    //地图的显示名称
    var name = "MapGIS IGS MapDocLayer";
    //地图文档名称
    var docname = "光谷智慧交通";
    // 地图图层
    mapDocLayer = new Zondy.Map.Doc(name, docname, {
        //IP地址
        ip: "127.0.0.1",
        //端口号
        port: "6163",    //访问IGServer的端口号，.net版为6163，Java版为8089,
        extent: extent
    });

    //创建地图容器
    map = new ol.Map({
        layers: [layer1, layer2, mapDocLayer],
        target: 'mapCon',
        view: new ol.View({
            projection: ol.proj.get('EPSG:4326'),
            center: center,
            //projection: projection,
            maxZoom: maxZoom,
            minZoom: 0,
            zoom: 13
        }),
        // 经纬度
        controls: ol.control.defaults().extend([new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: "EPSG:4326",
            className: "coor",
            target: document.querySelector(".coordinate"),
            undefinedHTML: '&nbsp;'
        })])
    });

    var zoomslider = new ol.control.ZoomSlider();
    map.addControl(zoomslider);

    // 隐藏缩放控件
    document.querySelector(".ol-control").style.display = "none";

   roadLayer = map.getLayers(4);
    //初始化专题图服务类
    oper = new Zondy.Service.ThemeOper();
    oper.ip = "127.0.0.1";
    oper.port = "6163";
    oper.guid = mapDocLayer.getSource().guid;

})();

// TODO 图层切换
(function () {
    document.querySelector(".changeLayer").onclick = function () {
        // layer1.ol_uid.ol_uid  1
        // layer2.ol_uid.ol_uid  3
        // layer3.ol_uid.ol_uid  5
        // layer4.ol_uid.ol_uid  7
        var layers = map.getLayers().getArray();
        var uid = +layers[0].ol_uid;
        var docLayer = layers[layers.length - 1];

        while (layers.length) map.removeLayer(layers[0]);
        if (uid == 1) {
            map.addLayer(layerArr[2]);
            map.addLayer(layerArr[3]);
            map.addLayer(docLayer);
            this.className = "changeLayer styleB";
            document.querySelector(".container>.coordinate>.coor").style.color = "#fff";
        } else {
            map.addLayer(layerArr[0]);
            map.addLayer(layerArr[1]);
            map.addLayer(docLayer);
            this.className = "changeLayer styleA";
            document.querySelector(".container>.coordinate>.coor").style.color = "#5f6477";
        }
    }
})();

// TODO 复位, space触发
(function () {
    document.addEventListener("keyup", function (e) {
        if (e.key !== " ") return;

        var view = map.getView();
        var extent = [114.321103824701, 30.4545175015849, 114.417985401979, 30.5289619425023];
        //中心点
        var center = ol.extent.getCenter(extent);
        view.setCenter(center);
        view.setZoom(13);
    })
})();
// TODO 退出登录, q触发
(function () {
    document.addEventListener("keyup", function (e) {
        if (e.key !== "=") return;
        window.location.href="/logout";
    })
})();

// TODO 工具栏
(function () {
    // 水平收缩工具栏
    // var elem = document.getElementById("switch");
    // elem.onclick = function () {
    //     if (this.dataset.switchValue == "off") {
    //         this.parentElement.style.marginRight = "0";
    //         this.dataset.switchValue = "on";
    //         setTimeout(() => {
    //             this.innerHTML = "&#xe6a3;";
    //         }, 400);
    //         return;
    //     }
    //     this.parentElement.style.marginRight = "-606px";
    //     this.dataset.switchValue = "off";
    //     setTimeout(() => {
    //         this.innerHTML = "&#xe6db;";
    //     }, 400);
    // };

    // 唤醒二级工具栏
    var eventSearchItem = document.getElementById("eventSearchItem");
    var roadItem = document.getElementById("roadItem");
    var toolA = document.getElementById("toolA");
    var toolB = document.getElementById("toolB");
    var roadItemSon = roadItem.firstElementChild;
    var eventSearchItemSon = eventSearchItem.firstElementChild;
    var toolASon = toolA.firstElementChild;
    var toolBSon = toolB.firstElementChild;

    roadItem.addEventListener("mouseover", () => {
        roadItemSon.style.visibility = "visible";
    }, false);
    roadItem.addEventListener("mouseout", () => {
        roadItemSon.style.visibility = "hidden";
    }, false);
    // END ---------------------------------------------------------------------------------------------------------
    // END ---------------------------------------------------------------------------------------------------------
    toolA.addEventListener("mouseover", () => {
        toolASon.style.visibility = "visible";
    }, false);
    toolA.addEventListener("mouseout", () => {
        toolASon.style.visibility = "hidden";
    }, false);
    toolB.addEventListener("mouseover", () => {
        toolBSon.style.visibility = "visible";
    }, false);
    toolB.addEventListener("mouseout", () => {
        toolBSon.style.visibility = "hidden";
    }, false);
    eventSearchItem.addEventListener("mouseover", () => {
        eventSearchItemSon.style.visibility = "visible";
    }, false);
    eventSearchItem.addEventListener("mouseout", () => {
        eventSearchItemSon.style.visibility = "hidden";
    }, false);
})();

// TODO 工具
(function () {
    // 报告路况
    var traReportBtn = document.getElementById("traReportBtn");
    var traReportBox = document.getElementById("traReportBox");
    traReportBtn.onclick = function () {
        this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
        traReportBox.dataset.traReportSwitch = this.dataset.useSwitch;
        this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
        traReportBox.style.display = traReportBox.dataset.traReportSwitch == "on" ? "block" : "none";
    };

    // 视频监控
/*
    var videoBtn = document.getElementById('videoBtn');
    videoBtn.onclick = () =>{
        videoMonitor();
    };
*/

    // 视频监控
    (function () {
        var videoBtn = document.getElementById("videoBtn");

        videoBtn.onclick = function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
        };
    })();

    // 路况信息
    var traInfoBtn = document.getElementById("traInfoBtn");
    traInfoBtn.onclick = () => {
        window.open("/road");
    };

    // 查看公告
    var checkAfficheBtn = document.getElementById("checkAfficheBtn");
    checkAfficheBtn.onclick = () => {
        window.open("/notice");
    };

    // 绘制缓冲区
    var bufferBtn = document.getElementById("bufferBtn");
    bufferBtn.onclick = () => {
        addLineFeature();
    };

    // 发布公告
    var issueNoticeBtn = document.getElementById("issueNoticeBtn");
    issueNoticeBtn.onclick = () => {
        clipByPolyAnalysis();
    };
    // 清除缓冲区
    var clearbufferBtn = document.getElementById("clearbufferBtn");
    clearbufferBtn.onclick = () => {
          clearA();
    };

    //用户管理
    var userManageBtn = document.getElementById("userManageBtn");
    userManageBtn.onclick = () => {
        window.open("/users");
    };

    //实时路况 显示路况 关闭路况
    var showroadBtn = document.getElementById("showroadBtn");
    showroadBtn.onclick = () => {
        addTheme();
    };
    var closeroadBtn = document.getElementById("closeroadBtn");
    closeroadBtn.onclick = () => {
        deleteTheme();
    };

    // 测量
    (function () {
        var draw;
        var lenMeaBtn = document.getElementById("lenMeaBtn");
        var polMeaBtn = document.getElementById("polMeaBtn");
        var delMeaBtn = document.getElementById("delMeaBtn");

        lenMeaBtn.onclick = meaSwitch;
        polMeaBtn.onclick = meaSwitch;
        delMeaBtn.addEventListener("click", function () { // measure函数内, 还有一个清空测量图形的点击事件函数。
            lenMeaBtn.dataset.meaSwitch = "off";
            lenMeaBtn.dataset.useSwitch = "off";
            polMeaBtn.dataset.meaSwitch = "off";
            polMeaBtn.dataset.useSwitch = "off";
            lenMeaBtn.lastElementChild.style.display = "none";
            polMeaBtn.lastElementChild.style.display = "none";
            map.removeInteraction(draw);
        }, false);

        function meaSwitch() {
            this.dataset.meaSwitch = this.dataset.meaSwitch == "on" ? "off" : "on";
            this.dataset.useSwitch = this.dataset.meaSwitch;

            if (this.dataset.meaSwitch == "on") {
                this.lastElementChild.style.display = "block";
                // 更改另一个btn的状态: useSwitch meaSwitch
                var anotherBtn = this.id == "lenMeaBtn" ? polMeaBtn : lenMeaBtn;
                anotherBtn.lastElementChild.style.display = "none";
                anotherBtn.dataset.meaSwitch = "off";
                anotherBtn.dataset.useSwitch = "off";
                // 取消当前的绘制行为
                map.removeInteraction(draw);
                measure(this.id);
                return;
            }
            this.lastElementChild.style.display = "none";
            map.removeInteraction(draw);
        };

        //测量函数
        function measure(type) {
            type = type == "lenMeaBtn" ? "LineString" : "Polygon";
            //加载矢量图层
            var source = new ol.source.Vector();
            var vector = new ol.layer.Vector({
                source: source,
                style: new ol.style.Style({ // 样式done
                    fill: new ol.style.Fill({
                        color: 'rgba(255,234,0,.3)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,.8)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                })
            });
            map.addLayer(vector);

            // 载体 信息
            var measureTooltipElement;
            var measureTooltip;
            // 绘画
            draw = new ol.interaction.Draw({
                source: source,
                type: type,
                style: new ol.style.Style({ // 样式ing
                    fill: new ol.style.Fill({
                        color: 'rgba(255,234,0,.3)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                })
            });
            map.addInteraction(draw);

            //创建测量工具提示框
            createMeasureTooltip();

            var listener;
            // 开始绘制
            draw.on('drawstart', function (evt) {
                // 坐标
                var tooltipCoord = evt.coordinate;
                // 输出长度/面积
                listener = evt.feature.getGeometry().on('change', function (evt) {
                    var geom = evt.target; //绘制几何要素
                    var output;

                    switch (type) {
                        case "LineString": // 长度
                            output = formatLength(geom);
                            tooltipCoord = geom.getLastCoordinate(); //坐标
                            break;
                        case "Polygon": // 面积
                            output = formatArea(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
                            break;
                    }
                    measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
                    measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
                });
            }, this);
            // 绘制结束
            draw.on('drawend', function () {
                measureTooltip.setOffset([0, -7]);
                createMeasureTooltip();
                ol.Observable.unByKey(listener);
            }, this);

            // 清空测量图形
            delMeaBtn.addEventListener("click", function () {
                source = null;
                vector.setSource(source);
                // 清除测量数值
                var textList = document.querySelectorAll("#xjMeaText");
                for (var i = 0; i < textList.length; i++) {
                    textList[i].innerHTML = "";
                }
            }, false);

            // 制作测量结果
            function createMeasureTooltip() {
                measureTooltipElement = document.createElement('div');
                measureTooltipElement.id = "xjMeaText";
                measureTooltipElement.style.color = "#f00";
                measureTooltipElement.style.textShadow = "0px 2px 2px #fff, 0px -2px 2px #fff, 2px 0px 2px #fff, -2px 0px 2px #fff";
                measureTooltip = new ol.Overlay({
                    element: measureTooltipElement,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                map.addOverlay(measureTooltip);
            }

            //测量长度输出
            function formatLength(line) {
                var length = new ol.Sphere().getLength(line, {
                    "projection": map.getView().getProjection(), // 投影坐标系
                    "radius": 6378137
                });

                if (length > 100) return (output = (length / 1000).toFixed(2) + ' km');
                return (output = length.toFixed(2) + ' m');
            };
            //测量面积输出
            function formatArea(polygon) {
                var sourceProj = map.getView().getProjection(); //投影坐标系
                var geom = (polygon.clone().transform(sourceProj, 'EPSG:4326')); //将多边形要素坐标系投影为EPSG:4326
                var area = Math.abs(new ol.Sphere().getArea(geom, {
                    "projection": sourceProj,
                    "radius": 6378137
                }));

                if (area > 10000) return ((area / 1000000).toFixed(2) + ' km<sup>2</sup>');
                return (area.toFixed(2) + ' m<sup>2</sup>');
            };
        }
    })();

    // 地图文档目录特效
    (function () {
        var formDocBtn = document.getElementById("formDocBtn");
        var formDocBox = document.getElementById("formDocBox");
        formDocBtn.onclick = function () {
            this.dataset.docSwitch = this.dataset.docSwitch == "on" ? "off" : "on";
            if (this.dataset.docSwitch == "on") {
                this.parentElement.style.marginLeft = "0";
                setTimeout(() => {
                    this.innerHTML = "&#xe6db;";
                }, 200);
                return;
            }
            this.parentElement.style.marginLeft = "-10%";
            setTimeout(() => {
                this.innerHTML = "&#xe6a3;";
            }, 200);
        };
    })();

    // 地图文档目录
    (function () {
        document.getElementById("thingLayer").onclick = changeThingLayer;
        document.getElementById("cameraLayer").onclick = changeCameraLayer;
        document.getElementById("roadLayer").onclick = changeRoadLayer;
        document.getElementById("communityLayer").onclick = changecommunityLayer;

        // 控制图层显示与隐藏
        var showIncidentLayer = true;
        var showCameraLayer = true;
        var showStreetLayer = true;
        var showHabitationLayer = true;

        // 事件图层显示与隐藏
        function changeThingLayer() {
            if (showIncidentLayer) {
                mapDocLayer.setLayerStatus(3, "exclude");
                showIncidentLayer = false;
            } else {
                mapDocLayer.setLayerStatus(3, "include");
                showIncidentLayer = true;
            }
            mapDocLayer.refresh();
        }
        // 摄像头图层显示与隐藏
        function changeCameraLayer() {
            if (showCameraLayer) {
                mapDocLayer.setLayerStatus(2, "exclude");
                showCameraLayer = false;
            } else {
                mapDocLayer.setLayerStatus(2, "include");
                showCameraLayer = true;
            }
            mapDocLayer.refresh();
        }
        // 光谷道路图层显示与隐藏
        function changeRoadLayer() {
            if (showStreetLayer) {
                mapDocLayer.setLayerStatus(1, "exclude");
                showStreetLayer = false;
            } else {
                mapDocLayer.setLayerStatus(1, "include");
                showStreetLayer = true;
            }
            mapDocLayer.refresh();
        }
        // 居民区图层显示与隐藏
        function changecommunityLayer() {
            if (showHabitationLayer) {
                mapDocLayer.setLayerStatus(0, "exclude");
                showHabitationLayer = false;
            } else {
                mapDocLayer.setLayerStatus(0, "include");
                showHabitationLayer = true;
            }
            mapDocLayer.refresh();
        }
    })();

    // 事件查询
    /*(function () {
        var doc;
        var cirSeaBtn = document.getElementById("cirSeaBtn");
        var delSeaBtn = document.getElementById("delSeaBtn");
        var misSeaBtn = document.getElementById("misSeaBtn");
        var misSeaBox = document.getElementById("misSeaBox");
        var misSeaValue = misSeaBox.querySelector("input[type='text']");
        var misSeaSwitch = misSeaBox.querySelector("input[type='button']");

        cirSeaBtn.onclick = cirSea;
        delSeaBtn.onclick = delSea;
        misSeaSwitch.onclick = misSea;
        misSeaBtn.onclick = function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            this.dataset.seaSwitch = this.dataset.useSwitch;
            this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            misSeaBox.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            misSeaBox.firstElementChild.focus();
        };

        // 检测点要素
        map.on("pointermove", function (evt) {
            var pixel = map.getEventPixel(evt.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            map.getTargetElement().style.cursor = hit ? "pointer" : "";
        });
        //图层数据源
        var drawsource = new ol.source.Vector();
        //创建画圆控件
        var drawCircle = new ol.interaction.Draw({
            type: "Circle",
        });
        drawCircle.on('drawend', drawCircleback);

        function cirSea() {
            map.addInteraction(drawCircle);
            vectorLayer = new ol.layer.Vector({
                crossOrigin: "Anonymous",
                source: drawsource
            });
            map.addLayer(vectorLayer);
        }

        function misSea() {
            var Ptext = misSeaValue.value;
            if (Ptext == "") return;
            var Gtext = "事件编号 LIKE '%" + Ptext + "%' OR 驾驶员 LIKE '%" + Ptext + "%' OR 处理状态 LIKE '%" + Ptext +
                "%' OR 事件类型 LIKE '%" + Ptext + "%' OR 事件等级 LIKE '%" + Ptext + "%' OR 发生时间 LIKE '%" + Ptext +
                "%' OR 发生地点 LIKE '%" + Ptext + "%' OR 车牌号 LIKE '%" + Ptext + "%'";
            //初始化查询结构对象，设置查询结构包含几何信息
            var queryStruct = new Zondy.Service.QueryFeatureStruct();
            //是否包含几何图形信息
            queryStruct.IncludeGeometry = true;
            //是否包含属性信息
            queryStruct.IncludeAttribute = true;
            //是否包含图形显示参数
            queryStruct.IncludeWebGraphic = false;
            //实例化查询参数对象
            var queryParam = new Zondy.Service.QueryParameter({
                resultFormat: "json",
                struct: queryStruct
            });
            //设置查询分页号
            queryParam.pageIndex = 0;
            //设置查询要素数目
            queryParam.recordNumber = 20;
            //设置属性条件
            queryParam.where = Gtext;
            //实例化地图文档查询服务对象
            var queryService = new Zondy.Service.QueryDocFeature(queryParam, "光谷智慧交通", 3, {
                ip: "127.0.0.1",
                port: "6163" //端口号
            });
            //执行查询操作，querySuccess为查询回调函数
            queryService.query(QuerySuccess, function () {
                console.log("查询失败");
            });
        }

        function delSea() {
            drawsource.clear(); // 清空
            map.removeInteraction(drawCircle);
            var elemList = document.querySelectorAll("#popup");
            for (var i = 0; i < elemList.length; i++) {
                elemList[i].parentElement.remove();
            }
            elemList = null;
        }

        function drawCircleback(data) {
            var queryStruct = new Zondy.Service.QueryFeatureStruct();
            //是否包含几何图形信息
            queryStruct.IncludeGeometry = true;
            //是否包含属性信息
            queryStruct.IncludeAttribute = true;
            //是否包含图形显示参数
            queryStruct.IncludeWebGraphic = false;
            //创建一个用于查询的圆
            var geomObj = new Zondy.Object.Circle();
            geomObj.setByOL(data.feature.getGeometry());
            //指定查询规则
            var rule = new Zondy.Service.QueryFeatureRule({
                //是否将要素的可见性计算在内
                EnableDisplayCondition: true,
                //是否完全包含
                MustInside: false,
                //是否仅比较要素的外包矩形
                CompareRectOnly: false,
                //是否相交
                Intersect: true
            });
            //实例化查询参数对象
            var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/wuhan/sfcls/事件", {
                geometry: geomObj,
                resultFormat: "json",
                rule: rule,
                struct: queryStruct
            });
            //设置查询分页号
            queryParam.pageIndex = 0;
            //设置查询要素数目
            queryParam.recordNumber = 200;
            //实例化地图文档查询服务对象
            var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
                ip: "127.0.0.1",
                port: "6163"
            });
            queryService.query(QuerySuccess, function () {
                console.log("查询失败");
            });
        }

        function QuerySuccess(result) {
            map.removeInteraction(drawCircle);
            // 每次拉取相同的事件, 前后的 result.SFEleArray[0]对象 也不相同
            // null || object
            if (!result.SFEleArray) return;
            for (var i = 0; i < result.SFEleArray.length; i++) {
                var x = result.SFEleArray[i].fGeom.PntGeom[0].Dot.x;
                var y = result.SFEleArray[i].fGeom.PntGeom[0].Dot.y;
                var infoArr = result.SFEleArray[i].AttValue;
                // "0" --> "待处理"
                // "1" --> "处理中"
                // "2" --> "已归档"
                infoArr[7] = infoArr[7] == "0" ? "待处理" : infoArr == "1" ? "处理中" : "已归档";
                // 信息就在 infoArr
                var vectorLayer = new ol.layer.Vector({
                    crossOrigin: "Anonymous",
                    source: drawsource
                });
                map.addLayer(vectorLayer);
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([x, y]),
                    //attribute: featureInfo
                });
                iconFeature.setStyle(createLabelStyle(iconFeature));
                drawsource.addFeature(iconFeature);
                addPop(infoArr, [x, y], iconFeature);
            }
            // 创建popup
            function addPop(infoArr, coordinate, feature) {
                feature.xj = {};
                // 创建feature.xj.InfoBox
                var container = document.createElement("div");
                var content = document.createElement("div");
                var closer = document.createElement("a");
                container.id = "popup";
                content.id = "popup-content";
                closer.id = "popup-closer";
                container.className = "ol-popup";
                closer.className = "ol-popup-closer";
                closer.href = "javascript:;";
                container.append(closer, content);
                // 内部存储infobox
                feature.xj.infoBox = new ol.Overlay({
                    element: container,
                    positioning: 'bottom-right',
                    stopEvent: false,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                // 内部存储info
                feature.xj.info = [
                    "事件编号: " + infoArr[0],
                    "事件类型：" + infoArr[1],
                    "事件等级：" + infoArr[2],
                    "发生时间：" + infoArr[3],
                    "发生地点：" + infoArr[4],
                    "车 牌 号：" + infoArr[5],
                    "驾 驶 员：" + infoArr[6],
                    "处理状态：" + infoArr[7],
                ]; // 内部存储coor
                feature.xj.coor = coordinate;
                for (var i = 0; i < feature.xj.info.length; i++) {
                    var para = document.createElement("p");
                    para.innerHTML = feature.xj.info[i];
                    content.append(para);
                }
                // popup关闭事件
                closer.onclick = function () {
                    feature.xj.infoBox.setPosition(undefined);
                    this.blur();
                    return false;
                }
                // 添加popup
                map.addOverlay(feature.xj.infoBox);
                map.on("click", function (evt) {
                    // object || undefined
                    var newFeature = map.forEachFeatureAtPixel(evt.pixel, function (newFeature, layer) {
                        return newFeature;
                    });
                    if (!newFeature || !newFeature.xj) return;
                    if (newFeature.xj.infoBox.getPosition() == undefined) newFeature.xj.infoBox.setPosition(evt.coordinate); // feature.xj.coor
                });
            }
        }

        function createLabelStyle(feature) {
            // addpop(PInfo, zb);
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1], //图片中心
                    anchorOrigin: 'top-left', //标注样式的起点位置
                    anchorXUnits: 'fraction', //X方向单位：分数
                    anchorYUnits: 'fraction', //Y方向单位：分数
                    //opacity: 0.75,//透明度
                    //图标的url
                    src: '../img/position.png'
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 14px 微软雅黑',
                    //文本内容
                    text: feature.get('name'),
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({
                        color: '#aa3300'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    })
                })
            });
        }
    })();*/

    // 事件查询&&热力图 统计表
    (function () {
        var doc;
        var cirSeaBtn = document.getElementById("cirSeaBtn");
        var delSeaBtn = document.getElementById("delSeaBtn");
        var misSeaBtn = document.getElementById("misSeaBtn");
        var misSeaBox = document.getElementById("misSeaBox");
        var hotChartBtn = document.getElementById("hotChartBtn")
        var carChartBtn = document.getElementById("carChartBtn")
        var hotchartContral = document.getElementById("hotchartContral");
        var echartsTest = document.getElementById("echartsTest");
        var misSeaValue = misSeaBox.querySelector("input[type='text']");
        var misSeaSwitch = misSeaBox.querySelector("input[type='button']");

        cirSeaBtn.onclick = cirSea;
        delSeaBtn.onclick = delSea;
        misSeaSwitch.onclick = misSea;
        misSeaBtn.onclick = function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            this.dataset.seaSwitch = this.dataset.useSwitch;
            this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            misSeaBox.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            misSeaBox.firstElementChild.focus();
        };
        hotChartBtn.addEventListener("click", function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            hotchartContral.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
        }, false);
        carChartBtn.addEventListener("click", function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            echartsTest.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
        }, false);

        // 检测点要素
        map.on("pointermove", function (evt) {
            var pixel = map.getEventPixel(evt.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            map.getTargetElement().style.cursor = hit ? "pointer" : "";
        });
        //图层数据源
        var drawsource = new ol.source.Vector();
        //创建画圆控件
        var drawCircle = new ol.interaction.Draw({
            type: "Circle",
        });
        drawCircle.on('drawend', drawCircleback);

        function cirSea() {
            map.addInteraction(drawCircle);
            vectorLayer = new ol.layer.Vector({
                crossOrigin: "Anonymous",
                source: drawsource
            });
            map.addLayer(vectorLayer);
        }

        function misSea() {
            var Ptext = misSeaValue.value;
            if (Ptext == "") return;
            var Gtext = "事件编号 LIKE '%" + Ptext + "%' OR 驾驶员 LIKE '%" + Ptext + "%' OR 处理状态 LIKE '%" + Ptext +
                "%' OR 事件类型 LIKE '%" + Ptext + "%' OR 事件等级 LIKE '%" + Ptext + "%' OR 发生时间 LIKE '%" + Ptext +
                "%' OR 发生地点 LIKE '%" + Ptext + "%' OR 车牌号 LIKE '%" + Ptext + "%'";
            //初始化查询结构对象，设置查询结构包含几何信息
            var queryStruct = new Zondy.Service.QueryFeatureStruct();
            //是否包含几何图形信息
            queryStruct.IncludeGeometry = true;
            //是否包含属性信息
            queryStruct.IncludeAttribute = true;
            //是否包含图形显示参数
            queryStruct.IncludeWebGraphic = false;
            //实例化查询参数对象
            var queryParam = new Zondy.Service.QueryParameter({
                resultFormat: "json",
                struct: queryStruct
            });
            //设置查询分页号
            queryParam.pageIndex = 0;
            //设置查询要素数目
            queryParam.recordNumber = 20;
            //设置属性条件
            queryParam.where = Gtext;
            //实例化地图文档查询服务对象
            var queryService = new Zondy.Service.QueryDocFeature(queryParam, "光谷智慧交通", 3, {
                ip: "127.0.0.1",
                port: "6163" //端口号
            });
            //执行查询操作，querySuccess为查询回调函数
            queryService.query(QuerySuccess, function () {
                console.log("查询失败");
            });
        }

        function delSea() {
            drawsource.clear(); // 清空
            map.removeInteraction(drawCircle);
            var elemList = document.querySelectorAll("#popup");
            for (var i = 0; i < elemList.length; i++) {
                elemList[i].parentElement.remove();
            }
            elemList = null;
        }

        function drawCircleback(data) {
            var queryStruct = new Zondy.Service.QueryFeatureStruct();
            //是否包含几何图形信息
            queryStruct.IncludeGeometry = true;
            //是否包含属性信息
            queryStruct.IncludeAttribute = true;
            //是否包含图形显示参数
            queryStruct.IncludeWebGraphic = false;
            //创建一个用于查询的圆
            var geomObj = new Zondy.Object.Circle();
            geomObj.setByOL(data.feature.getGeometry());
            //指定查询规则
            var rule = new Zondy.Service.QueryFeatureRule({
                //是否将要素的可见性计算在内
                EnableDisplayCondition: true,
                //是否完全包含
                MustInside: false,
                //是否仅比较要素的外包矩形
                CompareRectOnly: false,
                //是否相交
                Intersect: true
            });
            //实例化查询参数对象
            var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/wuhan/sfcls/事件", {
                geometry: geomObj,
                resultFormat: "json",
                rule: rule,
                struct: queryStruct
            });
            //设置查询分页号
            queryParam.pageIndex = 0;
            //设置查询要素数目
            queryParam.recordNumber = 200;
            //实例化地图文档查询服务对象
            var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
                ip: "127.0.0.1",
                port: "6163"
            });
            queryService.query(QuerySuccess, function () {
                console.log("查询失败");
            });
        }

        function QuerySuccess(result) {
            map.removeInteraction(drawCircle);
            // TODO BEGIN ---------------------------------------------------------
            // TODO 统计图
            if (carChartBtn.dataset.useSwitch == "on") {
                myEcharts(result);
            }
            // TODO 热力图
            if (hotChartBtn.dataset.useSwitch == "on") {
                var heatmap = loadHeatmap(result);
                map.addLayer(heatmap);
            }
            // END ---------------------------------------------------------------------------------------------------------
            // END ---------------------------------------------------------------------------------------------------------
            // 每次拉取相同的事件, 前后的 result.SFEleArray[0]对象 也不相同
            if (!result.SFEleArray) return; // null || object
            for (var i = 0; i < result.SFEleArray.length; i++) {
                var x = result.SFEleArray[i].fGeom.PntGeom[0].Dot.x;
                var y = result.SFEleArray[i].fGeom.PntGeom[0].Dot.y;
                var infoArr = result.SFEleArray[i].AttValue;
                // "0" --> "待处理"
                // "1" --> "处理中"
                // "2" --> "已归档"
                infoArr[7] = infoArr[7] == "0" ? "待处理" : infoArr == "1" ? "处理中" : "已归档";
                // 信息就在 infoArr
                var vectorLayer = new ol.layer.Vector({
                    crossOrigin: "Anonymous",
                    source: drawsource
                });
                map.addLayer(vectorLayer);
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([x, y]),
                    //attribute: featureInfo
                });
                iconFeature.setStyle(createLabelStyle(iconFeature));
                drawsource.addFeature(iconFeature);
                addPop(infoArr, [x, y], iconFeature);
            }
            // 创建popup
            function addPop(infoArr, coordinate, feature) {
                feature.xj = {};
                // 创建feature.xj.InfoBox
                var container = document.createElement("div");
                var content = document.createElement("div");
                var closer = document.createElement("a");
                container.id = "popup";
                content.id = "popup-content";
                closer.id = "popup-closer";
                container.className = "ol-popup";
                closer.className = "ol-popup-closer";
                closer.href = "javascript:;";
                container.append(closer, content);
                // 内部存储infobox
                feature.xj.infoBox = new ol.Overlay({
                    element: container,
                    positioning: 'bottom-right',
                    stopEvent: false,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                // 内部存储info
                feature.xj.info = [
                    "事件编号: " + infoArr[0],
                    "事件类型：" + infoArr[1],
                    "事件等级：" + infoArr[2],
                    "发生时间：" + infoArr[3],
                    "发生地点：" + infoArr[4],
                    "车 牌 号：" + infoArr[5],
                    "驾 驶 员：" + infoArr[6],
                    "处理状态：" + infoArr[7],
                ]; // 内部存储coor
                feature.xj.coor = coordinate;
                for (var i = 0; i < feature.xj.info.length; i++) {
                    var para = document.createElement("p");
                    para.innerHTML = feature.xj.info[i];
                    content.append(para);
                }
                // popup关闭事件
                closer.onclick = function () {
                    feature.xj.infoBox.setPosition(undefined);
                    this.blur();
                    return false;
                }
                // 添加popup
                map.addOverlay(feature.xj.infoBox);
                map.on("click", function (evt) {
                    // object || undefined
                    var newFeature = map.forEachFeatureAtPixel(evt.pixel, function (newFeature, layer) {
                        return newFeature;
                    });
                    if (!newFeature || !newFeature.xj) return;
                    if (newFeature.xj.infoBox.getPosition() == undefined) newFeature.xj.infoBox.setPosition(evt.coordinate); // feature.xj.coor
                });
            }
        }

        function createLabelStyle(feature) {
            // addpop(PInfo, zb);
            return new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1], //图片中心
                    anchorOrigin: 'top-left', //标注样式的起点位置
                    anchorXUnits: 'fraction', //X方向单位：分数
                    anchorYUnits: 'fraction', //Y方向单位：分数
                    //opacity: 0.75,//透明度
                    //图标的url
                    src: 'img/position.png'
                }),
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 14px 微软雅黑',
                    //文本内容
                    text: feature.get('name'),
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({
                        color: '#aa3300'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    })
                })
            });
        }
        // TODO BEGIN ---------------------------------------------------------
        function createFeature({
                                   type = 'Point',
                                   coordinates = [0, 0]
                               }) {
            // heatmap提供的数据源，只能通过 geoJson 或者 KML 格式的文件加载
            // 我们通过生成把坐标点，转化成feature的点。
            return new ol.Feature({
                geometry: new ol.geom[type](coordinates)
            })
        }

        function loadHeatmap(data) {
            var mydata = new Array();
            //创建一个数组，将查询结果保存到数组中
            for (var i = 0; i < data.SFEleArray.length; i++) {
                mydata[i] = [data.SFEleArray[i].bound.xmin, data.SFEleArray[i].bound.ymin]

            }
            let source = new ol.source.Vector({});
            let features = [];
            for (let i in mydata) {
                let newFeature = createFeature({
                    coordinates: mydata[i]
                });
                features.push(newFeature)
            }
            source.addFeatures(features);
            console.log(source);

            var blur = document.getElementById('blur');
            var radius = document.getElementById('radius');

            //创建一个Heatmap图层
            var Heatmap = new ol.layer.Heatmap({
                //矢量数据源（读取本地的KML数据）
                source: source,
                //热点半径
                radius: parseInt(radius.value, 10),
                //模糊尺寸
                blur: parseInt(blur.value, 10)
            });

            //为矢量数据源添加addfeature事件监听
            Heatmap.getSource().on('addfeature', function (event) {

                //要素的名称属性
                var name = data.SFEleArray[i].AttValue[2];
                //得到要素的事件等级属性（rank）
                var rank = parseFloat(name);
                // console.log(rank)
                //设置要素的weight属性
                event.feature.set('weight', 3 / (rank - 1));
            });

            //分别为另个参数设置控件（input）添加事件监听，动态设置热点图的参数
            radius.addEventListener('input', function () {
                //设置热点图层的热点半径
                Heatmap.setRadius(parseInt(radius.value, 10));
            });
            blur.addEventListener('input', function () {
                //设置热点图层的模糊尺寸
                Heatmap.setBlur(parseInt(blur.value, 10));
            });

            return Heatmap

        }

        function myEcharts(mydata) {

            var num = [0, 0, 0, 0, 0, 0]
            //统计各个事件的数量
            for (var i = 0; i < mydata.SFEleArray.length; i++) {
                switch (mydata.SFEleArray[i].AttValue[1]) {
                    case "刮擦":
                        num[0] = num[0] + 1;
                        break;
                    case "碰撞":
                        num[1] = num[1] + 1;
                        break;
                    case "翻车":
                        num[2] = num[2] + 1;
                        break;
                    case "碾压":
                        num[3] = num[3] + 1;
                        break;
                    case "失火":
                        num[4] = num[4] + 1;
                        break;
                    case "其他":
                        num[5] = num[5] + 1;
                        break;
                    default:
                        num[5] = num[5] + 1;
                }
            }

            console.log(num);

            var myChart = echarts.init(document.getElementById('echartsTest'));
            //指定图标的配置项和数据
            var option = {
                xAxis: [{
                    type: 'category',
                    //name:'额度',
                    //这是设置的false，就不不显示下方的x轴，默认是true的
                    show: true,
                    data: ['刮擦', '碰撞', '翻车', '碾压', '失火', '其他'],
                    axisLabel: {
                        //这个是字体倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                        //rotate: 30,
                        //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                        interval: 0
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: '交通事故事件类型',
                    //下面的就很简单了，最小是多少，最大是多少，默认一次增加多少
                    min: 0,
                    max: 25,
                    interval: 1,
                    //下面是显示格式化，一般来说还是用的上的
                    axisLabel: {
                        formatter: '{value} 起'
                    }
                }],
                series: [{
                    name: '数量',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#FFAEB9', '#B5C334', '#FCCE10', '#E87C25', '#EEEE00',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            //以下为是否显示统计图长条顶部信息，显示位置和显示格式的设置了
                            label: {
                                show: true,
                                position: 'top',
                                //formatter: '{c}'
                                //{b}\n{c}中 {b}显示课程名称，{c}显示课程数量
                                formatter: '{c}'
                            }
                        }
                    },
                    //设置柱的宽度，要是数据太少，柱子太宽不美观~
                    barWidth: 38,
                    data: num
                }]
            }
            //使用刚指定的配置项和数据显示图库
            myChart.setOption(option);
        }
        // END ---------------------------------------------------------------------------------------------------------
        // END ---------------------------------------------------------------------------------------------------------
    })();

    // 事件添加
    (function () {
        var drawsource = new ol.source.Vector();
        var draw = new ol.interaction.Draw({
            source: drawsource,
            type: 'Point',
        });
        var drawp = new ol.interaction.Draw({
            source: drawsource,
            type: 'Point',
        });

        var addEventBtn = document.getElementById("addEventBtn");
        addEventBtn.onclick = function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            if (this.dataset.useSwitch == "on") {
                this.lastElementChild.style.display = "block";
                addEvent();
                return;
            }
            this.lastElementChild.style.display = "none";
            // 结束添加
            map.removeInteraction(draw);
            map.removeInteraction(drawp);
        };

        function addEvent() {
            var allOverlay = map.getOverlays();
            var arrayL = allOverlay.array_.length + 1;
            if (arrayL != 0) {
                for (var i = 0; i < allOverlay.array_.length + 1; i++) {
                    map.removeOverlay(allOverlay.array_[i]);
                }
            }
            map.removeInteraction(draw);
            draw = undefined;
            drawp = new ol.interaction.Draw({
                source: drawsource,
                type: 'Point',
            })
            drawp.on("drawend", function (e) {
                var point = e.feature.getGeometry().getCoordinates();
                //创建一个点形状，描述点形状的几何信息
                var gpoint = new Zondy.Object.GPoint(point[0], point[1]);
                //设置当前点要素的几何信息
                var fGeom = new Zondy.Object.FeatureGeometry({
                    PntGeom: [gpoint]
                });
                //描述点要素的符号参数信息
                var pointInfo = new Zondy.Object.CPointInfo({
                    Angle: 0,
                    Color: 6,
                    Space: 0,
                    SymHeight: 5,
                    SymID: 21,
                    SymWidth: 5
                });
                //设置当前点要素的图形参数信息
                var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
                    InfoType: 1,
                    PntInfo: pointInfo
                });
                //设置添加点要素的属性信息
                var attValue = ["", "", , "", "", "", "", , ];
                //创建一个要素
                var feature = new Zondy.Object.Feature({
                    fGeom: fGeom,
                    GraphicInfo: webGraphicInfo,
                    AttValue: attValue
                });
                //设置要素为点要素
                feature.setFType(0);
                feature.setFID();
                //创建一个要素数据集
                var featureSet = new Zondy.Object.FeatureSet();
                featureSet.clear();
                //设置属性结构
                var cAttStruct = new Zondy.Object.CAttStruct({
                    FldName: ["事件编号", "事件类型", "事件等级", "发生时间", "发生地点", "车牌号", "驾驶员", "处理状态", "mpLayer"],
                    FldNumber: 9,
                    FldType: ["string", "string", "short", "string", "string", "string", "string", "int", "short"]
                });
                featureSet.AttStruct = cAttStruct;
                //添加要素到要素数据集
                featureSet.addFeature(feature);
                //创建一个编辑服务类
                var editService = new Zondy.Service.EditLayerFeature("gdbp://MapGisLocal/wuhan/sfcls/事件", {
                    ip: "127.0.0.1",
                    port: "6163"
                });
                editService.add(featureSet, function (result) {
                    if (result.succeed) {
                        mapDocLayer.refresh();
                    }
                });
            })
            map.addInteraction(drawp);
        }
    })();

    // 事件更新
    (function () {
        var drawsource = new ol.source.Vector();
        var draw = new ol.interaction.Draw({
            source: drawsource,
            type: 'Point',
        })
        var drawp = new ol.interaction.Draw({
            source: drawsource,
            type: 'Point',
        })

        var updateEventBtn = document.getElementById("updateEventBtn");
        var updateEventBox = document.getElementById("formUpEve");
        var formUpEveUpdate = document.getElementById("formUpEveUpdate");
        var formUpEvecancel = document.getElementById("formUpEvecancel");

        formUpEveUpdate.onclick = update;

        updateEventBtn.onclick = function () {
            this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
            this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";
            updateEventBox.style.display = this.dataset.useSwitch == "on" ? "block" : "none";

            if (this.dataset.useSwitch == "on") {
                getOldInfo();
                return;
            }
            map.removeInteraction(draw);
            map.removeInteraction(drawp);
        };

        function getOldInfo() {
            map.removeInteraction(drawp);
            // var drawsource = new ol.source.Vector();
            drawp = undefined;
            draw = new ol.interaction.Draw({
                source: drawsource,
                type: 'Point',
            })

            draw.on("drawend", function (e) {
                var point = e.feature.getGeometry().getCoordinates();
                var queryStruct = new Zondy.Service.QueryFeatureStruct();
                queryStruct.IncludeGeometry = true;
                queryStruct.IncludeAttribute = true;
                queryStruct.IncludeWebGraphic = false;
                var pointObj = new Zondy.Object.Point2D(point[0], point[1]);
                pointObj.nearDis = 0.001;
                var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/wuhan/sfcls/事件", {
                    geometry: pointObj,
                    resultFormat: "json",
                    struct: queryStruct
                });
                queryParam.pageIndex = 0;
                queryParam.recordNumber = 1;
                var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
                    ip: "127.0.0.1",
                    port: "6163"
                });
                queryService.query(function (result) {
                    if (result.SFEleArray == null) {
                        console.log("查询结果为空！");
                        return;
                    }
                    document.getElementById("e00").value = result.SFEleArray[0].AttValue[0]; //0事件编号
                    document.getElementById("e01").value = result.SFEleArray[0].AttValue[1]; //1事件类型
                    document.getElementById("e02").value = result.SFEleArray[0].AttValue[2]; //2事件等级
                    document.getElementById("e03").value = result.SFEleArray[0].AttValue[3]; //3发生时间
                    document.getElementById("e04").value = result.SFEleArray[0].AttValue[4]; //4发生地点
                    document.getElementById("e05").value = result.SFEleArray[0].AttValue[5]; //5车牌号
                    document.getElementById("e06").value = result.SFEleArray[0].AttValue[6]; //6驾驶员
                    document.getElementById("e07").value = result.SFEleArray[0].AttValue[7] == //7处理状态
                    0 ? 0 : result.SFEleArray[0].AttValue[7] == 1 ? 1 : 2;
                    document.getElementById("e08").value = result.SFEleArray[0].fGeom.PntGeom[0].Dot.x //9坐标X
                    document.getElementById("e09").value = result.SFEleArray[0].fGeom.PntGeom[0].Dot.y //10坐标Y
                    document.getElementById("e10").value = result.SFEleArray[0].FID;
                    document.getElementById("formUpEve").style.display = "block";
                }, function (error) {}, "POST");
            })
            map.addInteraction(draw);
        }

        function update() {
            var infoItem = [
                document.getElementById("e00").value,
                document.getElementById("e01").value,
                document.getElementById("e02").value,
                document.getElementById("e03").value,
                document.getElementById("e04").value,
                document.getElementById("e05").value,
                document.getElementById("e06").value,
                document.getElementById("e07").value, // TODO !!
                undefined,
            ];
            var infoCoor = [document.getElementById("e08").value, document.getElementById("e09").value];
            var infoFid = document.getElementById("e10").value;
            var infoSym = document.getElementById("e07").value == 0 ? 6 : document.getElementById("e07").value == 1 ? 4 : 90;
            // document.getElementById("formUpEve").style.display = "none";

            var gpoint = new Zondy.Object.GPoint(infoCoor[0], infoCoor[1]);
            //设置当前点要素的几何信息
            var fGeom = new Zondy.Object.FeatureGeometry({
                PntGeom: [gpoint]
            });
            //描述点要素的符号参数信息
            var pointInfo = new Zondy.Object.CPointInfo({
                Angle: 0,
                Color: infoSym,
                Space: 0,
                SymHeight: 5,
                SymID: 21,
                SymWidth: 5
            });
            //设置当前点要素的图形参数信息
            var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
                InfoType: 1,
                PntInfo: pointInfo
            });
            //设置添加点要素的属性信息
            var attValue = infoItem;
            //创建一个要素
            var feature = new Zondy.Object.Feature({
                fGeom: fGeom,
                GraphicInfo: webGraphicInfo,
                AttValue: attValue
            });
            //设置要素为点要素
            feature.setFType(0);
            feature.setFID(infoFid);
            //创建一个要素数据集
            var featureSet = new Zondy.Object.FeatureSet();
            featureSet.clear();
            //设置属性结构
            var cAttStruct = new Zondy.Object.CAttStruct({
                FldName: ["事件编号", "事件类型", "事件等级", "发生时间", "发生地点", "车牌号", "驾驶员", "处理状态", "mpLayer"],
                FldNumber: 9,
                FldType: ["string", "string", "short", "string", "string", "string", "string", "int", "short"]
            });
            featureSet.AttStruct = cAttStruct;
            //添加要素到要素数据集
            featureSet.addFeature(feature);
            //创建一个编辑服务类
            var editService = new Zondy.Service.EditLayerFeature("gdbp://MapGisLocal/wuhan/sfcls/事件", {
                ip: "127.0.0.1",
                port: "6163"
            });
            editService.update(featureSet, function (result) {
                if (result.succeed) {
                    mapDocLayer.refresh();
                }
            });
        }
    })();
})();

/*
*****************************************地图目录服务***************************************
*/

// 控制图层显示与隐藏
var showIncidentLayer = true;
var showCameraLayer = true;
var showStreetLayer = true;
var showHabitationLayer = true;

// 事件图层显示与隐藏
function changeIncidentLayer() {
    if (showIncidentLayer) {
        mapDocLayer.setLayerStatus(3, "exclude");
        showIncidentLayer = false;
    }
    else {
        mapDocLayer.setLayerStatus(3, "include");
        showIncidentLayer = true;
    }
    mapDocLayer.refresh();
}
// 摄像头图层显示与隐藏
function changeCameraLayer() {
    if (showCameraLayer) {
        mapDocLayer.setLayerStatus(2, "exclude");
        showCameraLayer = false;
    }
    else {
        mapDocLayer.setLayerStatus(2, "include");
        showCameraLayer = true;
    }
    mapDocLayer.refresh();
}
// 光谷道路图层显示与隐藏
function changeStreetLayer() {
    if (showStreetLayer) {
        mapDocLayer.setLayerStatus(1, "exclude");
        showStreetLayer = false;
    }
    else {
        mapDocLayer.setLayerStatus(1, "include");
        showStreetLayer = true;
    }
    mapDocLayer.refresh();
}
// 居民区图层显示与隐藏
function changeHabitationLayer() {
    if (showHabitationLayer) {
        mapDocLayer.setLayerStatus(0, "exclude");
        showHabitationLayer = false;
    }
    else {
        mapDocLayer.setLayerStatus(0, "include");
        showHabitationLayer = true;
    }
    mapDocLayer.refresh();
}

/*
*****************************************实时路况***************************************
* ****************************************专题图***************************************
*/

//创建专题图
function addTheme() {
    //如果已有专题图信息，先清除
    if (themesInfoArr)
        oper.removeThemesInfo("光谷智慧交通", "1/0", onAddTheme);
    else {
        createTheme(); //生成专题图
    }
}
//清除之前的专题图后，生成新的专题图
function onAddTheme(flg) {
    createTheme();
}
//创建专题图
function createTheme() {
    //初始化Zondy.Object.Theme.ThemesInfo，用于设置需添加的专题相关信息
    themesInfoArr = [];
    //设置图层名层
    themesInfoArr[0] = new Zondy.Object.Theme.ThemesInfo();
    //初始化指定图层的专题图信息对象，之后再给该数组赋值
    themesInfoArr[0].LayerName = "road";
    themesInfoArr[0].ThemeArr = [];
    //实例化CMultiClassTheme类
    themesInfoArr[0].ThemeArr[0] = new Zondy.Object.Theme.CRangeTheme();
    themesInfoArr[0].ThemeArr[0].Name = "分段专题图";
    //指定为分段专题图
    themesInfoArr[0].ThemeArr[0].IsBaseTheme = false;
    themesInfoArr[0].ThemeArr[0].Visible = true;
    themesInfoArr[0].ThemeArr[0].GeoInfoType = "Lin";

    //未分段值的图形信息设置
    themesInfoArr[0].ThemeArr[0].DefaultInfo = new Zondy.Object.Theme.CThemeInfo();
    themesInfoArr[0].ThemeArr[0].DefaultInfo.Caption = "未分类";
    themesInfoArr[0].ThemeArr[0].DefaultInfo.LinInfo = new Zondy.Object.Theme.CLinInfo();
    themesInfoArr[0].ThemeArr[0].DefaultInfo.LinInfo.OutClr = [46, 4, 3];

    //分段取值设置
    themesInfoArr[0].ThemeArr[0].Expression = "车流量";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr = [];
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[0] = new Zondy.Object.Theme.CRangeThemeInfo();
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[0].StartValue = "0";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[0].EndValue = "1000";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[0].LinInfo = new Zondy.Object.Theme.CLinInfo();
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[0].LinInfo.OutClr = [1455, 40, 30];
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[0].LinInfo.OutPenW = [3, 3, 3];

    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[1] = new Zondy.Object.Theme.CRangeThemeInfo();
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[1].StartValue = "1000";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[1].EndValue = "1500";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[1].LinInfo = new Zondy.Object.Theme.CLinInfo();
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[1].LinInfo.OutClr = [1354, 40, 30];
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[1].LinInfo.OutPenW = [3, 3, 3];

    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[2] = new Zondy.Object.Theme.CRangeThemeInfo();
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[2].StartValue = "1500";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[2].EndValue = "2000";
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[2].LinInfo = new Zondy.Object.Theme.CLinInfo();
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[2].LinInfo.OutClr = [6, 0, 0];
    themesInfoArr[0].ThemeArr[0].RangeThemeInfoArr[2].LinInfo.OutPenW = [3, 3, 3];



    //给指定地图文档指定图层添加专题图
    var themesInfoArrStr = JSON.stringify(themesInfoArr);
    oper.addThemesInfo("光谷智慧交通", "1", themesInfoArr, onMultiClassTheme);
}
//删除专题图
function deleteTheme() {
    if (themesInfoArr) {
        oper.removeThemesInfo("光谷智慧交通", "1/0", onMultiClassTheme);
        themesInfoArr = null;
    } else {
        alert("已清除或者没有该专题图信息！");
    }
}
//调用专题图成服务功后的回调
function onMultiClassTheme(flg) {
    if (flg) {
        //刷新地图，即重新加载生成专题图后的地图文档
        mapDocLayer.refresh();
    } else {
        return false;
    }
}

/*
*****************************************视频监控***************************************
* **********************************************************************************
*/
// 视频监控
(function () {
    var videoBtn = document.getElementById("videoBtn");

    videoBtn.onclick = function () {
        this.dataset.useSwitch = this.dataset.useSwitch == "on" ? "off" : "on";
        this.lastElementChild.style.display = this.dataset.useSwitch == "on" ? "block" : "none";

        if (this.dataset.useSwitch == "on") {
            videoMonitor();
        }
    };
})();
//视频监控
function videoMonitor() {
    //交互式点信息查询
    var drawsource = new ol.source.Vector();
    //初始化交互式绘制控件
    var draw = new ol.interaction.Draw({
        source: drawsource,
        /*取值：Point（点）、LineString（线）、Polygon（面）和Circle（圆）。*/
        type: 'Point',
    });
    draw.on("drawend", function (e) {
        var point = e.feature.getGeometry().getCoordinates();
        //初始化查询结构对象，设置查询结构包含几何信息
        var queryStruct = new Zondy.Service.QueryFeatureStruct();
        //是否包含几何图形信息
        queryStruct.IncludeGeometry = true;
        //是否包含属性信息
        queryStruct.IncludeAttribute = true;
        //是否包含图形显示参数
        queryStruct.IncludeWebGraphic = false;
        ////创建一个点形状，描述点形状的几何信息
        var pointObj = new Zondy.Object.Point2D(point[0], point[1]);
        //设置查询点的搜索半径
        pointObj.nearDis = 0.001;
        //实例化查询参数对象
        var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/wuhan/sfcls/摄像头", {
            geometry: pointObj,
            resultFormat: "json",
            struct: queryStruct
        });
        //设置查询分页号
        queryParam.pageIndex = 0;
        //设置查询要素数目
        queryParam.recordNumber = 1;
        //console.log(queryParam.objectIds);
        //实例化地图文档查询服务对象
        var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
            ip: "127.0.0.1",
            port: "6163"    //访问IGServer的端口号，.net版为6163，Java版为8089
        });
        //执行查询操作，querySuccess为查询回调函数
        queryService.query(function (result) {
            console.log(result);
            if (result.SFEleArray == null) {
                console.log("查询结果为空！");
                return;
            }
            var pointArray = new Array();
            pointArray.push(
                result.SFEleArray[0].AttValue[0],//0摄像头id
                result.SFEleArray[0].AttValue[1],//1摄像头编号
                result.SFEleArray[0].AttValue[2],//2摄像头位置
                result.SFEleArray[0].AttValue[3],//3URL
                result.SFEleArray[0].AttValue[4],//4mpLayer
                result.SFEleArray[0].fGeom.PntGeom[0].Dot.x,//5坐标X
                result.SFEleArray[0].fGeom.PntGeom[0].Dot.y,//6坐标Y
                result.SFEleArray[0].FID,//7FID
            );

            var point = [pointArray[5], pointArray[6]];
            console.log(point);
            console.log(pointArray);
            addpop(pointArray);
        }, function (error) { }, "POST");
    });
    map.addInteraction(draw);
}
function addpop(pointArray) {
    // 创建元素, 用来作为popup的载体
    var container = document.createElement("div");
    var content = document.createElement("div");
    var closer = document.createElement("a");
    // 设置元素属性, 设置元素的结构
    container.id = "popup";
    content.id = "popup-content";
    closer.id = "popup-closer";
    container.className = "ol-popup";
    closer.className = "ol-popup-closer";
    closer.href = "#";
    container.append(closer, content);
    document.getElementById("mapCon").append(container);
    // 给当前捕获到的feature添加信息框属性
    var featurexj_info_box = new ol.Overlay(
        ({
            element: container, // 刚刚创建的元素
            positioning: 'bottom-right',
            stopEvent: false,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));
    // 给当前捕获到的feature添加信息, 用来给popup提供信息
    // 它被我暂时写死了, 所以所有popup显示的内容都一样
    var featurexj_featuerInfo = {
        geo: [pointArray[5], pointArray[6]],
        att: {
            text1: "摄像头编号：" + pointArray[1],
            text2: "摄像头位置：" + pointArray[2],
            url: pointArray[3],
        }
    };
    addFeatrueInfo(featurexj_featuerInfo);//把信息放进去
    // 给popup添加一个关闭事件, 原理是设置popup的位置为undefined, 让它迷失位置, 就自然看不见了
    closer.onclick = function () {
        featurexj_info_box.setPosition(undefined);
        this.blur();
        return false;
    };
    // 添加popup
    map.addOverlay(featurexj_info_box);
    /**
     * popup生成函数
     * @param {*} info popup的信息, 上文中是feature.xj_featuerInfo
     */
    function addFeatrueInfo(info) {
        //// 创建元素, 作为title
        //var elem_title = document.createElement("a");
        //elem_title.className = "markerInfo";
        //elem_title.href = info.att.titleURL;
        //elem_title.innerText = info.att.title;
        // 创建元素, 作为article
        var elem_article1 = document.createElement('div');
        elem_article1.className = "markerText";
        elem_article1.innerText = info.att.text1;
        var elem_article2 = document.createElement('div');
        elem_article2.className = "markerText";
        elem_article2.innerText = info.att.text2;
        // 创建元素, 显示视频
        var elem_video = document.createElement("VIDEO");
        elem_video.autoplay = true;
        elem_video.src = info.att.url;
        // content元素, 是在上一层作用域被声明和定义的元素
        content.append(elem_article1, elem_article2, elem_video);
    }
    // 显示popup, 原理：如果popup的经纬度是undefined, 就根据feature.xj_featuerInfo.geo给它重新添加经纬度, 它找到位置后就自然现形了
    if (featurexj_info_box.getPosition() == undefined) featurexj_info_box.setPosition(featurexj_featuerInfo.geo);
}


/*
*****************************************发布公告***************************************
* **********************************************************************************
*/
function addLineFeature() {
    //clearA();
    //初始化交互式绘制控件
    var draw = new ol.interaction.Draw({
        /*取值：Point（点）、LineString（线）、Polygon（面）和Circle（圆）。*/
        type: 'LineString',
    });
    //将交互式绘制控件添加到地图容器中
    map.addInteraction(draw);
    draw.on("drawend", function(e) {
        var pointArray = new Array();
        for (var length = 0; length < e.feature.getGeometry().getCoordinates().length; length++) {
            var point = new Zondy.Object.Point2D(e.feature.getGeometry().getCoordinates()[length][0], e.feature.getGeometry().getCoordinates()[
                length][1]);
            pointArray.push(point)
        }
        //构成折线的弧段
        var gArc = new Zondy.Object.Arc(pointArray);
        //构成线的折线
        var gAnyLine = new Zondy.Object.AnyLine([gArc]);
        //设置线要素的几何信息
        var gline = new Zondy.Object.GLine(gAnyLine);
        //设置要素的几何信息
        var fGeom = new Zondy.Object.FeatureGeometry({
            LinGeom: [gline]
        });
        //设置添加线要素的图形参数信息
        var clineInfo = new Zondy.Object.CLineInfo({
            "Color": 4,
            "LinStyleID": 0,
            "LinStyleID2": 1,
            "LinWidth": 2,
            "Xscale": 10,
            "Yscale": 10
        });
        //设置要素的图形参数信息
        var graphicInfo = new Zondy.Object.WebGraphicsInfo({
            InfoType: 2,
            LinInfo: clineInfo
        });
        var aaa = null;
        var bbb = new String();
        var ccc = new String();
        var ddd = new String();
        var labletext = prompt("请输入施工编号", "");
        if (labletext != null && labletext != "") {
            aaa = labletext;
        }
        var labletext = prompt("请输入施工类型", "");
        if (labletext != null && labletext != "") {
            bbb = labletext;
        }
        var labletext = prompt("请输入施工持续时间", "");
        if (labletext != null && labletext != "") {
            ccc = labletext;
        }
        var labletext = prompt("请输入备注", "");
        if (labletext != null && labletext != "") {
            ddd = labletext;
        }

        //设置添加线要素的属性信息
        var attValue = [aaa, bbb, ccc, ddd];
        //创建一个线要素
        var newFeature = new Zondy.Object.Feature({
            fGeom: fGeom,
            GraphicInfo: graphicInfo,
            AttValue: attValue
        });
        //设置要素为线要素
        newFeature.setFType(2);
        //创建一个要素数据集
        var featureSet = new Zondy.Object.FeatureSet();
        //设置属性结构
        var cAttStruct = new Zondy.Object.CAttStruct({
            FldName: ["id", "name", "value", "other"],
            FldNumber: 4,
            FldType: ["int", "string", "string", "string"]
        });
        //设置要素数据集的树形结构
        featureSet.AttStruct = cAttStruct;
        //将添加的线要素添加到属性数据集中
        featureSet.addFeature(newFeature);
        var editService = new Zondy.Service.EditLayerFeature("gdbp://MapGisLocal/wuhan/sfcls/施工线", {
            ip: "127.0.0.1",
            port: "6163"
        });

        /* ***********生成缓冲区************ */
        //实例化CAttDataRow类
        var values = [114.321103824701, 30.4545175015849, 114.417985401979, 30.5289619425023];
        var valuesRow = new Zondy.Object.CAttDataRow(values, 1);
        //实例化FeatureBuffBySingleRing类，设置要素缓冲分析必要参数，输出分析结果到缓冲分析结果图层
        var featureBufBySR = new Zondy.Service.FeatureBuffBySingleRing({
            ip: "127.0.0.1",
            port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089,
            //设置要素缓冲分析左半径
            leftRad: 0.002,
            //设置要素缓冲分析右半径
            rightRad: 0.002,
        });
        /*设置缓冲分析参数*/
        //设置几何信息
        featureBufBySR.sfGeometryXML = JSON.stringify([fGeom]);
        //设置属性结构
        featureBufBySR.attStrctXML = JSON.stringify(cAttStruct);
        //设置属性值
        featureBufBySR.attRowsXML = JSON.stringify([valuesRow]);
        //设置追踪半径
        featureBufBySR.traceRadius = 0.0001;
        //设置缓冲结果的名称以及存放地址
        var resultname = "singleBuffAnalysisResultLayer" + getCurentTime();
        featureBufBySR.resultName = resultBaseUrl + resultname;
        //调用Zondy.Service.AnalysisBase基类的execute方法执行要素缓冲分析，AnalysisSuccess为回调函数。
        featureBufBySR.execute(AnalysisSuccess, "post", false, "json", AnalysisError);



        editService.add(featureSet, function(result) {
            if (result.succeed) {
                alert("成功");
                //doc.refresh();
                //window.location.reload();
            }
        });
    });
    //将交互式绘制控件添加到地图容器中
    map.addInteraction(draw);
}

/*==========================================裁剪分析===================================================*/
var buffer_data;
//执行多边形裁剪分析
function clipByPolyAnalysis() {
    data=buffer_data;
    //clearA(); //清除之前的分析结果
    //显示进度条
    buffer_url=data.results[0].Value;
    //startPressBar();
    var resultname = resultBaseUrl + "clipByPolyAnalysisResultLayer" + getCurentTime();
    //实例化ClipByPolygon类
    var clipParam = new Zondy.Service.ClipByLayer({
        ip: "127.0.0.1",
        port: "6163" //访问IGServer的端口号，.net版为6163，Java版为8089
    });
    //设置被裁剪图层URL
    clipParam.srcInfo1 = "gdbp://MapGisLocal/wuhan/sfcls/居民区";
    clipParam.srcInfo2 = buffer_url
    //设置结果URL
    clipParam.desInfo = buffer_url+"裁剪结果";
    //调用基类的execute方法，执行多边形裁剪分析。AnalysisSuccess为结果回调函数
    clipParam.execute(AnalysisSuccess_clip, "post", false, "json", AnalysisError);
}

//专题图服务类
var oper, themesInfoArr;

function AnalysisSuccess_clip(data) {
    //停止进度条
    //stopPressBar();
    if (!data.results) {
        alert("缓冲失败，请检查参数！");
    } else {
        if (data.results.length != 0) {

            console.log("是这个吗")
            var resultLayerUrl = data.results[0].Value || data.results[0].value;
            console.log(resultLayerUrl)
            //将结果图层添加到地图视图中显示
            var resultLayer = new Zondy.Map.GdbpLayer("光谷智慧交通", ["gdbp://MapGisLocal/wuhan/sfcls/"+resultLayerUrl], {
                ip: "127.0.0.1",
                port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089,
                isBaseLayer: false
            });
            console.log(map.getLayers().array_.length)
            changdu=map.getLayers().array_.length;
            if (map.getLayers().array_.length > changdu-1){
                map.removeLayer(map.getLayers().array_[changdu-1]);
                console.log(map.getLayers().array_.length)
                map.addLayer(resultLayer);
                // window.location.reload();
            } else
            {
                map.addLayer(resultLayer);

            }			//
            alert("裁剪成功")

        }
    }
}
/*==========================================要素查询===================================================*/
//分析失败回调
function AnalysisError(e) {
    //停止进度条
    //stopPressBar();
}
//分析成功后的回调
function AnalysisSuccess(data) {
    //停止进度条
    //stopPressBar();
    if (!data.results) {
        alert("缓冲失败，请检查参数！");
    } else {
        if (data.results.length != 0) {

            var resultLayerUrl = data.results[0].Value || data.results[0].value;
            //将结果图层添加到地图视图中显示
            console.log(resultLayerUrl);
            var resultLayer = new Zondy.Map.GdbpLayer("光谷智慧交通", [resultLayerUrl], {
                ip: "127.0.0.1",
                port: "6163", //访问IGServer的端口号，.net版为6163，Java版为8089,
                isBaseLayer: false
            });
            // 暂时不显示，找到合适的移除方法再显示
            map.addLayer(resultLayer);
        }
    }
    buffer_data = data;
}

//清除客户端分析结果信息
function clearA() {
    //停止进度条
    //stopPressBar();
    if (map.getLayers().array_.length > 1) {
        for (var i = map.getLayers().array_.length - 1; i > 0; i--) {
            map.removeLayer(map.getLayers().array_[i]);
        }
        window.location.reload();
    } else
        return;
}

/*========================================获取当前时间（如：2015-09-09-120000）===================================================*/
//当前日期加时间(如:2009-06-12-120000)
function getCurentTime() {
    var now = new Date();
    //获取当前年份
    var year = now.getFullYear();
    //获取当前月份
    var month = now.getMonth() + 1;
    //获取当前日期
    var day = now.getDate();
    //获取当前时刻
    var hh = now.getHours();
    //获取当前分钟
    var mm = now.getMinutes();
    //获取当前秒钟
    var ss = now.getSeconds();
    //将当前的日期拼串
    var clock = year + "-";
    if (month < 10)
        clock += "0";
    clock += month + "-";
    if (day < 10)
        clock += "0";
    clock += day + "-";
    if (hh < 10)
        clock += "0";
    clock += hh;
    if (mm < 10) clock += '0';
    clock += mm;
    if (ss < 10) clock += '0';
    clock += ss;
    return (clock);
}





