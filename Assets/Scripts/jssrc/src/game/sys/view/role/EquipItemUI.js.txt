"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const RolesFunc_1 = require("../../func/RolesFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
class EquipItemUI extends layaMaxUI_1.ui.gameui.role.EquipItemUI {
    constructor() {
        super();
        this.width = 120;
        this.height = 110;
        new ButtonUtils_1.ButtonUtils(this.bgImg, this.onClickItem, this);
    }
    setData(roleId, equipId, index) {
        this.roleId = roleId;
        this.equipId = equipId;
        this.index = index;
        this.equpInfo = RolesFunc_1.default.instance.getCfgDatas("Equip", this.equipId);
        this.freshState();
    }
    //刷新状态
    freshState() {
        this.state = RolesFunc_1.default.instance.getEquipState(this.roleId, this.equipId, true);
        this.noEquipGroup.visible = false;
        this.composeGroup.visible = false;
        this.bgImg.skin = ResourceConst_1.default.EQUIP_QUAL_DI[this.equpInfo.quality];
        if (this.equpInfo.icon) {
            this.iconImg.skin = RolesFunc_1.default.instance.getEquipIcon(this.equpInfo.icon);
        }
        Laya.Tween.clearTween(this.composeTxt);
        this.iconImg.y = 55;
        if (this.state == RolesFunc_1.default.STATE_NOEQUIP) {
            //没装备
            this.noEquipGroup.visible = true;
            this.bgImg.skin = ResourceConst_1.default.EQUIP_QUAL_DI["6"];
            this.iconImg.skin = ResourceConst_1.default.EQUIP_NO_ICON[this.index];
        }
        else if (this.state == RolesFunc_1.default.STATE_CANCOMPOSE) {
            //可合成
            this.composeGroup.visible = true;
            this.bgImg.skin = ResourceConst_1.default.EQUIP_QUAL_DI["6"];
            this.iconImg.skin = ResourceConst_1.default.EQUIP_NO_ICON[this.index];
            this.composeTxt.alpha = 1;
        }
        else {
            this.iconImg.y = 70;
        }
    }
    freshComposeTxt() {
        if (this.state == RolesFunc_1.default.STATE_CANCOMPOSE) {
            TweenAniManager_1.default.instance.fadeOutAni(this.composeTxt, this.hideTxt, 300, this, 1, 0);
        }
    }
    hideTxt() {
        TweenAniManager_1.default.instance.fadeInAni(this.composeTxt, null, 200, this, 0, 1);
    }
    //点击item
    onClickItem() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.EquipComposeUI, { roleId: this.roleId, equipId: this.equipId });
    }
    close() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = EquipItemUI;
//# sourceMappingURL=EquipItemUI.js.map