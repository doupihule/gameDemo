import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import StatisticsManager from "../../manager/StatisticsManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import {ui} from "../../../../ui/layaMaxUI";
import FogModel from "../../model/FogModel";
import FogServer from "../../server/FogServer";
import FogFunc from "../../func/FogFunc";
import BattleDetailUI from "../battle/BattleDetailUI";


export default class FogBattleStartAlertUI extends ui.gameui.fog.FogBattleStartAlertUI implements IMessage {


	private freeType;
	private isEnterBattle: boolean = false;
	private detail: BattleDetailUI;
	//道具id
	private itemId;
	private itemCount;
	//增加能量值
	private addEnergyNum;

	constructor() {
		super();
		this.addEvent();

		new ButtonUtils(this.btn_close, this.close, this);
		new ButtonUtils(this.fullStartBtn, this.onClickFullStart, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.startBtn, this.normalStart, this);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);
		this.isEnterBattle = false;
		this.detail = data.detail;
		var info = GlobalParamsFunc.instance.getDataArray("fogBattleAddtion");
		this.itemId = info[0];
		this.addEnergyNum = info[1];
		this.itemCount = FogModel.instance.getPropNum(this.itemId);
		this.leftCountTxt.text = this.itemCount + "";
		this.freeType = null;
		if (this.itemCount > 0) {
			this.freeImg.visible = false;
		} else {
			this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_BATTLE_START);
			this.freeImg.visible = true;
			this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_JITANG_SHOW)
			}
		}
		this.itemImg.skin = FogFunc.instance.getFogItemIcon(this.itemId);
		this.desTxt.text = TranslateFunc.instance.getTranslate("#tid_fog_battleStart_addEnergy", null, this.addEnergyNum)
	}

	normalStart() {
		if (this.detail.actCost > FogModel.instance.getActNum()) {
			FogModel.instance.checkFreeAct();
			return;
		}
		if (this.isEnterBattle) return;
		this.isEnterBattle = true;
		this.onClickCLose();
	}

	//干了它
	onClickFullStart() {
		if (this.detail.actCost > FogModel.instance.getActNum()) {
			FogModel.instance.checkFreeAct();
			return;
		}
		if (this.itemCount > 0) {
			//消耗道具
			FogServer.itemCost({id: this.itemId}, this.fullStart, this)
			StatisticsManager.ins.onEvent(StatisticsManager.FOG_JITANG_USE)
		} else {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_JITANG_CLICK)
			}
			ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_BATTLE_START, ShareOrTvManager.TYPE_ADV, {
				id: "1",
				extraData: {}
			}, this.fullStart, this.closeCall, this)
		}
	}

	//满能量开始
	private fullStart() {
		if (this.isEnterBattle) return;
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_JITANG_FINISH)
		} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_JITANG_FINISH)
			}
		}
		this.isEnterBattle = true;
		FogModel.fogAddEnergy = Number(this.addEnergyNum)
		this.onClickCLose();
	}

	closeCall() {

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogBattleStartAlertUI);
	}

	onClickCLose() {
		this.close();
		this.detail.onClickStartGame();
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}


