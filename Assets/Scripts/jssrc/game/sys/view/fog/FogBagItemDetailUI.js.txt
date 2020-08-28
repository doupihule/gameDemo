"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogFunc_1 = require("../../func/FogFunc");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const FogPropTrigger_1 = require("../../../fog/trigger/FogPropTrigger");
class FogBagItemDetailUI extends layaMaxUI_1.ui.gameui.fog.FogBagItemDetailUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickClose, this);
    }
    setData(data) {
        this.cfg = data.cfg;
        this.itemUpDesc.visible = false;
        //道具名字、等级
        var itemName = TranslateFunc_1.default.instance.getTranslate(this.cfg.name, "TranslateItem");
        if (this.cfg.type == FogPropTrigger_1.default.ITEM_TYPE_CANUP) {
            var propInfo = FogFunc_1.default.instance.getItemInfo(this.cfg.id);
            if (Number(this.cfg.num) > propInfo.maxLevel) {
                this.cfg.num = Number(propInfo.maxLevel);
            }
            this.itemName.text = itemName + "   Lv." + this.cfg.num;
            var itemUpInfo = FogFunc_1.default.instance.getItemUpGradeInfo(this.cfg.id, this.cfg.num);
            if (itemUpInfo.desc) {
                this.itemUpDesc.visible = true;
                this.itemUpDesc.text = TranslateFunc_1.default.instance.getTranslate(itemUpInfo.desc, "TranslateItem");
            }
            else {
                this.itemUpDesc.visible = false;
            }
        }
        else if (this.cfg.type == FogPropTrigger_1.default.ITEM_TYPE_CANNOTUP) {
            this.itemName.text = itemName;
            this.itemUpDesc.visible = true;
            this.itemUpDesc.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_bagDetail_lab") + this.cfg.num;
        }
        //道具描述
        this.itemDesc.text = TranslateFunc_1.default.instance.getTranslate(this.cfg.desc, "TranslateItem");
        BannerAdManager_1.default.addBannerQuick(this);
    }
    onClickClose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBagItemDetailUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBagItemDetailUI;
//# sourceMappingURL=FogBagItemDetailUI.js.map