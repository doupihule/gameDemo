"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class FogBattleReviveUI extends layaMaxUI_1.ui.gameui.fog.FogBattleReviveUI {
    constructor() {
        super();
        this.waitTime = 5;
        this.timeCode = 0;
        this.isPause = false;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils_1.ButtonUtils(this.reviveBtn, this.onClickRevive, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.onClickCLose, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.controler = data && data.controler;
        BannerAdManager_1.default.addBannerQuick(this);
        this.isPause = false;
        this.waitTime = GlobalParamsFunc_1.default.instance.getDataNum("fogResurrectionTime") / 1000 || 5;
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLEFOG_REVIVE);
        this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_REVIVE_SHOW);
        this.showLeftTime();
        this.timeCode = TimerManager_1.default.instance.add(this.showLeftTime, this, 1000);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(ShareTvOrderFunc_1.default.SHARELINE_BATTLEFOG_REVIVE);
        this.exitBtn.visible = true;
        if (delayTime) {
            this.exitBtn.visible = false;
            TimerManager_1.default.instance.setTimeout(() => {
                this.exitBtn.visible = true;
            }, this, delayTime);
        }
    }
    /**显示剩余时间 */
    showLeftTime() {
        if (this.isPause)
            return;
        if (this.waitTime <= 0) {
            this.onClickCLose();
        }
        this.leftTxt.changeText(this.waitTime + "");
        this.waitTime -= 1;
    }
    //点击复活                                                                         
    onClickRevive() {
        this.isPause = true;
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_REVIVE_CLICK);
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_BATTLEFOG_REVIVE, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.fullStart, this.closeCall, this);
    }
    //
    fullStart() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_REVIVE_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_REVIVE_FINISH);
        }
        this.revive();
    }
    //执行复活
    revive() {
        this.close();
        this.controler.fogRevive();
    }
    closeCall() {
        this.isPause = false;
    }
    close() {
        this.controler.setGamePlayOrPause(false);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBattleReviveUI);
        TimerManager_1.default.instance.remove(this.timeCode);
    }
    onClickCLose() {
        this.close();
        //点击关闭 展示失败
        this.controler.refreshControler.showGameLose();
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBattleReviveUI;
//# sourceMappingURL=FogBattleReviveUI.js.map