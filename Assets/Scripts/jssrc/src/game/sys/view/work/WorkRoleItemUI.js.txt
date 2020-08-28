"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WorkModel_1 = require("../../model/WorkModel");
const WorkConst_1 = require("../../consts/WorkConst");
const ResourceConst_1 = require("../../consts/ResourceConst");
const RolesFunc_1 = require("../../func/RolesFunc");
class WorkRoleItemUI extends layaMaxUI_1.ui.gameui.work.WorkRoleItemUI {
    constructor() {
        super();
    }
    setData(id) {
        var state = WorkModel_1.default.instance.getRoleState(id);
        this.maskImg.visible = false;
        this.lockTxt.visible = false;
        this.workTxt.visible = false;
        if (state == WorkConst_1.default.WorkRole_lock) {
            this.lockTxt.visible = true;
            this.maskImg.visible = true;
        }
        else if (state == WorkConst_1.default.WorkRole_work) {
            this.workTxt.visible = true;
            this.maskImg.visible = true;
        }
        var data = RolesFunc_1.default.instance.getCfgDatas("Role", id);
        this.itemBg.skin = ResourceConst_1.default.BATTLE_ICON_DI[data.qualityType];
        this.itemIcon.skin = RolesFunc_1.default.instance.getBattleRoleIcon(data.battleIcon);
    }
    close() {
    }
}
exports.default = WorkRoleItemUI;
//# sourceMappingURL=WorkRoleItemUI.js.map