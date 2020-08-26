import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import {DataResourceType} from "../func/DataResourceFunc";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import UserModel from "../model/UserModel";
import SevenDayModel from "../model/SevenDayModel";
import FogFunc from "../func/FogFunc";

/* 
七日登录server
 */
export default class SevenDayServer {

	/**获取七日登录奖励 */
	static getSevendayReward(data = null, callBack = null, thisObj = null) {
		var upData = {};
		var sign = {};


		var reward = data.reward;
		upData = FogFunc.instance.getFogUpdata([reward], [], data.doubleRate || 1);
		var loginDay = SevenDayModel.instance.getLoginDay();
		sign["gainStep"] = (loginDay.gainStep || 0) + 1;
		upData["sign"] = sign;

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
	}

	static getReward(data, callBack = null, thisObj = null) {
		var upData = {};
		var reward = data.reward;

		if (Number(reward[0]) == DataResourceType.COIN) {
			upData["coin"] = BigNumUtils.sum(UserModel.instance.getCoin(), reward[1]);
		} else if (Number(reward[0]) == DataResourceType.GOLD) {
			upData["giftGold"] = BigNumUtils.sum(UserModel.instance.getGold(), reward[1]);
		}

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
	}

	/**设置登录天数 */
	static setLoginStep(callBack = null, thisObj = null) {
		var upData = {};
		var sign = {};

		var loginDay = SevenDayModel.instance.getLoginDay();
		var loginStep = loginDay.loginStep || 1;
		var gainStep = loginDay.gainStep || 0;
		if (loginStep == gainStep) {
			loginStep = gainStep + 1;
		}
		sign["loginStep"] = loginStep;
		upData["sign"] = sign;


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData(true);
	}
}