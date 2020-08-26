import UserModel from "../model/UserModel";
import Client from "../../../framework/common/kakura/Client";
import LevelFunc from "../func/LevelFunc";
import UserExtModel from "../model/UserExtModel";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import CacheManager from "../../../framework/manager/CacheManager";
import StorageCode from "../consts/StorageCode";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import {DataResourceType} from "../func/DataResourceFunc";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import BattleFunc from "../func/BattleFunc";
import PiecesModel from "../model/PiecesModel";
import BattleConst from "../consts/BattleConst";
import FogFunc from "../func/FogFunc";
import FogEventData from "../../fog/data/FogEventData";
import FogModel from "../model/FogModel";
import FogServer from "./FogServer";
import TaskServer from "./TaskServer";
import TaskConditionTrigger from "../trigger/TaskConditionTrigger";

/* 
对战模块
 */
export default class BattleServer {


	static battleResult(data = null, callBack: any = null, thisObj: any = null) {


		var upData = {};
		var deData = {};

		var userExt = {};


		var rewardList;
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			if (data.isWin) {
				rewardList = LevelFunc.instance.getLevelInfoById(data.levelId).victoryReward;
			} else {
				rewardList = LevelFunc.instance.getLevelInfoById(data.levelId).defeatReward;
			}
			var coin = 0;
			var gold = 0;
			var piece = 0;
			var pieceId;
			for (var index in rewardList) {
				var reward = rewardList[index].split(",");
				switch (Number(reward[0])) {
					case DataResourceType.COIN:
						coin += Number(reward[1]);
						break;
					case DataResourceType.GOLD:
						gold += Number(reward[1]);
						break;
					case DataResourceType.PIECE:
						piece += Number(reward[2]);
						pieceId = reward[1];
						break;
				}
			}
			if (data.isWin) {
				var curLevel = Number(UserModel.instance.getMaxBattleLevel());
				if (data.levelId > curLevel) {
					var allLevel = LevelFunc.instance.getMaxLevel();
					if (data.levelId > allLevel) {
						data.levelId = allLevel;
					}
					userExt["maxStage"] = data.levelId;
					upData["userExt"] = userExt;
					var level
					FogServer.getReward({
						reward: LevelFunc.instance.getLevelInfoById(data.levelId).firstReward,
						doubleRate: data.doubleRate
					}, null, null, false)
				}

				// 更新领取次数
				CacheManager.instance.setLocalCache(StorageCode.storage_battleResultCount, Number(data.receiveCount) + 1);
				//更新任务完成
				TaskServer.updateTaskProcess({logicType: TaskConditionTrigger.taskCondition_levelWin}, null, null, false)
			}
			if (coin != 0) {
				upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), coin * data.doubleRate);

			}
			if (gold != 0) {
				upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGiftGold(), gold * data.doubleRate);
			}
			if (piece != 0) {
				var pieces = {};
				pieces[pieceId] = {count: PiecesModel.instance.getPieceCount(pieceId) + piece * data.doubleRate}
				upData["pieces"] = pieces;
			}
		} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			if (data.isWin) {
				var enemy: FogEventData = FogFunc.enemyCell.eventData;
				var reward = enemy.enemyData.reward;
				var count = Math.floor((reward[1] + reward[2] * FogModel.instance.getCurLayer()) * data.doubleRate);
				var rewardArr = [[reward[0], count]]
				upData = FogFunc.instance.getFogUpdata(rewardArr, []);
				CacheManager.instance.setLocalCache(StorageCode.storage_fogBattleResultCount, Number(data.receiveCount) + 1);
				FogServer.saveFogReward({reward: rewardArr}, null, null, false)
			}
		}

		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		SingleCommonServer.startSaveClientData();

		if (callBack) {
			callBack.call(thisObj, backData);
		}
	}

	static battleStart(callBack: any, thisObj: any) {

		var upData = {};
		var deData = {};
		var userExt = {};
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			var levelSpCost = GlobalParamsFunc.instance.getDataNum('levelSpCost');
			UserExtModel.instance.changeSp(-levelSpCost);
			userExt['sp'] = UserExtModel.instance.getNowSp();
			userExt['upSpTime'] = UserExtModel.instance.getUpTime();
			upData["userExt"] = userExt;
		} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			upData = FogFunc.instance.getFogUpdata([], [DataResourceType.ACT, FogFunc.enemyCell.eventData.mobilityCost]);
		}
		var backData = Client.instance.doDummyServerBack(null, upData, deData);

		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
}