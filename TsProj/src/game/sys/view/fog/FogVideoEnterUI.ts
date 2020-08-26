import IMessage from "../../interfaces/IMessage";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import CountsModel from "../../model/CountsModel";
import CountsServer from "../../server/CountsServer";
import StatisticsManager from "../../manager/StatisticsManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";

export default class FogVideoEnterUI extends ui.gameui.fog.FogVideoEnterUI implements IMessage {

	/** 广告还是分享  */
	private freeType: number
	private callBack;
	private thisObj;

	constructor() {
		super();
		this.initBtn();
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_VIDEO_START);

	}

	initBtn() {
		new ButtonUtils(this.receiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.closeBtn, this.close, this);
	}

	public setData(data): void {
		this.callBack = null;
		this.thisObj = null;

		if (data && data.callBack) {
			this.callBack = data.callBack;
		}
		if (data && data.thisObj) {
			this.thisObj = data.thisObj;
		}

		this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_video_start");
		this.receiveImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_START_SHOW);
		}

		//次数更新
		var userFogStreetVideoCount = CountsModel.instance.getCountsById(CountsModel.fogStreetVideoCount);
		var fogStreetVideoTimes = GlobalParamsFunc.instance.getDataNum("fogStreetVideoTimes");
		this.countLab.text = userFogStreetVideoCount + "/" + fogStreetVideoTimes;
	}

	onReceiveBtnClick() {
		if (this.freeType == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_START_CLICK);
		}
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_VIDEO_START, ShareOrTvManager.TYPE_ADV, {
			id: "1",
			extraData: {}
		}, this.successCall, this.failCall, this);
	}

	successCall() {
		CountsServer.updateCount({"id": CountsModel.fogStreetVideoCount}, () => {
			this.callBack && this.callBack.call(this.thisObj);
			this.close();
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_START_FINISH);
			} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_START_FINISH);
			}
		}, this);
	}

	failCall() {

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogVideoEnterUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}

	}
}


