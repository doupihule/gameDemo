"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const UserExtModel_1 = require("../model/UserExtModel");
const TalentSkillsModel_1 = require("../model/TalentSkillsModel");
const GlobalParamsFunc_1 = require("./GlobalParamsFunc");
/**天赋技能相关 */
class TalentFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Talent_json" },
            { name: "TalentSkill_json" },
            { name: "TalentUpdate_json" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new TalentFunc();
        }
        return this._instance;
    }
    getAllTalent() {
        return this.getAllCfgData("Talent_json");
    }
    getTalentById(id) {
        return this.getCfgDatas("Talent_json", id);
    }
    getTalentByTwo(id1, id2) {
        return this.getCfgDatasByKey("Talent_json", id1, id2);
    }
    //根据天赋id和等级获得talentInfo
    getTalentInfoByLevel(talentId, talentLevel) {
        return this.getCfgDatas("TalentSkill_json", talentId)[talentLevel];
    }
    //根据升级次数获取TalentUpdate详情
    getTalentUpdateInfo(num) {
        return this.getCfgDatas("TalentUpdate_json", num);
    }
    //判断天赋技能是否可以升级
    checkTalentSkillUpdate() {
        var needLevel = this.getTalentUpdateInfo(UserExtModel_1.default.instance.getTalentSkillUpgradeNum() + 1).needLevel;
        if (UserExtModel_1.default.instance.getMaxLevel() < needLevel) {
            return [false, needLevel];
        }
        else {
            return true;
        }
    }
    //判断天赋技能是否全部满级
    checkTalentSkillLevelFull() {
        var talentInfo = TalentFunc.instance.getAllTalent();
        var userTalentData = TalentSkillsModel_1.default.instance.getTalentSkills();
        var maxLevel = GlobalParamsFunc_1.default.instance.getDataNum("talentSkillMaxLeve");
        for (var i in talentInfo) {
            //判断是否有没有解锁的技能
            if (!userTalentData[i]) {
                return false;
            }
            //判断技能是否满级
            if (userTalentData[i] < maxLevel) {
                return false;
            }
        }
        return true;
    }
    //根据权重随机升级的talentId
    getRandomTalentId() {
        var talentInfo = Object.keys(this.getAllCfgData('Talent_json'));
        var weightArr = [];
        for (var i = 0; i < talentInfo.length; i++) {
            var skilllevel = TalentSkillsModel_1.default.instance.getTalentSkillLevel(talentInfo[i]);
            if (skilllevel >= GlobalParamsFunc_1.default.instance.getDataNum("talentSkillMaxLeve")) {
                continue;
            }
            var skillInfo = this.getTalentInfoByLevel(talentInfo[i], skilllevel + 1);
            weightArr.push(talentInfo[i] + "," + skillInfo.skillUpdateWeight);
        }
        var randResult = GameUtils_1.default.getWeightItem(weightArr);
        return randResult[0];
    }
}
exports.default = TalentFunc;
//# sourceMappingURL=TalentFunc.js.map