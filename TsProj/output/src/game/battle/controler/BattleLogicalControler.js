"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleLayerControler_1 = require("./BattleLayerControler");
const BattleControler_1 = require("./BattleControler");
const RefreshControler_1 = require("./RefreshControler");
const InstanceHero_1 = require("../instance/InstanceHero");
const InstanceMonster_1 = require("../instance/InstanceMonster");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const Message_1 = require("../../../framework/common/Message");
const BattleEvent_1 = require("../../sys/event/BattleEvent");
const RandomUtis_1 = require("../../../framework/utils/RandomUtis");
const LevelFunc_1 = require("../../sys/func/LevelFunc");
const InstanceEffect_1 = require("../instance/InstanceEffect");
const BattleMapControler_1 = require("./BattleMapControler");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const SoundManager_1 = require("../../../framework/manager/SoundManager");
const BattleStatisticsControler_1 = require("./BattleStatisticsControler");
const BattleRoleView_1 = require("../view/BattleRoleView");
const RoleHealthBar_1 = require("../view/RoleHealthBar");
const BuffTrigger_1 = require("../trigger/BuffTrigger");
const InstanceBullet_1 = require("../instance/InstanceBullet");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const InstancePlayer_1 = require("../instance/InstancePlayer");
const BattleSkillData_1 = require("../data/BattleSkillData");
const ChooseTrigger_1 = require("../trigger/ChooseTrigger");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const ResourceConst_1 = require("../../sys/consts/ResourceConst");
const PassiveSkillData_1 = require("../data/PassiveSkillData");
const PassiveSkillTrigger_1 = require("../trigger/PassiveSkillTrigger");
const BattleGuideControler_1 = require("./BattleGuideControler");
const Client_1 = require("../../../framework/common/kakura/Client");
const InstanceHome_1 = require("../instance/InstanceHome");
const GlobalParamsFunc_1 = require("../../sys/func/GlobalParamsFunc");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const RolesModel_1 = require("../../sys/model/RolesModel");
const RoleBuffBar_1 = require("../view/RoleBuffBar");
const ConditionTrigger_1 = require("../trigger/ConditionTrigger");
const FogFunc_1 = require("../../sys/func/FogFunc");
const FogModel_1 = require("../../sys/model/FogModel");
const GameConsts_1 = require("../../sys/consts/GameConsts");
/**
 * 战斗控制器  控制战斗流程刷新. 以及所有对象的创建缓存销毁
 *
 *
 *
 */
class BattleLogicalControler extends BattleControler_1.default {
    constructor(ctn, ui, gameMode = 1) {
        super(ctn);
        //游戏模式 分自动战斗或者boss战
        this.gameMode = BattleConst_1.default.battle_game_mode_auto;
        //有坐标发生变化
        this.hasPosDirty1 = false;
        this.hasPosDirty2 = false;
        this.frontPos1 = 0;
        this.startTime = 0;
        /**是否游戏结束 */
        this.isGameOver = false;
        /**复活次数 */
        this.reviveCount = 0;
        /**是否处于远征复活战斗中 */
        this.inFogReviveBattle = false;
        /**是否处于超时复活战斗中 */
        this.inOverTimeRevive = false;
        /**是否处于战败复活战斗中 */
        this.inDefeatRevive = false;
        /**技能cd 默认是有cd的 */
        this.battleSkillnoCd = false;
        this.gameMode = gameMode;
        this.isGameOver = false;
        BuffTrigger_1.default.init();
        Message_1.default.instance.add(BattleEvent_1.default.BATTLEEVENT_CONTINUE_BATTLE, this);
        this.campArr_1 = [];
        this.campArr_2 = [];
        this.diedArr_1 = [];
        this.diedArr_2 = [];
        this.battleUI = ui;
        //初始化全局光环类的被动
        this.globalPassiveAttrMap = [];
        var time = Laya.Browser.now();
        BattleLogsManager_1.default.battleEcho("battle 设置随机种子:", time, "用来做复盘用");
        RandomUtis_1.default.setOneRandomYinzi(time, BattleFunc_1.default.battleRandomIndex);
        this.refreshControler = new RefreshControler_1.default(this);
        this.mapControler = new BattleMapControler_1.default(this);
        this.statistControler = new BattleStatisticsControler_1.default(this);
        this.layerControler = new BattleLayerControler_1.BattleLayerControler(this, ctn);
        this.guideControler = new BattleGuideControler_1.default(this);
        this.passive = null;
        //全局属性加成
        this.globalAttrMap = {};
    }
    //设置数据
    setData(data) {
        //初始化统计控制器
        this.statistControler.setData();
        this.battleData = data;
        this.battleState = BattleConst_1.default.battleState_in;
        this.frontPos1 = 0;
        this._isGamePause = false;
        this.tweenControler.setData();
        this.startTime = Client_1.default.instance.serverTime;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            this.setNormalMap();
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.setWarMap();
        }
        //摄像头初始化位置
        this.cameraControler.updateCtnPos();
    }
    //普通地图
    setNormalMap() {
        this.levelCfgData = LevelFunc_1.default.instance.getLevelInfoById(this.battleData.levelId);
        this.mapControler.setData(this.levelCfgData.sceneId || "1");
    }
    //远征地图
    setWarMap() {
        var mapId;
        if (FogFunc_1.default.enemyCell) {
            var event = FogFunc_1.default.enemyCell.eventData;
            mapId = FogFunc_1.default.instance.getCfgDatasByKey("Enemy", event.params[0], "sceneId");
        }
        else {
            LogsManager_1.default.errorTag("", "没有当前的敌人事件格子");
        }
        this.mapControler.setData(mapId || "1");
    }
    //初始化游戏
    initGame() {
        this.cameraControler.setData();
        this.refreshControler.initData();
        Message_1.default.instance.send(BattleEvent_1.default.BATTLEEVENT_BATTLESTART);
        Laya.timer.frameLoop(1, this, this.onceUpdateFrame);
    }
    //重写逐帧刷新
    updateFrame() {
        if (this._isGamePause) {
            return;
        }
        if (this._isDisposed) {
            return;
        }
        super.updateFrame();
        this.freshHelpRoleCd();
    }
    /**刷新助阵英雄的cd */
    freshHelpRoleCd() {
        if (this.helpRoleLeftCd < 0)
            return;
        if (this.helpRoleLeftCd % GameConsts_1.default.gameFrameRate == 0) {
            this.battleUI.freshHelpRoleState(this.helpRoleLeftCd / GameConsts_1.default.gameFrameRate);
        }
        this.helpRoleLeftCd -= 1;
    }
    //当有角色移动时
    oneRoleMove(instance) {
        if (instance.camp == 1) {
            if (!this.frontPos1) {
                this.frontPos1 = instance.pos.x;
            }
            else {
                if (this.frontPos1 < instance.pos.x) {
                    this.frontPos1 = instance.pos.x;
                }
            }
        }
    }
    /**有角色死亡时，重新选取一遍最前边的位置 */
    checkAllRolePos() {
        this.frontPos1 = this.myHome.pos.x;
        for (var i = 0; i < this.campArr_1.length; i++) {
            var item = this.campArr_1[i];
            if (this.frontPos1 < item.pos.x) {
                this.frontPos1 = item.pos.x;
            }
        }
    }
    //播放音效, lastTime 持续时间,表示多久后关闭 -1表示永久循环 0表示只播放一次
    playSound(soundName, lastTime = -1) {
        // BattleLogsManager.battleEcho("battle play sound",soundName,lastTime)
        //@xdtest 暂时屏蔽声音
        if (lastTime == 0) {
            SoundManager_1.default.playSE(soundName, 1);
        }
        else {
            SoundManager_1.default.playSE(soundName, 0);
            if (lastTime > 0) {
                this.setCallBack(lastTime, this.stopSound, this, soundName);
            }
        }
    }
    //根据参数播放声音
    playSoundByParams(params) {
        this.playSound(params[2], Number(params[3]));
    }
    //停止某个音效
    stopSound(soundName) {
        SoundManager_1.default.stopMusicOrSound(soundName);
    }
    //---------------------------------------创建和销毁模块------------------------------------------------------
    //创建一个instance
    /**
     *
     * @param data  数据
     * @param cacheId 缓存id
     * @param model  对应的模块 , role ,monster,effect,bullet
     * @param classModel 对应的类对象
     * @param resName  对应需要加载的资源名
     * @param viewScale  视图缩放系数
     */
    createInstance(data, cacheId, model, classModel, resName, x, y, z, viewScale = 1, viewIndex = 0) {
        var instance = PoolTools_1.default.getItem(cacheId);
        // BattleLogsManager.battleEcho("battle", "创建实例:", resName, "model:", model, viewScale);
        if (instance) {
            //重置 instance的控制器
            instance.controler = this;
            instance.setPos(x, y, z);
            // 缩放有变化 重新设置动画的缩放值
            if (instance._myView && instance._myView._viewScale != viewScale) {
                instance._myView.setItemViewScale(viewScale);
            }
            instance.setData(data);
        }
        else {
            var view;
            instance = new classModel(this);
            instance.cacheId = cacheId;
            if (resName) {
                var expandView;
                var viewName = resName;
                //如果资源是字符串
                if (typeof resName == "string") {
                    view = new BattleRoleView_1.default(resName, viewScale, viewIndex, "battle");
                }
                else {
                    view = new BattleRoleView_1.default(resName[0], viewScale, viewIndex, "battle");
                    viewName = resName[0];
                    //部分角色或者怪物可能有2个视图.
                    if (resName.length > 1) {
                        expandView = new BattleRoleView_1.default(resName[1], viewScale, viewIndex);
                        instance.setView2(expandView);
                    }
                }
                // //先设置视图
                instance.setViewName(viewName);
                instance.setView(view);
            }
            instance.setPos(x, y, z);
            //设置数据
            instance.setData(data);
        }
        return instance;
    }
    //创建一个特效 {name:}
    createEffect(data) {
        var cacheId = PoolCode_1.default.POOL_EFFECT + data.id + data.index;
        var cacheItem = this.performanceControler.getCacheEffect(cacheId);
        if (!cacheItem) {
            cacheItem = this.createInstance(data, cacheId, BattleConst_1.default.model_effect, InstanceEffect_1.default, data.id, 0, 0, 0, BattleFunc_1.default.defaultScale);
        }
        else {
            cacheItem.setData(data);
        }
        return cacheItem;
    }
    //预缓存一个特效 .默认120秒后重新缓存
    preCreateEffect(name, frame = 10) {
        var eff = this.createEffect({ id: name, index: 0 });
        eff.setLastFrame(frame);
        //把这个特效放到天边去
        eff.setPos(10000, 100000, 10000);
    }
    //创建一个子弹 
    createBullet(id, owner, skillAction, x, y, rotation, targetRole, offz = 0) {
        var cacheId = PoolCode_1.default.POOL_BUTTLE + id;
        var resname = BattleFunc_1.default.instance.getCfgDatasByKey("Bullet", id, "model", true);
        var data = { id: id };
        var cacheItem = this.createInstance(data, cacheId, BattleConst_1.default.model_bullet, InstanceBullet_1.default, resname, x, y, owner.pos.z + offz, BattleFunc_1.default.defaultScale * owner.cfgScale);
        cacheItem.setOwner(owner, skillAction, rotation, targetRole);
        cacheItem.setZorderOffset(owner.zorderOffset);
        this._allInstanceArr.push(cacheItem);
        if (cacheItem.getView()) {
            this.layerControler.a22.addChild(cacheItem.getView());
        }
        return null;
    }
    //创建一个角色
    createRole(id, data, lifeType, camp, offestX = 0, offestY = 0) {
        //角色的缓存id 还要拼一下lifeType，用来存不同阵营不同类型
        var cacheId = PoolCode_1.default.POOL_ROLE + id + "_" + data.level + "_" + data.starLevel + "_" + lifeType + "_" + camp;
        var scale = 1;
        var resname = "role_1002";
        if (!data.id) {
            data.id = id;
        }
        var modelName;
        var classObj;
        var cfgs = BattleFunc_1.default.instance.getCfgDatas("Role", id);
        //判断是我方角色还是敌方的
        if (camp == BattleConst_1.default.ROLEGROUP_MYSELF) {
            modelName = BattleConst_1.default.model_role;
            classObj = InstanceHero_1.default;
        }
        else {
            modelName = BattleConst_1.default.model_monster;
            classObj = InstanceMonster_1.default;
        }
        resname = cfgs.spine;
        scale = cfgs.scale / 10000 || 1;
        // resname = "role_11"
        var tempPos = BattleFunc_1.default.tempPoint;
        this.getPosByTypeAndCamp(camp, lifeType, tempPos, offestX, offestY, cfgs.warHeroplace || 1);
        var ypos = 0;
        if (lifeType == BattleConst_1.default.LIFE_AIRHERO) {
            ypos = -BattleFunc_1.default.airArmyHigh;
            if (!BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_AIRHERO]) {
                BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_AIRHERO] = 0;
            }
            BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_AIRHERO] = BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_AIRHERO] + 1 > BattleFunc_1.default.landArmyStartYLocation.length - 1 ? 0 : BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_AIRHERO] + 1;
        }
        else {
            if (!BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_LANDHERO]) {
                BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_LANDHERO] = 0;
            }
            BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_LANDHERO] = BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_LANDHERO] + 1 > BattleFunc_1.default.landArmyStartYLocation.length - 1 ? 0 : BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_LANDHERO] + 1;
        }
        var viewIndex = BattleFunc_1.default.instance.getCfgDatasByKey("RoleUpdate", id, data.level || 1).body || 0;
        if (camp == BattleConst_1.default.ROLEGROUP_ENEMY && BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            //远征战斗敌人的皮肤强制用 9
            viewIndex = 9;
        }
        var cacheItem = this.createInstance(data, cacheId, modelName, classObj, resname, tempPos.x, ypos, tempPos.z, BattleFunc_1.default.defaultScale * scale, viewIndex);
        //把角色添加到a22
        this.layerControler.a22.addChild(cacheItem.getView());
        //
        if (cacheItem._myView2) {
            this.layerControler.a22.addChild(cacheItem._myView2);
        }
        this._allInstanceArr.push(cacheItem);
        cacheItem.setCamp(camp);
        this["campArr_" + camp].push(cacheItem);
        cacheItem.setLifeType(lifeType);
        //给这个角色执行全局被动
        PassiveSkillTrigger_1.default.runAllPassiveGlobalAttr(this.globalPassiveAttrMap, cacheItem, 1);
        if (camp == BattleConst_1.default.ROLEGROUP_ENEMY) {
            cacheItem.setViewWay(-1);
        }
        else {
            cacheItem.setViewWay(1);
        }
        //拿到这个角色的所有被动
        var passiveSkills = cacheItem.passiveSkills;
        if (passiveSkills) {
            for (var i = 0; i < passiveSkills.length; i++) {
                this.insterGlobalPassive(passiveSkills[i]);
            }
        }
        //我方角色的一些操作
        if (camp == BattleConst_1.default.ROLEGROUP_MYSELF) {
            //豪华开局：己方所有角色被动加成
            if (this.battleUI.battleAdditionId && (this.battleUI.battleAdditionId == BattleConst_1.default.battle_start_attack_add || this.battleUI.battleAdditionId == BattleConst_1.default.battle_start_life_add)) {
                var battleAdditionId = this.battleUI.battleAdditionId;
                var skillId = LevelFunc_1.default.instance.getBattleAddtionoByTwoId(battleAdditionId, "addtionNub");
                var passive = new PassiveSkillData_1.default(skillId, 1, cacheItem, BattleConst_1.default.skill_kind_passive);
                this.insterGlobalPassive(passive);
                this.passive = passive;
            }
        }
        //远征模式敌方加被动
        if (camp == BattleConst_1.default.ROLEGROUP_ENEMY && BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            var level = FogModel_1.default.instance.getCurLayer() + 1;
            var passivSkill = data.passivSkill;
            if (passivSkill) {
                var passiveData;
                for (var i = 0; i < passivSkill.length; i++) {
                    passiveData = new PassiveSkillData_1.default(passivSkill[i], level, cacheItem, BattleConst_1.default.skill_kind_passive);
                    this.insterGlobalPassive(passiveData);
                }
            }
        }
        //需要重算一下所有属性
        if (cacheItem.attrData.hasDataChange) {
            cacheItem.attrData.countAllAttr();
        }
        if (camp == BattleConst_1.default.ROLEGROUP_MYSELF) {
            if (this.battleUI.battleAdditionId && this.battleUI.battleAdditionId == BattleConst_1.default.battle_start_life_add) {
                var battleAdditionId = this.battleUI.battleAdditionId;
                cacheItem.hp = cacheItem.attrData.getOneAttr(BattleConst_1.default.attr_maxHp);
            }
        }
        //如果是普通战斗或者复活赛中 直接加出生触发的被动
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL || this.inFogReviveBattle) {
            //当我出生时
            ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_createMySelf, cacheItem);
        }
        cacheItem.resetHp();
        cacheItem.hpBar = this.createHealthBar(cacheItem.camp, cacheItem);
        cacheItem.hpBar.followTarget();
        cacheItem.buffBar = this.createBuffBar(cacheItem.camp, cacheItem);
        cacheItem.buffBar.followTarget();
        this.oneRoleMove(cacheItem);
        return cacheItem;
    }
    createHome(id, data, lifeType, camp, offestX = 0, offestY = 0) {
        //角色的缓存id
        var cacheId = PoolCode_1.default.POOL_HOME + id + "_" + lifeType + "_" + camp;
        var scale = 1;
        var resname = "role_1000";
        if (!data.id) {
            data.id = id;
        }
        var modelName = BattleConst_1.default.model_home;
        var classObj = InstanceHome_1.default;
        var cfgs = BattleFunc_1.default.instance.getCfgDatas("Role", id);
        resname = cfgs.spine;
        scale = cfgs.scale / 10000 || 1;
        var tempPos = BattleFunc_1.default.tempPoint;
        if (camp == BattleConst_1.default.ROLEGROUP_MYSELF) {
            tempPos.x = GlobalParamsFunc_1.default.instance.getDataNum("myHomeLocation");
        }
        else {
            tempPos.x = this.mapControler._maxSceneWidth - GlobalParamsFunc_1.default.instance.getDataNum("enemyHomeLocation");
        }
        tempPos.z = BattleFunc_1.default.battleCenterY;
        var ypos = 0;
        var viewIndex = BattleFunc_1.default.instance.getCfgDatasByKey("RoleUpdate", id, data.level).body || 0;
        if (camp == BattleConst_1.default.ROLEGROUP_ENEMY && BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            //远征战斗敌人的皮肤强制用 9
            viewIndex = 9;
        }
        var cacheItem = this.createInstance(data, cacheId, modelName, classObj, resname, tempPos.x, ypos, tempPos.z, BattleFunc_1.default.defaultScale * scale, viewIndex);
        //把角色添加到a22
        this.layerControler.a22.addChild(cacheItem.getView());
        //
        if (cacheItem._myView2) {
            this.layerControler.a22.addChild(cacheItem._myView2);
        }
        this._allInstanceArr.push(cacheItem);
        cacheItem.setCamp(camp);
        cacheItem.setLifeType(lifeType);
        this["campArr_" + camp].push(cacheItem);
        //给这个角色执行全局被动
        PassiveSkillTrigger_1.default.runAllPassiveGlobalAttr(this.globalPassiveAttrMap, cacheItem, 1);
        if (camp == BattleConst_1.default.ROLEGROUP_ENEMY) {
            cacheItem.setViewWay(-1);
        }
        else {
            cacheItem.setViewWay(1);
        }
        //拿到这个角色的所有被动
        var passiveSkills = cacheItem.passiveSkills;
        if (passiveSkills) {
            for (var i = 0; i < passiveSkills.length; i++) {
                this.insterGlobalPassive(passiveSkills[i]);
            }
        }
        if (camp == BattleConst_1.default.ROLEGROUP_MYSELF) {
            //豪华开局：己方基地技能cd降低
            if (this.battleUI.battleAdditionId && this.battleUI.battleAdditionId == BattleConst_1.default.battle_start_homeCd) {
                var battleAdditionId = this.battleUI.battleAdditionId;
                var skillId = LevelFunc_1.default.instance.getBattleAddtionoByTwoId(battleAdditionId, "addtionNub");
                var passive = new PassiveSkillData_1.default(skillId, 1, cacheItem, BattleConst_1.default.skill_kind_passive);
                this.insterGlobalPassive(passive);
                this.passive = passive;
            }
            //远征模式：己方基地随等级提升攻击力和生命上限
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                var level = FogModel_1.default.instance.getBusLevel();
                var passiveSkillId = FogFunc_1.default.instance.getCfgDatasByKey("BusUpGrade_json", level, "passiveSkill");
                if (passiveSkillId) {
                    var passive = new PassiveSkillData_1.default(passiveSkillId, level, cacheItem, BattleConst_1.default.skill_kind_passive);
                    this.insterGlobalPassive(passive);
                }
            }
        }
        else {
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
                //普通模式敌方加全局被动
                var passiveSkillInfo = this.levelCfgData.passivSkill;
                if (passiveSkillInfo) {
                    var passive = new PassiveSkillData_1.default(passiveSkillInfo[0], Number(passiveSkillInfo[1]), cacheItem, BattleConst_1.default.skill_kind_passive);
                    this.insterGlobalPassive(passive);
                }
            }
        }
        //需要重算一下所有属性
        if (cacheItem.attrData.hasDataChange) {
            cacheItem.attrData.countAllAttr();
        }
        cacheItem.resetHp();
        cacheItem.hpBar = this.createHealthBar(cacheItem.camp, cacheItem);
        cacheItem.hpBar.followTarget();
        this.oneRoleMove(cacheItem);
        return cacheItem;
    }
    //创建召唤物
    createSummoned(id, data, x, z, fromRole, liveFrame = -1) {
        var cacheId = PoolCode_1.default.POOL_MONSTER + id + "_" + data.level + "_" + data.starLevel;
        // var resname = "role_1002"
        var cfgData = BattleFunc_1.default.instance.getCfgDatas("Role", id);
        var resname = cfgData.spine;
        if (!data.id) {
            data.id = id;
        }
        var scale = cfgData.scale / 10000;
        var viewIndex = BattleFunc_1.default.instance.getCfgDatasByKey("RoleUpdate", id, data.level).body || 0;
        var cacheItem = this.createInstance(data, cacheId, BattleConst_1.default.model_role, InstanceMonster_1.default, resname, x, 0, z, BattleFunc_1.default.defaultScale * scale, viewIndex);
        cacheItem.attrData.countSummonedAttr(data.level, fromRole.attrData);
        cacheItem.hp = cacheItem.maxHp;
        this._allInstanceArr.push(cacheItem);
        this.layerControler.a22.addChild(cacheItem.getView());
        if (cacheItem._myView2) {
            this.layerControler.a22.addChild(cacheItem._myView2);
        }
        cacheItem.setCamp(fromRole.camp);
        cacheItem.setLifeType(BattleFunc_1.default.instance.getCfgDatasByKey("Role", id, "kind"));
        fromRole.campArr.push(cacheItem);
        cacheItem.checkMoveOrAttack(true);
        cacheItem.setLiveFrame(liveFrame);
        //给这个角色执行全局被动
        PassiveSkillTrigger_1.default.runAllPassiveGlobalAttr(this.globalPassiveAttrMap, cacheItem, 1);
        //拿到这个角色的所有被动
        var passiveSkills = cacheItem.passiveSkills;
        if (passiveSkills) {
            for (var i = 0; i < passiveSkills.length; i++) {
                this.insterGlobalPassive(passiveSkills[i]);
            }
        }
        //需要重算一下所有属性
        if (cacheItem.attrData.hasDataChange) {
            cacheItem.attrData.countAllAttr();
        }
        cacheItem.resetHp();
        cacheItem.hpBar = this.createHealthBar(cacheItem.camp, cacheItem);
        this.oneRoleMove(cacheItem);
        return cacheItem;
    }
    //创建一个buff区域
    createBuffBar(camp, instance) {
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_BUFFBAR + camp);
        if (!cacheItem) {
            cacheItem = new RoleBuffBar_1.default();
        }
        cacheItem.setData(instance, this.layerControler.a23);
        return cacheItem;
    }
    //创建一个血条
    createHealthBar(camp, instance) {
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_HPBAR + camp);
        if (!cacheItem) {
            cacheItem = new RoleHealthBar_1.default();
        }
        cacheItem.setData(instance, this.layerControler.a23);
        return cacheItem;
    }
    /**创建基地技能容器 */
    createSkillContent(skillArr, parent) {
        var cacheId = PoolCode_1.default.POOL_PLAYERCONTENT;
        var item = PoolTools_1.default.getItem(cacheId);
        if (!item) {
            item = new InstancePlayer_1.default(this);
        }
        else {
            item.controler = this;
        }
        var data = TableUtils_1.default.copyOneTable(this.myHome.cfgData);
        item.setData(data);
        item.cacheId = cacheId;
        item.setSkillInfo(skillArr, parent);
        item.setCamp(BattleConst_1.default.ROLEGROUP_MYSELF);
        this._allInstanceArr.push(item);
        return item;
    }
    //创建一个技能数据.后面会为缓存做准备
    createSkillData(skillId, level, role, skillType, lifeType = null) {
        return new BattleSkillData_1.default(skillId, level, role, skillType, null, lifeType);
    }
    //创建一个被动技 后续扩展使用缓存
    createPassiveSkill(skillId, level, role, relyonSkill = null) {
        return new PassiveSkillData_1.default(skillId, level, role, BattleConst_1.default.skill_kind_passive, relyonSkill);
    }
    //创建影子 
    createShade() {
        var sp = PoolTools_1.default.getItem(PoolCode_1.default.POOL_SHADE);
        if (!sp) {
            sp = new Laya.Image(ResourceConst_1.default.BATTLE_SHADE);
            sp.anchorX = 0.5;
            sp.anchorY = 0.5;
        }
        sp.visible = true;
        sp.scale(1, 1);
        return sp;
    }
    //销毁一个实例
    destoryInstance(instance, outRemoveAllArr = false) {
        var cacheId = instance.cacheId;
        var model = instance.classModel;
        if (!instance.checkIsUsing()) {
            return;
        }
        //必须是没有缓存的我才放入缓存池. 比如特效 比较例外.因为有多个地方持有特效引用.导致会执行重复放入缓存逻辑
        if (!PoolTools_1.default.checkItemHasCache(cacheId, instance)) {
            //把instance放入缓存.
            PoolTools_1.default.cacheItem(cacheId, instance);
        }
        instance.onSetToCache();
        if (!outRemoveAllArr) {
            TableUtils_1.default.removeValue(this._allInstanceArr, instance);
        }
        if (model == BattleConst_1.default.model_effect) {
            this.performanceControler.removeCacheEffect(instance);
        }
        else if (model == BattleConst_1.default.model_role) {
            instance.destroyPoint();
            // this.player = null;
            TableUtils_1.default.removeValue(this.campArr_1, instance);
            TableUtils_1.default.removeValue(this.diedArr_1, instance);
        }
        else if (model == BattleConst_1.default.model_monster) {
            // this.player = null;
            instance.destroyPoint();
            TableUtils_1.default.removeValue(this.campArr_2, instance);
            TableUtils_1.default.removeValue(this.diedArr_2, instance);
        }
        else if (model == BattleConst_1.default.model_home) {
            instance.destroyPoint();
            TableUtils_1.default.removeValue(this.campArr_1, instance);
            TableUtils_1.default.removeValue(this.diedArr_1, instance);
            TableUtils_1.default.removeValue(this.campArr_2, instance);
            TableUtils_1.default.removeValue(this.diedArr_2, instance);
        }
        //清除这个对象注册的所有回调
        this.clearCallBack(instance);
    }
    //销毁一个怪物
    destoryMonster(monster) {
        if (!monster.checkIsUsing()) {
            return;
        }
        this.destoryInstance(monster);
        this.hasPosDirty2 = true;
    }
    //销毁主角 
    destoryHero(role) {
        if (!role.checkIsUsing()) {
            return;
        }
        var passives = role.passiveSkills;
        for (var i = passives.length - 1; i >= 0; i--) {
            //清除这条被动效果
            this.clearOnePassiveAttr(passives[i]);
        }
        this.destoryInstance(role);
        this.hasPosDirty1 = true;
    }
    //销毁一个子弹 
    destroyBullet(bullet) {
        if (!bullet.checkIsUsing()) {
            return;
        }
        this.destoryInstance(bullet);
    }
    //销毁一个特效
    destoryEffect(effect) {
        this.destoryInstance(effect);
    }
    //销毁一个数组的实例
    destoryInstanceArr(instanceArr, outRemoveAllArr = false) {
        for (var i = instanceArr.length - 1; i >= 0; i--) {
            if (instanceArr[i]) {
                this.destoryInstance(instanceArr[i], outRemoveAllArr);
            }
        }
    }
    /**
     * 创建我方角色
     * @param id 角色id
     * @param level 角色等级
     * @param starLevel 角色星级
     * @param type 角色类型 助阵角色/普通角色
     */
    createMyRole(id, level = 1, starLevel = null, type = null) {
        var data = BattleFunc_1.default.instance.getCfgDatas("Role", id);
        level = RolesModel_1.default.instance.getRoleLevelById(id);
        if (starLevel == null) {
            starLevel = RolesModel_1.default.instance.getRoleStarLevel(id);
        }
        var num = data.heroNub || 1;
        var offestX = 0;
        for (var j = 0; j < num; j++) {
            if (j != 0) {
                offestX = data.startSite[j];
            }
            this.createRole(id, { level: level, starLevel: starLevel, type: type }, data.kind, BattleConst_1.default.ROLEGROUP_MYSELF, offestX);
        }
    }
    //----------------------------外部接口--------------------------------------
    setPosX(posX) {
        return posX;
    }
    //获取坐标 输出到 outpos.x ,outpos.x,outpos.z
    getPosByTypeAndCamp(camp, type, outpos, offestX, offestY, xIndex = 1) {
        var targetX = 0;
        var targetY;
        //地面角色x读地面配置 y走循环
        if (type == BattleConst_1.default.LIFE_AIRHERO) {
            var posX = BattleFunc_1.default.airArmyStartXLocation;
            //远征的角色，读取站位坐标
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                posX = Number(BattleFunc_1.default.warRoleXoffest[xIndex - 1]);
            }
            if (camp == BattleConst_1.default.ROLEGROUP_ENEMY) {
                targetX = this.mapControler._maxSceneWidth - posX;
            }
            else {
                targetX = this.setPosX(posX);
            }
            targetX += offestX;
            var index = BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_AIRHERO] || 0;
            targetY = BattleFunc_1.default.battleCenterY + Number(BattleFunc_1.default.landArmyStartYLocation[index]) + offestY;
        }
        else {
            if (type == BattleConst_1.default.LIFE_LANDBUILD) {
                //电塔x
                var posX = BattleFunc_1.default.pylonStartXLocation;
                if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                    posX = Number(BattleFunc_1.default.warRoleXoffest[xIndex - 1]);
                }
                offestX = Math.random() * BattleFunc_1.default.pylonTwoLocation;
                if (camp == BattleConst_1.default.ROLEGROUP_ENEMY) {
                    targetX = this.mapControler._maxSceneWidth - posX + offestX;
                }
                else {
                    targetX = this.setPosX(posX) + offestX;
                }
            }
            else {
                var posX = BattleFunc_1.default.landArmyStartXLocation;
                if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                    posX = Number(BattleFunc_1.default.warRoleXoffest[xIndex - 1]);
                }
                if (camp == BattleConst_1.default.ROLEGROUP_ENEMY) {
                    targetX = this.mapControler._maxSceneWidth - posX;
                }
                else {
                    targetX = this.setPosX(posX);
                }
                targetX += offestX;
            }
            var index1 = BattleFunc_1.default.CreateRoleIndex[BattleConst_1.default.LIFE_LANDHERO] || 0;
            targetY = BattleFunc_1.default.battleCenterY + Number(BattleFunc_1.default.landArmyStartYLocation[index1]) + offestY;
        }
        ;
        if (isNaN(targetY)) {
            LogsManager_1.default.errorTag("无效的z坐标", "无效的z坐标");
        }
        outpos.x = targetX;
        outpos.z = targetY;
        return outpos;
    }
    //根据id获取role
    getRoleById(id) {
        for (var i = 0; i < this.campArr_1.length; i++) {
            var role = this.campArr_1[i];
            if (role.dataId == id) {
                return role;
            }
        }
        for (var i = 0; i < this.diedArr_1.length; i++) {
            var role = this.diedArr_1[i];
            if (role.dataId == id) {
                return role;
            }
        }
        return null;
    }
    //点击某个角色技能
    onClickRole(rid) {
        var role = ChooseTrigger_1.default.getPlayerById(rid, this.campArr_1);
        if (role) {
            role.onCheckGiveEnergySkill();
        }
    }
    //------------------------------全局属性------------------------------------------------
    //插入一条被动属性  isJustRun是否立即加成被动属性. 返回是否执行成功.决定是否需要重算战力
    insterGlobalPassive(passive) {
        var type = passive.cfgData.effectType;
        if (type != BattleConst_1.default.passive_effect_global_attr) {
            return false;
        }
        //如果未激活 不用执行
        if (!passive.isActive) {
            return false;
        }
        for (var i = this.globalPassiveAttrMap.length - 1; i >= 0; i--) {
            var info = this.globalPassiveAttrMap[i];
            //如果相同id的 先做移除
            if (info.passive._skillId == passive._skillId) {
                this.clearOnePassiveAttr(passive);
            }
        }
        var attrInfo = TableUtils_1.default.deepCopy(passive.skillLogicalParams, []);
        var map = { attr: attrInfo, passive: passive };
        this.globalPassiveAttrMap.push(map);
        PassiveSkillTrigger_1.default.runOnePassiveGlobalAttr(map.passive, map.attr);
        return true;
    }
    //移除一条被动
    clearOnePassiveAttr(passive) {
        var type = passive.cfgData.effectType;
        if (type != BattleConst_1.default.passive_effect_global_attr) {
            return;
        }
        if (!passive.isActive) {
            return;
        }
        for (var i = this.globalPassiveAttrMap.length - 1; i >= 0; i--) {
            var info = this.globalPassiveAttrMap[i];
            //如果相同id的 先做移除
            if (info.passive._skillId == passive._skillId) {
                this.globalPassiveAttrMap.splice(i, 1);
                PassiveSkillTrigger_1.default.runOnePassiveGlobalAttr(info.passive, info.attr, null, -1);
            }
        }
    }
    /**清除所有角色 */
    clearAllRole() {
        var arr = this.campArr_1;
        for (var i = arr.length - 1; i >= 0; i--) {
            var item = arr[i];
            //如果不存在角色类型或者角色类型不是助阵英雄 并且不是基地，就销毁
            if ((!item.roleType || item.roleType != BattleConst_1.default.ROLETYPE_HELPROLE) && item.lifeType != BattleConst_1.default.LIFE_JIDI) {
                this.destoryHero(item);
            }
        }
    }
    /**迷雾模式等战斗开始后再加当我出生的触发 */
    addAllTiggerOnBorn() {
        var camp1 = this.campArr_1;
        for (var i = 0; i < camp1.length; i++) {
            ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_createMySelf, camp1[i]);
        }
        var camp2 = this.campArr_2;
        for (var i = 0; i < camp2.length; i++) {
            ConditionTrigger_1.default.onOpportunityByInstance(ConditionTrigger_1.default.opportunity_createMySelf, camp2[i]);
        }
    }
    //退出游戏
    exitBattle() {
        this.dispose();
    }
    //隐藏战斗 
    hideBattle() {
        this.layerControler.a.removeSelf();
        this.setGamePlayOrPause(true);
    }
    //显示战斗
    showBattle() {
        this.layerControler.rootCtn.addChild(this.layerControler.a);
        this.setGamePlayOrPause(false);
    }
    /**显示迷雾复活 */
    showFogRevive() {
        this.setGamePlayOrPause(true);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBattleReviveUI, { controler: this });
    }
    /**执行迷雾复活 */
    fogRevive() {
        this.reviveCount += 1;
        this.inFogReviveBattle = true;
        this.battleUI.addFogEnergy(BattleFunc_1.default.fogBattleRecover);
        //如果我方基地被打爆了，把基地复活
        var arr = this.campArr_1;
        var newJidi = true;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].lifeType == BattleConst_1.default.LIFE_JIDI) {
                newJidi = false;
                break;
            }
        }
        if (newJidi) {
            this.refreshControler.createMyHome();
        }
    }
    /**显示复活 */
    showBattleRevive(type) {
        this.setGamePlayOrPause(true);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleReviveUI, { controler: this, reviveType: type });
    }
    /**执行超时复活 */
    overTimeRevive() {
        this.inOverTimeRevive = true;
        var passiveData = new PassiveSkillData_1.default(BattleFunc_1.default.overTimePassiveSkill, 1, this.myHome, BattleConst_1.default.skill_kind_passive);
        this.insterGlobalPassive(passiveData);
    }
    /**执行失败复活 */
    defeatRevive() {
        this.inDefeatRevive = true;
        //杀掉除了敌方基地外的敌人
        var arr = this.campArr_2;
        for (var i = arr.length - 1; i >= 0; i--) {
            var item = arr[i];
            if (item.lifeType != BattleConst_1.default.LIFE_JIDI) {
                item.doDiedLogical();
            }
        }
        //重新创建基地
        this.refreshControler.createMyHome();
        //把基地血量按百分比恢复
        this.myHome.setMyHp(Math.ceil(this.myHome.hp * GlobalParamsFunc_1.default.instance.getDataNum("battleResurrectionEnergy") / 10000));
        this.myHome.setUnmatchState();
        //回满能量
        this.battleUI.nowEnergy = this.battleUI.maxEnergy;
        //重置倒计时
        if (this.refreshControler.leftFrame != -1) {
            this.refreshControler.resetGameLeftTime();
        }
    }
    //处理事件
    recvMsg(cmd) {
        switch (cmd) {
            case BattleEvent_1.default.BATTLEEVENT_CONTINUE_BATTLE:
                this.setGamePlayOrPause(false);
                break;
            case BattleEvent_1.default.BATTLEEVENT_PAUSE_BATTLE:
                this.setGamePlayOrPause(true);
                break;
        }
    }
    //销毁游戏
    dispose() {
        BattleLogsManager_1.default.battleEcho("退出战斗----");
        Laya.timer.clear(this, this.onceUpdateFrame);
        this.tweenControler.dispose();
        this.statistControler.startSendStatistics();
        //销毁所有对象 
        this.destoryInstanceArr(this._allInstanceArr);
        //清空延迟回调
        this._timeList.length = 0;
        this.campArr_1.length = 0;
        this.campArr_2.length = 0;
        this.diedArr_1.length = 0;
        this.diedArr_2.length = 0;
        this._allInstanceArr.length = 0;
        this.tweenControler.dispose();
        this.cameraControler = null;
        this.refreshControler && this.refreshControler.dispose();
        this.layerControler.dispose();
        this.layerControler = null;
        this.mapControler.dispose();
        this.mapControler = null;
        this.player = null;
        super.dispose();
        Message_1.default.instance.removeObjEvents(this);
        BattleFunc_1.default.CreateRoleIndex = {};
    }
}
exports.default = BattleLogicalControler;
//# sourceMappingURL=BattleLogicalControler.js.map