"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WorkModel_1 = require("../../model/WorkModel");
const WorkConst_1 = require("../../consts/WorkConst");
const WorkFunc_1 = require("../../func/WorkFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WorkRoleItemUI_1 = require("./WorkRoleItemUI");
const FogFunc_1 = require("../../func/FogFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const Client_1 = require("../../../../framework/common/kakura/Client");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const WorkServer_1 = require("../../server/WorkServer");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ChapterConst_1 = require("../../consts/ChapterConst");
const UserModel_1 = require("../../model/UserModel");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const Message_1 = require("../../../../framework/common/Message");
const WorkEvent_1 = require("../../event/WorkEvent");
class WorkInfoItemUI extends layaMaxUI_1.ui.gameui.work.WorkInfoItemUI {
    constructor(ui) {
        super();
        this.workUI = ui;
        new ButtonUtils_1.ButtonUtils(this.startBtn, this.onClickStart, this);
        new ButtonUtils_1.ButtonUtils(this.goldBtn, this.onClickGold, this);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onClickReceive, this);
        new ButtonUtils_1.ButtonUtils(this.quickFinishBtn, this.onClickQuickFinish, this);
    }
    setData(data) {
        var id = data.id;
        this.cfg = WorkFunc_1.default.instance.getCfgDatas("Work", id);
        this.nameTxt.text = TranslateFunc_1.default.instance.getTranslate(this.cfg.name);
        this.desTxt.text = TranslateFunc_1.default.instance.getTranslate(this.cfg.desc);
        var star = this.cfg.star;
        for (var i = 0; i < 6; i++) {
            var starItem = this.starGroup.getChildAt(i);
            if (i < star) {
                if (starItem) {
                    starItem.visible = true;
                }
                else {
                    starItem = new Laya.Image("uisource/common/common/equip_image_xing1.png");
                    starItem.width = 31;
                    starItem.height = 31;
                    starItem.x = this.starGroup.numChildren * 32;
                    this.starGroup.addChild(starItem);
                }
            }
            else {
                if (starItem) {
                    starItem.visible = false;
                }
            }
        }
        this.quickFinishBtn.visible = false;
        this.goldBtn.visible = false;
        this.initData();
    }
    initData() {
        var data = WorkModel_1.default.instance.getWorkItemInfo(this.cfg.id);
        var numRole = this.roleGroup.numChildren;
        for (var i = 0; i < numRole; i++) {
            this.roleGroup.getChildAt(i).visible = false;
        }
        var roleNeed = this.cfg.roleNeed;
        for (var i = 0; i < roleNeed.length; i++) {
            var roleItem;
            roleItem = this.roleGroup.getChildAt(i);
            if (!roleItem) {
                roleItem = new WorkRoleItemUI_1.default();
                roleItem.x = this.roleGroup.numChildren * 112;
                this.roleGroup.addChild(roleItem);
            }
            roleItem.visible = true;
            roleItem.setData(roleNeed[i]);
        }
        this.reward1.visible = false;
        this.reward2.visible = false;
        var reward = this.cfg.reward;
        if (reward[0]) {
            this.reward1.visible = true;
            var result = FogFunc_1.default.instance.getResourceShowInfo(reward[0], true, this.workUI.companyCfg.commissionAdd / 10000);
            this.img_icon1.skin = result.icon;
            this.lbl_num1.text = result.num;
            this.img_icon1.scale(result.scale, result.scale);
        }
        if (reward[1]) {
            this.reward2.visible = true;
            var result = FogFunc_1.default.instance.getResourceShowInfo(reward[1], true, this.workUI.companyCfg.commissionAdd / 10000);
            this.img_icon2.skin = result.icon;
            this.lbl_num2.text = result.num + "";
            this.img_icon2.scale(result.scale, result.scale);
        }
        this.finishBtn.visible = false;
        this.doGroup.visible = false;
        this.receiveBtn.visible = false;
        this.startGroup.visible = false;
        if (data.finish) {
            this.finishBtn.visible = true;
        }
        else {
            if (data.cd) {
                //判断是否到cd 了
                this.freshCd();
            }
            else {
                this.costTime = this.cfg.workTime - this.workUI.companyCfg.workTimeReduce;
                if (this.costTime < 3) {
                    this.costTime = 3;
                }
                this.startGroup.visible = true;
                this.costTimeTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_work_needTime") + GameUtils_1.default.convertTime(this.costTime, 2);
            }
        }
    }
    /**刷新cd */
    freshCd() {
        var info = WorkModel_1.default.instance.getWorkItemInfo(this.cfg.id);
        this.offest = info.cd - Client_1.default.instance.serverTime;
        var index = this.workUI.timeArr.indexOf(this);
        if (this.offest <= 0) {
            if (index != -1) {
                this.workUI.timeArr.splice(index, 1);
                this.finishWork();
                this.workUI.freshAllItemState();
            }
            this.doGroup.visible = false;
            this.receiveBtn.visible = true;
            Message_1.default.instance.send(WorkEvent_1.default.WORK_RECEIVE_REDFRESH);
        }
        else {
            if (index == -1) {
                this.workUI.timeArr.push(this);
            }
            this.doGroup.visible = true;
            //大于视频加速时长，只能钻石完成
            if (this.offest > this.workUI.workVideoMaxTime) {
                this.quickFinishBtn.visible = false;
                if (!this.goldBtn.visible) {
                    this.goldBtn.visible = true;
                }
                this.goldCost = Math.ceil(this.offest * this.workUI.workTimePrice);
                this.goldCostTxt.text = this.goldCost + "";
            }
            else {
                this.goldBtn.visible = false;
                if (!this.quickFinishBtn.visible) {
                    this.quickFinishBtn.visible = true;
                    this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_WORK_FINISH);
                    if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                        this.quickFreeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
                        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_WORKQUICK_SHOW, { leftTime: this.offest });
                        }
                    }
                }
            }
            var width = this.offest * this.doProDi.width / info.allTime;
            if (width > this.doProDi.width) {
                width = width;
            }
            if (width < 0) {
                width = 0;
            }
            this.doProcess.width = width;
            this.leftTimeTxt.text = GameUtils_1.default.convertTime(this.offest, 2);
        }
    }
    /**点击开始 */
    onClickStart() {
        var role = this.cfg.roleNeed;
        var isCan = true;
        for (var i = 0; i < role.length; i++) {
            if (WorkModel_1.default.instance.getRoleState(role[i]) != WorkConst_1.default.WorkRole_none) {
                isCan = false;
                break;
            }
        }
        if (isCan) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.WORK_START, { id: this.cfg.id });
            WorkServer_1.default.startDoWork({ id: this.cfg.id, cd: this.costTime }, this.workUI.freshAllItemState, this.workUI);
        }
        else {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_work_cantStart"));
        }
    }
    onClickGold() {
        var num = UserModel_1.default.instance.getGold();
        if (this.goldCost > Number(num)) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
            return;
        }
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.WORK_GOLDQUICK, { id: this.cfg.id, leftTime: this.offest });
        this.finishWork(this.goldCost);
    }
    onClickQuickFinish() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_WORKQUICK_CLICK, { leftTime: this.offest });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_WORK_FINISH, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this);
    }
    succCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_WORKQUICK_FINISH, { leftTime: this.offest });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_WORKQUICK_FINISH, { leftTime: this.offest });
        }
        this.finishWork();
    }
    finishWork(goldCost = null) {
        var data = {
            id: this.cfg.id
        };
        if (goldCost) {
            data["goldCost"] = goldCost;
        }
        WorkServer_1.default.finishWork(data, this.initData, this);
    }
    onClickReceive() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.WORK_END, { id: this.cfg.id });
        WorkServer_1.default.receiveReward({ id: this.cfg.id, reward: this.cfg.reward, extraAdPer: (this.workUI.companyCfg.commissionAdd / 10000) }, this.receiveCall, this);
    }
    receiveCall() {
        this.initData();
        Message_1.default.instance.send(WorkEvent_1.default.WORK_RECEIVE_REDFRESH);
        this.finishBtn.visible = false;
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterBoxRewardUI, { viewType: "work", reward: this.cfg.reward, desc: TranslateFunc_1.default.instance.getTranslate("#tid_work_receiveReward"), type: ChapterConst_1.default.Chapter_boxState_lock, callBack: this.checkShowGift, thisObj: this, adPrc: this.workUI.companyCfg.commissionAdd / 10000 });
    }
    doFinishAni() {
        this.finishBtn.visible = true;
        TweenAniManager_1.default.instance.scaleQipaoAni(this.finishBtn, 2, null, null, false, 300);
    }
    /**是否显示礼物 */
    checkShowGift() {
        var gift = WorkFunc_1.default.instance.isShowGift(this.cfg.giftReward);
        if (gift) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterBoxDoubleUI, { reward: [gift], shareName: ShareTvOrderFunc_1.default.SHARELINE_WORK_GIFTDOUBLE, callBack: this.doFinishAni, thisObj: this, params: gift });
        }
        else {
            this.doFinishAni();
        }
    }
}
exports.default = WorkInfoItemUI;
//# sourceMappingURL=WorkInfoItemUI.js.map