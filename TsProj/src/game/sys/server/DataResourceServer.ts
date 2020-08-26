import UserModel from "../model/UserModel";
import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserExtModel from "../model/UserExtModel";
import CacheManager from "../../../framework/manager/CacheManager";
import StorageCode from "../consts/StorageCode";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import {DataResourceType} from "../func/DataResourceFunc";
import TurnableFunc from "../func/TurnableFunc";
import GameUtils from "../../../utils/GameUtils";
import CountsModel from "../model/CountsModel";
import TaskServer from "./TaskServer";
import TaskConditionTrigger from "../trigger/TaskConditionTrigger";


export default class DataResourceServer {
	/**获取转盘奖励 */
	static getTurnTableReward(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};


		var rewardList = TurnableFunc.instance.getRewardList();
		var datas = GameUtils.getRewardAndIndex(rewardList);

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
		var count = CountsModel.instance.getCountsById(CountsModel.freeTurnableCount);
		//如果次数为0并且有宝箱领取纪录就先清掉领取纪录
		if (count == 0) {
			countData["expireTime"] = GameUtils.getNextRefreshTByTime(0);
			if (UserExtModel.instance.getIsBox()) {
				deData["userExt"] = {
					getBoxCount: 1
				}
			}
		}
		countData["id"] = CountsModel.freeTurnableCount;
		countData["count"] = count + 1;
		upData["counts"] = {
			[CountsModel.freeTurnableCount]: countData
		}

		var extraData = {
			randValue: datas.index
		}
		var backData = Client.instance.doDummyServerBack(extraData, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		TaskServer.updateTaskProcess({logicType: TaskConditionTrigger.taskCondition_turntable}, null, null, false)

		SingleCommonServer.startSaveClientData(true);

	}

	/**获取转盘宝箱奖励 */
	static getBoxReward(data, callBack = null, thisObj = null) {
		var upData = {};


		//更新货币
		var result = data.reward[0].split(",");
		if (Number(result[0]) == DataResourceType.COIN) {
			upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), result[1]);
		} else if (Number(result[0]) == DataResourceType.GOLD) {
			upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGiftGold(), result[1]);
		}

		//更新宝箱领取状态
		var getCount = {};
		getCount[data.index] = 1;
		upData["userExt"] = {
			getBoxCount: getCount
		}

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
	}

	/**获取奖励 */
	static getReward(params, callBack = null, thisObj = null) {
		var upData = {};
		if (!params.reward) {
			return;
		}

		//更新货币
		var reward = params.reward;
		if (Number(reward[0]) == DataResourceType.COIN) {
			upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), reward[1]);
		} else if (Number(reward[0]) == DataResourceType.GOLD) {
			upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGiftGold(), reward[1]);
		}

		if (params.offlineTime) {
			upData["userExt"] = {
				"offlineTime": 0
			};
		}

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
	}

	//领取邀请奖励
	static getInviteReward(params, callBack = null, thisObj = null) {
		var upData = {};

		upData["inviteReward"] = {
			[params.id]: true
		};

		var reward = params.reward;
		if (Number(reward[0]) == DataResourceType.COIN) {
			upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), reward[1]);
		} else if (Number(reward[0]) == DataResourceType.GOLD) {
			upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGiftGold(), reward[1]);
		}


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
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
				if (Number(type) == DataResourceType.COIN) {
					upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), data.res[type]);
				}
				//fogCoin更新
				if (Number(type) == DataResourceType.FOGCOIN) {
					upData["fogCoin"] = UserModel.instance.getFogCoinNum() + Number(data.res[type]);
				}
			}
		}

		// 更新领取次数
		if (data.rewardCount) {
			CacheManager.instance.setLocalCache(StorageCode.storage_fogBattleResultCount, data.rewardCount);
		}


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
}