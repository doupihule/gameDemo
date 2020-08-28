"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const ResourceConst_1 = require("../../consts/ResourceConst");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogModel_1 = require("../../model/FogModel");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const FogConst_1 = require("../../consts/FogConst");
class FogTipUI extends layaMaxUI_1.ui.gameui.fog.FogTipUI {
    constructor() {
        super();
        this.addEvent();
        new ButtonUtils_1.ButtonUtils(this.confirmBtn, this.onClickConfirm, this);
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.overBtn, this.onClickOver, this);
        new ButtonUtils_1.ButtonUtils(this.pauseBtn, this.onClickPause, this);
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.onClickConfirm, this);
        new ButtonUtils_1.ButtonUtils(this.continueBtn, this.close, this);
    }
    /**添加事件监听 */
    addEvent() {
    }
    setData(data) {
        this.viewType = data.type;
        this.thisObj = data.thisObj;
        this.callBack = data.callBack;
        this.commonTip.visible = true;
        this.exitGroup.visible = false;
        this.titleLab.text = "";
        this.titleImg.skin = "";
        this.bgImg.height = 362;
        var fogMain = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.FogMainUI);
        this.fogControler = fogMain.fogControler;
        this.confirmBtn.visible = true;
        this.tipBtnGroup.visible = false;
        this.btn_close.visible = true;
        //前置事件
        if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_FRONTEVENT) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_tip");
            this.descLab.text = TranslateFunc_1.default.instance.getTranslate(data.tip, "TranslateEvent");
        }
        //下一层
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_NEXTLAYER) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_next_layer");
            this.descLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fogStreet_nextlayer", "TranslateFogStreet");
        }
        //通关
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_PASS_SUCCESS) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_pass");
            this.descLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fogStreet_success", "TranslateFogStreet");
        }
        //结束本局
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_FINISH_BATTLE) {
            this.descLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fogStreet_giveup", "TranslateFogStreet");
            this.titleImg.skin = ResourceConst_1.default.FOG_TIP_OVERGAME;
        }
        //离开
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_EXIT_FOG) {
            this.commonTip.visible = false;
            this.exitGroup.visible = true;
            this.titleImg.skin = ResourceConst_1.default.FOG_TIP_EXIT;
            this.bgImg.height = 292;
        }
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_NOACT) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughact");
            this.descLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_tip_noact");
            this.confirmBtn.visible = false;
            this.tipBtnGroup.visible = true;
            this.btn_close.visible = false;
        }
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_DEFEAT) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_tip_defeat");
            this.descLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_tip_defeatContent", null, GlobalParamsFunc_1.default.instance.getDataNum("fogExitTipsTimes"));
            this.confirmBtn.visible = false;
            this.tipBtnGroup.visible = true;
            this.btn_close.visible = false;
        }
        this.btn_close.y = this.bgImg.height - 60;
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
    }
    onClickConfirm() {
        //前置事件
        if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_FRONTEVENT) {
            this.close();
        }
        //下一层
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_NEXTLAYER) {
            this.fogControler.cellMapControler.enterNextLayer();
            var fogMain = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.FogMainUI);
            fogMain.setData(null);
            this.close();
        }
        //通关
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_PASS_SUCCESS) {
            //判断是否获得奖励：如果玩家游戏过程中没有获得任何战利品，则直接进入下一步奖励结算
            if (FogModel_1.default.instance.getFogOuterReward().length == 0) {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogResultUI, { thisObj: this.fogControler });
            }
            else {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogResultRewardUI, { thisObj: this.fogControler });
            }
        }
        //结束本局
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_FINISH_BATTLE) {
            this.overGame();
        }
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_NOACT) {
            this.onDefeatOrNoAct();
        }
        else if (this.viewType == FogConst_1.default.FOG_VIEW_TYPE_DEFEAT) {
            this.onDefeatOrNoAct();
        }
    }
    onDefeatOrNoAct() {
        var battleResult = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.BattleResultUI);
        if (battleResult && battleResult.parent && battleResult.visible) {
            battleResult.exitBattle();
        }
        var battleDetail = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.BattleDetailUI);
        if (battleDetail && battleDetail.parent && battleDetail.visible) {
            battleDetail.dispose();
            WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleDetailUI);
        }
        this.overGame();
    }
    //结束本局游戏
    overGame() {
        //@zm 后续先弹奖励
        this.close();
        //判断是否获得奖励：如果玩家游戏过程中没有获得任何战利品，则直接进入下一步奖励结算
        if (FogModel_1.default.instance.getFogOuterReward().length == 0) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogResultUI, { thisObj: this.fogControler });
        }
        else {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogResultRewardUI, { thisObj: this.fogControler });
        }
    }
    /**点击结束 */
    onClickOver() {
        this.setData({ type: FogConst_1.default.FOG_VIEW_TYPE_FINISH_BATTLE, thisObj: this.thisObj, callBack: this.callBack });
    }
    /**点击暂退 */
    onClickPause() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_LEAVE, { layer: FogModel_1.default.instance.getCurLayer() + 1 });
        this.exit();
    }
    exit() {
        this.fogControler && this.fogControler.exitBattle();
        this.close();
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.FogMainUI);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogTipUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogTipUI;
//# sourceMappingURL=FogTipUI.js.map