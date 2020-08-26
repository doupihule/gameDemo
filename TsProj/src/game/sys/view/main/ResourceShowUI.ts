import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import UserModel from "../../model/UserModel";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import IMessage from "../../interfaces/IMessage";
import UserExtModel from "../../model/UserExtModel";
import Client from "../../../../framework/common/kakura/Client";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import GameUtils from "../../../../utils/GameUtils";
import TimerManager from "../../../../framework/manager/TimerManager";
import UserEvent from "../../event/UserEvent";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { DataResourceType } from "../../func/DataResourceFunc";
import UserInfo from "../../../../framework/common/UserInfo";
import LogsManager from "../../../../framework/manager/LogsManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";

/**管理主要资源的展示 */
export class ResourceShowUI implements IMessage {
    private coinNum: Laya.Label;
    private goldNum: Laya.Label;
    private powerCountLab: Laya.Label;
    private powerTimerLab: Laya.Label;
    private addCoinBtn: Laya.Image;
    private addGoldBtn: Laya.Image;
    private addSpBtn: Laya.Image;
    //体力相关
    private _nowPower;
    private _addPowerNeedTime;
    private maxSp;
    private powerAddTimer;
    private spRestoreTime;
    constructor(coinNum, goldNum, powerCountLab, powerTimerLab, addCoinBtn, addGoldBtn, addSpBtn) {
        this.coinNum = coinNum;
        this.goldNum = goldNum;
        this.powerCountLab = powerCountLab;
        this.powerTimerLab = powerTimerLab;
        this.addCoinBtn = addCoinBtn;
        this.addGoldBtn = addGoldBtn;
        this.addSpBtn = addSpBtn;
        this.spRestoreTime = GlobalParamsFunc.instance.getDataNum('spRestoreTime');
        //最大体力
        this.maxSp = GlobalParamsFunc.instance.getDataNum('maxSp');
        this.addEvent();
        this.initBtn();
        if (this.addSpBtn) {
            this.countPower();
            this.powerAlarm();
        }
        return this;

    }
    addEvent() {
        Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
        Message.instance.add(UserEvent.USER_SP_CHANGE, this);
    }
    initBtn() {
        new ButtonUtils(this.addCoinBtn, this.onTurnableBtnClick, this);
        new ButtonUtils(this.addGoldBtn, this.onTurnableBtnClick, this);
        if (this.addSpBtn) {
            //加体力
            var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FREE_SP);
            if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
                this.addSpBtn.visible = false;
            } else {
                this.addSpBtn.visible = true;
                new ButtonUtils(this.addSpBtn, this.onAddSpClick, this);
            }
        }

    }
    //货币刷新
    public refreshMoney() {
        this.coinNum.changeText(StringUtils.getCoinStr(UserModel.instance.getCoin()));
        this.goldNum.changeText(StringUtils.getCoinStr(UserModel.instance.getGold()));
    }
    //体力初始化
    public countPower() {
        //否则计算体力 体力 = 服务器告诉的体力 + (当前服务器时间上次 - 上次服务器刷新体力的时间) / 体力恢复间隔   如果算出来的值比最大的大 则体力等于表里的最大值 即回满了
        this._nowPower = UserExtModel.instance.getLastFreshPower() + Math.floor((Client.instance.serverTime - UserExtModel.instance.getLastPowerFreshTime()) / this.spRestoreTime);
        if (UserExtModel.instance.getLastFreshPower() > this.maxSp) {
            this._nowPower = UserExtModel.instance.getLastFreshPower();
        } else if (this._nowPower > this.maxSp) {
            this._nowPower = this.maxSp;
        } else if (this._nowPower < 0) {
            this._nowPower = 0
        }
        this._addPowerNeedTime = UserExtModel.instance.getNextPowerRestoreTime();
        //刷新文本
        this.powerCountLab.changeText(this._nowPower + "/" + this.maxSp);
        if (this._nowPower < this.maxSp) {
            //体力不满时 显示刷新倒计时
            this.showPowerFreshTimer();
        } else {
            this.hidePowerFreshTimer();
        }
        this.freshPower();
    }
    /**
     * 刷新体力
     */
    showPowerFreshTimer() {
        this.powerTimerLab.visible = true;
        this.powerTimerLab.changeText(GameUtils.convertTime(this._addPowerNeedTime, 1, false, false));
    }
    /**
     * 隐藏体力
     */
    hidePowerFreshTimer() {
        this.powerTimerLab.visible = false;
    }

    //刷新体力显示,获得焦点时需要立即调用一次
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
    onAddSpClick() {
        WindowManager.OpenUI(WindowCfgs.FreeResourceUI, { type: DataResourceType.SP });
    }
    //转盘按钮
    onTurnableBtnClick() {
        WindowManager.OpenUI(WindowCfgs.TurnableUI);
    }
    recvMsg(cmd: string, data: any) {
        if (cmd == GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY) {
            this.refreshMoney();
        }//体力刷新
        else if (cmd == UserEvent.USER_SP_CHANGE) {
            if (this.addSpBtn) {
                this.countPower();
                this.powerAlarm();
            }

        }
    }

    powerAlarm() {
        if (this.maxSp > this._nowPower) {
            var alarmTime = UserExtModel.instance.getNextPowerRestoreTime() + GlobalParamsFunc.instance.getDataNum('spRestoreTime') * (this.maxSp - this._nowPower - 1);
            LogsManager.echo("krma. needAlarm", alarmTime)
            UserInfo.platform.pushMessage(alarmTime, "1", TranslateFunc.instance.getTranslate("#tid_alarm_title"), TranslateFunc.instance.getTranslate("#tid_alarm_sub"), TranslateFunc.instance.getTranslate("#tid_alarm_body"));
        }
    }

}