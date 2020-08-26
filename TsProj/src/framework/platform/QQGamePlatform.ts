import WXGamePlatform from "./WXGamePlatform";
import Global from "../../utils/Global";
import LogsManager from "../manager/LogsManager";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";

export default class QQGamePlatform extends WXGamePlatform {

	public constructor() {
		super();
	}

	shareAldAppMsg(data, shareCallBack) {
		//阿拉丁分享统计
		qq.shareAppMessage({
			title: data.title,
			imageUrl: data.imgUrl,
			query: data.params,
			success(res) {
				console.log(">>>>>>>> QQGamePlatform share succ1>>>>>>>", res);
				shareCallBack(1)
			},
			fail(res) {
				console.log(">>>>>>>> QQGamePlatform share fail1>>>>>>>", res);
				shareCallBack(0)
			}
		});

		console.log(">>>>>>>>shareAppMessage>>>>>>>", data);
	}

	/**右上角三点分享监听函数 */
	myOnShare(callback: Function) {
		qq.onShareAppMessage(callback);
	}

	/**
	 * 添加到桌面
	 */
	addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
		if (!this.canAddToDesktop()) {
			failCall && failCall.call(thisObj)
			return;
		}
		this.getWX().saveAppToDesktop({
			success: (res) => {
				LogsManager.echo("hlx 添加到桌面成功", JSON.stringify(res));
				StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_DESKTOP_SUCCESS);
				successCall && successCall.call(thisObj)
			},
			fail: (res) => {
				LogsManager.echo("hlx 添加到桌面失败", JSON.stringify(res));
				StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_DESKTOP_FAIL);
				failCall && failCall.call(thisObj)
			}
		})
	}

	/**
	 * 是否从小程序收藏进入
	 */
	isFromFavourite() {
		if (Global.currentSceneId != "3003") {
			return false;
		}
		return true;
	}
}
