"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ResourceConst_1 = require("../../consts/ResourceConst");
const RolesFunc_1 = require("../../func/RolesFunc");
const RolesModel_1 = require("../../model/RolesModel");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
class FogRoleLineItemUI extends layaMaxUI_1.ui.gameui.fog.FogRoleLineItemUI {
    constructor(cfg, owner, isShowInline = true) {
        super();
        this.itemWidth = 180;
        this.itemHeight = 130;
        this.isInLine = false;
        this.isShowInline = true;
        this.cfg = cfg;
        this.id = this.cfg.id;
        this.isShowInline = isShowInline;
        this.setData();
        new ButtonUtils_1.ButtonUtils(this.item, this.onClickItem, this);
    }
    setData() {
        this.qualImg.skin = ResourceConst_1.default.BATTLE_ICON_DI[this.cfg.qualityType];
        this.iconImg.skin = RolesFunc_1.default.instance.getBattleRoleIcon(this.cfg.battleIcon);
        this.isInLine = RolesModel_1.default.instance.checkRolInLine(this.id);
        this.inLineImg.visible = this.isInLine;
        this.costTxt.text = RolesFunc_1.default.instance.setEnergyCost(this.id, this.cfg.payEnergyNmb) + "";
        RolesFunc_1.default.instance.addStarImg(this.starGroup, this.id, 26, 26);
        if (this.isShowInline) {
            this.inlineGroup.visible = true;
        }
        else {
            this.inlineGroup.visible = false;
        }
    }
    //点击弹出详情界面
    onClickItem() {
        // 0代表显示升级 1代表显示装备
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.RoleDetailUI, { id: this.id, tab: 0 });
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogRoleLineItemUI;
//# sourceMappingURL=FogRoleLineItemUI.js.map