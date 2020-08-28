"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceShowUI = void 0;
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const UserModel_1 = require("../../model/UserModel");
const Message_1 = require("../../../../framework/common/Message");
const GameMainEvent_1 = require("../../event/GameMainEvent");
const UserExtModel_1 = require("../../model/UserExtModel");
const Client_1 = require("../../../../framework/common/kakura/Client");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const GameUtils_1 = require("../../../../utils/GameUtils");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const UserEvent_1 = require("../../event/UserEvent");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const LogsManager_1 = require("../../../../framework/manager/LogsManager");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
/**管理主要资源的展示 */
class ResourceShowUI {
    constructor(coinNum, goldNum, powerCountLab, powerTimerLab, addCoinBtn, addGoldBtn, addSpBtn) {
        this.coinNum = coinNum;
        this.goldNum = goldNum;
        this.powerCountLab = powerCountLab;
        this.powerTimerLab = powerTimerLab;
        this.addCoinBtn = addCoinBtn;
        this.addGoldBtn = addGoldBtn;
        this.addSpBtn = addSpBtn;
        this.spRestoreTime = GlobalParamsFunc_1.default.instance.getDataNum('spRestoreTime');
        //最大体力
        this.maxSp = GlobalParamsFunc_1.default.instance.getDataNum('maxSp');
        this.addEvent();
        this.initBtn();
        if (this.addSpBtn) {
            this.countPower();
            this.powerAlarm();
        }
        return this;
    }
    addEvent() {
        Message_1.default.instance.add(GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY, this);
        Message_1.default.instance.add(UserEvent_1.default.USER_SP_CHANGE, this);
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.addCoinBtn, this.onTurnableBtnClick, this);
        new ButtonUtils_1.ButtonUtils(this.addGoldBtn, this.onTurnableBtnClick, this);
        if (this.addSpBtn) {
            //加体力
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FREE_SP);
            if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                this.addSpBtn.visible = false;
            }
            else {
                this.addSpBtn.visible = true;
                new ButtonUtils_1.ButtonUtils(this.addSpBtn, this.onAddSpClick, this);
            }
        }
    }
    //货币刷新
    refreshMoney() {
        this.coinNum.changeText(StringUtils_1.default.getCoinStr(UserModel_1.default.instance.getCoin()));
        this.goldNum.changeText(StringUtils_1.default.getCoinStr(UserModel_1.default.instance.getGold()));
    }
    //体力初始化
    countPower() {
        //否则计算体力 体力 = 服务器告诉的体力 + (当前服务器时间上次 - 上次服务器刷新体力的时间) / 体力恢复间隔   如果算出来的值比最大的大 则体力等于表里的最大值 即回满了
        this._nowPower = UserExtModel_1.default.instance.getLastFreshPower() + Math.floor((Client_1.default.instance.serverTime - UserExtModel_1.default.instance.getLastPowerFreshTime()) / this.spRestoreTime);
        if (UserExtModel_1.default.instance.getLastFreshPower() > this.maxSp) {
            this._nowPower = UserExtModel_1.default.instance.getLastFreshPower();
        }
        else if (this._nowPower > this.maxSp) {
            this._nowPower = this.maxSp;
        }
        else if (this._nowPower < 0) {
            this._nowPower = 0;
        }
        this._addPowerNeedTime = UserExtModel_1.default.instance.getNextPowerRestoreTime();
        //刷新文本
        this.powerCountLab.changeText(this._nowPower + "/" + this.maxSp);
        if (this._nowPower < this.maxSp) {
            //体力不满时 显示刷新倒计时
            this.showPowerFreshTimer();
        }
        else {
            this.hidePowerFreshTimer();
        }
        this.freshPower();
    }
    /**
     * 刷新体力
     */
    showPowerFreshTimer() {
        this.powerTimerLab.visible = true;
        this.powerTimerLab.changeText(GameUtils_1.default.convertTime(this._addPowerNeedTime, 1, false, false));
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
                this.powerAddTimer = TimerManager_1.default.instance.add(this.countPower, this, 1000); //每秒计算一次体力
            }
        }
        else {
            //满了就停止计时器
            if (this.powerAddTimer) {
                TimerManager_1.default.instance.remove(this.powerAddTimer);
            }
        }
    }
    onAddSpClick() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FreeResourceUI, { type: DataResourceFunc_1.DataResourceType.SP });
    }
    //转盘按钮
    onTurnableBtnClick() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI);
    }
    recvMsg(cmd, data) {
        if (cmd == GameMainEvent_1.default.GAMEMAIN_EVENT_FRESHMONEY) {
            this.refreshMoney();
        } //体力刷新
        else if (cmd == UserEvent_1.default.USER_SP_CHANGE) {
            if (this.addSpBtn) {
                this.countPower();
                this.powerAlarm();
            }
        }
    }
    powerAlarm() {
        if (this.maxSp > this._nowPower) {
            var alarmTime = UserExtModel_1.default.instance.getNextPowerRestoreTime() + GlobalParamsFunc_1.default.instance.getDataNum('spRestoreTime') * (this.maxSp - this._nowPower - 1);
            LogsManager_1.default.echo("krma. needAlarm", alarmTime);
            UserInfo_1.default.platform.pushMessage(alarmTime, "1", TranslateFunc_1.default.instance.getTranslate("#tid_alarm_title"), TranslateFunc_1.default.instance.getTranslate("#tid_alarm_sub"), TranslateFunc_1.default.instance.getTranslate("#tid_alarm_body"));
        }
    }
}
exports.ResourceShowUI = ResourceShowUI;
//# sourceMappingURL=ResourceShowUI.js.map