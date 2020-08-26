"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("../../../framework/utils/ScreenAdapterTools");
const SubPackageManager_1 = require("../../../framework/manager/SubPackageManager");
const SubPackageConst_1 = require("../../sys/consts/SubPackageConst");
const UserInfo_1 = require("../../../framework/common/UserInfo");
const ChapterFunc_1 = require("../../sys/func/ChapterFunc");
class ChapterMapControler {
    constructor(controler) {
        this.mapArr = [];
        // 当前地图块数量
        this.allMapCount = 3;
        // 总地图块数量
        this.totalMap = 3;
        //一块地图的高度
        this.itemHeight = 1400;
        this.offestY = 0;
        this.controler = controler;
    }
    //初始化设置数据 章节id
    setData(chapterId) {
        this.chapterData = ChapterFunc_1.default.instance.getCfgDatas("Chapter", chapterId);
        this.ctn1 = new Laya.Sprite();
        this.ctn1.y = -ScreenAdapterTools_1.default.sceneOffsetY - ScreenAdapterTools_1.default.UIOffsetY;
        this.controler.chapterLayerControler.a21.y = -ScreenAdapterTools_1.default.sceneOffsetY - ScreenAdapterTools_1.default.UIOffsetY;
        this.controler.chapterLayerControler.a1.addChild(this.ctn1);
        this.allMapCount = Math.ceil(this.chapterData.high / this.itemHeight);
        this.controler.chapterLayerControler.maxHeight = this.allMapCount * this.itemHeight;
        this.controler.chapterLayerControler.showHeight = this.chapterData.high;
        this.controler.chapterLayerControler.setMinY(ScreenAdapterTools_1.default.height - this.allMapCount * this.itemHeight);
        this.createMap();
        this.offestY = this.controler.chapterLayerControler.showHeight - this.controler.chapterLayerControler.maxHeight;
    }
    //创建地图
    createMap() {
        var name = this.chapterData.sceneName;
        for (var i = this.allMapCount; i > 0; i--) {
            var image = new Laya.Image();
            var imageUrl1;
            if (UserInfo_1.default.isSystemNative()) {
                imageUrl1 = "map/" + name + "/" + name + "_0" + i + ".png";
            }
            else {
                imageUrl1 = "map/" + name + "/" + name + "/" + name + "_0" + i + ".png";
                image.scale(2, 2);
            }
            this.ctn1.addChild(image);
            image.y = (this.allMapCount - i) * this.itemHeight;
            this.mapArr.push({ view: image });
            var onMapComplete = () => {
                image.skin = imageUrl1;
            };
            if (SubPackageManager_1.default.getPackStyle(SubPackageConst_1.default.packName_map) == SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
                SubPackageManager_1.default.loadDynamics(name, "map/" + name + "/" + name + "_0" + i, onMapComplete, this);
            }
            else {
                onMapComplete();
            }
        }
    }
    //销毁地图
    destoryOneLayer() {
        var infoArr = this.mapArr;
        for (var i = 0; i < infoArr.length; i++) {
            var view = infoArr[i].view;
            view.removeSelf();
            if (UserInfo_1.default.isSystemNative()) {
                //对图片做销毁处理
                view.dispose();
            }
        }
        this.ctn1.removeSelf();
        if (!UserInfo_1.default.isSystemNative()) {
            Laya.loader.clearRes("res/atlas/map/" + this.chapterData.sceneName + "/" + this.chapterData.sceneName + ".atlas");
            Laya.loader.clearRes("res/atlas/map/" + this.chapterData.sceneName + "/" + this.chapterData.sceneName + ".png");
        }
    }
    // 当地图发生运动
    onMapMove(pos = 0) {
        this.updateOneLayer(pos);
    }
    //根据速度运动
    updateOneLayer(pos) {
        this.ctn1.y += pos;
    }
    //销毁所有地形
    destoryMap() {
        this.destoryOneLayer();
    }
    dispose() {
        this.destoryMap();
        this.controler = null;
    }
}
exports.default = ChapterMapControler;
//# sourceMappingURL=ChapterMapControler.js.map