import IMessage from "../interfaces/IMessage";
import UserModel from "../model/UserModel";
import UserInfo from "../../../framework/common/UserInfo";
import StatisticsManager from "./StatisticsManager";
import StatisticsCommonConst from "../../../framework/consts/StatisticsCommonConst";
import UserGlobalModel from "../../../framework/model/UserGlobalModel";
import GlobalParamsFunc from "../func/GlobalParamsFunc";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../consts/WindowCfgs";
import Message from "../../../framework/common/Message";
import FrameWorkEvent from "../../../framework/event/FrameWorkEvent";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import BattleFunc from "../func/BattleFunc";
import BattleConst from "../consts/BattleConst";
import SoundManager from "../../../framework/manager/SoundManager";
import SwitchModel from "../model/SwitchModel";
//主要用来处理框架相关不同的逻辑每个游戏独立维护,比如分享不一样的地方.  进入主界面不一样的地方
export default class FrameWorkHandle implements IMessage {
	private static _instance: FrameWorkHandle;
	public static get instance() {
		if (!this._instance) {
			this._instance = new FrameWorkHandle();
		}
		return this._instance;
	}

	public static init() {
		if (!this._instance) {
			this._instance = new FrameWorkHandle();
		}
	}

	//初始化函数. 需要侦听事件.每个游戏单独处理
	constructor() {
		//监听进入主界面消息
		Message.instance.add(FrameWorkEvent.FRAMEWORKEVENT_STARTENTERMAIN, this);
	}

	//针对游戏单独处理
	private onStartEnterGameMain() {
		SoundManager.setSoundVolume(SwitchModel.instance.getSwitchByType(SwitchModel.sound_switch))
		SoundManager.setMusicVol(SwitchModel.instance.getSwitchByType(SwitchModel.music_switch))
		if (UserInfo.platform.shareLinkParams && UserInfo.platform.shareLinkParams.contentId) {
			StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_CLICK_ENTER, {contentId: UserInfo.platform.shareLinkParams.contentId})
		}
		if (UserInfo.platform.shareLinkParams && UserInfo.platform.shareLinkParams.inviterRid) {
			if (UserInfo.platform.shareLinkParams.inviterRid != UserModel.instance.getUserRid()) {
				// 新老用户均设置数据
				UserGlobalModel.setInviteUser(UserInfo.platform.shareLinkParams.inviterRid);
				var shareAddNum = GlobalParamsFunc.instance.getDataNum("shareTruePlayerNmb");
				UserGlobalModel.setOtherShareNum(UserInfo.platform.shareLinkParams.inviterRid, shareAddNum);
			}
		}
		var guideStep = UserModel.instance.getMainGuide();
		//如果没有引导进度信息并且当前最高关卡是0 进入引导
		if (guideStep == 0 && !UserModel.instance.getMaxBattleLevel()) {
			BattleFunc.curBattleType = BattleConst.BATTLETYPE_NORMAL;
			var cartoonSwitch = GlobalParamsFunc.instance.getDataNum("cartoonSwitch");
			if (cartoonSwitch) {
				WindowManager.SwitchUIFromLoading(WindowCfgs.CartoonPicUI, WindowCfgs.LoginUI);
			} else {
				WindowManager.SwitchUIFromLoading(WindowCfgs.BattleUI, {name: "1-1", levelId: 1});
			}
		} else {
			WindowManager.SwitchUIFromLoading(WindowCfgs.GameMainUI, WindowCfgs.LoginUI);
		}
	}

	//当判断是否分享成功. 不同项目自己扩展重写
	public onCheckShareSucess(distime, shareExtraData) {
		// 分享是否成功
		var shareResult = false;
		if (UserInfo.platform._shareNoWait || distime >= 3000) {
			// 该分享不检查是否分享成功或者分享时长大于3秒
			shareResult = true;
		}
		if (shareResult) {
			UserInfo.platform.onShareComplete(true);
		} else {
			//根据不同游戏自己做判断
			var failHandleType = GlobalParamsFunc.instance.shareHandleType;
			if (failHandleType == 1) {
				WindowManager.ShowTip("分享失败，请稍后再试");
				UserInfo.platform.onShareComplete(false);
			} else if (failHandleType == 2) {
				UserInfo.platform.showPopTip("提示", TranslateFunc.shareTranslateArr[Math.floor(Math.random() * TranslateFunc.shareTranslateArr.length)], {
					confirmText: TranslateFunc.shareLabTranslate,
					success(res) {
						if (res.confirm) {
							LogsManager.echo('用户点击确定,再次拉起分享');
							//再次拉起分享
							UserInfo.platform.share(UserInfo.platform._shareId, UserInfo.platform._shareExtraData, UserInfo.platform._shareCallback, UserInfo.platform._shareThisObj);
						} else if (res.cancel) {
							LogsManager.echo("用户取消了再次分享");
							UserInfo.platform.onShareComplete(false);
						}
					}
				});
			}
		}
	}


	//接受消息
	public recvMsg(cmd: string, data: any): void {
		if (cmd == FrameWorkEvent.FRAMEWORKEVENT_STARTENTERMAIN) {
			this.onStartEnterGameMain();
		}
	}

}