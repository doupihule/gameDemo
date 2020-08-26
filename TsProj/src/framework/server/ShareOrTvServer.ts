import Client from "../common/kakura/Client";
import UserModel from "../../game/sys/model/UserModel";
import SingleCommonServer from "./SingleCommonServer";
import ShareOrTvManager from "../manager/ShareOrTvManager";
import UserGlobalModel from "../model/UserGlobalModel";
import CountsCommonServer from "./CountsCommonServer";
import CountsCommonModel from "../model/CountsCommonModel";

/* 
免费金币钻石
 */
export default class ShareOrTvServer {
	/**发送看视频或分享请求 */
	static shareOrTvSend(data, callBack = null, thisObj = null) {
		if (ShareOrTvManager.leadTypeId) {
			var upData = {};
			if (data.type == ShareOrTvManager.TYPE_SHARE) {
				UserGlobalModel.instance.setShareNum(-1);
			}

			var turnId = CountsCommonModel.instance.turnShareTvId(ShareOrTvManager.leadTypeId);
			var value = CountsCommonModel.instance.getShareTvCountById(ShareOrTvManager.leadTypeId) + 1;
			CountsCommonServer.updateDayCounts(turnId, value, true, callBack, thisObj);
		} else {
			callBack && callBack.call(thisObj);
		}


	}

	//重置视频或者分享次数
	static resetSharOrTvCounts(callBack = null, thisObj = null) {
		if (!UserModel.instance.getData()) {
			callBack && callBack.call(thisObj);
			return;
		}
		var leadShareData = UserModel.instance.getData().leadShare;
		if (!leadShareData) {
			callBack && callBack.call(thisObj);
			return;
		}
		var upData = {leadShare: {}};
		for (var i in leadShareData) {
			upData.leadShare[i] = 0;
		}
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		SingleCommonServer.startSaveClientData();
		callBack && callBack.call(thisObj);
	}


}