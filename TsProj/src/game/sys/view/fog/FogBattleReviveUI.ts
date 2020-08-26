import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import {ui} from "../../../../ui/layaMaxUI";
import StatisticsManager from "../../manager/StatisticsManager";


export default class FogBattleReviveUI extends ui.gameui.fog.FogBattleReviveUI implements IMessage {


	private freeType;
	private waitTime = 5;
	private timeCode = 0;
	private controler;
	private isPause = false;

	constructor() {
		super();
		this.addEvent();
		new ButtonUtils(this.closeBtn, this.onClickCLose, this);
		new ButtonUtils(this.reviveBtn, this.onClickRevive, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.exitBtn, this.onClickCLose, this);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		this.controler = data && data.controler;
		BannerAdManager.addBannerQuick(this);
		this.isPause = false;
		this.waitTime = GlobalParamsFunc.instance.getDataNum("fogResurrectionTime") / 1000 || 5;
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLEFOG_REVIVE);
		this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
		StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_REVIVE_SHOW);
		this.showLeftTime()
		this.timeCode = TimerManager.instance.add(this.showLeftTime, this, 1000);
		BannerAdManager.addTopBannerStyleJump(this);
		var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(ShareTvOrderFunc.SHARELINE_BATTLEFOG_REVIVE);
		this.exitBtn.visible = true;
		if (delayTime) {
			this.exitBtn.visible = false;
			TimerManager.instance.setTimeout(() => {
				this.exitBtn.visible = true;
			}, this, delayTime)
		}
	}

	/**显示剩余时间 */
	showLeftTime() {
		if (this.isPause) return;
		if (this.waitTime <= 0) {
			this.onClickCLose();
		}
		this.leftTxt.changeText(this.waitTime + "");
		this.waitTime -= 1;
	}

	//点击复活
	onClickRevive() {
		this.isPause = true;
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_REVIVE_CLICK);
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_BATTLEFOG_REVIVE, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.fullStart, this.closeCall, this)
	}

	//
	private fullStart() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_REVIVE_FINISH);
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_REVIVE_FINISH);
		}
		this.revive();
	}

	//执行复活
	revive() {
		this.close();
		this.controler.fogRevive();
	}

	closeCall() {
		this.isPause = false;
	}

	close() {
		this.controler.setGamePlayOrPause(false);
		WindowManager.CloseUI(WindowCfgs.FogBattleReviveUI);
		TimerManager.instance.remove(this.timeCode);
	}

	onClickCLose() {
		this.close();
		//点击关闭 展示失败
		this.controler.refreshControler.showGameLose();
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}


