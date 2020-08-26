"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const RolesFunc_1 = require("../../func/RolesFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
class ComRewardDoubleUI extends layaMaxUI_1.ui.gameui.common.ComRewardDoubleUI {
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
        this.closeBtn.visible = false;
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareName, ShareOrTvManager_1.default.TYPE_SHARE);
        this.receiveImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.receiveBtn.visible = false;
            this.closeBtn.visible = true;
            this.closeBtn.text = "确定";
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
        this.pieceBg.visible = false;
        if (this.reward[0] == DataResourceFunc_1.DataResourceType.PIECE) {
            this.pieceBg.visible = true;
            var info = RolesFunc_1.default.instance.getCfgDatas("EquipMaterial", this.reward[1]);
            this.rewardImg.skin = RolesFunc_1.default.instance.getEquipIcon(info.icon);
            this.pieceTxt.text = this.reward[2];
            this.rewardNum.text = TranslateFunc_1.default.instance.getTranslate(info.name);
        }
        else {
            this.rewardImg.skin = ResourceConst_1.default.AIDDROP_DETAIL_ARR[Number(this.reward[0])];
            this.rewardNum.text = this.reward[1];
            this.pieceTxt.text = "";
        }
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
            DataResourceFunc_1.default.instance.showTip([this.reward[0], Number(this.reward[1]) * 2]);
        }
        this.addSuccEvent();
        this.close();
    }
    failCall() {
    }
    //展示打点
    addShowEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_SEVENDAY) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SEVENDAY_SHOW, this.params);
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_EQUIP_GET_DOUBLE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_VIDEOPIECE_REWARD_SHOW, this.params);
        }
    }
    //点击打点
    addClickEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_SEVENDAY) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SEVENDAY_CLICK, this.params);
            }
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_EQUIP_GET_DOUBLE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_VIDEOPIECE_REWARD_CLICK, this.params);
        }
    }
    //展示成功打点
    addSuccEvent() {
        if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_SEVENDAY) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SEVENDAY_FINISH, this.params);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_SEVENDAY_FINISH, this.params);
            }
        }
        else if (this.shareName == ShareTvOrderFunc_1.default.SHARELINE_EQUIP_GET_DOUBLE) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_VIDEOPIECE_REWARD_FINISH, this.params);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_VIDEOPIECE_REWARD_FINISH, this.params);
            }
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.ComRewardDoubleUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = ComRewardDoubleUI;
//# sourceMappingURL=ComRewardDoubleUI.js.map