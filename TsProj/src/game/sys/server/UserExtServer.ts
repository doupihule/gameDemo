import Client from "../../../framework/common/kakura/Client";
import Method from "../common/kakura/Method";
import UserModel from "../model/UserModel";
import UserExtModel from "../model/UserExtModel";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
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
    }

    //授权后发送用户信息到服务器
    static sendUserInfoAfterAuthorize(method: string, params, callback: any, thisObj: any, addParam: any = null) {
        Client.instance.startRequestCloud(method, params, callback, thisObj, addParam);
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
        var coin = Number(UserModel.instance.getCoin());
        coin += coinNum;
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

    /**获得界面领取奖励 */
    static getCommonReward(reward: any, callBack = null, thisObj = null) {

        var upData = {};
        var deData = {};
        var userExt = {};

        var coin = Number(UserModel.instance.getCoin());
        var gold = Number(UserModel.instance.getGiftGold());

        if (reward) {
            if (reward.coin && reward.coin > 0) {
                coin += reward.coin;
                upData["coin"] = coin;
            }
            if (reward.gold && reward.gold > 0) {
                gold += reward.gold;
                upData["giftGold"] = gold;
            }
            if (reward.sp && reward.sp > 0) {
                UserExtModel.instance.changeSp(reward.sp);
                userExt['sp'] = UserExtModel.instance.getNowSp();
                userExt['upSpTime'] = UserExtModel.instance.getUpTime();
                upData["userExt"] = userExt;
            }
        }

        var backData = Client.instance.doDummyServerBack(null, upData, deData);

        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }
}