"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const StatisticsCommonConst_1 = require("../../../../framework/consts/StatisticsCommonConst");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const UserExtServer_1 = require("../../server/UserExtServer");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
class FreeResourceUI extends layaMaxUI_1.ui.gameui.main.FreeResourceUI {
    constructor() {
        super();
        this.initBtn();
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this._data = data;
        this.freeType = data.type;
        if (this.freeType == DataResourceFunc_1.DataResourceType.SP) {
            // 预留不同资源复用
            this.getNum.text = "X" + GlobalParamsFunc_1.default.instance.getDataNum('spPerAd');
            this.adType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FREE_SP);
            if (this.adType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_NOPOWER_SHOW);
            }
            BannerAdManager_1.default.addTopBannerStyleJump(this);
        }
        else if (this.freeType == DataResourceFunc_1.DataResourceType.COIN) {
            this.lbl_desc.changeText("你的金币不足，是否领取金币x" + StringUtils_1.default.getCoinStr(data.coin));
            this.adType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FREE_COIN);
            if (this.adType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.VIDEO_TOTAL_SHOW);
                // StatisticsManager.ins.onEvent(StatisticsManager.VIDEO_FREECOIN_SHOW);
            }
            else if (this.adType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_TOTAL_SHOW);
                // StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FREECOIN_SHOW);
            }
        }
        this.receiveImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.adType);
    }
    onReceiveBtnClick() {
        if (this.freeType == DataResourceFunc_1.DataResourceType.SP) {
            if (this.adType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_NOPOWER_CLICK);
            }
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FREE_SP, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, this.failCall, this);
        }
        else if (this.freeType == DataResourceFunc_1.DataResourceType.COIN) {
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FREE_COIN, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, this.failCall, this);
        }
    }
    successCall() {
        if (this.freeType == DataResourceFunc_1.DataResourceType.SP) {
            if (this.adType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_NOPOWERSUCEEDNUB);
            }
            else if (this.adType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_POWERRECOVERY_CLICKSUCCESS);
            }
            UserExtServer_1.default.getFreeSp({ reward: GlobalParamsFunc_1.default.instance.getDataNum("spPerAd") }, () => {
                WindowManager_1.default.ShowTip("体力+" + GlobalParamsFunc_1.default.instance.getDataNum("spPerAd"));
                // StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREESP);
                this.close();
            }, this);
        }
        else if (this.freeType == DataResourceFunc_1.DataResourceType.COIN) {
            if (this.adType == ShareOrTvManager_1.default.TYPE_ADV) {
                // StatisticsManager.ins.onEvent(StatisticsManager.VIDEO_FREECOIN_CLICKSUCCESS);
            }
            else if (this.adType == ShareOrTvManager_1.default.TYPE_SHARE) {
                // StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FREECOIN_CLICKSUCCESS);
            }
            // StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_PAYSOLDIERSUCEEDNUB);
            UserExtServer_1.default.getFreeCoin({ coin: this._data.coin }, () => {
                WindowManager_1.default.ShowTip("金币+" + StringUtils_1.default.getCoinStr(this._data.coin));
                // StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FREESP);
                this.close();
            }, this);
        }
    }
    failCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FreeResourceUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FreeResourceUI;
//# sourceMappingURL=FreeResourceUI.js.map