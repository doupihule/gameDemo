
import { WindowCfgs } from "../../consts/WindowCfgs";
import IMessage from "../../interfaces/IMessage";
import BattleSceneManager from "../../manager/BattleSceneManager";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import LevelFunc from "../../func/LevelFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import UserModel from "../../model/UserModel";
import GameMainEvent from "../../event/GameMainEvent";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import StatisticsManager from "../../manager/StatisticsManager";
import SubPackageConst from "../../consts/SubPackageConst";
import SoundManager from "../../../../framework/manager/SoundManager";
import GuideManager from "../../manager/GuideManager";
import GuideEvent from "../../event/GuideEvent";
import StringUtils from "../../../../framework/utils/StringUtils";
import GuideConst from "../../consts/GuideConst";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import Message from "../../../../framework/common/Message";
import UserEvent from "../../event/UserEvent";
import UserExtModel from "../../model/UserExtModel";
import Client from "../../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import BattleServer from "../../server/BattleServer";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ButtonExpand from "../../../../framework/components/ButtonExpand";
import DataResourceConst from "../../consts/DataResourceConst";
import BaseContainer from "../../../../framework/components/BaseContainer";
import LabelExpand from "../../../../framework/components/LabelExpand";
import UIBaseView from "../../../../framework/components/UIBaseView";

export default class GameMainUI extends UIBaseView  {

    /**体力回复倒计时计时器 */
    private powerAddTimer: number;
    /**最大体力 */
    private maxSp: number = 0;
    /**当前体力 */
    private _nowPower: number;
    /**下一次恢复体力需要的时间  （秒） */
    private _addPowerNeedTime: number = -1;

    public  startBtn:ButtonExpand;
    public  stageSelectBtn:ButtonExpand;
    public  freePowerBtn:ButtonExpand;
    public  coinGroup:BaseContainer;
    public  goldGroup:BaseContainer;
    public  spGroup:BaseContainer;
    public  powerTimerLab:LabelExpand;
    public  powerCountLab:LabelExpand;
    public  coinNum:LabelExpand;
    public  goldNum:LabelExpand;


    constructor() {
        super();
        this.addEvent();
        StatisticsManager.onLoadingLog();
        TimerManager.instance.setTimeout(() => {
            SubPackageManager.loadSubPackage(SubPackageConst.packName_share);
        }, this, 2000);

        new ButtonUtils(this.startBtn, this.onGameStartBtnClick, this);
        new ButtonUtils(this.stageSelectBtn, this.onSelectStageClick, this);
        new ButtonUtils(this.freePowerBtn, this.onFreePowerClick, this).setBtnType(ButtonConst.BUTTON_TYPE_4);;

        this.maxSp = GlobalParamsFunc.instance.getDataNum('maxSp');

        ScreenAdapterTools.alignNotch(this.coinGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.goldGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.spGroup, ScreenAdapterTools.Align_MiddleTop);
        ScreenAdapterTools.alignNotch(this.powerTimerLab, ScreenAdapterTools.Align_MiddleTop);


        LevelFunc.instance.loadLevel();

    }
    /**添加事件监听 */
    addEvent() {
        Message.instance.add(UserEvent.USER_SP_CHANGE, this);
    }

    public setData(): void {

        // BattleSceneManager.instance.enterBattle({ roleId: 1, levelId: 1 });
        // SoundManager.playBGM(MusicConst.SOUND_MAIN_BG);
        this.refreshCoin();
        // 初始化体力字段
        this.countPower();
    }
    countPower() {
        //否则计算体力 体力 = 服务器告诉的体力 + (当前服务器时间上次 - 上次服务器刷新体力的时间) / 体力恢复间隔   如果算出来的值比最大的大 则体力等于表里的最大值 即回满了
        this._nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / GlobalParamsFunc.instance.getDataNum('spRestoreTime'));
        if (UserExtModel.instance.getLastFreshPower() > this.maxSp) {
            //如果服务器告诉的体力大于最大的  则体力等于服务器给的
            this._nowPower = UserExtModel.instance.getLastFreshPower();
        } else if (this._nowPower > this.maxSp) {
            this._nowPower = this.maxSp;
        }
        this._addPowerNeedTime = UserExtModel.instance.getNextPowerRestoreTime();
        //刷新文本
        this.powerCountLab.changeText(this._nowPower + "");
        if (this._nowPower < this.maxSp) {
            //体力不满时 显示刷新倒计时
            this.showPowerFreshTimer();
        } else {
            this.hidePowerFreshTimer();
        }
        this.freshPower();

        if (this.freePowerBtn) {
            if (this._nowPower && this.freePowerBtn.visible) {
                this.freePowerBtn.visible = false;
            }
            else if (!this._nowPower && !this.freePowerBtn.visible) {
                var freeSpType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
                //没有视频或者分享，加体力按钮隐藏
                if (freeSpType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
                    this.freePowerBtn.visible = true;
                }
            }
        }
    }
    /**
     * 刷新体力
     */
    showPowerFreshTimer() {
        this.powerTimerLab.visible = true;
        this.powerTimerLab.changeText(StringUtils.convertTime(this._addPowerNeedTime, 1, false, false));
    }
    /**
     * 隐藏体力
     */
    hidePowerFreshTimer() {
        this.powerTimerLab.visible = false;
    }

    //刷新体力显示			获得焦点时需要立即调用一次
    freshPower() {
        //如果体力不是满的了 则启动回复体力的计时器
        if (this._nowPower < this.maxSp) {
            if (!this.powerAddTimer) {
                this.powerAddTimer = TimerManager.instance.add(this.countPower, this, 1000);   //每秒计算一次体力
            }
        } else {
            //满了就停止计时器
            if (this.powerAddTimer) {
                TimerManager.instance.remove(this.powerAddTimer);
            }
        }
    }

    clearSubGuide(e, restart?) {
        // Laya.timer.clear(this, this.checkSubGuide);
        // if (GuideManager.ins.nowGuideId == 10001) {
        //     WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        // }
        // if (restart) {
        //     Laya.timer.loop(8000, this, this.checkSubGuide);
        // }
    }

    checkSubGuide() {
        // if (!WindowManager.isUIOpened(WindowCfgs.GameMainUI)) return;
        // if (WindowManager.isUIOpened(WindowCfgs.GuideUI)) return;
        // var guideStep = UserModel.instance.getMainGuide();
        // if (guideStep > 8) {
        //     GuideManager.ins.setGuideData(GuideConst.GUIDE_GAMEMAIN_10001, GuideManager.GuideType.Static, this.startBtn, this);//新手引导8-1：进入关卡
        //     GuideManager.ins.openGuideUI(GuideConst.GUIDE_GAMEMAIN_10001);
        // }
    }

    //主界面检测引导进度
    checkGuide() {
        // WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        // if (!WindowManager.isUIOpened(WindowCfgs.GameMainUI)) return;
        // var guideStep = UserModel.instance.getMainGuide();
        // if (guideStep == 0) {
        //     // GuideManager.ins.guideFin(GuideConst.GUIDE_BATTLE_1, this.checkGuide, this, true);
        //     BattleSceneManager.instance.enterBattle({ roleId: UserModel.instance.getRole(), levelId: 1 });
        //     return;
        // }
        // if (guideStep == 1 || guideStep == 2) {
        //     var instances = MergeManager.ins.controller.getAllInstance();
        //     if (instances.length != 1) {
        //         GuideManager.ins.guideFin(GuideConst.GUIDE_GAMEMAIN_801, null, this, true);
        //         return;
        //     }
        //     else {
        //         if (instances[0] && instances[0].getData()) {
        //             var data = instances[0].getData();
        //             if (!data.id || data.id != "1") {
        //                 GuideManager.ins.guideFin(GuideConst.GUIDE_GAMEMAIN_801, null, this, true);
        //                 return;
        //             }
        //         }
        //     }

        // }
        // var GuideType = GuideManager.GuideType;
        // var param;
        // switch (guideStep) {
        //     case 1:
        //         break;
        //     case 2:
        //         break;
        //     default:
        //         // WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
        //         break;
        // }
    }


    public refreshCoin() {
        this.coinNum.text = StringUtils.getCoinStr(UserModel.instance.getDisplayCoin());
        this.goldNum.text = StringUtils.getCoinStr(UserModel.instance.getGold());
    }

    private onGameStartBtnClick() {
        if (!LevelFunc.instance.getLevel()) {
            return;
        }

        if (this._nowPower < GlobalParamsFunc.instance.getDataNum('levelSpCost')) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_power_01"));
            return;
        }

        // SoundManager.playSE(MusicConst.SOUND_START_RACE);
        SoundManager.stopMusic();
        var nextLevel = Number(UserModel.instance.getMaxBattleLevel()) + 1;
        if (nextLevel > LevelFunc.instance.getMaxLevel()) {
            nextLevel = LevelFunc.instance.getMaxLevel();
        }

        var allInfo = LevelFunc.instance.getLevel();
        var info: Array<any> = allInfo.scenes[0].level;
        var levelNum = 0;
        for (var index in info) {
            levelNum++;
        }

        BattleServer.battleStart(null, this);
        BattleSceneManager.instance.enterBattle({ levelId: Math.min(nextLevel, levelNum) });
        // WindowManager.OpenUI(WindowCfgs.BattleResultUI, {
        //     levelId: (Number(UserModel.instance.getMaxBattleLevel()) + 1),
        //     rank:
        //         [{ id: "1", rank: 1, isRole: true },
        //         { id: "1002", rank: 2, isRole: false },
        //         { id: "1003", rank: 3, isRole: false }]
        // });
    }

    private onSelectStageClick() {
        if (!LevelFunc.instance.getLevel()) {
            return;
        }
        WindowManager.SwitchUI(WindowCfgs.StageSelectUI, WindowCfgs.GameMainUI);
    }

    private onFreePowerClick() {
        var freeSpType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
        //没有视频或者分享，加体力按钮隐藏
        if (freeSpType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            WindowManager.ShowTip("功能暂未开启");
            return;
        }

        WindowManager.OpenUI(WindowCfgs.FreePowerUI, { type: DataResourceConst.SP });
    }

    onClose() {

    }

    /***********************************************红点相关 *********************************************************/
    refreshAllRed() {
        // this.refreshGunTabRed();
    }
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            case GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY:
                this.refreshCoin();
                break;
            case GuideEvent.GUIDEEVENT_CHECKGUIDE:
                this.checkGuide();
                break;
        }

    }
}


