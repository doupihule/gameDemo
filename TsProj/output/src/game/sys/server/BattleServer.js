"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const Client_1 = require("../../../framework/common/kakura/Client");
const LevelFunc_1 = require("../func/LevelFunc");
const UserExtModel_1 = require("../model/UserExtModel");
const GlobalParamsFunc_1 = require("../func/GlobalParamsFunc");
const CacheManager_1 = require("../../../framework/manager/CacheManager");
const StorageCode_1 = require("../consts/StorageCode");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const DataResourceFunc_1 = require("../func/DataResourceFunc");
const SingleCommonServer_1 = require("../../../framework/server/SingleCommonServer");
const BattleFunc_1 = require("../func/BattleFunc");
const PiecesModel_1 = require("../model/PiecesModel");
const BattleConst_1 = require("../consts/BattleConst");
const FogFunc_1 = require("../func/FogFunc");
const FogModel_1 = require("../model/FogModel");
const FogServer_1 = require("./FogServer");
const TaskServer_1 = require("./TaskServer");
const TaskConditionTrigger_1 = require("../trigger/TaskConditionTrigger");
/*
对战模块
 */
class BattleServer {
    static battleResult(data = null, callBack = null, thisObj = null) {
        var upData = {};
        var deData = {};
        var userExt = {};
        var rewardList;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            if (data.isWin) {
                rewardList = LevelFunc_1.default.instance.getLevelInfoById(data.levelId).victoryReward;
            }
            else {
                rewardList = LevelFunc_1.default.instance.getLevelInfoById(data.levelId).defeatReward;
            }
            var coin = 0;
            var gold = 0;
            var piece = 0;
            var pieceId;
            for (var index in rewardList) {
                var reward = rewardList[index].split(",");
                switch (Number(reward[0])) {
                    case DataResourceFunc_1.DataResourceType.COIN:
                        coin += Number(reward[1]);
                        break;
                    case DataResourceFunc_1.DataResourceType.GOLD:
                        gold += Number(reward[1]);
                        break;
                    case DataResourceFunc_1.DataResourceType.PIECE:
                        piece += Number(reward[2]);
                        pieceId = reward[1];
                        break;
                }
            }
            if (data.isWin) {
                var curLevel = Number(UserModel_1.default.instance.getMaxBattleLevel());
                if (data.levelId > curLevel) {
                    var allLevel = LevelFunc_1.default.instance.getMaxLevel();
                    if (data.levelId > allLevel) {
                        data.levelId = allLevel;
                    }
                    userExt["maxStage"] = data.levelId;
                    upData["userExt"] = userExt;
                    var level;
                    FogServer_1.default.getReward({ reward: LevelFunc_1.default.instance.getLevelInfoById(data.levelId).firstReward, doubleRate: data.doubleRate }, null, null, false);
                }
                // 更新领取次数
                CacheManager_1.default.instance.setLocalCache(StorageCode_1.default.storage_battleResultCount, Number(data.receiveCount) + 1);
                //更新任务完成
                TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_levelWin }, null, null, false);
            }
            if (coin != 0) {
                upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), coin * data.doubleRate);
            }
            if (gold != 0) {
                upData["giftGold"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getGiftGold(), gold * data.doubleRate);
            }
            if (piece != 0) {
                var pieces = {};
                pieces[pieceId] = { count: PiecesModel_1.default.instance.getPieceCount(pieceId) + piece * data.doubleRate };
                upData["pieces"] = pieces;
            }
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            if (data.isWin) {
                var enemy = FogFunc_1.default.enemyCell.eventData;
                var reward = enemy.enemyData.reward;
                var count = Math.floor((reward[1] + reward[2] * FogModel_1.default.instance.getCurLayer()) * data.doubleRate);
                var rewardArr = [[reward[0], count]];
                upData = FogFunc_1.default.instance.getFogUpdata(rewardArr, []);
                CacheManager_1.default.instance.setLocalCache(StorageCode_1.default.storage_fogBattleResultCount, Number(data.receiveCount) + 1);
                FogServer_1.default.saveFogReward({ reward: rewardArr }, null, null, false);
            }
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        SingleCommonServer_1.default.startSaveClientData();
        if (callBack) {
            callBack.call(thisObj, backData);
        }
    }
    static battleStart(callBack, thisObj) {
        var upData = {};
        var deData = {};
        var userExt = {};
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            var levelSpCost = GlobalParamsFunc_1.default.instance.getDataNum('levelSpCost');
            UserExtModel_1.default.instance.changeSp(-levelSpCost);
            userExt['sp'] = UserExtModel_1.default.instance.getNowSp();
            userExt['upSpTime'] = UserExtModel_1.default.instance.getUpTime();
            upData["userExt"] = userExt;
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            upData = FogFunc_1.default.instance.getFogUpdata([], [DataResourceFunc_1.DataResourceType.ACT, FogFunc_1.default.enemyCell.eventData.mobilityCost]);
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, deData);
        if (callBack) {
            callBack.call(thisObj, backData);
        }
        SingleCommonServer_1.default.startSaveClientData();
    }
}
exports.default = BattleServer;
//# sourceMappingURL=BattleServer.js.map