"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowCfgs = void 0;
const LoadingUI_1 = require("../view/loading/LoadingUI");
const LoginUI_1 = require("../view/login/LoginUI");
const AlertUILocal_1 = require("../view/popup/AlertUILocal");
const TipsUI_1 = require("../view/tip/TipsUI");
const ReqLoadingUI_1 = require("../view/loading/ReqLoadingUI");
const GameMainUI_1 = require("../view/main/GameMainUI");
const TestOpListUI_1 = require("../view/test/TestOpListUI");
const ResultJumpUI_1 = require("../view/jump/ResultJumpUI");
const BattleUI_1 = require("../view/battle/BattleUI");
const BattleResultUI_1 = require("../view/battle/BattleResultUI");
const RoleInfoUI_1 = require("../view/role/RoleInfoUI");
const RoleDetailUI_1 = require("../view/role/RoleDetailUI");
const GuideUI_1 = require("../view/guide/GuideUI");
const OfflineIncomeUI_1 = require("../view/main/OfflineIncomeUI");
const JumpListUI_1 = require("../view/jump/JumpListUI");
const TurnableUI_1 = require("../view/main/TurnableUI");
const ResultJumpDoubleUI_1 = require("../view/jump/ResultJumpDoubleUI");
const FreeResourceUI_1 = require("../view/main/FreeResourceUI");
const FlatItemUI_1 = require("../view/main/FlatItemUI");
const HomeUpgradeUI_1 = require("../view/role/HomeUpgradeUI");
const BattleDetailUI_1 = require("../view/battle/BattleDetailUI");
const RoleLineItemUI_1 = require("../view/roleLine/RoleLineItemUI");
const RoleItemUI_1 = require("../view/roleLine/RoleItemUI");
const RoleInLineUI_1 = require("../view/roleLine/RoleInLineUI");
const SevenDaysUI_1 = require("../view/main/SevenDaysUI");
const BoxInfoUI_1 = require("../view/main/BoxInfoUI");
const UnlockRoleUI_1 = require("../view/role/UnlockRoleUI");
const DailyGoldUI_1 = require("../view/main/DailyGoldUI");
const ComRewardDoubleUI_1 = require("../view/common/ComRewardDoubleUI");
const AirDropDetailUI_1 = require("../view/main/AirDropDetailUI");
const BattleFullEnergyUI_1 = require("../view/battle/BattleFullEnergyUI");
const InviteUI_1 = require("../view/share/InviteUI");
const InviteListUI_1 = require("../view/share/InviteListUI");
const RoleEquipmentUI_1 = require("../view/role/RoleEquipmentUI");
const EquipItemUI_1 = require("../view/role/EquipItemUI");
const EquipComposeUI_1 = require("../view/role/EquipComposeUI");
const EvoPreviewUI_1 = require("../view/role/EvoPreviewUI");
const EvoRewardUI_1 = require("../view/role/EvoRewardUI");
const EquipPieceGetUI_1 = require("../view/shop/EquipPieceGetUI");
const WindowCommonCfgs_1 = require("../../../framework/consts/WindowCommonCfgs");
const RoleBarrageUI_1 = require("../view/role/RoleBarrageUI");
const CartoonPicUI_1 = require("../view/cartoon/CartoonPicUI");
const FogCartoonPicUI_1 = require("../view/cartoon/FogCartoonPicUI");
const FogInitRoleUI_1 = require("../view/fog/FogInitRoleUI");
const FogRoleItemUI_1 = require("../view/fog/FogRoleItemUI");
const FogMainUI_1 = require("../view/fog/FogMainUI");
const FogVideoEnterUI_1 = require("../view/fog/FogVideoEnterUI");
const FogBusUI_1 = require("../view/fog/FogBusUI");
const FogBagUI_1 = require("../view/fog/FogBagUI");
const FogBagItemUI_1 = require("../view/fog/FogBagItemUI");
const FogBagItemDetailUI_1 = require("../view/fog/FogBagItemDetailUI");
const FogMultiRewardUI_1 = require("../view/fog/FogMultiRewardUI");
const FogShopUI_1 = require("../view/fog/FogShopUI");
const FogBusinessmanUI_1 = require("../view/fog/event/FogBusinessmanUI");
const FogComRewardUI_1 = require("../view/fog/event/FogComRewardUI");
const FogChooseUI_1 = require("../view/fog/event/FogChooseUI");
const FogAnswerUI_1 = require("../view/fog/event/FogAnswerUI");
const FogHandinUI_1 = require("../view/fog/event/FogHandinUI");
const FogBoxUI_1 = require("../view/fog/event/FogBoxUI");
const FogBagItemFullLevelUI_1 = require("../view/fog/event/FogBagItemFullLevelUI");
const FogFreeActUI_1 = require("../view/fog/FogFreeActUI");
const FogRoleLineItemUI_1 = require("../view/fog/FogRoleLineItemUI");
const FogUserRoleUI_1 = require("../view/fog/event/FogUserRoleUI");
const FogObstacleUI_1 = require("../view/fog/event/FogObstacleUI");
const FogNpcTalkUI_1 = require("../view/fog/event/FogNpcTalkUI");
const FogDoorUI_1 = require("../view/fog/event/FogDoorUI");
const FogTipUI_1 = require("../view/fog/FogTipUI");
const FogStartWarUI_1 = require("../view/fog/FogStartWarUI");
const FogResultRewardUI_1 = require("../view/fog/result/FogResultRewardUI");
const FogResultUI_1 = require("../view/fog/result/FogResultUI");
const FogRewardItemUI_1 = require("../view/fog/result/FogRewardItemUI");
const FogShopItemDetailUI_1 = require("../view/fog/FogShopItemDetailUI");
const ChangeDataUI_1 = require("../../../framework/view/changeData/ChangeDataUI");
const FogBattleStartAlertUI_1 = require("../view/fog/FogBattleStartAlertUI");
const SettingUI_1 = require("../view/main/SettingUI");
const SubPackageConst_1 = require("./SubPackageConst");
const ChapterListUI_1 = require("../view/chapter/ChapterListUI");
const ChapterMapUI_1 = require("../view/chapter/ChapterMapUI");
const ChapterBoxRewardUI_1 = require("../view/chapter/ChapterBoxRewardUI");
const TaskUI_1 = require("../view/task/TaskUI");
const DailyTaskUI_1 = require("../view/task/DailyTaskUI");
const TaskDoubleRewardUI_1 = require("../view/task/TaskDoubleRewardUI");
const ChatTaskUI_1 = require("../view/task/ChatTaskUI");
const ChatDetailUI_1 = require("../view/task/ChatDetailUI");
const ChatItemUI_1 = require("../view/task/ChatItemUI");
const ChatDialogUI_1 = require("../view/task/ChatDialogUI");
const MainJumpKariquUI_1 = require("../view/jump/MainJumpKariquUI");
const FogBattleReviveUI_1 = require("../view/fog/FogBattleReviveUI");
const OfflineRewardDoubleUI_1 = require("../view/main/OfflineRewardDoubleUI");
const ChapterBoxDoubleUI_1 = require("../view/chapter/ChapterBoxDoubleUI");
const BattleReviveUI_1 = require("../view/battle/BattleReviveUI");
const BattleUseSkillUI_1 = require("../view/battle/BattleUseSkillUI");
const BattleHelpRoleUI_1 = require("../view/battle/BattleHelpRoleUI");
const MainShopUI_1 = require("../view/shop/MainShopUI");
const MainShopItemUI_1 = require("../view/shop/MainShopItemUI");
const WorkDetailUI_1 = require("../view/work/WorkDetailUI");
const WorkRoleUI_1 = require("../view/work/WorkRoleUI");
const WorkRoleItemUI_1 = require("../view/work/WorkRoleItemUI");
const WorkCompanyUI_1 = require("../view/work/WorkCompanyUI");
class WindowCfgs {
    //窗口的一些配置参数配置, 比如 是否配置模板, 是否是全屏窗口,是否需要额外加载什么资源
    constructor() {
    }
    static get windowcfgs() {
        if (!this._windowcfgs) {
            this._windowcfgs = {
                //公共界面
                //资源加载界面
                [WindowCfgs.LoadingUI]: { modal: 1, path: LoadingUI_1.LoadingUI, modalAlpha: 0, position: 8, offset: [0, -100] },
                [WindowCfgs.ReqLoadingUI]: { modal: 1, path: ReqLoadingUI_1.default, parent: WindowCfgs.TOPLAYER, autoClose: true, modalAlpha: 0.01 },
                [WindowCfgs.AlertUILocal]: { modal: 1, path: AlertUILocal_1.default, parent: WindowCfgs.HIGHLAYER, autoClose: true, modalAlpha: 0.01 },
                [WindowCfgs.TestOpListUI]: { modal: 1, path: TestOpListUI_1.default, parent: WindowCfgs.HIGHLAYER, autoClose: true, modalAlpha: 0.01, group: ["gameui/test/TestOpList.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.LoginUI]: { modal: 1, path: LoginUI_1.default, parent: WindowCfgs.TOPLAYER, modalAlpha: 0.01, group: ["gameui/login/Login.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.TipsUI]: { modal: 1, path: TipsUI_1.default, modalAlpha: 0.01 },
                [WindowCfgs.ResultJumpUI]: { modal: 1, path: ResultJumpUI_1.default, modalAlpha: 0.01, group: ["gameui/jump/ResultJump.scene",], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.ResultJumpDoubleUI]: { modal: 1, path: ResultJumpDoubleUI_1.default, modalAlpha: 0.01, group: ["gameui/jump/ResultJumpDouble.scene",], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.JumpListUI]: { modal: 1, path: JumpListUI_1.default, modalAlpha: 0.01, group: ["gameui/jump/JumpList.scene",], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.GameMainUI]: { path: GameMainUI_1.default, group: ["native/GameMain.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.BattleUI]: { path: BattleUI_1.BattleUI, group: ["gameui/battle/Battle.scene"], subPackage: ["uisource", "atlas_source", "scene_battle01"], full: true },
                [WindowCfgs.BattleResultUI]: { modal: 1, path: BattleResultUI_1.default, modalAlpha: 0.8, group: ["gameui/battle/BattleResult.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleInfoUI]: { modal: 1, path: RoleInfoUI_1.default, modalAlpha: 0, group: ["gameui/role/RoleInfo.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FlatItemUI]: { modal: 1, path: FlatItemUI_1.default, modalAlpha: 0, group: ["gameui/main/FlatItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.HomeUpgradeUI]: { modal: 1, path: HomeUpgradeUI_1.default, modalAlpha: 0.6, group: ["gameui/role/HomeUpgrade.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleInLineUI]: { modal: 1, path: RoleInLineUI_1.default, modalAlpha: 0.9, group: ["gameui/roleLine/RoleInLine.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleItemUI]: { modal: 1, path: RoleItemUI_1.default, modalAlpha: 0, group: ["gameui/roleLine/RoleItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleLineItemUI]: { modal: 1, path: RoleLineItemUI_1.default, modalAlpha: 0, group: ["gameui/roleLine/RoleLineItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.SevenDaysUI]: { modal: 1, path: SevenDaysUI_1.default, parent: WindowCfgs.HIGHLAYER, modalAlpha: 0.6, group: ["gameui/main/SevenDays.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_equipicon] },
                [WindowCfgs.BattleDetailUI]: { path: BattleDetailUI_1.default, group: ["gameui/battle/BattleDetail.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.TurnableUI]: { modal: 1, path: TurnableUI_1.default, modalAlpha: 0.6, group: ["gameui/main/Turnable.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.BoxInfoUI]: { modal: 1, path: BoxInfoUI_1.default, modalAlpha: 0.6, group: ["gameui/main/BoxInfo.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FreeResourceUI]: { modal: 1, path: FreeResourceUI_1.default, modalAlpha: 0.6, group: ["gameui/main/FreeResource.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.GuideUI]: { modal: 1, path: GuideUI_1.default, modalAlpha: 0.01, group: ["gameui/guide/Guide.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.AirDropDetailUI]: { modal: 1, path: AirDropDetailUI_1.default, modalAlpha: 0.6, group: ["gameui/main/AirDropDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.OfflineIncomeUI]: { modal: 1, path: OfflineIncomeUI_1.default, parent: WindowCfgs.HIGHLAYER, modalAlpha: 0.6, group: ["gameui/main/OfflineIncome.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.ComRewardDoubleUI]: { modal: 1, path: ComRewardDoubleUI_1.default, parent: WindowCfgs.HIGHLAYER, modalAlpha: 0.6, group: ["gameui/common/ComRewardDouble.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.UnlockRoleUI]: { modal: 1, path: UnlockRoleUI_1.default, modalAlpha: 0.8, group: ["gameui/role/UnlockRole.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.BattleFullEnergyUI]: { modal: 1, path: BattleFullEnergyUI_1.default, modalAlpha: 0.6, group: ["gameui/battle/BattleFullEnergy.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.DailyGoldUI]: { modal: 1, path: DailyGoldUI_1.default, modalAlpha: 0.6, group: ["gameui/main/DailyGold.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.InviteUI]: { modal: 1, path: InviteUI_1.default, modalAlpha: 0.6, group: ["gameui/share/Invite.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.InviteListUI]: { modal: 1, path: InviteListUI_1.default, modalAlpha: 0, group: ["gameui/share/InviteList.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleDetailUI]: { modal: 1, path: RoleDetailUI_1.default, modalAlpha: 0.6, group: ["gameui/role/RoleDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleEquipmentUI]: { modal: 1, path: RoleEquipmentUI_1.default, modalAlpha: 0, group: ["gameui/role/RoleEquipment.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_equipicon] },
                [WindowCfgs.EquipItemUI]: { modal: 1, path: EquipItemUI_1.default, modalAlpha: 0, group: ["gameui/role/EquipItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EquipComposeUI]: { modal: 1, path: EquipComposeUI_1.default, modalAlpha: 0.6, group: ["gameui/role/EquipCompose.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EvoPreviewUI]: { modal: 1, path: EvoPreviewUI_1.default, modalAlpha: 0.6, group: ["gameui/role/EvoPreview.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EvoRewardUI]: { modal: 1, path: EvoRewardUI_1.default, modalAlpha: 0.8, group: ["gameui/role/EvoReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EquipPieceGetUI]: { modal: 1, path: EquipPieceGetUI_1.default, modalAlpha: 0.6, group: ["gameui/shop/EquipPieceGet.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_equipicon] },
                [WindowCfgs.RoleBarrageUI]: { modal: 1, path: RoleBarrageUI_1.default, modalAlpha: 0.9, group: ["gameui/role/RoleBarrage.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.CartoonPicUI]: { path: CartoonPicUI_1.default, group: ["gameui/cartoon/CartoonPic.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.FogCartoonPicUI]: { path: FogCartoonPicUI_1.default, group: ["gameui/cartoon/FogCartoonPic.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_expedition], full: true },
                [WindowCfgs.FogInitRoleUI]: { modal: 1, path: FogInitRoleUI_1.default, modalAlpha: 0.7, group: ["gameui/fog/FogInitRole.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogRoleItemUI]: { modal: 1, path: FogRoleItemUI_1.default, modalAlpha: 0, group: ["gameui/fog/FogRoleItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogMainUI]: { modal: 1, path: FogMainUI_1.default, modalAlpha: 0.01, group: ["gameui/fog/FogMain.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_expedition, SubPackageConst_1.default.packName_fogItem], full: true },
                [WindowCfgs.FogVideoEnterUI]: { modal: 1, path: FogVideoEnterUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogVideoEnter.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBusUI]: { modal: 1, path: FogBusUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBus.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagItemUI]: { modal: 0, path: FogBagItemUI_1.default, modalAlpha: 0, group: ["gameui/fog/FogBagItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagUI]: { modal: 1, path: FogBagUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBag.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagItemDetailUI]: { modal: 1, path: FogBagItemDetailUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBagItemDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogMultiRewardUI]: { modal: 1, path: FogMultiRewardUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogMultiReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogShopUI]: { modal: 1, path: FogShopUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogShop.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBusinessmanUI]: { modal: 1, path: FogBusinessmanUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBusinessman.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogComRewardUI]: { modal: 1, path: FogComRewardUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogComReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogChooseUI]: { modal: 1, path: FogChooseUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogChoose.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogAnswerUI]: { modal: 1, path: FogAnswerUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogAnswer.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogHandinUI]: { modal: 1, path: FogHandinUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogHandin.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBoxUI]: { modal: 1, path: FogBoxUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBox.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagItemFullLevelUI]: { modal: 1, path: FogBagItemFullLevelUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBagItemFullLevel.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogFreeActUI]: { modal: 1, path: FogFreeActUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogFreeAct.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogRoleLineItemUI]: { modal: 1, path: FogRoleLineItemUI_1.default, modalAlpha: 0, group: ["gameui/fog/FogRoleLineItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogUserRoleUI]: { modal: 1, path: FogUserRoleUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogUserRole.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogObstacleUI]: { modal: 1, path: FogObstacleUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogObstacle.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogNpcTalkUI]: { modal: 1, path: FogNpcTalkUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogNpcTalk.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_heroIconBig] },
                [WindowCfgs.FogDoorUI]: { modal: 1, path: FogDoorUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogDoor.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogTipUI]: { modal: 1, path: FogTipUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogTip.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogStartWarUI]: { modal: 1, path: FogStartWarUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogStartWar.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogResultRewardUI]: { modal: 1, path: FogResultRewardUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogResultReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogResultUI]: { modal: 1, path: FogResultUI_1.default, modalAlpha: 0.7, group: ["gameui/fog/FogResult.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogRewardItemUI]: { modal: 1, path: FogRewardItemUI_1.default, modalAlpha: 0, group: ["gameui/fog/FogRewardItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogShopItemDetailUI]: { modal: 1, path: FogShopItemDetailUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogShopItemDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBattleStartAlertUI]: { modal: 1, path: FogBattleStartAlertUI_1.default, modalAlpha: 0.6, group: ["gameui/fog/FogBattleStartAlert.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCommonCfgs_1.default.ChangeDataView]: { modal: 1, path: ChangeDataUI_1.default, modalAlpha: 0.01, group: ["gameui/changeData/ChangeData.scene"] },
                [WindowCfgs.SettingUI]: { modal: 1, path: SettingUI_1.default, modalAlpha: 0.6, group: ["gameui/main/Setting.scene"] },
                [WindowCfgs.ChapterListUI]: { path: ChapterListUI_1.default, group: ["gameui/chapter/ChapterList.scene"], full: true },
                [WindowCfgs.ChapterMapUI]: { path: ChapterMapUI_1.default, group: ["gameui/chapter/ChapterMap.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.ChapterBoxRewardUI]: { modal: 1, path: ChapterBoxRewardUI_1.default, modalAlpha: 0.6, group: ["gameui/chapter/ChapterBoxReward.scene"] },
                [WindowCfgs.ChapterBoxDoubleUI]: { modal: 1, path: ChapterBoxDoubleUI_1.default, modalAlpha: 0.6, group: ["gameui/chapter/ChapterBoxDouble.scene"] },
                [WindowCfgs.TaskUI]: { path: TaskUI_1.default, group: ["gameui/task/Task.scene"], full: true },
                [WindowCfgs.DailyTaskUI]: { path: DailyTaskUI_1.default, group: ["gameui/task/DailyTask.scene"] },
                [WindowCfgs.ChatTaskUI]: { path: ChatTaskUI_1.default, group: ["gameui/task/ChatTask.scene"] },
                [WindowCfgs.TaskDoubleRewardUI]: { modal: 1, modalAlpha: 0.6, path: TaskDoubleRewardUI_1.default, group: ["gameui/task/TaskDoubleReward.scene"] },
                [WindowCfgs.ChatDetailUI]: { modal: 1, modalAlpha: 0.6, path: ChatDetailUI_1.default, group: ["gameui/task/ChatDetail.scene"] },
                [WindowCfgs.ChatDialoglUI]: { path: ChatDialogUI_1.default, group: ["gameui/task/ChatDialog.scene"], full: true },
                [WindowCfgs.ChatItemUI]: { path: ChatItemUI_1.default, group: ["gameui/task/ChatItem.scene"] },
                [WindowCfgs.MainJumpKariquUI]: { modal: 1, path: MainJumpKariquUI_1.default, modalAlpha: 0.5, group: ["gameui/jump/MainJumpKariqu.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBattleReviveUI]: { modal: 1, modalAlpha: 0.6, path: FogBattleReviveUI_1.default, group: ["gameui/fog/FogBattleRevive.scene"] },
                [WindowCfgs.BattleReviveUI]: { modal: 1, modalAlpha: 0.6, path: BattleReviveUI_1.default, group: ["gameui/battle/BattleRevive.scene"] },
                [WindowCfgs.OfflineRewardDoubleUI]: { modal: 1, modalAlpha: 0.6, path: OfflineRewardDoubleUI_1.default, group: ["gameui/main/OfflineRewardDouble.scene"] },
                [WindowCfgs.BattleUseSkillUI]: { modal: 1, modalAlpha: 0.6, path: BattleUseSkillUI_1.default, group: ["gameui/battle/BattleUseSkill.scene"] },
                [WindowCfgs.BattleHelpRoleUI]: { modal: 1, modalAlpha: 0.6, path: BattleHelpRoleUI_1.default, group: ["gameui/battle/BattleHelpRole.scene"] },
                [WindowCfgs.MainShopUI]: { path: MainShopUI_1.default, group: ["gameui/shop/MainShop.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst_1.default.packName_equipicon] },
                [WindowCfgs.MainShopItemUI]: { path: MainShopItemUI_1.default, group: ["gameui/shop/MainShopItem.scene"] },
                [WindowCfgs.WorkDetailUI]: { path: WorkDetailUI_1.default, group: ["gameui/work/WorkDetail.scene"] },
                [WindowCfgs.WorkRoleUI]: { path: WorkRoleUI_1.default, group: ["gameui/work/WorkRole.scene", "gameui/work/WorkRoleItem.scene", "gameui/work/WorkInfoItem.scene"] },
                [WindowCfgs.WorkRoleItemUI]: { path: WorkRoleItemUI_1.default, group: ["gameui/work/WorkRoleItem.scene"] },
                [WindowCfgs.WorkCompanyUI]: { path: WorkCompanyUI_1.default, group: ["gameui/work/WorkCompany.scene"] },
            };
        }
        return this._windowcfgs;
    }
    ;
}
exports.WindowCfgs = WindowCfgs;
//缩放弹出效果
WindowCfgs.UISHOWTYPE_SCALEIN = 1;
// 透明度渐变进入
WindowCfgs.UISHOWTYPE_FADEIN = 2;
//UI层
WindowCfgs.UILAYER = "uilayer";
//顶层
WindowCfgs.TOPLAYER = "toplayer";
//网络异常弹窗界面 会盖住toplayer
WindowCfgs.HIGHLAYER = "highlayer";
//调试界面
WindowCfgs.DEBUGLAYER = "debugLayer";
//加载界面
WindowCfgs.LoadingUI = "LoadingControler";
//数据请求界面
WindowCfgs.ReqLoadingUI = "ReqLoadingUI";
//弹窗界面
WindowCfgs.AlertUILocal = "AlertUILocal";
WindowCfgs.AlertUI = "AlertUI";
//测试接口弹窗
WindowCfgs.TestOpListUI = "TestOpListUI";
//游戏系统ui
WindowCfgs.LoginUI = "LoginUI";
//引导界面
WindowCfgs.GuideUI = "GuideUI";
WindowCfgs.TipsUI = "TipsUI";
WindowCfgs.TalkFrameUI = "TalkFrameUI";
WindowCfgs.JumpListUI = "JumpListUI";
WindowCfgs.ResultJumpUI = "ResultJumpUI";
WindowCfgs.ResultJumpDoubleUI = "ResultJumpDoubleUI";
WindowCfgs.GameMainUI = "GameMainUI";
WindowCfgs.BattleUI = "BattleUI";
WindowCfgs.BattleResultUI = "BattleResultUI";
WindowCfgs.RoleInfoUI = "RoleInfoUI";
WindowCfgs.OfflineIncomeUI = "OfflineIncomeUI";
WindowCfgs.TurnableUI = "TurnableUI";
WindowCfgs.MainJumpZhiseUI = "MainJumpZhiseUI";
WindowCfgs.JumpListZhiseUI = "JumpListZhiseUI";
WindowCfgs.FreeResourceUI = "FreeResourceUI";
WindowCfgs.FlatItemUI = "FlatItemUI";
WindowCfgs.HomeUpgradeUI = "HomeUpgradeUI";
WindowCfgs.BattleDetailUI = "BattleDetailUI";
WindowCfgs.RoleInLineUI = "RoleInLineUI";
WindowCfgs.RoleItemUI = "RoleItemUI";
WindowCfgs.RoleLineItemUI = "RoleLineItemUI";
WindowCfgs.SevenDaysUI = "SevenDaysUI";
WindowCfgs.BoxInfoUI = "BoxInfoUI";
WindowCfgs.UnlockRoleUI = "UnlockRoleUI";
WindowCfgs.DailyGoldUI = "DailyGoldUI";
WindowCfgs.ComRewardDoubleUI = "ComRewardDoubleUI";
WindowCfgs.AirDropDetailUI = "AirDropDetailUI";
WindowCfgs.BattleFullEnergyUI = "BattleFullEnergyUI";
WindowCfgs.InviteUI = "InviteUI";
WindowCfgs.InviteListUI = "InviteListUI";
WindowCfgs.RoleDetailUI = "RoleDetailUI";
WindowCfgs.RoleEquipmentUI = "RoleEquipmentUI";
WindowCfgs.EquipItemUI = "EquipItemUI";
WindowCfgs.EquipComposeUI = "EquipComposeUI";
WindowCfgs.EvoPreviewUI = "EvoPreviewUI";
WindowCfgs.EvoRewardUI = "EvoRewardUI";
WindowCfgs.EquipPieceGetUI = "EquipPieceGetUI";
WindowCfgs.RoleBarrageUI = "RoleBarrageUI";
WindowCfgs.CartoonPicUI = "CartoonPicUI";
WindowCfgs.FogCartoonPicUI = "FogCartoonPicUI";
WindowCfgs.FogInitRoleUI = "FogInitRoleUI";
WindowCfgs.FogRoleItemUI = "FogRoleItemUI";
WindowCfgs.FogMainUI = "FogMainUI";
WindowCfgs.FogVideoEnterUI = "FogVideoEnterUI";
WindowCfgs.FogBusUI = "FogBusUI";
WindowCfgs.FogBagItemUI = "FogBagItemUI";
WindowCfgs.FogBagUI = "FogBagUI";
WindowCfgs.FogBagItemDetailUI = "FogBagItemDetailUI";
WindowCfgs.FogMultiRewardUI = "FogMultiRewardUI";
WindowCfgs.FogShopUI = "FogShopUI";
WindowCfgs.FogBusinessmanUI = "FogBusinessmanUI";
WindowCfgs.FogComRewardUI = "FogComRewardUI";
WindowCfgs.FogChooseUI = "FogChooseUI";
WindowCfgs.FogAnswerUI = "FogAnswerUI";
WindowCfgs.FogHandinUI = "FogHandinUI";
WindowCfgs.FogBoxUI = "FogBoxUI";
WindowCfgs.FogBagItemFullLevelUI = "FogBagItemFullLevelUI";
WindowCfgs.FogFreeActUI = "FogFreeActUI";
WindowCfgs.FogRoleLineItemUI = "FogRoleLineItemUI";
WindowCfgs.FogUserRoleUI = "FogUserRoleUI";
WindowCfgs.FogObstacleUI = "FogObstacleUI";
WindowCfgs.FogNpcTalkUI = "FogNpcTalkUI";
WindowCfgs.FogDoorUI = "FogDoorUI";
WindowCfgs.FogTipUI = "FogTipUI";
WindowCfgs.FogStartWarUI = "FogStartWarUI";
WindowCfgs.FogResultUI = "FogResultUI";
WindowCfgs.FogResultRewardUI = "FogResultRewardUI";
WindowCfgs.FogRewardItemUI = "FogRewardItemUI";
WindowCfgs.FogShopItemDetailUI = "FogShopItemDetailUI";
WindowCfgs.FogBattleStartAlertUI = "FogBattleStartAlertUI";
WindowCfgs.SettingUI = "SettingUI";
WindowCfgs.ChapterListUI = "ChapterListUI";
WindowCfgs.ChapterMapUI = "ChapterMapUI";
WindowCfgs.ChapterBoxRewardUI = "ChapterBoxRewardUI";
WindowCfgs.ChapterBoxDoubleUI = "ChapterBoxDoubleUI";
WindowCfgs.TaskUI = "TaskUI";
WindowCfgs.DailyTaskUI = "DailyTaskUI";
WindowCfgs.ChatTaskUI = "ChatTaskUI";
WindowCfgs.TaskDoubleRewardUI = "TaskDoubleRewardUI";
WindowCfgs.ChatDetailUI = "ChatDetailUI";
WindowCfgs.ChatDialoglUI = "ChatDialoglUI";
WindowCfgs.ChatItemUI = "ChatItemUI";
WindowCfgs.MainJumpKariquUI = "MainJumpKariquUI";
WindowCfgs.FogBattleReviveUI = "FogBattleReviveUI";
WindowCfgs.BattleReviveUI = "BattleReviveUI";
WindowCfgs.OfflineRewardDoubleUI = "OfflineRewardDoubleUI";
WindowCfgs.BattleUseSkillUI = "BattleUseSkillUI";
WindowCfgs.BattleHelpRoleUI = "BattleHelpRoleUI";
WindowCfgs.MainShopUI = "MainShopUI";
WindowCfgs.MainShopItemUI = "MainShopItemUI";
WindowCfgs.WorkDetailUI = "WorkDetailUI";
WindowCfgs.WorkRoleUI = "WorkRoleUI";
WindowCfgs.WorkRoleItemUI = "WorkRoleItemUI";
WindowCfgs.WorkCompanyUI = "WorkCompanyUI";
//通用配置,如果不配置 就没有
WindowCfgs.commonCfgs = {
    modal: 1,
    modalAlpha: 0.3,
    parent: WindowCfgs.UILAYER,
    offset: [0, 0],
    full: false,
    group: [],
    sound: true,
    autoClose: false,
    style: 0,
    cache: false,
};
//# sourceMappingURL=WindowCfgs.js.map