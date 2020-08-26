import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";


export default class FogBagItemDetailUI extends ui.gameui.fog.FogBagItemDetailUI implements IMessage {

	private cfg;


	constructor() {
		super();
		new ButtonUtils(this.closeBtn, this.onClickClose, this);
	}

	setData(data) {
		this.cfg = data.cfg;
		this.itemUpDesc.visible = false;
		//道具名字、等级
		var itemName = TranslateFunc.instance.getTranslate(this.cfg.name, "TranslateItem");
		if (this.cfg.type == FogPropTrigger.ITEM_TYPE_CANUP) {
			var propInfo = FogFunc.instance.getItemInfo(this.cfg.id);
			if (Number(this.cfg.num) > propInfo.maxLevel) {
				this.cfg.num = Number(propInfo.maxLevel);
			}

			this.itemName.text = itemName + "   Lv." + this.cfg.num;
			var itemUpInfo = FogFunc.instance.getItemUpGradeInfo(this.cfg.id, this.cfg.num);
			if (itemUpInfo.desc) {
				this.itemUpDesc.visible = true;
				this.itemUpDesc.text = TranslateFunc.instance.getTranslate(itemUpInfo.desc, "TranslateItem");
			} else {
				this.itemUpDesc.visible = false;
			}
		} else if (this.cfg.type == FogPropTrigger.ITEM_TYPE_CANNOTUP) {
			this.itemName.text = itemName;
			this.itemUpDesc.visible = true;
			this.itemUpDesc.text = TranslateFunc.instance.getTranslate("#tid_fog_bagDetail_lab") + this.cfg.num;
		}

		//道具描述
		this.itemDesc.text = TranslateFunc.instance.getTranslate(this.cfg.desc, "TranslateItem");

		BannerAdManager.addBannerQuick(this);
	}

	onClickClose() {
		WindowManager.CloseUI(WindowCfgs.FogBagItemDetailUI);
	}


	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}