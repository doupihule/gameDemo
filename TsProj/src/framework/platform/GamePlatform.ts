import GlobalData from "../utils/GlobalData";
import HttpMessage from "../common/HttpMessage";
import PackConfigManager from "../manager/PackConfigManager";
import TimerManager from "../manager/TimerManager";
import UserInfo from "../common/UserInfo";
import LogsManager from "../manager/LogsManager";
import CacheManager from "../manager/CacheManager";
import ErrCodeManager from "../manager/ErrCodeManager";
import ErrorCode from "../../game/sys/common/kakura/ErrorCode";
import MainModule from "../manager/MainModule";
import Client from "../common/kakura/Client";
import UserModel from "../../game/sys/model/UserModel";
import VersionManager from "../manager/VersionManager";
import PackageConfig from "../../game/sys/config/PackageConfig";
import GameSwitch from "../common/GameSwitch";
import GameConsts from "../../game/sys/consts/GameConsts";
import StorageCode from "../../game/sys/consts/StorageCode";
import ModelToServerMap from "../../game/sys/consts/ModelToServerMap";
import SingleCommonServer from "../server/SingleCommonServer";
import TableUtils from "../utils/TableUtils";
import ChannelConst from "../../game/sys/consts/ChannelConst";
import {InterstitialAdComp} from "./comp/InterstitialAdComp";
import {BannerComp} from "./comp/BannerComp";
import {JumpFunc} from "../func/JumpFunc";
import KariqiShareManager from "../manager/KariqiShareManager";
import GameUtils from "../../utils/GameUtils";
import Message from "../common/Message";
import CommonEvent from "../event/CommonEvent";
import TranslateFunc from "../func/TranslateFunc";
import WindowManager from "../manager/WindowManager";
import StatisticsManager from "../../game/sys/manager/StatisticsManager";
import StatisticsCommonConst from "../consts/StatisticsCommonConst";
import IMessage from "../../game/sys/interfaces/IMessage";
import ControlConst from "../consts/ControlConst";
import MsgCMD from "../../game/sys/common/MsgCMD";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import NativeBridge from "../native/NativeBridge";
import JSToNativeEvent from "../event/JSToNativeEvent";
import GameHttpControler from "../common/GameHttpControler";
import BattleFunc from "../../game/sys/func/BattleFunc";
import GlobalEnv from "../engine/GlobalEnv";
import DeviceTools from "../utils/DeviceTools";


export default class GamePlatform implements IMessage {
	//应用平台ID
	appId: string = "";

	//平台用户数据
	userInfoData: any = null;


	loginToken: string;

	//平台给的userid 唯一标识符
	channelUserId: string = "";
	protected _videoId: string;


	protected _isSubPackage: boolean = false;

	public _isPhotosAlbum: boolean = false;


	protected _loginCallback: any;
	protected _loginThisObj: any;

	public _shareId: any;
	public _shareExtraData: any;//记录当次分享的特殊参数
	public _shareCallback: any;
	public _shareThisObj: any;
	public _shareTime: number = 0;
	// 是否需要等3秒才判断分享成功
	public _shareNoWait: boolean;

	protected _speShareTime: number = 0;//用作记录特殊假分享的时间，第二次失败
	protected _speShareIntervalTime: number;
	protected _isLastSpeShare: boolean = false;//用来判断上次是否为特殊假分享二次失败

	protected _isShare: boolean = false;
	protected _videoAd;//视频广告实例，只有一个
	protected _videoBanner; //banner广告
	protected _videoLoaded: boolean = false;
	protected _videoSucCallback;
	protected _videoFailCallback;
	protected _videoThisObj;
	protected _extraData; //额外数据


	protected curReqGlobalCount: number = 0;
	protected maxReqGlobalCount: number = 5;

	public platformUserInfo: any;//global请求参数       "name": userInfo.nickName, "headImage": userInfo.avatarUrl, "sex": userInfo.gender(性别 0：未知、1：男、2：女), "province": userInfo.province, "city": userInfo.city, "country": userInfo.country
	protected isOutTime: boolean = false;//判断版本更新监听是否超时
	/**游戏圈按钮 */
	protected _gameClubBtn;

	/**阿拉丁数据打点 */
	aldSendEvent(eventId: string, eventData = {}) {
	}

	protected versionCheckResult: number = 1; // 0 未检查, 1 无新版本, 2 有新版本
	//剩余等待的任务数量,  当都完成时 就可以开始正式链接wss，目前只有一条
	protected _leftWaitTask: number = 2;


	/**隐藏到后台的时间 */
	public hideT: number;
	/**出现在前台台的时间 */
	public showT: number;

	public inviteBy: string = "";
	public shareInfo: string = "";
	public isPlayVideo: boolean = false;
	protected isDoWxThings: boolean = false;
	/**当前是否有可分享的剪辑视频 */
	public isHaveRecord: boolean = false;
	public loadAdvFailed: boolean = true;
	/**
	 * vivo平台视频广告只能显示一次。需要重新架子啊
	 */
	public advHasShow: boolean = false;
	public isHide = false;
	public listenTime;
	public mainToListen;

	/** 百度广告平台应用Id */
	public _appSid;

	protected _globalParams: any;

	// 系统信息
	protected systemInfo: any;

	protected _launchOptions: any;

	// 防沉迷信息
	protected antiAddtionInfo: any;
	//分享链接带进来的参数. 业务逻辑自行拿着这个参数做多态扩展 废弃inviteby和shareInfo字段
	public shareLinkParams: any;

	// 广告状态 0 是空闲状态, 1是播放中
	public videoState: number = 0;

	/**
	 * 客户端信息
	 */
	public cityName: any;
	protected clientInfoReqCount: number = 0;
	/** 审核服域名 */
	public global_url_review: string = '';

	//重登回来的参数
	protected _reLoginBackParams: any;

	//重登次数
	protected _reloginCount = 0;

	//子渠道
	public childChannelId: string;

	public RECORD_TYPE_AUTO = 1;//自动录屏
	public RECORD_TYPE_MANUAL = 2;//手动录屏

	tempPushDic = {};
	tempClearPushDic = {};

	constructor() {
		//设置低帧率模式
		this.setGameFrame();
		// 初始化渠道参数
		if (ChannelConst.getChannelConst(UserInfo.platformId).appId) {
			this.appId = ChannelConst.getChannelConst(UserInfo.platformId).appId;
		}
		if (ChannelConst.getChannelConst(UserInfo.platformId).adVideoId) {
			this._videoId = ChannelConst.getChannelConst(UserInfo.platformId).adVideoId;
		}
		if (GameSwitch.getSwitchState(GameSwitch.VIDEO_ID)) {
			this._videoId = GameSwitch.getSwitchState(GameSwitch.VIDEO_ID)
		}
		if (ChannelConst.getChannelConst(UserInfo.platformId).appSid) {
			this._appSid = ChannelConst.getChannelConst(UserInfo.platformId).appSid;
		}
		if (UserInfo.isSystemNative()) {
			var adapterData = {
				width: ScreenAdapterTools.width,
				height: ScreenAdapterTools.height,
				designWidth: ScreenAdapterTools.designWidth,
				designHeight: ScreenAdapterTools.designHeight,
				scale: ScreenAdapterTools.height / ScreenAdapterTools.stageHeight
			}
			NativeBridge.instance.callNative(JSToNativeEvent.VIEWADAPTER_INIT, adapterData, true)
		}


	}

	/**
	 * 初始化平台信息
	 */
	initPlatform() {
	}


	reqServerList(callBack: Function, thisObject: any) {
		var params: any = {"method": 251, "params": {"loginToken": this.loginToken}};
		var url = GlobalData.global_url + '&ver=' + GlobalData.version;
		HttpMessage.instance.send(url, JSON.stringify(params), (data) => {
			var secList: any[] = data[0].result.data.secList;
			var len: number = secList.length;
			var pData: any;
			for (var i: number = 0; i < len; i++) {
				var secData: any = data[0].result.data.secList[i];
				if (secData.mainSec == 1) {
					pData = data[0].result.data.secList[i];
					break;
				}
			}
			PackConfigManager.ins.platform = pData;
			callBack && callBack.call(thisObject, data[0].result.data)
		}, this, "post");
	}

	/**
	 * 请求VMS
	 * @param callBack
	 * @param thisObject
	 */
	/**
	 * 请求VMS
	 * @param callBack
	 * @param thisObject
	 */
	reqVMS(): void {
		GlobalData.version = PackConfigManager.ins.platform.vms_version
		if (GlobalData.checkUserCloudStorage()) {
			GlobalData.global_url = PackConfigManager.ins.platform.cloud_url
			//如果是单机模式 直接走global登入
			this.getWxInfo();
			return;
		}
		//如果是正式版 直接checkVersion
		if (PackageConfig.configData) {
			this.checkVersion()
		} else {
			var url = PackConfigManager.ins.platform.vms_url + '?mod=vms&r=gameApi/getOnlineVersion&upgrade_path=' + PackConfigManager.ins.platform.upgrade_path;
			HttpMessage.instance.send(url, null, this.checkVMSBack, this);
		}
	}

	//版本检查回来
	private checkVMSBack(result) {
		var version = result.online_version;
		LogsManager.echo("online_version:", version, "local vms_version", PackConfigManager.ins.platform.vms_version)
		LogsManager.echo("client_version:", GlobalData.client_version);
		version = Math.max(version, PackConfigManager.ins.platform.vms_version)
		PackConfigManager.ins.platform.vms_version = version;
		this.checkVersion();

	}

	/**
	 * 检查版本号
	 */
	private checkVersion() {
		var url = PackConfigManager.ins.platform.vms_url + '?mod=vms&r=gameApi/checkVersion&ver=' + PackConfigManager.ins.platform.vms_version;
		HttpMessage.instance.send(url, null, this.checkVersionCallback, this);
	}

	private checkVersionCallback(result: any) {
		LogsManager.echo(null == undefined, "___null undefined")
		// 如果返回值没有s 状态字段
		if (result.s == null || !result.global_server_url || !result.v.version) {
			LogsManager.errorTag(null, JSON.stringify(result));
			ErrCodeManager.ins.setErr(ErrorCode.sys_error);
			return;
		}

		if (result.global_server_url.indexOf("http://") > -1 || result.global_server_url.indexOf("https://") > -1) {
			GlobalData.global_url = result.global_server_url;
		} else {
			GlobalData.global_url = "http://" + result.global_server_url;
		}
		if (result.GameStatic) {
			//version里面的开关覆盖
			this.coverServerSwitchMap(result.GameStatic)
		}
		GlobalData.resource_url = result.resource_url_root + "/" + UserInfo.platformId + "/";
		;
		GlobalData.nocdn_resource_url = result.nocdn_resource_url_root + "/";

		// 记录版本状态 (代码更新是否重启、是否下载version.json时用)
		VersionManager.versionStatus = result.s;
		VersionManager.vmsVersion = result.v.version;
		if (result.s == VersionManager.VERSION_STATUS_FORCE_UPDATE) {
			// 强更使用vms版本
			// GlobalData.version = result.v.version;
			this.doCoverVersion(result.v.version);
		}

		LogsManager.echo("GlobalData.version:", GlobalData.version, "localVersion:", PackConfigManager.ins.platform.vms_version, "updateSatus:", result.s);

		this.addUpdateListener();

		//联网模式也需要执行卡日曲登录
		KariqiShareManager.kariquLogin();
	}

	//对应平台版本更新检查 默认是不做的 暂时只有微信处理 微信平台需要重写这个方法
	public addUpdateListener() {
		this.getNetwork();
		//版本更新检查完毕后开始初始化资源
		MainModule.instance.checkSystem();
	}


	reqGlobal(params: any, isInit: boolean = false) {
		this._reloginCount++;
		var url = GlobalData.global_url + '&ver=' + GlobalData.version;
		//@测试代码 强制服务器错误返回
		// if(this._reloginCount <= 1){
		//     params.method = "208"
		// }
		this._globalParams = params;
		if (!params["params"]) {
			params["params"] = {};
		}


		var onHttpErrorBack = (data) => {
			if (GlobalData.checkUserCloudStorage()) {
				//如果是使用httpServer的重连.那么必须要强制登入成功
				if (this._reLoginBackParams) {
					WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("tid_net_error"), this.getWxInfo, this)
				} else {
					this.doSingleErrorBack();
				}

			} else {
				ErrCodeManager.ins.setErr(ErrorCode.sys_error);
			}
		}

		var httpBackFunc = (data) => {


			if (!data || typeof (data) == "string" || !data[0]) {
				onHttpErrorBack(data);
				return;
			}


			var currPlatform: any = data[0];
			data = currPlatform.result.data;
			if (currPlatform.serverInfo && currPlatform.serverInfo.serverTime) {
				Client.instance.updateServerTime(currPlatform.serverInfo.serverTime)
			}
			if (this._reLoginBackParams) {
				this.onReLoginBack(data);
				return;
			}
			//阿拉丁上报openid
			LogsManager.echo('=====================ald相关');
			if (UserInfo.isWX() && data.channelUserId) {
				// LogsManager.echo("ald上报OpenId:", data.channelUserId);
				// this.getWX().aldSendOpenid(data.channelUserId);
			}
			if (data.sceneId) {
				GlobalData.sceneId = data.sceneId;
			}

			if (!currPlatform.result) {
				onHttpErrorBack(data)
				return;
			}

			if (data.adParam) {
				if (data.adParam.appId) {
					// 由于之前未考虑多平台oppoAppId改为appId
					this.appId = data.adParam.appId;
				}
				if (data.adParam.adUnitId) {
					this._videoId = data.adParam.adUnitId;
				}
				if (data.adParam.adBannerId) {
					BannerComp._bannerId = data.adParam.adBannerId;
				}
				if (data.adParam.adInterstitialId) {
					InterstitialAdComp._interstitialId = data.adParam.adInterstitialId;
				}
			}

			this.loginToken = data.loginToken;

			if (GlobalData.checkUserCloudStorage()) {
				GameHttpControler.instance.loginToken = data.loginToken;
				this.doSingleGlobalBack(currPlatform.result.data);
				return;
			}

			//是否是新账户
			if (currPlatform.result.data["isNewAccount"]) {
				UserInfo.isNewAccount = true;
			}

			//wx是开发还是体验还是正式版
			if (UserInfo.isWX()) {
				UserInfo.wxVersionType = data.version_type;
			}


			var secList: any[] = data.secList;
			var len: number = secList.length;
			var pData: any;
			for (var i: number = 0; i < len; i++) {
				var secData: any = secList[i];
				if (secData.mainSec == 1) {
					pData = secList[i];
					break;
				}
			}

			if (!pData) {
				LogsManager.errorTag("globalServerError", "global请求异常");
				WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#tid_net_error"), this.onGlobalError, this);
				return
			}
			PackConfigManager.ins.platform = pData;


			this.getLoginResult();
		}


		var webParams: any = {}
		if (GlobalData.checkUserCloudStorage()) {
			url = GlobalData.global_url
			params.params.game = GameConsts.gameCode;
			params.params.platform = PackConfigManager.ins.platform.platform
			params.params.version = GlobalData.version;
			webParams.errorCall = onHttpErrorBack;
		} else {
			params.params.game = GameConsts.gameCode;
			params.params.platform = PackConfigManager.ins.platform.platform
			params.params.version = GlobalData.version;
		}


		params["params"]["deviceId"] = GlobalData.deviceId;
		HttpMessage.instance.send(url, params, httpBackFunc, this, "post", webParams);

	}

	//重登回来
	private onReLoginBack(data) {
		GameHttpControler.instance.loginToken = data && data.loginToken;
		LogsManager.echo("data.loginToken", data.loginToken)
		var params = this._reLoginBackParams;
		this._reLoginBackParams = null
		params.callBack.call(params.thisObj, data);

	}

	//global请求失败后重新请求
	private onGlobalError() {
		this.reqGlobal(this._globalParams);
	}

	/**globa请求完成后执行下一步 */
	public getLoginResult() {
	}

	public sendKakuraInit() {
		//单机模式不走这里
		if (GlobalData.checkUserCloudStorage()) {
			if (this.platformUserInfo) {
				var userData = UserModel.instance.getData();
				//如果授权成功了
				if (this.platformUserInfo.name) {
					userData.name = this.platformUserInfo.name;
					userData.userInfo = this.platformUserInfo;
					UserInfo.userSex = this.platformUserInfo.sex;
				}
			}
			return
		}
		var myThis = this;
		Client.instance.sendInit(myThis.loginToken,
			myThis.platformUserInfo,
			MainModule.instance.loginResult,
			MainModule.instance,
			myThis.inviteBy,
			myThis.shareInfo);
	}

	//重新登入
	public reRequestGlobal(callBack: any = null, thisObj: any = null) {
		if (callBack) {
			this._reLoginBackParams = {
				callBack: callBack,
				thisObj: thisObj
			}
		}
		//如果是微信平台 这里需要重新走一次微信登入
		this.getWxInfo();
	}


	//单机模式error返回
	protected doSingleErrorBack() {

		//如果次数为0
		if (this._reloginCount == 1) {
			LogsManager.echo("第一次登入失败尝试重新登入")
			this.getWxInfo();
			return
		}
		//做空数据回调. 这时候会优先判断本地是否有数据
		this.doSingleGlobalBack({sendTime: 0, uid: "nologin"}, true)

	}

	//单机模式global返回 isError 是否error返回
	protected doSingleGlobalBack(data, isError = false) {

		//如果是审核服版本 那么重新发送一次globalsever
		if (data.switch) {
			this.coverServerSwitchMap(data.switch);
			if (data.switch.CLOUD_URL && (UserInfo.platform.global_url_review == "" || UserInfo.platform.global_url_review != data.switch.CLOUD_URL)) {

				// GlobalData.global_url_review 用于记录审核服主域名【用于区别负载域名】
				UserInfo.platform.global_url_review = GlobalData.global_url = data.switch.CLOUD_URL
				//重新走一次登入
				this.reqGlobal(this._globalParams);
				return;
			}
			if (data.switch.FORCE_UPDATE) {
				VersionManager.versionStatus = Number(data.switch.FORCE_UPDATE);
			}
		}

		// 登陆返回重置global域名
		if (data.lvsUrl && data.lvsUrl != "") {
			GlobalData.global_url = data.lvsUrl;
		}
		//做版本更新检查
		this.doCoverVersion(data.onlineVersion);


		var isFirstLogin = Client.instance.globalLoginBackData == null;
		var resultData = data;
		Client.instance.hasLoginComplete = !isError;
		Client.instance.globalLoginBackData = resultData;


		//设置用户openId
		if (resultData.channelUserId) {
			UserInfo.channelUserId = resultData.channelUserId;
		}
		//卡日曲登录
		KariqiShareManager.kariquLogin();

		//如果是调试开关的
		if (data && ((data.user && data.user.isTestAccount) || data.isTestAccount)) {
			//显示日志窗口
			LogsManager.sendErrorToPlatform("发送客户端错误日志", LogsManager.errorTage_clientLog, 200, "sendClientError");
			LogsManager.setLogGroupVisible(true);
		}

		if (data != null && this.checkHasUserData(data.user)) {
			this.checkHasUpdateData(data.user);
		}
		//首次登入 需要做的事情
		if (isFirstLogin) {
			//开始版本更新检查
			this.addUpdateListener();
		} else {
			//如果没有错误 那么需要同步一下rid
			if (!isError) {
				var userdata = UserModel.instance.getData()
				if (userdata) {
					userdata.uid = data.uid
					userdata._id = data.uid
				}
			}
			//走重登回来
			Client.instance.onReloginBack(data, isError);
		}

	}

	//判断是否有用户数据
	private checkHasUserData(userData: any) {
		if (!userData) {
			return false;
		}
		if (userData.uid || userData.sendTime != null) {
			return true
		}
		;
		return false;
	}

	//比对数据
	public compareData(data) {
		if (!GlobalData.checkUserCloudStorage()) {
			return;
		}

		var localData = CacheManager.instance.getGlobalCache(StorageCode.storage_userinfo)
		if (!localData || localData == "0") {
			//如果服务器有数据了 但是本地没数据 那么直接用服务器的
			// if (data.user &&  (data.user.rid || data.user._id) ) {
			if (this.checkHasUserData(data.user)) {
				localData = data.user;
				LogsManager.echo("_线上服务器有数据,本地没数据");
				// LogsManager.errorTag("dataSync","_线上服务器有数据,本地没数据", JSON.stringify(data));
			} else {
				localData = ModelToServerMap.initBuildUserData();
			}
			//如果没有发送时间  那么初始化时间
			if (!localData.sendTime) {
				localData.sendTime = 0;
			}
			//如果没数据 那么记录上次保存的时间为0
			// localData = ModelToServerMap.initBuildUserData();
		} else {
			try {
				localData = JSON.parse(localData);
			} catch (e) {
				localData = ModelToServerMap.initBuildUserData();
			}
		}
		var userData = data.user;
		if (this.checkHasUserData(userData)) {
			this.checkHasUpdateData(userData);
			var deleteData = TableUtils.findNullKey(userData, {});
			// 检查服务器是否有null字段
			if (!TableUtils.isEmptyTable(deleteData)) {
				var params = {
					clientDirty: {u: {}, d: deleteData}
				}
				Client.instance.send("349", params, null, null);
				LogsManager.errorTag("dataNullValue", "玩家数据有空字段," + TableUtils.safelyJsonStringfy(deleteData));
			}


		} else {
			userData = localData;
		}


		if (!localData.sendTime) {
			localData.sendTime = 0;
		}
		SingleCommonServer._lastBackUpData = {}
		TableUtils.deepCopy(userData, SingleCommonServer._lastBackUpData);
		if (userData.sendTime < localData.sendTime) {
			var isUserLocalData = true
			if (userData.sendTime > 0 && localData.sendTime > 0) {
				var dt = localData.sendTime - userData.sendTime;
				//如果这个时间 异常 用服务器数据
				if (dt > 1 * 365 * 24 * 3600) {
					LogsManager.errorTag("userDataError", "用户时间戳错误,", localData.sendTime);
					isUserLocalData = false;
				}
			}

			LogsManager.warn("userData:", "本地缓存的数据比服务器的数据新,采用本地数据");
			if (isUserLocalData) {
				userData = localData;
			}

		}
		TableUtils.adjustEmptyArr(userData);
		//uid 和 isNewAccount赋值
		userData.uid = data.uid
		userData._id = data.uid
		userData.isNewAccount = data.isNewAccount;
		//
		var resultData = data;
		resultData.user = userData
		if (!userData.firstRunSystemInfo) {
			userData.firstRunSystemInfo = GlobalData.firstRunSystemInfo;
		} else {
			GlobalData.firstRunSystemInfo = userData.firstRunSystemInfo;
		}

		// kakura.Client.instance.hasLoginComplete = !isError;
		// kakura.Client.instance.globalLoginBackData = resultData;

		// if (!hasUpdateData) {
		//     var tmpTable = {};
		//     TableUtils.deepCopy(userData, tmpTable)
		//     tmpTable["hasUpdateData"] = true;
		//     SingleCommonServer.upDateAllData(tmpTable, SingleCommonServer.setUpdateDataFlag, SingleCommonServer);
		// }

		if (resultData.switch && !GlobalData.checkIsSingleMode()) {
			this.coverServerSwitchMap(resultData.switch);
		}

	}

	private checkHasUpdateData(userData) {
		var hasUpdateData;
		if (userData && userData.uid) {
			hasUpdateData = userData.hasUpdateData;
		} else {
			hasUpdateData = false;
		}
		SingleCommonServer.hasUpdateAllData = hasUpdateData;
	}


	//覆盖版本号
	protected doCoverVersion(serverVersion: string) {
		if (!serverVersion) {
			return;
		}
		GlobalData.version = String(serverVersion);
	}


	//获取version name
	public getVersionName() {
		return "version.json";
	}


	/**
	 * 请求公告数据
	 * @param callBack
	 * @param thisObject
	 */
	getWX(): any {
		return ControlConst.emptyTable
	}

	registerAd() {
	}


	/**移除微信登陆授权按钮 */
	removeLoginBtn() {
	}

	createSpeLoginBtn(posX: number, posY: number, btnW: number, btnH: number, callBack: Function, thisObject: any) {


		var tempFunc = () => {
			if (callBack) {
				// callBack.call(thisObject,-1);
				callBack.call(thisObject, {userInfo: {nickName: UserInfo.channelUserId}});
			}
		}
		//非授权界面 直接2秒后授权成功
		LogsManager.echo("xd 没有授权系统,直接2秒后授权成功")
		TimerManager.instance.add(tempFunc, this, 2000, 1);


	}

	setSystemInfo() {
	}

	//设置系统信息
	getSystemInfo(): any {
	}

	getLaunchOptionsSync(callback, thisObj) {
		callback.call(thisObj)
	}

	getWxInfo() {
	}

	/** 初始化平台数据:广告、分享等 */
	initPlatformData() {
	}

	/**获取网络状态 */
	getNetwork() {
	}

	sharePage() {
	}

	showVideoAd(successCallBack: any = null, closeCallBack: any = null, thisObj: any = null, extraData = {}) {
	}

	loadVideoAd() {
	}


	/**设置用户来源 */
	setUserComeFrom() {
	}

	createLoginButton(callBack?, thisObject?) {
		callBack && callBack.call(thisObject)
	}

	/**
	 * 用户登录
	 */
	login(type: string): void {
	}

	/**
	 * 退出游戏
	 */
	loginOut(): void {
		GlobalData.isGameDestory = true
	}

	/**
	 * 分享
	 * @param
	 */
	share(id: any = "", extraData: any = {}, callback: Function = null, thisObj: any = null): void {
	}

	shareDynamicAppMessage(data, shareCallBack, activityId) {
	}

	onShareComplete(shareResult) {
	};

	/**
	 * 发送到桌面
	 */
	sendToDesktop(callback): void {
	}

	/**
	 * 支付接口
	 * @param id
	 * @param name
	 * @param price
	 * @param count
	 * @param type
	 */
	pay(id: any, name: string, price: number, count: number, type: number): void {
	}


	registerRecord() {
	}

	recordStart(callback: Function = null, thisObj: any = null, endCallback: Function = null, durT: number = 120, recordTimeRange: any = null, recordType = this.RECORD_TYPE_AUTO) {
	}

	/**结束录屏 */
	recordStop(recordType = this.RECORD_TYPE_AUTO) {
	}

	/**对剪辑的视频进行分享 */
	shareVideo(callBack: Function = null, thisObj = null) {
	}

	recordPause() {
	}

	recordResume() {
	}

	/** 头条创建互推按钮 */
	createMoreGamesButton() {
	}

	/** 头条显示互推列表 */
	showMoreGamesModal(data = null) {
	}

	jumpToPayXCX(data, succCall = null, failCall = null, thisObj = null) {
	}

	/**是否有可分享的录屏 */
	//改变剩余的任务数，目前只有一条，
	protected changeLeftTask(value, tag: string = null) {
		this._leftWaitTask += value;
		LogsManager.echo("yrc changeLeftTask", value, this._leftWaitTask, tag);
		if (this._leftWaitTask == 0) {
			this.getUserInfoAndReq();
		}
	}

	isCanShareVideo() {
		return false
	}


	//初始化平台用户id
	initChannelUserId(cuid: string) {
		if (!cuid) {
			LogsManager.errorTag(null, "没有设置uid");
			return;
		}
		this.channelUserId = cuid;
		//通知缓存管理器设置rid
		CacheManager.instance.setRid(cuid);
	}

	/**获取用户设置、信息，执行kakura init */
	protected getUserInfoAndReq() {

	}

	/**
	 * 震动效果
	 * isLong 是否为长震动，true为长震动，false为短震动
	 * callback内带参数isSuc,表示接口调用的结果
	 */
	vibrate(isLong: boolean = false, callBack: Function = null, thisObject: any = null) {
		callBack && callBack.call(thisObject, true);
	}

	/**执行count次的短震 */
	vibrateByCount(count: number) {
		var myThis = this;
		var index = 0;
		var obj = {count: count, index: index};
		myThis.vibrate(false);
		index++;
		if (count <= 1) {
			return;
		}
		TimerManager.instance.add(function () {
			myThis.vibrate(false);
			index++;
			if (index >= count) {
				TimerManager.instance.removeByObject(obj);
			}
		},obj)
	}


	setVersionCheckResult(num) {
		this.versionCheckResult = num;
		LogsManager.echo("versionCheckResult:", num);
	}

	getVersionCheckResult() {
		return this.versionCheckResult;
	}


	//转化渠道用户信息
	public turnChannelUserInfo(userInfo) {
		this.platformUserInfo = {
			"name": userInfo.nickName,
			"headImage": userInfo.avatarUrl,
			"sex": userInfo.gender,
			"province": userInfo.province,
			"city": userInfo.city,
			"country": userInfo.country
		};
		var userData = UserModel.instance.getData();
		//如果授权成功了
		if (this.platformUserInfo.name) {
			userData.name = this.platformUserInfo.name;
			userData.userInfo = this.platformUserInfo;
			UserInfo.userSex = this.platformUserInfo.sex;
		}
	}


	//设置游戏帧率
	setGameFrame() {
		//初始化battklefunc 帧率相关数据
		if (BattleFunc["initFrameDates"]) {
			BattleFunc["initFrameDates"]();
		}

	}


	/**测试同步获取系统信息 */
	testSystemInfoSync() {
	}

	/**显示游戏圈按钮 */
	showGameClubBtn(posX: number, posY: number, btnW: number, btnH: number) {
	}

	hideGameClubBtn() {
	}

	destroyGameClubBtn() {
	}


	/**打开客服 */
	openCustomerService(isShowCard: boolean = false) {
	}

	/**显示模态对话框，即弹窗 */
	showPopTip(title: string, content: string, extraData = null) {

		var onSureBack = (rt) => {
			extraData.success.call(null, rt)
		}
		var onCancleBack = (rt) => {
			extraData.success.call(null, rt)
		}

		WindowManager.setPopupTip(2, content, onSureBack, this, title, onCancleBack);


	}

	/**显示消息提示框 */
	showFlyTip(title: string, icon: string = "none") {
	}


	/**
	 * 调用wx系源生接口，只做加载即完成后的回调
	 * @param packageName 需要加载的分包名
	 * @param callback 加载完成后的回调，成功传true，失败传false
	 * @param thisObj
	 * @param isShowPop 加载失败是否弹出弹窗，继续加载
	 */
	loadSubPackage(packageName: string, callback: Function, thisObj: any, isShowPop: boolean = false) {
	}

	/**跳转到其他小程序 */
	jumpToMiniProgram(data: any) {
	}

	initPhysics3D(message) {
		MainModule.instance.changeShowMainTask(-1, MainModule.task_subpackage, "not use physics");
	}


	/**
	 * 对比版本号
	 */
	public compareVersion(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)

		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}

		for (var i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])

			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}

		return 0
	}

	/**
	 * 是否可以开启互推功能，各平台自己添加判断。默认互推关闭
	 */
	canUseJump() {
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHOWJUMP)) {
			LogsManager.echo('hlx 互推禁用：互推开关关闭');
			return false;
		}

		if (UserInfo.isOppo() && GameSwitch.checkOnOff(GameSwitch.SWITCH_OPPO_REVIEW)) {
			LogsManager.echo('hlx 互推禁用：审核模式无互推');
			return false;
		}

		if (!(UserInfo.isTT() || UserInfo.isWX() || UserInfo.isBaidu()) || UserInfo.isOppo()) {
			LogsManager.echo('hlx 互推禁用：该平台不支持互推');
			return false;
		}

		if (UserInfo.isTT()) {
			if (!this.getWX().showMoreGamesModal) {
				LogsManager.warn("hlx 头条互推禁用 showMoreGamesModal not support");
				return false;
			}

			if (UserInfo.platform.getSystemInfo().platform == "ios") {
				LogsManager.echo('hlx 头条互推禁用：IOS不支持头条互推');
				return false
			}

			if (JumpFunc.instance.getJumpList().length == 0) {
				LogsManager.warn("hlx 头条互推禁用 互推Jump表未配置，请联系管理员配置");
				return false;
			}
		} else if (UserInfo.isBaidu()) {
			if (JumpFunc.instance.getJumpList().length == 0) {
				LogsManager.warn("hlx 百度互推禁用 互推Jump表未配置，请联系管理员配置");
				return false;
			}
		}

		return true;
	}

	/** 添加到桌面 */
	addToDesktop(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
	}

	/** 添加到桌面 */
	addToFavorite(thisObj = null, successCall = null, failCall = null, channelParams = {}) {
	}

	/**
	 * 添加到桌面功能是否可用
	 */
	public canAddToDesktop() {
		if (!(UserInfo.isQQGame() || UserInfo.isBaidu() || UserInfo.isOppo() || UserInfo.isVivo())) {
			LogsManager.echo('hlx 添加到桌面功能禁用：该平台不支持添加到桌面功能');
			return false;
		}

		if (this.getSystemInfo().platform && (this.getSystemInfo().platform == "ios" || this.getSystemInfo().platform == "devtools")) {
			LogsManager.echo('hlx 添加到桌面功能禁用：IOS不支持');
			return false
		}

		if (UserInfo.isQQGame()) {
			if (!this.getWX().saveAppToDesktop) {
				LogsManager.echo('hlx 添加到桌面功能禁用：saveAppToDesktop不支持');
				return false
			}
		} else if (UserInfo.isBaidu()) {
			if (typeof (this.getWX().showAddToDesktopGuide) != 'function') {
				LogsManager.echo('hlx 添加到桌面功能禁用：showAddToDesktopGuide不支持');
				return false
			}
		} else if (UserInfo.isOppo() || UserInfo.isVivo()) {
			if (!this.getWX().installShortcut) {
				LogsManager.echo('hlx 添加到桌面功能禁用：installShortcut不支持');
				return false
			}
		}

		return true;
	}

	/**
	 * 是否可以使用添加到小程序接口
	 */
	public canAddToFavorite() {
		if (!UserInfo.isBaidu()) {
			LogsManager.echo('hlx 添加到桌面功能禁用：该平台不支持添加到桌面功能');
			return false;
		}

		if (this.getSystemInfo().platform == "devtools") {
			LogsManager.echo('hlx 添加到桌面功能禁用：开发者工具无此功能');
			return false;
		}

		if ((typeof (this.getWX().showFavoriteGuide) != 'function')) {
			return false;
		}
		return true;
	}

	/**是否可以创建开放域 目前只有qq和微信可以，其余平台暂定，等接入时再测试 */
	canCreateDisPlayPbject() {
		if (UserInfo.isWX() || UserInfo.isQQGame()) return true;
		return false;
	}

	/**
	 * 创建开放域
	 */
	createDisplayObject(type, width, height, x = 0, y = 0): any {
	};

	/**是否可以设置玩家数据 */
	canSetRankInfo() {
		if (UserInfo.isWX() || UserInfo.isQQGame()) return true;
		return false;
	}

	/**
	 * 设置玩家数据
	 */
	setUseRankInfo(data) {
	}

	/**
	 * 是否从小程序收藏进入
	 * 需要子平台重写判断各自场景值
	 */
	isFromFavourite() {
		return true;
	}

	/**
	 * 判断是否可以显示视频
	 */
	public canAdv() {
		if (!GameUtils.canVideo) {
			return false;
		}
		if (UserInfo.isWeb()) return true;
		if (!this._videoId && !UserInfo.isUC()) {
			return false;
		}

		return true;
	}

	/**
	 * 判断是否可以分享录屏
	 */

	private _canShareVideoRt = null;

	public canShareVideo() {
		// 分享开关开启
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHAREVIDEO)) {
			LogsManager.echo("hlx 录屏功能禁用: 开关关闭");
			return false;
		}

		if (this._canShareVideoRt == null) {
			if (!UserInfo.isTT() && !UserInfo.isBaidu()) {
				LogsManager.echo("hlx 录屏功能禁用: 该平台不支持录屏");
				this._canShareVideoRt = false;
				return false;
			}
			if (UserInfo.isBaidu()) {
				var systemInfo = UserInfo.platform.getSystemInfo()
				if (systemInfo.host && systemInfo.host != 'baiduboxapp') {
					// 只有手机百度app有分享录屏功能。
					LogsManager.echo("hlx 录屏功能禁用: 百度渠道只有手百支持录屏", systemInfo.host);
					this._canShareVideoRt = false;
					return false;
				}
			}
			this._canShareVideoRt = true
		}

		return this._canShareVideoRt;
	}

	/**
	 * 判断是否可以分享
	 */
	public canShare() {
		if (UserInfo.isBaidu() || UserInfo.isTT() || UserInfo.isOppo() || UserInfo.isVivo()) {
			LogsManager.echo("hlx 分享功能禁用: 该平台不开启分享功能：");
			return false;
		}
		// 分享开关开启
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHARE_NEW)) {
			LogsManager.echo("hlx 分享功能禁用: 分享开关关闭");
			return false;
		}
		return true;
	}

	/**
	 * 弹出防沉迷弹窗
	 */
	showAntiAddtionView() {
		return false;
	}

	/**
	 * 获取系统信息
	 */
	getLaunchOptions() {
		if (!this._launchOptions) {
			if ('function' == typeof this.getWX().getLaunchOptionsSync) {
				this._launchOptions = this.getWX().getLaunchOptionsSync();
				//通过订阅消息卡片进入游戏打点
				if (this._launchOptions.scene == "1014") {
					StatisticsManager.ins.onEvent(StatisticsCommonConst.SUBSCRIBE_JOIN_GAME, {
						msgId: this._launchOptions.query.msgId,
					});
				}
				LogsManager.echo('_launchOptions', JSON.stringify(this._launchOptions));
			} else {
				LogsManager.echo('该平台不支持 getLaunchOptionsSync');
			}
		}
		return this._launchOptions;
	}

	/** 设置loading条进度：OPPO */
	setLoadingProgress(num) {
	}

	/** 隐藏laoding条：OPPO */
	hideLoadingProgress() {
	}

	/**
	 * 加载视频成功后回调
	 */
	afterVideoLoadCallBack() {
	}

	/**
	 * 初始化客户端IP信息
	 */
	initCityName() {
		// 除微信平台其他平台不需要初始化IP信息
		if (!UserInfo.isWX()) {
			return;
		}

		if (!GameConsts["OPEN_IP_LIST"]) {
			return;
		}

		if (this.cityName) {
			LogsManager.echo("hlx clientInfo已经初始化完毕，无需重复初始化", JSON.stringify(this.cityName));

		} else {
			var url = "https://pv.sohu.com/cityjson?ie=utf-8";
			HttpMessage.instance.sendOtherHttpRequest(url, null, this.initCityNameCallBack, this, "get", {
				errorCall: this.initCityNameErrorCallBack,
				contentType: "application/json"
			})
		}
		return;
	}

	protected initCityNameCallBack(data) {
		try {
			var isSuc = false;
			if (data) {
				var matchResult = data.match(/{.*}/);
				if (matchResult[0]) {
					var jsonArray = JSON.parse(matchResult[0]);
					if (jsonArray.cname) {
						UserInfo.platform.cityName = jsonArray.cname;
						isSuc = true;
						Message.instance.send(CommonEvent.GET_IPINFO_SUCCESS);
					}
				}
			}
			if (!isSuc) {
				UserInfo.platform.clientInfoReqCount++;
				if (UserInfo.platform.clientInfoReqCount >= 5) {
					LogsManager.echo("hlx 获取IP所在城市5次重试错误，跳过", data);
				} else {
					LogsManager.echo("hlx 获取IP所在城市格式有误，重试", UserInfo.platform.clientInfoReqCount, data);
					UserInfo.platform.initCityName();
				}
			}
		} catch (e) {
			LogsManager.errorTag("get_cityname_error", e.toString());
		}
	}

	protected initCityNameErrorCallBack(error) {
		try {
			UserInfo.platform.clientInfoReqCount++;
			if (UserInfo.platform.clientInfoReqCount >= 5) {

				LogsManager.echo("hlx 获取IP所在城市5次重试错误，跳过", UserInfo.platform.clientInfoReqCount, error.toString());

				Message.instance.send(CommonEvent.GET_IPINFO_FAIL);
				return;
			} else {
				UserInfo.platform.initCityName();
			}
		} catch (e) {
			LogsManager.errorTag("get_cityname_error", e.toString());
		}
		return;
	}


	//判断是否授权了
	public isAuthorized() {
		var data = UserModel.instance.getData();
		var uInfo = data.userInfo
		//这里微信平台做下特殊判断 兼容遗留的bug
		if (uInfo && uInfo.name) {
			if (UserInfo.isWX()) {
				var name: string = uInfo.name;
				//如果用户名 是微信openid .那么把这个数据修复 .返回失败
				if (name.match("^oE7B")) {
					return false;
				}
			}

			return true;
		}
		return false;
	}

	requestSubscribeMessage(tmpIds, successCall, failCall, completeCall) {
	}

	//注册焦点事件
	protected registFocusEvent() {
		this.hideT = Client.instance.miniserverTime
		this.showT = this.hideT;
		// GlobalEnv.uiRoot.on(Laya.Event.FOCUS, this, this.onGetFocus);
		// GlobalEnv.uiRoot.on(Laya.Event.BLUR, this, this.onLoseFocus);
	}

	//获取游戏焦点
	protected onGetFocus() {
		LogsManager.echo("获取焦点");
		this.isHide = false;
		this.showT = Client.instance.miniserverTime
		Message.instance.send(MsgCMD.GAME_ONSHOW);
		StatisticsManager.ins.onEvent(StatisticsCommonConst.ON_SHOW);
		StatisticsManager.addLoadingOutTime(this.showT - this.hideT);
	}

	//失去游戏焦点
	protected onLoseFocus() {
		this.isHide = true;
		this.hideT = Client.instance.miniserverTime
		LogsManager.echo('>>OnHide成功回调', this.hideT);
		Message.instance.send(MsgCMD.GAME_ONHIDE);
		// 发送阿里云打点日志
		StatisticsManager.ins.onEvent(StatisticsCommonConst.ON_HIDE, {
			'onlineTime': this.hideT - this.showT,
			'hideView': GameUtils.decryptStr(WindowManager.getCurrentWindowName())
		});
	}

	//是否是套壳包
	public isCasingPackage() {
		return false;
	}

	public getChildChannelKey() {
		//如果是套壳包 
		if (this.isCasingPackage()) {
			return "other";
		} else {
			return "main";
		}
	}

	//获取游戏包名
	public getPackageName() {
		return "qhmx." + GameConsts.gameCode + ".game"
	}

	recvMsg(cmd: string, data: any) {

	}

	onAccelerometerChange() {
	}

	accelerometerClear(x) {
	}

	accelerometerPause() {
	}

	/*
	* 注册推送事件
	*/
	pushMessage(delay, id, title?, subTitle?, body?, repeats = false) {
	}

	clearPushMessage(id) {
	}

	inAppPurchase(productId, amount, orderId, callbackUrl) {
	}


	public  coverServerSwitchMap(map){
		for (var i in map) {
			GameSwitch._switchMap[i] = map[i];
		}
		LogsManager.setLogGroupVisible(GameSwitch.checkOnOff(GameSwitch.SWITCH_LOG_PANEL));
		DeviceTools.checkBySwitch();

		var channelData = ChannelConst.getChannelConst(UserInfo.platformId);
		//这里做定向覆盖包数据.
		if (map[GameSwitch.VIDEO_ID]) {
			channelData.adVideoId = map[GameSwitch.VIDEO_ID]
		}
		if (map[GameSwitch.BANNER_ID]) {
			channelData.adBannerId = map[GameSwitch.BANNER_ID]
		}
		if (map.TTADSDK_ID) {
			channelData.appSid = map.TTADSDK_ID
		}

		//全屏视频id
		if (map.FULLVIDEO_ID) {
			channelData.adFullVideoId = map.FULLVIDEO_ID
		}

		//GM开关
		LogsManager.checkGM();
		GameUtils.canShare = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHARE_NEW);
		GameUtils.canVideo = !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ADV);
		GameUtils.isReview = GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_REVIEW);
		for (i in map) {
			LogsManager.echo("服务器返回的开关覆盖结果   ", i, " : ", map[i]);
		}
		var frameRate = GameSwitch.getSwitchState(GameSwitch.SWITCH_GAME_FRAME_RATE)
		//var frameRate = "60"
		if (frameRate && frameRate != "0") {
			var targetRate = Number(frameRate);
			if (GameConsts.gameFrameRate != targetRate) {
				GameConsts.gameFrameRate = targetRate
				LogsManager.echo("设置游戏帧率:", frameRate);
				UserInfo.platform.setGameFrame();
			}

		}
	}
}
