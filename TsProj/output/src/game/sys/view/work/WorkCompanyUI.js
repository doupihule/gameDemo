"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WorkModel_1 = require("../../model/WorkModel");
const WorkConst_1 = require("../../consts/WorkConst");
const RolesFunc_1 = require("../../func/RolesFunc");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const BattleFunc_1 = require("../../func/BattleFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const WorkFunc_1 = require("../../func/WorkFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const UserModel_1 = require("../../model/UserModel");
const ChapterFunc_1 = require("../../func/ChapterFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const FogFunc_1 = require("../../func/FogFunc");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const WorkServer_1 = require("../../server/WorkServer");
const Message_1 = require("../../../../framework/common/Message");
const WorkEvent_1 = require("../../event/WorkEvent");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class WorkCompanyUI extends layaMaxUI_1.ui.gameui.work.WorkCompanyUI {
    constructor(work) {
        super();
        this.timeCode = 0;
        this.isCan = true;
        this.isReputeEnough = true;
        this.isCostEnough = true;
        this.work = work;
        new ButtonUtils_1.ButtonUtils(this.upGradeBtn, this.onClickCost, this);
        new ButtonUtils_1.ButtonUtils(this.videoUpBtn, this.onClickVideo, this);
    }
    setData(id) {
        this.showRoleAni("2002");
        this.setCompany();
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.COMPANYUP_OPEN);
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + roleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = 1.6 * BattleFunc_1.default.defaultScale;
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, 1, 2, scaleRoleInfo, true, false, "WorkCompanyUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
    }
    setCompany() {
        if (!this.timeCode) {
            this.timeCode = RolesFunc_1.default.instance.setRoleSpeak("2002", RolesFunc_1.default.ROLE_SPEAK_WORK, this.desTxt, this);
        }
        this.freshInfo();
    }
    freshInfo() {
        this.costInfo = null;
        var level = WorkModel_1.default.instance.getCompanyLevel();
        this.companyLevelTxt.text = level + TranslateFunc_1.default.instance.getTranslate("#tid_work_companyLevel");
        var nowCfg = WorkFunc_1.default.instance.getCfgDatas("CompanyUpdate", level);
        if (level >= WorkFunc_1.default.instance.getMaxCompanyLevel()) {
            this.nextGroup.visible = false;
            this.upGroup.visible = false;
            this.fullTxt.visible = true;
        }
        else {
            this.nextGroup.visible = true;
            this.upGroup.visible = true;
            this.fullTxt.visible = false;
            this.setNextInfo(level + 1);
        }
        this.commissionTxt.text = nowCfg.commissionAdd / 100 + "%";
        this.starTxt.text = TranslateFunc_1.default.instance.getTranslate(nowCfg.starRange);
        this.numTxt.text = nowCfg.workNum + "";
        this.timeTxt.text = GameUtils_1.default.convertTime(nowCfg.workTimeReduce, 2);
    }
    setNextInfo(level) {
        var cfg = WorkFunc_1.default.instance.getCfgDatas("CompanyUpdate", level);
        this.commisionTxt2.text = cfg.commissionAdd / 100 + "%";
        this.starTxt2.text = TranslateFunc_1.default.instance.getTranslate(cfg.starRange);
        this.numTxt2.text = cfg.workNum + "";
        this.timeTxt2.text = GameUtils_1.default.convertTime(cfg.workTimeReduce, 2);
        var unlockCondition = cfg.unlockCondition;
        this.isCan = true;
        this.isCostEnough = true;
        var txt = "";
        for (var i = 0; i < unlockCondition.length; i++) {
            var info = unlockCondition[i];
            if (Number(info[0]) == WorkConst_1.default.CompanyUnlock_level) {
                var nowLevel = UserModel_1.default.instance.getMaxBattleLevel();
                if (nowLevel < Number(info[1])) {
                    this.isCan = false;
                }
                txt += TranslateFunc_1.default.instance.getTranslate("#tid_work_companyUnlockLevel", null, ChapterFunc_1.default.instance.getOpenConditionByLevel(Number(info[1])), ChapterFunc_1.default.instance.getOpenConditionByLevel(nowLevel)) + "\n";
            }
            else if (Number(info[0]) == WorkConst_1.default.CompanyUnlock_fogLevel) {
                if (UserModel_1.default.instance.getMaxFogLayer() < Number(info[1])) {
                    this.isCan = false;
                }
                txt += TranslateFunc_1.default.instance.getTranslate("#tid_work_companyUnlockFogLevel", null, Number(info[1]), UserModel_1.default.instance.getMaxFogLayer()) + "\n";
            }
        }
        this.passTxt.text = txt;
        if (!this.isCan) {
            this.passTxt.color = "#ff0101";
        }
        else {
            this.passTxt.color = "#000000";
        }
        var hasNum = WorkModel_1.default.instance.getReputeNum();
        var costNum = cfg.renownNeed;
        this.needTxt.text = "/" + costNum;
        this.hasTxt.text = hasNum + "";
        this.isReputeEnough = true;
        if (hasNum < costNum) {
            this.hasTxt.color = "#eeb024";
            this.isReputeEnough = false;
        }
        else {
            this.hasTxt.color = "#000000";
        }
        if (!this.isCan || !this.isReputeEnough) {
            this.videoUpBtn.gray = true;
            this.upGradeBtn.gray = true;
        }
        else {
            this.videoUpBtn.gray = false;
            this.upGradeBtn.gray = false;
        }
        this.setBtnShow(cfg.cost);
        this.freeRedImg.visible = false;
        this.upRedImg.visible = false;
        if (this.isCan && this.isReputeEnough) {
            this.freeRedImg.visible = true;
            if (this.isCostEnough) {
                this.upRedImg.visible = true;
            }
        }
    }
    setBtnShow(cost) {
        this.costInfo = cost;
        this.videoUpBtn.visible = false;
        this.upGradeGroup.visible = false;
        if (cost[0][0] == -1) {
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_WORK_COMPANYUP);
            if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.videoUpBtn.visible = true;
                this.freeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
                if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_COMPANYUP_SHOW, { level: WorkModel_1.default.instance.getCompanyLevel() });
                }
            }
            else {
                this.setCostInfo(cost[1]);
            }
        }
        else {
            this.setCostInfo(cost[0]);
        }
    }
    setCostInfo(cost) {
        this.upGradeGroup.visible = true;
        var info = FogFunc_1.default.instance.getResourceShowInfo(cost);
        this.costImg.skin = info.icon;
        this.costTxt.text = info.num;
        if (info.num > Number(info.userNum)) {
            this.costTxt.color = "#ff0101";
            this.isCostEnough = false;
        }
        else {
            this.costTxt.color = "#000000";
        }
    }
    onClickVideo() {
        if (!this.isCan) {
            this.doShakeAni(this.passTxt);
            return;
        }
        if (!this.isReputeEnough) {
            this.doShakeAni(this.hasTxt);
            return;
        }
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_COMPANYUP_CLICK, { level: WorkModel_1.default.instance.getCompanyLevel() });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_WORK_COMPANYUP, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this);
    }
    doShakeAni(item) {
        TweenAniManager_1.default.instance.fadeOutAni(item, () => {
            TweenAniManager_1.default.instance.fadeInAni(item, null, 300, this);
        }, 300, this);
    }
    succCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_COMPANYUP_FINISH, { level: WorkModel_1.default.instance.getCompanyLevel() });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_COMPANYUP_FINISH, { level: WorkModel_1.default.instance.getCompanyLevel() });
        }
        this.upCompany();
    }
    onClickCost() {
        if (!this.isCan) {
            this.doShakeAni(this.passTxt);
            return;
        }
        if (!this.isReputeEnough) {
            this.doShakeAni(this.hasTxt);
            return;
        }
        if (!this.isCostEnough) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
            return;
        }
        this.upCompany(this.costInfo);
    }
    upCompany(cost = null) {
        var data = {};
        if (cost) {
            data = {
                cost: cost
            };
        }
        WorkServer_1.default.upWorkCompany(data, this.upCall, this);
    }
    upCall() {
        this.freshInfo();
        Message_1.default.instance.send(WorkEvent_1.default.WORK_REPUTE_UPDATE);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.COMPANYUP_SUCC, { level: WorkModel_1.default.instance.getCompanyLevel() });
    }
    close() {
        TimerManager_1.default.instance.removeByObject(this);
        this.timeCode = null;
    }
}
exports.default = WorkCompanyUI;
//# sourceMappingURL=WorkCompanyUI.js.map