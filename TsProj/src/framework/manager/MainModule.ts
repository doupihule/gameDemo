import SoundManager from "./SoundManager";
import LogsManager from "./LogsManager";
import Global from "../../utils/Global";
import WindowManager from "./WindowManager";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import UtilsServer from "../../game/sys/server/UtilsServer";
import UserInfo from "../common/UserInfo";
import FuncManager from "./FuncManager";
import Client from "../common/kakura/Client";
import Method from "../../game/sys/common/kakura/Method";
import GameSwitch from "../common/GameSwitch";
import KakuraClient from "../common/kakura/KakuraClient";
import Message from "../common/Message";
import GameConfig from "../../GameConfig";
import IMessage from "../../game/sys/interfaces/IMessage";
import UserModel from "../../game/sys/model/UserModel";
import {LoadManager} from "./LoadManager";
import VersionManager from "./VersionManager";
import FileUtils from "../utils/FileUtils";
import TimerManager from "./TimerManager";
import {MusicConst} from "../../game/sys/consts/MusicConst";
import {LoadZipManager} from "./LoadZipManager";
import MsgCMD from "../../game/sys/common/MsgCMD";
import SubPackageConst from "../../game/sys/consts/SubPackageConst";
import SubPackageManager from "./SubPackageManager";
import UserGlobalModel from "../model/UserGlobalModel";
import BannerAdManager from "./BannerAdManager";
import FrameWorkEvent from "../event/FrameWorkEvent";
import ModelToServerMapCommon from "../consts/ModelToServerMapCommon";
import KariqiShareManager from './KariqiShareManager';
import KariquShareConst from '../consts/KariquShareConst';

;

export default class MainModule implements IMessage {
	//实例
	public static instance: MainModule;
	public timeLock: number = 0;


	static task_sceneComplete: string = "task_sceneComplete"         //任务场景加载完成
	static task_updateListerner: string = "task_updateListerner"     //任务版本检查完成
	static task_subpackage: string = "task_subpackage"     //分包加载完成
	static task_configsloaded: string = "task_configsloaded"     //配置加载完成
	static task_onloginResult: string = "task_onloginResult"     //登入完成
	static task_mergeFileBack: string = "task_mergeFileBack"         //文件合并回来
	static task_kariquLogin: string = "task_kariquLogin"         //卡日曲登录结果


	constructor() {
		MainModule.instance = this;


		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		Laya.SoundManager.useAudioMusic = false;
		Laya.MouseManager.multiTouchEnabled = false;
		SoundManager.init();
		this.initLayer();
		this.onLoadingUIComplete();

		Message.instance.add(MsgCMD.GAME_ONSHOW, this);
		Message.instance.add(MsgCMD.VIDEO_STOP, this);
		Message.instance.add(MsgCMD.VIDEO_PLAY, this);
	}

	//Loading页面显示后开始加载资源
	private onLoadingUIComplete(): void {
		this.timeLock = Laya.timer.currTimer;
		this.reqVMS();
	}


	private reqVMS(): void {
		UserInfo.platform.reqVMS();
	}

	public checkSystem() {
		// if (FileUtils.isUserWXSource()) {
		//     Global.resource_url += UserInfo.platformId + "/";
		//     Global.nocdn_resource_url += UserInfo.platformId + "/";
		// }
		//获取版本的名字.  不同渠道 返回的不一样
		var versionName = UserInfo.platform.getVersionName();
		if (Global.resource_url && Global.isCDN) {
			Laya.URL.basePath = Global.resource_url;
			// versionName = `version_${Global.version}.json`;
			// Laya.URL.basePath = "http://192.168.1.112:8080/";//测试用地址，本地
			//versionName = "version.json";//测试用地址，本地
		}
		VersionManager.instance.versionName = versionName;
		LogsManager.echo("xd cdnurl:", Global.resource_url);
		LogsManager.echo("yrc reqvms suc", Laya.URL.basePath)
		LogsManager.echo("yrc req versionName:", versionName);
		//用test.json去验证cdn是否可用
		LoadManager.instance.load(versionName, Laya.Handler.create(this, () => {
			VersionManager.instance.initVersionData();
			//这里以后走自己的文件映射版本控制.不走laya的了
			this.onVersionLoaded();
		}))
	}

	useNocndResourceUrl() {

	}

	onVersionLoaded(): void {

		//版本文件检查,是否需要删除旧版本的文件
		VersionManager.instance.versionFileCheck();

		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		//等待配表加载完成后才能进行后续的事情

		FuncManager.init(() => {
			if (Global.checkUserCloudStorage()) {
				this.onLoginResult(Client.instance.globalLoginBackData)
				UserInfo.platform.getLoginResult();
			}
			this.sysCallback();
		}, this);

	}

	onConfigLoaded(): void {
		this.changeShowMainTask(-1, MainModule.task_configsloaded, "onConfigLoaded");
	}

	private sysCallback() {
		LogsManager.echo(" ======--VMSTIME--======== " + (Laya.timer.currTimer - this.timeLock))
		//联网模式 是在确认版本之后才开始登入
		if (!Global.checkUserCloudStorage()) {
			UserInfo.platform.getWxInfo();
		}


		//开始加载合并文件
		this.loadMergeFiles();

		// 初始化平台参数
		UserInfo.platform.initPlatformData();
	}

	private changeByte(name) {
		var buffer = Laya.Loader.getRes(name);
		var byte: Laya.Byte = new Laya.Byte(buffer);
		if (byte.length > 4) {
			FileUtils.decodeBinAssets(byte);
		}

		Laya.Loader.clearRes(name);
	}

	//加载
	private loadMergeFiles() {
		//如果是不使用文件合并功能 web版 或者是zip版本
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_MERGEFILES) || UserInfo.isWeb()) {
			this.onMergeFileBack();
		} else {
			LogsManager.echo("xd----使用文件合并功能,注意开发模式下 可以禁掉文件合并功能.防止版本使用冲突")
			var zipList = [
				{url: "mergefiles/mergeBin.bin", type: "arraybuffer"},
				{url: "mergefiles/mergeJson.bin", type: "arraybuffer"},
			]
			var times = Laya.Browser.now();

			var onZipLoad = () => {
				LogsManager.echo("krma. onZipLoad onZipLoad onZipLoad onZipLoad onZipLoad")
				LoadManager.instance.load(zipList, Laya.Handler.create(this, () => {
					this.changeByte("mergefiles/mergeBin.bin");
					this.changeByte("mergefiles/mergeJson.bin");
					this.onMergeFileBack();
					LogsManager.echo("xd  合并文件下载解析总耗时-----------", Laya.Browser.now() - times);
				}));
			}

			//如果是使用zip功能的
			if (FileUtils.checkIsUseZip()) {
				//需要先加载对应的zip
				LoadZipManager.instance.loadZip("mergefiles.zip", VersionManager.ZIP_MODEL_KEY_MERGEFILES, new Laya.Handler(this, onZipLoad), null);
			} else {
				//如果合并文件是走分包的  等分包下载完成在去执行这个
				if (SubPackageManager.getModelFileStyle(SubPackageConst.packName_mergefiles) == SubPackageConst.PATH_STYLE_SUBPACK) {
					SubPackageManager.loadSubPackage(SubPackageConst.packName_mergefiles, onZipLoad, this, true);
				} else {
					onZipLoad();
				}

			}

		}
	}

	//合并文件返回
	private onMergeFileBack() {
		this.changeShowMainTask(-1, MainModule.task_mergeFileBack, "onMergeFileBack")


	}


	public loginResult() {
		//3.311请求接口，获取用户信息
		LogsManager.echo(" ======--GlobalTIME--======== " + (Laya.timer.currTimer - this.timeLock))
		if (Global.isNotGuide()) {
			// StatisticsManager.ins.onEvent(StatisticsManager.NEW_LOADING_5_7);
		} else {
			// StatisticsManager.ins.onEvent(StatisticsManager.LOADING_5_7);
		}
		Client.instance.send(Method.User_login, {}, this.onLoginResult, this);

	}

	public onLoginResult(result: any) {
		LogsManager.echo("yrc onLoginResult", result);
		var serverData = result;
		if (!Global.checkUserCloudStorage()) {
			Client.instance.globalLoginBackData = result;
			serverData = result.data
		} else {
			UserInfo.platform.compareData(result);

		}

		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		if (serverData.config) {
			Client.instance.heartBeatInterval = result.data.config.heartBeatInterval;
			//覆盖服务器来回的开关参数
			if (result.data.config.switch) {

				GameSwitch.coverServerSwitchMap(result.data.config.switch)
				LogsManager.echo("yrc gameswitch resultSwitch", result.data.config.switch)
			}

			KakuraClient.instance.registHeartBeat();
		}
		LogsManager.echo("yrc SWITCH_LOG_PANEL:", GameSwitch.checkOnOff(GameSwitch.SWITCH_LOG_PANEL));
		LogsManager.setLogGroupVisible(GameSwitch.checkOnOff(GameSwitch.SWITCH_LOG_PANEL));

		var userData = serverData.user;

		//初始化所有的模块数据
		ModelToServerMapCommon.initModelToServerMap();
		var modelMap: any[] = ModelToServerMapCommon.modelToServerMap;

		var length = modelMap.length;
		for (var i = 0; i < length; i++) {
			var info = modelMap[i];
			var key: string = info.key;
			var model: any = info.model;
			if (info.key == "user") {
				model.instance.initData(userData);
			} else {
				//初始化的时候需要给一个默认值,
				if (!userData[key]) {
					userData[key] = {};
				}
				var data: any = userData[key];
				model.instance.initData(data);
			}
		}
		// 获取云存储信息
		UserGlobalModel.instance.flushGlobalData(this.getCloudGlobalDataResult, this);
		SoundManager.init();
		SoundManager.initSwitch();
	}

	/**
	 * 获取全局用户数据回调
	 */
	private getCloudGlobalDataResult(params) {
		// 玩家登陆
		UserModel.instance.login();
		// 设置相关开关
		BannerAdManager.setBannerSwitch();

		this.changeShowMainTask(-1, MainModule.task_onloginResult, "onLoginResult");
	}

	public static showMainTask = 6;// 进主界面6个任务, 1,版本检查结束, 2, 312登入初始化完成, 3,fileconfig.json加载完成 4.分包下载完成 ,5.合并文件完成,6卡日曲登录回调 7获取系统信息完成(只有android和ios有)
	//完成任务列表
	private _taskCompMap = {};

	//value 完成任务数量,key,完成的任务对应的key, tag,任务描述
	public changeShowMainTask(value, key, tag = null) {
		MainModule.showMainTask += value;
		LogsManager.echo("yrc showMainTask", value, MainModule.showMainTask, "tag:", tag);
		//同时记录对应的任务key标记为true.为了一些特殊情况判断
		this._taskCompMap[key] = true
		//所有任务都完成就进入主界面
		if (MainModule.showMainTask == 0) {
			this.showGameMain();
		} else if (MainModule.showMainTask < 0) {
			LogsManager.errorTag("mainTaskError", "taskError", MainModule.showMainTask, tag);
		}
	}

	//判断某个任务是否完成
	private checkHasTaskComplete(taskKey: string) {
		return this._taskCompMap[taskKey]
	}


	/**根据返回值决定出现主界面还是好友匹配界面 */
	showGameMain() {
		Message.instance.send(FrameWorkEvent.FRAMEWORKEVENT_STARTENTERMAIN);
		KariqiShareManager.onEvent(KariquShareConst.KARIQU_GAMEMAIN);
	}


	/**根据点击链接后的不同状态，弹tip */
	showInviteTip(shareStatus) {
		// var shareStatus = UserModel.instance.getShareStatus();
		if (!shareStatus) return;
		switch (Number(shareStatus)) {
			case 2:
				//房间不存在
				WindowManager.ShowTip("房间已解散");
				break;
			case 3:
				//比赛已经开始
				WindowManager.ShowTip("比赛已经开始");
				break;
			case 4:
				//参赛人数已满
				WindowManager.ShowTip("参赛人数已满");
				break;
		}
	}

	//重新启动
	public reStartGame(): void {

	}


	//初始化UI层
	private initLayer(): void {
		WindowManager.rootLayer = new Laya.Sprite();
		WindowManager.rootLayer.x += ScreenAdapterTools.sceneOffsetX;
		WindowManager.rootLayer.y += ScreenAdapterTools.sceneOffsetY;
		Laya.stage.addChild(WindowManager.rootLayer);
		WindowManager.commonUILayer = new Laya.Sprite();
		WindowManager.commonUILayer.size(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.commonUILayer);

		WindowManager.topUILayer = new Laya.Sprite();
		WindowManager.topUILayer.size(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.topUILayer.mouseEnabled = true;
		WindowManager.topUILayer.mouseThrough = true
		WindowManager.rootLayer.addChild(WindowManager.topUILayer);


		WindowManager.guideLayer = new Laya.Sprite();
		WindowManager.guideLayer.size(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.guideLayer);
		WindowManager.guideLayer.mouseEnabled = true;
		WindowManager.guideLayer.mouseThrough = true;
		WindowManager.guideLayer.visible = false;


		WindowManager.highLayer = new Laya.Sprite();
		WindowManager.highLayer.size(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.highLayer);

		WindowManager.toolsLayer = new Laya.Sprite();
		WindowManager.rootLayer.addChild(WindowManager.toolsLayer);

		WindowManager.maskLayer = new Laya.Sprite();
		WindowManager.maskLayer.size(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.maskLayer);

		WindowManager.tipsLayer = new Laya.Sprite();
		WindowManager.tipsLayer.size(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.tipsLayer.mouseEnabled = false;
		WindowManager.tipsLayer.mouseThrough = true;
		WindowManager.rootLayer.addChild(WindowManager.tipsLayer);

		//最顶层2级容器（越高级优先级越高）
		WindowManager.debugLayer = new Laya.Sprite();
		WindowManager.rootLayer.addChild(WindowManager.debugLayer);
		LogsManager.initLogPanel();
		LogsManager.addTouchShow(Laya.stage);

		if (UserInfo.isWeb()) {
			var urlParam = window.location.href.indexOf('test=1') > 0;
			LogsManager.echo(">>>>urlParam>>>>>>", urlParam);
			GameSwitch.switchMap.SWITCH_GM_DEBUG = 1;
			GameSwitch.switchMap.SWITCH_CD_DEBUG = 1;
		}

		//延迟一帧显示loading
		var delayShowLoading = () => {
			WindowManager.ShowLoadingUI(null);
		}
		//web版因为有loginui. 所以不能延迟一帧显示loading.否则loading会盖住login
		if (UserInfo.isWeb()) {
			WindowManager.ShowLoadingUI(null);
		} else {
			TimerManager.instance.add(delayShowLoading, null, 10, 1);
		}
		//只有native才填充黑边
		if (UserInfo.isSystemNative()) {
			//判断是否填充黑边
			ScreenAdapterTools.checkFillBorder()
		}


	}

	private onTTShow(): void {
		LogsManager.echo("yrc onTTShow")
		if (!UserInfo.platform.isPlayVideo) {
			//不播放视频广告的时候才播BGM
			if (WindowManager.isUIOpened(WindowCfgs.GameMainUI)) {
				LogsManager.echo("yrc have GameMainUI");
				SoundManager.stopMusic();
				SoundManager.playBGM(MusicConst.MUSIC_BGM);
			} else {
				LogsManager.echo("yrc have not GameMainUI");
				SoundManager.playBGM();
			}
		}
	}

	private gameClose() {
		UtilsServer.exitGame({}, () => {
		}, this);
	}

	/**开始播放BGM */
	private playBGM() {
		SoundManager.playBGM(MusicConst.MUSIC_BGM);
	}

	/**暂停BGM */
	private stopBGM() {
		SoundManager.stopMusic();
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			case MsgCMD.GAME_ONSHOW:
				this.onTTShow();
				break;
			case MsgCMD.VIDEO_PLAY:
				this.playBGM();
				break;
			case MsgCMD.VIDEO_STOP:
				this.stopBGM();
				break;
			case MsgCMD.CLIENT_SEND_LOG:
				LogsManager.sendAndShowLog();
				break;
		}
	}
}
