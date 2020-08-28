"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogFunc_1 = require("../../func/FogFunc");
class FogShopItemDetailUI extends layaMaxUI_1.ui.gameui.fog.FogShopItemDetailUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickClose, this);
    }
    setData(data) {
        this.goods = data.goods;
        var goodsInfo = FogFunc_1.default.instance.getGoodsInfo(this.goods);
        var desc = goodsInfo.desc;
        var content = goodsInfo.content[0].split(",");
        var result = FogFunc_1.default.instance.getResourceShowInfo(content);
        //道具名字、数量
        this.itemName.text = result["name"] + "   X" + result["num"];
        //道具描述
        this.itemDesc.text = TranslateFunc_1.default.instance.getTranslate(desc, "TranslateGoods");
    }
    onClickClose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogShopItemDetailUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogShopItemDetailUI;
//# sourceMappingURL=FogShopItemDetailUI.js.map