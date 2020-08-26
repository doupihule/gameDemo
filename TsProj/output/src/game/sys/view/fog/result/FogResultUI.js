"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../../framework/utils/ButtonUtils");
const BannerAdManager_1 = require("../../../../../framework/manager/BannerAdManager");
const WindowManager_1 = require("../../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../../consts/WindowCfgs");
const FogModel_1 = require("../../../model/FogModel");
const StringUtils_1 = require("../../../../../framework/utils/StringUtils");
const FogConst_1 = require("../../../consts/FogConst");
const FogFunc_1 = require("../../../func/FogFunc");
const ShareOrTvManager_1 = require("../../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../../func/ShareTvOrderFunc");
const UserInfo_1 = require("../../../../../framework/common/UserInfo");
const StatisticsManager_1 = require("../../../manager/StatisticsManager");
const GlobalParamsFunc_1 = require("../../../func/GlobalParamsFunc");
const CacheManager_1 = require("../../../../../framework/manager/CacheManager");
const StorageCode_1 = require("../../../consts/StorageCode");
const TimerManager_1 = require("../../../../../framework/manager/TimerManager");
const TweenAniManager_1 = require("../../../manager/TweenAniManager");
const DataResourceServer_1 = require("../../../server/DataResourceServer");
const DataResourceFunc_1 = require("../../../func/DataResourceFunc");
const ButtonConst_1 = require("../../../../../framework/consts/ButtonConst");
const FogServer_1 = require("../../../server/FogServer");
const FogPropTrigger_1 = require("../../../../fog/trigger/FogPropTrigger");
const TaskServer_1 = require("../../../server/TaskServer");
const TaskConditionTrigger_1 = require("../../../trigger/TaskConditionTrigger");
class FogResultUI extends layaMaxUI_1.ui.gameui.fog.FogResultUI {
    constructor() {
        super();
        this.posArr = [];
        this.addPercent = 1;
        new ButtonUtils_1.ButtonUtils(this.returnLab, this.oneReceive, this);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.oneReceive, this);
        new ButtonUtils_1.ButtonUtils(this.multiBtn, this.multiReceive, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        this.bgImg.on(Laya.Event.MOUSE_DOWN, this, this.onClickContinue);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        this.addPercent = 1;
        this.reward = {};
        this.posArr = [12, 144, 277, 412];
        this.resultRatio = 1;
        this.thisObj = data && data.thisObj;
        //最大层数
        this.maxLayer.text = FogModel_1.default.instance.getCurLayer() + 1 + "";
        //获得零件数
        this.compNum.text = "X" + StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getCompNum() + "");
        //获得道具数
        this.itemNum.text = "X" + StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getPropTotalNum() + "");
        //完成事件数
        this.eventNum.text = "X" + StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getCountsById(FogConst_1.default.FOG_COUNT_EVENTFINISH) + "");
        //击败敌人数
        this.killNum.text = "X" + StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getCountsById(FogConst_1.default.FOG_COUNT_FIGHTENEMY) + "");
        this.scoreGroup.visible = false;
        this.bottumGroup.visible = false;
        this.coinNum.visible = false;
        this.fogCoinNum.visible = false;
        //总积分
        var totalScore = FogFunc_1.default.instance.getScore();
        this.scoreNum.text = totalScore + "";
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_END, { layer: this.maxLayer.text, totalScore: totalScore });
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddResultReward, this);
        //获得的奖励:奖励数组
        this.reward = FogFunc_1.default.instance.calcuResultReward(totalScore, this.addPercent);
        //按钮初始化
        this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_MULTI_RESULT);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE || (!this.reward[0] && !this.reward[1])) {
            this.multiBtn.visible = false;
            this.returnBtn.visible = true;
            this.returnLab.visible = false;
        }
        else {
            this.multiBtn.visible = true;
            this.returnBtn.visible = false;
            this.returnLab.visible = false;
            //延迟出现
            var starRewardLeaveTime = GlobalParamsFunc_1.default.instance.getDataNum("starRewardLeaveTime");
            TimerManager_1.default.instance.add(() => {
                this.returnLab.visible = true;
            }, this, starRewardLeaveTime, 1);
            this.freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SETTLEMANT_SHOW);
            }
            else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHAREVIDEO) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_CHOOSE_SHOW);
            }
        }
        this.resultCount = CacheManager_1.default.instance.getLocalCache(StorageCode_1.default.storage_fogBattleResultCount);
        if (!this.resultCount) {
            this.resultCount = 0;
        }
        var settlementDouble = GlobalParamsFunc_1.default.instance.getDataArray('settlementDouble');
        this.resultRatio = settlementDouble[this.resultCount % settlementDouble.length];
        this.freeLab.text = this.resultRatio + '倍领取';
        this.addTimer();
        TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_fogResultCount });
    }
    //加定时器
    addTimer() {
        for (var i = 0; i <= 3; i++) {
            TimerManager_1.default.instance.setTimeout((data) => {
                TweenAniManager_1.default.instance.horizontalAni(this["item" + data[0]], this.posArr[data[0]], () => {
                    if (data[0] == 3) {
                        this.scoreGroup.visible = true;
                        this.bottumGroup.visible = true;
                        this.addTxtTimer();
                    }
                }, this, 400);
            }, this, i * 500, [i]);
        }
    }
    //资源文字定时器
    addTxtTimer() {
        TimerManager_1.default.instance.setTimeout(() => {
            this.txtTween(this.fogCoinNum, 0, this.reward[1]);
        }, this, 200);
        TimerManager_1.default.instance.setTimeout(() => {
            this.txtTween(this.coinNum, 0, this.reward[0]);
        }, this, 600);
    }
    txtTween(item, num, addResNum) {
        if (item.visible) {
            return;
        }
        item.visible = true;
        item.text = StringUtils_1.default.getCoinStr(num);
        item.scaleX = item.scaleY = 1;
        //播放数字变化效果
        Laya.Tween.to(item, { scaleX: 1.3, scaleY: 1.3 }, 200, null, Laya.Handler.create(this, () => {
            item.text = "X" + StringUtils_1.default.getCoinStr(num + Number(addResNum));
            item.color = "#02a43c";
        }));
        TimerManager_1.default.instance.setTimeout(() => {
            item.scaleX = item.scaleY = 1;
            item.color = "#ffffff";
        }, this, 600);
    }
    onClickContinue() {
        this.removeTimer();
        //全部显示出来
        for (var i = 0; i <= 3; i++) {
            this["item" + i].x = this.posArr[i];
        }
        this.scoreGroup.visible = true;
        this.bottumGroup.visible = true;
        this.coinNum.visible = true;
        this.fogCoinNum.visible = true;
        this.coinNum.text = "X" + StringUtils_1.default.getCoinStr(this.reward[0] + "");
        this.fogCoinNum.text = "X" + StringUtils_1.default.getCoinStr(this.reward[1] + "");
    }
    removeTimer() {
        for (var i = 0; i <= 3; i++) {
            Laya.Tween.clearAll(this["item" + i]);
        }
        Laya.Tween.clearAll(this.fogCoinNum);
        Laya.Tween.clearAll(this.coinNum);
    }
    //多被领取
    multiReceive() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SETTLEMANT_CLICK);
        if (UserInfo_1.default.isTT()) {
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_MULTI_RESULT, ShareOrTvManager_1.default.TYPE_SHAREVIDEO, null, this.successCall, () => { }, this, ShareOrTvManager_1.default.TYPE_SHAREVIDEO);
        }
        else {
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_MULTI_RESULT, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, () => { }, this);
        }
    }
    successCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SETTLEMANT_FINISH);
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_SETTLEMENT_FINISH);
        }
        //多倍奖励
        var reward = {
            [DataResourceFunc_1.DataResourceType.COIN]: this.reward[0] * this.resultRatio,
            [DataResourceFunc_1.DataResourceType.FOGCOIN]: this.reward[1] * this.resultRatio,
        };
        // 领取次数增加
        this.resultCount++;
        DataResourceServer_1.default.updateResource({ "res": reward, "rewardCount": this.resultCount }, this.close, this);
    }
    //单倍领取
    oneReceive() {
        //多倍奖励
        var reward = {
            [DataResourceFunc_1.DataResourceType.COIN]: this.reward[0],
            [DataResourceFunc_1.DataResourceType.FOGCOIN]: this.reward[1],
        };
        // 领取次数增加
        this.resultCount++;
        DataResourceServer_1.default.updateResource({ "res": reward, "rewardCount": this.resultCount }, this.close, this);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogResultUI);
        this.thisObj && this.thisObj.exitBattle();
        FogServer_1.default.exitGame();
        WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.FogMainUI);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogResultUI;
//# sourceMappingURL=FogResultUI.js.map