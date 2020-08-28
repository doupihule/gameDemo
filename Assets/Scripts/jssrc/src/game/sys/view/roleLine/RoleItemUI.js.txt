"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ResourceConst_1 = require("../../consts/ResourceConst");
const RolesFunc_1 = require("../../func/RolesFunc");
const RolesModel_1 = require("../../model/RolesModel");
class RoleItemUI extends layaMaxUI_1.ui.gameui.roleLine.RoleItemUI {
    constructor(cfg, owner, isShowInline = true) {
        super();
        this.itemWidth = 180;
        this.itemHeight = 130;
        this.isInLine = false;
        this.isShowInline = true;
        this.cfg = cfg;
        this.id = this.cfg.id;
        this.isShowInline = isShowInline;
        this.owner = owner;
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
    onClickItem() {
        if (!this.isInLine) {
            if (this.owner.isCanLine()) {
                this.owner.freshRoleInLine(this.id);
            }
        }
        else {
            //在阵上的下阵
            this.owner.freshRoleInLine(this.id);
            this.owner.hideSpeakInfo();
        }
    }
    freshImgVis() {
        if (this.owner.curData[this.id] && this.owner.curData[this.id].inLine) {
            this.isInLine = true;
        }
        else {
            this.isInLine = false;
        }
        this.inLineImg.visible = this.isInLine;
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = RoleItemUI;
//# sourceMappingURL=RoleItemUI.js.map