import SoundManager from "./SoundManager";
import LogsManager from "./LogsManager";
import GlobalData from "../utils/GlobalData";
import WindowManager from "./WindowManager";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import ScreenAdapterTools from "../utils/ScreenAdapterTools";
import UserInfo from "../common/UserInfo";
import FuncManager from "./FuncManager";
import Client from "../common/kakura/Client";
import Method from "../../game/sys/common/kakura/Method";
import GameSwitch from "../common/GameSwitch";
import KakuraClient from "../common/kakura/KakuraClient";
import Message from "../common/Message";
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
import ViewTools from "../components/ViewTools";

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


		this.initLayer();
		// SoundManager.init();

		// this.onLoadingUIComplete();

		Message.instance.add(MsgCMD.GAME_ONSHOW, this);
		Message.instance.add(MsgCMD.VIDEO_STOP, this);
		Message.instance.add(MsgCMD.VIDEO_PLAY, this);
		WindowManager.OpenUI(WindowCfgs.GameMainUI);
	}

	//Loading页面显示后开始加载资源
	private onLoadingUIComplete(): void {
		this.timeLock = Client.instance.miniserverTime;
		this.reqVMS();
	}


	private reqVMS(): void {
		UserInfo.platform.reqVMS();
	}

	public checkSystem() {

	}



	private sysCallback() {


		// 初始化平台参数
		UserInfo.platform.initPlatformData();
	}


	public loginResult() {
		Client.instance.send(Method.User_login, {}, this.onLoginResult, this);
	}

	public onLoginResult(result: any) {
		LogsManager.echo("yrc onLoginResult", result);
		var serverData = result;
		if (!GlobalData.checkUserCloudStorage()) {
			Client.instance.globalLoginBackData = result;
			serverData = result.data
		} else {
			UserInfo.platform.compareData(result);
		}
		if (serverData.config) {
			Client.instance.heartBeatInterval = result.data.config.heartBeatInterval;
			//覆盖服务器来回的开关参数
			if (result.data.config.switch) {

				UserInfo.platform.coverServerSwitchMap(result.data.config.switch)
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



	//初始化UI层
	private initLayer(): void {
		WindowManager.rootLayer = ViewTools.createContainer("rootLayer");
		WindowManager.rootLayer.set2dPos(ScreenAdapterTools.sceneOffsetX,ScreenAdapterTools.sceneOffsetY);
		GlobalData.uiRoot.addChild(WindowManager.rootLayer);
		WindowManager.commonUILayer = ViewTools.createContainer("commonUILayer");
		// WindowManager.commonUILayer.setSize(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.commonUILayer);

		WindowManager.topUILayer = ViewTools.createContainer("topUILayer");
		// WindowManager.topUILayer.setSize(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.topUILayer.mouseEnabled = true;
		WindowManager.topUILayer.mouseThrough = true
		WindowManager.rootLayer.addChild(WindowManager.topUILayer);


		WindowManager.guideLayer = ViewTools.createContainer("guideLayer");
		// WindowManager.guideLayer.setSize(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.guideLayer);
		WindowManager.guideLayer.mouseEnabled = true;
		WindowManager.guideLayer.mouseThrough = true;
		WindowManager.guideLayer.visible = false;


		WindowManager.highLayer = ViewTools.createContainer("highLayer");
		// WindowManager.highLayer.setSize(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.highLayer);

		WindowManager.toolsLayer = ViewTools.createContainer("toolsLayer");
		WindowManager.rootLayer.addChild(WindowManager.toolsLayer);

		WindowManager.maskLayer = ViewTools.createContainer("maskLayer");
		// WindowManager.maskLayer.setSize(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.rootLayer.addChild(WindowManager.maskLayer);

		WindowManager.tipsLayer = ViewTools.createContainer("tipsLayer");
		// WindowManager.tipsLayer.setSize(ScreenAdapterTools.width, ScreenAdapterTools.height);
		WindowManager.tipsLayer.mouseEnabled = false;
		WindowManager.tipsLayer.mouseThrough = true;
		WindowManager.rootLayer.addChild(WindowManager.tipsLayer);

		//最顶层2级容器（越高级优先级越高）
		WindowManager.debugLayer = ViewTools.createContainer("debugLayer");
		WindowManager.rootLayer.addChild(WindowManager.debugLayer);
		LogsManager.initLogPanel();

		if (UserInfo.isWeb()) {
			GameSwitch.switchMap.SWITCH_GM_DEBUG = 1;
			GameSwitch.switchMap.SWITCH_CD_DEBUG = 1;
		}

		//延迟一帧显示loading
		// var delayShowLoading = () => {
		// 	WindowManager.ShowLoadingUI(null);
		// }
		// //web版因为有loginui. 所以不能延迟一帧显示loading.否则loading会盖住login
		// if (UserInfo.isWeb()) {
		// 	WindowManager.ShowLoadingUI(null);
		// } else {
		// 	TimerManager.instance.add(delayShowLoading, null, 10, 1);
		// }
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
