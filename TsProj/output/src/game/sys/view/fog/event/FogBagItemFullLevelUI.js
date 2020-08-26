"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../../func/FogFunc");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const FogServer_1 = require("../../../server/FogServer");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
class FogBagItemFullLevelUI extends layaMaxUI_1.ui.gameui.fog.FogBagItemFullLevelUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    //道具满级传参：
    setData(data) {
        this.itemArr = [];
        this.itemIds = [];
        this.exchangeCompNum = 0;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        //道具满级折算零件需要传入的参数：item(满级的道具id数组)["1001", "1002"]，viewType
        this.itemIds = data.item;
        for (var i = 0; i < this.itemIds.length; i++) {
            this.itemArr.push([DataResourceFunc_1.DataResourceType.FOGITEM, this.itemIds[i]]);
        }
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fogitem_full_level");
        //能折算出的零件总数
        this.exchangeCompNum = FogFunc_1.default.instance.getExchangeCompByItem(this.itemIds);
        this.lbl_desc.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_item_fulllevel_exchange") + this.exchangeCompNum;
        //奖励列表初始化
        this.initReward();
    }
    initReward() {
        this.itemList.repeatX = this.itemArr.length;
        this.itemList.array = this.itemArr;
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);
    }
    onListRender(cell, index) {
        var data = this.itemList.array[index];
        var itemIcon = cell.getChildByName("item").getChildByName("itemIcon");
        var result = FogFunc_1.default.instance.getResourceShowInfo(data);
        itemIcon.skin = result["icon"];
        itemIcon.scale(result["scale"], result["scale"]);
    }
    onClickReceive() {
        //道具满级兑换
        FogServer_1.default.exchangeComp({ "reward": this.exchangeCompNum, "item": this.itemIds }, this.close, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": [[DataResourceFunc_1.DataResourceType.COMP, this.exchangeCompNum]] });
        //飘奖励
        FogFunc_1.default.instance.flyResTween([[DataResourceFunc_1.DataResourceType.COMP, this.exchangeCompNum]], null);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBagItemFullLevelUI);
        this.callBack && this.callBack.call(this.thisObj);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBagItemFullLevelUI;
//# sourceMappingURL=FogBagItemFullLevelUI.js.map