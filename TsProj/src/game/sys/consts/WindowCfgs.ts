import { LoadingUI } from "../view/loading/LoadingUI";
import LoginUI from "../view/login/LoginUI";
import AlertUILocal from "../view/popup/AlertUILocal";
import TipsUI from "../view/tip/TipsUI";
import ReqLoadingUI from "../view/loading/ReqLoadingUI";
import GameMainUI from "../view/main/GameMainUI";
import TestOpListUI from "../view/test/TestOpListUI";
import ResultJumpUI from "../view/jump/ResultJumpUI";
import { BattleUI } from "../view/battle/BattleUI";
import BattleResultUI from "../view/battle/BattleResultUI";
import RoleInfoUI from "../view/role/RoleInfoUI";
import RoleDetailUI from "../view/role/RoleDetailUI";
import GuideUI from "../view/guide/GuideUI";
import OfflineIncomeUI from "../view/main/OfflineIncomeUI";
import JumpListUI from "../view/jump/JumpListUI";
import TurnableUI from "../view/main/TurnableUI";
import MainJumpZhiseUI from "../view/jump/MainJumpZhiseUI";
import JumpListZhiseUI from "../view/jump/JumpListZhiseUI";
import ResultJumpDoubleUI from "../view/jump/ResultJumpDoubleUI";
import FreeResourceUI from "../view/main/FreeResourceUI";
import FlatItemUI from "../view/main/FlatItemUI";
import HomeUpgradeUI from "../view/role/HomeUpgradeUI";
import BattleDetailUI from "../view/battle/BattleDetailUI";
import RoleLineItemUI from "../view/roleLine/RoleLineItemUI";
import RoleItemUI from "../view/roleLine/RoleItemUI";
import RoleInLineUI from "../view/roleLine/RoleInLineUI";
import SevenDaysUI from "../view/main/SevenDaysUI";
import BoxInfoUI from "../view/main/BoxInfoUI";
import UnlockRoleUI from "../view/role/UnlockRoleUI";
import DailyGoldUI from "../view/main/DailyGoldUI";
import ComRewardDoubleUI from "../view/common/ComRewardDoubleUI";
import AirDropDetailUI from "../view/main/AirDropDetailUI";
import BattleFullEnergyUI from "../view/battle/BattleFullEnergyUI";
import InviteUI from "../view/share/InviteUI";
import InviteListUI from "../view/share/InviteListUI";
import RoleEquipmentUI from "../view/role/RoleEquipmentUI";
import EquipItemUI from "../view/role/EquipItemUI";
import EquipComposeUI from "../view/role/EquipComposeUI";
import EvoPreviewUI from "../view/role/EvoPreviewUI";
import EvoRewardUI from "../view/role/EvoRewardUI";
import EquipPieceGetUI from "../view/shop/EquipPieceGetUI";
import TableUtils from "../../../framework/utils/TableUtils";
import WindowCommonCfgs from "../../../framework/consts/WindowCommonCfgs";
import RoleBarrageUI from "../view/role/RoleBarrageUI";
import CartoonPicUI from "../view/cartoon/CartoonPicUI";
import FogCartoonPicUI from "../view/cartoon/FogCartoonPicUI";
import FogInitRoleUI from "../view/fog/FogInitRoleUI";
import FogRoleItemUI from "../view/fog/FogRoleItemUI";
import FogMainUI from "../view/fog/FogMainUI";
import FogVideoEnterUI from "../view/fog/FogVideoEnterUI";
import FogBusUI from "../view/fog/FogBusUI";
import FogBagUI from "../view/fog/FogBagUI";
import FogBagItemUI from "../view/fog/FogBagItemUI";
import FogBagItemDetailUI from "../view/fog/FogBagItemDetailUI";
import FogMultiRewardUI from "../view/fog/FogMultiRewardUI";
import FogShopUI from "../view/fog/FogShopUI";
import FogBusinessmanUI from "../view/fog/event/FogBusinessmanUI";
import FogComRewardUI from "../view/fog/event/FogComRewardUI";
import FogChooseUI from "../view/fog/event/FogChooseUI";
import FogAnswerUI from "../view/fog/event/FogAnswerUI";
import FogHandinUI from "../view/fog/event/FogHandinUI";
import FogBoxUI from "../view/fog/event/FogBoxUI";
import FogBagItemFullLevelUI from "../view/fog/event/FogBagItemFullLevelUI";
import FogFreeActUI from "../view/fog/FogFreeActUI";
import FogRoleLineItemUI from "../view/fog/FogRoleLineItemUI";
import FogUserRoleUI from "../view/fog/event/FogUserRoleUI";
import FogObstacleUI from "../view/fog/event/FogObstacleUI";
import FogNpcTalkUI from "../view/fog/event/FogNpcTalkUI";
import FogDoorUI from "../view/fog/event/FogDoorUI";
import FogTipUI from "../view/fog/FogTipUI";
import FogStartWarUI from "../view/fog/FogStartWarUI"; import FogResultRewardUI from "../view/fog/result/FogResultRewardUI";
import FogResultUI from "../view/fog/result/FogResultUI";
import FogRewardItemUI from "../view/fog/result/FogRewardItemUI";
import FogShopItemDetailUI from "../view/fog/FogShopItemDetailUI";
import ChangeDataUI from "../../../framework/view/changeData/ChangeDataUI";
import FogBattleStartAlertUI from "../view/fog/FogBattleStartAlertUI";
import SettingUI from "../view/main/SettingUI";
import SubPackageConst from "./SubPackageConst";
import ChapterListUI from "../view/chapter/ChapterListUI";
import ChapterListItemUI from "../view/chapter/ChapterListItemUI";
import ChapterMapUI from "../view/chapter/ChapterMapUI";
import ChapterBoxRewardUI from "../view/chapter/ChapterBoxRewardUI";
import TaskUI from "../view/task/TaskUI";
import DailyTaskUI from "../view/task/DailyTaskUI";
import TaskDoubleRewardUI from "../view/task/TaskDoubleRewardUI";
import ChatTaskUI from "../view/task/ChatTaskUI";
import ChatDetailUI from "../view/task/ChatDetailUI";
import ChatItemUI from "../view/task/ChatItemUI";
import ChatDialogUI from "../view/task/ChatDialogUI";
import MainJumpKariquUI from "../view/jump/MainJumpKariquUI";
import FogBattleReviveUI from "../view/fog/FogBattleReviveUI";
import OfflineRewardDoubleUI from "../view/main/OfflineRewardDoubleUI";
import ChapterBoxDoubleUI from "../view/chapter/ChapterBoxDoubleUI";
import BattleReviveUI from "../view/battle/BattleReviveUI";
import BattleUseSkillUI from "../view/battle/BattleUseSkillUI";
import BattleHelpRoleUI from "../view/battle/BattleHelpRoleUI";
import MainShopUI from "../view/shop/MainShopUI";
import MainShopItemUI from "../view/shop/MainShopItemUI";
import WorkDetailUI from "../view/work/WorkDetailUI";
import WorkRoleUI from "../view/work/WorkRoleUI";
import WorkRoleItemUI from "../view/work/WorkRoleItemUI";
import WorkCompanyUI from "../view/work/WorkCompanyUI";

export class WindowCfgs {

    //窗口的一些配置参数配置, 比如 是否配置模板, 是否是全屏窗口,是否需要额外加载什么资源
    public constructor() {
    }

    //缩放弹出效果
    static UISHOWTYPE_SCALEIN: number = 1;
    // 透明度渐变进入
    static UISHOWTYPE_FADEIN: number = 2;

    //UI层
    static UILAYER: string = "uilayer";
    //顶层
    static TOPLAYER: string = "toplayer";

    //网络异常弹窗界面 会盖住toplayer
    static HIGHLAYER: string = "highlayer";
    //调试界面
    static DEBUGLAYER: string = "debugLayer";



    //加载界面
    static LoadingUI: string = "LoadingControler";
    //数据请求界面
    static ReqLoadingUI: string = "ReqLoadingUI";
    //弹窗界面
    static AlertUILocal: string = "AlertUILocal";
    static AlertUI: string = "AlertUI";

    //测试接口弹窗
    static TestOpListUI: string = "TestOpListUI";

    //游戏系统ui
    static LoginUI: string = "LoginUI";
    //引导界面
    static GuideUI: string = "GuideUI"

    static TipsUI: string = "TipsUI";
    static TalkFrameUI: string = "TalkFrameUI";
    static JumpListUI: string = "JumpListUI";
    static ResultJumpUI: string = "ResultJumpUI";
    static ResultJumpDoubleUI: string = "ResultJumpDoubleUI";
    static GameMainUI: string = "GameMainUI";
    static BattleUI: string = "BattleUI";
    static BattleResultUI: string = "BattleResultUI";
    static RoleInfoUI: string = "RoleInfoUI";
    static OfflineIncomeUI: string = "OfflineIncomeUI";
    static TurnableUI: string = "TurnableUI";
    static MainJumpZhiseUI: string = "MainJumpZhiseUI";
    static JumpListZhiseUI: string = "JumpListZhiseUI";
    static FreeResourceUI: string = "FreeResourceUI";
    static FlatItemUI: string = "FlatItemUI";
    static HomeUpgradeUI: string = "HomeUpgradeUI";
    static BattleDetailUI: string = "BattleDetailUI";
    static RoleInLineUI: string = "RoleInLineUI";
    static RoleItemUI: string = "RoleItemUI";
    static RoleLineItemUI: string = "RoleLineItemUI";
    static SevenDaysUI: string = "SevenDaysUI";
    static BoxInfoUI: string = "BoxInfoUI";
    static UnlockRoleUI: string = "UnlockRoleUI";
    static DailyGoldUI: string = "DailyGoldUI";
    static ComRewardDoubleUI: string = "ComRewardDoubleUI";
    static AirDropDetailUI: string = "AirDropDetailUI";
    static BattleFullEnergyUI: string = "BattleFullEnergyUI";
    static InviteUI: string = "InviteUI";
    static InviteListUI: string = "InviteListUI";
    static RoleDetailUI: string = "RoleDetailUI";
    static RoleEquipmentUI: string = "RoleEquipmentUI";
    static EquipItemUI: string = "EquipItemUI";
    static EquipComposeUI: string = "EquipComposeUI";
    static EvoPreviewUI: string = "EvoPreviewUI";
    static EvoRewardUI: string = "EvoRewardUI";
    static EquipPieceGetUI: string = "EquipPieceGetUI";
    static RoleBarrageUI: string = "RoleBarrageUI";
    static CartoonPicUI: string = "CartoonPicUI";
    static FogCartoonPicUI: string = "FogCartoonPicUI";
    static FogInitRoleUI: string = "FogInitRoleUI";
    static FogRoleItemUI: string = "FogRoleItemUI";
    static FogMainUI: string = "FogMainUI";
    static FogVideoEnterUI: string = "FogVideoEnterUI";
    static FogBusUI: string = "FogBusUI";
    static FogBagItemUI: string = "FogBagItemUI";
    static FogBagUI: string = "FogBagUI";
    static FogBagItemDetailUI: string = "FogBagItemDetailUI";
    static FogMultiRewardUI: string = "FogMultiRewardUI";
    static FogShopUI: string = "FogShopUI";
    static FogBusinessmanUI: string = "FogBusinessmanUI";
    static FogComRewardUI: string = "FogComRewardUI";
    static FogChooseUI: string = "FogChooseUI";
    static FogAnswerUI: string = "FogAnswerUI";
    static FogHandinUI: string = "FogHandinUI";
    static FogBoxUI: string = "FogBoxUI";
    static FogBagItemFullLevelUI: string = "FogBagItemFullLevelUI";
    static FogFreeActUI: string = "FogFreeActUI";
    static FogRoleLineItemUI: string = "FogRoleLineItemUI";
    static FogUserRoleUI: string = "FogUserRoleUI";
    static FogObstacleUI: string = "FogObstacleUI";
    static FogNpcTalkUI: string = "FogNpcTalkUI";
    static FogDoorUI: string = "FogDoorUI";
    static FogTipUI: string = "FogTipUI";
    static FogStartWarUI: string = "FogStartWarUI";
    static FogResultUI: string = "FogResultUI";
    static FogResultRewardUI: string = "FogResultRewardUI";
    static FogRewardItemUI: string = "FogRewardItemUI";
    static FogShopItemDetailUI: string = "FogShopItemDetailUI";
    static FogBattleStartAlertUI: string = "FogBattleStartAlertUI";
    static SettingUI: string = "SettingUI";
    static ChapterListUI: string = "ChapterListUI";
    static ChapterMapUI: string = "ChapterMapUI";
    static ChapterBoxRewardUI: string = "ChapterBoxRewardUI";
    static ChapterBoxDoubleUI: string = "ChapterBoxDoubleUI";
    static TaskUI: string = "TaskUI";
    static DailyTaskUI: string = "DailyTaskUI";
    static ChatTaskUI: string = "ChatTaskUI";
    static TaskDoubleRewardUI: string = "TaskDoubleRewardUI";
    static ChatDetailUI: string = "ChatDetailUI";
    static ChatDialoglUI: string = "ChatDialoglUI";
    static ChatItemUI: string = "ChatItemUI";
    static MainJumpKariquUI: string = "MainJumpKariquUI";
    static FogBattleReviveUI: string = "FogBattleReviveUI";
    static BattleReviveUI: string = "BattleReviveUI";
    static OfflineRewardDoubleUI: string = "OfflineRewardDoubleUI";
    static BattleUseSkillUI: string = "BattleUseSkillUI";
    static BattleHelpRoleUI: string = "BattleHelpRoleUI";
    static MainShopUI: string = "MainShopUI";
    static MainShopItemUI: string = "MainShopItemUI";
    static WorkDetailUI: string = "WorkDetailUI";
    static WorkRoleUI: string = "WorkRoleUI";
    static WorkRoleItemUI: string = "WorkRoleItemUI";
    static WorkCompanyUI: string = "WorkCompanyUI";
    //通用配置,如果不配置 就没有
    static commonCfgs: any = {
        modal: 1,	//ui默认是有模态的,
        modalAlpha: 0.3,		//默认模态透明度为0.3
        parent: WindowCfgs.UILAYER,	//parent 默认是UI层,如果有特殊层级, 在windowcfgs里面指定
        offset: [0, 0],					//坐标偏移, 默认是没有偏移的
        full: false,		//默认不是全屏ui
        group: [],		//需要加载的服务器资源组,
        sound: true,     //是否播放打开音效 ,默认是播放的
        autoClose: false,    //是否点击空白地方自动关闭
        style: 0,    //ui打开显示方式,默认为0,没有任何效果, UISHOWTYPE_SCALEIN
        cache: false,       //是否关闭ui时 缓存,不做dispos,重新打开的时候 做pop, 默认不缓存,原则上缓存的ui需要重写 onSelfPop函数

    }

    //窗口参数设置.
    /**
     * key 就是对应ui类的类名
     * modal: 是否显示半透模态, 0表示不显示,1表示显示, 默认是显示模态的 
     * modalAlpha: 模态透明度, 默认120
     * bg: 背景图片,只配置背景图片名称不需要带后缀.如果给这个ui配置了背景, 那么这个ui就一定是全屏的full会强制为true.model就不需要创建了
     * full: 特殊的是否指定是全屏ui, 可选
     * style:打开方式 0 是硬开, 1是透明度渐变打开,2 fadetIn...后续扩展
     * group:需要加载的资源组名 默认为空.
     * group3d,需要加载的3D资源名,默认为空
     * path:  对应view的类对方
     */
    static _windowcfgs: any;
    static get windowcfgs() {
        if (!this._windowcfgs) {
            this._windowcfgs = {
                //公共界面
                //资源加载界面
                [WindowCfgs.LoadingUI]: { modal: 1, path: LoadingUI, modalAlpha: 0, position: 8, offset: [0, -100] },
                [WindowCfgs.ReqLoadingUI]: { modal: 1, path: ReqLoadingUI, parent: WindowCfgs.TOPLAYER, autoClose: true, modalAlpha: 0.01 },
                [WindowCfgs.AlertUILocal]: { modal: 1, path: AlertUILocal, parent: WindowCfgs.HIGHLAYER, autoClose: true, modalAlpha: 0.01 },
                [WindowCfgs.TestOpListUI]: { modal: 1, path: TestOpListUI, parent: WindowCfgs.HIGHLAYER, autoClose: true, modalAlpha: 0.01, group: ["gameui/test/TestOpList.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.LoginUI]: { modal: 1, path: LoginUI, parent: WindowCfgs.TOPLAYER, modalAlpha: 0.01, group: ["gameui/login/Login.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.TipsUI]: { modal: 1, path: TipsUI, modalAlpha: 0.01 },
                [WindowCfgs.ResultJumpUI]: { modal: 1, path: ResultJumpUI, modalAlpha: 0.01, group: ["gameui/jump/ResultJump.scene",], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.ResultJumpDoubleUI]: { modal: 1, path: ResultJumpDoubleUI, modalAlpha: 0.01, group: ["gameui/jump/ResultJumpDouble.scene",], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.JumpListUI]: { modal: 1, path: JumpListUI, modalAlpha: 0.01, group: ["gameui/jump/JumpList.scene",], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.GameMainUI]: { path: GameMainUI, group: ["native/GameMain.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.BattleUI]: { path: BattleUI, group: ["gameui/battle/Battle.scene"], subPackage: ["uisource", "atlas_source", "scene_battle01"], full: true },
                [WindowCfgs.BattleResultUI]: { modal: 1, path: BattleResultUI, modalAlpha: 0.8, group: ["gameui/battle/BattleResult.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleInfoUI]: { modal: 1, path: RoleInfoUI, modalAlpha: 0, group: ["gameui/role/RoleInfo.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FlatItemUI]: { modal: 1, path: FlatItemUI, modalAlpha: 0, group: ["gameui/main/FlatItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.HomeUpgradeUI]: { modal: 1, path: HomeUpgradeUI, modalAlpha: 0.6, group: ["gameui/role/HomeUpgrade.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleInLineUI]: { modal: 1, path: RoleInLineUI, modalAlpha: 0.9, group: ["gameui/roleLine/RoleInLine.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleItemUI]: { modal: 1, path: RoleItemUI, modalAlpha: 0, group: ["gameui/roleLine/RoleItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleLineItemUI]: { modal: 1, path: RoleLineItemUI, modalAlpha: 0, group: ["gameui/roleLine/RoleLineItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.SevenDaysUI]: { modal: 1, path: SevenDaysUI, parent: WindowCfgs.HIGHLAYER, modalAlpha: 0.6, group: ["gameui/main/SevenDays.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst.packName_equipicon] },
                [WindowCfgs.BattleDetailUI]: { path: BattleDetailUI, group: ["gameui/battle/BattleDetail.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.TurnableUI]: { modal: 1, path: TurnableUI, modalAlpha: 0.6, group: ["gameui/main/Turnable.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.BoxInfoUI]: { modal: 1, path: BoxInfoUI, modalAlpha: 0.6, group: ["gameui/main/BoxInfo.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FreeResourceUI]: { modal: 1, path: FreeResourceUI, modalAlpha: 0.6, group: ["gameui/main/FreeResource.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.GuideUI]: { modal: 1, path: GuideUI, modalAlpha: 0.01, group: ["gameui/guide/Guide.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.AirDropDetailUI]: { modal: 1, path: AirDropDetailUI, modalAlpha: 0.6, group: ["gameui/main/AirDropDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.OfflineIncomeUI]: { modal: 1, path: OfflineIncomeUI, parent: WindowCfgs.HIGHLAYER, modalAlpha: 0.6, group: ["gameui/main/OfflineIncome.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.ComRewardDoubleUI]: { modal: 1, path: ComRewardDoubleUI, parent: WindowCfgs.HIGHLAYER, modalAlpha: 0.6, group: ["gameui/common/ComRewardDouble.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.UnlockRoleUI]: { modal: 1, path: UnlockRoleUI, modalAlpha: 0.8, group: ["gameui/role/UnlockRole.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.BattleFullEnergyUI]: { modal: 1, path: BattleFullEnergyUI, modalAlpha: 0.6, group: ["gameui/battle/BattleFullEnergy.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.DailyGoldUI]: { modal: 1, path: DailyGoldUI, modalAlpha: 0.6, group: ["gameui/main/DailyGold.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.InviteUI]: { modal: 1, path: InviteUI, modalAlpha: 0.6, group: ["gameui/share/Invite.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.InviteListUI]: { modal: 1, path: InviteListUI, modalAlpha: 0, group: ["gameui/share/InviteList.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleDetailUI]: { modal: 1, path: RoleDetailUI, modalAlpha: 0.6, group: ["gameui/role/RoleDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.RoleEquipmentUI]: { modal: 1, path: RoleEquipmentUI, modalAlpha: 0, group: ["gameui/role/RoleEquipment.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst.packName_equipicon] },
                [WindowCfgs.EquipItemUI]: { modal: 1, path: EquipItemUI, modalAlpha: 0, group: ["gameui/role/EquipItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EquipComposeUI]: { modal: 1, path: EquipComposeUI, modalAlpha: 0.6, group: ["gameui/role/EquipCompose.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EvoPreviewUI]: { modal: 1, path: EvoPreviewUI, modalAlpha: 0.6, group: ["gameui/role/EvoPreview.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EvoRewardUI]: { modal: 1, path: EvoRewardUI, modalAlpha: 0.8, group: ["gameui/role/EvoReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.EquipPieceGetUI]: { modal: 1, path: EquipPieceGetUI, modalAlpha: 0.6, group: ["gameui/shop/EquipPieceGet.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst.packName_equipicon] },
                [WindowCfgs.RoleBarrageUI]: { modal: 1, path: RoleBarrageUI, modalAlpha: 0.9, group: ["gameui/role/RoleBarrage.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.CartoonPicUI]: { path: CartoonPicUI, group: ["gameui/cartoon/CartoonPic.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.FogCartoonPicUI]: { path: FogCartoonPicUI, group: ["gameui/cartoon/FogCartoonPic.scene"], subPackage: ["uisource", "atlas_source",SubPackageConst.packName_expedition], full: true },
                [WindowCfgs.FogInitRoleUI]: { modal: 1, path: FogInitRoleUI, modalAlpha: 0.7, group: ["gameui/fog/FogInitRole.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogRoleItemUI]: { modal: 1, path: FogRoleItemUI, modalAlpha: 0, group: ["gameui/fog/FogRoleItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogMainUI]: { modal: 1, path: FogMainUI, modalAlpha: 0.01, group: ["gameui/fog/FogMain.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst.packName_expedition, SubPackageConst.packName_fogItem], full: true },
                [WindowCfgs.FogVideoEnterUI]: { modal: 1, path: FogVideoEnterUI, modalAlpha: 0.6, group: ["gameui/fog/FogVideoEnter.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBusUI]: { modal: 1, path: FogBusUI, modalAlpha: 0.6, group: ["gameui/fog/FogBus.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagItemUI]: { modal: 0, path: FogBagItemUI, modalAlpha: 0, group: ["gameui/fog/FogBagItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagUI]: { modal: 1, path: FogBagUI, modalAlpha: 0.6, group: ["gameui/fog/FogBag.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagItemDetailUI]: { modal: 1, path: FogBagItemDetailUI, modalAlpha: 0.6, group: ["gameui/fog/FogBagItemDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogMultiRewardUI]: { modal: 1, path: FogMultiRewardUI, modalAlpha: 0.6, group: ["gameui/fog/FogMultiReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogShopUI]: { modal: 1, path: FogShopUI, modalAlpha: 0.6, group: ["gameui/fog/FogShop.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBusinessmanUI]: { modal: 1, path: FogBusinessmanUI, modalAlpha: 0.6, group: ["gameui/fog/FogBusinessman.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogComRewardUI]: { modal: 1, path: FogComRewardUI, modalAlpha: 0.6, group: ["gameui/fog/FogComReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogChooseUI]: { modal: 1, path: FogChooseUI, modalAlpha: 0.6, group: ["gameui/fog/FogChoose.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogAnswerUI]: { modal: 1, path: FogAnswerUI, modalAlpha: 0.6, group: ["gameui/fog/FogAnswer.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogHandinUI]: { modal: 1, path: FogHandinUI, modalAlpha: 0.6, group: ["gameui/fog/FogHandin.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBoxUI]: { modal: 1, path: FogBoxUI, modalAlpha: 0.6, group: ["gameui/fog/FogBox.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBagItemFullLevelUI]: { modal: 1, path: FogBagItemFullLevelUI, modalAlpha: 0.6, group: ["gameui/fog/FogBagItemFullLevel.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogFreeActUI]: { modal: 1, path: FogFreeActUI, modalAlpha: 0.6, group: ["gameui/fog/FogFreeAct.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogRoleLineItemUI]: { modal: 1, path: FogRoleLineItemUI, modalAlpha: 0, group: ["gameui/fog/FogRoleLineItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogUserRoleUI]: { modal: 1, path: FogUserRoleUI, modalAlpha: 0.6, group: ["gameui/fog/FogUserRole.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogObstacleUI]: { modal: 1, path: FogObstacleUI, modalAlpha: 0.6, group: ["gameui/fog/FogObstacle.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogNpcTalkUI]: { modal: 1, path: FogNpcTalkUI, modalAlpha: 0.6, group: ["gameui/fog/FogNpcTalk.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst.packName_heroIconBig] },
                [WindowCfgs.FogDoorUI]: { modal: 1, path: FogDoorUI, modalAlpha: 0.6, group: ["gameui/fog/FogDoor.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogTipUI]: { modal: 1, path: FogTipUI, modalAlpha: 0.6, group: ["gameui/fog/FogTip.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogStartWarUI]: { modal: 1, path: FogStartWarUI, modalAlpha: 0.6, group: ["gameui/fog/FogStartWar.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogResultRewardUI]: { modal: 1, path: FogResultRewardUI, modalAlpha: 0.6, group: ["gameui/fog/FogResultReward.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogResultUI]: { modal: 1, path: FogResultUI, modalAlpha: 0.7, group: ["gameui/fog/FogResult.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogRewardItemUI]: { modal: 1, path: FogRewardItemUI, modalAlpha: 0, group: ["gameui/fog/FogRewardItem.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogShopItemDetailUI]: { modal: 1, path: FogShopItemDetailUI, modalAlpha: 0.6, group: ["gameui/fog/FogShopItemDetail.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBattleStartAlertUI]: { modal: 1, path: FogBattleStartAlertUI, modalAlpha: 0.6, group: ["gameui/fog/FogBattleStartAlert.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCommonCfgs.ChangeDataView]: { modal: 1, path: ChangeDataUI, modalAlpha: 0.01, group: ["gameui/changeData/ChangeData.scene"] },
                [WindowCfgs.SettingUI]: { modal: 1, path: SettingUI, modalAlpha: 0.6, group: ["gameui/main/Setting.scene"] },
                [WindowCfgs.ChapterListUI]: { path: ChapterListUI, group: ["gameui/chapter/ChapterList.scene"], full: true },
                [WindowCfgs.ChapterMapUI]: { path: ChapterMapUI, group: ["gameui/chapter/ChapterMap.scene"], subPackage: ["uisource", "atlas_source"], full: true },
                [WindowCfgs.ChapterBoxRewardUI]: { modal: 1, path: ChapterBoxRewardUI, modalAlpha: 0.6, group: ["gameui/chapter/ChapterBoxReward.scene"] },
                [WindowCfgs.ChapterBoxDoubleUI]: { modal: 1, path: ChapterBoxDoubleUI, modalAlpha: 0.6, group: ["gameui/chapter/ChapterBoxDouble.scene"] },
                [WindowCfgs.TaskUI]: { path: TaskUI, group: ["gameui/task/Task.scene"], full: true },
                [WindowCfgs.DailyTaskUI]: { path: DailyTaskUI, group: ["gameui/task/DailyTask.scene"] },
                [WindowCfgs.ChatTaskUI]: { path: ChatTaskUI, group: ["gameui/task/ChatTask.scene"] },
                [WindowCfgs.TaskDoubleRewardUI]: { modal: 1, modalAlpha: 0.6, path: TaskDoubleRewardUI, group: ["gameui/task/TaskDoubleReward.scene"] },
                [WindowCfgs.ChatDetailUI]: { modal: 1, modalAlpha: 0.6, path: ChatDetailUI, group: ["gameui/task/ChatDetail.scene"] },
                [WindowCfgs.ChatDialoglUI]: { path: ChatDialogUI, group: ["gameui/task/ChatDialog.scene"], full: true },
                [WindowCfgs.ChatItemUI]: { path: ChatItemUI, group: ["gameui/task/ChatItem.scene"] },
                [WindowCfgs.MainJumpKariquUI]: { modal: 1, path: MainJumpKariquUI, modalAlpha: 0.5, group: ["gameui/jump/MainJumpKariqu.scene"], subPackage: ["uisource", "atlas_source"] },
                [WindowCfgs.FogBattleReviveUI]: { modal: 1, modalAlpha: 0.6, path: FogBattleReviveUI, group: ["gameui/fog/FogBattleRevive.scene"] },
                [WindowCfgs.BattleReviveUI]: { modal: 1, modalAlpha: 0.6, path: BattleReviveUI, group: ["gameui/battle/BattleRevive.scene"] },
                [WindowCfgs.OfflineRewardDoubleUI]: { modal: 1, modalAlpha: 0.6, path: OfflineRewardDoubleUI, group: ["gameui/main/OfflineRewardDouble.scene"] },
                [WindowCfgs.BattleUseSkillUI]: { modal: 1, modalAlpha: 0.6, path: BattleUseSkillUI, group: ["gameui/battle/BattleUseSkill.scene"] },
                [WindowCfgs.BattleHelpRoleUI]: { modal: 1, modalAlpha: 0.6, path: BattleHelpRoleUI, group: ["gameui/battle/BattleHelpRole.scene"] },
                [WindowCfgs.MainShopUI]: { path: MainShopUI, group: ["gameui/shop/MainShop.scene"], subPackage: ["uisource", "atlas_source", SubPackageConst.packName_equipicon] },
                [WindowCfgs.MainShopItemUI]: { path: MainShopItemUI, group: ["gameui/shop/MainShopItem.scene"] },
                [WindowCfgs.WorkDetailUI]: { path: WorkDetailUI, group: ["gameui/work/WorkDetail.scene"] },
                [WindowCfgs.WorkRoleUI]: { path: WorkRoleUI, group: ["gameui/work/WorkRole.scene", "gameui/work/WorkRoleItem.scene", "gameui/work/WorkInfoItem.scene"] },
                [WindowCfgs.WorkRoleItemUI]: { path: WorkRoleItemUI, group: ["gameui/work/WorkRoleItem.scene"] },
                [WindowCfgs.WorkCompanyUI]: { path: WorkCompanyUI, group: ["gameui/work/WorkCompany.scene"] },
            }

        }
        return this._windowcfgs;
    };

}    
