"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const FogFunc_1 = require("../../../func/FogFunc");
const TranslateFunc_1 = require("../../../../../framework/func/TranslateFunc");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
const FogModel_1 = require("../../../model/FogModel");
const FogServer_1 = require("../../../server/FogServer");
const GameUtils_1 = require("../../../../../utils/GameUtils");
const RolesFunc_1 = require("../../../func/RolesFunc");
const FogConst_1 = require("../../../consts/FogConst");
const StringUtils_1 = require("../../../../../framework/utils/StringUtils");
const Message_1 = require("../../../../../framework/common/Message");
const FogEvent_1 = require("../../../event/FogEvent");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
class FogBoxUI extends layaMaxUI_1.ui.gameui.fog.FogBoxUI {
    constructor() {
        super();
        this.rewardArr = []; //奖励
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.openBtn, this.onClickDirectOpen, this);
        new ButtonUtils_1.ButtonUtils(this.keyOpenBtn, this.onClickKeyOpen, this);
        new ButtonUtils_1.ButtonUtils(this.actOpenBtn, this.onClickActOpen, this);
    }
    setData(data) {
        this.keyCostId = "";
        this.actCostNum = 0;
        this.rewardArr = [];
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        //宝箱id
        this.boxId = this.eventInfo.params[0];
        this.initBtnGroup();
        this.boxImg.skin = "fog/fog/" + this.eventInfo.uiIcon[0] + ".png";
        //初始化奖励
        this.initReward();
        BannerAdManager_1.default.addBannerQuick(this);
    }
    initBtnGroup() {
        this.unlockGroup.visible = false;
        this.lockedGroup.visible = false;
        if (this.eventInfo.desc) {
            this.boxDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
        }
        var boxInfo = FogFunc_1.default.instance.getBoxInfo(this.boxId);
        //判断宝箱开启状态
        if (!boxInfo.key) {
            this.unlockGroup.visible = true;
        }
        else {
            this.lockedGroup.visible = true;
            this.keyCostId = boxInfo.key;
            var reduceRole = boxInfo.reduceRole;
            var name = RolesFunc_1.default.instance.getRoleInfoById(reduceRole[0]).name;
            var roleName = TranslateFunc_1.default.instance.getTranslate(name, "TranslateRole");
            //判断是否有降低消耗的角色
            if (boxInfo.reduceRole) {
                var line = FogModel_1.default.instance.getLine();
                if (line.hasOwnProperty(boxInfo.reduceRole[0])) {
                    this.actCostNum = boxInfo.reduceRole[1];
                    this.boxDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[1], "TranslateEvent");
                }
                else {
                    this.actCostNum = this.events.mobilityCost || 0;
                    this.boxDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
                }
            }
            else {
                this.boxDesc.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc[0], "TranslateEvent");
                this.actCostNum = this.events.mobilityCost || 0;
            }
            //消耗行动力数
            this.actLab.text = "-" + this.actCostNum;
            //玩家钥匙数量
            this.keyNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getPropNum(this.keyCostId) + "");
        }
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
    }
    //随机奖励组
    initReward() {
        var boxInfo = FogFunc_1.default.instance.getBoxInfo(this.boxId);
        var dropGroups = boxInfo.dropGroups;
        //每个掉落组都随机出奖励
        var dropId;
        var dropArr;
        for (var i = 0; i < dropGroups.length; i++) {
            dropId = dropGroups[i][0];
            var randomNum = GameUtils_1.default.getRandomInt(0, 10000);
            if (randomNum < Number(dropGroups[i][1])) {
                dropArr = FogFunc_1.default.instance.getDropGroupReward(dropId);
                this.rewardArr.push(GameUtils_1.default.getWeightItem(dropArr));
            }
        }
    }
    //获得奖励，弹恭喜获得界面
    openCallBack() {
        this.close();
        //刷新当前事件的状态
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_CELLEVENT, { cell: this.cell });
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogMultiRewardUI, { "reward": this.rewardArr, cell: this.cell, "viewType": FogConst_1.default.VIEW_TYPE_BOX_REWARD, callBack: this.finishOpen, thisObj: this });
    }
    onClickDirectOpen() {
        FogServer_1.default.getReward({ "reward": this.rewardArr }, this.openCallBack, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": this.rewardArr });
    }
    onClickKeyOpen() {
        var userOwnKeyNum = FogModel_1.default.instance.getPropNum(this.keyCostId);
        if (userOwnKeyNum < 1) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughkey"));
            return;
        }
        FogServer_1.default.getReward({ "reward": this.rewardArr, "cost": [DataResourceFunc_1.DataResourceType.FOGITEM, this.keyCostId, 1] }, this.openCallBack, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": this.rewardArr });
    }
    onClickActOpen() {
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < this.actCostNum) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        FogServer_1.default.getReward({ "reward": this.rewardArr, "cost": [DataResourceFunc_1.DataResourceType.ACT, this.actCostNum] }, this.openCallBack, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": this.rewardArr });
    }
    //完成打开宝箱后，刷新后置事件的显示
    finishOpen() {
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_BEHINDEVENT, { cell: this.cell });
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBoxUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBoxUI;
//# sourceMappingURL=FogBoxUI.js.map