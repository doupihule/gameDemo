"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleSkillData_1 = require("./BattleSkillData");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
class PassiveSkillData extends BattleSkillData_1.default {
    constructor(skillId, level, role, skillType, relyonSkill = null) {
        super(skillId, level, role, skillType, relyonSkill);
        //触发次数
        this.triggerNums = 0;
        //触发的帧数. 是为了检测死循环
        this.triggerFrame = 0;
        //被动技能的数据和主动技不一样  后续扩展.
        //触发次数做标记的防止死循环
        this.triggerNums = 0;
        this.skillActionArr = [];
    }
    //缓存一个技能action
    cacheOneSkillAction(skillAction) {
        this.skillActionArr.push(skillAction);
    }
    //等级发生变化的时候 重置属性
    updateLevel(level) {
        super.updateLevel(level);
        this.cfgData = BattleFunc_1.default.instance.getCfgDatas("PassiveSkill", this._skillId);
        if (this.cfgData.cdTime) {
            this._cfgSkillCd = Math.ceil(this.cfgData.cdTime * BattleFunc_1.default.miniSecondToFrame);
        }
        var tempArr = this.cfgData.effectParams;
        //获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的等. 
        var tagStr = "PassiveSkillData" + this._skillId;
        if (tempArr) {
            if (!this.skillLogicalParams) {
                this.skillLogicalParams = [];
            }
            this.skillLogicalParams = [];
            for (var i = 0; i < tempArr.length; i++) {
                if (!this.skillLogicalParams[i]) {
                    this.skillLogicalParams[i] = [];
                }
                var temp = tempArr[i];
                for (var s = 0; s < temp.length; s++) {
                    this.skillLogicalParams[i][s] = this.getSkillValue(temp[s], tagStr);
                }
            }
        }
    }
}
exports.default = PassiveSkillData;
//# sourceMappingURL=PassiveSkillData.js.map