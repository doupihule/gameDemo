import LogsManager from "../../manager/LogsManager";
import {TopViewAutoComp} from "./TopViewAutoComp";
import ChannelConst from "../../../game/sys/consts/ChannelConst";
import UserInfo from "../../common/UserInfo";
import GameSwitch from "../../common/GameSwitch";
import Message from "../../common/Message";
import WindowEvent from "../../event/WindowEvent";
import GameUtils from "../../../utils/GameUtils";

export class RecommendationInterstitialComp extends TopViewAutoComp {
	/** 广告Id */
	static _interstitialId;

	/** 广告实例 */
	private _interstitialAd;

	/** 加载是否成功 */
	protected _loadSuccess = false;

	protected _onErrorCallback;
	protected _onCloseCallback;

	/** 是否显示过 */
	protected _hasShow: boolean;

	private static _instance: RecommendationInterstitialComp;

	protected _callbackObj;

	protected _hasError: boolean = false;

	/** 最后展示InterstitialAd的页面 */
	protected _lastParentName;

	/**
	 * interstitialId getter方法
	 */
	public static get interstitialId(): string {
		// 初始化广告参数
		if (!this._interstitialId) {
			if (ChannelConst.getChannelConst(UserInfo.platformId).recommendPortalId) {
				this._interstitialId = ChannelConst.getChannelConst(UserInfo.platformId).recommendPortalId;
			}
			if (GameSwitch.getSwitchState(GameSwitch.RECOMMEN_PORTAL_ID)) {
				this._interstitialId = GameSwitch.getSwitchState(GameSwitch.RECOMMEN_PORTAL_ID);
			}
		}
		return this._interstitialId;
	}

	/**
	 * InterstitialAd预加载
	 */
	static register() {
		LogsManager.echo("hlx 推荐插屏 InterstitialAd 预加载")
		// 不支持的组件直接返回
		if (!RecommendationInterstitialComp.canUse()) {
			return;
		}

		if (!this._instance) {
			this._instance = new RecommendationInterstitialComp(null);
		}

		if (!this._instance._interstitialAd) {
			this._instance.registerInterstitialAd();
		}
	}

	/**
	 * 创建Banner推广组件：微信
	 */
	static create(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
		LogsManager.echo("hlx 推荐插屏 RecommendationInterstitialComp create start:", (parent && parent.windowName) ? GameUtils.decryptStr(parent.windowName) : null);
		// 不支持的组件直接返回
		if (!RecommendationInterstitialComp.canUse()) {
			onErrorCallback && onErrorCallback.call(this);
			return;
		}

		if (!this._instance) {
			this._instance = new RecommendationInterstitialComp(parent, onErrorCallback, onCloseCallback, callbackObj);
		} else {
			this._instance.updateInfo(parent, onErrorCallback, onCloseCallback, callbackObj);
			// InterstitialAd _hideType 为 隐藏销毁类型。每次重新创建需要重新添加事件
			Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this._instance);
		}
	}

	/**
	 * 初始化组件
	 */
	constructor(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
		super();
		this.updateInfo(parent, onErrorCallback, onCloseCallback, callbackObj);
		// this.registerBanner();
	}

	/**
	 * 更新组件信息
	 */
	updateInfo(parent, onErrorCallback = null, onCloseCallback = null, callbackObj = null) {
		// 初始化推荐参数
		this._onErrorCallback = onErrorCallback;
		this._onCloseCallback = onCloseCallback;

		this._parentName = (parent && parent.windowName) ? parent.windowName : null;
		this._callbackObj = callbackObj;
		// Banner组件隐藏式
		this._hideType = TopViewAutoComp.HIDE_TYPE_DESTROY;
		this._checkUIState(true);
	}

	/**注册InterstitialAd */
	registerInterstitialAd() {
		LogsManager.echo('hlx 推荐插屏 InterstitialAd registerInterstitialAd')
		this._loadSuccess = false;
		if (!RecommendationInterstitialComp.canUse()) return;

		//判断是否有插屏广告,如果没有插屏广告
		var wx = UserInfo.platform.getWX();
		var thisObj = this;
		this._interstitialAd = wx.createGamePortal({
			adUnitId: RecommendationInterstitialComp.interstitialId
		})

		if (this._interstitialAd) {
			var interstitialAd = this._interstitialAd;
			this._hasShow = false;
			interstitialAd.onError(err => {
				LogsManager.echo('hlx 推荐插屏 InterstitialAd: onError', JSON.stringify(err))
				thisObj._loadSuccess = false;
				thisObj._hasError = true;
				thisObj._checkUIState(true);
			})
			interstitialAd.onLoad(() => {
				LogsManager.echo('hlx 推荐插屏 InterstitialAd: onLoad success')
				thisObj._loadSuccess = true;
				thisObj._hasError = false;
				thisObj._checkUIState(true);
			})
			interstitialAd.onClose(() => {
				LogsManager.echo("hlx InterstitialAd 插屏广告 onClose");
				// 关闭插屏广告后自动destroy
				thisObj._onCloseCallback && thisObj._onCloseCallback.call(thisObj._callbackObj);
				thisObj.destroy();
			})
		} else {
			this._hasError = true;
		}
	}

	private _doCallBack() {
		LogsManager.echo('hlx 推荐插屏 InterstitialAd: _doErrorCallBack');
		var tempFunc = this._onErrorCallback;
		var tempObj = this._callbackObj;

		this._onErrorCallback = null;
		this._onCloseCallback = null;
		this._callbackObj = null;

		this._hasShow = true;

		tempFunc && tempFunc.call(tempObj);
	}

	/**
	 * InterstitialAd是否可用
	 */
	public static canUse() {
		if (UserInfo.isWX()) {
			if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_INTERSTITIALAD)) {
				LogsManager.warn("hlx 推荐插屏 InterstitialAd canNotUse:开关关闭 SWITCH_DISABLE_INTERSTITIALAD");
				return false;
			}

			if (!RecommendationInterstitialComp.interstitialId) {
				LogsManager.echo("hlx 推荐插屏 InterstitialAd bannerId 未配置，不初始化banner");
				return false;
			}

			if (!UserInfo.platform.getSystemInfo().SDKVersion) {
				LogsManager.echo('hlx 推荐插屏 InterstitialAd not support：取不到SDKVersion');
				return false;
			}

			if (!UserInfo.platform.getWX().createGamePortal) {
				LogsManager.echo('hlx 推荐插屏 InterstitialAd createGamePortal 方法不存在：不初始化banner');
				return false;
			}

			var currentVersion = UserInfo.platform.getSystemInfo().SDKVersion;
			if (UserInfo.platform.compareVersion(currentVersion, '2.7.5') >= 0) {
				return true;
			}
		}
		LogsManager.echo('hlx recommend not support');
		return false
	}

	/**
	 * 组件销毁
	 */
	public destroy() {
		LogsManager.echo("hlx 推荐插屏 InterstitialAd destroy:", GameUtils.decryptStr(this._parentName));
		super.destroy();
		this._onErrorCallback = null;
		this._onCloseCallback = null;
		this._callbackObj = null;
		if (this._interstitialAd) {
			this.reloadInter();
		}
	}

	/**
	 * 重新拉取新的广告
	 */
	protected reloadInter() {
		// 重新拉取实例条件
		// 1.有报错 2.OPPO平台显示过广告后
		if (this._hasError) {
			if (typeof this._interstitialAd.destroy == "function") {
				this._interstitialAd.destroy();
			}
			this._interstitialAd = null;
			this.registerInterstitialAd();
		}
	}

	/**
	 * 子类重写show方法。不管force都继续changeStatus
	 */
	public show(force = false) {
		if (this._lastParentName != this._parentName) {
			// 页面不同：并且之前已经是show状态【相邻的InterstitialAd界面】。需要重新加载新的InterstitialAd
			if (this._status == TopViewAutoComp.STATUS_SHOW) {
				this.reloadInter();
			}
		} else {
			// 页面相同：重复是显示状态的。无需额外处理
			if (!force && this._status == TopViewAutoComp.STATUS_SHOW) {
				return;
			}
		}
		this._status = TopViewAutoComp.STATUS_SHOW;
		// 赋值最后展示的页面
		this._lastParentName = this._parentName;
		this._changeStatus();
	}

	/** 子类重写组件显示方法 */
	protected _compShow() {
		LogsManager.echo("hlx 推荐插屏 InterstitialAd _compShow", Laya.timer.currTimer);
		if (!this._interstitialAd) {
			// 如果不存在实例或者已经展示过一次
			// 重新加载新的InterstitialAd
			this.registerInterstitialAd();
		}

		if (this._hasError) {
			LogsManager.echo("hlx 推荐插屏 InterstitialAd _compShow：InterstitialAd加载存在error直接执行失败回调");
			this._doCallBack();
			return;
		}

		if (this._interstitialAd && this._loadSuccess) {
			this._hasShow = true;
			LogsManager.echo("hlx 推荐插屏 InterstitialAd show", Laya.timer.currTimer);
			this._interstitialAd.show()
				.then(() => {
					LogsManager.echo("hlx 推荐插屏 InterstitialAd广告组件show success", Laya.timer.currTimer);
				})
				.catch(err => {
					LogsManager.echo("hlx 推荐插屏 InterstitialAd广告组件show error", err);
					this._doCallBack();
				});

		}
	}
}