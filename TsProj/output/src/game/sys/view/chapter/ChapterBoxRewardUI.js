"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../func/FogFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const ChapterConst_1 = require("../../consts/ChapterConst");
const FogServer_1 = require("../../server/FogServer");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
class ChapterBoxRewardUI extends layaMaxUI_1.ui.gameui.chapter.ChapterBoxRewardUI {
    constructor() {
        super();
        this.doubleRate = 1;
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.sureBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.normalReceiveBtn, this.onClickReceive, this);
        new ButtonUtils_1.ButtonUtils(this.doubleReceiveBtn, this.onClickDouble, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.itemArr = [];
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.viewType = data && data.viewType;
        this.adPrc = data && data.adPrc;
        this.itemArr = data.reward;
        var type = data.type;
        this.doubleRate = data && data.doubleRate;
        this.shareName = data && data.shareName;
        var desc = data && data.desc;
        this.params = data && data.params;
        if (type == ChapterConst_1.default.Chapter_boxState_lock) {
            //锁定
            this.sureBtn.visible = true;
            this.receiveGroup.visible = false;
            this.hasReceiveTxt.visible = false;
        }
        else if (type == ChapterConst_1.default.Chapter_boxState_unlock) {
            //解锁
            this.sureBtn.visible = false;
            this.receiveGroup.visible = true;
            this.hasReceiveTxt.visible = false;
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareName, ShareOrTvManager_1.default.TYPE_SHARE);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.doubleReceiveBtn.visible = false;
                this.normalReceiveBtn.x = 134;
            }
            else {
                this.normalReceiveBtn.x = 30;
                this.doubleReceiveBtn.visible = true;
                this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
                //   this.adImg.skin = ShareOrTvManager.instance.setShareOrTvImg(this.shareName, ShareOrTvManager.TYPE_SHARE);
                // this.doubleTxt.text = TranslateFunc.instance.getTranslate("#tid_receiveReward_rate", null, this.doubleRate);
                this.addShowEvent();
            }
        }
        else if (type == ChapterConst_1.default.Chapter_boxState_receive) {
            //已领取
            this.sureBtn.visible = false;
            this.receiveGroup.visible = false;
            this.hasReceiveTxt.visible = true;
        }
        this.lbl_desc.text = desc;
        this.levelImg.visible = false;
        this.activeImg.visible = false;
        this.workImg.visible = false;
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_CHAPTERBOX_REWARD) {
            this.levelImg.visible = true;
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_POINTREWARD) {
            this.activeImg.visible = true;
        }
        if (this.viewType == "work") {
            this.workImg.visible = true;
        }
        //奖励列表初始化
        this.initReward();
    }
    initReward() {
        this.itemList.repeatX = this.itemArr.length;
        this.itemList.array = this.itemArr;
        if (this.itemArr.length == 1) {
            this.itemList.width = 127;
        }
        else if (this.itemArr.length == 2) {
            this.itemList.width = 257;
        }
        else if (this.itemArr.length == 3) {
            this.itemList.width = 383;
        }
        else if (this.itemArr.length > 3) {
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
        var result = FogFunc_1.default.instance.getResourceShowInfo(data, false, this.adPrc);
        itemLab.text = StringUtils_1.default.getCoinStr(result["num"]);
        itemIcon.scale(result.scale, result.scale);
        itemIcon.skin = result["icon"];
    }
    onClickReceive() {
        if (this.receiveCall) {
            this.receiveCall.call(this.thisObj);
        }
        else {
            this.receiveReard(1);
        }
    }
    onClickDouble() {
        this.addClickEvent();
        ShareOrTvManager_1.default.instance.shareOrTv(this.shareName, ShareOrTvManager_1.default.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.receiveReard.bind(this, this.doubleRate), null, this);
    }
    //领取奖励
    receiveReard(rate = 1) {
        if (rate == this.doubleRate) {
            this.addSuccEvent();
        }
        FogServer_1.default.getReward({ reward: this.itemArr, doubleRate: rate }, this.finishCallBack, this);
    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_CHAPTERBOX_REWARD) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_CHAPTERBOX_SHOW, this.params);
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_POINTREWARD) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKBOX_SHOW, this.params);
        }
    }
    //点击打点
    addClickEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_CHAPTERBOX_REWARD) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_CHAPTERBOX_CLICK, this.params);
            }
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_POINTREWARD) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKBOX_CLICK, this.params);
        }
    }
    //展示成功打点
    addSuccEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_CHAPTERBOX_REWARD) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_CHAPTERBOX_FINISH, this.params);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_CHAPTERBOX_FINISH, this.params);
            }
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_POINTREWARD) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKBOX_FINISH, this.params);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_TASKBOX_FINISH, this.params);
            }
        }
    }
    finishCallBack() {
        // this.freeType = ShareOrTvManager.instance.getShareOrTvType(this.shareName, ShareOrTvManager.TYPE_SHARE);
        // if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
        //     this.callBack & this.callBack.call(this.thisObj)
        // } else {
        //     WindowManager.OpenUI(WindowCfgs.ChapterBoxDoubleUI, {
        //         callBack: this.callBack,
        //         thisObj: this.thisObj,
        //         reward: this.itemArr,
        //         doubleRate: this.doubleRate,
        //         shareName: this.shareName,
        //         params: this.params
        //     })
        // }
        this.close();
        this.callBack & this.callBack.call(this.thisObj);
    }
    close() {
        if (this.viewType == "work") {
            this.callBack && this.callBack.call(this.thisObj);
        }
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.ChapterBoxRewardUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = ChapterBoxRewardUI;
//# sourceMappingURL=ChapterBoxRewardUI.js.map