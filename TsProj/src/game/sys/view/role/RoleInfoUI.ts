import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import RolesModel from "../../model/RolesModel";
import RolesFunc from "../../func/RolesFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import UserModel from "../../model/UserModel";
import LogsManager from "../../../../framework/manager/LogsManager";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import RolesServer from "../../server/RolesServer";
import BattleFunc from "../../func/BattleFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import DisplayUtils from "../../../../framework/utils/DisplayUtils";
import { ui } from "../../../../ui/layaMaxUI";
import RoleEvent from "../../event/RoleEvent";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import BattleConst from "../../consts/BattleConst";
import TimerManager from "../../../../framework/manager/TimerManager";
import DataResourceFunc, { DataResourceType } from "../../func/DataResourceFunc";
import GameUtils from "../../../../utils/GameUtils";
import TurnableModel from "../../model/TurnableModel";
import StatisticsManager from "../../manager/StatisticsManager";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import RoleDetailUI from "./RoleDetailUI";
import SkeletonExpand from "../../../../framework/viewcomp/SkeletonExpand";
import LogsErrorCode from "../../../../framework/consts/LogsErrorCode";
import TweenAniManager from "../../manager/TweenAniManager";
import { userInfo } from "os";
import UserInfo from "../../../../framework/common/UserInfo";
import ChapterFunc from "../../func/ChapterFunc";
import RedPointConst from "../../consts/RedPointConst";

export default class RoleInfoUI extends ui.gameui.role.RoleInfoUI implements IMessage {
    //角色id
    private roleId;
    private changeId;
    //角色动画
    private roleAnim: BattleRoleView;
    //上次缓存角色spine的id
    private _lastRoleId: string;
    private roleSpeakTimer;

    private removeUpSpineTimer: number = 0;
    private upSpine: SkeletonExpand;

    private freeType;
    private isShowFormation = false;
    private isUnlock = false;
    private myParent: RoleDetailUI;


    constructor() {
        super();
        this.addEvent();
        this.initBtn();
    }
    //添加事件监听
    addEvent() {
        Message.instance.add(GameMainEvent.ROLELIST_EVENT_REFRESH, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_STAGE, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
    }
    initBtn() {
        new ButtonUtils(this.upgradeBtn, this.onClickUpgrade, this);
        new ButtonUtils(this.unlockBtn, this.onClickUnlock, this);
        new ButtonUtils(this.videoUnlockBtn, this.onClickVideoUnlock, this);
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
        var roleInfo = RolesFunc.instance.getRoleInfoById(this.roleId);


        //角色spine
        this.showRoleAni(this.roleId);
        this.roleName.text = TranslateFunc.instance.getTranslate(roleInfo.name, "TranslateRole");
        this.roleDesc.text = TranslateFunc.instance.getTranslate(roleInfo.explain, "TranslateRole");


        //角色名字，等级，描述
        var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);
        this.roleLevel.text = "Lv. " + roleLevel;


        if (!RolesModel.instance.checkRoleUnlock(this.roleId)) {
            DisplayUtils.setViewDark(this.roleAnim);
        }

    }
    refresshRoleSpeak() {
        var infoSpeakInterval = GlobalParamsFunc.instance.getDataNum("infoSpeakInterval");
        //角色随机说话
        if (!this.roleSpeakTimer) {
            this.roleSpeakTimer = TimerManager.instance.add(this.roleDoSpeak, this, infoSpeakInterval);
        }

    }
    roleDoSpeak() {
        var infoSpeak = RolesFunc.instance.getRoleDataById(this.roleId, "infoSpeak");
        if (infoSpeak) {
            this.roleSpeak.visible = true;
            this.roleSpeakLab.visible = true;
            this.roleSpeakLab.text = TranslateFunc.instance.getTranslate(infoSpeak, "TranslateRole");
        }
    }
    initAttribute(isFresh = false) {
        var roleInfo = RolesFunc.instance.getRoleInfoById(this.roleId);

        //移速
        this.moveSpeedNum.text = TranslateFunc.instance.getTranslate(roleInfo.moveSpeed, "TranslateRole");
        //攻击类型
        this.attackTypeNum.text = TranslateFunc.instance.getTranslate(roleInfo.attackType, "TranslateRole");
        //攻速
        this.attackSpeedNum.text = TranslateFunc.instance.getTranslate(roleInfo.attackSpeed, "TranslateRole");
        //攻击距离
        this.attackRangeNum.text = TranslateFunc.instance.getTranslate(roleInfo.attackRange, "TranslateRole");

        var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);;
        this.hitNum.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_crit, this.roleId, roleLevel, null, false);
        //血量
        this.bloodNum.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_maxHp, this.roleId, roleLevel, null, false);
        //伤害
        this.attackNum.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_attack, this.roleId, roleLevel, null, false);
        //目标
        this.targetNum.text = TranslateFunc.instance.getTranslate(roleInfo.attackTarget, "TranslateRole");
        //命中
        this.beHitNum.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_hit, this.roleId, roleLevel, null, false);
        //闪避
        this.dodgeNum.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_dodge, this.roleId, roleLevel, null, false);


    }
    refreshBtn() {
        this.videoUnlockGroup.visible = false;

        //判断是否解锁
        if (RolesModel.instance.checkRoleUnlock(this.roleId)) {
            this.upgradeGroup.visible = true;
            this.unlockGroup.visible = false;
            this.unlockLevelLab.visible = false;


            var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);
            var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("roleMaxLevel");
            if (roleLevel >= roleMaxLevel) {
                this.fullLevelLab.visible = true;
                this.canUpgradeGroup.visible = false;
            } else {
                this.fullLevelLab.visible = false;
                this.canUpgradeGroup.visible = true;
                var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);
                var levelPay = RolesFunc.instance.getRoleUpCostById(this.roleId, roleLevel);
                var levelPayArr = levelPay[0].split(",");
                var result = DataResourceFunc.instance.getDataResourceInfo(levelPayArr);
                this.upgradeCostImg.skin = result["img"];
                this.upgradeCostNum.text = StringUtils.getCoinStr(result["num"]);

                if (Number(levelPayArr[0]) == DataResourceType.COIN) {		//金币
                    if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(result["num"]))) {
                        this.upgradeCostNum.color = "#ff0000";
                    } else {
                        this.upgradeCostNum.color = "#000000";
                    }
                    this.upgradeLab.text = "金币升级";
                } else if (Number(levelPayArr[0]) == DataResourceType.GOLD) {		//钻石
                    if (Number(UserModel.instance.getGold()) < Math.floor(Number(result["num"]))) {
                        this.upgradeCostNum.color = "#ff0000";
                    } else {
                        this.upgradeCostNum.color = "#000000";
                    }

                    this.upgradeLab.text = "钻石升级";
                }
            }
        } else {
            this.upgradeGroup.visible = false;
            //判断关卡条件是否达到
            if (!RolesModel.instance.checkRoleLevelunlock(this.roleId)) {
                this.unlockGroup.visible = false;
                this.unlockLevelLab.visible = true;
                var needLevel = RolesFunc.instance.getUnlockLevel(this.roleId);
                this.unlockLevelLab.text = TranslateFunc.instance.getTranslate("#tid_flat_unlockTip", null, ChapterFunc.instance.getOpenConditionByLevel(needLevel));;
            } else {
                this.isUnlock = true;
                //判断是视频解锁还是货币解锁
                if (RolesFunc.instance.checkIsVideoUnlockRole(this.roleId)) {
                    this.unlockGroup.visible = false;
                    this.unlockLevelLab.visible = false;
                    this.videoUnlockGroup.visible = true;
                    this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_UNLOCK_ROLE);
                    this.freeUnlockImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
                    if (this.freeType == ShareOrTvManager.TYPE_ADV) {
                        StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLE_SHOW, { "roleId": this.roleId });
                    }
                } else {
                    this.unlockGroup.visible = true;
                    this.unlockLevelLab.visible = false;

                    var unlockMoney = RolesFunc.instance.getUnlockMoney(this.roleId);
                    if (unlockMoney.length == 0) {
                        return;
                    }

                    var result = DataResourceFunc.instance.getDataResourceInfo(unlockMoney);
                    this.unlockCostImg.skin = result["img"];
                    this.unlockCostNum.text = StringUtils.getCoinStr(result["num"]);

                    if (Number(unlockMoney[0]) == DataResourceType.COIN) {		//金币
                        if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(result["num"]))) {
                            this.unlockCostNum.color = "#ff0000";
                        } else {
                            this.unlockCostNum.color = "#000000";
                        }
                    } else if (Number(unlockMoney[0]) == DataResourceType.GOLD) {		//钻石
                        if (Number(UserModel.instance.getGold()) < Math.floor(Number(result["num"]))) {
                            this.unlockCostNum.color = "#ff0000";
                        } else {
                            this.unlockCostNum.color = "#000000";
                        }
                    }
                }
                this.showGuide_203(RolesFunc.instance.getUnlockLevel(this.roleId));
            }
        }
    }
    //展示键盘侠解锁引导
    showGuide_203(level) {
        if (Number(level == 1) && UserModel.instance.getMainGuide() == 2 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_202) {
            GuideManager.ins.setGuideData(GuideConst.GUIDE_2_203, GuideManager.GuideType.Static, this.unlockGroup, this.myParent);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_2_203, null, this, this.showGuide_203_finish);
        }
    }
    showGuide_203_finish() {
        if (UserModel.instance.getMainGuide() == 2 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_202) {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            GuideManager.ins.guideFin(GuideConst.GUIDE_2_203, null, null, true);
            return true;
        }
        return false;
    }

    showRoleAni(roleId) {

        if (this.roleAnim) {
            this.roleSpine.removeChild(this.roleAnim);
            PoolTools.cacheItem(PoolCode.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
        if (!cacheItem) {
            var scaleRoleInfo = RolesFunc.instance.getRoleDataById(roleId, "scaleRoleInfo") / 10000 * BattleFunc.defaultScale;
            var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, false,false,"RoleInfoUI");
        } else {
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
            TimerManager.instance.remove(this.removeUpSpineTimer);
            this.removeUpSpineTimer = 0;
        }
        if (!this.upSpine) {
            var upSpineName = RolesFunc.ROLE_UPGRADE_SPINE;
            this.upSpine = DisplayUtils.createSkeletonExpand(upSpineName);
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
            this.removeUpSpineTimer = TimerManager.instance.add(this.hideUpgradeSpine, this, 1000, 1);
        }
    }
    hideUpgradeSpine() {
        if (this.upSpine) {
            this.upSpine.visible = false;
        }
    }
    //升级
    onClickUpgrade() {
        var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);
        var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("roleMaxLevel");
        if (roleLevel >= roleMaxLevel) {
            WindowManager.ShowTip("已满级");
            return;
        }
        //升级消耗
        var upgradeCost = RolesFunc.instance.getUpgradeCost(this.roleId, roleLevel);
        switch (upgradeCost[0]) {
            case DataResourceType.COIN:
                if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(upgradeCost[1]))) {
                    if (TurnableModel.instance.checkTurnable()) {
                        WindowManager.OpenUI(WindowCfgs.TurnableUI);
                    }
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));

                    return;
                }
                break;
            case DataResourceType.GOLD:
                if (Number(UserModel.instance.getGold()) < Math.floor(Number(upgradeCost[1]))) {
                    if (TurnableModel.instance.checkTurnable()) {
                        WindowManager.OpenUI(WindowCfgs.TurnableUI);
                    }
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
        }

        //英雄升级
        RolesServer.upgradeRole({ "roleId": this.roleId, "costType": upgradeCost[0], "costNum": upgradeCost[1] }, () => {
            //升级后刷新界面
            this.upgradeRefreshUI();
            //播放升级特效
            this.roleUpgradeSpine();
            //播放升级属性文字动画
            this.roleUpAttriChange();
            //刷新主界面角色等级
            Message.instance.send(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLELEVEL, this.roleId);
            //移除升级特效
            this.removeUpgradeSpine();
            //打点
            StatisticsManager.ins.onEvent(StatisticsManager.HERO_LEVEL, { roleId: this.roleId });

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
            TimerManager.instance.setTimeout(() => {
                this.upGroup.visible = false;
            }, this, 300);
        }));
    }
    showAttriChange() {
        var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);
        this.attackNum1.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_attack, this.roleId, Number(roleLevel) - 1, null, false);
        this.attackNum2.text = this.attackNum.text;

        this.bloodNum1.text = RolesFunc.instance.getAttShowTxt(BattleConst.attr_maxHp, this.roleId, Number(roleLevel) - 1, null, false);
        this.bloodNum2.text = this.bloodNum.text;
    }
    //英雄升级后刷新界面
    upgradeRefreshUI() {
        //等级
        var roleLevel = RolesModel.instance.getRoleLevelById(this.roleId);
        this.roleLevel.text = "Lv. " + roleLevel;
        //按钮刷新
        this.refreshBtn();
        //刷新属性
        this.initAttribute(true);
    }
    //英雄解锁后刷新界面
    unlockRefreshUI() {
        //spine滤镜清除
        DisplayUtils.clearViewFilter(this.roleAnim);
        //界面按钮刷新
        this.refreshBtn();
        if (Object.keys(RolesModel.instance.getRolesList()).length == 5) {
            this.isShowFormation = true;
        }
        this.myParent.freshEquBtn();

    }
    //视频解锁
    onClickVideoUnlock() {
        if (RolesModel.instance.checkRoleUnlock(this.roleId)) {
            WindowManager.ShowTip("英雄已经解锁");
            return;
        }

        //判断是否达到关卡的前置要求
        if (!RolesModel.instance.checkRoleLevelunlock(this.roleId)) {
            WindowManager.ShowTip("关卡还未达成，快去战斗吧！");
            return;
        }

        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLE_CLICK, { "roleId": this.roleId });
        }

        ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_UNLOCK_ROLE, ShareOrTvManager.TYPE_SHARE,
            {
                id: "1",
                extraData: {}
            },
            this.successfull, this.closefull, this);
    }
    successfull() {
        //英雄解锁
        var delay = 0;
        if (UserInfo.isSystemNative()) {
            delay = 500;
        }
        this.finishUnlock(delay);
        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLE_FINISH, { "roleId": this.roleId });
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_UNLOCKROLE_FINISH, { "roleId": this.roleId });
        }
    }
    finishUnlock(delay) {
        RolesServer.unlockRole({ "roleId": this.roleId }, () => {
            if (!GameUtils.isReview) {
                TimerManager.instance.setTimeout(() => {
                    WindowManager.OpenUI(WindowCfgs.RoleBarrageUI, { roleId: this.roleId })
                }, this, delay)
            } else {
                //打开新英雄解锁界面
                WindowManager.OpenUI(WindowCfgs.UnlockRoleUI, { "roleId": this.roleId });
            }
            //打点
            StatisticsManager.ins.onEvent(StatisticsManager.HERO_OPEN, { roleId: this.roleId });
            //英雄解锁后刷新界面
            this.unlockRefreshUI();
            //刷新主界面角色显示
            Message.instance.send(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK, this.roleId);
        }, this);
    }
    closefull() {

    }
    //货币解锁
    onClickUnlock() {
        var isGuide = this.showGuide_203_finish();
        if (RolesModel.instance.checkRoleUnlock(this.roleId)) {
            WindowManager.ShowTip("英雄已经解锁");
            return;
        }

        //判断是否达到关卡的前置要求
        if (!RolesModel.instance.checkRoleLevelunlock(this.roleId)) {
            WindowManager.ShowTip("关卡还未达成，快去战斗吧！");
            return;
        }

        //升级消耗
        var unlockCost = RolesFunc.instance.getUnlockMoney(this.roleId);
        switch (unlockCost[0]) {
            case DataResourceType.COIN:
                if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(unlockCost[1]))) {
                    if (TurnableModel.instance.checkTurnable()) {
                        WindowManager.OpenUI(WindowCfgs.TurnableUI);
                    }

                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
            case DataResourceType.GOLD:
                if (!BigNumUtils.compare(UserModel.instance.getGold(), BigNumUtils.round(unlockCost[1]))) {
                    if (TurnableModel.instance.checkTurnable()) {
                        WindowManager.OpenUI(WindowCfgs.TurnableUI);
                    }
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
        }

        //英雄解锁
        RolesServer.unlockRole({ "roleId": this.roleId, "costType": unlockCost[0], "costNum": unlockCost[1] }, () => {
            if (!GameUtils.isReview) {
                WindowManager.OpenUI(WindowCfgs.RoleBarrageUI, { roleId: this.roleId, callBack: this.isClose.bind(this, isGuide), thisObj: this })
            } else {
                //打开新英雄解锁界面
                WindowManager.OpenUI(WindowCfgs.UnlockRoleUI, { "roleId": this.roleId, callBack: this.isClose.bind(this, isGuide), thisObj: this });
            }
            //打点
            StatisticsManager.ins.onEvent(StatisticsManager.HERO_OPEN, { roleId: this.roleId });
            //英雄解锁后刷新界面
            this.unlockRefreshUI();
            //刷新主界面角色显示
            Message.instance.send(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK, this.roleId);

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
        TimerManager.instance.remove(this.roleSpeakTimer);
        this.roleSpeakTimer = null;
        if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_203) {
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst.GUIDE_2_204);
        }
        if (this.isShowFormation) {
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst.GUIDE_3_301);
        }
        //本次是解锁，返回主界面刷新空投
        if (this.isUnlock) {
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst.GUIDE_ROLEUNLOCK);
        }
        if (this.roleId == "1014" && this.isUnlock && !RolesModel.instance.getIsHaveRole(this.roleId)) {
            Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst.GUIDE_10003);

        }
    }

    clear() {

    }
    dispose() {

    }
    recvMsg(cmd: string, data: any): void {

        switch (cmd) {
            //关卡解锁刷新按钮
            case GameMainEvent.GAMEMAIN_EVENT_STAGE:
                this.refreshBtn();
                break;
            case GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshBtn();
                break;
        }
    }

}