"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const LevelFunc_1 = require("../../func/LevelFunc");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
class BattleFullEnergyUI extends layaMaxUI_1.ui.gameui.battle.BattleFullEnergyUI {
    constructor() {
        super();
        this.isEnterBattle = false;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.fullStartBtn, this.onClickFullStart, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.normalStartBtn, this.normalStart, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.isEnterBattle = false;
        this.normalStartBtn.visible = false;
        //随机开场效果
        this.battleAddtionId = data.battleAddtionId;
        this.isShowTalk = data.isShowTalk || 1;
        this.callBack = data.callBack || null;
        this.thisObj = data.thisObj || null;
        var battleAddtionInfo = LevelFunc_1.default.instance.getBattleAddtionById(this.battleAddtionId);
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_START);
        this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            if (UserInfo_1.default.isWX()) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEADDTION_SHOW, { "battleAddtionId": this.battleAddtionId });
            }
            else {
            }
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEADDTION_SHOW, { "battleAddtionId": this.battleAddtionId });
        }
        this.rewardLab.text = TranslateFunc_1.default.instance.getTranslate(battleAddtionInfo.desc, "TranslateGlobal");
        this.rewardImg.skin = "uisource/video/video/" + battleAddtionInfo.addtionIcon + ".png";
        this.detail = data.detail;
        var showTvGetShtarLateTime = GlobalParamsFunc_1.default.instance.getDataNum("showTvGetShtarLateTime");
        TimerManager_1.default.instance.add(() => {
            this.normalStartBtn.visible = true;
        }, this, showTvGetShtarLateTime, 1);
    }
    normalStart() {
        if (this.isEnterBattle)
            return;
        this.isEnterBattle = true;
        this.battleAddtionId = 0;
        this.onClickCLose();
    }
    //满能量开场
    onClickFullStart() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEADDTION_CLICK, { "battleAddtionId": this.battleAddtionId });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_START, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.fullStart, this.closeCall, this);
    }
    //满能量开始
    fullStart() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEADDTION_FINISH, { "battleAddtionId": this.battleAddtionId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_BATTLEADDTION_FINISH, { "battleAddtionId": this.battleAddtionId });
        }
        if (this.isEnterBattle)
            return;
        this.isEnterBattle = true;
        this.onClickCLose();
        //效果生效
    }
    closeCall() {
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleFullEnergyUI);
    }
    onClickCLose() {
        if (this.callBack && this.thisObj) {
            this.callBack.call(this.thisObj);
        }
        this.detail.dispose();
        this.detail.enterBattleUI({ "fullStart": this.battleAddtionId, "isShowTalk": this.isShowTalk });
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleFullEnergyUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = BattleFullEnergyUI;
//# sourceMappingURL=BattleFullEnergyUI.js.map