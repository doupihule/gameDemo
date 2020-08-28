"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const RolesFunc_1 = require("../../func/RolesFunc");
const TaskChatFunc_1 = require("../../func/TaskChatFunc");
class ChatItemUI extends layaMaxUI_1.ui.gameui.task.ChatItemUI {
    constructor() {
        super();
        this.itemWidth = 24;
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.info = data.info;
        this.roleId = data.roleId;
        this.leftGroup.visible = false;
        this.rightGroup.visible = false;
        var role = TaskChatFunc_1.default.instance.getCfgDatasByKey("TaskRole", this.roleId, "icon");
        if (this.info.type == 1) {
            this.leftGroup.visible = true;
            this.myIcon.skin = RolesFunc_1.default.instance.getBattleRoleIcon(role);
        }
        else {
            this.rightGroup.visible = true;
        }
        this.setTxt(this.info.info);
    }
    setTxt(txt) {
        var lbl;
        var bg;
        if (this.info.type == 1) {
            lbl = this.leftTxt;
            bg = this.leftBg;
        }
        else {
            lbl = this.rightTxt;
            bg = this.rightBg;
        }
        lbl.text = txt;
        var row = Math.ceil((txt.length + 2) * this.itemWidth / lbl.width);
        lbl.height = 24 * row;
        bg.width = lbl.width + 20;
        bg.height = lbl.height + 22 * row;
        this.height = bg.height + 50;
    }
    recvMsg(cmd, data) {
    }
    close() {
    }
}
exports.default = ChatItemUI;
//# sourceMappingURL=ChatItemUI.js.map