"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const ResourceConst_1 = require("../../consts/ResourceConst");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const JumpConst_1 = require("../../consts/JumpConst");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const TableUtils_1 = require("../../../../framework/utils/TableUtils");
const GameUtils_1 = require("../../../../utils/GameUtils");
class MainJumpKariquUI extends layaMaxUI_1.ui.gameui.jump.MainJumpKariquUI {
    constructor() {
        super();
        this.imgWidth = 170;
        this.spaceX = 20;
        this.spaceY = 20;
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        this.iconPanel.vScrollBarSkin = "";
    }
    setData(data) {
        var jumpData = JumpManager_1.default.getMokaDataByType(JumpConst_1.default.JUMP_KARIQU_LEFTSIDE);
        this.initJumpData(jumpData);
    }
    /** 互推相关 */
    initJumpData(data, isDelay = false) {
        LogsManager_1.default.echo("xd 初始化结算互推", data);
        this.iconPanel.removeChildren();
        var newData = TableUtils_1.default.copyOneArr(data);
        data = newData;
        var iconList = [];
        for (var i = 0; i < data.length; i++) {
            iconList.push(i);
        }
        for (var i = 0; i < data.length / 2; i++) {
            var randomNum = GameUtils_1.default.getRandomInt(0, iconList.length - 1);
            iconList.splice(randomNum, 1);
        }
        var iconHotList = TableUtils_1.default.copyOneArr(iconList);
        for (var i = 0; i < iconList.length / 2; i++) {
            var randomNum = GameUtils_1.default.getRandomInt(0, iconHotList.length - 1);
            iconHotList.splice(randomNum, 1);
        }
        data = GameUtils_1.default.shuffle(data);
        for (var i = 0; i < data.length; i++) {
            var xIndex = i % 3;
            var yIndex = Math.floor(i / 3);
            var itemData = data[i];
            var sign = iconList.indexOf(i) != -1 ? (iconHotList.indexOf(i) != -1 ? ResourceConst_1.default.JUMP_ICON_HOT : ResourceConst_1.default.JUMP_ICON_NEW) : null;
            var itemBox = JumpManager_1.default.createJumpItem(itemData, this.imgWidth, this.imgWidth, { from: JumpConst_1.default.MAIN_SIDE }, sign, 0, true, 20, "#000000", true, 50, 28, true, 6, -45);
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
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.MainJumpKariquUI);
    }
}
exports.default = MainJumpKariquUI;
//# sourceMappingURL=MainJumpKariquUI.js.map