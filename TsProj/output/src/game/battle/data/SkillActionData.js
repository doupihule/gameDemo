"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
//技能效果数据
class SkillActionData {
    //技能效果id
    constructor(id, owner, skill, delay, trigTimes, interval, resumeEnergy, opportunity = 0, relyOnSill = null) {
        //触发次数
        this.trigTimes = 0;
        //延迟时间
        this.delay = 0;
        //触发间隔帧
        this.interval = 0;
        //恢复的能量
        this.resumeEnergy = 0;
        //触发时机
        this.opportunity = 0;
        this.skillEffectId = id;
        //存储触发时机
        this.opportunity = opportunity;
        this.trigTimes = trigTimes;
        this.delay = BattleFunc_1.default.instance.turnMinisecondToframe(delay);
        this.interval = BattleFunc_1.default.instance.turnMinisecondToframe(interval);
        this.resumeEnergy = resumeEnergy;
        this.cfgData = BattleFunc_1.default.instance.getCfgDatas("SkillEffect", id);
        this.tempChooseArr = [];
        //更新数据
        this.updateData(owner, skill, relyOnSill);
        this.condition = this.cfgData.condition;
    }
    //刷新数据
    updateData(owner, skill, relyonSkill = null) {
        if (!skill) {
            LogsManager_1.default.echo("noSkill------------------");
        }
        //存储当前的技能对象
        this.skill = skill;
        this.relyonSkill = relyonSkill;
        this.owner = owner;
        //选择目标需要走依赖技能
        if (!this.cfgData.target) {
            this.chooseTartgetCfg = null;
        }
        else {
            this.chooseTartgetCfg = BattleFunc_1.default.instance.getCfgDatas("Target", String(this.cfgData.target));
        }
        //获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的 
        var tempArr = this.cfgData.logicParams;
        if (tempArr) {
            if (!this.skillLogicalParams) {
                this.skillLogicalParams = [];
            }
            var targetSkillId = String(this.cfgData.numId);
            var tagStr = "SkillEffect:" + this.skillEffectId;
            //如果自己配置的数值
            if (targetSkillId == this.skill._skillId) {
                for (var i = 0; i < tempArr.length; i++) {
                    if (!this.skillLogicalParams[i]) {
                        this.skillLogicalParams[i] = [];
                    }
                    var temp = tempArr[i];
                    for (var s = 0; s < temp.length; s++) {
                        this.skillLogicalParams[i][s] = this.skill.getSkillValue(temp[s], tagStr);
                    }
                }
            }
            else {
                //读取角色对应技能等级的数值
                var level = this.owner.getCfgSkillLevel(targetSkillId);
                for (var i = 0; i < tempArr.length; i++) {
                    if (!this.skillLogicalParams[i]) {
                        this.skillLogicalParams[i] = [];
                    }
                    var temp = tempArr[i];
                    for (var s = 0; s < temp.length; s++) {
                        this.skillLogicalParams[i][s] = BattleFunc_1.default.instance.getSkillValueByParams(temp[s], targetSkillId, level, null, tagStr);
                    }
                }
            }
        }
    }
}
exports.default = SkillActionData;
//# sourceMappingURL=SkillActionData.js.map