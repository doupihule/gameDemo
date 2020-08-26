import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";


export default class FogStartWarUI extends ui.gameui.fog.FogStartWarUI implements IMessage {

	private thisObj;
	private callBack;

	constructor() {
		super();
		new ButtonUtils(this.confirmBtn, this.onClickConfirm, this);
		new ButtonUtils(this.btn_close, this.close, this);
		new ButtonUtils(this.returnBtn, this.close, this);

	}

	setData(data): void {
		this.thisObj = data.thisObj;
		this.callBack = data.callBack;
		this.descLab.text = TranslateFunc.instance.getTranslate("#tid_fog_start_war")
		BannerAdManager.addBannerQuick(this);
	}

	onClickConfirm() {
		this.callBack && this.callBack.call(this.thisObj)
		this.close()
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogStartWarUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}

	}
}


