import IMessage from "../interfaces/IMessage";
import UserModel from "../model/UserModel";
import BattleSceneManager from "./BattleSceneManager";
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

		// var guideStep = UserModel.instance.getMainGuide();
		// if (guideStep == 0) {
		//     BattleSceneManager.instance.enterBattle({ roleId: UserModel.instance.getRole(), levelId: 1 });
		//     return;
		// }
		WindowManager.SwitchUIFromLoading(WindowCfgs.GameMainUI, WindowCfgs.LoginUI);

		if (UserInfo.platform.shareLinkParams && UserInfo.platform.shareLinkParams.contentId) {
			StatisticsManager.ins.onEvent(StatisticsCommonConst.SHARE_CLICK_ENTER, { contentId: UserInfo.platform.shareLinkParams.contentId })
		}
		if (UserInfo.platform.shareLinkParams && UserInfo.platform.shareLinkParams.inviterRid) {
			if (UserInfo.platform.shareLinkParams.inviterRid != UserModel.instance.getUserRid()) {
				// 新老用户均设置数据
				UserGlobalModel.setInviteUser(UserInfo.platform.shareLinkParams.inviterRid);
				var shareAddNum = GlobalParamsFunc.instance.getDataNum("shareTruePlayerNmb");
				UserGlobalModel.setOtherShareNum(UserInfo.platform.shareLinkParams.inviterRid, shareAddNum);
			}
		}
	}

	//当判断是否分享成功. 不同项目自己扩展重写
	public  onCheckShareSucess(distime,shareExtraData){
		var shareResult: boolean = distime >= 3000;
		var platformObj:any = UserInfo.platform;
		if (shareResult) {
			platformObj.onShareComplete(shareResult);
		} else {
			//根据不同游戏自己做判断
			var failHandleType = GlobalParamsFunc.instance.shareHandleType;
			if (failHandleType == 1) {
				WindowManager.ShowTip("分享失败，请稍后再试");
				platformObj.onShareComplete(shareResult);
			} else if (failHandleType == 2) {

				UserInfo.platform.showPopTip("提示", TranslateFunc.shareTranslateArr[Math.floor(Math.random() * TranslateFunc.shareTranslateArr.length)], {
					confirmText: TranslateFunc.shareLabTranslate,
					success(res) {
						if (res.confirm) {
							LogsManager.echo('用户点击确定,再次拉起分享');
							//再次拉起分享
							platformObj.share(platformObj._shareId, platformObj._shareExtraData, platformObj.shareCallback, platformObj);
						} else if (res.cancel) {
							LogsManager.echo("用户取消了再次分享");
							platformObj.onShareComplete(false);
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