import Global from "../../utils/Global";
import Method from "../../game/sys/common/kakura/Method";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import GamePlatform from "./GamePlatform";
import Message from "../common/Message";
import LogsManager from "../manager/LogsManager";
import ShareFunc from "../../game/sys/func/ShareFunc";
import TranslateFunc from "../func/TranslateFunc";
import WindowManager from "../manager/WindowManager";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import MainModule from "../manager/MainModule";
import TimerManager from "../manager/TimerManager";
import BaseFunc from "../func/BaseFunc";
import CacheManager from "../manager/CacheManager";
import DeviceTools from "../utils/DeviceTools";
import StorageCode from "../../game/sys/consts/StorageCode";
import GameConsts from "../../game/sys/consts/GameConsts";
import VersionManager from "../manager/VersionManager";
import PackConfigManager from "../manager/PackConfigManager";
import MsgCMD from "../../game/sys/common/MsgCMD";
import GlobalParamsFunc from "../../game/sys/func/GlobalParamsFunc";
import JumpManager from "../manager/JumpManager";
import SubPackageManager from "../manager/SubPackageManager";
import LogsErrorCode from "../consts/LogsErrorCode";
import AdVideoManager from "./AdVideoManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import GameSwitch from "../common/GameSwitch";
import TableUtils from "../utils/TableUtils";
import JumpConst from "../../game/sys/consts/JumpConst";
import {AdResponse} from "./AdResponse";
import UserModel from "../../game/sys/model/UserModel";
import FrameWorkHandle from "../../game/sys/manager/FrameWorkHandle";
import KariquShareConst from "../consts/KariquShareConst";
import KariqiShareManager from "../manager/KariqiShareManager";
import UserInfo from "../common/UserInfo";
import MethodCommon from "../common/kakura/MethodCommon";
import Client from "../common/kakura/Client";
import FullJumpFunc from "../func/FullJumpFunc";
import ShareOrTvManager from "../manager/ShareOrTvManager";
import StatisticsExtendManager from "../manager/StatisticsExtendManager";
import JSToNativeEvent from "../event/JSToNativeEvent";


export default class WXGamePlatform extends GamePlatform {

	public static instance: WXGamePlatform;

	public constructor() {
		super();
		WXGamePlatform.instance = this;
		//定义微信平台为分包模式
		this._isSubPackage = true;

		this.listenTime = Laya.Browser.now();
		LogsManager.echo('构造platform');

	}

	private loginBtn;
	protected _lastShareImg;

	/**
	 * 初始化平台信息
	 */
	initPlatform() {
		// 初始化通用事件
		this.addListener();
		// 设置版本检查
		this.setVersionCheckResult(0);
		// 设置用户来源
		this.setUserComeFrom();
		// 获取系统信息
		this.setSystemInfo();
		// 初始化录屏组件
		this.registerRecord();
		// 设置屏幕常亮
		this.setKeeyScreenOn();
		// 初始化用户Ip信息
		this.initCityName();
	}

	/**
	 * 设置屏幕常亮
	 */
	protected setKeeyScreenOn() {
		if ('function' == typeof this.getWX().setKeepScreenOn) {
			this.getWX().setKeepScreenOn({keepScreenOn: true})
		}
	}


	//设置获取系统信息
	setSystemInfo() {
		var myThis = this;
		if ("function" === typeof this.getWX().getSystemInfo) {
			this.getWX().getSystemInfo({
				success(systemInfo) {
					LogsManager.echo('>>getSystemInfo成功回调', JSON.stringify(systemInfo));
					myThis.initSystemInfoData(systemInfo);

				}, fail(err) {
					LogsManager.echo('>>getSystemInfo失败回调', JSON.stringify(err));
					var data = myThis.getWX().getSystemInfoSync()
					LogsManager.echo('>>getSystemInfo失败回调 重新同步拉取', JSON.stringify(data));
					if (data) {
						myThis.initSystemInfoData(data);
					}
				}
			});
		}
	}

	/**
	 * 初始化系统数据
	 */
	protected initSystemInfoData(systemInfo, isDelay: boolean = false) {
		if (systemInfo != undefined) {
			if (!systemInfo.windowWidth) {
				// Vivo平台无windowWidth字段
				systemInfo.windowWidth = systemInfo.screenWidth
			}
			if (!systemInfo.windowHeight) {
				// Vivo平台无windowWidth字段
				systemInfo.windowHeight = systemInfo.screenHeight
			}
			this.systemInfo = systemInfo;
			ScreenAdapterTools.setPhoneSys(systemInfo);
			//执行3次获取系统信息
			if (!isDelay) {
				TimerManager.instance.add(this._delayCheckSystemInfo, this, 3000, 3);
				TimerManager.instance.add(this._delayCheckSystemInfo, this, 1000, 1);
			}

		}
	}

	//延迟检测system 获取最新的宽高. 防止因为宽高异常 导致获取到的banner位置有问题
	private _delayCheckSystemInfo() {
		var systemInfo = this.getWX().getSystemInfoSync();
		LogsManager.echo("xd _delayCheckSystemInfo:", this.systemInfo.windowHeight, systemInfo.windowHeight);
		if (systemInfo.windowHeight && systemInfo.windowHeight > this.systemInfo.windowHeight) {
			this.initSystemInfoData(systemInfo, true);
		}

	}


	/**
	 * 获取系统信息
	 */
	getSystemInfo() {
		if (!this.systemInfo && "function" === typeof this.getWX().getSystemInfoSync) {
			var systemInfo = this.getWX().getSystemInfoSync();
			this.initSystemInfoData(systemInfo);
		}
		return this.systemInfo;
	}


	/**wx登陆，获取登陆参数。请求global */
	getWxInfo() {
		var myThis = this;
		// 重新计算刘海屏
		this.reCheckBar();
		var data: any = {
			success: (res) => {
				LogsManager.echo('>>login成功回调>>', res);
				myThis.setLaunchOptions();
				if (res != undefined) {
					var gParams = {};
					var noCode: boolean = false;
					if (UserInfo.isWX() || UserInfo.isQQGame()) {
						if (!res.code) {
							noCode = true;
						}
					} else if (UserInfo.isTT()) {
						if (!res.anonymousCode && !res.code) {
							noCode = true;
						}
					}
					if (noCode) {
						myThis.retryGetWxInfo();
						return;
					}

					if (UserInfo.isWX()) {
						gParams = {
							"method": MethodCommon.global_Account_loginWx,
							"params": {
								"js_code": res.code,
								"device": Global.deviceModel,
								"comeFrom": UserInfo.LoginSceneInfo,
								"sceneId": String(Global.sceneId)
							}
						};
					} else if (UserInfo.isQQGame()) {
						gParams = {
							"method": MethodCommon.global_Account_loginQQ,
							"params": {
								"js_code": res.code,
								"device": Global.deviceModel,
								"comeFrom": UserInfo.LoginSceneInfo
							}
						};
					} else if (UserInfo.isTT()) {
						gParams = {
							"method": Method.global_Account_loginTT,
							"params": {
								"code": res.code,
								"anonymous_code": res.anonymousCode,
								"device": Global.deviceModel,
								"comeFrom": UserInfo.LoginSceneInfo
							}
						};
					} else if (UserInfo.isOppo()) {
						gParams = {
							"method": MethodCommon.global_Account_loginOppo,
							"params": {
								"token": res.data.token,
								"device": Global.deviceModel,
								"comeFrom": UserInfo.LoginSceneInfo
							}
						};
					} else if (UserInfo.isVivo()) {
						gParams = {
							"method": MethodCommon.global_Account_loginVivo,
							"params": {
								"token": res.token,
								"device": Global.deviceModel,
								"comeFrom": UserInfo.LoginSceneInfo
							}
						};
					} else if (UserInfo.isUC()) {
						gParams = {
							"method": MethodCommon.global_Account_loginUC,
							"params": {
								"code": res.code,
								"device": Global.deviceModel,
								"comeFrom": UserInfo.LoginSceneInfo
							}
						};
					}
					myThis.reqGlobal(gParams);
				}
			}, fail(err) {
				LogsManager.echo('>>login失败回调>>', JSON.stringify(err));
				myThis.retryGetWxInfo();
			}, complete() {

			}
		}
		if (UserInfo.isTT()) {
			data["force"] = false;
		}

		this.getWX().login(data);
	}

	retryGetWxInfo() {
		this.curReqGlobalCount++;
		if (this.curReqGlobalCount >= this.maxReqGlobalCount) {
			LogsManager.warn(".login未获取到code超过五次", LogsManager.errorTag_gameError);
			WindowManager.setPopupTip(1, "登陆失败，请重试！", () => {
				this.getWxInfo();
			}, this);
		} else {
			this.getWxInfo();
		}
		return;
	}

	/**做一些微信的初始化及获取参数 */
	protected setLaunchOptions() {
		if (this.isDoWxThings) return;
		if (UserInfo.isOppo() || UserInfo.isVivo() || UserInfo.isUC()) {
			LogsManager.echo('Oppo Vivo 无 getLaunchOptions接口');
			return;
		}
		this.isDoWxThings = true;
		var myThis = this;
		var launchRes = this.getLaunchOptions();
		if (!launchRes) {
			return;
		}
		LogsManager.echo("yrc getLaunchOptions", JSON.stringify(launchRes));
		if (!Global.sceneId) Global.sceneId = launchRes.scene;
		Global.currentSceneId = launchRes.scene;
		var queryData = launchRes.query;

		if (queryData) {
			myThis.inviteBy = queryData.inviterRid;
			myThis.shareInfo = queryData.shareInfo;
			//分享图id打点
			if (queryData.imgId) {
				StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_ENTER_GAME, {
					imgId: queryData.imgId,
					inviteBy: queryData.inviterRid
				});
			}
			myThis.shareLinkParams = queryData
		}
	}

	/**
	 * 计算刘海屏高度
	 */
	protected reCheckBar() {
		if (typeof this.getWX().getMenuButtonBoundingClientRect == 'function') {
			try {
				var menuInfo = this.getWX().getMenuButtonBoundingClientRect();
				LogsManager.echo('hlx menuInfo:', JSON.stringify(menuInfo));
				ScreenAdapterTools.reCheckBar(menuInfo);
			} catch (e) {
				LogsManager.echo('getMenuButtonBoundingClientRect 方法报错:', JSON.stringify(e));
			}
		} else {
			LogsManager.echo('无 getMenuButtonBoundingClientRect 方法');
		}
	}


	//添加监听事件
	protected addListener() {
		var thisObj = this;
		if (UserInfo.isUC()) {
			LogsManager.echo("UC平台无全局事件注册");
			return;
		}
		//获取报错信息
		if (this.getWX().onError) {
			this.getWX().onError((res) => {
				LogsManager.systemError("onError!!!!!!!!!!!!", JSON.stringify(res));
			})
		}
		if (this.getWX().onMemoryWarning) {
			//监听内存不足告警事件
			this.getWX().onMemoryWarning((res) => {
				var errContent = "内存警告";
				if (res) {
					errContent += JSON.stringify(res);
				}
				// LogsManager.sendErrorToPlatform(errContent, LogsManager.errorTage_memoryWarning, 80, LogsErrorCode.MEMORY_WARN);
			})
		} else {
			LogsManager.warn("没有找到onMemoryWarning这个接口");
		}
		// 添加onshow回调移动到构造函数保证最开始运行
		this.addOnShowListener();
	}


	public getLoginResult() {
		//完成一个任务
		this.changeLeftTask(-1, "getLoginResult");
	}

	//获取用户信息. 关于授权的
	getUserInfoAndReq() {
		var myThis = this;
		myThis.platformUserInfo = {};
		this.getWX().getSetting({
			success: (res) => {
				LogsManager.echo("yrc wx getSetting success", JSON.stringify(res));
				if (res.authSetting['scope.userInfo']) {
					LogsManager.echo("yrc wx start getUserInfo")
					myThis.getWX().getUserInfo({
						withCredentials: true,
						lang: "",
						success(res) {
							LogsManager.echo("yrc wx getUserInfo success", JSON.stringify(res))
							if (UserInfo.isBaidu()) {
								LogsManager.echo("xd 百度不处理授权数据")
								return;
							}
							myThis.userInfoData = res;
							var userInfo: any = res.userInfo;
							myThis.turnChannelUserInfo(userInfo);
							if (UserInfo.isQQGame()) {
								//QQ没有complete回调，特殊处理
								myThis.sendKakuraInit();
							}
						}, fail(err) {
							LogsManager.echo("yrc getUserInfo fail", JSON.stringify(err))
						}, complete(res) {
							LogsManager.echo("yrc getUserInfo complete", JSON.stringify(res))
							if (!UserInfo.isQQGame()) {
								myThis.sendKakuraInit();
							}
						}
					})
				} else {
					myThis.sendKakuraInit();
				}
			},
			fail: () => {
				LogsManager.echo("yrc getSetting ==fail===");
				myThis.sendKakuraInit();
			},
			complete: () => {
				LogsManager.echo("yrc getSetting ==complete===");
			}
		});
	}


	/**创建中心处授权按钮，用作登陆时强制授权，暂时不用 */
	public createLoginButton(callBack: Function, thisObject: any) {
		var designWidth = 640;
		var designHeight = 1136;
		var button = this.getWX().createUserInfoButton({
			type: 'image',
			text: '   点击获取微信授权    ',
			image: 'common/loading_bt_jinruyouxi.png',
			style: {
				left: ((designWidth - 233) * 0.5) / designWidth * UserInfo.platform.getSystemInfo().windowWidth,
				top: 3 * 0.25 * UserInfo.platform.getSystemInfo().windowHeight,
				width: 233 / designWidth * UserInfo.platform.getSystemInfo().windowWidth,
				height: 70 / designHeight * UserInfo.platform.getSystemInfo().windowHeight,
				backgroundColor: '#00000033',
				color: '#ff0000',
				textAlign: 'center',
			}
		})

		button.onTap((res) => {
			if (res.errMsg == "getUserInfo:ok") {
				LogsManager.echo('>>createLoginButton成功回调>>', JSON.stringify(res));
				LogsManager.echo("yrc wx authorize success", JSON.stringify(res));
				callBack && callBack.call(thisObject)
				button.hide();
				button.destroy();
			} else {
				LogsManager.echo("拒绝授权 wx GetUserInfo 数据：" + JSON.stringify(res))
				button.hide();
				button.destroy();
				callBack && callBack.call(thisObject)
			}
		});
	}

	/**创建特殊的透明登陆授权按钮 */
	createSpeLoginBtn(posX: number, posY: number, btnW: number, btnH: number, callBack: Function, thisObject: any) {
		var left = posX / ScreenAdapterTools.width * ScreenAdapterTools.windowWidth;
		var top = posY / ScreenAdapterTools.height * ScreenAdapterTools.windowHeight;
		var width = btnW / ScreenAdapterTools.width * ScreenAdapterTools.windowWidth;
		var height = btnH / ScreenAdapterTools.height * ScreenAdapterTools.windowHeight;

		this.removeLoginBtn();
		var button = this.getWX().createUserInfoButton({
			type: 'image',
			image: 'open/res/openImg.png',
			withCredentials: false,
			style: {
				left: left,
				top: top,
				width: width,
				height: height,
			}
		});

		button.onTap((res) => {
			LogsManager.echo(">>>>>>onTap>>>>>>>>", res.errMsg == "getUserInfo:ok", res);
			if (res.errMsg == "getUserInfo:ok") {
				LogsManager.echo('>>loginbutton onTap 成功回调>>', JSON.stringify(res));
				callBack && callBack.call(thisObject, res)
			} else {
				LogsManager.echo("拒绝授权 wx GetUserInfo 数据：" + JSON.stringify(res))
				callBack && callBack.call(thisObject, -1);
			}
		});
		this.loginBtn = button;
	}

	/**移除微信登陆授权按钮 */
	removeLoginBtn() {
		if (this.loginBtn) {
			this.loginBtn.hide();
			this.loginBtn.destroy();
		}
	}


	/**分享
	 *
	 *  extraData: {}表格式 .
	 *
	 */
	share(id: any, extraData: any, callback: Function, thisObj: any) {
		LogsManager.echo("yrc wx share", id, extraData)
		if (this._isShare) return;
		StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_SHARE);
		this._isShare = true;
		TimerManager.instance.setTimeout(() => {
			this._isShare = false;
		}, this, 1300);
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHARE_NEW)) {
			LogsManager.echo("yrc share 开关关了")
			callback && callback.call(thisObj, true);
			return;
		}
		var shareQuery = "";

		this._shareId = id;
		this._shareExtraData = {};
		TableUtils.deepCopy(extraData, this._shareExtraData);
		this._shareCallback = callback;
		this._shareThisObj = thisObj;
		if (extraData && extraData.noWait) {
			this._shareNoWait = true;
		} else {
			this._shareNoWait = false;
		}
		this._shareTime = Client.instance.miniserverTime;
		var rid: string = UserModel.instance.getUserRid();
		var sinfo: string = "";
		var shareData: any = {};


		if (extraData) {
			shareData.des = extraData.des || "";
			shareData.imgUrl = extraData.imgUrl || "";

			if (extraData.shareInfo) {
				sinfo = "&shareInfo=" + extraData.shareInfo;
			}
		}
		//判断是否是接入卡日曲的
		var tempShareData = KariqiShareManager.getOneRandomShareInfo();
		if (tempShareData) {
			shareData = tempShareData;
		} else {
			if (id) {
				shareData = ShareFunc.instance.getShareData(id, "wxgame");
			}
		}


		if (!shareData) {
			callback && callback.call(thisObj, false);
			return;
		}
		var shareContentId
		if (shareData.extraData && shareData.extraData.contentId) {
			shareContentId = shareData.extraData.contentId;
			StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_TOTAL_CLICK, {contentId: shareContentId});
		} else {
			shareContentId = null;
			StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_TOTAL_CLICK);
		}

		//如果有手动传递的扩展参数
		if (extraData) {
			shareQuery = this.turnDataToShareQuery(extraData)
		}

		//根据各自项目自行扩展
		if (shareData.extraData) {
			if (!shareQuery) {
				shareQuery = this.turnDataToShareQuery(shareData.extraData);
			} else {
				shareQuery += "&" + this.turnDataToShareQuery(shareData.extraData);
			}
		}

		//判断是否包含inviterRid字段
		if (shareQuery && shareQuery.indexOf("inviterRid=") == -1) {
			if (shareQuery != "") {
				shareQuery += "&inviterRid=" + rid;
			} else {
				shareQuery = "inviterRid=" + rid;
			}
		}

		var data: any = {
			title: shareData["desc"],
			imageUrl: shareData["imgUrl"],
			imgUrl: shareData["imgUrl"],
			query: shareQuery || "inviterRid=" + rid,
		};

		if (UserInfo.isUC()) {
			var data: any = {
				title: shareData["desc"],
				imageUrl: shareData["imgUrl"],
				query: shareQuery || "inviterRid=" + rid,
				target: "wechat",
				success: res => {
					LogsManager.echo("hlx 分享成功回调", JSON.stringify(res));
					callback && callback.call(thisObj, true);
				},
				fail: err => {
					LogsManager.echo("hlx 分享失败回调", JSON.stringify(err));
					callback && callback.call(thisObj, false);
				}
			};
		} else {
			var data: any = {
				title: shareData["desc"],
				imageUrl: shareData["imgUrl"],
				imgUrl: shareData["imgUrl"],
				query: shareQuery || "inviterRid=" + rid,
			};
		}


		this._lastShareImg = shareData.imgId;
		LogsManager.echo("yrc wxshare", data)

		var shareCallBack = (res) => {
			LogsManager.echo('分享成功回调', res);
			if (res != null) {
				this._doShareCallBack(res == 1);
				return;
			} else {
				LogsManager.warn('分享失败回调');
			}
		}

		if (id == "2" && extraData.shareInfo) {
			var arr = extraData.shareInfo.split(".");
			if (arr.length == 3 && arr[2].length > 0) {
				this.shareDynamicAppMessage(data, shareCallBack, arr[2]);
			} else {
				this.shareNormalAppMessage(data, shareCallBack);
			}
		} else {
			this.shareNormalAppMessage(data, shareCallBack);
		}

	}

	//分享非动态消息
	shareNormalAppMessage(data, shareCallBack) {
		LogsManager.echo("yrc shareNormalAppMessage");
		if (this.getWX().updateShareMenu) {
			// 百度无updateShareMenu接口
			this.getWX().updateShareMenu({
				withShareTicket: true,
				isUpdatableMessage: false,
			} as any)
		}
		this.shareAldAppMsg(data, shareCallBack);
	}

	//分享动态消息
	shareDynamicAppMessage(data, shareCallBack, activityId) {
		LogsManager.echo("yrc shareDynamicAppMessage");
		if (this.getWX().updateShareMenu) {
			// 百度无updateShareMenu接口
			this.getWX().updateShareMenu({
				withShareTicket: true,
				isUpdatableMessage: true,
				activityId: activityId, // 活动 ID
				templateInfo: {
					parameterList: [{
						name: 'member_count',
						value: '1'
					}, {
						name: 'room_limit',
						value: '4'
					}]
				}
			} as any)
		}
		this.shareAldAppMsg(data, shareCallBack);
	}

	shareAldAppMsg(data, shareCallBack) {
		//阿拉丁分享统计
		this.getWX().shareAppMessage({
			title: data.title,
			imageUrl: data.imgUrl,
			query: data.query,
			success(res) {
				console.log(">>>>>>>>share succ1>>>>>>>", res);
				shareCallBack(1)
			},
			fail(res) {
				console.log(">>>>>>>>share fail1>>>>>>>", res);
				shareCallBack(0)
			}
		});

		console.log(">>>>>>>>shareAppMessage>>>>>>>", data);
	}

	/**判断是否分享超过3秒 */
	checkShareSucc() {

		var newTime: number = Client.instance.miniserverTime;
		LogsManager.echo("yrc checkShareSucc newTime", newTime);


		if (this._shareTime && this._shareTime > 0) {
			var distime = newTime - this._shareTime;
			this._shareTime = 0;

			var kariquRt = KariqiShareManager.checkShareResult(distime);
			LogsManager.echo("kariquRt", kariquRt);
			if (kariquRt == -1) {
				FrameWorkHandle.instance.onCheckShareSucess(distime, this._shareExtraData);
			} else {
				//如果成功
				if (kariquRt == 1) {
					this.onShareComplete(true);
				} else {
					//失败 走项目自己的失败逻辑 传入时间为0. 分系统判断失败 执行对应的失败逻辑
					FrameWorkHandle.instance.onCheckShareSucess(0, this._shareExtraData);
				}
			}
		}
	}

	//分享完成后回调
	onShareComplete(shareResult) {
		//如果是分享成功 卡日曲上报分享成功
		if (shareResult == true) {
			KariqiShareManager.saveShareRecord();
		}
		TimerManager.instance.setTimeout(() => {
			this._doShareCallBack(shareResult);
		}, this, 500);
	}

	// test
	sharePage() {
		LogsManager.echo("hlx 初始默认分享配置")
		if (UserInfo.isUC()) {
			LogsManager.echo("hlx UC平台无三个点分享配置")
			return;
		}
		this.getWX().showShareMenu({
			withShareTicket: true
		});
		var myThis = this;
		var callback = function () {
			var query = "";
			var imgUrl;
			var title;
			if (BaseFunc.globalCfgsHasLoad) {
				var tempShareData = KariqiShareManager.getOneRandomShareInfo();
				var shareData;
				if (tempShareData) {
					shareData = tempShareData
				} else {
					shareData = ShareFunc.instance.getShareData("1");
				}
				if (shareData.extraData) {
					query += myThis.turnDataToShareQuery(shareData.extraData);
				}
				imgUrl = shareData.imgUrl;
				title = shareData.desc;
			}
			if (UserModel.instance.getUserRid()) {
				if (!query) {
					query = "inviterRid=" + UserModel.instance.getUserRid();
				} else {
					query += "&inviterRid=" + UserModel.instance.getUserRid();
				}

			}
			LogsManager.echo("wx share:", query, imgUrl)
			myThis._lastShareImg = shareData.imgId;
			return {
				imageUrl: imgUrl,
				title: title,
				query: query,
			}
		}
		this.myOnShare(callback);
	}


	/**右上角三点分享监听函数 */
	myOnShare(callback: Function) {
		this.getWX().onShareAppMessage(callback);
	}

	//初始化平台数据
	initPlatformData() {
		// 初始化分享
		this.sharePage();
		this.registerAd();
		// 初始化平台参数
		AdVideoManager.instance._isInitAdv = true;
		// 为了开启速度，不再预加载banner 插屏
		// // 初始化插屏广告
		// AdVideoManager.instance.registerInterstitialAd();
		// // 初始化banner广告
		//BannerAdManager.registerBanner();
		// 初始化视频广告

	}

	loadVideoAd() {
		LogsManager.echo('hlx reload VideoAd');
		var thisObj = this;
		if (!this._videoAd) {
			this.registerAd();
		} else {
			var promise = this._videoAd.load()
			if (typeof promise === 'object' && promise.then) {
				promise
					.then(() => {
						LogsManager.echo('videoAd 注册广告加载成功');
						thisObj.loadAdvFailed = false;
						thisObj.advHasShow = false;
					})
					.catch(err => {
						thisObj.loadAdvFailed = true;
						LogsManager.echo('videoAd 广告手动加载失败', err);
						KariqiShareManager.addAdvPoint({
							eventId: KariquShareConst.KARIQU_SHOWADV_FAIL,
							name: ShareOrTvManager.curOrderName
						}, true)
					});
			}
		}
	}

	canAdv() {
		if (!super.canAdv()) {
			return false;
		}

		if (UserInfo.isUC() && "function" != typeof this.getWX().createRewardVideoAd) {
			LogsManager.warn("hlx adv 这个设备没有视频广告组件")
			return false;
		} else if ("function" != typeof this.getWX().createRewardedVideoAd) {
			LogsManager.warn("hlx adv这个设备没有视频广告组件")
			return false;
		}

		return true;
	}

	/**注册广告事件 */
	registerAd() {
		this.loadAdvFailed = false;
		LogsManager.echo("yrc registerAd", this._videoId)
		if (this._videoAd) return;
		if (!this.canAdv()) {
			this.loadAdvFailed = true;
			KariqiShareManager.addAdvPoint({
				eventId: KariquShareConst.KARIQU_SHOWADV_FAIL,
				name: ShareOrTvManager.curOrderName
			}, true)

			return;
		}

		var thisObj = this;
		//判断是否有广告,如果没有广告
		if (UserInfo.isUC()) {
			this._videoAd = this.getWX().createRewardVideoAd();
		} else {
			var obj;
			if (UserInfo.isBaidu()) {
				obj = {
					adUnitId: this._videoId,
					appSid: this._appSid
				}
			} else if (UserInfo.isVivo()) {
				obj = {
					posId: this._videoId,
				}
			} else {
				obj = {adUnitId: this._videoId}
			}
			this._videoAd = this.getWX().createRewardedVideoAd(obj);
		}

		LogsManager.echo("yrc registerAd this._videoAd", typeof this._videoAd);
		if (this._videoAd) {
			var videoAd = this._videoAd;
			videoAd.onError((err) => {
				thisObj.loadAdvFailed = true;
				KariqiShareManager.addAdvPoint({
					eventId: KariquShareConst.KARIQU_SHOWADV_FAIL,
					name: ShareOrTvManager.curOrderName
				}, true)

				WindowManager.SwitchMaskUI(false, 0.5);
				LogsManager.echo("videoAd.onError:", JSON.stringify(err));
				thisObj.videoState = 0;
				if (thisObj._videoLoaded) {
					WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_ad_error"));
					StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD_FAIL);
					thisObj._doVedioCallBack(false);
				}
			})
			videoAd.onLoad(() => {
				LogsManager.echo("videoAd.onLoad:");
				thisObj.loadAdvFailed = false;
				// 加载成功新广告，advHasShow = false
				thisObj.advHasShow = false;
				// 加载完成回调。用于vivo显示广告
				thisObj.afterVideoLoadCallBack();
			})
			videoAd.onClose(res => {
				Message.instance.send(MsgCMD.VIDEO_PLAY, res && res.isEnded);
				this.isPlayVideo = false;
				WindowManager.SwitchMaskUI(false, 0.5);
				if (res && res.isEnded) {
					// 给予奖励
					StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_SUCCESS);
					LogsManager.echo("yrc show WX video suc")
					thisObj._extraData && thisObj._extraData.callback && thisObj._extraData.callback.call(thisObj._extraData.thisObj, true)
					thisObj.onVideoComplete(true);
				} else {
					thisObj.onTurnOffAdsEarly();
					thisObj._extraData && thisObj._extraData.callback && thisObj._extraData.callback.call(thisObj._extraData.thisObj, false)
				}
			});
		} else {
			this.loadAdvFailed = true;
			KariqiShareManager.addAdvPoint({
				eventId: KariquShareConst.KARIQU_SHOWADV_FAIL,
				name: ShareOrTvManager.curOrderName
			}, true)

		}
	}

	onVideoComplete(videoResult) {

		LogsManager.echo("onVideoComplete time:", Client.instance.miniserverTime)
		// 由于回调有延迟。为防止拉取下一条视频后OnError回调。提前置空回调
		// 定时器到了再回调
		this.videoState = 0;
		this._videoLoaded = false;

		var tempFunc = videoResult ? this._videoSucCallback : this._videoFailCallback;
		var tempObj = this._videoThisObj

		this._videoFailCallback = null;
		this._videoSucCallback = null;
		this._videoThisObj = null;
		this._extraData = null;
		// 视频回调后将videoLoaded 重置避免手动加载广告失败
		this._videoLoaded = false;

		TimerManager.instance.setTimeout(() => {
			TimerManager.instance.setTimeout(() => {
				tempFunc && tempFunc.call(tempObj, videoResult);
			}, this, 50)
		}, this, 50)
	}

	//提前关闭视频广告      (在这里实现不同游戏需求  例如弹窗点确定后继续拉取广告等)
	onTurnOffAdsEarly() {
		var thisObj = this;
		var failHandleType = GlobalParamsFunc.instance.videoHandleType;
		if (failHandleType == 1) {
			LogsManager.echo("看视频中途退出");
			thisObj.onVideoComplete(false);
		} else if (failHandleType == 2) {
			thisObj.videoState = 1;
			this.showPopTip("提示", TranslateFunc.videoTranslateArr[Math.floor(Math.random() * TranslateFunc.videoTranslateArr.length)], {
				confirmText: TranslateFunc.videoLabTranslate,
				success: (res) => {
					if (res.confirm) {
						LogsManager.echo('用户点击确定,再次拉起视频');
						//再次拉起视频
						thisObj.showVideoAd(thisObj._videoSucCallback, thisObj._videoFailCallback, thisObj._videoThisObj, thisObj._extraData);
					} else if (res.cancel) {
						LogsManager.echo("用户取消了再次看视频");
						thisObj.onVideoComplete(false);
					}
				}
			});
		}
	}

	/**播放激励视频 */
	showVideoAd(successCallBack: any = null, closeCallBack: any = null, thisObj: any = null, extraData = {}) {
		// 点击观看视频打点
		StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD);
		this.isPlayVideo = false;
		this._videoSucCallback = successCallBack;
		this._videoFailCallback = closeCallBack;
		this._extraData = extraData;
		this._videoLoaded = true;
		this._videoThisObj = thisObj;
		WindowManager.SwitchMaskUI(true, 0.5);
		if (!this._videoAd) {
			this.registerAd();
		}
		if (!this._videoAd) {
			WindowManager.SwitchMaskUI(false, 0.5);
			LogsManager.echo("yrc 没有广告实例，直接执行失败回调")
			this._doVedioCallBack(false);
			return;
		}
		var videoAd = this._videoAd;
		var myThis = this;
		//设置videoState 状态
		this.videoState = 1;
		WindowManager.ShowTip("视频加载中");
		videoAd.show()
			.then(() => {
				LogsManager.echo('广告显示成功');
				myThis.isPlayVideo = true;
				Message.instance.send(MsgCMD.VIDEO_STOP);
			})
			.catch(err => {
				LogsManager.echo('广告组件出现问题', err);
				// 可以手动加载一次
				videoAd.load()
					.then(() => {
						LogsManager.echo('手动加载成功');
						//如果当前不是广告播放状态 没必要在显示了
						if (myThis.videoState == 0) {
							LogsManager.echo("当前没有播放广告的回调.可能是在注册的时候初始化失败了-已经做了失败回调了")
							return
						}
						//如果没有回调要执行的回调 就不show了
						videoAd.show()
							.then(() => {
								LogsManager.echo('广告显示成功');
								myThis.isPlayVideo = true;
								Message.instance.send(MsgCMD.VIDEO_STOP);
							})
							.catch(err => {
								LogsManager.echo('hlx video.广告组件第二次show失败，执行失败回调', err);
								myThis.loadAdvFailed = true;
								KariqiShareManager.addAdvPoint({
									eventId: KariquShareConst.KARIQU_SHOWADV_FAIL,
									name: ShareOrTvManager.curOrderName
								}, true)

								myThis.videoState = 0;
								myThis._doVedioCallBack(false);
							})
					})
					.catch(err => {
						LogsManager.echo('广告手动加载失败', err);
						myThis.loadAdvFailed = true;
						KariqiShareManager.addAdvPoint({
							eventId: KariquShareConst.KARIQU_SHOWADV_FAIL,
							name: ShareOrTvManager.curOrderName
						}, true)

						myThis.videoState = 0;
						myThis._doVedioCallBack(false);
					});
			});
	}

	/**
	 * 视频回调
	 */
	public _doVedioCallBack(result) {
		LogsManager.echo("_doVedioCallBack and 重置视频参数 _videoCallback _videoThisObj");
		this.videoState = 0;
		var tempFunc = result ? this._videoSucCallback : this._videoFailCallback;
		var tempObj = this._videoThisObj

		this._videoFailCallback = null;
		this._videoSucCallback = null;
		this._videoThisObj = null;
		this._extraData = null;
		// 视频回调后将videoLoaded 重置避免手动加载广告失败
		this._videoLoaded = false;

		tempFunc && tempFunc.call(tempObj, result);
	}

	/**
	 * 分享回调
	 */
	protected _doShareCallBack(result: boolean) {
		LogsManager.echo("_doShareCallBack and 重置分享参数 _shareCallback _shareThisObj _shareId _shareExtra");
		var tempFunc = this._shareCallback;
		var tempObj = this._shareThisObj

		this._shareCallback = null;
		this._shareThisObj = null;
		this._shareId = null;
		this._shareExtraData = null;
		this._shareNoWait = null;

		tempFunc && tempFunc.call(tempObj, result);
	}


	//重写登出函数
	loginOut() {
		// this.getWX().getUpdateManager().applyUpdate();
		var obj: any = {
			success: () => {
				console.log("_loginOut success__")
			},
			fail: () => {
				console.log("_loginOut fail__")
			},
			complete: () => {
				console.log("_loginOut complete__")
			}
		}
		if (this.getWX().exitMiniProgram) {
			this.getWX().exitMiniProgram(obj);
		}
	}

	vibrate(isLong: boolean = false, callBack: Function = null, thisObject: any = null) {
		if (isLong) {
			if ("function" === typeof this.getWX().vibrateLong) {
				this.getWX().vibrateLong({
					success: (res) => {
						// LogsManager.echo("yrc wx vibrateLong suc", res);
						//震动成功
						callBack && callBack.call(thisObject, true);
					},
					fail: (err) => {
						// LogsManager.echo("yrc wx vibrateLong fail", err);
						//震动失败
						callBack && callBack.call(thisObject, false);
					}
				})
			}
		} else {
			if ("function" === typeof this.getWX().vibrateShort) {
				this.getWX().vibrateShort({
					success: (res) => {
						// LogsManager.echo("yrc wx vibrateShort suc", res);
						callBack && callBack.call(thisObject, true);
					},
					fail: (err) => {
						// LogsManager.echo("yrc wx vibrateShort fail", err);
						callBack && callBack.call(thisObject, false);
					}
				})
			}
		}
	}


	private _hasCheckUpdateListener: boolean = false;

	//添加版本更新监听
	addUpdateListener() {

		this.getNetwork();
		var thisObj = this;
		//判断如果超时则判定为无新版本，走下一步
		var timeCode = TimerManager.instance.setTimeout(() => {
			thisObj.isOutTime = true;
			if (thisObj._hasCheckUpdateListener) {
				LogsManager.echo("wxgme xd 已经处理过更新检查了--000000000")
				return;
			}
			thisObj._hasCheckUpdateListener = true;
			MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "updateListerner timeover");
		}, this, 1000);
		this.changeLeftTask(-1, "addUpdateListener");
		//开始加载分包资源
		this.startDownloadSubPackage();
		super.addUpdateListener();

		if (typeof this.getWX().getUpdateManager === 'function') { // 请在使用前先判断是否支持
			const updateManager = this.getWX().getUpdateManager();
			if (!VersionManager.checkIsForceUpdate()) {
				LogsManager.echo("krma. no ForceUpdate")
				timeCode && TimerManager.instance.remove(timeCode);
				if (thisObj._hasCheckUpdateListener) {
					LogsManager.echo("wxgme xd 已经处理过更新检查了--000000000")
					return;
				}
				thisObj._hasCheckUpdateListener = true;
				MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "task_updateListerner back");

			}

			var timer = Client.instance.miniserverTime;


			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				LogsManager.echo("请求完新版本信息的回调", res.hasUpdate, "costTime :", Client.instance.miniserverTime - timer);
				thisObj.setVersionCheckResult(res.hasUpdate ? 2 : 1);
				if (thisObj.isOutTime) return;
				if (timeCode) {
					TimerManager.instance.remove(timeCode);
				}
				if (thisObj._hasCheckUpdateListener) {
					LogsManager.echo("wxgme xd 已经处理过更新检查了--000000000")
					return;
				}
				thisObj._hasCheckUpdateListener = true;
				if (!res.hasUpdate && VersionManager.checkIsForceUpdate()) {
					//没有版本更新 才出现主界面
					MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "task_updateListerner back");
				} else {
					StatisticsManager.ins.onEvent(StatisticsCommonConst.CLIENT_UPDATE);
				}
				// Message.instance.send(ControlConst.VERSION_CHECK_COMPLETE);
			})

			updateManager.onUpdateReady(function () {
				// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				LogsManager.echo("新版本下载完毕", "costTime :", Client.instance.miniserverTime - timer);
				//如果不是强更状态 return
				if (!VersionManager.checkIsForceUpdate()) {
					LogsManager.warn("本次是非强更，无需重启客户端,localversion:", PackConfigManager.ins.platform.vms_version, "vmsversion:", VersionManager.vmsVersion)
					return;
				}

				// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
				LogsManager.echo("新版本下载完毕");
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#versionUpdateReady"));
				TimerManager.instance.setTimeout(() => {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					Global.isGameDestory = true;
					updateManager.applyUpdate();
				}, null, 300);


			})

			updateManager.onUpdateFailed(function () {
				if (thisObj._hasCheckUpdateListener) {
					LogsManager.echo("wxgme xd 已经处理过更新检查了--000000000")
					return;
				}
				thisObj._hasCheckUpdateListener = true;
				// 新的版本下载失败
				LogsManager.echo("新版本下载失败", "costTime :", Laya.timer.currTimer - timer);
				MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "task_updateListerner back");
			})
		} else {
			LogsManager.echo('this.getWX().getUpdateManager不支持');
			timeCode && TimerManager.instance.remove(timeCode);
			this.setVersionCheckResult(1);
			if (thisObj._hasCheckUpdateListener) {
				LogsManager.echo("wxgme xd 已经处理过更新检查了--000000000")
				return;
			}
			thisObj._hasCheckUpdateListener = true;
			MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "task_updateListerner back");
		}
	}

	//设置游戏帧率为30
	setGameFrame() {
		super.setGameFrame();
		if (GameConsts.gameFrameRate == 30) {

			if ("function" === typeof this.getWX().setPreferredFramesPerSecond) {
				// this.getWX().setPreferredFramesPerSecond(30);
			} else {
				LogsManager.echo("hlx 该平台不支持设置帧率函数");
			}
		}

	}


	/**阿拉丁数据打点 */
	aldSendEvent(eventId: string, eventData = {}) {
		// var sendObj = {}
		// // 新版阿拉丁会修改eventData。需要深度拷贝数据
		// TableUtils.deepCopy(eventData, sendObj);
		// var senjsonStr = JSON.stringify(sendObj);

		// // LogsManager.echo("yrc aldSendEvent eventId:", eventId, senjsonStr)
		// if (senjsonStr.length > 255) {
		//     // 大于255字符无法发送
		//     LogsManager.errorTag('ald_data_length_error', "string:" + senjsonStr)
		//     return;
		// }
		// this.getWX().aldSendEvent(eventId, sendObj);
	}

	/**添加onshow监听 */
	private addOnShowListener() {
		var myThis = this;
		// 首次注册初始化showT
		this.showT = Laya.Browser.now();
		LogsManager.echo('wx_listener 初始化onShow showT：', this.showT);
		if (!(UserInfo.isOppo() || UserInfo.isVivo())) {
			this.getWX().onShow((res) => {
				var nowTime = Laya.Browser.now()
				LogsManager.echo('>>OnShow成功回调', nowTime, JSON.stringify(res));
				if (!this.isHide || !myThis.hideT) {
					if (this.listenTime) {
						this.mainToListen = this.listenTime - StatisticsManager.mainStartT;
						LogsManager.echo("krma. noHide show start " + StatisticsManager.mainStartT + " listen " + this.listenTime + " mainToListen " + this.mainToListen + " now " + nowTime + " mainToNow " + (nowTime - StatisticsManager.mainStartT));
					} else {
						LogsManager.echo("krma. noHide show start " + StatisticsManager.mainStartT + " no listen " + " now " + nowTime + " mainToNow " + (nowTime - StatisticsManager.mainStartT));
					}
					StatisticsManager.mainStartT = nowTime;
				}

				//拿到分享链接参数
				if (res.query) {
					myThis.shareLinkParams = res.query
				}

				this.isHide = false;
				myThis.onGetFocus();
				myThis.checkShareSucc();

				JumpManager.openJumpListViewById(FullJumpFunc.ID_ONSHOW);
			})
		} else {
			this.getWX().onShow(() => {
				myThis.checkShareSucc();
				myThis.onGetFocus();
			})
		}

		this.getWX().onHide((res) => {
			myThis.onLoseFocus();
		})

	}


	//下载分包资源
	startDownloadSubPackage() {
		//如果不使用物理引擎 return
		if (!GameConsts.isUsePhysics) {
			MainModule.instance.changeShowMainTask(-1, MainModule.task_subpackage, "xd wx-loadSubpackage,quick");
			return;
		}
		if (window["Physics3D"]) {
			//这里需要重新赋值
			if (window["__physics3D"]) {
				Laya3D["_physics3D"] = window["__physics3D"]
			}
			LogsManager.echo("__已经拥有3D库了表示不会走到这里;")
			MainModule.instance.changeShowMainTask(-1, MainModule.task_subpackage, "xd wx-loadSubpackage,quick");
			return;
		}
		//如果不使用分包模式
		if (!this._isSubPackage) {
			this.initPhysics3D("xd wx-loadSubpackage,no subpackage");

			return;
		}
		LogsManager.echo("xd- startDownloadSubPackage")
		var t1 = Client.instance.miniserverTime;
		var thisObj = this;
		this.getWX().loadSubpackage(
			{
				name: "physics",
				success: function (res) {
					//完成一个任务
					thisObj.initPhysics3D("xd wx-loadSubpackage,costTime:" + (Client.instance.miniserverTime - t1) + "res:" + res);
				},
				fail: function (res) {
					//失败弹出异常提示框 重连
					LogsManager.echo("___分包下载异常--重新下载");
					WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#subPackageError"), thisObj.startDownloadSubPackage, thisObj);
				},
				complete: function (res) {
					LogsManager.echo("___分包下载complete", res);
				}
			}
		)
	}


	getWX(): any {
		return window["wx"];
	}

	/**设置用户来源 */
	setUserComeFrom() {
		var cacheData = CacheManager.instance.getGlobalCache(StorageCode.storage_firstrun_data)
		if (cacheData == "0") {
			//如果本地没有来源数据则获取一下并且存一个
			try {
				var launchRes = this.getLaunchOptions();
				if (launchRes) {
					var appId = "";
					if (launchRes["referrerInfo"] && launchRes["referrerInfo"]["appId"]) {
						appId = "_appId:" + launchRes["referrerInfo"]["appId"];
					}
					//首次启动数据缓存起来
					Global.firstRunSystemInfo = {appId: appId, sceneId: launchRes.scene};
					LogsManager.echo("sanmen getLaunchOptionsSync", JSON.stringify(launchRes), "sendStr:", UserInfo.LoginSceneInfo);
					//存本地
					CacheManager.instance.setGlobalCache(StorageCode.storage_firstrun_data, JSON.stringify(Global.firstRunSystemInfo));
				}
			} catch (err) {
				LogsManager.echo("sanmen getLaunchOptionsSync err");
			}
		} else {
			//如果有 就取本地的来源数据
			try {
				Global.firstRunSystemInfo = JSON.parse(cacheData);
			} catch (e) {
				Global.firstRunSystemInfo = {};
			}
			LogsManager.echo("sanmen setUserComeFrom", UserInfo.LoginSceneInfo);
		}
		Global.sceneId = Global.firstRunSystemInfo.sceneId;
	}


	getNetwork() {
		if (this.getWX().getNetworkType) {
			this.getWX().getNetworkType({
				success: (res) => {
					if (res && res.networkType) {
						DeviceTools.network = res.networkType;
					}
				},
			})
		}
	}


	/**显示模态对话框，即弹窗 */
	showPopTip(title: string, content: string, extraData = null) {
		LogsManager.echo("yrc showPopTip:", title, content, extraData)
		if (this.getWX().showModal) {
			var data = TableUtils.copyOneTable(extraData) || {};
			data.title = title;
			data.content = content;
			this.getWX().showModal(data)
		}
	}

	/**
	 * 显示消息提示框
	 * @param title 显示的提示文字
	 * @param icon 图标类型，none为没有图标
	 */
	showFlyTip(title: string, icon: string = "none") {
		LogsManager.echo("yrc showFlyTip:", title)
		if (this.getWX().showToast) {
			this.getWX().showToast({
				title: title,
				icon: icon
			})
		}
	}

	//分包下载失败次数.默认给一次自动重下
	private _subPackErrorCount: number = 0;

	/**调用wx系源生接口，只做加载即完成后的回调 */
	loadSubPackage(packageName: string, callback: Function, thisObj: any, isShowPop: boolean = false) {
		var t1 = Client.instance.miniserverTime;

		if (!this.getWX().loadSubpackage) {
			LogsManager.errorTag(LogsErrorCode.WX_SDK_ERROR, "yrc loadSubPackage 无分包加载接口")
			callback && callback.call(thisObj, false);
			return;
		}
		var myThis = this;

		var timeCode = 0

		var failFunc = (res) => {
			TimerManager.instance.remove(timeCode);
			if (!callback) {
				return;
			}
			LogsManager.echo("yrc loadSubpackage fail packageName:", packageName, "_subPackErrorCount ", myThis._subPackErrorCount, " errRes:", TableUtils.safelyJsonStringfy(res));
			myThis._subPackErrorCount++;
			//如果第一次下载失败
			if (myThis._subPackErrorCount == 1) {
				LogsManager.echo("xd _重试---下载分包", packageName);
				TimerManager.instance.add(myThis.loadSubPackage, myThis, 100, 1, false, [packageName, callback, thisObj, isShowPop])
				callback = null;
			} else {
				if (isShowPop) {
					//区分加载超时还是失败
					if (res == "timeOut") {
						StatisticsExtendManager.onEvent(StatisticsCommonConst.CLIENT_SUBPACK_TIMEOUT, {
							time: myThis._subPackErrorCount,
							position: packageName,
							type: DeviceTools.network
						})
					} else {
						StatisticsExtendManager.onEvent(StatisticsCommonConst.CLIENT_SUBPACK_ERROR, {
							time: myThis._subPackErrorCount,
							position: packageName,
							type: DeviceTools.network
						})
					}

					if (callback) {
						//这里需要 清空callback .因为超时或者fail都会做回调.为了避免多次回调 需要做特殊处理 .执行一次callback 需要把 这个callback对象清空
						var tempCallBack = callback
						callback = null;
						WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#error110"), () => {
							LogsManager.echo("yrc111 loadSubpackage fail 弹窗重新加载点击确认")
							myThis.loadSubPackage(packageName, tempCallBack, thisObj, true);
						}, myThis);
					}

				} else {
					callback && callback.call(thisObj, false);
				}
			}
		}

		//暂定5秒以后判定分包失败 重连
		timeCode = TimerManager.instance.add(failFunc, this, 10000, 1, false, ["timeOut"]);


		this.getWX().loadSubpackage({
			name: packageName,
			success: (res) => {
				myThis._subPackErrorCount = 0;
				LogsManager.echo("yrc loadSubpackage success packageName:", packageName, "   sucRes:", res, "cosTime:", Client.instance.miniserverTime - t1);
				SubPackageManager.setLoadStatus(packageName);

				//这里延迟一帧做回调
				if (callback) {
					TimerManager.instance.setTimeout(callback, thisObj, 30, true);
					//成功需要清理callback
					callback = null
				}
				TimerManager.instance.remove(timeCode);
				// callback && callback.call(thisObj, true);
			},
			fail: failFunc,
			complete: (res) => {
				TimerManager.instance.remove(timeCode);
				LogsManager.echo("yrc loadSubpackage complete packageName:", packageName);
			}
		})

	}


	/**打开客服会话 */
	openCustomerService(isShowCard: boolean = false) {
		if (this.getWX().openCustomerServiceConversation) {
			this.getWX().openCustomerServiceConversation({
				showMessageCard: isShowCard,
				sendMessageTitle: "我要领钻石",
				sendMessageImg: "common/main_btn_lingzuan.png",
				success: (res) => {
					LogsManager.echo("yrc111 openCustomerServiceConversation success", res);
					Message.instance.send(MsgCMD.CUSTOMER_BACK);
				},
				fail: (res) => {
					LogsManager.echo("yrc111 openCustomerServiceConversation fail", res);
				},
				complete: (res) => {
					LogsManager.echo("yrc111 openCustomerServiceConversation complete", res);
				},

			})
		}
	}


	/**跳转到其他小程序
	 * data.extraData是额外传的数据，包含各种回调等，但不是跳转需要传递的extraData,跳转需要传递的extraData是data.extraData.ext
	 */
	jumpToMiniProgram(data: any) {
		if (KariqiShareManager.checkIsKariquChannel()) {
			if (this.getWX().navigateToMiniProgram) {
				this.getWX().navigateToMiniProgram({
					appId: data.appId,
					path: data.path,
					extraData: data.extraData && data.extraData.ext,
					success: (res) => {
						LogsManager.echo("yrc navigateToMiniProgram success", res);
						JumpManager.sendKariquJumpClickData(data.jumpData)

						//额外数据处理
						if (data.extraData) {
							data.extraData.callBack && data.extraData.callBack.call(data.extraData.thisObj, data)
						}
						var gameName = "";
						if (data && data.jumpData && data.jumpData.GameName) {
							gameName = data.jumpData.GameName;
						}
						var toAppId = "";
						if (data && data.appId) {
							toAppId = data.appId
						}
						var position = 0;
						if (data && data.jumpData && data.jumpData.Position) {
							position = data.jumpData.Position;
						}
						StatisticsManager.ins.onEvent(StatisticsCommonConst.JUMP_TO_OTHER_GAME_SUCCESS, {
							gameName: gameName,
							from: data.extraData && data.extraData.from,
							toAppId: toAppId,
							position: position
						});
					},
					fail: (res) => {
						LogsManager.echo("yrc navigateToMiniProgram fail", res);
						if (data.extraData.callBack) {
							data.extraData.callBack.call();
						}

					},
					complete: (res) => {
						LogsManager.echo("yrc navigateToMiniProgram complete", res);
					},
				})
			}
		} else if (JumpManager.jumpChannel == JumpConst.JUMP_CHANNEL_ZHISE) {
			var jump = AdResponse.changeDataToZhise(data);
			JumpManager.zhiseData.navigate2Mini(jump, UserInfo.channelUserId, () => {
				//StatisticsManager.ins.onEvent(StatisticsManager.JUMP_OTHERGAMESUCCESS, { name: data.jumpData.GameName })
			}, () => {
			})
		} else {
			if (this.getWX().navigateToMiniProgram) {
				this.getWX().navigateToMiniProgram({
					appId: data.appId,
					path: data.path,
					extraData: data.extraData && data.extraData.ext,
					success: (res) => {
						LogsManager.echo("yrc navigateToMiniProgram success", res);
						//额外数据处理
						if (data.extraData) {
							data.extraData.callBack && data.extraData.callBack.call(data.extraData.thisObj, data.appId)
						}
						var gameName = "";
						if (data && data.jumpData && data.jumpData.GameName) {
							gameName = data.jumpData.GameName;
						}
						var toAppId = "";
						if (data && data.appId) {
							toAppId = data.appId
						}
						var position = 0;
						if (data && data.jumpData && data.jumpData.Position) {
							position = data.jumpData.Position;
						}
						StatisticsManager.ins.onEvent(StatisticsCommonConst.JUMP_TO_OTHER_GAME_SUCCESS, {
							gameName: gameName,
							from: data.extraData && data.extraData.from,
							toAppId: toAppId,
							position: position
						});
						JumpManager.removeJumpedApp(toAppId);
					},
					fail: (res) => {
						LogsManager.echo("yrc navigateToMiniProgram fail", res);
						// Message.instance.send(WxEvent.WX_EVENT_JUMPFAIL);
						JumpManager.showDrawerView(data.extraData && data.extraData.from);
						if (data.extraData && data.extraData.failCall) {
							data.extraData.failCall && data.extraData.failCall.call(data.extraData.thisObj, data)
						}
					},
					complete: (res) => {
						LogsManager.echo("yrc navigateToMiniProgram complete", res);
						// Message.instance.send(WxEvent.WX_EVENT_JUMPCOMPLETE);
					},
				})
			}
		}

	}

	/**设置排行榜数据 */
	setUseRankInfo(data = []) {
		if (this.getWX().setUserCloudStorage) {
			this.getWX().setUserCloudStorage({
				KVDataList: data,
				success(res) {
					LogsManager.echo('setUserCloudStorage>>成功回调', JSON.stringify(res));
				}, fail(err) {
					LogsManager.echo('setUserCloudStorage>>失败回调', JSON.stringify(err));
				}
			})
		} else {
			LogsManager.errorTag(null, "没有找到setUserCloudStorage这个接口");
		}
	}


	/**
	 * 是否从小程序收藏进入
	 */
	isFromFavourite() {
		if (Global.currentSceneId != "1001") {
			return false;
		}
		return true;
	}


	//转化表为分享数据格式
	public turnDataToShareQuery(data) {
		var str = "";
		if (typeof data == "string") {
			return data;
		}
		for (var i in data) {
			if (!str) {
				str = i + "=" + data[i]
			} else {
				str += "&" + i + "=" + data[i]
			}

		}
		return str;
	}

	showGameClubBtn(posX: number, posY: number, btnW: number, btnH: number) {
		if (!this.getWX().createGameClubButton) {
			return;
		}
		if (!this._gameClubBtn) {
			var left = posX / ScreenAdapterTools.width * Global.windowWidth;
			var top = posY / ScreenAdapterTools.height * Global.windowHeight;
			var width = btnW / ScreenAdapterTools.width * Global.windowWidth;
			var height = btnH / ScreenAdapterTools.height * Global.windowHeight;
			var btn = this.getWX().createGameClubButton({
				type: "image",
				style: {
					left: left,
					top: top,
					width: width,
					height: height,
				},
				icon: "light"
			})
			this._gameClubBtn = btn;
		}
		if (this._gameClubBtn) {
			this._gameClubBtn.show();
		}
	}

	hideGameClubBtn() {
		if (this._gameClubBtn) {
			this._gameClubBtn.hide();
		}
	}

	destroyGameClubBtn() {
		if (this._gameClubBtn) {
			this._gameClubBtn.destroy();
		}
	}

	/**
	 * 请求订阅消息
	 * @param tmpIds 模板id列表
	 * @param successCall 成功回调
	 * @param failCall 失败回调
	 * @param completeCall 完成回调
	 */
	requestSubscribeMessage(tmpIds, successCall, failCall, completeCall) {
		if ('function' == typeof this.getWX().requestSubscribeMessage) {
			var sendMessage = {};
			sendMessage['tmplIds'] = tmpIds;
			sendMessage['success'] = successCall;
			sendMessage['fail'] = failCall;
			sendMessage['complete'] = completeCall;
			this.getWX().requestSubscribeMessage(sendMessage);
		}
	}


	/**
	 * 监听加速度
	 */
	onAccelerometerChange() {
		if (UserInfo.platform.getWX().onAccelerometerChange) {
			UserInfo.platform.getWX().onAccelerometerChange((accelVec) => {
				accelVec.x = accelVec.x * 10;
				Message.instance.send(JSToNativeEvent.NATIVE_ACCEL_BACK, accelVec);
			});
		}
	}


	/**
	 * 暂定加速器监听
	 */
	accelerometerPause() {
		if (UserInfo.platform.getWX().stopAccelerometer) {
			UserInfo.platform.getWX().stopAccelerometer({
				success: null,
				fail: null,
				complete: null
			});
		}
	}
}

