"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../../func/FogFunc");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const GameUtils_1 = require("../../../../../utils/GameUtils");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
const ShareOrTvManager_1 = require("../../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../../func/ShareTvOrderFunc");
const FogServer_1 = require("../../../server/FogServer");
const ButtonConst_1 = require("../../../../../framework/consts/ButtonConst");
const BattleRoleView_1 = require("../../../../battle/view/BattleRoleView");
const PoolTools_1 = require("../../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../../consts/PoolCode");
const BattleFunc_1 = require("../../../func/BattleFunc");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
const Message_1 = require("../../../../../framework/common/Message");
const FogEvent_1 = require("../../../event/FogEvent");
const StatisticsManager_1 = require("../../../manager/StatisticsManager");
const FogModel_1 = require("../../../model/FogModel");
class FogChooseUI extends layaMaxUI_1.ui.gameui.fog.FogChooseUI {
    constructor() {
        super();
        this.rewardArr = [];
        this.chooseIndex = -1; //当前选择index
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.singleBtn, this.onClickSingle, this);
        new ButtonUtils_1.ButtonUtils(this.allBtn, this.onClickAll, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.item0, this.onClickitem, this, null, null, 0);
        new ButtonUtils_1.ButtonUtils(this.item1, this.onClickitem, this, null, null, 1);
    }
    setData(data) {
        this.chooseIndex = -1;
        this.rewardArr = [];
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //描述
        this.eventDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
        //item初始化
        //事件参数：掉落组ID1;掉落组ID2;
        var params = this.eventInfo.params;
        var result;
        var drop;
        var reward;
        //判断事件里面是否有保存的奖励数据
        if (this.events.eventData && this.events.eventData.reward && Object.keys(this.events.eventData.reward).length != 0) {
            this.rewardArr = FogFunc_1.default.instance.vertRewardTableToArr(this.events.eventData.reward);
        }
        else {
            for (var i = 0; i < params.length; i++) {
                drop = FogFunc_1.default.instance.getDropGroupReward(params[i]);
                reward = GameUtils_1.default.getWeightItem(drop);
                this.rewardArr.push(reward);
                this.rewardArr.sort(this.sortReward);
            }
            //保存事件随机出的奖励
            FogServer_1.default.addCellEvent({ cellId: this.cell.mySign, rewardArr: this.rewardArr, id: this.eventId }, null, null);
        }
        for (var i = 0; i < this.rewardArr.length; i++) {
            //道具组展示
            result = FogFunc_1.default.instance.getResourceShowInfo(this.rewardArr[i]);
            this["itemName" + i].text = result["name"];
            this["itemImg" + i].skin = result["icon"];
            this["itemImg" + i].scale(result["scale"], result["scale"]);
            this["itemDesc" + i].text = result["desc"];
            this["itemChoose" + i].visible = false;
            //根据类型判断是否显示数量
            if (FogFunc_1.default.showNumInUI.indexOf(Number(this.rewardArr[i][0])) != -1) {
                this["itemNum" + i].visible = true;
                this["itemNum" + i].text = result["num"];
            }
            else {
                this["itemNum" + i].visible = false;
            }
        }
        //角色spine
        this.showRoleSpine();
        //按钮初始化
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_CHOOSE);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.allBtn.visible = false;
            this.singleBtn.x = 275;
        }
        else {
            this.allBtn.visible = true;
            this.singleBtn.x = 168;
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_CHOOSE_SHOW);
            }
        }
        BannerAdManager_1.default.addBannerQuick(this);
    }
    //奖励数据排序
    sortReward(a, b) {
        var indexA = Number(a[0]);
        var indexB = Number(b[0]);
        if (indexA < indexB) {
            return Number(a[0]) - Number(b[0]);
        }
        else if (indexA > indexB) {
            return Number(b[0]) - Number(a[0]);
        }
        else {
            //判断id
            var idA = Number(a[1]);
            var idB = Number(b[1]);
            if (idA > idB) {
                return idA - idB;
            }
            else if (idA < idB) {
                return idB - idA;
            }
        }
    }
    showRoleSpine() {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
        }
        if (this.eventInfo.uiSpine) {
            var spine = this.eventInfo.uiSpine;
            var item = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + spine[0]);
            var scaleRoleInfo = BattleFunc_1.default.defaultScale * Number(spine[2]) / 10000;
            if (!item) {
                this.roleAnim = new BattleRoleView_1.default(spine[0], scaleRoleInfo, 0, "FogChooseUI");
            }
            else {
                this.roleAnim = item;
                this.roleAnim.setItemViewScale(scaleRoleInfo);
            }
            this.roleSpine.addChild(this.roleAnim);
            this.roleAnim.play(spine[1], true);
        }
    }
    onClickitem(index) {
        this["itemChoose" + index].visible = true;
        this["itemChoose" + (1 - index)].visible = false;
        this.chooseIndex = index;
    }
    onClickSingle() {
        if (this.chooseIndex == -1) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_choose_tip"));
            return;
        }
        //消耗行动力判断
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < Number(this.events.mobilityCost)) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        FogServer_1.default.chooseReward({ "reward": [this.rewardArr[this.chooseIndex]], "cost": [DataResourceFunc_1.DataResourceType.ACT, this.events.mobilityCost] }, () => {
            this.chooseCallBack();
            //购买或领取成功后，弹获得奖励弹窗
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogComRewardUI, { "reward": [this.rewardArr[this.chooseIndex]], "cell": this.cell });
        }, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": [this.rewardArr[this.chooseIndex]] });
    }
    onClickAll() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_CHOOSE_CLICK);
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_CHOOSE, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, () => { }, this);
    }
    successfull() {
        FogServer_1.default.chooseReward({ "reward": this.rewardArr }, () => {
            this.chooseCallBack();
            //购买或领取成功后，弹获得奖励弹窗
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogComRewardUI, { "reward": this.rewardArr, cell: this.cell, callBack: this.finishOpen, thisObj: this });
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_CHOOSE_FINISH);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_CHOOSE_FINISH);
            }
        }, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": this.rewardArr });
    }
    //完成弹窗奖励展示后，刷新后置事件的显示
    finishOpen() {
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_BEHINDEVENT, { cell: this.cell });
    }
    chooseCallBack() {
        this.close();
        //刷新当前事件的状态
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_CELLEVENT, { cell: this.cell });
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogChooseUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogChooseUI;
//# sourceMappingURL=FogChooseUI.js.map