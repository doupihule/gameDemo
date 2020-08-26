"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const Message_1 = require("../../../../framework/common/Message");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const LevelFunc_1 = require("../../func/LevelFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
class AirDropDetailUI extends layaMaxUI_1.ui.gameui.main.AirDropDetailUI {
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickCLose, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        //界面初始化
        this.initView();
    }
    initView() {
        var rewardIndex = LevelFunc_1.default.instance.getAirDropRewardIndex();
        var boxItems = GlobalParamsFunc_1.default.instance.getDataArray("supplyBoxItem");
        var boxReward = boxItems[rewardIndex].split(",");
        this.rewardCount = boxReward[2];
        this.rewardType = parseInt(boxReward[1]);
        this.coinLab.text = this.rewardCount;
        this.rewardImg.skin = ResourceConst_1.default.AIDDROP_DETAIL_ARR[this.rewardType];
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_SUPPLYBOX);
        this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FLYBOX_SHOW, { "rewardType": this.rewardType, "rewardCount": this.rewardCount });
        }
    }
    onClickReceive() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FLYBOX_CLICK, { "rewardType": this.rewardType, "rewardCount": this.rewardCount });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_SUPPLYBOX, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {
        this.onSuccReward(1);
        this.close();
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FLYBOX_FINISH, { "rewardType": this.rewardType, "rewardCount": this.rewardCount });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FLYBOX_FINISH, { "rewardType": this.rewardType, "rewardCount": this.rewardCount });
        }
    }
    //成功奖励  
    onSuccReward(rewardRate = 1) {
        DataResourceServer_1.default.getReward({ "reward": [this.rewardType, this.rewardCount * rewardRate] }, () => {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_DESTORY_AIRDROP);
            this.close();
        }, this);
    }
    closeCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.AirDropDetailUI);
    }
    onClickCLose() {
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_AIRDROP);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.AirDropDetailUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = AirDropDetailUI;
//# sourceMappingURL=AirDropDetailUI.js.map