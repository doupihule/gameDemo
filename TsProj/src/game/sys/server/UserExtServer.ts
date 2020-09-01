import Client from "../../../framework/common/kakura/Client";
import GameTools from "../../../utils/GameTools";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import UserModel from "../model/UserModel";
import UserExtModel from "../model/UserExtModel";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import CacheManager from "../../../framework/manager/CacheManager";
import StorageCode from "../consts/StorageCode";

/*
userExt
 */
export default class UserExtServer {
    /*
    删除邀请好友标记
     */
    static delInviteFriendSign(data: any, callBack: any, thisObj: any) {
        var params = {}
        // Client.instance.send(Method.UserExt_InviteSign, params, callBack, thisObj);
    }

    //授权后发送用户信息到服务器
    static sendUserInfoAfterAuthorize(method: string, params, callback: any, thisObj: any, addParam: any = null) {
        Client.instance.startRequestCloud(method, params, callback, thisObj, addParam);
    }

    static updateLogoutTime(callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            logoutTime: Client.instance.serverTimeMicro,
        }
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }

    static updateGoodsAccumuStartTime(data, callBack = null, thisObj = null) {
        var upUserExtData = {};
        var upData = {};
        if (data && data.goodsAccumuStartTime) {
            if (UserModel.instance.getLogoutTime() != 3000000000 && UserModel.instance.getLogoutTime() > UserModel.instance.getGoodsAccumuStartTime()) {
                var newGoodsAccumuStartTime = Client.instance.serverTimeMicro - (UserModel.instance.getLogoutTime() - UserModel.instance.getGoodsAccumuStartTime());
                upUserExtData["goodsAccumuStartTime"] = newGoodsAccumuStartTime;
                upData["userExt"] = upUserExtData;
            }
        }
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }

    static updateTurnableOccurCount(data = null, callBack = null, thisObj = null) {
        var upUserExtData = {};
        var upData = {};

        upUserExtData["turnableOccurCount"] = 1;
        upData["userExt"] = upUserExtData;

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }

    /**设置本次玩游戏的次数
     * 每次调用次数加1，到达上限重置
     */
    static setPlayCount(data, callBack = null, thisObj = null) {
        var round = GlobalParamsFunc.instance.getDataByTwoId("secretBagTouchRound", "arr");
        var maxCount = round[0].split(",")[0];
        var curCount = UserExtModel.instance.getPlayCount();
        if (curCount >= Number(maxCount)) {
            curCount = 1
        } else {
            curCount += 1;
        }
        var upData = {};
        upData["userExt"] = {
            "playCount": curCount
        }
        var deData = {};
        var backData = Client.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();


    }

    /**
     * 离线金币领取
     * @param coinNum
     * @param landData
     * @param callBack
     * @param thisObj
     */
    static getOfflineIncome(coinNum: any, landData: any, offlineCoinTimes: number, callBack: any, thisObj: any) {
        var upData = {};
        var deData = {};
        // var coin = Number(UserModel.instance.getCoin());
        // coin += coinNum;
        var coin = BigNumUtils.sum(UserModel.instance.getCoin(), coinNum);
        var userExt = {};
        userExt["upCoinTime"] = Client.instance.serverTimeMicro;
        upData["land"] = landData;
        upData["coin"] = coin;
        upData["userExt"] = userExt;

        var backData = Client.instance.doDummyServerBack(null, upData, deData);

        // 更新领取次数
        CacheManager.instance.setLocalCache(StorageCode.storage_offlineCoinCount, offlineCoinTimes)

        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }


    /**获取金币 */
    static getFreeCoin(data, callBack = null, thisObj = null) {
        var upData = {};
        upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), data.coin);

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }


    //记录英雄免费进阶次数
    static setFreeAdvanceCount(params, callBack = null, thisObj = null) {
        var roleId = params.roleId;

        var round = GlobalParamsFunc.instance.getDataByTwoId("heroStageAppearVideointerval", "arr");
        var maxCount = round[0].split(",")[0];
        var curCount = UserExtModel.instance.getFreeAdvanceCount(roleId);

        if (curCount >= Number(maxCount)) {
            curCount = 1
        } else {
            curCount += 1;
        }

        var upData = {};
        var ext = {};
        ext[roleId] = curCount;
        upData["userExt"] = {
            "freeAdvanceCount": ext
        }


        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();

    }


    /**获取体力 */
    static getFreeSp(data, callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};
        userExtData["sp"] = UserExtModel.instance.getCurrentSp() + Number(data.reward);
        userExtData['upSpTime'] = Client.instance.serverTime;
        upData['userExt'] = userExtData;

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData(true);
    }

    static getSupplyBox(id, callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};

        userExtData["supplyBoxId"] = id;
        userExtData["supplyBoxTime"] = Client.instance.serverTime + GlobalParamsFunc.instance.getDataNum("supplyBox");

        upData["userExt"] = userExtData;
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData, id);
        }
        SingleCommonServer.startSaveClientData();
    }

    static getTurnable(callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};

        userExtData["turnable"] = 1;

        upData["userExt"] = userExtData;
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }

    //记录天赋免费升级次数
    static setTalentFreeUpgradeCount(params, callBack = null, thisObj = null) {

        var round = GlobalParamsFunc.instance.getDataByTwoId("talentVideoLevelUpShowInterval", "arr");
        var maxCount = round[0].split(",")[0];
        var curCount = UserExtModel.instance.getTalentFreeUpgradeCount();


        if (curCount >= Number(maxCount)) {
            curCount = 1
        } else {
            curCount += 1;
        }

        var upData = {};
        upData["userExt"] = {
            "talentFreeUpgradeCount": curCount
        }


        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData(true);

    }

    //更新离线时间
    static updateOfflineTime(params = {}, callBack = null, thisObj = null) {
        var upData = {};
        var userExtData = {};

        var offlineTime = UserExtModel.instance.getLoginTime() - UserExtModel.instance.getLastOfflineTime();
        if (offlineTime > GlobalParamsFunc.instance.getDataNum("offLineLeastTime")) {
            userExtData['offlineTime'] = UserExtModel.instance.getOfflineTime() + offlineTime;
        }
        userExtData['lastOfflineTime'] = Client.instance.miniserverTime;
        upData['userExt'] = userExtData;


        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData(true);

    }

    static setEverydayInvite(data = 1, callBack = null, thisObj = null) {
        var upData = {};

        upData["userExt"] = {
            "everydayInvite": data
        }

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData(true);
    }

    //更新进入迷雾漫画
    static setEnterFogFlag(data = 1, callBack = null, thisObj = null) {
        var upData = {};

        upData["userExt"] = {
            "enterFogFlag": data
        }

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }

    //更新每日首次进入迷雾状态
    static setDailyFirstEnterFog(data = 1, callBack = null, thisObj = null) {
        var upData = {};

        upData["userExt"] = {
            "dailyFirstEnterFog": data
        }

        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }

    //更新我的战力
    static saveMyForce(data, callBack = null, thisObj = null) {
        var upData = {};
        upData["userExt"] = {
            "force": data.force
        }
        var backData = Client.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }
}