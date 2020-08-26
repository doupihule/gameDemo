import UserModel from "../../game/sys/model/UserModel";
import Client from "../common/kakura/Client";
import SingleCommonServer from "./SingleCommonServer";

/**
 * banner序列逻辑
 */
export class BannerOrRecommendServer {
	/**发送Banner或推荐请求 */
	static BannerOrRecommendSend(callBack = null, thisObj = null) {
		var upData = {};
		upData["leadBanner"] = UserModel.instance.getBannerOrder() + 1;

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		SingleCommonServer.startSaveClientData();

		callBack && callBack.call(thisObj);
	}

}