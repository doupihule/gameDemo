import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import {LoadManager} from "../../../../framework/manager/LoadManager";
import FogModel from "../../model/FogModel";
import FogFunc from "../../func/FogFunc";
import FogBagItemUI from "./FogBagItemUI";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";


export default class FogBagUI extends ui.gameui.fog.FogBagUI implements IMessage {

	private propList;//道具数组

	constructor() {
		super();
		new ButtonUtils(this.btn_close, this.close, this);
	}

	public setData() {
		this.propList = [];
		this.initBagPanel();
		BannerAdManager.addBannerQuick(this);
		AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_FogBag, this);
		this.itemPanel.vScrollBarSkin = "";
		//标题
		this.titleLab.text = TranslateFunc.instance.getTranslate("tid_fog_bag");
	}

	initBagPanel() {
		var props = FogModel.instance.getProp();

		for (var key in props) {
			if (props.hasOwnProperty(key)) {
				var cfg = FogFunc.instance.getItemInfo(key);
				if (props[key]) {
					cfg["num"] = props[key];
					this.propList.push(cfg);
				}
			}
		}
		var res = WindowManager.getUILoadGroup(WindowCfgs.FogBagItemUI) || [];
		var resAll = [];
		for (var url of res) {
			resAll.push(url);
		}
		LoadManager.instance.load(resAll, Laya.Handler.create(this, this.iniPanelData));

	}

	iniPanelData() {
		this.itemPanel.removeChildren();
		for (var i = 0; i < this.propList.length; i++) {
			var item = this.propList[i];
			var bagItem: FogBagItemUI = new FogBagItemUI(item, this);
			this.itemPanel.addChild(bagItem);
			bagItem.x = i % 4 * (bagItem.itemWidth + 10);
			bagItem.y = Math.floor(i / 4) * bagItem.itemHeight;
		}
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogBagUI);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}