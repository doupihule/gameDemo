"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../../func/FogFunc");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
class FogComRewardUI extends layaMaxUI_1.ui.gameui.fog.FogComRewardUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.close, this);
    }
    setData(data) {
        this.callBack = null;
        this.thisObj = null;
        this.rewardArr = data.reward;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.cell = data.cell;
        if (this.rewardArr.length == 1) {
            this.reward2.visible = false;
            this.reward1.x = 130;
        }
        else if (this.rewardArr.length == 2) {
            this.reward2.visible = true;
            this.reward1.x = 39;
            var result2 = FogFunc_1.default.instance.getResourceShowInfo(this.rewardArr[1]);
            if (result2["num"] != 0) {
                this.rewardNum2.text = result2["name"] + "+" + result2["num"];
            }
            else {
                this.rewardNum2.text = "";
            }
            this.rewardImg2.skin = result2["icon"];
            this.rewardImg2.scale(result2["scale"], result2["scale"]);
        }
        //标题
        if (this.cell) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_gongxi");
        }
        else {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_shop_bugSucc");
        }
        var result1 = FogFunc_1.default.instance.getResourceShowInfo(this.rewardArr[0]);
        if (result1["num"] != 0) {
            this.rewardNum1.text = result1["name"] + "+" + result1["num"];
        }
        else {
            this.rewardNum1.text = "";
        }
        this.rewardImg1.skin = result1["icon"];
        this.rewardImg1.scale(result1["scale"], result1["scale"]);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogComRewardUI);
        if (this.cell) {
            //飘奖励 
            var thisObj = WindowManager_1.default.getUIByName("FogMainUI");
            FogFunc_1.default.instance.flyResTween(this.rewardArr, this.cell.x - 40, this.cell.y + thisObj.cellCtn.y);
        }
        this.callBack && this.callBack.call(this.thisObj);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogComRewardUI;
//# sourceMappingURL=FogComRewardUI.js.map