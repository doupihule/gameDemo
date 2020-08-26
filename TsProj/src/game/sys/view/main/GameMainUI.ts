import { ui } from "../../../../ui/layaMaxUI";
import Message from "../../../../framework/common/Message";
import IMessage from "../../interfaces/IMessage";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import RolesModel from "../../model/RolesModel";
import RolesFunc from "../../func/RolesFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import UserModel from "../../model/UserModel";
import GameSwitch from "../../../../framework/common/GameSwitch";
import GameMainEvent from "../../event/GameMainEvent";
import BattleEvent from "../../event/BattleEvent";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import StatisticsManager from "../../manager/StatisticsManager";
import SubPackageConst from "../../consts/SubPackageConst";
import Client from "../../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import SoundManager from "../../../../framework/manager/SoundManager";
import { MusicConst } from "../../consts/MusicConst";
import BattleServer from "../../server/BattleServer";
import UtilsServer from "../../server/UtilsServer";
import StringUtils from "../../../../framework/utils/StringUtils";
import GameUtils from "../../../../utils/GameUtils";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import { WindowCfgs } from "../../consts/WindowCfgs";
import UserExtModel from "../../model/UserExtModel";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import JumpManager from "../../../../framework/manager/JumpManager";
import JumpConst from "../../consts/JumpConst";
import { LoadManager } from "../../../../framework/manager/LoadManager";
import StatisticsCommonConst from "../../../../framework/consts/StatisticsCommonConst";
import FlatItemUI from "../main/FlatItemUI";
import RoleEvent from "../../event/RoleEvent";
import UserEvent from "../../event/UserEvent";
import { DataResourceType } from "../../func/DataResourceFunc";
import CountsModel from "../../model/CountsModel";
import DailyDiamondFunc from "../../func/DailyDiamondFunc";
import DailyGoldModel from "../../model/DailyGoldModel";
import SevenDayModel from "../../model/SevenDayModel";
import UserExtServer from "../../server/UserExtServer";
import BattleFunc from "../../func/BattleFunc";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import LevelFunc from "../../func/LevelFunc";
import ResourceConst from "../../consts/ResourceConst";
import UserInfo from "../../../../framework/common/UserInfo";
import RedPointConst from "../../consts/RedPointConst";
import ChangeDataUI from "../../../../framework/view/changeData/ChangeDataUI";
import WindowCommonCfgs from "../../../../framework/consts/WindowCommonCfgs";
import FogModel from "../../model/FogModel";
import CountsServer from "../../server/CountsServer";
import FogFunc from "../../func/FogFunc";
import FogConst from "../../consts/FogConst";
import BattleConst from "../../consts/BattleConst";
import LogsManager from "../../../../framework/manager/LogsManager";
import SwitchModel from "../../model/SwitchModel";
import ChapterFunc from "../../func/ChapterFunc";
import BattleTweenControler from "../../../battle/controler/BattleTweenControler";
import { ResourceShowUI } from "./ResourceShowUI";
import ChapterModel from "../../model/ChapterModel";
import VideoAdvEvent from "../../../../framework/event/VideoAdvEvent";
import TaskServer from "../../server/TaskServer";
import TaskConditionTrigger from "../../trigger/TaskConditionTrigger";
import TaskFunc from "../../func/TaskFunc";
import TaskModel from "../../model/TaskModel";
import TaskConst from "../../consts/TaskConst";
import TaskChatFunc from "../../func/TaskChatFunc";
import TweenAniManager from "../../manager/TweenAniManager";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import WindowEvent from "../../../../framework/event/WindowEvent";
import KariqiShareManager from "../../../../framework/manager/KariqiShareManager";
import GameConsts from "../../consts/GameConsts";
import WorkModel from "../../model/WorkModel";
import WorkFunc from "../../func/WorkFunc";
import WorkEvent from "../../event/WorkEvent";
import DisplayUtils from "../../../../framework/utils/DisplayUtils";
import MainJumpReturnComp from "../../../../framework/platform/comp/MainJumpReturnComp";

export default class GameMainUI extends ui.native.GameMainUI implements IMessage {



    //角色说话定时器相关
    private roleSpeakTimer: number = 0;
    private roleSpeakTimerStamp = 0;

    private mainTimer: number = 0;

    //角色数组
    private roleData;
    //角色id在楼层中的pos数组
    private roleIdToFlatTable = [];
    //楼层高度
    private flatHeight = 420;
    private lastSpeakRole;

    //弹窗检测相关
    private _isShowPop = false;
    private _popTeam = {};
    /**默认是不显示解锁新角色引导  只有最大关卡发生改变才检测 */
    private isShowUnlock = false;

    public airDropView: Laya.Image;
    thisWidth: number = 224;
    thisHeigth: number = 254;
    initX: number = -50;
    initY: number = 250;
    /**开始时间戳 */
    startTime: number;
    /**总持续时间 */
    totalLife: number;
    /**剩余时间 */
    nowLife: number;
    private setInfo;
    public resouceShow: ResourceShowUI;
    private noReadCount = 0;
    public isInit = false;
    private isShowTaskGuide = true;
    private timeCount = 0;
    private battleGuideLevel = 0;
    private flatAreaHeight: number = 0;
    private timeArr;
    constructor() {
        super();
        this.createChildren();
        //事件监听
        this.addEvent();
        // 初始化按钮
        this.initBtn();
        this.lastSpeakRole = "";


        StatisticsManager.onLoadingLog();
        if (UserModel.instance.checkIsOld()) {
            StatisticsManager.ins.onEvent(StatisticsCommonConst.LOADING_2);
        } else {
            UtilsServer.setIsOldFlag(() => {
                StatisticsManager.ins.onEvent(StatisticsCommonConst.NEW_LOADING_2);
            }, this);
        }
        //第一次加载主场景发送事件时还未监听 如果有上一步结算引导 默认本次检测角色的解锁
        if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_201) {
            this.isShowUnlock = true;
        }
        //刘海屏适配
        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.middleGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.flatArea, ScreenAdapterTools.Align_MiddleTop);
        // 动态调整列表长度
        this.flatAreaHeight = 980 + ScreenAdapterTools.height - ScreenAdapterTools.designHeight - ScreenAdapterTools.toolBarWidth
        this.flatArea.height = this.flatAreaHeight
        this.flatArea.vScrollBarSkin = "";

        TimerManager.instance.setTimeout(this.loadRes, this, 3000)
        this.addCD();
        this.resouceShow = new ResourceShowUI(this.coinNum, this.goldNum, this.powerCountLab, this.powerTimerLab, this.addCoinBtn, this.addGoldBtn, this.addSpBtn);
        this.battleGuideLevel = GlobalParamsFunc.instance.getDataNum("battleGuideLevel")
        this.timeArr = WorkFunc.instance.getTodayExpireTime()
    }
    addCD() {
        var cd = new Laya.Label("CD");
        cd.fontSize = 50;
        cd.color = "#ff0400";
        WindowManager.topUILayer.addChild(cd);
        cd.x = 100;
        cd.y = 200;
        cd.visible = GameSwitch.checkOnOff(GameSwitch.SWITCH_CD_DEBUG);
        new ButtonUtils(cd, this.onClickCD, this);
    }
    //后台加载资源
    loadRes() {
        LoadManager.instance.load("res/atlas/fog/fog.atlas")
        LoadManager.instance.load("res/atlas/fog/fog.png")
        // SubPackageManager.loadDynamics(["scene_battle01", "scene_battle02", "scene_battle03", "scene_chapter_01", "scene_chapter_02"], []);
        SubPackageManager.loadDynamics([SubPackageConst.packName_equipicon, SubPackageConst.packName_expedition, SubPackageConst.packName_fogItem], []);
    }
    createChildren() {
        super.createChildren();
    }

    initBtn() {
        //gm按钮
        this.gmBtn.visible = GameSwitch.checkOnOff(GameSwitch.SWITCH_GM_DEBUG);
        new ButtonUtils(this.gmBtn, this.onClickGM, this);
        //开始游戏
        new ButtonUtils(this.gameStartBtn, this.onGameStartBtnClick, this);

        //退出游戏
        // if (!JumpManager.checkShow()) {
        //     this.returnBtn.visible = false;
        // } else {
        //     this.returnBtn.visible = true;
        //     new ButtonUtils(this.returnBtn, this.onClickExit, this);
        //     TweenAniManager.instance.scaleQipaoAni(this.returnRed)
        // }

        new ButtonUtils(this.turnableBtn, this.onTurnableBtnClick, this);

        //免费钻石
        new ButtonUtils(this.freeGoldBtn, this.clickFreeGold, this);

        new ButtonUtils(this.inviteBtn, this.onClickInvite, this);
        new ButtonUtils(this.signBtn, this.onClickSign, this);
        new ButtonUtils(this.flatBtn, this.onClickFlat, this);
        new ButtonUtils(this.formationBtn, this.onClickFormation, this);
        new ButtonUtils(this.fogBtn, this.onClickFog, this);

        //离线收益
        new ButtonUtils(this.offlineRewardGroup, this.onClickOfflineBtn, this);

        //如果禁掉了分享 微信、QQ显示
        if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_SHARE_NEW) || !(UserInfo.isWeb() || UserInfo.isWX() || UserInfo.isQQGame())) {
            this.inviteBtn.visible = false;
        } else {
            this.inviteBtn.visible = true;
            new ButtonUtils(this.inviteBtn, this.onClickInvite, this);
        }
        new ButtonUtils(this.equipBtn, this.onClickEquip, this);
        new ButtonUtils(this.settimgBtn, this.onClickSet, this);
        new ButtonUtils(this.taskBtn, this.onClickTask, this);
        new ButtonUtils(this.chatTaskGroup, this.onClickTask, this);
        new ButtonUtils(this.workBtn, this.onClickWork, this);

    }
    /**添加事件监听 */
    addEvent() {
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
        Message.instance.add(BattleEvent.BATTLEEVENT_BATTLESTART, this);
        Message.instance.add(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLELEVEL, this)
        Message.instance.add(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK, this);
        Message.instance.add(RoleEvent.ROLE_EVENT_GAMEMAIN_FALT_REDPOINT, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_STAGE, this);
        Message.instance.add(UserEvent.USER_SP_CHANGE, this);
        Message.instance.add(RoleEvent.ROLE_EVENT_GAMEMAIN_ROLE_INLINE, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_REFRESH_DAILYGOLD, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_REFRESH_AIRDROP, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_DESTORY_AIRDROP, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, this);
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FOG_REDPOINT, this);
        Message.instance.add(VideoAdvEvent.VIDEOADV_EVENT_ADV_SUCCESS, this);
        Message.instance.add(WindowEvent.WINDOW_EVENT_SWITCHUIFIN, this);
        Message.instance.add(GameMainEvent.GAMEMIAN_EVENT_CHECKPOP, this);
        Message.instance.add(WorkEvent.WORK_REPUTE_UPDATE, this);

    }
    hideTurnQipao() {
        this.turnQipao.visible = false;
        Laya.Tween.clearAll(this.turnQipao);
    }
    turnQipaoTween() {
        this.turnQipao.rotation = 0;
        Laya.Tween.to(this.turnQipao, { rotation: 30 }, 500, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.turnQipao, { rotation: 0 }, 500, null, Laya.Handler.create(this, () => {
                this.turnQipaoTween();
            }));

        }));
    }
    public setData(data): void {
        SoundManager.playBGM(MusicConst.SOUND_MAIN_BG);
        SoundManager.setMusicVol(SwitchModel.instance.getSwitchByType(SwitchModel.music_switch))
        this.setInfo = data;
        this.noReadCount = 0;
        this.isShowTaskGuide = true;
        //红点
        this.flatRedPoint.visible = false;
        this.inviteRedPoint.visible = false;

        this.lastSpeakRole = "";
        this.roleSpeakTimerStamp = Client.instance.serverTime;
        this.freshBtnState();
        this.freshTaskShow();
        //货币初始化
        this.resouceShow.refreshMoney();

        // 初始化体力
        this.resouceShow.countPower();

        //公寓初始化
        this.initFlatPanel();

        //红点刷新
        this.refreshRedPoint();

        //免费钻石
        this.freshFreeGold();

        //七登按钮
        this.freshSevenIcon();
        this.freshTurnTable();
        this.freshOfflineIcon();

        this.freshEquipRed();
        this.freshLineRed();
        this.showGuide_408();
        this.freshEnterRed();

        //迷雾街区初始化
        this.initFog();
        this.refreshFogRedPoint();
        this.freshChatTaskRed();
        if (!this.mainTimer) {
            this.mainTimer = TimerManager.instance.add(this.checkMainTimer, this, 1000);
        }
        this.checkGuide_501();
        if (!this.isInit) {
            //弹各种弹框
            this.checkIsShowPop();
        } else {
            this.showTaskGuide()
        }
        this.isInit = true;
        this.resetStartGuide();
        this.freshWorkRed();
        this.freshCompanyRed();
        MainJumpReturnComp.instance.showJumpReturnBtn(this);
    }
    /**刷新一些按钮的状态 */
    freshBtnState() {
        var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock");
        var level = UserModel.instance.getMaxBattleLevel()
        if (level < unlock) {
            this.equipBtn.gray = true;
        } else {
            this.equipBtn.gray = false;
        }
        if (level < FogFunc.instance.getFogOpenLevel()) {
            this.fogBtn.gray = true;
        } else {
            this.fogBtn.gray = false;
        }
        this.freshWorkBtn(level);

    }
    freshWorkBtn(level = null) {
        if (!level) {
            level = UserModel.instance.getMaxBattleLevel()
        }
        var workLevel = GlobalParamsFunc.instance.getDataNum("workOpenLevel");
        if (level < workLevel) {
            this.workBtn.visible = false;
        } else {
            this.workBtn.visible = true;
        }
    }
    //转盘
    freshTurnTable() {
        this.turnableBtn.visible = false;
        var luckyPlateLevel = GlobalParamsFunc.instance.getDataNum("luckyPlateLevel");
        var curMaxLevel = UserExtModel.instance.getMaxLevel();
        if (Number(curMaxLevel) + 1 >= luckyPlateLevel) {
            var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_TURNABLE);
            var maxFreeCount = GlobalParamsFunc.instance.getDataNum("luckyPlateFreeNub");
            var nowCount = CountsModel.instance.getCountsById(CountsModel.freeTurnableCount);
            Laya.Tween.clearTween(this.turnQipao);
            if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
                if (nowCount < maxFreeCount) {
                    this.turnableBtn.visible = true;
                    this.turnQipao.visible = true;
                    this.turnQipaoTween();
                } else {
                    this.hideTurnQipao();
                }
            } else {
                this.turnableBtn.visible = true;
                //判断是否有免费次数
                if (nowCount < maxFreeCount) {
                    this.turnQipao.visible = true;
                    this.turnQipaoTween();
                } else {
                    this.hideTurnQipao();
                }
            }
        }
        //加金币、钻石
        if (this.turnableBtn.visible) {
            this.addCoinBtn.visible = true;
            this.addGoldBtn.visible = true;

        } else {
            this.addCoinBtn.visible = false;
            this.addGoldBtn.visible = false;
        }

    }
    /**刷新打工红点 */
    freshWorkRed() {
        if (!this.workBtn.visible) return
        this.workRedImg.visible = false;
        var workInfo = WorkModel.instance.getWorkInfo();
        var isCanReceive = false;
        for (var key in workInfo) {
            if (WorkModel.instance.getIsCanReceive(key)) {
                isCanReceive = true;
                this.workRedImg.visible = true;
                break;
            }
        }
        if (!isCanReceive) {
            if (this.timeArr.indexOf(Client.instance.serverTime) != -1) {
                this.workRedImg.visible = true;
                return;
            }
        }

    }
    freshCompanyRed() {
        if (this.workRedImg.visible) return;
        this.workRedImg.visible = WorkModel.instance.getIsCanUpCompany();
    }
    //检测迷雾街区功能开启引导
    checkGuide_501() {
        if (UserModel.instance.getMainGuide() < 9 && UserModel.instance.getMaxBattleLevel() >= FogFunc.instance.getFogOpenLevel()) {
            this.resetStartGuide()
            GuideManager.ins.setGuideData(GuideConst.GUIDE_5_501, GuideManager.GuideType.Static, this.fogImg, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_5_501, null, this, null)
            this.isShowTaskGuide = false;
        }
    }
    finishGuide_501() {
        if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_5_501) {
            GuideManager.ins.guideFin(GuideConst.GUIDE_5_501, () => {
                WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            }, this, true)
        }
    }
    checkMainTimer() {
        //角色移动
        this.checkRoleMove();
        //角色说话
        this.checkRoleSpeak();
        this.checkTaskRefresh();
        if (this.timeCount % 5 == 0) {
            this.freshStartBtn();
        }
        if (this.timeCount >= 5) {
            this.freshStartGuide();
            this.timeCount = 0;
            this.freshWorkRed()
        }
        this.timeCount += 1;

    }
    freshStartBtn() {
        TweenAniManager.instance.scaleQipaoAni(this.gameStartBtn, 1.2, null, this, false)
    }
    freshStartGuide() {
        if (WindowManager.isUIOpened(WindowCfgs.GuideUI) || UserModel.instance.getMaxBattleLevel() > this.battleGuideLevel) {
            this.resetStartGuide()
            return;
        }
        if (!this.enterGuideImg.visible) {
            this.enterGuideImg.visible = true;
            TweenAniManager.instance.addHandTween(this.enterGuideImg);
            StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10005, { level: UserModel.instance.getMaxBattleLevel() })
        }
    }
    resetStartGuide() {
        if (this.enterGuideImg.visible) {
            this.enterGuideImg.visible = false;
            Laya.Tween.clearAll(this.enterGuideImg);
        }
    }
    /**检测主线任务的刷新 */
    checkTaskRefresh() {
        if (Object.keys(TaskModel.lockTaskTab).length == 0) return;
        var tab = TaskModel.lockTaskTab
        for (var id in tab) {
            if (tab[id]) {
                tab[id] -= 1000;
            }
            if (tab[id] <= 0) {
                //某个锁定任务的时间到了，刷新一次任务
                delete TaskModel.lockTaskTab[id];
                this.freshChatTaskRed();
                var task = WindowManager.getUIByName(WindowCfgs.TaskUI);
                //如果任务界面开着的话刷新一下主线任务
                if (task && task.visible) {
                    task.freshChatGroup();
                }
            }
        }
    }
    freshTaskShow() {
        var level = UserModel.instance.getMaxBattleLevel();
        if (level < GlobalParamsFunc.instance.getDataNum("taskUnlock")) {
            this.taskBtn.visible = false;
            this.chatTaskGroup.visible = false;
        } else {
            this.taskBtn.visible = true;
        }
    }
    //刷新阵容红点
    freshLineRed() {
        var allRole = RolesModel.instance.getInLineRole();
        var unlockLine = GlobalParamsFunc.instance.getUnlockLineCount();
        if (unlockLine > allRole.length) {
            this.formationRed.visible = true;
        } else {
            this.formationRed.visible = false;
        }
    }
    /**刷新日程红点 */
    freshChatTaskRed() {
        this.dailyRedImg.visible = false;
        if (!this.taskBtn.visible) return
        var roleArr = [];
        var level = UserModel.instance.getMaxBattleLevel();
        TaskFunc.instance.getTask();
        var allInfo = TaskFunc.chatTaskArr;
        var target;
        var isShowRed = false;
        this.noReadCount = 0;
        for (var i = 0; i < allInfo.length; i++) {
            var item = allInfo[i]
            var condition = item.condition;
            var unlock = false;
            if (condition) {
                if (TaskModel.instance.getTaskIsUnlock(condition, level)) {
                    unlock = true;
                }
            } else {
                unlock = true;
            }
            if (unlock) {
                if (roleArr.indexOf(item.role) == -1) {
                    var state = TaskModel.instance.getChatTaskStateById(item);
                    if (state) {
                        if (state == TaskConst.Chat_state_canReceive) {
                            isShowRed = true;
                        }
                        if (state == TaskConst.Chat_state_canReceive || state == TaskConst.Chat_state_noFinish && !target) {
                            target = item;
                        } else if (state == TaskConst.Chat_state_noRead) {
                            this.noReadCount += 1;
                        }
                        roleArr.push(item.role)
                    }
                }
            }
        }
        if (target) {
            this.chatTaskGroup.visible = true;
            var role = TaskChatFunc.instance.getCfgDatas("TaskRole", target.role);
            var name = TranslateFunc.instance.getTranslate(role.name)
            this.taskName.text = TranslateFunc.instance.getTranslate("#tid_task_chat_title", null, name);
            var info = TaskConditionTrigger.checkTaskCondition(target);
            this.taskDesc.text = TranslateFunc.instance.getTranslate(target.name);
            if (!info.noProcess) {
                this.taskDesc.text += "(" + info.cur + "/" + info.target + ")"
            } else {
                if (info.finish) {
                    this.taskDesc.text += "(1/1)"

                } else {
                    this.taskDesc.text += "(0/1)"
                }
            }
            if (info.finish) {
                this.taskName.color = "#19d112";
                this.taskDesc.color = "#19d112"
            } else {
                this.taskName.color = "#ffffff";
                this.taskDesc.color = "#ffffff"
            }
        } else {
            this.chatTaskGroup.visible = false;
        }
        if (this.noReadCount > 0) {
            this.taskRedTxt.text = this.noReadCount + ""
            this.taskPhone.rotation = 0;
            Laya.Tween.clearAll(this.taskPhone);
            TweenAniManager.instance.shakingAni(this.taskPhone);
            this.dailyRedImg.visible = true;
        } else {
            this.taskRedTxt.text = ""
            this.taskPhone.rotation = 0;
            Laya.Tween.clearAll(this.taskPhone);
            if (isShowRed) {
                this.dailyRedImg.visible = true;
            } else {
                this.freshDailyTaskRed();
            }
        }
    }
    /**刷新每日任务红点 */
    freshDailyTaskRed() {
        if (!this.taskBtn.visible) return;
        var level = UserModel.instance.getMaxBattleLevel();
        if (level < GlobalParamsFunc.instance.getDataNum("dailyTaskUnlock")) {
            return;
        }
        this.dailyRedImg.visible = TaskModel.instance.getDailyRed();
    }
    /**刷新进入的红点 */
    freshEnterRed() {
        var level = UserModel.instance.getMaxBattleLevel();
        var chapter = ChapterFunc.instance.getAllCfgData("Chapter");
        var startMap = ChapterFunc.instance.getUnlockTab();
        var isShowRed = false;
        for (var id in chapter) {
            //如果章节已解锁
            if (startMap[id] <= level) {
                isShowRed = ChapterModel.instance.getIsShowRedByChapter(id);
                if (isShowRed) break;
            }
        }
        this.enterRedImg.visible = isShowRed;
    }
    //刷新装备红点
    freshEquipRed() {
        var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock")
        if (UserModel.instance.getMaxBattleLevel() < unlock) {
            this.equipRed.visible = false;
            return;
        }
        var freeGetCount = CountsModel.instance.getCountsById(CountsModel.equipPieceFreeGet);
        this.equipRed.visible = !freeGetCount
    }
    //是否需要弹出空投
    checkAirDropView(data) {
        var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_SUPPLYBOX);
        if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            return;
        }
        //如果是结算回来的 则判断是否生成空投或刷新空投
        if (data && data.fromResultLevel) {
            var levelId = data.fromResultLevel;
            if (LevelFunc.instance.checkAirDropShow(levelId)) {
                var supplyBox = GlobalParamsFunc.instance.getDataNum("supplyBox");
                //出现新空投    如果已经存在空投  则刷新当前空投最大持续时间
                if (this.airDropView) {
                    this.continueAirDropTween(supplyBox);
                } else {
                    this.airDropView = new Laya.Image(ResourceConst.AIRDROP_PNG);
                    this.airDropView.x = this.initX;
                    this.airDropView.y = this.initY;
                    this.addChild(this.airDropView);
                    //动画
                    this.startAirDropTween();
                    //设置持续时间
                    this.startTime = Client.instance.miniserverTime;
                    this.totalLife = supplyBox;
                    this.setAirDropLife(this.totalLife);
                    //修改持续时间
                    this.nowLife = this.startTime + this.totalLife - Client.instance.miniserverTime;
                    //空投宝箱
                    new ButtonUtils(this.airDropView, this.onClickAirDrop, this);
                }
            } else {
                //如果已经存在空投  则继续之前的计时
                if (this.airDropView) {
                    this.continueAirDropTween();
                }
            }
        } else {
            //如果已经存在空投  则继续之前的计时
            if (this.airDropView) {
                this.continueAirDropTween();
            }
        }
        //检测过一次以后清空结算返回数据
        this.setInfo = null;

    }
    //继续计时
    continueAirDropTween(time?) {
        this.airDropView.visible = true;
        if (time) {
            this.setAirDropLife(time);
            this.startTime = Client.instance.miniserverTime;
            this.totalLife = time;
        } else {
            this.setAirDropLife(this.nowLife);
        }
    }

    //打开界面
    onClickAirDrop() {
        this.airDropView.visible = false;
        //修改持续时间
        this.nowLife = this.startTime + this.totalLife - Client.instance.miniserverTime;
        //打开界面
        WindowManager.OpenUI(WindowCfgs.AirDropDetailUI);
    }
    setAirDropLife(time?) {
        if (time < 0) {
            this.distroyView();
        }
        TimerManager.instance.removeByCallBack(this, this.distroyView);
        TimerManager.instance.setTimeout(this.distroyView, this, time);
    }
    //领取或到达最大持续时间后销毁
    distroyView() {
        Laya.Tween.clearAll(this.airDropView);
        TimerManager.instance.removeByCallBack(this, this.distroyView);
        this.removeChild(this.airDropView);
        this.airDropView = null;
        this.startTime = 0;
        this.totalLife = 0;
    }

    //空投宝箱动画
    startAirDropTween() {
        var maxX = ScreenAdapterTools.width - this.thisWidth / 2;
        var sinRate = (maxX - this.initX) / 4;
        Laya.Tween.to(this.airDropView, { x: maxX, rotation: 20 }, 7000, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.airDropView, { x: this.initX, rotation: -20 }, 7000, Laya.Ease.sineOut, Laya.Handler.create(this, this.startAirDropTween));
        }));

    }

    //检测各种弹窗
    checkIsShowPop() {
        if (this._isShowPop) return;
        this.checkIsShowOffline();
        this.checkIsSevenPop();
        this.checkIsShowTaskGuide()
    }
    reCheckShowPop() {
        this._isShowPop = false;
        this.checkIsShowPop();
    }
    /**检测是否展示任务引导 */
    checkIsShowTaskGuide() {
        if (!this._popTeam["taskGuide"] && !this._isShowPop) {
            if (this.showTaskGuide()) {
                this._isShowPop = true;
                this._popTeam["taskGuide"] = true
            }
        }
        if (!this._isShowPop) {
            this._popTeam["taskGuide"] = true;
        }
    }
    //展示任务引导
    showTaskGuide() {
        var a = WindowManager.getCurrentWindowName();
        var b = UserModel.instance.getMaxBattleLevel()
        var c = GlobalParamsFunc.instance.getDataNum("taskGuideMaxLevel")
        var d = !BattleFunc.instance.IshowGuide_403()
        if (this.isShowTaskGuide && this.noReadCount > 0 && WindowManager.getCurrentWindowName() == WindowCfgs.GameMainUI && UserModel.instance.getMaxBattleLevel() < GlobalParamsFunc.instance.getDataNum("taskGuideMaxLevel") && !BattleFunc.instance.IshowGuide_403()) {
            this.resetStartGuide()
            GuideManager.ins.setGuideData(GuideConst.GUIDE_10003, GuideManager.GuideType.Static, this.taskImg, this, null, null, null, null, { name: this.noReadCount })
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_10003);
            StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_10003, { level: UserModel.instance.getMaxBattleLevel() })
            return true;
        }
        return false;
    }
    //检测是否显示离线收益
    checkIsShowOffline() {
        var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_OFFLINE);
        if (!this._popTeam["offline"] && !this._isShowPop && (freeType != ShareOrTvManager.TYPE_QUICKRECEIVE)) {
            //更新数据
            UserExtServer.updateOfflineTime();

            if (UserExtModel.instance.getOfflineTime() != 0) {
                if (UserExtModel.instance.getMaxLevel() >= GlobalParamsFunc.instance.getDataNum("offLineStartLvel")) {
                    this._isShowPop = true;
                    this._popTeam["offline"] = true;
                    //打开离线收益
                    this.onClickOfflineBtn();
                }
            }
        }
        if (!this._isShowPop) {
            this._popTeam["offline"] = true;
        }
    }
    //检测是否显示显示七登
    checkIsSevenPop() {
        var isCan = SevenDayModel.instance.checkSignRedPoint();
        var sevenDaySwitch = GlobalParamsFunc.instance.getDataNum("sevenDaySwitch");
        if (isCan && sevenDaySwitch) {
            if (!this._popTeam["sevenday"] && !this._isShowPop) {
                this._popTeam["sevenday"] = true;
                this._isShowPop = true;
                this.onClickSign();
            }
        }
    }

    //刷新七日登录按钮状态
    freshSevenIcon() {
        if (UserExtModel.instance.getMaxLevel() >= GlobalParamsFunc.instance.getDataNum("sevenDayReward")) {
            this.signBtn.visible = true;
        } else {
            this.signBtn.visible = false;
        }
        this.freshSignRedPoint();
    }
    //刷新七日登录红点
    freshSignRedPoint() {
        if (SevenDayModel.instance.checkSignRedPoint()) {
            this.signRedPoint.visible = true;
        } else {
            this.signRedPoint.visible = false;
        }
    }
    //开始增加互推
    protected startAddJumpView() {
        var posArr = [
            { x: -20, y: 50 },
            { x: -20, y: 200 },
            { x: -20, y: 350 },
            { x: -530, y: 250 },
        ]
        JumpManager.addMainJump(this, JumpConst.MAIN_SIDE, posArr);
    }



    //开始战斗
    private onGameStartBtnClick() {
        this.isShowUnlock = false;
        if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_2_204) {
            this.showGuide_204_finish();
        }
        var data = {};
        if (this.enterGuideImg.visible) {
            data = {
                showGuide: 1
            }
        }
        WindowManager.SwitchUI([WindowCfgs.ChapterListUI], [WindowCfgs.GameMainUI], data);

        this.close();
    }

    initFlatPanel() {

        //获取role数据
        this.roleData = [];
        this.roleIdToFlatTable = [];

        var roleList = RolesFunc.instance.getAllRole();
        var roleInfo;
        for (var id in roleList) {
            roleInfo = RolesFunc.instance.getRoleInfoById(id);
            if (roleInfo && roleInfo.mainShowOrder) {
                this.roleData.push(roleInfo);
            }
        }
        this.roleData.sort(this.sortByOrder);

        var res = WindowManager.getUILoadGroup(WindowCfgs.FlatItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initPanelData));
    }
    initPanelData() {

        this.flatArea.removeChildren();
        // this.flatArea.vScrollBar.value = 0;
        //当前解锁角色所在的Y
        var unlockY;
        var unlockRole;
        for (var i = this.roleData.length; i > 0;) {
            var floorNum = Math.ceil(i / 2);
            var leftData = {};
            var rightData = {};
            if (i == this.roleData.length && this.roleData.length % 2 != 0) {
                leftData = this.roleData[i - 1];
                rightData = {};
                this.roleIdToFlatTable.push(leftData["id"]);
                i = i - 1;
            } else {
                leftData = this.roleData[i - 2];
                rightData = this.roleData[i - 1];
                this.roleIdToFlatTable.push(leftData["id"]);
                this.roleIdToFlatTable.push(rightData["id"]);
                i = i - 2;
            }

            var flatItem: FlatItemUI;
            var cacheItem = PoolTools.getItem(PoolCode.POOL_FLAT + floorNum);
            if (cacheItem) {
                flatItem = cacheItem;
            } else {
                flatItem = new FlatItemUI(floorNum, leftData, rightData, this);
            }

            flatItem.x = 0;
            flatItem.y = (Math.ceil(this.roleData.length / 2) - floorNum) * flatItem.height;
            this.flatArea.addChild(flatItem);



            if (this.isShowUnlock && !unlockRole) {
                unlockRole = flatItem.unlockNewRole();
                if (unlockRole) {
                    unlockY = flatItem.y + 420;
                    this.isShowTaskGuide = false;
                }
            }
        }
        if (unlockRole) {
            this.workBtn.visible = false;
        } else {
            this.freshWorkBtn()
        }
        DisplayUtils.setPanelScrollVisbie(this.flatArea, true)
        this.flatArea["changeScroll"].call(this.flatArea);
        TimerManager.instance.setTimeout(() => {
            if (unlockRole) {
                DisplayUtils.setPanelScrollVisbie(this.flatArea, false)

                // this.flatArea.scrollTo(0,0);
                this.flatArea.scrollTo(0, unlockY - this.flatAreaHeight);
                if (this.airDropView) {
                    this.airDropView.visible = false;
                }
                if (Number(unlockRole.level) == 1) {
                    this.showGuide_10001(unlockRole.item, unlockRole.level, unlockRole.id)
                } else {
                    this.showGuide_10001(unlockRole.item, unlockRole.level, unlockRole.id)
                }
            } else {
                //滚动条位置调整
                this.flatArea.scrollTo(0, 0);
                this.flatArea.scrollTo(0, 3000);
                this.showGuide_204()
                if (BattleFunc.instance.IshowGuide_403()) {
                    this.mouseEnabled = false;
                    this.mouseThrough = true;
                    this.showGuide_403();
                }

                //如果是结算界面回来的,判断是否弹出空投宝
                this.checkAirDropView(this.setInfo);

            }
        }, this, 100)

    }
    /**英雄解锁引导 */
    showGuide_10001(item, level, id) {
        var guideId;
        if (Number(level) == 1) {
            guideId = GuideConst.GUIDE_2_202
        } else {
            guideId = GuideConst.GUIDE_ROLEUNLOCK
            StatisticsManager.ins.onEvent(StatisticsManager.GUIDE_UNLOCKROLE, { id: id })
        }
        var names = TranslateFunc.instance.getTranslate(BattleFunc.instance.getCfgDatasByKey("Role", id, "name"))
        GuideManager.ins.setGuideData(guideId, GuideManager.GuideType.Static, item, this, null, null, null, null, { "name": names });
        GuideManager.ins.openGuideUI(guideId, null, this, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            if (guideId == GuideConst.GUIDE_2_202) {
                GuideManager.ins.guideFin(guideId, null, null, true);
            }
            this.checkAirDropView(this.setInfo);
            this.freshWorkBtn();
            this.flatArea.vScrollBar.touchScrollEnable = true

        });
    }
    /**进入战斗引导 */
    showGuide_204() {
        //大于一关就不引导进入游戏了 并且没有进行过该步引导  该步是第四步
        if (UserModel.instance.getMaxBattleLevel() == 1 && UserModel.instance.getMainGuide() <= 3) {
            this.resetStartGuide();
            GuideManager.ins.setGuideData(GuideConst.GUIDE_2_204, GuideManager.GuideType.Static, this.gameStartBtn, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_2_204, null, this, this.showGuide_204_finish)
            this.isShowTaskGuide = false;
            return true;
        }
        return false;
    }
    showGuide_204_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_2_204, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        }, this);

    }
    /**展示布阵引导 */
    showGuide_301() {
        if (UserModel.instance.getMainGuide() <= 4) {
            this.isShowTaskGuide = false;
            this.resetStartGuide()
            GuideManager.ins.setGuideData(GuideConst.GUIDE_3_301, GuideManager.GuideType.Static, this.formationImg, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_3_301, this.showLine, this, this.showGuide_301_finish)
        }
    }
    showGuide_301_finish(asyc = true) {
        GuideManager.ins.guideFin(GuideConst.GUIDE_3_301, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        }, this, asyc);
    }
    showLine() {
        this.showGuide_301_finish(false);
        this.onClickFormation();
    }

    showGuide_403() {
        this.mouseThrough = false;
        this.mouseEnabled = true;
        var item = (this.flatArea.getChildAt(this.flatArea.numChildren - 1) as FlatItemUI)
        this.resetStartGuide()
        GuideManager.ins.setGuideData(GuideConst.GUIDE_4_403, GuideManager.GuideType.Static, item.leftRoleClickArea, this);
        GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_403, null, this, this.showGuide_408)
    }


    /**装备抽取引导 */
    showGuide_408() {
        if (UserModel.instance.getMainGuide() == 7 && !CountsModel.instance.getCountsById(CountsModel.equipPieceFreeGet)) {
            this.resetStartGuide()
            GuideManager.ins.setGuideData(GuideConst.GUIDE_4_408, GuideManager.GuideType.Static, this.equipImg, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_408, this.showGuide_408_finish, this)
            this.isShowTaskGuide = false;
        }
    }
    showGuide_408_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_4_408, () => {
            this.onClickEquip();
        }, this, false);
    }
    /**获取目标角色 */
    public getTargetRole(id) {
        var target;
        var role;
        for (var i = 0; i < this.flatArea.numChildren; i++) {
            var item = this.flatArea.getChildAt(i) as FlatItemUI;
            if (item.leftRoleData.id == id) {
                target = item;
                role = item.leftRoleClickArea
                break;
            } else if (item.rightRoleData.id == id) {
                target = item;
                role = item.rightRoleClickArea
                break;
            }
        }
        if (target) {
            this.flatArea.scrollTo(0, target.y + 420 - this.flatAreaHeight);
        }
        return role;

    }
    /**获取最近一个要解锁的角色 */
    getUnlockRole() {
        var target;
        var role;
        for (var i = this.flatArea.numChildren - 1; i >= 0; i--) {
            var flatItem = this.flatArea.getChildAt(i) as FlatItemUI;
            role = flatItem.unlockNewRole(false);
            if (role) {
                target = flatItem;
                break;
            }
        }
        if (target) {
            this.flatArea.scrollTo(0, target.y + 420 - this.flatAreaHeight);
        }
        return role;
    }
    //角色排序规则：
    sortByOrder(a, b) {
        var big = a.mainShowOrder - b.mainShowOrder;
        return big;
    }
    //检测角色移动
    checkRoleMove() {
        if (this['windowName'] != WindowManager.getCurrentWindowName()) {
            return;
        }
        if (this.roleIdToFlatTable.length == 0) {
            return;
        }
        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                //角色等级更新
                var roleWay = this.getRoleWay(i);
                item.roleDoMove(roleWay);
                if (roleWay == "right") {
                    item.freshRightComposeTxt();
                } else {
                    item.freshLeftComposeTxt();
                }
            }
        }
    }
    checkRoleSpeak() {
        //如果玩家在主界面停留超过n秒
        if (this['windowName'] == WindowManager.getCurrentWindowName()) {
            var mainSpeakInterval = GlobalParamsFunc.instance.getDataNum("mainSpeakInterval") / 1000;
            if (Client.instance.serverTime - this.roleSpeakTimerStamp >= mainSpeakInterval) {
                this.chooseRoleSpeak();
                this.roleSpeakTimerStamp = Client.instance.serverTime;
            }
        } else {
            //重置时间戳
            this.roleSpeakTimerStamp = Client.instance.serverTime;
        }
    }
    //获取角色的朝向
    getRoleWay(index) {
        var roleWay;

        if (this.roleIdToFlatTable.length % 2 != 0) {
            if (index == 0) {
                roleWay = "left";
            } else {
                if (index % 2) {
                    roleWay = "left";
                } else {
                    roleWay = "right";
                }
            }
        } else {
            if (index % 2) {
                roleWay = "right";
            } else {
                roleWay = "left";
            }
        }

        return roleWay;
    }
    getFlatItem(index) {
        var item;
        var flatNum;
        if (this.roleIdToFlatTable.length % 2 != 0) {
            if (index == 0) {
                flatNum = 0;
            } else {
                flatNum = Math.ceil(index / 2);
            }
        } else {
            flatNum = Math.floor(index / 2);
        }

        item = this.flatArea.getChildAt(flatNum) as FlatItemUI;

        return item;
    }
    chooseRoleSpeak() {
        // 玩家切换到主界面后，每隔n秒，会有已解锁，且显示在屏幕中的角色随机说话。
        // 显示在屏幕中的判定条件为：楼层有超过一定万分比的区域显示在屏幕中。
        var roleData = RolesModel.instance.getRolesList();
        var chooseArr = [];
        for (var roleId in roleData) {
            var roleInfo = RolesFunc.instance.getRoleInfoById(roleId);
            if (roleInfo && roleInfo.mainShowOrder) {
                var index = this.roleIdToFlatTable.indexOf(roleId);
                if (index == -1) {
                    return;
                }
                var item = this.getFlatItem(index);
                if (!item) {
                    return;
                }

                //判断是否在指定的显示比例之内
                if (this.checkItemShowRatio(item.y)) {
                    var roleWay = this.getRoleWay(index);

                    chooseArr.push([roleId, item, roleWay]);
                }
            }
        }
        var random = GameUtils.getRandomInt(0, chooseArr.length - 1);
        if (chooseArr[random] && chooseArr[random][0]) {
            var mainSpeak = RolesFunc.instance.getRoleDataById(chooseArr[random][0], "mainSpeak");
            if (mainSpeak) {
                var speakRandom = GameUtils.getRandomInt(0, mainSpeak.length - 1);
                if (this.lastSpeakRole != "") {
                    var lastRoleIndex = this.roleIdToFlatTable.indexOf(this.lastSpeakRole);
                    var lastRoleWay = this.getRoleWay(lastRoleIndex);
                    var lastItem = this.getFlatItem(lastRoleIndex);
                    if (lastItem) {
                        lastItem.hideSpeakShow(lastRoleWay);
                    }
                }
                chooseArr[random][1].showSpeak(chooseArr[random][0], mainSpeak[speakRandom], chooseArr[random][2]);
                this.lastSpeakRole = chooseArr[random][0];
            }
        }
    }
    checkItemShowRatio(y) {
        var mainShowPercent = GlobalParamsFunc.instance.getDataNum("mainShowPercent") / 10000;
        var value = this.flatArea.vScrollBar.value
        if (y < value) {
            var ratioToTop = (this.flatHeight - (value - y)) / this.flatHeight;
            if (ratioToTop >= mainShowPercent) {
                return true;
            } else {
                return false;
            }
        } else if (y == value) {
            return true;
        } else {
            if (y - value + this.flatHeight < this.bottomGroup.y) {
                return true;
            } else {
                var ratioToButtom = (this.bottomGroup.y - (y - value)) / this.flatHeight;
                if (ratioToButtom >= mainShowPercent) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    //GM按钮
    onClickGM() {
        WindowManager.OpenUI(WindowCfgs.TestOpListUI);
    }
    onClickCD() {
        WindowManager.OpenUI(WindowCommonCfgs.ChangeDataView);
    }
    onAddSpClick() {
        WindowManager.OpenUI(WindowCfgs.FreeResourceUI, { type: DataResourceType.SP });
    }
    //转盘按钮
    onTurnableBtnClick() {
        WindowManager.OpenUI(WindowCfgs.TurnableUI);
    }
    onClickInvite() {
        UserExtServer.setEverydayInvite(1, () => {
            this.refreshInviteRedPoint();
        }, this);
        WindowManager.OpenUI(WindowCfgs.InviteUI);
    }
    onClickSign() {
        this._popTeam["sevenday"] = true;
        WindowManager.OpenUI(WindowCfgs.SevenDaysUI);
    }

    onClickFormation() {
        WindowManager.OpenUI(WindowCfgs.RoleInLineUI);

    }
    //点击装备抽取
    onClickEquip() {
        var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock")
        if (UserModel.instance.getMaxBattleLevel() < unlock) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_equip_openLevel", null, ChapterFunc.instance.getOpenConditionByLevel(unlock)));
            return;
        }
        WindowManager.OpenUI(WindowCfgs.MainShopUI);

    }
    //点击设置
    onClickSet() {
        WindowManager.OpenUI(WindowCfgs.SettingUI);

    }
    //点击任务
    onClickTask() {
        if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_10003) {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        }
        WindowManager.OpenUI(WindowCfgs.TaskUI);
    }
    onClickWork() {
        WindowManager.OpenUI(WindowCfgs.WorkDetailUI);
    }
    //进入基地升级界面
    onClickFlat() {
        WindowManager.OpenUI(WindowCfgs.HomeUpgradeUI);
    }
    //初始化迷雾街区按钮
    initFog() {
        this.fogLab.visible = false;
        this.fogRedPoint.visible = false;

        //获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
        var status = FogFunc.instance.getFogEnterStatus();

        //使用免费次数进入：显示次数；当天有未用完的次数时，显示红点
        if (status == FogConst.FOG_STATUS_COST_FREE_COUNT) {
            this.fogLab.visible = true;
            var fogStreetCount = CountsModel.instance.getCountsById(CountsModel.fogStreetCount);
            var fogStreetTimes = GlobalParamsFunc.instance.getDataNum("fogStreetTimes");
            this.fogLab.text = "(" + fogStreetCount + "/" + fogStreetTimes + ")";

            if (fogStreetCount < fogStreetTimes) {
                this.fogRedPoint.visible = true;
            }
        }
        //有缓存数据：显示红点和当前层数
        else if (status == FogConst.FOG_STATUS_ENTER) {
            var curLayer = FogModel.instance.getCurLayer() + 1;
            if (curLayer) {
                this.fogLab.visible = true;
                this.fogLab.text = curLayer + "层";
            }
            this.fogRedPoint.visible = true;
        }
    }
    refreshFogRedPoint() {
        this.fogRedPoint.visible = false;
        var status = FogFunc.instance.getFogEnterStatus();
        //使用免费次数进入：显示次数；当天有未用完的次数时，显示红点
        if (status == FogConst.FOG_STATUS_COST_FREE_COUNT || status == FogConst.FOG_STATUS_COST_FREE_COUNT_LIMIT) {
            this.fogLab.visible = true;
            var fogStreetCount = CountsModel.instance.getCountsById(CountsModel.fogStreetCount);
            var fogStreetTimes = GlobalParamsFunc.instance.getDataNum("fogStreetTimes");
            this.fogLab.text = "(" + fogStreetCount + "/" + fogStreetTimes + ")";

            if (fogStreetCount < fogStreetTimes) {
                this.fogRedPoint.visible = true;
            }
        }
        //有缓存数据：显示红点和当前层数
        else if (status == FogConst.FOG_STATUS_ENTER) {
            this.fogRedPoint.visible = true;
        }
    }
    onClickFog() {
        //获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
        var status = FogFunc.instance.getFogEnterStatus();
        this.isShowUnlock = false;

        //功能未开启
        if (status == FogConst.FOG_STATUS_NOT_OPEN) {
            var fogOpeneLevel = FogFunc.instance.getFogOpenLevel();
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_equip_openLevel", null, ChapterFunc.instance.getOpenConditionByLevel(fogOpeneLevel)));
            return;
        }
        //有缓存数据，直接进入
        else if (status == FogConst.FOG_STATUS_ENTER) {
            WindowManager.OpenUI(WindowCfgs.FogMainUI, { quickShowGuide: 1 });
            this.close();
        }
        //使用免费次数进入
        else if (status == FogConst.FOG_STATUS_COST_FREE_COUNT) {
            CountsServer.updateCount({ "id": CountsModel.fogStreetCount }, () => {
                this.enterFog();
                this.refreshFogRedPoint();
            }, this);
        }
        //免费次数刚用完
        else if (status == FogConst.FOG_STATUS_COST_FREE_COUNT_LIMIT) {
            this.refreshFogRedPoint();
            WindowManager.OpenUI(WindowCfgs.FogVideoEnterUI, { "callBack": this.enterFog, "thisObj": this });
        }
        //视频视频次数进入
        else if (status == FogConst.FOG_STATUS_COST_VIDEO_COUNT) {
            WindowManager.OpenUI(WindowCfgs.FogVideoEnterUI, { "callBack": this.enterFog, "thisObj": this });
        }
        //不能进入
        else if (status == FogConst.FOG_STATUS_NO_ENTER) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_counts_limit_lab"));
            return;
        }
    }
    //迷雾街区进入界面
    enterFog() {
        //首次进入玩法时，弹出以上漫画剧情;非首次，则直接进入下一步初始角色
        if (UserExtModel.instance.getEnterFogFlag()) {
            WindowManager.SwitchUI([WindowCfgs.FogMainUI, WindowCfgs.FogInitRoleUI], [WindowCfgs.GameMainUI]);
        } else {
            this.finishGuide_501();
            UserExtServer.setEnterFogFlag(1, () => {
                WindowManager.SwitchUI(WindowCfgs.FogCartoonPicUI, WindowCfgs.GameMainUI);
            }, this);
        }
        this.dispose();
    }
    /*点击退出按钮*/
    onClickExit(aa) {
        // 添加互推图标
        JumpManager.initJumpData(JumpManager.showMainJumpKariqu, JumpManager, JumpConst.MAIN_SIDE);
    }

    //打开免费金币
    openSpAddScene() {
        var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
        if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_battle_noenoughsp"));
        } else {
            WindowManager.OpenUI(WindowCfgs.FreeResourceUI, { type: DataResourceType.SP });
        }
    }
    clickFreeGold() {
        WindowManager.OpenUI(WindowCfgs.DailyGoldUI);
    }
    //战斗开始以后
    private onBattleStart() {
        BattleServer.battleStart(null, this);
        this.close();
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.GameMainUI);
        this.dispose();
    }
    dispose() {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.taskPhone);
        Laya.Tween.clearAll(this.enterGuideImg);
        //移除定时器
        if (this.mainTimer) {
            TimerManager.instance.remove(this.mainTimer);
            this.mainTimer = 0;
        }
        this.cacheFlatItem();
        // this.cacheRoleSpine();
    }
    cacheFlatItem() {
        for (var index = 0; index < this.flatArea.numChildren; index++) {
            var preFlatItem = this.flatArea.getChildAt(index) as FlatItemUI;
            //按楼层缓存item
            if (preFlatItem) {
                PoolTools.cacheItem(PoolCode.POOL_FLAT + (this.flatArea.numChildren - index), preFlatItem);
            }
        }
    }
    cacheRoleSpine() {
        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                if (item.leftRoleAnim) {
                    PoolTools.cacheItem(PoolCode.POOL_ROLE + + item.leftRoleData.id, item.leftRoleAnim);
                }
                if (item.rightRoleAnim) {
                    PoolTools.cacheItem(PoolCode.POOL_ROLE + item.rightRoleData.id, item.rightRoleAnim);
                }

                this.roleIdToFlatTable.splice(i, 1);
                this.flatArea.removeChild(item);
            }
        }
    }

    //角色升级后刷新主界面角色等级显示
    refreshRoleLevel(roleId) {
        var index = this.roleIdToFlatTable.indexOf(roleId);
        if (index == -1) {
            return;
        }
        var item = this.getFlatItem(index);
        if (!item) {
            return;
        }
        var roleWay = this.getRoleWay(index);
        item.updateLevel(roleId, roleWay);

    }
    //角色升级后刷新角色的升级按钮
    refreshRoleUpgradeBtn(roleId) {
        var index = this.roleIdToFlatTable.indexOf(roleId);
        if (index == -1) {
            return;
        }
        var item = this.getFlatItem(index);
        if (!item) {
            return;
        }
        //角色等级更新
        var roleWay = this.getRoleWay(index);
        item.updateUpgradeBtn(roleId, roleWay);


    }
    //角色解锁后刷新在主界面的显示
    unlockRefreshRole(roleId) {
        var index = this.roleIdToFlatTable.indexOf(roleId);
        if (index == -1) {
            return;
        }
        var item = this.getFlatItem(index);
        if (!item) {
            return;
        }

        //角色等级更新
        var roleWay = this.getRoleWay(index);
        item.unlockRole(roleId, roleWay);

    }
    //角色上阵后刷新在主界面的显示
    refreshRoleInline() {
        if (this.roleIdToFlatTable.length == 0) {
            return;
        }

        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                //角色等级更新
                var roleWay = this.getRoleWay(i);
                item.inlineRole(this.roleIdToFlatTable[i], roleWay);

            }
        }
    }
    //货币更新后刷新主界面角色的升级按钮
    refreshAllRoleUpgradeBtn() {
        if (this.roleIdToFlatTable.length == 0) {
            return;
        }

        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                //角色等级更新
                var roleWay = this.getRoleWay(i);
                item.updateUpgradeBtn(this.roleIdToFlatTable[i], roleWay);

            }
        }
    }
    //通关后刷新主界面角色的解锁条件
    refreshAllRoleUnlock() {
        if (this.roleIdToFlatTable.length == 0) {
            return;
        }
        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                var roleWay = this.getRoleWay(i);
                item.refreshUnlockCondLab(this.roleIdToFlatTable[i], roleWay);

            }
        }
    }
    //红点刷新
    refreshRedPoint() {
        //基地升级红点检测
        this.refreshFlatRedpoint();

        //邀请红点
        this.refreshInviteRedPoint();
    }
    refreshInviteRedPoint() {
        if (UserExtModel.instance.getEverydayInvite() != 1 || UserModel.instance.checkNoGetInviteReward()) {
            this.inviteRedPoint.visible = true;
        } else {
            this.inviteRedPoint.visible = false;
        }
    }
    refreshFlatRedpoint() {
        if (RolesModel.instance.checkFlatRedPoint()) {
            this.flatRedPoint.visible = true;
        } else {
            this.flatRedPoint.visible = false;
        }
    }


    //根据条件显示或隐藏每日免费钻石
    freshFreeGold() {
        var dailyGoldCount;
        var dailyGold = DailyGoldModel.instance.getDailyGold();

        if (dailyGold.currentStep && !dailyGold.currentGoldStep) {
            dailyGoldCount = dailyGold.currentStep;
        }
        else {
            dailyGoldCount = dailyGold.currentGoldStep;
        }

        var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_DAILYGOLD);
        if (DailyDiamondFunc.instance.getMaxId() <= dailyGoldCount || freeType == ShareOrTvManager.TYPE_QUICKRECEIVE || UserExtModel.instance.getMaxLevel() < GlobalParamsFunc.instance.getDataNum("freeShowTvdiamond")) {
            this.freeGoldBtn.visible = false;
        } else {
            this.freeGoldBtn.visible = true;
        }
    }
    freshOfflineIcon() {
        if (UserExtModel.instance.getMaxLevel() < GlobalParamsFunc.instance.getDataNum("offLineStartLvel")) {
            this.offlineRewardGroup.visible = false;
            return;
        }
        if (UserExtModel.instance.getOfflineTime() != 0) {
            //显示离线收益图标
            this.offlineRewardGroup.visible = true;
            var reward = UserExtModel.instance.calcuOfflineReward();
            this.lbl_offlineReward.text = StringUtils.getCoinStr(reward[1]);
        } else {
            this.offlineRewardGroup.visible = false;
        }
    }
    onClickOfflineBtn() {
        WindowManager.OpenUI(WindowCfgs.OfflineIncomeUI);
    }
    //引导检测
    freshCheckGuide(data) {
        if (data == GuideConst.GUIDE_2_204) {
            this.showGuide_204();
        } else if (data == GuideConst.GUIDE_3_301) {
            this.showGuide_301();
        } else if (data == GuideConst.GUIDE_ROLEUNLOCK) {
            this.checkAirDropView(this.setInfo);
            this.freshWorkBtn()
            DisplayUtils.setPanelScrollVisbie(this.flatArea, true)

        } else if (data == GuideConst.GUIDE_4_408) {
            this.showGuide_408();
        } else if (data == GuideConst.GUIDE_10003) {
            this.isShowTaskGuide = true;
            this.showTaskGuide();
        }
    }
    /**刷新红点 */
    freshMainRedPoint(data) {
        if (data == RedPointConst.POINT_MAIN_EQUIP) {
            this.freshEquipRed();
        } else if (data == RedPointConst.POINT_MAIN_TURNTABLE) {
            this.hideTurnQipao();
        } else if (data == RedPointConst.POINT_MAIN_SEVENDAY) {
            this.freshSignRedPoint();
        } else if (data == RedPointConst.POINT_MAIN_INVITEFRIEND) {
            this.refreshInviteRedPoint();
        } else if (data == RedPointConst.POINT_MAIN_LINERED) {
            this.freshLineRed();
        } else if (data == RedPointConst.POINT_MAIN_TASKRED) {
            this.freshChatTaskRed();
        }
    }
    showAirdropView() {
        if (this.airDropView) {
            this.airDropView.visible = true;
        }
    }
    checkDisposeUI() {
        if (WindowManager.getCurrentFullWindow() == this) {
            this.setRoleAniStop(false)
        } else {
            this.setRoleAniStop(true)
        }
    }
    setRoleAniStop(stop) {
        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                if (item.leftRoleAnim) {
                    if (stop) {
                        item.leftRoleAnim.stop();
                    } else {
                        item.leftRoleAnim.resume();
                    }
                }
                if (item.rightRoleAnim) {
                    if (stop) {
                        item.rightRoleAnim.stop();
                    } else {
                        item.rightRoleAnim.resume();
                    }
                }
            }
        }
    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            //刷新货币、红点
            case GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshRedPoint();
                this.refreshAllRoleUpgradeBtn();
                break;
            //战斗开始扣体力    
            case BattleEvent.BATTLEEVENT_BATTLESTART:
                this.onBattleStart();
                break;
            //角色升级刷新等级
            case RoleEvent.ROLE_EVENT_GAMEMAIN_ROLELEVEL:
                this.refreshRoleLevel(data);
                this.refreshRoleUpgradeBtn(data);
                break;
            //角色解锁后刷新主界面显示
            case RoleEvent.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK:
                this.unlockRefreshRole(data);
                break;
            //基地升级后刷新主界面基地红点    
            case RoleEvent.ROLE_EVENT_GAMEMAIN_FALT_REDPOINT:
                this.refreshFlatRedpoint();
                break;
            //通关刷新界面角色解锁、每日钻石按钮刷新、七日登录界面首次弹出检测
            case GameMainEvent.GAMEMAIN_EVENT_STAGE:
                this.refreshAllRoleUnlock();
                this.freshFreeGold();
                this.checkIsSevenPop();
                //不展示碎片引导的情况再判断解锁引导  
                this.isShowUnlock = !BattleFunc.instance.IshowGuide_403()
                break;
            //角色上阵刷新主界面
            case RoleEvent.ROLE_EVENT_GAMEMAIN_ROLE_INLINE:
                this.refreshRoleInline();
                break;

            //刷新每日钻石
            case GameMainEvent.GAMEMAIN_EVENT_REFRESH_DAILYGOLD:
                this.freshFreeGold();
                break;
            //刷新离线收益按钮    
            case GameMainEvent.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON:
                this.freshOfflineIcon();
                break;
            case GameMainEvent.GAMEMAIN_EVENT_FRESH_GUIDE:
                this.freshCheckGuide(data);
                break;
            //刷新空投宝箱    
            case GameMainEvent.GAMEMAIN_EVENT_REFRESH_AIRDROP:
                this.showAirdropView();
                break;
            case GameMainEvent.GAMEMAIN_EVENT_DESTORY_AIRDROP:
                this.distroyView();
                break;
            case GameMainEvent.GAMEMAIN_EVENT_REDPOINT:
                this.freshMainRedPoint(data);
                break;
            //刷新迷雾街区红点    
            case GameMainEvent.GAMEMAIN_EVENT_FOG_REDPOINT:
                this.refreshFogRedPoint();
                break;
            //更新看视频任务次数
            case VideoAdvEvent.VIDEOADV_EVENT_ADV_SUCCESS:
                TaskServer.updateTaskProcess({ logicType: TaskConditionTrigger.taskCondition_videoCount })
                break;
            case WindowEvent.WINDOW_EVENT_SWITCHUIFIN:
                this.checkDisposeUI();
                break;
            case GameMainEvent.GAMEMIAN_EVENT_CHECKPOP:
                this.reCheckShowPop();
                break;
            case WorkEvent.WORK_REPUTE_UPDATE:
                this.freshWorkRed();
                break;
        }
    }

}


