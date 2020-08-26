"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const Message_1 = require("../../../../framework/common/Message");
const SubPackageManager_1 = require("../../../../framework/manager/SubPackageManager");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const RolesModel_1 = require("../../model/RolesModel");
const RolesFunc_1 = require("../../func/RolesFunc");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const UserModel_1 = require("../../model/UserModel");
const GameSwitch_1 = require("../../../../framework/common/GameSwitch");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const BattleEvent_1 = require("../../event/BattleEvent");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const SubPackageConst_1 = require("../../consts/SubPackageConst");
const Client_1 = require("../../../../framework/common/kakura/Client");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const SoundManager_1 = require("../../../../framework/manager/SoundManager");
const MusicConst_1 = require("../../consts/MusicConst");
const BattleServer_1 = require("../../server/BattleServer");
const UtilsServer_1 = require("../../server/UtilsServer");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const GameUtils_1 = require("../../../../utils/GameUtils");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const UserExtModel_1 = require("../../model/UserExtModel");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const JumpConst_1 = require("../../consts/JumpConst");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const StatisticsCommonConst_1 = require("../../../../framework/consts/StatisticsCommonConst");
const FlatItemUI_1 = require("../main/FlatItemUI");
const RoleEvent_1 = require("../../event/RoleEvent");
const UserEvent_1 = require("../../event/UserEvent");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const CountsModel_1 = require("../../model/CountsModel");
const DailyDiamondFunc_1 = require("../../func/DailyDiamondFunc");
const DailyGoldModel_1 = require("../../model/DailyGoldModel");
const SevenDayModel_1 = require("../../model/SevenDayModel");
const UserExtServer_1 = require("../../server/UserExtServer");
const BattleFunc_1 = require("../../func/BattleFunc");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const LevelFunc_1 = require("../../func/LevelFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const RedPointConst_1 = require("../../consts/RedPointConst");
const WindowCommonCfgs_1 = require("../../../../framework/consts/WindowCommonCfgs");
const FogModel_1 = require("../../model/FogModel");
const CountsServer_1 = require("../../server/CountsServer");
const FogFunc_1 = require("../../func/FogFunc");
const FogConst_1 = require("../../consts/FogConst");
const SwitchModel_1 = require("../../model/SwitchModel");
const ChapterFunc_1 = require("../../func/ChapterFunc");
const ResourceShowUI_1 = require("./ResourceShowUI");
const ChapterModel_1 = require("../../model/ChapterModel");
const VideoAdvEvent_1 = require("../../../../framework/event/VideoAdvEvent");
const TaskServer_1 = require("../../server/TaskServer");
const TaskConditionTrigger_1 = require("../../trigger/TaskConditionTrigger");
const TaskFunc_1 = require("../../func/TaskFunc");
const TaskModel_1 = require("../../model/TaskModel");
const TaskConst_1 = require("../../consts/TaskConst");
const TaskChatFunc_1 = require("../../func/TaskChatFunc");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const WindowEvent_1 = require("../../../../framework/event/WindowEvent");
const WorkModel_1 = require("../../model/WorkModel");
const WorkFunc_1 = require("../../func/WorkFunc");
const WorkEvent_1 = require("../../event/WorkEvent");
const DisplayUtils_1 = require("../../../../framework/utils/DisplayUtils");
const MainJumpReturnComp_1 = require("../../../../framework/platform/comp/MainJumpReturnComp");
class GameMainUI extends layaMaxUI_1.ui.native.GameMainUI {
    constructor() {
        super();
        //角色说话定时器相关
        this.roleSpeakTimer = 0;
        this.roleSpeakTimerStamp = 0;
        this.mainTimer = 0;
        //角色id在楼层中的pos数组
        this.roleIdToFlatTable = [];
        //楼层高度
        this.flatHeight = 420;
        //弹窗检测相关
        this._isShowPop = false;
        this._popTeam = {};
        /**默认是不显示解锁新角色引导  只有最大关卡发生改变才检测 */
        this.isShowUnlock = false;
        this.thisWidth = 224;
        this.thisHeigth = 254;
        this.initX = -50;
        this.initY = 250;
        this.noReadCount = 0;
        this.isInit = false;
        this.isShowTaskGuide = true;
        this.timeCount = 0;
        this.battleGuideLevel = 0;
        this.flatAreaHeight = 0;
        this.createChildren();
        //事件监听
        this.addEvent();
        // 初始化按钮
        this.initBtn();
        this.lastSpeakRole = "";
        StatisticsManager_1.default.onLoadingLog();
        if (UserModel_1.default.instance.checkIsOld()) {
            StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.LOADING_2);
        }
        else {
            UtilsServer_1.default.setIsOldFlag(() => {
                StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.NEW_LOADING_2);
            }, this);
        }
        //第一次加载主场景发送事件时还未监听 如果有上一步结算引导 默认本次检测角色的解锁
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_2_201) {
            this.isShowUnlock = true;
        }
        //刘海屏适配
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        ScreenAdapterTools_1.default.alignNotch(this.middleGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        ScreenAdapterTools_1.default.alignNotch(this.flatArea, ScreenAdapterTools_1.default.Align_MiddleTop);
        // 动态调整列表长度
        this.flatAreaHeight = 980 + ScreenAdapterTools_1.default.height - ScreenAdapterTools_1.default.designHeight - ScreenAdapterTools_1.default.toolBarWidth;
        this.flatArea.height = this.flatAreaHeight;
        this.flatArea.vScrollBarSkin = "";
        TimerManager_1.default.instance.setTimeout(this.loadRes, this, 3000);
        this.addCD();
        this.resouceShow = new ResourceShowUI_1.ResourceShowUI(this.coinNum, this.goldNum, this.powerCountLab, this.powerTimerLab, this.addCoinBtn, this.addGoldBtn, this.addSpBtn);
        this.battleGuideLevel = GlobalParamsFunc_1.default.instance.getDataNum("battleGuideLevel");
        this.timeArr = WorkFunc_1.default.instance.getTodayExpireTime();
    }
    addCD() {
        var cd = new Laya.Label("CD");
        cd.fontSize = 50;
        cd.color = "#ff0400";
        WindowManager_1.default.topUILayer.addChild(cd);
        cd.x = 100;
        cd.y = 200;
        cd.visible = GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_CD_DEBUG);
        new ButtonUtils_1.ButtonUtils(cd, this.onClickCD, this);
    }
    //后台加载资源
    loadRes() {
        LoadManager_1.LoadManager.instance.load("res/atlas/fog/fog.atlas");
        LoadManager_1.LoadManager.instance.load("res/atlas/fog/fog.png");
        // SubPackageManager.loadDynamics(["scene_battle01", "scene_battle02", "scene_battle03", "scene_chapter_01", "scene_chapter_02"], []);
        SubPackageManager_1.default.loadDynamics([SubPackageConst_1.default.packName_equipicon, SubPackageConst_1.default.packName_expedition, SubPackageConst_1.default.packName_fogItem], []);
    }
    createChildren() {
        super.createChildren();
    }
    initBtn() {
        //gm按钮
        this.gmBtn.visible = GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_GM_DEBUG);
        new ButtonUtils_1.ButtonUtils(this.gmBtn, this.onClickGM, this);
        //开始游戏
        new ButtonUtils_1.ButtonUtils(this.gameStartBtn, this.onGameStartBtnClick, this);
        //退出游戏
        // if (!JumpManager.checkShow()) {
        //     this.returnBtn.visible = false;
        // } else {
        //     this.returnBtn.visible = true;
        //     new ButtonUtils(this.returnBtn, this.onClickExit, this);
        //     TweenAniManager.instance.scaleQipaoAni(this.returnRed)
        // }
        new ButtonUtils_1.ButtonUtils(this.turnableBtn, this.onTurnableBtnClick, this);
        //免费钻石
        new ButtonUtils_1.ButtonUtils(this.freeGoldBtn, this.clickFreeGold, this);
        new ButtonUtils_1.ButtonUtils(this.inviteBtn, this.onClickInvite, this);
        new ButtonUtils_1.ButtonUtils(this.signBtn, this.onClickSign, this);
        new ButtonUtils_1.ButtonUtils(this.flatBtn, this.onClickFlat, this);
        new ButtonUtils_1.ButtonUtils(this.formationBtn, this.onClickFormation, this);
        new ButtonUtils_1.ButtonUtils(this.fogBtn, this.onClickFog, this);
        //离线收益
        new ButtonUtils_1.ButtonUtils(this.offlineRewardGroup, this.onClickOfflineBtn, this);
        //如果禁掉了分享 微信、QQ显示
        if (GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_SHARE_NEW) || !(UserInfo_1.default.isWeb() || UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame())) {
            this.inviteBtn.visible = false;
        }
        else {
            this.inviteBtn.visible = true;
            new ButtonUtils_1.ButtonUtils(this.inviteBtn, this.onClickInvite, this);
        }
        new ButtonUtils_1.ButtonUtils(this.equipBtn, this.onClickEquip, this);
        new ButtonUtils_1.ButtonUtils(this.settimgBtn, this.onClickSet, this);
        new ButtonUtils_1.ButtonUtils(this.taskBtn, this.onClickTask, this);
        new ButtonUtils_1.ButtonUtils(this.chatTaskGroup, this.onClickTask, this);
        new ButtonUtils_1.ButtonUtils(this.workBtn, this.onClickWork, this);
    }
    /**添加事件监听 */
    addEvent() {
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY, this);
        Message_1.default.instance.add(BattleEvent_1.default.BATTLEEVENT_BATTLESTART, this);
        Message_1.default.instance.add(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLELEVEL, this);
        Message_1.default.instance.add(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK, this);
        Message_1.default.instance.add(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_FALT_REDPOINT, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_STAGE, this);
        Message_1.default.instance.add(UserEvent_1.default.USER_SP_CHANGE, this);
        Message_1.default.instance.add(RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLE_INLINE, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_DAILYGOLD, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_AIRDROP, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_DESTORY_AIRDROP, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FOG_REDPOINT, this);
        Message_1.default.instance.add(VideoAdvEvent_1.default.VIDEOADV_EVENT_ADV_SUCCESS, this);
        Message_1.default.instance.add(WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN, this);
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMIAN_EVENT_CHECKPOP, this);
        Message_1.default.instance.add(WorkEvent_1.default.WORK_REPUTE_UPDATE, this);
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
    setData(data) {
        SoundManager_1.default.playBGM(MusicConst_1.MusicConst.SOUND_MAIN_BG);
        SoundManager_1.default.setMusicVol(SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.music_switch));
        this.setInfo = data;
        this.noReadCount = 0;
        this.isShowTaskGuide = true;
        //红点
        this.flatRedPoint.visible = false;
        this.inviteRedPoint.visible = false;
        this.lastSpeakRole = "";
        this.roleSpeakTimerStamp = Client_1.default.instance.serverTime;
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
            this.mainTimer = TimerManager_1.default.instance.add(this.checkMainTimer, this, 1000);
        }
        this.checkGuide_501();
        if (!this.isInit) {
            //弹各种弹框
            this.checkIsShowPop();
        }
        else {
            this.showTaskGuide();
        }
        this.isInit = true;
        this.resetStartGuide();
        this.freshWorkRed();
        this.freshCompanyRed();
        MainJumpReturnComp_1.default.instance.showJumpReturnBtn(this);
    }
    /**刷新一些按钮的状态 */
    freshBtnState() {
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        if (level < unlock) {
            this.equipBtn.gray = true;
        }
        else {
            this.equipBtn.gray = false;
        }
        if (level < FogFunc_1.default.instance.getFogOpenLevel()) {
            this.fogBtn.gray = true;
        }
        else {
            this.fogBtn.gray = false;
        }
        this.freshWorkBtn(level);
    }
    freshWorkBtn(level = null) {
        if (!level) {
            level = UserModel_1.default.instance.getMaxBattleLevel();
        }
        var workLevel = GlobalParamsFunc_1.default.instance.getDataNum("workOpenLevel");
        if (level < workLevel) {
            this.workBtn.visible = false;
        }
        else {
            this.workBtn.visible = true;
        }
    }
    //转盘
    freshTurnTable() {
        this.turnableBtn.visible = false;
        var luckyPlateLevel = GlobalParamsFunc_1.default.instance.getDataNum("luckyPlateLevel");
        var curMaxLevel = UserExtModel_1.default.instance.getMaxLevel();
        if (Number(curMaxLevel) + 1 >= luckyPlateLevel) {
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_TURNABLE);
            var maxFreeCount = GlobalParamsFunc_1.default.instance.getDataNum("luckyPlateFreeNub");
            var nowCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.freeTurnableCount);
            Laya.Tween.clearTween(this.turnQipao);
            if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                if (nowCount < maxFreeCount) {
                    this.turnableBtn.visible = true;
                    this.turnQipao.visible = true;
                    this.turnQipaoTween();
                }
                else {
                    this.hideTurnQipao();
                }
            }
            else {
                this.turnableBtn.visible = true;
                //判断是否有免费次数
                if (nowCount < maxFreeCount) {
                    this.turnQipao.visible = true;
                    this.turnQipaoTween();
                }
                else {
                    this.hideTurnQipao();
                }
            }
        }
        //加金币、钻石
        if (this.turnableBtn.visible) {
            this.addCoinBtn.visible = true;
            this.addGoldBtn.visible = true;
        }
        else {
            this.addCoinBtn.visible = false;
            this.addGoldBtn.visible = false;
        }
    }
    /**刷新打工红点 */
    freshWorkRed() {
        if (!this.workBtn.visible)
            return;
        this.workRedImg.visible = false;
        var workInfo = WorkModel_1.default.instance.getWorkInfo();
        var isCanReceive = false;
        for (var key in workInfo) {
            if (WorkModel_1.default.instance.getIsCanReceive(key)) {
                isCanReceive = true;
                this.workRedImg.visible = true;
                break;
            }
        }
        if (!isCanReceive) {
            if (this.timeArr.indexOf(Client_1.default.instance.serverTime) != -1) {
                this.workRedImg.visible = true;
                return;
            }
        }
    }
    freshCompanyRed() {
        if (this.workRedImg.visible)
            return;
        this.workRedImg.visible = WorkModel_1.default.instance.getIsCanUpCompany();
    }
    //检测迷雾街区功能开启引导
    checkGuide_501() {
        if (UserModel_1.default.instance.getMainGuide() < 9 && UserModel_1.default.instance.getMaxBattleLevel() >= FogFunc_1.default.instance.getFogOpenLevel()) {
            this.resetStartGuide();
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_5_501, GuideManager_1.default.GuideType.Static, this.fogImg, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_5_501, null, this, null);
            this.isShowTaskGuide = false;
        }
    }
    finishGuide_501() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_5_501) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_5_501, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            }, this, true);
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
            this.freshWorkRed();
        }
        this.timeCount += 1;
    }
    freshStartBtn() {
        TweenAniManager_1.default.instance.scaleQipaoAni(this.gameStartBtn, 1.2, null, this, false);
    }
    freshStartGuide() {
        if (WindowManager_1.default.isUIOpened(WindowCfgs_1.WindowCfgs.GuideUI) || UserModel_1.default.instance.getMaxBattleLevel() > this.battleGuideLevel) {
            this.resetStartGuide();
            return;
        }
        if (!this.enterGuideImg.visible) {
            this.enterGuideImg.visible = true;
            TweenAniManager_1.default.instance.addHandTween(this.enterGuideImg);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10005, { level: UserModel_1.default.instance.getMaxBattleLevel() });
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
        if (Object.keys(TaskModel_1.default.lockTaskTab).length == 0)
            return;
        var tab = TaskModel_1.default.lockTaskTab;
        for (var id in tab) {
            if (tab[id]) {
                tab[id] -= 1000;
            }
            if (tab[id] <= 0) {
                //某个锁定任务的时间到了，刷新一次任务
                delete TaskModel_1.default.lockTaskTab[id];
                this.freshChatTaskRed();
                var task = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.TaskUI);
                //如果任务界面开着的话刷新一下主线任务
                if (task && task.visible) {
                    task.freshChatGroup();
                }
            }
        }
    }
    freshTaskShow() {
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        if (level < GlobalParamsFunc_1.default.instance.getDataNum("taskUnlock")) {
            this.taskBtn.visible = false;
            this.chatTaskGroup.visible = false;
        }
        else {
            this.taskBtn.visible = true;
        }
    }
    //刷新阵容红点
    freshLineRed() {
        var allRole = RolesModel_1.default.instance.getInLineRole();
        var unlockLine = GlobalParamsFunc_1.default.instance.getUnlockLineCount();
        if (unlockLine > allRole.length) {
            this.formationRed.visible = true;
        }
        else {
            this.formationRed.visible = false;
        }
    }
    /**刷新日程红点 */
    freshChatTaskRed() {
        this.dailyRedImg.visible = false;
        if (!this.taskBtn.visible)
            return;
        var roleArr = [];
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        TaskFunc_1.default.instance.getTask();
        var allInfo = TaskFunc_1.default.chatTaskArr;
        var target;
        var isShowRed = false;
        this.noReadCount = 0;
        for (var i = 0; i < allInfo.length; i++) {
            var item = allInfo[i];
            var condition = item.condition;
            var unlock = false;
            if (condition) {
                if (TaskModel_1.default.instance.getTaskIsUnlock(condition, level)) {
                    unlock = true;
                }
            }
            else {
                unlock = true;
            }
            if (unlock) {
                if (roleArr.indexOf(item.role) == -1) {
                    var state = TaskModel_1.default.instance.getChatTaskStateById(item);
                    if (state) {
                        if (state == TaskConst_1.default.Chat_state_canReceive) {
                            isShowRed = true;
                        }
                        if (state == TaskConst_1.default.Chat_state_canReceive || state == TaskConst_1.default.Chat_state_noFinish && !target) {
                            target = item;
                        }
                        else if (state == TaskConst_1.default.Chat_state_noRead) {
                            this.noReadCount += 1;
                        }
                        roleArr.push(item.role);
                    }
                }
            }
        }
        if (target) {
            this.chatTaskGroup.visible = true;
            var role = TaskChatFunc_1.default.instance.getCfgDatas("TaskRole", target.role);
            var name = TranslateFunc_1.default.instance.getTranslate(role.name);
            this.taskName.text = TranslateFunc_1.default.instance.getTranslate("#tid_task_chat_title", null, name);
            var info = TaskConditionTrigger_1.default.checkTaskCondition(target);
            this.taskDesc.text = TranslateFunc_1.default.instance.getTranslate(target.name);
            if (!info.noProcess) {
                this.taskDesc.text += "(" + info.cur + "/" + info.target + ")";
            }
            else {
                if (info.finish) {
                    this.taskDesc.text += "(1/1)";
                }
                else {
                    this.taskDesc.text += "(0/1)";
                }
            }
            if (info.finish) {
                this.taskName.color = "#19d112";
                this.taskDesc.color = "#19d112";
            }
            else {
                this.taskName.color = "#ffffff";
                this.taskDesc.color = "#ffffff";
            }
        }
        else {
            this.chatTaskGroup.visible = false;
        }
        if (this.noReadCount > 0) {
            this.taskRedTxt.text = this.noReadCount + "";
            this.taskPhone.rotation = 0;
            Laya.Tween.clearAll(this.taskPhone);
            TweenAniManager_1.default.instance.shakingAni(this.taskPhone);
            this.dailyRedImg.visible = true;
        }
        else {
            this.taskRedTxt.text = "";
            this.taskPhone.rotation = 0;
            Laya.Tween.clearAll(this.taskPhone);
            if (isShowRed) {
                this.dailyRedImg.visible = true;
            }
            else {
                this.freshDailyTaskRed();
            }
        }
    }
    /**刷新每日任务红点 */
    freshDailyTaskRed() {
        if (!this.taskBtn.visible)
            return;
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        if (level < GlobalParamsFunc_1.default.instance.getDataNum("dailyTaskUnlock")) {
            return;
        }
        this.dailyRedImg.visible = TaskModel_1.default.instance.getDailyRed();
    }
    /**刷新进入的红点 */
    freshEnterRed() {
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        var chapter = ChapterFunc_1.default.instance.getAllCfgData("Chapter");
        var startMap = ChapterFunc_1.default.instance.getUnlockTab();
        var isShowRed = false;
        for (var id in chapter) {
            //如果章节已解锁
            if (startMap[id] <= level) {
                isShowRed = ChapterModel_1.default.instance.getIsShowRedByChapter(id);
                if (isShowRed)
                    break;
            }
        }
        this.enterRedImg.visible = isShowRed;
    }
    //刷新装备红点
    freshEquipRed() {
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        if (UserModel_1.default.instance.getMaxBattleLevel() < unlock) {
            this.equipRed.visible = false;
            return;
        }
        var freeGetCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceFreeGet);
        this.equipRed.visible = !freeGetCount;
    }
    //是否需要弹出空投
    checkAirDropView(data) {
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_SUPPLYBOX);
        if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            return;
        }
        //如果是结算回来的 则判断是否生成空投或刷新空投
        if (data && data.fromResultLevel) {
            var levelId = data.fromResultLevel;
            if (LevelFunc_1.default.instance.checkAirDropShow(levelId)) {
                var supplyBox = GlobalParamsFunc_1.default.instance.getDataNum("supplyBox");
                //出现新空投    如果已经存在空投  则刷新当前空投最大持续时间
                if (this.airDropView) {
                    this.continueAirDropTween(supplyBox);
                }
                else {
                    this.airDropView = new Laya.Image(ResourceConst_1.default.AIRDROP_PNG);
                    this.airDropView.x = this.initX;
                    this.airDropView.y = this.initY;
                    this.addChild(this.airDropView);
                    //动画
                    this.startAirDropTween();
                    //设置持续时间
                    this.startTime = Client_1.default.instance.miniserverTime;
                    this.totalLife = supplyBox;
                    this.setAirDropLife(this.totalLife);
                    //修改持续时间
                    this.nowLife = this.startTime + this.totalLife - Client_1.default.instance.miniserverTime;
                    //空投宝箱
                    new ButtonUtils_1.ButtonUtils(this.airDropView, this.onClickAirDrop, this);
                }
            }
            else {
                //如果已经存在空投  则继续之前的计时
                if (this.airDropView) {
                    this.continueAirDropTween();
                }
            }
        }
        else {
            //如果已经存在空投  则继续之前的计时
            if (this.airDropView) {
                this.continueAirDropTween();
            }
        }
        //检测过一次以后清空结算返回数据
        this.setInfo = null;
    }
    //继续计时
    continueAirDropTween(time) {
        this.airDropView.visible = true;
        if (time) {
            this.setAirDropLife(time);
            this.startTime = Client_1.default.instance.miniserverTime;
            this.totalLife = time;
        }
        else {
            this.setAirDropLife(this.nowLife);
        }
    }
    //打开界面
    onClickAirDrop() {
        this.airDropView.visible = false;
        //修改持续时间
        this.nowLife = this.startTime + this.totalLife - Client_1.default.instance.miniserverTime;
        //打开界面
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.AirDropDetailUI);
    }
    setAirDropLife(time) {
        if (time < 0) {
            this.distroyView();
        }
        TimerManager_1.default.instance.removeByCallBack(this, this.distroyView);
        TimerManager_1.default.instance.setTimeout(this.distroyView, this, time);
    }
    //领取或到达最大持续时间后销毁
    distroyView() {
        Laya.Tween.clearAll(this.airDropView);
        TimerManager_1.default.instance.removeByCallBack(this, this.distroyView);
        this.removeChild(this.airDropView);
        this.airDropView = null;
        this.startTime = 0;
        this.totalLife = 0;
    }
    //空投宝箱动画
    startAirDropTween() {
        var maxX = ScreenAdapterTools_1.default.width - this.thisWidth / 2;
        var sinRate = (maxX - this.initX) / 4;
        Laya.Tween.to(this.airDropView, { x: maxX, rotation: 20 }, 7000, Laya.Ease.sineIn, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.airDropView, { x: this.initX, rotation: -20 }, 7000, Laya.Ease.sineOut, Laya.Handler.create(this, this.startAirDropTween));
        }));
    }
    //检测各种弹窗
    checkIsShowPop() {
        if (this._isShowPop)
            return;
        this.checkIsShowOffline();
        this.checkIsSevenPop();
        this.checkIsShowTaskGuide();
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
                this._popTeam["taskGuide"] = true;
            }
        }
        if (!this._isShowPop) {
            this._popTeam["taskGuide"] = true;
        }
    }
    //展示任务引导
    showTaskGuide() {
        var a = WindowManager_1.default.getCurrentWindowName();
        var b = UserModel_1.default.instance.getMaxBattleLevel();
        var c = GlobalParamsFunc_1.default.instance.getDataNum("taskGuideMaxLevel");
        var d = !BattleFunc_1.default.instance.IshowGuide_403();
        if (this.isShowTaskGuide && this.noReadCount > 0 && WindowManager_1.default.getCurrentWindowName() == WindowCfgs_1.WindowCfgs.GameMainUI && UserModel_1.default.instance.getMaxBattleLevel() < GlobalParamsFunc_1.default.instance.getDataNum("taskGuideMaxLevel") && !BattleFunc_1.default.instance.IshowGuide_403()) {
            this.resetStartGuide();
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_10003, GuideManager_1.default.GuideType.Static, this.taskImg, this, null, null, null, null, { name: this.noReadCount });
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_10003);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_10003, { level: UserModel_1.default.instance.getMaxBattleLevel() });
            return true;
        }
        return false;
    }
    //检测是否显示离线收益
    checkIsShowOffline() {
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_OFFLINE);
        if (!this._popTeam["offline"] && !this._isShowPop && (freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE)) {
            //更新数据
            UserExtServer_1.default.updateOfflineTime();
            if (UserExtModel_1.default.instance.getOfflineTime() != 0) {
                if (UserExtModel_1.default.instance.getMaxLevel() >= GlobalParamsFunc_1.default.instance.getDataNum("offLineStartLvel")) {
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
        var isCan = SevenDayModel_1.default.instance.checkSignRedPoint();
        var sevenDaySwitch = GlobalParamsFunc_1.default.instance.getDataNum("sevenDaySwitch");
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
        if (UserExtModel_1.default.instance.getMaxLevel() >= GlobalParamsFunc_1.default.instance.getDataNum("sevenDayReward")) {
            this.signBtn.visible = true;
        }
        else {
            this.signBtn.visible = false;
        }
        this.freshSignRedPoint();
    }
    //刷新七日登录红点
    freshSignRedPoint() {
        if (SevenDayModel_1.default.instance.checkSignRedPoint()) {
            this.signRedPoint.visible = true;
        }
        else {
            this.signRedPoint.visible = false;
        }
    }
    //开始增加互推
    startAddJumpView() {
        var posArr = [
            { x: -20, y: 50 },
            { x: -20, y: 200 },
            { x: -20, y: 350 },
            { x: -530, y: 250 },
        ];
        JumpManager_1.default.addMainJump(this, JumpConst_1.default.MAIN_SIDE, posArr);
    }
    //开始战斗
    onGameStartBtnClick() {
        this.isShowUnlock = false;
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_2_204) {
            this.showGuide_204_finish();
        }
        var data = {};
        if (this.enterGuideImg.visible) {
            data = {
                showGuide: 1
            };
        }
        WindowManager_1.default.SwitchUI([WindowCfgs_1.WindowCfgs.ChapterListUI], [WindowCfgs_1.WindowCfgs.GameMainUI], data);
        this.close();
    }
    initFlatPanel() {
        //获取role数据
        this.roleData = [];
        this.roleIdToFlatTable = [];
        var roleList = RolesFunc_1.default.instance.getAllRole();
        var roleInfo;
        for (var id in roleList) {
            roleInfo = RolesFunc_1.default.instance.getRoleInfoById(id);
            if (roleInfo && roleInfo.mainShowOrder) {
                this.roleData.push(roleInfo);
            }
        }
        this.roleData.sort(this.sortByOrder);
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.FlatItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initPanelData));
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
            }
            else {
                leftData = this.roleData[i - 2];
                rightData = this.roleData[i - 1];
                this.roleIdToFlatTable.push(leftData["id"]);
                this.roleIdToFlatTable.push(rightData["id"]);
                i = i - 2;
            }
            var flatItem;
            var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_FLAT + floorNum);
            if (cacheItem) {
                flatItem = cacheItem;
            }
            else {
                flatItem = new FlatItemUI_1.default(floorNum, leftData, rightData, this);
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
        }
        else {
            this.freshWorkBtn();
        }
        DisplayUtils_1.default.setPanelScrollVisbie(this.flatArea, true);
        this.flatArea["changeScroll"].call(this.flatArea);
        TimerManager_1.default.instance.setTimeout(() => {
            if (unlockRole) {
                DisplayUtils_1.default.setPanelScrollVisbie(this.flatArea, false);
                // this.flatArea.scrollTo(0,0);
                this.flatArea.scrollTo(0, unlockY - this.flatAreaHeight);
                if (this.airDropView) {
                    this.airDropView.visible = false;
                }
                if (Number(unlockRole.level) == 1) {
                    this.showGuide_10001(unlockRole.item, unlockRole.level, unlockRole.id);
                }
                else {
                    this.showGuide_10001(unlockRole.item, unlockRole.level, unlockRole.id);
                }
            }
            else {
                //滚动条位置调整
                this.flatArea.scrollTo(0, 0);
                this.flatArea.scrollTo(0, 3000);
                this.showGuide_204();
                if (BattleFunc_1.default.instance.IshowGuide_403()) {
                    this.mouseEnabled = false;
                    this.mouseThrough = true;
                    this.showGuide_403();
                }
                //如果是结算界面回来的,判断是否弹出空投宝
                this.checkAirDropView(this.setInfo);
            }
        }, this, 100);
    }
    /**英雄解锁引导 */
    showGuide_10001(item, level, id) {
        var guideId;
        if (Number(level) == 1) {
            guideId = GuideConst_1.default.GUIDE_2_202;
        }
        else {
            guideId = GuideConst_1.default.GUIDE_ROLEUNLOCK;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.GUIDE_UNLOCKROLE, { id: id });
        }
        var names = TranslateFunc_1.default.instance.getTranslate(BattleFunc_1.default.instance.getCfgDatasByKey("Role", id, "name"));
        GuideManager_1.default.ins.setGuideData(guideId, GuideManager_1.default.GuideType.Static, item, this, null, null, null, null, { "name": names });
        GuideManager_1.default.ins.openGuideUI(guideId, null, this, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            if (guideId == GuideConst_1.default.GUIDE_2_202) {
                GuideManager_1.default.ins.guideFin(guideId, null, null, true);
            }
            this.checkAirDropView(this.setInfo);
            this.freshWorkBtn();
            this.flatArea.vScrollBar.touchScrollEnable = true;
        });
    }
    /**进入战斗引导 */
    showGuide_204() {
        //大于一关就不引导进入游戏了 并且没有进行过该步引导  该步是第四步
        if (UserModel_1.default.instance.getMaxBattleLevel() == 1 && UserModel_1.default.instance.getMainGuide() <= 3) {
            this.resetStartGuide();
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_2_204, GuideManager_1.default.GuideType.Static, this.gameStartBtn, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_2_204, null, this, this.showGuide_204_finish);
            this.isShowTaskGuide = false;
            return true;
        }
        return false;
    }
    showGuide_204_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_2_204, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }, this);
    }
    /**展示布阵引导 */
    showGuide_301() {
        if (UserModel_1.default.instance.getMainGuide() <= 4) {
            this.isShowTaskGuide = false;
            this.resetStartGuide();
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_3_301, GuideManager_1.default.GuideType.Static, this.formationImg, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_3_301, this.showLine, this, this.showGuide_301_finish);
        }
    }
    showGuide_301_finish(asyc = true) {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_3_301, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }, this, asyc);
    }
    showLine() {
        this.showGuide_301_finish(false);
        this.onClickFormation();
    }
    showGuide_403() {
        this.mouseThrough = false;
        this.mouseEnabled = true;
        var item = this.flatArea.getChildAt(this.flatArea.numChildren - 1);
        this.resetStartGuide();
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_403, GuideManager_1.default.GuideType.Static, item.leftRoleClickArea, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_403, null, this, this.showGuide_408);
    }
    /**装备抽取引导 */
    showGuide_408() {
        if (UserModel_1.default.instance.getMainGuide() == 7 && !CountsModel_1.default.instance.getCountsById(CountsModel_1.default.equipPieceFreeGet)) {
            this.resetStartGuide();
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_408, GuideManager_1.default.GuideType.Static, this.equipImg, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_408, this.showGuide_408_finish, this);
            this.isShowTaskGuide = false;
        }
    }
    showGuide_408_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_408, () => {
            this.onClickEquip();
        }, this, false);
    }
    /**获取目标角色 */
    getTargetRole(id) {
        var target;
        var role;
        for (var i = 0; i < this.flatArea.numChildren; i++) {
            var item = this.flatArea.getChildAt(i);
            if (item.leftRoleData.id == id) {
                target = item;
                role = item.leftRoleClickArea;
                break;
            }
            else if (item.rightRoleData.id == id) {
                target = item;
                role = item.rightRoleClickArea;
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
            var flatItem = this.flatArea.getChildAt(i);
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
        if (this['windowName'] != WindowManager_1.default.getCurrentWindowName()) {
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
                }
                else {
                    item.freshLeftComposeTxt();
                }
            }
        }
    }
    checkRoleSpeak() {
        //如果玩家在主界面停留超过n秒
        if (this['windowName'] == WindowManager_1.default.getCurrentWindowName()) {
            var mainSpeakInterval = GlobalParamsFunc_1.default.instance.getDataNum("mainSpeakInterval") / 1000;
            if (Client_1.default.instance.serverTime - this.roleSpeakTimerStamp >= mainSpeakInterval) {
                this.chooseRoleSpeak();
                this.roleSpeakTimerStamp = Client_1.default.instance.serverTime;
            }
        }
        else {
            //重置时间戳
            this.roleSpeakTimerStamp = Client_1.default.instance.serverTime;
        }
    }
    //获取角色的朝向
    getRoleWay(index) {
        var roleWay;
        if (this.roleIdToFlatTable.length % 2 != 0) {
            if (index == 0) {
                roleWay = "left";
            }
            else {
                if (index % 2) {
                    roleWay = "left";
                }
                else {
                    roleWay = "right";
                }
            }
        }
        else {
            if (index % 2) {
                roleWay = "right";
            }
            else {
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
            }
            else {
                flatNum = Math.ceil(index / 2);
            }
        }
        else {
            flatNum = Math.floor(index / 2);
        }
        item = this.flatArea.getChildAt(flatNum);
        return item;
    }
    chooseRoleSpeak() {
        // 玩家切换到主界面后，每隔n秒，会有已解锁，且显示在屏幕中的角色随机说话。
        // 显示在屏幕中的判定条件为：楼层有超过一定万分比的区域显示在屏幕中。
        var roleData = RolesModel_1.default.instance.getRolesList();
        var chooseArr = [];
        for (var roleId in roleData) {
            var roleInfo = RolesFunc_1.default.instance.getRoleInfoById(roleId);
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
        var random = GameUtils_1.default.getRandomInt(0, chooseArr.length - 1);
        if (chooseArr[random] && chooseArr[random][0]) {
            var mainSpeak = RolesFunc_1.default.instance.getRoleDataById(chooseArr[random][0], "mainSpeak");
            if (mainSpeak) {
                var speakRandom = GameUtils_1.default.getRandomInt(0, mainSpeak.length - 1);
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
        var mainShowPercent = GlobalParamsFunc_1.default.instance.getDataNum("mainShowPercent") / 10000;
        var value = this.flatArea.vScrollBar.value;
        if (y < value) {
            var ratioToTop = (this.flatHeight - (value - y)) / this.flatHeight;
            if (ratioToTop >= mainShowPercent) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (y == value) {
            return true;
        }
        else {
            if (y - value + this.flatHeight < this.bottomGroup.y) {
                return true;
            }
            else {
                var ratioToButtom = (this.bottomGroup.y - (y - value)) / this.flatHeight;
                if (ratioToButtom >= mainShowPercent) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
    //GM按钮
    onClickGM() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TestOpListUI);
    }
    onClickCD() {
        WindowManager_1.default.OpenUI(WindowCommonCfgs_1.default.ChangeDataView);
    }
    onAddSpClick() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FreeResourceUI, { type: DataResourceFunc_1.DataResourceType.SP });
    }
    //转盘按钮
    onTurnableBtnClick() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
    }
    onClickInvite() {
        UserExtServer_1.default.setEverydayInvite(1, () => {
            this.refreshInviteRedPoint();
        }, this);
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.InviteUI);
    }
    onClickSign() {
        this._popTeam["sevenday"] = true;
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.SevenDaysUI);
    }
    onClickFormation() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.RoleInLineUI);
    }
    //点击装备抽取
    onClickEquip() {
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        if (UserModel_1.default.instance.getMaxBattleLevel() < unlock) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_equip_openLevel", null, ChapterFunc_1.default.instance.getOpenConditionByLevel(unlock)));
            return;
        }
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.MainShopUI);
    }
    //点击设置
    onClickSet() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.SettingUI);
    }
    //点击任务
    onClickTask() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_10003) {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TaskUI);
    }
    onClickWork() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.WorkDetailUI);
    }
    //进入基地升级界面
    onClickFlat() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.HomeUpgradeUI);
    }
    //初始化迷雾街区按钮
    initFog() {
        this.fogLab.visible = false;
        this.fogRedPoint.visible = false;
        //获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
        var status = FogFunc_1.default.instance.getFogEnterStatus();
        //使用免费次数进入：显示次数；当天有未用完的次数时，显示红点
        if (status == FogConst_1.default.FOG_STATUS_COST_FREE_COUNT) {
            this.fogLab.visible = true;
            var fogStreetCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.fogStreetCount);
            var fogStreetTimes = GlobalParamsFunc_1.default.instance.getDataNum("fogStreetTimes");
            this.fogLab.text = "(" + fogStreetCount + "/" + fogStreetTimes + ")";
            if (fogStreetCount < fogStreetTimes) {
                this.fogRedPoint.visible = true;
            }
        }
        //有缓存数据：显示红点和当前层数
        else if (status == FogConst_1.default.FOG_STATUS_ENTER) {
            var curLayer = FogModel_1.default.instance.getCurLayer() + 1;
            if (curLayer) {
                this.fogLab.visible = true;
                this.fogLab.text = curLayer + "层";
            }
            this.fogRedPoint.visible = true;
        }
    }
    refreshFogRedPoint() {
        this.fogRedPoint.visible = false;
        var status = FogFunc_1.default.instance.getFogEnterStatus();
        //使用免费次数进入：显示次数；当天有未用完的次数时，显示红点
        if (status == FogConst_1.default.FOG_STATUS_COST_FREE_COUNT || status == FogConst_1.default.FOG_STATUS_COST_FREE_COUNT_LIMIT) {
            this.fogLab.visible = true;
            var fogStreetCount = CountsModel_1.default.instance.getCountsById(CountsModel_1.default.fogStreetCount);
            var fogStreetTimes = GlobalParamsFunc_1.default.instance.getDataNum("fogStreetTimes");
            this.fogLab.text = "(" + fogStreetCount + "/" + fogStreetTimes + ")";
            if (fogStreetCount < fogStreetTimes) {
                this.fogRedPoint.visible = true;
            }
        }
        //有缓存数据：显示红点和当前层数
        else if (status == FogConst_1.default.FOG_STATUS_ENTER) {
            this.fogRedPoint.visible = true;
        }
    }
    onClickFog() {
        //获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
        var status = FogFunc_1.default.instance.getFogEnterStatus();
        this.isShowUnlock = false;
        //功能未开启
        if (status == FogConst_1.default.FOG_STATUS_NOT_OPEN) {
            var fogOpeneLevel = FogFunc_1.default.instance.getFogOpenLevel();
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_equip_openLevel", null, ChapterFunc_1.default.instance.getOpenConditionByLevel(fogOpeneLevel)));
            return;
        }
        //有缓存数据，直接进入
        else if (status == FogConst_1.default.FOG_STATUS_ENTER) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogMainUI, { quickShowGuide: 1 });
            this.close();
        }
        //使用免费次数进入
        else if (status == FogConst_1.default.FOG_STATUS_COST_FREE_COUNT) {
            CountsServer_1.default.updateCount({ "id": CountsModel_1.default.fogStreetCount }, () => {
                this.enterFog();
                this.refreshFogRedPoint();
            }, this);
        }
        //免费次数刚用完
        else if (status == FogConst_1.default.FOG_STATUS_COST_FREE_COUNT_LIMIT) {
            this.refreshFogRedPoint();
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogVideoEnterUI, { "callBack": this.enterFog, "thisObj": this });
        }
        //视频视频次数进入
        else if (status == FogConst_1.default.FOG_STATUS_COST_VIDEO_COUNT) {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogVideoEnterUI, { "callBack": this.enterFog, "thisObj": this });
        }
        //不能进入
        else if (status == FogConst_1.default.FOG_STATUS_NO_ENTER) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_counts_limit_lab"));
            return;
        }
    }
    //迷雾街区进入界面
    enterFog() {
        //首次进入玩法时，弹出以上漫画剧情;非首次，则直接进入下一步初始角色
        if (UserExtModel_1.default.instance.getEnterFogFlag()) {
            WindowManager_1.default.SwitchUI([WindowCfgs_1.WindowCfgs.FogMainUI, WindowCfgs_1.WindowCfgs.FogInitRoleUI], [WindowCfgs_1.WindowCfgs.GameMainUI]);
        }
        else {
            this.finishGuide_501();
            UserExtServer_1.default.setEnterFogFlag(1, () => {
                WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.FogCartoonPicUI, WindowCfgs_1.WindowCfgs.GameMainUI);
            }, this);
        }
        this.dispose();
    }
    /*点击退出按钮*/
    onClickExit(aa) {
        // 添加互推图标
        JumpManager_1.default.initJumpData(JumpManager_1.default.showMainJumpKariqu, JumpManager_1.default, JumpConst_1.default.MAIN_SIDE);
    }
    //打开免费金币
    openSpAddScene() {
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FREE_SP);
        if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_battle_noenoughsp"));
        }
        else {
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FreeResourceUI, { type: DataResourceFunc_1.DataResourceType.SP });
        }
    }
    clickFreeGold() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.DailyGoldUI);
    }
    //战斗开始以后
    onBattleStart() {
        BattleServer_1.default.battleStart(null, this);
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.GameMainUI);
        this.dispose();
    }
    dispose() {
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.taskPhone);
        Laya.Tween.clearAll(this.enterGuideImg);
        //移除定时器
        if (this.mainTimer) {
            TimerManager_1.default.instance.remove(this.mainTimer);
            this.mainTimer = 0;
        }
        this.cacheFlatItem();
        // this.cacheRoleSpine();
    }
    cacheFlatItem() {
        for (var index = 0; index < this.flatArea.numChildren; index++) {
            var preFlatItem = this.flatArea.getChildAt(index);
            //按楼层缓存item
            if (preFlatItem) {
                PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_FLAT + (this.flatArea.numChildren - index), preFlatItem);
            }
        }
    }
    cacheRoleSpine() {
        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                if (item.leftRoleAnim) {
                    PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + +item.leftRoleData.id, item.leftRoleAnim);
                }
                if (item.rightRoleAnim) {
                    PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + item.rightRoleData.id, item.rightRoleAnim);
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
        if (UserExtModel_1.default.instance.getEverydayInvite() != 1 || UserModel_1.default.instance.checkNoGetInviteReward()) {
            this.inviteRedPoint.visible = true;
        }
        else {
            this.inviteRedPoint.visible = false;
        }
    }
    refreshFlatRedpoint() {
        if (RolesModel_1.default.instance.checkFlatRedPoint()) {
            this.flatRedPoint.visible = true;
        }
        else {
            this.flatRedPoint.visible = false;
        }
    }
    //根据条件显示或隐藏每日免费钻石
    freshFreeGold() {
        var dailyGoldCount;
        var dailyGold = DailyGoldModel_1.default.instance.getDailyGold();
        if (dailyGold.currentStep && !dailyGold.currentGoldStep) {
            dailyGoldCount = dailyGold.currentStep;
        }
        else {
            dailyGoldCount = dailyGold.currentGoldStep;
        }
        var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_DAILYGOLD);
        if (DailyDiamondFunc_1.default.instance.getMaxId() <= dailyGoldCount || freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE || UserExtModel_1.default.instance.getMaxLevel() < GlobalParamsFunc_1.default.instance.getDataNum("freeShowTvdiamond")) {
            this.freeGoldBtn.visible = false;
        }
        else {
            this.freeGoldBtn.visible = true;
        }
    }
    freshOfflineIcon() {
        if (UserExtModel_1.default.instance.getMaxLevel() < GlobalParamsFunc_1.default.instance.getDataNum("offLineStartLvel")) {
            this.offlineRewardGroup.visible = false;
            return;
        }
        if (UserExtModel_1.default.instance.getOfflineTime() != 0) {
            //显示离线收益图标
            this.offlineRewardGroup.visible = true;
            var reward = UserExtModel_1.default.instance.calcuOfflineReward();
            this.lbl_offlineReward.text = StringUtils_1.default.getCoinStr(reward[1]);
        }
        else {
            this.offlineRewardGroup.visible = false;
        }
    }
    onClickOfflineBtn() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.OfflineIncomeUI);
    }
    //引导检测
    freshCheckGuide(data) {
        if (data == GuideConst_1.default.GUIDE_2_204) {
            this.showGuide_204();
        }
        else if (data == GuideConst_1.default.GUIDE_3_301) {
            this.showGuide_301();
        }
        else if (data == GuideConst_1.default.GUIDE_ROLEUNLOCK) {
            this.checkAirDropView(this.setInfo);
            this.freshWorkBtn();
            DisplayUtils_1.default.setPanelScrollVisbie(this.flatArea, true);
        }
        else if (data == GuideConst_1.default.GUIDE_4_408) {
            this.showGuide_408();
        }
        else if (data == GuideConst_1.default.GUIDE_10003) {
            this.isShowTaskGuide = true;
            this.showTaskGuide();
        }
    }
    /**刷新红点 */
    freshMainRedPoint(data) {
        if (data == RedPointConst_1.default.POINT_MAIN_EQUIP) {
            this.freshEquipRed();
        }
        else if (data == RedPointConst_1.default.POINT_MAIN_TURNTABLE) {
            this.hideTurnQipao();
        }
        else if (data == RedPointConst_1.default.POINT_MAIN_SEVENDAY) {
            this.freshSignRedPoint();
        }
        else if (data == RedPointConst_1.default.POINT_MAIN_INVITEFRIEND) {
            this.refreshInviteRedPoint();
        }
        else if (data == RedPointConst_1.default.POINT_MAIN_LINERED) {
            this.freshLineRed();
        }
        else if (data == RedPointConst_1.default.POINT_MAIN_TASKRED) {
            this.freshChatTaskRed();
        }
    }
    showAirdropView() {
        if (this.airDropView) {
            this.airDropView.visible = true;
        }
    }
    checkDisposeUI() {
        if (WindowManager_1.default.getCurrentFullWindow() == this) {
            this.setRoleAniStop(false);
        }
        else {
            this.setRoleAniStop(true);
        }
    }
    setRoleAniStop(stop) {
        for (var i = 0; i < this.roleIdToFlatTable.length; i++) {
            var item = this.getFlatItem(i);
            if (item) {
                if (item.leftRoleAnim) {
                    if (stop) {
                        item.leftRoleAnim.stop();
                    }
                    else {
                        item.leftRoleAnim.resume();
                    }
                }
                if (item.rightRoleAnim) {
                    if (stop) {
                        item.rightRoleAnim.stop();
                    }
                    else {
                        item.rightRoleAnim.resume();
                    }
                }
            }
        }
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            //刷新货币、红点
            case GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshRedPoint();
                this.refreshAllRoleUpgradeBtn();
                break;
            //战斗开始扣体力    
            case BattleEvent_1.default.BATTLEEVENT_BATTLESTART:
                this.onBattleStart();
                break;
            //角色升级刷新等级
            case RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLELEVEL:
                this.refreshRoleLevel(data);
                this.refreshRoleUpgradeBtn(data);
                break;
            //角色解锁后刷新主界面显示
            case RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLEUNLOCK:
                this.unlockRefreshRole(data);
                break;
            //基地升级后刷新主界面基地红点    
            case RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_FALT_REDPOINT:
                this.refreshFlatRedpoint();
                break;
            //通关刷新界面角色解锁、每日钻石按钮刷新、七日登录界面首次弹出检测
            case GameMainEvent_1.default.GAMEMAIN_EVENT_STAGE:
                this.refreshAllRoleUnlock();
                this.freshFreeGold();
                this.checkIsSevenPop();
                //不展示碎片引导的情况再判断解锁引导  
                this.isShowUnlock = !BattleFunc_1.default.instance.IshowGuide_403();
                break;
            //角色上阵刷新主界面
            case RoleEvent_1.default.ROLE_EVENT_GAMEMAIN_ROLE_INLINE:
                this.refreshRoleInline();
                break;
            //刷新每日钻石
            case GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_DAILYGOLD:
                this.freshFreeGold();
                break;
            //刷新离线收益按钮    
            case GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_OFFLINE_ICON:
                this.freshOfflineIcon();
                break;
            case GameMainEvent_1.default.GAMEMAIN_EVENT_FRESH_GUIDE:
                this.freshCheckGuide(data);
                break;
            //刷新空投宝箱    
            case GameMainEvent_1.default.GAMEMAIN_EVENT_REFRESH_AIRDROP:
                this.showAirdropView();
                break;
            case GameMainEvent_1.default.GAMEMAIN_EVENT_DESTORY_AIRDROP:
                this.distroyView();
                break;
            case GameMainEvent_1.default.GAMEMAIN_EVENT_REDPOINT:
                this.freshMainRedPoint(data);
                break;
            //刷新迷雾街区红点    
            case GameMainEvent_1.default.GAMEMAIN_EVENT_FOG_REDPOINT:
                this.refreshFogRedPoint();
                break;
            //更新看视频任务次数
            case VideoAdvEvent_1.default.VIDEOADV_EVENT_ADV_SUCCESS:
                TaskServer_1.default.updateTaskProcess({ logicType: TaskConditionTrigger_1.default.taskCondition_videoCount });
                break;
            case WindowEvent_1.default.WINDOW_EVENT_SWITCHUIFIN:
                this.checkDisposeUI();
                break;
            case GameMainEvent_1.default.GAMEMIAN_EVENT_CHECKPOP:
                this.reCheckShowPop();
                break;
            case WorkEvent_1.default.WORK_REPUTE_UPDATE:
                this.freshWorkRed();
                break;
        }
    }
}
exports.default = GameMainUI;
//# sourceMappingURL=GameMainUI.js.map