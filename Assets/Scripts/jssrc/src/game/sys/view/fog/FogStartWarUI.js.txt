"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
class FogStartWarUI extends layaMaxUI_1.ui.gameui.fog.FogStartWarUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.confirmBtn, this.onClickConfirm, this);
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.close, this);
    }
    setData(data) {
        this.thisObj = data.thisObj;
        this.callBack = data.callBack;
        this.descLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_start_war");
        BannerAdManager_1.default.addBannerQuick(this);
    }
    onClickConfirm() {
        this.callBack && this.callBack.call(this.thisObj);
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogStartWarUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogStartWarUI;
//# sourceMappingURL=FogStartWarUI.js.map