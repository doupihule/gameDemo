"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
const SkillActionData_1 = require("./SkillActionData");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const BattleDebugTool_1 = require("../controler/BattleDebugTool");
const FogFunc_1 = require("../../sys/func/FogFunc");
//战斗中的技能数据对象. 抽象成数据是为了方便访问以及数据管理
class BattleSkillData {
    //传入技能id 和等级 skillType 主动技还是被动技
    constructor(skillId, level, role, skillType, relyonSkill = null, lifeType = null) {
        //剩余技能cd
        this.leftSkillCd = 0;
        //技能cd
        this._cfgSkillCd = 0;
        this.isActive = false;
        //技能播放完毕后的停顿时间
        this.skillWaitFrame = 0;
        this._skillId = skillId;
        this.owner = role;
        this.skillType = skillType;
        this.relyonSkill = relyonSkill;
        this.parentLifeType = lifeType;
        this.updateLevel(level);
        this.tempChooseArr = [];
    }
    //更新等级
    updateLevel(level) {
        if (this.parentLifeType == BattleConst_1.default.LIFE_PLAYER) {
            this.isActive = true;
        }
        else {
            if (level == 0) {
                level = 1;
                this.isActive = false;
            }
            else {
                this.isActive = true;
            }
        }
        //如果是技能免cd的 那么就强制激活所有技能
        if (BattleDebugTool_1.default.isNoHeroCd()) {
            this.isActive = true;
        }
        if (!this.isActive) {
            this.level = level;
        }
        else {
            //如果等级没有变化 不执行
            if (this.level == level) {
                return;
            }
        }
        this.level = level;
        //技能参数
        if (this.relyonSkill) {
            this.skillPropParams = BattleFunc_1.default.instance.getCfgDatasByMultyKey("SkillUpdate", this.relyonSkill._skillId, String(this.relyonSkill.level), "params", true);
        }
        else {
            this.skillPropParams = BattleFunc_1.default.instance.getCfgDatasByMultyKey("SkillUpdate", this._skillId, String(level), "params", true);
        }
        //被动技走单独的配置
        if (this.skillType != BattleConst_1.default.skill_kind_passive) {
            this.cfgData = BattleFunc_1.default.instance.getCfgDatas("Skill", this._skillId);
            var value = this.cfgData.action && this.cfgData.action[4];
            if (value) {
                this.skillWaitFrame = BattleFunc_1.default.instance.turnMinisecondToframe(Number(value));
            }
            this.chooseTartgetCfg = BattleFunc_1.default.instance.getCfgDatas("Target", String(this.cfgData.target));
            if (!this.skillLabel) {
                if (this.cfgData.action) {
                    this.skillLabel = TableUtils_1.default.copyOneArr(this.cfgData.action);
                    for (var i = 1; i < this.skillLabel.length; i++) {
                        this.skillLabel[i] = Number(this.skillLabel[i]);
                    }
                }
            }
            //效果ID1,效果触发延迟时间,效果触发次数,效果触发间隔,每次触发获得的能量值
            var skillEffect = this.cfgData.skillEffect;
            if (skillEffect) {
                if (!this.skillActionArr) {
                    this.skillActionArr = [];
                    for (var i = 0; i < skillEffect.length; i++) {
                        var info = skillEffect[i];
                        var actionData = new SkillActionData_1.default(info[0], this.owner, this, Number(info[1]), Number(info[2]), Number(info[3]), Number(info[4]), 0);
                        this.skillActionArr.push(actionData);
                    }
                }
                else {
                    //否则只需要更新数据
                    for (var i = 0; i < skillEffect.length; i++) {
                        var actionData = this.skillActionArr[i];
                        actionData.updateData(this.owner, this);
                    }
                }
            }
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR && FogFunc_1.default.warHomeSkillCd[this._skillId]) {
                this._cfgSkillCd = Math.ceil(FogFunc_1.default.warHomeSkillCd[this._skillId] * BattleFunc_1.default.miniSecondToFrame);
            }
            else {
                if (this.cfgData.cdTime) {
                    this._cfgSkillCd = Math.ceil(this.cfgData.cdTime * BattleFunc_1.default.miniSecondToFrame);
                }
            }
        }
    }
    //根据id获取skillaction
    getActionById(id) {
        for (var i = 0; i < this.skillActionArr.length; i++) {
            var act = this.skillActionArr[i];
            if (act.skillEffectId == id) {
                return act;
            }
        }
        return null;
    }
    //重置数据
    resetData() {
        this.leftSkillCd = 0;
    }
    //获取cd
    get skillInitCd() {
        return Math.ceil(this._cfgSkillCd * this.owner.attrData.getSkillCdAdded(this._skillId) / 10000);
    }
    //获取技能参数
    getSkillValue(key, tag = null) {
        if (!this.skillPropParams) {
            return Number(key);
        }
        return BattleFunc_1.default.instance.getSkillValueByParams(key, this.relyonSkill && this.relyonSkill._skillId || this._skillId, this.level, this.skillPropParams, tag);
    }
    //销毁
    dispose() {
        this.skillData = null;
        this.skillData = null;
        this.skillPropParams = null;
    }
}
exports.default = BattleSkillData;
//# sourceMappingURL=BattleSkillData.js.map