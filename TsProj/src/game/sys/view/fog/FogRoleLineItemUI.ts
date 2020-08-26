import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import ResourceConst from "../../consts/ResourceConst";
import RolesFunc from "../../func/RolesFunc";
import RolesModel from "../../model/RolesModel"
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";

export default class FogRoleLineItemUI extends ui.gameui.fog.FogRoleLineItemUI implements IMessage {

	private cfg;
	public itemWidth = 180;
	public itemHeight = 130;
	private id;
	private isInLine = false;
	private isShowInline = true;

	constructor(cfg, owner, isShowInline = true) {
		super();
		this.cfg = cfg;
		this.id = this.cfg.id;
		this.isShowInline = isShowInline;
		this.setData();
		new ButtonUtils(this.item, this.onClickItem, this)
	}

	public setData() {
		this.qualImg.skin = ResourceConst.BATTLE_ICON_DI[this.cfg.qualityType];
		this.iconImg.skin = RolesFunc.instance.getBattleRoleIcon(this.cfg.battleIcon);
		this.isInLine = RolesModel.instance.checkRolInLine(this.id);
		this.inLineImg.visible = this.isInLine;
		this.costTxt.text = RolesFunc.instance.setEnergyCost(this.id, this.cfg.payEnergyNmb) + ""
		RolesFunc.instance.addStarImg(this.starGroup, this.id, 26, 26);

		if (this.isShowInline) {
			this.inlineGroup.visible = true;
		} else {
			this.inlineGroup.visible = false;
		}
	}

	//点击弹出详情界面
	onClickItem() {
		// 0代表显示升级 1代表显示装备
		WindowManager.OpenUI(WindowCfgs.RoleDetailUI, {id: this.id, tab: 0});
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}