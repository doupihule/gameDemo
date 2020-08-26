"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const Message_1 = require("../../../../framework/common/Message");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ResourceConst_1 = require("../../consts/ResourceConst");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
class OfflineRewardDoubleUI extends layaMaxUI_1.ui.gameui.main.OfflineRewardDoubleUI {
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.btn_multiReward, this.onReceiveBtnClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.rewardType = data.rewardType;
        this.offlineReward = data.rewardNum;
        this.lbl_normalReward.text = StringUtils_1.default.getCoinStr(this.offlineReward);
        //按钮状态
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_OFFLINE);
        this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            this.freeImg.skin = ResourceConst_1.default.ADV_PNG;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_OFFLINECOIN_SHOW, { "times": 2 });
        }
        var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(ShareTvOrderFunc_1.default.SHARELINE_OFFLINE);
        this.closeBtn.visible = true;
        if (delayTime) {
            this.closeBtn.visible = false;
            TimerManager_1.default.instance.setTimeout(() => {
                this.closeBtn.visible = true;
            }, this, delayTime);
        }
    }
    //领取多倍离线收益
    onReceiveBtnClick() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_OFFLINECOIN_CLICK, { "times": 2 });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_OFFLINE, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {
        DataResourceServer_1.default.getReward({ "reward": [this.rewardType, this.offlineReward], "offlineTime": -1 }, () => {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_get_lab"));
            this.close();
        }, this);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_OFFLINECOIN_FINISH, { "times": 2 });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_OFFLINECOIN_FINISH, { "times": 2 });
        }
    }
    closeCall() {
    }
    close() {
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMIAN_EVENT_CHECKPOP);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.OfflineRewardDoubleUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = OfflineRewardDoubleUI;
//# sourceMappingURL=OfflineRewardDoubleUI.js.map