"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogServer_1 = require("../../server/FogServer");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const FogModel_1 = require("../../model/FogModel");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const FogConst_1 = require("../../consts/FogConst");
const FogFunc_1 = require("../../func/FogFunc");
class FogFreeActUI extends layaMaxUI_1.ui.gameui.fog.FogFreeActUI {
    constructor() {
        super();
        this.noExit = 0;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.getBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickClose, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.mobilityPerAd = GlobalParamsFunc_1.default.instance.getDataNum("mobilityPerAd");
        this.actNum.text = "X" + this.mobilityPerAd;
        this.noExit = 0;
        if (data && data.noExit) {
            this.noExit = 1;
        }
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("tid_fog_noenoughact");
        this.refreshBtn();
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
    }
    refreshBtn() {
        //按钮状态
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_FREE_ACT);
        this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_MOBILITYRECOVERY_SHOW);
        }
        var mobilityAdTimes = GlobalParamsFunc_1.default.instance.getDataNum("mobilityAdTimes");
        var curCount = FogModel_1.default.instance.getCountsById(FogConst_1.default.fog_free_act_count);
        this.freeLab.text = curCount + "/" + mobilityAdTimes;
    }
    onReceiveBtnClick() {
        //判断次数是否足够
        var mobilityAdTimes = GlobalParamsFunc_1.default.instance.getDataNum("mobilityAdTimes");
        var curCount = FogModel_1.default.instance.getCountsById(FogConst_1.default.fog_free_act_count);
        if (curCount >= mobilityAdTimes) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenough_freeact"));
            return;
        }
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_MOBILITYRECOVERY_CLICK);
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_FREE_ACT, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.closeCall, this);
    }
    successCall() {
        FogServer_1.default.getFreeAct({ "reward": [[DataResourceFunc_1.DataResourceType.ACT, this.mobilityPerAd]] }, () => {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_get_lab"));
            this.close();
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_MOBILITYRECOVERY_FINISH);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_MOBILITYRECOVERY_FINISH);
            }
            //飘奖励
            FogFunc_1.default.instance.flyResTween([[DataResourceFunc_1.DataResourceType.ACT, this.mobilityPerAd]]);
        }, this);
    }
    closeCall() {
    }
    onClickClose() {
        if (!this.noExit) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { type: FogConst_1.default.FOG_VIEW_TYPE_NOACT });
        }
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogFreeActUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogFreeActUI;
//# sourceMappingURL=FogFreeActUI.js.map