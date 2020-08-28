"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const TalentFunc_1 = require("../func/TalentFunc");
class TalentSkillsModel extends BaseModel_1.default {
    // 天赋技能列表：user.talentSkills
    // {
    //     1:2,//天赋位置：等级
    //     2:4,
    //  }
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TalentSkillsModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    //获取已经解锁的天赋技能列表
    getTalentSkills() {
        return this._data || {};
    }
    //获取某个天赋技能的等级
    getTalentSkillLevel(talentId) {
        if (!this._data || !this._data[talentId]) {
            return 0;
        }
        return this._data[talentId];
    }
    //判断是否能够升级天赋
    checkTalentRedPoint() {
    }
    getBuff() {
        var userSkillData = this.getTalentSkills();
        var buff = {};
        for (var skillId in userSkillData) {
            var skillInfo = TalentFunc_1.default.instance.getTalentInfoByLevel(skillId, userSkillData[skillId]);
            buff[skillInfo.attributeType] = (buff[skillInfo.attributeType] || 0) + skillInfo.attributeNub;
        }
        return buff;
    }
}
exports.default = TalentSkillsModel;
//# sourceMappingURL=TalentSkillsModel.js.map