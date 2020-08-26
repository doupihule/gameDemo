import BattleLogicalControler from "./BattleLogicalControler";
import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import LogsManager from "../../../framework/manager/LogsManager";
import SubPackageManager from "../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../sys/consts/SubPackageConst";
import BattleFunc from "../../sys/func/BattleFunc";
import UserInfo from "../../../framework/common/UserInfo";

export default class BattleMapControler {
    private controler: BattleLogicalControler


    //地图信息  
    /**
     * 以256为一个单位
     * {
     *  front:{ length:512*4.5, info:[{view:view,posIndex:n(view的坐标=posIndex *256),index:1,3,5,7,9} ]        }
     *  land: 
     * 
     * }
     * 
     */
    //每块区域的宽度
    private _areaWidth: number = 256;

    private _pickNums: number = 4;
    /**一共有的地图块数 */
    private _allMapCount: number = 5;

    private _mapInfo: any;

    private mapName;
    private _mapX: number = 0;
    private _mapY: number = 0;
    /**128小地图的展示次数 */
    private _smallMapCount = 0;
    private startMapIndex = 1;
    /**两屏的背景宽度 */
    public _maxSceneWidth = 768 * 2
    //场景按照mapid整个缓存
    constructor(controler) {
        this.controler = controler;


    }

    //初始化设置数据 场景id
    public setData(sceneId) {
        LogsManager.echo("初始化战斗地图-------------------------")
        var sceneInfo = BattleFunc.instance.getCfgDatas("Scene", sceneId);
        var backInfo = sceneInfo.background;
        var mapName = backInfo[0];
        this.mapName = mapName;
        var mapStartIndex = Number(backInfo[1]);
        this.startMapIndex = mapStartIndex;
        var startOffest = Number(backInfo[2]);
        this._maxSceneWidth = sceneInfo.long;
        this.setMapSize();
        var ctn1 = new Laya.Sprite();
        ctn1.x = -ScreenAdapterTools.sceneOffsetX - ScreenAdapterTools.UIOffsetX - startOffest;
        this.controler.layerControler.a1.addChild(ctn1);
        this._mapInfo = {
            anchor: 0,
            infoArr: [],
            decorateArr: [],
            ctn: ctn1,
            initY: - (ScreenAdapterTools.maxHeight - ScreenAdapterTools.designHeight) / 2,
            speed: 0.5 //移动速度

        }

        for (var i = 1; i <= this._pickNums; i++) {
            //判断当前的图块id是否超了图块数量
            this.createOneView(mapName, i, mapStartIndex, this._mapInfo);
            mapStartIndex = mapStartIndex + 1 > this._allMapCount ? 1 : mapStartIndex + 1;
        }
        if (sceneInfo.Decoration) {
            this.createDecoration(sceneInfo.Decoration, mapName, ctn1)
        }
    }
    setMapSize() {
        this._pickNums = Math.ceil(this._maxSceneWidth / this._areaWidth / 2) + 1;
        this.controler.layerControler.setSceneInfo();
    }
    private createDecoration(arr, firstName, ctn) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var info = BattleFunc.instance.getCfgDatas("Decoration", item[0]);
            var path = "map/" + firstName + "/" + info.pic;

            var imageUrl1;
            if (UserInfo.isSystemNative()) {
                imageUrl1 = "map/" + firstName + "/" + info.pic + ".png";
            } else {
                imageUrl1 = "map/" + firstName + "/" + firstName + "/" + info.pic + ".png";
            }

            var image = new Laya.Image();
            image.scale(info.scale / 10000, info.scale / 10000);
            ctn.addChild(image);
            this._mapInfo.decorateArr.push({ view: image })
            if (this.startMapIndex != 1) {
                var missWidth = (this.startMapIndex - 1) * 256 * 2;
                if (Number(item[1]) - missWidth < 0) {
                    image.x = 256 * 9 - missWidth + Number(item[1]);
                } else {
                    image.x = Number(item[1]) - missWidth;
                }
            } else {
                image.x = Number(item[1]);
            }
            image.y = -Number(item[2]);
            var onMapComplete = () => {
                image.skin = imageUrl1;
            }
            //必须地图组是分包的就直接走;
            if (SubPackageManager.getPackStyle(SubPackageConst.packName_map) == SubPackageConst.PATH_STYLE_SUBPACK) {
                SubPackageManager.loadDynamics(firstName, path, onMapComplete, this);
            } else {
                onMapComplete();
            }

        }
    }

    //销毁地图
    private destoryOneLayer(mapInfo: any) {
        var infoArr: any[] = mapInfo.infoArr;
        for (var i = 0; i < infoArr.length; i++) {
            var view: Laya.Image = infoArr[i].view;
            view.removeSelf();
            if (UserInfo.isSystemNative()) {
                view.dispose()
            }

        }
        var decorateArr: any[] = mapInfo.decorateArr;

        for (var i = 0; i < decorateArr.length; i++) {
            var view: Laya.Image = decorateArr[i].view;
            view.removeSelf();
            if (UserInfo.isSystemNative()) {
                view.dispose()
            }
        }


        if (!UserInfo.isSystemNative()) {
            Laya.loader.clearRes("res/atlas/map/" + this.mapName + "/" + this.mapName + ".atlas")
            Laya.loader.clearRes("res/atlas/map/" + this.mapName + "/" + this.mapName + ".png")
        }


        mapInfo.ctn.removeSelf();
    }


    private createOneView(firstName, index, mapId, mpInfo) {
        var imageUrl1: string;

        var name: string;
        var path: string;
        name = firstName + "_0" + mapId;
        path = "map/" + firstName + "/" + name;

        var image = new Laya.Image();
        if (UserInfo.isSystemNative()) {
            //读大图、不打包
            imageUrl1 = "map/" + firstName + "/" + name + ".png";
            image.scale(1 + 2 / 256, 1);
        } else {
            imageUrl1 = "map/" + firstName + "/" + firstName + "/" + name + ".png";
            image.scale(2 * (1 + 2 / 128), 2);
        }

        mpInfo.ctn.addChild(image);
        var posIndex = (index - 1) * 2;
        var xpos = posIndex * this._areaWidth - this._smallMapCount * 256;
        if (mapId == 5) {
            this._smallMapCount += 1;
        }
        image.anchorX = 0;
        image.anchorY = mpInfo.anchor;
        image.x = xpos;
        image.y = 0;
        var viewInfo = { view: image };
        mpInfo.infoArr.push(viewInfo);
        var onMapComplete = () => {
            image.skin = imageUrl1;
        }
        //必须地图组是分包的就直接走;
        if (SubPackageManager.getPackStyle(SubPackageConst.packName_map) == SubPackageConst.PATH_STYLE_SUBPACK) {
            SubPackageManager.loadDynamics(firstName, path, onMapComplete, this);
        } else {
            onMapComplete();
        }
        LogsManager.echo("id:", mapId, "pos:", xpos)

    }




    // 当地图发生运动
    public onMapMove(targety, pos = 0) {
        this._mapY = targety;
        this.updateOneLayer(this._mapInfo, targety, pos)
    }

    //根据速度运动
    private updateOneLayer(mapInfo, targety = 0, pos) {
        mapInfo.ctn.x += pos;
    }

    //销毁所有地形
    public destoryMap() {
        this.destoryOneLayer(this._mapInfo);
    }
    dispose() {
        this.destoryMap();
        this._mapInfo = null;
        this.controler = null;
    }

}
