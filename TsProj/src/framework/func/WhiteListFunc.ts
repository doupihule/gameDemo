import BaseFunc from "./BaseFunc";
import UserInfo from "../common/UserInfo";

export default class WhiteListFunc extends BaseFunc {

	private whiteList = [];
	private static _instance: WhiteListFunc;
	public static get instance() {
		if (!this._instance) {
			this._instance = new WhiteListFunc();
		}
		return this._instance;
	}

	/**
	 * 白名单列表类型：注册白名单
	 */
	static TYPE_REGISTER = 1;
	static TYPE_LOGIN = 2;

	getCfgsPathArr() {
		return [
			{name: "WhiteList_json"},
		]
	}

	/**获取白名单列表 */
	getWhiteList(type) {
		if (!this.whiteList[type]) {
			var list = this.getAllCfgData("WhiteList_json", true);
			this.whiteList[type] = [];
			var whitePlatform = null;
			if (UserInfo.isWX()) {
				whitePlatform = 1;
			} else if (UserInfo.isTT()) {
				whitePlatform = 2;
			} else if (UserInfo.isQQGame()) {
				whitePlatform = 3;
			} else if (UserInfo.isOppo()) {
				whitePlatform = 4;
			} else if (UserInfo.isBaidu()) {
				whitePlatform = 5;
			} else if (UserInfo.isVivo()) {
				whitePlatform = 6;
			} else {
				// 无白名单
				return [];
			}

			for (var key in list) {
				if (list.hasOwnProperty(key)) {
					if (list[key].whiteListPlatform == whitePlatform && list[key].type == type) {
						var element = list[key].whiteListNub;
						this.whiteList[type].push(String(element));
					}
				}
			}
		}
		return this.whiteList[type];
	}
}