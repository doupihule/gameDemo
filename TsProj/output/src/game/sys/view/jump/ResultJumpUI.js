"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const Message_1 = require("../../../../framework/common/Message");
const MsgCMD_1 = require("../../common/MsgCMD");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const JumpEvent_1 = require("../../../../framework/event/JumpEvent");
class ResultJumpUI extends layaMaxUI_1.ui.gameui.jump.ResultJumpUI {
    constructor(data, extraData, param) {
        super();
        this.imgWidth = 124;
        this.spaceX = 6;
        /**是否被按住 */
        this.isTouch = false;
        /**定时移动 */
        /**方向，是否向右移动 */
        this.isRight = true;
        this._itemMoveCode = 0;
        super.createChildren();
        ResultJumpUI.instance = this;
        this.extraData = extraData;
        // this.initData(data);
        this.data = data;
        Message_1.default.instance.add(MsgCMD_1.default.RETURN_GAMEMAIN, this);
        this.on(Laya.Event.DISPLAY, this, this.onAddToStage);
        this.on(Laya.Event.UNDISPLAY, this, this.onRemoveStage);
        // this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this )
        //     this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveStage,this )
    }
    onAddToStage() {
        this.startItemMoveLoop();
    }
    onRemoveStage() {
        this.clearMoveLoop();
    }
    initData(data) {
        LogsManager_1.default.echo("yrc111 ResultJumpUI", data);
        this.iconPanel.hScrollBarSkin = "";
        this.iconPanel.removeChildren();
        for (var i = 0; i < data.length; i++) {
            var itemData = data[i];
            var imgItem = JumpManager_1.default.createJumpItem(itemData, this.imgWidth, this.imgWidth, { from: this.extraData.from }, true);
            imgItem.x = i * (this.imgWidth + this.spaceX);
            this.iconPanel.addChild(imgItem);
        }
        this.iconPanel.on(Laya.Event.MOUSE_OUT, this, this.touchOut);
        Laya.timer.loop(10, this, this.itemMove);
    }
    /**添加移动定时器 */
    startItemMoveLoop() {
        this.clearMoveLoop();
        this._itemMoveCode = TimerManager_1.default.instance.add(this.itemMove, this, 10);
        // egret.timer.loop(10, this, this.itemMove);
    }
    setFrom(from) {
        this.extraData.from = from;
    }
    /**按下item */
    touchDownItem() {
        this.isTouch = true;
        if (this.touchEndCode) {
            TimerManager_1.default.instance.remove(this.touchEndCode);
        }
    }
    /**移除定时器 */
    clearMoveLoop() {
        TimerManager_1.default.instance.remove(this._itemMoveCode);
    }
    /**icon左右移动 */
    itemMove() {
        if (this.isTouch)
            return;
        var moveX = 1;
        var curX = this.iconPanel.hScrollBar.value;
        var moveWidth = this.iconPanel.contentWidth - this.iconPanel.width;
        if (this.isRight && curX >= moveWidth) {
            this.isRight = false;
        }
        if (!this.isRight && curX <= 0) {
            this.isRight = true;
        }
        if (!this.isRight) {
            moveX = -1;
        }
        this.iconPanel.hScrollBar.value += moveX;
    }
    /**手指从这里抬起 */
    touchOut() {
        this.touchEndCode = TimerManager_1.default.instance.setTimeout(() => { this.isTouch = false; }, this, 2000);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case JumpEvent_1.default.JUMP_RETURN_GAMEMAIN:
                this.clearMoveLoop();
                break;
        }
    }
}
exports.default = ResultJumpUI;
ResultJumpUI.res = [
    "gameui/ResultJump.scene",
];
ResultJumpUI.instance = null;
//# sourceMappingURL=ResultJumpUI.js.map