import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import UserInfo from "../../../../framework/common/UserInfo";
import LevelFunc from "../../func/LevelFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import {ui} from "../../../../ui/layaMaxUI";


export default class BattleFullEnergyUI extends ui.gameui.battle.BattleFullEnergyUI implements IMessage {


	private freeType;
	private isEnterBattle: boolean = false;
	private battleAddtionId;//开局效果id
	private detail;
	private isShowTalk: number;// 是否显示战斗开场对话
	private callBack;
	private thisObj;


	constructor() {
		super();
		this.addEvent();

		new ButtonUtils(this.closeBtn, this.close, this);
		new ButtonUtils(this.fullStartBtn, this.onClickFullStart, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.normalStartBtn, this.normalStart, this);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);
		this.isEnterBattle = false;
		this.normalStartBtn.visible = false;

		//随机开场效果
		this.battleAddtionId = data.battleAddtionId;
		this.isShowTalk = data.isShowTalk || 1;
		this.callBack = data.callBack || null;
		this.thisObj = data.thisObj || null;

		var battleAddtionInfo = LevelFunc.instance.getBattleAddtionById(this.battleAddtionId);

		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_START);
		this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
		if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			if (UserInfo.isWX()) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEADDTION_SHOW, {"battleAddtionId": this.battleAddtionId});
			} else {

			}
		} else if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEADDTION_SHOW, {"battleAddtionId": this.battleAddtionId});
		}


		this.rewardLab.text = TranslateFunc.instance.getTranslate(battleAddtionInfo.desc, "TranslateGlobal");
		this.rewardImg.skin = "uisource/video/video/" + battleAddtionInfo.addtionIcon + ".png";
		this.detail = data.detail

		var showTvGetShtarLateTime = GlobalParamsFunc.instance.getDataNum("showTvGetShtarLateTime");
		TimerManager.instance.add(() => {
			this.normalStartBtn.visible = true;
		}, this, showTvGetShtarLateTime, 1);
	}

	normalStart() {
		if (this.isEnterBattle) return;
		this.isEnterBattle = true;
		this.battleAddtionId = 0;
		this.onClickCLose();
	}

	//满能量开场
	onClickFullStart() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEADDTION_CLICK, {"battleAddtionId": this.battleAddtionId});
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_BATTLE_START, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.fullStart, this.closeCall, this)
	}

	//满能量开始
	private fullStart() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEADDTION_FINISH, {"battleAddtionId": this.battleAddtionId});
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_BATTLEADDTION_FINISH, {"battleAddtionId": this.battleAddtionId});
		}

		if (this.isEnterBattle) return;
		this.isEnterBattle = true;
		this.onClickCLose();

		//效果生效

	}

	closeCall() {

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.BattleFullEnergyUI);
	}

	onClickCLose() {
		if (this.callBack && this.thisObj) {
			this.callBack.call(this.thisObj);
		}
		this.detail.dispose();
		this.detail.enterBattleUI({"fullStart": this.battleAddtionId, "isShowTalk": this.isShowTalk})
		WindowManager.CloseUI(WindowCfgs.BattleFullEnergyUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}


