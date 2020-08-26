"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
/**两排互推UI，每排五个，不可滚动 */
class ResultJumpDoubleUI extends layaMaxUI_1.ui.gameui.jump.ResultJumpDoubleUI {
    constructor(data, iconSize, type, from) {
        super();
        this.imgWidth = 90;
        this.spaceX = 6;
        this.isFirstInit = true;
        /**是否被按住 */
        this.isTouch = false;
        /**第二排是否被按住 */
        this.isSecondTouch = false;
        /**方向，是否向右移动 */
        this.isRight = true;
        /**第二排icon的移动方向 */
        this.isSecondRight = true;
        super.createChildren();
        // Message.instance.add(EventType.RETURN_GAMEMAIN, this);
        if (iconSize) {
            this.imgWidth = iconSize;
            var addY = iconSize - 90;
            var scale = iconSize / 90;
            this.height = 234 + addY * 2;
            this.bg.height = 236 + addY * 2;
            this.iconBg.height = 104 + addY;
            this.iconPanel.height = 104 + addY;
            this.secondIconBg.height = 104 + addY;
            this.secondIconPanel.height = 104 + addY;
            this.secondIconBg.y = 118 + addY;
            this.secondIconPanel.y = 118 + addY;
            this.tipLab.fontSize = 22 * scale;
            this.tipLab.width *= scale;
            this.tipLab.height *= scale;
            if (iconSize == 150) {
                this.tipLab.visible = false;
                var offsetX = 56;
                this.iconBg.x -= offsetX;
                this.iconBg.width += offsetX;
                this.iconPanel.x -= offsetX;
                this.iconPanel.width += offsetX;
                this.secondIconBg.x -= offsetX;
                this.secondIconBg.width += offsetX;
                this.secondIconPanel.x -= offsetX;
                this.secondIconPanel.width += offsetX;
            }
        }
        this.fromWhere = from;
        LogsManager_1.default.echo("fromWhiere-----------------", this.fromWhere);
        this.initData(data, type);
    }
    setFrom(from) {
        this.fromWhere = from;
    }
    initData(data, type) {
        // data = this.getRandomArr(data);
        var firstData = [];
        var secondData = [];
        var length = 5;
        this.resultTitle.visible = false;
        if (type) {
            // this.resultTitle.visible = true;
            // this.tipLab.visible = false;
            length = 3;
        }
        for (var i = 0; i < data.length; i++) {
            var jumpData = data[i];
            if (jumpData) {
                if (i < length) {
                    firstData.push(jumpData);
                }
                else {
                    secondData.push(jumpData);
                }
            }
        }
        this.initIconPanel(firstData, type);
        this.initSecondIconPanel(secondData, type);
    }
    initIconPanel(data, type) {
        if (type) {
            // this.iconPanel.hScrollBar.mouseEnabled = false;
            this.iconBg.width = 3 * (this.imgWidth + this.spaceX);
            this.iconPanel.width = 3 * (this.imgWidth + this.spaceX);
        }
        else {
            this.iconPanel.hScrollBarSkin = "";
        }
        this.iconPanel.removeChildren();
        var startY = 7;
        var redWidth = 20 * this.imgWidth / 90;
        var redOffset = 3;
        var length = data.length * 4;
        if (type) {
            length = data.length;
        }
        for (var i = 0; i < length; i++) {
            var index = i % data.length;
            var itemData = data[index];
            var itemBox = new Laya.Box();
            itemBox.width = this.imgWidth;
            itemBox.height = this.imgWidth;
            itemBox.x = i * (this.imgWidth + this.spaceX);
            var imgItem = new Laya.Image(itemData.Icon);
            imgItem.width = this.imgWidth;
            imgItem.height = this.imgWidth;
            imgItem.y = startY;
            itemBox.addChild(imgItem);
            var redImg = new Laya.Image("uisource/main/main_tishi.png");
            itemBox.addChild(redImg);
            redImg.width = redImg.height = redWidth;
            redImg.x = this.imgWidth - redWidth + redOffset;
            redImg.y = startY - redOffset;
            itemBox.on(Laya.Event.CLICK, this, this.clickItem, [itemData]);
            itemBox.on(Laya.Event.MOUSE_DOWN, this, this.touchDownItem, [false]);
            this.iconPanel.addChild(itemBox);
        }
        this.moveWidth = this.iconPanel.contentWidth - this.iconPanel.width;
        this.iconPanel.on(Laya.Event.MOUSE_OUT, this, this.touchOut);
        this.startItemMoveLoop();
    }
    /**添加移动定时器 */
    startItemMoveLoop() {
        if (this.isFirstInit) {
            TimerManager_1.default.instance.setTimeout(() => {
                this.isFirstInit = false;
                this.secondIconPanel.hScrollBar.value = this.moveWidth;
                Laya.timer.loop(10, this, this.itemMove);
            }, this, 10);
        }
        else {
            Laya.timer.loop(10, this, this.itemMove);
        }
    }
    /**初始化第二排的iconPanel */
    initSecondIconPanel(data, type) {
        if (type) {
            // this.secondIconPanel.hScrollBar.mouseEnabled = false;
            this.secondIconBg.width = 3 * (this.imgWidth + this.spaceX);
            this.secondIconPanel.width = 3 * (this.imgWidth + this.spaceX);
        }
        else {
            this.secondIconPanel.hScrollBarSkin = "";
        }
        this.secondIconPanel.removeChildren();
        var startY = 7;
        var redWidth = 20 * this.imgWidth / 90;
        var redOffset = 3;
        var length = data.length * 4;
        if (type) {
            length = data.length;
        }
        for (var i = 0; i < length; i++) {
            var index = i % data.length;
            var itemData = data[index];
            var itemBox = new Laya.Box();
            itemBox.width = this.imgWidth;
            itemBox.height = this.imgWidth;
            itemBox.x = i * (this.imgWidth + this.spaceX);
            var imgItem = new Laya.Image(itemData.Icon);
            imgItem.width = this.imgWidth;
            imgItem.height = this.imgWidth;
            imgItem.y = startY;
            itemBox.addChild(imgItem);
            var redImg = new Laya.Image("uisource/main/main_tishi.png");
            itemBox.addChild(redImg);
            redImg.width = redImg.height = redWidth;
            redImg.x = this.imgWidth - redWidth + redOffset;
            redImg.y = startY - redOffset;
            itemBox.on(Laya.Event.CLICK, this, this.clickItem, [itemData]);
            itemBox.on(Laya.Event.MOUSE_DOWN, this, this.touchDownItem, [true]);
            this.secondIconPanel.addChild(itemBox);
        }
        this.moveWidth = this.secondIconPanel.contentWidth - this.secondIconPanel.width;
        this.secondIconPanel.on(Laya.Event.MOUSE_OUT, this, this.secondTouchOut);
    }
    /**按下item */
    touchDownItem(isDouble) {
        if (isDouble) {
            this.isSecondTouch = true;
            if (this.touchSecondEndCode) {
                TimerManager_1.default.instance.remove(this.touchSecondEndCode);
            }
        }
        else {
            this.isTouch = true;
            if (this.touchEndCode) {
                TimerManager_1.default.instance.remove(this.touchEndCode);
            }
        }
    }
    /**icon左右移动 */
    itemMove() {
        if (!this.isTouch) {
            var moveX = 1;
            var curX = this.iconPanel.hScrollBar.value;
            if (this.isRight && curX >= this.moveWidth) {
                // this.isRight = false;
                moveX = -curX;
            }
            // if (!this.isRight && curX <= 0) {
            //     this.isRight = true;
            // }
            // if (!this.isRight) {
            //     moveX = -1;
            // }
            this.iconPanel.hScrollBar.value += moveX;
        }
        if (!this.isSecondTouch) {
            var moveX = 1;
            var curX = this.secondIconPanel.hScrollBar.value;
            if (this.isSecondRight && curX >= this.moveWidth) {
                // this.isSecondRight = false;
                moveX = -curX;
            }
            // if (!this.isSecondRight && curX <= 0) {
            //     this.isSecondRight = true;
            // }
            // if (!this.isSecondRight) {
            //     moveX = -1;
            // }
            this.secondIconPanel.hScrollBar.value += moveX;
        }
    }
    /**手指从这里抬起 */
    touchOut(isDouble) {
        this.touchEndCode = TimerManager_1.default.instance.setTimeout(() => { this.isTouch = false; }, this, 2000);
    }
    secondTouchOut() {
        this.touchSecondEndCode = TimerManager_1.default.instance.setTimeout(() => { this.isSecondTouch = false; }, this, 2000);
    }
    /**点击图片 */
    clickItem(data) {
        var sendData = {
            appId: data.GameAppId,
            path: data.PromoteLink,
            jumpData: data,
            from: this.fromWhere
        };
        UserInfo_1.default.platform.jumpToMiniProgram(sendData);
    }
    /**移除定时器 */
    clearMoveLoop() {
        Laya.timer.clear(this, this.itemMove);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            // case EventType.RETURN_GAMEMAIN:
            //     this.clearMoveLoop();
            //     break;
        }
    }
    getRandomArr(data) {
        return data.sort(() => {
            return Math.random() > 0.5 ? -1 : 1;
        });
    }
}
exports.default = ResultJumpDoubleUI;
ResultJumpDoubleUI.res = [
    "gameui/ResultJumpDouble.scene",
];
ResultJumpDoubleUI._instance = null;
//# sourceMappingURL=ResultJumpDoubleUI.js.map