import { ui } from "../../../../ui/layaMaxUI";
import WorkModel from "../../model/WorkModel";
import WorkConst from "../../consts/WorkConst";
import ResourceConst from "../../consts/ResourceConst";
import RolesFunc from "../../func/RolesFunc";
import WorkFunc from "../../func/WorkFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import WorkRoleItemUI from "./WorkRoleItemUI";
import FogFunc from "../../func/FogFunc";
import GameUtils from "../../../../utils/GameUtils";
import WorkRoleUI from "./WorkRoleUI";
import Client from "../../../../framework/common/kakura/Client";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import WorkServer from "../../server/WorkServer";
import TweenAniManager from "../../manager/TweenAniManager";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import ChapterConst from "../../consts/ChapterConst";
import UserModel from "../../model/UserModel";
import StatisticsManager from "../../manager/StatisticsManager";
import Message from "../../../../framework/common/Message";
import WorkEvent from "../../event/WorkEvent";



export default class WorkInfoItemUI extends ui.gameui.work.WorkInfoItemUI {

    private cfg
    private workUI: WorkRoleUI;
    private goldCost;
    private costTime
    private freeType;
    private offest;
    constructor(ui) {
        super();
        this.workUI = ui;
        new ButtonUtils(this.startBtn, this.onClickStart, this)
        new ButtonUtils(this.goldBtn, this.onClickGold, this)
        new ButtonUtils(this.receiveBtn, this.onClickReceive, this)
        new ButtonUtils(this.quickFinishBtn, this.onClickQuickFinish, this)

    }


    public setData(data): void {
        var id = data.id;
        this.cfg = WorkFunc.instance.getCfgDatas("Work", id);
        this.nameTxt.text = TranslateFunc.instance.getTranslate(this.cfg.name);
        this.desTxt.text = TranslateFunc.instance.getTranslate(this.cfg.desc);
        var star = this.cfg.star;
        for (var i = 0; i < 6; i++) {
            var starItem = this.starGroup.getChildAt(i) as Laya.Image;
            if (i < star) {
                if (starItem) {
                    starItem.visible = true;
                } else {
                    starItem = new Laya.Image("uisource/common/common/equip_image_xing1.png");
                    starItem.width = 31;
                    starItem.height = 31;
                    starItem.x = this.starGroup.numChildren * 32
                    this.starGroup.addChild(starItem);
                }
            } else {
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
        var data = WorkModel.instance.getWorkItemInfo(this.cfg.id)
        var numRole = this.roleGroup.numChildren;
        for (var i = 0; i < numRole; i++) {
            (this.roleGroup.getChildAt(i) as Laya.Image).visible = false;
        }
        var roleNeed = this.cfg.roleNeed;
        for (var i = 0; i < roleNeed.length; i++) {
            var roleItem;
            roleItem = this.roleGroup.getChildAt(i);
            if (!roleItem) {
                roleItem = new WorkRoleItemUI();
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
            var result = FogFunc.instance.getResourceShowInfo(reward[0], true, this.workUI.companyCfg.commissionAdd / 10000)
            this.img_icon1.skin = result.icon;
            this.lbl_num1.text = result.num;
            this.img_icon1.scale(result.scale, result.scale)
        }
        if (reward[1]) {
            this.reward2.visible = true;
            var result = FogFunc.instance.getResourceShowInfo(reward[1], true, this.workUI.companyCfg.commissionAdd / 10000)
            this.img_icon2.skin = result.icon;
            this.lbl_num2.text = result.num + "";
            this.img_icon2.scale(result.scale, result.scale)
        }
        this.finishBtn.visible = false;
        this.doGroup.visible = false;
        this.receiveBtn.visible = false;
        this.startGroup.visible = false;
        if (data.finish) {
            this.finishBtn.visible = true;
        } else {
            if (data.cd) {
                //判断是否到cd 了
                this.freshCd();
            } else {
                this.costTime = this.cfg.workTime - this.workUI.companyCfg.workTimeReduce;
                if (this.costTime < 3) {
                    this.costTime = 3;
                }
                this.startGroup.visible = true;
                this.costTimeTxt.text = TranslateFunc.instance.getTranslate("#tid_work_needTime") + GameUtils.convertTime(this.costTime, 2)
            }
        }
    }
    /**刷新cd */
    public freshCd() {
        var info = WorkModel.instance.getWorkItemInfo(this.cfg.id)
        this.offest = info.cd - Client.instance.serverTime;
        var index = this.workUI.timeArr.indexOf(this)
        if (this.offest <= 0) {
            if (index != -1) {
                this.workUI.timeArr.splice(index, 1);
                this.finishWork();
                this.workUI.freshAllItemState()
            }
            this.doGroup.visible = false;
            this.receiveBtn.visible = true;
            Message.instance.send(WorkEvent.WORK_RECEIVE_REDFRESH);
        } else {
            if (index == -1) {
                this.workUI.timeArr.push(this)
            }
            this.doGroup.visible = true;
            //大于视频加速时长，只能钻石完成
            if (this.offest > this.workUI.workVideoMaxTime) {
                this.quickFinishBtn.visible = false;
                if (!this.goldBtn.visible) {
                    this.goldBtn.visible = true;
                }
                this.goldCost = Math.ceil(this.offest * this.workUI.workTimePrice)
                this.goldCostTxt.text = this.goldCost + "";
            } else {
                this.goldBtn.visible = false;
                if (!this.quickFinishBtn.visible) {
                    this.quickFinishBtn.visible = true;
                    this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_WORK_FINISH);
                    if (this.freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                        this.quickFreeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(this.freeType)
                        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_WORKQUICK_SHOW, { leftTime: this.offest })
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
            this.leftTimeTxt.text = GameUtils.convertTime(this.offest, 2)
        }
    }
    /**点击开始 */
    onClickStart() {
        var role = this.cfg.roleNeed;
        var isCan = true;
        for (var i = 0; i < role.length; i++) {
            if (WorkModel.instance.getRoleState(role[i]) != WorkConst.WorkRole_none) {
                isCan = false;
                break;
            }
        }
        if (isCan) {
            StatisticsManager.ins.onEvent(StatisticsManager.WORK_START, { id: this.cfg.id })
            WorkServer.startDoWork({ id: this.cfg.id, cd: this.costTime }, this.workUI.freshAllItemState, this.workUI)
        } else {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_work_cantStart"))
        }
    }
    onClickGold() {
        var num = UserModel.instance.getGold();
        if (this.goldCost > Number(num)) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"))
            return;
        }
        StatisticsManager.ins.onEvent(StatisticsManager.WORK_GOLDQUICK, { id: this.cfg.id, leftTime: this.offest })
        this.finishWork(this.goldCost)
    }
    onClickQuickFinish() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_WORKQUICK_CLICK, { leftTime: this.offest })
        }
        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_WORK_FINISH, ShareOrTvManager.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this)

    }
    succCall() {
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_WORKQUICK_FINISH, { leftTime: this.offest })
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_WORKQUICK_FINISH, { leftTime: this.offest })
        }
        this.finishWork()
    }
    finishWork(goldCost = null) {
        var data = {
            id: this.cfg.id
        }
        if (goldCost) {
            data["goldCost"] = goldCost
        }
        WorkServer.finishWork(data, this.initData, this)
    }
    onClickReceive() {
        StatisticsManager.ins.onEvent(StatisticsManager.WORK_END, { id: this.cfg.id })

        WorkServer.receiveReward({ id: this.cfg.id, reward: this.cfg.reward, extraAdPer: (this.workUI.companyCfg.commissionAdd / 10000) }, this.receiveCall, this)
    }
    receiveCall() {
        this.initData();
        Message.instance.send(WorkEvent.WORK_RECEIVE_REDFRESH);
        this.finishBtn.visible = false;
        WindowManager.OpenUI(WindowCfgs.ChapterBoxRewardUI, { viewType: "work", reward: this.cfg.reward, desc: TranslateFunc.instance.getTranslate("#tid_work_receiveReward"), type: ChapterConst.Chapter_boxState_lock, callBack: this.checkShowGift, thisObj: this, adPrc: this.workUI.companyCfg.commissionAdd / 10000 })

    }
    doFinishAni() {
        this.finishBtn.visible = true;
        TweenAniManager.instance.scaleQipaoAni(this.finishBtn, 2, null, null, false, 300)
    }
    /**是否显示礼物 */
    checkShowGift() {
        var gift = WorkFunc.instance.isShowGift(this.cfg.giftReward)
        if (gift) {
            WindowManager.OpenUI(WindowCfgs.ChapterBoxDoubleUI, { reward: [gift], shareName: ShareTvOrderFunc.SHARELINE_WORK_GIFTDOUBLE, callBack: this.doFinishAni, thisObj: this, params: gift })
        } else {
            this.doFinishAni()
        }
    }
}


