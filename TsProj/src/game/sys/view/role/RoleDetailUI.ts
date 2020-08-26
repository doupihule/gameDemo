import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import RoleInfoUI from "./RoleInfoUI";
import RoleEquipmentUI from "./RoleEquipmentUI";
import RolesModel from "../../model/RolesModel";
import RolesFunc from "../../func/RolesFunc";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import UserModel from "../../model/UserModel";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import StringUtils from "../../../../framework/utils/StringUtils";
import UserExtModel from "../../model/UserExtModel";
import RedPointConst from "../../consts/RedPointConst";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";


export default class RoleDetailUI extends ui.gameui.role.RoleDetailUI implements IMessage {

    private curTab = 0;
    private id;
    private roleGroup: RoleInfoUI;
    private equipGroup: RoleEquipmentUI;
    constructor() {
        super();
        this.initBtn();
        this.addEvent();

        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
    }
    addEvent() {
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
    }
    initBtn() {
        new ButtonUtils(this.btn_close, this.close, this);
        new ButtonUtils(this.roleBtn, this.onClickRole, this);
        new ButtonUtils(this.equipBtn, this.onClickEquip, this);
        new ButtonUtils(this.addCoinBtn, this.onTurnableBtnClick, this);
        new ButtonUtils(this.addGoldBtn, this.onTurnableBtnClick, this);

        if (UserExtModel.instance.checkIsTurnableShow()) {
            this.addCoinBtn.visible = true;
            this.addGoldBtn.visible = true;
        } else {
            this.addCoinBtn.visible = false;
            this.addGoldBtn.visible = false;
        }

    }
    public setData(data) {
        this.curTab = data.tab || 0;
        this.id = data.id;
        if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_4_403) {
            this.curTab = 1;
        } else {
            BannerAdManager.addBannerQuick(this);
            if (!this.checkGuide_203()) {
                AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_RoleDetail, this);
            }
        }
        this.freshEquBtn();
        this.onClickTab(this.curTab);
        //货币初始化
        this.refreshMoney();
    }
    onTurnableBtnClick() {
        WindowManager.OpenUI(WindowCfgs.TurnableUI);
    }
    /**检测是否显示角色解锁引导 */
    checkGuide_203() {
        if (RolesFunc.instance.getUnlockLevel(this.id) == 1 && UserModel.instance.getMainGuide() == 2 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_202) {
            return true;
        }
        return false;
    }
    //货币刷新
    public refreshMoney() {
        this.coinNum.changeText(StringUtils.getCoinStr(UserModel.instance.getCoin()));
        this.goldNum.changeText(StringUtils.getCoinStr(UserModel.instance.getGold()));
    }
    freshEquBtn() {
        //判断角色是否解锁
        var role = RolesModel.instance.getIsHaveRole(this.id);
        if (!role) {
            this.equipBtn.visible = false;
            return;
        }
        var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock")
        if (UserModel.instance.getMaxBattleLevel() < unlock) {
            this.equipBtn.visible = false;
            return;
        } else {
            this.equipBtn.visible = true;
        }
        this.freshEquipRed();
    }
    //刷新装备红点
    freshEquipRed() {
        this.equipRed.visible = false;
        if (!this.equipBtn.visible) return;
        var starLevel = RolesModel.instance.getRoleStarLevel(this.id);
        if (starLevel == 5) return;
        var starInfo = RolesFunc.instance.getCfgDatasByKey("RoleStar", this.id, starLevel + 1);
        var equip = starInfo.equipId;
        for (var i = 0; i < equip.length; i++) {
            var state = RolesFunc.instance.getEquipState(this.id, equip[i], true);
            if (state == RolesFunc.STATE_CANCOMPOSE) {
                this.equipRed.visible = true;
                break;
            }
        }

    }
    onClickRole() {
        if (this.curTab == 0) return;
        this.curTab = 0;
        this.onClickTab(this.curTab)
    }
    onClickEquip() {
        if (this.curTab == 1) return;
        this.curTab = 1;
        this.onClickTab(this.curTab)
    }
    private onClickTab(index) {
        this.roleBtn.skin = (index == 0) ? "uisource/equip/equip/equip_image_biaoqian1.png" : "uisource/equip/equip/equip_image_biaoqian2.png";
        this.equipBtn.skin = (index == 1) ? "uisource/equip/equip/equip_image_biaoqian1.png" : "uisource/equip/equip/equip_image_biaoqian2.png";
        if (index == 0) {
            this.setRoleGroup();
        } else {
            this.setEquipGroup();

        }
    }
    //升级
    setRoleGroup() {
        if (!this.roleGroup) {
            var res = WindowManager.getUILoadGroup(WindowCfgs.RoleInfoUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.roleGroup = WindowManager.getUIClass(WindowCfgs.RoleInfoUI);
                this.ctn.addChild(this.roleGroup);
                this.roleGroup.setData(this.id, this);
            }));
        } else {
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
            var res = WindowManager.getUILoadGroup(WindowCfgs.RoleEquipmentUI) || [];
            var resAll = [];
            for (var url of res) {
                resAll.push(url);
            }
            LoadManager.instance.load(resAll, Laya.Handler.create(this, () => {
                this.equipGroup = WindowManager.getUIClass(WindowCfgs.RoleEquipmentUI);
                this.ctn.addChild(this.equipGroup);
                this.equipGroup.setData(this.id, this);
            }));
        } else {
            this.equipGroup.visible = true;
            this.equipGroup.setData(this.id, this);
        }
        if (this.roleGroup) {
            this.roleGroup.visible = false;
        }
    }
    //关闭合成引导
    showGuide_407() {
        if (UserModel.instance.getMainGuide() == 6 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_4_406) {
            GuideManager.ins.setGuideData(GuideConst.GUIDE_4_407, GuideManager.GuideType.Static, this.btn_close, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_407, this.showGuide_407_finish, this)
        }
    }
    showGuide_407_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_4_407, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            this.close();
        }, this, true)
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.RoleDetailUI);
        BannerAdManager.hideBanner(this["windowName"])
        if (this.roleGroup) {
            this.roleGroup.close();
        }
        if (this.equipGroup) {
            this.equipGroup.close();
        }
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, GuideConst.GUIDE_4_408)
        Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_TASKRED)
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            //刷新货币、红点
            case GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshMoney();
                break;

        }
    }
}