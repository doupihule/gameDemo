import BattleLogicalControler from "./BattleLogicalControler";
import InstancePlayer from "../instance/InstancePlayer";
import BattleFunc from "../../sys/func/BattleFunc";
import LevelFunc from "../../sys/func/LevelFunc";
import ViewTools from "../../../framework/components/ViewTools";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";
import PhysicsColliderExpand from "../../../framework/components/physics/PhysicsColliderExpand";
import UICompConst from "../../../framework/consts/UICompConst";

export default class BattleMapControler {
    private controller: BattleLogicalControler

    //当前的主车  根据主车的坐标去摆布地图
    public player: InstancePlayer;

    //瓦片的图层名称
    public tileName: string = "scene_main_01"

    /**
     * 地形类型数据
     * id: 地形类型id
     * model:string 对应的3d model 名字,  命名规则: terrain_id_半径
     * type:number 0,直线,1右转弯,-1左转弯.
     * length:int 长度. 如果是弯 填写0, 弯的长度是动态算的.直线是需要配的. 配置单位万分之一米.
     * area:int对应弯的角度 0-360
     * radio:int 对应弯的半径,  如果是直线配置0. 配置单位万分之一米.
     * signs:[vector<string>]附带的路标模型.是u3d里面的模型名字. 路标模型注意区分左路标和右路标以及不分左右的路标
     * 
     * 
     * 关卡 地形配置[vector<string>]:
     *  1;2;3;1;.... 
     * 
     * 场景装饰数据:
     * id:string
     * model:string对应3d model 名字  命名规则 decorate_id 
     * way: int方向. 1是 靠外赛道. -1是靠里赛道
     * offset:[vector<int>] 偏移量, . 对应到当前的地形模型中心点切线方向的距离,以及上下偏移.
     * 
     * 关卡装饰配置[vector<string>]: 和地形配置的序号对应,0表示空.表示没有装饰. 每一个地形可以配置多个装饰
     * 1,2,3;  4,5,6  ;0;  表示第一个地形带装饰1,2,3 第二个地形带装饰4,5,6.第三个地形没有装饰.
     * 
     */

    //地形view缓存 
    /**
     *[
            //对应的地形序号, 对应的road view数组,decoration装饰, sign标识
             {road:[], decoration:[],sign:[],prop:[]  } 
        ] 
     * 
     * 
     * 
     */

    private _mapSpriteCache: any

    //地形数组
    private _terrainIndexArr: any[];
    //场景装饰数组
    private _sceneDecoration: any

    //地面容器. 主要针对 草皮
    public _landSp: Base3dViewExpand;
    private _terrainSp: Base3dViewExpand;
    private _signSp: Base3dViewExpand;
    private _decorationSp: Base3dViewExpand;

    //初始的弧度
    private _startAngle: number = 0;

    //当前的index
    private _currentIndex: number = 0
    //特殊地形数组, 比如 关卡开始结束的view 
    private _specailViewArr: any[]

    private _sky;


    constructor(controller) {
        this.controller = controller;
        this._mapSpriteCache = []
        this._specailViewArr = [];
        this._landSp = ViewTools.create3dContainer("_landSp");
        this._landSp.name = "landSp";
        this._terrainSp =  ViewTools.create3dContainer("_terrainSp");
        this._terrainSp.name = "terrainSp"
        this._signSp = ViewTools.create3dContainer("_signSp");
        this._signSp.name = "signSp";
        this._decorationSp = ViewTools.create3dContainer("_decorationSp");
        this._decorationSp.name = "decorationSp"
    }

    //初始化设置数据
    public setData(data) {

        var allInfo = LevelFunc.instance.getLevel();
        var info = allInfo.scenes[0].level["level_" + data.levelId];

        var idList = {};
        for (var index in info) {
            var objectInfo = info[index];
            if (idList[objectInfo]) {
                idList[objectInfo]++;
            }
            else {
                idList[objectInfo] = 1;
            }
            objectInfo.id = idList[objectInfo];
        }

        var elementField = this.controller.battlePrefab.getChildByName("element_field") as Base3dViewExpand;
        var elementGroup = this.controller.battlePrefab.getChildByName("element_group") as Base3dViewExpand;
        var elementGroupRigid = this.controller.battlePrefab.getChildByName("element_group_rigid") as Base3dViewExpand;

        var shadow = elementGroup.getChildByName("shadow") as Base3dViewExpand;

        var staticElement = this.controller.battlePrefab.getChildByName("static_element");
        var childNums = staticElement.numChildren
        for (var s = 0; s < childNums; s++) {
            var object = staticElement.getChildAt(s);
            var rigids: PhysicsColliderExpand = object.getComponent(UICompConst.comp_collider) as PhysicsColliderExpand;
            rigids.collisionGroup = 32;
        }

        if (!this.controller.line)
            this.controller.line = this.controller.battlePrefab.getChildByName("element_group").getChildByName("line");

        for (var index in info) {
            var objectInfo = info[index];
            var obj: Base3dViewExpand;
            var rigid;
            if (objectInfo.param.weight > 0) {
                objectInfo.param.move = "T";
                obj = elementGroupRigid.getChildByName(objectInfo.name) as Base3dViewExpand
                rigid = obj.getComponent(UICompConst.comp_rigidbody3d);
            }
            else {
                object = (elementGroup.getChildByName(objectInfo.name) as Base3dViewExpand)//.clone() as Base3dViewExpand;
                rigid = obj.getComponent(UICompConst.comp_collider);
            }
            if (objectInfo.type == "Target") {
                rigid.collisionGroup = 32;
            }
            else {
                rigid.collisionGroup = 16;
            }
            if (objectInfo.type == "Player") {
                this.controller.player = this.controller.createPlayer(objectInfo, obj, shadow);
            }
            else {
                this.controller.createRole(objectInfo, obj, shadow);
            }
        }



        // this.player = this.controller.player;
        // this._terrainIndexArr = BattleSceneManager.instance.roadListArr;
        // //场景装饰
        // var tempArr = this.controller.levelCfgData.sceneDecoration
        // this._sceneDecoration = {};
        // if(tempArr && tempArr.length > 0){
        //     tempArr = TableUtils.turnCsvArrToGameArr(tempArr);
        //     for(var i=0; i < tempArr.length; i++){
        //         var roadIndex = Number(tempArr[i][0]);
        //         this._sceneDecoration[roadIndex] = tempArr[i];
        //     }
        // }


        // var scene: Laya.Scene3D = this.controller.battleScene;
        // if (!scene.getChildByName("landSp")) {
        //     scene.addChildAt(this._landSp, 0);
        // }

        // if (!scene.getChildByName("terrainSp")) {
        //     scene.addChildAt(this._terrainSp, 0);
        // }

        // var tempP = BattleFunc.tempPoint2;
        // tempP.y = -10
        // tempP.x= 0;
        // tempP.z = 0;

        // // this.initOneView("scene_prop_shuimian",this._landSp,BattleFunc.originPoint,tempP,this._specailViewArr);
        // if (!scene.getChildByName("signSp")) {
        //     scene.addChildAt(this._signSp, 1);
        // }
        // if (!scene.getChildByName("decorationSp")) {
        //     scene.addChildAt(this._decorationSp, 2);
        // }
        // this._currentIndex = 0;
        // this._mapSpriteCache = [];
        // this.initMapInfo();
        // //初始化controler的mapinfo
        // this.onEnterNextTerrain(0);

        // //创建起跑线和终点线
        // // this.createStartAndEnd();

        // //在控制器里面注册一个刷新回调
        // this.controller.registObjUpdate(this.updateFrame,this);

    }

    //刷新函数 主要是用来处理动态的地图拼接
    public updateFrame() {
        var playerPos = this.controller.player.pos
        this._landSp.set3dPos(playerPos.x,-0.1,playerPos.z);
    }

    //销毁所有地形
    public destoryMap() {
    }

    public get decorationSp() {
        return this._decorationSp
    }




}