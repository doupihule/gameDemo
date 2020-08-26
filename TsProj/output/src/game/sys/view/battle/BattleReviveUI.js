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
const BattleConst_1 = require("../../consts/BattleConst");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
class BattleReviveUI extends layaMaxUI_1.ui.gameui.battle.BattleReviveUI {
    constructor() {
        super();
        this.waitTime = 5;
        this.timeCode = 0;
        this.isPause = false;
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.onClickCLose, this);
        new ButtonUtils_1.ButtonUtils(this.reviveBtn, this.onClickRevive, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.controler = data && data.controler;
        BannerAdManager_1.default.addBannerQuick(this);
        this.isPause = false;
        this.waitTime = GlobalParamsFunc_1.default.instance.getDataNum("fogResurrectionTime") / 1000 || 5;
        this.reviveType = data.reviveType;
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareName);
        this.adImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
        if (this.reviveType == BattleConst_1.default.REVIVETYPE_OVERTIME) {
            this.shareName = ShareTvOrderFunc_1.default.SHARELINE_BATTLEREVIVE_OVERTIME;
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_battleOvertime");
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELOVERTIME_SHOW, { level: this.controler.battleData.levelId });
            }
        }
        else if (this.reviveType == BattleConst_1.default.REVIVETYPE_DEFEAT) {
            this.shareName = ShareTvOrderFunc_1.default.SHARELINE_BATTLEREVIVE_DEFEAT;
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_battle_revive_defeat");
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELFAIL_SHOW, { level: this.controler.battleData.levelId });
            }
        }
        this.showLeftTime();
        this.timeCode = TimerManager_1.default.instance.add(this.showLeftTime, this, 1000);
        var delayTime = ShareTvOrderFunc_1.default.instance.getDelayShowTime(this.shareName);
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
            if (this.reviveType == BattleConst_1.default.REVIVETYPE_OVERTIME) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELOVERTIME_CLICK, { level: this.controler.battleData.levelId });
            }
            else if (this.reviveType == BattleConst_1.default.REVIVETYPE_DEFEAT) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELFAIL_CLICK, { level: this.controler.battleData.levelId });
            }
        }
        ShareOrTvManager_1.default.instance.shareOrTv(this.shareName, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.succCall, this.closeCall, this);
    }
    //
    succCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            if (this.reviveType == BattleConst_1.default.REVIVETYPE_OVERTIME) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELOVERTIME_FINISH, { level: this.controler.battleData.levelId });
            }
            else if (this.reviveType == BattleConst_1.default.REVIVETYPE_DEFEAT) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_LEVELFAIL_FINISH, { level: this.controler.battleData.levelId });
            }
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            if (this.reviveType == BattleConst_1.default.REVIVETYPE_OVERTIME) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_LEVELOVERTIME_FINISH, { level: this.controler.battleData.levelId });
            }
            else if (this.reviveType == BattleConst_1.default.REVIVETYPE_DEFEAT) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_LEVELFAIL_FINISH, { level: this.controler.battleData.levelId });
            }
        }
        this.revive();
    }
    //执行复活
    revive() {
        this.close();
        if (this.reviveType == BattleConst_1.default.REVIVETYPE_OVERTIME) {
            this.controler.overTimeRevive();
        }
        else if (this.reviveType == BattleConst_1.default.REVIVETYPE_DEFEAT) {
            this.controler.defeatRevive();
        }
    }
    closeCall() {
        this.isPause = false;
    }
    close() {
        this.controler.setGamePlayOrPause(false);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleReviveUI);
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
exports.default = BattleReviveUI;
//# sourceMappingURL=BattleReviveUI.js.map