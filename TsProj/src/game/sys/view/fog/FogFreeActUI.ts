import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogServer from "../../server/FogServer";
import {DataResourceType} from "../../func/DataResourceFunc";
import FogModel from "../../model/FogModel";
import StatisticsManager from "../../manager/StatisticsManager";
import FogConst from "../../consts/FogConst";
import FogFunc from "../../func/FogFunc";


export default class FogFreeActUI extends ui.gameui.fog.FogFreeActUI implements IMessage {

	private freeType;
	private mobilityPerAd;//获得的行动力

	private noExit = 0;

	constructor() {
		super();
		this.addEvent();
		new ButtonUtils(this.getBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.closeBtn, this.onClickClose, this);
	}

	/**添加事件监听 */
	addEvent() {
	}

	setData(data): void {
		this.mobilityPerAd = GlobalParamsFunc.instance.getDataNum("mobilityPerAd");
		this.actNum.text = "X" + this.mobilityPerAd;
		this.noExit = 0;
		if (data && data.noExit) {
			this.noExit = 1;
		}
		this.titleLab.text = TranslateFunc.instance.getTranslate("tid_fog_noenoughact");
		this.refreshBtn();
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);

	}

	refreshBtn() {
		//按钮状态
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_FREE_ACT);
		this.freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);

		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_MOBILITYRECOVERY_SHOW);
		}


		var mobilityAdTimes = GlobalParamsFunc.instance.getDataNum("mobilityAdTimes");
		var curCount = FogModel.instance.getCountsById(FogConst.fog_free_act_count);
		this.freeLab.text = curCount + "/" + mobilityAdTimes;
	}

	onReceiveBtnClick() {
		//判断次数是否足够
		var mobilityAdTimes = GlobalParamsFunc.instance.getDataNum("mobilityAdTimes");
		var curCount = FogModel.instance.getCountsById(FogConst.fog_free_act_count);
		if (curCount >= mobilityAdTimes) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenough_freeact"));
			return;
		}
		StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_MOBILITYRECOVERY_CLICK);
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_FREE_ACT, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.successCall, this.closeCall, this);

	}

	successCall() {
		FogServer.getFreeAct({"reward": [[DataResourceType.ACT, this.mobilityPerAd]]}, () => {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_get_lab"));
			this.close();
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_MOBILITYRECOVERY_FINISH);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_MOBILITYRECOVERY_FINISH);
			}
			//飘奖励
			FogFunc.instance.flyResTween([[DataResourceType.ACT, this.mobilityPerAd]]);
		}, this);
	}

	closeCall() {

	}

	onClickClose() {
		if (!this.noExit) {
			WindowManager.OpenUI(WindowCfgs.FogTipUI, {type: FogConst.FOG_VIEW_TYPE_NOACT});
		}
		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogFreeActUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}

	}
}


