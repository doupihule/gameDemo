"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const FogModel_1 = require("../../model/FogModel");
const FogFunc_1 = require("../../func/FogFunc");
const FogBagItemUI_1 = require("./FogBagItemUI");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class FogBagUI extends layaMaxUI_1.ui.gameui.fog.FogBagUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
    }
    setData() {
        this.propList = [];
        this.initBagPanel();
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_FogBag, this);
        this.itemPanel.vScrollBarSkin = "";
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("tid_fog_bag");
    }
    initBagPanel() {
        var props = FogModel_1.default.instance.getProp();
        for (var key in props) {
            if (props.hasOwnProperty(key)) {
                var cfg = FogFunc_1.default.instance.getItemInfo(key);
                if (props[key]) {
                    cfg["num"] = props[key];
                    this.propList.push(cfg);
                }
            }
        }
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.FogBagItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.iniPanelData));
    }
    iniPanelData() {
        this.itemPanel.removeChildren();
        for (var i = 0; i < this.propList.length; i++) {
            var item = this.propList[i];
            var bagItem = new FogBagItemUI_1.default(item, this);
            this.itemPanel.addChild(bagItem);
            bagItem.x = i % 4 * (bagItem.itemWidth + 10);
            bagItem.y = Math.floor(i / 4) * bagItem.itemHeight;
        }
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBagUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBagUI;
//# sourceMappingURL=FogBagUI.js.map