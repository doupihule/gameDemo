import UserInfo from "../common/UserInfo";
import UserGlobalModel from "../model/UserGlobalModel";
import WindowManager from "./WindowManager";
import ShareTvOrderFunc from "../../game/sys/func/ShareTvOrderFunc";
import ShareOrTvServer from "../server/ShareOrTvServer";
import TranslateFunc from "../func/TranslateFunc";
import KariqiShareManager from "./KariqiShareManager";
import KariquShareConst from "../consts/KariquShareConst";
import JumpManager from "./JumpManager";
import JumpConst from "../../game/sys/consts/JumpConst";
import GameSwitch from "../common/GameSwitch";
import Message from "../common/Message";
import VideoAdvEvent from "../event/VideoAdvEvent";
import {BannerComp} from "../platform/comp/BannerComp";
import TableUtils from "../utils/TableUtils";
import CountsCommonModel from "../model/CountsCommonModel";
import ResourceConst from "../../game/sys/consts/ResourceConst";
import ResourceCommonConst from "../consts/ResourceCommonConst";

/**
 * 分享或视频广告序列管理类
 */
export default class ShareOrTvManager {

	private static _instance: ShareOrTvManager;

	public constructor() {
	}

	static TYPE_SHARE = 1;
	static TYPE_ADV = 2;
	static TYPE_QUICKRECEIVE = 3;//视屏和分享都不行
	static TYPE_SHAREVIDEO = 4; //分享视频


	static curOrderName; //当前序列名

	/** 配表序列意义：视频 */
	static ORDER_ID_VIDEO = 0;
	/** 配表序列意义：分享 */
	static ORDER_ID_SHARE = 1;
	/** 配表序列意义：分享录屏 */
	static ORDER_ID_SHAREVIDEO = 2;


	static leadTypeId = null; //当前诱导分享的序列id
	static get instance(): ShareOrTvManager {
		if (!this._instance) {
			this._instance = new ShareOrTvManager();
		}
		return this._instance;
	}

	/**
	 * 获取本次应该是视频还是分享
	 * @param id
	 * @param failIsShare 视频拉取失败是否转分享
	 */
	getShareOrTvType(id = null, failType: number = ShareOrTvManager.TYPE_SHARE, firstType: number = ShareOrTvManager.TYPE_ADV) {
		if (UserInfo.isWeb()) {
			UserInfo.platform.loadAdvFailed = false;
		}

		var successType = ShareOrTvManager.TYPE_QUICKRECEIVE
		var index = 0;
		if (id) {
			var orderCfg = ShareTvOrderFunc.instance.getOrder(id);
			index = CountsCommonModel.instance.getShareTvCountById(id);
			var info = KariqiShareManager.getShareOrTvType(id, index);
			//如果是走卡日曲的
			if (info) {
				LogsManager.echo("kariqu shareTvinfo", TableUtils.safelyJsonStringfy(info));
				successType = info.type;
			} else {

				var order

				// 默认视频
				var types;
				var orderType = 0;
				if (orderCfg) {
					if (orderCfg.manOrder) {
						//判断是否男性授权用户
						if (UserInfo.userSex == 1) {
							order = orderCfg.manOrder;
							// LogsManager.echo("sanmen        走了manOrder序列");
						} else {
							order = orderCfg.order;
							// LogsManager.echo("sanmen        走了order序列");
						}
					} else {
						order = orderCfg.order;
					}
					if (order && order.length) {
						if (index >= order.length) {
							index = index % order.length;
						}
						orderType = Number(order[index]);
					}

					switch (orderType) {
						case ShareOrTvManager.ORDER_ID_SHARE:
							successType = ShareOrTvManager.TYPE_SHARE
							break;
						case ShareOrTvManager.ORDER_ID_VIDEO:
							successType = ShareOrTvManager.TYPE_ADV
							break;
						case ShareOrTvManager.ORDER_ID_SHAREVIDEO:
							successType = ShareOrTvManager.TYPE_SHAREVIDEO
							break;
					}
				}
			}


		} else {
			successType = firstType;
		}
		var isFail = false;
		switch (successType) {
			case ShareOrTvManager.TYPE_SHARE:
				if (this.canShare()) {
					types = ShareOrTvManager.TYPE_SHARE;
				} else {
					isFail = true;
				}
				break;
			case ShareOrTvManager.TYPE_ADV:
				// 视频
				if (this.canAdv()) {
					types = ShareOrTvManager.TYPE_ADV;
				} else {
					// 手动加载视频
					UserInfo.platform.loadVideoAd();
					isFail = true;
				}
				break;
			case ShareOrTvManager.TYPE_SHAREVIDEO:
				// 分享录屏
				if (this.canShareVideo()) {
					types = ShareOrTvManager.TYPE_SHAREVIDEO;
				} else {
					isFail = true;
				}
				break;
		}

		if (isFail) {
			// LogsManager.echo("shareOrder fail :", failType)
			// 失败后使用哪种类型
			switch (failType) {
				case ShareOrTvManager.TYPE_SHARE:
					if (this.canShare()) {
						types = ShareOrTvManager.TYPE_SHARE;
					} else if (this.canAdv()) {
						types = ShareOrTvManager.TYPE_ADV;
					} else {
						types = ShareOrTvManager.TYPE_QUICKRECEIVE;
					}
					break;
				case ShareOrTvManager.TYPE_ADV:
					types = this.canAdv() ? ShareOrTvManager.TYPE_ADV : ShareOrTvManager.TYPE_QUICKRECEIVE;
					break;
				case ShareOrTvManager.TYPE_SHAREVIDEO:
					if (this.canShareVideo()) {
						types = ShareOrTvManager.TYPE_SHAREVIDEO;
					} else if (this.canAdv()) {
						types = ShareOrTvManager.TYPE_ADV;
					} else {
						types = ShareOrTvManager.TYPE_QUICKRECEIVE;
					}
					break;
				case ShareOrTvManager.TYPE_QUICKRECEIVE:
					types = ShareOrTvManager.TYPE_QUICKRECEIVE;
					break;
			}
		}
		return types;
	}

	/**
	 * 判断是否可以分享
	 */
	private canShare() {
		if (!UserInfo.platform.canShare()) {
			return false;
		}
		// 分享开关开启
		// 分享次数够
		var times = Number(UserGlobalModel.instance.getShareNum());
		if (times <= 0) {

			return false;
		}
		LogsManager.echo("shareOrTv 还有分享次数，走了分享");
		return true;
	}

	/**
	 * 判断是否可以显示视频
	 */
	public canAdv() {
		// 开关开启 且 拉取成功
		if (!UserInfo.platform.canAdv()) {
			return false;
		}
		//如果拉取失败了,卡日曲埋点
		if (UserInfo.platform.loadAdvFailed) {
			// KariqiShareManager.addAdvPoint({ eventId: KariquShareConst.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager.curOrderName }, true)
			return false;
		}
		return true;

	}

	/**
	 * 判断是否可以分享录屏
	 */
	public canShareVideo() {
		return UserInfo.platform.canShareVideo();
	}

	/**设置分享或视频图标 */
	setShareOrTvImg(id, type) {
		if (id) {
			type = this.getShareOrTvType(id);
		}
		if (type == ShareOrTvManager.TYPE_SHARE || type == ShareOrTvManager.TYPE_SHAREVIDEO) {
			return ResourceCommonConst.SHARE_IMG;
		} else {
			return ResourceCommonConst.VIDEO_IMG;
		}
	}

	/**发送看视频或分享请求
	 * id:是否是需要走序列的模块，id在GlobalFUnc中配置好了，shareLine_xxx
	 * types：默认类型，为了让没有id的模块根据传入的类型决定本次是视频还是分享  ShareOrTvManager.TYPE_SHARE/adv
	 * shareData:分享内容
	 * successCall:成功回调
	 * closeCall:失败或关闭回调
	 * thisObj：谁监听的
	 * failType: 看视频失败以后是否转分享 1 转分享 2 转录屏
	 */
	shareOrTv(id, firstType, shareData, successCall, closeCall, thisObj, failType: number = ShareOrTvManager.TYPE_SHARE) {
		if (id) {
			ShareOrTvManager.leadTypeId = id;
		}
		var type = this.getShareOrTvType(id, failType, firstType);

		LogsManager.echo("krma. shareOrTv type " + type);
		shareData = shareData || {};

		var doFaillVedioCall = () => {
			closeCall && closeCall.call(thisObj, type);
			ShareOrTvManager.leadTypeId = null;
			//看视频失败
			// KariqiShareManager.addAdvPoint({ eventId: KariquShareConst.KARIQU_SHOWADV_FAIL, name: ShareOrTvManager.curOrderName }, true)
		}
		if (id) {
			var orderCfg = ShareTvOrderFunc.instance.getOrder(id);
			if (orderCfg.desc) {
				ShareOrTvManager.curOrderName = TranslateFunc.instance.getTranslate(orderCfg.desc);
			}
		}


		switch (type) {
			case ShareOrTvManager.TYPE_ADV:
				//尝试看视频
				KariqiShareManager.addAdvPoint({
					eventId: KariquShareConst.KARIQU_TRYADV,
					name: ShareOrTvManager.curOrderName
				}, true)
				if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ADV)) {//看视频
					closeCall && closeCall.call(thisObj, type);
					return;
				}
				//额外数据
				var extraData = {
					callback: this.setVideoExtraCall,
					thisObj: this
				}
				if (BannerComp.instance) {
					BannerComp.instance.destroy(true)
				}
				;
				UserInfo.platform.showVideoAd((res) => {
					ShareOrTvServer.shareOrTvSend({type: ShareOrTvManager.TYPE_ADV}, () => {
						successCall && successCall.call(thisObj, type);
						ShareOrTvManager.leadTypeId = null;
						//看视频成功
						Message.instance.send(VideoAdvEvent.VIDEOADV_EVENT_ADV_SUCCESS);
						KariqiShareManager.addAdvPoint({
							eventId: KariquShareConst.KARIQU_SHOWADV_SUCC,
							name: ShareOrTvManager.curOrderName
						}, true)
					}, this);

				}, (res) => {
					//卡日曲取消视频失败不走次数
					if (KariqiShareManager.checkIsKariquChannel()) {
						doFaillVedioCall();
						return;
					}

					ShareOrTvServer.shareOrTvSend({type: ShareOrTvManager.TYPE_ADV}, () => {
						doFaillVedioCall()
					}, this);

				}, this, extraData);
				break;
			case ShareOrTvManager.TYPE_SHARE:
				if (!this.canShare()) {//分享
					closeCall && closeCall.call(thisObj, type);
					return;
				}
				UserInfo.platform.share(shareData.id, shareData.extraData, (res) => {
					var callback = null;
					if (res) {
						callback = successCall;
					} else {
						callback = closeCall;
					}
					//如果是卡日曲渠道的
					if (KariqiShareManager.checkIsKariquChannel()) {
						//卡日曲分享失败不扣次数
						if (!res) {
							ShareOrTvManager.leadTypeId = null;
							callback && callback.call(thisObj, type);
							return;
						}
					}

					ShareOrTvServer.shareOrTvSend({type: ShareOrTvManager.TYPE_SHARE}, () => {
						ShareOrTvManager.leadTypeId = null;
						callback && callback.call(thisObj, type);
					}, this);

				}, this);
				break;
			case ShareOrTvManager.TYPE_SHAREVIDEO:
				UserInfo.platform.shareVideo((res) => {
					var callback = null;
					if (res) {
						callback = successCall;
					} else {
						callback = closeCall;
					}
					if (!res) {
						ShareOrTvManager.leadTypeId = null;
						callback && callback.call(thisObj, type);
						return;
					}
					ShareOrTvServer.shareOrTvSend({type: ShareOrTvManager.TYPE_SHAREVIDEO}, () => {
						ShareOrTvManager.leadTypeId = null;
						callback && callback.call(thisObj, type);
					}, this);
				}, this);
				break;
			case ShareOrTvManager.TYPE_QUICKRECEIVE:
				if (UserInfo.isWX() || UserInfo.isQQGame() || UserInfo.isTT()) {
					UserInfo.platform.showPopTip(TranslateFunc.instance.getTranslate("#tid_share_or_tv_tishi", "localTranslateCommon"), TranslateFunc.instance.getTranslate("#tid_share_or_tv_error", "localTranslateCommon"), {
						showCancel: false,
						success(res) {
							closeCall && closeCall.call(thisObj, type);
						}
					});
				} else {
					// OPPO不支持模态弹窗
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_share_or_tv_error", "localTranslateCommon"));
					closeCall && closeCall.call(thisObj, type);
				}
		}
		return type;
	}

	//看视频额外参数中的回调操作
	setVideoExtraCall(result) {
		if (KariqiShareManager.checkIsKariquChannel()) {
			if (result) {
				//看完退出
				KariqiShareManager.addAdvPoint({
					eventId: KariquShareConst.KARIQU_END,
					name: ShareOrTvManager.curOrderName
				}, true)
			} else {
				//中途退出
				KariqiShareManager.addAdvPoint({
					eventId: KariquShareConst.KARIQU_CENTER_EXIT,
					name: ShareOrTvManager.curOrderName
				}, true)
			}
		}

	}

	//根据视频分享类型获取imageskin
	getFreeImgSkin(freeType) {
		var skin = "";
		if (freeType == ShareOrTvManager.TYPE_SHARE) {
			if (UserInfo.isWX()) {
				if (JumpManager.jumpChannel == JumpConst.JUMP_CHANNEL_KARIQU) {
					skin = ResourceConst.SHARE_PNG;
				} else {
					skin = ResourceConst.ADV_PNG;
				}

			} else {
				skin = ResourceConst.SHARE_PNG;
			}
		} else if (freeType == ShareOrTvManager.TYPE_ADV) {
			skin = ResourceConst.ADV_PNG;
		} else if (freeType == ShareOrTvManager.TYPE_SHAREVIDEO) {
			skin = ResourceConst.ADV_PNG;
		}

		return skin;
	}

}
