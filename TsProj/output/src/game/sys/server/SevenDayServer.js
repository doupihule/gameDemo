"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const UserModel_1 = require("../model/UserModel");
const SevenDayModel_1 = require("../model/SevenDayModel");
const FogFunc_1 = require("../func/FogFunc");
/*
七日登录server
 */
class SevenDayServer {
    /**获取七日登录奖励 */
    static getSevendayReward(data = null, callBack = null, thisObj = null) {
        var upData = {};
        var sign = {};
        var reward = data.reward;
        upData = FogFunc_1.default.instance.getFogUpdata([reward], [], data.doubleRate || 1);
        var loginDay = SevenDayModel_1.default.instance.getLoginDay();
        sign["gainStep"] = (loginDay.gainStep || 0) + 1;
        upData["sign"] = sign;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    static getReward(data, callBack = null, thisObj = null) {
        var upData = {};
        var reward = data.reward;
        if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), reward[1]);
        }
        else if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGold(), reward[1]);
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    /**设置登录天数 */
    static setLoginStep(callBack = null, thisObj = null) {
        var upData = {};
        var sign = {};
        var loginDay = SevenDayModel_1.default.instance.getLoginDay();
        var loginStep = loginDay.loginStep || 1;
        var gainStep = loginDay.gainStep || 0;
        if (loginStep == gainStep) {
            loginStep = gainStep + 1;
        }
        sign["loginStep"] = loginStep;
        upData["sign"] = sign;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
}
exports.default = SevenDayServer;
//# sourceMappingURL=SevenDayServer.js.map