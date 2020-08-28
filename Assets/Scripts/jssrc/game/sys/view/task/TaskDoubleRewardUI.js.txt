"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const FogFunc_1 = require("../../func/FogFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
class TaskDoubleRewardUI extends layaMaxUI_1.ui.gameui.task.TaskDoubleRewardUI {
    constructor() {
        super();
        this.initBtn();
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.succCall = data.succCall;
        this.reward = data.reward;
        this.shareName = data.shareName;
        this.params = data.params;
        this.closeBtn.visible = false;
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareName, ShareOrTvManager_1.default.TYPE_SHARE);
        this.receiveImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.receiveBtn.visible = false;
            this.closeBtn.text = "确定";
            this.closeBtn.visible = true;
        }
        else {
            this.receiveBtn.visible = true;
            this.closeBtn.text = "我不要了";
            var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(this.shareName);
            this.closeBtn.visible = true;
            if (delayTime) {
                this.closeBtn.visible = false;
                TimerManager_1.default.instance.setTimeout(() => {
                    this.closeBtn.visible = true;
                }, this, delayTime);
            }
        }
        this.addShowEvent();
        this.initReward();
    }
    initReward() {
        this.itemList.repeatX = this.reward.length;
        this.itemList.array = this.reward;
        if (this.reward.length == 1) {
            this.itemList.width = 127;
        }
        else if (this.reward.length == 2) {
            this.itemList.width = 257;
        }
        else if (this.reward.length == 3) {
            this.itemList.width = 383;
        }
        else if (this.reward.length > 3) {
            this.itemList.width = 390;
        }
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);
    }
    onListRender(cell, index) {
        var data = this.itemList.array[index];
        var item = cell.getChildByName("item");
        var itemLab = item.getChildByName("itemLab");
        var itemIcon = item.getChildByName("itemIcon");
        var result = FogFunc_1.default.instance.getResourceShowInfo(data);
        itemLab.text = StringUtils_1.default.getCoinStr(result["num"]);
        itemIcon.skin = result["icon"];
    }
    onClickReceive() {
        this.addClickEvent();
        ShareOrTvManager_1.default.instance.shareOrTv(this.shareName, ShareOrTvManager_1.default.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.onSuccessCall, this.failCall, this);
    }
    onSuccessCall() {
        if (this.succCall) {
            this.succCall();
        }
        this.addSuccEvent();
        this.close();
    }
    failCall() {
    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_DOUBLEREWARD) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKREWARD_SHOW, this.params);
        }
    }
    //点击打点
    addClickEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_DOUBLEREWARD) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKREWARD_CLICK, this.params);
            }
        }
    }
    //展示成功打点
    addSuccEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_DOUBLEREWARD) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKREWARD_FINISH, this.params);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_TASKREWARD_FINISH, this.params);
            }
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.TaskDoubleRewardUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = TaskDoubleRewardUI;
//# sourceMappingURL=TaskDoubleRewardUI.js.map