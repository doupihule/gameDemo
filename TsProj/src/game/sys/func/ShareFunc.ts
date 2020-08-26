import BaseFunc from "../../../framework/func/BaseFunc";
import GameUtils from "../../../utils/GameUtils";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import UserInfo from "../../../framework/common/UserInfo";
import UserModel from "../model/UserModel";
import SubPackageManager from "../../../framework/manager/SubPackageManager";
import GameSwitch from "../../../framework/common/GameSwitch";
import SubPackageConst from "../consts/SubPackageConst";

export default class ShareFunc extends BaseFunc {
	private static _instance: ShareFunc;
	public static get instance(): ShareFunc {
		if (!this._instance) {
			this._instance = new ShareFunc();
		}
		return this._instance;
	}

	getCfgsPathArr() {
		return [
			{name: "Share_json"},
			{name: "TranslateShare_json"}
		]
	}

	/**根据分享id和平台id获取分享数据 */
	getShareData(id: string, platformId: string = null) {
		if (!id) return;
		if (!platformId) {
			platformId = UserInfo.platformId;
		}
		var shareCfg = this.getAllCfgData("Share_json");
		var shareData: any = {};
		var myShare: any[] = [];
		for (const cfgId in shareCfg) {
			if (cfgId == id) {
				var data = shareCfg[cfgId];
				for (const arrData in data) {
					if (data.hasOwnProperty(arrData)) {
						const element2 = data[arrData];
						myShare.push(element2);
					}
				}
			}
		}
		if (myShare.length > 0) {
			var result = this.getShareByWeight(myShare);
			var desStr: string;
			if (platformId == "qqgame") {
				desStr = result["descQq"];
			} else if (platformId == "wxgame") {
				desStr = result["descWx"];
				if (this.isUseLocalShareImg()) {
					if (result["separateDescWx"]) {
						desStr = result["separateDescWx"];
					} else if (result["descWx"]) {
						desStr = result["descWx"];
					}
				} else {
					if (result["descWx"]) {
						desStr = result["descWx"];
					} else if (result["separateDescWx"]) {
						desStr = result["separateDescWx"];
					}
				}
			} else if (platformId == "tt") {
				desStr = result["descWx"];
			} else {
				desStr = result["descWx"];
			}
			if (desStr) {
				var desArr = desStr.split(",");
				var desId = desArr[0];
				shareData["desc"] = TranslateFunc.instance.getTranslate(desId, "TranslateShare");
				shareData["imgUrl"] = desArr[1];
				if (id == "1" || id == "2") {
					shareData["desc"] = shareData["desc"].replace("#v1#", UserModel.instance.getUserName());
				}
			}
		}
		return shareData;
	}

	/**是否优先使用本地分享路径 */
	isUseLocalShareImg() {
		var isOpen = GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHARE_LOCAL);
		var isLoad = SubPackageManager.getLoadStatus(SubPackageConst.packName_share);
		return isOpen && isLoad;
	}

	/**分享，根据权重获取数据 */
	getShareByWeight(datas: any[]) {
		var weightSum = 0;
		for (var i = 0; i < datas.length; i++) {
			weightSum += Number(datas[i]["weight"]);
		}
		var randomNum = GameUtils.getRandomInt(0, weightSum - 1);
		var curWeight: number = 0;
		for (var i = 0; i < datas.length; i++) {
			curWeight += Number(datas[i]["weight"]);
			if (randomNum < curWeight) {
				return datas[i];
			}
		}

	}

}