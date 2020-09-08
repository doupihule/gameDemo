import UserModel from "../model/UserModel";
import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import LevelFunc from "../func/LevelFunc";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import UserExtModel from "../model/UserExtModel";


/* 
对战模块
 */
export default class BattleServer {

    static battleResult(levelId, star: any, callBack: any, thisObj: any) {
        if (star >= 4 || star <= 0) return;
        var upData = {};
        var deData = {};
        var userExt = {};
        var coin = Number(UserModel.instance.getCoin());
        var gold = Number(UserModel.instance.getGiftGold());

        var levelInfo = LevelFunc.instance.getLevelInfoById(levelId);
        var reward = levelInfo.reward;
        var getCoin = 0;
        var getGold = 0;
        if (star >= 3) {
            var rewardInfo = reward[0].split(",");
            if (rewardInfo[0] == 2) {
                getCoin += Number(rewardInfo[1]);
            }
            if (rewardInfo[0] == 3) {
                getGold += Number(rewardInfo[1]);
            }
        }
        if (star >= 2) {
            var rewardInfo = reward[1].split(",");
            if (rewardInfo[0] == 2) {
                getCoin += Number(rewardInfo[1]);
            }
            if (rewardInfo[0] == 3) {
                getGold += Number(rewardInfo[1]);
            }
        }
        if (star >= 1) {
            var rewardInfo = reward[2].split(",");
            if (rewardInfo[0] == 2) {
                getCoin += Number(rewardInfo[1]);
            }
            if (rewardInfo[0] == 3) {
                getGold += Number(rewardInfo[1]);
            }
        }
        if (getCoin > 0) {
            coin += getCoin;
            upData["coin"] = coin;
        }
        if (getGold > 0) {
            gold += getGold;
            upData["giftGold"] = gold;
        }

        if (Number(levelId) > Number(UserModel.instance.getMaxBattleLevel())) {
            userExt["maxStage"] = levelId;
        }

        userExt["stageRank"] = {};
        if (UserModel.instance.getstageRank(levelId) < star) {
            userExt["stageRank"][levelId] = star;
        }

        upData["userExt"] = userExt;
        var backData = Client.instance.doDummyServerBack(null, upData, deData);

        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }
    static battleStart(callBack: any, thisObj: any) {
        
        var upData = {};
        var deData = {};
        var userExt = {};
       
        //战斗消耗体力
        var levelSpCost = GlobalParamsFunc.instance.getDataNum('levelSpCost');

        UserExtModel.instance.changeSp(-levelSpCost);
        userExt['sp'] = UserExtModel.instance.getNowSp();
        userExt['upSpTime'] = UserExtModel.instance.getUpTime();

        upData["userExt"] = userExt;
        var backData = Client.instance.doDummyServerBack(null, upData, deData);

        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }
}