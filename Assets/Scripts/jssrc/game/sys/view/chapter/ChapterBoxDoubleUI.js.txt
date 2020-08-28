"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../func/FogFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogServer_1 = require("../../server/FogServer");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
class ChapterBoxDoubleUI extends layaMaxUI_1.ui.gameui.chapter.ChapterBoxDoubleUI {
    constructor() {
        super();
        this.doubleRate = 1;
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickClose, this);
        new ButtonUtils_1.ButtonUtils(this.doubleReceiveBtn, this.onClickDouble, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.itemArr = [];
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.itemArr = data.reward;
        this.doubleRate = (data && data.doubleRate - 1) || 1;
        this.shareName = data && data.shareName;
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_WORK_GIFTDOUBLE) {
            this.doubleRate = 2;
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_work_giftReward");
            this.giftImg.visible = true;
            this.titleLab.visible = false;
        }
        else {
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_tip_receiveDouble");
            this.giftImg.visible = false;
            this.titleLab.visible = true;
        }
        this.params = data && data.params;
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareName, ShareOrTvManager_1.default.TYPE_SHARE);
        this.adImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        // this.doubleTxt.text = TranslateFunc.instance.getTranslate("#tid_receiveReward_rate", null,data && data.doubleRate);
        this.addShowEvent();
        this.initReward();
        //延迟出现
        var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(this.shareName);
        this.closeBtn.visible = true;
        if (delayTime) {
            this.closeBtn.visible = false;
            TimerManager_1.default.instance.setTimeout(() => {
                this.closeBtn.visible = true;
            }, this, delayTime);
        }
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
        var equipBg = cell.getChildByName("equipBg");
        var pieceTxt = equipBg.getChildByName("pieceTxt");
        var nameTxt = equipBg.getChildByName("nameTxt");
        var result = FogFunc_1.default.instance.getResourceShowInfo(data, false);
        itemLab.text = StringUtils_1.default.getCoinStr(result["num"]);
        itemIcon.skin = result["icon"];
        if (result.type == DataResourceFunc_1.DataResourceType.PIECE) {
            equipBg.visible = true;
            pieceTxt.text = StringUtils_1.default.getCoinStr(result["num"]);
            nameTxt.text = result.name;
            itemLab.text = "";
        }
        else {
            equipBg.visible = false;
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
    finishCallBack() {
        this.close();
    }
    onClickClose() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_WORK_GIFTDOUBLE) {
            this.receiveReard(1);
        }
        else {
            this.close();
        }
    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_CHAPTERBOX_REWARD) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_CHAPTERBOX_SHOW, this.params);
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_TASK_POINTREWARD) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_TASKBOX_SHOW, this.params);
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_WORK_GIFTDOUBLE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_GIFTDOUBLE_SHOW, this.params);
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
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_WORK_GIFTDOUBLE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_GIFTDOUBLE_CLICK, this.params);
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
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_WORK_GIFTDOUBLE) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_GIFTDOUBLE_FINISH, this.params);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_GIFTDOUBLE_FINISH, this.params);
            }
        }
    }
    close() {
        this.callBack & this.callBack.call(this.thisObj);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.ChapterBoxDoubleUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = ChapterBoxDoubleUI;
//# sourceMappingURL=ChapterBoxDoubleUI.js.map