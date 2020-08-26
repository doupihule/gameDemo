import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";

export default class SwitchServer {
	/**更新开关 */
	static updateSwitch(data, callBack = null, thisObj = null) {
		var uData = {};
		uData["switches"] = data.switch;
		var backData = Client.instance.doDummyServerBack(null, uData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
}