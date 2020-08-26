"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceLogical_1 = require("./InstanceLogical");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const PassiveSkillTrigger_1 = require("../trigger/PassiveSkillTrigger");
const ChooseTrigger_1 = require("../trigger/ChooseTrigger");
const BattleDebugTool_1 = require("../controler/BattleDebugTool");
const BuffTrigger_1 = require("../trigger/BuffTrigger");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
//英雄类
class InstanceHero extends InstanceLogical_1.default {
    constructor(controler) {
        super(controler);
        this._leftReliveFrame = 0;
        this.classModel = BattleConst_1.default.model_role;
    }
    // 当数据发生变化  目前主要是刷新技能等级或者用户数据
    onDataChange(changeData) {
        super.onDataChange(changeData);
        var hasPassiveChange = false;
        var tempPrassArr = BattleFunc_1.default.getOneTempArr();
        var tempPassiveData = BattleFunc_1.default.getOneTempArr();
        if (changeData.passiveSkills) {
            for (var i in changeData.passiveSkills) {
                var level = changeData.passiveSkills[i];
                if (level > 0) {
                    var skill = this.getSkillById(i, BattleConst_1.default.skill_kind_passive);
                    if (skill) {
                        hasPassiveChange = true;
                        //扣除这个被动的buff 因为后面会重算
                        if (skill.isActive) {
                            PassiveSkillTrigger_1.default.useSelfPassiveAttr(this, skill, -1, true);
                        }
                        skill.updateLevel(changeData.passiveSkills[i]);
                        //重新插入这个技能的被动.(先移除后插入)
                        // this.controler.insterGlobalPassive(skill as PassiveSkillData);
                        tempPrassArr.push(skill);
                    }
                }
            }
        }
        //如果等级或者进阶次数变化了 获得被动技能变化了 需要重新算属性
        if (changeData.level || changeData.advance || hasPassiveChange) {
            var oldHp = 0;
            //那么可能需要重算数据了
            if (changeData.level) {
                oldHp = this.maxHp;
            }
            this.attrData.updateData(this._data);
            if (changeData.level) {
                var addHp = this.maxHp - oldHp;
                if (addHp > 0) {
                    if (this.hp == 0) {
                        BattleLogsManager_1.default.battleEcho("死亡状态升级不回血");
                    }
                    else {
                        //升级增加血量
                        this.changeHp(addHp);
                    }
                }
            }
            //给这个角色执行全局被动
            PassiveSkillTrigger_1.default.runAllPassiveGlobalAttr(this.controler.globalPassiveAttrMap, this, 1);
            //被动属性需要放后设置. 否则升级加的属性会失效
            if (hasPassiveChange) {
                for (var s = 0; s < tempPrassArr.length; s++) {
                    //重新添上这个被动的属性
                    PassiveSkillTrigger_1.default.useSelfPassiveAttr(this, skill, 1, false);
                    this.controler.insterGlobalPassive(tempPrassArr[s]);
                }
            }
        }
        //缓存临时数组
        BattleFunc_1.default.cacheOneTempArr(tempPrassArr);
        BattleFunc_1.default.cacheOneTempArr(tempPassiveData);
        //如果 有技能变化
        if (changeData.normalSkills) {
            for (var i in changeData.normalSkills) {
                var level = changeData.normalSkills[i];
                if (level > 0) {
                    var skill = this.getSkillById(i, BattleConst_1.default.skill_kind_noraml);
                    if (skill) {
                        skill.updateLevel(changeData.normalSkills[i]);
                    }
                }
            }
        }
        //最后在更新技能数据  
        if (changeData.energySkill && changeData.energySkill.level) {
            var skill = this.energySkill;
            //更新大招等级
            this.energySkill.updateLevel(changeData.energySkill.level);
        }
    }
    //点击某个角色技能 是手动放还是自动放
    onCheckGiveEnergySkill(isAuto = false) {
        var energySkill = this.energySkill;
        //如果是免cd的
        if (!BattleDebugTool_1.default.isNoHeroCd()) {
            if (this.energy < this.maxEnergy) {
                return false;
            }
            //如果是未激活
            if (!energySkill.isActive) {
                return false;
            }
            //如果有控制类型的buff 不能执行
            if (this.ctrlBuffBit & BuffTrigger_1.default.ctrlBuffBit) {
                return false;
            }
            //自动放的需要加大招距离限制
            if (isAuto) {
                if (!this.checkIsInAttackDis()) {
                    return false;
                }
            }
            var tempArr = energySkill.tempChooseArr;
            //获取能够检测到的人数量
            ChooseTrigger_1.default.getSkillTargetRole(this, energySkill, energySkill.chooseTartgetCfg, tempArr);
            if (tempArr.length == 0) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_battle_emptyskill"));
                return false;
            }
            if (energySkill.leftSkillCd > 0) {
                return false;
            }
        }
        // 打断自身技能
        this.interruptSkill(this);
        this.giveOutSkill(energySkill);
        return true;
    }
}
exports.default = InstanceHero;
//# sourceMappingURL=InstanceHero.js.map