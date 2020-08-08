var map;
var layerArr;
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
    map = new ol.Map({
        layers: [layer1, layer2],
        target: 'mapCon',
        view: new ol.View({
            projection: ol.proj.get('EPSG:4326'),
            center: [114.3936, 30.5083], // 地图中心
            maxZoom: 18,
            minZoom: 5,
            zoom: 14,
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

        while (layers.length) map.removeLayer(layers[0]);
        if (uid == 1) {
            map.addLayer(layerArr[2]);
            map.addLayer(layerArr[3]);
            this.className = "changeLayer styleB";
            document.querySelector(".container>.coordinate>.coor").style.color = "#fff";
        } else {
            map.addLayer(layerArr[0]);
            map.addLayer(layerArr[1]);
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
        view.setCenter([114.3936, 30.5083]);
        view.setZoom(14);
    })
})();
(function () {
    document.addEventListener("keyup", function (e) {
        if (e.key !== "q") return;

        window.location.href="/logout";
    })
})();

// TODO 工具栏特效
(function () {
    // 水平收缩工具栏
    var elem = document.getElementById("switch");

    elem.onclick = function () {
        if (this.dataset.switchValue == "off") {
            this.parentElement.style.marginRight = "0";
            this.dataset.switchValue = "on";
            setTimeout(() => {
                this.innerHTML = "&#xe6a3;";
            }, 400);
            return;
        }
        this.parentElement.style.marginRight = "-606px";
        this.dataset.switchValue = "off";
        setTimeout(() => {
            this.innerHTML = "&#xe6db;";
        }, 400);
    };
    // 唤醒二级工具栏
    var toolA = document.getElementById("toolA");
    var toolB = document.getElementById("toolB");
    var toolASon = toolA.firstElementChild;
    var toolBSon = toolB.firstElementChild;

    toolA.addEventListener("mouseover", () => {
        toolASon.style.display = "block";
    }, false);
    toolB.addEventListener("mouseover", () => {
        toolBSon.style.display = "block";
    }, false);
    toolA.addEventListener("mouseout", () => {
        toolASon.style.display = "none";
    }, false);
    toolB.addEventListener("mouseout", () => {
        toolBSon.style.display = "none";
    }, false);
})();

// TODO 使用中 特效
(function () {
    var container = document.getElementById("container");
    container.addEventListener("click", inUseing, false);

    function inUseing(e) {
        if (!e.target.lastElementChild) return;
        if (e.target.lastElementChild.nodeName != "IMG") return;

        var img = e.target.lastElementChild;
        img.dataset.dataSwitch = img.dataset.dataSwitch == "on" ? "off" : "on";
        img.style.display = img.dataset.dataSwitch == "on" ? "inline-block" : "none";
    }
})();

// TODO 工具
(function () {
    // 报告路况
    var traReportBtn = document.getElementById("traReportBtn");
    var traReportBox = document.getElementById("traReportBox");

    traReportBtn.onclick = () => {
        traReportBox.dataset.switchValue = traReportBox.dataset.switchValue == "on" ? "off" : "on";
        traReportBox.style.display = traReportBox.dataset.switchValue == "on" ? "block" : "none";
    };

    // 路况信息
    var traInfoBtn = document.getElementById("traInfoBtn");
    traInfoBtn.onclick = () => {
        window.open("/road");
    };
    // 查看公告
    var checkAfficheBtn = document.getElementById("checkAfficheBtn");
    checkAfficheBtn.onclick = () => {
        window.open("/notice");
    }


})();

