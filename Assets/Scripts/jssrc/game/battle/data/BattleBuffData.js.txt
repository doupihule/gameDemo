"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../../sys/func/BattleFunc");
class BattleBuffData {
    constructor(id) {
        //剩余时间
        this.leftFrame = -1;
        //生效次数
        this.leftTimes = 0;
        //生效间隔
        this.interval = 0;
        //增益还是减益
        this.type = 1;
        this.group = 1;
        //叠加层数
        this.layerNums = 1;
        this._id = String(id);
        this.cfgData = BattleFunc_1.default.instance.getCfgDatas("Buff", id);
        this.type = this.cfgData.type;
        this.logicType = this.cfgData.logicType;
        this.group = this.cfgData.group;
        this.interval = Number(this.cfgData.interval);
        if (this.interval > 0) {
            this.interval = BattleFunc_1.default.instance.turnMinisecondToframe(this.interval);
        }
    }
    //设置数据 buff数据也是会复用的 repeatNum:叠加层数
    setData(owner, targetSkillAction, repeatNum = 1) {
        this.onwer = owner;
        this.layerNums = repeatNum;
        var targetSkill = targetSkillAction.relyonSkill || targetSkillAction.skill;
        this.leftFrame = targetSkill.getSkillValue(this.cfgData.existTime);
        if (this.leftFrame != -1) {
            if (this.leftFrame) {
                this.leftFrame = BattleFunc_1.default.instance.turnMinisecondToframe(this.leftFrame);
            }
            else {
                this.leftFrame = 0;
            }
        }
        this.skillAction = targetSkillAction;
        var skillDataId = this.skillAction.cfgData.numId;
        var targetLevel = owner.getCfgSkillLevel(skillDataId);
        this.leftTimes = Number(this.cfgData.effectiveTimes);
        var tempArr = this.cfgData.logicParams;
        //获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的等.
        var tagStr = "Buff:" + this._id;
        if (tempArr) {
            this.skillLogicalParams = [];
            for (var i = 0; i < tempArr.length; i++) {
                this.skillLogicalParams[i] = [];
                var temp = tempArr[i];
                for (var s = 0; s < temp.length; s++) {
                    // this.skillLogicalParams[i][s] = targetSkill.getSkillValue(temp[s],tagStr);
                    this.skillLogicalParams[i][s] = BattleFunc_1.default.instance.getSkillValueByParams(temp[s], skillDataId, targetLevel, null, tagStr);
                }
            }
        }
    }
    //给buff叠加
    addLayer(value) {
        this.layerNums += value;
        if (this.layerNums > this.cfgData.maxLayer) {
            this.layerNums = this.cfgData.maxLayer;
        }
    }
    //获取最大层数
    getMaxLayer() {
        return this.cfgData.maxLayer || 1;
    }
}
exports.default = BattleBuffData;
//# sourceMappingURL=BattleBuffData.js.map