import UserModel from "../model/UserModel";
import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import DailyGoldModel from "../model/DailyGoldModel";


export default class DailyGoldServer {
	//更新观看视频次数
	static updateWatchTime(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var updateData = {};

		updateData["watchTime"] = data.watchTime;
		var dailyGold = DailyGoldModel.instance.getDailyGoldData();
		if (!dailyGold.currentGoldStep) {
			updateData["currentGoldStep"] = 0;
		}
		if (!dailyGold.expireTime) {
			updateData["expireTime"] = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 28 * 60 * 60 * 1000)).toString());
		}
		upData["dailyGold"] = updateData;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);

	}

	//领取钻石奖励
	static gainReward(data, callBack = null, thisObj = null) {
		var upData = {};
		var updateData = {};


		updateData["watchTime"] = 0;
		updateData["currentGoldStep"] = data.currentGoldStep;
		var dailyGold = DailyGoldModel.instance.getDailyGoldData();
		if (!dailyGold.expireTime || dailyGold.expireTime <= Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 4 * 60 * 60 * 1000)).toString())) {
			updateData["expireTime"] = Date.parse(new Date((new Date(new Date().toLocaleDateString()).getTime() + 28 * 60 * 60 * 1000)).toString());
		}


		upData["dailyGold"] = updateData;
		upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGiftGold(), data.currentGold);


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
	}
}