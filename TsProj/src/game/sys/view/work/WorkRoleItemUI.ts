import {ui} from "../../../../ui/layaMaxUI";
import WorkModel from "../../model/WorkModel";
import WorkConst from "../../consts/WorkConst";
import ResourceConst from "../../consts/ResourceConst";
import RolesFunc from "../../func/RolesFunc";


export default class WorkRoleItemUI extends ui.gameui.work.WorkRoleItemUI {

	constructor() {
		super();

	}


	public setData(id): void {
		var state = WorkModel.instance.getRoleState(id);
		this.maskImg.visible = false;
		this.lockTxt.visible = false;
		this.workTxt.visible = false;
		if (state == WorkConst.WorkRole_lock) {
			this.lockTxt.visible = true;
			this.maskImg.visible = true;
		} else if (state == WorkConst.WorkRole_work) {
			this.workTxt.visible = true;
			this.maskImg.visible = true;
		}
		var data = RolesFunc.instance.getCfgDatas("Role", id)
		this.itemBg.skin = ResourceConst.BATTLE_ICON_DI[data.qualityType];
		this.itemIcon.skin = RolesFunc.instance.getBattleRoleIcon(data.battleIcon);
	}


	close() {

	}
}


