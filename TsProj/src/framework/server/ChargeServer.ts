import Client from "../common/kakura/Client";
import UserModel from "../../game/sys/model/UserModel";
import BigNumUtils from "../utils/BigNumUtils";
import SingleCommonServer from "./SingleCommonServer";

/* 
user
 */
export default class ChargeServer {

	//获取充值奖励
	static getChargeReward(list, callback, thisObj) {
		var reward = list;
		var upData = {};
		for (var key in reward) {
			var result = reward[key].split(",");
			switch (Number(result[0])) {
				case 2://COIN
					var coinNum = result[1];
					if (coinNum) {
						upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), coinNum);
					}
					break;
				case 3://GOLD
					var goldNum = Number(result[1]);
					if (goldNum) {
						upData["giftGold"] = UserModel.instance.getGold() + goldNum;
					}
					break;
			}
		}
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callback) {
			callback.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
}