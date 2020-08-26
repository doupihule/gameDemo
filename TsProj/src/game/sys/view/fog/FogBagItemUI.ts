import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import FogBagItemDetailUI from "./FogBagItemDetailUI";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import FogFunc from "../../func/FogFunc";

export default class FogBagItemUI extends ui.gameui.fog.FogBagItemUI implements IMessage {
	private cfg;
	public itemWidth = 120;
	public itemHeight = 165;

	private itemDetailGroup: FogBagItemDetailUI;

	//道具类型：1 可升级 2 不可升级
	private ITEM_TYPE_CANUP = 1;
	private ITEM_TYPE_CANNOTUP = 2;

	constructor(cfg, owner) {
		super();
		this.cfg = cfg;

		this.setData();
		new ButtonUtils(this.item, this.onClickItem, this);
	}

	setData() {
		this.itemIcon.skin = FogFunc.instance.getFogItemIcon(this.cfg.id);

		//判断道具类型
		if (this.cfg.type == this.ITEM_TYPE_CANUP) {
			var propInfo = FogFunc.instance.getItemInfo(this.cfg.id);
			if (Number(this.cfg.num) > propInfo.maxLevel) {
				this.cfg.num = Number(propInfo.maxLevel);
			}
			this.itemLab.text = "Lv." + this.cfg.num;
		} else if (this.cfg.type == this.ITEM_TYPE_CANNOTUP) {
			this.itemLab.text = this.cfg.num;
		}
	}

	onClickItem() {
		WindowManager.OpenUI(WindowCfgs.FogBagItemDetailUI, {"cfg": this.cfg});
	}


	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}