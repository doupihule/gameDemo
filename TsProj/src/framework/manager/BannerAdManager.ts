import GameUtils from "../../utils/GameUtils";
import LogsManager from "./LogsManager";
import GlobalParamsFunc from "../../game/sys/func/GlobalParamsFunc";
import SceneReference from "../consts/SceneReference";
import GameSwitch from "../common/GameSwitch";
import {BannerComp} from "../platform/comp/BannerComp";
import {RecommendationBannerComp} from "../platform/comp/RecommendationBannerComp";
import UserInfo from "../common/UserInfo";
import {BannerOrRecommendServer} from "../server/BannerOrRecommendServer";
import UserModel from "../../game/sys/model/UserModel";
import {TopViewAutoComp} from "../platform/comp/TopViewAutoComp";
import CommonEvent from "../event/CommonEvent";
import Message from "../common/Message";
import KariqiShareManager from "./KariqiShareManager";
import BannerStyleJumpComp from "../platform/comp/BannerStyleJumpComp";


/**banner */
export default class BannerAdManager {
	/** banner类型：广告banner */
	static BANNER_TYPE_AD = 1;
	/** banner类型：推荐banner */
	static BANNER_TYPE_RECOMMEND = 2;

	/***************** BANNER类型*******************/
	/** BANNER类型：banner>推荐 */
	static QUICK_BANNER_TYPE_AD = 1;
	/** BANNER类型：banner>推荐 */
	static QUICK_BANNER_TYPE_AD_COMMEND = 2;
	/** BANNER类型：推荐 */
	static QUICK_BANNER_TYPE_COMMEND = 3;
	/** BANNER类型：推荐>banner */
	static QUICK_BANNER_TYPE_COMMEND_AD = 4;


	/***************** BANNER序列类型*******************/
	/** BANNER序列类型：banner>推荐 */
	static BANNER_ORDER_TYPE_AD = 1;
	/** BANNER序列类型：推荐>banner */
	static BANNER_ORDER_TYPE_RECOMMEND = 2;
	/** BANNER序列类型：按照序列 */
	static BANNER_ORDER_TYPE_ORDER = 3;
	/** BANNER序列类型：只有Banner */
	static BANNER_ORDER_TYPE_JUST_BANNER = 4;
	private static _instance: BannerAdManager;

	static get instance(): BannerAdManager {
		if (!this._instance) {
			this._instance = new BannerAdManager();
		}
		return this._instance;
	}

	recvMsg(cmd: string, data: any): void {
		if (cmd == CommonEvent.WHITE_LIST_CHANGE) {
			// 原来不是黑名单，返回收到IP在黑名单之内。设置黑名单字段。并通知黑名单更新
			GameUtils.canGift = false;
			GameUtils.canLeadBanner = false;
		}
	}

	/**设置开关值 */
	static setBannerSwitch() {
		if (UserInfo.isWX()) {
			Message.instance.add(CommonEvent.WHITE_LIST_CHANGE, BannerAdManager.instance);
		}
		GameUtils.canQuickBanner = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_QUICKBANNER);
		if (!SceneReference.isInBannerScene()) {
			GameUtils.canGift = false;
			GameUtils.canLeadBanner = false;
			LogsManager.echo(" GameUtils.banner false");
			return;
		} else {
			GameUtils.canLeadBanner = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_LEADBANNER);
			GameUtils.canGift = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_MYSTERIOUSGIFT);
		}

		if (!BannerAdManager.isPlatformSupport()) {
			LogsManager.echo("平台不支持banner banner开关关闭");
			GameUtils.canQuickBanner = false;
			GameUtils.canGift = false;
			GameUtils.canLeadBanner = false;
		}

		LogsManager.echo(" GameUtils.canQuickBanner:", GameUtils.canQuickBanner);
		LogsManager.echo(" GameUtils.canLeadBanner:", GameUtils.canLeadBanner);
		LogsManager.echo(" GameUtils.canGift:", GameUtils.canGift);
	}

	static isPlatformSupport() {
		if (UserInfo.isTT()) {
			LogsManager.echo("krma. UserInfo.platform.getSystemInfo().appName " + UserInfo.platform.getSystemInfo().appName)
			if (UserInfo.platform.getSystemInfo().appName == "Douyin" || UserInfo.platform.getSystemInfo().appName == "PPX") {
				LogsManager.echo("krma. 该渠道不支持banner", UserInfo.platform.getSystemInfo().appName)
				return false;
			}
		}
		return true;
	}

	/**
	 * 预加载 banner
	 */
	static registerBanner() {
		// 广告banner预加载
		BannerComp.register();
		// 推荐banner预加载
		RecommendationBannerComp.register();
	}

	/**
	 * 添加普通banner
	 * style:width 定宽 retio定比例
	 */
	static addBannerQuick(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp.HIDE_TYPE_DESTROY, quickBannerType = null, style = null) {
		if (!parent.windowName) {
			LogsManager.errorTag("bannerParamsError", "传入的对象没有windowName");
			return;
		}

		var jumpBannerState = KariqiShareManager.getOneUIBannerJumpState(parent.windowName);
		//如果状态是1 表示优先显示单列互推
		if (jumpBannerState == 1) {
			BannerStyleJumpComp.instance.showJump(parent, onErrorCallback, callbackObj);
			return;
		}
		LogsManager.echo("zm.addBannerParent-----------", parent.windowName)
		if (GameUtils.canQuickBanner) {
			// 没有传失败回调，默认banner失败加载推荐组件
			if (UserInfo.isWX()) {
				var thisObj = this;
				if (!quickBannerType) {
					quickBannerType = Number(GameSwitch.getSwitchState(GameSwitch.SWITCH_QUICKBANNER_TYPE));
				}

				//banner加载失败回调
				var bannerErrorBack = function () {
					BannerComp.cancleOneView(parent.windowName);
					//如果banner加载失败  那么
					if (jumpBannerState == 0) {
						BannerStyleJumpComp.instance.showJump(parent, onErrorCallback, callbackObj);
						return;
					}
					//如果是banner>推荐
					if (quickBannerType == BannerAdManager.QUICK_BANNER_TYPE_AD_COMMEND) {
						RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
						return;
					}
					//直接做错误回调
					if (onErrorCallback) {
						onErrorCallback.call(callbackObj);
					}
				}
				switch (quickBannerType) {
					case BannerAdManager.QUICK_BANNER_TYPE_AD:
						// banner
						BannerComp.create(parent, bannerErrorBack, this, hideType, style);
						break;
					case BannerAdManager.QUICK_BANNER_TYPE_AD_COMMEND:
						// banner>推荐
						BannerComp.create(parent, bannerErrorBack, this, hideType, style);
						break;
					case BannerAdManager.QUICK_BANNER_TYPE_COMMEND:
						// 推荐
						RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
						break;
					case BannerAdManager.QUICK_BANNER_TYPE_COMMEND_AD:
						BannerComp.cancleOneView(parent.windowName);
						// 推荐>banner
						RecommendationBannerComp.create(parent, () => {
							BannerComp.create(parent, bannerErrorBack, this, hideType, style);
						}, thisObj, hideType);
						break;
				}
			} else {
				BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
			}
		}
		return null;
	}

	static turnToShowUIJump(parent: Laya.View) {

	}

	/**隐藏直接添加的banner */
	static hideQuickBanner() {
		if (GameUtils.canQuickBanner) {
			// AdVideoManager.instance.hideBanner();
		}
	}

	/**添加诱导性banner */
	static addLeadBanner(obj, pos1, pos2) {
		// var times = FuncGlobalParams.getInstance().getDataByTwoId("bannerPopupTimeDelay", "num");
		// obj.bottom = 62;
		// if (GameUtils.canLeadBanner) {
		//     Laya.timer.once(times, this, () => {
		//         AdVideoManager.instance.showBanner();
		//         obj.bottom = pos2;
		//         LogsManager.echo("openBanner----------")
		//     });
		// }
	}

	/**隐藏诱导性banner */
	static hideLeadBanner() {
		// if (GameUtils.canLeadBanner) {
		//     AdVideoManager.instance.hideBanner();
		//     Laya.timer.clearAll(this);
		//     LogsManager.echo("closeBanner----------")
		// }
	}

	/**
	 * 神秘礼包banner
	 */
	static addGiftBanner(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp.HIDE_TYPE_DESTROY, orderType = null, style = null) {
		if (GameUtils.canGift) {
			if (UserInfo.isWX()) {
				var thisObj = this;
				if (orderType == null) {
					orderType = Number(GameSwitch.getSwitchState(GameSwitch.SWITCH_MYSTERIOUSGIFT_TYPE));
				}
				switch (orderType) {
					case BannerAdManager.BANNER_ORDER_TYPE_AD:
						// banner>推荐
						BannerComp.create(parent, () => {
							RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
						}, thisObj, hideType, style);
						break;
					case BannerAdManager.BANNER_ORDER_TYPE_RECOMMEND:
						// 推荐>banner
						RecommendationBannerComp.create(parent, () => {
							BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
						}, thisObj, hideType);
						break;
					case BannerAdManager.BANNER_ORDER_TYPE_ORDER:
						// 按序列显示
						var type = BannerAdManager.BANNER_TYPE_AD;
						var orderCfg = GlobalParamsFunc.instance.getDataArray("selectBannerList");
						var bannerOrder = UserModel.instance.getBannerOrder();

						if (orderCfg) {
							bannerOrder = bannerOrder % (orderCfg.length)
							type = Number(orderCfg[bannerOrder]);
						}
						if (type == BannerAdManager.BANNER_TYPE_AD) {
							// banner>推荐
							LogsManager.echo('banner order type: banner>推荐', type);
							BannerComp.create(parent, () => {
								RecommendationBannerComp.create(parent, onErrorCallback, callbackObj, hideType);
							}, thisObj, hideType, style);
						} else if (type == BannerAdManager.BANNER_TYPE_RECOMMEND) {
							// 推荐>banner
							LogsManager.echo('banner order type: 推荐>banner', type);
							RecommendationBannerComp.create(parent, () => {
								BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
							}, thisObj, hideType);
						} else {
							LogsManager.errorTag('banner_type_error', 'banner_type_error:' + type);
						}
						// 更新序列
						BannerOrRecommendServer.BannerOrRecommendSend();
						break;
					case BannerAdManager.BANNER_ORDER_TYPE_JUST_BANNER:
						// banner
						BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
						break;
				}
			} else {
				BannerComp.create(parent, onErrorCallback, callbackObj, hideType, style);
			}
		}
		return null;
	}

	/**
	 * 隐藏某个页面的banner
	 */
	static hideBanner(windowName) {
		BannerComp.cancleOneView(windowName);
	}


	//给某个界面添加顶部互推
	static addTopBannerStyleJump(parent) {
		//如果没有显示顶部导量条  return
		if (!KariqiShareManager.checkIsShowTopJump()) {
			return;
		}
		BannerStyleJumpComp.instance.showShowTopJump(parent);
	}


	/**隐藏神秘礼包banner */
	static hideGiftBanner() {
		if (GameUtils.canGift) {
			// AdVideoManager.instance.hideBanner();
		}
	}
}
