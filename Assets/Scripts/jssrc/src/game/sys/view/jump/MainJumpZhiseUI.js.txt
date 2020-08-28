"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const JumpConst_1 = require("../../consts/JumpConst");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const TableUtils_1 = require("../../../../framework/utils/TableUtils");
class MainJumpZhiseUI extends layaMaxUI_1.ui.gameui.jump.MainJumpZhiseUI {
    constructor() {
        super();
        this.imgWidth = 126;
        this.spaceX = 22;
        this.spaceY = 44;
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    setData(data) {
        var jumpData = JumpManager_1.default.getMokaDataByType(JumpConst_1.default.JUMP_TYPE_JIESUAN);
        this.initJumpData(jumpData);
    }
    /** 互推相关 */
    initJumpData(data, isDelay = false) {
        LogsManager_1.default.echo("xd 初始化结算互推", data);
        this.iconPanel.removeChildren();
        var newData = TableUtils_1.default.copyOneArr(data);
        data = newData;
        for (var i = 0; i < data.length; i++) {
            var xIndex = i % 3;
            var yIndex = Math.floor(i / 3);
            var itemData = data[i];
            // var sign;
            // if (indexArr.indexOf(i) != -1) {
            //     if (indexArr.indexOf(i) == 0) {
            //         sign = ResourceConst.JUMP_ICON_HOT;
            //     } else {
            //         sign = ResourceConst.JUMP_ICON_NEW;
            //     }
            // }
            var itemBox = JumpManager_1.default.createJumpItem(itemData, this.imgWidth, this.imgWidth, { from: JumpConst_1.default.RESULT_MIDDLE }, null, 0, true, 20, "#ffffff", false);
            itemBox.x = xIndex * (this.imgWidth + this.spaceX);
            itemBox.y = yIndex * (this.imgWidth + this.spaceY);
            this.iconPanel.addChild(itemBox);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.MainJumpZhiseUI);
    }
}
exports.default = MainJumpZhiseUI;
//# sourceMappingURL=MainJumpZhiseUI.js.map