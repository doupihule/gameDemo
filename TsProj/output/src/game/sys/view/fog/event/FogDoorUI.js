"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
const FogModel_1 = require("../../../model/FogModel");
const FogServer_1 = require("../../../server/FogServer");
const RolesFunc_1 = require("../../../func/RolesFunc");
const StringUtils_1 = require("../../../../../framework/utils/StringUtils");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
class FogDoorUI extends layaMaxUI_1.ui.gameui.fog.FogDoorUI {
    constructor() {
        super();
        this.isFinish = false; //是否完成事件
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.openBtn, this.onClickDirectOpen, this);
        new ButtonUtils_1.ButtonUtils(this.keyOpenBtn, this.onClickKeyOpen, this);
        new ButtonUtils_1.ButtonUtils(this.actOpenBtn, this.onClickActOpen, this);
    }
    setData(data) {
        this.keyCostId = "";
        this.actCostNum = 0;
        this.isFinish = false;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        this.initBtnGroup();
        //eventImg
        this.eventImg.skin = "fog/fog/" + this.eventInfo.uiIcon[0] + ".png";
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        BannerAdManager_1.default.addBannerQuick(this);
    }
    initBtnGroup() {
        this.unlockGroup.visible = false;
        this.lockedGroup.visible = false;
        var uiIcon = this.eventInfo.uiIcon[0];
        //未锁
        if (uiIcon == "fogstreet_door_unlocked") {
            this.unlockGroup.visible = true;
        }
        else if (uiIcon == "fogstreet_door_locked") {
            this.lockedGroup.visible = true;
            //开门消耗的道具ID;降低行动力消耗的角色ID;降低后行动力消耗值;
            var params = this.eventInfo.params;
            this.keyCostId = params[0];
            var reduceRole = params[1];
            var name = RolesFunc_1.default.instance.getRoleInfoById(reduceRole[0]).name;
            var roleName = TranslateFunc_1.default.instance.getTranslate(name, "TranslateRole");
            //判断是否有降低消耗的角色
            if (reduceRole) {
                var line = FogModel_1.default.instance.getLine();
                if (line.hasOwnProperty(reduceRole)) {
                    this.actCostNum = params[2];
                    this.doorDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[1], "TranslateEvent");
                }
                else {
                    this.actCostNum = this.events.mobilityCost || 0;
                    this.doorDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
                }
            }
            else {
                this.doorDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
                this.actCostNum = this.events.mobilityCost || 0;
            }
            //消耗行动力数
            this.actLab.text = "-" + this.actCostNum;
            //玩家钥匙数量
            this.keyNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getPropNum(this.keyCostId) + "");
        }
    }
    onClickDirectOpen() {
        this.finishCallBack();
    }
    onClickKeyOpen() {
        var userOwnKeyNum = FogModel_1.default.instance.getPropNum(this.keyCostId);
        if (userOwnKeyNum < 1) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughkey"));
            return;
        }
        FogServer_1.default.getReward({ "cost": [DataResourceFunc_1.DataResourceType.FOGITEM, this.keyCostId, 1] }, this.finishCallBack, this);
    }
    onClickActOpen() {
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < this.actCostNum) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        FogServer_1.default.getReward({ "cost": [DataResourceFunc_1.DataResourceType.ACT, this.actCostNum] }, this.finishCallBack, this);
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogDoorUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogDoorUI;
//# sourceMappingURL=FogDoorUI.js.map