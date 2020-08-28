"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const TimerManager_1 = require("../../../../../framework/manager/TimerManager");
const FogModel_1 = require("../../../model/FogModel");
const LoadManager_1 = require("../../../../../framework/manager/LoadManager");
const FogRewardItemUI_1 = require("./FogRewardItemUI");
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const TweenAniManager_1 = require("../../../manager/TweenAniManager");
const ShareOrTvManager_1 = require("../../../../../framework/manager/ShareOrTvManager");
const UserInfo_1 = require("../../../../../framework/common/UserInfo");
class FogResultRewardUI extends layaMaxUI_1.ui.gameui.fog.FogResultRewardUI {
    constructor() {
        super();
        this.rewardTimerCode = 0;
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.onClickContinue);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this.clickCount = 1;
        this.rewardTimerCode = 0;
        this.continueBtn.visible = false;
        this.thisObj = data && data.thisObj;
        // 头条停止录屏
        if (ShareOrTvManager_1.default.instance.canShareVideo()) {
            UserInfo_1.default.platform.recordStop();
        }
        this.initRewardPanel();
        this.rewardPanel.vScrollBarSkin = "";
        TimerManager_1.default.instance.setTimeout(() => {
            this.continueBtn.visible = true;
        }, this, 500);
    }
    initRewardPanel() {
        this.rewardPanel.removeChildren();
        //获取局外奖励
        this.rewardArr = FogModel_1.default.instance.getFogOuterReward();
        for (var i = 0; i < Math.ceil(this.rewardArr.length / 3); i++) {
            var itemGroup = new Laya.Image();
            itemGroup.width = 438;
            itemGroup.height = 154;
            //  itemGroup.x = 0;
            itemGroup.x = 550; //显示在屏幕外
            itemGroup.y = i * (itemGroup.height + 3) + 2;
            this.rewardPanel.addChild(itemGroup);
            itemGroup.name = "itemGroup" + i;
            this.initRewardItem(itemGroup, i);
        }
    }
    initRewardItem(itemGroup, index) {
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.FogRewardItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.iniRewardPanelData, [itemGroup, index]));
    }
    iniRewardPanelData(group, index) {
        group.removeChildren();
        var count = 0;
        for (var i = index * 3; i < Math.min(i + 3, i + this.rewardArr.length - i); i++) {
            var item = this.rewardArr[i];
            var rewardItem = new FogRewardItemUI_1.default(item);
            group.addChild(rewardItem);
            rewardItem.x = count * (rewardItem.itemWidth + 36);
            count++;
        }
        if (index == Math.ceil(this.rewardArr.length / 3) - 1) {
            this.addTimer(index);
        }
    }
    //添加定时器
    addTimer(count) {
        for (var index = count; index >= 0; index--) {
            TimerManager_1.default.instance.setTimeout((data) => {
                var item = this.rewardPanel.getChildAt(data[0]);
                //判断是否需要滑屏
                var num = Math.ceil(Number(item.y) / Number(this.rewardPanel.height));
                if (item.x != 0) {
                    this.rewardPanel.vScrollBar.setScroll(0, num * this.rewardPanel.height, (num - 1) * this.rewardPanel.height - 10);
                }
                TweenAniManager_1.default.instance.horizontalAni(item, 0, () => {
                    //判断是否是最后一个动画完成
                    if (data[0] == count) {
                        this.clickCount = 2;
                    }
                }, this, 500);
            }, this, (count - index) * 500, [count - index]);
        }
    }
    onClickContinue() {
        //第一次点击，跳过奖励动画
        if (this.clickCount == 1) {
            this.clickCount++;
            //全部直接显示
            this.removeRewardTimer();
        }
        //第二次点击，进入下一步奖励结算
        else if (this.clickCount == 2) {
            WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogResultRewardUI);
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogResultUI, { thisObj: this.thisObj });
        }
    }
    removeRewardTimer() {
        for (var i = 0; i < Math.ceil(this.rewardArr.length / 3); i++) {
            var item = this.rewardPanel.getChildAt(i);
            //去掉动画
            Laya.Tween.clearAll(item);
            //全部显示出来
            item.x = 0;
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogResultRewardUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogResultRewardUI;
//# sourceMappingURL=FogResultRewardUI.js.map