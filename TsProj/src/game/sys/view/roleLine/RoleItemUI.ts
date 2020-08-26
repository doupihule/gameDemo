import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ResourceConst from "../../consts/ResourceConst";
import RolesFunc from "../../func/RolesFunc";
import RolesModel from "../../model/RolesModel";
import RoleInLineUI from "./RoleInLineUI";

export default class RoleItemUI extends ui.gameui.roleLine.RoleItemUI implements IMessage {

	private cfg;
	public itemWidth = 180;
	public itemHeight = 130;
	private id;
	private isInLine = false;
	private isShowInline = true;
	private owner: RoleInLineUI;

	constructor(cfg, owner, isShowInline = true) {
		super();
		this.cfg = cfg;
		this.id = this.cfg.id;
		this.isShowInline = isShowInline;
		this.owner = owner;
		this.setData();
		new ButtonUtils(this.item, this.onClickItem, this);
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

	onClickItem() {
		if (!this.isInLine) {
			if (this.owner.isCanLine()) {
				this.owner.freshRoleInLine(this.id);
			}
		} else {
			//在阵上的下阵
			this.owner.freshRoleInLine(this.id);
			this.owner.hideSpeakInfo();
		}

	}

	freshImgVis() {
		if (this.owner.curData[this.id] && this.owner.curData[this.id].inLine) {
			this.isInLine = true;

		} else {
			this.isInLine = false;
		}
		this.inLineImg.visible = this.isInLine

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}