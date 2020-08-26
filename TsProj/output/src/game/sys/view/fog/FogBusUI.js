"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const RolesModel_1 = require("../../model/RolesModel");
const Message_1 = require("../../../../framework/common/Message");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const FogModel_1 = require("../../model/FogModel");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogFunc_1 = require("../../func/FogFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const BattleFunc_1 = require("../../func/BattleFunc");
const BattleConst_1 = require("../../consts/BattleConst");
const FogServer_1 = require("../../server/FogServer");
const FogEvent_1 = require("../../event/FogEvent");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ResourceConst_1 = require("../../consts/ResourceConst");
const FogRoleLineItemUI_1 = require("./FogRoleLineItemUI");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class FogBusUI extends layaMaxUI_1.ui.gameui.fog.FogBusUI {
    constructor() {
        super();
        //当前页签
        this.curTab = 0;
        new ButtonUtils_1.ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.busUpgradeBtn, this.onClickBusUpgrade, this);
        new ButtonUtils_1.ButtonUtils(this.upgradeBtn, this.onClickUpgrade, this);
        new ButtonUtils_1.ButtonUtils(this.formationBtn, this.onClickFormation, this);
    }
    setData(data) {
        this.curTab = data.tab || 0;
        this.onClickTab(this.curTab);
        if (!this.showGuide_1002()) {
            BannerAdManager_1.default.addBannerQuick(this);
            AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_FogBus, this);
        }
    }
    //属性展示
    showGuide_1002() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_10_1001) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10_1002, GuideManager_1.default.GuideType.Static, this.attriGroup, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10_1002, this.checkGuide_1002_finish, this);
            return true;
        }
        return false;
    }
    checkGuide_1002_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_10_1002, this.showGuide_1003, this);
    }
    //升级按钮
    showGuide_1003() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10_1003, GuideManager_1.default.GuideType.Static, this.busUpgradeGroup, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10_1003);
    }
    checkGuide_1003_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_10_1003) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_10_1003, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
                this.showGuide_1004();
            }, this);
        }
    }
    //退出引导
    showGuide_1004() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10_1004, GuideManager_1.default.GuideType.Static, this.btn_close, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10_1004);
    }
    checkGuide_1004_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_10_1004) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_10_1004, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
                Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_GUIDE, GuideConst_1.default.GUIDE_11_1101);
            }, this, true);
        }
    }
    onClickTab(index) {
        this.upgradeGroup.visible = false;
        this.formationGroup.visible = false;
        this.upgradeBtn.skin = (index == 0) ? ResourceConst_1.default.FOG_BUS_VIEW_CHOOSE : ResourceConst_1.default.FOG_BUS_VIEW_NOT_CHOOSE;
        this.formationBtn.skin = (index == 1) ? ResourceConst_1.default.FOG_BUS_VIEW_CHOOSE : ResourceConst_1.default.FOG_BUS_VIEW_NOT_CHOOSE;
        if (index == 0) {
            this.setUpgradeGroup();
        }
        else {
            this.setFormationGroup();
        }
    }
    setUpgradeGroup() {
        this.upgradeGroup.visible = true;
        this.fullLevel.visible = false;
        //等级
        var busLevel = FogModel_1.default.instance.getBusLevel();
        this.bussLevel.text = "Lv." + busLevel;
        //描述
        this.busDesc.text = TranslateFunc_1.default.instance.getTranslate("#tid_fogStreet_bus_desc", "TranslateFogStreet");
        //属性
        this.refreshBusAttr();
        //按钮刷新
        this.refreshUpgradeBtn();
    }
    refreshBusAttr() {
        var busLevel = FogModel_1.default.instance.getBusLevel();
        var attribute = FogFunc_1.default.instance.getBusAttribute(busLevel);
        var curAttack = Number(attribute[0]) / 100;
        var curBlood = Number(attribute[1]) / 100;
        var curEnergy = Number(attribute[2]);
        //判断是否大刀最大等级
        var maxLevel = FogFunc_1.default.instance.getBusMaxLevel();
        if (busLevel >= maxLevel) {
            this.attackNum.text = curAttack + "%";
            this.bloodNum.text = curBlood + "%";
            this.energyNum.text = curEnergy + "";
        }
        else {
            var nextAttribute = FogFunc_1.default.instance.getBusAttribute(busLevel + 1);
            var nextAttack = Number(nextAttribute[0]) / 100;
            var nextBlood = Number(nextAttribute[1]) / 100;
            var nextEnergy = Number(nextAttribute[2]);
            this.attackNum.text = curAttack + "%" + "（下级+" + (nextAttack - curAttack) + "%）";
            this.bloodNum.text = curBlood + "%" + "（下级+" + (nextBlood - curBlood) + "%）";
            this.energyNum.text = curEnergy + "（下级+" + (nextEnergy - curEnergy) + "）";
        }
    }
    refreshUpgradeBtn() {
        var busLevel = FogModel_1.default.instance.getBusLevel();
        this.fullLevel.visible = false;
        this.busUpgradeBtn.visible = true;
        this.upgradeCostGroup.visible = true;
        //判断是否满级
        var busMaxLevel = FogFunc_1.default.instance.getBusMaxLevel();
        if (busLevel >= busMaxLevel) {
            this.fullLevel.visible = true;
            this.busUpgradeBtn.visible = false;
            this.upgradeCostGroup.visible = false;
            return;
        }
        var costNum = FogFunc_1.default.instance.getCfgDatasByKey("BusUpGrade", busLevel, "cost");
        this.costNum.text = StringUtils_1.default.getCoinStr(costNum + "");
        var compNum = FogModel_1.default.instance.getCompNum();
        if (Number(costNum) <= compNum) {
            this.costNum.color = "#000000";
        }
        else {
            this.costNum.color = "#ff0a06";
        }
    }
    setFormationGroup() {
        this.formationGroup.visible = true;
        this.rolePanel.vScrollBarSkin = "";
        var inlineRole = FogModel_1.default.instance.getLine();
        var allRole = RolesModel_1.default.instance.getUnlockRole();
        var leftNum = allRole.length - Object.keys(inlineRole).length >= 0 ? allRole.length - Object.keys(inlineRole).length : 0;
        //数量=玩家已解锁的角色-当前阵容中的角色
        this.leftRoleLab.text = leftNum + "";
        this.lineList = [];
        for (var key in inlineRole) {
            if (inlineRole.hasOwnProperty(key)) {
                var cfg = BattleFunc_1.default.instance.getCfgDatas("Role", key);
                if (cfg.kind == BattleConst_1.default.LIFE_JIDI)
                    continue;
                this.lineList.push(cfg);
            }
        }
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.FogRoleLineItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initFormationPanelData));
    }
    initFormationPanelData() {
        this.rolePanel.removeChildren();
        for (var i = 0; i < this.lineList.length; i++) {
            var item = this.lineList[i];
            var roleItem = new FogRoleLineItemUI_1.default(item, this, false);
            this.rolePanel.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
        }
    }
    onClickBusUpgrade() {
        this.checkGuide_1003_finish();
        var busLevel = FogModel_1.default.instance.getBusLevel();
        var busMaxLevel = FogFunc_1.default.instance.getBusMaxLevel();
        if (busLevel >= busMaxLevel) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_bus_full_level"));
            return;
        }
        var costNum = FogFunc_1.default.instance.getCfgDatasByKey("BusUpGrade", busLevel, "cost");
        this.costNum.text = StringUtils_1.default.getCoinStr(costNum + "");
        var compNum = FogModel_1.default.instance.getCompNum();
        if (Number(costNum) > compNum) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcomp"));
            return;
        }
        FogServer_1.default.upgradeBus({ "upLevel": 1, "upCost": costNum }, () => {
            //刷新按钮
            this.refreshUpgradeBtn();
            //刷新等级
            this.bussLevel.text = "Lv." + FogModel_1.default.instance.getBusLevel();
            //刷新属性
            this.refreshBusAttr();
            //刷新FogMainView红点
            Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_BUS);
            //升级打点
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_BUS_UPGRADE, { "level": FogModel_1.default.instance.getBusLevel() });
        }, this);
    }
    onClickUpgrade() {
        if (this.curTab == 0)
            return;
        this.curTab = 0;
        this.onClickTab(this.curTab);
    }
    onClickFormation() {
        if (this.curTab == 1)
            return;
        this.curTab = 1;
        this.onClickTab(this.curTab);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogBusUI);
        this.checkGuide_1004_finish();
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogBusUI;
//# sourceMappingURL=FogBusUI.js.map