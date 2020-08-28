"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const Message_1 = require("../../../../framework/common/Message");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const DailyGoldModel_1 = require("../../model/DailyGoldModel");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const DailyDiamondFunc_1 = require("../../func/DailyDiamondFunc");
const DailyGoldServer_1 = require("../../server/DailyGoldServer");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class DailyGoldUI extends layaMaxUI_1.ui.gameui.main.DailyGoldUI {
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils_1.ButtonUtils(this.btn_getReward, this.onClickReceive, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_DailyGold, this);
        var dailyGold = DailyGoldModel_1.default.instance.getDailyGold();
        if (dailyGold.currentStep && !dailyGold.currentGoldStep) {
            this.currentGoldStep = dailyGold.currentStep + 1;
        }
        else {
            this.currentGoldStep = dailyGold.currentGoldStep + 1;
        }
        this.watchTime = dailyGold.watchTime;
        this.initView();
    }
    initView() {
        this.refreshView();
        this.currentGold = this.currentData.giveDiamond;
        this.lbl_currentTime.text = "当前第" + this.currentGoldStep + "次";
        this.lbl_currentNum.text = "×" + this.currentGold;
        //获取下一次显示的奖励
        var nextTime = DailyDiamondFunc_1.default.instance.getNextShowTime(this.currentGoldStep);
        var nextGoldData = DailyDiamondFunc_1.default.instance.getDataById(nextTime);
        this.lbl_nextTime.text = nextTime;
        this.lbl_nextNum.text = nextGoldData.giveDiamond;
    }
    refreshView() {
        //根据序列切换图标
        this.shareType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_DAILYGOLD);
        this.img_adv.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.shareType);
        if (this.shareType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FREEGOLD_SHOW, { "gainTimes": this.currentGoldStep });
        }
        var freeGoldData = DailyDiamondFunc_1.default.instance.getDataById(this.currentGoldStep);
        this.currentData = freeGoldData;
        if (freeGoldData.showNub == 1) {
            this.group_step.visible = false;
        }
        else {
            this.group_step.visible = true;
            this.lbl_step.text = this.watchTime + "/" + freeGoldData.showNub;
        }
    }
    onClickCLose() {
        this.close();
    }
    onClickReceive() {
        if (this.shareType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FREEGOLD_CLICK, { "gainTimes": this.currentGoldStep });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_DAILYGOLD, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    //成功回调，判断是否达到领奖次数
    successCall() {
        //观看次数+1
        this.watchTime += 1;
        if (this.shareType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FREEGOLD_FINISH, { "gainTimes": this.currentGoldStep });
        }
        else if (this.shareType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FREEGOLD_FINISH, { "gainTimes": this.currentGoldStep });
        }
        if (this.watchTime >= this.currentData.showNub) {
            //可以领取奖励
            this.getReward();
        }
        else {
            //更新观看视频次数
            DailyGoldServer_1.default.updateWatchTime({ "watchTime": this.watchTime }, () => {
                //更新界面
                var freeGoldData = DailyDiamondFunc_1.default.instance.getDataById(this.currentGoldStep);
                this.refreshView();
            }, this);
        }
    }
    //领取奖励并退出游戏
    getReward() {
        //领取奖励并回到主界面
        DailyGoldServer_1.default.gainReward({ "currentGoldStep": this.currentGoldStep, "currentGold": this.currentGold }, () => {
            WindowManager_1.default.ShowTip("获得钻石×" + this.currentGold);
            //更新界面
            if (this.currentGoldStep >= DailyDiamondFunc_1.default.instance.getMaxId()) {
                Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_DAILYGOLD);
                this.close();
            }
            else {
                this.refreshUI();
            }
        }, this);
    }
    refreshUI() {
        var dailyGold = DailyGoldModel_1.default.instance.getDailyGold();
        this.currentGoldStep = dailyGold.currentGoldStep + 1;
        this.watchTime = dailyGold.watchTime;
        this.initView();
    }
    closeCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.DailyGoldUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = DailyGoldUI;
//# sourceMappingURL=DailyGoldUI.js.map