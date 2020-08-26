import GameUtils from "../../utils/GameUtils";
import Client from "../common/kakura/Client";
import SingleCommonServer from "./SingleCommonServer";

export default class CountsCommonServer {
	static upData = {};

	/**
	 * 原生自动点击
	 */
	static updateDayCounts(type, value, isSend = true, callBack = null, thisObj = null) {
		var countData = {};
		countData["expireTime"] = GameUtils.getNextRefreshTByTime(4)
		countData["id"] = type;
		countData["count"] = value;
		if (!this.upData["countsCommon"]) {
			this.upData["countsCommon"] = {}
		}

		this.upData["countsCommon"][type] = countData
		if (isSend == true) {
			Client.instance.doDummyServerBack(null, this.upData, null);
			this.upData = {};
			SingleCommonServer.startSaveClientData();
		}

		callBack && callBack.call(thisObj);
	}
}
