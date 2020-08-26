import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import ResourceConst from "../../consts/ResourceConst";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogModel from "../../model/FogModel";
import StatisticsManager from "../../manager/StatisticsManager";
import FogConst from "../../consts/FogConst";
import FogMainUI from "./FogMainUI";
import BattleResultUI from "../battle/BattleResultUI";
import BattleDetailUI from "../battle/BattleDetailUI";
import FogLogicalControler from "../../../fog/controler/FogLogicalControler";


export default class FogTipUI extends ui.gameui.fog.FogTipUI implements IMessage {

	private viewType;
	private thisObj;
	private callBack;
	public fogControler: FogLogicalControler;

	constructor() {
		super();
		this.addEvent();

		new ButtonUtils(this.confirmBtn, this.onClickConfirm, this);
		new ButtonUtils(this.btn_close, this.close, this);
		new ButtonUtils(this.overBtn, this.onClickOver, this);
		new ButtonUtils(this.pauseBtn, this.onClickPause, this);
		new ButtonUtils(this.exitBtn, this.onClickConfirm, this);
		new ButtonUtils(this.continueBtn, this.close, this);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		this.viewType = data.type;
		this.thisObj = data.thisObj;
		this.callBack = data.callBack;
		this.commonTip.visible = true;
		this.exitGroup.visible = false;
		this.titleLab.text = "";
		this.titleImg.skin = "";
		this.bgImg.height = 362;
		var fogMain: FogMainUI = WindowManager.getUIByName(WindowCfgs.FogMainUI);
		this.fogControler = fogMain.fogControler;
		this.confirmBtn.visible = true;
		this.tipBtnGroup.visible = false;
		this.btn_close.visible = true;
		//前置事件
		if (this.viewType == FogConst.FOG_VIEW_TYPE_FRONTEVENT) {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_tip");
			this.descLab.text = TranslateFunc.instance.getTranslate(data.tip, "TranslateEvent");
		}
		//下一层
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_NEXTLAYER) {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_next_layer");
			this.descLab.text = TranslateFunc.instance.getTranslate("#tid_fogStreet_nextlayer", "TranslateFogStreet");
		}
		//通关
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_PASS_SUCCESS) {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_pass");
			this.descLab.text = TranslateFunc.instance.getTranslate("#tid_fogStreet_success", "TranslateFogStreet");
		}
		//结束本局
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_FINISH_BATTLE) {
			this.descLab.text = TranslateFunc.instance.getTranslate("#tid_fogStreet_giveup", "TranslateFogStreet");
			this.titleImg.skin = ResourceConst.FOG_TIP_OVERGAME
		}
		//离开
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_EXIT_FOG) {
			this.commonTip.visible = false;
			this.exitGroup.visible = true;
			this.titleImg.skin = ResourceConst.FOG_TIP_EXIT;
			this.bgImg.height = 292;
		} else if (this.viewType == FogConst.FOG_VIEW_TYPE_NOACT) {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_noenoughact");
			this.descLab.text = TranslateFunc.instance.getTranslate("#tid_fog_tip_noact");
			this.confirmBtn.visible = false;
			this.tipBtnGroup.visible = true;
			this.btn_close.visible = false;
		} else if (this.viewType == FogConst.FOG_VIEW_TYPE_DEFEAT) {
			this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_tip_defeat");
			this.descLab.text = TranslateFunc.instance.getTranslate("#tid_fog_tip_defeatContent", null, GlobalParamsFunc.instance.getDataNum("fogExitTipsTimes"));
			this.confirmBtn.visible = false;
			this.tipBtnGroup.visible = true;
			this.btn_close.visible = false;
		}
		this.btn_close.y = this.bgImg.height - 60;
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);

	}

	onClickConfirm() {
		//前置事件
		if (this.viewType == FogConst.FOG_VIEW_TYPE_FRONTEVENT) {
			this.close();
		}
		//下一层
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_NEXTLAYER) {
			this.fogControler.cellMapControler.enterNextLayer();
			var fogMain: FogMainUI = WindowManager.getUIByName(WindowCfgs.FogMainUI);
			fogMain.setData(null);
			this.close();
		}
		//通关
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_PASS_SUCCESS) {
			//判断是否获得奖励：如果玩家游戏过程中没有获得任何战利品，则直接进入下一步奖励结算
			if (FogModel.instance.getFogOuterReward().length == 0) {
				WindowManager.OpenUI(WindowCfgs.FogResultUI, {thisObj: this.fogControler});
			} else {
				WindowManager.OpenUI(WindowCfgs.FogResultRewardUI, {thisObj: this.fogControler});
			}
		}
		//结束本局
		else if (this.viewType == FogConst.FOG_VIEW_TYPE_FINISH_BATTLE) {
			this.overGame();
		} else if (this.viewType == FogConst.FOG_VIEW_TYPE_NOACT) {
			this.onDefeatOrNoAct();
		} else if (this.viewType == FogConst.FOG_VIEW_TYPE_DEFEAT) {
			this.onDefeatOrNoAct();
		}


	}

	onDefeatOrNoAct() {
		var battleResult: BattleResultUI = WindowManager.getUIByName(WindowCfgs.BattleResultUI);
		if (battleResult && battleResult.parent && battleResult.visible) {
			battleResult.exitBattle();
		}
		var battleDetail: BattleDetailUI = WindowManager.getUIByName(WindowCfgs.BattleDetailUI);
		if (battleDetail && battleDetail.parent && battleDetail.visible) {
			battleDetail.dispose()
			WindowManager.CloseUI(WindowCfgs.BattleDetailUI)
		}
		this.overGame();
	}

	//结束本局游戏
	overGame() {
		//@zm 后续先弹奖励
		this.close();
		//判断是否获得奖励：如果玩家游戏过程中没有获得任何战利品，则直接进入下一步奖励结算
		if (FogModel.instance.getFogOuterReward().length == 0) {
			WindowManager.OpenUI(WindowCfgs.FogResultUI, {thisObj: this.fogControler});
		} else {
			WindowManager.OpenUI(WindowCfgs.FogResultRewardUI, {thisObj: this.fogControler});
		}
	}

	/**点击结束 */
	onClickOver() {
		this.setData({type: FogConst.FOG_VIEW_TYPE_FINISH_BATTLE, thisObj: this.thisObj, callBack: this.callBack})
	}

	/**点击暂退 */
	onClickPause() {
		StatisticsManager.ins.onEvent(StatisticsManager.FOG_LEAVE, {layer: FogModel.instance.getCurLayer() + 1})
		this.exit();
	}

	exit() {
		this.fogControler && this.fogControler.exitBattle();
		this.close();
		WindowManager.SwitchUI(WindowCfgs.GameMainUI, WindowCfgs.FogMainUI);
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogTipUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}

	}
}


