"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const FogFunc_1 = require("../../../func/FogFunc");
const StringUtils_1 = require("../../../../../framework/utils/StringUtils");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
class FogRewardItemUI extends layaMaxUI_1.ui.gameui.fog.FogRewardItemUI {
    constructor(data) {
        super();
        this.itemWidth = 120;
        this.itemHeight = 165;
        this.reward = data;
        this.setData();
    }
    setData() {
        this.pieceImg.visible = false;
        var result = FogFunc_1.default.instance.getResourceShowInfo(this.reward);
        this.itemIcon.skin = result["icon"];
        this.itemIcon.scaleX = this.itemIcon.scaleY = result["scale"];
        this.itemLab.text = "x" + StringUtils_1.default.getCoinStr(result["num"]);
        if (Number(this.reward) == DataResourceFunc_1.DataResourceType.PIECE) {
            this.pieceImg.visible = true;
        }
    }
    itemTween() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogRewardItemUI;
//# sourceMappingURL=FogRewardItemUI.js.map