import GameSwitch from "../common/GameSwitch";
import LogsManager from "./LogsManager";
import TimerManager from "./TimerManager";
import AdVideoManager from "../platform/AdVideoManager";

export default class OppoAdvManager {
	private static _instance: OppoAdvManager;
	static fastReceive = 1; //立即领取
	static origionAdv = 2; //原生广告
	static intervalAdv = 3; //插屏广告
	static rewardAdv = 4; //激励广告
	static origionAndReward = 5; //先原生后激励
	static intervalAndReward = 6; //先插屏后激励
	static get instance(): OppoAdvManager {
		if (!this._instance) {
			this._instance = new OppoAdvManager();
		}
		return this._instance;
	}

	/**提示道具领取 */
	static tipItemType(parent, receiveType = null, successCall = null, thisObj = null, extraType = 0) {
		var type = null;
		var insertDelay = Number(GameSwitch.getSwitchState(GameSwitch.SCREEN_AD_DELAY)) * 1000;
		var originalDelay = Number(GameSwitch.getSwitchState(GameSwitch.ORIGIN_AD_DELAY)) * 1000;

		var tipType;
		tipType = Number(GameSwitch.getSwitchState(receiveType));
		LogsManager.echo("tipType------------------", tipType)
		if (tipType == 4) {
			type = this.rewardAdv;
		}
		if (tipType == 2 || tipType == 5) {
			if (tipType == 5) {
				type = this.rewardAdv;
			}
			//插屏>原生>直接
			TimerManager.instance.setTimeout(() => {
				AdVideoManager.instance.showInterstitialAd(parent, () => {
					TimerManager.instance.setTimeout(() => {
						AdVideoManager.instance.showOriginalAdView();
					}, this, originalDelay)
				});
			}, this, insertDelay)
		} else if (tipType == 3 || tipType == 6) {
			//原生》直接
			if (tipType == 6) {
				type = this.rewardAdv;
			}
			TimerManager.instance.setTimeout(() => {
				AdVideoManager.instance.showOriginalAdView();
			}, this, originalDelay)
		}
		return type;
	}
}
