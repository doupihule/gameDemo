import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import RolesFunc from "../../func/RolesFunc";
import RolesModel from "../../model/RolesModel";
import BattleFunc from "../../func/BattleFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";

export default class EvoPreviewUI extends ui.gameui.role.EvoPreviewUI implements IMessage {

    private roleId;
    constructor() {
        super();
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.close);
    }

    public setData(roleId) {
        this.roleId = roleId;
        var data = RolesFunc.instance.getCfgDatas("RoleStar", this.roleId);
        var myStar = RolesModel.instance.getRoleStarLevel(this.roleId);
        for (var key in data) {
            var item = data[key];
            var skill = BattleFunc.instance.getCfgDatasByKey("PassiveSkill", item.passiveSkill[0], "desc");
            var txt = this.bgImg.getChildByName("tipTxt" + item.star) as Laya.Label;
            txt.text = TranslateFunc.instance.getTranslate(skill);
            if (item.star <= myStar) {
                txt.color = "#07a40d";
            } else {
                txt.color = "#6f736f";
            }
        }
    }


    close() {
        WindowManager.CloseUI(WindowCfgs.EvoPreviewUI);
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}