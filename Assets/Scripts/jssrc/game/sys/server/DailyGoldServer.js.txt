"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const DailyGoldModel_1 = require("../model/DailyGoldModel");
class DailyGoldServer {
    //更新观看视频次数
    static updateWatchTime(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var updateData = {};
        updateData["watchTime"] = data.watchTime;
        var dailyGold = DailyGoldModel_1.default.instance.getDailyGoldData();
        if (!dailyGold.currentGoldStep) {
            updateData["currentGoldStep"] = 0;
        }
        if (!dailyGold.expireTime) {
            updateData["expireTime"] = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 28 * 60 * 60 * 1000)).toString());
        }
        upData["dailyGold"] = updateData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    //领取钻石奖励
    static gainReward(data, callBack = null, thisObj = null) {
        var upData = {};
        var updateData = {};
        updateData["watchTime"] = 0;
        updateData["currentGoldStep"] = data.currentGoldStep;
        var dailyGold = DailyGoldModel_1.default.instance.getDailyGoldData();
        if (!dailyGold.expireTime || dailyGold.expireTime <= Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 4 * 60 * 60 * 1000)).toString())) {
            updateData["expireTime"] = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 28 * 60 * 60 * 1000)).toString());
        }
        upData["dailyGold"] = updateData;
        upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGiftGold(), data.currentGold);
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
}
exports.default = DailyGoldServer;
//# sourceMappingURL=DailyGoldServer.js.map