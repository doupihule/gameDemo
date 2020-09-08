import ResourceConst from "../consts/ResourceConst";
import BattleLogicalControler from "../../battle/controler/BattleLogicalControler";
import BattleFunc from "../func/BattleFunc";
import Message from "../../../framework/common/Message";
import BattleEvent from "../event/BattleEvent";
import WindowManager from "../../../framework/manager/WindowManager";
import { WindowCfgs } from "../consts/WindowCfgs";
import TimerManager from "../../../framework/manager/TimerManager";
import LevelFunc from "../func/LevelFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import PoolTools from "../../../framework/utils/PoolTools";
import PoolCode from "../consts/PoolCode";
import TableUtils from "../../../framework/utils/TableUtils";
import LogsErrorCode from "../../../framework/consts/LogsErrorCode";
import UserModel from "../model/UserModel";
import { LoadingUI } from "../view/loading/LoadingUI";
import ResourceManager from "../../../framework/manager/ResourceManager";
import CameraExpand from "../../../framework/components/d3/CameraExpand";
import Base3dViewExpand from "../../../framework/components/d3/Base3dViewExpand";
import ImageExpand from "../../../framework/components/ImageExpand";
import ViewTools from "../../../framework/components/ViewTools";
import BaseContainer from "../../../framework/components/BaseContainer";
import ResourceCommonConst from "../../../framework/consts/ResourceCommonConst";
import Client from "../../../framework/common/kakura/Client";
import VectorTools from "../../../framework/utils/VectorTools";
import UICompConst from "../../../framework/consts/UICompConst";


export default class BattleSceneManager {
    //实例
    private static _instance: BattleSceneManager;

    public static get instance() {
        if (!this._instance) {
            this._instance = new BattleSceneManager();
        }
        return this._instance;
    }

    public scene: Base3dViewExpand;
    public prefab: Base3dViewExpand;
    public battleCamera: CameraExpand

    public cameraCtn:Base3dViewExpand;

    //主场景拿着游戏控制器 
    public battleControler: BattleLogicalControler;
    private _levelData: any;

    private _isInBattle: boolean = false;
    private _cacheSpriteMap: any;

    //主要的sprite 用来做clone的
    public mainSprite: Base3dViewExpand;
    public mainSpriteRigid: Base3dViewExpand ;
    //当前关卡地形数组
    public roadListArr: any[];

    constructor() {
        //初始化全局变量配置
        BattleFunc.initGlobalParams();
    }

    /*进入战斗
        @param data 根据游戏自己定义 比如 levelid
    */

    //进入战斗
    public enterBattle(data) {
        // data = {id:"1"}
        this._isInBattle = true;
        this._levelData = data;
        //播放背景音乐
        // SoundManager.playBGM(MusicConst.MUSIC_BGM);
        //打开loadingui

        LogsManager.echo("-进入战斗")
        //打开战斗界面

        // WindowManager.SwitchUI(WindowCfgs.BattleUI, [WindowCfgs.GameMainUI, WindowCfgs.StageSelectUI], data);
        this.startLoadBattleRes(data);

    }

    //重玩 
    public replayBattle() {
        //先退出战斗 在直接进入战斗
        if (this.battleControler) {
            this.battleControler.exitBattle();
        }
        this.checkEnterBattle();
    }



    //加载战斗场景资源
    public startLoadBattleRes(data) {
        var modelList = [];

        modelList.push("bullet_01");

        this.startLoadScene(modelList);

    }


    //开始加载场景
    public startLoadScene(modelList = []) {

        var roleId = this._levelData.roleId;

        var resArr = [
            ResourceConst.EFFECT_EXPLODE,
            ResourceConst.EFFECT_BLOOD,
            ResourceConst.EFFECT_SHOOT,
        ]
        // var resArr = this.getCurModelArrByLevel();

        for (var index in modelList) {
            resArr.push(modelList[index])
        }

        //加载分包
        // LoadManager.instance.createPackAndRes(subArr, resArr, Laya.Handler.create(this, this.onSceneComplete));
        ResourceManager.loadMult3dmodel(resArr, ResourceConst.RESOURCE_MAINSCENE, this.onSceneComplete, this);
        // LoadManager.instance.create(resArr, Laya.Handler.create(this, this.onSceneComplete));

    }


    //场景加载完成
    private onSceneComplete() {

        // 加载地图
        // LoadManager.instance.load("mapcfg/map1.json", Laya.Handler.create(this, this.onMapCfgComplete));
        this.onMapCfgComplete();


    }

    private onMapCfgComplete() {
        //如果已经有战斗场景了 return
        if (!this.scene) {
            this.scene = GlobalData.stage;
            this.prefab = ViewTools.create3DModel(ResourceConst.RESOURCE_MAINSCENE, "Main",ResourceCommonConst.boundle_model3d);
            this.prefab .setActive(true);
            this.cameraCtn  = ViewTools.findObject("main_camera",UICompConst.comp_base3d);
            this.battleCamera = this.cameraCtn.getComponent(UICompConst.comp_camera) as CameraExpand;
            VectorTools.cloneTo((this.battleCamera.__owner as Base3dViewExpand).get3dRotation(),BattleFunc.cameraFollowRotation);
            this.scene.addChild(this.prefab);
        }
        this.mainSprite = this.prefab.getChildByName("element_group") as Base3dViewExpand;
        this.mainSprite.setActive(false);

        this.mainSpriteRigid = this.prefab.getChildByName("element_group_rigid") as Base3dViewExpand;
        this.mainSpriteRigid.setActive(false);
        //这里对地形资源做缓存
        var t1 = Client.instance.miniserverTime;
        // this.cacheSceneSprite();
        LogsManager.echo("xd cache sprite cost time:", Client.instance.miniserverTime - t1);

        //缓存3d特效

        //这里需要延迟1帧进入战斗.防止一瞬间做的时间太多导致卡顿
        TimerManager.instance.add(this.checkEnterBattle, this, 50, 1);
    }

    //缓存场景资源
    private cacheSceneSprite() {
        this._cacheSpriteMap = {};
        var cacheInfo = PoolTools.getModelItems(PoolCode.pool_model_scene);
        //先获取关卡配置
        var levelCfgs = LevelFunc.instance.getCfgDatas("Level", this._levelData.levelId);
        var terrainArr;//: string[] = BattleFunc.instance.turnRoadList(TableUtils.turnCsvArrToGameArr(levelCfgs.roadList));
        terrainArr = LevelFunc.instance.getLevel().scenes[0].level["level_" + this._levelData.levelId];
        if (!terrainArr) {
            terrainArr = [];
        }
        this.roadListArr = terrainArr
        //第一版先做全部缓存
        for (var i = 0; i < terrainArr.length; i++) {
            var terrainCfg = terrainArr[i];
            this.checkCacheModel(terrainCfg.name, BattleFunc.terrainShowNums + 2);
        }

        //装饰
        var decorateArr = levelCfgs.sceneDecoration
        if (decorateArr && decorateArr.length > 0) {
            decorateArr = TableUtils.turnCsvArrToGameArr(decorateArr, false);
            for (var i = 0; i < decorateArr.length; i++) {
                var tempArr = decorateArr[i];
                for (var ii = 1; ii < tempArr.length; ii++) {
                    var id = tempArr[ii];
                    //如果装饰不为0 
                    if (id != 0) {
                        var decoratecfg = BattleFunc.instance.getDecorateData(id);
                        this.checkCacheModel(decoratecfg.model, BattleFunc.terrainShowNums * 2);
                    }
                }
            }
        }


        //道具缓存



    }



    //判断是否需要缓存
    private checkCacheModel(model, maxNums = 9999) {
        var nums = this._cacheSpriteMap[model]
        if (!nums) {
            this._cacheSpriteMap[model] = 1;
        } else {
            //如果已经缓存超过最大数量了 不缓存了
            if (nums >= maxNums) {
                return
            }
            this._cacheSpriteMap[model] += 1;
        }
        nums = this._cacheSpriteMap[model]
        var cacheItems = PoolTools.getItems(model, PoolCode.pool_model_scene);
        //如果缓存的对象数量不够
        if (!cacheItems || cacheItems.length < nums) {
            var sp = this.getOneSceneView(model);
            sp.setActive(false);
            //缓存一个对象.方便战斗类里面直接拿
            PoolTools.cacheItem(model, sp, PoolCode.pool_model_scene);
        }
    }

    //获取场景里面的一个视图对象
    public getOneSceneView(viewName: string) {
        //这里需要将对象包一层.方便处理旋转
        var sp:Base3dViewExpand = this.mainSprite.getChildByName(viewName) as Base3dViewExpand;
        if (!sp) {
            LogsManager.errorTag(LogsErrorCode.BATTLE_RES_ERROR, "场景没有这个view:", viewName, "返回一个空sprite");
            return ViewTools.create3dContainer(viewName);
        }
        sp.set3dPos(0,0,0);
        sp = ViewTools.cloneOneView(sp) as Base3dViewExpand;
        var ctn =ViewTools.create3dContainer(viewName);
        ctn.addChild(sp);
        return ctn;
    }


    //判断是否进入战斗(这个时候代表资源已经加载完毕了)
    private checkEnterBattle() {
        //这个时候需要激活战斗场景
        this.scene.setActive(true) ;
        if (!this.battleControler) {
            this.battleControler = new BattleLogicalControler(this.scene, this.prefab);
        }
        this.battleControler.setData(this._levelData);
        //  WindowManager.CloseLoadingUI();
    }

    //退出战斗之后
    public exitBattle() {
        //取消激活战斗场景
        this.scene.setActive(false);
        this._isInBattle = false;
        if (this.battleControler) {
            //退出战斗
            this.battleControler.exitBattle();
        }
        // 发送退出战斗事件侦听
        Message.instance.send(BattleEvent.BATTLEEVENT_BATTLEEXIT)

    }
    /**获取本关所需要的所有模型arr */
    getCurModelArrByLevel(): string[] {
        //monsterList  根据ai车辆去判断加载哪些模型

        return [];
    }
    //判断是否在战斗中
    public isInBattle() {
        return this._isInBattle
    }



    recvMsg(e) {

    }
}