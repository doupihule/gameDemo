"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const Client_1 = require("../../../framework/common/kakura/Client");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const UserExtModel_1 = require("../model/UserExtModel");
const CacheManager_1 = require("../../../framework/manager/CacheManager");
const StorageCode_1 = require("../consts/StorageCode");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const TurnableFunc_1 = require("../func/TurnableFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
const CountsModel_1 = require("../model/CountsModel");
const TaskServer_1 = require("./TaskServer");
const TaskConditionTrigger_1 = require("../trigger/TaskConditionTrigger");
class DataResourceServer {
    /**获取转盘奖励 */
    static getTurnTableReward(data, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var rewardList = TurnableFunc_1.default.instance.getRewardList();
        var datas = GameUtils_1.default.getRewardAndIndex(rewardList);
        //这里改成转完之后再加奖励
        // //更新货币
        // var result = datas.arr;
        // if (Number(result[0]) == DataResourceType.COIN) {
        //     upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), Number(result[1]));
        // } else if (Number(result[0]) == DataResourceType.GOLD) {
        //     upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGiftGold(), Number(result[1]));
        // } 
        //更新转盘次数
        var countData = {};
        var count = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.freeTurnableCount);
        //如果次数为0并且有宝箱领取纪录就先清掉领取纪录
        if (count == 0) {
            countData["expireTime"] = GameUtils_1.default.getNextRefreshTByTime(0);
            if (UserExtModel_1.default.instance.getIsBox()) {
                deData["userExt"] = {
                    getBoxCount: 1
                };
            }
        }
        countData["id"] = CountsModel_1.default.freeTurnableCount;
        countData["count"] = count + 1;
        upData["counts"] = {
            [CountsModel_1.default.freeTurnableCount]: countData
        };
        var extraData = {
            randValue: datas.index
        };
        var backData = Client_1.default.instance.doDummyServerBack(extraData, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_turntable }, null, null, false);
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    /**获取转盘宝箱奖励 */
    static getBoxReward(data, callBack = null, thisObj = null) {
        var upData = {};
        //更新货币
        var result = data.reward[0].split(",");
        if (Number(result[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), result[1]);
        }
        else if (Number(result[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGiftGold(), result[1]);
        }
        //更新宝箱领取状态
        var getCount = {};
        getCount[data.index] = 1;
        upData["userExt"] = {
            getBoxCount: getCount
        };
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    /**获取奖励 */
    static getReward(params, callBack = null, thisObj = null) {
        var upData = {};
        if (!params.reward) {
            return;
        }
        //更新货币
        var reward = params.reward;
        if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), reward[1]);
        }
        else if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGiftGold(), reward[1]);
        }
        if (params.offlineTime) {
            upData["userExt"] = {
                "offlineTime": 0
            };
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    //领取邀请奖励
    static getInviteReward(params, callBack = null, thisObj = null) {
        var upData = {};
        upData["inviteReward"] = {
            [params.id]: true
        };
        var reward = params.reward;
        if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), reward[1]);
        }
        else if (Number(reward[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGiftGold(), reward[1]);
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData(true);
    }
    /**更新资源 */
    static updateResource(data, callBack = null, thisObj = null) {
        var upData = {};
        if (!data || !data.res || Object.keys(data.res).length == 0) {
            return;
        }
        for (var type in data.res) {
            //资源更新
            if (data.res[type]) {
                //coin更新
                if (Number(type) == DataResourceFunc_1.DataResourceType.COIN) {
                    upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), data.res[type]);
                }
                //fogCoin更新
                if (Number(type) == DataResourceFunc_1.DataResourceType.FOGCOIN) {
                    upData["fogCoin"] = UserModel_1.default.instance.getFogCoinNum() + Number(data.res[type]);
                }
            }
        }
        // 更新领取次数
        if (data.rewardCount) {
            CacheManager_1.default.instance.setLocalCache(StorageCode_1.default.storage_fogBattleResultCount, data.rewardCount);
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = DataResourceServer;
//# sourceMappingURL=DataResourceServer.js.map