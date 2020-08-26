import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import BattleServer from "../../server/BattleServer";
import LevelFunc from "../../func/LevelFunc";
import BattleSceneManager from "../../manager/BattleSceneManager";
import SoundManager from "../../../../framework/manager/SoundManager";
import { MusicConst } from "../../consts/MusicConst";
import StatisticsManager from "../../manager/StatisticsManager";
import { BattleUI } from "./BattleUI";
import StringUtils from "../../../../framework/utils/StringUtils";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import JumpManager from "../../../../framework/manager/JumpManager";
import JumpConst from "../../consts/JumpConst";
import ResourceConst from "../../consts/ResourceConst";
import DataResourceFunc, { DataResourceType } from "../../func/DataResourceFunc";
import BattleLogicalControler from "../../../battle/controler/BattleLogicalControler";
import CacheManager from "../../../../framework/manager/CacheManager";
import StorageCode from "../../consts/StorageCode";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import BattleConst from "../../consts/BattleConst";
import BattleFunc from "../../func/BattleFunc";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import RolesFunc from "../../func/RolesFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import RolesModel from "../../model/RolesModel";
import Client from "../../../../framework/common/kakura/Client";
import UserModel from "../../model/UserModel";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import Message from "../../../../framework/common/Message";
import FogEvent from "../../event/FogEvent";
import FogFunc from "../../func/FogFunc";
import FogEventData from "../../../fog/data/FogEventData";
import FogModel from "../../model/FogModel";
import FogEventTrigger from "../../../fog/trigger/FogEventTrigger";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";
import FogServer from "../../server/FogServer";
import FogConst from "../../consts/FogConst";
import ChapterEvent from "../../event/ChapterEvent";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import UserInfo from "../../../../framework/common/UserInfo";
import LogsManager from "../../../../framework/manager/LogsManager";
import DataResourceServer from "../../server/DataResourceServer";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";


export default class BattleResultUI extends ui.gameui.battle.BattleResultUI implements IMessage {
    private levelId;
    private isWin: boolean = false;
    private battleResultRetio;
    private type;
    //战斗结算奖励领取次数
    private battleResultCount;
    private controler: BattleLogicalControler;
    //角色动画
    private roleAnim: BattleRoleView;
    //上次缓存角色spine的id
    private _lastRoleId: string;
    private timeCode = 0;
    /**奖励增加的比例 */
    public addPercent = 1;
    private shareLineName: any;
    private isNewPass = false;
    private timeCodeTT = 0;
    private txtTimeCode = 0;
    private enemy: FogEventData;//迷雾模式敌人数据
    constructor() {
        super();
        if (UserInfo.isTT()) {
            new ButtonUtils(this.multiReceiveBtn, this.onReceiveBtnClick, this);
        } else {
            new ButtonUtils(this.multiReceiveBtn, this.onReceiveBtnClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        }
        new ButtonUtils(this.shareVideoBtn, this.onShareVideoClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
        new ButtonUtils(this.receiveBtn, this.onCloseBtnClick, this);
        new ButtonUtils(this.guideReturnBtn, this.onCloseBtnClick, this);
        new ButtonUtils(this.returnBtn, this.onClickReturn, this);
        new ButtonUtils(this.againBtn, this.onClickAgain, this);
    }

    public setData(data) {
        BannerAdManager.addBannerQuick(this);
        AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_Result, this);
        // 头条停止录屏
        if (ShareOrTvManager.instance.canShareVideo()) {
            UserInfo.platform.recordStop();
        }
        this.addPercent = 1;
        FogModel.fogAddEnergy = 0;
        this.isNewPass = false
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
            this.shareLineName = ShareTvOrderFunc.SHARELINE_FOG_BATTLERESULT_DOUBLE;
            this.enemy = FogFunc.enemyCell.eventData;
        } else {
            this.shareLineName = ShareTvOrderFunc.SHARELINE_BATTLEWIN
        }
        this.type = ShareOrTvManager.instance.getShareOrTvType(this.shareLineName);
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

            if (UserInfo.isTT()) {
                this.shareVideoBtn.visible = true;
                this.shareVideoBtn.y = 852;
                this.shareVideoTip.visible = true;
                var recordReward = GlobalParamsFunc.instance.getDataArray("recordReward")[0];
                var result = DataResourceFunc.instance.getDataResourceInfo(recordReward.split(","));
                this.shareRewardImg.skin = result['img'];
                this.shareRewardNum.text = "+" + result['num'];
                this.timeCodeTT = TimerManager.instance.add(this.shareVideoTween, this, 5000);
                //录屏展示打点
                if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
                    StatisticsManager.ins.onEvent(StatisticsManager.RECORD_FOG_SHOW, { enemyId: this.enemy.enemyData.id });
                } else {
                    StatisticsManager.ins.onEvent(StatisticsManager.RECORD_LEVEL_SHOW, { levelId: this.levelId });
                }

            }
            if (this.type == ShareOrTvManager.TYPE_QUICKRECEIVE || (UserModel.instance.getMainGuide() == 1 && UserModel.instance.getMaxBattleLevel() == 0)) {
                this.multiReceiveBtn.visible = false;
                this.guideReturnBtn.visible = true;
                if (UserInfo.isTT()) {
                    this.shareVideoBtn.y = 900;
                }
            } else {
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
                this.receiveImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.type);
            }
        } else {
            this.win.visible = false;
            this.lose.visible = true;
            StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_FAIL, { levelId: data.levelId, time: Client.instance.serverTime - this.controler.startTime });

        }
        this.showWinReward();
        this.showRole();

    }
    showWinReward() {
        this.pieceGroup.visible = false;
        this.rewardGroup2.visible = false;
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
            this.showFogResultReward();
        } else {
            this.showNormalBattleReward();
        }
        this.receiveText.changeText(this.battleResultRetio + '倍领取')
    }
    /**迷雾结算奖励 */
    showFogResultReward() {
        var enemy: FogEventData = FogFunc.enemyCell.eventData;
        if (this.isWin) {
            //击败敌人次数+1
            FogServer.updateFogCount({ type: FogConst.FOG_COUNT_FIGHTENEMY });
            this.setWarReward();
            // 领取离线金币的次数
            this.battleResultCount = CacheManager.instance.getLocalCache(StorageCode.storage_fogBattleResultCount);
            if (!this.battleResultCount || this.battleResultCount == null || isNaN(this.battleResultCount)) {
                this.battleResultCount = 0;
            }
            // 根据领取次数显示不同倍数
            var settlementDouble = GlobalParamsFunc.instance.getDataArray('fogBattleDouble');
            this.battleResultRetio = Number(settlementDouble[this.battleResultCount % settlementDouble.length]);
            StatisticsManager.ins.onEvent(StatisticsManager.FOG_BATTLE_VICTORY, { enemyId: this.enemy.enemyData.id })
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_BATTLE_SHOW, { doubleRate: this.battleResultRetio, enemyId: this.enemy.enemyData.id });
            FogServer.delFogCount({ type: FogConst.fog_battle_defeat })
        } else {
            this.win.visible = false;
            this.lose.visible = true;
            this.rewardGroup1.visible = false;
            this.rewardGroup2.visible = false;
            //记录战败次数
            FogServer.updateFogCount({ type: FogConst.fog_battle_defeat })
            StatisticsManager.ins.onEvent(StatisticsManager.FOG_BATTLE_FAIL, { enemyId: this.enemy.enemyData.id })
        }
    }
    /**普通结算奖励 */
    showNormalBattleReward() {
        if (this.isWin) {
            // 领取离线金币的次数
            this.battleResultCount = CacheManager.instance.getLocalCache(StorageCode.storage_battleResultCount);
            if (!this.battleResultCount || this.battleResultCount == null || isNaN(this.battleResultCount)) {
                this.battleResultCount = 0;
            }
            // 根据领取次数显示不同倍数
            var settlementDouble = GlobalParamsFunc.instance.getDataArray('settlementDouble');
            this.battleResultRetio = Number(settlementDouble[this.battleResultCount % settlementDouble.length]);
            StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_VICTORY, { levelId: this.levelId, time: Client.instance.serverTime - this.controler.startTime });
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEVICTORY_SHOW, { doubleRate: this.battleResultRetio });
            if (this.levelId > UserModel.instance.getMaxBattleLevel()) {
                this.isNewPass = true;
            }
            this.showGuide_201();
        } else {
            this.win.visible = false;
            this.lose.visible = true;
            StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_FAIL, { levelId: this.levelId, time: Client.instance.serverTime - this.controler.startTime });
        }
        this.setReward();
    }
    /**胜利引导 */
    showGuide_201() {
        //战斗引导结束了 并且当前是第一关 兼容老玩家
        if (UserModel.instance.getMainGuide() == 1 && UserModel.instance.getMaxBattleLevel() == 0) {
            GuideManager.ins.setGuideData(GuideConst.GUIDE_2_201, GuideManager.GuideType.Static, this.guideReturnBtn, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_2_201, null, this, this.onCloseBtnClick);
            return true;
        }

        return false;
    }
    showGuide_201_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_2_201, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        }, this, true)
    }
    /**碎片奖励引导 */
    showGuide_401() {
        var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock")
        if (Number(this.levelId) < unlock) {
            return;
        }
        if (UserModel.instance.getMainGuide() <= 5) {
            this.receiveBtn.visible = false;
            this.multiReceiveBtn.visible = false;
            this.shareVideoBtn.visible = false;
            this.guideReturnBtn.visible = true;
            TimerManager.instance.remove(this.txtTimeCode)
            GuideManager.ins.setGuideData(GuideConst.GUIDE_4_401, GuideManager.GuideType.Static, this.pieceGroup, this);
            GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_401, this.showGuide_401_finish, this, this.onCloseBtnClick);
        }
    }
    showGuide_401_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_4_401, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            this.showGuide_402();
        }, this, false)
    }
    showGuide_402() {
        GuideManager.ins.setGuideData(GuideConst.GUIDE_4_402, GuideManager.GuideType.Static, this.guideReturnBtn, this);
        GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_402, this.showGuide_402_finish, this, this.onCloseBtnClick);
    }
    showGuide_402_finish() {
        GuideManager.ins.guideFin(GuideConst.GUIDE_4_402, () => {
            WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
            this.onCloseBtnClick();
        }, this, true)
    }
    /**设置远征结算奖励 */
    setWarReward() {
        //结算货币加成的道具检测
        this.rewardGroup1.visible = false;
        this.rewardGroup2.visible = true;
        this.rewardImg.scale(0.4, 0.4);
        this.rewardGroup2.x = 318;
        FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_AddMoneyPer, this);
        var enemy: FogEventData = FogFunc.enemyCell.eventData;
        var reward = enemy.enemyData.reward;
        this.rewardImg.skin = DataResourceFunc.instance.getDataResourceInfo(reward)["img"];
        this.rewardTxt.text = Math.floor((reward[1] + reward[2] * FogModel.instance.getCurLayer()) * this.addPercent) + "";
    }
    /**设置普通结算奖励 */
    setReward() {
        var rewards = LevelFunc.instance.getLevelInfoById(this.levelId);
        var rewardList;
        if (this.isWin) {
            rewardList = rewards.victoryReward
        } else {
            rewardList = rewards.defeatReward
        }
        var coin = 0;
        var gold = 0;
        var piece = 0;
        var sp = 0;
        var pieceId;
        for (var index in rewardList) {
            var reward = rewardList[index].split(",");
            switch (Number(reward[0])) {
                case DataResourceType.COIN:
                    coin += Number(reward[1]);
                    break;
                case DataResourceType.GOLD:
                    gold += Number(reward[1]);
                    break;
                case DataResourceType.PIECE:
                    pieceId = reward[1];
                    piece += Number(reward[2]);
                    break;
                case DataResourceType.SP:
                    sp += Number(reward[1]);
                    break;
            }
        }
        if (this.isNewPass) {
            var reward1 = rewards.firstReward;
            for (var index in reward1) {
                var reward = reward1[index].split(",");
                switch (Number(reward[0])) {
                    case DataResourceType.COIN:
                        coin += Number(reward[1]);
                        break;
                    case DataResourceType.GOLD:
                        gold += Number(reward[1]);
                        break;
                    case DataResourceType.PIECE:
                        pieceId = reward[1];
                        piece += Number(reward[2]);
                        break;
                    case DataResourceType.SP:
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
            result.push({ type: ResourceConst.GOLD_PNG, num: gold })
        }
        if (coin) {
            result.push({ type: ResourceConst.COIN_PNG, num: coin })
        }
        if (sp) {
            result.push({ type: ResourceConst.SP_PNG, num: sp })
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
            this.pieceIcon.skin = RolesFunc.instance.getEquipIcon(RolesFunc.instance.getCfgDatasByKey("EquipMaterial", pieceId, "icon"));
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
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
            //普通战斗的角色
            if (this.isWin) {
                randomArr = RolesModel.instance.getInLineRole();
                txt = this.heroTxt;
            } else {
                randomArr = RolesFunc.instance.getLevelMonsterArr(this.levelId);
                txt = this.enemyTxt;
            }
        } else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
            //远征战斗的角色
            if (this.isWin) {
                randomArr = RolesModel.instance.getFogRole();
                txt = this.heroTxt;
            } else {
                var events: FogEventData = FogFunc.enemyCell.eventData;
                randomArr = FogFunc.instance.getEnemyLine(events.enemyId, events.enemyType);
                txt = this.enemyTxt;
            }
        }
        this.heroSpeak.visible = this.isWin;
        this.enemySpeak.visible = !this.isWin;
        for (var i = 0; i < randomArr.length; i++) {
            var item = randomArr[i];
            if (item.lifeType != BattleConst.LIFE_JIDI) {
                roleInfo = item;
                break;
            }
        }

        var id = roleInfo.id;
        var level = roleInfo.level;

        if (this.roleAnim) {
            this.aniGroup.removeChild(this.roleAnim);
            PoolTools.cacheItem(PoolCode.POOL_ROLE + this._lastRoleId, this.roleAnim);
        }
        var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + id);
        var scale;
        if (UserInfo.isTT()) {
            scale = (GlobalParamsFunc.instance.getDataNum("recordScale") / 10000 || 1) * (GlobalParamsFunc.instance.getDataNum("roleSizeInSettlementUi") / 10000 || 1) * BattleFunc.defaultScale;
            if (this.type == ShareOrTvManager.TYPE_QUICKRECEIVE || (UserModel.instance.getMainGuide() == 1 && UserModel.instance.getMaxBattleLevel() == 0)) {
                this.aniGroup.y = -40;
            } else {
                this.aniGroup.y = -90;
            }
        } else {
            scale = (GlobalParamsFunc.instance.getDataNum("roleSizeInSettlementUi") / 10000 || 1) * BattleFunc.defaultScale;
            this.aniGroup.y = 0;
        }


        if (!cacheItem) {
            cacheItem = BattleFunc.instance.createRoleSpine(id, level, 2, scale, true, !this.win, "BattleResultUI")
        } else {
            cacheItem.setItemViewScale(scale);
        }
        if (!this.isWin) {
            cacheItem.scaleX = -1;
            this.failTxt.text = TranslateFunc.instance.getTranslate(BattleFunc.instance.getCfgDatasByKey("Role", id, "buttonWords"))
        } else {
            cacheItem.scaleX = 1;

        }
        this.roleAnim = cacheItem
        this.aniGroup.addChild(this.roleAnim);
        this.roleAnim.play("idle", true);
        this._lastRoleId = id;
        this.timeCode = RolesFunc.instance.setRoleSpeak(this._lastRoleId, RolesFunc.ROLE_SPEAK_RESULT, txt, this);
    }
    /**点击返回 */
    onClickReturn() {
        BattleServer.battleResult({ levelId: this.levelId, doubleRate: 1 }, this.exitBattle, this);
    }
    /**点击重玩 */
    onClickAgain() {
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
            var userActNum = FogModel.instance.getActNum()
            if (userActNum < Number(FogFunc.enemyCell.eventData.mobilityCost)) {
                FogModel.instance.checkFreeAct();
                return;
            }
        } else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
            if (BattleFunc.instance.showGetPower()) {
                return;
            }
            StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_START, { levelId: this.levelId, entrance: "resultUI" });
        }
        BattleServer.battleResult({ levelId: this.levelId, doubleRate: 1 }, () => {
            if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
                this.dispose();
                //直接重玩
                BattleSceneManager.instance.replayBattle();
            } else {
                var result = LevelFunc.instance.checkIsBattleAddtionInGame();
                if (!result[0]) {
                    this.dispose();
                    //直接重玩
                    BattleSceneManager.instance.replayBattle();
                } else {

                    //打开豪华开局视频界面
                    var detail = WindowManager.getUIByName(WindowCfgs.BattleDetailUI);
                    WindowManager.OpenUI(WindowCfgs.BattleFullEnergyUI, { "battleAddtionId": result[1], detail: detail, isShowTalk: 2, callBack: this.callBack, thisObj: this });
                }
            }

        }, this);
    }
    dispose() {
        WindowManager.CloseUI(WindowCfgs.BattleResultUI);
        TimerManager.instance.remove(this.timeCode);
        Laya.Tween.clearAll(this.shareVideoTip);
        TimerManager.instance.remove(this.timeCodeTT);
    }
    callBack() {
        this.dispose();

        if (BattleSceneManager.instance.autoBattleControler) {
            BattleSceneManager.instance.autoBattleControler.exitBattle();
        }
    }
    /**
    * 退出并领取1倍奖励
    */
    onCloseBtnClick() {
        if (UserModel.instance.getMainGuide() == 1 && UserModel.instance.getMaxBattleLevel() == 0) {
            this.showGuide_201_finish();
        }
        BattleServer.battleResult({ isWin: this.isWin, levelId: this.levelId, doubleRate: 1 * this.addPercent, receiveCount: this.battleResultCount }, this.exitBattle, this);
    }

    /**
     * 领取多倍战斗结算奖励
     */
    onReceiveBtnClick() {
        if (this.type == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_ad_error"));
        } else {
            //迷雾街区结算翻倍看视频点击打点
            if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && this.isWin) {
                var enemy: FogEventData = FogFunc.enemyCell.eventData;
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_BATTLE_CLICK, { doubleRate: this.battleResultRetio, enemyId: this.enemy.enemyData.id });
            } else {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEVICTORY_CLICK, { doubleRate: this.battleResultRetio });
            }

            ShareOrTvManager.instance.shareOrTv(this.shareLineName, ShareOrTvManager.TYPE_ADV, {
                id: "1",
                extraData: {}
            }, this.successCall, this.closeCall, this);
        }
    }

    successCall() {

        //迷雾街区结算翻倍看视频打点
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && this.isWin) {
            if (this.type == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_BATTLE_FINISH, { doubleRate: this.battleResultRetio });
            }
            if (this.type == ShareOrTvManager.TYPE_SHARE || this.type == ShareOrTvManager.TYPE_SHAREVIDEO) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_BATTLE_FINISH, { doubleRate: this.battleResultRetio });
            }
        }
        //普通战斗结算打点
        else {
            if (this.type == ShareOrTvManager.TYPE_ADV) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_BATTLEVICTORY_FINISH, { doubleRate: this.battleResultRetio });
            }
            if (this.type == ShareOrTvManager.TYPE_SHARE || this.type == ShareOrTvManager.TYPE_SHAREVIDEO) {
                StatisticsManager.ins.onEvent(StatisticsManager.SHARE_SETTLEMENT_CLICKSUCCESS, { doubleRate: this.battleResultRetio });
            }
        }
        BattleServer.battleResult({ isWin: this.isWin, levelId: this.levelId, doubleRate: this.battleResultRetio * this.addPercent, receiveCount: this.battleResultCount }, this.exitBattle, this);
    }

    closeCall() {

    }

    //退出战斗 
    public exitBattle() {
        this.finishGuide_803();
        var battleUi: BattleUI = WindowManager.getUIByName(WindowCfgs.BattleUI);
        battleUi.visible = true;
        battleUi.close();
        BattleSceneManager.instance.exitBattle();

        SoundManager.stopMusicOrSound(MusicConst.SOUND_BATTLE_BG);
        this.close();
    }

    close() {
        TimerManager.instance.remove(this.timeCode);
        Laya.Tween.clearAll(this.shareVideoTip);
        TimerManager.instance.remove(this.timeCodeTT);
        WindowManager.CloseUI(WindowCfgs.BattleResultUI);
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
            var levelId = this.controler.battleData.levelId;
            var map = WindowManager.getUIByName(WindowCfgs.ChapterMapUI);
            if (this.isWin && this.isNewPass) {
                //首次胜利 移动角色
                if (BattleFunc.instance.IshowGuide_204() || BattleFunc.instance.IshowGuide_403() || BattleFunc.instance.IshowGuide_501() || BattleFunc.instance.IshowUnlockGuide()) {
                    //如果有强制回主界面的需求 先销毁章节地图
                    map && map.chapterControler.exitChapter();
                    WindowManager.SwitchUI(WindowCfgs.GameMainUI, WindowCfgs.ChapterMapUI, { "fromResultLevel": levelId });
                } else {
                    BattleFunc.fromBattleMain = levelId;
                    if (!map) {
                        WindowManager.OpenUI(WindowCfgs.ChapterMapUI, { chapterId: 1 })
                    } else {
                        Message.instance.send(ChapterEvent.CHAPTEREVENT_PLAYER_MOVE);
                    }

                }
            } else {
                if (!map) {
                    WindowManager.OpenUI(WindowCfgs.ChapterMapUI, { chapterId: 1 })
                }
            }
        } else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
            if (this.isWin) {
                Message.instance.send(FogEvent.FOGEVENT_REFRESH_COMP);
                Message.instance.send(FogEvent.FOGEVENT_REFRESH_CELLEVENT, { cell: FogFunc.enemyCell, behind: 1, type: FogEventTrigger.Event_logical_Enemy })
            } else {
                if (FogModel.instance.getCountsById(FogConst.fog_battle_defeat) >= GlobalParamsFunc.instance.getDataNum("fogExitTipsTimes")) {
                    WindowManager.OpenUI(WindowCfgs.FogTipUI, { type: FogConst.FOG_VIEW_TYPE_DEFEAT })
                }
            }
        }
    }
    finishGuide_803() {
        if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_8_802) {
            this.controler.guideControler.checkGuide_803_finish();
        }
    }

    showJump() {
        JumpManager.showDrawerView(JumpConst.JUMPLIST, { result: 1 })
    }

    onShareVideoClick() {
        if (UserInfo.isTT()) {
            //录屏点击打点
            if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
                StatisticsManager.ins.onEvent(StatisticsManager.RECORD_FOG_CLICK, { enemyId: this.enemy.enemyData.id });
            } else {
                StatisticsManager.ins.onEvent(StatisticsManager.RECORD_LEVEL_CLICK, { levelId: this.levelId });
            }
            UserInfo.platform.shareVideo((res) => {
                if (res) {
                    this.shareVideoSuccessCall();
                } else {
                    this.shareVideoCloseCall();
                }
            }, this);
        }
    }
    shareVideoSuccessCall() {
        var recordReward = GlobalParamsFunc.instance.getDataArray("recordReward")[0];
        var recordReward = recordReward.split(",");

        DataResourceServer.getReward({ reward: recordReward }, () => {
            //录屏finish打点
            if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
                StatisticsManager.ins.onEvent(StatisticsManager.RECORD_FOG_FINISH, { enemyId: this.enemy.enemyData.id });
            } else {
                StatisticsManager.ins.onEvent(StatisticsManager.RECORD_LEVEL_FINISH, { levelId: this.levelId });
            }
            if (Number(recordReward[0] == DataResourceType.COIN)) {
                WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_getCoin_tip", null, [recordReward[1]]));
            } else if (Number(recordReward[0] == DataResourceType.GOLD)) {
                WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_getGold_tip", null, [recordReward[1]]));
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
            TimerManager.instance.setTimeout(() => {
                Laya.Tween.to(this.shareVideoTip, { scaleX: 1, scaleY: 1 }, 200, null, Laya.Handler.create(this, () => { }));
            }, this, 800);
        }));
    }


    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}