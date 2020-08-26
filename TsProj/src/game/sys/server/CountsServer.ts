import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import GameUtils from "../../../utils/GameUtils";
import CountsModel from "../model/CountsModel";


export default class CountsServer {
	/**更新次数 */
	static updateCount(data, callBack = null, thisObj = null) {
		var upData = {};

		var id = data.id;
		var countData = {};

		countData["id"] = id;
		countData["count"] = CountsModel.instance.getCountsById(id) + 1;
		countData["expireTime"] = GameUtils.getNextRefreshTByTime(4);
		upData["counts"] = {
			[id]: countData,
		}


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();

	}
}