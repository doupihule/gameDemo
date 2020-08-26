import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import RolesFunc from "../../func/RolesFunc";
import ResourceConst from "../../consts/ResourceConst";
import TweenAniManager from "../../manager/TweenAniManager";


export default class EquipItemUI extends ui.gameui.role.EquipItemUI implements IMessage {

    public width = 120;
    public height = 110;
    private roleId;
    private equipId;
    private state;
    private equpInfo;
    //当前第几个装备
    private index;

    constructor() {
        super();
        new ButtonUtils(this.bgImg, this.onClickItem, this)
    }

    public setData(roleId, equipId, index) {
        this.roleId = roleId;
        this.equipId = equipId;
        this.index = index;
        this.equpInfo = RolesFunc.instance.getCfgDatas("Equip", this.equipId)
        this.freshState();

    }
    //刷新状态
    freshState() {
        this.state = RolesFunc.instance.getEquipState(this.roleId, this.equipId,true);
        this.noEquipGroup.visible = false;
        this.composeGroup.visible = false;
        this.bgImg.skin = ResourceConst.EQUIP_QUAL_DI[this.equpInfo.quality];
        if (this.equpInfo.icon) {
            this.iconImg.skin = RolesFunc.instance.getEquipIcon(this.equpInfo.icon);
        }
        Laya.Tween.clearTween(this.composeTxt)
        this.iconImg.y = 55;
        if (this.state == RolesFunc.STATE_NOEQUIP) {
            //没装备
            this.noEquipGroup.visible = true;
            this.bgImg.skin = ResourceConst.EQUIP_QUAL_DI["6"];
            this.iconImg.skin = ResourceConst.EQUIP_NO_ICON[this.index];
        } else if (this.state == RolesFunc.STATE_CANCOMPOSE) {
            //可合成
            this.composeGroup.visible = true;
            this.bgImg.skin = ResourceConst.EQUIP_QUAL_DI["6"];
            this.iconImg.skin = ResourceConst.EQUIP_NO_ICON[this.index];
            this.composeTxt.alpha = 1;
        } else {
            this.iconImg.y = 70;
        }
    }
    freshComposeTxt() {
        if (this.state == RolesFunc.STATE_CANCOMPOSE) {
            TweenAniManager.instance.fadeOutAni(this.composeTxt, this.hideTxt, 300, this, 1, 0)
        }
    }
    hideTxt() {
        TweenAniManager.instance.fadeInAni(this.composeTxt, null, 200, this, 0, 1);
    }
    //点击item
    onClickItem() {
        WindowManager.OpenUI(WindowCfgs.EquipComposeUI, { roleId: this.roleId, equipId: this.equipId });

    }
    close() {

    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}