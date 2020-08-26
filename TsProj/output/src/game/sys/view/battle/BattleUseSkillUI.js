"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
class BattleUseSkillUI extends layaMaxUI_1.ui.gameui.battle.BattleUseSkillUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.useBtn, this.onClickUse, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.onClickCLose, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this.callBack = data.callBack;
        this.thisObj = data.thisObj;
        this.controler = data.controler;
        this.skillId = data.skillId;
        this.controler.setGamePlayOrPause(true);
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_USESKILL);
        this.freeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
        var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_USESKILL);
        this.exitBtn.visible = true;
        if (delayTime) {
            this.exitBtn.visible = false;
            TimerManager_1.default.instance.setTimeout(() => {
                this.exitBtn.visible = true;
            }, this, delayTime);
        }
    }
    onClickUse() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELSKILL_CLICK, { id: this.controler.battleData.levelId, skillId: this.skillId });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_USESKILL, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.use, this.closeCall, this);
    }
    use() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELSKILL_FINISH, { id: this.controler.battleData.levelId, skillId: this.skillId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_LEVELSKILL_FINISH, { id: this.controler.battleData.levelId, skillId: this.skillId });
        }
        this.callBack && this.callBack.call(this.thisObj);
        this.onClickCLose();
    }
    closeCall() {
    }
    onClickCLose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleUseSkillUI);
        this.controler.setGamePlayOrPause(false);
    }
}
exports.default = BattleUseSkillUI;
//# sourceMappingURL=BattleUseSkillUI.js.map