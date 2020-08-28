"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const FogFunc_1 = require("../../func/FogFunc");
class FogBagItemUI extends layaMaxUI_1.ui.gameui.fog.FogBagItemUI {
    constructor(cfg, owner) {
        super();
        this.itemWidth = 120;
        this.itemHeight = 165;
        //道具类型：1 可升级 2 不可升级
        this.ITEM_TYPE_CANUP = 1;
        this.ITEM_TYPE_CANNOTUP = 2;
        this.cfg = cfg;
        this.setData();
        new ButtonUtils_1.ButtonUtils(this.item, this.onClickItem, this);
    }
    setData() {
        this.itemIcon.skin = FogFunc_1.default.instance.getFogItemIcon(this.cfg.id);
        //判断道具类型
        if (this.cfg.type == this.ITEM_TYPE_CANUP) {
            var propInfo = FogFunc_1.default.instance.getItemInfo(this.cfg.id);
            if (Number(this.cfg.num) > propInfo.maxLevel) {
                this.cfg.num = Number(propInfo.maxLevel);
            }
            this.itemLab.text = "Lv." + this.cfg.num;
        }
        else if (this.cfg.type == this.ITEM_TYPE_CANNOTUP) {
            this.itemLab.text = this.cfg.num;
        }
    }
    onClickItem() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBagItemDetailUI, { "cfg": this.cfg });
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBagItemUI;
//# sourceMappingURL=FogBagItemUI.js.map