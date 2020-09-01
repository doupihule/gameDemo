import TTGamePlatform from "./TTGamePlatform";
import LogsManager from "../manager/LogsManager";
import UserInfo from "../common/UserInfo";
import GlobalData from "../utils/GlobalData";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import WindowManager from "../manager/WindowManager";
import TranslateFunc from "../func/TranslateFunc";
import TimerManager from "../manager/TimerManager";
import MethodCommon from "../common/kakura/MethodCommon";

export class BaiduGamePlatform extends TTGamePlatform {
	/** 匿名登录用唯一Id */
	private _swanid = null;
	private _swanid_signature = null;

	public static instance: BaiduGamePlatform;

	public constructor() {
		super();
		window["wx"] = window["swan"]
		BaiduGamePlatform.instance = this;
	}

	getWX() {
		return window['swan'];
	}

	initPlatformData() {
		super.initPlatformData();
		// 初始化防沉迷事件
		try {
			this.initAntiAddiction();
		} catch (e) {
			LogsManager.errorTag("baiduError", "防沉迷error", e.toString());
		}
		LogsManager.echo("平台登录就添加桌面 --------------------")
		this.addToDesktop();
	}

	getSwanId(callback = null, thisObj = null) {
		this.getWX().getSwanId({
			success: res => {
				LogsManager.echo("getSwanId swanId 加载成功", res);
				if (res.data.swanid && res.data.swanid_signature) {
					this._swanid = res.data.swanid;
					this._swanid_signature = res.data.swanid_signature;
					callback && callback.call(thisObj, true);
				} else {
					LogsManager.errorTag("getSwanId_swanId_error", "getSwanId swanId 加载成功,返回值异常");
					callback && callback.call(thisObj, false);
				}
			},
			fail: err => {
				LogsManager.echo("getSwanId swanId 失败", err);
				callback && callback.call(thisObj, false);
			}
		})
	}

	getWxInfo() {
		this.reCheckBar();
		if (this._swanid) {
			this._login();
		} else {
			var myThis = this;
			LogsManager.echo("getWxInfo getSwanId not finish");
			this.getSwanId((result) => {
				LogsManager.echo("getWxInfo getSwanId error!!!");
				if (!result) {
					// 重试 getWxInfo;
					this.retryGetWxInfo();
					return;
				}
				myThis._login();
			})
		}
	}

	/**
	 * 微信登陆+global登陆
	 */
	_login() {
		var myThis = this;
		try {
			var result = this.getWX().isLoginSync();
			LogsManager.echo('isLoginSync sccess:', result.isLogin);
			if (result.isLogin) {
				this.getWX().login({
					success(res) {
						LogsManager.echo('>>login成功回调>>', JSON.stringify(res));
						myThis.setLaunchOptions();
						if (res != undefined) {
							if (!res.code) {
								myThis.retryGetWxInfo();
								return;
							}
							var gParams = {};

							gParams = {
								"method": MethodCommon.global_Account_loginBaidu,
								"params": {
									"code": res.code,
									"anonymous_code": myThis._swanid,
									"device": GlobalData.deviceModel,
									"comeFrom": UserInfo.LoginSceneInfo,
									"sceneId": String(GlobalData.sceneId),
									"swanid_signature": myThis._swanid_signature
								}
							};
							myThis.reqGlobal(gParams);
						}
					}, fail(err) {
						LogsManager.warn('>>login失败回调>>', err);
						myThis.retryGetWxInfo();
					}, complete() {
					}
				})
			} else {
				// swanId已经加载完毕
				var gParams = {
					"method": MethodCommon.global_Account_loginBaidu,
					"params": {
						"code": "",
						"anonymous_code": this._swanid,
						"device": GlobalData.deviceModel,
						"comeFrom": UserInfo.LoginSceneInfo,
						"sceneId": String(GlobalData.sceneId),
						"swanid_signature": this._swanid_signature

					}
				};
				myThis.reqGlobal(gParams);
			}
		} catch (e) {
			LogsManager.echo('isLoginSync error:', e);
		}
	}

	/**
	 * 跳转小程序
	 */
	jumpToMiniProgram(data) {
		if (this.getWX().navigateToMiniProgram) {
			this.getWX().navigateToMiniProgram({
				appKey: data.appId,
				path: data.path,
				extraData: data.extraData && data.extraData.ext,
				success: (res) => {
					LogsManager.echo("yrc navigateToMiniProgram success", res);
					var position = 0;
					if (data && data.jumpData && data.jumpData.Position) {
						position = data.jumpData.Position;
					}
					StatisticsManager.ins.onEvent(StatisticsCommonConst.JUMP_TO_OTHER_GAME_SUCCESS, {
						gameName: data.jumpData.GameName,
						from: data.extraData && data.extraData.from,
						toAppId: data.appId,
						position: position
					})

					// // Message.instance.send(WxEvent.WX_EVENT_JUMPSUC);
					// JumpManager.mtJump(data);
					// //额外数据处理
					// if (data.extraData) {
					//     data.extraData.callBack && data.extraData.callBack.call(data.extraData.thisObj, data.appId)
					// }
					// JumpManager.mtJump(data);
					// JumpManager.showDrawerView(data.extraData && data.extraData.from);
				},
				fail: (res) => {
					LogsManager.echo("yrc navigateToMiniProgram fail", res);
					// Message.instance.send(WxEvent.WX_EVENT_JUMPFAIL);
					// JumpManager.showDrawerView(data.extraData && data.extraData.from);
				},
				complete: (res) => {
					LogsManager.echo("yrc navigateToMiniProgram complete", res);
					// Message.instance.send(WxEvent.WX_EVENT_JUMPCOMPLETE);
				},
			})
		}
	}

	/**
	 * 添加到我的小程序
	 */
	addToFavorite(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
		if (!this.canAddToFavorite()) {
			failCall && failCall.call(thisObj)
			return;
		}
		this.getWX().showFavoriteGuide({
			type: channelParams['type'] ? channelParams['type'] : 'bar',
			// content : channelParams['content'] ? channelParams['content'] : 'bar',
			success(res) {
				LogsManager.echo("hlx 添加到我的小程序成功", JSON.stringify(res));
				StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_MYGAME_SUCCESS);
				successCall && successCall.call(thisObj)
			},
			fail(res) {
				LogsManager.echo("hlx 添加到我的小程序失败", JSON.stringify(res));
				StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_MYGAME_FAIL);
				failCall && failCall.call(thisObj)
			}
		})
	}

	/**
	 * 添加到桌面
	 */
	addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
		if (!this.canAddToDesktop()) {
			failCall && failCall.call(thisObj)
			return;
		}
		this.getWX().showAddToDesktopGuide({
			type: channelParams['type'] ? channelParams['type'] : 'bar',
			// content : channelParams['content'] ? channelParams['content'] : 'bar',
			success(res) {
				LogsManager.echo("hlx 添加到桌面成功", JSON.stringify(res));
				StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_DESKTOP_SUCCESS);
				successCall && successCall.call(thisObj)
			},
			fail(res) {
				LogsManager.echo("hlx 添加到桌面失败", JSON.stringify(res));
				StatisticsManager.ins.onEvent(StatisticsCommonConst.ADD_DESKTOP_FAIL);
				failCall && failCall.call(thisObj)
			}
		})
	}

	/**
	 * 初始化防沉迷事件
	 */
	initAntiAddiction() {
		var api;
		try {
			api = this.getWX().getAntiAddiction();
		} catch (e) {
			return false;
		}

		if (typeof this.getWX().getAntiAddiction != "function") {
			return false;
		}


		var mythis = this;

		api.onAntiAddiction(function ({state, msg}) {
			if (!mythis.antiAddtionInfo) {
				// 第一次防沉迷提示
				WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_anti_indulge1", "TranslateGlobal"), null, mythis);
				// 5分钟后弹出强制关闭游戏提示
				TimerManager.instance.setTimeout(() => {
					WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_anti_indulge2", "TranslateGlobal"), () => {
						mythis.getWX().exit()
					}, mythis);
				}, mythis, 3000);
			}
			mythis.antiAddtionInfo = {
				status: state,
				msg: msg,
			}
		});
	}

	/**
	 * 获取防沉迷信息
	 */
	showAntiAddtionView() {
		if (this.antiAddtionInfo && (this.antiAddtionInfo.status == '10001' || this.antiAddtionInfo.status == '10002')) {
			WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_anti_indulge2", "TranslateGlobal"), this.getWX().exit, this);
			return true
		}
		return false;
	}

	/**
	 * 是否从小程序收藏进入
	 */
	isFromFavourite() {
		if (GlobalData.currentSceneId != "1201001000000000") {
			return false;
		}
		return true;
	}
}
