"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const RolesFunc_1 = require("../../func/RolesFunc");
const PoolCode_1 = require("../../consts/PoolCode");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const RolesModel_1 = require("../../model/RolesModel");
const BattleFunc_1 = require("../../func/BattleFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const EquipItemUI_1 = require("./EquipItemUI");
const UserExtModel_1 = require("../../model/UserExtModel");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const Message_1 = require("../../../../framework/common/Message");
const RoleEvent_1 = require("../../event/RoleEvent");
const UserModel_1 = require("../../model/UserModel");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const RolesServer_1 = require("../../server/RolesServer");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const ChapterFunc_1 = require("../../func/ChapterFunc");
class RoleEquipmentUI extends layaMaxUI_1.ui.gameui.role.RoleEquipmentUI {
    constructor() {
        super();
        this.timeCode = 0;
        Message_1.default.instance.add(RoleEvent_1.default.ROLE_EVENT_COMPOSE_EQUIP, this);
        new ButtonUtils_1.ButtonUtils(this.costBtn, this.onClickCostBtn, this);
        new ButtonUtils_1.ButtonUtils(this.adEvoBtn, this.onClickAdEvo, this);
        new ButtonUtils_1.ButtonUtils(this.evoluShow, this.onClickEvoPreview, this);
        new ButtonUtils_1.ButtonUtils(this.unlockEvoBtn, this.onClickUnlockEvo, this);
    }
    setData(id, parnet) {
        this.type = null;
        this.id = id;
        this.myParent = parnet;
        var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(this.id);
        this.nameTxt.text = TranslateFunc_1.default.instance.getTranslate(roleInfo.name, "TranslateRole");
        this.showRoleAni(id);
        this.freshInfo();
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.EQUIP_OPEN, { roleId: this.id });
    }
    //进化或合成装备后会刷新的信息
    freshInfo() {
        this.cost = null;
        RolesFunc_1.default.instance.addStarImg(this.starGroup, this.id);
        var nextStar = RolesModel_1.default.instance.getRoleStarLevel(this.id) + 1;
        if (nextStar > 5) {
            nextStar = 5;
        }
        this.starInfo = RolesFunc_1.default.instance.getCfgDatasByKey("RoleStar", this.id, nextStar);
        this.initEquipItem();
        this.initEvoCondition();
        this.myParent.freshEquipRed();
    }
    /**初始化进化信息 */
    initEvoCondition() {
        var starLevel = RolesModel_1.default.instance.getRoleStarLevel(this.id);
        this.unlockTxt.visible = false;
        this.adEvoBtn.visible = false;
        this.costBtn.visible = false;
        //已经满级了
        if (starLevel == 5)
            return;
        var equip = RolesModel_1.default.instance.getRoleEquip(this.id);
        if (equip && Object.keys(equip).length == 4) {
            //装备够了 ，判断是否有等级限制
            if (this.starInfo.condition) {
                var level = UserExtModel_1.default.instance.getMaxLevel();
                if (level < this.starInfo.condition) {
                    this.unlockTxt.visible = true;
                    this.unlockTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_role_evoContionLevel", null, ChapterFunc_1.default.instance.getOpenConditionByLevel(this.starInfo.condition));
                }
                else {
                    //过了限制等级了
                    var cost = (this.starInfo.cost[0]).split(",");
                    //视频进化
                    if (Number(cost[0]) == -1) {
                        this.type = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_EVOLUTION_FREE);
                        if (this.type == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                            cost = (this.starInfo.cost[1]).split(",");
                            this.showCostBtn(cost);
                        }
                        else {
                            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLEEVO_SHOW, { roleId: this.id });
                            this.adEvoBtn.visible = true;
                            this.adImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.type);
                        }
                    }
                    else {
                        this.showCostBtn(cost);
                    }
                }
            }
        }
        else {
            this.unlockTxt.visible = true;
            this.unlockTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_role_evoContion");
        }
    }
    showCostBtn(cost) {
        this.cost = cost;
        this.costBtn.visible = true;
        this.costImg.skin = DataResourceFunc_1.default.instance.getIconById(cost[0]);
        this.costTxt.text = cost[1];
    }
    //初始化装备信息
    initEquipItem() {
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.EquipItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initEquipItemBack));
    }
    initEquipItemBack() {
        if (!this.equipArr) {
            this.equipArr = [];
            for (var i = 0; i < 4; i++) {
                var item = new EquipItemUI_1.default();
                item.x = i % 2 * (this.equipGroup.width - item.width);
                item.y = Math.floor(i / 2) * (this.equipGroup.height - item.height);
                this.equipGroup.addChild(item);
                this.equipArr.push(item);
            }
        }
        var isCan = false;
        var equip = this.starInfo.equipId;
        for (var i = 0; i < this.equipArr.length; i++) {
            var items = this.equipArr[i];
            items.setData(this.id, equip[i], i + 1);
            if (items.state == RolesFunc_1.default.STATE_CANCOMPOSE && !isCan) {
                isCan = true;
            }
        }
        this.showGuide_404();
        if (isCan) {
            if (!this.timeCode) {
                this.timeCode = TimerManager_1.default.instance.add(this.freshComposeTxt, this, 1000);
            }
        }
        else {
            TimerManager_1.default.instance.remove(this.timeCode);
            this.timeCode = 0;
        }
    }
    freshComposeTxt() {
        for (var i = 0; i < this.equipArr.length; i++) {
            var items = this.equipArr[i];
            if (items.state == RolesFunc_1.default.STATE_CANCOMPOSE) {
                items.freshComposeTxt();
            }
        }
    }
    //显示角色
    showRoleAni(roleId) {
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + roleId);
        var scaleRoleInfo = RolesFunc_1.default.instance.getRoleDataById(roleId, "scaleRoleInfo") / 10000 * BattleFunc_1.default.defaultScale;
        if (!cacheItem) {
            var roleLevel = RolesModel_1.default.instance.getRoleLevelById(roleId);
            this.roleAnim = BattleFunc_1.default.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, false, false, "RoleEquipmentUI");
        }
        else {
            cacheItem.setItemViewScale(scaleRoleInfo);
            this.roleAnim = cacheItem;
        }
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
        this._lastRoleId = roleId;
    }
    //点击进化
    onClickCostBtn() {
        if (!this.cost)
            return;
        if (Number(this.cost[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), this.cost[1])) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                return;
            }
        }
        else if (Number(this.cost[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getGiftGold(), this.cost[1])) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
                return;
            }
        }
        RolesServer_1.default.roleEvolution({ roleId: this.id, cost: this.cost }, () => {
            this.evoSuccess();
        }, this);
    }
    //点击视频进化
    onClickAdEvo() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLEEVO_CLICK, { roleId: this.id });
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_EVOLUTION_FREE, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.successCall, this.failCall, this);
    }
    successCall() {
        if (this.type == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_ROLEEVO_FINISH, { roleId: this.id });
        }
        else {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_ROLEEVO_FINISH, { roleId: this.id });
        }
        RolesServer_1.default.roleEvolution({ roleId: this.id }, () => {
            this.evoSuccess();
        }, this);
    }
    failCall() {
        this.initEvoCondition();
    }
    evoSuccess() {
        this.freshInfo();
        Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_EVOLUTION, this.id);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.EvoRewardUI, { roleId: this.id });
    }
    //进化描述
    onClickEvoPreview() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.EvoPreviewUI, this.id);
    }
    onClickUnlockEvo() {
        WindowManager_1.default.ShowTip(this.unlockTxt.text);
    }
    close() {
        TimerManager_1.default.instance.remove(this.timeCode);
        this.timeCode = 0;
    }
    //合成装备引导
    showGuide_404() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_4_403) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_404, GuideManager_1.default.GuideType.Static, this.equipArr[0], this.myParent);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_404, () => {
                this.showGuide_404_finish();
            }, this);
        }
    }
    showGuide_404_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_404, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            this.equipArr[0].onClickItem();
        }, this, false);
    }
    //进化引导
    showGuide_406() {
        if (UserModel_1.default.instance.getMainGuide() == 6 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_4_405) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_406, GuideManager_1.default.GuideType.Static, this.unlockEvoBtn, this.myParent);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_406, this.showGuide_406_finish, this);
        }
    }
    showGuide_406_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_406, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            this.myParent.showGuide_407();
        }, this);
    }
    recvMsg(cmd, data) {
        if (cmd == RoleEvent_1.default.ROLE_EVENT_COMPOSE_EQUIP) {
            this.freshInfo();
            this.showGuide_406();
        }
    }
}
exports.default = RoleEquipmentUI;
//# sourceMappingURL=RoleEquipmentUI.js.map