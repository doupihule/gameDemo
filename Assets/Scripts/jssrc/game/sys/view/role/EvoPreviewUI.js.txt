"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const RolesFunc_1 = require("../../func/RolesFunc");
const RolesModel_1 = require("../../model/RolesModel");
const BattleFunc_1 = require("../../func/BattleFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
class EvoPreviewUI extends layaMaxUI_1.ui.gameui.role.EvoPreviewUI {
    constructor() {
        super();
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.close);
    }
    setData(roleId) {
        this.roleId = roleId;
        var data = RolesFunc_1.default.instance.getCfgDatas("RoleStar", this.roleId);
        var myStar = RolesModel_1.default.instance.getRoleStarLevel(this.roleId);
        for (var key in data) {
            var item = data[key];
            var skill = BattleFunc_1.default.instance.getCfgDatasByKey("PassiveSkill", item.passiveSkill[0], "desc");
            var txt = this.bgImg.getChildByName("tipTxt" + item.star);
            txt.text = TranslateFunc_1.default.instance.getTranslate(skill);
            if (item.star <= myStar) {
                txt.color = "#07a40d";
            }
            else {
                txt.color = "#6f736f";
            }
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.EvoPreviewUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = EvoPreviewUI;
//# sourceMappingURL=EvoPreviewUI.js.map