import {MusicConst} from './../../game/sys/consts/MusicConst';
import {WindowCfgs} from './../../game/sys/consts/WindowCfgs';
import GamePlatform from "./GamePlatform";
import Global from "../../utils/Global";
import UserInfo from "../common/UserInfo";
import MainModule from "../manager/MainModule";
import NativeBridge from "../native/NativeBridge";
import JSToNativeEvent from "../event/JSToNativeEvent";
import NativeToJSEvent from "../event/NativeToJSEvent";
import GameConsts from "../../game/sys/consts/GameConsts";
import ChannelConst from "../../game/sys/consts/ChannelConst";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import WindowManager from "../manager/WindowManager";
import Message from "../common/Message";
import WXGamePlatform from "./WXGamePlatform";
import TableUtils from "../utils/TableUtils";
import GameUtils from "../../utils/GameUtils";
import MethodCommon from "../common/kakura/MethodCommon";
import SoundManager from "../manager/SoundManager";
import ScreenAdapterTools from '../utils/ScreenAdapterTools';
import LogsManager from '../manager/LogsManager';
import TranslateFunc from '../func/TranslateFunc';
import UserModel from '../../game/sys/model/UserModel';
import TimerManager from '../manager/TimerManager';
import GameSwitch from '../common/GameSwitch';
import PackConfigManager from '../manager/PackConfigManager';
import StringUtils from '../utils/StringUtils';
import MsgCMD from '../../game/sys/common/MsgCMD';

export default class AndroidGamePlatform extends GamePlatform {

	//native的sha1串
	private _nativeSha1Arr: string[];

	//初始化native返回的数据
	protected _nativeBackData: any;

	public constructor() {
		super();
		//注册错误回调事件
		window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
			LogsManager.systemError(errorMessage, errorObj && errorObj.stack, "uri:", scriptURI);
		}
		//添加 获取android设备信息接口
		MainModule.showMainTask += 1;

		this.loadAdvFailed = false;

		Message.instance.add(NativeToJSEvent.TTSDK_AD_EVENT, this);
		Message.instance.add(NativeToJSEvent.SYSTEM_INFO_EVENT, this);
		//注册焦点事件
		this.registFocusEvent();

		var conch = window["conch"]

		if (conch && conch.setOnBackPressedFunction) {
			conch.setOnBackPressedFunction(() => {
				WindowManager.setPopupTip(2, TranslateFunc.instance.getTranslate("#tid_extiGame"), this.exitGame, this);
			});
		}

	}


	private initTTADSdk() {
		var channelData = ChannelConst.getChannelConst(UserInfo.platformId);
		var resultData = TableUtils.copyOneTable(channelData);
		resultData.appName = GameConsts.gameName;
		resultData.isDebug = UserInfo.isTest();
		//角色id
		resultData.userId = UserModel.instance.getUserRid();
		//广告媒体类型
		resultData.adMediaType = UserInfo.adMediaType;
		NativeBridge.instance.callNative(JSToNativeEvent.TTADSDK_INIT, resultData);
	}


	public onVideoComplete(videoResult) {
		WXGamePlatform.prototype.onVideoComplete.call(this, videoResult);
	}

	//看完视频回来
	private onDoVedioBack() {
		this.isPlayVideo = false;
		if (WindowManager.isUIOpened(WindowCfgs.GameMainUI)) {
			SoundManager.playBGM(MusicConst.MUSIC_BGM);
		}
		WindowManager.SwitchMaskUI(false, 0.5);
		Message.instance.send(MsgCMD.VIDEO_PLAY);
	}


	public getLoginResult() {
		//初始化头条sdk
		this.initTTADSdk();
		//如果是 云储存
		if (Global.checkUserCloudStorage()) {
			return;
		}
		this.changeLeftTask(-1, "getLoginResult");


	}

	public getUserInfoAndReq() {
		this.sendKakuraInit();
	}

	//判断是否是套壳包
	protected checkSignSha1() {
		var sign: string = "PhmdlmidmeQmfhmefmfgmOhmejmROmNhmfjmOhmPNmejmfcmjhmihmePmNg|kQmOPmSOmkgmljmcimcgmjemedmejmORmNjmNkmefmecmjimkdmQgmifmei";
		var singArr: string[];
		if (!sign) {
			LogsManager.errorTag("sha1Error", "Game Const.ts没有配置ENCODE_SHA1");
			return;
		}
		var decodeSign = StringUtils.decodeSign(sign);
		//必须是android系统
		if (!UserInfo.isSystemAndroid()) {
			return;
		}
		//test平台的包不校验
		if (UserInfo.isTest()) {
			return;
		}

		if (!this._nativeSha1Arr || this._nativeSha1Arr.length == 0) {
			LogsManager.warn("native串还没初始化--")
			return;
		}


		for (var i = 0; i < this._nativeSha1Arr.length; i++) {
			var nativeSign: string = this._nativeSha1Arr[i];
			if (decodeSign.indexOf(nativeSign) == -1) {
				//这个表名是套壳包
				this.childChannelId = nativeSign;
				LogsManager.errorTag("wrongSha1", "这是套壳包.sha1:" + nativeSign);
				return;
			}
		}
		LogsManager.echo("这个包是合法的")
	}


	public createLoginButton(callBack: Function, thisObject: any) {
		callBack && callBack.call(thisObject);
	}

	//重登次数
	protected _reloginCount = 0;

	public getWxInfo() {
		if (this._reloginCount == 0) {
			//如果是web版 跳过底层系统更新版本检查 和 分包版本检查
			MainModule.instance.changeShowMainTask(-1, MainModule.task_updateListerner, "skip version check")
			//web版本也在这个时候才初始化物理引擎.是为了统一结构 防止因为平台差异化导致不一样的问题
			UserInfo.platform.initPhysics3D("skip physics3d subpackage check");
		}
		this._startReqGlobal();

	}

	//请求global
	private _startReqGlobal() {
		var deviceId = Global.deviceId
		//登入放到获取到native信息之后处理
		var params: any = {
			"method": this.getGlobalMethod(),
			"params": {
				"passport": deviceId,
				"password": '',
				"device": Global.deviceModel,
				"childChannelId": this.getChildChannelKey()
			}
		};
		UserInfo.platform.reqGlobal(params);
	}


	protected getGlobalMethod() {
		return MethodCommon.global_Account_loginAndroidMaster
	}

	sharePage() {
		// ToolTip.instance.setFlyText("暂不支持此功能");
	}

	/**分享 */
	share(id: any, extraData: any, callback: Function, thisObj: any) {
		callback && callback.call(thisObj, true);
	}

	//开始加载视频
	showVideoAd(successCallBack: any = null, closeCallBack: any = null, thisObj: any = null, extraData = {}) {
		//如果是套壳包. 只做失败返回
		if (this.isCasingPackage()) {
			if (closeCallBack) {
				closeCallBack.call(thisObj, false)
			}
			;
			return;
		}

		// 点击观看视频打点
		StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD);
		this._videoSucCallback = successCallBack;
		this._videoFailCallback = closeCallBack;
		this._extraData = extraData;
		this._videoLoaded = true;
		this._videoThisObj = thisObj;
		WindowManager.SwitchMaskUI(true, 0.5);
		this.isPlayVideo = true;
		SoundManager.stopMusic();
		//读取视频类型  1是优先全屏视频 2优先激励视频.
		var vedioType: number = Number(GameSwitch.getSwitchState(GameSwitch.SWITCH_NATIVE_VEDIO_TYPE)) || 2

		NativeBridge.instance.callNative(JSToNativeEvent.TTADSDK_SHOWVEDIO, {
			scene: WindowManager.getCurrentWindowName() || "main",
			type: vedioType
		});

		// successCallBack && successCallBack.call(thisObj, true);
	}

	/**退出登入  */
	loginOut(): void {
		window.location.reload();
		// Laya.PlatformClass.createClass()
	}

	//设置游戏帧率
	setGameFrame() {
		super.setGameFrame();

	}

	/**版本更新检查 */
	addUpdateListener() {

		var appCache = window["appcache"];
		//设置缓存的版本号.下次更新直接拉取最新的版本
		var targetVersion = Global.version
		LogsManager.echo("version setVMSVersion:" + targetVersion, "hotfixSwitch:", GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_HOTFIX));
		this.changeLeftTask(-1, "addUpdateListener");


		//必须是 开启热更状态才会去覆盖本地版本
		if (!GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_HOTFIX)) {
			if (appCache) {
				var oldVersion = appCache.getResourceID(this.getCacheKey());

				// if(UserInfo.isTest()){
				//     var lb = new Laya.Label();
				//     lb.text = "old:"+oldVersion +",new:"+ targetVersion
				//     lb.width = 100;
				//     lb.height = 20;
				//     lb.fontSize = 20;
				//     lb.strokeColor = "#00ffff";
				//     lb.stroke = 1;
				//     lb.pos(420,20);
				//     lb.mouseEnabled =false;
				//     WindowManager.rootLayer.addChild(lb);
				// }

				if (!oldVersion || oldVersion == "") {
					appCache.setResourceID(this.getCacheKey(), targetVersion);
				} else {
					if (oldVersion != targetVersion) {
						appCache.setResourceID(this.getCacheKey(), targetVersion);
						LogsManager.echo("versionUpdate:", "有新版本,vold:" + oldVersion + ",vnew:" + targetVersion);
						//测试环境
						// if(Number(targetVersion)% 2 ==0){
						//     WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_newVersion"), this.reloadGame, this);
						// }
						this.reloadGame()

						return;
					}
				}
			}

		}

		//版本检查完毕以后 才隐藏loading
		if (window["loadingView"]) {
			window["loadingView"].hideLoadingView();
		}

		//如果是套壳包
		if (this.isCasingPackage()) {
			//这个地方需要读取策略 默认是强退,提醒他去官网下载包
			var method = GameSwitch.getSwitchState(GameSwitch.SWITCH_SIGN_METHOD);
			//默认方案就是不让进游戏
			if (!method || method == "0") {
				WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_casingPackage"), this.gotoPackageUrl, this);
				return;
			}

		}

		super.addUpdateListener();


	}

	//去安装包地址
	public gotoPackageUrl() {
		var url = PackConfigManager.ins.platform.DOWNLOAD_URL;
		if (url) {
			NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_OPENURL, {url: url});
		}
		//1秒以后退出游戏
		TimerManager.instance.add(this.exitGame, this, 1000);
	}

	//重新加载游戏
	private reloadGame() {
		//移除所有对象
		this.clearAllData()
		//延迟一帧以后再销重载游戏.否则渲染会有bug
		TimerManager.instance.add(window.location.reload, window.location, 100, 1);
		// window.location.reload(true);
	}

	//清除所有数据
	private clearAllData() {
		var rootCtn = WindowManager.rootLayer;
		rootCtn.removeSelf();
	}


	//执行版本覆盖
	protected doCoverVersion(serverVersion: string) {
		// serverVersion =String( (Number( this.getAPPCacheVersion() ) || 1) +1  ) ;
		LogsManager.echo("serverVersion:" + serverVersion);
		//如果是测试渠道 而且版本号是1
		if (UserInfo.isTest() && Global.version == "1") {
			return;
		}

		var __projectConfig = window["__projectConfig"]
		var minVersion = __projectConfig && __projectConfig.APP_BUILD_NUM || 1;
		minVersion = Number(minVersion);

		var localNum = Number(Global.version);
		var targetVersion = this.getAPPCacheVersion();
		var serverNum = 0;
		if (!serverVersion) {
			if (targetVersion) {
				serverNum = Number(targetVersion);
			}
		} else {

			serverNum = Number(serverVersion);

		}
		//直接取服务器的版本和客户端打包的版本最对比.  默认直接用服务器的版. 但如果客户端打包版本号比服务器版本号高. 那么表示采用打包版本号
		var resultVersion = Math.max(minVersion, serverNum);
		Global.version = String(resultVersion);
		LogsManager.echo("GlobalVersion:" + Global.version, "server:", serverVersion, "buildVersion:", minVersion);
	}


	//获取app缓存的版本号
	protected getAPPCacheVersion() {
		var appCache = window["appcache"];
		var targetVersion
		if (appCache) {
			targetVersion = appCache.getResourceID(this.getCacheKey());
		}
		return targetVersion
	}

	//获取缓存的vmskey
	private getCacheKey() {
		return "vmsVersion" + PackConfigManager.ins.platform.platform
	}


	public canAdv() {
		if (!GameUtils.canVideo) {
			return false;
		}
		//如果是套壳包 不能看广告
		if (this.isCasingPackage()) {
			return false;
		}
		return true;
	}

	public canShare() {
		return false;
	}

	//android平台的versionjson 一定要和 appcache的version同步. 否则会出现版本错乱
	public getVersionName() {
		var appCache = window["appcache"];
		var targetVersion = Global.version
		if (appCache) {
			targetVersion = appCache.getResourceID(this.getCacheKey());
			if (!targetVersion) {
				targetVersion = Global.version;
			}
		}
		LogsManager.echo("getVersionName:" + targetVersion);
		return "version_" + targetVersion + ".json";
	}


	//重写是否是套壳包
	public isCasingPackage() {
		if (this.childChannelId) {
			return true;
		}
		return false;
	}

	//退出游戏
	private exitGame() {
		if (window["conch"].exit) {
			window["conch"].exit()
		}

	}

	//------------------------------------native交互------------------------------------
	//------------------------------------native交互------------------------------------
	//------------------------------------native交互------------------------------------

	//native信息返回的时候 在开始登入
	protected onNativeInfoBack() {
		//校验sha1串
		this.checkSignSha1();


	}


	//头条sdk广告播放回调
	public onTTSDKAdCallBack(params) {
		var thisObj = this;
		//复用wxgameplatform方法
		//1是成功
		if (params.status == 1) {
			StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_SUCCESS);
			this.onDoVedioBack();
			WXGamePlatform.prototype.onVideoComplete.call(this, true);
			//取消
		} else if (params.status == 2) {
			WindowManager.SwitchMaskUI(false, 0.5);
			WXGamePlatform.prototype.onTurnOffAdsEarly.call(this);
			thisObj._extraData && thisObj._extraData.callback && thisObj._extraData.callback.call(thisObj._extraData.thisObj, false)
			//判定失败
		} else if (params.status == 3) {
			if (!this.isPlayVideo) {
				return;
			}
			// 弹出广告正在加载中
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_ad_initerror"));
			this.onDoVedioBack();
			WXGamePlatform.prototype._doVedioCallBack.call(this, false);
			//如果是有ecpm的 那么做ecpm统计
		} else if (params.status == 6) {

			StatisticsManager.ins.onEvent(StatisticsCommonConst.NORMAL_VIDEO_AD_ECPM, {
				ecpm: params.ecpm,
				level: params.ecpmLevel
			});

			//判定失败
		} else {
			//其他事件----
		}
	}

	//设备震动接口
	public vibrate(isLong: boolean = false, callBack: Function = null, thisObject: any = null) {
		//调用短震动接口
		var time = 20;
		if (isLong) {
			time = 60
		}
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_VIBRATOR, {time: time, style: 1});
		if (callBack) {
			TimerManager.instance.add(callBack, thisObject, time, 1);
		}
	}

	/**
	 * 监听加速度
	 */
	onAccelerometerChange() {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_ACCEL);
	}


	/**
	 * 重置加速计加速值
	 */
	accelerometerClear(x) {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_ACCEL_CLEAR, x);
	}


	/**
	 * 暂定加速器监听
	 */
	accelerometerPause() {
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_ACCEL_PAUSE);
	}

	public recvMsg(cmd: string, data: any) {
		//接收头条sdk广告事件
		if (cmd == NativeToJSEvent.TTSDK_AD_EVENT) {
			this.onTTSDKAdCallBack(data);
		} else if (cmd == NativeToJSEvent.SYSTEM_INFO_EVENT) {
			ScreenAdapterTools.checkNativeSystemInfo(data);
			//存储native的sha1串值
			if (data.sign) {
				this._nativeSha1Arr = data.sign.split(",");
			}
			//存储native数据
			this._nativeBackData = data;
			MainModule.instance.changeShowMainTask(-1, "getNativeSystemInfo", "获取native信息返回");
			this.onNativeInfoBack();
		}
	}


	/**
	 * 推送
	 */
	pushMessage(delay, id, title?, subTitle?, body?, repeats = false) {
		if (delay < 1) {
			LogsManager.warn("推送延迟小于1秒，注册不执行");
			return;
		}
		if (repeats && delay <= 60) {
			LogsManager.warn("推送需要重发且延迟不大于60秒，注册不执行");
			return;
		}
		if (this.tempPushDic["title"]) {
			delete this.tempPushDic["title"];
		}
		if (this.tempPushDic["subtitle"]) {
			delete this.tempPushDic["subtitle"];
		}
		if (this.tempPushDic["body"]) {
			delete this.tempPushDic["body"];
		}
		this.tempPushDic["delay"] = delay;
		this.tempPushDic["id"] = id;
		this.tempPushDic["repeats"] = repeats;
		if (title) {
			this.tempPushDic["title"] = title;
		}
		if (subTitle) {
			this.tempPushDic["subtitle"] = subTitle;
		}
		if (body) {
			this.tempPushDic["body"] = body;
		}
		NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_PUSH, this.tempPushDic);
	}


	// /**
	//  * 推送
	//  */
	// clearPushMessage(id) {
	//     this.tempClearPushDic["id"] = id;
	//     NativeBridge.instance.callNative(JSToNativeEvent.NATIVE_PUSH_CLEAR, this.tempClearPushDic);
	// }

}