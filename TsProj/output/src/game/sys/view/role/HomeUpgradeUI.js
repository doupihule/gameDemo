"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const RolesModel_1 = require("../../model/RolesModel");
const RolesFunc_1 = require("../../func/RolesFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const UserModel_1 = require("../../model/UserModel");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const SkillFunc_1 = require("../../func/SkillFunc");
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
const GameUtils_1 = require("../../../../utils/GameUtils");
const TurnableModel_1 = require("../../model/TurnableModel");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const RedPointConst_1 = require("../../consts/RedPointConst");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class HomeUpgradeUI extends layaMaxUI_1.ui.gameui.role.HomeUpgradeUI {
    constructor() {
        super();
        /**配置的全部技能id */
        this.allSkillArr = [];
        /**配置的全部技能详细信息 */
        this.allSkillInfoArr = [];
        /**已解锁的技能 */
        this.unlockedSkillArr = [];
        /**当前预览的技能index */
        this.nowShowSkillIndex = 0;
        //技能显示框箭头指向数组
        this.skillDescIndexPosArr = [46, 166, 288, 410];
        this.removeUpSpineTimer = 0;
        this.addEvent();
        this.initBtn();
    }
    //添加事件监听
    addEvent() {
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY, this);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.upgradeBtn, this.onClickUpgrade, this);
        for (var i = 0; i < 4; i++) {
            new ButtonUtils_1.ButtonUtils(this["skillBtn" + i], this.onSkillBtn, this, null, null, [i]);
        }
    }
    //初始化
    setData() {
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_HomeUpgrade, this);
        this.homeId = GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId");
        var homeLevel = RolesModel_1.default.instance.getRoleLevelById(this.homeId);
        this.initPanel(homeLevel);
        //属性初始化
        this.initAttribute(homeLevel);
        //刷新技能信息
        this.freshSkillInfo();
        //刷新技能详细信息展示
        this.freshSkillInfoShow();
        //升级按钮刷新
        this.refreshBtn();
    }
    initPanel(homeLevel) {
        //基地spine
        this.showRoleAni();
        //角色等级
        this.homeLevel.text = "基地 Lv." + homeLevel;
    }
    initAttribute(level) {
        var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(this.homeId);
        //获取对应当前等级的属性
        this.roleUpdateInfo = RolesFunc_1.default.instance.getRoleUpdateInfo(this.homeId, level);
        var roleAttribute = this.roleUpdateInfo.attribute;
        this.roleAttribute = {};
        for (var j = 0; j < roleAttribute.length; j++) {
            var infoArr = roleAttribute[j].split(",");
            this.roleAttribute[infoArr[0]] = Number(infoArr[1]);
        }
        //属性展示
        this.freshAttrView(false, this.roleAttribute);
        //先隐藏右边的（下一级属性）
        for (var i = 0; i < 4; i++) {
            this["attrValueAdd_" + i].visible = false;
        }
        var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("flatMaxLevel");
        if (level < roleMaxLevel) {
            //显示下一等级对应的属性
            var roleNextLevelAttribute = RolesFunc_1.default.instance.getRoleUpdateInfo(this.homeId, level + 1).attribute;
            this.roleNextLevelAttribute = {};
            for (var j = 0; j < roleNextLevelAttribute.length; j++) {
                var infoArr = roleNextLevelAttribute[j].split(",");
                this.roleNextLevelAttribute[infoArr[0]] = parseInt(infoArr[1]);
            }
            for (var i = 0; i < 4; i++) {
                this["attrValueAdd_" + i].visible = true;
            }
            this.freshAttrView(true, this.roleNextLevelAttribute);
        }
    }
    //刷新属性展示区		add: 是否为下一级增加属性
    freshAttrView(add = false, attributeInfo) {
        //如果是右边的属性  则需要减去左边的 只显示差值
        if (add) {
            for (var id in attributeInfo) {
                attributeInfo[id] -= this.roleAttribute[id];
                if (attributeInfo[id] < 0) {
                    attributeInfo[id] = 0;
                }
            }
        }
        //显示当前等级对应的属性
        var attributeShow = RolesFunc_1.default.instance.getRoleDataById(this.homeId, "attributeShow");
        for (var i = 0; i < attributeShow.length; i++) {
            var attrId = attributeShow[i];
            this["attrDesc_" + i].text = TranslateFunc_1.default.instance.getTranslate("#tid_attribute_" + attrId, "TranslateAttributeList") + ":";
            var lab = add ? this["attrValueAdd_" + i] : this["attrValue_" + i];
            lab.text = '';
            if (attrId == BattleConst_1.default.attr_attack) {
                lab.text = attributeInfo[attrId];
            }
            else if (attrId == BattleConst_1.default.attr_maxHp) {
                lab.text = attributeInfo[attrId];
            }
            else if (attrId == BattleConst_1.default.attr_def) {
                lab.text = attributeInfo[attrId];
            }
            else if (attrId == BattleConst_1.default.attr_hit) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_crit) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_dodge) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_critDmg) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_toughness) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_damage) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_relief) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_treate) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_betreated) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 100, 1) + "%";
            }
            else if (attrId == BattleConst_1.default.attr_speed) {
                lab.text = GameUtils_1.default.numberToString(attributeInfo[attrId] / 1000, 1) + "s";
            }
            if (add) {
                if (attributeInfo[attrId] > 0) {
                    lab.text = "+" + lab.text;
                }
                else {
                    lab.text = '';
                }
            }
        }
    }
    refreshBtn() {
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.homeId);
        var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("flatMaxLevel");
        if (roleLevel >= roleMaxLevel) {
            this.fullLevelLab.visible = true;
            this.canUpgradeGroup.visible = false;
        }
        else {
            var levelPay = RolesFunc_1.default.instance.getRoleUpCostById(this.homeId, roleLevel);
            var levelPayArr = levelPay[0].split(",");
            var result = DataResourceFunc_1.default.instance.getDataResourceInfo(levelPayArr);
            this.upgradeCostImg.skin = result["img"];
            this.upgradeCostNum.text = StringUtils_1.default.getCoinStr(result["num"]);
            this.fullLevelLab.visible = false;
            this.canUpgradeGroup.visible = true;
            this.levelUpType = Number(levelPayArr[0]);
            this.levelUpCost = levelPayArr[1];
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
    showRoleAni() {
        if (this.homeAnim) {
            this.homeSpine.removeChild(this.homeAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this.homeId, this.homeAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + this.homeId);
        if (!cacheItem) {
            var scaleRoleInfo = RolesFunc_1.default.instance.getRoleDataById(this.homeId, "scaleRoleInfo") / 10000 * BattleFunc_1.default.defaultScale;
            var homeLevel = RolesModel_1.default.instance.getRoleLevelById(this.homeId);
            this.homeAnim = BattleFunc_1.default.instance.createRoleSpine(this.homeId, homeLevel, 2, scaleRoleInfo, false, false, "HomeUPgradeUI");
        }
        else {
            this.homeAnim = cacheItem;
        }
        this.homeSpine.addChild(this.homeAnim);
        this.homeAnim.x = this.homeSpine.width - 30;
        this.homeAnim.y = this.homeSpine.height;
        this.homeAnim.play("idle", true);
    }
    //刷新技能信息
    freshSkillInfo() {
        var skillUnlockInfo = GlobalParamsFunc_1.default.instance.getBaseSkillList();
        var homeLevel = RolesModel_1.default.instance.getRoleLevelById(this.homeId);
        this.allSkillArr = [];
        this.allSkillInfoArr = [];
        this.unlockedSkillArr = [];
        //隐藏技能组
        for (var i = 0; i < 4; i++) {
            this["skillGroup" + i].visible = false;
        }
        //先筛选出已解锁的技能
        for (var i = 0; i < skillUnlockInfo.length; i++) {
            var unlockInfoArr = skillUnlockInfo[i].split(",");
            this["skillGroup" + i].visible = true;
            this.allSkillArr.push(unlockInfoArr[1]);
            var skillInfo = SkillFunc_1.default.instance.getSkillInfoById(unlockInfoArr[1]);
            this.allSkillInfoArr.push(skillInfo);
            this["skillIcon" + i].skin = SkillFunc_1.default.instance.getSkillIcon(skillInfo.pic);
            if (homeLevel >= Number(unlockInfoArr[0])) {
                //已解锁
                this.unlockedSkillArr.push(unlockInfoArr[1]);
                this["unlockLab" + i].visible = false;
                this["skillIcon" + i].gray = false;
            }
            else {
                this["unlockLab" + i].visible = true;
                this["unlockLab" + i].text = unlockInfoArr[0] + "级后解锁";
                this["skillIcon" + i].gray = true;
            }
        }
    }
    //刷新技能详细信息展示
    freshSkillInfoShow() {
        var skillInfo = SkillFunc_1.default.instance.getSkillInfoById(this.allSkillArr[this.nowShowSkillIndex]);
        this.cdLab.text = skillInfo.cdTime / 1000 + "秒";
        this.skillDesclab.text = "技能描述：" + TranslateFunc_1.default.instance.getTranslate(skillInfo.desc);
        this.descIndexPos.x = this.skillDescIndexPosArr[this.nowShowSkillIndex];
    }
    //点了技能按钮
    onSkillBtn(data) {
        this.nowShowSkillIndex = data[0];
        this.freshSkillInfoShow();
    }
    //升级
    onClickUpgrade() {
        var roleLevel = RolesModel_1.default.instance.getRoleLevelById(this.homeId);
        var roleMaxLevel = GlobalParamsFunc_1.default.instance.getDataNum("flatMaxLevel");
        if (roleLevel >= roleMaxLevel) {
            WindowManager_1.default.ShowTip("已满级");
            return;
        }
        if (this.levelUpType == DataResourceFunc_1.DataResourceType.COIN) {
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), BigNumUtils_1.default.round(this.levelUpCost))) {
                if (TurnableModel_1.default.instance.checkTurnable()) {
                    WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                }
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                return;
            }
        }
        else if (this.levelUpType == DataResourceFunc_1.DataResourceType.GOLD) {
            if (Number(UserModel_1.default.instance.getGold()) < Math.floor(Number(this.levelUpCost))) {
                if (TurnableModel_1.default.instance.checkTurnable()) {
                    WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                }
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                return;
            }
        }
        //英雄升级
        RolesServer_1.default.upgradeRole({ "roleId": this.homeId, "costType": this.levelUpType, "costNum": this.levelUpCost }, () => {
            //升级后刷新界面
            this.freshView();
            //播放升级特效
            this.homeUpgradeSpine();
            //移除升级特效
            this.removeUpgradeSpine();
        }, this);
    }
    //播放升级特效
    homeUpgradeSpine() {
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
        this.upSpine.scaleX = this.upSpine.scaleY = 1.27;
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
    //升级后刷新界面
    freshView() {
        //等级刷新
        var homeLevel = RolesModel_1.default.instance.getRoleLevelById(this.homeId);
        this.homeLevel.text = "基地 Lv." + homeLevel;
        //属性刷新
        this.initAttribute(homeLevel);
        //按钮刷新
        this.refreshBtn();
        //技能列表刷新
        this.freshSkillInfo();
        //刷新主界面基地红点
        Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_FALT_REDPOINT);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.HomeUpgradeUI);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TASKRED);
    }
    clear() {
    }
    dispose() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshBtn();
                break;
        }
    }
}
exports.default = HomeUpgradeUI;
//# sourceMappingURL=HomeUpgradeUI.js.map