import GameTools from "../../utils/GameTools";
import SceneReference from "../consts/SceneReference";
import GameSwitch from "../common/GameSwitch";
import {BannerComp} from "../platform/comp/BannerComp";
import {RecommendationBannerComp} from "../platform/comp/RecommendationBannerComp";
import UserInfo from "../common/UserInfo";
import {TopViewAutoComp} from "../platform/comp/TopViewAutoComp";
import CommonEvent from "../event/CommonEvent";
import Message from "../common/Message";
import KariqiShareManager from "./KariqiShareManager";
import BannerStyleJumpComp from "../platform/comp/BannerStyleJumpComp";
import BaseViewExpand from "../components/BaseViewExpand";


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
			GameTools.canGift = false;
			GameTools.canLeadBanner = false;
		}
	}

	/**设置开关值 */
	static setBannerSwitch() {
		if (UserInfo.isWX()) {
			Message.instance.add(CommonEvent.WHITE_LIST_CHANGE, BannerAdManager.instance);
		}
		GameTools.canQuickBanner = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_QUICKBANNER);
		if (!SceneReference.isInBannerScene()) {
			GameTools.canGift = false;
			GameTools.canLeadBanner = false;
			LogsManager.echo(" GameTools.banner false");
			return;
		} else {
			GameTools.canLeadBanner = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_LEADBANNER);
			GameTools.canGift = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_MYSTERIOUSGIFT);
		}

		if (!BannerAdManager.isPlatformSupport()) {
			LogsManager.echo("平台不支持banner banner开关关闭");
			GameTools.canQuickBanner = false;
			GameTools.canGift = false;
			GameTools.canLeadBanner = false;
		}

		LogsManager.echo(" GameTools.canQuickBanner:", GameTools.canQuickBanner);
		LogsManager.echo(" GameTools.canLeadBanner:", GameTools.canLeadBanner);
		LogsManager.echo(" GameTools.canGift:", GameTools.canGift);
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
		if (GameTools.canQuickBanner) {
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

	static turnToShowUIJump(parent: BaseViewExpand) {

	}

	/**隐藏直接添加的banner */
	static hideQuickBanner() {
		if (GameTools.canQuickBanner) {
			// AdVideoManager.instance.hideBanner();
		}
	}

	/**添加诱导性banner */
	static addLeadBanner(obj, pos1, pos2) {
	}

	/**隐藏诱导性banner */
	static hideLeadBanner() {
	}

	/**
	 * 神秘礼包banner
	 */
	static addGiftBanner(parent, onErrorCallback = null, callbackObj = null, hideType = TopViewAutoComp.HIDE_TYPE_DESTROY, orderType = null, style = null) {

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
		if (GameTools.canGift) {
			// AdVideoManager.instance.hideBanner();
		}
	}
}
