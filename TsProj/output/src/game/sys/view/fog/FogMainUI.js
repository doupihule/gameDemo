"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const FogModel_1 = require("../../model/FogModel");
const FogFunc_1 = require("../../func/FogFunc");
const FogServer_1 = require("../../server/FogServer");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const FogLogicalControler_1 = require("../../../fog/controler/FogLogicalControler");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const Message_1 = require("../../../../framework/common/Message");
const FogEvent_1 = require("../../event/FogEvent");
const FogConst_1 = require("../../consts/FogConst");
const UserExtModel_1 = require("../../model/UserExtModel");
const UserExtServer_1 = require("../../server/UserExtServer");
const RolesFunc_1 = require("../../func/RolesFunc");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const UserModel_1 = require("../../model/UserModel");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
/**迷雾街区主界面 */
class FogMainUI extends layaMaxUI_1.ui.gameui.fog.FogMainUI {
    constructor() {
        super();
        //层数
        this.layer = 1;
        this.initBtn();
        this.addEvent();
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
    }
    addEvent() {
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_BUS, this);
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_COMP, this);
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_ACT, this);
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_GUIDE, this);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.busBtn, this.onClickBus, this);
        new ButtonUtils_1.ButtonUtils(this.exitBtn, this.onClickExit, this);
        new ButtonUtils_1.ButtonUtils(this.bagBtn, this.onClickBag, this);
        new ButtonUtils_1.ButtonUtils(this.shopBtn, this.onClickShop, this);
        new ButtonUtils_1.ButtonUtils(this.addActBtn, this.onClickAddAct, this);
    }
    //初始化
    setData(data) {
        this.layer = FogModel_1.default.instance.getCurLayer() + 1;
        var allLayer = FogFunc_1.default.instance.getAllLayer();
        if (this.layer > allLayer) {
            this.layer = allLayer;
        }
        this.nowForce = RolesFunc_1.default.instance.getAllRoleForce();
        this.syncMyForce();
        this.initTop();
        this.initCell();
        //刷新大巴车按钮
        this.refreshBus();
        this.refreshShop();
        if (data && data.quickShowGuide) {
            this.showGuide_601();
        }
        //重登检测首场战斗引导
        this.fogControler.showGuide_701();
        //重登检测捡道具引导
        this.fogControler.showGuide_901();
        //重登检测升级大巴车
        this.showGuide_1001();
        //重登检测行动力引导
        this.showGuide_1101();
    }
    //同步战力
    syncMyForce() {
        var saveForce = UserExtModel_1.default.instance.getRoleForce();
        if (this.nowForce > saveForce) {
        }
        else {
            this.nowForce = saveForce;
        }
        FogServer_1.default.syncForce({ force: this.nowForce }, (result) => {
            if (!result || result.error) {
                LogsManager_1.default.echo("zm.向服务器同步战力失败");
            }
            //本地记录
            UserExtServer_1.default.saveMyForce({ force: this.nowForce });
        }, this);
    }
    /**初始化顶部信息 */
    initTop() {
        var act = FogModel_1.default.instance.getActNum();
        if (act == 0) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_START);
        }
        else {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_ENTER);
        }
        var cellData = FogModel_1.default.instance.getCellInfo();
        if (cellData) {
            this.actNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getActNum() + "");
        }
        else {
            var cfg = FogFunc_1.default.instance.getCfgDatas("Layer", this.layer);
            FogServer_1.default.addSourceCount({ type: DataResourceFunc_1.DataResourceType.ACT, count: cfg.mobility }, () => {
                this.actNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getActNum() + "");
            }, this);
        }
        this.conNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getCompNum() + "");
        this.layerTxt.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_layerTxt", null, this.layer);
        this.forceNum.text = StringUtils_1.default.getCoinStr(this.nowForce + "");
    }
    onClickAddAct() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogFreeActUI, { noExit: 1 });
    }
    refreshAct() {
        this.actNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getActNum() + "");
    }
    refreshComp() {
        this.conNum.text = StringUtils_1.default.getCoinStr(FogModel_1.default.instance.getCompNum() + "");
    }
    //初始化格子
    initCell() {
        this.fogControler = new FogLogicalControler_1.default(this.cellCtn, this);
        this.fogControler.setData(this.layer);
    }
    onClickBus() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBusUI, { "tab": 0 });
    }
    onClickBag() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogBagUI);
    }
    onClickShop() {
        //判断今日是否首次进入迷雾
        if (!UserExtModel_1.default.instance.checkFirstEnterFog()) {
            UserExtServer_1.default.setDailyFirstEnterFog(1, () => {
                this.shopRedImg.visible = false;
            }, this);
        }
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogShopUI, { "id": "1", "type": FogConst_1.default.FOG_SHOP_TYPE_OUTER });
    }
    refreshShop() {
        this.shopRedImg.visible = false;
        //判断今日是否首次进入迷雾
        if (!UserExtModel_1.default.instance.checkFirstEnterFog()) {
            this.shopRedImg.visible = true;
        }
    }
    refreshBus() {
        this.busRedImg.visible = false;
        var busLevel = FogModel_1.default.instance.getBusLevel();
        var costNum = FogFunc_1.default.instance.getCfgDatasByKey("BusUpGrade", busLevel, "cost");
        var compNum = FogModel_1.default.instance.getCompNum();
        var busMaxLevel = FogFunc_1.default.instance.getBusMaxLevel();
        if (busLevel < busMaxLevel && Number(costNum) <= compNum) {
            this.busRedImg.visible = true;
        }
        this.busLevelTxt.text = "Lv." + busLevel;
    }
    onClickExit() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { type: FogConst_1.default.FOG_VIEW_TYPE_EXIT_FOG });
    }
    //移动引导
    showGuide_601() {
        if (UserModel_1.default.instance.getMainGuide() == 9) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_6_601, GuideManager_1.default.GuideType.None);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_6_601, this.checkGuide_601_finish, this);
        }
    }
    checkGuide_601_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_6_601, this.showGuide_602, this, false);
    }
    showGuide_602() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_6_602, GuideManager_1.default.GuideType.None);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_6_602, this.checkGuide_602_finish, this);
    }
    checkGuide_602_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_6_602, this.showGuide_603, this, false);
    }
    showGuide_603() {
        var targetCell = this.fogControler.getCellData("3_2");
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_6_603, GuideManager_1.default.GuideType.Static, targetCell, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_6_603, null, this);
    }
    //显示点击大巴车引导
    showGuide_1001() {
        if (UserModel_1.default.instance.getMainGuide() == 12) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10_1001, GuideManager_1.default.GuideType.Static, this.busImg, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10_1001, this.checkGuide_1001_finish, this);
        }
    }
    checkGuide_1001_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_10_1001, this.onClickBus, this, false);
    }
    //行动力引导
    showGuide_1101() {
        if (UserModel_1.default.instance.getMainGuide() == 13) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_11_1101, GuideManager_1.default.GuideType.Static, this.actGroup, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_11_1101, this.checkGuide_1101_finish, this);
        }
    }
    checkGuide_1101_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_11_1101, this.showGuide_1102, this, false);
    }
    showGuide_1102() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_11_1102, GuideManager_1.default.GuideType.Static, this.exitImg, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_11_1102, this.checkGuide_1102_finish, this);
    }
    checkGuide_1102_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_11_1102, this.showGuide_1103, this, false);
    }
    showGuide_1103() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_11_1103, GuideManager_1.default.GuideType.Static, this.exitImg, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_11_1103, this.checkGuide_1103_finish, this);
    }
    checkGuide_1103_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_11_1103, null, null, true);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogMainUI);
    }
    clear() {
    }
    dispose() {
    }
    freshGuide(data) {
        if (data == GuideConst_1.default.GUIDE_6_601) {
            this.showGuide_601();
        }
        else if (data == GuideConst_1.default.GUIDE_10_1001) {
            this.showGuide_1001();
        }
        else if (data == GuideConst_1.default.GUIDE_11_1101) {
            this.showGuide_1101();
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            //刷新大巴车按钮
            case FogEvent_1.default.FOGEVENT_REFRESH_BUS:
                this.refreshBus();
                break;
            //刷新零件
            case FogEvent_1.default.FOGEVENT_REFRESH_COMP:
                this.refreshComp();
                this.refreshBus();
                break;
            //刷新行动力    
            case FogEvent_1.default.FOGEVENT_REFRESH_ACT:
                this.refreshAct();
                break;
            case FogEvent_1.default.FOGEVENT_REFRESH_GUIDE:
                this.freshGuide(data);
                break;
        }
    }
}
exports.default = FogMainUI;
//# sourceMappingURL=FogMainUI.js.map