"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const BattleServer_1 = require("../../server/BattleServer");
const LevelFunc_1 = require("../../func/LevelFunc");
const BattleSceneManager_1 = require("../../manager/BattleSceneManager");
const SoundManager_1 = require("../../../../framework/manager/SoundManager");
const MusicConst_1 = require("../../consts/MusicConst");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ButtonConst_1 = require("../../../../framework/consts/ButtonConst");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const JumpManager_1 = require("../../../../framework/manager/JumpManager");
const JumpConst_1 = require("../../consts/JumpConst");
const ResourceConst_1 = require("../../consts/ResourceConst");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const CacheManager_1 = require("../../../../framework/manager/CacheManager");
const StorageCode_1 = require("../../consts/StorageCode");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const BattleConst_1 = require("../../consts/BattleConst");
const BattleFunc_1 = require("../../func/BattleFunc");
const PoolTools_1 = require("../../../../framework/utils/PoolTools");
const PoolCode_1 = require("../../consts/PoolCode");
const RolesFunc_1 = require("../../func/RolesFunc");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const RolesModel_1 = require("../../model/RolesModel");
const Client_1 = require("../../../../framework/common/kakura/Client");
const UserModel_1 = require("../../model/UserModel");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const Message_1 = require("../../../../framework/common/Message");
const FogEvent_1 = require("../../event/FogEvent");
const FogFunc_1 = require("../../func/FogFunc");
const FogModel_1 = require("../../model/FogModel");
const FogEventTrigger_1 = require("../../../fog/trigger/FogEventTrigger");
const FogPropTrigger_1 = require("../../../fog/trigger/FogPropTrigger");
const FogServer_1 = require("../../server/FogServer");
const FogConst_1 = require("../../consts/FogConst");
const ChapterEvent_1 = require("../../event/ChapterEvent");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const DataResourceServer_1 = require("../../server/DataResourceServer");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
class BattleResultUI extends layaMaxUI_1.ui.gameui.battle.BattleResultUI {
    constructor() {
        super();
        this.isWin = false;
        this.timeCode = 0;
        /**奖励增加的比例 */
        this.addPercent = 1;
        this.isNewPass = false;
        this.timeCodeTT = 0;
        this.txtTimeCode = 0;
        if (UserInfo_1.default.isTT()) {
            new ButtonUtils_1.ButtonUtils(this.multiReceiveBtn, this.onReceiveBtnClick, this);
        }
        else {
            new ButtonUtils_1.ButtonUtils(this.multiReceiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        }
        new ButtonUtils_1.ButtonUtils(this.shareVideoBtn, this.onShareVideoClick, this).setBtnType(ButtonConst_1.default.BUTTON_TYPE_4);
        new ButtonUtils_1.ButtonUtils(this.receiveBtn, this.onCloseBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.guideReturnBtn, this.onCloseBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.onClickReturn, this);
        new ButtonUtils_1.ButtonUtils(this.againBtn, this.onClickAgain, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_Result, this);
        // 头条停止录屏
        if (ShareOrTvManager_1.default.instance.canShareVideo()) {
            UserInfo_1.default.platform.recordStop();
        }
        this.addPercent = 1;
        FogModel_1.default.fogAddEnergy = 0;
        this.isNewPass = false;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.shareLineName = ShareTvOrderFunc_1.default.SHARELINE_FOG_BATTLERESULT_DOUBLE;
            this.enemy = FogFunc_1.default.enemyCell.eventData;
        }
        else {
            this.shareLineName = ShareTvOrderFunc_1.default.SHARELINE_BATTLEWIN;
        }
        this.type = ShareOrTvManager_1.default.instance.getShareOrTvType(this.shareLineName);
        this.isWin = data.isWin;
        this.levelId = data.levelId;
        this.controler = data.controler;
        this.controler.setGamePlayOrPause(true);
        this.guideReturnBtn.visible = false;
        if (this.isWin) {
            this.win.visible = true;
            this.lose.visible = false;
            this.receiveBtn.visible = false;
            this.shareVideoBtn.visible = false;
            if (UserInfo_1.default.isTT()) {
                this.shareVideoBtn.visible = true;
                this.shareVideoBtn.y = 852;
                this.shareVideoTip.visible = true;
                var recordReward = GlobalParamsFunc_1.default.instance.getDataArray("recordReward")[0];
                var result = DataResourceFunc_1.default.instance.getDataResourceInfo(recordReward.split(","));
                this.shareRewardImg.skin = result['img'];
                this.shareRewardNum.text = "+" + result['num'];
                this.timeCodeTT = TimerManager_1.default.instance.add(this.shareVideoTween, this, 5000);
                //录屏展示打点
                if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.RECORD_FOG_SHOW, { enemyId: this.enemy.enemyData.id });
                }
                else {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.RECORD_LEVEL_SHOW, { levelId: this.levelId });
                }
            }
            if (this.type == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE || (UserModel_1.default.instance.getMainGuide() == 1 && UserModel_1.default.instance.getMaxBattleLevel() == 0)) {
                this.multiReceiveBtn.visible = false;
                this.guideReturnBtn.visible = true;
                if (UserInfo_1.default.isTT()) {
                    this.shareVideoBtn.y = 900;
                }
            }
            else {
                this.multiReceiveBtn.visible = true;
                // 延迟出现
                // var delayTime = ShareTvOrderFunc.instance.getDelayShowTime(this.shareLineName);
                this.receiveBtn.visible = true;
                // if (delayTime) {
                //     this.receiveBtn.visible = false;
                //     TimerManager.instance.setTimeout(() => {
                //         this.receiveBtn.visible = true;
                //     }, this, delayTime)
                // }
                this.receiveImg.skin = ShareTvOrderFunc_1.default.instance.getFreeImgSkin(this.type);
            }
        }
        else {
            this.win.visible = false;
            this.lose.visible = true;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.LEVEL_FAIL, { levelId: data.levelId, time: Client_1.default.instance.serverTime - this.controler.startTime });
        }
        this.showWinReward();
        this.showRole();
    }
    showWinReward() {
        this.pieceGroup.visible = false;
        this.rewardGroup2.visible = false;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            this.showFogResultReward();
        }
        else {
            this.showNormalBattleReward();
        }
        this.receiveText.changeText(this.battleResultRetio + '倍领取');
    }
    /**迷雾结算奖励 */
    showFogResultReward() {
        var enemy = FogFunc_1.default.enemyCell.eventData;
        if (this.isWin) {
            //击败敌人次数+1
            FogServer_1.default.updateFogCount({ type: FogConst_1.default.FOG_COUNT_FIGHTENEMY });
            this.setWarReward();
            // 领取离线金币的次数
            this.battleResultCount = CacheManager_1.default.instance.getLocalCache(StorageCode_1.default.storage_fogBattleResultCount);
            if (!this.battleResultCount || this.battleResultCount == null || isNaN(this.battleResultCount)) {
                this.battleResultCount = 0;
            }
            // 根据领取次数显示不同倍数
            var settlementDouble = GlobalParamsFunc_1.default.instance.getDataArray('fogBattleDouble');
            this.battleResultRetio = Number(settlementDouble[this.battleResultCount % settlementDouble.length]);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_BATTLE_VICTORY, { enemyId: this.enemy.enemyData.id });
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_BATTLE_SHOW, { doubleRate: this.battleResultRetio, enemyId: this.enemy.enemyData.id });
            FogServer_1.default.delFogCount({ type: FogConst_1.default.fog_battle_defeat });
        }
        else {
            this.win.visible = false;
            this.lose.visible = true;
            this.rewardGroup1.visible = false;
            this.rewardGroup2.visible = false;
            //记录战败次数
            FogServer_1.default.updateFogCount({ type: FogConst_1.default.fog_battle_defeat });
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_BATTLE_FAIL, { enemyId: this.enemy.enemyData.id });
        }
    }
    /**普通结算奖励 */
    showNormalBattleReward() {
        if (this.isWin) {
            // 领取离线金币的次数
            this.battleResultCount = CacheManager_1.default.instance.getLocalCache(StorageCode_1.default.storage_battleResultCount);
            if (!this.battleResultCount || this.battleResultCount == null || isNaN(this.battleResultCount)) {
                this.battleResultCount = 0;
            }
            // 根据领取次数显示不同倍数
            var settlementDouble = GlobalParamsFunc_1.default.instance.getDataArray('settlementDouble');
            this.battleResultRetio = Number(settlementDouble[this.battleResultCount % settlementDouble.length]);
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.LEVEL_VICTORY, { levelId: this.levelId, time: Client_1.default.instance.serverTime - this.controler.startTime });
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEVICTORY_SHOW, { doubleRate: this.battleResultRetio });
            if (this.levelId > UserModel_1.default.instance.getMaxBattleLevel()) {
                this.isNewPass = true;
            }
            this.showGuide_201();
        }
        else {
            this.win.visible = false;
            this.lose.visible = true;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.LEVEL_FAIL, { levelId: this.levelId, time: Client_1.default.instance.serverTime - this.controler.startTime });
        }
        this.setReward();
    }
    /**胜利引导 */
    showGuide_201() {
        //战斗引导结束了 并且当前是第一关 兼容老玩家
        if (UserModel_1.default.instance.getMainGuide() == 1 && UserModel_1.default.instance.getMaxBattleLevel() == 0) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_2_201, GuideManager_1.default.GuideType.Static, this.guideReturnBtn, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_2_201, null, this, this.onCloseBtnClick);
            return true;
        }
        return false;
    }
    showGuide_201_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_2_201, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
        }, this, true);
    }
    /**碎片奖励引导 */
    showGuide_401() {
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        if (Number(this.levelId) < unlock) {
            return;
        }
        if (UserModel_1.default.instance.getMainGuide() <= 5) {
            this.receiveBtn.visible = false;
            this.multiReceiveBtn.visible = false;
            this.shareVideoBtn.visible = false;
            this.guideReturnBtn.visible = true;
            TimerManager_1.default.instance.remove(this.txtTimeCode);
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_401, GuideManager_1.default.GuideType.Static, this.pieceGroup, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_401, this.showGuide_401_finish, this, this.onCloseBtnClick);
        }
    }
    showGuide_401_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_401, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            this.showGuide_402();
        }, this, false);
    }
    showGuide_402() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_402, GuideManager_1.default.GuideType.Static, this.guideReturnBtn, this);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_402, this.showGuide_402_finish, this, this.onCloseBtnClick);
    }
    showGuide_402_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_402, () => {
            WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
            this.onCloseBtnClick();
        }, this, true);
    }
    /**设置远征结算奖励 */
    setWarReward() {
        //结算货币加成的道具检测
        this.rewardGroup1.visible = false;
        this.rewardGroup2.visible = true;
        this.rewardImg.scale(0.4, 0.4);
        this.rewardGroup2.x = 318;
        FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_AddMoneyPer, this);
        var enemy = FogFunc_1.default.enemyCell.eventData;
        var reward = enemy.enemyData.reward;
        this.rewardImg.skin = DataResourceFunc_1.default.instance.getDataResourceInfo(reward)["img"];
        this.rewardTxt.text = Math.floor((reward[1] + reward[2] * FogModel_1.default.instance.getCurLayer()) * this.addPercent) + "";
    }
    /**设置普通结算奖励 */
    setReward() {
        var rewards = LevelFunc_1.default.instance.getLevelInfoById(this.levelId);
        var rewardList;
        if (this.isWin) {
            rewardList = rewards.victoryReward;
        }
        else {
            rewardList = rewards.defeatReward;
        }
        var coin = 0;
        var gold = 0;
        var piece = 0;
        var sp = 0;
        var pieceId;
        for (var index in rewardList) {
            var reward = rewardList[index].split(",");
            switch (Number(reward[0])) {
                case DataResourceFunc_1.DataResourceType.COIN:
                    coin += Number(reward[1]);
                    break;
                case DataResourceFunc_1.DataResourceType.GOLD:
                    gold += Number(reward[1]);
                    break;
                case DataResourceFunc_1.DataResourceType.PIECE:
                    pieceId = reward[1];
                    piece += Number(reward[2]);
                    break;
                case DataResourceFunc_1.DataResourceType.SP:
                    sp += Number(reward[1]);
                    break;
            }
        }
        if (this.isNewPass) {
            var reward1 = rewards.firstReward;
            for (var index in reward1) {
                var reward = reward1[index].split(",");
                switch (Number(reward[0])) {
                    case DataResourceFunc_1.DataResourceType.COIN:
                        coin += Number(reward[1]);
                        break;
                    case DataResourceFunc_1.DataResourceType.GOLD:
                        gold += Number(reward[1]);
                        break;
                    case DataResourceFunc_1.DataResourceType.PIECE:
                        pieceId = reward[1];
                        piece += Number(reward[2]);
                        break;
                    case DataResourceFunc_1.DataResourceType.SP:
                        sp += Number(reward[1]);
                        break;
                }
            }
        }
        this.rewardImg.scale(1, 1);
        this.rewardGroup2.x = 327;
        this.rewardGroup2.visible = true;
        var result = [];
        if (gold) {
            result.push({ type: ResourceConst_1.default.GOLD_PNG, num: gold });
        }
        if (coin) {
            result.push({ type: ResourceConst_1.default.COIN_PNG, num: coin });
        }
        if (sp) {
            result.push({ type: ResourceConst_1.default.SP_PNG, num: sp });
        }
        this.rewardGroup1.visible = false;
        if (result[0]) {
            this.rewardImg.visible = true;
            this.rewardImg.skin = result[0].type;
            this.rewardTxt.text = result[0].num + "";
        }
        if (result[1]) {
            this.rewardGroup1.visible = true;
            this.rewardImg1.skin = result[1].type;
            this.rewardTxt1.text = result[1].num + "";
        }
        if (piece) {
            this.pieceIcon.skin = RolesFunc_1.default.instance.getEquipIcon(RolesFunc_1.default.instance.getCfgDatasByKey("EquipMaterial", pieceId, "icon"));
            this.pieceCount.text = piece + "";
            this.rewardGroup2.x = 219;
            this.pieceGroup.visible = true;
            this.showGuide_401();
        }
    }
    /**展示角色 */
    showRole() {
        var randomArr = [];
        var roleInfo;
        var txt;
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            //普通战斗的角色
            if (this.isWin) {
                randomArr = RolesModel_1.default.instance.getInLineRole();
                txt = this.heroTxt;
            }
            else {
                randomArr = RolesFunc_1.default.instance.getLevelMonsterArr(this.levelId);
                txt = this.enemyTxt;
            }
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            //远征战斗的角色
            if (this.isWin) {
                randomArr = RolesModel_1.default.instance.getFogRole();
                txt = this.heroTxt;
            }
            else {
                var events = FogFunc_1.default.enemyCell.eventData;
                randomArr = FogFunc_1.default.instance.getEnemyLine(events.enemyId, events.enemyType);
                txt = this.enemyTxt;
            }
        }
        this.heroSpeak.visible = this.isWin;
        this.enemySpeak.visible = !this.isWin;
        for (var i = 0; i < randomArr.length; i++) {
            var item = randomArr[i];
            if (item.lifeType != BattleConst_1.default.LIFE_JIDI) {
                roleInfo = item;
                break;
            }
        }
        var id = roleInfo.id;
        var level = roleInfo.level;
        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools_1.default.cacheItem(PoolCode_1.default.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem = PoolTools_1.default.getItem(PoolCode_1.default.POOL_ROLE + id);
        var scale;
        if (UserInfo_1.default.isTT()) {
            scale = (GlobalParamsFunc_1.default.instance.getDataNum("recordScale") / 10000 || 1) * (GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInSettlementUi") / 10000 || 1) * BattleFunc_1.default.defaultScale;
            if (this.type == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE || (UserModel_1.default.instance.getMainGuide() == 1 && UserModel_1.default.instance.getMaxBattleLevel() == 0)) {
                this.aniGroup.y = -40;
            }
            else {
                this.aniGroup.y = -90;
            }
        }
        else {
            scale = (GlobalParamsFunc_1.default.instance.getDataNum("roleSizeInSettlementUi") / 10000 || 1) * BattleFunc_1.default.defaultScale;
            this.aniGroup.y = 0;
        }
        if (!cacheItem) {
            cacheItem = BattleFunc_1.default.instance.createRoleSpine(id, level, 2, scale, true, !this.win, "BattleResultUI");
        }
        else {
            cacheItem.setItemViewScale(scale);
        }
        if (!this.isWin) {
            cacheItem.scaleX = -1;
            this.failTxt.text = TranslateFunc_1.default.instance.getTranslate(BattleFunc_1.default.instance.getCfgDatasByKey("Role", id, "buttonWords"));
        }
        else {
            cacheItem.scaleX = 1;
        }
        this.roleAnim = cacheItem;
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
        this._lastRoleId = id;
        this.timeCode = RolesFunc_1.default.instance.setRoleSpeak(this._lastRoleId, RolesFunc_1.default.ROLE_SPEAK_RESULT, txt, this);
    }
    /**点击返回 */
    onClickReturn() {
        BattleServer_1.default.battleResult({ levelId: this.levelId, doubleRate: 1 }, this.exitBattle, this);
    }
    /**点击重玩 */
    onClickAgain() {
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            var userActNum = FogModel_1.default.instance.getActNum();
            if (userActNum < Number(FogFunc_1.default.enemyCell.eventData.mobilityCost)) {
                FogModel_1.default.instance.checkFreeAct();
                return;
            }
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            if (BattleFunc_1.default.instance.showGetPower()) {
                return;
            }
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.LEVEL_START, { levelId: this.levelId, entrance: "resultUI" });
        }
        BattleServer_1.default.battleResult({ levelId: this.levelId, doubleRate: 1 }, () => {
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                this.dispose();
                //直接重玩
                BattleSceneManager_1.default.instance.replayBattle();
            }
            else {
                var result = LevelFunc_1.default.instance.checkIsBattleAddtionInGame();
                if (!result[0]) {
                    this.dispose();
                    //直接重玩
                    BattleSceneManager_1.default.instance.replayBattle();
                }
                else {
                    //打开豪华开局视频界面
                    var detail = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.BattleDetailUI);
                    WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleFullEnergyUI, { "battleAddtionId": result[1], detail: detail, isShowTalk: 2, callBack: this.callBack, thisObj: this });
                }
            }
        }, this);
    }
    dispose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleResultUI);
        TimerManager_1.default.instance.remove(this.timeCode);
        Laya.Tween.clearAll(this.shareVideoTip);
        TimerManager_1.default.instance.remove(this.timeCodeTT);
    }
    callBack() {
        this.dispose();
        if (BattleSceneManager_1.default.instance.autoBattleControler) {
            BattleSceneManager_1.default.instance.autoBattleControler.exitBattle();
        }
    }
    /**
    * 退出并领取1倍奖励
    */
    onCloseBtnClick() {
        if (UserModel_1.default.instance.getMainGuide() == 1 && UserModel_1.default.instance.getMaxBattleLevel() == 0) {
            this.showGuide_201_finish();
        }
        BattleServer_1.default.battleResult({ isWin: this.isWin, levelId: this.levelId, doubleRate: 1 * this.addPercent, receiveCount: this.battleResultCount }, this.exitBattle, this);
    }
    /**
     * 领取多倍战斗结算奖励
     */
    onReceiveBtnClick() {
        if (this.type == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_ad_error"));
        }
        else {
            //迷雾街区结算翻倍看视频点击打点
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR && this.isWin) {
                var enemy = FogFunc_1.default.enemyCell.eventData;
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_BATTLE_CLICK, { doubleRate: this.battleResultRetio, enemyId: this.enemy.enemyData.id });
            }
            else {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEVICTORY_CLICK, { doubleRate: this.battleResultRetio });
            }
            ShareOrTvManager_1.default.instance.shareOrTv(this.shareLineName, ShareOrTvManager_1.default.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, this.closeCall, this);
        }
    }
    successCall() {
        //迷雾街区结算翻倍看视频打点
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR && this.isWin) {
            if (this.type == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_BATTLE_FINISH, { doubleRate: this.battleResultRetio });
            }
            if (this.type == ShareOrTvManager_1.default.TYPE_SHARE || this.type == ShareOrTvManager_1.default.TYPE_SHAREVIDEO) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_BATTLE_FINISH, { doubleRate: this.battleResultRetio });
            }
        }
        //普通战斗结算打点
        else {
            if (this.type == ShareOrTvManager_1.default.TYPE_ADV) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_BATTLEVICTORY_FINISH, { doubleRate: this.battleResultRetio });
            }
            if (this.type == ShareOrTvManager_1.default.TYPE_SHARE || this.type == ShareOrTvManager_1.default.TYPE_SHAREVIDEO) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_SETTLEMENT_CLICKSUCCESS, { doubleRate: this.battleResultRetio });
            }
        }
        BattleServer_1.default.battleResult({ isWin: this.isWin, levelId: this.levelId, doubleRate: this.battleResultRetio * this.addPercent, receiveCount: this.battleResultCount }, this.exitBattle, this);
    }
    closeCall() {
    }
    //退出战斗 
    exitBattle() {
        this.finishGuide_803();
        var battleUi = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.BattleUI);
        battleUi.visible = true;
        battleUi.close();
        BattleSceneManager_1.default.instance.exitBattle();
        SoundManager_1.default.stopMusicOrSound(MusicConst_1.MusicConst.SOUND_BATTLE_BG);
        this.close();
    }
    close() {
        TimerManager_1.default.instance.remove(this.timeCode);
        Laya.Tween.clearAll(this.shareVideoTip);
        TimerManager_1.default.instance.remove(this.timeCodeTT);
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.BattleResultUI);
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_NORMAL) {
            var levelId = this.controler.battleData.levelId;
            var map = WindowManager_1.default.getUIByName(WindowCfgs_1.WindowCfgs.ChapterMapUI);
            if (this.isWin && this.isNewPass) {
                //首次胜利 移动角色
                if (BattleFunc_1.default.instance.IshowGuide_204() || BattleFunc_1.default.instance.IshowGuide_403() || BattleFunc_1.default.instance.IshowGuide_501() || BattleFunc_1.default.instance.IshowUnlockGuide()) {
                    //如果有强制回主界面的需求 先销毁章节地图
                    map && map.chapterControler.exitChapter();
                    WindowManager_1.default.SwitchUI(WindowCfgs_1.WindowCfgs.GameMainUI, WindowCfgs_1.WindowCfgs.ChapterMapUI, { "fromResultLevel": levelId });
                }
                else {
                    BattleFunc_1.default.fromBattleMain = levelId;
                    if (!map) {
                        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterMapUI, { chapterId: 1 });
                    }
                    else {
                        Message_1.default.instance.send(ChapterEvent_1.default.CHAPTEREVENT_PLAYER_MOVE);
                    }
                }
            }
            else {
                if (!map) {
                    WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.ChapterMapUI, { chapterId: 1 });
                }
            }
        }
        else if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            if (this.isWin) {
                Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_COMP);
                Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_CELLEVENT, { cell: FogFunc_1.default.enemyCell, behind: 1, type: FogEventTrigger_1.default.Event_logical_Enemy });
            }
            else {
                if (FogModel_1.default.instance.getCountsById(FogConst_1.default.fog_battle_defeat) >= GlobalParamsFunc_1.default.instance.getDataNum("fogExitTipsTimes")) {
                    WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogTipUI, { type: FogConst_1.default.FOG_VIEW_TYPE_DEFEAT });
                }
            }
        }
    }
    finishGuide_803() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_8_802) {
            this.controler.guideControler.checkGuide_803_finish();
        }
    }
    showJump() {
        JumpManager_1.default.showDrawerView(JumpConst_1.default.JUMPLIST, { result: 1 });
    }
    onShareVideoClick() {
        if (UserInfo_1.default.isTT()) {
            //录屏点击打点
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.RECORD_FOG_CLICK, { enemyId: this.enemy.enemyData.id });
            }
            else {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.RECORD_LEVEL_CLICK, { levelId: this.levelId });
            }
            UserInfo_1.default.platform.shareVideo((res) => {
                if (res) {
                    this.shareVideoSuccessCall();
                }
                else {
                    this.shareVideoCloseCall();
                }
            }, this);
        }
    }
    shareVideoSuccessCall() {
        var recordReward = GlobalParamsFunc_1.default.instance.getDataArray("recordReward")[0];
        var recordReward = recordReward.split(",");
        DataResourceServer_1.default.getReward({ reward: recordReward }, () => {
            //录屏finish打点
            if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.RECORD_FOG_FINISH, { enemyId: this.enemy.enemyData.id });
            }
            else {
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.RECORD_LEVEL_FINISH, { levelId: this.levelId });
            }
            if (Number(recordReward[0] == DataResourceFunc_1.DataResourceType.COIN)) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_getCoin_tip", null, [recordReward[1]]));
            }
            else if (Number(recordReward[0] == DataResourceFunc_1.DataResourceType.GOLD)) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_getGold_tip", null, [recordReward[1]]));
            }
            this.shareVideoBtn.visible = false;
        }, this);
    }
    shareVideoCloseCall() {
    }
    //我要上热门动画
    shareVideoTween() {
        //每隔5秒向左下角收回，然后重新弹出
        this.shareVideoTip.scaleX = 1;
        this.shareVideoTip.scaleY = 1;
        Laya.Tween.to(this.shareVideoTip, { scaleX: 0, scaleY: 0 }, 200, null, Laya.Handler.create(this, () => {
            TimerManager_1.default.instance.setTimeout(() => {
                Laya.Tween.to(this.shareVideoTip, { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, () => { }));
            }, this, 800);
        }));
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = BattleResultUI;
//# sourceMappingURL=BattleResultUI.js.map