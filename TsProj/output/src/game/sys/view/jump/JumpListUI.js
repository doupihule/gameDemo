"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const Equation_1 = require("../../../../framework/utils/Equation");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const JumpConst_1 = require("../../consts/JumpConst");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const ControlConst_1 = require("../../../../framework/consts/ControlConst");
const ResourceConst_1 = require("../../consts/ResourceConst");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
class JumpListUI extends layaMaxUI_1.ui.gameui.jump.JumpListUI {
    constructor() {
        super();
        this._itemMoveCode = 0;
        this.listData = [];
        this.lineCount = 2;
        this.itemWidth = 178;
        this.itemHeight = 211;
        this.imgWidth = 155;
        this.spaceX = 22;
        this.spaceY = 20;
        this.isInit = false;
        this.isFirstInit = true;
        /**是否被按住 */
        this.isTouch = false;
        /**方向，是否向下移动 */
        this.isDown = true;
        this.fakeNumList = [];
        ScreenAdapterTools_1.default.alignNotch(this.closeBtn);
        ScreenAdapterTools_1.default.alignNotch(this.midTopGroup);
        // 动态调整列表长度
        this.iconPanel2.height += ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        this.iconPanel2.vScrollBarSkin = "";
    }
    setData(data) {
        var fakeNumList = GlobalParamsFunc_1.default.instance.getGlobalCfgDatas("electAdvertisingNub").arr;
        for (var index in fakeNumList) {
            this.fakeNumList.push(fakeNumList[index]);
        }
        this.fakeNumList = this.fakeNumList.sort(() => {
            return Math.random() < 0.5 ? 1 : -1;
        });
        this.closeCallback = null;
        this.closeThisObj = null;
        if (data && data[0] && data[0].callback) {
            this.closeCallback = data[0].callback;
            this.closeThisObj = data[0].thisObj;
        }
        if (data && data[0] && data[0].from) {
            this.fromWhere = data[0].from;
        }
        JumpManager_1.default.setFrom = this.fromWhere;
        JumpManager_1.default.isInDrawer = true;
        this.initView();
        JumpManager_1.default.mtDrawer(this.listData);
    }
    initView() {
        //初始化列表1
        var size1 = 120;
        this.iconPanel1.removeChildren();
        var headListData = JumpManager_1.default.getMokaData(1, 10);
        if (!headListData) {
            return;
        }
        //按照权重随机
        var len = headListData.length;
        var startIndex = len - 4;
        //头部显示的数量原则上最少显示4个
        var headNums;
        if (len < 4) {
            headNums = len;
        }
        else {
            headNums = 4;
        }
        if (startIndex < 0) {
            startIndex = 0;
        }
        if (!this.listData)
            return;
        for (var i = 0; i < headNums; i++) {
            var itemData = headListData[i + startIndex];
            var itemGroup = JumpManager_1.default.createJumpItem(itemData, size1, size1, { from: JumpConst_1.default.JUMPLIST }, false, 0, false);
            itemGroup.x = (i % 4) * (size1 + 20) + 10;
            itemGroup.y = Math.floor(i / 4) * (size1 + 10) + 5;
            this.iconPanel1.addChild(itemGroup);
        }
        this.moveHeight = this.iconPanel1.contentHeight - this.iconPanel1.height;
        this.iconPanel1.on(Laya.Event.MOUSE_UP, this, this.touchOut);
        //初始化列表2
        var size2 = 240;
        this.iconPanel2.removeChildren();
        this.listData = JumpManager_1.default.getMokaData(1, 10, 1);
        if (!this.listData)
            return;
        for (var i = 0; i < this.listData.length; i++) {
            var itemData = this.listData[i];
            // icon组
            var itemGroup = new Laya.Image();
            itemGroup.width = size2;
            itemGroup.height = size2 + 80;
            // itemGroup.x = (i % 2) * (size2 + 30 + 18);
            // itemGroup.y = Math.floor(i / 2) * (size2 + 80 + 20);
            // icon背景
            var itemBg = new Laya.Image(ResourceConst_1.default.JUMP_ICON_REMENTUIJIAN_PNG);
            // itemBg. = new egret.Rectangle(10, 10, 10, 10);
            itemBg.width = size2;
            itemBg.height = size2 + 40;
            itemBg.sizeGrid = "21,22,14,24";
            // itemBg.x = (i % 2) * (size2 + 30 + 18);
            // itemBg.y = Math.floor(i / 2) * (size2 + 80 + 20);
            new ButtonUtils_1.ButtonUtils(itemBg, this.clickItem, this, null, null, itemData).setBtnType(ControlConst_1.default.BUTTON_TYPE_3);
            itemGroup.addChild(itemBg);
            // icon图
            var imgItem = new Laya.Image(itemData.Icon);
            imgItem.x = imgItem.y = 15;
            imgItem.width = imgItem.height = size2 - 30;
            itemGroup.addChild(imgItem);
            imgItem.mouseEnabled = false;
            var itemName = new Laya.Label(itemData.GameName);
            itemName.fontSize = 18;
            // itemName.anchorX = 0.5;
            // itemName.anchorY = 0.5;
            itemName.x = 15;
            itemName.y = size2 + 10;
            itemName.color = "#0000ff";
            itemGroup.addChild(itemName);
            itemName.mouseEnabled = false;
            var numStr = Number(this.fakeNumList[i]);
            if (numStr > 10000) {
                numStr = Equation_1.default.getNumByDecimal(numStr / 10000, 1);
                numStr = numStr + "万";
            }
            var itemLabel = new Laya.Label(numStr + "人玩");
            itemLabel.fontSize = 18;
            // itemLabel.anchorY = 0.5;
            itemLabel.width = 100;
            itemLabel.x = 135;
            itemLabel.y = size2 + 10;
            itemLabel.color = "#ff0000";
            itemLabel.align = "right";
            itemGroup.addChild(itemLabel);
            this.iconPanel2.addChild(itemGroup);
            itemGroup.x = i % this.lineCount * (itemGroup.width + 80);
            itemGroup.y = Math.floor(i / this.lineCount) * (itemGroup.height);
        }
        this.moveHeight = this.iconPanel2.contentHeight - this.iconPanel2.height;
        this.iconPanel2.on(Laya.Event.MOUSE_UP, this, this.touchOut);
    }
    /**点击图片 */
    clickItem(data) {
        LogsManager_1.default.echo("yrc clickItem", data);
        var sendData = {
            appId: data.GameAppId,
            path: data.PromoteLink,
            jumpData: data,
            extraData: {
                from: JumpConst_1.default.JUMPLIST
            }
        };
        UserInfo_1.default.platform.jumpToMiniProgram(sendData);
    }
    /**添加移动定时器 */
    startItemMoveLoop() {
        this.isTouch = false;
        this._itemMoveCode = TimerManager_1.default.instance.add(this.itemMove, this, 10);
    }
    /**icon左右移动 */
    itemMove() {
        if (!this.isTouch) {
            var moveY = 1;
            var curX = this.iconPanel2.hScrollBar.value;
            var moveHeight = this.iconPanel1.contentHeight - this.iconPanel1.height;
            if (this.isDown && curX >= moveHeight) {
                this.isDown = false;
            }
            if (!this.isDown && curX <= 0) {
                this.isDown = true;
            }
            if (!this.isDown) {
                moveY = -1;
            }
            this.iconPanel2.hScrollBar.value += moveY;
        }
    }
    /**手指从这里抬起 */
    touchOut(isDouble) {
        this.touchEndCode = TimerManager_1.default.instance.setTimeout(() => { this.isTouch = false; }, this, 2000);
    }
    /**移除定时器 */
    clearMoveLoop() {
        TimerManager_1.default.instance.remove(this._itemMoveCode);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
    close() {
        JumpManager_1.default.isInDrawer = false;
        this.clearMoveLoop();
        var tempFunc = this.closeCallback;
        var tempObj = this.closeThisObj;
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.JumpListUI);
        tempFunc && tempFunc.call(tempObj);
    }
}
exports.default = JumpListUI;
//# sourceMappingURL=JumpListUI.js.map