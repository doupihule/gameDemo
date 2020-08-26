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
import BattleConst from "../../consts/BattleConst";
import TranslateFunc from "../../../../framework/func/TranslateFunc";


export default class BattleReviveUI extends ui.gameui.battle.BattleReviveUI implements IMessage {


	private freeType;
	private waitTime = 5;
	private timeCode = 0;
	private controler;
	private isPause = false;
	//复活类型  1 超时复活 2 战败复活
	private reviveType;
	private shareName;

	constructor() {
		super();
		this.addEvent();
		new ButtonUtils(this.exitBtn, this.onClickCLose, this);
		new ButtonUtils(this.reviveBtn, this.onClickRevive, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		this.controler = data && data.controler;
		BannerAdManager.addBannerQuick(this);
		this.isPause = false;
		this.waitTime = GlobalParamsFunc.instance.getDataNum("fogResurrectionTime") / 1000 || 5;
		this.reviveType = data.reviveType;
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName);
		this.adImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType);
		if (this.reviveType == BattleConst.REVIVETYPE_OVERTIME) {
			this.shareName = ShareTvOrderFunc.SHARELINE_BATTLEREVIVE_OVERTIME;
			this.desTxt.text = TranslateFunc.instance.getTranslate("#tid_battleOvertime");
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELOVERTIME_SHOW, {level: this.controler.battleData.levelId})
			}
		} else if (this.reviveType == BattleConst.REVIVETYPE_DEFEAT) {
			this.shareName = ShareTvOrderFunc.SHARELINE_BATTLEREVIVE_DEFEAT;
			this.desTxt.text = TranslateFunc.instance.getTranslate("#tid_battle_revive_defeat");
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELFAIL_SHOW, {level: this.controler.battleData.levelId})
			}
		}
		this.showLeftTime()
		this.timeCode = TimerManager.instance.add(this.showLeftTime, this, 1000);
		var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(this.shareName);
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
			if (this.reviveType == BattleConst.REVIVETYPE_OVERTIME) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELOVERTIME_CLICK, {level: this.controler.battleData.levelId})
			} else if (this.reviveType == BattleConst.REVIVETYPE_DEFEAT) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELFAIL_CLICK, {level: this.controler.battleData.levelId})
			}
		}
		ShareOrTvManager.instance.shareOrTv(this.shareName, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.succCall, this.closeCall, this)
	}

	//
	private succCall() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			if (this.reviveType == BattleConst.REVIVETYPE_OVERTIME) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELOVERTIME_FINISH, {level: this.controler.battleData.levelId})
			} else if (this.reviveType == BattleConst.REVIVETYPE_DEFEAT) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_LEVELFAIL_FINISH, {level: this.controler.battleData.levelId})
			}
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			if (this.reviveType == BattleConst.REVIVETYPE_OVERTIME) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_LEVELOVERTIME_FINISH, {level: this.controler.battleData.levelId})
			} else if (this.reviveType == BattleConst.REVIVETYPE_DEFEAT) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_LEVELFAIL_FINISH, {level: this.controler.battleData.levelId})
			}
		}
		this.revive();
	}

	//执行复活
	revive() {
		this.close();
		if (this.reviveType == BattleConst.REVIVETYPE_OVERTIME) {
			this.controler.overTimeRevive();
		} else if (this.reviveType == BattleConst.REVIVETYPE_DEFEAT) {
			this.controler.defeatRevive();
		}
	}

	closeCall() {
		this.isPause = false;
	}

	close() {
		this.controler.setGamePlayOrPause(false);
		WindowManager.CloseUI(WindowCfgs.BattleReviveUI);
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


