"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const Message_1 = require("../../../framework/common/Message");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const GlobalParamsFunc_1 = require("../../sys/func/GlobalParamsFunc");
const RolesModel_1 = require("../../sys/model/RolesModel");
const ConditionTrigger_1 = require("../trigger/ConditionTrigger");
const FogFunc_1 = require("../../sys/func/FogFunc");
const FogConst_1 = require("../../sys/consts/FogConst");
const FogModel_1 = require("../../sys/model/FogModel");
const RolesFunc_1 = require("../../sys/func/RolesFunc");
const FogPropTrigger_1 = require("../../fog/trigger/FogPropTrigger");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const StatisticsManager_1 = require("../../sys/manager/StatisticsManager");
const KariqiShareManager_1 = require("../../../framework/manager/KariqiShareManager");
const KariquShareConst_1 = require("../../../framework/consts/KariquShareConst");
const Client_1 = require("../../../framework/common/kakura/Client");
const UserModel_1 = require("../../sys/model/UserModel");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../sys/func/ShareTvOrderFunc");
const GameConsts_1 = require("../../sys/consts/GameConsts");
/**
 * 刷新控制器
 * 控制刷怪逻辑 以及接受事件变化更新角色属性
 *
 */
class RefreshControler {
    constructor(controler) {
        //当前波次
        this.currentWave = 0;
        this.maxWave = 0; //最大波次
        //当前波次总血量
        this.waveTotalHp = 0;
        //当前波次剩余血量
        this.waveLeftHp = 0;
        //扩展的刷怪权重
        this.expandWeightMap = {};
        //游戏结果 0未出结果  1胜利 2 失败
        this.battleResult = 0;
        //当前迷雾街区层数
        this.currentLayer = 0;
        //波次信息
        /**
         * {
         *     id: waveid
         *      frame: 剩余时间
         *     monsterInfo;
         * }
         *
         */
        //当前关卡
        this.level = 0;
        //怪物等级
        this.monsterLevel = 1;
        //章节
        this.chapter = 1;
        //剩余时间
        this.leftFrame = -1;
        this.batteTotalFrame = -1;
        this.addEnergeTime = 60;
        this.enemyTab = {};
        //迷雾街区怪物id
        this.fogMonsterId = "";
        this.enemyTab = {};
        this.controler = controler;
        this.addEnergeTime = this.controler.battleUI.recoverPer;
    }
    /**初始化远征战斗 */
    initWarData() {
        this.currentLayer = FogModel_1.default.instance.getCurLayer();
        this.battleResult = BattleConst_1.default.battleResult_none;
        var event = FogFunc_1.default.enemyCell.eventData;
        var enemyInfo = FogFunc_1.default.instance.getCfgDatas("Enemy", event.params[0]);
        this.fogMonsterId = enemyInfo.id;
        var ai = event.ai;
        var list = FogFunc_1.default.instance.getCfgDatasByKey("Ai", ai, "powerRange");
        var aiList = [];
        TableUtils_1.default.deepCopy(list, aiList);
        var result = [];
        var role;
        var enemyHomeId;
        var enemyHomeLevel;
        var enemyType = event.enemyType;
        if (enemyType == FogConst_1.default.FOG_EVENT_ENEMY_TYPE_PLAYER) {
            role = FogModel_1.default.instance.getEnemyInfoById(event.enemyId).roles;
            for (var key in role) {
                //不在阵上说明是基地 不在阵上并且配表里有这个角色
                if (!role[key].inLine && BattleFunc_1.default.instance.getCfgDatas("Role", key, true)) {
                    enemyHomeId = key;
                    enemyHomeLevel = role[key].level;
                    break;
                }
            }
        }
        else {
            var waveData = FogFunc_1.default.instance.getCfgDatas("NpcArray", event.enemyId);
            var waveMap = waveData.waveMap;
            //先把敌人数据存到table里，方便后续查找
            for (var i = 0; i < waveMap.length; i++) {
                var item = waveMap[i];
                this.enemyTab[item[0]] = item;
            }
            role = this.enemyTab;
            enemyHomeId = waveData.enemyHomeId[0];
            enemyHomeLevel = waveData.enemyHomeId[1];
        }
        if (!enemyHomeId) {
            enemyHomeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
            enemyHomeLevel = 1;
        }
        //创建敌方基地
        this.controler.enemyHome = this.controler.createHome(enemyHomeId, { level: enemyHomeLevel }, BattleConst_1.default.LIFE_JIDI, BattleConst_1.default.ROLEGROUP_ENEMY);
        //把ai表里我的角色数据存起来
        for (var i = 0; i < aiList.length; i++) {
            var item = aiList[i];
            if (role[item[0]]) {
                result.push(item);
            }
        }
        //把结果按排序顺序从小到大排
        result.sort(this.sortPaixu);
        //算每个角色的当前优先级值
        for (var i = 0; i < result.length; i++) {
            result[i][2] = Number(result[i][2]);
            if (i != 0) {
                result[i][2] += Number(result[i - 1][2]);
            }
        }
        //优先级从大到小排序
        result.sort(this.sortYouxianji);
        //敌人能量=配置能量+当前层数*配置能量万分比/10000
        var energy = Math.floor(enemyInfo.energy[0] + FogModel_1.default.instance.getCurLayer() * (enemyInfo.energy[1]) / 10000);
        var level;
        var starLevel;
        var equip;
        var roleInfo;
        var playerEnemy;
        while (result.length > 0) {
            var curInfo = result[0];
            var id = curInfo[0];
            roleInfo = RolesFunc_1.default.instance.getCfgDatas("Role", id);
            //如果当前总能量小于角色出兵的能量，把这个兵从列表删掉
            if (!roleInfo || energy < roleInfo.payEnergyNmb) {
                result.splice(0, 1);
                continue;
            }
            energy -= roleInfo.payEnergyNmb;
            playerEnemy = role[id];
            //玩家类型的敌人数据直接取存储在模块下的
            if (enemyType == FogConst_1.default.FOG_EVENT_ENEMY_TYPE_PLAYER) {
                level = playerEnemy.level || 1;
                starLevel = playerEnemy.starLevel || 0;
                equip = playerEnemy.equip || {};
            }
            else {
                //npc类型的敌人，去NPCArray下的敌人数据，playerEnemy[3]有说明有装备，把装备存起来
                level = playerEnemy[1];
                starLevel = playerEnemy[2];
                if (playerEnemy[3]) {
                    equip = {};
                    for (var i = 3; i < playerEnemy.length; i++) {
                        equip[playerEnemy[i]] = 1;
                    }
                }
            }
            var num = roleInfo.heroNub || 1;
            var offestX = 0;
            for (var j = 0; j < num; j++) {
                if (j != 0) {
                    offestX = roleInfo.startSite[j];
                }
                this.controler.createRole(id, { level: level, starLevel: starLevel, equip: equip, passivSkill: enemyInfo.passivSkill }, roleInfo.kind, BattleConst_1.default.ROLEGROUP_ENEMY, offestX);
            }
            //重算当前的优先级
            result[0][2] -= Number(result[0][3]);
            //优先级从大到小排序
            result.sort(this.sortYouxianji);
        }
        this.addHelpRole();
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_BATTLE_START, { enemyId: event.enemyData.id });
    }
    sortPaixu(a, b) {
        return a[1] - b[1];
    }
    sortYouxianji(a, b) {
        return b[2] - a[2];
    }
    //加助阵角色
    addHelpRole() {
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddRoleHelp, this.controler);
    }
    //创建我方基地
    createMyHome() {
        var homeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
        var trueHome = homeId;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            homeId = GlobalParamsFunc_1.default.instance.getDataNum("fogHomeId");
        }
        this.controler.myHome = this.controler.createHome(homeId, { level: RolesModel_1.default.instance.getRoleLevelById(trueHome) }, BattleConst_1.default.LIFE_JIDI, BattleConst_1.default.ROLEGROUP_MYSELF);
    }
    //初始化数据
    initData() {
        this.battleResult = BattleConst_1.default.battleResult_none;
        this._waveIdArr = [];
        this.createMyHome();
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            this.initNormalData();
            if (Number(this.controler.levelCfgData.levelId) == UserModel_1.default.instance.getMaxBattleLevel() + 1) {
                KariqiShareManager_1.default.sendNewLevel({ guanqia: this.getKariqiLevelId() });
            }
            KariqiShareManager_1.default.onEvent(KariquShareConst_1.default.KARIQU_LEVELSTART, {}, this.getKariqiLevelId());
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.initWarData();
            FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddBattlePassive, this.controler);
            KariqiShareManager_1.default.onEvent("fogLevelStart", { level: this.getKariqiLevelId() });
        }
        KariqiShareManager_1.default.onEvent(KariquShareConst_1.default.KARIQU_STARTGAME);
    }
    /**初始化普通战斗 */
    initNormalData() {
        this.initLevelData(this.controler.levelCfgData.levelId);
        //让刷怪控制器开始刷怪
        this.enterTargetWave(1);
    }
    //进入目标wave
    enterTargetWave(waveIndex) {
        //设置为没有出结果状态
        this.battleResult = BattleConst_1.default.battleResult_none;
        this.currentWave = waveIndex;
        var waveInfo = this._waveIdArr[waveIndex - 1].split(",");
        var enterTime = BattleFunc_1.default.instance.turnMinisecondToframe(waveInfo[1]);
        this.controler.setCallBack(enterTime, this.enterWave, this, waveInfo[0]);
        BattleLogsManager_1.default.battleEcho("进入波次:", waveIndex, "延迟", waveInfo[1]);
        //初始化开战 一些技能的被动效果 
        ConditionTrigger_1.default.onOpportunityByArr(ConditionTrigger_1.default.opportunity_startBattle, this.controler.campArr_2);
        ConditionTrigger_1.default.onOpportunityByArr(ConditionTrigger_1.default.opportunity_startBattle, this.controler.campArr_1);
        ConditionTrigger_1.default.onOpportunityByArr(ConditionTrigger_1.default.opportunity_refreshMonster, this.controler.campArr_1);
        ConditionTrigger_1.default.onOpportunityByArr(ConditionTrigger_1.default.opportunity_refreshMonster, this.controler.campArr_2);
        // this.controler.battleUI.updateWave(this.currentWave, this.maxWave);
        // this.controler.battleUI.updateBlood(this.waveLeftHp, this.waveTotalHp);
        // this.controler.battleUI.updateGameTime(this.leftFrame, this.batteTotalFrame);
    }
    enterWave(waveId) {
        var monsterArr = BattleFunc_1.default.instance.getCfgDatasByKey("LevelWave", waveId, "waveMap");
        //创建小怪
        var showTime = 0;
        var equip;
        for (var i = 0; i < monsterArr.length; i++) {
            var info = monsterArr[i].split(",");
            var id = info[0];
            showTime += Number(info[1]);
            var level = Number(info[2]);
            var starLevel = Number(info[3]) || 0;
            var roleInfo = BattleFunc_1.default.instance.getCfgDatas("Role", id);
            var num = roleInfo.heroNub || 1;
            var datas = {
                waveAllEnemy: monsterArr.length - 1,
                index: i,
                id: id,
                data: {
                    level: level,
                    starLevel: starLevel
                },
                lifeType: roleInfo.kind,
                camp: BattleConst_1.default.ROLEGROUP_ENEMY
            };
            if (info[4]) {
                equip = {};
                for (var k = 4; k < info.length; k++) {
                    equip[info[k]] = 1;
                }
                datas["data"]["equip"] = equip;
            }
            for (var j = 0; j < num; j++) {
                var itemData = {
                    data: datas,
                    index: j,
                };
                if (num > 1) {
                    itemData["offestX"] = roleInfo.startSite[j];
                }
                this.controler.setCallBack(BattleFunc_1.default.instance.turnMinisecondToframe(showTime), this.initWaveEnemy, this, itemData);
            }
        }
    }
    initWaveEnemy(info) {
        if (this.controler && this.controler.isGameOver)
            return;
        var data = info.data;
        this.controler.createRole(data.id, data.data, data.lifeType, data.camp, info.offestX);
        //是当前波次的最后一个敌人
        if (data.waveAllEnemy == data.index && info.index == 0) {
            //如果当前是最后一波了，重新回到第一波
            if (this.currentWave == this.maxWave) {
                this.currentWave = 0;
            }
            this.enterTargetWave(this.currentWave + 1);
        }
    }
    //初始化关卡数据
    initLevelData(level) {
        //进入下一波
        this.level = Number(level);
        this.levelInfo = BattleFunc_1.default.instance.getCfgDatas("Level", String(level));
        this._waveIdArr = this.levelInfo.levelWave;
        this.maxWave = this._waveIdArr.length;
        this.resetGameLeftTime();
        var enemyInfo = this.levelInfo.enemyHomeId;
        this.controler.enemyHome = this.controler.createHome(enemyInfo[0], { level: Number(enemyInfo[1]) }, BattleConst_1.default.LIFE_JIDI, BattleConst_1.default.ROLEGROUP_ENEMY);
    }
    //重置战斗时间
    resetGameLeftTime() {
        //新手引导第一关没有时间限制
        if (UserModel_1.default.instance.getMaxBattleLevel() <= 0) {
            this.leftFrame = -1;
            return;
        }
        // this.leftFrame = BattleFunc.instance.turnMinisecondToframe(3000)
        this.leftFrame = BattleFunc_1.default.instance.turnMinisecondToframe(this.levelInfo.maxTime);
    }
    //当敌人死光了的时候
    onMonsterAllDied(monster) {
        this.onGameOver(BattleConst_1.default.battleResult_win);
    }
    //有人复活了 通知对面阵营的人 是否要检测ai了
    oneRoleRelive(role) {
        var arr = role.toCampArr;
        if (role.campArr.length == 1) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].checkMoveOrAttack(true);
            }
        }
    }
    //刷新函数 
    updateFrame() {
        this.updateBattleEnergy();
        this.updateBattleLeftTime();
    }
    updateBattleLeftTime() {
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL && !this.controler.inOverTimeRevive && this.leftFrame != -1) {
            if (this.leftFrame % GameConsts_1.default.gameFrameRate == 0) {
                this.controler.battleUI.showLeftTxt(this.leftFrame);
            }
            if (this.leftFrame <= 0) {
                this.leftFrame = -1;
                this.checkOverTimeLose();
                return;
            }
            this.leftFrame -= 1;
        }
    }
    updateBattleEnergy() {
        if (this.addEnergeTime > 0) {
            this.addEnergeTime--;
            return;
        }
        this.addEnergeTime = this.controler.battleUI.recoverPer;
        this.controler.battleUI.autoAddEnergy();
    }
    //超时失败
    checkOverTimeLose() {
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL && !this.controler.inOverTimeRevive && ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLEREVIVE_OVERTIME) != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.controler.showBattleRevive(BattleConst_1.default.REVIVETYPE_OVERTIME);
            return;
        }
        this.showGameLose();
    }
    //战斗失败
    checkGameLose() {
        //判断是否可以复活
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR && !this.controler.reviveCount && ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLEFOG_REVIVE) != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.controler.showFogRevive();
            return;
        }
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL && !this.controler.inDefeatRevive && ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLEREVIVE_DEFEAT) != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.controler.showBattleRevive(BattleConst_1.default.REVIVETYPE_DEFEAT);
            return;
        }
        this.showGameLose();
    }
    showGameLose() {
        this.onGameOver(BattleConst_1.default.battleResult_lose);
    }
    //升级回来
    onUpLevelBack() {
    }
    //关卡结束时让我方所有人站立.
    onGameOver(rt) {
        if (this.battleResult != BattleConst_1.default.battleResult_none) {
            return;
        }
        KariqiShareManager_1.default.onEvent(KariquShareConst_1.default.KARIQU_RESULT);
        this.controler.isGameOver = true;
        var campArr = this.controler.campArr_1;
        for (var i = 0; i < campArr.length; i++) {
            campArr[i].initStand();
            campArr[i].resumeIdleAction();
        }
        campArr = this.controler.campArr_2;
        for (var i = 0; i < campArr.length; i++) {
            campArr[i].initStand();
            campArr[i].resumeIdleAction();
        }
        this.battleResult = rt;
        if (this.controler.passive) {
            this.controler.clearOnePassiveAttr(this.controler.passive);
            this.controler.passive = null;
        }
        var levelCostTime = Client_1.default.instance.serverTime - this.controler.startTime;
        if (rt == BattleConst_1.default.battleResult_lose) {
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
                KariqiShareManager_1.default.onEvent(KariquShareConst_1.default.KARIQU_GAMEFAIL, { "time": levelCostTime }, this.getKariqiLevelId());
            }
            else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                KariqiShareManager_1.default.onEvent("fogLevelFail", { "level": this.getKariqiLevelId() });
            }
            this.controler.setCallBack(120, () => {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleResultUI, { levelId: this.level, isWin: false, controler: this.controler });
            }, this);
        }
        else {
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
                KariqiShareManager_1.default.onEvent(KariquShareConst_1.default.KARIQU_GAMESUCESS, { "time": levelCostTime }, this.getKariqiLevelId());
            }
            else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                KariqiShareManager_1.default.onEvent("fogLevelSuccess", { "level": this.getKariqiLevelId() });
            }
            this.controler.setCallBack(120, () => {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleResultUI, { levelId: this.level, isWin: true, controler: this.controler });
            }, this);
        }
    }
    //立即复活所有的英雄
    reliveAllHeros() {
        var diedArr = this.controler.diedArr_1;
        var campArr = this.controler.campArr_1;
        for (var i = 0; i < campArr.length; i++) {
            //让所有人满血
            var role = campArr[i];
            role.changeHp(role.maxHp - role.hp);
        }
        for (var i = diedArr.length - 1; i >= 0; i--) {
            var role = diedArr[i];
            role.doRelive(role.maxHp, null);
        }
    }
    //重新开始这一关
    restartLevel() {
        //销毁所有敌人
        this.controler.destoryInstanceArr(this.controler.campArr_2);
        this.controler.destoryInstanceArr(this.controler.diedArr_2);
        //重新开始
        this.onUpLevelBack();
    }
    //改变敌人总血量
    changeWaveHp(value) {
        this.waveLeftHp += value;
        this.controler.battleUI.updateBlood(this.waveLeftHp, this.waveTotalHp);
    }
    //设置一个阵位额外刷怪概率
    setFormationWeight(formation, changeValue) {
        // var defValue = this.expandWeightMap[formation];
        // if (defValue == null) {
        //     this.expandWeightMap[formation] = 0;
        //     defValue = 0;
        // }
        // defValue += changeValue;
        // if (defValue < 0) {
        //     defValue = 0;
        // }
        // this.expandWeightMap[defValue];
    }
    getKariqiLevelId() {
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            return Number(this.controler.levelCfgData.levelId);
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            return Number(this.fogMonsterId);
        }
        return 0;
    }
    //接受事件
    recvMsg(msg, data) {
    }
    dispose() {
        //一定要注意移除事件
        Message_1.default.instance.removeObjEvents(this);
        this.controler = null;
    }
}
exports.default = RefreshControler;
//# sourceMappingURL=RefreshControler.js.map