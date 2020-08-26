"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const RolesModel_1 = require("../../model/RolesModel");
const RolesFunc_1 = require("../../func/RolesFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const UserModel_1 = require("../../model/UserModel");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const RolesServer_1 = require("../../server/RolesServer");
const BattleFunc_1 = require("../../func/BattleFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const DisplayUtils_1 = require("../../../../framework/utils/DisplayUtils");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const RoleEvent_1 = require("../../event/RoleEvent");
const BattleConst_1 = require("../../consts/BattleConst");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const TurnableModel_1 = require("../../model/TurnableModel");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const ChapterFunc_1 = require("../../func/ChapterFunc");
class RoleInfoUI extends layaMaxUI_1.ui.gameui.role.RoleInfoUI {
    constructor() {
        super();
        this.removeUpSpineTimer = 0;
        this.isShowFormation = false;
        this.isUnlock = false;
        this.addEvent();
        this.initBtn();
    }
    //添加事件监听
    addEvent() {
        Message_1.default.instance.add(GameMainEvent_1.default.ROLELIST_EVENT_REFRESH, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_STAGE, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY, this);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.upgradeBtn, this.onClickUpgrade, this);
        new ButtonUtils_1.ButtonUtils(this.unlockBtn, this.onClickUnlock, this);
        new ButtonUtils_1.ButtonUtils(this.videoUnlockBtn, this.onClickVideoUnlock, this);
    }
    //初始化
    setData(roleId, parent) {
        this.roleId = "";
        this.changeId = "";
        this._lastRoleId = "";
        this.roleId = roleId;
        this.myParent = parent;
        this.isUnlock = false;
        this.roleSpeak.visible = false;
        this.roleSpeakLab.visible = false;
        this.isShowFormation = false;
        this.upGroup.visible = false;
        this.initTop();
        this.refreshBtn();
        this.initAttribute();
        //角色说话检测
        this.refresshRoleSpeak();
    }
    initTop() {
        var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(this.roleId);
        //角色spine
        this.showRoleAni(this.roleId);
        this.roleName.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.name, "TranslateRole");
        this.roleDesc.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.explain, "TranslateRole");
        //角色名字，等级，描述
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
        this.roleLevel.text = "Lv. " + roleLevel;
        if (!RolesModel_1.default.instance.checkRoleUnlock(this.roleId)) {
            DisplayUtils_1.default.setViewDark(this.roleAnim);
        }
    }
    refresshRoleSpeak() {
        var infoSpeakInterval = GlobalParamsFunc_1.default.instance.getDataNum("infoSpeakInterval");
        //角色随机说话
        if (!this.roleSpeakTimer) {
            this.roleSpeakTimer = TimerManager_1.default.instance.add(this.roleDoSpeak, this, infoSpeakInterval);
        }
    }
    roleDoSpeak() {
        var infoSpeak = RolesFunc_1.default.instance.getRoleDataById(this.roleId, "infoSpeak");
        if (infoSpeak) {
            this.roleSpeak.visible = true;
            this.roleSpeakLab.visible = true;
            this.roleSpeakLab.text = TranslateFunc_1.default.instance.getTranslate(infoSpeak, "TranslateRole");
        }
    }
    initAttribute(isFresh = false) {
        var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(this.roleId);
        //移速
        this.moveSpeedNum.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.moveSpeed, "TranslateRole");
        //攻击类型
        this.attackTypeNum.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.attackType, "TranslateRole");
        //攻速
        this.attackSpeedNum.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.attackSpeed, "TranslateRole");
        //攻击距离
        this.attackRangeNum.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.attackRange, "TranslateRole");
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
        ;
        this.hitNum.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_crit, this.roleId, roleLevel, null, false);
        //血量
        this.bloodNum.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_maxHp, this.roleId, roleLevel, null, false);
        //伤害
        this.attackNum.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_attack, this.roleId, roleLevel, null, false);
        //目标
        this.targetNum.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.attackTarget, "TranslateRole");
        //命中
        this.beHitNum.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_hit, this.roleId, roleLevel, null, false);
        //闪避
        this.dodgeNum.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_dodge, this.roleId, roleLevel, null, false);
    }
    refreshBtn() {
        this.videoUnlockGroup.visible = false;
        //判断是否解锁
        if (RolesModel_1.default.instance.checkRoleUnlock(this.roleId)) {
            this.upgradeGroup.visible = true;
            this.unlockGroup.visible = false;
            this.unlockLevelLab.visible = false;
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
            var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("roleMaxLevel");
            if (roleLevel >= roleMaxLevel) {
                this.fullLevelLab.visible = true;
                this.canUpgradeGroup.visible = false;
            }
            else {
                this.fullLevelLab.visible = false;
                this.canUpgradeGroup.visible = true;
                var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
                var levelPay = RolesFunc_1.default.instance.getRoleUpCostById(this.roleId, roleLevel);
                var levelPayArr = levelPay[0].split(",");
                var result = DataResourceFunc_1.default.instance.getDataResourceInfo(levelPayArr);
                this.upgradeCostImg.skin = result["img"];
                this.upgradeCostNum.text = StringUtils_1.default.getCoinStr(result["num"]);
                if (Number(levelPayArr[0]) == DataResourceFunc_1.DataResourceType.COIN) { //金币
                    if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(result["num"]))) {
                        this.upgradeCostNum.color = "#ff0000";
                    }
                    else {
                        this.upgradeCostNum.color = "#000000";
                    }
                    this.upgradeLab.text = "金币升级";
                }
                else if (Number(levelPayArr[0]) == DataResourceFunc_1.DataResourceType.GOLD) { //钻石
                    if (Number(UserModel_1.default.instance.getGold()) < Math.floor(Number(result["num"]))) {
                        this.upgradeCostNum.color = "#ff0000";
                    }
                    else {
                        this.upgradeCostNum.color = "#000000";
                    }
                    this.upgradeLab.text = "钻石升级";
                }
            }
        }
        else {
            this.upgradeGroup.visible = false;
            //判断关卡条件是否达到
            if (!RolesModel_1.default.instance.checkRoleLevelunlock(this.roleId)) {
                this.unlockGroup.visible = false;
                this.unlockLevelLab.visible = true;
                var needLevel = RolesFunc_1.default.instance.getUnlockLevel(this.roleId);
                this.unlockLevelLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_flat_unlockTip", null, ChapterFunc_1.default.instance.getOpenConditionByLevel(needLevel));
                ;
            }
            else {
                this.isUnlock = true;
                //判断是视频解锁还是货币解锁
                if (RolesFunc_1.default.instance.checkIsVideoUnlockRole(this.roleId)) {
                    this.unlockGroup.visible = false;
                    this.unlockLevelLab.visible = false;
                    this.videoUnlockGroup.visible = true;
                    this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_UNLOCK_ROLE);
                    this.freeUnlockImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
                    if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLE_SHOW, { "roleId": this.roleId });
                    }
                }
                else {
                    this.unlockGroup.visible = true;
                    this.unlockLevelLab.visible = false;
                    var unlockMoney = RolesFunc_1.default.instance.getUnlockMoney(this.roleId);
                    if (unlockMoney.length == 0) {
                        return;
                    }
                    var result = DataResourceFunc_1.default.instance.getDataResourceInfo(unlockMoney);
                    this.unlockCostImg.skin = result["img"];
                    this.unlockCostNum.text = StringUtils_1.default.getCoinStr(result["num"]);
                    if (Number(unlockMoney[0]) == DataResourceFunc_1.DataResourceType.COIN) { //金币
                        if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(result["num"]))) {
                            this.unlockCostNum.color = "#ff0000";
                        }
                        else {
                            this.unlockCostNum.color = "#000000";
                        }
                    }
                    else if (Number(unlockMoney[0]) == DataResourceFunc_1.DataResourceType.GOLD) { //钻石
                        if (Number(UserModel_1.default.instance.getGold()) < Math.floor(Number(result["num"]))) {
                            this.unlockCostNum.color = "#ff0000";
                        }
                        else {
                            this.unlockCostNum.color = "#000000";
                        }
                    }
                }
                this.showGuide_203(RolesFunc_1.default.instance.getUnlockLevel(this.roleId));
            }
        }
    }
    //展示键盘侠解锁引导
    showGuide_203(level) {
        if (Number(level == 1) && UserModel_1.default.instance.getMainGuide() == 2 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_202) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_2_203, GuideManager_1.default.GuideType.Static, this.unlockGroup, this.myParent);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_2_203, null, this, this.showGuide_203_finish);
        }
    }
    showGuide_203_finish() {
        if (UserModel_1.default.instance.getMainGuide() == 2 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_202) {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_2_203, null, null, true);
            return true;
        }
        return false;
    }
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = RolesFunc_1.default.instance.getRoleDataById(roleId, "scaleRoleInfo") / 10000 * BattleFunc_1.default.defaultScale;
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, false, false, "RoleInfoUI");
        }
        else {
            this.roleAnim = cacheItem;
        }
        this.roleSpine.addChild(this.roleAnim);
        this.roleAnim.x = 0.5 * this.roleSpine.width;
        this.roleAnim.y = this.roleSpine.height;
        this.roleAnim.play("idle", true);
        this._lastRoleId = roleId;
    }
    //播放升级特效
    roleUpgradeSpine() {
        if (this.removeUpSpineTimer) {
            TimerManager_1.default.instance.remove(this.removeUpSpineTimer);
            this.removeUpSpineTimer = 0;
        }
        if (!this.upSpine) {
            var upSpineName = RolesFunc_1.default.ROLE_UPGRADE_SPINE;
            this.upSpine = DisplayUtils_1.default.createSkeletonExpand(upSpineName);
        }
        this.upSpine.play(0, false, true);
        this.upSpine.visible = true;
        this.upSpine.x = this.upSpineArea.x;
        this.upSpine.y = this.upSpineArea.y;
        this.upSpineArea.addChild(this.upSpine);
    }
    //移除升级特效
    removeUpgradeSpine() {
        if (!this.removeUpSpineTimer) {
            this.removeUpSpineTimer = TimerManager_1.default.instance.add(this.hideUpgradeSpine, this, 1000, 1);
        }
    }
    hideUpgradeSpine() {
        if (this.upSpine) {
            this.upSpine.visible = false;
        }
    }
    //升级
    onClickUpgrade() {
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
        var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("roleMaxLevel");
        if (roleLevel >= roleMaxLevel) {
            WindowManager_1.default.ShowTip("已满级");
            return;
        }
        //升级消耗
        var upgradeCost = RolesFunc_1.default.instance.getUpgradeCost(this.roleId, roleLevel);
        switch (upgradeCost[0]) {
            case DataResourceFunc_1.DataResourceType.COIN:
                if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(upgradeCost[1]))) {
                    if (TurnableModel_1.default.instance.checkTurnable()) {
                        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                    }
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
            case DataResourceFunc_1.DataResourceType.GOLD:
                if (Number(UserModel_1.default.instance.getGold()) < Math.floor(Number(upgradeCost[1]))) {
                    if (TurnableModel_1.default.instance.checkTurnable()) {
                        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                    }
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
        }
        //英雄升级
        RolesServer_1.default.upgradeRole({ "roleId": this.roleId, "costType": upgradeCost[0], "costNum": upgradeCost[1] }, () => {
            //升级后刷新界面
            this.upgradeRefreshUI();
            //播放升级特效
            this.roleUpgradeSpine();
            //播放升级属性文字动画
            this.roleUpAttriChange();
            //刷新主界面角色等级
            Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLELEVEL, this.roleId);
            //移除升级特效
            this.removeUpgradeSpine();
            //打点
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.HERO_LEVEL, { roleId: this.roleId });
        }, this);
    }
    //属性文字动画
    roleUpAttriChange() {
        this.showAttriChange();
        Laya.Tween.clearAll(this.upGroup);
        this.attriTween();
    }
    attriTween() {
        this.upGroup.visible = true;
        this.upGroup.y = 351;
        Laya.Tween.to(this.upGroup, { y: 245 }, 800, null, Laya.Handler.create(this, () => {
            TimerManager_1.default.instance.setTimeout(() => {
                this.upGroup.visible = false;
            }, this, 300);
        }));
    }
    showAttriChange() {
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
        this.attackNum1.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_attack, this.roleId, Number(roleLevel) - 1, null, false);
        this.attackNum2.text = this.attackNum.text;
        this.bloodNum1.text = RolesFunc_1.default.instance.getAttShowTxt(BattleConst_1.default.attr_maxHp, this.roleId, Number(roleLevel) - 1, null, false);
        this.bloodNum2.text = this.bloodNum.text;
    }
    //英雄升级后刷新界面
    upgradeRefreshUI() {
        //等级
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.roleId);
        this.roleLevel.text = "Lv. " + roleLevel;
        //按钮刷新
        this.refreshBtn();
        //刷新属性
        this.initAttribute(true);
    }
    //英雄解锁后刷新界面
    unlockRefreshUI() {
        //spine滤镜清除
        DisplayUtils_1.default.clearViewFilter(this.roleAnim);
        //界面按钮刷新
        this.refreshBtn();
        if (Object.keys(RolesModel_1.default.instance.getRolesList()).length == 5) {
            this.isShowFormation = true;
        }
        this.myParent.freshEquBtn();
    }
    //视频解锁
    onClickVideoUnlock() {
        if (RolesModel_1.default.instance.checkRoleUnlock(this.roleId)) {
            WindowManager_1.default.ShowTip("英雄已经解锁");
            return;
        }
        //判断是否达到关卡的前置要求
        if (!RolesModel_1.default.instance.checkRoleLevelunlock(this.roleId)) {
            WindowManager_1.default.ShowTip("关卡还未达成，快去战斗吧！");
            return;
        }
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLE_CLICK, { "roleId": this.roleId });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_UNLOCK_ROLE, ShareOrTvManager_1.default.TYPE_SHARE, {
            id: "1",
            extraData: {}
        }, this.successfull, this.closefull, this);
    }
    successfull() {
        //英雄解锁
        var delay = 0;
        if (UserInfo_1.default.isSystemNative()) {
            delay = 500;
        }
        this.finishUnlock(delay);
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLE_FINISH, { "roleId": this.roleId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_UNLOCKROLE_FINISH, { "roleId": this.roleId });
        }
    }
    finishUnlock(delay) {
        RolesServer_1.default.unlockRole({ "roleId": this.roleId }, () => {
            if (!GameUtils_1.default.isReview) {
                TimerManager_1.default.instance.setTimeout(() => {
                    WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.RoleBarrageUI, { roleId: this.roleId });
                }, this, delay);
            }
            else {
                //打开新英雄解锁界面
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.UnlockRoleUI, { "roleId": this.roleId });
            }
            //打点
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.HERO_OPEN, { roleId: this.roleId });
            //英雄解锁后刷新界面
            this.unlockRefreshUI();
            //刷新主界面角色显示
            Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK, this.roleId);
        }, this);
    }
    closefull() {
    }
    //货币解锁
    onClickUnlock() {
        var isGuide = this.showGuide_203_finish();
        if (RolesModel_1.default.instance.checkRoleUnlock(this.roleId)) {
            WindowManager_1.default.ShowTip("英雄已经解锁");
            return;
        }
        //判断是否达到关卡的前置要求
        if (!RolesModel_1.default.instance.checkRoleLevelunlock(this.roleId)) {
            WindowManager_1.default.ShowTip("关卡还未达成，快去战斗吧！");
            return;
        }
        //升级消耗
        var unlockCost = RolesFunc_1.default.instance.getUnlockMoney(this.roleId);
        switch (unlockCost[0]) {
            case DataResourceFunc_1.DataResourceType.COIN:
                if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(unlockCost[1]))) {
                    if (TurnableModel_1.default.instance.checkTurnable()) {
                        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                    }
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
            case DataResourceFunc_1.DataResourceType.GOLD:
                if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getGold(), BigNumUtils_1.default.round(unlockCost[1]))) {
                    if (TurnableModel_1.default.instance.checkTurnable()) {
                        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                    }
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
        }
        //英雄解锁
        RolesServer_1.default.unlockRole({ "roleId": this.roleId, "costType": unlockCost[0], "costNum": unlockCost[1] }, () => {
            if (!GameUtils_1.default.isReview) {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.RoleBarrageUI, { roleId: this.roleId, callBack: this.isClose.bind(this, isGuide), thisObj: this });
            }
            else {
                //打开新英雄解锁界面
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.UnlockRoleUI, { "roleId": this.roleId, callBack: this.isClose.bind(this, isGuide), thisObj: this });
            }
            //打点
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.HERO_OPEN, { roleId: this.roleId });
            //英雄解锁后刷新界面
            this.unlockRefreshUI();
            //刷新主界面角色显示
            Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK, this.roleId);
        }, this);
    }
    isClose(isGuide) {
        if (isGuide) {
            this.closeParent();
        }
    }
    closeParent() {
        this.myParent && this.myParent.close();
    }
    close() {
        TimerManager_1.default.instance.remove(this.roleSpeakTimer);
        this.roleSpeakTimer = null;
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_203) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst_1.default.GUIDE_2_204);
        }
        if (this.isShowFormation) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst_1.default.GUIDE_3_301);
        }
        //本次是解锁，返回主界面刷新空投
        if (this.isUnlock) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst_1.default.GUIDE_ROLEUNLOCK);
        }
        if (this.roleId == "1014" && this.isUnlock && !RolesModel_1.default.instance.getIsHaveRole(this.roleId)) {
            Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst_1.default.GUIDE_10003);
        }
    }
    clear() {
    }
    dispose() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            //关卡解锁刷新按钮
            case GameMainEvent_1.default.GAMEMAIN_EVENT_STAGE:
                this.refreshBtn();
                break;
            case GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshBtn();
                break;
        }
    }
}
exports.default = RoleInfoUI;
//# sourceMappingURL=RoleInfoUI.js.map