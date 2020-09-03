import OriginalAdBaseComp from "./OriginalAdBaseComp";
import ChannelConst from "../../../game/sys/consts/ChannelConst";
import UserInfo from "../../common/UserInfo";
import GameSwitch from "../../common/GameSwitch";

import WindowCommonCfgs from "../../consts/WindowCommonCfgs";
import WindowManager from "../../manager/WindowManager";
import AdVideoManager from "../AdVideoManager";

export class OriginalInterstitialAdComp extends OriginalAdBaseComp {
	protected logName = 'original_interstitial';

	protected static _instance: OriginalInterstitialAdComp;

	static get instance(): OriginalInterstitialAdComp {
		if (!this._instance) {
			this._instance = new OriginalInterstitialAdComp();
		}
		return this._instance;
	}

	public get adOriginalIds(): string {
		if (!this._adOriginalIds) {
			if (ChannelConst.getChannelConst(UserInfo.platformId).adOriginalInterstitialIds) {
				this._adOriginalIds = (String(ChannelConst.getChannelConst(UserInfo.platformId).adOriginalInterstitialIds)).split("|");
			}

			if (GameSwitch.getSwitchState(GameSwitch.ORIGIN_ID)) {
				this._adOriginalIds = (String(GameSwitch.getSwitchState(GameSwitch.ORIGIN_ID))).split("|");
				;
			}
		}
		return this._adOriginalIds;
	}

	/**
	 * 打开原生广告弹窗
	 */
	private openOriginalView(params, adList) {
		if (adList) {
			LogsManager.echo("hlx 显示原生广告插屏广告1-----------", adList.adId)

			// 汇报点击
			this.reportShowOriginal(adList.adId);
			WindowManager.OpenUI(WindowCommonCfgs.ORIGINALVIEW, {info: adList, pos: params.pos});
			// Message.instance.send(MsgCMD.MODULE_SHOW, param);
			// 更新插屏数据
			AdVideoManager.instance.updateInterstitialLimit();
		} else {
			LogsManager.echo('hlx 原生广告插屏未加载到数据，不显示');
		}
	}

	/**
	 * 显示原生广告：插屏
	 */
	public showOriginalAdView(onErrorCallback, callbackObj, params = {pos: -79}) {
		this.registerOrigionAdv((result, params, adList) => {
			if (result && adList) {
				this.openOriginalView(params, adList);
			} else {
				// 失败走回调
				LogsManager.echo('hlx 原生广告插屏未加载到数据，不显示, 执行失败回调');
				onErrorCallback && onErrorCallback.call(callbackObj)
			}
		}, this, params);
	}
}
