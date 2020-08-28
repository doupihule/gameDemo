"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const RolesModel_1 = require("../../model/RolesModel");
const RolesFunc_1 = require("../../func/RolesFunc");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const UserModel_1 = require("../../model/UserModel");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const UserExtModel_1 = require("../../model/UserExtModel");
const RedPointConst_1 = require("../../consts/RedPointConst");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class RoleDetailUI extends layaMaxUI_1.ui.gameui.role.RoleDetailUI {
    constructor() {
        super();
        this.curTab = 0;
        this.initBtn();
        this.addEvent();
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
    }
    addEvent() {
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY, this);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.roleBtn, this.onClickRole, this);
        new ButtonUtils_1.ButtonUtils(this.equipBtn, this.onClickEquip, this);
        new ButtonUtils_1.ButtonUtils(this.addCoinBtn, this.onTurnableBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.addGoldBtn, this.onTurnableBtnClick, this);
        if (UserExtModel_1.default.instance.checkIsTurnableShow()) {
            this.addCoinBtn.visible = true;
            this.addGoldBtn.visible = true;
        }
        else {
            this.addCoinBtn.visible = false;
            this.addGoldBtn.visible = false;
        }
    }
    setData(data) {
        this.curTab = data.tab || 0;
        this.id = data.id;
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_4_403) {
            this.curTab = 1;
        }
        else {
            BannerAdManager_1.default.addBannerQuick(this);
            if (!this.checkGuide_203()) {
                AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_RoleDetail, this);
            }
        }
        this.freshEquBtn();
        this.onClickTab(this.curTab);
        //货币初始化
        this.refreshMoney();
    }
    onTurnableBtnClick() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
    }
    /**检测是否显示角色解锁引导 */
    checkGuide_203() {
        if (RolesFunc_1.default.instance.getUnlockLevel(this.id) == 1 && UserModel_1.default.instance.getMainGuide() == 2 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_202) {
            return true;
        }
        return false;
    }
    //货币刷新
    refreshMoney() {
        this.coinNum.changeText(StringUtils_1.default.getCoinStr(UserModel_1.default.instance.getCoin()));
        this.goldNum.changeText(StringUtils_1.default.getCoinStr(UserModel_1.default.instance.getGold()));
    }
    freshEquBtn() {
        //判断角色是否解锁
        var role = RolesModel_1.default.instance.getIsHaveRole(this.id);
        if (!role) {
            this.equipBtn.visible = false;
            return;
        }
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        if (UserModel_1.default.instance.getMaxBattleLevel() < unlock) {
            this.equipBtn.visible = false;
            return;
        }
        else {
            this.equipBtn.visible = true;
        }
        this.freshEquipRed();
    }
    //刷新装备红点
    freshEquipRed() {
        this.equipRed.visible = false;
        if (!this.equipBtn.visible)
            return;
        var starLevel = RolesModel_1.default.instance.getRoleStarLevel(this.id);
        if (starLevel == 5)
            return;
        var starInfo = RolesFunc_1.default.instance.getCfgDatasByKey("RoleStar", this.id, starLevel + 1);
        var equip = starInfo.equipId;
        for (var i = 0; i < equip.length; i++) {
            var state = RolesFunc_1.default.instance.getEquipState(this.id, equip[i], true);
            if (state == RolesFunc_1.default.STATE_CANCOMPOSE) {
                this.equipRed.visible = true;
                break;
            }
        }
    }
    onClickRole() {
        if (this.curTab == 0)
            return;
        this.curTab = 0;
        this.onClickTab(this.curTab);
    }
    onClickEquip() {
        if (this.curTab == 1)
            return;
        this.curTab = 1;
        this.onClickTab(this.curTab);
    }
    onClickTab(index) {
        this.roleBtn.skin = (index == 0) ? "uisource/equip/equip/equip_image_biaoqian1.png" : "uisource/equip/equip/equip_image_biaoqian2.png";
        this.equipBtn.skin = (index == 1) ? "uisource/equip/equip/equip_image_biaoqian1.png" : "uisource/equip/equip/equip_image_biaoqian2.png";
        if (index == 0) {
            this.setRoleGroup();
        }
        else {
            this.setEquipGroup();
        }
    }
    //升级
    setRoleGroup() {
        if (!this.roleGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.RoleInfoUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.roleGroup = WindowManager_1.default.getUIClass(WindowCfgs_1.WindowCfgs.RoleInfoUI);
                this.ctn.addChild(this.roleGroup);
                this.roleGroup.setData(this.id, this);
            }));
        }
        else {
            this.roleGroup.visible = true;
            this.roleGroup.setData(this.id, this);
        }
        if (this.equipGroup) {
            this.equipGroup.visible = false;
        }
    }
    //装备
    setEquipGroup() {
        if (!this.equipGroup) {
            var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.RoleEquipmentUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.equipGroup = WindowManager_1.default.getUIClass(WindowCfgs_1.WindowCfgs.RoleEquipmentUI);
                this.ctn.addChild(this.equipGroup);
                this.equipGroup.setData(this.id, this);
            }));
        }
        else {
            this.equipGroup.visible = true;
            this.equipGroup.setData(this.id, this);
        }
        if (this.roleGroup) {
            this.roleGroup.visible = false;
        }
    }
    //关闭合成引导
    showGuide_407() {
        if (UserModel_1.default.instance.getMainGuide() == 6 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_4_406) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_407, GuideManager_1.default.GuideType.Static, this.btn_close, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_407, this.showGuide_407_finish, this);
        }
    }
    showGuide_407_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_407, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            this.close();
        }, this, true);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.RoleDetailUI);
        BannerAdManager_1.default.hideBanner(this["windowName"]);
        if (this.roleGroup) {
            this.roleGroup.close();
        }
        if (this.equipGroup) {
            this.equipGroup.close();
        }
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst_1.default.GUIDE_4_408);
        Message_1.default.instance.send(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, RedPointConst_1.default.POINT_MAIN_TASKRED);
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            //刷新货币、红点
            case GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshMoney();
                break;
        }
    }
}
exports.default = RoleDetailUI;
//# sourceMappingURL=RoleDetailUI.js.map