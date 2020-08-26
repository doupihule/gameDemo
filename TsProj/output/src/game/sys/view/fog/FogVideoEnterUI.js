"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const CountsModel_1 = require("../../model/CountsModel");
const CountsServer_1 = require("../../server/CountsServer");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
class FogVideoEnterUI extends layaMaxUI_1.ui.gameui.fog.FogVideoEnterUI {
    constructor() {
        super();
        this.initBtn();
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_VIDEO_START);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    setData(data) {
        this.callBack = null;
        this.thisObj = null;
        if (data && data.callBack) {
            this.callBack = data.callBack;
        }
        if (data && data.thisObj) {
            this.thisObj = data.thisObj;
        }
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_video_start");
        this.receiveImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_START_SHOW);
        }
        //次数更新
        var userFogStreetVideoCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.fogStreetVideoCount);
        var fogStreetVideoTimes = GlobalParamsFunc_1.default.instance.getDataNum("fogStreetVideoTimes");
        this.countLab.text = userFogStreetVideoCount + "/" + fogStreetVideoTimes;
    }
    onReceiveBtnClick() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_START_CLICK);
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_VIDEO_START, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successCall, this.failCall, this);
    }
    successCall() {
        CountsServer_1.default.updateCount({ "id": CountsModel_1.default.fogStreetVideoCount }, () => {
            this.callBack && this.callBack.call(this.thisObj);
            this.close();
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_START_FINISH);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_START_FINISH);
            }
        }, this);
    }
    failCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogVideoEnterUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogVideoEnterUI;
//# sourceMappingURL=FogVideoEnterUI.js.map