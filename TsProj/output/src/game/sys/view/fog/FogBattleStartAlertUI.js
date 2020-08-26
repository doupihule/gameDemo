"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const FogModel_1 = require("../../model/FogModel");
const FogServer_1 = require("../../server/FogServer");
const FogFunc_1 = require("../../func/FogFunc");
class FogBattleStartAlertUI extends layaMaxUI_1.ui.gameui.fog.FogBattleStartAlertUI {
    constructor() {
        super();
        this.isEnterBattle = false;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.fullStartBtn, this.onClickFullStart, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.startBtn, this.normalStart, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.isEnterBattle = false;
        this.detail = data.detail;
        var info = GlobalParamsFunc_1.default.instance.getDataArray("fogBattleAddtion");
        this.itemId = info[0];
        this.addEnergyNum = info[1];
        this.itemCount = FogModel_1.default.instance.getPropNum(this.itemId);
        this.leftCountTxt.text = this.itemCount + "";
        this.freeType = null;
        if (this.itemCount > 0) {
            this.freeImg.visible = false;
        }
        else {
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_BATTLE_START);
            this.freeImg.visible = true;
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_JITANG_SHOW);
            }
        }
        this.itemImg.skin = FogFunc_1.default.instance.getFogItemIcon(this.itemId);
        this.desTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_battleStart_addEnergy", null, this.addEnergyNum);
    }
    normalStart() {
        if (this.detail.actCost > FogModel_1.default.instance.getActNum()) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        if (this.isEnterBattle)
            return;
        this.isEnterBattle = true;
        this.onClickCLose();
    }
    //干了它
    onClickFullStart() {
        if (this.detail.actCost > FogModel_1.default.instance.getActNum()) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        if (this.itemCount > 0) {
            //消耗道具
            FogServer_1.default.itemCost({ id: this.itemId }, this.fullStart, this);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_JITANG_USE);
        }
        else {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_JITANG_CLICK);
            }
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_BATTLE_START, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.fullStart, this.closeCall, this);
        }
    }
    //满能量开始
    fullStart() {
        if (this.isEnterBattle)
            return;
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_JITANG_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_JITANG_FINISH);
            }
        }
        this.isEnterBattle = true;
        FogModel_1.default.fogAddEnergy = Number(this.addEnergyNum);
        this.onClickCLose();
    }
    closeCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBattleStartAlertUI);
    }
    onClickCLose() {
        this.close();
        this.detail.onClickStartGame();
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBattleStartAlertUI;
//# sourceMappingURL=FogBattleStartAlertUI.js.map