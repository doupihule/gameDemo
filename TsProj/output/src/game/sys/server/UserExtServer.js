"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../../framework/common/kakura/Client");
const GameUtils_1 = require("../../../utils/GameUtils");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const UserModel_1 = require("../model/UserModel");
const CountsModel_1 = require("../model/CountsModel");
const UserExtModel_1 = require("../model/UserExtModel");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const CacheManager_1 = require("../../../framework/manager/CacheManager");
const StorageCode_1 = require("../consts/StorageCode");
/*
userExt
 */
class UserExtServer {
    /*
    删除邀请好友标记
     */
    static delInviteFriendSign(data, callBack, thisObj) {
        var params = {};
        // Client.instance.send(Method.UserExt_InviteSign, params, callBack, thisObj);
    }
    //授权后发送用户信息到服务器
    static sendUserInfoAfterAuthorize(method, params, callback, thisObj, addParam = null) {
        Client_1.default.instance.startRequestCloud(method, params, callback, thisObj, addParam);
    }
    static updateLogoutTime(callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            logoutTime: Client_1.default.instance.serverTimeMicro,
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    static updateGoodsAccumuStartTime(data, callBack = null, thisObj = null) {
        var upUserExtData = {};
        var upData = {};
        if (data && data.goodsAccumuStartTime) {
            if (UserModel_1.default.instance.getLogoutTime() != 3000000000 && UserModel_1.default.instance.getLogoutTime() > UserModel_1.default.instance.getGoodsAccumuStartTime()) {
                var newGoodsAccumuStartTime = Client_1.default.instance.serverTimeMicro - (UserModel_1.default.instance.getLogoutTime() - UserModel_1.default.instance.getGoodsAccumuStartTime());
                upUserExtData["goodsAccumuStartTime"] = newGoodsAccumuStartTime;
                upData["userExt"] = upUserExtData;
            }
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    static updateTurnableOccurCount(data = null, callBack = null, thisObj = null) {
        var upUserExtData = {};
        var upData = {};
        upUserExtData["turnableOccurCount"] = 1;
        upData["userExt"] = upUserExtData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**设置本次玩游戏的次数
   * 每次调用次数加1，到达上限重置
   */
    static setPlayCount(data, callBack = null, thisObj = null) {
        var round = GlobalParamsFunc_1.default.instance.getDataByTwoId("secretBagTouchRound", "arr");
        var maxCount = round[0].split(",")[0];
        var curCount = UserExtModel_1.default.instance.getPlayCount();
        if (curCount >= Number(maxCount)) {
            curCount = 1;
        }
        else {
            curCount += 1;
        }
        var upData = {};
        upData["userExt"] = {
            "playCount": curCount
        };
        var deData = {};
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**
     * 离线金币领取
     * @param coinNum
     * @param landData
     * @param callBack
     * @param thisObj
     */
    static getOfflineIncome(coinNum, landData, offlineCoinTimes, callBack, thisObj) {
        var upData = {};
        var deData = {};
        // var coin = Number(UserModel.instance.getCoin());
        // coin += coinNum;
        var coin = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), coinNum);
        var userExt = {};
        userExt["upCoinTime"] = Client_1.default.instance.serverTimeMicro;
        upData["land"] = landData;
        upData["coin"] = coin;
        upData["userExt"] = userExt;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        // 更新领取次数
        CacheManager_1.default.instance.setLocalCache(StorageCode_1.default.storage_offlineCoinCount, offlineCoinTimes);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**获取金币 */
    static getFreeCoin(data, callBack = null, thisObj = null) {
        var upData = {};
        upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), data.coin);
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //记录英雄免费进阶次数
    static setFreeAdvanceCount(params, callBack = null, thisObj = null) {
        var roleId = params.roleId;
        var round = GlobalParamsFunc_1.default.instance.getDataByTwoId("heroStageAppearVideointerval", "arr");
        var maxCount = round[0].split(",")[0];
        var curCount = UserExtModel_1.default.instance.getFreeAdvanceCount(roleId);
        if (curCount >= Number(maxCount)) {
            curCount = 1;
        }
        else {
            curCount += 1;
        }
        var upData = {};
        var ext = {};
        ext[roleId] = curCount;
        upData["userExt"] = {
            "freeAdvanceCount": ext
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    /**获取体力 */
    static getFreeSp(data, callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};
        userExtData["sp"] = UserExtModel_1.default.instance.getCurrentSp() + Number(data.reward);
        userExtData['upSpTime'] = Client_1.default.instance.serverTime;
        upData['userExt'] = userExtData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    static getSupplyBox(id, callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};
        userExtData["supplyBoxId"] = id;
        userExtData["supplyBoxTime"] = Client_1.default.instance.serverTime + GlobalParamsFunc_1.default.instance.getDataNum("supplyBox");
        upData["userExt"] = userExtData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData, id);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    static getTurnable(callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};
        userExtData["turnable"] = 1;
        upData["userExt"] = userExtData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //记录天赋免费升级次数
    static setTalentFreeUpgradeCount(params, callBack = null, thisObj = null) {
        var round = GlobalParamsFunc_1.default.instance.getDataByTwoId("talentVideoLevelUpShowInterval", "arr");
        var maxCount = round[0].split(",")[0];
        var curCount = UserExtModel_1.default.instance.getTalentFreeUpgradeCount();
        if (curCount >= Number(maxCount)) {
            curCount = 1;
        }
        else {
            curCount += 1;
        }
        var upData = {};
        upData["userExt"] = {
            "talentFreeUpgradeCount": curCount
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    //更新离线时间
    static updateOfflineTime(params = {}, callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};
        var offlineTime = UserExtModel_1.default.instance.getLoginTime() - UserExtModel_1.default.instance.getLastOfflineTime();
        if (offlineTime > GlobalParamsFunc_1.default.instance.getDataNum("offLineLeastTime")) {
            userExtData['offlineTime'] = UserExtModel_1.default.instance.getOfflineTime() + offlineTime;
        }
        userExtData['lastOfflineTime'] = Client_1.default.instance.miniserverTime;
        upData['userExt'] = userExtData;
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    /**获取宝箱奖励 */
    static setAutoOpenAirDrop(data = null, callBack = null, thisObj = null) {
        var upData = {};
        var countData = {};
        var count = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.autoOpenAirDrop);
        if (count == 0) {
            countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(4);
        }
        countData["id"] = CountsModel_1.default.autoOpenAirDrop;
        countData["count"] = count + 1;
        upData["counts"] = {
            [CountsModel_1.default.autoOpenAirDrop]: countData
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    static setEverydayInvite(data = 1, callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            "everydayInvite": data
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    //更新进入迷雾漫画
    static setEnterFogFlag(data = 1, callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            "enterFogFlag": data
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //更新每日首次进入迷雾状态
    static setDailyFirstEnterFog(data = 1, callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            "dailyFirstEnterFog": data
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
    //更新我的战力
    static saveMyForce(data, callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            "force": data.force
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = UserExtServer;
//# sourceMappingURL=UserExtServer.js.map