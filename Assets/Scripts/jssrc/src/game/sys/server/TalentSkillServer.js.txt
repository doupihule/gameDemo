"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const UserModel_1 = require("../model/UserModel");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const UserExtModel_1 = require("../model/UserExtModel");
const TalentSkillsModel_1 = require("../model/TalentSkillsModel");
const CountsModel_1 = require("../model/CountsModel");
const GameUtils_1 = require("../../../utils/GameUtils");
/*
天赋技能系统
 */
class TalentSkillServer {
    //天赋技能升级
    static upgrade(params, callBack, thisObj) {
        // var params = {
        //     "talentId": talentId,
        //     "cost": costMap
        // };
        var upData = {};
        var ext = {};
        if (!params || !params.talentId) {
            return;
        }
        var talentId = params.talentId;
        //更新天赋列表
        ext[talentId] = TalentSkillsModel_1.default.instance.getTalentSkillLevel(talentId) + 1;
        upData["talentSkills"] = ext;
        //更新货币
        upData["coin"] = BigNumUtils_1.default.substract(UserModel_1.default.instance.getCoin(), (params.cost['coin'] || 0));
        var golds = UserModel_1.default.instance.costGold(params.cost['gold'] || 0);
        upData["giftGold"] = golds[0];
        upData["gold"] = golds[1];
        //更新天赋升级次数
        upData["userExt"] = {
            "talentSkillUpgradeNum": UserExtModel_1.default.instance.getTalentSkillUpgradeNum() + 1
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    //免费升级
    static freeUpgrade(params, callBack, thisObj) {
        // var params = {
        //     "talentId": talentId,
        // };
        var upData = {};
        if (!params || !params.talentId) {
            return;
        }
        var talentId = params.talentId;
        var count = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.talentFreeUpdateCount);
        var countData = {
            id: CountsModel_1.default.talentFreeUpdateCount,
            count: count + 1,
        };
        if (count == 0) {
            countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(4);
        }
        upData = {
            "talentSkills": {
                [talentId]: TalentSkillsModel_1.default.instance.getTalentSkillLevel(talentId) + 1
            },
            //更新天赋技能升级次数
            "userExt": {
                "talentSkillUpgradeNum": UserExtModel_1.default.instance.getTalentSkillUpgradeNum() + 1
            },
            //更新免费升级次数
            "counts": {
                [CountsModel_1.default.talentFreeUpdateCount]: countData
            }
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
}
exports.default = TalentSkillServer;
//# sourceMappingURL=TalentSkillServer.js.map