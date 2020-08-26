import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import RolesModel from "../../model/RolesModel";
import Message from "../../../../framework/common/Message";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogModel from "../../model/FogModel";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import BattleFunc from "../../func/BattleFunc";
import BattleConst from "../../consts/BattleConst";
import FogServer from "../../server/FogServer";
import FogEvent from "../../event/FogEvent";
import StatisticsManager from "../../manager/StatisticsManager";
import ResourceConst from "../../consts/ResourceConst";
import FogRoleLineItemUI from "./FogRoleLineItemUI";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";


export default class FogBusUI extends ui.gameui.fog.FogBusUI implements IMessage {

    //当前页签
    private curTab = 0;
    private lineList;//阵容数组

    constructor() {
        super();
        new ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils(this.busUpgradeBtn, this.onClickBusUpgrade, this);
        new ButtonUtils(this.upgradeBtn, this.onClickUpgrade, this);
        new ButtonUtils(this.formationBtn, this.onClickFormation, this);
    }

    public setData(data) {
        this.curTab = data.tab || 0;
        this.onClickTab(this.curTab);

        if (!this.showGuide_1002()) {
            BannerAdManager.addBannerQuick(this);
            AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_FogBus, this);
        }
    }
    //属性展示
    showGuide_1002() {
        if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_10_1001) {
            GuideManager.ins.setGuideData(GuideConst.GUIDE_10_1002, GuideManager.GuideType.Static, this.attriGroup, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_10_1002, this.checkGuide_1002_finish, this)
            return true;
        }
        return false;
    }
    checkGuide_1002_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_10_1002, this.showGuide_1003, this)
    }
    //升级按钮
    showGuide_1003() {
        GuideManager.ins.setGuideData(GuideConst.GUIDE_10_1003, GuideManager.GuideType.Static, this.busUpgradeGroup, this);
        GuideManager.ins.openGuideUI(GuideConst.GUIDE_10_1003)
    }
    checkGuide_1003_finish() {
        if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_10_1003) {
            GuideManager.ins.guideFin(GuideConst.GUIDE_10_1003, () => {
                WindowManager.CloseGuideUI(WindowCfgs.GuideUI)
                this.showGuide_1004();
            }, this)
        }

    }
    //退出引导
    showGuide_1004() {
        GuideManager.ins.setGuideData(GuideConst.GUIDE_10_1004, GuideManager.GuideType.Static, this.btn_close, this);
        GuideManager.ins.openGuideUI(GuideConst.GUIDE_10_1004)
    }
    checkGuide_1004_finish() {
        if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_10_1004) {
            GuideManager.ins.guideFin(GuideConst.GUIDE_10_1004, () => {
                WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
                Message.instance.send(FogEvent.FOGEVENT_REFRESH_GUIDE, GuideConst.GUIDE_11_1101)
            }, this, true)
        }

    }
    onClickTab(index) {
        this.upgradeGroup.visible = false;
        this.formationGroup.visible = false;

        this.upgradeBtn.skin = (index == 0) ? ResourceConst.FOG_BUS_VIEW_CHOOSE : ResourceConst.FOG_BUS_VIEW_NOT_CHOOSE;
        this.formationBtn.skin = (index == 1) ? ResourceConst.FOG_BUS_VIEW_CHOOSE : ResourceConst.FOG_BUS_VIEW_NOT_CHOOSE;
        if (index == 0) {
            this.setUpgradeGroup();
        } else {
            this.setFormationGroup();
        }
    }
    setUpgradeGroup() {
        this.upgradeGroup.visible = true;
        this.fullLevel.visible = false;
        //等级
        var busLevel = FogModel.instance.getBusLevel();
        this.bussLevel.text = "Lv." + busLevel;
        //描述
        this.busDesc.text = TranslateFunc.instance.getTranslate("#tid_fogStreet_bus_desc", "TranslateFogStreet");
        //属性
        this.refreshBusAttr();
        //按钮刷新
        this.refreshUpgradeBtn();
    }
    refreshBusAttr() {
        var busLevel = FogModel.instance.getBusLevel();
        var attribute = FogFunc.instance.getBusAttribute(busLevel);
        var curAttack = Number(attribute[0]) / 100;
        var curBlood = Number(attribute[1]) / 100;
        var curEnergy = Number(attribute[2]);


        //判断是否大刀最大等级
        var maxLevel = FogFunc.instance.getBusMaxLevel();
        if (busLevel >= maxLevel) {
            this.attackNum.text = curAttack + "%";
            this.bloodNum.text = curBlood + "%";
            this.energyNum.text = curEnergy + "";
        } else {
            var nextAttribute = FogFunc.instance.getBusAttribute(busLevel + 1);
            var nextAttack = Number(nextAttribute[0]) / 100;
            var nextBlood = Number(nextAttribute[1]) / 100;
            var nextEnergy = Number(nextAttribute[2]);

            this.attackNum.text = curAttack + "%" + "（下级+" + (nextAttack - curAttack) + "%）";
            this.bloodNum.text = curBlood + "%" + "（下级+" + (nextBlood - curBlood) + "%）";
            this.energyNum.text = curEnergy + "（下级+" + (nextEnergy - curEnergy) + "）";
        }
    }
    refreshUpgradeBtn() {
        var busLevel = FogModel.instance.getBusLevel();
        this.fullLevel.visible = false;
        this.busUpgradeBtn.visible = true;
        this.upgradeCostGroup.visible = true;

        //判断是否满级
        var busMaxLevel = FogFunc.instance.getBusMaxLevel();
        if (busLevel >= busMaxLevel) {
            this.fullLevel.visible = true;
            this.busUpgradeBtn.visible = false;
            this.upgradeCostGroup.visible = false;
            return;
        }

        var costNum = FogFunc.instance.getCfgDatasByKey("BusUpGrade", busLevel, "cost");
        this.costNum.text = StringUtils.getCoinStr(costNum + "");
        var compNum = FogModel.instance.getCompNum();
        if (Number(costNum) <= compNum) {
            this.costNum.color = "#000000";
        } else {
            this.costNum.color = "#ff0a06";
        }
    }
    setFormationGroup() {
        this.formationGroup.visible = true;
        this.rolePanel.vScrollBarSkin = "";
        var inlineRole = FogModel.instance.getLine();
        var allRole = RolesModel.instance.getUnlockRole();
        var leftNum = allRole.length - Object.keys(inlineRole).length >= 0 ? allRole.length - Object.keys(inlineRole).length : 0;
        //数量=玩家已解锁的角色-当前阵容中的角色
        this.leftRoleLab.text = leftNum + "";

        this.lineList = [];
        for (var key in inlineRole) {
            if (inlineRole.hasOwnProperty(key)) {
                var cfg = BattleFunc.instance.getCfgDatas("Role", key);
                if (cfg.kind == BattleConst.LIFE_JIDI) continue;
                this.lineList.push(cfg);
            }
        }
        var res = WindowManager.getUILoadGroup(WindowCfgs.FogRoleLineItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initFormationPanelData));

    }
    initFormationPanelData() {
        this.rolePanel.removeChildren();
        for (var i = 0; i < this.lineList.length; i++) {
            var item = this.lineList[i];
            var roleItem: FogRoleLineItemUI = new FogRoleLineItemUI(item, this, false);
            this.rolePanel.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
        }
    }
    onClickBusUpgrade() {
        this.checkGuide_1003_finish();
        var busLevel = FogModel.instance.getBusLevel();
        var busMaxLevel = FogFunc.instance.getBusMaxLevel();
        if (busLevel >= busMaxLevel) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_bus_full_level"));
            return;
        }

        var costNum = FogFunc.instance.getCfgDatasByKey("BusUpGrade", busLevel, "cost");
        this.costNum.text = StringUtils.getCoinStr(costNum + "");
        var compNum = FogModel.instance.getCompNum();
        if (Number(costNum) > compNum) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcomp"));
            return;
        }

        FogServer.upgradeBus({ "upLevel": 1, "upCost": costNum }, () => {
            //刷新按钮
            this.refreshUpgradeBtn();
            //刷新等级
            this.bussLevel.text = "Lv." + FogModel.instance.getBusLevel();
            //刷新属性
            this.refreshBusAttr();
            //刷新FogMainView红点
            Message.instance.send(FogEvent.FOGEVENT_REFRESH_BUS);
            //升级打点
            StatisticsManager.ins.onEvent(StatisticsManager.FOG_BUS_UPGRADE, { "level": FogModel.instance.getBusLevel() });
        }, this);
    }

    onClickUpgrade() {
        if (this.curTab == 0) return;
        this.curTab = 0;
        this.onClickTab(this.curTab);
    }
    onClickFormation() {
        if (this.curTab == 1) return;
        this.curTab = 1;
        this.onClickTab(this.curTab);
    }

    close() {
        WindowManager.CloseUI(WindowCfgs.FogBusUI);
        this.checkGuide_1004_finish();
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}