"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleUI = void 0;
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const BattleSceneManager_1 = require("../../manager/BattleSceneManager");
const Message_1 = require("../../../../framework/common/Message");
const BattleEvent_1 = require("../../event/BattleEvent");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const BattleFunc_1 = require("../../func/BattleFunc");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const SoundManager_1 = require("../../../../framework/manager/SoundManager");
const MusicConst_1 = require("../../consts/MusicConst");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const LevelFunc_1 = require("../../func/LevelFunc");
const RolesFunc_1 = require("../../func/RolesFunc");
const RolesModel_1 = require("../../model/RolesModel");
const BattleConst_1 = require("../../consts/BattleConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const SubPackageManager_1 = require("../../../../framework/manager/SubPackageManager");
const FogFunc_1 = require("../../func/FogFunc");
const FogModel_1 = require("../../model/FogModel");
const FogPropTrigger_1 = require("../../../fog/trigger/FogPropTrigger");
const FogConst_1 = require("../../consts/FogConst");
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const JumpConst_1 = require("../../consts/JumpConst");
const GameConsts_1 = require("../../consts/GameConsts");
const TweenAniManager_1 = require("../../manager/TweenAniManager");
const GameSwitch_1 = require("../../../../framework/common/GameSwitch");
const GameSwitchConst_1 = require("../../consts/GameSwitchConst");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
class BattleUI extends layaMaxUI_1.ui.gameui.battle.BattleUI {
    constructor() {
        super();
        /**是否启用自动跟随 */
        this.isUseCamera = true;
        /**最大能量 */
        this.maxEnergy = 0;
        /**当前能量 */
        this.nowEnergy = 0;
        /**恢复一点能量耗时 帧数 */
        this.recoverPer = 60;
        this.nowAreaMaxX = 0;
        /**当前手机高度和小地图高度的比例 */
        this.mapHeightRate = 1;
        this.isAllowFollw = true;
        this.handBaseY = 0;
        this.arrowCode = 0;
        //豪华开局效果id
        this.battleAdditionId = 0;
        this.tweenCode = 0;
        //飘字持续时间
        this.continueTime = 0;
        //战斗变慢倍数
        this.timeRate = 0;
        this.recoverCode = 0;
        this.energyCostTable = {};
        this.levelName = "";
        this.isVideoGetRole = false; //是否看视频获得角色
        this.isShowRandomRoleEvent = true; //是否可以进行随机角色的show打点
        new ButtonUtils_1.ButtonUtils(this.pauseBtn, this.onClickPauseBtn, this);
        new ButtonUtils_1.ButtonUtils(this.returnMainBtn, this.onClickMainBtn, this);
        new ButtonUtils_1.ButtonUtils(this.continueBtn, this.onContinueBtn, this);
        new ButtonUtils_1.ButtonUtils(this.rePlayBtn, this.onReplayGame, this);
        new ButtonUtils_1.ButtonUtils(this.autoGroup, this.onClickCameraFollow, this);
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
        this.battleCtn.on(Laya.Event.MOUSE_DOWN, this, this.onTouchBegin);
        this.battleCtn.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove);
        this.battleCtn.on(Laya.Event.MOUSE_UP, this, this.onTouchUp);
        new ButtonUtils_1.ButtonUtils(this.startWarBtn, this.onClickStartWar, this);
        new ButtonUtils_1.ButtonUtils(this.roleSignBtn, this.onClickRoleSign, this);
        new ButtonUtils_1.ButtonUtils(this.enemySignBtn, this.onClickEnemySign, this);
        new ButtonUtils_1.ButtonUtils(this.revokeLineBtn, this.onClickRevokeLine, this);
        new ButtonUtils_1.ButtonUtils(this.helpRoleGroup, this.onClickHelpRole, this);
        TimerManager_1.default.instance.setTimeout(this.loadRes, this, 2000);
    }
    setData(data) {
        this.energyCostTable = {};
        this.battleAdditionId = 0;
        this.isVideoGetRole = false;
        this.isShowRandomRoleEvent = true;
        if (data && data.fullStart) {
            this.battleAdditionId = data.fullStart;
        }
        SoundManager_1.default.playBGM(MusicConst_1.MusicConst.SOUND_BATTLE_BG);
        WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        this.mapHeightRate = ScreenAdapterTools_1.default.height / 65; //65为小地图高度
        this.pauseGroup.visible = false;
        this.isUseCamera = true;
        this.isAllowFollw = true;
        this.pauseBtn.visible = true;
        this.guideArrow.visible = false;
        this.skillTipGroup.visible = false;
        this.initTopShow(data);
        this.controler.initGame();
        if (data.helpRole) {
            this.controler.helpRoleId = data.helpRole;
            this.createHelpRole();
        }
        else {
            this.helpRoleGroup.visible = false;
        }
        BattleFunc_1.default.curGameState = null;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.controler.cameraControler.focusPos.x = this.controler.enemyHome.pos.x;
            this.controler.cameraControler.inControlBg = true;
            BattleFunc_1.default.curGameState = BattleConst_1.default.WARSTATE_LINE;
            this.enemySignBtn.visible = false;
            this.roleSignBtn.visible = true;
            this.freshWarTipShow();
        }
        else {
            this.initHomeSkill();
        }
        this.initSmallMapTouchEvent();
        // 添加互推图标
        JumpManager_1.default.initJumpData(this.initJumpCall, this);
    }
    //后台加载资源
    loadRes() {
        SubPackageManager_1.default.loadDynamics(["group_role_08"], []);
    }
    /**创建助阵英雄 */
    createHelpRole() {
        this.helpRoleGroup.visible = true;
        var data = RolesFunc_1.default.instance.getCfgDatas("Role", this.controler.helpRoleId);
        this.helpbgImg.skin = ResourceConst_1.default.BATTLE_ICON_DI[data.qualityType];
        this.helpiconImg.skin = RolesFunc_1.default.instance.getBattleRoleIcon(data.battleIcon);
        this.controler.helpRoleCd = BattleFunc_1.default.instance.turnMinisecondToframe(data.tryParams.split(",")[1]);
        this.controler.helpRoleLeftCd = 0;
        this.freshHelpRoleState(0);
    }
    /**点击助阵英雄 */
    onClickHelpRole() {
        var level = Number(this.controler.levelCfgData.tryRoleNum[0]);
        var starLevel = Number(this.controler.levelCfgData.tryRoleNum[1]);
        if (this.controler.helpRoleLeftCd <= 0) {
            this.controler.createMyRole(this.controler.helpRoleId, level, starLevel);
            this.controler.helpRoleLeftCd = this.controler.helpRoleCd;
        }
    }
    /**刷新主线助阵英雄的cd */
    freshHelpRoleState(leftCd) {
        if (leftCd <= 0) {
            this.helpmaskImg.visible = false;
        }
        else {
            this.helpmaskImg.visible = true;
            this.helpLeftTxt.changeText(leftCd + "");
        }
    }
    initJumpCall() {
        var itemWidth = 120;
        var x = ScreenAdapterTools_1.default.width - itemWidth / 2 - 10;
        var y = ScreenAdapterTools_1.default.toolBarWidth + itemWidth / 2 + 100;
        var data = [
            {
                x: x,
                y: y,
                width: itemWidth
            }
        ];
        JumpManager_1.default.addMainJump(this, JumpConst_1.default.BATTLE_SIDE, data, false, true, JumpConst_1.default.JUMP_KARIQU_BATTLEICON, false, 0, "#ffffff", false, 0, 0, 4, false);
    }
    initTopShow(data) {
        var isShowTalk = 1;
        if (data && data.isShowTalk) {
            isShowTalk = data.isShowTalk;
        }
        this.levelTxt.visible = false;
        this.rewardGroup.visible = false;
        this.autoGroup.visible = false;
        this.roleSignBtn.visible = false;
        this.enemySignBtn.visible = false;
        this.warTipGroup.visible = false;
        this.leftGroup.visible = false;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            this.levelTxt.visible = true;
            // this.rewardGroup.visible = true;
            this.autoGroup.visible = true;
            this.smallMapGroup.visible = true;
            this.bottomImg.height = 335;
            //普通战斗
            var nextLevel = data.levelId;
            this.levelId = nextLevel;
            this.levelName = data.name;
            this.levelTxt.text = data.name + "  " + TranslateFunc_1.default.instance.getTranslate(LevelFunc_1.default.instance.getCfgDatasByKey("Level", this.levelId, "name"));
            this.freshNormalRoleList();
            this.freshReward();
            this.setNormalLevelEnergy();
            BattleSceneManager_1.default.instance.enterBattle({ levelId: nextLevel }, this.battleCtn, this);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.LEVEL_START, { levelId: this.levelId, entrance: "main" });
            this.controler = BattleSceneManager_1.default.instance.autoBattleControler;
            if (!this.controler.guideControler.checkGuide_101()) {
                //主线关卡：判断是否打开对话界面
                if (isShowTalk != 2) {
                    var levelInfo = LevelFunc_1.default.instance.getLevelInfoById(this.levelId);
                    if (levelInfo.dialogue) {
                        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogNpcTalkUI, { "viewType": FogConst_1.default.VIEW_TYPE_MAIN_LEVEL, level: this.levelId });
                        BattleSceneManager_1.default.instance.setGamePlayOrPause(true);
                    }
                }
            }
            this.openCameraImg.visible = this.isUseCamera;
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            //远征     
            BattleSceneManager_1.default.instance.enterBattle({}, this.battleCtn, this);
            this.controler = BattleSceneManager_1.default.instance.autoBattleControler;
            this.setWarEnergy();
            this.freshWarRoleList();
            if (this.controler.guideControler.checkFogGuide_801()) {
                this.pauseBtn.visible = false;
            }
        }
    }
    /**显示剩余战斗时间 */
    showLeftTxt(txt) {
        if (txt == 0) {
            this.leftGroup.visible = false;
            return;
        }
        if (!this.leftGroup.visible) {
            this.leftGroup.visible = true;
        }
        txt = Math.ceil(txt / GameConsts_1.default.gameFrameRate);
        if (txt <= BattleFunc_1.default.leftAniTime) {
            this.leftTxt.color = "#ff0400";
            this.leftDesTxt.color = "#ff0400";
            TweenAniManager_1.default.instance.scaleQipaoAni(this.leftGroup, 1.4, null, null, false, 500);
        }
        else {
            this.leftTxt.color = "#ffffff";
            this.leftDesTxt.color = "#ffffff";
        }
        this.leftTxt.text = txt + "";
    }
    freshWarTipShow() {
        this.warTipGroup.visible = true;
        this.smallMapGroup.visible = false;
        this.readyLineGroup.visible = false;
        this.startWarBtn.visible = false;
        this.revokeLineBtn.visible = false;
        this.bottomImg.height = 265;
        this.autoGroup.visible = false;
        this.isUseCamera = false;
        this.skillGroup.visible = false;
        if (BattleFunc_1.default.curGameState == BattleConst_1.default.WARSTATE_LINE) {
            //上阵
            this.readyLineGroup.visible = true;
        }
        else if (BattleFunc_1.default.curGameState == BattleConst_1.default.WARSTATE_CANFIGHT) {
            this.controler.cameraControler.inControlBg = false;
            this.controler.layerControler.isInTouch = false;
            this.controler.cameraControler.focusPos.x = this.controler.myHome.pos.x;
            this.startWarBtn.visible = true;
            this.isUseCamera = true;
            this.freshCameraImg();
            this.roleSignBtn.visible = false;
            this.enemySignBtn.visible = true;
            this.revokeLineBtn.visible = true;
        }
        else if (BattleFunc_1.default.curGameState == BattleConst_1.default.WARSTATE_INFIGHT) {
            //4战斗中
            this.readyLineGroup.visible = false;
            this.smallMapGroup.visible = true;
            this.bottomImg.height = 335;
            this.warTipGroup.visible = false;
            this.roleSignBtn.visible = false;
            this.enemySignBtn.visible = false;
            this.revokeLineBtn.visible = false;
            this.autoGroup.visible = true;
            this.skillGroup.visible = true;
            this.isUseCamera = true;
            this.freshCameraImg();
            this.initHomeSkill();
            this.setRoleGray();
        }
    }
    freshCameraImg() {
        this.openCameraImg.visible = this.isUseCamera;
    }
    showArrow() {
        this.guideArrow.visible = true;
        TimerManager_1.default.instance.remove(this.arrowCode);
        this.handBaseY = this.guideArrow.y;
        Laya.Tween.clearTween(this.guideArrow);
        if (this.guideArrow.visible) {
            this.addHandTween();
            this.arrowCode = TimerManager_1.default.instance.add(this.addHandTween, this, 600);
        }
    }
    addHandTween() {
        Laya.Tween.to(this.guideArrow, { y: this.handBaseY + 10 }, 200, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(this.guideArrow, { y: this.handBaseY - 10 }, 200, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this.guideArrow, { y: this.handBaseY }, 200, null, null);
            }));
        }));
    }
    /**初始化基地技能 */
    initHomeSkill() {
        this.skillGroup.removeChildren();
        this.controler.battleSkillnoCd = false;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            //主线显示cd开关关闭并且分享和视频不关闭的情况下 免cd
            if (!GameSwitch_1.default.checkOnOff(GameSwitchConst_1.default.SWITCH_BATTLE_SKILLCD) && ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_BATTLE_USESKILL) != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.controler.battleSkillnoCd = true;
            }
        }
        var homeLevel = RolesModel_1.default.instance.getRoleLevelById(GlobalParamsFunc_1.default.instance.getDataNum("bornHomeId"));
        var homeSkill = GlobalParamsFunc_1.default.instance.getDataArray("baseSkillList");
        var unlockSkill = [];
        for (var i = 0; i < homeSkill.length; i++) {
            var info = homeSkill[i].split(",");
            if (Number(info[0]) <= homeLevel) {
                unlockSkill.push(info[1]);
            }
        }
        this.controler.skillContent = this.controler.createSkillContent(unlockSkill, this.skillGroup);
    }
    /**设置远征模式能量 */
    setWarEnergy() {
        //初始能量=大巴车等级attribute的第三个字段+道具+心灵鸡汤
        this.maxEnergy = FogFunc_1.default.instance.getCfgDatasByKey("BusUpGrade", FogModel_1.default.instance.getBusLevel(), "attribute")[2] + FogModel_1.default.fogAddEnergy;
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddEnergy, this);
        this.nowEnergy = this.maxEnergy;
        this.freshEnergyShow();
    }
    /**设置普通战斗能量信息 */
    setNormalLevelEnergy() {
        //是否有开场满能量
        this.maxEnergy = GlobalParamsFunc_1.default.instance.getDataNum("energyMaxNub");
        if (this.battleAdditionId && this.battleAdditionId == BattleConst_1.default.battle_start_full_energy) {
            this.nowEnergy = this.maxEnergy;
        }
        else {
            this.nowEnergy = GlobalParamsFunc_1.default.instance.getDataNum("energyBattleStartNub");
        }
        //判断是否有能量恢复的加成
        var energyRestoreNub = GlobalParamsFunc_1.default.instance.getDataNum("energyRestoreNub");
        if (this.battleAdditionId && this.battleAdditionId == BattleConst_1.default.battle_start_energy_resume) {
            var battleAddNum = LevelFunc_1.default.instance.getBattleAddtionoByTwoId(this.battleAdditionId, "addtionNub") / 10000;
            this.recoverPer = BattleFunc_1.default.instance.turnMinisecondToframe(energyRestoreNub * (1 - battleAddNum));
        }
        else {
            this.recoverPer = BattleFunc_1.default.instance.turnMinisecondToframe(energyRestoreNub);
        }
        this.freshEnergyShow();
    }
    /**刷新能量显示 */
    freshEnergyShow() {
        this.energyImg.height = this.nowEnergy * 140 / this.maxEnergy > 140 ? 140 : this.nowEnergy * 140 / this.maxEnergy;
        this.energyTxt.text = this.nowEnergy + "";
        this.roleList.refresh();
    }
    /**加迷雾能量 */
    addFogEnergy(percent) {
        var count = Math.ceil(this.maxEnergy * percent);
        this.nowEnergy += count;
        this.freshEnergyShow();
    }
    /**自动恢复能量 */
    autoAddEnergy() {
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR)
            return;
        if (this.nowEnergy >= this.maxEnergy)
            return;
        this.nowEnergy += 1;
        this.freshEnergyShow();
    }
    freshReward() {
        var rewardList = LevelFunc_1.default.instance.getLevelInfoById(this.levelId).victoryReward;
        var coin = 0;
        var gold = 0;
        for (var index in rewardList) {
            var reward = rewardList[index].split(",");
            switch (Number(reward[0])) {
                case DataResourceFunc_1.DataResourceType.COIN:
                    coin += Number(reward[1]);
                    break;
                case DataResourceFunc_1.DataResourceType.GOLD:
                    gold += Number(reward[1]);
                    break;
            }
        }
        if (gold) {
            this.levelRewardImg.skin = ResourceConst_1.default.GOLD_PNG;
            this.levelReward.text = StringUtils_1.default.getCoinStr(gold + "");
        }
        else {
            this.levelRewardImg.skin = ResourceConst_1.default.COIN_PNG;
            this.levelReward.text = StringUtils_1.default.getCoinStr(coin + "");
        }
    }
    /**设置远征战斗角色的list */
    freshWarRoleList() {
        var data = FogModel_1.default.instance.getFogRoleWithRandom();
        this.roleList.array = data;
        this.roleList.renderHandler = new Laya.Handler(this, this.onListRender2);
    }
    /**设置普通战斗角色的list */
    freshNormalRoleList() {
        var data = RolesModel_1.default.instance.getInLineRole();
        this.roleList.array = data;
        this.roleList.renderHandler = new Laya.Handler(this, this.onListRender2);
    }
    onListRender2(cell, index) {
        var data = this.roleList.array[index];
        cell.offAll();
        var item = cell.getChildByName("item");
        var roleUnlockGroup = item.getChildByName("roleUnlockGroup");
        var roleLockGroup = item.getChildByName("roleLockGroup");
        var bg = roleUnlockGroup.getChildByName("bgImg");
        var icon = roleUnlockGroup.getChildByName("iconImg");
        var cost = roleUnlockGroup.getChildByName("energyCost");
        var maskImg = roleUnlockGroup.getChildByName("maskImg");
        var maskImgLock = roleLockGroup.getChildByName("maskImg");
        var freeImg = roleLockGroup.getChildByName("freeImg");
        roleLockGroup.visible = false;
        roleUnlockGroup.visible = true;
        maskImg.visible = true;
        var energy = this.energyCostTable[data.id];
        var isRandom = data.isRandom || 0;
        if (!this.energyCostTable[data.id]) {
            energy = RolesFunc_1.default.instance.setEnergyCost(data.id, data.payEnergyNmb);
            this.energyCostTable[data.id] = energy;
        }
        if (energy <= this.nowEnergy) {
            maskImg.visible = false;
            if (!item["__lastButtonUtils"] || (item["__lastButtonUtils"] && item["id"] && item["id"] != data.id)) {
                item["id"] = data.id;
                new ButtonUtils_1.ButtonUtils(item, this.onClickRoleItem, this, null, null, [data.id, energy, isRandom, roleLockGroup, roleUnlockGroup]);
            }
        }
        if (BattleFunc_1.default.curGameState == BattleConst_1.default.WARSTATE_INFIGHT && !this.controler.inFogReviveBattle) {
            maskImg.visible = true;
        }
        if (!this.isVideoGetRole && isRandom) {
            roleLockGroup.visible = true;
            roleUnlockGroup.visible = false;
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_BATTLE_ADDROLE);
            freeImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.freeType);
            if (this.isShowRandomRoleEvent && this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_RANDROLE_SHOW);
                this.isShowRandomRoleEvent = false;
            }
            if (BattleFunc_1.default.curGameState == BattleConst_1.default.WARSTATE_INFIGHT && !this.controler.inFogReviveBattle) {
                maskImgLock.visible = true;
            }
            else {
                maskImgLock.visible = false;
            }
        }
        bg.skin = ResourceConst_1.default.BATTLE_ICON_DI[data.qualityType];
        icon.skin = RolesFunc_1.default.instance.getBattleRoleIcon(data.battleIcon);
        cost.text = energy + "";
        if (index == 0 && !this.firstRole) {
            this.firstRole = item;
        }
    }
    //初始化nowArea拖拽
    initSmallMapTouchEvent() {
        //先初始化区域的宽度
        this.nowArea.visible = true;
        this.nowArea.width = ScreenAdapterTools_1.default.width * this.smallMapGroup.width / this.controler.mapControler._maxSceneWidth;
        this.nowArea.x = 0;
        this.nowAreaMaxX = this.smallMapGroup.width - this.nowArea.width;
        this.nowArea.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginMap);
        this.nowArea.on(Laya.Event.MOUSE_MOVE, this, this.touchMoveMap);
        this.nowArea.on(Laya.Event.MOUSE_UP, this, this.touchOverMap);
        this.smallMapBg.on(Laya.Event.CLICK, this, this.clickSmallBg);
        this.smallMapBg.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginMap);
        this.smallMapBg.on(Laya.Event.MOUSE_MOVE, this, this.touchMoveMap);
        this.smallMapBg.on(Laya.Event.MOUSE_UP, this, this.touchOverMap);
    }
    clickSmallBg(event) {
        var point = new Laya.Point(event.stageX, 0);
        var local = this.smallMapGroup.globalToLocal(point);
        this.moveNowArea(local.x - this.nowArea.width / 2 - this.nowArea.x);
        this.touchBeginMap(event);
        this.controler.setCallBack(60 * 5, this.resstCameraFollow, this);
    }
    touchBeginMap(event) {
        this.controler && this.controler.clearCallBack(this, this.resstCameraFollow);
        this.isAllowFollw = false;
        this._sMapStartTouchX = event.stageX;
    }
    touchMoveMap(event) {
        if (!this._sMapStartTouchX)
            return;
        this.moveNowArea(event.stageX - this._sMapStartTouchX);
        this._sMapStartTouchX = event.stageX;
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_1_103) {
            this.controler.guideControler.checkGuide_104_finish();
        }
    }
    touchOverMap(event) {
        this._sMapStartTouchX = null;
        this.controler.setCallBack(60 * 5, this.resstCameraFollow, this);
    }
    resstCameraFollow() {
        this.isAllowFollw = true;
    }
    //刷新小地图上指示当前显示区域的位置
    moveNowArea(x) {
        this.nowArea.x += x;
        if (this.nowArea.x < 0) {
            this.nowArea.x = 0;
        }
        if (this.nowArea.x > this.nowAreaMaxX) {
            this.nowArea.x = this.nowAreaMaxX;
        }
        var tempPos = this.controler.cameraControler.focusPos.x + x * this.controler.layerControler.sceneWidthRate;
        tempPos = this.controler.layerControler.getTweenEndPos(tempPos);
        this.controler.cameraControler.focusPos.x = tempPos;
        this.controler.cameraControler.updateCtnPos(1);
    }
    //刷新小地图
    freshSmallMap(x) {
        this.nowArea.x += x;
        if (this.nowArea.x < 0) {
            this.nowArea.x = 0;
        }
        if (this.nowArea.x > this.nowAreaMaxX) {
            this.nowArea.x = this.nowAreaMaxX;
        }
    }
    onClickRoleItem(info) {
        //开战后不能出兵
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR && BattleFunc_1.default.curGameState == BattleConst_1.default.WARSTATE_INFIGHT && !this.controler.inFogReviveBattle)
            return;
        var id = info[0];
        var cost = info[1];
        var isRandom = info[2];
        var roleLockGroup = info[3];
        var roleUnlockGroup = info[4];
        //是否随机
        if (!this.isVideoGetRole && isRandom) {
            this.controler.setGamePlayOrPause(true);
            if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_RANDROLE_CLICK);
            }
            ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_FOG_BATTLE_ADDROLE, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, () => {
                //刷新list显示
                roleLockGroup.visible = false;
                roleUnlockGroup.visible = true;
                this.isVideoGetRole = true;
                if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_RANDROLE_FINISH);
                }
                else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_RANDROLE_FINISH);
                }
                this.controler.setGamePlayOrPause(false);
            }, () => {
                this.controler.setGamePlayOrPause(false);
            }, this);
        }
        else {
            if (cost > this.nowEnergy)
                return;
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR && BattleFunc_1.default.curGameState != BattleConst_1.default.WARSTATE_CANFIGHT && !this.controler.inFogReviveBattle) {
                BattleFunc_1.default.curGameState = BattleConst_1.default.WARSTATE_CANFIGHT;
                this.freshWarTipShow();
            }
            this.controler.createMyRole(id);
            this.nowEnergy -= cost;
            this.freshEnergyShow();
        }
    }
    onClickPauseBtn() {
        // if (!this.controler) {
        //     return;
        // }
        this.pauseGroup.visible = true;
        //设置游戏暂停
        BattleSceneManager_1.default.instance.setGamePlayOrPause(true);
    }
    onClickCameraFollow() {
        this.isUseCamera = !this.isUseCamera;
        this.openCameraImg.visible = this.isUseCamera;
    }
    //点击回主界面
    onClickMainBtn() {
        this.close();
        // 头条停止录屏
        if (ShareOrTvManager_1.default.instance.canShareVideo()) {
            UserInfo_1.default.platform.recordStop();
        }
        BattleSceneManager_1.default.instance.exitBattle();
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            var chapMap = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.ChapterMapUI);
            if (!chapMap) {
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterMapUI, { chapterId: this.levelName.split("-")[0] });
            }
        }
    }
    //继续比赛
    onContinueBtn() {
        BattleSceneManager_1.default.instance.setGamePlayOrPause(false);
        this.pauseGroup.visible = false;
    }
    //重玩关卡
    onReplayGame() {
        // 头条停止录屏
        if (ShareOrTvManager_1.default.instance.canShareVideo()) {
            UserInfo_1.default.platform.recordStop();
        }
        SoundManager_1.default.stopMusicOrSound(MusicConst_1.MusicConst.SOUND_BATTLE_BG);
        //修改reviveCount的计数
        Message_1.default.instance.send(BattleEvent_1.default.BATTLEEVENT_REVIEW_RESET_REVIVECOUNT);
        this.pauseGroup.visible = false;
        BattleSceneManager_1.default.instance.replayBattle(true);
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.LEVEL_START, { levelId: this.levelId, entrance: "replay" });
        this.resetStatus();
    }
    onTouchBegin(event) {
        this.controler.layerControler.onTouchBegin(event);
    }
    onTouchMove(event) {
        this.controler.layerControler.onTouchMove(event);
    }
    onTouchUp(event) {
        this.controler.layerControler.onTouchUp(event);
    }
    /**点击我方标志 */
    onClickRoleSign() {
        this.isUseCamera = false;
        this.controler.cameraControler.focusPos.x = this.controler.myHome.pos.x;
        this.controler.cameraControler.inControlBg = true;
        this.roleSignBtn.visible = false;
        this.enemySignBtn.visible = true;
    }
    /**点击撤销 */
    onClickRevokeLine() {
        this.controler.clearAllRole();
        this.revokeLineBtn.visible = false;
        this.setWarEnergy();
        BattleFunc_1.default.curGameState = BattleConst_1.default.WARSTATE_LINE;
        this.freshWarTipShow();
    }
    /**点击敌方标志 */
    onClickEnemySign() {
        this.isUseCamera = false;
        this.controler.cameraControler.focusPos.x = this.controler.enemyHome.pos.x;
        this.controler.cameraControler.inControlBg = true;
        this.roleSignBtn.visible = true;
        this.enemySignBtn.visible = false;
    }
    /**点击开始进攻 */
    onClickStartWar() {
        var isCanLine = false;
        for (var key in this.energyCostTable) {
            var cost = this.energyCostTable[key];
            if (cost <= this.nowEnergy) {
                isCanLine = true;
                break;
            }
        }
        if (!isCanLine) {
            this.startWar();
        }
        else {
            var data = {
                callBack: this.startWar,
                thisObj: this
            };
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogStartWarUI, data);
        }
    }
    //开始远征进攻
    startWar() {
        BattleFunc_1.default.curGameState = BattleConst_1.default.WARSTATE_INFIGHT;
        this.freshWarTipShow();
        this.controler.addAllTiggerOnBorn();
    }
    //创建一个x小红点/小蓝点   obj必须包含属性  isPlayer  来区分己方还是敌方
    createOneMapPoint(obj) {
        var point;
        var type = obj.lifeType;
        if (obj.camp == BattleConst_1.default.ROLEGROUP_MYSELF) {
            if (type == BattleConst_1.default.LIFE_JIDI) {
                point = PoolTools_1.default.getItem(PoolCode_1.default.SELF_MAP_HOME_POINT_POOL) || new Laya.Image(ResourceConst_1.default.SELF_MAP_HOME_POINT);
                point.anchorY = 0.5;
            }
            else if (type == BattleConst_1.default.LIFE_AIRHERO) {
                point = PoolTools_1.default.getItem(PoolCode_1.default.SELF_MAP_SKY_POINT_POOL) || new Laya.Image(ResourceConst_1.default.SELF_MAP_SKY_POINT);
            }
            else {
                point = PoolTools_1.default.getItem(PoolCode_1.default.SELF_MAP_POINT_POOL) || new Laya.Image(ResourceConst_1.default.SELF_MAP_POINT);
            }
        }
        else {
            if (type == BattleConst_1.default.LIFE_JIDI) {
                point = PoolTools_1.default.getItem(PoolCode_1.default.ENEMY_MAP_HOME_POINT_POOL) || new Laya.Image(ResourceConst_1.default.ENEMY_MAP_HOME_POINT);
                point.anchorY = 0.5;
            }
            else if (type == BattleConst_1.default.LIFE_AIRHERO) {
                point = PoolTools_1.default.getItem(PoolCode_1.default.ENEMY_MAP_SKY_POINT_POOL) || new Laya.Image(ResourceConst_1.default.ENEMY_MAP_SKY_POINT);
            }
            else {
                point = PoolTools_1.default.getItem(PoolCode_1.default.ENEMY_MAP_POINT_POOL) || new Laya.Image(ResourceConst_1.default.ENEMY_MAP_POINT);
            }
        }
        this.pointGroup.addChild(point);
        this.setSmallMapXByScreen(point, obj.pos);
        return point;
    }
    setRoleGray() {
        this.roleList.refresh();
    }
    //将相对场景的xy转换为小地图里的xy
    setSmallMapXByScreen(point, screenPos) {
        if (this.controler.layerControler) {
            point.x = screenPos.x / this.controler.layerControler.sceneWidthRate;
            point.y = (screenPos.z + screenPos.y) / this.mapHeightRate;
        }
    }
    setGameNormalSpeed() {
        this.setGameSpeed(1);
    }
    /**
     * 刷新技能瓢字
     * @param name
     */
    freshSkillTipGroup(name, continueTime, timeScale) {
        this.continueTime = continueTime;
        this.timeRate = timeScale;
        Laya.Tween.clearTween(this.skillTipGroup);
        TimerManager_1.default.instance.clearTimeout(this.tweenCode);
        this.setGameSpeed(this.timeRate);
        TimerManager_1.default.instance.clearTimeout(this.recoverCode);
        this.recoverCode = TimerManager_1.default.instance.setTimeout(this.setGameNormalSpeed, this, this.continueTime);
        if (this.skillTipGroup.visible) {
            this.skillTipHideTween([this.skillTipShowTween, name, 0.2]);
        }
        else {
            this.skillTipShowTween(name);
        }
    }
    //展示技能飘字
    skillTipShowTween(name = null) {
        if (name) {
            this.skillIcon.skin = "uisource/battle/battle/" + name + ".png";
        }
        this.skillTipGroup.x = 0 - this.skillTipGroup.width;
        this.skillTipGroup.visible = true;
        this.skillTipGroup.alpha = 1;
        Laya.Tween.to(this.skillTipGroup, { x: 0 }, 300, null, Laya.Handler.create(this, () => {
            this.tweenCode = TimerManager_1.default.instance.setTimeout(this.skillTipHideTween, this, 300, [null, name, 0.5]);
        }));
    }
    //隐藏技能飘字
    skillTipHideTween(data) {
        var callBack = data[0];
        var name = data[1];
        var rate = data[2];
        var times = (ScreenAdapterTools_1.default.width - this.skillTipGroup.x) * rate;
        Laya.Tween.to(this.skillTipGroup, { x: ScreenAdapterTools_1.default.width, alpha: 0 }, times, null, Laya.Handler.create(this, () => {
            this.skillTipGroup.visible = false;
            callBack && callBack.call(this, name);
        }));
    }
    setGameSpeed(speed) {
        var arr = this.controler.getAllInstanceArr();
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (!item.ignoreTimeScale) {
                item.setUpTimeScale(speed);
            }
        }
    }
    close() {
        //关掉战斗界面
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleUI);
    }
    updateBlood(waveLeftHp, waveTotalHp) {
    }
    updateGameTime(leftFrame, batteTotalFrame) {
    }
    resetStatus() { }
    recvMsg() {
    }
}
exports.BattleUI = BattleUI;
//# sourceMappingURL=BattleUI.js.map