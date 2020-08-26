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
const StringUtils_1 = require("../../../../../framework/utils/StringUtils");
const ShareOrTvManager_1 = require("../../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../../func/ShareTvOrderFunc");
const FogServer_1 = require("../../../server/FogServer");
const UserModel_1 = require("../../../model/UserModel");
const BigNumUtils_1 = require("../../../../../framework/utils/BigNumUtils");
const FogModel_1 = require("../../../model/FogModel");
const Message_1 = require("../../../../../framework/common/Message");
const FogEvent_1 = require("../../../event/FogEvent");
class FogBusinessmanUI extends layaMaxUI_1.ui.gameui.fog.FogBusinessmanUI {
    constructor() {
        super();
        this.rewardArr = [];
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.buyBtn, this.onClickBuy, this);
        new ButtonUtils_1.ButtonUtils(this.freeBuyBtn, this.onClickFreeBuy, this);
    }
    setData(data) {
        this.costArr = [];
        this.reward = [];
        this.rewardArr = [];
        this.callBack = null;
        this.thisObj = null;
        this.events = data.event;
        this.cell = data.cell;
        this.eventId = this.events.eventId;
        this.eventInfo = this.events.cfgData;
        this.callBack = data && data.callBack;
        this.thisObj = data && data.thisObj;
        var params = this.eventInfo.params[0];
        //判断事件里面是否有保存的奖励数据
        if (this.events.eventData && this.events.eventData.reward && Object.keys(this.events.eventData.reward).length != 0) {
            this.reward = FogFunc_1.default.instance.vertRewardTableToArr(this.events.eventData.reward)[0];
            this.rewardArr = FogFunc_1.default.instance.vertRewardTableToArr(this.events.eventData.reward);
        }
        else {
            //事件参数：掉落组ID,消耗类型,ID（可不配）,数量;
            var dropId = params[0];
            var reward = FogFunc_1.default.instance.getDropGroupReward(dropId);
            this.reward = GameUtils_1.default.getWeightItem(reward);
            this.rewardArr.push(this.reward);
            //保存事件随机出的奖励
            FogServer_1.default.addCellEvent({ cellId: this.cell.mySign, rewardArr: this.rewardArr, id: this.eventId }, null, null);
        }
        //购买消耗
        this.costArr = params.length == 4 ? [params[1], params[2], params[3]] : [params[1], params[2]];
        var costResult = DataResourceFunc_1.default.instance.getDataResourceInfo(this.costArr);
        this.costNum.text = StringUtils_1.default.getCoinStr(costResult["num"]);
        this.costImg.skin = costResult["img"];
        this.upperLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.desc, "TranslateEvent", [costResult["num"]]);
        //道具组展示
        var result = FogFunc_1.default.instance.getResourceShowInfo(this.rewardArr[0]);
        this.roleName.text = result["name"];
        this.roleImg.skin = result["icon"];
        this.roleDesc.text = result["desc"];
        //标题
        this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
        //按钮初始化
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_BUSINESSMAN);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.freeBuyBtn.visible = false;
            this.buyBtn.x = 294;
        }
        else {
            this.freeBuyBtn.visible = true;
            this.buyBtn.x = 158;
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
        }
    }
    //消耗货币购买
    onClickBuy() {
        //判断货币是否充足
        switch (Number(this.costArr[0])) {
            case DataResourceFunc_1.DataResourceType.GOLD:
                var gold = UserModel_1.default.instance.getGold();
                if (Number(this.costArr[1]) > Number(gold)) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
            case DataResourceFunc_1.DataResourceType.COIN:
                if (BigNumUtils_1.default.compare(Number(this.costArr[1]), UserModel_1.default.instance.getCoin())) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
            //零件    
            case DataResourceFunc_1.DataResourceType.COMP:
                if (Number(this.costArr[1]) > FogModel_1.default.instance.getCompNum()) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcomp"));
                    return;
                }
                break;
            //迷雾币    
            case DataResourceFunc_1.DataResourceType.FOGCOIN:
                if (Number(this.costArr[1]) > UserModel_1.default.instance.getFogCoinNum()) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughfogcoin"));
                    return;
                }
                break;
        }
        //消耗行动力判断
        var userActNum = FogModel_1.default.instance.getActNum();
        if (userActNum < Number(this.events.mobilityCost)) {
            FogModel_1.default.instance.checkFreeAct();
            return;
        }
        FogServer_1.default.businessBuy({ "cost": this.costArr, "reward": [this.reward], "costAct": this.events.mobilityCost }, this.buyCallBack, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": [this.reward] });
    }
    buyCallBack() {
        this.close();
        //刷新当前事件的状态
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_CELLEVENT, { cell: this.cell });
        //购买或领取成功后，弹获得奖励弹窗
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogComRewardUI, { "reward": this.rewardArr, cell: this.cell, callBack: this.finishOpen, thisObj: this });
    }
    //完成弹窗奖励展示后，刷新后置事件的显示
    finishOpen() {
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_BEHINDEVENT, { cell: this.cell });
    }
    //看视频免费获得
    onClickFreeBuy() {
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_BUSINESSMAN, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, () => { }, this);
    }
    successfull() {
        FogServer_1.default.businessBuy({ "reward": [this.reward] }, this.buyCallBack, this);
        //保存FogReward数据
        FogServer_1.default.saveFogReward({ "reward": [this.reward] });
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBusinessmanUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBusinessmanUI;
//# sourceMappingURL=FogBusinessmanUI.js.map