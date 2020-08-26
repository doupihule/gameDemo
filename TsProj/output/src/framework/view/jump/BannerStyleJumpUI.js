"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../../manager/LogsManager");
const ScreenAdapterTools_1 = require("../../utils/ScreenAdapterTools");
const JumpManager_1 = require("../../manager/JumpManager");
const TimerManager_1 = require("../../manager/TimerManager");
const BannerStyleJumpComp_1 = require("../../platform/comp/BannerStyleJumpComp");
class BannerStyleJumpUI extends Laya.View {
    constructor() {
        super();
        this.imgWidth = 160;
        this.spaceX = 8;
        /**是否被按住 */
        this.isTouch = false;
        /**定时移动 */
        /**方向，是否向右移动 */
        this.isRight = true;
        //剩余等待时间
        this._leftWaitFrame = 120;
        //剩余移动时间
        this._leftMoveFrame = 120;
        //移动速度
        this._moveSpeed = 2;
        //总移动距离
        this._moveTotalWid = 0;
        this._itemMoveCode = 0;
        this.moveCount = 0;
        super.createChildren();
        this.imgWidth = BannerStyleJumpComp_1.default.jumpHeight - 10;
        this._moveSpeed = (this.imgWidth + this.spaceX) / BannerStyleJumpUI.perMoveFrame;
        this._leftMoveFrame = BannerStyleJumpUI.perMoveFrame;
        // this.initData(data);
        this.backRect = new Laya.Sprite();
        this.backRect.graphics.drawRect(0, 0, ScreenAdapterTools_1.default.width, BannerStyleJumpComp_1.default.jumpHeight, "#000000", "#666666", 1);
        this.backRect.alpha = 0.3;
        this.addChild(this.backRect);
        this.iconPanel = new Laya.Panel();
        this.iconPanel.x = 0;
        this.iconPanel.y = 0;
        this.iconPanel.width = ScreenAdapterTools_1.default.width;
        this.iconPanel.height = BannerStyleJumpComp_1.default.jumpHeight;
        this.addChild(this.iconPanel);
        this.width = ScreenAdapterTools_1.default.width;
        this.height = this.imgWidth;
        this.on(Laya.Event.DISPLAY, this, this.onAddToStage);
        this.on(Laya.Event.UNDISPLAY, this, this.onRemoveStage);
    }
    onAddToStage() {
        TimerManager_1.default.instance.deleteObjUpdate(null, this.updateFrame, this);
        TimerManager_1.default.instance.registObjUpdate(this.updateFrame, this);
    }
    //移除舞台 就移除刷新函数
    onRemoveStage() {
        TimerManager_1.default.instance.deleteObjUpdate(null, this.updateFrame, this);
    }
    initData(data, from) {
        LogsManager_1.default.echo("yrc111 ResultJumpUI", data);
        this.iconPanel.hScrollBarSkin = "";
        this.iconPanel.removeChildren();
        for (var i = 0; i < data.length; i++) {
            var itemData = data[i];
            var imgItem = JumpManager_1.default.createJumpItem(itemData, this.imgWidth, this.imgWidth, { from: from }, null, null, false);
            imgItem.x = i * (this.imgWidth + this.spaceX);
            this.iconPanel.addChild(imgItem);
        }
        //总移动范围
        this._moveTotalWid = data.length * (this.imgWidth + this.spaceX) - this.spaceX;
        this.iconPanel.on(Laya.Event.MOUSE_OUT, this, this.touchOut);
        this.onAddToStage();
    }
    updateFrame() {
        //如果是按下状态 不执行
        if (this.isTouch) {
            return;
        }
        //如果剩余等待时间没到
        if (this._leftWaitFrame > 0) {
            this._leftWaitFrame--;
            return;
        }
        if (this._leftMoveFrame > 0) {
            this._leftMoveFrame--;
            this.itemMove();
            //运动时间到了之后开始等待
            if (this._leftMoveFrame == 0) {
                this._leftMoveFrame = BannerStyleJumpUI.perMoveFrame;
                this._leftWaitFrame = BannerStyleJumpUI.perWaitFrame;
                LogsManager_1.default.echo("_oneframemvoe");
            }
        }
    }
    /**按下item */
    touchDownItem() {
        this.isTouch = true;
        if (this.touchEndCode) {
            TimerManager_1.default.instance.remove(this.touchEndCode);
        }
    }
    /**icon左右移动 */
    itemMove() {
        var moveX = this._moveSpeed;
        if (!this.isRight) {
            moveX = -this._moveSpeed;
        }
        // LogsManager.echo("__movecount:",this._leftMoveFrame,"way:",this.isRight);
        var curX = this.iconPanel.hScrollBar.value;
        var moveWidth = this.iconPanel.contentWidth - this.iconPanel.width;
        if (this.isRight && curX >= moveWidth) {
            this.isRight = false;
        }
        if (!this.isRight && curX <= 0) {
            this.isRight = true;
        }
        this.iconPanel.hScrollBar.value += moveX;
    }
    /**手指从这里抬起 */
    touchOut() {
        this.touchEndCode = TimerManager_1.default.instance.setTimeout(() => { this.isTouch = false; }, this, 2000);
    }
    recvMsg(cmd, data) {
    }
}
exports.default = BannerStyleJumpUI;
//每移动一格等待时间
BannerStyleJumpUI.perWaitFrame = 120;
BannerStyleJumpUI.perMoveFrame = 30; //每次移动的时间是0.5秒
//# sourceMappingURL=BannerStyleJumpUI.js.map