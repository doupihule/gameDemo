"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../func/FogFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const FogServer_1 = require("../../server/FogServer");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const FogConst_1 = require("../../consts/FogConst");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const FogModel_1 = require("../../model/FogModel");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
class FogMultiRewardUI extends layaMaxUI_1.ui.gameui.fog.FogMultiRewardUI {
    constructor() {
        super();
        this.isShowItemLab = true; //是否显示item的lab
        this.isFinish = false; //事件是否完成
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        this.itemArr = [];
        this.viewType = data.viewType;
        this.isFinish = false;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        this.isShowItemLab = false;
        this.cell = data && data.cell;
        //奖励事件需要传入的参数：eventId,viewType
        if (data.event) {
            this.events = data.event;
            this.eventInfo = this.events.cfgData;
            if (this.events.eventData && this.events.eventData.reward && Object.keys(this.events.eventData.reward).length != 0) {
                this.itemArr = FogFunc_1.default.instance.vertRewardTableToArr(this.events.eventData.reward);
            }
            else {
                var params = this.eventInfo.params;
                var dropId;
                var dropArr;
                for (var i = 0; i < params.length; i++) {
                    dropId = params[i][0];
                    dropArr = FogFunc_1.default.instance.getDropGroupReward(dropId);
                    this.itemArr.push(GameUtils_1.default.getWeightItem(dropArr));
                }
                //保存事件随机出的奖励
                FogServer_1.default.addCellEvent({ cellId: this.cell.mySign, rewardArr: this.itemArr, id: this.events.eventId }, null, null);
            }
            this.isShowItemLab = true;
        }
        //宝箱奖励需要传入的参数：reward(奖励数组),viewType
        if (data.reward) {
            this.itemArr = data.reward;
            this.isShowItemLab = true;
        }
        //标题初始化
        this.initTitle();
        //奖励列表初始化
        this.initReward();
    }
    initTitle() {
        this.descGroup.visible = false;
        if (this.viewType == FogConst_1.default.VIEW_TYPE_REWARD_EVENT) {
            this.descGroup.visible = true;
            this.compImg.visible = false;
            this.itemList.y = 108;
            this.descGroup.y = 42;
            this.lbl_desc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc, "TranslateEvent");
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
            if (this.eventInfo.id == "3003" && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_9_901) {
                this.closeBtn.visible = false;
            }
            else {
                this.closeBtn.visible = true;
            }
        }
        //宝箱奖励弹窗
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_BOX_REWARD) {
            this.itemList.y = 81;
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("tid_fog_gongxi");
        }
    }
    initReward() {
        this.itemList.repeatX = this.itemArr.length;
        this.itemList.array = this.itemArr;
        if (this.itemArr.length == 1) {
            this.itemList.x = 183;
            this.itemList.width = 127;
        }
        else if (this.itemArr.length == 2) {
            this.itemList.x = 118;
            this.itemList.width = 257;
        }
        else if (this.itemArr.length == 3) {
            this.itemList.x = 55;
            this.itemList.width = 383;
        }
        else if (this.itemArr.length > 3) {
            this.itemList.x = 36;
            this.itemList.width = 421;
        }
        this.itemList.renderHandler = new Laya.Handler(this, this.onListRender);
        this.itemList.scrollTo(0);
    }
    onListRender(cell, index) {
        var data = this.itemList.array[index];
        var itemLab = cell.getChildByName("item").getChildByName("itemLab");
        var itemIcon = cell.getChildByName("item").getChildByName("itemIcon");
        var result = FogFunc_1.default.instance.getResourceShowInfo(data);
        if (this.isShowItemLab) {
            itemLab.text = "X" + StringUtils_1.default.getCoinStr(result["num"]);
        }
        else {
            itemLab.text = "";
        }
        itemIcon.skin = result["icon"];
        itemIcon.scale(result["scale"], result["scale"]);
    }
    onClickReceive() {
        //奖励事件
        if (this.viewType == FogConst_1.default.VIEW_TYPE_REWARD_EVENT) {
            var userActNum = FogModel_1.default.instance.getActNum();
            if (userActNum < Number(this.events.mobilityCost)) {
                FogModel_1.default.instance.checkFreeAct();
                return;
            }
            FogServer_1.default.getReward({ "reward": this.itemArr, "cost": [DataResourceFunc_1.DataResourceType.ACT, this.events.mobilityCost] }, this.finishCallBack, this);
            //保存FogReward数据
            FogServer_1.default.saveFogReward({ "reward": this.itemArr });
        }
        //宝箱奖励弹窗
        else if (this.viewType == FogConst_1.default.VIEW_TYPE_BOX_REWARD) {
            this.close();
        }
        var thisObj = WindowManager_1.default.getUIByName("FogMainUI");
        FogFunc_1.default.instance.flyResTween(this.itemArr, this.cell.x - 40, this.cell.y + thisObj.cellCtn.y);
    }
    finishCallBack() {
        this.isFinish = true;
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogMultiRewardUI);
        if (this.isFinish) {
            this.callBack && this.callBack.call(this.thisObj);
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogMultiRewardUI;
//# sourceMappingURL=FogMultiRewardUI.js.map