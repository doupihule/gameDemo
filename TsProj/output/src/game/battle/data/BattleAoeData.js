"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SkillActionData_1 = require("./SkillActionData");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const PoolTools_1 = require("../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../sys/consts/PoolCode");
const ChooseTrigger_1 = require("../trigger/ChooseTrigger");
const SkillActionTrigger_1 = require("../trigger/SkillActionTrigger");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const SkillExpandTrigger_1 = require("../trigger/SkillExpandTrigger");
/**
 * 战斗重点aoe对象数据.
 * 主要用来检测aoe敌人
 */
class BattleAoeData {
    //初始化
    constructor(id) {
        this.delayFrame = 0;
        this.effectiveTimes = 0;
        this.intervalFrame = 0;
        this.existFrame = 0;
        this.aoeId = id;
        this.cfgData = BattleFunc_1.default.instance.getCfgDatas("AoeEffect", id);
        this.delayFrame = BattleFunc_1.default.instance.turnMinisecondToframe(this.cfgData.delayTime);
        this.intervalFrame = BattleFunc_1.default.instance.turnMinisecondToframe(this.cfgData.interval);
        this.existFrame = BattleFunc_1.default.instance.turnMinisecondToframe(this.cfgData.existTime);
        if (this.cfgData.target) {
            this.chooseTartgetCfg = BattleFunc_1.default.instance.getCfgDatas("Target", String(this.cfgData.target));
        }
        this.effectiveTimes = Number(this.cfgData.effectiveTimes);
        this._initTargtPos = new Laya.Vector3();
    }
    //更新数据
    setData(skillAction, attacker) {
        this.owner = skillAction.owner;
        this.attacker = attacker;
        this.skill = skillAction.skill;
        if (!this.skillActionArr) {
            var actArr = this.cfgData.skillEffect;
            this.skillActionArr = [];
            for (var i = 0; i < actArr.length; i++) {
                var actionData = new SkillActionData_1.default(actArr[i], skillAction.owner, skillAction.skill, 0, 1, 0, 0, 0);
                this.skillActionArr.push(actionData);
            }
        }
        else {
            for (var i = 0; i < this.skillActionArr.length; i++) {
                this.skillActionArr[i].updateData(skillAction.owner, skillAction.skill);
            }
        }
    }
    //执行aoe效果
    doAoeAction(targetInstance, pos = null, targetBullet = null) {
        if (!pos) {
            pos = targetInstance.pos;
        }
        this._initTargtPos.x = pos.x;
        this._initTargtPos.y = pos.y;
        this._initTargtPos.z = pos.z;
        this.targetInstance = targetInstance;
        this.targetBullet = targetBullet;
        //如果是子弹的.优先从子弹那里创建特效
        var expandParams = {
            ignoreScale: this.attacker.ignoreTimeScale
        };
        if (targetBullet) {
            targetBullet.createEffByParams(this.cfgData.specialEffect, false, false, expandParams);
        }
        else {
            //在目标身上播放特效
            targetInstance.createEffByParams(this.cfgData.specialEffect, false, false, expandParams);
        }
        //执行aoe 检测事件
        targetInstance.controler.setLastCallBack(this.delayFrame, this.intervalFrame, this.effectiveTimes, this.checkAoe, this);
        targetInstance.controler.setCallBack(this.existFrame, this.onAoeEnd, this);
        var chooseArr;
        var tempChooseArr;
        if (this.cfgData.expand && this.cfgData.expand[0][0] == SkillExpandTrigger_1.default.EXPAND_TYLE_LINEEFFECT) {
            if (!this.chooseTartgetCfg) {
                chooseArr = this.skill.tempChooseArr;
            }
            else {
                tempChooseArr = BattleFunc_1.default.getOneTempArr();
                //选择aoe攻击目标
                ChooseTrigger_1.default.getAoeTargetRole(this, this.owner, this.targetInstance, tempChooseArr);
                chooseArr = tempChooseArr;
            }
        }
        //是否剔除目标本身
        if (chooseArr) {
            if (this.cfgData.type) {
                var index = chooseArr.indexOf(targetInstance);
                if (index != -1) {
                    chooseArr.splice(index, 1);
                }
            }
        }
        SkillExpandTrigger_1.default.onCheckExpand(targetInstance, this.skill, this.cfgData.expand, chooseArr, true);
        if (tempChooseArr) {
            BattleFunc_1.default.cacheOneTempArr(tempChooseArr);
        }
    }
    //aoe结束
    onAoeEnd() {
        //把自己放入缓存数组
        this.targetInstance = null;
        PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_AOEDATA + this.aoeId, this);
    }
    //检测aoe
    checkAoe() {
        if (!this.targetInstance) {
            BattleLogsManager_1.default.battleEcho("battle没有设置目标instance");
            return;
        }
        //执行aoe效果
        for (var i = 0; i < this.skillActionArr.length; i++) {
            var chooseArr;
            var tempChooseArr;
            if (!this.chooseTartgetCfg) {
                chooseArr = this.skill.tempChooseArr;
            }
            else {
                tempChooseArr = BattleFunc_1.default.getOneTempArr();
                //选择aoe攻击目标
                ChooseTrigger_1.default.getAoeTargetRole(this, this.owner, this.targetInstance, tempChooseArr);
                chooseArr = tempChooseArr;
            }
            if (chooseArr.length > 0) {
                //是否剔除目标本身
                if (this.cfgData.type) {
                    var index = chooseArr.indexOf(this.targetInstance);
                    if (index != -1) {
                        chooseArr.splice(index, 1);
                    }
                }
                if (chooseArr.length > 0) {
                    // 对所有被选中的目标直接执行效果
                    SkillActionTrigger_1.default.checkSkillAction(this.owner, this.skillActionArr[i], chooseArr);
                }
            }
            if (tempChooseArr) {
                BattleFunc_1.default.cacheOneTempArr(tempChooseArr);
            }
        }
    }
}
exports.default = BattleAoeData;
//独立特效扩展参数
BattleAoeData._aloneEffectExpandParams = {
    isAlone: true
};
//# sourceMappingURL=BattleAoeData.js.map