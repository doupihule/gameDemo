"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const JumpConst_1 = require("../../consts/JumpConst");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const ControlConst_1 = require("../../../../framework/consts/ControlConst");
const ResourceConst_1 = require("../../consts/ResourceConst");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const GameUtils_1 = require("../../../../utils/GameUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
class JumpListZhiseUI extends layaMaxUI_1.ui.gameui.jump.JumpListZhiseUI {
    constructor() {
        super();
        this._itemMoveCode = 0;
        this.listData = [];
        this.lineCount = 3;
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
        /**方向，是否向右移动 */
        this.isRight = true;
        this.isTouch2 = false;
        ScreenAdapterTools_1.default.alignNotch(this.closeBtn);
        ScreenAdapterTools_1.default.alignNotch(this.midTopGroup);
        // 动态调整列表长度
        // this.iconPanel2.height += ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        this.iconPanel2.vScrollBarSkin = "";
        this.iconPanel1.hScrollBarSkin = "";
        this.on(Laya.Event.DISPLAY, this, this.onAddToStage);
        this.on(Laya.Event.UNDISPLAY, this, this.onRemoveStage);
        this.iconPanel1.on(Laya.Event.MOUSE_OUT, this, this.touchOut);
        this.iconPanel1.on(Laya.Event.MOUSE_DOWN, this, this.touchDownItem);
        this.iconPanel1.on(Laya.Event.MOUSE_UP, this, this.touchOut);
        this.iconPanel2.on(Laya.Event.MOUSE_UP, this, this.touchOut2);
        this.iconPanel2.on(Laya.Event.MOUSE_UP, this, this.touchOut2);
        this.iconPanel2.on(Laya.Event.MOUSE_DOWN, this, this.touchDownItem2);
        new ButtonUtils_1.ButtonUtils(this.playBtn, this.onClickPlay, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
    }
    onAddToStage() {
        this.startItemMoveLoop();
    }
    onRemoveStage() {
        this.clearMoveLoop();
    }
    setData(data) {
        this.closeCallback = null;
        this.closeThisObj = null;
        if (data && data.callback) {
            this.closeCallback = data.callback;
            this.closeThisObj = data.thisObj;
        }
        if (data && data.from) {
            this.fromWhere = data.from;
        }
        JumpManager_1.default.setFrom = this.fromWhere;
        JumpManager_1.default.isInDrawer = true;
        this.initView();
        JumpManager_1.default.mtDrawer(this.listData);
        // // if (data && data.result) {
        this.playBtn.visible = true;
        // } else {
        //     this.playBtn.visible = false;
        // }
    }
    initView() {
        //初始化列表1
        var size1 = 99;
        this.iconPanel1.removeChildren();
        var headListData = JumpManager_1.default.getMokaDataByType(JumpConst_1.default.JUMP_TYPE_JIESUAN);
        if (!headListData) {
            return;
        }
        //按照权重随机
        GameUtils_1.default.shuffle(headListData);
        var len = headListData.length;
        for (var i = 0; i < len; i++) {
            var itemData = headListData[i];
            var itemGroup = JumpManager_1.default.createJumpItem(itemData, size1, size1, { from: JumpConst_1.default.JUMPLIST }, false, 0, true, 18, "#000000", false);
            itemGroup.x = i % len * (size1 + 20);
            itemGroup.y = 14;
            this.iconPanel1.addChild(itemGroup);
        }
        //初始化列表2
        var size2 = 186;
        this.iconPanel2.removeChildren();
        this.listData = headListData;
        if (!this.listData)
            return;
        var indexArr = [];
        JumpManager_1.default.getTwoRandom(0, this.listData.length, indexArr);
        for (var i = 0; i < this.listData.length; i++) {
            var itemData = this.listData[i];
            // icon组
            var itemGroup = new Laya.Image();
            itemGroup.width = size2;
            itemGroup.height = size2 + 47;
            // icon背景
            var itemBg = new Laya.Image(ResourceConst_1.default.JUMP_ZHISE_ICONBG);
            itemBg.width = size2;
            itemBg.height = itemGroup.height;
            itemBg.sizeGrid = "25,19,23,22";
            new ButtonUtils_1.ButtonUtils(itemBg, this.clickItem, this, null, null, itemData).setBtnType(ControlConst_1.default.BUTTON_TYPE_3);
            itemGroup.addChild(itemBg);
            // icon图
            var imgItem = new Laya.Image(itemData.Icon);
            imgItem.x = imgItem.y = 6;
            imgItem.width = imgItem.height = size2 - 12;
            itemGroup.addChild(imgItem);
            imgItem.mouseEnabled = false;
            //文本底
            var labelBg = new Laya.Image(JumpManager_1.default.getZhiseLabelBg());
            labelBg.width = imgItem.width;
            labelBg.height = 47;
            labelBg.x = imgItem.x;
            labelBg.y = imgItem.height;
            itemGroup.addChild(labelBg);
            //文本
            var itemName = new Laya.Label(itemData.GameName);
            itemName.fontSize = 24;
            itemName.font = "Microsoft YaHei";
            itemName.align = "center";
            itemName.overflow = "hidden";
            itemName.width = imgItem.width;
            itemName.x = imgItem.x;
            itemName.y = imgItem.height + 12;
            itemName.color = "#ffffff";
            itemGroup.addChild(itemName);
            itemName.mouseEnabled = false;
            this.iconPanel2.addChild(itemGroup);
            //标志
            var sign;
            if (indexArr.indexOf(i) != -1) {
                if (indexArr.indexOf(i) == 0) {
                    sign = ResourceConst_1.default.JUMP_ICON_HOT;
                }
                else {
                    sign = ResourceConst_1.default.JUMP_ICON_NEW;
                }
                var signImg = new Laya.Image(sign);
                signImg.width = 70;
                signImg.height = 40;
                signImg.x = size2 - signImg.width;
                signImg.y = 0;
                itemGroup.addChild(signImg);
            }
            itemGroup.x = i % this.lineCount * (itemGroup.width + 20);
            itemGroup.y = Math.floor(i / this.lineCount) * (itemGroup.height + 16);
        }
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
        this.isTouch2 = false;
        this._itemMoveCode = TimerManager_1.default.instance.add(this.itemMove, this, 10);
    }
    /**按下item */
    touchDownItem() {
        // this.isTouch = true;
        // if (this.touchEndCode) {
        //     TimerManager.instance.remove(this.touchEndCode);
        // }
    }
    /**按下item */
    touchDownItem2() {
        // this.isTouch2 = true;
        // if (this.touchEndCode2) {
        //     TimerManager.instance.remove(this.touchEndCode2);
        // }
    }
    /**icon左右移动 */
    itemMove() {
        if (!this.isTouch) {
            var moveX = 1;
            var curX = this.iconPanel1.hScrollBar.value;
            var moveWidth = this.iconPanel1.contentWidth - this.iconPanel1.width;
            if (this.isRight && curX >= moveWidth) {
                this.isRight = false;
            }
            if (!this.isRight && curX <= 0) {
                this.isRight = true;
            }
            if (!this.isRight) {
                moveX = -1;
            }
            this.iconPanel1.hScrollBar.value += moveX;
        }
        if (!this.isTouch2) {
            var moveY = 1;
            var curY = this.iconPanel2.vScrollBar.value;
            var moveHeight = this.iconPanel2.contentHeight - this.iconPanel2.height;
            if (this.isDown && curY >= moveHeight) {
                this.isDown = false;
            }
            if (!this.isDown && curY <= 0) {
                this.isDown = true;
            }
            if (!this.isDown) {
                moveY = -1;
            }
            this.iconPanel2.vScrollBar.value += moveY;
        }
    }
    /**手指从这里抬起 */
    touchOut(isDouble) {
        this.touchEndCode = TimerManager_1.default.instance.setTimeout(() => { this.isTouch = false; }, this, 1500);
    }
    /**手指从这里抬起 */
    touchOut2(isDouble) {
        this.touchEndCode2 = TimerManager_1.default.instance.setTimeout(() => { this.isTouch2 = false; }, this, 1500);
    }
    /**移除定时器 */
    clearMoveLoop() {
        TimerManager_1.default.instance.remove(this._itemMoveCode);
        if (this.touchEndCode) {
            TimerManager_1.default.instance.remove(this.touchEndCode);
        }
        if (this.touchEndCode2) {
            TimerManager_1.default.instance.remove(this.touchEndCode2);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
    onClickPlay() {
        this.close();
    }
    close() {
        JumpManager_1.default.isInDrawer = false;
        this.clearMoveLoop();
        this.closeCallback && this.closeCallback.call(this.closeThisObj);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.JumpListZhiseUI);
    }
}
exports.default = JumpListZhiseUI;
//# sourceMappingURL=JumpListZhiseUI.js.map